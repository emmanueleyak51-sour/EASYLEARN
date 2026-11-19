import type { SubjectId } from '../types';

export interface TheoryRubricItem {
  code: string; // e.g., 'M1', 'A1', 'B1', 'Content (10)'
  marks: number;
  criterion: string;
  modelStep: string;
}

export interface WaecTheoryPrompt {
  id: string;
  subj: SubjectId;
  paper: string;
  topic: string;
  totalMarks: number;
  estMinutes: number;
  question: string;
  examinerNote: string;
  rubric: TheoryRubricItem[];
}

export const WAEC_THEORY_BANK: WaecTheoryPrompt[] = [
  {
    id: 'th-math-quad',
    subj: 'maths',
    paper: 'WAEC Paper 2 · Structured Theory',
    topic: 'Quadratic Equations & Completing the Square',
    totalMarks: 8,
    estMinutes: 10,
    question:
      'Solve 2x² − 7x + 3 = 0 by completing the square, leaving your steps clearly shown, and state the sum and product of its roots.',
    examinerNote: 'WAEC awards method marks (M1) strictly for dividing by 2 first and adding (b/2a)² to both sides.',
    rubric: [
      { code: 'M1', marks: 1, criterion: 'Divide throughout by coefficient of x² (2)', modelStep: 'x² − (7/2)x + 3/2 = 0 → x² − (7/2)x = −3/2' },
      { code: 'M1', marks: 2, criterion: 'Add square of half coefficient of x, (−7/4)² = 49/16, to both sides', modelStep: '(x − 7/4)² = −3/2 + 49/16 = (−24 + 49)/16 = 25/16' },
      { code: 'M1', marks: 1, criterion: 'Take both ± square roots cleanly', modelStep: 'x − 7/4 = ±5/4' },
      { code: 'A1', marks: 2, criterion: 'Evaluate both exact roots correctly', modelStep: 'x = 12/4 = 3  or  x = 2/4 = 1/2' },
      { code: 'B1', marks: 2, criterion: 'State sum (−b/a) and product (c/a) of roots', modelStep: 'Sum α + β = 7/2 = 3.5; Product αβ = 3/2 = 1.5' },
    ],
  },
  {
    id: 'th-eng-essay',
    subj: 'eng',
    paper: 'WAEC Paper 2 · Section A (Formal Letter)',
    topic: 'Formal Letter & Persuasive Essay Rubric',
    totalMarks: 20,
    estMinutes: 20,
    question:
      'Write a formal letter to the Chairman of your Local Government Area highlighting three urgent causes of flooding in your community and proposing practical engineering and civic solutions.',
    examinerNote: 'WAEC grades Section A across 4 fixed domains: Content, Organization, Expression, and Mechanical Accuracy.',
    rubric: [
      { code: 'Content', marks: 6, criterion: 'Covers 3 clear causes (e.g., blocked drainages, indiscriminate refuse, poor town planning) plus concrete solutions', modelStep: 'Dedicate one focused paragraph per cause paired with an actionable remedy.' },
      { code: 'Organization', marks: 4, criterion: 'Two addresses (writer right, recipient left), date, "Dear Sir/Madam,", capitalized underlined title, formal closing ("Yours faithfully," + signature + full name)', modelStep: 'Never use "Yours sincerely," or contractions in a formal letter.' },
      { code: 'Expression', marks: 6, criterion: 'Formal register, varied sentence structures, clear topic sentences, cohesive transitions', modelStep: 'Use formal connectors: "Consequently,", "Furthermore,", "In light of the above,".' },
      { code: 'Mech. Acc.', marks: 4, criterion: 'Correct concord, tense consistency, spelling, punctuation, and capitalization', modelStep: 'Proofread subject-verb agreement and avoid comma splices.' },
    ],
  },
  {
    id: 'th-chem-stoich',
    subj: 'chem',
    paper: 'WAEC Paper 2 · Quantitative Chemistry',
    topic: 'Acid–Base Volumetric Stoichiometry',
    totalMarks: 8,
    estMinutes: 10,
    question:
      '25.0 cm³ of 0.10 mol dm⁻³ Na₂CO₃ solution required 20.0 cm³ of dilute HCl for complete neutralization. (a) Write the balanced chemical equation. (b) Calculate the molar concentration of the HCl solution in mol dm⁻³ and g dm⁻³. [H = 1, Cl = 35.5]',
    examinerNote: 'Always convert cm³ to dm³ (or apply CₐVₐ/C_bV_b = nₐ/n_b directly) and include units on final answers.',
    rubric: [
      { code: 'B1', marks: 2, criterion: 'Balanced equation showing 2:1 acid-to-carbonate mole ratio', modelStep: 'Na₂CO₃(aq) + 2HCl(aq) → 2NaCl(aq) + H₂O(l) + CO₂(g)' },
      { code: 'M1', marks: 2, criterion: 'State formula CₐVₐ / C_bV_b = nₐ / n_b and substitute correctly', modelStep: '(Cₐ × 20.0) / (0.10 × 25.0) = 2 / 1' },
      { code: 'A1', marks: 2, criterion: 'Compute molar concentration with units', modelStep: 'Cₐ = (2 × 0.10 × 25.0) / 20.0 = 0.25 mol dm⁻³' },
      { code: 'A1', marks: 2, criterion: 'Convert molar concentration to mass concentration (× molar mass 36.5)', modelStep: 'Mass conc = 0.25 × 36.5 = 9.125 g dm⁻³' },
    ],
  },
  {
    id: 'th-phys-elec',
    subj: 'phys',
    paper: 'WAEC Paper 2 · Current Electricity',
    topic: 'EMF, Internal Resistance & Terminal PD',
    totalMarks: 8,
    estMinutes: 10,
    question:
      'A cell of EMF 2.0 V and internal resistance 0.5 Ω is connected across two parallel resistors of 4 Ω and 6 Ω. Calculate: (a) the combined external resistance, (b) the main circuit current, and (c) the terminal potential difference.',
    examinerNote: 'Watch the common trap: add internal resistance r IN SERIES with the parallel combination R_p, never in parallel.',
    rubric: [
      { code: 'M1', marks: 2, criterion: 'Apply parallel resistance formula 1/R_p = 1/4 + 1/6', modelStep: '1/R_p = 5/12 → R_p = 12/5 = 2.4 Ω' },
      { code: 'M1', marks: 2, criterion: 'Compute total resistance R_total = R_p + r and current I = E / (R_p + r)', modelStep: 'I = 2.0 / (2.4 + 0.5) = 2.0 / 2.9 = 0.69 A' },
      { code: 'A1', marks: 2, criterion: 'Calculate terminal PD using V = I·R_p or V = E − I·r', modelStep: 'V = 0.69 × 2.4 ≈ 1.66 V (lost volts = 0.34 V)' },
      { code: 'B1', marks: 2, criterion: 'Correct SI units (Ω, A, V) on every numerical result', modelStep: 'R_p = 2.4 Ω, I = 0.69 A, V = 1.66 V' },
    ],
  },
  {
    id: 'th-dataproc-sql',
    subj: 'dataproc',
    paper: 'WAEC Paper 2 · Relational Databases & SQL',
    topic: 'Database Keys, Normalization & SQL Querying',
    totalMarks: 10,
    estMinutes: 12,
    question:
      '(a) Distinguish between a Primary Key and a Foreign Key with an example. (b) State two conditions required for a table to be in Third Normal Form (3NF). (c) Write an SQL query to display `Full_Name` and `Score` of SS3 students from `Students` who scored above 80, ordered from highest to lowest.',
    examinerNote: 'WAEC penalizes missing ORDER BY DESC or using == instead of = in SQL.',
    rubric: [
      { code: 'B2', marks: 3, criterion: 'Clear contrast: Primary Key uniquely identifies each record (NOT NULL); Foreign Key references another table’s PK to enforce referential integrity', modelStep: 'e.g., `Student_ID` in `Students` (PK) referenced in `Scores` (FK).' },
      { code: 'B2', marks: 3, criterion: 'State 3NF conditions: already in 2NF AND no transitive functional dependencies between non-key attributes', modelStep: 'Every non-key attribute depends on the key, the whole key, and nothing but the key.' },
      { code: 'M1', marks: 2, criterion: 'Correct SELECT, FROM, and WHERE clause syntax', modelStep: "SELECT Full_Name, Score FROM Students WHERE Class = 'SS3' AND Score > 80" },
      { code: 'A1', marks: 2, criterion: 'Correct ORDER BY Score DESC clause and semicolon', modelStep: 'ORDER BY Score DESC;' },
    ],
  },
  {
    id: 'th-digitech-logic',
    subj: 'digitech',
    paper: 'WAEC Paper 2 · Digital Logic & Binary',
    topic: 'Logic Circuits & Two’s Complement',
    totalMarks: 8,
    estMinutes: 10,
    question:
      '(a) Convert 157₁₀ to binary and hexadecimal showing working. (b) Construct the truth table for Q = (A AND B) OR (NOT A) and identify the single case where Q = 0.',
    examinerNote: 'Group binary bits in fours from the right (LSB) to convert cleanly to hexadecimal without errors.',
    rubric: [
      { code: 'M1', marks: 2, criterion: 'Successive division by 2 yielding 8-bit binary', modelStep: '157₁₀ = 10011101₂ (128 + 16 + 8 + 4 + 1)' },
      { code: 'A1', marks: 2, criterion: 'Group nibbles 1001 (9) and 1101 (D) to get hexadecimal', modelStep: '1001 1101₂ = 9D₁₆' },
      { code: 'M1', marks: 2, criterion: 'Complete 4-row truth table for A, B, A·B, Ā, and Q', modelStep: '(0,0)→1, (0,1)→1, (1,0)→0, (1,1)→1' },
      { code: 'A1', marks: 2, criterion: 'Correctly identify Q = 0 solely when A = 1 and B = 0', modelStep: 'Q = 0 only for input row A = 1, B = 0 (material implication A → B).' },
    ],
  },
  {
    id: 'th-fmath-calc',
    subj: 'fmaths',
    paper: 'WAEC Paper 2 · Further Calculus',
    topic: 'Stationary Points & Curve Nature',
    totalMarks: 8,
    estMinutes: 10,
    question:
      'Find the coordinates and nature of the stationary points of the curve y = x³ − 3x² − 9x + 5.',
    examinerNote: 'Remember to substitute each x-value back into y (not dy/dx) for coordinates, and test d²y/dx² for max/min nature.',
    rubric: [
      { code: 'M1', marks: 2, criterion: 'Differentiate term-by-term and set dy/dx = 0', modelStep: 'dy/dx = 3x² − 6x − 9 = 0 → x² − 2x − 3 = 0' },
      { code: 'A1', marks: 2, criterion: 'Factorize and obtain x = 3 and x = −1', modelStep: '(x − 3)(x + 1) = 0 → x = 3 or x = −1' },
      { code: 'A1', marks: 2, criterion: 'Compute exact coordinates (3, −22) and (−1, 10)', modelStep: 'y(3) = 27−27−27+5 = −22; y(−1) = −1−3+9+5 = 10' },
      { code: 'M1/A1', marks: 2, criterion: 'Use d²y/dx² = 6x − 6 to classify minimum and maximum', modelStep: 'At x=3, d²y/dx² = +12 > 0 (Minimum); at x=−1, d²y/dx² = −12 < 0 (Maximum).' },
    ],
  },
  {
    id: 'th-geog-map',
    subj: 'geog',
    paper: 'WAEC Paper 2 · Map Reading & Relief',
    topic: 'Gradient Calculation & Relief Interpretation',
    totalMarks: 8,
    estMinutes: 10,
    question:
      'On a topographical map of scale 1:50,000, the straight-line map distance between Town X (elevation 120 m) and Hilltop Y (elevation 420 m) is 6.0 cm. Calculate: (a) the actual ground distance in km, and (b) the average gradient between X and Y.',
    examinerNote: 'Convert horizontal equivalent (HE) to METRES before dividing by vertical interval (VI) so both are in the same unit.',
    rubric: [
      { code: 'M1', marks: 2, criterion: 'Convert scale 1:50,000 → 1 cm = 0.5 km (or 500 m)', modelStep: 'Ground distance = 6.0 × 0.5 km = 3.0 km' },
      { code: 'B1', marks: 2, criterion: 'Compute Vertical Interval (VI) cleanly', modelStep: 'VI = 420 m − 120 m = 300 m' },
      { code: 'M1', marks: 2, criterion: 'Convert Horizontal Equivalent (HE) to metres and apply Gradient = VI / HE', modelStep: 'HE = 3.0 km = 3,000 m → Gradient = 300 / 3,000' },
      { code: 'A1', marks: 2, criterion: 'Express simplified ratio 1 in 10', modelStep: 'Average gradient = 1 in 10 (steep slope).' },
    ],
  },
];
