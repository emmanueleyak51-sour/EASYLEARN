import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useActiveLiveCoachEntry, type LiveCoachMode } from '../context/LiveCoachContext';
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
import { Icon } from './Icons';

type LiveStatus = 'closed' | 'connecting' | 'ready';

interface TranscriptTurn {
  id: number;
  who: 'you' | 'prof';
  text: string;
}

const DEFAULT_PILL_W = 118;
const DEFAULT_PILL_H = 42;
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
          pos: ratioToLivePos(ratio, vw, vh, DEFAULT_PILL_W, DEFAULT_PILL_H),
          ratio,
        };
      }
    }
  } catch {
    /* ignore storage errors */
  }
  return {
    pos: computeDefaultLivePos(vw, vh, DEFAULT_PILL_W, DEFAULT_PILL_H),
    ratio: null,
  };
}

export function FloatingLiveCoach({ muted = false }: { muted?: boolean }) {
  const activeEntry = useActiveLiveCoachEntry();
  const { context, mode, stepKey } = activeEntry;
  const isMath = mode === 'math';
  const isFMath = mode === 'fmath';
  const isPhys = mode === 'phys';
  const isBio = mode === 'bio';
  const isAgric = mode === 'agric';
  const isGeog = mode === 'geog';
  const isEcon = mode === 'econ';
  const isEng = mode === 'eng';
  const isCivic = mode === 'civic';
  const isDigiTech = mode === 'digitech';
  const isDataProc = mode === 'dataproc';
  const coachName = isDataProc
    ? 'Mrs. Kemi'
    : isDigiTech
      ? 'Engr. Tunde'
      : isCivic
        ? 'Barrister Kunle'
        : isEng
          ? 'Miss Adaeze'
          : isEcon
            ? 'Dr. Ngozi'
            : isGeog
              ? 'Dr. Ibrahim'
              : isAgric
                ? 'Dr. Fatima'
                : isBio
                  ? 'Dr. Amaka'
                  : isPhys
                    ? 'Dr. Faraday'
                    : isFMath
                      ? 'Prof. Chinedu'
                      : isMath
                        ? 'Master Chike'
                        : 'Prof. Spark';

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

  const closeLiveSession = useCallback(() => {
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
  }, [clearScheduledLiveAudio, stopMicCapture]);

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
    if (muted) {
      clearScheduledLiveAudio();
    }
  }, [muted, clearScheduledLiveAudio]);

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
      }
    };

    src.start(startAt);
  }, []);

  const startLiveSession = useCallback(
    (targetMode: LiveCoachMode = mode, opts?: { preserveExpanded?: boolean }) => {
      window.dispatchEvent(new CustomEvent('rtc:stop-tts'));
      closeLiveSession();
      setLiveError(null);
      setTranscripts([]);
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

      const useMath = targetMode === 'math';
      const useFMath = targetMode === 'fmath';
      const usePhys = targetMode === 'phys';
      const useBio = targetMode === 'bio';
      const useAgric = targetMode === 'agric';
      const useGeog = targetMode === 'geog';
      const useEcon = targetMode === 'econ';
      const useEng = targetMode === 'eng';
      const useCivic = targetMode === 'civic';
      const useDigiTech = targetMode === 'digitech';
      const useDataProc = targetMode === 'dataproc';
      ws.onopen = () => {
        if (wsRef.current !== ws) return;
        const systemInstruction = useDataProc
          ? buildDataProcCoachSystemPrompt(context)
          : useDigiTech
            ? buildDigiTechCoachSystemPrompt(context)
            : useCivic
              ? buildCivicCoachSystemPrompt(context)
              : useEng
                ? buildEnglishCoachSystemPrompt(context)
                : useEcon
                  ? buildEconomicsCoachSystemPrompt(context)
                  : useGeog
                    ? buildGeogCoachSystemPrompt(context)
                    : useAgric
                      ? buildAgricCoachSystemPrompt(context)
                      : useBio
                        ? buildBiologyCoachSystemPrompt(context)
                        : usePhys
                          ? buildPhysicsCoachSystemPrompt(context)
                          : useFMath
                            ? buildFMathCoachSystemPrompt(context)
                            : useMath
                              ? buildMathCoachSystemPrompt(context)
                              : buildMadScientistSystemPrompt(context);
        const greetPrompt = useDataProc
          ? `Introduce yourself once as Mrs. Kemi in your Data Processing & SQL Studio, briefly orient the student on "${context.topicName}" (${context.partTitle || 'current view'}) in 2 warm, razor-sharp sentences, and invite them to ask anything!`
          : useDigiTech
            ? `Introduce yourself once as Engineer Tunde in your Digital Technologies Studio, briefly orient the student on "${context.topicName}" (${context.partTitle || 'current view'}) in 2 energetic, clear sentences, and invite them to ask anything!`
            : useCivic
              ? `Introduce yourself once as Barrister Kunle in your Civic & Constitutional Studio, briefly orient the student on "${context.topicName}" (${context.partTitle || 'current view'}) in 2 principled, engaging sentences, and invite them to ask anything!`
              : useEng
                ? `Introduce yourself once as Miss Adaeze in your English & Diction Studio, briefly orient the student on "${context.topicName}" (${context.partTitle || 'current view'}) in 2 warm, articulate sentences, and invite them to ask anything!`
                : useEcon
                  ? `Introduce yourself once as Dr. Ngozi in your Economics Studio, briefly orient the student on "${context.topicName}" (${context.partTitle || 'current view'}) in 2 crisp, insightful sentences, and invite them to ask anything!`
                  : useGeog
                    ? `Introduce yourself once as Dr. Ibrahim in your Geography & Cartography Studio, briefly orient the student on "${context.topicName}" (${context.partTitle || 'current view'}) in 2 vivid sentences, and invite them to ask anything!`
                    : useAgric
                      ? `Introduce yourself once as Dr. Fatima at your Agronomy & Farm Research Studio, briefly orient the student on "${context.topicName}" (${context.partTitle || 'current view'}) in 2 warm, field-tested sentences, and invite them to ask anything!`
                      : useBio
                        ? `Introduce yourself once as Dr. Amaka at your Biology & Microscopy Studio, briefly orient the student on "${context.topicName}" (${context.partTitle || 'current view'}) in 2 warm, vivid sentences, and invite them to ask anything!`
                        : usePhys
                          ? `Introduce yourself once as Dr. Faraday at your Physics bench, briefly orient the student on "${context.topicName}" (${context.partTitle || 'current view'}) in 2 lucid sentences, and invite them to ask anything!`
                          : useFMath
                            ? `Introduce yourself once as Professor Chinedu at your Further Mathematics Studio, briefly orient the student on "${context.topicName}" (${context.partTitle || 'current view'}) in 2 razor-sharp sentences, and invite them to ask anything!`
                            : useMath
                              ? `Introduce yourself once as Master Chike at your Mathematics chalkboard, briefly orient the student on "${context.topicName}" (${context.partTitle || 'current view'}) in 2 crisp sentences, and invite them to ask anything!`
                              : `Introduce yourself once as Professor Spark in your Chemistry laboratory, briefly orient the student on "${context.topicName}" (${context.partTitle || 'current view'}) in 2 vivid sentences, and invite them to ask anything!`;
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
            setLiveError(null);
            setLiveStatus('ready');
          } else if (msg.type === 'audio' && typeof msg.audio === 'string') {
            schedulePcm24kChunk(msg.audio);
          } else if (msg.type === 'inputTranscript' && typeof msg.text === 'string') {
            appendTranscript('you', msg.text);
          } else if (msg.type === 'outputTranscript' && typeof msg.text === 'string') {
            appendTranscript('prof', msg.text);
          } else if (msg.type === 'interrupted') {
            clearScheduledLiveAudio();
          } else if (msg.type === 'error' && typeof msg.error === 'string') {
            setLiveError(msg.error);
            setLiveStatus('closed');
          } else if (msg.type === 'closed') {
            setLiveStatus('closed');
            stopMicCapture();
          }
        } catch {
          /* ignore */
        }
      };

      ws.onerror = () => {
        if (wsRef.current !== ws) return;
        setLiveError('Could not connect to Live Studio WebSocket. Tap Reconnect to try again.');
        setLiveStatus('closed');
      };

      ws.onclose = () => {
        if (wsRef.current !== ws) return;
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
        const pcmBase64 = float32ToPcm16Base64(e.inputBuffer.getChannelData(0));
        ws.send(JSON.stringify({ type: 'audio', data: pcmBase64 }));
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);
    } catch (err) {
      stopMicCapture();
      setLiveError(
        (err as Error).message?.includes('Permission')
          ? `Microphone access was blocked. You can still type or tap questions below to hear ${coachName} live!`
          : `Could not access microphone. Use the quick buttons or text box below to talk to ${coachName}.`
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
    setLiveOpen(false);
    setPanelExpanded(false);
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
      {/* Expanded Floating Live Coach Panel (smartly anchored inside viewport) */}
      {liveOpen && panelExpanded && (
        <section
          ref={panelRef}
          aria-label={
            isDataProc
              ? 'Mrs. Kemi Live Data Processing Coach'
              : isDigiTech
                ? 'Engineer Tunde Live Digital Technologies Coach'
                : isCivic
                  ? 'Barrister Kunle Live Civic Education Coach'
                  : isEng
                    ? 'Miss Adaeze Live English Coach'
                    : isEcon
                      ? 'Dr. Ngozi Live Economics Coach'
                      : isGeog
                        ? 'Dr. Ibrahim Live Geography Coach'
                        : isAgric
                          ? 'Dr. Fatima Live Agricultural Science Coach'
                          : isBio
                            ? 'Dr. Amaka Live Biology Coach'
                            : isPhys
                              ? 'Dr. Faraday Live Physics Coach'
                              : isFMath
                                ? 'Professor Chinedu Live Further Mathematics Coach'
                                : isMath
                                  ? 'Master Chike Live Mathematics Coach'
                                  : 'Professor Spark Live Chemistry Lab'
          }
          style={{
            transform: `translate3d(${popoverPlacement.left}px, ${popoverPlacement.top}px, 0)`,
          }}
          className="fixed top-0 left-0 z-50 w-[min(372px,calc(100vw-20px))] rounded-2xl bg-[#0F172A]/96 backdrop-blur-xl text-[#F8FAFC] border border-white/14 shadow-[0_24px_48px_-12px_rgba(2,6,23,0.65)] flex flex-col overflow-hidden"
        >
          {/* Draggable Studio Header */}
          <div
            onPointerDown={handlePointerDown}
            className={`px-3.5 py-2.5 bg-white/[0.04] border-b border-white/10 flex items-center justify-between gap-2 select-none touch-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-slate-400 shrink-0" aria-hidden="true">
                <Icon name="grip" size={15} />
              </span>
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  liveStatus === 'ready'
                    ? 'bg-emerald-400'
                    : liveStatus === 'connecting'
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-rose-400'
                }`}
              />
              <div className="min-w-0">
                <div className="text-[12px] font-bold text-white truncate">
                  {liveStatus === 'ready'
                    ? `${coachName} · Live`
                    : liveStatus === 'connecting'
                      ? `Connecting to ${coachName}...`
                      : `${coachName} · Disconnected`}
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
                onClick={() => setPanelExpanded(false)}
                aria-label="Minimize Live Coach panel"
                title="Minimize to floating dock (keeps Live active)"
                className="w-8 h-8 rounded-lg bg-white/8 hover:bg-white/14 border border-white/10 text-slate-200 flex items-center justify-center cursor-pointer transition"
              >
                <Icon name="minus" size={14} />
              </button>
              <button
                type="button"
                onClick={endLiveCompletely}
                aria-label="End Live session"
                title="End Live session"
                className="w-8 h-8 rounded-lg bg-rose-500/90 hover:bg-rose-500 text-white flex items-center justify-center cursor-pointer transition"
              >
                <Icon name="x" size={14} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-3.5 flex flex-col gap-3">
            {/* Mic & Reconnect Row */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-medium text-slate-300 truncate">
                {liveStatus === 'closed'
                  ? 'Session disconnected'
                  : liveStatus === 'connecting'
                    ? `Connecting to ${coachName}...`
                    : profSpeaking
                      ? `${coachName} is speaking...`
                      : micActive
                        ? 'Listening to your mic...'
                        : 'Voice & text Q&A ready'}
              </span>

              {liveStatus === 'closed' ? (
                <button
                  type="button"
                  onClick={() => startLiveSession(mode)}
                  className="min-h-[34px] px-3.5 rounded-xl bg-white text-slate-950 text-[12.5px] font-bold cursor-pointer whitespace-nowrap hover:bg-slate-100 transition"
                >
                  Reconnect
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
                  <span>{micActive ? 'Mic Live — Speak' : 'Turn on Mic'}</span>
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
                    ? isDataProc
                      ? 'Connecting to the Database & SQL Studio...'
                      : isDigiTech
                        ? 'Booting the Digital Architecture Studio...'
                        : isCivic
                          ? 'Opening the Civic & Constitutional Chambers...'
                          : isEng
                            ? 'Opening the English & Diction Studio...'
                            : isEcon
                              ? 'Opening the Economics Policy Studio...'
                              : isGeog
                                ? 'Unfolding the Topographical Atlas...'
                                : isAgric
                                  ? 'Preparing the Agronomy & Farm Studio...'
                                  : isBio
                                    ? 'Focusing the Biology microscope...'
                                    : isPhys
                                      ? 'Powering up the Physics bench...'
                                      : isFMath
                                        ? 'Setting up the Calculus & Vector Studio...'
                                        : isMath
                                          ? 'Chalking up the board...'
                                          : 'Igniting the Bunsen burner...'
                    : `${coachName} is ready for "${context.topicName}". Turn on your mic or tap a prompt below!`}
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
              {(isDataProc
                ? [
                    'Trace this on a real database table!',
                    'Top trap to watch?',
                    'Quiz me right now!',
                  ]
                : isDigiTech
                  ? [
                      'Walk through the bits & hardware!',
                      'Top trap to watch?',
                      'Quiz me right now!',
                    ]
                  : isCivic
                    ? [
                        'Give a real civic case example!',
                        'Top trap to watch?',
                        'Quiz me right now!',
                      ]
                    : isEng
                      ? [
                          'Give a clear sentence example!',
                          'Top trap to watch?',
                          'Quiz me right now!',
                        ]
                      : isEcon
                        ? [
                            'Explain with a real market example!',
                            'Top trap to watch?',
                            'Quiz me right now!',
                          ]
                        : isGeog
                          ? [
                              'Connect this to Nigeria’s map!',
                              'Top trap to watch?',
                              'Quiz me right now!',
                            ]
                          : isAgric
                            ? [
                                'Connect this to a real farm!',
                                'Top trap to watch?',
                                'Quiz me right now!',
                              ]
                            : isBio
                              ? [
                                  'Walk me through the mechanism!',
                                  'Top trap to watch?',
                                  'Quiz me right now!',
                                ]
                              : isPhys
                                ? [
                                    'Explain with a real-world Physics demo!',
                                    'Top trap to watch?',
                                    'Quiz me right now!',
                                  ]
                                : isFMath
                                  ? [
                                      'Show the fastest calculus/vector step!',
                                      'Top trap to watch?',
                                      'Quiz me right now!',
                                    ]
                                  : isMath
                                    ? [
                                        'Show the cleanest method here!',
                                        'Top trap to watch?',
                                        'Quiz me right now!',
                                      ]
                                    : [
                                        'Explain with a lab analogy!',
                                        'Top trap to watch?',
                                        'Quiz me right now!',
                                      ]
              ).map((q) => (
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

      {/* Persistent Draggable Floating "Go Live" Dock */}
      <div
        ref={pillRef}
        data-testid="floating-live-pill"
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
            aria-label={`Go Live with ${coachName} (draggable anywhere on screen)`}
            aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown Alt+ArrowLeft Alt+ArrowRight"
            title={`Go Live with ${coachName} · Drag to move anywhere`}
            className={`min-h-[38px] pl-2.5 pr-3 rounded-full bg-[#0F172A]/88 hover:bg-[#0F172A] backdrop-blur-md border border-white/14 text-white font-[var(--display)] font-bold text-[12.5px] shadow-[0_8px_20px_-6px_rgba(2,6,23,0.42)] flex items-center gap-1.5 whitespace-nowrap transition-[background-color,box-shadow,transform] duration-150 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <span className="text-slate-400/85 flex items-center" aria-hidden="true">
              <Icon name="grip" size={13} />
            </span>
            <Icon name="radio" size={14} className="text-emerald-400" />
            <span>Go Live</span>
          </button>
        ) : (
          <div
            onPointerDown={handlePointerDown}
            className={`min-h-[38px] pl-2 pr-2 rounded-full bg-[#0F172A]/92 backdrop-blur-md border text-white shadow-[0_8px_20px_-6px_rgba(2,6,23,0.48)] flex items-center gap-1.5 whitespace-nowrap ${
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
                  ? `Hide ${coachName} Live panel`
                  : `Expand ${coachName} Live panel`
              }
              className={`min-h-[34px] pl-1 pr-2 rounded-full hover:bg-white/10 flex items-center gap-2 font-[var(--display)] font-bold text-[12.5px] cursor-pointer whitespace-nowrap transition ${
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
              <Icon name="radio" size={15} />
              <span>
                {liveStatus === 'closed'
                  ? 'Disconnected'
                  : liveStatus === 'connecting'
                    ? 'Connecting...'
                    : panelExpanded
                      ? 'Live Open'
                      : `Live · ${coachName}`}
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
                aria-label={micActive ? 'Mute Live microphone' : 'Turn on Live microphone'}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer shrink-0 ${
                  micActive
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/10 text-slate-200 hover:bg-white/18'
                }`}
              >
                <Icon name={micActive ? 'mic' : 'micOff'} size={13} />
              </button>
            )}

            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={endLiveCompletely}
              aria-label="End Live session"
              title="End Live session"
              className="w-7 h-7 rounded-full bg-rose-500 hover:bg-rose-400 text-white flex items-center justify-center cursor-pointer shrink-0 transition"
            >
              <Icon name="x" size={13} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
