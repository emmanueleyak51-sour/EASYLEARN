import type { FormulaRearrangement } from './chemFormulas';

export type PhysFormulaCatId =
  | 'mechanics'
  | 'machines'
  | 'thermal'
  | 'waves'
  | 'electricity'
  | 'modern';

export interface PhysFormulaCategory {
  id: PhysFormulaCatId | 'all';
  label: string;
  shortLabel: string;
  desc: string;
}

export interface PhysFormulaItem {
  id: string;
  cat: PhysFormulaCatId;
  name: string;
  topicId: string;
  summary: string;
  rearrangements: FormulaRearrangement[];
  variables: [string, string][];
  constants?: string[];
  trap: string;
  worked: {
    qHtml: string;
    stepsHtml: string[];
    ansHtml: string;
  };
  keywords: string[];
}

export const PHYS_FORMULA_CATEGORIES: PhysFormulaCategory[] = [
  {
    id: 'all',
    label: 'All Physics Formulas',
    shortLabel: 'All',
    desc: 'All 30 NERDC, WAEC & JAMB equations across mechanics, heat, waves, optics, electricity & modern physics',
  },
  {
    id: 'mechanics',
    label: 'Kinematics, Dynamics & Gravitation',
    shortLabel: 'Mechanics',
    desc: 'Equations of motion, projectiles, Newton’s laws, momentum, moments, SHM & satellite orbits',
  },
  {
    id: 'machines',
    label: 'Energy, Machines, Elasticity & Fluids',
    shortLabel: 'Energy & Fluids',
    desc: 'Work & kinetic energy, mechanical efficiency, Hooke’s law, Young’s modulus, pressure & Archimedes',
  },
  {
    id: 'thermal',
    label: 'Heat, Gas Laws & Expansivity',
    shortLabel: 'Thermal',
    desc: 'Linear expansivity, specific heat capacity, latent heat, and general gas equation in Kelvin',
  },
  {
    id: 'waves',
    label: 'Waves, Sound, Mirrors & Lenses',
    shortLabel: 'Waves & Optics',
    desc: 'Wave speed, echo sonar, Snell’s law, critical angle, mirror/lens equation & magnification',
  },
  {
    id: 'electricity',
    label: 'Electricity, Magnetism & AC Circuits',
    shortLabel: 'Electricity',
    desc: 'Coulomb’s law, capacitors, Ohm’s law, cell EMF, electrical power, transformers & RLC resonance',
  },
  {
    id: 'modern',
    label: 'Quantum, Atomic & Nuclear Physics',
    shortLabel: 'Modern Physics',
    desc: 'Photoelectric Einstein equation, radioactive half-life decay & Einstein mass–energy equivalence',
  },
];

export const PHYS_FORMULAS: PhysFormulaItem[] = [
  /* ─────────────── 1. MECHANICS ─────────────── */
  {
    id: 'pf-v-u-at',
    cat: 'mechanics',
    name: 'First Equation of Uniformly Accelerated Motion',
    topicId: 'p-motion',
    summary: 'Relates final velocity to initial velocity, constant acceleration, and elapsed time.',
    rearrangements: [
      { solveFor: 'v', label: 'Solve for final velocity (v)', exprHtml: 'v = u + at' },
      { solveFor: 'a', label: 'Solve for acceleration (a)', exprHtml: 'a = (v − u) ÷ t' },
      { solveFor: 't', label: 'Solve for time (t)', exprHtml: 't = (v − u) ÷ a' },
    ],
    variables: [['v', 'Final velocity (m s⁻¹)'], ['u', 'Initial velocity (m s⁻¹)'], ['a', 'Uniform acceleration (m s⁻²)'], ['t', 'Time taken (s)']],
    trap: 'Convert km h⁻¹ to m s⁻¹ by dividing by 3.6 (multiply by 5/18) BEFORE substituting!',
    worked: { qHtml: 'A car accelerates uniformly from 5 m s⁻¹ at 3 m s⁻² for 6 s. Find v.', stepsHtml: ['v = u + at = 5 + (3 × 6) = 23 m s⁻¹'], ansHtml: '23 m s⁻¹' },
    keywords: ['velocity', 'acceleration', 'kinematics', 'suvat'],
  },
  {
    id: 'pf-v2-u2-2as',
    cat: 'mechanics',
    name: 'Third Equation of Motion (Velocity–Displacement)',
    topicId: 'p-motion',
    summary: 'Links speeds, acceleration, and distance directly when time t is not given.',
    rearrangements: [
      { solveFor: 'v²', label: 'Solve for v²', exprHtml: 'v² = u² + 2as' },
      { solveFor: 's', label: 'Solve for braking/stopping distance (s)', exprHtml: 's = (v² − u²) ÷ (2a)' },
    ],
    variables: [['v', 'Final speed (m s⁻¹)'], ['u', 'Initial speed (m s⁻¹)'], ['a', 'Acceleration (m s⁻²)'], ['s', 'Displacement (m)']],
    trap: 'For upward projection against gravity, set a = −g = −10 m s⁻²; at maximum height v = 0.',
    worked: { qHtml: 'A stone thrown vertically upward at 20 m s⁻¹ reaches max height H (g = 10 m s⁻²). Find H.', stepsHtml: ['0² = 20² − 2(10)H → 20H = 400 → H = 20 m'], ansHtml: '20 m' },
    keywords: ['stopping distance', 'maximum height', 'free fall'],
  },
  {
    id: 'pf-projectile-range',
    cat: 'mechanics',
    name: 'Horizontal Range of a Projectile',
    topicId: 'p-projectiles',
    summary: 'Gives horizontal ground distance covered by a projectile launched at speed u and angle θ.',
    rearrangements: [
      { solveFor: 'R', label: 'Horizontal range (R)', exprHtml: 'R = u² sin 2θ ÷ g' },
      { solveFor: 'R_max', label: 'Maximum range (θ = 45°)', exprHtml: 'R_max = u² ÷ g' },
    ],
    variables: [['R', 'Horizontal range (m)'], ['u', 'Launch speed (m s⁻¹)'], ['θ', 'Angle to horizontal (°)'], ['g', 'Gravity (10 m s⁻²)']],
    constants: ['g ≈ 10 m s⁻² (WAEC/JAMB standard)'],
    trap: 'Use sin(2θ), NOT sin²θ! At θ = 30°, sin 2θ = sin 60° = 0.866; maximum range occurs at θ = 45°.',
    worked: { qHtml: 'A ball is projected at 30 m s⁻¹ at 45° to the horizontal (g = 10 m s⁻²). Find its range.', stepsHtml: ['R = u² sin 90° ÷ g = 900 × 1 ÷ 10 = 90 m'], ansHtml: '90 m' },
    keywords: ['projectile', 'range', '45 degrees', 'parabola'],
  },
  {
    id: 'pf-newton-second',
    cat: 'mechanics',
    name: 'Newton’s Second Law & Impulse',
    topicId: 'p-newton',
    summary: 'Resultant external force equals mass times acceleration, or rate of change of momentum.',
    rearrangements: [
      { solveFor: 'F', label: 'Solve for net force (F)', exprHtml: 'F = ma = m(v − u) ÷ t' },
      { solveFor: 'I', label: 'Solve for impulse (I)', exprHtml: 'I = Ft = mv − mu' },
    ],
    variables: [['F', 'Resultant force (N)'], ['m', 'Mass (kg)'], ['a', 'Acceleration (m s⁻²)'], ['I', 'Impulse (N s)']],
    trap: 'If a ball rebounds in the opposite direction, change of velocity is v − (−u) = v + u, NOT v − u!',
    worked: { qHtml: 'A net force of 24 N acts on an 8 kg block. Find its acceleration.', stepsHtml: ['a = F ÷ m = 24 ÷ 8 = 3.0 m s⁻²'], ansHtml: '3.0 m s⁻²' },
    keywords: ['force', 'impulse', 'momentum', 'newton'],
  },
  {
    id: 'pf-moments',
    cat: 'mechanics',
    name: 'Principle of Moments (Rotational Equilibrium)',
    topicId: 'p-equilibrium',
    summary: 'For a balanced rigid beam, sum of clockwise moments about any pivot equals sum of anticlockwise moments.',
    rearrangements: [
      { solveFor: 'M', label: 'Turning moment (τ)', exprHtml: 'τ = F × d_⊥' },
      { solveFor: 'F₂', label: 'Balanced lever force', exprHtml: 'F₁ d₁ = F₂ d₂  ⇒  F₂ = (F₁ d₁) ÷ d₂' },
    ],
    variables: [['τ', 'Moment of force (N m)'], ['F', 'Applied force (N)'], ['d_⊥', 'Perpendicular distance from pivot (m or cm)']],
    trap: 'Measure distance d from the PIVOT (knife-edge), NOT from the 0 cm mark of the metre rule!',
    worked: { qHtml: 'A 40 N weight hangs 30 cm left of a pivot. What weight at 20 cm right balances the rule?', stepsHtml: ['F₂ × 20 = 40 × 30 = 1200 → F₂ = 60 N'], ansHtml: '60 N' },
    keywords: ['moment', 'torque', 'pivot', 'metre rule', 'equilibrium'],
  },
  {
    id: 'pf-pendulum',
    cat: 'mechanics',
    name: 'Period of a Simple Pendulum',
    topicId: 'p-shm',
    summary: 'Period of small oscillations depends only on pendulum length L and acceleration due to gravity g.',
    rearrangements: [
      { solveFor: 'T', label: 'Solve for period (T)', exprHtml: 'T = 2π √(L ÷ g)' },
      { solveFor: 'g', label: 'Solve for gravity (g)', exprHtml: 'g = 4π² L ÷ T²' },
    ],
    variables: [['T', 'Period of 1 oscillation (s)'], ['L', 'Effective length (m)'], ['g', 'Acceleration due to gravity (m s⁻²)']],
    trap: 'Doubling T requires multiplying length L by 4 (since T ∝ √L). Mass of the bob has ZERO effect on T!',
    worked: { qHtml: 'If a pendulum of length L has period 1.5 s, what is the period when length becomes 4L?', stepsHtml: ['T₂ ÷ T₁ = √(4L ÷ L) = 2 → T₂ = 2 × 1.5 = 3.0 s'], ansHtml: '3.0 s' },
    keywords: ['pendulum', 'oscillation', 'shm', 'period'],
  },
  {
    id: 'pf-gravitation',
    cat: 'mechanics',
    name: 'Escape Velocity & Gravitational Field',
    topicId: 'p-gravitation',
    summary: 'Minimum launch speed needed to escape a planet’s gravitational pull to infinity without propulsion.',
    rearrangements: [
      { solveFor: 'v_e', label: 'Escape velocity (v_e)', exprHtml: 'v_e = √(2gR) = √(2GM ÷ R)' },
      { solveFor: 'v_o', label: 'Close-orbit speed (v_o)', exprHtml: 'v_o = √(gR) = v_e ÷ √2' },
    ],
    variables: [['v_e', 'Escape speed (m s⁻¹)'], ['g', 'Surface gravity (m s⁻²)'], ['R', 'Planet radius (m)']],
    constants: ['Earth v_e ≈ 11.2 km s⁻¹'],
    trap: 'Escape speed v_e = √(2gR) is independent of the rocket’s own mass m!',
    worked: { qHtml: 'Take g = 10 m s⁻² and R = 6.4 × 10⁶ m. Find Earth’s escape speed.', stepsHtml: ['v_e = √(2 × 10 × 6.4 × 10⁶) = √(1.28 × 10⁸) ≈ 11,300 m s⁻¹ (11.3 km s⁻¹)'], ansHtml: '11.3 km s⁻¹' },
    keywords: ['escape velocity', 'satellite', 'orbit', 'gravity'],
  },

  /* ─────────────── 2. ENERGY, MACHINES, ELASTICITY & FLUIDS ─────────────── */
  {
    id: 'pf-ke-pe',
    cat: 'machines',
    name: 'Kinetic & Gravitational Potential Energy',
    topicId: 'p-work',
    summary: 'Mechanical energy of motion (½mv²) and elevation (mgh), conserved in frictionless fall.',
    rearrangements: [
      { solveFor: 'KE', label: 'Kinetic energy (E_k)', exprHtml: 'E_k = ½ m v²' },
      { solveFor: 'PE', label: 'Potential energy (E_p)', exprHtml: 'E_p = m g h' },
      { solveFor: 'v', label: 'Impact speed from height h', exprHtml: 'v = √(2gh)' },
    ],
    variables: [['E_k, E_p', 'Mechanical energy (J)'], ['m', 'Mass (kg)'], ['v', 'Speed (m s⁻¹)'], ['h', 'Vertical height (m)']],
    trap: 'Doubling velocity quadruples kinetic energy (2² = 4)! Convert mass in grams to kilograms first.',
    worked: { qHtml: 'Find the kinetic energy of a 2 kg body moving at 6 m s⁻¹.', stepsHtml: ['E_k = ½ × 2 × 6² = 36 J'], ansHtml: '36 J' },
    keywords: ['kinetic energy', 'potential energy', 'joules', 'work'],
  },
  {
    id: 'pf-machine-eff',
    cat: 'machines',
    name: 'Simple Machine Efficiency (MA & VR)',
    topicId: 'p-machines',
    summary: 'Connects Mechanical Advantage (L/E), Velocity Ratio (d_E/d_L), and percentage efficiency.',
    rearrangements: [
      { solveFor: 'η', label: 'Efficiency (%)', exprHtml: 'η = (MA ÷ VR) × 100%' },
      { solveFor: 'MA', label: 'Mechanical Advantage (MA)', exprHtml: 'MA = Load (L) ÷ Effort (E)' },
      { solveFor: 'E', label: 'Effort required (E)', exprHtml: 'E = (L × 100) ÷ (η × VR)' },
    ],
    variables: [['η', 'Efficiency (%)'], ['MA', 'Mechanical Advantage (no unit)'], ['VR', 'Velocity Ratio (no unit)'], ['L, E', 'Load & Effort (N)']],
    trap: 'VR depends purely on geometry (e.g. number of pulleys) and NEVER changes with friction; MA and η drop due to friction.',
    worked: { qHtml: 'A pulley block with VR = 5 lifts a 400 N load with 100 N effort. Find its efficiency.', stepsHtml: ['MA = 400 ÷ 100 = 4', 'η = (4 ÷ 5) × 100% = 80%'], ansHtml: '80%' },
    keywords: ['efficiency', 'mechanical advantage', 'velocity ratio', 'pulley'],
  },
  {
    id: 'pf-hooke-spring',
    cat: 'machines',
    name: 'Hooke’s Law & Elastic Strain Energy',
    topicId: 'p-elastic',
    summary: 'Below the proportional limit, extension e is proportional to tension F, storing ½Fe = ½ke².',
    rearrangements: [
      { solveFor: 'F', label: 'Tensile force (F)', exprHtml: 'F = k e' },
      { solveFor: 'W', label: 'Elastic energy stored (E)', exprHtml: 'E = ½ F e = ½ k e²' },
    ],
    variables: [['F', 'Applied load (N)'], ['k', 'Force constant (N m⁻¹)'], ['e', 'Extension l − l₀ (m)'], ['E', 'Strain energy (J)']],
    trap: 'Always convert extension e from cm or mm to metres, and remember the ½ factor in stored elastic energy ½Fe!',
    worked: { qHtml: 'A spring of constant 200 N m⁻¹ is stretched by 0.05 m. Find the energy stored.', stepsHtml: ['E = ½ × 200 × (0.05)² = 100 × 0.0025 = 0.25 J'], ansHtml: '0.25 J' },
    keywords: ['hooke', 'spring', 'extension', 'strain energy'],
  },
  {
    id: 'pf-young-modulus',
    cat: 'machines',
    name: 'Young’s Modulus of Elasticity',
    topicId: 'p-elastic',
    summary: 'Ratio of tensile stress (F/A) to tensile strain (e/L) within the elastic limit.',
    rearrangements: [
      { solveFor: 'Y', label: 'Young’s modulus (E)', exprHtml: 'E = (F L) ÷ (A e)' },
      { solveFor: 'e', label: 'Wire extension (e)', exprHtml: 'e = (F L) ÷ (A E)' },
    ],
    variables: [['E', 'Young’s modulus (N m⁻² or Pa)'], ['F', 'Load (N)'], ['L', 'Original length (m)'], ['A', 'Cross-sectional area (m²)'], ['e', 'Extension (m)']],
    trap: 'Strain e/L has NO units; Young’s modulus has the exact same SI unit as pressure/stress (Pa = N m⁻²).',
    worked: { qHtml: 'A 2 m wire of area 1.0 × 10⁻⁶ m² extends by 1.0 × 10⁻³ m under a 100 N load. Find E.', stepsHtml: ['E = (100 × 2) ÷ (10⁻⁶ × 10⁻³) = 200 ÷ 10⁻⁹ = 2.0 × 10¹¹ N m⁻²'], ansHtml: '2.0 × 10¹¹ N m⁻²' },
    keywords: ['young modulus', 'stress', 'strain', 'wire'],
  },
  {
    id: 'pf-hydro-pressure',
    cat: 'machines',
    name: 'Hydrostatic Liquid Pressure & Archimedes Upthrust',
    topicId: 'p-fluids',
    summary: 'Gauge pressure at depth h in a liquid of density ρ, and upward buoyant force on a displaced volume V.',
    rearrangements: [
      { solveFor: 'P', label: 'Liquid pressure (P)', exprHtml: 'P = h ρ g' },
      { solveFor: 'U', label: 'Upthrust (U)', exprHtml: 'U = V ρ_fluid g = W_air − W_fluid' },
      { solveFor: 'RD', label: 'Relative density (RD)', exprHtml: 'RD = W_air ÷ (W_air − W_water)' },
    ],
    variables: [['P', 'Pressure (Pa)'], ['h', 'Vertical depth (m)'], ['ρ', 'Fluid density (kg m⁻³)'], ['U', 'Upthrust (N)']],
    constants: ['ρ(water) = 1000 kg m⁻³'],
    trap: 'Total absolute pressure under water is P_atm + hρg, whereas pressure difference due to liquid alone is hρg.',
    worked: { qHtml: 'Find the liquid pressure 15 m below the surface of fresh water (ρ = 1000 kg m⁻³, g = 10 m s⁻²).', stepsHtml: ['P = 15 × 1000 × 10 = 150,000 Pa = 1.5 × 10⁵ Pa'], ansHtml: '1.5 × 10⁵ Pa' },
    keywords: ['pressure', 'upthrust', 'archimedes', 'relative density'],
  },

  /* ─────────────── 3. THERMAL PHYSICS ─────────────── */
  {
    id: 'pf-linear-exp',
    cat: 'thermal',
    name: 'Linear, Area & Cubic Thermal Expansivity',
    topicId: 'p-expansion',
    summary: 'Fractional increase in length per kelvin rise in temperature; area β = 2α and cubic γ = 3α.',
    rearrangements: [
      { solveFor: 'Δl', label: 'Expansion gap (Δl)', exprHtml: 'Δl = α l₁ Δθ' },
      { solveFor: 'α', label: 'Linear expansivity (α)', exprHtml: 'α = (l₂ − l₁) ÷ (l₁ Δθ)' },
      { solveFor: 'γ', label: 'Cubic expansivity (γ)', exprHtml: 'γ = 3α  ;  β = 2α' },
    ],
    variables: [['α', 'Linear expansivity (K⁻¹)'], ['l₁', 'Original length (m)'], ['Δθ', 'Temperature rise (K or °C)']],
    trap: 'Cubic expansivity γ of an isotropic metal is 3α (not α³)!',
    worked: { qHtml: 'A 20 m steel rail (α = 1.2 × 10⁻⁵ K⁻¹) warms by 25 °C. Find its expansion Δl.', stepsHtml: ['Δl = 1.2 × 10⁻⁵ × 20 × 25 = 0.006 m = 6.0 mm'], ansHtml: '6.0 mm' },
    keywords: ['expansivity', 'thermal expansion', 'linear', 'cubic'],
  },
  {
    id: 'pf-shc',
    cat: 'thermal',
    name: 'Specific Heat Capacity (Sensible Heat)',
    topicId: 'p-calorimetry',
    summary: 'Thermal energy absorbed or released when mass m changes temperature by Δθ without changing state.',
    rearrangements: [
      { solveFor: 'Q', label: 'Heat energy (Q)', exprHtml: 'Q = m c Δθ = I V t' },
      { solveFor: 'c', label: 'Specific heat capacity (c)', exprHtml: 'c = Q ÷ (m Δθ)' },
    ],
    variables: [['Q', 'Heat energy (J)'], ['m', 'Mass (kg)'], ['c', 'Specific heat capacity (J kg⁻¹ K⁻¹)'], ['Δθ', 'Temperature change (K or °C)']],
    constants: ['c(water) = 4200 J kg⁻¹ K⁻¹'],
    trap: 'Heat capacity C = mc is in J K⁻¹, whereas SPECIFIC heat capacity c is per unit mass (J kg⁻¹ K⁻¹).',
    worked: { qHtml: 'How much heat raises 0.5 kg of water (c = 4200 J kg⁻¹ K⁻¹) from 20 °C to 60 °C?', stepsHtml: ['Q = 0.5 × 4200 × (60 − 20) = 2100 × 40 = 84,000 J (84 kJ)'], ansHtml: '84 kJ' },
    keywords: ['specific heat', 'calorimetry', 'temperature'],
  },
  {
    id: 'pf-latent-heat',
    cat: 'thermal',
    name: 'Specific Latent Heat (Isothermal Phase Change)',
    topicId: 'p-calorimetry',
    summary: 'Heat absorbed or given out during melting or boiling at constant temperature.',
    rearrangements: [
      { solveFor: 'Q', label: 'Latent heat energy (Q)', exprHtml: 'Q = m L' },
      { solveFor: 'L', label: 'Specific latent heat (L)', exprHtml: 'L = Q ÷ m' },
    ],
    variables: [['Q', 'Heat energy (J)'], ['m', 'Mass changing state (kg)'], ['L', 'Specific latent heat (J kg⁻¹)']],
    constants: ['L_f(ice) = 3.36 × 10⁵ J kg⁻¹', 'L_v(steam) = 2.26 × 10⁶ J kg⁻¹'],
    trap: 'There is NO Δθ in Q = mL! If ice at 0 °C turns into warm water at θ °C, add BOTH mL_f AND mc_w θ.',
    worked: { qHtml: 'Find the heat needed to melt 0.20 kg of ice at 0 °C (L_f = 3.36 × 10⁵ J kg⁻¹).', stepsHtml: ['Q = m L_f = 0.20 × 3.36 × 10⁵ = 67,200 J = 67.2 kJ'], ansHtml: '67.2 kJ' },
    keywords: ['latent heat', 'fusion', 'vaporization', 'melting'],
  },
  {
    id: 'pf-gas-law',
    cat: 'thermal',
    name: 'General Gas Equation (Boyle’s, Charles’s & Pressure Law)',
    topicId: 'p-gas-laws',
    summary: 'Combines pressure, volume, and absolute Kelvin temperature for a fixed mass of ideal gas.',
    rearrangements: [
      { solveFor: 'V₂', label: 'Combined gas equation', exprHtml: '(P₁ V₁) ÷ T₁ = (P₂ V₂) ÷ T₂' },
      { solveFor: 'P₂', label: 'Boyle’s law (constant T)', exprHtml: 'P₁ V₁ = P₂ V₂' },
    ],
    variables: [['P₁, P₂', 'Absolute gas pressures (Pa, atm, or mmHg)'], ['V₁, V₂', 'Gas volumes (cm³ or m³)'], ['T₁, T₂', 'Absolute temperature T = θ(°C) + 273 (K)']],
    trap: 'NEVER substitute Celsius (°C) into gas laws — always convert T(K) = θ(°C) + 273 first!',
    worked: { qHtml: 'A gas occupies 300 cm³ at 27 °C. Find its volume at 127 °C at constant pressure.', stepsHtml: ['T₁ = 300 K, T₂ = 400 K', 'V₂ = 300 × (400 ÷ 300) = 400 cm³'], ansHtml: '400 cm³' },
    keywords: ['boyle', 'charles', 'kelvin', 'gas law'],
  },

  /* ─────────────── 4. WAVES, SOUND & OPTICS ─────────────── */
  {
    id: 'pf-wave-speed',
    cat: 'waves',
    name: 'Fundamental Wave Equation',
    topicId: 'p-waves',
    summary: 'Links wave propagation speed v to frequency f and wavelength λ for any mechanical or EM wave.',
    rearrangements: [
      { solveFor: 'v', label: 'Wave speed (v)', exprHtml: 'v = f λ' },
      { solveFor: 'λ', label: 'Wavelength (λ)', exprHtml: 'λ = v ÷ f' },
      { solveFor: 'f', label: 'Frequency (f)', exprHtml: 'f = 1 ÷ T = v ÷ λ' },
    ],
    variables: [['v', 'Wave speed (m s⁻¹)'], ['f', 'Frequency (Hz)'], ['λ', 'Wavelength (m)'], ['T', 'Period (s)']],
    constants: ['c(light in vacuum) = 3.0 × 10⁸ m s⁻¹'],
    trap: 'When a wave refracts into a new medium, frequency f stays CONSTANT while v and λ change together!',
    worked: { qHtml: 'A radio station broadcasts at 100 MHz (c = 3.0 × 10⁸ m s⁻¹). Find the wavelength.', stepsHtml: ['λ = (3.0 × 10⁸) ÷ (1.0 × 10⁸) = 3.0 m'], ansHtml: '3.0 m' },
    keywords: ['wavelength', 'frequency', 'wave speed', 'hertz'],
  },
  {
    id: 'pf-echo-sonar',
    cat: 'waves',
    name: 'Echo & Sonar Reflection Distance',
    topicId: 'p-sound',
    summary: 'Calculates cliff distance or seabed depth from round-trip echo reflection time t.',
    rearrangements: [
      { solveFor: 'd', label: 'Distance to reflector (d)', exprHtml: 'd = (v × t) ÷ 2' },
      { solveFor: 'v', label: 'Speed of sound (v)', exprHtml: 'v = (2 d) ÷ t' },
    ],
    variables: [['d', 'One-way distance to cliff/seabed (m)'], ['v', 'Speed of sound (m s⁻¹)'], ['t', 'Round-trip echo time (s)']],
    trap: 'Sound travels out AND back (total distance = 2d), so forgetting to divide vt by 2 doubles the true answer!',
    worked: { qHtml: 'An echo returns from a cliff in 2.5 s when v = 340 m s⁻¹. How far away is the cliff?', stepsHtml: ['d = (340 × 2.5) ÷ 2 = 425 m'], ansHtml: '425 m' },
    keywords: ['echo', 'sonar', 'sound', 'ultrasound'],
  },
  {
    id: 'pf-snell-refraction',
    cat: 'waves',
    name: 'Snell’s Law, Apparent Depth & Critical Angle',
    topicId: 'p-refraction',
    summary: 'Connects refractive index n to angles, wave speeds, apparent depth, and critical angle C.',
    rearrangements: [
      { solveFor: 'n', label: 'Snell’s law & real/apparent depth', exprHtml: 'n = sin i ÷ sin r = Real depth ÷ Apparent depth' },
      { solveFor: 'sin C', label: 'Critical angle (C)', exprHtml: 'sin C = 1 ÷ n' },
    ],
    variables: [['n', 'Refractive index (no unit)'], ['i, r', 'Angles to the NORMAL (°)'], ['C', 'Critical angle in denser medium (°)']],
    trap: 'Always measure i and r from the NORMAL, never from the glass/water surface! Apparent shift = Real − Apparent depth.',
    worked: { qHtml: 'A pool of water (n = 4/3) is 2.4 m deep. Find its apparent depth viewed vertically.', stepsHtml: ['Apparent depth = Real depth ÷ n = 2.4 ÷ (4/3) = 1.8 m'], ansHtml: '1.8 m' },
    keywords: ['snell', 'refractive index', 'critical angle', 'apparent depth'],
  },
  {
    id: 'pf-mirror-lens',
    cat: 'waves',
    name: 'Mirror / Thin Lens Formula & Linear Magnification',
    topicId: 'p-lenses',
    summary: 'Real-is-positive optical equation linking focal length f, object distance u, and image distance v.',
    rearrangements: [
      { solveFor: '1/f', label: 'Mirror / Lens equation', exprHtml: '1/f = 1/u + 1/v  ⇒  f = (uv) ÷ (u + v)' },
      { solveFor: 'M', label: 'Linear magnification (M)', exprHtml: 'M = |v| ÷ u = h_i ÷ h_o' },
      { solveFor: 'P', label: 'Optical power in dioptres (P)', exprHtml: 'P = 1 ÷ f(m) = 100 ÷ f(cm)' },
    ],
    variables: [['f', 'Focal length (cm or m)'], ['u', 'Object distance (cm)'], ['v', 'Image distance (cm)'], ['P', 'Lens power (D)']],
    trap: 'In Real-is-Positive convention: diverging lens & convex mirror have NEGATIVE f, and virtual images have NEGATIVE v!',
    worked: { qHtml: 'An object is placed 30 cm from a converging lens of focal length 10 cm. Find v.', stepsHtml: ['1/v = 1/10 − 1/30 = 2/30 = 1/15 → v = 15 cm (real)'], ansHtml: '15 cm' },
    keywords: ['lens', 'mirror', 'focal length', 'magnification', 'dioptre'],
  },

  /* ─────────────── 5. ELECTRICITY, MAGNETISM & AC ─────────────── */
  {
    id: 'pf-coulomb',
    cat: 'electricity',
    name: 'Coulomb’s Inverse-Square Law & Electric Field',
    topicId: 'p-electrostatics',
    summary: 'Electrostatic force between two point charges Q₁ and Q₂ separated by distance r.',
    rearrangements: [
      { solveFor: 'F', label: 'Electrostatic force (F)', exprHtml: 'F = k Q₁ Q₂ ÷ r²' },
      { solveFor: 'E', label: 'Electric field intensity (E)', exprHtml: 'E = F ÷ q = V ÷ d' },
    ],
    variables: [['F', 'Force (N)'], ['Q₁, Q₂', 'Charges (C)'], ['r', 'Separation (m)'], ['E', 'Field strength (N C⁻¹ or V m⁻¹)']],
    constants: ['k = 1/(4πε₀) = 9.0 × 10⁹ N m² C⁻²'],
    trap: 'Remember μC = 10⁻⁶ C and r is SQUARED in the denominator: tripling distance reduces force to 1/9!',
    worked: { qHtml: 'Plates 0.02 m apart have PD = 400 V across them. Find uniform electric field E.', stepsHtml: ['E = V ÷ d = 400 ÷ 0.02 = 20,000 V m⁻¹ (2.0 × 10⁴ V m⁻¹)'], ansHtml: '2.0 × 10⁴ V m⁻¹' },
    keywords: ['coulomb', 'charge', 'electric field', 'electrostatics'],
  },
  {
    id: 'pf-capacitors',
    cat: 'electricity',
    name: 'Capacitance, Stored Energy & Series/Parallel Rules',
    topicId: 'p-efield-cap',
    summary: 'Charge Q = CV, electrostatic energy ½CV², and network combinations of capacitors.',
    rearrangements: [
      { solveFor: 'Q', label: 'Charge on capacitor (Q)', exprHtml: 'Q = C V' },
      { solveFor: 'W', label: 'Energy stored (W)', exprHtml: 'W = ½ C V² = ½ Q V = Q² ÷ (2C)' },
      { solveFor: 'C_eq', label: 'Parallel vs Series C', exprHtml: 'C_par = C₁ + C₂  ;  1/C_ser = 1/C₁ + 1/C₂' },
    ],
    variables: [['C', 'Capacitance (F or μF)'], ['V', 'Potential difference (V)'], ['Q', 'Charge (C)'], ['W', 'Stored energy (J)']],
    trap: 'Capacitor rules are the EXACT OPPOSITE of resistor rules: parallel capacitors ADD (C₁ + C₂)!',
    worked: { qHtml: 'Find the energy stored in a 10 μF capacitor charged to 100 V.', stepsHtml: ['W = ½ × (10 × 10⁻⁶) × 100² = 5 × 10⁻⁶ × 10,000 = 0.05 J'], ansHtml: '0.05 J' },
    keywords: ['capacitor', 'farad', 'microfarad', 'energy'],
  },
  {
    id: 'pf-ohm-resistivity',
    cat: 'electricity',
    name: 'Ohm’s Law, Resistivity & Resistor Networks',
    topicId: 'p-dc-circuits',
    summary: 'Relates voltage V, current I, resistance R, and wire resistivity ρ = RA/L.',
    rearrangements: [
      { solveFor: 'V', label: 'Ohm’s law', exprHtml: 'V = I R' },
      { solveFor: 'R', label: 'Wire resistance from resistivity', exprHtml: 'R = ρ L ÷ A' },
      { solveFor: 'R_par', label: 'Two parallel resistors', exprHtml: 'R_eq = (R₁ R₂) ÷ (R₁ + R₂)' },
    ],
    variables: [['V', 'Potential difference (V)'], ['I', 'Current (A)'], ['R', 'Resistance (Ω)'], ['ρ', 'Resistivity (Ω m)']],
    trap: 'Doubling a wire’s diameter quadruples its area A (πd²/4), cutting resistance R to ONE-QUARTER (R/4)!',
    worked: { qHtml: 'Find the combined resistance of 6 Ω and 12 Ω connected in parallel.', stepsHtml: ['R_eq = (6 × 12) ÷ (6 + 12) = 72 ÷ 18 = 4.0 Ω'], ansHtml: '4.0 Ω' },
    keywords: ['ohm', 'resistance', 'resistivity', 'parallel', 'series'],
  },
  {
    id: 'pf-cell-emf',
    cat: 'electricity',
    name: 'Cell EMF, Terminal PD & Internal Resistance',
    topicId: 'p-dc-circuits',
    summary: 'Accounts for lost volts Ir inside a battery of electromotive force E and internal resistance r.',
    rearrangements: [
      { solveFor: 'I', label: 'Circuit current (I)', exprHtml: 'I = E ÷ (R + r)' },
      { solveFor: 'V', label: 'Terminal potential difference (V)', exprHtml: 'V = E − I r = I R' },
    ],
    variables: [['E', 'Electromotive force (V)'], ['V', 'Terminal PD across load (V)'], ['r', 'Internal resistance (Ω)'], ['R', 'External load resistance (Ω)']],
    trap: 'Identical cells in PARALLEL keep the same EMF E, while effective internal resistance drops to r/n!',
    worked: { qHtml: 'A cell of EMF 1.5 V and internal resistance 0.5 Ω drives a 2.5 Ω resistor. Find terminal PD.', stepsHtml: ['I = 1.5 ÷ (2.5 + 0.5) = 0.5 A', 'V = I R = 0.5 × 2.5 = 1.25 V'], ansHtml: '1.25 V' },
    keywords: ['emf', 'internal resistance', 'lost volts', 'battery'],
  },
  {
    id: 'pf-elec-power',
    cat: 'electricity',
    name: 'Electrical Power, Joule Heating & kWh Tariff',
    topicId: 'p-elec-meas',
    summary: 'Computes electrical power P, heating energy I²Rt, and household kilowatt-hour billing.',
    rearrangements: [
      { solveFor: 'P', label: 'Electrical power (P)', exprHtml: 'P = I V = I² R = V² ÷ R' },
      { solveFor: 'W', label: 'Joule heat energy (W)', exprHtml: 'W = I V t = I² R t' },
      { solveFor: 'Units', label: 'Energy in kWh', exprHtml: 'kWh = Power(kW) × Time(hours)' },
    ],
    variables: [['P', 'Power (W)'], ['W', 'Electrical energy (J)'], ['t', 'Time (s for J; hours for kWh)']],
    constants: ['1 kWh = 3.6 × 10⁶ J'],
    trap: 'Divide watts by 1000 to get kW BEFORE multiplying by hours for utility tariff bills!',
    worked: { qHtml: 'A 2000 W kettle runs for 3 hours at ₦50 per kWh. Find the cost.', stepsHtml: ['Energy = 2.0 kW × 3 h = 6 kWh', 'Cost = 6 × ₦50 = ₦300'], ansHtml: '₦300' },
    keywords: ['power', 'kilowatt hour', 'fuse', 'joule heating'],
  },
  {
    id: 'pf-transformer',
    cat: 'electricity',
    name: 'Transformer Turns Ratio & Efficiency',
    topicId: 'p-induction',
    summary: 'Relates secondary/primary AC voltages, turns ratio, and currents in step-up/step-down transformers.',
    rearrangements: [
      { solveFor: 'V_s', label: 'Voltage–turns relation', exprHtml: 'V_s ÷ V_p = N_s ÷ N_p' },
      { solveFor: 'η', label: 'Transformer efficiency (η)', exprHtml: 'η = (I_s V_s) ÷ (I_p V_p) × 100%' },
    ],
    variables: [['V_p, V_s', 'Primary & secondary AC voltages (V)'], ['N_p, N_s', 'Primary & secondary coil turns'], ['I_p, I_s', 'Primary & secondary currents (A)']],
    trap: 'Transformers NEVER work on steady DC! Only when η = 100% (ideal) can you set I_p/I_s = N_s/N_p directly.',
    worked: { qHtml: 'A transformer with N_p = 1000 and N_s = 50 is connected to 240 V AC. Find V_s.', stepsHtml: ['V_s = 240 × (50 ÷ 1000) = 12 V'], ansHtml: '12 V' },
    keywords: ['transformer', 'turns ratio', 'induction', 'step down'],
  },
  {
    id: 'pf-ac-rlc',
    cat: 'electricity',
    name: 'AC Reactance, Impedance & RLC Resonance',
    topicId: 'p-ac-circuits',
    summary: 'Computes inductive/capacitive reactance, total series RLC impedance Z, and resonance frequency f₀.',
    rearrangements: [
      { solveFor: 'Z', label: 'Series RLC impedance (Z)', exprHtml: 'Z = √[ R² + (X_L − X_C)² ]' },
      { solveFor: 'X', label: 'Reactances X_L & X_C', exprHtml: 'X_L = 2πfL  ;  X_C = 1 ÷ (2πfC)' },
      { solveFor: 'f₀', label: 'Resonance frequency (X_L = X_C)', exprHtml: 'f₀ = 1 ÷ (2π √(LC))' },
    ],
    variables: [['Z', 'Impedance (Ω)'], ['X_L, X_C', 'Inductive & capacitive reactances (Ω)'], ['f₀', 'Resonant frequency (Hz)']],
    trap: 'Impedance adds by Pythagoras √(R² + X²), NEVER R + X_L + X_C! At resonance, Z = R and power factor cos φ = 1.',
    worked: { qHtml: 'In a series RLC circuit, R = 8 Ω, X_L = 10 Ω, and X_C = 4 Ω. Find impedance Z.', stepsHtml: ['Z = √(8² + (10 − 4)²) = √(64 + 36) = √100 = 10 Ω'], ansHtml: '10 Ω' },
    keywords: ['impedance', 'reactance', 'resonance', 'ac circuit', 'rms'],
  },

  /* ─────────────── 6. MODERN, ATOMIC & NUCLEAR PHYSICS ─────────────── */
  {
    id: 'pf-photoelectric',
    cat: 'modern',
    name: 'Einstein’s Photoelectric Equation',
    topicId: 'p-atomic-quantum',
    summary: 'Incident photon energy hf splits into metal work function W₀ = hf₀ plus max photoelectron kinetic energy.',
    rearrangements: [
      { solveFor: 'K_max', label: 'Max photoelectron KE', exprHtml: 'K_max = hf − W₀ = e V_s' },
      { solveFor: 'E', label: 'Photon energy (E)', exprHtml: 'E = hf = hc ÷ λ' },
    ],
    variables: [['h', 'Planck constant (6.6 × 10⁻³⁴ J s)'], ['f, f₀', 'Incident & threshold frequencies (Hz)'], ['W₀', 'Work function (J or eV)'], ['V_s', 'Stopping potential (V)']],
    constants: ['1 eV = 1.6 × 10⁻¹⁹ J', 'h = 6.63 × 10⁻³⁴ J s'],
    trap: 'Increasing light INTENSITY emits MORE electrons per second, but NEVER increases K_max — only higher frequency f increases K_max!',
    worked: { qHtml: 'Photons of energy 5.2 eV strike sodium of work function 2.3 eV. Find K_max and stopping potential V_s.', stepsHtml: ['K_max = 5.2 − 2.3 = 2.9 eV', 'Stopping potential V_s = 2.9 V'], ansHtml: '2.9 eV (V_s = 2.9 V)' },
    keywords: ['photoelectric', 'work function', 'planck', 'photon', 'stopping potential'],
  },
  {
    id: 'pf-half-life',
    cat: 'modern',
    name: 'Radioactive Half-Life & Decay Constant',
    topicId: 'p-nuclear',
    summary: 'Calculates undecayed fraction N/N₀ after n half-lives and links half-life T₁/₂ to decay constant λ.',
    rearrangements: [
      { solveFor: 'N', label: 'Remaining nuclei / mass after n half-lives', exprHtml: 'N = N₀ × (½)ⁿ   where n = t ÷ T₁/₂' },
      { solveFor: 'T₁/₂', label: 'Half-life from decay constant', exprHtml: 'T₁/₂ = 0.693 ÷ λ' },
    ],
    variables: [['N, N₀', 'Remaining & initial mass/count'], ['T₁/₂', 'Half-life'], ['t', 'Elapsed time'], ['λ', 'Decay constant (s⁻¹)']],
    trap: 'If a question asks for the fraction that HAS DECAYED, compute 1 − (½)ⁿ (e.g., after 3 half-lives, 1/8 remains so 7/8 has decayed)!',
    worked: { qHtml: 'A 64 g radioactive sample has half-life 5 days. How much remains undecayed after 20 days?', stepsHtml: ['n = 20 ÷ 5 = 4 half-lives', 'N = 64 × (½)⁴ = 64 ÷ 16 = 4 g'], ansHtml: '4 g' },
    keywords: ['half-life', 'radioactivity', 'decay constant', 'nuclear'],
  },
  {
    id: 'pf-mass-energy',
    cat: 'modern',
    name: 'Einstein Mass–Energy Equivalence (Binding Energy)',
    topicId: 'p-nuclear',
    summary: 'Converts nuclear mass defect Δm directly into binding or fission/fusion energy ΔE = Δmc².',
    rearrangements: [
      { solveFor: 'ΔE', label: 'Nuclear energy released (ΔE)', exprHtml: 'ΔE = Δm c²' },
      { solveFor: 'Δm', label: 'Mass defect (Δm)', exprHtml: 'Δm = ΔE ÷ c²' },
    ],
    variables: [['ΔE', 'Energy released (J)'], ['Δm', 'Mass defect (kg)'], ['c', 'Speed of light (3.0 × 10⁸ m s⁻¹)']],
    constants: ['c² = 9.0 × 10¹⁶ m² s⁻²', '1 u = 931.5 MeV'],
    trap: 'Convert Δm from grams to KILOGRAMS before multiplying by c² = 9.0 × 10¹⁶ to obtain energy in joules!',
    worked: { qHtml: 'Find the energy in joules released when a mass defect of 2.0 × 10⁻⁵ kg is annihilated (c = 3.0 × 10⁸ m s⁻¹).', stepsHtml: ['ΔE = (2.0 × 10⁻⁵) × (3.0 × 10⁸)² = 2.0 × 10⁻⁵ × 9.0 × 10¹⁶ = 1.8 × 10¹² J'], ansHtml: '1.8 × 10¹² J' },
    keywords: ['mass defect', 'binding energy', 'fission', 'fusion', 'einstein'],
  },
];
