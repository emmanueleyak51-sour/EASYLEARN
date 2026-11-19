import type { Topic } from '../types';

/**
 * SS3 Nigerian NERDC / WAEC / NECO / JAMB Geography Topics (Topics 21 – 30)
 * Regional Geography of Nigeria, West Africa (ECOWAS), and Africa.
 */
export const GEOG_TOPICS_PART3: Topic[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // SS3 FIRST TERM (Topics 21 – 24)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'gg-nig-relief-drainage',
    num: 21,
    name: 'Nigeria: Location, Size, Relief & Drainage Basins',
    sec: 'Regional Geography of Nigeria & Africa',
    boss: 'Nigerian Physiography Cartographer',
    goals: [
      'State Nigeria’s exact latitudinal (4°N – 14°N) and longitudinal (3°E – 15°E) extent, land area (923,768 km²), international boundaries, and WAT (UTC + 1) time zone',
      'Classify Nigeria’s major highland blocks (North-Central Highlands & Jos Plateau, Western Uplands, Eastern/Mandara/Adamawa/Mambilla Highlands) and sedimentary lowlands',
      'Identify Chappal Waddi (2,419 m) on the Mambilla/Gotel Mountains in Taraba State as Nigeria’s highest peak',
      'Contrast Nigeria’s Atlantic exoreic drainage systems (Niger–Benue, Ogun–Osun, Cross, Imo, Anambra) with the inland endorheic Lake Chad Basin',
    ],
    trap: 'Nigeria’s highest mountain peak is CHAPPAL WADDI (2,419 m) in the Gotel Mountains on the Mambilla Plateau (Taraba State) — NOT Shere Hills (1,829 m) on the Jos Plateau, though Jos Plateau is the hydrological centre of Northern Nigeria!',
    parts: [
      {
        title: 'Location, Size, Borders & Major Relief Regions of Nigeria',
        idea: 'Nigeria lies wholly within the northern tropics of West Africa between latitudes <b>4°N</b> (Brass/Akassa coast) and <b>14°N</b> (near Illela/Lake Chad) and longitudes <b>3°E</b> and <b>15°E</b>, covering <b>923,768 km²</b> (~1,100 km N–S and ~1,200 km E–W). Its 15°E meridian anchors <b>West Africa Time (WAT = UTC + 1)</b>.',
        rules: [
          '<b>International Neighbours:</b> Bounded West by <b>Republic of Benin</b>, North by <b>Niger Republic</b>, North-East by <b>Chad Republic</b> (across Lake Chad), East by <b>Republic of Cameroon</b>, and South by an ~853 km coastline along the <b>Gulf of Guinea / Atlantic Ocean</b> (Bights of Benin and Bonny).',
          '<b>Four Highland Regions (> 300 m, Pre-Cambrian Basement Complex & Volcanics):</b> (1) <b>North-Central Highlands & Jos Plateau</b> (Hausa High Plains 600–750 m rising to steep-scarped <b>Jos Plateau</b> 1,200–1,829 m at <b>Shere Hills</b>, dotted with granite inselbergs and volcanic craters); (2) <b>Western Uplands</b> (Yoruba–Ekiti–Idanre–Kukuruku hills, 300–1,000 m); (3) <b>Eastern Scarplands</b> (sandstone <b>Udi–Nsukka Escarpment</b> & Awgu Plateau, coal-bearing); (4) <b>Eastern Borderlands / Highlands</b> along Cameroon frontier — Mandara, Alantika, Shebshi, Adamawa, Gotel/<b>Mambilla Plateau</b> (<b>Chappal Waddi, 2,419 m</b> — highest point in Nigeria!), and Oban/Obudu Hills.',
          '<b>Major Sedimentary Lowlands (< 300 m):</b> Sokoto Plains (NW), Chad Basin (NE, Bornu Plains), Niger–Benue Trough, Cross River Basin, Coastal Creeks/Lagoons, and the arcuate <b>Niger Delta</b>.',
        ],
        ex: {
          q: 'Calculate the approximate North–South latitudinal distance across Nigeria from 4°N to 14°N using 1° of latitude = 111 km, and explain one climatic consequence of this 10° span.',
          steps: [
            ['Find latitudinal difference', 'Δφ = 14°N − 4°N = 10° (both in the Northern Hemisphere, so subtract).'],
            ['Convert degrees to kilometres', 'Distance = 10 × 111 km = 1,110 km from the Atlantic coast to the northern border.'],
            ['Climatic consequence', 'Extending ~1,110 km inland from the warm Atlantic Ocean to the Sahel produces a steep South-to-North decrease in annual rainfall (> 2,500 mm on the coast to < 500 mm in the far NE) and lengthening dry season.'],
          ],
        },
        tryit: {
          q: 'Which peak is the HIGHEST point in Nigeria (2,419 m above sea level), and in which highland region is it located?',
          o: [
            'Chappal Waddi in the Gotel / Mambilla Highlands of Taraba State',
            'Shere Hills on the Jos Plateau in Plateau State',
            'Olumo Rock in the Western Uplands of Ogun State',
            'Zuma Rock in the Niger Trough near Abuja',
          ],
          a: 0,
          h: 'Shere Hills (1,829 m) is the highest on Jos Plateau, whereas a 2,419 m peak along the Taraba–Cameroon border tops all of Nigeria.',
          e: 'Chappal Waddi ("Mountain of Death", 2,419 m) in the Gotel Mountains on the edge of the Mambilla Plateau (Taraba State) is Nigeria’s highest elevation.',
        },
      },
      {
        title: 'Drainage Basins & Hydrological Centres of Nigeria',
        idea: 'Nigeria’s rivers radiate outward from three upland watersheds — the <b>Jos Plateau</b>, the <b>Western Uplands</b>, and the <b>Eastern Highlands</b> — draining either southward into the Atlantic Ocean or northeastward into the inland <b>Lake Chad Basin</b>.',
        rules: [
          '<b>Jos Plateau as "Hydrological Centre":</b> Radial drainage sends <b>Kaduna</b> and <b>Gurara</b> SW to the Niger, <b>Gongola</b> SE to the Benue, and <b>Hadejia–Jama’are (Komadugu Yobe)</b> NE into <b>Lake Chad</b>.',
          '<b>Niger–Benue River System:</b> <b>River Niger</b> (4,180 km, Africa’s 3rd longest) rises in the Futa Djallon Highlands (Guinea), enters Nigeria via Kebbi, receives Sokoto/Rima and Kaduna, and meets <b>River Benue</b> (rising in Adamawa Plateau, Cameroon) at the <b>Lokoja confluence</b> before building the arcuate <b>Niger Delta</b> into the Gulf of Guinea.',
          '<b>Short Coastal & Inland Rivers:</b> Western Uplands send <b>Ogun, Osun, Owena, and Benin</b> directly south to lagoons/Bight of Benin; SE sends <b>Imo, Qua Iboe, and Cross River</b> to the Bight of Bonny; NE rivers (<b>Yobe, Ngadda, Yedseram</b>) form <b>inland (endorheic) drainage</b> into shallow fresh-water Lake Chad.',
          '<b>Characteristics & Uses of Nigerian Rivers:</b> Muddy/turbid in wet season, wide seasonal volume swings, broken by basement rapids/waterfalls (Kainji, Shiroro, Gurara, Erin-Ijesha, Kwa Falls), Silted mouths → used for HEP (Kainji, Jebba, Shiroro, Zungeru), irrigation (Bakolori, Kano River), fishing, domestic/industrial water, and seasonal barge transport.',
        ],
        ex: {
          q: 'Why is the Jos Plateau described by geographers as the "hydrological centre" of Northern Nigeria?',
          steps: [
            ['Identify radial watershed geometry', 'Standing 1,200–1,829 m high near the centre of Northern Nigeria, the Jos Plateau receives heavy orographic rainfall (~1,400 mm) and acts as a central dome watershed.'],
            ['Name major rivers radiating in all directions', 'Rivers radiate outward from it into three major basins: Kaduna River (SW to Niger), Gongola River (SE to Benue), and Hadejia/Jama’are Rivers (NE into Lake Chad).'],
          ],
        },
        tryit: {
          q: 'Which of the following Nigerian rivers flows into an INLAND (endorheic) drainage basin rather than emptying into the Atlantic Ocean?',
          o: [
            'River Komadugu Yobe (Hadejia–Jama’are) flowing into Lake Chad',
            'River Cross flowing past Calabar into the Bight of Bonny',
            'River Ogun flowing into the Lagos Lagoon',
            'River Gongola flowing into River Benue at Numan',
          ],
          a: 0,
          h: 'Lake Chad has no outlet to the sea; check which river drains NE across Yobe/Borno into Lake Chad.',
          e: 'The Hadejia–Jama’are–Komadugu Yobe, Ngadda, and Yedseram rivers form an inland endorheic drainage system terminating in Lake Chad.',
        },
      },
    ],
    spot: {
      part: 0,
      who: 'Sadiq',
      q: 'Sadiq wrote four revision notes on Nigeria’s location and relief. Spot the incorrect line:',
      lines: [
        '1. Nigeria lies between latitudes 4°N and 14°N and longitudes 3°E and 15°E.',
        '2. Nigeria’s standard time (WAT, UTC + 1) is calculated from longitude 15°E.',
        '3. Nigeria’s highest peak is Shere Hills (1,829 m) on the Jos Plateau.',
        '4. Rivers Niger and Benue meet at a confluence town at Lokoja in Kogi State.',
      ],
      bad: 2,
      okfb: [
        'Line 1 is accurate — 4°N to 14°N and 3°E to 15°E.',
        'Line 2 is accurate — 15°E ÷ 15°/hr = +1 hour ahead of GMT (WAT).',
        '',
        'Line 4 is accurate — Lokoja is Nigeria’s famous Niger–Benue confluence city.',
      ],
      o: [
        'Chappal Waddi (2,419 m) on the Mambilla/Gotel Mountains in Taraba State is Nigeria’s highest peak; Shere Hills (1,829 m) is only the highest point on the Jos Plateau',
        'Zuma Rock (725 m) near Abuja is the highest mountain in West Africa',
        'Olumo Rock in Abeokuta reaches 3,500 m above sea level',
        'The Niger Delta lies 2,000 m above the Jos Plateau',
      ],
      a: 0,
      fb: [
        'Exact! Chappal Waddi (2,419 m) in Taraba State is Nigeria’s highest peak.',
        'Zuma Rock is a prominent granite monolith (~725 m), far lower than Chappal Waddi.',
        'Olumo Rock is ~137 m high.',
        'The Niger Delta is a low coastal plain (< 20 m above sea level).',
      ],
      h: ['Compare 1,829 m on Jos Plateau with 2,419 m along the Taraba–Cameroon border.'],
      fix: 'Line 3 is wrong: Nigeria’s highest point is Chappal Waddi (2,419 m) in the Gotel Mountains on the Mambilla Plateau (Taraba State).',
    },
    qs: [
      {
        l: 1,
        dx: 1,
        q: 'Nigeria is located approximately between which parallels of latitude and meridians of longitude?',
        o: [
          'Latitudes 4°N – 14°N and Longitudes 3°E – 15°E',
          'Latitudes 4°S – 14°N and Longitudes 3°W – 15°E',
          'Latitudes 10°N – 24°N and Longitudes 15°E – 30°E',
          'Latitudes 0° – 10°S and Longitudes 5°W – 5°E',
        ],
        a: 0,
        e: 'Nigeria lies entirely north of the Equator (4°N–14°N) and east of the Prime Meridian (3°E–15°E).',
      },
      {
        l: 2,
        q: 'Which country borders Nigeria to the WEST, and which borders Nigeria to the EAST?',
        o: [
          'Republic of Benin to the West; Republic of Cameroon to the East',
          'Ghana to the West; Chad to the South',
          'Togo to the West; Central African Republic to the East',
          'Niger Republic to the South; Equatorial Guinea to the North',
        ],
        a: 0,
        e: 'Nigeria shares land borders with Benin (West), Niger (North), Chad (North-East), and Cameroon (East), with the Atlantic Ocean to the South.',
      },
      {
        l: 2,
        q: 'The sandstone escarpment famous for sub-bituminous coal seams in South-Eastern Nigeria is the:',
        o: [
          'Udi–Nsukka Escarpment (Eastern Scarplands)',
          'Sokoto Rima Plains',
          'Idanre Granite Batholith',
          'Bornu Clay Plains',
        ],
        a: 0,
        e: 'The North–South trending Cretaceous sandstone Udi–Nsukka Escarpment in Enugu State forms the Eastern Scarplands and hosts Enugu’s coal mines.',
      },
      {
        l: 3,
        q: 'What drainage pattern is formed by rivers such as the Kaduna, Gongola, and Hadejia–Jama’are flowing outward in different directions from the central dome of the Jos Plateau?',
        o: [
          'Radial drainage pattern',
          'Trellis drainage pattern',
          'Centripetal drainage pattern',
          'Annular underground pattern',
        ],
        a: 0,
        e: 'Streams flowing outward in all compass directions from an elevated central dome or volcanic highland form a radial drainage pattern.',
      },
      {
        l: 4,
        q: 'Which of the following landforms in Nigeria is of SEDIMENTARY origin rather than Pre-Cambrian Basement Complex crystalline rock?',
        o: [
          'The Sokoto Plains, Chad Basin, and Niger–Benue Trough',
          'The Idanre and Ekiti inselberg hills of the Western Uplands',
          'The granite batholiths of the North-Central Hausa High Plains',
          'The Oban Crystalline Massif of Cross River State',
        ],
        a: 0,
        e: 'Sokoto Plains, Chad Basin, Niger–Benue Trough, Cross River Basin, and the Niger Delta consist of younger Cretaceous-to-Quaternary sedimentary strata.',
      },
      {
        l: 5,
        q: 'Why does theJos Plateau record noticeably cooler mean annual temperatures (~21 °C) than surrounding lowlands such as Lokoja (~28 °C) at a similar tropical latitude?',
        o: [
          'High altitude (1,200–1,800 m) lowers air temperature via the Environmental Lapse Rate (~6.5 °C drop per 1,000 m ascent)',
          'Cold polar icebergs drift up River Benue to cool Plateau State',
          'Jos lies north of the Arctic Circle during June and July',
          'Dense mangrove swamps cover the summit of Shere Hills',
        ],
        a: 0,
        e: 'Rising ~1,200 m above Lokoja cools air by roughly 1.2 × 6.5 °C ≈ 7.8 °C through the normal environmental lapse rate.',
      },
    ],
  },

  {
    id: 'gg-nig-climate-veg',
    num: 22,
    name: 'Nigeria: Climate, Air Masses (ITD) & Vegetation Belts',
    sec: 'Regional Geography of Nigeria & Africa',
    boss: 'ITD & Ecological Belt Specialist',
    goals: [
      'Contrast the two air masses governing West African weather — Tropical Maritime (mT, SW Monsoon) and Tropical Continental (cT, NE Harmattan) — across the migrating Inter-Tropical Discontinuity (ITD)',
      'Explain why Southern Nigeria (e.g. Lagos, Ibadan, Benin) experiences a double rainfall maximum (June & September/October) with an "August Break" while Northern Nigeria has a single July/August peak',
      'Order Nigeria’s vegetation belts accurately from South to North: Mangrove Swamp → Freshwater Swamp → Tropical Rainforest → Guinea Savanna → Sudan Savanna → Sahel Savanna (+ Montane on Jos/Mambilla/Obudu)',
      'Relate plant adaptations (stilt/breathing roots, buttress roots & drip tips, thick corky fire-resistant bark, baobab water-storing trunks, thorny xerophytes) to rainfall and dry-season length',
    ],
    trap: 'GUINEA SAVANNA is the LARGEST (broadest) vegetation belt in Nigeria covering nearly half the country across the Middle Belt, whereas SAHEL SAVANNA occurs ONLY in the extreme North-East corner (Borno/Yobe border around Lake Chad)!',
    parts: [
      {
        title: 'Air Masses, ITD Migration & Rainfall Regimes in Nigeria',
        idea: 'Every season in Nigeria is controlled by the North–South oscillation of the <b>Inter-Tropical Discontinuity (ITD)</b> — the surface convergence front between moist Atlantic <b>Tropical Maritime (mT)</b> air and dry Saharan <b>Tropical Continental (cT)</b> air, following the overhead sun.',
        rules: [
          '<b>Tropical Maritime Air Mass (mT — SW Monsoon Winds):</b> Originates over the warm South Atlantic Ocean; warm, humid, unstable → brings cloud cover, high relative humidity (> 80%), and wet-season rainfall.',
          '<b>Tropical Continental Air Mass (cT — NE Trade / Harmattan Winds):</b> Originates over the Sahara Desert; hot by day, cool at night (wide diurnal range), dusty, very low humidity (< 25%) → brings dry season and <b>Harmattan haze</b> (Nov–Feb).',
          '<b>Seasonal ITD Positions:</b> In <b>January</b> (overhead sun at Tropic of Capricorn), ITD retreats south to ~<b>6°N–8°N</b> so dry cT covers almost all Nigeria except coastal swamps; in <b>July</b> (overhead sun near Tropic of Cancer), ITD advances north to ~<b>20°N–22°N</b> so rain-bearing mT covers the entire country.',
          '<b>Double vs Single Rainfall Maxima:</b> South-West/Southern belt (~5°N–9°N, e.g. Lagos, Ibadan, Abeokuta) has <b>double maxima</b> (peaks in June & September/October separated by the brief dry <b>"Little Dry Season / August Break"</b> when the ITD is farthest north); Northern Nigeria (> 10°N, Kano, Sokoto, Maiduguri) has a <b>single maximum</b> in August; extreme coastal Niger Delta (Brass, Bonny, Calabar > 3,000 mm) rains nearly all year; Jos/Obudu windward slopes get heavy <b>orographic</b> rain.',
        ],
        ex: {
          q: 'Compare the climatic statistics of Station X (Annual rainfall = 3,200 mm; Mean temp = 26 °C; Annual temp range = 2.5 °C) and Station Y (Annual rainfall = 650 mm; Mean temp = 28 °C; Annual temp range = 11 °C) and match each to a Nigerian city.',
          steps: [
            ['Analyse Station X', 'Very heavy year-round rain (3,200 mm) and tiny temperature range (2.5 °C) indicate an equatorial coastal mT station such as Calabar, Bonny, Brass, or Port Harcourt.'],
            ['Analyse Station Y', 'Low seasonal rainfall (650 mm) and wide temperature range (11 °C) indicate a Sudan Savanna continental station dominated for 7–8 months by dry cT Harmattan winds, such as Kano, Katsina, or Sokoto.'],
          ],
        },
        tryit: {
          q: 'In July, when the Inter-Tropical Discontinuity (ITD) reaches its northernmost position (~20°N in the Sahara), which air mass covers virtually the whole of Nigeria?',
          o: [
            'Moist South-West Tropical Maritime (mT) air mass bringing widespread wet-season rains',
            'Dusty North-East Tropical Continental (cT) Harmattan air mass bringing drought',
            'Freezing Antarctic Polar Easterlies bringing snowfall',
            'Dry Mediterranean Westerlies blowing from Gibraltar',
          ],
          a: 0,
          h: 'Everything SOUTH of the surface ITD line lies beneath the advancing South-West Monsoon.',
          e: 'When the ITD lies near 20°N in July, all of Nigeria (4°N–14°N) lies south of the front under moist Atlantic Tropical Maritime (mT) winds.',
        },
      },
      {
        title: 'Vegetation Belts of Nigeria (South → North & Montane)',
        idea: 'Because vegetation mirrors rainfall total and dry-season length, Nigeria’s natural vegetation forms concentric East–West belts stepping northward from coastal <b>swamp & rainforest</b> to <b>wooded and short-grass savannas</b>, broken by high-altitude <b>montane grassland</b>.',
        rules: [
          '<b>Forest Zone (South):</b> (1) <b>Mangrove (Saltwater) Swamp</b> along brackish coastal creeks/Niger Delta — red/white mangroves (<i>Rhizophora</i>) with tangled <b>stilt/prop roots</b> and aerial breathing roots (<b>pneumatophores</b>); (2) <b>Freshwater Swamp Forest</b> inland of tidal creeks — raffia palm (tapped for palm wine/mats), raphia, giant sedges; (3) <b>Tropical Rainforest (High Forest)</b> in Ogun, Ondo, Edo, Cross River (1,500–2,500 mm) — 3 tiers (emergents > 45 m with <b>buttress roots</b>, closed evergreen canopy, sparse undergrowth + lianas/epiphytes) yielding <b>Iroko, Mahogany, Obeche, Sapele, Mansonia, Oil Palm, Cocoa</b>.',
          '<b>Savanna Zone (Middle Belt → Far North):</b> (4) <b>Guinea Savanna</b> (broadest belt in Nigeria! 1,000–1,500 mm, Middle Belt: Kwara, Kogi, Benue, Niger, Kaduna) — tall elephant/spear grass (2–3 m) + deciduous trees (locust bean, shea butter, isoberlinia) with <b>thick corky fire-resistant bark</b> and gallery forests along rivers; (5) <b>Sudan Savanna</b> (500–1,000 mm: Kano, Sokoto, Katsina, Bauchi) — short feathery grasses + scattered <b>baobab</b> (swollen water-storing trunk), acacia, dum palm, silk cotton; ideal for grain & cattle; (6) <b>Sahel Savanna</b> (< 500 mm, 8–9 dry months, NE Borno/Yobe near Lake Chad) — tufted scanty grass & thorny xerophytic shrubs (gum arabic acacia, date palm).',
          '<b>Montane Vegetation:</b> Found on cool highlands > 1,500 m (<b>Mambilla Plateau, Obudu Cattle Ranch, parts of Jos Plateau</b>) — rich short temperate-like tussock grasses free of tsetse flies, ideal for dairy/beef cattle ranching and tea.',
        ],
        ex: {
          q: 'Explain two structural adaptations that enable Savanna trees (such as Shea Butter and Baobab) to survive the long dry season and annual bush fires in Northern Nigeria.',
          steps: [
            ['Drought conservation', 'Deciduous leaf-shedding in the dry season cuts transpiration loss; Baobab stores thousands of litres of water in its spongy swollen trunk, while Acacias have deep taproots and tiny leathery/thorny leaves.'],
            ['Fire resistance', 'Thick, fissured corky bark insulates living cambium tissues against annual dry-season grass fires, and gnarled twisted trunks regenerate shoots rapidly when rains return.'],
          ],
        },
        tryit: {
          q: 'Which is the LARGEST (most extensive) natural vegetation belt in Nigeria, covering roughly 40–50% of the country’s land area across the Middle Belt?',
          o: [
            'Guinea Savanna',
            'Sahel Savanna',
            'Saltwater Mangrove Swamp',
            'Montane Grassland',
          ],
          a: 0,
          h: 'Stretches right across Oyo-North, Kwara, Niger, Kogi, Abuja, Benue, Nasarawa, Taraba, and southern Kaduna.',
          e: 'Guinea Savanna (Southern and Northern Guinea) is Nigeria’s widest ecological zone, spanning almost the entire Middle Belt.',
        },
      },
    ],
    qs: [
      {
        l: 1,
        dx: 1,
        q: 'Which sequence lists Nigeria’s natural vegetation belts in the correct geographical order from the ATLANTIC COAST northward to LAKE CHAD?',
        o: [
          'Mangrove Swamp → Freshwater Swamp → Tropical Rainforest → Guinea Savanna → Sudan Savanna → Sahel Savanna',
          'Tropical Rainforest → Mangrove Swamp → Sudan Savanna → Guinea Savanna → Sahel Savanna → Montane',
          'Sahel Savanna → Sudan Savanna → Guinea Savanna → Tropical Rainforest → Freshwater Swamp → Mangrove Swamp',
          'Freshwater Swamp → Guinea Savanna → Mangrove Swamp → Sahel Savanna → Rainforest → Sudan Savanna',
        ],
        a: 0,
        e: 'Moving inland from brackish coastal creeks (4°N) to semi-arid NE Borno (14°N), vegetation transitions: Mangrove → Freshwater Swamp → Rainforest → Guinea → Sudan → Sahel.',
      },
      {
        l: 2,
        q: 'The cool, dry, dust-laden Harmattan wind experienced in Nigeria between November and February is associated with the:',
        o: [
          'Tropical Continental (cT) North-East Trade air mass from the Sahara Desert',
          'Tropical Maritime (mT) South-West Monsoon air mass from the Atlantic Ocean',
          'Equatorial Westerly jet stream from the Congo Basin',
          'Warm Guinea Ocean Current along Lagos bar beach',
        ],
        a: 0,
        e: 'Harmattan is the dry, dusty North-East Trade wind blowing out of the Saharan high-pressure cell (Tropical Continental air mass, cT).',
      },
      {
        l: 2,
        q: 'Aerial breathing roots (pneumatophores) and tangled stilt roots are special plant adaptations characteristic of:',
        o: [
          'Coastal Saltwater Mangrove Swamp forest in the Niger Delta and Lagos creeks',
          'Thorny Sahel Savanna around Lake Chad',
          'Montane tussock grassland on the Mambilla Plateau',
          'Sudan Savanna parkland around Sokoto and Katsina',
        ],
        a: 0,
        e: 'Waterlogged, oxygen-poor tidal mud in brackish mangrove swamps forces Rhizophora/Avicennia trees to grow stilt prop roots for anchorage and pneumatophores for gas exchange.',
      },
      {
        l: 3,
        q: 'Why do South-Western Nigerian stations such as Ibadan and Abeokuta experience a brief dip in rainfall in August ("August Break") between June and September peaks?',
        o: [
          'By August the ITD and peak rain belt have migrated far north (~20°N), leaving SW Nigeria temporarily under a cooler, subsiding inversion zone before the ITD retreats southward in September',
          'The Sahara Desert physically shifts southward to cover Lagos Lagoon every August',
          'Ocean currents off West Africa freeze solid in August, stopping all evaporation',
          'High fold mountains block all winds from reaching Ibadan only in August',
        ],
        a: 0,
        e: 'As the ITD reaches its northernmost limit in August, stable subsiding air and cooler coastal upwelling suppress convection briefly in SW Nigeria until the southward retreat brings the second (Sept/Oct) peak.',
      },
      {
        l: 4,
        q: 'Why are Mambilla Plateau (Taraba) and Obudu Plateau (Cross River) uniquely suited to commercial dairy/beef cattle ranching and tea cultivation despite lying in southern/eastern latitudes?',
        o: [
          'High elevation (> 1,500 m) creates a cool montane climate, rich short pasture grasses, and freedom from tsetse-fly trypanosomiasis',
          'Both plateaus lie below sea level and are flooded daily by brackish ocean tides',
          'Annual rainfall is zero millimetres, preventing grass growth',
          'Sandy Saharan barchan dunes cover both plateaus year-round',
        ],
        a: 0,
        e: 'Montane altitude (> 1,500 m) produces temperate-like temperatures (15–20 °C), nutritious perennial short grasses, and absence of lowland tsetse flies.',
      },
      {
        l: 5,
        q: 'A climatic station in Nigeria has a single rainfall peak in August, 7 dry months (< 25 mm), annual total rainfall of 520 mm, and thorny acacia / gum-arabic trees. Where is it located?',
        o: [
          'Extreme North-East Nigeria (Sahel/Sudan margin in Borno or Yobe State)',
          'South-South Niger Delta (Bayelsa or Rivers State)',
          'Western Uplands cocoa belt (Ondo or Osun State)',
          'Cross River High Rainforest (Ikom or Calabar)',
        ],
        a: 0,
        e: 'Low rainfall (~500 mm) concentrated in a brief July–September season with 7–8 dry months and gum-arabic acacias characterizes the Sahel/Sudan border of NE Borno/Yobe.',
      },
    ],
  },

  {
    id: 'gg-nig-soils-forest',
    num: 23,
    name: 'Nigeria: Soil Zones, Lumbering & Forest Resources',
    sec: 'Regional Geography of Nigeria & Africa',
    boss: 'Pedology & Forestry Conservator',
    goals: [
      'Classify Nigeria’s four major zonal/azonal soil belts: Hydromorphic & Alluvial soils, Rainforest Ferralsols (deeply leached red lateritic soils), Savanna Ferruginous Tropical soils, and Semi-Arid Regosols/Brown soils',
      'Explain why lush Tropical Rainforest soils lose fertility rapidly once cleared (heavy leaching of soluble bases and rapid bacterial oxidation of thin surface humus)',
      'Locate Nigeria’s major lumbering centres (Sapele, Benin City, Ondo, Akure, Ijebu-Ode, Calabar, Ikom) and economic hardwoods (Iroko, Mahogany, Obeche, Sapele, Mansonia, Afara, Ebony)',
      'Analyse problems of tropical lumbering (non-pure heterogeneous stands, buttress roots, wet-season marshy haulage) and sustainable forest conservation',
    ],
    trap: 'Do NOT assume lush Tropical Rainforest vegetation means deep, permanently rich soil! Once forest canopy is cleared, heavy > 2,000 mm rain LEACHES soluble nitrates/calcium downward while intense heat oxidizes humus — leaving acidic, infertile red LATERITIC (ferralsol) soil within 2–3 years!',
    parts: [
      {
        title: 'Major Soil Zones of Nigeria & Soil Fertility Challenges',
        idea: 'Soil type in Nigeria reflects parent rock, relief, and the balance between <b>rainfall leaching</b> and <b>evaporation</b>. Understanding each belt explains why tubers/tree crops thrive in the South while grains/legumes dominate the North.',
        rules: [
          '<b>1. Hydromorphic & Alluvial Soils (Azonal):</b> Found along coastal creeks, the Niger Delta, river floodplains (Niger, Benue, Cross, Hadejia Fadamas), and Lake Chad shore — waterlogged or seasonally flooded silt/clay rich in fresh alluvium; prized for <b>swamp rice, dry-season fadama vegetables, sugarcane, and raffia</b>.',
          '<b>2. Rainforest Ferralsols / Red-Yellow Lateritic Soils (South):</b> Deeply chemically weathered under hot, wet (> 1,500 mm) conditions; heavy <b>leaching</b> washes soluble K⁺, Ca²⁺, Mg²⁺, NO₃⁻ below root reach, leaving acidic sesquioxides of iron and aluminium (Fe₂O₃, Al₂O₃). Fertile only while intact forest litter recycles humus; best suited to deep-rooted <b>tree crops (oil palm, cocoa, rubber, kola)</b> and cassava.',
          '<b>3. Ferruginous Tropical Soils (Guinea & Sudan Savanna):</b> Formed over Basement Complex rocks under alternating wet/dry seasons; less leached than ferralsols, sandy-loam top over iron-pan/clay subsoil (hardens into <b>lateritic cuirasse</b> if eroded); supports <b>yam, guinea corn, maize, groundnut, and cotton</b>.',
          '<b>4. Semi-Arid Brown / Regosol Soils (Sahel NE & Sokoto/Borno):</b> Loose wind-blown sandy soils low in organic humus due to sparse grass, but rich in unleached mineral salts; productive for <b>millet, cowpea, gum arabic</b>, and irrigated wheat when watered.',
        ],
        ex: {
          q: 'Why does a newly cleared Tropical Rainforest plot in Edo or Cross River give bumper maize harvests in Year 1 but suffer a sharp collapse in yield by Year 3 without fertilizer or tree cover?',
          steps: [
            ['Closed nutrient cycle broken', 'In intact rainforest, rapid leaf-litter decay in the top few centimetres feeds roots directly before nutrients wash away.'],
            ['Leaching + humus oxidation', 'Removing canopy exposes bare soil to > 2,000 mm torrential rain that leaches soluble nitrates/bases deep underground and intense sunlight that oxidizes humus, leaving acidic iron/aluminium-rich laterite.'],
          ],
        },
        tryit: {
          q: 'Seasonally flooded alluvial valley-bottom soils ("fadama" lands) along Rivers Sokoto, Hadejia, Niger, and Benue are especially valuable in Northern Nigeria for:',
          o: [
            'Swamp rice and dry-season irrigated market gardening (tomatoes, onions, peppers, sugarcane)',
            'Deep-sea offshore crude oil drilling',
            'Saltwater red mangrove lumbering',
            'Sub-zero alpine glacier skiing',
          ],
          a: 0,
          h: 'Fadama floodplains retain moisture and fresh silt right through the dry Harmattan months.',
          e: 'Alluvial/hydromorphic fadama soils retain high moisture and silt nutrients, supporting wet-season rice and lucrative dry-season vegetable/sugarcane farming.',
        },
      },
      {
        title: 'Lumbering, Economic Hardwoods & Forest Conservation in Nigeria',
        idea: 'Commercial <b>lumbering</b> in Nigeria is concentrated in the Southern <b>High Rainforest and Freshwater Swamp belts</b> (Edo, Delta, Ondo, Ogun, Osun, Cross River), centred on sawmill/plywood hubs like <b>Sapele, Benin City, Ondo, Ijebu-Ode, and Calabar</b>.',
        rules: [
          '<b>Major Economic Timber Trees:</b> <b>Iroko</b> (<i>Milicia excelsa</i>), <b>Mahogany</b> (<i>Khaya ivorensis</i>), <b>Obeche</b> (<i>Triplochiton scleroxylon</i>), <b>Sapele wood</b>, <b>Afara</b>, <b>Mansonia</b>, <b>Abura</b>, and <b>Ebony</b> — plus exotic fast-growing <b>Teak</b> and <b>Gmelina</b> (for pulp/paper at Iwopin/Jebba/Oku-Iboku) in forest reserves.',
          '<b>Why Tropical Rainforest Lumbering Is Difficult Compared to Temperate Coniferous Forests:</b> (1) <b>Non-pure (heterogeneous) stands</b> — valuable species grow scattered singly rather than in pure single-species stands; (2) Massive <b>buttress roots</b> force fellers to build platforms 3–4 m high; (3) Tangled woody <b>lianas/creepers</b> prevent felled trees from falling cleanly; (4) Heavy non-floating hardwood logs + muddy, waterlogged forest tracks in the rainy season.',
          '<b>Forest Conservation Measures:</b> Gazetting <b>Forest Reserves & National Parks</b> (Okomu, Cross River), selective felling of mature girths only, mandatory <b>afforestation / reforestation</b> ("fell one, plant two" / Taungya agroforestry), forest guards against illegal chainsaw poaching, and clean cooking gas/kerosene to cut fuelwood deforestation.',
        ],
        ex: {
          q: 'Contrast commercial lumbering in Nigeria’s Tropical Rainforest (e.g. Benin/Sapele) with coniferous softwood lumbering in Canada or Sweden on TWO operational factors.',
          steps: [
            ['Species purity', 'Canadian/Swedish boreal forests grow in pure stands of 1–3 softwood species (spruce, pine, fir) enabling mechanized clear-cutting, whereas Nigerian rainforests have hundreds of mixed species per hectare so loggers must hunt far apart for single Mahogany or Iroko trees.'],
            ['Ground & log transport', 'Winter snow/ice in Canada creates firm skidding surfaces and spring snowmelt floats light softwood logs downstream, whereas heavy rains in Southern Nigeria turn tracks into mud and dense hardwoods often sink unless lashed to lighter logs/barges.'],
          ],
        },
        tryit: {
          q: 'Which town on the Ethiope/Benin River system became West Africa’s most famous historic sawmill, veneer, and plywood manufacturing centre?',
          o: [
            'Sapele (Delta State)',
            'Katsina (Katsina State)',
            'Maiduguri (Borno State)',
            'Birnin Kebbi (Kebbi State)',
          ],
          a: 0,
          h: 'Located on navigable creeks feeding Benin River right inside the Edo–Delta rainforest belt.',
          e: 'Sapele (alongside Benin City, Ondo, and Calabar) grew around navigable creeks and rich Edo–Delta rainforest timber into a premier African plywood and sawmill centre.',
        },
      },
    ],
    qs: [
      {
        l: 1,
        dx: 1,
        q: 'The downward washing of soluble plant nutrients (nitrates, potassium, calcium) out of the upper topsoil horizon by heavy percolating rainwater is called:',
        o: [
          'Leaching',
          'Capillarity (salinization)',
          'Exfoliation',
          'Longshore drift',
        ],
        a: 0,
        e: 'Leaching is the eluviation/removal of water-soluble mineral bases downward beyond crop roots by heavy rainfall percolation, typical of southern Nigerian ferralsols.',
      },
      {
        l: 2,
        q: 'Which group consists ENTIRELY of indigenous tropical hardwood timber trees exploited in Southern Nigeria’s rainforest belt?',
        o: [
          'Iroko, Mahogany, Obeche, Sapele wood, and Mansonia',
          'Douglas Fir, Sitka Spruce, Scots Pine, and Larch',
          'Baobab, Date Palm, Gum Arabic Acacia, and Cactus',
          'Spear grass, Elephant grass, Water hyacinth, and Spirogyra',
        ],
        a: 0,
        e: 'Iroko, Mahogany, Obeche, Sapele, Afara, and Mansonia are prized tropical hardwoods of the Nigerian High Forest.',
      },
      {
        l: 3,
        q: 'Why is mechanized timber extraction more expensive per cubic metre in Nigeria’s Tropical Rainforest than in temperate coniferous forests?',
        o: [
          'Valuable timber species occur scattered in heterogeneous stands with huge buttress roots, tangled lianas, and muddy wet-season haulage roads',
          'Nigerian rainforests contain only a single tree species spaced in straight planted rows',
          'Frozen winter snow covers Edo and Cross River forests for five months each year',
          'Rainforest trees reach a maximum height of only 1.5 metres',
        ],
        a: 0,
        e: 'Mixed species dispersion, buttress roots, dense lianas, heavy non-buoyant logs, and swampy wet-season ground raise tropical logging costs.',
      },
      {
        l: 3,
        q: 'Agroforestry ("Taungya" system) practised in Nigerian forest reserves helps conserve timber resources by:',
        o: [
          'Allowing farmers to cultivate arable food crops between rows of newly planted tree seedlings until the forest canopy closes',
          'Clear-felling and burning all tree seedlings permanently for cattle ranching',
          'Replacing every forest reserve with open-cast limestone quarries',
          'Dumping industrial crude oil onto degraded forest soils',
        ],
        a: 0,
        e: 'In the Taungya agroforestry system, farmers tend food crops alongside young timber seedlings (Teak, Gmelina, Terminalia), weeding the trees free of charge until canopy closure.',
      },
      {
        l: 4,
        q: 'Ferruginous tropical soils of the Nigerian Guinea and Sudan Savanna belts risk becoming unploughable when stripped of vegetation mainly because:',
        o: [
          'Iron-rich sesquioxide subsoils bake irreversibly on exposure to sun and air into hard lateritic ironstone crusts (cuirasse/hardpan)',
          'Permafrost ice wedges freeze the topsoil to −30 °C',
          'Tidal Atlantic seawater floods Kaduna and Bauchi daily',
          'Volcanic lava erupts annually from every savanna valley',
        ],
        a: 0,
        e: 'Erosion of sandy topsoil exposes iron-oxide-rich horizons that dehydrate and indurate under intense dry-season sun into rock-hard lateritic hardpan.',
      },
      {
        l: 5,
        q: 'Fast-growing exotic plantations of Gmelina arborea and Pinus species were established in Nigerian states such as Ogun, Kwara, and Akwa Ibom primarily to supply raw material for:',
        o: [
          'Pulp and paper mills (such as Iwopin, Jebba, and Oku-Iboku)',
          'Iron-ore blast furnaces at Ajaokuta',
          'Liquefied natural gas trains at Bonny Island',
          'Phosphate fertilizer blending in Sokoto',
        ],
        a: 0,
        e: 'Gmelina and pine yield uniform short/long wood fibres suited for pulp, newsprint, and packaging paper mills (Jebba, Oku-Iboku, Iwopin).',
      },
    ],
  },

  {
    id: 'gg-nig-agriculture',
    num: 24,
    name: 'Agriculture, Cash Crops, Irrigation & Pastoralism in Nigeria',
    sec: 'Regional Geography of Nigeria & Africa',
    boss: 'Nigerian Agro-Belt Planner',
    goals: [
      'Contrast peasant subsistence/bush-fallowing systems with commercial plantation, mechanized arable, irrigated fadama, and nomadic/ranching pastoral systems in Nigeria',
      'Map Nigeria’s major cash & food crop belts accurately: Cocoa (SW), Oil Palm (SE/South-South), Rubber (Edo/Delta/Cross River), Groundnut & Cotton (North), Yam/Cassava/Rice (Middle Belt & South), Millet/Sorghum (North)',
      'Locate Nigeria’s major River Basin irrigation projects (Bakolori on Sokoto-Rima, Kano River / Tiga Dam, South Chad Irrigation, Lower Benue / Upper Niger) and explain why Northern Nigeria needs irrigation',
      'Explain why over 85% of Nigeria’s cattle, sheep, and goats are reared in the Sudan/Sahel North and high plateaus rather than the humid forested South',
    ],
    trap: 'COCOA thrives on well-drained, slightly acidic heavy CLAY-LOAM basement soils of the South-West (Ondo, Osun, Oyo, Ogun, Ekiti, plus Ikom in Cross River), whereas OIL PALM tolerates the more heavily leached acidic sandy ferralsols of the South-East/South-South!',
    parts: [
      {
        title: 'Farming Systems & Crop Ecological Belts of Nigeria',
        idea: 'Agriculture employs the largest share of Nigeria’s rural labour force, Supplies staple food, feeds agro-allied factories (textiles, breweries, flour, soap, tyres), and earns non-oil foreign exchange. Every crop maps directly onto Nigeria’s rainfall and soil gradient!',
        rules: [
          '<b>Tree Cash Crops of the Forest Belt (1,250–2,500 mm):</b> (1) <b>Cocoa</b> — needs 1,250–2,000 mm rain, shade for young seedlings, dry sunny Oct–Jan Harmattan spell for pod drying, and rich well-drained <b>clay-loam</b> over crystalline rocks → <b>Ondo, Osun, Oyo, Ogun, Ekiti</b> (+ <b>Ikom</b> in Cross River); (2) <b>Oil Palm</b> — > 1,500 mm rain, tolerates acidic sandy ferralsols → <b>Imo, Abia, Anambra, Akwa Ibom, Rivers, Edo, Cross River</b>; (3) <b>Para Rubber</b> — > 2,000 mm deep well-drained soils → <b>Edo, Delta (Sapele/Benin), Ogun, Cross River, Akwa Ibom</b>; (4) <b>Kola nut</b> — Ogun (Shagamu), Osun, Oyo.',
          '<b>Root & Tuber Belt (South & Middle Belt "Food Basket"):</b> <b>Yam</b> (Benue, Taraba, Nasarawa, Niger, Kogi, Oyo — Benue is the "Food Basket of the Nation"), <b>Cassava</b> (all southern & Middle Belt states; Nigeria is the world’s #1 producer), <b>Cocoyam & Plantain</b>.',
          '<b>Savanna Cash & Grain Crops (North, 500–1,200 mm + Abundant Sunshine):</b> (1) <b>Groundnut</b> — light sandy-loam soils (easy peg penetration & harvesting) + 500–1,000 mm rain + dry sunny harvest → <b>Kano, Katsina, Jigawa, Sokoto, Zamfara, Borno</b>; (2) <b>Cotton</b> — moisture-retentive black clay-loam ("cotton soil") + 750–1,250 mm rain + sunny boll-ripening season → <b>Kaduna (Zaria/Funtua), Katsina, Gusau, Gombe</b>; (3) <b>Cereals</b> — <b>Millet & Cowpea</b> (drought-hardy far North), <b>Guinea Corn / Sorghum & Maize</b> (Sudan/Guinea Savanna), <b>Swamp/Irrigated Rice</b> (Kebbi, Niger, Ebonyi/Abakaliki, Benue, Kano, Taraba).',
        ],
        ex: {
          q: 'Give three geographical reasons why Ondo, Osun, and Oyo States became Nigeria’s premier Cocoa Belt rather than Imo/Rivers (further SE) or Kano (in the North).',
          steps: [
            ['Soil texture & nutrients', 'Weathering of Pre-Cambrian granite/gneiss in the Western Uplands produces deep, moisture-retentive, nutrient-rich clay-loam ("cocoa soil"), unlike the heavily leached acidic sands of SE Nigeria.'],
            ['Balanced rainfall + dry harvest window', '1,250–1,800 mm bimodal rainfall supports pod growth, while a distinct 3-month dry season reduces black-pod fungal disease and allows open-sun fermentation/drying of cocoa beans (unlike > 3,000 mm coastal Rivers; Kano at ~700 mm is far too dry).'],
          ],
        },
        tryit: {
          q: 'Why do light, loose sandy-loam soils in Kano, Katsina, and Jigawa favour commercial GROUNDNUT cultivation over heavy sticky clay soils?',
          o: [
            'Fertilized groundnut pegs (gynophores) penetrate loose sandy soil easily to form underground pods, and mature pods can be lifted cleanly at harvest without breaking',
            'Groundnut pods grow 10 metres high in the air on thorny branches',
            'Groundnut requires 3,500 mm of year-round tidal saltwater flooding',
            'Heavy clay soils dissolve groundnut shells into limestone',
          ],
          a: 0,
          h: 'Remember how groundnut flowers bend down and push their pegs underground to form pods.',
          e: 'Loose, friable sandy-loam allows fertilized pegs to burrow into the soil easily and lets farmers uproot pods cleanly during the dry harvest without pod loss.',
        },
      },
      {
        title: 'Large-Scale Irrigation Projects & Pastoral Cattle Rearing',
        idea: 'Unreliable single-peak rainfall (3–5 wet months), recurrent Sahel droughts, and rapid population growth drove Nigeria to establish <b>River Basin Development Authorities (RBDAs)</b> for dry-season irrigation, while <b>tsetse-free</b> savannas concentrate livestock.',
        rules: [
          '<b>Major Irrigation Schemes in Nigeria:</b> (1) <b>Kano River Project</b> (fed by <b>Tiga Dam</b> & Challawa Gorge Dam in Kano State — wheat, rice, tomatoes); (2) <b>Bakolori & Talata Mafara Project</b> (on <b>River Sokoto</b> in Zamfara/Sokoto States); (3) <b>South Chad Irrigation Project</b> (New Marte, Borno — severely impacted by Lake Chad shrinkage); (4) <b>Hadejia–Jama’are Valley Project</b> (Jigawa/Yobe); (5) <b>Bacita & Numan Sugar Estates</b> (irrigated from River Niger in Kwara & River Benue/Gongola in Adamawa).',
          '<b>Problems of Irrigation in Nigeria:</b> High dam/canal capital cost, reservoir siltation, <b>soil salinization</b> (capillary salt crusting under high evaporation) and waterlogging, spread of water-borne diseases (<b>bilharzia/schistosomiasis</b> & malaria), and farmer displacement.',
          '<b>Cattle Rearing (Pastoralism) in Nigeria:</b> Concentrated in <b>Sudan/Sahel Savanna</b> (Sokoto, Kano, Katsina, Borno, Bauchi, Adamawa) and <b>Mambilla/Jos/Obudu Plateaus</b> (breeds: White Fulani/Bunaji, Sokoto Gudali, Red Bororo; humpless <b>Muturu & N’Dama</b> in the South are trypanotolerant). Humid Southern forests have few Zebu cattle because high humidity breeds the <b>tsetse fly (<i>Glossina</i>)</b> transmitting deadly <b>trypanosomiasis (nagana)</b> and dense forest lacks open grazing grass.',
        ],
        ex: {
          q: 'Explain TWO reasons why Fulani pastoralists practise seasonal southward transhumance during November–April and TWO modern solutions to farmer–herder resource conflicts.',
          steps: [
            ['Dry-season push in the North', 'Between November and April, surface streams dry up and savanna grasses wither/burn in the Sudan–Sahel zone, forcing herds southward toward perennial Niger–Benue and Guinea Savanna river pastures.'],
            ['Modern sustainable solutions', 'Establishing irrigated grazing reserves/ranches with boreholes and planted fodder (stylosanthes/napier grass), veterinary tsetse control, feedlots, and abattoir cold-chain rail transport to southern meat markets.'],
          ],
        },
        tryit: {
          q: 'What is the single most decisive biological factor restricting large-scale Zebu cattle rearing in the humid Tropical Rainforest belt of Southern Nigeria?',
          o: [
            'Infestation by the tsetse fly, which transmits lethal animal trypanosomiasis (nagana), combined with scarce natural pasture grass beneath dense forest canopy',
            'Temperatures dropping below −10 °C every night in Southern Nigeria',
            'Total absence of drinking water or rivers anywhere south of Lokoja',
            'Zero urban consumer demand for beef or milk in Lagos, Ibadan, and Port Harcourt',
          ],
          a: 0,
          h: 'Southern cities are actually the biggest beef markets, yet Zebu herds cannot survive humid forest vectors.',
          e: 'Shady, humid southern forests harbour tsetse flies carrying trypanosomes fatal to humped Zebu breeds (though dwarf humpless Muturu/N’Dama show tolerance).',
        },
      },
    ],
    qs: [
      {
        l: 1,
        dx: 1,
        q: 'Which Nigerian irrigation project is supplied with water stored behind the Tiga Dam?',
        o: [
          'Kano River Irrigation Project (Kano State)',
          'Bakolori Irrigation Project (Zamfara State)',
          'Cross River Basin Scheme (Calabar)',
          'Ogun–Osun Basin Scheme (Abeokuta)',
        ],
        a: 0,
        e: 'Tiga Dam (built across River Kano, a tributary of Hadejia) supplies water to the Kano River Irrigation Project at Kadawa/Kura for wheat, rice, and tomatoes.',
      },
      {
        l: 2,
        q: 'Match each Nigerian cash crop accurately with its leading geographical production zone:',
        o: [
          'Cocoa — South-West (Ondo/Osun); Oil Palm — South-East/South-South; Groundnut & Cotton — North (Kano/Kaduna/Katsina)',
          'Cocoa — Borno Sahel; Oil Palm — Sokoto Plains; Groundnut — Brass Mangrove Creek',
          'Rubber — Katsina; Millet — Bayelsa; Cocoa — Yobe',
          'Cotton — Lagos Lagoon; Oil Palm — Lake Chad; Groundnut — Bonny Island',
        ],
        a: 0,
        e: 'Cocoa centres on SW clay-loams (Ondo, Osun, Oyo), Oil Palm on humid SE/SS ferralsols, Rubber on Edo/Delta/Cross River, and Groundnut/Cotton on Northern savannas.',
      },
      {
        l: 3,
        q: 'Which two indigenous humpless dwarf cattle breeds can survive in humid tsetse-infested areas of Southern West Africa because they possess natural tolerance to trypanosomiasis?',
        o: [
          'Muturu and N’Dama',
          'White Fulani (Bunaji) and Red Bororo',
          'Sokoto Gudali and Shuwa Arab',
          'Friesian and Jersey',
        ],
        a: 0,
        e: 'West African Dwarf Shorthorn (Muturu) and N’Dama cattle are humpless breeds naturally trypanotolerant in humid forest/derived-savanna zones.',
      },
      {
        l: 3,
        q: 'Bacita (Kwara State) and Numan/Savannah (Adamawa State) are famous in Nigerian agricultural geography for large-scale irrigated plantations and mills producing:',
        o: [
          'Sugarcane and refined sugar',
          'Merino wool and silk',
          'Mediterranean olives and grapes',
          'Gum arabic and dates',
        ],
        a: 0,
        e: 'Irrigated alluvial floodplains of the Niger at Bacita and the Benue–Gongola confluence at Numan host Nigeria’s flagship sugarcane estates and sugar refineries.',
      },
      {
        l: 4,
        q: 'In semi-arid irrigated schemes where evaporation is intense and field drainage is poor, capillary rise of groundwater leaves a white toxic crust on the topsoil known as:',
        o: [
          'Soil salinization (alkalinization)',
          'Podzolization',
          'Carbonation',
          'Frost heaving',
        ],
        a: 0,
        e: 'High potential evaporation draws dissolved sodium/calcium salts to the surface by capillarity, causing soil salinization unless flushed by subsurface drainage.',
      },
      {
        l: 5,
        q: 'Why did traditional bush fallowing (rotational shifting cultivation), once sustainable across rural Nigeria, break down into soil exhaustion in densely populated districts?',
        o: [
          'Rapid population growth and land pressure shortened fallow periods from 10–15 years down to 1–2 years, preventing natural humus and nutrient recovery',
          'Annual rainfall across Nigeria doubled to 8,000 mm everywhere',
          'Leguminous cover crops sterilized all agricultural tractors',
          'Farmers stopped harvesting crops and left fields fallow for 50 years',
        ],
        a: 0,
        e: 'Bush fallowing relies on long 8–15 year bush rest to rebuild soil organic matter; high rural population density (e.g. Igboland) compressed fallow cycles below recovery thresholds.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SS3 SECOND TERM (Topics 25 – 27)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'gg-nig-minerals-power',
    num: 25,
    name: 'Mineral Resources, Mining & Power Generation in Nigeria',
    sec: 'Regional Geography of Nigeria & Africa',
    boss: 'Energy & Mineral Resource Geologist',
    goals: [
      'Map Nigeria’s major fuel, metallic, and industrial minerals to their exact geological formations and mining towns: Petroleum & Gas (Niger Delta), Coal (Enugu/Okaba), Tin & Columbite (Jos), Iron Ore (Itakpe), Limestone (Ewekoro, Ibese, Obajana, Nkalagu, Sokoto, Ashaka, Calabar), Lead-Zinc (Abakaliki), Gold (Ilesha/Zamfara)',
      'Trace Nigerian crude oil from Oloibiri (1956) through upstream extraction, pipeline networks, refineries (Port Harcourt, Warri, Kaduna, Lekki/Dangote), and Bonny LNG export',
      'Compare Hydro-Electric Power stations (Kainji, Jebba, Shiroro, Zungeru, Dadin Kowa, Kashimbila) with Thermal Gas-Fired stations (Egbin, Afam, Sapele, Ughelli, Geregu, Olorunsogo)',
      'Evaluate environmental impacts of mining (Niger Delta oil spills/gas flaring, Jos open-cast tin mining ponds, Enugu coal mine acid drainage) and remediation',
    ],
    trap: 'PETROLEUM, NATURAL GAS, COAL, and LIMESTONE occur strictly in SEDIMENTARY basins (Niger Delta, Anambra/Benue Trough, Sokoto/Dahomey Basins), whereas TIN, COLUMBITE, GOLD, and IRON ORE occur in Pre-Cambrian BASEMENT COMPLEX / Younger Granite rocks (Jos, Itakpe, Ilesha)!',
    parts: [
      {
        title: 'Geological Distribution & Mining Methods of Nigerian Minerals',
        idea: 'Nigeria’s mineral map obeys rock geology: <b>fossil fuels and limestone</b> formed in marine/deltaic <b>sedimentary basins</b>, while <b>metallic ores</b> crystallized in <b>igneous/metamorphic Basement Complex and Younger Granite</b> intrusions.',
        rules: [
          '<b>Petroleum & Natural Gas (Niger Delta & Offshore Continental Shelf):</b> First discovered in commercial quantity by Shell-BP at <b>Oloibiri (Bayelsa State) in 1956</b> (first export 1958). Trapped in Tertiary sandstone anticlines/faults beneath impermeable shale caps across Rivers, Bayelsa, Delta, Akwa Ibom, Edo, Ondo, Imo, Abia, and Lagos offshore. Nigerian <b>Bonny Light</b> crude is prized globally because it is <b>"sweet" (very low sulphur content)</b>, reducing corrosive acid-rain refining costs! Gas liquefied at <b>Bonny Island (NLNG)</b>.',
          '<b>Coal (Sub-bituminous, Cretaceous Sedimentary):</b> Mined around <b>Enugu</b> (Udi Escarpment — Onyeama, Okpara mines via horizontal <b>adit/tunnel</b> mining) and <b>Okaba/Orukpa</b> (Kogi/Benue via open-cast); historically powered railways, Nkalagu cement, and Oji River thermal plant.',
          '<b>Tin (Cassiterite) & Columbite (Jos Plateau Younger Granites):</b> Extracted by <b>open-cast (strip) dragline/gravel-pump mining</b> of alluvial tin-bearing gravels around Jos, Bukuru, Ropp, and Barakin Ladi; smelted at <b>Makeri (Jos)</b>; columbite yields niobium for jet-engine heat-resistant alloys.',
          '<b>Iron Ore & Limestone:</b> <b>Iron ore</b> open-cast mined at <b>Itakpe (Kogi State)</b> to feed <b>Ajaokuta</b> and <b>Aladja (Delta)</b> steel complexes via the Itakpe–Ajaokuta–Warri rail line; <b>Limestone</b> quarried across sedimentary belts for Portland cement at <b>Ewekoro & Shagamu/Ibese</b> (Ogun), <b>Obajana</b> (Kogi), <b>Sokoto/Kalambaina</b>, <b>Ashaka</b> (Gombe), <b>Gboko</b> (Benue), <b>Nkalagu</b> (Ebonyi), and <b>Mfamosing/Calabar</b>.',
        ],
        ex: {
          q: 'Explain (a) why Nigeria’s "Bonny Light" crude oil commands a price premium on world markets and (b) two environmental hazards of open-cast tin mining on the Jos Plateau.',
          steps: [
            ['(a) Low-sulphur ("sweet") light crude', 'Bonny Light has high API gravity (high petrol/diesel yield) and very low sulphur content (< 0.2%), making it cheaper to refine and cleaner-burning under strict anti-pollution laws.'],
            ['(b) Jos open-cast tin mining hazards', 'Draglines strip topsoil leaving deep abandoned water-filled mining pits/ponds (drowning & mosquito hazards), heaps of sterile overburden tailings, accelerated gully erosion, and loss of arable farmland.'],
          ],
        },
        tryit: {
          q: 'Where and in what year was crude oil FIRST discovered in commercial quantities in Nigeria?',
          o: [
            'Oloibiri (present-day Bayelsa State) in 1956',
            'Ewekoro (Ogun State) in 1914',
            'Enugu (Udi Hills) in 1909',
            'Itakpe (Kogi State) in 1991',
          ],
          a: 0,
          h: 'Drilled in the central Niger Delta two years before first oil exports in 1958.',
          e: 'Commercial crude oil was first struck at Oloibiri (Ogbia LGA, Bayelsa State) in 1956, launching exports from Port Harcourt/Bonny in 1958.',
        },
      },
      {
        title: 'Hydro-Electric Power (HEP) vs Thermal Power Generation in Nigeria',
        idea: 'Industrialization and urban growth depend on reliable megawatts on the <b>National Grid</b>, generated from two main sources in Nigeria: falling water at <b>Hydro-Electric Power (HEP) dams</b> and natural-gas combustion at <b>Thermal Power Stations</b>.',
        rules: [
          '<b>Major Hydro-Electric Power (HEP) Stations:</b> <b>Kainji Dam</b> (River Niger, Niger State — built 1968, forms Kainji Lake), <b>Jebba Dam</b> (River Niger), <b>Shiroro Dam</b> (River Kaduna, Niger State), <b>Zungeru Dam</b> (River Kaduna, 700 MW), <b>Dadin Kowa</b> (River Gongola, Gombe), and <b>Kashimbila</b> (Taraba). Requires steep basement gorge/rapids, large perennial water volume, and impermeable rock foundation.',
          '<b>Major Thermal (Natural Gas) Power Stations:</b> Account for > 70% of Nigeria’s installed capacity! <b>Egbin (Ikorodu, Lagos — largest thermal plant in West Africa)</b>, <b>Afam</b> (Rivers), <b>Sapele & Ughelli/Delta</b> (Delta), <b>Geregu</b> (Ajaokuta, Kogi), <b>Olorunsogo/Papalanto</b> (Ogun), and <b>Omotosho</b> (Ondo).',
          '<b>Challenges of Power Supply in Nigeria:</b> Seasonal low water levels in Niger/Kaduna rivers during Harmattan dry months (plus upstream dam abstractions in Mali/Niger), gas-pipeline vandalism/shortages starving thermal turbines, ageing transmission grid transformers/line losses, and equipment vandalism.',
        ],
        ex: {
          q: 'State THREE multi-purpose economic benefits of the Kainji Dam project besides generating hydro-electricity.',
          steps: [
            ['Irrigation & flood control', 'Regulates downstream Niger flood peaks and supplies dry-season irrigation water to surrounding fadama/sugar estates (e.g. Bacita).'],
            ['Inland fishing & navigation', 'Kainji Lake supports a thriving commercial freshwater fishery, while submerging dangerous Bussa rapids improved local boat transport.'],
            ['Tourism & wildlife conservation', 'Anchored Borgu/Zugurma sectors into Kainji Lake National Park, attracting eco-tourists and researchers.'],
          ],
        },
        tryit: {
          q: 'Which power station at Ikorodu (Lagos State) is Nigeria’s flagship natural-gas-fired THERMAL generating plant, whereas Shiroro (Niger State) is a HYDRO-ELECTRIC station on River Kaduna?',
          o: [
            'Egbin Thermal Power Station',
            'Kainji Hydro Station',
            'Makeri Smelting Plant',
            'Tiga Irrigation Barrage',
          ],
          a: 0,
          h: 'Located on the Lagos Lagoon shore fed via the Escravos–Lagos gas pipeline.',
          e: 'Egbin Power Station (1,320 MW installed capacity) at Ikorodu, Lagos, is a major gas-fired thermal station, contrasting with Kainji, Jebba, Shiroro, and Zungeru HEP dams.',
        },
      },
    ],
    qs: [
      {
        l: 1,
        dx: 1,
        q: 'Which mineral pair is mined by open-cast methods from alluvial Younger Granite gravels on the Jos Plateau?',
        o: [
          'Tin (cassiterite) and Columbite',
          'Crude petroleum and Natural gas',
          'Bituminous coal and Lignite',
          'Rock salt and Potash',
        ],
        a: 0,
        e: 'Alluvial cassiterite (tin ore) and columbite weathered from Younger Granites are mined around Jos, Bukuru, and Barakin Ladi and smelted at Makeri.',
      },
      {
        l: 2,
        q: 'Iron ore mined at Itakpe in Kogi State was developed primarily as the domestic raw material for:',
        o: [
          'The Ajaokuta and Aladja (Delta) Iron and Steel Complexes',
          'The Bonny Liquefied Natural Gas (NLNG) Plant',
          'The Oku-Iboku Newsprint Mill',
          'The Ewekoro Portland Cement Factory',
        ],
        a: 0,
        e: 'Ferruginous quartzite iron ore at Itakpe (near Okene, Kogi State) feeds nearby Ajaokuta Steel Company and connects by standard-gauge rail to Aladja/Warri.',
      },
      {
        l: 2,
        q: 'Which group consists ENTIRELY of Hydro-Electric Power (HEP) stations in Nigeria?',
        o: [
          'Kainji, Jebba, Shiroro, and Zungeru',
          'Egbin, Afam, Sapele, and Geregu',
          'Oloibiri, Bonny, Eket, and Forcados',
          'Ewekoro, Obajana, Ibese, and Ashaka',
        ],
        a: 0,
        e: 'Kainji and Jebba sit on River Niger while Shiroro and Zungeru sit on River Kaduna; Egbin, Afam, Sapele, and Geregu are gas-fired thermal power stations.',
      },
      {
        l: 3,
        q: 'Why is there a government-owned crude oil refinery located far inland at Kaduna (~700 km from the Niger Delta oilfields)?',
        o: [
          'To serve the vast Northern Nigerian market directly via crude oil pumped northward through trunk pipelines from Warri/Escravos, reducing long road haulage of refined fuels',
          'Because Kaduna sits atop Africa’s deepest offshore oil reservoir',
          'Because ocean supertankers dock daily on River Kaduna',
          'Because petroleum can only be refined at altitudes above 600 m',
        ],
        a: 0,
        e: 'Kaduna Refinery is a market-oriented inland refinery supplied by crude-oil pipeline from the Niger Delta to distribute petrol, diesel, kerosene, asphalt, and lubricants across Northern states.',
      },
      {
        l: 4,
        q: 'Which geological rule correctly explains why petroleum and limestone are NEVER found inside the Pre-Cambrian granite inselbergs of Ondo or Kano?',
        o: [
          'Petroleum and limestone form from marine organic remains compressed in stratified SEDIMENTARY basins, whereas intense igneous heat/metamorphism destroys organic hydrocarbons in crystalline Basement rocks',
          'Granite inselbergs dissolve instantly in rainwater before oil can form',
          'Sedimentary basins exist only above 2,000 m altitude in Nigeria',
          'Limestone is a volcanic lava extruded exclusively on ocean ridges',
        ],
        a: 0,
        e: 'Hydrocarbons and biogenic limestone accumulate in marine/deltaic sedimentary strata (Niger Delta, Dahomey, Sokoto, Benue/Chad basins), never in plutonic granites.',
      },
      {
        l: 5,
        q: 'Why does electricity output from Nigeria’s Kainji and Jebba HEP stations drop sharply between February and May each year?',
        o: [
          'Prolonged dry season across the West African savanna + upstream water abstraction along the Niger basin reduce reservoir inflow ("black flood" / "white flood" trough)',
          'Kainji Lake freezes into solid glacier ice from February to May',
          'Atlantic Ocean tides reverse River Niger back into Guinea',
          'Turbines cannot spin when air temperature exceeds 25 °C',
        ],
        a: 0,
        e: 'Late dry-season evaporation and low tributary discharge (compounded by upstream dams/irrigation in Guinea, Mali, and Niger) lower reservoir head at Kainji and Jebba.',
      },
    ],
  },

  {
    id: 'gg-nig-pop-industry',
    num: 26,
    name: 'Population Distribution & Industrial Zones in Nigeria',
    sec: 'Regional Geography of Nigeria & Africa',
    boss: 'Nigerian Economic Geographer',
    goals: [
      'Identify and explain Nigeria’s three classic high-density population heartlands (South-West Yorubaland/Lagos, South-East Igboland, and North-Central Kano–Katsina–Sokoto close-settled zone) vs the sparsely populated Middle Belt, Borgu, and Niger Delta swamps',
      'Explain the historical and ecological mystery of why Nigeria’s Middle Belt has moderate/sparse population density despite adequate Guinea Savanna rainfall',
      'Map Nigeria’s four major industrial zones: Western (Lagos–Ota–Ibadan), South-East/South-South (Port Harcourt–Aba–Onitsha–Nnewi–Enugu), North-Central (Kano–Kaduna–Zaria–Jos), and Mid-West (Benin–Sapele–Warri)',
      'Contrast local craft/cottage industries (Akwete/Aso-Oke weaving, Bida brass/glass, Kano leather dyeing, Awka blacksmithing) with modern import-substitution and petrochemical industries',
    ],
    trap: 'The Nigerian MIDDLE BELT (Niger, Kwara-West/Borgu, Taraba, Benue fringes) is relatively SPARSELY populated NOT because of desert drought, but because of historical 18th–19th century slave-raiding depopulation PLUS tsetse-fly (sleeping sickness) and river-blindness (onchocerciasis) vectors!',
    parts: [
      {
        title: 'Population Distribution Pattern in Nigeria: High, Moderate & Sparse Zones',
        idea: 'Nigeria is Africa’s most populous nation (> 220 million people), yet its population is unevenly distributed into <b>three dense clusters (> 350–2,000+ persons/km²)</b> separated by a broad, comparatively <b>sparse Middle Belt</b> and coastal/arid margins.',
        rules: [
          '<b>Three High-Density Population Zones:</b> (1) <b>South-West Yorubaland & Lagos Conurbation</b> (Lagos, Ibadan, Abeokuta, Osogbo — historic Yoruba urbanism, cocoa wealth, Apapa/Lekki seaports, commercial & industrial magnet); (2) <b>South-East Igboland & Akwa Ibom</b> (Onitsha, Aba, Owerri, Awka, Uyo — historic defensive forest refuge, oil-palm economy, intense enterprise; severe rural land fragmentation & gully pressure); (3) <b>North-Central Hausa Close-Settled Zone</b> (<b>Kano, Katsina, Zaria, Sokoto</b> — fertile light-loam groundnut/grain soils, tsetse-free livestock, ancient Trans-Saharan & Emirate commercial stability, Tiga/Bakolori irrigation).',
          '<b>Sparsely Populated Zones (< 60 persons/km²):</b> (1) <b>The Middle Belt</b> (Borgu in Niger/Kwara, parts of Nasarawa, Taraba, northern Cross River) — depopulated historically by inter-tribal wars/slave raiding + infested by <b>tsetse flies (trypanosomiasis)</b> and <b>simulium blackflies (river blindness)</b> + rugged lateritic/basement outcrops; (2) <b>Mangrove Niger Delta & Coastal Swamps</b> — waterlogged creeks, scarce dry building land, saltwater intrusion; (3) <b>Extreme NE Lake Chad / Sambisa / Sahel</b> — semi-arid < 500 mm rainfall.',
        ],
        ex: {
          q: 'Why does the Kano Close-Settled Zone support one of rural West Africa’s highest population densities (> 500 persons/km²) even though annual rainfall is only ~800 mm?',
          steps: [
            ['Easy-to-cultivate fertile soils & tsetse-free health', 'Light, friable drift sandy-loam soils are easily worked with hoes/ox-ploughs and enriched continuously by manure from tsetse-free cattle, donkeys, sheep, and goats.'],
            ['Historic political security, irrigation & commerce', 'Centuries of walled Emirate security, fadama + Tiga/Kano River irrigation, groundnut/grain surpluses, and Kano’s role as Northern Nigeria’s premier rail, road, airport, and industrial hub sustain dense settlement.'],
          ],
        },
        tryit: {
          q: 'Which combination of factors best explains the comparatively LOW population density across large tracts of Nigeria’s Middle Belt (such as Borgu and parts of Niger and Taraba States)?',
          o: [
            'Historical slave-raiding depopulation combined with tsetse-fly (sleeping sickness) and blackfly (river blindness) infestation',
            'Mean annual rainfall of less than 50 mm and shifting Saharan sand dunes',
            'Year-round sub-zero permafrost covering the Niger–Benue trough',
            'Submergence beneath 500 metres of hypersaline Atlantic seawater',
          ],
          a: 0,
          h: 'Notice that the Middle Belt actually gets 1,000–1,400 mm of Guinea Savanna rain!',
          e: 'Despite good rainfall, historical slave-raiding emptied open Middle Belt savannas, allowing bush regrowth that bred tsetse flies and river-blindness vectors.',
        },
      },
      {
        title: 'Four Industrial Zones & Traditional Craft Industries of Nigeria',
        idea: 'Nigerian manufacturing clusters in <b>four regional industrial triangles</b> anchored by seaports, power grids, raw materials, and large urban markets, alongside vibrant <b>traditional cottage crafts</b> rooted in local minerals and fibres.',
        rules: [
          '<b>1. Western Industrial Zone (Largest — > 50% of national value-added!):</b> <b>Lagos (Ikeja, Apapa, Ilupeju, Isolo, Ikorodu, Lekki), Ota/Agbara, Ibadan, Abeokuta, Ewekoro/Shagamu</b> — foods/beverages, pharmaceuticals, textiles, cement, plastics, vehicle assembly, Dangote Refinery/petrochemicals, banking/IT.',
          '<b>2. South-East / South-South Zone:</b> <b>Port Harcourt (Trans-Amadi, Eleme, Onne), Aba, Onitsha, Nnewi, Enugu, Calabar</b> — oil refining, Eleme petrochemicals, NAFCON/Indorama fertilizer, Nnewi auto parts/cables, Aba footwear/garments/soap, Onitsha plastics/pharma.',
          '<b>3. North-Central Industrial Zone:</b> <b>Kano (Bompai, Sharada, Challawa), Kaduna, Zaria, Jos, Sokoto</b> — textiles/ginneries, leather tanning & footwear, groundnut/flour milling, Kaduna oil refinery & Peugeot assembly, Makeri tin smelting, Sokoto cement.',
          '<b>4. Mid-West Industrial Zone:</b> <b>Warri, Sapele, Benin City, Aladja</b> — Warri oil refinery/petrochemicals, Aladja steel, Sapele sawmills/plywood & rubber crepe, Benin breweries & palm-oil processing.',
          '<b>Traditional Craft Hubs:</b> <b>Bida</b> (brasswork & glass beads), <b>Kano & Sokoto</b> (leather tanning/dye pits), <b>Iseyin/Oyo & Okene & Akwete</b> (hand-woven Aso-Oke/Akwete cloth), <b>Awka</b> (blacksmithing), <b>Benin</b> (bronze & ebony carving), <b>Abuja/Suleja & Ilorin</b> (Ladi Kwali pottery).',
        ],
        ex: {
          q: 'Give FOUR geographical/economic reasons why the Lagos–Ota–Ibadan axis accounts for the highest concentration of manufacturing industries in Nigeria.',
          steps: [
            ['Premier seaports & international airport', 'Apapa, Tin Can Island, and Lekki Deep Sea Port allow direct import of industrial machinery and raw materials, plus Murtala Muhammed Airport.'],
            ['Largest high-income market & skilled labour', 'Over 25 million consumers in the Lagos–Ogun–Ibadan conurbation provide unmatched market demand plus abundant technical/managerial graduates.'],
            ['Energy & industrial estates', 'Escravos–Lagos natural gas pipeline + Egbin thermal power + planned industrial estates (Ikeja, Agbara, Ota, Lekki Free Zone) and financial HQ banks.'],
          ],
        },
        tryit: {
          q: 'Match the traditional Nigerian cottage craft centre accurately with its famous indigenous product:',
          o: [
            'Bida (Niger State) — Brasswork and glass beads; Akwete (Abia) & Iseyin (Oyo) — Hand-woven cloth',
            'Awka — Offshore oil rigs; Kano — Mangrove canoe carving',
            'Sapele — Camel-hide desert tents; Sokoto — Deep-sea trawler nets',
            'Bonny Island — Rock-salt mining; Maiduguri — Mahogany plywood',
          ],
          a: 0,
          h: 'Nupe artisans at Bida are renowned across West Africa for beaten brass trays and Masaga glass bangles.',
          e: 'Bida is famous for brasswork and glass beads, Kano/Sokoto for Moroccan leatherwork/indigo dyeing, Akwete/Iseyin for woven cloth, Benin for bronze/wood carving, and Suleja for pottery.',
        },
      },
    ],
    qs: [
      {
        l: 1,
        dx: 1,
        q: 'Which of the following is one of Nigeria’s three primary zones of HIGH population density?',
        o: [
          'South-East Igboland (Anambra, Imo, Abia) alongside SW Yorubaland and the Kano Close-Settled Zone',
          'The Borgu Game Reserve corridor of western Niger and Kwara States',
          'The saltwater mangrove swamps of Brass and Akassa',
          'The semi-arid Sambisa and Lake Chad borderlands',
        ],
        a: 0,
        e: 'Nigeria’s three classic high-density cores are SW Yorubaland/Lagos, SE Igboland/Akwa Ibom, and the North-Central Kano–Katsina–Sokoto close-settled belt.',
      },
      {
        l: 2,
        q: 'Which Nigerian industrial town in Anambra State is celebrated for indigenous private manufacturing of motorcycle/automobile spare parts, batteries, and electrical cables?',
        o: [
          'Nnewi',
          'Bida',
          'Badagry',
          'Argungu',
        ],
        a: 0,
        e: 'Nnewi ("the Taiwan/Japan of Africa") evolved from spare-parts trading into an indigenous hub for auto components, cables, lubricants, and vehicle assembly (Innoson).',
      },
      {
        l: 3,
        q: 'Severe rural over-population and land shortage in parts of Imo and Anambra States have directly contributed to which pair of socio-environmental consequences?',
        o: [
          'Extreme land fragmentation/shortened bush fallows accelerating Agulu–Nanka gully erosion, plus heavy youth out-migration to commercial cities across Nigeria',
          'Expansion of 20-year bush fallows and labor shortages from zero birth rates',
          'Formation of continental ice sheets and barchan sand dunes',
          'Abandonment of trade and universal switch to nomadic camel herding',
        ],
        a: 0,
        e: 'Rural densities > 800 persons/km² in soft sandstone scarplands led to tiny fragmented plots, over-cultivation, catastrophic gully erosion, and energetic commercial out-migration.',
      },
      {
        l: 3,
        q: 'Eleme and Onne (near Port Harcourt in Rivers State) specialize in which heavy industrial activities?',
        o: [
          'Petroleum refining, petrochemicals (plastics/olefins), nitrogenous fertilizer (urea), and oil-and-gas free-zone port logistics',
          'Tin smelting and columbite separation',
          'Sheep wool shearing and alpine cheese making',
          'Sub-bituminous underground coal mining',
        ],
        a: 0,
        e: 'Abundant Niger Delta crude oil and natural gas feed Port Harcourt refineries, Eleme Petrochemicals, Indorama urea fertilizer, and Onne Oil & Gas Free Zone.',
      },
      {
        l: 4,
        q: 'What is the MOST persistent infrastructural constraint raising production costs for manufacturing factories across all four Nigerian industrial zones?',
        o: [
          'Erratic public grid electricity forcing factories to run expensive captive diesel and gas generators',
          'Complete lack of working-age youth labour in Nigerian cities',
          'Absence of limestone, crude oil, or agricultural raw materials anywhere in Nigeria',
          'Freezing winter harbours blocking Apapa and Onne ports for half the year',
        ],
        a: 0,
        e: 'Unreliable national-grid power (plus high import cost of machinery/spares and port/road bottlenecks) forces manufacturers to self-generate power at steep cost.',
      },
      {
        l: 5,
        q: 'Why have dozens of manufacturing companies spilled outward from Lagos State across the border into Ota, Agbara, Ibese, and Shagamu in neighbouring Ogun State?',
        o: [
          'Industrial decentralization driven by cheaper spacious land, Ogun industrial estates/tax incentives, Escravos–Lagos gas pipeline access, and immediate proximity to Lagos ports and consumers',
          'Lagos State sank below sea level and closed Apapa seaport in 1980',
          'Ogun State sits in the Sahel Savanna where desert solar plants are free',
          'Federal law prohibits all factories within 100 km of the Atlantic coast',
        ],
        a: 0,
        e: 'Congestion and high land costs inside metropolitan Lagos pushed factories 20–50 km outward into Ogun’s Ota, Agbara, and Shagamu industrial corridors while retaining Lagos port/market access.',
      },
    ],
  },

  {
    id: 'gg-nig-trade-tourism',
    num: 27,
    name: 'Internal/External Trade, Seaports & Tourism in Nigeria',
    sec: 'Regional Geography of Nigeria & Africa',
    boss: 'Trade & Eco-Tourism Director',
    goals: [
      'Explain why internal (inter-regional North–South) trade in Nigeria is vigorous (ecological complementarity!) whereas intra-West African trade is modest',
      'List the exact commodities flowing SOUTHWARD from Northern Nigeria (cattle, onions, beans/cowpea, grains, tomatoes, hides) vs NORTHWARD from Southern Nigeria (kolanut, palm oil, garri/yam, timber, citrus/plantain, port imports/manufactures)',
      'Locate Nigeria’s major seaports (Apapa, Tin Can Island, Lekki Deep Sea Port, Warri/Koko/Sapele, Port Harcourt/Onne, Calabar) and international airports',
      'Map Nigeria’s major tourist centres (Yankari Game Reserve, Obudu Mountain Resort, Olumo Rock, Erin-Ijesha & Gurara Waterfalls, Ikogosi Warm Springs, Ogbunike Caves, Argungu Fishing Festival, Osun-Osogbo Grove) and economic benefits of tourism',
    ],
    trap: 'Internal North–South trade inside Nigeria thrives because North and South have DIFFERENT (COMPLEMENTARY) climatic & vegetation belts (savanna cattle/onions/beans vs forest kolanut/palm oil/timber), whereas external exports remain dangerously over-dependent on crude oil & LNG!',
    parts: [
      {
        title: 'Internal (Inter-Regional) & External Trade + Nigerian Seaports',
        idea: 'Nigeria’s 10° latitudinal span across rainforest and savanna creates strong <b>ecological complementarity</b>, driving daily North–South lorry and rail trade without customs borders or currency changes.',
        rules: [
          '<b>North → South Commodity Flow:</b> Live Zebu <b>cattle, sheep, goats</b>, <b>cowpeas (beans)</b>, <b>onions, tomatoes, peppers</b>, <b>guinea corn, millet, dry fish (Lake Chad/Kainji)</b>, groundnuts, and hides/skins.',
          '<b>South → North Commodity Flow:</b> <b>Kolanuts</b> (Ogun/Osun → Kano), <b>palm oil</b>, <b>sawn timber/plywood</b>, <b>cassava/garri, yams, plantains, pineapples/oranges</b>, plus Lagos/Port Harcourt <b>manufactured goods & imported machinery/spares</b>.',
          '<b>External Trade Profile:</b> <b>Exports</b> = Crude petroleum & Liquefied Natural Gas (> 80% of export earnings), urea fertilizer, cocoa beans, sesame seed, cashew nuts; <b>Imports</b> = Industrial machinery, vehicles, electronics, wheat, pharmaceuticals, and chemical inputs. Principal partners: <b>China, India, European Union (Spain, Netherlands, France), USA, ECOWAS</b>.',
          '<b>Nigerian Seaports (West → East):</b> (1) <b>Lagos Ports Complex (Apapa & Tin Can Island)</b> + <b>Lekki Deep Sea Port</b> (automated post-Panamax container & trans-shipment port, 16.5 m draught); (2) <b>Delta Ports</b> (Warri, Sapele, Koko, Burutu — shallow Escravos bar needs dredging); (3) <b>Rivers Ports</b> (Port Harcourt & deep-water <b>Onne</b> Oil/Gas terminal); (4) <b>Calabar Port</b> (Cross River estuary, EPZ/FTZ).',
        ],
        ex: {
          q: 'Why was the new Lekki Deep Sea Port constructed east of Lagos despite the existence of Apapa and Tin Can Island ports?',
          steps: [
            ['Relieve Apapa congestion & shallow draught limit', 'Apapa/Tin Can ports are hemmed in by dense city streets causing severe truck gridlock, and their ~11–13 m channels cannot berth giant post-Panamax mother container ships.'],
            ['Deep-water capacity & Lekki Free Zone synergy', 'Lekki Deep Sea Port offers a 16.5 m deep channel for 14,000+ TEU mega-vessels, automated cranes, and direct adjacency to Dangote Refinery/Fertilizer and Lekki Free Trade Zone.'],
          ],
        },
        tryit: {
          q: 'Which pair of agricultural commodities moves predominantly from SOUTHERN Nigeria to NORTHERN Nigeria in domestic inter-regional trade?',
          o: [
            'Kolanuts, palm oil, and sawn rainforest timber',
            'Zebu beef cattle, onions, and cowpeas (beans)',
            'Millet, gum arabic, and camel hides',
            'Irrigated wheat and Lake Chad smoked bande fish',
          ],
          a: 0,
          h: 'Pick forest tree products grown in Ogun/Osun/Edo/Imo and consumed widely across Northern cities.',
          e: 'Kolanuts, palm oil, timber, plantain, and citrus move northward from the Southern forest belt, while cattle, beans, onions, tomatoes, and grains move southward.',
        },
      },
      {
        title: 'Major Tourist Centres & Tourism Development in Nigeria',
        idea: '<b>Tourism</b> is an <b>invisible export</b> that generates foreign exchange, hospitality/aviation jobs, rural infrastructure, handicraft markets, and wildlife conservation without depleting minerals.',
        rules: [
          '<b>Flagship Eco-Tourism & Natural Wonders:</b> <b>Yankari Game Reserve & Wikki Warm Spring</b> (Bauchi State — elephants, baboons, hippos, crystal 31 °C spring); <b>Obudu Mountain Resort</b> (Cross River — temperate ranch, winding 22-bend road); <b>Ikogosi Warm & Cold Springs</b> (Ekiti — warm and cold springs meeting side-by-side!); <b>Olumo Rock</b> (Abeokuta, Ogun) & <b>Idanre Hills</b> (Ondo) & <b>Zuma Rock</b> (Niger/Abuja gateway); <b>Erin-Ijesha (Olumirin) Waterfall</b> (Osun), <b>Gurara Falls</b> (Niger), <b>Farin Ruwa Falls</b> (Nasarawa), <b>Assop Falls</b> (Plateau); <b>Ogbunike Limestone Caves</b> (Anambra).',
          '<b>Cultural & UNESCO Heritage Sites:</b> <b>Sukur Cultural Landscape</b> (Adamawa — Nigeria’s first UNESCO World Heritage Site) & <b>Osun-Osogbo Sacred Grove</b> (Osun — UNESCO site); <b>Argungu International Fishing Festival</b> (Kebbi State); <b>Kano Dye Pits & Emir’s Palace Durbar</b>; <b>Benin National Museum/Moat</b>; <b>Badagry Heritage Route</b> & <b>Lekki Conservation Centre</b> (Lagos).',
          '<b>Problems Facing Tourism in Nigeria:</b> Poor feeder roads/power to remote resorts, insecurity perceptions, weak facility maintenance, poaching in game reserves, and low international marketing.',
        ],
        ex: {
          q: 'Match four famous Nigerian tourist attractions to their exact states: (a) Wikki Warm Spring, (b) Ikogosi Warm & Cold Springs, (c) Argungu Fishing Festival, (d) Ogbunike Caves.',
          steps: [
            ['(a) & (b) Thermal springs', 'Wikki Warm Spring is inside Yankari Game Reserve in Bauchi State; Ikogosi Warm & Cold Springs confluence is in Ekiti State.'],
            ['(c) & (d) Cultural & karst landmarks', 'Argungu International Fishing Festival is held on River Matan Fada in Kebbi State; Ogbunike Caves are karst solution caves in Anambra State.'],
          ],
        },
        tryit: {
          q: 'In which state are Yankari Game Reserve and the famous 31 °C Wikki Warm Spring located?',
          o: [
            'Bauchi State',
            'Lagos State',
            'Imo State',
            'Bayelsa State',
          ],
          a: 0,
          h: 'Located in North-East Nigeria’s Sudan/Guinea Savanna wildlife belt along the Gaji River valley.',
          e: 'Yankari Game Reserve (centred on the Gaji River and Wikki Warm Spring) is located in Bauchi State.',
        },
      },
    ],
    qs: [
      {
        l: 1,
        dx: 1,
        q: 'What is the single most important geographical reason for the large volume of internal North–South trade in foodstuffs within Nigeria?',
        o: [
          'Differences in climate, soils, and vegetation between the Southern forest belt and Northern savanna belt create complementary agricultural products',
          'Northern and Southern Nigeria grow identical rainforest crops in identical months',
          'International customs tariffs are charged at Lokoja bridge',
          'Air cargo planes are the only transport mode linking Kano and Lagos',
        ],
        a: 0,
        e: 'Ecological diversity (humid forest tubers/tree crops vs dry savanna cattle/grains/pulses) creates strong regional specialization and reciprocal demand.',
      },
      {
        l: 2,
        q: 'Which Nigerian tourist site in Ekiti State is famous worldwide because a natural warm spring and a cold spring flow side-by-side and merge without mixing immediately?',
        o: [
          'Ikogosi Warm and Cold Springs',
          'Olumo Rock',
          'Argungu River Grounds',
          'Tinapa Business Resort',
        ],
        a: 0,
        e: 'Ikogosi in Ekiti State features a geothermal warm spring (~70 °C at source, ~37 °C at confluence) meeting a cold spring on a forested quartzite ridge.',
      },
      {
        l: 3,
        q: 'Nigeria’s two UNESCO World Heritage Sites recognized for cultural and historical significance are:',
        o: [
          'Sukur Cultural Landscape (Adamawa State) and Osun-Osogbo Sacred Grove (Osun State)',
          'Third Mainland Bridge (Lagos) and Kainji Dam (Niger)',
          'Apapa Container Terminal and Kaduna Oil Refinery',
          'Victoria Island Bar Beach and Onitsha Main Market',
        ],
        a: 0,
        e: 'Sukur Cultural Landscape (inscribed 1999, Adamawa) and Osun-Osogbo Sacred Grove (inscribed 2005, Osun) are Nigeria’s two UNESCO World Heritage Sites.',
      },
      {
        l: 3,
        q: 'Why do Delta river ports such as Warri, Sapele, and Koko handle smaller ocean vessels than Apapa, Lekki, or Onne?',
        o: [
          'Continuous siltation and shallow sandbars across Niger Delta creek mouths restrict channel draught unless constantly dredged',
          'Warri, Sapele, and Koko are landlocked 800 km from the sea',
          'Delta ports freeze solid with winter sea ice every January',
          'There are zero oilfields, timber, or rubber estates anywhere in Delta State',
        ],
        a: 0,
        e: 'Alluvial silt deposited by Niger distributaries builds shallow sandbars (Escravos/Forcados bars) that limit vessel draught at inland river ports.',
      },
      {
        l: 4,
        q: 'What major macroeconomic vulnerability arises from crude oil and natural gas accounting for over 80% of Nigeria’s visible export earnings?',
        o: [
          'Sharp drops in global crude oil prices trigger immediate foreign-exchange shortages, Naira instability, and federal budget deficits ("mono-product export risk")',
          'Global oil price booms wipe out all domestic agricultural land overnight',
          'Importing countries pay Nigeria exclusively in cowrie shells',
          'Refineries automatically convert excess crude oil into cocoa beans',
        ],
        a: 0,
        e: 'Heavy reliance on a single volatile primary commodity exposes public revenue, external reserves, and exchange rates to external price shocks, motivating non-oil export diversification.',
      },
      {
        l: 5,
        q: 'In balance-of-payments accounting, spending by foreign tourists visiting Yankari Game Reserve, Osun-Osogbo Festival, and Lagos beaches is classified as an:',
        o: [
          'Invisible export earning foreign exchange for Nigeria',
          'Visible merchandise import draining Nigeria’s reserves',
          'Internal barter transaction with zero foreign currency impact',
          'Capital flight liability',
        ],
        a: 0,
        e: 'Foreign visitors buy Nigerian hotel, transport, and guide services in foreign currency, which enters the services account as an invisible export.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SS3 THIRD TERM (Topics 28 – 30)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'gg-west-africa-ecowas',
    num: 28,
    name: 'Geography of West Africa & ECOWAS Integration',
    sec: 'Regional Geography of Nigeria & Africa',
    boss: 'West African Regional Commissioner',
    goals: [
      'Describe West Africa’s boundaries (4°N–28°N, 17°W–16°E), major relief uplands (Futa Djallon, Guinea Highlands, Jos Plateau, Togoland–Atakora Hills, Adamawa), and linguistic blocs (Anglophone, Francophone, Lusophone)',
      'Distinguish coastal West African states from the three landlocked Sahelian states (Mali, Niger, Burkina Faso) and Cape Verde island state',
      'State the founding date & treaty of ECOWAS (Treaty of Lagos, 28 May 1975), its Abuja Secretariat, institutions, aims, and flagship achievements (free movement protocol, ETLS, WAPP, WAGP, ECOMOG)',
      'Analyse obstacles slowing ECOWAS economic integration (colonial currency/language divide, similar primary exports, coups/withdrawal tensions, border bottlenecks, unpaid dues)',
    ],
    trap: 'The FOUTA DJALLON Highlands in GUINEA are the "Water Tower of West Africa" — giving birth to Rivers NIGER, SENEGAL, and GAMBIA! Also remember ECOWAS was founded in LAGOS (28 May 1975), while its current permanent Headquarters is in ABUJA!',
    parts: [
      {
        title: 'Physical & Political Geography of West Africa',
        idea: '<b>West Africa</b> stretches from the Atlantic Ocean in the West and South (Cape Verde peninsula in Senegal at ~17.5°W) to the Lake Chad–Cameroon Highlands line (~15°E–16°E) and northward into the Sahara (~25°N–28°N), encompassing 16 historically grouped states across three official colonial language blocs.',
        rules: [
          '<b>Major West African Uplands & Rivers:</b> <b>Fouta Djallon Highlands (Guinea)</b> — source ("Water Tower") of <b>River Niger, River Senegal, and River Gambia</b>; <b>Guinea-Nimba Highlands</b> (Mt Nimba 1,752 m); <b>Togoland–Atakora Ranges</b> (cut by River Volta at <b>Akosombo Gorge</b> in Ghana); <b>Jos Plateau</b> (Nigeria); and <b>Air / Adrar des Iforas Massifs</b> in the Sahara.',
          '<b>Linguistic & Geographic Grouping (16 Traditional West African States):</b> (1) <b>5 Anglophone:</b> Nigeria, Ghana, Sierra Leone, The Gambia, Liberia (never colonized; founded for freed slaves 1822/1847); (2) <b>9 Francophone:</b> Senegal, Côte d’Ivoire, Guinea, Benin, Togo, Mali, Burkina Faso, Niger, (+ Mauritania, which left ECOWAS in 2000); (3) <b>2 Lusophone (Portuguese-speaking):</b> <b>Guinea-Bissau</b> and island nation <b>Cabo Verde (Cape Verde)</b>.',
          '<b>Landlocked West African States:</b> <b>Mali, Niger, and Burkina Faso</b> have zero sea coastline, relying on transit corridors through Abidjan (Côte d’Ivoire), Dakar (Senegal), Tema (Ghana), Lomé (Togo), Cotonou (Benin), and Lagos/Port Harcourt.',
        ],
        ex: {
          q: 'Why is Guinea’s Fouta Djallon Plateau known across geography textbooks as the "Water Tower of West Africa"?',
          steps: [
            ['High orographic monsoon rainfall', 'Rising > 1,500 m close to the Atlantic South-West Monsoon track, Fouta Djallon intercepts heavy annual rainfall (> 2,000–3,000 mm).'],
            ['Headwaters of three continental rivers', 'It serves as the primary headwater source for West Africa’s greatest rivers: River Niger (flowing NE through Mali, Niger, Benin, Nigeria), River Senegal, and River Gambia.'],
          ],
        },
        tryit: {
          q: 'Which TWO West African countries belong to the Lusophone (Portuguese-speaking) group?',
          o: [
            'Guinea-Bissau and Cabo Verde (Cape Verde)',
            'Senegal and Côte d’Ivoire',
            'Liberia and Sierra Leone',
            'Togo and Republic of Benin',
          ],
          a: 0,
          h: 'Think of the mainland enclave south of Senegal and the Atlantic archipelago 600 km off Dakar.',
          e: 'Guinea-Bissau and the island republic of Cabo Verde are former Portuguese colonies (Lusophone West Africa).',
        },
      },
      {
        title: 'ECOWAS: Formation, Achievements & Integration Challenges',
        idea: 'The <b>Economic Community of West African States (ECOWAS)</b> was founded on <b>28 May 1975</b> via the <b>Treaty of Lagos</b> (spearheaded by Nigeria’s Gen. Yakubu Gowon and Togo’s Gnassingbé Eyadéma), with its Commission Headquarters today in <b>Abuja, Nigeria</b> (and ECOWAS Bank EBID in Lomé, Togo).',
        rules: [
          '<b>Core Objectives of ECOWAS:</b> Eliminate customs duties/tariffs among members (<b>ECOWAS Trade Liberalisation Scheme — ETLS</b>), establish a Common External Tariff (CET), guarantee <b>free movement of persons, residence, and establishment</b> (90-day visa-free ECOWAS passport/travel certificate), harmonize monetary/transport/energy policies (planned <b>Eco</b> single currency), and promote regional peace.',
          '<b>Major Achievements:</b> Visa-free citizen mobility across West Africa; <b>Trans-West African Coastal Highway</b> (Dakar–Lagos) & Trans-Sahelian Highway (Dakar–Ndjamena); <b>West African Gas Pipeline (WAGP)</b> piping Nigerian gas to Benin, Togo, and Ghana; <b>West African Power Pool (WAPP)</b>; and <b>ECOMOG</b> peacekeeping restorations in Liberia, Sierra Leone, and The Gambia.',
          '<b>Major Problems Hindering ECOWAS:</b> Parallel primary agricultural/mineral exports limiting intra-bloc trade (~10–12%); multiple non-convertible currencies (Naira, Cedi, Dalasi vs UEMOA CFA Franc tied to Euro); language/administrative divide; political instability, military coups & Sahelian AES bloc withdrawal tensions (Mali, Burkina Faso, Niger); informal border extortion/roadblocks; and arrears in member financial contributions.',
        ],
        ex: {
          q: 'Explain how Nigeria’s demographic and economic weight acts as BOTH an engine and a source of hesitation within ECOWAS.',
          steps: [
            ['Engine of integration', 'With > 50% of West Africa’s population and GDP, Nigeria funds the largest share of the ECOWAS budget, hosts the Abuja Commission/Parliament/Court, supplies gas via WAGP, and anchored ECOMOG peacekeeping.'],
            ['Smaller-state hesitation', 'Smaller neighbours occasionally fear Nigerian industrial/demographic dominance under unrestricted free trade or single-currency ("Eco") monetary rules, while smuggling across porous borders complicates tariff alignment.'],
          ],
        },
        tryit: {
          q: 'Where was the 1975 founding treaty of ECOWAS signed, and where is the permanent ECOWAS Commission Headquarters located today?',
          o: [
            'Signed in Lagos (28 May 1975); permanent Headquarters in Abuja, Nigeria',
            'Signed in Accra (1960); permanent Headquarters in Addis Ababa, Ethiopia',
            'Signed in Dakar (1991); permanent Headquarters in Cairo, Egypt',
            'Signed in Monrovia (1963); permanent Headquarters in Johannesburg, South Africa',
          ],
          a: 0,
          h: 'Addis Ababa is the African Union (AU) headquarters; ECOWAS stayed in Nigeria when the federal capital moved.',
          e: 'ECOWAS was established by the Treaty of Lagos on 28 May 1975, and its Commission, Parliament, and Community Court of Justice are headquartered in Abuja.',
        },
      },
    ],
    qs: [
      {
        l: 1,
        dx: 1,
        q: 'Which three West African countries are completely LANDLOCKED (having no direct coastline on the Atlantic Ocean)?',
        o: [
          'Mali, Niger, and Burkina Faso',
          'Ghana, Togo, and Benin',
          'Senegal, The Gambia, and Guinea',
          'Liberia, Sierra Leone, and Côte d’Ivoire',
        ],
        a: 0,
        e: 'Mali, Niger, and Burkina Faso lie entirely in the Sahelian/Sudanic interior with no ocean coastline, relying on coastal neighbours’ ports.',
      },
      {
        l: 2,
        q: 'The West African Gas Pipeline (WAGP) transports clean natural gas from Nigeria’s Niger Delta westward to generate electricity in:',
        o: [
          'Benin, Togo, and Ghana (Cotonou, Lomé, Tema, and Takoradi)',
          'Morocco, Algeria, and Tunisia',
          'Kenya, Uganda, and Tanzania',
          'Angola, Namibia, and Botswana',
        ],
        a: 0,
        e: 'WAGP connects the Escravos–Lagos pipeline system offshore/onshore to power plants in Benin, Togo, and Ghana (Tema/Takoradi).',
      },
      {
        l: 3,
        q: 'Akosombo Dam in Ghana, which impounds Lake Volta (one of the world’s largest artificial lakes by surface area), supplies hydro-electric power to Ghana, Togo, Benin, and which major Tema industry?',
        o: [
          'VALCO aluminium smelting plant',
          'Kimberley diamond cutting',
          'Witwatersrand deep gold mining',
          'Gezira long-staple cotton ginning',
        ],
        a: 0,
        e: 'Akosombo Dam on the Volta River powers Ghana’s grid, exports electricity to Togo and Benin (CEB), and energizes the Volta Aluminium Company (VALCO) smelter at Tema.',
      },
      {
        l: 3,
        q: 'Which West African country was NEVER colonized by a European power during the Scramble for Africa, having been founded in the early 19th century for freed African-American settlers?',
        o: [
          'Liberia (capital: Monrovia)',
          'Sierra Leone (capital: Freetown)',
          'Côte d’Ivoire (capital: Yamoussoukro)',
          'The Gambia (capital: Banjul)',
        ],
        a: 0,
        e: 'Liberia declared independence in 1847 (settled from 1822 by the American Colonization Society) and, alongside Ethiopia in East Africa, avoided European colonial rule.',
      },
      {
        l: 4,
        q: 'Why has launching a single common ECOWAS currency ("the Eco") repeatedly faced delays across West Africa?',
        o: [
          'Divergent inflation/fiscal deficits among Anglophone floating currencies (Naira, Cedi) versus the Euro-pegged Francophone UEMOA CFA Franc',
          'Every West African nation already uses the Japanese Yen',
          'ECOWAS states have zero central banks or commercial banks',
          'International law forbids regional currency unions outside Europe',
        ],
        a: 0,
        e: 'Meeting strict macroeconomic convergence criteria (single-digit inflation, low fiscal deficit/GDP, adequate reserves) and reconciling Francophone UEMOA’s CFA Franc peg with Nigeria/Ghana floating regimes have delayed the Eco.',
      },
      {
        l: 5,
        q: 'Which coastal West African country is the world’s #1 producer and exporter of COCOA beans (ahead of second-ranked Ghana)?',
        o: [
          'Côte d’Ivoire (Ivory Coast)',
          'Mauritania',
          'Cabo Verde',
          'The Gambia',
        ],
        a: 0,
        e: 'Côte d’Ivoire (~40%+ of world output) and neighbouring Ghana together supply over 60% of global cocoa beans.',
      },
    ],
  },

  {
    id: 'gg-africa-basins-mining',
    num: 29,
    name: 'Major African River Basins, Irrigation, HEP & Mining',
    sec: 'Regional Geography of Nigeria & Africa',
    boss: 'Continental Basins & Mining Analyst',
    goals: [
      'Compare perennial Nile Valley irrigation in Egypt (Aswan High Dam / Lake Nasser) and Sudan (Gezira Scheme between Blue & White Nile via Sennar Dam) with Niger Basin irrigation',
      'Map Africa’s giant Hydro-Electric Power dams to their exact rivers and countries: Aswan (Nile/Egypt), Akosombo (Volta/Ghana), Kainji (Niger/Nigeria), Kariba & Cahora Bassa (Zambezi/Zambia-Zimbabwe-Mozambique), Inga (Congo/DRC), Grand Ethiopian Renaissance Dam (Blue Nile/Ethiopia)',
      'Analyse Africa’s classic mining belts: Gold & Diamonds in South Africa (Witwatersrand & Kimberley), Copper in the Zambia–Katanga (DRC) Copperbelt, Petroleum in North/West Africa, and Bauxite/Iron Ore in West Africa',
      'Evaluate why River Congo holds Africa’s largest HEP potential (~40,000+ MW at Inga Falls) and why African mining economies seek local beneficiation/smelting',
    ],
    trap: 'The GEZIRA Irrigation Scheme is in SUDAN on the clay triangle between the BLUE NILE and WHITE NILE (fed by gravity from SENNAR DAM, growing long-staple cotton & wheat), whereas ASWAN HIGH DAM (Lake Nasser) is further north in EGYPT!',
    parts: [
      {
        title: 'Nile & Niger Basin Irrigation + Major African HEP Projects',
        idea: 'Africa’s plateau-and-escarpment relief ("an inverted saucer") creates dramatic waterfalls near the coast — obstructing ship navigation from the sea, yet endowing Africa with massive <b>Hydro-Electric Power (HEP)</b> potential and life-giving <b>alluvial irrigation</b> across arid belts.',
        rules: [
          '<b>Nile Basin Irrigation (Egypt & Sudan):</b> <b>River Nile</b> (6,650 km, world’s longest river) combines steady equatorial <b>White Nile</b> flow (from Lake Victoria) with summer monsoon floodwaters + fertile volcanic silt of the <b>Blue Nile</b> (from Lake Tana, Ethiopian Highlands), meeting at <b>Khartoum</b>. (1) <b>Egypt:</b> Replaced seasonal basin flooding with year-round <b>perennial canal irrigation</b> via <b>Aswan High Dam (1970, forming Lake Nasser)</b> → cotton, rice, wheat, maize, sugarcane + 2,100 MW HEP (side-effects: silt trapped behind dam → coastal Nile Delta erosion, soil salinization, bilharzia); (2) <b>Sudan’s Gezira Scheme:</b> Gently sloping clay plain between Blue & White Nile irrigated by <b>gravity flow</b> from <b>Sennar & Roseires Dams</b> (zero pumping cost!) → world-famous extra-long-staple <b>Sakel cotton</b>, wheat, groundnuts, sorghum.',
          '<b>Continental African HEP Landmarks:</b> <b>Inga Dams</b> on <b>River Congo (DRC)</b> — straddles the Equator (northern & southern tributaries peak in opposite halves of the year → huge steady year-round flow over Livingstone/Inga rapids, world’s #1 single-site HEP potential!); <b>Kariba Dam</b> (Zambia/Zimbabwe) & <b>Cahora Bassa Dam</b> (Mozambique) on <b>River Zambezi</b>; <b>Akosombo Dam</b> on <b>River Volta</b> (Ghana); <b>Kainji/Shiroro/Zungeru</b> (Nigeria); <b>GERD</b> on Blue Nile (Ethiopia).',
        ],
        ex: {
          q: 'Why is gravity-flow canal irrigation across Sudan’s Gezira plain remarkably cheap to operate once Sennar Dam was built?',
          steps: [
            ['Gentle NW natural tilt', 'The Gezira triangle between the Blue Nile and White Nile slopes gently and uniformly northwestward toward Khartoum, allowing water diverted at Sennar Dam on the Blue Nile to flow across fields purely by gravity without diesel/electric pumps.'],
            ['Impermeable clay subsoil', 'Underlying heavy clay prevents precious canal water from seeping away underground, maximizing water-use efficiency in an arid climate.'],
          ],
        },
        tryit: {
          q: 'Why does the lower River Congo at Inga (Democratic Republic of Congo) possess the largest natural Hydro-Electric Power potential in Africa?',
          o: [
            'Its tributaries span BOTH north and south of the Equator (guaranteeing massive year-round water volume) and plunge down steep crystalline rapids near the Atlantic coast',
            'River Congo flows through the hyper-arid Sahara where evaporation spins dry turbines',
            'Snowmelt from Antarctica feeds Lake Nasser into the Congo mouth',
            'It is the only river in Africa with zero waterfalls or rapids',
          ],
          a: 0,
          h: 'When northern Congo tributaries are in dry season, southern tributaries are in peak rainy season!',
          e: 'Dual-hemisphere equatorial rainfall gives River Congo enormous, steady 40,000 m³/s discharge plunging down the Livingstone/Inga Falls escarpment.',
        },
      },
      {
        title: 'Strategic Mineral Belts of Africa: Gold, Copper & Petroleum',
        idea: 'Africa’s ancient cratons and sedimentary basins host world-class mineral provinces: the <b>Witwatersrand Gold Basin</b> (South Africa), the <b>Central African Copperbelt</b> (Zambia & DRC), and major <b>Petroleum Provinces</b> (Nigeria, Libya, Algeria, Angola, Egypt).',
        rules: [
          '<b>Gold Mining in South Africa (Witwatersrand Basin, Gauteng & Free State):</b> Hosted in ancient conglomerate reefs ("banket") around <b>Johannesburg, Krugersdorp, Springs, Welkom, and Klerksdorp</b>. Extracted via ultra-deep <b>shaft/underground mining</b> (up to 3.5–4 km deep — requiring giant ventilation/refrigeration plants against geothermal heat and rock-burst bracing) and refined by the <b>cyanide process</b> (co-producing uranium). (Diamonds mined in volcanic kimberlite pipes at <b>Kimberley & Cullinan</b>, plus Botswana/DRC).',
          '<b>Copper Mining in Zambia & Katanga/Haut-Katanga (DRC):</b> Narrow ~450 km <b>Copperbelt</b> along the Zambia–DRC watershed — <b>Lubumbashi, Kolwezi, Likasi</b> (DRC, plus world’s #1 <b>cobalt</b> supply for EV batteries!) and <b>Ndola, Kitwe, Chingola, Mufulira, Luanshya</b> (Zambia). Mined via open-cast & shaft methods; smelted using Kariba/Inga HEP; major bottleneck is <b>landlocked</b> distance (~2,000 km) to ocean ports (solved via <b>TAZARA</b> railway to Dar es Salaam, Lobito Corridor to Angola, and Durban).',
          '<b>African Petroleum Giants:</b> <b>Nigeria</b> (Niger Delta), <b>Libya</b> (Sirte Basin), <b>Algeria</b> (Hassi Messaoud — Sahara oil & gas pipelines to Europe), <b>Angola</b> (Cabinda & deep-water Atlantic), and <b>Egypt</b>.',
        ],
        ex: {
          q: 'Identify TWO severe geographical/transport challenges faced by copper exporters in Zambia and southern DRC, and state how copper smelting near the mines helps overcome them.',
          steps: [
            ['Landlocked interior distance', 'Both Zambia and DRC’s Katanga province lie 1,500–2,200 km inland from Indian and Atlantic ports, facing high rail freight costs and historic border disruptions.'],
            ['Weight-losing beneficiation at source', 'Raw copper ore contains only ~2–5% pure copper! Crushing, floatation, and electrolytic smelting/refining at Kitwe/Ndola/Lubumbashi discard > 95% waste gangue rock so only high-value 99.9% copper blister/cathode plates pay long-distance rail freight.'],
          ],
        },
        tryit: {
          q: 'Which railway line was constructed in the 1970s specifically to give landlocked Zambian Copperbelt exports a direct route to the Indian Ocean port of Dar es Salaam?',
          o: [
            'TAZARA (Tanzania–Zambia Railway Authority)',
            'Trans-Siberian Railway',
            'Port Harcourt–Maiduguri Narrow Gauge',
            'Cairo–Alexandria Delta Line',
          ],
          a: 0,
          h: 'Links Kapiri Mposhi in Zambia northeastward across Tanzania to Dar es Salaam.',
          e: 'The 1,860 km TAZARA railway links the Zambian Copperbelt to Tanzania’s Indian Ocean port of Dar es Salaam, bypassing apartheid-era southern routes.',
        },
      },
    ],
    qs: [
      {
        l: 1,
        dx: 1,
        q: 'The famous Gezira Irrigation Scheme in the Republic of Sudan is located on the triangular plain between the:',
        o: [
          'Blue Nile and White Nile south of Khartoum (fed by Sennar Dam)',
          'River Niger and River Benue south of Lokoja',
          'Orange River and Vaal River in South Africa',
          'River Senegal and River Gambia in West Africa',
        ],
        a: 0,
        e: 'Gezira ("the Island") occupies the fertile clay wedge between the Blue Nile and White Nile, irrigated by gravity canals from Sennar and Roseires Dams.',
      },
      {
        l: 2,
        q: 'Which region of South Africa surrounding Johannesburg, Welkom, and Klerksdorp has historically been the world’s most famous deep-shaft GOLD-mining province?',
        o: [
          'The Witwatersrand ("The Rand") Basin',
          'The Katanga–Ndola Copperbelt',
          'The Sirte Sedimentary Basin',
          'The Fouta Djallon Plateau',
        ],
        a: 0,
        e: 'Gold-bearing conglomerates of the Witwatersrand Basin in Gauteng and the Free State anchored Johannesburg’s growth and South Africa’s industrial economy.',
      },
      {
        l: 3,
        q: 'Match each major African Hydro-Electric Power dam accurately with the river on which it is built:',
        o: [
          'Aswan High — Nile; Kariba & Cahora Bassa — Zambezi; Akosombo — Volta; Kainji — Niger; Inga — Congo',
          'Aswan High — Congo; Kariba — Niger; Akosombo — Nile; Kainji — Zambezi',
          'Inga — Limpopo; Cahora Bassa — Senegal; Kainji — Cross River',
          'Kariba — Orange River; Aswan High — Volta; Akosombo — Benue',
        ],
        a: 0,
        e: 'Every pairing matches Africa’s flagship multi-purpose river dams: Aswan (Nile), Kariba/Cahora Bassa (Zambezi), Akosombo (Volta), Kainji (Niger), and Inga (Congo).',
      },
      {
        l: 3,
        q: 'One unintended negative environmental side-effect observed in lower Egypt after completion of the Aswan High Dam in 1970 was:',
        o: [
          'Trapping of fertile Ethiopian alluvial silt inside Lake Nasser, forcing farmers to buy chemical fertilizers and causing coastal erosion of the Nile Delta + brick-making topsoil loss',
          'Complete drying up of Lake Nasser within two years',
          'Submergence of Cairo and Alexandria beneath Mediterranean waves',
          'Instant eradication of all irrigated cotton and rice farming in Egypt',
        ],
        a: 0,
        e: 'Impounding floodwaters in Lake Nasser halted annual silt renewal downstream, necessitating chemical fertilizers, accelerating Mediterranean wave erosion of the delta coast, and raising water-table salinity/bilharzia.',
      },
      {
        l: 4,
        q: 'Besides copper, the Katanga (Haut-Katanga / Lualaba) mining belt of southern Democratic Republic of Congo supplies over 65% of the world’s output of which strategic battery mineral?',
        o: [
          'Cobalt',
          'Sub-bituminous coal',
          'Potash',
          'Gypsum',
        ],
        a: 0,
        e: 'Copper-cobalt ores around Kolwezi and Lubumbashi in southern DRC make the country the dominant global supplier of cobalt for lithium-ion electric-vehicle batteries and superalloys.',
      },
      {
        l: 5,
        q: 'Why do deep underground gold mines on the Witwatersrand require massive mechanical refrigeration and ventilation plants?',
        o: [
          'Geothermal temperature rises steadily with depth (~25–30 °C per km), pushing rock temperatures at 3–4 km depth above 50–55 °C alongside silica dust hazards',
          'Active magma chambers erupt lava daily inside Johannesburg shafts',
          'Miners must freeze liquid gold ore to −40 °C before drilling',
          'Tropics-level equatorial rainforest humidity floods Gauteng daily',
        ],
        a: 0,
        e: 'Because of Earth’s geothermal gradient, Virgin rock temperatures 3.5 km underground exceed 55 °C; chilled air/ice-slurry cooling and dust suppression are essential for human survival and prevent silicosis.',
      },
    ],
  },

  {
    id: 'gg-africa-issues',
    num: 30,
    name: 'Contemporary African Issues: Landlocked States, Lake Chad & AfCFTA',
    sec: 'Regional Geography of Nigeria & Africa',
    boss: 'African Sustainability Strategist',
    goals: [
      'Identify Africa’s 16 landlocked countries across West, East, Central, and Southern Africa and analyse their geographical/economic handicaps and transit solutions',
      'Explain the physical and human causes of the dramatic > 90% shrinkage of Lake Chad since the 1960s and regional recovery initiatives (LCBC, Great Green Wall)',
      'Evaluate Sahelian drought, desertification, and climate-resilience strategies across Northern Nigeria and the Sahel',
      'Explain the vision, headquarters (Accra Secretariat), and economic transformative impact of the African Continental Free Trade Area (AfCFTA)',
    ],
    trap: 'Africa has SIXTEEN (16) landlocked countries — more than any other continent! Remember ETHIOPIA became landlocked in 1993 when coastal ERITREA gained independence along the Red Sea (causing Ethiopia to route > 90% of its sea trade via Djibouti)!',
    parts: [
      {
        title: 'Landlocked Countries of Africa: Challenges & Transit Corridors',
        idea: 'A <b>landlocked state</b> has no sovereign coastline on the open ocean. Africa has <b>16 landlocked countries</b> (nearly one-third of its 54 states!), creating steep transit freight costs and geopolitical vulnerability to coastal neighbours.',
        rules: [
          '<b>Africa’s 16 Landlocked Countries by Sub-Region:</b> (1) <b>West Africa (3):</b> Mali, Niger, Burkina Faso; (2) <b>Central/North-Central Africa (2):</b> Chad, Central African Republic; (3) <b>East Africa & Horn (5):</b> Ethiopia (landlocked since Eritrea’s 1993 independence!), South Sudan (2011), Uganda, Rwanda, Burundi; (4) <b>Southern Africa (6):</b> Zambia, Zimbabwe, Malawi, Botswana, Lesotho (completely surrounded as an enclave inside South Africa!), Eswatini (Swaziland).',
          '<b>Economic & Strategic Problems of Landlocked States:</b> (1) High overland rail/truck freight, insurance, and port handling charges inflate import prices (fuel, machinery) and erode export competitiveness; (2) Vulnerability to civil unrest, strikes, or diplomatic friction in coastal transit neighbours; (3) Customs delays, pilferage, and foreign-exchange transit fees; (4) Loss of Exclusive Economic Zone (EEZ) marine fisheries and offshore oil/gas.',
          '<b>Solutions & Transit Agreements:</b> UN Convention on the Law of the Sea transit rights, bilateral bonded warehouses/"dry ports" at coastal terminals (e.g. Ethiopia using <b>Djibouti</b> via electrified Addis–Djibouti rail; Uganda/Rwanda using <b>Mombasa</b> & <b>Dar es Salaam</b>; Niger/Burkina using <b>Cotonou, Lomé, Tema, Kano–Maradi rail</b>), regional blocs (ECOWAS, EAC, SADC), and high-value air exports (e.g. Ethiopian Airlines cargo, Rwandan coffee/tea).',
        ],
        ex: {
          q: 'Which African country is a "perforated enclave" completely surrounded on every side by a single neighbour (South Africa), and how does that differ from Eswatini?',
          steps: [
            ['Lesotho (true single-neighbour enclave)', 'Mountainous Kingdom of Lesotho is 100% encircled inside the Republic of South Africa — every land and air corridor crosses South African territory.'],
            ['Contrast with Eswatini', 'Eswatini (formerly Swaziland) is also landlocked in Southern Africa, but shares borders with TWO countries: South Africa and coastal Mozambique (giving short rail access to Maputo port).'],
          ],
        },
        tryit: {
          q: 'Why did Ethiopia — Africa’s second most populous country — become a landlocked nation in 1993, and which Red Sea/Gulf of Aden port handles the vast majority of its maritime trade today?',
          o: [
            'Eritrea gained independence along the entire Red Sea coast in 1993; Ethiopia now routes over 90% of its ocean trade through the port of Djibouti',
            'Tectonic uplift closed the Suez Canal in 1993; Ethiopia now ships through Lagos Apapa Port',
            'Lake Tana dried up in 1993; Ethiopia now uses Cape Town harbour',
            'Somalia annexed Addis Ababa in 1993; Ethiopia now uses Walvis Bay in Namibia',
          ],
          a: 0,
          h: 'Look at the Horn of Africa map where the Addis Ababa–Djibouti electrified railway terminates.',
          e: 'Eritrea’s 1993 independence detached the Red Sea ports of Massawa and Assab from Ethiopia, making Djibouti Ethiopia’s vital maritime lifeline.',
        },
      },
      {
        title: 'Lake Chad Shrinkage, Great Green Wall & AfCFTA Continental Trade',
        idea: 'Contemporary African geography links <b>climate-security stewardship</b> (saving the shrinking <b>Lake Chad Basin</b> and halting Sahara encroachment via the <b>Great Green Wall</b>) with <b>AfCFTA industrialization</b> across a 1.4-billion-person market.',
        rules: [
          '<b>Shrinkage of Lake Chad (> 90% loss since 1963!):</b> Shared by <b>Nigeria, Chad, Cameroon, and Niger</b> (managed by the <b>Lake Chad Basin Commission — LCBC</b>, HQ in N’Djamena). Surface area shrank from ~<b>25,000 km² (1963)</b> to < <b>1,500–2,500 km²</b> due to: (1) Recurrent <b>Sahel droughts & rising temperatures/evaporation</b> (climate change); (2) Heavy upstream irrigation damming and abstraction on the <b>Chari–Logone</b> (which supplies ~90% of Lake Chad’s inflow!) and <b>Komadugu-Yobe</b> rivers; (3) Overgrazing, deforestation, and windblown siltation. Consequences: collapse of fishing/fadama livelihoods, pastoralist–farmer displacement, and insecurity.',
          '<b>Great Green Wall (GGW) Initiative:</b> African Union-led ~8,000 km mosaic of restored shelterbelts, drought-hardy agroforestry (acacia/neem/baobab), water harvesting, and solar villages stretching across 11 Sahel states from <b>Senegal (Dakar) to Djibouti</b> (including 11 frontline Northern Nigerian states: Sokoto, Kebbi, Katsina, Zamfara, Kano, Jigawa, Bauchi, Gombe, Adamawa, Yobe, Borno).',
          '<b>African Continental Free Trade Area (AfCFTA):</b> Agreement signed in Kigali (2018), operational 2021, with permanent <b>AfCFTA Secretariat in Accra, Ghana</b>. Aims to create the world’s largest free-trade area by number of participating countries (54 AU states), progressively cutting intra-African tariffs on 90% of goods, launching the <b>Pan-African Payment and Settlement System (PAPSS)</b> for local-currency trade, and boosting value-added manufacturing.',
        ],
        ex: {
          q: 'Which river system contributes roughly 90% of all water entering Lake Chad, and how have both climate and human actions reduced that inflow?',
          steps: [
            ['Identify primary feeder river', 'The Chari–Logone river system flowing northward from the Central African Republic and Cameroon highlands supplies ~90% of Lake Chad’s water (while Nigeria’s Komadugu-Yobe supplies ~3–5%).'],
            ['Combine climatic & anthropogenic causes', 'Multi-decade Sahel rainfall deficits + extreme shallow-basin evaporation combined with upstream irrigation diversions and dams on both the Chari–Logone and Hadejia–Jama’are rivers starved the lake.'],
          ],
        },
        tryit: {
          q: 'Where is the permanent Secretariat of the African Continental Free Trade Area (AfCFTA) headquartered, and what does PAPSS enable African businesses to do?',
          o: [
            'Accra, Ghana — PAPSS enables cross-border African trade payments directly in local African currencies (e.g. Naira to Cedi/Kenyan Shilling) without routing through US Dollars or Euros',
            'Geneva, Switzerland — PAPSS bans all manufacturing factories inside Africa',
            'Brussels, Belgium — PAPSS levies a 200% customs tariff on Nigerian exports',
            'New York, USA — PAPSS restricts trade exclusively to crude oil tankers',
          ],
          a: 0,
          h: 'Ghana hosts the AfCFTA Secretariat while Afreximbank + AU launched PAPSS to solve currency-convertibility friction.',
          e: 'AfCFTA’s Secretariat sits in Accra, Ghana, and the Pan-African Payment and Settlement System (PAPSS) settles intra-African trade instantly in local currencies.',
        },
      },
    ],
    qs: [
      {
        l: 1,
        dx: 1,
        q: 'Which four countries directly border the shores of Lake Chad and form the core riparian members of the Lake Chad Basin Commission (LCBC)?',
        o: [
          'Nigeria, Chad, Cameroon, and Niger Republic',
          'Nigeria, Ghana, Benin, and Togo',
          'Egypt, Sudan, Ethiopia, and Uganda',
          'Mali, Senegal, Mauritania, and Algeria',
        ],
        a: 0,
        e: 'Lake Chad straddles the quadruple border junction of Nigeria (Borno), Niger, Chad, and Cameroon.',
      },
      {
        l: 2,
        q: 'Which Southern African landlocked kingdom is a complete enclave surrounded on all sides by the Republic of South Africa?',
        o: [
          'Lesotho',
          'Botswana',
          'Zambia',
          'Malawi',
        ],
        a: 0,
        e: 'Lesotho (capital: Maseru) lies high in the Drakensberg Mountains completely encircled by South African territory.',
      },
      {
        l: 3,
        q: 'What is the primary ecological goal of the African Union’s "Great Green Wall" project across the 11 frontline states of Northern Nigeria and the Sahel?',
        o: [
          'Restoring degraded drylands with drought-resistant tree shelterbelts, agroforestry, and water harvesting from Senegal to Djibouti to halt desertification and protect rural livelihoods',
          'Building a solid 10-metre concrete brick wall from Lagos to Cairo',
          'Clearing the Congo Rainforest to create barchan sand dunes',
          'Diverting salty Atlantic seawater to flood Sokoto and Katsina farmlands',
        ],
        a: 0,
        e: 'The Great Green Wall restores mosaic shelterbelts, gum-arabic/neem agroforestry, and soil/water conservation across an 8,000 km Sahelian corridor.',
      },
      {
        l: 3,
        q: 'Which river system flowing from the southern humid highlands contributes approximately 90% of the total surface water inflow into Lake Chad?',
        o: [
          'The Chari–Logone River system',
          'The Ogun–Osun River system',
          'The Volta River system',
          'The Limpopo River system',
        ],
        a: 0,
        e: 'Rising in the Central African Republic and northern Cameroon, the Chari and Logone rivers join at N’Djamena to supply ~90% of Lake Chad’s water.',
      },
      {
        l: 4,
        q: 'How does the African Continental Free Trade Area (AfCFTA) directly address the historic weakness of African international trade?',
        o: [
          'By progressively eliminating intra-African tariffs, harmonizing customs rules of origin, and encouraging regional value chains so African nations trade manufactured goods with one another rather than exporting only raw materials overseas',
          'By banning all ocean ports and restricting transport to camel caravans',
          'By requiring every African state to export 100% unprocessed raw ore to Europe',
          'By abolishing ECOWAS, EAC, and SADC railways',
        ],
        a: 0,
        e: 'Intra-African trade historically lingered around 15% vs > 60% in Europe/Asia; AfCFTA cuts tariff and non-tariff barriers across 1.4+ billion consumers to spur African manufacturing.',
      },
      {
        l: 5,
        q: 'Which proposed inter-basin engineering concept has frequently been debated by the Lake Chad Basin Commission (LCBC) as a long-term option to replenish Lake Chad’s water volume?',
        o: [
          'Transferring a small regulated fraction of surplus water from the Ubangi tributary of the Congo River Basin northward into the Chari–Lake Chad system (Transaqua / Ubangi–Chari transfer), alongside local watershed restoration',
          'Pumping salty water uphill from the Dead Sea in Jordan',
          'Melting Mount Kilimanjaro’s summit ice cap with geothermal heaters',
          'Damming the Lagos Lagoon to reverse River Ogun into Borno State',
        ],
        a: 0,
        e: 'Inter-basin water transfer from the humid Ubangi–Congo system into the Chari headwaters (studied by LCBC alongside watershed efficiency and agroforestry) is the classic proposed replenishment scheme.',
      },
    ],
  },
];
