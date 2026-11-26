import type { LabFoleyCue, LabFoleyKind } from './labAudioLogic';

let ctx: AudioContext | null = null;
let masterOut: GainNode | null = null;

function ac(muted: boolean): AudioContext | null {
  if (muted || typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.knee.value = 18;
      comp.ratio.value = 4;
      comp.attack.value = 0.003;
      comp.release.value = 0.15;

      masterOut = ctx.createGain();
      masterOut.gain.value = 0.72;
      masterOut.connect(comp);
      comp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  } catch {
    return null;
  }
}

interface VoiceOpts {
  f: number;
  f2?: number;
  d: number;
  g?: number;
  at?: number;
  type?: OscillatorType;
  lp?: number;
}

function voice(c: AudioContext, o: VoiceOpts, dest: AudioNode | null = masterOut) {
  if (!dest) return;
  const t = c.currentTime + Math.max(0, o.at || 0);
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = o.type || 'sine';
  osc.frequency.setValueAtTime(Math.max(24, o.f), t);
  if (o.f2) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(24, o.f2), t + o.d * 0.85);
  }
  const peak = o.g ?? 0.14;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + Math.min(0.008, o.d * 0.25));
  g.gain.exponentialRampToValueAtTime(0.0001, t + o.d);

  if (o.lp) {
    const flt = c.createBiquadFilter();
    flt.type = 'lowpass';
    flt.frequency.setValueAtTime(o.lp, t);
    osc.connect(flt);
    flt.connect(g);
  } else {
    osc.connect(g);
  }
  g.connect(dest);
  osc.start(t);
  osc.stop(t + o.d + 0.03);
}

interface FilteredNoiseOpts {
  d: number;
  filterType?: BiquadFilterType;
  f: number;
  f2?: number;
  q?: number;
  g?: number;
  at?: number;
  attack?: number;
  decayPower?: number;
}

function shapedNoise(c: AudioContext, o: FilteredNoiseOpts, dest: AudioNode | null = masterOut) {
  if (!dest) return;
  const t = c.currentTime + Math.max(0, o.at || 0);
  const len = Math.max(16, Math.floor(c.sampleRate * o.d));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const ch = buf.getChannelData(0);
  const p = o.decayPower ?? 1.4;
  for (let i = 0; i < len; i++) {
    const prog = i / len;
    const grain = 0.72 + 0.28 * Math.sin(i * 0.043);
    ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - prog * 0.65, p) * grain;
  }

  const src = c.createBufferSource();
  src.buffer = buf;

  const flt = c.createBiquadFilter();
  flt.type = o.filterType || 'bandpass';
  flt.Q.setValueAtTime(o.q ?? 1.8, t);
  flt.frequency.setValueAtTime(o.f, t);
  if (o.f2) {
    flt.frequency.exponentialRampToValueAtTime(Math.max(60, o.f2), t + o.d * 0.92);
  }

  const g = c.createGain();
  const peak = o.g ?? 0.08;
  const atk = Math.min(o.attack ?? 0.012, o.d * 0.35);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + atk);
  g.gain.setValueAtTime(peak * 0.85, t + Math.max(atk, o.d * 0.72));
  g.gain.exponentialRampToValueAtTime(0.0001, t + o.d);

  src.connect(flt);
  flt.connect(g);
  g.connect(dest);
  src.start(t);
  src.stop(t + o.d + 0.03);
}

export function bell(
  c: AudioContext,
  f: number,
  at = 0,
  dur = 0.34,
  gain = 0.12,
  dest: AudioNode | null = masterOut
) {
  // Clear glass bell: pure sine fundamental + shimmering harmonic partials
  voice(c, { type: 'sine', f, d: dur, g: gain, at }, dest);
  voice(c, { type: 'sine', f: f * 2, d: dur * 0.58, g: gain * 0.28, at }, dest);
  voice(c, { type: 'sine', f: f * 3.01, d: dur * 0.32, g: gain * 0.12, at: at + 0.002 }, dest);
}

export function bubble(
  c: AudioContext,
  f = 420,
  at = 0,
  gain = 0.065,
  dest: AudioNode | null = masterOut
) {
  // Soft upward pitch-chirp bubble pop
  voice(c, { type: 'sine', f, f2: f * 1.82, d: 0.046, g: gain, at, lp: 2400 }, dest);
}

export function knock(
  c: AudioContext,
  f = 780,
  at = 0,
  gain = 0.075,
  dest: AudioNode | null = masterOut
) {
  // Warm resonant woodblock knock
  voice(c, { type: 'triangle', f, f2: f * 0.72, d: 0.048, g: gain, at, lp: 2200 }, dest);
  shapedNoise(
    c,
    { d: 0.012, filterType: 'bandpass', f: f * 2.1, q: 3.4, g: gain * 0.35, at, attack: 0.001, decayPower: 3.8 },
    dest
  );
}

export function sparkle(
  c: AudioContext,
  baseFreq = 1046.5,
  at = 0,
  gain = 0.055,
  dest: AudioNode | null = masterOut
) {
  // Light ascending glass sparkle arpeggio
  const ratios = [1, 1.25, 1.5, 2];
  ratios.forEach((r, idx) => {
    const start = at + idx * 0.04;
    voice(c, { type: 'sine', f: baseFreq * r, d: 0.22, g: gain * (1 - idx * 0.12), at: start }, dest);
  });
}

function marimbaNote(c: AudioContext, f: number, at: number, gain = 0.13, dest: AudioNode | null = masterOut) {
  voice(c, { type: 'sine', f, d: 0.34, g: gain, at }, dest);
  voice(c, { type: 'triangle', f: f * 2, d: 0.18, g: gain * 0.28, at, lp: 3600 }, dest);
  voice(c, { type: 'sine', f: f * 3.98, d: 0.065, g: gain * 0.12, at }, dest);
  shapedNoise(c, { d: 0.014, filterType: 'bandpass', f: 2600, q: 2.2, g: gain * 0.16, at, decayPower: 3 }, dest);
}

export type SoundEffectName =
  | 'tap'
  | 'step'
  | 'chalk'
  | 'draw'
  | 'right'
  | 'wrong'
  | 'hit'
  | 'slam'
  | 'tick'
  | 'lose'
  | 'done'
  | 'shimmer'
  | 'win'
  | 'fanfare'
  | 'callConnect'
  | 'callEnd';

let lastTapAtMs = -Infinity;
export const TAP_MIN_INTERVAL_MS = 90;

export function sfx(name: SoundEffectName, muted = false, n?: number) {
  if (muted) return;

  if (name === 'tap') {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now - lastTapAtMs < TAP_MIN_INTERVAL_MS) return;
    lastTapAtMs = now;
    const c = ac(muted);
    if (!c) return;
    bubble(c, 430, 0, 0.055);
    return;
  }

  const c = ac(muted);
  if (!c) return;
  const pentatonic = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];

  if (name === 'step') {
    // Soft air swish plus a bubble pop
    shapedNoise(c, {
      d: 0.09,
      filterType: 'bandpass',
      f: 920,
      f2: 1680,
      q: 1.8,
      g: 0.036,
      attack: 0.012,
      decayPower: 1.5,
    });
    bubble(c, 470, 0.035, 0.055);
  } else if (name === 'chalk') {
    shapedNoise(c, { d: 0.028, filterType: 'bandpass', f: 3100, q: 2.8, g: 0.045, attack: 0.002, decayPower: 2.6 });
  } else if (name === 'draw') {
    const count = Math.min(4, Math.max(1, n || 1));
    for (let i = 0; i < count; i++) {
      const f = 1480 + i * 210;
      voice(c, { type: 'sine', f, f2: f * 0.88, d: 0.055, g: 0.065, at: i * 0.045 });
    }
  } else if (name === 'right' || name === 'hit') {
    const streak = Math.max(1, n || 1);
    const semi = pentatonic[Math.min(streak - 1, pentatonic.length - 1)];
    const root = 523.25 * Math.pow(2, semi / 12);
    bell(c, root, 0, 0.3, 0.11);
    bell(c, root * 1.5, 0.075, 0.36, 0.125);
    if (streak >= 3) {
      sparkle(c, root * 2, 0.12, 0.05);
    }
  } else if (name === 'wrong') {
    // Soft triangle-wave "bwop-bwop", never harsh
    voice(c, { type: 'triangle', f: 310, f2: 262, d: 0.12, g: 0.085, at: 0, lp: 780 });
    voice(c, { type: 'triangle', f: 262, f2: 208, d: 0.16, g: 0.085, at: 0.105, lp: 680 });
  } else if (name === 'slam') {
    bell(c, 523.25, 0, 0.28, 0.1);
    bell(c, 783.99, 0.055, 0.34, 0.11);
  } else if (name === 'tick') {
    // Woodblock knock that gets more urgent in the last 10 seconds
    const remaining = typeof n === 'number' ? n : 30;
    if (remaining <= 10) {
      const urgency = Math.max(0, Math.min(1, (10 - remaining) / 10));
      const baseFreq = 860 + urgency * 240;
      knock(c, baseFreq, 0, 0.085 + urgency * 0.025);
      if (remaining <= 5) {
        knock(c, baseFreq * 1.12, 0.11, 0.055);
      }
    } else {
      knock(c, 760, 0, 0.06);
    }
  } else if (name === 'lose') {
    [392, 349.23, 293.66].forEach((f, i) => {
      voice(c, { type: 'triangle', f, d: 0.2, g: 0.08, at: i * 0.1, lp: 920 });
    });
  } else if (name === 'done') {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      bell(c, f, i * 0.07, 0.3, 0.1);
    });
  } else if (name === 'shimmer') {
    [659.25, 783.99, 987.77, 1318.51].forEach((f, i) => {
      bell(c, f, i * 0.055, 0.34, 0.085);
    });
    sparkle(c, 1318.51, 0.18, 0.045);
  } else if (name === 'win') {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    const times = [0, 0.075, 0.15, 0.23, 0.33];
    notes.forEach((f, i) => {
      bell(c, f, times[i], i === notes.length - 1 ? 0.44 : 0.28, i === notes.length - 1 ? 0.13 : 0.1);
    });
  } else if (name === 'fanfare') {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    const times = [0, 0.065, 0.13, 0.2, 0.29, 0.4];
    notes.forEach((f, i) => {
      bell(c, f, times[i], i === notes.length - 1 ? 0.48 : 0.3, i >= 4 ? 0.125 : 0.1);
    });
    sparkle(c, 1046.5, 0.4, 0.05);
  } else if (name === 'callConnect') {
    // Warm two-note handset pickup chime when the teacher answers
    voice(c, { type: 'sine', f: 587.33, d: 0.11, g: 0.095, at: 0 });
    voice(c, { type: 'sine', f: 880, d: 0.18, g: 0.11, at: 0.085 });
  } else if (name === 'callEnd') {
    // Classic crisp 3-tone descending phone hang-up sound ("beep-boop-bop") + handset click
    const notes = [493.88, 369.99, 277.18];
    notes.forEach((f, idx) => {
      const start = idx * 0.105;
      voice(c, { type: 'sine', f, d: 0.1, g: 0.145, at: start });
      voice(c, { type: 'triangle', f: f * 2, d: 0.08, g: 0.04, at: start, lp: 1800 });
    });
    knock(c, 520, 0.31, 0.05);
  }
}

function scheduleDoubleRingBurst(c: AudioContext, dest: GainNode) {
  // Dual-frequency ITU/UK/NG phone ringback (400 Hz + 450 Hz) in a "ring-ring" cadence
  const bursts = [0.04, 0.58];
  for (const offset of bursts) {
    const start = c.currentTime + offset;
    const dur = 0.38;

    const oscA = c.createOscillator();
    const oscB = c.createOscillator();
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    const ringGain = c.createGain();
    const lp = c.createBiquadFilter();

    oscA.type = 'sine';
    oscB.type = 'sine';
    oscA.frequency.setValueAtTime(400, start);
    oscB.frequency.setValueAtTime(450, start);

    // Subtle 20 Hz telephone cadence shimmer
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(20, start);
    lfoGain.gain.setValueAtTime(0.025, start);

    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(1600, start);

    ringGain.gain.setValueAtTime(0.0001, start);
    ringGain.gain.linearRampToValueAtTime(0.115, start + 0.02);
    ringGain.gain.setValueAtTime(0.115, start + dur - 0.035);
    ringGain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

    lfo.connect(lfoGain);
    lfoGain.connect(ringGain.gain);

    oscA.connect(lp);
    oscB.connect(lp);
    lp.connect(ringGain);
    ringGain.connect(dest);

    oscA.start(start);
    oscB.start(start);
    lfo.start(start);

    oscA.stop(start + dur + 0.03);
    oscB.stop(start + dur + 0.03);
    lfo.stop(start + dur + 0.03);
  }
}

/**
 * Starts an authentic telephone calling ringback tone ("ring-ring ... ring-ring")
 * when calling the Live Tutor, returning an instant stop/cleanup function.
 */
export function startTeacherCallRing(muted = false): () => void {
  const c = ac(muted);
  if (!c || !masterOut) return () => {};

  const callBus = c.createGain();
  callBus.gain.value = 1;
  callBus.connect(masterOut);

  // Brief keypad dial touch + immediate first double-ring
  voice(c, { type: 'sine', f: 697, d: 0.055, g: 0.06, at: 0 }, callBus);
  voice(c, { type: 'sine', f: 1209, d: 0.055, g: 0.05, at: 0 }, callBus);
  scheduleDoubleRingBurst(c, callBus);

  const intervalId = window.setInterval(() => {
    if (c.state === 'suspended') {
      c.resume().catch(() => {});
    }
    scheduleDoubleRingBurst(c, callBus);
  }, 2500);

  let stopped = false;
  return () => {
    if (stopped) return;
    stopped = true;
    window.clearInterval(intervalId);
    try {
      const now = c.currentTime;
      callBus.gain.cancelScheduledValues(now);
      callBus.gain.setValueAtTime(callBus.gain.value, now);
      callBus.gain.linearRampToValueAtTime(0.0001, now + 0.03);
      window.setTimeout(() => {
        try {
          callBus.disconnect();
        } catch {
          /* ignore */
        }
      }, 50);
    } catch {
      /* ignore */
    }
  };
}

function triggerSingleFoleyCue(c: AudioContext, kind: LabFoleyKind, dur: number, accent = 0.5, dest: GainNode) {
  switch (kind) {
    case 'rulerSlide': {
      // Smooth acrylic ruler glide + light settle tap onto chalkboard
      shapedNoise(c, { d: 0.16, filterType: 'bandpass', f: 920, f2: 1480, q: 2.2, g: 0.055, attack: 0.02, decayPower: 1.2 }, dest);
      shapedNoise(c, { d: 0.014, filterType: 'bandpass', f: 2950, q: 3.2, g: 0.065, at: 0.16, attack: 0.001, decayPower: 3.5 }, dest);
      voice(c, { type: 'triangle', f: 920, f2: 740, d: 0.024, g: 0.035, at: 0.16, lp: 2000 }, dest);
      break;
    }
    case 'chalkDraw': {
      // Textured chalk / graphite stroke gliding across the board for exact stroke duration
      const d = Math.max(0.18, Math.min(2.6, dur));
      const fBase = 2350 + accent * 450;
      shapedNoise(c, { d, filterType: 'bandpass', f: fBase, f2: fBase * 1.14, q: 2.4, g: 0.058, attack: 0.018, decayPower: 0.55 }, dest);
      shapedNoise(c, { d, filterType: 'bandpass', f: 1120, f2: 1280, q: 1.6, g: 0.03, attack: 0.02, decayPower: 0.5 }, dest);
      break;
    }
    case 'compassSet': {
      // Precision brass compass needle pin set
      voice(c, { type: 'sine', f: 3650, f2: 2400, d: 0.028, g: 0.05 }, dest);
      shapedNoise(c, { d: 0.012, filterType: 'highpass', f: 3800, q: 1.5, g: 0.045, attack: 0.001, decayPower: 3.5 }, dest);
      break;
    }
    case 'compassSweep': {
      // Smooth rotational compass pencil arc sweep
      const d = Math.max(0.35, Math.min(2.4, dur));
      shapedNoise(c, { d, filterType: 'bandpass', f: 2900, f2: 3450, q: 3.1, g: 0.048, attack: 0.025, decayPower: 0.5 }, dest);
      break;
    }
    case 'protractorSet': {
      // Clear acrylic protractor set onto board
      shapedNoise(c, { d: 0.09, filterType: 'bandpass', f: 1200, f2: 1650, q: 2, g: 0.045, attack: 0.01, decayPower: 1.5 }, dest);
      voice(c, { type: 'triangle', f: 1320, f2: 980, d: 0.026, g: 0.045, at: 0.085, lp: 2600 }, dest);
      break;
    }
    case 'pencilDot': {
      // Crisp pencil/chalk point mark
      const pitch = 1350 + accent * 320;
      shapedNoise(c, { d: 0.016, filterType: 'bandpass', f: 2800, q: 2.8, g: 0.055, attack: 0.001, decayPower: 3.5 }, dest);
      voice(c, { type: 'triangle', f: pitch, f2: pitch * 0.78, d: 0.022, g: 0.04, lp: 2500 }, dest);
      break;
    }
    case 'angleChime': {
      // Subtle warm verification ping when an angle / 90-degree square appears
      marimbaNote(c, 880, 0, 0.075, dest);
      marimbaNote(c, 1318.5, 0.045, 0.065, dest);
      break;
    }
    case 'chalkShade': {
      // Broad side-of-chalk shading brush strokes
      for (let i = 0; i < 3; i++) {
        shapedNoise(
          c,
          { d: 0.16, filterType: 'bandpass', f: 1650 + i * 180, q: 1.4, g: 0.048, at: i * 0.16, attack: 0.02, decayPower: 1.1 },
          dest
        );
      }
      break;
    }
    case 'glassClink': {
      // Borosilicate laboratory beaker / flask modal ring
      voice(c, { type: 'sine', f: 2480, d: 0.13, g: 0.065, at: 0 }, dest);
      voice(c, { type: 'sine', f: 3790, d: 0.085, g: 0.04, at: 0.002 }, dest);
      voice(c, { type: 'sine', f: 5240, d: 0.045, g: 0.022, at: 0.003 }, dest);
      break;
    }
    case 'liquidPour': {
      // Rising vessel resonance as reagent/water fills beaker, burette, or flask
      const d = Math.max(0.5, Math.min(2.6, dur));
      shapedNoise(c, { d, filterType: 'bandpass', f: 460, f2: 960, q: 4.5, g: 0.075, attack: 0.05, decayPower: 0.6 }, dest);
      shapedNoise(c, { d, filterType: 'bandpass', f: 1400, f2: 2200, q: 2.2, g: 0.032, attack: 0.05, decayPower: 0.7 }, dest);
      break;
    }
    case 'liquidDrain': {
      // Gentle burette / funnel draining resonance
      const d = Math.max(0.5, Math.min(2.6, dur));
      shapedNoise(c, { d, filterType: 'bandpass', f: 880, f2: 460, q: 4.2, g: 0.055, attack: 0.05, decayPower: 0.7 }, dest);
      break;
    }
    case 'droplet': {
      // Authentic meniscus water/reagent drop "plink!" (upward sine chirp)
      const f0 = 620 + accent * 140;
      voice(c, { type: 'sine', f: f0, f2: f0 * 2.15, d: 0.044, g: 0.085 }, dest);
      break;
    }
    case 'bubbles': {
      // Organic effervescent gas evolution (stochastic micro-bubble pops)
      const count = 11;
      for (let i = 0; i < count; i++) {
        const at = i * 0.13 + (i % 3) * 0.025;
        const f0 = 540 + ((i * 173) % 680);
        voice(c, { type: 'sine', f: f0, f2: f0 * 1.85, d: 0.038, g: 0.048, at }, dest);
      }
      break;
    }
    case 'bunsenIgnite': {
      // Bunsen gas ignition soft whoosh + warm low flame air
      shapedNoise(c, { d: 0.28, filterType: 'bandpass', f: 680, f2: 260, q: 1.2, g: 0.085, attack: 0.02, decayPower: 1.5 }, dest);
      shapedNoise(c, { d: 1.05, filterType: 'lowpass', f: 340, f2: 240, q: 0.9, g: 0.05, at: 0.14, attack: 0.06, decayPower: 0.8 }, dest);
      break;
    }
    case 'chemShimmer': {
      // Crystalline harmonic chord for precipitate, crystals, flame test colour, or titration end-point
      const base = 1046.5 * Math.pow(2, (accent * 2) / 12);
      [base, base * 1.25, base * 1.5].forEach((f, idx) => {
        voice(c, { type: 'sine', f, d: 0.36, g: 0.055, at: idx * 0.055 }, dest);
      });
      break;
    }
  }
}

/**
 * Schedules synchronized foley cues for a Lab step and returns an instant cleanup function
 * so stepping, pausing, or leaving immediately silences any pending or active Lab audio.
 */
export function playLabFoleySchedule(cues: LabFoleyCue[], muted = false): () => void {
  const c = ac(muted);
  if (!c || !masterOut || !cues.length) return () => {};

  const stepBus = c.createGain();
  stepBus.gain.value = 1;
  stepBus.connect(masterOut);

  const timers: number[] = [];
  for (const cue of cues) {
    const ms = Math.max(0, Math.round(cue.at * 1000));
    const tid = window.setTimeout(() => {
      triggerSingleFoleyCue(c, cue.kind, cue.dur, cue.accent ?? 0.5, stepBus);
    }, ms);
    timers.push(tid);
  }

  return () => {
    timers.forEach((id) => window.clearTimeout(id));
    try {
      const now = c.currentTime;
      stepBus.gain.cancelScheduledValues(now);
      stepBus.gain.setValueAtTime(stepBus.gain.value, now);
      stepBus.gain.linearRampToValueAtTime(0.0001, now + 0.04);
      window.setTimeout(() => {
        try {
          stepBus.disconnect();
        } catch {
          /* ignore */
        }
      }, 60);
    } catch {
      /* ignore */
    }
  };
}

export function playWelcomeChord(muted = false) {
  const c = ac(muted);
  if (!c || !masterOut) return;
  // Warm ascending major-9th crystal bell welcome chord (C5 -> E5 -> G5 -> D6)
  bell(c, 523.25, 0.0, 0.48, 0.065, masterOut);
  bell(c, 659.25, 0.065, 0.46, 0.06, masterOut);
  bell(c, 783.99, 0.13, 0.5, 0.065, masterOut);
  bell(c, 1174.66, 0.2, 0.62, 0.055, masterOut);
}

export function buzz(pattern: number | number[], muted = false) {
  if (muted) return;
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}
