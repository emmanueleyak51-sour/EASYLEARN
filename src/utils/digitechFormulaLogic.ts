import {
  DIGITECH_FORMULAS,
  type DigiTechFormulaCatId,
  type DigiTechFormulaItem,
} from '../data/digitechFormulas';
import { htmlToSpeakableChem } from './chemVoiceLogic';

export interface DigiTechFormulaDrillQuestion {
  id: string;
  formulaId: string;
  formulaName: string;
  cat: DigiTechFormulaCatId;
  promptHtml: string;
  hintHtml: string;
  options: string[];
  answerIdx: number;
  explanationHtml: string;
}

export function filterDigiTechFormulas(
  formulas: DigiTechFormulaItem[],
  cat: DigiTechFormulaCatId | 'all',
  query: string
): DigiTechFormulaItem[] {
  const q = query.trim().toLowerCase();
  return formulas.filter((f) => {
    if (cat !== 'all' && f.cat !== cat) return false;
    if (!q) return true;
    const hay = [
      f.name,
      f.summary,
      f.trap,
      ...f.keywords,
      ...f.rearrangements.map((r) => `${r.label} ${r.exprHtml}`),
      ...f.variables.map(([s, m]) => `${s} ${m}`),
    ]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}

export function getDigiTechFormulasForTopic(topicId: string): DigiTechFormulaItem[] {
  return DIGITECH_FORMULAS.filter((f) => f.topicId === topicId);
}

export function extractDigiTechFormulaSpeechScript(
  item: DigiTechFormulaItem,
  rearrIdx = 0,
  isFirstStep = false
): string {
  const rearr = item.rearrangements[rearrIdx] || item.rearrangements[0];
  const coreVars = item.variables
    .slice(0, 2)
    .map(([s, m]) => `${s} represents ${m}`)
    .join(', while ');
  const raw = [
    isFirstStep ? "Welcome to Engineer Tunde's Digital Technologies Formula and Binary Studio." : '',
    `Let's break down ${item.name}.`,
    `Core engineering principle: ${item.summary}`,
    `Using ${rearr.label}, ${rearr.exprHtml}, note that ${coreVars}.`,
    `Watch out for this trap: ${item.trap}`,
  ]
    .filter(Boolean)
    .join(' ');
  return htmlToSpeakableChem(raw);
}

function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

function packChoices(
  correct: string,
  wrongs: string[],
  rng: () => number
): { options: string[]; answerIdx: number } {
  const uniqueWrongs: string[] = [];
  for (const w of wrongs) {
    if (w !== correct && !uniqueWrongs.includes(w)) {
      uniqueWrongs.push(w);
    }
  }
  let bump = 2;
  while (uniqueWrongs.length < 3) {
    const candidate = `${correct} (${bump})`;
    if (!uniqueWrongs.includes(candidate)) uniqueWrongs.push(candidate);
    bump++;
  }
  const pool = [correct, ...uniqueWrongs.slice(0, 3)];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return {
    options: pool,
    answerIdx: pool.indexOf(correct),
  };
}

export function generateDigiTechFormulaQuestion(
  formulaId: string,
  seed = 701
): DigiTechFormulaDrillQuestion {
  const rng = makeRng(seed);
  const meta = DIGITECH_FORMULAS.find((f) => f.id === formulaId) || DIGITECH_FORMULAS[0];
  const hintHtml = `<strong>${meta.rearrangements[0].exprHtml}</strong> — ${meta.trap}`;

  const finish = (
    promptHtml: string,
    correct: string,
    wrongs: string[],
    explanationHtml: string
  ): DigiTechFormulaDrillQuestion => {
    const { options, answerIdx } = packChoices(correct, wrongs, rng);
    return {
      id: `dtfd-${meta.id}-${seed}`,
      formulaId: meta.id,
      formulaName: meta.name,
      cat: meta.cat,
      promptHtml,
      hintHtml,
      options,
      answerIdx,
      explanationHtml,
    };
  };

  switch (meta.id) {
    case 'dtf-radix-val': {
      const val = pickOne([19, 22, 25, 29, 37, 45], rng);
      const bin = val.toString(2);
      return finish(
        `Convert the binary numeral <strong>${bin}<sub>2</sub></strong> to decimal (base 10).`,
        `${val}`,
        [`${val + 2}`, `${val - 1}`, `${val * 2}`],
        `Sum the positional powers of 2 for each 1-bit in <strong>${bin}<sub>2</sub></strong> (ending at 2<sup>0</sup> = 1 on the right) to obtain <strong>${val}<sub>10</sub></strong>.`
      );
    }
    case 'dtf-unsigned-range': {
      const n = pickOne([6, 7, 8, 10, 12], rng);
      const maxVal = (1 << n) - 1;
      const tot = 1 << n;
      return finish(
        `What is the <strong>maximum unsigned integer</strong> that can be stored in a <strong>${n}-bit</strong> register?`,
        `${maxVal.toLocaleString()}`,
        [`${tot.toLocaleString()}`, `${((1 << (n - 1)) - 1).toLocaleString()}`, `${(tot + 1).toLocaleString()}`],
        `An unsigned ${n}-bit register stores 2<sup>${n}</sup> = ${tot.toLocaleString()} values from 0 to <strong>2<sup>${n}</sup> − 1 = ${maxVal.toLocaleString()}</strong>.`
      );
    }
    case 'dtf-twos-comp': {
      const n = pickOne([6, 7, 8], rng);
      const minVal = -(1 << (n - 1));
      const maxVal = (1 << (n - 1)) - 1;
      return finish(
        `What is the exact integer range of a signed <strong>${n}-bit Two’s Complement</strong> register?`,
        `${minVal} to +${maxVal}`,
        [`−${maxVal} to +${maxVal}`, `${minVal} to +${1 << (n - 1)}`, `0 to +${(1 << n) - 1}`],
        `Signed ${n}-bit Two’s Complement spans <strong>−2<sup>${n - 1}</sup> to +(2<sup>${n - 1}</sup> − 1)</strong> = <strong>${minVal} to +${maxVal}</strong>.`
      );
    }
    case 'dtf-hex-nibble': {
      const hi = pickOne([10, 11, 12, 13, 14, 15], rng);
      const lo = pickOne([2, 4, 6, 9, 12], rng);
      const hexStr = `${hi.toString(16).toUpperCase()}${lo.toString(16).toUpperCase()}`;
      const dec = hi * 16 + lo;
      return finish(
        `Convert the 1-byte hexadecimal value <strong>${hexStr}<sub>16</sub></strong> to decimal (base 10).`,
        `${dec}`,
        [`${hi * 10 + lo}`, `${dec - 16}`, `${lo * 16 + hi}`],
        `<strong>${hexStr}<sub>16</sub></strong> = (${hi} × 16) + ${lo} = <strong>${dec}<sub>10</sub></strong>.`
      );
    }
    case 'dtf-bit-shift': {
      const x = pickOne([7, 9, 11, 13, 15], rng);
      const k = pickOne([2, 3, 4], rng);
      const ans = x * (1 << k);
      return finish(
        `An unsigned integer <strong>${x}</strong> is logically shifted left by <strong>${k} bits</strong> (<strong>${x} &lt;&lt; ${k}</strong>). Find the resulting value.`,
        `${ans}`,
        [`${x * 2 * k}`, `${x + (1 << k)}`, `${Math.floor(x / (1 << k))}`],
        `Left shifting by ${k} bits multiplies by 2<sup>${k}</sup> = ${1 << k}: <strong>${x} × ${1 << k} = ${ans}</strong>.`
      );
    }
    case 'dtf-storage-units': {
      const kib = pickOne([2, 4, 8, 16], rng);
      const bits = kib * 1024 * 8;
      const bytes = kib * 1024;
      return finish(
        `How many <strong>bits</strong> are contained in <strong>${kib} KiB</strong> (kibibytes) of memory?`,
        `${bits.toLocaleString()} bits`,
        [`${bytes.toLocaleString()} bits`, `${(kib * 1000 * 8).toLocaleString()} bits`, `${(kib * 1024 * 4).toLocaleString()} bits`],
        `${kib} KiB = ${kib} × 1,024 = ${bytes.toLocaleString()} Bytes. Multiplying by 8 bits/Byte gives <strong>${bits.toLocaleString()} bits</strong>.`
      );
    }
    case 'dtf-image-size': {
      const dims = pickOne(
        [
          { w: 400, h: 300 },
          { w: 800, h: 600 },
          { w: 1000, h: 500 },
        ],
        rng
      );
      const depth = pickOne(
        [
          { colors: 256, b: 8 },
          { colors: 65536, b: 16 },
          { colors: 16777216, b: 24 },
        ],
        rng
      );
      const kb = (dims.w * dims.h * depth.b) / 8 / 1000;
      return finish(
        `Find the uncompressed payload (in decimal kB, 1 kB = 1,000 B) of a <strong>${dims.w} × ${dims.h}</strong> bitmap with <strong>${depth.b}-bit</strong> color depth.`,
        `${kb.toLocaleString()} kB`,
        [`${(kb * 8).toLocaleString()} kB`, `${(kb / 2).toLocaleString()} kB`, `${((dims.w + dims.h) * depth.b).toLocaleString()} kB`],
        `Bytes = (${dims.w} × ${dims.h} × ${depth.b}) ÷ 8 = ${(kb * 1000).toLocaleString()} B = <strong>${kb.toLocaleString()} kB</strong>.`
      );
    }
    case 'dtf-audio-size': {
      const fs = pickOne([10000, 20000, 40000], rng);
      const t = pickOne([5, 10, 20], rng);
      const ch = pickOne(
        [
          { label: 'mono', c: 1 },
          { label: 'stereo', c: 2 },
        ],
        rng
      );
      const kb = (fs * 16 * t * ch.c) / 8 / 1000;
      return finish(
        `Calculate the raw PCM file size (in decimal kB) of a <strong>${t}-second ${ch.label}</strong> clip sampled at <strong>${fs.toLocaleString()} Hz</strong> with <strong>16-bit</strong> depth.`,
        `${kb.toLocaleString()} kB`,
        [`${(kb * 8).toLocaleString()} kB`, `${(ch.c === 2 ? kb / 2 : kb * 2).toLocaleString()} kB`, `${(kb / 10).toLocaleString()} kB`],
        `Size = (${fs.toLocaleString()} × 16 × ${t} × ${ch.c}) ÷ 8 = ${(kb * 1000).toLocaleString()} Bytes = <strong>${kb.toLocaleString()} kB</strong>.`
      );
    }
    case 'dtf-nyquist': {
      const fmax = pickOne([4, 8, 15, 20, 22], rng);
      const fs = 2 * fmax;
      return finish(
        `An analog acoustic sensor captures frequencies up to <strong>${fmax} kHz</strong>. What is the minimum Nyquist sampling rate to avoid aliasing?`,
        `${fs} kHz`,
        [`${fmax} kHz`, `${fmax / 2} kHz`, `${fs * 2} kHz`],
        `By the Nyquist–Shannon theorem, <strong>f<sub>s(min)</sub> = 2 × f<sub>max</sub> = 2 × ${fmax} kHz = ${fs} kHz</strong>.`
      );
    }
    case 'dtf-clock-period': {
      const ghz = pickOne([1, 2, 2.5, 4, 5], rng);
      const ns = +(1 / ghz).toFixed(2);
      return finish(
        `What is the duration <strong>T</strong> of a single clock cycle on a <strong>${ghz} GHz</strong> microprocessor?`,
        `${ns} ns`,
        [`${ghz} ns`, `${+(ns * 10).toFixed(2)} ns`, `${+(ghz * 2).toFixed(2)} ns`],
        `Since 1 GHz = 10<sup>9</sup> Hz and 1 ns = 10<sup>−9</sup> s, <strong>T = 1 ÷ (${ghz} × 10<sup>9</sup>) = ${ns} ns</strong>.`
      );
    }
    case 'dtf-address-bus': {
      const bus = pickOne(
        [
          { a: 12, label: '4 KiB', wrong1: '12 KiB', wrong2: '8 KiB', wrong3: '16 KiB' },
          { a: 16, label: '64 KiB', wrong1: '16 KiB', wrong2: '32 KiB', wrong3: '128 KiB' },
          { a: 20, label: '1 MiB', wrong1: '20 MiB', wrong2: '512 KiB', wrong3: '2 MiB' },
          { a: 32, label: '4 GiB', wrong1: '32 GiB', wrong2: '2 GiB', wrong3: '16 GiB' },
        ],
        rng
      );
      return finish(
        `A byte-addressable CPU has a <strong>${bus.a}-bit address bus</strong>. How much RAM can it directly address?`,
        bus.label,
        [bus.wrong1, bus.wrong2, bus.wrong3],
        `Addressable memory = 2<sup>${bus.a}</sup> × 1 Byte = <strong>${bus.label}</strong>.`
      );
    }
    case 'dtf-binary-search': {
      const pair = pickOne(
        [
          { n: 120, steps: 7 },
          { n: 500, steps: 9 },
          { n: 1000, steps: 10 },
          { n: 4000, steps: 12 },
        ],
        rng
      );
      return finish(
        `What is the maximum number of element comparisons needed by <strong>Binary Search</strong> on a sorted array of <strong>${pair.n.toLocaleString()}</strong> items?`,
        `${pair.steps}`,
        [`${pair.n}`, `${Math.floor(pair.n / 2)}`, `${pair.steps * 2}`],
        `Using <strong>⌊log<sub>2</sub>(${pair.n})⌋ + 1</strong> gives <strong>${pair.steps} comparisons</strong> in the worst case.`
      );
    }
    case 'dtf-truth-rows': {
      const n = pickOne([3, 4, 5, 6], rng);
      const rows = 1 << n;
      return finish(
        `How many rows are required in a complete Boolean truth table with <strong>${n} input variables</strong>?`,
        `${rows}`,
        [`${n * 2}`, `${n * n}`, `${rows - 1}`],
        `Each of the ${n} inputs can be 0 or 1 independently, producing <strong>2<sup>${n}</sup> = ${rows} rows</strong>.`
      );
    }
    case 'dtf-demorgan': {
      const variant = pickOne(
        [
          { expr: '¬(A + B)', ans: '¬A · ¬B', w1: '¬A + ¬B', w2: 'A · B', w3: 'A + ¬B' },
          { expr: '¬(A · B)', ans: '¬A + ¬B', w1: '¬A · ¬B', w2: 'A + B', w3: '¬A · B' },
          { expr: '¬(¬P · Q)', ans: 'P + ¬Q', w1: 'P · ¬Q', w2: '¬P + ¬Q', w3: 'P + Q' },
        ],
        rng
      );
      return finish(
        `By <strong>De Morgan’s Law</strong>, which Boolean expression is strictly equivalent to <strong>${variant.expr}</strong>?`,
        variant.ans,
        [variant.w1, variant.w2, variant.w3],
        `Break the negation bar and flip the operator (+ ↔ ·): <strong>${variant.expr} = ${variant.ans}</strong>.`
      );
    }
    case 'dtf-xor-gate': {
      const pair = pickOne(
        [
          { a: '1010', b: '1100', out: '0110', orOut: '1110', andOut: '1000', xnor: '1001' },
          { a: '1101', b: '0111', out: '1010', orOut: '1111', andOut: '0101', xnor: '0101' },
          { a: '1110', b: '1011', out: '0101', orOut: '1111', andOut: '1010', xnor: '1010' },
        ],
        rng
      );
      return finish(
        `Evaluate the 4-bit bitwise Exclusive-OR operation <strong>${pair.a}<sub>2</sub> ⊕ ${pair.b}<sub>2</sub></strong>.`,
        `${pair.out}₂`,
        [`${pair.orOut}₂`, `${pair.andOut}₂`, `${pair.xnor}₂`],
        `XOR outputs 1 where bits differ and 0 where bits match: <strong>${pair.a}<sub>2</sub> ⊕ ${pair.b}<sub>2</sub> = ${pair.out}<sub>2</sub></strong>.`
      );
    }
    case 'dtf-half-adder': {
      const inp = pickOne(
        [
          { a: 1, b: 1, cin: 0, s: 0, c: 1 },
          { a: 1, b: 1, cin: 1, s: 1, c: 1 },
          { a: 1, b: 0, cin: 1, s: 0, c: 1 },
          { a: 1, b: 0, cin: 0, s: 1, c: 0 },
        ],
        rng
      );
      return finish(
        `A 1-bit <strong>Full-Adder</strong> receives inputs <strong>A = ${inp.a}, B = ${inp.b}, C<sub>in</sub> = ${inp.cin}</strong>. Find <strong>(Sum S, Carry C<sub>out</sub>)</strong>.`,
        `S = ${inp.s}, C_out = ${inp.c}`,
        [
          `S = ${inp.c}, C_out = ${inp.s === inp.c ? 1 - inp.c : inp.s}`,
          `S = ${1 - inp.s}, C_out = ${1 - inp.c}`,
          `S = ${1 - inp.s}, C_out = ${inp.c}`,
        ],
        `Adding ${inp.a} + ${inp.b} + ${inp.cin} = ${inp.a + inp.b + inp.cin}<sub>10</sub> gives <strong>S = ${inp.s}</strong> and <strong>C<sub>out</sub> = ${inp.c}</strong>.`
      );
    }
    case 'dtf-transfer-time': {
      const mb = pickOne([50, 100, 150, 200, 250], rng);
      const mbps = pickOne([20, 40, 50, 80], rng);
      const secs = (mb * 8) / mbps;
      const trapNoEight = mb / mbps;
      return finish(
        `How many seconds are required to transfer a <strong>${mb} MB</strong> (decimal megabytes) file across a steady <strong>${mbps} Mbps</strong> link?`,
        `${secs} s`,
        [`${trapNoEight} s`, `${secs * 2} s`, `${(mb * 10) / mbps} s`],
        `Convert MegaBYTES to MegaBITS first: ${mb} MB × 8 = ${mb * 8} Mb. Then <strong>t = ${mb * 8} Mb ÷ ${mbps} Mbps = ${secs} s</strong>.`
      );
    }
    case 'dtf-ipv4-subnet': {
      const prefix = pickOne([24, 25, 26, 27, 28, 30], rng);
      const h = 32 - prefix;
      const total = 1 << h;
      const usable = total - 2;
      return finish(
        `How many <strong>usable host IPv4 addresses</strong> are available in a <strong>/${prefix}</strong> subnet?`,
        `${usable}`,
        [`${total}`, `${usable + 1}`, `${(1 << (h - 1)) - 2}`],
        `Host bits h = 32 − ${prefix} = ${h}. Subtracting Network and Broadcast addresses gives <strong>2<sup>${h}</sup> − 2 = ${total} − 2 = ${usable}</strong> usable hosts.`
      );
    }
    case 'dtf-mesh-links': {
      const n = pickOne([5, 6, 7, 8, 10], rng);
      const links = (n * (n - 1)) / 2;
      return finish(
        `How many dedicated point-to-point links are required to connect <strong>${n} routers</strong> in a <strong>full-mesh</strong> topology?`,
        `${links}`,
        [`${n * (n - 1)}`, `${n - 1}`, `${n * 2}`],
        `Using <strong>L = n(n − 1) ÷ 2 = (${n} × ${n - 1}) ÷ 2 = ${links} links</strong>.`
      );
    }
    case 'dtf-availability':
    default: {
      const pair = pickOne(
        [
          { mtbf: 990, mttr: 10, pct: '99%' },
          { mtbf: 995, mttr: 5, pct: '99.5%' },
          { mtbf: 1998, mttr: 2, pct: '99.9%' },
          { mtbf: 490, mttr: 10, pct: '98%' },
        ],
        rng
      );
      return finish(
        `A production server cluster records <strong>MTBF = ${pair.mtbf} hours</strong> and <strong>MTTR = ${pair.mttr} hours</strong>. Find its availability.`,
        pair.pct,
        ['100%', '95%', '90%'],
        `Total cycle = ${pair.mtbf} + ${pair.mttr} = ${pair.mtbf + pair.mttr} hours. <strong>Availability = [${pair.mtbf} ÷ ${pair.mtbf + pair.mttr}] × 100% = ${pair.pct}</strong>.`
      );
    }
  }
}

export function buildDigiTechFormulaDrillDeck(
  cat: DigiTechFormulaCatId | 'all',
  targetFormulaId: string | null,
  count = 8,
  seed = 314159
): DigiTechFormulaDrillQuestion[] {
  const rng = makeRng(seed);
  const pool = targetFormulaId
    ? DIGITECH_FORMULAS.filter((f) => f.id === targetFormulaId)
    : cat === 'all'
      ? DIGITECH_FORMULAS
      : DIGITECH_FORMULAS.filter((f) => f.cat === cat);
  const activePool = pool.length > 0 ? pool : DIGITECH_FORMULAS;

  const shuffled = [...activePool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const deck: DigiTechFormulaDrillQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const item = shuffled[i % shuffled.length];
    const qSeed = Math.floor(rng() * 1_000_000) + i * 7919 + 29;
    deck.push(generateDigiTechFormulaQuestion(item.id, qSeed));
  }
  return deck;
}
