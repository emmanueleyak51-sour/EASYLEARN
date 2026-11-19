import type { Beat, IdeaBeat, InteractiveLesson, TeachBeat, TeachBlock, Topic } from '../types';
import { perm } from '../utils/engine';
import { PHYS_TOPICS_PART1 } from './physTopicsPart1';
import { PHYS_TOPICS_PART2 } from './physTopicsPart2';
import { PHYS_TOPICS_PART3 } from './physTopicsPart3';

export const PHYS_TEACH_TABLES: Record<string, { title: string; headers: string[]; rows: string[][] }> = {
  'p-units': {
    title: 'SI Derived Quantities, Units & Dimensional Formulas',
    headers: ['Physical Quantity', 'Defining Relation & SI Unit', 'Dimensions [MᵃLᵇTᶜ]'],
    rows: [
      ['Force / Weight / Upthrust', 'F = ma → newton (N = kg m s⁻²)', 'M L T⁻²'],
      ['Work / Energy / Torque', 'W = Fd → joule (J) / N m', 'M L² T⁻²'],
      ['Pressure / Stress / Young’s E', 'P = F / A → pascal (Pa = N m⁻²)', 'M L⁻¹ T⁻²'],
      ['Power / Impulse / Momentum', 'P = W/t (W) · I = Ft (N s)', 'ML²T⁻³ · MLT⁻¹'],
    ],
  },
  'p-motion': {
    title: 'SUVAT Equations & Motion Graph Reference',
    headers: ['Motion Feature', 'Formula / Graph Rule', 'WAEC / JAMB Application'],
    rows: [
      ['No-displacement equation', 'v = u + at', 'Find final velocity or time'],
      ['Time-independent equation', 'v² = u² + 2as', 'Stopping distance & max height'],
      ['v–t Graph Gradient & Area', 'Slope = a · Area = Total distance s', 'Trapezium cruise problems'],
      ['Angle of Repose (incline)', 'μ = tan θ (when just sliding)', 'Static friction coefficient'],
    ],
  },
  'p-vectors': {
    title: 'Resultant of Two Vectors P and Q at Angle θ',
    headers: ['Angle θ Between P & Q', 'Resultant Formula', 'Direction / Special Case'],
    rows: [
      ['θ = 0° (same direction)', 'R_max = P + Q', 'Along common line of action'],
      ['θ = 180° (opposite)', 'R_min = |P − Q|', 'Along the larger vector'],
      ['θ = 90° (perpendicular)', 'R = √(P² + Q²)', 'tan α = Q / P'],
      ['General angle θ', 'R = √(P² + Q² + 2PQ cos θ)', 'Components: F cos θ, F sin θ'],
    ],
  },
  'p-newton': {
    title: 'Apparent Weight of Mass m in a Lift (Elevator)',
    headers: ['Lift Motion State', 'Scale Reading (Normal R)', 'Physical Sensation'],
    rows: [
      ['At rest OR constant speed v', 'R = mg (a = 0)', 'True normal weight'],
      ['Accelerating UPWARD at a', 'R = m(g + a)', 'Feels heavier than mg'],
      ['Accelerating DOWNWARD at a', 'R = m(g − a)', 'Feels lighter than mg'],
      ['Free fall / cable snaps (a = g)', 'R = 0 N', 'Apparent weightlessness'],
    ],
  },
  'p-work': {
    title: 'Work, Mechanical Energy & Power Summary',
    headers: ['Quantity', 'Core Equation', 'SI Unit & Key Exam Note'],
    rows: [
      ['Mechanical Work', 'W = Fd cos θ', 'Joule (J); W = 0 if θ = 90°'],
      ['Kinetic Energy', 'KE = ½mv²', 'Doubling speed v quadruples KE'],
      ['Gravitational PE', 'PE = mgh', 'Free fall: mgh_top = ½mv²_bottom'],
      ['Mechanical Power', 'P = W / t = Fv', 'Watt (W = J s⁻¹); 1 hp = 746 W'],
    ],
  },
  'p-fluids': {
    title: 'Hydrostatics, Archimedes & Relative Density Matrix',
    headers: ['Law / Quantity', 'Working Formula', 'Exam Precaution'],
    rows: [
      ['Liquid Pressure at depth h', 'P = ρgh (Total = P₀ + ρgh)', 'Depends on vertical depth h only'],
      ['Hydraulic Press (Pascal)', 'F₁ / A₁ = F₂ / A₂', 'Force multiplies by area ratio A₂/A₁'],
      ['RD of Solid (weighing)', 'W_air / (W_air − W_water)', 'Pure ratio — NO UNIT'],
      ['RD of Liquid (upthrust)', '(W_air − W_liq) / (W_air − W_water)', 'Floating body displaces own weight'],
    ],
  },
  'p-elastic': {
    title: 'Hooke’s Law, Young’s Modulus & Capillarity',
    headers: ['Concept', 'Formula / Behaviour', 'Wetting vs Non-Wetting'],
    rows: [
      ['Hooke’s Law & Spring Energy', 'F = ke · W = ½Fe = ½ke²', 'Valid up to proportional/elastic limit'],
      ['Young’s Modulus E', 'E = (F/A) ÷ (e/l₀) = Fl₀ / Ae', 'Unit: N m⁻² (Pa); strain has no unit'],
      ['Water in clean glass', 'Adhesion > Cohesion', 'Concave meniscus; capillary RISE'],
      ['Mercury in glass', 'Cohesion > Adhesion', 'Convex meniscus; capillary DEPRESSION'],
    ],
  },
  'p-expansion': {
    title: 'Thermal Expansivity Relations & Water Anomaly',
    headers: ['Expansivity Type', 'Symbol & Formula', 'Key Ratio / Behaviour'],
    rows: [
      ['Linear expansivity', 'α = Δl / (l₁ Δθ)', 'Unit: K⁻¹; bimetallic brass bends outside'],
      ['Area (superficial)', 'β = ΔA / (A₁ Δθ)', 'β = 2α'],
      ['Volume (cubic)', 'γ = ΔV / (V₁ Δθ)', 'γ = 3α; γ_real = γ_app + γ_vessel'],
      ['Water (0 °C → 4 °C)', 'Anomalous contraction on heating', 'Maximum density (1000 kg m⁻³) at 4 °C'],
    ],
  },
  'p-heat-trans': {
    title: 'Conduction, Convection, Radiation & Vacuum Flask',
    headers: ['Mode', 'Medium Needed?', 'Vacuum (Thermos) Flask Prevention'],
    rows: [
      ['Conduction', 'Yes (fastest in metals via free e⁻)', 'Stopped by vacuum + cork/plastic neck'],
      ['Convection', 'Yes (liquids & gases only — density flow)', 'Stopped by vacuum + tight stopper'],
      ['Radiation', 'No (infrared EM waves cross vacuum)', 'Minimized by shiny silvered glass walls'],
    ],
  },
  'p-electrostatics': {
    title: 'Triboelectric Pairs & Electroscope Charge Test',
    headers: ['Procedure / Test', 'Charge / Leaf Observation', 'Diagnostic Conclusion'],
    rows: [
      ['Glass rod rubbed with silk', 'Glass loses e⁻ → Positive (+)', 'Silk gains e⁻ → Negative (−)'],
      ['Ebonite/polythene + fur', 'Ebonite gains e⁻ → Negative (−)', 'Fur loses e⁻ → Positive (+)'],
      ['Leaf DIVERGES further', 'Same charge repelled down to leaf', 'ONLY sure proof of SAME sign'],
      ['Leaf COLLAPSES', 'Opposite charge OR uncharged metal', 'Ambiguous — not proof of sign'],
    ],
  },
  'p-dc-circuits': {
    title: 'Series vs Parallel DC Resistor Networks & EMF',
    headers: ['Circuit Rule', 'Series Connection', 'Parallel Connection'],
    rows: [
      ['Current & Voltage', 'Same I; V = V₁ + V₂', 'Same V; I = I₁ + I₂'],
      ['Equivalent Resistance', 'R = R₁ + R₂ + R₃', '1/R = 1/R₁ + 1/R₂ (R < smallest)'],
      ['Cell Internal Resistance', 'E = I(R + r) = V + Ir', 'Lost volts = Ir; V < E under load'],
      ['Electrical Energy / Bill', 'E = IVt = I²Rt = (V²/R)t', '1 kWh = 3.6 × 10⁶ J'],
    ],
  },
  'p-projectiles': {
    title: 'Projectile Motion Master Equations (Launch U at θ)',
    headers: ['Quantity', 'Formula', 'Exam Shortcut'],
    rows: [
      ['Time of Flight (level)', 'T = 2U sin θ / g', 'Double time to max height'],
      ['Maximum Height', 'H = U² sin²θ / (2g)', 'At peak: Vy = 0, Vx = U cos θ'],
      ['Horizontal Range', 'R = U² sin 2θ / g', 'Max R = U²/g at θ = 45°; R(θ)=R(90°−θ)'],
      ['Horizontal Cliff Launch', 't = √(2h/g),  x = U t', 'Fall time independent of U'],
    ],
  },
  'p-equilibrium': {
    title: 'Conditions of Equilibrium & Stability Classes',
    headers: ['State / Condition', 'Centre of Gravity / Moment Rule', 'Classic Example'],
    rows: [
      ['Rotational Equilibrium', 'Σ Clockwise moments = Σ Anticlockwise', 'Uniform metre rule CG acts at 50 cm'],
      ['Stable Equilibrium', 'Slight tilt RAISES CG; wide base', 'Cone on flat base, Bunsen burner'],
      ['Unstable Equilibrium', 'Slight tilt LOWERS CG', 'Cone balanced on pointed apex'],
      ['Neutral Equilibrium', 'CG height stays CONSTANT on rolling', 'Sphere on flat table, cone on side'],
    ],
  },
  'p-shm': {
    title: 'SHM Quantities at Equilibrium Centre vs Extreme Ends',
    headers: ['Position', 'Speed v & Kinetic Energy', 'Acceleration a & Potential Energy'],
    rows: [
      ['Centre (x = 0)', 'MAXIMUM (v_max = ωA, KE max)', 'ZERO (a = 0, PE = 0)'],
      ['Extreme Ends (x = ±A)', 'ZERO (v = 0, KE = 0)', 'MAXIMUM (a_max = ω²A, PE max)'],
      ['Simple Pendulum', 'T = 2π√(l / g)', 'Independent of bob mass m'],
      ['Loaded Spring', 'T = 2π√(m / k)', 'ω = √(k / m)'],
    ],
  },
  'p-machines': {
    title: 'Velocity Ratio (VR) of Standard Simple Machines',
    headers: ['Machine', 'Geometric VR Formula', 'Efficiency Relation'],
    rows: [
      ['Block & Tackle Pulley', 'VR = Number of pulleys n', 'η = (MA / VR) × 100%'],
      ['Inclined Plane (angle θ)', 'VR = l / h = 1 / sin θ', 'VR never changes with friction'],
      ['Screw Jack (arm r, pitch p)', 'VR = 2πr / p', 'Very large VR for heavy lifting'],
      ['Wheel (R) & Axle (r)', 'VR = R / r', 'MA = Load / Effort'],
    ],
  },
  'p-calorimetry': {
    title: 'Sensible Heat vs Latent Heat Equations',
    headers: ['Thermal Process', 'Temperature Change?', 'Heat Formula & Water Value'],
    rows: [
      ['Warming / Cooling single phase', 'Yes (Δθ = θ₂ − θ₁)', 'Q = mcΔθ (c_water = 4200 J kg⁻¹ K⁻¹)'],
      ['Melting / Freezing at 0 °C', 'NO (constant 0 °C)', 'Q = mL_f (L_f = 3.36 × 10⁵ J kg⁻¹)'],
      ['Boiling / Condensing at 100 °C', 'NO (constant 100 °C)', 'Q = mL_v (L_v = 2.26 × 10⁶ J kg⁻¹)'],
    ],
  },
  'p-gas-laws': {
    title: 'Ideal Gas Laws Summary (T MUST be in Kelvin!)',
    headers: ['Gas Law', 'Constant Quantity', 'Working Equation'],
    rows: [
      ['Boyle’s Law', 'Temperature T & mass', 'P₁V₁ = P₂V₂'],
      ['Charles’s Law', 'Pressure P & mass', 'V₁ / T₁ = V₂ / T₂ (T = θ + 273)'],
      ['Pressure (Gay-Lussac) Law', 'Volume V & mass', 'P₁ / T₁ = P₂ / T₂'],
      ['General Gas Equation', 'Mass of gas only', 'P₁V₁ / T₁ = P₂V₂ / T₂'],
    ],
  },
  'p-waves': {
    title: 'Progressive vs Stationary Wave Properties',
    headers: ['Feature', 'Progressive Wave y = A sin(ωt − kx)', 'Stationary (Standing) Wave'],
    rows: [
      ['Wave Parameters', 'ω = 2πf, k = 2π/λ, v = fλ = ω/k', 'Formed by 2 equal opposite waves'],
      ['Amplitude & Nodes', 'Every particle reaches same A', 'Nodes = 0 amp; Antinodes = max amp'],
      ['Node Spacing', 'Crest-to-crest = λ', 'Node–Node = λ/2; Node–Antinode = λ/4'],
      ['Polarization Test', 'Transverse ONLY (light, EM)', 'Longitudinal sound CANNOT polarize'],
    ],
  },
  'p-sound': {
    title: 'Harmonics in Strings, Closed Pipes & Open Pipes',
    headers: ['Resonator', 'Fundamental f₀', 'Allowed Harmonics / Overtones'],
    rows: [
      ['Stretched String (l)', 'f₀ = [1/(2l)] √(T/μ)', 'All harmonics: f₀, 2f₀, 3f₀...'],
      ['Closed Pipe (1 end closed)', 'f₀ = v / (4L)', 'ODD harmonics ONLY: f₀, 3f₀, 5f₀'],
      ['Open Pipe (both ends open)', 'f₀ = v / (2L)', 'ALL harmonics: f₀, 2f₀, 3f₀, 4f₀'],
      ['Echo / Resonance Tube', 'd = vt / 2 · λ = 2(l₂ − l₁)', 'Eliminates end correction c'],
    ],
  },
  'p-reflection': {
    title: 'Spherical Mirror Image Sign Table (Real-is-Positive)',
    headers: ['Mirror & Object Position', 'Focal Length Sign', 'Image Nature & Sign of v'],
    rows: [
      ['Concave: u > 2f', '+f', 'Real (+v), inverted, diminished'],
      ['Concave: u = 2f (at C)', '+f', 'Real (+v = 2f), inverted, same size (m=1)'],
      ['Concave: u < f (shaving)', '+f', 'Virtual (−v), erect, magnified'],
      ['Convex: ANY real object u', '−f (ALWAYS)', 'Virtual (−v), erect, diminished, wide view'],
    ],
  },
  'p-refraction': {
    title: 'Refractive Index, Critical Angle & Prism Relations',
    headers: ['Optical Phenomenon', 'Formula', 'Condition / Application'],
    rows: [
      ['Snell’s Law & Wave Speed', 'n = sin i / sin r = c / v', 'Frequency f stays unchanged'],
      ['Apparent Depth', 'n = Real Depth / Apparent Depth', 'Upward shift d = H(1 − 1/n)'],
      ['Critical Angle & TIR', 'sin C = 1 / n', 'Denser → Rarer AND i > C (optical fibre)'],
      ['Prism Min. Deviation', 'n = sin[(A + D_m)/2] / sin(A/2)', 'At D_m: D_m = 2i − A'],
    ],
  },
  'p-lenses': {
    title: 'Eye Defects, Lens Power & Electromagnetic Spectrum',
    headers: ['Topic', 'Key Rule / Correction', 'Formula / Order'],
    rows: [
      ['Myopia (Short-sighted)', 'Focus before retina → CONCAVE lens', 'Negative power (−D), f in metres'],
      ['Hypermetropia (Long-sighted)', 'Focus behind retina → CONVEX lens', 'Positive power P = +1/f(m) = +100/f(cm)'],
      ['Prism Dispersion', 'Red bends LEAST; Violet bends MOST', 'ROYGBIV (Red fastest in glass)'],
      ['EM Spectrum (increasing f)', 'Radio→Micro→IR→Vis→UV→X→Gamma', 'All travel at 3.0 × 10⁸ m s⁻¹ in vacuum'],
    ],
  },
  'p-gravitation': {
    title: 'Gravitational Field, Orbital & Escape Velocity',
    headers: ['Quantity', 'Formula', 'Earth / Exam Note'],
    rows: [
      ['Newton’s Gravitation', 'F = Gm₁m₂ / r²', 'Inverse-square law from centres'],
      ['Field Strength & Potential', 'g = GM / r² · V = −GM / r', 'GM = gR²; V unit is J kg⁻¹'],
      ['Circular Orbital Speed', 'v₀ = √(GM / r) ≈ √(gR)', '~7.9 km s⁻¹ near Earth; geostationary T=24 h'],
      ['Escape Velocity', 'vₑ = √(2GM / R) = √(2gR)', '~11.2 km s⁻¹; independent of rocket mass'],
    ],
  },
  'p-efield-cap': {
    title: 'Resistors vs Capacitors Network Comparison',
    headers: ['Feature', 'Capacitors', 'Resistors (Contrast)'],
    rows: [
      ['Parallel Combination', 'C = C₁ + C₂ + C₃ (ADD!)', '1/R = 1/R₁ + 1/R₂'],
      ['Series Combination', '1/C = 1/C₁ + 1/C₂ (same Q)', 'R = R₁ + R₂ (same I)'],
      ['Parallel-Plate Geometry', 'C = εᵣε₀A / d', 'R = ρL / A'],
      ['Energy Stored', 'W = ½CV² = ½QV = ½Q²/C', 'Dissipates heat P = I²R'],
    ],
  },
  'p-elec-meas': {
    title: 'Bridge, Potentiometer & Galvanometer Conversions',
    headers: ['Instrument / Conversion', 'Connection & Resistance', 'Working Equation'],
    rows: [
      ['Metre Bridge (null Ig=0)', 'Slide wire AB = 100 cm', 'R₁ / R₂ = l₁ / (100 − l₁)'],
      ['Potentiometer (null Ig=0)', 'Draws ZERO current from cell', 'E₁ / E₂ = l₁ / l₂'],
      ['Galvanometer → Ammeter', 'Low SHUNT Rₛ in PARALLEL', 'Rₛ = (Ig Rg) / (I − Ig)'],
      ['Galvanometer → Voltmeter', 'High MULTIPLIER Rₘ in SERIES', 'Rₘ = (V / Ig) − Rg'],
    ],
  },
  'p-electrolysis-cell': {
    title: 'Electric Cells, Defects & Faraday’s Electrolysis',
    headers: ['Cell / Concept', 'Defect / Electrolyte', 'Cure / Law'],
    rows: [
      ['Simple Cell Polarization', 'H₂ bubbles coat Cu plate', 'Depolarizer: MnO₂ (Leclanché) or K₂Cr₂O₇'],
      ['Simple Cell Local Action', 'Impurities in commercial Zn', 'Amalgamate zinc plate with mercury'],
      ['Lead-Acid Accumulator', 'PbO₂ (+), Pb (−), dil. H₂SO₄', 'Test charge with hydrometer (RD 1.25)'],
      ['Faraday’s 1st Law', 'Mass deposited m ∝ Q', 'm = ZIt (t in seconds!)'],
    ],
  },
  'p-magnetism': {
    title: 'Soft Iron vs Steel & Magnetic Force Formulas',
    headers: ['Material / Law', 'Behaviour / Formula', 'Primary Engineering Use'],
    rows: [
      ['Soft Iron', 'Magnetizes & demagnetizes easily', 'Electromagnets, relays, transformer cores'],
      ['Steel', 'Hard to magnetize; retains strongly', 'Permanent bar magnets, compass needles'],
      ['Current-Carrying Wire', 'F = BIL sin θ (Fleming Left Hand)', 'DC motor (with split-ring commutator)'],
      ['Moving Charge in B', 'F = Bqv sin θ', 'Zero force if v = 0 or parallel (θ = 0°)'],
    ],
  },
  'p-induction': {
    title: 'Transformer Ratios & The 4 Core/Coil Losses',
    headers: ['Transformer Feature', 'Cause / Relation', 'Design Remedy'],
    rows: [
      ['Turns & Voltage Ratio', 'Vₛ / Vₚ = Nₛ / Nₚ', 'Nₛ > Nₚ step-up; AC ONLY (DC gives 0 V)'],
      ['Eddy Current Loss', 'Induced circulating core currents', 'LAMINATE core into insulated thin sheets'],
      ['Hysteresis Loss', 'Repeated domain reversal per cycle', 'Use high-permeability SOFT IRON core'],
      ['Copper I²R & Flux Loss', 'Coil resistance & stray flux', 'Thick copper wire; wind coils closely'],
    ],
  },
  'p-ac-circuits': {
    title: 'Series RLC Alternating Current Phasor Reference',
    headers: ['Element', 'Opposition (Ω)', 'Phase Between V and I'],
    rows: [
      ['Pure Resistor R', 'R (independent of f)', 'V and I IN PHASE (φ = 0°, cos φ = 1)'],
      ['Pure Inductor L', 'X_L = 2πfL', 'V leads I by 90° (average P = 0 W)'],
      ['Pure Capacitor C', 'X_C = 1 / (2πfC)', 'I leads V by 90° (average P = 0 W)'],
      ['Series RLC & Resonance', 'Z = √[R² + (X_L − X_C)²]', 'Resonance X_L=X_C: f₀ = 1/[2π√(LC)], Z=R'],
    ],
  },
  'p-atomic-quantum': {
    title: 'Quantum Photoelectric vs X-Ray Tube Equations',
    headers: ['Phenomenon', 'Governing Equation', 'What Controls Energy vs Intensity?'],
    rows: [
      ['Bohr Photon Transition', 'ΔE = E_high − E_low = hf = hc/λ', 'Discrete line emission/absorption spectra'],
      ['Photoelectric Effect', 'hf = W₀ + KE_max (KE_max = eVₛ)', 'Frequency sets KE_max; brightness sets current'],
      ['X-Ray Tube (Coolidge)', 'eV = hf_max = hc / λ_min', 'Anode kV sets hardness; filament I sets intensity'],
      ['de Broglie Matter Wave', 'λ = h / (mv)', 'Electron diffraction proves wave nature'],
    ],
  },
  'p-nuclear': {
    title: 'Alpha, Beta & Gamma Radiation Comparison',
    headers: ['Radiation', 'Nature & Nuclear Change', 'Ionizing Power & Stopping Shield'],
    rows: [
      ['Alpha (α)', '⁴₂He²⁺ nucleus (A−4, Z−2)', 'HIGHEST ionization; stopped by thin paper'],
      ['Beta (β⁻)', 'Fast electron ⁰₋₁e (A same, Z+1)', 'Medium ionization; stopped by ~3 mm Al'],
      ['Gamma (γ)', 'EM photon (A same, Z same)', 'LOWEST ionization; needs thick lead block'],
      ['Half-Life & Reactor', 'N = N₀(½)ⁿ · ΔE = Δmc²', 'Moderator (graphite) slows; Boron absorbs n'],
    ],
  },
  'p-electronics': {
    title: 'Semiconductors & Digital Logic Gate Truth Table',
    headers: ['Inputs (A, B)', 'AND (A·B) / NAND', 'OR (A+B) / NOR / XOR'],
    rows: [
      ['(0, 0)', 'AND = 0 · NAND = 1', 'OR = 0 · NOR = 1 · XOR = 0'],
      ['(0, 1) or (1, 0)', 'AND = 0 · NAND = 1', 'OR = 1 · NOR = 0 · XOR = 1'],
      ['(1, 1)', 'AND = 1 · NAND = 0', 'OR = 1 · NOR = 0 · XOR = 0'],
      ['Doping Summary', 'Group 5 (P, As) → n-type (e⁻)', 'Group 3 (B, In) → p-type (holes)'],
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

function buildInteractiveForPhysTopic(topic: Topic): InteractiveLesson {
  const tableSpec = PHYS_TEACH_TABLES[topic.id];

  return {
    title: topic.name,
    goals: topic.goals,
    trap: topic.trap,
    parts: topic.parts.map((part, pIdx) => {
      const beats: Beat[] = [];

      // 1. Core Physics Principle & Laws (IdeaBeat)
      const ideaBeat: IdeaBeat = {
        k: 'idea',
        kl: `Chapter ${pIdx + 1} · Core Principle`,
        title: part.title,
        idea: part.idea,
        g: part.g,
        cap: part.cap,
        rules: part.rules,
        rh: 'Essential Laws, SI Units & Exam Rules',
      };
      beats.push(ideaBeat);

      // 2. Structured Comparison / SI-Unit Table Beat (.tw table) on Chapter 1
      if (pIdx === 0 && tableSpec) {
        const body: TeachBlock[] = [
          ['h', tableSpec.title],
          ['tb', tableSpec.headers, tableSpec.rows],
          ['wn', `<b>WAEC & JAMB Watchout:</b> ${topic.trap}`],
        ];
        const teachBeat: TeachBeat = {
          k: 'teach',
          kl: 'Mastery Comparison Chart',
          title: tableSpec.title,
          body,
        };
        beats.push(teachBeat);
      }

      // 3. Step-by-Step Worked Calculation (FadeBeat)
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
        kl: 'Worked Physics Calculation',
        lv: pIdx === 0 ? 'full' : 'one',
        title: `Worked Example — ${part.title}`,
        q: part.ex.q,
        g: part.ex.g,
        steps: fadeSteps,
      });

      // 4. Spot-the-Exam-Trap Beat (when present)
      if (topic.spot && topic.spot.part === pIdx) {
        const sp = shuffleMcq(
          `spot|${topic.id}|${pIdx}`,
          topic.spot.o,
          topic.spot.a ?? 0,
          topic.spot.fb
        );
        beats.push({
          k: 'spot',
          kl: 'Spot the Exam Trap',
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

      // 5. Quick Mastery Check Beat
      const defaultFb = part.tryit.o.map((_, idx) =>
        idx === part.tryit.a ? `Spot on! ${part.tryit.e}` : `Check your formula/units: ${part.tryit.e}`
      );
      const cp = shuffleMcq(
        `tryit|${topic.id}|${pIdx}`,
        part.tryit.o,
        part.tryit.a,
        part.tryit.fb || defaultFb
      );
      beats.push({
        k: 'check',
        kl: 'Quick Exam Check',
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

export function buildPhysCurriculum(): {
  topics: Topic[];
  il: Record<string, InteractiveLesson>;
} {
  const rawTopics: Topic[] = [
    ...PHYS_TOPICS_PART1,
    ...PHYS_TOPICS_PART2,
    ...PHYS_TOPICS_PART3,
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
    il[t.id] = buildInteractiveForPhysTopic(t);
  }

  return { topics, il };
}
