import {
  GEOG_FORMULAS,
  type GeogFormulaCatId,
  type GeogFormulaItem,
} from '../data/geogFormulas';
import { htmlToSpeakableChem } from './chemVoiceLogic';

export interface GeogFormulaDrillQuestion {
  id: string;
  formulaId: string;
  formulaName: string;
  cat: GeogFormulaCatId;
  promptHtml: string;
  hintHtml: string;
  options: string[];
  answerIdx: number;
  explanationHtml: string;
}

export function filterGeogFormulas(
  formulas: GeogFormulaItem[],
  cat: GeogFormulaCatId | 'all',
  query: string
): GeogFormulaItem[] {
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

export function getGeogFormulasForTopic(topicId: string): GeogFormulaItem[] {
  return GEOG_FORMULAS.filter((f) => f.topicId === topicId);
}

export function extractGeogFormulaSpeechScript(
  item: GeogFormulaItem,
  rearrIdx = 0,
  isFirstStep = false
): string {
  const rearr = item.rearrangements[rearrIdx] || item.rearrangements[0];
  const coreVars = item.variables
    .slice(0, 2)
    .map(([s, m]) => `${s} represents ${m}`)
    .join(', and ');
  const raw = [
    isFirstStep ? "Welcome to Dr. Ibrahim's Geography Map and Earth Calculations Studio." : '',
    `Let's walk through ${item.name} step by step.`,
    `Field principle: ${item.summary}`,
    `Applying ${rearr.label}, ${rearr.exprHtml}, remember that ${coreVars}.`,
    `Avoid this common mapwork error: ${item.trap}`,
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

export function generateGeogFormulaQuestion(
  formulaId: string,
  seed = 613
): GeogFormulaDrillQuestion {
  const rng = makeRng(seed);
  const meta = GEOG_FORMULAS.find((f) => f.id === formulaId) || GEOG_FORMULAS[0];
  const hintHtml = `<strong>${meta.rearrangements[0].exprHtml}</strong> — ${meta.trap}`;

  const finish = (
    promptHtml: string,
    correct: string,
    wrongs: string[],
    explanationHtml: string
  ): GeogFormulaDrillQuestion => {
    const { options, answerIdx } = packChoices(correct, wrongs, rng);
    return {
      id: `ggfd-${meta.id}-${seed}`,
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
    case 'ggf-rf': {
      const pair = pickOne(
        [
          { cm: 2, km: 1, d: '50,000', w1: '5,000', w2: '200,000', w3: '100,000' },
          { cm: 4, km: 1, d: '25,000', w1: '2,500', w2: '400,000', w3: '50,000' },
          { cm: 1, km: 2, d: '200,000', w1: '20,000', w2: '50,000', w3: '2,000' },
        ],
        rng
      );
      return finish(
        `Convert the statement scale <strong>"${pair.cm} cm represents ${pair.km} km"</strong> into a Representative Fraction (RF).`,
        `1 : ${pair.d}`,
        [`1 : ${pair.w1}`, `1 : ${pair.w2}`, `1 : ${pair.w3}`],
        `${pair.km} km = ${pair.km * 100000} cm. Dividing ${pair.cm} : ${(pair.km * 100000).toLocaleString()} by ${pair.cm} gives <strong>1 : ${pair.d}</strong>.`
      );
    }
    case 'ggf-ground-dist': {
      const cm = pickOne([8, 12, 16, 18], rng);
      const scale = pickOne(
        [
          { label: '1 : 50,000', factor: 0.5 },
          { label: '1 : 100,000', factor: 1 },
          { label: '1 : 25,000', factor: 0.25 },
        ],
        rng
      );
      const km = cm * scale.factor;
      return finish(
        `Two settlements are <strong>${cm} cm</strong> apart on a <strong>${scale.label}</strong> topographical map. Calculate the ground distance in km.`,
        `${km} km`,
        [`${km * 2} km`, `${km * 10} km`, `${cm * 2} km`],
        `On ${scale.label}, 1 cm = ${scale.factor} km. Ground distance = ${cm} × ${scale.factor} = <strong>${km} km</strong>.`
      );
    }
    case 'ggf-area': {
      const lCm = pickOne([6, 8, 10], rng);
      const wCm = pickOne([4, 6], rng);
      const areaKm2 = lCm * 0.5 * (wCm * 0.5);
      const trapLinear = lCm * wCm * 0.5;
      return finish(
        `A game reserve measures <strong>${lCm} cm by ${wCm} cm</strong> on a <strong>1 : 50,000</strong> map. Find its actual ground area in km<sup>2</sup>.`,
        `${areaKm2} km²`,
        [`${trapLinear} km²`, `${lCm * wCm} km²`, `${areaKm2 * 4} km²`],
        `Convert sides first: L = ${lCm * 0.5} km and W = ${wCm * 0.5} km. <strong>Area = ${lCm * 0.5} × ${wCm * 0.5} = ${areaKm2} km<sup>2</sup></strong>.`
      );
    }
    case 'ggf-enlarge-reduce': {
      const k = pickOne([2, 4, 5], rng);
      const orig = 100000;
      const newD = (orig / k).toLocaleString();
      const trapMult = (orig * k).toLocaleString();
      return finish(
        `A topographical map of scale <strong>1 : 100,000</strong> is <strong>enlarged ${k} times</strong>. What is the new RF scale?`,
        `1 : ${newD}`,
        [`1 : ${trapMult}`, `1 : 100,000`, `1 : ${(orig / (k * k)).toLocaleString()}`],
        `Enlarging by ${k} divides the RF denominator by ${k}: 100,000 ÷ ${k} = <strong>1 : ${newD}</strong>.`
      );
    }
    case 'ggf-bearing': {
      const fwd = pickOne([45, 72, 115, 230, 310], rng);
      const back = fwd < 180 ? fwd + 180 : fwd - 180;
      const pad = (n: number) => String(n).padStart(3, '0') + '°';
      return finish(
        `The true bearing of Hill P from Quarry Q is <strong>${pad(fwd)}</strong>. Find the true bearing of Quarry Q from Hill P.`,
        pad(back),
        [pad((360 - fwd) % 360), pad((fwd + 90) % 360), pad(Math.abs(180 - fwd))],
        `Back bearing differs by 180°: ${fwd < 180 ? `${fwd}° + 180°` : `${fwd}° − 180°`} = <strong>${pad(back)}</strong>.`
      );
    }
    case 'ggf-gradient': {
      const h1 = pickOne([100, 150, 200], rng);
      const vi = pickOne([200, 250, 300], rng);
      const h2 = h1 + vi;
      const ratio = pickOne([15, 20, 25, 30], rng);
      const heKm = (vi * ratio) / 1000;
      return finish(
        `Spot heights A (<strong>${h1} m</strong>) and B (<strong>${h2} m</strong>) lie <strong>${heKm} km</strong> apart on the ground. Calculate the average slope gradient.`,
        `1 in ${ratio}`,
        [`1 in ${ratio / 10}`, `1 in ${ratio * 2}`, `${ratio} in 1`],
        `VI = ${h2} − ${h1} = ${vi} m; HE = ${heKm} × 1,000 = ${vi * ratio} m. <strong>Gradient = ${vi} ÷ ${vi * ratio} = 1 in ${ratio}</strong>.`
      );
    }
    case 'ggf-ve': {
      const dh = pickOne([50000, 100000], rng);
      const mPerCm = pickOne([50, 100, 200], rng);
      const dv = mPerCm * 100;
      const ve = dh / dv;
      return finish(
        `A relief profile drawn from a <strong>1 : ${dh.toLocaleString()}</strong> map uses a vertical scale of <strong>1 cm to ${mPerCm} m</strong>. Find the Vertical Exaggeration.`,
        `${ve} times`,
        [`${ve / 10} times`, `${dh / mPerCm} times`, `${ve * 2} times`],
        `Vertical RF: ${mPerCm} m = ${dv.toLocaleString()} cm (1 : ${dv.toLocaleString()}). <strong>VE = ${dh.toLocaleString()} ÷ ${dv.toLocaleString()} = ${ve} times</strong>.`
      );
    }
    case 'ggf-ci-interp': {
      const low = 100;
      const ci = pickOne([25, 50, 100], rng);
      const spaces = pickOne([4, 5], rng);
      const high = low + ci * spaces;
      return finish(
        `Between the <strong>${low} m</strong> and <strong>${high} m</strong> index contours there are <strong>${spaces - 1}</strong> unnumbered contour lines. Find the Contour Interval.`,
        `${ci} m`,
        [`${Math.round((high - low) / (spaces - 1))} m`, `${ci * 2} m`, `${high - low} m`],
        `${spaces - 1} intermediate lines create <strong>${spaces} spaces</strong>. CI = (${high} − ${low}) ÷ ${spaces} = <strong>${ci} m</strong>.`
      );
    }
    case 'ggf-drainage-density': {
      const area = pickOne([25, 40, 50], rng);
      const dd = pickOne([1.6, 2.0, 2.5, 3.0], rng);
      const len = area * dd;
      return finish(
        `A river basin of area <strong>${area} km<sup>2</sup></strong> has streams of total length <strong>${len} km</strong>. Find its drainage density.`,
        `${dd} km/km²`,
        [`${(area / len).toFixed(2)} km/km²`, `${len - area} km/km²`, `${(dd * 2).toFixed(1)} km/km²`],
        `<strong>D<sub>d</sub> = Total Stream Length ÷ Basin Area</strong> = ${len} ÷ ${area} = <strong>${dd} km/km<sup>2</sup></strong>.`
      );
    }
    case 'ggf-long-time': {
      const caseSpec = pickOne(
        [
          { p1: 'Accra (0°)', t1: '10:00 a.m.', p2: 'Cairo (30°E)', ans: '12:00 noon', w: ['8:00 a.m.', '11:00 a.m.', '2:00 p.m.'], exp: '30° ÷ 15° = 2 hrs East → 10:00 a.m. + 2 hrs = 12:00 noon.' },
          { p1: 'Lagos (15°E)', t1: '1:00 p.m.', p2: 'New York (75°W)', ans: '7:00 a.m.', w: ['7:00 p.m.', '9:00 a.m.', '5:00 a.m.'], exp: 'Opposite hemispheres: 15° + 75° = 90° ⇒ 6 hrs West → 1:00 p.m. − 6 hrs = 7:00 a.m.' },
          { p1: 'Nairobi (45°E)', t1: '3:00 p.m.', p2: 'Abuja (15°E)', ans: '1:00 p.m.', w: ['5:00 p.m.', '12:00 noon', '2:00 p.m.'], exp: 'Same hemisphere: 45° − 15° = 30° ⇒ 2 hrs West → 3:00 p.m. − 2 hrs = 1:00 p.m.' },
        ],
        rng
      );
      return finish(
        `When local time in <strong>${caseSpec.p1}</strong> is <strong>${caseSpec.t1}</strong>, what is the local time in <strong>${caseSpec.p2}</strong>?`,
        caseSpec.ans,
        caseSpec.w,
        caseSpec.exp
      );
    }
    case 'ggf-lat-dist': {
      const nLat = pickOne([6, 10, 14], rng);
      const sLat = pickOne([4, 8, 11], rng);
      const dist = (nLat + sLat) * 111;
      const trapSub = Math.abs(nLat - sLat) * 111;
      return finish(
        `Calculate the ground distance along meridian 10°E between <strong>${nLat}°N</strong> and <strong>${sLat}°S</strong> (take 1° = 111 km).`,
        `${dist.toLocaleString()} km`,
        [`${trapSub.toLocaleString()} km`, `${((nLat + sLat) * 15).toLocaleString()} km`, `${(dist + 333).toLocaleString()} km`],
        `Opposite hemispheres (N and S) ADD: Δφ = ${nLat}° + ${sLat}° = ${nLat + sLat}°. Distance = ${nLat + sLat} × 111 = <strong>${dist.toLocaleString()} km</strong>.`
      );
    }
    case 'ggf-solar-noon': {
      const lat = pickOne([8, 12, 15, 30], rng);
      const alt = 90 - lat;
      return finish(
        `Calculate the noon angle of elevation of the Sun at latitude <strong>${lat}°N</strong> on March 21 (Spring Equinox).`,
        `${alt}°`,
        [`${lat}°`, `${Math.round(90 - Math.abs(lat - 23.5))}°`, `${90 - (lat + 23.5)}°`],
        `On March 21, the Sun is overhead at 0° Equator. <strong>Altitude = 90° − |${lat}° − 0°| = ${alt}°</strong>.`
      );
    }
    case 'ggf-rev-speed': {
      const spec = pickOne(
        [
          { lat: '0° (Equator)', ans: '1,670 km/h', w: ['835 km/h', '0 km/h', '1,446 km/h'] },
          { lat: '60°N', ans: '835 km/h', w: ['1,670 km/h', '418 km/h', '0 km/h'] },
          { lat: '90°N (North Pole)', ans: '0 km/h', w: ['1,670 km/h', '835 km/h', '111 km/h'] },
        ],
        rng
      );
      return finish(
        `Given Earth’s equatorial rotational speed is <strong>1,670 km/h</strong>, what is the linear rotational speed at <strong>${spec.lat}</strong>?`,
        spec.ans,
        spec.w,
        `Using <strong>v = 1,670 × cos φ</strong> at ${spec.lat} gives <strong>${spec.ans}</strong>.`
      );
    }
    case 'ggf-lapse-rate': {
      const t0 = pickOne([28, 30, 32], rng);
      const h = pickOne([1000, 2000, 3000], rng);
      const drop = (h / 1000) * 6.5;
      const th = t0 - drop;
      return finish(
        `Air temperature at sea level (0 m) is <strong>${t0} °C</strong>. Using the normal lapse rate of <strong>6.5 °C per 1,000 m</strong>, find the temperature at <strong>${h.toLocaleString()} m</strong>.`,
        `${th} °C`,
        [`${t0 + drop} °C`, `${t0 - h / 1000} °C`, `${th - 6.5} °C`],
        `Temperature drops by ${(h / 1000).toFixed(0)} × 6.5 = ${drop} °C. <strong>T = ${t0} − ${drop} = ${th} °C</strong>.`
      );
    }
    case 'ggf-temp-range': {
      const tmax = pickOne([31, 33, 35], rng);
      const tmin = pickOne([19, 21, 23], rng);
      const range = tmax - tmin;
      const mean = (tmax + tmin) / 2;
      return finish(
        `A weather station records daily maximum <strong>${tmax} °C</strong> and minimum <strong>${tmin} °C</strong>. Find the <strong>diurnal temperature range</strong> and <strong>mean daily temperature</strong>.`,
        `Range ${range} °C, Mean ${mean} °C`,
        [`Range ${mean} °C, Mean ${range} °C`, `Range ${tmax + tmin} °C, Mean ${mean} °C`, `Range ${range} °C, Mean ${tmax} °C`],
        `<strong>Range = ${tmax} − ${tmin} = ${range} °C</strong>; <strong>Mean = (${tmax} + ${tmin}) ÷ 2 = ${mean} °C</strong>.`
      );
    }
    case 'ggf-rh': {
      const cap = pickOne([20, 25, 40], rng);
      const rh = pickOne([60, 75, 80], rng);
      const actual = (cap * rh) / 100;
      return finish(
        `1 m<sup>3</sup> of air contains <strong>${actual} g</strong> of water vapour at a temperature where saturation capacity is <strong>${cap} g</strong>. Calculate Relative Humidity.`,
        `${rh}%`,
        [`${cap - actual}%`, `${Math.round((cap / actual) * 100)}%`, `${100 - rh}%`],
        `<strong>RH = (${actual} ÷ ${cap}) × 100% = ${rh}%</strong>.`
      );
    }
    case 'ggf-annual-rain': {
      const wetAvg = pickOne([180, 200, 220], rng);
      const dryAvg = pickOne([20, 30, 40], rng);
      const tot = 6 * wetAvg + 6 * dryAvg;
      return finish(
        `A savanna station receives an average of <strong>${wetAvg} mm</strong> in each of 6 wet months and <strong>${dryAvg} mm</strong> in each of 6 dry months. Find Total Annual Rainfall.`,
        `${tot.toLocaleString()} mm`,
        [`${((wetAvg + dryAvg) / 2).toFixed(0)} mm`, `${wetAvg + dryAvg} mm`, `${(tot / 2).toLocaleString()} mm`],
        `Total Annual Rainfall sums all 12 months: (6 × ${wetAvg}) + (6 × ${dryAvg}) = <strong>${tot.toLocaleString()} mm</strong>.`
      );
    }
    case 'ggf-pop-density': {
      const area = pickOne([2000, 5000, 8000], rng);
      const dens = pickOne([250, 400, 650], rng);
      const pop = area * dens;
      return finish(
        `A region of land area <strong>${area.toLocaleString()} km<sup>2</sup></strong> has a population of <strong>${pop.toLocaleString()}</strong>. Calculate its crude population density.`,
        `${dens} persons/km²`,
        [`${dens / 10} persons/km²`, `${dens * 10} persons/km²`, `${Math.round(area / 10)} persons/km²`],
        `<strong>Density = ${pop.toLocaleString()} ÷ ${area.toLocaleString()} = ${dens} persons/km<sup>2</sup></strong>.`
      );
    }
    case 'ggf-cbr-cdr': {
      const cbr = pickOne([36, 40, 44], rng);
      const cdr = pickOne([10, 12, 14], rng);
      const rni = ((cbr - cdr) / 10).toFixed(1);
      return finish(
        `Given Crude Birth Rate = <strong>${cbr} per 1,000</strong> and Crude Death Rate = <strong>${cdr} per 1,000</strong>, calculate the annual Rate of Natural Increase (%).`,
        `${rni}%`,
        [`${cbr - cdr}%`, `${((cbr + cdr) / 10).toFixed(1)}%`, `0.${cbr - cdr}%`],
        `Natural increase = ${cbr} − ${cdr} = ${cbr - cdr} per 1,000 = <strong>${rni}% per annum</strong>.`
      );
    }
    case 'ggf-dep-ratio':
    default: {
      const kids = pickOne([40, 42, 45], rng);
      const elders = pickOne([4, 6, 5], rng);
      const workers = 50;
      const dr = Math.round(((kids + elders) / workers) * 100);
      const wrongTot = Math.round(((kids + elders) / (kids + elders + workers)) * 100);
      return finish(
        `A country has <strong>${kids}m</strong> children (0–14), <strong>${workers}m</strong> active adults (15–64), and <strong>${elders}m</strong> elderly (65+). Find the Dependency Ratio.`,
        `${dr}%`,
        [`${wrongTot}%`, `${Math.round((kids / workers) * 100)}%`, `${dr + 16}%`],
        `Dependants = ${kids}m + ${elders}m = ${kids + elders}m. <strong>DR = (${kids + elders} ÷ ${workers}) × 100 = ${dr}%</strong>.`
      );
    }
  }
}

export function buildGeogFormulaDrillDeck(
  cat: GeogFormulaCatId | 'all',
  targetFormulaId: string | null,
  count = 8,
  seed = 308519
): GeogFormulaDrillQuestion[] {
  const rng = makeRng(seed);
  const pool = targetFormulaId
    ? GEOG_FORMULAS.filter((f) => f.id === targetFormulaId)
    : cat === 'all'
      ? GEOG_FORMULAS
      : GEOG_FORMULAS.filter((f) => f.cat === cat);
  const activePool = pool.length > 0 ? pool : GEOG_FORMULAS;

  const shuffled = [...activePool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const deck: GeogFormulaDrillQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const item = shuffled[i % shuffled.length];
    const qSeed = Math.floor(rng() * 1_000_000) + i * 7919 + 31;
    deck.push(generateGeogFormulaQuestion(item.id, qSeed));
  }
  return deck;
}
