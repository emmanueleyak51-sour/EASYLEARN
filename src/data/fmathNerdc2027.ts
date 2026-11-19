import type { ChemClassId, Topic } from '../types';
import type { ChemClassMeta } from './chemNerdc2027';

export const FMATH_CLASSES: ChemClassMeta[] = [
  {
    id: 'ss1',
    label: 'SS 1',
    shortLabel: 'SS 1',
    fullTitle: 'SS 1 Further Mathematics',
    kicker: 'NERDC Year 1 · Logic, Binary Ops, Surds/Logs, Roots, Polynomials & 2D Vectors',
    description:
      'Sets & truth tables, binary operations, advanced surds & logarithms, mappings & inverses, AP/GP series, α & β quadratic roots, polynomials, rational inequalities, straight-line geometry & 2D vectors.',
  },
  {
    id: 'ss2',
    label: 'SS 2',
    shortLabel: 'SS 2',
    fullTitle: 'SS 2 Further Mathematics',
    kicker: 'NERDC Year 2 · Compound Trig, Binomial, Circles, Differential Calculus, Projectiles & Probability',
    description:
      'Compound & double-angle trig, general binomial series, permutations & combinations, circle geometry, limits & differentiation rules, stationary optimization, 3D cross products, projectiles & Binomial/Poisson laws.',
  },
  {
    id: 'ss3',
    label: 'SS 3',
    shortLabel: 'SS 3',
    fullTitle: 'SS 3 Further Mathematics',
    kicker: 'NERDC Year 3 · Matrices, Complex Numbers, Conics, Integral Calculus, ODEs, Mechanics & Correlation',
    description:
      '3×3 determinants & Cramer’s rule, partial fractions, complex numbers & De Moivre, conic sections, integration & volumes of revolution, differential equations, Lami’s statics, restitution collisions & rank correlation.',
  },
  {
    id: 'all',
    label: 'All Classes',
    shortLabel: 'All',
    fullTitle: 'Complete Further Mathematics (SS1–SS3)',
    kicker: 'National Curriculum · 30 Topics',
    description:
      'Complete Nigerian NERDC SS1–SS3 Further Mathematics curriculum across Pure Mathematics, Differential & Integral Calculus, Vectors, Classical Mechanics, and Probability & Statistics.',
  },
];

export type FMathDomainId = 'pure' | 'calculus' | 'vectors' | 'mechanics' | 'stats';

export interface FMathNerdcTopicPlacement {
  classId: 'ss1' | 'ss2' | 'ss3';
  term: 1 | 2 | 3;
  termLabel: 'First Term' | 'Second Term' | 'Third Term';
  nerdcTheme:
    | 'Pure Algebra, Logic & Coordinate Geometry'
    | 'Differential & Integral Calculus'
    | 'Vectors & Three-Dimensional Geometry'
    | 'Statics, Kinematics & Dynamics'
    | 'Combinatorics, Probability & Statistics';
  order: number;
  domain: FMathDomainId;
  keywords: string[];
}

export const FMATH_NERDC_MAP: Record<string, FMathNerdcTopicPlacement> = {
  // ─────────────────────────── SS 1 (10 Topics) ───────────────────────────
  'fm-sets-logic': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Pure Algebra, Logic & Coordinate Geometry',
    order: 1,
    domain: 'pure',
    keywords: ['power set', 'three-set venn', 'inclusion-exclusion', 'truth table', 'implication', 'contrapositive', 'converse', 'tautology', 'de morgan'],
  },
  'fm-binary-ops': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Pure Algebra, Logic & Coordinate Geometry',
    order: 2,
    domain: 'pure',
    keywords: ['binary operation', 'closure', 'commutativity', 'associativity', 'identity element', 'inverse element', 'distributivity', 'cayley table'],
  },
  'fm-indices-surds-logs': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Pure Algebra, Logic & Coordinate Geometry',
    order: 3,
    domain: 'pure',
    keywords: ['exponential equations', 'conjugate surds', 'square root of surd', 'change of base', 'logarithmic equations', 'laws of logarithms'],
  },
  'fm-functions-mappings': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Pure Algebra, Logic & Coordinate Geometry',
    order: 4,
    domain: 'pure',
    keywords: ['domain', 'codomain', 'range', 'injective', 'one-to-one', 'surjective', 'onto', 'bijective', 'composite function', 'inverse function'],
  },
  'fm-sequences-series': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Pure Algebra, Logic & Coordinate Geometry',
    order: 5,
    domain: 'pure',
    keywords: ['arithmetic progression', 'geometric progression', 'arithmetic mean', 'geometric mean', 'sum to infinity', 'convergent series', 'sigma notation', 'recurrence'],
  },
  'fm-quadratics-roots': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Pure Algebra, Logic & Coordinate Geometry',
    order: 6,
    domain: 'pure',
    keywords: ['alpha and beta', 'sum of roots', 'product of roots', 'symmetric functions', 'discriminant', 'equal roots', 'minimum and maximum'],
  },
  'fm-polynomials': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Pure Algebra, Logic & Coordinate Geometry',
    order: 7,
    domain: 'pure',
    keywords: ['polynomial division', 'remainder theorem', 'factor theorem', 'cubic roots', 'zeros of polynomial', 'synthetic division'],
  },
  'fm-inequalities-abs': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Pure Algebra, Logic & Coordinate Geometry',
    order: 8,
    domain: 'pure',
    keywords: ['quadratic inequality', 'rational inequality', 'sign chart', 'critical values', 'modulus', 'absolute value inequality'],
  },
  'fm-coord-lines': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Pure Algebra, Logic & Coordinate Geometry',
    order: 9,
    domain: 'pure',
    keywords: ['internal division', 'external division', 'gradient', 'perpendicular lines', 'acute angle between lines', 'perpendicular distance to line', 'collinear'],
  },
  'fm-vectors-2d': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Vectors & Three-Dimensional Geometry',
    order: 10,
    domain: 'vectors',
    keywords: ['unit vector', 'position vector', 'modulus of vector', 'direction cosines', 'scalar product', 'dot product', 'orthogonal vectors', 'scalar projection'],
  },

  // ─────────────────────────── SS 2 (10 Topics) ───────────────────────────
  'fm-trig-compound': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Pure Algebra, Logic & Coordinate Geometry',
    order: 1,
    domain: 'pure',
    keywords: ['radian measure', 'secant', 'cosecant', 'cotangent', 'compound angles', 'double angle', 'factor formulae', 'r-formula', 'harmonic form'],
  },
  'fm-binomial': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Pure Algebra, Logic & Coordinate Geometry',
    order: 2,
    domain: 'pure',
    keywords: ['pascal triangle', 'binomial theorem', 'general term', 'independent term', 'negative index', 'fractional index', 'validity range'],
  },
  'fm-perm-comb': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Combinatorics, Probability & Statistics',
    order: 3,
    domain: 'stats',
    keywords: ['factorial', 'permutation', 'combination', 'identical objects', 'circular permutation', 'committee selection', 'together vs separated'],
  },
  'fm-coord-circle': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Pure Algebra, Logic & Coordinate Geometry',
    order: 4,
    domain: 'pure',
    keywords: ['equation of circle', 'centre and radius', 'general circle equation', 'tangent to circle', 'length of tangent', 'normal to circle', 'orthogonal circles'],
  },
  'fm-limits-diff': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Differential & Integral Calculus',
    order: 5,
    domain: 'calculus',
    keywords: ['limits', 'indeterminate form', 'continuity', 'first principles', 'difference quotient', 'power rule', 'gradient function'],
  },
  'fm-diff-rules': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Differential & Integral Calculus',
    order: 6,
    domain: 'calculus',
    keywords: ['product rule', 'quotient rule', 'chain rule', 'implicit differentiation', 'parametric differentiation', 'trig derivatives', 'exponential and log derivatives'],
  },
  'fm-diff-apps': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Differential & Integral Calculus',
    order: 7,
    domain: 'calculus',
    keywords: ['tangent and normal', 'stationary points', 'maximum and minimum', 'second derivative test', 'point of inflexion', 'connected rates of change', 'small increments'],
  },
  'fm-vectors-3d': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Vectors & Three-Dimensional Geometry',
    order: 8,
    domain: 'vectors',
    keywords: ['3d vectors', 'cross product', 'vector product', 'determinant i j k', 'area of triangle', 'area of parallelogram', 'coplanar vectors', 'scalar triple product'],
  },
  'fm-kinematics-proj': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Statics, Kinematics & Dynamics',
    order: 9,
    domain: 'mechanics',
    keywords: ['variable acceleration', 'displacement velocity acceleration', 'projectile motion', 'time of flight', 'maximum height', 'horizontal range', 'trajectory'],
  },
  'fm-prob-distributions': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Combinatorics, Probability & Statistics',
    order: 10,
    domain: 'stats',
    keywords: ['conditional probability', 'independent events', 'bayes theorem', 'expectation', 'variance of discrete rv', 'binomial distribution', 'poisson distribution'],
  },

  // ─────────────────────────── SS 3 (10 Topics) ───────────────────────────
  'fm-matrices-det': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Pure Algebra, Logic & Coordinate Geometry',
    order: 1,
    domain: 'pure',
    keywords: ['matrix multiplication', 'singular matrix', '2x2 inverse', '3x3 determinant', 'cofactor', 'adjoint', 'cramers rule', 'linear transformations'],
  },
  'fm-partial-fractions': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Pure Algebra, Logic & Coordinate Geometry',
    order: 2,
    domain: 'pure',
    keywords: ['proper rational fraction', 'improper fraction', 'cover-up rule', 'distinct linear factors', 'repeated linear factors', 'irreducible quadratic factor'],
  },
  'fm-complex-numbers': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Pure Algebra, Logic & Coordinate Geometry',
    order: 3,
    domain: 'pure',
    keywords: ['imaginary unit', 'complex conjugate', 'modulus and argument', 'argand diagram', 'polar form', 'de moivre theorem', 'nth roots'],
  },
  'fm-conic-sections': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Pure Algebra, Logic & Coordinate Geometry',
    order: 4,
    domain: 'pure',
    keywords: ['parabola', 'focus and directrix', 'latus rectum', 'ellipse', 'hyperbola', 'eccentricity', 'asymptotes', 'parametric parabola'],
  },
  'fm-integration': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Differential & Integral Calculus',
    order: 5,
    domain: 'calculus',
    keywords: ['antiderivative', 'constant of integration', 'substitution', 'integration by parts', 'partial fraction integration', 'definite integral', 'fundamental theorem'],
  },
  'fm-integration-apps': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Differential & Integral Calculus',
    order: 6,
    domain: 'calculus',
    keywords: ['area under curve', 'area between curves', 'volume of revolution', 'solid of revolution', 'trapezoidal rule', 'simpsons rule'],
  },
  'fm-ode': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Differential & Integral Calculus',
    order: 7,
    domain: 'calculus',
    keywords: ['order and degree', 'separable differential equation', 'general solution', 'particular solution', 'initial boundary condition', 'exponential growth', 'newton cooling'],
  },
  'fm-statics-moments': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Statics, Kinematics & Dynamics',
    order: 8,
    domain: 'mechanics',
    keywords: ['resolution of forces', 'lamis theorem', 'triangle of forces', 'limiting friction', 'inclined plane', 'principle of moments', 'ladder equilibrium'],
  },
  'fm-dynamics-momentum': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Statics, Kinematics & Dynamics',
    order: 9,
    domain: 'mechanics',
    keywords: ['atwood pulley', 'connected particles', 'impulse', 'conservation of momentum', 'newton law of restitution', 'coefficient of restitution', 'work energy power'],
  },
  'fm-corr-linprog': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Combinatorics, Probability & Statistics',
    order: 10,
    domain: 'stats',
    keywords: ['spearman rank correlation', 'pearson correlation', 'least squares regression', 'moving averages', 'feasible region', 'objective function', 'linear programming'],
  },
};

export function getFMathClassMeta(classId?: ChemClassId): ChemClassMeta {
  return FMATH_CLASSES.find((c) => c.id === (classId || 'all')) || FMATH_CLASSES[3];
}

export function filterFMathTopicsByClass(topics: Topic[], classId?: ChemClassId): Topic[] {
  if (!classId || classId === 'all') return topics;
  return topics
    .filter((t) => FMATH_NERDC_MAP[t.id]?.classId === classId)
    .sort((a, b) => (FMATH_NERDC_MAP[a.id]?.order ?? 99) - (FMATH_NERDC_MAP[b.id]?.order ?? 99));
}
