import type { LabItem } from '../types';

export const PLAB_CATS: Record<string, string> = {
  mech: 'Mechanics & Equilibrium',
  heat: 'Heat & Calorimetry',
  opt: 'Optics: Mirrors, Lenses & Prisms',
  elec: 'Electricity & Potentiometer',
  wave: 'Waves & Resonance',
};

export const PLAB_IC: Record<string, string> = {
  'p-vernier': '<rect x="3" y="7" width="18" height="4" rx="1"/><path d="M5 11v6M9 11v4M14 7V4h4v13M14 15h4"/>',
  'p-pendulum': '<path d="M6 4h12M12 4l4 13"/><circle class="ia" cx="16" cy="18.5" r="2.5"/><path d="M8 18.5a9 9 0 0 0 8 0" stroke-dasharray="2 2"/>',
  'p-hooke': '<path d="M7 3h10M12 3v2l-2.5 1.5 5 2-5 2 5 2-2.5 1.5v2"/><rect class="ia" x="9.5" y="16" width="5" height="5" rx="1"/>',
  'p-moments': '<path d="M3 13h18"/><polygon class="ia" points="12,13 9,19 15,19"/><rect x="5" y="9" width="3.5" height="4"/><rect x="16" y="10" width="3" height="3"/>',
  'p-friction': '<path d="M3 18h18"/><rect x="7" y="12" width="7" height="6" rx="1"/><path class="ia" d="M14 15h6m-2-2l2 2-2 2"/>',
  'p-archimedes': '<path d="M6 9v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9"/><path class="ia" d="M6 14h12"/><rect x="10" y="11" width="4" height="5" rx=".8"/><path d="M12 3v8"/>',
  'p-cooling': '<path d="M4 4v16h16"/><path class="ia" d="M6 6c2 5 4 6 7 6h3c2 0 3 2 4 5"/>',
  'p-calorimeter': '<rect x="6" y="8" width="12" height="12" rx="1.5"/><path class="ia" d="M10 3v12M15 5v9"/><path d="M6 12h12"/>',
  'p-glassblock': '<rect x="5" y="8" width="14" height="8" rx="1"/><path class="ia" d="M4 4l6 4 4 8 6 4"/>',
  'p-prism': '<polygon points="12,4 4,19 20,19"/><path class="ia" d="M3 14l6-3 6 1 6 4"/>',
  'p-lens-uv': '<ellipse cx="12" cy="12" rx="2.4" ry="8"/><path class="ia" d="M3 12h18M5 8v4M19 12v4"/>',
  'p-concave': '<path d="M17 4a11 11 0 0 1 0 16"/><path class="ia" d="M4 9h14l-9 6M4 12h15"/>',
  'p-ohm': '<rect x="8" y="9" width="8" height="6" rx="1"/><circle class="ia" cx="12" cy="5" r="2.2"/><path d="M4 12h4M16 12h4M8 12V5h1.8M16 12V5h-1.8"/>',
  'p-metrebridge': '<path d="M3 16h18"/><polygon points="5,16 12,7 19,16"/><circle class="ia" cx="12" cy="12.5" r="2"/>',
  'p-potentiometer': '<path d="M3 15h18M6 8h5M13 8h5"/><path class="ia" d="M6 8v7M15 8l-3 7"/>',
  'p-resonance': '<path d="M9 5v14M15 5v14M7 19h10"/><path class="ia" d="M9 13h6M8 3c2 1.5 6 1.5 8 0"/>',
};

export const PHYS_LAB_FOR_TOPIC: Record<string, string> = {
  'p-units': 'p-vernier',
  'p-motion': 'p-pendulum',
  'p-vectors': 'p-moments',
  'p-newton': 'p-friction',
  'p-work': 'p-hooke',
  'p-fluids': 'p-archimedes',
  'p-elastic': 'p-hooke',
  'p-expansion': 'p-cooling',
  'p-heat-trans': 'p-cooling',
  'p-electrostatics': 'p-ohm',
  'p-dc-circuits': 'p-ohm',
  'p-projectiles': 'p-pendulum',
  'p-equilibrium': 'p-moments',
  'p-shm': 'p-pendulum',
  'p-machines': 'p-friction',
  'p-calorimetry': 'p-calorimeter',
  'p-gas-laws': 'p-cooling',
  'p-waves': 'p-resonance',
  'p-sound': 'p-resonance',
  'p-reflection': 'p-concave',
  'p-refraction': 'p-glassblock',
  'p-lenses': 'p-lens-uv',
  'p-gravitation': 'p-pendulum',
  'p-efield-cap': 'p-ohm',
  'p-elec-meas': 'p-potentiometer',
  'p-electrolysis-cell': 'p-metrebridge',
  'p-magnetism': 'p-metrebridge',
  'p-induction': 'p-ohm',
  'p-ac-circuits': 'p-potentiometer',
  'p-atomic-quantum': 'p-prism',
  'p-nuclear': 'p-cooling',
  'p-electronics': 'p-ohm',
};

const CWATER = 'rgba(140,203,255,.34)';
const CBRASS = '#E5B84B';
const CSTEEL = '#B8C9D9';
const CRAY = '#FFD166';

export function buildPhysLabs(CLK: any): LabItem[] {
  const K = CLK;
  const ruleScale = (x0: number, y: number, w: number, n = 10) => {
    let s = `<rect class="cl-ln" x="${x0}" y="${y}" width="${w}" height="14" rx="1.5" fill="rgba(229,184,75,.14)"/>`;
    for (let i = 0; i <= n; i++) {
      const x = x0 + (i * w) / n;
      s += `<path class="cl-thin" d="M${x.toFixed(1)} ${y}v${i % 5 === 0 ? 8 : 4.5}"/>`;
    }
    return s;
  };

  return [
    /* 1. Vernier Callipers & Micrometer */
    {
      id: 'p-vernier',
      subj: 'phys',
      cat: 'mech',
      h: 280,
      name: 'Vernier callipers & micrometer reading',
      blurb: 'Read main scale, Vernier coincidence, and zero-error correction to 0.01 cm and 0.01 mm',
      tip: 'Always close the jaws gently first to check for zero error. Subtract a positive zero error from your observed reading.',
      steps: () => [
        { say: 'Close the jaws of the Vernier callipers gently without forcing them. Confirm the main-scale zero and Vernier zero coincide (zero error = 0.00 cm).' },
        { say: 'Grip the brass cylinder gently between the external jaws and lock the clamp screw at eye level to avoid parallax.' },
        { say: 'Read the main scale mark immediately before the Vernier zero: 2.40 cm.' },
        { say: 'Identify the 6th Vernier mark coinciding directly with a main-scale division: 6 × 0.01 cm = 0.06 cm. Diameter d = 2.40 + 0.06 = 2.46 cm.' },
      ],
      scene: () => [
        K.show(0, ruleScale(44, 108, 272, 20) + `<path class="cl-ln" d="M44 108V168l16-14V122" fill="rgba(184,201,217,.2)"/>`, { dur: 0.5 }),
        K.lab(0, [180, 92], 'Main scale (0.1 cm divisions)', { cls: 'dimm' }),
        K.move(1, `<circle cx="96" cy="145" r="26" fill="${CBRASS}" fill-opacity=".65" stroke="#F6D57A" stroke-width="1.6"/>`, [0, 44], { dur: 0.7 }),
        K.move(1, `<path class="cl-ln" d="M122 108V168l-14-14V122" fill="rgba(184,201,217,.22)"/><rect class="cl-ln" x="122" y="122" width="84" height="13" fill="rgba(90,169,255,.18)"/>`, [54, 0], { dur: 0.9 }),
        K.lab(1, [96, 186], 'brass cylinder', { cls: 'dimm' }),
        K.lab(2, [122, 70], 'Main scale = 2.40 cm', { to: [122, 106], cls: 'bold' }),
        K.show(3, `<circle cx="158" cy="122" r="5" fill="none" stroke="#4ADE80" stroke-width="1.8"/>`, { dur: 0.4 }),
        K.lab(3, [215, 162], '6th mark coincides → +0.06 cm', { anchor: 'middle', cls: 'dimm' }),
        K.lab(3, [180, 224], 'Corrected diameter d = 2.46 cm', { cls: 'eq' }),
      ],
    },

    /* 2. Simple Pendulum */
    {
      id: 'p-pendulum',
      subj: 'phys',
      cat: 'mech',
      h: 290,
      name: 'Simple pendulum — finding g',
      blurb: 'Time 20 small oscillations for lengths L and determine g = 4π² / slope from T² against L',
      tip: 'Measure length L from the point of suspension inside the split cork to the centre of gravity of the bob, and keep angular amplitude below 10°.',
      steps: () => [
        { say: 'Clamp the thread firmly between two halves of a split cork in a retort stand. Measure L = 80.0 cm from the bottom of the cork to the centre of the bob.' },
        { say: 'Place a vertical reference pointer at the equilibrium position. Displace the bob through a small angle (< 10°) and release smoothly.' },
        { say: 'Time N = 20 complete oscillations with a stopwatch: t = 35.9 s, giving period T = t ÷ 20 = 1.795 s and T² = 3.22 s².' },
        { say: 'Repeat for five lengths L (40–100 cm) and plot T² against L. Slope S = 4.02 s² m⁻¹, so g = 4π² ÷ S = 9.82 m s⁻².' },
      ],
      scene: () => [
        K.show(0, K.stand(62, 22, 266, 34, 152) + `<rect class="cl-ln" x="144" y="28" width="16" height="12" fill="rgba(229,184,75,.35)"/>`, { dur: 0.5 }),
        K.show(0, `<line class="cl-ln" x1="152" y1="40" x2="152" y2="196"/><circle cx="152" cy="206" r="10" fill="${CBRASS}"/>`, { until: 0, dur: 0.5 }),
        K.lab(0, [98, 122], 'L = 0.80 m', { cls: 'bold' }),
        K.show(1, `<line class="cl-thin" x1="152" y1="40" x2="152" y2="232" stroke-dasharray="3 3"/><line class="cl-ln" x1="152" y1="40" x2="196" y2="198"/><circle cx="199" cy="207" r="10" fill="${CBRASS}"/>`, { dur: 0.7 }),
        K.show(1, `<path class="cl-ld" d="M120 207Q152 222 198 207" stroke-dasharray="3 2"/>`, { par: true }),
        K.lab(1, [208, 134], 'θ < 10°', { anchor: 'start', cls: 'dimm' }),
        K.lab(2, [252, 68], '20 oscillations = 35.9 s', { anchor: 'middle', cls: 'bold' }),
        K.lab(2, [252, 90], 'T = 1.80 s · T² = 3.22 s²', { anchor: 'middle', cls: 'eq' }),
        K.show(3, `<path class="cl-ln" d="M214 248V154M214 248H332"/><line x1="214" y1="248" x2="322" y2="162" stroke="#4ADE80" stroke-width="2.2"/>`, { dur: 0.7 }),
        K.lab(3, [274, 266], 'T² vs L → g = 9.82 m s⁻²', { cls: 'eq' }),
      ],
    },

    /* 3. Hooke's Law */
    {
      id: 'p-hooke',
      subj: 'phys',
      cat: 'mech',
      h: 290,
      name: 'Hooke’s law & spiral spring constant',
      blurb: 'Measure extension e = l − l₀ against load F and find spring constant k from the slope',
      tip: 'Take readings while loading and again while unloading to verify that the elastic limit has not been exceeded.',
      steps: () => [
        { say: 'Suspend the spiral spring and pointer beside a clamped vertical metre rule. Record the unloaded pointer reading l₀ = 15.2 cm.' },
        { say: 'Hang slotted masses in steps of m = 50 g (F = mg = 0.50 N) and wait for oscillations to stop before reading at eye level.' },
        { say: 'For m = 200 g (F = 2.0 N), pointer reads l = 23.2 cm, giving extension e = l − l₀ = 8.0 cm = 0.080 m.' },
        { say: 'Plot F against e: straight line through the origin confirms Hooke’s law, with k = F ÷ e = 2.0 ÷ 0.080 = 25 N m⁻¹.' },
      ],
      scene: () => [
        K.show(0, K.stand(58, 18, 268, 30, 128) + ruleScale(164, 42, 14, 16).replace('width="14" height="14"', 'width="14" height="196"'), { dur: 0.5 }),
        K.show(0, `<path class="cl-ln" d="M128 30v14l-9 7 18 10-18 10 18 10-18 10 9 7v14M128 112h34"/>`, { until: 1, dur: 0.6 }),
        K.lab(0, [92, 112], 'l₀ = 15.2 cm', { anchor: 'end', cls: 'dimm' }),
        K.show(2, `<path class="cl-ln" d="M128 30v16l-9 11 18 16-18 16 18 16-18 16 9 11v18M128 150h34"/><rect x="114" y="150" width="28" height="30" rx="2" fill="${CBRASS}"/>`, { dur: 0.8 }),
        K.lab(2, [92, 152], 'l = 23.2 cm', { anchor: 'end', cls: 'bold' }),
        K.lab(2, [128, 198], '2.0 N load', { cls: 'dimm' }),
        K.show(3, `<path class="cl-ln" d="M214 238V132M214 238H332"/><line x1="214" y1="238" x2="320" y2="144" stroke="${CRAY}" stroke-width="2.2"/>`, { dur: 0.7 }),
        K.lab(3, [272, 258], 'k = F / e = 25 N m⁻¹', { cls: 'eq' }),
      ],
    },

    /* 4. Principle of Moments */
    {
      id: 'p-moments',
      subj: 'phys',
      cat: 'mech',
      h: 270,
      name: 'Principle of moments — mass of a metre rule',
      blurb: 'Balance a uniform metre rule off-centre with a known mass to determine the rule’s own weight',
      tip: 'First balance the bare metre rule on the knife-edge to locate its exact centre of gravity G (often 49.8–50.2 cm, not always 50.0 cm).',
      steps: () => [
        { say: 'Balance the bare metre rule horizontally on a knife-edge pivot to find its centre of gravity G at the 50.0 cm mark.' },
        { say: 'Shift the knife-edge to the 35.0 cm mark and hang a known mass M = 100 g from a thread loop on the shorter arm.' },
        { say: 'Slide the 100 g mass until the rule balances horizontally at the 20.0 cm mark (arm d₁ = 35.0 − 20.0 = 15.0 cm).' },
        { say: 'Equate moments about the pivot: 100 × 15.0 = m_rule × (50.0 − 35.0) → 1500 = 15.0 m_rule → m_rule = 100 g.' },
      ],
      scene: () => [
        K.show(0, ruleScale(36, 128, 288, 10) + `<polygon points="180,142 168,176 192,176" fill="${CSTEEL}"/>`, { until: 0, dur: 0.5 }),
        K.lab(0, [180, 194], 'G at 50.0 cm', { cls: 'dimm', until: 0 }),
        K.show(1, ruleScale(36, 128, 288, 10) + `<polygon points="136.8,142 124.8,176 148.8,176" fill="${CSTEEL}"/>`, { dur: 0.5 }),
        K.lab(1, [136.8, 192], 'Pivot at 35.0 cm', { cls: 'dimm' }),
        K.move(2, `<line class="cl-ln" x1="93.6" y1="142" x2="93.6" y2="178"/><rect x="81.6" y="178" width="24" height="24" rx="2" fill="${CBRASS}"/>`, [20, 0], { dur: 0.7 }),
        K.lab(2, [93.6, 216], '100 g at 20 cm', { cls: 'bold' }),
        K.show(2, `<path class="cl-ld" d="M180 142v36" marker-end="url(#cl-arr)"/>`, { par: true }),
        K.lab(2, [212, 182], 'W_rule at 50 cm', { anchor: 'start', cls: 'dimm' }),
        K.lab(3, [180, 74], '100 × 15.0 = m_rule × 15.0', { cls: 'bold' }),
        K.lab(3, [180, 98], 'Mass of metre rule = 100 g', { cls: 'eq' }),
      ],
    },

    /* 5. Limiting Friction */
    {
      id: 'p-friction',
      subj: 'phys',
      cat: 'mech',
      h: 270,
      name: 'Static friction & coefficient μ',
      blurb: 'Determine μ = F_lim / R on a horizontal board using a pulley and scale pan',
      tip: 'Tap the wooden board lightly after adding each small slotted weight so the block starts with uniform motion free of surface sticking.',
      steps: () => [
        { say: 'Weigh the wooden block (W₀ = 2.0 N) and place it on a clean horizontal wooden track linked over a frictionless pulley to a scale pan.' },
        { say: 'Add weights to the scale pan until the block is just on the point of sliding when the board is tapped lightly: F_lim = 0.80 N.' },
        { say: 'Stack standard loads W on top of the block (total normal reaction R = 2.0, 4.0, 6.0, 8.0 N) and record each limiting pull F_lim.' },
        { say: 'Plot F_lim against normal reaction R: slope gives the coefficient of static friction μ = 0.80 ÷ 2.0 = 0.40 (dimensionless).' },
      ],
      scene: () => [
        K.show(0, `<path class="cl-ln" d="M28 158H278V220"/><circle class="cl-ln" cx="286" cy="150" r="10"/><rect x="96" y="126" width="64" height="32" rx="2" fill="rgba(229,184,75,.32)" stroke="#E5B84B"/>`, { dur: 0.5 }),
        K.show(0, `<path class="cl-ln" d="M160 142H286M296 150v52"/><rect x="284" y="202" width="24" height="8" fill="${CBRASS}"/>`, { dur: 0.5 }),
        K.lab(0, [128, 110], 'R = W = 2.0 N', { cls: 'dimm' }),
        K.lab(1, [296, 224], 'F_lim = 0.80 N', { cls: 'bold' }),
        K.show(2, `<rect x="108" y="108" width="40" height="18" rx="1.5" fill="${CSTEEL}"/>`, { dur: 0.5 }),
        K.lab(2, [128, 94], 'Added load +2.0 N', { cls: 'dimm' }),
        K.lab(3, [156, 56], 'Slope of F_lim vs R → μ = 0.40', { cls: 'eq' }),
      ],
    },

    /* 6. Archimedes' Principle */
    {
      id: 'p-archimedes',
      subj: 'phys',
      cat: 'mech',
      h: 290,
      name: 'Archimedes’ principle & relative density',
      blurb: 'Weigh a solid in air, water, and kerosene to find RD of solid and liquid by upthrust',
      tip: 'Ensure the suspended sinker is completely submerged without touching the sides or bottom of the beaker, and brush off clinging air bubbles.',
      steps: () => [
        { say: 'Hang the brass solid from a spring balance in air and record its true weight W₁ = 2.70 N.' },
        { say: 'Submerge the solid completely in pure water without touching the beaker walls. Record apparent weight W₂ = 2.40 N (upthrust in water U_w = 0.30 N).' },
        { say: 'Dry the solid and submerge it completely in kerosene. Record apparent weight W₃ = 2.46 N (upthrust in liquid U_L = 0.24 N).' },
        { say: 'Calculate RD of solid = W₁ ÷ (W₁ − W₂) = 2.70 ÷ 0.30 = 9.0, and RD of kerosene = U_L ÷ U_w = 0.24 ÷ 0.30 = 0.80.' },
      ],
      scene: () => [
        K.show(0, `<rect class="cl-ln" x="158" y="22" width="24" height="68" rx="3"/><line class="cl-ln" x1="170" y1="90" x2="170" y2="148"/><rect x="156" y="148" width="28" height="32" rx="2" fill="${CBRASS}"/>`, { until: 0, dur: 0.5 }),
        K.lab(0, [242, 62], 'In air: W₁ = 2.70 N', { cls: 'bold', until: 0 }),
        K.show(1, `<rect class="cl-ln" x="158" y="22" width="24" height="68" rx="3"/><line class="cl-ln" x1="170" y1="90" x2="170" y2="176"/>` + K.beaker(126, 148, 88, 96), { dur: 0.5 }),
        K.liq(1, { x: 128, w: 84, bottom: 242, h0: 70, h1: 70, fill: CWATER, until: 1, dur: 0.4 }),
        K.show(1, `<rect x="156" y="182" width="28" height="32" rx="2" fill="${CBRASS}"/>`, { dur: 0.4 }),
        K.lab(1, [266, 176], 'In water: W₂ = 2.40 N', { cls: 'bold', until: 1 }),
        K.liq(2, { x: 128, w: 84, bottom: 242, h0: 70, h1: 70, fill: 'rgba(255,209,102,.28)', dur: 0.4 }),
        K.lab(2, [266, 176], 'In kerosene: W₃ = 2.46 N', { cls: 'bold' }),
        K.lab(3, [180, 266], 'RD(solid) = 9.0 · RD(kerosene) = 0.80', { cls: 'eq' }),
      ],
    },

    /* 7. Cooling Curve of Naphthalene */
    {
      id: 'p-cooling',
      subj: 'phys',
      cat: 'heat',
      h: 290,
      name: 'Cooling curve & melting point of naphthalene',
      blurb: 'Plot temperature against time as molten naphthalene solidifies along an isothermal plateau at 80 °C',
      tip: 'Heat naphthalene in a water bath rather than directly over a naked Bunsen flame, and stir gently until freezing begins.',
      steps: () => [
        { say: 'Melt powdered naphthalene in a boiling tube immersed in a hot water bath until its temperature reaches 92 °C.' },
        { say: 'Lift the boiling tube out of the bath into a draught-free clamp stand and record temperature θ every 30 seconds.' },
        { say: 'Observe the flat horizontal plateau at θ = 80.0 °C for several minutes while latent heat of fusion is released during solidification.' },
        { say: 'Once completely solid, temperature falls steadily again toward room temperature. Melting/freezing point = 80.0 °C.' },
      ],
      scene: () => [
        K.show(0, K.stand(52, 24, 264, 72, 114) + K.tube(114, 58, 128, 26) + `<rect x="112" y="30" width="4" height="142" fill="#F87171"/>`, { dur: 0.5 }),
        K.liq(0, { x: 102, w: 24, bottom: 184, h0: 54, h1: 54, fill: 'rgba(248,250,252,.55)', dur: 0.4 }),
        K.lab(0, [114, 210], 'Molten at 92 °C', { cls: 'dimm', until: 1 }),
        K.show(1, `<path class="cl-ln" d="M188 232V68M188 232H338"/>`, { dur: 0.5 }),
        K.show(2, `<path d="M196 84Q216 132 232 138H288" fill="none" stroke="${CRAY}" stroke-width="2.5"/>`, { dur: 0.9 }),
        K.lab(2, [260, 122], 'Plateau 80.0 °C (L_f released)', { cls: 'bold' }),
        K.show(3, `<path d="M288 138Q308 176 330 206" fill="none" stroke="${CRAY}" stroke-width="2.5"/>`, { dur: 0.7 }),
        K.lab(3, [262, 256], 'Freezing point = 80.0 °C', { cls: 'eq' }),
      ],
    },

    /* 8. Calorimeter — Method of Mixtures */
    {
      id: 'p-calorimeter',
      subj: 'phys',
      cat: 'heat',
      h: 290,
      name: 'Specific heat capacity by method of mixtures',
      blurb: 'Transfer hot brass at 100 °C into a lagged copper calorimeter to determine c_s',
      tip: 'Lag the calorimeter inside an outer jacket with cotton wool and transfer the hot solid rapidly so minimal heat escapes to the air.',
      steps: () => [
        { say: 'Weigh the dry copper calorimeter + stirrer (m_c = 60 g) and half-fill with cold water (m_w = 100 g) at initial temperature θ₁ = 25.0 °C.' },
        { say: 'Heat a weighed brass block (m_s = 100 g) in boiling water for 10 minutes so its initial temperature is θ₂ = 100.0 °C.' },
        { say: 'Transfer the brass block swiftly into the lagged calorimeter, cover with the lid, stir gently, and record highest steady temperature θ₃ = 31.2 °C.' },
        { say: 'Equate heat lost by brass to heat gained by water + calorimeter: m_s c_s (100 − 31.2) = (m_w c_w + m_c c_c)(31.2 − 25.0) → c_s ≈ 398 J kg⁻¹ K⁻¹.' },
      ],
      scene: () => [
        K.show(0, `<rect class="cl-ln" x="112" y="118" width="124" height="128" rx="4" stroke-dasharray="4 2"/><rect class="cl-ln" x="128" y="132" width="92" height="104" rx="2" fill="rgba(229,184,75,.14)"/>`, { dur: 0.5 }),
        K.liq(0, { x: 130, w: 88, bottom: 234, h0: 66, h1: 66, fill: CWATER, dur: 0.5 }),
        K.lab(0, [174, 258], 'Lagged calorimeter (θ₁ = 25.0 °C)', { cls: 'dimm', until: 1 }),
        K.move(2, `<rect x="158" y="196" width="32" height="32" rx="2" fill="${CBRASS}"/>`, [0, -110], { dur: 0.8 }),
        K.show(2, `<rect class="cl-ln" x="170" y="76" width="4" height="138" fill="#F87171"/>`, { dur: 0.4 }),
        K.lab(2, [278, 152], 'Final θ₃ = 31.2 °C', { cls: 'bold' }),
        K.lab(3, [180, 48], 'Heat lost = Heat gained', { cls: 'dimm' }),
        K.lab(3, [180, 68], 'c_brass = 398 J kg⁻¹ K⁻¹', { cls: 'eq' }),
      ],
    },

    /* 9. Rectangular Glass Block */
    {
      id: 'p-glassblock',
      subj: 'phys',
      cat: 'opt',
      h: 280,
      name: 'Refraction through a rectangular glass block',
      blurb: 'Trace optical pins to verify Snell’s law n = sin i / sin r and measure lateral displacement',
      tip: 'Space your two object pins and two search pins at least 5 cm apart and align the bases (feet) of the pins, never the heads.',
      steps: () => [
        { say: 'Place the rectangular glass block on white paper on a soft board, trace its outline ABCD, and draw normal NN′ at point O.' },
        { say: 'Draw an incident ray at i = 45° and stick two vertical optical pins P₁ and P₂ at least 5 cm apart along the ray.' },
        { say: 'View through face CD and place search pins P₃ and P₄ until the feet of all four pins appear strictly collinear.' },
        { say: 'Join the emergent ray and refracted ray OO′: measure r = 28°. Refractive index n = sin 45° ÷ sin 28° = 0.707 ÷ 0.469 = 1.51.' },
      ],
      scene: () => [
        K.show(0, `<rect x="86" y="102" width="188" height="84" fill="rgba(140,203,255,.18)" stroke="#93C5FD" stroke-width="1.8"/><line class="cl-thin" x1="150" y1="68" x2="150" y2="146" stroke-dasharray="3 3"/>`, { dur: 0.5 }),
        K.show(1, `<line x1="94" y1="46" x2="150" y2="102" stroke="${CRAY}" stroke-width="2.2"/><circle cx="108" cy="60" r="3" fill="#F87171"/><circle cx="128" cy="80" r="3" fill="#F87171"/>`, { dur: 0.6 }),
        K.lab(1, [82, 64], 'P₁, P₂ (i = 45°)', { anchor: 'end', cls: 'dimm' }),
        K.show(2, `<line x1="150" y1="102" x2="194" y2="186" stroke="${CRAY}" stroke-width="2.2"/><line x1="194" y1="186" x2="250" y2="242" stroke="${CRAY}" stroke-width="2.2"/><circle cx="214" cy="206" r="3" fill="#4ADE80"/><circle cx="236" cy="228" r="3" fill="#4ADE80"/>`, { dur: 0.8 }),
        K.lab(2, [264, 218], 'P₃, P₄ collinear', { anchor: 'start', cls: 'dimm' }),
        K.lab(3, [180, 26], 'r = 28° → n = sin 45° / sin 28° = 1.51', { cls: 'eq' }),
      ],
    },

    /* 10. Triangular Glass Prism */
    {
      id: 'p-prism',
      subj: 'phys',
      cat: 'opt',
      h: 280,
      name: 'Minimum deviation through a 60° glass prism',
      blurb: 'Measure angle of deviation D for angles of incidence i and find D_min from the U-curve',
      tip: 'At minimum deviation D_min, the ray passes symmetrically inside the prism parallel to its base and i = e.',
      steps: () => [
        { say: 'Trace the equilateral triangular glass prism (refracting angle A = 60°) on drawing paper and construct normals on face AB.' },
        { say: 'Direct incident rays at i = 35°, 40°, 45°, 50°, 55°, 60° using two object pins and locate emergent rays on face AC with search pins.' },
        { say: 'Produce incident and emergent rays to meet and measure each deviation angle D; observe D decrease to a minimum and rise again.' },
        { say: 'Read D_min = 38° from the U-shaped D–i curve: n = sin((60° + 38°)÷2) ÷ sin(60°÷2) = sin 49° ÷ sin 30° = 1.51.' },
      ],
      scene: () => [
        K.show(0, `<polygon points="150,62 82,186 218,186" fill="rgba(140,203,255,.18)" stroke="#93C5FD" stroke-width="1.8"/>`, { dur: 0.5 }),
        K.lab(0, [150, 88], 'A = 60°', { cls: 'dimm' }),
        K.show(1, `<polyline points="42,158 114,128 186,128 258,158" fill="none" stroke="${CRAY}" stroke-width="2.4"/>`, { dur: 0.8 }),
        K.show(2, `<line class="cl-thin" x1="114" y1="128" x2="188" y2="97" stroke-dasharray="3 3"/><line class="cl-thin" x1="186" y1="128" x2="138" y2="108" stroke-dasharray="3 3"/>`, { dur: 0.5 }),
        K.lab(2, [150, 42], 'Symmetric path → D_min = 38°', { cls: 'bold' }),
        K.show(3, `<path class="cl-ln" d="M248 232V156M248 232H340"/><path d="M258 168Q292 224 330 172" fill="none" stroke="#4ADE80" stroke-width="2"/>`, { dur: 0.6 }),
        K.lab(3, [180, 256], 'n = sin 49° / sin 30° = 1.51', { cls: 'eq' }),
      ],
    },

    /* 11. Converging Lens Focal Length */
    {
      id: 'p-lens-uv',
      subj: 'phys',
      cat: 'opt',
      h: 280,
      name: 'Focal length of a converging lens (u–v method)',
      blurb: 'Focus sharp illuminated cross-wires on a screen and use 1/f = 1/u + 1/v',
      tip: 'First obtain a quick rough focal length f_rough using a distant window so you avoid setting u < f where no real image can form on the screen.',
      steps: () => [
        { say: 'Focus a distant window onto a white screen to estimate rough focal length f ≈ 15 cm, then mount the lens on an optical bench.' },
        { say: 'Set illuminated cross-wires at object distance u = 30.0 cm in front of the lens.' },
        { say: 'Slide the white screen behind the lens until the sharpest inverted image of the cross-wires appears at v = 30.0 cm.' },
        { say: 'Plot 1/v against 1/u (or compute uv ÷ (u + v)): f = (30 × 30) ÷ (30 + 30) = 900 ÷ 60 = 15.0 cm.' },
      ],
      scene: () => [
        K.show(0, `<line class="cl-ln" x1="28" y1="176" x2="332" y2="176"/><ellipse cx="180" cy="136" rx="7" ry="40" fill="rgba(140,203,255,.28)" stroke="#93C5FD" stroke-width="1.8"/>`, { dur: 0.5 }),
        K.show(1, `<line x1="76" y1="176" x2="76" y2="112" stroke="${CRAY}" stroke-width="2.4"/><polygon points="76,106 72,114 80,114" fill="${CRAY}"/>`, { dur: 0.5 }),
        K.lab(1, [128, 194], 'u = 30.0 cm', { cls: 'dimm' }),
        K.show(2, `<rect x="282" y="96" width="4" height="80" fill="#F8FAFC"/><line x1="284" y1="136" x2="284" y2="168" stroke="#4ADE80" stroke-width="2.4"/><polyline points="76,108 180,108 284,168" fill="none" stroke="${CRAY}" stroke-width="1.4"/><line x1="76" y1="108" x2="284" y2="168" stroke="${CRAY}" stroke-width="1.4"/>`, { dur: 0.8 }),
        K.lab(2, [232, 194], 'v = 30.0 cm', { cls: 'dimm' }),
        K.lab(3, [180, 56], '1/f = 1/u + 1/v → f = 15.0 cm', { cls: 'eq' }),
      ],
    },

    /* 12. Concave Mirror by No-Parallax */
    {
      id: 'p-concave',
      subj: 'phys',
      cat: 'opt',
      h: 270,
      name: 'Concave mirror focal length by no-parallax',
      blurb: 'Locate centre of curvature R = 2f where an object pin coincides with its own inverted image',
      tip: 'Move your eye from side to side along the axis: when the inverted image tip and search pin tip stay locked together, parallax is eliminated.',
      steps: () => [
        { say: 'Mount the concave mirror vertically in a holder and place a tall optical search pin in front of its pole P along the principal axis.' },
        { say: 'View along the axis and slide the pin until its real inverted image appears tip-to-tip above the object pin.' },
        { say: 'Move your head left and right: adjust the pin slightly until object tip and image tip move together with zero relative shift (no parallax) at R = 24.0 cm.' },
        { say: 'At the centre of curvature C, object distance equals radius R = 2f, giving focal length f = R ÷ 2 = 24.0 ÷ 2 = 12.0 cm.' },
      ],
      scene: () => [
        K.show(0, `<line class="cl-thin" x1="40" y1="142" x2="296" y2="142" stroke-dasharray="3 3"/><path d="M282 86A78 78 0 0 1 282 198" fill="none" stroke="#93C5FD" stroke-width="3"/>`, { dur: 0.5 }),
        K.show(1, `<line x1="138" y1="190" x2="138" y2="142" stroke="${CBRASS}" stroke-width="2.5"/><polygon points="138,142 134,150 142,150" fill="${CBRASS}"/>`, { dur: 0.5 }),
        K.show(2, `<line x1="138" y1="94" x2="138" y2="142" stroke="#4ADE80" stroke-width="2.5"/><polygon points="138,142 134,134 142,134" fill="#4ADE80"/>`, { dur: 0.6 }),
        K.lab(2, [138, 76], 'Tip-to-tip (no parallax at C)', { cls: 'bold' }),
        K.lab(2, [214, 212], 'R = 24.0 cm', { cls: 'dimm' }),
        K.lab(3, [180, 42], 'f = R ÷ 2 = 12.0 cm', { cls: 'eq' }),
      ],
    },

    /* 13. Ohm's Law */
    {
      id: 'p-ohm',
      subj: 'phys',
      cat: 'elec',
      h: 280,
      name: 'Verification of Ohm’s law (V–I graph)',
      blurb: 'Measure potential difference V across a standard constantan wire for currents I controlled by a rheostat',
      tip: 'Open the plug key immediately after each reading so the resistor wire does not heat up and increase its resistance.',
      steps: () => [
        { say: 'Connect battery, plug key, ammeter A, and rheostat in series with standard resistor R, and connect voltmeter V in parallel across R.' },
        { say: 'Check zero settings on both meters, insert the plug key, and adjust the rheostat for five steady current values I.' },
        { say: 'Record paired readings (e.g., I = 0.40 A, V = 2.00 V; I = 0.80 A, V = 4.00 V) and open the key between readings to prevent heating.' },
        { say: 'Plot V against I: straight line through the origin verifies Ohm’s law with resistance R = ΔV ÷ ΔI = 4.00 ÷ 0.80 = 5.0 Ω.' },
      ],
      scene: () => [
        K.show(0, `<rect class="cl-ln" x="52" y="72" width="164" height="114" fill="none"/><rect x="108" y="176" width="52" height="20" fill="rgba(229,184,75,.28)" stroke="#E5B84B"/>`, { dur: 0.5 }),
        K.show(0, `<circle cx="52" cy="128" r="14" fill="#0F172A" stroke="#93C5FD"/><text class="cl-lbl bold" x="52" y="128" text-anchor="middle" dy=".35em">A</text>`, { par: true }),
        K.show(0, `<path class="cl-ln" d="M100 186V132h68v54"/><circle cx="134" cy="132" r="14" fill="#0F172A" stroke="#4ADE80"/><text class="cl-lbl bold" x="134" y="132" text-anchor="middle" dy=".35em">V</text>`, { dur: 0.5 }),
        K.lab(1, [134, 214], 'Resistor R (key opened between readings)', { cls: 'dimm' }),
        K.lab(2, [134, 50], 'I = 0.80 A  ·  V = 4.00 V', { cls: 'bold' }),
        K.show(3, `<path class="cl-ln" d="M244 196V96M244 196H340"/><line x1="244" y1="196" x2="332" y2="106" stroke="#4ADE80" stroke-width="2.2"/>`, { dur: 0.6 }),
        K.lab(3, [290, 236], 'Slope R = 5.0 Ω', { cls: 'eq' }),
      ],
    },

    /* 14. Metre Bridge */
    {
      id: 'p-metrebridge',
      subj: 'phys',
      cat: 'elec',
      h: 280,
      name: 'Metre bridge — unknown resistance X',
      blurb: 'Locate the Wheatstone null point l₁ on a 100 cm constantan wire using X / R = l₁ / (100 − l₁)',
      tip: 'Tap the jockey lightly on the wire — never scrape it along the constantan wire, which alters its uniform cross-sectional area.',
      steps: () => [
        { say: 'Connect unknown resistor X in the left gap and standard resistance box R = 4.0 Ω in the right gap of the metre bridge.' },
        { say: 'Touch the jockey near both ends A (0 cm) and B (100 cm) to check that the centre-zero galvanometer deflects in opposite directions.' },
        { say: 'Tap gently along the wire until the galvanometer shows zero deflection (null point) at balance length l₁ = 60.0 cm (so l₂ = 40.0 cm).' },
        { say: 'Apply Wheatstone balance: X ÷ 4.0 = 60.0 ÷ 40.0 = 1.50 → unknown resistance X = 6.0 Ω.' },
      ],
      scene: () => [
        K.show(0, ruleScale(36, 178, 288, 10) + `<path class="cl-ln" d="M36 178V92h72M252 92h72v86M140 92h80"/>`, { dur: 0.5 }),
        K.show(0, `<rect x="108" y="82" width="32" height="20" stroke="#F87171" fill="rgba(248,113,113,.2)"/><rect x="220" y="82" width="32" height="20" stroke="#93C5FD" fill="rgba(147,197,253,.2)"/>`, { par: true }),
        K.lab(0, [124, 68], 'Unknown X', { cls: 'bold' }),
        K.lab(0, [236, 68], 'R = 4.0 Ω', { cls: 'bold' }),
        K.show(2, `<circle cx="180" cy="132" r="14" fill="#0F172A" stroke="#4ADE80"/><text class="cl-lbl bold" x="180" y="132" text-anchor="middle" dy=".35em">G</text><line x1="180" y1="146" x2="208.8" y2="178" stroke="${CRAY}" stroke-width="2.2"/>`, { dur: 0.7 }),
        K.lab(2, [122, 212], 'l₁ = 60.0 cm', { cls: 'bold' }),
        K.lab(2, [266, 212], 'l₂ = 40.0 cm', { cls: 'dimm' }),
        K.lab(3, [180, 248], 'X = 4.0 × (60 / 40) = 6.0 Ω', { cls: 'eq' }),
      ],
    },

    /* 15. Potentiometer */
    {
      id: 'p-potentiometer',
      subj: 'phys',
      cat: 'elec',
      h: 280,
      name: 'Potentiometer — comparing cell EMFs',
      blurb: 'Measure null-deflection balance lengths l₁ and l₂ so E₁ / E₂ = l₁ / l₂ with zero current drawn',
      tip: 'Connect all positive cell terminals (driver accumulator and test cells E₁, E₂) to the same zero end A; otherwise no balance point exists.',
      steps: () => [
        { say: 'Connect a steady 2.0 V driver accumulator across the 100 cm potentiometer wire AB, with positive terminals of E₁ and E₂ also joined to end A.' },
        { say: 'Switch Leclanché cell E₁ (1.50 V) into the galvanometer circuit and tap the jockey to find null balance at l₁ = 75.0 cm.' },
        { say: 'Switch Daniell cell E₂ into the galvanometer circuit without altering the driver current; locate the new null point at l₂ = 54.0 cm.' },
        { say: 'Since zero current flows from the test cell at balance, E₂ = E₁ × (l₂ ÷ l₁) = 1.50 × (54.0 ÷ 75.0) = 1.08 V.' },
      ],
      scene: () => [
        K.show(0, ruleScale(36, 186, 288, 10) + `<path class="cl-ln" d="M36 186V54h116M208 54h116v132"/><line class="cl-ln" x1="172" y1="42" x2="172" y2="66"/><line class="cl-ln" x1="184" y1="48" x2="184" y2="60"/>`, { dur: 0.5 }),
        K.lab(0, [180, 28], 'Driver accumulator (positive at A)', { cls: 'dimm' }),
        K.show(1, `<path class="cl-ln" d="M36 124h64"/><circle cx="152" cy="124" r="13" fill="#0F172A" stroke="#4ADE80"/><text class="cl-lbl bold" x="152" y="124" text-anchor="middle" dy=".35em">G</text><line x1="165" y1="124" x2="252" y2="186" stroke="${CRAY}" stroke-width="2"/>`, { until: 1, dur: 0.6 }),
        K.lab(1, [252, 218], 'E₁ = 1.50 V → l₁ = 75.0 cm', { cls: 'bold', until: 1 }),
        K.show(2, `<path class="cl-ln" d="M36 124h64"/><circle cx="152" cy="124" r="13" fill="#0F172A" stroke="#4ADE80"/><text class="cl-lbl bold" x="152" y="124" text-anchor="middle" dy=".35em">G</text><line x1="165" y1="124" x2="191.5" y2="186" stroke="#4ADE80" stroke-width="2.2"/>`, { dur: 0.6 }),
        K.lab(2, [192, 218], 'E₂ null point → l₂ = 54.0 cm', { cls: 'bold' }),
        K.lab(3, [180, 252], 'E₂ = 1.50 × (54.0 / 75.0) = 1.08 V', { cls: 'eq' }),
      ],
    },

    /* 16. Resonance Tube */
    {
      id: 'p-resonance',
      subj: 'phys',
      cat: 'wave',
      h: 290,
      name: 'Resonance tube — speed of sound in air',
      blurb: 'Eliminate end correction c using first and second resonances v = 2f(l₂ − l₁)',
      tip: 'Hold the vibrating tuning fork horizontally about 1 cm above the open rim — subtracting l₁ from l₂ cancels end correction c completely.',
      steps: () => [
        { say: 'Strike a tuning fork of known frequency f = 512 Hz on a rubber pad and hold it just above a glass tube immersed in water.' },
        { say: 'Raise the tube slowly from minimal air length until the first loud booming resonance occurs at l₁ = 16.0 cm (l₁ + c = λ/4).' },
        { say: 'Raise the tube further with the same 512 Hz fork until the second loud resonance is heard at l₂ = 49.2 cm (l₂ + c = 3λ/4).' },
        { say: 'Eliminate end correction c: λ/2 = l₂ − l₁ = 33.2 cm = 0.332 m → speed of sound v = 2f(l₂ − l₁) = 2 × 512 × 0.332 = 340 m s⁻¹.' },
      ],
      scene: () => [
        K.show(0, K.beaker(84, 152, 76, 112) + `<rect class="cl-gl" x="108" y="64" width="28" height="186"/>`, { dur: 0.5 }),
        K.liq(0, { x: 86, w: 72, bottom: 262, h0: 96, h1: 96, fill: CWATER, dur: 0.4 }),
        K.show(0, `<path class="cl-ln" d="M108 42h18M126 36v12M126 42h18" stroke="${CRAY}" stroke-width="2.2"/>`, { dur: 0.4 }),
        K.lab(0, [122, 22], 'f = 512 Hz tuning fork', { cls: 'dimm' }),
        K.show(1, `<path d="M110 64Q122 114 134 64" fill="none" stroke="#4ADE80" stroke-width="2"/>`, { dur: 0.5 }),
        K.lab(1, [248, 98], '1st resonance: l₁ = 16.0 cm', { cls: 'bold' }),
        K.show(2, K.beaker(196, 184, 76, 80) + `<rect class="cl-gl" x="220" y="54" width="28" height="196"/>`, { dur: 0.6 }),
        K.liq(2, { x: 198, w: 72, bottom: 262, h0: 56, h1: 56, fill: CWATER, dur: 0.4 }),
        K.lab(2, [252, 134], '2nd resonance: l₂ = 49.2 cm', { cls: 'bold' }),
        K.lab(3, [180, 278], 'v = 2f(l₂ − l₁) = 340 m s⁻¹', { cls: 'eq' }),
      ],
    },
  ];
}
