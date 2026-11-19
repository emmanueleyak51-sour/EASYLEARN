import type { FormulaRearrangement } from './chemFormulas';

export type MathFormulaCatId =
  | 'number'
  | 'algebra'
  | 'mensuration'
  | 'trig'
  | 'coord'
  | 'calcstats';

export interface MathFormulaCategory {
  id: MathFormulaCatId | 'all';
  label: string;
  shortLabel: string;
  desc: string;
}

export interface MathFormulaItem {
  id: string;
  cat: MathFormulaCatId;
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

export const MATH_FORMULA_CATEGORIES: MathFormulaCategory[] = [
  {
    id: 'all',
    label: 'All Mathematics Formulas',
    shortLabel: 'All',
    desc: 'Every calculation equation, algebraic rule, mensuration solid, trig identity, vector relation & calculus law',
  },
  {
    id: 'number',
    label: 'Number, Indices, Logs & Finance',
    shortLabel: 'Number & Finance',
    desc: 'Percentage error, laws of indices, logarithm rules, simple interest & compound growth/depreciation',
  },
  {
    id: 'algebra',
    label: 'Algebra, Sequences, Sets & Matrices',
    shortLabel: 'Algebra & Matrices',
    desc: 'Quadratics, root relations, AP & GP sums, 2×2 matrix inverse & Venn set inclusion–exclusion',
  },
  {
    id: 'mensuration',
    label: 'Polygons, Mensuration & Earth',
    shortLabel: 'Mensuration & Earth',
    desc: 'Polygon angles, sectors, cylinders, cones, spheres & longitude/latitude great-circle distances',
  },
  {
    id: 'trig',
    label: 'Trigonometry & Bearings',
    shortLabel: 'Trig & Bearings',
    desc: 'Pythagoras, SOH-CAH-TOA, Sine Rule, Cosine Rule, triangle area ½ab sin C & back bearings',
  },
  {
    id: 'coord',
    label: 'Coordinate Geometry, Vectors & Similarity',
    shortLabel: 'Coord & Vectors',
    desc: 'Gradient, midpoint, perpendicular lines, 2D vector modulus/dot product & k²/k³ scale factors',
  },
  {
    id: 'calcstats',
    label: 'Calculus, Statistics & Probability',
    shortLabel: 'Calculus & Stats',
    desc: 'Power-rule differentiation, definite integration, variance/standard deviation, ⁿPᵣ, ⁿCᵣ & probability',
  },
];

export const MATH_FORMULAS: MathFormulaItem[] = [
  /* ─────────────── 1. NUMBER, INDICES, LOGS & FINANCE (5) ─────────────── */
  {
    id: 'mf-pct-error',
    cat: 'number',
    name: 'Percentage Error & Percentage Profit / Loss',
    topicId: 'frac',
    summary: 'Measures relative accuracy of a measurement or percentage gain/loss on cost price.',
    rearrangements: [
      {
        solveFor: '%Error',
        label: 'Percentage Error',
        exprHtml: '% Error = (|Measured − Actual| ÷ Actual) × 100%',
      },
      {
        solveFor: '%Profit',
        label: 'Percentage Profit / Loss',
        exprHtml: '% Profit = ((SP − CP) ÷ CP) × 100%',
      },
      {
        solveFor: 'SP',
        label: 'Solve for Selling Price (SP)',
        exprHtml: 'SP = CP × (100 ± r) ÷ 100',
        note: 'Use +r for profit and −r for loss',
      },
    ],
    variables: [
      ['Actual', 'True / exact value (always the denominator!)'],
      ['Measured', 'Recorded / approximate reading'],
      ['CP, SP', 'Cost Price and Selling Price (₦)'],
    ],
    trap: 'Never divide by the measured value or selling price — the denominator is ALWAYS the true Actual value or original Cost Price!',
    worked: {
      qHtml: 'A stick of actual length 25 cm is measured as 24 cm. Find the percentage error.',
      stepsHtml: [
        'Absolute error = |24 − 25| = 1 cm',
        '% Error = (1 ÷ 25) × 100% = 4%',
      ],
      ansHtml: '4%',
    },
    keywords: ['percentage error', 'profit', 'loss', 'cost price', 'selling price', 'approximation'],
  },
  {
    id: 'mf-indices',
    cat: 'number',
    name: 'Laws of Indices & Fractional Exponents',
    topicId: 'indices',
    summary: 'Combines powers of a common base and evaluates negative or fractional indices cleanly.',
    rearrangements: [
      {
        solveFor: 'frac',
        label: 'Fractional & Negative Index',
        exprHtml: 'a<sup>m/n</sup> = (<sup>n</sup>√a)<sup>m</sup>  ·  a<sup>−n</sup> = 1 ÷ a<sup>n</sup>',
      },
      {
        solveFor: 'prod',
        label: 'Product & Quotient Laws',
        exprHtml: 'a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup>  ·  a<sup>m</sup> ÷ a<sup>n</sup> = a<sup>m−n</sup>',
      },
      {
        solveFor: 'pow',
        label: 'Power & Zero Laws',
        exprHtml: '(a<sup>m</sup>)<sup>n</sup> = a<sup>mn</sup>  ·  a<sup>0</sup> = 1 (a ≠ 0)',
      },
    ],
    variables: [
      ['a', 'Positive base (a > 0)'],
      ['m', 'Power / numerator of exponent'],
      ['n', 'Root index / denominator of exponent'],
    ],
    trap: 'Take the n-th root FIRST before raising to power m (e.g. 27^(2/3) = (³√27)² = 3² = 9), and remember a negative index flips the base — it does NOT make the answer negative!',
    worked: {
      qHtml: 'Evaluate 81<sup>−3/4</sup> as a simplified fraction.',
      stepsHtml: [
        '81<sup>−3/4</sup> = 1 ÷ (<sup>4</sup>√81)<sup>3</sup>',
        '<sup>4</sup>√81 = 3, so 3<sup>3</sup> = 27 → 1/27',
      ],
      ansHtml: '1/27',
    },
    keywords: ['indices', 'exponents', 'powers', 'roots', 'negative index', 'fractional index'],
  },
  {
    id: 'mf-logs',
    cat: 'number',
    name: 'Logarithm Laws & Index–Log Equivalence',
    topicId: 'indices',
    summary: 'Converts exponential equations to logarithms and simplifies products, quotients, and powers.',
    rearrangements: [
      {
        solveFor: 'bridge',
        label: 'Index–Log Bridge',
        exprHtml: 'log<sub>a</sub> N = x  ⇔  a<sup>x</sup> = N',
      },
      {
        solveFor: 'laws',
        label: 'Product, Quotient & Power',
        exprHtml: 'log<sub>a</sub>(XY) = log<sub>a</sub> X + log<sub>a</sub> Y  ·  log<sub>a</sub>(X<sup>k</sup>) = k log<sub>a</sub> X',
      },
      {
        solveFor: 'base',
        label: 'Change of Base',
        exprHtml: 'log<sub>a</sub> b = log<sub>c</sub> b ÷ log<sub>c</sub> a',
      },
    ],
    variables: [
      ['a', 'Logarithm base (a > 0, a ≠ 1)'],
      ['N', 'Argument (must satisfy N > 0)'],
      ['x', 'Exponent / logarithm value'],
    ],
    constants: ['logₐ a = 1', 'logₐ 1 = 0'],
    trap: 'log(X + Y) is NOT log X + log Y! Only a product inside a single log splits into a sum of logs.',
    worked: {
      qHtml: 'Evaluate log<sub>2</sub> 24 − log<sub>2</sub> 3.',
      stepsHtml: [
        'log<sub>2</sub> 24 − log<sub>2</sub> 3 = log<sub>2</sub>(24 ÷ 3) = log<sub>2</sub> 8',
        'Since 2<sup>3</sup> = 8, log<sub>2</sub> 8 = 3',
      ],
      ansHtml: '3',
    },
    keywords: ['logarithm', 'log', 'change of base', 'antilog'],
  },
  {
    id: 'mf-simple-int',
    cat: 'number',
    name: 'Simple Interest & Total Amount',
    topicId: 'm-fin',
    summary: 'Calculates interest earned or charged solely on the original principal across T years.',
    rearrangements: [
      { solveFor: 'I', label: 'Solve for Interest (I)', exprHtml: 'I = (P × R × T) ÷ 100' },
      { solveFor: 'P', label: 'Solve for Principal (P)', exprHtml: 'P = (100 × I) ÷ (R × T)' },
      { solveFor: 'T', label: 'Solve for Time (T)', exprHtml: 'T = (100 × I) ÷ (P × R)' },
      { solveFor: 'A', label: 'Total Amount (A)', exprHtml: 'A = P + I = P(1 + RT ÷ 100)' },
    ],
    variables: [
      ['I', 'Simple interest earned or paid (₦)'],
      ['P', 'Principal sum invested or borrowed (₦)'],
      ['R', 'Annual interest rate (% per annum)'],
      ['T', 'Time period in years (convert months ÷ 12!)'],
    ],
    trap: 'If time is given in months (e.g. 9 months) while R is % per annum, convert T = 9/12 years before substituting!',
    worked: {
      qHtml: 'Find the simple interest on ₦60,000 for 2½ years at 8% per annum.',
      stepsHtml: [
        'I = (60,000 × 8 × 2.5) ÷ 100',
        'I = 600 × 20 = ₦12,000',
      ],
      ansHtml: '₦12,000',
    },
    keywords: ['simple interest', 'principal', 'rate', 'amount', 'commercial'],
  },
  {
    id: 'mf-compound-int',
    cat: 'number',
    name: 'Compound Interest & Reducing-Balance Depreciation',
    topicId: 'm-fin',
    summary: 'Models exponential growth of investments or percentage depreciation of assets over n periods.',
    rearrangements: [
      {
        solveFor: 'A',
        label: 'Compound Amount (A)',
        exprHtml: 'A = P(1 + R ÷ 100)<sup>n</sup>',
      },
      {
        solveFor: 'CI',
        label: 'Compound Interest Only (CI)',
        exprHtml: 'CI = P[(1 + R ÷ 100)<sup>n</sup> − 1]',
      },
      {
        solveFor: 'V',
        label: 'Depreciated Value (V)',
        exprHtml: 'V = P(1 − R ÷ 100)<sup>n</sup>',
      },
    ],
    variables: [
      ['P', 'Initial principal or asset cost (₦)'],
      ['R', 'Rate per compounding period (%)'],
      ['n', 'Number of compounding periods'],
      ['A, V', 'Final compound amount or book value (₦)'],
    ],
    trap: 'A = P(1 + R/100)ⁿ gives the TOTAL AMOUNT. Subtract P at the end if the question asks for the Compound Interest only!',
    worked: {
      qHtml: 'Find the compound interest on ₦50,000 for 2 years at 10% per annum.',
      stepsHtml: [
        'A = 50,000 × (1.10)<sup>2</sup> = 50,000 × 1.21 = ₦60,500',
        'CI = A − P = 60,500 − 50,000 = ₦10,500',
      ],
      ansHtml: '₦10,500',
    },
    keywords: ['compound interest', 'depreciation', 'growth', 'annuity', 'finance'],
  },

  /* ─────────────── 2. ALGEBRA, SEQUENCES, SETS & MATRICES (7) ─────────────── */
  {
    id: 'mf-quad-formula',
    cat: 'algebra',
    name: 'Quadratic Formula & Discriminant',
    topicId: 'quad',
    summary: 'Solves any quadratic equation ax² + bx + c = 0 (a ≠ 0) and classifies its roots.',
    rearrangements: [
      {
        solveFor: 'x',
        label: 'Quadratic Formula (x)',
        exprHtml: 'x = (−b ± √(b<sup>2</sup> − 4ac)) ÷ (2a)',
      },
      {
        solveFor: 'disc',
        label: 'Discriminant (Δ)',
        exprHtml: 'Δ = b<sup>2</sup> − 4ac',
        note: 'Δ > 0: 2 real · Δ = 0: equal roots · Δ < 0: no real roots',
      },
      {
        solveFor: 'vx',
        label: 'Axis of Symmetry / Vertex x',
        exprHtml: 'x<sub>vertex</sub> = −b ÷ (2a)',
      },
    ],
    variables: [
      ['a', 'Coefficient of x² (a ≠ 0)'],
      ['b', 'Coefficient of x (keep its sign!)'],
      ['c', 'Constant term when rearranged to = 0'],
    ],
    trap: 'Rearrange to standard form ax² + bx + c = 0 FIRST, and divide the ENTIRE numerator (−b ± √Δ) by 2a!',
    worked: {
      qHtml: 'Find the positive value of k for which x² − kx + 9 = 0 has equal roots.',
      stepsHtml: [
        'For equal roots, Δ = b² − 4ac = 0',
        '(−k)² − 4(1)(9) = 0 → k² = 36 → k = 6',
      ],
      ansHtml: 'k = 6',
    },
    keywords: ['quadratic', 'almighty formula', 'discriminant', 'equal roots', 'vertex'],
  },
  {
    id: 'mf-quad-roots',
    cat: 'algebra',
    name: 'Sum & Product of Quadratic Roots (α and β)',
    topicId: 'quad',
    summary: 'Links roots α, β directly to coefficients and reconstructs new quadratic equations.',
    rearrangements: [
      {
        solveFor: 'sumprod',
        label: 'Sum & Product of Roots',
        exprHtml: 'α + β = −b ÷ a  ·  αβ = c ÷ a',
      },
      {
        solveFor: 'build',
        label: 'Form Equation from Roots',
        exprHtml: 'x<sup>2</sup> − (α + β)x + αβ = 0',
      },
      {
        solveFor: 'sq',
        label: 'Symmetric Identity α² + β²',
        exprHtml: 'α<sup>2</sup> + β<sup>2</sup> = (α + β)<sup>2</sup> − 2αβ',
      },
    ],
    variables: [
      ['α, β', 'The two roots of ax² + bx + c = 0'],
      ['−b/a', 'Sum of roots (watch the minus sign!)'],
      ['c/a', 'Product of roots'],
    ],
    trap: 'The middle sign in x² − (sum)x + (product) = 0 is MINUS, and α + β = −b/a (not +b/a)!',
    worked: {
      qHtml: 'If α and β are the roots of 2x² − 6x + 5 = 0, find α + β and αβ.',
      stepsHtml: [
        'α + β = −(−6) ÷ 2 = 3',
        'αβ = 5 ÷ 2 = 2.5',
      ],
      ansHtml: 'α + β = 3, αβ = 5/2',
    },
    keywords: ['sum of roots', 'product of roots', 'alpha', 'beta', 'symmetric'],
  },
  {
    id: 'mf-ap-nth',
    cat: 'algebra',
    name: 'Arithmetic Progression (AP) nth Term',
    topicId: 'prog',
    summary: 'Finds any term Tₙ or number of terms n in a linear sequence with constant difference d.',
    rearrangements: [
      { solveFor: 'Tn', label: 'nth Term (Tₙ)', exprHtml: 'T<sub>n</sub> = a + (n − 1)d' },
      { solveFor: 'd', label: 'Solve for Common Difference (d)', exprHtml: 'd = (T<sub>n</sub> − a) ÷ (n − 1)' },
      { solveFor: 'n', label: 'Solve for Number of Terms (n)', exprHtml: 'n = ((T<sub>n</sub> − a) ÷ d) + 1' },
    ],
    variables: [
      ['a', 'First term T₁'],
      ['d', 'Common difference (T₂ − T₁ = T₃ − T₂)'],
      ['n', 'Term position (positive integer)'],
    ],
    trap: 'The multiplier of d is (n − 1), NOT n — the 10th term is a + 9d, not a + 10d!',
    worked: {
      qHtml: 'Find the 15th term of the AP: 4, 9, 14, 19, …',
      stepsHtml: [
        'a = 4, d = 9 − 4 = 5, n = 15',
        'T₁₅ = 4 + (15 − 1)(5) = 4 + 70 = 74',
      ],
      ansHtml: '74',
    },
    keywords: ['arithmetic progression', 'AP', 'nth term', 'common difference', 'sequence'],
  },
  {
    id: 'mf-ap-sum',
    cat: 'algebra',
    name: 'Sum of n Terms of an Arithmetic Progression',
    topicId: 'prog',
    summary: 'Sums the first n terms of an AP using either first/last terms or first term and difference.',
    rearrangements: [
      {
        solveFor: 'Sn',
        label: 'General AP Sum (Sₙ)',
        exprHtml: 'S<sub>n</sub> = (n ÷ 2)[2a + (n − 1)d]',
      },
      {
        solveFor: 'last',
        label: 'Given First & Last Term (l)',
        exprHtml: 'S<sub>n</sub> = (n ÷ 2)(a + l)',
      },
      {
        solveFor: 'am',
        label: 'Arithmetic Mean of x and y',
        exprHtml: 'AM = (x + y) ÷ 2',
      },
    ],
    variables: [
      ['Sₙ', 'Sum of the first n terms'],
      ['a, l', 'First term and n-th (last) term'],
      ['d', 'Common difference'],
    ],
    trap: 'Inside the bracket is 2a + (n − 1)d — forgetting the 2 in front of a is the #1 exam error!',
    worked: {
      qHtml: 'Find the sum of the first 10 terms of the AP: 3, 7, 11, …',
      stepsHtml: [
        'a = 3, d = 4, n = 10',
        'S₁₀ = (10 ÷ 2)[2(3) + 9(4)] = 5 × (6 + 36) = 210',
      ],
      ansHtml: '210',
    },
    keywords: ['sum of AP', 'series', 'arithmetic mean'],
  },
  {
    id: 'mf-gp-sum',
    cat: 'algebra',
    name: 'Geometric Progression (GP) nth Term & Sum to Infinity',
    topicId: 'prog',
    summary: 'Models constant-ratio sequences and convergent infinite geometric series (|r| < 1).',
    rearrangements: [
      { solveFor: 'Tn', label: 'GP nth Term (Tₙ)', exprHtml: 'T<sub>n</sub> = ar<sup>n−1</sup>' },
      {
        solveFor: 'Sinf',
        label: 'Sum to Infinity (|r| < 1)',
        exprHtml: 'S<sub>∞</sub> = a ÷ (1 − r)',
      },
      {
        solveFor: 'Sn',
        label: 'Finite Sum of n Terms',
        exprHtml: 'S<sub>n</sub> = a(r<sup>n</sup> − 1) ÷ (r − 1)   (r ≠ 1)',
      },
    ],
    variables: [
      ['a', 'First term T₁'],
      ['r', 'Common ratio (T₂ ÷ T₁)'],
      ['n', 'Term number'],
    ],
    trap: 'Sum to infinity S∞ = a/(1 − r) ONLY converges when −1 < r < 1 (i.e. |r| < 1)!',
    worked: {
      qHtml: 'Find the sum to infinity of the GP: 12, 6, 3, 1.5, …',
      stepsHtml: [
        'a = 12, r = 6 ÷ 12 = 0.5 (|r| < 1)',
        'S<sub>∞</sub> = 12 ÷ (1 − 0.5) = 12 ÷ 0.5 = 24',
      ],
      ansHtml: '24',
    },
    keywords: ['geometric progression', 'GP', 'common ratio', 'sum to infinity'],
  },
  {
    id: 'mf-matrix-det',
    cat: 'algebra',
    name: '2×2 Matrix Determinant & Inverse',
    topicId: 'matrix',
    summary: 'Computes the determinant |A| = ad − bc, tests singularity, and finds the matrix inverse A⁻¹.',
    rearrangements: [
      {
        solveFor: 'det',
        label: 'Determinant of 2×2 Matrix',
        exprHtml: '|A| = ad − bc   for A = [a  b; c  d]',
      },
      {
        solveFor: 'inv',
        label: 'Inverse Matrix (A⁻¹)',
        exprHtml: 'A<sup>−1</sup> = (1 ÷ (ad − bc)) · [d  −b; −c  a]',
      },
      {
        solveFor: 'sing',
        label: 'Singular Matrix Condition',
        exprHtml: 'ad − bc = 0   (no inverse exists)',
      },
    ],
    variables: [
      ['a, d', 'Leading (principal) diagonal entries — SWAP for adjoint'],
      ['b, c', 'Secondary diagonal entries — NEGATE for adjoint'],
      ['|A|', 'Determinant ad − bc'],
    ],
    trap: 'In |A| = ad − bc, subtract bc (do not add!), and remember matrix multiplication is NOT commutative (AB ≠ BA).',
    worked: {
      qHtml: 'Find the determinant of P = [5  2; 3  4].',
      stepsHtml: [
        '|P| = (5 × 4) − (2 × 3)',
        '|P| = 20 − 6 = 14',
      ],
      ansHtml: '14',
    },
    keywords: ['matrix', 'determinant', 'inverse', 'singular', 'adjoint'],
  },
  {
    id: 'mf-sets-union',
    cat: 'algebra',
    name: 'Two-Set Inclusion–Exclusion & Power Set',
    topicId: 'sets',
    summary: 'Counts union, intersection, and complement cardinalities without double-counting.',
    rearrangements: [
      {
        solveFor: 'union',
        label: 'Union Cardinality n(A ∪ B)',
        exprHtml: 'n(A ∪ B) = n(A) + n(B) − n(A ∩ B)',
      },
      {
        solveFor: 'inter',
        label: 'Solve for Intersection n(A ∩ B)',
        exprHtml: 'n(A ∩ B) = n(A) + n(B) − n(A ∪ B)',
      },
      {
        solveFor: 'univ',
        label: 'With Complement Outside Both',
        exprHtml: 'n(ξ) = n(A ∪ B) + n(A ∪ B)′  ·  Subsets = 2<sup>k</sup>',
      },
    ],
    variables: [
      ['n(ξ)', 'Total elements in the universal set'],
      ['n(A ∩ B)', 'Elements in BOTH A and B'],
      ['n(A ∪ B)′', 'Elements in NEITHER A nor B'],
    ],
    trap: 'Always subtract n(A ∪ B)′ ("neither") from n(ξ) first to get n(A ∪ B) before solving for the intersection!',
    worked: {
      qHtml: 'In a class of 40 students, 26 offer Maths, 22 offer Chemistry, and 5 offer neither. How many offer both?',
      stepsHtml: [
        'n(M ∪ C) = 40 − 5 = 35',
        'n(M ∩ C) = 26 + 22 − 35 = 13',
      ],
      ansHtml: '13 students',
    },
    keywords: ['sets', 'venn diagram', 'union', 'intersection', 'subsets'],
  },

  /* ─────────────── 3. POLYGONS, MENSURATION & EARTH (6) ─────────────── */
  {
    id: 'mf-poly-angles',
    cat: 'mensuration',
    name: 'Interior & Exterior Angles of a Convex Polygon',
    topicId: 'm-proof',
    summary: 'Relates the number of sides n of a polygon to its interior sum and exterior angle.',
    rearrangements: [
      {
        solveFor: 'sum',
        label: 'Sum of Interior Angles',
        exprHtml: 'S = (n − 2) × 180°',
      },
      {
        solveFor: 'ext',
        label: 'Each Exterior Angle (Regular)',
        exprHtml: 'e = 360° ÷ n  ·  Interior i = 180° − e',
      },
      {
        solveFor: 'n',
        label: 'Number of Sides from Exterior Angle',
        exprHtml: 'n = 360° ÷ (180° − i)',
      },
    ],
    variables: [
      ['n', 'Number of sides / vertices (n ≥ 3)'],
      ['i', 'Each interior angle of a regular n-gon'],
      ['e', 'Each exterior angle (sum of exterior angles = 360° always)'],
    ],
    trap: 'Finding n from an interior angle i is fastest via exterior angle: e = 180° − i, then n = 360° ÷ e!',
    worked: {
      qHtml: 'Each interior angle of a regular polygon is 150°. How many sides has the polygon?',
      stepsHtml: [
        'Each exterior angle e = 180° − 150° = 30°',
        'Number of sides n = 360° ÷ 30° = 12 sides',
      ],
      ansHtml: '12 sides',
    },
    keywords: ['polygon', 'interior angle', 'exterior angle', 'regular polygon', 'geometry'],
  },
  {
    id: 'mf-sector',
    cat: 'mensuration',
    name: 'Arc Length, Area & Perimeter of a Sector',
    topicId: 'mens',
    summary: 'Takes the fraction θ/360° of a full circle’s circumference 2πr or area πr².',
    rearrangements: [
      {
        solveFor: 'arc',
        label: 'Arc Length (L)',
        exprHtml: 'L = (θ ÷ 360°) × 2πr',
      },
      {
        solveFor: 'area',
        label: 'Area of Sector (A)',
        exprHtml: 'A = (θ ÷ 360°) × πr<sup>2</sup>',
      },
      {
        solveFor: 'perim',
        label: 'Perimeter of Sector (P)',
        exprHtml: 'P = L + 2r = (θ ÷ 360°)2πr + 2r',
      },
    ],
    variables: [
      ['θ', 'Angle subtended at the centre (°)'],
      ['r', 'Radius of the circle (cm or m)'],
      ['L', 'Curved arc length'],
    ],
    constants: ['π ≈ 22/7 or 3.142'],
    trap: 'Perimeter of a sector is NOT just the curved arc length L — you MUST add the two straight radii (+ 2r)!',
    worked: {
      qHtml: 'Find the area of a sector of radius 14 cm subtending an angle of 90° [π = 22/7].',
      stepsHtml: [
        'A = (90 ÷ 360) × (22 ÷ 7) × 14 × 14',
        'A = ¼ × 616 = 154 cm²',
      ],
      ansHtml: '154 cm²',
    },
    keywords: ['sector', 'arc length', 'perimeter of sector', 'circle', 'mensuration'],
  },
  {
    id: 'mf-cylinder',
    cat: 'mensuration',
    name: 'Cylinder Volume, Curved & Total Surface Area',
    topicId: 'mens',
    summary: 'Calculates capacity and sheet area of open or closed circular cylinders.',
    rearrangements: [
      { solveFor: 'V', label: 'Volume of Cylinder (V)', exprHtml: 'V = πr<sup>2</sup>h' },
      { solveFor: 'CSA', label: 'Curved Surface Area (CSA)', exprHtml: 'CSA = 2πrh' },
      {
        solveFor: 'TSA',
        label: 'Closed Total Surface Area (TSA)',
        exprHtml: 'TSA = 2πrh + 2πr<sup>2</sup> = 2πr(h + r)',
        note: 'Open-top cylinder has only ONE base: A = 2πrh + πr²',
      },
    ],
    variables: [
      ['r', 'Base radius (divide diameter by 2!)'],
      ['h', 'Perpendicular height / length'],
      ['V', 'Volume (cm³ or m³; 1000 cm³ = 1 litre)'],
    ],
    trap: 'Check whether the cylinder is closed at both ends (+2πr²), open at one end (+πr²), or a hollow pipe (2πrh only)!',
    worked: {
      qHtml: 'Find the volume of a cylinder of radius 7 cm and height 10 cm [π = 22/7].',
      stepsHtml: [
        'V = (22 ÷ 7) × 7² × 10 = 22 × 7 × 10',
        'V = 1,540 cm³',
      ],
      ansHtml: '1,540 cm³',
    },
    keywords: ['cylinder', 'volume', 'curved surface area', 'total surface area'],
  },
  {
    id: 'mf-cone',
    cat: 'mensuration',
    name: 'Cone Slant Height, Surface Area & Volume',
    topicId: 'mens',
    summary: 'Connects perpendicular height h, base radius r, and slant height l of a right circular cone.',
    rearrangements: [
      { solveFor: 'V', label: 'Volume of Cone (V)', exprHtml: 'V = ⅓πr<sup>2</sup>h' },
      { solveFor: 'CSA', label: 'Curved Surface Area (CSA)', exprHtml: 'CSA = πrl   (where l = √(r<sup>2</sup> + h<sup>2</sup>))' },
      { solveFor: 'TSA', label: 'Closed Total Surface Area', exprHtml: 'TSA = πrl + πr<sup>2</sup> = πr(l + r)' },
    ],
    variables: [
      ['r', 'Base radius'],
      ['h', 'Vertical / perpendicular height (used in Volume)'],
      ['l', 'Slant height √(r² + h²) (used in Curved Area)'],
    ],
    trap: 'Never mix up slant height l and vertical height h: CSA = πrl uses l, whereas Volume = ⅓πr²h uses h!',
    worked: {
      qHtml: 'A cone has base radius 6 cm and vertical height 8 cm. Find its curved surface area in terms of π.',
      stepsHtml: [
        'Slant height l = √(6² + 8²) = √(36 + 64) = 10 cm',
        'CSA = πrl = π × 6 × 10 = 60π cm²',
      ],
      ansHtml: '60π cm²',
    },
    keywords: ['cone', 'slant height', 'curved surface area', 'pyramid', 'volume'],
  },
  {
    id: 'mf-sphere',
    cat: 'mensuration',
    name: 'Sphere & Hemisphere Surface Area and Volume',
    topicId: 'mens',
    summary: 'Gives exact surface area and volume for spheres and solid hemispheres.',
    rearrangements: [
      { solveFor: 'V', label: 'Volume of Sphere (V)', exprHtml: 'V = (4 ÷ 3)πr<sup>3</sup>' },
      { solveFor: 'A', label: 'Surface Area of Sphere (A)', exprHtml: 'A = 4πr<sup>2</sup>' },
      {
        solveFor: 'hemi',
        label: 'Solid Hemisphere TSA & Volume',
        exprHtml: 'V<sub>hemi</sub> = (2 ÷ 3)πr<sup>3</sup>  ·  TSA<sub>hemi</sub> = 3πr<sup>2</sup>',
      },
    ],
    variables: [
      ['r', 'Radius of sphere or hemisphere'],
      ['3πr²', 'Curved dome 2πr² + flat circular base πr² of solid hemisphere'],
    ],
    trap: 'Total surface area of a SOLID hemisphere is 3πr² (2πr² curved + πr² flat base), not 2πr²!',
    worked: {
      qHtml: 'Find the surface area of a sphere of radius 7 cm [π = 22/7].',
      stepsHtml: [
        'A = 4 × (22 ÷ 7) × 7 × 7',
        'A = 4 × 154 = 616 cm²',
      ],
      ansHtml: '616 cm²',
    },
    keywords: ['sphere', 'hemisphere', 'surface area', 'volume'],
  },
  {
    id: 'mf-earth-dist',
    cat: 'mensuration',
    name: 'Earth Longitude & Latitude Distances',
    topicId: 'm-earth',
    summary: 'Computes arc distances along meridians/Equator (R) and parallels of latitude (r = R cos α).',
    rearrangements: [
      {
        solveFor: 'gc',
        label: 'Along Meridian / Equator (Great Circle)',
        exprHtml: 'D = (θ ÷ 360°) × 2πR',
      },
      {
        solveFor: 'lat',
        label: 'Along Parallel of Latitude α°',
        exprHtml: 'd = (θ ÷ 360°) × 2πR cos α',
      },
      {
        solveFor: 'r',
        label: 'Radius of Parallel of Latitude',
        exprHtml: 'r = R cos α',
      },
    ],
    variables: [
      ['θ', 'Angular difference (subtract if same N/N or E/E; add if opposite N/S or E/W)'],
      ['α', 'Common latitude angle (° N or ° S)'],
      ['R', 'Radius of the Earth ≈ 6,400 km'],
    ],
    constants: ['R ≈ 6,400 km', '15° longitude = 1 hour time difference'],
    trap: 'Multiply by cos α ONLY when travelling East–West along a parallel of latitude; NEVER use cos α along a meridian!',
    worked: {
      qHtml: 'Find the radius of the parallel of latitude 60°N, taking R = 6,400 km.',
      stepsHtml: [
        'r = R cos 60° = 6,400 × 0.5',
        'r = 3,200 km',
      ],
      ansHtml: '3,200 km',
    },
    keywords: ['longitude', 'latitude', 'great circle', 'earth', 'meridian', 'equator'],
  },

  /* ─────────────── 4. TRIGONOMETRY & BEARINGS (4) ─────────────── */
  {
    id: 'mf-pythag-trig',
    cat: 'trig',
    name: 'Pythagoras Theorem, SOH-CAH-TOA & Trig Identity',
    topicId: 'trig',
    summary: 'Solves right-angled triangles and links sin θ, cos θ, and tan θ across all quadrants.',
    rearrangements: [
      {
        solveFor: 'pyth',
        label: 'Pythagoras & Fundamental Identity',
        exprHtml: 'c<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup>  ·  sin<sup>2</sup>θ + cos<sup>2</sup>θ = 1',
      },
      {
        solveFor: 'soh',
        label: 'Right-Triangle Ratios',
        exprHtml: 'sin θ = Opp ÷ Hyp  ·  cos θ = Adj ÷ Hyp  ·  tan θ = sin θ ÷ cos θ',
      },
      {
        solveFor: 'comp',
        label: 'Complementary Angle Rule',
        exprHtml: 'sin θ = cos(90° − θ)',
      },
    ],
    variables: [
      ['c (Hyp)', 'Hypotenuse opposite the 90° angle'],
      ['Opp, Adj', 'Sides opposite and adjacent to angle θ'],
      ['θ', 'Acute or general quadrant angle'],
    ],
    constants: ['sin 30° = ½', 'cos 60° = ½', 'tan 45° = 1'],
    trap: 'In sin θ = cos(90° − θ), the two acute angles always sum to 90° — e.g. if sin(2x) = cos(40°), then 2x + 40° = 90°!',
    worked: {
      qHtml: 'Given sin θ = 3/5 for acute θ, find cos θ and tan θ.',
      stepsHtml: [
        'Adjacent = √(5² − 3²) = √16 = 4',
        'cos θ = 4/5 and tan θ = 3/4',
      ],
      ansHtml: 'cos θ = 4/5, tan θ = 3/4',
    },
    keywords: ['pythagoras', 'sohcahtoa', 'sine', 'cosine', 'tangent', 'identity'],
  },
  {
    id: 'mf-sine-rule',
    cat: 'trig',
    name: 'The Sine Rule (Any Triangle ABC)',
    topicId: 'm-bearing',
    summary: 'Finds unknown sides or angles when given an opposite side–angle pair in any triangle.',
    rearrangements: [
      {
        solveFor: 'side',
        label: 'Solve for Missing Side',
        exprHtml: 'a ÷ sin A = b ÷ sin B = c ÷ sin C',
      },
      {
        solveFor: 'ang',
        label: 'Solve for Missing Angle',
        exprHtml: 'sin A ÷ a = sin B ÷ b = sin C ÷ c',
      },
    ],
    variables: [
      ['a, b, c', 'Sides opposite angles A, B, C respectively'],
      ['A, B, C', 'Interior angles summing to 180°'],
    ],
    trap: 'Each side MUST pair with the sine of its strictly OPPOSITE angle (side a opposite angle A)!',
    worked: {
      qHtml: 'In △ABC, A = 30°, B = 45°, and a = 8 cm. Find side b in surd form.',
      stepsHtml: [
        'b ÷ sin 45° = 8 ÷ sin 30° → b ÷ (√2/2) = 8 ÷ (1/2) = 16',
        'b = 16 × (√2 ÷ 2) = 8√2 cm',
      ],
      ansHtml: '8√2 cm',
    },
    keywords: ['sine rule', 'triangle', 'bearings', 'trigonometry'],
  },
  {
    id: 'mf-cosine-rule',
    cat: 'trig',
    name: 'The Cosine Rule (SAS & SSS Triangles)',
    topicId: 'm-bearing',
    summary: 'Solves triangles given two sides and the included angle (SAS) or all three sides (SSS).',
    rearrangements: [
      {
        solveFor: 'side',
        label: 'Solve for Side a (SAS)',
        exprHtml: 'a<sup>2</sup> = b<sup>2</sup> + c<sup>2</sup> − 2bc cos A',
      },
      {
        solveFor: 'cosA',
        label: 'Solve for Angle A (SSS)',
        exprHtml: 'cos A = (b<sup>2</sup> + c<sup>2</sup> − a<sup>2</sup>) ÷ (2bc)',
      },
    ],
    variables: [
      ['a', 'Side opposite the angle A'],
      ['b, c', 'The two sides sandwiching included angle A'],
    ],
    trap: 'If angle A is obtuse (A > 90°), cos A is NEGATIVE, so −2bc cos A becomes PLUS!',
    worked: {
      qHtml: 'In △PQR, q = 5 cm, r = 8 cm, and ∠P = 60°. Find side p.',
      stepsHtml: [
        'p² = 5² + 8² − 2(5)(8) cos 60° = 25 + 64 − 80(0.5) = 49',
        'p = √49 = 7 cm',
      ],
      ansHtml: '7 cm',
    },
    keywords: ['cosine rule', 'included angle', 'bearing distance', 'SAS', 'SSS'],
  },
  {
    id: 'mf-tri-area',
    cat: 'trig',
    name: 'Area of a Triangle (½ab sin C) & Back Bearing',
    topicId: 'm-bearing',
    summary: 'Computes non-right triangle area without perpendicular height, plus reverse 3-figure bearings.',
    rearrangements: [
      {
        solveFor: 'Area',
        label: 'Sine Area Formula',
        exprHtml: 'Area = ½ab sin C',
      },
      {
        solveFor: 'back',
        label: '3-Figure Back Bearing',
        exprHtml: 'Back Bearing = θ + 180° (if θ < 180°)  or  θ − 180° (if θ ≥ 180°)',
      },
    ],
    variables: [
      ['a, b', 'Two adjacent sides of the triangle'],
      ['C', 'Included angle between sides a and b'],
      ['θ', 'Forward 3-figure bearing measured clockwise from North'],
    ],
    trap: 'Always write bearings with 3 digits (e.g. 048°, not 48°), and make sure C is the INCLUDED angle between a and b!',
    worked: {
      qHtml: 'Find the area of △XYZ with x = 10 cm, y = 12 cm, and ∠Z = 30°.',
      stepsHtml: [
        'Area = ½ × 10 × 12 × sin 30°',
        'Area = 60 × 0.5 = 30 cm²',
      ],
      ansHtml: '30 cm²',
    },
    keywords: ['area of triangle', 'back bearing', 'three-figure bearing', 'elevation'],
  },

  /* ─────────────── 5. COORDINATE GEOMETRY, VECTORS & SIMILARITY (4) ─────────────── */
  {
    id: 'mf-coord-grad',
    cat: 'coord',
    name: 'Gradient, Midpoint & Distance Between Two Points',
    topicId: 'coord',
    summary: 'Gives slope, exact midpoint coordinates, and straight-line distance between A(x₁, y₁) and B(x₂, y₂).',
    rearrangements: [
      {
        solveFor: 'm',
        label: 'Gradient (m)',
        exprHtml: 'm = (y<sub>2</sub> − y<sub>1</sub>) ÷ (x<sub>2</sub> − x<sub>1</sub>)',
      },
      {
        solveFor: 'M',
        label: 'Midpoint Coordinates (M)',
        exprHtml: 'M = ((x<sub>1</sub> + x<sub>2</sub>) ÷ 2,  (y<sub>1</sub> + y<sub>2</sub>) ÷ 2)',
      },
      {
        solveFor: 'd',
        label: 'Distance |AB|',
        exprHtml: '|AB| = √[(x<sub>2</sub> − x<sub>1</sub>)<sup>2</sup> + (y<sub>2</sub> − y<sub>1</sub>)<sup>2</sup>]',
      },
    ],
    variables: [
      ['(x₁, y₁), (x₂, y₂)', 'Cartesian coordinates of points A and B'],
      ['m', 'Gradient / slope = tan θ'],
    ],
    trap: 'Gradient has Δy ON TOP (y₂ − y₁ over x₂ − x₁), while midpoint ADDS coordinates and divides by 2!',
    worked: {
      qHtml: 'Find the distance between P(−1, 2) and Q(3, 5).',
      stepsHtml: [
        '|PQ| = √[(3 − (−1))² + (5 − 2)²] = √[4² + 3²]',
        '|PQ| = √(16 + 9) = 5 units',
      ],
      ansHtml: '5 units',
    },
    keywords: ['gradient', 'slope', 'midpoint', 'distance', 'coordinate geometry'],
  },
  {
    id: 'mf-coord-line',
    cat: 'coord',
    name: 'Equation of a Straight Line & Perpendicular Gradients',
    topicId: 'coord',
    summary: 'Builds line equations from point + gradient and relates parallel vs perpendicular slopes.',
    rearrangements: [
      {
        solveFor: 'pt',
        label: 'Point–Slope Equation',
        exprHtml: 'y − y<sub>1</sub> = m(x − x<sub>1</sub>)',
      },
      {
        solveFor: 'si',
        label: 'Slope–Intercept Form',
        exprHtml: 'y = mx + c',
      },
      {
        solveFor: 'perp',
        label: 'Parallel & Perpendicular Slopes',
        exprHtml: 'Parallel: m<sub>1</sub> = m<sub>2</sub>  ·  Perpendicular: m<sub>1</sub>m<sub>2</sub> = −1',
      },
    ],
    variables: [
      ['m', 'Gradient of the line'],
      ['c', 'y-intercept (where x = 0)'],
      ['−1/m₁', 'Perpendicular gradient m₂'],
    ],
    trap: 'Do NOT read m directly from ax + by + c = 0 — isolate y first so y = (−a/b)x − c/b!',
    worked: {
      qHtml: 'Find the gradient of a line perpendicular to 2x + 3y − 6 = 0.',
      stepsHtml: [
        '3y = −2x + 6 → y = (−2/3)x + 2, so m₁ = −2/3',
        'Perpendicular gradient m₂ = −1 ÷ (−2/3) = +3/2',
      ],
      ansHtml: '3/2',
    },
    keywords: ['equation of line', 'parallel', 'perpendicular', 'y-intercept'],
  },
  {
    id: 'mf-vec-dot',
    cat: 'coord',
    name: '2D Vector Modulus, Position Vector & Dot Product',
    topicId: 'm-vec',
    summary: 'Computes vector magnitude |r|, displacement AB = b − a, and scalar product angle test.',
    rearrangements: [
      {
        solveFor: 'mod',
        label: 'Modulus & Displacement Vector',
        exprHtml: '|r| = √(x<sup>2</sup> + y<sup>2</sup>)  ·  AB = OB − OA',
      },
      {
        solveFor: 'dot',
        label: 'Scalar (Dot) Product',
        exprHtml: 'a · b = x<sub>1</sub>x<sub>2</sub> + y<sub>1</sub>y<sub>2</sub> = |a||b| cos θ',
      },
      {
        solveFor: 'perp',
        label: 'Perpendicular Vectors Test',
        exprHtml: 'a ⊥ b  ⇔  x<sub>1</sub>x<sub>2</sub> + y<sub>1</sub>y<sub>2</sub> = 0',
      },
    ],
    variables: [
      ['OA, OB', 'Position vectors of A and B from origin O'],
      ['|r|', 'Magnitude / length of vector r = xi + yj'],
      ['θ', 'Angle between vectors a and b'],
    ],
    trap: 'Displacement vector AB is OB − OA (Head minus Tail), NEVER OA − OB!',
    worked: {
      qHtml: 'Find k if vectors a = 3i + 4j and b = 8i + kj are perpendicular.',
      stepsHtml: [
        'For perpendicular vectors, a · b = 0',
        '(3)(8) + (4)(k) = 0 → 24 + 4k = 0 → k = −6',
      ],
      ansHtml: 'k = −6',
    },
    keywords: ['vector', 'modulus', 'magnitude', 'dot product', 'scalar product', 'position vector'],
  },
  {
    id: 'mf-sim-scale',
    cat: 'coord',
    name: 'Similar Shapes: Area (k²) & Volume (k³) Scale Factors',
    topicId: 'm-proof',
    summary: 'Scales areas by the square and volumes/masses by the cube of the linear ratio k = l₁/l₂.',
    rearrangements: [
      {
        solveFor: 'area',
        label: 'Area Ratio of Similar Figures',
        exprHtml: 'A<sub>1</sub> ÷ A<sub>2</sub> = (l<sub>1</sub> ÷ l<sub>2</sub>)<sup>2</sup> = k<sup>2</sup>',
      },
      {
        solveFor: 'vol',
        label: 'Volume Ratio of Similar Solids',
        exprHtml: 'V<sub>1</sub> ÷ V<sub>2</sub> = (l<sub>1</sub> ÷ l<sub>2</sub>)<sup>3</sup> = k<sup>3</sup>',
      },
      {
        solveFor: 'k',
        label: 'Recover Linear Ratio k',
        exprHtml: 'k = √(A<sub>1</sub> ÷ A<sub>2</sub>) = <sup>3</sup>√(V<sub>1</sub> ÷ V<sub>2</sub>)',
      },
    ],
    variables: [
      ['k = l₁/l₂', 'Linear scale factor (heights, radii, perimeters)'],
      ['k²', 'Area / surface-area ratio'],
      ['k³', 'Volume / capacity ratio'],
    ],
    trap: 'If given an AREA ratio like 4 : 9, take the square root FIRST (k = 2 : 3) before cubing to find volume ratio (8 : 27)!',
    worked: {
      qHtml: 'Two similar cones have heights in ratio 2 : 3. If the smaller has volume 16 cm³, find the larger volume.',
      stepsHtml: [
        'V₁ ÷ V₂ = (2 ÷ 3)³ = 8 ÷ 27',
        '16 ÷ V₂ = 8 ÷ 27 → V₂ = (16 × 27) ÷ 8 = 54 cm³',
      ],
      ansHtml: '54 cm³',
    },
    keywords: ['similar triangles', 'similar solids', 'scale factor', 'area ratio', 'volume ratio'],
  },

  /* ─────────────── 6. CALCULUS, STATISTICS & PROBABILITY (4) ─────────────── */
  {
    id: 'mf-diff-power',
    cat: 'calcstats',
    name: 'Power-Rule Differentiation & Stationary Points',
    topicId: 'diff',
    summary: 'Differentiates polynomials term-by-term to find tangent gradients, velocities, and turning points.',
    rearrangements: [
      {
        solveFor: 'dy',
        label: 'Power Rule Derivative',
        exprHtml: 'y = ax<sup>n</sup>  ⇒  dy/dx = nax<sup>n−1</sup>',
      },
      {
        solveFor: 'turn',
        label: 'Stationary / Turning Point Condition',
        exprHtml: 'dy/dx = 0   (d<sup>2</sup>y/dx<sup>2</sup> < 0: Max · > 0: Min)',
      },
      {
        solveFor: 'kin',
        label: 'Kinematics Motion Derivatives',
        exprHtml: 'v = ds/dt  ·  a = dv/dt',
      },
    ],
    variables: [
      ['dy/dx', 'Gradient of tangent at x'],
      ['s, v, a', 'Displacement, velocity, and acceleration at time t'],
    ],
    trap: 'The derivative of ANY standalone constant c is 0, and rewrite 1/xⁿ as x⁻ⁿ before differentiating!',
    worked: {
      qHtml: 'Find the gradient of the curve y = 3x² − 5x + 4 at x = 2.',
      stepsHtml: [
        'dy/dx = 6x − 5',
        'At x = 2: dy/dx = 6(2) − 5 = 7',
      ],
      ansHtml: '7',
    },
    keywords: ['differentiation', 'derivative', 'gradient', 'turning point', 'maximum', 'minimum', 'velocity'],
  },
  {
    id: 'mf-integ-power',
    cat: 'calcstats',
    name: 'Indefinite & Definite Integration (Area Under Curve)',
    topicId: 'integ',
    summary: 'Reverses differentiation by raising the power by 1 and dividing by the new power.',
    rearrangements: [
      {
        solveFor: 'indef',
        label: 'Indefinite Integral (n ≠ −1)',
        exprHtml: '∫ ax<sup>n</sup> dx = ax<sup>n+1</sup> ÷ (n + 1) + C',
      },
      {
        solveFor: 'def',
        label: 'Definite Integral / Area',
        exprHtml: '∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a)',
      },
    ],
    variables: [
      ['C', 'Constant of integration (required on indefinite integrals)'],
      ['a, b', 'Lower and upper limits of definite integral'],
    ],
    trap: 'Add 1 to the exponent FIRST and divide by that NEW exponent (n + 1), then evaluate Upper limit F(b) minus Lower limit F(a)!',
    worked: {
      qHtml: 'Evaluate ∫<sub>0</sub><sup>2</sup> 3x² dx.',
      stepsHtml: [
        '∫ 3x² dx = [x³]<sub>0</sub><sup>2</sup>',
        'F(2) − F(0) = 2³ − 0³ = 8',
      ],
      ansHtml: '8',
    },
    keywords: ['integration', 'integral', 'area under curve', 'antiderivative'],
  },
  {
    id: 'mf-stats-sd',
    cat: 'calcstats',
    name: 'Mean, Variance & Standard Deviation',
    topicId: 'disp',
    summary: 'Measures central tendency x̄ and spread σ of raw or frequency-table data.',
    rearrangements: [
      {
        solveFor: 'mean',
        label: 'Grouped / Frequency Mean (x̄)',
        exprHtml: 'x̄ = ∑fx ÷ ∑f',
      },
      {
        solveFor: 'var',
        label: 'Population Variance (σ²)',
        exprHtml: 'σ<sup>2</sup> = ∑f(x − x̄)<sup>2</sup> ÷ ∑f = (∑fx<sup>2</sup> ÷ ∑f) − x̄<sup>2</sup>',
      },
      {
        solveFor: 'sd',
        label: 'Standard Deviation (σ)',
        exprHtml: 'σ = √Variance',
      },
    ],
    variables: [
      ['x', 'Score or class midpoint'],
      ['f', 'Frequency of each score/class (N = ∑f)'],
      ['σ², σ', 'Variance and Standard Deviation'],
    ],
    trap: 'Standard deviation is the SQUARE ROOT of variance — don’t stop at σ² when asked for standard deviation!',
    worked: {
      qHtml: 'Find the variance and standard deviation of the numbers 2, 4, 6, 8.',
      stepsHtml: [
        'Mean x̄ = (2 + 4 + 6 + 8) ÷ 4 = 5',
        'Variance σ² = [(−3)² + (−1)² + 1² + 3²] ÷ 4 = 20 ÷ 4 = 5 → SD = √5',
      ],
      ansHtml: 'Variance = 5, SD = √5',
    },
    keywords: ['mean', 'variance', 'standard deviation', 'statistics', 'dispersion'],
  },
  {
    id: 'mf-perm-comb',
    cat: 'calcstats',
    name: 'Permutations (ⁿPᵣ), Combinations (ⁿCᵣ) & Probability',
    topicId: 'perm',
    summary: 'Counts ordered arrangements, unordered selections, and combined event probabilities.',
    rearrangements: [
      {
        solveFor: 'comb',
        label: 'Combinations (Order Irrelevant)',
        exprHtml: '<sup>n</sup>C<sub>r</sub> = n! ÷ [r!(n − r)!]',
      },
      {
        solveFor: 'perm',
        label: 'Permutations (Order Matters)',
        exprHtml: '<sup>n</sup>P<sub>r</sub> = n! ÷ (n − r)!',
      },
      {
        solveFor: 'prob',
        label: 'Complement & Independent Probability',
        exprHtml: 'P(E′) = 1 − P(E)  ·  P(A ∩ B) = P(A) × P(B)',
      },
    ],
    variables: [
      ['n', 'Total available items (0! = 1)'],
      ['r', 'Number of items arranged or chosen'],
    ],
    constants: ['0! = 1', 'ⁿC₀ = ⁿCₙ = 1'],
    trap: 'Committees and teams ignore order → use ⁿCᵣ; codes, rankings, and Words with repeated letters use n!/(p!q!)!',
    worked: {
      qHtml: 'In how many ways can a committee of 3 be chosen from 7 students?',
      stepsHtml: [
        '<sup>7</sup>C<sub>3</sub> = (7 × 6 × 5) ÷ (3 × 2 × 1)',
        '<sup>7</sup>C<sub>3</sub> = 210 ÷ 6 = 35 ways',
      ],
      ansHtml: '35 ways',
    },
    keywords: ['permutation', 'combination', 'factorial', 'probability', 'committee'],
  },
];
