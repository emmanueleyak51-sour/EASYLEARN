import React, { useMemo, useState } from 'react';
import type { SubjectId } from '../../types';
import {
  computeBmiAndHr,
  computeFcr,
  computeOhmsLaw,
  convertNumberBase,
  convertOvenTemp,
  estimateWallBlocks,
  evalLogicGate,
  type LogicGateType,
} from '../../utils/studioCalculators';

const GATES: readonly LogicGateType[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR'];

const HACCP_BOARDS = [
  { color: 'Red', use: 'Raw meat', bg: '#FFE4E6', fg: '#8A1C2A' },
  { color: 'Blue', use: 'Raw fish', bg: '#DCEBFF', fg: '#0D3570' },
  { color: 'Yellow', use: 'Cooked meat', bg: '#FEF3C7', fg: '#78350F' },
  { color: 'Green', use: 'Salads & fruit', bg: '#D3F5EA', fg: '#0B4A37' },
  { color: 'Brown', use: 'Root vegetables', bg: '#FFE1D1', fg: '#5C1F00' },
  { color: 'White', use: 'Bakery & dairy', bg: '#F5F1FF', fg: '#241A45' },
];

export function AppliedAndTradesStudio({ subj }: { subj: SubjectId }) {
  // Computing
  const [decVal, setDecVal] = useState<number>(42);
  const [gate, setGate] = useState<LogicGateType>('XOR');
  const [inA, setInA] = useState<0 | 1>(1);
  const [inB, setInB] = useState<0 | 1>(0);

  // PHE
  const [weight, setWeight] = useState<number>(62);
  const [height, setHeight] = useState<number>(170);
  const [age, setAge] = useState<number>(17);

  // Kitchen / Nutrition / Catering
  const [ovenC, setOvenC] = useState<number>(180);

  // Construction / TechDraw / Carpentry / Blocklaying
  const [wallLen, setWallLen] = useState<number>(6);
  const [wallHeight, setWallHeight] = useState<number>(3);
  const [openings, setOpenings] = useState<number>(2);
  const [scaleDenom, setScaleDenom] = useState<number>(50);
  const [realLengthM, setRealLengthM] = useState<number>(5);

  // Electrical / Auto / GSM
  const [volts, setVolts] = useState<number>(230);
  const [ohms, setOhms] = useState<number>(46);

  // Livestock / Fisheries
  const [feedKg, setFeedKg] = useState<number>(140);
  const [gainKg, setGainKg] = useState<number>(100);

  // Vocational (Photo / Garment / Cosmetology / Tourism)
  const [aperture, setAperture] = useState<string>('f/2.8');
  const [shutter, setShutter] = useState<string>('1/250 s');
  const [iso, setIso] = useState<number>(400);
  const [tourGuests, setTourGuests] = useState<number>(25);
  const [costPerGuest, setCostPerGuest] = useState<number>(18500);

  const bases = useMemo(() => convertNumberBase(decVal), [decVal]);
  const gateOut = useMemo(() => evalLogicGate(gate, inA, inB), [gate, inA, inB]);
  const fitness = useMemo(() => computeBmiAndHr(weight, height, age), [weight, height, age]);
  const oven = useMemo(() => convertOvenTemp(ovenC), [ovenC]);
  const wall = useMemo(() => estimateWallBlocks(wallLen, wallHeight, openings), [wallLen, wallHeight, openings]);
  const circuit = useMemo(() => computeOhmsLaw(volts, ohms), [volts, ohms]);
  const fcr = useMemo(() => computeFcr(feedKg, gainKg), [feedKg, gainKg]);

  if (subj === 'comp') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rtc-card rounded-[26px] p-5 flex flex-col gap-4">
          <h2 className="h18 text-[var(--ink)]">Number base converter</h2>
          <label className="flex flex-col gap-1 text-[12.5px] font-bold text-[var(--dim)]">
            Decimal number (0 – 65,535)
            <input type="number" min={0} max={65535} value={decVal} onChange={(e) => setDecVal(Number(e.target.value))} className="min-h-[44px] px-3.5 rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] text-[16px] font-bold text-[var(--ink)]" />
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="tile-peach rounded-[16px] p-3">
              <div className="text-[11.5px] font-bold">Binary (base 2)</div>
              <div className="font-mono font-extrabold text-[15px] break-all">{bases.binary}</div>
            </div>
            <div className="tile-mint rounded-[16px] p-3">
              <div className="text-[11.5px] font-bold">Octal (base 8)</div>
              <div className="font-mono font-extrabold text-[17px]">{bases.octal}</div>
            </div>
            <div className="tile-sky rounded-[16px] p-3">
              <div className="text-[11.5px] font-bold">Hex (base 16)</div>
              <div className="font-mono font-extrabold text-[17px]">0x{bases.hex}</div>
            </div>
          </div>
        </section>

        <section className="rtc-card rounded-[26px] p-5 flex flex-col gap-4">
          <h2 className="h18 text-[var(--ink)]">Live logic gate bench</h2>
          <div className="flex flex-wrap gap-2">
            {GATES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGate(g)}
                className={`px-3 py-1.5 rounded-[14px] border-2 font-bold text-[12.5px] cursor-pointer ${
                  gate === g ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--acc-d)]' : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 bg-[var(--bg)] border-2 border-[var(--line)] rounded-[20px] p-4">
            <div className="flex gap-2">
              <button type="button" onClick={() => setInA(inA ? 0 : 1)} className="btn-tactile paper py-2 px-3.5 text-[13.5px]">
                Input A: {inA}
              </button>
              {gate !== 'NOT' && (
                <button type="button" onClick={() => setInB(inB ? 0 : 1)} className="btn-tactile paper py-2 px-3.5 text-[13.5px]">
                  Input B: {inB}
                </button>
              )}
            </div>
            <div className={`px-4 py-2 rounded-[16px] font-extrabold text-[18px] ${gateOut ? 'tile-mint' : 'tile-peach'}`}>
              Output: {gateOut}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (subj === 'phe') {
    return (
      <section className="rtc-card rounded-[28px] p-5 sm:p-6 flex flex-col gap-4">
        <h2 className="h22 text-[var(--ink)]">Fitness, BMI & target heart-rate studio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex flex-col gap-1 text-[12.5px] font-bold text-[var(--dim)]">
            Weight (kg)
            <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="min-h-[42px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[15px] text-[var(--ink)]" />
          </label>
          <label className="flex flex-col gap-1 text-[12.5px] font-bold text-[var(--dim)]">
            Height (cm)
            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="min-h-[42px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[15px] text-[var(--ink)]" />
          </label>
          <label className="flex flex-col gap-1 text-[12.5px] font-bold text-[var(--dim)]">
            Age (years)
            <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="min-h-[42px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[15px] text-[var(--ink)]" />
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="tile-mint rounded-[18px] p-4">
            <div className="text-[12px] font-bold">Body Mass Index (BMI)</div>
            <div className="text-[26px] font-extrabold">{fitness.bmi}</div>
            <div className="text-[12.5px] font-semibold">{fitness.category}</div>
          </div>
          <div className="tile-peach rounded-[18px] p-4">
            <div className="text-[12px] font-bold">Max heart rate (220 − age)</div>
            <div className="text-[26px] font-extrabold">{fitness.maxHr} bpm</div>
          </div>
          <div className="tile-sky rounded-[18px] p-4">
            <div className="text-[12px] font-bold">Aerobic training zone (60–80%)</div>
            <div className="text-[24px] font-extrabold">{fitness.aerobicMin}–{fitness.aerobicMax} bpm</div>
          </div>
        </div>
      </section>
    );
  }

  if (subj === 'homeec' || subj === 'foodnut' || subj === 'homemgt' || subj === 'catering') {
    return (
      <div className="flex flex-col gap-5">
        <section className="rtc-card rounded-[28px] p-5 sm:p-6 flex flex-col gap-4">
          <h2 className="h22 text-[var(--ink)]">Oven temperature & Gas Mark converter</h2>
          <label className="flex flex-col gap-2 text-[13.5px] font-bold text-[var(--ink)]">
            Temperature: {oven.celsius}°C
            <input type="range" min={110} max={250} step={5} value={ovenC} onChange={(e) => setOvenC(Number(e.target.value))} className="w-full accent-[var(--gold)]" />
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div className="tile-peach rounded-[18px] p-3.5">
              <div className="text-[12px] font-bold">Fahrenheit</div>
              <div className="text-[22px] font-extrabold">{oven.fahrenheit}°F</div>
            </div>
            <div className="tile-mint rounded-[18px] p-3.5">
              <div className="text-[12px] font-bold">Gas Mark</div>
              <div className="text-[22px] font-extrabold">{oven.gasMark}</div>
            </div>
            <div className="tile-sky rounded-[18px] p-3.5">
              <div className="text-[12px] font-bold">Baking stage</div>
              <div className="text-[16px] font-extrabold">{oven.stage}</div>
            </div>
          </div>
        </section>

        <section className="rtc-card rounded-[26px] p-5 flex flex-col gap-3">
          <h3 className="h18 text-[var(--ink)]">HACCP colour-coded chopping boards</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {HACCP_BOARDS.map((b) => (
              <div key={b.color} className="rounded-[16px] p-3.5 font-bold" style={{ backgroundColor: b.bg, color: b.fg }}>
                <div className="text-[15px] font-extrabold">{b.color} board</div>
                <div className="text-[13px] opacity-90">{b.use}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (subj === 'techdraw' || subj === 'carpentry' || subj === 'blocklay') {
    const drawingCm = Math.round(((realLengthM * 100) / Math.max(1, scaleDenom)) * 100) / 100;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rtc-card rounded-[26px] p-5 flex flex-col gap-4">
          <h2 className="h18 text-[var(--ink)]">Sandcrete blockwork & mortar estimator</h2>
          <div className="grid grid-cols-3 gap-2.5">
            <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
              Length (m)
              <input type="number" step="0.5" value={wallLen} onChange={(e) => setWallLen(Number(e.target.value))} className="min-h-[40px] px-2.5 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
            </label>
            <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
              Height (m)
              <input type="number" step="0.5" value={wallHeight} onChange={(e) => setWallHeight(Number(e.target.value))} className="min-h-[40px] px-2.5 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
            </label>
            <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
              Openings (m²)
              <input type="number" step="0.5" value={openings} onChange={(e) => setOpenings(Number(e.target.value))} className="min-h-[40px] px-2.5 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
            </label>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="tile-sky rounded-[16px] p-3">
              <div className="text-[11.5px] font-bold">Net wall area</div>
              <div className="text-[20px] font-extrabold">{wall.netAreaM2} m²</div>
            </div>
            <div className="tile-peach rounded-[16px] p-3">
              <div className="text-[11.5px] font-bold">Blocks (+10%)</div>
              <div className="text-[20px] font-extrabold">{wall.blocksNeeded}</div>
            </div>
            <div className="tile-mint rounded-[16px] p-3">
              <div className="text-[11.5px] font-bold">Cement bags</div>
              <div className="text-[20px] font-extrabold">{wall.mortarCementBags}</div>
            </div>
          </div>
        </section>

        <section className="rtc-card rounded-[26px] p-5 flex flex-col gap-4">
          <h2 className="h18 text-[var(--ink)]">Architectural scale converter</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
              Real wall length (m)
              <input type="number" step="0.5" value={realLengthM} onChange={(e) => setRealLengthM(Number(e.target.value))} className="min-h-[40px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
            </label>
            <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
              Drawing scale
              <select value={scaleDenom} onChange={(e) => setScaleDenom(Number(e.target.value))} className="min-h-[40px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] font-bold text-[var(--ink)]">
                <option value={20}>1 : 20</option>
                <option value={50}>1 : 50</option>
                <option value={100}>1 : 100</option>
                <option value={200}>1 : 200</option>
              </select>
            </label>
          </div>
          <div className="rounded-[18px] bg-[var(--acc-soft)] border-2 border-[var(--acc-line)] p-4">
            <div className="text-[12.5px] font-bold text-[var(--dim)]">Length on drawing paper</div>
            <div className="text-[26px] font-extrabold text-[var(--gold)]">{drawingCm} cm ({Math.round(drawingCm * 10)} mm)</div>
          </div>
        </section>
      </div>
    );
  }

  if (subj === 'elecinst' || subj === 'automech' || subj === 'gsm') {
    return (
      <section className="rtc-card rounded-[28px] p-5 sm:p-6 flex flex-col gap-4">
        <h2 className="h22 text-[var(--ink)]">Ohm’s law, power & fuse sizing bench</h2>
        <p className="text-[13.5px] text-[var(--dim)]">
          Test mains (230 V), car battery (12 V), or smartphone charging (5 V) circuits using I = V ÷ R and P = V × I.
        </p>
        <div className="flex gap-2 flex-wrap">
          <button type="button" onClick={() => { setVolts(230); setOhms(46); }} className="btn-tactile paper py-1.5 px-3 text-[12.5px]">Mains 230 V</button>
          <button type="button" onClick={() => { setVolts(12); setOhms(4); }} className="btn-tactile paper py-1.5 px-3 text-[12.5px]">Car battery 12 V</button>
          <button type="button" onClick={() => { setVolts(5); setOhms(2.5); }} className="btn-tactile paper py-1.5 px-3 text-[12.5px]">Phone charger 5 V</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-[12.5px] font-bold text-[var(--dim)]">
            Voltage (V)
            <input type="number" step="0.5" value={volts} onChange={(e) => setVolts(Number(e.target.value))} className="min-h-[42px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[15px] text-[var(--ink)]" />
          </label>
          <label className="flex flex-col gap-1 text-[12.5px] font-bold text-[var(--dim)]">
            Resistance (Ω)
            <input type="number" step="0.5" value={ohms} onChange={(e) => setOhms(Number(e.target.value))} className="min-h-[42px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[15px] text-[var(--ink)]" />
          </label>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="tile-peach rounded-[18px] p-3.5">
            <div className="text-[12px] font-bold">Current (I)</div>
            <div className="text-[22px] font-extrabold">{circuit.currentAmps} A</div>
          </div>
          <div className="tile-mint rounded-[18px] p-3.5">
            <div className="text-[12px] font-bold">Power (P)</div>
            <div className="text-[22px] font-extrabold">{circuit.powerWatts} W</div>
          </div>
          <div className="tile-sky rounded-[18px] p-3.5">
            <div className="text-[12px] font-bold">Suggested fuse</div>
            <div className="text-[20px] font-extrabold">{circuit.recommendedFuse}</div>
          </div>
        </div>
      </section>
    );
  }

  if (subj === 'animalhusb' || subj === 'fisheries') {
    return (
      <section className="rtc-card rounded-[28px] p-5 sm:p-6 flex flex-col gap-4">
        <h2 className="h22 text-[var(--ink)]">Feed Conversion Ratio (FCR) & Farm Calculator</h2>
        <p className="text-[13.5px] text-[var(--dim)]">
          FCR = Total feed given (kg) ÷ Total weight gained (kg). Lower FCR means better farm profit.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-[12.5px] font-bold text-[var(--dim)]">
            Total feed given (kg)
            <input type="number" value={feedKg} onChange={(e) => setFeedKg(Number(e.target.value))} className="min-h-[42px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[15px] text-[var(--ink)]" />
          </label>
          <label className="flex flex-col gap-1 text-[12.5px] font-bold text-[var(--dim)]">
            Total weight gained (kg)
            <input type="number" value={gainKg} onChange={(e) => setGainKg(Number(e.target.value))} className="min-h-[42px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[15px] text-[var(--ink)]" />
          </label>
        </div>
        <div className="rounded-[20px] tile-mint p-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[12.5px] font-bold">Calculated FCR</div>
            <div className="text-[28px] font-extrabold">{fcr.fcr} : 1</div>
          </div>
          <span className="font-bold text-[14px]">{fcr.rating}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[13px]">
          <div className="rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] p-3">
            <strong>Pond water pH:</strong> 6.5 – 8.5 (ideal for Clarias catfish)
          </div>
          <div className="rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] p-3">
            <strong>Dissolved oxygen:</strong> Keep above 4.0 mg/L
          </div>
          <div className="rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] p-3">
            <strong>Chicken incubation:</strong> 21 days at 37.5°C
          </div>
        </div>
      </section>
    );
  }

  // Vocational: Photography, Tourism, Garment Making, Cosmetology
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <section className="rtc-card rounded-[26px] p-5 flex flex-col gap-3.5">
        <h2 className="h18 text-[var(--ink)]">Photography exposure triangle</h2>
        <div className="grid grid-cols-3 gap-2.5">
          <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
            Aperture
            <select value={aperture} onChange={(e) => setAperture(e.target.value)} className="min-h-[40px] px-2.5 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[13.5px] font-bold text-[var(--ink)]">
              <option>f/1.8</option><option>f/2.8</option><option>f/5.6</option><option>f/11</option><option>f/16</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
            Shutter
            <select value={shutter} onChange={(e) => setShutter(e.target.value)} className="min-h-[40px] px-2.5 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[13.5px] font-bold text-[var(--ink)]">
              <option>1/1000 s</option><option>1/250 s</option><option>1/60 s</option><option>1/15 s</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
            ISO
            <select value={iso} onChange={(e) => setIso(Number(e.target.value))} className="min-h-[40px] px-2.5 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[13.5px] font-bold text-[var(--ink)]">
              <option value={100}>100</option><option value={400}>400</option><option value={1600}>1600</option><option value={3200}>3200</option>
            </select>
          </label>
        </div>
        <div className="rounded-[16px] tile-sky p-3.5 text-[13.5px] font-semibold">
          {aperture === 'f/1.8' || aperture === 'f/2.8'
            ? 'Wide aperture gives a soft blurred background (shallow depth of field) — great for portraits.'
            : 'Narrow aperture keeps both foreground and distant scenery sharp — great for landscapes.'}{' '}
          {iso >= 1600 ? 'High ISO brightens dark scenes but adds digital grain.' : 'Low ISO keeps your photo clean and noise-free.'}
        </div>
      </section>

      <section className="rtc-card rounded-[26px] p-5 flex flex-col gap-3.5">
        <h2 className="h18 text-[var(--ink)]">Group tour & vocational job costing</h2>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
            Guests / Units
            <input type="number" min={1} value={tourGuests} onChange={(e) => setTourGuests(Number(e.target.value))} className="min-h-[40px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-bold text-[var(--dim)]">
            Cost per person / item (₦)
            <input type="number" min={100} value={costPerGuest} onChange={(e) => setCostPerGuest(Number(e.target.value))} className="min-h-[40px] px-3 rounded-[14px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)]" />
          </label>
        </div>
        <div className="rounded-[18px] tile-mint p-4 flex items-center justify-between">
          <div>
            <div className="text-[12px] font-bold">Total bill (incl. 15% service margin)</div>
            <div className="text-[24px] font-extrabold">
              ₦{Math.round(tourGuests * costPerGuest * 1.15).toLocaleString()}
            </div>
          </div>
          <span className="text-[12.5px] font-bold">
            ₦{Math.round(costPerGuest * 1.15).toLocaleString()} / head
          </span>
        </div>
      </section>
    </div>
  );
}
