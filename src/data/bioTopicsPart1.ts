import type { Topic } from '../types';

export const BIO_TOPICS_PART1: Topic[] = [
  // 1. Classification & Organization of Life
  {
    id: 'b-org',
    name: 'Classification & Organization of Life',
    sec: 'SS 1 · First Term · Organization of Life',
    boss: 'Classification & Kingdoms Test',
    goals: [
      'Apply Carolus Linnaeus’s binomial nomenclature rules and rank taxa from Kingdom down to Species',
      'Distinguish Whittaker’s five kingdoms (Monera, Protista, Fungi, Plantae, Animalia), viruses, and cellular levels of organization',
    ],
    trap: 'Viruses belong to NONE of the five kingdoms because they are acellular, lack cytoplasm/ribosomes, and crystallize outside a living host cell!',
    parts: [
      {
        title: 'Binomial Nomenclature & Whittaker’s Five Kingdoms',
        idea: 'Every organism is assigned a two-part Latin scientific name: a capitalized Genus followed by a lowercase specific epithet, italicized in print or underlined separately when handwritten.',
        rules: [
          'Taxonomic hierarchy (broadest → most specific): Kingdom → Phylum/Division → Class → Order → Family → Genus → Species.',
          'Monera (bacteria, blue-green algae): prokaryotic — circular naked DNA, 70S ribosomes, peptidoglycan wall, NO nuclear membrane.',
          'Protista (Amoeba, Paramecium, Euglena, Plasmodium): unicellular eukaryotes; Euglena is mixotrophic (chloroplasts in light, saprophytic in dark).',
          'Fungi (Mucor, Rhizopus, Yeast, Mushroom): chitinous cell walls, coenocytic hyphae, saprophytic extracellular digestion — NO chlorophyll.',
        ],
        ex: {
          q: 'Identify the correct scientific writing format for modern humans and state why Euglena viridis challenges strict plant–animal classification.',
          steps: [
            ['Write Genus capitalized and species lowercase: Homo sapiens', 'When handwritten, underline Homo and sapiens separately.'],
            ['Plant traits of Euglena: chloroplasts + paramylum granules + autotrophic nutrition in sunlight', 'Carries out photosynthesis when illuminated.'],
            ['Animal traits of Euglena: pellicle (no cellulose cell wall), flagellum locomotion, eyespot (stigma), contractile vacuole, holozoic/saprophytic in darkness', 'Combines animal motility with plant autotrophy.'],
          ],
          why: [
            0,
            'Why are two organisms placed in the SAME species rather than merely the same genus?',
            [
              'They can interbreed naturally to produce fertile, viable offspring',
              'They live in the same geographical habitat and share identical body size',
              'They feed on the exact same trophic food source throughout life',
            ],
            [
              'Spot on! Reproductive compatibility producing fertile offspring (unlike sterile mules from horse × donkey) defines biological species.',
              'Sympatric organisms of different species share habitats without interbreeding.',
              'Ecological guild similarity does not define species boundaries.',
            ],
          ],
        },
        tryit: {
          q: 'Which structural feature distinguishes Kingdom Fungi (e.g. Rhizopus) from Kingdom Plantae?',
          o: [
            'Possession of chitinous cell walls and complete absence of chlorophyll',
            'Presence of membrane-bound nuclei and mitochondria within eukaryotic cells',
            'Production of non-motile reproductive spores during life cycles',
            'Storage of excess carbohydrate strictly as insoluble starch grains',
          ],
          a: 0,
          h: 'Check both the cell wall polysaccharide and how fungi obtain organic carbon!',
          e: 'Fungi have cell walls made of chitin (not cellulose), lack chlorophyll completely, and store glycogen rather than starch.',
        },
      },
      {
        title: 'Levels of Organization & Borderline Viruses',
        idea: 'Life scales from macromolecules and organelles to cells (Amoeba), tissues (Hydra), organs (onion bulb, heart), systems (mammalian circulatory), and whole multicellular organisms.',
        rules: [
          'Cell level: Chlamydomonas, Amoeba, Paramecium. Tissue level: Hydra, Jellyfish (diploblastic — ectoderm + endoderm only, no organs).',
          'Organ level: Onion bulb (fleshy scale leaves + stem disc + adventitious roots), heart, kidney, leaf.',
          'Viruses: protein capsid + EITHER DNA OR RNA (never both simultaneously); obligate intracellular parasites that form crystals outside hosts.',
        ],
        ex: {
          q: 'Classify each biological specimen by its level of organization: (i) Volvox, (ii) Onion bulb, (iii) Hydra, (iv) Blood.',
          steps: [
            ['Volvox → Colonial cellular aggregate', 'Thousands of flagellated cells joined by cytoplasmic strands with minimal specialization.'],
            ['Hydra and Blood → Tissue level', 'Hydra has ectoderm/endoderm layers without organs; blood is liquid connective tissue.'],
            ['Onion bulb → Organ (storage shoot)', 'Composed of modified fleshy leaves, stem disc, and terminal bud working together.'],
          ],
        },
        tryit: {
          q: 'At which level of biological organization does Hydra viridis exist?',
          o: [
            'Tissue level with diploblastic ectoderm and endoderm layers',
            'Unicellular protoplasmic level with contractile vacuoles',
            'Organ-system level with specialized closed blood vessels',
            'Colonial aggregate of independent unspecialized flagellates',
          ],
          a: 0,
          h: 'Cnidarians have two germ layers separated by mesoglea, but no true organs.',
          e: 'Hydra is organized at the tissue level, possessing ectoderm and endoderm separated by non-cellular mesoglea.',
        },
      },
    ],
    spot: {
      part: 0,
      who: 'Tunde',
      q: 'Tunde wrote notes comparing Bacteria (Monera) and Viruses for his JAMB revision.',
      lines: [
        'Bacteria have 70S ribosomes and circular DNA without a nuclear envelope.',
        'Viruses contain both DNA and RNA inside a cellulose cell wall.',
        'Outside a living host cell, viruses behave as inert non-living crystals.',
      ],
      bad: 1,
      okfb: ['True — bacteria are prokaryotes.', '', 'True — Wendell Stanley crystallized TMV.'],
      o: [
        'A virus contains EITHER DNA or RNA (never both) enclosed in a protein capsid, with NO cell wall',
        'Viruses contain 80S ribosomes inside a peptidoglycan wall',
        'Bacteria have membrane-bound nuclei and mitochondria',
      ],
      a: 0,
      fb: [
        'Exactly! Viruses have a protein coat (capsid) and either DNA or RNA — never both and never cellulose.',
        'Viruses have zero ribosomes of their own; they hijack host ribosomes.',
        'Bacteria are prokaryotic and lack membrane-bound organelles.',
      ],
      h: ['Check viral nucleic acid composition and outer coat material.'],
      fix: 'Viruses possess a protein capsid enclosing EITHER DNA or RNA (never both) and lack any cell wall.',
    },
    qs: [
      { l: 1, dx: 1, q: 'According to binomial nomenclature, which of the following is the correct printed scientific name for maize?', o: ['<i>Zea mays</i>', '<i>Zea Mays</i>', '<i>zea mays</i>', '<i>ZEA MAYS</i>'], a: 0, e: 'In binomial nomenclature, the generic name starts with a capital letter (<i>Zea</i>), the specific epithet is all lowercase (<i>mays</i>), and both are italicized.' },
      { l: 2, q: 'Which organism exhibits both holophytic (autotrophic) and saprophytic nutrition depending on light availability?', o: ['<i>Euglena viridis</i>', '<i>Paramecium caudatum</i>', '<i>Amoeba proteus</i>', '<i>Plasmodium falciparum</i>'], a: 0, e: '<i>Euglena</i> photosynthesizes using chloroplasts in sunlight but absorbs dissolved organic matter saprophytically when kept in darkness.' },
      { l: 3, q: 'An onion bulb is biologically classified as an organ rather than a tissue because it:', o: ['Consists of modified leaves, a reduced stem, and buds performing coordinated storage and perennation', 'Contains identical epidermal cells arising from a single meristematic division', 'Lacks vascular bundles and relies exclusively on cell-to-cell diffusion', 'Exists independently as a free-living unicellular photosynthetic unit'], a: 0, e: 'An organ is a collection of different tissues (epidermis, parenchyma, vascular tissue in scale leaves and stem disc) working together.' },
      { l: 3, q: 'Blue-green algae (cyanobacteria) such as <i>Nostoc</i> are classified under Kingdom Monera rather than Plantae because they:', o: ['Lack a nuclear membrane and membrane-bound chloroplasts', 'Cannot carry out oxygenic photosynthesis in sunlight', 'Possess chitinous cell walls and heterotrophic hyphae', 'Move rapidly using9+2 eukaryotic cilia'], a: 0, e: 'Cyanobacteria are photosynthetic prokaryotes — their photosynthetic pigments lie on thylakoid lamellae without a chloroplast envelope or nuclear membrane.' },
      { l: 4, q: 'Which phylum of invertebrates is characterized by radial symmetry, diploblastic body wall, and stinging nematoblasts (cnidocytes)?', o: ['Coelenterata (Cnidaria)', 'Platyhelminthes', 'Annelida', 'Echinodermata'], a: 0, e: 'Cnidarians (<i>Hydra</i>, <i>Obelia</i>, sea anemone) are radially symmetrical, diploblastic, and bear nematocysts for prey capture.' },
      { l: 5, q: 'All of the following are distinguishing features of Class Mammalia EXCEPT:', o: ['Possession of nucleated biconcave mature erythrocytes', 'Presence of a muscular diaphragm separating thorax and abdomen', 'Heterodont dentition and three middle-ear ossicles', 'Possession of sweat, sebaceous, and mammary glands'], a: 0, e: 'Mature mammalian red blood cells (erythrocytes) are ENUCLEATED (lack a nucleus) to maximize haemoglobin packing; birds, reptiles, amphibians, and fish retain nucleated RBCs.' },
    ],
  },

  // 2. Cell Structure, Organelles & Microscopy
  {
    id: 'b-cell',
    name: 'Cell Structure, Organelles & Microscopy',
    sec: 'SS 1 · First Term · Organization of Life',
    boss: 'Cell Organelles & Magnification Test',
    goals: [
      'Compare plant and animal cells and match every eukaryotic organelle to its ultrastructure and biochemical role',
      'Calculate microscope total magnification and specimen actual size using M = Image size ÷ Actual size in consistent units',
    ],
    trap: 'Convert millimetres (mm) to micrometres (μm) by multiplying by 1000 BEFORE dividing Image size by Magnification!',
    parts: [
      {
        title: 'Ultrastructure of Plant vs Animal Cells & Organelle Roles',
        idea: 'Plant cells possess a rigid cellulose cell wall, chloroplasts, plasmodesmata, and a large central sap vacuole bounded by a tonoplast; animal cells lack cell walls and plastids but have centrioles and small temporary vacuoles.',
        rules: [
          'Mitochondrion: double membrane with folded cristae + matrix containing 70S ribosomes & circular DNA; site of aerobic ATP synthesis.',
          'Ribosomes (non-membranous): site of polypeptide/protein translation; Rough ER transports proteins, Smooth ER synthesizes lipids & steroids.',
          'Golgi apparatus: modifies, packages, and secretes glycoproteins & lysosomes. Lysosomes (“suicide bags”): hydrolytic enzymes for autophagy.',
        ],
        ex: {
          q: 'Which two eukaryotic organelles are semi-autonomous (contain their own circular DNA and 70S ribosomes), and what does this indicate?',
          steps: [
            ['Identify Mitochondria and Chloroplasts', 'Both possess double membranes, circular DNA, and prokaryotic-sized 70S ribosomes.'],
            ['Self-replication by binary-like division inside the cell', 'Supports the endosymbiotic origin of eukaryotic energy organelles.'],
          ],
        },
        tryit: {
          q: 'A secretory pancreatic cell that synthesizes and exports large quantities of digestive enzymes will contain unusually abundant:',
          o: [
            'Rough endoplasmic reticulum, Golgi apparatus, and mitochondria',
            'Smooth endoplasmic reticulum, centrioles, and amyloplasts',
            'Contractile vacuoles, tonoplasts, and plasmodesmata',
            'Lysosomes only, with complete absence of nucleoli',
          ],
          a: 0,
          h: 'Digestive enzymes are exported proteins requiring ATP, synthesis on bound ribosomes, and secretory packaging.',
          e: 'Rough ER synthesizes secretory proteins, Golgi bodies package them into zymogen vesicles, and mitochondria supply ATP.',
        },
      },
      {
        title: 'Microscopy & Linear Magnification Calculations',
        idea: 'Total compound microscope magnification equals Eyepiece magnification × Objective magnification, while biological drawing magnification is Image length ÷ Actual specimen length.',
        rules: [
          '1 cm = 10 mm;  1 mm = 1000 μm;  1 μm = 1000 nm.',
          'Magnification M = Image size (I) ÷ Actual size (A)  ⇒  Actual size A = I ÷ M (always convert I and A to the SAME unit first!).',
          'Resolution (resolving power) is the minimum distance between two points still seen as separate; electron microscopes have higher resolution due to shorter electron wavelength.',
        ],
        ex: {
          q: 'A student draws a cheek cell measuring 45 mm across in her lab book. If the actual diameter of the cell is 30 μm, calculate the linear magnification of her drawing.',
          steps: [
            ['Convert drawing size from mm to μm: 45 mm × 1000 = 45,000 μm', 'Both numerator and denominator must share identical units.'],
            ['Apply M = Image ÷ Actual: 45,000 μm ÷ 30 μm = ×1500', 'Magnification is written with a × sign and has NO physical unit.'],
          ],
        },
        tryit: {
          q: 'Under a microscope of magnification ×400, the image of a chloroplast measures 2.4 mm in length. What is the actual length of the chloroplast in micrometres (μm)?',
          o: ['6.0 μm', '960 μm', '0.6 μm', '60 μm'],
          a: 0,
          h: 'Convert 2.4 mm to 2400 μm first, then divide by 400.',
          e: 'I = 2.4 mm = 2400 μm. Actual size A = I ÷ M = 2400 μm ÷ 400 = 6.0 μm.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Who coined the term “cell” in 1665 after examining thin slices of cork oak bark under a primitive microscope?', o: ['Robert Hooke', ' Matthias Schleiden', 'Theodor Schwann', 'Rudolf Virchow'], a: 0, e: 'Robert Hooke observed dead cork cell walls (<i>suberin</i> chambers) in 1665; Schleiden & Schwann formulated Cell Theory (1838–1839) and Virchow added <i>Omnis cellula e cellula</i>.' },
      { l: 2, q: 'The membrane that surrounds the large central cell-sap vacuole of a mature parenchyma plant cell is called the:', o: ['Tonoplast', 'Plasmalemma', 'Sarcolemma', 'Neurilemma'], a: 0, e: 'The tonoplast is the selectively permeable vacuolar membrane regulating ion and water movement into the cell sap.' },
      { l: 3, q: 'Which cellular structure is present in meristematic onion root-tip cells AND cheek cells, and lacks any phospholipid membrane?', o: ['Ribosome', 'Chloroplast', 'Centriole', 'Lysosome'], a: 0, e: 'Ribosomes consist solely of rRNA and protein (no lipid membrane) and occur in all living plant and animal cells; higher plants lack centrioles.' },
      { l: 3, q: 'A compound microscope is fitted with a ×15 eyepiece and a ×40 high-power objective lens. What is its total magnification?', o: ['×600', '×55', '×2.67', '×6000'], a: 0, e: 'Total magnification = M_eyepiece × M_objective = 15 × 40 = ×600.' },
      { l: 4, q: 'When a tadpole’s tail is reabsorbed during metamorphosis into an adult frog, which organelle mediates the controlled breakdown of tail cells?', o: ['Lysosome', 'Golgi apparatus', 'Smooth endoplasmic reticulum', 'Nucleolus'], a: 0, e: 'Lysosomes release hydrolytic acid-hydrolase enzymes during programmed tissue regression (autolysis) in amphibian metamorphosis.' },
      { l: 5, q: 'Which component of the plasma membrane according to Singer & Nicolson’s fluid-mosaic model reduces membrane fluidity extremes and stabilizes mechanical integrity in animal cells?', o: ['Cholesterol wedged between phospholipid tails', 'Extrinsic peripheral glycoproteins on the outer face', 'Cellulose microfibrils cross-linked by pectins', 'Starch grains embedded within the hydrophilic heads'], a: 0, e: 'Cholesterol molecules intercalate between phospholipid fatty-acid chains in animal membranes, preventing crystal packing at low temperatures and excessive fluidity at high temperatures.' },
    ],
  },

  // 3. Cell & Its Environment — Diffusion, Osmosis & Active Transport
  {
    id: 'b-transport-cell',
    name: 'Diffusion, Osmosis & Active Transport',
    sec: 'SS 1 · First Term · The Organism at Work',
    boss: 'Osmosis, Plasmolysis & Haemolysis Test',
    goals: [
      'Differentiate diffusion, osmosis, facilitated diffusion, and ATP-driven active transport across membranes',
      'Predict the fate of plant cells (turgid, flaccid, plasmolysed) and red blood cells (haemolysed, crenated) in hypotonic, isotonic, and hypertonic solutions',
    ],
    trap: 'Plant cells NEVER burst (haemolyse) in distilled water because the inelastic cellulose cell wall exerts equal and opposite wall (turgor) pressure!',
    parts: [
      {
        title: 'Osmosis, Water Potential (Ψ) & Plant/Animal Cell Responses',
        idea: 'Osmosis is the net movement of water molecules from a region of higher water potential (dilute/hypotonic solution, Ψ closer to 0) to lower water potential (concentrated/hypertonic solution, more negative Ψ) across a selectively permeable membrane.',
        rules: [
          'Pure distilled water has the HIGHEST water potential: Ψ = 0 kPa at atmospheric pressure; dissolving solutes makes Ψ_s negative.',
          'Plant cell in hypotonic water → endosmosis → vacuole swells → TURGID (wall pressure = turgor pressure; supports herbaceous stems).',
          'Plant cell in hypertonic salt/sugar → exosmosis → protoplast shrinks & pulls away from cell wall → PLASMOLYSIS.',
          'Mammalian RBC in distilled water → swells and bursts → HAEMOLYSIS (no cell wall!). RBC in hypertonic brine → shrinks & wrinkles → CRENATION.',
        ],
        ex: {
          q: 'Four strips of peeled yam tuber, each initially 50.0 mm long, are immersed for 1 hour in: Tube A (distilled water) and Tube B (1.0 mol dm⁻³ sucrose). Predict the length and texture in each tube.',
          steps: [
            ['Tube A (hypotonic distilled water): length increases (e.g. 54 mm), strip becomes firm and rigid', 'Endosmosis enters yam vacuoles until cells are fully turgid.'],
            ['Tube B (hypertonic 1.0 M sucrose): length decreases (e.g. 46 mm), strip becomes soft and limp (flaccid/plasmolysed)', 'Exosmosis draws water out of cell sap into concentrated sucrose.'],
          ],
        },
        tryit: {
          q: 'Why does a boiled yam cup fail to show any rise in sugar level when placed in a trough of distilled water during an osmometer experiment?',
          o: [
            'Boiling denatures and destroys the selective permeability of the living plasma membranes',
            'Boiling evaporates all sucrose molecules from the central cavity before osmosis begins',
            'Boiling thickens the cellulose cell walls so water molecules can no longer pass through',
            'Boiling converts sucrose into insoluble starch which raises water potential to zero',
          ],
          a: 0,
          h: 'Cellulose walls are already fully permeable; osmosis requires an intact living selectively permeable membrane!',
          e: 'Heat kills the cells and destroys the selectively permeable plasma membrane and tonoplast, turning the tissue freely permeable to both solute and water.',
        },
      },
      {
        title: 'Diffusion vs ATP-Driven Active Transport',
        idea: 'Diffusion and osmosis are passive processes down concentration/water-potential gradients, whereas active transport pumps ions or glucose UP (against) a concentration gradient using ATP from respiration.',
        rules: [
          'Factors speeding diffusion: steeper concentration gradient, higher temperature, larger surface-area-to-volume ratio (SA:V), thinner membrane, smaller molecular mass.',
          'Active transport examples: Na⁺/K⁺ pump in nerve axons, mineral ion uptake (NO₃⁻) by root hair cells, glucose reabsorption in proximal convoluted tubule & ileum villi.',
          'Respiratory poisons (cyanide) or lack of oxygen (waterlogged soil) halt active transport immediately without stopping passive diffusion.',
        ],
        ex: {
          q: 'Root hair cells of maize contain 50 times more nitrate ions (NO₃⁻) than surrounding soil water, yet continue absorbing nitrate. Explain why flooding the soil stops this uptake.',
          steps: [
            ['Uptake is against the concentration gradient → Active Transport', 'Requires ATP generated by aerobic respiration in root-hair mitochondria.'],
            ['Waterlogged soil displaces air pockets → O₂ starvation', 'Aerobic ATP production falls, shutting down membrane carrier pumps.'],
          ],
        },
        tryit: {
          q: 'Addition of potassium cyanide (a mitochondrial respiratory inhibitor) to an isolated segment of mammalian ileum will most strongly inhibit:',
          o: [
            'Absorption of glucose against a concentration gradient into villus epithelium',
            'Osmotic movement of water molecules across mucosal cell membranes',
            'Simple diffusion of dissolved oxygen from capillary blood into cells',
            'Emulsification of dietary triglycerides by bile salts in the lumen',
          ],
          a: 0,
          h: 'Which process depends directly on mitochondrial ATP?',
          e: 'Active transport of glucose and amino acids across the ileum epithelium requires ATP; cyanide blocks cytochrome oxidase and halts ATP synthesis.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'When fresh human red blood cells are placed in distilled water, they swell and burst in a process known as:', o: ['Haemolysis', 'Plasmolysis', 'Crenation', 'Agglutination'], a: 0, e: 'Without a rigid cell wall, endosmosis into RBCs in hypotonic distilled water ruptures the plasma membrane (haemolysis), releasing haemoglobin.' },
      { l: 2, q: 'As a unicellular organism grows larger while keeping a spherical shape, its surface-area-to-volume ratio (SA : V):', o: ['Decreases, eventually requiring specialized transport and gas-exchange surfaces', 'Increases proportionally with the cube of its radius', 'Remains constant regardless of cell diameter', 'Drops immediately to zero once mitosis begins'], a: 0, e: 'Surface area scales as r² while volume scales as r³, so SA:V = 3/r decreases as size increases, making simple diffusion too slow for large organisms.' },
      { l: 3, q: 'In a plasmolysed <i>Spirogyra</i> or <i>Rhoeo</i> epidermal cell mounted in concentrated salt solution, what occupies the space between the cellulose cell wall and the shrunken protoplast?', o: ['The external concentrated salt solution', 'Pure distilled water from the vacuole', 'An air vacuum created by exosmosis', 'Solidified cytoplasmic matrix'], a: 0, e: 'Because the cellulose cell wall is fully permeable to both water and dissolved salt, the external hypertonic solution fills the gap behind the retreating plasma membrane.' },
      { l: 4, q: 'Plant cell X has solute potential Ψ_s = −900 kPa and pressure potential Ψ_p = +500 kPa. Adjacent cell Y has Ψ_s = −600 kPa and Ψ_p = +400 kPa. In which direction does water move?', o: ['From cell Y (Ψ = −200 kPa) into cell X (Ψ = −400 kPa)', 'From cell X (Ψ = −400 kPa) into cell Y (Ψ = −200 kPa)', 'No net movement because Ψ_p is positive in both cells', 'From cell X to cell Y because X has larger turgor pressure'], a: 0, e: 'Ψ = Ψ_s + Ψ_p: Ψ_X = −900 + 500 = −400 kPa; Ψ_Y = −600 + 400 = −200 kPa. Water moves from higher (less negative) Ψ in Y (−200 kPa) to lower (more negative) Ψ in X (−400 kPa).' },
      { l: 4, q: 'Sprinkling excess chemical fertilizer directly around the roots of young tomato seedlings causes rapid wilting primarily because:', o: ['Soil water becomes hypertonic to root hair cell sap, drawing water out by exosmosis', 'Nitrate ions mechanically clog xylem vessels inside the stem', 'Fertilizer raises soil temperature above the enzyme denaturation point', 'Guard cells permanently lock open under high nitrogen levels'], a: 0, e: 'Excess soluble salts make the soil solution hypertonic (very negative water potential), causing exosmosis and plasmolysis of root hair cells (“fertilizer burn”).' },
      { l: 5, q: 'Which statement accurately contrasts facilitated diffusion with active transport?', o: ['Both use specific membrane transport proteins, but only active transport consumes ATP to move solutes uphill', 'Facilitated diffusion moves solutes against their gradient without proteins, whereas active transport uses simple pores', 'Active transport occurs in dead cell walls, whereas facilitated diffusion occurs only in tonoplasts', 'Facilitated diffusion requires oxygen and mitochondria, whereas active transport is purely kinetic'], a: 0, e: 'Facilitated diffusion uses channel or carrier proteins passively down a concentration gradient (no ATP), whereas active transport uses ATPase carrier pumps uphill.' },
    ],
  },

  // 4. Modes of Nutrition, Food Classes, Enzymes & Photosynthesis
  {
    id: 'b-nutrition',
    name: 'Nutrition, Enzymes, Food Tests & Photosynthesis',
    sec: 'SS 1 · First Term · The Organism at Work',
    boss: 'Nutrition, Enzymes & Photosynthesis Test',
    goals: [
      'Classify autotrophic and heterotrophic nutrition (holozoic, saprophytic, parasitic, symbiotic, carnivorous plants) and run standard biochemical food tests',
      'Explain enzyme specificity, pH/temperature curves, and the light-dependent vs Calvin (light-independent) stages of photosynthesis',
    ],
    trap: 'Sucrose is a NON-REDUCING sugar — it gives a negative (blue) Benedict’s test UNLESS first hydrolysed with dilute HCl and neutralized with NaOH/NaHCO₃!',
    parts: [
      {
        title: 'Autotrophic Photosynthesis & Plant Mineral Deficiencies',
        idea: 'Photosynthesis traps light in grana thylakoids to split water (photolysis → O₂ + NADPH + ATP), then reduces CO₂ to glucose in the chloroplast stroma (Calvin cycle): 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.',
        rules: [
          'Isotope ¹⁸O tracer proof: ALL evolved O₂ gas comes from photolysis of WATER (2H₂O → 4H⁺ + 4e⁻ + O₂), NEVER from CO₂!',
          'Carnivorous plants (Sundew Drosera, Pitcher Nepenthes, Venus flytrap, Bladderwort Utricularia) ARE green autotrophs — they trap insects ONLY to obtain NITROGEN in nitrate-poor Acid bogs!',
          'Mineral deficiencies: Nitrogen → stunted growth + general chlorosis; Magnesium or Iron → interveinal chlorosis (Mg is at the centre of chlorophyll!).',
        ],
        ex: {
          q: 'List the exact four-step sequence and reason for each step when testing a green hibiscus leaf for starch.',
          steps: [
            ['1. Dip leaf in boiling water (60 s)', 'Kills protoplasm, halts enzyme action, and bursts cell membranes for permeability.'],
            ['2. Boil leaf in methylated spirit / ethanol inside a hot WATER BATH', 'Dissolves green chlorophyll cleanly without igniting flammable ethanol over a naked flame!'],
            ['3. Dip brittle white leaf in warm water, then add Iodine solution', 'Softens the leaf; starch turns iodine from brown to blue-black.'],
          ],
        },
        tryit: {
          q: 'During photosynthesis, the oxygen gas released through leaf stomata originates directly from the:',
          o: [
            'Photolysis of water molecules in the thylakoid membranes during the light stage',
            'Decarboxylation of carbon(IV) oxide in the stroma during the dark stage',
            'Enzymatic breakdown of newly formed starch granules at dusk',
            'Reduction of phosphoglyceric acid by NADPH in guard cells',
          ],
          a: 0,
          h: 'Recall Ruben and Kamen’s heavy oxygen-18 (H₂¹⁸O) isotope experiment!',
          e: 'Light energy splits water (photolysis) in photosystem II within the grana thylakoids, releasing O₂ gas and supplying H⁺/electrons.',
        },
      },
      {
        title: 'Biochemical Food Tests, Vitamins & Enzyme Kinetics',
        idea: 'Enzymes are globular protein biological catalysts that lower activation energy at an active site, exhibiting strict pH optima (pepsin pH ~2.0, ptyalin pH ~6.8, trypsin pH ~8.0) and thermal denaturation above ~45–50 °C.',
        rules: [
          'Reducing sugars (glucose, fructose, maltose, lactose) + Benedict’s/Fehling’s + heat → brick-red Cu₂O precipitate.',
          'Proteins + Biuret test (dilute NaOH + drops of 1% CuSO₄, NO heating) → violet / purple colour. Million’s reagent + heat → brick-red coagulum.',
          'Deficiency diseases: Vit A → night blindness (xerophthalmia); Vit B₁ → beriberi; Vit C → scurvy; Vit D → rickets/osteomalacia; Vit K → prolonged bleeding; Protein → kwashiorkor.',
        ],
        ex: {
          q: 'Food sample X stays blue when boiled directly with Benedict’s solution, but gives a heavy brick-red precipitate after boiling with dilute HCl, cooling, neutralizing with NaHCO₃, and re-heating with Benedict’s. Identify X.',
          steps: [
            ['Initial negative Benedict’s rules out reducing sugars (glucose/maltose)', 'Sample lacks a free hemiacetal aldehyde/ketone group.'],
            ['Dilute HCl hydrolyses glycosidic bond → glucose + fructose', 'Neutralizing acid prevents HCl from destroying alkaline Benedict’s reagent; X is a non-reducing sugar (sucrose).'],
          ],
        },
        tryit: {
          q: 'Why must dilute sodium trioxocarbonate(IV) or sodium hydroxide be added AFTER boiling sucrose with dilute HCl before performing Benedict’s test?',
          o: [
            'Benedict’s copper(II) complex only functions in an alkaline medium, so excess HCl must be neutralized',
            'Sodium hydroxide acts as the primary oxidizing agent that converts sucrose directly into starch',
            'Hydrochloric acid precipitates protein contaminants that would turn Benedict’s reagent purple',
            'Neutralization cools the test tube below 0 °C where brick-red copper(I) oxide crystallizes',
          ],
          a: 0,
          h: 'Benedict’s solution contains alkaline sodium citrate/carbonate!',
          e: 'Unneutralized HCl destroys the alkaline medium required for Cu²⁺ reduction to brick-red Cu₂O during Benedict’s test.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Which reagent combination produces a violet (purple) colouration in the presence of egg albumen without heating?', o: ['Dilute NaOH followed by drops of 1% CuSO₄ (Biuret test)', 'Benedict’s solution boiled in a water bath for 3 minutes', 'Potassium iodide–iodine solution added to a cold suspension', 'Sudan III dye shaken with distilled water'], a: 0, e: 'The Biuret test (NaOH + dilute CuSO₄ at room temperature) complexes peptide bonds to give a characteristic violet/purple colour.' },
      { l: 2, q: 'Children weaned onto a diet rich in cassava pap (carbohydrates) but severely deficient in dietary protein develop oedema, reddish scanty hair, and a pot-belly characteristic of:', o: ['Kwashiorkor', 'Marasmus', 'Pellagra', 'Beri-beri'], a: 0, e: 'Kwashiorkor is caused specifically by severe protein deficiency despite adequate calorie intake, whereas marasmus results from total starvation (protein + energy).' },
      { l: 3, q: 'Insectivorous plants such as <i>Drosera</i> (sundew) and <i>Utricularia</i> (bladderwort) trap and digest insects primarily to supplement their supply of:', o: ['Assimilable nitrogen for amino acid and protein synthesis', 'Carbon(IV) oxide for the Calvin cycle in shady marshes', 'Magnesium ions to replace chlorophyll completely', 'Simple reducing sugars because they lack chloroplasts'], a: 0, e: 'Carnivorous plants possess chlorophyll and photosynthesize normally, but inhabit waterlogged boggy soils deficient in nitrates.' },
      { l: 3, q: 'Which vitamin is essential for synthesis of prothrombin in the liver, such that its deficiency leads to failure of blood clotting (haemorrhage)?', o: ['Vitamin K (Phylloquinone)', 'Vitamin C (Ascorbic acid)', 'Vitamin D (Calciferol)', 'Vitamin E (Tocopherol)'], a: 0, e: 'Vitamin K is required by the liver to synthesize clotting factors including prothrombin; Vit C deficiency causes scurvy (bleeding gums from weak collagen).' },
      { l: 4, q: 'What happens to a human enzyme such as salivary amylase when cooled to 2 °C versus boiled at 100 °C?', o: ['At 2 °C it is reversibly inactivated (low kinetic energy), whereas at 100 °C its active site is irreversibly denatured', 'It is permanently denatured at both 2 °C and 100 °C due to peptide bond hydrolysis', 'Its catalytic rate doubles at 100 °C and remains unchanged at 2 °C', 'At 2 °C its optimum pH shifts to 2.0, whereas at 100 °C it shifts to 12.0'], a: 0, e: 'Freezing/chilling merely slows molecular collisions (activity returns upon warming to 37 °C), whereas boiling breaks H-bonds and permanently denatures the 3D active site.' },
      { l: 5, q: 'In the mutualistic association forming a lichen, what specific contribution does each partner make?', o: ['The alga synthesizes organic food by photosynthesis while the fungus provides shelter, anchorage, and mineral/water absorption', 'The fungus fixes atmospheric nitrogen gas while the alga digests dead wood saprophytically', 'Both partners are heterotrophic parasites competing for host phloem sap', 'The alga supplies chitinous hyphae while the fungus supplies chlorophyll a'], a: 0, e: 'A lichen is a mutualistic symbiosis between a photosynthetic alga/cyanobacterium (autotroph supplying carbohydrates) and a fungus (mycobiont providing moisture, minerals, and protection).' },
    ],
  },

  // 5. Cellular Respiration — Aerobic, Anaerobic & Fermentation
  {
    id: 'b-respiration',
    name: 'Cellular Respiration — Aerobic & Anaerobic',
    sec: 'SS 1 · Second Term · The Organism at Work',
    boss: 'ATP, Glycolysis & Fermentation Test',
    goals: [
      'Trace glycolysis in the cytoplasm and the Krebs cycle + electron transport chain in mitochondria, comparing net ATP yields (38 vs 2 ATP)',
      'Contrast alcoholic fermentation in yeast/plants with lactic acid anaerobic respiration and oxygen debt in mammalian skeletal muscle',
    ],
    trap: 'Anaerobic respiration in YEAST/PLANTS yields ethanol + CO₂, whereas anaerobic respiration in MAMMALIAN MUSCLE yields LACTIC ACID ONLY (ZERO CO₂ gas)!',
    parts: [
      {
        title: 'Glycolysis, Krebs Cycle & ATP Accounting',
        idea: 'Glycolysis splits 6-carbon glucose into two 3-carbon pyruvate molecules in the cytoplasm (yielding 2 net ATP without needing O₂); if O₂ is present, pyruvate enters the mitochondrion for the Krebs cycle and oxidative phosphorylation (~36 more ATP → ~38 ATP total).',
        rules: [
          'Glycolysis occurs in the CYTOPLASM of ALL living cells (both aerobic and anaerobic) and requires NO oxygen.',
          'Aerobic equation: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ~38 ATP (≈ 2880 kJ mol⁻¹).',
          'Respiratory Quotient RQ = Volume of CO₂ evolved ÷ Volume of O₂ consumed: Carbohydrates = 1.0; Fats/Lipids ≈ 0.7; Proteins ≈ 0.8–0.9; Anaerobic >> 1 (∞).',
        ],
        ex: {
          q: 'During germination, castor-oil seeds exhibit an RQ of 0.71 whereas maize grains exhibit an RQ of 1.0. Account for the difference.',
          steps: [
            ['Maize stores starch (carbohydrate C₆H₁₂O₆): 6CO₂ ÷ 6O₂ = 1.0', 'Equal moles of CO₂ released and O₂ consumed.'],
            ['Castor-oil seed stores lipids (rich in C–H, poor in oxygen)', 'Oxidizing fatty acids requires MORE O₂ relative to CO₂ released, giving RQ ≈ 0.7.'],
          ],
        },
        tryit: {
          q: 'Where inside a eukaryotic cell does glycolysis take place, and how many net ATP molecules does it yield per molecule of glucose?',
          o: [
            'In the cytoplasm (cytosol), yielding a net gain of 2 ATP molecules',
            'On the inner mitochondrial cristae, yielding a net gain of 36 ATP molecules',
            'In the mitochondrial matrix, yielding a net gain of 38 ATP molecules',
            'Inside the chloroplast stroma, consuming 2 ATP molecules with zero gain',
          ],
          a: 0,
          h: 'Glycolysis uses 2 ATP to phosphorylate glucose and generates 4 ATP (4 − 2 = 2 net) before pyruvate ever enters a mitochondrion.',
          e: 'Glycolysis occurs in the cytosol of all cells, investing 2 ATP and producing 4 ATP for a net gain of 2 ATP per glucose.',
        },
      },
      {
        title: 'Alcoholic Fermentation vs Muscle Lactic Acid & Oxygen Debt',
        idea: 'Without oxygen, pyruvate must accept hydrogen from NADH to regenerate NAD⁺ so glycolysis can continue: yeast decarboxylates pyruvate to ethanol + CO₂, whereas fatigued skeletal muscle reduces pyruvate directly to lactic acid.',
        rules: [
          'Yeast / waterlogged plant roots: C₆H₁₂O₆ → 2C₂H₅OH (ethanol) + 2CO₂ + 2 ATP (drives bread rising & brewing).',
          'Mammalian skeletal muscle sprint: C₆H₁₂O₆ → 2C₃H₆O₃ (lactic acid) + 2 ATP — causes muscle cramp/fatigue; NO CO₂ is released!',
          'Oxygen debt: extra O₂ inhaled during panting AFTER exercise to oxidize accumulated lactic acid into CO₂, H₂O, and glycogen in the LIVER.',
        ],
        ex: {
          q: 'Explain why boiled-and-cooled glucose covered with a thin layer of liquid paraffin is used when demonstrating anaerobic fermentation in yeast.',
          steps: [
            ['Boiling glucose expels dissolved oxygen; cooling prevents heat-killing the yeast', 'Adding live yeast to boiling solution would denature its zymase enzymes!'],
            ['Liquid paraffin oil floats on top as an airtight barrier', 'Prevents atmospheric O₂ from diffusing back into the glucose solution.'],
          ],
        },
        tryit: {
          q: 'Why does a 100-metre sprinter continue breathing deeply and rapidly for several minutes AFTER crossing the finish line?',
          o: [
            'To repay the oxygen debt required by the liver to oxidize and reconvert accumulated lactic acid',
            'To expel ethanol vapour produced anaerobically inside contracting leg muscles',
            'To lower blood pH by retaining excess carbon(IV) oxide inside the alveoli',
            'To halt oxidative phosphorylation in cardiac muscle mitochondria immediately',
          ],
          a: 0,
          h: 'Vigorous sprinting builds up lactic acid in skeletal muscles faster than O₂ can be delivered.',
          e: 'Post-exercise hyperventilation supplies extra oxygen (“repaying oxygen debt”) to convert lactic acid in the liver back to pyruvate/glycogen and restore ATP/creatine phosphate.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'How many net molecules of ATP are generated from the anaerobic fermentation of one molecule of glucose by yeast?', o: ['2 ATP', '38 ATP', '36 ATP', '4 ATP'], a: 0, e: 'Anaerobic fermentation relies solely on glycolysis (4 ATP formed minus 2 ATP invested = 2 net ATP), leaving most energy locked in ethanol.' },
      { l: 2, q: 'Which end-product accumulates in fatigued mammalian skeletal muscle during strenuous anaerobic exercise?', o: ['Lactic acid only', 'Ethanol and carbon(IV) oxide', 'Pyruvic acid and oxygen gas', 'Citric acid and urea'], a: 0, e: 'Mammalian lactate dehydrogenase reduces pyruvate to lactic acid without decarboxylation (zero CO₂).' },
      { l: 3, q: 'In a respirometer experiment, potassium hydroxide (KOH) or soda-lime pellets are placed at the bottom of the chamber in order to:', o: ['Absorb evolved carbon(IV) oxide so manometer movement measures oxygen uptake directly', 'Supply extra carbon(IV) oxide for germinating seeds in darkness', 'Sterilize the seeds by denaturing respiratory enzymes', 'Release oxygen gas when moistened by water vapour'], a: 0, e: 'KOH absorbs all CO₂ exhaled by the respiring seeds/insects; the resulting volume decrease equals the exact volume of O₂ consumed.' },
      { l: 3, q: 'During bread-making, dough rises into a light spongy texture when mixed with yeast and kept warm primarily because:', o: ['Evolved carbon(IV) oxide bubbles get trapped in elastic gluten, while ethanol evaporates during baking', 'Lactic acid crystallizes into hollow fibres throughout the flour', 'Aerobic respiration consumes nitrogen gas from the oven air', 'Yeast cells multiply until their chitin walls occupy half the loaf volume'], a: 0, e: 'Yeast ferments flour sugars into CO₂ (which expands gluten pockets to leaven dough) and ethanol (which boils off at ~78 °C in the oven).' },
      { l: 4, q: 'An organism oxidizes a respiratory substrate consuming 100 cm³ of O₂ while releasing 70 cm³ of CO₂ over the same period. What is the RQ and most likely substrate?', o: ['RQ = 0.70; lipid (fat/oil)', 'RQ = 1.43; simple hexose sugar', 'RQ = 1.00; starch', 'RQ = 0.70; anaerobic glucose'], a: 0, e: 'RQ = V(CO₂) ÷ V(O₂) = 70 ÷ 100 = 0.70, the classic signature of lipid oxidation.' },
      { l: 5, q: 'Which stage of aerobic cellular respiration produces the LARGEST number of ATP molecules per molecule of glucose oxidized?', o: ['Oxidative phosphorylation along the electron transport chain on mitochondrial cristae', 'Substrate-level phosphorylation during cytoplasmic glycolysis', 'Direct GTP synthesis during a single turn of the Krebs cycle', 'Conversion of pyruvate to acetyl-CoA in the link reaction'], a: 0, e: 'NADH and FADH₂ generated in glycolysis and the Krebs cycle donate electrons to the inner-membrane electron transport chain, driving synthesis of ~32–34 of the 38 ATP.' },
    ],
  },

  // 6. Excretion in Lower Organisms, Mitosis & Plant/Animal Growth
  {
    id: 'b-excretion-growth',
    name: 'Excretory Structures, Mitosis & Growth Curves',
    sec: 'SS 1 · Second Term · The Organism at Work',
    boss: 'Excretion, Mitosis & Auxin Tropisms Test',
    goals: [
      'Match organisms to their excretory organs (contractile vacuole, flame cell, nephridium, Malpighian tubule, green gland, stomata/lenticels)',
      'Order the phases of mitosis (PMAT), interpret the sigmoid growth curve, and explain auxin action in phototropism and geotropism',
    ],
    trap: 'Auxins (IAA) stimulate cell elongation in SHOOTS, but the EXACT SAME high auxin concentration INHIBITS cell elongation in ROOTS!',
    parts: [
      {
        title: 'Comparative Excretory Structures & Plant Excretory Products',
        idea: 'Excretion removes toxic metabolic waste (CO₂, urea, uric acid, excess salts), NOT undigested faeces (which is egestion — faeces never entered body cells!).',
        rules: [
          'Amoeba/Paramecium → Contractile vacuole (osmoregulation). Flatworms (Planaria, Tapeworm) → Flame cells. Earthworm → Nephridia.',
          'Insects (Cockroach, Grasshopper) → Malpighian tubules (excrete dry URIC ACID crystals to conserve water!). Crustaceans (Prawn) → Green (antennal) gland.',
          'Plant excretory/secretory products: O₂ & CO₂ via stomata/lenticels; tannins, alkaloids (quinine, morphine), gums, mucilage, latex, resins, calcium oxalate crystals stored in bark/old leaves.',
        ],
        ex: {
          q: 'Why do desert insects and birds excrete nitrogenous waste as insoluble uric acid paste rather than ammonia or urea?',
          steps: [
            ['Ammonia is highly toxic and requires copious water (aquatic fish/tadpoles)', 'Unsuitable for terrestrial water conservation.'],
            ['Uric acid is virtually insoluble and non-toxic', 'Precipitates out in Malpighian tubules/cloaca so almost 100% of water is reabsorbed — also vital inside cleidoic shelled eggs!'],
          ],
        },
        tryit: {
          q: 'Which pairing of organism and excretory structure is INCORRECT?',
          o: [
            'Earthworm (Lumbricus) — Malpighian tubules',
            'Planaria (flatworm) — Flame cells (protonephridia)',
            'Freshwater Amoeba — Contractile vacuole',
            'Crayfish / Prawn — Green (antennal) gland',
          ],
          a: 0,
          h: 'Earthworms are segmented annelids; insects have Malpighian tubules!',
          e: 'Earthworms excrete via paired metameric NEPHRIDIA; Malpighian tubules belong to insects and terrestrial arthropods.',
        },
      },
      {
        title: 'Mitosis (PMAT), Sigmoid Growth & Auxin Tropisms',
        idea: 'Mitosis produces two genetically identical diploid (2n) daughter cells for somatic growth and repair; organismal growth follows an S-shaped (sigmoid) curve: lag → log (exponential) → decelerating → stationary phase.',
        rules: [
          'Mitosis sequence: Interphase (DNA replicates) → Prophase (chromosomes condense, nuclear membrane breaks) → Metaphase (align on equator) → Anaphase (sister chromatids pulled to poles) → Telophase (two diploid nuclei reform) + Cytokinesis.',
          'Unilateral light causes auxin (IAA) to migrate to the SHADED side of a coleoptile shoot → shaded side elongates faster → shoot bends TOWARDS light (+ve phototropism).',
          'In a horizontal seedling, gravity pulls auxin to the LOWER side: lower shoot elongates faster (bends UP, −ve geotropism), while high auxin INHIBITS lower root cells so upper root grows faster (bends DOWN, +ve geotropism)!',
        ],
        ex: {
          q: 'A somatic root-tip cell of onion (2n = 16) undergoes 3 consecutive mitotic divisions. How many daughter cells are formed, and how many chromosomes does each contain?',
          steps: [
            ['Number of cells = 2ⁿ = 2³ = 8 daughter cells', 'Each mitotic cycle doubles the cell count.'],
            ['Chromosome number per cell = 16 (2n)', 'Mitosis preserves exact diploid chromosome number in every daughter cell.'],
          ],
        },
        tryit: {
          q: 'When a young maize seedling is placed horizontally in complete darkness, auxin accumulates on the lower side of both root and plumule. What is the resulting curvature?',
          o: [
            'The root bends downward because high auxin inhibits root elongation, while the shoot bends upward because high auxin stimulates shoot elongation',
            'Both root and shoot bend downward toward gravity because auxin stimulates elongation equally in all meristems',
            'Both root and shoot grow straight horizontally because tropisms require unilateral blue light',
            'The shoot bends downward and the root bends upward due to turgor loss on the upper side',
          ],
          a: 0,
          h: 'Roots are ~10,000× more sensitive to IAA than shoots — shoot-optimum IAA inhibits root cells!',
          e: 'Accumulated auxin on the lower side stimulates shoot cells (curving upward, −ve geotropism) but inhibits lower root cells while upper root cells elongate normally (curving downward, +ve geotropism).',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'During which phase of mitosis do sister chromatids separate at the centromere and migrate toward opposite spindle poles?', o: ['Anaphase', 'Metaphase', 'Prophase', 'Telophase'], a: 0, e: 'Spindle fibres shorten at anaphase, splitting centromeres and pulling sister chromatids apart to opposite poles.' },
      { l: 2, q: 'Why is the elimination of undigested cellulose fibres through the mammalian anus classified as egestion rather than excretion?', o: ['Cellulose never entered body cells or participated in intracellular chemical metabolism', 'Faeces contain zero water or bile pigments from the liver', 'Egestion requires active ATP pumps whereas excretion is purely passive', 'Only gaseous waste products qualify biologically as excretion'], a: 0, e: 'Excretion removes waste products of cellular metabolism (CO₂, urea, bile pigments), whereas undigested roughage merely passed through the gut lumen.' },
      { l: 3, q: 'In a standard sigmoid (S-shaped) growth curve, rapid exponential cell division where resources are abundant corresponds to the:', o: ['Logarithmic (exponential) phase', 'Lag phase', 'Senescence phase', 'Stationary (plateau) phase'], a: 0, e: 'After the slow initial lag phase, growth accelerates exponentially during the log phase before limiting factors cause deceleration toward the stationary plateau.' },
      { l: 3, q: 'Which plant waste product extracted from the bark of <i>Cinchona</i> trees is economically vital as an antimalarial drug?', o: ['Quinine (an alkaloid)', 'Tannin (used in leather tanning)', 'Latex (used in vulcanized rubber)', 'Gum arabic (used in adhesives)'], a: 0, e: 'Quinine is a bitter nitrogenous alkaloid stored in <i>Cinchona</i> bark; tannins tan hides into leather and rubber latex comes from <i>Hevea brasiliensis</i>.' },
      { l: 4, q: 'Which instrument rotates a potted seedling slowly on a motorized turntable to cancel out unilateral gravity or light so the plant grows straight?', o: ['Clinostat (Klinostat)', 'Potometer', 'Auxanometer', 'Kymograph'], a: 0, e: 'A rotating clinostat distributes gravity (or light) uniformly around all sides of the stem/root, preventing lateral auxin accumulation; an auxanometer measures linear stem growth.' },
      { l: 5, q: 'Apical dominance — where an intact terminal bud suppresses the sprouting of lateral axillary buds — is mediated primarily by:', o: ['Auxins diffusing basipetally downward from the shoot apex', 'Abscisic acid synthesized in root caps during drought', 'Ethene gas released only by ripening pericarp tissue', 'Cytokinins destroying the vascular cambium in stems'], a: 0, e: 'High IAA produced by the apical bud inhibits lateral buds; pruning the shoot tip removes the auxin source so lateral buds sprout into bushy branches.' },
    ],
  },

  // 7. Supporting Tissues & Mammalian Skeletal System
  {
    id: 'b-skeleton',
    name: 'Supporting Tissues & Mammalian Skeleton',
    sec: 'SS 1 · Second Term · Organization of Life',
    boss: 'Vertebrae, Joints & Plant Support Test',
    goals: [
      'Compare hydrostatic, exoskeleton (chitin), and endoskeleton (cartilage & bone) systems, and identify all mammalian vertebrae',
      'Distinguish synovial joint types (ball-and-socket, hinge, pivot, gliding) and plant supporting tissues (turgid parenchyma, collenchyma, sclerenchyma, xylem)',
    ],
    trap: 'LIGAMENTS connect Bone to Bone (stabilizing joints, elastic), whereas TENDONS connect Muscle to Bone (transmitting pull, inelastic collagen)!',
    parts: [
      {
        title: 'Axial vs Appendicular Skeleton & Vertebral Column Identification',
        idea: 'The axial skeleton comprises the skull, vertebral column, ribs, and sternum; the appendicular skeleton comprises the pectoral girdle (scapula + clavicle), pelvic girdle, and fore/hind limbs (pentadactyl plan).',
        rules: [
          'Cervical vertebrae (7 in ALL mammals — even giraffes!): possess VERTEBRARTERIAL CANALS in transverse processes! Atlas (1st) has NO centrum & tiny spine (nodding “yes”); Axis (2nd) has ODONTOID PROCESS peg (shaking head “no”).',
          'Thoracic vertebrae (12 in humans): LONG backward-pointing neural spine + costal facets for rib articulation.',
          'Lumbar vertebrae (5 in humans): MASSIVE thick centrum + long broad transverse processes + metapophyses/anapophyses for abdominal muscle attachment.',
          'Sacral (5 fused → sacrum, articulates with ilium of pelvis) + Caudal/Coccygeal (4 fused → coccyx in humans; tail in rats/monkeys).',
        ],
        ex: {
          q: 'During a WAEC practical, Specimen K is a mammalian vertebra with two small holes piercing its transverse processes, a forked (bifid) short neural spine, and no odontoid peg. Identify Specimen K and its region.',
          steps: [
            ['Spot the diagnostic holes in transverse processes → Vertebrarterial canals', 'Uniquely identifies ALL cervical (neck) vertebrae for vertebral blood vessels.'],
            ['Has a centrum (not ring-like Atlas) and no odontoid peg (not Axis)', 'Specimen K is an ordinary Cervical vertebra (C3–C7) from the neck region.'],
          ],
        },
        tryit: {
          q: 'Which mammalian vertebra possesses a peg-like odontoid process that projects into the ring of the atlas to permit side-to-side rotation of the head?',
          o: [
            'Axis (second cervical vertebra)',
            'Atlas (first cervical vertebra)',
            'First thoracic vertebra',
            'Fifth lumbar vertebra',
          ],
          a: 0,
          h: 'Atlas nods on occipital condyles; the second neck vertebra provides the pivot peg!',
          e: 'The axis (C2) bears the odontoid process (dens), forming a pivot joint with the atlas (C1) for shaking/rotating the head.',
        },
      },
      {
        title: 'Synovial Joints, Antagonistic Muscles & Plant Supporting Tissues',
        idea: 'Movable synovial joints cushion bone ends with hyaline articular cartilage lubricated by synovial fluid; in plants, living turgid parenchyma/collenchyma support young stems while dead lignified sclerenchyma/xylem support mature woody stems.',
        rules: [
          'Ball-and-socket (360° multi-plane): Shoulder (glenoid cavity + humerus) & Hip (acetabulum + femur). Hinge (1 plane): Elbow, Knee, Phalanges.',
          'Bending the arm (flexion): BICEPS contracts while TRICEPS relaxes; straightening (extension): TRICEPS contracts while BICEPS relaxes.',
          'Collenchyma: LIVING cells with uneven cellulose/pectin corner thickening (flexible support in young stems/petioles). Sclerenchyma & Xylem vessels: DEAD hollow cells heavily impregnated with waterproof LIGNIN.',
        ],
        ex: {
          q: 'State what happens to the biceps, triceps, scapula, and radius when a student lifts a cup of water to her mouth.',
          steps: [
            ['Biceps (flexor) contracts; triceps (extensor) relaxes antagonistically', 'Muscles can only pull by contracting, never push.'],
            ['Inelastic biceps tendon pulls on the radius across the elbow hinge joint', 'Forearm flexes upward while the scapula anchors the biceps origin.'],
          ],
        },
        tryit: {
          q: 'Which plant supporting tissue consists of LIVING elongated cells with cellulose thickening concentrated at the corners, giving flexible mechanical strength to young dicot stems and leaf stalks?',
          o: [
            'Collenchyma',
            'Sclerenchyma fibres',
            'Lignified xylem vessels',
            'Suberized cork cambium',
          ],
          a: 0,
          h: 'Sclerenchyma and mature xylem are dead and lignified; which living tissue allows young stems to bend in wind without snapping?',
          e: 'Collenchyma cells remain alive and protoplast-filled with unevenly thickened cellulose corners, providing plastic/flexible support in growing organs.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'In a movable mammalian joint, tough elastic fibrous tissue that binds one bone to another bone across the joint capsule is a:', o: ['Ligament', 'Tendon', 'Sutural cartilage', 'Synovial membrane'], a: 0, e: 'Ligaments join bone to bone (elastic to prevent dislocation), whereas inelastic tendons attach muscle to bone.' },
      { l: 2, q: 'Which characteristic immediately identifies a thoracic vertebra on a practical bench?', o: ['A very long backward-sloping neural spine and articular facets for ribs', 'Vertebrarterial canals piercing both transverse processes', 'A massive kidney-shaped centrum with prominent metapophyses and short broad spine', 'Complete absence of a centrum with wide wing-like transverse processes'], a: 0, e: 'Thoracic vertebrae bear a prominent long neural spine (anchoring neck/back muscles) and demifacets/tubercular facets where ribs articulate.' },
      { l: 3, q: 'Arthropods such as crabs and grasshoppers must periodically shed their chitinous exoskeleton in order to grow — a hormone-controlled process called:', o: ['Ecdysis (moulting)', 'Metamorphosis', 'Aestivation', 'Ossification'], a: 0, e: 'Because dead non-living chitin cannot stretch once hardened, arthropods shed the old cuticle (ecdysis, controlled by ecdysone) and expand before the new exoskeleton hardens.' },
      { l: 3, q: 'The glenoid cavity is a shallow socket that articulates with the head of the humerus and is located on the:', o: ['Scapula (pectoral girdle)', 'Pelvic girdle (innominate bone)', 'Clavicle (collar bone)', 'Olecranon process of the ulna'], a: 0, e: 'Glenoid cavity = shoulder socket on the scapula; Acetabulum = deep hip socket on the pelvic girdle; Sigmoid notch + olecranon = elbow on the ulna.' },
      { l: 4, q: 'Why does an herbaceous seedling wilt and droop on a hot dry afternoon whereas a woody mahogany sapling remains upright?', o: ['Herbaceous stems rely primarily on cell turgidity in parenchyma, whereas woody stems rely on permanent lignified xylem and sclerenchyma', 'Woody saplings lack stomata completely and therefore never lose water vapour', 'Herbaceous stems contain chitinous rings that melt above 30 °C', 'Lignin in herbaceous stems dissolves whenever transpiration exceeds absorption'], a: 0, e: 'Non-woody herbs depend on hydrostatic turgor pressure in parenchyma cells; when transpiration exceeds water uptake, cells become flaccid and stems droop.' },
      { l: 5, q: 'Which minerals and vitamin are jointly essential for the ossification (hardening) of embryonic cartilage into mature mammalian bone?', o: ['Calcium, phosphorus, and Vitamin D', 'Iron, iodine, and Vitamin C', 'Sodium, potassium, and Vitamin B₁', 'Magnesium, nitrogen, and Vitamin K'], a: 0, e: 'Bone matrix consists largely of calcium trioxophosphate(V) — Ca₃(PO₄)₂ — and calcium carbonate; Vitamin D (calciferol) promotes intestinal absorption of Ca²⁺ and PO₄³⁻.' },
    ],
  },

  // 8. Basic Ecological Concepts, Biomes & Nigerian Vegetation Zones
  {
    id: 'b-ecol-concepts',
    name: 'Ecological Concepts & Nigerian Biomes',
    sec: 'SS 1 · Third Term · The Organism & Its Environment',
    boss: 'Ecology & Nigerian Biomes Test',
    goals: [
      'Define species, population, community, ecosystem, biosphere, habitat, and ecological niche with precision',
      'Order Nigeria’s local biotic zones from south to north (Mangrove Swamp → Freshwater Swamp → Tropical Rainforest → Guinea → Sudan → Sahel Savanna) by rainfall and adaptations',
    ],
    trap: 'HABITAT is the organism’s physical “address” (where it lives), whereas ECOLOGICAL NICHE is its functional “profession” (trophic role, activity period, and resource interactions)!',
    parts: [
      {
        title: 'Core Ecological Hierarchy & Abiotic Factors',
        idea: 'Ecology studies interactions between living biotic communities (producers, consumers, decomposers) and non-living abiotic factors (climatic, edaphic/soil, and topographic).',
        rules: [
          'Population: members of the SAME species in a habitat at a given time (e.g. all Tilapia zillii in a pond). Community: ALL interacting populations of different species in that habitat.',
          'Edaphic factors = soil properties (pH, texture, humus, moisture, mineral salts). Topographic = altitude, slope, aspect.',
          'Instruments: Anemometer (wind speed), Wind vane (wind direction), Hygrometer / Wet-and-dry bulb (relative humidity), Secchi disc (water turbidity / light penetration), Rain gauge (rainfall), Lux/Photometer (light intensity).',
        ],
        ex: {
          q: 'Two species of weaver birds nest in the same acacia tree without driving each other to extinction: one feeds on seeds on outer twigs by day, while the other gleans insects under bark at dusk. Explain ecologically.',
          steps: [
            ['Same physical address → Identical Arboretum Habitat', 'Both live in the same acacia canopy.'],
            ['Different functional roles → Distinct Ecological Niches (resource partitioning)', 'Avoids Gause’s competitive exclusion principle!'],
          ],
        },
        tryit: {
          q: 'Which ecological instrument is lowered on a calibrated rope into a lagoon or river to measure water turbidity (transparency)?',
          o: [
            'Secchi disc',
            'Hydrometer',
            'Hygrometer',
            'Anemometer',
          ],
          a: 0,
          h: 'Do not confuse hydrometer (liquid relative density) or hygrometer (air humidity) with the black-and-white water disc!',
          e: 'A black-and-white Secchi disc measures water transparency/turbidity by recording the depth at which it just disappears from view.',
        },
      },
      {
        title: 'Nigerian Local Biomes (South → North Rainfall Gradient)',
        idea: 'Moving northward from the Atlantic coast toward Lake Chad, annual rainfall drops from >2500 mm to <500 mm while dry-season length increases, shifting vegetation from tall stratified forests to open thorny Sahel.',
        rules: [
          '1. Mangrove (Saltwater) Swamp (Port Harcourt, Warri, Calabar): brackish tidal mud, Rhizophora & Avicennia with stilt roots & breathing PNEUMATOPHORES.',
          '2. Tropical Rainforest (Ondo, Edo, Cross River): 2000–3000 mm rain, tall buttress-rooted emergents (Iroko, Mahogany, Obeche), 3–5 canopy strata, epiphytes & lianas, sparse forest-floor grass.',
          '3. Guinea Savanna (Enugu, Benue, Kwara, Kaduna — Nigeria’s LARGEST biome!): tall elephant grass + fire-resistant thick-barked deciduous trees (Isoberlinia, Shea butter, Locust bean).',
          '4. Sudan Savanna (Kano, Sokoto, Katsina): short grasses, Acacia, Baobab (swollen water-storing trunk). 5. Sahel Savanna (Borno/Lake Chad): <500 mm rain, xerophytic thorny shrubs & drought-evading ephemerals.',
        ],
        ex: {
          q: 'State two adaptations of Guinea Savanna trees to annual dry-season bush fires and two adaptations of Rainforest emergents to heavy rainfall and shallow soil.',
          steps: [
            ['Guinea Savanna trees: thick corky fire-resistant bark + twisted deciduous trunks + underground rootstocks', 'Survive seasonal bush fires and shed leaves to cut transpiration in dry harmattan.'],
            ['Rainforest giants: wide plank buttress roots + drip-tip leathery evergreen leaves', 'Buttresses prop 50 m trunks in shallow leached soil; drip tips shed heavy rainwater rapidly.'],
          ],
        },
        tryit: {
          q: 'Which local biotic community covers the LARGEST land area in Nigeria and is characterized by tall grasses interspersed with fire-resistant trees like Shea butter (Vitellaria) and Isoberlinia?',
          o: [
            'Guinea Savanna',
            'Tropical Rainforest',
            'Sahel Savanna',
            'Estuarine Mangrove Swamp',
          ],
          a: 0,
          h: 'It spans Nigeria’s broad Middle Belt between the southern rainforest and northern Sudan savanna.',
          e: 'Southern and Northern Guinea Savanna together form Nigeria’s most extensive vegetation belt, featuring tall tussock grasses and thick-barked fire-tolerant trees.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'All the tilapia fish, water lilies, tadpoles, dragonflies, and bacteria interacting together in a freshwater pond constitute a:', o: ['Biotic community', 'Population', 'Biosphere', 'Edaphic factor'], a: 0, e: 'A biotic community comprises all interacting populations of different species living in a defined habitat; adding abiotic water/mud/sunlight makes it an ecosystem.' },
      { l: 2, q: 'Red and white mangroves (<i>Rhizophora</i> and <i>Avicennia</i>) survive in waterlogged, oxygen-deficient brackish mud by developing:', o: ['Stilt roots for anchorage and upward-projecting pneumatophores for gaseous exchange', 'Deep taproots reaching 40 metres down to desert water tables', 'Succulent phylloclades with sunken stomata and spines', 'Broad plank buttress roots and climbing woody lianas'], a: 0, e: 'Mangroves use stilt/prop roots against tidal currents and aerial breathing roots (pneumatophores with lenticels) to absorb O₂ above anoxic mud.' },
      { l: 3, q: 'Arrange the following Nigerian vegetation belts in correct geographical order from the Atlantic coast northward to Lake Chad:', o: ['Mangrove swamp → Tropical rainforest → Guinea savanna → Sudan savanna → Sahel savanna', 'Tropical rainforest → Mangrove swamp → Sudan savanna → Guinea savanna → Sahel savanna', 'Mangrove swamp → Guinea savanna → Tropical rainforest → Sahel savanna → Sudan savanna', 'Sahel savanna → Sudan savanna → Guinea savanna → Tropical rainforest → Mangrove swamp'], a: 0, e: 'Moving south to north as rainfall decreases: Coastal Mangrove → Freshwater Swamp → Tropical Rainforest → Guinea Savanna → Sudan Savanna → Sahel Savanna (Borno).' },
      { l: 3, q: 'Which pair of instruments correctly measures relative humidity and wind speed respectively in an ecological field study?', o: ['Hygrometer and Anemometer', 'Hydrometer and Wind vane', 'Barometer and Photometer', 'Wet-bulb thermometer and Secchi disc'], a: 0, e: 'Hygrometer (or wet-and-dry bulb thermometer) measures atmospheric relative humidity; anemometer measures wind speed (wind vane measures direction).' },
      { l: 4, q: 'Why is herbaceous grass cover sparse on the floor of an undisturbed Tropical Rainforest despite abundant rainfall and warmth?', o: ['Dense upper tree canopies intercept over 95% of sunlight before it reaches the forest floor', 'Rainforest soil is hypertonic due to tidal Atlantic seawater intrusion', 'Annual harmattan bush fires burn away all grass seeds on the forest floor', 'Decomposer bacteria are completely absent in humid rainforest litter'], a: 0, e: 'Stratified crowns of emergents and canopy trees block sunlight, making light intensity the primary limiting factor on the rainforest floor.' },
      { l: 5, q: 'Edaphic ecological factors refer specifically to:', o: ['Physical, chemical, and biological properties of the soil such as pH, texture, and humus', 'Atmospheric conditions including rainfall, wind velocity, and relative humidity', 'Topographic elevation, mountain slope steepness, and valley aspect', 'Interspecific predation, parasitism, and competition among animals'], a: 0, e: 'Edaphic factors encompass soil pH, porosity, water-holding capacity, mineral content, and humus.' },
    ],
  },

  // 9. Functioning Ecosystem — Food Webs, Pyramids & Nutrient Cycles
  {
    id: 'b-trophic',
    name: 'Food Webs, Pyramids & Nutrient Cycles',
    sec: 'SS 1 · Third Term · The Organism & Its Environment',
    boss: 'Trophic Energy & Nitrogen Cycle Test',
    goals: [
      'Apply Lindeman’s 10% energy transfer law across trophic levels and explain why pyramids of energy can NEVER be inverted',
      'Trace every bacterial and physical step of the Nitrogen Cycle (Rhizobium, Azotobacter, Nitrosomonas, Nitrobacter, Pseudomonas) and Carbon Cycle',
    ],
    trap: 'Pyramids of NUMBERS can be inverted (1 giant Iroko tree feeding 5,000 caterpillars), whereas Pyramids of ENERGY are ALWAYS upright!',
    parts: [
      {
        title: 'Food Chains, Trophic Levels & Lindeman’s 10% Energy Law',
        idea: 'Energy flows UNIDIRECTIONALLY from sunlight → autotrophic producers (Trophic Level 1) → primary consumers (herbivores, TL 2) → secondary/tertiary consumers, losing ~90% as respiratory heat, movement, and faeces at every step.',
        rules: [
          'Only ~10% of energy at one trophic level is incorporated into biomass of the next level → food chains rarely exceed 4–5 links!',
          'Pyramid of Numbers: can be INVERTED (e.g. 1 Oak/Iroko tree → 2,000 insects → 50 birds, or parasitic chains: 1 dog → 200 ticks → 100,000 protozoa).',
          'Pyramid of Energy (kJ m⁻² yr⁻¹): NEVER inverted under any circumstance (Second Law of Thermodynamics).',
        ],
        ex: {
          q: 'In a savanna food chain: Grass (40,000 kJ) → Grasshopper → Toad → Snake → Hawk. Assuming 10% trophic efficiency at each step, how much energy reaches the Hawk?',
          steps: [
            ['Grasshopper (TL 2) = 10% of 40,000 = 4,000 kJ', 'First 10% transfer from producer.'],
            ['Toad (TL 3) = 400 kJ → Snake (TL 4) = 40 kJ → Hawk (TL 5) = 4 kJ', 'Four transfers: 40,000 × (0.1)⁴ = 4 kJ! Explains why apex predators are scarce.'],
          ],
        },
        tryit: {
          q: 'Why is eating maize grains directly far more energetically efficient for feeding a large human population than feeding the maize to cattle and eating beef?',
          o: [
            'Shortening the food chain eliminates the ~90% respiratory and excretory energy loss inside cattle',
            'Cattle destroy all nitrogen atoms in maize protein during rumen digestion',
            'Beef contains zero chemical energy per gram compared with maize cellulose',
            'Energy pyramids invert whenever humans act as secondary consumers',
          ],
          a: 0,
          h: 'Apply the 10% rule: Trophic Level 2 (humans eating grain) vs Trophic Level 3 (grain → cow → human)!',
          e: 'About 90% of the energy in maize is lost by cattle through respiration, heat, movement, and dung; eating grain directly captures ~10× more available solar energy per hectare.',
        },
      },
      {
        title: 'The Nitrogen Cycle & Carbon Cycle',
        idea: 'Unlike energy (which flows one-way and dissipates as heat), mineral nutrients (C, N, H₂O) are recycled endlessly by decomposers and specialized chemoautotrophic soil bacteria.',
        rules: [
          'Nitrogen Fixation (N₂ → NH₄⁺/NO₃⁻): symbiotic Rhizobium in legume root nodules, free-living Azotobacter/Clostridium/Nostoc, and thunderstorms/lightning.',
          'Ammonification (Putrefaction): saprophytic bacteria & fungi break dead proteins/urea into ammonia/ammonium (NH₄⁺).',
          'Nitrification (aerobic!): Nitrosomonas oxidizes NH₄⁺ → Nitrite (NO₂⁻); THEN Nitrobacter oxidizes NO₂⁻ → Nitrate (NO₃⁻, absorbed by roots!).',
          'Denitrification (anaerobic waterlogged soil!): Pseudomonas denitrificans reduces NO₃⁻ → N₂ gas back to air, depleting soil fertility!',
        ],
        ex: {
          q: 'Distinguish the exact chemical roles of Nitrosomonas, Nitrobacter, and Rhizobium in the nitrogen cycle.',
          steps: [
            ['Rhizobium (symbiotic in cowpea/groundnut root nodules): N₂ gas → Ammonium/organic nitrogen', 'Fixes inert atmospheric N₂ using nitrogenase.'],
            ['Nitrosomonas: Ammonium (NH₄⁺) → Trioxonitrate(III) / Nitrite (NO₂⁻)', 'First step of aerobic nitrification.'],
            ['Nitrobacter: Nitrite (NO₂⁻) → Trioxonitrate(V) / Nitrate (NO₃⁻)', 'Second step producing plant-available nitrate!'],
          ],
        },
        tryit: {
          q: 'Which bacterium converts nitrites (NO₂⁻) into nitrates (NO₃⁻) in well-aerated agricultural soil?',
          o: [
            'Nitrobacter',
            'Nitrosomonas',
            'Pseudomonas denitrificans',
            'Azotobacter',
          ],
          a: 0,
          h: 'Memory hook: NitroSOmonas makes NO₂⁻ (nitrite); NitroBACTER finishes the job to NO₃⁻ (nitrate)!',
          e: 'Nitrosomonas oxidizes NH₄⁺ to NO₂⁻, and Nitrobacter oxidizes NO₂⁻ to NO₃⁻.',
        },
      },
    ],
    spot: {
      part: 1,
      who: 'Chidinma',
      q: 'Chidinma drew the bacterial steps of nitrification and denitrification for WAEC.',
      lines: [
        'Putrefying bacteria decompose dead proteins into ammonium ions (NH₄⁺).',
        'Nitrobacter oxidizes NH₄⁺ to NO₂⁻, then Nitrosomonas oxidizes NO₂⁻ to NO₃⁻.',
        'In waterlogged anaerobic soil, denitrifying bacteria convert NO₃⁻ back to N₂ gas.',
      ],
      bad: 1,
      okfb: ['Correct — ammonification comes first.', '', 'Correct — drainage prevents denitrification.'],
      o: [
        'She swapped the two nitrifiers: Nitrosomonas converts NH₄⁺ → NO₂⁻ first, then Nitrobacter converts NO₂⁻ → NO₃⁻',
        'Rhizobium converts NO₂⁻ to N₂ gas in root nodules',
        'Nitrification occurs only in anaerobic waterlogged clay',
      ],
      a: 0,
      fb: [
        'Spot on! Nitrosomonas (NH₄⁺ → NO₂⁻) always precedes Nitrobacter (NO₂⁻ → NO₃⁻).',
        'Rhizobium fixes N₂ into ammonium/amino acids.',
        'Nitrifying bacteria are strict aerobes requiring well-aerated soil.',
      ],
      h: ['Check the order of Nitrosomonas vs Nitrobacter!'],
      fix: 'Nitrosomonas oxidizes NH₄⁺ → NO₂⁻, and Nitrobacter oxidizes NO₂⁻ → NO₃⁻.',
    },
    qs: [
      { l: 1, dx: 1, q: 'Which biological process is the ONLY major natural pathway that removes carbon(IV) oxide from the atmosphere and fixes it into organic compounds?', o: ['Photosynthesis by green plants and algae', 'Aerobic respiration by animals and fungi', 'Putrefaction by saprophytic soil bacteria', 'Combustion of fossil hydrocarbon fuels'], a: 0, e: 'Photosynthesis (plus minor chemosynthesis) fixes atmospheric CO₂ into carbohydrates; respiration, decay, and combustion all return CO₂ to the air.' },
      { l: 2, q: 'In the food chain: Phytoplankton → Zooplankton → Tilapia → Kingfisher, which organism occupies the SECOND trophic level?', o: ['Zooplankton (primary consumer)', 'Phytoplankton (primary producer)', 'Tilapia (secondary consumer)', 'Kingfisher (tertiary consumer)'], a: 0, e: 'Producers (phytoplankton) occupy Trophic Level 1; herbivores/primary consumers (zooplankton) occupy Trophic Level 2.' },
      { l: 3, q: 'Which ecological pyramid can NEVER be inverted in any natural ecosystem?', o: ['Pyramid of energy', 'Pyramid of numbers in a forest ecosystem', 'Pyramid of numbers in a parasitic food chain', 'Pyramid of standing-crop biomass in open ocean plankton'], a: 0, e: 'Because ~90% of energy is lost as heat at every transfer (2nd Law of Thermodynamics), the pyramid of energy (kJ m⁻² yr⁻¹) is unconditionally upright.' },
      { l: 3, q: 'Farmers plough and aerate waterlogged farmland primarily to:', o: ['Encourage aerobic nitrifying bacteria and suppress anaerobic denitrifying bacteria', 'Kill symbiotic <i>Rhizobium</i> inside leguminous root nodules', 'Convert soluble nitrates back into inert atmospheric nitrogen gas', 'Halt decomposition of humus by earthworms and fungi'], a: 0, e: 'Aeration supplies O₂ for <i>Nitrosomonas</i> and <i>Nitrobacter</i> while inhibiting anaerobic <i>Pseudomonas denitrificans</i> from stripping soil nitrates.' },
      { l: 4, q: 'If green grass captures 120,000 kJ of solar energy in a paddock, approximately how much energy is incorporated into a lion (secondary carnivore / TL 3: Grass → Antelope → Lion) assuming 10% efficiency?', o: ['1,200 kJ', '12,000 kJ', '120 kJ', '40,000 kJ'], a: 0, e: 'Grass (TL 1) = 120,000 kJ → Antelope (TL 2) = 12,000 kJ → Lion (TL 3) = 1,200 kJ.' },
      { l: 5, q: 'Free-living soil bacteria capable of fixing atmospheric nitrogen WITHOUT forming root nodules on legumes include:', o: ['<i>Azotobacter</i> and <i>Clostridium</i>', '<i>Rhizobium</i> and <i>Nitrobacter</i>', '<i>Nitrosomonas</i> and <i>Pseudomonas</i>', '<i>Plasmodium</i> and <i>Vibrio</i>'], a: 0, e: '<i>Azotobacter</i> (aerobic) and <i>Clostridium</i> (anaerobic) are free-living nitrogen fixers in soil, whereas <i>Rhizobium</i> is symbiotic in legume nodules.' },
    ],
  },

  // 10. Population Ecology, Quadrats, Lincoln Index & Micro-organisms in Health
  {
    id: 'b-pop-micro',
    name: 'Population Sampling & Micro-organisms in Health',
    sec: 'SS 1 · Third Term · The Organism & Its Environment',
    boss: 'Quadrat, Lincoln Index & Microbes Test',
    goals: [
      'Calculate plant population density and total size from random quadrat throws, and estimate mobile animal populations via Lincoln’s capture–mark–recapture index',
      'Apply Koch’s postulates, pasteurization, sterilization, and antiseptic principles to pathogenic bacteria, viruses, fungi, and protozoa',
    ],
    trap: 'Quadrat sampling works ONLY for stationary plants or very slow organisms; mobile animals (grasshoppers, fish, rats) MUST be sampled using Capture–Mark–Recapture (Lincoln Index)!',
    parts: [
      {
        title: 'Quadrat Sampling & Lincoln Capture–Mark–Recapture Formula',
        idea: 'For plants, Population Density = Total individuals counted ÷ Total quadrat area sampled; for mobile animals, Lincoln Index estimates population N = (M × C) ÷ R.',
        rules: [
          'Quadrat method: throw quadrat AT RANDOM N_throws times. Total area sampled = N_throws × Area_one_quadrat. Estimated Total Population = Density × Total Field Area.',
          'Lincoln Index: capture & harmlessly mark M animals, release to mix; capture second sample C, count marked recaptures R  ⇒  N = (M × C) ÷ R.',
          'Lincoln assumptions: paint mark is non-toxic & does not attract predators, marked individuals mix randomly, negligible birth/death/migration between captures.',
        ],
        ex: {
          q: 'An ecologist throws a 0.5 m² quadrat 10 times randomly in a 200 m² school lawn, counting 45 Tridax procumbens plants in total. Calculate (a) population density and (b) total Tridax population on the lawn.',
          steps: [
            ['Total area sampled = 10 throws × 0.5 m² = 5.0 m²', 'Multiply throw count by area of one quadrat!'],
            ['Population density = 45 plants ÷ 5.0 m² = 9 plants m⁻²', 'Individuals per square metre.'],
            ['Total lawn population = 9 plants m⁻² × 200 m² = 1,800 plants', 'Scale density by total habitat area.'],
          ],
        },
        tryit: {
          q: 'In a pond study, 60 tilapia fish were netted, tagged harmlessly on the dorsal fin, and released. A week later, 50 tilapia were netted, of which 12 bore tags. Estimate the tilapia population in the pond.',
          o: ['250 tilapia', '14.4 tilapia', '98 tilapia', '720 tilapia'],
          a: 0,
          h: 'Apply Lincoln Index: N = (First marked M × Second total catch C) ÷ Marked recaptured R.',
          e: 'N = (M × C) ÷ R = (60 × 50) ÷ 12 = 3000 ÷ 12 = 250 tilapia.',
        },
      },
      {
        title: 'Micro-organisms Around Us, Koch’s Postulates & Control',
        idea: 'Robert Koch established four experimental postulates proving a specific microbe causes a specific disease; Louis Pasteur disproved spontaneous generation using swan-necked flasks and invented pasteurization.',
        rules: [
          'Koch’s 4 Postulates: (1) Suspect microbe present in every diseased host; (2) Isolated & grown in PURE culture on agar; (3) Pure culture reproduces identical disease in healthy susceptible host; (4) Identical microbe re-isolated from experimentally infected host.',
          'Antiseptics (Dettol, iodine tincture, 70% ethanol): safe on LIVING skin/wounds to inhibit microbes. Disinfectants (concentrated Izal, bleach, phenol): stronger chemicals used on NON-LIVING floors/drains.',
          'Antibiotics (penicillin from Penicillium notatum discovered by Alexander Fleming, streptomycin): kill or inhibit BACTERIA (peptidoglycan/70S ribosomes), NEVER viruses!',
        ],
        ex: {
          q: 'Why does taking amoxicillin or penicillin fail to cure influenza, measles, or the common cold?',
          steps: [
            ['Influenza, measles, and common cold are caused by VIRUSES, not bacteria', 'Antibiotics target bacterial cell walls (peptidoglycan) or 70S ribosomes.'],
            ['Viruses lack cell walls, cytoplasm, and ribosomes', 'Viruses replicate inside host cells, so antibacterial antibiotics have no target site on them.'],
          ],
        },
        tryit: {
          q: 'Louis Pasteur heated milk briefly to ~72 °C for 15 seconds (or 63 °C for 30 minutes) followed by rapid cooling in order to:',
          o: [
            'Destroy pathogenic vegetative bacteria like Mycobacterium tuberculosis without ruining milk flavour or nutritional value',
            'Convert lactose completely into ethanol so milk can be stored open at room temperature forever',
            'Sterilize heat-resistant bacterial endospores by charring casein proteins at boiling point',
            'Stimulate spontaneous generation of beneficial lactic acid moulds from sterile broth',
          ],
          a: 0,
          h: 'Pasteurization is mild controlled heating, distinct from 121 °C autoclaving!',
          e: 'Pasteurization kills vegetative milk-borne pathogens (TB, Brucella, Salmonella) and delays souring while preserving taste and vitamins.',
        },
      },
    ],
    qs: [
      { l: 1, dx: 1, q: 'Which sampling technique is most appropriate for determining the distribution change of mangrove plants along a straight line from low-tide mud to dry land?', o: ['Line or belt transect', 'Capture–mark–recapture (Lincoln index)', 'Sweep net sampling', 'Tullgren funnel extraction'], a: 0, e: 'A line or belt transect records how species distribution changes systematically across an environmental gradient (zonation).' },
      { l: 2, q: 'A 1 m × 1 m quadrat was tossed 8 times at random in a 100 m² plot, yielding counts of 4, 6, 5, 3, 7, 5, 6, and 4 <i> Emilia</i> plants. What is the estimated total population in the plot?', o: ['500 plants', '40 plants', '320 plants', '5 plants'], a: 0, e: 'Total count = 40 plants across 8 × 1 m² = 8 m². Density = 40 ÷ 8 = 5 plants m⁻². Total in 100 m² = 5 × 100 = 500 plants.' },
      { l: 3, q: 'Penicillin, the first clinical antibiotic discovered in 1928 by Alexander Fleming, is naturally secreted by a:', o: ['Saprophytic fungus (<i>Penicillium notatum</i>)', 'Rod-shaped bacillus bacterium', 'Bacteriophage DNA virus', 'Photosynthetic green alga'], a: 0, e: 'Fleming observed a clear bacteria-free zone around a contaminating colony of the mould fungus <i>Penicillium notatum</i> on a <i>Staphylococcus</i> agar plate.' },
      { l: 3, q: 'Which of the following human diseases is caused by a bacterium rather than a virus?', o: ['Cholera (<i>Vibrio cholerae</i>) and Tuberculosis', 'Poliomyelitis and Yellow fever', 'Measles and Rabies', 'Lassa fever and Smallpox'], a: 0, e: 'Cholera (<i>Vibrio cholerae</i>) and TB (<i>Mycobacterium tuberculosis</i>) are bacterial; polio, yellow fever, measles, rabies, Lassa, and smallpox are all viral.' },
      { l: 4, q: 'If the paint spot used to mark grasshoppers in a capture–mark–recapture experiment makes marked grasshoppers much easier for birds to spot and eat, the calculated Lincoln Index population estimate N = MC/R will be:', o: ['Artificially overestimated because fewer marked individuals R survive to be recaptured', 'Artificially underestimated because R becomes larger than M', 'Completely unaffected because predation removes marked and unmarked insects equally', 'Equal to zero because C drops to zero'], a: 0, e: 'Selective predation on marked insects lowers R in the denominator of N = (M × C) ÷ R, inflating the calculated population N.' },
      { l: 5, q: 'Which step of Koch’s postulates cannot be fulfilled using sterile nutrient agar alone when investigating a purely viral disease?', o: ['Growing the isolated pathogen in a cell-free pure culture on lifeless nutrient agar', 'Observing the pathogen in tissues of diseased hosts using an electron microscope', 'Inoculating a healthy susceptible host to check whether symptoms appear', 'Recovering viral particles from the newly infected experimental host'], a: 0, e: 'Because viruses are obligate intracellular parasites, they cannot multiply on cell-free nutrient agar; they require living host cells (e.g. chick embryos or tissue culture).' },
    ],
  },
];
