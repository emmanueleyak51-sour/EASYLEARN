import { buildUtmeSubjectCurriculum, compactUtmeTopic, type CompactTopicInput } from './builder';
import { ELECINST_EXTRA_SPECS, AUTOMECH_EXTRA_SPECS, CARPENTRY_EXTRA_SPECS } from './extraWaecTradesB1';
import { BLOCKLAY_EXTRA_SPECS, GSM_EXTRA_SPECS } from './extraWaecTradesB2';

const ELECINST_SPECS: CompactTopicInput[] = [
  {
    id: 'ei-safety-circuits-wiring',
    name: 'Electrical safety, tools, Ohm’s law and domestic wiring',
    sec: 'Wiring & safety',
    goals: [
      'Apply lock-out safety, earthing, fuses and MCBs to prevent shock and fire',
      'Design simple lighting and ring/radial socket circuits using IEE/NEC colour codes',
    ],
    trap: 'Do not wire household lights or sockets in series — domestic circuits must be wired in PARALLEL so every lamp gets full 230 V and one blown bulb does not switch off the whole room.',
    p1: {
      title: 'Electrical safety, earthing and protective devices',
      idea: 'Mains electricity (230 V, 50 Hz AC in Nigeria) can kill in milliseconds if handled carelessly. Safe electricians isolate power before working, wear insulated boots, use insulated pliers and screwdrivers, and install protective devices: fuses and Miniature Circuit Breakers (MCBs) stop excess current/short circuits, Residual Current Devices (RCDs) trip on tiny earth leaks, and earthing directs fault current safely into the ground.',
      terms: [
        ['Earthing', 'Connecting exposed metal appliance casings to the general mass of earth so a live fault trips the breaker instantly'],
        ['MCB (Miniature Circuit Breaker)', 'Resettable automatic switch that cuts power during overload or short circuit'],
        ['Short circuit', 'Accidental low-resistance contact between Live and Neutral conductors causing dangerous surge current'],
      ],
      rules: [
        'Always isolate the main switch and verify dead with an approved voltage tester before touching conductors.',
        'Standard harmonised cable colours: Brown (or legacy Red) = Live, Blue (or legacy Black) = Neutral, Green/Yellow = Earth.',
      ],
      headers: ['Conductor', 'Modern colour (Legacy UK/NG)', 'Role'],
      rows: [
        ['Live (Line)', 'Brown (Red)', 'Carries 230 V alternating potential; always switched & fused'],
        ['Neutral', 'Blue (Black)', 'Completes return circuit near earth potential'],
        ['Earth (CPC)', 'Green/Yellow', 'Safety path carrying fault current to trip breaker'],
      ],
      exQ: 'An electric iron draws 1,150 W from a 230 V mains socket. Calculate the normal operating current and pick a suitable plug fuse (3 A, 5 A or 13 A).',
      exSteps: [
        ['Use I = P ÷ V', 'I = 1,150 ÷ 230 = 5.0 A'],
        ['Pick next safe rating above 5 A', '13 A plug fuse (or 10 A MCB); 5 A fuse would blow at startup'],
      ],
      checkQ: 'Which wire must ALWAYS pass through the wall light switch and fuse so the appliance is completely disconnected from 230 V when turned off?',
      checkO: ['Live (Line) wire', 'Earth wire', 'Neutral wire only', 'Plastic conduit'],
      checkH: ['Putting a switch on Neutral leaves the bulb holder dangerously live even when the light is off.', 'It is the brown/red conductor.'],
      checkE: 'Switches and fuses are always connected on the Live conductor for safety.',
    },
    p2: {
      title: 'Domestic wiring systems, lighting and socket circuits',
      idea: 'Homes use PVC-insulated copper cables run inside PVC/steel conduits or surface trunking. Lighting circuits usually use 1.5 mm² cable protected by a 5 A or 6 A MCB, wired in parallel (including two-way staircase switching). Socket outlets use 2.5 mm² cable on a 20 A radial or 32 A ring final circuit, while heavy cookers and water heaters need dedicated 4–6 mm² circuits.',
      terms: [
        ['Ring final circuit', 'Loop of 2.5 mm² cable starting and returning to the same 32 A MCB, supplying socket outlets via two paths'],
        ['Two-way switching', 'Using two two-way switches so one lamp (e.g. stairs or corridor) can be controlled from either end'],
        ['Distribution board', 'Consumer unit housing the main isolator, RCD and individual circuit MCBs'],
      ],
      rules: [
        'Connect all domestic lamps and sockets in parallel so every appliance receives full rated 230 V.',
        'Never oversize a fuse or bridge a blown fuse with thick copper wire — cables will overheat and ignite walls.',
      ],
      headers: ['Domestic circuit', 'Typical cable size & MCB'],
      rows: [
        ['Lighting', '1.5 mm² copper — 6 A MCB'],
        ['Ring socket outlet', '2.5 mm² copper — 32 A MCB'],
        ['Electric cooker', '6.0 mm² copper — 32–45 A MCB'],
      ],
      exQ: 'Why does a blown bulb in the sitting room leave the bedroom lamp glowing normally?',
      exSteps: [
        ['Check circuit layout', 'Lighting points are connected in parallel across Live and Neutral'],
        ['Explain result', 'Each branch carries its own independent current path'],
      ],
      checkQ: 'What standard copper cable cross-sectional area is normally used for domestic lighting circuits in Nigeria?',
      checkO: ['1.5 mm²', '16 mm²', '0.2 mm²', '25 mm²'],
      checkH: ['Sockets use 2.5 mm²; lighting draws much smaller current.', 'Protected by a 5 A or 6 A breaker.'],
      checkE: 'Domestic lighting circuits typically use 1.5 mm² PVC-insulated copper cable.',
    },
    qs: [
      ['What is the standard single-phase mains voltage and frequency supplied to Nigerian homes?', '230 V at 50 Hz', '110 V at 60 Hz', '12 V DC', '1,000 V at 100 Hz', 'Nigeria uses 230 V (nominal 220–240 V) at 50 Hz AC.'],
      ['Under current colour coding, Green and Yellow stripes always identify the', 'Earth (protective) conductor', 'Live conductor', 'Neutral conductor', 'Telephone wire', 'Green/Yellow is universally reserved for protective earthing.'],
      ['Which safety device trips in milliseconds when it detects even 30 mA leaking through a person to earth?', 'RCD (Residual Current Device)', 'Filament lamp', 'Dimmer knob', 'Bell transformer', 'An RCD compares live and neutral currents and cuts power immediately upon earth leakage.'],
      ['If three 60 W lamps run in parallel on a 240 V supply, the total current drawn is', '0.75 A', '4.0 A', '12 A', '0.25 A', 'Total power = 180 W; I = 180 ÷ 240 = 0.75 A.'],
      ['Why is bridging a blown 13 A fuse with thick copper wire extremely dangerous?', 'Excess fault current will melt cable insulation and start an electrical fire', 'It makes bulbs dim immediately', 'It turns AC into DC', 'It lowers electricity bills', 'Fuses are deliberate weak links designed to melt before wiring catches fire.'],
      ['Which switch arrangement lets a homeowner switch a hallway lamp ON downstairs and OFF upstairs?', 'Two-way switching', 'One-way series switch', 'Bell push switch', 'Knife isolator', 'Two-way switches use strappers between both ends to toggle one lamp.'],
    ],
  },
  {
    id: 'ei-testing-machines-transformers',
    name: 'Inspection, testing, batteries, transformers and AC motors',
    sec: 'Testing & machines',
    goals: [
      'Carry out continuity, polarity and insulation resistance tests before energising circuits',
      'Explain battery charging, single-phase transformers and induction motor starters',
    ],
    trap: 'Do not use an insulation resistance tester (Megger, 500 V DC) while mains power is ON or delicate electronics are plugged in — always isolate power and disconnect sensitive loads first.',
    p1: {
      title: 'Testing electrical installations before switch-on',
      idea: 'Every new wiring installation must pass dead tests before mains power is switched on: Continuity of protective conductors (proving earth paths are unbroken), Polarity test (verifying all switches and fuses sit on the Live line), and Insulation Resistance test using a 500 V DC Megger (confirming Live, Neutral and Earth do not leak into each other — minimum acceptable reading ≥ 1 MΩ).',
      terms: [
        ['Insulation resistance test', 'High-voltage DC test checking that cable insulation prevents leakage between conductors (≥ 1 MΩ)'],
        ['Continuity test', 'Low-resistance check confirming conductors and earth paths are unbroken'],
        ['Polarity test', 'Check confirming single-pole switches and fuse carriers break the Live conductor, not Neutral'],
      ],
      rules: [
        'Always verify visual inspection first (tight terminals, proper grommets, correct cable size), then dead tests, then live tests.',
        'An insulation resistance reading near 0 Ω indicates a dead short or damaged cable insulation.',
      ],
      headers: ['Test', 'Instrument & purpose'],
      rows: [
        ['Continuity', 'Low-resistance ohmmeter — checks earth & ring loop unbroken'],
        ['Insulation resistance', 'Insulation tester (Megger) — checks insulation ≥ 1 MΩ'],
        ['Polarity', 'Continuity/voltage tester — checks switches break Live only'],
      ],
      exQ: 'Before connecting a newly wired bungalow to the meter, an electrician measures 0.05 MΩ between Live and Earth. Should they switch on the power?',
      exSteps: [
        ['Compare with minimum safe standard', '0.05 MΩ is far below the 1 MΩ minimum'],
        ['Action', 'Do NOT energise — locate and repair the damaged insulation or damp junction box first'],
      ],
      checkQ: 'Which instrument tests whether PVC cable insulation has broken down between Live, Neutral and Earth?',
      checkO: ['Insulation resistance tester (Megger)', 'Hydrometer', 'Tachometer', 'Vernier calliper'],
      checkH: ['It applies a safe 500 V DC test voltage on a dead circuit.', 'Readings are measured in megaohms (MΩ).'],
      checkE: 'An insulation resistance tester (Megger) measures insulation quality in megaohms.',
    },
    p2: {
      title: 'Transformers, batteries and induction motors',
      idea: 'Transformers step AC voltage up or down by electromagnetic induction (V₁/V₂ = N₁/N₂) with no moving parts; they do NOT work on steady DC. Lead-acid batteries store DC energy for inverters and solar systems (checked with a hydrometer for acid specific gravity). Single-phase and three-phase induction motors power pumps, mills and fans, using Direct-On-Line (DOL) or Star-Delta starters to limit high starting current.',
      terms: [
        ['Step-down transformer', 'Transformer with fewer secondary turns than primary turns, reducing voltage (e.g. 11 kV to 415/230 V)'],
        ['Hydrometer', 'Glass float tool measuring specific gravity of battery electrolyte to judge state of charge'],
        ['DOL starter', 'Direct-On-Line motor starter with contactor and thermal overload relay for small motors'],
      ],
      rules: [
        'Transformers operate on alternating current (AC) only — steady DC creates no changing magnetic flux.',
        'Always top up flooded lead-acid battery cells with distilled water, never tap water or raw acid.',
      ],
      headers: ['Machine / component', 'Core purpose'],
      rows: [
        ['Transformer', 'Changes AC voltage levels efficiently via mutual induction'],
        ['Inverter', 'Converts battery DC power into 230 V AC for household backup'],
        ['Thermal overload relay', 'Protects motor windings from burning during sustained overload'],
      ],
      exQ: 'A transformer has 1,000 primary turns connected to 240 V AC and 100 secondary turns. Find the secondary voltage.',
      exSteps: [
        ['Use turns ratio V₂ = V₁ × (N₂ ÷ N₁)', 'V₂ = 240 × (100 ÷ 1,000)'],
        ['Compute', 'V₂ = 24 V AC'],
      ],
      checkQ: 'Why must a flooded lead-acid inverter battery be topped up with distilled water rather than ordinary tap water?',
      checkO: ['Tap water contains minerals and salts that corrode plates and shorten battery life', 'Tap water cannot conduct electricity at all', 'Distilled water turns into petrol', 'Tap water freezes at room temperature'],
      checkH: ['During charging, pure water evaporates while acid remains inside the cell.', 'Impurities ruin lead plates.'],
      checkE: 'Distilled water replaces evaporated water without introducing damaging minerals.',
    },
    qs: [
      ['What minimum insulation resistance value is generally required on a healthy new domestic circuit?', 'At least 1 MΩ (megaohm)', '0.01 Ω', '10 Ω', '0 MΩ', 'Healthy PVC insulation measures well above 1 MΩ.'],
      ['A transformer connected directly to a steady 12 V DC car battery will', 'produce zero steady secondary output and may overheat the primary winding', 'step the voltage up to 240 V DC', 'spin like an electric fan', 'charge itself forever', 'Transformers require changing magnetic flux from AC.'],
      ['Which device converts 12 V or 24 V DC from solar batteries into 230 V AC for home appliances?', 'Inverter', 'Rectifier', 'Fuse wire', 'Contactor coil', 'An inverter turns DC into AC; a rectifier turns AC into DC.'],
      ['What is the purpose of a thermal overload relay inside an electric motor starter?', 'To disconnect the motor automatically if prolonged excessive current threatens to burn the windings', 'To reverse the motor speed every minute', 'To raise supply voltage to 11 kV', 'To lubricate the shaft bearings', 'Overload relays trip safely before winding insulation melts.'],
      ['Which tool measures the specific gravity of sulphuric acid electrolyte in a lead-acid battery?', 'Hydrometer', 'Ammeter', 'Micrometer', 'Wattmeter', 'A fully charged lead-acid cell shows a specific gravity around 1.26–1.28 on a hydrometer.'],
      ['A transformer with 400 primary turns and 800 secondary turns connected to 120 V AC outputs', '240 V AC', '60 V AC', '120 V DC', '480 V AC', 'V₂ = 120 × (800 ÷ 400) = 240 V AC (step-up).'],
    ],
  },
];

const AUTOMECH_SPECS: CompactTopicInput[] = [
  {
    id: 'am-engine-four-stroke-cooling',
    name: 'Four-stroke petrol & diesel engines, lubrication and cooling',
    sec: 'Engine systems',
    goals: [
      'Trace the intake, compression, power and exhaust strokes of a four-stroke engine',
      'Explain lubrication, liquid cooling systems and key petrol vs diesel differences',
    ],
    trap: 'Do not confuse petrol and diesel ignition — petrol engines ignite an air-fuel mix using a SPARK PLUG, while diesel engines compress pure air so hotly that injected fuel self-ignites without spark plugs.',
    p1: {
      title: 'The four-stroke cycle and engine components',
      idea: 'An internal combustion engine converts chemical energy in fuel into rotating mechanical power. Pistons slide up and down inside cylinders, driving connecting rods that turn the crankshaft. One complete four-stroke cycle takes two full crankshaft revolutions: Induction (intake valve opens, piston moves down), Compression (both valves shut, piston rises), Power (spark/fuel ignites, gases push piston down) and Exhaust (exhaust valve opens, piston pushes burned gas out).',
      terms: [
        ['Crankshaft', 'Main rotating shaft that converts straight up-and-down piston motion into circular motion'],
        ['Camshaft', 'Timed shaft with lobes that open intake and exhaust valves at exact moments'],
        ['Flywheel', 'Heavy disc bolted to the crankshaft rear to smooth power pulses and carry the starter ring gear'],
      ],
      rules: [
        'In a 4-stroke engine, the camshaft rotates at exactly HALF the speed of the crankshaft.',
        'Only ONE of the four strokes (the Power stroke) produces driving force; the flywheel’s momentum carries the other three.',
      ],
      headers: ['Engine type', 'Fuel & ignition method'],
      rows: [
        ['Petrol (SI)', 'Air + petrol mixed; ignited by electric spark plug'],
        ['Diesel (CI)', 'Pure air compressed tightly; diesel sprayed in and self-ignites'],
      ],
      exQ: 'During which stroke are BOTH intake and exhaust valves firmly closed while the piston travels upward?',
      exSteps: [
        ['Check piston direction', 'Moving upward while trapping the charge tightly'],
        ['Name stroke', 'Compression stroke'],
      ],
      checkQ: 'How does fuel ignite inside a four-stroke diesel (compression-ignition) engine?',
      checkO: ['Injected diesel self-ignites from the intense heat of highly compressed air', 'A spark plug fires at the top of the stroke', 'A glowing wooden match lights it', 'Coolant water mixes with fuel'],
      checkH: ['Diesel engines have fuel injectors instead of spark plugs.', 'Compressing air at ratios like 18:1 makes it fiercely hot.'],
      checkE: 'Diesel engines rely on compression heat to auto-ignite sprayed fuel without spark plugs.',
    },
    p2: {
      title: 'Lubrication and liquid cooling systems',
      idea: 'Moving metal pistons and bearings would weld together within seconds without engine oil. The oil pump draws oil from the sump through a filter to reduce friction, carry heat away, clean sludge and seal piston rings. Meanwhile, the water pump circulates coolant through engine water jackets, a thermostat (which stays shut until warm-up) and the front radiator where airflow removes heat.',
      terms: [
        ['Thermostat', 'Heat-sensitive valve that blocks coolant flow to the radiator until the engine reaches working temperature'],
        ['Radiator', 'Finned heat exchanger at the front of the car that transfers heat from hot coolant to passing air'],
        ['Sump (oil pan)', 'Reservoir bolted under the engine block holding lubricating oil'],
      ],
      rules: [
        'Never open a hot pressurised radiator cap immediately — scalding steam and coolant can burst out and burn you.',
        'Check engine oil level with the dipstick on level ground before starting a long journey.',
      ],
      headers: ['System component', 'Function'],
      rows: [
        ['Oil pump & filter', 'Circulates clean pressurised oil to bearings and cams'],
        ['Thermostat', 'Speeds warm-up and holds steady operating temperature'],
        ['Radiator & fan', 'Cools hot liquid before returning it to the engine block'],
      ],
      exQ: 'A mechanic removes a faulty thermostat completely and leaves it out. What problem occurs?',
      exSteps: [
        ['Trace coolant path', 'Coolant circulates continuously through the radiator from cold start'],
        ['Result', 'Engine warms up far too slowly, raising fuel consumption and piston wear'],
      ],
      checkQ: 'Which cooling-system valve stays closed on a cold morning so the engine reaches its ideal working temperature quickly?',
      checkO: ['Thermostat', 'Carburettor jet', 'Brake master cylinder', 'Alternator pulley'],
      checkH: ['It senses coolant temperature and opens around 85–90°C.', 'Its name contains "thermo" (heat).'],
      checkE: 'The thermostat stays closed during cold start and opens once coolant reaches normal operating temperature.',
    },
    qs: [
      ['How many full revolutions does the crankshaft make to complete one full four-stroke cycle?', 'Two revolutions (720°)', 'Half a revolution (180°)', 'One revolution (360°)', 'Four revolutions (1440°)', 'Four piston strokes equal two complete crankshaft turns.'],
      ['Which heavy rotating wheel smooths out engine power pulses between firing strokes?', 'Flywheel', 'Radiator cap', 'Dipstick', 'Air filter', 'The flywheel stores rotational inertia to keep rotation smooth.'],
      ['What is the main job of the piston rings fitted in grooves around a piston?', 'Seal combustion gases and scrape excess oil off cylinder walls', 'Hold the radiator fan upright', 'Steer the front tyres', 'Charge the car battery', 'Compression rings seal hot gas; oil-control rings prevent oil burning in the chamber.'],
      ['Never remove a hot car’s radiator pressure cap suddenly because', 'pressurised boiling coolant and steam can erupt and cause severe burns', 'the engine oil will freeze', 'the tyres will deflate', 'the headlights will blow', 'Cooling systems run above 100°C under pressure; let the engine cool first.'],
      ['Which part links the piston directly to the crankshaft?', 'Connecting rod', 'Timing belt only', 'Exhaust manifold', 'Leaf spring', 'The connecting rod transfers piston thrust to the crankshaft crankpin.'],
      ['Blue smoky exhaust coming from a petrol car tailpipe usually indicates', 'engine oil leaking past worn piston rings or valve seals into combustion', 'pure clean water vapour', 'a freshly polished bonnet', 'over-inflated tyres', 'Burning lubricating oil produces characteristic bluish smoke.'],
    ],
  },
  {
    id: 'am-transmission-brakes-electrical',
    name: 'Transmission, braking, steering, suspension and auto electricals',
    sec: 'Chassis & electricals',
    goals: [
      'Trace power flow from clutch and gearbox through propeller shaft and differential to wheels',
      'Explain hydraulic braking (Pascal’s principle), battery/alternator charging and tyre care',
    ],
    trap: 'Do not confuse the starter motor (draws huge short bursts from the battery to crank the engine) with the alternator (driven by the running engine to recharge the battery and run lights).',
    p1: {
      title: 'Transmission, steering and suspension',
      idea: 'Power travels from the engine via the Clutch (smoothly connects/disconnects drive for gear changes) into the Gearbox (multiplies torque in 1st gear for hills and gives high speed in top gear), through the Propeller Shaft / Driveshafts and Differential (allows outer wheels to turn faster than inner wheels smoothly around corners). Suspension springs and shock absorbers (dampers) keep tyres planted safely on rough Nigerian roads.',
      terms: [
        ['Clutch', 'Friction coupling that temporarily disconnects engine power from the gearbox during gear shifts'],
        ['Differential', 'Gear set allowing left and right driven wheels to rotate at different speeds when cornering'],
        ['Shock absorber (damper)', 'Hydraulic cylinder that stops suspension springs bouncing repeatedly after hitting a pothole'],
      ],
      rules: [
        'Low gear (1st) gives high torque at low speed for starting and climbing; high gear (5th) gives fuel-efficient cruising.',
        'Worn shock absorbers increase stopping distances and cause uneven tyre cupping.',
      ],
      headers: ['Drivetrain part', 'Job'],
      rows: [
        ['Clutch', 'Engages and disengages engine drive smoothly'],
        ['Gearbox', 'Provides torque multiplication, cruise ratios and reverse'],
        ['Differential', 'Splits drive and lets outer wheel spin faster on turns'],
      ],
      exQ: 'Why would a car’s tyres scrub and chirp violently around tight bends if the two rear wheels were welded solidly onto one rigid axle?',
      exSteps: [
        ['Compare wheel paths', 'The outer wheel covers a longer arc than the inner wheel in a turn'],
        ['Role of differential', 'A differential lets the outer wheel turn faster while still delivering power'],
      ],
      checkQ: 'Which drivetrain assembly lets the outer driven wheel spin faster than the inner wheel when a car rounds a corner?',
      checkO: ['Differential', 'Radiator', 'Spark plug', 'Oil sump'],
      checkH: ['Its name comes from allowing a "difference" in left/right wheel speeds.', 'Mounted between the driven half-shafts.'],
      checkE: 'The differential permits driven wheels to rotate at different speeds while cornering.',
    },
    p2: {
      title: 'Hydraulic brakes and automotive electrical system',
      idea: 'Hydraulic brakes obey Pascal’s principle: pressing the brake pedal forces incompressible brake fluid from the Master Cylinder equally to wheel cylinders (drum brakes) or calipers (disc brakes), clamping pads against spinning discs. Air trapped in brake lines feels "spongy" and must be bled out. Electrically, the 12 V Battery powers the Starter Motor at startup; once running, the belt-driven Alternator generates electricity (rectified to DC) to power accessories and recharge the battery.',
      terms: [
        ['Master cylinder', 'Hydraulic piston unit linked to the brake pedal that pressurises brake fluid to all wheels'],
        ['Brake bleeding', 'Purging trapped compressible air bubbles from hydraulic brake lines to restore a firm pedal'],
        ['Alternator', 'Belt-driven generator that powers vehicle electricals and recharges the 12 V battery while running'],
      ],
      rules: [
        'Disc brakes resist fade better than drum brakes because open discs cool faster in airflow.',
        'Never disconnect a car battery while the engine is running — voltage spikes can destroy the ECU and alternator diodes.',
      ],
      headers: ['Electrical component', 'Main function'],
      rows: [
        ['12 V Battery', 'Stores DC power for cranking and engine-off loads'],
        ['Starter motor', 'Cranks the flywheel to start the engine'],
        ['Alternator', 'Recharges battery and runs lights/ECU once engine runs'],
      ],
      exQ: 'A driver notices the brake pedal sinks softly almost to the floor, requiring two pumps to stop. What is the likely fault and remedy?',
      exSteps: [
        ['Identify symptom', 'Spongy pedal means compressible air entered the hydraulic fluid lines (or a leak)'],
        ['Remedy', 'Repair any leak, top up approved DOT brake fluid and bleed the brake lines'],
      ],
      checkQ: 'Which component recharges a car’s 12 V battery and powers the headlights while the engine is running?',
      checkO: ['Alternator', 'Starter solenoid', 'Shock absorber', 'Exhaust silencer'],
      checkH: ['It is driven by a rubber belt from the crankshaft pulley.', 'It converts engine mechanical energy into electrical power.'],
      checkE: 'The alternator generates electrical power while the engine runs, recharging the battery.',
    },
    qs: [
      ['Hydraulic car braking systems operate on which scientific principle?', 'Pascal’s principle of fluid pressure transmission', 'Archimedes’ buoyancy law', 'Boyle’s gas compression law', 'Ohm’s thermal law', 'Pressure applied to confined incompressible brake fluid transmits equally to all wheel calipers.'],
      ['Why must air bubbles be bled out of hydraulic brake pipes?', 'Air compresses under foot pressure, causing a spongy pedal and weak braking', 'Air turns brake discs into rubber', 'Air makes the steering lock upward', 'Air overcharges the battery', 'Liquids are virtually incompressible, whereas trapped air compresses and ruins braking force.'],
      ['Which device temporarily disconnects the running engine from the gearbox so gears shift without grinding?', 'Clutch', 'Carburettor', 'Alternator', 'Thermostat', 'Pressing the clutch pedal disengages the friction plate from the flywheel.'],
      ['What is the job of shock absorbers (dampers) fitted alongside vehicle suspension springs?', 'Dampen spring oscillations so the car stays stable and tyres grip the road', 'Pump petrol into the tank', 'Cool the gearbox oil', 'Inflate the spare tyre', 'Without dampers, springs would keep bouncing wildly after every bump.'],
      ['Which high-torque electric motor cranks the engine flywheel during ignition start?', 'Starter motor', 'Wiper motor', 'Radiator fan', 'Alternator', 'The starter motor draws heavy current from the battery briefly to turn the engine over.'],
      ['Checking tyre pressure and wheel alignment regularly helps to', 'prevent rapid uneven tyre wear and keep steering safe', 'increase fuel waste', 'disable the handbrake', 'rust the exhaust', 'Proper inflation and alignment extend tyre life and improve road grip.'],
    ],
  },
];

const CARPENTRY_SPECS: CompactTopicInput[] = [
  {
    id: 'cp-timber-tools-seasoning',
    name: 'Timber types, conversion, seasoning and woodworking hand tools',
    sec: 'Timber & hand tools',
    goals: [
      'Distinguish Nigerian hardwoods and softwoods and explain natural vs kiln seasoning',
      'Select saws, planes, chisels and marking tools safely and accurately',
    ],
    trap: 'Do not confuse "hardwood" and "softwood" strictly by literal hardness — they are botanical classes (broad-leaved deciduous trees like Iroko/Mahogany vs cone-bearing conifers like Pine).',
    p1: {
      title: 'Timber classification, conversion and seasoning',
      idea: 'Wood is a strong, renewable building material harvested from forests. Nigerian hardwoods (Iroko, Mahogany, Opepe, Obeche, Mansonia) come from broad-leaved trees and are prized for doors, roofing and furniture; softwoods (Pine, Cedar) come from needle-leaved conifers. After felling, logs are sawn into boards (conversion) and dried (seasoning) either in open air or heated kilns to reduce moisture, prevent warping/fungal rot and increase strength.',
      terms: [
        ['Timber conversion', 'Sawing felled tree trunks into usable planks, beams and battens (through-and-through or quarter sawing)'],
        ['Seasoning', 'Controlled drying of timber to remove excess sap moisture so boards stay stable and resist decay'],
        ['Heartwood', 'Older, darker inner core of a tree trunk — harder and far more durable than outer sapwood'],
      ],
      rules: [
        'Seasoned timber is lighter, stronger, glues cleanly, holds paint well and resists fungal rot.',
        'Quarter sawing produces more attractive figure and shrinks/warps less than plain through-and-through sawing.',
      ],
      headers: ['Seasoning method', 'Advantage & trade-off'],
      rows: [
        ['Air (natural) seasoning', 'Low cost using stacked stickers in open shed; slow (months to years)'],
        ['Kiln (artificial) seasoning', 'Fast (days/weeks) with exact moisture control; higher energy cost'],
      ],
      exQ: 'A carpenter builds a front door using freshly felled green (unseasoned) Iroko planks. What will happen after one dry harmattan season?',
      exSteps: [
        ['Consider moisture loss', 'Green timber loses water rapidly in dry air'],
        ['Predict defects', 'The panels will shrink, crack (check) and twist out of square'],
      ],
      checkQ: 'Why must freshly sawn timber be seasoned before crafting doors or tables?',
      checkO: ['To reduce excess moisture so the wood strengthens and will not shrink, warp or rot later', 'To make boards heavier with water', 'To attract termites faster', 'To prevent glue from sticking'],
      checkH: ['Wet "green" wood dries unevenly inside a finished home.', 'Controlled drying stabilises dimensions.'],
      checkE: 'Seasoning lowers moisture content safely, boosting strength and preventing shrinkage, warping and decay.',
    },
    p2: {
      title: 'Woodworking measuring, sawing, planing and boring tools',
      idea: 'Precision carpentry relies on crisp layout and sharp tools: Try Square checks 90° right angles; Marking Gauge scribes parallel lines along grain; Rip Saw cuts WITH the grain while Crosscut Saw cuts ACROSS the grain; Tenon Saw (with brass/steel spine) makes fine accurate joint cuts; Jack Plane levels rough boards; Firmer/Mortise Chisels pare timber; Brace and Bit or power drills bore clean holes.',
      terms: [
        ['Try square', 'L-shaped metal blade and stock tool for testing 90° squareness and marking straight lines'],
        ['Tenon saw', 'Fine-toothed backsaw with a stiff metal rib used for accurate straight joinery cuts'],
        ['Jack plane', 'General-purpose bench plane used to true up and smooth rough-sawn timber faces'],
      ],
      rules: [
        'Always plane WITH the grain (smooth direction) to prevent tearing wood fibres.',
        'Keep both hands behind the sharp cutting edge of a chisel — never hold a small workpiece against your palm while paring.',
      ],
      headers: ['Woodworking task', 'Correct hand tool'],
      rows: [
        ['Cutting straight along grain', 'Rip saw'],
        ['Cutting fine shoulder of a joint', 'Tenon saw'],
        ['Checking 90° corner squareness', 'Try square'],
        ['Cutting deep square mortise slot', 'Mortise chisel & wooden mallet'],
      ],
      exQ: 'Which saw should a joiner pick to cut neat accurate cheeks and shoulders on a small chair rail joint?',
      exSteps: [
        ['Evaluate cut requirement', 'Fine, rigid, straight cut on bench work'],
        ['Select tool', 'Tenon saw (backsaw)'],
      ],
      checkQ: 'Which hand tool is used to check that two planed timber edges meet at an exact 90° right angle?',
      checkO: ['Try square', 'Rip saw', 'Claw hammer', 'Wood rasp'],
      checkH: ['It has a flat steel blade fixed firmly at 90° into a hardwood or metal stock.', 'Carpenters "try" corners for squareness with it.'],
      checkE: 'A try square verifies accurate 90° angles and guides square pencil lines.',
    },
    qs: [
      ['Which prized Nigerian hardwood is widely used for durable exterior doors and heavy roofing beams?', 'Iroko', 'Pine', 'Spruce', 'Balsa', 'Iroko is a tough, naturally durable Nigerian hardwood.'],
      ['Drying sawn timber planks inside a temperature- and humidity-controlled chamber is called', 'kiln seasoning', 'air stacking', 'quarter felling', 'veneer peeling', 'Kiln seasoning dries timber rapidly and evenly to exact moisture levels.'],
      ['Which hand saw has a rigid metal spine along its back to keep fine joinery cuts dead straight?', 'Tenon saw', 'Rip saw', 'Bow saw', 'Chainsaw', 'The stiffened back of a tenon saw prevents blade wobble on precision joints.'],
      ['The dense, darker inner wood of a mature tree trunk that resists decay best is', 'heartwood', 'sapwood', 'bark', 'cambium', 'Heartwood has natural extractives making it stronger and more decay-resistant than sapwood.'],
      ['What should a carpenter use to strike the handle of a heavy wooden-handled mortise chisel?', 'A wooden mallet', 'A steel sledgehammer', 'A glass bottle', 'A tenon saw back', 'A wooden mallet absorbs shock without splitting the chisel handle.'],
      ['Thin wooden strips placed evenly between stacked boards during air seasoning to allow airflow are called', 'stickers (piling sticks)', 'dowels', 'hinges', 'wedges', 'Stickers separate plank layers so dry air circulates evenly around every face.'],
    ],
  },
  {
    id: 'cp-joints-roofs-finishing',
    name: 'Woodwork joints, roof trusses, adhesives and surface finishing',
    sec: 'Joinery & finishing',
    goals: [
      'Select butt, halving, mortise-and-tenon and dovetail joints for frames and drawers',
      'Identify timber roof parts, PVA/contact adhesives and varnishing steps',
    ],
    trap: 'Do not use a weak plain butt joint on a heavy door frame or table leg — structural frames require interlocking mortise-and-tenon joints to resist racking.',
    p1: {
      title: 'Essential woodworking joints and where to use them',
      idea: 'Timber joints lock pieces cleanly without relying on nails alone. Mortise-and-tenon is the king of strong framing (tables, chairs, panel doors); Dovetail joints resist pulling apart (drawer fronts and fine boxes); Halving joints cross two rails flush; Bridle and Mitre joints finish picture frames and corners cleanly.',
      terms: [
        ['Mortise and tenon', 'Strong frame joint where a projecting tongue (tenon) fits tightly into a matching slot (mortise)'],
        ['Dovetail joint', 'Interlocking fan-shaped pins and tails giving supreme resistance against pulling apart'],
        ['Halving joint', 'Joint where half the thickness is removed from each piece so they cross flush'],
      ],
      rules: [
        'For a standard mortise-and-tenon, make the tenon thickness roughly ONE-THIRD the total thickness of the timber.',
        'Always check diagonal measurements of a glued frame — equal diagonals prove the rectangle is perfectly square.',
      ],
      headers: ['Joint type', 'Best woodwork application'],
      rows: [
        ['Mortise and tenon', 'Doors, chairs, dining table legs and rails'],
        ['Dovetail', 'Drawer fronts and sturdy cabinet carcases'],
        ['Mitre joint', 'Picture frames and architrave trim'],
        ['Tongue and groove', 'Floorboards and timber wall panelling'],
      ],
      exQ: 'A student builds a heavy bedroom chest drawer that will be pulled open thousands of times. Which joint locks the drawer front firmly to the sides?',
      exSteps: [
        ['Identify stress direction', 'Repeated pulling tension straight outward on the front face'],
        ['Select joint', 'Dovetail joint (wedge-shaped tails cannot pull out)'],
      ],
      checkQ: 'Which classic woodworking joint is strongest for connecting legs and rails on wooden chairs and panel doors?',
      checkO: ['Mortise-and-tenon joint', 'Plain butt joint', 'Tape wrap joint', 'Loose lap without glue'],
      checkH: ['One piece has a rectangular tongue; the matching piece has a chiselled rectangular hole.', 'Standard tenon thickness is one-third of rail thickness.'],
      checkE: 'Mortise-and-tenon joints give huge gluing surface and resist twisting in frames.',
    },
    p2: {
      title: 'Roof carpentry, adhesives and wood finishing',
      idea: 'In Nigerian buildings, timber roof trusses carry roofing sheets safely over walls using a triangular network of Rafters (sloping timbers), Tie Beams (horizontal base preventing walls pushing outward), King Post (central vertical tie), Purlins (horizontal battens holding zinc/aluminium sheets) and Wall Plates (resting level on top of block walls). For furniture, PVA glue bonds clean wood joints, followed by progressive sanding along the grain, wood filler, sanding sealer and varnish or polish.',
      terms: [
        ['Wall plate', 'Horizontal timber beam bedded flat on top of a masonry wall to spread roof rafter loads evenly'],
        ['Purlin', 'Horizontal roof member running across rafters to support corrugated roofing sheets'],
        ['PVA adhesive', 'Water-based white woodworking glue that dries clear and strong on tight wood-to-wood joints'],
      ],
      rules: [
        'Always sand timber WITH the grain (coarse → medium → fine sandpaper) — sanding across the grain leaves ugly visible scratches under varnish.',
        'Wipe off squeezed-out glue with a damp cloth before it dries, because dried glue blocks wood stain.',
      ],
      headers: ['Roof member', 'Structural role'],
      rows: [
        ['Wall plate', 'Distributes roof loads evenly onto the block wall'],
        ['Rafter', 'Sloping timber defining roof pitch and carrying purlins'],
        ['Tie beam', 'Ties opposite rafters together so walls do not spread outward'],
        ['Purlin', 'Horizontal support to which roofing sheets are nailed'],
      ],
      exQ: 'Why must a finisher sand an Iroko table top strictly along the direction of the wood grain before varnishing?',
      exSteps: [
        ['Compare scratch visibility', 'Cross-grain sanding tears fibres and leaves dark lines once stain/varnish is applied'],
        ['Conclude', 'With-the-grain sanding leaves a silky, flawless sheen'],
      ],
      checkQ: 'Which horizontal roof timbers run across the sloping rafters so corrugated aluminium roofing sheets can be nailed down?',
      checkO: ['Purlins', 'Skirting boards', 'Architraves', 'Dado rails'],
      checkH: ['Sheets rest directly on top of these horizontal battens.', 'They span from truss to truss.'],
      checkE: 'Purlins span across rafters to carry and fix roofing sheets.',
    },
    qs: [
      ['Which interlocking woodwork joint is famous for keeping wooden drawer fronts from pulling loose?', 'Dovetail joint', 'Plain butt joint', 'Scarfed lap', 'Loose mitre', 'Wedge-shaped dovetail pins resist direct pulling tension.'],
      ['As a general rule, the thickness of a tenon should be about what fraction of the timber thickness?', 'One-third (1/3)', 'Three-quarters (3/4)', 'Nine-tenths (9/10)', 'One-tenth (1/10)', 'Making a tenon 1/3 thick balances tenon strength with mortise cheek strength.'],
      ['How do carpenters quickly check whether an assembled rectangular door frame is perfectly square?', 'Measure both diagonals — equal lengths confirm squareness', 'Weigh the frame on a kitchen scale', 'Count the knots in the wood', 'Dip the corner in varnish', 'A parallelogram with equal diagonals is a true rectangle (90° corners).'],
      ['Which horizontal timber member rests directly on top of the block wall to anchor roof rafters?', 'Wall plate', 'Ridge board', 'Fascia board', 'Door sill', 'The wall plate levels and distributes rafter loads along the masonry wall.'],
      ['Which common white woodworking glue sets strongly on clean, tight indoor timber joints?', 'PVA (polyvinyl acetate) glue', 'Engine grease', 'Bitumen tar', 'Water paint', 'PVA white wood glue forms clean, high-strength indoor timber bonds.'],
      ['Sanding a wooden tabletop across the grain instead of along the grain leaves', 'ugly visible scratch marks highlighted by stain and varnish', 'a mirror-bright finish automatically', 'harder heartwood', 'waterproofed pores', 'Always finish-sand strictly parallel to the grain direction.'],
    ],
  },
];

const BLOCKLAY_SPECS: CompactTopicInput[] = [
  {
    id: 'bl-site-foundations-concrete',
    name: 'Site preparation, foundations, mortar and concrete mixes',
    sec: 'Foundations & mixes',
    goals: [
      'Set out building corners squarely using the 3-4-5 method and identify foundation types',
      'Proportion, mix, place and cure concrete and sandcrete mortar cleanly',
    ],
    trap: 'Do not confuse mortar (cement + sharp sand + water, used to bond blocks and plaster walls) with concrete (cement + sand + coarse granite gravel + water, used for foundations, columns and slabs).',
    p1: {
      title: 'Setting out and building foundations',
      idea: 'Every durable building starts with clearing vegetation, stripping weak topsoil and setting out exact wall lines with profile boards and builder’s lines. Masons check exact 90° corners using the Pythagorean 3-4-5 triangle (3 m, 4 m and 5 m diagonal). Foundations transfer building weight safely into firm subsoil: Strip foundations serve most Nigerian bungalows, Pad foundations carry isolated columns, and Raft foundations float buildings over swampy clay soil.',
      terms: [
        ['Setting out', 'Transferring dimensions from the building plan onto the cleared ground with pegs and lines'],
        ['Strip foundation', 'Continuous ribbon of concrete poured beneath load-bearing block walls'],
        ['Raft foundation', 'Large reinforced concrete slab spreading total building weight across weak or waterlogged ground'],
      ],
      rules: [
        'Use the 3-4-5 tape rule (3² + 4² = 5²) to establish true 90° corners when setting out trenches.',
        'Always verify both diagonals of a rectangular building footprint are equal before digging trenches.',
      ],
      headers: ['Foundation type', 'Best ground / structure'],
      rows: [
        ['Strip foundation', 'Firm soil supporting standard load-bearing walls'],
        ['Pad foundation', 'Firm soil supporting individual reinforced concrete columns'],
        ['Raft foundation', 'Weak, swampy or marshy ground (e.g. coastal Lagos)'],
        ['Pile foundation', 'Very soft top layers requiring deep transfer to bedrock'],
      ],
      exQ: 'A bricklayer marks 3 m along the front line and 4 m along the side line. What diagonal distance proves the corner is exactly 90°?',
      exSteps: [
        ['Apply Pythagoras theorem', '√(3² + 4²) = √(9 + 16) = √25'],
        ['Result', 'Exactly 5.0 m'],
      ],
      checkQ: 'Which foundation type spreads a building’s weight across one broad reinforced slab on weak or waterlogged clay soil?',
      checkO: ['Raft foundation', 'Timber post footing', 'Dry sand bed', 'Roof parapet'],
      checkH: ['Think of a boat floating steadily on soft waterlogged ground.', 'It covers the full footprint of the building.'],
      checkE: 'A raft foundation distributes loads over the entire footprint on weak or swampy soil.',
    },
    p2: {
      title: 'Concrete, mortar mixes and curing',
      idea: 'Concrete is a mixture of cement (binder), fine aggregate (sharp sand), coarse aggregate (crushed granite) and clean water — a common structural mix is 1:2:4 (1 cement : 2 sand : 4 granite). Mortar omits coarse stone (e.g. 1:6 cement-to-sand for block laying). Because concrete hardens through a chemical reaction called hydration (not merely drying out!), keeping freshly cast concrete damp for at least 7 days (curing) dramatically increases its final strength.',
      terms: [
        ['Concrete (1:2:4)', 'Mixture of 1 part cement, 2 parts sharp sand and 4 parts coarse aggregate plus clean water'],
        ['Curing', 'Keeping freshly placed concrete or mortar moist so cement hydrates completely and reaches full strength'],
        ['Slump test', 'Cone test carried out on fresh wet concrete to check its workability (water consistency)'],
      ],
      rules: [
        'Too much mixing water makes concrete easy to pour but severely weakens it and causes cracking.',
        'Add steel reinforcement bars (rebar) in concrete tension zones because concrete is strong in compression but weak in tension.',
      ],
      headers: ['Material', 'Typical mix ratio & use'],
      rows: [
        ['Plain mass concrete', '1:3:6 — blinding under footings and oversite floors'],
        ['Structural reinforced concrete', '1:2:4 — lintels, columns, beams and suspended slabs'],
        ['Blocklaying mortar', '1:6 (cement : sharp sand) — bedding sandcrete blocks'],
      ],
      exQ: 'Why do site supervisors sprinkle water over a freshly cast concrete floor slab every morning for a week?',
      exSteps: [
        ['Explain hardening chemistry', 'Cement needs moisture for chemical hydration to build crystal strength'],
        ['Name process', 'Curing — preventing premature drying stops shrinkage cracks and weak dustiness'],
      ],
      checkQ: 'What is the purpose of carrying out a slump test on freshly mixed concrete on a building site?',
      checkO: ['To check the workability and water consistency of the wet concrete batch', 'To weigh the cement bags', 'To test paint colour', 'To sharpen trowels'],
      checkH: ['An inverted metal cone is filled, tamped and lifted to see how far the wet concrete settles.', 'Too watery collapses; too dry barely moves.'],
      checkE: 'The slump test measures the workability and consistency of fresh concrete.',
    },
    qs: [
      ['In a 1:2:4 concrete mix, the three numbers represent the volume proportions of', 'cement : sharp sand : coarse granite aggregate', 'water : paint : lime', 'sand : clay : sawdust', 'granite : steel : timber', 'Concrete ratios always follow Cement : Fine Aggregate : Coarse Aggregate.'],
      ['Keeping newly poured concrete slabs wet for 7–14 days so cement gains maximum strength is called', 'curing', 'blinding', 'pointing', 'plumbing', 'Curing sustains hydration and prevents weak powdery concrete.'],
      ['Which simple geometry ratio do builders use with a measuring tape to set out an exact 90° corner?', '3 : 4 : 5', '2 : 2 : 5', '1 : 1 : 3', '4 : 5 : 6', '3² + 4² = 5² guarantees a true right angle.'],
      ['Why are steel bars embedded inside concrete lintels and suspended floor slabs?', 'Concrete resists crushing well but is weak under tension, which steel carries strongly', 'Steel makes concrete weigh less', 'Steel dissolves in water to colour walls', 'Concrete cannot harden without iron'],
      ['A continuous concrete footing poured along the trenches beneath load-bearing block walls is a', 'strip foundation', 'pile cap', 'roof truss', 'cornice', 'Strip foundations support continuous masonry walls on firm subsoil.'],
      ['Adding excessive extra water to a concrete mix on site will', 'weaken the hardened concrete and increase shrinkage cracking', 'double its compressive strength', 'eliminate the need for cement', 'make it dry in 5 seconds', 'High water-cement ratios create porous, weak concrete.'],
    ].map(([q, a, b, c, d, e]) => [q, a, b, c, d, e || `${a} is correct building construction practice.`] as [string, string, string, string, string, string]),
  },
  {
    id: 'bl-bonds-tools-plastering',
    name: 'Masonry tools, brick/block bonding, lintels and plastering',
    sec: 'Walling & finishes',
    goals: [
      'Use trowel, spirit level, plumb bob and builder’s line to build vertical, level walls',
      'Compare stretcher, English and Flemish bonds, lintels, DPC and wall rendering',
    ],
    trap: 'Do not stack blocks directly edge-on-edge with continuous vertical joints — staggering vertical joints (bonding) spreads wall loads safely and stops straight vertical cracks.',
    p1: {
      title: 'Blocklaying tools and masonry bonds',
      idea: 'Masons build straight, true walls using a Brick Trowel (spreads mortar), Spirit Level (checks horizontal level and vertical plumb), Plumb Bob (checks tall vertical alignment), Gauge Rod (keeps courses uniform) and Builder’s Line with corner pins. Bonding overlaps bricks or sandcrete blocks so no continuous vertical joint runs up a wall: Stretcher Bond is standard for half-brick and Nigerian 150 mm/225 mm hollow sandcrete block walls, while English Bond alternates full courses of headers and stretchers for thick brick walls.',
      terms: [
        ['Stretcher bond', 'Masonry bond showing only long faces (stretchers) staggered by half a block each course'],
        ['Damp-Proof Course (DPC)', 'Waterproof membrane (polythene/bitumen felt) laid near floor level to block rising ground moisture'],
        ['Lintel', 'Horizontal reinforced concrete beam spanning over door and window openings to carry wall load above'],
      ],
      rules: [
        'Keep mortar bed and vertical (perpend) joints uniform (typically 10–15 mm thick) for neatness and strength.',
        'Extend every lintel at least 150–225 mm (bearing) onto the solid block wall on BOTH sides of a door or window.',
      ],
      headers: ['Walling feature', 'Purpose'],
      rows: [
        ['Stretcher bond', 'Staggers joints cleanly in hollow sandcrete block walls'],
        ['DPC (Damp-Proof Course)', 'Prevents groundwater creeping up walls and peeling paint'],
        ['Lintel', 'Carries masonry load safely across window and door openings'],
      ],
      exQ: 'Why does paint near the bottom of an older house wall blister and turn green with damp moss?',
      exSteps: [
        ['Identify moisture source', 'Groundwater climbs upward through porous sandcrete blocks by capillary action'],
        ['Identify missing barrier', 'A missing or bridged Damp-Proof Course (DPC)'],
      ],
      checkQ: 'Which horizontal structural beam spans across the top of a doorway or window to support the blockwork above?',
      checkO: ['Lintel', 'Wall plate', 'Damp-proof course', 'Screed'],
      checkH: ['Usually cast in reinforced concrete with steel rods inside.', 'It carries the load safely down onto the side piers.'],
      checkE: 'A lintel bridges openings and carries the weight of masonry above windows and doors.',
    },
    p2: {
      title: 'Plastering, rendering, pointing and site safety',
      idea: 'Internal wall finishing with smooth cement-sand mortar is called plastering; external weatherproofing coat is called rendering. Good masons wet dry block walls slightly first so blocks do not suck water out of mortar too fast, apply a rough key coat (spatterdash) if smooth, level with a straightedge and wooden float, and finish with a steel trowel. On site, hard hats, safety boots and sturdy guard-railed scaffolds prevent deadly falls.',
      terms: [
        ['Rendering', 'Protective cement-sand mortar coat applied to external building walls against rain and sun'],
        ['Pointing', 'Raking and neatly finishing exposed mortar joints on fair-faced brickwork for weather resistance'],
        ['Scaffold', 'Temporary braced working platform allowing masons to lay upper courses safely'],
      ],
      rules: [
        'Lightly dampen thirsty dry blocks before plastering so the mortar bonds tightly without cracking.',
        'Never stand on loose stacked hollow blocks or wobbly drums instead of a properly braced scaffold.',
      ],
      headers: ['Finishing tool', 'Role'],
      rows: [
        ['Wooden float', 'Levels and gives slightly textured flat plaster surface'],
        ['Steel plastering trowel', 'Produces dense smooth final skim'],
        ['Spirit level', 'Checks horizontal level and vertical plumb of jambs'],
      ],
      exQ: 'Why do plasterers spray clean water on dry sandcrete blocks just before throwing mortar onto the wall?',
      exSteps: [
        ['Consider suction', 'Bone-dry porous blocks yank water out of wet mortar instantly'],
        ['Prevent failure', 'Dampening controls suction so mortar hydrates strongly and adheres without hollow patches'],
      ],
      checkQ: 'Which tool checks BOTH horizontal levelness and vertical uprightness (plumb) of a newly laid block wall?',
      checkO: ['Spirit level', 'Brick bolster', 'Pickaxe', 'Shovel'],
      checkH: ['It contains glass vials with trapped liquid bubbles.', 'When the bubble sits dead between the two lines, the work is true.'],
      checkE: 'A spirit level verifies accurate horizontal level and vertical plumb.',
    },
    qs: [
      ['What is the main structural reason for bonding (staggering) blocks instead of stacking vertical joints straight above each other?', 'To distribute loads evenly and prevent continuous vertical cracks', 'To use triple the mortar', 'To make walls lean inward', 'To block sunlight from rooms', 'Overlapping units tie the wall into one strong structural plane.'],
      ['A waterproof layer placed horizontally near ground-floor level to stop rising groundwater is called a', 'Damp-Proof Course (DPC)', 'King post', 'Slump cone', 'Perpend joint', 'DPC stops capillary damp from rotting skirting and peeling paint.'],
      ['The vertical mortar joint between the ends of two adjacent blocks in the same course is called a', 'perpend (cross) joint', 'bed joint', 'expansion beam', 'cornice', 'Horizontal joints are bed joints; vertical end joints are perpends.'],
      ['Applying a smooth protective cement-sand coat to the OUTSIDE walls of a house is called', 'rendering', 'grouting tiles', 'excavating', 'timbering', 'External mortar coating is rendering; internal is plastering.'],
      ['Which masonry bond alternates one complete course of headers with one complete course of stretchers?', 'English bond', 'Stretcher bond', 'Running bond', 'Stack bond', 'English bond alternates full header courses and stretcher courses for heavy strength.'],
      ['What essential personal protective item shields a bricklayer’s head from falling tools or blocks near scaffolding?', 'Safety helmet (hard hat)', 'Cotton cap', 'Sunglasses', 'Sandals', 'Hard hats are mandatory PPE on active construction sites.'],
    ],
  },
];

const GSM_SPECS: CompactTopicInput[] = [
  {
    id: 'gsm-hardware-architecture-tools',
    name: 'Mobile phone hardware, ESD safety and repair workshop tools',
    sec: 'Hardware & diagnostics',
    goals: [
      'Identify core smartphone blocks (PMIC, CPU/SoC, RF, charging IC, display, battery)',
      'Use multimeters, DC power supplies, hot-air rework stations and ESD protection safely',
    ],
    trap: 'Do not apply raw heat from a hot-air rework gun straight onto a lithium-ion battery or nearby plastic connectors — remove the battery first and shield adjacent components with Kapton tape.',
    p1: {
      title: 'Inside a smartphone and ESD safety',
      idea: 'Every GSM/4G/5G phone combines a Printed Circuit Board (PCB) housing a System-on-Chip (CPU/GPU/modem), Power Management IC (PMIC) distributing regulated voltages, RF front-end + antenna for network calls, charging IC, flash storage (eMMC/UFS), display/digitiser assembly and lithium-ion battery. Invisible static electricity from a technician’s body (Electrostatic Discharge, ESD) can instantly fry microchips, so clean ESD mats and grounded wrist straps are mandatory.',
      terms: [
        ['PMIC (Power Management IC)', 'Master power chip that steps battery voltage down to feed CPU, display, memory and radio'],
        ['ESD (Electrostatic Discharge)', 'Sudden tiny static spark from fingers or clothes capable of ruining sensitive microchips'],
        ['IMEI', 'Unique 15-digit International Mobile Equipment Identity number identifying every GSM handset'],
      ],
      rules: [
        'Always disconnect the battery connector FIRST before unplugging the screen, camera or charging flex cable.',
        'Never puncture, bend or overheat a swollen lithium-ion battery — thermal runaway can cause fire.',
      ],
      headers: ['Phone section', 'What happens if faulty'],
      rows: [
        ['Charging port / IC', 'Phone refuses to charge or charges painfully slowly'],
        ['RF section / antenna coax', '"No Service" or weak signal bars even with valid SIM'],
        ['PMIC', 'Dead phone drawing abnormal current or failing to boot'],
        ['Digitiser (touch layer)', 'Screen lights up clearly, but touch taps do not respond'],
      ],
      exQ: 'A phone displays crisp colours and wallpaper normally, yet swiping or tapping the glass does nothing. Which display layer is faulty?',
      exSteps: [
        ['Separate display functions', 'LCD/OLED creates the picture; digitiser senses finger touches'],
        ['Diagnose', 'Faulty touch digitiser (or loose touch flex cable)'],
      ],
      checkQ: 'What is the very first internal step a technician must take after opening a smartphone back cover before disconnecting cameras or screens?',
      checkO: ['Disconnect the battery flex connector from the motherboard', 'Blast the board with 450°C hot air', 'Wash the screen with tap water', 'Pry the battery with a sharp steel knife'],
      checkH: ['Live power on the motherboard while unplugging flex ribbons easily blows backlight filters.', 'Isolate power first!'],
      checkE: 'Disconnecting the battery first prevents accidental short circuits while servicing internal connectors.',
    },
    p2: {
      title: 'Repair tools: multimeter, DC power supply and soldering',
      idea: 'Smartphones are diagnosed by measurement, not guesswork. A Digital Multimeter checks battery voltage (healthy charged Li-ion reads 3.8–4.2 V; below 3.4 V often won’t power on), diode-mode line readings and short circuits (continuity beep). A regulated Bench DC Power Supply (set to 4.0 V, 2 A limit) reveals hidden shorts immediately if current spikes before pressing Power. Micro-soldering uses temperature-controlled soldering irons, flux paste, solder wick and hot-air rework stations.',
      terms: [
        ['Digital multimeter', 'Test instrument measuring DC voltage, resistance, diode drops and continuity on a phone PCB'],
        ['Soldering flux', 'Chemical paste that cleans oxides and helps molten solder flow cleanly onto micro-pads'],
        ['Hot-air rework station', 'Precision heated air blower used to desolder and replace surface-mount ICs and charging ports'],
      ],
      rules: [
        'Use rosin/no-clean flux when replacing USB charging ports — dry soldering without flux causes cold brittle joints and torn PCB pads.',
        'Clean liquid-damaged motherboards promptly with 99% isopropyl alcohol (IPA) and an ESD-safe brush, never ordinary water.',
      ],
      headers: ['Workshop tool', 'Primary repair job'],
      rows: [
        ['Digital multimeter', 'Measures battery voltage, continuity and shorted capacitors'],
        ['DC bench power supply', 'Injects regulated 4 V to diagnose boot current and shorts'],
        ['Hot-air rework station', 'Safely removes/reflows SMD chips and USB ports'],
        ['99% Isopropyl alcohol', 'Cleans flux residue and corrosion after water spills'],
      ],
      exQ: 'A customer brings a dead phone. Measuring the battery terminals with a DC multimeter shows 2.6 V. What is the first sensible diagnostic step?',
      exSteps: [
        ['Compare with normal threshold', 'A healthy Li-ion cell needs ~3.7–4.2 V to boot (2.6 V is deeply discharged)'],
        ['Action', 'Boost/charge the battery safely (or test boot on a 4.0 V DC bench supply) and inspect the charging port'],
      ],
      checkQ: 'Which solvent is standard for cleaning corrosion and soldering flux off a water-damaged phone motherboard?',
      checkO: ['99% Isopropyl alcohol (IPA)', 'Soapy tap water', 'Cooking oil', 'Battery sulphuric acid'],
      checkH: ['It evaporates rapidly without leaving conductive mineral residue.', 'Used with a soft ESD-safe toothbrush.'],
      checkE: 'High-purity isopropyl alcohol dissolves corrosion and flux cleanly and dries residue-free.',
    },
    qs: [
      ['What does the unique 15-digit IMEI number (viewable by dialling *#06#) identify?', 'The individual mobile handset hardware on GSM networks', 'The user’s bank account balance', 'The Wi-Fi router password', 'The battery manufacture weight', 'IMEI uniquely identifies each GSM mobile device.'],
      ['What is the normal voltage range of a healthy, charged smartphone lithium-ion battery?', '3.7 V to 4.2 V DC', '12 V to 24 V DC', '230 V AC', '0.5 V to 1.0 V DC', 'Single-cell Li-ion phone batteries operate around 3.7 V nominal up to 4.2 V full charge.'],
      ['Why do GSM technicians wear an anti-static wrist strap on an ESD mat?', 'To safely drain static electricity so delicate PCB chips are not fried by ESD', 'To boost cellular 5G signal bars', 'To heat the soldering iron faster', 'To charge customer phones', 'Static sparks invisible to the eye can permanently damage CMOS chips.'],
      ['When a phone battery is visibly swollen like a pillow, a technician should', 'carefully remove it without puncturing and replace it safely', 'poke it with a needle to flatten it', 'heat it at 350°C to shrink it back', 'tape it down harder inside the phone', 'Puncturing or overheating a swollen Li-ion battery risks fire and toxic fumes.'],
      ['Which chemical aid is applied during micro-soldering so molten solder wets copper pads cleanly without bridging?', 'Soldering flux', 'Superglue', 'Engine oil', 'Chalk powder', 'Flux strips surface oxidation so solder flows smoothly onto joints.'],
      ['If a phone connected to a 4.0 V DC bench supply immediately draws maximum current BEFORE anyone presses the power button, the motherboard has a', 'primary rail short circuit', 'healthy sleep mode', 'full battery', 'missing ringtone', 'Immediate high current draw before power-on points to a short on the main power rail (VBAT/VPH_PWR).'],
    ],
  },
  {
    id: 'gsm-fault-finding-software-ethics',
    name: 'Fault troubleshooting, software flashing and repair ethics',
    sec: 'Troubleshooting & software',
    goals: [
      'Separate hardware faults from software faults systematically (no power, no network, charging, audio)',
      'Handle backups, firmware flashing, factory resets and customer data privacy ethically',
    ],
    trap: 'Do not confuse a hard/factory reset with a software backup — a factory reset wipes customer photos, contacts and messages unless backed up first, and modern phones require the owner’s Google/Apple account after reset (FRP).',
    p1: {
      title: 'Systematic hardware troubleshooting (no power, charging, network, audio)',
      idea: 'Professional GSM repair follows a logical checklist from simple external causes to board-level faults. For "Not Charging": test a known-good cable/charger → inspect/clean lint from the USB port → measure 5 V VBUS at the charging board → check charging flex → inspect charging IC. For "No Service": test another known-good SIM → verify Airplane Mode is OFF → check IMEI (*#06#) → check coaxial antenna cable → inspect RF IC.',
      terms: [
        ['VBUS', '5 V (or fast-charge) supply rail entering the phone from the USB charging port'],
        ['Earpiece vs loudspeaker', 'Earpiece handles quiet phone calls at the ear; loudspeaker (ringer) plays music, ringtones and speakerphone'],
        ['Bootloop', 'Software or hardware fault where a phone repeatedly restarts on the brand logo without reaching the home screen'],
      ],
      rules: [
        'Always test the simplest external cause first (known-good charger, cable or SIM card) before opening a handset.',
        'If a phone shows "IMEI Null/Unknown" after an update, the baseband/firmware or modem partition needs repair before blaming the antenna.',
      ],
      headers: ['Symptom', 'First checks in order'],
      rows: [
        ['Not charging', 'Known-good charger/cable → clean USB port → check 5 V at sub-board → charging IC'],
        ['Caller cannot hear you', 'Check microphone hole blockage → test recorder app → inspect sub-board mic'],
        ['No network signal', 'Test working SIM → check Airplane Mode & IMEI → check coax antenna cable'],
      ],
      exQ: 'A customer says callers cannot hear her voice during calls, though she hears them clearly and music plays loudly. Which component is most likely faulty?',
      exSteps: [
        ['Rule out working parts', 'Earpiece works (hears caller) and loudspeaker works (music plays)'],
        ['Isolate faulty part', 'Microphone (either blocked mesh or faulty mic on the charging sub-board)'],
      ],
      checkQ: 'Before opening a phone that shows "No Service", what quick diagnostic code checks whether the handset still recognises its IMEI?',
      checkO: ['Dial *#06#', 'Dial 911', 'Press volume down 50 times', 'Remove the screen glass'],
      checkH: ['This universal GSM USSD code displays the 15-digit device identity.', 'Missing IMEI points to a baseband/software fault.'],
      checkE: 'Dialling *#06# immediately displays the phone’s IMEI so you can verify baseband health.',
    },
    p2: {
      title: 'Firmware flashing, customer privacy and workshop ethics',
      idea: 'Software repairs fix frozen screens, malware, forgotten pattern locks (with verified owner proof) and bootloops via Safe Mode, Recovery Factory Reset or Official Firmware Flashing using exact model build numbers. Flashing the WRONG firmware model can permanently "brick" a phone. Ethical technicians protect customer privacy (never browsing personal photos/messages), issue clear job cards, give honest fault quotes and refuse stolen handsets.',
      terms: [
        ['Firmware flashing', 'Reinstalling the phone’s operating system image onto internal flash storage using a PC tool'],
        ['Bricked device', 'Phone rendered completely unresponsive due to corrupted bootloader or flashing wrong firmware'],
        ['FRP (Factory Reset Protection)', 'Anti-theft security lock requiring the original owner’s account credentials after an unauthorised reset'],
      ],
      rules: [
        'Always verify the EXACT model number and regional variant before downloading or flashing firmware.',
        'Never snoop through a customer’s gallery, chats or banking apps, and never alter an IMEI (illegal).',
      ],
      headers: ['Software action', 'When to use it'],
      rows: [
        ['Safe Mode', 'Check if a third-party app is causing crashes without deleting data'],
        ['Factory reset', 'Clear stubborn software glitches after backing up user data'],
        ['Official firmware flash', 'Repair corrupted system files causing logo bootloop'],
      ],
      exQ: 'Why must a technician verify the exact motherboard model code before flashing stock firmware onto a bootlooping Android phone?',
      exSteps: [
        ['Consider hardware differences', 'Similar-looking phones often have different CPUs or display drivers'],
        ['Consequence', 'Flashing mismatched firmware corrupts the preloader/bootloader and bricks the device'],
      ],
      checkQ: 'What is the ethical and legal stance if someone asks a GSM repair technician to illegally change the IMEI of a suspected stolen phone?',
      checkO: ['Refuse immediately, because tampering with IMEI numbers is illegal and aids phone theft', 'Charge double and do it quietly', 'Format the SIM card instead', 'Sell the phone to another shop'],
      checkH: ['IMEI numbers help track stolen handsets and uphold telecom law.', 'Professional workshops maintain strict honesty and legal compliance.'],
      checkE: 'Changing a device’s IMEI is illegal; honest technicians refuse and verify ownership.',
    },
    qs: [
      ['A phone turns on, displays the manufacturer logo repeatedly, and never reaches the home screen. This fault is called a', 'bootloop', 'short circuit', 'screen burn-in', 'roaming lock', 'A bootloop occurs when startup files or failing hardware repeatedly crash the boot sequence.'],
      ['If you can hear music loudly and hear callers clearly, but nobody can hear your voice on calls, inspect the', 'microphone', 'back camera', 'vibrator motor', 'torch LED', 'The microphone captures your speech during calls.'],
      ['Flashing the wrong model’s firmware onto a smartphone can corrupt its bootloader and leave it', 'bricked (unresponsive)', 'faster with 6G', 'waterproofed', 'permanently charged', 'Always match exact device model and build variant before flashing.'],
      ['Before performing a factory reset on a customer’s working phone, a responsible technician should', 'warn the customer and help back up important contacts and photos first', 'delete all files silently without asking', 'copy customer bank passwords', 'throw away the SIM tray', 'Factory resets wipe user storage; informed consent and backups prevent heartbreak.'],
      ['What anti-theft feature asks for the previous owner’s Google or Apple account after an unauthorised reset?', 'Factory Reset Protection (FRP) / Activation Lock', 'Airplane Mode', 'Bluetooth Pairing', 'Dark Mode', 'FRP deters theft by locking reset phones until the lawful owner signs in.'],
      ['Why should a repair shop issue a written job card recording the phone model, IMEI, condition and agreed fee?', 'To prevent disputes, track parts honestly and protect both customer and technician', 'To increase battery voltage', 'To slow down repairs', 'To void the warranty', 'Job cards document intake condition, ownership and clear pricing professionally.'],
    ],
  },
];

export function buildElecInstCurriculum() {
  return buildUtmeSubjectCurriculum([...ELECINST_SPECS.map(compactUtmeTopic), ...ELECINST_EXTRA_SPECS]);
}

export function buildAutoMechCurriculum() {
  return buildUtmeSubjectCurriculum([...AUTOMECH_SPECS.map(compactUtmeTopic), ...AUTOMECH_EXTRA_SPECS]);
}

export function buildCarpentryCurriculum() {
  return buildUtmeSubjectCurriculum([...CARPENTRY_SPECS.map(compactUtmeTopic), ...CARPENTRY_EXTRA_SPECS]);
}

export function buildBlockLayCurriculum() {
  return buildUtmeSubjectCurriculum([...BLOCKLAY_SPECS.map(compactUtmeTopic), ...BLOCKLAY_EXTRA_SPECS]);
}

export function buildGsmCurriculum() {
  return buildUtmeSubjectCurriculum([...GSM_SPECS.map(compactUtmeTopic), ...GSM_EXTRA_SPECS]);
}
