// @ts-nocheck
import type { LabItem } from '../types';

/**
 * Builds the 13 additional animated Secondary & Exam Chemistry Practicals (bringing Chemistry Lab to 20 total!)
 * using the exact CLK chalkboard apparatus animation engine so glassware, pouring, droplets,
 * gas bubbles, flames, precipitates, and Professor Spark step narration all synchronize seamlessly.
 */
export function buildExtraChemLabs(CLK: any): LabItem[] {
  const CWATER = 'rgba(140,203,255,.34)';
  const CCLEAR = 'rgba(205,228,245,.22)';
  const CPURPLE = 'rgba(176,72,225,.78)';
  const CPALEPINK = 'rgba(245,148,198,.52)';
  const CPALEGREEN = 'rgba(155,220,168,.38)';
  const CMILKY = 'rgba(238,245,248,.82)';
  const CORANGE = 'rgba(238,136,42,.72)';
  const CGREEN = 'rgba(54,188,118,.68)';
  const CROYAL = 'rgba(38,98,235,.82)';
  const CSULPHUR = 'rgba(246,226,98,.84)';

  const volFlaskPts = (cx: number, top: number, neckBot: number, bot: number, nw = 6, bw = 38) =>
    `${cx - nw},${top} ${cx - nw},${neckBot} ${cx - bw},${bot - 14} ${cx - bw + 6},${bot} ${cx + bw - 6},${bot} ${cx + bw},${bot - 14} ${cx + nw},${neckBot} ${cx + nw},${top}`;

  const volFlask = (cx: number, top: number, neckBot: number, bot: number, nw = 6, bw = 38) =>
    `<path class="cl-gl" d="M${cx - nw} ${top}V${neckBot}C${cx - bw - 4} ${neckBot + 18} ${cx - bw - 4} ${bot - 8} ${cx - bw + 8} ${bot}H${cx + bw - 8}C${cx + bw + 4} ${bot - 8} ${cx + bw + 4} ${neckBot + 18} ${cx + nw} ${neckBot}V${top}"/><path class="cl-ln" d="M${cx - nw - 3} ${top}H${cx + nw + 3}"/><path class="cl-thin" d="M${cx - nw - 2} ${neckBot - 22}H${cx + nw + 2}" stroke="#FFC531"/>`;

  return [
    /* ── 8. Standard Solution Preparation (cat: 'q') ── */
    {
      id: 'c-stdsol',
      subj: 'chem',
      cat: 'q',
      h: 300,
      name: 'Prepare a standard solution (0.10 M Na₂CO₃)',
      blurb: 'Weighing, quantitative transfer, wash-bottle rinsing & meniscus calibration in a 250 cm³ volumetric flask',
      tip: 'Use anhydrous Na₂CO₃ (a primary standard), rinse beaker & funnel into the volumetric flask with distilled water, and read the bottom of the meniscus at eye level.',
      defs: `<clipPath id="clstd-v"><polygon points="${volFlaskPts(246, 98, 186, 274)}"/></clipPath>`,
      steps: () => [
        {
          say: 'Calculate the required mass for 250 cm³ of 0.10 mol dm⁻³ Na₂CO₃: n = 0.10 × 0.250 = 0.025 mol; mass = 0.025 × 106 = 2.65 g. Weigh exactly 2.65 g on an electronic balance.',
        },
        {
          say: 'Transfer the solid into a clean beaker containing about 80 cm³ of distilled water and stir with a glass rod until every crystal dissolves completely.',
        },
        {
          say: 'Pour the solution down a glass rod through a filter funnel into a 250 cm³ volumetric flask. Rinse the beaker, rod and funnel with distilled water into the flask so no solute is lost.',
        },
        {
          say: 'Add distilled water carefully, using a dropping pipette for the final drops, until the bottom of the meniscus rests tangentially on the 250 cm³ graduation mark at eye level.',
        },
        {
          say: 'Insert the stopper firmly and invert the volumetric flask several times to obtain a uniform 0.10 mol dm⁻³ standard solution.',
        },
      ],
      scene: () => {
        const K = CLK;
        return [
          K.show(0, K.bench(275), { dur: 0.3 }),
          // Step 0: Electronic balance + weighing boat
          K.show(
            0,
            `<rect class="cl-ln" x="34" y="242" width="96" height="32" rx="4" fill="rgba(213,226,219,.14)"/><rect x="52" y="251" width="60" height="14" rx="2" fill="#0E2219"/><path class="cl-gl" d="M52 236l8 6h44l8-6z"/><ellipse cx="82" cy="235" rx="16" ry="4" fill="#F2F7F3"/>`,
            { until: 1, dur: 0.6 }
          ),
          K.lab(0, [82, 258], '2.65 g', { cls: 'eq', until: 1 }),
          K.lab(0, [82, 214], 'anhydrous Na₂CO₃', { cls: 'dimm', until: 0 }),
          // Step 1: Dissolving in beaker
          K.show(1, K.beaker(44, 152, 76, 86), { until: 2, dur: 0.5 }),
          K.liq(1, { x: 46, w: 72, bottom: 236, h0: 0, h1: 48, fill: CWATER, until: 2, dur: 1.2 }),
          K.show(1, `<path class="cl-ln" d="M96 128L72 230" stroke-width="2.5"/>`, { until: 2, dur: 0.4 }),
          K.lab(1, [82, 116], 'stir to dissolve', { cls: 'eq', until: 1 }),
          // Step 2: Volumetric flask + funnel transfer
          K.show(2, volFlask(246, 98, 186, 274), { dur: 0.6 }),
          K.lab(2, [310, 256], '250 cm³ flask', { anchor: 'start', to: [284, 256], par: true }),
          K.show(2, K.funnel(246, 66, 44, 118), { until: 2, dur: 0.4 }),
          K.drops(2, 246, 120, 232, 6, { par: true }),
          K.liq(2, { x: 206, w: 80, bottom: 273, h0: 0, h1: 72, fill: CWATER, clip: 'clstd-v', until: 2, dur: 2.4 }),
          K.lab(2, [176, 82], 'rinse all washings in', { anchor: 'end', to: [224, 82], until: 2, cls: 'dimm' }),
          // Step 3: Dropper making up to 250 cm3 mark (neckBot - 22 = 164 => h = 273 - 164 = 109)
          K.move(3, K.dropper(246, 90), [0, -32], { until: 3, dur: 0.6 }),
          K.drops(3, 246, 92, 164, 4, { par: true }),
          K.liq(3, { x: 206, w: 80, bottom: 273, h0: 72, h1: 109, fill: CWATER, clip: 'clstd-v', dur: 1.8 }),
          K.lab(3, [188, 164], 'calibration mark', { anchor: 'end', to: [236, 164], cls: 'eq' }),
          K.lab(3, [188, 180], '(eye level meniscus)', { anchor: 'end', cls: 'dimm', until: 3 }),
          // Step 4: Stoppered & homogenised
          K.show(4, `<polygon points="239,88 253,88 251,102 241,102" fill="#E6EEF8" stroke="#B3C5BA"/>`, { dur: 0.5 }),
          K.lab(4, [110, 118], 'Standard Solution Ready', { cls: 'big' }),
          K.lab(4, [110, 138], 'C = 0.100 mol dm⁻³ Na₂CO₃', { cls: 'eq' }),
          K.lab(4, [110, 156], 'Stopper & invert to mix', { cls: 'dimm' }),
        ];
      },
    },

    /* ── 9. Redox Titration: KMnO₄ vs Acidified Fe²⁺ (cat: 'q') ── */
    {
      id: 'c-redox-tit',
      subj: 'chem',
      cat: 'q',
      h: 306,
      name: 'Redox titration: KMnO₄ vs acidified Fe²⁺',
      blurb: 'Self-indicating permanganate titration — purple to colourless until first permanent pale pink',
      tip: 'Acidify with dilute H₂SO₄ (HCl is oxidised to Cl₂; HNO₃ is itself an oxidising agent), need no extra indicator, and read the TOP of the dark KMnO₄ meniscus.',
      defs: `<clipPath id="clrx-f"><polygon points="${CLK.flaskPts(175, 206, 286)}"/></clipPath>`,
      steps: () => [
        {
          say: 'Pipette 25.0 cm³ of iron(II) tetraoxosulphate(VI) solution into a conical flask on a white tile, then add about 20 cm³ of dilute H₂SO₄ to supply H⁺ ions and prevent brown MnO₂ precipitating.',
        },
        {
          say: 'Fill the burette with potassium tetraoxomanganate(VII), KMnO₄(aq). Because KMnO₄ is intensely dark purple, read the TOP of the meniscus: 0.00 cm³.',
        },
        {
          say: 'Run KMnO₄(aq) into the flask while swirling. Each purple drop is immediately decolourised as MnO₄⁻ (+7) is reduced to almost colourless Mn²⁺ (+2), oxidising Fe²⁺ to Fe³⁺.',
        },
        {
          say: 'Stop at the exact drop that imparts the first permanent pale-pink tint to the solution — KMnO₄ acts as its own self-indicator! Record the titre: 20.00 cm³.',
        },
        {
          say: 'Apply the half-equations: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O and 5Fe²⁺ → 5Fe³⁺ + 5e⁻. Mole ratio n(MnO₄⁻) : n(Fe²⁺) = 1 : 5.',
        },
      ],
      scene: () => {
        const K = CLK;
        return [
          K.show(0, `<rect x="118" y="287" width="114" height="6" rx="1.5" fill="#E9EFEC" fill-opacity=".85"/>` + K.flask(175, 206, 286), { dur: 0.5 }),
          K.liq(0, { x: 135, w: 80, bottom: 285, h0: 0, h1: 24, fill: CPALEGREEN, clip: 'clrx-f', until: 2, dur: 1.5 }),
          K.lab(0, [264, 266], '25 cm³ Fe²⁺ + dil. H₂SO₄', { anchor: 'start', to: [208, 266] }),
          K.show(1, K.stand(92, 8, 293, 60, 175) + K.burette(175, 12, 152), { dur: 0.6 }),
          K.liq(1, { x: 170, w: 10, bottom: 163, h0: 0, h1: 140, fill: CPURPLE, until: 1, dur: 1.8 }),
          K.lab(1, [260, 38], 'dark purple KMnO₄(aq)', { anchor: 'start', to: [183, 38], cls: 'eq' }),
          K.lab(1, [260, 54], '(read TOP of meniscus)', { anchor: 'start', cls: 'dimm' }),
          K.lab(1, [156, 23], '0.00', { anchor: 'end', to: [168, 23], cls: 'eq' }),
          K.drops(2, 175, 192, 256, 8, { fill: '#C86BFF', par: true }),
          K.liq(2, { x: 170, w: 10, bottom: 163, h0: 140, h1: 80, fill: CPURPLE, dur: 3.4, par: true }),
          K.liq(2, { x: 135, w: 80, bottom: 285, h0: 24, h1: 35, fill: CCLEAR, clip: 'clrx-f', until: 2, dur: 3.4 }),
          K.lab(2, [96, 224], 'MnO₄⁻ → Mn²⁺', { anchor: 'end', cls: 'dimm', until: 2 }),
          K.show(3, `<rect class="cl-lq" fill="${CPALEPINK}" clip-path="url(#clrx-f)" x="135" width="80" y="250" height="35"/>`, { dur: 0.9 }),
          K.lab(3, [156, 83], '20.00', { anchor: 'end', to: [168, 83], cls: 'eq' }),
          K.lab(3, [256, 240], 'permanent pale pink', { anchor: 'start', to: [206, 260], cls: 'eq' }),
          K.lab(4, [244, 108], 'Ionic Mole Ratio', { anchor: 'start', cls: 'big' }),
          K.lab(4, [244, 128], 'MnO₄⁻ + 5Fe²⁺ + 8H⁺', { anchor: 'start', cls: 'eq' }),
          K.lab(4, [244, 146], '→ Mn²⁺ + 5Fe³⁺ + 4H₂O', { anchor: 'start', cls: 'eq' }),
          K.lab(4, [244, 166], 'n(MnO₄⁻) : n(Fe²⁺) = 1 : 5', { anchor: 'start', cls: 'dimm' }),
        ];
      },
    },

    /* ── 10. Simple Distillation (cat: 's') ── */
    {
      id: 'c-distill',
      subj: 'chem',
      cat: 's',
      h: 300,
      name: 'Simple distillation of impure water',
      blurb: 'Recover pure solvent from a solution using a thermometer and Liebig condenser',
      tip: 'Position the thermometer bulb opposite the condenser side-arm, add anti-bumping granules, and feed cold cooling water IN at the lowest point and OUT at the top.',
      defs: `<clipPath id="clds-f"><circle cx="82" cy="186" r="33"/></clipPath><clipPath id="clds-r"><polygon points="${CLK.flaskPts(308, 206, 274, 7, 28, 18)}"/></clipPath>`,
      steps: () => [
        {
          say: 'Pour salty or Coloured ink water into a round-bottomed distillation flask with a few anti-bumping granules to promote smooth boiling. Fit a thermometer with its bulb opposite the side-arm.',
        },
        {
          say: 'Connect a sloping Liebig condenser and pass cold tap water IN through the bottom jacket inlet and OUT from the top outlet (counter-current cooling).',
        },
        {
          say: 'Heat the flask gently. Water boils at 100 °C; pure steam rises past the thermometer bulb into the side-arm while dissolved non-volatile salts stay behind.',
        },
        {
          say: 'Inside the cold Liebig condenser, the steam loses latent heat and condenses into colourless drops of pure distilled water.',
        },
        {
          say: 'Collect the pure distillate in the receiving conical flask. Its sharp 100 °C boiling point at 1 atm confirms purity.',
        },
      ],
      scene: () => {
        const K = CLK;
        return [
          K.show(
            0,
            K.bench(275) +
              K.tripod(82, 220, 274, 58) +
              K.burner(82, 274, 244) +
              `<circle class="cl-gl" cx="82" cy="186" r="34"/><path class="cl-gl" d="M74 153V92h16v61"/>` +
              `<rect x="73" y="84" width="18" height="9" rx="2" fill="#8A6B4A"/><path class="cl-ln" d="M82 54V136" stroke="#FFC531" stroke-width="2"/><circle cx="82" cy="136" r="3.2" fill="#FF5E5E"/>`,
            { dur: 0.6 }
          ),
          K.liq(0, { x: 48, w: 68, bottom: 220, h0: 0, h1: 36, fill: 'rgba(59,155,255,.55)', clip: 'clds-f', dur: 1.1 }),
          K.show(0, `<circle cx="76" cy="214" r="2" fill="#E9EFEC"/><circle cx="86" cy="215" r="2" fill="#E9EFEC"/>`, { dur: 0.3 }),
          K.lab(0, [82, 42], 'thermometer (100 °C)', { cls: 'eq' }),
          // Step 1: Liebig condenser + receiver flask
          K.show(
            1,
            `<path class="cl-gl" d="M90 120L278 192M90 128L275 199"/>` +
              `<polygon points="122,124 252,174 244,196 114,146" fill="rgba(140,203,255,.22)" stroke="#A7C4BC" stroke-width="1.4"/>` +
              `<path class="cl-ln" d="M236 193l-6 16M130 127l6-16" stroke="#5AA9FF"/>` +
              K.flask(308, 206, 274, 7, 28, 18),
            { dur: 0.7 }
          ),
          K.lab(1, [224, 220], 'Cold water IN ↑', { cls: 'eq' }),
          K.lab(1, [154, 102], 'Water OUT ↑', { cls: 'dimm' }),
          // Step 2: Heating & boiling bubbles
          K.show(2, K.flame(82, 244, 22), { dur: 0.4 }),
          K.bubbles(2, [[74, 212, 188], [84, 214, 188], [90, 210, 188]], { dur: 1.4 }),
          K.lab(2, [36, 170], 'impure solution', { anchor: 'middle', cls: 'dimm' }),
          // Step 3: Condensing drops into receiver
          K.drops(3, 282, 200, 266, 6, { par: true }),
          K.liq(3, { x: 280, w: 56, bottom: 273, h0: 0, h1: 22, fill: CWATER, clip: 'clds-r', dur: 2.5 }),
          K.lab(3, [202, 140], 'Liebig condenser', { cls: 'dimm' }),
          // Step 4: Pure distillate label
          K.lab(4, [308, 288], 'pure distillate (H₂O)', { cls: 'eq' }),
        ];
      },
    },

    /* ── 11. Sublimation of NH₄Cl (cat: 's') ── */
    {
      id: 'c-sublim',
      subj: 'chem',
      cat: 's',
      h: 300,
      name: 'Sublimation: separate NH₄Cl from NaCl',
      blurb: 'Separate a subliming solid from a non-subliming salt using an inverted funnel',
      tip: 'Common substances that sublime on gentle heating: ammonium chloride (NH₄Cl), iodine (I₂), solid carbon(IV) oxide (dry ice), naphthalene, and camphor.',
      steps: () => [
        {
          say: 'Place the dry mixture of ammonium chloride (NH₄Cl) and sodium chloride (NaCl) in an evaporating dish on a tripod and wire gauze.',
        },
        {
          say: 'Cover the dish with an inverted glass funnel and plug the stem loosely with cotton wool so escaping white vapours do not escape into the room.',
        },
        {
          say: 'Heat gently. NH₄Cl dissociates and sublimes directly from solid to dense white vapour without melting, while NaCl (m.p. 801 °C) stays behind in the dish.',
        },
        {
          say: 'On touching the cool upper glass wall of the inverted funnel, the vapour solidifies back into pure white NH₄Cl sublimate. Scrape it off after cooling.',
        },
      ],
      scene: () => {
        const K = CLK;
        return [
          K.show(
            0,
            K.bench(275) +
              K.tripod(180, 212, 274, 84) +
              K.burner(180, 274, 240) +
              `<path class="cl-gl" d="M132 194Q180 226 228 194"/><path class="cl-ln" d="M128 194H232"/>` +
              `<ellipse cx="180" cy="204" rx="28" ry="5" fill="#DCE5DF"/>`,
            { dur: 0.6 }
          ),
          K.lab(0, [284, 204], 'NH₄Cl + NaCl(s)', { anchor: 'start', to: [228, 200] }),
          // Step 1: Inverted funnel + cotton wool plug
          K.show(
            1,
            `<path class="cl-gl" d="M134 194L174 114V66M226 194L186 114V66"/>` +
              `<ellipse cx="180" cy="68" rx="8" ry="10" fill="#F4F7F5" stroke="#B3C5BA"/>`,
            { dur: 0.6 }
          ),
          K.lab(1, [246, 68], 'cotton wool plug', { anchor: 'start', to: [190, 68] }),
          K.lab(1, [94, 146], 'inverted funnel', { anchor: 'end', to: [154, 150], cls: 'dimm' }),
          // Step 2: Flame + rising white vapours
          K.show(2, K.flame(180, 240, 26), { dur: 0.4 }),
          {
            at: 2,
            dur: 1.5,
            f: () =>
              [168, 180, 192]
                .map((x, i) => `<path class="cl-steam" style="animation-delay:${i * 0.4}s" d="M${x} 196q-5-12 0-24t0-24"/>`)
                .join(''),
          },
          K.lab(2, [88, 232], 'gentle heat', { anchor: 'end', cls: 'dimm' }),
          // Step 3: Pure white sublimate crust inside upper funnel walls
          K.show(
            3,
            `<path d="M156 154L173 118v4l-13 34zM204 154L187 118v4l13 34z" fill="#FFFFFF" fill-opacity=".9"/>`,
            { dur: 0.9 }
          ),
          K.lab(3, [252, 132], 'pure NH₄Cl sublimate', { anchor: 'start', to: [198, 134], cls: 'eq' }),
          K.lab(3, [284, 224], 'NaCl residue stays', { anchor: 'start', to: [204, 206], cls: 'dimm' }),
        ];
      },
    },

    /* ── 12. Preparation & Squeaky-Pop Test for Hydrogen (cat: 'g') ── */
    {
      id: 'c-hydrogen',
      subj: 'chem',
      cat: 'g',
      h: 300,
      name: 'Prepare and test hydrogen gas (H₂)',
      blurb: 'Zinc granules + dilute HCl, upward delivery, and the lighted splint squeaky-pop test',
      tip: 'Hydrogen (Mᵣ = 2) is the lightest gas, so collect it by upward delivery (downward displacement of air) or over water. Never use HNO₃ with metals (it yields nitrogen oxides instead of H₂).',
      defs: `<clipPath id="clh-f"><polygon points="${CLK.flaskPts(80, 180, 270, 9, 38, 24)}"/></clipPath>`,
      steps: () => [
        {
          say: 'Place granulated zinc in a flat-bottomed flask fitted with a dropping funnel and delivery tube leading up into an inverted dry gas jar.',
        },
        {
          say: 'Run dilute hydrochloric acid onto the zinc granules. Brisk effervescence occurs: Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g) (a drop of CuSO₄ speeds up the reaction as catalyst).',
        },
        {
          say: 'Because H₂ (Mᵣ = 2) is 14.5 times lighter than air, it rises to the top of the inverted gas jar, pushing denser air downward (upward delivery).',
        },
        {
          say: 'Confirmatory test: bring a lighted splint to the mouth of a test tube of H₂. The gas burns rapidly with oxygen in air, giving a sharp squeaky "pop" sound: 2H₂ + O₂ → 2H₂O.',
        },
      ],
      scene: () => {
        const K = CLK;
        return [
          K.show(
            0,
            K.bench(272) +
              K.flask(80, 180, 270, 9, 38, 24) +
              `<rect x="70" y="174" width="20" height="8" rx="2" fill="#8A6B4A"/>` +
              `<circle cx="68" cy="264" r="4" fill="#9BA8A1"/><circle cx="80" cy="265" r="4.5" fill="#AEB9B3"/><circle cx="92" cy="264" r="4" fill="#9BA8A1"/>` +
              `<path class="cl-gl" d="M66 96L75 118V254M86 96L77 118V254"/><path class="cl-ln" d="M64 96H88"/>` +
              `<path class="cl-ln" d="M85 186V146H228V96" stroke-width="3" stroke-opacity=".6"/>` +
              `<path class="cl-gl" d="M208 202V82h40v120"/><path class="cl-ln" d="M204 82h48"/>`,
            { until: 2, dur: 0.6 }
          ),
          K.lab(0, [80, 286], 'zinc granules', { until: 2 }),
          K.lab(0, [262, 114], 'inverted gas jar', { anchor: 'start', to: [248, 114], until: 2 }),
          // Step 1: Add dilute HCl + bubbles
          K.drops(1, 76, 132, 250, 5, { par: true }),
          K.liq(1, { x: 42, w: 76, bottom: 269, h0: 0, h1: 24, fill: CWATER, clip: 'clh-f', until: 2, dur: 2.0 }),
          K.bubbles(1, [[68, 260, 242], [80, 262, 242], [92, 260, 242]], { until: 2, dur: 1.4 }),
          K.lab(1, [104, 102], 'dilute HCl(aq)', { anchor: 'start', to: [88, 102], until: 2 }),
          // Step 2: H2 rises in inverted jar
          K.lab(2, [228, 106], 'H₂(g) ↑', { cls: 'eq', until: 2 }),
          K.lab(2, [228, 186], 'air pushed down ↓', { cls: 'dimm', until: 2 }),
          // Step 3: Lighted splint squeaky POP test
          K.show(3, K.bench(272, 90, 270) + K.tube(172, 128, 134, 28), { dur: 0.5 }),
          K.lab(3, [172, 188], 'H₂(g)', { cls: 'eq' }),
          K.move(
            3,
            `<path d="M248 76L184 124" stroke="#C9A66B" stroke-width="3" stroke-linecap="round"/>` +
              K.flame(184, 124, 24, '#FFC531', 0.9),
            [36, -36],
            { dur: 1.1 }
          ),
          K.show(
            3,
            `<circle cx="172" cy="122" r="18" fill="none" stroke="#FFD84D" stroke-width="2" stroke-dasharray="4 3"/>`,
            { dur: 0.5 }
          ),
          K.lab(3, [258, 72], 'lighted splint', { anchor: 'start' }),
          K.lab(3, [118, 118], 'Squeaky "POP"!', { anchor: 'end', to: [152, 122], cls: 'eq' }),
        ];
      },
    },

    /* ── 13. Carbon(IV) Oxide Preparation & Limewater Test (cat: 'g') ── */
    {
      id: 'c-co2',
      subj: 'chem',
      cat: 'g',
      h: 300,
      name: 'Prepare and test carbon(IV) oxide (CO₂)',
      blurb: 'Marble chips + dilute HCl, turning limewater milky, then colourless in excess CO₂',
      tip: 'Do NOT use dilute H₂SO₄ on CaCO₃ — insoluble CaSO₄ coats the marble chips and stops the reaction! Only CO₂ and SO₂ turn limewater milky, and CO₂ is odourless and has no effect on acidified K₂Cr₂O₇.',
      defs: `<clipPath id="clco-f"><polygon points="${CLK.flaskPts(78, 178, 270, 9, 38, 24)}"/></clipPath>${CLK.tubeClip('clco-t', 248, 118, 148, 34)}`,
      steps: () => [
        {
          say: 'Place marble chips (CaCO₃) in a flask fitted with a dropping funnel and a delivery tube dipping into clear colourless limewater, Ca(OH)₂(aq).',
        },
        {
          say: 'Run dilute HCl onto the marble chips: CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g). Steady effervescence evolves colourless, odourless CO₂.',
        },
        {
          say: 'Bubble the gas through clear limewater for a few seconds. The limewater turns milky (cloudy white) due to insoluble calcium trioxocarbonate(IV): Ca(OH)₂(aq) + CO₂(g) → CaCO₃(s) + H₂O(l).',
        },
        {
          say: 'Continue bubbling CO₂ in excess. The white milkiness redissolves completely to form a clear colourless solution of soluble calcium hydrogentrioxocarbonate(IV), Ca(HCO₃)₂(aq)!',
        },
        {
          say: 'Notice: Ca(HCO₃)₂(aq) is the exact compound responsible for temporary hardness of water!',
        },
      ],
      scene: () => {
        const K = CLK;
        return [
          K.show(
            0,
            K.bench(272) +
              K.flask(78, 178, 270, 9, 38, 24) +
              `<rect x="68" y="172" width="20" height="8" rx="2" fill="#8A6B4A"/>` +
              `<polygon points="62,266 70,258 78,266" fill="#E9EFEC"/><polygon points="78,266 86,257 94,266" fill="#E9EFEC"/>` +
              `<path class="cl-gl" d="M64 96L73 118V254M84 96L75 118V254"/><path class="cl-ln" d="M62 96H86"/>` +
              `<path class="cl-ln" d="M84 186V140H248V242" stroke-width="2.8" stroke-opacity=".6"/>` +
              K.tube(248, 118, 148, 34),
            { dur: 0.6 }
          ),
          K.liq(0, { x: 231, w: 34, bottom: 266, h0: 0, h1: 82, fill: CCLEAR, clip: 'clco-t', until: 1, dur: 1.0 }),
          K.lab(0, [78, 286], 'CaCO₃ marble chips'),
          K.lab(0, [274, 210], 'clear limewater', { anchor: 'start', to: [266, 210], until: 1 }),
          // Step 1: Add HCl + CO2 bubbles in both vessels
          K.drops(1, 74, 130, 250, 5, { par: true }),
          K.liq(1, { x: 40, w: 76, bottom: 269, h0: 0, h1: 24, fill: CWATER, clip: 'clco-f', dur: 1.8, par: true }),
          K.bubbles(1, [[68, 260, 242], [84, 260, 242]], { dur: 1.2, par: true }),
          K.bubbles(1, [[244, 242, 190], [252, 246, 190]], { dur: 1.4 }),
          K.lab(1, [98, 102], 'dil. HCl(aq)', { anchor: 'start', to: [86, 102] }),
          // Step 2: Limewater turns milky white!
          K.show(
            2,
            `<rect class="cl-lq" fill="${CMILKY}" clip-path="url(#clco-t)" x="231" y="184" width="34" height="82"/>`,
            { until: 2, dur: 0.9 }
          ),
          K.lab(2, [274, 200], 'turns MILKY!', { anchor: 'start', to: [266, 206], cls: 'eq', until: 2 }),
          K.lab(2, [274, 216], 'CaCO₃(s) ppt', { anchor: 'start', cls: 'dimm', until: 2 }),
          // Step 3 & 4: Excess CO2 -> clears back to colourless Ca(HCO3)2
          K.gone(
            3,
            `<rect class="cl-lq" fill="${CMILKY}" clip-path="url(#clco-t)" x="231" y="184" width="34" height="82"/>`,
            { par: true, dur: 1.1 }
          ),
          K.show(
            3,
            `<rect class="cl-lq" fill="${CCLEAR}" clip-path="url(#clco-t)" x="231" y="184" width="34" height="82"/>`,
            { dur: 1.1 }
          ),
          K.lab(3, [274, 198], 'clears in excess', { anchor: 'start', to: [266, 206], cls: 'eq' }),
          K.lab(3, [274, 214], 'soluble Ca(HCO₃)₂', { anchor: 'start', cls: 'dimm' }),
          K.lab(4, [164, 54], 'CO₂ + CaCO₃(s) + H₂O → Ca(HCO₃)₂(aq)', { cls: 'eq' }),
        ];
      },
    },

    /* ── 14. Dry Preparation & Confirmatory Tests for Ammonia (cat: 'g') ── */
    {
      id: 'c-ammonia',
      subj: 'chem',
      cat: 'g',
      h: 300,
      name: 'Prepare dry ammonia (NH₃) & test its alkalinity',
      blurb: 'Slaked lime + NH₄Cl in a sloping tube, CaO drying tower, moist red litmus & HCl fumes',
      tip: 'Clamp the boiling tube sloping DOWNWARD toward the mouth so condensed water does not run back onto hot glass. Dry NH₃ ONLY with quicklime (CaO) — it reacts with conc. H₂SO₄ and anhydrous CaCl₂!',
      steps: () => [
        {
          say: 'Grind calcium hydroxide (slaked lime) with ammonium chloride and place in a boiling tube clamped sloping slightly DOWNWARD toward the cork.',
        },
        {
          say: 'Connect the delivery tube through a drying tower packed with lumps of quicklime, CaO, leading up into an inverted dry gas jar.',
        },
        {
          say: 'Heat the mixture gently: Ca(OH)₂(s) + 2NH₄Cl(s) → CaCl₂(s) + 2H₂O(l) + 2NH₃(g). Quicklime absorbs moisture without reacting with alkaline NH₃.',
        },
        {
          say: 'Dry NH₃ (Mᵣ = 17, lighter than air and extremely soluble in water) collects by upward delivery. Hold moist red litmus paper at the jar neck — it turns blue!',
        },
        {
          say: 'Confirmatory test: bring a glass rod dipped in concentrated HCl near the mouth — dense white fumes of solid NH₄Cl form immediately: NH₃(g) + HCl(g) → NH₄Cl(s).',
        },
      ],
      scene: () => {
        const K = CLK;
        return [
          K.show(
            0,
            K.bench(274) +
              K.stand(32, 86, 274, 152, 76) +
              `<g transform="translate(88 152) rotate(14)"><rect class="cl-gl" x="-34" y="-12" width="84" height="24" rx="10"/><ellipse cx="-14" cy="4" rx="16" ry="5" fill="#E9EFEC"/></g>` +
              K.burner(68, 274, 224),
            { dur: 0.6 }
          ),
          K.lab(0, [86, 118], 'sloping tube: Ca(OH)₂ + NH₄Cl', { cls: 'dimm' }),
          // Step 1: CaO drying tower + inverted gas jar
          K.show(
            1,
            `<path class="cl-ln" d="M138 166H188V226" stroke-width="2.6" stroke-opacity=".65"/>` +
              `<rect class="cl-gl" x="172" y="142" width="32" height="96" rx="4"/>` +
              [
                [182, 166],
                [194, 172],
                [182, 188],
                [194, 196],
                [184, 212],
              ]
                .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="#DCE5DF" stroke="#8E9E95"/>`)
                .join('') +
              `<path class="cl-ln" d="M188 142V118H278V76" stroke-width="2.6" stroke-opacity=".65"/>` +
              `<path class="cl-gl" d="M258 182V62h40v120"/><path class="cl-ln" d="M254 62h48"/>`,
            { dur: 0.7 }
          ),
          K.lab(1, [188, 254], 'CaO drying tower', { cls: 'eq' }),
          // Step 2: Flame + NH3 rising
          K.show(2, K.flame(68, 224, 28), { dur: 0.4 }),
          K.lab(2, [278, 94], 'dry NH₃ ↑', { cls: 'eq' }),
          // Step 3: Moist red litmus -> blue
          K.show(
            3,
            `<rect x="242" y="182" width="8" height="22" fill="#E25555"/><rect x="242" y="166" width="8" height="16" fill="#3B82F6"/>`,
            { dur: 0.6 }
          ),
          K.lab(3, [234, 192], 'red litmus → BLUE', { anchor: 'end', cls: 'eq' }),
          // Step 4: Rod with conc HCl -> dense white NH4Cl fumes
          K.move(4, `<path class="cl-ln" d="M336 206L286 184" stroke-width="3.2"/>`, [30, 20], { dur: 0.8 }),
          {
            at: 4,
            dur: 1.2,
            f: () =>
              `<ellipse cx="278" cy="182" rx="18" ry="10" fill="#FFFFFF" fill-opacity=".78"/><ellipse cx="286" cy="174" rx="14" ry="8" fill="#FFFFFF" fill-opacity=".65"/>`,
          },
          K.lab(4, [294, 224], 'conc. HCl rod:', { anchor: 'start', cls: 'dimm' }),
          K.lab(4, [294, 240], 'white NH₄Cl fumes', { anchor: 'start', cls: 'eq' }),
        ];
      },
    },

    /* ── 15. Confirmatory Cation Tests with Aqueous Ammonia (cat: 'i') ── */
    {
      id: 'c-cations-nh3',
      subj: 'chem',
      cat: 'i',
      h: 300,
      name: 'Confirmatory cation tests with NH₃(aq)',
      blurb: 'Distinguish Cu²⁺ (deep royal-blue complex) and Zn²⁺ (soluble) from Al³⁺ (insoluble white)',
      tip: 'Both Zn²⁺ and Al³⁺ form white precipitates soluble in excess NaOH(aq), so aqueous NH₃ is the decisive test: Zn(OH)₂ dissolves in excess NH₃ whereas Al(OH)₃ remains insoluble!',
      defs: [66, 142, 218, 294].map((x, i) => CLK.tubeClip('clnh-' + i, x, 70, 160, 30)).join(''),
      steps: () => [
        {
          say: 'Place 2 cm³ solutions of Cu²⁺ (pale blue), Zn²⁺ (colourless), Al³⁺ (colourless) and Fe³⁺ (yellow-brown) in four separate test tubes.',
        },
        {
          say: 'Add aqueous ammonia, NH₃(aq), dropwise to each tube.',
        },
        {
          say: 'Hydroxide precipitates appear: Cu²⁺ gives pale-blue Cu(OH)₂, Zn²⁺ and Al³⁺ both give white precipitates, and Fe³⁺ gives reddish-brown Fe(OH)₃.',
        },
        {
          say: 'Add NH₃(aq) in EXCESS: Cu(OH)₂ dissolves to a striking DEEP ROYAL-BLUE solution of [Cu(NH₃)₄]²⁺, and Zn(OH)₂ dissolves to colourless [Zn(NH₃)₄]²⁺!',
        },
        {
          say: 'Meanwhile, white Al(OH)₃ and red-brown Fe(OH)₃ remain INSOLUBLE in excess NH₃(aq) — cleanly distinguishing Al³⁺ from Zn²⁺!',
        },
      ],
      scene: () => {
        const K = CLK;
        const tubes = [
          ['Cu²⁺', 66, 'rgba(77,163,255,.55)', '#5BA8FF', 'pale blue'],
          ['Zn²⁺', 142, CCLEAR, '#F2F5F7', 'white ppt'],
          ['Al³⁺', 218, CCLEAR, '#F2F5F7', 'white ppt'],
          ['Fe³⁺', 294, 'rgba(232,197,71,.48)', '#9C4A1A', 'red-brown'],
        ];
        const ops: any[] = [
          K.show(
            0,
            `<path class="cl-ln" d="M30 238H330M30 238V250M330 238V250" stroke-width="2.4"/>` +
              tubes.map((t) => K.tube(t[1], 70, 160, 30)).join(''),
            { dur: 0.6 }
          ),
        ];
        tubes.forEach((t, i) => {
          ops.push(
            K.liq(0, { x: t[1] - 15, w: 30, bottom: 230, h0: 0, h1: 44, fill: t[2], clip: 'clnh-' + i, until: 2, dur: 0.8, par: i < 3 }),
            K.lab(0, [t[1], 258], t[0], { cls: 'big', par: true })
          );
        });
        tubes.forEach((t) => {
          ops.push(
            K.move(1, K.dropper(t[1], 64), [0, -28], { until: 1, dur: 0.4, par: true }),
            K.drops(1, t[1], 66, 182, 3, { par: true })
          );
        });
        ops.push(K.lab(1, [180, 14], 'add NH₃(aq) dropwise', { cls: 'dimm', until: 2 }));
        // Step 2: Precipitates
        tubes.forEach((t, i) => {
          ops.push(
            K.show(2, `<rect x="${t[1] - 15}" y="192" width="30" height="38" fill="${t[3]}" clip-path="url(#clnh-${i})"/>`, {
              until: i < 2 ? 2 : undefined,
              dur: 0.8,
              par: true,
            }),
            K.lab(2, [t[1], 278], t[4], { cls: 'eq', until: i < 2 ? 2 : undefined, par: true })
          );
        });
        ops.push({ at: 2, dur: 1.0, f: () => '' });
        // Step 3: Excess NH3 -> Cu2+ becomes deep royal blue, Zn2+ becomes clear, Al3+ & Fe3+ stay ppt
        ops.push(
          K.liq(3, { x: 51, w: 30, bottom: 230, h0: 44, h1: 94, fill: CROYAL, clip: 'clnh-0', dur: 1.5, par: true }),
          K.liq(3, { x: 127, w: 30, bottom: 230, h0: 44, h1: 94, fill: CCLEAR, clip: 'clnh-1', dur: 1.5, par: true }),
          K.liq(3, { x: 203, w: 30, bottom: 230, h0: 44, h1: 94, fill: CCLEAR, clip: 'clnh-2', dur: 1.5, par: true }),
          K.liq(3, { x: 279, w: 30, bottom: 230, h0: 44, h1: 94, fill: 'rgba(232,197,71,.3)', clip: 'clnh-3', dur: 1.5 }),
          K.lab(3, [66, 278], 'deep blue', { cls: 'eq', par: true }),
          K.lab(3, [142, 278], 'dissolves', { cls: 'eq', par: true }),
          K.lab(3, [180, 14], 'excess NH₃(aq) added', { cls: 'dimm' })
        );
        ops.push(
          K.lab(4, [66, 52], '[Cu(NH₃)₄]²⁺', { cls: 'eq', par: true }),
          K.lab(4, [142, 52], 'soluble', { par: true }),
          K.lab(4, [218, 52], 'insoluble!', { cls: 'eq', par: true }),
          K.lab(4, [294, 52], 'insoluble', { dur: 0.6 })
        );
        return ops;
      },
    },

    /* ── 16. Qualitative Tests for Common Anions (cat: 'i') ── */
    {
      id: 'c-anions',
      subj: 'chem',
      cat: 'i',
      h: 300,
      name: 'Qualitative tests for anions (CO₃²⁻, SO₄²⁻, Cl⁻, NO₃⁻)',
      blurb: 'Acid effervescence, BaCl₂ white ppt, AgNO₃ curdy ppt, and the NO₃⁻ brown ring test',
      tip: 'Always acidify BEFORE adding BaCl₂ (with dil. HCl) or AgNO₃ (with dil. HNO₃) to destroy any interfering CO₃²⁻ or SO₃²⁻ ions that would also form white precipitates!',
      defs: [66, 142, 218, 294].map((x, i) => CLK.tubeClip('clan-' + i, x, 72, 156, 30)).join(''),
      steps: () => [
        {
          say: 'Prepare four test tubes containing aqueous solutions of CO₃²⁻, SO₄²⁻, Cl⁻ and NO₃⁻ ions.',
        },
        {
          say: 'Tube 1 (CO₃²⁻): add dilute HCl. Immediate brisk effervescence of CO₂ occurs in the cold, turning limewater milky: CO₃²⁻ + 2H⁺ → H₂O + CO₂↑.',
        },
        {
          say: 'Tube 2 (SO₄²⁻): acidify with dilute HCl, then add BaCl₂(aq). A dense white precipitate of BaSO₄ forms, insoluble in excess HCl: Ba²⁺ + SO₄²⁻ → BaSO₄(s).',
        },
        {
          say: 'Tube 3 (Cl⁻): acidify with dilute HNO₃, then add AgNO₃(aq). A white curdy precipitate of AgCl forms, which dissolves in aqueous NH₃: Ag⁺ + Cl⁻ → AgCl(s).',
        },
        {
          say: 'Tube 4 (NO₃⁻ Brown Ring Test): add freshly prepared FeSO₄(aq), tilt the tube, and trickle concentrated H₂SO₄ slowly down the wall. A distinct brown ring of [Fe(NO)]²⁺ forms at the acid–water junction!',
        },
      ],
      scene: () => {
        const K = CLK;
        const xs = [66, 142, 218, 294];
        const names = ['CO₃²⁻', 'SO₄²⁻', 'Cl⁻', 'NO₃⁻'];
        return [
          K.show(
            0,
            `<path class="cl-ln" d="M30 236H330M30 236V248M330 236V248" stroke-width="2.4"/>` +
              xs.map((x) => K.tube(x, 72, 156, 30)).join(''),
            { dur: 0.6 }
          ),
          ...xs.flatMap((x, i) => [
            K.liq(0, {
              x: x - 15,
              w: 30,
              bottom: 228,
              h0: 0,
              h1: 52,
              fill: i === 3 ? CPALEGREEN : CCLEAR,
              clip: 'clan-' + i,
              dur: 0.8,
              par: i < 3,
            }),
            K.lab(0, [x, 256], names[i], { cls: 'big', par: true }),
          ]),
          // Step 1: CO3^2- bubbles
          K.drops(1, 66, 66, 174, 3, { par: true }),
          K.bubbles(1, [[60, 220, 178], [66, 222, 178], [72, 220, 178]], { dur: 1.4 }),
          K.lab(1, [66, 52], '+ dil. HCl', { cls: 'dimm', par: true }),
          K.lab(1, [66, 278], 'CO₂ bubbles', { cls: 'eq' }),
          // Step 2: SO4^2- + BaCl2 -> white BaSO4 ppt
          K.drops(2, 142, 66, 174, 3, { par: true }),
          K.show(2, `<rect x="127" y="192" width="30" height="36" fill="#FFFFFF" clip-path="url(#clan-1)"/>`, { dur: 0.9 }),
          K.lab(2, [142, 52], '+ HCl / Ba²⁺', { cls: 'dimm', par: true }),
          K.lab(2, [142, 278], 'BaSO₄ white', { cls: 'eq' }),
          // Step 3: Cl- + AgNO3 -> white curdy AgCl ppt
          K.drops(3, 218, 66, 174, 3, { par: true }),
          K.show(3, `<rect x="203" y="194" width="30" height="34" fill="#F0F4F8" clip-path="url(#clan-2)"/>`, { dur: 0.9 }),
          K.lab(3, [218, 52], '+ HNO₃ / Ag⁺', { cls: 'dimm', par: true }),
          K.lab(3, [218, 278], 'AgCl curdy', { cls: 'eq' }),
          // Step 4: NO3- Brown Ring at junction!
          K.liq(4, { x: 279, w: 30, bottom: 228, h0: 0, h1: 28, fill: 'rgba(220,232,240,.35)', clip: 'clan-3', dur: 1.0, par: true }),
          K.show(4, `<rect x="279" y="196" width="30" height="6" fill="#7A3E12" clip-path="url(#clan-3)"/>`, { dur: 0.9 }),
          K.lab(4, [294, 52], 'FeSO₄ + H₂SO₄', { cls: 'dimm', par: true }),
          K.lab(4, [294, 278], 'brown ring!', { cls: 'eq' }),
        ];
      },
    },

    /* ── 17. Rate of Reaction: Disappearing Cross (cat: 'p') ── */
    {
      id: 'c-rate-thio',
      subj: 'chem',
      cat: 'p',
      h: 300,
      name: 'Rate of reaction: disappearing cross (Na₂S₂O₃ + HCl)',
      blurb: 'Measure reaction rate (1/t) at 25 °C vs 45 °C via colloidal sulphur precipitation',
      tip: 'Rate is proportional to 1 ÷ time (s⁻¹). Raising temperature gives particles higher kinetic energy so a much greater fraction of collisions exceed activation energy Eₐ.',
      defs: `<clipPath id="clrt-f"><polygon points="${CLK.flaskPts(145, 168, 258, 10, 42, 24)}"/></clipPath>`,
      steps: () => [
        {
          say: 'Draw a bold black cross (✕) on a white paper card and stand a conical flask containing 50 cm³ of sodium thiosulphate solution, Na₂S₂O₃(aq), directly over the cross.',
        },
        {
          say: 'Record the temperature (25 °C). Quickly add 5 cm³ of dilute HCl, swirl once, and start the stopwatch immediately.',
        },
        {
          say: 'Fine pale-yellow sulphur precipitates throughout the liquid: Na₂S₂O₃(aq) + 2HCl(aq) → 2NaCl(aq) + H₂O(l) + SO₂(g) + S(s)↓.',
        },
        {
          say: 'Look vertically down through the mouth of the flask and stop the timer the exact moment the black cross is obscured by yellow sulphur: t = 48 s at 25 °C.',
        },
        {
          say: 'Repeat with fresh Na₂S₂O₃ warmed to 45 °C: the cross vanishes in just 14 s! Rate (1/t) rises from 0.021 s⁻¹ to 0.071 s⁻¹ because more collisions exceed Eₐ.',
        },
      ],
      scene: () => {
        const K = CLK;
        return [
          K.show(
            0,
            K.bench(270) +
              `<rect x="86" y="259" width="118" height="8" rx="1.5" fill="#F4F7F5"/>` +
              `<path d="M135 244l20 12M155 244l-20 12" stroke="#141C33" stroke-width="3.2" stroke-linecap="round"/>` +
              K.flask(145, 168, 258, 10, 42, 24),
            { dur: 0.6 }
          ),
          K.liq(0, { x: 100, w: 90, bottom: 257, h0: 0, h1: 34, fill: CCLEAR, clip: 'clrt-f', until: 2, dur: 1.0 }),
          K.lab(0, [145, 284], 'black cross (✕) under flask'),
          // Step 1: Add HCl + Stopwatch starts
          K.drops(1, 145, 140, 220, 4, { par: true }),
          K.show(
            1,
            `<circle class="cl-gl" cx="282" cy="120" r="32"/><path class="cl-ln" d="M282 88v-8M276 80h12"/><path class="cl-ln" d="M282 120V98" stroke="#FFC531" stroke-width="2"/>`,
            { dur: 0.5 }
          ),
          K.lab(1, [282, 166], 'stopwatch', { cls: 'dimm' }),
          K.lab(1, [145, 124], '+ 5 cm³ dil. HCl', { cls: 'eq', until: 2 }),
          // Step 2: Colloidal yellow sulphur clouding
          K.show(
            2,
            `<rect class="cl-lq" fill="rgba(246,226,98,.48)" clip-path="url(#clrt-f)" x="100" y="220" width="90" height="37"/>`,
            { until: 2, dur: 1.2 }
          ),
          K.lab(2, [68, 214], 'S(s) clouding', { anchor: 'end', to: [108, 232], cls: 'eq', until: 2 }),
          // Step 3: Opaque yellow sulphur hides the cross!
          K.show(
            3,
            `<rect class="cl-lq" fill="${CSULPHUR}" clip-path="url(#clrt-f)" x="100" y="220" width="90" height="37"/>`,
            { dur: 1.0 }
          ),
          K.lab(3, [68, 234], 'cross hidden!', { anchor: 'end', to: [108, 240], cls: 'eq' }),
          K.lab(3, [282, 122], '48 s', { cls: 'eq', until: 3 }),
          // Step 4: Comparison table 25 °C vs 45 °C
          K.lab(4, [282, 122], '14 s', { cls: 'eq' }),
          K.lab(4, [232, 200], '25 °C → t = 48 s (0.021 s⁻¹)', { anchor: 'start', cls: 'dimm' }),
          K.lab(4, [232, 220], '45 °C → t = 14 s (0.071 s⁻¹)', { anchor: 'start', cls: 'eq' }),
          K.lab(4, [232, 240], 'Higher T → faster rate!', { anchor: 'start', cls: 'big' }),
        ];
      },
    },

    /* ── 18. Calorimetry: Heat of Neutralisation (cat: 'p') ── */
    {
      id: 'c-calorim',
      subj: 'chem',
      cat: 'p',
      h: 300,
      name: 'Calorimetry: heat of neutralisation (ΔH_neut)',
      blurb: 'Measure ΔT in a lagged polystyrene calorimeter for HCl(aq) + NaOH(aq) → H₂O(l)',
      tip: 'Strong acid + strong alkali always gives ΔH_neut ≈ −57.3 kJ mol⁻¹ because the net reaction is simply H⁺(aq) + OH⁻(aq) → H₂O(l). Weak acids give a slightly less exothermic value because heat is absorbed ionising the weak acid.',
      steps: () => [
        {
          say: 'Stand a lagged polystyrene (Styrofoam) cup inside a glass beaker so trapped air insulates the reaction mixture against heat loss.',
        },
        {
          say: 'Measure 50 cm³ of 1.0 mol dm⁻³ HCl into the cup and record its steady initial temperature with a 0.1 °C thermometer: T₁ = 25.0 °C.',
        },
        {
          say: 'Quickly pour in 50 cm³ of 1.0 mol dm⁻³ NaOH (also at 25.0 °C), fit the insulated lid immediately, and stir gently.',
        },
        {
          say: 'Neutralisation is exothermic! Watch the thermometer thread rise to its maximum steady reading: T₂ = 31.8 °C, so ΔT = +6.8 °C.',
        },
        {
          say: 'Calculate ΔH_neut: total mass m = 100 g; q = mcΔT = 100 × 4.2 × 6.8 = 2,856 J = 2.856 kJ. For n = 0.050 mol H₂O formed, ΔH = −2.856 ÷ 0.050 = −57.1 kJ mol⁻¹.',
        },
      ],
      scene: () => {
        const K = CLK;
        return [
          K.show(
            0,
            K.bench(274) +
              K.beaker(88, 146, 116, 126) +
              `<polygon points="98,150 194,150 184,266 108,266" fill="rgba(240,245,242,.14)" stroke="#E9EFEC" stroke-width="1.8"/>`,
            { dur: 0.6 }
          ),
          K.lab(0, [78, 190], 'outer beaker', { anchor: 'end', to: [88, 190], cls: 'dimm' }),
          K.lab(0, [78, 224], 'polystyrene cup', { anchor: 'end', to: [102, 224] }),
          // Step 1: 50 cm3 HCl + thermometer at 25.0 C
          K.liq(1, { x: 106, w: 80, bottom: 264, h0: 0, h1: 38, fill: CWATER, until: 2, dur: 1.1 }),
          K.show(
            1,
            `<rect class="cl-gl" x="142" y="48" width="8" height="198" rx="4"/><circle cx="146" cy="248" r="6" fill="#FF5252"/><rect x="144.5" y="168" width="3" height="80" fill="#FF5252"/>`,
            { dur: 0.5 }
          ),
          K.lab(1, [206, 168], 'T₁ = 25.0 °C', { anchor: 'start', to: [152, 168], cls: 'eq', until: 2 }),
          // Step 2: Add 50 cm3 NaOH + lid
          K.drops(2, 166, 124, 210, 4, { par: true }),
          K.liq(2, { x: 104, w: 84, bottom: 264, h0: 38, h1: 74, fill: CWATER, dur: 1.5 }),
          K.show(2, `<rect x="92" y="142" width="108" height="7" rx="2" fill="#C9A66B"/>`, { dur: 0.4 }),
          K.lab(2, [212, 145], 'insulated lid', { anchor: 'start', to: [200, 145], cls: 'dimm' }),
          // Step 3: Mercury thread rises to 31.8 C!
          K.liq(3, { x: 144.5, w: 3, bottom: 248, h0: 80, h1: 138, fill: '#FF5252', dur: 1.6 }),
          K.lab(3, [206, 110], 'T₂ = 31.8 °C (ΔT = +6.8 °C)', { anchor: 'start', to: [152, 110], cls: 'eq' }),
          // Step 4: Calculation summary
          K.lab(4, [212, 196], 'q = 100 × 4.2 × 6.8 = 2.86 kJ', { anchor: 'start' }),
          K.lab(4, [212, 216], 'n(H₂O) = 0.050 mol', { anchor: 'start', cls: 'dimm' }),
          K.lab(4, [212, 238], 'ΔH = −57.1 kJ mol⁻¹', { anchor: 'start', cls: 'eq' }),
        ];
      },
    },

    /* ── 19. Organic Functional Group Tests (cat: 'o') ── */
    {
      id: 'c-org-unsat',
      subj: 'chem',
      cat: 'o',
      h: 300,
      name: 'Organic tests: unsaturation, alkanol oxidation & esterification',
      blurb: 'Bromine water decolourisation, acidified K₂Cr₂O₇ orange-to-green, and fruity ester scent',
      tip: 'Both alkenes (C=C) and alkynes (C≡C) decolourise reddish-brown bromine water and purple acidified KMnO₄, whereas saturated alkanes show no change in the dark.',
      defs: [84, 180, 276].map((x, i) => CLK.tubeClip('clorg-' + i, x, 72, 156, 32)).join(''),
      steps: () => [
        {
          say: 'Set up three organic test tubes: Tube 1 holds reddish-brown bromine water (Br₂(aq)); Tube 2 holds ethanol with orange acidified K₂Cr₂O₇; Tube 3 holds ethanol + ethanoic acid + 2 drops of conc. H₂SO₄.',
        },
        {
          say: 'Tube 1 (Test for unsaturation): bubble ethene gas (CH₂=CH₂) through bromine water. Addition across the C=C double bond rapidly decolourises the orange-brown Br₂ to colourless 1,2-dibromoethane!',
        },
        {
          say: 'Tube 2 (Primary/secondary alkanol test): warm ethanol gently with acidified K₂Cr₂O₇(aq). The solution turns from ORANGE (Cr₂O₇²⁻) to GREEN (Cr³⁺) as ethanol is oxidised!',
        },
        {
          say: 'Tube 3 (Esterification): warm ethanol + ethanoic acid + conc. H₂SO₄ catalyst in a water bath, then pour into aqueous Na₂CO₃ to neutralise excess acid.',
        },
        {
          say: 'A pleasant, sweet FRUITY smell of ethyl ethanoate (CH₃COOC₂H₅) floats as an immiscible top layer — confirming an alkanol or alkanoic acid!',
        },
      ],
      scene: () => {
        const K = CLK;
        const xs = [84, 180, 276];
        return [
          K.show(
            0,
            `<path class="cl-ln" d="M40 236H320M40 236V248M320 236V248" stroke-width="2.4"/>` +
              xs.map((x) => K.tube(x, 72, 156, 32)).join(''),
            { dur: 0.6 }
          ),
          K.liq(0, { x: 68, w: 32, bottom: 228, h0: 0, h1: 60, fill: CORANGE, clip: 'clorg-0', until: 0, dur: 0.8, par: true }),
          K.liq(0, { x: 164, w: 32, bottom: 228, h0: 0, h1: 60, fill: CORANGE, clip: 'clorg-1', until: 1, dur: 0.8, par: true }),
          K.liq(0, { x: 260, w: 32, bottom: 228, h0: 0, h1: 54, fill: CCLEAR, clip: 'clorg-2', dur: 0.8 }),
          K.lab(0, [84, 256], 'Br₂(aq)', { cls: 'big', par: true }),
          K.lab(0, [180, 256], 'C₂H₅OH + Cr₂O₇²⁻', { par: true }),
          K.lab(0, [276, 256], 'ROH + RCOOH', {}),
          // Step 1: Ethene bubbles decolourise Br2 water
          K.bubbles(1, [[80, 222, 174], [88, 222, 174]], { until: 1, dur: 1.2, par: true }),
          K.show(1, `<rect class="cl-lq" fill="${CCLEAR}" clip-path="url(#clorg-0)" x="68" y="168" width="32" height="60"/>`, { dur: 1.1 }),
          K.lab(1, [84, 52], '+ ethene (C=C)', { cls: 'dimm', par: true }),
          K.lab(1, [84, 278], 'decolourises!', { cls: 'eq' }),
          // Step 2: K2Cr2O7 turns orange -> green
          K.show(2, K.flame(180, 248, 16), { until: 2, dur: 0.4, par: true }),
          K.show(2, `<rect class="cl-lq" fill="${CGREEN}" clip-path="url(#clorg-1)" x="164" y="168" width="32" height="60"/>`, { dur: 1.1 }),
          K.lab(2, [180, 52], 'warm gently', { cls: 'dimm', par: true }),
          K.lab(2, [180, 278], 'orange → green', { cls: 'eq' }),
          // Step 3 & 4: Ester layer + fruity aroma
          K.drops(3, 276, 66, 170, 3, { par: true }),
          K.show(3, `<rect x="260" y="162" width="32" height="12" fill="rgba(255,216,77,.65)" clip-path="url(#clorg-2)"/>`, { dur: 0.9 }),
          K.lab(3, [276, 52], 'conc. H₂SO₄, Δ', { cls: 'dimm' }),
          {
            at: 4,
            dur: 1.0,
            f: () => `<path class="cl-steam" d="M270 152q-4-10 0-20M282 152q4-10 0-20"/>`,
          },
          K.lab(4, [276, 278], 'fruity ester!', { cls: 'eq' }),
        ];
      },
    },

    /* ── 20. Biochemical & Food Tests (cat: 'o') ── */
    {
      id: 'c-food-tests',
      subj: 'chem',
      cat: 'o',
      h: 300,
      name: 'Biochemical tests: Fehling’s, Tollens’, Iodine & Biuret',
      blurb: 'Identify reducing sugars, alkanals, starch and proteins by classic colour reactions',
      tip: 'Sucrose is a NON-reducing sugar (negative Fehling’s test until hydrolysed with dilute HCl and neutralised with NaOH). Alkanals give a positive Tollens’ silver mirror; alkanones do NOT.',
      defs: [66, 142, 218, 294].map((x, i) => CLK.tubeClip('clbio-' + i, x, 72, 156, 30)).join(''),
      steps: () => [
        {
          say: 'Prepare four tubes containing: (1) glucose (reducing sugar), (2) ethanal (alkanal), (3) aqueous starch suspension, and (4) egg albumen (protein solution).',
        },
        {
          say: 'Tube 1 (Fehling’s Test): add deep-blue Fehling’s solution A & B to glucose and boil. Cu²⁺ is reduced to a brick-red precipitate of copper(I) oxide, Cu₂O(s)!',
        },
        {
          say: 'Tube 2 (Tollens’ Silver Mirror Test): warm ethanal gently with ammoniacal silver trioxonitrate(V). Ag⁺ ions are reduced to metallic silver, coating the inside of the glass as a shiny silver mirror!',
        },
        {
          say: 'Tube 3 (Iodine Test for Starch): add two drops of brown iodine-in-KI solution to starch. An intense blue-black starch–iodine complex appears immediately (and disappears on heating, returning on cooling).',
        },
        {
          say: 'Tube 4 (Biuret Test for Proteins): add NaOH(aq) followed by two drops of dilute CuSO₄(aq) and shake. Peptide (−CONH−) bonds form a characteristic violet/purple colour!',
        },
      ],
      scene: () => {
        const K = CLK;
        const xs = [66, 142, 218, 294];
        const labels = ['Glucose', 'Ethanal', 'Starch', 'Protein'];
        return [
          K.show(
            0,
            `<path class="cl-ln" d="M30 236H330M30 236V248M330 236V248" stroke-width="2.4"/>` +
              xs.map((x) => K.tube(x, 72, 156, 30)).join(''),
            { dur: 0.6 }
          ),
          ...xs.flatMap((x, i) => [
            K.liq(0, { x: x - 15, w: 30, bottom: 228, h0: 0, h1: 54, fill: i === 0 ? 'rgba(45,125,245,.65)' : CCLEAR, clip: 'clbio-' + i, until: i === 0 ? 0 : undefined, dur: 0.8, par: i < 3 }),
            K.lab(0, [x, 256], labels[i], { cls: 'big', par: true }),
          ]),
          // Step 1: Fehling's brick-red Cu2O ppt
          K.show(1, K.flame(66, 248, 16), { until: 1, dur: 0.4, par: true }),
          K.show(1, `<rect x="51" y="174" width="30" height="54" fill="#D9482B" clip-path="url(#clbio-0)"/>`, { dur: 1.0 }),
          K.lab(1, [66, 52], 'Fehling’s + Δ', { cls: 'dimm', par: true }),
          K.lab(1, [66, 278], 'brick-red Cu₂O', { cls: 'eq' }),
          // Step 2: Tollens' silver mirror
          K.show(
            2,
            `<rect x="127" y="174" width="30" height="54" fill="url(#lbMetal)" clip-path="url(#clbio-1)"/>`,
            { dur: 1.0 }
          ),
          K.lab(2, [142, 52], 'Tollens’ + Δ', { cls: 'dimm', par: true }),
          K.lab(2, [142, 278], 'silver mirror', { cls: 'eq' }),
          // Step 3: Starch + I2 -> deep blue-black
          K.drops(3, 218, 66, 170, 2, { fill: '#B86B1B', par: true }),
          K.show(3, `<rect x="203" y="174" width="30" height="54" fill="#1A265A" clip-path="url(#clbio-2)"/>`, { dur: 0.9 }),
          K.lab(3, [218, 52], '+ I₂(aq)', { cls: 'dimm', par: true }),
          K.lab(3, [218, 278], 'blue-black', { cls: 'eq' }),
          // Step 4: Biuret protein -> violet/purple
          K.drops(4, 294, 66, 170, 2, { fill: '#5BA8FF', par: true }),
          K.show(4, `<rect x="279" y="174" width="30" height="54" fill="#8B46D6" clip-path="url(#clbio-3)"/>`, { dur: 0.9 }),
          K.lab(4, [294, 52], 'Biuret test', { cls: 'dimm', par: true }),
          K.lab(4, [294, 278], 'violet/purple', { cls: 'eq' }),
        ];
      },
    },
  ];
}

export const EXTRA_CLAB_ICONS: Record<string, string> = {
  'c-stdsol':
    '<path d="M10 3h4M11 3v5l-5 8.5A3.5 3.5 0 0 0 9 21h6a3.5 3.5 0 0 0 3-4.5L13 8V3"/><path class="ia" d="M9.5 6.5h5"/>',
  'c-redox-tit':
    '<path d="M10.5 2v8l-1.5 2M13.5 2v8l1.5 2M8.5 16L6 21h12l-2.5-5"/><circle class="ia" cx="12" cy="14" r="1.4"/>',
  'c-distill':
    '<circle cx="7.5" cy="16.5" r="4.5"/><path d="M7.5 12V6M7.5 8.5l10 5.5M17.5 14v5M15 21h5"/><path class="ia" d="M11 10.5l4 2.2"/>',
  'c-sublim':
    '<path d="M5 18h14l-5.5-9V4h-3v5z"/><path class="ia" d="M8 21h8M12 14v2"/>',
  'c-hydrogen':
    '<path d="M9 4h6v11a3 3 0 0 1-6 0z"/><path class="ia" d="M12 8v4M10 10h4"/>',
  'c-co2':
    '<path d="M6 4v13a3 3 0 0 0 6 0V4M14 9h5v11h-5z"/><circle class="ia" cx="9" cy="14" r="1.2"/><circle class="ia" cx="16.5" cy="16" r="1.2"/>',
  'c-ammonia':
    '<path d="M4 16l8-4v-2l-8 4zM14 7h6v13h-6z"/><path class="ia" d="M17 11v5"/>',
  'c-cations-nh3':
    '<path d="M4 4v13a2.5 2.5 0 0 0 5 0V4M15 4v13a2.5 2.5 0 0 0 5 0V4"/><path class="ia" d="M4.5 12h4M15.5 14h4"/>',
  'c-anions':
    '<path d="M8 3v15a4 4 0 0 0 8 0V3M6 3h12"/><path class="ia" d="M8.5 13.5h7"/>',
  'c-rate-thio':
    '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9.5 2.5h5"/><path class="ia" d="M9 13l6 0"/>',
  'c-calorim':
    '<path d="M6 9h12l-1.2 11H7.2z"/><path class="ia" d="M12 3v13"/><circle class="ia" cx="12" cy="16.5" r="1.6"/>',
  'c-org-unsat':
    '<polygon points="12 3 19 7 19 15 12 19 5 15 5 7"/><path class="ia" d="M9 9.5l6 3.5"/>',
  'c-food-tests':
    '<path d="M7 3v14a3 3 0 0 0 6 0V3M16 8v10a2 2 0 0 0 4 0V8"/><path class="ia" d="M7.5 13h5"/>',
};
