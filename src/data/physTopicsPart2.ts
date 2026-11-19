import type { Topic } from '../types';

export const PHYS_TOPICS_PART2: Topic[] = [
  // 12. Projectile Motion
  {
    id: 'p-projectiles',
    name: 'Projectile Motion (2D Kinematics)',
    sec: 'SS 2 · First Term · Dynamics & Mechanics',
    boss: 'Projectile Motion Test',
    goals: [
      'Resolve launch velocity U at angle θ into constant Ux = U cos θ and accelerated Uy = U sin θ',
      'Calculate Time of Flight T, Maximum Height H, Horizontal Range R, and cliff projections',
    ],
    trap: 'At maximum height, vertical velocity Vy = 0, NOT total speed—the projectile still travels horizontally at U cos θ!',
    parts: [
      {
        title: 'Oblique Projection: T, H & Maximum Range',
        idea: 'Gravity acts vertically only, keeping horizontal speed U cos θ constant throughout flight.',
        g: ['physForce', { mode: 'projectile' }],
        cap: 'Parabolic trajectory: T = 2U sin θ / g, H = U² sin²θ / 2g, R = U² sin 2θ / g.',
        rules: [
          'Time of flight T = 2U sin θ / g;  Max height H = U² sin²θ / (2g).',
          'Range R = U² sin 2θ / g; Rmax = U² / g at θ = 45°.',
          'Complementary launch angles θ and (90° − θ) give equal horizontal range.',
        ],
        ex: {
          q: 'A ball is kicked at 20 m s⁻¹ at 30° to the horizontal (g = 10 m s⁻²). Find T and H.',
          steps: [
            ['T = 2(20) sin 30° / 10 = 2.0 s', 'Total flight time is 2.0 s.'],
            ['H = (400 × 0.25) / 20 = 5.0 m', 'Peak height is 5.0 m.'],
          ],
        },
        tryit: {
          q: 'What is the maximum horizontal range of a javelin thrown at 30 m s⁻¹ (g = 10 m s⁻²)?',
          o: ['90 m', '45 m', '60 m', '180 m'],
          a: 0,
          h: 'Rmax = U² / g at 45°.',
          e: 'Rmax = 30² / 10 = 90 m.',
        },
      },
      {
        title: 'Horizontal Projection from a Cliff',
        idea: 'Projected horizontally from height h with speed U, initial Uy = 0 so fall time t = √(2h/g).',
        rules: [
          'Fall time t = √(2h / g), independent of horizontal speed U.',
          'Horizontal range from cliff base x = U × t; landing speed v = √(U² + g²t²).',
        ],
        ex: {
          q: 'A stone is thrown horizontally at 15 m s⁻¹ from a 45 m cliff (g = 10 m s⁻²). Find its horizontal distance.',
          steps: [
            ['t = √(2 × 45 / 10) = 3.0 s', 'Vertical free-fall time.'],
            ['x = 15 × 3.0 = 45 m', 'Strikes 45 m from cliff base.'],
          ],
        },
        tryit: {
          q: 'Ball X is dropped vertically while Ball Y is projected horizontally from the same table edge simultaneously. Which hits the floor first?',
          o: ['Both hit at the exact same instant', 'Ball X first', 'Ball Y first', 'Heavier one first'],
          a: 0,
          h: 'Both start with Uy = 0.',
          e: 'Both take t = √(2h/g).',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'At what launch angle to the horizontal is horizontal range maximum?', o: ['45°', '30°', '60°', '90°'], a: 0, e: 'sin 2θ = 1 when θ = 45°.' },
      { l: 2, q: 'A projectile launched at 25° has the same horizontal range as one launched at:', o: ['65°', '50°', '75°', '45°'], a: 0, e: '90° − 25° = 65°.' },
      { l: 3, q: 'A ball is projected at 40 m s⁻¹ at 60° to the horizontal. What is its speed at maximum height?', o: ['20 m s⁻¹', '0 m s⁻¹', '34.6 m s⁻¹', '40 m s⁻¹'], a: 0, e: 'At peak Vy = 0, Vx = 40 cos 60° = 20 m s⁻¹.' },
      { l: 3, q: 'Find the time of flight of an arrow shot at 50 m s⁻¹ at 30° to the horizontal (g = 10 m s⁻²).', o: ['5.0 s', '2.5 s', '8.7 s', '10.0 s'], a: 0, e: 'T = 2(50)(0.5)/10 = 5.0 s.' },
      { l: 4, q: 'A plane flying horizontally at 100 m s⁻¹ at 500 m altitude drops a supply pack (g = 10 m s⁻²). How far horizontally does the pack travel before landing?', o: ['1000 m', '500 m', '2000 m', '707 m'], a: 0, e: 't = √(1000/10) = 10 s; x = 100 × 10 = 1000 m.' },
      { l: 5, q: 'For what launch angle θ does horizontal range R equal four times maximum height H (R = 4H)?', o: ['45°', '30°', '60°', '76°'], a: 0, e: 'tan θ = 4H / R = 1 ⇒ θ = 45°.' },
    ],
  },

  // 13. Equilibrium & Moments
  {
    id: 'p-equilibrium',
    name: 'Moments, Couples & Equilibrium of Rigid Bodies',
    sec: 'SS 2 · First Term · Dynamics & Mechanics',
    boss: 'Moments & Equilibrium Test',
    goals: [
      'Apply the Principle of Moments to uniform and non-uniform beams and metre rules',
      'Calculate couple torque and relate Centre of Gravity to stable, unstable, and neutral equilibrium',
    ],
    trap: 'A uniform metre rule’s weight acts at its 50 cm mark—if the pivot is NOT at 50 cm, always include the rule’s own weight moment!',
    parts: [
      {
        title: 'Principle of Moments & Uniform Metre Rules',
        idea: 'Moment = Force × perpendicular distance from pivot (N m). In rotational equilibrium, clockwise moments equal anticlockwise moments.',
        g: ['physForce', { mode: 'moments' }],
        cap: 'Off-centre metre rule: ruler weight W acts downward at 50 cm.',
        rules: [
          'ΣF_up = ΣF_down and ΣM_clockwise = ΣM_anticlockwise about any point.',
          'Torque of a couple τ = F × d (one force × perpendicular separation between forces).',
        ],
        ex: {
          q: 'A uniform metre rule balances on a knife-edge at 35 cm when a 60 g mass hangs at 10 cm. Find the mass M of the rule.',
          steps: [
            ['Anticlockwise: 60 × (35 − 10) = 60 × 25 = 1500 g cm', 'Measure distances from the 35 cm pivot!'],
            ['Clockwise (rule CG at 50 cm): M × (50 − 35) = 15M ⇒ M = 100 g', 'Mass of metre rule = 100 g.'],
          ],
        },
        tryit: {
          q: 'Two opposite parallel forces of 25 N act at opposite ends of a 0.40 m steering wheel diameter. Find the couple torque.',
          o: ['10 N m', '20 N m', '5 N m', '0 N m'],
          a: 0,
          h: 'τ = F × diameter.',
          e: 'τ = 25 × 0.40 = 10 N m.',
        },
      },
      {
        title: 'Centre of Gravity & Stability',
        idea: 'A low Centre of Gravity (CG) and wide base keep the vertical line of action inside the base when tilted.',
        rules: [
          'Stable: tilting RAISES CG; Unstable: tilting LOWERS CG; Neutral: CG height stays constant.',
          'Triangle of forces / Lami’s theorem applies to three coplanar concurrent forces in equilibrium.',
        ],
        ex: {
          q: 'Why do inter-city luxury buses store heavy luggage below the floor rather than on the roof?',
          steps: [
            ['Lowers the combined Centre of Gravity of the bus', 'Reduces overturning moment on bends.'],
          ],
        },
        tryit: {
          q: 'A ball resting on a flat horizontal table is in:',
          o: ['Neutral equilibrium', 'Stable equilibrium', 'Unstable equilibrium', 'Rotational resonance'],
          a: 0,
          h: 'Rolling does not alter the height of its CG.',
          e: 'Constant CG height = neutral equilibrium.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'The SI unit of moment of a force is:', o: ['N m', 'N m⁻¹', 'J s⁻¹', 'kg m s⁻¹'], a: 0, e: 'Force (N) × distance (m) = N m.' },
      { l: 2, q: 'A couple produces:', o: ['Pure rotation with zero resultant translational force', 'Pure linear acceleration', 'Zero torque', 'Upthrust'], a: 0, e: 'Equal opposite forces give net F = 0 but non-zero torque Fd.' },
      { l: 3, q: 'A uniform metre rule of weight 1.2 N is pivoted at 40 cm. What downward force at 10 cm balances it?', o: ['0.40 N', '1.20 N', '0.60 N', '3.60 N'], a: 0, e: '30F = 1.2 × (50 − 40) = 12 ⇒ F = 0.40 N.' },
      { l: 3, q: 'High stability of a laboratory retort stand or Bunsen burner is achieved by:', o: ['Heavy wide base giving a low centre of gravity', 'Tall thin base', 'Light plastic base', 'High CG'], a: 0, e: 'Low CG + wide base maximizes stability.' },
      { l: 4, q: 'A uniform 4 m plank weighing 200 N rests on end supports A and B. A 600 N painter stands 1 m from A. Find the reaction at A.', o: ['550 N', '250 N', '400 N', '650 N'], a: 0, e: 'Moments about B: 4 R_A = 600(3) + 200(2) = 2200 ⇒ R_A = 550 N.' },
      { l: 5, q: 'A 50 N picture hangs symmetrically from two cords each inclined at 30° to the horizontal ceiling. Find the tension T in each cord.', o: ['50 N', '25 N', '28.9 N', '100 N'], a: 0, e: '2T sin 30° = 50 ⇒ T = 50 N.' },
    ],
  },

  // 14. Circular Motion & SHM
  {
    id: 'p-shm',
    name: 'Circular Motion & Simple Harmonic Motion (SHM)',
    sec: 'SS 2 · First Term · Dynamics & Mechanics',
    boss: 'Circular Motion & SHM Test',
    goals: [
      'Calculate centripetal force mv²/r = mω²r and angular speed ω = 2πf',
      'Solve SHM period formulas T = 2π√(l/g) and T = 2π√(m/k), vmax = ωA, amax = ω²A, and resonance',
    ],
    trap: 'Doubling pendulum length l multiplies period T by √2—to double T, you must QUADRUPLE length l (and bob mass m has NO effect)!',
    parts: [
      {
        title: 'Uniform Circular Motion',
        idea: 'Constant speed around a circle of radius r requires an inward centripetal force Fc = mv²/r = mω²r.',
        rules: [
          'v = ωr;  ω = 2πf = 2π / T (rad s⁻¹);  ac = v² / r.',
          'Centripetal force is perpendicular (90°) to velocity, so work done by Fc = 0 J!',
        ],
        ex: {
          q: 'A 0.5 kg stone on a 2.0 m string is whirled in a horizontal circle at 6 m s⁻¹. Find the centripetal tension.',
          steps: [
            ['Fc = mv² / r = (0.5 × 36) / 2.0 = 9.0 N', 'Inward tension is 9.0 N.'],
          ],
        },
        tryit: {
          q: 'A fan rotates at 120 revolutions per minute. Find its angular speed ω.',
          o: ['4π rad s⁻¹', '2π rad s⁻¹', '120π rad s⁻¹', '60π rad s⁻¹'],
          a: 0,
          h: 'f = 120 / 60 = 2 Hz; ω = 2πf.',
          e: 'ω = 2π(2) = 4π rad s⁻¹.',
        },
      },
      {
        title: 'Simple Harmonic Motion & Resonance',
        idea: 'SHM obeys a = −ω²x: acceleration is proportional to displacement from centre and directed toward equilibrium.',
        rules: [
          'Centre (x = 0): vmax = ωA, KE max, a = 0, PE = 0. Extreme (x = ±A): v = 0, amax = ω²A, PE max.',
          'Simple pendulum: T = 2π√(l/g); Loaded spring: T = 2π√(m/k).',
        ],
        ex: {
          q: 'A pendulum of length 0.56 m has period 1.5 s. What length gives a period of 3.0 s?',
          steps: [
            ['T doubles (×2), and T ∝ √l ⇒ l₂ = 4 × l₁', 'Square the period ratio.'],
            ['l₂ = 4 × 0.56 = 2.24 m', 'New length is 2.24 m.'],
          ],
        },
        tryit: {
          q: 'A particle in SHM has amplitude 0.05 m and ω = 10 rad s⁻¹. Find vmax.',
          o: ['0.50 m s⁻¹', '5.0 m s⁻¹', '0.025 m s⁻¹', '2.0 m s⁻¹'],
          a: 0,
          h: 'vmax = ωA.',
          e: '10 × 0.05 = 0.50 m s⁻¹.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Where is the kinetic energy of a swinging pendulum bob MAXIMUM?', o: ['At the equilibrium centre position', 'At the extreme ends', 'Halfway up', 'Zero everywhere'], a: 0, e: 'Speed is maximum (ωA) as it passes equilibrium.' },
      { l: 2, q: 'Doubling the mass of a simple pendulum bob while keeping length constant makes its period T:', o: ['Unchanged', 'Double', 'Increase by √2', 'Halve'], a: 0, e: 'T = 2π√(l/g) does not depend on mass m.' },
      { l: 3, q: 'Given x = 0.04 sin(20πt) m for an SHM oscillator, what is its frequency f?', o: ['10 Hz', '20 Hz', '40 Hz', '5 Hz'], a: 0, e: '2πf = 20π ⇒ f = 10 Hz.' },
      { l: 3, q: 'What provides centripetal force for a car turning on a flat unbanked road?', o: ['Sideways friction between tyres and road', 'Engine thrust', 'Car weight', 'Air drag'], a: 0, e: 'Static lateral tyre friction acts toward the curve centre.' },
      { l: 4, q: 'A 0.2 kg mass hangs on a spring of k = 20 N m⁻¹. Find its angular frequency ω.', o: ['10 rad s⁻¹', '100 rad s⁻¹', '0.1 rad s⁻¹', '20 rad s⁻¹'], a: 0, e: 'ω = √(k/m) = √(20/0.2) = 10 rad s⁻¹.' },
      { l: 5, q: 'Soldiers break step on suspension bridges to avoid:', o: ['Mechanical resonance causing destructive large-amplitude vibrations', 'Thermal expansion', 'Static electricity', 'Increasing gravity'], a: 0, e: 'Matching driving cadence to natural bridge frequency triggers resonance.' },
    ],
  },

  // 15. Simple Machines
  {
    id: 'p-machines',
    name: 'Simple Machines: Pulleys, Planes & Screw Jacks',
    sec: 'SS 2 · First Term · Physics in Technology',
    boss: 'Simple Machines Mastery Test',
    goals: [
      'Relate Mechanical Advantage (MA = L/E), Velocity Ratio (VR), and Efficiency η = (MA/VR) × 100%',
      'Compute VR for block-and-tackle pulleys, inclined planes (1/sin θ), wheel-and-axle (R/r), and screw jacks (2πr/p)',
    ],
    trap: 'Velocity Ratio (VR) is purely geometric and NEVER changes with friction or load!',
    parts: [
      {
        title: 'MA, VR, Efficiency & Block-and-Tackle Pulleys',
        idea: 'Real machines always have Efficiency < 100% (MA < VR) due to friction and weight of moving blocks.',
        rules: [
          'MA = Load / Effort;  VR = Effort distance / Load distance;  η = (MA / VR) × 100%.',
          'Block-and-tackle VR = number of pulleys (or cords supporting lower block).',
        ],
        ex: {
          q: 'A 5-pulley block-and-tackle lifts 1200 N using 300 N effort. Find its efficiency.',
          steps: [
            ['MA = 1200 / 300 = 4;  VR = 5', '5 pulleys give VR = 5.'],
            ['η = (4 / 5) × 100% = 80%', 'Efficiency is 80%.'],
          ],
        },
        tryit: {
          q: 'A machine of VR = 6 and efficiency 75% lifts a 900 N load. Find the effort required.',
          o: ['200 N', '150 N', '225 N', '112.5 N'],
          a: 0,
          h: 'MA = 0.75 × 6 = 4.5; E = L / MA.',
          e: 'E = 900 / 4.5 = 200 N.',
        },
      },
      {
        title: 'Inclined Plane, Screw Jack, Wheel-and-Axle & Gears',
        idea: 'Each classical machine has a geometry-determined VR.',
        rules: [
          'Inclined plane: VR = l / h = 1 / sin θ.',
          'Screw jack (arm r, pitch p): VR = 2πr / p;  Wheel & axle: VR = R / r.',
          'Gears: VR = Driven wheel teeth ÷ Driving wheel teeth.',
        ],
        ex: {
          q: 'A screw jack has pitch 0.5 cm and handle arm 35 cm (π = 22/7). Find VR.',
          steps: [
            ['VR = 2πr / p = (2 × 22/7 × 35) / 0.5 = 220 / 0.5 = 440', 'VR is 440.'],
          ],
        },
        tryit: {
          q: 'What is the velocity ratio of a smooth plane inclined at 30° to the horizontal?',
          o: ['2', '0.5', '1.73', '3'],
          a: 0,
          h: 'VR = 1 / sin 30°.',
          e: '1 / 0.5 = 2.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Why is the efficiency of a real machine always less than 100%?', o: ['Work is wasted against friction and lifting moving machine parts', 'VR decreases with load', 'Gravity vanishes', 'Effort moves less than load'], a: 0, e: 'Friction and weight of movable parts dissipate input energy.' },
      { l: 2, q: 'A wheelbarrow has the Load between Fulcrum (wheel) and Effort (handles). It is a:', o: ['Second-class lever', 'First-class lever', 'Third-class lever', 'Screw'], a: 0, e: 'FLE rule: Load in the middle = 2nd-class lever.' },
      { l: 3, q: 'A wheel (R = 40 cm) and axle (r = 8 cm) has 80% efficiency. What load does a 50 N effort lift?', o: ['200 N', '250 N', '160 N', '300 N'], a: 0, e: 'VR = 40/8 = 5; MA = 0.8 × 5 = 4 ⇒ L = 4 × 50 = 200 N.' },
      { l: 4, q: 'A 6 m plank rolls a 600 N drum up 1.5 m using a 200 N push. Find efficiency.', o: ['75%', '80%', '66.7%', '50%'], a: 0, e: 'VR = 6/1.5 = 4; MA = 600/200 = 3 ⇒ η = 75%.' },
      { l: 4, q: 'Which quantity of a pulley system stays CONSTANT as load increases?', o: ['Velocity Ratio (VR)', 'Mechanical Advantage', 'Efficiency', 'Effort'], a: 0, e: 'VR depends solely on pulley geometry.' },
      { l: 5, q: 'A machine obeys E = 0.25L + 10 and has VR = 6. What is its limiting efficiency for very large loads?', o: ['66.7%', '25%', '75%', '83.3%'], a: 0, e: 'Max MA → 1 / 0.25 = 4 ⇒ η_max = 4/6 = 66.7%.' },
    ],
  },

  // 16. Calorimetry & Latent Heat
  {
    id: 'p-calorimetry',
    name: 'Specific Heat Capacity & Latent Heat',
    sec: 'SS 2 · Second Term · Thermal Physics',
    boss: 'Calorimetry & Latent Heat Test',
    goals: [
      'Solve calorimetry problems using Q = mcΔθ, Pt = mcΔθ, and Method of Mixtures',
      'Calculate phase-change energy Q = mL_f + mcΔθ and explain pressure/impurity effects on melting and boiling points',
    ],
    trap: 'Turning 0 °C ice into θ °C water needs TWO terms: mL_f (melt at 0 °C) PLUS mc_w θ (warm melted water)!',
    parts: [
      {
        title: 'Specific Heat Capacity & Method of Mixtures',
        idea: 'SHC c (J kg⁻¹ K⁻¹) is heat per kg per K. Water’s high SHC (4200 J kg⁻¹ K⁻¹) makes it the premier coolant.',
        rules: [
          'Q = mcΔθ;  Heat capacity of whole body C = mc (J K⁻¹).',
          'Mixtures (well lagged): Heat lost by hot solid = Heat gained by cold water + calorimeter.',
        ],
        ex: {
          q: 'How long does a 1050 W heater take to warm 2.0 kg of water from 25 °C to 75 °C (c = 4200 J kg⁻¹ K⁻¹)?',
          steps: [
            ['Q = mcΔθ = 2.0 × 4200 × 50 = 420,000 J', 'Energy needed is 420 kJ.'],
            ['t = Q / P = 420,000 / 1050 = 400 s', 'Takes 400 s.'],
          ],
        },
        tryit: {
          q: 'What is the heat capacity C of 0.5 kg of copper of specific heat capacity 400 J kg⁻¹ K⁻¹?',
          o: ['200 J K⁻¹', '800 J K⁻¹', '400 J K⁻¹', '2000 J K⁻¹'],
          a: 0,
          h: 'C = m × c.',
          e: 'C = 0.5 × 400 = 200 J K⁻¹.',
        },
      },
      {
        title: 'Latent Heat of Fusion & Vaporization',
        idea: 'During phase change, temperature stays constant because latent heat Q = mL breaks or forms intermolecular bonds.',
        rules: [
          'Ice L_f = 3.36 × 10⁵ J kg⁻¹; Steam L_v = 2.26 × 10⁶ J kg⁻¹.',
          'Increased pressure RAISES boiling point (pressure cooker) and LOWERS ice melting point (regelation).',
        ],
        ex: {
          q: 'Find total heat to turn 0.05 kg of ice at 0 °C into water at 40 °C (L_f = 3.36 × 10⁵ J kg⁻¹, c = 4200 J kg⁻¹ K⁻¹).',
          steps: [
            ['Melt ice: Q₁ = 0.05 × 336,000 = 16,800 J', 'At constant 0 °C.'],
            ['Warm water: Q₂ = 0.05 × 4200 × 40 = 8,400 J → Total = 25,200 J', '25.2 kJ total.'],
          ],
        },
        tryit: {
          q: 'Why does a pressure cooker cook tough meat much faster than an open pot?',
          o: ['Trapped steam raises pressure so water boils ABOVE 100 °C', 'It lowers boiling point to 80 °C', 'It removes latent heat', 'It creates a vacuum'],
          a: 0,
          h: 'Higher pressure raises boiling temperature.',
          e: 'Water boils around 120 °C under increased steam pressure.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'The SI unit of Specific Heat Capacity is:', o: ['J kg⁻¹ K⁻¹', 'J K⁻¹', 'J kg⁻¹', 'W kg⁻¹'], a: 0, e: 'c = Q / (mΔθ) → J kg⁻¹ K⁻¹.' },
      { l: 2, q: 'Methylated spirit spilled on skin feels chilly because:', o: ['It evaporates rapidly, absorbing latent heat from the skin', 'It chemically reacts with air', 'It is stored below 0 °C', 'It conducts cold'], a: 0, e: 'Rapid evaporation draws latent heat of vaporization from skin.' },
      { l: 3, q: 'Along the flat plateau of a cooling curve during solidification, temperature stays constant because:', o: ['Latent heat released by freezing balances heat lost to surroundings', 'No heat escapes', 'SHC is zero', 'Kinetic energy doubles'], a: 0, e: 'Bond formation releases latent heat at constant freezing temperature.' },
      { l: 4, q: 'Water falls 210 m down a waterfall (g = 10 m s⁻², c = 4200 J kg⁻¹ K⁻¹). Find the max temperature rise at the bottom.', o: ['0.5 °C', '5.0 °C', '2.0 °C', '0.2 °C'], a: 0, e: 'Δθ = gh / c = 2100 / 4200 = 0.5 °C.' },
      { l: 4, q: 'How much heat is given out when 10 g of steam at 100 °C condenses to water at 100 °C? (L_v = 2.26 × 10⁶ J kg⁻¹)', o: ['22,600 J', '2,260 J', '226,000 J', '4,200 J'], a: 0, e: 'Q = 0.010 × 2.26 × 10⁶ = 22,600 J.' },
      { l: 5, q: 'Adding dissolved salt (impurity) to pure water:', o: ['Raises its boiling point above 100 °C and depresses its freezing point below 0 °C', 'Lowers boiling point and raises freezing point', 'Leaves both unchanged', 'Makes it boil at 50 °C'], a: 0, e: 'Impurities elevate boiling point and depress freezing point.' },
    ],
  },

  // 17. Gas Laws & Humidity
  {
    id: 'p-gas-laws',
    name: 'Gas Laws, Kinetic Theory & Relative Humidity',
    sec: 'SS 2 · Second Term · Thermal Physics',
    boss: 'Gas Laws & Humidity Test',
    goals: [
      'Apply Boyle’s, Charles’s, Pressure, and General Gas Law P₁V₁/T₁ = P₂V₂/T₂ using Kelvin temperatures',
      'Relate Saturated Vapour Pressure (SVP), Dew Point, and Relative Humidity',
    ],
    trap: 'ALWAYS convert Celsius to Kelvin (T = θ + 273) BEFORE substituting into Charles’s, Pressure, or General Gas equations!',
    parts: [
      {
        title: 'Boyle’s, Charles’s, Pressure & General Gas Laws',
        idea: 'Ideal gas pressure arises from elastic molecular collisions with container walls; average molecular KE ∝ T (Kelvin).',
        rules: [
          'Boyle (const T): P₁V₁ = P₂V₂;  Charles (const P): V₁/T₁ = V₂/T₂;  General: P₁V₁/T₁ = P₂V₂/T₂.',
          'Rising lake bubble: P₁ = (H_atm + h_depth), P₂ = H_atm.',
        ],
        ex: {
          q: '300 cm³ of gas at 27 °C and 760 mmHg is brought to 127 °C and 380 mmHg. Find V₂.',
          steps: [
            ['T₁ = 300 K, T₂ = 400 K', 'Convert to Kelvin first!'],
            ['V₂ = (760 × 300 × 400) / (380 × 300) = 800 cm³', 'New volume is 800 cm³.'],
          ],
        },
        tryit: {
          q: 'A 2 cm³ air bubble rises from 30 m depth in water to the surface (atmospheric head = 10 m water, constant T). Find its surface volume.',
          o: ['8 cm³', '6 cm³', '4 cm³', '12 cm³'],
          a: 0,
          h: 'P₁ = 10 + 30 = 40 m water; P₂ = 10 m water.',
          e: '40 × 2 = 10 × V₂ ⇒ V₂ = 8 cm³.',
        },
      },
      {
        title: 'SVP, Dew Point & Relative Humidity',
        idea: 'Saturated Vapour Pressure depends ONLY on temperature, and a liquid boils when its SVP equals external atmospheric pressure.',
        rules: [
          'RH = (SVP at dew point ÷ SVP at air temperature) × 100%.',
          'Zero wet-and-dry bulb depression ⇒ RH = 100% (saturated air).',
        ],
        ex: {
          q: 'At 30 °C (SVP = 31.8 mmHg), dew point is 15 °C (SVP = 12.7 mmHg). Find RH.',
          steps: [
            ['RH = (12.7 / 31.8) × 100% ≈ 40%', 'Relative humidity is 40%.'],
          ],
        },
        tryit: {
          q: 'When wet-bulb and dry-bulb thermometers read the exact same temperature, relative humidity is:',
          o: ['100%', '0%', '50%', '25%'],
          a: 0,
          h: 'No evaporation is occurring.',
          e: 'Air is completely saturated (100% RH).',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Average translational kinetic energy of gas molecules is directly proportional to:', o: ['Absolute temperature in Kelvin', 'Container volume', 'Atmospheric pressure', 'Molar mass'], a: 0, e: 'KE_avg = (3/2)kT ∝ T.' },
      { l: 2, q: 'A gas at 27 °C is heated at constant pressure until its volume doubles. Its final temperature in °C is:', o: ['327 °C', '54 °C', '600 °C', '150 °C'], a: 0, e: 'T₂ = 2 × 300 K = 600 K = 327 °C.' },
      { l: 3, q: 'Saturated vapour pressure (SVP) in a closed vessel with excess liquid:', o: ['Increases with temperature and is independent of volume', 'Obeys Boyle’s law', 'Halves when volume doubles', 'Drops on heating'], a: 0, e: 'SVP is a function of temperature alone.' },
      { l: 3, q: 'Dew or mist forms at dawn when:', o: ['Moist air cools below its dew point', 'Air warms above 35 °C', 'RH drops to 15%', 'Wind stops gravity'], a: 0, e: 'Cooling below dew point condenses water vapour.' },
      { l: 4, q: 'A tyre at 2.0 × 10⁵ Pa and 17 °C warms to 46 °C at constant volume. Find the new pressure.', o: ['2.2 × 10⁵ Pa', '5.4 × 10⁵ Pa', '1.8 × 10⁵ Pa', '2.5 × 10⁵ Pa'], a: 0, e: 'P₂ = 2.0 × 10⁵ × (319 / 290) = 2.2 × 10⁵ Pa.' },
      { l: 5, q: 'Smoke-cell Brownian motion proves directly that:', o: ['Air molecules are in continuous random motion bombarding smoke specks', 'Electrons are negative', 'Smoke is lighter than vacuum', 'Convection is absent'], a: 0, e: 'Uneven molecular impacts cause random jittering.' },
    ],
  },

  // 18. Wave Motion
  {
    id: 'p-waves',
    name: 'Wave Motion, Progressive Equation & Wave Phenomena',
    sec: 'SS 2 · Second Term · Waves & Optics',
    boss: 'Wave Motion & Equations Test',
    goals: [
      'Apply v = fλ and extract A, f, λ, v from y = A sin(2πft − 2πx/λ)',
      'Distinguish diffraction, interference, stationary node/antinode spacing, and transverse polarization',
    ],
    trap: 'ONLY transverse waves can be polarized (sound CANNOT!), and adjacent node-to-node spacing on a standing wave is λ/2, NOT λ!',
    parts: [
      {
        title: 'Wave Speed v = fλ & Progressive Equation',
        idea: 'Compare any progressive wave directly against y = A sin(ωt − kx) where ω = 2πf and k = 2π/λ.',
        g: ['physWave', { mode: 'progressive' }],
        cap: 'Sinusoidal wave profile with amplitude A and wavelength λ.',
        rules: [
          'v = fλ = ω / k;  T = 1 / f.',
          'Phase difference Δφ = (2π / λ) Δx.',
        ],
        ex: {
          q: 'Given y = 0.05 sin(200πt − 4πx) in SI units, find f, λ, and v.',
          steps: [
            ['2πf = 200π ⇒ f = 100 Hz;  2π/λ = 4π ⇒ λ = 0.50 m', 'Match coefficients.'],
            ['v = fλ = 100 × 0.50 = 50 m s⁻¹', 'Wave speed is 50 m s⁻¹.'],
          ],
        },
        tryit: {
          q: 'Find the wavelength of a 100 MHz (10⁸ Hz) FM radio wave (c = 3.0 × 10⁸ m s⁻¹).',
          o: ['3.0 m', '0.33 m', '30 m', '300 m'],
          a: 0,
          h: 'λ = c / f.',
          e: '3.0 × 10⁸ / 10⁸ = 3.0 m.',
        },
      },
      {
        title: 'Standing Waves, Diffraction & Polarization',
        idea: 'Standing waves form nodes (zero amplitude) and antinodes (max amplitude) spaced λ/4 apart.',
        rules: [
          'Node to adjacent Node = λ/2; Node to adjacent Antinode = λ/4.',
          'Refraction into shallow water: speed v and λ DECREASE while frequency f stays CONSTANT.',
          'Polarization occurs ONLY in transverse waves (light, EM waves), never longitudinal sound.',
        ],
        ex: {
          q: '4 consecutive nodes on a standing wave span 36 cm. Find the wavelength λ.',
          steps: [
            ['4 nodes enclose 3 gaps of λ/2: 3(λ/2) = 36 cm ⇒ λ = 24 cm', 'Count gaps (n − 1)!'],
          ],
        },
        tryit: {
          q: 'Which phenomenon distinguishes light waves from sound waves?',
          o: ['Polarization', 'Diffraction', 'Interference', 'Refraction'],
          a: 0,
          h: 'Only transverse waves can be plane-polarized.',
          e: 'Polarization proves light is transverse.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Which wave below is longitudinal and mechanical?', o: ['Sound wave in air', 'Light wave', 'X-ray', 'Radio wave'], a: 0, e: 'Sound vibrates parallel to propagation in a medium.' },
      { l: 2, q: 'When water ripples pass from deep into shallow water, what stays constant?', o: ['Frequency f', 'Speed v', 'Wavelength λ', 'Refracted angle'], a: 0, e: 'Source frequency never changes on refraction.' },
      { l: 3, q: 'Distance between a node and the nearest antinode is:', o: ['λ / 4', 'λ / 2', 'λ', '2λ'], a: 0, e: 'Half of an internodal loop (λ/2 ÷ 2 = λ/4).' },
      { l: 4, q: 'For y = 4 sin 2π(50t − x/10) (cm, s), find the wave speed.', o: ['500 cm s⁻¹', '5 cm s⁻¹', '50 cm s⁻¹', '200 cm s⁻¹'], a: 0, e: 'f = 50 Hz, λ = 10 cm ⇒ v = 500 cm s⁻¹.' },
      { l: 4, q: 'Sound bends easily around doorways while light casts sharp shadows because:', o: ['Sound wavelength (~1 m) matches doorway width, giving strong diffraction', 'Sound is faster than light', 'Light is longitudinal', 'Sound is electromagnetic'], a: 0, e: 'Diffraction peaks when λ ≈ gap width.' },
      { l: 5, q: 'Two points 0.20 m apart on a wave of wavelength 0.80 m have phase difference:', o: ['π / 2 rad', 'π rad', '2π rad', 'π / 4 rad'], a: 0, e: 'Δφ = (2π / 0.80) × 0.20 = π / 2 rad.' },
    ],
  },

  // 19. Sound Waves
  {
    id: 'p-sound',
    name: 'Sound Waves: Echoes, Strings & Resonance Pipes',
    sec: 'SS 2 · Second Term · Waves & Optics',
    boss: 'Sound, Echoes & Harmonics Test',
    goals: [
      'Solve echo/SONAR problems d = vt/2 and relate pitch, loudness, and quality/timbre',
      'Calculate harmonics in stretched strings, closed pipes (odd harmonics f₀, 3f₀, 5f₀), and open pipes (all harmonics)',
    ],
    trap: 'Echoes travel a round-trip 2d (d = vt/2), and a CLOSED pipe produces ONLY ODD harmonics (1st overtone = 3f₀)!',
    parts: [
      {
        title: 'Echoes, SONAR & Musical Characteristics',
        idea: 'Sound speed increases with temperature (v ∝ √T) and is fastest in solids, slower in liquids, slowest in gases.',
        rules: [
          'Echo distance d = vt / 2;  Beat frequency = |f₁ − f₂|.',
          'Pitch ↔ frequency; Loudness ↔ amplitude²; Quality/Timbre ↔ overtones.',
        ],
        ex: {
          q: 'A ship’s sonar pulse returns from the seabed in 0.80 s (v = 1500 m s⁻¹). Find ocean depth.',
          steps: [
            ['d = vt / 2 = (1500 × 0.80) / 2 = 600 m', 'Divide round-trip distance by 2!'],
          ],
        },
        tryit: {
          q: '256 Hz and 260 Hz tuning forks sounded together produce how many beats per second?',
          o: ['4 Hz', '516 Hz', '2 Hz', '258 Hz'],
          a: 0,
          h: '|f₂ − f₁|.',
          e: '260 − 256 = 4 Hz.',
        },
      },
      {
        title: 'Sonometer Strings, Closed Pipes & Open Pipes',
        idea: 'Closed ends force displacement nodes; open ends form antinodes.',
        g: ['physWave', { mode: 'pipes' }],
        cap: 'Closed pipe L = λ/4 (f₀ = v/4L) vs Open pipe L = λ/2 (f₀ = v/2L).',
        rules: [
          'Sonometer string: f₀ = [1/(2l)] √(T/μ).',
          'Closed pipe: f₀ = v / (4L); harmonics = f₀, 3f₀, 5f₀ (odd only!).',
          'Open pipe: f₀ = v / (2L); harmonics = f₀, 2f₀, 3f₀ (all integers).',
        ],
        ex: {
          q: 'Find f₀ and the 1st overtone of a 0.25 m closed pipe (v = 340 m s⁻¹).',
          steps: [
            ['f₀ = 340 / (4 × 0.25) = 340 Hz;  1st overtone = 3f₀ = 1020 Hz', 'Odd harmonics only!'],
          ],
        },
        tryit: {
          q: 'Quadrupling (×4) the tension in a sonometer wire of f₀ = 200 Hz changes f₀ to:',
          o: ['400 Hz', '800 Hz', '200 Hz', '100 Hz'],
          a: 0,
          h: 'f ∝ √T.',
          e: '200 × √4 = 400 Hz.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Distinguishing the same note on a flute vs violin relies on:', o: ['Quality / Timbre (overtones)', 'Pitch', 'Wave speed', 'Echo'], a: 0, e: 'Harmonic overtone content determines timbre.' },
      { l: 2, q: 'A clap 170 m from a cliff echoes back in what time (v = 340 m s⁻¹)?', o: ['1.0 s', '0.5 s', '2.0 s', '0.25 s'], a: 0, e: 't = 2(170)/340 = 1.0 s.' },
      { l: 3, q: 'Find the fundamental frequency of a 0.50 m OPEN pipe (v = 330 m s⁻¹).', o: ['330 Hz', '165 Hz', '660 Hz', '82.5 Hz'], a: 0, e: 'f₀ = v/(2L) = 330 / 1.0 = 330 Hz.' },
      { l: 4, q: 'In a resonance tube, 1st resonance is at 16 cm and 2nd resonance at 50 cm. Find λ.', o: ['68 cm', '34 cm', '66 cm', '100 cm'], a: 0, e: 'λ = 2(l₂ − l₁) = 2(34) = 68 cm.' },
      { l: 4, q: 'Ratio of 1st overtone to fundamental in a CLOSED pipe is:', o: ['3 : 1', '2 : 1', '4 : 1', '5 : 1'], a: 0, e: 'Closed pipe harmonics are f₀, 3f₀, 5f₀.' },
      { l: 5, q: 'Heating air from 27 °C (300 K) to 927 °C (1200 K) changes sound speed by factor:', o: ['2', '4', '1', '0.5'], a: 0, e: 'v ∝ √T ⇒ √(1200/300) = 2.' },
    ],
  },

  // 20. Reflection & Mirrors
  {
    id: 'p-reflection',
    name: 'Rectilinear Light, Plane & Spherical Mirrors',
    sec: 'SS 2 · Third Term · Waves & Optics',
    boss: 'Plane & Curved Mirrors Test',
    goals: [
      'Apply inclined mirror image count N = (360°/θ) − 1, mirror rotation 2α, and pinhole magnification',
      'Solve concave (+f) and convex (−f) mirror problems via 1/f = 1/u + 1/v and m = v/u',
    ],
    trap: 'A CONVEX mirror ALWAYS has NEGATIVE focal length (−f) and negative virtual image distance (−v) in Real-is-Positive convention!',
    parts: [
      {
        title: 'Pinhole Camera & Plane Mirrors',
        idea: 'Inclined mirrors multiply reflections by N = (360°/θ) − 1; rotating a mirror by α turns the reflected ray by 2α.',
        rules: [
          'Plane mirror image: virtual, upright, same size, laterally inverted, v = u.',
          'N = (360° / θ) − 1;  Reflected ray rotation = 2α.',
        ],
        ex: {
          q: 'How many images form between two plane mirrors inclined at 45°?',
          steps: [
            ['N = (360 / 45) − 1 = 8 − 1 = 7 images', '7 images formed.'],
          ],
        },
        tryit: {
          q: 'A plane mirror turns through 12° with fixed incident ray. The reflected ray turns through:',
          o: ['24°', '12°', '6°', '48°'],
          a: 0,
          h: '2 × mirror angle.',
          e: '2 × 12° = 24°.',
        },
      },
      {
        title: 'Concave & Convex Mirrors (1/f = 1/u + 1/v)',
        idea: 'f = r/2. Concave (+f) magnifies upright only when u < f; Convex (−f) gives wide upright driving view.',
        g: ['physOptics', { mode: 'concave' }],
        cap: 'Concave mirror ray construction through principal focus F and centre C.',
        rules: [
          '1/f = 1/u + 1/v;  m = |v / u|.',
          'Concave: u = 2f → real, same size; u < f → virtual, erect, magnified (−v).',
          'Convex (−f): always virtual, erect, diminished (−v).',
        ],
        ex: {
          q: 'An object is 30 cm before a concave mirror of f = 10 cm. Find v and m.',
          steps: [
            ['1/v = 1/10 − 1/30 = 2/30 ⇒ v = +15 cm;  m = 15/30 = 0.5', 'Real inverted image at 15 cm.'],
          ],
        },
        tryit: {
          q: 'Why are convex mirrors used as vehicle wing mirrors?',
          o: ['They form erect images over a very wide field of view', 'They magnify objects 5×', 'They project real images', 'They absorb headlights'],
          a: 0,
          h: 'Diverging rays capture wide traffic angles.',
          e: 'Erect image + wide field of view.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Solar eclipse occurs when:', o: ['The Moon lies directly between Sun and Earth', 'Earth lies between Sun and Moon', 'Sun lies between Earth and Moon', 'Mars blocks Sun'], a: 0, e: 'Moon casts its shadow onto Earth.' },
      { l: 2, q: 'Widening the pinhole of a pinhole camera makes the image:', o: ['Brighter and blurred', 'Sharper and dimmer', 'Erect', 'Smaller'], a: 0, e: 'Overlapping rays brighten but blur the image.' },
      { l: 3, q: 'A concave mirror has radius of curvature 24 cm. Where does an object give a real image of equal size?', o: ['24 cm from pole', '12 cm', '36 cm', '6 cm'], a: 0, e: 'At C (u = r = 2f = 24 cm), m = 1.' },
      { l: 4, q: 'An object is 6 cm before a concave mirror of f = 12 cm. Find v.', o: ['12 cm behind mirror (virtual, m = 2)', '12 cm in front', '4 cm in front', '6 cm behind'], a: 0, e: '1/v = 1/12 − 1/6 = −1/12 ⇒ v = −12 cm.' },
      { l: 4, q: 'An object is 20 cm before a CONVEX mirror of focal length 20 cm (f = −20 cm). Find v.', o: ['10 cm behind mirror (virtual)', '20 cm in front', 'Infinity', '40 cm behind'], a: 0, e: '1/v = −1/20 − 1/20 = −1/10 ⇒ v = −10 cm.' },
      { l: 5, q: 'A boy walks toward a plane mirror at 2.5 m s⁻¹. At what speed does he approach his image?', o: ['5.0 m s⁻¹', '2.5 m s⁻¹', '1.25 m s⁻¹', '0 m s⁻¹'], a: 0, e: 'Relative approach speed = 2 × 2.5 = 5.0 m s⁻¹.' },
    ],
  },

  // 21. Refraction, TIR & Prisms
  {
    id: 'p-refraction',
    name: 'Refraction, Total Internal Reflection & Prisms',
    sec: 'SS 2 · Third Term · Waves & Optics',
    boss: 'Refraction, TIR & Prisms Test',
    goals: [
      'Apply Snell’s Law n = sin i / sin r = c/v = Real Depth / Apparent Depth',
      'Solve critical angle sin C = 1/n, Total Internal Reflection, and prism minimum deviation',
    ],
    trap: 'Total Internal Reflection ONLY happens going from DENSER to LESS DENSE medium when i > C!',
    parts: [
      {
        title: 'Snell’s Law & Apparent Depth',
        idea: 'Refractive index n links angles, wave speeds, and apparent upward shift d = H(1 − 1/n).',
        rules: [
          'n = sin i / sin r = c_air / v_medium = Real Depth / Apparent Depth.',
          'Upward displacement d = H − H/n.',
        ],
        ex: {
          q: 'A pool is 2.4 m deep (n = 4/3). Find its apparent depth and apparent upward shift.',
          steps: [
            ['Apparent depth = 2.4 / (4/3) = 1.8 m;  Shift = 2.4 − 1.8 = 0.6 m', 'Appears 1.8 m deep.'],
          ],
        },
        tryit: {
          q: 'Find light speed in glass of n = 1.5 (c = 3.0 × 10⁸ m s⁻¹).',
          o: ['2.0 × 10⁸ m s⁻¹', '4.5 × 10⁸ m s⁻¹', '1.5 × 10⁸ m s⁻¹', '3.0 × 10⁸ m s⁻¹'],
          a: 0,
          h: 'v = c / n.',
          e: '3.0 × 10⁸ / 1.5 = 2.0 × 10⁸ m s⁻¹.',
        },
      },
      {
        title: 'Critical Angle, TIR & Triangular Prisms',
        idea: 'sin C = 1/n. At minimum deviation D_m in prism A: n = sin[(A + D_m)/2] / sin(A/2).',
        g: ['physOptics', { mode: 'prism' }],
        cap: 'Symmetrical refraction through a 60° glass prism at minimum deviation.',
        rules: [
          'sin C = 1 / n;  TIR occurs when denser → rarer AND i > C (optical fibres, mirages, prism periscopes).',
          'At minimum deviation: D_m = 2i − A and r = A / 2.',
        ],
        ex: {
          q: 'A 60° prism gives minimum deviation 30°. Find n.',
          steps: [
            ['n = sin[(60+30)/2] / sin(60/2) = sin 45° / sin 30° = 0.707 / 0.5 = 1.41', 'n = √2 ≈ 1.41.'],
          ],
        },
        tryit: {
          q: 'Find the critical angle C of a crystal of refractive index n = 2.0.',
          o: ['30°', '45°', '60°', '42°'],
          a: 0,
          h: 'sin C = 1 / 2.0 = 0.5.',
          e: 'C = 30°.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Conditions for Total Internal Reflection are:', o: ['Light travels denser → less dense medium AND angle of incidence > critical angle', 'Air → glass AND i > C', 'i = 0°', 'n = 1'], a: 0, e: 'Both conditions must hold simultaneously.' },
      { l: 2, q: 'A 9 cm thick glass block (n = 1.5) is placed over a mark. How far upward does the mark appear shifted?', o: ['3 cm', '6 cm', '9 cm', '4.5 cm'], a: 0, e: 'h = 9/1.5 = 6 cm ⇒ shift d = 9 − 6 = 3 cm.' },
      { l: 3, q: 'Light enters glass at i = 60° and refracts at r = 30°. Find n.', o: ['1.73 (√3)', '0.58', '2.0', '1.50'], a: 0, e: 'sin 60° / sin 30° = √3 ≈ 1.73.' },
      { l: 3, q: 'Telecommunication optical fibres transmit signals using:', o: ['Repeated Total Internal Reflection inside a higher-index core', 'Silver mirrors', 'Diffraction', 'Conduction'], a: 0, e: 'Core n > cladding n gives lossless TIR.' },
      { l: 4, q: 'Right-angled prisms beat plane mirrors in periscopes because:', o: ['TIR gives 100% reflection with no multiple ghost images', 'Prisms magnify 50×', 'Prisms absorb light', 'No refraction ever occurs'], a: 0, e: 'Avoids silver tarnish and ghost reflections.' },
      { l: 5, q: 'At minimum deviation in a 60° prism, angle of incidence i = 48°. Find D_m.', o: ['36°', '48°', '24°', '60°'], a: 0, e: 'D_m = 2i − A = 96° − 60° = 36°.' },
    ],
  },

  // 22. Thin Lenses, Vision & EM Spectrum
  {
    id: 'p-lenses',
    name: 'Thin Lenses, Eye Defects, Dispersion & EM Spectrum',
    sec: 'SS 2 · Third Term · Waves & Optics',
    boss: 'Lenses, Vision & EM Spectrum Test',
    goals: [
      'Apply 1/f = 1/u + 1/v and lens power P = 100/f(cm) dioptres',
      'Correct myopia and hypermetropia, and order ROYGBIV dispersion and the EM spectrum',
    ],
    trap: 'Lens power P = 1/f requires f in METRES—and in a glass prism RED deviates LEAST while VIOLET deviates MOST!',
    parts: [
      {
        title: 'Thin Lenses, Power & Vision Defects',
        idea: 'Convex (+f, +D) converges rays and corrects long-sightedness; Concave (−f, −D) diverges rays and corrects short-sightedness.',
        g: ['physOptics', { mode: 'lens' }],
        cap: 'Converging lens ray diagram forming a real inverted image.',
        rules: [
          '1/f = 1/u + 1/v;  P = 1/f(m) = 100/f(cm) D.',
          'Myopia (short-sighted): concave (−D) lens; Hypermetropia (long-sighted): convex (+D) lens.',
        ],
        ex: {
          q: 'A 4 cm object stands 15 cm before a +10 cm convex lens. Find v, image height, and power.',
          steps: [
            ['1/v = 1/10 − 1/15 = 1/30 ⇒ v = +30 cm; m = 2 ⇒ h_i = 8 cm; P = +10 D', 'Real magnified image.'],
          ],
        },
        tryit: {
          q: 'Find the focal length of a −2.5 D spectacle lens.',
          o: ['−40 cm (diverging)', '+40 cm', '−25 cm', '+25 cm'],
          a: 0,
          h: 'f = 100 / (−2.5) cm.',
          e: '−40 cm concave lens.',
        },
      },
      {
        title: 'Dispersion & Electromagnetic Spectrum',
        idea: 'All EM waves travel at 3.0 × 10⁸ m s⁻¹ in vacuum, ordered Radio → Microwave → IR → Visible → UV → X-ray → Gamma.',
        rules: [
          'In glass: Red = longest λ, fastest speed, least deviation; Violet = shortest λ, slowest speed, greatest deviation.',
          'Additive light primaries: Red + Green = Yellow; Red + Blue = Magenta; Green + Blue = Cyan.',
        ],
        ex: {
          q: 'What colour does a yellow shirt appear under pure blue light?',
          steps: [
            ['Yellow reflects R + G and absorbs Blue → appears BLACK!', 'Zero reflected light.'],
          ],
        },
        tryit: {
          q: 'Which EM wave has the shortest wavelength and highest photon energy?',
          o: ['Gamma rays', 'Radio waves', 'Infrared', 'Ultraviolet'],
          a: 0,
          h: 'Highest frequency end of the EM spectrum.',
          e: 'Gamma rays.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Myopia (short-sightedness) is corrected with:', o: ['A diverging (concave) lens', 'A converging (convex) lens', 'Plane glass', 'Opaque patch'], a: 0, e: 'Diverging lens shifts focus back onto the retina.' },
      { l: 2, q: 'In vacuum, radio waves and gamma rays have the same:', o: ['Speed (3.0 × 10⁸ m s⁻¹)', 'Frequency', 'Wavelength', 'Photon energy'], a: 0, e: 'All EM waves share c in vacuum.' },
      { l: 3, q: 'Which colour of white light deviates LEAST through a glass prism?', o: ['Red', 'Violet', 'Blue', 'Indigo'], a: 0, e: 'Red travels fastest in glass and bends least.' },
      { l: 3, q: 'A convex lens acts as a magnifying glass (virtual upright image) when:', o: ['u < f', 'u = 2f', 'u > 2f', 'u = ∞'], a: 0, e: 'Object inside focal length gives virtual magnified image.' },
      { l: 4, q: 'Lenses of +6.0 D and −2.0 D in contact have combined focal length:', o: ['+25 cm', '+50 cm', '+12.5 cm', '−25 cm'], a: 0, e: 'P = +4.0 D ⇒ f = 100/4 = +25 cm.' },
      { l: 5, q: 'An astronomical telescope in normal adjustment has f_o = 80 cm and f_e = 4 cm. Find magnification M and length L.', o: ['M = 20, L = 84 cm', 'M = 20, L = 76 cm', 'M = 320, L = 84 cm', 'M = 40, L = 80 cm'], a: 0, e: 'M = f_o/f_e = 20; L = f_o + f_e = 84 cm.' },
    ],
  },
];
