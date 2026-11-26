import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  liveCoachModeToSubjectId,
  useActiveLiveCoachEntry,
  type LiveCoachMode,
} from '../context/LiveCoachContext';
import {
  buildAgricCoachSystemPrompt,
  buildBiologyCoachSystemPrompt,
  buildCivicCoachSystemPrompt,
  buildDataProcCoachSystemPrompt,
  buildDigiTechCoachSystemPrompt,
  buildEconomicsCoachSystemPrompt,
  buildEnglishCoachSystemPrompt,
  buildFMathCoachSystemPrompt,
  buildGeogCoachSystemPrompt,
  buildMadScientistSystemPrompt,
  buildMathCoachSystemPrompt,
  buildPhysicsCoachSystemPrompt,
  float32ToPcm16Base64,
  pcm16Base64ToFloat32,
} from '../utils/chemVoiceLogic';
import { SUBJECT_TUTOR_REGISTRY } from '../utils/tutorRegistry';
import {
  LIVE_POS_STORAGE_KEY,
  clampLivePos,
  computeDefaultLivePos,
  computePopoverPlacement,
  hasExceededDragThreshold,
  livePosToRatio,
  nudgeLivePos,
  ratioToLivePos,
  type LivePoint,
  type LiveRatio,
} from '../utils/liveDragLogic';
import { sfx, startTeacherCallRing } from '../utils/sound';
import { Icon } from './Icons';

type LiveStatus = 'closed' | 'connecting' | 'ready';

function formatCallDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface TranscriptTurn {
  id: number;
  who: 'you' | 'prof';
  text: string;
}

const DEFAULT_PILL_W = 108;
const DEFAULT_PILL_H = 38;
const PANEL_W = 372;
const PANEL_EST_H = 414;

function readInitialPos(): { pos: LivePoint; ratio: LiveRatio | null } {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(LIVE_POS_STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LiveRatio>;
      if (
        typeof parsed.rx === 'number' &&
        Number.isFinite(parsed.rx) &&
        typeof parsed.ry === 'number' &&
        Number.isFinite(parsed.ry)
      ) {
        const ratio: LiveRatio = {
          rx: Math.min(1, Math.max(0, parsed.rx)),
          ry: Math.min(1, Math.max(0, parsed.ry)),
        };
        return {
          pos: ratioToLivePos(ratio, vw, vh, vw < 640 ? 42 : DEFAULT_PILL_W, DEFAULT_PILL_H),
          ratio,
        };
      }
    }
  } catch {
    /* ignore storage errors */
  }
  const initW = vw < 640 ? 42 : DEFAULT_PILL_W;
  return {
    pos: computeDefaultLivePos(vw, vh, initW, DEFAULT_PILL_H),
    ratio: null,
  };
}

export function FloatingLiveCoach({ muted = false }: { muted?: boolean }) {
  const activeEntry = useActiveLiveCoachEntry();
  const { context, mode, stepKey } = activeEntry;
  const activeSubjId = liveCoachModeToSubjectId(mode);
  const activeTutorMeta = SUBJECT_TUTOR_REGISTRY[activeSubjId];
  const coachName = activeTutorMeta.tutorName;

  // ── Draggable Position & Measured Size State ──
  const initDrag = useRef(readInitialPos()).current;
  const [pos, setPos] = useState<LivePoint>(initDrag.pos);
  const ratioRef = useRef<LiveRatio | null>(initDrag.ratio);
  const [isDragging, setIsDragging] = useState(false);
  const [viewport, setViewport] = useState<{ w: number; h: number }>(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1440,
    h: typeof window !== 'undefined' ? window.innerHeight : 900,
  }));
  const [pillSize, setPillSize] = useState<{ w: number; h: number }>({
    w: DEFAULT_PILL_W,
    h: DEFAULT_PILL_H,
  });
  const [panelHeight, setPanelHeight] = useState<number>(PANEL_EST_H);

  const pillRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const suppressNextClickRef = useRef(false);
  const dragSessionRef = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    originX: number;
    originY: number;
    pillW: number;
    pillH: number;
    exceeded: boolean;
  } | null>(null);

  // ── Live API Session State ──
  const [liveOpen, setLiveOpen] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [liveStatus, setLiveStatus] = useState<LiveStatus>('closed');
  const [micActive, setMicActive] = useState(false);
  const [profSpeaking, setProfSpeaking] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [promptInput, setPromptInput] = useState('');
  const [transcripts, setTranscripts] = useState<TranscriptTurn[]>([]);
  const [callSeconds, setCallSeconds] = useState(0);
  const [speakerMuted, setSpeakerMuted] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const connectedModeRef = useRef<LiveCoachMode>(mode);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const micActiveRef = useRef(false);
  const nextStartTimeRef = useRef(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const turnIdRef = useRef(1);
  const retryTimerRef = useRef<number | null>(null);
  const stopRingRef = useRef<(() => void) | null>(null);
  const meterBarsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const mutedLiveRef = useRef<boolean>(muted || speakerMuted);
  mutedLiveRef.current = muted || speakerMuted;

  const updateMeterBars = useCallback((rms: number) => {
    const clamped = Math.min(1, Math.max(0.12, rms * 4.2));
    const weights = [0.55, 1, 0.8, 0.6];
    for (let i = 0; i < 4; i++) {
      const el = meterBarsRef.current[i];
      if (el) {
        const scale = Math.min(1, Math.max(0.22, clamped * weights[i]));
        el.style.transform = `scaleY(${scale.toFixed(2)})`;
      }
    }
  }, []);

  // Track exact pill dimensions as it switches between "Go Live" and active pill states
  useLayoutEffect(() => {
    const el = pillRef.current;
    if (!el) return;
    const updateSize = () => {
      const w = el.offsetWidth || DEFAULT_PILL_W;
      const h = el.offsetHeight || DEFAULT_PILL_H;
      setPillSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    updateSize();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateSize);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [liveOpen, panelExpanded, liveStatus, mode, profSpeaking]);

  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!liveOpen || !panelExpanded || !el) return;
    const syncHeight = () => {
      const h = el.offsetHeight || PANEL_EST_H;
      setPanelHeight((prev) => (prev === h ? prev : h));
    };
    syncHeight();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(syncHeight);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [liveOpen, panelExpanded, liveStatus, transcripts.length, liveError, viewport.w]);

  // Keep pill clamped cleanly on viewport resize
  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setViewport({ w: vw, h: vh });
      const pw = pillRef.current?.offsetWidth || DEFAULT_PILL_W;
      const ph = pillRef.current?.offsetHeight || DEFAULT_PILL_H;
      setPos(() => {
        if (ratioRef.current) {
          return ratioToLivePos(ratioRef.current, vw, vh, pw, ph);
        }
        return computeDefaultLivePos(vw, vh, pw, ph);
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const persistPos = useCallback((nextPos: LivePoint, pw: number, ph: number) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const ratio = livePosToRatio(nextPos, vw, vh, pw, ph);
    ratioRef.current = ratio;
    try {
      window.localStorage.setItem(LIVE_POS_STORAGE_KEY, JSON.stringify(ratio));
    } catch {
      /* ignore */
    }
  }, []);

  // Always clamp effective render position to current pill dimensions so wider active pills never clip off-screen
  const effectivePos = clampLivePos(pos, viewport.w, viewport.h, pillSize.w, pillSize.h);

  // Window-level pointer listeners guarantee fast drags never drop events outside the button bounds
  useEffect(() => {
    const onWinPointerMove = (e: PointerEvent) => {
      const sess = dragSessionRef.current;
      if (!sess || sess.pointerId !== e.pointerId) return;

      if (!sess.exceeded) {
        if (!hasExceededDragThreshold(sess.startClientX, sess.startClientY, e.clientX, e.clientY)) {
          return;
        }
        sess.exceeded = true;
        suppressNextClickRef.current = true;
        setIsDragging(true);
      }

      e.preventDefault();
      const dx = e.clientX - sess.startClientX;
      const dy = e.clientY - sess.startClientY;
      const clamped = clampLivePos(
        { x: sess.originX + dx, y: sess.originY + dy },
        window.innerWidth,
        window.innerHeight,
        sess.pillW,
        sess.pillH
      );
      setPos(clamped);
    };

    const onWinPointerEnd = (e: PointerEvent) => {
      const sess = dragSessionRef.current;
      if (!sess || sess.pointerId !== e.pointerId) return;
      dragSessionRef.current = null;

      if (sess.exceeded) {
        setIsDragging(false);
        const dx = e.clientX - sess.startClientX;
        const dy = e.clientY - sess.startClientY;
        const pw = pillRef.current?.offsetWidth || sess.pillW;
        const ph = pillRef.current?.offsetHeight || sess.pillH;
        const finalPos = clampLivePos(
          { x: sess.originX + dx, y: sess.originY + dy },
          window.innerWidth,
          window.innerHeight,
          pw,
          ph
        );
        setPos(finalPos);
        persistPos(finalPos, pw, ph);
        // Clear click suppression after current event loop tick in case click doesn't fire on outside release
        window.setTimeout(() => {
          suppressNextClickRef.current = false;
        }, 80);
      }
    };

    window.addEventListener('pointermove', onWinPointerMove, { passive: false });
    window.addEventListener('pointerup', onWinPointerEnd);
    window.addEventListener('pointercancel', onWinPointerEnd);
    return () => {
      window.removeEventListener('pointermove', onWinPointerMove);
      window.removeEventListener('pointerup', onWinPointerEnd);
      window.removeEventListener('pointercancel', onWinPointerEnd);
    };
  }, [persistPos]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      const pw = pillRef.current?.offsetWidth || pillSize.w;
      const ph = pillRef.current?.offsetHeight || pillSize.h;
      suppressNextClickRef.current = false;
      dragSessionRef.current = {
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        originX: effectivePos.x,
        originY: effectivePos.y,
        pillW: pw,
        pillH: ph,
        exceeded: false,
      };
    },
    [effectivePos.x, effectivePos.y, pillSize.h, pillSize.w]
  );

  const handleKeyDownNudge = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (!e.altKey && !e.shiftKey) return;
      const pw = pillRef.current?.offsetWidth || pillSize.w;
      const ph = pillRef.current?.offsetHeight || pillSize.h;
      const next = nudgeLivePos(effectivePos, e.key, window.innerWidth, window.innerHeight, pw, ph);
      if (next) {
        e.preventDefault();
        setPos(next);
        persistPos(next, pw, ph);
      }
    },
    [effectivePos, persistPos, pillSize.h, pillSize.w]
  );

  // ── Audio & WebSocket Lifecycle ──
  const stopMicCapture = useCallback(() => {
    micActiveRef.current = false;
    setMicActive(false);
    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch {
        /* ignore */
      }
      processorRef.current.onaudioprocess = null;
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (inputCtxRef.current) {
      inputCtxRef.current.close().catch(() => {});
      inputCtxRef.current = null;
    }
  }, []);

  const clearScheduledLiveAudio = useCallback(() => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch {
        /* ignore */
      }
    });
    activeSourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    setProfSpeaking(false);
  }, []);

  const stopCallRinging = useCallback(() => {
    if (stopRingRef.current) {
      stopRingRef.current();
      stopRingRef.current = null;
    }
  }, []);

  const closeLiveSession = useCallback(() => {
    stopCallRinging();
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    stopMicCapture();
    clearScheduledLiveAudio();
    if (wsRef.current) {
      const prevWs = wsRef.current;
      wsRef.current = null;
      prevWs.onopen = null;
      prevWs.onmessage = null;
      prevWs.onerror = null;
      prevWs.onclose = null;
      try {
        prevWs.close();
      } catch {
        /* ignore */
      }
    }
    if (outputCtxRef.current) {
      outputCtxRef.current.close().catch(() => {});
      outputCtxRef.current = null;
    }
    setLiveStatus('closed');
  }, [clearScheduledLiveAudio, stopCallRinging, stopMicCapture]);

  useEffect(() => {
    return () => {
      closeLiveSession();
    };
  }, [closeLiveSession]);

  // Listen for TTS starting elsewhere so Live playback yields cleanly
  useEffect(() => {
    const onClearLive = () => {
      clearScheduledLiveAudio();
    };
    window.addEventListener('rtc:clear-live-audio', onClearLive);
    return () => window.removeEventListener('rtc:clear-live-audio', onClearLive);
  }, [clearScheduledLiveAudio]);

  useEffect(() => {
    if (muted || speakerMuted) {
      stopCallRinging();
      clearScheduledLiveAudio();
    }
  }, [muted, speakerMuted, clearScheduledLiveAudio, stopCallRinging]);

  // Live call elapsed timer while connected to the teacher
  useEffect(() => {
    if (!liveOpen || liveStatus !== 'ready') {
      if (!liveOpen) setCallSeconds(0);
      return;
    }
    const id = window.setInterval(() => {
      setCallSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [liveOpen, liveStatus]);

  const appendTranscript = useCallback((who: 'you' | 'prof', chunk: string) => {
    const clean = chunk.trim();
    if (!clean) return;
    setTranscripts((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.who === who) {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...last,
          text: `${last.text} ${clean}`.replace(/\s+/g, ' ').trim(),
        };
        return updated.slice(-8);
      }
      return [...prev.slice(-7), { id: turnIdRef.current++, who, text: clean }];
    });
  }, []);

  const schedulePcm24kChunk = useCallback((base64Pcm: string) => {
    if (mutedLiveRef.current) return;
    if (!outputCtxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      outputCtxRef.current = new AC({ sampleRate: 24000 });
    }
    const ctx = outputCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const floatSamples = pcm16Base64ToFloat32(base64Pcm);
    if (!floatSamples.length) return;

    let sumSq = 0;
    const step = Math.max(1, Math.floor(floatSamples.length / 64));
    let count = 0;
    for (let i = 0; i < floatSamples.length; i += step) {
      sumSq += floatSamples[i] * floatSamples[i];
      count += 1;
    }
    updateMeterBars(count > 0 ? Math.sqrt(sumSq / count) : 0.25);

    const audioBuffer = ctx.createBuffer(1, floatSamples.length, 24000);
    audioBuffer.getChannelData(0).set(floatSamples);

    const src = ctx.createBufferSource();
    src.buffer = audioBuffer;
    src.connect(ctx.destination);

    const startAt = Math.max(ctx.currentTime + 0.02, nextStartTimeRef.current);
    nextStartTimeRef.current = startAt + audioBuffer.duration;
    activeSourcesRef.current.add(src);
    setProfSpeaking(true);

    src.onended = () => {
      activeSourcesRef.current.delete(src);
      if (activeSourcesRef.current.size === 0) {
        setProfSpeaking(false);
        updateMeterBars(0.12);
      }
    };

    src.start(startAt);
  }, [updateMeterBars]);

  const startLiveSession = useCallback(
    (targetMode: LiveCoachMode = mode, opts?: { preserveExpanded?: boolean; retryAttempt?: number }) => {
      const retryAttempt = opts?.retryAttempt ?? 0;
      window.dispatchEvent(new CustomEvent('rtc:stop-tts'));
      closeLiveSession();
      setLiveError(null);
      if (retryAttempt === 0) {
        setTranscripts([]);
        setCallSeconds(0);
        stopRingRef.current = startTeacherCallRing(mutedLiveRef.current);
      }
      setLiveOpen(true);
      if (!opts?.preserveExpanded) {
        setPanelExpanded(true);
      }
      setLiveStatus('connecting');
      connectedModeRef.current = targetMode;

      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AC) {
        outputCtxRef.current = new AC({ sampleRate: 24000 });
      }

      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${proto}//${window.location.host}/api/chem/live`);
      wsRef.current = ws;

      const targetSubjId = liveCoachModeToSubjectId(targetMode);
      const targetMeta = SUBJECT_TUTOR_REGISTRY[targetSubjId];
      ws.onopen = () => {
        if (wsRef.current !== ws) return;
        const systemInstruction =
          targetSubjId === 'dataproc'
            ? buildDataProcCoachSystemPrompt(context)
            : targetSubjId === 'digitech'
              ? buildDigiTechCoachSystemPrompt(context)
              : targetSubjId === 'civic'
                ? buildCivicCoachSystemPrompt(context)
                : targetSubjId === 'eng'
                  ? buildEnglishCoachSystemPrompt(context)
                  : targetSubjId === 'econ'
                    ? buildEconomicsCoachSystemPrompt(context)
                    : targetSubjId === 'geog'
                      ? buildGeogCoachSystemPrompt(context)
                      : targetSubjId === 'agric'
                        ? buildAgricCoachSystemPrompt(context)
                        : targetSubjId === 'bio'
                          ? buildBiologyCoachSystemPrompt(context)
                          : targetSubjId === 'phys'
                            ? buildPhysicsCoachSystemPrompt(context)
                            : targetSubjId === 'fmaths'
                              ? buildFMathCoachSystemPrompt(context)
                              : targetSubjId === 'maths'
                                ? buildMathCoachSystemPrompt(context)
                                : targetSubjId === 'chem'
                                  ? buildMadScientistSystemPrompt(context)
                                  : `You are an experienced Nigerian ${targetMeta.name} (${targetMeta.roleTitle}) coaching a student preparing for JAMB UTME and WAEC/NECO. ${targetMeta.voiceStyle} Current topic: "${context.topicName}" (${context.partTitle || 'Overview'}). Context: ${context.stepText}. Keep answers plain, clear, warm, accurate, and grounded in Nigerian examples. NEVER introduce yourself by name or welcome the student to a studio — jump straight into teaching.`;
        const greetPrompt = `Do NOT introduce yourself, state your name, or welcome the student to any studio. Jump straight into "${context.topicName}" (${context.partTitle || 'current view'}) in 1–2 crisp, helpful sentences and ask what part they want to tackle right now.`;
        ws.send(
          JSON.stringify({
            type: 'init',
            voiceProfile: targetMode,
            systemInstruction,
            greetPrompt,
          })
        );
      };

      ws.onmessage = (ev) => {
        if (wsRef.current !== ws) return;
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === 'ready') {
            stopCallRinging();
            sfx('callConnect', mutedLiveRef.current);
            setLiveError(null);
            setLiveStatus('ready');
          } else if (msg.type === 'audio' && typeof msg.audio === 'string') {
            stopCallRinging();
            schedulePcm24kChunk(msg.audio);
          } else if (msg.type === 'inputTranscript' && typeof msg.text === 'string') {
            appendTranscript('you', msg.text);
          } else if (msg.type === 'outputTranscript' && typeof msg.text === 'string') {
            appendTranscript('prof', msg.text);
          } else if (msg.type === 'interrupted') {
            clearScheduledLiveAudio();
          } else if (msg.type === 'error' && typeof msg.error === 'string') {
            stopCallRinging();
            setLiveError(msg.error);
            setLiveStatus('closed');
          } else if (msg.type === 'closed') {
            stopCallRinging();
            setLiveStatus('closed');
            stopMicCapture();
          }
        } catch {
          /* ignore */
        }
      };

      ws.onerror = () => {
        if (wsRef.current !== ws) return;
        if (retryAttempt < 1) {
          retryTimerRef.current = window.setTimeout(() => {
            retryTimerRef.current = null;
            startLiveSession(targetMode, { preserveExpanded: true, retryAttempt: retryAttempt + 1 });
          }, 1200);
          return;
        }
        stopCallRinging();
        setLiveError('Connection lost. Check network and retry.');
        setLiveStatus('closed');
      };

      ws.onclose = () => {
        if (wsRef.current !== ws) return;
        if (retryTimerRef.current !== null) return;
        stopCallRinging();
        setLiveStatus('closed');
        stopMicCapture();
      };
    },
    [
      appendTranscript,
      clearScheduledLiveAudio,
      closeLiveSession,
      context,
      mode,
      schedulePcm24kChunk,
      stopCallRinging,
      stopMicCapture,
    ]
  );

  // Keep open Live session synced as user moves between screens/steps/subjects
  const prevStepKeyRef = useRef<string>(stepKey);
  useEffect(() => {
    if (prevStepKeyRef.current === stepKey && connectedModeRef.current === mode) return;
    prevStepKeyRef.current = stepKey;

    if (!liveOpen) return;

    // If user switched subject (Maths <-> Chemistry) while Live is active, reconnect with that subject's coach voice
    if (connectedModeRef.current !== mode && liveStatus !== 'closed') {
      startLiveSession(mode, { preserveExpanded: true });
      return;
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'context',
          speak: false,
          text: `[Screen context updated — Topic: "${context.topicName}" | Section: "${context.partTitle}" | Step: "${context.stepLabel || 'Active view'}" | Content: ${context.stepText.slice(0, 420)}]. Use this updated screen context for any upcoming student questions, and do NOT re-introduce yourself.`,
        })
      );
    }
  }, [
    context.partTitle,
    context.stepLabel,
    context.stepText,
    context.topicName,
    liveOpen,
    liveStatus,
    mode,
    startLiveSession,
    stepKey,
  ]);

  const toggleMicrophone = async () => {
    if (micActiveRef.current) {
      stopMicCapture();
      return;
    }
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setLiveError(`Connect to ${coachName} Live first.`);
      return;
    }

    try {
      setLiveError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) throw new Error('Web Audio API is not supported in this browser.');

      const inputCtx = new AC({ sampleRate: 16000 });
      inputCtxRef.current = inputCtx;
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      micActiveRef.current = true;
      setMicActive(true);

      processor.onaudioprocess = (e) => {
        if (!micActiveRef.current) return;
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        const chan = e.inputBuffer.getChannelData(0);
        let sumSq = 0;
        for (let i = 0; i < chan.length; i += 32) {
          sumSq += chan[i] * chan[i];
        }
        updateMeterBars(Math.sqrt(sumSq / Math.max(1, Math.ceil(chan.length / 32))));
        const pcmBase64 = float32ToPcm16Base64(chan);
        ws.send(JSON.stringify({ type: 'audio', data: pcmBase64 }));
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);
    } catch (err) {
      stopMicCapture();
      setLiveError(
        (err as Error).message?.includes('Permission')
          ? 'Mic blocked — type or tap a question below.'
          : 'Mic unavailable — type or tap a question below.'
      );
    }
  };

  const sendLivePrompt = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    window.dispatchEvent(new CustomEvent('rtc:stop-tts'));
    clearScheduledLiveAudio();
    turnIdRef.current += 1;
    setTranscripts((prev) => [
      ...prev.slice(-7),
      { id: turnIdRef.current++, who: 'you', text: trimmed },
    ]);
    wsRef.current.send(JSON.stringify({ type: 'text', text: trimmed }));
    setPromptInput('');
  };

  const endLiveCompletely = () => {
    closeLiveSession();
    sfx('callEnd', mutedLiveRef.current);
    setLiveOpen(false);
    setPanelExpanded(false);
    setCallSeconds(0);
  };

  const popoverPlacement = computePopoverPlacement(
    effectivePos,
    viewport.w,
    viewport.h,
    pillSize.w,
    pillSize.h,
    PANEL_W,
    panelHeight
  );

  return (
    <>
      {/* Expanded Floating Teacher Call Panel (smartly anchored inside viewport) */}
      {liveOpen && panelExpanded && (
        <section
          ref={panelRef}
          data-live-coach-dock="true"
          aria-label={`Live call with ${activeTutorMeta.tutorName}`}
          style={{
            transform: `translate3d(${popoverPlacement.left}px, ${popoverPlacement.top}px, 0)`,
          }}
          className="fixed top-0 left-0 z-50 w-[min(372px,calc(100vw-20px))] rounded-2xl bg-[#0F172A]/96 backdrop-blur-xl text-[#F8FAFC] border border-white/14 shadow-[0_24px_48px_-12px_rgba(2,6,23,0.65)] flex flex-col overflow-hidden"
        >
          {/* Draggable Teacher Call Header */}
          <div
            onPointerDown={handlePointerDown}
            className={`px-3.5 py-2.5 bg-white/[0.04] border-b border-white/10 flex items-center justify-between gap-2 select-none touch-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                aria-hidden="true"
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  liveStatus === 'ready'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/35'
                    : liveStatus === 'connecting'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/35'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-400/35'
                }`}
              >
                <Icon name={liveStatus === 'connecting' ? 'phoneCall' : 'phone'} size={15} />
              </span>
              <div className="min-w-0">
                <div className="text-[12.5px] font-bold text-white truncate flex items-center gap-1.5">
                  <span className="truncate">
                    {liveStatus === 'ready'
                      ? `On call · ${coachName}`
                      : liveStatus === 'connecting'
                        ? `Calling ${coachName}...`
                        : `${coachName} · Call ended`}
                  </span>
                  {liveStatus === 'ready' && (
                    <span className="text-[11px] font-mono text-emerald-300 tabular-nums shrink-0">
                      {formatCallDuration(callSeconds)}
                    </span>
                  )}
                </div>
                <div className="text-[11.5px] text-slate-400 truncate">
                  {context.topicName}
                  {context.partTitle ? ` · ${context.partTitle}` : ''}
                </div>
              </div>
            </div>

            <div
              className="flex items-center gap-1.5 shrink-0"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-pressed={speakerMuted}
                onClick={() => setSpeakerMuted((v) => !v)}
                aria-label={speakerMuted ? 'Unmute teacher speaker' : 'Mute teacher speaker'}
                title={speakerMuted ? 'Unmute teacher voice' : 'Mute teacher voice'}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition ${
                  speakerMuted
                    ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                    : 'bg-white/8 hover:bg-white/14 border-white/10 text-slate-200'
                }`}
              >
                <Icon name={speakerMuted ? 'mute' : 'vol'} size={14} />
              </button>
              <button
                type="button"
                onClick={() => setPanelExpanded(false)}
                aria-label="Minimize teacher call panel"
                title="Minimize call"
                className="w-8 h-8 rounded-lg bg-white/8 hover:bg-white/14 border border-white/10 text-slate-200 flex items-center justify-center cursor-pointer transition"
              >
                <Icon name="minus" size={14} />
              </button>
              <button
                type="button"
                data-no-sound="true"
                onClick={endLiveCompletely}
                aria-label="Hang up teacher call"
                title="Hang up call"
                className="w-8 h-8 rounded-lg bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer transition"
              >
                <Icon name="x" size={14} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-3.5 flex flex-col gap-3">
            {/* Mic, Live Voice Meter & Call Again Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {liveStatus === 'ready' && (
                  <span
                    aria-hidden="true"
                    className="inline-flex items-end gap-0.5 h-3.5 shrink-0"
                  >
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        ref={(el) => {
                          meterBarsRef.current[i] = el;
                        }}
                        style={{ transform: 'scaleY(0.24)', transformOrigin: 'bottom' }}
                        className={`w-1 h-3.5 rounded-full transition-transform duration-75 ${
                          profSpeaking
                            ? 'bg-emerald-400'
                            : micActive
                              ? 'bg-rose-400'
                              : 'bg-slate-500'
                        }`}
                      />
                    ))}
                  </span>
                )}
                <span className="text-[12px] font-medium text-slate-300 truncate">
                  {liveStatus === 'closed'
                    ? 'Disconnected'
                    : liveStatus === 'connecting'
                      ? `Ringing ${coachName}...`
                      : speakerMuted
                        ? 'Speaker muted'
                        : profSpeaking
                          ? `${coachName} speaking`
                          : micActive
                            ? 'Listening...'
                            : 'Mic off · Speak or type'}
                </span>
              </div>

              {liveStatus === 'closed' ? (
                <button
                  type="button"
                  data-no-sound="true"
                  onClick={() => startLiveSession(mode)}
                  className="min-h-[34px] px-3.5 rounded-xl bg-emerald-500 text-white text-[12.5px] font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap hover:bg-emerald-400 transition"
                >
                  <Icon name="phone" size={13} />
                  <span>Call again</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={liveStatus !== 'ready'}
                  onClick={toggleMicrophone}
                  aria-pressed={micActive}
                  className={`min-h-[34px] px-3.5 rounded-xl text-[12.5px] font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 whitespace-nowrap ${
                    micActive
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/10 border border-white/14 text-white hover:bg-white/16'
                  }`}
                >
                  <Icon name={micActive ? 'mic' : 'micOff'} size={14} />
                  <span>{micActive ? 'Mic Live' : 'Mic On'}</span>
                </button>
              )}
            </div>

            {liveError && (
              <div
                role="alert"
                className="rounded-xl bg-rose-950/70 border border-rose-500/40 px-3 py-2 text-[12px] text-rose-200"
              >
                {liveError}
              </div>
            )}

            {/* Transcript Stream */}
            <div className="rounded-xl bg-slate-950/60 border border-white/10 p-3 max-h-36 overflow-y-auto flex flex-col gap-2 text-[13px]">
              {transcripts.length === 0 ? (
                <p className="text-slate-300 text-[12.5px] leading-snug">
                  {liveStatus === 'connecting'
                    ? activeTutorMeta.connectingLine
                    : `Ready for "${context.topicName}". Speak or tap a prompt.`}
                </p>
              ) : (
                transcripts.map((t) => (
                  <div
                    key={t.id}
                    className={`rounded-lg px-2.5 py-1.5 leading-snug ${
                      t.who === 'prof'
                        ? 'bg-white/8 text-slate-100 border border-white/10'
                        : 'bg-indigo-500/20 text-indigo-100 border border-indigo-400/25 self-end max-w-[90%]'
                    }`}
                  >
                    <span className="text-[10.5px] font-bold block opacity-75 mb-0.5">
                      {t.who === 'prof' ? coachName : 'You'}
                    </span>
                    <span>{t.text}</span>
                  </div>
                ))
              )}
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-1.5">
              {[
                activeTutorMeta.quickPrompt,
                'Top trap to watch?',
                'Quiz me right now!',
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={liveStatus !== 'ready'}
                  onClick={() => sendLivePrompt(q)}
                  className="px-2.5 py-1 rounded-lg bg-white/8 hover:bg-white/14 disabled:opacity-45 border border-white/10 text-[11.5px] font-medium text-slate-200 cursor-pointer whitespace-nowrap transition"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Direct Question Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendLivePrompt(promptInput);
              }}
              className="flex items-center gap-2"
            >
              <label htmlFor="global-live-ask" className="sr-only">
                {`Ask ${coachName} a question`}
              </label>
              <input
                id="global-live-ask"
                type="text"
                disabled={liveStatus !== 'ready'}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder={`Ask ${coachName} aloud...`}
                className="flex-1 min-h-[38px] px-3 rounded-xl bg-white/6 border border-white/12 focus:border-white/35 text-[13px] text-white placeholder:text-slate-400 outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={liveStatus !== 'ready' || !promptInput.trim()}
                className="min-h-[38px] px-3.5 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-45 text-slate-950 font-[var(--display)] font-bold text-[12.5px] cursor-pointer whitespace-nowrap transition"
              >
                Ask
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Persistent Draggable Floating "Call teacher" Dock */}
      <div
        ref={pillRef}
        data-testid="floating-live-pill"
        data-live-coach-dock="true"
        style={{
          transform: `translate3d(${effectivePos.x}px, ${effectivePos.y}px, 0)`,
        }}
        className={`fixed top-0 left-0 z-50 select-none touch-none ${
          isDragging ? 'cursor-grabbing scale-[1.03]' : 'transition-shadow duration-150'
        }`}
      >
        {!liveOpen ? (
          <button
            type="button"
            data-no-sound="true"
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDownNudge}
            onClick={(e) => {
              if (suppressNextClickRef.current) {
                e.preventDefault();
                e.stopPropagation();
                suppressNextClickRef.current = false;
                return;
              }
              startLiveSession(mode);
            }}
            aria-label={`Call ${coachName} live teacher`}
            aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown Alt+ArrowLeft Alt+ArrowRight"
            title={`Call ${coachName} · Drag to move`}
            className={`h-[42px] w-[42px] sm:h-[38px] sm:w-auto sm:pl-3 sm:pr-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 border border-emerald-800 text-white font-[var(--display)] font-bold text-[12.5px] shadow-[0_2.5px_0_#065F46] active:translate-y-[1px] active:shadow-[0_1px_0_#065F46] flex items-center justify-center gap-1.5 whitespace-nowrap transition-[background-color,box-shadow,transform] duration-150 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <Icon name="phone" size={15} className="shrink-0" />
            <span className="hidden sm:inline">Call teacher</span>
          </button>
        ) : (
          <div
            onPointerDown={handlePointerDown}
            className={`min-h-[40px] pl-2 pr-2 rounded-full bg-[#0F172A]/95 backdrop-blur-md border text-white shadow-[0_10px_24px_-8px_rgba(2,6,23,0.52)] flex items-center gap-1.5 whitespace-nowrap ${
              liveStatus === 'closed'
                ? 'border-rose-400/50'
                : liveStatus === 'connecting'
                  ? 'border-amber-400/50'
                  : 'border-emerald-400/50'
            } ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <button
              type="button"
              onKeyDown={handleKeyDownNudge}
              onClick={(e) => {
                if (suppressNextClickRef.current) {
                  e.preventDefault();
                  e.stopPropagation();
                  suppressNextClickRef.current = false;
                  return;
                }
                setPanelExpanded((v) => !v);
              }}
              aria-expanded={panelExpanded}
              aria-label={
                panelExpanded
                  ? `Hide ${coachName} call panel`
                  : `Show ${coachName} call panel`
              }
              className={`min-h-[34px] pl-1.5 pr-2 rounded-full hover:bg-white/10 flex items-center gap-2 font-[var(--display)] font-bold text-[12.5px] cursor-pointer whitespace-nowrap transition ${
                liveStatus === 'closed'
                  ? 'text-rose-300'
                  : liveStatus === 'connecting'
                    ? 'text-amber-300'
                    : 'text-emerald-300'
              }`}
            >
              <span className="text-slate-400 flex items-center" aria-hidden="true">
                <Icon name="grip" size={14} />
              </span>
              <Icon name={liveStatus === 'connecting' ? 'phoneCall' : 'phone'} size={15} />
              <span>
                {liveStatus === 'closed'
                  ? 'Call ended'
                  : liveStatus === 'connecting'
                    ? 'Calling...'
                    : panelExpanded
                      ? `On call · ${formatCallDuration(callSeconds)}`
                      : `${coachName} · ${formatCallDuration(callSeconds)}`}
              </span>
              {profSpeaking && (
                <span className="inline-flex items-end gap-0.5 h-3" aria-hidden="true">
                  <span className="wave-bar h-3 bg-emerald-400" />
                  <span className="wave-bar h-3.5 bg-amber-300" />
                  <span className="wave-bar h-2.5 bg-emerald-400" />
                </span>
              )}
            </button>

            {liveStatus === 'ready' && (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={toggleMicrophone}
                aria-pressed={micActive}
                aria-label={micActive ? 'Mute call microphone' : 'Turn on call microphone'}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer shrink-0 ${
                  micActive
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/10 text-slate-200 hover:bg-white/18'
                }`}
              >
                <Icon name={micActive ? 'mic' : 'micOff'} size={13} />
              </button>
            )}

            <button
              type="button"
              data-no-sound="true"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={endLiveCompletely}
              aria-label="Hang up teacher call"
              title="Hang up call"
              className="w-7 h-7 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer shrink-0 transition"
            >
              <Icon name="x" size={13} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
