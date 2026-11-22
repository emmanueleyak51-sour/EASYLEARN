import type {
  Beat,
  CheckBeat,
  ExploreBeat,
  InteractiveLesson,
  Question,
  SpotBeat,
  SubjectId,
  Topic,
} from '../types';
import { h53 } from './engine';

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Preserves legitimate scientific, mathematical, and grammatical parentheticals:
 * - Oxidation states & Roman numerals: (I), (II), (III), (IV), (V), (VI), (VII), (0)
 * - Physical states & reagents: (s), (l), (g), (aq), (conc.), (dil.)
 * - Mathematical coordinates, intervals, or function arguments: (1, -4), (x + 2), (n - 1)
 */
function isEssentialParenthetical(innerPlain: string): boolean {
  const t = innerPlain.trim();
  if (!t) return true;
  if (/^(?:0|I|II|III|IV|V|VI|VII|VIII|s|l|g|aq|conc\.?|dil\.?|stp|r\.t\.p\.?)$/i.test(t)) {
    return true;
  }
  if (/^[-+−]?\d/.test(t) && /[,;:]/.test(t)) {
    return true;
  }
  if (/^[a-zA-Z]\s*[,+\-−*/=]/.test(t) && t.length <= 12) {
    return true;
  }
  return false;
}

/**
 * Strips giveaway parenthetical explanations attached ONLY to the correct option,
 * moving the clarifying note into the worked explanation if not already present.
 */
export function stripGiveawayParenthetical(
  options: string[],
  ansIdx: number,
  explanation?: string
): { options: string[]; explanation?: string; stripped: boolean } {
  if (ansIdx < 0 || ansIdx >= options.length) {
    return { options, explanation, stripped: false };
  }

  const rightRaw = options[ansIdx];
  const rightPlain = stripHtml(rightRaw);

  // Match trailing parenthetical at the end of the option
  const rawMatch = rightRaw.match(/^(.*?)\s*\(([^()]{3,})\)\s*([.?!])?\s*$/);
  const plainMatch = rightPlain.match(/^(.*?)\s*\(([^()]{3,})\)\s*([.?!])?\s*$/);
  if (!rawMatch || !plainMatch) {
    return { options, explanation, stripped: false };
  }

  const baseRaw = rawMatch[1].trim();
  const noteRaw = rawMatch[2].trim();
  const trailingPunct = rawMatch[3] || '';
  const basePlain = plainMatch[1].trim();
  const notePlain = plainMatch[2].trim();

  if (!basePlain || isEssentialParenthetical(notePlain)) {
    return { options, explanation, stripped: false };
  }

  // Check if any distractor ALSO carries a descriptive parenthetical (>= 4 chars non-essential)
  const wrongHasDescriptiveParen = options.some((opt, idx) => {
    if (idx === ansIdx) return false;
    const pm = stripHtml(opt).match(/\(([^()]{4,})\)/);
    return pm ? !isEssentialParenthetical(pm[1]) : false;
  });

  if (wrongHasDescriptiveParen) {
    return { options, explanation, stripped: false };
  }

  const nextOptions = [...options];
  nextOptions[ansIdx] = `${baseRaw}${trailingPunct}`;

  let nextExp = explanation;
  if (typeof explanation === 'string' && explanation.length > 0) {
    const expPlain = stripHtml(explanation).toLowerCase();
    const noteProbe = notePlain.slice(0, Math.min(14, notePlain.length)).toLowerCase();
    if (noteProbe && !expPlain.includes(noteProbe)) {
      nextExp = `${explanation.trim()} (${noteRaw})`;
    }
  }

  return { options: nextOptions, explanation: nextExp, stripped: true };
}

function isPureSymbolicOrNumericOption(plain: string): boolean {
  const t = plain.trim();
  if (!t) return true;
  // Pure numbers, units, ratios, coordinates, chemical formulas without prose words, or IPA slashes
  if (/^\/[^/]+\/$/.test(t)) return true;
  // Count alphabetic words of 4+ letters (excluding common units)
  const words = t
    .replace(/\b(?:cm|mm|km|kg|mol|dm|kJ|kPa|atm|Hz|mA|kW|kWh|eV|rad|deg|sin|cos|tan|log|sec|min|hrs?)\b/gi, '')
    .match(/[A-Za-z]{4,}/g);
  if (!words || words.length === 0) return true;
  // Single chemical formula or expression with = and digits
  if (words.length === 1 && /[0-9=×÷±²³⁴⁺⁻→⇌]/.test(t) && t.length <= 20) return true;
  return false;
}

function isNegativeStem(questionPlain: string): boolean {
  return /\b(?:NOT|FALSE|EXCEPT|INCORRECT|UNTRUE|NEVER|NEITHER|WRONG)\b/.test(questionPlain) ||
    /\b(?:not|false|except|incorrect|wrong)\b/i.test(questionPlain) &&
      /\bwhich\b/i.test(questionPlain);
}

type OptionShape = 'infinitive' | 'causal' | 'lowercase' | 'sentence' | 'nounPhrase';

function detectOptionShape(plain: string): OptionShape {
  const t = plain.trim();
  if (/^To\s+[a-z]/i.test(t) && /^To\s/.test(t)) return 'infinitive';
  if (/^(?:Because|Since|As)\s+/i.test(t)) return 'causal';
  if (/^[a-z]/.test(t)) return 'lowercase';
  const hasVerb =
    /\b(?:is|are|was|were|be|been|has|have|had|does|do|did|can|could|will|would|must|should|may|might|increases?|decreases?|remains?|forms?|produces?|gives?|reacts?|moves?|flows?|bends?|sinks?|rises?|boils?|melts?|dissolves?|absorbs?|emits?|conducts?|prevents?|allows?|causes?|occurs?|transfers?|attracts?|repels?|splits?|stays?|turns?|becomes?|contains?|requires?|uses?|makes?|keeps?|loses?|gains?|oxidises?|reduces?|breaks?|passes?|crosses?|cuts?|touches?|lies?|takes?|expresses?|modifies?|qualifies?|shows?|refers?|agrees?|follows?)\b/i.test(
      t
    );
  if (hasVerb || /[.?!]$/.test(t)) return 'sentence';
  return 'nounPhrase';
}

const DOMAIN_TAILS: Partial<Record<
  SubjectId,
  Record<OptionShape, readonly string[]>
>> = {
  phys: {
    infinitive: [
      'at constant ambient pressure',
      'along the narrow capillary bore',
      'before thermal equilibrium settles',
      'without altering internal resistance',
      'before thermal equilibrium is reached across the outer glass wall',
      'when rapid expansion occurs along the narrow capillary bore',
      'so that ambient atmospheric pressure does not alter the zero mark',
      'while keeping the internal resistance of the measuring setup constant',
    ],
    causal: [
      'at constant atmospheric pressure',
      'while net resultant force stays zero',
      'without any phase change of state',
      'while the net external resultant force along the boundary stays zero',
      'whenever the surrounding medium maintains constant atmospheric pressure',
      'across the entire cross-sectional area of the uniform conductor',
    ],
    lowercase: [
      'at constant temperature and mass',
      'across every unit area of contact',
      'along the normal to the boundary',
      'without net displacement of matter',
      'acting uniformly across the entire cross-sectional area of contact',
      'transferred directly through the medium without net displacement of matter',
      'maintained at constant atmospheric pressure and room temperature',
      'independent of the nature or roughness of the surrounding medium',
    ],
    sentence: [
      'at constant atmospheric pressure',
      'across the entire surface of contact',
      'while total momentum stays conserved',
      'under steady thermal equilibrium',
      'when internal resistance stays zero',
      'because atmospheric pressure acts equally on every exposed unit area',
      'when kinetic energy converts directly into internal potential energy',
      'so the resultant upward reaction exceeds the downward gravitational pull',
      'while the total mechanical momentum of the isolated system stays unchanged',
      'whenever the refractive index of the medium decreases with wavelength',
      'because kinetic energy converts directly into internal potential energy at constant temperature',
      'since electric field lines always terminate on bound neutral nuclei inside the uniform conductor',
    ],
    nounPhrase: [
      'per unit cross-sectional area',
      'at constant Kelvin temperature',
      'along the normal to the surface',
      'within the linear elastic limit',
      'acting uniformly per unit cross-sectional area of the body',
      'generated by steady molecular collisions at constant volume',
      'calibrated directly against standard atmospheric pressure at sea level',
      'operating within the linear proportional region of the material',
    ],
  },
  chem: {
    infinitive: [
      'in open atmospheric air',
      'at standard room temperature',
      'before filtration is completed',
      'without changing the mole ratio',
      'so dissolved atmospheric gases do not re-oxidise the fresh product',
      'before volatile water of crystallisation escapes from the vessel',
      'to keep the equilibrium shifted completely toward the gas phase',
      'without altering the stoichiometric mole ratio of the reactants',
    ],
    causal: [
      'at standard temperature and pressure',
      'within a stable valence electron octet',
      'across the period from left to right',
      'while the outer valence shell retains a stable octet of electrons',
      'whenever standard molar volume at room temperature stays constant',
      'so hydration enthalpy exceeds the crystal lattice energy in water',
    ],
    lowercase: [
      'in aqueous neutral solution',
      'at standard temperature and pressure',
      'by upward delivery in open air',
      'across a symmetrical covalent axis',
      'held together by electrostatic attraction between lattice ions',
      'collected by upward delivery over concentrated H₂SO₄ drying agent',
      'accompanied by a steady decrease in oxidation state at the anode',
      'involving equal sharing of electron pairs across a covalent bond',
    ],
    sentence: [
      'at standard room temperature',
      'in open laboratory air currents',
      'under anhydrous neutral conditions',
      'during aqueous anodic discharge',
      'across the same periodic row',
      'because van der Waals forces outweigh ionic attraction in water',
      'when excess protons migrate toward the positive anode in solution',
      'so the activation energy rises above the enthalpy of neutralisation',
      'as atomic radius decreases steadily down the periodic group',
      'while water of crystallisation oxidises the cation on gentle warming',
      'because intermolecular van der Waals forces outweigh covalent bond enthalpy during heating',
      'whereas catalytic hydrogenation saturates every sigma bond without altering molecular mass',
      'while fractional distillation splits covalent C–C bonds without requiring any catalyst bed',
    ],
    nounPhrase: [
      'at standard temperature and pressure',
      'in dilute aqueous acid medium',
      'over fused calcium(II) chloride',
      'across a porous salt bridge cell',
      'prepared by direct thermal decomposition of the hydrated salt',
      'collected over cold water after drying with fused CaCl₂ granules',
      'stabilised by intermolecular van der Waals forces at room temperature',
      'standardised against anhydrous Na₂CO₃ using methyl orange indicator',
    ],
  },
  eng: {
    infinitive: [
      'in casual spoken register',
      'with contracted auxiliary verbs',
      'on the final unstressed suffix',
      'without any formal salutation',
      'while keeping a casual conversational tone with contracted verbs',
      'so the subordinate clause overrides the number of the head noun',
      'by shifting primary stress onto the final inflectional suffix',
    ],
    causal: [
      'in everyday literal word order',
      'by proximity to the nearest noun',
      'whenever a plural prepositional phrase precedes the finite verb',
      'since idiomatic expressions retain the literal sense of each word',
      'so the nearest noun in an appositive phrase controls verb concord',
    ],
    lowercase: [
      'in literal word-for-word sense',
      'by proximity to the nearest noun',
      'with primary stress on the prefix',
      'using informal contracted verbs',
      'governed by the plural noun immediately preceding the finite verb',
      'interpreting every figurative idiom strictly by dictionary sense',
      'placing primary stress on the prefix rather than the root syllable',
      'lifting complete verbatim sentences directly from the passage',
    ],
    sentence: [
      'in literal word-for-word usage',
      'by agreement with the nearest noun',
      'using casual contracted verb forms',
      'on the final unstressed syllable',
      'because the plural noun closest to the verb controls concord',
      'when the expression is taken strictly in its literal word sense',
      'while adopting chatty contractions to engage the target reader',
      'by copying illustrative examples verbatim from the passage',
      'because lifting vivid illustrative sentences verbatim from the passage earns full marks',
      'while adopting conversational contractions and informal greetings throughout the summary',
    ],
    nounPhrase: [
      'in literal dictionary meaning',
      'governed by the nearest plural noun',
      'in casual conversational register',
      'with stress on the final suffix',
      'governed by proximity to the nearest noun in the prepositional phrase',
      'interpreted literally from the everyday meaning of each single word',
      'expressed in conversational register with contracted auxiliary verbs',
      'supported by lifting complete illustrative clauses directly from the original passage',
    ],
  },
  maths: {
    infinitive: [
      'along a solid boundary line',
      'measured anticlockwise from East',
      'using a graduated ruler directly',
      'by measuring equal chord lengths directly along the arc with a ruler',
      'while shading the outer boundary with a solid line through the points',
    ],
    causal: [
      'along the solid boundary line',
      'measured anticlockwise from East',
      'whenever the perpendicular distance from the origin equals the gradient',
      'since every point on a solid boundary satisfies a strict inequality',
    ],
    lowercase: [
      'along a solid boundary line',
      'measured anticlockwise from East',
      'at an acute angle of 45 degrees',
      'through the midpoint of the base',
      'drawn as a solid boundary line that includes the boundary points',
      'measured anticlockwise from the horizontal East axis with a ruler',
      'passing through the midpoint of the chord at an acute 45° angle',
    ],
    sentence: [
      'along a solid boundary line',
      'when measured anticlockwise from East',
      'through the midpoint of the chord',
      'for all boundary points included',
      'because every point on a solid boundary satisfies a strict inequality',
      'when the bearing is measured anticlockwise from the horizontal East',
      'so the locus forms a single straight segment joining the two points',
    ],
    nounPhrase: [
      'along a solid boundary line',
      'measured anticlockwise from East',
      'passing through the chord midpoint',
      'drawn with a solid boundary line including all points on the curve',
      'measured anticlockwise from the positive horizontal axis to the ray',
    ],
  },
  fmaths: {
    infinitive: [
      'without checking the domain restriction',
      'even when the determinant equals zero',
      'by ignoring the inner chain derivative',
      'without reversing the inequality sign on negative division',
      'while treating a divergent geometric ratio above unity as convergent',
    ],
    causal: [
      'even when the matrix determinant vanishes',
      'whenever the common ratio exceeds unity in magnitude',
      'since any non-bijective relation admits a unique inverse function',
      'while the scalar dot product yields a perpendicular vector quantity',
    ],
    lowercase: [
      'even when the determinant is zero',
      'for divergent ratios exceeding unity',
      'without applying the inner chain rule',
      'assuming matrix multiplication commutes for every conformable pair',
      'omitting the constant of integration and absolute-value domain check',
    ],
    sentence: [
      'even when the determinant vanishes',
      'without applying the chain derivative',
      'for all ratios greater than unity',
      'because matrix multiplication is commutative for all square matrices',
      'when the vertical component of projectile velocity stays constant in flight',
      'while mutually exclusive non-zero events remain statistically independent',
    ],
    nounPhrase: [
      'even for singular zero-determinant matrices',
      'without inner chain-rule differentiation',
      'valid across divergent ratios exceeding unity',
      'computed by treating the scalar dot product as a 3D vector',
      'evaluated without splitting definite integrals across x-axis intercepts',
    ],
  },
  bio: {
    infinitive: [
      'across dry dead cellulose walls',
      'at boiling enzyme temperatures',
      'without hydrolysing sucrose first',
      'under bright photosynthetic light',
      'across a boiled non-living membrane after active carrier proteins denature',
      'without extinguishing the naked Bunsen flame before heating ethanol',
      'by counting every shoot touching any outer edge of the quadrat frame',
      'while keeping green leaves illuminated during a respiration limewater test',
    ],
    causal: [
      'across a dead permeable cell wall',
      'above the optimum 40 °C threshold',
      'through open xylem vessel lumina',
      'while boiled tissue membranes retain full selective permeability in water',
      'whenever salivary amylase remains catalytically active at boiling point',
      'since phloem sieve tubes transport mineral salts solely by root pressure',
    ],
    lowercase: [
      'across a dead cellulose cell wall',
      'at boiling temperatures above 70 °C',
      'inside mature anucleate red cells',
      'without expenditure of cellular ATP',
      'moving down a water-potential gradient without any living membrane',
      'catalysed by denatured enzyme active sites above seventy degrees Celsius',
      'transmitted directly to offspring through acquired somatic muscle traits',
      'occurring solely in green chloroplasts during dark anaerobic nights',
    ],
    sentence: [
      'across a boiled cell membrane',
      'above seventy degrees Celsius',
      'without consuming cellular ATP',
      'through dead lignified phloem',
      'in mature enucleated erythrocytes',
      'because cellulose cell walls act as selectively permeable membranes',
      'when sucrose reduces Benedict’s solution directly without acid hydrolysis',
      'so stomatal guard cells open wide when potassium ions diffuse outward',
      'while somatic mutations in body muscles pass directly into gametes',
      'whenever transpiration pull drives sucrose upward through dead phloem',
      'because boiled yam cylinders maintain selective osmotic permeability across denatured membranes',
      'whereas aerobic Kreb’s cycle enzymes operate exclusively inside prokaryotic cytoplasm',
    ],
    nounPhrase: [
      'across dead cellulose cell walls',
      'at temperatures above 75 °C',
      'without prior dilute acid hydrolysis',
      'through hollow companion cells',
      'mediated by passive diffusion of water across a dead cellulose wall',
      'recorded by shading biological drawings heavily with a soft 2B pencil',
      'governed by blending inheritance between heterozygous parental alleles',
      'driven by active stomatal pumping inside dead lignified xylem vessels',
    ],
  },
  econ: {
    infinitive: [
      'even when marginal utility turns negative',
      'under binding price ceilings above equilibrium',
      'without subtracting intermediate flour inputs',
      'while counting transfer pensions in GDP',
      'by shifting the demand curve whenever own price falls in the market',
      'while selling Treasury Bills in open market operations to expand credit',
      'by adding all rejected items on the scale of preference as real cost',
      'assuming perfectly elastic short-run supply of perennial cocoa trees',
    ],
    causal: [
      'when marginal utility exceeds total utility',
      'above the market-clearing equilibrium price',
      'without adjusting for indirect business taxes',
      'while counting old-age transfer pensions inside national factor income',
      'whenever price elasticity of demand exceeds unity on table salt',
      'since debenture creditors bear residual equity risk after ordinary shares',
    ],
    lowercase: [
      'under binding price floors below equilibrium',
      'without deducting capital depreciation',
      'including old-age transfer pensions',
      'when marginal product turns negative',
      'shifting the entire demand schedule whenever own market price changes',
      'measured by summing every unchosen item on the scale of preference',
      'recorded as visible merchandise trade inside the balance of trade',
      'operated inside Stage III where additional workers reduce total output',
    ],
    sentence: [
      'when marginal product is negative',
      'above the market equilibrium price',
      'including transfer pension payments',
      'under unitary demand elasticity',
      'without deducting capital depreciation',
      'because own-price changes shift the entire market demand curve bodily',
      'when the central bank sells Treasury Bills to expand commercial credit',
      'so creditors gain real purchasing power during unanticipated inflation',
      'while invisible shipping services enter the visible balance of trade',
      'whenever opportunity cost equals the sum of all unchosen alternatives',
      'because perfectly competitive firms retain supernormal profit in the long run',
      'whereas regressive poll taxes take a rising percentage from higher incomes',
    ],
    nounPhrase: [
      'including transfer pension payments',
      'above market-clearing equilibrium',
      'without deducting intermediate inputs',
      'under negative marginal productivity',
      'calculated by adding every rejected item on the scale of preference',
      'recorded as visible merchandise exports in the balance of trade',
      'sustained by selling government securities to inject banking reserves',
      'characterized by rising tax percentages on lower-income households',
    ],
  },
  agric: {
    infinitive: [
      'on unlimed waterlogged clay beds',
      'by mixing quicklime directly with ammonium sulphate',
      'without candling fertile eggs during incubation',
      'while grazing ruminant cattle on dry bare fallow',
      'by broadcasting volatile urea on dry soil surfaces without incorporation',
      'while operating tractor disc ploughs straight down steep erodible slopes',
    ],
    causal: [
      'on strongly acidic unlimed subsoil',
      'without quarantine of newly purchased stock',
      'while ammonium salts volatilize on contact with caustic quicklime',
      'whenever mono-gastric poultry attempt to digest woody lignified roughage',
    ],
    lowercase: [
      'on unlimed acidic clay pan',
      'without rhizobial root nodulation',
      'in overcrowded poorly ventilated pens',
      'by continuous monocropping without legume rotation',
      'applying caustic lime simultaneously with ammonium nitrogen fertilizer',
      'harvesting premature tubers before physiological maturity and curing',
    ],
    sentence: [
      'on waterlogged unlimed clay pan',
      'without colostrum intake at birth',
      'in stagnant deoxygenated pond water',
      'because quicklime mixed with ammonium sulphate locks nitrogen in clay',
      'when non-ruminant poultry ferment coarse cellulose inside a four-chamber stomach',
      'while straight-downhill ridging accelerates sheet and gully erosion on slopes',
    ],
    nounPhrase: [
      'on waterlogged acidic clay subsoil',
      'without colostrum immunity at birth',
      'under continuous unfertilized monocropping',
      'formulated without balancing crude protein via a Pearson Square ratio',
      'stored at high grain moisture above twenty percent in sealed bins',
    ],
  },
  geog: {
    infinitive: [
      'by subtracting local time eastward of Greenwich',
      'along a convex slope blocking intervisibility',
      'across crystalline basement rocks devoid of fossils',
      'while reducing a map scale by multiplying the denominator by half',
      'under dusty Tropical Continental Harmattan winds from the Atlantic',
    ],
    causal: [
      'when local time is subtracted for longitudes east of Greenwich',
      'because crystalline plutonic granite contains stratified marine oil seams',
      'whenever V-shaped contour lines point downhill along a river valley',
      'while doubling the representative fraction denominator enlarges the map',
    ],
    lowercase: [
      'by subtracting four minutes per degree east',
      'inside non-fossiliferous plutonic granite strata',
      'under moist Harmattan winds from the South Atlantic',
      'pointing contour V-patterns downhill across river valleys',
      'halving the grid-square area whenever linear map scale doubles',
    ],
    sentence: [
      'when local time decreases eastward',
      'inside plutonic crystalline granite',
      'along convex slopes with full sightlines',
      'because crossing the International Date Line westward repeats the same date',
      'when cold subtropical ocean currents bathe eastern continental margins',
      'while Tropical Rainforest ferralsols retain unleached nitrates after clearing',
    ],
    nounPhrase: [
      'with local time subtracted eastward of GMT',
      'hosted inside non-stratified plutonic granite',
      'governed by moist Harmattan winds off the Gulf of Guinea',
      'calculated by dividing vertical interval in metres by map centimetres',
      'associated with cold ocean currents along equatorial east coasts',
    ],
  },
  civic: {
    infinitive: [
      'by unilateral executive decree without legislative assent',
      'through non-justiciable Chapter II directive objectives alone',
      'without independent judicial review or due constitutional process',
      'under centralized unitary delegation from the national capital',
      'by merging the executive cabinet into the national judicial bench',
    ],
    causal: [
      'without legislative oversight or judicial review',
      'because Chapter II directive objectives are directly enforceable in court',
      'whenever executive immunity shields private commercial contracts permanently',
      'while citizenship by birth can be revoked by ordinary ministerial order',
    ],
    lowercase: [
      'without constitutional due process',
      'under unilateral executive decree',
      'outside independent judicial review',
      'by treating non-justiciable Chapter II objectives as courtroom rights',
      'granting absolute immunity to legislators during criminal trials',
    ],
    sentence: [
      'without legislative confirmation',
      'outside constitutional due process',
      'under unilateral executive decree',
      'because Chapter II socio-economic objectives carry direct courtroom remedies',
      'when the electoral commission prosecutes corruption suspects in criminal court',
      'while residual legislative powers belong exclusively to local councils',
    ],
    nounPhrase: [
      'without constitutional due process',
      'under unilateral executive decree',
      'enforced directly under non-justiciable Chapter II directive principles',
      'vested exclusively in appointed administrative tribunals without appeal',
      'exempt from constitutional supremacy and judicial review',
    ],
  },
  digitech: {
    infinitive: [
      'inside volatile SRAM registers after power-off',
      'by routing raw frames across Layer-1 passive hubs',
      'without translating high-level source code into machine opcode',
      'while decrypting ciphertext with the sender’s public key alone',
      'by storing negative integers in unsigned pure binary magnitude',
    ],
    causal: [
      'because volatile RAM retains instructions permanently without power',
      'whenever a passive Layer-1 hub filters packets by IPv4 subnet mask',
      'while an interpreter outputs a standalone native executable binary',
      'since OR logic gates output LOW whenever both inputs are HIGH',
    ],
    lowercase: [
      'stored permanently in volatile DRAM after shutdown',
      'broadcast blindly across a passive Layer-1 repeater hub',
      'using symmetric plaintext keys over unencrypted HTTP',
      'inverting two’s complement bits without adding one to the LSB',
      'measuring network bandwidth in megabytes instead of megabits per second',
    ],
    sentence: [
      'inside volatile cache memory without power',
      'across passive Layer-1 repeater hubs',
      'over unencrypted port-80 HTTP sessions',
      'because ROM loses its bootstrap firmware whenever power is switched off',
      'when a NAND gate outputs logic 1 when all inputs are simultaneously 1',
      'while dividing pixel count by 1,000 instead of 8 bits per byte',
    ],
    nounPhrase: [
      'retained permanently inside volatile DRAM chips',
      'forwarded by Layer-1 hubs using MAC address tables',
      'computed by one’s complement inversion without adding unity',
      'transmitted in cleartext without TLS handshake encryption',
      'addressed directly via 32-bit IPv6 hexadecimal octets',
    ],
  },
  dataproc: {
    infinitive: [
      'inside unnormalized repeating groups with duplicate keys',
      'by filtering grouped aggregates inside a SQL WHERE clause',
      'without enforcing foreign-key referential integrity constraints',
      'using relative cell references that shift during fill-down copy',
      'by sequential tape traversal to locate random-access records',
    ],
    causal: [
      'because primary keys accept duplicate and NULL identifier values',
      'whenever transitive non-key dependencies remain inside Second Normal Form',
      'while data verification checks range rules without comparing source forms',
      'since sequential magnetic tape supports instant direct block addressing',
    ],
    lowercase: [
      'allowing NULL entries inside a relational primary key',
      'retaining partial key dependencies in Second Normal Form',
      'filtering SQL aggregate totals inside a WHERE clause',
      'storing unindexed master files only on sequential magnetic tape',
      'confusing double-entry verification with automated range validation',
    ],
    sentence: [
      'with NULL values in the primary key',
      'using WHERE to filter SQL aggregates',
      'inside unnormalized flat-file spreadsheets',
      'because Second Normal Form permits partial dependencies on composite keys',
      'when relative spreadsheet formulas stay fixed across copied rows without dollar signs',
      'while differential backups clear the archive bit like incremental backups',
    ],
    nounPhrase: [
      'containing repeating multi-valued attributes in 1NF',
      'filtered by aggregate functions inside a SQL WHERE clause',
      'indexed solely through sequential magnetic tape blocks',
      'validated by human proofreading rather than programmatic rules',
      'linked without foreign-key referential integrity enforcement',
    ],
  },
};

const NEGATIVE_STEM_TAILS: Partial<Record<SubjectId, Record<OptionShape, readonly string[]>>> = {
  phys: {
    infinitive: [
      'at standard room temperature',
      'within the calibrated scale range',
      'during standard laboratory measurements at room temperature',
      'within the normal operating range of the calibrated instrument',
    ],
    causal: [
      'under standard laboratory conditions',
      'under standard terrestrial gravitational and atmospheric conditions',
    ],
    lowercase: [
      'under normal laboratory conditions',
      'within a closed physical system',
      'under normal laboratory conditions of temperature and pressure',
      'between the interacting bodies within the closed physical system',
    ],
    sentence: [
      'under normal laboratory conditions',
      'across repeated calibrated trials',
      'whenever the two surfaces interact under normal laboratory conditions',
      'within the standard operating range studied in mechanics and optics',
    ],
    nounPhrase: [
      'in standard physical measurements',
      'based on experimental physics laws',
      'applied in quantitative scientific and industrial operations',
      'grounded in experimental physical principles and laboratory analysis',
    ],
  },
  chem: {
    infinitive: [
      'under standard lab conditions',
      'in quantitative chemical analysis',
      'during standard quantitative and qualitative laboratory procedures',
      'under normal laboratory conditions of temperature and pressure',
    ],
    causal: [
      'by standard stoichiometric rules',
      'in accordance with standard chemical stoichiometry and bonding rules',
    ],
    lowercase: [
      'under standard lab conditions',
      'in routine analytical testing',
      'under standard laboratory conditions of temperature and pressure',
      'during routine chemical synthesis and analytical testing',
    ],
    sentence: [
      'under standard lab conditions',
      'by established chemical laws',
      'under standard laboratory conditions of temperature and pressure',
      'in accordance with established laws of chemical combination',
    ],
    nounPhrase: [
      'in quantitative chemical testing',
      'grounded in chemical stoichiometry',
      'relying on quantitative chemical formulation and laboratory testing',
      'involving systematic analysis of matter, reagents, and reactions',
    ],
  },
  eng: {
    infinitive: [
      'in standard formal English',
      'in standard formal written and spoken English usage',
    ],
    causal: [
      'by formal grammatical rules',
      'according to standard English grammatical and lexical conventions',
    ],
    lowercase: [
      'in standard formal English',
      'in formal academic prose',
      'in standard formal written and spoken English communication',
      'within well-formed grammatical clauses in formal prose',
    ],
    sentence: [
      'in standard formal English',
      'in formal academic writing',
      'in standard formal English grammar and examination usage',
      'across well-structured sentences in formal academic writing',
    ],
    nounPhrase: [
      'in formal English composition',
      'in standard examination usage',
      'used consistently in standard formal English composition',
      'recognised in standard British and West African examination usage',
    ],
  },
  maths: {
    infinitive: [
      'by standard Euclidean rules',
      'using standard Euclidean compass-and-straightedge construction rules',
    ],
    causal: [
      'across all defined real values',
      'for all real values within the defined domain of the relation',
    ],
    lowercase: [
      'for all valid domain values',
      'by standard Euclidean theorems',
      'for every valid value within the defined domain of the problem',
      'under standard Euclidean geometric and algebraic properties',
    ],
    sentence: [
      'across the stated real domain',
      'by standard geometric theorems',
      'for all real values within the stated domain of the expression',
      'under standard geometric and algebraic theorems',
    ],
    nounPhrase: [
      'over the defined real domain',
      'by standard geometric theorems',
      'defined across real numbers under standard algebraic operations',
      'satisfying standard Euclidean geometric theorems and properties',
    ],
  },
  fmaths: {
    infinitive: [
      'over the valid real domain',
      'under standard calculus and vector algebra axioms',
    ],
    causal: [
      'across all defined domain values',
      'for every non-singular transformation over the real or complex field',
    ],
    lowercase: [
      'over the valid real domain',
      'by standard calculus theorems',
      'across smooth differentiable functions on a closed interval',
      'under standard vector, matrix, and Newtonian mechanics laws',
    ],
    sentence: [
      'over the valid real domain',
      'by standard analytical theorems',
      'for all smooth functions defined over the stated interval',
      'under standard vector, calculus, and probability axioms',
    ],
    nounPhrase: [
      'over the stated real domain',
      'in analytical mathematics',
      'derived rigorously from first-principles calculus and linear algebra',
      'consistent with Newtonian mechanics and probability axioms',
    ],
  },
  bio: {
    infinitive: [
      'in healthy living cells',
      'under physiological conditions',
      'within healthy living organisms at normal physiological temperature',
      'during standard biological specimen observation and laboratory assay work',
    ],
    causal: [
      'under normal physiological conditions',
      'within living cells maintaining normal homeostatic balance',
    ],
    lowercase: [
      'in living eukaryotic cells',
      'under normal homeostatic balance',
      'within healthy living tissues at optimum physiological temperature',
      'across intact selectively permeable plasma membranes in living cells',
    ],
    sentence: [
      'in healthy living organisms',
      'at optimum physiological pH',
      'within intact living cells under normal physiological conditions',
      'during normal metabolic activity in healthy plant and animal tissues',
    ],
    nounPhrase: [
      'in intact living organisms',
      'at physiological temperature',
      'observed in healthy living tissues under physiological conditions',
      'essential for cellular metabolism, growth, and homeostatic regulation',
    ],
  },
  econ: {
    infinitive: [
      'under ceteris paribus market conditions',
      'within a competitive market economy',
      'under standard ceteris paribus assumptions in competitive markets',
      'across rational households and profit-maximizing enterprises',
    ],
    causal: [
      'under ceteris paribus assumptions',
      'holding all other market determinants constant in the short run',
    ],
    lowercase: [
      'under ceteris paribus conditions',
      'in open competitive markets',
      'holding other non-price market determinants constant over time',
      'across rational consumers and producers in a market economy',
    ],
    sentence: [
      'under ceteris paribus conditions',
      'in standard economic analysis',
      'holding all other economic determinants constant in the market',
      'within standard microeconomic and macroeconomic equilibrium analysis',
    ],
    nounPhrase: [
      'in standard economic analysis',
      'under ceteris paribus rules',
      'applied across household, firm, and national economic decisions',
      'grounded in established microeconomic and macroeconomic principles',
    ],
  },
  agric: {
    infinitive: [
      'under sound agronomic management',
      'on well-drained fertile loamy soil',
      'under recommended agronomic and livestock husbandry practices',
      'across well-managed commercial crop and livestock enterprises',
    ],
    causal: [
      'under recommended farm management',
      'within balanced soil-plant-animal production systems',
    ],
    lowercase: [
      'on fertile well-aerated loam',
      'under sound farm husbandry',
      'within integrated crop, soil, and livestock farm systems',
      'under recommended tropical agronomic and veterinary standards',
    ],
    sentence: [
      'under sound agronomic practice',
      'in modern commercial farming',
      'across well-managed tropical crop and livestock farm holdings',
      'within sustainable soil conservation and animal husbandry programs',
    ],
    nounPhrase: [
      'in sustainable farm management',
      'on well-aerated loamy topsoil',
      'practised across productive tropical crop and livestock farms',
      'grounded in scientific agronomy, soil stewardship, and animal nutrition',
    ],
  },
  geog: {
    infinitive: [
      'on standard 1:50,000 topographical sheets',
      'under standard cartographic and meteorological conventions',
    ],
    causal: [
      'under normal atmospheric and geomorphic processes',
      'in accordance with standard cartographic and climatic principles',
    ],
    lowercase: [
      'on standard topographical maps',
      'across tropical West African zones',
      'under established physical and human geographical principles',
      'in standard topographical surveying and regional analysis',
    ],
    sentence: [
      'on standard topographical sheets',
      'in regional geographical analysis',
      'across tropical and temperate geomorphic environments',
      'in accordance with established physical and human geography laws',
    ],
    nounPhrase: [
      'on standard topographical maps',
      'in physical and human geography',
      'observed across West African and global geographical regions',
      'documented in standard cartographic, climatic, and regional surveys',
    ],
  },
  civic: {
    infinitive: [
      'under the 1999 Constitution',
      'within a constitutional democracy',
      'in accordance with constitutional supremacy and the rule of law',
      'within a democratic federation governed by separation of powers',
    ],
    causal: [
      'under constitutional rule of law',
      'in accordance with constitutional due process and fundamental rights',
    ],
    lowercase: [
      'under constitutional due process',
      'in a constitutional democracy',
      'within a democratic system of checks and balances',
      'in accordance with the rule of law and fundamental human rights',
    ],
    sentence: [
      'under the 1999 Constitution',
      'in a constitutional democracy',
      'in accordance with constitutional supremacy and due process of law',
      'across democratic institutions bound by checks and balances',
    ],
    nounPhrase: [
      'in a constitutional democracy',
      'under the rule of law',
      'recognised under the 1999 Constitution of the Federal Republic',
      'essential for democratic accountability, civic order, and human dignity',
    ],
  },
  digitech: {
    infinitive: [
      'in standard digital computer architecture',
      'across modern TCP/IP networks and digital logic systems',
    ],
    causal: [
      'under standard IEEE and von Neumann architecture principles',
      'in accordance with Boolean algebra and network protocol standards',
    ],
    lowercase: [
      'in modern digital computing systems',
      'across standard TCP/IP network layers',
      'under established von Neumann architecture and Boolean logic rules',
      'in standard software engineering and cybersecurity practice',
    ],
    sentence: [
      'in modern digital computer systems',
      'under standard network protocols',
      'in accordance with established Boolean logic and architecture rules',
      'across secure networked hardware and operating system environments',
    ],
    nounPhrase: [
      'in digital systems engineering',
      'under standard computing protocols',
      'applied across modern processors, networks, and software systems',
      'grounded in binary representation, logic design, and cybersecurity principles',
    ],
  },
  dataproc: {
    infinitive: [
      'in relational database management systems',
      'under standard ACID transaction and normalization rules',
    ],
    causal: [
      'under relational integrity and normalization standards',
      'in accordance with structured query and data validation principles',
    ],
    lowercase: [
      'in normalized relational databases',
      'under standard data integrity rules',
      'within structured enterprise database and spreadsheet workflows',
      'in accordance with entity-relationship and SQL query standards',
    ],
    sentence: [
      'in relational database systems',
      'under standard normalization rules',
      'in accordance with referential integrity and data governance standards',
      'across structured information processing and database environments',
    ],
    nounPhrase: [
      'in relational database design',
      'under standard data processing rules',
      'applied across normalized tables, SQL queries, and information systems',
      'grounded in relational algebra, file organization, and data integrity',
    ],
  },
};

function appendDistractorTail(rawOpt: string, tail: string, shape: OptionShape): string {
  const trimmed = rawOpt.trim();
  const punctMatch = trimmed.match(/^(.*?)([.?!])$/);
  const core = punctMatch ? punctMatch[1].trim() : trimmed;
  const punct = punctMatch ? punctMatch[2] : '';

  // Avoid duplicate connector words
  const lowerCore = stripHtml(core).toLowerCase();
  const lowerTail = tail.toLowerCase();
  if (
    (lowerCore.includes(' because ') && lowerTail.startsWith('because ')) ||
    (lowerCore.includes(' when ') && lowerTail.startsWith('when ')) ||
    (lowerCore.includes(' while ') && lowerTail.startsWith('while '))
  ) {
    const altTail = tail.replace(/^(?:because|when|while|since|as)\s+/i, 'whereby ');
    return `${core} ${altTail}${punct}`;
  }

  if (shape === 'nounPhrase' || shape === 'lowercase' || shape === 'infinitive' || shape === 'causal') {
    return `${core} ${tail}${punct}`;
  }
  return `${core} ${tail}${punct}`;
}

/**
 * Calibrates a 4-option MCQ so that:
 * 1. Giveaway parentheticals on the correct answer are stripped (and preserved in explanation).
 * 2. Distractors on prose/conceptual questions match the correct answer's length band closely
 *    using plausible domain misconception traps — eliminating both "pick the longest option"
 *    and "avoid over-padded distractors" guessing tells.
 */
export function calibrateQuestionItem(
  subj: SubjectId,
  seedKey: string,
  questionHtml: string,
  options: string[],
  ansIdx: number,
  explanation?: string
): { options: string[]; explanation?: string } {
  if (!Array.isArray(options) || options.length < 2 || ansIdx < 0 || ansIdx >= options.length) {
    return { options, explanation };
  }

  // Step 1: Strip parenthetical giveaway tells on the right answer
  const step1 = stripGiveawayParenthetical(options, ansIdx, explanation);
  const nextOpts = [...step1.options];
  const nextExp = step1.explanation;

  const plains = nextOpts.map(stripHtml);
  const rightPlain = plains[ansIdx] || '';
  const rightLen = rightPlain.length;

  // Do not pad pure numeric, algebraic, chemical-formula, or IPA symbol options
  if (rightLen < 22 || isPureSymbolicOrNumericOption(rightPlain)) {
    return { options: nextOpts, explanation: nextExp };
  }

  const wrongIndices = nextOpts
    .map((_, idx) => idx)
    .filter((idx) => idx !== ansIdx && !isPureSymbolicOrNumericOption(plains[idx]));

  if (wrongIndices.length === 0) {
    return { options: nextOpts, explanation: nextExp };
  }

  const maxWrongLen = Math.max(...wrongIndices.map((idx) => plains[idx].length));
  const minWrongLen = Math.min(...wrongIndices.map((idx) => plains[idx].length));
  const seed = h53(`${subj}|${seedKey}|${rightPlain}`);

  // Target: when right is longest (or tied), ~80% of the time make 1 distractor slightly longer
  // than right (by ~3-16 chars), and bring any noticeably short distractors (<78% of rightLen) up
  // into the same tight length band without ever over-ballooning past ~1.35x rightLen.
  const rightIsLongest = rightLen >= maxWrongLen;
  const hasBigGap = rightLen - minWrongLen >= Math.max(12, Math.round(rightLen * 0.24));
  const shouldOutlengthRight = rightIsLongest && (rightLen - maxWrongLen >= 10 || seed % 100 < 80);

  if (!shouldOutlengthRight && !hasBigGap) {
    return { options: nextOpts, explanation: nextExp };
  }

  const qPlain = stripHtml(questionHtml);
  const negStem = isNegativeStem(qPlain);
  const bankByShape =
    (negStem ? NEGATIVE_STEM_TAILS[subj] : DOMAIN_TAILS[subj]) ||
    (negStem ? NEGATIVE_STEM_TAILS.eng! : DOMAIN_TAILS.eng!);

  // For rank 0 (outlength candidate), pick a distractor that can surpass rightLen cleanly without ballooning;
  // sort shortest-first so shorter distractors get enriched first and already-balanced ones stay concise.
  const orderedWrong = [...wrongIndices].sort((i, j) => {
    const diff = plains[i].length - plains[j].length;
    return diff !== 0 ? diff : ((seed + i * 7) % 5) - ((seed + j * 7) % 5);
  });

  const maxAllowedTotalLen = Math.max(rightLen + 26, Math.round(rightLen * 1.42));
  const usedTails = new Set<number>();
  let hasSurpassedRight = maxWrongLen > rightLen;

  orderedWrong.forEach((wIdx, rank) => {
    const curPlain = stripHtml(nextOpts[wIdx]);
    const curLen = curPlain.length;
    const deficit = rightLen - curLen;

    const wantsToSurpass = shouldOutlengthRight && !hasSurpassedRight && deficit >= 0;
    const trailsBadly = deficit >= 16 || (curLen < Math.round(rightLen * 0.76) && deficit >= 11);

    if (!wantsToSurpass && !trailsBadly) return;

    const shape = detectOptionShape(curPlain);
    const pool = bankByShape[shape] || bankByShape.sentence;
    if (!pool || pool.length === 0) return;

    // Target length: if surpassing right, aim for rightLen + 6; otherwise aim for rightLen - 2
    const targetTotalLen = wantsToSurpass ? rightLen + 6 : Math.max(curLen + 14, rightLen - 2);
    const startOffset = (seed + wIdx * 13 + rank * 5) % pool.length;

    let chosenIdx = -1;
    let bestScore = Infinity;

    for (let p = 0; p < pool.length; p++) {
      const idx = (startOffset + p) % pool.length;
      if (usedTails.has(idx) && usedTails.size < pool.length) continue;
      const newLen = curLen + 1 + pool[idx].length;
      if (newLen > maxAllowedTotalLen) continue;
      if (wantsToSurpass && newLen <= rightLen) continue;

      const dist = Math.abs(newLen - targetTotalLen);
      if (dist < bestScore) {
        bestScore = dist;
        chosenIdx = idx;
      }
    }

    // Fallback when pool tails either fall just below rightLen or exceed maxAllowedTotalLen:
    // pick whichever valid tail brings newLen closest to rightLen without over-ballooning
    if (chosenIdx === -1 && (wantsToSurpass || trailsBadly)) {
      for (let p = 0; p < pool.length; p++) {
        const idx = (startOffset + p) % pool.length;
        if (usedTails.has(idx) && usedTails.size < pool.length) continue;
        const newLen = curLen + 1 + pool[idx].length;
        if (newLen > maxAllowedTotalLen && rightLen - curLen < 20) continue;
        const dist = Math.abs(newLen - rightLen);
        if (dist < bestScore) {
          bestScore = dist;
          chosenIdx = idx;
        }
      }
    }

    if (chosenIdx === -1) return;

    usedTails.add(chosenIdx);
    const chosenTail = pool[chosenIdx];
    nextOpts[wIdx] = appendDistractorTail(nextOpts[wIdx], chosenTail, shape);
    if (stripHtml(nextOpts[wIdx]).length > rightLen) {
      hasSurpassedRight = true;
    }
  });

  return { options: nextOpts, explanation: nextExp };
}

export function calibrateSubjectCurriculum(
  subj: SubjectId,
  topics: Topic[],
  il: Record<string, InteractiveLesson>
): { topics: Topic[]; il: Record<string, InteractiveLesson> } {
  const calibratedTopics: Topic[] = topics.map((topic) => {
    const calibratedQs: Omit<Question, 'id' | 't'>[] = topic.qs.map((q, qIdx) => {
      const res = calibrateQuestionItem(subj, `${topic.id}|q|${qIdx}`, q.q, q.o, q.a, q.e);
      return {
        ...q,
        o: res.options,
        e: res.explanation ?? q.e,
      };
    });

    const calibratedParts = topic.parts.map((part, pIdx) => {
      if (!part.tryit) return part;
      const ans = part.tryit.a ?? 0;
      const res = calibrateQuestionItem(
        subj,
        `${topic.id}|tryit|${pIdx}`,
        `${part.tryit.q} ${part.tryit.ask || ''}`,
        part.tryit.o,
        ans,
        part.tryit.e
      );
      return {
        ...part,
        tryit: {
          ...part.tryit,
          o: res.options,
          e: res.explanation ?? part.tryit.e,
        },
      };
    });

    return {
      ...topic,
      qs: calibratedQs,
      parts: calibratedParts,
    };
  });

  const calibratedIl: Record<string, InteractiveLesson> = {};
  for (const [tid, lesson] of Object.entries(il)) {
    calibratedIl[tid] = {
      ...lesson,
      parts: lesson.parts.map((lp, lpIdx) => ({
        ...lp,
        beats: lp.beats.map((beat: Beat, bIdx: number): Beat => {
          if (beat.k === 'check') {
            const cb = beat as CheckBeat;
            const ans = cb.a ?? 0;
            const res = calibrateQuestionItem(
              subj,
              `${tid}|check|${lpIdx}|${bIdx}`,
              `${cb.q} ${cb.ask || ''}`,
              cb.o,
              ans,
              cb.fb?.[ans]
            );
            const nextFb = [...cb.fb];
            if (res.explanation && ans >= 0 && ans < nextFb.length) {
              nextFb[ans] = res.explanation;
            }
            return {
              ...cb,
              o: res.options,
              fb: nextFb,
            };
          }
          if (beat.k === 'spot') {
            const sb = beat as SpotBeat;
            const ans = sb.a ?? 0;
            const res = calibrateQuestionItem(
              subj,
              `${tid}|spot|${lpIdx}|${bIdx}`,
              sb.q,
              sb.o,
              ans,
              sb.fix
            );
            return {
              ...sb,
              o: res.options,
              fix: res.explanation ?? sb.fix,
            };
          }
          if (beat.k === 'explore' && (beat as ExploreBeat).predict) {
            const eb = beat as ExploreBeat;
            const pred = eb.predict!;
            const ans = pred.a ?? 0;
            const res = calibrateQuestionItem(
              subj,
              `${tid}|predict|${lpIdx}|${bIdx}`,
              pred.q,
              pred.o,
              ans,
              pred.fb?.[ans]
            );
            const nextFb = [...pred.fb];
            if (res.explanation && ans >= 0 && ans < nextFb.length) {
              nextFb[ans] = res.explanation;
            }
            return {
              ...eb,
              predict: {
                ...pred,
                o: res.options,
                fb: nextFb,
              },
            };
          }
          return beat;
        }),
      })),
    };
  }

  return { topics: calibratedTopics, il: calibratedIl };
}
