import type { Beat, IdeaBeat, InteractiveLesson, TeachBeat, TeachBlock, Topic } from '../types';
import { perm } from '../utils/engine';
import { BIO_TOPICS_PART1 } from './bioTopicsPart1';
import { BIO_TOPICS_PART2 } from './bioTopicsPart2';
import { BIO_TOPICS_PART3 } from './bioTopicsPart3';

export const BIO_TEACH_TABLES: Record<string, { title: string; headers: string[]; rows: string[][] }> = {
  'b-org': {
    title: 'Whittaker’s Five Kingdoms & Organization Levels',
    headers: ['Kingdom / Group', 'Cell Type & Wall', 'Nutrition & Classic Exam Examples'],
    rows: [
      ['Monera (Prokaryotae)', 'Prokaryotic (no nuclear membrane); peptidoglycan wall', 'Autotrophic / saprophytic — Bacteria, Nostoc (blue-green algae)'],
      ['Protista', 'Unicellular eukaryotic; pellicle / cellulose / none', 'Holozoic (Amoeba), mixotrophic (Euglena), Chlamydomonas'],
      ['Fungi', 'Eukaryotic hyphae; CHITIN cell wall (no chlorophyll)', 'Saprophytic / parasitic — Mucor, Rhizopus, Yeast, Mushroom'],
      ['Plantae & Animalia', 'Eukaryotic multicellular (cellulose wall vs no wall)', 'Photosynthetic autotrophs vs holozoic heterotrophs'],
    ],
  },
  'b-cell': {
    title: 'Plant Cell vs Animal Cell & Organelle Functions',
    headers: ['Organelle / Feature', 'Plant Cell', 'Animal Cell & Core Function'],
    rows: [
      ['Cell Wall & Plastids', 'Rigid cellulose wall + chloroplasts present', 'Absent — bounded only by flexible plasma membrane'],
      ['Vacuole & Centrioles', 'Single large central sap vacuole; no centrioles', 'Small temporary vacuoles; centrioles form spindle fibres'],
      ['Mitochondria & Ribosomes', 'Present in both', 'Mitochondria = aerobic ATP cristae; 80S ribosomes = protein synthesis'],
      ['Reserve Carbohydrate', 'Stored as insoluble STARCH grains', 'Stored as GLYCOGEN granules in liver and muscle'],
    ],
  },
  'b-transport-cell': {
    title: 'Diffusion, Osmosis & Active Transport Matrix',
    headers: ['Process', 'Gradient & Membrane Requirement', 'ATP Needed? & Red Blood Cell / Plant Fate'],
    rows: [
      ['Diffusion', 'High → Low concentration; membrane NOT essential', 'Passive (No ATP) — O₂/CO₂ across alveoli & stomata'],
      ['Osmosis', 'High water potential → Low across selectively permeable membrane', 'Passive (No ATP) — Hypotonic: RBC haemolyses, plant cell turgid'],
      ['Hypertonic Effect', 'Water leaves cell by exosmosis', 'RBC crenates (shrinks); plant cell undergoes PLASMOLYSIS'],
      ['Active Transport', 'Low → High concentration AGAINST gradient via carrier proteins', 'Requires ATP & O₂ — Mineral ion uptake in root hairs, Na⁺/K⁺ pump'],
    ],
  },
  'b-nutrition': {
    title: 'WAEC & JAMB Biochemical Food Test Reagents',
    headers: ['Food Substance', 'Reagent & Procedure', 'Positive Colour Observation'],
    rows: [
      ['Starch', 'Add 2–3 drops of Iodine solution at room temperature', 'Blue-black colouration'],
      ['Reducing Sugar (Glucose)', 'Add Benedict’s or Fehling’s A+B and boil in water bath', 'Blue → green → yellow → BRICK-RED precipitate'],
      ['Non-Reducing Sugar (Sucrose)', 'Boil with dilute HCl, neutralize with NaOH, then Benedict’s', 'Brick-red precipitate (only AFTER acid hydrolysis)'],
      ['Protein & Lipid', 'Biuret (NaOH + CuSO₄) · Million’s · Sudan III', 'Biuret = Purple/Violet · Million’s = Brick-red · Sudan III = Red oil ring'],
    ],
  },
  'b-respiration': {
    title: 'Aerobic Respiration vs Anaerobic Fermentation',
    headers: ['Feature', 'Aerobic Respiration', 'Anaerobic (Yeast vs Muscle)'],
    rows: [
      ['Site in Cell', 'Glycolysis in cytoplasm → Krebs & ETC in mitochondria', 'Entirely in CYTOPLASM (no O₂ required)'],
      ['End Products', 'CO₂ + H₂O (complete oxidation of glucose)', 'Plants/Yeast: Ethanol + CO₂ · Muscle: Lactic acid ONLY (no CO₂)'],
      ['Net ATP Yield per Glucose', '38 ATP (high energy efficiency)', '2 ATP only (incomplete breakdown)'],
      ['Respiratory Quotient (RQ)', 'RQ = CO₂ evolved ÷ O₂ absorbed = 1.0 (glucose)', 'Fats ≈ 0.7 · Proteins ≈ 0.8–0.9 · Anaerobic → ∞'],
    ],
  },
  'b-excretion-growth': {
    title: 'Excretory Structures Across Organisms & Plant Tropisms',
    headers: ['Organism / System', 'Excretory Organ / Growth Hormone', 'Main Waste / Growth Response'],
    rows: [
      ['Amoeba / Planaria / Earthworm', 'Contractile vacuole · Flame cells · Nephridia', 'Excess water, CO₂, ammonia & urea'],
      ['Insects (Cockroach)', 'Malpighian tubules', 'Uric acid crystals (conserves water on land)'],
      ['Flowering Plants', 'Stomata, lenticels, bark tannins, gums, alkaloids', 'No specialized excretory organs; wastes stored or diffused'],
      ['Auxin (IAA) Distribution', 'accumulates on shaded / lower side', 'ACCELERATES shoot elongation (+phototropic) · INHIBITS root elongation (+geotropic)'],
    ],
  },
  'b-skeleton': {
    title: 'Vertebral Column Regions & Plant Supporting Tissues',
    headers: ['Structure', 'Distinguishing Anatomical Feature', 'Primary Mechanical Role'],
    rows: [
      ['Atlas (C1) & Axis (C2)', 'Atlas: large neural canal, NO centrum · Axis: odontoid peg', 'Atlas = nodding ("yes") · Axis = shaking/pivoting ("no")'],
      ['Thoracic & Lumbar', 'Thoracic: long neural spine + rib facets · Lumbar: massive centrum', 'Rib-cage articulation vs bearing heavy lower-trunk weight'],
      ['Synovial Joints', 'Ball-and-socket (hip/shoulder: 3 planes) · Hinge (elbow/knee: 1 plane)', 'Ligaments join Bone-to-Bone · Tendons join Muscle-to-Bone'],
      ['Plant Support Tissues', 'Turgid parenchyma · Collenchyma (living) · Sclerenchyma/Xylem (dead lignin)', 'Flexible support in young stems vs rigid woody strength'],
    ],
  },
  'b-ecol-concepts': {
    title: 'Nigerian Vegetation Belts (South → North Rainfall Gradient)',
    headers: ['Biome / Belt', 'Annual Rainfall & Climate', 'Characteristic Flora & Adaptations'],
    rows: [
      ['Mangrove Swamp (Delta/Lagos)', 'Heavy > 2500 mm; brackish tidal mud', 'Red/white mangroves (Rhizophora, Avicennia) with breathing PNEUMATOPHORES & stilt roots'],
      ['Tropical Rainforest', '2000–2500 mm; high humidity', 'Stratified 5 storeys, buttress roots, broad evergreen drip-tip leaves, epiphytes (iroko, mahogany)'],
      ['Guinea Savanna (Largest belt)', '1000–1500 mm; distinct wet & dry seasons', 'Tall elephant grass + fire-resistant thick-barked deciduous trees (locust bean, shea butter)'],
      ['Sudan & Sahel Savanna', 'Sudan: 500–1000 mm · Sahel (Borno): < 500 mm', 'Short feathery grasses; thorny drought-hardy acacias & baobab (succulent trunk)'],
    ],
  },
  'b-trophic': {
    title: 'Ecological Pyramids & Nitrogen Cycle Bacteria',
    headers: ['Concept / Bacterium', 'Role / Conversion', 'Exam Rule / Exception'],
    rows: [
      ['10% Energy Law (Lindeman)', 'Producers → Herbivores → Carnivores', 'Pyramid of ENERGY is NEVER inverted; ~90% lost as heat/respiration per step'],
      ['Pyramid of Numbers / Biomass', 'Count or dry mass per trophic level', 'Numbers inverted when 1 iroko tree feeds 1000 caterpillars + parasites'],
      ['Rhizobium & Azotobacter', 'Atmospheric N₂ → Ammonium / organic N', 'Rhizobium = symbiotic in legume root nodules · Azotobacter = free-living aerobic'],
      ['Nitrosomonas → Nitrobacter', 'NH₄⁺ → Nitrite (NO₂⁻) → Nitrate (NO₃⁻)', 'Pseudomonas denitrificans reverses NO₃⁻ → N₂ in waterlogged anaerobic soil'],
    ],
  },
  'b-pop-micro': {
    title: 'Ecological Sampling Instruments & Population Formulas',
    headers: ['Instrument / Method', 'Ecological Factor Measured', 'Formula / Precaution'],
    rows: [
      ['Quadrat Frame', 'Population density & frequency of stationary plants/slow invertebrates', 'Density = Total count ÷ Total area sampled (throw RANDOMLY)'],
      ['Capture–Mark–Recapture', 'Mobile animal population size N (Lincoln Index)', 'N = (n₁ × n₂) ÷ m  (m = marked recaptured; dye must be non-toxic)'],
      ['Anemometer vs Wind Vane', 'Wind SPEED vs Wind DIRECTION', 'Hygrometer = relative humidity · Secchi disc = water turbidity'],
      ['Barometer / Photometer', 'Atmospheric pressure / Light intensity', 'Rain gauge placed in open ground ≥ 30 cm above splash level'],
    ],
  },
  'b-digestion': {
    title: 'Mammalian Digestive Enzymes, Sites & Optimal pH',
    headers: ['Region & pH', 'Secretion / Enzyme', 'Substrate → End Product'],
    rows: [
      ['Mouth (pH ~ 6.8–7.2)', 'Salivary amylase (ptyalin)', 'Cooked starch → Maltose'],
      ['Stomach (pH 1.5–2.0, HCl)', 'Pepsin · Rennin (infants)', 'Proteins → Peptones/polypeptides · Rennin coagulates soluble caseinogen → insoluble casein'],
      ['Duodenum (Alkaline, pH ~ 8)', 'Bile (liver/gallbladder — NO enzymes!) + Pancreatic TAL', 'Bile emulsifies fats; Trypsin→peptides, Amylase→maltose, Lipase→fatty acids + glycerol'],
      ['Ileum (Succus entericus)', 'Maltase, Sucrase, Lactase, Erepsin', 'Maltose→2 glucose · Sucrose→glucose+fructose · Lactose→glucose+galactose · Peptides→amino acids'],
    ],
  },
  'b-circulatory': {
    title: 'Mammalian Blood Vessels & Plant Vascular Tissues',
    headers: ['Vessel / Tissue', 'Structure & Direction', 'Exception / Mechanism'],
    rows: [
      ['Arteries vs Veins', 'Arteries: thick muscular/elastic wall, narrow lumen, NO valves (away from heart)', 'PULMONARY ARTERY carries deoxygenated blood; PULMONARY VEIN carries oxygenated blood'],
      ['Capillaries & Clotting', 'One-cell-thick endothelium for exchange', 'Platelets + Ca²⁺ + Vit K → Thrombokinase → Prothrombin to Thrombin → Fibrinogen to FIBRIN mesh'],
      ['Xylem Vessels', 'Dead lignified hollow tubes; unidirectional UPWARD', 'Transpiration pull + cohesion-tension + root pressure + capillarity'],
      ['Phloem Sieve Tubes', 'Living sieve tubes + companion cells; bidirectional', 'Active TRANSLOCATION of sucrose & amino acids (ring-barking swells above ring)'],
    ],
  },
  'b-gas-exchange': {
    title: 'Respiratory Surfaces & Mammalian Breathing Mechanics',
    headers: ['Phase / Organism', 'Mechanism / Respiratory Organ', 'Pressure & Volume Change'],
    rows: [
      ['Inhalation (Inspiration)', 'External intercostals contract (ribs UP & OUT); diaphragm contracts (FLATTENS)', 'Thoracic volume INCREASES → intrapulmonary pressure DROPS below atmospheric → air rushes in'],
      ['Exhalation (Expiration)', 'Ribs move DOWN & IN; diaphragm relaxes (DOMES upward)', 'Thoracic volume DECREASES → thoracic pressure RISES → air forced out'],
      ['Bony Fish & Insects', 'Vascularized gill filaments (counter-current) · Tracheal system (spiracles→tracheoles)', 'Insect blood (haemolymph) lacks haemoglobin — tracheoles deliver O₂ directly to tissues'],
      ['Universal Surface Traits', 'Thin (1-cell), moist, large surface area, richly vascularized', 'Facilitates rapid Fick’s-law diffusion of O₂ and CO₂'],
    ],
  },
  'b-kidney-liver': {
    title: 'Nephron Urine Formation & Liver Homeostatic Functions',
    headers: ['Nephron / Liver Region', 'Physiological Process', 'Regulating Hormone / Clinical Sign'],
    rows: [
      ['Glomerulus → Bowman’s Capsule', 'ULTRAFILTRATION under high hydrostatic pressure (afferent wider than efferent)', 'Filters water, glucose, amino acids, salts, urea; RETAINS plasma proteins & blood cells'],
      ['Proximal Convoluted Tubule', 'Selective reabsorption of 100% glucose, amino acids, vitamins & most water', 'Glucose in urine = Diabetes mellitus (lack of INSULIN, not kidney failure alone)'],
      ['Loop of Henle & Collecting Duct', 'Osmoregulation & water reabsorption', 'ADH (vasopressin from posterior pituitary) increases collecting-duct permeability → concentrated urine; lack = Diabetes insipidus'],
      ['Mammalian Liver', 'Deamination (ornithine cycle), bile production, detoxification, glycogen storage', 'Excess amino acids → keto acid + NH₃ → UREA excreted by kidneys'],
    ],
  },
  'b-homeostasis-skin': {
    title: 'Thermoregulation in Skin & Major Endocrine Hormones',
    headers: ['Condition / Gland', 'Response / Hormone Secreted', 'Target Effect / Deficiency Disease'],
    rows: [
      ['Hot Weather (Overheating)', 'VASODILATION of superficial arterioles + profuse sweating + hairs lie flat', 'Increased heat loss by radiation, convection, and latent heat of evaporation'],
      ['Cold Weather (Chilling)', 'VASOCONSTRICTION + shivering + erector pili muscles contract (goosebumps)', 'Conserves core body temperature at ~37 °C in homoiotherms'],
      ['Pancreas (Islets of Langerhans)', 'β-cells: Insulin · α-cells: Glucagon', 'Insulin lowers blood glucose (→ glycogen); Glucagon raises blood glucose'],
      ['Thyroid & Adrenal Medulla', 'Thyroxine (iodine-dependent) · Adrenaline', 'Hypothyroidism: Cretinism (children) / Simple goitre & myxoedema (adults) · Adrenaline = fight-or-flight'],
    ],
  },
  'b-nervous': {
    title: 'Brain Regions, Reflex Arc & Autonomic Divisions',
    headers: ['Division / Structure', 'Core Function', 'Clinical / Exam Distinction'],
    rows: [
      ['Cerebrum (Forebrain)', 'Voluntary actions, memory, intelligence, speech, sensory interpretation', 'Outer grey matter (cortex) + inner white matter; left hemisphere controls right body'],
      ['Cerebellum vs Medulla', 'Cerebellum: muscular coordination, posture & balance', 'Medulla oblongata: involuntary heartbeat, breathing, peristalsis, coughing, blood pressure'],
      ['Hypothalamus', 'Thermoregulation, osmoreceptors, appetite, thirst, pituitary link', 'Master homeostatic thermostat of mammals'],
      ['Spinal Reflex Arc', 'Receptor → Sensory → Dorsal root → Relay (grey matter) → Ventral root → Motor → Effector', 'Bypasses conscious cerebrum for split-second protection; acetylcholine crosses synapse'],
    ],
  },
  'b-sense-organs': {
    title: 'Eye Accommodation, Sight Defects & Inner Ear Functions',
    headers: ['Condition / Structure', 'Mechanism / Cause', 'Optical Correction / Sensory Role'],
    rows: [
      ['Viewing NEAR Object', 'Ciliary muscles CONTRACT · Suspensory ligaments SLACKEN', 'Lens becomes THICK / MORE CONVEX (shorter focal length)'],
      ['Viewing DISTANT Object', 'Ciliary muscles RELAX · Suspensory ligaments TAUT', 'Lens pulled THIN / LESS CONVEX (longer focal length)'],
      ['Myopia vs Hypermetropia', 'Myopia: eyeball too long (focus in front of retina) · Hypermetropia: eyeball too short (behind)', 'Myopia → CONCAVE (diverging) lens · Hypermetropia → CONVEX (converging) lens · Astigmatism → cylindrical'],
      ['Mammalian Ear', 'Ossicles (malleus→incus→stapes) amplify · Eustachian tube equalizes pressure', 'COCHLEA = hearing (organ of Corti) · SEMICIRCULAR CANALS & utriculus = dynamic/static balance'],
    ],
  },
  'b-aquatic-terrestrial': {
    title: 'Hydrophytes, Xerophytes & Ecological Succession',
    headers: ['Ecological Group', 'Structural & Physiological Adaptations', 'Classic Examples'],
    rows: [
      ['Hydrophytes (Water plants)', 'Aerenchyma air spaces for buoyancy, poorly developed xylem/cuticle, stomata on UPPER leaf surface', 'Water lily (Nymphaea), Pistia (water lettuce), Eichhornia (water hyacinth), Elodea'],
      ['Xerophytes (Arid/Desert)', 'Sunken stomata, thick waxy cuticle, leaves reduced to spines, succulent water-storing stems, deep roots', 'Opuntia (cactus), Euphorbia, Aloe, Casuarina'],
      ['Halophytes (Salt marsh)', 'High cell-sap osmotic pressure, salt-secreting glands, breathing pneumatophores', 'Rhizophora, Avicennia (mangroves)'],
      ['Primary vs Secondary Succession', 'Primary: bare rock/sand (lichens→mosses→herbs→shrubs→climax) · Secondary: cleared/burnt soil', 'Secondary succession is MUCH FASTER because fertile soil & seed bank already exist'],
    ],
  },
  'b-pollution-cons': {
    title: 'Major Pollutants, Ecological Impacts & Nigerian Game Reserves',
    headers: ['Pollutant / Reserve', 'Mechanism / Location', 'Ecological / Health Consequence'],
    rows: [
      ['Carbon Monoxide (CO) & SO₂', 'Incomplete exhaust combustion · Coal/oil burning', 'CO binds haemoglobin ~200× stronger than O₂ → carboxyhaemoglobin asphyxiation · SO₂ → acid rain'],
      ['Sewage & Nitrate Runoff', 'Algal bloom → bacterial decomposition spikes BOD', 'EUTROPHICATION depletes dissolved O₂ → mass fish suffocation'],
      ['CFCs vs CO₂ / CH₄', 'Chlorofluorocarbons vs Greenhouse gases', 'CFCs destroy stratospheric OZONE (UV shield) · CO₂/CH₄ trap infrared heat (global warming)'],
      ['Nigerian Conservation Parks', 'Yankari (Bauchi) · Kainji/Borgu (Niger) · Cross River · Okomu (Edo)', 'In-situ biodiversity protection of endangered West African fauna & flora'],
    ],
  },
  'b-flower-pollination': {
    title: 'Insect-Pollinated vs Wind-Pollinated Flowers & Germination',
    headers: ['Feature', 'Insect-Pollinated (Entomophilous)', 'Wind-Pollinated (Anemophilous)'],
    rows: [
      ['Corolla, Scent & Nectar', 'Large brightly coloured petals, sweet scent, nectaries present', 'Small dull/green bracts, NO scent, NO nectar (e.g., maize, guinea grass)'],
      ['Pollen & Stigma', 'Few heavy sticky/spiny pollen; compact sticky stigma inside flower', 'Vast quantities of light smooth dry pollen; large FEATHERY stigma hanging outside'],
      ['Double Fertilization', '1st male nucleus (n) + egg (n) → diploid zygote (2n)', '2nd male nucleus (n) + 2 polar nuclei (2n) → TRIPLOID endosperm (3n)'],
      ['Epigeal vs Hypogeal', 'Epigeal: hypocotyl elongates, cotyledons pushed ABOVE soil (cowpea, castor, flamboyant)', 'Hypogeal: epicotyl elongates, cotyledons stay BELOW soil (maize, oil palm, groundnut/pea)'],
    ],
  },
  'b-mammalian-repro': {
    title: 'Human Reproductive Hormones, Fertilization & Foetal Membranes',
    headers: ['Structure / Hormone', 'Source & Timing', 'Exact Reproductive Function'],
    rows: [
      ['FSH & Oestrogen', 'FSH (pituitary) → Graafian follicle; Follicle secretes Oestrogen', 'FSH matures ovum · Oestrogen repairs uterine endometrium & triggers LH surge'],
      ['LH & Progesterone', 'LH surge (day 14) → OVULATION; Corpus luteum secretes Progesterone', 'Progesterone maintains thick vascular endometrium & inhibits new FSH during pregnancy'],
      ['Oviduct vs Uterus', 'Fertilization occurs in upper OVIDUCT (Fallopian tube)', 'Implantation & foetal development occur in the muscular UTERUS'],
      ['Placenta & Amnion', 'Chorionic villi + maternal blood spaces (bloods NEVER mix!)', 'Diffuses O₂, glucose, amino acids, antibodies; blocks high maternal blood pressure; amniotic fluid cushions shocks'],
    ],
  },
  'b-mendel': {
    title: 'Mendelian Ratios & Non-Mendelian Cross Reference',
    headers: ['Cross Type', 'Parental Genotypes', 'Offspring Genotypic & Phenotypic Ratios'],
    rows: [
      ['Monohybrid F₁ × F₁', 'Tt × Tt (complete dominance)', 'Phenotype = 3 Tall : 1 Dwarf · Genotype = 1 TT : 2 Tt : 1 tt'],
      ['Monohybrid Test Cross', 'Tt × tt (heterozygote × homozygous recessive)', '1 Tall (Tt) : 1 Dwarf (tt) — proves unknown dominant parent was heterozygous'],
      ['Incomplete / Codominance', 'R¹R² × R¹R² (Mirabilis jalapa / roan cattle)', '1 : 2 : 1 for BOTH phenotype AND genotype (blended pink or codominant spots)'],
      ['Dihybrid F₁ × F₁', 'RrYy × RrYy (independent assortment)', '9 : 3 : 3 : 1 phenotypic ratio (dihybrid test cross RrYy × rryy = 1 : 1 : 1 : 1)'],
    ],
  },
  'b-sex-linkage': {
    title: 'ABO Blood Groups, Sex-Linkage & Sickle-Cell Inheritance',
    headers: ['Trait / Blood Group', 'Genotypes & Antigens/Antibodies', 'Clinical & Marriage Rule'],
    rows: [
      ['Group O vs Group AB', 'O (ii): NO A/B antigens, has anti-a & anti-b → Universal Donor', 'AB (IᴬIᴮ): codominant A & B antigens, NO antibodies → Universal Recipient'],
      ['Rhesus Factor (Rh)', 'Rh⁺ dominant over Rh⁻', 'Danger: Rh⁻ mother carrying 2nd Rh⁺ foetus → anti-Rh antibodies cause erythroblastosis foetalis'],
      ['X-Linked Recessive', 'Haemophilia (Xʰ) & Red-green colour blindness (Xᶜ)', 'More common in males (XʰY needs 1 allele); fathers NEVER pass X-linked traits to sons (give Y)'],
      ['Sickle-Cell (Hbᴬ / Hbˢ)', 'HbᴬHbˢ × HbᴬHbˢ → 1 HbᴬHbᴬ : 2 HbᴬHbˢ : 1 HbˢHbˢ (25% sickle-cell)', 'HbᴬHbˢ carriers enjoy malaria resistance (heterozygote advantage)'],
    ],
  },
  'b-dna-biotech': {
    title: 'DNA vs RNA, Mitosis vs Meiosis & Chargaff’s Rule',
    headers: ['Comparison Axis', 'DNA / Mitosis', 'RNA / Meiosis'],
    rows: [
      ['Sugar & Pyrimidine Base', 'Deoxyribose sugar; bases A=T (2 H-bonds), G≡C (3 H-bonds)', 'Ribose sugar; single-stranded; URACIL (U) replaces Thymine (T)'],
      ['Chargaff’s Base Rule', '%A = %T and %G = %C; (%A + %G) = 50%', 'If C = 22%, then G = 22%, leaving A+T = 56% → A = 28%, T = 28%'],
      ['Mitosis (Somatic)', '1 division → 2 genetically IDENTICAL diploid (2n) daughter cells', 'Growth, wound repair, asexual reproduction'],
      ['Meiosis (Gametogenesis)', '2 divisions → 4 genetically VARIED haploid (n) gametes', 'Synapsis & crossing-over at chiasmata in Prophase I generate genetic variation'],
    ],
  },
  'b-variation': {
    title: 'Continuous vs Discontinuous Variation & Chromosomal Syndromes',
    headers: ['Feature', 'Continuous Variation', 'Discontinuous Variation'],
    rows: [
      ['Distribution & Control', 'Unbroken intermediates (normal bell curve); polygenic + environment', 'Distinct clear-cut classes with NO intermediates; single/few major genes'],
      ['Classic Human Examples', 'Height, body weight, skin colour, intelligence, foot length', 'ABO blood group, Rhesus factor, ability to roll tongue, sex, fingerprint class (arch/loop/whorl)'],
      ['Chromosomal Mutations', 'Trisomy 21 (47, +21) = Down’s syndrome', 'Klinefelter’s = XXY (47, sterile male) · Turner’s = XO (45, sterile female)'],
      ['Polyploidy in Crops', '3n, 4n, 6n chromosome sets', 'Produces larger vigorous seedless fruits & high-yield cereals (bananas, bread wheat)'],
    ],
  },
  'b-adaptation': {
    title: 'Adaptive Colouration, Behavioural Dormancy & Social Castes',
    headers: ['Mechanism / Caste', 'Biological Function', 'West African / Exam Examples'],
    rows: [
      ['Cryptic vs Warning (Aposematic)', 'Camouflage blending (chameleon, green grasshopper, stick insect)', 'Bright black/yellow/red warning of venom/distaste (wasps, monarch butterfly)'],
      ['Batesian Mimicry & Countershading', 'Harmless palatable mimic copies toxic model', 'Fish dark dorsal back + silvery ventral belly cancels overhead shadow'],
      ['Aestivation vs Hibernation', 'Aestivation = DRY/HOT season dormancy (African lungfish Protopterus in mud cocoon, giant snail)', 'Hibernation = COLD winter dormancy in temperate mammals'],
      ['Termite & Honeybee Castes', 'Termites: Queen (eggs), King (mates repeatedly), Wingless sterile workers & soldiers', 'Honeybees: Queen (pheromone), Haploid drones (parthenogenesis), Sterile female workers (waggle dance)'],
    ],
  },
  'b-evolution': {
    title: 'Lamarck vs Darwin & Anatomical Evidence of Evolution',
    headers: ['Concept', 'Mechanism / Definition', 'Why Accepted or Rejected'],
    rows: [
      ['Lamarckism (1809)', 'Use & disuse of organs + inheritance of ACQUIRED somatic traits', 'REJECTED — somatic changes do not alter germ-cell DNA (Weismann’s mouse-tail experiment)'],
      ['Darwin–Wallace (1859)', 'Overproduction → competition → heritable variation → survival of the fittest', 'ACCEPTED (Neo-Darwinism adds mutation, meiosis recombination & gene flow)'],
      ['Homologous Structures', 'Same pentadactyl bone plan, different functions → DIVERGENT evolution', 'Human arm, whale flipper, bat wing, horse forelimb (shared common ancestor)'],
      ['Analogous Structures', 'Different embryonic origin, similar function → CONVERGENT evolution', 'Insect wing (chitin) vs bird wing (vertebrate bones); peppered moth = live natural selection'],
    ],
  },
  'b-plant-anatomy': {
    title: 'Internal Transverse Sections: Dicot vs Monocot Stem & Root',
    headers: ['Organ Section', 'Vascular Bundle Arrangement', 'Cambium & Secondary Thickening'],
    rows: [
      ['Dicotyledonous Stem', 'Collateral bundles arranged in a DISTINCT RING around central pith', 'Open bundles WITH vascular cambium → secondary growth & annual rings'],
      ['Monocotyledonous Stem', 'Closed vascular bundles SCATTERED throughout ground tissue', 'NO vascular cambium → no secondary woody thickening (e.g., maize, palm)'],
      ['Dicot vs Monocot Root', 'Dicot: star-shaped xylem (2–5 arms) alternating radially with phloem', 'Monocot: polyarch ring (> 8 xylem bundles) around a large central pith; endodermis has Casparian strip'],
      ['Dicot Dorsiventral Leaf', 'Upper cuticle → upper epidermis (no chloroplasts) → chloroplast-rich PALISADE mesophyll', 'Spongy mesophyll air spaces + Bean-shaped CHLOROPLAST-CONTAINING guard cells on lower epidermis'],
    ],
  },
  'b-soil-agric': {
    title: 'Sandy, Clay & Loamy Soil Properties & Crop Rotation',
    headers: ['Soil Type / Practice', 'Particle Size, Porosity & Capillarity', 'Agricultural Suitability'],
    rows: [
      ['Sandy Soil', 'Coarse (> 0.02 mm), huge air spaces, drains fastest, LOWEST capillarity & humus', 'Light & airy but leaches nitrates rapidly; poor water retention'],
      ['Clay Soil', 'Fine (< 0.002 mm), tiny pores, waterlogs easily, HIGHEST ultimate capillarity', 'Heavy, poorly aerated, cracks when dry, nutrient-rich'],
      ['Loamy Soil', 'Balanced sand + silt + clay + abundant dark HUMUS', 'IDEAL agricultural soil — good crumb structure, aeration, moisture & mineral retention'],
      ['4-Course Crop Rotation', 'Alternate deep-rooted (yam/cassava) with shallow-rooted (maize) + LEGUMES (cowpea/groundnut)', 'Prevents nutrient exhaustion, breaks host-specific pest cycles, and replenishes soil nitrates via Rhizobium'],
    ],
  },
  'b-public-health': {
    title: 'Major Tropical Diseases, Causative Agents, Vectors & Immunity',
    headers: ['Disease', 'Causative Pathogen', 'Vector / Host & Control'],
    rows: [
      ['Malaria', 'Plasmodium spp. (protozoan)', 'Female Anopheles mosquito — ITNs, drain stagnant water, Gambusia fish, ACT therapy'],
      ['Schistosomiasis (Bilharzia)', 'Schistosoma haematobium / mansoni (blood fluke)', 'Freshwater water snail (Bulinus / Biomphalaria) — molluscicides, avoid wading, sanitary sewage'],
      ['Onchocerciasis (River Blindness)', 'Onchocerca volvulus (filarial nematode)', 'Simulium damnosum (blackfly breeding in fast-flowing oxygenated rivers) — ivermectin'],
      ['Trypanosomiasis & Immunity', 'Trypanosoma brucei via Glossina (tsetse fly)', 'Vaccines = Artificial ACTIVE immunity (long-lived memory cells) · Antiserum/colostrum = PASSIVE (immediate, short-lived)'],
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

function buildInteractiveForBioTopic(topic: Topic): InteractiveLesson {
  const tableSpec = BIO_TEACH_TABLES[topic.id];

  return {
    title: topic.name,
    goals: topic.goals,
    trap: topic.trap,
    parts: topic.parts.map((part, pIdx) => {
      const beats: Beat[] = [];

      // 1. Core Biological Principle & Mechanisms (IdeaBeat)
      const ideaBeat: IdeaBeat = {
        k: 'idea',
        kl: `Chapter ${pIdx + 1} · Core Principle`,
        title: part.title,
        idea: part.idea,
        g: part.g,
        cap: part.cap,
        rules: part.rules,
        rh: 'Essential Biological Mechanisms & Exam Rules',
      };
      beats.push(ideaBeat);

      // 2. Structured Mastery Comparison Table on Chapter 1
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

      // 3. Step-by-Step Worked Biological Reasoning / Calculation (FadeBeat)
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
        kl: 'Worked Biological Analysis',
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
        idx === part.tryit.a
          ? `Spot on! ${part.tryit.e}`
          : `Review the exact biological mechanism: ${part.tryit.e}`
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

export function buildBioCurriculum(): {
  topics: Topic[];
  il: Record<string, InteractiveLesson>;
} {
  const rawTopics: Topic[] = [
    ...BIO_TOPICS_PART1,
    ...BIO_TOPICS_PART2,
    ...BIO_TOPICS_PART3,
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
    il[t.id] = buildInteractiveForBioTopic(t);
  }

  return { topics, il };
}
