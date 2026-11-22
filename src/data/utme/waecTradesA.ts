import { buildUtmeSubjectCurriculum, compactUtmeTopic, type CompactTopicInput } from './builder';
import { CATERING_EXTRA_SPECS, GARMENT_EXTRA_SPECS, PHOTO_EXTRA_SPECS } from './extraWaecTradesA1';
import { COSMET_EXTRA_SPECS, TOURISM_EXTRA_SPECS } from './extraWaecTradesA2';

const CATERING_SPECS: CompactTopicInput[] = [
  {
    id: 'cat-hygiene-kitchen-safety',
    name: 'Catering establishments, kitchen hygiene and food safety',
    sec: 'Kitchen operations',
    goals: [
      'Apply personal, kitchen and food hygiene rules to prevent food poisoning',
      'Classify catering equipment and follow colour-coded chopping board standards',
    ],
    trap: 'Do not use the same knife and chopping board for raw chicken and ready-to-eat salad without thorough washing and sanitising — that causes cross-contamination.',
    p1: {
      title: 'Food hygiene and preventing contamination',
      idea: 'Catering Craft Practice serves safe, attractive meals in hotels, restaurants, hospitals and events. Bacteria multiply rapidly in the temperature danger zone (5°C to 63°C). Safe kitchens separate raw and cooked foods, chill leftovers fast, cook poultry through to steaming hot, and enforce clean uniforms, trimmed nails and hair nets.',
      terms: [
        ['Cross-contamination', 'Transfer of harmful bacteria from raw food, dirty hands or utensils onto ready-to-eat food'],
        ['Danger zone', 'Temperature range (5°C to 63°C) where food-poisoning bacteria multiply fastest'],
        ['Mise en place', 'French kitchen term meaning having all ingredients washed, cut and measured before cooking starts'],
      ],
      rules: [
        'Keep cold food below 5°C and hot held food above 63°C.',
        'Cover minor cuts on hands with a bright waterproof plaster and disposable food glove.',
      ],
      headers: ['Chopping board colour', 'Standard kitchen use'],
      rows: [
        ['Red', 'Raw meat'],
        ['Yellow', 'Cooked meat'],
        ['Green', 'Salads and fresh fruits'],
        ['Blue', 'Raw fish and seafood'],
      ],
      exQ: 'A chef chops raw beef on a board, wipes it with a damp cloth, then slices tomatoes for coleslaw. Name the hazard created.',
      exSteps: [
        ['Trace bacterial path', 'Raw meat juices pass directly onto raw ready-to-eat tomatoes'],
        ['Name hazard', 'Cross-contamination'],
      ],
      checkQ: 'Between which temperatures do most food-poisoning bacteria multiply rapidly (the danger zone)?',
      checkO: ['5°C to 63°C', '−18°C to 0°C', '80°C to 100°C', '120°C to 180°C'],
      checkH: ['Fridges stay cold below 5°C; hot holding stays above 63°C.', 'Room temperature sits right inside this range.'],
      checkE: 'Bacteria multiply rapidly between 5°C and 63°C.',
    },
    p2: {
      title: 'Kitchen equipment, fuel safety and fire response',
      idea: 'Commercial kitchens group tools into large fixed equipment (ranges, ovens, walk-in chillers), mechanical equipment (mixers, slicers) and small utensils (whisk, colander, palette knife). Never pour water on a burning deep-fat fryer — water turns to steam explosively and spreads blazing oil. Smother fat fires with a fire blanket or foam/wet-chemical extinguisher.',
      terms: [
        ['Fire blanket', 'Woven fire-resistant sheet placed gently over a pan fire to cut off oxygen'],
        ['Colander', 'Perforated bowl used for draining boiled pasta, rice or washed vegetables'],
        ['Bain-marie', 'Hot water bath holding delicate sauces or cooked dishes warm without scorching'],
      ],
      rules: [
        'Never throw water onto an oil or electrical fire; turn off heat safely and smother with a fire blanket.',
        'Always unplug electric mixers and slicers before disassembling blades for cleaning.',
      ],
      headers: ['Kitchen fire type', 'Correct action'],
      rows: [
        ['Hot cooking oil fire', 'Turn off heat if safe; cover with fire blanket (never water)'],
        ['Electrical equipment fire', 'Switch off power; use CO₂ extinguisher'],
      ],
      exQ: 'Oil in a frying pan catches fire during breakfast service. State two safe steps the cook must take.',
      exSteps: [
        ['Step 1', 'Turn off the gas/electric burner safely without lifting the blazing pan'],
        ['Step 2', 'Cover the pan gently with a fire blanket or metal lid to starve oxygen'],
      ],
      checkQ: 'Why must water NEVER be poured onto burning cooking oil in a kitchen?',
      checkO: ['Water sinks, flashes instantly into steam and sprays flaming oil everywhere', 'Water freezes the oil solid', 'Water makes the flame invisible', 'Water turns oil into vinegar'],
      checkH: ['Water is denser than oil and boils at 100°C while hot oil exceeds 200°C.', 'Sudden steam expansion blasts burning droplets upward.'],
      checkE: 'Water flashes into steam beneath hot oil and violently spreads the burning fat.',
    },
    qs: [
      ['What does the French culinary term "mise en place" mean?', 'Preparing and arranging all ingredients and tools before cooking begins', 'Serving dessert before soup', 'Freezing meat for six months', 'Washing dishes after closing'],
      ['Under standard colour-coding, a green chopping board is reserved for', 'salads and fresh fruits', 'raw beef', 'raw fish', 'cooked chicken'],
      ['Which piece of equipment keeps sauces warm gently using a hot water bath without burning?', 'Bain-marie', 'Meat cleaver', 'Rolling pin', 'Sieve'],
      ['Commercial catering outlets that aim to make profit (such as hotels and fast-food restaurants) belong to the', 'commercial sector', 'welfare sector', 'subsistence sector', 'charity sector'],
      ['A caterer should wash hands immediately after', 'handling raw eggs or visiting the toilet', 'putting on a clean apron only', 'reading a menu', 'locking the cash register at closing'],
      ['Which small utensil is ideal for lifting fried puff-puff or akara cleanly out of hot oil?', 'Slotted spoon (perforated ladle)', 'Wooden rolling pin', 'Pastry brush', 'Butter knife'],
    ].map(([q, a, b, c, d, e]) => [q, a, b, c, d, e || `${a} is standard catering practice.`] as [string, string, string, string, string, string]),
  },
  {
    id: 'cat-cooking-menus-service',
    name: 'Cooking methods, menu planning and food & beverage service',
    sec: 'Food production & service',
    goals: [
      'Select moist-heat, dry-heat and fat-based cooking methods for different foods',
      'Compare table d’hôte and à la carte menus and set formal dining covers cleanly',
    ],
    trap: 'Do not confuse table d’hôte (fixed set menu at one inclusive price) with à la carte (each dish chosen and priced separately).',
    p1: {
      title: 'Moist, dry and fat cooking methods',
      idea: 'Heat transforms food flavour, safety and digestibility. Moist methods (boiling, steaming, stewing, poaching) tenderise tough beef cuts and preserve moisture. Dry methods (baking, roasting, grilling) brown crusts via Maillard reactions for rich flavour. Fat methods (shallow frying, deep frying, sautéing) cook rapidly with crisp textures.',
      terms: [
        ['Steaming', 'Cooking food over rising steam; retains water-soluble vitamins and keeps fish tender'],
        ['Stewing', 'Slow simmering of tough meat cuts in a small amount of seasoned liquid in a covered pot'],
        ['Grilling', 'Fast cooking by direct radiant heat from above or below, reducing excess fat'],
      ],
      rules: [
        'Use slow moist heat (stewing/braising) for tough, collagen-rich cuts like beef shin or oxtail.',
        'Steaming preserves far more vitamin C and B vitamins than prolonged boiling in lots of water.',
      ],
      headers: ['Method group', 'Examples & ideal food'],
      rows: [
        ['Moist heat', 'Steaming (moi-moi, fish), stewing (tough beef), poaching (eggs)'],
        ['Dry heat', 'Baking (cakes, bread), grilling (suya, chicken), roasting (yam)'],
        ['Fat heat', 'Deep frying (akara, plantain chips), sautéing (onions, peppers)'],
      ],
      exQ: 'A caterer buys economical, tough beef brisket for a banquet. Which cooking method ensures tender, flavourful meat?',
      exSteps: [
        ['Identify tissue type', 'Tough cuts contain abundant connective tissue (collagen)'],
        ['Choose method', 'Slow moist stewing or braising breaks collagen into tender gelatine'],
      ],
      checkQ: 'Which cooking method best preserves water-soluble vitamins when cooking tender vegetables or fish?',
      checkO: ['Steaming', 'Prolonged boiling in excess water', 'Charring on an open flame', 'Re-frying twice'],
      checkH: ['Food never sits immersed in water that gets poured down the sink.', 'Think of cooking moi-moi over simmering water.'],
      checkE: 'Steaming cooks gently without leaching water-soluble vitamins into discarded cooking water.',
    },
    p2: {
      title: 'Menu types, table laying and service styles',
      idea: 'A menu is the caterer’s sales list. Table d’hôte offers a set sequence of courses at one fixed price (great for weddings and canteens); à la carte lists dishes individually priced and cooked to order. When laying a formal cover, forks sit on the left, knives (blades facing inward) and soup spoons sit on the right, and guests eat from the outermost cutlery inward.',
      terms: [
        ['Table d’hôte', 'Fixed-price menu offering a limited set of courses (e.g. starter, main, dessert)'],
        ['À la carte', 'Menu where every dish is priced separately and cooked to order'],
        ['Cover', 'Individual table space and tableware (cutlery, glass, napkin, side plate) laid for one diner'],
      ],
      rules: [
        'Lay cutlery in sequence from outside in, with knife blades always turned inward toward the plate.',
        'Serve plated food and clear finished plates smoothly from the right (or serve platters from the left in silver service).',
      ],
      headers: ['Menu / service term', 'Meaning'],
      rows: [
        ['Table d’hôte', 'Set courses, single fixed total price'],
        ['À la carte', 'Individual items priced separately'],
        ['Buffet service', 'Guests serve themselves from an arranged display table'],
      ],
      exQ: 'A restaurant prints: Jollof Rice ₦2,500, Grilled Tilapia ₦4,000, Fresh Juice ₦1,200 — guests pick any mix. Name this menu type.',
      exSteps: [
        ['Observe pricing', 'Each item has its own separate price and choice'],
        ['Classify menu', 'À la carte menu'],
      ],
      checkQ: 'When setting a formal dining table, which direction should the cutting edge of the dinner knife face?',
      checkO: ['Inward toward the dinner plate', 'Outward toward the next guest', 'Pointing straight up', 'Underneath the side plate'],
      checkH: ['Safety and etiquette keep the blade tucked away from neighbours.', 'The knife sits on the right side of the plate.'],
      checkE: 'Dinner knives are placed on the right with their blades facing inward toward the plate.',
    },
    qs: [
      ['A fixed three-course wedding menu charged at one flat price per guest is called', 'table d’hôte', 'à la carte', 'blind bidding', 'self-service only', 'Table d’hôte provides set courses for one inclusive price.'],
      ['Cooking Nigerian moi-moi wrapped in leaves over simmering water uses', 'steaming', 'roasting', 'grilling', 'sautéing', 'Moi-moi cooks gently in rising vapour (steaming).'],
      ['The individual place setting of cutlery, napkin and glassware laid for one diner is called a', 'cover', 'larder', 'pantry', 'stockpot', 'One diner’s complete table layout is a cover.'],
      ['Which side of the main plate are table forks placed on a standard formal cover?', 'Left side', 'Right side', 'Behind the water glass', 'Inside the soup bowl', 'Forks sit on the left; knives and spoons sit on the right.'],
      ['Cooking food quickly in a small amount of hot oil while tossing or stirring frequently is', 'sautéing (stir-frying)', 'poaching', 'stewing', 'blanching', 'Sautéing uses minimal hot fat and rapid stirring.'],
      ['In which food service style do guests walk along a counter and serve themselves from arranged chafing dishes?', 'Buffet service', 'Silver service', 'Room service', 'Gueridon service', 'Buffet service displays dishes for self-selection.'],
    ],
  },
];

const GARMENT_SPECS: CompactTopicInput[] = [
  {
    id: 'gm-measurements-patterns-sewing',
    name: 'Body measurements, pattern drafting and sewing machine care',
    sec: 'Pattern & machine craft',
    goals: [
      'Take accurate body measurements with ease allowance for fitted garments',
      'Identify sewing machine parts, grainlines and pattern markings cleanly',
    ],
    trap: 'Do not cut fabric without checking the straight grainline arrow — cutting off-grain makes dresses twist awkwardly after washing.',
    p1: {
      title: 'Body measurements and pattern symbols',
      idea: 'Well-fitting garments start with exact body measurements taken over light clothing with a flexible tape measure held snug but never tight: bust/chest, waist, hip, shoulder width and garment length. Commercial and drafted patterns include markings — straight grain arrow, place-on-fold bracket, darts, notches and seam allowance lines — to guide accurate cutting and assembly.',
      terms: [
        ['Ease allowance', 'Extra centimetres added beyond tight body measurements so the wearer can breathe and move comfortably'],
        ['Grainline', 'Direction of warp threads running parallel to the fabric selvedge; governs drape'],
        ['Dart', 'Tapered stitched fold that shapes flat cloth around curved areas like bust or waist'],
      ],
      rules: [
        'Always align the pattern’s straight-grain arrow parallel to the fabric selvedge before pinning.',
        'Notches along seam edges match corresponding pieces together accurately during sewing.',
      ],
      headers: ['Pattern symbol', 'Meaning'],
      rows: [
        ['Long double-headed arrow', 'Place parallel to fabric straight grain (selvedge)'],
        ['Bracket pointing to edge', 'Place pattern edge directly on folded cloth'],
        ['Small triangles (notches)', 'Alignment marks to match front and back pieces'],
        ['Broken inner line', 'Stitching line inside the seam allowance'],
      ],
      exQ: 'A client’s natural waist measures 72 cm and the skirt pattern requires 2 cm wearing ease plus 3 cm total seam allowance at two side seams. What cut waist width is needed?',
      exSteps: [
        ['Add wearing ease', '72 cm + 2 cm = 74 cm finished waist'],
        ['Add seam allowances', '74 cm + 3 cm = 77 cm total cut width'],
      ],
      checkQ: 'Which tapered stitch fold removes excess flat fabric to curve a bodice neatly around the bust or waist?',
      checkO: ['Dart', 'Selvedge', 'Hem', 'Zipper gusset'],
      checkH: ['It is shaped like a long narrow V stitched from wide end to a point.', 'Tailors press it smoothly after sewing.'],
      checkE: 'A dart shapes flat woven fabric to fit three-dimensional body contours.',
    },
    p2: {
      title: 'Sewing machine parts, threading and troubleshooting',
      idea: 'Lockstitch sewing machines interlock an upper spool thread (passed through tension discs, take-up lever and needle eye) with a lower bobbin thread. Balanced tension puts the lock neatly inside the middle of the cloth. Regular brushing of lint around feed dogs and light sewing-machine oiling prevents skipped stitches and jams.',
      terms: [
        ['Feed dogs', 'Toothed metal bars under the presser foot that pull fabric steadily backward stitch by stitch'],
        ['Tension regulator', 'Dial controlling tightness of the upper thread so stitches lock evenly'],
        ['Bobbin', 'Small metal or plastic spool holding the lower thread inside the shuttle case'],
      ],
      rules: [
        'Always turn the balance wheel TOWARD you — turning backward snarls thread in the shuttle.',
        'Match needle size to fabric weight: fine needles (size 9–11) for silk/chiffon, heavy needles (16–18) for denim/ankara canvas.',
      ],
      headers: ['Stitch fault', 'Most likely cause'],
      rows: [
        ['Loops bunching underneath cloth', 'Upper thread not seated in tension discs or tension too loose'],
        ['Skipped stitches', 'Bent, blunt or wrongly inserted needle'],
        ['Puckered seams on thin cloth', 'Thread tension too tight or stitch length too short'],
      ],
      exQ: 'A student notices messy loops of upper thread underneath her ankara skirt seam. What should she check first?',
      exSteps: [
        ['Diagnose bottom loops', 'Almost always caused by upper threading missing the tension discs or take-up lever'],
        ['Fix', 'Raise presser foot, re-thread top thread completely and test on scrap fabric'],
      ],
      checkQ: 'Which sewing machine part moves the fabric smoothly forward beneath the needle with each stitch?',
      checkO: ['Feed dogs', 'Spool pin', 'Bobbin winder', 'Thread cutter'],
      checkH: ['They are small serrated metal teeth peeking through the throat plate.', 'The presser foot holds fabric down onto them.'],
      checkE: 'Feed dogs grip and advance the fabric evenly beneath the presser foot.',
    },
    qs: [
      ['The firmly finished, non-fraying lengthwise edge of woven fabric is called the', 'selvedge', 'bias', 'dart', 'facing', 'Selvedges run parallel to the lengthwise warp yarns.'],
      ['Extra room added to body measurements so a wearer can sit and raise their arms freely is', 'wearing ease', 'shrinkage', 'selvedge waste', 'basting', 'Ease allowance guarantees comfort and mobility.'],
      ['Which shears have a bent lower handle so fabric lies flat on the table while cutting?', 'Dressmaker’s cutting shears', 'Nail clippers', 'Embroidery snips', 'Wire cutters', 'Bent-handled dressmaker’s shears cut accurately along flat fabric.'],
      ['When threading a sewing machine, raising the presser foot opens the', 'upper tension discs', 'bobbin case latch', 'foot pedal', 'needle eye', 'Lifting the presser foot releases the tension discs so thread seats properly.'],
      ['A bent or blunt sewing machine needle most commonly causes', 'skipped stitches and snagged fabric', 'perfect buttonholes', 'automatic hemming', 'shorter sleeves', 'Damaged needles fail to form clean loops with the bobbin hook.'],
      ['Cutting a strip of cloth at a 45° diagonal angle to the selvedge gives a stretchy', 'true bias strip', 'warp selvedge', 'straight yoke', 'box pleat', 'True bias (45°) stretches smoothly around curved necklines and armholes.'],
    ],
  },
  {
    id: 'gm-seams-finishes-garment-construction',
    name: 'Seams, edge finishes, fasteners and garment assembly',
    sec: 'Construction & finishing',
    goals: [
      'Choose plain, French and flat-felled seams suitable for sheer, medium or heavy fabrics',
      'Press seams properly and attach zips, buttons, facings and hems cleanly',
    ],
    trap: 'Do not confuse pressing (lifting and setting a hot iron down firmly on each seam) with ironing (sliding back and forth, which stretches bias edges out of shape).',
    p1: {
      title: 'Choosing seams and neatening raw edges',
      idea: 'Every fabric demands a matching seam. A plain open seam neatened with overlocking or zigzag suits ankara and medium cotton; a French seam completely encloses raw edges inside a second stitch line, making it ideal for sheer chiffon or silk; a flat-felled seam is ultra-strong and double-stitched, used on jeans and school uniforms.',
      terms: [
        ['French seam', 'Self-enclosed seam stitched first wrong-sides together then right-sides together; ideal for sheer fabrics'],
        ['Flat-felled seam', 'Strong, flat, double-stitched enclosed seam used on denim trousers and workwear'],
        ['Facing', 'Shaped fabric piece stitched to raw necklines or armholes and turned inside for a crisp finish'],
      ],
      rules: [
        'Clip inward curves (like necklines) and notch outward curves before turning facings so they lie flat without pulling.',
        'Press every single seam as soon as you sew it — never wait until the entire dress is finished.',
      ],
      headers: ['Seam type', 'Best fabric / garment'],
      rows: [
        ['Plain seam (overlocked)', 'Medium cotton, ankara dresses and skirts'],
        ['French seam', 'Sheer organza, chiffon, baby clothes'],
        ['Flat-felled seam', 'Jeans, men’s shirts, heavy workwear'],
      ],
      exQ: 'A tailor is sewing a delicate translucent chiffon blouse where raw overlock threads would show through. Which seam should they use?',
      exSteps: [
        ['Identify fabric challenge', 'Sheer cloth exposes messy raw seam allowances'],
        ['Select seam', 'French seam encloses all raw edges cleanly inside'],
      ],
      checkQ: 'Which self-enclosed seam is best for sheer fabrics like chiffon so no frayed edges show inside?',
      checkO: ['French seam', 'Unfinished plain seam', 'Lapped raw seam', 'Basting tack'],
      checkH: ['It is sewn twice — first wrong sides together, trimmed, then right sides together.', 'Named after a European fashion capital.'],
      checkE: 'A French seam hides raw edges cleanly inside, making it ideal for sheer fabrics.',
    },
    p2: {
      title: 'Fasteners, pressing and quality finishing',
      idea: 'Fasteners (invisible zips, centred zips, buttons and buttonholes, hooks-and-eyes, press studs) allow fitted garments to slip on smoothly. Final quality checks inspect symmetrical collars, secure hem stitches, trimmed loose threads, crisp pressing with a damp cloth on synthetics, and accurate care labels.',
      terms: [
        ['Interfacing', 'Supporting fabric fused or sewn inside collars, cuffs and waistbands to add crisp stiffness'],
        ['Shank', 'Thread stem or built-in loop beneath a button creating space for thick fabric layers'],
        ['Pressing', 'Lifting and lowering a warm iron onto seams with steam without sliding and stretching the cloth'],
      ],
      rules: [
        'Cut a horizontal buttonhole slightly wider than the button diameter plus button thickness.',
        'Always attach interfacing to collars, cuffs and waistbands before assembling them.',
      ],
      headers: ['Garment detail', 'Key finishing rule'],
      rows: [
        ['Waistband & collar', 'Reinforce with fusible or sew-in interfacing'],
        ['Curved neckline', 'Clip seam allowance before turning facing inward'],
        ['Pressing wool/silk', 'Use a pressing cloth to prevent shine or scorch marks'],
      ],
      exQ: 'Why does a shirt collar stay crisp and upright instead of collapsing limply after washing?',
      exSteps: [
        ['Identify hidden inner layer', 'Interfacing fused or stitched between collar layers'],
        ['Explain function', 'Adds body, shape retention and firmness'],
      ],
      checkQ: 'Why do tailors clip small snips into the seam allowance of a curved neckline before turning the facing inside?',
      checkO: ['So the curved edge spreads smoothly and lies flat without puckering', 'To make the neckline tear wider', 'To waste thread', 'To shorten the sleeves'],
      checkH: ['An inward curve has less perimeter on the inside than the outside.', 'Small snips stop before the stitch line to relieve tightness.'],
      checkE: 'Clipping inward curves relieves tension so the facing turns smoothly and lies flat.',
    },
    qs: [
      ['Which tough, double-stitched seam is typically seen down the outer leg of denim jeans?', 'Flat-felled seam', 'French seam', 'Tacking seam', 'Blind hem'],
      ['The hidden stiffener fused inside collars, cuffs and waistbands to hold crisp shape is', 'interfacing', 'basting thread', 'bias binding', 'elastic cord'],
      ['Long temporary hand stitches used to hold two fabric layers together before machine sewing are called', 'basting (tacking) stitches', 'buttonhole stitches', 'overlocking', 'smocking'],
      ['What is the correct difference between pressing and ironing during dressmaking?', 'Pressing lifts and sets the iron down gently; ironing slides back and forth', 'Pressing uses no heat at all', 'Ironing is done only on paper patterns', 'Pressing melts synthetic fabrics on purpose'],
      ['Why is a small thread shank formed when sewing a flat button onto a thick jacket?', 'To leave room for the buttonhole fabric to sit comfortably without pulling', 'To make the button fall off faster', 'To hide torn pockets', 'To replace the zip'],
      ['Which seam finish uses an industrial multi-thread machine that trims and wraps raw edges in one pass?', 'Overlocking (serging)', 'Hand hemming', 'Pin basting', 'French knotting'],
    ].map(([q, a, b, c, d, e]) => [q, a, b, c, d, e || `${a} is the correct garment construction technique.`] as [string, string, string, string, string, string]),
  },
];

const PHOTO_SPECS: CompactTopicInput[] = [
  {
    id: 'ph-camera-exposure-triangle',
    name: 'Camera parts, lenses and the exposure triangle',
    sec: 'Camera craft',
    goals: [
      'Control brightness, motion blur and depth of field using aperture, shutter speed and ISO',
      'Choose wide-angle, standard and telephoto lenses for portraits, sports and landscapes',
    ],
    trap: 'Do not confuse small f-numbers with small openings — f/1.8 is a WIDE aperture (lots of light, blurry background), while f/16 is a NARROW aperture (less light, everything sharp).',
    p1: {
      title: 'How a camera works and lens focal lengths',
      idea: 'Every camera is a light-tight box with a lens that focuses light onto a digital sensor (CMOS/CCD) or film. Focal length (in mm) controls angle of view: wide-angle lenses (18–35 mm) capture broad architecture and crowds; standard lenses (50 mm) mimic natural human perspective; telephoto lenses (85–300 mm) magnify distant wildlife or flatter portraits.',
      terms: [
        ['Focal length', 'Distance (in mm) from lens optical centre to sensor when focused at infinity; sets magnification'],
        ['Depth of field', 'Zone from nearest to farthest distance in a photo that appears acceptably sharp'],
        ['Viewfinder', 'Optical or electronic window used to compose and frame a photograph'],
      ],
      rules: [
        'Short focal length (e.g. 24 mm) = wide field of view; long focal length (e.g. 200 mm) = narrow magnified view.',
        'Always support heavy telephoto lenses with both hands or a tripod to prevent camera shake.',
      ],
      headers: ['Lens category', 'Typical focal length & use'],
      rows: [
        ['Wide-angle', '16–35 mm: landscapes, tight rooms, architecture'],
        ['Standard (normal)', '50 mm: street photography, everyday documentary'],
        ['Telephoto', '85–300 mm: portraits, sports, distant wildlife'],
      ],
      exQ: 'A sports photographer sits 40 metres from a football goal and needs tight action shots of the goalkeeper. Which lens type should they mount?',
      exSteps: [
        ['Assess subject distance', 'Far away, needs strong magnification'],
        ['Select lens', 'Telephoto lens (e.g. 200 mm or 300 mm)'],
      ],
      checkQ: 'Which lens type gives the broadest field of view for photographing a grand building inside a narrow street?',
      checkO: ['Wide-angle lens', 'Super-telephoto lens', 'Macro extension tube', 'Pin-hole cap'],
      checkH: ['Think of a short focal length like 18 mm or 24 mm.', 'It fits wide scenes into the frame.'],
      checkE: 'A wide-angle lens (short focal length) captures a broad scene even at close range.',
    },
    p2: {
      title: 'Aperture, shutter speed and ISO',
      idea: 'Proper exposure balances three controls called the exposure triangle. Aperture (f-stop) sets lens opening size and depth of field; Shutter Speed (seconds/fractions) sets exposure duration and freezes or blurs movement; ISO sets sensor sensitivity to light (high ISO brightens dim scenes but adds grainy digital noise).',
      terms: [
        ['Aperture (f-stop)', 'Adjustable diaphragm inside the lens; low f-number = wide opening and shallow depth of field'],
        ['Shutter speed', 'Length of time the shutter stays open; fast speeds like 1/1000 s freeze sprinting athletes'],
        ['ISO', 'Light sensitivity rating of the camera sensor; higher values help in low light but increase grain/noise'],
      ],
      rules: [
        'Use fast shutter speeds (1/500 s or faster) to freeze fast motion; slow shutter speeds (1/15 s) intentionally blur waterfalls or light trails.',
        'Keep ISO as low as practical (ISO 100–400) for the cleanest, noise-free images.',
      ],
      headers: ['Exposure control', 'Light effect', 'Creative side effect'],
      rows: [
        ['Wide aperture (f/2.0)', 'More light', 'Shallow depth of field (soft blurred background)'],
        ['Fast shutter (1/1000 s)', 'Less light', 'Freezes rapid action crisply'],
        ['High ISO (3200)', 'Brighter sensor gain', 'More visible digital grain (noise)'],
      ],
      exQ: 'A photographer shoots a wedding portrait and wants the bride sharply in focus with a softly blurred crowd behind her. Should they pick f/2.0 or f/16?',
      exSteps: [
        ['Check desired background', 'Softly blurred = shallow depth of field'],
        ['Choose f-stop', 'Wide aperture f/2.0 creates shallow depth of field'],
      ],
      checkQ: 'Which shutter speed will best freeze a sprinter crossing the finish line with zero motion blur?',
      checkO: ['1/1000 second', '1/10 second', '1 full second', '4 seconds'],
      checkH: ['Freezing fast action requires the shutter to open and close in a tiny fraction of a second.', 'Pick the shortest duration.'],
      checkE: 'A fast shutter speed of 1/1000 s freezes rapid human motion crisply.',
    },
    qs: [
      ['Which aperture lets in the MOST light through a camera lens?', 'f/1.8', 'f/8', 'f/11', 'f/22', 'Smaller f-numbers correspond to wider physical lens openings.'],
      ['Raising the camera ISO from 100 to 6400 in a dim hall brightens the photo but introduces', 'digital noise (grain)', 'wider focal length', 'smaller file dimensions', 'sharper tripod legs', 'High ISO amplifies sensor signals along with electronic noise.'],
      ['To keep both nearby flowers AND distant mountains sharp in a landscape photo, choose a', 'narrow aperture such as f/11 or f/16', 'wide aperture such as f/1.4', 'blur filter', 'digital zoom only', 'Narrow apertures produce deep depth of field across near and far planes.'],
      ['Which accessory holds a camera completely steady during long night exposures of 2 seconds?', 'Tripod', 'Lens hood', 'Memory card reader', 'Wrist strap', 'A tripod eliminates hand shake during slow shutter exposures.'],
      ['Which lens part blocks stray side sunlight from causing washed-out glare (lens flare)?', 'Lens hood', 'Hot shoe', 'Battery grip', 'Mode dial', 'A lens hood shades the front glass element from off-axis light.'],
      ['A photo that looks far too bright with washed-out white highlights is described as', 'overexposed', 'underexposed', 'underdeveloped', 'vignetted', 'Too much light reaching the sensor causes overexposure.'],
    ],
  },
  {
    id: 'ph-composition-lighting-editing',
    name: 'Composition, lighting, digital workflow and photo ethics',
    sec: 'Visual storytelling',
    goals: [
      'Apply the rule of thirds, leading lines and framing to build strong photographs',
      'Compare natural vs studio lighting, RAW vs JPEG files and copyright ethics',
    ],
    trap: 'Do not confuse RAW files (uncompressed sensor data giving huge editing room) with JPEG files (compressed, smaller, ready to share but losing detail if heavily edited).',
    p1: {
      title: 'Composition rules and studio lighting',
      idea: 'Great photography guides the viewer’s eye intentionally. The Rule of Thirds places key subjects along imaginary lines dividing the frame into nine equal rectangles rather than dead centre. Leading lines (roads, staircases) pull gaze inward. In studio portraits, three-point lighting uses a Key Light (main light), Fill Light (softens harsh shadows) and Rim/Back Light (separates hair and shoulders from the backdrop).',
      terms: [
        ['Rule of thirds', 'Placing focal points along the 1/3 intersections of a 3×3 grid for natural visual balance'],
        ['Golden hour', 'Warm, soft, low-angle sunlight shortly after sunrise or just before sunset'],
        ['Key light', 'Primary directional light source shaping shadows and highlights on a studio subject'],
      ],
      rules: [
        'Use diffusers (softboxes, umbrellas) or reflectors to turn harsh midday shadows into flattering soft light.',
        'Check the background behind your subject’s head before pressing the shutter to avoid distracting poles or clutter.',
      ],
      headers: ['Studio light', 'Role'],
      rows: [
        ['Key light', 'Main bright light defining form and direction'],
        ['Fill light / reflector', 'Gently lifts dark shadows on the opposite side'],
        ['Back / rim light', 'Separates subject cleanly from the background'],
      ],
      exQ: 'Why do outdoor portrait photographers prefer shooting at 5:30 pm rather than 12:30 pm?',
      exSteps: [
        ['Compare sun angle', 'Midday sun sits overhead, casting harsh dark eye-socket shadows'],
        ['Explain golden hour', 'Late afternoon sun is low, warm and soft across faces'],
      ],
      checkQ: 'In three-point portrait lighting, which light softens the dark shadows cast by the main key light?',
      checkO: ['Fill light', 'Lens flare', 'Red-eye beam', 'Background blackout'],
      checkH: ['It "fills in" the shadow side of the face.', 'A simple white reflector card can serve this same purpose.'],
      checkE: 'The fill light reduces contrast by gently illuminating the shadow side.',
    },
    p2: {
      title: 'Digital file formats, white balance and ethics',
      idea: 'Light sources have different colour temperatures (warm tungsten bulbs vs cool shade); setting White Balance ensures white shirts truly look white, not orange or blue. Photographers shoot RAW for maximum colour and highlight recovery during editing, then export JPEG or PNG copies for clients and web. Always seek consent for private portraits and respect copyright.',
      terms: [
        ['White balance', 'Camera adjustment removing unnatural colour casts so neutral whites look truly white'],
        ['RAW format', 'Uncompressed digital negative preserving full sensor data for non-destructive editing'],
        ['Copyright', 'Legal ownership right giving the photographer control over copying and commercial use of their image'],
      ],
      rules: [
        'Back up client shoots on at least two separate drives immediately after leaving an event.',
        'Never alter news/photojournalism pictures to invent people or events that did not occur.',
      ],
      headers: ['File format', 'Strengths'],
      rows: [
        ['RAW', 'Highest quality and editing latitude; large file size'],
        ['JPEG', 'Compact, universal, ready to share or print immediately'],
      ],
      exQ: 'A photographer shoots indoor ceremony pictures under yellow bulbs and every white dress looks orange. Which camera setting fixes this?',
      exSteps: [
        ['Identify fault', 'Wrong colour temperature cast'],
        ['Fix setting', 'Set White Balance to Tungsten/Incandescent (or adjust Kelvin colour temp)'],
      ],
      checkQ: 'Why do commercial photographers prefer shooting in RAW format instead of JPEG before editing?',
      checkO: ['RAW keeps uncompressed sensor data, allowing clean recovery of shadows, highlights and colour', 'RAW files are always 10 times smaller than JPEG', 'RAW photos automatically print themselves', 'JPEG cannot display colour'],
      checkH: ['Think of RAW as a digital film negative.', 'JPEG throws away fine tone data during compression.'],
      checkE: 'RAW retains full uncompressed sensor detail for high-quality editing.',
    },
    qs: [
      ['Dividing a viewfinder into nine equal boxes and placing a subject’s eyes on an intersection applies the', 'rule of thirds', 'inverse square law', 'depth limit', 'macro ratio', 'The rule of thirds creates dynamic, balanced compositions.'],
      ['Which natural lighting period shortly after sunrise or before sunset produces warm, flattering portraits?', 'Golden hour', 'High noon', 'Midnight zenith', 'Fluorescent hour', 'Low-angle sun during golden hour yields warm, gentle shadows.'],
      ['A white foam board or folding metallic disc used to bounce sunlight onto the shadow side of a face is a', 'reflector', 'shutter blade', 'memory card', 'viewfinder', 'Reflectors redirect existing light to soften harsh facial shadows.'],
      ['Fixing a bluish colour tint in photos taken in open shade requires adjusting', 'white balance', 'shutter count', 'tripod height', 'lens diameter', 'White balance calibrates colour temperature to match the light source.'],
      ['Using a road, fence or staircase that draws the viewer’s gaze straight toward the main subject uses', 'leading lines', 'overexposure', 'lens distortion', 'red-eye reduction', 'Leading lines guide visual attention into the centre of interest.'],
      ['In photojournalism ethics, digitally adding extra protesters into a news photo is unacceptable because it', 'falsifies visual truth and misleads the public', 'makes the image too sharp', 'uses too little storage', 'improves camera focus', 'Documentary journalism forbids fabricating scenes.'],
    ],
  },
];

const COSMET_SPECS: CompactTopicInput[] = [
  {
    id: 'cos-hygiene-hair-scalp',
    name: 'Salon hygiene, hair & scalp structure and braiding craft',
    sec: 'Hair & scalp care',
    goals: [
      'Distinguish sanitation, disinfection and sterilisation of salon combs and clippers',
      'Explain hair shaft layers and safe braiding, relaxing and scalp-care routines',
    ],
    trap: 'Do not confuse disinfection (destroying most harmful microbes on combs/clippers with chemical solutions) with sterilisation (destroying ALL microbes including bacterial spores in an autoclave).',
    p1: {
      title: 'Salon infection control and professional ethics',
      idea: 'A busy salon serves dozens of clients weekly, so uncleaned clippers, combs or towels can spread ringworm (tinea capitis), lice or blood-borne infections. Infection control follows three rising levels: Cleaning/Sanitation (washing off oil and hair), Disinfection (soaking tools in approved disinfectant like Barbicide or 70% alcohol), and Sterilisation (autoclave steam heat for metal manicure tools).',
      terms: [
        ['Sanitation', 'Washing away visible dirt, oil and debris with soap and warm water to lower germ counts'],
        ['Disinfection', 'Using approved chemical solutions to kill harmful bacteria, fungi and viruses on non-porous tools'],
        ['Sterilisation', 'Complete destruction of all living microorganisms including spores, e.g. using an autoclave'],
      ],
      rules: [
        'Always clean hair and grease off combs BEFORE soaking them in disinfectant — dirt weakens chemicals.',
        'Never apply chemical relaxers or dyes over a scratched, bleeding or infected scalp.',
      ],
      headers: ['Hygiene level', 'Salon example'],
      rows: [
        ['Cleaning / sanitation', 'Washing combs and basins with detergent and warm water'],
        ['Disinfection', 'Soaking clean combs in fresh disinfectant; spraying clipper blades'],
        ['Sterilisation', 'Autoclaving metal cuticle nippers'],
      ],
      exQ: 'A barber finishes a haircut and drops hair-covered clippers straight into disinfectant without brushing them. What is wrong?',
      exSteps: [
        ['Identify flaw', 'Loose hair and oil contaminate and deactivate disinfectant quickly'],
        ['Correct order', 'Brush off hair, wipe clean, then apply approved clipper disinfectant'],
      ],
      checkQ: 'Which highest level of salon decontamination destroys ALL microorganisms including tough bacterial spores?',
      checkO: ['Sterilisation', 'Quick dusting', 'Cold-water rinsing', 'Perfume spraying'],
      checkH: ['Hospitals and nail technicians use autoclaves for this level.', 'It goes beyond ordinary disinfection.'],
      checkE: 'Sterilisation destroys all microbes and spores completely.',
    },
    p2: {
      title: 'Hair structure, scalp health and safe styling',
      idea: 'Each hair strand is made of tough protein called keratin and has three layers: the outer overlapping Cuticle (protects shine and moisture), the middle Cortex (gives strength, elasticity and colour pigment melanin) and the inner Medulla. Tight braids pulled forcefully at the hairline damage follicles and cause traction alopecia, while heat tools need heat-protectant sprays.',
      terms: [
        ['Keratin', 'Fibrous structural protein that forms hair strands and fingernails'],
        ['Cuticle', 'Outer scale-like protective layer of the hair shaft'],
        ['Traction alopecia', 'Hair loss along the hairline caused by repeated excessive tension from overly tight braids or weaves'],
      ],
      rules: [
        'Always perform a patch test (skin allergy test) 24–48 hours before applying permanent hair dye.',
        'Condition hair after shampooing to smooth cuticle scales and reduce breakage during combing.',
      ],
      headers: ['Hair layer', 'Main role'],
      rows: [
        ['Cuticle', 'Protective outer overlapping scales'],
        ['Cortex', 'Strength, stretchiness (elasticity) and natural colour'],
        ['Medulla', 'Central core (often absent in very fine hair)'],
      ],
      exQ: 'Why must a stylist apply petroleum base cream around the hairline and ears before using a chemical hair relaxer?',
      exSteps: [
        ['Consider relaxer chemistry', 'Relaxers are strongly alkaline (high pH) and burn delicate skin'],
        ['Explain precaution', 'Barrier cream shields skin from chemical burns'],
      ],
      checkQ: 'Which middle layer of the hair shaft holds natural colour pigment (melanin) and provides hair strength?',
      checkO: ['Cortex', 'Cuticle', 'Follicle sheath', 'Sebum'],
      checkH: ['The cuticle is the outer shield; the medulla is the centre.', 'Chemical colour and relaxers act inside this middle layer.'],
      checkE: 'The cortex contains melanin pigment and gives hair its strength and elasticity.',
    },
    qs: [
      ['What fibrous protein makes up human hair and fingernails?', 'Keratin', 'Haemoglobin', 'Insulin', 'Starch', 'Hair and nails consist mainly of keratin protein.'],
      ['Receding hair around the edges caused by repeatedly braiding too tightly is called', 'traction alopecia', 'dandruff', 'melanin surge', 'sebum flow', 'Excessive pulling tension damages follicles along the hairline.'],
      ['Before applying a permanent oxidative hair dye to a new client, the stylist must perform a', 'skin patch (allergy) test', 'scissors balance test', 'nail polish test', 'chair height test', 'A patch test checks for severe allergic reaction before full application.'],
      ['Natural oil secreted by sebaceous glands to lubricate the scalp and hair is called', 'sebum', 'keratin', 'collagen', 'sweat salt', 'Sebum coats hair gently to keep it supple.'],
      ['If a client arrives with scaly patches suspected to be scalp ringworm (tinea capitis), the cosmetologist should', 'politely decline service and advise seeing a doctor', 'braid tightly over the patches', 'apply strong chemical relaxer immediately', 'share the same comb with the next client', 'Contagious fungal scalp infections require medical treatment first.'],
      ['Why is a wide-tooth comb preferred for detangling wet coiled hair?', 'Wet hair stretches easily and a wide-tooth comb minimises snapping and breakage', 'It cuts hair automatically', 'It heats the hair shaft', 'It strips away conditioner', 'Gentle detangling from ends upward with wide teeth protects wet strands.'],
    ],
  },
  {
    id: 'cos-skin-makeup-manicure',
    name: 'Skin care, facials, makeup artistry and manicure/pedicure',
    sec: 'Skin, nails & beauty',
    goals: [
      'Identify normal, oily, dry and combination skin types and basic facial steps',
      'Perform hygienic manicure/pedicure steps and balanced makeup colour matching',
    ],
    trap: 'Do not file natural nails in a rough back-and-forth "sawing" motion — file gently in one direction from outer edge toward the centre to prevent splitting and peeling.',
    p1: {
      title: 'Skin types, facial routine and makeup fundamentals',
      idea: 'Healthy beauty care respects the skin’s natural barrier. Skin types include Oily (enlarged pores, shiny T-zone), Dry (flaky, tight), Normal (balanced) and Combination (oily forehead/nose/chin with drier cheeks). A basic facial follows Cleanse → Exfoliate → Steam/Mask → Tone → Moisturise. In makeup, matching foundation along the jawline in natural light avoids a harsh mask effect.',
      terms: [
        ['T-zone', 'Forehead, nose and chin area that tends to produce more oil in combination skin'],
        ['Exfoliation', 'Gentle removal of dead surface skin cells to brighten complexion and unclog pores'],
        ['Primer', 'Smooth base layer applied before foundation to help makeup glide evenly and last longer'],
      ],
      rules: [
        'Test foundation shade on the jawline in daylight — not on the back of the hand.',
        'Never dip used mascara wands back into shared tubes; use clean disposable applicators for every client.',
      ],
      headers: ['Skin type', 'Key care focus'],
      rows: [
        ['Oily', 'Gentle oil-free cleanser and lightweight non-comedogenic moisturiser'],
        ['Dry', 'Creamy cleanser and rich hydrating moisturiser'],
        ['Combination', 'Balanced care targeting shine on T-zone and hydration on cheeks'],
      ],
      exQ: 'A client’s forehead and nose look shiny by noon while her cheeks feel dry and tight. Identify her skin type.',
      exSteps: [
        ['Note shiny zone', 'Forehead and nose form part of the T-zone'],
        ['Classify skin', 'Combination skin'],
      ],
      checkQ: 'Where is the best spot on the body to test a foundation shade for an accurate colour match?',
      checkO: ['Along the jawline in natural light', 'On the palm of the hand', 'On the elbow', 'Inside the wrist under coloured disco lights'],
      checkH: ['The face and neck should blend seamlessly without a colour line.', 'Hands are often darker or lighter than faces.'],
      checkE: 'Testing along the jawline in natural daylight ensures a seamless match between face and neck.',
    },
    p2: {
      title: 'Manicure, pedicure and nail health',
      idea: 'Manicure cares for hands and fingernails; pedicure cares for feet and toenails. Standard manicure sequence: remove old polish → shape nails with emery board → soak hands in warm soapy water → push back softened cuticles gently (never over-cut living skin) → massage hands with lotion → buff or apply base coat, two thin colour coats and top coat.',
      terms: [
        ['Cuticle', 'Thin rim of protective skin at the base of the nail plate sealing out germs'],
        ['Base coat', 'Clear first polish coat that smooths the nail, boosts grip and prevents dark colours from staining'],
        ['Emery board', 'Abrasive nail file used to shape free nail edges smoothly'],
      ],
      rules: [
        'File natural nails smoothly from outer corners toward the centre in one direction to prevent splitting.',
        'Trim toenails straight across (never deep into corners) to prevent painful ingrown toenails.',
      ],
      headers: ['Nail coat', 'Function'],
      rows: [
        ['Base coat', 'Protects nail from yellowing and improves colour adhesion'],
        ['Colour polish', 'Two thin even coats dry harder than one thick coat'],
        ['Top coat', 'Seals gloss shine and resists chipping'],
      ],
      exQ: 'Why does a nail technician apply a clear base coat before painting deep red nail polish?',
      exSteps: [
        ['Prevent pigment stain', 'Dark red dyes stain natural nail keratin yellow'],
        ['Improve durability', 'Base coat helps colour adhere evenly'],
      ],
      checkQ: 'How should toenails be trimmed during a pedicure to help prevent painful ingrown nails?',
      checkO: ['Straight across without digging deep into the side corners', 'Sharply pointed like triangles', 'Torn off by hand', 'Filed deep down into the side skin'],
      checkH: ['Deep curved corners let sharp nail edges grow sideways into flesh.', 'Keep the front edge level.'],
      checkE: 'Trimming toenails straight across prevents corners from growing into surrounding skin.',
    },
    qs: [
      ['Which skincare step removes dead surface cells so the skin looks smoother and fresher?', 'Exfoliation', 'Bleaching', 'Hair relaxing', 'Wax melting', 'Gentle exfoliation lifts dull dead cells cleanly.'],
      ['The forehead, nose and chin region commonly oily in combination skin is known as the', 'T-zone', 'C-curve', 'apex', 'cuticle', 'Forehead across + nose/chin down forms a T shape.'],
      ['Which nail polish layer prevents dark colours from staining the natural nail plate yellow?', 'Base coat', 'Cuticle oil', 'Acetone remover', 'Hand scrub', 'Base coat creates a protective gripping barrier.'],
      ['Filing a natural fingernail rapidly back and forth with a coarse file tends to cause', 'splitting and peeling of the nail edge', 'stronger keratin growth', 'instant polish drying', 'whiter cuticles', 'Filing gently in one direction keeps nail layers sealed.'],
      ['Why must makeup artists use disposable mascara wands when working on multiple clients?', 'To prevent transferring contagious eye infections like conjunctivitis', 'Because mascara brushes only work once in nature', 'To make lashes turn blue', 'To save water in the sink', 'Shared eye applicators easily spread bacterial or viral eye infections.'],
      ['Care and grooming specifically focused on the feet and toenails is called a', 'pedicure', 'manicure', 'facial', 'perm', 'Pedicure treats feet, heels and toenails; manicure treats hands and fingernails.'],
    ],
  },
];

const TOURISM_SPECS: CompactTopicInput[] = [
  {
    id: 'tour-concepts-nigeria-attractions',
    name: 'Tourism concepts, types and Nigerian tourist attractions',
    sec: 'Destinations & heritage',
    goals: [
      'Distinguish domestic, inbound and outbound tourism as well as eco-tourism and cultural tourism',
      'Locate major Nigerian natural and cultural attractions and explain tourism’s economic impact',
    ],
    trap: 'Do not confuse inbound tourism (foreign visitors travelling INTO Nigeria) with outbound tourism (Nigerians travelling ABROAD to visit other countries).',
    p1: {
      title: 'Forms of tourism and visitor classification',
      idea: 'Tourism is the temporary movement of people away from their usual home for leisure, business, culture, health or religion for more than 24 hours and less than one consecutive year. Domestic tourism happens within one’s own country (e.g. a Lagos family visiting Obudu); inbound brings foreign currency into Nigeria; outbound takes residents abroad. Day-trippers who do not stay overnight are excursionists.',
      terms: [
        ['Tourist', 'Temporary visitor staying at least 24 hours (one night) away from home for leisure, business or culture'],
        ['Excursionist', 'Same-day visitor who travels to an attraction and returns without an overnight stay'],
        ['Eco-tourism', 'Responsible travel to natural areas that conserves wildlife and improves local community welfare'],
      ],
      rules: [
        'Inbound tourism earns valuable foreign exchange; domestic tourism circulates wealth across Nigerian states.',
        'The five "A"s of a successful destination are Attractions, Accessibility, Accommodation, Amenities and Activities.',
      ],
      headers: ['Tourism type', 'Example'],
      rows: [
        ['Domestic', 'Abuja students touring Erin-Ijesha waterfalls in Osun State'],
        ['Inbound', 'Visitors from UK flying to Calabar Carnival in Cross River'],
        ['Outbound', 'Nigerians holidaying in Kenya or Dubai'],
        ['Eco-tourism', 'Guided wildlife watching at Yankari Game Reserve'],
      ],
      exQ: 'A group of pupils travels from Ibadan to Olumo Rock in Abeokuta at 8:00 am and returns home by 6:00 pm the same day. Are they tourists or excursionists?',
      exSteps: [
        ['Check stay length', 'Under 24 hours with no overnight stay'],
        ['Classify', 'Excursionists (same-day visitors)'],
      ],
      checkQ: 'When visitors from France fly to Lagos and Cross River for a 10-day festival holiday, what type of tourism is this for Nigeria?',
      checkO: ['Inbound tourism', 'Outbound tourism', 'Domestic tourism', 'Excursionism'],
      checkH: ['Think from Nigeria’s viewpoint: money and visitors are coming IN.', 'They stay overnight for 10 days.'],
      checkE: 'Foreign visitors entering Nigeria for an overnight stay represent inbound tourism.',
    },
    p2: {
      title: 'Nigeria’s flagship attractions and tourism impacts',
      idea: 'Nigeria boasts rich natural and cultural heritage: Yankari Game Reserve & Wikki Warm Springs (Bauchi), Obudu Mountain Resort (Cross River), Ikogosi Warm Springs (Ekiti), Idanre Hills (Ondo), Zuma Rock (Niger), Sukur Cultural Landscape (Adamawa, UNESCO), Osun-Osogbo Sacred Grove (Osun, UNESCO), Argungu Fishing Festival (Kebbi) and Durbar Festivals (Kano/Katsina). Tourism creates jobs and boosts crafts, though poorly managed tourism can cause litter, cultural erosion or seasonal jobs.',
      terms: [
        ['UNESCO World Heritage Site', 'Cultural or natural landmark recognised globally for outstanding universal value'],
        ['Cultural tourism', 'Travel motivated by festivals, museums, palaces, traditional music and cuisine'],
        ['Multiplier effect', 'Tourist spending circulating repeatedly through hotels, farmers, artisans and drivers'],
      ],
      rules: [
        'Nigeria’s two UNESCO World Heritage Sites are Sukur Cultural Landscape (Adamawa) and Osun-Osogbo Sacred Grove (Osun).',
        'Sustainable tourism balances economic gain with wildlife protection and respect for host customs.',
      ],
      headers: ['Nigerian attraction', 'State & highlight'],
      rows: [
        ['Yankari Game Reserve', 'Bauchi — wildlife & Wikki Warm Springs'],
        ['Obudu Mountain Resort', 'Cross River — cool highland plateau & cable views'],
        ['Ikogosi Warm Springs', 'Ekiti — warm and cold springs meeting naturally'],
        ['Osun-Osogbo Sacred Grove', 'Osun — UNESCO cultural heritage site'],
      ],
      exQ: 'Explain how a visitor spending ₦100,000 at a hotel in Bauchi benefits local vegetable farmers who never meet the tourist.',
      exSteps: [
        ['Trace money flow', 'Hotel uses tourist revenue to buy fresh tomatoes and pay staff salaries'],
        ['Name concept', 'The tourism multiplier effect spreads income across the wider local economy'],
      ],
      checkQ: 'Which Nigerian attraction in Ekiti State is famous for a natural warm spring flowing side by side with a cold spring?',
      checkO: ['Ikogosi Warm Springs', 'Zuma Rock', 'Olumo Rock', 'Kainji Dam'],
      checkH: ['It is located in Ekiti State in South-West Nigeria.', 'Both warm and cold waters meet at a confluence.'],
      checkE: 'Ikogosi Warm Springs in Ekiti State is renowned for its meeting warm and cold springs.',
    },
    qs: [
      ['A visitor who travels to a tourist site and returns home the same day without spending a night is an', 'excursionist', 'inbound tourist', 'emigrant', 'diplomat', 'Tourists stay at least one night; same-day visitors are excursionists.'],
      ['Yankari Game Reserve and Wikki Warm Springs are located in which Nigerian state?', 'Bauchi State', 'Lagos State', 'Imo State', 'Bayelsa State', 'Yankari is a premier wildlife and eco-tourism park in Bauchi State.'],
      ['Which of these is a UNESCO World Heritage Site in Nigeria?', 'Osun-Osogbo Sacred Grove', 'Third Mainland Bridge', 'Apapa Port', 'Lekki Toll Plaza', 'Osun-Osogbo Sacred Grove and Sukur Cultural Landscape are Nigeria’s UNESCO World Heritage Sites.'],
      ['The Argungu International Fishing Festival takes place in', 'Kebbi State', 'Ogun State', 'Enugu State', 'Delta State', 'Argungu Fishing Festival is a famous cultural tourism event in Kebbi State.'],
      ['Responsible travel to natural environments that protects ecosystems and supports local communities is', 'eco-tourism', 'mass littering', 'outbound transit', 'industrial mining', 'Eco-tourism prioritises conservation and community benefit.'],
      ['One economic benefit of inbound tourism to a host country is', 'foreign exchange earnings and hospitality job creation', 'complete elimination of agriculture', 'higher soil erosion', 'closure of airports', 'Inbound tourists bring foreign currency and support jobs across hospitality and crafts.'],
    ],
  },
  {
    id: 'tour-hospitality-agencies-marketing',
    name: 'Travel agencies, hospitality, transport and tourism promotion',
    sec: 'Industry operations',
    goals: [
      'Explain the roles of travel agencies, tour operators, airlines and hotels',
      'Identify travel documents, itinerary planning and Nigeria’s tourism agencies',
    ],
    trap: 'Do not confuse a tour operator (who assembles flights, hotels and excursions into complete package holidays) with a travel agent (who retails tickets and packages directly to travellers for commission).',
    p1: {
      title: 'Travel agencies, tour operators and travel documents',
      idea: 'Tour operators act like wholesalers, bundling transport, hotel rooms and guided tours into package holidays. Travel agencies act like retailers, advising clients, issuing flight tickets, booking hotels and earning commissions. International travellers need a valid Passport, Visa (where required), travel insurance and health certificates (such as the Yellow Fever card).',
      terms: [
        ['Tour operator', 'Company that combines transport, lodging and sightseeing into ready-made holiday packages'],
        ['Itinerary', 'Detailed day-by-day schedule of a trip showing transport times, hotels and activities'],
        ['Visa', 'Official endorsement placed in a passport granting permission to enter a foreign country'],
      ],
      rules: [
        'ECOWAS citizens enjoy visa-free entry across West African member states with a valid ECOWAS travel certificate or passport.',
        'Always verify passport expiry (most countries require at least 6 months validity remaining) before booking flights.',
      ],
      headers: ['Industry player', 'Primary role'],
      rows: [
        ['Tour operator', 'Assembles package tours (transport + hotel + guide)'],
        ['Travel agent', 'Sells tickets, hotel bookings and packages to travellers'],
        ['Tour guide', 'Leads visitors safely and explains history and culture on site'],
      ],
      exQ: 'A student plans a 4-day educational trip to Calabar listing bus departure times, hotel check-in, Tinapa visit and Museum tour. What is this schedule called?',
      exSteps: [
        ['Identify document', 'Day-by-day timetable of travel and visits'],
        ['Name it', 'Travel itinerary'],
      ],
      checkQ: 'Which business acts like a wholesaler by bundling flights, accommodation and guided tours into one package holiday?',
      checkO: ['Tour operator', 'Hotel receptionist', 'Customs officer', 'Luggage porter'],
      checkH: ['Travel agents retail the finished package; this firm puts all the pieces together.', 'Think of who "operates" the tour package.'],
      checkE: 'A tour operator assembles transport, lodging and excursions into a complete package.',
    },
    p2: {
      title: 'Hospitality, transport modes and tourism promotion',
      idea: 'Tourism thrives on reliable transport (air for speed across continents, road/rail for scenic domestic routes, water for coastal resorts) and welcoming accommodation (hotels, motels, eco-lodges, guest houses). In Nigeria, the Nigerian Tourism Development Authority (NTDA) promotes destinations domestically and abroad through festivals, digital media and quality grading.',
      terms: [
        ['Hospitality', 'Warm, professional provision of lodging, meals and guest care'],
        ['Star rating', 'Standardised hotel grading (1 to 5 stars) reflecting comfort, facilities and service quality'],
        ['NTDA', 'Nigerian Tourism Development Authority — federal body promoting and regulating tourism in Nigeria'],
      ],
      rules: [
        'Good road signage, steady security, clean restrooms and courteous staff turn first-time visitors into repeat ambassadors.',
        'Hotel Front Office handles reservations, check-in, billing and concierge inquiries.',
      ],
      headers: ['Accommodation type', 'Key feature'],
      rows: [
        ['Resort hotel', 'Leisure amenities (pool, spa, scenery) for holidaymakers'],
        ['Motel', 'Roadside lodging with direct car parking for motorists'],
        ['Eco-lodge', 'Low-impact nature cabins inside parks or highlands'],
      ],
      exQ: 'Which department in a hotel greets arriving guests, assigns room keys and settles final bills at check-out?',
      exSteps: [
        ['Identify guest-facing hub', 'Reception desk at the lobby entrance'],
        ['Name department', 'Front Office department'],
      ],
      checkQ: 'Which official travel document is an endorsement granting a foreigner legal permission to enter a destination country?',
      checkO: ['Visa', 'Boarding pass', 'Hotel voucher', 'Luggage tag'],
      checkH: ['A passport proves citizenship; embassies issue this entry permit.', 'ECOWAS citizens do not need one within West Africa.'],
      checkE: 'A visa authorises a foreign traveller to enter a country for a stated purpose and period.',
    },
    qs: [
      ['A detailed day-by-day plan showing flight times, hotels and sightseeing stops for a trip is an', 'itinerary', 'invoice', 'manifest', 'passport', 'An itinerary organises every stage of a traveller’s schedule.'],
      ['Which public body promotes and coordinates tourism development at the federal level in Nigeria?', 'Nigerian Tourism Development Authority (NTDA)', 'NIPOST', 'NECO', 'EFCC', 'NTDA (formerly NTDC) leads national tourism promotion and standards.'],
      ['Roadside accommodation designed primarily for highway travellers with convenient parking is a', 'motel', 'cruise liner', 'hostel dorm', 'cathedral', 'Motel blends "motor" and "hotel" for driving travellers.'],
      ['Which health document is frequently required when travelling internationally to and from tropical West Africa?', 'Yellow Fever vaccination card', 'Dental X-ray', 'Gym membership', 'Blood donor badge', 'International Yellow Fever certificates are standard border health requirements.'],
      ['In a hotel, which department is responsible for cleaning guest rooms, changing linen and maintaining public lobbies?', 'Housekeeping', 'Kitchen brigade', 'Aviation desk', 'Payroll', 'Housekeeping maintains cleanliness and comfort throughout rooms and public areas.'],
      ['Why is reliable transport infrastructure vital to a tourist destination?', 'Visitors cannot easily reach or enjoy attractions without safe, accessible transport', 'Tourists only like traffic jams', 'Roads replace hotels', 'Airports eliminate the need for food', 'Accessibility is one of the essential pillars of destination success.'],
    ],
  },
];

export function buildCateringCurriculum() {
  return buildUtmeSubjectCurriculum([...CATERING_SPECS.map(compactUtmeTopic), ...CATERING_EXTRA_SPECS]);
}

export function buildGarmentCurriculum() {
  return buildUtmeSubjectCurriculum([...GARMENT_SPECS.map(compactUtmeTopic), ...GARMENT_EXTRA_SPECS]);
}

export function buildPhotoCurriculum() {
  return buildUtmeSubjectCurriculum([...PHOTO_SPECS.map(compactUtmeTopic), ...PHOTO_EXTRA_SPECS]);
}

export function buildCosmetCurriculum() {
  return buildUtmeSubjectCurriculum([...COSMET_SPECS.map(compactUtmeTopic), ...COSMET_EXTRA_SPECS]);
}

export function buildTourismCurriculum() {
  return buildUtmeSubjectCurriculum([...TOURISM_SPECS.map(compactUtmeTopic), ...TOURISM_EXTRA_SPECS]);
}
