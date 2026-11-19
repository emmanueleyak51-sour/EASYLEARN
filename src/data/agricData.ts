import type {
  Beat,
  IdeaBeat,
  InteractiveLesson,
  TeachBeat,
  TeachBlock,
  Topic,
} from '../types';
import { perm } from '../utils/engine';
import { AGRIC_TOPICS_PART1 } from './agricTopicsPart1';
import { AGRIC_TOPICS_PART2 } from './agricTopicsPart2';
import { AGRIC_TOPICS_PART3 } from './agricTopicsPart3';

interface AgricTableSpec {
  title: string;
  headers: string[];
  rows: string[][];
}

const AGRIC_TEACH_TABLES: Record<string, AgricTableSpec> = {
  'ag-intro': {
    title: 'Key Nigerian Agricultural Research Institutes & Mandate Commodities',
    headers: ['Institute & HQ', 'Primary Mandate Crops / Livestock', 'Specialized Agronomic Role'],
    rows: [
      ['IITA (Ibadan)', 'Cassava, Yam, Cowpea, Maize, Soybean, Plantain', 'Mosaic-resistant TMS cassava & Striga-resistant hybrids'],
      ['CRIN (Ibadan) vs NIFOR (Benin)', 'CRIN: Cocoa, Kola, Coffee, Cashew · NIFOR: Oil Palm, Coconut, Date, Raphia', 'Hybrid Amazon cocoa & Tenera (Dura × Pisifera) oil palm'],
      ['NCRI (Badeggi) & NRCRI (Umudike)', 'NCRI: Rice, Sugarcane · NRCRI: Yam, Cassava, Cocoyam, Ginger, Irish Potato', 'FARO high-yielding rice & rapid yam minisett multiplication'],
      ['NVRI (Vom, Plateau) & NIHORT (Ibadan)', 'NVRI: Livestock Vaccines · NIHORT: Fruits, Vegetables, Spices', 'Newcastle/Anthrax/CBPP vaccines & elite citrus/tomato cultivars'],
    ],
  },
  'ag-land-tenure': {
    title: 'Comparative Land Tenure Systems & Land Use Act (1978)',
    headers: ['Tenure System', 'Ownership & Transfer Rule', 'Impact on Mechanization & Credit'],
    rows: [
      ['Communal Tenure', 'Owned by community/clan; allocated by traditional head', 'No sale, NO bank mortgage collateral, restricts permanent tree crops'],
      ['Inheritance Tenure', 'Subdivided among heirs across generations', 'Causes severe plot fragmentation into narrow strips & boundary disputes'],
      ['Leasehold / Rent', 'Fixed-duration contract for agreed cash/kind rent', 'Short leases discourage drainage, irrigation, or perennial orchards'],
      ['Land Use Act (1978)', 'Governor = Statutory C of O (urban); LGA = Customary (≤500 ha crop / ≤5,000 ha grazing)', 'Unifies title for commercial estates; slowed by C of O bureaucracy'],
    ],
  },
  'ag-ecology': {
    title: 'Nigerian Agro-Ecological Belts (South → North Gradient)',
    headers: ['Ecological Zone', 'Rainfall & Vegetation', 'Signature Crops & Livestock'],
    rows: [
      ['Swamp & Rainforest', '1,500–3,000+ mm (9–11 wet mo); tall multi-storey evergreens', 'Oil palm, Cocoa, Rubber, Kola, Plantain, Swamp Rice, Trypanotolerant N’Dama/Muturu'],
      ['Guinea Savanna', '1,000–1,500 mm (6–8 wet mo); tall grasses + scattered trees', 'Yam, Cassava, Maize, Soybean, Beniseed ("Middle-Belt Food Basket")'],
      ['Sudan Savanna', '500–1,000 mm (4–5 wet mo); short feathery grasses', 'Millet, Sorghum, Groundnut, Cowpea, Cotton, Zebu Cattle, Uda/Red Sokoto'],
      ['Montane (Jos / Mambilla)', 'Cool high-altitude plateau (1,200–1,800 m)', 'Tea, Arabica Coffee, Irish Potato, Temperate Vegetables, Exotic Friesian Dairy'],
    ],
  },
  'ag-soil-props': {
    title: 'Sand vs Silt vs Clay Physical & Chemical Comparison',
    headers: ['Soil Property', 'Sandy Soil (2.0–0.02 mm)', 'Clay Soil (< 0.002 mm) vs Loam'],
    rows: [
      ['Pore Geometry & Drainage', 'Large macro-pores; drains rapidly, drought-prone', 'Clay: tiny micro-pores, waterlogs · Loam: balanced 25% water + 25% air'],
      ['Capillarity & CEC', 'Fast initial rise but lowest ultimate height; very low CEC', 'Clay: slow start, HIGHEST ultimate capillary rise & high nutrient CEC'],
      ['Tillage ("Light" vs "Heavy")', 'Loose, friable, low drawbar pull; high nutrient leaching', 'Clay: sticky when wet, hard clods/cracks when dry; improved by CaCO₃ + humus'],
      ['Plant-Available Water', 'Low capillary retention', 'Capillary water (0.3–15 bar) is the ONLY form absorbed by crop roots'],
    ],
  },
  'ag-nutrients': {
    title: 'Plant Mineral Deficiency Diagnostics & Nitrogen Cycle Bacteria',
    headers: ['Element / Microbe', 'Physiological Function / Reaction', 'Diagnostic Symptom / Condition'],
    rows: [
      ['Nitrogen (NO₃⁻ / NH₄⁺)', 'Protein, nucleic acid & vegetative leaf synthesis', 'Uniform pale yellowing (chlorosis) of OLDER lower leaves + stunted stems'],
      ['Phosphorus vs Potassium', 'P: ATP, roots & ripening · K: stomata, translocation & stalk strength', 'P: reddish-PURPLE leaves & poor roots · K: scorched brown leaf margins & lodging'],
      ['Magnesium vs Calcium', 'Mg: central chlorophyll atom · Ca: cell-wall pectate & meristems', 'Mg: interveinal chlorosis (old leaves) · Ca: terminal bud die-back & blossom-end rot'],
      ['N-Cycle Bacteria', 'Rhizobium/Azotobacter fix N₂; Nitrosomonas (NH₄⁺→NO₂⁻); Nitrobacter (NO₂⁻→NO₃⁻)', 'Waterlogged anaerobic Pseudomonas denitrifies NO₃⁻ → N₂↑ gas loss'],
    ],
  },
  'ag-animal-anat': {
    title: 'Ruminant 4-Chamber Stomach vs Avian Foregut Comparison',
    headers: ['Organ / Chamber', 'Structural Feature', 'Digestive Function'],
    rows: [
      ['1. Rumen (Paunch)', 'Largest chamber; anaerobic pH 6.2–6.8 vat', 'Symbiotic bacteria/protozoa ferment cellulose → VFAs + synthesize Vit B & K'],
      ['2. Reticulum & 3. Omasum', 'Reticulum = honeycomb · Omasum = book-like manyplies', 'Reticulum forms cud bolus & traps wire; Omasum presses & absorbs water'],
      ['4. Abomasum', 'True glandular stomach (received directly via groove in calves)', 'Secretes HCl, pepsin & rennin to digest rumen microbes & proteins'],
      ['Avian Crop → Proventriculus → Gizzard', 'Storage sac → Glandular HCl stomach → Muscular grit mill', 'Replaces absent teeth by soaking, acidifying, and mechanically grinding grain'],
    ],
  },
  'ag-nutrition': {
    title: 'Livestock Ration Classes, Pearson Square & Deficiency Syndromes',
    headers: ['Category / Nutrient', 'Key Examples / Formula', 'Clinical / Production Significance'],
    rows: [
      ['Energy vs Protein Conc.', 'Energy: Maize, Cassava, Sorghum · Protein: GNC (45%), SBM (44%), Fishmeal (62%)', 'Toast raw soybeans to destroy trypsin inhibitor; limit cottonseed gossypol in pigs'],
      ['Flushing vs Steaming Up', 'Flushing: 2–3 wks PRE-mating · Steaming Up: last 6–8 wks of pregnancy', 'Flushing boosts ovulation/twinning; Steaming Up builds fetus, udder & colostrum'],
      ['Pearson Square & FCR', 'Diagonal |CP differences| = parts · FCR = Feed Consumed / Weight Gained', 'Lower FCR (1.7 vs 3.0) = superior biological & profit efficiency'],
      ['Key Deficiencies', 'Ca/P/Vit D → Rickets · Vit B₂ → Curled-toe · Fe → Piglet anaemia', 'Confined concrete piglets require Day-3 Iron Dextran injection'],
    ],
  },
  'ag-econ-accounts': {
    title: 'Farm Financial Statements & Depreciation Summary',
    headers: ['Statement / Metric', 'Exact Accounting Structure / Equation', 'Interpretation Rule'],
    rows: [
      ['Profit & Loss Account', 'Debit (Left): Opening Val + Expenses · Credit (Right): Sales + Home Use + Closing Val', 'Measures net profit/loss over a full accounting period'],
      ['Balance Sheet', 'Net Worth (Equity) = Total Assets − Total Liabilities (on a single date)', 'Assets > Liabilities = Solvent; Liabilities > Assets = Insolvent (bankrupt)'],
      ['Gross Margin vs Net Profit', 'GM = Total Revenue − Variable Costs · Net Profit = GM − Fixed Costs', 'Ranks enterprise profitability before overhead fixed costs'],
      ['Straight-Line Depreciation', 'Annual D = (Cost C − Salvage S) / Useful Life N', 'Durable machines/buildings depreciate; farmland itself generally appreciates'],
    ],
  },
};

function shuffleMcq(
  key: string,
  o: string[],
  a: number,
  fb?: string[]
): { o: string[]; a: number; fb?: string[] } {
  const order = perm(key, o.length);
  return {
    o: order.map((idx) => o[idx]),
    a: Math.max(0, order.indexOf(a)),
    fb: fb ? order.map((idx) => fb[idx] ?? '') : undefined,
  };
}

function buildInteractiveForAgricTopic(topic: Topic): InteractiveLesson {
  const tableSpec = AGRIC_TEACH_TABLES[topic.id];

  return {
    title: topic.name,
    goals: topic.goals,
    trap: topic.trap,
    parts: topic.parts.map((part, pIdx) => {
      const beats: Beat[] = [];

      const ideaBeat: IdeaBeat = {
        k: 'idea',
        kl: `Chapter ${pIdx + 1} · Core Principle`,
        title: part.title,
        idea: part.idea,
        g: part.g,
        cap: part.cap,
        rules: part.rules,
        rh: 'Essential Agronomic Principles & Rules',
      };
      beats.push(ideaBeat);

      if (pIdx === 0 && tableSpec) {
        const body: TeachBlock[] = [
          ['h', tableSpec.title],
          ['tb', tableSpec.headers, tableSpec.rows],
          ['wn', `<b>Trap:</b> ${topic.trap}`],
        ];
        const teachBeat: TeachBeat = {
          k: 'teach',
          kl: 'Mastery Comparison Chart',
          title: tableSpec.title,
          body,
        };
        beats.push(teachBeat);
      }

      const fadeSteps = part.ex.steps.map((st, sIdx) => {
        const isLast = sIdx === part.ex.steps.length - 1;
        if (isLast && part.ex.why) {
          const [, wq, wo, wfb] = part.ex.why;
          return {
            m: st[0],
            why: st[1],
            whyQ: {
              q: wq,
              o: wo,
              a: 0,
              fb: wfb,
            },
          };
        }
        return {
          m: st[0],
          why: st[1],
        };
      });

      beats.push({
        k: 'fade',
        kl: 'Worked Agronomic Analysis',
        lv: pIdx === 0 ? 'full' : 'one',
        title: `Worked Example — ${part.title}`,
        q: part.ex.q,
        g: part.ex.g,
        steps: fadeSteps,
      });

      if (topic.spot && topic.spot.part === pIdx) {
        const sp = shuffleMcq(
          `spot|${topic.id}|${pIdx}`,
          topic.spot.o,
          topic.spot.a ?? 0,
          topic.spot.fb
        );
        beats.push({
          k: 'spot',
          kl: 'Spot the Trap',
          title: `Audit ${topic.spot.who}’s Working`,
          who: topic.spot.who,
          q: topic.spot.q,
          lines: topic.spot.lines,
          bad: topic.spot.bad,
          okfb: topic.spot.okfb,
          o: sp.o,
          a: sp.a,
          fb: sp.fb || ['', '', '', ''],
          h: topic.spot.h,
          fix: topic.spot.fix,
        });
      }

      const defaultFb = part.tryit.o.map((_, idx) =>
        idx === part.tryit.a
          ? `Spot on! ${part.tryit.e}`
          : `Review the exact agronomic principle: ${part.tryit.e}`
      );
      const cp = shuffleMcq(
        `tryit|${topic.id}|${pIdx}`,
        part.tryit.o,
        part.tryit.a,
        part.tryit.fb || defaultFb
      );
      beats.push({
        k: 'check',
        kl: 'Quick Mastery Check',
        title: `Your Turn — ${part.title}`,
        q: part.tryit.q,
        o: cp.o,
        a: cp.a,
        fb: cp.fb || defaultFb,
        h: [part.tryit.h],
      });

      return {
        title: part.title,
        beats,
      };
    }),
  };
}

export function buildAgricCurriculum(): {
  topics: Topic[];
  il: Record<string, InteractiveLesson>;
} {
  const rawTopics: Topic[] = [
    ...AGRIC_TOPICS_PART1,
    ...AGRIC_TOPICS_PART2,
    ...AGRIC_TOPICS_PART3,
  ];

  const topics: Topic[] = rawTopics.map((topic) => ({
    ...topic,
    qs: topic.qs.map((q, qIdx) => {
      const p = shuffleMcq(`q|${topic.id}|${qIdx}`, q.o, q.a, q.w);
      return {
        ...q,
        o: p.o,
        a: p.a,
        w: p.fb,
      };
    }),
  }));

  const il: Record<string, InteractiveLesson> = {};
  for (const t of rawTopics) {
    il[t.id] = buildInteractiveForAgricTopic(t);
  }

  return { topics, il };
}
