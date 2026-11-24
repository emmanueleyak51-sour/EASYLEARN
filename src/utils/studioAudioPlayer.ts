export interface DecodedTtsPayload {
  bytes: Uint8Array;
  mimeType: string;
  durationEstimateSec: number;
}

export interface ActiveAudioHandle {
  stop: () => void;
  engine: 'webaudio' | 'htmlaudio';
}

// Minimal 44-byte valid 1-sample silent PCM WAV for priming HTMLAudioElement during user gestures
const SILENT_WAV_DATA_URI =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

export function isValidWavBuffer(bytes: Uint8Array): boolean {
  if (!bytes || bytes.byteLength < 44) return false;
  // 'RIFF' (0x52 0x49 0x46 0x46) ... 'WAVE' (0x57 0x41 0x56 0x45)
  return (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x41 &&
    bytes[10] === 0x56 &&
    bytes[11] === 0x45
  );
}

export function estimateWavDurationSeconds(bytes: Uint8Array): number {
  if (!isValidWavBuffer(bytes)) return 0;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  // ByteRate is stored at offset 28 (little-endian uint32) in canonical PCM WAV headers
  const byteRate = view.getUint32(28, true);
  if (!byteRate || byteRate <= 0) return 0;
  const pcmBytes = Math.max(0, bytes.byteLength - 44);
  return Number((pcmBytes / byteRate).toFixed(2));
}

export function decodeTtsBase64Audio(
  audioBase64: string,
  mimeType = 'audio/wav'
): DecodedTtsPayload {
  const clean = typeof audioBase64 === 'string' ? audioBase64.trim() : '';
  if (!clean) {
    throw new Error('Voice service returned an empty audio payload.');
  }

  let bytes: Uint8Array;
  if (typeof atob === 'function') {
    const binary = atob(clean);
    bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
  } else {
    const buf = Buffer.from(clean, 'base64');
    bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }

  if (bytes.byteLength < 44) {
    throw new Error('Generated voice clip is truncated or invalid.');
  }

  return {
    bytes,
    mimeType: mimeType || 'audio/wav',
    durationEstimateSec: estimateWavDurationSeconds(bytes),
  };
}

let sharedAudioCtx: AudioContext | null = null;
let sharedHtmlAudio: HTMLAudioElement | null = null;
let htmlAudioPrimed = false;

function getAudioContextConstructor(): typeof AudioContext | null {
  if (typeof window === 'undefined') return null;
  const win = window as Window &
    typeof globalThis & { webkitAudioContext?: typeof AudioContext };
  return win.AudioContext || win.webkitAudioContext || null;
}

/**
 * Must be invoked synchronously inside a direct user click/tap handler BEFORE any `await`.
 * Unlocks both Web Audio API (`AudioContext`) and a persistent `HTMLAudioElement` so
 * subsequent async TTS playback after `await fetch('/api/chem/tts')` is never blocked
 * by mobile Safari, Android Chrome, or WebView autoplay policies.
 */
export function unlockStudioAudioOnGesture(): void {
  if (typeof window === 'undefined') return;

  const AudioCtx = getAudioContextConstructor();
  if (AudioCtx) {
    try {
      if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
        sharedAudioCtx = new AudioCtx();
      }
      if (sharedAudioCtx.state === 'suspended') {
        void sharedAudioCtx.resume().catch(() => {});
      }
      const silentBuffer = sharedAudioCtx.createBuffer(1, 1, 24000);
      const source = sharedAudioCtx.createBufferSource();
      source.buffer = silentBuffer;
      source.connect(sharedAudioCtx.destination);
      source.start(0);
    } catch {
      /* fallback to HTMLAudioElement */
    }
  }

  if (typeof Audio !== 'undefined' && !htmlAudioPrimed) {
    try {
      if (!sharedHtmlAudio) {
        sharedHtmlAudio = new Audio();
        sharedHtmlAudio.preload = 'auto';
        sharedHtmlAudio.setAttribute('playsinline', 'true');
      }
      sharedHtmlAudio.muted = true;
      sharedHtmlAudio.src = SILENT_WAV_DATA_URI;
      const playPromise = sharedHtmlAudio.play();
      htmlAudioPrimed = true;
      if (playPromise && typeof playPromise.then === 'function') {
        void playPromise
          .then(() => {
            if (sharedHtmlAudio && sharedHtmlAudio.src === SILENT_WAV_DATA_URI) {
              sharedHtmlAudio.pause();
              sharedHtmlAudio.muted = false;
            }
          })
          .catch(() => {
            htmlAudioPrimed = false;
            if (sharedHtmlAudio) sharedHtmlAudio.muted = false;
          });
      } else {
        sharedHtmlAudio.muted = false;
      }
    } catch {
      /* ignore priming failure */
    }
  }
}

export async function playStudioWavPayload(
  payload: DecodedTtsPayload,
  callbacks?: {
    onEnded?: () => void;
    onError?: (err: Error) => void;
    playbackRate?: number;
  }
): Promise<ActiveAudioHandle> {
  const safeRate =
    typeof callbacks?.playbackRate === 'number' &&
    Number.isFinite(callbacks.playbackRate) &&
    callbacks.playbackRate >= 0.5 &&
    callbacks.playbackRate <= 2
      ? callbacks.playbackRate
      : 1;
  // 1. Prefer Web Audio API when AudioContext can enter 'running' state (immune to async fetch gesture expiry on mobile)
  const AudioCtx = getAudioContextConstructor();
  if (AudioCtx) {
    try {
      if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
        sharedAudioCtx = new AudioCtx();
      }
      if (sharedAudioCtx.state === 'suspended') {
        await Promise.race([
          sharedAudioCtx.resume().catch(() => {}),
          new Promise<void>((resolve) => setTimeout(resolve, 220)),
        ]);
      }
      if (sharedAudioCtx.state === 'running') {
        const arrayBuf = payload.bytes.slice().buffer;
        const audioBuffer = await sharedAudioCtx.decodeAudioData(arrayBuf);
        const source = sharedAudioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.playbackRate.value = safeRate;
        source.connect(sharedAudioCtx.destination);

        let stoppedManually = false;
        source.onended = () => {
          if (!stoppedManually) {
            callbacks?.onEnded?.();
          }
        };
        source.start(0);

        return {
          engine: 'webaudio',
          stop: () => {
            stoppedManually = true;
            try {
              source.onended = null;
              source.stop();
              source.disconnect();
            } catch {
              /* already stopped */
            }
          },
        };
      }
    } catch {
      /* fall through to HTMLAudioElement */
    }
  }

  // 2. Fallback to persistent unlocked HTMLAudioElement
  if (typeof Audio === 'undefined') {
    throw new Error('Audio playback is not supported in this browser environment.');
  }

  const blob = new Blob([payload.bytes as BlobPart], {
    type: payload.mimeType || 'audio/wav',
  });
  const objectUrl = URL.createObjectURL(blob);
  const audio = sharedHtmlAudio || new Audio();
  sharedHtmlAudio = audio;
  audio.pause();
  audio.muted = false;
  audio.volume = 1;
  audio.playbackRate = safeRate;
  audio.setAttribute('playsinline', 'true');
  audio.src = objectUrl;

  let cleanedUp = false;
  const cleanupUrl = () => {
    if (!cleanedUp) {
      cleanedUp = true;
      URL.revokeObjectURL(objectUrl);
    }
  };

  audio.onended = () => {
    cleanupUrl();
    callbacks?.onEnded?.();
  };
  audio.onerror = () => {
    cleanupUrl();
    callbacks?.onError?.(new Error('Browser could not play the voice greeting.'));
  };

  try {
    await audio.play();
  } catch (err) {
    cleanupUrl();
    throw err instanceof Error ? err : new Error('Tap Play voice greeting to start audio.');
  }

  return {
    engine: 'htmlaudio',
    stop: () => {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch {
        /* ignore */
      }
      cleanupUrl();
    },
  };
}
