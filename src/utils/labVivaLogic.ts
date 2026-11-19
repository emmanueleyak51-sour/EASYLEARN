import type { LabItem, SubjectId } from '../types';
import { perm } from './engine';
import { calibrateQuestionItem } from './jambDistractorCalibrator';

export interface LabVivaCheck {
  labId: string;
  promptHtml: string;
  options: string[];
  answerIdx: number;
  explanationHtml: string;
}

interface RawVivaSpec {
  q: string;
  c: string;
  w: [string, string, string];
  e: string;
}

const LAB_VIVA_BANK: Record<string, RawVivaSpec> = {
  // ═══════════════════ CHEMISTRY PRACTICALS (20) ═══════════════════
  'c-titration': {
    q: 'During an acid–base titration, why must the conical flask be rinsed ONLY with distilled water and NOT with the alkali solution before pipetting 25.0 cm³?',
    c: 'Rinsing with alkali leaves extra moles of base clinging to the glass walls and inflates the acid titre.',
    w: [
      'Rinsing with distilled water dilutes the pipetted moles of alkali and reduces the required acid titre.',
      'Rinsing with alkali neutralises atmospheric carbon dioxide inside the flask so the end-point stays sharp.',
      'Rinsing with distilled water coats the borosilicate glass so phenolphthalein changes colour before neutralisation.',
    ],
    e: 'The pipette delivers a fixed number of moles (n = CV). Distilled water on the flask walls changes volume slightly without changing n, whereas extra alkali film adds unmeasured moles of base and makes the titre artificially high.',
  },
  'c-stdsol': {
    q: 'When preparing 250 cm³ of standard Na₂CO₃ solution, why must the washings from the beaker, stirring rod, and funnel all be transferred into the volumetric flask before making up to the mark?',
    c: 'Any retained droplet holds dissolved solute moles, which would make the final molarity lower than calculated.',
    w: [
      'Transferring washings prevents atmospheric moisture from hydrolysing carbonate ions into hydrogen carbonate.',
      'Leaving washings behind increases the solution density and pushes the meniscus above the calibration mark.',
      'Warm washings accelerate exothermic dissolution so the volumetric glass expands to its calibrated capacity.',
    ],
    e: 'Quantitative transfer ensures 100% of weighed Na₂CO₃ moles enter the volumetric flask; losing even a few drops of concentrated washings lowers the true concentration.',
  },
  'c-redox-tit': {
    q: 'In a KMnO₄ against Fe²⁺ redox titration, why is no external indicator added and why is dilute H₂SO₄ used instead of dilute HCl or HNO₃?',
    c: 'MnO₄⁻ is self-indicating (purple to faint pink), while HCl would be oxidised to Cl₂ and HNO₃ acts as an competing oxidising agent.',
    w: [
      'Fe²⁺ acts as a green-to-red self-indicator, while H₂SO₄ precipitates excess Mn²⁺ ions cleanly at the end-point.',
      'MnO₄⁻ requires H₂SO₄ as a dehydrating catalyst, whereas HCl and HNO₃ form insoluble iron salts in cold solution.',
      'Adding starch or methyl orange would reduce MnO₄⁻ prematurely, while HCl buffers the pH too high for half-reactions.',
    ],
    e: 'Permanganate ions are intensely purple and turn almost colourless (Mn²⁺) until one excess drop gives a permanent faint pink; Cl⁻ is oxidised by MnO₄⁻, and HNO₃ itself oxidises Fe²⁺.',
  },
  'c-filter': {
    q: 'When recovering pure sodium chloride crystals from a sand-and-salt filtrate, why do we heat only to the crystallisation point rather than boiling the dish completely dry?',
    c: 'Heating to dryness causes decrepitation (spitting of hot crystals) and can decompose hydrated salts or trap soluble impurities.',
    w: [
      'Boiling to dryness sublimes sodium chloride vapour directly off the porcelain dish before ionic lattices can form.',
      'Slow cooling from a concentrated solution converts insoluble silica traces into volatile siliconhydride gas.',
      'Stopping early keeps sodium and chloride ions hydrolysed as NaOH and HCl so larger cubic crystals precipitate.',
    ],
    e: 'Evaporating to saturation and cooling slowly forms clean, regular crystals without spitting losses (decrepitation) or thermal decomposition.',
  },
  'c-chroma': {
    q: 'In ascending paper chromatography, why must the baseline be drawn in graphite pencil rather than ink, and kept strictly above the solvent pool?',
    c: 'Graphite is insoluble so it will not migrate with the solvent, while keeping spots above the pool prevents dyes dissolving directly into the reservoir.',
    w: [
      'Graphite adsorbs excess solvent vapour evenly, while submerging the baseline reverses capillary action down the cellulose fibres.',
      'Pencil carbon catalyses dye separation into distinct R_f bands, whereas ink baselines lower the solvent front velocity.',
      'Keeping the baseline above the solvent ensures all pigments travel at identical speeds regardless of polarity or solubility.',
    ],
    e: 'Pen ink contains soluble dyes that would Streak and contaminate the chromatogram; submerging sample spots washes the analyte into the beaker instead of up the paper.',
  },
  'c-distill': {
    q: 'In simple or fractional distillation, why does cold tap water enter the Liebig condenser jacket at the LOWER nozzle and exit from the UPPER nozzle?',
    c: 'Counter-current upward flow keeps the entire condenser jacket completely full of cold water for maximum thermal gradient.',
    w: [
      'Entering from the bottom creates vapour back-pressure inside the inner tube so volatile fractions condense before the thermometer bulb.',
      'Downward flow from the top nozzle would supercool the glass receiver and crack the still-head joint by thermal shock.',
      'Upward jacket flow flushes dissolved air bubbles into the distilling flask so bumping cannot occur without anti-bumping granules.',
    ],
    e: 'Feeding cooling water from the lowest point expels air pockets and maintains counter-current heat exchange against the descending hot vapour.',
  },
  'c-sublim': {
    q: 'Which property allows solid ammonium chloride or iodine to be separated cleanly from sodium chloride using an inverted cold funnel over an evaporating dish?',
    c: 'Ammonium chloride or iodine transitions directly between solid and vapour on heating/cooling, whereas NaCl has a high ionic melting point.',
    w: [
      'Sodium chloride decomposes into volatile chlorine gas first, leaving pure solid ammonium chloride behind in the dish.',
      'Ammonium chloride has a higher lattice energy than sodium chloride, allowing selective condensation on warm glass.',
      'Both solids melt into an azeotropic liquid first, after which capillary action draws the lighter salt onto the funnel.',
    ],
    e: 'Volatile solids that sublime bypass the liquid phase (or dissociate reversibly in NH₄Cl’s case) and re-deposit on the cool funnel walls while high-melting NaCl stays in the dish.',
  },
  'c-electro': {
    q: 'During electrolysis of aqueous CuSO₄ using inert carbon electrodes, why does the blue solution gradually fade AND become acidic?',
    c: 'Cu²⁺ ions are discharged as copper metal at the cathode while OH⁻ ions are discharged as O₂ at the anode, leaving H⁺ and SO₄²⁻ (H₂SO₄) in solution.',
    w: [
      'SO₄²⁻ ions are preferentially oxidised at the anode while H⁺ ions reduce at the cathode, precipitating white anhydrous CuSO₄.',
      'Inert carbon anodes dissolve into carbonate ions that neutralise OH⁻ and complex the blue Cu²⁺ hydrated ions.',
      'Copper metal deposited at the cathode redissolves as colourless Cu⁺ ions while water evaporates from ohmic heating.',
    ],
    e: 'Removing Cu²⁺ depletes the blue chromophore, and discharging OH⁻ (4OH⁻ → 2H₂O + O₂ + 4e⁻) leaves excess H⁺ paired with spectator SO₄²⁻.',
  },
  'c-oxygen': {
    q: 'Why can oxygen gas prepared catalytic decomposition of H₂O₂ over MnO₂ be collected cleanly by downward displacement of water?',
    c: 'Oxygen is only sparingly soluble in water and does not react chemically with water at room temperature.',
    w: [
      'Oxygen is markedly denser than liquid water and sinks to displace water upward through the beehive shelf.',
      'Water catalyses the removal of unreacted hydrogen peroxide vapour while oxidising trace manganese impurities.',
      'Oxygen forms a temporary hydrate film at the gas-jar mouth that prevents atmospheric nitrogen from diffusing inward.',
    ],
    e: 'Collection over water works for gases that are insoluble/slightly soluble and non-reactive with water (such as O₂ and H₂, unlike NH₃ or HCl).',
  },
  'c-hydrogen': {
    q: 'Before igniting a sample of laboratory-prepared hydrogen gas or heating CuO in a hydrogen stream, why must you test a small test-tube sample for a quiet pop first?',
    c: 'A loud squeaky pop warns that air (oxygen) is still mixed with hydrogen, which could detonate the main apparatus if heated.',
    w: [
      'Pure hydrogen produces the loudest explosive pop, confirming sufficient gas pressure to reduce copper(II) oxide.',
      'Testing a sample removes acidic HCl acid spray from the zinc generator so the flame burns luminous yellow.',
      'Pre-igniting a sample warms the delivery tube and prevents condensed steam from cracking hot borosilicate glass.',
    ],
    e: 'Hydrogen–air mixtures within explosive limits detonate violently; pure H₂ burns quietly at the tube mouth once all air has been flushed out.',
  },
  'c-co2': {
    q: 'When CO₂ is bubbled continuously through limewater, Ca(OH)₂(aq), it turns milky and then turns colourless again on prolonged bubbling. Why does the milkiness disappear?',
    c: 'Insoluble white CaCO₃ reacts further with excess CO₂ and water to form soluble calcium hydrogencarbonate, Ca(HCO₃)₂(aq).',
    w: [
      'Excess CO₂ lowers the solution pH until calcium carbonate decomposes back into soluble calcium oxide and oxygen.',
      'Carbonic acid oxidises the suspended white precipitate into colourless colloidal calcium peroxide particles.',
      'Continuous gas bubbling mechanically coagulates fine CaCO₃ particles so they Float invisibly at the meniscus.',
    ],
    e: 'First: Ca(OH)₂(aq) + CO₂(g) → CaCO₃(s) + H₂O(l) (milky). Excess CO₂: CaCO₃(s) + H₂O(l) + CO₂(g) → Ca(HCO₃)₂(aq) (colourless solution).',
  },
  'c-ammonia': {
    q: 'When drying moist ammonia gas (NH₃) prepared from NH₄Cl and Ca(OH)₂, why MUST quicklime (CaO) be used instead of concentrated H₂SO₄ or fused CaCl₂?',
    c: 'Basic ammonia reacts chemically with acidic H₂SO₄ to form (NH₄)₂SO₄ and forms an addition complex CaCl₂·8NH₃ with fused CaCl₂.',
    w: [
      'Concentrated H₂SO₄ oxidises ammonia into brown NO₂ gas, while fused CaCl₂ dissolves ammonia by physical deliquescence only.',
      'Quicklime is denser than ammonia vapour, allowing downward delivery into the gas jar without needing a fume cupboard.',
      'Acidic drying agents dehydrate NH₃ molecules by stripping hydrogen atoms to leave inert nitrogen gas.',
    ],
    e: 'Basic CaO dries alkaline NH₃ without reacting; conc. H₂SO₄ neutralises NH₃, and anhydrous CaCl₂ binds NH₃ chemically into solid ammoniates.',
  },
  'c-cations': {
    q: 'Both Zn²⁺(aq) and Al³⁺(aq) form white gelatinous precipitates soluble in excess NaOH(aq). Which follow-up reagent distinguishes Zn²⁺ cleanly from Al³⁺?',
    c: 'Aqueous ammonia (NH₃): Zn(OH)₂ dissolves in excess NH₃(aq) to give a colourless complex, whereas Al(OH)₃ remains insoluble in excess NH₃(aq).',
    w: [
      'Dilute HCl: Zn(OH)₂ remains insoluble as a white chloride precipitate, whereas Al(OH)₃ dissolves with effervescence.',
      'Aqueous BaCl₂: Zn²⁺ yields a canary-yellow precipitate soluble in acid, whereas Al³⁺ gives no visible reaction.',
      'Flame test on nichrome wire: Zn²⁺ imparts a persistent lilac flame, whereas Al³⁺ imparts a brick-red flame.',
    ],
    e: 'Both hydroxides are amphoteric (dissolve in excess strong NaOH), but only Zn²⁺ forms the soluble tetraamminezinc(II) complex [Zn(NH₃)₄]²⁺ in excess aqueous ammonia.',
  },
  'c-cations-nh3': {
    q: 'When aqueous ammonia is added drop by drop and then in excess to Cu²⁺(aq), what exact sequence of observations confirms copper(II) ions?',
    c: 'A pale-blue precipitate of Cu(OH)₂ forms first and dissolves in excess NH₃(aq) to produce a deep royal-blue solution of [Cu(NH₃)₄]²⁺.',
    w: [
      'A dirty-green precipitate forms first, turns reddish-brown on standing in air, and remains insoluble in excess NH₃(aq).',
      'A deep-blue solution forms immediately on the first drop and precipitates black CuO solid when excess NH₃(aq) is added.',
      'A white chalky precipitate forms first and dissolves in excess NH₃(aq) to leave a colourless ammoniacal solution.',
    ],
    e: 'Limited OH⁻ from NH₃(aq) precipitates pale-blue Cu(OH)₂; excess NH₃ ligands substitute water to yield soluble deep-blue [Cu(NH₃)₄(H₂O)₂]²⁺.',
  },
  'c-anions': {
    q: 'Before adding BaCl₂(aq) to test for sulphate ions (SO₄²⁻), why MUST the test solution first be acidified with dilute HCl?',
    c: 'Dilute HCl destroys interfering CO₃²⁻ or SO₃²⁻ ions that would otherwise also form white precipitates (BaCO₃ or BaSO₃) with Ba²⁺.',
    w: [
      'Dilute HCl provides chloride ions needed to catalyse the nucleation of insoluble white barium sulphate crystals.',
      'Acidification oxidises any sulphite ions into sulphate ions so total sulphur content precipitates quantitatively.',
      'Adding HCl prevents Ba²⁺ ions from hydrolysing water into insoluble white barium hydroxide precipitate.',
    ],
    e: 'BaCO₃ and BaSO₃ are white precipitates soluble in dilute HCl, whereas genuine BaSO₄ is insoluble even in dilute strong acid.',
  },
  'c-flame': {
    q: 'Why is the nichrome or platinum wire dipped in concentrated HCl and heated to redness before testing an unknown metal salt in a non-luminous Bunsen flame?',
    c: 'To convert trace contaminants into volatile chlorides that vaporise away until the wire imparts no residual colour of its own, especially masking sodium yellow.',
    w: [
      'To coat the wire with an oxide passivating layer so high-temperature metal cations cannot alloy with the platinum tip.',
      'To ionise chlorine atoms in the outer flame cone so forbidden d-orbital transitions emit visible wavelengths.',
      'To cool the wire below the salt’s boiling point so solid crystals glow steadily without spattering.',
    ],
    e: 'Metal chlorides are comparatively volatile; cleaning with conc. HCl removes persistent Na⁺ contamination that would otherwise swamp delicate lilac K⁺ flames.',
  },
  'c-rate-thio': {
    q: 'In the disappearing-cross rate experiment between Na₂S₂O₃(aq) and HCl(aq), what insoluble product causes the solution to turn cloudy and hide the cross, and what represents instantaneous rate?',
    c: 'Finely suspended solid sulphur, S(s), obscures the cross, and reaction rate is directly proportional to 1/t (reciprocal of time taken).',
    w: [
      'Dissolved SO₂(g) micro-bubbles obscure the cross, and reaction rate is directly proportional to t² (square of time elapsed).',
      'Precipitated white NaCl(s) obscures the cross, and reaction rate equals total acid volume divided by temperature.',
      'Colloidal sodium sulphide obscures the cross, and reaction rate is inversely proportional to initial thiosulphate concentration.',
    ],
    e: 'S₂O₃²⁻(aq) + 2H⁺(aq) → S(s) + SO₂(g) + H₂O(l). Because a fixed amount of S(s) forms to hide the cross each run, average rate ∝ 1/t.',
  },
  'c-calorim': {
    q: 'In a polystyrene-cup neutralisation calorimetry experiment, what is the #1 source of systematic error that makes an experimental ΔH_neut less exothermic than −57.3 kJ mol⁻¹?',
    c: 'Heat loss to the surrounding air, thermometer, and cup walls lowers the measured maximum temperature rise ΔT.',
    w: [
      'Incomplete dissociation of strong HCl and NaOH absorbs heat from the water and inflates ΔT.',
      'Using a plastic cup instead of a thick glass beaker increases thermal conductivity into the laboratory bench.',
      'Stirring gently with the thermometer converts mechanical kinetic energy into chemical bond enthalpy.',
    ],
    e: 'Even in a lagged polystyrene cup, some thermal energy escapes to the environment and thermometer bulb, yielding a slightly smaller ΔT than ideal adiabatic mixing.',
  },
  'c-org-unsat': {
    q: 'When shaking an unknown liquid hydrocarbon with reddish-brown bromine water in the absence of UV light, rapid decolourisation without HBr fumes confirms:',
    c: 'Electrophilic addition across a carbon–carbon double or triple bond (unsaturated alkene or alkyne).',
    w: [
      'Free-radical substitution of a saturated alkane releasing colourless bromomethane and hydrogen gas.',
      'Oxidation of a tertiary alkanol into an alkanoic acid accompanied by reduction of Br₂ to BrO₃⁻.',
      'Aromatic substitution on a benzene ring proceeding spontaneously without a halogen carrier catalyst.',
    ],
    e: 'Alkenes/alkynes add Br₂ rapidly in the dark (decolourising bromine water with no misty HBr fumes), whereas alkanes require UV light and evolve HBr.',
  },
  'c-food-tests': {
    q: 'Why must a non-reducing sugar (such as sucrose) first be boiled with dilute HCl AND neutralised with NaHCO₃ before heating with Benedict’s or Fehling’s solution?',
    c: 'Dilute HCl hydrolyses sucrose into reducing monosaccharides, and NaHCO₃ prevents leftover acid from destroying the alkaline Cu²⁺ reagent.',
    w: [
      'Dilute HCl oxidises sucrose into gluconic acid, and NaHCO₃ precipitates brick-red copper(I) carbonate on boiling.',
      'Acidification denatures interfering peptide bonds, while NaHCO₃ releases CO₂ bubbles to stir the water bath.',
      'Boiling with HCl dehydrates hexose rings into furfural, which requires neutral pH to chelate blue CuSO₄.',
    ],
    e: 'Benedict’s/Fehling’s reagent only works in alkaline medium; acid hydrolysis splits the glycosidic bond into glucose + fructose, then NaHCO₃ restores alkalinity.',
  },

  // ═══════════════════ PHYSICS PRACTICALS (16) ═══════════════════
  'p-vernier': {
    q: 'Before clamping a metal cylinder between the external jaws of a vernier caliper, why must you close the jaws gently with nothing between them first?',
    c: 'To detect and record any positive or negative zero error so it can be subtracted algebraically from every observed diameter reading.',
    w: [
      'To magnetise the sliding vernier scale so the 0.01 cm divisions lock automatically at the coinciding mark.',
      'To calibrate the pitch of the depth probe against room-temperature thermal expansion of steel.',
      'To ensure the internal jaws and external jaws read identical values without needing eye-level alignment.',
    ],
    e: 'True reading = Observed reading − Zero error (keeping sign). Checking closed jaws first eliminates systematic zero-offset error.',
  },
  'p-pendulum': {
    q: 'In a simple pendulum practical to determine g, why do examiners require timing 20 oscillations with a small angular amplitude (< 10°) measured from the centre of the brass bob?',
    c: 'Timing 20 swings divides human reaction-time error by 20, while small angles keep sin θ ≈ θ so motion remains truly simple harmonic.',
    w: [
      'Large amplitudes increase air buoyancy on the string, while timing 20 swings cancels gravitational variations.',
      'Small angles keep tension constant throughout the swing, and measuring to the top hook underestimates period T².',
      'Timing 20 swings prevents damping, while effective length L excludes the bob radius to match T = 2π√(g/L).',
    ],
    e: 'Reaction-time uncertainty (±0.2 s) divided across 20 cycles becomes ±0.01 s on T; effective length L runs from point of suspension to the bob’s centre of gravity, and SHM requires small θ.',
  },
  'p-hooke': {
    q: 'In a Hooke’s law helical-spring experiment, why should you record pointer readings both while loading AND while unloading slotted masses?',
    c: 'Confirming that unloading readings match loading readings verifies that the elastic limit was never exceeded during the practical.',
    w: [
      'Averaging loading and unloading readings cancels gravitational acceleration differences along the vertical metre rule.',
      'Unloading readings are always half of loading readings, allowing force constant k to be found without plotting an origin.',
      'Recording both sets eliminates parallax error even when the pointer is viewed obliquely from above.',
    ],
    e: 'Permanent set (unloading extension > loading extension at the same load) immediately reveals plastic deformation beyond the elastic limit.',
  },
  'p-moments': {
    q: 'When verifying the Principle of Moments with a metre rule on a knife-edge, what happens to the rule’s own weight W_r in the moment equation if the knife-edge is NOT placed at its centre of gravity G?',
    c: 'The weight W_r acts through G at a non-zero perpendicular distance from the pivot, contributing an extra clockwise or anticlockwise moment.',
    w: [
      'The rule’s weight disappears from equilibrium equations regardless of pivot position because mass is uniformly distributed.',
      'Shifting the pivot away from G changes the gravitational mass of the metre rule proportionally to the overhang ratio.',
      'Only upward normal reaction at the knife-edge exerts a turning moment about the pivot when G is displaced.',
    ],
    e: 'When balanced at G, the line of action of W_r passes through the pivot (moment arm = 0); when pivoted elsewhere, W_r × |x_pivot − x_G| must be included—which is actually how unknown rule mass is measured!',
  },
  'p-friction': {
    q: 'When finding the coefficient of limiting static friction μ_s on a horizontal board, why do we tap the board very lightly as weights are added to the scale pan?',
    c: 'To overcome minor surface sticking irregularities and identify the true limiting equilibrium point where uniform sliding just begins.',
    w: [
      'To create an air cushion under the wooden block so kinetic friction equals zero during acceleration.',
      'To increase the normal reaction R transiently so μ_s becomes independent of surface roughness.',
      'To Stretch the pulley string within its elastic limit so tension exceeds pan weight.',
    ],
    e: 'Gentle tapping tests whether the block is at genuine limiting equilibrium or momentarily snagged on a microscopic wood burr, giving reproducible limiting pull F = μR.',
  },
  'p-archimedes': {
    q: 'When verifying Archimedes’ Principle with a sinker suspended from a spring balance into an Eureka (displacement) can, what error occurs if water wasn’t pre-filled right to the spout and allowed to stop dripping first?',
    c: 'Part of the submerged object’s volume goes into raising the water level up to the spout, so collected displaced water weighs less than the upthrust.',
    w: [
      'Surface tension at the dry spout siphons extra water out, making displaced weight exceed the object’s weight in air.',
      'Hydrostatic pressure on the bottom of the beaker decreases, reducing the spring-balance reading in air.',
      'Air bubbles trapped on the sinker shrink and decrease the apparent loss in weight recorded on the balance.',
    ],
    e: 'An under-filled Eureka can retains water needed just to reach overflow level, causing collected weight of displaced liquid to fall short of true upthrust (W_air − W_liquid).',
  },
  'p-cooling': {
    q: 'When plotting a cooling curve for hot water or melted naphthalene to compare cooling rates, why must the liquid be stirred gently throughout and draughts shielded appropriately?',
    c: 'Continuous gentle stirring keeps temperature uniform throughout the liquid so the thermometer bulb reads true bulk temperature rather than a cool boundary layer.',
    w: [
      'Vigorous stirring supplies frictional latent heat that raises the freezing plateau above the true melting point.',
      'Stirring prevents radiative heat transfer through silvered calorimeter walls while doubling evaporative mass loss.',
      'Shielding draughts forces Newton’s Law of Cooling to follow a linear straight line instead of an exponential curve.',
    ],
    e: 'Without stirring, convection stratification leaves hotter liquid near the top/core and cooler liquid near the walls, distorting instantaneous θ vs t readings.',
  },
  'p-calorimeter': {
    q: 'When transferring a hot brass block from boiling water into a lagged copper calorimeter (Method of Mixtures), why must the transfer be swift while shaking off adhering boiling-water droplets?',
    c: 'Swift transfer prevents cooling in air, while clinging 100 °C water droplets carry high specific heat capacity (4200 J kg⁻¹ K⁻¹) that would inflate final temperature.',
    w: [
      'Adhering boiling droplets evaporate instantly and freeze the calorimeter stirrer below room temperature.',
      'Copper calorimeters react exothermically with hot brass unless dried first on filter paper for 30 seconds.',
      'Shaking off droplets reduces the mass of cold water initially weighed inside the lagged jacket.',
    ],
    e: 'Even 1 g of 100 °C water carries ~10× more thermal energy per kelvin than 1 g of brass (c_water ≈ 4200 vs c_brass ≈ 380 J kg⁻¹ K⁻¹), introducing serious positive error if carried over.',
  },
  'p-glassblock': {
    q: 'In the rectangular glass-block refraction practical using optical pins, why should adjacent pins on each ray be spaced widely apart (at least 5 cm) and viewed at the bases of the pins?',
    c: 'Wide spacing minimises angular alignment error when drawing the ray line, and viewing pin bases avoids error from bent pin tops.',
    w: [
      'Close pin spacing (< 1 cm) increases lateral displacement d and prevents total internal reflection inside glass.',
      'Viewing pin heads above the glass block eliminates refractive index dependence on wavelength.',
      'Wide pin spacing ensures angle of emergence e exceeds angle of incidence i for parallel faces.',
    ],
    e: 'Two points close together magnify tiny placement errors into large angular errors; aligning the feet of vertical pins where they pierce the paper guarantees true ray geometry.',
  },
  'p-prism': {
    q: 'When plotting angle of deviation D against angle of incidence i for a 60° triangular glass prism, what unique optical condition holds at the minimum deviation trough D_min?',
    c: 'The refracted ray travels symmetrically parallel to the prism base, with angle of incidence equal to angle of emergence (i = e).',
    w: [
      'The emergent ray grazes the second prism face at 90° because the internal angle reaches the critical angle c.',
      'Dispersion into spectral colours reaches maximum angular spread while incident angle i equals zero.',
      'Deviation D_min equals twice the refractive index regardless of the apex angle A of the prism.',
    ],
    e: 'At minimum deviation D_min, ray passage is symmetric (i = e and r₁ = r₂ = A/2), giving n = sin((A + D_min)/2) / sin(A/2).',
  },
  'p-lens-uv': {
    q: 'In a converging-lens u–v experiment, if the illuminated cross-wire object is placed at distance u < f from the optical centre, why can NO sharp image be captured on the white screen?',
    c: 'When u < f, refracted rays diverge on leaving the lens and form a virtual, upright magnified image on the same side as the object.',
    w: [
      'Chromatic aberration blocks paraxial light transmission whenever object distance falls inside the principal focus.',
      'A real inverted image forms at infinity behind the screen, requiring a concave mirror to project.',
      'Total internal reflection occurs inside thin biconvex glass whenever incident rays exceed the focal cone.',
    ],
    e: 'Only real images (formed where rays physically converge, requiring u > f for a convex lens) can be projected onto a screen.',
  },
  'p-concave': {
    q: 'In the no-parallax method to find focal length f of a concave mirror using a search pin, how do you confirm exact coincidence between the real inverted image and the object pin at C = 2f?',
    c: 'When you move your eye sideways across the mirror axis, the tip of the inverted image and the tip of the pin stay locked together without splitting.',
    w: [
      'When you move your eye sideways, the inverted image moves twice as fast in the opposite direction to the pin.',
      'The image flips upright and fills the entire aperture of the concave mirror with uniform brightness.',
      'Parallax is eliminated whenever the search pin stands halfway between the pole P and principal focus F.',
    ],
    e: 'Zero relative shift (no parallax) as the observer’s head moves laterally proves that image and search pin lie in the exact same plane (u = v = r = 2f).',
  },
  'p-ohm': {
    q: 'During an Ohm’s Law circuit practical, why MUST you open the plug key immediately after recording each (I, V) pair instead of leaving current flowing continuously?',
    c: 'Continuous current heats the resistance wire, increasing its temperature and resistance R so the V–I graph curves away from linearity.',
    w: [
      'Leaving the key closed reverses voltmeter polarity and demagnetises the moving-coil ammeter shunt.',
      'Continuous current polarises the rheostat slider until potential difference across the wire drops to zero.',
      'Opening the key between readings discharges capacitance stored inside the metallic nichrome resistor.',
    ],
    e: 'Ohm’s Law (V ∝ I) holds strictly at constant temperature; Joule heating (I²Rt) raises metallic resistance and violates the constant-temperature condition.',
  },
  'p-metrebridge': {
    q: 'On a 100 cm Wheatstone metre bridge, why should you choose standard resistance R so the null balance point l₁ falls near the middle (35 cm – 65 cm) and tap the jockey lightly instead of scraping it?',
    c: 'Mid-wire balance minimises fractional percentage error from end-corrections, while scraping gouges the wire and makes cross-sectional area non-uniform.',
    w: [
      'Mid-wire balance maximises current through the galvanometer, while scraping heats the copper strips at the terminals.',
      'Balancing near 50 cm eliminates cell internal resistance r so EMF equals terminal voltage.',
      'Scraping the jockey coats constantan wire with oxide that doubles resistance per unit length uniformly.',
    ],
    e: 'R_x / R = l₁ / (100 − l₁) assumes uniform resistance per cm (uniform cross-section A). Scraping ruins uniformity, and extreme ends (e.g. 3 cm) suffer huge percentage uncertainty.',
  },
  'p-potentiometer': {
    q: 'Why does a calibrated potentiometer measure the TRUE electromotive force (EMF) of a cell more accurately than a standard moving-coil voltmeter?',
    c: 'At the galvanometer null-balance point, zero current is drawn from the test cell, so no voltage is lost across its internal resistance (Ir = 0).',
    w: [
      'A potentiometer has infinite series resistance in its driver wire, boosting the cell’s chemical potential.',
      'Moving-coil voltmeters measure root-mean-square AC ripple whereas potentiometers rectify direct current.',
      'Null balance short-circuits the test cell briefly so maximum current I_max reveals true open-circuit EMF.',
    ],
    e: 'Any finite-resistance voltmeter draws current I, reading terminal p.d. V = E − Ir < E; at potentiometer null deflection, I = 0 so balanced p.d. equals exact E.',
  },
  'p-resonance': {
    q: 'In a resonance-tube experiment to measure speed of sound v in air, why do we subtract the first resonance length from the second [v = 2f(L₂ − L₁)] instead of just using v = 4fL₁?',
    c: 'The antinode sits slightly above the open tube mouth by an end-correction e; taking L₂ − L₁ cancels e completely since (L₂ + e) − (L₁ + e) = λ/2.',
    w: [
      'Subtracting L₁ from L₂ cancels atmospheric humidity and temperature rises inside the water column.',
      'First resonance L₁ is an overtone harmonic whereas L₂ represents the fundamental quarter-wavelength.',
      'End-correction e doubles at higher frequencies unless two tuning forks of unequal pitch are averaged.',
    ],
    e: 'L₁ + e = λ/4 and L₂ + e = 3λ/4. Subtracting eliminates unknown end-correction e ≈ 0.6r, giving exact λ = 2(L₂ − L₁).',
  },

  // ═══════════════════ MATHS CONSTRUCTIONS & GRAPHS (23) ═══════════════════
  'bisect-line': {
    q: 'When bisecting segment AB with a ruler and compasses, why MUST the chosen compass radius be strictly greater than half the length of AB?',
    c: 'If the radius is ½AB or less, the arcs centred at A and B will either barely touch at one point or never intersect above and below AB.',
    w: [
      'A radius smaller than ½AB makes the bisector meet AB at 60° instead of 90°.',
      'Opening the compass wider than ½AB ensures the perpendicular passes through A rather than the midpoint M.',
      'If the radius equals ½AB, the two arcs form concentric circles that cannot define a straightedge line.',
    ],
    e: 'By the triangle inequality, two equal circles centred at A and B intersect in two distinct points (above and below AB) if and only if radius r > ½AB.',
  },
  'bisect-angle': {
    q: 'After drawing the first arc from vertex O to cut the two arms at P and Q when bisecting ∠AOB, why must you keep the EXACT SAME compass radius when drawing intersecting arcs from P and Q?',
    c: 'Equal radii OP = OQ and PR = QR make triangles OPR and OQR congruent by SSS, proving ∠POR = ∠QOR.',
    w: [
      'Changing radius between P and Q shifts R onto arm OA so the bisector measures 45° regardless of ∠AOB.',
      'Equal radii ensure quadrilateral OPRQ has supplementary opposite angles summing to 360°.',
      'Keeping the same radius prevents compass slip and guarantees OR equals half of chord PQ.',
    ],
    e: 'Congruence (SSS: OP = OQ, PR = QR, and OR common) is the geometric proof that ray OR splits ∠AOB into two strictly equal halves.',
  },
  'angle-60': {
    q: 'Why does stepping off one arc from P along the main arc centred at O using the UNCHANGED compass radius construct an exact 60° angle without a protractor?',
    c: 'Segments OP, OQ, and PQ all equal the same compass radius r, forming an equilateral triangle OPQ whose interior angles are each 60°.',
    w: [
      'Chord PQ subtends a right angle at the circumference, making central angle ∠QOP equal two-thirds of 90°.',
      'Arc PQ has arc length equal to πr/2, which divides a straight 180° baseline into three unequal sectors.',
      'Keeping the same radius constructs an isosceles right-angled triangle whose base angles bisect 120°.',
    ],
    e: 'In △OPQ, OP = r (first arc), OQ = r (same arc), and PQ = r (stepped with unchanged compass), so △OPQ is equilateral and ∠QOP = 60°.',
  },
  'angle-30': {
    q: 'In a strict Euclidean ruler-and-compasses construction asking for 30°, why will you lose method credit if you measure 30° with a protractor and erase your arcs?',
    c: 'Geometric construction proof requires visible 60° equilateral arcs followed by visible angle-bisector arcs splitting 60° into 30°.',
    w: [
      'Protractors graduate anticlockwise in radians, introducing a 0.5° systematic parallax error at vertex O.',
      'Rubbing out arcs alters paper flatness and shifts vertex O away from the 30°–60°–90° hypotenuse.',
      'A 30° angle can only be constructed accurately by trisecting a 90° right angle with three equal chords.',
    ],
    e: 'Ruler-and-compasses constructions require leaving all construction arcs faint but clearly visible as mathematical proof of method (60° → bisected to 30°).',
  },
  'angle-90': {
    q: 'When constructing a 90° perpendicular at a point O on a straight line, you first mark equidistant points P and Q on either side of O. What geometric role is O playing?',
    c: 'O is the exact midpoint of segment PQ, so constructing the perpendicular bisector of PQ forces the 90° line right through O.',
    w: [
      'O is the circumcentre of an equilateral triangle OPQ whose altitude bisects a 120° exterior angle.',
      'P and Q act as foci of an ellipse whose minor axis intersects the baseline tangentially at O.',
      'Equidistant marks P and Q ensure the compass radius from P and Q can be smaller than length OP.',
    ],
    e: 'Marking OP = OQ makes O the midpoint of PQ; expanding the compass (> OP) and crossing arcs from P and Q builds the perpendicular bisector through O.',
  },
  'angle-45': {
    q: 'Which two sequential ruler-and-compasses steps guarantee an exact 45° angle at point O on baseline OA?',
    c: 'First construct a verified 90° perpendicular ray OB at O, then construct the angle bisector of ∠AOB.',
    w: [
      'First construct a 60° ray at O, then step back half a chord length along the arc using a ruler.',
      'Draw a circle of radius 4.5 cm at O and join O to the point 4.5 cm vertically above the baseline.',
      'Construct 120° with two 60° arcs, then bisect the reflex angle outside the baseline.',
    ],
    e: 'Since 45° = 90° ÷ 2, standard Euclidean construction builds 90° first and bisects the right angle cleanly.',
  },
  'angle-120': {
    q: 'Starting from baseline OP and an arc of radius r centred at O cutting OP at P, why do two consecutive chords of radius r stepped along that arc produce ∠RO P = 120°?',
    c: 'Each radius-length chord forms an adjacent 60° equilateral triangle with O, so two adjacent 60° central angles sum to 120°.',
    w: [
      'Stepping radius r twice spans the full diameter of circle O, which subtends 120° at the centre.',
      'Two chords of length r form a regular pentagon sector whose exterior angle is 120°.',
      'Doubling chord length doubles the sine of 30°, producing an obtuse angle of 120° by the cosine rule.',
    ],
    e: 'First step gives ∠QOP = 60° (△OPQ equilateral); second step from Q to R gives ∠ROQ = 60° (△OQR equilateral), so ∠ROP = 60° + 60° = 120°.',
  },
  'protractor': {
    q: 'What is the #1 mistake candidates make when reading 65° on a semi-circular protractor that causes them to draw 115° instead?',
    c: 'Reading from the outer scale instead of the scale whose 0° mark rests directly on their chosen baseline arm.',
    w: [
      'Placing the protractor crosshair on vertex O instead of aligning the curved rim with the baseline.',
      'Using a sharp 2H pencil dot instead of drawing a 1 cm cross at the 65° graduation mark.',
      'Measuring clockwise from North instead of measuring from the horizontal arm.',
    ],
    e: 'Every protractor has dual clockwise/anticlockwise scales (0°→180° and 180°→0°); always start counting 0°, 10°, 20°... from the arm your baseline actually touches (180° − 65° = 115°!).',
  },
  'perp-point': {
    q: 'When dropping a perpendicular from an external point P onto line AB, why does the first arc centred at P cut line AB at two points X and Y?',
    c: 'Because PX = PY, point P is already equidistant from X and Y, so bisecting segment XY gives a perpendicular guaranteed to pass through P.',
    w: [
      'Points X and Y trisect segment AB so the median from P meets AB at 90°.',
      'Arc XY serves as the diameter of Thales’ circle centred at P so ∠XPY is always 90°.',
      'Cutting AB twice proves AB is tangent to circle P at the midpoint of XY.',
    ],
    e: 'Any point equidistant from X and Y lies on the perpendicular bisector of XY. Since PX = PY and QX = QY (second pair of arcs), line PQ is the exact perpendicular bisector of XY!',
  },
  'triangle-sss': {
    q: 'When attempting to construct △ABC given three side lengths, for which set of lengths would the two compass arcs from A and B FAIL to intersect?',
    c: 'AB = 9 cm, BC = 4 cm, AC = 4 cm — because 4 + 4 < 9 violates the triangle inequality.',
    w: [
      'AB = 7 cm, BC = 6 cm, AC = 5 cm — because none of the three sides are equal.',
      'AB = 8 cm, BC = 6 cm, AC = 10 cm — because the longest side is not drawn as the base.',
      'AB = 6 cm, BC = 6 cm, AC = 6 cm — because acute arcs overlap at two symmetric vertices.',
    ],
    e: 'A triangle exists if and only if the sum of any two sides strictly exceeds the third side (AC + BC > AB). Here 4 + 4 = 8 < 9, leaving a 1 cm gap between the circles!',
  },
  'bearings': {
    q: 'In three-figure bearings problems, what three rules MUST every bearing angle obey at each turning point?',
    c: 'Measured from Geographical North, turned strictly clockwise, and written with three digits (e.g. 060° rather than 60°).',
    w: [
      'Measured from the positive East axis, turned anticlockwise, and restricted to acute angles under 090°.',
      'Measured from the previous path direction, turned toward the nearer pole (N or S), and rounded to 10°.',
      'Measured from Magnetic South, turned clockwise, and expressed in kilometres per centimetre scale.',
    ],
    e: 'By universal navigation convention, three-figure bearings start at North (000°) at the "from" point, sweep clockwise (000°–360°), and use leading zeros.',
  },
  'graph': {
    q: 'Once you plot y = x² − 2x − 3 smoothly through your table points, how do you read off the real roots of x² − 2x − 3 = 0 directly from the graph?',
    c: 'Read the x-coordinates where the parabola crosses the horizontal x-axis (line y = 0), giving x = −1 and x = 3.',
    w: [
      'Read the y-coordinate where the parabola crosses the vertical y-axis (x = 0), giving y = −3.',
      'Read the coordinates of the minimum turning-point vertex at (1, −4) and divide both by 2.',
      'Join consecutive plotted points with straight ruler segments and measure their gradients.',
    ],
    e: 'Solving f(x) = 0 graphically means finding where y = f(x) meets y = 0 (the x-axis). Note also: quadratic curves must be drawn freehand as a smooth curve, never ruler-to-ruler!',
  },
  'loci-region': {
    q: 'In locus shading ("less than 4 cm from A AND nearer to B than to A"), what geometric boundary separates points nearer to B from points nearer to A?',
    c: 'The perpendicular bisector of segment AB — every point on B’s side of that bisector lies closer to B than to A.',
    w: [
      'A circle of radius 4 cm centred at B — every point inside circle B lies closer to B than to A.',
      'The angle bisector of ∠OAB — every point below ray AB lies equidistant from A and B.',
      'A pair of parallel lines 2 cm on either side of chord AB.',
    ],
    e: 'The locus of points equidistant from two fixed points A and B is the perpendicular bisector of AB; the half-plane containing B holds all points strictly nearer to B.',
  },
  'copy-angle': {
    q: 'When copying a given angle ∠BAC onto a new ray PQ using only ruler and compasses, what measurement does the second compass setting transfer?',
    c: 'The exact chord length between the two points where the equal-radius reference arc cut arms AB and AC.',
    w: [
      'The perpendicular height dropped from C onto arm AB divided by the length of ray PQ.',
      'Half the degree reading read from a protractor and converted to millimetres on a ruler.',
      'The tangent ratio of ∠BAC stepped along ray PQ twice.',
    ],
    e: 'Drawing equal-radius arcs at A and P and transferring the chord opening between the arms constructs congruent isosceles triangles (SSS), reproducing ∠BAC identically.',
  },
  'parallel': {
    q: 'When constructing a line through external point P parallel to line AB by copying an angle along a transversal through P, which angle theorem proves the two lines are parallel?',
    c: 'Equal corresponding (or equal alternate interior) angles formed with the transversal guarantee parallel lines.',
    w: [
      'Vertically opposite angles at the intersection with AB always sum to 180°.',
      'Exterior angles of a cyclic quadrilateral are complementary across any transversal.',
      'Equal chord lengths from P to A and P to B force the line through P to never meet AB.',
    ],
    e: 'Copying the angle between transversal l and AB at vertex P makes corresponding (or alternate) angles strictly equal, which is Euclid’s criterion for parallel lines.',
  },
  'angle-75': {
    q: 'Why does bisecting the 30° gap between a constructed 60° ray and a constructed 90° ray at O yield an exact 75° angle?',
    c: 'Half of the 30° angle between 60° and 90° is 15°, and 60° + 15° = 75°.',
    w: [
      '75° is three-quarters of 120°, obtained by bisecting 120° twice toward the baseline.',
      'Adding a 45° bisector directly onto a 60° equilateral arc produces 75° by chord subtraction.',
      'Bisecting the supplement of 60° (which is 120°) yields 75° on the acute side.',
    ],
    e: 'Construct 60° and 90° sharing the same base arc around O; bisecting the 30° arc interval between the 60° cut and 90° cut lands at 60° + ½(90° − 60°) = 75°.',
  },
  'angle-135': {
    q: 'How is an obtuse angle of 135° constructed cleanly at point O on a straight line POQ using ruler and compasses?',
    c: 'Construct the 90° perpendicular OR on line POQ, then bisect the adjacent 90° right angle on the Q-side so 90° + 45° = 135°.',
    w: [
      'Step off two 60° arcs (120°) and add a third 30° chord without bisecting.',
      'Bisect a 120° angle twice from baseline OP and extend the ray backward.',
      'Construct an equilateral triangle on OP and bisect its exterior 120° angle to get 135°.',
    ],
    e: 'On straight line POQ (180°), perpendicular OR creates two 90° angles; bisecting ∠ROQ into two 45° halves gives ∠SOP = 90° + 45° = 135°.',
  },
  'triangle-sas': {
    q: 'In constructing △ABC with AB = 7 cm, ∠A = 60°, and AC = 5 cm (SAS), why do we draw the 60° ray at A BEFORE setting the compass to 5 cm for C?',
    c: 'Vertex C must lie simultaneously on the 60° ray from A AND at distance 5 cm from A, uniquely fixing C before joining BC.',
    w: [
      'Setting 5 cm from B first would create an ambiguous SSA case with two non-congruent triangles.',
      'Drawing AC = 5 cm horizontally forces ∠B rather than ∠A to equal 60°.',
      'Compass arcs of 5 cm cannot intersect a 7 cm baseline unless a 60° arc is drawn first.',
    ],
    e: 'SAS fixes two sides and the included angle between them: draw AB = 7 cm, construct ray AX at 60° to AB, mark AC = 5 cm along AX, and join C to B.',
  },
  'circumcircle': {
    q: 'Why does the intersection O of the perpendicular bisectors of two sides (AB and BC) of △ABC automatically lie at the exact same distance from all three vertices A, B, and C?',
    c: 'Lying on the bisector of AB gives OA = OB, and lying on the bisector of BC gives OB = OC, so by transitivity OA = OB = OC = R.',
    w: [
      'Perpendicular bisectors always pass through the opposite vertices and divide medians in a 2:1 ratio.',
      'Angle bisectors of △ABC meet at the circumcentre O, making O equidistant from the three sides.',
      'Any point inside an acute triangle has equal perpendicular distances to all three vertices.',
    ],
    e: 'Perpendicular bisectors give equidistance from endpoints (vertices → circumcircle through A, B, C), whereas angle bisectors give equidistance from arms (sides → incircle)!',
  },
  'incircle': {
    q: 'After finding incentre I as the intersection of two angle bisectors of △ABC, what MUST you do to set the exact compass radius r before drawing the inscribed circle?',
    c: 'Construct a perpendicular from incentre I to one side of the triangle to find the exact tangent foot T, then set radius r = IT.',
    w: [
      'Open the compass from incentre I to the nearest vertex A so the circle passes cleanly inside BC.',
      'Join incentre I to the midpoint M of side AB and use IM as the radius regardless of triangle shape.',
      'Take half the length of the shortest side of △ABC as the universal inscribed radius.',
    ],
    e: 'A tangent is perpendicular to the radius at the point of contact! Measuring to a midpoint M instead of dropping perpendicular IT causes the circle to overshoot or miss the sides.',
  },
  'histogram': {
    q: 'When drawing a histogram from a grouped frequency table such as 10–19, 20–29, 30–39 (discrete marks), what horizontal values MUST the touching bar edges sit on?',
    c: 'True class boundaries (9.5, 19.5, 29.5, 39.5) with zero gaps between adjacent bars.',
    w: [
      'Stated class limits (10, 19, 20, 29) separated by 1-unit gaps like a categorical bar chart.',
      'Class midpoints (14.5, 24.5, 34.5) plotted against cumulative frequencies.',
      'Upper class limits only, with bar widths proportional to frequency.',
    ],
    e: 'Histograms represent continuous class intervals with touching bars placed on continuous class boundaries (e.g. 9.5–19.5, 19.5–29.5), never separated like bar charts.',
  },
  'ogive': {
    q: 'When plotting a cumulative frequency curve (ogive), which x-coordinate is each cumulative frequency plotted against, and where is the median read?',
    c: 'Plot cumulative frequency against UPPER class boundaries, then read the x-value corresponding to ½N on the cumulative frequency axis.',
    w: [
      'Plot cumulative frequency against class midpoints, then read the peak y-value of the S-curve.',
      'Plot individual class frequencies against lower class boundaries, then average the first and last classes.',
      'Plot cumulative frequency against upper class limits without +0.5 boundary adjustment, then read ¾N.',
    ],
    e: 'Cumulative frequency counts how many observations are "less than or equal to" the upper class boundary; median sits at the 50th percentile (½N), Q₁ at ¼N, and Q₃ at ¾N.',
  },
  'net-cylinder': {
    q: 'When the curved lateral surface of a closed cylinder of radius r and height h is unrolled flat into a rectangle, why is the rectangle’s horizontal length equal to 2πr?',
    c: 'Because that horizontal edge wrapped all the way around the circumference (C = 2πr) of the circular top and bottom faces.',
    w: [
      'Because the area of the two circular end-caps (2 × πr²) equals the perimeter of the side wall.',
      'Because cylinder diameter 2r multiplied by height h equals 2πr when h = π.',
      'Because unrolling a curved surface stretches its width by a factor of π relative to the diameter.',
    ],
    e: 'The curved wall unrolls into a rectangle of width = circumference = 2πr and height = h (area 2πrh); adding top + bottom discs (2πr²) gives total surface area 2πr² + 2πrh.',
  },
  'b-microscope': {
    q: 'When mounting a stained onion epidermal peel in iodine solution on a glass slide, why MUST the coverslip be lowered slowly at 45° with a mounted needle?',
    c: 'To expel trapped air gradually so dark-rimmed air bubbles do not obscure the cells under the objective lens.',
    w: [
      'To crush the cellulose cell walls flat so iodine penetrates the nucleus instantaneously.',
      'To polarise light passing through the stage condenser before switching to the ×40 lens.',
      'To seal the specimen airtight so aerobic respiration halts immediately on the slide.',
    ],
    e: 'Dropping a coverslip flat traps circular dark-ringed air bubbles; lowering it gently at 45° with a mounted needle drives fluid smoothly across the peel.',
  },
  'b-osmosis': {
    q: 'In the yam osmometer practical, why does the sugar level fail to rise inside Cavity B cut from a BOILED yam cylinder placed in distilled water?',
    c: 'Boiling denatures the living plasma membranes of the yam cells, destroying their selective permeability so osmosis cannot occur.',
    w: [
      'Boiling gelatinises yam starch into insoluble cellulose that blocks water entry into the cavity.',
      'Boiling evaporates all endogenous sucrose from the yam cells so water potential becomes infinite.',
      'Boiled yam cells actively pump water outward into the beaker using residual heat energy.',
    ],
    e: 'Osmosis requires a living, selectively permeable plasma membrane; boiling kills the cells and renders membranes freely permeable, acting as the experimental control.',
  },
  'b-food-starch-sugar': {
    q: 'Why must a pure sucrose (non-reducing sugar) solution be boiled with dilute HCl AND neutralised with NaOH before heating with Benedict’s solution?',
    c: 'Dilute HCl hydrolyses the glycosidic bond into glucose and fructose, and NaOH restores the alkaline medium required for Cu²⁺ reduction.',
    w: [
      'Dilute HCl oxidises sucrose into starch, and NaOH precipitates brick-red copper(II) hydroxide directly.',
      'Benedict’s reagent reacts explosively with unhydrolysed disaccharides unless neutralised salt is present.',
      'Dilute HCl bleaches the blue CuSO₄ colour first so the faint brick-red precipitate becomes visible.',
    ],
    e: 'Sucrose lacks a free aldehyde/ketone group; acid hydrolysis splits it into reducing monosaccharides, and neutralisation prevents residual HCl from destroying alkaline Benedict’s reagent.',
  },
  'b-food-protein-lipid': {
    q: 'When carrying out the Biuret test on egg albumen solution, why must you NEVER boil the mixture after adding NaOH(aq) and 1% CuSO₄ drops?',
    c: 'Biuret works at room temperature, whereas heating coagulates protein and masks the violet peptide–Cu²⁺ complex.',
    w: [
      'Boiling reduces alkaline Cu²⁺ to a brick-red Cu₂O precipitate even when zero sugar is present.',
      'Heating hydrolyses all peptide bonds into free amino acids that turn deep blue-black.',
      'Boiling vaporises sodium hydroxide and turns the mixture into a milky lipid emulsion.',
    ],
    e: 'Peptide linkages coordinate with Cu²⁺ in cold alkaline solution to give a purple/violet colour; heating coagulates albumen into opaque white curds.',
  },
  'b-photosynthesis-leaf': {
    q: 'When decolourising a boiled green leaf in hot ethanol (methylated spirit) to test for starch, what safety precaution is strictly mandatory?',
    c: 'Extinguish every naked Bunsen flame first and heat the ethanol tube strictly inside a hot-water bath because ethanol vapour is highly inflammable.',
    w: [
      'Boil the ethanol tube gently over a luminous yellow Bunsen flame while stoppering the mouth tightly.',
      'Add concentrated tetraoxosulphate(VI) acid to the ethanol so chlorophyll dissolves without heating.',
      'Keep the Bunsen flame burning beside the water bath to oxidise escaping alcohol fumes safely.',
    ],
    e: 'Ethanol boils at 78 °C and its vapour ignites violently near a naked flame; always turn off the burner before placing the ethanol boiling tube in the hot-water bath.',
  },
  'b-oxygen-elodea': {
    q: 'In the Elodea (Hydrilla) pondweed gas-evolution setup, why is a pinch of sodium hydrogencarbonate (NaHCO₃) dissolved in the beaker water?',
    c: 'To supply dissolved carbon(IV) oxide (CO₂) so carbon availability does not limit the rate of photosynthesis.',
    w: [
      'To absorb dissolved oxygen so only pure nitrogen bubbles collect in the inverted test tube.',
      'To buffer the pond water at pH 2 so aquatic stomatal guard cells remain permanently open.',
      'To decompose spontaneously in darkness and relight a glowing splint as a positive control.',
    ],
    e: 'NaHCO₃ releases HCO₃⁻ / dissolved CO₂ in water, ensuring CO₂ is not a limiting factor while light intensity and oxygen bubble count are investigated.',
  },
  'b-transpiration': {
    q: 'When assembling a leafy shoot in a bubble potometer, why MUST the stem be cut obliquely under water and all rubber joints smeared with Vaseline?',
    c: 'Cutting under water prevents air bubbles from blocking xylem vessels, and Vaseline keeps the apparatus completely airtight so the meniscus tracks water uptake.',
    w: [
      'Cutting under water washes away phloem sap, and Vaseline stops evaporation from the lower epidermis.',
      'Oblique underwater cutting kills root-pressure cells so only capillary rise moves the air bubble.',
      'Vaseline lubricates the capillary bore so the trapped air bubble slides without surface tension.',
    ],
    e: 'An air lock (embolism) in xylem breaks the continuous transpiration stream, and any leak around the bung lets the capillary bubble stall or drift backward.',
  },
  'b-respiration-co2': {
    q: 'When demonstrating that respiring green plants or germinating seeds evolve CO₂ into limewater, why must agreen potted plant be enclosed inside a light-proof black box?',
    c: 'To stop photosynthesis from consuming the respired CO₂ before it can bubble into the limewater.',
    w: [
      'Because aerobic cellular respiration in plant mitochondria occurs exclusively in total darkness.',
      'To prevent UV light from decomposing milky calcium trioxocarbonate(IV) back into clear limewater.',
      'To force stomatal pores wide open in darkness so oxygen enters the leaves more rapidly.',
    ],
    e: 'Respiration runs 24 hours a day, but in light photosynthesis re-fixes CO₂ faster than respiration releases it; excluding light isolates net CO₂ evolution.',
  },
  'b-enzyme-ptyalin': {
    q: 'In the salivary amylase (ptyalin) starch-digestion assay across 0 °C, 37 °C, and 70 °C water baths, why do iodine drops stay blue-black permanently in the 70 °C tube?',
    c: 'High heat at 70 °C denatures salivary amylase by distorting its 3D active site, so starch is never hydrolysed to maltose.',
    w: [
      'At 70 °C maltose condenses rapidly back into amylose chains faster than ptyalin can cleave them.',
      'Iodine reagent reacts directly with hot water above 60 °C to form a permanent blue-black complex.',
      'Boiling evaporates salivary chloride ions without altering the folded polypeptide structure of ptyalin.',
    ],
    e: '37 °C matches human body optimum (reaching the brown achromic point fastest), 0 °C merely slows collisions reversibly, and 70 °C irreversibly denatures the protein enzyme.',
  },
  'b-quadrat': {
    q: 'When estimating Tridax procumbens population density on a school field using a 1 m² quadrat, how must the quadrat be placed on each throw?',
    c: 'At random across the study area (e.g. using random grid coordinates) to eliminate observer bias toward dense patches.',
    w: [
      'Deliberately over the greenest patches where Tridax flowers are easiest to count accurately.',
      'In a single corner of the field repeated ten times on the exact same square metre.',
      'Only along paved walkways where grass competition does not obscure small seedlings.',
    ],
    e: 'Random sampling ensures every part of the habitat has an equal chance of selection; density is then Total individuals counted ÷ (Number of throws × Quadrat area).',
  },
  'b-soil-water': {
    q: 'When equal volumes of water (50 cm³) are poured onto equal dry masses of sandy, clayey, and loamy soils in plugged funnels, why is loam best for crop roots despite clay retaining more water?',
    c: 'Loam retains adequate capillary water and humus nutrients while still draining excess water so root air spaces stay well aerated.',
    w: [
      'Loam has the largest coarse quartz grains so 100% of rainfall drains away before fungi can grow.',
      'Clay soil chemically binds all water molecules into crystal lattices that plant roots can never absorb.',
      'Sandy soil contains excess alkaline humus that plasmolyses root hairs whenever rainfall is heavy.',
    ],
    e: 'Clay waterlogs easily (starving roots of O₂ for aerobic ion uptake), sand drains too fast and leaches minerals, whereas loam balances water retention with aeration.',
  },
  'b-flower-dissect': {
    q: 'Under standard biological drawing rules for a longitudinal half-flower section of Hibiscus rosa-sinensis, which technique demonstrates scientific precision?',
    c: 'Sharp HB single continuous outlines with zero shading, horizontal non-crossing guidelines, and a stated magnification (e.g. ×1.5).',
    w: [
      'Artistic pencil shading and stippling on petals with diagonal crossing arrows pointing to floral whorls.',
      'Feathery sketched outlines traced in blue ballpoint ink with labels written directly inside the ovary.',
      'Ruler-drawn geometric boxes for anthers and petals without recording specimen size or magnification.',
    ],
    e: 'Standard biological drawings forbid shading, feathery lines, ink outlines, and crossing guidelines; always include title, clean horizontal ruled guidelines, and magnification = Drawing length ÷ Specimen length.',
  },
  'b-vertebrata': {
    q: 'Which diagnostic feature uniquely identifies ANY mammalian cervical vertebra (atlas, axis, or typical cervical) on the specimen bench?',
    c: 'A pair of vertebrarterial canals (foramina transversaria) piercing the base of the transverse processes.',
    w: [
      'A very long backward-sloping neural spine accompanied by articular facets for ribs.',
      'A massive kidney-shaped centrum bearing prominent metapophyses and anapophyses.',
      'Five fused vertebrae forming a rigid triangular plate with sacro-iliac articulations.',
    ],
    e: 'Vertebrarterial canals carry the vertebral blood vessels through the neck and occur ONLY in cervical vertebrae (thoracic = long spine + costal facets; lumbar = massive centrum).',
  },
  'b-mendel-beads': {
    q: 'In the Mendelian monohybrid bead-modelling practical (50 red R + 50 white r beads in each beaker), why MUST each pair of drawn beads be returned and shaken before the next draw?',
    c: 'To keep gamete allele probabilities constant at p = 0.5 and q = 0.5 on every fertilisation trial, modelling a large gamete pool.',
    w: [
      'To force exact alternation between RR, Rr, and rr genotypes after every four draws.',
      'To prevent homozygous recessive rr pairs from appearing twice in consecutive draws.',
      'Because without replacement the phenotypic ratio automatically shifts from 3:1 to 9:3:3:1.',
    ],
    e: 'Sampling with replacement preserves independent 1/2 R and 1/2 r gamete probabilities on every draw, converging toward 1 RR : 2 Rr : 1 rr (3:1 dominant:recessive) as sample size grows.',
  },

  // ═══════════════════ AGRICULTURAL SCIENCE PRACTICALS (14) ═══════════════════
  'a-soil-sediment': {
    q: 'In the soil mechanical sedimentation jar test, why do we add a pinch of sodium hexametaphosphate (Calgon) before shaking the soil suspension?',
    c: 'To disperse cemented clay and silt aggregates into individual primary mineral particles so each fraction settles strictly by Stokes’ Law.',
    w: [
      'To flocculate coarse quartz sand grains so they float alongside organic humus at the meniscus.',
      'To neutralise soil organic acids so calcium carbonate precipitates at the base of the cylinder.',
      'To bleach dark humus colloids colourless so only iron oxide coatings remain visible.',
    ],
    e: 'Calgon acts as a chemical dispersing agent (Na⁺ replaces flocculating Ca²⁺/Al³⁺), allowing gravel/sand to settle first, silt next, and true clay last.',
  },
  'a-soil-water': {
    q: 'When comparing water-holding capacity and porosity across sandy, loamy, and clayey soils in plugged funnels, why must all three soil samples be oven-dried and weighed equally first?',
    c: 'Existing field moisture would distort initial pore space and saturate particles unevenly, invalidating a controlled comparison of retained volume.',
    w: [
      'Oven-drying fuses fine clay platelets into coarse sand grains so drainage completes within 60 seconds.',
      'Equal wet volumes automatically contain identical mineral masses regardless of bulk density.',
      'Heating above 105 °C adds hygroscopic water that accelerates capillary drainage through cotton wool.',
    ],
    e: 'Standardizing equal dry mass (or dry volume) with zero initial free water ensures retained volume V_added − V_drained reflects true pore-retention capacity.',
  },
  'a-soil-ph': {
    q: 'In colorimetric soil pH testing with barium sulphate (BaSO₄) and universal indicator, what exact role does the white inert BaSO₄ powder play?',
    c: 'It flocculates suspended clay particles so a clear supernatant liquid forms above a white background for accurate indicator colour matching.',
    w: [
      'It reacts as a strong alkali to raise acidic tropical soils to pH 7.0 before the indicator is added.',
      'It dissolves quartz sand grains to release trapped hydrogen ions from the crystal lattice.',
      'It buffers universal indicator at pH 4.5 so aluminium toxicity turns bright violet.',
    ],
    e: 'BaSO₄ is neutral and insoluble; it settles turbid clay colloids rapidly so muddy brown colour does not mask the indicator tint.',
  },
  'a-rock-id': {
    q: 'On the geology and soil-formation bench, which observation distinguishes crystalline limestone/marble from granite and sandstone immediately?',
    c: 'Limestone or marble effervesces briskly with cold dilute HCl, releasing CO₂ gas that turns limewater milky.',
    w: [
      'Granite splits cleanly along soft flaky mica cleavage sheets and scratches with a fingernail.',
      'Sandstone contains interlocking coarse pink feldspar, glassy quartz, and black biotite crystals.',
      'Limestone floats in water due to vesicular gas pores trapped during volcanic cooling.',
    ],
    e: 'Carbonate rocks (CaCO₃: limestone and its metamorphic derivative marble) react with dilute HCl: CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑.',
  },
  'a-seed-viability': {
    q: 'In the 2,3,5-triphenyltetrazolium chloride (TTC) biochemical seed viability assay, why do living embryos stain carmine-red whereas dead embryos remain unstained?',
    c: 'Dehydrogenase enzymes active in respiring embryo cells reduce colourless tetrazolium salt into insoluble red formazan.',
    w: [
      'Stored endosperm starch granules react directly with TTC in dead seeds to form a blue-black complex.',
      'Living seed coats actively pump red anthocyanin pigments out of the cotyledons into the Petri dish.',
      'Dead embryos oxidise tetrazolium chloride into volatile chlorine gas that bleaches the radicle.',
    ],
    e: 'Cellular respiration in viable embryo tissue supplies H⁺/electrons via dehydrogenase enzymes, reducing colourless TTC to red formazan within hours.',
  },
  'a-npk-fert': {
    q: 'Why must a farmer NEVER mix ammonium sulphate [(NH₄)₂SO₄] or urea directly with slaked lime [Ca(OH)₂] before field application?',
    c: 'Alkaline lime reacts with ammonium ions to volatilize gaseous ammonia (NH₃↑), wasting costly nitrogen into the atmosphere.',
    w: [
      'Calcium ions convert soluble nitrate nitrogen into explosive calcium nitride crystals on dry soil.',
      'Mixing lime with ammonium fertilizer lowers soil pH below 3.0 and locks potassium permanently.',
      'Slaked lime chelates urea into an insoluble polymer that earthworms cannot mineralize.',
    ],
    e: '(NH₄)₂SO₄ + Ca(OH)₂ → CaSO₄ + 2H₂O + 2NH₃↑. Apply agricultural lime at least 2–3 weeks before ammoniacal nitrogen fertilizers.',
  },
  'a-root-nodules': {
    q: 'When you slice open an healthy cowpea or groundnut root nodule with a scalpel, what does a pinkish-red interior colour confirm?',
    c: 'Presence of leghaemoglobin regulating oxygen supply so Rhizobium nitrogenase can actively fix atmospheric N₂ into ammonia.',
    w: [
      'Severe infestation by root-knot nematodes (Meloidogyne spp.) feeding on vascular xylem sap.',
      'Acute iron and phosphorus deficiency causing anthocyanin accumulation inside dead cortex cells.',
      'Nitrification of nitrate ions back into inert dinitrogen gas by anaerobic Pseudomonas bacteria.',
    ],
    e: 'Nitrogenase is inactivated by free O₂; pinkish leghaemoglobin binds O₂ tightly while delivering just enough for Rhizobium respiration during N₂ fixation.',
  },
  'a-sprayer-calib': {
    q: 'During knapsack sprayer calibration with clean water, if walking speed is halved while nozzle flow rate and swath width stay constant, what happens to spray volume per hectare (L ha⁻¹)?',
    c: 'Spray application rate (L ha⁻¹) doubles, risking herbicide phytotoxicity and chemical overdose on the crop.',
    w: [
      'Spray application rate halves because droplet diameter shrinks proportionally with walking speed.',
      'Spray application rate stays unchanged since tank capacity (15 L) fixes total hectare coverage.',
      'Swath width automatically doubles to compensate for slower forward operator travel.',
    ],
    e: 'Application rate R (L/ha) = (10,000 × Nozzle discharge L/min) ÷ (Swath m × Speed m/min). Halving speed V cuts the denominator in half, doubling R!',
  },
  'a-pest-disease': {
    q: 'On the crop protection bench, what diagnostic pair links cassava mosaic disease to its exact biological vector and control measure?',
    c: 'Cassava mosaic virus transmitted by the whitefly (Bemisia tabaci), controlled by planting resistant clean stem cuttings.',
    w: [
      'Phytophthorafungus transmitted by mealybugs, controlled by drenching tubers in broad-spectrum antibiotics.',
      'Xanthomonas bacterium transmitted by maize weevils (Sitophilus zeamais), controlled by post-harvest fumigation.',
      'Striga parasitic weed transmitted by aphids (Aphis craccivora), controlled by foliar NPK spraying.',
    ],
    e: 'Cassava mosaic is a viral disease spread by piercing-sucking whiteflies (Bemisia tabaci) and infected stem cuttings; resistant varieties and clean cuttings break transmission.',
  },
  'a-digestive-tract': {
    q: 'Why can cattle and goats thrive on fibrous guinea grass cellulose whereas poultry birds require concentrated grain diets low in crude fibre?',
    c: 'Ruminants house symbiotic cellulase-secreting microbes in a huge anaerobic rumen, whereas birds have a mono-gastric proventriculus and muscular gizzard lacking rumen fermentation.',
    w: [
      'Cattle secrete concentrated hydrochloric acid and pepsin inside the rumen, whereas birds lack any digestive enzymes.',
      'Poultry grind cellulose into glucose mechanically using grit in the crop without needing enzymes.',
      'Ruminants absorb intact cellulose fibres directly across the omasum folds into hepatic portal blood.',
    ],
    e: 'Vertebrates cannot synthesize cellulase themselves; ruminant rumen microbes ferment β-1,4-glycosidic cellulose into volatile fatty acids before true enzymatic digestion in the abomasum.',
  },
  'a-egg-candling': {
    q: 'When candling incubating chicken eggs in a darkened room on Day 7, which observation identifies a live fertile embryo versus an infertile "clear" egg?',
    c: 'A dark central embryo spot radiating a spider-like network of red blood vessels below a distinct air space at the broad end.',
    w: [
      'A completely translucent glowing interior with zero internal shadows and an air cell at the pointed end.',
      'A single detached red blood ring floating freely without radiating vessels after embryo death.',
      'An opaque black-rotted interior emitting hydrogen sulphide gas through hairline shell cracks.',
    ],
    e: 'Live Day-7 embryos show an active vascular web ("spider") and dark eye spot; infertile eggs look clear, while a detached blood ring signals early embryonic mortality.',
  },
  'a-pearson-ration': {
    q: 'When formulating an 18% crude protein (CP) grower mash using maize (10% CP) and soybean meal (42% CP) on a Pearson Square, why MUST the target 18% lie strictly between 10% and 42%?',
    c: 'No positive mixture of two ingredients can yield a protein concentration lower than the poorer feed or higher than the richer supplement.',
    w: [
      'Pearson’s diagonal subtraction only works when the two feedstuffs sum to exactly 100% crude protein.',
      'Target protein must always equal the arithmetic mean (26% CP) for monogastric amino acid balance.',
      'Placing 18% outside the range reverses maize into the protein concentrate and soybean into energy basal.',
    ],
    e: 'Diagonal differences |42 − 18| = 24 parts maize and |18 − 10| = 8 parts soybean (3 : 1 ratio) stay positive if and only if C_low < C_target < C_high.',
  },
  'a-fishpond-water': {
    q: 'In an earthen Clarias/Tilapia fishpond, why is dissolved oxygen (DO) lowest right at dawn (~06:00) in an over-fertilized green pond?',
    c: 'Phytoplankton and fish respire O₂ all night without photosynthetic O₂ production in darkness, depleting DO before sunrise.',
    w: [
      'Cool morning pond water holds less dissolved oxygen physically than hot afternoon surface water.',
      'Sunrise triggers instantaneous ammonia nitrification that consumes 100% of carbonate alkalinity.',
      'Secchi disc turbidity rises at night and blocks atmospheric nitrogen from diffusing across the pond dike.',
    ],
    e: 'Dense algal blooms produce O₂ by day (supersaturating afternoon water) but consume massive O₂ by night via respiration, risking pre-dawn fish gasping at the surface.',
  },
  'a-gunter-survey': {
    q: 'On a farm chain survey using a 66 ft (20.12 m) Gunter’s chain, why are 3-4-5 tape offsets or optical cross-staffs used whenever setting out plot corners?',
    c: 'To establish accurate 90° right angles between baseline and offset lines since area formulas require perpendicular heights.',
    w: [
      'To compensate for thermal contraction of steel links when chaining downhill across wet clay.',
      'To convert magnetic compass bearings directly into hectares without measuring diagonal tie lines.',
      'To double the effective length of each 100-link chain so fewer arrows are needed along the baseline.',
    ],
    e: 'By Pythagoras (3² + 4² = 5²), a 3 m – 4 m – 5 m triangle constructs a true 90° corner in the field so rectangular and trapezoidal plot areas are accurate.',
  },
};

export function getLabVivaCheck(lab: LabItem): LabVivaCheck {
  const subj: SubjectId = lab.subj || 'maths';
  const spec = LAB_VIVA_BANK[lab.id] || {
    q: `In the "${lab.name.replace(/<[^>]+>/g, '')}" practical, which precaution guarantees reliable scientific accuracy?`,
    c: lab.tip
      ? lab.tip.replace(/<[^>]+>/g, '')
      : 'Take every scale reading at eye level and record all observations systematically.',
    w: [
      'Estimate intermediate readings visually without zeroing instruments so the experiment finishes rapidly.',
      'Average all trial runs indiscriminately even when the rough run differs strongly from concordant values.',
      'Erase intermediate construction marks or raw readings and report only rounded whole numbers.',
    ],
    e:
      lab.tip ||
      'Careful eye-level reading, proper zero-error checks, and clear working ensure accurate practical results.',
  };

  const baseOptions = [spec.c, ...spec.w];
  const calibrated = calibrateQuestionItem(
    subj,
    `lab-viva|${lab.id}`,
    spec.q,
    baseOptions,
    0,
    spec.e
  );

  const order = perm(`viva-order|${lab.id}`, calibrated.options.length);
  const shuffledOptions = order.map((origIdx) => calibrated.options[origIdx]);
  const shuffledAnsIdx = order.indexOf(0);

  return {
    labId: lab.id,
    promptHtml: spec.q,
    options: shuffledOptions,
    answerIdx: shuffledAnsIdx,
    explanationHtml: calibrated.explanation ?? spec.e,
  };
}
