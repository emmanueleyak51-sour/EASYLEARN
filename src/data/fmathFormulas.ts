import type { FormulaRearrangement } from './chemFormulas';

export type FMathFormulaCatId =
  | 'pure'
  | 'calculus'
  | 'vectors'
  | 'mechanics'
  | 'stats';

export interface FMathFormulaCategory {
  id: FMathFormulaCatId | 'all';
  label: string;
  shortLabel: string;
  desc: string;
}

export interface FMathFormulaItem {
  id: string;
  cat: FMathFormulaCatId;
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

export const FMATH_FORMULA_CATEGORIES: FMathFormulaCategory[] = [
  {
    id: 'all',
    label: 'All Further Maths Formulas',
    shortLabel: 'All',
    desc: 'All 25 NERDC, WAEC & JAMB Further Mathematics equations across Pure Algebra, Calculus, Vectors, Mechanics & Probability',
  },
  {
    id: 'pure',
    label: 'Pure Algebra, Matrices, Complex & Conics',
    shortLabel: 'Pure Maths',
    desc: 'Quadratic α+β/αβ,Remainder Theorem, GP S∞, Binomial expansion, Circle centre/radius, 2×2 Inverse, De Moivre & Conic eccentricity',
  },
  {
    id: 'calculus',
    label: 'Differential & Integral Calculus',
    shortLabel: 'Calculus',
    desc: 'First principles, Product/Quotient/Chain rules, Stationary points, Integration by parts, Volumes of revolution & Trapezoidal rule',
  },
  {
    id: 'vectors',
    label: '2D & 3D Vector Algebra',
    shortLabel: 'Vectors',
    desc: 'Modulus & unit vectors, Scalar dot product cos θ, Scalar projection, and 3D vector cross product area',
  },
  {
    id: 'mechanics',
    label: 'Statics, Projectiles & Collisions',
    shortLabel: 'Mechanics',
    desc: 'Projectile T, H & Range, Lami’s Theorem, Inclined-plane friction, Connected pulleys & Newton’s Restitution Law',
  },
  {
    id: 'stats',
    label: 'Combinatorics, Distributions & Correlation',
    shortLabel: 'Prob & Stats',
    desc: 'Permutations & Combinations, Binomial & Poisson distributions, Discrete expectation/variance & Spearman’s rank correlation',
  },
];

export const FMATH_FORMULAS: FMathFormulaItem[] = [
  /* ─────────────── 1. PURE ALGEBRA, MATRICES, COMPLEX & CONICS (8) ─────────────── */
  {
    id: 'fmf-roots',
    cat: 'pure',
    name: 'Symmetric Roots of a Quadratic Equation (α & β)',
    topicId: 'fm-quadratics-roots',
    summary: 'Relates the sum and product of roots α and β directly to coefficients of ax² + bx + c = 0 without solving for individual roots.',
    rearrangements: [
      { solveFor: 'sum-prod', label: 'Sum & Product', exprHtml: 'α + β = −b/a &nbsp;·&nbsp; αβ = c/a' },
      { solveFor: 'squares', label: 'Sum of Squares', exprHtml: 'α<sup>2</sup> + β<sup>2</sup> = (α + β)<sup>2</sup> − 2αβ' },
      { solveFor: 'new-eq', label: 'New Quadratic', exprHtml: 'x<sup>2</sup> − (Sum)x + (Product) = 0' },
    ],
    variables: [
      ['a, b, c', 'Leading, linear, and constant coefficients in ax² + bx + c = 0 (a ≠ 0)'],
      ['α + β', 'Sum of roots (−b ÷ a)'],
      ['αβ', 'Product of roots (c ÷ a)'],
    ],
    constants: ['α³ + β³ = (α + β)³ − 3αβ(α + β) · (α − β)² = (α + β)² − 4αβ'],
    trap: 'Never forget the MINUS sign in α + β = −b/a and in x² − (Sum)x + (Product) = 0! Also divide by a first whenever a ≠ 1.',
    worked: {
      qHtml: 'If α and β are roots of 2x<sup>2</sup> − 6x + 5 = 0, find α<sup>2</sup> + β<sup>2</sup>.',
      stepsHtml: [
        'α + β = −(−6)/2 = 3; αβ = 5/2 = 2.5',
        'α<sup>2</sup> + β<sup>2</sup> = (α + β)<sup>2</sup> − 2αβ = 3<sup>2</sup> − 2(2.5) = 9 − 5 = 4',
      ],
      ansHtml: '4',
    },
    keywords: ['alpha', 'beta', 'sum of roots', 'product of roots', 'symmetric'],
  },
  {
    id: 'fmf-remainder',
    cat: 'pure',
    name: 'Polynomial Remainder & Factor Theorem',
    topicId: 'fm-polynomials',
    summary: 'Gives the exact remainder when a polynomial P(x) is divided by a linear divisor (ax − b) by direct substitution.',
    rearrangements: [
      { solveFor: 'rem-simple', label: 'Divisor (x − a)', exprHtml: 'Remainder R = P(a)' },
      { solveFor: 'rem-linear', label: 'Divisor (ax − b)', exprHtml: 'Remainder R = P(b/a)' },
      { solveFor: 'factor', label: 'Factor Condition', exprHtml: '(x − a) is a factor ⇔ P(a) = 0' },
    ],
    variables: [
      ['P(x)', 'Polynomial of degree n ≥ 1'],
      ['a or b/a', 'Zero of the linear divisor obtained by setting divisor = 0'],
      ['R', 'Constant remainder'],
    ],
    trap: 'When dividing by (x + 3), set x + 3 = 0 → substitute x = −3 (NOT +3)!',
    worked: {
      qHtml: 'Find the remainder when P(x) = 2x<sup>3</sup> − x<sup>2</sup> + 4 is divided by (x + 2).',
      stepsHtml: ['Set x + 2 = 0 → x = −2', 'R = P(−2) = 2(−8) − (4) + 4 = −16'],
      ansHtml: '−16',
    },
    keywords: ['remainder theorem', 'factor theorem', 'polynomial'],
  },
  {
    id: 'fmf-gp-inf',
    cat: 'pure',
    name: 'Sum to Infinity of a Convergent Geometric Series',
    topicId: 'fm-sequences-series',
    summary: 'Computes the limiting sum of an infinite GP when the common ratio satisfies |r| < 1.',
    rearrangements: [
      { solveFor: 'Sinf', label: 'Solve for S_∞', exprHtml: 'S<sub>∞</sub> = a ÷ (1 − r) &nbsp;(|r| &lt; 1)' },
      { solveFor: 'a', label: 'Solve for first term a', exprHtml: 'a = S<sub>∞</sub>(1 − r)' },
      { solveFor: 'r', label: 'Solve for ratio r', exprHtml: 'r = 1 − (a ÷ S<sub>∞</sub>)' },
    ],
    variables: [
      ['a', 'First term T₁ of the geometric progression'],
      ['r', 'Common ratio T₂ ÷ T₁ (must satisfy −1 < r < 1)'],
      ['S<sub>∞</sub>', 'Convergent sum to infinity'],
    ],
    trap: 'Check |r| < 1 first! If |r| ≥ 1, the series diverges and S_∞ does not exist. Watch double negatives when r < 0: 1 − (−1/2) = 3/2.',
    worked: {
      qHtml: 'Find the sum to infinity of 18 − 6 + 2 − 2/3 + …',
      stepsHtml: ['a = 18, r = −6 ÷ 18 = −1/3 (|r| < 1)', 'S<sub>∞</sub> = 18 ÷ (1 − (−1/3)) = 18 ÷ (4/3) = 13.5'],
      ansHtml: '27/2 (13.5)',
    },
    keywords: ['sum to infinity', 'convergent', 'geometric series', 'gp'],
  },
  {
    id: 'fmf-binomial',
    cat: 'pure',
    name: 'General Term & Rational-Index Binomial Expansion',
    topicId: 'fm-binomial',
    summary: 'Finds any specific term in (a + b)ⁿ or expands (1 + x)ⁿ for negative and fractional powers when |x| < 1.',
    rearrangements: [
      { solveFor: 'Tr1', label: '(r + 1)th Term', exprHtml: 'T<sub>r+1</sub> = <sup>n</sup>C<sub>r</sub> a<sup>n−r</sup> b<sup>r</sup>' },
      { solveFor: 'any-n', label: 'Any Index n (|x| < 1)', exprHtml: '(1 + x)<sup>n</sup> = 1 + nx + [n(n−1)/2!]x<sup>2</sup> + …' },
    ],
    variables: [
      ['n', 'Positive integer (finite) or negative/fractional index (infinite series)'],
      ['r', 'Term index starting from r = 0 for the 1st term'],
      ['|x| < 1', 'Mandatory interval of validity when n is negative or fractional'],
    ],
    trap: 'For (a + bx)ⁿ with negative/fractional n, factor out aⁿ FIRST: aⁿ(1 + (b/a)x)ⁿ, valid strictly for |(b/a)x| < 1!',
    worked: {
      qHtml: 'Find the coefficient of x<sup>2</sup> in the expansion of (1 − 2x)<sup>5</sup>.',
      stepsHtml: ['Set r = 2: T<sub>3</sub> = <sup>5</sup>C<sub>2</sub>(1)<sup>3</sup>(−2x)<sup>2</sup>', '<sup>5</sup>C<sub>2</sub> × 4 = 10 × 4 = 40'],
      ansHtml: '40',
    },
    keywords: ['binomial', 'coefficient', 'general term', 'validity'],
  },
  {
    id: 'fmf-line-angle-dist',
    cat: 'pure',
    name: 'Acute Angle Between Two Lines & Point-to-Line Distance',
    topicId: 'fm-coord-lines',
    summary: 'Finds the acute intersection angle from gradients m₁, m₂ and the perpendicular distance from (x₀, y₀) to Ax + By + C = 0.',
    rearrangements: [
      { solveFor: 'angle', label: 'Acute Angle θ', exprHtml: 'tan θ = |(m<sub>1</sub> − m<sub>2</sub>) ÷ (1 + m<sub>1</sub>m<sub>2</sub>)|' },
      { solveFor: 'dist', label: 'Perpendicular Distance', exprHtml: 'd = |Ax<sub>0</sub> + By<sub>0</sub> + C| ÷ √(A<sup>2</sup> + B<sup>2</sup>)' },
    ],
    variables: [
      ['m<sub>1</sub>, m<sub>2</sub>', 'Gradients of the two intersecting lines (m₁m₂ ≠ −1)'],
      ['A, B, C', 'Coefficients when the line is written in standard form Ax + By + C = 0'],
      ['d', 'Shortest perpendicular distance from (x₀, y₀) to the line'],
    ],
    trap: 'Move ALL terms to one side (Ax + By + C = 0) before applying the distance formula, and divide by √(A² + B²), never (A + B)!',
    worked: {
      qHtml: 'Find the perpendicular distance from P(2, −1) to the line 3x − 4y + 5 = 0.',
      stepsHtml: ['|3(2) − 4(−1) + 5| = |6 + 4 + 5| = 15', '√(3² + (−4)²) = √25 = 5 → d = 15 ÷ 5 = 3 units'],
      ansHtml: '3 units',
    },
    keywords: ['perpendicular distance', 'acute angle', 'gradients'],
  },
  {
    id: 'fmf-circle',
    cat: 'pure',
    name: 'General Equation of a Circle & Length of Tangent',
    topicId: 'fm-coord-circle',
    summary: 'Extracts the centre, radius, and external tangent length directly from x² + y² + 2gx + 2fy + c = 0.',
    rearrangements: [
      { solveFor: 'centre-r', label: 'Centre & Radius', exprHtml: 'C = (−g, −f) &nbsp;·&nbsp; r = √(g<sup>2</sup> + f<sup>2</sup> − c)' },
      { solveFor: 'tan-len', label: 'Length of Tangent from (x₁,y₁)', exprHtml: 'L = √(x<sub>1</sub><sup>2</sup> + y<sub>1</sub><sup>2</sup> + 2gx<sub>1</sub> + 2fy<sub>1</sub> + c)' },
    ],
    variables: [
      ['2g, 2f', 'Coefficients of x and y AFTER dividing through so x² and y² have coefficient 1'],
      ['c', 'Constant term on the LHS (= 0 on RHS)'],
      ['r, L', 'Circle radius and tangent segment length from external point (x₁, y₁)'],
    ],
    trap: 'If the equation starts with 2x² + 2y² + …, DIVIDE EVERY TERM BY 2 FIRST before reading off 2g, 2f, and c!',
    worked: {
      qHtml: 'Find the centre and radius of x<sup>2</sup> + y<sup>2</sup> − 6x + 8y − 11 = 0.',
      stepsHtml: ['2g = −6 → g = −3; 2f = 8 → f = 4; c = −11 → Centre (−g, −f) = (3, −4)', 'r = √((−3)² + 4² − (−11)) = √(9 + 16 + 11) = √36 = 6'],
      ansHtml: 'Centre (3, −4), r = 6',
    },
    keywords: ['circle', 'centre', 'radius', 'tangent length'],
  },
  {
    id: 'fmf-matrix-inv',
    cat: 'pure',
    name: 'Determinant & Inverse of a Non-Singular Matrix',
    topicId: 'fm-matrices-det',
    summary: 'Computes det(A) = ad − bc and A⁻¹ = (1/det A) adj(A), and identifies singular matrices when det(A) = 0.',
    rearrangements: [
      { solveFor: 'det2', label: '2×2 Determinant', exprHtml: '|A| = ad − bc' },
      { solveFor: 'inv2', label: '2×2 Inverse Matrix', exprHtml: 'A<sup>−1</sup> = (1 ÷ |A|) [ d, −b ; −c, a ]' },
      { solveFor: 'cramer', label: 'Cramer’s Rule', exprHtml: 'x = Δ<sub>x</sub> ÷ Δ &nbsp;·&nbsp; y = Δ<sub>y</sub> ÷ Δ' },
    ],
    variables: [
      ['a, b, c, d', 'Entries of 2×2 matrix [[a, b], [c, d]]'],
      ['|A| (or Δ)', 'Determinant; matrix is singular (no inverse) iff |A| = 0'],
      ['adj(A)', 'Swap leading diagonal (a ↔ d) and negate off-diagonal (−b, −c)'],
    ],
    trap: 'Swap a and d on the main diagonal, NEGATE b and c on the minor diagonal — never swap both diagonals!',
    worked: {
      qHtml: 'Find the value of k for which matrix M = [[k, 4], [3, k + 1]] is singular.',
      stepsHtml: ['Singular ⇒ det(M) = 0 → k(k + 1) − 12 = 0', 'k² + k − 12 = 0 → (k + 4)(k − 3) = 0 → k = 3 or −4'],
      ansHtml: 'k = 3 or −4',
    },
    keywords: ['determinant', 'inverse matrix', 'singular', 'cramer'],
  },
  {
    id: 'fmf-demoivre',
    cat: 'pure',
    name: 'Complex Modulus, Argument & De Moivre’s Theorem',
    topicId: 'fm-complex-numbers',
    summary: 'Converts z = x + iy into polar form r(cos θ + i sin θ) and raises complex numbers to integer or fractional powers.',
    rearrangements: [
      { solveFor: 'mod-arg', label: 'Modulus & Argument', exprHtml: '|z| = r = √(x<sup>2</sup> + y<sup>2</sup>) &nbsp;·&nbsp; tan θ = y/x' },
      { solveFor: 'demoivre', label: 'De Moivre’s Theorem', exprHtml: '[r(cos θ + i sin θ)]<sup>n</sup> = r<sup>n</sup>(cos nθ + i sin nθ)' },
    ],
    variables: [
      ['x, y', 'Real part Re(z) and imaginary part Im(z) in z = x + iy (i² = −1)'],
      ['r', 'Modulus |z| (distance from origin on Argand plane)'],
      ['θ', 'Principal argument in (−π, π] adjusted for the Argand quadrant of (x, y)'],
    ],
    constants: ['i² = −1 · z·z̄ = x² + y² = |z|²'],
    trap: 'Always sketch (x, y) on the Argand diagram first! For z = −1 + i (2nd quadrant), θ = 3π/4 (135°), NOT −π/4 (−45°)!',
    worked: {
      qHtml: 'Find the modulus |z| of z = (3 − 4i).',
      stepsHtml: ['|z| = √(3² + (−4)²) = √(9 + 16) = √25 = 5'],
      ansHtml: '5',
    },
    keywords: ['complex', 'modulus', 'argument', 'de moivre', 'argand'],
  },

  /* ─────────────── 2. DIFFERENTIAL & INTEGRAL CALCULUS (6) ─────────────── */
  {
    id: 'fmf-diff-first',
    cat: 'calculus',
    name: 'Derivative from First Principles & Standard Power/Trig Rules',
    topicId: 'fm-limits-diff',
    summary: 'Defines the instantaneous gradient dy/dx as a limit of difference quotients and gives power/trig/exp derivatives.',
    rearrangements: [
      { solveFor: 'limit', label: 'First Principles', exprHtml: 'f′(x) = lim<sub>h→0</sub> [f(x + h) − f(x)] ÷ h' },
      { solveFor: 'power', label: 'Power & Exp/Log', exprHtml: 'd/dx(x<sup>n</sup>) = nx<sup>n−1</sup> · d/dx(e<sup>kx</sup>) = ke<sup>kx</sup> · d/dx(ln x) = 1/x' },
      { solveFor: 'trig', label: 'Radian Trig', exprHtml: 'd/dx(sin ax) = a cos ax · d/dx(cos ax) = −a sin ax' },
    ],
    variables: [
      ['h (or δx)', 'Infinitesimal increment in x approaching 0'],
      ['f′(x) or dy/dx', 'Instantaneous rate of change / tangent gradient at x'],
    ],
    trap: 'Calculus trig derivatives (d/dx sin x = cos x) ONLY hold when x is measured in RADIANS, and d/dx(cos x) carries a MINUS sign!',
    worked: {
      qHtml: 'Find dy/dx at x = 2 if y = 3x<sup>3</sup> − 4x + 7.',
      stepsHtml: ['dy/dx = 9x² − 4', 'At x = 2: dy/dx = 9(4) − 4 = 32'],
      ansHtml: '32',
    },
    keywords: ['first principles', 'differentiation', 'power rule', 'gradient'],
  },
  {
    id: 'fmf-prod-quot-chain',
    cat: 'calculus',
    name: 'Product, Quotient & Chain Rules of Differentiation',
    topicId: 'fm-diff-rules',
    summary: 'Differentiates products uv, quotients u/v, and composite functions y = f(g(x)).',
    rearrangements: [
      { solveFor: 'product', label: 'Product Rule', exprHtml: 'd/dx(uv) = u(dv/dx) + v(du/dx)' },
      { solveFor: 'quotient', label: 'Quotient Rule', exprHtml: 'd/dx(u/v) = [v(du/dx) − u(dv/dx)] ÷ v<sup>2</sup>' },
      { solveFor: 'chain', label: 'Chain Rule', exprHtml: 'dy/dx = (dy/du) × (du/dx)' },
    ],
    variables: [
      ['u(x), v(x)', 'Differentiable component functions of x'],
      ['v²', 'Square of denominator in the Quotient Rule'],
    ],
    trap: 'In the Quotient Rule, start the numerator with v(du/dx) MINUS u(dv/dx) — reversing the subtraction flips the sign of dy/dx!',
    worked: {
      qHtml: 'Differentiate y = (2x + 1)<sup>4</sup> with respect to x.',
      stepsHtml: ['Let u = 2x + 1 (du/dx = 2) and y = u⁴ (dy/du = 4u³)', 'dy/dx = 4(2x + 1)³ × 2 = 8(2x + 1)³'],
      ansHtml: '8(2x + 1)<sup>3</sup>',
    },
    keywords: ['product rule', 'quotient rule', 'chain rule'],
  },
  {
    id: 'fmf-stationary',
    cat: 'calculus',
    name: 'Tangents, Normals & Second-Derivative Stationary Test',
    topicId: 'fm-diff-apps',
    summary: 'Finds tangent/normal lines at (x₁, y₁) and classifies turning points where dy/dx = 0.',
    rearrangements: [
      { solveFor: 'tan-norm', label: 'Tangent & Normal', exprHtml: 'm<sub>T</sub> = dy/dx &nbsp;·&nbsp; m<sub>N</sub> = −1 ÷ m<sub>T</sub>' },
      { solveFor: 'second', label: '2nd Derivative Test', exprHtml: 'dy/dx = 0: d<sup>2</sup>y/dx<sup>2</sup> &lt; 0 ⇒ Max · d<sup>2</sup>y/dx<sup>2</sup> &gt; 0 ⇒ Min' },
    ],
    variables: [
      ['m<sub>T</sub>, m<sub>N</sub>', 'Gradient of tangent and perpendicular normal at (x₁, y₁)'],
      ['d²y/dx²', 'Second derivative measuring concavity at a stationary point'],
    ],
    trap: 'Counter-intuitive sign! Negative second derivative (d²y/dx² < 0) means a MAXIMUM peak, while positive (d²y/dx² > 0) means a MINIMUM trough!',
    worked: {
      qHtml: 'Find the x-coordinate of the minimum point on y = x<sup>2</sup> − 8x + 19 and the minimum y-value.',
      stepsHtml: ['dy/dx = 2x − 8 = 0 → x = 4 (d²y/dx² = 2 > 0 ⇒ minimum)', 'y<sub>min</sub> = 4² − 8(4) + 19 = 3'],
      ansHtml: 'x = 4, y<sub>min</sub> = 3',
    },
    keywords: ['stationary point', 'maximum', 'minimum', 'normal'],
  },
  {
    id: 'fmf-int-parts',
    cat: 'calculus',
    name: 'Definite Integration & Integration by Parts',
    topicId: 'fm-integration',
    summary: 'Evaluates definite integrals via the Fundamental Theorem and integrates products using LIATE priority.',
    rearrangements: [
      { solveFor: 'ftc', label: 'Definite Power Integral', exprHtml: '∫<sub>a</sub><sup>b</sup> x<sup>n</sup> dx = [x<sup>n+1</sup>/(n+1)]<sub>a</sub><sup>b</sup> = F(b) − F(a)' },
      { solveFor: 'parts', label: 'Integration by Parts', exprHtml: '∫ u (dv/dx) dx = uv − ∫ v (du/dx) dx' },
    ],
    variables: [
      ['a, b', 'Lower and upper limits of integration'],
      ['u, dv/dx', 'Choose u by LIATE order (Logs → Inverse trig → Algebraic → Trig → Exp)'],
    ],
    trap: 'For indefinite integrals ALWAYS add + C; for definite integrals evaluate Upper F(b) MINUS Lower F(a) and change limits when using u-substitution!',
    worked: {
      qHtml: 'Evaluate ∫<sub>0</sub><sup>3</sup> (3x<sup>2</sup> + 2) dx.',
      stepsHtml: ['Antiderivative F(x) = x³ + 2x', 'F(3) − F(0) = (27 + 6) − 0 = 33'],
      ansHtml: '33',
    },
    keywords: ['definite integral', 'integration by parts', 'antiderivative'],
  },
  {
    id: 'fmf-vol-rev',
    cat: 'calculus',
    name: 'Area Under a Curve & Volume of Solid of Revolution',
    topicId: 'fm-integration-apps',
    summary: 'Computes planar area and 3D volume swept when y = f(x) rotates 360° (2π radians) about the x- or y-axis.',
    rearrangements: [
      { solveFor: 'vx', label: '360° About x-axis', exprHtml: 'V<sub>x</sub> = π ∫<sub>a</sub><sup>b</sup> y<sup>2</sup> dx' },
      { solveFor: 'vy', label: '360° About y-axis', exprHtml: 'V<sub>y</sub> = π ∫<sub>c</sub><sup>d</sup> x<sup>2</sup> dy' },
      { solveFor: 'trap', label: 'Trapezoidal Rule', exprHtml: 'A ≈ (h/2)[y<sub>0</sub> + y<sub>n</sub> + 2(y<sub>1</sub> + … + y<sub>n−1</sub>)]' },
    ],
    variables: [
      ['V<sub>x</sub>, V<sub>y</sub>', 'Volume swept through 2π radians (cubic units)'],
      ['h', 'Strip width (b − a) ÷ n in the Trapezoidal Rule (n strips ⇒ n + 1 ordinates)'],
    ],
    trap: 'Never forget the factor π AND squaring y² inside V = π ∫ y² dx (many candidates integrate πy by mistake)!',
    worked: {
      qHtml: 'The curve y = √x from x = 0 to x = 4 is rotated 360° about the x-axis. Find the volume generated.',
      stepsHtml: ['y² = x → V = π ∫₀⁴ x dx = π [x²/2]₀⁴ = π(16/2 − 0) = 8π'],
      ansHtml: '8π cubic units',
    },
    keywords: ['volume of revolution', 'trapezoidal rule', 'area under curve'],
  },
  {
    id: 'fmf-conics',
    cat: 'pure',
    name: 'Parabola & Ellipse Standard Equations & Eccentricity',
    topicId: 'fm-conic-sections',
    summary: 'Links focus, directrix, latus rectum, and eccentricity e across standard conic sections.',
    rearrangements: [
      { solveFor: 'parab', label: 'Parabola y² = 4ax (e = 1)', exprHtml: 'Focus (a, 0) · Directrix x = −a · Latus Rectum = 4a' },
      { solveFor: 'ellipse', label: 'Ellipse x²/a² + y²/b² = 1', exprHtml: 'b<sup>2</sup> = a<sup>2</sup>(1 − e<sup>2</sup>) &nbsp;(0 &lt; e &lt; 1), Foci (±ae, 0)' },
    ],
    variables: [
      ['a', 'Focal parameter for parabola (4a = coefficient of x) or semi-major axis of ellipse'],
      ['e', 'Eccentricity: e = 0 circle, 0 < e < 1 ellipse, e = 1 parabola, e > 1 hyperbola'],
    ],
    trap: 'In y² = 12x, 4a = 12 so focus is (3, 0), NOT (12, 0)! For hyperbola x²/a² − y²/b² = 1, b² = a²(e² − 1) with e > 1.',
    worked: {
      qHtml: 'Find the focus and length of the latus rectum of the parabola y<sup>2</sup> = 16x.',
      stepsHtml: ['Compare with y² = 4ax → 4a = 16 → a = 4', 'Focus = (4, 0); Length of latus rectum = 4a = 16'],
      ansHtml: 'Focus (4, 0), Latus rectum = 16',
    },
    keywords: ['parabola', 'ellipse', 'hyperbola', 'focus', 'eccentricity'],
  },

  /* ─────────────── 3. 2D & 3D VECTOR ALGEBRA (3) ─────────────── */
  {
    id: 'fmf-dot-prod',
    cat: 'vectors',
    name: 'Scalar (Dot) Product, Angle Between Vectors & Orthogonality',
    topicId: 'fm-vectors-2d',
    summary: 'Computes a · b algebraically or geometrically to find the angle θ between vectors and test perpendicularity.',
    rearrangements: [
      { solveFor: 'dot', label: 'Scalar Product', exprHtml: '<b>a · b</b> = a<sub>x</sub>b<sub>x</sub> + a<sub>y</sub>b<sub>y</sub> + a<sub>z</sub>b<sub>z</sub> = |<b>a</b>||<b>b</b>| cos θ' },
      { solveFor: 'cos', label: 'Solve for cos θ', exprHtml: 'cos θ = (<b>a · b</b>) ÷ (|<b>a</b>||<b>b</b>|)' },
      { solveFor: 'proj', label: 'Scalar Projection of a on b', exprHtml: 'Proj<sub>b</sub>(<b>a</b>) = (<b>a · b</b>) ÷ |<b>b</b>|' },
    ],
    variables: [
      ['|a|, |b|', 'Vector magnitudes √(a_x² + a_y² + a_z²)'],
      ['θ', 'Angle between vectors when placed tail-to-tail'],
    ],
    constants: ['Non-zero vectors a and b are PERPENDICULAR iff a · b = 0'],
    trap: 'The dot product a · b is a SCALAR number (never write i, j, k in the final dot product!), and projection onto b divides by |b| alone, not |b|²!',
    worked: {
      qHtml: 'Find p if vectors <b>a</b> = 3<b>i</b> − 2<b>j</b> and <b>b</b> = 4<b>i</b> + p<b>j</b> are perpendicular.',
      stepsHtml: ['Perpendicular ⇒ <b>a · b</b> = 0 → (3)(4) + (−2)(p) = 0', '12 − 2p = 0 → p = 6'],
      ansHtml: 'p = 6',
    },
    keywords: ['dot product', 'scalar product', 'perpendicular vectors', 'projection'],
  },
  {
    id: 'fmf-unit-vec',
    cat: 'vectors',
    name: 'Vector Modulus, Unit Vector & Direction Cosines',
    topicId: 'fm-vectors-2d',
    summary: 'Normalizes any non-zero vector r into a unit vector r̂ of length 1 and extracts its direction cosines.',
    rearrangements: [
      { solveFor: 'mod', label: 'Modulus |r|', exprHtml: '|<b>r</b>| = √(x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup>)' },
      { solveFor: 'unit', label: 'Unit Vector r̂', exprHtml: '<b>r̂</b> = <b>r</b> ÷ |<b>r</b>|' },
    ],
    variables: [
      ['x, y, z', 'Cartesian components along i, j, k'],
      ['cos α, cos β, cos γ', 'Direction cosines x/|r|, y/|r|, z/|r| satisfying cos²α + cos²β + cos²γ = 1'],
    ],
    trap: 'Position vector AB = OB − OA (Terminal MINUS Initial), never OA − OB!',
    worked: {
      qHtml: 'Find the modulus of <b>r</b> = 2<b>i</b> − 3<b>j</b> + 6<b>k</b>.',
      stepsHtml: ['|<b>r</b>| = √(2² + (−3)² + 6²) = √(4 + 9 + 36) = √49 = 7'],
      ansHtml: '7',
    },
    keywords: ['unit vector', 'modulus', 'direction cosines'],
  },
  {
    id: 'fmf-cross-prod',
    cat: 'vectors',
    name: '3D Vector (Cross) Product & Triangle/Parallelogram Area',
    topicId: 'fm-vectors-3d',
    summary: 'Produces a vector perpendicular to both a and b whose magnitude gives the area of the spanned parallelogram.',
    rearrangements: [
      { solveFor: 'mag', label: 'Cross Product Magnitude', exprHtml: '|<b>a × b</b>| = |<b>a</b>||<b>b</b>| sin θ' },
      { solveFor: 'area', label: 'Geometric Areas', exprHtml: 'Area<sub>∥gram</sub> = |<b>a × b</b>| &nbsp;·&nbsp; Area<sub>△</sub> = ½|<b>AB × AC</b>|' },
    ],
    variables: [
      ['a × b', '3×3 determinant with top row [i, j, k]; anti-commutative (b × a = −a × b)'],
      ['Area_△', 'Half the magnitude of the cross product of two adjacent side vectors'],
    ],
    trap: 'Remember the MINUS cofactor sign on the middle j component in the 3×3 determinant expansion, and divide by 2 for a triangle!',
    worked: {
      qHtml: 'If |<b>a</b>| = 5, |<b>b</b>| = 8, and the angle between them is 30°, find |<b>a × b</b>| and the triangle area.',
      stepsHtml: ['|<b>a × b</b>| = 5 × 8 × sin 30° = 40 × 0.5 = 20', 'Triangle area = ½ × 20 = 10 sq. units'],
      ansHtml: '|a × b| = 20, Area<sub>△</sub> = 10',
    },
    keywords: ['cross product', 'vector product', 'area of triangle'],
  },

  /* ─────────────── 4. STATICS, PROJECTILES & COLLISIONS (4) ─────────────── */
  {
    id: 'fmf-projectile',
    cat: 'mechanics',
    name: 'Projectile Time of Flight, Maximum Height & Horizontal Range',
    topicId: 'fm-kinematics-proj',
    summary: 'Gives flight duration, peak height, and level range for a particle projected at speed u and angle α above horizontal.',
    rearrangements: [
      { solveFor: 'T', label: 'Time of Flight T', exprHtml: 'T = (2u sin α) ÷ g' },
      { solveFor: 'H', label: 'Maximum Height H', exprHtml: 'H = (u<sup>2</sup> sin<sup>2</sup> α) ÷ (2g)' },
      { solveFor: 'R', label: 'Horizontal Range R', exprHtml: 'R = (u<sup>2</sup> sin 2α) ÷ g &nbsp;(R<sub>max</sub> = u<sup>2</sup>/g at α = 45°)' },
    ],
    variables: [
      ['u', 'Initial launch speed (m s⁻¹)'],
      ['α', 'Angle of projection above the horizontal'],
      ['g', 'Acceleration due to gravity (usually 10 m s⁻² in WAEC/JAMB)'],
    ],
    trap: 'Maximum height uses sin²α ÷ (2g), whereas Range uses sin(2α) ÷ g! Maximum range on level ground always occurs at α = 45°.',
    worked: {
      qHtml: 'A particle is projected at u = 30 m s<sup>−1</sup> at α = 30° to the horizontal (g = 10 m s<sup>−2</sup>). Find Maximum Height H.',
      stepsHtml: ['sin 30° = 0.5 → H = (30² × 0.5²) ÷ (2 × 10) = (900 × 0.25) ÷ 20 = 225 ÷ 20 = 11.25 m'],
      ansHtml: '11.25 m',
    },
    keywords: ['projectile', 'range', 'maximum height', 'time of flight'],
  },
  {
    id: 'fmf-lami',
    cat: 'mechanics',
    name: 'Lami’s Theorem & Inclined-Plane Limiting Friction',
    topicId: 'fm-statics-moments',
    summary: 'Balances three concurrent coplanar forces in static equilibrium and resolves forces on rough inclined planes.',
    rearrangements: [
      { solveFor: 'lami', label: 'Lami’s Theorem', exprHtml: 'P ÷ sin α = Q ÷ sin β = R ÷ sin γ' },
      { solveFor: 'incline', label: 'Rough Plane (Slope θ)', exprHtml: 'F<sub>max</sub> = μR = μmg cos θ &nbsp;·&nbsp; Downslope pull = mg sin θ' },
    ],
    variables: [
      ['P, Q, R', 'Three concurrent forces in equilibrium'],
      ['α, β, γ', 'Angles directly OPPOSITE forces P, Q, R (α + β + γ = 360°)'],
      ['μ', 'Coefficient of static friction (μ = tan λ at angle of friction)'],
    ],
    trap: 'On an incline of angle θ to the horizontal, normal reaction is R = mg cos θ (NOT mg!), and friction opposes the tendency of motion.',
    worked: {
      qHtml: 'A 5 kg block rests on a rough plane inclined at 30° to the horizontal with μ = 0.4 (g = 10 m s<sup>−2</sup>). Find normal reaction R.',
      stepsHtml: ['R = mg cos 30° = 5 × 10 × 0.866 = 43.3 N'],
      ansHtml: '25√3 N (≈ 43.3 N)',
    },
    keywords: ['lami', 'equilibrium', 'inclined plane', 'friction'],
  },
  {
    id: 'fmf-pulley',
    cat: 'mechanics',
    name: 'Connected Particles Over a Smooth Light Pulley (Atwood Machine)',
    topicId: 'fm-dynamics-momentum',
    summary: 'Computes common acceleration a and string tension T for masses m₁ > m₂ hanging vertically over a smooth pulley.',
    rearrangements: [
      { solveFor: 'a', label: 'Common Acceleration a', exprHtml: 'a = [(m<sub>1</sub> − m<sub>2</sub>) ÷ (m<sub>1</sub> + m<sub>2</sub>)] g' },
      { solveFor: 'T', label: 'String Tension T', exprHtml: 'T = [2m<sub>1</sub>m<sub>2</sub> ÷ (m<sub>1</sub> + m<sub>2</sub>)] g' },
    ],
    variables: [
      ['m<sub>1</sub>, m<sub>2</sub>', 'Heavier mass m₁ (moving down) and lighter mass m₂ (moving up) in kg'],
      ['T', 'Uniform tension throughout the light inextensible string (N)'],
    ],
    constants: ['Force exerted on the pulley axle = 2T'],
    trap: 'If asked for the thrust/reaction on the pulley support, it equals 2T (two downward string segments), NOT T and NOT (m₁ + m₂)g!',
    worked: {
      qHtml: 'Masses 6 kg and 4 kg hang over a smooth light pulley (g = 10 m s<sup>−2</sup>). Find the acceleration a and tension T.',
      stepsHtml: ['a = [(6 − 4) ÷ (6 + 4)] × 10 = (2/10) × 10 = 2 m s⁻²', 'T = [2(6)(4) ÷ 10] × 10 = 48 N'],
      ansHtml: 'a = 2 m s<sup>−2</sup>, T = 48 N',
    },
    keywords: ['pulley', 'connected particles', 'tension', 'acceleration'],
  },
  {
    id: 'fmf-restitution',
    cat: 'mechanics',
    name: 'Momentum Conservation & Newton’s Law of Restitution',
    topicId: 'fm-dynamics-momentum',
    summary: 'Pairs linear momentum conservation with coefficient of restitution e (0 ≤ e ≤ 1) to find post-collision velocities.',
    rearrangements: [
      { solveFor: 'mom', label: 'Conservation of Momentum', exprHtml: 'm<sub>1</sub>u<sub>1</sub> + m<sub>2</sub>u<sub>2</sub> = m<sub>1</sub>v<sub>1</sub> + m<sub>2</sub>v<sub>2</sub>' },
      { solveFor: 'nel', label: 'Newton’s Restitution Law', exprHtml: 'v<sub>2</sub> − v<sub>1</sub> = e(u<sub>1</sub> − u<sub>2</sub>)' },
      { solveFor: 'bounce', label: 'Bounce off Fixed Floor', exprHtml: 'v = eu &nbsp;·&nbsp; h<sub>1</sub> = e<sup>2</sup>h<sub>0</sub>' },
    ],
    variables: [
      ['u<sub>1</sub>, u<sub>2</sub>', 'Signed velocities BEFORE impact along line of centres'],
      ['v<sub>1</sub>, v<sub>2</sub>', 'Signed velocities AFTER impact'],
      ['e', 'Coefficient of restitution: e = 1 perfectly elastic; e = 0 perfectly inelastic (coalesce)'],
    ],
    trap: 'Velocities are VECTORS — assign positive to right and negative to left! If two spheres approach head-on, u₂ is NEGATIVE!',
    worked: {
      qHtml: 'A ball dropped from height h<sub>0</sub> = 16 m hits a horizontal floor with e = 0.75. Find the first rebound height h<sub>1</sub>.',
      stepsHtml: ['h₁ = e²h₀ = (3/4)² × 16 = (9/16) × 16 = 9 m'],
      ansHtml: '9 m',
    },
    keywords: ['restitution', 'collision', 'momentum', 'impulse'],
  },

  /* ─────────────── 5. COMBINATORICS, DISTRIBUTIONS & CORRELATION (4) ─────────────── */
  {
    id: 'fmf-perm-comb',
    cat: 'stats',
    name: 'Permutations, Circular Arrangements & Combinations',
    topicId: 'fm-perm-comb',
    summary: 'Counts ordered arrangements, circular seatings, repeated-letter words, and unordered selections.',
    rearrangements: [
      { solveFor: 'npr', label: 'Ordered Permutations', exprHtml: '<sup>n</sup>P<sub>r</sub> = n! ÷ (n − r)!' },
      { solveFor: 'ncr', label: 'Unordered Combinations', exprHtml: '<sup>n</sup>C<sub>r</sub> = n! ÷ [r!(n − r)!]' },
      { solveFor: 'circ', label: 'Circular & Repeated', exprHtml: 'Round Table = (n − 1)! &nbsp;·&nbsp; Repeats = n! ÷ (p!q!…)' },
    ],
    variables: [
      ['n', 'Total available distinct items (0! = 1)'],
      ['r', 'Number of items arranged or selected (0 ≤ r ≤ n)'],
    ],
    trap: 'Seating n people around a circular table has (n − 1)! ways; stringing n beads on a flippable necklace/ring has ½(n − 1)! ways!',
    worked: {
      qHtml: 'In how many ways can 6 committee members sit around a circular table?',
      stepsHtml: ['Circular arrangements = (6 − 1)! = 5! = 120 ways'],
      ansHtml: '120 ways',
    },
    keywords: ['permutation', 'combination', 'circular', 'factorial'],
  },
  {
    id: 'fmf-binom-dist',
    cat: 'stats',
    name: 'Binomial Probability Distribution B(n, p)',
    topicId: 'fm-prob-distributions',
    summary: 'Models the probability, mean, and variance of x successes in n independent Bernoulli trials.',
    rearrangements: [
      { solveFor: 'prob', label: 'P(X = x)', exprHtml: 'P(X = x) = <sup>n</sup>C<sub>x</sub> p<sup>x</sup> q<sup>n−x</sup> &nbsp;(q = 1 − p)' },
      { solveFor: 'mean-var', label: 'Mean & Variance', exprHtml: 'μ = E(X) = np &nbsp;·&nbsp; σ<sup>2</sup> = Var(X) = npq' },
    ],
    variables: [
      ['n', 'Fixed number of independent trials'],
      ['p, q', 'Probability of success p and failure q = 1 − p on each trial'],
    ],
    trap: 'Notice Var(X) = npq is ALWAYS smaller than Mean np (since 0 < q < 1); divide Var(X) by E(X) to find q = 1 − p instantly!',
    worked: {
      qHtml: 'A binomial variable X ~ B(n, p) has mean 6 and variance 4.2. Find p and n.',
      stepsHtml: ['q = Var(X) ÷ E(X) = 4.2 ÷ 6 = 0.7 → p = 1 − 0.7 = 0.3', 'np = 6 → 0.3n = 6 → n = 20'],
      ansHtml: 'p = 0.3, n = 20',
    },
    keywords: ['binomial distribution', 'bernoulli', 'npq'],
  },
  {
    id: 'fmf-poisson',
    cat: 'stats',
    name: 'Poisson Probability Distribution Po(λ)',
    topicId: 'fm-prob-distributions',
    summary: 'Models rare random events occurring at average rate λ per interval (or approximates B(n, p) when n is large and p small).',
    rearrangements: [
      { solveFor: 'prob', label: 'Poisson Mass Function', exprHtml: 'P(X = x) = (e<sup>−λ</sup> λ<sup>x</sup>) ÷ x! &nbsp;(x = 0, 1, 2, …)' },
      { solveFor: 'moments', label: 'Mean = Variance Property', exprHtml: 'E(X) = λ &nbsp;·&nbsp; Var(X) = λ &nbsp;(λ = np)' },
    ],
    variables: [
      ['λ', 'Mean number of occurrences per unit interval'],
      ['e', 'Euler’s constant ≈ 2.71828'],
    ],
    trap: 'In a Poisson distribution, Mean EQUALS Variance (E(X) = Var(X) = λ), and for x = 0, P(X = 0) = e⁻λ (since 0! = 1)!',
    worked: {
      qHtml: 'Calls arrive at a switchboard following a Poisson process with mean λ = 2 per minute. Find P(X = 0) in terms of e.',
      stepsHtml: ['P(X = 0) = (e⁻² × 2⁰) ÷ 0! = e⁻²'],
      ansHtml: 'e<sup>−2</sup> (≈ 0.1353)',
    },
    keywords: ['poisson', 'lambda', 'rare events'],
  },
  {
    id: 'fmf-spearman',
    cat: 'stats',
    name: 'Spearman’s Rank Correlation Coefficient',
    topicId: 'fm-corr-linprog',
    summary: 'Measures monotonic association (−1 ≤ r_s ≤ +1) between two sets of paired rankings across n items.',
    rearrangements: [
      { solveFor: 'rs', label: 'Spearman’s Formula', exprHtml: 'r<sub>s</sub> = 1 − [6∑d<sup>2</sup> ÷ (n(n<sup>2</sup> − 1))]' },
      { solveFor: 'sumd2', label: 'Solve for ∑d²', exprHtml: '∑d<sup>2</sup> = [(1 − r<sub>s</sub>) n(n<sup>2</sup> − 1)] ÷ 6' },
    ],
    variables: [
      ['d', 'Difference in paired ranks (R_x − R_y) for each item; ∑d = 0 always'],
      ['n', 'Number of paired observations'],
      ['r<sub>s</sub>', 'Coefficient from −1 (perfect inverse rank) through 0 to +1 (identical rank)'],
    ],
    trap: 'Subtract the fraction [6∑d² ÷ n(n² − 1)] AFTER 1 — never compute (1 − 6∑d²) first!',
    worked: {
      qHtml: 'For n = 5 candidates, the sum of squared rank differences between two judges is ∑d<sup>2</sup> = 4. Find r<sub>s</sub>.',
      stepsHtml: ['n(n² − 1) = 5(24) = 120', 'r<sub>s</sub> = 1 − (6 × 4) ÷ 120 = 1 − 24/120 = 1 − 0.2 = 0.8'],
      ansHtml: '0.8',
    },
    keywords: ['spearman', 'rank correlation', 'regression'],
  },
];
