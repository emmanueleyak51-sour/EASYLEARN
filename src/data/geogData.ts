import type {
  Beat,
  IdeaBeat,
  InteractiveLesson,
  TeachBeat,
  TeachBlock,
  Topic,
} from '../types';
import { perm } from '../utils/engine';
import { GEOG_TOPICS_PART1 } from './geogTopicsPart1';
import { GEOG_TOPICS_PART2 } from './geogTopicsPart2';
import { GEOG_TOPICS_PART3 } from './geogTopicsPart3';

interface GeogTableSpec {
  title: string;
  headers: string[];
  rows: string[][];
}

const GEOG_TEACH_TABLES: Record<string, GeogTableSpec> = {
  'gg-solar-earth': {
    title: 'Earth Rotation vs Earth Revolution & Solstices/Equinoxes',
    headers: ['Motion / Date', 'Period & Tilt Geometry', 'Primary Geographical Effects'],
    rows: [
      ['Rotation (West → East)', '24 hours on axis tilted 23½° (66½° to orbit)', 'Day & night, 15°/hr local time, Coriolis deflection, tides'],
      ['Revolution (Elliptical)', '365¼ days around Sun (leap year every 4 yrs)', '4 seasons, varying day length, shifting overhead sun'],
      ['Equinoxes (21 Mar & 23 Sep)', 'Overhead sun at Equator (0°)', 'Equal 12h day & 12h night everywhere on Earth'],
      ['Solstices (21 Jun & 22 Dec)', '21 Jun: 23½°N (Cancer) · 22 Dec: 23½°S (Capricorn)', '24h daylight inside Arctic Circle on 21 Jun; Antarctic on 22 Dec'],
    ],
  },
  'gg-lat-long-time': {
    title: 'Parallels of Latitude vs Meridians of Longitude & Time Rules',
    headers: ['Feature / Calculation', 'Defining Rule / Formula', 'WAEC & JAMB Watchout'],
    rows: [
      ['Latitudinal Distance', '1° latitude = 111 km · Same hem: subtract; Opp: add', 'Parallels shorten poleward; ONLY the Equator is a Great Circle'],
      ['Meridians of Longitude', 'Semi-great circles 0°–180° E/W meeting at poles', 'Every opposite meridian pair (e.g. 15°E & 165°W) forms a Great Circle'],
      ['Longitude → Local Time', '15° = 1 hour · 1° = 4 minutes', 'East = GAIN (+ Add time); West = LOSE (− Subtract time)'],
      ['International Date Line (180°)', 'Zig-zags across Pacific Ocean', 'Cross W→E (Asia to America): GAIN a day (repeat date); E→W: LOSE a day'],
    ],
  },
  'gg-structure-rocks': {
    title: 'Internal Earth Shells & Three Genetic Rock Families',
    headers: ['Layer / Rock Class', 'Composition & Examples', 'Diagnostic Exam Property'],
    rows: [
      ['SIAL vs SIMA Crust', 'SIAL: Silica + Alumina (Granite, 2.7) · SIMA: Silica + Mg (Basalt, 3.0)', 'Oceanic floor is dense SIMA only; continents float as lighter SIAL'],
      ['Igneous (Crystalline)', 'Plutonic: Granite, Gabbro · Volcanic: Basalt, Obsidian', 'Non-stratified, non-fossiliferous; cooling depth controls crystal size'],
      ['Sedimentary (Stratified)', 'Sandstone, Shale (mech.); Coal, Limestone (org.); Rock salt (chem.)', 'Laid in strata/bedding planes; ONLY family with fossils & crude oil!'],
      ['Metamorphic (Altered)', 'Limestone→Marble · Clay→Slate · Sandstone→Quartzite · Granite→Gneiss', 'Recrystallized by intense heat and tectonic pressure'],
    ],
  },
  'gg-landforms-tectonic': {
    title: 'Major Mountains, Plateaus & Plains Classification',
    headers: ['Landform Type', 'Tectonic / Denudational Origin', 'Classic World & African Examples'],
    rows: [
      ['Fold Mountains', 'Compressional crumpling of geosynclinal strata', 'Himalayas, Andes, Alps, Rockies, Atlas Mountains (NW Africa)'],
      ['Block (Horst) & Rift Valley', 'Tensional/compressional normal/reverse faulting', 'Rwenzori & Vosges (Horsts); East African Rift Valley (Graben)'],
      ['Volcanic & Residual Mts', 'Lava/ash cones vs differential erosion remnants', 'Kilimanjaro, Mt Cameroon (Volcanic); Inselbergs, Monadnocks (Residual)'],
      ['Plateaus & Plains', 'Tectonic (Tibetan, Deccan/Jos), Dissected, Alluvial/Deltaic', 'Alluvial plains (Nile, Indo-Gangetic, Niger Delta) are premier farm belts'],
    ],
  },
  'gg-weather-elements': {
    title: 'Meteorological Station Instruments & Isolines Reference',
    headers: ['Weather Element', 'Instrument & Unit', 'Siting Rule / Isoline Name'],
    rows: [
      ['Rainfall', 'Rain Gauge + measuring cylinder (mm)', 'Rim 30 cm above ground to stop splash; distance ≥ 2 × obstacle height · Isohyet'],
      ['Air Temperature', 'Six’s Max & Min Thermometer (°C)', 'Inside louvered white Stevenson Screen 1.2 m high · Isotherm'],
      ['Relative Humidity', 'Wet & Dry Bulb Hygrometer (%)', 'Zero depression = 100% saturated air; large depression = dry air'],
      ['Pressure, Wind & Sun', 'Barometer (mb/hPa), Anemometer (speed), Wind Vane (dir.)', 'Wind Vane arrow points INTO wind source · Isobar (pressure), Isohel (sun)'],
    ],
  },
  'gg-climate-koppen': {
    title: 'Rainfall Types, Lapse Rate & Köppen Climate Codes',
    headers: ['Concept / Köppen Code', 'Mechanism / Defining Climate', 'Typical Region'],
    rows: [
      ['Environmental Lapse Rate', 'Temp drops 6.5 °C per 1,000 m ascent in troposphere', 'Explains snow on equatorial Mt Kilimanjaro (5,895 m) & cool Jos'],
      ['Three Rainfall Types', 'Convectional (equatorial PM), Orographic/Relief, Cyclonic/Frontal', 'Leeward rain-shadow slope warms adiabatically & stays dry'],
      ['Tropical A Climates', 'Af (Equatorial wet), Am (Monsoon), Aw (Tropical Savanna)', 'Coldest month ≥ 18 °C; Aw dominates Guinea/Sudan West Africa'],
      ['Dry B & Temperate C', 'BWh (Hot Desert), BSh (Steppe), Cs (Mediterranean — winter rain!)', 'Cs (Cape Town, California, Italy): wet mild winters & hot dry summers'],
    ],
  },
  'gg-oceans-water': {
    title: 'Ocean Floor Relief, Salinity & Major Currents',
    headers: ['Marine Feature', 'Characteristics', 'Economic / Climatic Impact'],
    rows: [
      ['Continental Shelf (< 200 m)', 'Shallow sunlit neritic zone (~7–8% of ocean area)', 'Rich plankton → world’s richest fishing grounds + offshore oil rigs'],
      ['Ocean Salinity (~35‰)', 'Dominated by NaCl (~78%)', 'Highest in subtropical deserts (Red Sea ~40‰); lowest at river mouths/Baltic'],
      ['Warm Ocean Currents', 'Poleward flow along EAST coasts in low/mid latitudes', 'Gulf Stream/N. Atlantic Drift (ice-free Norway), Kuroshio, Guinea Current'],
      ['Cold Ocean Currents', 'Equatorward flow along WEST coasts of subtropics', 'Canary, Benguela (Namib), Peru/Humboldt → coastal deserts + rich fisheries!'],
    ],
  },
  'gg-map-scales': {
    title: 'Topographical Map Scales, Distances, Areas & Enlargement',
    headers: ['Mapwork Operation', 'Exact Formula', 'Exam Trap to Avoid'],
    rows: [
      ['Scale Conversion (RF)', '1 : 50,000 ⇔ 1 cm to 0.5 km (2 cm to 1 km)', 'Divide cm denominator by 100,000 to get km!'],
      ['Ground Distance', 'Ground (km) = Map (cm) × RF ÷ 100,000', 'Use cotton thread along winding roads/rivers before ruler'],
      ['Scale Enlargement / Reduction', 'New RF = Old RF ÷ Factor (×2 larger ⇒ 1:50,000 → 1:25,000!)', 'NEW AREA changes by (Factor)² — doubling linear scale ×4 area!'],
      ['Bearings', 'Measured CLOCKWISE from North (000°–360°)', '"Bearing of P FROM Q" means place protractor at Q!'],
    ],
  },
  'gg-map-contours': {
    title: 'Contour Landforms, Slope Gradient & Intervisibility',
    headers: ['Topographical Concept', 'Contour / Formula Rule', 'Interpretation'],
    rows: [
      ['Slope Gradient', 'Gradient = VI ÷ HE (in IDENTICAL metres!) = 1 in (HE/VI)', 'Smaller denominator (1 in 12) = STEEPER than 1 in 60!'],
      ['Valley vs Spur', 'V-contours point UPHILL = Valley; point DOWNHILL = Spur', 'Check contour numbers carefully to orient uphill vs downhill'],
      ['Concave vs Convex Slope', 'Wide at base → close at top = Concave; reverse = Convex', 'Concave slopes allow intervisibility; convex bulge blocks sight!'],
      ['Vertical Exaggeration', 'VE = Horizontal Scale Denom ÷ Vertical Scale Denom', 'Both scales must be in identical cm units (e.g. 1 cm = 20 m → 1:2,000)'],
    ],
  },
  'gg-gis-remote': {
    title: 'GIS Data Models, GPS & Remote Sensing Toolkit',
    headers: ['Spatial Technology', 'Core Structure / Principle', 'Real-World Application'],
    rows: [
      ['Vector Data (GIS)', 'Discrete Points, Lines (arcs), and Polygons + attribute tables', 'Wells/schools (points), roads/rivers (lines), states/plots (polygons)'],
      ['Raster Data (GIS)', 'Grid of uniform pixels/cells storing continuous values', 'Satellite imagery, elevation DEMs, rainfall/temperature surfaces'],
      ['GPS Positioning', 'Trilateration from ≥ 4 orbiting satellites (lat, long, altitude)', 'Cadastral boundary mapping, precision farming, aviation/fleet routing'],
      ['Remote Sensing', 'Passive (reflected sunlight/thermal) vs Active (Radar/LiDAR)', 'Radar penetrates clouds to monitor Niger Delta floods & deforestation'],
    ],
  },
  'gg-weathering-mass': {
    title: 'Physical vs Chemical Weathering & Mass Wasting',
    headers: ['Process', 'Mechanism & Climate', 'Resulting Landform / Evidence'],
    rows: [
      ['Physical (Arid / Alpine)', 'Thermal exfoliation, block disintegration, frost freeze-thaw', 'Onion-skin exfoliation domes (inselbergs) & angular scree/talus'],
      ['Chemical (Hot, Humid)', 'Carbonation (limestone), hydrolysis (granite→kaolin), oxidation', 'Karst caverns, deep red lateritic regolith, rotten-rock corestones'],
      ['Slow Mass Wasting', 'Soil creep (imperceptible downhill particle heave)', 'Tilted telegraph poles/fences, curved tree trunks, terracettes'],
      ['Rapid Mass Wasting', 'Earthflow, mudflow, rockfall, rotational landslide/slump', 'Triggered by torrential rain lubricating clay slip planes + undercut slopes'],
    ],
  },
  'gg-rivers-fluvial': {
    title: 'Three Stages of a River Course & Drainage Patterns',
    headers: ['River Stage', 'Dominant Process & Gradient', 'Signature Landforms'],
    rows: [
      ['Upper (Youthful/Mountain)', 'Steep gradient; vertical corrasion & potholes', 'Narrow V-shaped valley, interlocking spurs, rapids, waterfall & gorge'],
      ['Middle (Mature/Valley)', 'Moderate slope; lateral erosion widens valley', 'Open U/trough valley, river cliffs & slip-off slopes, meanders'],
      ['Lower (Senile/Plain)', 'Very gentle slope; heavy deposition of silt/alluvium', 'Broad floodplain, natural levees, braided channels, ox-bow lakes, delta'],
      ['Drainage Patterns', 'Dendritic (uniform rock), Trellis (alt. hard/soft), Radial (dome)', 'Centripetal flows inward into a basin (e.g. Lake Chad)'],
    ],
  },
  'gg-karst-water': {
    title: 'Groundwater, Artesian Basins & Karst Landforms',
    headers: ['Feature', 'Geological Formation', 'Key Exam Detail'],
    rows: [
      ['Artesian Basin', 'Permeable aquifer trapped between two impermeable beds in a syncline', 'Intake outcrop in rainy hills builds hydrostatic head for gushing wells'],
      ['Surface Karst', 'Grikes (clefts) & Clints → Swallow hole → Doline → Uvala → Polje', 'Scanty surface streams because rainwater sinks through limestone joints'],
      ['Underground Caverns', 'Stalactites (hang from ceiling), Stalagmites (rise from floor), Pillar', 'Deposited by evaporation of Ca(HCO₃)₂ back into calcite CaCO₃'],
      ['Economic Value', 'Cement limestone, metallurgical flux, cave tourism (Ogbunike)', 'Thin stony soils limit arable crops unless clay accumulates in poljes'],
    ],
  },
  'gg-arid-wind': {
    title: 'Desert Surfaces, Wind Erosion & Aeolian Deposition',
    headers: ['Desert Category', 'Process / Composition', 'Classic Landforms'],
    rows: [
      ['Desert Surfaces', 'Erg (sand sea), Reg (pebble/gravel), Hamada (bare rocky platform)', 'Most of the Sahara is rocky Hamada & gravelly Reg, NOT sand!'],
      ['Wind Erosion', 'Deflation (hollows/oases) + Abrasion concentrated in lowest 1 m', 'Rock pedestals (mushroom rocks), Zeugen (h. strata), Yardangs (v. strata)'],
      ['Wind Deposition', 'Barchan (crescent — horns point DOWNWIND!), Seif (longitudinal), Loess', 'Windblown loess forms fertile yellow agricultural plains in N. China'],
      ['Desert Water Action', 'Rare torrential cloudbursts along dry Wadis', 'Alluvial fans/Bajadas & temporary salt lakes (Playas / Chotts)'],
    ],
  },
  'gg-glacial-coastal': {
    title: 'Glacial vs Coastal Erosional & Depositional Landforms',
    headers: ['Agent & Action', 'Erosional Landforms', 'Depositional Landforms'],
    rows: [
      ['Alpine / Valley Glacier', 'Corrie/Cirque (tarn), Arête, Pyramidal Peak, U-trough, Hanging valley', 'Lateral, medial & terminal Moraines; Drumlins, Eskers, Erratics'],
      ['Marine Wave Action', 'Cliff, Wave-cut platform, Cave → Arch → Stack → Stump', 'Beaches, Sand Spit (longshore drift), Sandbar/Lagoon, Tombolo'],
      ['Submerged Coasts', 'Ria (drowned river valley, funnel-shaped) vs Fiord (drowned U-glacial)', 'Rias & Fiords form deep sheltered natural harbours (Freetown, Norway)'],
      ['Emergent & Coral Coasts', 'Raised beaches & marine terraces', 'Fringing reef, Barrier reef, Atoll (needs warm 20–30 °C clear salty water)'],
    ],
  },
  'gg-env-hazards': {
    title: 'Environmental Hazards, Causes & Conservation Remedies',
    headers: ['Hazard', 'Primary Geographical Causes', 'Proven Management Solutions'],
    rows: [
      ['Gully Erosion (SE Nigeria)', 'Torrential rain + soft unconsolidated sandstone + deforestation/steep slopes', 'Contour ploughing, terracing, afforestation, check-dams, storm drains'],
      ['Desertification (Sahel)', 'Prolonged drought, overgrazing, bush burning, fuelwood felling', 'Great Green Wall shelterbelts, rotational grazing, clean cooking gas/solar'],
      ['Urban Flash Flooding', 'Blocked gutters, building on floodplains/wetlands, impermeable paving', 'Desilting drains, wetland buffers, dam regulation, proper waste disposal'],
      ['Warming vs Ozone Loss', 'CO₂/CH₄ trap IR heat vs CFCs destroy stratospheric O₃ UV shield', 'End gas flaring, renewables/afforestation; Montreal Protocol CFC phase-out'],
    ],
  },
  'gg-world-pop': {
    title: 'Demographic Formulas, Pyramids & Migration Summary',
    headers: ['Demographic Metric', 'Exact Formula / Shape', 'Interpretation'],
    rows: [
      ['Density & RNI', 'Density = Pop ÷ Area · RNI (%) = (CBR − CDR) ÷ 10', 'Doubling Time Td ≈ 70 ÷ RNI(%)'],
      ['Dependency Ratio', '[(Pop 0–14 + Pop 65+) ÷ Pop 15–64] × 100%', 'High youth dependency strains school & clinic budgets in West Africa'],
      ['Broad-Base Pyramid', 'Wide 0–14 base tapering steeply upward', 'High birth rate, youthful population, rapid growth (Stage 2 DTM)'],
      ['Rural–Urban Migration', 'Rural push (land/job scarcity) + Urban pull (wages/amenities)', 'Depletes rural farm youth while creating urban housing/traffic pressure'],
    ],
  },
  'gg-settlements': {
    title: 'Settlement Patterns, Hierarchy & Urban Land-Use',
    headers: ['Concept', 'Classification / Sequence', 'Geographical Drivers'],
    rows: [
      ['Site vs Situation', 'Site = local ground · Situation = regional position', 'Lokoja’s situation at Niger–Benue confluence made it a historic hub'],
      ['Spatial Patterns', 'Nucleated (crossroads/borehole), Dispersed (farms), Linear (road/river)', 'Identified directly from hut symbol arrangement on topo maps'],
      ['Hierarchy (Upward)', 'Homestead → Hamlet → Village → Town → City → Conurbation → Megalopolis', 'Higher order = larger population, wider sphere of influence & specialist services'],
      ['CBD (City Core)', 'Peak accessibility & maximum land rent', 'Tall skyscrapers, banks/HQ, daytime crowds, low night-time residents'],
    ],
  },
  'gg-transport-comm': {
    title: 'Comparative Transport Modes & Maritime Trade Concepts',
    headers: ['Transport Mode', 'Core Comparative Strength', 'Main Limitation'],
    rows: [
      ['Road Transport', 'Door-to-door flexibility; feeds rail, ports & rural farms', 'Limited tonnage per truck; accidents & pothole maintenance'],
      ['Rail & Pipeline', 'Rail: cheap overland bulk haul · Pipeline: 24/7 liquid/gas flow', 'Fixed inflexible routes; pipeline restricted to fluids & vandalism risk'],
      ['Ocean vs Air', 'Ocean: cheapest international bulk cargo · Air: fastest global speed', 'Ocean is slow & port-bound; Air has highest cost/kg & Harmattan haze delays'],
      ['Port Geography', 'Hinterland = inland tributary zone · Entrepôt = re-export hub', 'North Atlantic is world’s busiest sea lane; Suez saves rounding Africa'],
    ],
  },
  'gg-world-industry-trade': {
    title: 'Weberian Industrial Orientation & International Trade',
    headers: ['Orientation / Trade Term', 'Governing Logic', 'Classic Examples'],
    rows: [
      ['Raw-Material-Oriented', 'Bulky, weight-losing, or perishable farm/mineral input', 'Cement at limestone (Ewekoro/Obajana), sugar at cane estate (Bacita)'],
      ['Power-Oriented', 'Massive electricity per tonne of output', 'Aluminium smelting near HEP (VALCO at Tema near Akosombo Dam)'],
      ['Market-Oriented', 'Weight-gaining (water/bottles), fragile, or perishable product', 'Soft drinks, breweries, bread bakeries, furniture in Lagos/Kano/Onitsha'],
      ['Terms & Balance of Trade', 'BoT = Visible X − M · ToT = (Px ÷ Pm) × 100', 'West African intra-trade is low because states export parallel raw goods'],
    ],
  },
  'gg-nig-relief-drainage': {
    title: 'Nigeria’s Coordinates, Highland Blocks & Drainage Basins',
    headers: ['Physiographic Unit', 'Key Facts / Elevation', 'Drainage & Economic Role'],
    rows: [
      ['Location & Time Zone', '4°N–14°N, 3°E–15°E · 923,768 km² · WAT = UTC + 1 (15°E)', '~1,110 km N–S span drives coastal-to-Sahel ecological gradient'],
      ['Jos Plateau', '1,200–1,829 m (Shere Hills); Younger Granites', 'Hydrological centre (radial: Kaduna, Gongola, Hadejia) + Tin/Columbite'],
      ['Eastern Highlands', 'Mandara, Adamawa, Mambilla/Gotel (Chappal Waddi 2,419 m!)', 'Nigeria’s highest peak; cool tsetse-free montane cattle & tea ranching'],
      ['Drainage Systems', 'Atlantic (Niger–Benue at Lokoja, Ogun, Cross) vs Chad (Yobe)', 'HEP dams (Kainji, Shiroro), fadama irrigation & fishing'],
    ],
  },
  'gg-nig-climate-veg': {
    title: 'ITD Air Masses & Nigerian Vegetation Belts (South → North)',
    headers: ['Air Mass / Belt', 'Rainfall & Dry Season', 'Signature Species & Adaptations'],
    rows: [
      ['mT vs cT across ITD', 'mT (SW Monsoon: wet) · cT (NE Harmattan: dry dusty)', 'ITD at ~6–8°N in Jan (dry); ~20°N in Jul (wet); SW has Aug Break'],
      ['Swamp & Rainforest', '2,000–3,500+ mm (0–3 dry mos)', 'Mangrove stilt/breathing roots; Rainforest buttress roots (Iroko, Mahogany, Cocoa)'],
      ['Guinea Savanna', '1,000–1,500 mm (4–5 dry mos) — WIDEST belt in Nigeria', 'Tall grass + fire-resistant corky-bark trees (Shea butter, Locust bean)'],
      ['Sudan & Sahel Savanna', 'Sudan: 500–1,000 mm · Sahel (NE Borno/Yobe): < 500 mm', 'Short grass, water-storing Baobab, thorny Acacia (gum arabic), cattle/grains'],
    ],
  },
  'gg-nig-soils-forest': {
    title: 'Nigerian Soil Zones & Rainforest Lumbering Summary',
    headers: ['Soil / Forestry Zone', 'Key Properties', 'Major Crops / Timber Hubs'],
    rows: [
      ['Hydromorphic / Alluvial', 'Seasonally flooded creeks & river fadamas rich in silt', 'Swamp rice, dry-season vegetables, sugarcane (Niger, Benue, Sokoto, Hadejia)'],
      ['Rainforest Ferralsols', 'Deeply weathered red/yellow soils; heavily leached of bases', 'Acid-tolerant tree crops: Oil palm, Rubber, Cocoa (on richer clay-loam), Cassava'],
      ['Savanna Ferruginous', 'Sandy-loam top over iron-pan subsoil; less leached', 'Yam, Maize, Sorghum, Groundnut (Kano sandy-loam), Cotton (Zaria clay-loam)'],
      ['Lumbering Hubs', 'Sapele, Benin City, Ondo, Ijebu-Ode, Calabar, Ikom', 'Hardwoods (Iroko, Obeche, Mahogany); hampered by mixed stands & buttress roots'],
    ],
  },
  'gg-nig-agriculture': {
    title: 'Nigeria’s Crop Belts, Irrigation Schemes & Livestock Map',
    headers: ['Enterprise', 'Core Geographical Belt', 'Decisive Locational Factor'],
    rows: [
      ['Export Tree Crops', 'Cocoa (SW: Ondo/Osun/Oyo), Oil Palm (SE/SS), Rubber (Edo/Delta)', 'Heavy rainfall + clay-loam (cocoa) or acidic ferralsols (oil palm)'],
      ['Savanna Cash & Grains', 'Groundnut (Kano/Katsina), Cotton (Kaduna/Gusau), Millet/Sorghum', 'Moderate rain, abundant ripening sunshine & light/black savanna soils'],
      ['RBDA Irrigation', 'Kano River (Tiga Dam), Bakolori (Sokoto), South Chad, Bacita', 'Overcomes short 3–4 month northern rainy season for dry-season wheat/rice'],
      ['Zebu Cattle Rearing', 'Sudan/Sahel North + Mambilla/Jos/Obudu Plateaus', 'Open grass + absence of humid-forest tsetse fly (trypanosomiasis)'],
    ],
  },
  'gg-nig-minerals-power': {
    title: 'Nigerian Minerals & Power Stations Master Matrix',
    headers: ['Resource / Power Type', 'Key Locations & Geology', 'Economic Significance & Watchout'],
    rows: [
      ['Petroleum & Gas', 'Niger Delta & Offshore (Oloibiri 1956; Bonny NLNG) — Sedimentary', 'Low-sulphur "sweet" Bonny Light crude; > 80% of export earnings'],
      ['Coal & Limestone', 'Coal: Enugu/Okaba · Limestone: Ewekoro, Obajana, Ibese, Sokoto, Ashaka', 'Strictly SEDIMENTARY; feeds cement kilns across all six geopolitical zones'],
      ['Tin, Columbite & Iron', 'Tin/Columbite: Jos (Makeri) · Iron Ore: Itakpe → Ajaokuta/Aladja', 'Crystalline Younger Granites / Basement Complex; open-cast mined'],
      ['HEP vs Thermal Power', 'HEP: Kainji, Jebba, Shiroro, Zungeru · Thermal: Egbin, Afam, Sapele, Geregu', 'HEP dips in dry season; Thermal (>70% capacity) vulnerable to gas pipeline faults'],
    ],
  },
  'gg-nig-pop-industry': {
    title: 'Nigeria’s Population Cores & Four Industrial Zones',
    headers: ['Cluster / Zone', 'Core Cities', 'Drivers & Signature Industries'],
    rows: [
      ['3 High-Density Pop Cores', 'SW Yorubaland/Lagos, SE Igboland, N-Central Kano–Katsina–Sokoto', 'Middle Belt stays sparse due to historic slave raids + tsetse/blackfly vectors'],
      ['Western Industrial (>50%)', 'Lagos (Ikeja/Apapa/Lekki), Ota, Agbara, Ibadan, Shagamu', 'Seaports, Egbin/gas pipeline, huge market → refining, cement, FMCG, pharma'],
      ['SE / SS & Mid-West Zones', 'PH/Eleme/Onne, Aba, Onitsha, Nnewi · Warri, Sapele, Benin', 'Petrochemicals/fertilizer (Eleme), auto parts (Nnewi), footwear (Aba), timber'],
      ['North-Central & Crafts', 'Kano, Kaduna, Zaria, Jos · Crafts: Bida (brass), Akwete, Kano (leather)', 'Textiles, tanneries, flour/oil mills, Kaduna refinery, Makeri tin'],
    ],
  },
  'gg-nig-trade-tourism': {
    title: 'Nigeria’s North–South Trade, Seaports & Tourist Landmarks',
    headers: ['Dimension', 'Key Flows / Centres', 'Geographical Explanation'],
    rows: [
      ['North → South Trade', 'Cattle, beans (cowpea), onions, tomatoes, grains, hides, smoked fish', 'Savanna surplus shipped south along rail/trunk highways'],
      ['South → North Trade', 'Kolanuts, palm oil, timber/plywood, garri/yam, citrus, manufactures', 'Forest belt crops + seaport/factory goods create strong complementarity'],
      ['Seaport Complexes', 'Apapa, Tin Can, Lekki Deep Sea (16.5 m), Warri, PH/Onne, Calabar', 'Lekki handles mega-ships; Delta ports limited by shallow silt sandbars'],
      ['Flagship Tourist Sites', 'Yankari/Wikki (Bauchi), Obudu (Cross River), Ikogosi (Ekiti), Argungu (Kebbi)', 'UNESCO sites: Sukur (Adamawa) & Osun-Osogbo (Osun); invisible export FX'],
    ],
  },
  'gg-west-africa-ecowas': {
    title: 'West African Geography & ECOWAS Integration Profile',
    headers: ['Aspect', 'Core Facts', 'Exam Watchout'],
    rows: [
      ['Uplands & Landlocked', 'Fouta Djallon (Guinea) = source of Niger, Senegal & Gambia rivers', '3 landlocked states: Mali, Niger, Burkina Faso; Lusophone: Cabo Verde & Guinea-Bissau'],
      ['ECOWAS Foundation', 'Signed 28 May 1975 (Treaty of Lagos); Commission HQ in Abuja', 'Promotes visa-free mobility, ETLS tariff removal, WAGP gas & WAPP power'],
      ['Regional Infrastructure', 'Dakar–Lagos Coastal Highway, Dakar–Ndjamena Sahelian, WAGP', 'Links Anglophone, Francophone & Lusophone markets'],
      ['Integration Hurdles', 'Similar raw exports, multiple currencies (CFA vs Naira/Cedi), coups', 'Keeps formal intra-ECOWAS merchandise trade around ~10–12%'],
    ],
  },
  'gg-africa-basins-mining': {
    title: 'Continental African Irrigation, HEP Dams & Mining Belts',
    headers: ['Project / Belt', 'Location & River / Basin', 'Distinguishing Feature'],
    rows: [
      ['Aswan vs Gezira (Nile)', 'Aswan High Dam (Egypt, L. Nasser) · Gezira (Sudan, Sennar Dam)', 'Gezira uses cheap gravity flow between Blue & White Nile for Sakel cotton'],
      ['Major African HEP Dams', 'Inga (Congo), Kariba/Cahora Bassa (Zambezi), Akosombo (Volta), Kainji (Niger)', 'Congo straddles Equator → steady year-round flow & #1 HEP potential!'],
      ['Witwatersrand Gold', 'Johannesburg / Welkom (South Africa)', 'Ultra-deep shaft mining (3.5+ km) needing refrigeration + cyanide extraction'],
      ['Zambia–Katanga Copper', 'Kitwe/Ndola (Zambia) & Lubumbashi/Kolwezi (DRC — #1 world Cobalt)', 'Landlocked 2,000 km inland → smelted at source & railed via TAZARA / Lobito'],
    ],
  },
  'gg-africa-issues': {
    title: 'Contemporary African Challenges & Continental Initiatives',
    headers: ['Issue / Initiative', 'Key Countries & Facts', 'Strategic Impact'],
    rows: [
      ['16 Landlocked States', 'Mali, Niger, Burkina, Chad, CAR, Ethiopia (since 1993), Uganda, Rwanda, Zambia, Lesotho…', 'Lesotho is an enclave inside SA; Ethiopia ships >90% via Djibouti'],
      ['Lake Chad Shrinkage', 'Riparian LCBC: Nigeria, Chad, Cameroon, Niger (>90% area lost since 1963)', 'Chari–Logone supplies ~90% of inflow; drought + upstream dams shrank lake'],
      ['Great Green Wall', '8,000 km Sahel shelterbelt/agroforestry corridor (Senegal → Djibouti)', 'Protects 11 frontline Northern Nigerian states against desert encroachment'],
      ['AfCFTA (HQ: Accra)', '54 AU nations; PAPSS local-currency payment settlement', 'Cuts intra-African tariffs on 90% of goods to build African manufacturing'],
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

function buildInteractiveForGeogTopic(topic: Topic): InteractiveLesson {
  const tableSpec = GEOG_TEACH_TABLES[topic.id];

  return {
    title: topic.name,
    goals: topic.goals,
    trap: topic.trap,
    parts: topic.parts.map((part, pIdx) => {
      const beats: Beat[] = [];

      const ideaBeat: IdeaBeat = {
        k: 'idea',
        kl: `Chapter ${pIdx + 1} · Core Principle`,
        title: part.title,
        idea: part.idea,
        g: part.g,
        cap: part.cap,
        rules: part.rules,
        rh: 'Essential Geographical Principles, Facts & Exam Rules',
      };
      beats.push(ideaBeat);

      if (pIdx === 0 && tableSpec) {
        const body: TeachBlock[] = [
          ['h', tableSpec.title],
          ['tb', tableSpec.headers, tableSpec.rows],
          ['wn', `<b>WAEC & JAMB Watchout:</b> ${topic.trap}`],
        ];
        const teachBeat: TeachBeat = {
          k: 'teach',
          kl: 'Mastery Summary Table',
          title: tableSpec.title,
          body,
        };
        beats.push(teachBeat);
      }

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
        kl: 'Worked Geographical Analysis',
        lv: pIdx === 0 ? 'full' : 'one',
        title: `Worked Example — ${part.title}`,
        q: part.ex.q,
        g: part.ex.g,
        steps: fadeSteps,
      });

      if (topic.spot && topic.spot.part === pIdx) {
        const sp = shuffleMcq(
          `spot|${topic.id}|${pIdx}`,
          topic.spot.o,
          topic.spot.a ?? 0,
          topic.spot.fb
        );
        beats.push({
          k: 'spot',
          kl: 'Spot the Geographical Trap',
          title: `Audit ${topic.spot.who}’s Notes`,
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

      const defaultFb = part.tryit.o.map((_, idx) =>
        idx === part.tryit.a
          ? `Spot on! ${part.tryit.e}`
          : `Review the geographical principle: ${part.tryit.e}`
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

export function buildGeogCurriculum(): {
  topics: Topic[];
  il: Record<string, InteractiveLesson>;
} {
  const rawTopics: Topic[] = [
    ...GEOG_TOPICS_PART1,
    ...GEOG_TOPICS_PART2,
    ...GEOG_TOPICS_PART3,
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
    il[t.id] = buildInteractiveForGeogTopic(t);
  }

  return { topics, il };
}
