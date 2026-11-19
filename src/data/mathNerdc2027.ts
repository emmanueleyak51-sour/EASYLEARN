import type { Beat, ChemClassId, IdeaBeat, InteractiveLesson, TeachBeat, Topic } from '../types';
import { perm } from '../utils/engine';
import { fr, mfix } from '../utils/mathMarkup';

export type MathDomainId = 'number' | 'algebra' | 'geometry' | 'trig' | 'calcstats';

export interface MathClassMeta {
  id: ChemClassId;
  label: string;
  shortLabel: string;
  fullTitle: string;
  kicker: string;
  description: string;
}

export const MATH_CLASSES: MathClassMeta[] = [
  {
    id: 'ss1',
    label: 'SS 1',
    shortLabel: 'SS 1',
    fullTitle: 'SS 1 Mathematics',
    kicker: 'NERDC Year 1 · Foundation',
    description:
      'Number bases, modular arithmetic, fractions & ratios, indices & logs, sets, logic, quadratics, variation, geometry, mensuration & data.',
  },
  {
    id: 'ss2',
    label: 'SS 2',
    shortLabel: 'SS 2',
    fullTitle: 'SS 2 Mathematics',
    kicker: 'NERDC Year 2 · Algebra, Geometry & Trig',
    description:
      'Surds, AP & GP progressions, simultaneous equations, inequalities, polynomials, deductive proofs, loci, trigonometry, bearings, dispersion & probability.',
  },
  {
    id: 'ss3',
    label: 'SS 3',
    shortLabel: 'SS 3',
    fullTitle: 'SS 3 Mathematics',
    kicker: 'NERDC Year 3 · Matrices, Earth, Vectors & Calculus',
    description:
      'Commercial & financial maths, matrices, binary operations, linear programming, coordinate geometry, vectors, longitude & latitude, permutations, differentiation & integration.',
  },
  {
    id: 'all',
    label: 'All Classes',
    shortLabel: 'All',
    fullTitle: 'Complete Mathematics (SS1–SS3)',
    kicker: 'National Curriculum · 32 Topics',
    description:
      'Complete Nigerian NERDC SS1–SS3 General Mathematics curriculum covering number & numeration, algebra, geometry, trigonometry, statistics, and calculus.',
  },
];

export function getMathClassMeta(cls?: ChemClassId): MathClassMeta {
  return MATH_CLASSES.find((c) => c.id === (cls || 'all')) || MATH_CLASSES[3];
}

export interface MathNerdcTopicPlacement {
  classId: 'ss1' | 'ss2' | 'ss3';
  term: 1 | 2 | 3;
  termLabel: 'First Term' | 'Second Term' | 'Third Term';
  nerdcTheme:
    | 'Number & Numeration'
    | 'Algebraic Processes'
    | 'Geometry & Mensuration'
    | 'Trigonometry'
    | 'Everyday Statistics & Probability'
    | 'Introductory Calculus';
  order: number;
  domain: MathDomainId;
  keywords: string[];
}

export const MATH_NERDC_MAP: Record<string, MathNerdcTopicPlacement> = {
  // ─────────────────────────── SS 1 (11 Topics) ───────────────────────────
  bases: {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Number & Numeration',
    order: 1,
    domain: 'number',
    keywords: ['binary', 'base two', 'octal', 'hexadecimal', 'bicimal', 'radix', 'number bases'],
  },
  'm-mod': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Number & Numeration',
    order: 2,
    domain: 'number',
    keywords: ['modulo', 'modular arithmetic', 'clock arithmetic', 'residue', 'standard form', 'scientific notation', 'significant figures'],
  },
  frac: {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Number & Numeration',
    order: 3,
    domain: 'number',
    keywords: ['fractions', 'decimals', 'percentages', 'ratio', 'proportion', 'percentage error', 'bodmas'],
  },
  indices: {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Number & Numeration',
    order: 4,
    domain: 'number',
    keywords: ['indices', 'exponents', 'powers', 'logarithms', 'antilog', 'laws of indices', 'fractional index'],
  },
  sets: {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Number & Numeration',
    order: 5,
    domain: 'number',
    keywords: ['sets', 'venn diagram', 'union', 'intersection', 'complement', 'subset', 'power set', 'three sets'],
  },
  'm-logic': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Algebraic Processes',
    order: 6,
    domain: 'algebra',
    keywords: ['logic', 'truth table', 'negation', 'conjunction', 'disjunction', 'implication', 'converse', 'contrapositive', 'biconditional'],
  },
  quad: {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Algebraic Processes',
    order: 7,
    domain: 'algebra',
    keywords: ['quadratic', 'factorisation', 'completing the square', 'almighty formula', 'discriminant', 'sum and product of roots', 'parabola'],
  },
  variation: {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Algebraic Processes',
    order: 8,
    domain: 'algebra',
    keywords: ['direct variation', 'inverse variation', 'joint variation', 'partial variation', 'constant of proportionality'],
  },
  geom: {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Geometry & Mensuration',
    order: 9,
    domain: 'geometry',
    keywords: ['circle theorems', 'cyclic quadrilateral', 'alternate segment', 'angles at centre', 'semicircle', 'tangent', 'chord'],
  },
  mens: {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Geometry & Mensuration',
    order: 10,
    domain: 'geometry',
    keywords: ['mensuration', 'sector', 'arc length', 'segment', 'cylinder', 'cone', 'sphere', 'pyramid', 'frustum', 'volume', 'surface area'],
  },
  stats: {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Everyday Statistics & Probability',
    order: 11,
    domain: 'calcstats',
    keywords: ['mean', 'median', 'mode', 'pie chart', 'bar chart', 'histogram', 'grouped data', 'ogive', 'quartiles'],
  },

  // ─────────────────────────── SS 2 (11 Topics) ───────────────────────────
  surds: {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Number & Numeration',
    order: 1,
    domain: 'number',
    keywords: ['surds', 'conjugate', 'rationalise denominator', 'radicals', 'square roots'],
  },
  prog: {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Algebraic Processes',
    order: 2,
    domain: 'algebra',
    keywords: ['arithmetic progression', 'geometric progression', 'ap', 'gp', 'nth term', 'common difference', 'common ratio', 'sum to infinity'],
  },
  simul: {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Algebraic Processes',
    order: 3,
    domain: 'algebra',
    keywords: ['simultaneous equations', 'elimination', 'substitution', 'linear and quadratic'],
  },
  ineq: {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Algebraic Processes',
    order: 4,
    domain: 'algebra',
    keywords: ['inequalities', 'number line', 'quadratic inequality', 'sign flip', 'range of values'],
  },
  poly: {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Algebraic Processes',
    order: 5,
    domain: 'algebra',
    keywords: ['polynomials', 'remainder theorem', 'factor theorem', 'long division', 'cubic roots'],
  },
  'm-proof': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Geometry & Mensuration',
    order: 6,
    domain: 'geometry',
    keywords: ['deductive proof', 'interior angles', 'exterior angles', 'polygons', 'congruent triangles', 'similar triangles', 'intercept theorem'],
  },
  loci: {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Geometry & Mensuration',
    order: 7,
    domain: 'geometry',
    keywords: ['locus', 'loci', 'equidistant', 'perpendicular bisector', 'angle bisector', 'compass construction'],
  },
  trig: {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Trigonometry',
    order: 8,
    domain: 'trig',
    keywords: ['sine', 'cosine', 'tangent', 'sohcahtoa', 'special angles', 'cast rule', 'quadrants', 'pythagorean identity'],
  },
  'm-bearing': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Trigonometry',
    order: 9,
    domain: 'trig',
    keywords: ['sine rule', 'cosine rule', 'bearings', 'three-figure bearing', 'back bearing', 'angle of elevation', 'angle of depression', 'area of triangle'],
  },
  disp: {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Everyday Statistics & Probability',
    order: 10,
    domain: 'calcstats',
    keywords: ['dispersion', 'range', 'mean deviation', 'variance', 'standard deviation', 'interquartile range'],
  },
  prob: {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Everyday Statistics & Probability',
    order: 11,
    domain: 'calcstats',
    keywords: ['probability', 'mutually exclusive', 'independent events', 'without replacement', 'tree diagram', 'sample space'],
  },

  // ─────────────────────────── SS 3 (10 Topics) ───────────────────────────
  'm-fin': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Number & Numeration',
    order: 1,
    domain: 'number',
    keywords: ['simple interest', 'compound interest', 'depreciation', 'annuity', 'amortization', 'income tax', 'vat', 'shares', 'dividend'],
  },
  matrix: {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Algebraic Processes',
    order: 2,
    domain: 'algebra',
    keywords: ['matrices', 'determinant', 'transpose', 'inverse matrix', 'singular matrix', 'cramer', 'matrix multiplication'],
  },
  binop: {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Algebraic Processes',
    order: 3,
    domain: 'algebra',
    keywords: ['binary operations', 'closure', 'commutative', 'associative', 'identity element', 'inverse element', 'distributive'],
  },
  'm-linprog': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Algebraic Processes',
    order: 4,
    domain: 'algebra',
    keywords: ['linear programming', 'feasible region', 'objective function', 'half-plane', 'corner points', 'optimisation', 'graphical inequalities'],
  },
  coord: {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Geometry & Mensuration',
    order: 5,
    domain: 'geometry',
    keywords: ['coordinate geometry', 'gradient', 'midpoint', 'distance between points', 'parallel lines', 'perpendicular lines', 'equation of a line'],
  },
  'm-vec': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Geometry & Mensuration',
    order: 6,
    domain: 'geometry',
    keywords: ['vectors', 'magnitude', 'modulus', 'unit vector', 'dot product', 'scalar product', 'position vector', 'reflection', 'rotation', 'translation', 'enlargement'],
  },
  'm-earth': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Geometry & Mensuration',
    order: 7,
    domain: 'geometry',
    keywords: ['longitude', 'latitude', 'great circle', 'small circle', 'parallel of latitude', 'meridian', 'earth radius', 'angular difference', 'knot'],
  },
  perm: {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Everyday Statistics & Probability',
    order: 8,
    domain: 'calcstats',
    keywords: ['permutations', 'combinations', 'factorial', 'arrangements', 'committee selection', 'cyclic permutation', 'repeated letters'],
  },
  diff: {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Introductory Calculus',
    order: 9,
    domain: 'calcstats',
    keywords: ['differentiation', 'derivative', 'limits', 'first principles', 'product rule', 'quotient rule', 'chain rule', 'turning points', 'maxima', 'minima', 'tangent'],
  },
  integ: {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Introductory Calculus',
    order: 10,
    domain: 'calcstats',
    keywords: ['integration', 'antiderivative', 'definite integral', 'indefinite integral', 'area under curve', 'constant of integration', 'kinematics'],
  },
};

export function filterMathTopicsByClass(topics: Topic[], cls?: ChemClassId): Topic[] {
  if (!cls || cls === 'all') return topics;
  return topics.filter((t) => MATH_NERDC_MAP[t.id]?.classId === cls);
}

/**
 * 8 NERDC SS1–SS3 General Mathematics Topics completing 100% of the Nigerian Secondary Curriculum
 * alongside all 24 core JAMB UTME / WAEC / NECO Mathematics units (= 32 total topics).
 */
export const MATH_NERDC_EXTRA_TOPICS: Topic[] = [
  /* ─────────────── 1. MODULAR ARITHMETIC & STANDARD FORM (SS1 T1) ─────────────── */
  {
    id: 'm-mod',
    name: 'Modular Arithmetic & Standard Form',
    sec: 'Number & Numeration',
    boss: 'Modulo & Standard Form Test',
    goals: [
      'Evaluate addition, subtraction, multiplication, and linear equations in modulo n (clock arithmetic)',
      'Convert very large and very small numbers into standard form A × 10ⁿ where 1 ≤ A < 10',
      'Round quantities accurately to decimal places (d.p.) and significant figures (s.f.)',
    ],
    trap: 'In modulo n, remainders are NEVER negative! For −3 (mod 7), keep adding 7 until positive: −3 + 7 = 4 (mod 7), NOT 3. And in standard form A × 10ⁿ, A must satisfy 1 ≤ A < 10 (so 45 × 10³ must be rewritten as 4.5 × 10⁴).',
    parts: [
      {
        title: 'Clock Arithmetic & Operations in Modulo n',
        idea: 'Modular arithmetic wraps integers around a circle of size <b>n</b>, keeping only the non-negative remainder <b>r</b> (0 ≤ r &lt; n) when divided by n. A 12-hour wall clock works in modulo 12.',
        rules: [
          'a ≡ r (mod n) means a = qn + r with 0 ≤ r < n.',
          'For negative values, add multiples of n until the result lies in {0, 1, …, n − 1}: e.g. −11 (mod 5) ≡ −11 + 15 = 4 (mod 5).',
          'To solve ax ≡ b (mod n), test x ∈ {0, 1, …, n − 1} or add multiples of n to b until divisible by a.',
        ],
        ex: {
          q: 'Solve 3x ≡ 2 (mod 5) for the least non-negative integer x.',
          steps: [
            ['Add 5 to the right-hand side: 2 + 5 = 7 (not divisible by 3)', 'Adding the modulus n = 5 preserves congruence.'],
            ['Add 5 again: 7 + 5 = 12', '12 is an exact multiple of 3!'],
            ['3x = 12 ⇒ x = 4 (mod 5)', 'Check: 3 × 4 = 12 = 2(5) + 2 ≡ 2 (mod 5).'],
          ],
          why: [
            0,
            'Why is adding 5 to the right-hand side valid in modulo 5?',
            [
              'Because 5 ≡ 0 (mod 5), so adding 5 leaves the remainder unchanged',
              'Because 5 is an odd prime number',
              'Because 3 + 2 equals 5',
            ],
            [
              'Spot on! Any multiple of n has remainder 0 in mod n.',
              'It works for composite moduli too whenever gcd(a, n) = 1.',
              'Coincidence of numbers — the modulus is 5.',
            ],
          ],
        },
        tryit: {
          q: 'Evaluate (7 − 19) (mod 5).',
          o: ['3', '2', '−2', '4'],
          a: 0,
          h: '7 − 19 = −12. Now add multiples of 5 (−12 + 15) until you get a remainder between 0 and 4.',
          e: '7 − 19 = −12. Adding 3 × 5 = 15 gives −12 + 15 = 3 (mod 5).',
          fb: [
            'Correct! −12 + 15 = 3, which lies in {0, 1, 2, 3, 4}.',
            '2 is the remainder of +12 ÷ 5; for −12 you count backwards on the 5-clock to land on 3.',
            'Remainders in modulo n are never written negative; add 5 to −2 to get 3.',
            'Check −12 + 15 = 3, not 4.',
          ],
        },
      },
      {
        title: 'Standard Form & Significant Figures',
        idea: 'Standard form (scientific notation) expresses any positive number as <b>A × 10ⁿ</b>, where <b>1 ≤ A &lt; 10</b> and <b>n</b> is an integer. Significant figures count from the first non-zero digit.',
        rules: [
          'Moving the decimal point k places LEFT increases the power by +k (e.g. 64 000 = 6.4 × 10⁴).',
          'Moving the decimal point k places RIGHT gives a negative power −k (e.g. 0.00052 = 5.2 × 10⁻⁴).',
          'Leading zeros in 0.00408 are NOT significant, but trapped zeros (408) ARE significant (3 s.f.).',
        ],
        ex: {
          q: 'Evaluate (4.5 × 10⁻³) × (6.0 × 10⁷) in standard form.',
          steps: [
            ['Multiply the mantissas: 4.5 × 6.0 = 27', 'Group the decimal parts together.'],
            ['Add the powers of 10: 10⁻³⁺⁷ = 10⁴', 'Use xᵃ × xᵇ = xᵃ⁺ᵇ.'],
            ['Normalise 27 × 10⁴ = (2.7 × 10¹) × 10⁴ = 2.7 × 10⁵', '1 ≤ 2.7 < 10.'],
          ],
        },
        tryit: {
          q: 'Express 0.0003964 correct to 2 significant figures in standard form.',
          o: ['4.0 × 10⁻⁴', '3.9 × 10⁻⁴', '4.0 × 10⁻³', '0.0004'],
          a: 0,
          h: 'First non-zero digit is 3, second is 9, third is 6 (≥ 5 so round 39 up to 40). Count places moved.',
          e: '0.0003964 = 3.964 × 10⁻⁴. Rounding 3.964 to 2 s.f. gives 4.0 × 10⁻⁴.',
        },
      },
    ],
    spot: {
      part: 0,
      who: 'Sade',
      q: 'Evaluate 4 − 17 (mod 6).',
      lines: ['4 − 17 = −13', '13 ÷ 6 = 2 remainder 1', 'Therefore 4 − 17 ≡ 1 (mod 6)'],
      bad: 2,
      okfb: ['4 − 17 = −13 is correct.', '13 ÷ 6 leaves remainder 1, yes — watch the negative sign next!'],
      o: [
        'For −13 (mod 6), add 18 (3 × 6) to −13 to get +5, not +1',
        '4 − 17 equals −11',
        'Modulus 6 only allows even remainders',
        'Nothing is wrong',
      ],
      a: 0,
      fb: [
        'Exact! −13 = (−3)(6) + 5, so −13 ≡ 5 (mod 6). Taking the remainder of +13 ignores the negative sign.',
        '4 − 17 is definitely −13.',
        'Modulus 6 allows any remainder in {0, 1, 2, 3, 4, 5}.',
        'Check: −13 − 1 = −14, which is not divisible by 6.',
      ],
      h: ['Add multiples of 6 to −13 until the result becomes positive: −13 + 18 = ?'],
      fix: '−13 + 18 = 5, so 4 − 17 ≡ 5 (mod 6).',
    },
    qs: [
      {
        l: 1,
        q: 'Evaluate 9 ⊗ 8 (mod 7), where ⊗ denotes multiplication.',
        o: ['2', '3', '1', '5'],
        a: 0,
        e: '9 × 8 = 72 = 10(7) + 2, so 72 ≡ 2 (mod 7).',
        w: ['', '70 + 3 = 73, not 72.', '72 ÷ 7 leaves remainder 2, not 1.', 'Check 7 × 10 = 70; 72 − 70 = 2.'],
        dx: 1,
      },
      {
        l: 1,
        q: 'Find the least positive value of x if x ≡ −16 (mod 5).',
        o: ['4', '1', '3', '2'],
        a: 0,
        e: 'Add 4 × 5 = 20 to −16: −16 + 20 = 4 (mod 5).',
        w: ['', '1 is the remainder of +16 mod 5, not −16.', '−16 + 20 = 4, not 3.', '−16 + 20 = 4.'],
      },
      {
        l: 2,
        q: 'Solve 4x − 3 ≡ 2 (mod 7) for 0 ≤ x &lt; 7.',
        o: ['3', '5', '2', '6'],
        a: 0,
        e: '4x ≡ 5 (mod 7). Add 7: 5 + 7 = 12. Then 4x = 12 ⇒ x = 3.',
        w: ['', '4(5) − 3 = 17 ≡ 3 (mod 7), not 2.', '4(2) − 3 = 5 ≢ 2 (mod 7).', '4(6) − 3 = 21 ≡ 0 (mod 7).'],
      },
      {
        l: 2,
        q: 'If today is Tuesday, what day of the week will it be in 100 days’ time?',
        o: ['Thursday', 'Wednesday', 'Friday', 'Sunday'],
        a: 0,
        e: '100 ÷ 7 = 14 weeks remainder 2 days. Tuesday + 2 days = Thursday.',
        w: ['', 'Remainder is 2 (since 98 = 14 × 7), not 1.', 'Friday would be remainder 3.', 'Sunday would be remainder 5.'],
      },
      {
        l: 2,
        q: 'Express 0.0000708 in standard form.',
        o: ['7.08 × 10⁻⁵', '7.08 × 10⁻⁴', '70.8 × 10⁻⁶', '7.8 × 10⁻⁵'],
        a: 0,
        e: 'Move the decimal point 5 places to the right to get 7.08, giving 7.08 × 10⁻⁵.',
        w: ['', 'Count carefully: 4 zeros after the decimal point plus 1 digit (7) = 5 places.', '70.8 is ≥ 10, so it violates 1 ≤ A < 10.', 'Never drop the trapped zero in 7.08.'],
      },
      {
        l: 3,
        q: `Simplify ${fr('3.6 × 10⁻³', '9.0 × 10⁻⁷')} in standard form.`,
        o: ['4.0 × 10³', '4.0 × 10⁴', '4.0 × 10⁻¹⁰', '0.4 × 10⁴'],
        a: 0,
        e: '3.6 ÷ 9.0 = 0.4, and 10⁻³⁻⁽⁻⁷⁾ = 10⁴. So 0.4 × 10⁴ = 4.0 × 10³.',
        w: ['', '0.4 × 10⁴ simplifies to 4.0 × 10³, reducing the power by 1.', 'Subtract the bottom exponent: −3 − (−7) = +4, not −10.', '0.4 is less than 1, so rewrite as 4.0 × 10³.'],
      },
      {
        l: 3,
        q: 'Round 49,862 to 2 significant figures.',
        o: ['50,000', '49,000', '49,900', '50'],
        a: 0,
        e: 'The first two s.f. are 4 and 9; the 3rd digit is 8 (≥ 5), rounding 49 thousand up to 50,000.',
        w: ['', 'The 3rd digit is 8, so 49 must round up to 50.', '49,900 is 3 significant figures.', 'Place-value zeros must be kept so the size stays around fifty thousand.'],
      },
    ],
  },

  /* ─────────────── 2. LOGICAL REASONING & TRUTH TABLES (SS1 T2) ─────────────── */
  {
    id: 'm-logic',
    name: 'Logical Reasoning & Truth Tables',
    sec: 'Algebraic Processes',
    boss: 'Logic & Implication Test',
    goals: [
      'Distinguish simple propositions from non-statements (questions, commands, exclamations)',
      'Construct truth tables for negation (~p), conjunction (p ∧ q), disjunction (p ∨ q), implication (p ⇒ q), and biconditional (p ⇔ q)',
      'Form the converse, inverse, and logically equivalent contrapositive (~q ⇒ ~p) of any conditional statement',
    ],
    trap: 'An implication p ⇒ q is FALSE in ONLY ONE case: when the hypothesis p is TRUE and the conclusion q is FALSE (T ⇒ F is F). Also, p ⇒ q is logically equivalent to its contrapositive (~q ⇒ ~p), NOT its converse (q ⇒ p)!',
    parts: [
      {
        title: 'Propositions, Connectives & Truth Tables',
        idea: 'A logical <b>statement (proposition)</b> is a declarative sentence that is unambiguously either <b>True (T)</b> or <b>False (F)</b>, never both. Compound statements join propositions using logical connectives.',
        rules: [
          'Conjunction (p ∧ q, "p AND q") is True ONLY when both p and q are True.',
          'Disjunction (p ∨ q, "p OR q") is False ONLY when both p and q are False.',
          'Implication (p ⇒ q, "if p then q") is False ONLY when p is True and q is False.',
          'Biconditional (p ⇔ q, "p if and only if q") is True when p and q have the SAME truth value.',
        ],
        ex: {
          q: 'Given p: "15 is prime" (F) and q: "2 is even" (T), find the truth values of (p ∧ q) and (p ⇒ q).',
          steps: [
            ['Evaluate p ∧ q: F ∧ T = False', 'AND requires both parts to be True.'],
            ['Evaluate p ⇒ q: F ⇒ T = True', 'An implication with a False hypothesis is vacuously True!'],
          ],
        },
        tryit: {
          q: 'For which truth values of p and q is the implication (p ⇒ q) FALSE?',
          o: ['p is True and q is False', 'p is False and q is True', 'Both p and q are False', 'Both p and q are True'],
          a: 0,
          h: 'Think of a promise: "If you top your class (p), I will buy you a laptop (q)." When is the promise broken?',
          e: 'The promise is broken ONLY when p happens (True) and q fails to happen (False).',
        },
      },
      {
        title: 'Converse, Inverse, Contrapositive & Syllogisms',
        idea: 'Every conditional statement <b>p ⇒ q</b> generates three related conditionals. Only the <b>contrapositive (~q ⇒ ~p)</b> always shares the exact same truth value as p ⇒ q.',
        rules: [
          'Original: p ⇒ q ("If it is a square, then it has 4 sides").',
          'Converse: q ⇒ p (swap p and q — NOT necessarily true!).',
          'Inverse: ~p ⇒ ~q (negate both — equivalent to converse).',
          'Contrapositive: ~q ⇒ ~p (swap AND negate both — ALWAYS equivalent to p ⇒ q).',
        ],
        ex: {
          q: 'Find the contrapositive of: "If a student lives in Ikeja, then the student lives in Lagos."',
          steps: [
            ['Identify p = "lives in Ikeja", q = "lives in Lagos"', 'Original form is p ⇒ q.'],
            ['Negate and swap to form ~q ⇒ ~p', 'Contrapositive reverses order and negates both parts.'],
            ['"If a student does NOT live in Lagos, then the student does NOT live in Ikeja."', 'Always True, matching p ⇒ q!'],
          ],
        },
        tryit: {
          q: 'Which statement is logically equivalent to p ⇒ q?',
          o: ['~q ⇒ ~p', 'q ⇒ p', '~p ⇒ ~q', 'p ∧ ~q'],
          a: 0,
          h: 'Swap the two statements AND negate both to form the contrapositive.',
          e: 'The contrapositive ~q ⇒ ~p has the exact same truth table (T, F, T, T) as p ⇒ q.',
        },
      },
    ],
    qs: [
      {
        l: 1,
        q: 'Which of the following sentences is a valid mathematical proposition (logical statement)?',
        o: ['9 is an even number', 'Close the laboratory door!', 'How old are you?', 'x + 4 = 11'],
        a: 0,
        e: '"9 is an even number" is a declarative sentence with a definite truth value (False). Commands, questions, and open sentences with unquantified x are not propositions.',
        w: ['', 'Commands have no truth value.', 'Questions have no truth value.', 'x + 4 = 11 depends on x, so it is an open sentence until x is specified.'],
        dx: 1,
      },
      {
        l: 1,
        q: 'If p is True and q is False, find the truth value of (~p ∨ ~q).',
        o: ['True', 'False', 'Both True and False', 'Indeterminate'],
        a: 0,
        e: '~p = False and ~q = True. Therefore False ∨ True = True.',
        w: ['', 'Disjunction (∨) needs at least one True input; here ~q is True!', 'Propositions cannot be both.', 'Both truth values are given.'],
      },
      {
        l: 2,
        q: 'What is the converse of "If x = 3, then x² = 9"?',
        o: ['If x² = 9, then x = 3', 'If x² ≠ 9, then x ≠ 3', 'If x ≠ 3, then x² ≠ 9', 'x = 3 if and only if x² = 9'],
        a: 0,
        e: 'The converse of p ⇒ q swaps hypothesis and conclusion to give q ⇒ p ("If x² = 9, then x = 3").',
        w: ['', 'That is the contrapositive (~q ⇒ ~p).', 'That is the inverse (~p ⇒ ~q).', 'That is the biconditional (p ⇔ q).'],
      },
      {
        l: 2,
        q: 'By De Morgan’s Law, the negation of (p ∧ q) is logically equivalent to:',
        o: ['~p ∨ ~q', '~p ∧ ~q', 'p ∨ q', '~q ⇒ p'],
        a: 0,
        e: '~(p ∧ q) ≡ ~p ∨ ~q: negating an AND flips it into an OR of the negations.',
        w: ['', 'You must also flip ∧ to ∨ when distributing negation.', 'Neither part was negated.', '~q ⇒ p is equivalent to q ∨ p.'],
      },
      {
        l: 2,
        q: 'A compound statement whose truth table column contains ONLY True (T) in every row is called a:',
        o: ['Tautology', 'Contradiction', 'Contingency', 'Converse'],
        a: 0,
        e: 'A tautology (such as p ∨ ~p) is always True; a contradiction (such as p ∧ ~p) is always False.',
        w: ['', 'A contradiction is always False.', 'A contingency has both T and F entries.', 'Converse swaps p and q in an implication.'],
      },
      {
        l: 3,
        q: 'Given P₁: "All equilateral triangles are isosceles" and P₂: "Triangle ABC is not isosceles", what valid conclusion follows?',
        o: ['Triangle ABC is not equilateral', 'Triangle ABC is scalene', 'Triangle ABC is right-angled', 'No valid conclusion follows'],
        a: 0,
        e: 'By Modus Tollens (contrapositive): Equilateral ⇒ Isosceles. Since ABC is NOT isosceles (~q), it cannot be equilateral (~p).',
        w: ['', 'Not isosceles means scalene in plane triangles, wait — equilateral is a special case of isosceles, so ~isosceles directly proves ~equilateral by contrapositive.', 'Angles are unknown.', 'Modus Tollens gives a definite valid conclusion.'],
      },
      {
        l: 3,
        q: 'For how many of the 4 rows of (p, q) ∈ {(T,T), (T,F), (F,T), (F,F)} is the biconditional (p ⇔ q) True?',
        o: ['2 rows', '1 row', '3 rows', '4 rows'],
        a: 0,
        e: 'p ⇔ q is True when p and q match: (T, T) and (F, F) — exactly 2 rows.',
        w: ['', '(F, F) also makes p ⇔ q True!', '3 rows is for p ∨ q or p ⇒ q.', '4 rows would be a tautology.'],
      },
    ],
  },

  /* ─────────────── 3. DEDUCTIVE PROOFS, POLYGONS & SIMILARITY (SS2 T2) ─────────────── */
  {
    id: 'm-proof',
    name: 'Deductive Proofs, Polygons & Similarity',
    sec: 'Geometry & Mensuration',
    boss: 'Polygons & Proofs Test',
    goals: [
      'Calculate interior and exterior angles of regular and irregular n-sided polygons',
      'Apply triangle congruence (SSS, SAS, ASA, RHS) and similarity area/volume scale-factor ratios',
      'Use the midpoint and intercept theorems to find unknown segments in geometric riders',
    ],
    trap: 'When two shapes are similar with linear scale factor k = L₁/L₂, the ratio of their AREAS is k² = (L₁/L₂)² and VOLUMES is k³ = (L₁/L₂)³ — never use k directly for area! Also, the sum of EXTERIOR angles of ANY convex polygon is always 360°.',
    parts: [
      {
        title: 'Interior & Exterior Angles of Polygons',
        idea: 'Splitting an n-sided polygon from one vertex creates <b>(n − 2)</b> triangles, so interior angles sum to <b>(n − 2) × 180°</b>. Walking around the perimeter turns through one full revolution, so exterior angles always sum to <b>360°</b>.',
        rules: [
          'Sum of interior angles of an n-gon = (n − 2) × 180° = (2n − 4) × 90°.',
          'Sum of exterior angles of ANY convex polygon = 360°.',
          'For a REGULAR n-gon: each exterior angle = 360° ÷ n, and interior + exterior = 180°.',
        ],
        ex: {
          q: 'Each interior angle of a regular polygon is 150°. How many sides does the polygon have?',
          steps: [
            ['Exterior angle = 180° − 150° = 30°', 'Interior + exterior angles on a straight line = 180° (fastest shortcut!).'],
            ['Number of sides n = 360° ÷ 30° = 12 sides', 'Sum of exterior angles is always 360°.'],
          ],
        },
        tryit: {
          q: 'Find the number of sides of a polygon whose interior angles add up to 1,440°.',
          o: ['10', '8', '12', '9'],
          a: 0,
          h: 'Solve (n − 2) × 180° = 1440°: divide 1440 by 180 first, then add 2!',
          e: 'n − 2 = 1440 ÷ 180 = 8, so n = 8 + 2 = 10 sides (decagon).',
        },
      },
      {
        title: 'Congruence, Similar Triangles & Intercept Theorem',
        idea: 'A line parallel to one side of a triangle cuts the other two sides proportionally (Intercept / Thales Theorem) and creates a <b>similar triangle</b> whose area scales by the <b>square</b> of the side ratio.',
        rules: [
          'Congruent triangle tests: SSS, SAS, ASA (or AAS), and RHS (ASS is NOT a valid proof!).',
          'Intercept theorem: if DE ∥ BC in △ABC, then AD/DB = AE/EC and AD/AB = DE/BC.',
          'Similar figures with side ratio a : b have Area ratio a² : b² and Volume ratio a³ : b³.',
        ],
        ex: {
          q: 'In △ABC, DE is parallel to BC with AD = 2 cm and DB = 3 cm. Find Area(△ADE) : Area(△ABC).',
          steps: [
            ['Full side AB = AD + DB = 2 + 3 = 5 cm', 'Compare small triangle side AD to full triangle side AB (not DB!).'],
            ['Linear ratio AD : AB = 2 : 5', '△ADE ~ △ABC by AAA similarity.'],
            ['Area ratio = 2² : 5² = 4 : 25', 'Square the linear scale factor.'],
          ],
        },
        tryit: {
          q: 'Two similar cones have heights in the ratio 2 : 3. If the smaller cone has volume 16 cm³, find the volume of the larger cone.',
          o: ['54 cm³', '36 cm³', '24 cm³', '48 cm³'],
          a: 0,
          h: 'Cube the linear ratio for volume: V₁ : V₂ = 2³ : 3³ = 8 : 27.',
          e: '16 ÷ V₂ = 8 ÷ 27 ⇒ V₂ = (16 × 27) ÷ 8 = 54 cm³.',
        },
      },
    ],
    qs: [
      {
        l: 1,
        q: 'Calculate each interior angle of a regular octagon (8 sides).',
        o: ['135°', '120°', '140°', '45°'],
        a: 0,
        e: 'Exterior angle = 360° ÷ 8 = 45°. Interior angle = 180° − 45° = 135°.',
        w: ['', '120° is for a regular hexagon (6 sides).', 'Regular nonagon is 140°.', '45° is the exterior angle; subtract from 180°.'],
        dx: 1,
      },
      {
        l: 1,
        q: 'Which of the following is NOT a sufficient condition to prove two triangles congruent?',
        o: ['AAA (Angle-Angle-Angle)', 'SAS (Side-Angle-Side)', 'RHS (Right-angle-Hypotenuse-Side)', 'ASA (Angle-Side-Angle)'],
        a: 0,
        e: 'AAA proves triangles are SIMILAR (same shape), not necessarily CONGRUENT (same size).',
        w: ['', 'SAS proves congruence.', 'RHS proves congruence for right-angled triangles.', 'ASA proves congruence.'],
      },
      {
        l: 2,
        q: 'The angles of a pentagon are x°, (x + 20)°, (x + 40)°, (x + 60)°, and (x + 80)°. Find x.',
        o: ['68', '72', '88', '108'],
        a: 0,
        e: 'Sum for pentagon (n = 5) = (5 − 2) × 180° = 540°. So 5x + 200 = 540 ⇒ 5x = 340 ⇒ x = 68.',
        w: ['', '72 comes from setting sum = 360° (forgot 540°).', 'Check 540 − 200 = 340; 340 ÷ 5 = 68.', '108° is the average (middle) angle x + 40, not x.'],
      },
      {
        l: 2,
        q: 'In △PQR, M and N are the midpoints of PQ and PR respectively. If QR = 18 cm, find MN.',
        o: ['9 cm', '6 cm', '12 cm', '36 cm'],
        a: 0,
        e: 'By the Midpoint Theorem, the segment joining the midpoints of two sides is parallel to the third side and half its length: MN = ½(18) = 9 cm.',
        w: ['', 'Half of 18 is 9, not 6.', 'MN is ½ of QR, not ⅔.', 'QR is twice MN, so MN = 9 cm.'],
      },
      {
        l: 2,
        q: 'Two similar triangles have areas 18 cm² and 50 cm². Find the ratio of their corresponding altitudes.',
        o: ['3 : 5', '9 : 25', '18 : 50', '3 : 10'],
        a: 0,
        e: 'Area ratio = 18 : 50 = 9 : 25. Linear ratio = √9 : √25 = 3 : 5.',
        w: ['', '9 : 25 is the simplified area ratio; take square roots for lengths.', 'Simplify 18 : 50 to 9 : 25 then take square roots.', '√25 = 5, not 10.'],
      },
      {
        l: 3,
        q: 'An exterior angle of a regular polygon is one-fifth of its interior angle. How many sides has the polygon?',
        o: ['12', '10', '15', '8'],
        a: 0,
        e: 'Let exterior = e, interior = 5e. Since e + 5e = 180°, 6e = 180° ⇒ e = 30°. Number of sides n = 360° ÷ 30° = 12.',
        w: ['', 'e + 5e = 6e = 180° gives e = 30° (not 36°; 5 parts + 1 part = 6 parts!).', '360 ÷ 30 = 12, not 15.', 'Octagon has e = 45°.'],
      },
      {
        l: 3,
        q: 'In △ABC, DE ∥ BC with AD = 4 cm and DB = 2 cm. If Area(△ADE) = 16 cm², find the area of trapezium DBCE.',
        o: ['20 cm²', '36 cm²', '8 cm²', '24 cm²'],
        a: 0,
        e: 'AD : AB = 4 : (4 + 2) = 2 : 3. Area(△ADE) : Area(△ABC) = 4 : 9. Thus Area(△ABC) = 16 × (9/4) = 36 cm², and trapezium DBCE = 36 − 16 = 20 cm².',
        w: ['', '36 cm² is the whole △ABC; subtract Area(△ADE) = 16 cm² to get the trapezium!', 'Area scales as the square of sides, not linearly.', '36 − 16 = 20 cm².'],
      },
    ],
  },

  /* ─────────────── 4. SINE & COSINE RULES, BEARINGS & ELEVATION (SS2 T3) ─────────────── */
  {
    id: 'm-bearing',
    name: 'Sine & Cosine Rules, Bearings & Elevation',
    sec: 'Trigonometry',
    boss: 'Bearings & Triangle Rules Test',
    goals: [
      'Solve non-right-angled triangles using the Sine Rule, Cosine Rule, and Area = ½ab sin C',
      'Convert between compass bearings (N 35° W) and 3-figure bearings (000°–360° clockwise from North) including back bearings',
      'Solve height and distance problems involving angles of elevation and depression',
    ],
    trap: 'Three-figure bearings are ALWAYS measured CLOCKWISE from North with 3 digits (e.g. 045°, not 45°). For back bearings: if the forward bearing θ < 180°, ADD 180°; if θ ≥ 180°, SUBTRACT 180°. In Cosine Rule, remember cos 120° = −½, so −2bc cos 120° becomes +bc!',
    parts: [
      {
        title: 'Sine Rule, Cosine Rule & Area ½ab sin C',
        idea: 'When a triangle has NO right angle, SOH-CAH-TOA does not apply directly. Use the <b>Sine Rule</b> for matching side–angle pairs, and the <b>Cosine Rule</b> for SAS (two sides + included angle) or SSS (all three sides).',
        rules: [
          `Sine Rule: ${fr('a', 'sin A')} = ${fr('b', 'sin B')} = ${fr('c', 'sin C')} = 2R.`,
          'Cosine Rule: a² = b² + c² − 2bc cos A, or cos A = (b² + c² − a²) ÷ (2bc).',
          'Area of any triangle = ½ ab sin C (product of two sides and sine of the INCLUDED angle).',
        ],
        ex: {
          q: 'In △ABC, b = 5 cm, c = 8 cm, and ∠A = 60°. Find side a.',
          steps: [
            ['a² = b² + c² − 2bc cos A', 'Two sides and included angle (SAS) → Cosine Rule.'],
            ['a² = 25 + 64 − 2(5)(8) cos 60° = 89 − 80(½) = 49', 'cos 60° = 0.5.'],
            ['a = √49 = 7 cm', 'Exact integer side!'],
          ],
        },
        tryit: {
          q: 'Find the area of △PQR if PQ = 10 cm, PR = 6 cm, and ∠QPR = 30°.',
          o: ['15 cm²', '30 cm²', '15√3 cm²', '60 cm²'],
          a: 0,
          h: 'Use Area = ½ × PQ × PR × sin 30°, with sin 30° = ½.',
          e: 'Area = ½ × 10 × 6 × ½ = 15 cm².',
        },
      },
      {
        title: 'Three-Figure Bearings, Back Bearings & Elevation',
        idea: 'A <b>three-figure bearing</b> measures clockwise from North (000° to 360°). Angles of <b>elevation</b> (looking UP from horizontal) and <b>depression</b> (looking DOWN from horizontal) are equal by alternate angles!',
        rules: [
          'Bearing of B FROM A: draw the North pole at A and turn clockwise to line AB.',
          'Back bearing (A from B) = θ + 180° (if θ < 180°) or θ − 180° (if θ ≥ 180°).',
          'Angle of depression MUST be measured from the HORIZONTAL eye-level line, never from the vertical pole/cliff!',
        ],
        ex: {
          q: 'The bearing of town Q from town P is 235°. Find the bearing of P from Q.',
          steps: [
            ['Since 235° ≥ 180°, subtract 180°', 'Back bearing rule for θ ≥ 180°.'],
            ['235° − 180° = 055°', 'Write with three digits: 055° (equivalent to N 55° E).'],
          ],
        },
        tryit: {
          q: 'From the top of a 30 m vertical cliff, the angle of depression of a boat at sea is 30°. How far is the boat from the foot of the cliff?',
          o: ['30√3 m', '10√3 m', '30 m', '60 m'],
          a: 0,
          h: 'By alternate angles, the angle of elevation from the boat is 30°. Use tan 30° = 30 ÷ d.',
          e: 'tan 30° = 1/√3 = 30/d ⇒ d = 30√3 m.',
        },
      },
    ],
    qs: [
      {
        l: 1,
        q: 'Express the compass direction S 38° W as a three-figure bearing.',
        o: ['218°', '142°', '322°', '038°'],
        a: 0,
        e: 'South is 180°; turning 38° towards West (clockwise past South) gives 180° + 38° = 218°.',
        w: ['', '142° is S 38° E (180° − 38°).', '322° is N 38° W.', '038° is N 38° E.'],
        dx: 1,
      },
      {
        l: 1,
        q: 'If the bearing of B from A is 068°, what is the bearing of A from B?',
        o: ['248°', '112°', '292°', '068°'],
        a: 0,
        e: 'Since 068° < 180°, add 180°: 68° + 180° = 248°.',
        w: ['', '180° − 68° = 112° is supplementary, not the back bearing.', '360° − 68° = 292°.', 'Forward and back bearings differ by 180°.'],
      },
      {
        l: 2,
        q: 'In △ABC, ∠A = 30°, ∠B = 45°, and a = 8 cm. Find side b.',
        o: ['8√2 cm', '4√2 cm', '8√3 cm', '16 cm'],
        a: 0,
        e: 'By Sine Rule: b / sin 45° = 8 / sin 30°. Since sin 30° = ½, 8 / ½ = 16, so b = 16 × (√2/2) = 8√2 cm.',
        w: ['', '8 ÷ (½) = 16, not 8; then 16 × (√2/2) = 8√2.', 'sin 45° = √2/2, not √3/2.', '16 is 2R (the diameter); multiply by sin 45°.'],
      },
      {
        l: 2,
        q: 'In △XYZ, x = 3 cm, y = 5 cm, and ∠Z = 120°. Find side z.',
        o: ['7 cm', '√19 cm', '√34 cm', '8 cm'],
        a: 0,
        e: 'z² = 3² + 5² − 2(3)(5) cos 120°. Since cos 120° = −½, z² = 9 + 25 − 30(−½) = 34 + 15 = 49 ⇒ z = 7 cm.',
        w: ['', 'cos 120° is NEGATIVE (−½), so −2xy cos 120° becomes +15, not −15!', 'Forgot the −2xy cos Z term (Pythagoras only works for 90°).', 'Triangle sides do not add directly.'],
      },
      {
        l: 2,
        q: 'A ladder 10 m long leans against a vertical wall making an angle of 60° with the horizontal ground. How high up the wall does it reach?',
        o: ['5√3 m', '5 m', '10√3 m', '5√2 m'],
        a: 0,
        e: 'Height h is opposite 60°: sin 60° = h / 10 ⇒ h = 10 × (√3/2) = 5√3 m.',
        w: ['', '5 m is the distance of the foot from the wall (10 cos 60°).', 'Forgot to divide √3 by 2.', '√2/2 is for 45°.'],
      },
      {
        l: 3,
        q: 'A cyclist rides 6 km due North from P to Q, and then 8 km due East from Q to R. Find the distance PR and the bearing rule for R from P.',
        o: ['10 km on bearing tan⁻¹(4/3)', '14 km on bearing 045°', '10 km on bearing tan⁻¹(3/4)', '2√7 km on bearing 090°'],
        a: 0,
        e: '△PQR is right-angled at Q: PR = √(6² + 8²) = 10 km. Angle ∠QPR from North satisfies tan θ = East/North = 8/6 = 4/3.',
        w: ['', 'Use Pythagoras √(36 + 64) = 10 km, and 8 ≠ 6 so θ ≠ 45°.', 'Clockwise from North (PQ = 6), opposite is QR = 8 and adjacent is PQ = 6, so tan θ = 8/6 = 4/3.', 'Add squares in Pythagoras: 36 + 64 = 100.'],
      },
      {
        l: 3,
        q: 'Find the cosine of the largest angle in a triangle with sides 4 cm, 5 cm, and 6 cm.',
        o: ['1/8', '3/4', '9/16', '−1/8'],
        a: 0,
        e: 'Largest angle C is opposite longest side c = 6: cos C = (4² + 5² − 6²) / (2 × 4 × 5) = (16 + 25 − 36) / 40 = 5/40 = 1/8.',
        w: ['', '3/4 is cos A (opposite side 4, the smallest angle).', '9/16 is cos B (opposite side 5).', '16 + 25 − 36 = +5 > 0, so the triangle is acute.'],
      },
    ],
  },

  /* ─────────────── 5. COMMERCIAL & FINANCIAL MATHEMATICS (SS3 T1) ─────────────── */
  {
    id: 'm-fin',
    name: 'Commercial & Financial Mathematics',
    sec: 'Number & Numeration',
    boss: 'Financial Maths Test',
    goals: [
      'Compute Simple Interest, Compound Interest, and Reducing-Balance Depreciation',
      'Solve percentage profit/loss, trade discount, commission, VAT, and progressive income tax problems',
      'Calculate stock/share yields, dividends, and currency exchange conversions',
    ],
    trap: 'Percentage profit or loss is ALWAYS calculated on the COST PRICE (CP), never the selling price — unless explicitly stated! Also, Compound Interest I = P[(1 + R/100)ⁿ − 1] gives the interest alone, whereas A = P(1 + R/100)ⁿ is the total amount.',
    parts: [
      {
        title: 'Simple Interest, Compound Interest & Depreciation',
        idea: '<b>Simple interest</b> grows by the same fixed amount each year on the original principal <b>P</b>. <b>Compound interest</b> reinvests each period’s interest, growing exponentially, while <b>depreciation</b> reduces asset value by a percentage each year.',
        rules: [
          `Simple Interest: I = ${fr('PRT', '100')}, and Total Amount A = P + I.`,
          'Compound Amount: A = P(1 + R/100)ⁿ; Compound Interest = A − P.',
          'Depreciation (reducing balance): Value after n years V = P(1 − R/100)ⁿ.',
        ],
        ex: {
          q: 'Find the compound interest on ₦50,000 for 2 years at 10% per annum.',
          steps: [
            ['A = 50,000 × (1 + 10/100)² = 50,000 × (1.1)²', 'Substitute P = 50,000, R = 10, n = 2.'],
            ['A = 50,000 × 1.21 = ₦60,500', 'Total compound amount after 2 years.'],
            ['Compound Interest CI = ₦60,500 − ₦50,000 = ₦10,500', 'Subtract principal P to get interest alone!'],
          ],
        },
        tryit: {
          q: 'A machine bought for ₦200,000 depreciates at 15% per annum. Find its value after 2 years.',
          o: ['₦144,500', '₦140,000', '₦170,000', '₦145,000'],
          a: 0,
          h: 'Use V = 200,000 × (1 − 0.15)² = 200,000 × (0.85)².',
          e: '(0.85)² = 0.7225, and 200,000 × 0.7225 = ₦144,500. (₦140,000 wrongly uses straight-line 30%!).',
        },
      },
      {
        title: 'Profit, Discount, Tax & Shares',
        idea: 'Commercial arithmetic tracks how money flows from <b>Cost Price (CP)</b> to <b>Marked Price</b>, <b>Selling Price (SP)</b>, <b>Taxable Income</b>, and <b>Share Dividends</b>.',
        rules: [
          'Profit % = [(SP − CP) ÷ CP] × 100%; SP = CP × (100 + Profit%)/100.',
          'Taxable Income = Gross Income − Tax-Free Allowances; Tax = sum of slab rates on taxable income.',
          'Dividend on shares = Number of shares × Nominal (face) value × Dividend rate %.',
        ],
        ex: {
          q: 'A trader sells a phone for ₦72,000 at a loss of 10%. Find the cost price (CP).',
          steps: [
            ['Selling at 10% loss means SP = 90% of CP = 0.90 × CP', 'Never take 10% of SP!'],
            ['CP = 72,000 ÷ 0.90 = ₦80,000', 'Check: 10% of ₦80,000 is ₦8,000; 80,000 − 8,000 = 72,000.'],
          ],
        },
        tryit: {
          q: 'An investor buys 4,000 shares of nominal value ₦0.50 each at ₦1.20 per share. If a 12% dividend is declared, how much dividend does she receive?',
          o: ['₦240', '₦576', '₦480', '₦2,000'],
          a: 0,
          h: 'Dividends are ALWAYS paid on the NOMINAL (face) value, not the market price!',
          e: 'Total nominal value = 4,000 × ₦0.50 = ₦2,000. Dividend = 12% of ₦2,000 = ₦240.',
        },
      },
    ],
    qs: [
      {
        l: 1,
        q: 'At what rate per annum will ₦25,000 yield ₦6,000 simple interest in 3 years?',
        o: ['8%', '6%', '7.5%', '12%'],
        a: 0,
        e: 'R = (100 × I) ÷ (P × T) = (100 × 6,000) ÷ (25,000 × 3) = 600,000 ÷ 75,000 = 8%.',
        w: ['', 'Check 600 ÷ 75 = 8, not 6.', '25 × 3 = 75, and 600 ÷ 75 = 8.', '12% would be for 2 years.'],
        dx: 1,
      },
      {
        l: 1,
        q: 'A textbook marked ₦8,000 is sold at a 15% cash discount. How much does the buyer pay?',
        o: ['₦6,800', '₦1,200', '₦7,200', '₦6,500'],
        a: 0,
        e: 'Discount = 15% of 8,000 = ₦1,200. Cash price = 8,000 − 1,200 = ₦6,800.',
        w: ['', '₦1,200 is the discount saved, not the price paid.', '7,200 is a 10% discount.', '85% of 8,000 is 6,800.'],
      },
      {
        l: 2,
        q: 'By selling a bag of rice for ₦69,000, a merchant makes a profit of 15%. Find the cost price.',
        o: ['₦60,000', '₦58,650', '₦59,000', '₦62,000'],
        a: 0,
        e: '1.15 × CP = 69,000 ⇒ CP = 69,000 ÷ 1.15 = ₦60,000.',
        w: ['', '58,650 wrongly subtracts 15% of 69,000 (SP) instead of dividing by 1.15!', '69,000 ÷ 1.15 = 60,000.', 'Check: 15% of 60,000 = 9,000; 60,000 + 9,000 = 69,000.'],
      },
      {
        l: 2,
        q: 'Find the difference between the compound interest and simple interest on ₦100,000 for 2 years at 10% per annum.',
        o: ['₦1,000', '₦2,000', '₦500', '₦10,000'],
        a: 0,
        e: 'For 2 years, CI − SI = P(R/100)² = 100,000 × (0.10)² = ₦1,000. (CI = 21,000; SI = 20,000).',
        w: ['', 'CI is 21,000 and SI is 20,000; difference is 1,000.', '10% of the first year’s 10,000 interest is 1,000.', '10,000 is one year’s interest.'],
      },
      {
        l: 2,
        q: 'A civil servant earns ₦1,800,000 per annum with tax-free allowances of ₦500,000. If she pays 10% tax on her taxable income, find her annual tax.',
        o: ['₦130,000', '₦180,000', '₦50,000', '₦1,300,000'],
        a: 0,
        e: 'Taxable income = 1,800,000 − 500,000 = ₦1,300,000. Tax = 10% of 1,300,000 = ₦130,000.',
        w: ['', 'Deduct tax-free allowances BEFORE applying the 10% tax rate!', '50,000 is 10% of the allowance.', '1,300,000 is taxable income before multiplying by 10%.'],
      },
      {
        l: 3,
        q: 'A bill including 7.5% VAT is ₦43,000. What was the price before VAT was added?',
        o: ['₦40,000', '₦39,775', '₦40,250', '₦39,500'],
        a: 0,
        e: '1.075 × Price = 43,000 ⇒ Price = 43,000 ÷ 1.075 = ₦40,000.',
        w: ['', '39,775 wrongly takes 7.5% off 43,000 instead of dividing by 1.075.', 'Check 40,000 × 1.075 = 43,000.', '43,000 ÷ 1.075 = 40,000.'],
      },
      {
        l: 3,
        q: 'Successive trade discounts of 20% and 10% are equivalent to a single discount of:',
        o: ['28%', '30%', '25%', '18%'],
        a: 0,
        e: 'Multiplier = 0.80 × 0.90 = 0.72, which leaves 72% of the marked price — a single discount of 100% − 72% = 28%.',
        w: ['', 'Discounts compound sequentially on the reduced price, so 20% + 10% is 28%, NOT 30%!', '0.8 × 0.9 = 0.72 → 28% off.', '28% off, not 18%.'],
      },
    ],
  },

  /* ─────────────── 6. GRAPHICAL INEQUALITIES & LINEAR PROGRAMMING (SS3 T1) ─────────────── */
  {
    id: 'm-linprog',
    name: 'Graphical Inequalities & Linear Programming',
    sec: 'Algebraic Processes',
    boss: 'Linear Programming Test',
    goals: [
      'Identify half-plane regions defined by linear inequalities using solid (≤, ≥) and broken (<, >) boundary lines',
      'Formulate linear constraints and objective functions P = ax + by from real-world resource problems',
      'Maximise or minimise an objective function by evaluating it at the vertices (corner points) of the feasible polygon',
    ],
    trap: 'Use a BROKEN (dashed) line for strict inequalities (< or >) and a SOLID line for inclusive inequalities (≤ or ≥). Never guess which side to shade by eye alone — substitute the origin (0, 0) to test whether the inequality holds!',
    parts: [
      {
        title: 'Half-Planes, Boundary Lines & Feasible Regions',
        idea: 'A straight line <b>ax + by = c</b> splits the Cartesian plane into two half-planes. Testing one point not on the line—usually <b>(0, 0)</b>—instantly tells you which side satisfies the inequality.',
        rules: [
          '≤ or ≥ uses a SOLID boundary line; < or > uses a BROKEN (dashed) boundary line.',
          'Origin test: if (0, 0) makes the inequality TRUE, the origin’s side is the wanted region.',
          'Non-negativity constraints x ≥ 0 and y ≥ 0 restrict the feasible region to the first quadrant.',
        ],
        ex: {
          q: 'Does the point (2, 3) lie inside the region defined by 2x + y ≤ 8, x ≥ 1, and y > 2?',
          steps: [
            ['Check 2x + y ≤ 8: 2(2) + 3 = 7 ≤ 8 ✓', 'First constraint satisfied.'],
            ['Check x ≥ 1: 2 ≥ 1 ✓, and y > 2: 3 > 2 ✓', 'All three inequalities hold simultaneously!'],
          ],
        },
        tryit: {
          q: 'Which inequality represents the half-plane containing the origin (0, 0) bounded by the solid line 3x + 4y = 12?',
          o: ['3x + 4y ≤ 12', '3x + 4y ≥ 12', '3x + 4y < 12', '3x − 4y ≥ 12'],
          a: 0,
          h: 'Solid line requires ≤ or ≥. Substitute (0, 0): 3(0) + 4(0) = 0, which is ≤ 12.',
          e: 'At (0, 0), 3(0) + 4(0) = 0 ≤ 12, and "solid line" requires ≤ rather than <.',
        },
      },
      {
        title: 'Corner-Point Theorem & Objective Optimisation',
        idea: 'In Linear Programming, the maximum or minimum of a linear objective function <b>P = ax + by</b> over a bounded convex feasible polygon ALWAYS occurs at one of the polygon’s <b>vertices (corner points)</b>.',
        rules: [
          'Step 1: Find the intersection coordinates (vertices) of the boundary lines.',
          'Step 2: Substitute each vertex (x, y) into the objective function P = ax + by.',
          'Step 3: Pick the largest value for MAXIMISATION (e.g. profit) or smallest for MINIMISATION (e.g. cost).',
        ],
        ex: {
          q: 'Maximise profit P = 50x + 40y over the feasible polygon with vertices (0, 0), (6, 0), (4, 3), and (0, 5).',
          steps: [
            ['At (0, 0): P = 0; at (6, 0): P = 50(6) + 0 = 300', 'Evaluate P at the axis intercepts.'],
            ['At (4, 3): P = 50(4) + 40(3) = 200 + 120 = 320', 'Evaluate at interior corner (4, 3).'],
            ['At (0, 5): P = 0 + 40(5) = 200 ⇒ Maximum P = 320 at (4, 3)', '320 is the largest value!'],
          ],
        },
        tryit: {
          q: 'Minimise cost C = 3x + 5y subject to vertices A(0, 6), B(2, 3), and D(7, 0).',
          o: ['21 at (2, 3)', '21 at (7, 0)', 'Both 21 at (2, 3) and (7, 0)', '30 at (0, 6)'],
          a: 2,
          h: 'Evaluate C = 3x + 5y at every vertex carefully!',
          e: 'At A(0,6): C = 30. At B(2,3): C = 6 + 15 = 21. At D(7,0): C = 21 + 0 = 21. Minimum cost is 21 (attained along segment BD).',
        },
      },
    ],
    qs: [
      {
        l: 1,
        q: 'When graphing the strict inequality y &lt; 2x − 5, the boundary line y = 2x − 5 should be drawn as:',
        o: ['A broken (dashed) line', 'A thick solid line', 'A parabola', 'The x-axis'],
        a: 0,
        e: 'Strict inequalities (< or >) exclude points on the boundary line itself, so the line is drawn broken/dashed.',
        w: ['', 'Solid lines are only for ≤ or ≥.', 'y = 2x − 5 is linear.', 'y = 2x − 5 has gradient 2 and intercept −5.'],
        dx: 1,
      },
      {
        l: 1,
        q: 'Which of the following points satisfies BOTH x + y ≤ 6 and x − y &gt; 2?',
        o: ['(4, 1)', '(3, 3)', '(2, 1)', '(5, 3)'],
        a: 0,
        e: 'Test (4, 1): 4 + 1 = 5 ≤ 6 ✓ and 4 − 1 = 3 > 2 ✓.',
        w: ['', 'For (3, 3), 3 − 3 = 0, which is not > 2.', 'For (2, 1), 2 − 1 = 1, not > 2.', 'For (5, 3), 5 + 3 = 8, which violates ≤ 6.'],
      },
      {
        l: 2,
        q: 'A baker makes x loaves of bread and y cakes daily. Each loaf uses 2 kg of flour and each cake uses 1 kg, with at most 40 kg of flour available. Which inequality models this?',
        o: ['2x + y ≤ 40', '2x + y ≥ 40', 'x + 2y ≤ 40', '2x + y < 40'],
        a: 0,
        e: '"At most 40 kg" means less than or equal to 40: 2x + y ≤ 40.',
        w: ['', '≥ means "at least", not "at most".', 'Loaves (x) use 2 kg each, so 2 goes with x.', '"At most 40" includes using all 40 kg, so use ≤.'],
      },
      {
        l: 2,
        q: 'Find the maximum value of Z = 4x + 3y subject to x ≥ 0, y ≥ 0, and x + y ≤ 5.',
        o: ['20', '15', '17.5', '12'],
        a: 0,
        e: 'Vertices of the triangle are (0, 0) → Z = 0; (5, 0) → Z = 20; (0, 5) → Z = 15. Maximum Z = 20 at (5, 0).',
        w: ['', '15 is at (0, 5), but (5, 0) gives 4(5) = 20.', '17.5 is at the midpoint (2.5, 2.5); optimum is at corner (5, 0).', '20 is achievable at (5, 0).'],
      },
      {
        l: 2,
        q: 'Find the corner point where the boundary lines x + 2y = 10 and 2x + y = 8 intersect.',
        o: ['(2, 4)', '(4, 2)', '(3, 2)', '(2, 3)'],
        a: 0,
        e: 'From 2x + y = 8, y = 8 − 2x. Substitute: x + 2(8 − 2x) = 10 ⇒ 16 − 3x = 10 ⇒ x = 2, y = 4.',
        w: ['', 'At (4, 2), 2(4) + 2 = 10 ≠ 8.', 'At (3, 2), 3 + 4 = 7 ≠ 10.', 'At (2, 3), 2 + 6 = 8 ≠ 10.'],
      },
      {
        l: 3,
        q: 'Maximise P = 3x + 4y subject to x ≥ 0, y ≥ 0, x + 2y ≤ 10, and 2x + y ≤ 8.',
        o: ['22', '20', '12', '24'],
        a: 0,
        e: 'Vertices are (0, 0) → 0, (4, 0) → 12, (0, 5) → 20, and intersection (2, 4) → 3(2) + 4(4) = 6 + 16 = 22.',
        w: ['', '20 is at (0, 5), but vertex (2, 4) gives 22!', '12 is at (4, 0).', '24 is outside the feasible region.'],
      },
      {
        l: 3,
        q: 'How many points (x, y) with INTEGER coordinates satisfy x ≥ 1, y ≥ 1, and x + y ≤ 4?',
        o: ['6', '4', '10', '3'],
        a: 0,
        e: 'List valid pairs: (1,1), (1,2), (1,3), (2,1), (2,2), (3,1) — total = 6 integer lattice points.',
        w: ['', 'Don’t forget points strictly inside like (1,1) and (1,2) as well as x + y = 4!', '10 includes x = 0 or y = 0, which violate x ≥ 1, y ≥ 1.', '3 only counts x + y = 4.'],
      },
    ],
  },

  /* ─────────────── 7. VECTORS IN 2D & PLANE TRANSFORMATIONS (SS3 T2) ─────────────── */
  {
    id: 'm-vec',
    name: 'Vectors in 2D & Plane Transformations',
    sec: 'Geometry & Mensuration',
    boss: 'Vectors & Transformations Test',
    goals: [
      'Add, subtract, and resolve 2D vectors a = xi + yj, and compute magnitude |a|, unit vectors, and position vectors AB = OB − OA',
      'Compute the scalar (dot) product a · b = |a||b| cos θ and test for perpendicular or parallel vectors',
      'Find image coordinates under translation, reflection, rotation (90°, 180°, 270°), and enlargement',
    ],
    trap: 'Displacement vector AB is ALWAYS "head minus tail": AB = OB − OA, NEVER OA − OB! Also, two non-zero vectors are PERPENDICULAR if and only if their dot product a · b = x₁x₂ + y₁y₂ = 0.',
    parts: [
      {
        title: 'Position Vectors, Magnitude & Scalar (Dot) Product',
        idea: 'A <b>vector</b> has both magnitude and direction. From origin O, point A(x, y) has position vector <b>OA = xi + yj</b>, and moving from A to B gives <b>AB = AO + OB = OB − OA</b>.',
        rules: [
          'Magnitude (modulus) of a = xi + yj is |a| = √(x² + y²); unit vector â = a ÷ |a|.',
          'Triangle law: AB = OB − OA; midpoint M of AB has OM = ½(OA + OB).',
          'Dot product: a · b = x₁x₂ + y₁y₂ = |a||b| cos θ. Perpendicular ⇔ a · b = 0.',
        ],
        ex: {
          q: 'Given A(2, −1) and B(5, 3), find vector AB, its magnitude |AB|, and the unit vector in the direction of AB.',
          steps: [
            ['AB = OB − OA = (5 − 2)i + (3 − (−1))j = 3i + 4j', 'Head minus tail: B minus A.'],
            ['|AB| = √(3² + 4²) = √25 = 5', 'Pythagorean modulus.'],
            ['Unit vector = (3i + 4j) ÷ 5 = (3/5)i + (4/5)j', 'Divide vector by its magnitude.'],
          ],
        },
        tryit: {
          q: 'For what value of k are the vectors p = 6i + kj and q = 2i − 3j perpendicular?',
          o: ['4', '−4', '9', '−9'],
          a: 0,
          h: 'Perpendicular vectors have dot product p · q = 0: (6)(2) + (k)(−3) = 0.',
          e: '12 − 3k = 0 ⇒ 3k = 12 ⇒ k = 4.',
        },
      },
      {
        title: 'Translations, Reflections, Rotations & Enlargements',
        idea: 'Plane transformations map each point P(x, y) to an image P′(x′, y′). Translations, reflections, and rotations are <b>isometries</b> (preserving lengths and areas), whereas an enlargement with scale factor k multiplies area by <b>k²</b>.',
        rules: [
          'Reflection: in x-axis → (x, −y); in y-axis → (−x, y); in line y = x → (y, x); in y = −x → (−y, −x).',
          'Rotation about (0, 0): 90° anticlockwise → (−y, x); 90° clockwise → (y, −x); 180° → (−x, −y).',
          'Enlargement about (0, 0) with scale factor k → (kx, ky).',
        ],
        ex: {
          q: 'Find the image of P(4, −3) after a 90° anticlockwise rotation about the origin.',
          steps: [
            ['Rule for +90° (anticlockwise) about O: (x, y) → (−y, x)', 'Swap coordinates and negate the new first coordinate.'],
            ['P(4, −3) → (−(−3), 4) = (3, 4)', 'Image is P′(3, 4).'],
          ],
        },
        tryit: {
          q: 'Find the image of Q(−2, 5) after reflection in the line y = x.',
          o: ['(5, −2)', '(2, −5)', '(−5, 2)', '(2, 5)'],
          a: 0,
          h: 'Reflection in y = x simply swaps x and y without changing signs!',
          e: 'Swapping x and y maps (−2, 5) directly to (5, −2).',
        },
      },
    ],
    qs: [
      {
        l: 1,
        q: 'Find the modulus (magnitude) of the vector v = 5i − 12j.',
        o: ['13', '7', '17', '√119'],
        a: 0,
        e: '|v| = √(5² + (−12)²) = √(25 + 144) = √169 = 13.',
        w: ['', '(−12)² is +144, not −144.', '√(25 + 144) = 13, not 5 + 12 = 17.', '144 + 25 = 169, not 119.'],
        dx: 1,
      },
      {
        l: 1,
        q: 'If OA = 4i − j and OB = −2i + 5j, find the vector AB.',
        o: ['−6i + 6j', '6i − 6j', '2i + 4j', '−2i + 4j'],
        a: 0,
        e: 'AB = OB − OA = (−2 − 4)i + (5 − (−1))j = −6i + 6j.',
        w: ['', '6i − 6j is BA (= OA − OB); AB is always OB − OA!', '2i + 4j adds OB + OA instead of subtracting.', 'Subtract OA from OB carefully.'],
      },
      {
        l: 2,
        q: 'Find the scalar (dot) product of a = 3i − 2j and b = 4i + 5j.',
        o: ['2', '22', '12i − 10j', '−2'],
        a: 0,
        e: 'a · b = (3)(4) + (−2)(5) = 12 − 10 = 2 (a scalar number, never a vector!).',
        w: ['', 'Watch the minus sign: (−2)(5) = −10, so 12 − 10 = 2.', 'The dot product is a single scalar number, not a vector with i and j.', '12 − 10 = +2.'],
      },
      {
        l: 2,
        q: 'A translation T maps P(3, −2) onto P′(7, 1). Find the image of Q(−1, 4) under the same translation T.',
        o: ['(3, 7)', '(−5, 1)', '(4, 3)', '(3, 1)'],
        a: 0,
        e: 'Translation vector t = P′ − P = (7 − 3, 1 − (−2)) = (4, 3). Image Q′ = (−1 + 4, 4 + 3) = (3, 7).',
        w: ['', '(−5, 1) subtracts t instead of adding it.', '(4, 3) is the translation vector itself, not Q′.', '4 + 3 = 7 for the y-coordinate.'],
      },
      {
        l: 2,
        q: 'Find the image of the point (6, −2) under a clockwise rotation of 90° about the origin.',
        o: ['(−2, −6)', '(2, 6)', '(−6, 2)', '(6, 2)'],
        a: 0,
        e: '90° clockwise about (0, 0) maps (x, y) → (y, −x), so (6, −2) → (−2, −6).',
        w: ['', '(2, 6) is 90° anticlockwise (−y, x).', '(−6, 2) is 180° rotation.', '(6, 2) is reflection in the x-axis.'],
      },
      {
        l: 3,
        q: 'Find the cosine of the angle θ between vectors a = i + 2j and b = 2i + j.',
        o: ['4/5', '3/5', '1/√5', '2/5'],
        a: 0,
        e: 'cos θ = (a · b) / (|a||b|) = (1×2 + 2×1) / (√5 × √5) = 4/5.',
        w: ['', 'a · b = 2 + 2 = 4, and √5 × √5 = 5, so 4/5.', '|a||b| = √5 × √5 = 5.', '1×2 + 2×1 = 4, not 2.'],
      },
      {
        l: 3,
        q: 'Vectors p = 4i − 6j and q = −6i + mj are parallel. Find m.',
        o: ['9', '−9', '4', '−4'],
        a: 0,
        e: 'Parallel vectors have proportional components: 4 / (−6) = (−6) / m ⇒ 4m = 36 ⇒ m = 9.',
        w: ['', '4/(−6) is negative, so (−6)/m must also be negative ⇒ m = +9.', 'm = 4 makes the dot product −24 − 24 ≠ 0 and ratios unequal.', 'Check: q = −1.5p = −1.5(4i − 6j) = −6i + 9j.'],
      },
    ],
  },

  /* ─────────────── 8. LONGITUDE, LATITUDE & EARTH GEOMETRY (SS3 T2) ─────────────── */
  {
    id: 'm-earth',
    name: 'Longitude, Latitude & Earth Geometry',
    sec: 'Geometry & Mensuration',
    boss: 'Earth Geometry Test',
    goals: [
      'Find angular differences θ (same hemisphere: subtract; opposite hemispheres: add)',
      'Calculate shortest great-circle distances along meridians of longitude or the Equator using D = (θ/360) × 2πR',
      'Calculate distances along parallels of latitude α° using small-circle radius r = R cos α',
    ],
    trap: 'Every meridian of longitude and the Equator are GREAT CIRCLES (radius R ≈ 6400 km), whereas any parallel of latitude α° ≠ 0° is a SMALL CIRCLE of shrunk radius r = R cos α! Also: same hemisphere (N & N, or E & E) → SUBTRACT angles; opposite hemispheres (N & S, or E & W) → ADD angles.',
    parts: [
      {
        title: 'Angular Difference & Great-Circle Distances',
        idea: 'Positions on Earth are given as <b>(Latitude N/S, Longitude E/W)</b>. All meridians of longitude and the Equator have the full Earth radius <b>R ≈ 6,400 km</b>.',
        rules: [
          'Angular difference θ: SAME hemisphere (both N, both S, both E, or both W) → SUBTRACT; OPPOSITE hemispheres (N & S, or E & W) → ADD.',
          `Distance along a meridian or the Equator (great circle): D = ${fr('θ', '360°')} × 2πR.`,
          '15° of longitude corresponds to 1 hour of local time difference (East is ahead, West is behind).',
        ],
        ex: {
          q: 'Two towns P(12°N, 25°E) and Q(18°S, 25°E) lie on the same meridian. Taking R = 6,400 km and π = 22/7, find the angular difference and set up distance PQ.',
          steps: [
            ['Same longitude (25°E), opposite hemispheres (12°N and 18°S) ⇒ θ = 12° + 18° = 30°', 'Opposite sides of the Equator → ADD!'],
            ['Meridian is a great circle: PQ = (30°/360°) × 2 × (22/7) × 6400 ≈ 3,352 km', 'Use full Earth radius R = 6,400 km.'],
          ],
        },
        tryit: {
          q: 'Find the angular difference in longitude between Accra (5.6°N, 0.2°W) and Lagos (6.5°N, 3.4°E) if both were on the same latitude.',
          o: ['3.6°', '3.2°', '0.9°', '12.1°'],
          a: 0,
          h: '0.2°W and 3.4°E are on OPPOSITE sides of the Prime Meridian (0°), so ADD them!',
          e: 'θ = 0.2° + 3.4° = 3.6°.',
        },
      },
      {
        title: 'Parallels of Latitude (Small Circles r = R cos α)',
        idea: 'As you move towards the North or South Pole at latitude <b>α°</b>, the horizontal circle shrinks to radius <b>r = R cos α</b>. Distance along a parallel of latitude is therefore multiplied by <b>cos α</b>.',
        rules: [
          'Radius of parallel of latitude α°: r = R cos α (at 60°N or 60°S, r = R cos 60° = ½R!).',
          `Distance along parallel of latitude α°: d = ${fr('θ', '360°')} × 2πR cos α.`,
          'Average speed of an aircraft = Distance ÷ Time (in km/h; 1 knot = 1 nautical mile per hour, where 1′ of great-circle arc = 1 nautical mile).',
        ],
        ex: {
          q: 'Find the radius of the parallel of latitude 60°N, given Earth radius R = 6,400 km.',
          steps: [
            ['r = R cos α = 6,400 × cos 60°', 'Small-circle radius formula.'],
            ['r = 6,400 × 0.5 = 3,200 km', 'At 60° latitude, the parallel has exactly half the Equator’s radius!'],
          ],
        },
        tryit: {
          q: 'X(60°N, 15°W) and Y(60°N, 45°E) lie on latitude 60°N. Find distance XY in terms of π and R.',
          o: ['πR / 6', 'πR / 3', 'πR / 12', '2πR / 3'],
          a: 0,
          h: 'θ = 15° + 45° = 60°. Then XY = (60/360) × 2πR cos 60°.',
          e: 'XY = (1/6) × 2πR × (1/2) = πR / 6.',
        },
      },
    ],
    qs: [
      {
        l: 1,
        q: 'Two cities A(35°N, 40°E) and B(10°N, 40°E) lie on the same meridian. What is their angular difference?',
        o: ['25°', '45°', '80°', '0°'],
        a: 0,
        e: 'Both cities are in the Northern hemisphere (35°N and 10°N), so subtract: 35° − 10° = 25°.',
        w: ['', '45° adds them — you only add when one is North and the other is South!', '40°E is common to both.', 'Their latitudes differ by 25°.'],
        dx: 1,
      },
      {
        l: 1,
        q: 'If the radius of the Earth is R, what is the circumference of the parallel of latitude 60°S?',
        o: ['πR', '2πR', 'πR√3', '½πR'],
        a: 0,
        e: 'Circumference = 2πr = 2π(R cos 60°) = 2πR(½) = πR.',
        w: ['', '2πR is the circumference of the Equator (great circle).', 'cos 60° = ½, whereas cos 30° = √3/2.', '2 × ½ = 1, giving πR.'],
      },
      {
        l: 2,
        q: 'When it is 12:00 noon in London (0° longitude), what is the local time at a town on longitude 45°E?',
        o: ['3:00 pm', '9:00 am', '2:00 pm', '4:00 pm'],
        a: 0,
        e: 'Every 15° of longitude = 1 hour. 45° ÷ 15° = 3 hours. Since 45°E is East of 0°, time is ahead: 12:00 + 3 h = 3:00 pm.',
        w: ['', '9:00 am would be for 45°W (behind GMT).', '30°E would be 2:00 pm.', '60°E would be 4:00 pm.'],
      },
      {
        l: 2,
        q: 'Points P(0°, 20°W) and Q(0°, 70°E) lie on the Equator. Find the distance PQ in terms of π and R.',
        o: ['½πR', '¼πR', 'πR', '⅓πR'],
        a: 0,
        e: 'θ = 20° + 70° = 90° (opposite sides of 0°). On the Equator (cos 0° = 1): PQ = (90/360) × 2πR = ½πR.',
        w: ['', '(90/360) × 2πR = (1/4) × 2πR = ½πR, not ¼πR!', 'πR corresponds to 180°.', '⅓πR corresponds to 60°.'],
      },
      {
        l: 2,
        q: 'Which of the following circles on the Earth’s surface is a GREAT circle?',
        o: ['Every meridian of longitude', 'Latitude 30°N', 'The Tropic of Cancer (23.5°N)', 'The Arctic Circle (66.5°N)'],
        a: 0,
        e: 'All meridians of longitude (paired with their anti-meridian) and the Equator (0°) pass through Earth’s centre and are great circles.',
        w: ['', 'Any non-zero parallel of latitude is a small circle.', '23.5°N is a small circle.', '66.5°N is a small circle.'],
      },
      {
        l: 3,
        q: 'A plane flies due East along latitude 60°N from (60°N, 10°W) to (60°N, 50°E) in 5 hours. Taking π = 3.142 and R = 6,400 km, find its approximate speed.',
        o: ['670 km/h', '1,340 km/h', '335 km/h', '800 km/h'],
        a: 0,
        e: 'θ = 10° + 50° = 60°. Distance d = (60/360) × 2 × 3.142 × 6400 × cos 60° = (1/6) × 6400 × 3.142 ≈ 3,351.5 km. Speed = 3351.5 ÷ 5 ≈ 670 km/h.',
        w: ['', '1,340 km/h forgets to multiply by cos 60° = ½ for the small circle!', '335 km/h divides by 10 instead of 5.', 'Check (60/360) × 2πR(0.5) ÷ 5 ≈ 670 km/h.'],
      },
      {
        l: 3,
        q: 'Two towns M(40°N, 30°E) and N(40°N, 150°W) lie on opposite meridians (30° + 150° = 180°). What is the angle subtended at Earth’s centre along the shortest route over the North Pole?',
        o: ['100°', '80°', '180°', '140°'],
        a: 0,
        e: 'From 40°N to the North Pole (90°N) is 50° on each side, so the great-circle polar arc subtends (90° − 40°) + (90° − 40°) = 50° + 50° = 100°.',
        w: ['', '80° adds 40° + 40° instead of co-latitudes (90° − 40°) + (90° − 40°)!', '180° is the angular difference in longitude, not the polar great-circle angle.', '90 − 40 = 50° on each side → 100°.'],
      },
    ],
  },
];

/**
 * Rich Definitions & Formal Theorems/Laws injected into Mathematics Study Notes & Lessons
 * so every Maths topic's Full Illustrated Notes and 1-Min Reread Sheet match Chemistry's richness.
 */
export const MATH_NERDC_EXTRA_DEFS: Record<
  string,
  { d?: [string, string][]; l?: [string, string][] }[]
> = {
  bases: [
    {
      d: [
        ['Radix (Base b)', 'The number of distinct digits (0 to b − 1) used in a positional numeral system; e.g. binary (base 2) uses {0, 1}.'],
        ['Place Value', 'In base b, the k-th digit from the units place carries weight bᵏ (…, b², b¹, b⁰; and b⁻¹, b⁻² after the point).'],
      ],
    },
  ],
  'm-mod': [
    {
      d: [
        ['Congruence Modulo n', 'Integers a and b are congruent modulo n, written a ≡ b (mod n), if (a − b) is an exact multiple of n.'],
        ['Least Residue', 'The unique non-negative remainder r ∈ {0, 1, …, n − 1} when an integer is divided by n.'],
      ],
      l: [
        ['Standard Form Convention', 'Every positive real number writes uniquely as A × 10ⁿ where 1 ≤ A < 10 and n ∈ ℤ.'],
      ],
    },
  ],
  frac: [
    {
      d: [
        ['Percentage Error', 'Percentage Error = (|Measured − Actual| ÷ Actual) × 100%, always divided by the true/actual value.'],
        ['Ratio Sharing', 'Dividing total T in ratio a : b : c allocates [a ÷ (a + b + c)] × T to the first part.'],
      ],
    },
  ],
  indices: [
    {
      l: [
        ['Index Laws', 'xᵃ × xᵇ = xᵃ⁺ᵇ, xᵃ ÷ xᵇ = xᵃ⁻ᵇ, (xᵃ)ᵇ = xᵃᵇ, x⁰ = 1 (x ≠ 0), x⁻ⁿ = 1/xⁿ, and x^(p/q) = (q√x)ᵖ.'],
        ['Logarithm Laws', 'logₐ(MN) = logₐM + logₐN, logₐ(M/N) = logₐM − logₐN, logₐ(Mᵏ) = k logₐM, and logₐa = 1, logₐ1 = 0.'],
      ],
    },
  ],
  surds: [
    {
      d: [
        ['Surd', 'An irrational root of a rational number, such as √2, √3, or 5 − 2√7, which cannot be written as an exact fraction.'],
        ['Conjugate Surd', 'The conjugate of (a + b√c) is (a − b√c); their product is rational: a² − b²c.'],
      ],
    },
  ],
  sets: [
    {
      d: [
        ['Power Set P(A)', 'The set of all subsets of A. If n(A) = k, then A has 2ᵏ subsets and (2ᵏ − 1) proper subsets.'],
        ['Complement A′', 'All elements in the universal set ξ that do NOT belong to A: n(A′) = n(ξ) − n(A).'],
      ],
      l: [
        ['Inclusion–Exclusion Formula', 'For two sets: n(A ∪ B) = n(A) + n(B) − n(A ∩ B).'],
      ],
    },
  ],
  'm-logic': [
    {
      d: [
        ['Proposition', 'A declarative sentence that is definitely True (T) or False (F), never both simultaneously.'],
        ['Tautology & Contradiction', 'A tautology is a compound proposition that is always True; a contradiction is always False.'],
      ],
      l: [
        ['Law of Contrapositive', '(p ⇒ q) ≡ (~q ⇒ ~p) and De Morgan’s Laws: ~(p ∧ q) ≡ ~p ∨ ~q; ~(p ∨ q) ≡ ~p ∧ ~q.'],
      ],
    },
  ],
  quad: [
    {
      d: [
        ['Discriminant (Δ = b² − 4ac)', 'Determines root nature of ax² + bx + c = 0: Δ > 0 gives 2 distinct real roots, Δ = 0 gives equal roots, Δ < 0 gives no real roots.'],
      ],
      l: [
        ['Vieta’s Root Relations', 'If α and β are roots of ax² + bx + c = 0, then α + β = −b/a, αβ = c/a, and the equation is x² − (α + β)x + αβ = 0.'],
      ],
    },
  ],
  simul: [
    {
      d: [
        ['Simultaneous System', 'A pair of equations satisfied by the same ordered pair(s) (x, y), corresponding to the intersection point(s) of their graphs.'],
      ],
    },
  ],
  ineq: [
    {
      l: [
        ['Negative Multiplier Rule', 'Multiplying or dividing both sides of an inequality by a NEGATIVE number reverses the inequality sign (< becomes >).'],
      ],
    },
  ],
  variation: [
    {
      d: [
        ['Direct & Inverse Variation', 'Direct: y = kx (y/x = constant). Inverse: y = k/x (xy = constant).'],
        ['Partial Variation', 'A quantity is partly constant and partly varies with another: y = a + bx (two conditions determine constants a and b).'],
      ],
    },
  ],
  prog: [
    {
      l: [
        ['Arithmetic Progression (AP)', 'Tₙ = a + (n − 1)d and Sₙ = (n/2)[2a + (n − 1)d] = (n/2)(a + l).'],
        ['Geometric Progression (GP)', 'Tₙ = arⁿ⁻¹, Sₙ = a(rⁿ − 1)/(r − 1), and Sum to Infinity S∞ = a/(1 − r) for |r| < 1.'],
      ],
    },
  ],
  poly: [
    {
      l: [
        ['Remainder Theorem', 'When polynomial P(x) is divided by (x − a), the remainder is R = P(a).'],
        ['Factor Theorem', '(x − a) is an exact factor of P(x) if and only if P(a) = 0.'],
      ],
    },
  ],
  binop: [
    {
      d: [
        ['Identity Element e', 'An element e ∈ S such that a * e = e * a = a for all a ∈ S.'],
        ['Inverse Element a⁻¹', 'An element a⁻¹ ∈ S such that a * a⁻¹ = a⁻¹ * a = e (undefined where the denominator vanishes).'],
      ],
    },
  ],
  matrix: [
    {
      d: [
        ['Determinant |A|', 'For A = [[a, b], [c, d]], det(A) = ad − bc. Matrix A is singular (non-invertible) when ad − bc = 0.'],
      ],
      l: [
        ['2×2 Matrix Inverse', 'A⁻¹ = [1 ÷ (ad − bc)] × [[d, −b], [−c, a]] — swap leading diagonal, negate off-diagonal, divide by det(A).'],
      ],
    },
  ],
  'm-linprog': [
    {
      d: [
        ['Feasible Region', 'The convex polygon of points (x, y) simultaneously satisfying every linear constraint inequality.'],
      ],
      l: [
        ['Corner-Point Theorem', 'The maximum or minimum of a linear objective function P = ax + by over a bounded feasible region occurs at a vertex.'],
      ],
    },
  ],
  geom: [
    {
      l: [
        ['Central & Inscribed Angle Theorem', 'The angle subtended by an arc at the centre of a circle is twice the angle it subtends at any point on the remaining circumference; angle in a semicircle is 90°.'],
        ['Cyclic Quadrilateral & Alternate Segment', 'Opposite angles of a cyclic quadrilateral sum to 180°; angle between tangent and chord equals angle in the alternate segment.'],
      ],
    },
  ],
  'm-proof': [
    {
      l: [
        ['Polygon Angle Theorems', 'Interior angle sum = (n − 2) × 180°; Exterior angle sum = 360° for every convex polygon.'],
        ['Area & Volume Similarity Law', 'If linear scale factor is k, Area ratio = k² and Volume ratio = k³.'],
      ],
    },
  ],
  loci: [
    {
      d: [
        ['Locus Equidistant from 2 Points', 'The perpendicular bisector of the segment joining the two points A and B.'],
        ['Locus Equidistant from 2 Intersecting Lines', 'The pair of angle bisectors of the angles between the two lines.'],
      ],
    },
  ],
  mens: [
    {
      l: [
        ['Sector & Arc Formulas', 'Arc length l = (θ/360°) × 2πr; Sector area A = (θ/360°) × πr²; Cone curved surface = πrl.'],
        ['3D Solids Volumes', 'Cylinder V = πr²h; Cone/Pyramid V = ⅓ × Base Area × h; Sphere V = (4/3)πr³, Surface Area = 4πr².'],
      ],
    },
  ],
  trig: [
    {
      l: [
        ['Pythagorean & Quotient Identities', 'sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ, tan θ = sin θ ÷ cos θ, and sin θ = cos(90° − θ).'],
      ],
    },
  ],
  'm-bearing': [
    {
      l: [
        ['Sine & Cosine Rules', 'a/sin A = b/sin B = c/sin C; a² = b² + c² − 2bc cos A; Area = ½ab sin C.'],
        ['Three-Figure & Back Bearings', 'Measured 000°–360° clockwise from North; Back bearing = θ ± 180°.'],
      ],
    },
  ],
  coord: [
    {
      l: [
        ['Line Geometry Formulas', 'Gradient m = (y₂ − y₁)/(x₂ − x₁); Parallel: m₁ = m₂; Perpendicular: m₁m₂ = −1; Distance d = √[(x₂ − x₁)² + (y₂ − y₁)²].'],
      ],
    },
  ],
  'm-vec': [
    {
      d: [
        ['Position & Displacement Vector', 'AB = OB − OA; Unit vector â = a ÷ |a| where |a| = √(x² + y²).'],
      ],
      l: [
        ['Scalar (Dot) Product Orthogonality', 'a · b = x₁x₂ + y₁y₂ = |a||b| cos θ; non-zero vectors a and b are perpendicular iff a · b = 0.'],
      ],
    },
  ],
  'm-earth': [
    {
      d: [
        ['Great Circle vs Small Circle', 'Meridians and the Equator have full Earth radius R ≈ 6400 km; latitude α° has small-circle radius r = R cos α.'],
      ],
      l: [
        ['Parallel of Latitude Arc Length', 'd = (θ/360°) × 2πR cos α, where θ = |λ₁ − λ₂| (same side) or λ₁ + λ₂ (opposite sides).'],
      ],
    },
  ],
  'm-fin': [
    {
      l: [
        ['Simple vs Compound Growth', 'Simple Interest I = PRT/100; Compound Amount A = P(1 + R/100)ⁿ; Reducing Depreciation V = P(1 − R/100)ⁿ.'],
      ],
    },
  ],
  diff: [
    {
      l: [
        ['Power, Product, Quotient & Chain Rules', 'd/dx(xⁿ) = nxⁿ⁻¹; d/dx(uv) = u dv/dx + v du/dx; d/dx(u/v) = (v du/dx − u dv/dx)/v².'],
        ['Stationary Points Test', 'At turning points dy/dx = 0: d²y/dx² < 0 gives a local MAXIMUM; d²y/dx² > 0 gives a local MINIMUM.'],
      ],
    },
  ],
  integ: [
    {
      l: [
        ['Power Integration & Fundamental Theorem', '∫xⁿ dx = xⁿ⁺¹/(n + 1) + C (n ≠ −1); ∫ₐᵇ f(x) dx = F(b) − F(a).'],
      ],
    },
  ],
  stats: [
    {
      d: [
        ['Mean, Median & Mode', 'Mean x̄ = Σfx / Σf; Median = 50th percentile on an ordered list or ogive; Mode = value/class with highest frequency.'],
      ],
    },
  ],
  disp: [
    {
      l: [
        ['Variance & Standard Deviation', 'Variance σ² = Σf(x − x̄)² / Σf = (Σfx² / Σf) − x̄²; Standard Deviation σ = √(Variance).'],
      ],
    },
  ],
  perm: [
    {
      l: [
        ['Permutations vs Combinations', 'Order matters: ⁿPᵣ = n! / (n − r)!; Order does NOT matter: ⁿCᵣ = n! / [r!(n − r)!]; Circular table: (n − 1)!.'],
      ],
    },
  ],
  prob: [
    {
      l: [
        ['Addition & Multiplication Laws', 'OR (mutually exclusive): P(A ∪ B) = P(A) + P(B). AND (independent): P(A ∩ B) = P(A) × P(B). Complement: P(A′) = 1 − P(A).'],
      ],
    },
  ],
};

/**
 * Reference & Comparison Tables injected into Maths lessons/notes so NotesScreen
 * displays crisp Quick Comparison Tables in both Full Notes and the 1-Min Reread Sheet.
 */
export const MATH_NERDC_EXTRA_TEACH: Record<string, Record<number, TeachBeat[]>> = {
  'm-logic': {
    0: [
      {
        k: 'teach',
        title: 'Master Truth Table for All 5 Logical Connectives',
        body: [
          [
            'tb',
            ['p', 'q', '~p', 'p ∧ q (AND)', 'p ∨ q (OR)', 'p ⇒ q (IF…THEN)', 'p ⇔ q (IFF)'],
            [
              ['T', 'T', 'F', 'T', 'T', 'T', 'T'],
              ['T', 'F', 'F', 'F', 'T', '<b>F</b>', 'F'],
              ['F', 'T', 'T', 'F', 'T', 'T', 'F'],
              ['F', 'F', 'T', 'F', '<b>F</b>', 'T', 'T'],
            ],
          ],
        ],
      },
    ],
  },
  trig: {
    0: [
      {
        k: 'teach',
        title: 'Exact Special Angles & CAST Quadrant Signs',
        body: [
          [
            'tb',
            ['Angle θ', '0°', '30°', '45°', '60°', '90°'],
            [
              ['sin θ', '0', '1/2', '√2 / 2', '√3 / 2', '1'],
              ['cos θ', '1', '√3 / 2', '√2 / 2', '1/2', '0'],
              ['tan θ', '0', '1 / √3', '1', '√3', 'Undefined'],
            ],
          ],
        ],
      },
    ],
  },
  'm-vec': {
    1: [
      {
        k: 'teach',
        title: 'Coordinate Transformation Rules Summary',
        body: [
          [
            'tb',
            ['Transformation', 'Mapping of P(x, y)', 'Preserves Size?'],
            [
              ['Reflection in x-axis', '(x, −y)', 'Yes (Isometry)'],
              ['Reflection in y-axis', '(−x, y)', 'Yes (Isometry)'],
              ['Reflection in line y = x', '(y, x)', 'Yes (Isometry)'],
              ['Rotation 90° anticlockwise about O', '(−y, x)', 'Yes (Isometry)'],
              ['Rotation 90° clockwise about O', '(y, −x)', 'Yes (Isometry)'],
              ['Rotation 180° about O', '(−x, −y)', 'Yes (Isometry)'],
              ['Enlargement factor k about O', '(kx, ky)', 'Area scales by k²'],
            ],
          ],
        ],
      },
    ],
  },
  'm-earth': {
    0: [
      {
        k: 'teach',
        title: 'Great Circles vs Small Circles on the Earth',
        body: [
          [
            'tb',
            ['Circle Type', 'Examples on Globe', 'Radius', 'Arc Distance Formula'],
            [
              ['Great Circle', 'Equator (0°) & all Meridians of Longitude', 'R (≈ 6,400 km)', '(θ / 360°) × 2πR'],
              ['Small Circle', 'Any Parallel of Latitude α° (α ≠ 0°)', 'r = R cos α', '(θ / 360°) × 2πR cos α'],
            ],
          ],
        ],
      },
    ],
  },
  diff: {
    0: [
      {
        k: 'teach',
        title: 'Standard Derivatives Reference Table',
        body: [
          [
            'tb',
            ['Function y = f(x)', 'Derivative dy/dx', 'Exam Note'],
            [
              ['k (constant)', '0', 'Horizontal line has zero gradient'],
              ['axⁿ', 'naxⁿ⁻¹', 'Multiply by power, reduce power by 1'],
              ['sin(ax)', 'a cos(ax)', 'x in radians'],
              ['cos(ax)', '−a sin(ax)', 'Watch the minus sign!'],
              ['eᵃˣ', 'a eᵃˣ', 'Exponential scales by inner derivative a'],
            ],
          ],
        ],
      },
    ],
  },
};

function prepExtraMathTopics(topics: Topic[]): Topic[] {
  return topics.map((orig) => ({
    ...orig,
    qs: orig.qs.map((q, i) => {
      if (q.gen) return q;
      const p = perm(`${orig.id}#${i}`, q.o.length);
      return {
        ...q,
        q: mfix(q.q),
        o: p.map((k) => mfix(q.o[k])),
        a: p.indexOf(q.a),
        w: q.w ? p.map((k) => mfix(q.w![k] || '')) : undefined,
        e: mfix(q.e),
      };
    }),
  }));
}

function buildLessonForExtraMathTopic(t: Topic): InteractiveLesson {
  const defList = MATH_NERDC_EXTRA_DEFS[t.id] || [];
  const teachByPart = MATH_NERDC_EXTRA_TEACH[t.id] || {};
  const parts = t.parts.map((x, pi) => {
    const X = defList[pi] || {};
    const y = x.tryit;
    const fb = y.fb ? y.fb.slice() : y.o.map(() => y.h);
    fb[y.a] = y.e;
    const why = x.ex.why;
    const extraTeaches = teachByPart[pi] || [];
    const beats: Beat[] = [
      ...extraTeaches,
      {
        k: 'idea',
        kl: extraTeaches.length ? 'DEFINITIONS AND KEY RULES' : undefined,
        idea: x.idea,
        defs: X.d,
        laws: X.l,
        g: x.g,
        cap: x.cap,
        rules: x.rules,
      },
      {
        k: 'fade',
        lv: 'full',
        q: x.ex.q,
        g: x.ex.g,
        steps: x.ex.steps.map(([m, w], j) => ({
          m,
          why: w,
          ex: why && why[0] === j ? { q: why[1], o: why[2], fb: why[3], a: 0 } : undefined,
        })),
      },
      {
        k: 'check',
        q: y.q,
        g: y.g,
        given: y.given,
        ask: y.ask,
        o: y.o,
        a: y.a,
        fb,
        h: [y.h],
      },
    ];
    return { title: x.title, beats };
  });

  if (t.spot) {
    const targetIdx = Math.min(t.spot.part, parts.length - 1);
    parts[targetIdx].beats.push({ k: 'spot', ...t.spot });
  }

  const last = parts[parts.length - 1];
  const bonusQ = t.qs.find((z) => z.l === 2 && z.w);
  if (bonusQ) {
    last.beats.push({
      k: 'check',
      title: 'One more, on your own',
      q: bonusQ.q,
      g: bonusQ.g,
      o: bonusQ.o,
      a: bonusQ.a,
      fb: bonusQ.w!.map((w, k) => (k === bonusQ.a ? bonusQ.e : w)),
      h: [t.parts[t.parts.length - 1].rules[0] || 'Apply the key formula step by step.'],
    });
  }

  return { parts };
}

/**
 * Merges the 24 existing JAMB Maths topics + 8 new NERDC SS1–SS3 Maths topics (= 32 total),
 * orders them cleanly by SS1 → SS2 → SS3 Term 1 → 3, and enriches all 32 interactive lessons
 * with formal Definitions, Theorems/Laws, and Comparison Tables for Study Notes & Lesson steps.
 */
export function enrichMathCurriculum(
  baseTopics: Topic[],
  baseIL: Record<string, InteractiveLesson>
): { topics: Topic[]; il: Record<string, InteractiveLesson> } {
  const preppedExtras = prepExtraMathTopics(MATH_NERDC_EXTRA_TOPICS);
  const classRank: Record<string, number> = { ss1: 1, ss2: 2, ss3: 3 };

  const allTopics = [...baseTopics, ...preppedExtras].sort((a, b) => {
    const na = MATH_NERDC_MAP[a.id];
    const nb = MATH_NERDC_MAP[b.id];
    if (na && nb) {
      const cDiff = (classRank[na.classId] || 9) - (classRank[nb.classId] || 9);
      if (cDiff !== 0) return cDiff;
      return na.order - nb.order;
    }
    return 0;
  });

  const il: Record<string, InteractiveLesson> = {};

  for (const t of allTopics) {
    const existing = baseIL[t.id];
    if (!existing) {
      il[t.id] = buildLessonForExtraMathTopic(t);
      continue;
    }

    const defEntries = MATH_NERDC_EXTRA_DEFS[t.id] || [];
    const teachEntries = MATH_NERDC_EXTRA_TEACH[t.id] || {};

    il[t.id] = {
      ...existing,
      parts: existing.parts.map((part, pi) => {
        const extraDef = defEntries[pi];
        const extraTeaches = teachEntries[pi] || [];
        let beats = [...extraTeaches, ...part.beats];

        if (extraDef && (extraDef.d?.length || extraDef.l?.length)) {
          const ideaIdx = beats.findIndex((b) => b.k === 'idea');
          if (ideaIdx >= 0) {
            const origIdea = beats[ideaIdx] as IdeaBeat;
            beats[ideaIdx] = {
              ...origIdea,
              defs: [...(origIdea.defs || []), ...(extraDef.d || [])],
              laws: [...(origIdea.laws || []), ...(extraDef.l || [])],
            };
          } else {
            // For simulation-first lessons (quad, geom, prob), append an idea beat so NotesScreen & LessonScreen have formal theorems
            beats = [
              ...beats,
              {
                k: 'idea',
                title: `${part.title} — Formal Definitions & Theorems`,
                defs: extraDef.d,
                laws: extraDef.l,
              },
            ];
          }
        }

        return {
          ...part,
          beats,
        };
      }),
    };
  }

  return { topics: allTopics, il };
}
