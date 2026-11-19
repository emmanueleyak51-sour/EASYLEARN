import type { FormulaRearrangement } from './chemFormulas';

export type GeogFormulaCatId =
  | 'scale'
  | 'relief'
  | 'earth'
  | 'climate'
  | 'population';

export interface GeogFormulaCategory {
  id: GeogFormulaCatId | 'all';
  label: string;
  shortLabel: string;
  desc: string;
}

export interface GeogFormulaItem {
  id: string;
  cat: GeogFormulaCatId;
  name: string;
  topicId: string;
  summary: string;
  rearrangements: FormulaRearrangement[];
  variables: [string, string][];
  constants?: string[];
  trap: string;
  worked: {
    qHtml: string;
    stepsHtml: string[];
    ansHtml: string;
  };
  keywords: string[];
}

export const GEOG_FORMULA_CATEGORIES: GeogFormulaCategory[] = [
  {
    id: 'all',
    label: 'All Geography Calculations',
    shortLabel: 'All',
    desc: 'All 20 WAEC Paper 1 & Paper 3 Practical Geography equations across Map Scales, Contours/Gradient, Longitude/Time, Climate & Demography',
  },
  {
    id: 'scale',
    label: 'Map Scales, Distance, Area & Enlargement',
    shortLabel: 'Map Scales',
    desc: 'Representative Fraction (RF), Ground Distance, Map Area by Grid Squares & Map Reduction/Enlargement',
  },
  {
    id: 'relief',
    label: 'Contours, Slope Gradient & Vertical Exaggeration',
    shortLabel: 'Contours & Relief',
    desc: 'Vertical Interval (VI), Horizontal Equivalent (HE), Slope Gradient 1 in X, Percentage Slope & Vertical Exaggeration (VE)',
  },
  {
    id: 'earth',
    label: 'Longitude, Local Time, Latitude Distance & Solar Noon',
    shortLabel: 'Earth & Time',
    desc: 'Longitude-to-Time (15° = 1 hr / 1° = 4 min), Parallel/Meridian Ground Distance (111 km) & Noon Sun Altitude',
  },
  {
    id: 'climate',
    label: 'Environmental Lapse Rate & Climatic Statistics',
    shortLabel: 'Climate Stats',
    desc: 'Normal Lapse Rate (6.5 °C per 1,000 m), Diurnal/Annual Temperature Range, Mean Temp & Relative Humidity',
  },
  {
    id: 'population',
    label: 'Population Density, Growth & Dependency Ratios',
    shortLabel: 'Population',
    desc: 'Crude Population Density, Physiological Density, Crude Birth/Death Rates, Natural Increase & Dependency Ratio',
  },
];

export const GEOG_FORMULAS: GeogFormulaItem[] = [
  /* ─────────────── 1. MAP SCALES, DISTANCE, AREA & ENLARGEMENT (5) ─────────────── */
  {
    id: 'ggf-rf',
    cat: 'scale',
    name: 'Representative Fraction (RF) & Statement Scale Conversion',
    topicId: 'gg-map-scales',
    summary: 'Expresses map distance to ground distance in IDENTICAL units (cm : cm) using 1 km = 100,000 cm.',
    rearrangements: [
      { solveFor: 'RF', label: 'Representative Fraction', exprHtml: 'RF = Map Distance (cm) ÷ Ground Distance (cm) = 1 : D' },
      { solveFor: 'km', label: 'RF to Statement (1 cm to X km)', exprHtml: 'X km = D ÷ 100,000' },
      { solveFor: 'D', label: 'Statement to RF Denominator', exprHtml: 'D = (Ground km × 100,000) ÷ Map cm' },
    ],
    variables: [
      ['1 : D', 'Unitless Representative Fraction (numerator is ALWAYS 1!)'],
      ['100,000 cm', 'Exact number of centimetres in 1 kilometre (1,000 m × 100 cm)'],
    ],
    constants: ['1 : 50,000 ⇔ 1 cm to 0.5 km (2 cm to 1 km) · 1 : 100,000 ⇔ 1 cm to 1 km'],
    trap: '1 km equals 100,000 cm (FIVE zeros), NEVER 1,000 cm or 10,000 cm! And an RF carries NO units (never write 1 cm : 50,000 cm)!',
    worked: {
      qHtml: 'Convert the statement scale "2 cm represents 1 km" into a Representative Fraction (RF).',
      stepsHtml: ['2 cm : 100,000 cm', 'Divide both sides by 2 → 1 : 50,000'],
      ansHtml: '1 : 50,000',
    },
    keywords: ['representative fraction', 'rf', 'statement scale', '100000'],
  },
  {
    id: 'ggf-ground-dist',
    cat: 'scale',
    name: 'Actual Ground Distance from Map Measurement',
    topicId: 'gg-map-scales',
    summary: 'Converts straight-line or thread-measured map distance (cm) into actual ground distance (km) via the RF denominator.',
    rearrangements: [
      { solveFor: 'GD', label: 'Ground Distance (km)', exprHtml: 'GD (km) = [Map Distance (cm) × D] ÷ 100,000' },
      { solveFor: 'MD', label: 'Map Distance (cm)', exprHtml: 'MD (cm) = [Ground Distance (km) × 100,000] ÷ D' },
    ],
    variables: [
      ['MD', 'Measured length on map in centimetres (cm)'],
      ['D', 'RF scale denominator (e.g. 50,000 on standard Nigerian topo sheets)'],
      ['GD', 'Real-world horizontal distance in kilometres (km)'],
    ],
    trap: 'When measuring winding roads or rivers with a piece of white thread, mark start/end carefully without stretching the thread!',
    worked: {
      qHtml: 'Two towns are 14 cm apart on a 1 : 50,000 topographical map. Find the straight-line ground distance in km.',
      stepsHtml: ['GD = (14 × 50,000) ÷ 100,000 = 14 × 0.5 = 7 km'],
      ansHtml: '7 km',
    },
    keywords: ['ground distance', 'map distance', 'topographical'],
  },
  {
    id: 'ggf-area',
    cat: 'scale',
    name: 'Ground Area of Regular & Irregular Map Features',
    topicId: 'gg-map-scales',
    summary: 'Computes real-world ground area (km²) by converting map length AND width to km BEFORE multiplying (or via grid squares).',
    rearrangements: [
      { solveFor: 'rect', label: 'Rectangular Map Area', exprHtml: 'Ground Area (km<sup>2</sup>) = Ground Length (km) × Ground Width (km)' },
      { solveFor: 'grid', label: 'Irregular Grid-Square Method', exprHtml: 'Area = [Full Squares + (Partial Squares ÷ 2)] × Area of 1 Grid Square' },
    ],
    variables: [
      ['Ground L, W', 'Dimensions ALREADY converted from cm into km'],
      ['Area Factor', 'Area scales by the SQUARE of linear scale: (D ÷ 100,000)² km² per 1 cm²'],
    ],
    trap: 'NEVER multiply Map Area (cm²) by linear scale once! On a 1 : 50,000 map (1 cm = 0.5 km), 1 cm² = 0.5 × 0.5 = 0.25 km² (NOT 0.5 km²)!',
    worked: {
      qHtml: 'A forest reserve measures 8 cm by 6 cm on a 1 : 50,000 map. Calculate its actual ground area in km<sup>2</sup>.',
      stepsHtml: ['Ground Length = 8 × 0.5 = 4 km; Ground Width = 6 × 0.5 = 3 km', 'Ground Area = 4 km × 3 km = 12 km²'],
      ansHtml: '12 km<sup>2</sup>',
    },
    keywords: ['ground area', 'grid square', 'forest reserve'],
  },
  {
    id: 'ggf-enlarge-reduce',
    cat: 'scale',
    name: 'Map Enlargement & Map Reduction New Scale',
    topicId: 'gg-map-scales',
    summary: 'Determines the new RF scale and new frame dimensions when a topographical map is enlarged or reduced by factor k.',
    rearrangements: [
      { solveFor: 'enlarge', label: 'Enlarged by k Times', exprHtml: 'New RF = 1 : (D ÷ k) &nbsp;·&nbsp; New Side = Old Side × k' },
      { solveFor: 'reduce', label: 'Reduced to 1/k Times', exprHtml: 'New RF = 1 : (D × k) &nbsp;·&nbsp; New Side = Old Side ÷ k' },
    ],
    variables: [
      ['1 : D', 'Original map Representative Fraction'],
      ['k', 'Linear enlargement or reduction factor (k > 1)'],
    ],
    constants: ['Larger scale = SMALLER denominator (1:25,000 > 1:50,000) · Area changes by k²!'],
    trap: 'Counter-intuitive denominator rule! ENLARGING a 1 : 50,000 map 2 times DIVIDES the denominator to give 1 : 25,000 (NOT 1 : 100,000 — that is a reduction)!',
    worked: {
      qHtml: 'A 1 : 100,000 map is enlarged 4 times. Find the new Representative Fraction (RF).',
      stepsHtml: ['Enlarging makes the fraction LARGER (denominator smaller): D_new = 100,000 ÷ 4 = 25,000', 'New RF = 1 : 25,000'],
      ansHtml: '1 : 25,000',
    },
    keywords: ['enlargement', 'reduction', 'new scale', 'large scale'],
  },
  {
    id: 'ggf-bearing',
    cat: 'scale',
    name: 'Three-Figure True Bearing & Back Bearing',
    topicId: 'gg-map-scales',
    summary: 'Measures clockwise azimuth from True North (000°–360°) and converts forward bearing to back bearing via ±180°.',
    rearrangements: [
      { solveFor: 'back1', label: 'If Forward Bearing < 180°', exprHtml: 'Back Bearing = Forward Bearing + 180°' },
      { solveFor: 'back2', label: 'If Forward Bearing ≥ 180°', exprHtml: 'Back Bearing = Forward Bearing − 180°' },
    ],
    variables: [
      ['Forward Bearing of B from A', 'Clockwise angle measured at A from North to line AB'],
      ['Back Bearing (A from B)', 'Clockwise angle measured at B from North to line BA'],
    ],
    trap: 'Read the preposition "FROM" carefully! "Bearing of P FROM Q" means centre your protractor at Q (NOT P), and always write 3 digits (e.g. 045°)!',
    worked: {
      qHtml: 'The bearing of town X from town Y is 065°. Find the bearing of town Y from town X.',
      stepsHtml: ['Since 065° < 180°, add 180°: 065° + 180° = 245°'],
      ansHtml: '245°',
    },
    keywords: ['bearing', 'back bearing', 'true north', 'magnetic'],
  },

  /* ─────────────── 2. CONTOURS, GRADIENT & VERTICAL EXAGGERATION (4) ─────────────── */
  {
    id: 'ggf-gradient',
    cat: 'relief',
    name: 'Average Slope Gradient from Contours (1 in X)',
    topicId: 'gg-map-contours',
    summary: 'Expresses slope steepness between two contour heights as the unit ratio Vertical Interval ÷ Horizontal Equivalent.',
    rearrangements: [
      { solveFor: 'grad', label: 'Unit Ratio Form', exprHtml: 'Gradient = VI (m) ÷ HE (m) = 1 in (HE ÷ VI)' },
      { solveFor: 'pct', label: 'Percentage Slope', exprHtml: 'Slope (%) = [VI (m) ÷ HE (m)] × 100%' },
    ],
    variables: [
      ['VI', 'Vertical Interval = |Height₂ − Height₁| in metres (m)'],
      ['HE', 'Horizontal Equivalent = ground distance between the two points converted to metres (m)!'],
    ],
    constants: ['1 in 5 is STEEPER than 1 in 40 (smaller denominator = steeper slope!)'],
    trap: 'Both VI and HE MUST be in the SAME unit (metres)! Convert ground km to metres (× 1,000) before dividing HE by VI!',
    worked: {
      qHtml: 'Point A (150 m) and Point B (450 m) are 6 km apart on the ground. Calculate the gradient between A and B.',
      stepsHtml: ['VI = 450 − 150 = 300 m; HE = 6 km × 1,000 = 6,000 m', 'Gradient = 300 ÷ 6,000 = 1 ÷ 20 = 1 in 20'],
      ansHtml: '1 in 20',
    },
    keywords: ['gradient', 'vertical interval', 'horizontal equivalent', 'slope'],
  },
  {
    id: 'ggf-ve',
    cat: 'relief',
    name: 'Vertical Exaggeration (VE) of a Relief Cross-Section',
    topicId: 'gg-map-contours',
    summary: 'Measures how many times the vertical scale of a drawn cross-section is stretched relative to the map’s horizontal scale.',
    rearrangements: [
      { solveFor: 'VE', label: 'Scale Ratio Form', exprHtml: 'VE = Vertical Scale (VS) ÷ Horizontal Scale (HS) = D<sub>H</sub> ÷ D<sub>V</sub>' },
      { solveFor: 'DV', label: 'Vertical RF Denominator', exprHtml: 'D<sub>V</sub> = (Metres per 1 cm on y-axis) × 100' },
    ],
    variables: [
      ['D<sub>H</sub>', 'Horizontal RF denominator of the map (e.g. 50,000)'],
      ['D<sub>V</sub>', 'Vertical RF denominator (convert vertical m per cm into cm by × 100!)'],
    ],
    trap: 'Convert the vertical scale "1 cm to 50 m" into RF first: 50 m = 5,000 cm (× 100, NOT × 1,000!), then VE = 50,000 ÷ 5,000 = 10 times!',
    worked: {
      qHtml: 'A cross-section from a 1 : 50,000 map uses a vertical scale of 1 cm to 100 m. Calculate the Vertical Exaggeration.',
      stepsHtml: ['Vertical RF: 100 m = 10,000 cm → VS = 1 : 10,000', 'VE = (1/10,000) ÷ (1/50,000) = 50,000 ÷ 10,000 = 5 times'],
      ansHtml: '5 times (×5)',
    },
    keywords: ['vertical exaggeration', 'cross section', 'profile'],
  },
  {
    id: 'ggf-ci-interp',
    cat: 'relief',
    name: 'Contour Interval (CI) & Spot-Height Estimation',
    topicId: 'gg-map-contours',
    summary: 'Finds the constant vertical step between adjacent contour lines from numbered index contours.',
    rearrangements: [
      { solveFor: 'CI', label: 'Contour Interval', exprHtml: 'CI = (Higher Index Contour − Lower Index Contour) ÷ Number of Spaces' },
    ],
    variables: [
      ['Index Contours', 'Thickened labeled contour lines (e.g. 100 m and 300 m)'],
      ['Spaces', 'Number of intervals (steps) between the two labeled contours (= lines between + 1)'],
    ],
    trap: 'Divide by the number of SPACES between the two index contours, NEVER by the number of unnumbered lines in between!',
    worked: {
      qHtml: 'Between the 200 m and 400 m index contours there are 3 unnumbered contour lines. Find the Contour Interval.',
      stepsHtml: ['3 intermediate lines create 4 equal spaces', 'CI = (400 − 200) ÷ 4 = 200 ÷ 4 = 50 m'],
      ansHtml: '50 m',
    },
    keywords: ['contour interval', 'index contour', 'spot height'],
  },
  {
    id: 'ggf-drainage-density',
    cat: 'relief',
    name: 'Drainage Density & Bifurcation Ratio',
    topicId: 'gg-rivers-fluvial',
    summary: 'Quantifies river-network dissection per km² of basin area and Strahler stream-order branching.',
    rearrangements: [
      { solveFor: 'DD', label: 'Drainage Density', exprHtml: 'D<sub>d</sub> = Total Stream Length ∑L (km) ÷ Basin Area A (km<sup>2</sup>)' },
      { solveFor: 'Rb', label: 'Bifurcation Ratio', exprHtml: 'R<sub>b</sub> = N<sub>u</sub> ÷ N<sub>u+1</sub>' },
    ],
    variables: [
      ['∑L', 'Total length of all permanent/seasonal streams inside the watershed (km)'],
      ['A', 'Total catchment area of the drainage basin (km²)'],
    ],
    trap: 'Impermeable clay/granite rocks and heavy downpours produce HIGH drainage density; permeable chalk/limestone produces very LOW surface drainage density!',
    worked: {
      qHtml: 'A catchment of area 40 km<sup>2</sup> contains streams of total length 100 km. Calculate its drainage density.',
      stepsHtml: ['D<sub>d</sub> = 100 km ÷ 40 km² = 2.5 km/km² (km⁻¹)'],
      ansHtml: '2.5 km<sup>−1</sup>',
    },
    keywords: ['drainage density', 'bifurcation', 'watershed', 'stream order'],
  },

  /* ─────────────── 3. LONGITUDE, TIME, LATITUDE DISTANCE & SOLAR NOON (4) ─────────────── */
  {
    id: 'ggf-long-time',
    cat: 'earth',
    name: 'Longitude & Local Time Calculation',
    topicId: 'gg-lat-long-time',
    summary: 'Relates Earth’s 360° West-to-East rotation in 24 hours (15° = 1 hr; 1° = 4 min) to local solar time differences.',
    rearrangements: [
      { solveFor: 'time', label: 'Longitude Difference → Time', exprHtml: 'Δt (hours) = Δθ° ÷ 15° &nbsp;·&nbsp; Δt (min) = Δθ° × 4' },
      { solveFor: 'long', label: 'Time Difference → Longitude', exprHtml: 'Δθ° = Δt (hours) × 15° = Δt (min) ÷ 4' },
    ],
    variables: [
      ['Δθ°', 'Same hemisphere (E & E or W & W) ⇒ SUBTRACT; Opposite hemispheres (W & E) ⇒ ADD!'],
      ['East vs West Rule', 'Going EAST = ADD time ("East Gain Add"); Going WEST = SUBTRACT time ("West Lose Subtract")'],
    ],
    constants: ['Nigeria Standard Time (WAT) = 15°E = GMT + 1 hour'],
    trap: 'Crossing 0° Greenwich Meridian (e.g. 30°W to 45°E) ADDS the longitudes (30° + 45° = 75° = 5 hrs)! And crossing 180° IDL West→East repeats a calendar day (subtracts 1 date)!',
    worked: {
      qHtml: 'A live match kicks off in London (0°) at 4:00 p.m. What is the local time in Tokyo (135°E)?',
      stepsHtml: ['Δθ = 135° − 0° = 135°; Δt = 135° ÷ 15° = 9 hours', 'Tokyo is EAST of 0° → ADD 9 hours to 16:00 → 01:00 a.m. next day'],
      ansHtml: '1:00 a.m. (next day)',
    },
    keywords: ['longitude', 'local time', 'gmt', 'wat', '15 degrees'],
  },
  {
    id: 'ggf-lat-dist',
    cat: 'earth',
    name: 'Ground Distance Along a Meridian (North–South Latitude)',
    topicId: 'gg-lat-long-time',
    summary: 'Calculates true ground distance along any meridian of longitude using 1° of latitude ≈ 111 km.',
    rearrangements: [
      { solveFor: 'dist', label: 'Meridian Distance', exprHtml: 'Distance (km) = Δφ° × 111 km' },
      { solveFor: 'par', label: 'Along Parallel φ (East–West)', exprHtml: 'Distance<sub>E–W</sub> = Δθ° × 111 km × cos φ' },
    ],
    variables: [
      ['Δφ°', 'Latitudinal difference: Same hemisphere (N–N or S–S) ⇒ SUBTRACT; Opposite (N–S) ⇒ ADD!'],
      ['111 km', '40,000 km circumference ÷ 360° ≈ 111.1 km per 1° along any Great Circle'],
    ],
    trap: '1° = 111 km holds unconditionally along ANY meridian (N–S), whereas along a parallel of latitude φ (E–W) it shrinks by cos φ (e.g. 111 × 0.5 = 55.5 km at 60°N)!',
    worked: {
      qHtml: 'Calculate the straight meridian distance between Town P (12°N, 8°E) and Town Q (6°S, 8°E).',
      stepsHtml: ['Opposite hemispheres (N and S) → ADD: Δφ = 12° + 6° = 18°', 'Distance = 18 × 111 km = 1,998 km'],
      ansHtml: '1,998 km',
    },
    keywords: ['latitude distance', '111 km', 'meridian', 'parallel'],
  },
  {
    id: 'ggf-solar-noon',
    cat: 'earth',
    name: 'Angle of Elevation of the Midday (Noon) Sun',
    topicId: 'gg-solar-earth',
    summary: 'Computes the noon altitude of the overhead sun at latitude φ given solar declination δ (Equinox 0°, Tropics ±23½°).',
    rearrangements: [
      { solveFor: 'A', label: 'Noon Sun Altitude', exprHtml: 'Altitude A = 90° − |φ ∓ δ| &nbsp;(Zenith Distance Z = |φ ∓ δ|)' },
    ],
    variables: [
      ['φ', 'Observer’s latitude'],
      ['δ', 'Overhead sun latitude: 0° (21 Mar / 23 Sept), 23.5°N (21 June), 23.5°S (22 Dec)'],
    ],
    constants: ['Same hemisphere ⇒ Zenith dist = |φ − δ| · Opposite hemispheres ⇒ Zenith dist = φ + δ'],
    trap: 'On June 21 (Sun overhead at 23.5°N), a station at 10°N is in the SAME hemisphere so Z = |10° − 23.5°| = 13.5° ⇒ Altitude = 90° − 13.5° = 76.5° (never exceed 90°)!',
    worked: {
      qHtml: 'Find the noon altitude of the sun at Kano (12°N) during the March 21 Equinox.',
      stepsHtml: ['At Equinox, overhead sun is at Equator (δ = 0°)', 'Altitude = 90° − |12° − 0°| = 78°'],
      ansHtml: '78°',
    },
    keywords: ['noon sun', 'equinox', 'solstice', 'tropic of cancer'],
  },
  {
    id: 'ggf-rev-speed',
    cat: 'earth',
    name: 'Earth’s Linear Rotational Speed & Twilight Latitude Rule',
    topicId: 'gg-solar-earth',
    summary: 'Shows how rotational surface speed v = 1,670 cos φ km/h drops from max at the Equator to zero at the Poles.',
    rearrangements: [
      { solveFor: 'v', label: 'Rotational Speed at Latitude φ', exprHtml: 'v<sub>φ</sub> ≈ 1,670 × cos φ (km/h)' },
    ],
    variables: [
      ['1,670 km/h', 'Equatorial rotational speed (40,075 km ÷ 24 h)'],
      ['φ', 'Latitude (0° Equator → cos 0° = 1; 90° Pole → cos 90° = 0)'],
    ],
    trap: 'Briefest dawn/twilight occurs at the EQUATOR because the sun rises and sets almost vertically through the horizon, whereas high latitudes experience prolonged twilight!',
    worked: {
      qHtml: 'Estimate Earth’s linear rotational speed at latitude 60°N given equatorial speed 1,670 km/h.',
      stepsHtml: ['cos 60° = 0.5 → v = 1,670 × 0.5 = 835 km/h'],
      ansHtml: '835 km/h',
    },
    keywords: ['rotation speed', 'equator', 'twilight', 'coriolis'],
  },

  /* ─────────────── 4. ENVIRONMENTAL LAPSE RATE & CLIMATIC STATS (4) ─────────────── */
  {
    id: 'ggf-lapse-rate',
    cat: 'climate',
    name: 'Normal Environmental Lapse Rate (Altitude–Temperature)',
    topicId: 'gg-climate-koppen',
    summary: 'Calculates air temperature drop on ascending mountains or rise on descending valleys at 6.5 °C per 1,000 m.',
    rearrangements: [
      { solveFor: 'Thigh', label: 'Ascending to Higher Altitude', exprHtml: 'T<sub>2</sub> = T<sub>1</sub> − [0.0065 × (h<sub>2</sub> − h<sub>1</sub>)]' },
      { solveFor: 'Tlow', label: 'Descending to Lower Altitude', exprHtml: 'T<sub>2</sub> = T<sub>1</sub> + [0.0065 × (h<sub>1</sub> − h<sub>2</sub>)]' },
    ],
    variables: [
      ['6.5 °C / 1,000 m', 'Normal Environmental Lapse Rate (0.65 °C per 100 m) in the troposphere'],
      ['h<sub>1</sub>, h<sub>2</sub>', 'Station elevations above sea level in metres (m)'],
    ],
    trap: 'Check whether you are going UP (cooler → SUBTRACT ΔT) or DOWN toward sea level (warmer → ADD ΔT)!',
    worked: {
      qHtml: 'Temperature at sea level (0 m) is 30 °C. Using a lapse rate of 6.5 °C per 1,000 m, find the temperature atop a 2,000 m plateau.',
      stepsHtml: ['Δh = 2,000 m → ΔT = 2 × 6.5 = 13 °C drop', 'T = 30 − 13 = 17 °C'],
      ansHtml: '17 °C',
    },
    keywords: ['lapse rate', 'altitude', 'troposphere', 'temperature drop'],
  },
  {
    id: 'ggf-temp-range',
    cat: 'climate',
    name: 'Diurnal & Annual Temperature Range & Mean Temperature',
    topicId: 'gg-weather-elements',
    summary: 'Computes daily/annual temperature spread and averages from synoptic station records.',
    rearrangements: [
      { solveFor: 'diurnal', label: 'Diurnal Range & Daily Mean', exprHtml: 'Diurnal Range = T<sub>max</sub> − T<sub>min</sub> &nbsp;·&nbsp; Daily Mean = (T<sub>max</sub> + T<sub>min</sub>) ÷ 2' },
      { solveFor: 'annual', label: 'Annual Temp Range & Mean', exprHtml: 'Annual Range = Hottest Month − Coolest Month &nbsp;·&nbsp; Mean = (∑12 Months) ÷ 12' },
    ],
    variables: [
      ['Annual Range', 'Small (2–3 °C) in Equatorial Af climates; Large (>12 °C) in continental deserts/Sahel'],
    ],
    trap: 'Annual Rainfall is the SUM of all 12 monthly totals (NEVER divide annual rainfall by 12 unless explicitly asked for mean monthly rainfall!), whereas Mean Annual Temperature ALWAYS divides the 12-month sum by 12!',
    worked: {
      qHtml: 'A station’s hottest month averages 31 °C (April) and coolest month averages 22 °C (August). Find the Annual Temperature Range.',
      stepsHtml: ['Annual Range = 31 °C − 22 °C = 9 °C'],
      ansHtml: '9 °C',
    },
    keywords: ['annual range', 'diurnal range', 'mean temperature', 'climograph'],
  },
  {
    id: 'ggf-rh',
    cat: 'climate',
    name: 'Relative Humidity (%) from Vapour Pressure',
    topicId: 'gg-weather-elements',
    summary: 'Expresses actual water vapour in air as a percentage of saturation capacity at the same temperature.',
    rearrangements: [
      { solveFor: 'RH', label: 'Relative Humidity', exprHtml: 'RH (%) = (Actual Vapour Content ÷ Saturation Capacity) × 100%' },
    ],
    variables: [
      ['Actual Content', 'Absolute humidity (g/m³) or actual vapour pressure (mb) present'],
      ['Saturation Capacity', 'Maximum vapour air can hold at that temperature (rises exponentially with T)'],
    ],
    constants: ['RH = 100% ⇒ Saturated air at Dew Point (Wet-bulb depression = 0 °C)'],
    trap: 'Warming unsaturated air without adding moisture INCREASES saturation capacity and therefore LOWERS Relative Humidity!',
    worked: {
      qHtml: 'At 28 °C, 1 m<sup>3</sup> of air holds 18 g of water vapour out of a saturation capacity of 24 g. Find Relative Humidity.',
      stepsHtml: ['RH = (18 ÷ 24) × 100% = 0.75 × 100% = 75%'],
      ansHtml: '75%',
    },
    keywords: ['relative humidity', 'hygrometer', 'dew point', 'saturation'],
  },
  {
    id: 'ggf-annual-rain',
    cat: 'climate',
    name: 'Mean Annual Rainfall & Rainfall Variability',
    topicId: 'gg-weather-elements',
    summary: 'Totals 12 monthly rain-gauge readings for annual rainfall and averages over 30–35 years for climatic normals.',
    rearrangements: [
      { solveFor: 'tot', label: 'Total Annual Rainfall', exprHtml: 'R<sub>annual</sub> = ∑<sub>m=1</sub><sup>12</sup> R<sub>m</sub> (mm)' },
      { solveFor: 'norm', label: 'N-Year Mean Annual Rainfall', exprHtml: 'R̄ = (∑<sub>y=1</sub><sup>N</sup> R<sub>y</sub>) ÷ N' },
    ],
    variables: [
      ['R<sub>m</sub>', 'Monthly rainfall collected in copper rain gauge (mm)'],
      ['35 years', 'Standard WMO/climatological baseline period defining Climate vs Weather'],
    ],
    trap: 'Equatorial double-maxima stations (e.g. Lagos, Warri) show TWO rainfall peaks (June & Sept/Oct) separated by the brief August Break ("Little Dry Season")!',
    worked: {
      qHtml: 'Five consecutive years record annual rainfalls of 1150, 1220, 1180, 1250, and 1200 mm. Find the 5-year mean annual rainfall.',
      stepsHtml: ['Sum = 6,000 mm', 'Mean = 6,000 ÷ 5 = 1,200 mm'],
      ansHtml: '1,200 mm',
    },
    keywords: ['annual rainfall', 'rain gauge', 'double maxima', 'august break'],
  },

  /* ─────────────── 5. POPULATION DENSITY, GROWTH & DEPENDENCY (3) ─────────────── */
  {
    id: 'ggf-pop-density',
    cat: 'population',
    name: 'Crude & Physiological Population Density',
    topicId: 'gg-world-pop',
    summary: 'Measures average population pressure per km² of total land area or per km² of arable farmland.',
    rearrangements: [
      { solveFor: 'crude', label: 'Crude Population Density', exprHtml: 'Density = Total Population ÷ Total Land Area (persons / km<sup>2</sup>)' },
      { solveFor: 'phys', label: 'Physiological Density', exprHtml: 'Physiological Density = Total Population ÷ Arable Land Area' },
      { solveFor: 'pop', label: 'Solve for Total Population', exprHtml: 'Total Population = Density × Land Area' },
    ],
    variables: [
      ['Total Land Area', 'Excludes major open water bodies when specified (km²)'],
      ['Arable Land', 'Cultivable agricultural land only (high in Egypt’s Nile Valley!)'],
    ],
    trap: 'High population (e.g. Russia/Brazil) does NOT automatically mean high population density; small land-area nations/states (Monaco, Singapore, Lagos, Anambra) have far higher densities!',
    worked: {
      qHtml: 'A state of land area 4,000 km<sup>2</sup> has a population of 3,200,000. Calculate its crude population density.',
      stepsHtml: ['Density = 3,200,000 ÷ 4,000 = 800 persons per km²'],
      ansHtml: '800 persons/km<sup>2</sup>',
    },
    keywords: ['population density', 'physiological density', 'arable'],
  },
  {
    id: 'ggf-cbr-cdr',
    cat: 'population',
    name: 'Crude Birth Rate, Crude Death Rate & Rate of Natural Increase',
    topicId: 'gg-world-pop',
    summary: 'Expresses annual live births and deaths per 1,000 mid-year population and converts natural increase into %.',
    rearrangements: [
      { solveFor: 'cbr', label: 'CBR & CDR (per 1,000)', exprHtml: 'CBR = (Births ÷ Pop) × 1,000 &nbsp;·&nbsp; CDR = (Deaths ÷ Pop) × 1,000' },
      { solveFor: 'rni', label: 'Rate of Natural Increase (%)', exprHtml: 'RNI (%) = (CBR − CDR) ÷ 10' },
    ],
    variables: [
      ['CBR, CDR', 'Quoted per 1,000 people per year (‰)'],
      ['RNI (%)', 'Divide per-1,000 difference by 10 to convert to percentage (%); Doubling time ≈ 70 ÷ RNI%'],
    ],
    trap: 'CBR and CDR are per 1,000 (NOT per 100!), so if CBR = 38‰ and CDR = 13‰, RNI is (38 − 13) ÷ 10 = 2.5% per year (NOT 25%)!',
    worked: {
      qHtml: 'A country has a Crude Birth Rate of 40 per 1,000 and Crude Death Rate of 12 per 1,000. Find its annual Rate of Natural Increase (%) and approximate doubling time.',
      stepsHtml: ['RNI = (40 − 12) ÷ 10 = 2.8% per annum', 'Doubling time ≈ 70 ÷ 2.8 = 25 years'],
      ansHtml: '2.8% p.a. (Doubles in ~25 yrs)',
    },
    keywords: ['birth rate', 'death rate', 'natural increase', 'doubling time'],
  },
  {
    id: 'ggf-dep-ratio',
    cat: 'population',
    name: 'Demographic Dependency Ratio',
    topicId: 'gg-world-pop',
    summary: 'Compares economically dependent age cohorts (children 0–14 + elderly 65+) against the productive labour cohort (15–64).',
    rearrangements: [
      { solveFor: 'DR', label: 'Dependency Ratio (%)', exprHtml: 'DR = [(Pop<sub>0–14</sub> + Pop<sub>65+</sub>) ÷ Pop<sub>15–64</sub>] × 100' },
    ],
    variables: [
      ['Pop<sub>0–14</sub> + Pop<sub>65+</sub>', 'Non-working dependent population'],
      ['Pop<sub>15–64</sub>', 'Economically active age group'],
    ],
    trap: 'Divide dependants strictly by the WORKING-AGE group (15–64), NEVER by the country’s grand total population!',
    worked: {
      qHtml: 'In a nation of 100 million, 42m are aged 0–14, 53m are aged 15–64, and 5m are aged 65+. Calculate the Dependency Ratio.',
      stepsHtml: ['Dependants = 42 + 5 = 47m', 'DR = (47 ÷ 53) × 100 ≈ 88.7%'],
      ansHtml: '88.7%',
    },
    keywords: ['dependency ratio', 'age structure', 'population pyramid'],
  },
];
