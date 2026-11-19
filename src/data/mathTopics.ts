// @ts-nocheck
import type { Topic } from "../types";
import { LEVELS, fr, MN, nm, frac, poly, brk, isSq } from "../utils/mathMarkup";
import { perm } from "../utils/engine";

const BAR15 = ['bars', { x: [1, 2, 3, 4, 5], f: [2, 3, 5, 4, 1], xl: 'Mark', yl: 'Students', label: 'Bar chart of quiz marks: mark 1, 2 students; mark 2, 3 students; mark 3, 5 students; mark 4, 4 students; mark 5, 1 student' }];

const CONTENT = {
  subject: 'Mathematics',
  topics: [

    /* ───────────── 1. NUMBER BASES ───────────── */
    {
      id: 'bases', name: 'Number Bases', sec: 'Section I · Number and Numeration', boss: 'The Base Shifter',
      goals: ['Convert numbers between base ten and bases 2 to 9', 'Add, subtract and multiply in other bases', 'Find an unknown base from an equation'],
      parts: [
        {
          title: 'Converting to base ten',
          idea: `In base ten, the places are worth 1, 10, 100 and so on. In base two they are worth 1, 2, 4, 8. In any base <i>n</i>, each place is worth a power of <i>n</i>.`,
          g: ['place', {}], cap: `1011<sub>2</sub> means 8 + 0 + 2 + 1, which is 11 in base ten.`,
          rules: [
            `Place values are powers of the base, counted from the right: <i>n</i><sup>0</sup>, <i>n</i><sup>1</sup>, <i>n</i><sup>2</sup> and so on.`,
            `Multiply each digit by its place value, then add.`,
            `Base <i>n</i> only uses the digits 0 to <i>n</i> − 1. The digit 8 can never appear in base 8.`
          ],
          ex: {
            q: `Convert 213<sub>5</sub> to base ten.`,
            steps: [
              [`Place values: 5² = 25, 5¹ = 5, 5⁰ = 1`, `Powers of 5, counted from the right.`],
              [`(2 × 25) + (1 × 5) + (3 × 1)`, `Each digit times its place value.`],
              [`50 + 5 + 3 = 58`, `So 213<sub>5</sub> = 58<sub>10</sub>.`]
            ]
          },
          tryit: {
            q: `Convert 132<sub>4</sub> to base ten.`,
            given: [`Place values: 4² = 16, 4¹ = 4, 4⁰ = 1`, `(1 × 16) + (3 × 4) + (2 × 1)`],
            ask: `So 132<sub>4</sub> in base ten is ?`, o: ['22', '26', '30', '46'], a: 2,
            h: `Add the three products: 16, 12 and 2.`, e: `16 + 12 + 2 = 30, so 132<sub>4</sub> = 30<sub>10</sub>.`
          }
        },
        {
          title: 'Leaving base ten, and sums in other bases',
          idea: `To change a base ten number to another base, keep dividing by the new base and note each remainder. The remainders, read from the last to the first, are the digits.`,
          rules: [
            `Divide by the new base, write down the remainder, and repeat until the quotient is 0.`,
            `Read the remainders upward, from the last one to the first.`,
            `When you add in base <i>n</i>, carry as soon as a column reaches <i>n</i>, not 10.`
          ],
          ex: {
            q: `Convert 47<sub>10</sub> to base 5.`,
            steps: [
              [`47 ÷ 5 = 9 remainder 2`, `This first remainder will be the last digit.`],
              [`9 ÷ 5 = 1 remainder 4`, `Divide the quotient again.`],
              [`1 ÷ 5 = 0 remainder 1`, `Stop when the quotient reaches 0.`],
              [`Read upward: 142<sub>5</sub>`, `Check: 25 + 20 + 2 = 47.`]
            ]
          },
          tryit: {
            q: `Add 134<sub>5</sub> + 23<sub>5</sub>.`,
            given: [`Units: 4 + 3 = 7, which is one 5 and 2 left. Write 2, carry 1.`, `Fives: 3 + 2 + 1 = 6, which is one 5 and 1 left. Write 1, carry 1.`, `Twenty-fives: 1 + 1 = 2. Write 2.`],
            ask: `So the answer is ?`, o: ['157<sub>5</sub>', '202<sub>5</sub>', '211<sub>5</sub>', '212<sub>5</sub>'], a: 3,
            h: `Collect the digits you wrote down, starting from the twenty-fives column.`, e: `The digits are 2, 1, 2, so the answer is 212<sub>5</sub>. Check in base ten: 44 + 13 = 57.`
          }
        }
      ],
      trap: `"Find the base" questions come up often. Write each number in place-value form, build an equation, and reject any answer that is not bigger than every digit in the question.`,
      qs: [
        { l: 1, q: `Which of these cannot be a number in base 6?`, o: ['345', '512', '461', '205'], a: 2, e: `Base 6 only uses the digits 0 to 5. 461 contains the digit 6, so it cannot be in base 6.` },
        { l: 1, q: `Convert 101<sub>2</sub> to base ten.`, o: ['3', '5', '6', '7'], a: 1, e: `(1 × 4) + (0 × 2) + (1 × 1) = 5.` },
        { l: 2, dx: 1, q: `Convert 234<sub>5</sub> to base ten.`, o: ['59', '64', '69', '74'], a: 2, e: `(2 × 25) + (3 × 5) + (4 × 1) = 50 + 15 + 4 = 69.` },
        { l: 2, q: `Express 25<sub>10</sub> in base two.`, o: ['11001<sub>2</sub>', '10011<sub>2</sub>', '11011<sub>2</sub>', '10101<sub>2</sub>'], a: 0, e: `25 = 16 + 8 + 1, so the digits are 1, 1, 0, 0, 1. That is 11001<sub>2</sub>.` },
        { l: 2, q: `Convert 100<sub>10</sub> to base 8.`, o: ['124<sub>8</sub>', '144<sub>8</sub>', '441<sub>8</sub>', '154<sub>8</sub>'], a: 1, e: `100 ÷ 8 = 12 r 4, then 12 ÷ 8 = 1 r 4, then 1 ÷ 8 = 0 r 1. Reading upward gives 144<sub>8</sub>.` },
        { l: 3, dx: 1, q: `Evaluate 1101<sub>2</sub> + 111<sub>2</sub>.`, o: ['10010<sub>2</sub>', '10100<sub>2</sub>', '11000<sub>2</sub>', '10110<sub>2</sub>'], a: 1, e: `In base ten this is 13 + 7 = 20. And 20 = 16 + 4, which is 10100<sub>2</sub>.` },
        { l: 3, q: `Find 43<sub>5</sub> − 24<sub>5</sub>.`, o: ['14<sub>5</sub>', '19<sub>5</sub>', '21<sub>5</sub>', '24<sub>5</sub>'], a: 0, e: `43<sub>5</sub> = 23 and 24<sub>5</sub> = 14 in base ten. 23 − 14 = 9, and 9 = (1 × 5) + 4 = 14<sub>5</sub>. Note that 19<sub>5</sub> is impossible because base 5 has no digit 9.` },
        { l: 3, q: `Multiply 23<sub>4</sub> by 3<sub>4</sub>.`, o: ['123<sub>4</sub>', '131<sub>4</sub>', '201<sub>4</sub>', '213<sub>4</sub>'], a: 2, e: `23<sub>4</sub> = 11 in base ten. 11 × 3 = 33, and 33 = (2 × 16) + (0 × 4) + 1 = 201<sub>4</sub>.` },
        { l: 4, q: `If 23<sub>x</sub> = 13<sub>10</sub>, find x.`, o: ['3', '4', '5', '6'], a: 2, e: `In place-value form, 2x + 3 = 13. So 2x = 10 and x = 5.` },
        { l: 4, q: `Convert 0.101<sub>2</sub> to base ten.`, o: ['0.375', '0.5', '0.625', '0.75'], a: 2, e: `After the point the places are ½, ¼ and ⅛. So 0.101<sub>2</sub> = ½ + 0 + ⅛ = 0.625.` },
        { l: 5, q: `If 211<sub>x</sub> = 56<sub>10</sub>, find x.`, o: ['5', '6', '7', '8'], a: 0, e: `2x² + x + 1 = 56, so 2x² + x − 55 = 0, which factorises as (2x + 11)(x − 5) = 0. A base must be a positive whole number, so x = 5.` },
        { l: 5, q: `Given that 23<sub>x</sub> + 14<sub>x</sub> = 42<sub>x</sub>, find x.`, o: ['4', '5', '6', '7'], a: 1, e: `(2x + 3) + (x + 4) = 4x + 2, so 3x + 7 = 4x + 2 and x = 5. The answer 4 is impossible: the digit 4 cannot appear in base 4.` }
      ]
    },

    /* ───────────── 2. INDICES AND LOGARITHMS ───────────── */
    {
      id: 'indices', name: 'Indices and Logarithms', sec: 'Section I · Number and Numeration', boss: 'The Power Python',
      goals: ['Use the laws of indices, including zero, negative and fractional indices', 'Solve equations where the unknown is an index', 'Use the laws of logarithms to simplify and solve'],
      parts: [
        {
          title: 'The laws of indices',
          idea: `An index counts how many times a number is multiplied by itself: a³ = a × a × a. Every law below comes from that counting.`,
          rules: [
            `Multiply: add the indices. a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup>`,
            `Divide: subtract the indices. a<sup>m</sup> ÷ a<sup>n</sup> = a<sup>m−n</sup>`,
            `Power of a power: multiply the indices. (a<sup>m</sup>)<sup>n</sup> = a<sup>mn</sup>`,
            `Zero and negative: a<sup>0</sup> = 1 and a<sup>−n</sup> = 1 ÷ a<sup>n</sup>`,
            `Fractions mean roots: a<sup>1/n</sup> is the nth root of a, and a<sup>m/n</sup> is that root raised to the power m.`
          ],
          ex: {
            q: `Simplify 27<sup>2/3</sup> × 9<sup>−1/2</sup>.`,
            steps: [
              [`27<sup>2/3</sup> = (∛27)² = 3² = 9`, `The 3 underneath means cube root. The 2 on top means square.`],
              [`9<sup>−1/2</sup> = 1 ÷ √9 = ${fr(1, 3)}`, `The minus sign flips it. The ½ means square root.`],
              [`9 × ${fr(1, 3)} = 3`, `Multiply the two results.`]
            ]
          },
          tryit: {
            q: `Solve 2<sup>x+1</sup> = 32.`,
            given: [`32 = 2<sup>5</sup>`, `So 2<sup>x+1</sup> = 2<sup>5</sup>. The bases match, so the indices are equal: x + 1 = 5`],
            ask: `x = ?`, o: ['3', '4', '5', '6'], a: 1,
            h: `Take 1 from both sides of x + 1 = 5.`, e: `x + 1 = 5, so x = 4. Check: 2<sup>5</sup> = 32.`
          }
        },
        {
          title: 'Logarithms',
          idea: `A logarithm is an index in disguise. log<sub>2</sub> 8 = 3 because 2³ = 8. Always ask yourself: what power of the base gives this number?`,
          rules: [
            `log<sub>a</sub> (xy) = log<sub>a</sub> x + log<sub>a</sub> y`,
            `log<sub>a</sub> (x ÷ y) = log<sub>a</sub> x − log<sub>a</sub> y`,
            `log<sub>a</sub> (x<sup>n</sup>) = n log<sub>a</sub> x`,
            `log<sub>a</sub> a = 1 and log<sub>a</sub> 1 = 0`
          ],
          ex: {
            q: `Evaluate log<sub>3</sub> 54 − log<sub>3</sub> 2.`,
            steps: [
              [`log<sub>3</sub> (54 ÷ 2)`, `Subtracting logs with the same base means dividing the numbers.`],
              [`log<sub>3</sub> 27`, `54 ÷ 2 = 27.`],
              [`27 = 3³, so the answer is 3`, `The log is the power of 3 that gives 27.`]
            ]
          },
          tryit: {
            q: `Evaluate log<sub>10</sub> 25 + log<sub>10</sub> 4.`,
            given: [`log<sub>10</sub> (25 × 4)`, `log<sub>10</sub> 100`],
            ask: `= ?`, o: ['1', '2', '10', '100'], a: 1,
            h: `What power of 10 gives 100?`, e: `10² = 100, so log<sub>10</sub> 100 = 2.`
          }
        }
      ],
      trap: `log (x + y) is not log x + log y. The laws only work for multiplying, dividing and powers.`,
      qs: [
        { l: 1, q: `Simplify 3² × 3³.`, o: ['3<sup>5</sup>', '3<sup>6</sup>', '9<sup>5</sup>', '9<sup>6</sup>'], a: 0, e: `Same base, so add the indices: 3<sup>2+3</sup> = 3<sup>5</sup>.` },
        { l: 1, q: `Evaluate 5<sup>0</sup> + 2<sup>−1</sup>.`, o: ['0', '½', '1½', '3'], a: 2, e: `5<sup>0</sup> = 1 and 2<sup>−1</sup> = ½, so the sum is 1½.` },
        { l: 2, dx: 1, q: `Evaluate 16<sup>3/4</sup>.`, o: ['6', '8', '12', '64'], a: 1, e: `Take the fourth root first, then cube: 16<sup>1/4</sup> = 2, and 2³ = 8.` },
        { l: 2, q: `Evaluate log<sub>2</sub> 32.`, o: ['4', '5', '6', '16'], a: 1, e: `2<sup>5</sup> = 32, so log<sub>2</sub> 32 = 5.` },
        { l: 2, q: `Simplify (2x²)<sup>3</sup>.`, o: ['6x<sup>5</sup>', '6x<sup>6</sup>', '8x<sup>5</sup>', '8x<sup>6</sup>'], a: 3, e: `Cube both parts: 2³ = 8 and (x²)<sup>3</sup> = x<sup>6</sup>. The answer is 8x<sup>6</sup>.` },
        { l: 3, dx: 1, q: `Solve 3<sup>2x</sup> = 81.`, o: ['2', '3', '4', '9'], a: 0, e: `81 = 3<sup>4</sup>, so 2x = 4 and x = 2.` },
        { l: 3, q: `Evaluate log<sub>5</sub> 50 − log<sub>5</sub> 2.`, o: ['1', '2', '5', '25'], a: 1, e: `log<sub>5</sub> 50 − log<sub>5</sub> 2 = log<sub>5</sub> (50 ÷ 2) = log<sub>5</sub> 25 = 2.` },
        { l: 3, q: `Simplify (${fr(8, 27)})<sup>−2/3</sup>.`, o: [fr(2, 3), fr(3, 2), fr(4, 9), fr(9, 4)], a: 3, e: `The negative index flips the fraction to 27/8. The cube roots give 3/2, and squaring gives 9/4.` },
        { l: 4, q: `Solve 4<sup>x</sup> = 8.`, o: [fr(2, 3), fr(3, 2), '2', '3'], a: 1, e: `Write both sides as powers of 2: 2<sup>2x</sup> = 2<sup>3</sup>. So 2x = 3 and x = 3/2.` },
        { l: 4, q: `If log<sub>10</sub> 2 = 0.3010, find log<sub>10</sub> 8.`, o: ['2.4080', '1.2040', '0.9030', '0.6020'], a: 2, e: `8 = 2³, so log<sub>10</sub> 8 = 3 × log<sub>10</sub> 2 = 3 × 0.3010 = 0.9030.` },
        { l: 5, q: `Solve log<sub>2</sub> (x + 3) = 3.`, o: ['0', '3', '5', '6'], a: 2, e: `Change to index form: x + 3 = 2³ = 8, so x = 5.` },
        { l: 5, q: `Solve 9<sup>x</sup> = 27<sup>x − 1</sup>.`, o: ['−3', '1', '2', '3'], a: 3, e: `Write both sides as powers of 3: 3<sup>2x</sup> = 3<sup>3x − 3</sup>. So 2x = 3x − 3 and x = 3. Check: 9³ = 729 and 27² = 729.` }
      ]
    },

    /* ───────────── 3. QUADRATIC EQUATIONS ───────────── */
    {
      id: 'quad', name: 'Quadratic Equations', sec: 'Section II · Algebra', boss: 'The Quadratic Beast',
      goals: ['Solve quadratic equations by factorising and by formula', 'Use the sum and product of roots without solving', 'Build a quadratic equation from its roots'],
      parts: [
        {
          title: 'Solving by factorising',
          idea: `A quadratic equation has x² as its highest power: ax² + bx + c = 0. Its solutions are called roots. On a graph, the roots are where the curve crosses the x-axis.`,
          g: ['parab', { a: 1, b: -5, c: 6, ax: [-1, 6, -2, 7], pl: [0, 5], roots: [2, 3], label: 'Graph of y = x² − 5x + 6 crossing the x-axis at 2 and 3' }],
          cap: `y = x² − 5x + 6 crosses the x-axis at x = 2 and x = 3. Those are the roots.`,
          rules: [
            `When a = 1, look for two numbers that multiply to give c and add to give b.`,
            `Write the brackets, then set each bracket equal to 0.`,
            `If it will not factorise, use the formula: x = (−b ± √(b² − 4ac)) ÷ 2a.`
          ],
          ex: {
            q: `Solve x² − 5x + 6 = 0.`,
            steps: [
              [`Product +6 and sum −5: the numbers are −2 and −3`, `(−2) × (−3) = +6 and (−2) + (−3) = −5.`],
              [`(x − 2)(x − 3) = 0`, `Put the two numbers in the brackets.`],
              [`x = 2 or x = 3`, `Each bracket equals 0 in turn.`]
            ]
          },
          tryit: {
            q: `Solve x² + x − 12 = 0.`,
            given: [`Product −12 and sum +1: the numbers are +4 and −3`, `(x + 4)(x − 3) = 0`],
            ask: `x = ?`, o: ['4 or −3', '−4 or 3', '−4 or −3', '4 or 3'], a: 1,
            h: `Set each bracket to 0. What value of x makes x + 4 equal to 0?`, e: `x + 4 = 0 gives x = −4, and x − 3 = 0 gives x = 3.`
          }
        },
        {
          title: 'Sum and product of roots',
          idea: `You can know facts about the roots without solving the equation. For ax² + bx + c = 0 with roots α and β, these two results always hold.`,
          rules: [
            `Sum of roots: α + β = −b ÷ a`,
            `Product of roots: αβ = c ÷ a`,
            `To build an equation from its roots: x² − (sum)x + (product) = 0`
          ],
          ex: {
            q: `Find the quadratic equation whose roots are 2 and −5.`,
            steps: [
              [`Sum = 2 + (−5) = −3`, `Add the roots.`],
              [`Product = 2 × (−5) = −10`, `Multiply the roots.`],
              [`x² − (−3)x + (−10) = 0, so x² + 3x − 10 = 0`, `Substitute into x² − (sum)x + (product) = 0.`]
            ]
          },
          tryit: {
            q: `Find the product of the roots of 2x² − 8x + 6 = 0.`,
            given: [`a = 2, b = −8, c = 6`, `Product of roots = c ÷ a`],
            ask: `= ?`, o: ['6', '4', '3', '−3'], a: 2,
            h: `Divide c by a.`, e: `c ÷ a = 6 ÷ 2 = 3.`
          }
        }
      ],
      trap: `Watch the sign. The sum of the roots is −b ÷ a, not b ÷ a. For x² − 7x + 10 = 0 the sum is +7.`,
      qs: [
        { l: 1, q: `Which of these is a quadratic equation?`, o: ['2x + 3 = 0', 'x² − 4 = 0', 'x³ + x = 0', `${fr(1, 'x')} = 2`], a: 1, e: `A quadratic has x² as its highest power. Only x² − 4 = 0 fits.` },
        { l: 1, q: `Solve (x − 1)(x + 4) = 0.`, o: ['x = −1 or 4', 'x = 1 or 4', 'x = 1 or −4', 'x = −1 or −4'], a: 2, e: `Each bracket can be zero: x − 1 = 0 gives x = 1, and x + 4 = 0 gives x = −4.` },
        { l: 2, dx: 1, q: `Solve x² − 7x + 12 = 0.`, o: ['x = 3 or 4', 'x = −3 or −4', 'x = 2 or 6', 'x = 1 or 12'], a: 0, e: `Two numbers with product 12 and sum −7 are −3 and −4. So (x − 3)(x − 4) = 0 and x = 3 or 4.` },
        { l: 2, q: `Solve x² − 9 = 0.`, o: ['x = 3 only', 'x = 9 only', 'x = ±9', 'x = ±3'], a: 3, e: `x² = 9, so x = +3 or −3. Do not forget the negative root.` },
        { l: 2, q: `Factorise x² + 5x + 6.`, o: ['(x + 1)(x + 6)', '(x + 2)(x + 3)', '(x − 2)(x − 3)', '(x + 6)(x − 1)'], a: 1, e: `2 and 3 multiply to give 6 and add to give 5, so the factors are (x + 2)(x + 3).` },
        { l: 3, q: `Solve 2x² + 5x − 3 = 0.`, o: ['x = −½ or 3', 'x = ½ or 3', 'x = ½ or −3', 'x = 1 or −3'], a: 2, e: `Factorise: (2x − 1)(x + 3) = 0. Then 2x − 1 = 0 gives x = ½, and x + 3 = 0 gives x = −3.` },
        { l: 3, dx: 1, q: `Find the sum of the roots of 3x² − 6x + 2 = 0.`, o: ['−2', fr(2, 3), '2', '6'], a: 2, e: `Sum of roots = −b ÷ a = −(−6) ÷ 3 = 2.` },
        { l: 3, q: `The curve y = x² − 2x − 3 is shown. What are the roots of x² − 2x − 3 = 0?`, g: ['parab', { a: 1, b: -2, c: -3, ax: [-3, 5, -5, 6], pl: [-2, 4], label: 'Graph of y = x² − 2x − 3 on an x-axis numbered from −3 to 5' }], o: ['x = −1 and 3', 'x = 1 and −3', 'x = −3 and −1', 'x = 1 and 3'], a: 0, e: `The roots are where the curve crosses the x-axis, at x = −1 and x = 3. Check: (x + 1)(x − 3) = x² − 2x − 3.` },
        { l: 4, q: `Find the quadratic equation whose roots are −2 and 3.`, o: ['x² + x − 6 = 0', 'x² − x − 6 = 0', 'x² − x + 6 = 0', 'x² + x + 6 = 0'], a: 1, e: `Sum = 1 and product = −6. Using x² − (sum)x + (product) = 0 gives x² − x − 6 = 0.` },
        { l: 4, q: `Solve x² − 4x − 1 = 0, leaving your answer in surd form.`, o: ['2 ± √3', '−2 ± √5', '4 ± √5', '2 ± √5'], a: 3, e: `x = (4 ± √(16 + 4)) ÷ 2 = (4 ± √20) ÷ 2. Since √20 = 2√5, x = 2 ± √5.` },
        { l: 5, q: `For what value of k does x² − 6x + k = 0 have equal roots?`, o: ['6', '9', '12', '36'], a: 1, e: `Equal roots need b² = 4ac. Here 36 = 4k, so k = 9.` },
        { l: 5, q: `If α and β are the roots of x² − 5x + 3 = 0, find α² + β².`, o: ['19', '22', '25', '31'], a: 0, e: `α + β = 5 and αβ = 3. Then α² + β² = (α + β)² − 2αβ = 25 − 6 = 19.` }
      ]
    },

    /* ───────────── 4. ANGLES, TRIANGLES AND CIRCLES ───────────── */
    {
      id: 'geom', name: 'Angles, Triangles and Circles', sec: 'Section III · Geometry and Trigonometry', boss: 'The Angle Warden',
      goals: ['Use angle facts for straight lines, parallel lines and triangles', 'Find angles and the number of sides of polygons', 'Apply the main circle theorems'],
      parts: [
        {
          title: 'Lines and triangles',
          idea: `Most geometry questions are solved with a handful of angle facts. The skill is spotting which fact the diagram is showing you.`,
          g: ['tri', { A: 50, B: 60, a: '50°', c: '70°', e: '120°', label: 'Triangle with interior angles 50° and 70° and an exterior angle of 120° at the third corner' }],
          cap: `The exterior angle (120°) equals the two opposite interior angles added together: 50° + 70°.`,
          rules: [
            `Angles on a straight line add up to 180°.`,
            `Angles in a triangle add up to 180°.`,
            `An exterior angle of a triangle equals the sum of the two opposite interior angles.`,
            `With parallel lines, alternate angles are equal and corresponding angles are equal.`
          ],
          ex: {
            q: `Find the angle marked x.`,
            g: ['tri', { A: 48, B: 67, a: '48°', b: '67°', c: 'x', label: 'Triangle with angles 48°, 67° and x' }],
            steps: [
              [`x + 48° + 67° = 180°`, `Angles in a triangle add up to 180°.`],
              [`x + 115° = 180°`, `Add the two known angles.`],
              [`x = 65°`, `Subtract 115° from both sides.`]
            ]
          },
          tryit: {
            q: `Find the angle marked y.`,
            g: ['tri', { A: 55, B: 50, a: '55°', c: 'y', e: '130°', label: 'Triangle with interior angles 55° and y, and an exterior angle of 130° at the third corner' }],
            given: [`Exterior angle = sum of the two opposite interior angles`, `130° = 55° + y`],
            ask: `y = ?`, o: ['55°', '65°', '75°', '125°'], a: 2,
            h: `Take 55° away from 130°.`, e: `y = 130° − 55° = 75°.`
          }
        },
        {
          title: 'Polygons and circles',
          idea: `Circle theorems link angles that stand on the same arc. Polygons have their own rule for the total of their angles.`,
          g: ['circ', { pts: { A: 220, B: 320, P: 80 }, segs: [['O', 'A'], ['O', 'B'], ['P', 'A'], ['P', 'B']], marks: [['O', 'A', 'B', '100°'], ['P', 'A', 'B', '50°']], label: 'Circle with centre O. Angle AOB at the centre is 100° and angle APB at the circumference is 50°' }],
          cap: `Both angles stand on arc AB. The angle at the centre (100°) is twice the angle at the circumference (50°).`,
          rules: [
            `Interior angles of an n-sided polygon add up to (n − 2) × 180°. Exterior angles always add up to 360°.`,
            `The angle at the centre is twice the angle at the circumference on the same arc.`,
            `The angle in a semicircle is 90°.`,
            `Opposite angles of a cyclic quadrilateral add up to 180°.`
          ],
          ex: {
            q: `Each interior angle of a regular polygon is 140°. How many sides does it have?`,
            steps: [
              [`Exterior angle = 180° − 140° = 40°`, `Interior and exterior angles sit together on a straight line.`],
              [`Exterior angles add up to 360°`, `This is true for every polygon.`],
              [`n = 360 ÷ 40 = 9 sides`, `In a regular polygon all the exterior angles are equal.`]
            ]
          },
          tryit: {
            q: `O is the centre of the circle. Find the angle marked x.`,
            g: ['circ', { pts: { A: 208, B: 332, P: 100 }, segs: [['O', 'A'], ['O', 'B'], ['P', 'A'], ['P', 'B']], marks: [['O', 'A', 'B', '124°'], ['P', 'A', 'B', 'x']], label: 'Circle with centre O. Angle AOB at the centre is 124° and angle APB at the circumference is x' }],
            given: [`Angle at the centre = 2 × angle at the circumference`, `124° = 2 × x`],
            ask: `x = ?`, o: ['248°', '124°', '62°', '56°'], a: 2,
            h: `Halve the angle at the centre.`, e: `x = 124° ÷ 2 = 62°.`
          }
        }
      ],
      trap: `Check where each angle sits. The "twice" rule only works when the angle at the centre and the angle at the circumference stand on the same arc.`,
      qs: [
        { l: 1, q: `Two angles on a straight line are 110° and x. Find x.`, o: ['70°', '80°', '110°', '250°'], a: 0, e: `Angles on a straight line add up to 180°, so x = 180° − 110° = 70°.` },
        { l: 1, q: `Two angles of a triangle are 40° and 60°. Find the third angle.`, o: ['70°', '80°', '90°', '100°'], a: 1, e: `180° − (40° + 60°) = 80°.` },
        { l: 2, dx: 1, q: `Find the angle marked x.`, g: ['tri', { A: 52, B: 73, a: '52°', b: '73°', c: 'x', label: 'Triangle with angles 52°, 73° and x' }], o: ['45°', '55°', '65°', '125°'], a: 1, e: `Angles in a triangle add up to 180°, so x = 180° − (52° + 73°) = 55°.` },
        { l: 2, q: `PQ is parallel to RS. Find the angle marked x.`, g: ['par', { t: 65, top: '65°', bot: 'x', label: 'Parallel lines PQ and RS cut by a slanted line. The alternate angles are marked 65° and x' }], o: ['25°', '115°', '65°', '130°'], a: 2, e: `x and the 65° angle are alternate angles between parallel lines, so they are equal. x = 65°.` },
        { l: 2, q: `What is the sum of the interior angles of a pentagon?`, o: ['360°', '450°', '540°', '720°'], a: 2, e: `(n − 2) × 180° = (5 − 2) × 180° = 540°.` },
        { l: 3, q: `Find the exterior angle marked x.`, g: ['tri', { A: 48, B: 65, a: '48°', c: '67°', e: 'x', label: 'Triangle with interior angles 48° and 67°. The exterior angle at the third corner is x' }], o: ['115°', '105°', '65°', '125°'], a: 0, e: `An exterior angle equals the sum of the two opposite interior angles, so x = 48° + 67° = 115°.` },
        { l: 3, dx: 1, q: `O is the centre of the circle and ∠APB = 38°. Find the angle marked x.`, g: ['circ', { pts: { A: 232, B: 308, P: 95 }, segs: [['O', 'A'], ['O', 'B'], ['P', 'A'], ['P', 'B']], marks: [['P', 'A', 'B', '38°'], ['O', 'A', 'B', 'x']], label: 'Circle with centre O. Angle APB at the circumference is 38° and angle AOB at the centre is x' }], o: ['19°', '38°', '76°', '142°'], a: 2, e: `The angle at the centre is twice the angle at the circumference on the same arc, so x = 2 × 38° = 76°.` },
        { l: 3, q: `Each exterior angle of a regular polygon is 30°. How many sides does it have?`, o: ['12', '10', '6', '15'], a: 0, e: `Exterior angles add up to 360°, so n = 360 ÷ 30 = 12.` },
        { l: 4, q: `AB is a diameter of the circle with centre O. Find the angle marked x.`, g: ['circ', { pts: { A: 180, B: 0, C: 110 }, segs: [['A', 'B'], ['A', 'C'], ['B', 'C']], marks: [['B', 'A', 'C', '35°'], ['A', 'B', 'C', 'x']], oOff: [0, 14], label: 'Circle with diameter AB and a point C on the circumference. Angle ABC is 35° and angle BAC is x' }], o: ['65°', '55°', '45°', '35°'], a: 1, e: `The angle in a semicircle is 90°, so ∠ACB = 90°. Then x = 180° − 90° − 35° = 55°.` },
        { l: 4, q: `PQRS is a cyclic quadrilateral and ∠P = 82°. Find ∠R.`, o: ['278°', '108°', '82°', '98°'], a: 3, e: `Opposite angles of a cyclic quadrilateral add up to 180°, so ∠R = 180° − 82° = 98°.` },
        { l: 5, q: `The angles of a quadrilateral are x, 2x, 3x and 4x. Find the largest angle.`, o: ['36°', '108°', '144°', '160°'], a: 2, e: `x + 2x + 3x + 4x = 360°, so 10x = 360° and x = 36°. The largest angle is 4x = 144°.` },
        { l: 5, q: `O is the centre of the circle and ∠OAB = 28°. Find the angle marked x.`, g: ['circ', { pts: { A: 208, B: 332, P: 90 }, segs: [['O', 'A'], ['O', 'B'], ['A', 'B'], ['P', 'A'], ['P', 'B']], marks: [['A', 'O', 'B', '28°'], ['P', 'A', 'B', 'x']], oOff: [0, -13], label: 'Circle with centre O and chord AB. Angle OAB is 28°. Angle APB at the circumference is x' }], o: ['56°', '62°', '76°', '124°'], a: 1, e: `OA = OB because both are radii, so triangle OAB is isosceles and ∠AOB = 180° − (2 × 28°) = 124°. The angle at the circumference is half the angle at the centre, so x = 62°.` }
      ]
    },

    /* ───────────── 5. AVERAGES AND CHARTS ───────────── */
    {
      id: 'stats', name: 'Averages and Charts', sec: 'Section V · Statistics', boss: 'The Mean Machine',
      goals: ['Find the mean, median, mode and range of a set of data', 'Read bar charts and pie charts', 'Find the mean from a frequency table'],
      parts: [
        {
          title: 'Mean, median and mode',
          idea: `These are three ways to describe the middle of a set of data. Exams can ask for any of them, so be sure which is which.`,
          rules: [
            `Mean = sum of the values ÷ number of values.`,
            `Median = the middle value once the data is in order. With an even count, take the mean of the two middle values.`,
            `Mode = the value that appears most often.`,
            `Range = highest value − lowest value.`
          ],
          ex: {
            q: `Find the median of 7, 3, 9, 4, 8, 3.`,
            steps: [
              [`In order: 3, 3, 4, 7, 8, 9`, `Always arrange the data first.`],
              [`Six values, so the middle two are 4 and 7`, `These are the 3rd and 4th values.`],
              [`Median = (4 + 7) ÷ 2 = 5.5`, `Take the mean of the two middle values.`]
            ]
          },
          tryit: {
            q: `Find the mean of 4, 6, 9, 5, 6.`,
            given: [`Sum = 4 + 6 + 9 + 5 + 6 = 30`, `There are 5 values`],
            ask: `Mean = ?`, o: ['5', '6', '7', '30'], a: 1,
            h: `Divide the sum by the number of values.`, e: `30 ÷ 5 = 6.`
          }
        },
        {
          title: 'Charts and frequency tables',
          idea: `Frequency means how many times a value occurs. A bar chart shows frequency as height. A pie chart shares out 360° in proportion to frequency.`,
          g: BAR15, cap: `Marks of 15 students in a quiz. The tallest bar is at 3, so the mode is 3.`,
          rules: [
            `Bar chart: the height of a bar is the frequency. The tallest bar gives the mode.`,
            `Pie chart: sector angle = (frequency ÷ total) × 360°.`,
            `Mean from a frequency table = Σfx ÷ Σf. Multiply each value by its frequency before adding.`
          ],
          ex: {
            q: `The bar chart shows the marks of 15 students in a quiz. Find the mean mark.`, g: BAR15,
            steps: [
              [`Σf = 2 + 3 + 5 + 4 + 1 = 15`, `Add the heights to get the number of students.`],
              [`Σfx = (1 × 2) + (2 × 3) + (3 × 5) + (4 × 4) + (5 × 1) = 44`, `Each mark times the number of students who scored it.`],
              [`Mean = 44 ÷ 15 ≈ 2.93`, `Divide Σfx by Σf.`]
            ]
          },
          tryit: {
            q: `In a class of 40 students, 10 chose Physics. What angle represents Physics on a pie chart?`,
            given: [`Fraction = 10 ÷ 40 = ¼`, `Angle = ¼ × 360°`],
            ask: `= ?`, o: ['40°', '45°', '90°', '100°'], a: 2,
            h: `What is a quarter of 360°?`, e: `¼ × 360° = 90°.`
          }
        }
      ],
      trap: `Arrange the data in order before you find the median. Exam questions give it jumbled on purpose.`,
      qs: [
        { l: 1, q: `Find the mode of 2, 5, 3, 5, 7, 5, 3.`, o: ['2', '3', '5', '7'], a: 2, e: `5 appears three times, more often than any other value.` },
        { l: 1, q: `Find the range of 12, 7, 15, 9, 4.`, o: ['11', '8', '9', '19'], a: 0, e: `Range = highest − lowest = 15 − 4 = 11.` },
        { l: 2, dx: 1, q: `Find the mean of 3, 7, 8, 10, 12.`, o: ['7', '8', '9', '10'], a: 1, e: `The sum is 40 and there are 5 values, so the mean is 40 ÷ 5 = 8.` },
        { l: 2, q: `Find the median of 9, 2, 7, 4, 6.`, o: ['7', '4', '6', '5.6'], a: 2, e: `In order: 2, 4, 6, 7, 9. The middle value is 6. (7 is only the middle of the jumbled list, and 5.6 is the mean.)` },
        { l: 2, q: `The bar chart shows the shoe sizes of a group of students. What is the modal shoe size?`, g: ['bars', { x: [38, 39, 40, 41, 42], f: [3, 6, 8, 5, 2], xl: 'Shoe size', yl: 'Students', label: 'Bar chart of shoe sizes: size 38, 3 students; 39, 6 students; 40, 8 students; 41, 5 students; 42, 2 students' }], o: ['8', '38', '40', '42'], a: 2, e: `The tallest bar is at size 40, so the mode is 40. (8 is the number of students who wear that size, not the size.)` },
        { l: 3, q: `The bar chart shows the marks scored by 20 students in a quiz. Find the mean mark.`, g: ['bars', { x: [1, 2, 3, 4, 5], f: [2, 4, 6, 5, 3], xl: 'Mark', yl: 'Students', label: 'Bar chart of quiz marks: mark 1, 2 students; mark 2, 4 students; mark 3, 6 students; mark 4, 5 students; mark 5, 3 students' }], o: ['3.5', '3.0', '4.0', '3.15'], a: 3, e: `Σfx = (1 × 2) + (2 × 4) + (3 × 6) + (4 × 5) + (5 × 3) = 63. Mean = 63 ÷ 20 = 3.15.` },
        { l: 3, q: `The pie chart shows how 120 students travel to school. How many students walk?`, g: ['pie', { s: [['Bus', 150], ['Walk', 90], ['Bike', 60], ['Car', 60]], label: 'Pie chart of travel to school: Bus 150°, Walk 90°, Bike 60°, Car 60°' }], o: ['20', '30', '40', '90'], a: 1, e: `Walk has a 90° sector, and 90 ÷ 360 = ¼ of the students. ¼ × 120 = 30.` },
        { l: 3, dx: 1, q: `The mean of five numbers is 8. Four of the numbers are 6, 9, 7 and 10. Find the fifth number.`, o: ['6', '7', '8', '9'], a: 2, e: `The total is 5 × 8 = 40. The four known numbers add up to 32, so the fifth is 40 − 32 = 8.` },
        { l: 4, q: `Find the mean of the distribution in the table.`, g: ['ftable', { x: [1, 2, 3, 4], f: [3, 5, 8, 4], label: 'Frequency table: x = 1, 2, 3, 4 with frequencies 3, 5, 8, 4' }], o: ['2.65', '2.5', '2.75', '3.0'], a: 0, e: `Σf = 20 and Σfx = 3 + 10 + 24 + 16 = 53. Mean = 53 ÷ 20 = 2.65.` },
        { l: 4, q: `A sector of a pie chart has an angle of 72° and represents 18 students. How many students are there altogether?`, o: ['54', '72', '90', '108'], a: 2, e: `72° is 72 ÷ 360 = ⅕ of the circle. If ⅕ is 18 students, the total is 5 × 18 = 90.` },
        { l: 5, q: `The mean of 3, 5, x, 9 and 11 is 7. Find the median.`, o: ['5', '7', '8', '9'], a: 1, e: `The total is 5 × 7 = 35, so x = 35 − 28 = 7. In order: 3, 5, 7, 9, 11. The median is 7.` },
        { l: 5, q: `The mean age of 4 boys is 15 years. A fifth boy joins and the mean becomes 16 years. How old is the fifth boy?`, o: ['16', '17', '19', '20'], a: 3, e: `Total age before = 4 × 15 = 60. Total after = 5 × 16 = 80. The fifth boy is 80 − 60 = 20 years old.` }
      ]
    }
  ]
};


/* Road to Campus content, batch 2: five more Mathematics topics from the JAMB syllabus.
   Same format as content.js. Matrices are written with mx([[row],[row]]) and determinants with det(...). */
const mx = (rows, cls = 'mx') => `<span class="${cls}">${rows.map(r => `<span class="mr">${r.map(v => `<span>${v}</span>`).join('')}</span>`).join('')}</span>`;
const det = rows => mx(rows, 'dt');
const PI7 = `Take π = ${fr(22, 7)}.`;
const DYDX = fr('dy', 'dx');

CONTENT.topics.push(

  /* ───────────── TRIGONOMETRY ───────────── */
  {
    id: 'trig', name: 'Trigonometry', sec: 'Section III · Geometry and Trigonometry', boss: 'The Sine Serpent',
    goals: ['Use sine, cosine and tangent in right-angled triangles', 'Know the exact ratios for 30°, 45° and 60°', 'Solve angle of elevation problems and use the sine and cosine rules'],
    parts: [
      {
        title: 'The three ratios: SOH CAH TOA',
        idea: `In a right-angled triangle, the sides are named from the angle you are working with. The hypotenuse is the longest side, the opposite side faces the angle, and the adjacent side is next to it.`,
        g: ['rtri', { b: 4, h: 3, base: 'adjacent = 4', ht: 'opposite = 3', hyp: 'hypotenuse = 5', ang: 'θ', label: 'Right-angled triangle with angle θ, adjacent side 4, opposite side 3 and hypotenuse 5' }],
        cap: `For the angle θ: sin θ = 3/5, cos θ = 4/5 and tan θ = 3/4.`,
        rules: [
          `SOH: sin θ = opposite ÷ hypotenuse`,
          `CAH: cos θ = adjacent ÷ hypotenuse`,
          `TOA: tan θ = opposite ÷ adjacent`,
          `Pythagoras links the three sides: hypotenuse² = opposite² + adjacent²`
        ],
        ex: {
          q: `Find x in the triangle.`,
          g: ['rtri', { b: 8.66, h: 5, hyp: '10 cm', ht: 'x', ang: '30°', label: 'Right-angled triangle with hypotenuse 10 cm, an angle of 30° and the side opposite it marked x' }],
          steps: [
            [`x is opposite the 30° angle, and 10 cm is the hypotenuse`, `Name the side you know and the side you want.`],
            [`sin 30° = x ÷ 10`, `Opposite and hypotenuse means SOH.`],
            [`x = 10 × sin 30° = 10 × ½ = 5 cm`, `sin 30° = ½.`]
          ]
        },
        tryit: {
          q: `tan θ = ${fr(5, 12)} and θ is acute. Find cos θ.`,
          g: ['rtri', { b: 12, h: 5, base: '12', ht: '5', hyp: '?', ang: 'θ', label: 'Right-angled triangle with angle θ, adjacent side 12, opposite side 5 and unknown hypotenuse' }],
          given: [`tan θ = opposite ÷ adjacent, so opposite = 5 and adjacent = 12`, `Hypotenuse = √(5² + 12²) = √169 = 13`],
          ask: `cos θ = adjacent ÷ hypotenuse = ?`, o: [fr(5, 13), fr(12, 13), fr(5, 12), fr(13, 12)], a: 1,
          h: `The adjacent side is 12 and the hypotenuse is 13.`, e: `cos θ = 12/13.`
        }
      },
      {
        title: 'Special angles, elevation and the two rules',
        idea: `Some angles have exact ratios that you are expected to know without a calculator. They appear in angle of elevation questions, where you look up from the ground to the top of something.`,
        g: ['rtri', { b: 5, h: 3, base: 'distance', ht: 'height', hyp: 'line of sight', ang: 'e', label: 'Right-angled triangle showing an angle of elevation e between the ground distance and the line of sight to the top of a height' }],
        cap: `The angle of elevation e is measured up from the horizontal. tan e = height ÷ distance.`,
        rules: [
          `sin 30° = ½, cos 30° = √3/2, tan 30° = 1/√3`,
          `sin 45° = cos 45° = 1/√2, tan 45° = 1`,
          `sin 60° = √3/2, cos 60° = ½, tan 60° = √3`,
          `Angles of elevation and depression are both measured from the horizontal.`,
          `For any triangle. Sine rule: a ÷ sin A = b ÷ sin B. Cosine rule: a² = b² + c² − 2bc cos A`
        ],
        ex: {
          q: `From a point 20 m from the foot of a tower, the angle of elevation of the top is 60°. Find the height of the tower.`,
          g: ['rtri', { b: 1, h: 1.732, base: '20 m', ht: 'h', ang: '60°', label: 'Right-angled triangle with base 20 m, angle of elevation 60° and height h' }],
          steps: [
            [`The height h is opposite 60°, and 20 m is adjacent`, `Opposite and adjacent means TOA.`],
            [`tan 60° = h ÷ 20`, `Write the ratio.`],
            [`h = 20 × √3 = 20√3 m`, `tan 60° = √3. That is about 34.6 m.`]
          ]
        },
        tryit: {
          q: `A ladder 10 m long leans against a wall and makes an angle of 60° with the ground. How far is the foot of the ladder from the wall?`,
          g: ['rtri', { b: 1, h: 1.732, base: 'd', hyp: '10 m', ang: '60°', label: 'Ladder of length 10 m leaning on a wall at 60° to the ground. The distance from the wall is d' }],
          given: [`The ladder is the hypotenuse, and the distance d is adjacent to 60°`, `cos 60° = d ÷ 10`],
          ask: `d = 10 × cos 60° = ?`, o: ['5 m', '5√3 m', '10√3 m', '20 m'], a: 0,
          h: `cos 60° = ½.`, e: `d = 10 × ½ = 5 m.`
        }
      }
    ],
    trap: `Check which sides you are given before you choose a ratio. Mixing up opposite and adjacent is the most common mistake, and that wrong answer is usually among the options.`,
    qs: [
      { l: 1, q: `In a right-angled triangle, which ratio gives cos θ?`, o: ['opposite ÷ hypotenuse', 'adjacent ÷ hypotenuse', 'opposite ÷ adjacent', 'hypotenuse ÷ adjacent'], a: 1, e: `CAH: cos θ = adjacent ÷ hypotenuse.` },
      { l: 1, q: `What is the value of sin 30°?`, o: ['1', '√3/2', '½', '1/√2'], a: 2, e: `sin 30° = ½. It is one of the special angles to memorise.` },
      { l: 2, dx: 1, q: `Find tan θ in the triangle.`, g: ['rtri', { b: 4, h: 3, base: '4 cm', ht: '3 cm', hyp: '5 cm', ang: 'θ', label: 'Right-angled triangle with angle θ, adjacent side 4 cm, opposite side 3 cm and hypotenuse 5 cm' }], o: [fr(3, 5), fr(4, 5), fr(3, 4), fr(4, 3)], a: 2, e: `tan θ = opposite ÷ adjacent = 3/4.` },
      { l: 2, q: `Evaluate sin 60° × cos 30°.`, o: [fr(3, 4), fr(1, 2), fr(1, 4), '1'], a: 0, e: `sin 60° = √3/2 and cos 30° = √3/2. Their product is 3/4.` },
      { l: 2, q: `Find the length of the hypotenuse x.`, g: ['rtri', { b: 8, h: 6, base: '8 cm', ht: '6 cm', hyp: 'x', label: 'Right-angled triangle with shorter sides 8 cm and 6 cm and hypotenuse x' }], o: ['14 cm', '10 cm', '12 cm', '48 cm'], a: 1, e: `x² = 6² + 8² = 36 + 64 = 100, so x = 10 cm.` },
      { l: 3, dx: 1, q: `Find x in the triangle.`, g: ['rtri', { b: 10.39, h: 6, hyp: '12 cm', ht: 'x', ang: '30°', label: 'Right-angled triangle with hypotenuse 12 cm, an angle of 30° and the side opposite it marked x' }], o: ['4 cm', '6 cm', '6√3 cm', '24 cm'], a: 1, e: `x is opposite 30° and 12 cm is the hypotenuse, so sin 30° = x ÷ 12 and x = 12 × ½ = 6 cm.` },
      { l: 3, q: `If sin θ = ${fr(5, 13)} and θ is acute, find cos θ.`, o: [fr(12, 13), fr(5, 12), fr(13, 12), fr(8, 13)], a: 0, e: `Opposite = 5 and hypotenuse = 13, so adjacent = √(13² − 5²) = √144 = 12. Then cos θ = 12/13.` },
      { l: 3, q: `From a point 30 m from the foot of a building, the angle of elevation of the top is 45°. Find the height of the building.`, g: ['rtri', { b: 1, h: 1, base: '30 m', ht: 'h', ang: '45°', label: 'Right-angled triangle with base 30 m, angle of elevation 45° and height h' }], o: ['30√3 m', '30√2 m', '30 m', '15 m'], a: 2, e: `tan 45° = height ÷ 30. Since tan 45° = 1, the height is 30 m.` },
      { l: 4, q: `In triangle ABC, a = 10 cm, angle A = 30° and angle B = 45°. Find b.`, o: ['5√2 cm', '10√2 cm', '10√3 cm', '20 cm'], a: 1, e: `Sine rule: b ÷ sin 45° = 10 ÷ sin 30°. So b = 10 × (1/√2) ÷ ½ = 20/√2 = 10√2 cm.` },
      { l: 4, q: `From the top of a cliff 50 m high, the angle of depression of a boat is 30°. How far is the boat from the foot of the cliff?`, o: ['25 m', `${fr(50, '√3')} m`, '50√3 m', '100 m'], a: 2, e: `The angle of depression equals the angle of elevation from the boat (alternate angles). tan 30° = 50 ÷ d, so d = 50 ÷ (1/√3) = 50√3 m.` },
      { l: 5, q: `In triangle ABC, b = 5 cm, c = 8 cm and angle A = 60°. Find a.`, o: ['7 cm', '√89 cm', '√129 cm', '9 cm'], a: 0, e: `Cosine rule: a² = 5² + 8² − (2 × 5 × 8 × cos 60°) = 89 − 40 = 49, so a = 7 cm.` },
      { l: 5, q: `Given that tan θ = ${fr(3, 4)} and θ is acute, evaluate ${fr('sin θ + cos θ', 'sin θ − cos θ')}.`, o: ['7', `−${fr(1, 7)}`, fr(1, 7), '−7'], a: 3, e: `The triangle is 3, 4, 5, so sin θ = 3/5 and cos θ = 4/5. The top is 7/5 and the bottom is −1/5, so the value is −7.` }
    ]
  },

  /* ───────────── MENSURATION ───────────── */
  {
    id: 'mens', name: 'Mensuration', sec: 'Section III · Geometry and Trigonometry', boss: 'The Volume Vulture',
    goals: ['Find the lengths of arcs and the areas of sectors', 'Find the areas of plane shapes such as triangles, trapeziums and circles', 'Find the surface areas and volumes of cylinders and cones'],
    parts: [
      {
        title: 'Circles, arcs and sectors',
        idea: `A sector is a slice of a circle. Its angle θ tells you what fraction of the full circle you have: θ out of 360°. Use that same fraction for both the arc length and the area.`,
        g: ['sector', { deg: 70, r: 'r', a: 'θ', arc: 'arc', label: 'A sector of a circle with radius r, angle θ at the centre and its arc' }],
        cap: `The sector is θ/360 of the whole circle.`,
        rules: [
          `Circumference = 2πr, and area of a circle = πr²`,
          `Length of arc = ${fr('θ', 360)} × 2πr`,
          `Area of sector = ${fr('θ', 360)} × πr²`,
          `Perimeter of a sector = arc length + 2r`
        ],
        ex: {
          q: `Find the length of an arc that subtends an angle of 90° at the centre of a circle of radius 14 cm. ${PI7}`,
          g: ['sector', { deg: 90, r: '14 cm', a: '90°', label: 'Sector with radius 14 cm and angle 90°' }],
          steps: [
            [`Fraction of the circle = 90 ÷ 360 = ¼`, `The angle tells you the fraction.`],
            [`Circumference = 2 × ${fr(22, 7)} × 14 = 88 cm`, `2πr for the full circle.`],
            [`Arc = ¼ × 88 = 22 cm`, `Take that fraction of the circumference.`]
          ]
        },
        tryit: {
          q: `Find the area of a sector of angle 60° in a circle of radius 6 cm. Leave your answer in terms of π.`,
          given: [`Fraction of the circle = 60 ÷ 360 = ${fr(1, 6)}`, `Area of the full circle = π × 6² = 36π cm²`],
          ask: `Area of sector = ${fr(1, 6)} × 36π = ?`, o: ['3π cm²', '6π cm²', '12π cm²', '36π cm²'], a: 1,
          h: `Divide 36π by 6.`, e: `36π ÷ 6 = 6π cm².`
        }
      },
      {
        title: 'Volumes and surface areas of solids',
        idea: `For a cylinder, the volume is the area of the circular end times the height. A cone holds exactly one third of the cylinder with the same base and height.`,
        g: ['solid', { kind: 'cyl', rn: 7, hn: 9, r: 'r', h: 'h', label: 'A cylinder with base radius r and height h' }],
        cap: `A cylinder: two circles of radius r joined by a curved surface of height h.`,
        rules: [
          `Cylinder: volume = πr²h, curved surface area = 2πrh`,
          `Cone: volume = ${fr(1, 3)}πr²h, curved surface area = πrl, where l is the slant height`,
          `Sphere: volume = ${fr(4, 3)}πr³, surface area = 4πr²`,
          `Trapezium: area = ½ × (sum of the parallel sides) × height`
        ],
        ex: {
          q: `Find the volume of a cylinder of radius 7 cm and height 10 cm. ${PI7}`,
          g: ['solid', { kind: 'cyl', rn: 7, hn: 10, r: '7 cm', h: '10 cm', label: 'Cylinder with radius 7 cm and height 10 cm' }],
          steps: [
            [`Volume = πr²h`, `Area of the circular end times the height.`],
            [`= ${fr(22, 7)} × 7 × 7 × 10`, `Substitute r = 7 and h = 10.`],
            [`= 22 × 7 × 10 = 1540 cm³`, `One 7 cancels with the 7 underneath.`]
          ]
        },
        tryit: {
          q: `Find the volume of a cone of radius 3 cm and height 7 cm. ${PI7}`,
          g: ['solid', { kind: 'cone', rn: 3, hn: 7, r: '3 cm', h: '7 cm', label: 'Cone with base radius 3 cm and height 7 cm' }],
          given: [`Volume = ${fr(1, 3)}πr²h`, `= ${fr(1, 3)} × ${fr(22, 7)} × 3 × 3 × 7`],
          ask: `= ?`, o: ['22 cm³', '66 cm³', '198 cm³', '462 cm³'], a: 1,
          h: `Cancel the 7s, then cancel one 3 with the ⅓. You are left with 22 × 3.`, e: `The 7s cancel and one 3 cancels with ⅓, leaving 22 × 3 = 66 cm³.`
        }
      }
    ],
    trap: `Read whether the question gives the radius or the diameter. If it gives the diameter, halve it before you use any formula.`,
    qs: [
      { l: 1, q: `Find the area of a rectangle 8 cm long and 5 cm wide.`, o: ['13 cm²', '26 cm²', '40 cm²', '80 cm²'], a: 2, e: `Area = length × width = 8 × 5 = 40 cm².` },
      { l: 1, q: `Find the circumference of a circle of radius 7 cm. ${PI7}`, o: ['22 cm', '44 cm', '154 cm', '308 cm'], a: 1, e: `Circumference = 2πr = 2 × 22/7 × 7 = 44 cm.` },
      { l: 2, dx: 1, q: `Find the area of a circle of radius 7 cm. ${PI7}`, o: ['44 cm²', '49 cm²', '154 cm²', '616 cm²'], a: 2, e: `Area = πr² = 22/7 × 7 × 7 = 154 cm².` },
      { l: 2, q: `Find the area of a triangle with base 10 cm and height 6 cm.`, o: ['30 cm²', '60 cm²', '16 cm²', '32 cm²'], a: 0, e: `Area = ½ × base × height = ½ × 10 × 6 = 30 cm².` },
      { l: 2, q: `Find the volume of the cylinder. ${PI7}`, g: ['solid', { kind: 'cyl', rn: 7, hn: 5, r: '7 cm', h: '5 cm', label: 'Cylinder with radius 7 cm and height 5 cm' }], o: ['110 cm³', '220 cm³', '1540 cm³', '770 cm³'], a: 3, e: `Volume = πr²h = 22/7 × 7 × 7 × 5 = 770 cm³.` },
      { l: 3, dx: 1, q: `Find the length of the arc of the sector. ${PI7}`, g: ['sector', { deg: 120, r: '21 cm', a: '120°', label: 'Sector with radius 21 cm and angle 120°' }], o: ['22 cm', '44 cm', '66 cm', '132 cm'], a: 1, e: `Arc = 120/360 × 2πr = ⅓ × 2 × 22/7 × 21 = ⅓ × 132 = 44 cm.` },
      { l: 3, q: `A trapezium has parallel sides of 6 cm and 10 cm, and the distance between them is 5 cm. Find its area.`, o: ['80 cm²', '300 cm²', '40 cm²', '30 cm²'], a: 2, e: `Area = ½ × (6 + 10) × 5 = ½ × 16 × 5 = 40 cm².` },
      { l: 3, q: `Find the area of a sector of angle 90° in a circle of radius 14 cm. ${PI7}`, o: ['154 cm²', '77 cm²', '308 cm²', '616 cm²'], a: 0, e: `Area = 90/360 × πr² = ¼ × 22/7 × 14 × 14 = ¼ × 616 = 154 cm².` },
      { l: 4, q: `Find the curved surface area of a cylinder of radius 7 cm and height 10 cm. ${PI7}`, o: ['220 cm²', '440 cm²', '1540 cm²', '748 cm²'], a: 1, e: `Curved surface area = 2πrh = 2 × 22/7 × 7 × 10 = 440 cm². (748 cm² would be the total surface area, including both ends.)` },
      { l: 4, q: `Find the curved surface area of the cone, in terms of π.`, g: ['solid', { kind: 'cone', rn: 6, hn: 8, r: '6 cm', h: '8 cm', l: 'l', label: 'Cone with base radius 6 cm, height 8 cm and slant height l' }], o: ['36π cm²', '48π cm²', '96π cm²', '60π cm²'], a: 3, e: `Slant height l = √(6² + 8²) = 10 cm. Curved surface area = πrl = π × 6 × 10 = 60π cm².` },
      { l: 5, q: `The volume of a cylinder is 1540 cm³ and its radius is 7 cm. Find its height. ${PI7}`, o: ['5 cm', '7 cm', '10 cm', '22 cm'], a: 2, e: `πr²h = 1540, so 22/7 × 49 × h = 154h = 1540 and h = 10 cm.` },
      { l: 5, q: `An arc of a circle of radius 21 cm has length 22 cm. Find the angle it subtends at the centre. ${PI7}`, o: ['60°', '30°', '45°', '90°'], a: 0, e: `Circumference = 2 × 22/7 × 21 = 132 cm. The arc is 22/132 = ⅙ of it, so the angle is ⅙ × 360° = 60°.` }
    ]
  },

  /* ───────────── COORDINATE GEOMETRY ───────────── */
  {
    id: 'coord', name: 'Coordinate Geometry', sec: 'Section III · Geometry and Trigonometry', boss: 'The Gradient Ghost',
    goals: ['Find the midpoint, distance and gradient between two points', 'Find the equation of a straight line', 'Use the rules for parallel and perpendicular lines'],
    parts: [
      {
        title: 'Midpoint, distance and gradient',
        idea: `Every point has an address (x, y). With two points you can find three things: the point halfway between them, how far apart they are, and how steep the line through them is.`,
        g: ['grid', { ax: [-1, 7, -1, 6], pts: [[1, 1, 'A(1, 1)', -8, -10, 'end'], [5, 4, 'B(5, 4)', 8, -10]], segs: [[1, 1, 5, 4]], steps: [[1, 1, 5, 4]], label: 'Points A(1, 1) and B(5, 4) joined by a line, with a run of 4 and a rise of 3' }],
        cap: `From A to B the run is 4 and the rise is 3, so the gradient is 3/4 and the distance is 5.`,
        rules: [
          `Midpoint = ( ${fr('x₁ + x₂', 2)} , ${fr('y₁ + y₂', 2)} )`,
          `Distance = √( (x₂ − x₁)² + (y₂ − y₁)² )`,
          `Gradient m = ${fr('y₂ − y₁', 'x₂ − x₁')}, which is rise ÷ run`
        ],
        ex: {
          q: `Find the distance between P(1, 2) and Q(7, 10).`,
          steps: [
            [`Run = 7 − 1 = 6 and rise = 10 − 2 = 8`, `Subtract the x-values, then the y-values.`],
            [`Distance = √(6² + 8²) = √(36 + 64)`, `Pythagoras on the run and the rise.`],
            [`= √100 = 10 units`, `Take the square root.`]
          ]
        },
        tryit: {
          q: `Find the gradient of the line joining A(2, 3) and B(6, 11).`,
          given: [`Rise = 11 − 3 = 8`, `Run = 6 − 2 = 4`],
          ask: `Gradient = rise ÷ run = ?`, o: ['½', '2', '4', '8'], a: 1,
          h: `Divide 8 by 4.`, e: `Gradient = 8 ÷ 4 = 2.`
        }
      },
      {
        title: 'Equations of straight lines',
        idea: `A straight line can be written as y = mx + c. The number m is the gradient, and c is where the line crosses the y-axis.`,
        g: ['grid', { ax: [-3, 4, -2, 6], lines: [[2, 1]], pts: [[0, 1, 'c = 1', 9, 7]], label: 'The line y = 2x + 1 crossing the y-axis at 1' }],
        cap: `The line y = 2x + 1 crosses the y-axis at 1 and rises 2 for every 1 across.`,
        rules: [
          `y = mx + c, where m is the gradient and c is the y-intercept`,
          `Through a point (x₁, y₁) with gradient m: y − y₁ = m(x − x₁)`,
          `Parallel lines have equal gradients: m₁ = m₂`,
          `Perpendicular lines have gradients that multiply to −1: m₁ × m₂ = −1`
        ],
        ex: {
          q: `Find the equation of the line through (2, 3) with gradient 4.`,
          steps: [
            [`y − 3 = 4(x − 2)`, `Use y − y₁ = m(x − x₁).`],
            [`y − 3 = 4x − 8`, `Open the bracket.`],
            [`y = 4x − 5`, `Add 3 to both sides.`]
          ]
        },
        tryit: {
          q: `A line is perpendicular to y = 2x + 5. What is its gradient?`,
          given: [`The gradient of y = 2x + 5 is 2`, `For perpendicular lines m₁ × m₂ = −1, so 2 × m = −1`],
          ask: `m = ?`, o: ['2', '−2', '½', '−½'], a: 3,
          h: `Divide −1 by 2.`, e: `m = −1 ÷ 2 = −½.`
        }
      }
    ],
    trap: `To read the gradient from an equation, first make y the subject. In 2y = 6x + 4 the gradient is 3, not 6.`,
    qs: [
      { l: 1, q: `What is the gradient of the line y = 3x + 2?`, o: ['2', '3', '5', '6'], a: 1, e: `In y = mx + c the gradient is m, so it is 3.` },
      { l: 1, q: `Find the midpoint of the line joining (2, 4) and (6, 8).`, o: ['(4, 6)', '(8, 12)', '(2, 2)', '(3, 5)'], a: 0, e: `Midpoint = ((2 + 6) ÷ 2, (4 + 8) ÷ 2) = (4, 6).` },
      { l: 2, dx: 1, q: `Find the gradient of the line joining (1, 2) and (3, 8).`, o: ['⅓', '2', '3', '6'], a: 2, e: `Gradient = (8 − 2) ÷ (3 − 1) = 6 ÷ 2 = 3.` },
      { l: 2, q: `Find the distance between (0, 0) and (3, 4).`, o: ['7', '25', '12', '5'], a: 3, e: `Distance = √(3² + 4²) = √25 = 5.` },
      { l: 2, q: `The line passes through A and B as shown. Find its gradient.`, g: ['grid', { ax: [-1, 6, -1, 5], lines: [[0.5, 1]], pts: [[0, 1, 'A', 8, 12], [4, 3, 'B', 8, 12]], label: 'A straight line through A(0, 1) and B(4, 3) on a numbered grid' }], o: ['2', '½', '4', '¼'], a: 1, e: `From A(0, 1) to B(4, 3) the rise is 2 and the run is 4. Gradient = 2 ÷ 4 = ½.` },
      { l: 3, dx: 1, q: `Find the equation of the line with gradient 2 that passes through (1, 3).`, o: ['y = 2x + 1', 'y = 2x + 3', 'y = 2x − 1', 'y = 3x + 2'], a: 0, e: `y − 3 = 2(x − 1), so y = 2x − 2 + 3 = 2x + 1.` },
      { l: 3, q: `Find the gradient of the line 2y = 6x + 4.`, o: ['6', '4', '3', '2'], a: 2, e: `Divide through by 2 to make y the subject: y = 3x + 2. The gradient is 3.` },
      { l: 3, q: `Which line is parallel to y = 4x − 7?`, o: ['y = −4x + 7', 'y = ¼x − 7', 'y = 4x + 1', 'y = −¼x + 1'], a: 2, e: `Parallel lines have the same gradient. Only y = 4x + 1 also has gradient 4.` },
      { l: 4, q: `Find the equation of the line through the points (1, 2) and (3, 6).`, o: ['y = x + 1', 'y = 2x', 'y = 2x + 1', 'y = 3x − 1'], a: 1, e: `Gradient = (6 − 2) ÷ (3 − 1) = 2. Then y − 2 = 2(x − 1), which gives y = 2x.` },
      { l: 4, q: `A line is perpendicular to y = ${fr(1, 3)}x + 2 and passes through the origin. Find its equation.`, o: ['y = 3x', `y = −${fr(1, 3)}x`, 'y = −3x + 2', 'y = −3x'], a: 3, e: `The gradient must satisfy ⅓ × m = −1, so m = −3. Through the origin the intercept is 0, so y = −3x.` },
      { l: 5, q: `The lines y = 3x + 1 and 6x + ky = 5 are perpendicular. Find k.`, o: ['2', '−2', '18', '−18'], a: 2, e: `Rearranged, the second line is y = (−6/k)x + 5/k, so its gradient is −6/k. Perpendicular means 3 × (−6/k) = −1, which gives k = 18.` },
      { l: 5, q: `The point (a, 5) is the midpoint of the line joining (2, 3) and (8, b). Find a + b.`, o: ['12', '10', '11', '13'], a: 0, e: `a = (2 + 8) ÷ 2 = 5. Also (3 + b) ÷ 2 = 5, so b = 7. Then a + b = 12.` }
    ]
  },

  /* ───────────── MATRICES AND DETERMINANTS ───────────── */
  {
    id: 'matrix', name: 'Matrices and Determinants', sec: 'Section II · Algebra', boss: 'The Matrix Masquerade',
    goals: ['Add, subtract and multiply matrices', 'Find the determinant of a 2 × 2 matrix', 'Find the inverse of a 2 × 2 matrix'],
    parts: [
      {
        title: 'Adding and multiplying',
        idea: `A matrix is a block of numbers arranged in rows and columns. You add matrices position by position. You multiply them row by column.`,
        g: ['mxmul', {}], cap: `Row 1 times column 1 gives the top-left entry: (1 × 5) + (2 × 7) = 19.`,
        rules: [
          `Add or subtract matrices of the same size position by position.`,
          `To multiply a matrix by a number, multiply every entry by that number.`,
          `To multiply two matrices, take each row of the first with each column of the second: multiply in pairs, then add.`,
          `Order matters. AB is usually not the same as BA.`
        ],
        ex: {
          q: `Find AB if A = ${mx([[2, 1], [0, 3]])} and B = ${mx([[1, 4], [2, 5]])}.`,
          steps: [
            [`Top row: (2 × 1) + (1 × 2) = 4 and (2 × 4) + (1 × 5) = 13`, `Row 1 of A with each column of B.`],
            [`Bottom row: (0 × 1) + (3 × 2) = 6 and (0 × 4) + (3 × 5) = 15`, `Row 2 of A with each column of B.`],
            [`AB = ${mx([[4, 13], [6, 15]])}`, `Put the four results in place.`]
          ]
        },
        tryit: {
          q: `If P = ${mx([[3, 1], [2, 4]])} and Q = ${mx([[1, 5], [0, 2]])}, find P + 2Q.`,
          given: [`2Q = ${mx([[2, 10], [0, 4]])}`, `Add position by position: 3 + 2, 1 + 10, 2 + 0 and 4 + 4`],
          ask: `P + 2Q = ?`, o: [mx([[5, 11], [2, 8]]), mx([[4, 6], [2, 6]]), mx([[5, 11], [2, 6]]), mx([[6, 10], [0, 8]])], a: 0,
          h: `Work out the four sums one at a time.`, e: `3 + 2 = 5, 1 + 10 = 11, 2 + 0 = 2 and 4 + 4 = 8.`
        }
      },
      {
        title: 'Determinants and inverses',
        idea: `Every 2 × 2 matrix has a single number called its determinant. It tells you whether the matrix has an inverse: if the determinant is 0, there is no inverse.`,
        rules: [
          `For A = ${mx([['a', 'b'], ['c', 'd']])}, the determinant is |A| = ad − bc`,
          `Inverse: A<sup>−1</sup> = ${fr(1, 'ad − bc')} ${mx([['d', '−b'], ['−c', 'a']])}`,
          `In words: swap a and d, change the signs of b and c, then divide by the determinant.`,
          `If ad − bc = 0 the matrix is called singular and has no inverse.`
        ],
        ex: {
          q: `Find the inverse of A = ${mx([[4, 3], [2, 2]])}.`,
          steps: [
            [`|A| = (4 × 2) − (3 × 2) = 2`, `ad − bc.`],
            [`Swap and change signs: ${mx([[2, '−3'], ['−2', 4]])}`, `Swap the 4 and the 2 on the main diagonal. Change the signs of the other two.`],
            [`A<sup>−1</sup> = ½ ${mx([[2, '−3'], ['−2', 4]])} = ${mx([[1, '−1½'], ['−1', 2]])}`, `Divide every entry by the determinant.`]
          ]
        },
        tryit: {
          q: `Find the determinant of ${mx([[5, 2], [3, 4]])}.`,
          given: [`ad = 5 × 4 = 20`, `bc = 2 × 3 = 6`],
          ask: `ad − bc = ?`, o: ['26', '14', '7', '−14'], a: 1,
          h: `Subtract 6 from 20.`, e: `20 − 6 = 14.`
        }
      }
    ],
    trap: `In ad − bc, watch the signs when an entry is negative. Subtracting a negative product means adding.`,
    qs: [
      { l: 1, q: `How many rows does the matrix ${mx([[1, 2, 3], [4, 5, 6]])} have?`, o: ['2', '3', '5', '6'], a: 0, e: `Rows run across. This matrix has 2 rows and 3 columns.` },
      { l: 1, q: `Find ${mx([[1, 2], [3, 4]])} + ${mx([[5, 0], [1, 2]])}.`, o: [mx([[5, 0], [3, 8]]), mx([[4, 2], [2, 2]]), mx([[6, 2], [4, 6]]), mx([[6, 2], [3, 6]])], a: 2, e: `Add position by position: 1 + 5 = 6, 2 + 0 = 2, 3 + 1 = 4 and 4 + 2 = 6.` },
      { l: 2, dx: 1, q: `Find the determinant of ${mx([[3, 2], [1, 4]])}.`, o: ['5', '10', '12', '14'], a: 1, e: `ad − bc = (3 × 4) − (2 × 1) = 12 − 2 = 10.` },
      { l: 2, q: `If A = ${mx([[2, '−1'], [0, 3]])}, find 3A.`, o: [mx([[5, 2], [3, 6]]), mx([[6, '−1'], [0, 3]]), mx([[6, '−3'], [3, 9]]), mx([[6, '−3'], [0, 9]])], a: 3, e: `Multiply every entry by 3 to get 6, −3, 0 and 9.` },
      { l: 2, q: `Evaluate ${det([[5, 3], [2, 4]])}.`, o: ['26', '20', '14', '7'], a: 2, e: `The straight bars mean determinant: (5 × 4) − (3 × 2) = 20 − 6 = 14.` },
      { l: 3, dx: 1, q: `Find AB if A = ${mx([[1, 2], [3, 4]])} and B = ${mx([[2, 0], [1, 3]])}.`, o: [mx([[2, 4], [10, 14]]), mx([[4, 6], [10, 12]]), mx([[2, 0], [3, 12]]), mx([[3, 2], [4, 7]])], a: 1, e: `Top row: (1 × 2) + (2 × 1) = 4 and (1 × 0) + (2 × 3) = 6. Bottom row: (3 × 2) + (4 × 1) = 10 and (3 × 0) + (4 × 3) = 12.` },
      { l: 3, q: `Find the determinant of ${mx([[2, '−3'], [4, 1]])}.`, o: ['−10', '10', '14', '−14'], a: 2, e: `ad − bc = (2 × 1) − (−3 × 4) = 2 + 12 = 14.` },
      { l: 3, q: `For what value of x is the matrix ${mx([['x', 6], [2, 3]])} singular?`, o: ['4', '1', '9', '−4'], a: 0, e: `Singular means the determinant is 0. Here 3x − 12 = 0, so x = 4.` },
      { l: 4, q: `Find the inverse of ${mx([[2, 1], [5, 3]])}.`, o: [mx([[3, 1], [5, 2]]), mx([[2, '−1'], ['−5', 3]]), mx([['−2', 1], [5, '−3']]), mx([[3, '−1'], ['−5', 2]])], a: 3, e: `The determinant is (2 × 3) − (1 × 5) = 1. Swap the 2 and the 3, change the signs of the 1 and the 5, and divide by 1.` },
      { l: 4, q: `The matrix ${mx([[2, 'x'], [3, 5]])} has determinant 4. Find x.`, o: ['1', '2', '3', '−2'], a: 1, e: `10 − 3x = 4, so 3x = 6 and x = 2.` },
      { l: 5, q: `If A = ${mx([[1, 2], [3, 4]])}, find A².`, o: [mx([[1, 4], [9, 16]]), mx([[2, 4], [6, 8]]), mx([[7, 10], [15, 22]]), mx([[7, 15], [10, 22]])], a: 2, e: `A² means A × A, not squaring each entry. Top row: 1 + 6 = 7 and 2 + 8 = 10. Bottom row: 3 + 12 = 15 and 6 + 16 = 22.` },
      { l: 5, q: `Given that ${mx([[2, 1], [1, 3]])} ${mx([['x'], ['y']])} = ${mx([[5], [10]])}, find x and y.`, o: ['x = 1, y = 3', 'x = 3, y = 1', 'x = 2, y = 1', 'x = 1, y = 2'], a: 0, e: `Multiplying out gives 2x + y = 5 and x + 3y = 10. From the first, y = 5 − 2x. Substituting: x + 15 − 6x = 10, so x = 1 and y = 3.` }
    ]
  },

  /* ───────────── DIFFERENTIATION ───────────── */
  {
    id: 'diff', name: 'Differentiation', sec: 'Section IV · Calculus', boss: 'The Slope Sorcerer',
    goals: ['Differentiate powers of x and sums of terms', 'Find the gradient of a curve at a point', 'Find turning points and rates of change'],
    parts: [
      {
        title: 'The power rule',
        idea: `Differentiation finds the gradient of a curve at any point. The result is written ${DYDX}. For powers of x there is one rule: bring the power down in front, then reduce the power by 1.`,
        g: ['parab', { a: 1, b: 0, c: 0, ax: [-3, 3, -1, 6], pl: [-2.4, 2.4], tan: 1, label: 'The curve y = x² with a tangent line touching it at the point where x = 1' }],
        cap: `The curve y = x². At x = 1 the tangent has gradient 2, which is the value of dy/dx = 2x at that point.`,
        rules: [
          `If y = x<sup>n</sup>, then ${DYDX} = nx<sup>n−1</sup>`,
          `A number in front stays: if y = ax<sup>n</sup>, then ${DYDX} = anx<sup>n−1</sup>`,
          `The derivative of a constant is 0, and the derivative of ax is a.`,
          `Differentiate a sum one term at a time.`,
          `For trigonometry: sin x becomes cos x, and cos x becomes −sin x.`
        ],
        ex: {
          q: `Differentiate y = 3x<sup>4</sup> − 5x² + 7x − 2.`,
          steps: [
            [`3x<sup>4</sup> becomes 3 × 4x³ = 12x³`, `Bring the 4 down and reduce the power by 1.`],
            [`−5x² becomes −10x, and 7x becomes 7`, `The same rule on each term.`],
            [`−2 becomes 0, so ${DYDX} = 12x³ − 10x + 7`, `A constant has gradient 0.`]
          ]
        },
        tryit: {
          q: `Differentiate y = 2x³ + 4x.`,
          given: [`2x³ becomes 2 × 3x² = 6x²`, `4x becomes 4`],
          ask: `${DYDX} = ?`, o: ['6x² + 4', '6x³ + 4', '5x² + 4', '6x² + 4x'], a: 0,
          h: `Put the two results together.`, e: `dy/dx = 6x² + 4.`
        }
      },
      {
        title: 'Gradients, turning points and rates',
        idea: `Once you have ${DYDX} you can use it. Put in a value of x to get the gradient at that point. Set it equal to 0 to find where the curve turns, because the gradient is zero at a maximum or a minimum.`,
        g: ['parab', { a: 1, b: -4, c: 5, ax: [-1, 5, -1, 7], pl: [-0.2, 4.2], mark: [2, 1], label: 'The curve y = x² − 4x + 5 with its lowest point marked at x = 2' }],
        cap: `y = x² − 4x + 5 has its minimum at x = 2, where dy/dx = 2x − 4 = 0.`,
        rules: [
          `Gradient at a point: substitute the x-value into ${DYDX}.`,
          `Turning points: solve ${DYDX} = 0.`,
          `Differentiate again to test it: a positive second derivative means a minimum, a negative one means a maximum.`,
          `${DYDX} is a rate of change. Velocity is the rate of change of distance with time.`
        ],
        ex: {
          q: `Find the gradient of the curve y = x³ − 2x at the point where x = 2.`,
          steps: [
            [`${DYDX} = 3x² − 2`, `Differentiate first.`],
            [`At x = 2: (3 × 2²) − 2`, `Substitute the x-value.`],
            [`= 12 − 2 = 10`, `The gradient at that point is 10.`]
          ]
        },
        tryit: {
          q: `Find the x-coordinate of the turning point of y = x² − 6x + 1.`,
          given: [`${DYDX} = 2x − 6`, `At a turning point, 2x − 6 = 0`],
          ask: `x = ?`, o: ['−3', '2', '3', '6'], a: 2,
          h: `Add 6 to both sides, then divide by 2.`, e: `2x = 6, so x = 3.`
        }
      }
    ],
    trap: `Differentiate before you substitute. If you put the x-value into y first, you get the height of the curve, not its gradient.`,
    qs: [
      { l: 1, q: `Differentiate y = x<sup>5</sup>.`, o: ['5x<sup>4</sup>', '5x<sup>5</sup>', '4x<sup>5</sup>', 'x<sup>4</sup>'], a: 0, e: `Bring the 5 down and reduce the power by 1 to get 5x<sup>4</sup>.` },
      { l: 1, q: `What is the derivative of y = 7?`, o: ['7', '7x', '1', '0'], a: 3, e: `A constant does not change, so its derivative is 0.` },
      { l: 2, dx: 1, q: `Differentiate y = 4x³.`, o: ['7x²', '12x²', '4x²', '12x³'], a: 1, e: `4 × 3x² = 12x².` },
      { l: 2, q: `Differentiate y = x² + 5x.`, o: ['x + 5', '2x', '2x + 5', '2x + 5x'], a: 2, e: `x² becomes 2x and 5x becomes 5, so dy/dx = 2x + 5.` },
      { l: 2, q: `If y = 6x² − 3x + 4, find ${DYDX}.`, o: ['6x − 3', '12x − 3', '12x + 4', '12x + 1'], a: 1, e: `6x² becomes 12x, −3x becomes −3 and the 4 disappears, so dy/dx = 12x − 3.` },
      { l: 3, dx: 1, q: `Find the gradient of the curve y = x² + 3x at the point where x = 1.`, o: ['4', '5', '6', '2'], a: 1, e: `dy/dx = 2x + 3. At x = 1 the gradient is 2 + 3 = 5. (4 is the value of y there, not the gradient.)` },
      { l: 3, q: `Differentiate y = ${fr(1, 'x')}.`, o: [fr(1, 'x²'), '1', '−x', `−${fr(1, 'x²')}`], a: 3, e: `Write 1/x as x<sup>−1</sup>. The power rule gives −1 × x<sup>−2</sup>, which is −1/x².` },
      { l: 3, q: `Find the value of x at which the curve y = x² − 8x + 3 has its turning point.`, o: ['−8', '3', '4', '8'], a: 2, e: `dy/dx = 2x − 8. Setting this equal to 0 gives x = 4.` },
      { l: 4, q: `If y = (2x + 1)(x − 3), find ${DYDX}.`, o: ['4x − 5', '4x + 5', '2x − 5', '4x − 3'], a: 0, e: `Expand first: y = 2x² − 5x − 3. Then dy/dx = 4x − 5.` },
      { l: 4, q: `Differentiate y = 3 sin x + 2 cos x.`, o: ['3 cos x + 2 sin x', '3 cos x − 2 sin x', '−3 cos x + 2 sin x', '3 sin x − 2 cos x'], a: 1, e: `sin x becomes cos x, and cos x becomes −sin x. So dy/dx = 3 cos x − 2 sin x.` },
      { l: 5, q: `Find the minimum value of y = x² − 4x + 7.`, o: ['7', '2', '3', '4'], a: 2, e: `dy/dx = 2x − 4 = 0 gives x = 2. The second derivative is 2, which is positive, so this is a minimum. Its value is 2² − (4 × 2) + 7 = 3. (2 is the x-value, not the minimum value.)` },
      { l: 5, q: `A particle moves so that its distance s metres after t seconds is s = t³ − 3t² + 2t. Find its velocity when t = 3.`, o: ['11 m/s', '6 m/s', '12 m/s', '20 m/s'], a: 0, e: `Velocity is the rate of change of distance: ds/dt = 3t² − 6t + 2. At t = 3 this is 27 − 18 + 2 = 11 m/s.` }
    ]
  }
);

/* Road to Campus content, batch 3: Sets, Surds, Variation, Inequalities and Probability.
   Same format as content.js. Questions are written with the correct option where `a` says, and mix()
   then rotates each question's options so the right answer is spread evenly across A, B, C and D. */
const mix = (qs, seed) => qs.map((q, i) => {
  const r = (i * 3 + seed) % 4, o = q.o.map((_, j) => q.o[(j + r) % 4]);
  return Object.assign({}, q, { o, a: (q.a - r + 4) % 4 });
});
const TREE = ['tree', { b1: [['R', '3/5'], ['B', '2/5']], b2: [[['R', '2/4'], ['B', '2/4']], [['R', '3/4'], ['B', '1/4']]], label: 'Tree diagram for two draws without replacement from a bag of 3 red and 2 blue balls. First draw: red 3/5, blue 2/5. After red: red 2/4, blue 2/4. After blue: red 3/4, blue 1/4' }];

CONTENT.topics.push(

  /* ───────────── SETS ───────────── */
  {
    id: 'sets', name: 'Sets', sec: 'Section I · Number and Numeration', boss: 'The Venn Warlord',
    goals: ['Use set notation: elements, union, intersection and complement', 'Count the subsets of a set', 'Solve two-set and three-set problems with Venn diagrams'],
    parts: [
      {
        title: 'Set notation',
        idea: `A set is a collection of objects, called its elements. Exams test the symbols as much as the counting, so learn exactly what each one means.`,
        g: ['venn', { sets: ['A', 'B'], v: { a: '1, 3', ab: '2, 4, 6', b: '8', out: '5, 7, 9' }, shade: ['ab'], label: 'Venn diagram. U holds 1 to 9. A only: 1 and 3. Both A and B: 2, 4 and 6, shaded. B only: 8. Outside both: 5, 7 and 9' }],
        cap: `U = {1, 2, …, 9}, A = {1, 2, 3, 4, 6} and B = {2, 4, 6, 8}. The shaded overlap holds the elements in both sets: A ∩ B = {2, 4, 6}.`,
        rules: [
          `A ∪ B (union) is everything in A or B or both. A ∩ B (intersection) is only what is in both.`,
          `A′ (complement) is everything in the universal set U that is not in A.`,
          `n(A) is the number of elements in A. ∅ is the empty set, and n(∅) = 0.`,
          `A set with n elements has 2<sup>n</sup> subsets, counting ∅ and the set itself.`
        ],
        ex: {
          q: `U = {1, 2, 3, …, 10}, P = {2, 4, 6, 8, 10} and Q = {1, 2, 3, 4}. Find P′ ∩ Q.`,
          steps: [
            [`P′ = {1, 3, 5, 7, 9}`, `Everything in U that is not in P.`],
            [`Q = {1, 2, 3, 4}`, `Now look for the elements that are in both P′ and Q.`],
            [`P′ ∩ Q = {1, 3}`, `1 and 3 are the only elements in both.`]
          ]
        },
        tryit: {
          q: `How many subsets does {a, b, c, d} have?`,
          given: [`The set has 4 elements, so n = 4`, `Number of subsets = 2<sup>n</sup> = 2<sup>4</sup>`],
          ask: `= ?`, o: ['4', '8', '16', '24'], a: 2,
          h: `Multiply 2 by itself four times.`, e: `2 × 2 × 2 × 2 = 16. That count includes the empty set and the whole set.`
        }
      },
      {
        title: 'Venn diagram problems',
        idea: `When a question gives totals and an overlap, draw the Venn diagram and fill it from the middle outward. Then every person sits in exactly one region and is counted once.`,
        g: ['venn', { sets: ['M', 'P'], v: { a: '25 − x', ab: 'x', b: '18 − x', out: '5' }, u: 'U = 40', label: 'Venn diagram for 40 students. Maths only: 25 − x. Both: x. Physics only: 18 − x. Neither: 5' }],
        cap: `Put the unknown overlap x in the middle. Maths only is then 25 − x, because the 25 Maths students include the x who also offer Physics.`,
        rules: [
          `n(A ∪ B) = n(A) + n(B) − n(A ∩ B). The overlap is taken away once because it was counted twice.`,
          `Fill a Venn diagram from the middle outward: the overlap first, then the "only" regions.`,
          `People who belong to neither set sit outside the circles but inside U.`,
          `For three sets, start with the region where all three circles overlap.`
        ],
        ex: {
          q: `In a class of 40 students, 25 offer Maths, 18 offer Physics and 5 offer neither. How many offer both?`,
          steps: [
            [`n(M ∪ P) = 40 − 5 = 35`, `Take away the students outside both circles.`],
            [`(25 − x) + x + (18 − x) = 35`, `The three regions inside the circles add up to 35.`],
            [`43 − x = 35, so x = 8`, `8 students offer both subjects.`]
          ]
        },
        tryit: {
          q: `n(A) = 12, n(B) = 9 and n(A ∩ B) = 4. Find n(A ∪ B).`,
          given: [`n(A ∪ B) = n(A) + n(B) − n(A ∩ B)`, `= 12 + 9 − 4`],
          ask: `= ?`, o: ['13', '17', '21', '25'], a: 1,
          h: `Add 12 and 9, then take away 4.`, e: `12 + 9 − 4 = 17. The 4 elements in the overlap were counted twice, so they are taken away once.`
        }
      }
    ],
    trap: `"Only Maths" is not the same as "Maths". In a Venn diagram, n(M) includes the overlap. Look for the word "only" in every question.`,
    qs: mix([
      { l: 1, q: `If A = {2, 4, 6, 8} and B = {4, 8, 12}, find A ∩ B.`, o: ['{4, 8}', '{2, 4, 6, 8, 12}', '{2, 6}', '{12}'], a: 0, e: `The intersection holds only the elements in both sets: 4 and 8. {2, 4, 6, 8, 12} is the union.` },
      { l: 1, q: `If P = {a, e, i, o, u}, find n(P).`, o: ['4', '5', '6', '1'], a: 1, e: `n(P) is the number of elements. P has five elements, so n(P) = 5.` },
      { l: 2, dx: 1, q: `U = {1, 2, 3, …, 10} and A = {x : x is a prime number}. Find A′.`, o: ['{1, 4, 6, 8, 9, 10}', '{2, 3, 5, 7}', '{4, 6, 8, 9, 10}', '{1, 4, 6, 8, 10}'], a: 0, e: `A = {2, 3, 5, 7}. The complement is everything else in U: {1, 4, 6, 8, 9, 10}. 1 is not a prime number, so it belongs in A′.` },
      { l: 2, q: `How many subsets does a set with 5 elements have?`, o: ['10', '25', '32', '31'], a: 2, e: `A set with n elements has 2<sup>n</sup> subsets, and 2<sup>5</sup> = 32.` },
      { l: 2, q: `Use the Venn diagram to find n(A ∪ B).`, g: ['venn', { sets: ['A', 'B'], v: { a: '7', ab: '3', b: '5', out: '4' }, label: 'Venn diagram. A only: 7. Both: 3. B only: 5. Outside both: 4' }], o: ['15', '19', '12', '10'], a: 0, e: `A ∪ B is everything inside the circles: 7 + 3 + 5 = 15. The 4 outside are in neither set.` },
      { l: 3, dx: 1, q: `In a class of 50 students, 30 play football, 25 play volleyball and 8 play neither. How many play both?`, o: ['13', '5', '17', '22'], a: 0, e: `50 − 8 = 42 students play at least one game. Then 30 + 25 − 42 = 13 play both.` },
      { l: 3, q: `n(A) = 15, n(B) = 12 and n(A ∪ B) = 20. Find n(A ∩ B).`, o: ['3', '5', '7', '27'], a: 2, e: `n(A ∪ B) = n(A) + n(B) − n(A ∩ B), so 20 = 15 + 12 − n(A ∩ B) and n(A ∩ B) = 27 − 20 = 7.` },
      { l: 3, q: `The Venn diagram shows how many of 30 students like rice (R) and beans (B). Find x.`, g: ['venn', { sets: ['R', 'B'], v: { a: '12', ab: 'x', b: '9', out: '4' }, u: 'U = 30', label: 'Venn diagram for 30 students. Rice only: 12. Both: x. Beans only: 9. Neither: 4' }], o: ['5', '9', '14', '7'], a: 0, e: `All four regions add up to 30: 12 + x + 9 + 4 = 30. So 25 + x = 30 and x = 5.` },
      { l: 4, q: `How many proper subsets does {p, q, r} have?`, o: ['8', '7', '6', '3'], a: 1, e: `It has 2³ = 8 subsets. A proper subset cannot be the whole set, so there are 8 − 1 = 7.` },
      { l: 4, q: `U = {1, 2, 3, …, 12}, A = {multiples of 2} and B = {multiples of 3}. Find (A ∪ B)′.`, o: ['{1, 5, 7, 11}', '{6, 12}', '{1, 5, 7}', '{1, 5, 7, 9, 11}'], a: 0, e: `A ∪ B = {2, 3, 4, 6, 8, 9, 10, 12}. The numbers in U left over are 1, 5, 7 and 11. {6, 12} is A ∩ B.` },
      { l: 5, q: `Of 100 students, 40 offer Biology, 45 offer Chemistry and 35 offer Physics. 15 offer Biology and Chemistry, 12 offer Chemistry and Physics, 10 offer Biology and Physics, and 5 offer all three. How many offer none of the three?`, o: ['12', '5', '17', '22'], a: 0, e: `Students in at least one subject = 40 + 45 + 35 − 15 − 12 − 10 + 5 = 88. The pairs were counted twice, and the 5 in all three were then taken away once too often, so they are added back. None = 100 − 88 = 12.` },
      { l: 5, q: `The Venn diagram shows how 60 traders sell yam (Y), garri (G) and beans (B). Find x.`, g: ['venn', { sets: ['Y', 'G', 'B'], v: { a: '2x', b: '12', c: '8', ab: '5', bc: '4', ac: 'x', abc: '3', out: '7' }, u: 'U = 60', label: 'Three-set Venn diagram for 60 traders. Yam only: 2x. Garri only: 12. Beans only: 8. Yam and garri only: 5. Garri and beans only: 4. Yam and beans only: x. All three: 3. None: 7' }], o: ['7', '21', '14', '3'], a: 0, e: `All eight regions add up to 60: 2x + 12 + 8 + 5 + 4 + x + 3 + 7 = 60. So 3x + 39 = 60, 3x = 21 and x = 7.` }
    ], 1)
  },

  /* ───────────── SURDS ───────────── */
  {
    id: 'surds', name: 'Surds', sec: 'Section I · Number and Numeration', boss: 'The Root Spirit',
    goals: ['Simplify surds by taking out square factors', 'Add, subtract and multiply surds', 'Rationalise the denominator, including with a conjugate'],
    parts: [
      {
        title: 'Simplifying surds',
        idea: `A surd is a root that cannot be written as a whole number or a fraction, such as √2 or √12. Exams want surds in their simplest form, with the largest square factor taken out.`,
        g: ['rtri', { b: 1, h: 1, base: '1', ht: '1', hyp: '√2', label: 'Right-angled triangle with two sides of length 1 and a hypotenuse of √2' }],
        cap: `√2 is a real length: the diagonal of a square with sides of 1. By Pythagoras, 1² + 1² = 2.`,
        rules: [
          `√(ab) = √a × √b, so √12 = √4 × √3 = 2√3.`,
          `Look for the largest perfect square factor: 4, 9, 16, 25, 36, 49, 64, 81 or 100.`,
          `Add or subtract only like surds: 3√2 + 5√2 = 8√2, but √2 + √3 cannot be combined.`,
          `√a × √a = a. For example, √5 × √5 = 5.`
        ],
        ex: {
          q: `Simplify √48 + √27.`,
          steps: [
            [`√48 = √16 × √3 = 4√3`, `16 is the largest square factor of 48.`],
            [`√27 = √9 × √3 = 3√3`, `9 is the largest square factor of 27.`],
            [`4√3 + 3√3 = 7√3`, `Both are like surds in √3, so add the numbers in front.`]
          ]
        },
        tryit: {
          q: `Simplify √72.`,
          given: [`The largest square factor of 72 is 36`, `√72 = √36 × √2`],
          ask: `= ?`, o: ['6√2', '3√8', '2√18', '8√3'], a: 0,
          h: `What is √36?`, e: `√36 = 6, so √72 = 6√2. 3√8 and 2√18 have the same value, but they are not in simplest form because 8 and 18 still have square factors.`
        }
      },
      {
        title: 'Rationalising the denominator',
        idea: `Exam answers rarely leave a surd at the bottom of a fraction. You clear it by multiplying the top and the bottom by the same surd. That is multiplying by 1, so the value does not change.`,
        rules: [
          `For ${fr('a', '√b')}, multiply the top and the bottom by √b.`,
          `For a bottom like a + √b, multiply the top and the bottom by its conjugate, a − √b.`,
          `(a + √b)(a − √b) = a² − b. The surds cancel out.`
        ],
        ex: {
          q: `Rationalise ${fr(6, '√3')}.`,
          steps: [
            [`${fr('6 × √3', '√3 × √3')}`, `Multiply the top and the bottom by √3.`],
            [`${fr('6√3', 3)}`, `√3 × √3 = 3.`],
            [`= 2√3`, `6 ÷ 3 = 2.`]
          ]
        },
        tryit: {
          q: `Rationalise ${fr(1, '2 + √3')}.`,
          given: [`Multiply the top and the bottom by the conjugate, 2 − √3`, `Bottom: (2 + √3)(2 − √3) = 4 − 3 = 1`],
          ask: `So the answer is ?`, o: ['2 + √3', '2 − √3', '√3 − 2', '4 − √3'], a: 1,
          h: `The new top is 2 − √3. Divide it by the new bottom, 1.`, e: `The top becomes 2 − √3 and the bottom becomes 1, so the answer is 2 − √3.`
        }
      }
    ],
    trap: `√a + √b is not √(a + b). Check with numbers: √9 + √16 = 3 + 4 = 7, but √25 = 5.`,
    qs: mix([
      { l: 1, q: `Simplify √50.`, o: ['5√2', '2√5', '25√2', '10√5'], a: 0, e: `50 = 25 × 2 and √25 = 5, so √50 = 5√2.` },
      { l: 1, q: `Evaluate √3 × √3.`, o: ['9', '3', '√6', '2√3'], a: 1, e: `A square root times itself gives the number under the root: √3 × √3 = 3.` },
      { l: 2, dx: 1, q: `Simplify √45 − √20.`, o: ['√5', '√25', '5', '5√5'], a: 0, e: `√45 = 3√5 and √20 = 2√5. Then 3√5 − 2√5 = √5. (√45 − √20 is not √25.)` },
      { l: 2, q: `Simplify 2√3 × 5√3.`, o: ['10√3', '30', '15', '7√3'], a: 1, e: `Multiply the numbers and the surds separately: 2 × 5 = 10 and √3 × √3 = 3. So the answer is 10 × 3 = 30.` },
      { l: 2, q: `Rationalise ${fr(10, '√5')}.`, o: ['2√5', '5√2', '10√5', '√2'], a: 0, e: `Multiply the top and the bottom by √5: ${fr('10√5', 5)} = 2√5.` },
      { l: 3, dx: 1, q: `Simplify √75 + √12 − √27.`, o: ['4√3', '√60', '6√3', '2√3'], a: 0, e: `√75 = 5√3, √12 = 2√3 and √27 = 3√3. So 5√3 + 2√3 − 3√3 = 4√3.` },
      { l: 3, q: `Expand (√5 + 2)(√5 − 2).`, o: ['1', '9', '3', '5 − 2√5'], a: 0, e: `This is (a + b)(a − b) = a² − b². Here (√5)² − 2² = 5 − 4 = 1.` },
      { l: 3, q: `Simplify (2√3)².`, o: ['6', '12', '36', '4√3'], a: 1, e: `(2√3)² = 2² × (√3)² = 4 × 3 = 12.` },
      { l: 4, q: `Rationalise ${fr(4, '3 − √5')}.`, o: ['3 + √5', '3 − √5', '12 + 4√5', '√5 − 3'], a: 0, e: `Multiply the top and the bottom by 3 + √5. The bottom becomes 9 − 5 = 4 and the top becomes 4(3 + √5). Dividing by 4 leaves 3 + √5.` },
      { l: 4, q: `Find the length of the side marked x, in its simplest surd form.`, g: ['rtri', { b: 4, h: 2, base: '4 cm', ht: '2 cm', hyp: 'x', label: 'Right-angled triangle with shorter sides 4 cm and 2 cm and hypotenuse x' }], o: ['2√5 cm', '6 cm', '√6 cm', '4√5 cm'], a: 0, e: `By Pythagoras, x² = 4² + 2² = 20. So x = √20 = √4 × √5 = 2√5 cm.` },
      { l: 5, q: `If (√3 + √2)² = a + b√6, find a + b.`, o: ['5', '7', '10', '6'], a: 1, e: `(√3 + √2)² = 3 + 2√6 + 2 = 5 + 2√6. So a = 5 and b = 2, and a + b = 7.` },
      { l: 5, q: `Simplify ${fr('√3 + 1', '√3 − 1')}.`, o: ['2 + √3', '1 + √3', '2 − √3', '4 + 2√3'], a: 0, e: `Multiply the top and the bottom by √3 + 1. The top is (√3 + 1)² = 4 + 2√3 and the bottom is 3 − 1 = 2. Dividing by 2 gives 2 + √3.` }
    ], 2)
  },

  /* ───────────── VARIATION ───────────── */
  {
    id: 'variation', name: 'Variation', sec: 'Section II · Algebra', boss: 'The Shape-Shifter',
    goals: ['Write equations for direct, inverse, joint and partial variation', 'Find the constant of variation and use it', 'Recognise direct variation from a graph'],
    parts: [
      {
        title: 'Direct and inverse variation',
        idea: `Variation describes how one quantity changes when another one changes. Every variation question follows the same plan: write the equation with a constant k, find k from the values given, then use k.`,
        g: ['grid', { ax: [-1, 4, -1, 7], lines: [[2, 0]], pts: [[1, 2, '(1, 2)', -8, -10, 'end'], [3, 6, '(3, 6)', -8, -10, 'end']], label: 'The straight line y = 2x through the origin, passing through (1, 2) and (3, 6)' }],
        cap: `y ∝ x gives a straight line through the origin. Here k = 2: when x goes from 1 to 3, y goes from 2 to 6.`,
        rules: [
          `Direct: y ∝ x means y = kx. When x doubles, y doubles.`,
          `Inverse: y ∝ ${fr(1, 'x')} means y = ${fr('k', 'x')}. When x doubles, y halves.`,
          `Powers and roots work the same way: y ∝ x² means y = kx², and y ∝ ${fr(1, '√x')} means y = ${fr('k', '√x')}.`,
          `Find k from the values you are given first. Then answer the question.`
        ],
        ex: {
          q: `y varies inversely as x. When x = 4, y = 6. Find y when x = 3.`,
          g: ['grid', { ax: [0, 8, 0, 12], fit: 1, hyps: [24], pts: [[4, 6, '(4, 6)', 8, -10], [3, 8, '(3, 8)', 8, -10]], label: 'The curve y = 24 ÷ x through the points (4, 6) and (3, 8)' }],
          steps: [
            [`y = ${fr('k', 'x')}`, `Write the equation for inverse variation.`],
            [`6 = ${fr('k', 4)}, so k = 24`, `Put in the values you know to find k.`],
            [`y = ${fr(24, 3)} = 8`, `Use k = 24 with the new x. A smaller x gives a bigger y.`]
          ]
        },
        tryit: {
          q: `y varies directly as x². When x = 2, y = 12. Find y when x = 5.`,
          given: [`y = kx², so 12 = k × 4 and k = 3`, `When x = 5: y = 3 × 5²`],
          ask: `y = ?`, o: ['15', '30', '75', '45'], a: 2,
          h: `Square 5 first, then multiply by 3.`, e: `5² = 25 and 3 × 25 = 75.`
        }
      },
      {
        title: 'Joint and partial variation',
        idea: `Joint variation links one quantity to two or more others at once. Partial variation has two parts added together: a fixed part and a part that varies.`,
        g: ['grid', { ax: [-1, 6, -1, 14], fit: 1, lines: [[2, 3]], pts: [[0, 3, 'a = 3', 8, 4], [2, 7, '(2, 7)', -8, -10, 'end'], [5, 13, '(5, 13)', -8, -10, 'end']], label: 'The line y = 3 + 2x, which meets the y-axis at 3 and passes through (2, 7) and (5, 13)' }],
        cap: `Partial variation y = a + bx is a straight line that does not pass through the origin. The fixed part a is where it meets the y-axis.`,
        rules: [
          `Joint: y varies directly as x and inversely as z means y = ${fr('kx', 'z')}.`,
          `Partial: y is partly constant and partly varies as x means y = a + bx.`,
          `For partial variation you need two pairs of values. Write two equations and solve them together.`
        ],
        ex: {
          q: `y is partly constant and partly varies as x. When x = 2, y = 7, and when x = 5, y = 13. Find y when x = 8.`,
          steps: [
            [`y = a + bx`, `One constant part and one part that varies.`],
            [`7 = a + 2b and 13 = a + 5b`, `Use both pairs of values.`],
            [`Subtract: 3b = 6, so b = 2 and a = 3`, `Then put b = 2 back into 7 = a + 2b.`],
            [`y = 3 + 2 × 8 = 19`, `Use a = 3 and b = 2 with x = 8.`]
          ]
        },
        tryit: {
          q: `P varies jointly as Q and R. When Q = 2 and R = 3, P = 30. Find P when Q = 4 and R = 5.`,
          given: [`P = kQR, so 30 = k × 2 × 3 and k = 5`, `When Q = 4 and R = 5: P = 5 × 4 × 5`],
          ask: `P = ?`, o: ['60', '100', '50', '150'], a: 1,
          h: `Multiply 5 × 4 × 5.`, e: `5 × 4 × 5 = 100.`
        }
      }
    ],
    trap: `In inverse variation y = ${fr('k', 'x')}, not y = kx. "Inversely" means that as x gets bigger, y gets smaller.`,
    qs: mix([
      { l: 1, q: `If y ∝ x, which equation is correct?`, o: ['y = x + k', 'y = kx', `y = ${fr('k', 'x')}`, 'y = k − x'], a: 1, e: `y ∝ x means y varies directly as x, so y = kx for some constant k.` },
      { l: 1, q: `y varies directly as x, and y = 12 when x = 3. Find the constant k.`, o: ['4', '36', '9', '15'], a: 0, e: `y = kx, so 12 = 3k and k = 4.` },
      { l: 2, dx: 1, q: `y varies directly as x. When x = 4, y = 20. Find y when x = 7.`, o: ['35', '28', '23', '140'], a: 0, e: `y = kx, so 20 = 4k and k = 5. When x = 7, y = 5 × 7 = 35.` },
      { l: 2, q: `y varies inversely as x. When x = 3, y = 8. Find y when x = 6.`, o: ['16', '4', '2', '12'], a: 1, e: `y = ${fr('k', 'x')}, so 8 = ${fr('k', 3)} and k = 24. When x = 6, y = 24 ÷ 6 = 4.` },
      { l: 2, q: `The graph of y against x is a straight line through the origin, as shown. Find k in y = kx.`, g: ['grid', { ax: [-1, 4, -1, 13], fit: 1, lines: [[3, 0]], pts: [[2, 6, '(2, 6)', 8, 6]], label: 'A straight line through the origin and the point (2, 6)' }], o: ['3', '6', '2', '12'], a: 0, e: `The point (2, 6) is on the line y = kx, so 6 = 2k and k = 3.` },
      { l: 3, dx: 1, q: `y varies directly as the square of x. When x = 3, y = 18. Find y when x = 4.`, o: ['24', '32', '16', '8'], a: 1, e: `y = kx², so 18 = 9k and k = 2. When x = 4, y = 2 × 16 = 32.` },
      { l: 3, q: `y varies inversely as the square root of x. When x = 9, y = 4. Find y when x = 16.`, o: ['3', '12', '6', '2'], a: 0, e: `y = ${fr('k', '√x')}, so 4 = ${fr('k', 3)} and k = 12. When x = 16, y = 12 ÷ √16 = 12 ÷ 4 = 3.` },
      { l: 3, q: `y varies inversely as x. If x is doubled, what happens to y?`, o: ['y is doubled', 'y is halved', 'y is squared', 'y stays the same'], a: 1, e: `y = ${fr('k', 'x')}. Doubling x doubles the bottom of the fraction, so y becomes half as big.` },
      { l: 4, q: `P varies directly as Q and inversely as R. When Q = 6 and R = 4, P = 9. Find P when Q = 10 and R = 5.`, o: ['12', '15', '18', '7.5'], a: 0, e: `P = ${fr('kQ', 'R')}, so 9 = ${fr('6k', 4)} and k = 6. When Q = 10 and R = 5, P = ${fr('6 × 10', 5)} = 12.` },
      { l: 4, q: `y is partly constant and partly varies as x. When x = 1, y = 5, and when x = 3, y = 11. Find the relationship between x and y.`, o: ['y = 2 + 3x', 'y = 3 + 2x', 'y = 5x', 'y = 1 + 4x'], a: 0, e: `y = a + bx gives 5 = a + b and 11 = a + 3b. Subtracting, 2b = 6, so b = 3 and a = 2. So y = 2 + 3x.` },
      { l: 5, q: `The volume V of a gas varies inversely as its pressure P. When P = 150, V = 40. Find P when V = 60.`, o: ['100', '225', '90', '60'], a: 0, e: `V = ${fr('k', 'P')}, so k = 40 × 150 = 6000. When V = 60, P = 6000 ÷ 60 = 100.` },
      { l: 5, q: `y varies directly as x and inversely as the square of z. If x is doubled and z is halved, what is y multiplied by?`, o: ['8', '4', '2', '16'], a: 0, e: `y = ${fr('kx', 'z²')}. Doubling x multiplies y by 2. Halving z makes z² a quarter as big, which multiplies y by 4. Together, y is multiplied by 2 × 4 = 8.` }
    ], 3)
  },

  /* ───────────── INEQUALITIES ───────────── */
  {
    id: 'ineq', name: 'Inequalities', sec: 'Section II · Algebra', boss: 'The Gatekeeper',
    goals: ['Solve linear inequalities and show them on a number line', 'Solve quadratic inequalities', 'Read regions on a graph for inequalities in x and y'],
    parts: [
      {
        title: 'Linear inequalities',
        idea: `You solve an inequality like an equation, with one extra rule: if you multiply or divide both sides by a negative number, the inequality sign turns around.`,
        g: ['nline', { ax: [-4, 5], seg: [[-2, 3, true, false]], label: 'Number line from −4 to 5 showing −2 ≤ x &lt; 3: a filled dot at −2, an open dot at 3, and the line between them highlighted' }],
        cap: `This shows −2 ≤ x &lt; 3. The filled dot means −2 is included. The open dot means 3 is not.`,
        rules: [
          `&lt; means less than and &gt; means greater than. ≤ and ≥ also include the number itself.`,
          `You can add or subtract the same number on both sides. The sign stays the same.`,
          `Multiply or divide both sides by a negative number and the sign turns around: −2x &gt; 6 gives x &lt; −3.`,
          `On a number line, use a filled dot for ≤ or ≥ and an open dot for &lt; or &gt;.`
        ],
        ex: {
          q: `Solve 5 − 2x ≤ 11.`,
          g: ['nline', { ax: [-5, 4], seg: [[-3, null, true]], label: 'Number line showing x ≥ −3: a filled dot at −3 with an arrow running to the right' }],
          steps: [
            [`−2x ≤ 6`, `Take 5 from both sides.`],
            [`x ≥ −3`, `Divide both sides by −2 and turn the sign around.`],
            [`Check with x = 0: 5 − 0 = 5, and 5 ≤ 11 is true`, `0 is bigger than −3, so it should work, and it does.`]
          ]
        },
        tryit: {
          q: `Solve 3x + 4 &gt; 19.`,
          given: [`3x &gt; 15`, `Divide both sides by 3. That is a positive number, so the sign stays the same`],
          ask: `So ?`, o: ['x &gt; 5', 'x &lt; 5', 'x &gt; 15', 'x ≥ 5'], a: 0,
          h: `15 ÷ 3 = 5, and the sign does not change.`, e: `3x &gt; 15 gives x &gt; 5. The sign stays because 3 is positive, and it stays strict (&gt;, not ≥).`
        }
      },
      {
        title: 'Quadratic inequalities and regions',
        idea: `For a quadratic inequality, find the roots first. They cut the number line into pieces, and the graph shows which pieces make the inequality true.`,
        g: ['parab', { a: 1, b: -5, c: 4, ax: [-1, 6, -3, 7], pl: [-0.3, 5.3], roots: [1, 4], label: 'Graph of y = x² − 5x + 4, which crosses the x-axis at 1 and 4 and dips below it between them' }],
        cap: `y = x² − 5x + 4 is below the x-axis between its roots, 1 and 4. So x² − 5x + 4 &lt; 0 when 1 &lt; x &lt; 4.`,
        rules: [
          `Factorise and find the roots, just as if you were solving the equation.`,
          `When the x² term is positive, the expression is negative between the roots and positive outside them.`,
          `With p &lt; q: (x − p)(x − q) &lt; 0 gives p &lt; x &lt; q, and (x − p)(x − q) &gt; 0 gives x &lt; p or x &gt; q.`,
          `On a graph, y &gt; mx + c is the region above the line and y &lt; mx + c is below it. A dashed line means the line itself is not included.`
        ],
        ex: {
          q: `Solve x² − x − 6 &lt; 0.`,
          g: ['nline', { ax: [-4, 5], seg: [[-2, 3, false, false]], label: 'Number line showing −2 &lt; x &lt; 3: open dots at −2 and 3 with the line between them highlighted' }],
          steps: [
            [`(x − 3)(x + 2) &lt; 0`, `Factorise: −3 and +2 multiply to give −6 and add to give −1.`],
            [`The roots are x = −2 and x = 3`, `These cut the number line into three pieces.`],
            [`−2 &lt; x &lt; 3`, `The curve opens upward, so it is below zero between the roots.`]
          ]
        },
        tryit: {
          q: `Which inequality describes the shaded region?`,
          g: ['grid', { ax: [-3, 4, -2, 5], half: [[1, 1, true, false]], label: 'The solid line y = x + 1 on a grid, with the region above it shaded' }],
          given: [`The boundary line is y = x + 1`, `The line is solid, and the shaded side is above it`],
          ask: `So the region is ?`, o: ['y ≥ x + 1', 'y ≤ x + 1', 'y &gt; x + 1', 'y &lt; x + 1'], a: 0,
          h: `Above the line means y is bigger. A solid line means the line itself is included.`, e: `Shading above a solid line gives y ≥ x + 1. A dashed line would give y &gt; x + 1.`
        }
      }
    ],
    trap: `When you divide by a negative number, turn the sign around. Exams almost always put the answer with the unturned sign among the options.`,
    qs: mix([
      { l: 1, q: `Solve x + 7 &gt; 10.`, o: ['x &gt; 3', 'x &lt; 3', 'x &gt; 17', 'x ≥ 3'], a: 0, e: `Take 7 from both sides: x &gt; 3.` },
      { l: 1, q: `Which of these values of x satisfies 2x &lt; 9?`, o: ['5', '4.5', '4', '6'], a: 2, e: `2x &lt; 9 means x &lt; 4.5. Only 4 is less than 4.5. (At x = 4.5, 2x = 9, which is not less than 9.)` },
      { l: 2, dx: 1, q: `Solve 4x − 3 ≤ 2x + 7.`, o: ['x ≤ 5', 'x ≥ 5', 'x ≤ 2', 'x &lt; 5'], a: 0, e: `Take 2x from both sides: 2x − 3 ≤ 7. Add 3: 2x ≤ 10. Divide by 2: x ≤ 5.` },
      { l: 2, q: `Solve −3x &gt; 12.`, o: ['x &gt; −4', 'x &lt; −4', 'x &gt; 4', 'x &lt; 4'], a: 1, e: `Divide both sides by −3 and turn the sign around: x &lt; −4.` },
      { l: 2, q: `Which inequality is shown on the number line?`, g: ['nline', { ax: [-3, 6], seg: [[-1, 4, true, false]], label: 'Number line with a filled dot at −1, an open dot at 4, and the line between them highlighted' }], o: ['−1 ≤ x &lt; 4', '−1 &lt; x ≤ 4', '−1 &lt; x &lt; 4', '−1 ≤ x ≤ 4'], a: 0, e: `The filled dot at −1 means −1 is included (≤). The open dot at 4 means 4 is not included (&lt;). So −1 ≤ x &lt; 4.` },
      { l: 3, dx: 1, q: `Solve ${fr('x', 3)} − 2 &lt; ${fr('x', 4)}.`, o: ['x &lt; 24', 'x &gt; 24', 'x &lt; 2', 'x &lt; 12'], a: 0, e: `Multiply every term by 12: 4x − 24 &lt; 3x. Take 3x from both sides: x − 24 &lt; 0, so x &lt; 24.` },
      { l: 3, q: `Find the range of values of x for which 3 &lt; 2x + 1 ≤ 9.`, o: ['1 &lt; x ≤ 4', '2 &lt; x ≤ 8', '1 ≤ x &lt; 4', '4 &lt; x ≤ 10'], a: 0, e: `Take 1 from all three parts: 2 &lt; 2x ≤ 8. Divide all three by 2: 1 &lt; x ≤ 4.` },
      { l: 3, q: `How many integers satisfy −2 ≤ x &lt; 3?`, o: ['4', '5', '6', '3'], a: 1, e: `The integers are −2, −1, 0, 1 and 2. That is 5. (3 is not included.)` },
      { l: 4, q: `Solve x² − 5x + 6 &lt; 0.`, o: ['2 &lt; x &lt; 3', 'x &lt; 2 or x &gt; 3', '−3 &lt; x &lt; −2', 'x &gt; 3'], a: 0, e: `(x − 2)(x − 3) &lt; 0. The roots are 2 and 3, and the curve opens upward, so it is below zero between them: 2 &lt; x &lt; 3.` },
      { l: 4, q: `The boundary line is dashed. Which inequality describes the shaded region?`, g: ['grid', { ax: [-2, 4, -4, 5], fit: 1, half: [[2, -1, false, true]], label: 'The dashed line y = 2x − 1 on a grid, with the region below it shaded' }], o: ['y &lt; 2x − 1', 'y &gt; 2x − 1', 'y ≤ 2x − 1', 'y ≥ 2x − 1'], a: 0, e: `The line is y = 2x − 1: it meets the y-axis at −1 and rises 2 for every 1 across. The shading is below the line, and the line is dashed, so the region is y &lt; 2x − 1.` },
      { l: 5, q: `Solve x² − 2x − 8 ≥ 0.`, o: ['x ≤ −2 or x ≥ 4', '−2 ≤ x ≤ 4', 'x ≤ −4 or x ≥ 2', '−4 ≤ x ≤ 2'], a: 0, e: `(x − 4)(x + 2) ≥ 0, with roots −2 and 4. The curve opens upward, so it is at or above zero outside the roots: x ≤ −2 or x ≥ 4.` },
      { l: 5, q: `Find the largest integer x that satisfies ${fr('3x + 2', 4)} &lt; ${fr('x + 7', 2)}.`, o: ['11', '12', '13', '5'], a: 0, e: `Multiply both sides by 4: 3x + 2 &lt; 2x + 14. So x &lt; 12, and the largest integer below 12 is 11.` }
    ], 0)
  },

  /* ───────────── PROBABILITY ───────────── */
  {
    id: 'prob', name: 'Probability', sec: 'Section V · Statistics', boss: 'The Dice Trickster',
    goals: ['Find the probability of an event, and of the event not happening', 'Use the addition rule for "or" and the multiplication rule for "and"', 'Count outcomes with tables and tree diagrams'],
    parts: [
      {
        title: 'Single events',
        idea: `Probability measures how likely something is, on a scale from 0 (impossible) to 1 (certain). When all the outcomes are equally likely, you find it by counting.`,
        rules: [
          `P(event) = number of favourable outcomes ÷ total number of outcomes.`,
          `0 ≤ P ≤ 1. An impossible event has probability 0 and a certain event has probability 1.`,
          `P(not A) = 1 − P(A).`,
          `A fair die has 6 outcomes and a coin has 2. A pack of cards has 52, with 13 in each of 4 suits and 4 of each value, such as 4 kings.`
        ],
        ex: {
          q: `A bag holds 5 red, 3 blue and 4 green balls. One ball is picked at random. Find the probability that it is not blue.`,
          steps: [
            [`Total = 5 + 3 + 4 = 12 balls`, `Count every possible outcome.`],
            [`P(blue) = ${fr(3, 12)} = ${fr(1, 4)}`, `3 of the 12 balls are blue.`],
            [`P(not blue) = 1 − ${fr(1, 4)} = ${fr(3, 4)}`, `Take P(blue) away from 1.`]
          ]
        },
        tryit: {
          q: `A fair die is thrown once. Find the probability of getting a number greater than 4.`,
          given: [`Numbers greater than 4: 5 and 6. That is 2 outcomes`, `Total outcomes: 6`],
          ask: `P = ?`, o: [fr(1, 6), fr(1, 3), fr(1, 2), fr(2, 3)], a: 1,
          h: `Write 2 out of 6 as a fraction, then simplify.`, e: `${fr(2, 6)} = ${fr(1, 3)}.`
        }
      },
      {
        title: 'Combined events',
        idea: `When two things happen together, such as throwing two dice or picking two balls from a bag, list the outcomes in a table or a tree. Then the rules for "or" and "and" do the rest.`,
        g: ['dice', { hl: [7], label: 'Table of totals for two dice, with the six totals of 7 highlighted' }],
        cap: `The 36 totals for two dice. Six of them are 7, so P(total of 7) = ${fr(6, 36)} = ${fr(1, 6)}.`,
        rules: [
          `Or, for events that cannot happen together: P(A or B) = P(A) + P(B).`,
          `And, for events that do not affect each other: P(A and B) = P(A) × P(B).`,
          `Without replacement, the bag has one fewer item for the second pick. Change the fractions.`,
          `On a tree diagram, multiply along the branches. Add the results of different paths.`
        ],
        ex: {
          q: `A bag holds 3 red and 2 blue balls. Two balls are picked one after the other, without replacement. Find the probability that both are red.`,
          g: TREE,
          steps: [
            [`P(first is red) = ${fr(3, 5)}`, `3 of the 5 balls are red.`],
            [`P(second is red) = ${fr(2, 4)}`, `One red ball is gone, so 2 red balls are left out of 4.`],
            [`P(both red) = ${fr(3, 5)} × ${fr(2, 4)} = ${fr(6, 20)} = ${fr(3, 10)}`, `Multiply along the branches.`]
          ]
        },
        tryit: {
          q: `A coin is tossed and a die is thrown. Find the probability of a head and a 6.`,
          given: [`P(head) = ${fr(1, 2)} and P(6) = ${fr(1, 6)}`, `The coin and the die do not affect each other, so multiply`],
          ask: `= ?`, o: [fr(1, 12), fr(2, 3), fr(1, 8), fr(1, 3)], a: 0,
          h: `Multiply the two fractions.`, e: `${fr(1, 2)} × ${fr(1, 6)} = ${fr(1, 12)}.`
        }
      }
    ],
    trap: `Read for "without replacement". Then the bag changes after the first pick, and the second fraction has a smaller total.`,
    qs: mix([
      { l: 1, q: `A fair coin is tossed once. What is the probability of getting a tail?`, o: [fr(1, 2), '1', fr(1, 4), '0'], a: 0, e: `There are 2 equally likely outcomes, and 1 of them is a tail. P(tail) = ${fr(1, 2)}.` },
      { l: 1, q: `The probability that it rains tomorrow is 0.3. What is the probability that it does not rain?`, o: ['0.3', '0.7', '1.3', '0.03'], a: 1, e: `P(not rain) = 1 − 0.3 = 0.7.` },
      { l: 2, dx: 1, q: `A letter is chosen at random from the word MATHEMATICS. Find the probability that it is M.`, o: [fr(2, 11), fr(1, 11), fr(2, 9), fr(1, 8)], a: 0, e: `MATHEMATICS has 11 letters, and 2 of them are M. P(M) = ${fr(2, 11)}.` },
      { l: 2, q: `A fair die is thrown once. Find the probability of getting an even number or a 5.`, o: [fr(1, 2), fr(1, 6), fr(2, 3), fr(5, 6)], a: 2, e: `Even numbers: 2, 4 and 6. Adding 5 gives 4 outcomes out of 6. P = ${fr(4, 6)} = ${fr(2, 3)}.` },
      { l: 2, q: `A card is drawn at random from a pack of 52 playing cards. Find the probability that it is a king.`, o: [fr(1, 13), fr(1, 4), fr(1, 52), fr(4, 13)], a: 0, e: `There are 4 kings in 52 cards. P(king) = ${fr(4, 52)} = ${fr(1, 13)}.` },
      { l: 3, dx: 1, q: `Two fair dice are thrown. Use the table of totals to find the probability that the total is 8.`, g: ['dice', { label: 'Table of totals for two dice' }], o: [fr(5, 36), fr(1, 6), fr(1, 9), fr(2, 9)], a: 0, e: `A total of 8 appears 5 times: 2 + 6, 3 + 5, 4 + 4, 5 + 3 and 6 + 2. There are 36 outcomes, so P = ${fr(5, 36)}.` },
      { l: 3, q: `A bag holds 4 white and 6 black balls. Two balls are picked with replacement. Find the probability that both are white.`, o: [fr(4, 25), fr(2, 15), fr(2, 5), fr(16, 25)], a: 0, e: `With replacement, each pick has P(white) = ${fr(4, 10)} = ${fr(2, 5)}. Both white: ${fr(2, 5)} × ${fr(2, 5)} = ${fr(4, 25)}. (${fr(2, 15)} would be the answer without replacement.)` },
      { l: 3, q: `The probabilities that Ada and Bayo pass an exam are ${fr(2, 3)} and ${fr(3, 5)}. Find the probability that both pass.`, o: [fr(2, 5), fr(19, 15), fr(5, 8), fr(1, 15)], a: 0, e: `Their results do not affect each other, so multiply: ${fr(2, 3)} × ${fr(3, 5)} = ${fr(6, 15)} = ${fr(2, 5)}.` },
      { l: 4, q: `The probabilities that Ada and Bayo pass an exam are ${fr(2, 3)} and ${fr(3, 5)}. Find the probability that neither of them passes.`, o: [fr(2, 15), fr(1, 15), fr(13, 15), fr(2, 5)], a: 0, e: `P(Ada fails) = ${fr(1, 3)} and P(Bayo fails) = ${fr(2, 5)}. Both fail: ${fr(1, 3)} × ${fr(2, 5)} = ${fr(2, 15)}.` },
      { l: 4, q: `The tree diagram shows two picks from a bag of 3 red and 2 blue balls, without replacement. Find the probability of one red and one blue, in either order.`, g: TREE, o: [fr(3, 5), fr(3, 10), fr(6, 25), fr(12, 25)], a: 0, e: `Red then blue: ${fr(3, 5)} × ${fr(2, 4)} = ${fr(6, 20)}. Blue then red: ${fr(2, 5)} × ${fr(3, 4)} = ${fr(6, 20)}. Add the two paths: ${fr(12, 20)} = ${fr(3, 5)}.` },
      { l: 5, q: `Two fair dice are thrown. Find the probability that the total is at least 10.`, o: [fr(1, 6), fr(1, 12), fr(5, 36), fr(1, 4)], a: 0, e: `A total of 10 happens 3 ways, 11 happens 2 ways and 12 happens 1 way. That is 6 outcomes out of 36, so P = ${fr(6, 36)} = ${fr(1, 6)}.` },
      { l: 5, q: `Three fair coins are tossed. Find the probability of getting at least one head.`, o: [fr(7, 8), fr(1, 2), fr(3, 8), fr(1, 8)], a: 0, e: `The only way to get no head is three tails: ${fr(1, 2)} × ${fr(1, 2)} × ${fr(1, 2)} = ${fr(1, 8)}. So P(at least one head) = 1 − ${fr(1, 8)} = ${fr(7, 8)}.` }
    ], 2)
  }
);

/* Road to Campus content, batch 4: Progressions, Polynomials, Simultaneous Equations, Integration,
   and Permutation and Combination. Same format as content3.js, and mix() spreads the right answers across A to D. */
const INT = (a, b) => `∫<sub>${a}</sub><sup>${b}</sup>`;
const nP = (n, r) => `<sup>${n}</sup>P<sub>${r}</sub>`;
const nC = (n, r) => `<sup>${n}</sup>C<sub>${r}</sub>`;
const PLUSC = s => `${s} + c`;

CONTENT.topics.push(

  /* ───────────── PROGRESSIONS ───────────── */
  {
    id: 'prog', name: 'Progressions', sec: 'Section II · Algebra', boss: 'The Sequence Sphinx',
    goals: ['Find any term of an arithmetic or geometric progression', 'Find the sum of the first n terms', 'Use the sum to infinity of a geometric progression'],
    parts: [
      {
        title: 'Arithmetic progressions (AP)',
        idea: `In an arithmetic progression you add the same number every time. That number is called the common difference, d.`,
        g: ['seq', { t: ['3', '7', '11', '15', '19'], op: '+4', label: 'The sequence 3, 7, 11, 15, 19, with +4 between each pair of terms' }],
        cap: `3, 7, 11, 15, 19, … is an AP with first term a = 3 and common difference d = 4.`,
        rules: [
          `Common difference: d = any term − the term before it.`,
          `nth term: T<sub>n</sub> = a + (n − 1)d.`,
          `Sum of the first n terms: S<sub>n</sub> = ${fr('n', 2)}(2a + (n − 1)d).`,
          `x, y and z are in AP when y − x = z − y, which means 2y = x + z.`
        ],
        ex: {
          q: `Find the 20th term of the AP 5, 8, 11, …`,
          steps: [
            [`a = 5 and d = 8 − 5 = 3`, `Read off the first term and the common difference.`],
            [`T<sub>20</sub> = 5 + (20 − 1) × 3`, `Use T<sub>n</sub> = a + (n − 1)d with n = 20.`],
            [`= 5 + 57 = 62`, `19 × 3 = 57.`]
          ]
        },
        tryit: {
          q: `Find the sum of the first 10 terms of the AP 2, 6, 10, …`,
          given: [`a = 2, d = 4 and n = 10`, `S<sub>10</sub> = ${fr(10, 2)}(2 × 2 + 9 × 4) = 5 × (4 + 36)`],
          ask: `= ?`, o: ['180', '200', '220', '400'], a: 1,
          h: `Work out 4 + 36 first, then multiply by 5.`, e: `4 + 36 = 40 and 5 × 40 = 200.`
        }
      },
      {
        title: 'Geometric progressions (GP)',
        idea: `In a geometric progression you multiply by the same number every time. That number is called the common ratio, r.`,
        g: ['seq', { t: ['2', '6', '18', '54', '162'], op: '×3', label: 'The sequence 2, 6, 18, 54, 162, with ×3 between each pair of terms' }],
        cap: `2, 6, 18, 54, 162, … is a GP with first term a = 2 and common ratio r = 3.`,
        rules: [
          `Common ratio: r = any term ÷ the term before it.`,
          `nth term: T<sub>n</sub> = ar<sup>n − 1</sup>.`,
          `Sum of the first n terms: S<sub>n</sub> = ${fr('a(r<sup>n</sup> − 1)', 'r − 1')}.`,
          `When r is between −1 and 1, the sum to infinity is S<sub>∞</sub> = ${fr('a', '1 − r')}.`
        ],
        ex: {
          q: `Find the 6th term of the GP 3, 6, 12, …`,
          steps: [
            [`a = 3 and r = 6 ÷ 3 = 2`, `Read off the first term and the common ratio.`],
            [`T<sub>6</sub> = 3 × 2<sup>5</sup>`, `Use T<sub>n</sub> = ar<sup>n − 1</sup> with n = 6.`],
            [`= 3 × 32 = 96`, `2<sup>5</sup> = 32.`]
          ]
        },
        tryit: {
          q: `Find the sum to infinity of the GP 12, 6, 3, …`,
          given: [`a = 12 and r = ${fr(6, 12)} = ${fr(1, 2)}`, `S<sub>∞</sub> = ${fr(12, '1 − ½')} = ${fr(12, '½')}`],
          ask: `= ?`, o: ['18', '24', '36', '6'], a: 1,
          h: `Dividing by ½ is the same as multiplying by 2.`, e: `12 ÷ ½ = 24. The terms 12 + 6 + 3 + 1.5 + … get closer and closer to 24.`
        }
      }
    ],
    trap: `T<sub>n</sub> uses (n − 1), not n. The first term has no d added, so the 10th term has only 9 differences.`,
    qs: mix([
      { l: 1, q: `Find the common difference of the AP 4, 9, 14, 19, …`, o: ['5', '4', '9', '−5'], a: 0, e: `d = 9 − 4 = 5. Every term is 5 more than the one before it.` },
      { l: 1, q: `What is the next term of the GP 2, 10, 50, …?`, o: ['100', '250', '150', '500'], a: 1, e: `The common ratio is 10 ÷ 2 = 5, so the next term is 50 × 5 = 250.` },
      { l: 2, dx: 1, q: `Find the 15th term of the AP 7, 10, 13, …`, o: ['49', '52', '45', '42'], a: 0, e: `a = 7 and d = 3, so T<sub>15</sub> = 7 + 14 × 3 = 49. (52 comes from using 15 differences instead of 14.)` },
      { l: 2, q: `Find the 5th term of the GP 81, 27, 9, …`, o: ['1', '3', fr(1, 3), '0'], a: 0, e: `a = 81 and r = ${fr(1, 3)}. T<sub>5</sub> = 81 × (${fr(1, 3)})<sup>4</sup> = ${fr(81, 81)} = 1. The terms are 81, 27, 9, 3, 1.` },
      { l: 2, q: `Find the sum of the first 20 terms of the AP 1, 2, 3, …`, o: ['200', '210', '190', '420'], a: 1, e: `S<sub>20</sub> = ${fr(20, 2)}(2 × 1 + 19 × 1) = 10 × 21 = 210.` },
      { l: 3, dx: 1, q: `The 3rd term of an AP is 11 and the 7th term is 27. Find the common difference.`, o: ['4', '16', '3', '5'], a: 0, e: `a + 2d = 11 and a + 6d = 27. Subtracting gives 4d = 16, so d = 4.` },
      { l: 3, q: `Which term of the AP 5, 9, 13, … is 81?`, o: ['19th', '20th', '21st', '76th'], a: 1, e: `5 + (n − 1) × 4 = 81, so (n − 1) × 4 = 76, n − 1 = 19 and n = 20.` },
      { l: 3, q: `If x, 2x + 1 and 5x − 4 are consecutive terms of an AP, find x.`, o: ['3', '2', '−3', '5'], a: 0, e: `The middle term is the average of the other two: 2(2x + 1) = x + (5x − 4). So 4x + 2 = 6x − 4, which gives 2x = 6 and x = 3.` },
      { l: 4, q: `Find the sum of the first 6 terms of the GP 2, 6, 18, …`, o: ['728', '1458', '486', '364'], a: 0, e: `S<sub>6</sub> = ${fr('2(3<sup>6</sup> − 1)', '3 − 1')} = 3<sup>6</sup> − 1 = 728. Check: 2 + 6 + 18 + 54 + 162 + 486 = 728.` },
      { l: 4, q: `Find the sum to infinity of the GP 8, −4, 2, −1, …`, o: [fr(16, 3), '16', '4', fr(8, 3)], a: 0, e: `r = −4 ÷ 8 = −${fr(1, 2)}. S<sub>∞</sub> = ${fr(8, '1 + ½')} = 8 ÷ ${fr(3, 2)} = ${fr(16, 3)}. (16 comes from forgetting that r is negative.)` },
      { l: 5, q: `The 2nd and 5th terms of a GP are 6 and 162. Find the first term.`, o: ['2', '3', '6', '18'], a: 0, e: `ar = 6 and ar<sup>4</sup> = 162. Dividing gives r³ = 27, so r = 3. Then a = 6 ÷ 3 = 2.` },
      { l: 5, q: `How many terms of the AP 3, 7, 11, … must be added to give a sum of 300?`, o: ['12', '10', '15', '25'], a: 0, e: `S<sub>n</sub> = ${fr('n', 2)}(6 + 4(n − 1)) = n(2n + 1). So 2n² + n − 300 = 0, which factorises as (n − 12)(2n + 25) = 0. n must be a positive whole number, so n = 12.` }
    ], 1)
  },

  /* ───────────── POLYNOMIALS ───────────── */
  {
    id: 'poly', name: 'Polynomials', sec: 'Section II · Algebra', boss: 'The Remainder Reaper',
    goals: ['Use the remainder theorem to find a remainder without dividing', 'Use the factor theorem to test factors and find unknowns', 'Factorise cubic polynomials and find their roots'],
    parts: [
      {
        title: 'The remainder theorem',
        idea: `A polynomial is an expression such as 2x³ − 3x² + x − 5, built from whole-number powers of x. The remainder theorem saves you long division: you only substitute one number.`,
        rules: [
          `When f(x) is divided by (x − a), the remainder is f(a).`,
          `When f(x) is divided by (x + a), the remainder is f(−a).`,
          `When f(x) is divided by (ax − b), the remainder is f(${fr('b', 'a')}).`,
          `The degree of a polynomial is its highest power of x.`
        ],
        ex: {
          q: `Find the remainder when f(x) = x³ − 2x² + 4x − 5 is divided by (x − 2).`,
          steps: [
            [`Remainder = f(2)`, `We divide by (x − 2), so put x = 2.`],
            [`f(2) = 8 − 8 + 8 − 5`, `2³ = 8, 2 × 2² = 8 and 4 × 2 = 8.`],
            [`= 3`, `So the remainder is 3.`]
          ]
        },
        tryit: {
          q: `Find the remainder when f(x) = 2x² + 3x − 1 is divided by (x + 1).`,
          given: [`We divide by (x + 1), so put x = −1`, `f(−1) = 2(1) + 3(−1) − 1`],
          ask: `= ?`, o: ['−2', '0', '4', '2'], a: 0,
          h: `Work out 2 − 3 − 1.`, e: `2 − 3 − 1 = −2, so the remainder is −2.`
        }
      },
      {
        title: 'The factor theorem and cubic graphs',
        idea: `If the remainder is 0, the divisor goes in exactly, so it is a factor. On a graph, each factor (x − a) shows up where the curve crosses the x-axis, at x = a.`,
        g: ['parab', { cf: [3, -1, -3, 1], ax: [-2, 4, -6, 6], pl: [-1.5, 3.5], roots: [-1, 1, 3], label: 'Graph of y = x³ − 3x² − x + 3, crossing the x-axis at −1, 1 and 3' }],
        cap: `y = x³ − 3x² − x + 3 = (x + 1)(x − 1)(x − 3). It crosses the x-axis at −1, 1 and 3.`,
        rules: [
          `If f(a) = 0, then (x − a) is a factor of f(x).`,
          `To factorise a cubic, try small numbers such as ±1, ±2 and ±3 until f(a) = 0. Then divide to find the quadratic factor.`,
          `Each factor (x − a) gives a root x = a, where the graph crosses the x-axis.`
        ],
        ex: {
          q: `Factorise f(x) = x³ − 6x² + 11x − 6 completely.`,
          steps: [
            [`f(1) = 1 − 6 + 11 − 6 = 0, so (x − 1) is a factor`, `Try x = 1 first.`],
            [`f(x) = (x − 1)(x² − 5x + 6)`, `Divide by (x − 1), or match the coefficients.`],
            [`= (x − 1)(x − 2)(x − 3)`, `Factorise the quadratic: −2 and −3 multiply to give 6 and add to give −5.`]
          ]
        },
        tryit: {
          q: `(x − 2) is a factor of x³ + kx − 4. Find k.`,
          given: [`(x − 2) is a factor, so f(2) = 0`, `8 + 2k − 4 = 0, so 2k + 4 = 0`],
          ask: `k = ?`, o: ['2', '−2', '4', '−4'], a: 1,
          h: `Solve 2k + 4 = 0.`, e: `2k = −4, so k = −2.`
        }
      }
    ],
    trap: `Dividing by (x + 2) means putting x = −2, not x = 2. Set the divisor equal to zero and solve it to find the number to substitute.`,
    qs: mix([
      { l: 1, q: `What is the degree of 4x³ − 2x<sup>5</sup> + x − 7?`, o: ['3', '4', '5', '7'], a: 2, e: `The degree is the highest power of x. The highest power here is x<sup>5</sup>, so the degree is 5.` },
      { l: 1, q: `If f(x) = x² − 3x + 2, find f(3).`, o: ['2', '0', '20', '−2'], a: 0, e: `f(3) = 9 − 9 + 2 = 2.` },
      { l: 2, dx: 1, q: `Find the remainder when x³ + 2x² − 5x + 1 is divided by (x − 1).`, o: ['−1', '1', '9', '−3'], a: 0, e: `The remainder is f(1) = 1 + 2 − 5 + 1 = −1.` },
      { l: 2, q: `Find the remainder when 2x³ − x² + 3 is divided by (x + 2).`, o: ['−17', '15', '31', '−13'], a: 0, e: `The remainder is f(−2) = 2(−8) − 4 + 3 = −17. (15 is f(2), which uses the wrong sign.)` },
      { l: 2, q: `Which of these is a factor of x² + x − 6?`, o: ['(x − 2)', '(x + 2)', '(x − 3)', '(x − 6)'], a: 0, e: `f(2) = 4 + 2 − 6 = 0, so (x − 2) is a factor. In full, x² + x − 6 = (x − 2)(x + 3).` },
      { l: 3, dx: 1, q: `Find k if (x − 3) is a factor of x³ − 4x² + kx + 6.`, o: ['1', '−1', '3', '5'], a: 0, e: `f(3) = 0, so 27 − 36 + 3k + 6 = 0. That gives 3k − 3 = 0 and k = 1.` },
      { l: 3, q: `When x³ + ax − 2 is divided by (x − 2), the remainder is 10. Find a.`, o: ['2', '4', '−2', '6'], a: 0, e: `f(2) = 10, so 8 + 2a − 2 = 10. That gives 2a = 4 and a = 2.` },
      { l: 3, q: `The graph of y = f(x) is shown. Which of these is a factor of f(x)?`, g: ['parab', { cf: [6, -5, -2, 1], ax: [-3, 4, -8, 10], pl: [-2.4, 3.4], label: 'Graph of a cubic curve crossing the x-axis at −2, 1 and 3' }], o: ['(x + 2)', '(x − 2)', '(x + 1)', '(x + 3)'], a: 0, e: `The curve crosses the x-axis at x = −2, 1 and 3. A crossing at x = −2 means (x + 2) is a factor.` },
      { l: 4, q: `Factorise x³ − 7x + 6 completely.`, o: ['(x − 1)(x − 2)(x + 3)', '(x + 1)(x + 2)(x − 3)', '(x − 1)(x + 2)(x − 3)', '(x − 1)²(x + 6)'], a: 0, e: `f(1) = 1 − 7 + 6 = 0, so (x − 1) is a factor, and x³ − 7x + 6 = (x − 1)(x² + x − 6). Then x² + x − 6 = (x − 2)(x + 3).` },
      { l: 4, q: `Find the remainder when 4x³ − 2x + 5 is divided by (2x − 1).`, o: [fr(9, 2), '5', fr(7, 2), '9'], a: 0, e: `2x − 1 = 0 gives x = ½. The remainder is f(½) = 4 × ${fr(1, 8)} − 1 + 5 = ½ + 4 = ${fr(9, 2)}.` },
      { l: 5, q: `Find the roots of x³ − 4x² + x + 6 = 0.`, o: ['−1, 2 and 3', '1, −2 and −3', '−1, −2 and 3', '1, 2 and 3'], a: 0, e: `f(−1) = −1 − 4 − 1 + 6 = 0, so (x + 1) is a factor and the cubic is (x + 1)(x² − 5x + 6) = (x + 1)(x − 2)(x − 3). The roots are −1, 2 and 3.` },
      { l: 5, q: `f(x) = x³ + px² + qx − 6. Both (x − 1) and (x + 2) are factors. Find p and q.`, o: ['p = 4, q = 1', 'p = 1, q = 4', 'p = 3, q = 2', 'p = 2, q = 3'], a: 0, e: `f(1) = 0 gives p + q = 5. f(−2) = 0 gives −8 + 4p − 2q − 6 = 0, so 2p − q = 7. Adding the two equations gives 3p = 12, so p = 4 and q = 1.` }
    ], 2)
  },

  /* ───────────── SIMULTANEOUS EQUATIONS ───────────── */
  {
    id: 'simul', name: 'Simultaneous Equations', sec: 'Section II · Algebra', boss: 'The Twin Tyrant',
    goals: ['Solve two linear equations by elimination and by substitution', 'Read the solution as the point where two lines meet', 'Solve one linear and one quadratic equation together'],
    parts: [
      {
        title: 'Elimination and substitution',
        idea: `Two equations with two unknowns can be solved together. The aim is to get rid of one unknown, so that you are left with an ordinary equation in the other.`,
        rules: [
          `Elimination: make the number in front of one unknown the same in both equations, then add or subtract the equations.`,
          `Same signs, subtract. Different signs, add.`,
          `Substitution: make one unknown the subject of one equation, then put it into the other equation.`,
          `Always check your answer in both of the original equations.`
        ],
        ex: {
          q: `Solve 2x + 3y = 12 and x − y = 1.`,
          steps: [
            [`Multiply the second equation by 3: 3x − 3y = 3`, `Now y has 3 in front in one equation and −3 in the other.`],
            [`Add: 5x = 15, so x = 3`, `Different signs, so add. The y terms cancel.`],
            [`3 − y = 1, so y = 2`, `Put x = 3 into x − y = 1. Check: 2(3) + 3(2) = 12.`]
          ]
        },
        tryit: {
          q: `Solve x + y = 10 and x − y = 4.`,
          given: [`Add the equations: 2x = 14, so x = 7`, `Then 7 + y = 10`],
          ask: `So ?`, o: ['x = 7, y = 3', 'x = 3, y = 7', 'x = 7, y = 4', 'x = 14, y = −4'], a: 0,
          h: `Solve 7 + y = 10 for y.`, e: `y = 3. Check in the other equation: 7 − 3 = 4.`
        }
      },
      {
        title: 'Graphs, and a line with a curve',
        idea: `Every linear equation is a straight line. The solution of two of them is the point where the lines meet, because only that point lies on both lines.`,
        g: ['grid', { ax: [-1, 6, -2, 6], lines: [[1, -1], [-1, 5]], pts: [[3, 2, '(3, 2)', 8, -10]], label: 'The lines x − y = 1 and x + y = 5 crossing at the point (3, 2)' }],
        cap: `x − y = 1 and x + y = 5 cross at (3, 2), so x = 3 and y = 2 is the solution.`,
        rules: [
          `The solution of two linear equations is the point where their lines cross.`,
          `Parallel lines never meet, so their equations have no solution.`,
          `For one linear and one quadratic equation, make y the subject of the linear one and substitute it into the quadratic. You get a quadratic equation, which usually has two solutions.`
        ],
        ex: {
          q: `Solve y = x + 1 and y = x² − 1.`,
          steps: [
            [`x² − 1 = x + 1`, `Both are equal to y, so set them equal to each other.`],
            [`x² − x − 2 = 0, so (x − 2)(x + 1) = 0`, `Bring everything to one side and factorise.`],
            [`x = 2, y = 3 or x = −1, y = 0`, `Use y = x + 1 to find y for each value of x.`]
          ]
        },
        tryit: {
          q: `Two lines meet at the point P. What is the solution of their equations?`,
          g: ['grid', { ax: [-1, 5, -2, 6], lines: [[2, -1], [-1, 5]], pts: [[2, 3, 'P', 8, -10]], label: 'The lines y = 2x − 1 and y = −x + 5 crossing at a point P' }],
          given: [`Read down from P to the x-axis: x = 2`, `Read across from P to the y-axis: y = 3`],
          ask: `So the solution is ?`, o: ['x = 2, y = 3', 'x = 3, y = 2', 'x = −1, y = 5', 'x = 0, y = 5'], a: 0,
          h: `x is read on the horizontal axis and y on the vertical axis.`, e: `P is the point (2, 3), so x = 2 and y = 3.`
        }
      }
    ],
    trap: `When you subtract one equation from another, subtract every term, signs included. 3y − (−2y) is 5y, not y.`,
    qs: mix([
      { l: 1, q: `Solve x + y = 7 and x − y = 1.`, o: ['x = 4, y = 3', 'x = 3, y = 4', 'x = 5, y = 2', 'x = 4, y = 1'], a: 0, e: `Adding gives 2x = 8, so x = 4. Then 4 + y = 7, so y = 3.` },
      { l: 1, q: `If x = 2 and 3x + y = 11, find y.`, o: ['5', '3', '9', '17'], a: 0, e: `3(2) + y = 11, so 6 + y = 11 and y = 5.` },
      { l: 2, dx: 1, q: `Solve 2x + y = 8 and x − y = 1.`, o: ['x = 3, y = 2', 'x = 2, y = 4', 'x = 3, y = 1', 'x = 1, y = 6'], a: 0, e: `Adding gives 3x = 9, so x = 3. Then 3 − y = 1, so y = 2. Check: 2(3) + 2 = 8.` },
      { l: 2, q: `Solve 3x + 2y = 13 and x + 2y = 7.`, o: ['x = 3, y = 2', 'x = 2, y = 3', 'x = 5, y = 1', 'x = 1, y = 3'], a: 0, e: `Both have +2y, so subtract: 2x = 6 and x = 3. Then 3 + 2y = 7, so y = 2.` },
      { l: 2, q: `The graphs of two equations cross at P, as shown. Find the solution of the equations.`, g: ['grid', { ax: [-2, 5, -1, 6], lines: [[1, 2], [-1, 4]], pts: [[1, 3, 'P', 8, -10]], label: 'Two straight lines crossing at a point P' }], o: ['x = 1, y = 3', 'x = 3, y = 1', 'x = 2, y = 4', 'x = 0, y = 4'], a: 0, e: `P is at x = 1 on the horizontal axis and y = 3 on the vertical axis. So the solution is x = 1, y = 3.` },
      { l: 3, dx: 1, q: `Solve 2x + 3y = 7 and 3x − 2y = 4.`, o: ['x = 2, y = 1', 'x = 1, y = 2', 'x = −2, y = 1', 'x = 2, y = −1'], a: 0, e: `Multiply the first by 2 and the second by 3: 4x + 6y = 14 and 9x − 6y = 12. Adding gives 13x = 26, so x = 2. Then 4 + 3y = 7, so y = 1.` },
      { l: 3, q: `The sum of two numbers is 30 and their difference is 8. Find the larger number.`, o: ['19', '11', '22', '15'], a: 0, e: `x + y = 30 and x − y = 8. Adding gives 2x = 38, so x = 19. The other number is 11.` },
      { l: 3, q: `3 pens and 2 books cost ₦1,300. 1 pen and 2 books cost ₦900. Find the cost of one pen.`, o: ['₦200', '₦350', '₦400', '₦100'], a: 0, e: `3p + 2b = 1300 and p + 2b = 900. Subtracting gives 2p = 400, so p = ₦200. (₦350 is the cost of a book.)` },
      { l: 4, q: `Solve ${fr('x', 2)} + ${fr('y', 3)} = 4 and x − y = 3.`, o: ['x = 6, y = 3', 'x = 3, y = 6', 'x = 4, y = 1', 'x = 9, y = 6'], a: 0, e: `Multiply the first equation by 6: 3x + 2y = 24. From the second, x = y + 3. So 3(y + 3) + 2y = 24, which gives 5y = 15, y = 3 and x = 6.` },
      { l: 4, q: `For what value of k do the equations 2x + 3y = 5 and 4x + ky = 7 have no solution?`, o: ['6', '3', '−6', '12'], a: 0, e: `No solution means the lines are parallel. 4x is double 2x, so ky must be double 3y, giving k = 6. Then the left-hand sides are doubles of each other, but 7 is not double 5, so the lines never meet.` },
      { l: 5, q: `Solve y = 2x − 1 and y = x² − 4.`, o: ['(3, 5) and (−1, −3)', '(−3, −7) and (1, 1)', '(3, 5) and (1, 1)', '(−1, 5) and (3, −3)'], a: 0, e: `x² − 4 = 2x − 1, so x² − 2x − 3 = 0 and (x − 3)(x + 1) = 0. x = 3 gives y = 5, and x = −1 gives y = −3.` },
      { l: 5, q: `Solve x + y = 5 and xy = 6.`, o: ['x = 2, y = 3 or x = 3, y = 2', 'x = 1, y = 6 or x = 6, y = 1', 'x = −2, y = −3 or x = −3, y = −2', 'x = 2, y = 3 only'], a: 0, e: `y = 5 − x, so x(5 − x) = 6. That gives x² − 5x + 6 = 0 and (x − 2)(x − 3) = 0. When x = 2, y = 3, and when x = 3, y = 2. Both pairs work.` }
    ], 3)
  },

  /* ───────────── INTEGRATION ───────────── */
  {
    id: 'integ', name: 'Integration', sec: 'Section IV · Calculus', boss: 'The Area Phantom',
    goals: ['Integrate powers of x and add the constant', 'Evaluate definite integrals', 'Find the area under a curve'],
    parts: [
      {
        title: 'Integrating powers of x',
        idea: `Integration undoes differentiation. Differentiating x³ gives 3x², so integrating 3x² takes you back to x³, plus a constant that differentiation wiped out.`,
        rules: [
          `∫x<sup>n</sup> dx = ${fr('x<sup>n + 1</sup>', 'n + 1')} + c, for any n except −1. Add 1 to the power, then divide by the new power.`,
          `∫k dx = kx + c. A number on its own gains an x.`,
          `Integrate a sum term by term, and keep the number in front of each term.`,
          `Always add + c to an indefinite integral.`
        ],
        ex: {
          q: `Find ∫(6x² − 4x + 5) dx.`,
          steps: [
            [`∫6x² dx = ${fr('6x³', 3)} = 2x³`, `Add 1 to the power to get 3, then divide by 3.`],
            [`∫4x dx = ${fr('4x²', 2)} = 2x²`, `x has power 1, so it becomes x² and you divide by 2.`],
            [`Answer: 2x³ − 2x² + 5x + c`, `5 becomes 5x. Then add the constant c.`]
          ]
        },
        tryit: {
          q: `Find ∫(3x² + 2) dx.`,
          given: [`∫3x² dx = ${fr('3x³', 3)} = x³`, `∫2 dx = 2x`],
          ask: `So the answer is ?`, o: ['x³ + 2x + c', '6x + c', 'x³ + 2 + c', '3x³ + 2x + c'], a: 0,
          h: `Put the two parts together and add c.`, e: `x³ + 2x + c. Check: differentiating x³ + 2x gives 3x² + 2.`
        }
      },
      {
        title: 'Definite integrals and area',
        idea: `A definite integral has limits, such as from x = 1 to x = 3. It gives a number, not an expression. For a curve above the x-axis, that number is the area between the curve and the axis.`,
        g: ['parab', { cf: [0, 0, 1], ax: [-1, 3, -1, 5], pl: [-1, 2.2], shade: [0, 2], label: 'Graph of y = x² with the area under the curve from x = 0 to x = 2 shaded' }],
        cap: `The shaded area under y = x² between x = 0 and x = 2 is written ${INT(0, 2)} x² dx.`,
        rules: [
          `${INT('a', 'b')} f(x) dx = F(b) − F(a), where F is the integral of f. No + c is needed.`,
          `Work out F at the top limit, then at the bottom limit, then subtract.`,
          `For a curve above the x-axis, the definite integral is the area between the curve and the axis.`
        ],
        ex: {
          q: `Evaluate ${INT(1, 3)} 2x dx.`,
          g: ['parab', { cf: [0, 2], ax: [-1, 4, -1, 7], pl: [-0.4, 3.4], shade: [1, 3], label: 'The line y = 2x with the area under it from x = 1 to x = 3 shaded' }],
          steps: [
            [`∫2x dx = x²`, `Integrate first.`],
            [`= 3² − 1²`, `Top limit minus bottom limit.`],
            [`= 9 − 1 = 8`, `The shaded area is 8 square units.`]
          ]
        },
        tryit: {
          q: `Find the area under y = x² from x = 0 to x = 3.`,
          given: [`∫x² dx = ${fr('x³', 3)}`, `Area = ${fr('3³', 3)} − ${fr('0³', 3)}`],
          ask: `= ?`, o: ['9', '27', '3', '6'], a: 0,
          h: `3³ = 27, and 27 ÷ 3 = 9.`, e: `${fr(27, 3)} − 0 = 9 square units.`
        }
      }
    ],
    trap: `Do not forget to divide by the new power: ∫x³ dx is ${fr('x<sup>4</sup>', 4)} + c, not x<sup>4</sup> + c.`,
    qs: mix([
      { l: 1, q: `Find ∫x³ dx.`, o: [PLUSC(fr('x<sup>4</sup>', 4)), '3x² + c', 'x<sup>4</sup> + c', '4x<sup>4</sup> + c'], a: 0, e: `Add 1 to the power to get 4, then divide by 4: ${fr('x<sup>4</sup>', 4)} + c. (3x² is what you get by differentiating.)` },
      { l: 1, q: `Find ∫5 dx.`, o: ['5x + c', '5 + c', '0', 'x<sup>5</sup> + c'], a: 0, e: `A number on its own gains an x: ∫5 dx = 5x + c.` },
      { l: 2, dx: 1, q: `Find ∫(4x³ + 6x) dx.`, o: ['x<sup>4</sup> + 3x² + c', '12x² + 6 + c', '4x<sup>4</sup> + 6x² + c', 'x<sup>4</sup> + 6x² + c'], a: 0, e: `∫4x³ dx = ${fr('4x<sup>4</sup>', 4)} = x<sup>4</sup> and ∫6x dx = ${fr('6x²', 2)} = 3x². So the answer is x<sup>4</sup> + 3x² + c.` },
      { l: 2, q: `Evaluate ${INT(0, 2)} 3x² dx.`, o: ['8', '12', '6', '24'], a: 0, e: `∫3x² dx = x³. Then 2³ − 0³ = 8.` },
      { l: 2, q: `Find ∫(2x − 3) dx.`, o: ['x² − 3x + c', '2 + c', '2x² − 3x + c', 'x² − 3 + c'], a: 0, e: `∫2x dx = x² and ∫3 dx = 3x. So the answer is x² − 3x + c.` },
      { l: 3, dx: 1, q: `Evaluate ${INT(1, 2)} (2x + 1) dx.`, o: ['4', '6', '2', '5'], a: 0, e: `∫(2x + 1) dx = x² + x. At x = 2 this is 6, and at x = 1 it is 2. So the answer is 6 − 2 = 4.` },
      { l: 3, q: `Find the area of the shaded region under y = x² + 1, from x = 0 to x = 3.`, g: ['parab', { cf: [1, 0, 1], ax: [-1, 4, -1, 11], pl: [-1, 3.1], shade: [0, 3], label: 'Graph of y = x² + 1 with the area under it from x = 0 to x = 3 shaded' }], o: ['12', '9', '10', '30'], a: 0, e: `∫(x² + 1) dx = ${fr('x³', 3)} + x. At x = 3 this is 9 + 3 = 12, and at x = 0 it is 0. The area is 12 square units.` },
      { l: 3, q: `Find ∫${fr(1, 'x²')} dx.`, o: [`−${fr(1, 'x')} + c`, `${fr(1, 'x')} + c`, `−${fr(2, 'x³')} + c`, `${fr('x³', 3)} + c`], a: 0, e: `Write ${fr(1, 'x²')} as x<sup>−2</sup>. Adding 1 to the power gives x<sup>−1</sup>, and dividing by −1 gives −x<sup>−1</sup>. So the answer is −${fr(1, 'x')} + c.` },
      { l: 4, q: `The gradient of a curve is ${DYDX} = 2x + 3, and the curve passes through (1, 6). Find its equation.`, o: ['y = x² + 3x + 2', 'y = x² + 3x + 6', 'y = 2x² + 3x + 1', 'y = x² + 3x'], a: 0, e: `Integrate: y = x² + 3x + c. The point (1, 6) is on the curve, so 6 = 1 + 3 + c and c = 2. So y = x² + 3x + 2.` },
      { l: 4, q: `Evaluate ${INT(1, 3)} (x² − 2x) dx.`, o: [fr(2, 3), '0', fr(4, 3), `−${fr(2, 3)}`], a: 0, e: `∫(x² − 2x) dx = ${fr('x³', 3)} − x². At x = 3 this is 9 − 9 = 0, and at x = 1 it is ${fr(1, 3)} − 1 = −${fr(2, 3)}. So the answer is 0 − (−${fr(2, 3)}) = ${fr(2, 3)}.` },
      { l: 5, q: `Find the area enclosed by the curve y = 4 − x² and the x-axis.`, g: ['parab', { cf: [4, 0, -1], ax: [-3, 3, -2, 5], pl: [-2.4, 2.4], shade: [-2, 2], roots: [-2, 2], label: 'Graph of y = 4 − x², crossing the x-axis at −2 and 2, with the area between the curve and the axis shaded' }], o: [fr(32, 3), fr(16, 3), '16', '8'], a: 0, e: `The curve crosses the x-axis at x = −2 and 2. ∫(4 − x²) dx = 4x − ${fr('x³', 3)}. At x = 2 this is 8 − ${fr(8, 3)} = ${fr(16, 3)}, and at x = −2 it is −${fr(16, 3)}. The area is ${fr(16, 3)} + ${fr(16, 3)} = ${fr(32, 3)}.` },
      { l: 5, q: `If ${INT(0, 'k')} 2x dx = 16 and k is positive, find k.`, o: ['4', '8', '16', '2'], a: 0, e: `∫2x dx = x², so k² − 0² = 16. That gives k = 4 (k is positive, so not −4).` }
    ], 0)
  },

  /* ───────────── PERMUTATION AND COMBINATION ───────────── */
  {
    id: 'perm', name: 'Permutation and Combination', sec: 'Section V · Statistics', boss: 'The Arrangement Ace',
    goals: ['Use factorials and the counting principle', 'Count arrangements with permutations, where order matters', 'Count selections with combinations, where order does not matter'],
    parts: [
      {
        title: 'Arrangements and permutations',
        idea: `When you fill places one after another, multiply the number of choices for each place. In an arrangement, order matters: ABC and CBA are different.`,
        g: ['slots', { n: [5, 4, 3], names: ['President', 'Secretary', 'Treasurer'], label: 'Three posts filled from 5 people: 5 choices for president, then 4 for secretary, then 3 for treasurer, giving 60 ways' }],
        cap: `Choosing a president, a secretary and a treasurer from 5 people: 5 × 4 × 3 = 60 ways.`,
        rules: [
          `n! (n factorial) = n × (n − 1) × … × 2 × 1. For example, 4! = 24. Also, 0! = 1.`,
          `n different objects can be arranged in a row in n! ways.`,
          `Permutations, when order matters: ${nP('n', 'r')} = ${fr('n!', '(n − r)!')}.`,
          `If an object repeats k times, divide by k!. LEVEL has 5 letters with L twice and E twice, so it has ${fr('5!', '2! × 2!')} = 30 arrangements.`
        ],
        ex: {
          q: `In how many ways can the letters of the word LAGOS be arranged?`,
          steps: [
            [`LAGOS has 5 different letters`, `No letter repeats.`],
            [`5! = 5 × 4 × 3 × 2 × 1`, `5 choices for the first place, 4 for the next, and so on.`],
            [`= 120`, `So there are 120 arrangements.`]
          ]
        },
        tryit: {
          q: `Evaluate ${nP(6, 2)}.`,
          given: [`${nP(6, 2)} = ${fr('6!', '4!')}`, `= 6 × 5`],
          ask: `= ?`, o: ['30', '15', '12', '720'], a: 0,
          h: `Multiply 6 by 5.`, e: `6 × 5 = 30. There are 30 ways to choose 2 things in order from 6.`
        }
      },
      {
        title: 'Selections and combinations',
        idea: `In a selection, order does not matter. Picking Ada then Bayo gives the same committee as picking Bayo then Ada, so a combination counts each group only once.`,
        rules: [
          `Combinations, when order does not matter: ${nC('n', 'r')} = ${fr('n!', '(n − r)! r!')}.`,
          `${nC('n', 'r')} = ${nC('n', 'n − r')}. Choosing 3 to go is the same as choosing the 2 who stay behind.`,
          `Arrangements, queues, rankings and posts use permutations. Committees, teams and handshakes use combinations.`,
          `For "this group and that group", work out each count, then multiply.`
        ],
        ex: {
          q: `A committee of 3 is to be chosen from 7 students. In how many ways can this be done?`,
          steps: [
            [`Order does not matter, so use combinations`, `A committee has no first or second member.`],
            [`${nC(7, 3)} = ${fr('7 × 6 × 5', '3 × 2 × 1')}`, `7! ÷ 4! leaves 7 × 6 × 5 on top. Divide by 3! for the order.`],
            [`= ${fr(210, 6)} = 35`, `So there are 35 different committees.`]
          ]
        },
        tryit: {
          q: `Evaluate ${nC(5, 2)}.`,
          given: [`${nC(5, 2)} = ${fr('5 × 4', '2 × 1')}`, `= ${fr(20, 2)}`],
          ask: `= ?`, o: ['10', '20', '5', '60'], a: 0,
          h: `Work out 20 ÷ 2.`, e: `20 ÷ 2 = 10. There are 10 ways to choose 2 things from 5 when order does not matter.`
        }
      }
    ],
    trap: `Before you calculate, decide whether order matters. "Choose", "select" and "committee" mean C. "Arrange", "queue" and named posts mean P.`,
    qs: mix([
      { l: 1, q: `Evaluate 5!.`, o: ['120', '25', '60', '20'], a: 0, e: `5! = 5 × 4 × 3 × 2 × 1 = 120.` },
      { l: 1, q: `Evaluate ${fr('8!', '6!')}.`, o: ['56', '2', '48', '336'], a: 0, e: `Everything from 6 down cancels, leaving 8 × 7 = 56.` },
      { l: 2, dx: 1, q: `In how many ways can 4 students sit in a row of 4 chairs?`, o: ['24', '16', '4', '12'], a: 0, e: `4 choices for the first chair, then 3, 2 and 1. 4! = 24.` },
      { l: 2, q: `Evaluate ${nP(5, 3)}.`, o: ['60', '10', '20', '125'], a: 0, e: `${nP(5, 3)} = 5 × 4 × 3 = 60. (10 is ${nC(5, 3)}, where order does not matter.)` },
      { l: 2, q: `Evaluate ${nC(6, 2)}.`, o: ['15', '30', '12', '36'], a: 0, e: `${nC(6, 2)} = ${fr('6 × 5', '2 × 1')} = 15.` },
      { l: 3, dx: 1, q: `In how many ways can a president and a vice-president be chosen from 8 candidates?`, o: ['56', '28', '64', '15'], a: 0, e: `The two posts are different, so order matters: 8 × 7 = 56. (28 would be choosing 2 people without posts.)` },
      { l: 3, q: `In how many ways can a team of 4 be chosen from 9 players?`, o: ['126', '3024', '36', '252'], a: 0, e: `A team has no order, so use ${nC(9, 4)} = ${fr('9 × 8 × 7 × 6', '4 × 3 × 2 × 1')} = ${fr(3024, 24)} = 126.` },
      { l: 3, q: `How many different arrangements of the letters of the word ABUJA are there?`, o: ['60', '120', '24', '30'], a: 0, e: `ABUJA has 5 letters, with A appearing twice. ${fr('5!', '2!')} = ${fr(120, 2)} = 60.` },
      { l: 4, q: `A committee of 2 men and 2 women is chosen from 5 men and 4 women. In how many ways can this be done?`, o: ['60', '16', '126', '36'], a: 0, e: `Men: ${nC(5, 2)} = 10. Women: ${nC(4, 2)} = 6. Multiply, because you need both: 10 × 6 = 60.` },
      { l: 4, q: `How many 3-digit numbers can be formed from the digits 1, 2, 3, 4, 5 and 6 if no digit is repeated?`, o: ['120', '216', '20', '60'], a: 0, e: `6 choices for the first digit, 5 for the second and 4 for the third: 6 × 5 × 4 = 120. (216 = 6³ allows repeats.)` },
      { l: 5, q: `Each of 10 people shakes hands once with every other person. How many handshakes are there?`, o: ['45', '90', '100', '20'], a: 0, e: `Each handshake is a pair of people, and order does not matter: ${nC(10, 2)} = ${fr('10 × 9', 2)} = 45. (90 counts every handshake twice.)` },
      { l: 5, q: `In how many ways can 5 boys and 3 girls stand in a row if the 3 girls must stand together?`, o: ['4320', '720', '40320', '2160'], a: 0, e: `Tie the 3 girls together as one block. That makes 6 units (5 boys and the block), which can be arranged in 6! = 720 ways. The girls can swap places inside the block in 3! = 6 ways. Total = 720 × 6 = 4320.` }
    ], 1)
  }
);

/* Road to Campus content, batch 5: Fractions, Decimals and Percentages; Binary Operations; Loci; Measures of Dispersion.
   These complete the topic list of the JAMB 2027 Mathematics syllabus. Same format as content4.js. */
const MOD5 = ['table', { head: ['⊗', '1', '2', '3', '4'], rows: [['1', '1', '2', '3', '4'], ['2', '2', '4', '1', '3'], ['3', '3', '1', '4', '2'], ['4', '4', '3', '2', '1']], label: 'Table for multiplication modulo 5 on the set {1, 2, 3, 4}. Row 1: 1, 2, 3, 4. Row 2: 2, 4, 1, 3. Row 3: 3, 1, 4, 2. Row 4: 4, 3, 2, 1' }];
const XBAR = 'x̄';

CONTENT.topics.push(

  /* ───────────── FRACTIONS, DECIMALS AND PERCENTAGES ───────────── */
  {
    id: 'frac', name: 'Fractions, Decimals and Percentages', sec: 'Section I · Number and Numeration', boss: 'The Market Master',
    goals: ['Round numbers to decimal places and significant figures', 'Find percentage error, and work with ratio, proportion and rate', 'Solve problems on simple interest, profit and loss, VAT and shares'],
    parts: [
      {
        title: 'Approximations and percentage error',
        idea: `Exams often ask you to round an answer, or to say how big an error is. Both depend on knowing which digits count.`,
        g: ['table', { head: ['Number', '2 d.p.', '2 s.f.'], rows: [['3.1416', '3.14', '3.1'], ['0.004637', '0.00', '0.0046'], ['48 352', '48 352.00', '48 000']], label: 'Table comparing rounding to 2 decimal places and to 2 significant figures. 3.1416 becomes 3.14 and 3.1. 0.004637 becomes 0.00 and 0.0046. 48 352 becomes 48 352.00 and 48 000' }],
        cap: `Rounding to decimal places and to significant figures can give very different answers for the same number.`,
        rules: [
          `Decimal places (d.p.) count the digits after the decimal point. 3.1416 to 2 d.p. is 3.14.`,
          `Significant figures (s.f.) count from the first digit that is not zero. 0.004637 to 2 s.f. is 0.0046.`,
          `To round, look at the next digit: 5 or more rounds up, and 4 or less leaves the digit as it is.`,
          `Percentage error = ${fr('error', 'actual value')} × 100%.`
        ],
        ex: {
          q: `A rod is 2.5 m long, but a student measures it as 2.4 m. Find the percentage error.`,
          steps: [
            [`Error = 2.5 − 2.4 = 0.1 m`, `The error is the difference between the actual and the measured values.`],
            [`Percentage error = ${fr('0.1', '2.5')} × 100%`, `Divide by the actual length.`],
            [`= 4%`, `0.1 ÷ 2.5 = 0.04, and 0.04 × 100 = 4.`]
          ]
        },
        tryit: {
          q: `Write 0.0052849 correct to 3 significant figures.`,
          given: [`The first significant figure is 5, so the first three are 5, 2 and 8`, `The next digit is 4, which is less than 5`],
          ask: `So the answer is ?`, o: ['0.00528', '0.00529', '0.005', '0.0053'], a: 0,
          h: `4 is less than 5, so the 8 stays as it is.`, e: `0.00528. The zeros before the 5 are not significant. They only hold the place.`
        }
      },
      {
        title: 'Money: interest, profit and loss, VAT and shares',
        idea: `These questions are percentages in everyday clothes. Work out what the percentage is a percentage of, then multiply.`,
        rules: [
          `Simple interest: I = ${fr('PRT', 100)}, where P is the principal, R the rate per year and T the time in years.`,
          `Profit or loss percent = ${fr('profit or loss', 'cost price')} × 100%. Always divide by the cost price.`,
          `VAT is added on top of the price. With 7.5% VAT, the price is multiplied by 1.075.`,
          `To share an amount in the ratio a : b, split it into a + b equal parts.`,
          `Dividend = number of shares × dividend per share.`
        ],
        ex: {
          q: `A trader buys a phone for ₦40,000 and sells it for ₦46,000. Find his percentage profit.`,
          steps: [
            [`Profit = ₦46,000 − ₦40,000 = ₦6,000`, `Selling price minus cost price.`],
            [`Profit % = ${fr('6,000', '40,000')} × 100%`, `Divide by the cost price, not the selling price.`],
            [`= 15%`, `6,000 ÷ 40,000 = 0.15.`]
          ]
        },
        tryit: {
          q: `Find the simple interest on ₦20,000 at 5% per year for 3 years.`,
          given: [`I = ${fr('PRT', 100)}`, `= ${fr('20,000 × 5 × 3', 100)}`],
          ask: `= ?`, o: ['₦3,000', '₦1,000', '₦300', '₦23,000'], a: 0,
          h: `20,000 × 15 = 300,000. Then divide by 100.`, e: `₦3,000. (₦23,000 is the amount: the principal plus the interest.)`
        }
      }
    ],
    trap: `Profit and loss percent use the cost price, not the selling price. Percentage error uses the actual value, not the measured one.`,
    qs: mix([
      { l: 1, q: `Write 7.4862 correct to 2 decimal places.`, o: ['7.49', '7.48', '7.5', '7.486'], a: 0, e: `The third decimal digit is 6, which is 5 or more, so the 8 rounds up to 9: 7.49.` },
      { l: 1, q: `Simplify ${fr(2, 3)} + ${fr(1, 4)}.`, o: [fr(11, 12), fr(3, 7), fr(3, 12), fr(2, 12)], a: 0, e: `Use the common denominator 12: ${fr(8, 12)} + ${fr(3, 12)} = ${fr(11, 12)}. (${fr(3, 7)} comes from adding tops and bottoms, which is wrong.)` },
      { l: 2, dx: 1, q: `Write 0.0004573 correct to 2 significant figures.`, o: ['0.00046', '0.00045', '0.0005', '0.46'], a: 0, e: `The first two significant figures are 4 and 5. The next digit is 7, so the 5 rounds up: 0.00046.` },
      { l: 2, q: `Share ₦24,000 between Ada and Bayo in the ratio 5 : 3. How much does Ada get?`, o: ['₦15,000', '₦9,000', '₦12,000', '₦8,000'], a: 0, e: `There are 5 + 3 = 8 parts, so one part is ₦24,000 ÷ 8 = ₦3,000. Ada gets 5 parts: ₦15,000.` },
      { l: 2, q: `A shirt costs ₦8,000 before VAT. Find its price with 7.5% VAT added.`, o: ['₦8,600', '₦600', '₦8,075', '₦8,750'], a: 0, e: `VAT = 7.5% of ₦8,000 = ₦600. The price with VAT is ₦8,000 + ₦600 = ₦8,600.` },
      { l: 3, dx: 1, q: `A trader buys an item for ₦2,500 and sells it for ₦2,000. Find the percentage loss.`, o: ['20%', '25%', '5%', '80%'], a: 0, e: `Loss = ₦500. Loss % = ${fr(500, '2,500')} × 100% = 20%. (25% comes from dividing by the selling price.)` },
      { l: 3, q: `A table is 1.5 m long, but it is measured as 1.56 m. Find the percentage error.`, o: ['4%', '3.8%', '6%', '0.04%'], a: 0, e: `Error = 1.56 − 1.5 = 0.06 m. Percentage error = ${fr('0.06', '1.5')} × 100% = 4%.` },
      { l: 3, q: `Find the simple interest on ₦50,000 at 4% per year for 6 months.`, o: ['₦1,000', '₦12,000', '₦2,000', '₦100'], a: 0, e: `6 months is ½ a year. I = ${fr('50,000 × 4 × ½', 100)} = ₦1,000. (₦12,000 comes from using T = 6.)` },
      { l: 4, q: `A car travels 150 km in 2 hours 30 minutes. Find its average speed.`, o: ['60 km/h', '75 km/h', '65 km/h', '50 km/h'], a: 0, e: `2 hours 30 minutes is 2.5 hours. Speed = 150 ÷ 2.5 = 60 km/h.` },
      { l: 4, q: `At what rate per year will ₦8,000 earn ₦1,200 simple interest in 3 years?`, o: ['5%', '15%', '4.5%', '6%'], a: 0, e: `R = ${fr('100I', 'PT')} = ${fr('100 × 1,200', '8,000 × 3')} = ${fr('120,000', '24,000')} = 5%.` },
      { l: 5, q: `A man buys 2,000 shares at ₦1.50 each. The company pays a dividend of 12 kobo per share. Find his dividend as a percentage of what he paid.`, o: ['8%', '12%', '6%', '18%'], a: 0, e: `He paid 2,000 × ₦1.50 = ₦3,000. His dividend is 2,000 × ₦0.12 = ₦240. As a percentage: ${fr(240, '3,000')} × 100% = 8%.` },
      { l: 5, q: `By selling an article for ₦6,600, a trader makes a profit of 10%. Find the cost price.`, o: ['₦6,000', '₦5,940', '₦7,260', '₦6,500'], a: 0, e: `The selling price is 110% of the cost price, so the cost price = ₦6,600 ÷ 1.1 = ₦6,000. (₦5,940 takes 10% off ₦6,600, which is wrong.)` }
    ], 2)
  },

  /* ───────────── BINARY OPERATIONS ───────────── */
  {
    id: 'binop', name: 'Binary Operations', sec: 'Section II · Algebra', boss: 'The Operator',
    goals: ['Evaluate a binary operation from its rule or its table', 'Test for closure, commutativity and associativity', 'Find the identity element and the inverse of an element'],
    parts: [
      {
        title: 'Working with a binary operation',
        idea: `A binary operation is a rule, written with a symbol such as * or ⊕, that combines two numbers into one. The question gives you the rule, so read it carefully and substitute.`,
        rules: [
          `If a * b = a + b − ab, then 2 * 3 = 2 + 3 − 6 = −1. Put the first number in for a and the second for b.`,
          `Closure: the operation is closed if a * b always lands back in the set. Odd numbers are closed under ×, but not under +.`,
          `Commutative: a * b = b * a for every a and b. In a table, the entries are symmetric about the leading diagonal.`,
          `Associative: (a * b) * c = a * (b * c) for every a, b and c.`
        ],
        ex: {
          q: `a * b = 2a + b. Find (3 * 1) * 2.`,
          steps: [
            [`3 * 1 = 2(3) + 1 = 7`, `Always work out the bracket first.`],
            [`7 * 2 = 2(7) + 2`, `Now 7 is the first number.`],
            [`= 16`, `So (3 * 1) * 2 = 16.`]
          ]
        },
        tryit: {
          q: `a ⊕ b = a² − b. Find 3 ⊕ 4.`,
          given: [`a = 3 and b = 4`, `3 ⊕ 4 = 3² − 4`],
          ask: `= ?`, o: ['5', '−7', '13', '2'], a: 0,
          h: `Work out 9 − 4.`, e: `9 − 4 = 5. (−7 comes from swapping a and b.)`
        }
      },
      {
        title: 'Identity and inverse',
        idea: `The identity element e leaves every element unchanged, like 0 for addition and 1 for multiplication. The inverse of an element combines with it to give the identity.`,
        g: MOD5,
        cap: `Multiplication modulo 5 on {1, 2, 3, 4}: multiply, then keep the remainder after dividing by 5. The row for 1 copies the top row, so 1 is the identity.`,
        rules: [
          `Identity e: a * e = a for every a. Solve a * e = a for e.`,
          `Inverse of a, written a<sup>−1</sup>: a * a<sup>−1</sup> = e. Solve a * x = e for x.`,
          `In a table, the identity's row repeats the top row. To find the inverse of a, look along the row of a for e.`
        ],
        ex: {
          q: `a * b = a + b + 3 on the real numbers. Find the identity element.`,
          steps: [
            [`a * e = a`, `This is what the identity must do.`],
            [`a + e + 3 = a`, `Use the rule with b = e.`],
            [`e = −3`, `Check: a * (−3) = a − 3 + 3 = a.`]
          ]
        },
        tryit: {
          q: `Using the table, find the inverse of 2.`,
          g: MOD5,
          given: [`The identity is 1`, `In the row for 2, the 1 is in the column headed 3`],
          ask: `So 2<sup>−1</sup> = ?`, o: ['3', '2', '4', '1'], a: 0,
          h: `2 ⊗ 3 gives 1, the identity.`, e: `2 × 3 = 6, which leaves remainder 1 after dividing by 5. So 2 ⊗ 3 = 1 and the inverse of 2 is 3.`
        }
      }
    ],
    trap: `Order matters unless the operation is commutative. With a * b = 2a + b, 3 * 1 = 7 but 1 * 3 = 5.`,
    qs: mix([
      { l: 1, q: `a * b = a + 2b. Find 4 * 3.`, o: ['10', '11', '7', '14'], a: 0, e: `4 * 3 = 4 + 2(3) = 10. (11 comes from swapping the numbers.)` },
      { l: 1, q: `a * b = ab − a. Find 5 * 2.`, o: ['5', '8', '10', '3'], a: 0, e: `5 * 2 = 5 × 2 − 5 = 10 − 5 = 5.` },
      { l: 2, dx: 1, q: `a ∘ b = ${fr('a + b', 2)}. Find 6 ∘ 10.`, o: ['8', '16', '4', '30'], a: 0, e: `6 ∘ 10 = ${fr('6 + 10', 2)} = ${fr(16, 2)} = 8.` },
      { l: 2, q: `The table shows the operation * on {p, q, r}. Find (q * r) * q.`, g: ['table', { head: ['*', 'p', 'q', 'r'], rows: [['p', 'p', 'q', 'r'], ['q', 'q', 'r', 'p'], ['r', 'r', 'p', 'q']], label: 'Table for the operation * on {p, q, r}. Row p: p, q, r. Row q: q, r, p. Row r: r, p, q' }], o: ['q', 'p', 'r', 'pq'], a: 0, e: `Read q * r in row q, column r: it is p. Then p * q, in row p, column q, is q.` },
      { l: 2, q: `Which of these sets is closed under addition?`, o: ['The even numbers', 'The odd numbers', '{1, 2, 3}', '{−1, 1}'], a: 0, e: `Any even number plus any even number is even, so the even numbers are closed. The odd numbers are not: 1 + 3 = 4. In {1, 2, 3}, 2 + 3 = 5 is not in the set.` },
      { l: 3, dx: 1, q: `a * b = a + b − 4 on the real numbers. Find the identity element.`, o: ['4', '−4', '0', '1'], a: 0, e: `a * e = a gives a + e − 4 = a, so e = 4. Check: a * 4 = a + 4 − 4 = a.` },
      { l: 3, q: `The operation a * b = a + b − 4 has identity element 4. Find the inverse of 6.`, o: ['2', '−2', '10', '4'], a: 0, e: `6 * x = 4 gives 6 + x − 4 = 4, so x = 2. Check: 6 * 2 = 6 + 2 − 4 = 4.` },
      { l: 3, q: `Which of these operations is commutative?`, o: ['a * b = a + b + ab', 'a * b = a − b', 'a * b = 2a + b', 'a * b = a²b'], a: 0, e: `Swapping a and b in a + b + ab gives b + a + ba, which is the same. The others change: 1 − 2 ≠ 2 − 1, for example.` },
      { l: 4, q: `Using the table for ⊗ on {1, 2, 3, 4}, find the inverse of 4.`, g: MOD5, o: ['4', '1', '2', '3'], a: 0, e: `The identity is 1. In the row for 4, the 1 is in the column headed 4. So 4 ⊗ 4 = 1 and 4 is its own inverse (4 × 4 = 16, which leaves 1 after dividing by 5).` },
      { l: 4, q: `a * b = ab + a + b on the real numbers. Find the identity element.`, o: ['0', '1', '−1', '2'], a: 0, e: `a * e = a gives ae + a + e = a, so ae + e = 0 and e(a + 1) = 0. This must hold for every a, so e = 0.` },
      { l: 5, q: `a * b = ${fr('ab', 2)} on the non-zero real numbers. Find the inverse of 4.`, o: ['1', '2', fr(1, 4), '4'], a: 0, e: `First the identity: ${fr('ae', 2)} = a gives e = 2. Then the inverse of 4: ${fr('4x', 2)} = 2 gives 2x = 2, so x = 1.` },
      { l: 5, q: `a * b = a + b − ab. Find (2 * 3) * 4.`, o: ['7', '−5', '1', '−7'], a: 0, e: `2 * 3 = 2 + 3 − 6 = −1. Then (−1) * 4 = −1 + 4 − (−1)(4) = 3 + 4 = 7.` }
    ], 3)
  },

  /* ───────────── LOCI ───────────── */
  {
    id: 'loci', name: 'Loci', sec: 'Section III · Geometry and Trigonometry', boss: 'The Wanderer',
    goals: ['Recognise the four basic loci', 'Describe a locus in words and on a diagram', 'Find the equation of a simple locus on the coordinate plane'],
    parts: [
      {
        title: 'The four basic loci',
        idea: `A locus is the path traced by a point that obeys a rule. Each rule that exams use gives one of four shapes.`,
        g: ['locus', { kind: 'circle', r: '3 cm', label: 'Points 3 cm from O, all lying on a dashed circle with centre O and radius 3 cm' }],
        cap: `Every point 3 cm from O lies on a circle with centre O and radius 3 cm. The circle is the locus.`,
        rules: [
          `A fixed distance from a point: a circle with that point as centre.`,
          `Equidistant from two points A and B: the perpendicular bisector of AB.`,
          `Equidistant from two lines that cross: the lines bisecting the angles between them.`,
          `A fixed distance from a straight line: a pair of lines parallel to it, one on each side.`
        ],
        ex: {
          q: `What is the locus of points equidistant from two fixed points A and B?`,
          g: ['locus', { kind: 'perp', label: 'Points A and B joined by a line. A dashed line crosses AB at its midpoint at a right angle. A point X on the dashed line is joined to A and to B by equal dotted lines' }],
          steps: [
            [`Take any point X with XA = XB`, `Mark a few such points.`],
            [`They all lie on one straight line through the midpoint of AB`, `That line crosses AB at a right angle.`],
            [`The locus is the perpendicular bisector of AB`, `It cuts AB in half at 90°.`]
          ]
        },
        tryit: {
          q: `What is the locus of points 2 cm from a straight line l?`,
          g: ['locus', { kind: 'parallel', d: '2 cm', label: 'A straight line l with a dashed line 2 cm above it and another dashed line 2 cm below it' }],
          given: [`The points can be 2 cm above l or 2 cm below it`, `Each set of points forms a straight line`],
          ask: `So the locus is ?`, o: ['Two lines parallel to l, each 2 cm from it', 'A circle of radius 2 cm', 'One line parallel to l', 'The perpendicular bisector of l'], a: 0,
          h: `There are points on both sides of l.`, e: `The locus is two lines parallel to l, one on each side, each 2 cm away.`
        }
      },
      {
        title: 'Loci on the coordinate plane',
        idea: `On a graph, a locus becomes an equation. Write the rule using the coordinates (x, y) of a moving point, then simplify.`,
        g: ['grid', { ax: [-4, 4, -4, 4], circles: [[0, 0, 3]], pts: [[0, 0, 'O', -10, -10], [3, 0, '(3, 0)', 8, -10]], label: 'A dashed circle of radius 3 centred on the origin O, passing through (3, 0)' }],
        cap: `Every point on the dashed circle is 3 units from O, so the locus is x² + y² = 9.`,
        rules: [
          `r units from the origin: x² + y² = r².`,
          `r units from the point (a, b): (x − a)² + (y − b)² = r².`,
          `Equidistant from two points: write the two distances squared, set them equal, then simplify.`,
          `k units from the x-axis: y = k or y = −k.`
        ],
        ex: {
          q: `Find the equation of the locus of points equidistant from A(0, 0) and B(4, 0).`,
          g: ['grid', { ax: [-1, 5, -2, 3], pts: [[0, 0, 'A', -10, -10], [4, 0, 'B', 10, -10]], segs: [[2, -2, 2, 3, 1]], label: 'Points A(0, 0) and B(4, 0) with a dashed vertical line through x = 2' }],
          steps: [
            [`x² + y² = (x − 4)² + y²`, `The squared distances to A and to B are equal.`],
            [`x² = x² − 8x + 16`, `The y² terms cancel. Then expand (x − 4)².`],
            [`8x = 16, so x = 2`, `The locus is the vertical line x = 2, the perpendicular bisector of AB.`]
          ]
        },
        tryit: {
          q: `Find the equation of the locus of points 4 units from the origin.`,
          given: [`A point (x, y) that is 4 units from O satisfies x² + y² = r²`, `Here r = 4`],
          ask: `= ?`, o: ['x² + y² = 16', 'x² + y² = 4', 'x + y = 4', 'x² + y² = 8'], a: 0,
          h: `Square 4.`, e: `x² + y² = 16. (x² + y² = 4 is the circle of radius 2.)`
        }
      }
    ],
    trap: `Equidistant from two points gives a perpendicular bisector. Equidistant from two lines gives angle bisectors. Check whether the question says points or lines.`,
    qs: mix([
      { l: 1, q: `The locus of points 5 cm from a fixed point O is`, o: ['a circle with centre O and radius 5 cm', 'a straight line through O', 'two parallel lines 5 cm apart', 'a circle with diameter 5 cm'], a: 0, e: `All the points 5 cm from O lie on a circle with centre O and radius 5 cm.` },
      { l: 1, q: `The locus of points equidistant from two fixed points A and B is`, o: ['the perpendicular bisector of AB', 'the line AB', 'a circle through A and B', 'the bisector of angle A'], a: 0, e: `Points the same distance from A and from B lie on the line that cuts AB in half at a right angle.` },
      { l: 2, dx: 1, q: `The locus of points equidistant from two straight lines that cross each other is`, o: ['the pair of lines bisecting the angles between them', 'a circle', 'a line parallel to one of them', 'the perpendicular bisector of one line'], a: 0, e: `A point the same distance from both lines lies on a line that splits an angle between them in half. Two lines that cross make two pairs of angles, so there are two bisectors.` },
      { l: 2, q: `The dashed line in the diagram is the locus of points that are`, g: ['locus', { kind: 'angle', label: 'Two lines VA and VB meeting at V, with a dashed line splitting the angle between them into two equal angles' }], o: ['equidistant from the lines VA and VB', 'a fixed distance from V', 'parallel to VA', 'a fixed distance from the line VB'], a: 0, e: `The dashed line splits angle AVB into two equal parts. Every point on an angle bisector is the same distance from the two arms of the angle.` },
      { l: 2, q: `A goat is tied to a post with a rope 4 m long. What shape is the region it can graze?`, o: ['A circle of radius 4 m and everything inside it', 'A circle of radius 2 m', 'A square of side 4 m', 'A straight line 4 m long'], a: 0, e: `The goat can reach any point up to 4 m from the post, so it can graze the whole circular region of radius 4 m.` },
      { l: 3, dx: 1, q: `Find the equation of the locus of points 3 units from the origin.`, o: ['x² + y² = 9', 'x² + y² = 3', 'x + y = 3', 'x² + y² = 6'], a: 0, e: `A point (x, y) that is 3 units from O satisfies x² + y² = 3² = 9.` },
      { l: 3, q: `Find the equation of the locus of points equidistant from (0, 0) and (6, 0).`, o: ['x = 3', 'y = 3', 'x = 6', 'x + y = 3'], a: 0, e: `x² + y² = (x − 6)² + y² gives 0 = −12x + 36, so x = 3. It is the vertical line halfway between the two points.` },
      { l: 3, q: `Find the equation of the locus of points 2 units from the x-axis.`, o: ['y = 2 or y = −2', 'x = 2 or x = −2', 'y = 2 only', 'x² + y² = 4'], a: 0, e: `A point 2 units from the x-axis is either 2 units above it (y = 2) or 2 units below it (y = −2).` },
      { l: 4, q: `Find the equation of the locus of points equidistant from (0, 0) and (0, 8).`, o: ['y = 4', 'x = 4', 'y = 8', 'x + y = 4'], a: 0, e: `x² + y² = x² + (y − 8)² gives 0 = −16y + 64, so y = 4. It is the horizontal line halfway between the points.` },
      { l: 4, q: `A point P moves so that its distance from (2, 1) is always 5. Find the equation of its locus.`, o: ['(x − 2)² + (y − 1)² = 25', '(x + 2)² + (y + 1)² = 25', '(x − 2)² + (y − 1)² = 5', 'x² + y² = 25'], a: 0, e: `The locus is a circle with centre (2, 1) and radius 5: (x − 2)² + (y − 1)² = 5² = 25.` },
      { l: 5, q: `Find the equation of the locus of points equidistant from A(1, 1) and B(3, 3).`, o: ['x + y = 4', 'x − y = 0', 'x + y = 2', 'y = x + 4'], a: 0, e: `(x − 1)² + (y − 1)² = (x − 3)² + (y − 3)². Expanding and cancelling x² and y² gives −2x − 2y + 2 = −6x − 6y + 18, so 4x + 4y = 16 and x + y = 4. (x − y = 0 is the line AB itself.)` },
      { l: 5, q: `P is a point inside triangle ABC that is equidistant from all three sides. P lies on`, o: ['the bisectors of the three angles of the triangle', 'the perpendicular bisectors of the three sides', 'the three medians', 'the three altitudes'], a: 0, e: `Equidistant from two sides puts P on the bisector of the angle between them. Equidistant from all three sides puts it on all three angle bisectors, where they meet. (The perpendicular bisectors meet at the point equidistant from the three corners.)` }
    ], 1)
  },

  /* ───────────── MEASURES OF DISPERSION ───────────── */
  {
    id: 'disp', name: 'Measures of Dispersion', sec: 'Section V · Statistics', boss: 'The Spread Spectre',
    goals: ['Find the range and the mean deviation of a set of data', 'Find the variance and the standard deviation', 'Work out spread from a frequency table'],
    parts: [
      {
        title: 'Range and mean deviation',
        idea: `Two classes can have the same average mark but very different spreads. Measures of dispersion tell you how far the data spreads out from the middle.`,
        rules: [
          `Range = highest value − lowest value.`,
          `Mean deviation = ${fr(`Σ|x − ${XBAR}|`, 'n')}: the average distance of the values from the mean, ignoring signs.`,
          `|x − ${XBAR}| means the size of the difference, which is never negative. For example, |3 − 5| = 2.`
        ],
        ex: {
          q: `Find the mean deviation of 2, 4, 6, 8, 10.`,
          g: ['table', { head: ['x', '2', '4', '6', '8', '10'], rows: [[`x − ${XBAR}`, '−4', '−2', '0', '2', '4'], [`|x − ${XBAR}|`, '4', '2', '0', '2', '4']], label: 'Table of deviations from the mean 6. Values 2, 4, 6, 8, 10. Deviations −4, −2, 0, 2, 4. Distances 4, 2, 0, 2, 4' }],
          steps: [
            [`${XBAR} = ${fr(30, 5)} = 6`, `Find the mean first.`],
            [`Σ|x − ${XBAR}| = 4 + 2 + 0 + 2 + 4 = 12`, `Add the distances from the mean, ignoring signs.`],
            [`Mean deviation = ${fr(12, 5)} = 2.4`, `Divide by the number of values.`]
          ]
        },
        tryit: {
          q: `Find the range of 12, 5, 19, 8, 11.`,
          given: [`Highest value = 19`, `Lowest value = 5`],
          ask: `Range = ?`, o: ['14', '19', '11', '24'], a: 0,
          h: `Work out 19 − 5.`, e: `19 − 5 = 14.`
        }
      },
      {
        title: 'Variance and standard deviation',
        idea: `The standard deviation is the most used measure of spread. It squares the deviations instead of ignoring their signs, then takes a square root at the end so the answer is back in the original units.`,
        rules: [
          `Variance = ${fr(`Σ(x − ${XBAR})²`, 'n')}.`,
          `Standard deviation = √variance.`,
          `From a frequency table: variance = ${fr(`Σf(x − ${XBAR})²`, 'Σf')}.`,
          `A bigger standard deviation means the data is more spread out.`
        ],
        ex: {
          q: `Find the standard deviation of 2, 4, 6, 8, 10.`,
          steps: [
            [`${XBAR} = 6, so the deviations are −4, −2, 0, 2, 4`, `Subtract the mean from each value.`],
            [`Σ(x − ${XBAR})² = 16 + 4 + 0 + 4 + 16 = 40`, `Square each deviation, then add.`],
            [`Variance = ${fr(40, 5)} = 8, so standard deviation = √8 = 2√2 ≈ 2.83`, `Take the square root of the variance.`]
          ]
        },
        tryit: {
          q: `The variance of a set of data is 25. Find the standard deviation.`,
          given: [`Standard deviation = √variance`, `= √25`],
          ask: `= ?`, o: ['5', '25', '12.5', '625'], a: 0,
          h: `What number times itself gives 25?`, e: `√25 = 5.`
        }
      }
    ],
    trap: `The standard deviation is the square root of the variance. Exams often list the variance as an option, so finish the last step.`,
    qs: mix([
      { l: 1, q: `Find the range of 7, 3, 12, 9, 4.`, o: ['9', '12', '7', '5'], a: 0, e: `Range = 12 − 3 = 9.` },
      { l: 1, q: `The variance of a set of numbers is 16. Find the standard deviation.`, o: ['4', '8', '16', '256'], a: 0, e: `Standard deviation = √16 = 4.` },
      { l: 2, dx: 1, q: `Find the mean deviation of 1, 3, 5, 7, 9.`, o: ['2.4', '5', '12', '3'], a: 0, e: `The mean is 5. The distances from it are 4, 2, 0, 2 and 4, which add up to 12. Mean deviation = 12 ÷ 5 = 2.4.` },
      { l: 2, q: `Find the variance of 1, 3 and 5.`, o: [fr(8, 3), '8', '3', fr(4, 3)], a: 0, e: `The mean is 3. The squared deviations are 4, 0 and 4, which add up to 8. Variance = ${fr(8, 3)}.` },
      { l: 2, q: `Which set of data is the most spread out?`, o: ['2, 10, 18', '8, 10, 12', '9, 10, 11', '10, 10, 10'], a: 0, e: `All four sets have mean 10. The values in 2, 10, 18 are furthest from 10, so it has the biggest spread.` },
      { l: 3, dx: 1, q: `Find the standard deviation of 2, 4, 4, 4, 5, 5, 7, 9.`, o: ['2', '4', '5', '32'], a: 0, e: `The mean is 40 ÷ 8 = 5. The squared deviations are 9, 1, 1, 1, 0, 0, 4 and 16, which add up to 32. Variance = 32 ÷ 8 = 4, so the standard deviation is √4 = 2. (4 is the variance.)` },
      { l: 3, q: `Find the mean deviation of 4, 6, 8, 10, 12, 14.`, o: ['3', '9', '18', '4'], a: 0, e: `The mean is 54 ÷ 6 = 9. The distances from 9 are 5, 3, 1, 1, 3 and 5, which add up to 18. Mean deviation = 18 ÷ 6 = 3.` },
      { l: 3, q: `The table shows the scores of 10 students. Find the range of the scores.`, g: ['ftable', { x: [3, 4, 5, 6, 7], f: [1, 2, 4, 2, 1], label: 'Frequency table: scores 3, 4, 5, 6, 7 with frequencies 1, 2, 4, 2, 1' }], o: ['4', '3', '10', '7'], a: 0, e: `The range uses the scores x, not the frequencies: 7 − 3 = 4. (3 is the range of the frequencies.)` },
      { l: 4, q: `Find the variance of the distribution in the table.`, g: ['ftable', { x: [1, 2, 3], f: [2, 1, 2], label: 'Frequency table: x = 1, 2, 3 with frequencies 2, 1, 2' }], o: ['0.8', '2', '4', '0.4'], a: 0, e: `Σf = 5 and Σfx = 2 + 2 + 6 = 10, so the mean is 2. Σf(x − ${XBAR})² = 2(1) + 1(0) + 2(1) = 4. Variance = 4 ÷ 5 = 0.8.` },
      { l: 4, q: `Find the standard deviation of 3, 3, 3, 3.`, o: ['0', '3', '1', '12'], a: 0, e: `Every value equals the mean, 3, so every deviation is 0. There is no spread at all, so the standard deviation is 0.` },
      { l: 5, q: `Each number in a set of data is increased by 5. What happens to the standard deviation?`, o: ['It stays the same', 'It increases by 5', 'It is multiplied by 5', 'It increases by 25'], a: 0, e: `Adding 5 to every value also adds 5 to the mean, so every deviation x − ${XBAR} stays the same. The spread does not change.` },
      { l: 5, q: `The mean of 6, 8, x and 12 is 9. Find the variance of the four numbers.`, o: ['5', '20', '√5', '9'], a: 0, e: `The total is 4 × 9 = 36, so x = 36 − 26 = 10. The deviations are −3, −1, 1 and 3, so the squared deviations add up to 9 + 1 + 1 + 9 = 20. Variance = 20 ÷ 4 = 5.` }
    ], 0)
  }
);

/* Road to Campus content, gap-fill: the parts of the JAMB 2027 Mathematics syllabus that sit inside topics we already had.
   Each addition is a new lesson part plus new questions, appended to the topic so existing question IDs stay the same. */
function addTo(id, add, seed) {
  const t = CONTENT.topics.find(x => x.id === id);
  t.goals = t.goals.concat(add.goals || []);
  t.parts = t.parts.concat(add.parts);
  t.qs = t.qs.concat(mix(add.qs, seed));
}
const LIMTAB = ['table', { head: ['x', '2.9', '2.99', '3.01', '3.1'], rows: [[fr('x² − 9', 'x − 3'), '5.9', '5.99', '6.01', '6.1']], label: 'Table of values of (x² − 9) ÷ (x − 3) near x = 3: at 2.9 it is 5.9, at 2.99 it is 5.99, at 3.01 it is 6.01 and at 3.1 it is 6.1' }];
const HIST30 = ['hist', { edges: [10, 20, 30, 40, 50, 60], f: [3, 7, 12, 6, 2], xl: 'Marks', label: 'Histogram of the marks of 30 students: 10 to 20, 3 students; 20 to 30, 7; 30 to 40, 12; 40 to 50, 6; 50 to 60, 2' }];
const OGIVE40 = ['ogive', { x0: 0, ub: [10, 20, 30, 40, 50], cf: [4, 12, 26, 36, 40], read: 20, xl: 'Marks', label: 'Ogive for the marks of 40 students. Cumulative frequencies 4, 12, 26, 36 and 40 at upper boundaries 10, 20, 30, 40 and 50. A dashed line reads across from 20 to the curve and down to the marks axis at about 26' }];

/* ── Number Bases: modular arithmetic ── */
addTo('bases', {
  goals: ['Work in modular (clock) arithmetic'],
  parts: [{
    title: 'Modular arithmetic',
    idea: `Modular arithmetic is clock arithmetic. In modulo 7 you count 0, 1, 2, …, 6 and then start again at 0, just like the days of the week.`,
    g: ['clock', { n: 7, hi: [3], label: 'A clock with the numbers 0 to 6. The number 3 is highlighted' }],
    cap: `In modulo 7, 10 lands on 3, because 10 = 7 + 3. We write 10 ≡ 3 (mod 7).`,
    rules: [
      `a (mod n) is the remainder when a is divided by n. 23 (mod 5) = 3, because 23 = 4 × 5 + 3.`,
      `Add, subtract or multiply as usual, then take the remainder.`,
      `For a negative number, add n until you reach a number from 0 to n − 1: −2 ≡ 5 (mod 7).`,
      `To solve an equation such as 3x ≡ 2 (mod 5), try each value from 0 to 4.`
    ],
    ex: {
      q: `Evaluate (8 × 6) (mod 5).`,
      steps: [
        [`8 × 6 = 48`, `Multiply as usual first.`],
        [`48 = 9 × 5 + 3`, `Divide by 5 and keep the remainder.`],
        [`So 8 × 6 ≡ 3 (mod 5)`, `The answer is the remainder, 3.`]
      ]
    },
    tryit: {
      q: `Today is Tuesday. What day will it be in 30 days?`,
      given: [`There are 7 days in a week, so work in modulo 7`, `30 = 4 × 7 + 2, so 30 ≡ 2 (mod 7)`],
      ask: `So it will be ?`, o: ['Thursday', 'Wednesday', 'Tuesday', 'Friday'], a: 0,
      h: `Count 2 days on from Tuesday.`, e: `30 days is 4 full weeks and 2 more days. Two days after Tuesday is Thursday.`
    }
  }],
  qs: [
    { l: 2, q: `Evaluate 27 (mod 6).`, o: ['3', '4', '5', '21'], a: 0, e: `27 = 4 × 6 + 3, so the remainder is 3.` },
    { l: 3, q: `Evaluate (13 + 9) (mod 5).`, o: ['2', '4', '3', '22'], a: 0, e: `13 + 9 = 22, and 22 = 4 × 5 + 2. So the answer is 2.` },
    { l: 4, q: `Find x if 3x ≡ 2 (mod 5).`, o: ['4', '3', '2', '1'], a: 0, e: `Try x = 0 to 4: 3 × 4 = 12, and 12 ≡ 2 (mod 5). So x = 4.` },
    { l: 5, q: `Find the remainder when 2<sup>10</sup> is divided by 3.`, o: ['1', '2', '0', '3'], a: 0, e: `2 ≡ −1 (mod 3), so 2<sup>10</sup> ≡ (−1)<sup>10</sup> = 1. Check: 2<sup>10</sup> = 1024 = 341 × 3 + 1.` }
  ]
}, 1);

/* ── Indices and Logarithms: standard form and change of base ── */
addTo('indices', {
  goals: ['Write numbers in standard form and change the base of a logarithm'],
  parts: [{
    title: 'Standard form and change of base',
    idea: `Standard form writes very large or very small numbers as A × 10<sup>n</sup>, where A is at least 1 and less than 10. Change of base lets you rewrite a logarithm in a base you can work with.`,
    rules: [
      `Standard form: A × 10<sup>n</sup> with 1 ≤ A &lt; 10. So 45 000 = 4.5 × 10<sup>4</sup> and 0.0032 = 3.2 × 10<sup>−3</sup>.`,
      `Count how many places the decimal point moves. Moving it left gives a positive power. Moving it right gives a negative power.`,
      `Change of base: log<sub>a</sub> x = ${fr('log<sub>b</sub> x', 'log<sub>b</sub> a')}.`,
      `A useful special case: log<sub>a</sub> b × log<sub>b</sub> a = 1.`
    ],
    ex: {
      q: `Evaluate log<sub>8</sub> 32.`,
      steps: [
        [`log<sub>8</sub> 32 = ${fr('log<sub>2</sub> 32', 'log<sub>2</sub> 8')}`, `Change to base 2, because 8 and 32 are both powers of 2.`],
        [`= ${fr(5, 3)}`, `log<sub>2</sub> 32 = 5 and log<sub>2</sub> 8 = 3.`],
        [`So log<sub>8</sub> 32 = ${fr(5, 3)}`, `Check: 8<sup>5/3</sup> = 2<sup>5</sup> = 32.`]
      ]
    },
    tryit: {
      q: `Write 0.000507 in standard form.`,
      given: [`Move the decimal point right until the number is between 1 and 10: 5.07`, `The point moved 4 places to the right`],
      ask: `So ?`, o: ['5.07 × 10<sup>−4</sup>', '5.07 × 10<sup>4</sup>', '50.7 × 10<sup>−5</sup>', '5.07 × 10<sup>−3</sup>'], a: 0,
      h: `Moving the point to the right gives a negative power.`, e: `0.000507 = 5.07 × 10<sup>−4</sup>. (50.7 × 10<sup>−5</sup> has the same value, but 50.7 is not less than 10.)`
    }
  }],
  qs: [
    { l: 2, q: `Express 63 400 in standard form.`, o: ['6.34 × 10<sup>4</sup>', '63.4 × 10<sup>3</sup>', '6.34 × 10<sup>3</sup>', '6.34 × 10<sup>5</sup>'], a: 0, e: `Move the point 4 places left to get 6.34, so 63 400 = 6.34 × 10<sup>4</sup>.` },
    { l: 3, q: `Evaluate (3 × 10<sup>5</sup>) × (4 × 10<sup>−2</sup>), giving your answer in standard form.`, o: ['1.2 × 10<sup>4</sup>', '12 × 10<sup>3</sup>', '1.2 × 10<sup>3</sup>', '7 × 10<sup>3</sup>'], a: 0, e: `3 × 4 = 12 and 10<sup>5</sup> × 10<sup>−2</sup> = 10³, giving 12 × 10³. In standard form that is 1.2 × 10<sup>4</sup>.` },
    { l: 4, q: `Evaluate log<sub>9</sub> 27.`, o: [fr(3, 2), '3', fr(2, 3), '2'], a: 0, e: `Change to base 3: ${fr('log<sub>3</sub> 27', 'log<sub>3</sub> 9')} = ${fr(3, 2)}. Check: 9<sup>3/2</sup> = 3³ = 27.` },
    { l: 5, q: `If log<sub>3</sub> x = log<sub>9</sub> 16, find x.`, o: ['4', '16', '8', '2'], a: 0, e: `log<sub>9</sub> 16 = ${fr('log<sub>3</sub> 16', 'log<sub>3</sub> 9')} = ${fr('log<sub>3</sub> 16', 2)} = log<sub>3</sub> 16<sup>1/2</sup> = log<sub>3</sub> 4. So x = 4.` }
  ]
}, 2);

/* ── Polynomials: change of subject ── */
addTo('poly', {
  goals: ['Change the subject of a formula'],
  parts: [{
    title: 'Changing the subject of a formula',
    idea: `Changing the subject means rearranging a formula so that a different letter stands alone on one side. You undo what has been done to that letter, in reverse order, doing the same thing to both sides.`,
    rules: [
      `Undo adding by subtracting, multiplying by dividing, and squaring by taking the square root.`,
      `Undo the operations in the reverse order to how they were done to the letter.`,
      `If the new subject appears twice, collect those terms on one side and factorise.`
    ],
    ex: {
      q: `Make r the subject of V = πr²h.`,
      steps: [
        [`${fr('V', 'πh')} = r²`, `Divide both sides by πh.`],
        [`r = √(${fr('V', 'πh')})`, `Take the square root of both sides.`],
        [`So r = √(${fr('V', 'πh')})`, `r now stands alone on one side.`]
      ]
    },
    tryit: {
      q: `Make x the subject of y = 3x − 5.`,
      given: [`Add 5 to both sides: y + 5 = 3x`, `Divide both sides by 3`],
      ask: `x = ?`, o: [fr('y + 5', 3), fr('y − 5', 3), '3y + 5', `${fr('y', 3)} + 5`], a: 0,
      h: `Everything on the left is divided by 3.`, e: `x = ${fr('y + 5', 3)}. Check with x = 2: y = 1, and ${fr('1 + 5', 3)} = 2.`
    }
  }],
  qs: [
    { l: 2, q: `Make t the subject of v = u + at.`, o: [fr('v − u', 'a'), fr('v + u', 'a'), 'a(v − u)', `${fr('v', 'a')} − u`], a: 0, e: `Subtract u: v − u = at. Then divide by a: t = ${fr('v − u', 'a')}.` },
    { l: 3, q: `Make h the subject of A = ${fr(1, 2)}bh.`, o: [fr('2A', 'b'), fr('A', '2b'), fr('2b', 'A'), '2Ab'], a: 0, e: `Multiply both sides by 2: 2A = bh. Then divide by b: h = ${fr('2A', 'b')}.` },
    { l: 4, q: `Make x the subject of y = ${fr('x + 2', 'x − 1')}.`, o: [fr('y + 2', 'y − 1'), fr('y − 2', 'y + 1'), fr('y + 2', '1 − y'), fr('y − 1', 'y + 2')], a: 0, e: `Multiply by (x − 1): xy − y = x + 2. Collect the x terms: xy − x = y + 2, so x(y − 1) = y + 2 and x = ${fr('y + 2', 'y − 1')}.` },
    { l: 5, q: `Make l the subject of T = 2π√(${fr('l', 'g')}).`, o: [fr('gT²', '4π²'), fr('T²', '4π²g'), fr('4π²g', 'T²'), fr('gT', '2π')], a: 0, e: `Divide by 2π: ${fr('T', '2π')} = √(${fr('l', 'g')}). Square both sides: ${fr('T²', '4π²')} = ${fr('l', 'g')}. Multiply by g: l = ${fr('gT²', '4π²')}.` }
  ]
}, 3);

/* ── Variation: percentage increase and decrease ── */
addTo('variation', {
  goals: ['Solve percentage increase and decrease problems in variation'],
  parts: [{
    title: 'Percentage increase and decrease',
    idea: `Variation questions often ask about percentages: if x goes up by 20%, what happens to y? Turn each percentage into a multiplier, then use the variation equation.`,
    rules: [
      `An increase of p% multiplies by (1 + ${fr('p', 100)}). A 20% increase multiplies by 1.2.`,
      `A decrease of p% multiplies by (1 − ${fr('p', 100)}). A 20% decrease multiplies by 0.8.`,
      `Percentage change = ${fr('new − old', 'old')} × 100%.`,
      `For y ∝ x², the multiplier is squared: x × 1.1 gives y × 1.21, which is a 21% increase.`
    ],
    ex: {
      q: `y varies directly as x². If x is increased by 10%, find the percentage increase in y.`,
      steps: [
        [`New x = 1.1x`, `A 10% increase multiplies x by 1.1.`],
        [`New y = k(1.1x)² = 1.21kx² = 1.21y`, `Square the multiplier.`],
        [`So y increases by 21%`, `1.21 is 21% more than 1.`]
      ]
    },
    tryit: {
      q: `y varies inversely as x. If x is doubled, find the percentage decrease in y.`,
      given: [`New y = ${fr('k', '2x')} = ${fr(1, 2)} × ${fr('k', 'x')}`, `So y goes from y to 0.5y`],
      ask: `The decrease is ?`, o: ['50%', '100%', '200%', '25%'], a: 0,
      h: `y loses half of its value.`, e: `y falls from 1 to 0.5 of its value, which is a 50% decrease.`
    }
  }],
  qs: [
    { l: 2, q: `A price of ₦4,000 is increased by 15%. Find the new price.`, o: ['₦4,600', '₦4,015', '₦600', '₦3,400'], a: 0, e: `15% of ₦4,000 is ₦600, so the new price is ₦4,600. (Or ₦4,000 × 1.15.)` },
    { l: 3, q: `y varies directly as x. If x increases by 25%, by what percentage does y increase?`, o: ['25%', '50%', '12.5%', '56.25%'], a: 0, e: `y = kx, so multiplying x by 1.25 multiplies y by 1.25. That is a 25% increase.` },
    { l: 4, q: `y varies inversely as x. If x is increased by 25%, find the percentage decrease in y.`, o: ['20%', '25%', '80%', '75%'], a: 0, e: `New y = ${fr('k', '1.25x')} = 0.8y. y falls to 80% of its value, which is a 20% decrease. (Not 25%: inverse variation does not reverse percentages exactly.)` },
    { l: 5, q: `The area of a circle varies as the square of its radius. If the radius is reduced by 10%, find the percentage decrease in the area.`, o: ['19%', '10%', '20%', '81%'], a: 0, e: `The radius is multiplied by 0.9, so the area is multiplied by 0.9² = 0.81. That is a 19% decrease. (81% is what is left, not the decrease.)` }
  ]
}, 0);

/* ── Angles, Triangles and Circles: intersecting chords and constructions ── */
addTo('geom', {
  goals: ['Use the intersecting chords rule, and know which angles can be constructed'],
  parts: [{
    title: 'Intersecting chords and constructions',
    idea: `When two chords of a circle cross, the two pieces of one chord multiply to give the same answer as the two pieces of the other. Exams also ask which angles you can construct with only a ruler and a pair of compasses.`,
    g: ['chords', { a: 'a', b: 'b', c: 'c', d: 'd', label: 'Chords AB and CD of a circle crossing at X. The pieces are AX = a, XB = b, CX = c and XD = d' }],
    cap: `When chords AB and CD cross at X, AX × XB = CX × XD. In the picture, a × b = c × d.`,
    rules: [
      `Intersecting chords: AX × XB = CX × XD.`,
      `With ruler and compasses you can construct 60° (from an equilateral triangle), then bisect it to get 30°, and again to get 15°.`,
      `Bisecting a straight angle gives 90°, and bisecting 90° gives 45°.`,
      `Other angles come from adding these: 75° = 60° + 15°, 105° = 90° + 15° and 135° = 90° + 45°.`
    ],
    ex: {
      q: `Chords AB and CD cross at X. AX = 6 cm, XB = 4 cm and CX = 3 cm. Find XD.`,
      g: ['chords', { a: '6', b: '4', c: '3', d: '?', label: 'Chords AB and CD crossing at X, with AX = 6, XB = 4, CX = 3 and XD unknown' }],
      steps: [
        [`AX × XB = CX × XD`, `The intersecting chords rule.`],
        [`6 × 4 = 3 × XD`, `Put in the lengths you know.`],
        [`24 = 3 × XD, so XD = 8 cm`, `Divide both sides by 3.`]
      ]
    },
    tryit: {
      q: `The diagram shows an angle being constructed with a ruler and a pair of compasses. Both arcs have the same radius. What is angle PVB?`,
      g: ['construct', { label: 'A line through V and B. An arc centred at V and an arc centred at B, with the same radius, cross at P. A line is drawn from V through P' }],
      given: [`Both arcs have the same radius, so VB = VP = BP`, `Triangle VBP is equilateral`],
      ask: `So angle PVB = ?`, o: ['60°', '45°', '90°', '30°'], a: 0,
      h: `Every angle in an equilateral triangle is the same.`, e: `All three sides are equal, so all three angles are equal, and 180° ÷ 3 = 60°.`
    }
  }],
  qs: [
    { l: 2, q: `Chords AB and CD cross at X. AX = 8 cm, XB = 3 cm and CX = 4 cm. Find XD.`, g: ['chords', { a: '8', b: '3', c: '4', d: '?', label: 'Chords AB and CD crossing at X, with AX = 8, XB = 3, CX = 4 and XD unknown' }], o: ['6 cm', '5 cm', '7 cm', '2 cm'], a: 0, e: `AX × XB = CX × XD, so 8 × 3 = 4 × XD. That gives 24 = 4 × XD and XD = 6 cm.` },
    { l: 3, q: `Which of these angles cannot be constructed using only a ruler and a pair of compasses?`, o: ['50°', '75°', '45°', '105°'], a: 0, e: `75° = 60° + 15°, 45° is half of 90°, and 105° = 90° + 15°. 50° cannot be made from 60°, 90° and their halves.` },
    { l: 4, q: `Two chords of a circle cross. One chord is cut into pieces of 9 cm and 4 cm. The other chord is cut into two equal pieces. Find the length of the second chord.`, o: ['12 cm', '6 cm', '13 cm', '18 cm'], a: 0, e: `Call each equal piece x. Then x × x = 9 × 4 = 36, so x = 6 cm. The whole chord is 6 + 6 = 12 cm. (6 cm is only one piece.)` },
    { l: 5, q: `An angle of 75° is constructed by adding two angles that can each be constructed with ruler and compasses. Which pair is it?`, o: ['60° and 15°', '50° and 25°', '70° and 5°', '40° and 35°'], a: 0, e: `60° comes from an equilateral triangle and 15° from bisecting 60° twice. The other pairs also add up to 75°, but none of their angles can be constructed.` }
  ]
}, 1);

/* ── Mensuration: segments and pyramids; the earth as a sphere ── */
addTo('mens', {
  goals: ['Find chords, areas of segments and volumes of pyramids', 'Find distances on the earth using latitude and longitude'],
  parts: [{
    title: 'Segments and pyramids',
    idea: `A segment is the part of a circle cut off by a chord, and its area is the sector minus the triangle. A pyramid rises from a flat base to a single point, and its volume is a third of a prism with the same base and height.`,
    g: ['segment', { deg: 90, r: '7 cm', label: 'Circle with centre O. Two radii of 7 cm make a right angle, and the chord joining their ends cuts off a shaded segment' }],
    cap: `The shaded segment is the sector minus the triangle formed by the two radii and the chord.`,
    rules: [
      `Area of a segment = area of sector − area of triangle = ${fr('θ', 360)} × πr² − ½r² sin θ.`,
      `Length of a chord with angle θ at the centre = 2r sin ${fr('θ', 2)}.`,
      `Volume of a pyramid = ${fr(1, 3)} × base area × height.`,
      `A cone is a pyramid with a round base, so its volume is ${fr(1, 3)}πr²h.`
    ],
    ex: {
      q: `Find the area of the shaded segment in the circle of radius 7 cm, where the angle at the centre is 90°. ${PI7}`,
      steps: [
        [`Sector = ${fr(90, 360)} × ${fr(22, 7)} × 7 × 7 = 38.5 cm²`, `A quarter of the circle.`],
        [`Triangle = ½ × 7 × 7 × sin 90° = 24.5 cm²`, `Use ½r² sin θ.`],
        [`Segment = 38.5 − 24.5 = 14 cm²`, `Sector minus triangle.`]
      ]
    },
    tryit: {
      q: `A pyramid has a square base of side 6 cm and a height of 10 cm. Find its volume.`,
      g: ['pyramid', { b: '6 cm', h: '10 cm', label: 'Square-based pyramid with base side 6 cm and height 10 cm' }],
      given: [`Base area = 6 × 6 = 36 cm²`, `Volume = ${fr(1, 3)} × 36 × 10`],
      ask: `= ?`, o: ['120 cm³', '360 cm³', '180 cm³', '60 cm³'], a: 0,
      h: `36 × 10 = 360. Then take a third.`, e: `${fr(360, 3)} = 120 cm³. (360 cm³ would be a cuboid with the same base and height.)`
    }
  }, {
    title: 'The earth as a sphere',
    idea: `Exam questions treat the earth as a sphere of radius R, usually about 6400 km. Circles of latitude run east to west, parallel to the equator. Lines of longitude run from the North Pole to the South Pole.`,
    g: ['earth', { lat: 40, small: 'R cos 40°', label: 'The earth as a sphere with centre O, the equator, and a smaller circle of latitude at 40 degrees north whose radius is R cos 40°' }],
    cap: `The circle of latitude 40°N has radius R cos 40°, so it is smaller than the equator.`,
    rules: [
      `Latitude is measured north or south of the equator. Longitude is measured east or west of the Greenwich meridian.`,
      `The radius of the circle of latitude θ is R cos θ.`,
      `Distance along a circle of latitude = ${fr('difference in longitude', 360)} × 2πR cos θ.`,
      `Distance along a line of longitude = ${fr('difference in latitude', 360)} × 2πR.`,
      `For places on opposite sides of the equator, or of Greenwich, add the angles. On the same side, subtract them.`
    ],
    ex: {
      q: `P (20°N, 10°E) and Q (40°N, 10°E) lie on the same line of longitude. Find the distance PQ. Take R = 6400 km and π = ${fr(22, 7)}.`,
      steps: [
        [`Difference in latitude = 40° − 20° = 20°`, `Both are north of the equator, so subtract.`],
        [`PQ = ${fr(20, 360)} × 2 × ${fr(22, 7)} × 6400`, `A line of longitude is part of a circle of radius R.`],
        [`≈ 2235 km`, `To the nearest kilometre.`]
      ]
    },
    tryit: {
      q: `Two towns are at 30°N and 15°S on the same line of longitude. Find the difference in their latitudes.`,
      given: [`One town is north of the equator and the other is south`, `Opposite sides of the equator, so add the angles`],
      ask: `= ?`, o: ['45°', '15°', '30°', '60°'], a: 0,
      h: `Work out 30° + 15°.`, e: `30° + 15° = 45°.`
    }
  }],
  qs: [
    { l: 2, q: `Find the volume of a pyramid with a rectangular base 8 cm by 5 cm and a height of 9 cm.`, o: ['120 cm³', '360 cm³', '40 cm³', '180 cm³'], a: 0, e: `Volume = ${fr(1, 3)} × (8 × 5) × 9 = ${fr(1, 3)} × 360 = 120 cm³.` },
    { l: 3, q: `A chord subtends an angle of 60° at the centre of a circle of radius 10 cm. Find the length of the chord.`, o: ['10 cm', '20 cm', '5 cm', '17.3 cm'], a: 0, e: `Chord = 2r sin 30° = 2 × 10 × ½ = 10 cm. The two radii and the chord make an equilateral triangle.` },
    { l: 4, q: `A chord subtends 90° at the centre of a circle of radius 14 cm. Find the area of the minor segment. ${PI7}`, g: ['segment', { deg: 90, r: '14 cm', label: 'Circle with two radii of 14 cm at a right angle, and the segment cut off by the chord shaded' }], o: ['56 cm²', '154 cm²', '98 cm²', '42 cm²'], a: 0, e: `Sector = ¼ × ${fr(22, 7)} × 14 × 14 = 154 cm². Triangle = ½ × 14 × 14 = 98 cm². Segment = 154 − 98 = 56 cm².` },
    { l: 5, q: `A cone and a cylinder have the same base radius and the same height. The volume of the cylinder is 540 cm³. Find the volume of the cone.`, o: ['180 cm³', '270 cm³', '540 cm³', '1620 cm³'], a: 0, e: `A cone is ${fr(1, 3)}πr²h and a cylinder is πr²h, so the cone is a third of the cylinder: 540 ÷ 3 = 180 cm³.` },
    { l: 2, q: `Two places are at 25°N and 35°S on the same line of longitude. Find the difference in their latitudes.`, o: ['60°', '10°', '35°', '25°'], a: 0, e: `They are on opposite sides of the equator, so add: 25° + 35° = 60°. (10° comes from subtracting.)` },
    { l: 3, q: `The radius of the earth is R. Find the radius of the circle of latitude 60°N.`, o: [fr('R', 2), 'R', fr('R√3', 2), '2R'], a: 0, e: `The radius is R cos 60° = R × ½ = ${fr('R', 2)}.` },
    { l: 4, q: `Two towns on the equator have longitudes 10°E and 50°E. Find the distance between them along the equator. Take R = 6300 km and π = ${fr(22, 7)}.`, o: ['4400 km', '8800 km', '2200 km', '44 000 km'], a: 0, e: `Difference in longitude = 40°. Distance = ${fr(40, 360)} × 2 × ${fr(22, 7)} × 6300 = ${fr(1, 9)} × 39 600 = 4400 km.` },
    { l: 5, q: `P (60°N, 20°W) and Q (60°N, 70°E) lie on the circle of latitude 60°N. Find the distance from P to Q along this circle. Take R = 6400 km and π = ${fr(22, 7)}.`, o: ['5029 km', '10 057 km', '2514 km', '3200 km'], a: 0, e: `They are on opposite sides of Greenwich, so the difference in longitude is 20° + 70° = 90°. The radius of the circle is 6400 cos 60° = 3200 km. Distance = ${fr(90, 360)} × 2 × ${fr(22, 7)} × 3200 ≈ 5029 km. (10 057 km wrongly uses the radius of the equator.)` }
  ]
}, 2);

/* ── Trigonometry: bearings; graphs of sine and cosine ── */
addTo('trig', {
  goals: ['Solve problems with bearings', 'Read the graphs of sine and cosine for angles from −360° to 360°'],
  parts: [{
    title: 'Bearings',
    idea: `A bearing gives a direction as an angle measured clockwise from north, written with three figures. East is 090°, south is 180° and west is 270°.`,
    g: ['bearing', { deg: 130, label: 'Point A with a north line. B lies on a line from A at 130 degrees, measured clockwise from north' }],
    cap: `The bearing of B from A is 130°: start facing north and turn clockwise through 130°.`,
    rules: [
      `Bearings are measured clockwise from north and written with three figures, such as 045° or 210°.`,
      `The back bearing (A from B) is the bearing of B from A plus or minus 180°.`,
      `Draw a north line at every point, then use angle facts or trigonometry.`,
      `If two journeys meet at a right angle, use Pythagoras for the distance between the start and the end.`
    ],
    ex: {
      q: `A man walks 6 km due east, then 8 km due north. How far is he from his starting point?`,
      steps: [
        [`East and north are at right angles`, `So the start, the turn and the end make a right-angled triangle.`],
        [`Distance² = 6² + 8² = 100`, `Use Pythagoras.`],
        [`Distance = 10 km`, `√100 = 10.`]
      ]
    },
    tryit: {
      q: `The bearing of B from A is 070°. Find the bearing of A from B.`,
      given: [`The back bearing is the bearing plus or minus 180°`, `070° + 180° = 250°`],
      ask: `= ?`, o: ['250°', '110°', '290°', '070°'], a: 0,
      h: `Turning round to face back adds 180°.`, e: `The bearing of A from B is 250°.`
    }
  }, {
    title: 'Graphs of sine and cosine',
    idea: `y = sin x and y = cos x are waves that repeat every 360°. Both stay between −1 and 1. The graphs show where each one is positive, negative, biggest and smallest.`,
    g: ['wave', { f: ['sin', 'cos'], keys: ['solid: sin x', 'dashed: cos x'], label: 'Graphs of y = sin x, solid, and y = cos x, dashed, for x from 0 to 360 degrees, between −1 and 1' }],
    cap: `y = sin x (solid) starts at 0 and peaks at 90°. y = cos x (dashed) starts at 1 and is lowest at 180°.`,
    rules: [
      `sin x is 0 at 0°, 1 at 90°, 0 at 180°, −1 at 270° and 0 at 360°.`,
      `cos x is 1 at 0°, 0 at 90°, −1 at 180°, 0 at 270° and 1 at 360°.`,
      `sin x = sin(180° − x) and cos x = cos(360° − x). Use these to find a second angle with the same value.`,
      `For negative angles, down to −360°: sin(−x) = −sin x and cos(−x) = cos x.`
    ],
    ex: {
      q: `Find all the values of x between 0° and 360° for which sin x = ½.`,
      g: ['wave', { f: ['sin'], marks: [[30, 0.5, '30°'], [150, 0.5, '150°']], label: 'Graph of y = sin x from 0 to 360 degrees with the points at 30 and 150 degrees, where sin x is one half, marked' }],
      steps: [
        [`sin 30° = ½`, `This gives the first answer.`],
        [`sin(180° − 30°) = sin 150° = ½`, `The sine wave is symmetric about 90°.`],
        [`x = 30° or 150°`, `The line y = ½ crosses the wave twice between 0° and 360°.`]
      ]
    },
    tryit: {
      q: `What is the greatest value of y = 3 sin x?`,
      given: [`The greatest value of sin x is 1`, `So the greatest value of 3 sin x is 3 × 1`],
      ask: `= ?`, o: ['3', '1', '90', '360'], a: 0,
      h: `Multiply the greatest value of sin x by 3.`, e: `3 × 1 = 3. It happens at x = 90°.`
    }
  }],
  qs: [
    { l: 2, q: `What is the bearing of a point that is due west of you?`, o: ['270°', '090°', '180°', '360°'], a: 0, e: `Turning clockwise from north: east is 090°, south is 180° and west is 270°.` },
    { l: 3, q: `A ship sails 5 km due north, then 12 km due east. How far is it from its starting point?`, o: ['13 km', '17 km', '7 km', '11 km'], a: 0, e: `North and east are at right angles, so distance² = 5² + 12² = 169 and the distance is 13 km. (17 km is the total distance sailed.)` },
    { l: 4, q: `The bearing of Q from P is 235°. Find the bearing of P from Q.`, o: ['055°', '125°', '325°', '145°'], a: 0, e: `235° is more than 180°, so subtract: 235° − 180° = 055°.` },
    { l: 5, q: `A town T is 10 km from a point P, on a bearing of 060°. How far east of P is T?`, g: ['bearing', { deg: 60, a: 'P', b: 'T', label: 'Point P with a north line, and T on a line from P at 60 degrees clockwise from north' }], o: ['5√3 km', '5 km', '10√3 km', '10 km'], a: 0, e: `The angle between PT and north is 60°. The distance east is the side opposite this angle: 10 sin 60° = 10 × ${fr('√3', 2)} = 5√3 km. (5 km is the distance north.)` },
    { l: 2, q: `What is the value of cos 180°?`, o: ['−1', '0', '1', fr(1, 2)], a: 0, e: `The cosine graph is at its lowest, −1, at 180°.` },
    { l: 3, q: `For which value of x between 0° and 360° is sin x smallest?`, o: ['270°', '180°', '90°', '360°'], a: 0, e: `The sine wave reaches its lowest value, −1, at 270°.` },
    { l: 4, q: `Find all the values of x between 0° and 360° for which cos x = ½.`, o: ['60° and 300°', '60° and 120°', '30° and 330°', '60° and 240°'], a: 0, e: `cos 60° = ½. Using cos x = cos(360° − x), the other answer is 360° − 60° = 300°.` },
    { l: 5, q: `Evaluate sin(−30°).`, o: [`−${fr(1, 2)}`, fr(1, 2), `−${fr('√3', 2)}`, fr('√3', 2)], a: 0, e: `sin(−x) = −sin x, so sin(−30°) = −sin 30° = −½.` }
  ]
}, 3);

/* ── Differentiation: limits ── */
addTo('diff', {
  goals: ['Find the limit of a function'],
  parts: [{
    title: 'Limits',
    idea: `A limit asks what value an expression gets closer and closer to as x gets closer to a number. Often you can just substitute. When substituting gives ${fr(0, 0)}, factorise and cancel first.`,
    g: LIMTAB,
    cap: `As x gets closer to 3 from either side, ${fr('x² − 9', 'x − 3')} gets closer to 6, even though it cannot be worked out at x = 3 itself.`,
    rules: [
      `If substituting gives a number, that number is the limit.`,
      `If it gives ${fr(0, 0)}, factorise the top and the bottom, cancel the common factor, then substitute.`,
      `As x gets very large, divide every term by the highest power of x on the bottom. Terms like ${fr(1, 'x')} go to 0.`
    ],
    ex: {
      q: `Find the limit of ${fr('x² − 9', 'x − 3')} as x → 3.`,
      steps: [
        [`Substituting x = 3 gives ${fr(0, 0)}`, `So factorise first.`],
        [`${fr('(x − 3)(x + 3)', 'x − 3')} = x + 3`, `Cancel the (x − 3).`],
        [`As x → 3, x + 3 → 6`, `So the limit is 6.`]
      ]
    },
    tryit: {
      q: `Find the limit of (2x + 5) as x → 4.`,
      given: [`Substituting gives a number, so that number is the limit`, `2(4) + 5`],
      ask: `= ?`, o: ['13', '9', '8', '5'], a: 0,
      h: `Work out 8 + 5.`, e: `2(4) + 5 = 13.`
    }
  }],
  qs: [
    { l: 2, q: `Find the limit of (x² + 1) as x → 2.`, o: ['5', '4', '3', '1'], a: 0, e: `Substitute: 2² + 1 = 5.` },
    { l: 3, q: `Find the limit of ${fr('x² − 4', 'x − 2')} as x → 2.`, o: ['4', '0', '2', 'It does not exist'], a: 0, e: `Substituting gives ${fr(0, 0)}, so factorise: ${fr('(x − 2)(x + 2)', 'x − 2')} = x + 2. As x → 2, this → 4.` },
    { l: 4, q: `Find the limit of ${fr('x² − 5x + 6', 'x − 3')} as x → 3.`, o: ['1', '0', '−1', '6'], a: 0, e: `x² − 5x + 6 = (x − 2)(x − 3). Cancel (x − 3) to get x − 2, which → 1 as x → 3.` },
    { l: 5, q: `Find the limit of ${fr('3x² + 2', 'x² − 1')} as x gets very large.`, o: ['3', '2', '−2', '0'], a: 0, e: `Divide every term by x²: ${fr('3 + 2/x²', '1 − 1/x²')}. As x gets very large, the terms with x² underneath go to 0, leaving ${fr(3, 1)} = 3.` }
  ]
}, 0);

/* ── Integration: sine and cosine ── */
addTo('integ', {
  goals: ['Integrate sine and cosine'],
  parts: [{
    title: 'Integrating sine and cosine',
    idea: `Integration undoes differentiation, so the rules for sine and cosine come straight from the ones you already know, with one sign to watch.`,
    rules: [
      `∫cos x dx = sin x + c.`,
      `∫sin x dx = −cos x + c.`,
      `∫cos ax dx = ${fr(1, 'a')} sin ax + c, and ∫sin ax dx = −${fr(1, 'a')} cos ax + c.`,
      `Check by differentiating your answer: you should get back what you started with.`
    ],
    ex: {
      q: `Find ∫(3 cos x + 2 sin x) dx.`,
      steps: [
        [`∫3 cos x dx = 3 sin x`, `cos integrates to sin.`],
        [`∫2 sin x dx = −2 cos x`, `sin integrates to −cos. Watch the minus sign.`],
        [`Answer: 3 sin x − 2 cos x + c`, `Check: differentiating gives 3 cos x + 2 sin x.`]
      ]
    },
    tryit: {
      q: `Find ∫cos 2x dx.`,
      given: [`∫cos ax dx = ${fr(1, 'a')} sin ax + c`, `Here a = 2`],
      ask: `= ?`, o: [`${fr(1, 2)} sin 2x + c`, '2 sin 2x + c', '−2 sin 2x + c', 'sin 2x + c'], a: 0,
      h: `Divide by the 2 in front of x.`, e: `${fr(1, 2)} sin 2x + c. Check: differentiating ${fr(1, 2)} sin 2x gives ${fr(1, 2)} × 2 cos 2x = cos 2x.`
    }
  }],
  qs: [
    { l: 2, q: `Find ∫sin x dx.`, o: ['−cos x + c', 'cos x + c', '−sin x + c', 'sin x + c'], a: 0, e: `∫sin x dx = −cos x + c. Check: differentiating −cos x gives sin x.` },
    { l: 3, q: `Find ∫(4 cos x − 1) dx.`, o: ['4 sin x − x + c', '−4 sin x − x + c', '4 sin x + c', '4 cos x − x + c'], a: 0, e: `∫4 cos x dx = 4 sin x and ∫1 dx = x. So the answer is 4 sin x − x + c.` },
    { l: 4, q: `Evaluate ${INT(0, fr('π', 2))} cos x dx.`, o: ['1', '0', '−1', fr('π', 2)], a: 0, e: `∫cos x dx = sin x. Then sin ${fr('π', 2)} − sin 0 = 1 − 0 = 1. (${fr('π', 2)} radians is 90°.)` },
    { l: 5, q: `Find ∫sin 3x dx.`, o: [`−${fr(1, 3)} cos 3x + c`, `${fr(1, 3)} cos 3x + c`, '−3 cos 3x + c', `−${fr(1, 3)} sin 3x + c`], a: 0, e: `∫sin ax dx = −${fr(1, 'a')} cos ax + c with a = 3, giving −${fr(1, 3)} cos 3x + c. Check: differentiating gives −${fr(1, 3)} × (−3 sin 3x) = sin 3x.` }
  ]
}, 1);

/* ── Averages and Charts: grouped data, histograms, cumulative frequency and ogives ── */
addTo('stats', {
  goals: ['Work with grouped data and histograms', 'Draw and read ogives to find the median and quartiles'],
  parts: [{
    title: 'Histograms and grouped data',
    idea: `When there is a lot of data, it is grouped into classes such as 10 to 19. A histogram shows grouped data with bars that touch, because each class runs straight on into the next.`,
    g: HIST30,
    cap: `The marks of 30 students in classes 10 marks wide. The tallest bar shows the modal class, 30 to 40.`,
    rules: [
      `The class mark is the middle of a class: for 20–29 it is ${fr('20 + 29', 2)} = 24.5.`,
      `Mean of grouped data = ${fr('Σfx', 'Σf')}, using the class marks as x.`,
      `The modal class is the class with the highest frequency.`,
      `In a histogram the bars touch. When the classes are the same width, the height of each bar is its frequency.`
    ],
    ex: {
      q: `Find the mean of the grouped data in the table.`,
      g: ['table', { head: ['Marks', '1–5', '6–10', '11–15'], rows: [['Frequency', '2', '5', '3']], label: 'Grouped frequency table: marks 1 to 5, frequency 2; 6 to 10, frequency 5; 11 to 15, frequency 3' }],
      steps: [
        [`Class marks: 3, 8 and 13`, `The middle of each class.`],
        [`Σfx = 2(3) + 5(8) + 3(13) = 85 and Σf = 10`, `Multiply each class mark by its frequency, then add.`],
        [`Mean = ${fr(85, 10)} = 8.5`, `Divide Σfx by Σf.`]
      ]
    },
    tryit: {
      q: `Use the histogram to find the modal class.`,
      g: HIST30,
      given: [`The modal class has the tallest bar`, `The tallest bar has a frequency of 12`],
      ask: `So the modal class is ?`, o: ['30–40', '20–30', '40–50', '12'], a: 0,
      h: `Read the class under the tallest bar.`, e: `The tallest bar is over 30 to 40, so that is the modal class. (12 is its frequency, not the class.)`
    }
  }, {
    title: 'Cumulative frequency and ogives',
    idea: `Cumulative frequency is a running total. Plotting it against the upper class boundaries gives an S-shaped curve called an ogive, which you can read to find the median and the quartiles.`,
    g: OGIVE40,
    cap: `40 students. Read across from 20, which is half of 40, to the curve, then down. The median is about 26 marks.`,
    rules: [
      `Cumulative frequency adds up the frequencies as you go: 4, then 4 + 8 = 12, and so on.`,
      `Plot each cumulative frequency at the upper class boundary, and join the points with a smooth curve.`,
      `Median: read across at ${fr('n', 2)}. Lower quartile: read across at ${fr('n', 4)}. Upper quartile: read across at ${fr('3n', 4)}.`,
      `Interquartile range = upper quartile − lower quartile.`
    ],
    ex: {
      q: `The frequencies of four classes are 5, 9, 12 and 4. Find the cumulative frequencies.`,
      steps: [
        [`5`, `The first cumulative frequency is the first frequency.`],
        [`5 + 9 = 14, then 14 + 12 = 26`, `Keep adding the next frequency.`],
        [`26 + 4 = 30`, `The last cumulative frequency is always the total.`]
      ]
    },
    tryit: {
      q: `On an ogive for 80 students, at what cumulative frequency do you read across to find the median?`,
      given: [`The median is the middle value`, `Read across at ${fr('n', 2)}`],
      ask: `= ?`, o: ['40', '20', '60', '80'], a: 0,
      h: `Half of 80.`, e: `${fr(80, 2)} = 40. (20 and 60 would give the quartiles.)`
    }
  }],
  qs: [
    { l: 2, q: `Find the class mark of the class 20–29.`, o: ['24.5', '25', '9', '49'], a: 0, e: `The class mark is the middle: ${fr('20 + 29', 2)} = 24.5.` },
    { l: 2, q: `On an ogive for 60 students, at what cumulative frequency do you read across to find the upper quartile?`, o: ['45', '15', '30', '60'], a: 0, e: `The upper quartile is at ${fr('3n', 4)} = ${fr('3 × 60', 4)} = 45. (15 gives the lower quartile and 30 the median.)` },
    { l: 3, q: `Find the modal class of the data in the table.`, g: ['table', { head: ['Class', '1–10', '11–20', '21–30', '31–40'], rows: [['Frequency', '6', '11', '15', '8']], label: 'Grouped frequency table: 1 to 10, 6; 11 to 20, 11; 21 to 30, 15; 31 to 40, 8' }], o: ['21–30', '15', '11–20', '31–40'], a: 0, e: `The highest frequency is 15, in the class 21–30. (15 is the frequency, not the class.)` },
    { l: 3, q: `The frequencies of the classes 0–9, 10–19, 20–29 and 30–39 are 3, 8, 10 and 4. Find the cumulative frequency of the class 20–29.`, o: ['21', '10', '25', '11'], a: 0, e: `Add the frequencies up to and including 20–29: 3 + 8 + 10 = 21.` },
    { l: 4, q: `Find the mean of the grouped data in the table.`, g: ['table', { head: ['Class', '0–4', '5–9', '10–14'], rows: [['Frequency', '4', '10', '6']], label: 'Grouped frequency table: 0 to 4, frequency 4; 5 to 9, frequency 10; 10 to 14, frequency 6' }], o: ['7.5', '7', '6.67', '10'], a: 0, e: `The class marks are 2, 7 and 12. Σfx = 4(2) + 10(7) + 6(12) = 150 and Σf = 20. Mean = 150 ÷ 20 = 7.5.` },
    { l: 4, q: `The ogive shows the marks of 40 students. Use it to estimate the median mark.`, g: OGIVE40, o: ['26', '20', '30', '35'], a: 0, e: `The median is at ${fr(40, 2)} = 20 on the cumulative frequency axis. Reading across from 20 to the curve and down gives about 26 marks. (20 is where you read across, not the answer.)` },
    { l: 5, q: `On an ogive, the lower quartile is 32 and the upper quartile is 58. Find the interquartile range.`, o: ['26', '45', '90', '13'], a: 0, e: `Interquartile range = 58 − 32 = 26. (13 is half of it, called the semi-interquartile range.)` },
    { l: 5, q: `The histogram shows the ages of the members of a club. How many members are there?`, g: ['hist', { edges: [10, 20, 30, 40, 50], f: [4, 10, 8, 6], xl: 'Age (years)', label: 'Histogram of ages: 10 to 20, 4 members; 20 to 30, 10; 30 to 40, 8; 40 to 50, 6' }], o: ['28', '10', '40', '4'], a: 0, e: `Add the heights of all the bars: 4 + 10 + 8 + 6 = 28 members.` }
  ]
}, 2);

/* ── Permutation and Combination: circular arrangements ── */
addTo('perm', {
  goals: ['Count circular arrangements'],
  parts: [{
    title: 'Circular arrangements',
    idea: `When people sit round a table, there is no first seat. Only their positions relative to each other matter, so moving everyone one seat round gives the same arrangement.`,
    g: ['round', { n: 5, fix: 'Fix A, then arrange the other 4', label: 'Five people A to E seated round a table, with A fixed in place' }],
    cap: `Fix A in one seat. The other 4 people can then be arranged in 4! = 24 ways.`,
    rules: [
      `n people round a table can be arranged in (n − 1)! ways.`,
      `Fix one person, then arrange the others as if they were in a line.`,
      `If clockwise and anticlockwise count as the same, as with beads on a necklace that can be flipped over, divide by 2: ${fr('(n − 1)!', 2)}.`
    ],
    ex: {
      q: `In how many ways can 6 people sit round a circular table?`,
      steps: [
        [`Fix one person in a seat`, `Moving everyone round gives the same arrangement.`],
        [`Arrange the other 5: 5!`, `They fill the remaining seats in order.`],
        [`= 120 ways`, `5! = 120.`]
      ]
    },
    tryit: {
      q: `In how many ways can 4 people sit round a table?`,
      given: [`n = 4, so the answer is (4 − 1)!`, `= 3!`],
      ask: `= ?`, o: ['6', '24', '12', '4'], a: 0,
      h: `3 × 2 × 1.`, e: `3! = 6. (24 = 4! would count the same arrangements turned round as different.)`
    }
  }],
  qs: [
    { l: 2, q: `In how many ways can 5 people sit round a circular table?`, o: ['24', '120', '60', '5'], a: 0, e: `(5 − 1)! = 4! = 24. (120 = 5! is for a straight row.)` },
    { l: 3, q: `In how many ways can 7 beads of different colours be arranged on a necklace?`, o: ['360', '720', '5040', '2520'], a: 0, e: `Round a circle: (7 − 1)! = 720. A necklace can be flipped over, so clockwise and anticlockwise are the same: 720 ÷ 2 = 360.` },
    { l: 4, q: `In how many ways can 6 people sit round a table if two of them, Ada and Bayo, must sit together?`, o: ['48', '24', '120', '240'], a: 0, e: `Tie Ada and Bayo together as one unit. That makes 5 units round the table: (5 − 1)! = 24 ways. Ada and Bayo can swap seats in 2 ways, so the total is 24 × 2 = 48.` },
    { l: 5, q: `8 people sit round a table. In how many ways can they sit if two particular people must not sit next to each other?`, o: ['3600', '1440', '5040', '4320'], a: 0, e: `All arrangements: (8 − 1)! = 5040. With the two together: (7 − 1)! × 2 = 1440. So the number with them apart is 5040 − 1440 = 3600.` }
  ]
}, 3);

/* Show the topics in syllabus order: Section I, II, III, IV, V. */
const ORDER = ['bases', 'frac', 'indices', 'surds', 'sets', 'quad', 'variation', 'ineq', 'prog', 'poly', 'simul', 'binop', 'matrix', 'geom', 'mens', 'loci', 'coord', 'trig', 'diff', 'integ', 'stats', 'disp', 'perm', 'prob'];
CONTENT.topics.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

export const MATH_TOPICS: Topic[] = CONTENT.topics;
