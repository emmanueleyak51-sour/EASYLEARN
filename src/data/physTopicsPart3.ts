import type { Topic } from '../types';

export const PHYS_TOPICS_PART3: Topic[] = [
  // 23. Gravitational Field & Satellites
  {
    id: 'p-gravitation',
    name: 'Gravitational Field, Potential & Satellites',
    sec: 'SS 3 · First Term · Fields & Potentials',
    boss: 'Gravitation & Escape Velocity Test',
    goals: [
      'Apply Newton’s Law of Universal Gravitation F = Gm₁m₂/r², surface gravity g = GM/R², and gravitational potential V = −GM/r',
      'Calculate orbital speed v₀ = √(GM/r), escape velocity vₑ = √(2gR) = √(2GM/R), and geostationary satellite properties',
    ],
    trap: 'Escape velocity vₑ = √(2gR) ≈ 11.2 km s⁻¹ on Earth is INDEPENDENT of the mass of the rocket or projectile being launched!',
    parts: [
      {
        title: 'Universal Gravitation, Field Strength g & Potential',
        idea: 'Every mass attracts every other mass with F = Gm₁m₂/r². Near a planet of mass M and radius R, g = GM/R² (so GM = gR²!).',
        rules: [
          'F = Gm₁m₂ / r² (G = 6.67 × 10⁻¹¹ N m² kg⁻²).',
          'At altitude h above surface (r = R + h): g_h = g₀ [R / (R + h)]².',
          'Gravitational potential V = −GM / r (J kg⁻¹); negative because gravity is attractive and V = 0 at infinity.',
        ],
        ex: {
          q: 'Surface gravity on Earth is 10 m s⁻². Find g at an altitude equal to ONE Earth radius above the surface (h = R).',
          steps: [
            ['Distance from Earth’s centre r = R + R = 2R', 'Always measure r from the planet’s CENTRE!'],
            ['g_h = 10 × (R / 2R)² = 10 / 4 = 2.5 m s⁻²', 'Inverse-square law quarters g at 2R.'],
          ],
        },
        tryit: {
          q: 'What is the SI unit of gravitational potential V?',
          o: ['J kg⁻¹', 'N kg⁻¹', 'J m⁻¹', 'N m² kg⁻²'],
          a: 0,
          h: 'Potential = Work done per unit mass (W / m).',
          e: 'V = W / m has SI unit J kg⁻¹ (equivalent to m² s⁻²).',
        },
      },
      {
        title: 'Orbital Velocity, Escape Velocity & Parking Orbits',
        idea: 'Gravity supplies centripetal force for satellites (mv²/r = GMm/r²). Escape velocity is √2 × close-surface orbital speed.',
        rules: [
          'Orbital speed v₀ = √(GM / r); near Earth surface v₀ = √(gR) ≈ 7.9 km s⁻¹.',
          'Escape velocity vₑ = √(2GM / R) = √(2gR) = √2 × v₀ ≈ 11.2 km s⁻¹.',
          'Geostationary (parking-orbit) telecommunications satellite: period T = 24 hours, equatorial West-to-East orbit (~36,000 km altitude).',
        ],
        ex: {
          q: 'Calculate the escape velocity from a planet of radius R = 6.4 × 10⁶ m where surface g = 10 m s⁻².',
          steps: [
            ['vₑ = √(2gR) = √(2 × 10 × 6.4 × 10⁶) = √(1.28 × 10⁸)', 'Substitute g and R in SI units.'],
            ['vₑ ≈ 1.13 × 10⁴ m s⁻¹ = 11.3 km s⁻¹', 'Independent of rocket mass.'],
          ],
        },
        tryit: {
          q: 'What is the orbital period of a geostationary communication satellite?',
          o: ['24 hours', '12 hours', '90 minutes', '365 days'],
          a: 0,
          h: 'Matches Earth’s axial rotation period so it stays fixed above one longitude.',
          e: '24 hours.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Why does acceleration due to gravity g vary slightly from the Equator to the Poles on Earth?', o: ['Earth is an oblate spheroid (polar radius < equatorial radius) plus axial rotation', 'The Moon sits at the North Pole', 'Air pressure is zero at poles', 'G changes with temperature'], a: 0, e: 'Smaller polar radius R puts the poles closer to Earth’s centre, making g slightly larger at the poles.' },
      { l: 2, q: 'A 5 kg stone and a 500 kg satellite are launched from Earth. Compare their required escape velocities:', o: ['Identical for both (vₑ = √(2gR) is independent of projectile mass)', '500 kg needs 100× greater speed', '500 kg needs 10× greater speed', '5 kg needs 10× greater speed'], a: 0, e: 'Mass m cancels in ½mvₑ² = GMm/R.' },
      { l: 3, q: 'How are close-surface orbital speed v₀ and escape velocity vₑ related?', o: ['vₑ = v₀ √2', 'vₑ = 2 v₀', 'v₀ = vₑ √2', 'vₑ = 4 v₀'], a: 0, e: 'v₀ = √(gR) and vₑ = √(2gR) = √2 v₀.' },
      { l: 4, q: 'If the distance between two point masses is tripled (×3), the gravitational force between them becomes:', o: ['1/9 of its original value', '1/3 of its original value', '3 times larger', '9 times larger'], a: 0, e: 'Inverse-square law: F ∝ 1 / r² ⇒ 1 / 3² = 1/9.' },
      { l: 4, q: 'Find the gravitational potential at a point where 2.4 × 10⁷ J of work is done bringing a 2.0 kg mass from infinity.', o: ['−1.2 × 10⁷ J kg⁻¹', '+4.8 × 10⁷ J kg⁻¹', '−2.4 × 10⁷ J kg⁻¹', '+1.2 × 10⁷ N'], a: 0, e: 'Gravitational potential is negative: V = −W/m = −(2.4 × 10⁷)/2 = −1.2 × 10⁷ J kg⁻¹.' },
      { l: 5, q: 'Planet X has TWICE the mass of Earth and TWICE the radius of Earth. If Earth’s surface gravity is g, surface gravity on Planet X is:', o: ['g / 2', 'g', '2g', '4g'], a: 0, e: 'g_X = G(2M) / (2R)² = (2/4)(GM/R²) = g / 2.' },
    ],
  },

  // 24. Electric Fields, Coulomb's Law & Capacitors
  {
    id: 'p-efield-cap',
    name: 'Coulomb’s Law, Electric Potential & Capacitors',
    sec: 'SS 3 · First Term · Fields & Potentials',
    boss: 'Electric Fields & Capacitors Test',
    goals: [
      'Calculate Coulomb force F = kq₁q₂/r², electric field intensity E = F/q = V/d, and electric potential V = kq/r',
      'Solve parallel-plate capacitance C = εA/d, Q = CV, stored energy W = ½CV², and series/parallel capacitor networks',
    ],
    trap: 'Capacitor formulas are the EXACT OPPOSITE of resistor formulas: Capacitors in PARALLEL ADD (C = C₁ + C₂), whereas in SERIES 1/C = 1/C₁ + 1/C₂!',
    parts: [
      {
        title: 'Coulomb’s Law, Field Intensity E & Potential V',
        idea: 'Electric field lines point away from +Q and toward −Q. Between parallel plates at p.d. V and separation d, uniform field E = V / d (V m⁻¹ or N C⁻¹).',
        rules: [
          'F = kq₁q₂ / r²  where k = 1/(4πε₀) ≈ 9.0 × 10⁹ N m² C⁻².',
          'Electric field intensity E = F / q = kQ / r² (vector, N C⁻¹ or V m⁻¹).',
          'Electric potential V = W / q = kQ / r (scalar, volts V); Work moving charge q across ΔV is W = qΔV (1 eV = 1.6 × 10⁻¹⁹ J).',
        ],
        ex: {
          q: 'Two parallel metal plates 4.0 mm apart are connected to a 200 V DC supply. Find (i) the uniform electric field E between them and (ii) the force on an electron (e = 1.6 × 10⁻¹⁹ C).',
          steps: [
            ['d = 4.0 mm = 4.0 × 10⁻³ m ⇒ E = V / d = 200 / (4.0 × 10⁻³) = 5.0 × 10⁴ V m⁻¹', 'Convert mm to m!'],
            ['F = qE = 1.6 × 10⁻¹⁹ × 5.0 × 10⁴ = 8.0 × 10⁻¹⁵ N', 'Directed toward the positive plate.'],
          ],
        },
        tryit: {
          q: 'Find the electrostatic force between +2 μC and +4 μC point charges placed 0.20 m apart in air (k = 9.0 × 10⁹ N m² C⁻²).',
          o: ['1.8 N', '0.36 N', '18 N', '3.6 N'],
          a: 0,
          h: 'F = (9 × 10⁹ × 2 × 10⁻⁶ × 4 × 10⁻⁶) / (0.20)².',
          e: 'Numerator = 7.2 × 10⁻²; divide by 0.04 = 1.8 N repulsion.',
        },
      },
      {
        title: 'Capacitors: Geometry, Dielectrics, Networks & Stored Energy',
        idea: 'Capacitance C = Q / V (in farads F). For parallel plates C = εᵣε₀A / d: bigger plate area A, closer gap d, or higher dielectric εᵣ increases C!',
        g: ['physCircuit', { mode: 'capacitors' }],
        cap: 'Capacitors in parallel add directly (C = C₁ + C₂); in series reciprocals add.',
        rules: [
          'Q = CV;  Energy stored W = ½QV = ½CV² = ½Q²/C.',
          'Parallel capacitors (same V): C_total = C₁ + C₂ + C₃.',
          'Series capacitors (same charge Q!): 1/C_total = 1/C₁ + 1/C₂.',
        ],
        ex: {
          q: 'Two capacitors of 3 μF and 6 μF are connected in SERIES across a 12 V battery. Find (i) equivalent capacitance, (ii) charge on each capacitor, and (iii) total stored energy.',
          steps: [
            ['Series C = (3 × 6) / (3 + 6) = 18 / 9 = 2.0 μF', 'Series capacitance is smaller than 3 μF!'],
            ['Charge on EACH series capacitor Q = C_total × V = 2.0 μF × 12 V = 24 μC', 'Same charge Q on series capacitors.'],
            ['Energy W = ½CV² = ½ × 2.0 × 10⁻⁶ × 144 = 1.44 × 10⁻⁴ J', '144 μJ stored.'],
          ],
        },
        tryit: {
          q: 'Which change DOUBLES the capacitance of an air-filled parallel-plate capacitor?',
          o: ['Halving the distance d between the plates', 'Doubling the distance d between plates', 'Halving plate area A', 'Doubling the battery voltage'],
          a: 0,
          h: 'C = ε₀A / d (independent of applied voltage V!).',
          e: 'Since C ∝ 1/d, halving separation d doubles C.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: '1 electron-volt (1 eV) of energy is equal to:', o: ['1.6 × 10⁻¹⁹ J', '9.1 × 10⁻³¹ J', '3.6 × 10⁶ J', '6.63 × 10⁻³⁴ J'], a: 0, e: 'W = qV = 1.6 × 10⁻¹⁹ C × 1 V = 1.6 × 10⁻¹⁹ J.' },
      { l: 2, q: 'Three capacitors of 2 μF, 4 μF, and 6 μF are connected in PARALLEL. Their combined capacitance is:', o: ['12 μF', '1.09 μF', '3 μF', '48 μF'], a: 0, e: 'In parallel, C = C₁ + C₂ + C₃ = 2 + 4 + 6 = 12 μF.' },
      { l: 3, q: 'Calculate the energy stored in a 10 μF capacitor charged to a potential difference of 100 V.', o: ['0.05 J', '0.50 J', '1.00 J', '500 J'], a: 0, e: 'W = ½CV² = ½ × (10 × 10⁻⁶) × 10,000 = 0.05 J.' },
      { l: 3, q: 'Inserting a mica or glass dielectric slab between the plates of a capacitor:', o: ['Increases its capacitance by relative permittivity factor εᵣ', 'Decreases capacitance to zero', 'Short-circuits the plates', 'Destroys charge'], a: 0, e: 'C = εᵣ C₀ where εᵣ > 1 for any insulating dielectric.' },
      { l: 4, q: 'An isolated charged capacitor (disconnected from battery) has its plates pulled further apart. What happens to Q, C, and V?', o: ['Q stays constant, C decreases, and p.d. V increases', 'Q doubles, C doubles, V halves', 'All three stay constant', 'V drops to zero'], a: 0, e: 'Isolated ⇒ Q fixed. Pulling plates apart increases d ⇒ C decreases ⇒ V = Q/C increases!' },
      { l: 5, q: 'An alpha particle (q = +3.2 × 10⁻¹⁹ C) is accelerated from rest through a p.d. of 5000 V. What kinetic energy does it gain?', o: ['1.6 × 10⁻¹⁵ J', '8.0 × 10⁻¹⁶ J', '3.2 × 10⁻¹⁹ J', '5000 J'], a: 0, e: 'KE = qV = 3.2 × 10⁻¹⁹ × 5000 = 1.6 × 10⁻¹⁵ J.' },
    ],
  },

  // 25. Resistivity, Metre Bridge, Potentiometer & Shunts/Multipliers
  {
    id: 'p-elec-meas',
    name: 'Resistivity, Potentiometer, Metre Bridge & Meters',
    sec: 'SS 3 · First Term · Physics in Technology',
    boss: 'Electrical Measurements Test',
    goals: [
      'Apply R = ρL / A, Wheatstone/Metre bridge balance R₁/R₂ = l₁/(100 − l₁), and Potentiometer EMF comparison E₁/E₂ = l₁/l₂',
      'Convert a sensitive galvanometer into an ammeter (low-resistance parallel SHUNT) or voltmeter (high-resistance series MULTIPLIER)',
    ],
    trap: 'Ammeter conversion uses a LOW-resistance SHUNT in PARALLEL; Voltmeter conversion uses a HIGH-resistance MULTIPLIER in SERIES—and a potentiometer beats a voltmeter because it draws ZERO current at balance!',
    parts: [
      {
        title: 'Resistivity, Metre Bridge & Potentiometer',
        idea: 'Resistance R = ρL / A (resistivity ρ in Ω m depends only on material & temperature). Null-deflection bridges measure EMF and resistance with high accuracy.',
        g: ['physCircuit', { mode: 'potentiometer' }],
        cap: 'Metre bridge / potentiometer wire AB (100 cm): jockey slides until galvanometer reads zero.',
        rules: [
          'R = ρL / A (halving wire diameter quarters area A and quadruples R!).',
          'Metre bridge at balance (Ig = 0): R_left / R_right = l₁ / (100 − l₁).',
          'Potentiometer EMF comparison: E₁ / E₂ = l₁ / l₂ (draws NO current from test cell at balance → measures true open-circuit EMF!).',
        ],
        ex: {
          q: 'In a metre bridge experiment, a standard 4 Ω resistor in the right gap balances an unknown resistor X in the left gap at l₁ = 60 cm from the left end. Find X.',
          steps: [
            ['Right-hand wire length l₂ = 100 − 60 = 40 cm', 'Total metre-bridge wire = 100 cm.'],
            ['X / 4 = 60 / 40 = 1.5 ⇒ X = 6.0 Ω', 'Unknown resistance is 6.0 Ω.'],
          ],
        },
        tryit: {
          q: 'A Daniel cell of EMF 1.08 V balances at 45.0 cm on a potentiometer wire. Another cell E₂ balances at 75.0 cm on the same wire. Find E₂.',
          o: ['1.80 V', '0.65 V', '1.50 V', '2.16 V'],
          a: 0,
          h: 'E₂ / E₁ = l₂ / l₁.',
          e: 'E₂ = 1.08 × (75 / 45) = 1.08 × (5 / 3) = 1.80 V.',
        },
      },
      {
        title: 'Galvanometer Conversions: Shunts & Multipliers',
        idea: 'A moving-coil galvanometer has resistance Rg and full-scale deflection current Ig.',
        rules: [
          'To Ammeter (full scale I): connect low SHUNT Rs in PARALLEL so Ig × Rg = (I − Ig) × Rs.',
          'To Voltmeter (full scale V): connect high MULTIPLIER Rm in SERIES so V = Ig(Rg + Rm) ⇒ Rm = (V / Ig) − Rg.',
        ],
        ex: {
          q: 'A galvanometer of resistance 10 Ω gives full-scale deflection for Ig = 0.02 A (20 mA). Find (a) the shunt Rs to measure up to 2.02 A, and (b) the multiplier Rm to read up to 10 V.',
          steps: [
            ['(a) Shunt (parallel): Rs = (Ig Rg)/(I − Ig) = (0.02 × 10)/(2.00) = 0.10 Ω', 'Tiny 0.10 Ω shunt bypasses 2.00 A!'],
            ['(b) Multiplier (series): Rm = (V / Ig) − Rg = (10 / 0.02) − 10 = 500 − 10 = 490 Ω', '490 Ω in series drops 9.8 V.'],
          ],
        },
        tryit: {
          q: 'An ideal voltmeter and an ideal ammeter should have resistances that are respectively:',
          o: ['Infinite (∞) and Zero (0 Ω)', 'Zero (0 Ω) and Infinite (∞)', 'Both 1 Ω', 'Both infinite'],
          a: 0,
          h: 'Voltmeters go in parallel (draw no current); ammeters go in series (drop no p.d.).',
          e: 'Ideal voltmeter R = ∞; ideal ammeter R = 0 Ω.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'The SI unit of electrical resistivity ρ is:', o: ['Ohm-metre (Ω m)', 'Ohm per metre (Ω m⁻¹)', 'Ohm (Ω)', 'Siemens (S)'], a: 0, e: 'ρ = RA / L → Ω × m² / m = Ω m.' },
      { l: 2, q: 'Why is a potentiometer preferred to an ordinary moving-coil voltmeter for measuring the exact EMF of a cell?', o: ['At the balance point it draws zero current from the cell, avoiding internal "lost volts"', 'It is smaller and cheaper', 'It measures AC frequency', 'It has zero wire resistance'], a: 0, e: 'Zero current at null deflection means terminal V equals true open-circuit EMF E.' },
      { l: 3, q: 'A wire of length 2.0 m and cross-sectional area 4.0 × 10⁻⁷ m² has resistance 5.0 Ω. Find its resistivity ρ.', o: ['1.0 × 10⁻⁶ Ω m', '2.5 × 10⁻⁶ Ω m', '1.0 × 10⁻⁵ Ω m', '4.0 × 10⁻⁷ Ω m'], a: 0, e: 'ρ = RA / L = (5.0 × 4.0 × 10⁻⁷) / 2.0 = 1.0 × 10⁻⁶ Ω m.' },
      { l: 4, q: 'To convert a milliammeter of resistance 9 Ω and full-scale current 10 mA into an ammeter reading up to 100 mA, connect:', o: ['1.0 Ω in parallel', '1.0 Ω in series', '81 Ω in parallel', '81 Ω in series'], a: 0, e: 'Rs = (10 × 9) / (100 − 10) = 90 / 90 = 1.0 Ω in parallel.' },
      { l: 4, q: 'A galvanometer of resistance 20 Ω and full-scale current 5 mA (0.005 A) is converted to a 0–15 V voltmeter. Find the series multiplier.', o: ['2980 Ω', '3000 Ω', '3020 Ω', '280 Ω'], a: 0, e: 'Rm = (15 / 0.005) − 20 = 3000 − 20 = 2980 Ω.' },
      { l: 5, q: 'Wire Y is made of the same metal as Wire X, has TWICE the length of X, and TWICE the diameter of X. If X has resistance R, what is the resistance of Y?', o: ['R / 2', 'R', '2R', '4R'], a: 0, e: 'Twice diameter ⇒ 4× cross-sectional area A. R_Y = ρ(2L) / (4A) = (2/4)R = R / 2.' },
    ],
  },

  // 26. Cells, Electrolysis & Thermionic Emission
  {
    id: 'p-electrolysis-cell',
    name: 'Cells, Faraday’s Electrolysis & Cathode Rays',
    sec: 'SS 3 · First Term · Physics in Technology',
    boss: 'Cells, Electrolysis & Cathode Rays Test',
    goals: [
      'Compare primary cells (simple, Daniel, Leclanché — polarization & local action) with secondary lead-acid and Ni-Fe accumulators',
      'Apply Faraday’s Law m = ZIt and contrast thermionic emission / cathode rays with photoelectric emission',
    ],
    trap: 'In a simple cell, POLARIZATION (hydrogen bubbles coating copper plate) is cured by a chemical depolarizer (MnO₂ or K₂Cr₂O₇), whereas LOCAL ACTION (impure zinc) is cured by amalgamating zinc with mercury!',
    parts: [
      {
        title: 'Primary/Secondary Cells & Faraday’s Law of Electrolysis',
        idea: 'Primary cells cannot be recharged chemically once spent; secondary accumulators are recharged by passing direct current in reverse.',
        rules: [
          'Simple cell defects: (1) Polarization (H₂ gas on Cu anode → back-EMF; cured with MnO₂ in Leclanché cell); (2) Local action (impurities in Zn → cured by amalgamating Zn with Hg).',
          'Lead-acid accumulator state of charge is checked with a HYDROMETER (charged acid RD ≈ 1.25; discharged ≈ 1.15).',
          'Faraday’s 1st Law: mass liberated m = ZQ = ZIt, where Z = electrochemical equivalent (kg C⁻¹ or g C⁻¹).',
        ],
        ex: {
          q: 'A steady current of 2.0 A flows through copper(II) tetraoxosulphate(VI) solution for 25 minutes. If Z for copper is 3.3 × 10⁻⁴ g C⁻¹, find the mass of copper deposited.',
          steps: [
            ['Convert t = 25 × 60 = 1500 s;  Charge Q = It = 2.0 × 1500 = 3000 C', 'Always convert minutes to seconds!'],
            ['m = ZQ = 3.3 × 10⁻⁴ × 3000 = 0.99 g', '0.99 g of pure copper coats the cathode.'],
          ],
        },
        tryit: {
          q: 'In a dry Leclanché torch cell, powdered manganese(IV) oxide (MnO₂) is packed around the carbon rod to act as:',
          o: ['A depolarizer (oxidizes hydrogen gas to water)', 'An amalgamator to stop local action', 'An electrolyte', 'A thermal insulator'],
          a: 0,
          h: 'Prevents hydrogen bubbles from insulating the positive carbon electrode.',
          e: 'MnO₂ is the chemical depolarizer in a Leclanché cell.',
        },
      },
      {
        title: 'Conduction in Gases, Thermionic Emission & Cathode Rays',
        idea: 'Heating a tungsten filament boils off electrons (thermionic emission). Accelerated in a vacuum tube, these fast electrons form cathode rays.',
        rules: [
          'Gases conduct electricity ONLY under LOW pressure and HIGH voltage.',
          'Cathode rays are streams of fast-moving NEGATIVE electrons: deflected by BOTH electric and magnetic fields, travel in straight lines, cast shadows, and produce X-rays when stopped by heavy metal!',
          'Cathode Ray Oscilloscope (CRO): heated cathode emits e⁻ → control grid sets brightness → anode focuses & accelerates → X/Y plates deflect → fluorescent screen glows.',
        ],
        ex: {
          q: 'In a CRO, which electrode controls the BRIGHTNESS of the spot on the screen, and which controls FOCUS?',
          steps: [
            ['Brightness → negative Control Grid (regulates number of electrons/s)', 'More negative grid = dimmer spot.'],
            ['Sharpness/Focus → Focusing Anodes (electrostatic lens)', 'Converges beam to a sharp dot.'],
          ],
        },
        tryit: {
          q: 'Which statement about cathode rays is INCORRECT?',
          o: ['They are electromagnetic waves that are undeflected by magnetic fields', 'They are streams of fast negatively charged electrons', 'They cause zinc sulphide screens to fluoresce', 'They possess kinetic energy and momentum'],
          a: 0,
          h: 'Cathode rays are charged electrons, NOT electromagnetic waves (unlike X-rays or gamma rays!).',
          e: 'Cathode rays carry negative charge −e and are strongly deflected by electric and magnetic fields.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Local action at the zinc plate of a simple voltaic cell is prevented by:', o: ['Amalgamating (cleaning with acid and rubbing with mercury) the zinc plate', 'Adding manganese(IV) oxide', 'Connecting a shunt', 'Cooling to 0 °C'], a: 0, e: 'Mercury amalgamation covers iron/carbon impurities in commercial zinc.' },
      { l: 2, q: 'Which instrument tests whether a car’s lead-acid accumulator is fully charged?', o: ['Hydrometer (measures relative density of H₂SO₄ electrolyte)', 'Hygrometer', 'Potentiometer wire only', 'Electroscope'], a: 0, e: 'Relative density rises to ~1.25 when charged and falls to ~1.15 when discharged.' },
      { l: 3, q: 'A current of 5 A deposits 1.5 g of silver in 4.5 minutes. How much silver will 10 A deposit in 9 minutes?', o: ['6.0 g', '3.0 g', '12.0 g', '1.5 g'], a: 0, e: 'm ∝ I × t: both I and t double, so mass increases by 2 × 2 = 4× ⇒ 4 × 1.5 = 6.0 g.' },
      { l: 3, q: 'Gases inside a discharge tube conduct electricity readily when:', o: ['Gas pressure is very low (~0.01 mmHg) and potential difference is very high', 'Pressure is very high and voltage is 1.5 V', 'Temperature is absolute zero', 'Tube is painted black'], a: 0, e: 'Low pressure gives ions a long mean free path to accelerate under high p.d. and ionize by collision.' },
      { l: 4, q: 'What is the charge-to-mass ratio (specific charge e/m) particle identified by J. J. Thomson in cathode rays?', o: ['The electron', 'The alpha particle', 'The neutron', 'The photon'], a: 0, e: 'J. J. Thomson measured e/m = 1.76 × 10¹¹ C kg⁻¹ and identified cathode rays as electrons.' },
      { l: 5, q: 'Find the electrochemical equivalent Z of an element if a current of 1.5 A flowing for 20 minutes deposits 0.36 g.', o: ['2.0 × 10⁻⁴ g C⁻¹', '1.2 × 10⁻² g C⁻¹', '5.0 × 10⁻³ g C⁻¹', '2.0 × 10⁻³ g C⁻¹'], a: 0, e: 'Q = 1.5 × 1200 = 1800 C; Z = m / Q = 0.36 / 1800 = 2.0 × 10⁻⁴ g C⁻¹.' },
    ],
  },

  // 27. Magnetism & Force on Current/Charge in Magnetic Field
  {
    id: 'p-magnetism',
    name: 'Magnetism, Motor Effect (F = BIL) & Lorentz Force',
    sec: 'SS 3 · Second Term · Electromagnetism',
    boss: 'Magnetism & Motor Force Test',
    goals: [
      'Compare soft iron vs steel magnetic properties and define Earth’s magnetic declination and angle of dip',
      'Calculate magnetic force F = BIL sin θ on a wire and F = Bqv sin θ on a moving charge using Fleming’s Left-Hand Rule',
    ],
    trap: 'A charge at REST (v = 0) OR moving PARALLEL to magnetic field B (θ = 0° or 180°) experiences ZERO magnetic force!',
    parts: [
      {
        title: 'Magnetic Materials & Earth’s Magnetic Elements',
        idea: 'Soft iron magnetizes and demagnetizes easily (electromagnets & transformer cores); steel retains magnetism stubbornly (permanent magnets & compass needles).',
        rules: [
          'Demagnetization methods: heating above Curie point, hammering in East–West direction, or withdrawing slowly from a solenoid carrying AC!',
          'Angle of Declination (variation): horizontal angle between Magnetic North and Geographic (True) North.',
          'Angle of Dip (inclination): angle between Earth’s resultant magnetic field and the horizontal (0° at magnetic equator; 90° at magnetic poles!).',
        ],
        ex: {
          q: 'Why is SOFT IRON used for the core of an electric bell’s electromagnet instead of steel?',
          steps: [
            ['Soft iron gains strong magnetism instantly when current flows', 'Pulls the striker smartly.'],
            ['It loses magnetism immediately when current breaks', 'Allows spring to pull striker back—steel would stay magnetized and jam!'],
          ],
        },
        tryit: {
          q: 'What is the angle of dip at the Earth’s magnetic equator?',
          o: ['0°', '90°', '45°', '180°'],
          a: 0,
          h: 'At the magnetic equator, field lines run purely horizontally.',
          e: 'Dip needle lies horizontal → angle of dip = 0° (at magnetic poles it stands vertical at 90°).',
        },
      },
      {
        title: 'Motor Effect (F = BIL sin θ), Lorentz Force & DC Motor',
        idea: 'Fleming’s LEFT-Hand Rule gives MOTOR force direction: Thumb = Motion/Force, Forefinger = Field B, Second finger = Conventional Current I.',
        rules: [
          'Straight conductor in field B: F = BIL sin θ (maximum BIL at θ = 90°; zero at θ = 0°).',
          'Moving charge q at speed v: F = Bqv sin θ; circular orbit radius r = mv / (Bq).',
          'Two parallel wires carrying currents in the SAME direction ATTRACT; OPPOSITE currents REPEL!',
          'DC electric motor uses a SPLIT-RING COMMUTATOR to reverse coil current every half-turn for continuous one-way rotation.',
        ],
        ex: {
          q: 'A straight wire of length 0.40 m carries a current of 5.0 A at 30° to a uniform magnetic field of flux density 0.60 T. Calculate the force on the wire.',
          steps: [
            ['Apply F = BIL sin θ', 'θ = 30° ⇒ sin 30° = 0.5.'],
            ['F = 0.60 × 5.0 × 0.40 × 0.5 = 0.60 N', 'Force on wire is 0.60 N.'],
          ],
        },
        tryit: {
          q: 'An electron moves at 2.0 × 10⁶ m s⁻¹ perpendicular (90°) to a 0.50 T magnetic field (e = 1.6 × 10⁻¹⁹ C). Find the magnetic force on it.',
          o: ['1.6 × 10⁻¹³ N', '3.2 × 10⁻¹³ N', '0 N', '8.0 × 10⁻¹⁴ N'],
          a: 0,
          h: 'F = Bqv sin 90°.',
          e: 'F = 0.50 × 1.6 × 10⁻¹⁹ × 2.0 × 10⁶ × 1 = 1.6 × 10⁻¹³ N.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'The SI unit of magnetic flux density B is the:', o: ['Tesla (T = Wb m⁻²)', 'Weber (Wb)', 'Henry (H)', 'Gauss-second'], a: 0, e: 'Magnetic flux Φ is in Webers (Wb); flux density B = Φ/A is in Tesla (Wb m⁻²).' },
      { l: 2, q: 'Which method reliably DEMAGNETIZES a steel screwdriver?', o: ['Pulling it slowly out of a solenoid carrying alternating current (AC) aligned East–West', 'Placing it inside a DC solenoid', 'Stroking it one way with a bar magnet', 'Freezing it in ice'], a: 0, e: 'Decaying AC cycles scramble magnetic domains completely.' },
      { l: 3, q: 'Two long parallel wires carry currents I₁ and I₂ in the SAME direction. The wires:', o: ['Attract each other', 'Repel each other', 'Exert zero force on each other', 'Rotate clockwise'], a: 0, e: 'Parallel currents in the same direction attract; antiparallel currents repel.' },
      { l: 3, q: 'In a DC electric motor, what is the function of the split-ring commutator?', o: ['Reverses current direction in the armature coil every half-revolution to maintain continuous rotation', 'Steps up AC voltage', 'Measures magnetic flux', 'Stores charge'], a: 0, e: 'Reversing coil current every 180° keeps torque acting in the same rotational sense.' },
      { l: 4, q: 'A proton enters a uniform magnetic field B moving PARALLEL to the field lines. Its path will be:', o: ['An undeflected straight line at constant speed (F = 0)', 'A circle', 'A parabola', 'A helix'], a: 0, e: 'θ = 0° ⇒ sin 0° = 0 ⇒ F = Bqv sin 0° = 0.' },
      { l: 5, q: 'A wire of length 0.5 m carrying 8 A experiences a maximum force of 1.2 N when placed perpendicular to a uniform magnetic field. Find B.', o: ['0.30 T', '0.60 T', '4.8 T', '0.15 T'], a: 0, e: 'B = F / (IL) = 1.2 / (8 × 0.5) = 1.2 / 4 = 0.30 T.' },
    ],
  },

  // 28. Electromagnetic Induction & Transformers
  {
    id: 'p-induction',
    name: 'Electromagnetic Induction, Generators & Transformers',
    sec: 'SS 3 · Second Term · Electromagnetism',
    boss: 'Induction & Transformers Test',
    goals: [
      'Apply Faraday’s Law E = −N ΔΦ/Δt = BLv, Lenz’s Law (conservation of energy), and Fleming’s Right-Hand Generator Rule',
      'Solve transformer turns/voltage/current equations, explain laminated soft-iron cores (eddy currents), and calculate L and ½LI²',
    ],
    trap: 'Transformers ONLY work on Alternating Current (AC)—a steady DC battery gives ZERO changing magnetic flux so secondary voltage Vₛ = 0!',
    parts: [
      {
        title: 'Faraday’s Law, Lenz’s Law & AC vs DC Generators',
        idea: 'Induced EMF is proportional to rate of change of magnetic flux linkage (E = N ΔΦ/Δt) and opposes the change producing it (Lenz’s Law).',
        rules: [
          'Fleming’s RIGHT-Hand Rule gives INDUCED current direction in a generator.',
          'AC generator (alternator) uses TWO SLIP RINGS; replacing slip rings with a SPLIT-RING COMMUTATOR converts it into a DC dynamo!',
          'Self-inductance: E = L (ΔI / Δt) in henrys (H); Magnetic energy in inductor W = ½LI².',
        ],
        ex: {
          q: 'A 200-turn coil experiences a magnetic flux change from 0.05 Wb to 0.01 Wb in 0.02 s. Find the magnitude of induced EMF.',
          steps: [
            ['|ΔΦ| = 0.05 − 0.01 = 0.04 Wb', 'Flux change in Webers.'],
            ['E = N |ΔΦ / Δt| = 200 × (0.04 / 0.02) = 400 V', 'Induced EMF is 400 V.'],
          ],
        },
        tryit: {
          q: 'Lenz’s law of electromagnetic induction is a direct consequence of the law of conservation of:',
          o: ['Energy', 'Mass', 'Momentum', 'Electric charge'],
          a: 0,
          h: 'Mechanical work must be done against opposing magnetic forces to generate electrical energy.',
          e: 'Lenz’s law expresses Conservation of Energy.',
        },
      },
      {
        title: 'Transformers, Power Losses & High-Voltage Grid Transmission',
        idea: 'Step-up transformers have Nₛ > Nₚ (higher V, lower I); step-down have Nₛ < Nₚ. Transmitting grid power at high voltage (e.g. 330 kV) slashes current I and I²R cable heat loss!',
        g: ['physCircuit', { mode: 'transformer' }],
        cap: 'Laminated soft-iron core transformer linking primary (Nₚ, Vₚ) and secondary (Nₛ, Vₛ) coils.',
        rules: [
          'Voltage–turns ratio (always): Vₛ / Vₚ = Nₛ / Nₚ.',
          'Efficiency η = (Iₛ Vₛ) / (Iₚ Vₚ) × 100% (if 100% ideal, Iₛ / Iₚ = Vₚ / Vₛ).',
          '4 Transformer losses & cures: (1) Eddy currents → LAMINATE core; (2) Hysteresis → SOFT IRON core; (3) Copper I²R → THICK low-resistance wires; (4) Flux leakage → wind secondary over primary.',
        ],
        ex: {
          q: 'A step-down transformer of 90% efficiency steps 240 V mains down to 12 V to light a 60 W lamp. Find (i) turns ratio Nₚ : Nₛ and (ii) primary current Iₚ.',
          steps: [
            ['Nₚ / Nₛ = Vₚ / Vₛ = 240 / 12 = 20 : 1', 'Turns ratio is 20 : 1.'],
            ['P_in = P_out / 0.90 = 60 / 0.90 = 66.7 W ⇒ Iₚ = 66.7 / 240 ≈ 0.28 A', 'Account for 90% efficiency!'],
          ],
        },
        tryit: {
          q: 'Why is the soft-iron core of a power transformer built from thin insulated sheets (laminations) rather than a solid iron block?',
          o: ['To reduce heat loss caused by induced eddy currents', 'To increase hysteresis loss', 'To make the transformer heavier', 'To allow DC transformation'],
          a: 0,
          h: 'Insulating varnish between thin sheets breaks eddy-current loops.',
          e: 'Lamination minimizes eddy-current heating.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'To convert an AC generator into a DC generator (dynamo), replace its two slip rings with:', o: ['A split-ring commutator', 'A capacitor bank', 'A step-up transformer', 'Carbon resistors'], a: 0, e: 'A split-ring commutator rectifies the alternating coil EMF into unidirectional DC.' },
      { l: 2, q: 'Why is electrical power from Kainji Dam transmitted across Nigeria at very high voltage (330 kV) and low current?', o: ['To minimize I²R heating power loss in long transmission cables', 'To speed up electrons to light speed', 'Because homes use 330 kV directly', 'To increase cable resistance'], a: 0, e: 'For fixed power P = IV, high V makes I very small, drastically cutting I²R line loss.' },
      { l: 3, q: 'An ideal transformer has 2000 primary turns and 100 secondary turns. Connected to 220 V AC, its secondary voltage is:', o: ['11 V', '4400 V', '22 V', '0 V'], a: 0, e: 'Vₛ = 220 × (100 / 2000) = 11 V.' },
      { l: 3, q: 'Find the magnetic energy stored in a 0.40 H inductor carrying a steady current of 5.0 A.', o: ['5.0 J', '1.0 J', '2.0 J', '10.0 J'], a: 0, e: 'W = ½LI² = ½ × 0.40 × 25 = 5.0 J.' },
      { l: 4, q: 'A 12 V DC car battery is connected steadily across the primary of a 1 : 10 step-up transformer. Once current is steady, secondary voltage is:', o: ['0 V (no changing magnetic flux)', '120 V', '1.2 V', '12 V'], a: 0, e: 'Steady DC produces constant flux (ΔΦ/Δt = 0), so zero EMF is induced.' },
      { l: 5, q: 'A straight aircraft wing of span 30 m flies horizontally at 200 m s⁻¹ where Earth’s vertical magnetic field component is 5.0 × 10⁻⁵ T. Find the EMF induced between its wingtips.', o: ['0.30 V', '3.0 V', '0.03 V', '1.5 V'], a: 0, e: 'E = BLv = 5.0 × 10⁻⁵ × 30 × 200 = 0.30 V.' },
    ],
  },

  // 29. Alternating Current (AC) RLC Circuits
  {
    id: 'p-ac-circuits',
    name: 'Alternating Current (AC), Reactance & Resonance',
    sec: 'SS 3 · Second Term · Electromagnetism',
    boss: 'AC Circuits & RLC Resonance Test',
    goals: [
      'Convert between peak and r.m.s. values (I_rms = I₀/√2, V_rms = V₀/√2) and compute X_L = 2πfL and X_C = 1/(2πfC)',
      'Calculate series RLC impedance Z = √[R² + (X_L − X_C)²], power factor cos φ = R/Z, and resonant frequency f₀ = 1/(2π√(LC))',
    ],
    trap: 'Voltages across R, L, and C in a series AC circuit are 90° out of phase—NEVER add V_R + V_L + V_C arithmetically; use V = √[V_R² + (V_L − V_C)²]!',
    parts: [
      {
        title: 'Peak vs RMS Values & Capacitive/Inductive Reactance',
        idea: 'RMS current is the steady DC equivalent producing the same heating power (I_rms = 0.707 I₀). Inductors oppose high-f AC; capacitors pass high-f AC.',
        rules: [
          'I_rms = I₀ / √2 ≈ 0.707 I₀;  V_rms = V₀ / √2 (Nigerian 220–240 V, 50 Hz mains is RMS; peak V₀ = 240√2 ≈ 339 V!).',
          'Inductive reactance X_L = 2πfL (Ω) — V leads I by 90°.',
          'Capacitive reactance X_C = 1 / (2πfC) (Ω) — I leads V by 90° ("CIVIL" mnemonic!).',
        ],
        ex: {
          q: 'An AC voltage is given by V = 311 sin(100πt) volts. Find (i) peak voltage, (ii) RMS voltage, and (iii) supply frequency.',
          steps: [
            ['Peak V₀ = 311 V;  V_rms = 311 / √2 ≈ 220 V', 'Divide peak by √2.'],
            ['2πf = 100π ⇒ f = 50 Hz', 'Standard Nigerian mains frequency!'],
          ],
        },
        tryit: {
          q: 'Find the inductive reactance X_L of a 0.20 H pure inductor connected to a 50/π Hz AC supply.',
          o: ['20 Ω', '10 Ω', '40 Ω', '100 Ω'],
          a: 0,
          h: 'X_L = 2πfL.',
          e: 'X_L = 2π × (50/π) × 0.20 = 100 × 0.20 = 20 Ω.',
        },
      },
      {
        title: 'Series RLC Impedance, Power Factor & Resonance',
        idea: 'Impedance Z = √[R² + (X_L − X_C)²]. At electrical resonance (X_L = X_C), Z shrinks to its minimum R and current I peaks!',
        g: ['physCircuit', { mode: 'rlc' }],
        cap: 'Series RLC circuit & phasor triangle: Z² = R² + (X_L − X_C)²; resonance when X_L = X_C.',
        rules: [
          'Z = √[R² + (X_L − X_C)²];  I_rms = V_rms / Z;  tan φ = (X_L − X_C) / R.',
          'Average real power dissipated P = I_rms V_rms cos φ = I_rms² R, where power factor cos φ = R / Z (pure L or C dissipates ZERO average power!).',
          'Resonance (X_L = X_C): f₀ = 1 / [2π√(LC)], Z_min = R, cos φ = 1 (used in radio/TV station tuning!).',
        ],
        ex: {
          q: 'A series RLC circuit has R = 30 Ω, X_L = 90 Ω, and X_C = 50 Ω across a 100 V rms supply. Find (i) impedance Z, (ii) rms current, and (iii) power factor.',
          steps: [
            ['Z = √[30² + (90 − 50)²] = √(900 + 1600) = √2500 = 50 Ω', '30–40–50 right-angled phasor triangle!'],
            ['I_rms = 100 / 50 = 2.0 A;  Power factor cos φ = R / Z = 30 / 50 = 0.60', 'Real power = I²R = 4 × 30 = 120 W.'],
          ],
        },
        tryit: {
          q: 'At resonance in a series RLC circuit, which statement is TRUE?',
          o: ['X_L = X_C, impedance Z equals R (minimum), and current is maximum', 'Impedance Z is infinite', 'Current drops to zero', 'Power factor is zero'],
          a: 0,
          h: 'When X_L − X_C = 0, Z = √(R² + 0) = R.',
          e: 'At resonance X_L = X_C, Z = R, cos φ = 1, and I is maximum.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'If the RMS current in an AC circuit is 5.0 A, what is the peak current I₀?', o: ['5√2 A (7.07 A)', '5 / √2 A (3.54 A)', '10.0 A', '2.5 A'], a: 0, e: 'I₀ = I_rms √2 = 5√2 ≈ 7.07 A.' },
      { l: 2, q: 'In a pure capacitor connected to an AC source, the phase relationship between current I and voltage V is:', o: ['Current I leads voltage V by 90° (π/2 rad)', 'Voltage V leads current I by 90°', 'I and V are in phase (0°)', 'I lags V by 180°'], a: 0, e: 'CIVIL: in C, Current I leads Voltage V by 90°.' },
      { l: 3, q: 'What is the average power dissipated over a full cycle in a PURE, resistance-free inductor connected to AC?', o: ['Zero (0 W)', 'I_rms V_rms', '½ I₀ V₀', 'I_rms² X_L'], a: 0, e: 'Phase angle φ = 90° ⇒ cos 90° = 0 ⇒ P = IV cos 90° = 0 W.' },
      { l: 4, q: 'Across a series RC circuit, voltmeter readings are V_R = 8 V across the resistor and V_C = 6 V across the capacitor. What is the supply voltage V?', o: ['10 V', '14 V', '2 V', '7 V'], a: 0, e: 'V = √(V_R² + V_C²) = √(64 + 36) = 10 V.' },
      { l: 4, q: 'Find the capacitive reactance X_C of a 50 μF capacitor at frequency f = 100/π Hz.', o: ['100 Ω', '50 Ω', '200 Ω', '10 Ω'], a: 0, e: 'X_C = 1 / (2π × 100/π × 50 × 10⁻⁶) = 1 / (200 × 5 × 10⁻⁵) = 1 / 0.01 = 100 Ω.' },
      { l: 5, q: 'Find the resonant frequency f₀ of a radio tuner with L = 10 mH (1.0 × 10⁻² H) and C = 1.0 μF (1.0 × 10⁻⁶ F).', o: ['5000 / π Hz (1.59 kHz)', '50 Hz', '1.0 MHz', '500 / π Hz'], a: 0, e: '√(LC) = √(10⁻² × 10⁻⁶) = 10⁻⁴ s ⇒ f₀ = 1 / (2π × 10⁻⁴) = 10,000 / (2π) = 5000 / π Hz ≈ 1.59 kHz.' },
    ],
  },

  // 30. Atomic Models, Quantum Photoelectric Effect & X-Rays
  {
    id: 'p-atomic-quantum',
    name: 'Bohr Atom, Photoelectric Effect, X-Rays & Wave-Particle Duality',
    sec: 'SS 3 · Third Term · Quantum & Modern Physics',
    boss: 'Quantum, Photoelectric & X-Rays Test',
    goals: [
      'Calculate photon energy ΔE = hf = hc/λ from Bohr transitions, Einstein’s photoelectric equation hf = W₀ + KE_max, and stopping potential eVₛ = KE_max',
      'Explain X-ray tube production (eV = hf_max), de Broglie wavelength λ = h/(mv), and Heisenberg’s Uncertainty Principle',
    ],
    trap: 'In the photoelectric effect, increasing light INTENSITY (brightness) increases the NUMBER of electrons emitted (photocurrent), NEVER their maximum kinetic energy—KE_max depends ONLY on light FREQUENCY!',
    parts: [
      {
        title: 'Bohr Energy Levels & Einstein’s Photoelectric Equation',
        idea: 'Light consists of discrete energy quanta (photons) of energy E = hf = hc/λ (h = 6.63 × 10⁻³⁴ J s).',
        rules: [
          'Atom drops from E₂ to lower E₁ → emits a photon of ΔE = E₂ − E₁ = hf = hc / λ.',
          'Work function W₀ = hf₀ (minimum photon energy to liberate a surface electron at threshold frequency f₀).',
          'Einstein’s Photoelectric Equation: KE_max = ½mv² = eVₛ = hf − W₀ = h(f − f₀).',
        ],
        ex: {
          q: 'A metal has work function 2.0 eV. Light of photon energy 3.5 eV shines on it. Find (i) KE_max of photoelectrons in eV and joules, and (ii) stopping potential Vₛ.',
          steps: [
            ['KE_max = hf − W₀ = 3.5 − 2.0 = 1.5 eV', 'Excess photon energy becomes max electron KE.'],
            ['In joules: 1.5 × 1.6 × 10⁻¹⁹ = 2.4 × 10⁻¹⁹ J;  Stopping potential Vₛ = 1.5 V', 'Since eVₛ = 1.5 eV, Vₛ = 1.5 V!'],
          ],
        },
        tryit: {
          q: 'If incident light has frequency BELOW a metal’s threshold frequency f₀, making the light 100× brighter will:',
          o: ['Still emit ZERO photoelectrons', 'Emit 100× more electrons', 'Double electron speed', 'Melt the cathode'],
          a: 0,
          h: 'Each single photon has hf < W₀, so no electron can escape.',
          e: 'Below threshold frequency f₀, zero photoemission occurs regardless of intensity.',
        },
      },
      {
        title: 'X-Ray Production, de Broglie Matter Waves & Uncertainty',
        idea: 'X-rays are inverse photoelectric effect: high-voltage electrons strike a heavy high-melting tungsten target inside an evacuated Coolidge tube.',
        rules: [
          'Maximum X-ray frequency (hardness/penetrating power) depends ONLY on accelerating voltage V: eV = hf_max = hc / λ_min.',
          'X-ray intensity depends on filament heating current (number of electrons/s). Most (>98%) electron energy turns into HEAT → cool copper anode with oil/fins!',
          'de Broglie wavelength of a particle: λ = h / p = h / (mv);  Heisenberg Uncertainty: Δx · Δp ≥ h / (4π).',
        ],
        ex: {
          q: 'Find the de Broglie wavelength of an electron (m = 9.0 × 10⁻³¹ kg) moving at 2.2 × 10⁶ m s⁻¹ (h = 6.6 × 10⁻³⁴ J s).',
          steps: [
            ['Momentum p = mv = 9.0 × 10⁻³¹ × 2.2 × 10⁶ = 1.98 × 10⁻²⁴ kg m s⁻¹', 'Compute linear momentum.'],
            ['λ = h / p = (6.6 × 10⁻³⁴) / (1.98 × 10⁻²⁴) ≈ 3.33 × 10⁻¹⁰ m', 'Atomic-scale wavelength → electron diffraction!'],
          ],
        },
        tryit: {
          q: 'In an X-ray tube, increasing the accelerating anode voltage V from 30 kV to 60 kV produces X-rays that have:',
          o: ['Higher frequency, shorter minimum wavelength, and greater penetrating power ("harder" X-rays)', 'Longer wavelength ("softer" X-rays)', 'Lower speed in vacuum', 'Negative electric charge'],
          a: 0,
          h: 'eV = hf_max = hc / λ_min.',
          e: 'Higher kV gives higher f_max and shorter λ_min (more penetrating hard X-rays).',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Why is tungsten embedded in a copper block chosen as the target in an X-ray tube?', o: ['Tungsten has a high atomic number and very high melting point, while copper conducts away intense heat', 'Tungsten is a liquid at room temperature', 'Tungsten emits alpha particles', 'Copper blocks X-rays'], a: 0, e: 'Over 98% of electron kinetic energy turns into heat, requiring tungsten’s high melting point (~3422 °C) and copper cooling.' },
      { l: 2, q: 'An electron in a hydrogen atom drops from E₃ = −1.51 eV to E₂ = −3.40 eV. What is the energy of the emitted photon?', o: ['1.89 eV', '4.91 eV', '2.25 eV', '1.51 eV'], a: 0, e: 'ΔE = E₃ − E₂ = −1.51 − (−3.40) = +1.89 eV.' },
      { l: 3, q: 'Which phenomenon demonstrates the PARTICLE nature of electromagnetic radiation?', o: ['Photoelectric effect (and Compton scattering)', 'Diffraction through a single slit', 'Young’s double-slit interference', 'Polarization'], a: 0, e: 'Photoelectric emission requires localized photon packets E = hf.' },
      { l: 4, q: 'Find the threshold wavelength λ₀ of a metal whose work function is 3.3 × 10⁻¹⁹ J (h = 6.6 × 10⁻³⁴ J s, c = 3.0 × 10⁸ m s⁻¹).', o: ['6.0 × 10⁻⁷ m (600 nm)', '2.0 × 10⁻⁷ m', '3.0 × 10⁻⁷ m', '1.8 × 10⁻⁶ m'], a: 0, e: 'λ₀ = hc / W₀ = (6.6 × 10⁻³⁴ × 3.0 × 10⁸) / (3.3 × 10⁻¹⁹) = 6.0 × 10⁻⁷ m.' },
      { l: 4, q: 'Which property of X-rays distinguishes them from cathode rays?', o: ['X-rays carry zero charge and are undeflected by electric or magnetic fields', 'X-rays travel slower than sound', 'X-rays are negatively charged electrons', 'X-rays cannot penetrate flesh'], a: 0, e: 'X-rays are uncharged high-frequency electromagnetic photons.' },
      { l: 5, q: 'Heisenberg’s Uncertainty Principle states that it is fundamentally impossible to measure simultaneously with unlimited precision a particle’s:', o: ['Position x and linear momentum p (or energy E and time t)', 'Mass and electric charge', 'Volume and colour', 'Speed and kinetic energy only'], a: 0, e: 'Conjugate pairs (x, p) and (E, t) obey Δx Δp ≥ ℏ/2.' },
    ],
  },

  // 31. Radioactivity & Nuclear Energy
  {
    id: 'p-nuclear',
    name: 'Radioactivity, Half-Life, Fission & Fusion',
    sec: 'SS 3 · Third Term · Quantum & Modern Physics',
    boss: 'Nuclear Physics & Half-Life Test',
    goals: [
      'Balance α (⁴₂He), β⁻ (⁰₋₁e), and γ nuclear equations and compare ionizing vs penetrating powers',
      'Calculate half-life fractions N = N₀(½)ⁿ, decay constant λ = 0.693/T_½, Einstein mass-energy ΔE = Δmc², and nuclear reactor roles',
    ],
    trap: 'Beta (β⁻) emission INCREASES atomic number Z by +1 while mass number A stays UNCHANGED (a neutron turns into a proton + electron)!',
    parts: [
      {
        title: 'Alpha, Beta, Gamma Decay & Half-Life',
        idea: 'Radioactivity is spontaneous, random nuclear disintegration completely unaffected by temperature, pressure, or chemical bonding.',
        rules: [
          'Alpha (⁴₂He): A drops by 4, Z drops by 2; heaviest, HIGHEST ionizing power, lowest penetration (stopped by thin paper).',
          'Beta (⁰₋₁e): A unchanged, Z increases by +1; medium ionization, stopped by ~3 mm aluminium.',
          'Gamma (γ photon): A and Z unchanged; uncharged, LOWEST ionization, HIGHEST penetration (needs thick lead/concrete).',
          'Half-life T_½ = 0.693 / λ; after n = t / T_½ half-lives, remaining undecayed fraction N / N₀ = (1/2)ⁿ, decayed fraction = 1 − (1/2)ⁿ!',
        ],
        ex: {
          q: 'A radioactive isotope has a half-life of 8 days. Starting with 160 g, what mass (i) remains undecayed and (ii) has decayed after 24 days?',
          steps: [
            ['Number of half-lives n = 24 / 8 = 3', '160 → 80 → 40 → 20 g.'],
            ['Remaining = 160 × (1/2)³ = 20 g;  Decayed = 160 − 20 = 140 g', 'Read carefully whether the exam asks REMAINING or DECAYED!'],
          ],
        },
        tryit: {
          q: 'Nuclide ²³⁸₉₂U emits ONE alpha particle followed by ONE beta (β⁻) particle. What are the mass number A and atomic number Z of the product?',
          o: ['A = 234, Z = 91', 'A = 234, Z = 90', 'A = 238, Z = 93', 'A = 234, Z = 89'],
          a: 0,
          h: 'Alpha: (238−4, 92−2) = (234, 90); then Beta⁻: Z becomes 90 + 1 = 91!',
          e: 'A = 234 and Z = 91.',
        },
      },
      {
        title: 'Binding Energy (ΔE = Δmc²), Fission Reactors & Fusion',
        idea: 'Nuclear mass is slightly less than the sum of separate nucleons (mass defect Δm); binding energy E = Δmc² holds the nucleus together.',
        rules: [
          'Fission: slow thermal neutron splits heavy ²³⁵U into two medium nuclei + 2–3 neutrons + huge energy.',
          'Nuclear reactor components: Graphite/Heavy-water MODERATOR slows fast neutrons; Boron/Cadmium CONTROL RODS absorb excess neutrons to control chain reaction!',
          'Fusion: light nuclei (²₁H + ³₁H → ⁴₂He + ¹₀n) fuse at >10⁷ K (powers the Sun/stars; cleaner waste, more energy per kg than fission!).',
        ],
        ex: {
          q: 'A nuclear reaction has a mass defect Δm = 2.0 × 10⁻²⁹ kg (c = 3.0 × 10⁸ m s⁻¹). How much energy is released in joules?',
          steps: [
            ['Apply Einstein’s equation ΔE = Δm c²', 'c² = 9.0 × 10¹⁶ m² s⁻².'],
            ['ΔE = 2.0 × 10⁻²⁹ × 9.0 × 10¹⁶ = 1.8 × 10⁻¹² J', 'Energy released per reaction.'],
          ],
        },
        tryit: {
          q: 'In a nuclear fission power reactor, what is the specific role of BORON or CADMIUM rods?',
          o: ['Absorb excess neutrons to regulate or shut down the chain reaction', 'Slow down fast neutrons without absorbing them', 'Act as nuclear fuel', 'Pump steam to turbines'],
          a: 0,
          h: 'Distinguish Control Rods (boron/cadmium → absorb) from Moderator (graphite/D₂O → slow down).',
          e: 'Boron/cadmium control rods absorb neutrons to keep the chain reaction steady.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Arrange α, β, and γ radiations in order of INCREASING penetrating power:', o: ['α < β < γ', 'γ < β < α', 'β < α < γ', 'α < γ < β'], a: 0, e: 'Alpha is stopped by paper, beta by thin aluminium, gamma needs thick lead.' },
      { l: 2, q: 'After 36 minutes, 7/8 of a radioactive sample has DECAYED (leaving 1/8 undecayed). What is its half-life?', o: ['12 minutes', '9 minutes', '18 minutes', '4.5 minutes'], a: 0, e: 'Remaining = 1 − 7/8 = 1/8 = (1/2)³ ⇒ 3 half-lives = 36 min ⇒ T_½ = 12 min.' },
      { l: 3, q: 'If the half-life of an isotope is 69.3 s, what is its decay constant λ?', o: ['0.01 s⁻¹', '0.10 s⁻¹', '100 s⁻¹', '0.693 s⁻¹'], a: 0, e: 'λ = 0.693 / T_½ = 0.693 / 69.3 = 0.01 s⁻¹.' },
      { l: 3, q: 'In a nuclear fission reactor, heavy water (D₂O) or pure graphite is used as a MODERATOR in order to:', o: ['Slow down fast fission neutrons to thermal speeds so ²³⁵U captures them efficiently', 'Absorb all neutrons and stop the reactor', 'Shield workers from gamma rays', 'Increase fuel temperature to 10⁸ K'], a: 0, e: 'Moderators slow fast neutrons without absorbing them.' },
      { l: 4, q: 'Why is controlled nuclear fusion difficult to sustain on Earth?', o: ['Extremely high temperatures (~10⁷–10⁸ K) are required to overcome electrostatic repulsion between positive nuclei', 'Hydrogen does not exist on Earth', 'Fusion absorbs energy', 'Neutrons repel protons'], a: 0, e: 'Colossal thermal kinetic energy is needed to overcome Coulomb repulsion between positively charged nuclei.' },
      { l: 5, q: 'Count rate of a sample (zero background) drops from 800 counts/min to 50 counts/min in 20 hours. Find its half-life.', o: ['5 hours', '4 hours', '2.5 hours', '10 hours'], a: 0, e: '50 / 800 = 1/16 = (1/2)⁴ ⇒ 4 half-lives = 20 h ⇒ T_½ = 5 hours.' },
    ],
  },

  // 32. Semiconductors, Diodes, Transistors & Logic Gates
  {
    id: 'p-electronics',
    name: 'Semiconductors, Diodes, Transistors & Logic Gates',
    sec: 'SS 3 · Third Term · Physics in Technology',
    boss: 'Semiconductors & Logic Gates Test',
    goals: [
      'Contrast intrinsic silicon/germanium with n-type (pentavalent P/As donor) and p-type (trivalent B/In acceptor) semiconductors',
      'Explain p–n diode rectification, transistor amplification/switching, and solve AND, OR, NOT, NAND, NOR, XOR truth tables',
    ],
    trap: 'An n-type semiconductor is ELECTRICALLY NEUTRAL overall (pentavalent phosphorus atoms bring equal protons and electrons—electrons are just the majority mobile carriers)!',
    parts: [
      {
        title: 'Semiconductors, Doping, p–n Diodes & Transistors',
        idea: 'Unlike metals, pure semiconductor resistance DECREASES on heating! Doping Group-4 silicon with Group-5 gives n-type; Group-3 gives p-type.',
        rules: [
          'n-type: dope Si/Ge with pentavalent Group 5 (P, As, Sb) → majority carriers = ELECTRONS.',
          'p-type: dope Si/Ge with trivalent Group 3 (B, Al, In, Ga) → majority carriers = POSITIVE HOLES.',
          'p–n junction diode conducts in FORWARD bias (p to +, n to −, narrow depletion layer) and blocks REVERSE bias → AC-to-DC RECTIFIER (+ capacitor smooths ripple!).',
        ],
        ex: {
          q: 'How do you connect a p–n junction diode to forward-bias it, and what electronic circuit converts AC into smooth DC?',
          steps: [
            ['Forward bias: connect p-region to battery +ve and n-region to battery −ve', 'Shrinks depletion barrier so current flows.'],
            ['Bridge rectifier (4 diodes) + large reservoir capacitor in parallel with load', 'Full-wave rectification + smoothing!'],
          ],
        },
        tryit: {
          q: 'Doping pure silicon with trivalent Boron (Group 3) produces:',
          o: ['A p-type semiconductor where positive holes are majority charge carriers', 'An n-type semiconductor', 'A superconductor', 'A positively charged crystal'],
          a: 0,
          h: 'Group 3 has 3 valence electrons, leaving 1 hole per boron atom.',
          e: 'Trivalent acceptor doping yields p-type silicon with holes as majority carriers.',
        },
      },
      {
        title: 'Digital Logic Gates (AND, OR, NOT, NAND, NOR, XOR)',
        idea: 'Digital circuits process binary 0 (LOW) and 1 (HIGH). NAND and NOR are "universal gates".',
        rules: [
          'AND (Y = A · B): output is 1 ONLY when BOTH A = 1 AND B = 1.',
          'OR (Y = A + B): output is 1 when AT LEAST ONE input is 1 (0 only when 0, 0).',
          'NOT (inverter): flips 0 → 1 and 1 → 0.',
          'NAND = NOT(A · B) (0 ONLY when both are 1);  NOR = NOT(A + B) (1 ONLY when both are 0);  XOR = 1 when inputs DIFFER!',
        ],
        ex: {
          q: 'Inputs A = 1 and B = 0 are fed into an OR gate, whose output passes into a NOT gate (forming a NOR gate). Find the final output Y.',
          steps: [
            ['OR gate output for (1, 0): 1 + 0 = 1', 'At least one input is HIGH.'],
            ['NOT gate inverts 1 → 0', 'Final NOR output Y = 0.'],
          ],
        },
        tryit: {
          q: 'For a 2-input NAND gate, which input pair (A, B) gives output 0?',
          o: ['A = 1, B = 1', 'A = 0, B = 0', 'A = 1, B = 0', 'A = 0, B = 1'],
          a: 0,
          h: 'NAND is NOT-AND: AND gives 1 only at (1, 1), so NAND gives 0 only at (1, 1)!',
          e: '1 NAND 1 = NOT(1 · 1) = 0.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'When a pure silicon thermistor is heated, its electrical resistance:', o: ['Decreases markedly because thermal energy liberates more electron–hole pairs', 'Increases linearly like copper', 'Becomes infinite', 'Stays constant'], a: 0, e: 'Semiconductors have a negative temperature coefficient of resistance.' },
      { l: 2, q: 'Pentavalent impurity atoms such as Arsenic or Phosphorus added to pure germanium are called:', o: ['Donor impurities, forming an n-type semiconductor', 'Acceptor impurities, forming p-type', 'Electrolytes', 'Depolarizers'], a: 0, e: 'Each Group-5 atom donates a fifth valence electron → n-type.' },
      { l: 3, q: 'In a power-supply circuit, a large capacitor connected in parallel across the output of a diode rectifier serves to:', o: ['Smooth out AC ripples in the rectified DC voltage', 'Step up AC voltage', 'Convert DC back to AC', 'Block all DC'], a: 0, e: 'The reservoir capacitor charges on peaks and discharges gently through the load between peaks.' },
      { l: 3, q: 'In an n–p–n bipolar junction transistor, the three terminals are called:', o: ['Emitter, Base, and Collector', 'Cathode, Grid, and Anode', 'Source, Gate, and Drain', 'Live, Neutral, and Earth'], a: 0, e: 'BJT terminals are Emitter (E), thin lightly-doped Base (B), and Collector (C).' },
      { l: 4, q: 'Which single logic gate gives output HIGH (1) ONLY when ALL its inputs are LOW (0)?', o: ['NOR gate', 'NAND gate', 'XOR gate', 'AND gate'], a: 0, e: 'OR gives 0 only at (0, 0), so NOR = NOT(OR) gives 1 ONLY at (0, 0).' },
      { l: 5, q: 'Laser light differs from ordinary filament lamp light because laser light is:', o: ['Monochromatic, coherent (in phase), and highly collimated', 'Polychromatic and incoherent', 'Longitudinal ultrasound', 'Faster than 3 × 10⁸ m s⁻¹'], a: 0, e: 'LASER emits coherent, monochromatic, unidirectional photons via stimulated emission.' },
    ],
  },
];
