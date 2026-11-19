import type { Topic } from '../types';

export const BIO_TOPICS_PART2: Topic[] = [
  // 11. Digestive Systems, Mammalian Dentition & Alimentary Absorption
  {
    id: 'b-digestion',
    name: 'Mammalian Dentition & Digestive System',
    sec: 'SS 2 · First Term · The Organism at Work',
    boss: 'Dentition, Enzymes & Villi Test',
    goals: [
      'Interpret mammalian dental formulas (human, herbivore rabbit/sheep with diastema, carnivore dog with carnassial teeth) and tooth anatomy',
      'Trace enzymatic digestion from mouth (ptyalin) → stomach (pepsin, rennin, HCl) → duodenum/ileum (bile, pancreatic amylase/trypsin/lipase, erepsin) and absorption into villi',
    ],
    trap: 'BILE contains ZERO digestive enzymes — bile salts physically EMULSIFY fats into tiny droplets to increase surface area for pancreatic lipase!',
    parts: [
      {
        title: 'Heterodont Dentition & Dental Formulas',
        idea: 'Mammals exhibit heterodont dentition (incisors for cutting, canines for tearing, premolars & molars for grinding), anchored via cementum and periodontal membrane in jaw sockets.',
        rules: [
          'Adult Human dental formula: 2 × (I 2/2, C 1/1, PM 2/2, M 3/3) = 32 teeth. Enamel is the hardest non-living substance; pulp cavity houses blood capillaries & nerve endings.',
          'Herbivore (Rabbit / Sheep): lacks upper/all canines, leaving a toothless gap called the DIASTEMA for tongue manipulation of grass; open-rooted hypsodont molars grow continuously to offset silica wear.',
          'Carnivore (Dog): 2 × (I 3/3, C 1/1, PM 4/4, M 2/3) = 42; last upper premolar + first lower molar form scissor-like CARNASSIAL TEETH to shear flesh and crack bone.',
        ],
        ex: {
          q: 'A mammal’s skull has dental formula I 2/1, C 0/0, PM 3/2, M 3/3. Calculate its total number of teeth and deduce its diet.',
          steps: [
            ['Sum teeth in one half of upper + lower jaw: (2+0+3+3) + (1+0+2+3) = 8 + 6 = 14', 'Dental formula shows half of the upper and lower jaws.'],
            ['Multiply by 2 for full mouth: 14 × 2 = 28 teeth (Rabbit!)', 'C 0/0 indicates a wide diastema — strict herbivore (browser/grazer).'],
          ],
        },
        tryit: {
          q: 'In carnivorous mammals such as the domestic dog, which specialized pair of cheek teeth is modified into sharp shearing blades called carnassial teeth?',
          o: [
            'The last upper premolar and the first lower molar',
            'The first upper incisor and the lower canine',
            'The third upper molar and the third lower molar',
            'All four canines flanking the anterior diastema',
          ],
          a: 0,
          h: 'Carnassials sit near the jaw hinge for maximum mechanical biting force!',
          e: 'In carnivores, the fourth (last) upper premolar and first lower molar shear past each other like secateurs to slice tendons and bone.',
        },
      },
      {
        title: 'Alimentary Canal Enzymes, Bile & Absorption in Ileum Villi',
        idea: 'Digestion hydrolyses insoluble macromolecules into soluble monomers: glucose & amino acids enter blood capillaries → HEPATIC PORTAL VEIN → Liver, whereas fatty acids & glycerol enter the LACTEAL (lymphatic vessel).',
        rules: [
          'Mouth (pH ~6.8): salivary amylase (ptyalin) → cooked starch to maltose. Stomach (pH ~1.5–2.0, HCl): pepsin → proteins to peptones; rennin coagulates milk caseinogen to insoluble casein in infants.',
          'Duodenum (alkaline pH ~8): Bile (made in liver, stored in gall bladder) neutralizes chyme & emulsifies fats; Pancreatic juice supplies Amylase, Trypsin (proteins → polypeptides), and Lipase (fats → fatty acids + glycerol).',
          'Ileum succus entericus: Maltase (maltose → 2 glucose), Sucrase (sucrose → glucose + fructose), Lactase (lactose → glucose + galactose), Erepsin/Peptidases (peptides → amino acids).',
        ],
        ex: {
          q: 'Trace the exact route taken by a newly absorbed glucose molecule vs a newly absorbed fatty acid molecule from the lumen of the ileum until both reach the heart.',
          steps: [
            ['Glucose + Amino acids → Villus blood capillaries → Hepatic Portal Vein → Liver', 'Liver regulates blood glucose before blood enters the hepatic vein → inferior vena cava → right atrium.'],
            ['Fatty acids + Glycerol → Recombine in epithelium → Villus LACTEAL → Thoracic lymphatic duct', 'Enters left subclavian vein → superior vena cava → right atrium (bypasses hepatic portal vein first!).'],
          ],
        },
        tryit: {
          q: 'Surgical removal of a patient’s gall bladder requires restricting dietary intake of fatty meals primarily because:',
          o: [
            'Concentrated bile can no longer be released on demand to emulsify lipids for rapid lipase action',
            'The gall bladder is the sole organ synthesizing pancreatic lipase in the human body',
            'Pepsinogen in the stomach requires gall-bladder bile to convert into active pepsin',
            'Villi lacteals collapse permanently whenever bile pigments are absent from blood',
          ],
          a: 0,
          h: 'Remember: the liver makes bile, the gall bladder stores and releases it, and bile emulsifies fats physically!',
          e: 'Without gall-bladder storage, concentrated bile cannot surge into the duodenum after fatty meals, slowing fat emulsification and lipase digestion.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Which blood vessel transports newly absorbed glucose and amino acids directly from the small intestine to the liver?', o: ['Hepatic portal vein', 'Hepatic artery', 'Hepatic vein', 'Mesenteric lymph vessel'], a: 0, e: 'A portal vein connects two capillary beds (ileum villi → liver sinusoids) so the liver can assimilate excess glucose and deaminate surplus amino acids.' },
      { l: 2, q: 'What is the primary role of rennin in the gastric juice of suckling young mammals?', o: ['Coagulating soluble milk protein (caseinogen) into insoluble curds (casein) so pepsin can digest it', 'Emulsifying butterfat globules into fatty acids and glycerol at pH 2', 'Hydrolysing milk lactose directly into glucose and galactose', 'Neutralizing hydrochloric acid before chyme enters the pyloric sphincter'], a: 0, e: 'Rennin (chymosin) curdles soluble milk caseinogen in the presence of Ca²⁺, preventing liquid milk from rushing through the infant stomach undigested.' },
      { l: 3, q: 'Why do termites digest dry wood (cellulose) effortlessly whereas humans pass dietary cellulose out undigested as roughage?', o: ['Termites harbour symbiotic flagellate protozoa (<i>Trichonympha</i>) in their hindgut that secrete cellulase', 'Termite salivary glands secrete concentrated hydrochloric acid at pH 0.5', 'Human ileum villi actively pump intact cellulose polymers directly into lacteals', 'Termite Malpighian tubules convert lignin into sucrose by photosynthesis'], a: 0, e: 'Mutualistic gut protozoa (<i>Trichonympha</i>) produce cellulase to hydrolyse β-1,4 glycosidic bonds in wood into glucose for both partners.' },
      { l: 3, q: 'The toothless space between the incisors and premolars in the jaw of a rabbit or goat is the:', o: ['Diastema', 'Pulp cavity', 'Carnassial cleft', 'Infundibulum'], a: 0, e: 'Herbivores lack canines, leaving a diastema that allows the tongue and cheeks to roll clipped herbage back onto grinding molars.' },
      { l: 4, q: 'Which adaptation does NOT contribute to rapid absorption of digested food in the mammalian ileum?', o: ['Thick Stratified keratinized epithelium lining every villus', 'Great length (~6 metres) and millions of finger-like villi and microvilli', 'One-cell-thick columnar epithelium rich in ATP-producing mitochondria', 'Dense network of blood capillaries surrounding a central lacteal in each villus'], a: 0, e: 'Villi have a ONE-CELL-THICK (simple columnar) non-keratinized epithelium to minimize diffusion distance; thick keratinized skin would block absorption.' },
      { l: 5, q: 'In birds such as the domestic fowl, which muscular chamber of the alimentary canal contains swallowed grit/stones to grind hard grains mechanically (replacing teeth)?', o: ['Gizzard (ventriculus)', 'Crop', 'Proventriculus', 'Caecum'], a: 0, e: 'Grain is moistened/stored in the crop, mixed with gastric juice in the glandular proventriculus, and mechanically ground with grit in the thick-walled muscular gizzard.' },
    ],
  },

  // 12. Transport in Mammals & Plants — Heart, Blood, Xylem & Phloem
  {
    id: 'b-circulatory',
    name: 'Transport in Mammals & Vascular Plants',
    sec: 'SS 2 · First Term · The Organism at Work',
    boss: 'Heart, Clotting, Xylem & Phloem Test',
    goals: [
      'Trace mammalian double circulation, compare arteries/veins/capillaries, and sequence the enzymatic blood-clotting cascade',
      'Distinguish upward water/mineral transport in xylem (transpiration pull, cohesion–tension, potometer) from bidirectional sucrose translocation in phloem (ringing experiment)',
    ],
    trap: 'The PULMONARY ARTERY is the ONLY adult artery carrying DEOXYGENATED blood (right ventricle → lungs), and the PULMONARY VEIN is the ONLY adult vein carrying OXYGENATED blood!',
    parts: [
      {
        title: 'Mammalian Heart, Double Circulation & Blood Clotting',
        idea: 'Mammals have a closed, complete double circulation: blood passes through the four-chambered heart TWICE per circuit (low-pressure pulmonary circuit to lungs + high-pressure systemic circuit from thick-walled LEFT ventricle to body).',
        rules: [
          'Valves prevent backflow: TRICUSPID (between Right Atrium & Right Ventricle); BICUSPID / MITRAL (between Left Atrium & Left Ventricle); Semilunar valves at base of aorta & pulmonary artery.',
          'Pacemaker = Sinoatrial (SA) node in the wall of the RIGHT atrium! Arteries have thick elastic/muscular walls, narrow lumen, high pressure, NO valves (except semilunars); Veins have thin walls, wide lumen, low pressure, pocket VALVES.',
          'Clotting cascade: Damaged platelets + tissues release THROMBOKINASE (thromboplastin) → converts inactive Prothrombin (with Ca²⁺ & Vit K) into active THROMBIN → converts soluble plasma Fibrinogen into insoluble FIBRIN mesh!',
        ],
        ex: {
          q: 'Why is the muscular wall of the left ventricle roughly three times thicker than the wall of the right ventricle?',
          steps: [
            ['Right ventricle pumps blood only a short distance to nearby lungs (pulmonary circuit)', 'Requires low pressure (~25 mmHg) to avoid rupturing delicate alveolar capillaries.'],
            ['Left ventricle pumps oxygenated blood through the aorta to the ENTIRE systemic body from head to toes', 'Requires powerful myocardial contraction (~120 mmHg systolic pressure).'],
          ],
        },
        tryit: {
          q: 'Which inorganic ion and soluble plasma protein are directly required in the final steps of mammalian blood clotting?',
          o: [
            'Calcium ions (Ca²⁺) and soluble fibrinogen converted into insoluble fibrin threads',
            'Sodium ions (Na⁺) and serum albumin converted into haemoglobin',
            'Magnesium ions (Mg²⁺) and antibodies agglutinating platelets permanently',
            'Iron(II) ions (Fe²⁺) and globulin precipitating red blood cells in lymph',
          ],
          a: 0,
          h: 'Citrate/oxalate anticoagulants in blood-bank bags prevent clotting by chelating Ca²⁺!',
          e: 'Ca²⁺ is an essential cofactor for thrombokinase to activate prothrombin → thrombin, which cleaves soluble fibrinogen into insoluble fibrin mesh.',
        },
      },
      {
        title: 'Plant Transport — Xylem Transpiration Pull & Phloem Translocation',
        idea: 'Dead lignified xylem vessels conduct water and mineral salts upward via root pressure, capillarity, and cohesion–tension transpiration pull; living phloem sieve tubes + companion cells translocate sucrose and amino acids bidirectionally.',
        rules: [
          'Factors INCREASING transpiration rate (faster bubble movement in a potometer): high temperature, strong wind, high light intensity (opens stomata), LOW relative humidity.',
          'Important: A potometer directly measures rate of WATER UPTAKE by a cut leafy shoot (which closely approximates transpiration since ~98% of absorbed water transpires).',
          'Ringing (girdling) experiment: stripping outer bark/phloem down to cambium causes a sugary swelling JUST ABOVE the ring while roots starve and die — proving downward translocation of food occurs in PHLOEM!',
        ],
        ex: {
          q: 'Explain why a leafy shoot used in a bubble potometer must be cut obliquely UNDER WATER and smeared with petroleum jelly (Vaseline) at all rubber joints.',
          steps: [
            ['Cut stem underwater', 'Prevents air bubbles (embolism) from entering xylem vessels and breaking continuous cohesion–tension water columns!'],
            ['Seal joints with Vaseline', 'Ensures airtight apparatus so capillary meniscus movement reflects shoot uptake alone.'],
          ],
        },
        tryit: {
          q: 'When a complete ring of bark (containing phloem) is removed around the main trunk of a woody dicot tree while leaving central xylem intact, what happens first?',
          o: [
            'Tissue just above the ring swells with accumulated sucrose while leaves remain turgid initially',
            'All leaves wilt within ten minutes because upward water transport in phloem stops',
            'Tissue below the ring swells rapidly as roots pump starch upward through bark',
            'Xylem vessels regenerate chlorophyll to feed the roots indefinitely',
          ],
          a: 0,
          h: 'Central xylem still carries water up to leaves, so leaves keep photosynthesizing — where does the downward-moving sucrose get blocked?',
          e: 'Water continues rising in intact central xylem so leaves stay turgid, but translocated sucrose accumulates above the severed phloem ring; eventually roots starve of sugar and die.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Which chamber of the mammalian heart receives freshly oxygenated blood directly from the lungs via the pulmonary veins?', o: ['Left atrium (auricle)', 'Right atrium (auricle)', 'Left ventricle', 'Right ventricle'], a: 0, e: 'Oxygenated blood returns from alveolar capillaries through the pulmonary veins into the left atrium, then passes via the bicuspid valve into the left ventricle.' },
      { l: 2, q: 'Blood serum differs chemically from blood plasma in that serum:', o: ['Lacks fibrinogen and clotting factors that were consumed during clot formation', 'Contains abundant red blood cells and haemoglobin', 'Is pumped exclusively through lymphatic lacteals', 'Contains three times more platelets than whole blood'], a: 0, e: 'Serum = Plasma minus fibrinogen (the clear yellowish liquid squeezed out after a blood clot retracts).' },
      { l: 3, q: 'Which environmental change will SLOW DOWN the rate of movement of the air bubble in a potometer?', o: ['Enclosing the leafy shoot inside a transparent polythene bag misted with water (high humidity)', 'Placing a spinning electric fan near the shoot in dry air', 'Moving the apparatus from dim shade into bright sunlight', 'Raising ambient room temperature from 20 °C to 32 °C'], a: 0, e: 'High relative humidity around the stomata flattens the water-vapour diffusion gradient between leaf air spaces and outside air, sharply reducing transpiration.' },
      { l: 3, q: 'Open circulatory systems — where blood (haemolymph) bathes organs directly inside a haemocoel — are characteristic of:', o: ['Insects and other arthropods (e.g. cockroach, grasshopper)', 'Earthworms (annelids) and mammals', 'Bony fishes and amphibians', 'Birds and reptiles'], a: 0, e: 'Arthropods and most molluscs have open circulation (haemocoel); annelids (earthworm) and all vertebrates have closed blood vascular systems.' },
      { l: 4, q: 'Why does insect haemolymph look colourless or pale greenish rather than bright red, yet insects sustain extraordinarily high flight metabolic rates?', o: ['Insects lack haemoglobin because their tracheal system pipes gaseous oxygen directly to respiring flight muscles without relying on blood for O₂ transport', 'Insects respire purely anaerobically throughout flight, producing ethanol', 'Insect erythrocytes are transparent biconcave cells packed with iron(III) oxide', 'Spiracles pump liquid water through Malpighian tubules to cool wings'], a: 0, e: 'Insects decouple gas exchange from circulation: air enters spiracles → tracheae → fluid-tipped tracheoles directly touching muscle mitochondria!' },
      { l: 5, q: 'Phloem sieve-tube elements lose their nuclei at maturity yet remain living active cells because:', o: ['Adjacent nucleated companion cells connected via plasmodesmata supply ATP and metabolic proteins', 'Lignified spiral rings inside sieve plates synthesize mRNA continuously', 'Root pressure pushes dead protoplasm upward through sieve pores', 'Chloroplasts inside companion cells pump xylem water into cambium'], a: 0, e: 'Each enucleated phloem sieve-tube element is metabolically sustained by one or more dense, mitochondrion-rich nucleated companion cells linked via plasmodesmata.' },
    ],
  },

  // 13. Respiratory Mechanisms — Stomata, Gills, Tracheae & Mammalian Lungs
  {
    id: 'b-gas-exchange',
    name: 'Gaseous Exchange — Gills, Tracheae & Lungs',
    sec: 'SS 2 · First Term · The Organism at Work',
    boss: 'Ventilation & Gas Exchange Surfaces Test',
    goals: [
      'State the four universal properties of efficient respiratory surfaces and compare cutaneous, gill, tracheal, stomatal, and alveolar exchange',
      'Contrast diaphragm, ribcage, and thoracic pressure changes during mammalian inhalation (inspiration) vs exhalation (expiration)',
    ],
    trap: 'During INHALATION, the muscular diaphragm CONTRACTS and FLATTENS downward (it does NOT arch upward — arching into a dome happens when it RELAXES during exhalation)!',
    parts: [
      {
        title: 'Universal Features of Gas-Exchange Surfaces & Fish Counter-Current Flow',
        idea: 'Every efficient respiratory surface (alveoli, gill lamellae, frog skin) shares four traits: LARGE surface area, THIN (one-cell-thick) epithelium, MOIST lining for gas dissolution, and RICH capillary blood supply (or ventilation) to maintain steep diffusion gradients.',
        rules: [
          'Bony fish (Tilapia): Gill rakers strain food particles (protect delicate filaments); gill bar supports arch; vascularized GILL FILAMENTS/LAMELLAE perform gas exchange.',
          'Counter-current flow in fish gills: blood in lamellae flows OPPOSITE to water passing over gills, maintaining a favourable O₂ diffusion gradient along the ENTIRE lamella (>80% O₂ extraction!).',
          'Adult Amphibian (Toad/Frog): 3 respiratory surfaces — moist vascular SKIN (cutaneous, especially when submerged/hibernating), BUCCAL CAVITY lining, and simple sac-like LUNGS.',
        ],
        ex: {
          q: 'Why does a bony fish suffocate and die rapidly when lifted out of water into air, even though air contains ~21% O₂ compared with <1% dissolved O₂ in water?',
          steps: [
            ['Out of water, delicate feathery gill filaments stick and clump together by surface tension', 'Water buoyancy normally keeps thousands of gill lamellae spread apart.'],
            ['Exposed surface area collapses drastically and gill membranes dry out', 'Gases cannot diffuse rapidly across collapsed, desiccated filaments.'],
          ],
        },
        tryit: {
          q: 'In the branchial chamber of a bony fish (Tilapia), what is the specific function of the gill rakers?',
          o: [
            'Filtering food and solid debris from incoming water before they damage delicate gill filaments',
            'Providing the richly vascularized capillary bed for oxygen uptake into blood',
            'Pumping opercular water backward using cilia powered by swim-bladder gas',
            'Secreting digestive proteases to hydrolyse plankton inside the pharynx',
          ],
          a: 0,
          h: 'Distinguish gill rakers (bony teeth on inner arch) from red gill filaments!',
          e: 'Gill rakers project inward from the gill arch like a comb/sieve to trap sand and food particles, protecting the fragile vascular gill filaments.',
        },
      },
      {
        title: 'Mammalian Ventilation Mechanics & Leaf Guard Cells',
        idea: 'Mammals ventilate lungs by negative-pressure breathing: contracting external intercostals + flattening diaphragm enlarges thoracic volume, dropping intrapulmonary pressure below atmospheric so air rushes in.',
        rules: [
          'INHALATION (active): External intercostals CONTRACT (ribs move UP & OUT) + Diaphragm CONTRACTS (flattens DOWN) → Thoracic volume INCREASES → Lung pressure DROPS below atmospheric → Air rushes IN.',
          'EXHALATION (quiet = passive): External intercostals RELAX (ribs drop DOWN & IN) + Diaphragm RELAXES (arches UP into dome) → Thoracic volume DECREASES → Pressure RISES → Air pushed OUT.',
          'Stomatal opening in light: Guard cells accumulate K⁺ / osmotically active sugars → endosmosis makes guard cells TURGID → thicker inelastic inner wall bends faster than thinner outer wall → stoma OPENS!',
        ],
        ex: {
          q: 'In a bell-jar lung model (Y-tube + balloons + rubber sheet floor), what represents the trachea, bronchi, lungs, ribcage, and diaphragm, and what is one limitation of the model?',
          steps: [
            ['Y-tube stem = trachea; branches = bronchi; balloons = lungs; bell jar = thoracic wall; rubber sheet = diaphragm', 'Pulling rubber sheet down inflates balloons by lowering jar pressure.'],
            ['Limitation: Glass bell jar is rigid and immobile', 'Unlike real ribs/intercostal muscles which swing upward and outward during inhalation!'],
          ],
        },
        tryit: {
          q: 'Which combination of events occurs simultaneously during normal human INHALATION (inspiration)?',
          o: [
            'Diaphragm contracts and flattens, ribcage moves upward and outward, thoracic volume increases, and lung pressure falls',
            'Diaphragm relaxes into an upward dome, ribcage moves downward and inward, and lung pressure rises',
            'Internal intercostal muscles contract forcefully while the diaphragm arches upward to suck air in',
            'Alveolar smooth muscles actively pump nitrogen out so oxygen enters against a pressure gradient',
          ],
          a: 0,
          h: 'Boyle’s law in the chest: larger thoracic volume → lower internal pressure → air flows in!',
          e: 'Contracting the diaphragm (flattening down) and external intercostal muscles (lifting ribs up & out) expands the thorax, lowering pressure below atmospheric.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Exhaled human breath contains approximately what percentages of oxygen and carbon(IV) oxide compared with inhaled air (21% O₂, 0.04% CO₂)?', o: ['~16% O₂ and ~4% CO₂ (saturated with water vapour)', '0% O₂ and 21% CO₂', '21% O₂ and 4% CO₂', '4% O₂ and 16% CO₂'], a: 0, e: 'Lungs extract about one-quarter of inhaled O₂ (21% → ~16%) and raise CO₂ roughly 100-fold (0.04% → ~4%); that is why mouth-to-mouth resuscitation still supplies ~16% O₂!' },
      { l: 2, q: 'Why does carbon(II) oxide (CO) from generator exhaust in a closed room cause rapid fatal asphyxiation even when oxygen is present?', o: ['CO binds irreversibly with haemoglobin (~200× stronger affinity than O₂) to form stable carboxyhaemoglobin', 'CO solidifies inside bronchioles and mechanically seals the epiglottis', 'CO dissolves alveolar surfactant and turns blood plasma strongly alkaline', 'CO paralyses external intercostal muscles before entering red blood cells'], a: 0, e: 'Carbon monoxide forms cherry-red carboxyhaemoglobin with ~200–250× higher affinity than O₂, starving brain and heart tissues of oxygen.' },
      { l: 3, q: 'Woody dicot stems that lack epidermis and stomata exchange respiratory gases with the atmosphere through loose corky pores called:', o: ['Lenticels', 'Hydathodes', 'Pneumatophores', 'Plasmodesmata'], a: 0, e: 'Lenticels are raised, loosely packed cork pores on woody stems and roots permitting O₂/CO₂ diffusion; hydathodes exude liquid water drops (guttation).' },
      { l: 3, q: 'Guard cells curve apart to open the stomatal pore when turgid primarily because:', o: ['Their inner cellulose cell wall facing the pore is thicker and less elastic than their outer cell wall', 'Their outer wall is heavily lignified whereas their inner wall lacks cellulose', 'They lack chloroplasts and collapse inward whenever illuminated', 'Subsidiary epidermal cells pull them apart using contractile actin fibres'], a: 0, e: 'Differential wall thickness (thick inelastic inner wall bordering the pore + thin elastic outer wall) forces turgid bean-shaped guard cells to bow outward.' },
      { l: 4, q: 'At high altitude (e.g. Jos Plateau or Mount Kilimanjaro) where atmospheric partial pressure of oxygen is lower, how does the human body acclimatize over several weeks?', o: ['Kidneys secrete erythropoietin to stimulate bone marrow production of more red blood cells and haemoglobin', 'White blood cells synthesize chlorophyll to generate internal oxygen', 'The spleen destroys half of circulating erythrocytes to thin the blood', 'Alveolar walls thicken to five cell layers to trap inhaled air longer'], a: 0, e: 'Hypoxia triggers renal erythropoietin release, boosting erythrocyte count and haemoglobin oxygen-carrying capacity.' },
      { l: 5, q: 'Which brain region acts as the primary involuntary respiratory centre monitoring blood CO₂ / H⁺ concentration (pH) to regulate breathing rate?', o: ['Medulla oblongata (and pons)', 'Cerebellar cortex', 'frontal lobe of the cerebrum', 'Optic lobes of the midbrain'], a: 0, e: 'Chemoreceptors in the medulla oblongata detect tiny rises in arterial CO₂ (carbonic acid / H⁺ drop in pH) and immediately increase breathing rate and depth.' },
    ],
  },

  // 14. Excretory Mechanisms — Mammalian Nephron, Osmoregulation & Liver
  {
    id: 'b-kidney-liver',
    name: 'Mammalian Kidney Nephron & Liver Functions',
    sec: 'SS 2 · First Term · The Organism at Work',
    boss: 'Nephron, ADH & Liver Functions Test',
    goals: [
      'Trace urine formation across the nephron: glomerular ultrafiltration, selective reabsorption in the PCT, counter-current multiplier in Loop of Henle, and ADH action on collecting ducts',
      'Explain deamination of excess amino acids (ornithine/urea cycle), detoxification, bile production, and heat generation in the mammalian liver',
    ],
    trap: 'UREA is synthesized in the LIVER (by deamination of excess amino acids), NOT in the kidney — the kidney merely FILTERS and EXCRETES urea from blood!',
    parts: [
      {
        title: 'Nephron Ultrafiltration, Selective Reabsorption & ADH Osmoregulation',
        idea: 'High hydrostatic pressure in the glomerulus (afferent arteriole wider than efferent arteriole!) forces water, glucose, amino acids, salts, and urea into Bowman’s capsule while retaining blood cells and large plasma proteins.',
        rules: [
          '1. Ultrafiltration (Malpighian body = Glomerulus + Bowman’s capsule): filtrate = plasma MINUS RBCs, WBCs, platelets & large plasma proteins.',
          '2. Selective Reabsorption (Proximal Convoluted Tubule — PCT): 100% of GLUCOSE & amino acids + ~80% water/salts actively reabsorbed into peritubular capillaries! Glucose in urine = Diabetes mellitus (insulin lack).',
          '3. Loop of Henle: builds salty hypertonic medulla (desert kangaroo rats have EXTRA-LONG Loops of Henle to produce super-concentrated urine!).',
          '4. ADH (vasopressin from posterior pituitary): when dehydrated (high blood osmotic pressure), hypothalamus triggers MORE ADH → DCT & collecting ducts become MORE permeable to water → small volume of concentrated hypertonic urine!',
        ],
        ex: {
          q: 'A table shows fluid concentrations (g / 100 cm³): Protein [Plasma 7.0, Filtrate 0.0, Urine 0.0]; Glucose [Plasma 0.10, Filtrate 0.10, Urine 0.0]; Urea [Plasma 0.03, Filtrate 0.03, Urine 2.0]. Explain each row!',
          steps: [
            ['Protein (7.0 → 0.0): macromolecule too large to pass glomerular basement membrane', 'Proteinuria indicates damaged glomerular capillaries (nephritis).'],
            ['Glucose (0.10 → 0.10 → 0.0): filtered freely, then 100% actively reabsorbed in PCT', 'Healthy urine contains ZERO glucose.'],
            ['Urea (0.03 → 2.0, ~67× concentrated!): vast majority of water is reabsorbed along PCT, Loop of Henle, and collecting duct', 'Leaves urea highly concentrated in final urine.'],
          ],
        },
        tryit: {
          q: 'Why does drinking two litres of pure water on a cool morning result within an hour in large volumes of pale, dilute urine (diuresis)?',
          o: [
            'Lowered blood osmotic pressure inhibits ADH secretion from the pituitary, making collecting ducts less permeable to water',
            'High water intake stimulates massive ADH release, forcing glomeruli to pump glucose into urine',
            'Aldosterone widens the efferent arteriole until ultrafiltration stops completely',
            'Pure water denatures active sodium pumps inside the proximal convoluted tubule',
          ],
          a: 0,
          h: 'Less ADH (antidiuretic hormone) = less water reabsorbed from collecting ducts = dilute copious urine!',
          e: 'Hypotonic blood inhibits hypothalamic osmoreceptors → less ADH released → collecting ducts remain relatively impermeable to water → excess water is excreted.',
        },
      },
      {
        title: 'Homeostatic & Metabolic Functions of the Mammalian Liver',
        idea: 'Because the human body CANNOT store excess amino acids, the liver strips off their amino group (−NH₂) via DEAMINATION, converting toxic ammonia + CO₂ into non-toxic UREA via the ornithine cycle.',
        rules: [
          'Core Liver roles: (1) Deamination → Urea; (2) Carbohydrate regulation (Insulin: glucose → glycogen; Glucagon: glycogen → glucose); (3) Bile synthesis from worn-out RBC haemoglobin (bilirubin); (4) Detoxification of alcohol, drugs & H₂O₂ (via catalase!).',
          'Additional Liver roles: synthesizes plasma proteins (fibrinogen, prothrombin, albumin), stores Vitamins A, D, B₁₂ & Iron, forms RBCs in foetus, generates body heat.',
          'Liver diseases: Viral Hepatitis, Cirrhosis (fibrous scarring from chronic alcohol/toxins), Gallstones (crystallized cholesterol/bile salts blocking bile duct → obstructive jaundice).',
        ],
        ex: {
          q: 'Which blood vessel in a mammal carries blood with the HIGHEST concentration of urea shortly after a protein-rich meal?',
          steps: [
            ['Excess amino acids travel via Hepatic Portal Vein to the Liver', 'Liver deaminates them and synthesizes urea.'],
            ['Blood leaving the liver enters the HEPATIC VEIN', 'Therefore the Hepatic Vein (NOT renal artery!) has the highest urea concentration; the Renal Vein has the LOWEST urea concentration!'],
          ],
        },
        tryit: {
          q: 'In a healthy mammal, which blood vessel has the LOWEST concentration of urea?',
          o: [
            'Renal vein leaving the kidney after ultrafiltration and tubular excretion',
            'Hepatic vein leaving the liver after amino-acid deamination',
            'Renal artery entering the kidney cortex from the dorsal aorta',
            'Hepatic portal vein carrying digested peptones from the ileum',
          ],
          a: 0,
          h: 'Compare blood entering vs leaving the organ that removes urea into urine!',
          e: 'The kidney clears urea from arterial blood into urine, so purified blood exiting via the renal vein has the lowest urea concentration in the body.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'High hydrostatic pressure inside the mammalian glomerulus for ultrafiltration is generated primarily because:', o: ['The afferent arteriole entering the glomerulus has a wider lumen than the efferent arteriole leaving it', 'Bowman’s capsule walls contract rhythmically like a second heart', 'The renal vein pumps blood backward into the Loop of Henle', 'ADH constricts the ureter during every heartbeat'], a: 0, e: 'A wide afferent arteriole feeding into a narrower efferent arteriole creates a bottleneck that builds high glomerular capillary pressure.' },
      { l: 2, q: 'In which part of the kidney nephron is 100% of filtered glucose actively reabsorbed back into the bloodstream in a healthy person?', o: ['Proximal convoluted tubule (PCT)', 'Distal convoluted tubule (DCT)', 'Descending limb of Loop of Henle', 'Bowman’s capsule'], a: 0, e: 'Microvilli-lined cuboidal cells of the proximal convoluted tubule reabsorb all glucose, amino acids, and vitamins via Na⁺-coupled active transport.' },
      { l: 3, q: 'Desert-dwelling mammals such as the kangaroo rat survive without drinking liquid water partly because their kidneys possess:', o: ['Exceptionally long Loops of Henle extending deep into the medulla to maximize water reabsorption', 'Wide open Bowman’s capsules that prevent ultrafiltration completely', 'Zero glomeruli so urea is sweated out through keratinized scales', 'Short cortical nephrons that excrete hypotonic dilute urine'], a: 0, e: 'A longer Loop of Henle establishes a steeper medullary osmotic gradient, allowing the collecting duct (with ADH) to reabsorb maximum water.' },
      { l: 3, q: 'Diabetes insipidus — characterized by excretion of huge volumes of tasteless, sugar-free dilute urine and intense thirst — is caused by deficiency of:', o: ['Antidiuretic hormone (ADH / vasopressin) from the posterior pituitary', 'Insulin from the beta cells of the Islets of Langerhans', 'Thyroxine from the thyroid gland', 'Adrenaline from the adrenal medulla'], a: 0, e: 'Do NOT confuse Diabetes mellitus (lack of insulin → sugary urine) with Diabetes insipidus (lack of ADH → copious dilute sugar-free urine)!' },
      { l: 4, q: 'Yellowing of the sclera of the eyes and skin (jaundice) in newborn infants or patients with blocked bile ducts is caused by accumulation in blood of:', o: ['Bilirubin derived from the breakdown of haemoglobin from worn-out erythrocytes', 'Excess urea synthesized from deaminated muscle proteins', 'Glycogen granules leaking from pancreatic acinar cells', 'Uric acid crystals precipitated in synovial joints'], a: 0, e: 'When the liver or spleen breaks down aged red blood cells (~120 days lifespan), haem is converted to yellow-brown bilirubin; impaired conjugation or bile-duct blockage causes jaundice.' },
      { l: 5, q: 'Fresh liver homogenate dropped into hydrogen peroxide (H₂O₂) produces vigorous effervescence of oxygen gas because liver peroxisomes are rich in the detoxifying enzyme:', o: ['Catalase', 'Zymase', 'Urease', 'Ptyalin'], a: 0, e: 'Catalase rapidly decomposes toxic metabolic hydrogen peroxide (2H₂O₂ → 2H₂O + O₂↑) to protect cells from oxidative damage.' },
    ],
  },

  // 15. Homeostasis, Mammalian Skin & Endocrine Regulation
  {
    id: 'b-homeostasis-skin',
    name: 'Homeostasis, Mammalian Skin & Hormones',
    sec: 'SS 2 · Second Term · The Organism at Work',
    boss: 'Thermoregulation & Endocrine Glands Test',
    goals: [
      'Explain mammalian skin structure (cornified, granular, Malpighian epidermis + dermis) and thermoregulation on hot vs cold days',
      'Match major mammalian endocrine glands (pituitary, thyroid, pancreas Islets, adrenal, gonads) and plant phytohormones to their hormones and deficiency/excess disorders',
    ],
    trap: 'In heat, dermal arterioles DILATE (vasodilation) — blood capillaries do NOT physically “move closer to the skin surface” (a classic WAEC marking-scheme zero-mark phrase)!',
    parts: [
      {
        title: 'Mammalian Skin Anatomy & Hypothalamic Thermoregulation',
        idea: 'Endothermic (homoiothermic) mammals and birds maintain constant core temperature (~37 °C in humans) monitored by the HYPOTHALAMUS, using skin effectors for heat loss or conservation.',
        rules: [
          'Epidermis (3 layers): Cornified layer (dead keratinized waterproof barrier), Granular layer, Malpighian/germinative layer (actively dividing cells + MELANIN pigment against UV + Vitamin D synthesis!).',
          'Dermis: sweat glands, sebaceous glands (oily sebum keeps hair supple & mildly antiseptic), erector pili muscles, blood arterioles/capillaries, sensory nerve endings (Pacinian = pressure; Meissner = touch), adipose fat.',
          'HOT DAY: Vasodilation of dermal arterioles (more blood flows through superficial capillaries → radiant/convective heat loss) + heavy SWEATING (latent heat of vaporization cools skin!) + erector pili relax (hairs lie flat).',
          'COLD DAY: Vasoconstriction of dermal arterioles + sweating stops + erector pili contract (hairs stand upright trapping insulating air; goosebumps) + shivering (skeletal muscle heat) + higher metabolic rate.',
        ],
        ex: {
          q: 'Why does a person feel much hotter and more uncomfortable at 34 °C in coastal Lagos (90% relative humidity) than at 34 °C in dry Kano (20% relative humidity)?',
          steps: [
            ['Sweating cools the body ONLY when liquid sweat EVAPORATES (absorbing latent heat of vaporization from skin)', 'Merely dripping liquid sweat removes almost no heat!'],
            ['At 90% humidity in Lagos, air is nearly saturated with water vapour', 'Evaporation of sweat is severely slowed, whereas dry Kano air evaporates sweat rapidly.'],
          ],
        },
        tryit: {
          q: 'Which layer of the mammalian epidermis undergoes continuous mitotic division to replace worn-out surface cells AND synthesizes dark melanin pigment?',
          o: [
            'Malpighian (germinative) layer',
            'Dead keratinized cornified layer',
            'Subcutaneous adipose layer',
            'Sebaceous glandular layer',
          ],
          a: 0,
          h: 'The deepest living layer of the epidermis resting on the basement membrane!',
          e: 'The Malpighian layer contains actively dividing basal cells and melanocytes producing UV-protective melanin.',
        },
      },
      {
        title: 'Endocrine Glands, Negative Feedback & Plant Hormones',
        idea: 'Endocrine (ductless) glands secrete chemical messenger hormones directly into the bloodstream; blood glucose is held near ~90 mg/100 cm³ by antagonistic INSULIN and GLUCAGON.',
        rules: [
          'Pancreas (Islets of Langerhans — endocrine; acini = exocrine digestive!): Beta cells secrete INSULIN (lowers high blood glucose → glycogen in liver/muscle + faster cell uptake; deficiency = Diabetes mellitus). Alpha cells secrete GLUCAGON (raises low blood glucose: glycogen → glucose).',
          'Pituitary (“master gland”): Growth Hormone GH (childhood deficiency = pituitary dwarfism; childhood excess = gigantism; adult excess = acromegaly), TSH, FSH, LH, Oxytocin, ADH.',
          'Thyroid (needs IODINE!): Thyroxine controls basal metabolic rate & amphibian tadpole metamorphosis! Deficiency: cretinism (infants), myxoedema & simple goitre (adults); Excess: exophthalmic goitre (hyperthyroidism).',
          'Adrenal medulla (“fight or flight” emergency hormone): ADRENALINE increases heart rate, breathing, blood pressure, pupil dilation, and glycogenolysis. Plant hormones: Auxins (elongation/rooting), Gibberellins (stem bolting/breaking seed dormancy), Cytokinins (cell division/delaying leaf senescence), Ethene (fruit ripening), Abscisic acid (stomatal closure/dormancy).',
        ],
        ex: {
          q: 'If iodine is completely absent from the pond water in which frog tadpoles are reared, what developmental abnormality occurs and why?',
          steps: [
            ['Iodine is an indispensable atom in the hormone THYROXINE', 'Without iodine, the tadpole’s thyroid gland cannot synthesize thyroxine.'],
            ['Thyroxine triggers amphibian metamorphosis (tail reabsorption, limb growth, gill → lung switch)', 'The tadpoles fail to metamorphose into adult frogs and keep growing as giant aquatic tadpoles!'],
          ],
        },
        tryit: {
          q: 'Why is the mammalian pancreas described as BOTH an exocrine and an endocrine (heterocrine) gland?',
          o: [
            'It secretes alkaline digestive juice through the pancreatic duct into the duodenum AND secretes insulin and glucagon directly into bloodstream capillaries',
            'It synthesizes bile for the gall bladder by day and urea for the kidney by night',
            'It conducts nerve impulses along axons while storing lymph inside villus lacteals',
            'It regulates body temperature via sweat ducts and melanin granules simultaneously',
          ],
          a: 0,
          h: 'Exocrine = via a duct to a lumen/surface; Endocrine = ductless directly into blood!',
          e: 'Pancreatic acinar cells release amylase, trypsinogen, and lipase via the pancreatic duct (exocrine), while Islets of Langerhans secrete insulin and glucagon into blood (endocrine).',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Which hormone prepares a mammal instantaneously for “fright, flight, or fight” by accelerating heartbeat, dilating bronchioles, and converting liver glycogen to glucose?', o: ['Adrenaline (epinephrine)', 'Thyroxine', 'Insulin', 'Progesterone'], a: 0, e: 'Adrenaline from the adrenal medulla primes skeletal muscles, heart, and lungs within seconds during sudden danger or excitement.' },
      { l: 2, q: 'Endemic simple goitre (neck swelling of the thyroid gland) in inland highland populations is prevented most effectively by:', o: ['Fortifying household table salt with potassium iodate / iodide', 'Eliminating dietary carbohydrates and eating only animal fats', 'Taking daily oral injections of Vitamin C and iron', 'Drinking boiled rainwater free of dissolved calcium salts'], a: 0, e: 'Dietary iodine deficiency lowers thyroxine output, causing persistent pituitary TSH stimulation that enlarges the thyroid gland (simple goitre).' },
      { l: 3, q: 'Which plant hormone is a volatile gas commercially sprayed in ripening rooms to ripen green bananas, mangoes, and tomatoes uniformly?', o: ['Ethene (ethylene)', 'Indole-3-acetic acid (auxin)', 'Abscisic acid (ABA)', 'Zeatin (cytokinin)'], a: 0, e: 'Ethene (C₂H₄) is the natural gaseous phytohormone that activates cell-wall pectinases and starch-to-sugar conversion during climacteric fruit ripening.' },
      { l: 4, q: 'In a WAEC Biology answer on skin thermoregulation during hot weather, why is writing “capillaries move closer to the skin surface” penalized as wrong?', o: ['Blood vessels are fixed anatomically in the dermis; instead, muscular dermal arterioles dilate (vasodilation) to shunt more blood through existing surface capillaries', 'Capillaries actually migrate deeper into subcutaneous fat when warm', 'Epidermal cornified cells contain arteries that burst open in sunlight', 'Mammals are poikilothermic and allow core temperature to match air temperature'], a: 0, e: 'Capillaries never migrate physically; smooth muscle sphincters in arterioles relax (vasodilation), increasing blood flow through superficial capillary loops.' },
      { l: 4, q: 'Over-secretion of pituitary growth hormone (somatotropin) in an ADULT whose long-bone epiphyseal plates have already fused causes:', o: ['Acromegaly (thickening of jaw, brow, hands, and feet)', 'Pituitary dwarfism', 'Cretinism with severe mental retardation', 'Diabetes mellitus'], a: 0, e: 'Excess GH before puberty causes proportional gigantism, whereas excess GH after epiphyseal plate fusion causes acromegaly.' },
      { l: 5, q: 'Which pair of organisms are both ECTOTHERMIC (poikilothermic — body temperature fluctuates with ambient environment)?', o: ['Agama lizard and Tilapia fish', 'Domestic pigeon and Fruit bat', 'Spiny anteater and Whale', 'Human infant and Kangaroo rat'], a: 0, e: 'Fishes, amphibians, reptiles (Agama), and invertebrates are ectothermic/poikilothermic; ONLY birds and mammals (including bats and whales) are endothermic/homoiothermic.' },
    ],
  },

  // 16. Nervous Coordination — Neurones, Synapse, Reflex Arc & Brain
  {
    id: 'b-nervous',
    name: 'Nervous Coordination, Reflex Arc & Brain',
    sec: 'SS 2 · Second Term · The Organism at Work',
    boss: 'Neurones, Synapse & Brain Regions Test',
    goals: [
      'Compare sensory, relay (intermediate), and motor neurones, saltatory conduction across nodes of Ranvier, and chemical transmission across a synapse',
      'Trace a spinal reflex arc (receptor → sensory → dorsal root → relay in grey matter → ventral root → motor → effector) and map functions of cerebrum, cerebellum, medulla, and hypothalamus',
    ],
    trap: 'Sensory neurones enter the spinal cord via the DORSAL ROOT (where the dorsal root ganglion sits!), whereas motor axons exit via the VENTRAL ROOT!',
    parts: [
      {
        title: 'Neurones, Action Potential & Chemical Synapses',
        idea: 'Resting axon membranes are polarized (−70 mV inside, Na⁺ pumped out, K⁺ inside); a threshold stimulus opens voltage-gated Na⁺ channels (depolarization to +30 mV), and impulses leap rapidly from node to node (saltatory conduction) along myelinated fibres.',
        rules: [
          'Sensory (afferent) neurone: unipolar/pseudounipolar cell body in DORSAL ROOT GANGLION; carries impulses FROM receptor TO CNS.',
          'Relay (association/connector) neurone: entirely inside CNS grey matter (no myelin sheath). Motor (efferent) neurone: multipolar cell body in CNS grey matter, long myelinated axon TO muscle/gland effector.',
          'Synapse (microscopic gap): Ca²⁺ influx triggers presynaptic vesicles to release ACETYLCHOLINE → diffuses across cleft → binds postsynaptic receptors → acetylcholinesterase immediately hydrolyses acetylcholine so stimulation does not lock!',
          'Synapses enforce ONE-WAY impulse travel because neurotransmitter vesicles exist ONLY in presynaptic terminal knobs and receptors ONLY on the postsynaptic membrane.',
        ],
        ex: {
          q: 'Organophosphate insecticides inhibit the enzyme acetylcholinesterase at neuromuscular synapses. Predict what happens to an exposed insect.',
          steps: [
            ['Acetylcholine released into synaptic clefts cannot be broken down', 'Remains bound continuously to postsynaptic muscle receptors.'],
            ['Muscles undergo uncontrolled continuous tetanic spasm and respiratory paralysis', 'Insect dies rapidly from spastic paralysis.'],
          ],
        },
        tryit: {
          q: 'What is the functional significance of the fatty myelin sheath (secreted by Schwann cells) interrupted by nodes of Ranvier along a vertebrate motor axon?',
          o: [
            'Electrically insulates the axon and speeds impulse transmission ~50-fold via node-to-node saltatory conduction',
            'Synthesizes acetylcholine along the entire axon length to bypass synapses',
            'Allows nerve impulses to travel simultaneously in both directions from muscle to brain',
            'Replaces the sodium–potassium pump with passive osmosis of water',
          ],
          a: 0,
          h: 'Local action currents jump from one node of Ranvier to the next!',
          e: 'Myelin insulates internodes so depolarization occurs only at nodes of Ranvier (saltatory conduction), dramatically increasing conduction speed and saving ATP.',
        },
      },
      {
        title: 'Spinal Reflex Arc, Mammalian Brain & Autonomic Nervous System',
        idea: 'A simple spinal reflex (withdrawing finger from a hot iron, knee-jerk) bypasses conscious cerebral decision-making FIRST to minimize tissue damage, though parallel ascending tracts inform the brain milliseconds later.',
        rules: [
          'Spinal cord cross-section: INNER H-shaped butterfly = GREY MATTER (cell bodies + synapses); OUTER surround = WHITE MATTER (myelinated axons) — the EXACT OPPOSITE of cerebral hemispheres!',
          'Forebrain: Cerebrum (voluntary actions, memory, intelligence, speech, reasoning, conscious sensation); Olfactory lobes (smell); Hypothalamus (thermoregulation, osmoregulation, appetite, sleep, pituitary control).',
          'Midbrain: Optic lobes (visual reflexes, eye/head movement). Hindbrain: CEREBELLUM (muscular coordination, posture, balance — staggered drunken gait when alcohol depresses cerebellum!); MEDULLA OBLONGATA (involuntary heartbeat, breathing, blood pressure, swallowing, vomiting, coughing).',
          'Autonomic NS: Sympathetic (accelerates heart, dilates pupils/bronchi, inhibits peristalsis — emergency) vs Parasympathetic (vagus nerve slows heart, constricts pupils, stimulates digestion/salivation — rest & digest).',
        ],
        ex: {
          q: 'Write the exact 7-step anatomical pathway of a nerve impulse when a student accidentally steps barefoot on a sharp thumbtack.',
          steps: [
            ['1. Pain receptor in foot skin → 2. Dendron/axon of Sensory neurone (cell body in dorsal root ganglion)', 'Enters spinal cord via DORSAL ROOT.'],
            ['3. Synapse in spinal grey matter → 4. Relay (intermediate) neurone → 5. Motor neurone cell body', 'Motor axon exits spinal cord via VENTRAL ROOT.'],
            ['6. Neuromuscular junction → 7. Leg flexor muscle (effector) contracts to jerk foot upward', 'Fast protective spinal reflex completed in milliseconds!'],
          ],
        },
        tryit: {
          q: 'Damage to which specific part of the mammalian brain causes loss of muscular coordination, inability to walk in a straight line, and unsteady posture WITHOUT paralysing voluntary thought?',
          o: [
            'Cerebellum',
            'Cerebrum',
            'Olfactory lobe',
            'Corpus callosum',
          ],
          a: 0,
          h: 'Birds have an especially large version of this hindbrain organ for precision 3D flight balance!',
          e: 'The cerebellum integrates proprioceptive and inner-ear balance inputs to coordinate smooth posture and muscular balance.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Pavlov’s experiment in which dogs salivated upon hearing a bell that had repeatedly preceded meat powder illustrates a:', o: ['Conditioned (learned) reflex coordinated via the cerebrum', 'Simple innate spinal reflex arc', 'Tactic directional response (chemotaxis)', 'Nastic turgor movement'], a: 0, e: 'Salivating at food is an innate unconditioned reflex, whereas salivating at an arbitrary neutral stimulus (bell) after associative training is a Pavlovian conditioned reflex.' },
      { l: 2, q: 'How is grey matter arranged relative to white matter in the mammalian spinal cord compared with the cerebral hemispheres?', o: ['Spinal cord has inner H-shaped grey matter surrounded by outer white matter, whereas the cerebrum has outer grey cortex over inner white matter', 'Both spinal cord and cerebrum have outer grey matter and inner white matter', 'Spinal cord contains only white matter whereas the cerebrum contains only grey matter', 'Spinal cord has outer grey matter and inner hollow white ventricles'], a: 0, e: 'In the spinal cord and medulla, grey matter (cell bodies) lies centrally inside white matter; in the cerebrum and cerebellum, grey matter forms the folded outer cortex.' },
      { l: 3, q: 'Which division of the autonomic nervous system slows the heart rate via the vagus nerve, constricts the pupil, and stimulates salivary and digestive secretions during rest?', o: ['Parasympathetic nervous system', 'Sympathetic nervous system', 'Somatic cranial motor system', 'Pyramidal voluntary tract'], a: 0, e: 'Parasympathetic (“rest and digest”) nerves release acetylcholine to slow cardiac rate and promote digestion, acting antagonistically to sympathetic nerves.' },
      { l: 3, q: 'Compare hormonal (endocrine) coordination with nervous coordination in mammals:', o: ['Nervous impulses are rapid, electrical/synaptic, short-lived, and pinpoint, whereas hormonal messages are slower, blood-borne, longer-lasting, and widespread', 'Hormonal messages travel at 100 m s⁻¹ along axons whereas nerve impulses travel dissolved in blood plasma', 'Nervous responses control long-term bone growth whereas hormones trigger instant eye-blink reflexes', 'Both systems rely exclusively on myelin sheaths for transport'], a: 0, e: 'Nerve impulses travel rapidly along specific axons for split-second responses, while hormones circulate via blood for sustained metabolic/developmental regulation.' },
      { l: 4, q: 'Why is a severe fracture of the upper neck crushing the medulla oblongata almost instantaneously fatal?', o: ['The medulla oblongata houses the vital involuntary cardiac and respiratory centres controlling heartbeat and breathing', 'The medulla oblongata synthesizes all haemoglobin and clotting factors', 'Crushing the medulla immediately stops glomerular filtration in the kidneys', 'The medulla stores conscious childhood memories needed for walking'], a: 0, e: 'Destruction of medullary respiratory and vasomotor/cardiac centres immediately arrests breathing and blood-pressure regulation.' },
      { l: 5, q: 'At the peak of an action potential (+30 mV), repolarization of the axon membrane back toward −70 mV is driven immediately by:', o: ['Closing of voltage-gated Na⁺ channels and opening of voltage-gated K⁺ channels allowing K⁺ ions to diffuse rapidly outward', 'Rapid influx of large negatively charged protein anions from interstitial fluid', 'Breakdown of the myelin sheath at the node of Ranvier', 'Entry of acetylcholine molecules into the axoplasm'], a: 0, e: 'Depolarization is caused by Na⁺ rushing IN; immediate repolarization is caused by K⁺ rushing OUT through voltage-gated K⁺ channels, followed by Na⁺/K⁺-ATPase restoration.' },
    ],
  },

  // 17. Sense Organs — Mammalian Eye, Accommodation & Ear Balance
  {
    id: 'b-sense-organs',
    name: 'Sense Organs — Mammalian Eye & Ear',
    sec: 'SS 2 · Second Term · The Organism at Work',
    boss: 'Eye Accommodation, Defects & Ear Test',
    goals: [
      'Explain light refraction, pupil reflex, ciliary/suspensory ligament accommodation for near vs distant objects, rods vs cones, and lens corrections for myopia, hypermetropia, presbyopia, and astigmatism',
      'Trace sound transmission across the tympanum, three ear ossicles (malleus, incus, stapes), oval window, and cochlea, plus balance in semicircular canals and utriculus/sacculus',
    ],
    trap: 'To focus a NEAR object, the ring-like CILIARY MUSCLE CONTRACTS (moving inward!), which SLACKENS suspensory ligaments so the elastic lens bulges THICKER/MORE CONVEX!',
    parts: [
      {
        title: 'Mammalian Eye Structure, Accommodation & Optical Defects',
        idea: 'The cornea performs the greatest initial refraction of light, while the elastic crystalline lens fine-tunes focal length (accommodation); cones at the fovea (yellow spot) give sharp colour vision in bright light, whereas rods (containing rhodopsin/visual purple from Vitamin A) give dim-light black-and-white vision.',
        rules: [
          'NEAR OBJECT accommodation: Ciliary muscle CONTRACTS → Suspensory ligaments SLACKEN (loosen) → Elastic lens bulges THICK & MORE CONVEX (shorter focal length!).',
          'DISTANT OBJECT accommodation: Ciliary muscle RELAXES → Suspensory ligaments pulled TAUT → Lens pulled THIN & FLATTER (longer focal length).',
          'Bright light pupil reflex: Circular iris muscles contract + radial muscles relax → pupil CONSTRICTS. Dim light: Radial iris muscles contract → pupil DILATES.',
          'Myopia (short-sightedness — eyeball too long / lens too curved, focus falls IN FRONT of retina) → corrected with CONCAVE (diverging) lens! Hypermetropia (long-sightedness — eyeball too short, focus BEHIND retina) → corrected with CONVEX (converging) lens! Astigmatism (uneven corneal curvature) → CYLINDRICAL lens.',
        ],
        ex: {
          q: 'Why does a person walking from bright afternoon sunshine into a dark cinema room see almost nothing for the first 30 seconds, then gradually make out seats in shades of grey?',
          steps: [
            ['In bright sunlight, visual purple (rhodopsin) inside retinal RODS was bleached into retinal + opsin', 'Cones worked in bright light, but cinema light is below cone threshold.'],
            ['Dark adaptation: radial iris muscles dilate the pupil while rods enzymatic resynthesize rhodopsin (using Vitamin A)', 'Rods restore dim-light monochromatic sensitivity (no colour!).'],
          ],
        },
        tryit: {
          q: 'Which coordinated adjustment occurs inside the human eye when shifting gaze from a distant mountain to words on a book held 25 cm away?',
          o: [
            'Ciliary muscles contract, suspensory ligaments slacken, and the lens becomes thicker and more convex',
            'Ciliary muscles relax, suspensory ligaments tighten, and the lens becomes thinner and flatter',
            'Suspensory ligaments contract actively to squeeze the cornea into a sphere',
            'The retina moves backward toward the optic nerve blind spot',
          ],
          a: 0,
          h: 'Think of the ciliary body as a sphincter ring: when a ring muscle contracts, its inner diameter shrinks, loosening the radial strings (ligaments)!',
          e: 'Contracting the circular ciliary muscle relieves tension on the suspensory ligaments, allowing the naturally elastic lens to bulge into a fatter, more strongly converging shape.',
        },
      },
      {
        title: 'Mammalian Ear — Hearing (Cochlea) & Balance (Vestibular Apparatus)',
        idea: 'Three middle-ear ossicles (malleus/hammer → incus/anvil → stapes/stirrup) amplify tympanic vibrations ~20× onto the oval window to set cochlear endolymph vibrating, while the Eustachian tube equalizes air pressure on both sides of the eardrum.',
        rules: [
          'Hearing pathway: Pinna → External auditory meatus → Tympanic membrane (eardrum) → Malleus → Incus → Stapes → Oval window (fenestra ovalis) → Perilymph/Endolymph in COCHLEA → Organ of Corti hair cells → Auditory nerve → Temporal lobe.',
          'Eustachian tube connects middle ear to pharynx: swallowing/yawning during aircraft ascent/descent opens it to equalize pressure across the eardrum!',
          'Dynamic balance (head rotation/angular acceleration in 3 planes): THREE SEMICIRCULAR CANALS (ampullae + cupula). Static balance (gravity & head tilt): UTRICULUS & SACCULUS (otoliths / chalky granules on maculae).',
        ],
        ex: {
          q: 'Why does a severe throat infection (pharyngitis) sometimes spread to cause painful middle-ear inflammation (otitis media) and temporary muffled hearing in children?',
          steps: [
            ['The Eustachian tube directly links the nasopharynx (throat) to the air-filled middle ear', 'Pathogenic bacteria/mucus can ascend this tube into the middle ear cavity.'],
            ['Fluid build-up and blocked Eustachian tube prevent pressure equalization', 'Dampens free vibration of the eardrum and three ossicles.'],
          ],
        },
        tryit: {
          q: 'Which inner-ear structure contains sensory hair cells (Organ of Corti) that transduce mechanical fluid vibrations into auditory nerve impulses, and which structure detects rotational balance?',
          o: [
            'Cochlea for hearing; semicircular canals for rotational balance',
            'Semicircular canals for hearing; Eustachian tube for rotational balance',
            'Tympanic membrane for hearing; stapes ossicle for static balance',
            'Pinna for hearing; round window for gravitational balance',
          ],
          a: 0,
          h: 'Snail-coiled cochlea = hearing; 3 mutually perpendicular semicircular canals = dynamic rotation!',
          e: 'The coiled cochlea houses the Organ of Corti for hearing, while the three mutually perpendicular semicircular canals detect rotational head movements.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'A student can read chalkboard notes clearly from the back of the classroom without glasses, but text in a textbook held at reading distance looks blurry because rays converge BEHIND her retina. Which defect and corrective lens apply?', o: ['Hypermetropia (long-sightedness); corrected with a convex (converging) spectacle lens', 'Myopia (short-sightedness); corrected with a concave (diverging) spectacle lens', 'Astigmatism; corrected with a plane tinted sunglass lens', 'Cataract; corrected by severing the optic nerve'], a: 0, e: 'Long-sightedness (hypermetropia) focuses near rays behind the retina; a convex (converging) lens adds refractive power to bring the image forward onto the retina.' },
      { l: 2, q: 'Which point on the mammalian retina has the HIGHEST density of cones for acute daytime colour vision, and which point has ZERO photoreceptors?', o: ['Fovea centralis (yellow spot) has maximum cones; Blind spot (optic disc) has zero photoreceptors', 'Blind spot has maximum cones; Choroid coat has zero photoreceptors', 'Ciliary body has maximum cones; Aqueous humour has rods only', 'Conjunctiva has maximum cones; Fovea has rods only'], a: 0, e: 'The fovea centralis is packed exclusively with cones for sharpest acuity, while the blind spot (where optic nerve fibres exit) lacks both rods and cones.' },
      { l: 3, q: 'Arrange the three mammalian middle-ear ossicles in exact anatomical sequence from the tympanic membrane (eardrum) inward to the oval window:', o: ['Malleus (hammer) → Incus (anvil) → Stapes (stirrup)', 'Stapes → Incus → Malleus', 'Incus → Malleus → Stapes', 'Malleus → Cochlea → Stapes'], a: 0, e: 'Memory hook: MIS — Malleus touches the eardrum, articulates with Incus, and Stapes presses on the oval window.' },
      { l: 3, q: 'Why do passengers chew gum or swallow repeatedly when an aeroplane climbs or descends rapidly?', o: ['To open the Eustachian tube and equalize air pressure between the middle ear and external atmosphere across the eardrum', 'To pump endolymph out of the cochlea into the auditory meatus', 'To stiffen the three ossicles against ultrasonic engine noise', 'To lubricate the semicircular canals with saliva'], a: 0, e: 'Swallowing pops open the pharyngeal end of the Eustachian tube so middle-ear air pressure matches cabin pressure, preventing painful eardrum bulging.' },
      { l: 4, q: 'Nocturnal mammals such as bushbabies and owls see remarkably well in moonlight but poorly distinguish colours because their retinas contain:', o: ['An overwhelming predominance of rhodopsin-rich rods and very few cones', 'Exclusively red, green, and blue cones with zero rods', 'Opaque lenses that block all visible light except ultraviolet', 'Chlorophyll pigments inside the choroid layer'], a: 0, e: 'Rods have high sensitivity (many rods converge onto one bipolar neurone) for low-light scotopic vision, whereas cones require bright light for colour.' },
      { l: 5, q: 'Presbyopia in elderly adults — difficulty focusing on near print despite lifelong normal eyesight — results primarily from:', o: ['Gradual loss of elasticity of the crystalline lens and weakening of ciliary muscles with age', 'Sudden elongation of the eyeball to twice its normal diameter', 'Bacterial infection of the conjunctiva', 'Over-production of Vitamin A in the Malpighian layer'], a: 0, e: 'With age, the crystalline lens hardens (loses elasticity) and cannot bulge sufficiently for near objects; convex/bifocal reading glasses restore near focus.' },
    ],
  },

  // 18. Aquatic, Estuarine & Terrestrial Habitats + Ecological Succession
  {
    id: 'b-aquatic-terrestrial',
    name: 'Habitats, Plant Adaptations & Succession',
    sec: 'SS 2 · Third Term · The Organism & Its Environment',
    boss: 'Habitats, Xerophytes & Succession Test',
    goals: [
      'Compare osmoregulatory challenges in freshwater (Amoeba, Tilapia) vs marine bony fishes, plus estuarine brackish adaptations',
      'Distinguish anatomical adaptations of hydrophytes, mesophytes, xerophytes, and halophytes, and contrast primary vs secondary ecological succession',
    ],
    trap: 'Marine bony fish live in HYPERTONIC seawater (~3.5% salt) so they lose water osmotically — they MUST drink seawater continuously and excrete scanty concentrated urine + pump excess salt out via gill chloride cells!',
    parts: [
      {
        title: 'Freshwater, Marine & Estuarine Osmoregulation + Hydrophytes vs Xerophytes',
        idea: 'Freshwater is hypotonic to body fluids (organisms face water flooding IN), whereas seawater is hypertonic (bony fishes face dehydration OUT); plants adapt leaf/cuticle/root anatomy to match water availability.',
        rules: [
          'Freshwater Tilapia: does NOT drink water; absorbs salts actively via gills; large glomeruli produce COPIOUS DILUTE urine. Marine bony fish: DRINKS seawater; small/few glomeruli produce SCANTY CONCENTRATED urine; secretes excess salts via gills.',
          'Hydrophytes (Water lily Nymphaea, Pistia water lettuce, Ceratophyllum, Elodea): large air spaces (AERENCHYMA) for buoyancy & O₂ diffusion, poorly developed xylem & cuticle, stomata on UPPER epidermis ONLY (floating leaves) or absent (submerged)!',
          'Xerophytes (Opuntia cactus, Euphorbia, Aloe, Acacia): leaves reduced to SPINES, green fleshy stem (phylloclade) stores water & photosynthesizes, thick waxy cuticle, SUNKEN stomata in hairy pits, deep extensive roots.',
        ],
        ex: {
          q: 'Compare stomatal distribution, cuticle thickness, and xylem development in a floating water-lily leaf (hydrophyte) vs a desert cactus (xerophyte).',
          steps: [
            ['Water lily (hydrophyte): stomata restricted to UPPER surface exposed to air; thin/absent waxy cuticle; minimal xylem', 'Supported by water buoyancy with unlimited water beneath.'],
            ['Opuntia cactus (xerophyte): leaves modified into non-transpiring spines; thick waxy stem cuticle; sunken stomata (often opening at night — CAM!)', 'Minimizes transpirational water loss in arid desert heat.'],
          ],
        },
        tryit: {
          q: 'Which anatomical feature is characteristic of submerged or floating aquatic hydrophytes such as Pistia (water lettuce) and Nymphaea (water lily)?',
          o: [
            'Extensive intercellular air spaces (aerenchyma) providing buoyancy and internal gas transport, with reduced xylem',
            'Leaves modified into sharp lignified spines with deeply sunken stomata on the lower epidermis',
            'Massive secondary thickening of woody xylem vessels and a 40-metre taproot',
            'Thick suberized cork bark protecting aerial shoots against annual bush fires',
          ],
          a: 0,
          h: 'How do water plants float on lagoons without needing heavy woody xylem?',
          e: 'Hydrophytes possess spongy aerenchyma tissue for buoyancy and internal O₂ diffusion to submerged roots, alongside poorly developed xylem and thin cuticles.',
        },
      },
      {
        title: 'Primary vs Secondary Ecological Succession',
        idea: 'Ecological succession is the orderly, directional replacement of communities over time until a stable self-perpetuating CLIMAX COMMUNITY is reached.',
        rules: [
          'PRIMARY Succession: starts on a sterile, lifeless substrate with ZERO pre-existing soil (bare volcanic lava rock, newly formed sandbar) → very slow (hundreds/thousands of years). Pioneer colonizers on bare rock = CRUSTOSE LICHENS → mosses → ferns/herbs → shrubs → climax forest!',
          'SECONDARY Succession: starts on disturbed land where SOIL, humus, seeds, and underground rootstocks ALREADY EXIST (abandoned farmland, burnt savanna, felled forest clearing) → MUCH FASTER!',
          'As succession progresses from pioneers to climax: species diversity, biomass, food-web complexity, and humus depth all INCREASE.',
        ],
        ex: {
          q: 'Why is secondary succession on an abandoned cassava farm in Ogun State much faster than primary succession on a newly cooled basalt lava flow?',
          steps: [
            ['Bare lava rock has zero soil, humus, mineral clay, or seed bank', 'Pioneer lichens must first weather rock chemically over centuries to form thin soil.'],
            ['Abandoned cassava farmland already retains fertile topsoil, microbial decomposers, dormant weed seeds (Chromolaena, Tridax), and tree stumps', 'Herbaceous pioneers germinate within days!'],
          ],
        },
        tryit: {
          q: 'In classic xerosere (bare-rock) primary succession, which pioneer organisms colonize bare rock first by secreting weak organic acids that weather rock minerals into primitive soil?',
          o: [
            'Crustose lichens',
            'Hardwood mahogany trees',
            'Perennial tussock grasses',
            'Woody climbing lianas',
          ],
          a: 0,
          h: 'They survive extreme desiccation without soil or roots, combining algal photosynthesis with fungal rock anchorage!',
          e: 'Drought-hardy lichens colonize bare rock first, etching mineral grains with organic acids and trapping dust/humus so mosses can follow.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Estuarine habitats (such as Lagos Lagoon creeks and Niger Delta estuaries where river water meets the sea) are ecologically stressful primarily because organisms must tolerate:', o: ['Wide daily tidal fluctuations in salinity, turbidity, and water level', 'Permanent sub-zero freezing temperatures throughout the year', 'Complete absence of mineral nutrients and organic detritus', 'Constant salinity higher than the Dead Sea'], a: 0, e: 'Estuaries mix fresh river water and salty ocean tides, creating brackish water whose salinity rises at high tide/dry season and drops at low tide/rainy season.' },
      { l: 2, q: 'In which marine ocean zone does ALL phytoplankton photosynthesis take place?', o: ['Euphotic (sunlit upper ~200 m) zone', 'Abyssal benthic zone (4,000 m depth)', 'Aphotic bathyal zone', 'Hadal trench zone'], a: 0, e: 'Sunlight sufficient for photosynthesis penetrates only the upper ~200 m euphotic zone; deeper aphotic/abyssal zones depend on organic detritus sinking from above.' },
      { l: 3, q: 'How does a freshwater bony fish (e.g. <i>Tilapia</i>) maintain osmotic balance in hypotonic river water?', o: ['Does not drink water, actively absorbs ions via gill chloride cells, and excretes large volumes of very dilute urine', 'Drinks large gulps of river water and excretes dry uric acid crystals', 'Maintains high blood urea like a marine shark to stay hypertonic', 'Closes its gill opercula permanently to block endosmosis'], a: 0, e: 'Because freshwater continuously enters across gill membranes by endosmosis, freshwater teleosts expel copious hypotonic urine and actively pump Na⁺/Cl⁻ inward.' },
      { l: 3, q: 'Why do leaves of floating water lily (<i>Nymphaea</i>) bear stomata ONLY on their upper epidermis?', o: ['The lower epidermis rests directly on liquid water while only the upper epidermis contacts atmospheric air', 'Sunlight destroys guard cells whenever they form on shaded surfaces', 'Fish graze selectively on lower stomatal guard cells', 'Water lilies absorb CO₂ exclusively through root hairs in mud'], a: 0, e: 'A floating leaf’s underside is submerged on water, so gas exchange with atmospheric air is only possible across the waxy upper surface.' },
      { l: 4, q: 'Re-growth of vegetation on a parcel of Guinea savanna after an annual harmattan bush fire is an example of:', o: ['Secondary ecological succession because intact soil, ash minerals, rhizomes, and seeds remain', 'Primary ecological succession starting from sterile bedrock', 'Retrogressive extinction leading to permanent bare rock', 'Adaptive radiation of pioneer crustose lichens'], a: 0, e: 'Because soil, subterranean grass rhizomes, and fire-resistant tree rootstocks survive the fire, rapid secondary succession ensues.' },
      { l: 5, q: 'In <i>Opuntia</i> (prickly-pear cactus), which organ is modified to perform photosynthesis while leaves are reduced to spines?', o: ['Flattened green succulent stem (phylloclade)', 'Subterranean fibrous root cap', 'Lignified flower calyx', 'Suberized cork lenticel'], a: 0, e: 'Cacti reduce leaves to protective non-transpiring spines while the swollen, chlorophyllous stem (phylloclade) stores mucilaginous water and photosynthesizes.' },
    ],
  },

  // 19. Environmental Pollution, Conservation & Pest/Disease Control
  {
    id: 'b-pollution-cons',
    name: 'Pollution, Conservation & Biological Control',
    sec: 'SS 2 · Third Term · The Organism & Its Environment',
    boss: 'Eutrophication, BOD & Conservation Test',
    goals: [
      'Trace the exact sequence of cultural eutrophication and Biochemical Oxygen Demand (BOD) when raw sewage or nitrate/phosphate fertilizer enters a river',
      'Distinguish ozone depletion (CFCs) from the greenhouse effect (CO₂, CH₄), identify major Nigerian Game Reserves/National Parks, and apply biological pest control',
    ],
    trap: 'Untreated sewage/fertilizer does NOT poison fish directly first — it causes algal blooms → dead algae/organic matter decompose via aerobic bacteria → HIGH BOD strips dissolved O₂ → fish suffocate!',
    parts: [
      {
        title: 'Water/Air Pollution, Eutrophication, BOD & Crude-Oil Spills',
        idea: 'Biochemical Oxygen Demand (BOD) measures the oxygen needed by aerobic microbes to decompose organic waste in water: high raw sewage = HIGH BOD = LOW dissolved O₂ = suffocation of clean-water fish!',
        rules: [
          'Eutrophication sequence: Nitrate/phosphate run-off → explosive algal bloom blocks light to submerged plants → plants & algae die → saprophytic aerobic bacteria multiply rapidly (BOD spikes!) → dissolved O₂ plummets → fish & gill-breathing invertebrates die of hypoxia.',
          'Air pollutants: SO₂ & NO₂ → acid rain (corrodes limestone, leaches soil Al³⁺, kills lichens — lichens are bio-indicators of clean SO₂-free air!); CFCs → destroy stratospheric OZONE (O₃) shield, increasing UV skin cancer/cataracts; CO₂ & CH₄ → trap outgoing IR heat (Greenhouse effect / global warming).',
          'Bioaccumulation / Biomagnification: non-biodegradable pesticides (DDT) and heavy metals (mercury — Minamata disease; lead) concentrate at progressively HIGHER levels up food chains, peaking in apex fish-eating birds/humans!',
        ],
        ex: {
          q: 'Crude oil spills on a Niger Delta creek. Explain TWO distinct physical/biological ways the oil film kills aquatic life.',
          steps: [
            ['Surface oil slick blocks atmospheric oxygen diffusion AND blocks sunlight', 'Phytoplankton photosynthesis stops while dissolved O₂ drops sharply.'],
            ['Coats fish gills and waterbird feathers + toxic hydrocarbon poisoning', 'Destroys feather waterproofing/insulation in birds and clogs respiratory surfaces.'],
          ],
        },
        tryit: {
          q: 'When raw domestic sewage is discharged into a slow-flowing stream, what happens immediately downstream of the outfall pipe?',
          o: [
            'Aerobic bacterial numbers and Biochemical Oxygen Demand (BOD) surge sharply, causing dissolved oxygen and clean-water fish populations to plummet',
            'Dissolved oxygen rises to 100% saturation while bacterial decomposer numbers fall to zero',
            'Biochemical Oxygen Demand drops to zero as sewage sterilizes all aquatic microbes',
            'DDT is synthesized spontaneously by green algae in the presence of urea',
          ],
          a: 0,
          h: 'Remember the inverse relationship between BOD (bacterial O₂ demand) and remaining dissolved O₂!',
          e: 'Organic sewage fuels explosive growth of aerobic bacteria (high BOD), stripping dissolved O₂ from the water and suffocating clean-water fish like trout/tilapia.',
        },
      },
      {
        title: 'Conservation of Natural Resources, Nigerian Reserves & Biological Control',
        idea: 'Conservation ensures sustainable wise management of renewable resources (forests, wildlife, soil, fisheries) and prudent protection of non-renewable fossil/mineral reserves; biological control introduces a pest’s natural predator/parasite without chemical pollution.',
        rules: [
          'Major Nigerian Game Reserves / National Parks (high-yield JAMB/WAEC!): Yankari (Bauchi State), Kainji Lake / Borgu (Niger/Kwara), Cross River / Oban (Cross River), Old Oyo (Oyo), Gashaka-Gumti (Taraba/Adamawa — Nigeria’s largest National Park!), Okomu (Edo).',
          'Renewable resources: forests, wildlife, fisheries, water, fertile soil, solar/wind energy. Non-renewable: crude oil (petroleum), coal, natural gas, tin, columbite, limestone.',
          'Biological pest control: introducing Gambusia / Tilapia / guppies into ponds to eat mosquito larvae, ladybird beetles to eat aphids, or cats against barn rats — highly specific, biodegradable, NO biomagnification (unlike DDT), though must be tested so the predator does not attack non-target native species.',
        ],
        ex: {
          q: 'In an estuary polluted with trace DDT (0.0001 ppm in water), plankton contain 0.04 ppm, small fish 0.5 ppm, large predatory fish 2.0 ppm, and fish-eating ospreys 25 ppm. Name and explain this phenomenon.',
          steps: [
            ['Biomagnification (trophic bioaccumulation)', 'DDT is fat-soluble and non-biodegradable, so organisms cannot excrete or metabolize it.'],
            ['Each predator eats hundreds of contaminated prey over its lifetime', 'Retaining nearly 100% of prey DDT in adipose tissue concentrates toxin at apex trophic levels (thinning eggshells in birds of prey!).'],
          ],
        },
        tryit: {
          q: 'Which of the following pairs correctly matches a major Nigerian wildlife conservation area with the state in which it is located?',
          o: [
            'Yankari Game Reserve — Bauchi State',
            'Yankari Game Reserve — Lagos State',
            'Okomu National Park — Sokoto State',
            'Kainji Lake National Park — Rivers State',
          ],
          a: 0,
          h: 'Yankari (with Wikki Warm Springs!) is Nigeria’s most famous game reserve in the North-East.',
          e: 'Yankari Game Reserve is in Bauchi State; Kainji Lake (Borgu/Zugurma) is in Niger/Kwara; Okomu is in Edo; Cross River NP is in Cross River; Gashaka-Gumti is in Taraba/Adamawa.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Chlorofluorocarbons (CFCs) formerly used in aerosols and refrigerators pose a global environmental hazard primarily because they:', o: ['Deplete the stratospheric ozone (O₃) layer that shields life from mutagenic ultraviolet radiation', 'Combine with haemoglobin to cause immediate carbon monoxide poisoning', 'Cause eutrophication of freshwater lakes by supplying soluble nitrates', 'Prevent acid rain by neutralizing atmospheric sulphur(IV) oxide'], a: 0, e: 'UV light splits CFCs in the stratosphere, releasing chlorine free radicals that catalytically destroy ozone (O₃ → O₂) and allow harmful UV-B to reach Earth.' },
      { l: 2, q: 'Introducing larvivorous fish (such as <i>Tilapia</i> or <i>Gambusia</i>) into ornamental ponds to eradicate <i>Anopheles</i> mosquito larvae is an example of:', o: ['Biological pest control', 'Chemical fumigation', 'Cultural crop rotation', 'Biomagnification'], a: 0, e: 'Using a natural predator, parasite, or pathogen to suppress a pest or vector population without synthetic chemicals is biological control.' },
      { l: 3, q: 'Complete disappearance of bushy lichens from tree trunks around a newly built coal-fired factory indicates severe air pollution by:', o: ['Sulphur(IV) oxide (SO₂)', 'Nitrogen gas (N₂)', 'Water vapour (H₂O)', 'Oxygen gas (O₂)'], a: 0, e: 'Lichens absorb rainwater directly across their thallus and are exquisitely sensitive bio-indicators of atmospheric SO₂ / acid rain.' },
      { l: 3, q: 'Which of the following groups consists EXCLUSIVELY of non-renewable natural resources?', o: ['Crude petroleum, coal, natural gas, and tin ore', 'Timber forests, wild game animals, and freshwater fish', 'Solar radiation, wind energy, and rainwater', 'Soil humus, grazing pasture, and bamboo'], a: 0, e: 'Fossil fuels (petroleum, coal, natural gas) and metallic mineral ores take millions of years to form geologically and cannot regenerate on human timescales.' },
      { l: 4, q: 'Spreading a thin film of kerosene or engine oil on stagnant domestic gutter puddles controls malaria transmission because it:', o: ['Lowers surface tension and blocks the respiratory siphons of mosquito larvae and pupae so they suffocate', 'Acts as a genetic mutagen sterilizing adult male mosquitoes on contact', 'Fertilizes green algae that poison <i>Plasmodium</i> sporozoites in human blood', 'Raises water pH to 14 to dissolve mosquito chitin'], a: 0, e: 'Mosquito larvae and pupae hang from the water surface film breathing atmospheric air via siphons/trumpets; oil blocks their spiracles and reduces surface tension.' },
      { l: 5, q: 'Afforestation and shelter-belt tree planting across northern Nigeria (e.g. Sokoto, Katsina, Borno) are carried out primarily to combat:', o: ['Desertification and wind-driven soil erosion along the Sahel margin', 'Coastal saltwater intrusion from the Atlantic Ocean', 'Stratospheric ozone destruction over Antarctica', 'Volcanic ash deposition on mountain slopes'], a: 0, e: 'Shelter-belt windbreaks bind loose topsoil with roots and break harmattan wind velocity, halting southward desert encroachment (desertification).' },
    ],
  },

  // 20. Reproductive Systems in Flowering Plants, Pollination & Seed Dispersal
  {
    id: 'b-flower-pollination',
    name: 'Flowering Plant Reproduction & Germination',
    sec: 'SS 2 · Third Term · Continuity of Life',
    boss: 'Flowers, Double Fertilization & Germination Test',
    goals: [
      'Identify the four floral whorls, placentation types (marginal, axile, parietal, free-central, basal), and insect- vs wind-pollinated flower adaptations',
      'Trace angiosperm double fertilization (2n zygote + 3n endosperm), fruit/seed dispersal mechanisms, and epigeal (cowpea) vs hypogeal (maize) germination',
    ],
    trap: 'After fertilization, the OVULE develops into the SEED (integuments → testa), whereas the entire OVARY develops into the FRUIT (ovary wall → pericarp)!',
    parts: [
      {
        title: 'Floral Whorls, Pollination Syndromes & Double Fertilization',
        idea: 'Angiosperm flowers bear four whorls on a receptacle: Calyx (sepals), Corolla (petals), Androecium (male stamens = filament + anther), and Gynoecium/Pistil (female carpels = stigma + style + ovary).',
        rules: [
          'Entomophilous (insect-pollinated — Hibiscus, Pride of Barbados, Crotalaria): large brightly coloured scented petals, nectar guides, sticky/spiny heavy pollen grains, compact sticky stigma inside flower.',
          'Anemophilous (wind-pollinated — Maize Zea mays, Guinea grass, Rice): dull green/brown inconspicuous bracts, NO scent/nectar, anthers hang out on long versatile filaments, millions of smooth light dry pollen grains, large FEATHERY stigma!',
          'Angiosperm DOUBLE FERTILIZATION: Pollen tube delivers TWO male gamete nuclei via micropyle into embryo sac — (1) 1st male nucleus (n) + egg cell (n) → Diploid ZYGOTE (2n → embryo); (2) 2nd male nucleus (n) + diploid secondary/two polar nuclei (2n) → TRIPLOID PRIMARY ENDOSPERM NUCLEUS (3n → nutritive endosperm)!',
        ],
        ex: {
          q: 'If the diploid somatic chromosome number of a maize plant is 2n = 20, state the exact chromosome number in its: (i) pollen grain nucleus, (ii) zygote, (iii) endosperm cell, and (iv) pericarp wall cell.',
          steps: [
            ['Pollen grain (haploid male gametophyte, n) = 10 chromosomes', 'Formed by meiosis in anther pollen mother cells.'],
            ['Zygote (2n = n + n) = 20 chromosomes; Pericarp (maternal ovary wall, 2n) = 20 chromosomes', 'Diploid sporophyte tissues.'],
            ['Endosperm cell (3n = male n + 2 polar nuclei n + n) = 30 chromosomes!', 'Classic JAMB trap — angiosperm endosperm is TRIPLOID (3n)!'],
          ],
        },
        tryit: {
          q: 'Which combination of floral features adapts maize (Zea mays) tassel and cob flowers specifically for wind pollination (anemophily)?',
          o: [
            'Long pendulous anthers shedding vast quantities of light smooth pollen and long feathery stigmas (silks) exposed outside bracts',
            'Brightly coloured crimson petals with sweet nectar guides and sticky spiny pollen grains',
            'Tubular scented corollas enclosing short stiff stamens visited by sunbirds',
            'Cleistogamous subterranean buds that never open to release pollen',
          ],
          a: 0,
          h: 'Maize “silks” protruding from the cob are giant feathery stigmas/styles catching airborne pollen!',
          e: 'Wind-pollinated grass/maize flowers lack showy petals/nectar and instead hang versatile anthers in the breeze while feathery stigmas trap drifting dry pollen.',
        },
      },
      {
        title: 'Placentation, Fruit/Seed Dispersal & Epigeal vs Hypogeal Germination',
        idea: 'Placentation is the arrangement of ovules inside the ovary; mature fruits/seeds disperse by wind, water, animals, or explosive self-dehiscence, then germinate when given WATER, OXYGEN, and OPTIMUM TEMPERATURE.',
        rules: [
          'Placentation examples: Marginal (Cowpea, Pride of Barbados, Crotalaria — 1 carpel pod); Axile (Tomato, Hibiscus, Orange — multilocular central axis); Parietal (Pawpaw Carica papaya, Mustard — outer wall); Free-central (Waterleaf Talinum, Primrose).',
          'Dispersal: Wind (Tridax pappus parachute, Cotton floss, Tecoma/Combretum wings); Water (Coconut fibrous air-filled mesocarp, Water lily aril); Animal hooks/barbs (Desmodium, Bidens, Achyranthes, Boerhavia sticky glands) or fleshy edible (Mango, Guava, Tomato); Explosive mechanism (Pride of Barbados, Balsam, Oil bean Pentaclethra, Para rubber, Okra).',
          'EPIGEAL germination (Cowpea, Groundnut, Castor oil, Melon): HYPOCOTYL elongates rapidly, pulling cotyledons ABOVE soil! HYPOGEAL germination (Maize, Rice, Guinea corn, Oil palm, Yam bean): EPICOTYL elongates while cotyledon remains BELOW soil!',
          'Note: Light is NOT universally required for seed germination (most seeds germinate equally well in darkness given Water + O₂ + Warmth)!',
        ],
        ex: {
          q: 'In a germination setup: Tube A has moist cotton wool at 28 °C; Tube B has dry cotton wool at 28 °C; Tube C has boiled cooled water covered with oil at 28 °C; Tube D has moist cotton wool in a refrigerator at 2 °C. Which seeds germinate and why?',
          steps: [
            ['ONLY Tube A germinates (has Water + O₂ + Warmth 28 °C)', 'Water activates hydrolytic enzymes (diastase/amylase) and ruptures testa.'],
            ['Tube B lacks water; Tube C lacks O₂ (for aerobic ATP); Tube D lacks warmth (enzymes inactive at 2 °C)', 'Proves all three external conditions are simultaneously indispensable!'],
          ],
        },
        tryit: {
          q: 'How does epigeal germination in cowpea (Vigna unguiculata) differ anatomically from hypogeal germination in maize (Zea mays)?',
          o: [
            'In cowpea the hypocotyl elongates to carry cotyledons above ground, whereas in maize the epicotyl elongates leaving the cotyledon below ground',
            'In cowpea the epicotyl pushes roots upward, whereas in maize the radicle turns into a green leaf',
            'Cowpea germinates without oxygen, whereas maize germinates without water',
            'Cowpea cotyledons are triploid (3n), whereas maize lacks an embryo',
          ],
          a: 0,
          h: 'Epi = above ground (hypocotyl lifts cotyledons); Hypo = below ground (epicotyl lifts plumule alone)!',
          e: 'Rapid hypocotyl elongation hooks and lifts cowpea cotyledons above soil (epigeal), whereas rapid epicotyl elongation leaves the maize scutellum/cotyledon underground (hypogeal).',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Transverse section of a ripe pawpaw (<i>Carica papaya</i>) fruit shows hundreds of seeds attached along the inner peripheral wall of a single-chambered ovary, illustrating:', o: ['Parietal placentation', 'Axile placentation', 'Marginal placentation', 'Basal placentation'], a: 0, e: 'Pawpaw exhibits parietal placentation; tomato/orange/hibiscus show axile; cowpea/flamboyant show marginal; waterleaf shows free-central.' },
      { l: 2, q: 'Why does a ripe coconut fruit float across ocean currents for weeks and still germinate on a distant sandy beach?', o: ['Its thick fibrous mesocarp traps air pockets for buoyancy while its hard waterproof endocarp protects the embryo from saltwater', 'Its pappus of fine silky hairs carries it high in trade winds', 'Sea gulls swallow the entire coconut and excrete intact seeds', 'Its dry pod splits explosively to hurl the nut across lagoons'], a: 0, e: 'Coconut is classic hydrochory (water dispersal): buoyant air-filled fibrous husk (mesocarp) + impermeable woody shell (endocarp) + internal liquid/solid endosperm food.' },
      { l: 3, q: 'Which botanical term describes a flower (such as <i>Hibiscus</i>) whose ovary sits ABOVE the point of attachment of sepals, petals, and stamens on the receptacle?', o: ['Hypogynous flower with a superior ovary', 'Epigynous flower with an inferior ovary (e.g. guava, sunflower)', 'Monoecious imperfect staminate flower', 'Cleistogamous achlamydeous flower'], a: 0, e: 'In a hypogynous flower (<i>Hibiscus</i>, flamboyant), floral parts insert below (<i>hypo</i>) the gynoecium, making the ovary SUPERIOR; in guava, parts insert above an INFERIOR ovary.' },
      { l: 3, q: 'Dry pods of Pride of Barbados (<i>Caesalpinia pulcherrima</i>) and Para rubber (<i>Hevea</i>) scatter their seeds several metres away on hot dry afternoons by:', o: ['Explosive mechanism (self-dispersal caused by unequal drying tension in pericarp walls)', 'Censer wind parachute pappus mechanism', 'Epizoochory via hooked spines clinging to cattle fur', 'Hydrochory along seasonal freshwater streams'], a: 0, e: 'Uneven desiccation shrinkage of fibrous pericarp layers builds torsional tension until the legume sutures snap violently apart, flinging seeds outward.' },
      { l: 4, q: 'A mango is botanically classified as a DRUPE whereas a tomato or guava is classified as a BERRY because:', o: ['A drupe has a hard stony woody endocarp enclosing usually one seed, whereas a berry has a fleshy pericarp throughout with no stony endocarp and many seeds', 'A drupe develops from an inflorescence whereas a berry develops from a receptacle', 'A mango is a dry indehiscent achene whereas a tomato splits along two sutures', 'Berries lack epicarp and mesocarp completely'], a: 0, e: 'Both drupes (mango, coconut, oil palm) and berries (tomato, guava, orange) are true succulent fruits with epicarp, mesocarp, and endocarp, but ONLY drupes have a stony hard endocarp!' },
      { l: 5, q: 'Which natural mechanism prevents self-pollination (autogamy) when anthers and stigmas within the same bisexual flower mature at DIFFERENT times?', o: ['Dichogamy (protandry if anthers ripen first; protogyny if stigma ripens first)', 'Herkogamy (physical barrier only with simultaneous ripening)', 'Dioecism (separate male and female plants like pawpaw)', 'Parthenocarpy (seedless fruit formation without fertilization)'], a: 0, e: 'Dichogamy is differential timing of maturation: protandry (sunflower, okra, cotton — anthers first) and protogyny (mirabilis, pear — stigma first).' },
    ],
  },
];
