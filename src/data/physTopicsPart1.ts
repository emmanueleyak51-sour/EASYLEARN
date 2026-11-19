import type { Topic } from '../types';

export const PHYS_TOPICS_PART1: Topic[] = [
  // 1. Units, Dimensions & Precision Measurement
  {
    id: 'p-units',
    name: 'Units, Dimensions & Precision Measurement',
    sec: 'SS 1 · First Term · Mechanics & Matter',
    boss: 'Units, Dimensions & Instruments Test',
    goals: [
      'Distinguish fundamental SI quantities from derived quantities and derive dimensional formulas [MᵃLᵇTᶜ]',
      'Read Vernier callipers (least count 0.01 cm) and micrometer screw gauges (least count 0.01 mm) including zero-error corrections',
    ],
    trap: 'Never mix cm and mm when adding main-scale and Vernier/thimble readings—convert both scales to the same unit BEFORE adding!',
    parts: [
      {
        title: 'Fundamental vs Derived Quantities & Dimensional Analysis',
        idea: 'Every mechanical quantity is built from Mass [M], Length [L], and Time [T]. Two physical terms can only be added, subtracted, or equated if their dimensions match identically.',
        rules: [
          '7 SI base units: metre (m), kilogram (kg), second (s), ampere (A), kelvin (K), mole (mol), candela (cd).',
          'Force F = ma → [MLT⁻²]; Work/Energy W = Fd → [ML²T⁻²]; Pressure P = F/A → [ML⁻¹T⁻²]; Power → [ML²T⁻³].',
          'Dimensionless quantities (pure ratios): refractive index n, strain, relative density, mechanical advantage, angle in radians.',
        ],
        ex: {
          q: 'Find the dimensional formula of gravitational constant G from Newton’s law F = Gm₁m₂ / r².',
          steps: [
            ['Make G the subject: G = F r² / (m₁ m₂)', 'Isolate G before substituting dimensions.'],
            ['Substitute [F] = MLT⁻², [r²] = L², [m₁m₂] = M²', 'G = (MLT⁻² × L²) / M² = M⁻¹L³T⁻².'],
          ],
          why: [
            0,
            'Why does the numerical constant 2π in T = 2π√(l/g) disappear during dimensional analysis?',
            [
              'Pure numbers and trigonometric ratios have no physical units or dimensions ([1])',
              '2π has dimensions of time [T]',
              'π cancels out gravity g',
            ],
            [
              'Spot on! Pure numerical constants are dimensionless, so dimensional analysis checks form, not numerical factors.',
              '2π is a pure number without units.',
              'g has dimensions LT⁻² and does not cancel π.',
            ],
          ],
        },
        tryit: {
          q: 'Which of the following pairs of physical quantities have the EXACT same dimensions [ML⁻¹T⁻²]?',
          o: [
            'Pressure and Young’s modulus',
            'Work and Power',
            'Impulse and Force',
            'Surface tension and Viscosity',
          ],
          a: 0,
          h: 'Young’s modulus = tensile stress / tensile strain, and strain is dimensionless!',
          e: 'Both Pressure (F/A) and Stress / Young’s modulus have units N m⁻² and dimensions [ML⁻¹T⁻²].',
        },
      },
      {
        title: 'Vernier Callipers & Micrometer Screw Gauge',
        idea: 'Vernier callipers measure internal/external diameters to 0.01 cm (0.1 mm), while a micrometer screw gauge measures thin wires and sheets to 0.01 mm (0.001 cm).',
        rules: [
          'Vernier reading = Main scale reading (just before Vernier zero) + (coinciding Vernier mark × 0.01 cm).',
          'Micrometer reading = Sleeve reading (mm, including 0.5 mm half-marks) + (Thimble division × 0.01 mm).',
          'Actual reading = Observed reading − Zero error (subtract positive zero error; add magnitude of negative zero error).',
        ],
        ex: {
          q: 'A micrometer screw gauge shows 3.5 mm on the sleeve and the 28th division on the circular thimble aligns with the datum line. Find the diameter of the wire.',
          steps: [
            ['Sleeve reading = 3.50 mm', 'Note the visible half-millimetre mark past 3 mm.'],
            ['Thimble reading = 28 × 0.01 mm = 0.28 mm', 'Multiply thimble mark by 0.01 mm least count.'],
            ['Total diameter = 3.50 + 0.28 = 3.78 mm', 'Sum both readings in millimetres.'],
          ],
        },
        tryit: {
          q: 'On a Vernier calliper, the main scale reads 2.4 cm before the Vernier zero, and the 7th Vernier division coincides with a main scale mark. What is the reading?',
          o: ['2.47 cm', '2.74 cm', '2.407 cm', '3.10 cm'],
          a: 0,
          h: 'Each Vernier division adds 0.01 cm.',
          e: 'Reading = 2.4 cm + (7 × 0.01 cm) = 2.47 cm.',
        },
      },
    ],
    spot: {
      part: 1,
      who: 'Kunle',
      q: 'Kunle reads a Vernier calliper with main scale 4.2 cm and 6th Vernier mark coinciding.',
      lines: [
        'Main scale = 4.2 cm',
        'Vernier fraction = 6 × 0.1 cm = 0.6 cm',
        'Total reading = 4.2 + 0.6 = 4.8 cm',
      ],
      bad: 1,
      okfb: ['Main scale is correct.', '', 'Follows from line 2.'],
      o: [
        'Vernier least count is 0.01 cm (0.1 mm), NOT 0.1 cm!',
        'He should multiply 4.2 by 6',
        'Vernier callipers measure in kg',
      ],
      a: 0,
      fb: [
        'Exactly! 6 × 0.01 cm = 0.06 cm, giving 4.26 cm.',
        'Never multiply main and Vernier scales.',
        'Callipers measure length.',
      ],
      h: ['Check the least count in cm vs mm.'],
      fix: 'Vernier fraction = 6 × 0.01 cm = 0.06 cm → Total = 4.26 cm.',
    },
    qs: [
      { l: 1, dx: 1, q: 'Which of the following is a fundamental SI unit?', o: ['Kelvin (K)', 'Newton (N)', 'Joule (J)', 'Pascal (Pa)'], a: 0, e: 'Kelvin is the SI base unit of thermodynamic temperature; N, J, and Pa are derived units.' },
      { l: 2, q: 'What is the dimensional formula of impulse (F × t)?', o: ['MLT⁻¹', 'MLT⁻²', 'ML²T⁻²', 'ML⁻¹T⁻¹'], a: 0, e: '[Impulse] = [MLT⁻²][T] = MLT⁻¹, identical to linear momentum.' },
      { l: 3, q: 'Which instrument is most suitable for measuring the diameter of a thin SWG 28 copper wire to 0.01 mm accuracy?', o: ['Micrometer screw gauge', 'Metre rule', 'Vernier callipers', 'Pair of dividers'], a: 0, e: 'A micrometer screw gauge has a 0.01 mm least count, ideal for thin wires.' },
      { l: 3, q: 'What are the dimensions of power (Work ÷ Time)?', o: ['ML²T⁻³', 'ML²T⁻²', 'MLT⁻³', 'M²LT⁻²'], a: 0, e: '[Power] = [ML²T⁻²] ÷ [T] = ML²T⁻³.' },
      { l: 4, q: 'A micrometer has a positive zero error of +0.03 mm. When measuring a ball bearing it reads 5.42 mm. What is the true diameter?', o: ['5.39 mm', '5.45 mm', '5.12 mm', '5.42 mm'], a: 0, e: 'True reading = Observed − (+0.03) = 5.42 − 0.03 = 5.39 mm.' },
      { l: 5, q: 'The velocity v of a transverse wave on a stretched string depends on tension T and mass per unit length μ as v = Tᵃ μᵇ. Find (a, b).', o: ['(1/2, −1/2)', '(1, −1)', '(1/2, 1/2)', '(2, −1)'], a: 0, e: '[LT⁻¹] = [MLT⁻²]ᵃ [ML⁻¹]ᵇ ⇒ a + b = 0, −2a = −1 ⇒ a = 1/2, b = −1/2 (v = √(T/μ)).' },
    ],
  },

  // 2. Kinematics, Equations of Motion & Friction
  {
    id: 'p-motion',
    name: 'Kinematics, Motion Graphs & Solid Friction',
    sec: 'SS 1 · First Term · Mechanics & Matter',
    boss: 'Motion, Graphs & Friction Test',
    goals: [
      'Apply the equations of uniformly accelerated motion (v = u + at, s = ut + ½at², v² = u² + 2as) and interpret v–t graphs',
      'Calculate limiting static and kinetic friction (F = μR) on horizontal and inclined surfaces',
    ],
    trap: 'On a velocity–time (v–t) graph, gradient gives ACCELERATION while total area under the graph gives DISTANCE/DISPLACEMENT—never swap them!',
    parts: [
      {
        title: 'Uniform Acceleration & Velocity–Time Graphs',
        idea: 'When acceleration a is constant, SUVAT equations link u, v, a, s, and t. For vertical projection, take upward as positive and a = −g = −10 m s⁻².',
        g: ['physForce', { mode: 'vtgraph' }],
        cap: 'Trapezium velocity–time graph: slope = acceleration, shaded area = total distance travelled.',
        rules: [
          'v = u + at;  s = ½(u + v)t;  s = ut + ½at²;  v² = u² + 2as.',
          'Body dropped from rest (u = 0): h = ½gt² and v = √(2gh).',
          'Area of a trapezium v–t graph (accelerate, cruise, decelerate) = ½(sum of parallel time bases) × Vmax.',
        ],
        ex: {
          q: 'A car accelerates uniformly from rest to 20 m s⁻¹ in 5 s, maintains 20 m s⁻¹ for 12 s, and brakes uniformly to rest in 3 s. Find the total distance covered.',
          steps: [
            ['Total base T₁ = 5 + 12 + 3 = 20 s; cruise top T₂ = 12 s', 'Identify parallel sides of the v–t trapezium.'],
            ['Distance = ½(T₁ + T₂) × V = ½(20 + 12) × 20', 'Area = 16 × 20 = 320 m.'],
          ],
        },
        tryit: {
          q: 'A stone is thrown vertically upwards with initial speed 30 m s⁻¹ (g = 10 m s⁻²). What maximum height does it reach?',
          o: ['45 m', '30 m', '60 m', '90 m'],
          a: 0,
          h: 'At maximum height, v = 0. Use v² = u² − 2gh.',
          e: '0 = 30² − 2(10)h ⇒ 20h = 900 ⇒ h = 45 m.',
        },
      },
      {
        title: 'Solid Friction & Inclined Planes',
        idea: 'Limiting friction F = μR opposes relative sliding between surfaces in contact, independent of apparent area of contact.',
        g: ['physForce', { mode: 'incline' }],
        cap: 'Block on rough incline θ: weight component mg sin θ pulls down-slope while R = mg cos θ.',
        rules: [
          'On a flat floor with horizontal pull: R = mg, so Fmax = μmg.',
          'Static coefficient μs > dynamic/kinetic coefficient μk.',
          'If a block is just about to slide down a rough plane of angle θ under gravity alone: μ = tan θ!',
        ],
        ex: {
          q: 'A 15 kg wooden box rests on a horizontal floor (g = 10 m s⁻²). If a horizontal force of 45 N just starts moving it, find the coefficient of static friction μ.',
          steps: [
            ['Normal reaction R = mg = 15 × 10 = 150 N', 'Vertical equilibrium on horizontal floor.'],
            ['μ = F / R = 45 / 150 = 0.30', 'Coefficient of friction is dimensionless (no unit).'],
          ],
        },
        tryit: {
          q: 'A block placed on a rough board just begins to slide when the board is tilted to 30° to the horizontal. What is μ?',
          o: ['0.58 (1/√3)', '0.50', '0.87', '1.00'],
          a: 0,
          h: 'At the angle of repose θ, μ = tan θ.',
          e: 'μ = tan 30° = 1/√3 ≈ 0.577 ≈ 0.58.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'A car starts from rest and accelerates uniformly at 4 m s⁻² for 6 s. Find its distance travelled.', o: ['72 m', '24 m', '48 m', '144 m'], a: 0, e: 's = ut + ½at² = 0 + ½(4)(6²) = 2 × 36 = 72 m.' },
      { l: 2, q: 'What physical quantity is represented by the slope (gradient) of a velocity–time graph?', o: ['Acceleration', 'Displacement', 'Impulse', 'Jerk'], a: 0, e: 'Gradient = Δv / Δt = acceleration.' },
      { l: 3, q: 'A mango falls from rest from a branch 20 m high (g = 10 m s⁻²). With what speed does it hit the ground?', o: ['20 m s⁻¹', '10 m s⁻¹', '40 m s⁻¹', '14.1 m s⁻¹'], a: 0, e: 'v = √(2gh) = √(2 × 10 × 20) = √400 = 20 m s⁻¹.' },
      { l: 3, q: 'Which statement about solid friction is FALSE?', o: ['Limiting friction increases directly with surface area of contact', 'Friction opposes relative motion between surfaces', 'Static friction exceeds dynamic friction', 'Lubrication and ball bearings reduce friction'], a: 0, e: 'Limiting friction depends on normal reaction R and nature of surfaces, NOT area of contact.' },
      { l: 4, q: 'A 10 kg mass is pulled horizontally along a rough floor (μ = 0.25, g = 10 m s⁻²) by a 45 N force. What is its acceleration?', o: ['2.0 m s⁻²', '4.5 m s⁻²', '2.5 m s⁻²', '7.0 m s⁻²'], a: 0, e: 'Friction Ff = μmg = 0.25 × 100 = 25 N. Net force = 45 − 25 = 20 N ⇒ a = 20 / 10 = 2.0 m s⁻².' },
      { l: 5, q: 'A train travelling at 30 m s⁻¹ decelerates uniformly to 10 m s⁻¹ over a distance of 160 m. Find the magnitude of its retardation.', o: ['2.5 m s⁻²', '5.0 m s⁻²', '1.25 m s⁻²', '4.0 m s⁻²'], a: 0, e: 'v² = u² + 2as ⇒ 100 = 900 + 320a ⇒ 320a = −800 ⇒ a = −2.5 m s⁻².' },
    ],
  },

  // 3. Scalars, Vectors & Relative Motion
  {
    id: 'p-vectors',
    name: 'Scalars, Vectors & Resultant Forces',
    sec: 'SS 1 · First Term · Mechanics & Matter',
    boss: 'Vectors & Resultants Test',
    goals: [
      'Classify physical quantities into scalars and vectors',
      'Find resultants using Pythagoras, the Parallelogram Law R² = P² + Q² + 2PQ cos θ, and rectangular components (F cos θ, F sin θ)',
    ],
    trap: 'In the Parallelogram Law R² = P² + Q² + 2PQ cos θ, the sign before 2PQ cos θ is PLUS (+) when θ is the angle between tail-to-tail vectors!',
    parts: [
      {
        title: 'Scalars vs Vectors & Parallelogram Law',
        idea: 'Scalars have magnitude only (mass, speed, energy, pressure, electric potential); vectors have both magnitude and direction (displacement, velocity, force, momentum, electric field).',
        g: ['physForce', { mode: 'parallelogram' }],
        cap: 'Parallelogram law of vectors: diagonal R from common tail gives resultant of P and Q at angle θ.',
        rules: [
          'Maximum resultant (θ = 0°, same direction): Rmax = P + Q.',
          'Minimum resultant (θ = 180°, opposite): Rmin = |P − Q|.',
          'Perpendicular vectors (θ = 90°): R = √(P² + Q²) at tan α = Q / P.',
          'General angle θ between tails: R = √(P² + Q² + 2PQ cos θ).',
        ],
        ex: {
          q: 'Two forces of 6 N and 8 N act at a point at right angles (90°) to each other. Find the magnitude of their resultant.',
          steps: [
            ['Since θ = 90°, cos 90° = 0', 'Use R = √(P² + Q²).'],
            ['R = √(6² + 8²) = √(36 + 64) = √100 = 10 N', 'Classic 6–8–10 Pythagorean triple.'],
          ],
        },
        tryit: {
          q: 'Two equal forces of 10 N each act at an angle of 60° to each other (cos 60° = 0.5). What is their resultant?',
          o: ['10√3 N (17.3 N)', '10 N', '20 N', '14.1 N'],
          a: 0,
          h: 'R² = 10² + 10² + 2(10)(10)(0.5).',
          e: 'R² = 100 + 100 + 100 = 300 ⇒ R = √300 = 10√3 ≈ 17.32 N.',
        },
      },
      {
        title: 'Resolution into Components & Relative Velocity',
        idea: 'Any vector F inclined at θ to an axis resolves into F cos θ (adjacent to θ) and F sin θ (opposite θ).',
        rules: [
          'Horizontal component Fx = F cos θ (when θ is measured from the horizontal).',
          'Vertical component Fy = F sin θ.',
          'Relative velocity of A with respect to B: V_AB = V_A − V_B (add speeds when moving in opposite directions; subtract when moving in the same direction).',
        ],
        ex: {
          q: 'A lawn roller is pulled with a force of 200 N along a handle inclined at 60° to the horizontal. What effective horizontal force moves the roller forward?',
          steps: [
            ['Identify angle to horizontal: θ = 60°', 'Horizontal is adjacent → multiply by cos 60°.'],
            ['Fx = 200 × cos 60° = 200 × 0.5 = 100 N', 'Only 100 N pulls horizontally; 200 sin 60° lifts vertically.'],
          ],
        },
        tryit: {
          q: 'Car A travels north at 25 m s⁻¹ while Car B travels south on the same road at 15 m s⁻¹. What is the speed of A relative to B?',
          o: ['40 m s⁻¹', '10 m s⁻¹', '20 m s⁻¹', '29.2 m s⁻¹'],
          a: 0,
          h: 'Opposite directions → relative speed is the sum of speeds.',
          e: 'V_AB = 25 − (−15) = 40 m s⁻¹.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Which of the following contains ONLY vector quantities?', o: ['Momentum, Force, Displacement', 'Speed, Mass, Work', 'Pressure, Energy, Velocity', 'Temperature, Time, Acceleration'], a: 0, e: 'Momentum, force and displacement all possess both magnitude and direction.' },
      { l: 2, q: 'A boy walks 12 m due East and then 5 m due North. What is the magnitude of his resultant displacement?', o: ['13 m', '17 m', '7 m', '8.5 m'], a: 0, e: 'R = √(12² + 5²) = √(144 + 25) = √169 = 13 m.' },
      { l: 3, q: 'Two forces of magnitudes 7 N and 12 N act at a point. Which of the following CANNOT be their resultant?', o: ['3 N', '5 N', '13 N', '19 N'], a: 0, e: 'Resultant must lie between |12 − 7| = 5 N and 12 + 7 = 19 N. 3 N is impossible.' },
      { l: 3, q: 'Find the vertical component of a 50 N force inclined at 30° to the horizontal.', o: ['25 N', '43.3 N', '50 N', '28.9 N'], a: 0, e: 'Fy = 50 sin 30° = 50 × 0.5 = 25 N.' },
      { l: 4, q: 'Two equal forces P acting at 120° to each other have a resultant of magnitude:', o: ['P', '2P', 'P√3', '0'], a: 0, e: 'R² = P² + P² + 2P² cos 120° = 2P² + 2P²(−0.5) = P² ⇒ R = P.' },
      { l: 5, q: 'A boat whose speed in still water is 4 m s⁻¹ heads straight across a river flowing at 3 m s⁻¹. Its resultant speed relative to the river bank is:', o: ['5 m s⁻¹', '7 m s⁻¹', '1 m s⁻¹', '3.5 m s⁻¹'], a: 0, e: 'Perpendicular velocities: V = √(4² + 3²) = 5 m s⁻¹.' },
    ],
  },

  // 4. Newton's Laws, Momentum & Collisions
  {
    id: 'p-newton',
    name: 'Newton’s Laws, Momentum & Lift Motion',
    sec: 'SS 1 · First Term · Mechanics & Matter',
    boss: 'Newton’s Laws & Momentum Test',
    goals: [
      'Apply F = ma, Impulse Ft = mv − mu, and Conservation of Linear Momentum to collisions and gun recoil',
      'Calculate apparent weight R in an accelerating lift/elevator',
    ],
    trap: 'Momentum is a VECTOR! When two bodies move in opposite directions before collision, give one velocity a negative sign before equating momenta!',
    parts: [
      {
        title: 'Newton’s Three Laws, Impulse & Collisions',
        idea: 'Force equals the rate of change of momentum: F = (mv − mu)/t. In a closed system with no external net force, total momentum before collision equals total momentum after.',
        rules: [
          '1st Law (Inertia): mass is the quantitative measure of inertia.',
          'Impulse I = Ft = m(v − u) in N s or kg m s⁻¹ (crumple zones & airbags increase t to reduce impact force F!).',
          'Elastic collision: BOTH momentum and kinetic energy are conserved; Inelastic (coalescing): momentum is conserved, KE is NOT.',
          'Gun recoil: M_gun × V_recoil = m_bullet × v_bullet.',
        ],
        ex: {
          q: 'A 0.02 kg bullet fired at 300 m s⁻¹ from a 4 kg rifle. Find the recoil speed of the rifle.',
          steps: [
            ['Initial total momentum = 0', 'Both rifle and bullet start at rest.'],
            ['4 × V = 0.02 × 300 = 6 kg m s⁻¹', 'V = 6 / 4 = 1.5 m s⁻¹ backwards.'],
          ],
        },
        tryit: {
          q: 'A 2 kg trolley moving at 6 m s⁻¹ collides with and sticks to a stationary 4 kg trolley. What is their common velocity?',
          o: ['2.0 m s⁻¹', '3.0 m s⁻¹', '1.5 m s⁻¹', '4.0 m s⁻¹'],
          a: 0,
          h: 'm₁u₁ + m₂u₂ = (m₁ + m₂)v.',
          e: '2(6) + 4(0) = (2 + 4)v ⇒ 6v = 12 ⇒ v = 2.0 m s⁻¹.',
        },
      },
      {
        title: 'Apparent Weight in a Lift (Elevator)',
        idea: 'A weighing scale inside a lift measures the normal reaction R of the floor on your feet, not true weight mg.',
        rules: [
          'At rest or moving at constant velocity (a = 0): R = mg.',
          'Accelerating UPWARDS at a: R = m(g + a) (feels heavier).',
          'Accelerating DOWNWARDS at a: R = m(g − a) (feels lighter).',
          'Cable snaps / free fall (a = g): R = 0 (apparent weightlessness!).',
        ],
        ex: {
          q: 'A 60 kg student stands on a spring balance inside a lift accelerating upwards at 2 m s⁻² (g = 10 m s⁻²). What does the scale read in newtons?',
          steps: [
            ['Accelerating upward: R − mg = ma', 'Upward net force produces upward acceleration.'],
            ['R = m(g + a) = 60(10 + 2) = 720 N', 'Heavier than true weight 600 N.'],
          ],
        },
        tryit: {
          q: 'What is the apparent weight of a 50 kg passenger in a lift accelerating downwards at 3 m s⁻² (g = 10 m s⁻²)?',
          o: ['350 N', '500 N', '650 N', '150 N'],
          a: 0,
          h: 'Downward acceleration → R = m(g − a).',
          e: 'R = 50 × (10 − 3) = 50 × 7 = 350 N.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Passengers jerk forward when a moving bus brakes suddenly because of:', o: ['Inertia of motion (Newton’s 1st law)', 'Centripetal force', 'Upthrust of air', 'Newton’s 3rd law'], a: 0, e: 'By inertia, their upper bodies tend to continue forward at the bus’s previous speed.' },
      { l: 2, q: 'A force of 40 N acts on an 8 kg mass for 3 s. What is the change in momentum produced?', o: ['120 kg m s⁻¹', '15 kg m s⁻¹', '320 kg m s⁻¹', '5 kg m s⁻¹'], a: 0, e: 'Change in momentum = Impulse = F × t = 40 × 3 = 120 N s (kg m s⁻¹).' },
      { l: 3, q: 'In a perfectly inelastic collision between two bodies, which quantity is ALWAYS conserved?', o: ['Total linear momentum only', 'Kinetic energy only', 'Both kinetic energy and speed', 'Velocity'], a: 0, e: 'Total linear momentum is conserved in ALL isolated collisions; kinetic energy decreases in inelastic ones.' },
      { l: 4, q: 'A 3 kg ball moving East at 4 m s⁻¹ collides head-on and coalesces with a 1 kg ball moving West at 4 m s⁻¹. Their final velocity is:', o: ['2 m s⁻¹ East', '4 m s⁻¹ East', '2 m s⁻¹ West', '0 m s⁻¹'], a: 0, e: 'p_total = 3(+4) + 1(−4) = +8 kg m s⁻¹. v = +8 / (3 + 1) = +2 m s⁻¹ East.' },
      { l: 4, q: 'A 70 kg man stands in a lift moving upwards at a CONSTANT speed of 4 m s⁻¹ (g = 10 m s⁻²). What is the normal reaction on his feet?', o: ['700 N', '980 N', '420 N', '0 N'], a: 0, e: 'Constant velocity means acceleration a = 0! Therefore R = mg = 70 × 10 = 700 N.' },
      { l: 5, q: 'Water jets horizontally from a hose at a rate of 2.5 kg s⁻¹ with speed 16 m s⁻¹ and hits a wall without rebounding. What force acts on the wall?', o: ['40 N', '6.4 N', '20 N', '80 N'], a: 0, e: 'F = (dm/dt) × v = 2.5 × 16 = 40 N.' },
    ],
  },

  // 5. Work, Energy & Power
  {
    id: 'p-work',
    name: 'Work, Mechanical Energy & Power',
    sec: 'SS 1 · Second Term · Conservation Principles',
    boss: 'Work, Energy & Power Test',
    goals: [
      'Calculate Work W = Fd cos θ, Kinetic Energy ½mv², Gravitational PE mgh, and Power P = W/t = Fv',
      'Apply Conservation of Mechanical Energy to falling bodies and swinging pendulums',
    ],
    trap: 'Carrying a heavy load horizontally on your head at constant speed does ZERO work against gravity because θ = 90° and cos 90° = 0!',
    parts: [
      {
        title: 'Work, Kinetic Energy & Potential Energy',
        idea: 'Work is done only when a force moves its point of application in the direction of the force: W = Fd cos θ (in joules).',
        rules: [
          'Kinetic energy KE = ½mv² (doubling speed quadruples KE!).',
          'Gravitational potential energy PE = mgh.',
          'Conservation of mechanical energy (frictionless): PE lost = KE gained ⇒ mgh = ½mv² ⇒ v = √(2gh) (independent of mass!).',
        ],
        ex: {
          q: 'A pendulum bob is released from a vertical height of 0.80 m above its lowest point (g = 10 m s⁻²). Find its speed at the bottom of the swing.',
          steps: [
            ['Equate PE at top to KE at bottom: mgh = ½mv²', 'Mass m cancels on both sides.'],
            ['v = √(2gh) = √(2 × 10 × 0.80) = √16 = 4.0 m s⁻¹', 'Speed at lowest point is 4.0 m s⁻¹.'],
          ],
        },
        tryit: {
          q: 'If the speed of a moving car is tripled (×3), by what factor does its kinetic energy increase?',
          o: ['9 times', '3 times', '6 times', '27 times'],
          a: 0,
          h: 'KE = ½mv², so KE ∝ v².',
          e: '3² = 9 times.',
        },
      },
      {
        title: 'Power & Efficiency of Engines and Pumps',
        idea: 'Power is the rate of doing work or transferring energy: P = W / t = mgh / t = Fv, measured in watts (1 W = 1 J s⁻¹; 1 hp ≈ 746 W).',
        rules: [
          'Useful power output = Work output / t.',
          'Efficiency η = (Useful power output ÷ Total power input) × 100%.',
          'For a vehicle moving at steady speed v against resistance F: Engine power P = F × v.',
        ],
        ex: {
          q: 'An electric water pump of efficiency 80% lifts 300 kg of water through a vertical height of 12 m in 15 s (g = 10 m s⁻²). Find the electrical input power of the pump.',
          steps: [
            ['Useful output power P_out = mgh / t = (300 × 10 × 12) / 15 = 2400 W', '2.4 kW delivered to lift water.'],
            ['Input power P_in = P_out / 0.80 = 2400 / 0.80 = 3000 W (3.0 kW)', 'Account for 80% efficiency.'],
          ],
        },
        tryit: {
          q: 'A 50 kg girl runs up a flight of 20 steps, each 15 cm high, in 5 s (g = 10 m s⁻²). What useful power does she develop?',
          o: ['300 W', '1500 W', '3000 W', '150 W'],
          a: 0,
          h: 'Convert 20 × 15 cm = 300 cm = 3.0 m first!',
          e: 'h = 3.0 m. P = mgh / t = (50 × 10 × 3.0) / 5 = 300 W.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'What is the kinetic energy of a 4 kg mass moving with speed 5 m s⁻¹?', o: ['50 J', '20 J', '100 J', '10 J'], a: 0, e: 'KE = ½mv² = ½ × 4 × 25 = 50 J.' },
      { l: 2, q: 'A crate is pulled 8 m along a smooth horizontal floor by a rope inclined at 60° to the floor with tension 50 N. How much work is done?', o: ['200 J', '400 J', '346 J', '250 J'], a: 0, e: 'W = Fd cos 60° = 50 × 8 × 0.5 = 200 J.' },
      { l: 3, q: 'Which energy transformation occurs in a hydroelectric power station (like Kainji Dam)?', o: ['Potential → Kinetic → Mechanical → Electrical', 'Chemical → Heat → Kinetic → Electrical', 'Electrical → Mechanical → Potential', 'Nuclear → Heat → Electrical'], a: 0, e: 'Stored elevated water (PE) rushes down penstocks (KE), spins turbines (mechanical), driving alternators (electrical).' },
      { l: 3, q: 'A car engine develops 36 kW while maintaining a steady speed of 20 m s⁻¹ on a level road. What is the total resistive force?', o: ['1800 N', '720 N', '1.8 N', '3600 N'], a: 0, e: 'P = Fv ⇒ F = 36,000 / 20 = 1800 N.' },
      { l: 4, q: 'A 0.5 kg stone is dropped from a 10 m cliff (g = 10 m s⁻²). What is its kinetic energy when it is 4 m above the ground?', o: ['30 J', '50 J', '20 J', '40 J'], a: 0, e: 'KE gained = PE lost over 6 m fall = mgΔh = 0.5 × 10 × (10 − 4) = 30 J.' },
      { l: 5, q: 'A bullet of mass 20 g moving at 200 m s⁻¹ penetrates 8 cm into a wooden block before stopping. Find the average resistive force of the wood.', o: ['5000 N', '50 N', '2500 N', '500 N'], a: 0, e: 'Work = KE lost ⇒ F × 0.08 = ½(0.02)(200²) = 400 J ⇒ F = 400 / 0.08 = 5000 N.' },
    ],
  },

  // 6. Density, Pressure in Fluids & Upthrust
  {
    id: 'p-fluids',
    name: 'Density, Fluid Pressure & Archimedes’ Principle',
    sec: 'SS 1 · Second Term · Mechanics & Matter',
    boss: 'Fluids, Pressure & Flotation Test',
    goals: [
      'Calculate liquid pressure P = ρgh, total pressure P₀ + ρgh, and hydraulic press force multiplication F₂/A₂ = F₁/A₁',
      'Apply Archimedes’ Principle, Relative Density by weighing, and the Law of Flotation',
    ],
    trap: 'Relative density has NO UNIT, whereas density in SI is kg m⁻³ (multiply g cm⁻³ by 1000 to get kg m⁻³)!',
    parts: [
      {
        title: 'Hydrostatic Pressure & Pascal’s Hydraulic Press',
        idea: 'Pressure in a liquid increases linearly with depth h and density ρ (P = ρgh), acting equally in all directions and independent of vessel shape.',
        rules: [
          '1 g cm⁻³ = 1000 kg m⁻³ (water ρ = 1000 kg m⁻³; mercury ρ = 13,600 kg m⁻³).',
          'Standard atmospheric pressure = 760 mmHg ≈ 1.01 × 10⁵ Pa (≈ 10 m head of water).',
          'Pascal’s Principle (Hydraulic Press/Brakes): F₁ / A₁ = F₂ / A₂ = F₁ / F₂ = r₁² / r₂².',
        ],
        ex: {
          q: 'In a hydraulic press, the effort piston has area 0.02 m² and the load ram has area 0.50 m². What effort lifts a 5000 N car?',
          steps: [
            ['Apply Pascal’s law: F₁ / A₁ = F₂ / A₂', 'Undiminished pressure transmission.'],
            ['F₁ = 5000 × (0.02 / 0.50) = 5000 × 0.04 = 200 N', '25× force multiplication!'],
          ],
        },
        tryit: {
          q: 'Find the total pressure 20 m below the surface of a freshwater lake if atmospheric pressure is 1.0 × 10⁵ Pa (ρ = 1000 kg m⁻³, g = 10 m s⁻²).',
          o: ['3.0 × 10⁵ Pa', '2.0 × 10⁵ Pa', '1.2 × 10⁵ Pa', '2.1 × 10⁵ Pa'],
          a: 0,
          h: 'Total pressure = P_atm + ρgh.',
          e: 'P = 1.0 × 10⁵ + (1000 × 10 × 20) = 1.0 × 10⁵ + 2.0 × 10⁵ = 3.0 × 10⁵ Pa.',
        },
      },
      {
        title: 'Archimedes’ Principle, Relative Density & Flotation',
        idea: 'When a body is wholly or partially immersed in a fluid, it experiences an upward upthrust equal to the weight of fluid displaced.',
        rules: [
          'Upthrust U = Weight in air (Wₐ) − Apparent weight in liquid (Wₗ) = ρ_fluid × V_submerged × g.',
          'RD of solid = Wₐ / (Wₐ − W_water).',
          'RD of liquid = (Upthrust in liquid) / (Upthrust in water) = (Wₐ − W_liq) / (Wₐ − W_water).',
          'Law of Flotation: A floating body displaces its OWN WEIGHT of the fluid in which it floats!',
        ],
        ex: {
          q: 'A metal block weighs 40 N in air, 32 N when completely immersed in water, and 34 N when immersed in kerosene. Find the relative density of (i) the metal and (ii) kerosene.',
          steps: [
            ['Upthrust in water = 40 − 32 = 8 N; Upthrust in kerosene = 40 − 34 = 6 N', 'Apparent loss in weight equals upthrust.'],
            ['RD of metal = 40 / 8 = 5.0;  RD of kerosene = 6 / 8 = 0.75', 'Both are pure dimensionless numbers.'],
          ],
        },
        tryit: {
          q: 'A wooden block of density 600 kg m⁻³ floats in water of density 1000 kg m⁻³. What fraction of its volume is submerged?',
          o: ['3/5 (60%)', '2/5 (40%)', '5/3', '1/2 (50%)'],
          a: 0,
          h: 'Fraction submerged = ρ_solid / ρ_liquid.',
          e: 'V_sub / V_total = 600 / 1000 = 0.60 = 3/5.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Why are dam walls built much thicker at the base than at the top?', o: ['Water pressure increases directly with depth (P = ρgh)', 'Water density is highest at the surface', 'Atmospheric pressure acts only at the bottom', 'Upthrust pushes the top inwards'], a: 0, e: 'Hydrostatic pressure P = ρgh is greatest at the deepest point of the dam.' },
      { l: 2, q: 'An instrument used directly to measure the relative density of battery acid or milk is a:', o: ['Hydrometer', 'Hygrometer', 'Barometer', 'Manometer'], a: 0, e: 'A hydrometer floats higher in denser liquids; a hygrometer measures humidity!' },
      { l: 3, q: 'A stone weighs 25 N in air and 15 N when totally immersed in water. What is the density of the stone? (ρ_water = 1000 kg m⁻³)', o: ['2500 kg m⁻³', '1500 kg m⁻³', '1000 kg m⁻³', '4000 kg m⁻³'], a: 0, e: 'RD = 25 / (25 − 15) = 2.5 ⇒ ρ = 2.5 × 1000 = 2500 kg m⁻³.' },
      { l: 4, q: 'A ship sails from salty Atlantic seawater into fresh Lagos lagoon water. What happens to the ship?', o: ['It sinks slightly deeper to displace a larger volume of less dense fresh water', 'It rises higher out of the water', 'Its upthrust decreases', 'Its weight increases'], a: 0, e: 'Upthrust must still equal the ship’s constant weight! Since ρ_fresh < ρ_sea, V_displaced increases.' },
      { l: 4, q: 'A barometer reads 75 cmHg at the foot of a hill and 60 cmHg at the top. If ρ_Hg = 13,600 kg m⁻³ and mean air density = 1.25 kg m⁻³, find the height of the hill.', o: ['1632 m', '1200 m', '960 m', '2040 m'], a: 0, e: 'ρ_air × h_hill = ρ_Hg × Δh_Hg ⇒ 1.25 h = 13600 × 0.15 = 2040 ⇒ h = 1632 m.' },
      { l: 5, q: 'An ice cube of density 900 kg m⁻³ and volume 200 cm³ floats in water (1000 kg m⁻³). What volume of the ice projects ABOVE the water surface?', o: ['20 cm³', '180 cm³', '100 cm³', '40 cm³'], a: 0, e: 'Submerged = (900/1000) × 200 = 180 cm³. Volume above surface = 200 − 180 = 20 cm³.' },
    ],
  },

  // 7. Elasticity, Hooke's Law & Molecular Properties
  {
    id: 'p-elastic',
    name: 'Elasticity, Hooke’s Law & Surface Tension',
    sec: 'SS 1 · Second Term · Mechanics & Matter',
    boss: 'Elasticity & Molecular Forces Test',
    goals: [
      'Apply Hooke’s Law F = ke, elastic potential energy W = ½Fe = ½ke², and Young’s Modulus E = Fl / Ae',
      'Explain surface tension, capillarity (cohesion vs adhesion), and terminal velocity in viscous fluids',
    ],
    trap: 'Elastic energy stored in a stretched spring is ½Fe (the triangle area under the F–e graph), NEVER Fe!',
    parts: [
      {
        title: 'Hooke’s Law, Spring Energy & Young’s Modulus',
        idea: 'Provided the elastic limit is not exceeded, extension e is directly proportional to applied load F: F = ke.',
        rules: [
          'Force constant k = F / e (in N m⁻¹).',
          'Elastic potential energy W = ½Fe = ½ke².',
          'Tensile stress = F / A (N m⁻²); Tensile strain = e / l₀ (no unit); Young’s Modulus E = Stress / Strain = Fl₀ / Ae.',
        ],
        ex: {
          q: 'A spiral spring of natural length 20 cm stretches to 25 cm under a load of 10 N. Find (i) its force constant k in N m⁻¹ and (ii) the energy stored.',
          steps: [
            ['Extension e = 25 − 20 = 5 cm = 0.05 m', 'Convert cm to metres immediately!'],
            ['k = F / e = 10 / 0.05 = 200 N m⁻¹;  W = ½Fe = ½(10)(0.05) = 0.25 J', 'Stored energy is 0.25 J.'],
          ],
        },
        tryit: {
          q: 'A spring stretches by 4 cm under a 12 N load. What will its TOTAL length be under a 30 N load if its unstretched length is 15 cm?',
          o: ['25 cm', '10 cm', '27 cm', '30 cm'],
          a: 0,
          h: 'Find extension for 30 N first, then add unstretched length 15 cm!',
          e: 'k = 3 N cm⁻¹. Extension for 30 N = 30 / 3 = 10 cm. Total length = 15 + 10 = 25 cm.',
        },
      },
      {
        title: 'Surface Tension, Capillarity & Viscosity',
        idea: 'Cohesion is attraction between like molecules; adhesion is attraction between unlike molecules. Their balance governs meniscus shape and capillary rise/depression.',
        rules: [
          'Water in clean glass: Adhesion > Cohesion → wets glass, concave meniscus, rises in capillary tube.',
          'Mercury in glass: Cohesion > Adhesion → does not wet glass, convex meniscus, depressed in capillary tube.',
          'Surface tension γ = F / L (N m⁻¹) is reduced by heating, soap/detergents, oil, or camphor.',
          'Terminal velocity in viscous fluid: Weight W = Upthrust U + Viscous drag Fv (zero net force, constant speed!).',
        ],
        ex: {
          q: 'Explain why pouring kerosene on stagnant pond water kills mosquito larvae.',
          steps: [
            ['Kerosene lowers the surface tension of the water', 'Weakens the elastic skin of the water surface.'],
            ['Mosquito larvae can no longer hang from the surface film to breathe', 'They sink and suffocate.'],
          ],
        },
        tryit: {
          q: 'When a steel ball bearing reaches terminal velocity while falling through tall glycerine, its acceleration is:',
          o: ['Zero (0 m s⁻²)', '9.8 m s⁻²', 'Increasing steadily', 'Equal to upthrust'],
          a: 0,
          h: 'At terminal velocity, W = U + Fv so net force is zero.',
          e: 'Constant terminal velocity means net force = 0 and acceleration = 0.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'State the SI unit of force constant k of an elastic spring.', o: ['N m⁻¹', 'N m', 'N m⁻²', 'J m⁻¹'], a: 0, e: 'Since F = ke, k = F / e has SI unit N m⁻¹.' },
      { l: 2, q: 'Mercury forms spherical droplets on glass and a convex meniscus because:', o: ['Cohesive forces between mercury atoms exceed adhesive forces to glass', 'Adhesion exceeds cohesion', 'Mercury has low density', 'Mercury has high vapour pressure'], a: 0, e: 'Strong Hg–Hg cohesion pulls mercury inward away from glass.' },
      { l: 3, q: 'Calculate the elastic energy stored in a spring of stiffness 400 N m⁻¹ compressed by 5 cm.', o: ['0.50 J', '10 J', '5000 J', '1.0 J'], a: 0, e: 'W = ½ke² = ½ × 400 × (0.05)² = 200 × 0.0025 = 0.50 J.' },
      { l: 3, q: 'Which of the following INCREASES the surface tension of pure water?', o: ['Cooling the water to a lower temperature', 'Adding soap or detergent', 'Boiling the water', 'Pouring oil on the surface'], a: 0, e: 'Surface tension increases as temperature drops and decreases when heated or mixed with detergent/oil.' },
      { l: 4, q: 'A wire of length 2.0 m and cross-sectional area 1.0 × 10⁻⁶ m² extends by 1.0 mm under a 100 N load. Find Young’s modulus E.', o: ['2.0 × 10¹¹ N m⁻²', '1.0 × 10⁸ N m⁻²', '5.0 × 10¹⁰ N m⁻²', '2.0 × 10⁸ N m⁻²'], a: 0, e: 'E = Fl / Ae = (100 × 2.0) / (1.0 × 10⁻⁶ × 1.0 × 10⁻³) = 200 / 10⁻⁹ = 2.0 × 10¹¹ N m⁻².' },
      { l: 5, q: 'Beyond the elastic limit, a metal wire undergoes permanent deformation without breaking. This region is called:', o: ['Plastic deformation (yield region)', 'Proportional region', 'Hookean region', 'Brittle fracture'], a: 0, e: 'Beyond the elastic limit, permanent set occurs—known as plastic deformation.' },
    ],
  },

  // 8. Thermometry & Thermal Expansion
  {
    id: 'p-expansion',
    name: 'Thermometry & Thermal Expansion of Solids/Liquids',
    sec: 'SS 1 · Second Term · Thermal Physics',
    boss: 'Thermometry & Expansion Test',
    goals: [
      'Calibrate thermometers using fixed points and convert between °C and Kelvin (T = θ + 273)',
      'Solve linear (α), area (β = 2α), cubic (γ = 3α), and apparent/real liquid expansion problems',
    ],
    trap: 'In α = Δl / (l₁ Δθ), Δθ is the CHANGE in temperature (same in °C or K)—never convert a temperature DIFFERENCE by adding 273!',
    parts: [
      {
        title: 'Temperature Scales & Thermometric Calibration',
        idea: 'Any physical property that varies linearly and reproducibly with temperature (mercury length, platinum resistance, thermocouple EMF) defines a temperature scale.',
        rules: [
          'T (K) = θ (°C) + 273;  Absolute zero = 0 K = −273 °C.',
          'Unknown temperature θ / 100 = (X_θ − X_0) / (X_100 − X_0).',
          'Mercury beats alcohol for high temperatures (boils 357 °C, opaque, doesn’t wet glass); Alcohol beats mercury in polar climates (freezes −115 °C vs −39 °C, expands 6× more).',
        ],
        ex: {
          q: 'A platinum resistance thermometer has resistance 4.0 Ω at 0 °C, 6.5 Ω at 100 °C, and 5.0 Ω in a warm bath. Find the bath temperature.',
          steps: [
            ['Fundamental interval X₁₀₀ − X₀ = 6.5 − 4.0 = 2.5 Ω', 'Change over 100 °C.'],
            ['θ = [(5.0 − 4.0) / 2.5] × 100 = (1.0 / 2.5) × 100 = 40 °C', 'Bath is at 40 °C.'],
          ],
        },
        tryit: {
          q: 'An unmarked mercury thermometer has column lengths 5 cm at ice point and 25 cm at steam point. What length corresponds to 60 °C?',
          o: ['17 cm', '12 cm', '15 cm', '20 cm'],
          a: 0,
          h: '(L − 5) / (25 − 5) = 60 / 100.',
          e: '(L − 5) / 20 = 0.6 ⇒ L − 5 = 12 ⇒ L = 17 cm.',
        },
      },
      {
        title: 'Linear, Area & Volume Expansivity + Anomalous Water',
        idea: 'Solids expand on heating: Δl = α l₁ Δθ, with area expansivity β ≈ 2α and cubic expansivity γ ≈ 3α.',
        rules: [
          'Linear expansivity α = (l₂ − l₁) / [l₁(θ₂ − θ₁)] in K⁻¹ (or °C⁻¹).',
          'Real cubic expansivity of liquid γᵣ = Apparent expansivity γₐ + Cubic expansivity of vessel γg.',
          'Anomalous expansion of water: on heating from 0 °C to 4 °C, water CONTRACTS and reaches MAXIMUM DENSITY (1000 kg m⁻³) at 4 °C!',
        ],
        ex: {
          q: 'A steel rail of length 20 m at 25 °C is heated to 75 °C (α = 1.2 × 10⁻⁵ K⁻¹). What minimum expansion gap must be left?',
          steps: [
            ['Δθ = 75 − 25 = 50 K', 'Temperature rise is 50 K.'],
            ['Δl = α l₁ Δθ = 1.2 × 10⁻⁵ × 20 × 50 = 0.012 m = 1.2 cm', 'Leave 1.2 cm gap to prevent buckling.'],
          ],
        },
        tryit: {
          q: 'If the linear expansivity of brass is 1.9 × 10⁻⁵ K⁻¹, what is its cubic (volume) expansivity γ?',
          o: ['5.7 × 10⁻⁵ K⁻¹', '3.8 × 10⁻⁵ K⁻¹', '1.9 × 10⁻⁵ K⁻¹', '9.5 × 10⁻⁶ K⁻¹'],
          a: 0,
          h: 'γ = 3α.',
          e: 'γ = 3 × 1.9 × 10⁻⁵ = 5.7 × 10⁻⁵ K⁻¹.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'At what temperature does pure water have its MAXIMUM density?', o: ['4 °C (277 K)', '0 °C (273 K)', '100 °C (373 K)', '−4 °C'], a: 0, e: 'Due to anomalous expansion, water contracts from 0 °C to 4 °C, reaching maximum density at 4 °C.' },
      { l: 2, q: 'Why does a clinical thermometer have a constriction (kink) in its capillary bore just above the bulb?', o: ['To prevent mercury from flowing back into the bulb before the reading is taken', 'To make the mercury expand faster', 'To allow measurement up to 100 °C', 'To prevent glass cracking'], a: 0, e: 'The constriction breaks the mercury thread on cooling until shaken down.' },
      { l: 3, q: 'A bimetallic strip made of brass (higher α) riveted to iron (lower α) is heated strongly. How does it bend?', o: ['Brass is on the OUTSIDE of the curve (bends towards iron)', 'Iron is on the outside of the curve', 'It stays straight', 'It splits in half'], a: 0, e: 'Brass expands more than iron, so brass forms the longer outer arc.' },
      { l: 3, q: 'Convert −40 °C to the Kelvin scale.', o: ['233 K', '313 K', '−313 K', '273 K'], a: 0, e: 'T = −40 + 273 = 233 K.' },
      { l: 4, q: 'A metal square plate of side 10 cm (area 100 cm²) is heated through 100 °C. If α = 2.0 × 10⁻⁵ K⁻¹, find its new area.', o: ['100.4 cm²', '100.2 cm²', '104.0 cm²', '100.6 cm²'], a: 0, e: 'β = 2α = 4.0 × 10⁻⁵ K⁻¹. ΔA = 4.0 × 10⁻⁵ × 100 × 100 = 0.4 cm² ⇒ A₂ = 100.4 cm².' },
      { l: 5, q: 'A glass flask (γg = 2.7 × 10⁻⁵ K⁻¹) is filled to the brim with glycerine of apparent expansivity 5.0 × 10⁻⁴ K⁻¹. What is the real cubic expansivity of glycerine?', o: ['5.27 × 10⁻⁴ K⁻¹', '4.73 × 10⁻⁴ K⁻¹', '5.00 × 10⁻⁴ K⁻¹', '7.70 × 10⁻⁴ K⁻¹'], a: 0, e: 'γ_real = γ_apparent + γ_vessel = 5.00 × 10⁻⁴ + 0.27 × 10⁻⁴ = 5.27 × 10⁻⁴ K⁻¹.' },
    ],
  },

  // 9. Heat Transfer: Conduction, Convection & Radiation
  {
    id: 'p-heat-trans',
    name: 'Modes of Heat Transfer & The Vacuum Flask',
    sec: 'SS 1 · Third Term · Thermal Physics',
    boss: 'Heat Transfer Mastery Test',
    goals: [
      'Compare conduction, convection, and thermal radiation across solids, fluids, and vacuum',
      'Explain how every feature of a Dewar (thermos) flask minimizes heat loss or gain',
    ],
    trap: 'Shiny silvered walls minimize RADIATION (poor emitters/absorbers); it is the VACUUM between the double glass walls that stops conduction and convection!',
    parts: [
      {
        title: 'Conduction, Convection & Land/Sea Breezes',
        idea: 'Conduction passes vibrational/free-electron energy without bulk flow; convection circulates heated fluid via density differences.',
        rules: [
          'Metals conduct rapidly via mobile delocalised electrons; water, air, wood & cork are thermal insulators (lagging).',
          'Water is a poor conductor—ice wrapped in wire gauze at the bottom of a tilted tube does not melt even when water boils at the top!',
          'Daytime SEA breeze: land heats faster → warm air rises over land → cool air blows from sea to land. Night LAND breeze reverses this.',
        ],
        ex: {
          q: 'Why is the cooling freezer compartment placed near the TOP of a single-door domestic refrigerator?',
          steps: [
            ['Cold air around the freezer is denser and sinks downwards', 'Sets up natural convection currents.'],
            ['Warm air from food below is less dense and rises to be cooled', 'Cools the entire cabinet uniformly.'],
          ],
        },
        tryit: {
          q: 'On a sunny afternoon in Lagos, why does an iron bench feel hotter to touch than a wooden bench right beside it?',
          o: ['Iron is a much better conductor of heat into your hand than wood', 'Iron has a higher temperature than wood in shade', 'Wood destroys heat', 'Iron convects heat faster'],
          a: 0,
          h: 'At above skin temperature, good conductors transfer heat rapidly into your skin.',
          e: 'Iron conducts heat rapidly into (or away from, on a cold morning) your hand compared to insulating wood.',
        },
      },
      {
        title: 'Thermal Radiation & The Thermos (Vacuum) Flask',
        idea: 'Infrared radiation consists of electromagnetic waves travelling at 3 × 10⁸ m s⁻¹—requiring NO material medium.',
        rules: [
          'Dull matte black surfaces are the BEST absorbers AND BEST emitters of thermal radiation.',
          'Polished shiny silver/white surfaces are the POOREST absorbers and POOREST emitters (good reflectors).',
          'Thermos flask: Vacuum stops conduction & convection; Silvered walls stop radiation; Insulating plastic/cork stopper stops convection & evaporation.',
        ],
        ex: {
          q: 'Match each part of a vacuum flask to the heat-transfer mode it prevents: (a) Vacuum, (b) Silvered glass walls, (c) Tight cork stopper.',
          steps: [
            ['(a) Vacuum → prevents conduction and convection', 'Both require matter particles.'],
            ['(b) Silvered walls → minimizes radiation', 'Reflects infrared rays back.'],
            ['(c) Tight cork/plastic stopper → stops convection & evaporation + conduction', 'Traps vapour and insulates neck.'],
          ],
        },
        tryit: {
          q: 'Which surface should be painted on solar water-heater collector pipes to maximize heat absorption?',
          o: ['Matte dull black', 'Polished silver', 'Glossy white', 'Chrome plated'],
          a: 0,
          h: 'Good absorbers of infrared radiation are dark and non-reflective.',
          e: 'Matte black surfaces absorb nearly all incident solar radiation.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Heat from the Sun reaches the Earth across empty space exclusively by:', o: ['Radiation', 'Convection', 'Conduction', 'Advection'], a: 0, e: 'Conduction and convection cannot cross a vacuum; infrared radiation is electromagnetic.' },
      { l: 2, q: 'Two identical kettles, one painted dull black and the other polished silver, are filled with boiling water at 100 °C. Which cools faster?', o: ['The dull black kettle, because black is the best emitter of radiation', 'The polished silver kettle', 'Both cool at the exact same rate', 'Neither radiates heat'], a: 0, e: 'A good absorber (dull black) is also the best emitter of thermal radiation.' },
      { l: 3, q: 'What causes a sea breeze along coastal towns during the day?', o: ['Convection due to land having a lower specific heat capacity than sea water', 'Conduction through beach sand', 'Radiation from ocean waves', 'Earth’s magnetic field'], a: 0, e: 'Land heats up faster than water, causing warm air over land to rise and cooler sea air to blow inland.' },
      { l: 3, q: 'In Davy’s safety lamp used in coal mines, copper wire gauze surrounds the flame so that:', o: ['Copper conducts heat away rapidly, keeping outside methane below ignition temperature', 'Methane cannot pass through wire gauze', 'Radiation is amplified', 'Convection is reversed'], a: 0, e: 'High thermal conductivity of copper dissipates flame heat below outside gas ignition point.' },
      { l: 4, q: 'In a thermos flask, which feature prevents heat loss by BOTH conduction and convection across the side walls?', o: ['The evacuated vacuum between the double walls', 'The silvered coating', 'The outer plastic casing', 'The felt pad at the base'], a: 0, e: 'Neither conduction nor convection can occur in a vacuum.' },
      { l: 5, q: 'Why does the glass greenhouse effect trap warmth inside a glasshouse or parked car?', o: ['Glass transmits short-wavelength solar rays in, but blocks long-wavelength infrared re-radiated by warm interiors', 'Glass generates heat chemically', 'Glass conducts heat one way only', 'Air inside becomes a vacuum'], a: 0, e: 'Short-wave visible/near-IR enters easily; cooler objects inside emit long-wave IR to which glass is opaque.' },
    ],
  },

  // 10. Electrostatics & Gold-Leaf Electroscope
  {
    id: 'p-electrostatics',
    name: 'Electrostatics, Induction & Lightning Conductors',
    sec: 'SS 1 · Third Term · Electricity & Fields',
    boss: 'Electrostatics & Electroscope Test',
    goals: [
      'Explain charging by friction, contact, and electrostatic induction (with earthing)',
      'Use a charged gold-leaf electroscope to test charge sign and explain sharp-point corona discharge in lightning conductors',
    ],
    trap: 'ONLY divergence (further opening) of a charged electroscope leaf proves the SAME sign of charge—leaf collapse happens for BOTH opposite charge AND an uncharged conductor!',
    parts: [
      {
        title: 'Triboelectric Charging, Induction & Gold-Leaf Electroscope',
        idea: 'Electrons (never protons!) transfer during charging. Electrostatic induction separates charges on an insulated conductor and leaves an OPPOSITE net charge after earthing.',
        rules: [
          'Glass rubbed with silk → glass becomes POSITIVE (loses e⁻); Ebonite/polythene rubbed with fur → NEGATIVE (gains e⁻).',
          'Charging by induction with a NEGATIVE rod gives a POSITIVE net charge once earth wire is removed BEFORE the rod.',
          'Sure test for charge sign: leaf DIVERGENCE increases ONLY when a body carries the SAME sign of charge as the electroscope!',
        ],
        ex: {
          q: 'A positively charged glass rod is brought near the cap of an uncharged insulated conductor X, X is briefly earthed with a finger, and then the glass rod is removed. What final charge remains on X?',
          steps: [
            ['Positive rod attracts electrons to the near side of X and repels +ve to the far side', 'Electrostatic polarization.'],
            ['Earthing allows electrons from Earth to flow up and neutralize the repelled +ve region', 'Bound negative charge is held by the rod.'],
            ['Remove earth finger first, then remove rod → net NEGATIVE charge spreads over X', 'Induction always yields the opposite sign!'],
          ],
        },
        tryit: {
          q: 'When rod Y is brought near the cap of a negatively charged electroscope, the gold leaf diverges FURTHER. Rod Y must be:',
          o: ['Negatively charged', 'Positively charged', 'Uncharged copper', 'Earthed'],
          a: 0,
          h: 'Increased divergence means extra electrons were repelled down from the cap to the leaf!',
          e: 'Increased divergence is the conclusive test: Y carries the same negative charge.',
        },
      },
      {
        title: 'Charge Distribution, Sharp Points & Lightning Conductors',
        idea: 'Surface charge density σ = Q / A concentrates most intensely at sharp points of small radius of curvature, ionizing surrounding air (point/corona discharge).',
        rules: [
          'Inside a hollow closed metal conductor (Faraday cage), net charge and electric field are ZERO—all excess charge resides on the outer surface.',
          'Sharp spikes on a lightning conductor leak ionized air upward ("electric wind") to neutralize storm clouds gently, and provide a low-resistance copper path to a buried earth plate.',
        ],
        ex: {
          q: 'Why are petrol tankers fitted with a conducting chain or anti-static tyre touching the road?',
          steps: [
            ['Air friction and sloshing fuel build up high static charge on the tank', 'Risk of incendiary spark.'],
            ['Conducting path safely leaks charges continuously to the Earth', 'Prevents sparks igniting petrol vapour.'],
          ],
        },
        tryit: {
          q: 'Where is surface charge density highest on a charged pear-shaped brass conductor?',
          o: ['At the sharpest pointed end', 'At the flattest broad end', 'Deep inside the metal core', 'Uniform everywhere'],
          a: 0,
          h: 'Smaller radius of curvature concentrates surface charge density.',
          e: 'Charge density concentrates maximally at sharp points.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'When an ebonite rod is rubbed with fur, the ebonite becomes negatively charged because:', o: ['Electrons are transferred from the fur to the ebonite rod', 'Protons move from the ebonite to the fur', 'Neutrons are created by friction', 'Protons move into the ebonite'], a: 0, e: 'Protons are locked inside atomic nuclei; only mobile electrons transfer.' },
      { l: 2, q: 'What happens when an UNCHARGED brass rod is brought near the cap of a positively charged gold-leaf electroscope?', o: ['The leaf divergence decreases (collapses slightly)', 'The leaf diverges further', 'Nothing happens at all', 'The leaf tears off'], a: 0, e: 'Induced negative charge on the near end of the brass rod draws positive charge up toward the cap, reducing leaf divergence.' },
      { l: 3, q: 'To charge an insulated metal sphere POSITIVELY by induction, you should bring near it:', o: ['A negatively charged rod, earth the sphere, break earth contact, then remove the rod', 'A positively charged rod and touch the sphere with it', 'A positively charged rod, earth it, then remove the rod first', 'A bar magnet'], a: 0, e: 'Induction produces the opposite sign of the inducing rod, and the earth connection must be broken BEFORE removing the rod.' },
      { l: 3, q: 'A lightning conductor protects a tall building primarily by:', o: ['Point discharge neutralizing cloud charge and conducting any strike safely to an earth plate', 'Repelling thunderclouds away with magnetism', 'Storing lightning inside capacitors', 'Insulating the roof with rubber'], a: 0, e: 'Sharp copper spikes ionize air (point discharge) and thick copper tape routes charge to a buried earth plate.' },
      { l: 4, q: 'In Faraday’s ice-pail experiment, a +6 μC metal ball lowered inside a hollow metal can WITHOUT touching induces what charge on the OUTSIDE of the can?', o: ['+6 μC (and −6 μC on the inner wall)', '−6 μC on the outside', '0 μC everywhere', '+12 μC on the outside'], a: 0, e: '−6 μC is drawn to the inner surface and +6 μC is repelled to the outer surface.' },
      { l: 5, q: 'Why is the inside of a closed metal car a safe Faraday shield during a thunderstorm?', o: ['Excess charge stays entirely on the outer metal skin, keeping the internal electric field zero', 'Rubber tyres block all magnetic fields', 'Glass windows absorb electrons', 'Engine heat neutralizes ions'], a: 0, e: 'Electrostatic shielding (Faraday cage) keeps E = 0 inside a hollow conductor.' },
    ],
  },

  // 11. Current Electricity & DC Circuits
  {
    id: 'p-dc-circuits',
    name: 'Ohm’s Law, DC Resistors, EMF & Electrical Energy',
    sec: 'SS 1 · Third Term · Electricity & Fields',
    boss: 'DC Circuits, EMF & Power Test',
    goals: [
      'Solve series and parallel resistor networks using Q = It, V = IR, Rₛ = ΣR, and 1/Rₚ = Σ(1/R)',
      'Calculate cell EMF E = I(R + r), lost volts Ir, electrical energy E = IVt = I²Rt, and PHCN/DISCO kWh bills',
    ],
    trap: 'Terminal potential difference V = E − Ir is LESS than cell EMF E whenever current I is drawn because of "lost volts" Ir inside the cell!',
    parts: [
      {
        title: 'Ohm’s Law, Series/Parallel Networks & Cell Internal Resistance',
        idea: 'Current I = Q / t (in amperes). Metallic conductors at constant temperature obey Ohm’s law V = IR.',
        g: ['physCircuit', { mode: 'emf' }],
        cap: 'Cell of EMF E and internal resistance r driving current I through external load R: V = IR = E − Ir.',
        rules: [
          'Series: same current I, voltages add, R_total = R₁ + R₂ + ...',
          'Parallel: same voltage V, currents split, R_total = (R₁R₂)/(R₁ + R₂) for two resistors (always LESS than the smallest branch!).',
          'Cell equation: E = I(R + r) = V + Ir; Efficiency of cell = R / (R + r) × 100%.',
        ],
        ex: {
          q: 'A cell of EMF 1.5 V and internal resistance 0.5 Ω is connected to two 4 Ω resistors in parallel. Find (i) the circuit current and (ii) the terminal p.d.',
          steps: [
            ['External parallel load R = (4 × 4) / (4 + 4) = 2.0 Ω', 'Two equal 4 Ω branches give 2 Ω.'],
            ['I = E / (R + r) = 1.5 / (2.0 + 0.5) = 0.60 A', 'Total resistance = 2.5 Ω.'],
            ['Terminal p.d. V = IR = 0.60 × 2.0 = 1.20 V (lost volts = 0.30 V)', 'Checks: 1.20 + 0.30 = 1.50 V.'],
          ],
        },
        tryit: {
          q: 'What is the combined resistance of 3 Ω and 6 Ω connected in parallel, then placed in series with a 4 Ω resistor?',
          o: ['6 Ω', '13 Ω', '2 Ω', '8.5 Ω'],
          a: 0,
          h: 'Parallel part = (3 × 6)/(3 + 6) = 2 Ω, then add 4 Ω.',
          e: 'R_parallel = 18 / 9 = 2 Ω; R_total = 2 + 4 = 6 Ω.',
        },
      },
      {
        title: 'Electrical Energy, Power, kWh Billing & Fuses',
        idea: 'Electrical power P = IV = I²R = V²/R (watts). Commercial electricity meters measure energy in kilowatt-hours (1 kWh = 3.6 × 10⁶ J).',
        rules: [
          'Energy in kWh = (Power in watts ÷ 1000) × (Time in hours).',
          'Fuse rating: choose a fuse slightly ABOVE normal operating current I = P / V (made of low-melting tin–lead alloy connected in the LIVE wire!).',
          'Three-pin plug: Brown = Live (with fuse & switch), Blue = Neutral, Green/Yellow = Earth.',
        ],
        ex: {
          q: 'A 2200 W electric kettle operates on a 220 V mains supply. (a) What fuse rating is suitable? (b) If used 30 minutes daily for 30 days at ₦60 per kWh, find the bill.',
          steps: [
            ['Operating current I = P / V = 2200 / 220 = 10 A → choose a 13 A fuse', 'Slightly above 10 A normal draw.'],
            ['Energy = 2.2 kW × (0.5 h × 30) = 33 kWh; Cost = 33 × ₦60 = ₦1,980', 'Convert watts to kW and minutes to hours!'],
          ],
        },
        tryit: {
          q: 'How much heat energy is dissipated in 2 minutes by a 5 Ω resistor carrying a current of 3 A?',
          o: ['5,400 J', '90 J', '1,800 J', '3,600 J'],
          a: 0,
          h: 'Convert 2 minutes = 120 s and use E = I²Rt.',
          e: 'E = 3² × 5 × 120 = 9 × 600 = 5,400 J.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'A current of 2.5 A flows through a lamp for 4 minutes. What quantity of electric charge passes through it?', o: ['600 C', '10 C', '150 C', '60 C'], a: 0, e: 'Q = It = 2.5 × (4 × 60) = 2.5 × 240 = 600 C.' },
      { l: 2, q: 'In domestic wiring, switches and fuses must ALWAYS be connected in the:', o: ['Live wire', 'Neutral wire', 'Earth wire', 'Both Neutral and Earth wires'], a: 0, e: 'Placing the fuse/switch in the Live wire isolates the appliance from high potential when off or blown.' },
      { l: 3, q: '1 kilowatt-hour (1 kWh) of electrical energy is equivalent to:', o: ['3.6 × 10⁶ J', '3.6 × 10³ J', '1000 J', '6.0 × 10⁴ J'], a: 0, e: '1000 W × 3600 s = 3,600,000 J = 3.6 × 10⁶ J.' },
      { l: 4, q: 'A battery has open-circuit EMF 12 V. When delivering 2 A to a headlamp, its terminal p.d. drops to 11 V. What is its internal resistance r?', o: ['0.5 Ω', '1.0 Ω', '5.5 Ω', '6.0 Ω'], a: 0, e: 'Lost volts = E − V = 12 − 11 = 1 V = Ir ⇒ r = 1 / 2 = 0.5 Ω.' },
      { l: 4, q: 'Three resistors of 2 Ω, 3 Ω, and 6 Ω are connected in parallel across a 12 V supply. What is the total current drawn from the supply?', o: ['12 A', '1.09 A', '2 A', '6 A'], a: 0, e: '1/R = 1/2 + 1/3 + 1/6 = 1 ⇒ R = 1 Ω. Total I = 12 V / 1 Ω = 12 A.' },
      { l: 5, q: 'Four 1.5 V cells, each of internal resistance 0.5 Ω, are connected in SERIES to an 8 Ω load. What current flows?', o: ['0.60 A', '0.75 A', '0.18 A', '1.20 A'], a: 0, e: 'Total E = 4 × 1.5 = 6.0 V; total r = 4 × 0.5 = 2.0 Ω. I = 6.0 / (8 + 2) = 0.60 A.' },
    ],
  },
];
