// Procedural Web Audio API bio-acoustic engine for the 3D Circulatory Adventure
// Zero external MP3/WAV dependencies; respects Easy Learn's global mute state.

class CirculatoryBioAudioEngine {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private ensureContext(muted?: boolean): AudioContext | null {
    if (muted || typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (!this.noiseBuffer && this.ctx) {
        const sampleRate = this.ctx.sampleRate;
        const len = Math.floor(sampleRate * 0.35);
        const buf = this.ctx.createBuffer(1, len, sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.14));
        }
        this.noiseBuffer = buf;
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * Plays a realistic cardiac "Lub-Dub" (S1 AV valve closure + S2 semilunar closure),
   * with an optional systolic regurgitation murmur whoosh when valve leak is active.
   */
  public playHeartbeatCycle(bpm: number, hasMurmur: boolean, muted?: boolean): void {
    const ctx = this.ensureContext(muted);
    if (!ctx) return;

    const now = ctx.currentTime;
    const beatPeriod = 60 / Math.max(45, Math.min(170, bpm));
    const s2Offset = Math.min(0.32, Math.max(0.16, beatPeriod * 0.31));

    // S1 ("LUB" - deeper, slightly longer tricuspid + mitral closure)
    this.triggerHeartThump(ctx, now, 66, 34, 0.11, 0.16);

    // Optional systolic murmur (turbulent backflow between S1 and S2)
    if (hasMurmur && this.noiseBuffer) {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(420, now + 0.03);
      filter.Q.setValueAtTime(2.4, now + 0.03);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now + 0.02);
      gain.gain.linearRampToValueAtTime(0.055, now + 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + s2Offset);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      src.start(now + 0.02);
      src.stop(now + s2Offset + 0.02);
    }

    // S2 ("DUB" - crisper, slightly higher aortic + pulmonary semilunar snap)
    this.triggerHeartThump(ctx, now + s2Offset, 92, 48, 0.085, 0.12);
  }

  private triggerHeartThump(
    ctx: AudioContext,
    startTime: number,
    startHz: number,
    endHz: number,
    durationSec: number,
    peakGain: number
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startHz, startTime);
    osc.frequency.exponentialRampToValueAtTime(endHz, startTime + durationSec);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.014);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + durationSec + 0.01);
  }

  /** Smooth blood-vessel surge when advancing to a new chamber or artery */
  public playVesselSurge(oxygenated: boolean, muted?: boolean): void {
    const ctx = this.ensureContext(muted);
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const baseHz = oxygenated ? 310 : 210;
    osc.frequency.setValueAtTime(baseHz * (0.96 + Math.random() * 0.08), now);
    osc.frequency.exponentialRampToValueAtTime(baseHz * 1.48, now + 0.16);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  /** Crystalline rising 4-note chord as 4 O2 molecules bind to haemoglobin in the alveoli */
  public playOxygenExchangeChime(muted?: boolean): void {
    const ctx = this.ensureContext(muted);
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6

    notes.forEach((hz, idx) => {
      const t = now + idx * 0.065;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(hz, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.085, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.36);
    });
  }

  /** Soft elastic septum/valve rebound thud when testing a wrong vessel branch */
  public playValveRebound(muted?: boolean): void {
    const ctx = this.ensureContext(muted);
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, now);

    osc.frequency.setValueAtTime(145, now);
    osc.frequency.exponentialRampToValueAtTime(68, now + 0.18);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  /** Triumphant harmonic fanfare on Mission / Expedition completion */
  public playMissionFanfare(muted?: boolean): void {
    const ctx = this.ensureContext(muted);
    if (!ctx) return;
    const now = ctx.currentTime;
    const chord = [440, 554.37, 659.25, 880]; // A major warm brass-like shimmer

    chord.forEach((hz, idx) => {
      const t = now + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(hz, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.09, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.58);
    });
  }
}

export const circulatoryAudio = new CirculatoryBioAudioEngine();
