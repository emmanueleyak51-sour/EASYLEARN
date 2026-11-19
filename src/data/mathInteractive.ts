// @ts-nocheck
import type { InteractiveLesson, Topic } from "../types";
import { fr, MN, nm, frac, poly, isSq, brk } from "../utils/mathMarkup";
import { MATH_TOPICS } from "./mathTopics";

const topic = (id: string) => MATH_TOPICS.find((t) => t.id === id)!;
const mx = (rows: any[][], cls = "mx") => `<span class="${cls}">${rows.map(r => `<span class="mr">${r.map(v => `<span>${v}</span>`).join("")}</span>`).join("")}</span>`;
const TREE = ['tree', { b1: [['R', '3/5'], ['B', '2/5']], b2: [[['R', '2/4'], ['B', '2/4']], [['R', '3/4'], ['B', '1/4']]], label: 'Tree diagram for two draws without replacement from a bag of 3 red and 2 blue balls. First draw: red 3/5, blue 2/5. After red: red 2/4, blue 2/4. After blue: red 3/4, blue 1/4' }];
function qroots(a, b, c) {
  if (a === 0) return b === 0 ? { lin: true, r: [] } : { lin: true, r: [-c / b] };
  const d = b * b - 4 * a * c;
  if (d < 0) return { d, r: [] };
  if (d === 0) return { d, r: [-b / (2 * a)] };
  const s = Math.sqrt(d);
  return { d, r: [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort((p, q) => p - q) };
}
function rootText(a, b, c) {
  const R = qroots(a, b, c);
  if (R.lin) return R.r.length ? `x = ${frac(-c, b)} (only one: this is a straight line)` : 'none';
  if (!R.r.length) return 'none: the curve misses the x-axis';
  if (isSq(R.d)) { const s = Math.sqrt(R.d), xs = [frac(-b - s, 2 * a), frac(-b + s, 2 * a)]; return R.d === 0 ? `x = ${xs[0]} (twice)` : `x = ${(-b - s) / (2 * a) < (-b + s) / (2 * a) ? xs.join(' and x = ') : xs.reverse().join(' and x = ')}`; }
  return `x = (${nm(-b)} ± √${R.d}) ÷ ${nm(2 * a)}, about ${R.r.map(v => nm(v)).join(' and ')}`;
}
const CC = [160, 122], CR = 92;
const onC = (d, r = CR) => [CC[0] + r * Math.cos(rad2(d)), CC[1] - r * Math.sin(rad2(d))];
const dirTo = (v, p) => md360(deg(Math.atan2(v[1] - p[1], p[0] - v[0])));          // math-style direction from v towards p
const inArc = (from, to, x) => md360(x - from) < md360(to - from);                    // x on the arc going anticlockwise from → to
const adist = (a, b) => { const d = md360(a - b); return Math.min(d, 360 - d); };
function vAngle(v, p, q) { const u = [p[0] - v[0], p[1] - v[1]], w = [q[0] - v[0], q[1] - v[1]]; return deg(Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / Math.hypot(...u) / Math.hypot(...w))))); }

const md360 = x => ((x % 360) + 360) % 360;
const deg = r => r * 180 / Math.PI;
const rad2 = d => d * Math.PI / 180;
const XP_circ_calc = s => {
  const pAB = inArc(s.A, s.B, s.P), cen = pAB ? md360(s.A - s.B) : md360(s.B - s.A), minor = Math.min(md360(s.B - s.A), md360(s.A - s.B));
  const ins = vAngle(onC(s.P), onC(s.A), onC(s.B)), insQ = vAngle(onC(s.Q), onC(s.A), onC(s.B));
  return { pAB, cen, minor, ins, insQ, same: pAB === inArc(s.A, s.B, s.Q) };
};
const XP_cyc_ang = s => { const [A, B, C, D] = s.p; return { A: md360(D - B) / 2, B: md360(A - C) / 2, C: md360(B - D) / 2, D: md360(C - A) / 2 }; };


const IL: Record<string, InteractiveLesson> = {};
IL.quad = {
  parts: [
    {
      title: 'Roots and factorising',
      beats: [
        {
          k: 'explore', xp: 'parab', cfg: { b: -5, c: 6, fact: true }, title: 'Where does the curve cross?',
          intro: `A quadratic equation has x² as its highest power: ax² + bx + c = 0. Its solutions are called <b>roots</b>. Here you will see what the roots are on a graph.`,
          predict: {
            q: `Here is y = x² − 5x + 6. Before you touch anything: where do you think the curve crosses the x-axis?`,
            o: ['At x = 2 and x = 3', 'At x = 5 and x = 6', 'At x = −2 and x = −3', 'It does not cross the x-axis'],
            fb: [
              `2 × 3 = 6 and 2 + 3 = 5. The numbers in the equation are hiding the roots.`,
              `Those are the numbers you can see in the equation, not where y is 0. Put x = 5 in: 25 − 25 + 6 = 6, not 0.`,
              `Close, but the signs are wrong. At x = −2, y = 4 + 10 + 6 = 20, far above the axis.`,
              `It does cross. At x = 2.5, y = 6.25 − 12.5 + 6 = −0.25, which is below the axis, so the curve must cross on both sides of it.`
            ]
          },
          tasks: [
            { t: 'Keep b at −5 and set c to 4. Where are the roots now?', ok: s => s.a === 1 && s.b === -5 && s.c === 4, say: `Roots at 1 and 4. Check: 1 × 4 = 4 and 1 + 4 = 5. The product of the roots is c.` },
            { t: 'Make the roots exactly 2 and 5.', ok: s => s.a === 1 && s.b === -7 && s.c === 10, say: `You needed product 10 and sum 7, so c = 10 and b = −7. You just built x² − 7x + 10 from its roots.` },
            { t: 'Make the curve just touch the x-axis at one point.', ok: s => s.a && s.b * s.b === 4 * s.a * s.c, say: `One touching point means the two roots are equal. The brackets repeat, like (x − 3)².` },
            { t: 'Lift the curve so it misses the x-axis completely.', ok: s => s.a && s.b * s.b < 4 * s.a * s.c, say: `No crossing, no real roots. Factorising can never work on this one.` }
          ],
          found: `The roots are where the curve meets the x-axis. If the roots are p and q, the equation is (x − p)(x − q) = 0. Multiply it out and the number term c is p × q.`,
          rules: [`When a = 1, look for two numbers that multiply to give c and add to give b.`, `Write the brackets, then set each bracket equal to 0. The signs flip.`]
        },
        {
          k: 'dayo', title: 'Factorise x² + 2x − 15 = 0',
          nodes: {
            start: { say: `Let us factorise x² + 2x − 15 = 0 together. I need two numbers. First question: what must they <b>multiply</b> to give?`, opts: [
              { t: '−15', say: 'Yes. The product is c, sign and all.', next: 'sum' },
              { t: '+15', say: 'Look at the sign in front of the 15. It is a minus, and the sign belongs to the number. Try again.' },
              { t: '2', say: '2 is the middle number. That one is for adding. What about multiplying?' }] },
            sum: { say: 'And what must they <b>add</b> to give?', opts: [
              { t: '+2', say: 'Correct, the number in front of x.', next: 'find' },
              { t: '−2', say: 'The middle term is +2x, so the sum is +2. Do not change its sign.' },
              { t: '−15', say: 'That was the product. The sum comes from the x term.' }] },
            find: { say: 'Product −15, sum +2. A negative product means one number is positive and the other negative. Which pair works?', opts: [
              { t: '+5 and −3', say: 'Check: 5 × (−3) = −15 and 5 + (−3) = 2. Perfect.', next: 'brk' },
              { t: '−5 and +3', say: '−5 × 3 = −15, good. But −5 + 3 = −2, not +2. Swap the signs.' },
              { t: '+15 and −1', say: '15 × (−1) = −15, yes. But 15 + (−1) = 14. Too big.' },
              { t: '+3 and +5', say: '3 × 5 = +15. We need a negative product, so one of them must be negative.' }] },
            brk: { say: 'So (x + 5)(x − 3) = 0. Now think: if two things multiply to give 0, what must be true?', opts: [
              { t: 'At least one of them is 0', say: 'Exactly. That is the whole reason factorising works.', next: 'roots' },
              { t: 'Both of them are 0', say: 'Not both. 0 × 7 = 0 too. Only one of them needs to be 0.' },
              { t: 'They are equal', say: '2 × 2 = 4, not 0. Think again: what number times anything gives 0?' }] },
            roots: { say: 'So x + 5 = 0 or x − 3 = 0. What are the roots?', opts: [
              { t: 'x = −5 or x = 3', say: 'Yes. See how the signs flip from the brackets.', next: 'end' },
              { t: 'x = 5 or x = −3', say: 'Solve x + 5 = 0: take 5 from both sides. What is x?' },
              { t: 'x = 5 or x = 3', say: 'Look at x + 5 = 0 again. x has to be negative to cancel the +5.' }] },
            end: { end: true, say: 'You just factorised it the way exams expect. Remember the flip: bracket (x + 5) gives root −5. Na that one dey catch people for exam hall.' }
          }
        },
        {
          k: 'fade', lv: 'full', q: `Solve x² − 7x + 10 = 0.`,
          steps: [
            { m: `Product +10, sum −7: the numbers are −2 and −5`, why: `(−2) × (−5) = +10 and (−2) + (−5) = −7.`,
              ex: { q: 'Why must both numbers be negative here?', o: ['Their product is positive but their sum is negative', 'Because 10 is an even number', 'Because quadratics always have negative roots'],
                fb: ['Yes. A positive product means the signs match. A negative sum means they are both negative.', 'Even or odd has nothing to do with the signs. Look at the signs of the product and the sum.', 'Not true. This equation has roots 2 and 5, and both are positive.'] } },
            { m: `(x − 2)(x − 5) = 0`, why: `Put the two numbers in the brackets.` },
            { m: `x = 2 or x = 5`, why: `Each bracket equals 0 in turn. The signs flip.` }
          ]
        },
        {
          k: 'fade', lv: 'one', q: `Solve x² + 2x − 8 = 0.`,
          steps: [
            { m: `Product −8, sum +2: the numbers are +4 and −2`, why: `4 × (−2) = −8 and 4 + (−2) = 2.` },
            { m: `(x + 4)(x − 2) = 0`, why: `Put the two numbers in the brackets.` },
            { ask: 'Finish it: x = ?', o: ['x = −4 or x = 2', 'x = 4 or x = −2', 'x = 4 or x = 2', 'x = −4 or x = −2'], m: `x = −4 or x = 2`, why: `x + 4 = 0 gives −4, and x − 2 = 0 gives 2.`,
              fb: ['Correct. x + 4 = 0 gives x = −4, and x − 2 = 0 gives x = 2.', 'You copied the numbers from the brackets. Set each bracket to 0 instead: x + 4 = 0 gives x = −4.', 'One root is negative. Solve x + 4 = 0.', 'Solve x − 2 = 0. You add 2 to both sides, so x = +2.'],
              h: ['Set each bracket equal to 0.', 'x + 4 = 0. What must x be?', 'x + 4 = 0 gives x = −4. Now do the same with x − 2 = 0.'] }
          ]
        },
        {
          k: 'fade', lv: 'two', q: `Solve x² − x − 12 = 0.`,
          steps: [
            { m: `Product −12, sum −1: the numbers are −4 and +3`, why: `(−4) × 3 = −12 and (−4) + 3 = −1.` },
            { ask: 'Write the brackets', o: ['(x − 4)(x + 3) = 0', '(x + 4)(x − 3) = 0', '(x − 4)(x − 3) = 0', '(x − 12)(x + 1) = 0'], m: `(x − 4)(x + 3) = 0`, why: `The two numbers go straight into the brackets.`,
              fb: ['Yes. The numbers −4 and +3 go straight into the brackets.', 'Those brackets multiply out to x² + x − 12. The middle sign is wrong.', '(x − 4)(x − 3) multiplies out to x² − 7x + 12. Both the product and the sum are off.', 'Those multiply to −12 but add to −11, not −1.'],
              h: ['The numbers are −4 and +3. Each one goes into a bracket with x.', 'The bracket for −4 is (x − 4).'] },
            { ask: 'Now the roots', o: ['x = 4 or x = −3', 'x = −4 or x = 3', 'x = 4 or x = 3', 'x = −4 or x = −3'], m: `x = 4 or x = −3`, why: `x − 4 = 0 gives 4, and x + 3 = 0 gives −3.`,
              fb: ['Correct. The signs flip from the brackets.', 'Those are the numbers from step 1, not the roots. Set each bracket to 0.', 'Solve x + 3 = 0. The root is negative.', 'Solve x − 4 = 0. That root is positive.'],
              h: ['Set each bracket equal to 0.', 'x − 4 = 0 gives x = 4. What does x + 3 = 0 give?'] }
          ]
        },
        {
          k: 'fade', lv: 'solo', q: `Solve x² + 6x + 8 = 0.`,
          steps: [
            { ask: 'Which two numbers?', o: ['+2 and +4', '−2 and −4', '+1 and +8', '+2 and −4'], m: `Product +8, sum +6: the numbers are +2 and +4`, why: `2 × 4 = 8 and 2 + 4 = 6.`,
              fb: ['2 × 4 = 8 and 2 + 4 = 6.', '(−2) × (−4) = 8, but they add to −6. We need +6.', '1 × 8 = 8, but 1 + 8 = 9.', '2 × (−4) = −8. The product must be +8.'],
              h: ['You need a product of +8 and a sum of +6.', 'Positive product and positive sum: both numbers are positive.', 'Try the factor pairs of 8: 1 and 8, 2 and 4.'] },
            { ask: 'Write the brackets', o: ['(x + 2)(x + 4) = 0', '(x − 2)(x − 4) = 0', '(x + 2)(x − 4) = 0', '(x + 8)(x + 1) = 0'], m: `(x + 2)(x + 4) = 0`, why: `The numbers go straight into the brackets.`,
              fb: ['Right.', 'The numbers were +2 and +4, so the brackets have plus signs.', 'Both numbers are positive.', 'Those numbers add to 9, not 6.'],
              h: ['Each number goes into a bracket with x, keeping its sign.'] },
            { ask: 'Now the roots', o: ['x = −2 or x = −4', 'x = 2 or x = 4', 'x = −2 or x = 4', 'x = −8 or x = −1'], m: `x = −2 or x = −4`, why: `Each bracket equals 0, and the signs flip.`,
              fb: ['Correct. Both roots are negative.', 'Set x + 2 = 0. The root is −2, not 2.', 'x + 4 = 0 gives x = −4.', 'Those come from the wrong brackets.'],
              h: ['Set each bracket to 0.', 'x + 2 = 0 gives x = −2.'] }
          ]
        },
        {
          k: 'spot', who: 'Tunde', q: `Solve x² − 3x − 10 = 0.`,
          lines: ['Product −10, sum −3: the numbers are −5 and +2', '(x − 5)(x + 2) = 0', 'x = −5 or x = 2'], bad: 2,
          okfb: ['This line is right: (−5) × 2 = −10 and (−5) + 2 = −3.', 'This line is right. Multiply it out: x² + 2x − 5x − 10 = x² − 3x − 10.'],
          o: ['He copied the numbers into the answer instead of setting each bracket to 0', 'He picked the wrong pair of numbers', 'The brackets should be (x + 5)(x − 2)', 'A quadratic can only have one root'],
          fb: ['That is it. x − 5 = 0 gives x = 5, not −5. The signs flip.', 'The pair −5 and +2 is right: product −10, sum −3.', '(x + 5)(x − 2) multiplies out to x² + 3x − 10. His brackets were right.', 'A quadratic can have two roots, and this one does.'],
          h: ['Put x = −5 into x² − 3x − 10. Do you get 0?', '25 + 15 − 10 = 30, not 0. So −5 is not a root. Where did −5 come from?'],
          fix: 'x − 5 = 0 gives x = 5, and x + 2 = 0 gives x = −2. So x = 5 or x = −2.'
        }
      ]
    },
    {
      title: 'The formula and b² − 4ac',
      beats: [
        {
          k: 'explore', xp: 'parab', cfg: { a: 1, b: -4, c: 0, showA: true, disc: true }, title: 'What b² − 4ac tells you',
          intro: `Many quadratics will not factorise. The formula x = (−b ± √(b² − 4ac)) ÷ 2a always works. The part under the square root, b² − 4ac, tells you how many roots there are before you solve anything.`,
          predict: {
            q: `Start with y = x² − 4x. You are about to push c up from 0. What happens to the two roots?`,
            o: ['They move closer, meet, then disappear', 'They move further apart', 'Nothing. c does not affect the roots', 'They both get bigger'],
            fb: [
              `Lifting the curve squeezes the two crossings together. At c = 4 they meet, and after that the curve floats above the axis.`,
              `c lifts the whole curve up. The bottom of the cup rises towards the axis, so the crossings get closer, not further.`,
              `c moves the whole curve up and down, and that changes where it crosses.`,
              `Their sum stays at 4 the whole time (it is −b ÷ a), so they cannot both get bigger.`
            ]
          },
          tasks: [
            { t: 'Push c up until the two roots meet.', ok: s => s.a !== 0 && s.b * s.b === 4 * s.a * s.c, say: `b² − 4ac = 0. The ± part is ± 0, so both roots are the same number. Exam questions call this "equal roots".` },
            { t: 'Make b² − 4ac negative. What happens to the curve?', ok: s => s.a !== 0 && s.b * s.b < 4 * s.a * s.c, say: `Negative under the square root: no real number works, so no real roots. The curve misses the axis.` },
            { t: 'Make b² − 4ac a perfect square bigger than 0, like 4, 9 or 16.', ok: s => { const d = s.b * s.b - 4 * s.a * s.c; return s.a !== 0 && d > 0 && isSq(d); }, say: `A perfect square under the root gives whole numbers or fractions. That is exactly when the equation factorises.` },
            { t: 'Make a negative to flip the curve upside down.', ok: s => s.a < 0, say: `With a negative the cup becomes a cap. The roots are still wherever it crosses the axis.` }
          ],
          found: `b² − 4ac is called the discriminant. Its sign tells you how many roots there are. Its value tells you whether they are tidy enough to factorise.`,
          rules: [`b² − 4ac > 0: two different roots. b² − 4ac = 0: equal roots. b² − 4ac < 0: no real roots.`, `x = (−b ± √(b² − 4ac)) ÷ 2a works for every quadratic.`, `If b² − 4ac is a perfect square, the equation factorises.`]
        },
        {
          k: 'fade', lv: 'full', q: `Solve x² − 2x − 2 = 0, leaving your answer in surd form.`,
          steps: [
            { m: `a = 1, b = −2, c = −2`, why: `Read the numbers, signs included.` },
            { m: `b² − 4ac = 4 + 8 = 12`, why: `(−2)² = 4, and −4 × 1 × (−2) = +8.`,
              ex: { q: 'Why is it 4 + 8 and not 4 − 8?', o: ['c is negative, so −4ac becomes positive', 'You always add in the formula', 'Because b is negative'],
                fb: ['Yes. −4 × 1 × (−2) = +8. Two negatives make a positive.', 'The formula has a minus: b² − 4ac. It only turned into a plus because c is negative here.', 'b is squared, so its sign never matters for b². The sign change comes from c.'] } },
            { m: `x = (2 ± √12) ÷ 2`, why: `−b = +2 goes on top, 2a = 2 goes underneath.` },
            { m: `x = 1 ± √3`, why: `√12 = 2√3. Then divide every term by 2.` }
          ]
        },
        {
          k: 'fade', lv: 'two', q: `Solve x² + 4x + 1 = 0, leaving your answer in surd form.`,
          steps: [
            { m: `a = 1, b = 4, c = 1`, why: `Read the numbers.` },
            { m: `b² − 4ac = 16 − 4 = 12`, why: `4² = 16 and 4 × 1 × 1 = 4.` },
            { ask: 'Put it into the formula', o: ['x = (−4 ± √12) ÷ 2', 'x = (4 ± √12) ÷ 2', 'x = (−4 ± √12) ÷ 1', 'x = (−4 ± 12) ÷ 2'], m: `x = (−4 ± √12) ÷ 2`, why: `−b = −4 on top, 2a = 2 underneath.`,
              fb: ['Right: −b on top is −4, and 2a = 2.', 'The top starts with −b. Here b = +4, so −b = −4.', 'Underneath is 2a, which is 2 × 1 = 2.', 'Keep the square root: √12, not 12.'],
              h: ['The formula starts with −b. What is −b when b = 4?', 'Underneath goes 2a. What is 2 × 1?'] },
            { ask: 'Simplify', o: ['x = −2 ± √3', 'x = −4 ± √3', 'x = 2 ± √3', 'x = −2 ± 2√3'], m: `x = −2 ± √3`, why: `√12 = 2√3, so (−4 ± 2√3) ÷ 2 = −2 ± √3.`,
              fb: ['(−4 ± 2√3) ÷ 2 = −2 ± √3.', 'Divide every term by 2, and that includes the −4.', '−4 ÷ 2 is −2, not +2.', 'You divided the −4 but not the 2√3. Every term gets divided by 2.'],
              h: ['First write √12 as 2√3, because 12 = 4 × 3.', 'Now you have (−4 ± 2√3) ÷ 2. Divide both terms by 2.'] }
          ]
        },
        {
          k: 'fade', lv: 'solo', q: `Solve x² − 6x + 4 = 0, leaving your answer in surd form.`,
          steps: [
            { ask: 'a, b and c are', o: ['1, −6 and 4', '1, 6 and 4', '−6, 4 and 1', '1, −6 and −4'], m: `a = 1, b = −6, c = 4`, why: `Read the numbers, signs included.`,
              fb: ['Right.', 'b carries its sign: the term is −6x, so b = −6.', 'a is the number in front of x², which is 1.', 'The number term is +4.'], h: ['a goes with x², b with x, and c is the number on its own.'] },
            { ask: 'b² − 4ac = ?', o: ['36 − 16 = 20', '−36 − 16 = −52', '36 + 16 = 52', '12 − 16 = −4'], m: `b² − 4ac = 36 − 16 = 20`, why: `(−6)² = 36 and 4 × 1 × 4 = 16.`,
              fb: ['Right.', '(−6)² is +36. A square is never negative.', '4ac = 16 is positive here, so you subtract it.', '(−6)² means −6 × −6 = 36, not 2 × 6.'], h: ['Square b first: (−6) × (−6).', 'Then 4ac = 4 × 1 × 4.'] },
            { ask: 'Put it into the formula', o: ['x = (6 ± √20) ÷ 2', 'x = (−6 ± √20) ÷ 2', 'x = (6 ± √20) ÷ 1', 'x = (6 ± 20) ÷ 2'], m: `x = (6 ± √20) ÷ 2`, why: `−b = +6 on top, 2a = 2 underneath.`,
              fb: ['Right.', '−b means the opposite of b. b = −6, so −b = +6.', 'Underneath is 2a = 2.', 'Keep the square root sign.'], h: ['b = −6. What is −b?'] },
            { ask: 'Simplify', o: ['x = 3 ± √5', 'x = 3 ± 2√5', 'x = 6 ± √5', 'x = −3 ± √5'], m: `x = 3 ± √5`, why: `√20 = 2√5, and (6 ± 2√5) ÷ 2 = 3 ± √5.`,
              fb: ['That is the answer in surd form.', 'You did not divide the 2√5 by 2.', 'You did not divide the 6 by 2.', 'The top was +6, so you get +3.'], h: ['20 = 4 × 5, so √20 = 2√5.', 'Divide both 6 and 2√5 by 2.'] }
          ]
        },
        {
          k: 'check', q: `For what value of k does x² + 6x + k = 0 have equal roots?`,
          o: ['9', '36', '6', '3'],
          fb: ['Equal roots need b² − 4ac = 0. So 36 − 4k = 0, and k = 9.', '36 is b². The condition is b² = 4ac, so 36 = 4k.', '6 is b. Put it into b² − 4ac = 0.', 'Check: 36 − 4 × 3 = 24, not 0.'],
          h: ['Equal roots: what must b² − 4ac be?', 'b² − 4ac = 0 gives 36 − 4 × 1 × k = 0.', 'So 4k = 36. Divide by 4.'],
          why: { q: 'Why does b² − 4ac = 0 give equal roots?', o: ['The ± part becomes ± 0, so both roots are the same number', 'The curve misses the x-axis', 'a has to be 1'],
            fb: ['Exactly. (−b + 0) ÷ 2a and (−b − 0) ÷ 2a are the same.', 'That happens when b² − 4ac is negative.', 'a can be any number except 0.'] }
        }
      ]
    },
    {
      title: 'Sum and product of roots',
      beats: [
        {
          k: 'explore', xp: 'roots', cfg: { p: 2, q: 3 }, title: 'The roots build the equation',
          intro: `You can know facts about the roots without solving. Drag the two roots and watch the equation rebuild itself.`,
          predict: {
            q: `Roots 2 and 3 give x² − 5x + 6 = 0. If you move the root at 3 down to −3, what happens to the number term?`,
            o: ['It becomes −6', 'It becomes 6', 'It becomes −1', 'It stays at 6'],
            fb: ['The number term is the product of the roots: 2 × (−3) = −6.', 'The product of 2 and −3 is negative.', '−1 is the sum, 2 + (−3). The sum controls the x term, not the number term.', 'The number term is the product of the roots, so it changes when a root changes.']
          },
          tasks: [
            { t: 'Move a root to −3.', ok: s => s.p === -3 || s.q === -3, say: `The product went negative, so the number term is negative. One root each side of 0 always does that.` },
            { t: 'Make the sum of the roots 0.', ok: s => s.p + s.q === 0 && s.p !== 0, say: `Sum 0 means no x term at all, like x² − 9 = 0. That is why x² − 9 = 0 has roots +3 and −3.` },
            { t: 'Build x² − 2x − 8 = 0.', ok: s => (s.p === 4 && s.q === -2) || (s.p === -2 && s.q === 4), say: `Roots 4 and −2: sum 2, product −8. So x² − (2)x + (−8) = 0.` }
          ],
          found: `Every quadratic with a = 1 can be written as x² − (sum of roots)x + (product of roots) = 0. When a is not 1, divide by a first: the sum is −b ÷ a and the product is c ÷ a.`,
          rules: [`Sum of roots: α + β = −b ÷ a`, `Product of roots: αβ = c ÷ a`, `To build an equation from its roots: x² − (sum)x + (product) = 0`]
        },
        {
          k: 'fade', lv: 'full', q: `Find the quadratic equation whose roots are 2 and −5.`,
          steps: [
            { m: `Sum = 2 + (−5) = −3`, why: `Add the roots.` },
            { m: `Product = 2 × (−5) = −10`, why: `Multiply the roots.` },
            { m: `x² − (−3)x + (−10) = 0, so x² + 3x − 10 = 0`, why: `Put them into x² − (sum)x + (product) = 0, then tidy the signs.`,
              ex: { q: 'Why does −(−3)x become +3x?', o: ['Minus a negative is a plus', 'Because 3 is bigger than 2', 'The formula always gives +x'], fb: ['Yes. −(−3) = +3.', 'Size has nothing to do with it. It is about the two minus signs.', 'If the sum were positive you would get −x. Here two minus signs make a plus.'] } }
          ]
        },
        {
          k: 'fade', lv: 'one', q: `Find the quadratic equation whose roots are −3 and −4.`,
          steps: [
            { m: `Sum = (−3) + (−4) = −7`, why: `Add the roots.` },
            { m: `Product = (−3) × (−4) = 12`, why: `Two negatives multiply to a positive.` },
            { ask: 'The equation is', o: ['x² + 7x + 12 = 0', 'x² − 7x + 12 = 0', 'x² + 7x − 12 = 0', 'x² − 12x + 7 = 0'], m: `x² − (−7)x + 12 = 0, so x² + 7x + 12 = 0`, why: `x² − (sum)x + (product) = 0.`,
              fb: ['Right. −(−7) = +7.', 'You need minus the sum: −(−7)x = +7x.', 'The product of two negatives is positive, so +12.', 'The sum goes with x and the product is the number term.'],
              h: ['Use x² − (sum)x + (product) = 0.', 'The sum is −7, so −(sum) is +7.'] }
          ]
        },
        {
          k: 'fade', lv: 'solo', q: `Find the quadratic equation, with whole-number coefficients, whose roots are −4 and ½.`,
          steps: [
            { ask: 'Sum of the roots', o: [`${MN}${fr(7, 2)}`, fr(7, 2), `${MN}${fr(9, 2)}`, '−2'], m: `Sum = −4 + ½ = ${MN}${fr(7, 2)}`, why: `−4 + ½ = −3½.`,
              fb: ['−4 + ½ = −3½.', 'The sum is below 0: −4 + ½ is still negative.', 'That is −4 − ½. You subtracted instead of adding.', '−2 is the product, not the sum.'], h: ['Add −4 and ½.', 'Starting at −4 and going up by ½ lands on −3½.'] },
            { ask: 'Product of the roots', o: ['−2', '2', `${MN}${fr(7, 2)}`, `${MN}4${fr(1, 2)}`], m: `Product = −4 × ½ = −2`, why: `Half of −4.`,
              fb: ['Half of −4 is −2.', 'A negative times a positive is negative.', 'That is the sum.', 'Multiply, do not subtract.'], h: ['Multiply −4 by ½.'] },
            { ask: 'The equation', o: [`x² + ${fr(7, 2)}x − 2 = 0`, `x² − ${fr(7, 2)}x − 2 = 0`, `x² + ${fr(7, 2)}x + 2 = 0`, `x² − 2x − ${fr(7, 2)} = 0`], m: `x² + ${fr(7, 2)}x − 2 = 0`, why: `−(sum) = +${fr(7, 2)}, and the product is −2.`,
              fb: ['Right.', 'Minus a negative sum gives a plus.', 'The product is −2.', 'The sum goes with x and the product is the number term.'], h: ['Use x² − (sum)x + (product) = 0.'] },
            { ask: 'Clear the fraction', o: ['2x² + 7x − 4 = 0', '2x² + 7x − 2 = 0', 'x² + 7x − 4 = 0', '2x² − 7x − 4 = 0'], m: `2x² + 7x − 4 = 0`, why: `Multiply every term by 2.`,
              fb: ['Every term times 2.', 'Multiply the −2 by 2 as well: −2 × 2 = −4.', 'The x² term must be doubled too.', 'Doubling does not change any sign.'], h: ['Multiply every term by 2, the one on x² included.'] }
          ]
        },
        {
          k: 'spot', who: 'Amaka', q: `Find the sum of the roots of 2x² + 8x − 5 = 0.`,
          lines: ['a = 2, b = 8, c = −5', 'Sum of roots = b ÷ a', '= 8 ÷ 2 = 4'], bad: 1,
          okfb: ['This line is right. She read the numbers with their signs.', 'The arithmetic is fine: 8 ÷ 2 = 4. The problem is the rule she used to get here.'],
          o: ['The sum of the roots is −b ÷ a. She lost the minus sign', 'She read a and b the wrong way round', 'She should have used c ÷ a', '8 ÷ 2 is not 4'],
          fb: ['That is the exam trap. The answer is −4.', 'a = 2 and b = 8 are correct.', 'c ÷ a is the product of the roots, not the sum.', '8 ÷ 2 = 4 is fine. The rule is wrong.'],
          h: ['Check the rule against x² − 5x + 6 = 0, whose roots are 2 and 3. Does b ÷ a give 5?'],
          fix: 'Sum of roots = −b ÷ a = −8 ÷ 2 = −4.'
        },
        {
          k: 'check', q: `α and β are the roots of x² − 4x + 2 = 0. Find α² + β² without solving the equation.`,
          o: ['12', '16', '14', '20'],
          fb: ['α + β = 4 and αβ = 2, so α² + β² = (α + β)² − 2αβ = 16 − 4 = 12.', '16 is (α + β)². You still need to take away 2αβ.', 'That takes away αβ once. The identity takes away 2αβ.', 'You added 2αβ. It should be taken away, because (α + β)² = α² + 2αβ + β².'],
          h: ['First find α + β and αβ from the equation.', 'Multiply out (α + β)². Which extra term appears?', '(α + β)² = α² + β² + 2αβ, so α² + β² = (α + β)² − 2αβ.'],
          why: { q: 'Why not just solve for α and β first?', o: ['You could, but the roots are surds here. Sum and product get there faster with less risk', 'Because this quadratic cannot be solved', 'Because α and β are always whole numbers'],
            fb: ['Right. The roots are 2 ± √2. Squaring those is slow and easy to get wrong.', 'It can be solved with the formula. It is just slower.', 'They are not whole numbers here: they are 2 ± √2.'] }
        }
      ]
    }
  ]
};

/* ═════════ Pilot content: Circle Theorems, inside Angles, Triangles and Circles ═════════ */
/* a Version 0 part as beats: the idea, the worked example, then the try-it with feedback for every option */
function legacyPart(x, fb, why) {
  const y = x.tryit;
  return { title: x.title, beats: [
    { k: 'idea', idea: x.idea, g: x.g, cap: x.cap, rules: x.rules },
    { k: 'fade', lv: 'full', q: x.ex.q, g: x.ex.g, steps: x.ex.steps.map(([m, w]) => ({ m, why: w })) },
    { k: 'check', q: y.q, g: y.g, given: y.given, ask: y.ask, o: y.o, a: y.a, fb, h: [y.h], why }
  ] };
}
const CIRC = (pts, segs, marks, label) => ['circ', { pts, segs, marks, label }];
(() => {
  const G = topic('geom').parts;
  IL.geom = {
    title: 'Angles, Triangles and Circles',
    goals: ['Use angle facts for straight lines, parallel lines and triangles', 'Find angles and the number of sides of polygons', 'Apply the circle theorems, and know when each one applies', 'Use the intersecting chords rule and know which angles can be constructed'],
    parts: [
      legacyPart(G[0], ['55° is the interior angle you were given. y is the other one.', 'Check: 55° + 65° = 120°, not 130°.', 'y = 130° − 55° = 75°.', '125° is bigger than the exterior angle itself. The two interior angles have to share the 130°.'],
        { q: 'Why does the exterior angle equal the two opposite interior angles added together?', o: ['The exterior angle and the third interior angle make 180°, and so do all three interior angles', 'Because the triangle is isosceles', 'It is only true when the exterior angle is 130°'],
          fb: ['Yes. Both totals are 180° and both include the third angle, so what is left must match.', 'It works for every triangle, isosceles or not.', 'It works for every exterior angle of every triangle.'] }),
      {
        title: 'Polygons',
        beats: [
          { k: 'idea', idea: `From one corner of a polygon with n sides you can draw lines that cut it into n − 2 triangles. Each triangle holds 180°. That is where the angle total comes from.`,
            rules: [`Interior angles of an n-sided polygon add up to (n − 2) × 180°.`, `Exterior angles of any polygon add up to 360°.`, `In a regular polygon every exterior angle is 360° ÷ n.`] },
          { k: 'fade', lv: 'full', q: G[1].ex.q, steps: G[1].ex.steps.map(([m, w]) => ({ m, why: w })) },
          { k: 'check', q: `Find the sum of the interior angles of a hexagon (6 sides).`, o: ['720°', '540°', '1080°', '360°'],
            fb: ['(6 − 2) × 180° = 4 × 180° = 720°.', '540° is for a pentagon, which has 5 sides.', '1080° is 6 × 180°. Use n − 2, not n.', '360° is the total of the exterior angles, for any polygon.'],
            h: ['Use (n − 2) × 180° with n = 6.', '6 − 2 = 4. Now work out 4 × 180°.'],
            why: { q: 'Why n − 2 and not n?', o: ['From one corner you can only cut the polygon into n − 2 triangles', 'Two of the angles are always right angles', 'It was chosen to make the hexagon come out right'],
              fb: ['Right. Try it with a square: one diagonal gives 2 triangles, and 4 − 2 = 2.', 'Most polygons have no right angles at all.', 'It works for every polygon. Check it on a triangle: (3 − 2) × 180° = 180°.'] } }
        ]
      },
      {
        title: 'The angle at the centre',
        beats: [
          {
            k: 'explore', xp: 'circ', title: 'Centre and circumference',
            intro: `O is the centre. The green angle is at the centre and the gold angle is at P, on the circumference. Both open onto the same two points A and B.`,
            predict: {
              q: `Right now the angle at the centre is 100°. If you slide P along the big arc, what happens to angle APB?`,
              o: ['It stays at 50° wherever P is on that arc', 'It gets bigger as P gets closer to A', 'It is always 100°, the same as the centre', 'It keeps changing as P moves'],
              fb: ['Wherever P sits on that arc, ∠APB is half of 100°.', 'It feels like it should, but the angle stays the same. The lines change length, not direction between them.', 'The angle at P is smaller: it is half of the angle at the centre.', 'It does not change, as long as P stays on the same arc.']
            },
            tasks: [
              { t: 'Slide P a long way round the big arc. Watch ∠APB.', ok: s => s.moved >= 60 && XP_circ_calc(s).cen < 180, say: `Still half of the angle at the centre. Wherever P sits on the big arc, ∠APB = ½ × ∠AOB.` },
              { t: 'Move A or B so that AB is a diameter.', ok: s => XP_circ_calc(s).minor === 180, say: `The angle at the centre is now a straight line, 180°. Half of it is 90°. That is the angle in a semicircle, the same rule again.` },
              { t: 'Now move P onto the small arc between A and B.', ok: s => XP_circ_calc(s).cen > 180, say: `The angle at P grew past 90°. It now faces the other arc, so the angle at the centre to use is the reflex one. Using 100° here is the exam trap.` },
              { t: 'Add point Q and put it on the same arc as P.', ok: s => s.showQ && XP_circ_calc(s).same, say: `∠AQB = ∠APB. Angles standing on the same arc, in the same segment, are equal.` }
            ],
            found: `Every angle at the circumference is half of the angle at the centre that stands on the same arc. Three theorems come from that one fact.`,
            rules: [`The angle at the centre is twice the angle at the circumference on the same arc.`, `Angles in the same segment are equal.`, `The angle in a semicircle is 90°.`]
          },
          {
            k: 'dayo', title: 'Why is it twice?',
            g: CIRC({ A: 208, B: 332, P: 100, E: 280 }, [['O', 'A'], ['O', 'B'], ['P', 'A'], ['P', 'B'], ['P', 'E']], [['A', 'O', 'P', 'x'], ['B', 'O', 'P', 'y']], 'Circle with centre O. Lines from P to A and B, from O to A and B, and a line from P through O to E on the far side. The angle OAP is marked x and the angle OBP is marked y'),
            cap: 'The line from P passes through O to E.',
            nodes: {
              start: { say: 'You saw that the centre angle is twice. Let us prove it, so you never need to memorise it. OA, OB and OP: what are they?', opts: [
                { t: 'Radii, so they are all equal', say: 'Yes. Every line from the centre to the circle is a radius.', next: 'iso' },
                { t: 'Diameters', say: 'A diameter goes right across the circle. OA only goes from the centre to the edge.' },
                { t: 'Chords', say: 'A chord joins two points on the circle. O is not on the circle.' }] },
              iso: { say: 'So in triangle OAP, OA = OP. The angle at A is x. What is the angle OPA?', opts: [
                { t: 'Also x, because the triangle is isosceles', say: 'Right. Equal sides face equal angles.', next: 'ext' },
                { t: '90°', say: 'Nothing here forces a right angle. Look at the two equal sides.' },
                { t: '180° − x', say: 'That would be the angle on a straight line with x. Which angles are equal in an isosceles triangle?' }] },
              ext: { say: 'Triangle OAP has angles x at A and x at P. Look at angle AOE, outside the triangle at O. What is it?', opts: [
                { t: 'x + x = 2x', say: 'Yes. The exterior angle equals the two opposite interior angles. The rule from Part 1.', next: 'add' },
                { t: 'x', say: 'Use the exterior angle rule from Part 1: it is the two opposite interior angles added together.' },
                { t: '180° − 2x', say: 'That is the angle inside the triangle at O. AOE is the one outside it, on the straight line PE.' }] },
              add: { say: 'The same happens in triangle OBP: the angle BOE is 2y. So the angle at the centre is 2x + 2y, and ∠APB is x + y. What is the link?', opts: [
                { t: 'The angle at the centre is twice ∠APB', say: '2x + 2y = 2(x + y). Proved.', next: 'end' },
                { t: 'They are equal', say: '2x + 2y and x + y are only equal if both are 0. Compare them again.' },
                { t: '∠APB is twice the angle at the centre', say: 'Which is bigger, 2x + 2y or x + y?' }] },
              end: { end: true, say: 'That is a real proof, and you built it from isosceles triangles. If the rule ever slips your mind in the exam hall, you can rebuild it in thirty seconds.' }
            }
          },
          {
            k: 'fade', lv: 'full', q: `O is the centre of the circle. ∠AOB = 136°. Find ∠APB.`,
            g: CIRC({ A: 202, B: 338, P: 90 }, [['O', 'A'], ['O', 'B'], ['P', 'A'], ['P', 'B']], [['O', 'A', 'B', '136°'], ['P', 'A', 'B', '?']], 'Circle with centre O. Angle AOB at the centre is 136°. P is on the major arc and angle APB is unknown'),
            steps: [
              { m: `∠AOB and ∠APB stand on the same arc AB`, why: `P is on the major arc, so both angles open onto the minor arc AB.`,
                ex: { q: 'Why check the arc first?', o: ['The twice rule only works when both angles stand on the same arc', 'Examiners give marks for long working', 'Because O is the centre'],
                  fb: ['Yes. If P were on the minor arc you would need the reflex angle at O.', 'Multiple-choice exams give no marks for working. Checking stops you falling into the trap.', 'O being the centre is why the rule exists, but you still have to check the arcs match.'] } },
              { m: `∠AOB = 2 × ∠APB`, why: `The angle at the centre is twice the angle at the circumference.` },
              { m: `∠APB = 136° ÷ 2 = 68°`, why: `Halve the angle at the centre.` }
            ]
          }
        ]
      },
      {
        title: 'Cyclic quadrilaterals',
        beats: [
          {
            k: 'explore', xp: 'cyc', title: 'Four corners on a circle',
            intro: `A cyclic quadrilateral has all four corners on a circle. Drag the corners and watch the opposite angles: A with C in gold, B with D in blue.`,
            predict: {
              q: `ABCD is a cyclic quadrilateral and ∠A = 70°. What is ∠C, the angle opposite A?`,
              o: ['110°', '70°', '140°', '35°'],
              fb: ['Opposite angles of a cyclic quadrilateral add up to 180°.', 'Opposite angles are equal in a parallelogram, not in every cyclic quadrilateral.', '140° is the angle at the centre on that arc. ∠C is at the circumference.', '35° is half of 70°. Halving is for the centre rule, not for opposite corners.']
            },
            tasks: [
              { t: 'Drag B or D so that ∠A is bigger than 120°.', ok: s => XP_cyc_ang(s).A > 120, say: `∠C shrank by exactly as much as ∠A grew. Together they are still 180°.` },
              { t: 'Make ∠A exactly 90°. Where do B and D have to be?', ok: s => XP_cyc_ang(s).A === 90, say: `B and D are now the two ends of a diameter, so ∠A and ∠C are both angles in a semicircle.` },
              { t: 'Drag A along its arc. Does ∠A change?', ok: s => s.movedA >= 30, say: `It does not. A stays on the same arc, so it stands on the same chord BD. Same segment, same angle.` },
              { t: 'Show the exterior angle at C.', ok: s => s.ext, say: `The exterior angle at C equals the interior angle at A, the opposite corner. Both are 180° minus ∠BCD.` }
            ],
            found: `In any cyclic quadrilateral the opposite angles add up to 180°. An exterior angle equals the interior angle at the opposite corner.`,
            rules: [`Opposite angles of a cyclic quadrilateral add up to 180°.`, `An exterior angle of a cyclic quadrilateral equals the interior opposite angle.`]
          },
          {
            k: 'dayo', title: 'Why 180°?',
            nodes: {
              start: { say: 'Here is why it always works. Join A and C to the centre O. That makes two angles at O, one for each arc between A and C. What do those two angles add up to?', opts: [
                { t: '360°', say: 'Yes. They go all the way round O.', next: 'half' },
                { t: '180°', say: 'Those two angles go all the way round the point O. What do angles at a point add up to?' },
                { t: '90°', say: 'Picture a full turn around O. How many degrees is that?' }] },
              half: { say: '∠B stands on one of those arcs and ∠D stands on the other. Each one is what fraction of the angle at the centre on its arc?', opts: [
                { t: 'Half', say: 'Right. The angle at the centre is twice the angle at the circumference.', next: 'sum' },
                { t: 'Double', say: 'Other way round. The angle at the centre is the big one.' },
                { t: 'The same', say: 'Remember the explorer: 100° at the centre, 50° at P.' }] },
              sum: { say: 'So ∠B + ∠D is half of 360°. That is?', opts: [
                { t: '180°', say: 'And that is the cyclic quadrilateral rule, proved.', next: 'end' },
                { t: '360°', say: 'Half of 360°, not all of it.' },
                { t: '90°', say: 'Half of 360 is not 90. Try again.' }] },
              end: { end: true, say: 'You did not just memorise a rule. You built it from the centre rule. Two theorems, one idea.' }
            }
          }
        ]
      },
      {
        title: 'Using the circle theorems',
        beats: [
          {
            k: 'fade', lv: 'one', q: `ABCD is a cyclic quadrilateral. ∠ABC = 3x and ∠ADC = x + 20°. Find x.`,
            g: CIRC({ A: 200, B: 260, C: 320, D: 80 }, [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']], [['B', 'A', 'C', '3x'], ['D', 'C', 'A', 'x + 20°']], 'Cyclic quadrilateral ABCD. Angle ABC is 3x and angle ADC is x + 20 degrees'),
            steps: [
              { m: `∠ABC + ∠ADC = 180°`, why: `B and D are opposite corners of a cyclic quadrilateral.` },
              { m: `3x + x + 20° = 180°`, why: `Put in the expressions.` },
              { m: `4x = 160°`, why: `Collect the x terms and take 20° from both sides.` },
              { ask: 'x = ?', o: ['40°', '45°', '160°', '50°'], m: `x = 40°`, why: `Divide both sides by 4.`,
                fb: ['4x = 160°, so x = 40°. Check: 120° + 60° = 180°.', '45° would need 4x = 180°. You forgot to take away the 20°.', '160° is 4x, not x.', 'Check: 4 × 50° = 200°, too big.'], h: ['Divide both sides by 4.'] }
            ]
          },
          {
            k: 'fade', lv: 'solo', q: `AB is a diameter of the circle. P is on the circle and ∠PAB = 35°. Find ∠PBA.`,
            g: CIRC({ A: 180, B: 0, P: 70 }, [['A', 'B'], ['P', 'A'], ['P', 'B']], [['A', 'P', 'B', '35°'], ['B', 'A', 'P', '?']], 'Circle with diameter AB through the centre O. P is on the circle. Angle PAB is 35 degrees and angle PBA is unknown'),
            steps: [
              { ask: '∠APB = ?', o: ['90°', '35°', '180°', '70°'], m: `∠APB = 90°`, why: `The angle in a semicircle.`,
                fb: ['AB is a diameter, so the angle at P is 90°.', 'That is ∠PAB. Look at the angle at P.', 'The angle on the straight line AB is 180°, but P is not on that line.', '70° would be twice 35°. That is the centre rule, but O is not a corner here.'],
                h: ['AB is a diameter. Which theorem talks about diameters?', 'The angle in a semicircle is 90°.'] },
              { ask: '∠PBA = ?', o: ['55°', '35°', '145°', '65°'], m: `∠PBA = 180° − 90° − 35° = 55°`, why: `Angles in triangle APB add up to 180°.`,
                fb: ['180° − 90° − 35° = 55°.', 'The two angles at A and B are not equal here.', '145° = 180° − 35°. You forgot the 90°.', 'Check: 90° + 35° + 65° = 190°, too much.'],
                h: ['You know two angles of triangle APB.', 'Angles in a triangle add up to 180°.'] }
            ]
          },
          {
            k: 'spot', who: 'Kemi', q: `O is the centre. ∠AOB = 110° and P is on the minor arc AB. Find ∠APB.`,
            g: CIRC({ A: 215, B: 325, P: 270 }, [['O', 'A'], ['O', 'B'], ['P', 'A'], ['P', 'B']], [['O', 'A', 'B', '110°'], ['P', 'A', 'B', '?']], 'Circle with centre O. Angle AOB is 110 degrees. P is on the minor arc AB, below the chord, and angle APB is unknown'),
            lines: ['∠AOB = 2 × ∠APB', '110° = 2 × ∠APB', '∠APB = 55°'], bad: 0,
            okfb: ['If line 1 were right, this line would follow from it.', '110 ÷ 2 = 55, so the arithmetic is fine. The mistake is earlier.'],
            o: ['P is on the minor arc, so ∠APB stands on the other arc. The rule needs the reflex angle, 250°', 'She should have doubled 110° instead of halving it', 'The angle at the centre is half the angle at the circumference', 'Nothing. 55° is right'],
            fb: ['That is the trap from the explorer.', 'Doubling would give 220°. The rule is right; the angle she used is not.', 'Other way round: the centre angle is the bigger one.', 'Look at the diagram: ∠APB is clearly more than 90°.'],
            h: ['Look at the diagram. Is ∠APB acute or obtuse?', 'Which arc does ∠APB stand on? Is it the same arc as the 110°?'],
            fix: 'Reflex ∠AOB = 360° − 110° = 250°, so ∠APB = 250° ÷ 2 = 125°.'
          },
          {
            k: 'check', q: `O is the centre of the circle and ∠OAB = 28°. Find the angle marked x.`,
            g: CIRC({ A: 208, B: 332, P: 100 }, [['O', 'A'], ['O', 'B'], ['A', 'B'], ['P', 'A'], ['P', 'B']], [['A', 'O', 'B', '28°'], ['P', 'A', 'B', 'x']], 'Circle with centre O. Triangle OAB with angle OAB marked 28 degrees. P is on the major arc and angle APB is marked x'),
            o: ['62°', '124°', '56°', '28°'],
            fb: ['OA = OB, so ∠OBA = 28° too. Then ∠AOB = 180° − 56° = 124°, and x = 124° ÷ 2 = 62°.', '124° is ∠AOB, the angle at the centre. x is half of it.', '56° is the two base angles together. Use them to find ∠AOB first.', '28° is a base angle of triangle OAB, not the angle at P.'],
            h: ['OA and OB are both radii. What kind of triangle is OAB?', 'It is isosceles, so ∠OBA = 28° too. Find ∠AOB.', '∠AOB = 180° − 56° = 124°. Now use the centre rule.'],
            why: { q: 'Why is ∠OBA also 28°?', o: ['OA and OB are radii, so triangle OAB is isosceles', 'Because AB is a diameter', 'All angles in a circle are equal'],
              fb: ['Right. Two radii make an isosceles triangle with the chord. Exams use this a lot.', 'AB does not pass through O, so it is not a diameter.', 'They are not. It is the equal radii that make these two equal.'] }
          }
        ]
      },
      legacyPart(G[2], ['All three sides are equal, so all three angles are equal: 180° ÷ 3 = 60°.', '45° comes from bisecting 90°. Nothing is bisected here.', 'An equilateral triangle has no right angle.', '30° is half of 60°. You would get it by bisecting, but nothing was bisected here.'])
    ]
  };
})();

/* ═════════ Pilot content: Probability ═════════ */
IL.prob = {
  parts: [
    {
      title: 'Chance as a fraction',
      beats: [
        {
          k: 'explore', xp: 'bag', title: 'A bag of balls',
          intro: `Probability measures how likely something is, from 0 (impossible) to 1 (certain). When every outcome is equally likely, you can find it by counting. Then you can test it by drawing.`,
          predict: {
            q: `The bag has 3 red balls and 1 blue ball. You draw a ball, put it back, and repeat 100 times. About how many reds will you get?`,
            o: ['About 75', 'Exactly 75', 'About 50', 'About 25'],
            fb: ['P(red) = ¾, and ¾ of 100 is 75. You will rarely get exactly 75, but you will land near it.', 'Chance does not promise an exact number. 75 is what you expect, but 71 or 78 are perfectly normal.', 'Red and blue are not equally likely. There are 3 reds and only 1 blue.', '25 is how many blues to expect.']
          },
          tasks: [
            { t: 'Draw 100 times. How close did you get to your prediction?', ok: s => s.n >= 100, say: `See how the share of reds lands near P(red)? Probability tells you what to expect over many tries, not exactly what will happen.` },
            { t: 'Change the bag so that P(red) is exactly ½.', ok: s => s.r + s.b + s.g > 0 && 2 * s.r === s.r + s.b + s.g, say: `Half the balls are red. P(red) = ½ means red and not red are equally likely.` },
            { t: 'Make picking a red ball impossible.', ok: s => s.r === 0 && s.b + s.g > 0, say: `P(red) = 0. No red ball, no chance at all.` },
            { t: 'Make picking a red ball certain.', ok: s => s.r > 0 && s.b + s.g === 0, say: `P(red) = 1. Every ball is red, so it must happen.` }
          ],
          found: `P(red) is the number of red balls divided by the total number of balls. Draw many times and the share of reds settles close to it.`,
          rules: [`P(event) = number of favourable outcomes ÷ total number of outcomes.`, `0 ≤ P ≤ 1. An impossible event has probability 0 and a certain event has probability 1.`]
        },
        {
          k: 'dayo', title: 'The chance it does not happen',
          nodes: {
            start: { say: 'A fair die is thrown. What is the probability of getting a 6?', opts: [
              { t: fr(1, 6), say: 'Yes: one 6 out of six equally likely faces.', next: 'not' },
              { t: fr(1, 2), say: 'Half would mean 6 comes up as often as all the other numbers put together. How many faces does a die have?' },
              { t: '6', say: 'A probability can never be more than 1. It is one face out of how many?' }] },
            not: { say: 'Now the probability of <b>not</b> getting a 6. You could count 1, 2, 3, 4, 5. Is there a faster way using the ⅙?', opts: [
              { t: `1 − ${fr(1, 6)} = ${fr(5, 6)}`, say: 'That is it.', next: 'why' },
              { t: `${fr(1, 6)} − 1`, say: 'That gives a negative number, and a probability is never negative. Which way round should it be?' },
              { t: '6 ÷ 1 = 6', say: 'Bigger than 1 is impossible for a probability.' }] },
            why: { say: 'Why does 1 − P(6) work?', opts: [
              { t: 'Every throw is either a 6 or not a 6, so the two chances add up to 1', say: 'Exactly. Something has to happen, and certain means 1.', next: 'end' },
              { t: 'Because the die is fair', say: 'Fair matters for the ⅙, but this rule works for unfair dice too. Think about what "6" and "not 6" cover between them.' },
              { t: 'Because 6 is the biggest number on the die', say: 'It works for "not a 3" too. What do "6" and "not 6" cover between them?' }] },
            end: { end: true, say: 'Keep this one close. It saves you time on "not" questions, and it is the key to "at least one" questions later in this lesson.' }
          }
        },
        {
          k: 'fade', lv: 'full', q: `A bag holds 5 red, 3 blue and 4 green balls. One ball is picked at random. Find the probability that it is not blue.`,
          steps: [
            { m: `Total = 5 + 3 + 4 = 12 balls`, why: `Count every possible outcome.` },
            { m: `P(blue) = ${fr(3, 12)} = ${fr(1, 4)}`, why: `3 of the 12 balls are blue.` },
            { m: `P(not blue) = 1 − ${fr(1, 4)} = ${fr(3, 4)}`, why: `Take P(blue) away from 1.` }
          ]
        },
        {
          k: 'fade', lv: 'one', q: `A letter is chosen at random from the word BANANA. Find the probability that it is not A.`,
          steps: [
            { m: `Total = 6 letters`, why: `B, A, N, A, N, A.` },
            { m: `P(A) = ${fr(3, 6)} = ${fr(1, 2)}`, why: `3 of the 6 letters are A.` },
            { ask: 'P(not A) = ?', o: [fr(1, 2), fr(1, 3), fr(2, 3), fr(5, 6)], m: `P(not A) = 1 − ${fr(1, 2)} = ${fr(1, 2)}`, why: `Take P(A) away from 1. Check: B, N, N are 3 of the 6 letters.`,
              fb: ['1 − ½ = ½. The other letters, B, N and N, are also 3 out of 6.', 'There are 3 letters that are not A, out of 6.', 'There are 3 letters that are not A, not 4.', 'That would be "not B". Every A must be left out.'], h: ['Use 1 − P(A).'] }
          ]
        },
        {
          k: 'fade', lv: 'solo', q: `A bag holds 4 red, 6 white and 2 black balls. Find the probability that a ball picked at random is not black.`,
          steps: [
            { ask: 'Total number of balls', o: ['12', '10', '6', '8'], m: `Total = 4 + 6 + 2 = 12`, why: `Count every ball.`,
              fb: ['4 + 6 + 2 = 12.', 'Count the black balls too.', 'That is only the white balls.', 'Add all three colours.'], h: ['Add all three colours.'] },
            { ask: 'P(black) = ?', o: [fr(1, 6), fr(2, 10), fr(1, 2), fr(1, 12)], m: `P(black) = ${fr(2, 12)} = ${fr(1, 6)}`, why: `2 of the 12 balls are black.`,
              fb: ['2 out of 12 = ⅙.', 'The total is 12, not 10.', 'Only 2 of the 12 balls are black.', 'There are 2 black balls, not 1.'], h: ['How many black balls are there, out of how many?'] },
            { ask: 'P(not black) = ?', o: [fr(5, 6), fr(1, 6), fr(10, 6), fr(4, 6)], m: `P(not black) = 1 − ${fr(1, 6)} = ${fr(5, 6)}`, why: `Take P(black) away from 1.`,
              fb: ['1 − ⅙ = ⅚. Check: 10 of the 12 balls are not black.', 'That is P(black). You want the opposite.', 'A probability cannot be bigger than 1.', 'Count again: 10 of the 12 balls are not black, and that is ⅚.'], h: ['Use 1 − P(black).'] }
          ]
        },
        {
          k: 'spot', who: 'Femi', q: `A bag holds 3 red and 5 blue balls. One ball is picked at random. Find P(red).`,
          lines: ['Red balls: 3', 'Blue balls: 5', `P(red) = ${fr(3, 5)}`], bad: 2,
          okfb: ['There are 3 red balls. That is right.', 'There are 5 blue balls. That is right.'],
          o: ['He divided by the number of blue balls instead of the total', 'He should have added 3 and 5 to get the answer', `P(red) should be ${fr(5, 8)}`, 'Nothing is wrong'],
          fb: ['Yes. 3 to 5 compares red with blue. Probability compares red with all the balls.', '3 + 5 = 8 is the total, but it goes underneath, not as the answer.', 'That is P(blue).', `There are 8 balls, so ${fr(3, 5)} cannot be right.`],
          h: ['How many balls are in the bag altogether?'],
          fix: `Total = 3 + 5 = 8, so P(red) = ${fr(3, 8)}.`
        }
      ]
    },
    {
      title: 'Two dice: or, and',
      beats: [
        {
          k: 'explore', xp: 'dice', title: 'The 36 outcomes',
          intro: `Throw two dice and there are 6 × 6 = 36 equally likely outcomes. The grid shows the total for each one. Light up the squares that fit, then count.`,
          predict: {
            q: `Two fair dice are thrown and the scores are added. Which total is most likely?`,
            o: ['7', '12', 'They are all equally likely', '2'],
            fb: ['7 can be made 6 ways: 1 + 6, 2 + 5, 3 + 4, 4 + 3, 5 + 2 and 6 + 1.', '12 needs 6 and 6. That is only 1 way out of 36.', 'Every square is equally likely, but the totals are not: some totals fill more squares.', '2 needs 1 and 1. That is only 1 way out of 36.']
          },
          tasks: [
            { t: 'Find a total that can only happen one way.', ok: s => s.mode === 'tot' && (s.n === 2 || s.n === 12), say: `1 square out of 36. The corners are the rarest totals.` },
            { t: 'Find P(total of 7).', ok: s => s.mode === 'tot' && s.n === 7, say: `6 squares out of 36, which is ⅙. The long diagonal is why 7 is the most likely total.` },
            { t: 'Switch to "At least one 6". How many squares?', ok: s => s.mode === 'six', say: `11 squares, not 12. The square 6 and 6 is counted once. That is why P(at least one 6) is not ⅙ + ⅙.` }
          ],
          found: `With two dice, count the squares that fit and divide by 36. When two events can happen together, adding their probabilities counts the overlap twice.`,
          rules: [`Or, for events that cannot happen together: P(A or B) = P(A) + P(B).`, `If they can happen together, list the outcomes once each so nothing is counted twice.`, `And, for events that do not affect each other: P(A and B) = P(A) × P(B).`]
        },
        {
          k: 'spot', who: 'Sola', q: `A fair die is thrown once. Find the probability of an even number or a number greater than 4.`,
          lines: [`Even numbers: 2, 4, 6. P(even) = ${fr(3, 6)}`, `Greater than 4: 5, 6. P(greater than 4) = ${fr(2, 6)}`, `P(even or greater than 4) = ${fr(3, 6)} + ${fr(2, 6)} = ${fr(5, 6)}`], bad: 2,
          okfb: ['This line is right: 3 even numbers out of 6.', 'This line is right: 5 and 6 are greater than 4.'],
          o: ['6 is counted twice. The events overlap, so she cannot just add', `P(greater than 4) should be ${fr(1, 6)}`, 'For "or" you should multiply', 'Nothing is wrong'],
          fb: ['Yes. 6 is even and greater than 4, so it sits in both lists.', 'Both 5 and 6 are greater than 4.', 'Multiplying is for "and" with events that do not affect each other.', 'List the outcomes that fit: 2, 4, 5, 6. That is 4, not 5.'],
          h: ['Write down every number that is even or greater than 4. How many are there?', 'Is any number in both lists?'],
          fix: `List each outcome once: 2, 4, 5, 6. That is 4 out of 6, so P = ${fr(4, 6)} = ${fr(2, 3)}.`
        },
        {
          k: 'check', q: `A coin is tossed and a die is thrown. Find the probability of a head and an even number.`,
          o: [fr(1, 4), '1', fr(1, 12), fr(1, 8)],
          fb: [`P(head) = ½ and P(even) = ${fr(3, 6)} = ½. Multiply: ½ × ½ = ¼.`, 'That is ½ + ½. For "and", with events that do not affect each other, multiply.', `${fr(1, 12)} is the chance of a head and one particular number. There are three even numbers.`, 'P(even) is ½, not ¼. The even numbers are 2, 4 and 6: three of the six.'],
          h: ['Find P(head) and P(even) separately.', 'The coin cannot affect the die, so multiply the two.'],
          why: { q: 'Why multiply here?', o: ['The coin cannot affect the die. Half the time you get a head, and half of those times the die is even too', 'Because "and" always means add', 'Because the numbers are fractions'],
            fb: ['Right. Half the time you get a head, and in half of those you also get an even number: ½ of ½.', '"And" means multiply, for events that do not affect each other. "Or" is the one that adds.', 'Fractions have nothing to do with it. You multiply because the coin and the die do not affect each other.'] }
        }
      ]
    },
    {
      title: 'Without replacement: trees',
      beats: [
        {
          k: 'explore', xp: 'tree', title: 'Two picks from a bag',
          intro: `When you pick twice, a tree diagram shows every path. The fractions on the second branches depend on whether the first ball went back in.`,
          predict: {
            q: `A bag has 3 red and 2 blue balls. You pick one, keep it, then pick again. Is P(second ball is red) still ${fr(3, 5)}?`,
            o: ['No. It depends on what came out first', `Yes. It is always ${fr(3, 5)}`, `No. It is always ${fr(2, 4)}`, 'Yes, because it is the same bag'],
            fb: ['The bag has changed: there are 4 balls left, and how many are red depends on the first pick.', `That is only true if the first ball goes back in.`, `${fr(2, 4)} is right only when the first ball was red. After a blue, it is ${fr(3, 4)}.`, 'It is the same bag, but not the same balls. One is in your hand.']
          },
          tasks: [
            { t: 'Turn "put back" on and watch the second-pick fractions.', ok: s => s.rep, say: `Put back means the bag is full again for the second pick, so the second fractions match the first.` },
            { t: 'Turn it off again, then find P(both red) for 3 red and 2 blue.', ok: s => s.toggled && !s.rep && s.r === 3 && s.b === 2 && s.pick === 'rr', say: `${fr(3, 5)} × ${fr(2, 4)} = ${fr(6, 20)} = ${fr(3, 10)}. One red is gone, so the second pick is 2 out of 4.` },
            { t: 'Choose "One of each". Why do two paths light up?', ok: s => s.pick === 'mix', say: `Red then blue, and blue then red, are different paths to the same result. Multiply along each path, then add the paths.` }
          ],
          found: `Multiply along a path. Add different paths that give the same result. Without replacement, the second-pick fractions have a total one less than the first.`,
          rules: [`On a tree diagram, multiply along the branches. Add the results of different paths.`, `Without replacement, the bag has one fewer item for the second pick. Change the fractions.`]
        },
        {
          k: 'fade', lv: 'full', q: `A bag holds 3 red and 2 blue balls. Two balls are picked one after the other, without replacement. Find the probability that both are red.`, g: TREE,
          steps: [
            { m: `P(first is red) = ${fr(3, 5)}`, why: `3 of the 5 balls are red.` },
            { m: `P(second is red) = ${fr(2, 4)}`, why: `One red ball is gone, so 2 red balls are left out of 4.`,
              ex: { q: 'Why is it out of 4 now?', o: ['The first ball was not put back, so only 4 are left', 'Because there are 4 blue and red balls together', 'Because the second pick is always out of 4'],
                fb: ['Right. Without replacement, the total drops by one.', 'There were 5 balls. One is now in your hand.', 'It depends on the bag. With 10 balls it would be out of 9.'] } },
            { m: `P(both red) = ${fr(3, 5)} × ${fr(2, 4)} = ${fr(6, 20)} = ${fr(3, 10)}`, why: `Multiply along the branches.` }
          ]
        },
        {
          k: 'fade', lv: 'two', q: `A box holds 4 good bulbs and 2 bad bulbs. Two bulbs are picked without replacement. Find the probability that both are bad.`,
          steps: [
            { m: `P(first is bad) = ${fr(2, 6)}`, why: `2 of the 6 bulbs are bad.` },
            { ask: 'P(second is bad) = ?', o: [fr(1, 5), fr(2, 6), fr(2, 5), fr(1, 6)], m: `P(second is bad) = ${fr(1, 5)}`, why: `One bad bulb is gone: 1 bad bulb left out of 5.`,
              fb: ['1 bad bulb left, out of 5.', 'That is the first pick. The box has changed.', 'Only 1 bad bulb is left, because the first one was bad.', 'There are 5 bulbs left, not 6.'], h: ['After taking out one bad bulb, how many bad bulbs are left?', 'And how many bulbs altogether?'] },
            { ask: 'P(both bad) = ?', o: [fr(1, 15), fr(1, 9), fr(2, 15), fr(1, 30)], m: `P(both bad) = ${fr(2, 6)} × ${fr(1, 5)} = ${fr(2, 30)} = ${fr(1, 15)}`, why: `Multiply along the branches.`,
              fb: ['Two-sixths times one-fifth is two-thirtieths, which is one-fifteenth.', `${fr(1, 9)} = ${fr(2, 6)} × ${fr(2, 6)}. That is with replacement.`, `${fr(2, 15)} = ${fr(2, 6)} × ${fr(2, 5)}. The second pick has only 1 bad bulb.`, `Use ${fr(2, 6)} for the first pick, not ${fr(1, 6)}.`], h: ['Multiply the two fractions, then simplify.'] }
          ]
        },
        {
          k: 'fade', lv: 'solo', q: `A bag holds 5 red and 3 green sweets. Two are taken without replacement. Find the probability of getting one of each colour.`,
          steps: [
            { ask: 'P(red, then green)', o: [`${fr(5, 8)} × ${fr(3, 7)} = ${fr(15, 56)}`, `${fr(5, 8)} × ${fr(3, 8)} = ${fr(15, 64)}`, `${fr(5, 8)} × ${fr(2, 7)} = ${fr(10, 56)}`, `${fr(5, 8)} + ${fr(3, 7)}`], m: `P(red, then green) = ${fr(5, 8)} × ${fr(3, 7)} = ${fr(15, 56)}`, why: `After a red, all 3 greens are left, out of 7.`,
              fb: ['Right.', 'Without replacement, the second pick is out of 7.', 'A red came out, so all 3 green sweets are still there.', 'Along one path you multiply.'], h: ['First pick: 5 of 8 are red.', 'Second pick: 7 sweets left, and all 3 greens are still in.'] },
            { ask: 'P(green, then red)', o: [`${fr(3, 8)} × ${fr(5, 7)} = ${fr(15, 56)}`, `${fr(3, 8)} × ${fr(5, 8)} = ${fr(15, 64)}`, `${fr(3, 8)} × ${fr(2, 7)} = ${fr(6, 56)}`, `${fr(3, 8)} × ${fr(4, 7)} = ${fr(12, 56)}`], m: `P(green, then red) = ${fr(3, 8)} × ${fr(5, 7)} = ${fr(15, 56)}`, why: `After a green, all 5 reds are left, out of 7.`,
              fb: ['Right. Same answer as the other order.', 'Out of 7 for the second pick, not 8.', `${fr(2, 7)} is a second green. You want a red.`, 'A green came out, so all 5 reds are still there.'], h: ['First pick: 3 of 8 are green.', 'Second pick: 7 left, and all 5 reds are still in.'] },
            { ask: 'P(one of each)', o: [`${fr(30, 56)} = ${fr(15, 28)}`, fr(15, 56), fr(225, 3136), fr(1, 2)], m: `P(one of each) = ${fr(15, 56)} + ${fr(15, 56)} = ${fr(30, 56)} = ${fr(15, 28)}`, why: `Two different paths give "one of each", so add them.`,
              fb: ['Add the two paths and simplify.', 'That is only one order. Red then green and green then red both count.', 'Multiplying the paths gives the chance of both paths happening, which is impossible in one go. Add different paths.', `Close, but ${fr(15, 28)} is a little more than a half.`], h: ['Which paths give one of each colour?', 'Different paths that give the same result are added.'] }
          ]
        },
        {
          k: 'check', q: `The probability that a seed grows is 0.8. Two seeds are planted. Find the probability that at least one of them grows.`,
          o: ['0.96', '0.64', '0.8', '1.6'],
          fb: ['P(neither grows) = 0.2 × 0.2 = 0.04, so P(at least one) = 1 − 0.04 = 0.96.', '0.64 is the chance that both grow. "At least one" also counts exactly one growing.', '0.8 is the chance for one seed. Two seeds give more chances.', 'A probability can never be above 1. Adding 0.8 + 0.8 counts the "both grow" case twice.'],
          h: ['"At least one" has many cases. What is the only case that is not "at least one"?', 'The only failing case is "neither grows". Find P(neither).', 'P(neither) = 0.2 × 0.2 = 0.04. Take it from 1.'],
          why: { q: 'Why use 1 − P(neither)?', o: ['"At least one" and "neither" cover every outcome with no overlap, so they add up to 1', 'Because 0.8 is close to 1', 'Because the seeds are independent'],
            fb: ['Right. The same idea as P(not A) = 1 − P(A), from Senior Dayo in Part 1.', 'It works whatever the probability is.', 'Independence is why you can multiply 0.2 × 0.2. The 1 − idea comes from somewhere else.'] }
        }
      ]
    }
  ]
};

const W3 = (q, o, fb) => ({ q, o, fb });
const LX = {
  bases: {
    fb: [['Check the middle product: 3 × 4 = 12, so the total is 16 + 12 + 2.', 'The middle digit is 3, and 3 × 4 = 12, not 8.', '', 'Add the three products again: 16 + 12 + 2.'],
      ['That is base ten addition. The digit 7 cannot appear in base 5: carry as soon as a column reaches 5.', 'Check the fives column: 3 + 2 + 1 carried = 6, which is one 5 and 1 left. Write 1.', 'The units column gives 2: 4 + 3 = 7, which is one 5 and 2 left.', ''],
      ['', '30 ≡ 2 (mod 7), so count 2 days on from Tuesday, not 1.', 'Tuesday comes back every 7 days, but 30 is not a multiple of 7. There are 2 days left over.', 'Two days after Tuesday: Wednesday, then Thursday.']],
    ex: [[0, W3('Why is the left digit worth 25?', ['It is in the third place, which is worth 5²', 'Because 2 × 5 = 10, plus 15', 'Because 25 is the biggest number in base 5'], ['Right. Places in base 5 are worth 1, 5, 25, 125 from the right.', 'Place values are powers of the base, not sums.', 'Base 5 numbers can be any size. The digit\'s place decides its value.'])],
      [3, W3('Why read the remainders from the bottom up?', ['The last remainder belongs to the biggest place value', 'Because division always goes upward', 'It does not matter which way you read them'], ['Yes. The first remainder is the units digit, so it goes last.', 'Division has no direction. It is about which place each remainder fills.', 'It matters a lot: 142 and 241 are different numbers.'])],
      [1, W3('Why do we only keep the 3?', ['In mod 5 only the remainder after dividing by 5 matters', 'Because 3 is smaller than 9', 'Because 9 × 5 is too big'], ['Exactly. Every full group of 5 counts as 0.', 'The 9 is the number of groups. Groups of 5 are thrown away in mod 5.', 'The size is not the point. Full groups of 5 count as nothing.'])]],
    spot: { part: 1, who: 'Ngozi', q: `Convert 29<sub>10</sub> to base 2.`, lines: ['29 ÷ 2 = 14 r 1, then 14 ÷ 2 = 7 r 0', '7 ÷ 2 = 3 r 1, 3 ÷ 2 = 1 r 1, 1 ÷ 2 = 0 r 1', 'Reading the remainders from top to bottom: 10111<sub>2</sub>'], bad: 2,
      okfb: ['These divisions are right.', 'These divisions are right too.'],
      o: ['She read the remainders downward. They must be read from the last one up', 'She divided by the wrong number', 'One of the remainders is wrong', 'Nothing is wrong'],
      fb: ['That is it. The first remainder is the units digit.', 'Dividing by 2 is right for base 2.', 'Every remainder is right. The order is the problem.', 'Check: 10111<sub>2</sub> = 16 + 4 + 2 + 1 = 23, not 29.'],
      h: ['Convert her answer back to base ten. Do you get 29?'], fix: 'Read upward: 11101<sub>2</sub>. Check: 16 + 8 + 4 + 0 + 1 = 29.' }
  },
  frac: {
    fb: [['', 'The digit after the 8 is 4, which is less than 5, so the 8 stays as it is.', 'That has only 1 significant figure.', 'That has only 2 significant figures.'],
      ['', 'That is the interest for one year. Multiply by the 3 years.', 'Check the zeros: 20,000 × 5 × 3 = 300,000, and 300,000 ÷ 100 = 3,000.', 'That is the amount at the end (principal plus interest). The question asks for the interest.']],
    ex: [[1, W3('Why divide by 2.5 and not by 2.4?', ['Percentage error compares the error with the true value', 'Because 2.5 is the bigger number', 'You can divide by either one'], ['Right. 2.5 m is the true length.', 'Size is not the reason. Always divide by the true or exact value.', 'Dividing by 2.4 gives a different answer. Use the true value.'])],
      [1, W3('Why divide by ₦40,000?', ['Profit percent is worked out on the cost price', 'Because it is the smaller number', 'Because the selling price is not known'], ['Yes. Profit and loss percentages are on what the trader paid.', 'The rule is cost price, whatever its size.', 'The selling price is known: ₦46,000. Profit percent still uses the cost price.'])]],
    spot: { part: 1, who: 'Emeka', q: `A shirt costs ₦8,000. Its price is reduced by 15%. Find the new price.`, lines: ['15% of ₦8,000 = 0.15 × 8,000', '= ₦1,200', 'New price = ₦8,000 + ₦1,200 = ₦9,200'], bad: 2,
      okfb: ['Finding 15% of the old price is the right start.', '0.15 × 8,000 = 1,200. Correct.'],
      o: ['A reduction is taken away, not added', '15% of 8,000 is not 1,200', 'He should have divided by 15', 'Nothing is wrong'],
      fb: ['That is it. The price went down, so subtract.', '0.15 × 8,000 is 1,200. That line is fine.', 'Percent means out of 100. Dividing by 15 is wrong.', 'A reduced price cannot be higher than the old one.'],
      h: ['Is the new price higher or lower than ₦8,000?'], fix: 'New price = ₦8,000 − ₦1,200 = ₦6,800.' }
  },
  indices: {
    fb: [['Check: 2<sup>3 + 1</sup> = 2⁴ = 16, not 32.', '', '5 is the value of x + 1. Take away 1.', 'You added 1 instead of taking it away.'],
      ['log<sub>10</sub> 10 = 1, but the number here is 100.', '', '10 is the base. The log is the power you raise 10 to.', '100 is the number inside the log. log<sub>10</sub> 100 = 2 because 10² = 100.'],
      ['', '10⁴ is for big numbers. A number smaller than 1 needs a negative power.', '50.7 is not between 1 and 10. Standard form has one non-zero digit before the point.', 'The point moved 4 places, not 3.']],
    ex: [[1, W3('Why does a negative index give "1 over" something?', ['A negative index means the reciprocal', 'Because negative numbers are less than 1', 'Because the index is a fraction'], ['Right: a<sup>−n</sup> = 1 ÷ a<sup>n</sup>.', 'The answer is not negative. The minus sign in the index means "flip".', 'The fraction part means a root. The minus sign is what flips it.'])],
      [0, W3('Why can you divide 54 by 2 here?', ['log a − log b = log (a ÷ b)', 'Because 54 is even', 'Logs can always be divided'], ['Yes. Subtracting logs of the same base means dividing the numbers.', 'Even or odd does not matter. It is the subtraction law.', 'Only when the logs are subtracted and have the same base.'])],
      [0, W3('Why change to base 2?', ['32 and 8 are both powers of 2, so both logs are easy', 'Because base 8 is not allowed', 'Base 2 always gives a smaller answer'], ['Exactly. log<sub>2</sub> 32 = 5 and log<sub>2</sub> 8 = 3.', 'Base 8 is allowed. Base 2 just makes the numbers easy.', 'The answer is the same whatever base you change to.'])]],
    spot: { part: 0, who: 'Musa', q: `Simplify (x³)⁴ × x².`, lines: ['(x³)⁴ = x⁷', 'x⁷ × x² = x⁹', 'Answer: x⁹'], bad: 0,
      okfb: ['If line 1 were right, adding 7 + 2 would be right here.', 'This follows from the lines above.'],
      o: ['A power of a power multiplies the indices: (x³)⁴ = x¹²', 'x⁷ × x² should be x¹⁴', 'He should have added all three numbers: x⁹', 'Nothing is wrong'],
      fb: ['That is it. (x³)⁴ means x³ × x³ × x³ × x³.', 'Multiplying powers adds the indices: x⁷ × x² = x⁹. That step is fine.', 'That is what he did, and it is wrong.', 'Write out (x³)⁴ in full and count the x\'s.'],
      h: ['Write (x³)⁴ as x³ × x³ × x³ × x³. How many x\'s is that?'], fix: '(x³)⁴ = x¹², and x¹² × x² = x¹⁴.' }
  },
  surds: {
    fb: [['', '8 still has a square factor, 4. Take out the largest square factor, 36.', '18 still has a square factor, 9. Use the largest square factor, 36.', '8 × 8 × 3 = 192, not 72.'],
      ['Multiply by the conjugate, 2 − √3. The top becomes 1 × (2 − √3).', '', 'The signs are swapped. The top is 2 − √3.', '4 is 2², from the bottom. The top is just 2 − √3.']],
    ex: [[0, W3('Why choose 16?', ['It is the largest perfect square that divides 48', 'Because 16 + 32 = 48', 'Any factor of 48 works the same'], ['Right. Taking the largest square out leaves the simplest surd.', 'We need a product, not a sum: 48 = 16 × 3.', 'Only square factors come out of the root.'])],
      [0, W3('Why multiply top and bottom by √3?', ['√3 × √3 = 3, which clears the root from the bottom', 'To make the top bigger', 'Because 6 is divisible by 3'], ['Yes. Multiplying top and bottom by the same thing does not change the value.', 'The size stays the same. The goal is a whole-number bottom.', 'That helps later, but it is not why we multiply by √3.'])]],
    spot: { part: 0, who: 'Bisi', q: `Simplify √50 − √18.`, lines: ['√50 − √18 = √(50 − 18)', '= √32', '= 4√2'], bad: 0,
      okfb: ['If line 1 were right, this would follow.', '√32 = √16 × √2 = 4√2. That step on its own is fine.'],
      o: ['You cannot subtract under one root sign. Simplify each surd first', '√32 is not 4√2', 'She should have added the surds', 'Nothing is wrong'],
      fb: ['That is it. √a − √b is not √(a − b).', '√32 = 4√2 is right.', 'The question says subtract.', 'Check with a calculator: √50 − √18 ≈ 2.83, but 4√2 ≈ 5.66.'],
      h: ['Is √9 − √4 the same as √5?'], fix: '√50 = 5√2 and √18 = 3√2, so √50 − √18 = 2√2.' }
  },
  sets: {
    fb: [['That is the number of elements, not subsets.', '2³ = 8 is for a set with 3 elements. This one has 4.', '', '24 = 4! counts arrangements. Subsets use 2ⁿ.'],
      ['You took away the overlap twice.', '', 'That counts the 4 elements in both sets twice.', 'The overlap is taken away, not added.']],
    ex: [[0, W3('What does P′ mean?', ['Everything in U that is not in P', 'Everything in P', 'The elements P and Q share'], ['Right. P′ is the complement of P.', 'That is P itself.', 'That is P ∩ Q.'])],
      [0, W3('Why take the 5 away from 40?', ['The 5 offer neither subject, so they are outside both circles', 'Because 5 is the smallest number', 'To get the number who offer both'], ['Yes. 35 students are inside the two circles.', 'Size has nothing to do with it.', 'Not yet. This step finds how many offer at least one subject.'])]],
    spot: { part: 1, who: 'Kunle', q: `In a group of 50 students, 30 like football and 25 like basketball. Every student likes at least one of them. How many like both?`, lines: ['n(F ∪ B) = 50', 'n(F ∩ B) = 30 + 25 + 50', '= 105'], bad: 1,
      okfb: ['Everyone likes at least one sport, so the union is all 50. Correct.', 'The adding is right. The line before it is not.'],
      o: ['The 50 should be taken away: n(F ∩ B) = n(F) + n(B) − n(F ∪ B)', 'n(F ∪ B) should be 55', 'He should multiply 30 and 25', 'Nothing is wrong'],
      fb: ['That is it.', 'Every student likes at least one sport, so the union is the whole group of 50.', 'Multiplying has no meaning here.', '105 people who like both, from a group of 50? Impossible.'],
      h: ['Can more students like both sports than there are students?'], fix: 'n(F ∩ B) = 30 + 25 − 50 = 5.' }
  },
  variation: {
    fb: [['That is 3 × 5. Square the 5 first: 3 × 25.', 'That is 3 × 10. x² means 5 × 5, not 5 × 2.', '', 'Check: 3 × 5² = 3 × 25 = 75.'],
      ['That only doubles 30. Both Q and R changed, so use P = 5 × 4 × 5.', '', 'Multiply all three: 5 × 4 × 5.', 'Check k: 30 ÷ (2 × 3) = 5, so P = 5 × 4 × 5 = 100.'],
      ['', 'A 100% decrease would make y zero. y only halves.', 'That is the change in x, not in y.', 'y halves, which is a 50% decrease.']],
    ex: [[1, W3('Why multiply 6 by 4 to find k?', ['When y = k ÷ x, k = y × x', 'Because 6 and 4 make 24', 'Because inverse means divide'], ['Right. Multiply both sides of 6 = k ÷ 4 by 4.', 'The numbers do make 24, but the reason is the rearranging.', 'Inverse puts x underneath. To get k alone you multiply.'])],
      [0, W3('Why y = a + bx?', ['"Partly constant" gives a, and "partly varies as x" gives bx', 'Because every graph is a straight line', 'Because there are always two unknowns'], ['Exactly. Each phrase becomes one term.', 'Only this kind of variation gives a straight line.', 'The two unknowns come from the two parts of the wording.'])],
      [1, W3('Where does the 1.21 come from?', ['(1.1)² = 1.21, because y depends on x squared', 'You add 1.1 and 0.11 for every variation', 'A 10% increase always becomes 21%'], ['Right. Square the multiplier, not the percentage.', 'That is not a rule. Square the multiplier 1.1.', 'Only when y varies as x². For y ∝ x it stays 10%.'])]],
    spot: { part: 0, who: 'Tolu', q: `y varies inversely as x, and y = 8 when x = 3. Find y when x = 6.`, lines: ['y = kx', '8 = 3k, so k = 8 ÷ 3', 'y = (8 ÷ 3) × 6 = 16'], bad: 0,
      okfb: ['If line 1 were right, this would be right.', 'The arithmetic follows from line 2.'],
      o: ['Inverse variation is y = k ÷ x, not y = kx', 'k should be 24 ÷ 3', 'She should have multiplied 8 by 6', 'Nothing is wrong'],
      fb: ['That is it. Inverse means x goes underneath.', 'Fix the equation first, then find k.', 'There is no rule for that.', 'x doubled, so y should go down, not up.'],
      h: ['x doubled. For inverse variation, should y go up or down?'], fix: 'y = k ÷ x, so k = 8 × 3 = 24, and y = 24 ÷ 6 = 4.' }
  },
  ineq: {
    fb: [['', 'Dividing by 3, a positive number, keeps the sign the same way round.', 'You did not divide by 3: 3x &gt; 15 means x &gt; 5.', 'The sign is &gt;, not ≥. Check x = 5: 3(5) + 4 = 19, and 19 is not greater than 19.'],
      ['', '≤ means below the line. The shaded side is above.', 'A solid line means the line itself is included, so use ≥, not &gt;.', 'That is below the line and leaves the line out.']],
    ex: [[1, W3('Why did ≤ turn into ≥?', ['Dividing by a negative number turns the inequality round', 'Because 6 is positive', 'Because x is on the left'], ['Right. Try it: 2 &lt; 3, but −2 &gt; −3.', 'The sign of 6 does not matter. The −2 you divide by does.', 'Which side x is on does not turn the sign.'])],
      [2, W3('Why is the answer between the roots?', ['The cup-shaped graph dips below the axis between its roots', 'Because the roots are −2 and 3', 'Because &lt; always means between'], ['Yes. Below the axis means less than 0.', 'The roots are the ends. The question is which side is below 0.', 'For a cap-shaped graph, or for &gt; 0, it would be outside.'])]],
    spot: { part: 0, who: 'Ada', q: `Solve 7 − 3x &gt; 1.`, lines: ['−3x &gt; −6', 'x &gt; 2', 'Check: x = 3 gives 7 − 9 = −2'], bad: 1,
      okfb: ['Taking 7 from both sides gives −3x &gt; −6. Correct.', 'The check itself is right. It shows x = 3 does not work, so look at the line before.'],
      o: ['Dividing by −3 must turn the sign round: x &lt; 2', '−3x &gt; −6 is wrong', 'She should have added 3x', 'Nothing is wrong'],
      fb: ['That is it.', 'That line is right.', 'Adding 3x to both sides also works, but it would still give x &lt; 2.', 'Her own check fails: −2 is not greater than 1.'],
      h: ['Her check with x = 3 failed. What does that tell you?'], fix: 'Divide by −3 and turn the sign: x &lt; 2. Check x = 0: 7 &gt; 1 is true.' }
  },
  prog: {
    fb: [['Check the bracket: 2 × 2 + 9 × 4 = 4 + 36 = 40, then 5 × 40.', '', 'n − 1 = 9, not 10. The bracket is 4 + 36.', 'You forgot the ½: 10 ÷ 2 = 5.'],
      ['That uses 1 + r. The formula is a ÷ (1 − r).', '', '12 ÷ ½ = 24, not 36.', 'Dividing by ½ doubles the number: 12 ÷ ½ = 24.']],
    ex: [[1, W3('Why 19 lots of d, not 20?', ['The first term has no d added, so the 20th term has 19', 'Because 20 − 1 = 19 is the sum', 'Because the last term is not counted'], ['Right. T₁ = a, T₂ = a + d, so T₂₀ = a + 19d.', '19 is the number of steps, not a sum.', 'The last term is what we are finding. Count the steps from the first.'])],
      [1, W3('Why 2⁵ and not 2⁶?', ['The first term has r⁰, so the 6th term has r⁵', 'Because 2⁶ is too big', 'Because r = 5'], ['Yes: T<sub>n</sub> = ar<sup>n − 1</sup>.', 'The size is not the reason. Count the multiplications.', 'r = 2. The 5 is the power.'])]],
    spot: { part: 1, who: 'Femi', q: `Find the 10th term of the GP 2, 6, 18, …`, lines: ['a = 2, r = 3', 'T₁₀ = 2 × 3¹⁰', '= 118,098'], bad: 1,
      okfb: ['6 ÷ 2 = 3 and 18 ÷ 6 = 3. Correct.', 'The multiplication follows from line 2.'],
      o: ['The power should be n − 1 = 9, not 10', 'r should be 4', 'a should be 6', 'Nothing is wrong'],
      fb: ['That is it.', 'Each term is 3 times the last, so r = 3.', 'a is the first term, 2.', 'Check the formula: T<sub>n</sub> = ar<sup>n − 1</sup>.'],
      h: ['What power of r does the 1st term have?'], fix: 'T₁₀ = 2 × 3⁹ = 2 × 19,683 = 39,366.' }
  },
  poly: {
    fb: [['', 'Check the arithmetic: 2 − 3 − 1 = −2.', 'Dividing by (x + 1) means x = −1, not x = 1. f(1) = 4.', 'Watch the last term: 2 − 3 − 1 = −2, not 2.'],
      ['Check: 8 + 2(2) − 4 = 8, not 0.', '', '2k = −4, so k = −2. Divide by 2.', 'That is 2k. Divide by 2.'],
      ['', 'Add 5 to undo the − 5, do not subtract.', 'Divide by 3, do not multiply.', 'Add 5 before you divide, so the 5 gets divided too.']],
    ex: [[0, W3('Why f(2)?', ['For (x − 2), put x = 2: the value that makes the divisor 0', 'Because 2 is the first coefficient', 'Because we always use x = 2'], ['Right. That is the remainder theorem.', 'The coefficient has nothing to do with it.', 'It depends on the divisor: (x + 3) would need x = −3.'])],
      [0, W3('Why does f(1) = 0 show that (x − 1) is a factor?', ['Factor theorem: if f(a) = 0, then (x − a) divides f(x) exactly', 'Because 1 is always a root', 'Because the coefficients add up to 6'], ['Yes. A remainder of 0 means it divides exactly.', '1 is often worth trying, but it is not always a root.', 'The coefficients add to 0 here, which is the same as f(1) = 0.'])],
      [0, W3('Why divide by πh?', ['To leave r² on its own: undo the multiplication by π and h', 'Because V is the biggest', 'Because you always divide first'], ['Right. Undo what was done to r, step by step.', 'Size has nothing to do with it.', 'You undo operations in reverse order. Here that means dividing.'])]],
    spot: { part: 0, who: 'Chioma', q: `Find the remainder when x² + 3x + 5 is divided by (x + 2).`, lines: ['Put x = 2', 'f(2) = 4 + 6 + 5', '= 15'], bad: 0,
      okfb: ['If x = 2 were right, this would be right.', 'The adding follows from line 2.'],
      o: ['Dividing by (x + 2) means x = −2', 'She added wrongly', 'The remainder is always the number term, 5', 'Nothing is wrong'],
      fb: ['That is it. Set x + 2 = 0.', '4 + 6 + 5 = 15 is right for x = 2.', 'Only when you divide by x.', 'Check with long division: the remainder is 3.'],
      h: ['What value of x makes x + 2 equal to 0?'], fix: 'f(−2) = 4 − 6 + 5 = 3.' }
  },
  simul: {
    fb: [['', 'Swapped. x − y = 4 means x is the bigger one.', 'Check: 7 + 4 = 11, not 10.', '2x = 14 gives x = 7. Divide by 2.'],
      ['', 'x is read on the horizontal axis, y on the vertical one.', 'Read the point where the two lines meet.', 'That is where a line meets the y-axis, not where the lines meet each other.']],
    ex: [[0, W3('Why multiply the second equation by 3?', ['To make the y terms match so they cancel when added', 'Because 3 is the biggest number', 'To make x disappear'], ['Right: +3y and −3y cancel.', 'The 3 matches the 3y in the first equation.', 'Here we get rid of y, not x.'])],
      [0, W3('Why set the two expressions equal?', ['Where they meet, both equations give the same y', 'Because both start with y', 'To make a quadratic'], ['Yes. Same point, same y.', 'They both start with y = because y is the same at the meeting points.', 'The quadratic is a result, not the reason.'])]],
    spot: { part: 0, who: 'Ibrahim', q: `Solve 2x + y = 7 and x − y = 2.`, lines: ['Add: 3x = 9, so x = 3', 'Then 3 − y = 2, so y = 5', 'Answer: x = 3, y = 5'], bad: 1,
      okfb: ['Adding cancels y: 3x = 9. Correct.', 'This repeats line 2.'],
      o: ['3 − y = 2 gives y = 1, not 5', 'Adding gives 3x = 5', 'He should subtract the equations', 'Nothing is wrong'],
      fb: ['That is it.', '2x + x = 3x and 7 + 2 = 9. That line is fine.', 'Adding works here because +y and −y cancel.', 'Check in the first equation: 2(3) + 5 = 11, not 7.'],
      h: ['Put his answer into 2x + y = 7. Does it work?'], fix: 'y = 3 − 2 = 1. Check: 2(3) + 1 = 7.' }
  },
  binop: {
    fb: [['', '−7 comes from 9 − 16. a is 3 and b is 4, so it is 3² − 4.', '3² + 4 = 13, but the rule subtracts b.', 'Square a: 3² = 9, not 6.'],
      ['', '2 * 2 does not give the identity, 1, in this table.', 'Look along the row for 2 for the identity, 1.', '1 is the identity itself, not the inverse of 2.']],
    ex: [[0, W3('Why work out 3 * 1 first?', ['The bracket comes first, and its answer becomes a in the next step', 'Because 3 is larger than 2', 'The order never matters'], ['Right.', 'Size has nothing to do with it.', 'Order often matters with binary operations. Check: 3 * (1 * 2) gives a different answer.'])],
      [0, W3('What does the identity element do?', ['Combined with any a, it gives back a', 'It always equals 0', 'It always equals 1'], ['Yes. That is why we solve a * e = a.', '0 is the identity for addition only.', '1 is the identity for multiplication only.'])]],
    spot: { part: 0, who: 'Halima', q: `a * b = 2a − b. Find 3 * 5.`, lines: ['a = 5 and b = 3', '2(5) − 3', '= 7'], bad: 0,
      okfb: ['If line 1 were right, this would be right.', 'The arithmetic follows from line 2.'],
      o: ['a is the first number, 3, and b is the second, 5', '2(5) − 3 is 13', 'The answer is 2 × 3 × 5', 'Nothing is wrong'],
      fb: ['That is it.', '2(5) − 3 = 7. The arithmetic is fine.', '* follows the rule given, not ordinary multiplication.', 'Order matters here: 3 * 5 and 5 * 3 are different.'],
      h: ['In 3 * 5, which number is a?'], fix: '3 * 5 = 2(3) − 5 = 1.' }
  },
  matrix: {
    fb: [['', 'You added Q, not 2Q. Double every entry of Q first.', 'Bottom right: 4 + 2 × 2 = 8, not 6.', 'Double Q, then add P entry by entry.'],
      ['ad − bc: subtract, do not add.', '', 'That is 14 ÷ 2. The determinant is just ad − bc.', 'It is ad − bc, not bc − ad.']],
    ex: [[0, W3('Why row × column?', ['Each entry of AB is a row of A times a column of B', 'Because rows are longer', 'You can multiply entry by entry'], ['Right. Top left = row 1 × column 1.', 'Rows and columns here are the same length.', 'Multiplying matching entries is not matrix multiplication.'])],
      [1, W3('Which entries swap?', ['a and d swap; b and c change sign', 'b and c swap; a and d change sign', 'All four entries change sign'], ['Right.', 'Other way round.', 'Only b and c change sign.'])]],
    spot: { part: 1, who: 'Uche', q: `Find the determinant of ${mx([[3, MN + '2'], [4, 1]], 'mx dt')}.`, lines: ['ad = 3 × 1 = 3', 'bc = (−2) × 4 = −8', 'ad − bc = 3 − 8 = −5'], bad: 2,
      okfb: ['3 × 1 = 3. Correct.', '(−2) × 4 = −8. Correct.'],
      o: ['Minus a negative is a plus: 3 − (−8) = 11', 'bc should be 8', 'ad should be 4', 'Nothing is wrong'],
      fb: ['That is it.', 'b = −2, so bc = −8.', 'a = 3 and d = 1, so ad = 3.', 'Check the last subtraction carefully.'],
      h: ['What is 3 − (−8)?'], fix: 'ad − bc = 3 − (−8) = 3 + 8 = 11.' }
  },
  mens: {
    fb: [['⅙ × 36π = 6π. You halved it again.', '', '12π is the circumference. The area uses 36π.', 'That is the whole circle. Take ⅙ of it.'],
      ['Recheck: ⅓ × 22/7 × 9 × 7 = 66.', '', 'That is the cylinder, πr²h. A cone is ⅓ of it.', 'Recheck: ⅓ × 22/7 × 3 × 3 × 7 = 66.'],
      ['', 'That is base × height. A pyramid is ⅓ of that.', 'Use ⅓, not ½.', '⅓ × 36 × 10 = 120, not 60.'],
      ['', 'They are on opposite sides of the equator, so add: 30 + 15.', 'That is only one town\'s latitude.', '30 + 15 = 45.']],
    ex: [[0, W3('Why divide by 360?', ['A full turn is 360°, so the arc is that fraction of the circle', 'Because the radius is 14', 'Because 90 is a right angle'], ['Right. 90° is a quarter of the turn.', 'The radius comes in later, in the circumference.', 'Any angle works the same way: angle ÷ 360.'])],
      [0, W3('What does πr² stand for in V = πr²h?', ['The area of the circular base', 'The curved surface', 'The perimeter of the base'], ['Yes. Volume = base area × height.', 'Curved surface is 2πrh.', 'The perimeter is 2πr.'])],
      [2, W3('Why subtract the triangle?', ['The segment is the part of the sector outside the triangle', 'Because the triangle is bigger', 'To get the arc length'], ['Right.', 'The triangle is smaller: it sits inside the sector.', 'Arc length is a length, not an area.'])],
      [1, W3('Why use 2πR with R = 6400?', ['The towns lie on a great circle, whose radius is the earth\'s radius', 'Because 6400 is the latitude', 'All circles on the earth have radius 6400 km'], ['Yes. Lines of longitude are great circles.', '6400 km is the radius. Latitudes are angles.', 'Circles of latitude are smaller than the equator.'])]],
    spot: { part: 0, who: 'Zainab', q: `Find the area of a circle of diameter 14 cm. (Take π = ${fr(22, 7)})`, lines: ['r = 14 cm', 'A = 22/7 × 14 × 14', '= 616 cm²'], bad: 0,
      okfb: ['If r were 14, this would be right.', 'The multiplication follows from line 2.'],
      o: ['The radius is half the diameter: r = 7 cm', 'π should be 3.14', 'Area is 2πr', 'Nothing is wrong'],
      fb: ['That is it.', 'Either value is fine if the question allows it. The real mistake is the radius.', '2πr is the circumference.', 'Read the question again: 14 cm is the diameter.'],
      h: ['Is 14 cm the radius or the diameter?'], fix: 'r = 7 cm, so A = 22/7 × 7 × 7 = 154 cm².' }
  },
  loci: {
    fb: [['', 'A circle is the locus for a fixed distance from a point, not from a line.', 'Points can be on either side of l, so there are two lines.', 'That is for points equally far from two points.'],
      ['', 'The equation uses r², and 4² = 16.', 'That is a straight line. Distance from O uses x² + y².', 'r² = 16, not 2 × 4.']],
    ex: [[1, W3('Why do all these points line up?', ['Every point equally far from A and B sits on the perpendicular bisector', 'Because A and B are on a line', 'Because the midpoint is on every locus'], ['Right. That line cuts AB in half at right angles.', 'That AB is a line does not decide where the equidistant points are.', 'Not every locus passes through the midpoint.'])],
      [0, W3('Why are the distances squared?', ['Distance comes from Pythagoras; squaring both sides removes the roots', 'Because x and y are always squared', 'To make the numbers bigger'], ['Yes. √(…) = √(…) becomes … = … .', 'They are squared because of Pythagoras.', 'The size is not the point. It removes the square roots.'])]],
    spot: { part: 1, who: 'Dapo', q: `Find the equation of the locus of points 3 units from the origin.`, lines: ['A point (x, y) is 3 units from O', 'So x + y = 3', 'The locus is a straight line'], bad: 1,
      okfb: ['That states the condition correctly.', 'This follows from line 2. Fix that line first.'],
      o: ['Distance uses Pythagoras: x² + y² = 9', 'It should be x + y = 9', 'The locus is a square', 'Nothing is wrong'],
      fb: ['That is it.', 'Distance is not x + y. Use Pythagoras.', 'Points a fixed distance from one point form a circle.', '(3, 0) works, but (1.5, 1.5) is only about 2.1 units from O.'],
      h: ['How far is the point (x, y) from O, using Pythagoras?'], fix: 'x² + y² = 9: a circle of radius 3 centred at O.' }
  },
  coord: {
    fb: [['That is run ÷ rise. Gradient is rise ÷ run.', '', '4 is the run, not the gradient.', '8 is the rise. Divide it by the run.'],
      ['That is the gradient of a parallel line.', 'Also turn it upside down: −1 ÷ 2.', 'Change the sign as well: m₁ × m₂ = −1.', '']],
    ex: [[1, W3('Why Pythagoras?', ['The run and rise are at right angles, and the distance is the hypotenuse', 'Because 6 and 8 are even', 'Because both points are positive'], ['Right.', 'Even numbers have nothing to do with it.', 'It works for any points.'])],
      [0, W3('Why use y − 3 = 4(x − 2)?', ['y − y₁ = m(x − x₁) uses the gradient and one point', 'Because (3, 2) is the origin', 'It only works when m = 4'], ['Yes. Put in m = 4 and the point (2, 3).', 'The origin is (0, 0).', 'It works for any gradient.'])]],
    spot: { part: 0, who: 'Seun', q: `Find the midpoint of A(2, 5) and B(8, −1).`, lines: ['x: (2 + 8) ÷ 2 = 5', 'y: (5 + 1) ÷ 2 = 3', 'Midpoint (5, 3)'], bad: 1,
      okfb: ['(2 + 8) ÷ 2 = 5. Correct.', 'This follows from the lines above.'],
      o: ['B\'s y-coordinate is −1, so it should be 5 + (−1)', 'He should subtract the x-values', 'A midpoint is not divided by 2', 'Nothing is wrong'],
      fb: ['That is it.', 'Midpoints add, then halve.', 'Halving is exactly what makes it the middle.', 'Check the sign of B\'s y-coordinate.'],
      h: ['What is B\'s y-coordinate?'], fix: 'y: (5 + (−1)) ÷ 2 = 2, so the midpoint is (5, 2).' }
  },
  trig: {
    fb: [['That is sin θ: opposite ÷ hypotenuse.', '', 'That is tan θ: opposite ÷ adjacent.', 'Upside down: cos θ = adjacent ÷ hypotenuse.'],
      ['', 'That is 10 sin 60°, the height up the wall.', 'cos 60° = ½, so it is 10 × ½.', 'Multiply by ½; do not divide.'],
      ['', '180 − 70 = 110 is not a back bearing. Add 180°.', 'That is 360 − 70. Back bearings add or take away 180°.', 'That is the bearing of B from A.'],
      ['', 'That is the greatest value of sin x. Multiply it by 3.', '90° is where the greatest value happens, not the value.', '360° is the period of the graph.']],
    ex: [[0, W3('Why use sin here?', ['x is opposite the angle and 10 is the hypotenuse: SOH', 'Because the angle is 30°', 'Because x is the shortest side'], ['Right.', 'The angle size does not choose the ratio. The sides do.', 'Length does not decide it. Which sides you have and want does.'])],
      [1, W3('Why tan here?', ['h is opposite and 20 m is adjacent: TOA', 'Because 60° is a big angle', 'Because the tower is vertical'], ['Yes.', 'The angle size does not choose the ratio.', 'Vertical gives the right angle, but the sides choose tan.'])],
      [0, W3('Why does "at right angles" matter?', ['It makes a right-angled triangle, so Pythagoras works', 'Because east is always 90°', 'It does not matter'], ['Right.', 'East is a bearing of 090°, but the point is the right angle between the two walks.', 'Without the right angle, Pythagoras would not work.'])],
      [1, W3('Why is there a second answer?', ['Sine is also positive in the second quadrant', 'Because 180 is half of 360', 'Because ½ is a fraction'], ['Yes: sin(180° − x) = sin x.', 'That is true, but not the reason.', 'Any value between −1 and 1 has two angles in 0° to 360°.'])]],
    spot: { part: 0, who: 'Rita', q: `sin θ = ${fr(3, 5)} and θ is acute. Find tan θ.`, lines: ['opposite = 3, hypotenuse = 5', 'adjacent = √(5² − 3²) = 4', 'tan θ = 4 ÷ 3'], bad: 2,
      okfb: ['sin = opposite ÷ hypotenuse. Correct.', '√(25 − 9) = √16 = 4. Correct.'],
      o: ['tan θ = opposite ÷ adjacent = 3 ÷ 4', 'The adjacent side should be 2', 'tan θ = 3 ÷ 5', 'Nothing is wrong'],
      fb: ['That is it. She turned it upside down.', '√(25 − 9) = 4, not 2.', 'That is sin θ.', 'Check SOH CAH TOA for tan.'],
      h: ['tan = opposite ÷ ?'], fix: `tan θ = 3 ÷ 4 = ${fr(3, 4)}.` }
  },
  diff: {
    fb: [['', 'Reduce the power by 1.', 'Multiply by the power, 3. Do not add.', '4x differentiates to 4.'],
      ['2x = 6 gives x = 3, which is positive.', '2 is the number in front of x in dy/dx.', '', 'Divide by 2: x = 3.'],
      ['', '2 × 4 = 8, not 4.', 'Add the 5.', 'Put x = 4 into 2x + 5.']],
    ex: [[2, W3('Why does −2 disappear?', ['A constant never changes, so its rate of change is 0', 'Because it is negative', 'Because it has no x²'], ['Right.', 'Positive constants disappear too.', 'Terms with x disappear only if their power is 0.'])],
      [0, W3('Why differentiate first?', ['The gradient at a point is the value of dy/dx there', 'Because the question has x³', 'To find y'], ['Yes.', 'Any curve needs it, not only cubics.', 'y is the height. dy/dx is the gradient.'])],
      [1, W3('Why factorise?', ['Putting x = 3 straight in gives 0 ÷ 0, so cancel the common factor first', 'Because 9 is a square', 'Limits always need factorising'], ['Right.', 'It is the 0 ÷ 0 that forces it.', 'Only when substituting gives 0 ÷ 0.'])]],
    spot: { part: 0, who: 'Gbenga', q: `Find dy/dx if y = 4x³ − 2x + 7.`, lines: ['4x³ becomes 12x²', '−2x becomes −2', '7 becomes 7, so dy/dx = 12x² − 2 + 7'], bad: 2,
      okfb: ['4 × 3 = 12 and the power drops to 2. Correct.', 'Correct.'],
      o: ['A constant differentiates to 0', '4x³ should become 12x³', '−2x should stay −2x', 'Nothing is wrong'],
      fb: ['That is it.', 'The power drops by 1.', 'x¹ becomes x⁰ = 1, so −2x becomes −2.', 'Check what happens to a constant.'],
      h: ['What is the gradient of a flat line y = 7?'], fix: 'dy/dx = 12x² − 2.' }
  },
  integ: {
    fb: [['', 'That is differentiating, not integrating.', '∫2 dx = 2x, not 2.', 'Divide by the new power: 3x³ ÷ 3 = x³.'],
      ['', 'Divide 27 by 3.', '3³ ÷ 3 = 9, not 3.', 'That is dy/dx at x = 3. Area needs integration.'],
      ['', 'Divide by 2 when integrating; you multiply when differentiating.', 'Integrating cos gives +sin, and you divide by 2.', 'Divide by a = 2.']],
    ex: [[0, W3('Why divide by 3?', ['Raise the power by 1, then divide by the new power', 'Because the number in front is 6', 'Integration always divides by 3'], ['Right: x² becomes x³ ÷ 3.', 'The 6 stays; the 3 is the new power.', 'You divide by the new power, which changes.'])],
      [1, W3('Why take away the value at 1?', ['A definite integral is the value at the top limit minus the value at the bottom', 'Because 1 is smaller', 'Because 1 squared is 1'], ['Right.', 'It is the bottom limit, whatever its size.', 'That is true but not the reason.'])],
      [1, W3('Why the minus sign?', ['d/dx(cos x) = −sin x, so ∫sin x dx = −cos x', 'Because sin is negative', 'Because 2 is even'], ['Yes.', 'sin x can be positive or negative. The minus comes from differentiating cos.', 'The 2 has nothing to do with the sign.'])]],
    spot: { part: 1, who: 'Ladi', q: `Evaluate ∫<sub>0</sub><sup>2</sup> 3x² dx.`, lines: ['∫3x² dx = x³', 'Value = 2³ − 0³', '= 6'], bad: 2,
      okfb: ['3x³ ÷ 3 = x³. Correct.', 'Top minus bottom. Correct.'],
      o: ['2³ = 8, not 6', 'Integrating 3x² gives 6x', 'She should take away 2', 'Nothing is wrong'],
      fb: ['That is it. 2³ means 2 × 2 × 2.', 'That is differentiating.', 'Take away the value at 0, which is 0.', 'Check 2³.'],
      h: ['What is 2 × 2 × 2?'], fix: '2³ − 0³ = 8.' }
  },
  stats: {
    fb: [['Mean = 30 ÷ 5 = 6.', '', 'Divide 30 by 5.', 'That is the total. Divide by the 5 values.'],
      ['That is the class size.', '¼ × 360° = 90°, not 45°.', '', 'Pie charts share out 360°, not 400.'],
      ['', 'That bar is not the tallest.', 'Compare the heights again.', '12 is the frequency, not the class.'],
      ['', 'That is a quarter of the way, the lower quartile.', 'That is three quarters, the upper quartile.', 'That is the whole group.']],
    ex: [[0, W3('Why put them in order first?', ['The median is the middle of the ordered list', 'Because the mean needs it', 'To find the mode'], ['Right.', 'The mean does not need ordering.', 'Ordering helps, but here it is for the median.'])],
      [1, W3('Why multiply each mark by its frequency?', ['Each mark counts as many times as students scored it', 'To make the numbers bigger', 'Because the bars are different colours'], ['Right.', 'It is about counting each student once.', 'Colour has nothing to do with it.'])],
      [0, W3('Why use class marks (midpoints)?', ['You do not know the exact values, so the middle of each class stands for them', 'Because they are the biggest values', 'To find the mode'], ['Right.', 'They are the middle values, not the biggest.', 'This is for the mean.'])],
      [1, W3('Why keep adding?', ['Cumulative frequency is a running total', 'Because frequencies must be equal', 'To find the mean'], ['Right.', 'They do not need to be equal.', 'This builds the cumulative table for the median and quartiles.'])]],
    spot: { part: 0, who: 'Ope', q: `Find the median of 9, 2, 7, 4, 5.`, lines: ['The numbers are 9, 2, 7, 4, 5', 'The middle one is 7', 'Median = 7'], bad: 1,
      okfb: ['Listing them is fine. The trouble comes next.', 'This follows from line 2.'],
      o: ['Order them first: 2, 4, 5, 7, 9. The middle one is 5', 'The median is the mean', '7 is the mode', 'Nothing is wrong'],
      fb: ['That is it.', 'The mean is 27 ÷ 5 = 5.4. The median is different.', 'There is no mode: every number appears once.', 'Was the list in order?'],
      h: ['Is the list in order?'], fix: 'In order: 2, 4, 5, 7, 9. The median is 5.' }
  },
  disp: {
    fb: [['', 'That is the highest value. Take away the lowest.', 'That is the middle value.', 'Subtract, do not add.'],
      ['', 'That is the variance itself.', 'Take the square root, not half.', 'Take the square root, not the square.']],
    ex: [[1, W3('Why take the size of each deviation?', ['The signed deviations always add up to 0, so we use their sizes', 'Because the mean is positive', 'To make the answer bigger'], ['Right.', 'The sign of the mean is not the reason.', 'The size is not the point. The signs cancel otherwise.'])],
      [1, W3('Why square the deviations?', ['Squaring removes the signs, so they do not cancel', 'To make the answer a whole number', 'Because variance is always a square number'], ['Right.', 'It often is not a whole number.', 'Variance can be any positive number.'])]],
    spot: { part: 1, who: 'Ken', q: `Find the variance of 1, 3, 5.`, lines: ['Mean = 3', 'Deviations: −2, 0, 2', 'Variance = (−2 + 0 + 2) ÷ 3 = 0'], bad: 2,
      okfb: ['9 ÷ 3 = 3. Correct.', 'Correct.'],
      o: ['Square the deviations first: (4 + 0 + 4) ÷ 3', 'The mean is 9', 'Divide by 2', 'Nothing is wrong'],
      fb: ['That is it.', '9 is the total. The mean is 3.', 'Divide by n = 3.', 'A variance of 0 would mean all the numbers are equal.'],
      h: ['What does a variance of 0 mean? Are 1, 3 and 5 all the same?'], fix: `Variance = (4 + 0 + 4) ÷ 3 = ${fr(8, 3)}.` }
  },
  perm: {
    fb: [['', 'That is ⁶C₂. Permutations are not divided by 2!.', '6 × 2 multiplies by r. Use 6 × 5.', 'That is 6!.'],
      ['', 'Divide by 2!, because order does not matter.', 'That is ⁵C₁.', 'That is ⁵P₃.'],
      ['', 'That is 4!. Round a table, fix one person: 3!.', 'Halving is for necklaces that can be turned over.', 'That is the number of people.']],
    ex: [[1, W3('Why 5 × 4 × 3 × 2 × 1?', ['5 choices for the first place, then 4 left, then 3, and so on', 'Because there are 5 vowels', 'Because 5 + 4 + 3 + 2 + 1'], ['Right.', 'LAGOS has 2 vowels. Count letters, not vowels.', 'Multiply, do not add.'])],
      [0, W3('Why does order not matter for a committee?', ['The same three people form the same committee in any order', 'Because committees are small', 'Because combinations are bigger'], ['Right.', 'Size is not the reason.', 'Combinations are smaller than permutations.'])],
      [0, W3('Why fix one person?', ['Turning everyone round the table gives the same arrangement, so fix one seat as the start', 'Because one person is the host', 'To make the number bigger'], ['Right.', 'Any one person can be fixed.', 'It makes the number smaller: (n − 1)!.'])]],
    spot: { part: 1, who: 'Kemi', q: `In how many ways can 2 prefects be chosen from 8 students?`, lines: ['Order matters, so use ⁸P₂', '⁸P₂ = 8 × 7', '= 56'], bad: 0,
      okfb: ['If order mattered, this would be right.', 'The multiplication follows from line 2.'],
      o: ['The same pair in any order is one choice: use ⁸C₂', '8 × 7 is 54', 'Use 8²', 'Nothing is wrong'],
      fb: ['That is it.', '8 × 7 = 56. The arithmetic is fine.', 'A student cannot be chosen twice.', 'Ade and Bola is the same pair as Bola and Ade.'],
      h: ['Is "Ade and Bola" different from "Bola and Ade"?'], fix: '⁸C₂ = (8 × 7) ÷ 2 = 28.' }
  }
};

export function buildMathInteractiveLessons(topics: Topic[]): Record<string, InteractiveLesson> {
  const out: Record<string, InteractiveLesson> = { ...IL };
  const topicMap = new Map(topics.map(t => [t.id, t]));
  Object.keys(LX).forEach(tid => {
    const t = topicMap.get(tid);
    if (!t) return;
    const X = LX[tid];
    const parts = t.parts.map((x, i) => {
      const y = x.tryit;
      const ex = X.ex && X.ex[i];
      const fb = (X.fb && X.fb[i] ? X.fb[i].slice() : y.o.map(() => y.h));
      fb[y.a] = y.e;
      return {
        title: x.title,
        beats: [
          { k: "idea", idea: x.idea, g: x.g, cap: x.cap, rules: x.rules },
          { k: "fade", lv: "full", q: x.ex.q, g: x.ex.g, steps: x.ex.steps.map(([m, w], j) => ({ m, why: w, ex: ex && ex[0] === j ? Object.assign({ a: 0 }, ex[1]) : undefined })) },
          { k: "check", q: y.q, g: y.g, given: y.given, ask: y.ask, o: y.o, a: y.a, fb, h: [y.h] },
        ],
      };
    });
    if (X.spot) parts[X.spot.part].beats.push(Object.assign({ k: "spot" }, X.spot));
    const last = parts[parts.length - 1];
    const q = t.qs.find(z => z.gen && z.l === 2 && z.w);
    if (q) {
      last.beats.push({
        k: "check",
        title: "One more, on your own",
        q: q.q,
        g: q.g,
        o: q.o,
        a: q.a,
        fb: q.w.map((w, k) => k === q.a ? q.e : w),
        h: [last.beats[0].rules ? last.beats[0].rules[0] : ""],
      });
    }
    out[tid] = { parts };
  });
  return out;
}
