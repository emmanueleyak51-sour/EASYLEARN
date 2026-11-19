// @ts-nocheck
import type { Topic } from "../types";
import { fr, MN, nm, gcd, frac, poly, isSq } from "../utils/mathMarkup";
import { mkR, perm } from "../utils/engine";

const mx = (rows: any[][], cls = "mx") => `<span class="${cls}">${rows.map(r => `<span class="mr">${r.map(v => `<span>${v}</span>`).join("")}</span>`).join("")}</span>`;
const det = (rows: any[][]) => mx(rows, "dt");
const QG: Record<string, any[]> = {};

const bn = (s, b) => `${s}<sub>${b}</sub>`;
const sgnN = v => (v < 0 ? MN : '+') + ' ' + Math.abs(v);            // "+ 3" or "− 3"
const pw = (x, n) => n === 1 ? x : `${x}<sup>${n}</sup>`;
const lin = (a, b, v = 'x') => poly(0, a, b).replace(/x/g, v);           // ax + b
const sq = n => n * n;
const fact = n => n <= 1 ? 1 : n * fact(n - 1);
const nCr = (n, r) => fact(n) / (fact(r) * fact(n - r));
const nPr = (n, r) => fact(n) / fact(n - r);
const commas = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/* ── Number bases ── */
QG.bases = [
  { l: 2, n: 4, f: R => {
    const b = R.int(3, 9), d = [R.int(1, b - 1), R.int(0, b - 1), R.int(0, b - 1)], s = d.join(''), v = d[0] * b * b + d[1] * b + d[2];
    const rev = d[2] * b * b + d[1] * b + d[0], twob = d[0] * 2 * b + d[1] * b + d[2];
    return { q: `Convert ${bn(s, b)} to base ten.`, o: [v, rev, +s, twob],
      w: ['', 'You counted the place values from the left. The units place is on the right.', `That is just the digits read in base ten. Multiply each digit by its place value in base ${b}.`, `The third place is worth ${b}² = ${b * b}, not 2 × ${b}.`],
      e: `(${d[0]} × ${b * b}) + (${d[1]} × ${b}) + (${d[2]} × 1) = ${d[0] * b * b} + ${d[1] * b} + ${d[2]} = ${v}.` };
  } },
  { l: 2, n: 4, f: R => {
    const b = R.int(2, 8), N = R.int(b * b + 1, Math.min(250, b * b * b - 1)), s = N.toString(b), r = [...s].reverse().join('');
    const alt = N.toString(b + 1), alt2 = (N + 1).toString(b);
    let steps = [], x = N; while (x) { steps.push(`${x} ÷ ${b} = ${Math.floor(x / b)} r ${x % b}`); x = Math.floor(x / b); }
    return { q: `Express ${N}<sub>10</sub> in base ${b}.`, o: [bn(s, b), bn(r, b), bn(alt, b), bn(alt2, b)],
      w: ['', 'You read the remainders from top to bottom. Read them upward, from the last one to the first.', `That is ${N} in base ${b + 1}, not base ${b}.`, `Check it: that number is ${N + 1} in base ten.`],
      e: `${steps.join(', ')}. Reading the remainders upward gives ${bn(s, b)}.` };
  } },
  { l: 3, n: 4, f: R => {
    const b = R.int(4, 8), x = R.int(b + 1, b * b - 1), y = R.int(b + 1, b * b - 1), S = x + y, xs = x.toString(b), ys = y.toString(b);
    const naive = String(+xs + +ys);
    if (naive === S.toString(b)) return null;
    const bad = [...naive].find(c => +c >= b);
    return { q: `Evaluate ${bn(xs, b)} + ${bn(ys, b)}.`, o: [bn(S.toString(b), b), bn(naive, b), bn(String(S), b), bn((S + b).toString(b), b)],
      w: ['', bad ? `That uses the digit ${bad}, which cannot appear in base ${b}. Carry as soon as a column reaches ${b}.` : `You added as if in base ten. Carry when a column reaches ${b}, not 10.`, `${S} is the answer in base ten. Convert it back to base ${b}.`, 'You carried one time too many.'],
      e: `In base ten: ${x} + ${y} = ${S}. Converting ${S} to base ${b} gives ${bn(S.toString(b), b)}.` };
  } },
  { l: 3, n: 3, f: R => {
    const b = R.int(4, 8), x = R.int(b * 2, b * b - 1), y = R.int(b, x - 2), D = x - y, xs = x.toString(b), ys = y.toString(b);
    return { q: `Find ${bn(xs, b)} − ${bn(ys, b)}.`, o: [bn(D.toString(b), b), bn(String(D), b), bn((D + b).toString(b), b), bn((D - 1).toString(b), b)],
      w: ['', `${D} is the answer in base ten. Convert it back to base ${b}.`, `When you borrow in base ${b}, you borrow ${b}, not 10.`, `Check: that is ${D - 1} in base ten, one short.`],
      e: `In base ten: ${x} − ${y} = ${D}, and ${D} = ${bn(D.toString(b), b)}.` };
  } },
  { l: 4, n: 4, f: R => {
    const x = R.int(4, 9), a = R.int(1, Math.min(4, x - 1)), c = R.int(0, x - 1), N = a * x + c;
    const try1 = x + 1, try2 = x - 1 > Math.max(a, c) ? x - 1 : x + 2, try3 = x + 3;
    const chk = k => `Put x = ${k} in: ${a} × ${k} + ${c} = ${a * k + c}, not ${N}.`;
    return { q: `If ${bn(`${a}${c}`, 'x')} = ${N}<sub>10</sub>, find x.`, o: [x, try1, try2, try3], w: ['', chk(try1), chk(try2), chk(try3)],
      e: `In place-value form, ${a}x + ${c} = ${N}. So ${a}x = ${N - c} and x = ${x}.` };
  } },
  { l: 5, n: 2, f: R => {
    const b = R.pick([2, 3, 4, 5]), x = R.int(5, 14), y = R.int(3, 7), P = x * y;
    return { q: `Multiply ${bn(x.toString(b), b)} by ${bn(y.toString(b), b)}.`, o: [bn(P.toString(b), b), bn(String(P), b), bn((P + b).toString(b), b), bn((x + y).toString(b), b)],
      w: ['', `${P} is the product in base ten. Convert it back to base ${b}.`, `Check your carries: that is ${P + b} in base ten.`, 'That is the sum, not the product.'],
      e: `In base ten: ${x} × ${y} = ${P}. In base ${b}, ${P} is ${bn(P.toString(b), b)}.` };
  } }
];

/* ── Fractions, decimals and percentages ── */
QG.frac = [
  { l: 2, n: 4, f: R => {
    const b = R.int(2, 9), d = R.int(2, 9); if (b === d) return null;
    const a = R.int(1, b - 1), c = R.int(1, d - 1);
    return { q: `Simplify ${fr(a, b)} + ${fr(c, d)}.`, o: [frac(a * d + c * b, b * d), frac(a + c, b + d), frac(a + c, b * d), frac(a * c, b * d)],
      w: ['', 'You added the tops and added the bottoms. Change both fractions to the same denominator first.', `The bottoms are now ${b * d}, but the tops must change too: ${a} × ${d} and ${c} × ${b}.`, 'That is the product of the fractions, not the sum.'],
      e: `Common denominator ${b * d}: ${fr(a * d, b * d)} + ${fr(c * b, b * d)} = ${fr(a * d + c * b, b * d)}${gcd(a * d + c * b, b * d) > 1 ? ' = ' + frac(a * d + c * b, b * d) : ''}.` };
  } },
  { l: 2, n: 3, f: R => {
    const p = R.pick([5, 12.5, 15, 20, 25, 30, 40, 60, 75]), N = R.int(2, 30) * 40;
    const v = p * N / 100;
    return { q: `Find ${p}% of ₦${commas(N)}.`, o: [`₦${commas(v)}`, `₦${commas(N - v)}`, `₦${commas(p * N / 10)}`, `₦${commas(N + v)}`],
      w: ['', `That is what is left after taking ${p}% away.`, 'You divided by 10 instead of 100.', `That is ₦${commas(N)} increased by ${p}%.`],
      e: `${p}% of ${commas(N)} = ${p} ÷ 100 × ${commas(N)} = ₦${commas(v)}.` };
  } },
  { l: 3, n: 4, f: R => {
    const A = R.int(4, 40) * 50, p = R.pick([10, 15, 20, 25, 30, 40, 50]), up = R.f() < .6, B = up ? A * (1 + p / 100) : A * (1 - p / 100);
    if (!Number.isInteger(B)) return null;
    const wrongBase = Math.round(Math.abs(B - A) / B * 1000) / 10;
    return { q: `The price of an item ${up ? 'rose' : 'fell'} from ₦${commas(A)} to ₦${commas(B)}. Find the percentage ${up ? 'increase' : 'decrease'}.`,
      o: [`${p}%`, `${wrongBase}%`, `${Math.round(B / A * 100)}%`, `${Math.abs(B - A) / 10}%`],
      w: ['', `You divided by the new price. Percentage change always divides by the original price, ₦${commas(A)}.`, 'That is the new price as a percentage of the old one, not the change.', 'That is the change in naira divided by 10. Divide by the original price, then multiply by 100.'],
      e: `Change = ₦${commas(Math.abs(B - A))}. Percentage ${up ? 'increase' : 'decrease'} = ${commas(Math.abs(B - A))} ÷ ${commas(A)} × 100 = ${p}%.` };
  } },
  { l: 4, n: 3, f: R => {
    const old = R.int(5, 40) * 100, p = R.pick([10, 20, 25, 50]), now = old * (1 + p / 100), wrong = now * (1 - p / 100);
    return { q: `After a ${p}% increase, the price of a bag is ₦${commas(now)}. What was the price before the increase?`, o: [`₦${commas(old)}`, `₦${commas(wrong)}`, `₦${commas(now - p)}`, `₦${commas(now * p / 100)}`],
      w: ['', `You took ${p}% off the new price. The ${p}% was a percentage of the old price, so divide by ${1 + p / 100} instead.`, `${p} is a percentage, not ${p} naira.`, `That is ${p}% of the new price, not the old price.`],
      e: `New price = ${(100 + p) / 100} × old price. So old price = ${commas(now)} ÷ ${(100 + p) / 100} = ₦${commas(old)}.` };
  } },
  { l: 3, n: 4, f: R => {
    const sig = R.pick([2, 3]), m = R.int(1001, 9989), e = R.pick([-5, -4, -3, -2, 1, 2]), x = m * Math.pow(10, e);
    const fmt = v => { const s = (+v.toPrecision(12)).toString(); return s.includes('e') ? v.toFixed(8).replace(/0+$/, '') : s; };
    const ans = fmt(+x.toPrecision(sig)), trunc = fmt(Number(String(m).slice(0, sig) + '0'.repeat(4 - sig)) * Math.pow(10, e)), more = fmt(+x.toPrecision(sig + 1));
    const dp = e < 0 ? fmt(+x.toFixed(sig)) : fmt(Math.round(x));
    if (new Set([ans, trunc, more, dp]).size < 4) return null;
    return { q: `Write ${fmt(x)} correct to ${sig} significant figures.`, o: [ans, trunc, more, dp],
      w: ['', 'You cut the number off without rounding. Look at the next digit: 5 or more rounds up.', `That has ${sig + 1} significant figures.`, e < 0 ? `That is ${sig} decimal places, not ${sig} significant figures. Start counting at the first non-zero digit.` : 'That is the nearest whole number, not significant figures.'],
      e: `Count ${sig} digits from the first non-zero digit, then look at the next digit to decide whether to round up. ${fmt(x)} ≈ ${ans}.` };
  } },
  { l: 5, n: 3, f: R => {
    const ab = R.int(12, 98); if (ab % 11 === 0 || ab % 10 === 0) return null;
    const s = String(ab);
    return { q: `Express 0.${s}${s}${s}… (the digits ${s} repeating) as a fraction in its lowest terms.`, o: [frac(ab, 99), frac(ab, 100), frac(ab, 90), frac(ab, 999)],
      w: ['', `${fr(ab, 100)} is 0.${s} exactly, which stops. A repeating decimal needs 9s.`, 'Use 90 when only the second digit repeats. Here both digits repeat, so use 99.', 'Three 9s are for three repeating digits. Here two digits repeat.'],
      e: `Let x = 0.${s}${s}… Then 100x = ${s}.${s}${s}… Subtract: 99x = ${ab}, so x = ${fr(ab, 99)}${gcd(ab, 99) > 1 ? ' = ' + frac(ab, 99) : ''}.` };
  } }
];

/* ── Indices and logarithms ── */
QG.indices = [
  { l: 2, n: 4, f: R => {
    const m = R.int(2, 9), n = R.int(2, 9), p = R.int(1, m + n - 1), ans = m + n - p;
    if (m * n - p === ans || (m + n + p) === ans) return null;
    return { q: `Simplify ${pw('x', m)} × ${pw('x', n)} ÷ ${pw('x', p)}.`, o: [pw('x', ans), pw('x', m * n - p), pw('x', m + n + p), pw('x', m + n) + ' − ' + pw('x', p)],
      w: ['', 'Multiplying powers of the same base adds the indices. You multiplied them.', 'Dividing subtracts the index. You added it.', 'You cannot subtract terms with different powers. Use the laws of indices on the whole product.'],
      e: `Add the indices when multiplying and subtract when dividing: ${m} + ${n} − ${p} = ${ans}. So the answer is ${pw('x', ans)}.` };
  } },
  { l: 2, n: 4, f: R => {
    const r = R.int(2, 5), q = R.pick([2, 3]), p = R.pick([1, 2, 3].filter(x => x !== q)), base = Math.pow(r, q), v = Math.pow(r, p);
    if (base > 130) return null;
    return { q: `Evaluate ${base}<sup>${p}/${q}</sup>.`, o: [v, frac(base * p, q), p === 1 ? Math.pow(base, 2) : r, frac(1, v)],
      w: ['', `A fractional index is not multiplication. ${base}<sup>${p}/${q}</sup> means the ${q === 2 ? 'square' : 'cube'} root of ${base}, raised to the power ${p}.`, p === 1 ? 'That is the square of the number, not a root.' : `${r} is the ${q === 2 ? 'square' : 'cube'} root. You still have to raise it to the power ${p}.`, 'Only a negative index turns the number upside down.'],
      e: `${q === 2 ? 'Square' : 'Cube'} root of ${base} is ${r}. Then ${r}<sup>${p}</sup> = ${v}.` };
  } },
  { l: 3, n: 4, f: R => {
    const a = R.int(1, 5), b = R.int(2, 7), n = R.pick([1, 2, 3]); if (a === b || gcd(a, b) > 1) return null;
    const A = Math.pow(a, n), Bv = Math.pow(b, n);
    return { q: `Evaluate (${fr(a, b)})<sup>−${n}</sup>.`, o: [frac(Bv, A), frac(A, Bv), MN + frac(A, Bv), frac(b * n, a)],
      w: ['', 'A negative index means turn the fraction upside down. You did not flip it.', 'A negative index does not make the answer negative. It flips the fraction.', `You multiplied by ${n} instead of raising to the power ${n}.`],
      e: `(${fr(a, b)})<sup>−${n}</sup> = (${fr(b, a)})<sup>${n}</sup> = ${frac(Bv, A)}.` };
  } },
  { l: 3, n: 4, f: R => {
    const b = R.pick([2, 3, 5]), m = R.int(2, b === 2 ? 6 : 4), k = R.int(1, 3), N = Math.pow(b, m), c = R.pick([1, 2]);
    const xNum = m - k; if (xNum % c) return null; const x = xNum / c;
    const ex = c === 1 ? `x + ${k}` : `2x + ${k}`;
    return { q: `Solve ${b}<sup>${ex}</sup> = ${N}.`, o: [x, c === 1 ? m : m / 2, (m + k) / c, N / b - k],
      w: ['', `${N} = ${b}<sup>${m}</sup>, so the index is ${m}. You forgot to take away the ${k}.`, `Take away ${k}, do not add it.`, `Write ${N} as a power of ${b}. Do not divide.`],
      e: `${N} = ${b}<sup>${m}</sup>, so ${ex} = ${m}. Then ${c === 1 ? `x = ${m} − ${k} = ${x}` : `2x = ${m - k} and x = ${x}`}.` };
  } },
  { l: 3, n: 4, f: R => {
    const b = R.pick([2, 3, 4, 5, 10]), k = R.int(2, b === 10 ? 4 : b === 2 ? 6 : 3), N = Math.pow(b, k);
    return { q: `Evaluate log<sub>${b}</sub> ${commas(N)}.`, o: [k, frac(N, b), k + 1, b * k],
      w: ['', 'A logarithm is not a division. It asks: what power of the base gives the number?', `${b}<sup>${k + 1}</sup> = ${commas(N * b)}, too big.`, 'Logs count how many times you multiply by the base. Do not multiply the base by anything.'],
      e: `${b}<sup>${k}</sup> = ${commas(N)}, so log<sub>${b}</sub> ${commas(N)} = ${k}.` };
  } },
  { l: 4, n: 4, f: R => {
    const k = R.pick([2, 3]), T = Math.pow(10, k), a = R.pick([2, 4, 5, 8, 20, 25, 40, 50]), c = R.pick([2, 4, 5, 8]); const bv = T * c / a;
    if (!Number.isInteger(bv) || bv < 2 || bv === a) return null;
    return { q: `Simplify log 10 base: log ${a} + log ${bv} − log ${c}.`.replace('log 10 base: ', ''), o: [k, `log ${a + bv - c}`, k + 1, `log ${a * bv - c}`],
      w: ['', 'The laws of logs turn adding into multiplying, not adding the numbers.', `log ${T} = ${k}, not ${k + 1}.`, 'Subtracting logs means dividing the numbers.'],
      e: `log ${a} + log ${bv} − log ${c} = log (${a} × ${bv} ÷ ${c}) = log ${commas(T)} = ${k}.` };
  } },
  { l: 5, n: 3, f: R => {
    const x = R.int(2, 5), k = R.pick([2, 3]), N = Math.pow(x, k);
    return { q: `If log<sub>x</sub> ${N} = ${k}, find x.`, o: [x, frac(N, k), N * k, Math.pow(k, x) === N ? x + 1 : Math.pow(k, x)],
      w: ['', 'A log is not a division. Rewrite it as a power: x to some power equals the number.', 'Rewrite the log as a power instead of multiplying.', `That is ${k}<sup>${x}</sup>. The base x carries the power, not ${k}.`],
      e: `log<sub>x</sub> ${N} = ${k} means x<sup>${k}</sup> = ${N}. So x = ${x}.` };
  } }
];

/* ── Surds ── */
QG.surds = [
  { l: 2, n: 4, f: R => {
    const a = R.int(2, 7), b = R.pick([2, 3, 5, 6, 7]), N = a * a * b;
    return { q: `Simplify √${N}.`, o: [`${a}√${b}`, `${b}√${a}`, `${a * a}√${b}`, `${a}√${b * a}`],
      w: ['', `Take out the square factor ${a * a}, whose root is ${a}. ${b} stays inside.`, `${a * a} comes out as its square root, ${a}.`, `${N} = ${a * a} × ${b}. Only ${b} stays under the root.`],
      e: `${N} = ${a * a} × ${b}, so √${N} = √${a * a} × √${b} = ${a}√${b}.` };
  } },
  { l: 3, n: 4, f: R => {
    const b = R.pick([2, 3, 5]), m = R.int(2, 5), n = R.int(2, 6); if (m === n) return null;
    return { q: `Simplify √${m * m * b} + √${n * n * b}.`, o: [`${m + n}√${b}`, `√${(m * m + n * n) * b}`, `${m * n}√${b}`, `${m + n}√${2 * b}`],
      w: ['', 'You cannot add numbers under one root sign. Simplify each surd first.', 'Like surds are added, not multiplied.', `The root stays √${b}. Adding ${m}√${b} and ${n}√${b} is like adding ${m} and ${n} of the same thing.`],
      e: `√${m * m * b} = ${m}√${b} and √${n * n * b} = ${n}√${b}. Together: ${m + n}√${b}.` };
  } },
  { l: 3, n: 4, f: R => {
    const b = R.pick([2, 3, 5, 6, 7]), k = R.int(2, 12); if (k === b) return null;
    const g = gcd(k, b), top = k / g, bot = b / g;
    const ans = bot === 1 ? `${top}√${b}` : `${top === 1 ? '' : top}√${b}<span class="fr"><span></span></span>`;
    const form = bot === 1 ? `${top}√${b}` : `<span class="fr"><span>${top === 1 ? '' : top}√${b}</span><span>${bot}</span></span>`;
    return { q: `Rationalise ${fr(k, '√' + b)}.`, o: [form, `${k}√${b}`, frac(k, b), `<span class="fr"><span>√${k}</span><span>${b}</span></span>`],
      w: ['', `You multiplied the top by √${b} but not the bottom. The bottom becomes √${b} × √${b} = ${b}.`, `The √${b} disappeared from the top. Multiplying the top by √${b} keeps it there.`, `Only the bottom root should go. The top is ${k}√${b}, not √${k}.`],
      e: `Multiply top and bottom by √${b}: ${fr(k + '√' + b, b)}${bot === 1 || g > 1 ? ' = ' + form : ''}.` };
  } },
  { l: 4, n: 3, f: R => {
    const a = R.int(2, 7), b = R.pick([2, 3, 5, 6, 7, 10, 11]);
    return { q: `Simplify (${a} + √${b})(${a} − √${b}).`, o: [a * a - b, a * a + b, `${a * a} − √${b}`, a * a - 2 * b],
      w: ['', `√${b} × (−√${b}) = −${b}, so it is subtracted.`, `√${b} × √${b} = ${b}, not √${b}.`, `The middle terms cancel. Only ${a}² − (√${b})² is left.`],
      e: `(a + b)(a − b) = a² − b². Here: ${a}² − (√${b})² = ${a * a} − ${b} = ${a * a - b}.` };
  } },
  { l: 5, n: 3, f: R => {
    const p = R.pick([3, 5, 6, 7, 10]), q = R.pick([2, 3, 5]); if (p <= q) return null; const d = p - q;
    const ans = d === 1 ? `√${p} + √${q}` : `<span class="fr"><span>√${p} + √${q}</span><span>${d}</span></span>`;
    return { q: `Rationalise ${fr(1, `√${p} − √${q}`)}.`, o: [ans, d === 1 ? `√${p} − √${q}` : `<span class="fr"><span>√${p} − √${q}</span><span>${d}</span></span>`, `<span class="fr"><span>√${p} + √${q}</span><span>${p + q}</span></span>`, `√${p - q}`],
      w: ['', 'Multiply by the conjugate, √' + p + ' + √' + q + ', not by the same bracket.', `The bottom is (√${p})² − (√${q})² = ${p} − ${q} = ${d}, not ${p + q}.`, 'You cannot subtract under one root sign.'],
      e: `Multiply top and bottom by √${p} + √${q}. The bottom becomes ${p} − ${q} = ${d}, so the answer is ${ans}.` };
  } }
];

/* ── Sets ── */
QG.sets = [
  { l: 2, n: 4, f: R => {
    const both = R.int(2, 12), a = both + R.int(3, 20), b = both + R.int(3, 20), u = a + b - both;
    return { q: `n(A) = ${a}, n(B) = ${b} and n(A ∩ B) = ${both}. Find n(A ∪ B).`, o: [u, a + b, a + b - 2 * both, a + b + both],
      w: ['', `That counts the ${both} in both sets twice. Take them away once.`, `Take the overlap away once, not twice.`, 'The overlap is subtracted, not added.'],
      e: `n(A ∪ B) = n(A) + n(B) − n(A ∩ B) = ${a} + ${b} − ${both} = ${u}.` };
  } },
  { l: 3, n: 4, f: R => {
    const S = R.pick([['Physics', 'Chemistry', 'P', 'C'], ['Biology', 'Economics', 'B', 'E'], ['Literature', 'Government', 'L', 'G'], ['French', 'Music', 'F', 'M']]);
    const x = R.int(3, 15), p = x + R.int(4, 20), c = x + R.int(4, 20), none = R.int(1, 9), N = p + c - x + none;
    return { q: `In a class of ${N} students, ${p} offer ${S[0]}, ${c} offer ${S[1]} and ${none} offer neither. How many offer both?`,
      g: ['venn', { sets: [S[2], S[3]], v: { a: `${p} − x`, ab: 'x', b: `${c} − x`, out: String(none) }, u: `U = ${N}`, label: `Venn diagram: ${S[0]} only ${p} − x, both x, ${S[1]} only ${c} − x, neither ${none}, ${N} students in all` }],
      o: [x, p + c - N, N - none, p + c - x],
      w: ['', `You forgot the ${none} who offer neither. They are part of the ${N}.`, `${N - none} offer at least one subject, not both.`, 'That adds the overlap back in. Solve for x instead.'],
      e: `(${p} − x) + x + (${c} − x) + ${none} = ${N}, so ${p + c + none} − x = ${N} and x = ${x}.` };
  } },
  { l: 2, n: 3, f: R => {
    const n = R.int(3, 7), proper = R.f() < .5;
    const els = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].slice(0, n).join(', ');
    const ans = proper ? Math.pow(2, n) - 1 : Math.pow(2, n);
    return { q: `How many ${proper ? 'proper ' : ''}subsets has the set {${els}}?`, o: [ans, n * n, proper ? Math.pow(2, n) : Math.pow(2, n) - 1, 2 * n],
      w: ['', `A set with ${n} elements has 2<sup>${n}</sup> subsets, not ${n}².`, proper ? 'That counts the set itself. A proper subset must leave something out.' : 'That leaves out the set itself, which is also a subset (just not a proper one).', `Each element is either in or out: that is 2 × 2 × … ${n} times, not 2 × ${n}.`],
      e: `Each of the ${n} elements is either in or out, so there are 2<sup>${n}</sup> = ${Math.pow(2, n)} subsets${proper ? `. Leave out the set itself: ${ans} proper subsets` : ''}.` };
  } },
  { l: 3, n: 3, f: R => {
    const N = R.int(9, 12), U = Array.from({ length: N }, (_, i) => i + 1), kind = R.pick(['even', 'prime', 'mult3']);
    const isA = { even: v => v % 2 === 0, prime: v => [2, 3, 5, 7, 11].includes(v), mult3: v => v % 3 === 0 }[kind];
    const A = U.filter(isA), C = U.filter(v => !isA(v)), name = { even: 'even numbers', prime: 'prime numbers', mult3: 'multiples of 3' }[kind];
    const f = a => `{${a.join(', ')}}`;
    const wrong1 = kind === 'prime' ? U.filter(v => v !== 1 && !isA(v)) : C.slice(1), wrong2 = A;
    if (f(wrong1) === f(C)) return null;
    return { q: `U = {1, 2, 3, …, ${N}} and A is the set of ${name} in U. Find A′.`, o: [f(C), f(wrong1), f(wrong2), f(U)],
      w: ['', kind === 'prime' ? '1 is not a prime number, so it belongs in A′.' : 'You left out an element. A′ holds everything in U that is not in A.', 'That is A itself. A′ is everything else in U.', 'That is the whole of U. Take A out.'],
      e: `A = ${f(A)}. A′ is everything in U that is not in A: ${f(C)}.` };
  } }
];

/* ── Quadratic equations ── */
QG.quad = [
  { l: 2, n: 5, f: R => {
    const p = R.nz(-7, 7), q = R.nz(-7, 7); if (p === q || p === -q) return null;
    const b = -(p + q), c = p * q, s = v => `x = ${nm(v)}`;
    return { q: `Solve ${poly(1, b, c)} = 0.`, o: [`${s(Math.min(p, q))} or ${s(Math.max(p, q))}`, `${s(-Math.max(p, q))} or ${s(-Math.min(p, q))}`, `${s(Math.min(p, -q))} or ${s(Math.max(p, -q))}`, `${s(Math.abs(p))} or ${s(Math.abs(q))}`],
      w: ['', 'Those are the numbers in the brackets. Set each bracket equal to 0: the signs flip.', 'One sign is wrong. Check each root in the equation.', 'Check the signs: put each value into the equation.'],
      e: `Two numbers that multiply to ${nm(c)} and add to ${nm(b)} are ${nm(-p)} and ${nm(-q)}. So ${brk(p)}${brk(q)} = 0, giving x = ${nm(p)} or x = ${nm(q)}.` };
  } },
  { l: 3, n: 4, f: R => {
    const a = R.nz(2, 5), b = R.nz(-9, 9), c = R.nz(-9, 9);
    const sum = R.f() < .5;
    const o = sum ? [frac(-b, a), frac(b, a), frac(c, a), frac(-c, a)] : [frac(c, a), frac(-c, a), frac(-b, a), frac(b, a)];
    return { q: `Find the ${sum ? 'sum' : 'product'} of the roots of ${poly(a, b, c)} = 0.`, o,
      w: sum ? ['', 'The sum is −b ÷ a. You lost the minus sign.', 'c ÷ a is the product, not the sum.', 'The sum uses b, not c.'] : ['', 'The product is c ÷ a. There is no minus sign.', 'That is the sum of the roots.', 'The product uses c, not b.'],
      e: sum ? `Sum of roots = −b ÷ a = −(${nm(b)}) ÷ ${a} = ${frac(-b, a)}.` : `Product of roots = c ÷ a = ${nm(c)} ÷ ${a} = ${frac(c, a)}.` };
  } },
  { l: 3, n: 3, f: R => {
    const r = R.int(2, 8), c = r * r;
    return { q: `Find the positive value of k for which x² + kx + ${c} = 0 has equal roots.`, o: [2 * r, r, 4 * c, c],
      w: ['', `Check: k² = 4 × ${c} = ${4 * c}, so k = ${2 * r}, not ${r}.`, `${4 * c} is k², not k. Take the square root.`, `Equal roots need k² − 4 × ${c} = 0, so k² = ${4 * c}.`],
      e: `Equal roots: b² − 4ac = 0, so k² − 4(1)(${c}) = 0, k² = ${4 * c} and k = ${2 * r}.` };
  } },
  { l: 4, n: 4, f: R => {
    const p = R.nz(-6, 6), q = R.nz(-6, 6); if (p === q) return null;
    const S = p + q, P = p * q;
    return { q: `Find the equation whose roots are ${nm(p)} and ${nm(q)}.`, o: [`${poly(1, -S, P)} = 0`, `${poly(1, S, P)} = 0`, `${poly(1, -S, -P)} = 0`, `${poly(1, P, S)} = 0`].filter((x, i, A) => A.indexOf(x) === i).length < 4 ? null : [`${poly(1, -S, P)} = 0`, `${poly(1, S, P)} = 0`, `${poly(1, -S, -P)} = 0`, `${poly(1, P, S)} = 0`],
      w: ['', 'Use x² − (sum)x + (product) = 0. You forgot the minus in front of the sum.', 'The number term is the product of the roots, sign and all.', 'The sum goes with x and the product is the number term.'],
      e: `Sum = ${nm(S)}, product = ${nm(P)}. x² − (sum)x + (product) = 0 gives ${poly(1, -S, P)} = 0.` };
  } },
  { l: 5, n: 3, f: R => {
    const S = R.int(2, 7), P = R.nz(-5, 5);
    return { q: `If α and β are the roots of ${poly(1, -S, P)} = 0, find α² + β².`, o: [S * S - 2 * P, S * S, S * S + 2 * P, S * S - P],
      w: ['', '(α + β)² is not α² + β². You still need to take away 2αβ.', '(α + β)² = α² + 2αβ + β², so 2αβ is taken away, not added.', 'Take away 2αβ, not αβ.'],
      e: `α + β = ${S} and αβ = ${nm(P)}. α² + β² = (α + β)² − 2αβ = ${S * S} − ${P < 0 ? `(${nm(2 * P)})` : 2 * P} = ${S * S - 2 * P}.` };
  } }
];
/* the equation-from-roots template above returns null from o when options clash; tidy that */
QG.quad[3].f = (f => R => { const r = f(R); return r && r.o ? r : null; })(QG.quad[3].f);

/* ── Variation ── */
QG.variation = [
  { l: 2, n: 4, f: R => {
    const k = R.int(2, 9), x1 = R.int(2, 9), x2 = R.int(2, 15); if (x1 === x2) return null;
    const y1 = k * x1, y2 = k * x2;
    return { q: `y varies directly as x, and y = ${y1} when x = ${x1}. Find y when x = ${x2}.`, o: [y2, frac(y1 * x1, x2), y1 + x2 - x1, k],
      w: ['', 'That is inverse variation. Direct means y = kx.', 'Direct variation multiplies; it does not add.', `${k} is the constant k. Now multiply it by ${x2}.`],
      e: `y = kx, so k = ${y1} ÷ ${x1} = ${k}. When x = ${x2}, y = ${k} × ${x2} = ${y2}.` };
  } },
  { l: 3, n: 4, f: R => {
    const x1 = R.int(2, 9), x2 = R.int(2, 12), k = x1 * x2 * R.int(1, 4); if (x1 === x2) return null;
    const y1 = k / x1, y2 = k / x2;
    return { q: `y is inversely proportional to x, and y = ${y1} when x = ${x1}. Find y when x = ${x2}.`, o: [y2, frac(y1 * x2, x1), k, frac(y1, x2)],
      w: ['', 'That is direct variation. Inverse means y = k ÷ x, so y goes down as x goes up.', `${k} is k. Divide it by ${x2}.`, `First find k = ${y1} × ${x1}.`],
      e: `y = k ÷ x, so k = ${y1} × ${x1} = ${k}. When x = ${x2}, y = ${k} ÷ ${x2} = ${frac(k, x2)}.` };
  } },
  { l: 3, n: 4, f: R => {
    const k = R.int(1, 5), x1 = R.int(2, 6), x2 = R.int(2, 9); if (x1 === x2) return null;
    const y1 = k * x1 * x1, y2 = k * x2 * x2;
    return { q: `y varies as the square of x, and y = ${y1} when x = ${x1}. Find y when x = ${x2}.`, o: [y2, frac(y1 * x2, x1), k * x2, frac(y1 * x2 * x2, x1)],
      w: ['', 'You used y = kx. It is y = kx², so square x.', `${k} × ${x2} forgets the square: y = kx².`, `Find k first: k = ${y1} ÷ ${x1}² = ${k}.`],
      e: `y = kx², so k = ${y1} ÷ ${x1 * x1} = ${k}. When x = ${x2}, y = ${k} × ${x2 * x2} = ${y2}.` };
  } },
  { l: 4, n: 3, f: R => {
    const k = R.int(2, 6), x1 = R.int(2, 6), y1 = R.int(2, 5), x2 = R.int(2, 9), y2 = R.int(2, 6);
    const z1 = k * x1 / y1, z2 = k * x2 / y2;
    if (!Number.isInteger(z1) || !Number.isInteger(z2)) return null;
    return { q: `z varies directly as x and inversely as y. z = ${z1} when x = ${x1} and y = ${y1}. Find z when x = ${x2} and y = ${y2}.`, o: [z2, frac(k * y2, x2), k * x2 * y2, frac(z1 * x2, x1)],
      w: ['', 'Directly as x means x goes on top; inversely as y means y goes underneath. You swapped them.', 'Inversely as y means divide by y, not multiply.', `y changed too: divide by ${y2}.`],
      e: `z = kx ÷ y, so k = ${z1} × ${y1} ÷ ${x1} = ${k}. Then z = ${k} × ${x2} ÷ ${y2} = ${z2}.` };
  } }
];


/* ── Inequalities ── */
const ineqT = (s, k) => `x ${s} ${nm(k)}`;
QG.ineq = [
  { l: 2, n: 4, f: R => {
    const a = R.nz(-6, 6), x0 = R.int(-6, 8), b = R.int(-10, 10), c = a * x0 + b, s = R.pick(['<', '>', '≤', '≥']);
    const flip = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' }, ans = a > 0 ? s : flip[s];
    return { q: `Solve ${lin(a, b)} ${s} ${nm(c)}.`, o: [ineqT(ans, x0), ineqT(flip[ans], x0), ineqT(ans, (c + b) / a === x0 ? x0 + 1 : (c + b) / a), ineqT(ans, -x0 || x0 + 2)],
      w: ['', a < 0 ? `You divided by ${nm(a)}, a negative number, so the sign must turn round.` : 'Dividing by a positive number keeps the sign the same way round.', `Take ${nm(b)} to the other side by doing the opposite.`, 'Check the sign of your answer: try a value in the original inequality.'],
      e: `${a}x ${s} ${nm(c)} ${b < 0 ? '+' : MN} ${Math.abs(b)} = ${nm(c - b)}. Divide by ${nm(a)}${a < 0 ? ' and turn the sign round' : ''}: ${ineqT(ans, x0)}.` };
  } },
  { l: 3, n: 4, f: R => {
    const q = R.int(-5, 5), lo = R.int(-4, 3), hi = lo + R.int(2, 6), p = 2 * lo + q, r = 2 * hi + q;
    return { q: `Solve ${nm(p)} &lt; 2x ${sgnN(q)} &lt; ${nm(r)}.`, o: [`${nm(lo)} &lt; x &lt; ${nm(hi)}`, `${nm(p - q)} &lt; x &lt; ${nm(r - q)}`, `${nm((p + q) / 2)} &lt; x &lt; ${nm((r + q) / 2)}`, `${nm(p / 2)} &lt; x &lt; ${nm(r / 2)}`],
      w: ['', 'You took away the number but did not divide by 2.', `Take ${nm(q)} away from all three parts, do not add it.`, `Take away ${nm(q)} first, then divide by 2.`],
      e: `Take ${nm(q)} from all three parts: ${nm(p - q)} &lt; 2x &lt; ${nm(r - q)}. Divide by 2: ${nm(lo)} &lt; x &lt; ${nm(hi)}.` };
  } },
  { l: 4, n: 4, f: R => {
    const p = R.int(-6, 3), q = p + R.int(2, 7), lt = R.f() < .5;
    const inside = `${nm(p)} &lt; x &lt; ${nm(q)}`, outside = `x &lt; ${nm(p)} or x &gt; ${nm(q)}`;
    return { q: `Solve ${poly(1, -(p + q), p * q)} ${lt ? '&lt;' : '&gt;'} 0.`, o: [lt ? inside : outside, lt ? outside : inside, `${nm(-q)} &lt; x &lt; ${nm(-p)}`, `x &gt; ${nm(q)}`],
      w: ['', lt ? 'Below zero means between the roots: the cup dips under the axis between them.' : 'Above zero is outside the roots, where the cup is above the axis.', 'The roots come from (x − p)(x − q). Set each bracket to 0: the signs flip.', lt ? 'Check x = ' + (q + 1) + ': the expression is positive there.' : `Values below ${nm(p)} also work. Try x = ${p - 1}.`],
      e: `The roots are ${nm(p)} and ${nm(q)}. The graph is a cup, so it is below the axis between the roots and above it outside them. Answer: ${lt ? inside : outside}.`,
      g: ['parab', { a: 1, b: -(p + q), c: p * q, ax: [p - 2, q + 2, -Math.pow((q - p) / 2, 2) - 1, 6], pl: [p - 2, q + 2], roots: [p, q], label: `Graph of y = ${poly(1, -(p + q), p * q).replace(/<[^>]+>/g, '')} crossing the x-axis at ${p} and ${q}` }] };
  } },
  { l: 3, n: 3, f: R => {
    const lo = R.int(-4, 2), hi = lo + R.int(3, 6), inc = R.f() < .5;
    const ints = []; for (let i = lo + (inc ? 0 : 1); i <= hi - 1; i++) ints.push(i);
    return { q: `How many integers satisfy ${nm(lo)} ${inc ? '≤' : '&lt;'} x &lt; ${nm(hi)}?`, o: [ints.length, ints.length + 1, ints.length - 1, hi - lo + 1],
      w: ['', inc ? `x &lt; ${hi} means ${hi} itself is not included.` : `${nm(lo)} &lt; x leaves out ${nm(lo)}, and x &lt; ${hi} leaves out ${hi}.`, inc ? `${nm(lo)} ≤ x includes ${nm(lo)}.` : 'List them and count again.', 'That counts both ends. Check which ends are included.'],
      e: `The integers are ${ints.join(', ')}. That is ${ints.length}.`, g: ['nline', { ax: [lo - 1, hi + 1], seg: [[lo, hi, inc, false]], label: `Number line showing ${lo} ${inc ? 'less than or equal to' : 'less than'} x less than ${hi}` }] };
  } }
];

/* ── Progressions ── */
QG.prog = [
  { l: 2, n: 4, f: R => {
    const a = R.int(-5, 15), d = R.nz(-6, 7), n = R.int(8, 30), T = a + (n - 1) * d;
    const seq = [0, 1, 2, 3].map(i => nm(a + i * d)).join(', ');
    return { q: `Find the ${n}th term of the sequence ${seq}, …`, o: [T, a + n * d, n * d, a + (n - 2) * d],
      w: ['', `The first term already has no d added, so the ${n}th term has ${n - 1} lots of d, not ${n}.`, `You forgot the first term, ${nm(a)}.`, `That is the ${n - 1}th term.`],
      e: `a = ${nm(a)}, d = ${nm(d)}. T<sub>${n}</sub> = a + (n − 1)d = ${nm(a)} + ${n - 1} × ${d < 0 ? `(${nm(d)})` : d} = ${nm(T)}.` };
  } },
  { l: 3, n: 4, f: R => {
    const a = R.int(1, 12), d = R.int(1, 6), n = R.int(8, 25), S = n * (2 * a + (n - 1) * d) / 2;
    return { q: `Find the sum of the first ${n} terms of the arithmetic progression ${a}, ${a + d}, ${a + 2 * d}, …`, o: [S, n * (a + (n - 1) * d) / 2, n * (2 * a + (n - 1) * d), a + (n - 1) * d],
      w: ['', 'The formula has 2a, not a: S = ½n(2a + (n − 1)d).', 'You forgot the ½ in front.', `That is the ${n}th term, not the sum.`],
      e: `S<sub>n</sub> = ½n(2a + (n − 1)d) = ½ × ${n} × (${2 * a} + ${(n - 1) * d}) = ${S}.` };
  } },
  { l: 3, n: 4, f: R => {
    const a = R.pick([1, 2, 3, 4, 5]), r = R.pick([2, 3, -2]), n = R.int(5, r === 3 ? 6 : 8), T = a * Math.pow(r, n - 1);
    return { q: `Find the ${n}th term of the geometric progression ${[0, 1, 2].map(i => nm(a * Math.pow(r, i))).join(', ')}, …`, o: [nm(T), nm(a * Math.pow(r, n)), nm(a + (n - 1) * r), nm(a * r * (n - 1))],
      w: ['', `That is the ${n + 1}th term. The power is n − 1 = ${n - 1}.`, 'That is the formula for an arithmetic progression. In a GP you multiply by r each time.', `r is multiplied ${n - 1} times, so it is r<sup>${n - 1}</sup>, not ${n - 1} × r.`],
      e: `T<sub>${n}</sub> = ar<sup>n − 1</sup> = ${a} × (${nm(r)})<sup>${n - 1}</sup> = ${nm(T)}.` };
  } },
  { l: 4, n: 4, f: R => {
    const r = R.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [-1, 2], [-1, 3]]), a = R.int(2, 12) * (r[1] - r[0]) * (r[1] + Math.abs(r[0]));
    const S = a * r[1] / (r[1] - r[0]), Sp = a * r[1] / (r[1] + r[0]);
    if (!Number.isInteger(S)) return null;
    return { q: `Find the sum to infinity of the geometric progression whose first term is ${a} and common ratio is ${r[0] < 0 ? MN : ''}${fr(Math.abs(r[0]), r[1])}.`, o: [nm(S), frac(a * r[1], r[1] + r[0]), frac(a * (r[1] - r[0]), r[1]), frac(a * r[0], r[1] - r[0])],
      w: ['', 'The formula is a ÷ (1 − r). You used 1 + r.', 'Divide by (1 − r); do not multiply.', 'The top of the formula is a, the first term, not ar.'],
      e: `S<sub>∞</sub> = a ÷ (1 − r) = ${a} ÷ (1 − (${r[0] < 0 ? MN : ''}${fr(Math.abs(r[0]), r[1])})) = ${a} ÷ ${frac(r[1] - r[0], r[1])} = ${nm(S)}.` };
  } },
  { l: 4, n: 3, f: R => {
    const a = R.int(-5, 10), d = R.nz(-5, 6), m = R.int(2, 5), n = m + R.int(3, 8), Tm = a + (m - 1) * d, Tn = a + (n - 1) * d;
    return { q: `The ${m}th term of an arithmetic progression is ${nm(Tm)} and the ${n}th term is ${nm(Tn)}. Find the common difference.`, o: [nm(d), frac(Tn - Tm, n - m + 1), nm(Tn - Tm), frac(Tn - Tm, n)],
      w: ['', `From the ${m}th to the ${n}th term there are ${n - m} steps of d, not ${n - m + 1}.`, `That is ${n - m} lots of d. Divide by ${n - m}.`, `Divide by the number of steps between the terms, ${n - m}.`],
      e: `a + ${n - 1}d − (a + ${m - 1}d) = ${nm(Tn)} − ${Tm < 0 ? `(${nm(Tm)})` : Tm}, so ${n - m}d = ${nm(Tn - Tm)} and d = ${nm(d)}.` };
  } }
];

/* ── Polynomials ── */
const cub = (a, b, c, d) => { const t = [[a, 'x³'], [b, 'x²'], [c, 'x'], [d, '']]; let o = ''; t.forEach(([k, s]) => { if (!k) return; const v = Math.abs(k), body = s ? (v === 1 ? '' : v) + s : v; o += o ? (k < 0 ? ` ${MN} ` : ' + ') + body : (k < 0 ? MN : '') + body; }); return o; };
QG.poly = [
  { l: 2, n: 4, f: R => {
    const a = R.nz(-3, 3), b = R.int(-5, 5), c = R.int(-6, 6), x = R.nz(-3, 3), v = a * x * x + b * x + c, vm = a * x * x - b * x + c;
    if (v === vm) return null;
    return { q: `If f(x) = ${poly(a, b, c)}, find f(${nm(x)}).`, o: [nm(v), nm(vm), nm(a * 2 * x + b * x + c), nm(-a * x * x + b * x + c)],
      w: ['', `x × ${nm(b)} with x = ${nm(x)}: watch the sign of that term.`, `x² means x × x, not 2 × x.`, `(${nm(x)})² is positive. A square is never negative.`],
      e: `f(${nm(x)}) = ${a}(${nm(x)})² ${b < 0 ? MN : '+'} ${Math.abs(b)}(${nm(x)}) ${c < 0 ? MN : '+'} ${Math.abs(c)} = ${nm(a * x * x)} ${b * x < 0 ? MN : '+'} ${Math.abs(b * x)} ${c < 0 ? MN : '+'} ${Math.abs(c)} = ${nm(v)}.` };
  } },
  { l: 3, n: 4, f: R => {
    const b = R.int(-4, 4), c = R.int(-6, 6), d = R.int(-9, 9), k = R.nz(-3, 3), f = x => x * x * x + b * x * x + c * x + d;
    if (f(k) === f(-k)) return null;
    return { q: `Find the remainder when ${cub(1, b, c, d)} is divided by (x ${k > 0 ? MN : '+'} ${Math.abs(k)}).`, o: [nm(f(k)), nm(f(-k)), nm(d), nm(f(k) + 2 * d || f(k) + 1)],
      w: ['', `Dividing by (x ${k > 0 ? MN : '+'} ${Math.abs(k)}) means you put x = ${nm(k)}, not ${nm(-k)}.`, 'The number term alone is the remainder only when you divide by x.', 'Substitute carefully, term by term.'],
      e: `Remainder theorem: the remainder is f(${nm(k)}) = ${nm(f(k))}.` };
  } },
  { l: 4, n: 4, f: R => {
    const k = R.nz(-3, 3), b = R.int(-4, 4), d = R.int(-8, 8), p = -(k * k * k + b * k * k + d) / k;
    if (!Number.isInteger(p) || Math.abs(p) > 20) return null;
    const pw2 = -(k * k * k + b * k * k + d) / (-k);
    return { q: `(x ${k > 0 ? MN : '+'} ${Math.abs(k)}) is a factor of x³ ${b < 0 ? MN : '+'} ${Math.abs(b)}x² + px ${d < 0 ? MN : '+'} ${Math.abs(d)}. Find p.`.replace(' + 0x²', '').replace(' − 0x²', '').replace(' + 0', '').replace(' − 0', ''), o: [nm(p), nm(pw2), nm(-p), nm(p + k)],
      w: ['', `A factor (x ${k > 0 ? MN : '+'} ${Math.abs(k)}) means f(${nm(k)}) = 0. You used x = ${nm(-k)}.`, 'Check your signs when you rearrange for p.', `Put x = ${nm(k)} and set the whole expression equal to 0.`],
      e: `Factor theorem: f(${nm(k)}) = 0. So ${nm(k * k * k)} ${b * k * k < 0 ? MN : '+'} ${Math.abs(b * k * k)} ${k < 0 ? MN : '+'} ${Math.abs(k)}p ${d < 0 ? MN : '+'} ${Math.abs(d)} = 0, which gives p = ${nm(p)}.` };
  } }
];

/* ── Simultaneous equations ── */
QG.simul = [
  { l: 2, n: 4, f: R => {
    const x = R.int(-5, 9), y = R.int(-5, 9); if (x === y) return null;
    return { q: `Solve x + y = ${nm(x + y)} and x − y = ${nm(x - y)}.`, o: [`x = ${nm(x)}, y = ${nm(y)}`, `x = ${nm(y)}, y = ${nm(x)}`, `x = ${nm(x + y)}, y = ${nm(x - y)}`, `x = ${nm(x)}, y = ${nm(-y)}`],
      w: ['', 'You swapped x and y. Check in x − y.', 'Those are the right-hand sides, not the solution. Add the two equations.', 'Check y in the first equation.'],
      e: `Add the equations: 2x = ${nm(2 * x)}, so x = ${nm(x)}. Then y = ${nm(x + y)} − ${x < 0 ? `(${nm(x)})` : x} = ${nm(y)}.` };
  } },
  { l: 3, n: 4, f: R => {
    const x = R.int(-4, 6), y = R.int(-4, 6), a1 = R.int(1, 4), b1 = R.nz(-4, 4), a2 = R.int(1, 4), b2 = R.nz(-4, 4);
    if (a1 * b2 - a2 * b1 === 0 || x === y) return null;
    const eq = (a, b, c) => `${lin(a, 0).replace(/^(−?)1x/, '$1x')} ${b < 0 ? MN : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y = ${nm(c)}`;
    return { q: `Solve the equations ${eq(a1, b1, a1 * x + b1 * y)} and ${eq(a2, b2, a2 * x + b2 * y)}.`, o: [`x = ${nm(x)}, y = ${nm(y)}`, `x = ${nm(y)}, y = ${nm(x)}`, `x = ${nm(-x)}, y = ${nm(y)}`, `x = ${nm(x + 1)}, y = ${nm(y - 1)}`],
      w: ['', 'You swapped x and y. Put your answer back into both equations to check.', 'The sign of x is wrong. Check it in the first equation.', 'Check: these values do not fit both equations.'],
      e: `Eliminate one letter, solve for the other, then substitute back. x = ${nm(x)} and y = ${nm(y)} fit both equations.` };
  } },
  { l: 4, n: 3, f: R => {
    const p = R.int(1, 8) * 50, b = R.int(2, 12) * 50, m = R.int(2, 4), n = R.int(1, 3), m2 = R.int(1, 4), n2 = R.int(2, 5);
    if (m * n2 === m2 * n) return null;
    return { q: `${m} pens and ${n} book${n > 1 ? 's' : ''} cost ₦${commas(m * p + n * b)}. ${m2} pen${m2 > 1 ? 's' : ''} and ${n2} books cost ₦${commas(m2 * p + n2 * b)}. Find the cost of one book.`, o: [`₦${commas(b)}`, `₦${commas(p)}`, `₦${commas(b + p)}`, `₦${commas(Math.abs(b - p) || b + 50)}`],
      w: ['', 'That is the price of a pen.', 'That is a pen and a book together.', 'Check your answer in both statements.'],
      e: `Let a pen cost p and a book b. ${m}p + ${n}b = ${m * p + n * b} and ${m2}p + ${n2}b = ${m2 * p + n2 * b}. Solving gives p = ${p} and b = ${b}, so a book costs ₦${commas(b)}.` };
  } }
];

/* ── Binary operations ── */
const OPS = [
  ['a + b − ab', (a, b) => a + b - a * b], ['2a + b', (a, b) => 2 * a + b], ['a² − b', (a, b) => a * a - b], ['ab − a', (a, b) => a * b - a],
  ['a + b + 3', (a, b) => a + b + 3], ['3a − 2b', (a, b) => 3 * a - 2 * b], ['a² + b²', (a, b) => a * a + b * b], ['(a − b)²', (a, b) => (a - b) * (a - b)]];
QG.binop = [
  { l: 2, n: 5, f: R => {
    const [rule, op] = R.pick(OPS), a = R.nz(-4, 6), b = R.nz(-4, 6); if (a === b) return null;
    const v = op(a, b), sw = op(b, a);
    return { q: `A binary operation * is defined by a * b = ${rule}. Find ${nm(a)} * ${nm(b)}.`, o: [nm(v), nm(sw), nm(a * b), nm(a + b)],
      w: ['', `a is the first number, ${nm(a)}, and b is the second, ${nm(b)}. You swapped them.`, '* is not ordinary multiplication. Use the rule given.', '* is not ordinary addition. Use the rule given.'],
      e: `Put a = ${nm(a)} and b = ${nm(b)} into ${rule}: the answer is ${nm(v)}.` };
  } },
  { l: 3, n: 3, f: R => {
    const k = R.nz(-6, 6);
    return { q: `A binary operation ∘ is defined on the real numbers by a ∘ b = a + b ${sgnN(k)}. Find the identity element.`, o: [nm(-k), nm(k), '0', '1'],
      w: ['', `Check: a ∘ ${nm(k)} = a ${sgnN(2 * k)}, not a.`, `a ∘ 0 = a ${sgnN(k)}, not a. The ${nm(k)} gets in the way.`, `1 is the identity for multiplication, not for this operation.`],
      e: `The identity e satisfies a ∘ e = a. So a + e ${sgnN(k)} = a, which gives e = ${nm(-k)}.` };
  } },
  { l: 4, n: 3, f: R => {
    const k = R.nz(-5, 5), a = R.nz(-6, 6), inv = -a - 2 * k;
    return { q: `a ∘ b = a + b ${sgnN(k)} on the real numbers. The identity element is ${nm(-k)}. Find the inverse of ${nm(a)}.`, o: [nm(inv), nm(-a), nm(-a - k), nm(1 / a === Math.round(1 / a) ? a + 1 : -a + 2 * k)],
      w: ['', `Check: ${nm(a)} ∘ ${nm(-a)} = ${nm(k)}, not the identity ${nm(-k)}.`, `That gives ${nm(a)} ∘ ${nm(-a - k)} = 0. The inverse must give the identity, ${nm(-k)}.`, 'Use a ∘ a⁻¹ = e and solve.'],
      e: `${nm(a)} ∘ y = ${nm(-k)} means ${nm(a)} + y ${sgnN(k)} = ${nm(-k)}, so y = ${nm(inv)}.` };
  } },
  { l: 4, n: 3, f: R => {
    const [rule, op] = R.pick(OPS.slice(0, 6)), a = R.int(1, 4), b = R.int(1, 4), c = R.int(1, 3), v = op(op(a, b), c);
    if (Math.abs(v) > 200) return null;
    return { q: `If a * b = ${rule}, evaluate (${a} * ${b}) * ${c}.`, o: [nm(v), nm(op(a, op(b, c))), nm(op(a, b)), nm(op(a, b) * c)],
      w: ['', 'That works out the second bracket first. Do the bracket you are given first.', `That is only ${a} * ${b}. You still need to * it with ${c}.`, '* is not ordinary multiplication.'],
      e: `${a} * ${b} = ${nm(op(a, b))}. Then ${nm(op(a, b))} * ${c} = ${nm(v)}.` };
  } }
];

/* ── Matrices and determinants ── */
QG.matrix = [
  { l: 2, n: 4, f: R => {
    const [a, b, c, d] = [R.int(-5, 7), R.int(-5, 7), R.int(-5, 7), R.int(-5, 7)], D = a * d - b * c;
    return { q: `Find the determinant of ${mx([[nm(a), nm(b)], [nm(c), nm(d)]])}.`, o: [nm(D), nm(a * d + b * c), nm(b * c - a * d), nm(a * b - c * d)],
      w: ['', 'The two diagonal products are subtracted, not added.', 'It is the main diagonal minus the other one, not the other way round.', 'Multiply along the diagonals, not along the rows.'],
      e: `|A| = (${nm(a)} × ${d < 0 ? `(${nm(d)})` : d}) − (${nm(b)} × ${c < 0 ? `(${nm(c)})` : c}) = ${nm(a * d)} − ${b * c < 0 ? `(${nm(b * c)})` : b * c} = ${nm(D)}.` };
  } },
  { l: 3, n: 4, f: R => {
    const a = R.int(1, 6), b = R.int(-4, 5), d = R.int(1, 6), x = R.int(-5, 6), D = a * d - b * x;
    return { q: `If ${mx([[a, nm(b)], ['x', d]], 'mx dt')} = ${nm(D)}, find x.`, o: [nm(x), nm(-x), nm((D - a * d) / b === x ? x + 1 : -(D - a * d)), nm(a * d - D)],
      w: ['', 'Check the sign: the determinant subtracts b × x.', 'Write it out: ad − bx = the value, then solve for x.', 'You stopped before dividing by b.'],
      e: `${a} × ${d} − (${nm(b)})x = ${nm(D)}, so ${a * d} − ${b < 0 ? `(${nm(b)})` : b}x = ${nm(D)} and x = ${nm(x)}.` };
  } },
  { l: 3, n: 3, f: R => {
    const A = [[R.int(-3, 4), R.int(-3, 4)], [R.int(-3, 4), R.int(-3, 4)]], B = [[R.int(-3, 4), R.int(-3, 4)], [R.int(-3, 4), R.int(-3, 4)]];
    const P = (X, Y) => [[X[0][0] * Y[0][0] + X[0][1] * Y[1][0], X[0][0] * Y[0][1] + X[0][1] * Y[1][1]], [X[1][0] * Y[0][0] + X[1][1] * Y[1][0], X[1][0] * Y[0][1] + X[1][1] * Y[1][1]]];
    const AB = P(A, B), BA = P(B, A), el = [[A[0][0] * B[0][0], A[0][1] * B[0][1]], [A[1][0] * B[1][0], A[1][1] * B[1][1]]];
    const f = M => mx(M.map(r => r.map(nm)));
    const odd = [[AB[0][0], AB[1][0]], [AB[0][1], AB[1][1]]];
    return { q: `Find ${f(A)} ${f(B)}.`, o: [f(AB), f(BA), f(el), f(odd)],
      w: ['', 'That is the product in the other order. Matrix multiplication is row of the first times column of the second.', 'You multiplied matching entries. Multiply rows by columns.', 'Two entries are in the wrong places: row 1 times column 2 goes top right.'],
      e: `Row × column: top left = ${nm(A[0][0])} × ${nm(B[0][0])} + ${nm(A[0][1])} × ${nm(B[1][0])} = ${nm(AB[0][0])}, and so on. The product is ${f(AB)}.` };
  } },
  { l: 4, n: 3, f: R => {
    const a = R.int(1, 6), b = R.int(1, 5), c = R.int(1, 5), d = R.int(1, 6), D = a * d - b * c; if (Math.abs(D) !== 1 && Math.abs(D) !== 2) return null;
    const inv = [[d, -b], [-c, a]].map(r => r.map(v => frac(v, D)));
    const wrong1 = [[a, -b], [-c, d]].map(r => r.map(v => frac(v, D))), wrong2 = [[d, b], [c, a]].map(r => r.map(v => frac(v, D))), wrong3 = [[d, -b], [-c, a]].map(r => r.map(nm));
    if (Math.abs(D) === 1 && D === 1) return null;
    return { q: `Find the inverse of ${mx([[a, b], [c, d]])}.`, o: [mx(inv), mx(wrong1), mx(wrong2), mx(wrong3)],
      w: ['', 'Swap a and d, the main diagonal. You left them where they were.', 'b and c change sign; you kept their signs.', `You forgot to divide by the determinant, ${nm(D)}.`],
      e: `The determinant is ${a} × ${d} − ${b} × ${c} = ${nm(D)}. Swap a and d, change the signs of b and c, then divide by ${nm(D)}.` };
  } },
  { l: 5, n: 3, f: R => {
    const M = [[R.int(-2, 3), R.int(-2, 3), R.int(-2, 3)], [R.int(-2, 3), R.int(-2, 3), R.int(-2, 3)], [R.int(-2, 3), R.int(-2, 3), R.int(-2, 3)]];
    const [[a, b, c], [d, e, f], [g, h, i]] = M, D = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g), Dp = a * (e * i - f * h) + b * (d * i - f * g) + c * (d * h - e * g);
    if (D === Dp) return null;
    return { q: `Evaluate ${mx(M.map(r => r.map(nm)), 'mx dt')}.`, o: [nm(D), nm(Dp), nm(-D || D + 3), nm(a * e * i + b * f * g + c * d * h)],
      w: ['', 'The middle term takes a minus sign: + − +.', 'Check the sign of each 2 by 2 determinant: it is (ei − fh), not (fh − ei).', 'That is only the three forward diagonals. You need the full expansion.'],
      e: `Expand along the top row with signs + − +: ${nm(a)}(${nm(e * i - f * h)}) − ${b < 0 ? `(${nm(b)})` : b}(${nm(d * i - f * g)}) + ${c < 0 ? `(${nm(c)})` : c}(${nm(d * h - e * g)}) = ${nm(D)}.` };
  } }
];

/* ── Angles, triangles, polygons and circles ── */
QG.geom = [
  { l: 2, n: 4, f: R => {
    const A = R.int(25, 85), B = R.int(25, 85), C = 180 - A - B; if (C < 20) return null;
    return { q: `Find the angle marked x in the triangle.`, g: ['tri', { A, B, a: `${A}°`, b: `${B}°`, c: 'x', label: `Triangle with angles ${A}°, ${B}° and x` }], o: [`${C}°`, `${A + B}°`, `${360 - A - B}°`, `${Math.abs(A - B) || C + 10}°`],
      w: ['', `${A + B}° is the two angles added. The three angles together make 180°.`, 'The angles in a triangle add up to 180°, not 360°.', 'That is the difference between the two angles. Use the angle sum: 180° minus the other two.'],
      e: `x = 180° − ${A}° − ${B}° = ${C}°.` };
  } },
  { l: 2, n: 3, f: R => {
    const A = R.int(30, 80), B = R.int(30, 80), C = 180 - A - B; if (C < 20) return null;
    return { q: `Find the exterior angle marked y.`, g: ['tri', { A, B, a: `${A}°`, b: `${B}°`, e: 'y', label: `Triangle with interior angles ${A}° and ${B}° and an exterior angle y at the third corner` }], o: [`${A + B}°`, `${C}°`, `${180 - A}°`, `${A + B + C - 10}°`],
      w: ['', `${C}° is the third interior angle. y is outside the triangle, on the straight line.`, `That only uses one of the two opposite angles.`, 'The exterior angle equals the two opposite interior angles added together.'],
      e: `The exterior angle equals the sum of the two opposite interior angles: y = ${A}° + ${B}° = ${A + B}°.` };
  } },
  { l: 3, n: 4, f: R => {
    const n = R.pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 36]), kind = R.pick(['int', 'sides', 'sum']);
    const ext = 360 / n, int = 180 - ext, sum = (n - 2) * 180;
    if (kind === 'int') return { q: `Find each interior angle of a regular polygon with ${n} sides.`, o: [`${int}°`, `${ext}°`, `${sum}°`, `${180 * n / (n + 2) === int ? int + 5 : Math.round(180 * (n - 1) / n)}°`],
      w: ['', 'That is the exterior angle. Interior = 180° minus the exterior angle.', 'That is the sum of all the interior angles. Divide by the number of sides.', `Use (n − 2) × 180° ÷ n.`], e: `Each exterior angle is 360° ÷ ${n} = ${ext}°, so each interior angle is 180° − ${ext}° = ${int}°.` };
    if (kind === 'sides') return { q: `Each interior angle of a regular polygon is ${int}°. How many sides has it?`, o: [n, 360 / int > 2 && Number.isInteger(360 / int) ? 360 / int + 1 : n + 2, Math.round(int / 10) || n - 1, n * 2],
      w: ['', 'Work with the exterior angle: 180° minus the interior angle.', 'Divide 360° by the exterior angle, not the interior angle by 10.', 'Check: each exterior angle would be ' + (360 / (n * 2)) + '°.'], e: `Exterior angle = 180° − ${int}° = ${ext}°. Number of sides = 360° ÷ ${ext}° = ${n}.` };
    return { q: `Find the sum of the interior angles of a polygon with ${n} sides.`, o: [`${commas(sum)}°`, `${commas(n * 180)}°`, '360°', `${commas((n - 1) * 180)}°`],
      w: ['', 'Use (n − 2) × 180°, not n × 180°.', '360° is the sum of the exterior angles.', 'From one corner the polygon splits into n − 2 triangles, not n − 1.'], e: `(${n} − 2) × 180° = ${commas(sum)}°.` };
  } },
  { l: 3, n: 4, f: R => {
    const cen = R.int(30, 80) * 2, A = R.int(190, 215), B = A + cen; if (B > 350) return null;
    const P = R.int(60, 120);
    return { q: `O is the centre of the circle. ∠AOB = ${cen}°. Find ∠APB.`, g: ['circ', { pts: { A, B, P }, segs: [['O', 'A'], ['O', 'B'], ['P', 'A'], ['P', 'B']], marks: [['O', 'A', 'B', `${cen}°`], ['P', 'A', 'B', '?']], label: `Circle with centre O. Angle AOB is ${cen} degrees. P is on the major arc` }],
      o: [`${cen / 2}°`, `${cen}°`, `${180 - cen / 2}°`, `${2 * cen > 360 ? 360 - cen : 2 * cen}°`],
      w: ['', 'The angle at the circumference is half the angle at the centre, not equal to it.', 'That would be the angle if P were on the minor arc.', 'The angle at the centre is the bigger one. Halve it, do not double it.'],
      e: `∠AOB and ∠APB stand on the same arc AB, so ∠APB = ½ × ${cen}° = ${cen / 2}°.` };
  } },
  { l: 3, n: 4, f: R => {
    const x = R.int(50, 130), A = 200, sft = R.int(30, 70); if (sft + 2 * x > 330) return null;
    const pts = { A, B: md360(A + sft), C: md360(A + sft + x), D: md360(A + sft + 2 * x) };
    return { q: `ABCD is a cyclic quadrilateral. ∠BAD = ${x}°. Find ∠BCD.`, g: ['circ', { pts, segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']], marks: [['A', 'B', 'D', `${x}°`], ['C', 'B', 'D', '?']], label: `Cyclic quadrilateral ABCD with angle BAD ${x} degrees` }],
      o: [`${180 - x}°`, `${x}°`, `${2 * x > 360 ? x / 2 : 2 * x}°`, `${360 - x}°`],
      w: ['', 'Opposite angles of a cyclic quadrilateral add up to 180°. They are only equal when both are 90°.', 'Doubling is for the angle at the centre. This angle is at the circumference.', 'Opposite angles add to 180°, not 360°.'],
      e: `A and C are opposite corners, so ∠BCD = 180° − ${x}° = ${180 - x}°.` };
  } },
  { l: 4, n: 4, f: R => {
    const base = R.int(15, 40), cen = 180 - 2 * base, A = 208, B = A + cen; if (B > 355) return null;
    return { q: `O is the centre and ∠OAB = ${base}°. Find the angle x.`, g: ['circ', { pts: { A, B, P: 100 }, segs: [['O', 'A'], ['O', 'B'], ['A', 'B'], ['P', 'A'], ['P', 'B']], marks: [['A', 'O', 'B', `${base}°`], ['P', 'A', 'B', 'x']], label: `Circle with centre O. Angle OAB is ${base} degrees. P is on the major arc and angle APB is x` }],
      o: [`${cen / 2}°`, `${cen}°`, `${2 * base}°`, `${base}°`],
      w: ['', `${cen}° is ∠AOB, the angle at the centre. x is half of it.`, `${2 * base}° is the two base angles together. Use them to find ∠AOB first.`, `${base}° is a base angle of triangle OAB, not the angle at P.`],
      e: `OA = OB (radii), so ∠OBA = ${base}° too. ∠AOB = 180° − ${2 * base}° = ${cen}°, and x = ${cen}° ÷ 2 = ${cen / 2}°.` };
  } }
];


/* ── Mensuration (π = 22/7 unless stated) ── */
const PIF = `<span class="fr"><span>22</span><span>7</span></span>`;
QG.mens = [
  { l: 2, n: 4, f: R => {
    const r = R.pick([7, 14, 21, 3.5, 28]), area = R.f() < .5, A = 22 / 7 * r * r, C = 2 * 22 / 7 * r;
    const v = area ? A : C, o = area ? [A, C, 22 / 7 * r * 2 * r, 22 / 7 * r] : [C, A, 22 / 7 * r, 2 * r * r];
    return { q: `Find the ${area ? 'area' : 'circumference'} of a circle of radius ${r} cm. (Take π = ${PIF})`, o: o.map(x => `${nm(x)} cm${area ? '²' : ''}`),
      w: area ? ['', 'That is the circumference. Area is πr².', 'r² means r × r, so do not multiply by the diameter.', 'You forgot to square the radius.'] : ['', 'That is the area. Circumference is 2πr.', 'That is half the circumference. You forgot the 2.', 'Circumference uses π, not r².'],
      e: area ? `A = πr² = ${PIF} × ${r} × ${r} = ${nm(A)} cm².` : `C = 2πr = 2 × ${PIF} × ${r} = ${nm(C)} cm.` };
  } },
  { l: 3, n: 4, f: R => {
    const r = R.pick([7, 14, 21]), th = R.pick([30, 45, 60, 90, 120, 135, 150, 210, 240, 270]), arc = R.f() < .5;
    const L = th / 360 * 2 * 22 / 7 * r, A = th / 360 * 22 / 7 * r * r;
    if (!Number.isInteger(L * 2) || !Number.isInteger(A * 2)) return null;
    const v = arc ? L : A;
    return { q: `A sector of a circle of radius ${r} cm has an angle of ${th}° at the centre. Find the ${arc ? 'length of its arc' : 'area of the sector'}. (Take π = ${PIF})`,
      g: ['sector', { deg: th, r: `${r} cm`, a: `${th}°`, arc: arc ? '?' : '', label: `Sector with radius ${r} cm and angle ${th} degrees` }],
      o: arc ? [L, A, 2 * 22 / 7 * r, L / 2].map(x => `${nm(x)} cm`) : [A, L, 22 / 7 * r * r, A * 2].map(x => `${nm(x)} cm²`),
      w: arc ? ['', 'That is the area of the sector. The arc is a length: θ/360 × 2πr.', 'That is the whole circumference. Take only the fraction θ/360 of it.', 'You used πr instead of 2πr.'] : ['', 'That is the arc length. Area uses πr².', 'That is the whole circle. Take the fraction θ/360 of it.', 'Check the fraction: θ/360, not θ/180.'],
      e: arc ? `Arc = ${fr(th, 360)} × 2 × ${PIF} × ${r} = ${nm(L)} cm.` : `Area = ${fr(th, 360)} × ${PIF} × ${r}² = ${nm(A)} cm².` };
  } },
  { l: 3, n: 4, f: R => {
    const r = R.pick([7, 14, 3.5, 21]), h = R.int(2, 12) * (r === 3.5 ? 2 : 1), V = 22 / 7 * r * r * h;
    return { q: `Find the volume of a cylinder of radius ${r} cm and height ${h} cm. (Take π = ${PIF})`, g: ['solid', { kind: 'cyl', rn: 7, hn: 9, r: `${r} cm`, h: `${h} cm`, label: `Cylinder of radius ${r} cm and height ${h} cm` }],
      o: [`${commas(nm(V))} cm³`, `${commas(nm(2 * 22 / 7 * r * h))} cm³`, `${commas(nm(V / 3))} cm³`, `${commas(nm(22 / 7 * r * h))} cm³`],
      w: ['', 'That is the curved surface area, 2πrh. Volume is πr²h.', 'Dividing by 3 is for a cone. A cylinder is πr²h.', 'You forgot to square the radius.'],
      e: `V = πr²h = ${PIF} × ${r}² × ${h} = ${commas(nm(V))} cm³.` };
  } },
  { l: 4, n: 3, f: R => {
    const r = R.pick([7, 14, 21]), h = R.int(3, 12) * 3, V = 22 / 7 * r * r * h / 3;
    return { q: `Find the volume of a cone with base radius ${r} cm and height ${h} cm. (Take π = ${PIF})`, g: ['solid', { kind: 'cone', rn: 7, hn: 9, r: `${r} cm`, h: `${h} cm`, label: `Cone of radius ${r} cm and height ${h} cm` }],
      o: [`${commas(nm(V))} cm³`, `${commas(nm(V * 3))} cm³`, `${commas(nm(22 / 7 * r * h / 3))} cm³`, `${commas(nm(V / 2))} cm³`],
      w: ['', 'That is the cylinder with the same base and height. A cone is a third of it.', 'You forgot to square the radius.', 'The cone formula has ⅓, not ½.'],
      e: `V = ⅓πr²h = ⅓ × ${PIF} × ${r}² × ${h} = ${commas(nm(V))} cm³.` };
  } },
  { l: 4, n: 3, f: R => {
    const r = R.pick([7, 14, 3.5]), h = R.int(3, 15), T = 2 * 22 / 7 * r * (r + h), C = 2 * 22 / 7 * r * h;
    if (!Number.isInteger(T)) return null;
    return { q: `Find the total surface area of a closed cylinder of radius ${r} cm and height ${h} cm. (Take π = ${PIF})`, o: [`${commas(nm(T))} cm²`, `${commas(nm(C))} cm²`, `${commas(nm(C + 22 / 7 * r * r))} cm²`, `${commas(nm(22 / 7 * r * r * h))} cm²`],
      w: ['', 'That is only the curved surface. A closed cylinder also has two circular ends.', 'A closed cylinder has two ends, not one.', 'That is the volume, not the surface area.'],
      e: `Total = 2πrh + 2πr² = 2πr(h + r) = 2 × ${PIF} × ${r} × ${nm(h + r)} = ${commas(nm(T))} cm².` };
  } }
];

/* ── Coordinate geometry ── */
const pt = (x, y) => `(${nm(x)}, ${nm(y)})`;
QG.coord = [
  { l: 2, n: 4, f: R => {
    const x1 = R.int(-4, 4), y1 = R.int(-4, 4), dx = R.nz(-6, 6), dy = R.nz(-6, 6), x2 = x1 + dx, y2 = y1 + dy;
    return { q: `Find the gradient of the line joining ${pt(x1, y1)} and ${pt(x2, y2)}.`, o: [frac(dy, dx), frac(dx, dy), frac(-dy, dx), frac(y2 + y1, x2 + x1 || 1)],
      w: ['', 'Gradient is the change in y divided by the change in x. You turned it upside down.', 'Check the sign: subtract the coordinates in the same order, top and bottom.', 'Subtract the coordinates, do not add them.'],
      e: `m = (${nm(y2)} − ${y1 < 0 ? `(${nm(y1)})` : y1}) ÷ (${nm(x2)} − ${x1 < 0 ? `(${nm(x1)})` : x1}) = ${nm(dy)} ÷ ${nm(dx)} = ${frac(dy, dx)}.`,
      g: ['grid', { ax: [Math.min(x1, x2, 0) - 1, Math.max(x1, x2, 0) + 1, Math.min(y1, y2, 0) - 1, Math.max(y1, y2, 0) + 1], pts: [[x1, y1, pt(x1, y1)], [x2, y2, pt(x2, y2)]], segs: [[x1, y1, x2, y2]], label: `Points ${pt(x1, y1)} and ${pt(x2, y2)} joined by a line` }] };
  } },
  { l: 2, n: 4, f: R => {
    const x1 = R.int(-6, 6), y1 = R.int(-6, 6), x2 = x1 + 2 * R.nz(-5, 5), y2 = y1 + 2 * R.nz(-5, 5);
    return { q: `Find the midpoint of ${pt(x1, y1)} and ${pt(x2, y2)}.`, o: [pt((x1 + x2) / 2, (y1 + y2) / 2), pt((x2 - x1) / 2, (y2 - y1) / 2), pt(x1 + x2, y1 + y2), pt((x1 + y1) / 2 || 1, (x2 + y2) / 2)],
      w: ['', 'Add the coordinates, then halve. You subtracted.', 'You added but forgot to divide by 2.', 'Pair the x-coordinates together and the y-coordinates together.'],
      e: `Midpoint = ((${nm(x1)} + ${nm(x2)}) ÷ 2, (${nm(y1)} + ${nm(y2)}) ÷ 2) = ${pt((x1 + x2) / 2, (y1 + y2) / 2)}.` };
  } },
  { l: 3, n: 4, f: R => {
    const [a, b, c] = R.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]]), x1 = R.int(-4, 3), y1 = R.int(-4, 3), sx = R.pick([1, -1]), sy = R.pick([1, -1]);
    const x2 = x1 + sx * a, y2 = y1 + sy * b;
    return { q: `Find the distance between ${pt(x1, y1)} and ${pt(x2, y2)}.`, o: [`${c} units`, `${a + b} units`, `${c * c} units`, `√${Math.abs(a * a - b * b)} units`],
      w: ['', `You added the run and the rise. Use Pythagoras: √(${a}² + ${b}²).`, 'You forgot to take the square root.', 'Add the squares, do not subtract them.'],
      e: `d = √(${a}² + ${b}²) = √${a * a + b * b} = ${c} units.` };
  } },
  { l: 3, n: 4, f: R => {
    const m = R.nz(-4, 4), x1 = R.int(-4, 4), y1 = R.int(-6, 6), c = y1 - m * x1;
    return { q: `Find the equation of the line with gradient ${nm(m)} that passes through ${pt(x1, y1)}.`, o: [`y = ${poly(0, m, c)}`, `y = ${poly(0, m, y1 + m * x1)}`, `y = ${poly(0, m, y1)}`, `y = ${poly(0, x1 || 1, c)}`],
      w: ['', 'Check the sign when you rearrange y − y₁ = m(x − x₁).', 'The number term is c, which you find by putting the point in. It is not just the y-coordinate.', 'The gradient is the number in front of x.'],
      e: `y − ${y1 < 0 ? `(${nm(y1)})` : y1} = ${nm(m)}(x − ${x1 < 0 ? `(${nm(x1)})` : x1}), which gives y = ${poly(0, m, c)}.` };
  } },
  { l: 4, n: 3, f: R => {
    const p = R.nz(-5, 5), q = R.pick([1, 2, 3, 4]); if (gcd(p, q) > 1) return null;
    return { q: `A line has gradient ${frac(p, q)}. Find the gradient of a line perpendicular to it.`, o: [frac(-q, p), frac(q, p), frac(-p, q), frac(p, q)],
      w: ['', 'Perpendicular gradients multiply to give −1, so the sign changes too.', 'Turn it upside down as well as changing the sign.', 'That is a parallel line. Perpendicular lines have m₁ × m₂ = −1.'],
      e: `m₁ × m₂ = −1, so m₂ = −1 ÷ ${frac(p, q)} = ${frac(-q, p)}.` };
  } }
];

/* ── Trigonometry ── */
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10]];
QG.trig = [
  { l: 2, n: 5, f: R => {
    const [o, a, h] = R.pick(TRIPLES), which = R.pick(['sin', 'cos', 'tan']), val = { sin: [o, h], cos: [a, h], tan: [o, a] }[which];
    return { q: `In the triangle, find ${which} θ.`, g: ['rtri', { b: a, h: o, base: String(a), ht: String(o), hyp: String(h), ang: 'θ', label: `Right-angled triangle with angle θ, adjacent side ${a}, opposite side ${o} and hypotenuse ${h}` }],
      o: [frac(...val), frac(val[1], val[0]), ...(which === 'sin' ? [frac(a, h), frac(o, a)] : which === 'cos' ? [frac(o, h), frac(a, o)] : [frac(a, o) === frac(val[1], val[0]) ? frac(o, h) : frac(a, o), frac(a, h)])],
      w: ['', 'You turned the ratio upside down.', 'Check SOH CAH TOA: you used the wrong sides for this ratio.', 'Check which side is opposite θ and which is next to it.'],
      e: `${which} θ = ${{ sin: 'opposite ÷ hypotenuse', cos: 'adjacent ÷ hypotenuse', tan: 'opposite ÷ adjacent' }[which]} = ${frac(...val)}.` };
  } },
  { l: 3, n: 4, f: R => {
    const [o, a, h] = R.pick(TRIPLES), [g, k] = R.f() < .5 ? ['sin', 'cos'] : ['cos', 'sin'], given = g === 'sin' ? [o, h] : [a, h], ans = k === 'sin' ? [o, h] : [a, h];
    return { q: `If ${g} θ = ${frac(...given)} and θ is acute, find ${k} θ.`, o: [frac(...ans), frac(o, a), frac(h - given[0], h), frac(a, o)],
      w: ['', 'That is tan θ, not the ratio asked for.', `${k} θ is not 1 minus ${g} θ. Find the missing side with Pythagoras.`, 'That is 1 ÷ tan θ.'],
      e: `Draw a right triangle with ${g === 'sin' ? 'opposite' : 'adjacent'} ${given[0]} and hypotenuse ${h}. The third side is √(${h}² − ${given[0]}²) = ${g === 'sin' ? a : o}. So ${k} θ = ${frac(...ans)}.` };
  } },
  { l: 3, n: 4, f: R => {
    const ang = R.pick([30, 60]), h = R.int(2, 12) * 2, opp = ang === 30;
    const v = ang === 30 ? h / 2 : `${h / 2}√3`, alt = ang === 30 ? `${h / 2}√3` : h / 2;
    return { q: `A ladder ${h} m long leans against a wall and makes an angle of ${ang}° with the ground. How high up the wall does it reach?`, o: [`${v} m`, `${alt} m`, `${h * 2} m`, `${h}√2 m`],
      w: ['', `That uses the wrong angle. The height is opposite the ${ang}° angle: height = ${h} sin ${ang}°.`, 'The height is shorter than the ladder, so it cannot be bigger.', `√2 comes from 45°. This angle is ${ang}°.`],
      e: `Height = ${h} × sin ${ang}° = ${h} × ${ang === 30 ? '½' : '√3/2'} = ${v} m.` };
  } },
  { l: 4, n: 4, f: R => {
    const base = R.pick([30, 45, 60]), quad = R.pick([2, 3, 4]), A = quad === 2 ? 180 - base : quad === 3 ? 180 + base : 360 - base, fn = R.pick(['sin', 'cos', 'tan']);
    const T = { sin: { 30: '½', 45: '√2/2', 60: '√3/2' }, cos: { 30: '√3/2', 45: '√2/2', 60: '½' }, tan: { 30: '√3/3', 45: '1', 60: '√3' } };
    const val = T[fn][base], oval = fn === 'sin' ? T.cos[base] : fn === 'cos' ? T.sin[base] : T.tan[90 - base];
    const pos = fn === 'sin' ? quad === 2 : fn === 'cos' ? quad === 4 : quad === 3;
    return { q: `Evaluate ${fn} ${A}°.`, o: [(pos ? '' : MN) + val, (pos ? MN : '') + val, (pos ? '' : MN) + oval, (pos ? MN : '') + oval],
      w: ['', `Check the sign in quadrant ${quad}: All, Sin, Tan, Cos.`, `The reference angle is ${base}°. You used the value for another angle.`, 'Both the sign and the value are off.'],
      e: `${A}° is in quadrant ${quad}, with reference angle ${base}°. ${fn} is ${pos ? 'positive' : 'negative'} there, so ${fn} ${A}° = ${(pos ? '' : MN) + val}.` };
  } }
];

/* ── Differentiation ── */
const term = (k, n) => n === 0 ? nm(k) : `${Math.abs(k) === 1 ? (k < 0 ? MN : '') : nm(k)}x${n === 1 ? '' : `<sup>${n}</sup>`}`;
const sumT = ts => ts.filter(t => t[0]).map((t, i) => { const s = term(t[0], t[1]); return i && t[0] > 0 ? ' + ' + s : i ? ' ' + MN + ' ' + s.slice(1) : s; }).join('') || '0';
QG.diff = [
  { l: 2, n: 5, f: R => {
    const a = R.nz(-5, 6), n = R.int(2, 5), b = R.nz(-9, 9), c = R.int(-9, 9);
    return { q: `Find dy/dx if y = ${sumT([[a, n], [b, 1], [c, 0]])}.`, o: [sumT([[a * n, n - 1], [b, 0]]), sumT([[a * n, n], [b, 0]]), sumT([[a * n, n - 1], [b, 0], [c, 0]]), sumT([[a, n - 1], [b, 0]])],
      w: ['', 'Bring the power down and then reduce it by 1. You kept the old power.', `The constant ${nm(c)} differentiates to 0.`, 'Bring the power down in front as a multiplier.'],
      e: `Multiply by the power and reduce the power by 1: d/dx(${term(a, n)}) = ${term(a * n, n - 1)}, d/dx(${term(b, 1)}) = ${nm(b)}, and constants vanish. dy/dx = ${sumT([[a * n, n - 1], [b, 0]])}.` };
  } },
  { l: 3, n: 4, f: R => {
    const a = R.nz(-3, 4), b = R.int(-6, 6), c = R.int(-5, 5), x = R.nz(-3, 3), g = 3 * a * x * x + 2 * b * x + c, y = a * x * x * x + b * x * x + c * x;
    return { q: `Find the gradient of the curve y = ${sumT([[a, 3], [b, 2], [c, 1]])} at the point where x = ${nm(x)}.`, o: [nm(g), nm(y), nm(3 * a * x + 2 * b + c), nm(3 * a * x * x + 2 * b * x)],
      w: ['', 'That is the value of y, the height of the curve. The gradient comes from dy/dx.', 'Square x in the first term of dy/dx: 3ax².', `You lost the ${nm(c)} from differentiating ${term(c, 1)}.`],
      e: `dy/dx = ${sumT([[3 * a, 2], [2 * b, 1], [c, 0]])}. At x = ${nm(x)}: ${nm(g)}.` };
  } },
  { l: 4, n: 4, f: R => {
    const a = R.nz(-4, 4), h = R.int(-5, 5), k = R.int(-8, 8), b = -2 * a * h, c = a * h * h + k;
    return { q: `Find the x-coordinate of the turning point of y = ${sumT([[a, 2], [b, 1], [c, 0]])}.`, o: [nm(h), nm(-h || 1), frac(-b, a), nm(k)],
      w: ['', 'Solve dy/dx = 0 carefully: watch the sign.', 'The turning point is at x = −b ÷ 2a. You forgot the 2.', 'That is the y-coordinate of the turning point.'],
      e: `dy/dx = ${sumT([[2 * a, 1], [b, 0]])} = 0 at the turning point, so x = ${nm(h)}.` };
  } },
  { l: 4, n: 3, f: R => {
    const a = R.int(2, 5), b = R.nz(-5, 5), n = R.int(2, 5), inner = lin(a, b);
    return { q: `Differentiate y = (${inner})<sup>${n}</sup>.`, o: [`${n * a}(${inner})<sup>${n - 1}</sup>`, `${n}(${inner})<sup>${n - 1}</sup>`, `${n * a}(${inner})<sup>${n}</sup>`, `${a}(${inner})<sup>${n - 1}</sup>`],
      w: ['', `Chain rule: also multiply by the derivative of the inside, which is ${a}.`, 'Reduce the power by 1.', `Bring the power ${n} down as well.`],
      e: `Chain rule: ${n}(${inner})<sup>${n - 1}</sup> × ${a} = ${n * a}(${inner})<sup>${n - 1}</sup>.` };
  } },
  { l: 5, n: 3, f: R => {
    const a = R.pick([-1, -2, -3]), h = R.int(-4, 4), k = R.int(-5, 9), b = -2 * a * h, c = a * h * h + k;
    return { q: `Find the maximum value of y = ${sumT([[a, 2], [b, 1], [c, 0]])}.`, o: [nm(k), nm(h), nm(c), nm(k - 2 * a * h * h || k + 1)],
      w: ['', `${nm(h)} is the x-value where the maximum happens. Put it into y.`, 'That is y at x = 0, not the maximum.', 'Substitute x into y again carefully.'],
      e: `dy/dx = ${sumT([[2 * a, 1], [b, 0]])} = 0 gives x = ${nm(h)}. Then y = ${nm(k)}. a is negative, so this is a maximum.` };
  } }
];

/* ── Integration ── */
QG.integ = [
  { l: 2, n: 5, f: R => {
    const n = R.int(1, 5), k = (n + 1) * R.nz(-3, 4);
    return { q: `Find ∫ ${term(k, n)} dx.`, o: [`${term(k / (n + 1), n + 1)} + c`, `${term(k * n, n - 1)} + c`, `${term(k, n + 1)} + c`, `${term(k / n, n + 1)} + c`],
      w: ['', 'That is differentiating. To integrate, add 1 to the power and divide by the new power.', `You raised the power but did not divide by ${n + 1}.`, `Divide by the new power, ${n + 1}, not the old one.`],
      e: `∫ ${term(k, n)} dx = ${nm(k)} × x<sup>${n + 1}</sup> ÷ ${n + 1} + c = ${term(k / (n + 1), n + 1)} + c.` };
  } },
  { l: 3, n: 4, f: R => {
    const a = R.int(1, 3), b = R.int(-4, 4), p = R.int(0, 2), q = p + R.int(1, 3), F = x => a * x * x + b * x, v = F(q) - F(p);
    return { q: `Evaluate ∫<sub>${p}</sub><sup>${q}</sup> (${lin(2 * a, b)}) dx.`, o: [nm(v), nm(F(q)), nm(2 * a * q + b - (2 * a * p + b)), nm(F(q) + F(p))],
      w: ['', `You forgot to subtract the value at the lower limit, x = ${p}.`, 'You differentiated instead of integrating.', 'Subtract the lower value from the upper one, do not add.'],
      e: `∫(${lin(2 * a, b)}) dx = ${sumT([[a, 2], [b, 1]])}. Upper minus lower: ${nm(F(q))} − ${F(p) < 0 ? `(${nm(F(p))})` : F(p)} = ${nm(v)}.` };
  } },
  { l: 4, n: 3, f: R => {
    const k = R.pick([3, 6, 9]), A = k * k * k / 3;
    return { q: `Find the area under the curve y = x² from x = 0 to x = ${k}.`, o: [`${A} square units`, `${k * k * k} square units`, `${k * k} square units`, `${2 * k} square units`],
      w: ['', 'Integrating x² gives x³ ÷ 3. You forgot to divide by 3.', 'That is the height of the curve at the end, not the area.', 'You differentiated. Area needs integration.'],
      e: `Area = ∫<sub>0</sub><sup>${k}</sup> x² dx = [x³ ÷ 3] = ${k * k * k} ÷ 3 = ${A} square units.` };
  } }
];


/* ── Statistics: averages and charts ── */
const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
const median = a => { const b = [...a].sort((x, y) => x - y), n = b.length; return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2; };
const listT = a => a.join(', ');
QG.stats = [
  { l: 2, n: 4, f: R => {
    const n = R.int(5, 8), a = Array.from({ length: n }, () => R.int(2, 20)), m = mean(a);
    if (!Number.isInteger(m * 2)) return null;
    const s = a.reduce((x, y) => x + y, 0);
    return { q: `Find the mean of ${listT(a)}.`, o: [nm(m), nm(median(a)), nm(s / (n - 1)), nm(s)],
      w: ['', 'That is the median, the middle value.', `Divide by the number of values, ${n}, not ${n - 1}.`, 'That is the total. Divide it by how many numbers there are.'],
      e: `Total = ${s}. Mean = ${s} ÷ ${n} = ${nm(m)}.` };
  } },
  { l: 2, n: 4, f: R => {
    const n = R.pick([6, 7, 8, 9]), a = Array.from({ length: n }, () => R.int(1, 30)), md = median(a), b = [...a].sort((x, y) => x - y);
    const unsorted = n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2;
    return { q: `Find the median of ${listT(a)}.`, o: [nm(md), nm(unsorted), nm(Math.round(mean(a) * 10) / 10), nm(n % 2 ? b[(n + 1) / 2] : b[n / 2])],
      w: ['', 'Arrange the numbers in order first. The median is the middle of the ordered list.', 'That is (close to) the mean, not the median.', n % 2 ? 'Count again: that is one place past the middle.' : 'With an even count, average the two middle numbers.'],
      e: `In order: ${listT(b)}. ${n % 2 ? `The middle number is ${md}.` : `The two middle numbers are ${b[n / 2 - 1]} and ${b[n / 2]}, so the median is ${nm(md)}.`}` };
  } },
  { l: 3, n: 4, f: R => {
    const x = [1, 2, 3, 4, 5].map(v => v + R.int(0, 3) * 0), f = x.map(() => R.int(1, 9)), N = f.reduce((s, v) => s + v, 0), sfx = x.reduce((s, v, i) => s + v * f[i], 0), m = sfx / N;
    if (!Number.isInteger(m * 10) && !Number.isInteger(m * 4)) return null;
    return { q: `Find the mean of the distribution in the table.`, g: ['ftable', { x, f, label: `Frequency table: x = ${x.join(', ')} with frequencies ${f.join(', ')}` }],
      o: [nm(m), nm(mean(x)), nm(sfx / x.length), nm(mean(f))],
      w: ['', 'That ignores the frequencies. Each value counts as many times as it occurs.', `Divide Σfx by the total frequency, ${N}, not by the number of rows.`, 'That is the mean of the frequencies, not of the values.'],
      e: `Σf = ${N} and Σfx = ${sfx}. Mean = ${sfx} ÷ ${N} = ${nm(m)}.` };
  } },
  { l: 2, n: 3, f: R => {
    const vals = [R.int(30, 40), R.int(41, 45), R.int(46, 50), R.int(51, 55), R.int(56, 60)], f = vals.map(() => R.int(1, 9)), mx = Math.max(...f);
    if (f.filter(v => v === mx).length > 1) return null;
    const mode = vals[f.indexOf(mx)];
    return { q: `The bar chart shows the marks scored by some students. What is the modal mark?`, g: ['bars', { x: vals, f, xl: 'Mark', yl: 'Students', label: `Bar chart: ${vals.map((v, i) => `${v} scored by ${f[i]}`).join(', ')}` }],
      o: [mode, mx, vals[2] === mode ? vals[1] : vals[2], Math.max(...vals)],
      w: ['', 'That is how many students got the modal mark, not the mark itself.', 'The mode is the mark with the tallest bar, not the middle mark.', 'That is the highest mark, not the most common one.'],
      e: `The tallest bar is at ${mode}, so the modal mark is ${mode}.` };
  } },
  { l: 3, n: 3, f: R => {
    const items = R.pick([['Food', 'Rent', 'Transport', 'Savings'], ['Bus', 'Walk', 'Bike', 'Car'], ['Maths', 'English', 'Physics', 'Biology']]);
    const N = R.pick([36, 60, 72, 90, 120, 180]), parts = [R.int(1, 5), R.int(1, 5), R.int(1, 5)]; const unit = N / 36;
    if (!Number.isInteger(unit)) return null;
    const f = parts.map(p => p * unit * 2), last = N - f.reduce((s, v) => s + v, 0); if (last <= 0) return null;
    const all = [...f, last], k = R.int(0, 3), ang = all[k] / N * 360;
    return { q: `In a survey of ${N} people, ${all.map((v, i) => `${v} chose ${items[i]}`).join(', ')}. Find the angle of the ${items[k]} sector in a pie chart.`,
      o: [`${nm(ang)}°`, `${nm(all[k] / N * 100)}°`, `${nm(all[k])}°`, `${nm(ang / 2)}°`],
      w: ['', 'That is the percentage. A pie chart shares out 360°, not 100.', 'That is the number of people, not the angle.', 'A full turn is 360°, not 180°.'],
      e: `Angle = ${all[k]} ÷ ${N} × 360° = ${nm(ang)}°.` };
  } }
];

/* ── Measures of dispersion ── */
QG.disp = [
  { l: 2, n: 3, f: R => {
    const a = Array.from({ length: R.int(6, 8) }, () => R.int(3, 40)), hi = Math.max(...a), lo = Math.min(...a);
    return { q: `Find the range of ${listT(a)}.`, o: [hi - lo, hi, a[a.length - 1] - a[0] === hi - lo ? hi + lo : a[a.length - 1] - a[0], Math.round(mean(a))],
      w: ['', 'Range is the highest minus the lowest.', 'Use the highest and lowest values, not the last and first in the list.', 'That is the mean, not the range.'],
      e: `Highest ${hi}, lowest ${lo}. Range = ${hi} − ${lo} = ${hi - lo}.` };
  } },
  { l: 3, n: 4, f: R => {
    const m = R.int(4, 12), dev = R.pick([[-2, 0, 2], [-3, -1, 1, 3], [-1, 0, 1], [-4, 0, 4], [-2, -2, 2, 2], [-3, 0, 3], [-2, -1, 0, 1, 2]]), a = dev.map(d => m + d), n = a.length;
    const ss = dev.reduce((s, d) => s + d * d, 0), v = ss / n;
    const sd = isSq(v) ? String(Math.sqrt(v)) : Number.isInteger(v) ? `√${v}` : null; if (!sd) return null;
    const asks = R.f() < .5 ? 'variance' : 'standard deviation';
    const right = asks === 'variance' ? nm(v) : sd, other = asks === 'variance' ? sd : nm(v);
    return { q: `Find the ${asks} of ${listT(a)}.`, o: [right, other, nm(ss / (n - 1)) === right ? nm(ss) : nm(ss / (n - 1)), nm(dev.reduce((s, d) => s + Math.abs(d), 0) / n)],
      w: ['', asks === 'variance' ? 'That is the standard deviation, the square root of the variance.' : 'That is the variance. Take its square root.', 'Divide by the number of values, n, not n − 1.', 'That is the mean deviation, which uses |x − x̄|, not (x − x̄)².'],
      e: `Mean = ${m}. Deviations ${dev.map(nm).join(', ')}; squares add to ${ss}. Variance = ${ss} ÷ ${n} = ${nm(v)}${asks === 'variance' ? '' : `, so the standard deviation is ${sd}`}.` };
  } },
  { l: 4, n: 3, f: R => {
    const m = R.int(5, 15), dev = R.pick([[-3, -1, 0, 1, 3], [-4, -2, 0, 2, 4], [-2, -1, 0, 1, 2], [-5, 0, 5], [-6, -2, 2, 6]]), a = dev.map(d => m + d), md = dev.reduce((s, d) => s + Math.abs(d), 0) / a.length;
    return { q: `Find the mean deviation of ${listT(a)}.`, o: [nm(md), '0', nm(dev.reduce((s, d) => s + d * d, 0) / a.length), nm(dev.reduce((s, d) => s + Math.abs(d), 0))],
      w: ['', 'The deviations cancel to 0 if you keep their signs. Mean deviation uses their sizes, |x − x̄|.', 'That is the variance, which squares the deviations.', `Divide the total by ${a.length}.`],
      e: `Mean = ${m}. The sizes of the deviations are ${dev.map(Math.abs).join(', ')}, which add to ${dev.reduce((s, d) => s + Math.abs(d), 0)}. Mean deviation = ${nm(md)}.` };
  } }
];

/* ── Permutation and combination ── */
QG.perm = [
  { l: 2, n: 4, f: R => {
    const n = R.int(5, 10), r = R.int(2, 4);
    return { q: `Evaluate <sup>${n}</sup>P<sub>${r}</sub>.`, o: [commas(nPr(n, r)), commas(nCr(n, r)), commas(Math.pow(n, r)), commas(n * r)],
      w: ['', 'That is ⁿCᵣ. Permutations are not divided by r!.', 'Repeats are not allowed: the choices go down by 1 each time.', `<sup>${n}</sup>P<sub>${r}</sub> = ${n} × ${n - 1} × … , ${r} numbers multiplied.`],
      e: `<sup>${n}</sup>P<sub>${r}</sub> = ${Array.from({ length: r }, (_, i) => n - i).join(' × ')} = ${commas(nPr(n, r))}.` };
  } },
  { l: 2, n: 4, f: R => {
    const n = R.int(5, 12), r = R.int(2, 4);
    return { q: `In how many ways can a committee of ${r} be chosen from ${n} people?`, o: [commas(nCr(n, r)), commas(nPr(n, r)), commas(n * r), commas(fact(r) * n)],
      w: ['', 'Order does not matter in a committee, so divide by r!. That is ⁿCᵣ, not ⁿPᵣ.', 'Use ⁿCᵣ, not n × r.', `Use <sup>${n}</sup>C<sub>${r}</sub>.`],
      e: `<sup>${n}</sup>C<sub>${r}</sub> = ${n}! ÷ (${r}! × ${n - r}!) = ${commas(nCr(n, r))}.` };
  } },
  { l: 3, n: 4, f: R => {
    const [w, v] = R.pick([['LAGOS', 120], ['ABUJA', 60], ['KADUNA', 360], ['IBADAN', 360], ['ENUGU', 60], ['MINNA', 60], ['OWERRI', 360], ['KANO', 24], ['ONDO', 12], ['AKURE', 120]]);
    const n = w.length, counts = {}; [...w].forEach(c => counts[c] = (counts[c] || 0) + 1);
    const reps = Object.entries(counts).filter(([, k]) => k > 1);
    const calc = fact(n) / reps.reduce((s, [, k]) => s * fact(k), 1); if (calc !== v) return null;
    return { q: `In how many different ways can the letters of the word ${w} be arranged?`, o: [commas(v), commas(fact(n)) === commas(v) ? commas(fact(n - 1)) : commas(fact(n)), commas(n * n), commas(fact(n) / 2 === v ? fact(n) / 6 : fact(n) / 2)],
      w: ['', reps.length ? `Repeated letters can swap without making a new word. Divide by ${reps.map(([c, k]) => `${k}! for the ${k} ${c}s`).join(' and ')}.` : 'Count the arrangements of all the letters, not one fewer.', `Use ${n}!, not ${n}².`, 'Check which letters repeat and how many times.'],
      e: reps.length ? `${n}! ÷ ${reps.map(([, k]) => k + '!').join(' × ')} = ${commas(fact(n))} ÷ ${reps.reduce((s, [, k]) => s * fact(k), 1)} = ${commas(v)}.` : `All ${n} letters are different, so ${n}! = ${commas(v)}.` };
  } },
  { l: 4, n: 3, f: R => {
    const m = R.int(4, 7), w = R.int(3, 6), a = R.int(1, 3), b = R.int(1, 3); if (a > m || b > w) return null;
    const v = nCr(m, a) * nCr(w, b);
    return { q: `A committee of ${a} men and ${b} women is to be chosen from ${m} men and ${w} women. In how many ways can this be done?`, o: [commas(v), commas(nCr(m, a) + nCr(w, b)), commas(nCr(m + w, a + b)), commas(nPr(m, a) * nPr(w, b))],
      w: ['', 'Choosing the men AND the women means multiply the two counts, not add.', 'That ignores the condition. You must have exactly ' + a + ' men and ' + b + ' women.', 'Order does not matter in a committee. Use C, not P.'],
      e: `<sup>${m}</sup>C<sub>${a}</sub> × <sup>${w}</sup>C<sub>${b}</sub> = ${nCr(m, a)} × ${nCr(w, b)} = ${commas(v)}.` };
  } },
  { l: 4, n: 3, f: R => {
    const n = R.int(4, 8);
    return { q: `In how many ways can ${n} people sit round a circular table?`, o: [commas(fact(n - 1)), commas(fact(n)), commas(fact(n - 1) / 2), commas(fact(n) / 2)],
      w: ['', 'Round a table, turning everyone one seat along gives the same arrangement. Fix one person: (n − 1)!.', 'Only necklaces and keys, which can be flipped over, are divided by 2.', 'Use (n − 1)!.'],
      e: `Fix one person and arrange the other ${n - 1}: (${n} − 1)! = ${commas(fact(n - 1))}.` };
  } }
];

/* ── Probability ── */
QG.prob = [
  { l: 2, n: 4, f: R => {
    const r = R.int(1, 9), b = R.int(1, 9), g = R.int(0, 6), N = r + b + g, c = R.pick(['red', 'blue']), k = c === 'red' ? r : b;
    return { q: `A bag contains ${r} red, ${b} blue${g ? ` and ${g} green` : ''} balls. A ball is picked at random. Find the probability that it is ${c}.`, o: [frac(k, N), frac(k, N - k || N + 1), frac(N - k, N), frac(1, k === 1 ? N + 1 : k)],
      w: ['', 'Divide by the total number of balls, not by the other balls.', `That is the probability that it is not ${c}.`, 'Count how many balls are favourable and how many there are altogether.'],
      e: `${k} of the ${N} balls are ${c}, so P = ${fr(k, N)}${gcd(k, N) > 1 ? ' = ' + frac(k, N) : ''}.` };
  } },
  { l: 3, n: 4, f: R => {
    const t = R.int(3, 11), n = Math.min(t - 1, 13 - t);
    return { q: `Two fair dice are thrown. Find the probability that the total is ${t}.`, o: [frac(n, 36), frac(1, 11), frac(n, 12), frac(1, 36)],
      w: ['', 'The 11 totals are not equally likely. Count the 36 equally likely outcomes.', 'There are 36 outcomes, not 12.', `There is more than one way to make ${t}.`],
      e: `The pairs that make ${t}: ${Array.from({ length: 6 }, (_, i) => i + 1).filter(a => t - a >= 1 && t - a <= 6).map(a => `(${a}, ${t - a})`).join(', ')}. That is ${n} of 36, so P = ${frac(n, 36)}.`, g: ['dice', { label: 'Table of totals for two dice' }] };
  } },
  { l: 3, n: 4, f: R => {
    const r = R.int(2, 7), b = R.int(2, 7), N = r + b, c = R.pick(['red', 'blue']), k = c === 'red' ? r : b;
    return { q: `A bag has ${r} red and ${b} blue balls. Two balls are taken one after the other without replacement. Find the probability that both are ${c}.`, o: [frac(k * (k - 1), N * (N - 1)), frac(k * k, N * N), frac(k * (k - 1), N * N), frac(2 * k - 1, 2 * N - 1)],
      w: ['', 'That is with replacement. Without replacement there is one fewer ball of that colour, and one fewer ball in all.', 'Both the top and the bottom drop by 1 on the second pick.', 'Multiply the two probabilities; do not add.'],
      e: `P = ${fr(k, N)} × ${fr(k - 1, N - 1)} = ${frac(k * (k - 1), N * (N - 1))}.` };
  } },
  { l: 4, n: 3, f: R => {
    const p = R.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5]]), n = R.pick([2, 3]), q = [p[1] - p[0], p[1]];
    const qn = [Math.pow(q[0], n), Math.pow(q[1], n)], ans = [qn[1] - qn[0], qn[1]];
    return { q: `The probability that a student passes a test is ${fr(...p)}. ${n === 2 ? 'Two' : 'Three'} students take it independently. Find the probability that at least one of them passes.`, o: [frac(...ans), frac(Math.pow(p[0], n), Math.pow(p[1], n)), frac(p[0] * n, p[1]), frac(...qn)],
      w: ['', 'That is the chance that all of them pass. At least one also counts one or two passing.', 'You added the probabilities, which counts the overlaps more than once.', 'That is the chance that nobody passes. Take it from 1.'],
      e: `P(nobody passes) = (${fr(...q)})<sup>${n}</sup> = ${frac(...qn)}. P(at least one) = 1 − ${frac(...qn)} = ${frac(...ans)}.` };
  } }
];

/* ── Loci ── */
QG.loci = [
  { l: 2, n: 1, f: R => ({ q: `What is the locus of a point that is always 4 cm from a fixed point O?`, o: ['A circle of radius 4 cm with centre O', 'A straight line 4 cm from O', 'A pair of parallel lines 4 cm apart', 'A square of side 4 cm'],
    w: ['', 'A line has points at many different distances from O.', 'Parallel lines are the locus of points a fixed distance from a line, not from a point.', 'The corners of a square are further from the centre than its sides.'],
    e: 'Every point 4 cm from O lies on the circle with centre O and radius 4 cm.' }) },
  { l: 2, n: 1, f: R => ({ q: `What is the locus of points equidistant from two fixed points A and B?`, o: ['The perpendicular bisector of AB', 'The line AB itself', 'A circle with diameter AB', 'The bisector of an angle at A'],
    w: ['', 'Most points on AB are closer to one end than the other.', 'Points on that circle are not all equally far from A and B.', 'An angle bisector is equidistant from two lines, not two points.'],
    e: 'Points equally far from A and B lie on the line that cuts AB in half at right angles: the perpendicular bisector.' }) },
  { l: 3, n: 1, f: R => ({ q: `What is the locus of points equidistant from two intersecting straight lines?`, o: ['The pair of lines bisecting the angles between them', 'The perpendicular bisector of the lines', 'A circle through the point of intersection', 'A line parallel to both lines'],
    w: ['', 'A perpendicular bisector is for two points, not two lines.', 'A circle is the locus for a fixed distance from a point.', 'Intersecting lines cannot have one line parallel to both.'],
    e: 'Points equally far from two crossing lines lie on the two angle bisectors.' }) },
  { l: 3, n: 1, f: R => ({ q: `A goat is tied by a 5 m rope to a peg in an open field. What is the boundary of the region it can graze?`, o: ['A circle of radius 5 m centred on the peg', 'A circle of radius 2.5 m', 'A square of side 10 m', 'A straight line 5 m long'],
    w: ['', 'The rope is the radius, not the diameter.', 'The rope reaches the same distance in every direction, so the edge is round.', 'The goat can walk all the way round the peg.'],
    e: 'The furthest the goat can reach is 5 m from the peg in every direction: a circle of radius 5 m.' }) }
];

export function applyMathGenerators(topics: Topic[]): Topic[] {
  const byId = new Map(topics.map(t => [t.id, t]));
  return topics.map(orig => {
    const t = { ...orig, qs: orig.qs.slice() };
    const gens = QG[t.id] || [];
    gens.forEach((T, k) => {
      let made = 0;
      for (let v = 0; made < (T.n || 3) && v < 60; v++) {
        let q: any;
        try { q = T.f(mkR(`${t.id}|${k}|${v}`)); } catch { q = null; }
        if (!q) continue;
        const keys = q.o.map((x: any) => String(x).replace(/<[^>]+>/g, "").replace(/\s+/g, ""));
        if (new Set(keys).size !== keys.length || t.qs.some(x => x.q === q.q)) continue;
        const p = perm(`${t.id}~${k}~${v}`, q.o.length);
        const mfix = (x: any) => String(x).replace(/(^|[\s(=×÷+])-(?=\d)/g, "$1" + MN);
        t.qs.push({
          l: T.l,
          q: mfix(q.q),
          g: q.g,
          o: p.map(i => mfix(q.o[i])),
          a: p.indexOf(0),
          w: q.w ? p.map(i => mfix(q.w[i] || "")) : undefined,
          e: mfix(q.e),
          gen: 1,
        });
        made++;
      }
    });
    void byId;
    return t;
  });
}
