import type { FormulaRearrangement } from './chemFormulas';

export type EconFormulaCatId =
  | 'demand'
  | 'production'
  | 'stats'
  | 'macro'
  | 'trade';

export interface EconFormulaCategory {
  id: EconFormulaCatId | 'all';
  label: string;
  shortLabel: string;
  desc: string;
}

export interface EconFormulaItem {
  id: string;
  cat: EconFormulaCatId;
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

export const ECON_FORMULA_CATEGORIES: EconFormulaCategory[] = [
  {
    id: 'all',
    label: 'All Economics Formulas',
    shortLabel: 'All',
    desc: 'All 24 NERDC, WAEC & JAMB quantitative Economics equations across elasticity, firm costs, statistics, national income & trade',
  },
  {
    id: 'demand',
    label: 'Demand, Supply, Utility & Elasticity',
    shortLabel: 'Demand & Elasticity',
    desc: 'Price, income & cross elasticity, equi-marginal utility, and linear market equilibrium',
  },
  {
    id: 'production',
    label: 'Production, Cost, Revenue & Profit',
    shortLabel: 'Costs & Profit',
    desc: 'TP/AP/MP, TFC/TVC/TC, AFC/AVC/ATC/MC, TR/AR/MR, economic profit & break-even output',
  },
  {
    id: 'stats',
    label: 'Economic Statistics & Index Numbers',
    shortLabel: 'Statistics & CPI',
    desc: 'Grouped mean, variance & standard deviation, pie-chart sector angles, price index & inflation rate',
  },
  {
    id: 'macro',
    label: 'National Income, Multiplier & Money',
    shortLabel: 'Macro & Money',
    desc: 'GDP expenditure, GNP/NNP, MPC & MPS, Keynesian multiplier, Quantity Theory MV = PT & bank credit creation',
  },
  {
    id: 'trade',
    label: 'Population & International Trade',
    shortLabel: 'Pop & Trade',
    desc: 'Net population change, dependency ratio, income per capita, Terms of Trade & Balance of Trade',
  },
];

export const ECON_FORMULAS: EconFormulaItem[] = [
  /* ─────────────── 1. DEMAND, UTILITY & ELASTICITY (6) ─────────────── */
  {
    id: 'efm-ped',
    cat: 'demand',
    name: 'Coefficient of Price Elasticity of Demand (Percentage Method)',
    topicId: 'ec-elasticity',
    summary: 'Measures the responsiveness of quantity demanded to a percentage change in the commodity’s own price.',
    rearrangements: [
      { solveFor: 'Ed', label: 'Solve for E_d', exprHtml: 'E<sub>d</sub> = (%ΔQ<sub>d</sub>) ÷ (%ΔP)' },
      { solveFor: '%ΔQd', label: 'Solve for %ΔQ_d', exprHtml: '%ΔQ<sub>d</sub> = E<sub>d</sub> × (%ΔP)' },
      { solveFor: '%ΔP', label: 'Solve for %ΔP', exprHtml: '%ΔP = (%ΔQ<sub>d</sub>) ÷ E<sub>d</sub>' },
    ],
    variables: [
      ['E<sub>d</sub>', 'Coefficient of price elasticity of demand (dimensionless magnitude)'],
      ['%ΔQ<sub>d</sub>', 'Percentage change in quantity demanded (%)'],
      ['%ΔP', 'Percentage change in price (%)'],
    ],
    constants: ['|E_d| > 1 Elastic · |E_d| < 1 Inelastic · |E_d| = 1 Unitary'],
    trap: 'Quantity is ALWAYS in the numerator (%ΔQ ÷ %ΔP), never %ΔP ÷ %ΔQ! WAEC/JAMB usually quote the absolute magnitude |E_d|.',
    worked: {
      qHtml: 'A 10% rise in price causes quantity demanded to fall by 25%. Find |E<sub>d</sub>| and interpret.',
      stepsHtml: ['|E<sub>d</sub>| = 25% ÷ 10% = 2.5 (Since 2.5 > 1, demand is fairly elastic)'],
      ansHtml: '2.5 (Elastic)',
    },
    keywords: ['ped', 'elasticity', 'elastic', 'inelastic', 'unitary'],
  },
  {
    id: 'efm-ped-point',
    cat: 'demand',
    name: 'Point Price Elasticity of Demand (Original Base Method)',
    topicId: 'ec-elasticity',
    summary: 'Computes price elasticity directly from initial and new price–quantity schedules (P₁, Q₁) → (P₂, Q₂).',
    rearrangements: [
      { solveFor: 'Ed', label: 'Point formula', exprHtml: '|E<sub>d</sub>| = (|ΔQ| ÷ |ΔP|) × (P<sub>1</sub> ÷ Q<sub>1</sub>)' },
      { solveFor: 'ΔQ', label: 'Solve for |ΔQ|', exprHtml: '|ΔQ| = |E<sub>d</sub>| × |ΔP| × (Q<sub>1</sub> ÷ P<sub>1</sub>)' },
    ],
    variables: [
      ['P<sub>1</sub>, Q<sub>1</sub>', 'Initial (original) price and quantity demanded'],
      ['ΔQ', 'Change in quantity (Q₂ − Q₁)'],
      ['ΔP', 'Change in price (P₂ − P₁)'],
    ],
    trap: 'Multiply (ΔQ ÷ ΔP) by (P₁ ÷ Q₁) — students frequently invert the second fraction into (Q₁ ÷ P₁)!',
    worked: {
      qHtml: 'When price rises from ₦20 to ₦25, quantity demanded falls from 100 units to 80 units. Find |E<sub>d</sub>|.',
      stepsHtml: ['|ΔQ| = 20, |ΔP| = 5, P₁ = 20, Q₁ = 100', '|E<sub>d</sub>| = (20 ÷ 5) × (20 ÷ 100) = 4 × 0.2 = 0.8'],
      ansHtml: '0.8 (Inelastic)',
    },
    keywords: ['point elasticity', 'schedule', 'original price'],
  },
  {
    id: 'efm-yed',
    cat: 'demand',
    name: 'Income Elasticity of Demand (Normal vs Inferior Goods)',
    topicId: 'ec-elasticity',
    summary: 'Measures the responsiveness of quantity demanded to a percentage change in consumer disposable income.',
    rearrangements: [
      { solveFor: 'Ey', label: 'Solve for E_y', exprHtml: 'E<sub>y</sub> = (%ΔQ<sub>d</sub>) ÷ (%ΔY)' },
      { solveFor: '%ΔQd', label: 'Solve for %ΔQ_d', exprHtml: '%ΔQ<sub>d</sub> = E<sub>y</sub> × (%ΔY)' },
    ],
    variables: [
      ['E<sub>y</sub>', 'Income elasticity of demand (sign matters!)'],
      ['%ΔQ<sub>d</sub>', 'Percentage change in quantity demanded (%)'],
      ['%ΔY', 'Percentage change in consumer income (%)'],
    ],
    constants: ['E_y > 0 Normal good · E_y < 0 Inferior good · E_y > 1 Luxury'],
    trap: 'Do NOT drop the minus sign on E_y! A NEGATIVE E_y proves the commodity is an INFERIOR good.',
    worked: {
      qHtml: 'Consumer income rises by 20% and demand for garri falls by 10%. Calculate E<sub>y</sub> and classify the good.',
      stepsHtml: ['E<sub>y</sub> = (−10%) ÷ (+20%) = −0.5 (Negative → Inferior good)'],
      ansHtml: '−0.5 (Inferior good)',
    },
    keywords: ['income elasticity', 'normal good', 'inferior good', 'luxury'],
  },
  {
    id: 'efm-xed',
    cat: 'demand',
    name: 'Cross Price Elasticity of Demand (Substitutes vs Complements)',
    topicId: 'ec-elasticity',
    summary: 'Measures how quantity demanded of Good X responds to a percentage change in the price of Good Y.',
    rearrangements: [
      { solveFor: 'Exy', label: 'Solve for E_xy', exprHtml: 'E<sub>xy</sub> = (%ΔQ<sub>x</sub>) ÷ (%ΔP<sub>y</sub>)' },
      { solveFor: '%ΔQx', label: 'Solve for %ΔQ_x', exprHtml: '%ΔQ<sub>x</sub> = E<sub>xy</sub> × (%ΔP<sub>y</sub>)' },
    ],
    variables: [
      ['E<sub>xy</sub>', 'Cross elasticity coefficient between goods X and Y'],
      ['%ΔQ<sub>x</sub>', 'Percentage change in quantity demanded of Good X'],
      ['%ΔP<sub>y</sub>', 'Percentage change in price of Good Y'],
    ],
    constants: ['E_xy > 0 Close substitutes · E_xy < 0 Joint complements · E_xy = 0 Independent'],
    trap: 'Positive E_xy = Competitive Substitutes (Milo & Bournvita); Negative E_xy = Joint Complements (Car & Petrol).',
    worked: {
      qHtml: 'A 15% increase in the price of petrol reduces demand for cars by 9%. Find E<sub>xy</sub>.',
      stepsHtml: ['E<sub>xy</sub> = (−9%) ÷ (+15%) = −0.6 (Negative → Jointly demanded complements)'],
      ansHtml: '−0.6 (Complements)',
    },
    keywords: ['cross elasticity', 'substitutes', 'complements', 'joint demand'],
  },
  {
    id: 'efm-mu',
    cat: 'demand',
    name: 'Marginal Utility & Two-Good Consumer Equilibrium',
    topicId: 'ec-utility',
    summary: 'Finds extra satisfaction from one more unit and optimal spending across two goods X and Y.',
    rearrangements: [
      { solveFor: 'MU', label: 'Marginal Utility (MU)', exprHtml: 'MU = ΔTU ÷ ΔQ' },
      { solveFor: 'MUx', label: 'Equi-Marginal Equilibrium', exprHtml: 'MU<sub>x</sub> ÷ P<sub>x</sub> = MU<sub>y</sub> ÷ P<sub>y</sub>' },
      { solveFor: 'Py', label: 'Solve for equilibrium P_y', exprHtml: 'P<sub>y</sub> = (MU<sub>y</sub> × P<sub>x</sub>) ÷ MU<sub>x</sub>' },
    ],
    variables: [
      ['TU', 'Total utility (utils)'],
      ['MU', 'Marginal utility of the last unit consumed (utils)'],
      ['P<sub>x</sub>, P<sub>y</sub>', 'Unit market prices of goods X and Y (₦)'],
    ],
    trap: 'Total Utility (TU) reaches its MAXIMUM at the exact output where Marginal Utility (MU) equals ZERO!',
    worked: {
      qHtml: 'At consumer equilibrium, MU<sub>x</sub> = 40 utils, P<sub>x</sub> = ₦10, and MU<sub>y</sub> = 60 utils. Find P<sub>y</sub>.',
      stepsHtml: ['40 ÷ 10 = 60 ÷ P<sub>y</sub> → 4 = 60 ÷ P<sub>y</sub> → P<sub>y</sub> = ₦15'],
      ansHtml: '₦15',
    },
    keywords: ['marginal utility', 'total utility', 'consumer equilibrium', 'utils'],
  },
  {
    id: 'efm-eq',
    cat: 'demand',
    name: 'Linear Market Equilibrium Price & Quantity',
    topicId: 'ec-supply-eq',
    summary: 'Clears the market by equating linear demand Q_d = a − bP with linear supply Q_s = c + dP.',
    rearrangements: [
      { solveFor: 'P*', label: 'Solve for equilibrium price (P*)', exprHtml: 'P* = (a − c) ÷ (b + d)' },
      { solveFor: 'Q*', label: 'Solve for equilibrium quantity (Q*)', exprHtml: 'Q* = a − bP* = c + dP*' },
    ],
    variables: [
      ['Q<sub>d</sub>', 'Quantity demanded = a − bP'],
      ['Q<sub>s</sub>', 'Quantity supplied = c + dP'],
      ['P*, Q*', 'Market-clearing equilibrium price and quantity'],
    ],
    trap: 'Watch signs when Q_s has a negative intercept (e.g. Q_s = −10 + 3P): a − (−10) = a + 10!',
    worked: {
      qHtml: 'Given Q<sub>d</sub> = 50 − 2P and Q<sub>s</sub> = 10 + 3P, find equilibrium price P* and quantity Q*.',
      stepsHtml: ['50 − 2P = 10 + 3P → 40 = 5P → P* = ₦8', 'Q* = 50 − 2(8) = 34 units'],
      ansHtml: 'P* = ₦8, Q* = 34 units',
    },
    keywords: ['equilibrium price', 'equilibrium quantity', 'excess demand', 'excess supply'],
  },

  /* ─────────────── 2. PRODUCTION, COSTS, REVENUE & PROFIT (5) ─────────────── */
  {
    id: 'efm-ap-mp',
    cat: 'production',
    name: 'Total, Average & Marginal Physical Product',
    topicId: 'ec-prod-func',
    summary: 'Relates total output to variable labour input L in the short-run production function.',
    rearrangements: [
      { solveFor: 'AP', label: 'Average Product (AP)', exprHtml: 'AP = TP ÷ L' },
      { solveFor: 'TP', label: 'Total Product (TP)', exprHtml: 'TP = AP × L' },
      { solveFor: 'MP', label: 'Marginal Product (MP)', exprHtml: 'MP = (TP<sub>n</sub> − TP<sub>n−1</sub>) ÷ (L<sub>n</sub> − L<sub>n−1</sub>)' },
    ],
    variables: [
      ['TP', 'Total physical product (units)'],
      ['L', 'Units of variable labour employed'],
      ['AP, MP', 'Output per worker and extra output from one additional worker'],
    ],
    trap: 'When TP is at its maximum, MP = 0; if adding another worker makes TP fall, MP becomes NEGATIVE!',
    worked: {
      qHtml: '4 workers produce AP = 15 units; when a 5th worker joins, TP rises to 72 units. Find MP of the 5th worker.',
      stepsHtml: ['TP₄ = 4 × 15 = 60 units', 'MP₅ = TP₅ − TP₄ = 72 − 60 = 12 units'],
      ansHtml: '12 units',
    },
    keywords: ['total product', 'average product', 'marginal product', 'diminishing returns'],
  },
  {
    id: 'efm-tc',
    cat: 'production',
    name: 'Short-Run Total, Fixed & Variable Cost Identity',
    topicId: 'ec-costs-rev',
    summary: 'Splits short-run total cost into output-independent fixed overhead and output-dependent variable cost.',
    rearrangements: [
      { solveFor: 'TC', label: 'Solve for Total Cost (TC)', exprHtml: 'TC = TFC + TVC' },
      { solveFor: 'TFC', label: 'Solve for Total Fixed Cost (TFC)', exprHtml: 'TFC = TC − TVC  (and at Q = 0, TC = TFC)' },
      { solveFor: 'TVC', label: 'Solve for Total Variable Cost (TVC)', exprHtml: 'TVC = TC − TFC' },
    ],
    variables: [
      ['TC', 'Total cost of production (₦)'],
      ['TFC', 'Total fixed cost — incurred even at zero output Q = 0 (₦)'],
      ['TVC', 'Total variable cost — zero when Q = 0 (₦)'],
    ],
    trap: 'At zero output (Q = 0), TVC = 0, so whatever TC equals at Q = 0 IS the firm’s Total Fixed Cost (TFC)!',
    worked: {
      qHtml: 'A firm’s cost function is TC = 500 + 20Q. Find TFC and TVC at Q = 15 units.',
      stepsHtml: ['At Q = 0, TFC = ₦500', 'TVC = 20 × 15 = ₦300 (so TC = ₦800)'],
      ansHtml: 'TFC = ₦500, TVC = ₦300',
    },
    keywords: ['total cost', 'fixed cost', 'variable cost'],
  },
  {
    id: 'efm-ac-mc',
    cat: 'production',
    name: 'Average Cost (ATC = AFC + AVC) & Marginal Cost',
    topicId: 'ec-costs-rev',
    summary: 'Computes unit cost of output and the extra cost of producing one additional unit.',
    rearrangements: [
      { solveFor: 'ATC', label: 'Average Total Cost (ATC)', exprHtml: 'ATC = TC ÷ Q = AFC + AVC' },
      { solveFor: 'MC', label: 'Marginal Cost (MC)', exprHtml: 'MC = ΔTC ÷ ΔQ = ΔTVC ÷ ΔQ' },
      { solveFor: 'AFC', label: 'Average Fixed Cost (AFC)', exprHtml: 'AFC = TFC ÷ Q = ATC − AVC' },
    ],
    variables: [
      ['ATC', 'Average total cost per unit (₦)'],
      ['AFC, AVC', 'Average fixed cost and average variable cost per unit (₦)'],
      ['MC', 'Marginal cost of the last unit produced (₦)'],
    ],
    trap: 'Fixed cost NEVER affects Marginal Cost (ΔTFC = 0), so MC depends strictly on changes in TVC!',
    worked: {
      qHtml: 'TC rises from ₦1,200 at Q = 10 to ₦1,350 at Q = 11. Find ATC at Q = 10 and MC of the 11th unit.',
      stepsHtml: ['ATC₁₀ = 1,200 ÷ 10 = ₦120', 'MC₁₁ = (1,350 − 1,200) ÷ (11 − 10) = ₦150'],
      ansHtml: 'ATC = ₦120, MC = ₦150',
    },
    keywords: ['average cost', 'marginal cost', 'afc', 'avc'],
  },
  {
    id: 'efm-tr-mr',
    cat: 'production',
    name: 'Total Revenue, Average Revenue & Marginal Revenue',
    topicId: 'ec-costs-rev',
    summary: 'Links market selling price P (which always equals AR) to total sales receipts and marginal revenue.',
    rearrangements: [
      { solveFor: 'TR', label: 'Total Revenue (TR)', exprHtml: 'TR = P × Q = AR × Q' },
      { solveFor: 'AR', label: 'Average Revenue (AR)', exprHtml: 'AR = TR ÷ Q = P' },
      { solveFor: 'MR', label: 'Marginal Revenue (MR)', exprHtml: 'MR = ΔTR ÷ ΔQ' },
    ],
    variables: [
      ['TR', 'Total sales revenue (₦)'],
      ['AR', 'Average revenue = Selling price P (₦)'],
      ['MR', 'Extra revenue from selling one additional unit (₦)'],
    ],
    trap: 'In Perfect Competition P = AR = MR (horizontal demand); in Monopoly P = AR > MR because price must fall to sell more.',
    worked: {
      qHtml: 'A monopolist sells 5 units at ₦40 each, or 6 units at ₦38 each. Find MR of the 6th unit.',
      stepsHtml: ['TR₅ = 5 × 40 = ₦200; TR₆ = 6 × 38 = ₦228', 'MR₆ = 228 − 200 = ₦28'],
      ansHtml: '₦28',
    },
    keywords: ['total revenue', 'average revenue', 'marginal revenue'],
  },
  {
    id: 'efm-profit',
    cat: 'production',
    name: 'Economic Profit & Break-Even Output Quantity',
    topicId: 'ec-costs-rev',
    summary: 'Determines supernormal profit (π = TR − TC) and the exact output where total revenue covers total cost.',
    rearrangements: [
      { solveFor: 'π', label: 'Total Profit (π)', exprHtml: 'π = TR − TC = (P − ATC) × Q' },
      { solveFor: 'Q_BE', label: 'Break-Even Output (Q_BE)', exprHtml: 'Q<sub>BE</sub> = TFC ÷ (P − AVC)' },
    ],
    variables: [
      ['π', 'Total profit (₦)'],
      ['TFC', 'Total fixed cost (₦)'],
      ['P − AVC', 'Unit contribution margin toward fixed cost (₦)'],
    ],
    trap: 'Economist’s total cost includes IMPLICIT opportunity costs (owner’s forgone salary/rent), so Economist’s Profit < Accountant’s Profit!',
    worked: {
      qHtml: 'A bakery has TFC = ₦12,000, unit variable cost AVC = ₦200, and sells loaves at P = ₦350. Find break-even output.',
      stepsHtml: ['Contribution per loaf = 350 − 200 = ₦150', 'Q<sub>BE</sub> = 12,000 ÷ 150 = 80 loaves'],
      ansHtml: '80 loaves',
    },
    keywords: ['profit', 'break-even', 'implicit cost', 'supernormal profit'],
  },

  /* ─────────────── 3. STATISTICS & INDEX NUMBERS (4) ─────────────── */
  {
    id: 'efm-mean',
    cat: 'stats',
    name: 'Grouped Frequency Arithmetic Mean',
    topicId: 'ec-stats',
    summary: 'Computes the weighted average of a frequency distribution table of scores, wages, or outputs.',
    rearrangements: [
      { solveFor: 'x̄', label: 'Solve for Mean (x̄)', exprHtml: 'x̄ = (∑fx) ÷ (∑f)' },
      { solveFor: '∑fx', label: 'Solve for Total Sum (∑fx)', exprHtml: '∑fx = x̄ × (∑f)' },
    ],
    variables: [
      ['x', 'Data value or class midpoint'],
      ['f', 'Frequency of each value'],
      ['∑f', 'Total number of observations N'],
    ],
    trap: 'Divide ∑fx by ∑f (sum of frequencies), NEVER by ∑x or the number of table columns!',
    worked: {
      qHtml: 'Daily outputs x = 2, 4, 6 occur with frequencies f = 3, 5, 2. Calculate the mean output.',
      stepsHtml: ['∑fx = (3×2) + (5×4) + (2×6) = 6 + 20 + 12 = 38', '∑f = 3 + 5 + 2 = 10 → x̄ = 38 ÷ 10 = 3.8'],
      ansHtml: '3.8 units',
    },
    keywords: ['mean', 'frequency table', 'average', 'central tendency'],
  },
  {
    id: 'efm-variance',
    cat: 'stats',
    name: 'Population Variance & Standard Deviation',
    topicId: 'ec-stats',
    summary: 'Measures dispersion around the mean; standard deviation is the positive square root of variance.',
    rearrangements: [
      { solveFor: 'σ²', label: 'Solve for Variance (σ²)', exprHtml: 'σ<sup>2</sup> = ∑f(x − x̄)<sup>2</sup> ÷ ∑f' },
      { solveFor: 'σ', label: 'Solve for Standard Deviation (σ)', exprHtml: 'σ = √(σ<sup>2</sup>)' },
    ],
    variables: [
      ['σ<sup>2</sup>', 'Variance (squared units)'],
      ['σ', 'Standard deviation (same unit as x)'],
      ['x − x̄', 'Deviation of each score from the arithmetic mean'],
    ],
    trap: 'Remember to take the SQUARE ROOT of variance when the question asks for Standard Deviation (not Variance)!',
    worked: {
      qHtml: 'Find the variance and standard deviation of the dataset: 2, 4, 6, 8.',
      stepsHtml: ['Mean x̄ = 20 ÷ 4 = 5', '∑(x − 5)² = 9 + 1 + 1 + 9 = 20 → σ² = 20 ÷ 4 = 5, σ = √5 ≈ 2.24'],
      ansHtml: 'σ² = 5, σ ≈ 2.24',
    },
    keywords: ['variance', 'standard deviation', 'dispersion'],
  },
  {
    id: 'efm-pie',
    cat: 'stats',
    name: 'Pie Chart Sector Angle & Component Value',
    topicId: 'ec-stats',
    summary: 'Converts budgetary or sectoral allocations between monetary values, percentages, and 360° pie sectors.',
    rearrangements: [
      { solveFor: 'θ', label: 'Solve for sector angle (θ)', exprHtml: 'θ = (Component ÷ Total) × 360°' },
      { solveFor: 'Val', label: 'Solve for component value', exprHtml: 'Component = (θ ÷ 360°) × Total' },
    ],
    variables: [
      ['θ', 'Central sector angle in degrees (sum = 360°)'],
      ['Component', 'Expenditure or output of a specific sector'],
      ['Total', 'Aggregate budget or total output'],
    ],
    trap: 'Use 360° for sector angles and 100% for percentages — never multiply by 100 when degrees are requested!',
    worked: {
      qHtml: 'Education receives 126° in a ₦400 billion state budget pie chart. How much was allocated to Education?',
      stepsHtml: ['Allocation = (126° ÷ 360°) × 400 = 0.35 × 400 = ₦140 billion'],
      ansHtml: '₦140 billion',
    },
    keywords: ['pie chart', 'sector angle', 'budget allocation'],
  },
  {
    id: 'efm-cpi',
    cat: 'stats',
    name: 'Price Index (CPI) & Annual Inflation Rate',
    topicId: 'ec-money-inf',
    summary: 'Tracks general price-level changes relative to a base year (Index = 100) and computes inflation.',
    rearrangements: [
      { solveFor: 'PI', label: 'Simple Price Index', exprHtml: 'PI = (P<sub>n</sub> ÷ P<sub>0</sub>) × 100' },
      { solveFor: 'Inf%', label: 'Annual Inflation Rate', exprHtml: 'Inflation % = [(CPI<sub>2</sub> − CPI<sub>1</sub>) ÷ CPI<sub>1</sub>] × 100' },
    ],
    variables: [
      ['P<sub>n</sub>', 'Current-year price of basket'],
      ['P<sub>0</sub>', 'Base-year price of basket (Base Index = 100)'],
      ['CPI<sub>1</sub>, CPI<sub>2</sub>', 'Previous and current Consumer Price Index'],
    ],
    trap: 'When CPI rises from 120 to 150, inflation is NOT 30% — divide 30 by 120 to get 25%!',
    worked: {
      qHtml: 'If the Consumer Price Index rises from 125 in Year 1 to 150 in Year 2, find the annual inflation rate.',
      stepsHtml: ['Inflation = [(150 − 125) ÷ 125] × 100 = (25 ÷ 125) × 100 = 20%'],
      ansHtml: '20%',
    },
    keywords: ['price index', 'cpi', 'inflation rate', 'base year'],
  },

  /* ─────────────── 4. MACROECONOMICS, MULTIPLIER & MONEY (6) ─────────────── */
  {
    id: 'efm-gdp-exp',
    cat: 'macro',
    name: 'Gross Domestic Product (Expenditure Approach)',
    topicId: 'ec-nat-income',
    summary: 'Sums final spending on domestically produced goods and services including net exports (X − M).',
    rearrangements: [
      { solveFor: 'GDP', label: 'Solve for GDP', exprHtml: 'GDP = C + I + G + (X − M)' },
      { solveFor: 'NX', label: 'Solve for Net Exports (X − M)', exprHtml: '(X − M) = GDP − (C + I + G)' },
    ],
    variables: [
      ['C, I, G', 'Household consumption, gross investment, and government spending'],
      ['X, M', 'Exports and imports of goods & services'],
    ],
    trap: 'EXCLUDE transfer payments (pensions, bursaries, unemployment benefits) and intermediate inputs to avoid double counting!',
    worked: {
      qHtml: 'Given C = ₦250b, I = ₦80b, G = ₦110b, Exports X = ₦60b, Imports M = ₦75b, find GDP.',
      stepsHtml: ['GDP = 250 + 80 + 110 + (60 − 75) = 440 − 15 = ₦425 billion'],
      ansHtml: '₦425 billion',
    },
    keywords: ['gdp', 'expenditure method', 'net exports', 'national income'],
  },
  {
    id: 'efm-gnp-nnp',
    cat: 'macro',
    name: 'GNP, NNP & Factor Cost Conversion',
    topicId: 'ec-nat-income',
    summary: 'Converts domestic output to national output using Net Factor Income from Abroad (NFIA) and depreciation.',
    rearrangements: [
      { solveFor: 'GNP', label: 'Solve for GNP', exprHtml: 'GNP = GDP + NFIA  (where NFIA = Receipts − Payments abroad)' },
      { solveFor: 'NNP', label: 'Solve for NNP', exprHtml: 'NNP = GNP − Depreciation (Capital Consumption)' },
      { solveFor: 'FC', label: 'Market Price → Factor Cost', exprHtml: 'GDP<sub>fc</sub> = GDP<sub>mp</sub> − Indirect Taxes + Subsidies' },
    ],
    variables: [
      ['NFIA', 'Income earned by citizens abroad minus income earned by foreigners domestically'],
      ['Depreciation', 'Capital consumption allowance (wear and tear)'],
    ],
    trap: 'For many developing nations where foreign multinationals repatriate more profit than citizens earn abroad, NFIA is NEGATIVE so GNP < GDP!',
    worked: {
      qHtml: 'GDP = ₦500b, factor income from abroad = ₦30b, paid to foreigners = ₦55b, depreciation = ₦40b. Find NNP.',
      stepsHtml: ['NFIA = 30 − 55 = −₦25b → GNP = 500 − 25 = ₦475b', 'NNP = 475 − 40 = ₦435b'],
      ansHtml: '₦435 billion',
    },
    keywords: ['gnp', 'nnp', 'nfia', 'depreciation', 'factor cost', 'subsidies'],
  },
  {
    id: 'efm-mpc-mps',
    cat: 'macro',
    name: 'Marginal & Average Propensities to Consume and Save',
    topicId: 'ec-nat-income',
    summary: 'Splits every extra naira of disposable income between consumption (MPC) and saving (MPS).',
    rearrangements: [
      { solveFor: 'MPC', label: 'Solve for MPC', exprHtml: 'MPC = ΔC ÷ ΔY = 1 − MPS' },
      { solveFor: 'MPS', label: 'Solve for MPS', exprHtml: 'MPS = ΔS ÷ ΔY = 1 − MPC' },
      { solveFor: 'APC', label: 'Average Propensities', exprHtml: 'APC = C ÷ Y  and  APC + APS = 1' },
    ],
    variables: [
      ['ΔC, ΔS', 'Change in consumption and change in saving'],
      ['ΔY', 'Change in disposable national income'],
    ],
    constants: ['MPC + MPS = 1 · APC + APS = 1'],
    trap: 'MPC uses CHANGES (ΔC ÷ ΔY), whereas APC uses TOTALS (C ÷ Y) — never mix them up!',
    worked: {
      qHtml: 'When national income rises from ₦800m to ₦1,000m, consumption rises from ₦620m to ₦770m. Find MPC and MPS.',
      stepsHtml: ['ΔC = 150m, ΔY = 200m → MPC = 150 ÷ 200 = 0.75', 'MPS = 1 − 0.75 = 0.25'],
      ansHtml: 'MPC = 0.75, MPS = 0.25',
    },
    keywords: ['mpc', 'mps', 'apc', 'aps', 'consumption function'],
  },
  {
    id: 'efm-multiplier',
    cat: 'macro',
    name: 'Keynesian Investment Multiplier & Income Change',
    topicId: 'ec-nat-income',
    summary: 'Determines the multiple by which equilibrium national income expands following an injection ΔI or ΔG.',
    rearrangements: [
      { solveFor: 'k', label: 'Solve for Multiplier (k)', exprHtml: 'k = 1 ÷ (1 − MPC) = 1 ÷ MPS' },
      { solveFor: 'ΔY', label: 'Solve for Income Expansion (ΔY)', exprHtml: 'ΔY = k × ΔI' },
      { solveFor: 'ΔI', label: 'Required Investment Injection (ΔI)', exprHtml: 'ΔI = ΔY ÷ k' },
    ],
    variables: [
      ['k', 'Keynesian expenditure multiplier'],
      ['MPC, MPS', 'Marginal propensities to consume and save'],
      ['ΔI, ΔY', 'Autonomous investment injection and resulting change in national income'],
    ],
    trap: 'Higher MPC (lower MPS leakage) produces a LARGER multiplier k; higher saving/tax/import leakages shrink k!',
    worked: {
      qHtml: 'In an economy with MPC = 0.8, government injects ΔI = ₦15 billion. Find the total increase in national income ΔY.',
      stepsHtml: ['k = 1 ÷ (1 − 0.8) = 1 ÷ 0.2 = 5', 'ΔY = 5 × 15 = ₦75 billion'],
      ansHtml: '₦75 billion',
    },
    keywords: ['multiplier', 'keynesian', 'injection', 'national income'],
  },
  {
    id: 'efm-qtm',
    cat: 'macro',
    name: 'Irving Fisher’s Quantity Theory of Money',
    topicId: 'ec-money-inf',
    summary: 'Equates total money expenditure (M × V) to the monetary value of transactions (P × T).',
    rearrangements: [
      { solveFor: 'MV=PT', label: 'Equation of Exchange', exprHtml: 'M × V = P × T' },
      { solveFor: 'P', label: 'Solve for Price Level (P)', exprHtml: 'P = (M × V) ÷ T' },
      { solveFor: 'V', label: 'Solve for Velocity of Circulation (V)', exprHtml: 'V = (P × T) ÷ M' },
    ],
    variables: [
      ['M', 'Quantity of money supply in circulation'],
      ['V', 'Velocity of circulation of money'],
      ['P, T', 'General price level and volume of physical transactions/output'],
    ],
    trap: 'If V and T are held constant in the short run, doubling money supply M strictly DOUBLES the price level P!',
    worked: {
      qHtml: 'Given money supply M = ₦400b, velocity V = 5, and transactions volume T = 100b units, find price level P.',
      stepsHtml: ['P = (400 × 5) ÷ 100 = 2,000 ÷ 100 = ₦20'],
      ansHtml: '₦20',
    },
    keywords: ['quantity theory of money', 'irving fisher', 'velocity of money', 'mv=pt'],
  },
  {
    id: 'efm-credit',
    cat: 'macro',
    name: 'Commercial Bank Credit Creation & Money Multiplier',
    topicId: 'ec-financial',
    summary: 'Calculates maximum total demand deposits created by the banking system from an initial cash deposit.',
    rearrangements: [
      { solveFor: 'D_max', label: 'Total Deposits Created (D_max)', exprHtml: 'D<sub>max</sub> = Initial Deposit ÷ r' },
      { solveFor: 'Loans', label: 'Net New Credit / Loans Created', exprHtml: 'New Credit = D<sub>max</sub> − Initial Deposit' },
      { solveFor: 'm', label: 'Cash Reserve Multiplier (m)', exprHtml: 'm = 1 ÷ r  (where r = Cash Reserve Ratio)' },
    ],
    variables: [
      ['r', 'Statutory Cash Reserve Ratio (decimal or %, e.g. 10% = 0.10)'],
      ['D<sub>max</sub>', 'Maximum total deposits across the commercial banking system (₦)'],
    ],
    trap: 'Read carefully whether the examiner asks for TOTAL deposits (Initial ÷ r) or NET NEW loans created (Total − Initial)!',
    worked: {
      qHtml: 'With a cash reserve ratio of 20% (0.20), find total bank deposits created from a fresh ₦50,000 deposit.',
      stepsHtml: ['Multiplier m = 1 ÷ 0.20 = 5', 'D<sub>max</sub> = 5 × ₦50,000 = ₦250,000 (Net new loans = ₦200,000)'],
      ansHtml: '₦250,000',
    },
    keywords: ['credit creation', 'cash reserve ratio', 'money multiplier', 'commercial bank'],
  },

  /* ─────────────── 5. POPULATION & INTERNATIONAL TRADE (3) ─────────────── */
  {
    id: 'efm-pop-growth',
    cat: 'trade',
    name: 'Natural Increase, Net Migration & New Population',
    topicId: 'ec-population',
    summary: 'Combines vital birth/death statistics with international migration to track demographic growth.',
    rearrangements: [
      { solveFor: 'ΔP', label: 'Net Population Change (ΔP)', exprHtml: 'ΔP = (Births − Deaths) + (Immigrants − Emigrants)' },
      { solveFor: 'g%', label: 'Annual Growth Rate (%)', exprHtml: 'g% = (ΔP ÷ Initial Population) × 100' },
    ],
    variables: [
      ['Births − Deaths', 'Natural population increase'],
      ['Immigrants − Emigrants', 'Net migration'],
    ],
    trap: '“Natural growth” equals (Births − Deaths) ONLY; “Net / Overall population change” adds Net Migration (I − E)!',
    worked: {
      qHtml: 'A town of 200,000 records 8,000 births, 3,000 deaths, 2,500 immigrants, and 1,500 emigrants. Find new population.',
      stepsHtml: ['ΔP = (8,000 − 3,000) + (2,500 − 1,500) = 5,000 + 1,000 = 6,000', 'New population = 206,000'],
      ansHtml: '206,000 people',
    },
    keywords: ['population growth', 'natural increase', 'net migration', 'birth rate'],
  },
  {
    id: 'efm-dep-pci',
    cat: 'trade',
    name: 'Dependency Ratio, Population Density & Per Capita Income',
    topicId: 'ec-population',
    summary: 'Computes economic burden on the active labour age group (18–60/64) and average living-standard income.',
    rearrangements: [
      { solveFor: 'Dep', label: 'Dependency Ratio', exprHtml: 'Dependency Ratio = (Children + Aged) ÷ Working-Age Pop' },
      { solveFor: 'PCI', label: 'Income Per Capita (PCI)', exprHtml: 'PCI = National Income ÷ Total Population' },
      { solveFor: 'Dens', label: 'Population Density', exprHtml: 'Density = Total Population ÷ Land Area (km<sup>2</sup>)' },
    ],
    variables: [
      ['Children + Aged', 'Dependants aged 0–17 and 60+/65+'],
      ['Working-Age Pop', 'Economically active age bracket (independent population)'],
    ],
    trap: 'Divide dependants by the WORKING-AGE population, NEVER by the total population!',
    worked: {
      qHtml: 'A country has 45m children (0–17), 50m working-age adults (18–60), and 5m aged (60+). Find the dependency ratio.',
      stepsHtml: ['Dependants = 45m + 5m = 50m; Working-age = 50m', 'Dependency ratio = 50m ÷ 50m = 1 : 1 (or 100%)'],
      ansHtml: '1 : 1 (100%)',
    },
    keywords: ['dependency ratio', 'per capita income', 'population density'],
  },
  {
    id: 'efm-tot',
    cat: 'trade',
    name: 'Commodity Terms of Trade & Balance of Trade',
    topicId: 'ec-bop-fx',
    summary: 'Measures purchasing power of a nation’s exports per unit of imports and visible merchandise balance.',
    rearrangements: [
      { solveFor: 'TOT', label: 'Terms of Trade (TOT)', exprHtml: 'TOT = (Index of Export Prices ÷ Index of Import Prices) × 100' },
      { solveFor: 'BOT', label: 'Visible Balance of Trade (BOT)', exprHtml: 'BOT = Value of Visible Exports − Value of Visible Imports' },
    ],
    variables: [
      ['TOT', 'Terms of Trade index (> 100 favourable · < 100 unfavourable)'],
      ['BOT', 'Balance of visible (physical merchandise) trade'],
    ],
    constants: ['TOT > 100 Favourable · TOT < 100 Deteriorating/Unfavourable'],
    trap: 'Terms of Trade compares PRICE INDICES of exports vs imports; Balance of Trade subtracts MONETARY VALUES of visible goods!',
    worked: {
      qHtml: 'Nigeria’s export price index is 132 while its import price index is 110. Calculate TOT and interpret.',
      stepsHtml: ['TOT = (132 ÷ 110) × 100 = 1.2 × 100 = 120 (Favourable since 120 > 100)'],
      ansHtml: '120 (Favourable)',
    },
    keywords: ['terms of trade', 'balance of trade', 'export price index', 'bop'],
  },
];
