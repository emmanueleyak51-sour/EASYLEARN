import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  liveCoachModeToSubjectId,
  useSyncLiveCoachContext,
  type LiveCoachMode,
} from '../context/LiveCoachContext';
import { useEntitlement } from '../context/EntitlementContext';
import type { ChemLessonVoiceContext } from '../utils/chemVoiceLogic';
import { SUBJECT_TUTOR_REGISTRY } from '../utils/tutorRegistry';
import { unlockStudioAudioOnGesture } from '../utils/studioAudioPlayer';
import { Icon } from './Icons';

type TtsState = 'idle' | 'loading' | 'playing' | 'paused';
type VoiceMode = LiveCoachMode | 'mathLab';

interface CachedAudioPayload {
  bytes: Uint8Array;
  mimeType: string;
}

// Module-level audio byte cache & active continuous session set so tapping "Teach" once
// pre-synthesizes every remaining step/chapter in the background and plays seamlessly across steps.
const clientTtsAudioCache = new Map<string, Promise<CachedAudioPayload>>();
const MAX_CLIENT_TTS_CACHE = 180;
const activeVoiceSessions = new Set<string>();
const TTS_SPEED_STORAGE_KEY = 'rtc_tts_speed_v1';
const TTS_SPEED_STEPS = [1, 1.25, 1.5] as const;

function readInitialTtsSpeed(): number {
  try {
    if (typeof window === 'undefined') return 1;
    const raw = Number(window.localStorage.getItem(TTS_SPEED_STORAGE_KEY));
    if (raw === 1 || raw === 1.25 || raw === 1.5) return raw;
  } catch {
    /* ignore */
  }
  return 1;
}

function makeTtsCacheKey(mode: VoiceMode, text: string): string {
  return `${mode}|${text.trim()}`;
}

function fetchAndCacheTts(
  mode: VoiceMode,
  text: string,
  topicName?: string,
  stepTitle?: string
): Promise<CachedAudioPayload> {
  const trimmed = text.trim();
  const key = makeTtsCacheKey(mode, trimmed);
  const existing = clientTtsAudioCache.get(key);
  if (existing) return existing;

  const promise = (async (): Promise<CachedAudioPayload> => {
    const res = await fetch('/api/chem/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: trimmed,
        voiceProfile: mode,
        topicName,
        stepTitle,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.audioBase64) {
      throw new Error(data.error || 'Could not synthesize voice narration.');
    }
    const bin = atob(data.audioBase64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return {
      bytes,
      mimeType: data.mimeType || 'audio/wav',
    };
  })();

  promise.catch(() => {
    clientTtsAudioCache.delete(key);
  });

  if (clientTtsAudioCache.size >= MAX_CLIENT_TTS_CACHE) {
    const oldest = clientTtsAudioCache.keys().next().value;
    if (oldest) clientTtsAudioCache.delete(oldest);
  }
  clientTtsAudioCache.set(key, promise);
  return promise;
}

export function ChemMadScientistBar({
  context,
  stepKey,
  sessionKey,
  upcomingScripts,
  mode = 'chem',
  variant = 'full',
  actionLabel,
  muted = false,
}: {
  context: ChemLessonVoiceContext;
  stepKey: string;
  sessionKey?: string;
  upcomingScripts?: string[];
  mode?: VoiceMode;
  variant?: 'full' | 'compact';
  actionLabel?: string;
  muted?: boolean;
}) {
  const { isPremium } = useEntitlement();
  const isMathLab = mode === 'mathLab';
  const subjId = liveCoachModeToSubjectId(mode);
  const tutorMeta = SUBJECT_TUTOR_REGISTRY[subjId];
  const isCompact = variant === 'compact';

  const effectiveSessionKey = sessionKey || stepKey.split('|').slice(0, 3).join('|');

  // Sync this exact step/chapter/formula context to the global Floating "Go Live" Coach
  useSyncLiveCoachContext(
    stepKey,
    context,
    mode === 'mathLab' ? 'math' : mode
  );

  // ── TTS Narration State ──
  const [ttsState, setTtsState] = useState<TtsState>('idle');
  const [sessionActive, setSessionActive] = useState<boolean>(() =>
    activeVoiceSessions.has(effectiveSessionKey)
  );
  const [prefetchedCount, setPrefetchedCount] = useState(0);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(readInitialTtsSpeed);

  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const playRequestIdRef = useRef(0);
  const loadedStepKeyRef = useRef<string>('');
  const mountedRef = useRef(true);
  const playbackRateRef = useRef<number>(playbackRate);
  playbackRateRef.current = playbackRate;

  const cyclePlaybackRate = useCallback(() => {
    setPlaybackRate((prev) => {
      const idx = TTS_SPEED_STEPS.indexOf(prev as (typeof TTS_SPEED_STEPS)[number]);
      const next = TTS_SPEED_STEPS[(idx + 1) % TTS_SPEED_STEPS.length];
      try {
        window.localStorage.setItem(TTS_SPEED_STORAGE_KEY, String(next));
      } catch {
        /* ignore */
      }
      if (audioElRef.current) {
        audioElRef.current.playbackRate = next;
      }
      return next;
    });
  }, []);

  const stopTtsAudio = useCallback(() => {
    playRequestIdRef.current += 1;
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.currentTime = 0;
      audioElRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setTtsState('idle');
  }, []);

  // Cleanup on unmount and yield when Global Live Coach starts speaking
  useEffect(() => {
    mountedRef.current = true;
    const onStopTts = () => {
      activeVoiceSessions.delete(effectiveSessionKey);
      setSessionActive(false);
      stopTtsAudio();
    };
    window.addEventListener('rtc:stop-tts', onStopTts);
    return () => {
      mountedRef.current = false;
      window.removeEventListener('rtc:stop-tts', onStopTts);
      activeVoiceSessions.delete(effectiveSessionKey);
      stopTtsAudio();
    };
  }, [effectiveSessionKey, stopTtsAudio]);

  // Stop active playback if user enables global mute
  useEffect(() => {
    if (muted) {
      activeVoiceSessions.delete(effectiveSessionKey);
      setSessionActive(false);
      stopTtsAudio();
    }
  }, [effectiveSessionKey, muted, stopTtsAudio]);

  // Pre-synthesize all remaining steps/chapters in the background once Teach is tapped
  const triggerBackgroundPreSynthesis = useCallback(() => {
    if (!isPremium) return;
    if (!upcomingScripts || upcomingScripts.length <= 1) return;
    const queue = upcomingScripts
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && s !== context.stepText.trim());
    if (queue.length === 0) return;

    let cancelled = false;
    let idx = 0;
    const total = upcomingScripts.length;

    const worker = async () => {
      while (!cancelled && mountedRef.current && idx < queue.length) {
        const nextText = queue[idx++];
        try {
          await fetchAndCacheTts(mode, nextText, context.topicName);
          if (mountedRef.current && !cancelled) {
            const ready = upcomingScripts.filter((s) =>
              clientTtsAudioCache.has(makeTtsCacheKey(mode, s))
            ).length;
            setPrefetchedCount(Math.min(total, ready));
          }
        } catch {
          // Non-fatal background prefetch error; on-demand playback will retry if needed
        }
      }
    };

    // Polite concurrency of 2 so current-step audio gets priority bandwidth
    void worker();
    if (queue.length > 1) {
      void worker();
    }

    return () => {
      cancelled = true;
    };
  }, [context.stepText, context.topicName, isPremium, mode, upcomingScripts]);

  const playCurrentScreenTts = useCallback(
    async (forceReload = false) => {
      if (!isPremium) return;
      window.dispatchEvent(new CustomEvent('rtc:clear-live-audio'));

      if (!forceReload && audioElRef.current && loadedStepKeyRef.current === stepKey) {
        if (ttsState === 'playing') {
          audioElRef.current.pause();
          activeVoiceSessions.delete(effectiveSessionKey);
          setSessionActive(false);
          setTtsState('paused');
          return;
        }
        if (ttsState === 'paused') {
          activeVoiceSessions.add(effectiveSessionKey);
          setSessionActive(true);
          await audioElRef.current.play();
          setTtsState('playing');
          triggerBackgroundPreSynthesis();
          return;
        }
      }

      stopTtsAudio();
      const reqId = playRequestIdRef.current;
      activeVoiceSessions.add(effectiveSessionKey);
      setSessionActive(true);
      setTtsError(null);
      setTtsState('loading');

      try {
        const payload = await fetchAndCacheTts(
          mode,
          context.stepText,
          context.topicName,
          context.partTitle
        );
        if (!mountedRef.current || playRequestIdRef.current !== reqId) return;

        // Kick off background synthesis for all remaining chapters/steps now that current screen is ready
        triggerBackgroundPreSynthesis();

        const blob = new Blob([payload.bytes as BlobPart], { type: payload.mimeType });
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        loadedStepKeyRef.current = stepKey;

        const audio = new Audio(url);
        audio.playbackRate = playbackRateRef.current;
        audioElRef.current = audio;
        audio.onended = () => {
          if (mountedRef.current && playRequestIdRef.current === reqId) {
            setTtsState('idle');
          }
        };
        audio.onerror = () => {
          if (mountedRef.current && playRequestIdRef.current === reqId) {
            setTtsState('idle');
            setTtsError('Audio playback failed.');
          }
        };
        await audio.play();
        if (mountedRef.current && playRequestIdRef.current === reqId) {
          setTtsState('playing');
        }
      } catch (err) {
        if (!mountedRef.current || playRequestIdRef.current !== reqId) return;
        setTtsState('idle');
        setTtsError((err as Error).message || 'Voice request failed.');
      }
    },
    [
      context.partTitle,
      context.stepText,
      context.topicName,
      effectiveSessionKey,
      isPremium,
      mode,
      stepKey,
      stopTtsAudio,
      triggerBackgroundPreSynthesis,
      ttsState,
    ]
  );

  // Seamless continuous teaching: once the student taps "Teach" once in a lesson, lab, or study notes,
  // stepping to the next chapter or step immediately plays the pre-synthesized voice for the new screen!
  const prevStepRef = useRef<string>(stepKey);
  useEffect(() => {
    if (prevStepRef.current === stepKey) return;
    prevStepRef.current = stepKey;
    loadedStepKeyRef.current = '';
    stopTtsAudio();

    if (isPremium && activeVoiceSessions.has(effectiveSessionKey) && !muted) {
      setSessionActive(true);
      void playCurrentScreenTts(true);
    }
  }, [effectiveSessionKey, isPremium, muted, playCurrentScreenTts, stepKey, stopTtsAudio]);

  if (!isPremium) {
    return null;
  }

  const idleButtonLabel = actionLabel || 'Teach';
  const titleText = isMathLab
    ? 'Geometry Coach · Studio Voice'
    : `${tutorMeta.tutorName} · ${tutorMeta.short} Studio Voice`;

  const totalUpcoming = upcomingScripts?.length || 0;
  const readyBadge =
    sessionActive && totalUpcoming > 1 && prefetchedCount > 1
      ? ` · ${prefetchedCount}/${totalUpcoming} ready`
      : '';

  const statusSubtitle =
    ttsState === 'loading'
      ? 'Preparing voice...'
      : ttsState === 'playing'
        ? `Playing${totalUpcoming > 1 ? ' · Auto-advances' : ''}${readyBadge}`
        : sessionActive && totalUpcoming > 1
          ? `Auto-play active${readyBadge}`
          : isMathLab
            ? 'Step-by-step voice guide'
            : totalUpcoming > 1
              ? 'Voice breakdown · Auto-advances'
              : 'Focused voice breakdown';

  return (
    <section
      aria-label={
        isMathLab
          ? 'Geometry Coach Studio Voice'
          : `${tutorMeta.tutorName} ${tutorMeta.name} Studio Voice`
      }
      className={`flex flex-col gap-2.5 transition-colors ${
        isCompact
          ? 'rounded-xl bg-[var(--bg)]/85 border border-[var(--line)] px-3.5 py-2.5'
          : 'rounded-2xl rtc-card px-4 py-3.5'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={`${
              isCompact ? 'w-9 h-9 rounded-xl' : 'w-10 h-10 rounded-xl'
            } bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[var(--gold)] flex items-center justify-center shrink-0 ${
              ttsState === 'playing' ? 'anim-bob' : ''
            }`}
          >
            <Icon
              name={isMathLab ? 'pen' : tutorMeta.icon}
              size={isCompact ? 17 : 19}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[12.5px] font-bold text-[var(--ink)] truncate">
                {titleText}
              </span>
              {(ttsState === 'loading' || ttsState === 'playing') && (
                <span className="inline-flex items-end gap-0.5 h-3 shrink-0" aria-hidden="true">
                  <span className="wave-bar h-3 bg-[var(--gold)]" />
                  <span className="wave-bar h-3.5 bg-[var(--green)]" />
                  <span className="wave-bar h-2.5 bg-[var(--gold)]" />
                </span>
              )}
            </div>
            <p className="text-[12.5px] text-[var(--dim)] leading-snug truncate max-w-[540px]">
              {statusSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={cyclePlaybackRate}
            aria-label={`Voice speed ${playbackRate}x — tap to change`}
            title="Change narration speed"
            className="min-h-[38px] px-2.5 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12px] font-mono font-bold text-[var(--ink)] tabular-nums cursor-pointer whitespace-nowrap shrink-0 transition"
          >
            {playbackRate}×
          </button>

          <button
            type="button"
            disabled={ttsState === 'loading'}
            onClick={() => {
              unlockStudioAudioOnGesture();
              void playCurrentScreenTts(false);
            }}
            className="min-h-[38px] px-3.5 rounded-xl bg-[var(--gold)] hover:brightness-105 active:scale-[0.985] disabled:opacity-60 text-[var(--on-acc)] font-[var(--display)] font-bold text-[13px] shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition"
          >
            <Icon name={ttsState === 'playing' ? 'pause' : 'play'} size={14} />
            <span>
              {ttsState === 'loading'
                ? 'Loading'
                : ttsState === 'playing'
                  ? 'Pause'
                  : ttsState === 'paused'
                    ? 'Resume'
                    : idleButtonLabel}
            </span>
          </button>

          {(ttsState === 'playing' || ttsState === 'paused') && (
            <button
              type="button"
              onClick={() => {
                unlockStudioAudioOnGesture();
                void playCurrentScreenTts(true);
              }}
              aria-label="Replay current screen narration"
              title="Replay current screen"
              className="min-h-[38px] px-2.5 rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] hover:border-[var(--acc-line)] flex items-center justify-center cursor-pointer shrink-0 transition"
            >
              <Icon name="replay" size={15} />
            </button>
          )}
        </div>
      </div>

      {ttsError && (
        <div
          role="alert"
          className="rounded-xl bg-[var(--bad-soft)] border border-[var(--bad-line)] px-3.5 py-2 text-[12.5px] text-[var(--coral-ink)] flex items-center justify-between gap-3"
        >
          <span>{ttsError}</span>
          <button
            type="button"
            onClick={() => setTtsError(null)}
            aria-label="Dismiss voice message"
            className="opacity-75 hover:opacity-100 cursor-pointer"
          >
            <Icon name="x" size={14} />
          </button>
        </div>
      )}
    </section>
  );
}
