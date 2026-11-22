import React, { useRef, useState } from 'react';
import type { SubjectId } from '../../types';

interface PianoKey {
  note: string;
  freq: number;
  isBlack: boolean;
}

const PIANO_KEYS: readonly PianoKey[] = [
  { note: 'C4', freq: 261.63, isBlack: false },
  { note: 'C#4', freq: 277.18, isBlack: true },
  { note: 'D4', freq: 293.66, isBlack: false },
  { note: 'D#4', freq: 311.13, isBlack: true },
  { note: 'E4', freq: 329.63, isBlack: false },
  { note: 'F4', freq: 349.23, isBlack: false },
  { note: 'F#4', freq: 369.99, isBlack: true },
  { note: 'G4', freq: 392.0, isBlack: false },
  { note: 'G#4', freq: 415.3, isBlack: true },
  { note: 'A4', freq: 440.0, isBlack: false },
  { note: 'A#4', freq: 466.16, isBlack: true },
  { note: 'B4', freq: 493.88, isBlack: false },
  { note: 'C5', freq: 523.25, isBlack: false },
];

const NIGERIAN_INSTRUMENTS = [
  { name: 'Dundun / Gangan (Talking drum)', family: 'Membranophone', note: 'Hourglass double-headed drum whose pitch mimics Yoruba speech tones.' },
  { name: 'Udu (Clay pot drum)', family: 'Idiophone / Aerophone', note: 'Igbo clay vessel played by slapping the side hole and top mouth.' },
  { name: 'Goje (One-string fiddle)', family: 'Chordophone', note: 'Bowed Hausa gourd fiddle covered with reptile skin.' },
  { name: 'Kakaki (Long trumpet)', family: 'Aerophone', note: 'Metal ceremonial trumpet played at northern emirate courts.' },
  { name: 'Sekere (Beaded gourd)', family: 'Idiophone', note: 'Shaken gourd wrapped in a net of beads or cowries.' },
  { name: 'Ogene (Metal gong)', family: 'Idiophone', note: 'Struck iron bell that anchors rhythmic timelines in Igbo ensembles.' },
];

function hslToHex(h: number, s: number, l: number): string {
  const hue = ((h % 360) + 360) % 360;
  const sat = s / 100;
  const lig = l / 100;
  const c = (1 - Math.abs(2 * lig - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lig - c / 2;
  let r = 0, g = 0, b = 0;
  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

const NIGERIAN_ART_ATLAS = [
  { name: 'Nok Culture', era: 'c. 500 BC – 200 AD', medium: 'Terracotta (baked clay)', hallmark: 'Triangular/pierced eyes and elaborate hairstyles; oldest figurative sculpture in sub-Saharan Africa.' },
  { name: 'Igbo-Ukwu', era: '9th century AD', medium: 'Leaded bronze (lost-wax)', hallmark: 'Intricate roped water pots, snail-shell vessels, and coiled insect motifs.' },
  { name: 'Ancient Ife', era: '12th–15th century', medium: 'Brass, copper & terracotta', hallmark: 'Idealised naturalism, vertical facial striations, and serene royal heads.' },
  { name: 'Benin Court Art', era: '14th–19th century', medium: 'Brass plaques & ivory', hallmark: 'Commemorative Oba heads, palace narrative plaques, and Queen Mother Idia ivory mask.' },
  { name: 'Esie Stone Figures', era: 'c. 11th–15th century', medium: 'Soapstone (steatite)', hallmark: 'Over 800 seated human stone sculptures discovered in Kwara State.' },
  { name: 'Zaria Art Society', era: '1958–1961', medium: 'Painting & sculpture', hallmark: 'Natural Synthesis led by Uche Okeke, Bruce Onobrakpeya & Demas Nwoko blending Nigerian heritage with modern craft.' },
];

export function MusicAndArtStudio({ subj }: { subj: SubjectId }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const [lastPlayed, setLastPlayed] = useState<string>('Tap any piano key or chord below');
  const [hue, setHue] = useState<number>(262);
  const [harmony, setHarmony] = useState<'complementary' | 'analogous' | 'triadic'>('complementary');

  const playFreq = (freq: number, delay = 0, duration = 0.55) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!ctxRef.current) ctxRef.current = new AudioCtx();
      const ctx = ctxRef.current;
      if (ctx.state === 'suspended') void ctx.resume();
      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.24, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      /* audio blocked */
    }
  };

  const playSequence = (label: string, freqs: number[], chord = false) => {
    setLastPlayed(label);
    freqs.forEach((f, idx) => playFreq(f, chord ? 0 : idx * 0.22, chord ? 0.9 : 0.4));
  };

  if (subj === 'music') {
    const whiteKeys = PIANO_KEYS.filter((k) => !k.isBlack);
    const blackKeys = PIANO_KEYS.filter((k) => k.isBlack);
    return (
      <div className="flex flex-col gap-5">
        <section className="rtc-card rounded-[28px] p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h2 className="h22 text-[var(--ink)]">Playable piano keyboard</h2>
              <p className="text-[13.5px] text-[var(--dim)]">
                Hear pitches, intervals, scales and triads directly in your browser
              </p>
            </div>
            <span className="tile-peach px-3.5 py-1.5 rounded-full text-[12.5px] font-bold">
              {lastPlayed}
            </span>
          </div>

          {/* White keys */}
          <div className="grid grid-cols-8 gap-1.5" role="group" aria-label="White piano keys">
            {whiteKeys.map((k) => (
              <button
                key={k.note}
                type="button"
                data-no-sound="true"
                onClick={() => {
                  setLastPlayed(`Note ${k.note} (${Math.round(k.freq)} Hz)`);
                  playFreq(k.freq);
                }}
                className="h-28 sm:h-32 rounded-b-[16px] rounded-t-[8px] bg-white border-2 border-[var(--line)] shadow-[0_4px_0_var(--line)] active:translate-y-[2px] flex flex-col items-center justify-end pb-2.5 text-[#241A45] font-extrabold text-[13px] cursor-pointer"
              >
                {k.note}
              </button>
            ))}
          </div>

          {/* Sharps / Flats row */}
          <div className="grid grid-cols-5 gap-2" role="group" aria-label="Sharp piano keys">
            {blackKeys.map((k) => (
              <button
                key={k.note}
                type="button"
                data-no-sound="true"
                onClick={() => {
                  setLastPlayed(`Sharp ${k.note} (${Math.round(k.freq)} Hz)`);
                  playFreq(k.freq);
                }}
                className="min-h-[44px] rounded-[14px] bg-[#241A45] text-white border-2 border-[#3E1A9E] shadow-[0_3px_0_#0E0A1F] active:translate-y-[1px] font-bold text-[12.5px] cursor-pointer"
              >
                {k.note}
              </button>
            ))}
          </div>

          {/* Scales & Chords */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--line)]">
            <button
              type="button"
              data-no-sound="true"
              onClick={() => playSequence('C Major scale (T-T-S-T-T-T-S)', [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25])}
              className="btn-tactile paper text-[13px] py-2 px-3.5"
            >
              Play C Major scale
            </button>
            <button
              type="button"
              data-no-sound="true"
              onClick={() => playSequence('Pentatonic scale (5 notes)', [261.63, 293.66, 329.63, 392, 440, 523.25])}
              className="btn-tactile paper text-[13px] py-2 px-3.5"
            >
              Play Pentatonic
            </button>
            <button
              type="button"
              data-no-sound="true"
              onClick={() => playSequence('C Major triad (C–E–G)', [261.63, 329.63, 392], true)}
              className="btn-tactile paper text-[13px] py-2 px-3.5"
            >
              C Major chord
            </button>
            <button
              type="button"
              data-no-sound="true"
              onClick={() => playSequence('D Minor triad (D–F–A)', [293.66, 349.23, 440], true)}
              className="btn-tactile paper text-[13px] py-2 px-3.5"
            >
              D Minor chord
            </button>
            <button
              type="button"
              data-no-sound="true"
              onClick={() => {
                setLastPlayed('Perfect cadence (V → I: G major to C major)');
                [392, 493.88, 587.33].forEach((f) => playFreq(f, 0, 0.55));
                [261.63, 329.63, 392].forEach((f) => playFreq(f, 0.6, 0.85));
              }}
              className="btn-tactile indigo text-[13px] py-2 px-3.5"
            >
              Perfect cadence (V → I)
            </button>
          </div>
        </section>

        <section className="rtc-card rounded-[26px] p-5 flex flex-col gap-3">
          <h3 className="h18 text-[var(--ink)]">Nigerian musical instruments (Hornbostel–Sachs)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {NIGERIAN_INSTRUMENTS.map((inst) => (
              <div key={inst.name} className="rounded-[18px] bg-[var(--bg)] border-2 border-[var(--line)] p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-[14.5px] text-[var(--ink)]">{inst.name}</span>
                  <span className="tile-sky px-2.5 py-0.5 rounded-full text-[11.5px] font-bold">{inst.family}</span>
                </div>
                <p className="text-[13px] text-[var(--dim)] mt-1">{inst.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Fine Art: Colour Wheel & Harmony Mixer + Nigerian Art Atlas
  const swatchHues =
    harmony === 'complementary'
      ? [hue, (hue + 180) % 360]
      : harmony === 'analogous'
        ? [(hue + 330) % 360, hue, (hue + 30) % 360]
        : [hue, (hue + 120) % 360, (hue + 240) % 360];

  const isWarm = hue < 90 || hue >= 300;

  return (
    <div className="flex flex-col gap-5">
      <section className="rtc-card rounded-[28px] p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h2 className="h22 text-[var(--ink)]">Colour wheel & harmony mixer</h2>
            <p className="text-[13.5px] text-[var(--dim)]">
              Slide the base hue to explore complementary, analogous, and triadic colour schemes
            </p>
          </div>
          <span className={isWarm ? 'tile-peach px-3.5 py-1 rounded-full text-[12.5px] font-bold' : 'tile-sky px-3.5 py-1 rounded-full text-[12.5px] font-bold'}>
            {isWarm ? 'Warm colour family' : 'Cool colour family'}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="art-hue-slider" className="text-[13px] font-bold text-[var(--ink)]">
            Base hue angle: {hue}° ({hslToHex(hue, 72, 48)})
          </label>
          <input
            id="art-hue-slider"
            type="range"
            min={0}
            max={359}
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            className="w-full accent-[var(--gold)]"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['complementary', 'analogous', 'triadic'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setHarmony(mode)}
              className={`min-h-[42px] rounded-[16px] border-2 font-bold text-[13px] capitalize cursor-pointer ${
                harmony === mode
                  ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--acc-d)]'
                  : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {swatchHues.map((h, i) => {
            const hex = hslToHex(h, 72, 48);
            return (
              <div key={i} className="rounded-[20px] border-2 border-[var(--line)] overflow-hidden bg-[var(--bg)]">
                <div className="h-20 w-full" style={{ backgroundColor: hex }} />
                <div className="p-3 flex items-center justify-between">
                  <span className="font-bold text-[13.5px] text-[var(--ink)]">{hex}</span>
                  <span className="text-[12px] text-[var(--dim)]">{h}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rtc-card rounded-[26px] p-5 flex flex-col gap-3">
        <h3 className="h18 text-[var(--ink)]">Nigerian art traditions atlas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {NIGERIAN_ART_ATLAS.map((item) => (
            <div key={item.name} className="rounded-[18px] bg-[var(--bg)] border-2 border-[var(--line)] p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-[15px] text-[var(--ink)]">{item.name}</span>
                <span className="tile-mint px-2.5 py-0.5 rounded-full text-[11.5px] font-bold">{item.era}</span>
              </div>
              <div className="text-[12.5px] font-bold text-[var(--gold)] mt-1">{item.medium}</div>
              <p className="text-[13px] text-[var(--dim)] mt-1">{item.hallmark}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
