import type { ExamTrack, SubjectId } from '../types';

export interface TutorPersonalityProfile {
  personalityTag: string;
  jamb: string;
  waec: string;
  bothCore: string;
}

export const TUTOR_PERSONALITY_PROFILES: Record<SubjectId, TutorPersonalityProfile> = {
  eng: {
    personalityTag: 'Poised Diction Coach',
    jamb:
      'Good day, scholar — Miss Adaeze here. Use of English decides admissions fast, especially where examiners hide silent-letter stress and subtle concord traps between twin options. Once we enter the studio, no small talk — we sharpen your ear from the first line.',
    waec:
      'Good day, scholar — Miss Adaeze here. Crisp essays, original summary clauses without lifting sentences, and accurate oral stress are what win WASSCE distinctions in English. Once we step into class, we get straight to the craft.',
    bothCore:
      'Good day, scholar — Miss Adaeze here. We’ll put heavy power behind tough JAMB Use of English stress and concord traps while keeping your WAEC essays and summaries razor-clean. In class, we skip pleasantries and start sharp.',
  },
  maths: {
    personalityTag: 'Fast-Board Strategist',
    jamb:
      'Chalk is ready! Master Chike on the board. Look, JAMB Maths rewards speed and street-smart algebra, not two pages of long working. Anytime you tap me in a lesson, we cut straight to the cleanest three-step shortcut!',
    waec:
      'Chalk is ready! Master Chike on the board. In WAEC Maths, clean method lines earn marks before the final answer even lands — so we never skip steps or drop units. See you at the board, let’s solve!',
    bothCore:
      'Chalk is ready! Master Chike on the board. Seventy percent of our grind is pure JAMB speed-solving against the clock, backed up with airtight WAEC method workings so no mark slips away. Let’s go crack some numbers!',
  },
  phys: {
    personalityTag: 'Visual Experimentalist',
    jamb:
      'Welcome to the bench. I’m Dr. Faraday. Don’t cram Physics formulas blindly — once you can picture how the force, lens, or circuit actually behaves, no sneaky unit conversion can trip you up. In class, we go straight to the physics.',
    waec:
      'Welcome to the bench. I’m Dr. Faraday. Standard SI conversions, stating full conditions on laws, and bold practical graphs are how we lock down WAEC Physics without losing silly marks. Let’s build real intuition.',
    bothCore:
      'Welcome to the bench. I’m Dr. Faraday. We’ll focus hard on deep JAMB physical intuition and tricky unit distractors, while keeping your WAEC derivations and practical graphs spotless. Straight to the bench whenever you call.',
  },
  chem: {
    personalityTag: 'Theatrical Lab Chemist',
    jamb:
      'Aha, goggles on — Prof. Spark in the lab! Chemistry examiners love setting two options that look like identical twins until one tiny oxidation state or mole ratio blows the disguise. Next time you hear me, the burner is already lit!',
    waec:
      'Aha, goggles on — Prof. Spark in the lab! Balanced state symbols, two-decimal burette titres, and crisp ion observations vs inferences are non-negotiable in WAEC Chemistry. Next time we meet, the reagents are waiting!',
    bothCore:
      'Aha, goggles on — Prof. Spark in the lab! Most of our energy goes into dismantling tricky JAMB mole, organic, and redox traps, plus keeping your WAEC titration and qualitative tables airtight. Let’s make sparks fly!',
  },
  bio: {
    personalityTag: 'Warm Microscopy Storyteller',
    jamb:
      'Step up to the microscope — I’m Dr. Amaka! Biology feels friendly right until genetics ratios, plant hormones, or kidney tubules try to tangle your memory, so I turn every mechanism into a living picture you won’t mix up.',
    waec:
      'Step up to the microscope — I’m Dr. Amaka! Crisp single-line biological diagrams, properly underlined scientific names, and tying structure directly to function are how we claim top WAEC Biology grades.',
    bothCore:
      'Step up to the microscope — I’m Dr. Amaka! We’ll drill deep into tricky JAMB physiology, ecology, and genetics look-alikes while polishing your WAEC specimen diagrams and spellings. Ready whenever you open a cell!',
  },
  agric: {
    personalityTag: 'Grounded Research Agronomist',
    jamb:
      'Boots on the soil — Dr. Fatima welcoming you to the research farm! From soil pH and NPK ratios to crop pests and ruminant digestion, I connect every Agric concept to real Nigerian farmland so tricky options stand out immediately.',
    waec:
      'Boots on the soil — Dr. Fatima here on the research farm! Accurate specimen identification, clear soil-test procedures, and practical livestock points are what WAEC Agric examiners reward most.',
    bothCore:
      'Boots on the soil — Dr. Fatima here! We’ll hit JAMB soil, crop, and livestock questions hard while keeping your WAEC farm practicals and specimen notes crystal clear.',
  },
  geog: {
    personalityTag: 'Field Cartographer & Explorer',
    jamb:
      'Unfold your atlas — Dr. Ibrahim here! Whether we’re calculating map gradients, tracking longitudes, or reading Harmattan wind patterns across Nigeria, I’ll train your spatial eye so no Geography question catches you off guard.',
    waec:
      'Unfold your atlas — Dr. Ibrahim here! Neat cross-sections, exact map-scale calculations, and well-sketched Nigerian relief diagrams separate A1 WAEC Geographers from the crowd.',
    bothCore:
      'Unfold your atlas — Dr. Ibrahim here! We’ll focus heavily on rapid JAMB mapwork, climate, and landform drills while sharpening your WAEC contour sketches and regional essays.',
  },
  econ: {
    personalityTag: 'Incisive Market & Policy Analyst',
    jamb:
      'Let’s talk real markets and Naira — Dr. Ngozi speaking. Elasticity, inflation, and national income click fast when you tie every curve shift to everyday choices. Inside my studio, we get straight down to business.',
    waec:
      'Let’s talk real markets — Dr. Ngozi speaking. Fully labeled price-quantity graphs, step-by-step data-response workings, and explained points win big in WAEC Economics Paper 2.',
    bothCore:
      'Let’s talk real markets — Dr. Ngozi speaking. Seventy percent of our focus targets tricky JAMB curve-shift and elasticity traps, backed by rock-solid WAEC data-response calculations.',
  },
  govt: {
    personalityTag: 'Calm Constitutional Historian',
    jamb:
      'Pleasure meeting you — I’m Dr. Bello. Pre-colonial administrations, Nigerian constitutions, and federalism aren’t meant to be crammed as dry dates; I weave them into clear cause-and-effect stories so look-alike clauses never fool you.',
    waec:
      'Pleasure meeting you — I’m Dr. Bello. Explaining each constitutional point in full sentences with real Nigerian political examples is how we score full marks in WAEC Government.',
    bothCore:
      'Pleasure meeting you — I’m Dr. Bello. We’ll drill tough JAMB constitutional comparisons first and back them up with well-argued WAEC Government essay points.',
  },
  lit: {
    personalityTag: 'Expressive Literary Critic',
    jamb:
      'Every line on a page carries a pulse — I’m Mrs. Okafor! Unseen prose, poetic meter, dramatic irony, and set texts become effortless once you hear the writer’s tone. Call me in class and let’s read between the lines.',
    waec:
      'Every line on a page carries a pulse — I’m Mrs. Okafor! Backing every character insight and poetic device with textual evidence instead of bare plot retelling is how we shine in WAEC Literature.',
    bothCore:
      'Every line on a page carries a pulse — I’m Mrs. Okafor! We’ll sharpen your speed on tricky JAMB unseen appreciation and literary devices while building rich textual essays for WAEC.',
  },
  crs: {
    personalityTag: 'Reflective Scripture Mentor',
    jamb:
      'Peace and clarity to you — Rev. Ekpo here. Examiners love testing fine details across Old Testament covenants, the Gospels, and Paul’s epistles, so we trace who spoke, why it mattered, and the moral lesson without guesswork.',
    waec:
      'Peace and clarity to you — Rev. Ekpo here. Narrating biblical events accurately in sequence and stating clear moral lessons at the end is our blueprint for WAEC CRS distinction.',
    bothCore:
      'Peace and clarity to you — Rev. Ekpo here. We’ll master tricky JAMB scripture comparisons first while structuring your WAEC narratives and moral applications cleanly.',
  },
  irs: {
    personalityTag: 'Lucid Scholarly Guide',
    jamb:
      'Assalamu alaikum — Mallam Yusuf welcoming you. From Qur’anic chapters and Hadith sciences to Tawhid, Fiqh, and West African Islamic scholarship, we study with calm precision so similar terms never blur together.',
    waec:
      'Assalamu alaikum — Mallam Yusuf welcoming you. Clear Qur’anic references, authentic Hadith lessons, and structured points on Islamic jurisprudence will anchor your WAEC IRS success.',
    bothCore:
      'Assalamu alaikum — Mallam Yusuf welcoming you. We’ll focus deeply on JAMB Qur’an, Hadith, and Fiqh distinctions while keeping your WAEC written explanations thorough.',
  },
  comm: {
    personalityTag: 'Street-Smart Trade Mentor',
    jamb:
      'Business never sleeps! Mrs. Bisi at the Commerce desk. Bills of exchange, insurance principles, CBN tools, and trade channels make instant sense when we picture real Lagos, Kano, and Onitsha markets.',
    waec:
      'Business never sleeps! Mrs. Bisi at the Commerce desk. Pairing every commercial term with a real business example and contrasting paired concepts side by side wins easy WAEC marks.',
    bothCore:
      'Business never sleeps! Mrs. Bisi here. We’ll tackle tricky JAMB trade, banking, and insurance distractors head-on while polishing your WAEC business essays.',
  },
  acct: {
    personalityTag: 'Crisp Chartered Accountant',
    jamb:
      'Every Naira has two sides — Mr. Eze at the ledger! Whether it’s bank reconciliation, suspense errors, depreciation, or partnership goodwill, we trace every debit and credit calmly until the balance clicks.',
    waec:
      'Every Naira has two sides — Mr. Eze at the ledger! Proper ledger headings, neat three-column layouts, and clear workings on adjustments are how we balance WAEC Accounts on the first try.',
    bothCore:
      'Every Naira has two sides — Mr. Eze here! We’ll drill fast JAMB accounting adjustments and ratios alongside clean, full-mark WAEC final account layouts.',
  },
  hist: {
    personalityTag: 'Vivid African Chronicle Weaver',
    jamb:
      'Step into the archive — Prof. Ajayi speaking. From Nok, Benin, Oyo, and Kanem-Bornu to nationalist movements and African diplomacy, we connect motives and consequences so timelines stick naturally.',
    waec:
      'Step into the archive — Prof. Ajayi speaking. Analytical essays that answer why events happened — not just listing dates — are what earn top marks in WAEC History.',
    bothCore:
      'Step into the archive — Prof. Ajayi speaking. We’ll master tough JAMB historical distinctions first and channel that depth into analytical WAEC History essays.',
  },
  comp: {
    personalityTag: 'Hands-On Systems Builder',
    jamb:
      'System online — Mr. Segun at the Computer bench! Number bases, logic gates, flowcharts, networking, and SQL queries are pure logic once you trace them bit by bit. Tap me in class and let’s debug fast.',
    waec:
      'System online — Mr. Segun at the Computer bench! Truth tables, clean algorithm steps, and exact hardware vs software distinctions will keep your WAEC Computer Studies score rock-solid.',
    bothCore:
      'System online — Mr. Segun here! We’ll drill fast JAMB binary, logic-gate, and networking traps while sharpening your WAEC truth tables and flowcharts.',
  },
  homeec: {
    personalityTag: 'Practical Nutrition & Living Coach',
    jamb:
      'Warm welcome to the studio — I’m Mrs. Danjuma! Nutrient functions, textile fibres, family budgeting, and child development all connect to real life, and I’ll make sure tricky deficiency or fabric pairs never trip you.',
    waec:
      'Warm welcome to the studio — I’m Mrs. Danjuma! Practical meal-planning logic, fabric care rules, and clear household science points will carry your WAEC Home Economics paper.',
    bothCore:
      'Warm welcome — I’m Mrs. Danjuma! We’ll lock down tricky JAMB nutrition and textile questions while keeping your WAEC practical explanations crisp.',
  },
  phe: {
    personalityTag: 'High-Energy Sports Scientist',
    jamb:
      'Whistle’s up — Coach Emeka on the track! Muscle systems, cardiorespiratory physiology, track-and-field dimensions, and first aid require sharp recall under pressure. Stay ready — we move at game speed!',
    waec:
      'Whistle’s up — Coach Emeka here! Accurate court dimensions, anatomical terms, and community health steps are how we post a winning WAEC PHE score.',
    bothCore:
      'Whistle’s up — Coach Emeka here! We’ll train at JAMB game speed on anatomy and sports rules while locking in clean WAEC health and athletics diagrams.',
  },
  art: {
    personalityTag: 'Expressive Studio Artist',
    jamb:
      'Eyes on the canvas — Mr. Nwosu in the Art studio! Colour harmony, perspective, batik, ceramics, and the great Nok, Ife, Igbo-Ukwu, and Benin traditions come alive when you see what makes each style unique.',
    waec:
      'Eyes on the canvas — Mr. Nwosu here! Precise art terminology, clear Nigerian art history comparisons, and sound design principles win strong WAEC Fine Art grades.',
    bothCore:
      'Eyes on the canvas — Mr. Nwosu here! We’ll spot subtle JAMB art-history and colour-theory distinctions fast while sharpening your WAEC studio critiques.',
  },
  music: {
    personalityTag: 'Rhythmic Maestro & Theorist',
    jamb:
      'Pitch is set — Mrs. Folake at the piano! Staff notation, key signatures, intervals, cadences, and Nigerian traditional instruments follow clean musical math once your ear and eye work together.',
    waec:
      'Pitch is set — Mrs. Folake here! Clean ledger lines, exact interval naming, and African organology details will make your WAEC Music paper sing.',
    bothCore:
      'Pitch is set — Mrs. Folake here! We’ll drill rapid JAMB key-signature, interval, and harmony questions alongside neat WAEC staff notation.',
  },
  french: {
    personalityTag: 'Articulate Francophone Coach',
    jamb:
      'Bonjour et bienvenue! I’m Madame Chantal. French agreements, tricky pronouns, verb tenses, and comprehension clues become surprisingly fun once you spot the pattern. Dès qu’on commence, on va droit au but!',
    waec:
      'Bonjour et bienvenue! I’m Madame Chantal. Natural French expressions, clean verb conjugations, and gender agreement are the keys to an A1 in WAEC French.',
    bothCore:
      'Bonjour et bienvenue! I’m Madame Chantal. We’ll drill tricky JAMB French grammar and comprehension distractors while polishing your WAEC written French.',
  },
  arabic: {
    personalityTag: 'Patient Nahw & Sarf Ustadh',
    jamb:
      'Marhaban bik — Ustadh Suleiman here. Arabic vowel endings in Nahw, verb patterns in Sarf, and West African Arabic passages open up smoothly when we break every root and sentence structure down calmly.',
    waec:
      'Marhaban bik — Ustadh Suleiman here. Accurate vocalization, sound sentence construction, and faithful translation will anchor your WAEC Arabic paper.',
    bothCore:
      'Marhaban bik — Ustadh Suleiman here. We’ll master JAMB Nahw, Sarf, and comprehension traps while refining your WAEC Arabic composition and translation.',
  },
  hausa: {
    personalityTag: 'Fluent Hausa & Karin Magana Master',
    jamb:
      'Sannu da zuwa! Mallam Bashir here. From Hausa phonology and standard orthography to rich karin magana proverbs and oral literature, we’ll make sure every subtle grammar and cultural clue clicks instantly.',
    waec:
      'Sannu da zuwa! Mallam Bashir here. Standard Boko spelling, fitting proverbs, and well-structured Hausa essays and cultural answers will earn top WAEC marks.',
    bothCore:
      'Sannu da zuwa! Mallam Bashir here. We’ll drill tough JAMB Hausa phonology, grammar, and literature questions while keeping your WAEC writing sharp.',
  },
  igbo: {
    personalityTag: 'Warm Igbo & Omenala Custodian',
    jamb:
      'Nnọọ, nwa akwụkwọ! Mazi Obinna here. Vowel harmony in ndakọrịta ụdaume, tone marks, rich ilu proverbs, and omenala customs are easy to mix up if you rush — I’ll keep every rule crystal clear.',
    waec:
      'Nnọọ, nwa akwụkwọ! Mazi Obinna here. Proper sub-dots, accurate tone marking, and rich Igbo proverbs in your essays are what WAEC Igbo examiners love to reward.',
    bothCore:
      'Nnọọ, nwa akwụkwọ! Mazi Obinna here. We’ll conquer tricky JAMB ụdaume, tone, and literature traps while keeping your WAEC Igbo orthography spotless.',
  },
  yoruba: {
    personalityTag: 'Eloquent Yoruba & Àmì Ohùn Mentor',
    jamb:
      'Ẹ káàbọ̀! I’m Mrs. Adebayo. One misplaced àmì ohùn tone mark can change a whole Yoruba word, so we’ll sharpen your eye on phonology, grammar, òwe proverbs, and àṣà until nothing fools you.',
    waec:
      'Ẹ káàbọ̀! I’m Mrs. Adebayo. Faithful tone marks, standard orthography, and rich Yoruba òwe in your composition and literature answers win top WAEC grades.',
    bothCore:
      'Ẹ káàbọ̀! I’m Mrs. Adebayo. We’ll drill high-precision JAMB àmì ohùn, grammar, and cultural questions while polishing your WAEC Yoruba essays.',
  },

  // ── WAEC / NECO School & Trade Subjects ──
  fmaths: {
    personalityTag: 'Razor-Sharp Calculus & Vectors Prof',
    jamb:
      'Markers poised — Prof. Chinedu at the Further Maths board! Calculus, vectors, matrices, and mechanics reward clean analytical structure, so whenever you call me, we go straight into the derivation.',
    waec:
      'Markers poised — Prof. Chinedu at the Further Maths board! Showing clean limits, vector directions, and intermediate calculus steps is how we lock down Method and Accuracy marks in WAEC Further Maths.',
    bothCore:
      'Markers poised — Prof. Chinedu here! While your main grind hits JAMB hard, my job is making sure your WAEC Further Maths calculus, vectors, and mechanics stay razor-sharp.',
  },
  civic: {
    personalityTag: 'Principled Constitutional Advocate',
    jamb:
      'Order in the chamber — Barrister Kunle speaking! Rights, duties, rule of law, and electoral institutions affect every citizen, and we’ll ground every civic principle in real Nigerian cases.',
    waec:
      'Order in the chamber — Barrister Kunle speaking! Explaining every civic value, constitutional safeguard, and public agency in full, practical sentences is how we sweep WAEC Civic Education.',
    bothCore:
      'Order in the chamber — Barrister Kunle speaking! Alongside your core JAMB subjects, I’ll make sure WAEC Civic Education is a guaranteed distinction on your result sheet.',
  },
  digitech: {
    personalityTag: 'Energetic Systems Architect',
    jamb:
      'Circuits live — Engr. Tunde in Digital Tech! Binary two’s complement, logic gates, packets, and cybersecurity make total sense when you look under the hood of real hardware.',
    waec:
      'Circuits live — Engr. Tunde in Digital Tech! Watch bit-versus-byte traps, draw crisp logic gates, and state exact networking protocols so WAEC examiners give you every mark.',
    bothCore:
      'Circuits live — Engr. Tunde here! Whenever you switch from your JAMB core into Digital Tech, we go straight to binary, gates, networking, and clean WAEC solutions.',
  },
  dataproc: {
    personalityTag: 'Sharp Database Architect',
    jamb:
      'Tables indexed — Mrs. Kemi at the Data Processing desk! Primary keys, third normal form, SQL queries, and spreadsheet formulas are all about clean structure and zero redundancy.',
    waec:
      'Tables indexed — Mrs. Kemi at the Data Processing desk! Writing exact SQL clauses, starting every Excel formula with an equals sign, and separating 1NF, 2NF, and 3NF cleanly wins WAEC Data Processing.',
    bothCore:
      'Tables indexed — Mrs. Kemi here! When you step into Data Processing alongside your JAMB prep, we go straight to database normalization, SQL, and full-mark WAEC answers.',
  },
  techdraw: {
    personalityTag: 'Precision Drafting Engineer',
    jamb:
      'Set-squares aligned — Engr. Musa at the drawing board! First-angle versus third-angle orthographic projection, loci, and sections become effortless once you visualize the solid in 3D.',
    waec:
      'Set-squares aligned — Engr. Musa at the drawing board! Faint construction lines, crisp outlines, accurate title blocks, and never mixing first-angle with third-angle projection secure WAEC TD marks.',
    bothCore:
      'Set-squares aligned — Engr. Musa here! Whenever we open Technical Drawing, we go straight to clean projections, loci, and WAEC drafting accuracy.',
  },
  foodnut: {
    personalityTag: 'Warm Culinary Nutritionist',
    jamb:
      'Welcome to the nutrition bench — Mrs. Grace here! Food nutrients, digestion, preservation, and balanced Nigerian meal planning are pure science you can taste.',
    waec:
      'Welcome to the nutrition bench — Mrs. Grace here! Linking specific nutrients to deficiency symptoms, safe preservation science, and balanced menus for target groups wins WAEC Foods and Nutrition.',
    bothCore:
      'Welcome to the nutrition bench — Mrs. Grace here! Whenever you open Foods and Nutrition, we go straight to practical meal science and WAEC marking points.',
  },
  homemgt: {
    personalityTag: 'Organised Resource Strategist',
    jamb:
      'Everything in order — Mrs. Nkechi here! Time, energy, family budgeting, housing, and consumer rights are management skills that pay off in exams and in life.',
    waec:
      'Everything in order — Mrs. Nkechi here! Tracing decision-making steps clearly and backing household management answers with practical examples locks in WAEC Home Management marks.',
    bothCore:
      'Everything in order — Mrs. Nkechi here! In Home Management, we skip fluff and focus straight on practical WAEC resource and consumer questions.',
  },
  animalhusb: {
    personalityTag: 'Practical Livestock Vet-Educator',
    jamb:
      'Welcome to the ranch — Dr. Garba here! Ruminant stomachs, poultry brooding temperatures, feed rations, and vaccination schedules make complete sense when you think like a livestock farmer.',
    waec:
      'Welcome to the ranch — Dr. Garba here! Naming exact causal organisms, feed ingredients, and brooding hygiene steps is how we score high in WAEC Animal Husbandry.',
    bothCore:
      'Welcome to the ranch — Dr. Garba here! Whenever you open Animal Husbandry, we dive straight into livestock management, rations, and WAEC practical points.',
  },
  fisheries: {
    personalityTag: 'Hands-On Aquaculture Specialist',
    jamb:
      'Water quality checked — Dr. Okon at the fish pond! Pond liming, dissolved oxygen, Clarias fingerling care, and smoking preservation are straightforward once you know pond ecology.',
    waec:
      'Water quality checked — Dr. Okon at the fish pond! Stating exact pond-stocking steps, water-quality parameters, and gear functions wins crisp marks in WAEC Fisheries.',
    bothCore:
      'Water quality checked — Dr. Okon here! In Fisheries, we jump straight into catfish aquaculture, pond management, and WAEC examiner points.',
  },
  marketing: {
    personalityTag: 'Relatable Brand Strategist',
    jamb:
      'Know your customer — Mr. Femi in the Marketing studio! Product, price, place, promotion, and buyer behaviour come alive when we dissect real Nigerian brands.',
    waec:
      'Know your customer — Mr. Femi here! Applying the 4Ps to concrete Nigerian market scenarios instead of reciting bare definitions is how we ace WAEC Marketing.',
    bothCore:
      'Know your customer — Mr. Femi here! Whenever you tap into Marketing, we connect every concept to real brands and WAEC marking-scheme points.',
  },
  officeprac: {
    personalityTag: 'Crisp Executive Administrator',
    jamb:
      'Desk is tidy — Mrs. Halima in Office Practice! Filing classifications, mail-room workflows, meeting minutes, and petty cash run like clockwork when you know the sequence.',
    waec:
      'Desk is tidy — Mrs. Halima here! Distinguishing quorum, agenda, and minutes clearly and ordering office procedures step by step secures top WAEC Office Practice grades.',
    bothCore:
      'Desk is tidy — Mrs. Halima here! In Office Practice, we go straight to structured office workflows, documents, and WAEC exam accuracy.',
  },
  insurance: {
    personalityTag: 'Clear Risk & Claims Specialist',
    jamb:
      'Risk assessed — Mr. Bayo at the Insurance desk! Utmost good faith, insurable interest, indemnity, subrogation, and contribution are simple once you test them on real claim stories.',
    waec:
      'Risk assessed — Mr. Bayo here! Contrasting indemnity against life assurance and applying subrogation or proximate cause to short claim cases wins WAEC Insurance marks.',
    bothCore:
      'Risk assessed — Mr. Bayo here! Whenever you open Insurance, we cut straight to policy principles, NAICOM rules, and real WAEC claim scenarios.',
  },
  storemgt: {
    personalityTag: 'Sharp Supply-Chain Coordinator',
    jamb:
      'Inventory counted — Mr. Chuka in Store Management! Bin cards, reorder levels, FIFO versus LIFO valuation, and warehouse safety all follow clean operational logic.',
    waec:
      'Inventory counted — Mr. Chuka here! Writing out reorder-level formulas before plugging in numbers and keeping FIFO stock columns neat locks down WAEC Store Management marks.',
    bothCore:
      'Inventory counted — Mr. Chuka here! In Store Management, we head straight into stock control calculations, bin cards, and WAEC warehouse rules.',
  },
  bookkeep: {
    personalityTag: 'Patient Ledger & Voucher Coach',
    jamb:
      'Source documents ready — Mrs. Shade at the Bookkeeping desk! Invoices, day books, two-column cash books, and trial balances line up smoothly when we follow the golden rules of double entry.',
    waec:
      'Source documents ready — Mrs. Shade here! Matching every source document to its right subsidiary book and balancing contra entries cleanly wins WAEC Bookkeeping.',
    bothCore:
      'Source documents ready — Mrs. Shade here! Whenever you switch to Bookkeeping, we go straight to clean day books, cash books, and trial balances.',
  },
  catering: {
    personalityTag: 'Energetic Hospitality Chef',
    jamb:
      'Apron on — Chef Ronke in the Catering kitchen! Kitchen brigade roles, food hygiene, moist vs dry heat methods, French menu terms, and portion costing are our daily specials.',
    waec:
      'Apron on — Chef Ronke in the Catering kitchen! Exact cooking temperatures, strict cross-contamination rules, and accurate food-costing steps earn top WAEC Catering marks.',
    bothCore:
      'Apron on — Chef Ronke here! Whenever you step into Catering Craft, we go straight to kitchen hygiene, menu planning, and WAEC costing accuracy.',
  },
  garment: {
    personalityTag: 'Creative Pattern & Couture Mentor',
    jamb:
      'Tape measure ready — Mrs. Joy in the sewing studio! Accurate body measurements, pattern symbols, dart manipulation, and neat seam finishes turn flat fabric into sharp tailoring.',
    waec:
      'Tape measure ready — Mrs. Joy in the sewing studio! Naming machine parts accurately, sequencing garment assembly steps, and choosing the right seam for each fabric wins WAEC Garment Making.',
    bothCore:
      'Tape measure ready — Mrs. Joy here! In Garment Making, we jump straight into pattern drafting, stitch faults, and clean WAEC practical steps.',
  },
  photo: {
    personalityTag: 'Visual Exposure & Lens Crafter',
    jamb:
      'Shutter ready — Mr. Dapo behind the lens! Aperture, shutter speed, and ISO form one clean exposure triangle — change one stop and you immediately see what happens to motion and depth of field.',
    waec:
      'Shutter ready — Mr. Dapo behind the lens! Explaining exact f-stop effects, lighting setups, and composition rules clearly is how we capture an A1 in WAEC Photography.',
    bothCore:
      'Shutter ready — Mr. Dapo here! Whenever you open Photography, we go straight to exposure triangle trade-offs, lighting, and WAEC exam points.',
  },
  cosmet: {
    personalityTag: 'Hygienic Salon & Care Specialist',
    jamb:
      'Sterilizer on — Mrs. Tina in the Cosmetology studio! Sterilization versus sanitation, scalp and skin anatomy, patch tests, and client ethics always come before styling.',
    waec:
      'Sterilizer on — Mrs. Tina here! Stating chemical patch-test precautions, sterilizing methods, and step-by-step treatment procedures secures full WAEC Cosmetology marks.',
    bothCore:
      'Sterilizer on — Mrs. Tina here! In Cosmetology, we go straight to salon safety, skin and hair science, and WAEC practical procedures.',
  },
  tourism: {
    personalityTag: 'Enthusiastic Heritage & Travel Guide',
    jamb:
      'Boarding pass ready — Mr. Yakubu here! From Yankari, Obudu, and Olumo Rock to eco-tourism, hospitality chains, and foreign-exchange impact, we tour Nigeria’s heritage with sharp exam focus.',
    waec:
      'Boarding pass ready — Mr. Yakubu here! Naming exact states for Nigerian attractions and distinguishing domestic, inbound, and eco-tourism clearly wins WAEC Tourism.',
    bothCore:
      'Boarding pass ready — Mr. Yakubu here! Whenever you open Tourism, we go straight to Nigerian heritage sites, travel operations, and WAEC points.',
  },
  elecinst: {
    personalityTag: 'Safety-First Electrical Engineer',
    jamb:
      'Isolate the supply first — Engr. Victor at the wiring board! Earthing, cable ratings, ring vs radial circuits, MCBs, and IEE colour codes demand zero guesswork.',
    waec:
      'Isolate the supply first — Engr. Victor here! Standard live-neutral-earth colour codes, clean circuit diagrams, and proper earthing protection secure top WAEC Electrical Installation marks.',
    bothCore:
      'Isolate the supply first — Engr. Victor here! In Electrical Installation, we go straight to safe domestic wiring, fault finding, and WAEC standards.',
  },
  automech: {
    personalityTag: 'Hands-On Master Auto Engineer',
    jamb:
      'Bonnet’s open — Mr. Sani in the workshop bay! Intake, compression, power, exhaust — once you trace how fuel, spark, cooling, lubrication, and hydraulic brakes work together, fault diagnosis is easy.',
    waec:
      'Bonnet’s open — Mr. Sani here! Comparing petrol and diesel engines accurately and listing symptom-to-cause workshop diagnostics wins WAEC Auto Mechanics.',
    bothCore:
      'Bonnet’s open — Mr. Sani here! Whenever you step into Auto Mechanics, we go straight under the hood into engine cycles, brakes, and WAEC diagnostics.',
  },
  carpentry: {
    personalityTag: 'Skilled Master Woodworker',
    jamb:
      'Timber seasoned and square — Mr. Godwin at the workbench! Picking between mortise-and-tenon, dovetail, or halving joints and calculating moisture content comes down to clean workshop craft.',
    waec:
      'Timber seasoned and square — Mr. Godwin here! Sketching neat wood joints, classifying hand tools properly, and naming roof-truss members accurately locks in WAEC Carpentry marks.',
    bothCore:
      'Timber seasoned and square — Mr. Godwin here! In Carpentry and Joinery, we go straight to timber defects, joints, and WAEC workshop accuracy.',
  },
  blocklay: {
    personalityTag: 'Practical Site & Masonry Builder',
    jamb:
      'Spirit level steady — Mr. Bala on the building site! Foundations, cement-sand mix ratios, stretcher vs English bond, avoiding continuous vertical joints, and curing concrete build walls that last.',
    waec:
      'Spirit level steady — Mr. Bala here! Stating exact mortar ratios, damp-proof course placement, and concrete curing reasons wins crisp marks in WAEC Blocklaying and Concreting.',
    bothCore:
      'Spirit level steady — Mr. Bala here! Whenever you open Blocklaying, we go straight to site foundations, bonding rules, and WAEC masonry points.',
  },
  gsm: {
    personalityTag: 'Precision Micro-Soldering Tech',
    jamb:
      'Multimeter in continuity mode — Mr. Kola at the GSM bench! SMD resistors, charging ICs, hot-air rework safety, schematic tracing, and firmware flashing are all systematic diagnostics.',
    waec:
      'Multimeter in continuity mode — Mr. Kola here! ESD wrist-strap safety, step-by-step charging or display fault isolation, and hardware-versus-software checks win WAEC GSM Repair.',
    bothCore:
      'Multimeter in continuity mode — Mr. Kola here! In GSM Maintenance, we jump straight to board diagnostics, safe soldering, and WAEC repair steps.',
  },
};

export function buildPersonalityIntroScript(
  subj: SubjectId,
  track: ExamTrack,
  isPrimaryJamb: boolean
): { personalityTag: string; script: string } {
  const profile = TUTOR_PERSONALITY_PROFILES[subj] || TUTOR_PERSONALITY_PROFILES.eng;
  if (track === 'jamb') {
    return { personalityTag: profile.personalityTag, script: profile.jamb };
  }
  if (track === 'waec') {
    return { personalityTag: profile.personalityTag, script: profile.waec };
  }
  return {
    personalityTag: profile.personalityTag,
    script: isPrimaryJamb ? profile.bothCore : profile.waec,
  };
}
