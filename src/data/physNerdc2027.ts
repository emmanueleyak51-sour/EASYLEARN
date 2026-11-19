import type { ChemClassId, Topic } from '../types';
import type { ChemClassMeta } from './chemNerdc2027';

export const PHYS_CLASSES: ChemClassMeta[] = [
  {
    id: 'ss1',
    label: 'SS 1',
    shortLabel: 'SS 1',
    fullTitle: 'SS 1 Physics',
    kicker: 'NERDC Year 1 · Mechanics, Matter & Basic Electricity',
    description:
      'Units & dimensions, motion, scalars/vectors, Newton’s laws, work/energy, fluids, elasticity, thermal expansion & DC circuits.',
  },
  {
    id: 'ss2',
    label: 'SS 2',
    shortLabel: 'SS 2',
    fullTitle: 'SS 2 Physics',
    kicker: 'NERDC Year 2 · Dynamics, Heat, Waves & Optics',
    description:
      'Projectiles, equilibrium & moments, SHM, machines, calorimetry, gas laws, waves, sound, reflection, refraction & lenses.',
  },
  {
    id: 'ss3',
    label: 'SS 3',
    shortLabel: 'SS 3',
    fullTitle: 'SS 3 Physics',
    kicker: 'NERDC Year 3 · Fields, AC, Modern & Electronics',
    description:
      'Gravitational & electric fields, capacitors, electrolysis, electromagnetism, induction, AC RLC circuits, atomic, nuclear & semiconductors.',
  },
  {
    id: 'all',
    label: 'All Classes',
    shortLabel: 'All',
    fullTitle: 'Complete Physics (SS1–SS3)',
    kicker: 'National Curriculum · 32 Topics',
    description:
      'Complete Nigerian NERDC SS1–SS3 Physics curriculum covering mechanics, thermal physics, waves & optics, electricity, fields, and modern physics.',
  },
];

export type PhysDomainId = 'mechanics' | 'thermal' | 'waves' | 'electricity' | 'modern';

export interface PhysNerdcTopicPlacement {
  classId: 'ss1' | 'ss2' | 'ss3';
  term: 1 | 2 | 3;
  termLabel: 'First Term' | 'Second Term' | 'Third Term';
  nerdcTheme:
    | 'Interaction of Matter, Space & Time'
    | 'Conservation Principles'
    | 'Waves — Motion Without Material Transfer'
    | 'Fields at Rest & in Motion'
    | 'Energy Quantization & Duality of Matter'
    | 'Physics in Technology';
  order: number;
  domain: PhysDomainId;
  keywords: string[];
}

export const PHYS_NERDC_MAP: Record<string, PhysNerdcTopicPlacement> = {
  // ─────────────────────────── SS 1 (11 Topics) ───────────────────────────
  'p-units': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Interaction of Matter, Space & Time',
    order: 1,
    domain: 'mechanics',
    keywords: ['si units', 'dimensions', 'vernier callipers', 'micrometer screw gauge', 'fundamental', 'derived'],
  },
  'p-motion': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Interaction of Matter, Space & Time',
    order: 2,
    domain: 'mechanics',
    keywords: ['speed', 'velocity', 'acceleration', 'suvat', 'velocity-time graph', 'friction', 'free fall'],
  },
  'p-vectors': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Interaction of Matter, Space & Time',
    order: 3,
    domain: 'mechanics',
    keywords: ['scalars', 'vectors', 'resultant', 'parallelogram law', 'components', 'relative velocity'],
  },
  'p-newton': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Conservation Principles',
    order: 4,
    domain: 'mechanics',
    keywords: ['inertia', 'momentum', 'impulse', 'recoil', 'collisions', 'apparent weight', 'lift'],
  },
  'p-work': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Conservation Principles',
    order: 5,
    domain: 'mechanics',
    keywords: ['work', 'kinetic energy', 'potential energy', 'power', 'efficiency', 'kilowatt', 'pendulum'],
  },
  'p-fluids': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Interaction of Matter, Space & Time',
    order: 6,
    domain: 'mechanics',
    keywords: ['density', 'relative density', 'pressure', 'pascal', 'hydraulic press', 'archimedes', 'upthrust', 'flotation', 'hydrometer'],
  },
  'p-elastic': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Interaction of Matter, Space & Time',
    order: 7,
    domain: 'mechanics',
    keywords: ['hooke', 'elasticity', 'young modulus', 'stress', 'strain', 'spring energy', 'surface tension', 'capillarity', 'viscosity'],
  },
  'p-expansion': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Conservation Principles',
    order: 8,
    domain: 'thermal',
    keywords: ['thermometer', 'kelvin', 'linear expansivity', 'area expansivity', 'cubic expansivity', 'bimetallic', 'anomalous water'],
  },
  'p-heat-trans': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Conservation Principles',
    order: 9,
    domain: 'thermal',
    keywords: ['conduction', 'convection', 'radiation', 'thermos flask', 'land breeze', 'sea breeze', 'blackbody'],
  },
  'p-electrostatics': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Fields at Rest & in Motion',
    order: 10,
    domain: 'electricity',
    keywords: ['gold-leaf electroscope', 'charging by induction', 'lightning conductor', 'point discharge', 'faraday ice pail'],
  },
  'p-dc-circuits': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Fields at Rest & in Motion',
    order: 11,
    domain: 'electricity',
    keywords: ['ohm law', 'series resistors', 'parallel resistors', 'emf', 'internal resistance', 'electrical energy', 'kilowatt-hour', 'fuse'],
  },

  // ─────────────────────────── SS 2 (11 Topics) ───────────────────────────
  'p-projectiles': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Interaction of Matter, Space & Time',
    order: 1,
    domain: 'mechanics',
    keywords: ['projectile', 'time of flight', 'maximum height', 'horizontal range', 'trajectory', '45 degrees'],
  },
  'p-equilibrium': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Interaction of Matter, Space & Time',
    order: 2,
    domain: 'mechanics',
    keywords: ['moment', 'torque', 'couple', 'principle of moments', 'centre of gravity', 'stability', 'lami', 'triangle of forces'],
  },
  'p-shm': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Interaction of Matter, Space & Time',
    order: 3,
    domain: 'mechanics',
    keywords: ['simple harmonic motion', 'simple pendulum', 'loaded spring', 'angular frequency', 'resonance', 'damping'],
  },
  'p-machines': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Physics in Technology',
    order: 4,
    domain: 'mechanics',
    keywords: ['mechanical advantage', 'velocity ratio', 'efficiency', 'pulley', 'block and tackle', 'inclined plane', 'screw jack', 'wheel and axle'],
  },
  'p-calorimetry': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Conservation Principles',
    order: 5,
    domain: 'thermal',
    keywords: ['specific heat capacity', 'heat capacity', 'method of mixtures', 'specific latent heat', 'fusion', 'vaporization', 'regelation'],
  },
  'p-gas-laws': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Conservation Principles',
    order: 6,
    domain: 'thermal',
    keywords: ['boyle law', 'charles law', 'pressure law', 'general gas equation', 'kinetic theory', 'saturated vapour pressure', 'dew point', 'humidity'],
  },
  'p-waves': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Waves — Motion Without Material Transfer',
    order: 7,
    domain: 'waves',
    keywords: ['transverse', 'longitudinal', 'wavelength', 'frequency', 'wave equation', 'progressive wave', 'stationary wave', 'polarization', 'diffraction'],
  },
  'p-sound': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Waves — Motion Without Material Transfer',
    order: 8,
    domain: 'waves',
    keywords: ['echo', 'sonar', 'pitch', 'loudness', 'timbre', 'beats', 'closed pipe', 'open pipe', 'sonometer', 'overtones', 'harmonics'],
  },
  'p-reflection': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Waves — Motion Without Material Transfer',
    order: 9,
    domain: 'waves',
    keywords: ['rectilinear propagation', 'pinhole camera', 'plane mirror', 'inclined mirrors', 'concave mirror', 'convex mirror', 'mirror formula', 'magnification'],
  },
  'p-refraction': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Waves — Motion Without Material Transfer',
    order: 10,
    domain: 'waves',
    keywords: ['snell law', 'refractive index', 'real depth', 'apparent depth', 'critical angle', 'total internal reflection', 'optical fibre', 'triangular prism'],
  },
  'p-lenses': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Waves — Motion Without Material Transfer',
    order: 11,
    domain: 'waves',
    keywords: ['converging lens', 'diverging lens', 'lens power', 'dioptre', 'myopia', 'hypermetropia', 'microscope', 'telescope', 'dispersion', 'electromagnetic spectrum'],
  },

  // ─────────────────────────── SS 3 (10 Topics) ───────────────────────────
  'p-gravitation': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Fields at Rest & in Motion',
    order: 1,
    domain: 'mechanics',
    keywords: ['newton gravitation', 'gravitational field strength', 'gravitational potential', 'orbital velocity', 'escape velocity', 'geostationary satellite', 'kepler'],
  },
  'p-efield-cap': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Fields at Rest & in Motion',
    order: 2,
    domain: 'electricity',
    keywords: ['coulomb law', 'electric field intensity', 'electric potential', 'capacitance', 'parallel plate capacitor', 'dielectric', 'capacitor energy'],
  },
  'p-elec-meas': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Physics in Technology',
    order: 3,
    domain: 'electricity',
    keywords: ['resistivity', 'wheatstone bridge', 'metre bridge', 'potentiometer', 'shunt', 'multiplier', 'galvanometer'],
  },
  'p-electrolysis-cell': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Physics in Technology',
    order: 4,
    domain: 'electricity',
    keywords: ['leclanche cell', 'lead-acid accumulator', 'polarization', 'local action', 'faraday electrolysis', 'electrochemical equivalent', 'thermionic emission'],
  },
  'p-magnetism': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Fields at Rest & in Motion',
    order: 5,
    domain: 'electricity',
    keywords: ['magnetic flux', 'angle of declination', 'angle of dip', 'soft iron', 'steel', 'fleming left hand rule', 'F = BIL', 'lorentz force', 'dc motor'],
  },
  'p-induction': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Fields at Rest & in Motion',
    order: 6,
    domain: 'electricity',
    keywords: ['faraday law', 'lenz law', 'ac generator', 'slip rings', 'split-ring commutator', 'transformer', 'eddy currents', 'self inductance', 'high-voltage transmission'],
  },
  'p-ac-circuits': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Fields at Rest & in Motion',
    order: 7,
    domain: 'electricity',
    keywords: ['rms current', 'peak voltage', 'capacitive reactance', 'inductive reactance', 'impedance', 'rlc resonance', 'phase angle', 'power factor'],
  },
  'p-atomic-quantum': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Energy Quantization & Duality of Matter',
    order: 8,
    domain: 'modern',
    keywords: ['bohr energy levels', 'photon', 'planck', 'photoelectric effect', 'work function', 'stopping potential', 'x-rays', 'de broglie', 'heisenberg'],
  },
  'p-nuclear': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Energy Quantization & Duality of Matter',
    order: 9,
    domain: 'modern',
    keywords: ['alpha decay', 'beta decay', 'gamma rays', 'half-life', 'decay constant', 'mass defect', 'binding energy', 'fission', 'fusion', 'moderator', 'control rods'],
  },
  'p-electronics': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Physics in Technology',
    order: 10,
    domain: 'modern',
    keywords: ['intrinsic semiconductor', 'n-type', 'p-type', 'doping', 'p-n junction diode', 'rectification', 'transistor', 'logic gates', 'nand', 'nor', 'xor', 'optical fibre', 'laser'],
  },
};

export function getPhysClassMeta(classId?: ChemClassId): ChemClassMeta {
  return PHYS_CLASSES.find((c) => c.id === (classId || 'all')) || PHYS_CLASSES[3];
}

export function filterPhysTopicsByClass(topics: Topic[], classId?: ChemClassId): Topic[] {
  if (!classId || classId === 'all') return topics;
  return topics
    .filter((t) => PHYS_NERDC_MAP[t.id]?.classId === classId)
    .sort((a, b) => (PHYS_NERDC_MAP[a.id]?.order ?? 99) - (PHYS_NERDC_MAP[b.id]?.order ?? 99));
}
