import type {
  Beat,
  IdeaBeat,
  InteractiveLesson,
  TeachBeat,
  TeachBlock,
  Topic,
} from '../types';
import { perm } from '../utils/engine';
import { FMATH_TOPICS_PART1 } from './fmathTopicsPart1';
import { FMATH_TOPICS_PART2 } from './fmathTopicsPart2';
import { FMATH_TOPICS_PART3 } from './fmathTopicsPart3';

interface FMathTableSpec {
  title: string;
  headers: string[];
  rows: string[][];
}

const FMATH_TEACH_TABLES: Record<string, FMathTableSpec> = {
  'fm-sets-logic': {
    title: 'Power Sets, De Morgan’s Laws & Conditional Logic Matrix',
    headers: ['Concept / Connective', 'Mathematical Identity / Rule', 'WAEC & JAMB Watchout'],
    rows: [
      ['Power Set P(A)', 'n(P(A)) = 2ⁿ · Proper subsets = 2ⁿ − 1', 'Non-empty proper subsets = 2ⁿ − 2 (exclude ∅ and A)'],
      ['3-Set Inclusion–Exclusion', 'n(A∪B∪C) = ∑n(A) − ∑n(A∩B) + n(A∩B∩C)', 'Always populate the central triple overlap FIRST'],
      ['Implication (p ⇒ q)', 'False ONLY when p is True and q is False', 'Equivalent to (~p ∨ q); negation is (p ∧ ~q)'],
      ['Contrapositive (~q ⇒ ~p)', 'Logically equivalent to (p ⇒ q)', 'Converse (q ⇒ p) is NOT equivalent to (p ⇒ q)!'],
    ],
  },
  'fm-binary-ops': {
    title: 'Structural Axioms of Binary Operations on a Set S',
    headers: ['Axiom', 'Defining Condition (∀ a, b, c ∈ S)', 'Exam Solver Strategy'],
    rows: [
      ['Closure', 'a ∗ b ∈ S for every pair in S', 'Test zero/fractions/negatives to spot counterexamples'],
      ['Commutative & Associative', 'a ∗ b = b ∗ a · (a ∗ b) ∗ c = a ∗ (b ∗ c)', 'Symmetric Cayley table ⇔ Commutative'],
      ['Identity Element (e)', 'a ∗ e = e ∗ a = a', 'e must be a single constant independent of a and inside S'],
      ['Inverse Element (a⁻¹)', 'a ∗ a⁻¹ = a⁻¹ ∗ a = e', 'Find e FIRST; values making denominator 0 have no inverse'],
    ],
  },
  'fm-indices-surds-logs': {
    title: 'Exponential Substitutions, Nested Surds & Logarithm Base Rules',
    headers: ['Technique', 'Core Identity', 'Domain / Sign Guardrail'],
    rows: [
      ['Quadratic Indicials', 'Set u = a^x in A·a^(2x) + B·a^x + C = 0', 'Strictly enforce u = a^x > 0 (reject negative u roots!)'],
      ['Square Root of Surd', '√(a ± 2√b) = √x ± √y where x+y=a, xy=b', 'Keep x > y > 0 so √x − √y ≥ 0'],
      ['Change of Base', 'log_a(b) = log_c(b)/log_c(a) · log_a(b)=1/log_b(a)', 'Converts mixed-base equations into clean quadratics'],
      ['Log Domain Audit', 'log_b(M) requires M > 0, b > 0, b ≠ 1', 'Test all roots in the ORIGINAL unmerged log terms!'],
    ],
  },
  'fm-functions-mappings': {
    title: 'Mapping Classifications, Composite Order & Inverse Domain Rule',
    headers: ['Concept', 'Condition / Formula', 'Key Graphical / Algebraic Test'],
    rows: [
      ['Injective (One-to-One)', 'f(x₁) = f(x₂) ⇒ x₁ = x₂', 'Horizontal line cuts y = f(x) at most ONCE'],
      ['Surjective (Onto) & Bijective', 'Range(f) = Codomain · Bijective = 1-1 + Onto', 'f⁻¹ exists as a function iff f is BIJECTIVE'],
      ['Composite fg(x)', 'fg(x) = f(g(x)) (inner g acts FIRST)', 'Generally fg ≠ gf; (fg)⁻¹ = g⁻¹f⁻¹'],
      ['Rational Inverse', 'Solve y = f(x) for x, then swap x ↔ y', 'Domain(f⁻¹) = Range(f) and Range(f⁻¹) = Domain(f)'],
    ],
  },
  'fm-sequences-series': {
    title: 'AP, GP, Convergent Infinite Series & Sigma Formulas',
    headers: ['Series / Tool', 'Exact Formula', 'Convergence / Exam Trap'],
    rows: [
      ['Recover Tₙ from Sₙ', 'T₁ = S₁ and Tₙ = Sₙ − Sₙ₋₁ (n ≥ 2)', 'Works for ANY sequence — never assume AP blindly'],
      ['AM vs GM (x, y > 0)', 'AM = (x + y)/2 · GM = √(xy)', 'AM ≥ GM always, with equality iff x = y'],
      ['Infinite GP (S∞)', 'S∞ = a ÷ (1 − r)', 'Converges STRICTLY when |r| < 1 (−1 < r < 1)'],
      ['Sigma Sums ∑₁ⁿ', '∑1 = n · ∑r = ½n(n+1) · ∑r² = ⅙n(n+1)(2n+1)', 'Split linear combinations before substituting'],
    ],
  },
  'fm-quadratics-roots': {
    title: 'Vieta’s Root Identities & Discriminant Geometry (ax² + bx + c = 0)',
    headers: ['Relationship', 'Algebraic Identity', 'Geometric / Sign Meaning'],
    rows: [
      ['Sum & Product', 'α + β = −b/a · αβ = c/a', 'Watch the minus sign on −b/a and divide by a!'],
      ['Squares & Cubes', 'α²+β² = (α+β)²−2αβ · α³+β³ = (α+β)³−3αβ(α+β)', '(α − β)² = (α + β)² − 4αβ'],
      ['New Quadratic', 'x² − (New Sum)x + (New Product) = 0', 'Multiply through by LCD for integer coefficients'],
      ['Discriminant Δ = b²−4ac', 'Δ > 0 (2 real) · Δ = 0 (tangent) · Δ < 0 (no real)', 'Positive definite (> 0 ∀x) iff a > 0 AND Δ < 0'],
    ],
  },
  'fm-polynomials': {
    title: 'Euclidean Polynomial Division, Remainder/Factor Theorems & Cubic Vieta',
    headers: ['Theorem / Case', 'Exact Statement', 'Crucial Exam Watchout'],
    rows: [
      ['Division Identity', 'P(x) ≡ D(x)Q(x) + R(x), deg(R) < deg(D)', 'Quadratic divisor ⇒ linear remainder R(x) = px + q!'],
      ['Remainder Theorem', 'P(x) ÷ (ax − b) leaves remainder R = P(b/a)', 'Dividing by (x + k) substitutes x = −k, NOT +k'],
      ['Factor Theorem', '(x − a) is a factor of P(x) ⇔ P(a) = 0', 'Test factors of constant term first on cubics'],
      ['Cubic Roots α, β, γ', '∑α = −b/a · ∑αβ = c/a · αβγ = −d/a', 'Signs alternate: (−, +, −) across degree-3 Vieta'],
    ],
  },
  'fm-inequalities-abs': {
    title: 'Quadratic, Rational & Modulus Inequality Solution Rules',
    headers: ['Inequality Type', 'Standard Form', 'Valid Solution Method'],
    rows: [
      ['Factored Quadratic', '(x − α)(x − β) < 0 vs > 0 (α < β)', '< 0 gives α < x < β; > 0 gives x < α or x > β'],
      ['Rational Fraction', 'P(x) / Q(x) ≤ k', 'Subtract k to ONE fraction (or × Q²); NEVER include Q(x)=0!'],
      ['Bounded Modulus', '|u| < a (a > 0)', '−a < u < a (single connected interval)'],
      ['Outer / Two-Sided Modulus', '|u| > a · |A| < |B|', 'u < −a or u > a · Square |A|² < |B|² ⇒ (A−B)(A+B) < 0'],
    ],
  },
  'fm-coord-lines': {
    title: 'Straight-Line Ratios, Intersection Angle & Perpendicular Distance',
    headers: ['Geometric Quantity', 'Coordinate Formula', 'Key Trap to Avoid'],
    rows: [
      ['Internal Section (m : n)', '((mx₂ + nx₁)/(m+n), (my₂ + ny₁)/(m+n))', 'Cross-multiply weights: m hits (x₂,y₂), n hits (x₁,y₁)!'],
      ['Parallel & Perpendicular', 'Parallel: m₁ = m₂ · Perpendicular: m₁m₂ = −1', 'Perpendicular to Ax + By + C = 0 has form Bx − Ay + k = 0'],
      ['Acute Angle θ', 'tan θ = |(m₁ − m₂) ÷ (1 + m₁m₂)|', 'Modulus bars guarantee the ACUTE angle (0° ≤ θ < 90°)'],
      ['Point-to-Line Distance', 'd = |Ax₀ + By₀ + C| ÷ √(A² + B²)', 'Write line as Ax + By + C = 0 before reading A, B, C'],
    ],
  },
  'fm-vectors-2d': {
    title: '2D Vector Algebra, Scalar Product & Component Projections',
    headers: ['Vector Operation', 'Formula', 'Output Type & Interpretation'],
    rows: [
      ['Displacement & Unit Vector', 'AB = b − a · r̂ = r ÷ |r|', 'Head minus tail; |r̂| = 1 always'],
      ['Scalar (Dot) Product', 'a · b = a₁b₁ + a₂b₂ = |a||b| cos θ', 'Pure SCALAR: >0 acute, 0 perpendicular, <0 obtuse'],
      ['Orthogonality Test', 'a ⊥ b ⇔ a · b = 0 (non-zero vectors)', 'Fastest perpendicularity check in 2D and 3D'],
      ['Scalar Projection of a on b', 'Proj_b(a) = (a · b) ÷ |b|', 'Divide by |b| (the target direction), NEVER |a|!'],
    ],
  },
  'fm-trig-compound': {
    title: 'Radians, Compound/Double Angles & Harmonic R-Form',
    headers: ['Family', 'Key Identities', 'Exam Application'],
    rows: [
      ['Radian Sector', 's = rθ · A = ½r²θ = ½rs', 'θ MUST be in radians (π rad = 180°)'],
      ['Compound Angles', 'sin(A±B)=sinAcosB±cosAsinB · cos(A±B)=cosAcosB∓sinAsinB', 'Notice cosine flips the ± sign to ∓!'],
      ['Double Angle cos 2A', 'cos²A − sin²A = 2cos²A − 1 = 1 − 2sin²A', 'Rearranges to cos²A = ½(1+cos2A) for calculus'],
      ['Harmonic R-Form', 'a cos θ + b sin θ = R cos(θ − α), R = √(a² + b²)', 'Instant Max = +R and Min = −R'],
    ],
  },
  'fm-binomial': {
    title: 'Finite vs Infinite Binomial Expansions',
    headers: ['Index Type', 'Expansion / General Term', 'Convergence & Factoring Rule'],
    rows: [
      ['Positive Integer n ∈ ℕ', 'T_{r+1} = ⁿCᵣ aⁿ⁻ʳ bʳ (n + 1 finite terms)', 'Constant term ⇔ net power of x equals 0'],
      ['Negative / Fractional n', '(1 + u)ⁿ = 1 + nu + n(n−1)u²/2! + …', 'Infinite series valid STRICTLY for |u| < 1'],
      ['Non-Unit Leading (a + bx)ⁿ', 'Factor out aⁿ: aⁿ[1 + (b/a)x]ⁿ', 'Valid strictly for |x| < |a / b|'],
      ['Product / Partial Series', 'Expand each factor, then multiply up to xᵏ', 'Overall validity = intersection (smallest |x| bound)'],
    ],
  },
  'fm-perm-comb': {
    title: 'Counting Toolkit: Permutations vs Combinations',
    headers: ['Scenario', 'Counting Formula', 'Order & Restriction Logic'],
    rows: [
      ['Linear Permutations', 'ⁿPᵣ = n! / (n − r)!', 'ORDER MATTERS (codes, ranks, seating in a row)'],
      ['Repeated Letters', 'n! ÷ (p! q! …)', 'Divide by factorials of all repeated letter counts'],
      ['Circular Table', '(n − 1)! ways (necklace = ½(n − 1)!)', 'Fix 1 person as reference to eliminate rotations'],
      ['Committee Combinations', 'ⁿCᵣ = n! / [r!(n − r)!]', 'ORDER IGNORED; split "at least" into disjoint cases'],
    ],
  },
  'fm-coord-circle': {
    title: 'Circle Equations, Tangents & Orthogonal Intersection',
    headers: ['Form / Property', 'Equation / Formula', 'Critical Step'],
    rows: [
      ['General Circle', 'x² + y² + 2gx + 2fy + c = 0', 'Divide out leading coefficient of x², y² FIRST!'],
      ['Centre & Radius', 'C = (−g, −f) · r = √(g² + f² − c)', 'Requires g² + f² − c > 0 for a real circle'],
      ['Tangent & Length L', 'xx₁+yy₁+g(x+x₁)+f(y+y₁)+c=0 · L = √S₁', 'Normal at any point passes straight through (−g, −f)'],
      ['Orthogonal Circles', '2g₁g₂ + 2f₁f₂ = c₁ + c₂', 'Radii meet at 90° (r₁² + r₂² = d²)'],
    ],
  },
  'fm-limits-diff': {
    title: 'Indeterminate Limits & First-Principles Derivatives',
    headers: ['Problem Type', 'Resolution Strategy', 'Result / Watchout'],
    rows: [
      ['0/0 Rational Limit', 'Factorize & cancel common (x − a) factor', 'Substitute x = a immediately after cancelling'],
      ['0/0 Surd Limit', 'Multiply top & bottom by conjugate surd', 'Clears square-root difference cleanly'],
      ['Radian Trig & x → ∞', 'lim_{x→0} (sin kx)/x = k · Divide ∞/∞ by highest xⁿ', 'Angle x MUST be in radians for sin x / x → 1'],
      ['First Principles', 'f′(x) = lim_{h→0} [f(x+h) − f(x)] / h', 'Convert surds/reciprocals to xⁿ before power rule'],
    ],
  },
  'fm-diff-rules': {
    title: 'Differentiation Rules Master Sheet',
    headers: ['Rule', 'Derivative Formula', 'Sign / Order Reminder'],
    rows: [
      ['Product & Quotient', '(uv)′ = uv′ + vu′ · (u/v)′ = (vu′ − uv′)/v²', 'Quotient numerator MUST start with v u′!'],
      ['Chain Rule', 'dy/dx = (dy/du)(du/dx) ⇒ d/dx[uⁿ] = nuⁿ⁻¹u′', 'Multiply by inner derivative u′(x) every time'],
      ['Trig, Exp & Log', '(sin u)′=u′cos u · (cos u)′=−u′sin u · (ln u)′=u′/u', 'Cosine, cotangent, and cosecant carry MINUS signs'],
      ['Implicit & Parametric', 'd/dx(yⁿ) = nyⁿ⁻¹(dy/dx) · dy/dx = (dy/dt)/(dx/dt)', 'Use Product Rule on xy → x(dy/dx) + y!'],
    ],
  },
  'fm-diff-apps': {
    title: 'Stationary Point Classification, Optimization & Rates',
    headers: ['Application', 'Calculus Condition', 'Interpretation'],
    rows: [
      ['Tangent & Normal', 'm_T = dy/dx · m_N = −1 / m_T', 'Horizontal tangent: dy/dx = 0'],
      ['Local Maximum', 'dy/dx = 0 and d²y/dx² < 0', 'Gradient changes + → 0 → − across peak'],
      ['Local Minimum', 'dy/dx = 0 and d²y/dx² > 0', 'Gradient changes − → 0 → + across trough'],
      ['Connected Rates', 'dV/dt = (dV/dr) × (dr/dt) · δy ≈ (dy/dx)δx', 'Deflation/leaking rates carry a NEGATIVE sign'],
    ],
  },
  'fm-vectors-3d': {
    title: '3D Vector Cross Product, Areas & Coplanarity',
    headers: ['3D Concept', 'Vector Formula', 'Geometric Meaning'],
    rows: [
      ['Direction Cosines', 'cos α = x/|r|, cos β = y/|r|, cos γ = z/|r|', 'cos²α + cos²β + cos²γ = 1 always'],
      ['Cross Product a × b', '3×3 determinant [i, j, k; a₁,a₂,a₃; b₁,b₂,b₃]', 'Vector ⊥ to both a & b; anti-commutative (b×a = −a×b)'],
      ['Parallelogram & Triangle', 'Area_∥ = |a × b| · Area_△ = ½|AB × AC|', 'Remember the ½ factor for triangles!'],
      ['Coplanarity Test', 'a · (b × c) = 0', 'Zero parallelepiped volume ⇒ all 3 vectors lie in 1 plane'],
    ],
  },
  'fm-kinematics-proj': {
    title: 'Variable-Acceleration Calculus vs 2D Projectile Motion',
    headers: ['Motion Regime', 'Governing Equations', 'Exam Trap'],
    rows: [
      ['Variable Acceleration', 'v = ds/dt · a = dv/dt = v(dv/ds)', 'NEVER use suvat when a depends on t!'],
      ['Instantaneous Rest', 'v(t) = 0', 'Split integral at v = 0 to find total distance'],
      ['Projectile Time & Height', 'T = 2u sin α / g · H = u² sin²α / (2g)', 'At highest point, speed = u cos α (NOT zero!)'],
      ['Horizontal Range', 'R = u² sin 2α / g (R_max = u²/g at 45°)', 'Angles α and (90° − α) give identical level range'],
    ],
  },
  'fm-prob-distributions': {
    title: 'Discrete RV, Binomial B(n, p) & Poisson Po(λ) Comparison',
    headers: ['Distribution', 'Probability Formula', 'Mean & Variance'],
    rows: [
      ['Conditional & Indep.', 'P(A|B) = P(A∩B)/P(B) · Indep: P(A∩B)=P(A)P(B)', 'Mutually exclusive ≠ Independent!'],
      ['General Discrete RV', '∑ p(x) = 1', 'E(X) = ∑xp(x) · Var(X) = E(X²) − [E(X)]²'],
      ['Binomial B(n, p)', 'P(X = x) = ⁿCₓ pˣ qⁿ⁻ˣ', 'Mean = np · Variance = npq (< Mean)'],
      ['Poisson Po(λ)', 'P(X = x) = e⁻λ λˣ / x! (0! = 1)', 'Mean = λ · Variance = λ (Mean EQUALS Variance!)'],
    ],
  },
  'fm-matrices-det': {
    title: 'Determinants, Adjoint Inverses & Cramer’s Rule',
    headers: ['Matrix Tool', 'Exact Rule', 'Crucial Watchout'],
    rows: [
      ['Conformable Product AB', '(m × n)(n × p) = (m × p)', 'AB ≠ BA; (AB)⁻¹ = B⁻¹A⁻¹; det(AB) = det(A)det(B)'],
      ['Singular Matrix', 'det(A) = 0 ⇔ No inverse exists', 'det(kA) = kⁿ det(A) for an n × n matrix!'],
      ['Adjoint Inverse', 'A⁻¹ = (1/|A|) adj(A) where adj(A) = Cᵀ', 'Remember cofactor signs (+,−,+) AND transposing C!'],
      ['Cramer & Area Factor', 'x = Δ_x/Δ, y = Δ_y/Δ · Area_img = |det M|·Area_obj', 'Pre-multiply X = A⁻¹B on the LEFT'],
    ],
  },
  'fm-partial-fractions': {
    title: 'Partial Fraction Decomposition Master Templates',
    headers: ['Denominator Factor Type', 'Required Partial Fraction Form', 'Mandatory Pre-Check'],
    rows: [
      ['Improper (deg N ≥ deg D)', 'Q(x) + R(x)/D(x) via long division FIRST', 'Equal degrees deg N = deg D IS improper!'],
      ['Distinct Linear (x−a)(x−b)', 'A/(x − a) + B/(x − b)', 'Fast Heaviside cover-up gives A and B in seconds'],
      ['Repeated Linear (x − a)²', 'A/(x − a) + B/(x − a)²', 'Include EVERY power from 1 up to multiplicity'],
      ['Irreducible (x² + bx + c)', '(Bx + C) / (x² + bx + c)', 'Linear numerator Bx + C when b² − 4c < 0'],
    ],
  },
  'fm-complex-numbers': {
    title: 'Complex Algebra, Polar Argand Form & De Moivre',
    headers: ['Operation / Concept', 'Formula', 'Quadrant / Sign Trap'],
    rows: [
      ['Conjugate Division', '(a+bi)/(c+di) = (a+bi)(c−di) ÷ (c² + d²)', 'Denominator is c² PLUS d² (since −i² = +1)!'],
      ['Modulus & Argument', 'r = √(x² + y²) · tan α = |y/x|', 'Plot (x, y) to adjust θ for Q2 (π−α) & Q3 (−π+α)'],
      ['Polar Product/Quotient', 'z₁z₂: multiply r₁r₂, ADD θ₁ + θ₂', 'z₁/z₂: divide r₁/r₂, SUBTRACT θ₁ − θ₂'],
      ['De Moivre’s Theorem', '[r(cos θ + i sin θ)]ⁿ = rⁿ(cos nθ + i sin nθ)', 'Real-poly complex roots come in conjugate pairs'],
    ],
  },
  'fm-conic-sections': {
    title: 'Standard Conic Sections Reference Chart',
    headers: ['Conic', 'Canonical Equation & Eccentricity', 'Focus, Directrix & Key Feature'],
    rows: [
      ['Parabola', 'y² = 4ax (e = 1)', 'Focus (a, 0) · Directrix x = −a · Latus rectum = 4a'],
      ['Ellipse (a > b)', 'x²/a² + y²/b² = 1 (0 < e < 1, b²=a²(1−e²))', 'Foci (±ae, 0) · Directrices x = ±a/e · Major = 2a'],
      ['Hyperbola', 'x²/a² − y²/b² = 1 (e > 1, b²=a²(e²−1))', 'Foci (±ae, 0) · Asymptotes y = ±(b/a)x'],
      ['Rectangular Hyperbola', 'x² − y² = a² or xy = c² (e = √2)', 'Perpendicular asymptotes (a = b)'],
    ],
  },
  'fm-integration': {
    title: 'Integration Strategy & Technique Selector',
    headers: ['Integrand Pattern', 'Method & Antiderivative', 'Trap to Avoid'],
    rows: [
      ['f′(x) / f(x)', 'Logarithmic recognition → ln|f(x)| + C', 'Adjust constant scalar factor carefully'],
      ['sin²x or cos²x', 'Double-angle: ½(1 ∓ cos 2x)', 'NEVER integrate sin²x as sin³x / 3!'],
      ['Product x·e^x, x·cos x, ln x', 'Integration by Parts: uv − ∫v du (LIATE)', 'Pick u = ln x when logarithm is present!'],
      ['Rational P(x)/Q(x)', 'Partial fractions → sum of logs / powers', 'Change limits whenever substituting u = g(x)'],
    ],
  },
  'fm-integration-apps': {
    title: 'Definite Integral Geometry & Trapezoidal Approximation',
    headers: ['Quantity', 'Integral / Numerical Formula', 'Critical Detail'],
    rows: [
      ['Total Area with x-Axis', '∑ |∫ y dx| split at x-intercepts', 'Loops below x-axis integrate negative — take |…|!'],
      ['Area Between Curves', '∫_a^b (y_upper − y_lower) dx', 'Solve y₁ = y₂ first for limits a and b'],
      ['Solid of Revolution (360°)', 'V_x = π ∫_a^b y² dx · V_y = π ∫_c^d x² dy', 'Include π AND square y² (washer: y_out² − y_in²)'],
      ['Trapezoidal Rule', '(h/2)[(y₀ + yₙ) + 2(y₁ + … + y_{n−1})]', 'h = (b − a)/n where n = strips = (ordinates − 1)'],
    ],
  },
  'fm-ode': {
    title: 'Differential Equations Classification & Exponential Laws',
    headers: ['Concept / Model', 'Equation & Solution', 'Exam Check'],
    rows: [
      ['Order vs Degree', 'Order = highest derivative; Degree = its power', '(dy/dx)⁴ + d²y/dx² = 0 is Order 2, Degree 1!'],
      ['Separable 1st-Order', 'dy/dx = f(x)g(y) ⇒ ∫ dy/g(y) = ∫ f(x) dx + C', 'Substitute initial (x₀, y₀) to find particular C'],
      ['Natural Growth / Decay', 'dN/dt = ±kN ⇒ N = N₀ e^(±kt)', 'Half-life / Doubling time = (ln 2) ÷ k'],
      ['Newton’s Cooling', 'dθ/dt = −k(θ − θ_s) ⇒ θ = θ_s + (θ₀−θ_s)e^(−kt)', 'Excess temperature (θ − θ_s) decays exponentially'],
    ],
  },
  'fm-statics-moments': {
    title: 'Coplanar Equilibrium, Friction & Rigid-Body Moments',
    headers: ['Principle', 'Governing Equation', 'Physical Direction Rule'],
    rows: [
      ['3-Force Equilibrium', 'Lami: P/sin α = Q/sin β = R/sin γ', 'Angles α, β, γ are opposite forces (sum = 360°)'],
      ['Rough Incline (angle θ)', 'R = mg cos θ · F_max = μmg cos θ', 'Friction opposes motion (flips sign up vs down!)'],
      ['Principle of Moments', '∑ Clockwise = ∑ Anticlockwise about any point', 'Take moments about unknown support reaction!'],
      ['Point of Tilting', 'Normal reaction at lifted support = 0', 'Entire weight & load carried by the pivot support'],
    ],
  },
  'fm-dynamics-momentum': {
    title: 'Connected Pulleys, Impulse & Restitution Collisions',
    headers: ['System', 'Core Formula', 'Sign / Vector Watchout'],
    rows: [
      ['Atwood Pulley (m₁ > m₂)', 'a = (m₁−m₂)g/(m₁+m₂) · T = 2m₁m₂g/(m₁+m₂)', 'Thrust on vertical pulley axle = 2T'],
      ['Impulse–Momentum', 'I = Ft = m(v − u)', 'Rebound reverses velocity sign: v = −speed!'],
      ['Linear Momentum', 'm₁u₁ + m₂u₂ = m₁v₁ + m₂v₂', 'Assign + right, − left before substituting'],
      ['Newton’s Restitution', 'v₂ − v₁ = e(u₁ − u₂) (0 ≤ e ≤ 1)', 'Floor bounce: v = eu and rebound height h₁ = e²h₀'],
    ],
  },
  'fm-corr-linprog': {
    title: 'Correlation, Regression, Moving Averages & LP',
    headers: ['Method', 'Formula / Procedure', 'Interpretation & Trap'],
    rows: [
      ['Spearman’s Rank r_s', 'r_s = 1 − 6∑d² / [n(n² − 1)]', 'Average tied ranks; −1 ≤ r_s ≤ +1'],
      ['y-on-x Regression', 'y − ȳ = b(x − x̄), b = S_xy / S_xx', 'Always passes through centroid (x̄, ȳ)'],
      ['k-Point Moving Average', 'Mean of sliding window of k consecutive terms', 'Smooths seasonal swings to expose trend'],
      ['Linear Programming', 'Evaluate Z = ax + by at feasible vertices', 'Optimal Z occurs at a corner point of feasible polygon'],
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

function buildInteractiveForFMathTopic(topic: Topic): InteractiveLesson {
  const tableSpec = FMATH_TEACH_TABLES[topic.id];

  return {
    title: topic.name,
    goals: topic.goals,
    trap: topic.trap,
    parts: topic.parts.map((part, pIdx) => {
      const beats: Beat[] = [];

      const ideaBeat: IdeaBeat = {
        k: 'idea',
        kl: `Chapter ${pIdx + 1} · Core Theorem`,
        title: part.title,
        idea: part.idea,
        g: part.g,
        cap: part.cap,
        rules: part.rules,
        rh: 'Essential Theorems, Identities & Exam Rules',
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
        kl: 'Worked Mathematical Derivation',
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
          kl: 'Spot the Algebraic Trap',
          title: `Audit ${topic.spot.who}’s Working`,
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
          ? `Exact! ${part.tryit.e}`
          : `Check the step-by-step derivation: ${part.tryit.e}`
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

export function buildFMathCurriculum(): {
  topics: Topic[];
  il: Record<string, InteractiveLesson>;
} {
  const rawTopics: Topic[] = [
    ...FMATH_TOPICS_PART1,
    ...FMATH_TOPICS_PART2,
    ...FMATH_TOPICS_PART3,
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
    il[t.id] = buildInteractiveForFMathTopic(t);
  }

  return { topics, il };
}
