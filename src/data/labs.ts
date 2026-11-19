// @ts-nocheck
import type { LabItem, SubjectId } from "../types";
import { nm } from "../utils/mathMarkup";
import { buildExtraChemLabs, EXTRA_CLAB_ICONS } from "./chemLabsExtra";
import { buildPhysLabs, PLAB_CATS, PLAB_IC, PHYS_LAB_FOR_TOPIC } from "./physLabs";
import { buildBioLabs, BLAB_CATS, BLAB_IC, BIO_LAB_FOR_TOPIC } from "./bioLabs";
import { buildAgricLabs, ALAB_CATS, ALAB_IC, AGRIC_LAB_FOR_TOPIC } from "./agricLabs";
import { sanitizeLabForNationalLearning } from "../utils/nationalLearningSanitizer";

const LV = (() => {
  const d2r = d => d * Math.PI / 180, r2d = r => r * 180 / Math.PI;
  const at = (c, r, deg) => [c[0] + r * Math.cos(d2r(deg)), c[1] - r * Math.sin(d2r(deg))];
  const dir = (a, b) => (r2d(Math.atan2(a[1] - b[1], b[0] - a[0])) + 360) % 360;   // math-style direction from a to b
  const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
  /* the point R with |RP| = |RQ| = r, on the side given by sign */
  const meet = (P, Q, r, side = 1) => { const m = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], d = dist(P, Q), h = Math.sqrt(Math.max(0, r * r - d * d / 4)), ux = (Q[0] - P[0]) / d, uy = (Q[1] - P[1]) / d; return [m[0] - side * uy * h, m[1] + side * ux * h]; };
  const ext = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const arcAt = (c, P, span = 22) => { const d0 = dir(c, P); return { t: 'arc', c, r: dist(c, P), a0: d0 - span, a1: d0 + span }; };
  return { at, dir, dist, meet, ext, arcAt };
})();
const lpt = (p, name, dx = 0, dy = -14) => ({ t: 'pt', p, name, dx, dy });
const lsg = (a, b, o = {}) => Object.assign({ t: 'seg', a, b }, o);
const LAB = [
  { id: 'bisect-line', name: 'Bisect a line segment', blurb: 'Cut a line exactly in half at right angles', steps: () => {
    const A = [70, 180], B = [290, 180], r = 140, P = LV.meet(A, B, r, -1), Q = LV.meet(A, B, r, 1), M = [180, 180];
    return [
      { say: 'Draw the line AB with your ruler.', ops: [lpt(A, 'A', -4, 18), lpt(B, 'B', 4, 18), lsg(A, B)] },
      { say: 'Open your compass to more than half the length of AB. Put the point on A and draw an arc above and below the line.', ops: [{ t: 'arc', c: A, r, a0: -60, a1: 60 }] },
      { say: 'Do not change the compass. Put the point on B and draw an arc that crosses the first one twice.', ops: [{ t: 'arc', c: B, r, a0: 120, a1: 240 }] },
      { say: 'Mark the two crossing points. Call them P and Q.', ops: [lpt(P, 'P', 12, -6), lpt(Q, 'Q', 12, 10)] },
      { say: 'Join P to Q with your ruler. PQ cuts AB in half at M, at right angles. PQ is the perpendicular bisector of AB.', ops: [lsg(LV.ext(P, Q, -0.12), LV.ext(P, Q, 1.12)), lpt(M, 'M', 12, 16), { t: 'rt', v: M, a: B, b: P }] }
    ];
  } },
  { id: 'bisect-angle', name: 'Bisect an angle', blurb: 'Split any angle into two equal angles', steps: () => {
    const O = [60, 220], A = LV.at(O, 260, 0), B = LV.at(O, 230, 70), r = 100, P = LV.at(O, r, 0), Q = LV.at(O, r, 70), R = LV.meet(P, Q, 90, 1), Rf = LV.at(O, 250, 35);
    return [
      { say: 'Here is the angle AOB that we want to bisect.', ops: [lpt(O, 'O', -10, 14), lsg(O, A), lsg(O, B), lpt(A, 'A', 0, 16), lpt(B, 'B', 10, 0)] },
      { say: 'Put the compass point on O and draw an arc that cuts both arms. Call the crossing points P and Q.', ops: [{ t: 'arc', c: O, r, a0: -8, a1: 78 }, lpt(P, 'P', 4, 18), lpt(Q, 'Q', -14, -4)] },
      { say: 'Put the compass point on P and draw an arc inside the angle.', ops: [LV.arcAt(P, R, 20)] },
      { say: 'Keep the same radius. Put the point on Q and draw an arc that crosses the last one at R.', ops: [LV.arcAt(Q, R, 20), lpt(R, 'R', 12, -4)] },
      { say: 'Join O to R. OR bisects the angle: angle AOR and angle ROB are equal, 35° each.', ops: [lsg(O, Rf), { t: 'ang', v: O, a: A, b: Rf, label: '35°', r: 46 }, { t: 'ang', v: O, a: Rf, b: B, label: '35°', r: 62 }] }
    ];
  } },
  { id: 'angle-60', name: 'Construct an angle of 60°', blurb: 'The building block for 30°, 120° and more', steps: () => {
    const O = [70, 220], A = [320, 220], r = 120, P = LV.at(O, r, 0), Q = LV.at(O, r, 60), Qf = LV.at(O, 230, 60);
    return [
      { say: 'Draw a straight line and mark the point O on it.', ops: [lsg(O, A), lpt(O, 'O', -6, 18)] },
      { say: 'Put the compass on O and draw a long arc that cuts the line at P.', ops: [{ t: 'arc', c: O, r, a0: -6, a1: 80 }, lpt(P, 'P', 4, 18)] },
      { say: 'Keep the same radius. Put the compass on P and draw an arc that crosses the first arc at Q.', ops: [LV.arcAt(P, Q, 22), lpt(Q, 'Q', -14, -6)] },
      { say: 'Join O to Q. Angle QOP is 60°. OP, PQ and OQ are all the same length, so triangle OPQ is equilateral, and every angle in it is 60°.', ops: [lsg(O, Qf), { t: 'ang', v: O, a: P, b: Q, label: '60°', r: 44 }] }
    ];
  } },
  { id: 'angle-30', name: 'Construct an angle of 30°', blurb: 'Make 60°, then bisect it', steps: () => {
    const O = [60, 220], A = [320, 220], r = 120, P = LV.at(O, r, 0), Q = LV.at(O, r, 60), R = LV.meet(P, Q, 100, 1), Rf = LV.at(O, 250, 30);
    return [
      { say: 'Draw a straight line and mark O on it.', ops: [lsg(O, A), lpt(O, 'O', -6, 18)] },
      { say: 'Construct 60° first. Arc from O to cut the line at P, then the same radius from P to get Q.', ops: [{ t: 'arc', c: O, r, a0: -6, a1: 80 }, lpt(P, 'P', 4, 18), LV.arcAt(P, Q, 22), lpt(Q, 'Q', -14, -6)] },
      { say: 'Now bisect the 60°. From P, draw an arc between the line and Q.', ops: [LV.arcAt(P, R, 18)] },
      { say: 'With the same radius from Q, draw an arc that crosses it at R.', ops: [LV.arcAt(Q, R, 18), lpt(R, 'R', 12, -4)] },
      { say: 'Join O to R. Angle ROP is half of 60°, which is 30°.', ops: [lsg(O, Rf), { t: 'ang', v: O, a: P, b: Rf, label: '30°', r: 54 }] }
    ];
  } },
  { id: 'angle-90', name: 'Construct an angle of 90°', blurb: 'A right angle at a point on a line', steps: () => {
    const O = [180, 220], L = [40, 220], Rt = [320, 220], r = 80, A = LV.at(O, r, 180), B = LV.at(O, r, 0), P = LV.meet(B, A, 120, 1), Pf = LV.ext(O, P, 1.25);
    return [
      { say: 'Draw a straight line and mark O on it, where the right angle will be.', ops: [lsg(L, Rt), lpt(O, 'O', 0, 18)] },
      { say: 'Put the compass on O and draw two small arcs that cut the line at A and B, the same distance either side of O.', ops: [LV.arcAt(O, A, 14), LV.arcAt(O, B, 14), lpt(A, 'A', 0, 18), lpt(B, 'B', 0, 18)] },
      { say: 'Open the compass wider. Put it on A and draw an arc above O.', ops: [LV.arcAt(A, P, 18)] },
      { say: 'Keep the same radius. Put it on B and draw an arc that crosses the last one at P.', ops: [LV.arcAt(B, P, 18), lpt(P, 'P', 12, -6)] },
      { say: 'Join O to P. Angle POB is 90°: you have bisected the straight angle AOB.', ops: [lsg(O, Pf), { t: 'rt', v: O, a: B, b: P }] }
    ];
  } },
  { id: 'angle-45', name: 'Construct an angle of 45°', blurb: 'Make 90°, then bisect it', steps: () => {
    const O = [130, 240], L = [30, 240], Rt = [330, 240], r = 70, A = LV.at(O, r, 180), B = LV.at(O, r, 0), P = LV.meet(B, A, 140, 1), Pf = LV.ext(O, P, 1.15), Q = LV.at(O, r, 90), R = LV.meet(B, Q, r, 1), Rf = LV.at(O, 240, 45);
    return [
      { say: 'Draw a line and mark O. Construct 90° at O first: arcs at A and B, then arcs from A and B that meet at P.', ops: [lsg(L, Rt), lpt(O, 'O', 0, 18), LV.arcAt(O, A, 14), LV.arcAt(O, B, 14), LV.arcAt(A, P, 16), LV.arcAt(B, P, 16), lpt(P, 'P', -14, -2), lsg(O, Pf)] },
      { say: 'Put the compass on O, with radius OB, and draw an arc that cuts OP at Q.', ops: [{ t: 'arc', c: O, r, a0: -4, a1: 96 }, lpt(Q, 'Q', -14, 0)] },
      { say: 'From B and from Q, with the same radius, draw two arcs that cross at R.', ops: [LV.arcAt(B, R, 16), LV.arcAt(Q, R, 16), lpt(R, 'R', 12, -4)] },
      { say: 'Join O to R. Angle ROB is half of 90°, which is 45°.', ops: [lsg(O, Rf), { t: 'ang', v: O, a: B, b: Rf, label: '45°', r: 44 }] }
    ];
  } },
  { id: 'angle-120', name: 'Construct an angle of 120°', blurb: 'Two 60° steps round the arc', steps: () => {
    const O = [200, 220], L = [40, 220], Rt = [330, 220], r = 90, P = LV.at(O, r, 0), Q = LV.at(O, r, 60), R = LV.at(O, r, 120), Rf = LV.at(O, 190, 120);
    return [
      { say: 'Draw a line and mark O on it.', ops: [lsg(L, Rt), lpt(O, 'O', 0, 18)] },
      { say: 'With the compass on O, draw a big arc that cuts the line at P.', ops: [{ t: 'arc', c: O, r, a0: -6, a1: 150 }, lpt(P, 'P', 4, 18)] },
      { say: 'Same radius, compass on P: mark Q on the arc. That is 60°.', ops: [LV.arcAt(P, Q, 16), lpt(Q, 'Q', 10, -8)] },
      { say: 'Same radius again, compass on Q: mark R on the arc. That is another 60°.', ops: [LV.arcAt(Q, R, 16), lpt(R, 'R', -12, -8)] },
      { say: 'Join O to R. Angle ROP is 60° + 60° = 120°.', ops: [lsg(O, Rf), { t: 'ang', v: O, a: P, b: R, label: '120°', r: 34 }] }
    ];
  } },
  { id: 'perp-point', name: 'Perpendicular from a point to a line', blurb: 'Drop a line from P that meets a line at 90°', steps: () => {
    const P = [180, 60], L = [30, 200], Rt = [330, 200], r = 170, h = 140, w = Math.sqrt(r * r - h * h), A = [180 - w, 200], B = [180 + w, 200], Q = [180, 200 + Math.sqrt(110 * 110 - w * w)], N = [180, 200];
    return [
      { say: 'Here is the line and the point P above it.', ops: [lsg(L, Rt), lpt(P, 'P', 12, -4)] },
      { say: 'Put the compass on P and draw an arc that cuts the line at two points, A and B.', ops: [{ t: 'arc', c: P, r, a0: 230, a1: 310 }, lpt(A, 'A', -4, -12), lpt(B, 'B', 4, -12)] },
      { say: 'Put the compass on A and draw an arc below the line.', ops: [LV.arcAt(A, Q, 16)] },
      { say: 'Same radius, compass on B: draw an arc that crosses it at Q.', ops: [LV.arcAt(B, Q, 16), lpt(Q, 'Q', 12, 4)] },
      { say: 'Join P to Q. It meets the line at N at right angles. PN is the perpendicular from P to the line, and it is the shortest distance from P to the line.', ops: [lsg(P, Q), lpt(N, 'N', 12, 16), { t: 'rt', v: N, a: B, b: P }] }
    ];
  } },
  { id: 'triangle-sss', name: 'Construct a triangle from three sides', blurb: 'AB = 7 cm, BC = 6 cm, AC = 5 cm', steps: () => {
    const k = 30, A = [70, 235], B = [70 + 7 * k, 235], x = (25 * k * k - 36 * k * k + 49 * k * k) / (2 * 7 * k), C = [70 + x, 235 - Math.sqrt(25 * k * k - x * x)];
    return [
      { say: 'Draw AB, 7 cm long, with your ruler. Always start with the longest side.', ops: [lpt(A, 'A', -6, 18), lpt(B, 'B', 6, 18), lsg(A, B), { t: 'lab', p: [175, 258], text: '7 cm' }] },
      { say: 'Open the compass to 5 cm, the length of AC. With the point on A, draw an arc above AB.', ops: [LV.arcAt(A, C, 22)] },
      { say: 'Open the compass to 6 cm, the length of BC. With the point on B, draw an arc that crosses the first one at C.', ops: [LV.arcAt(B, C, 22), lpt(C, 'C', 0, -12)] },
      { say: 'Join A to C and B to C. Triangle ABC has sides 7 cm, 6 cm and 5 cm.', ops: [lsg(A, C), lsg(B, C), { t: 'lab', p: [A[0] + (C[0] - A[0]) / 2 - 36, A[1] + (C[1] - A[1]) / 2], text: '5 cm' }, { t: 'lab', p: [B[0] + (C[0] - B[0]) / 2 + 38, B[1] + (C[1] - B[1]) / 2], text: '6 cm' }] }
    ];
  } }
];

/* ── drawing, with real instruments: a pencil, a ruler, a pair of compasses and a protractor ── */
const LDUR = { path: 1.1, seg: 1.7, arc: 1.7, pt: 0.35, ang: 0.5, rt: 0.4, lab: 0.3, prot: 2.4, x: 0.35, curve: 2.6, shade: 0.6, dot: 0.3 };
const fx1 = v => v.toFixed(1);
/* a pencil drawn with its tip at (0, 0), leaning up and to the right */
const PENCIL = `<g class="lb-pencil" transform="rotate(-58)"><path d="M0 0 L9 -3 L9 3 Z" fill="#3A3F3C"/><path d="M9 -3 L24 -5.5 L24 5.5 L9 3 Z" fill="#E9C99A"/><rect x="24" y="-5.5" width="80" height="11" fill="#F2B705"/><rect x="24" y="-5.5" width="80" height="3.6" fill="#FFD23F"/><rect x="24" y="2" width="80" height="3.5" fill="#D99A00"/><rect x="104" y="-5.8" width="9" height="11.6" fill="#B9C2BD"/><line x1="106.5" y1="-5.8" x2="106.5" y2="5.8" stroke="#8E9893" stroke-width="1"/><line x1="110" y1="-5.8" x2="110" y2="5.8" stroke="#8E9893" stroke-width="1"/><rect x="113" y="-5.5" width="11" height="11" rx="3" fill="#F28C8C"/></g>`;
const lbShow = (b, e) => `<set attributeName="opacity" to="1" begin="${b}s"/><set attributeName="opacity" to="0" begin="${e}s"/>`;
const lbDefs = `<defs><linearGradient id="lbMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A958F"/><stop offset=".45" stop-color="#F2F7F4"/><stop offset="1" stop-color="#76827C"/></linearGradient>
<radialGradient id="lbKnob" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#F8FAF9"/><stop offset="1" stop-color="#68736E"/></radialGradient>
<pattern id="lbGridMinor" width="15" height="15" patternUnits="userSpaceOnUse"><path d="M 15 0 L 0 0 0 15" fill="none" stroke="#CBE4D7" stroke-opacity=".055" stroke-width=".6"/></pattern>
<pattern id="lbGridMajor" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="url(#lbGridMinor)"/><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#CBE4D7" stroke-opacity=".12" stroke-width=".85"/></pattern></defs>`;
/* a tapered metal leg from p to q */
function leg(p, q, w0, w1) {
  const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  return `<path fill="url(#lbMetal)" stroke="#5E6964" stroke-width=".6" d="M${fx1(p[0] + nx * w0)} ${fx1(p[1] + ny * w0)} L${fx1(q[0] + nx * w1)} ${fx1(q[1] + ny * w1)} L${fx1(q[0] - nx * w1)} ${fx1(q[1] - ny * w1)} L${fx1(p[0] - nx * w0)} ${fx1(p[1] - ny * w0)} Z"/>`;
}
/* a pair of compasses: needle at c, pencil at c + (r, 0) before it is turned */
function compass(c, r) {
  const hy = Math.max(52, r * 0.62), H = [c[0] + r / 2, c[1] + hy], tip = [c[0] + r, c[1]], k = 0.78, lead = [H[0] + (tip[0] - H[0]) * k, H[1] + (tip[1] - H[1]) * k];
  return leg(H, c, 4, 1) + leg(H, lead, 4, 3) +
    `<line x1="${fx1(lead[0])}" y1="${fx1(lead[1])}" x2="${fx1(tip[0])}" y2="${fx1(tip[1])}" stroke="#F2B705" stroke-width="5" stroke-linecap="butt"/><circle cx="${fx1(tip[0])}" cy="${fx1(tip[1])}" r="2" fill="#3A3F3C"/>` +
    `<rect x="${fx1(H[0] - 3)}" y="${fx1(H[1])}" width="6" height="18" rx="2" fill="url(#lbMetal)"/><circle cx="${fx1(H[0])}" cy="${fx1(H[1])}" r="7" fill="url(#lbKnob)" stroke="#5E6964" stroke-width=".8"/>`;
}
/* a clear ruler along the line from a, at angle d (degrees), with millimetre marks */
function ruler(a, d, L, cm = 30) {
  let t = '';
  for (let x = 0, i = 0; x <= L + 12; x += cm / 10, i++) { const h = i % 10 === 0 ? 11 : i % 5 === 0 ? 7 : 4; t += `<line x1="${x}" y1="0" x2="${x}" y2="${-h}" stroke="#E7EFEA" stroke-opacity=".75" stroke-width="${i % 10 === 0 ? .9 : .5}"/>`; if (i % 10 === 0) t += `<text x="${x}" y="-14" text-anchor="middle" class="lb-rn">${i / 10}</text>`; }
  return `<g transform="translate(${fx1(a[0])} ${fx1(a[1])}) rotate(${fx1(-d)})"><rect x="-14" y="-30" width="${fx1(L + 32)}" height="30" rx="3" fill="#BFE3FF" fill-opacity=".16" stroke="#BFE3FF" stroke-opacity=".55"/>${t}</g>`;
}
/* a protractor centred on v, its base along direction d; angles counted anticlockwise, or clockwise if cw */
function protractor(v, d, cw) {
  const R = 84, s = cw ? 1 : -1, P = (a, rr) => [rr * Math.cos(a * Math.PI / 180), s * rr * Math.sin(a * Math.PI / 180)];
  let t = `<path d="M${-R} 0 A${R} ${R} 0 0 ${cw ? 0 : 1} ${R} 0 Z" fill="#BFE3FF" fill-opacity=".14" stroke="#BFE3FF" stroke-opacity=".7"/><path d="M${-R + 26} 0 A${R - 26} ${R - 26} 0 0 ${cw ? 0 : 1} ${R - 26} 0" fill="none" stroke="#BFE3FF" stroke-opacity=".4"/>`;
  for (let a = 0; a <= 180; a += 5) { const p1 = P(a, R), p2 = P(a, R - (a % 10 ? 5 : 10)); t += `<line x1="${fx1(p1[0])}" y1="${fx1(p1[1])}" x2="${fx1(p2[0])}" y2="${fx1(p2[1])}" stroke="#E7EFEA" stroke-opacity=".8" stroke-width="${a % 10 ? .5 : .9}"/>`; }
  for (let a = 0; a <= 180; a += 30) { const p = P(a, R - 18); t += `<text x="${fx1(p[0])}" y="${fx1(p[1])}" text-anchor="middle" dy=".35em" class="lb-rn">${a}</text>`; }
  t += `<line x1="-8" y1="0" x2="8" y2="0" stroke="#FFC531"/><line x1="0" y1="-6" x2="0" y2="6" stroke="#FFC531"/>`;
  return `<g transform="translate(${fx1(v[0])} ${fx1(v[1])}) rotate(${fx1(-d)})">${t}</g>`;
}
/* a smooth curve through points (Catmull-Rom) */
function smooth(pts) {
  let d = `M${fx1(pts[0][0])} ${fx1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${fx1(p1[0] + (p2[0] - p0[0]) / 6)} ${fx1(p1[1] + (p2[1] - p0[1]) / 6)} ${fx1(p2[0] - (p3[0] - p1[0]) / 6)} ${fx1(p2[1] - (p3[1] - p1[1]) / 6)} ${fx1(p2[0])} ${fx1(p2[1])}`;
  }
  return d;
}
const pencilAlong = (path, b, dur) => `<g opacity="0">${lbShow(b, b + dur + 0.15)}<g><animateMotion path="${path}" begin="${b}s" dur="${dur}s" fill="freeze"/>${PENCIL}</g></g>`;
const pencilTap = (p, b) => `<g opacity="0" transform="translate(${fx1(p[0])} ${fx1(p[1])})">${lbShow(b, b + 0.45)}${PENCIL}</g>`;
function labOp(op, delay, anim) {
  const f = fx1, A = anim ? ` style="animation-delay:${delay.toFixed(2)}s"` : '', cls = anim ? ' lb-in' : '';
  if (op.t === 'pt') return `<g class="lb-pt${cls}"${A}><circle class="lb-pt-halo" cx="${f(op.p[0])}" cy="${f(op.p[1])}" r="6.8"/><circle cx="${f(op.p[0])}" cy="${f(op.p[1])}" r="3.4"/><text x="${f(op.p[0] + op.dx)}" y="${f(op.p[1] + op.dy)}" text-anchor="middle" dy=".35em">${op.name}</text></g>${anim && !op.quiet ? pencilTap(op.p, delay) : ''}`;
  if (op.t === 'dot') return `<circle class="lb-dot${cls}"${A} cx="${f(op.p[0])}" cy="${f(op.p[1])}" r="2.6"/>`;
  if (op.t === 'x') return `<g class="lb-x${cls}"${A}><path d="M${f(op.p[0] - 4)} ${f(op.p[1] - 4)} L${f(op.p[0] + 4)} ${f(op.p[1] + 4)} M${f(op.p[0] + 4)} ${f(op.p[1] - 4)} L${f(op.p[0] - 4)} ${f(op.p[1] + 4)}"/></g>${anim ? pencilTap(op.p, delay) : ''}`;
  if (op.t === 'lab') return `<text class="lb-lab${op.cls ? ' ' + op.cls : ''}${cls}"${A} x="${f(op.p[0])}" y="${f(op.p[1])}" text-anchor="${op.anchor || 'middle'}" dy=".35em">${op.text}</text>`;
  if (op.t === 'path') return anim ? `<path class="lb-seg lb-draw" style="animation-delay:${delay.toFixed(2)}s;animation-duration:${LDUR.path}s" pathLength="1" d="${op.d}"/>` : `<path class="lb-seg" d="${op.d}"/>`;
  if (op.t === 'shade') return `<path class="lb-shade${cls}"${A} d="${op.d}"/>`;
  if (op.t === 'seg') {
    const d = `M${f(op.a[0])} ${f(op.a[1])} L${f(op.b[0])} ${f(op.b[1])}`, c = `lb-seg${op.dash ? ' lb-dash' : ''}${op.cls ? ' ' + op.cls : ''}`;
    if (!anim) return `<path class="${c}" d="${d}"/>`;
    if (op.plain) return `<path class="${c} lb-in"${A} d="${d}"/>`;
    const L = LV.dist(op.a, op.b), dir = LV.dir(op.a, op.b), b0 = delay, draw0 = delay + 0.45, dd = 0.95;
    return `<g class="lb-ruler" style="animation-delay:${b0.toFixed(2)}s;animation-duration:${LDUR.seg}s">${ruler(op.a, dir, L, LAB_CM)}</g>
<path class="${c} lb-draw" style="animation-delay:${draw0.toFixed(2)}s;animation-duration:${dd}s" pathLength="1" d="${d}"/>${pencilAlong(d, draw0, dd)}`;
  }
  if (op.t === 'curve') {
    const d = smooth(op.pts);
    if (!anim) return `<path class="lb-curve" d="${d}"/>`;
    return `<path class="lb-curve lb-draw" style="animation-delay:${delay.toFixed(2)}s;animation-duration:${LDUR.curve - 0.2}s" pathLength="1" d="${d}"/>${pencilAlong(d, delay, LDUR.curve - 0.2)}`;
  }
  if (op.t === 'prot') {
    const m = LV.at(op.v, op.r || 84, op.d + (op.cw ? -op.a : op.a)), b = delay;
    if (!anim) return `<circle class="lb-dot" cx="${f(m[0])}" cy="${f(m[1])}" r="2.6"/>`;
    return `<g class="lb-prot" style="animation-delay:${b.toFixed(2)}s;animation-duration:${LDUR.prot}s">${protractor(op.v, op.d, op.cw)}</g><circle class="lb-dot lb-in" style="animation-delay:${(b + 1.1).toFixed(2)}s" cx="${f(m[0])}" cy="${f(m[1])}" r="2.6"/>${pencilTap(m, b + 0.9)}`;
  }
  if (op.t === 'arc') {
    const s = LV.at(op.c, op.r, op.a0), e = LV.at(op.c, op.r, op.a1), span = op.a1 - op.a0;
    const d = `M${f(s[0])} ${f(s[1])} A${f(op.r)} ${f(op.r)} 0 ${span > 180 ? 1 : 0} 0 ${f(e[0])} ${f(e[1])}`;
    if (!anim) return `<path class="lb-arc" d="${d}"/>`;
    const c = op.c, b = delay + 0.25, dur = LDUR.arc - 0.45;
    return `<path class="lb-arc lb-draw" style="animation-delay:${b.toFixed(2)}s;animation-duration:${dur}s" pathLength="1" d="${d}"/>
<g opacity="0">${lbShow(delay, b + dur + 0.15)}<g><animateTransform attributeName="transform" type="rotate" from="${-op.a0} ${f(c[0])} ${f(c[1])}" to="${-op.a1} ${f(c[0])} ${f(c[1])}" begin="${b}s" dur="${dur}s" fill="freeze"/><g transform="rotate(${-op.a0} ${f(c[0])} ${f(c[1])})"><animateTransform attributeName="transform" type="rotate" from="0 ${f(c[0])} ${f(c[1])}" to="0 ${f(c[0])} ${f(c[1])}" begin="${b}s" dur="0.01s" fill="freeze"/>${compass(c, op.r)}</g></g></g>`;
  }
  if (op.t === 'ang' || op.t === 'rt') {
    const v = op.v, d1 = LV.dir(v, op.a), d2 = LV.dir(v, op.b);
    let s0 = d1, sp = ((d2 - d1) + 360) % 360; if (sp > 180) { s0 = d2; sp = 360 - sp; }
    if (op.t === 'rt') { const k = 14, p1 = LV.at(v, k, s0), p3 = LV.at(v, k, s0 + 90), p2 = [p1[0] + p3[0] - v[0], p1[1] + p3[1] - v[1]]; return `<path class="lb-ang${cls}"${A} d="M${f(p1[0])} ${f(p1[1])} L${f(p2[0])} ${f(p2[1])} L${f(p3[0])} ${f(p3[1])}"/>`; }
    const r = op.r || 40, s = LV.at(v, r, s0), e = LV.at(v, r, s0 + sp), m = LV.at(v, r + 18, s0 + sp / 2);
    return `<g class="lb-angg${cls}"${A}><path class="lb-ang" d="M${f(s[0])} ${f(s[1])} A${r} ${r} 0 0 0 ${f(e[0])} ${f(e[1])}"/><text x="${f(m[0])}" y="${f(m[1])}" text-anchor="middle" dy=".35em">${op.label}</text></g>`;
  }
  return '';
}
let LAB_CM = 30;
function labSvg(L, k) {
  LAB_CM = L.cm || 30;
  const steps = L.steps(), H = L.h || 290;
  let done = '', now = '', t = 0.2;
  steps.forEach((s, i) => {
    if (i < k) s.ops.forEach(op => { done += labOp(op, 0, false); });
    else if (i === k) s.ops.forEach(op => { now += labOp(op, t, true); t += op.dur || LDUR[op.t] || 0.4; });
  });
  return { svg: `<svg class="lb-svg" viewBox="0 0 360 ${H}" role="img" aria-label="${L.name}, step ${k + 1}">${lbDefs}<rect class="lb-grid-layer" x="0" y="0" width="360" height="${H}" fill="url(#lbGridMajor)"/><g class="lb-done">${done}</g>${now}</svg>`, dur: t };
}

LAB.splice(7, 0, { id: 'protractor', name: 'Draw an angle with a protractor', blurb: 'Measure and draw 65° at a point', steps: () => {
  const O = [80, 230], A = [320, 230], E = LV.at(O, 220, 65);
  return [
    { say: 'Draw a straight line OA with your ruler. O is where the angle will be.', ops: [lsg(O, A), lpt(O, 'O', -8, 16), lpt(A, 'A', 6, 16)] },
    { say: 'Put the centre mark of the protractor exactly on O, with its base line along OA. Count up from the 0 on the OA side to 65, and make a small dot.', ops: [{ t: 'prot', v: O, d: 0, a: 65 }] },
    { say: 'Take the protractor away. Join O to the dot with your ruler, and carry the line on past it.', ops: [lsg(O, E), { t: 'ang', v: O, a: A, b: E, label: '65°', r: 40 }] }
  ];
} });
LAB.push({ id: 'bearings', name: 'Bearings: draw a journey', blurb: '8 km on 060°, then 6 km on 150°. How far from the start?', h: 300, cm: 44, steps: () => {
  const k = 22, P = [55, 252], Q = LV.at(P, 8 * k, 30), R = LV.at(Q, 6 * k, -60), Pn = [P[0], P[1] - 100], Qn = [Q[0], Q[1] - 100];
  return [
    { say: 'Choose a scale: 1 cm for every 2 km. Mark the start P and draw a North line straight up from it.', ops: [lpt(P, 'P', -10, 12), lsg(P, Pn, { cls: 'lb-thin' }), { t: 'lab', p: [Pn[0], Pn[1] - 10], text: 'N', cls: 'lb-n' }] },
    { say: 'Bearings are measured clockwise from North. Put the protractor on P with 0 on the North line, count round clockwise to 60°, and make a dot.', ops: [{ t: 'prot', v: P, d: 90, a: 60, cw: true, r: 70 }] },
    { say: 'Join P to the dot and measure 4 cm along it: that is 8 km. Mark Q.', ops: [lsg(P, Q), lpt(Q, 'Q', -14, -4), { t: 'lab', p: [P[0] + (Q[0] - P[0]) / 2 - 12, P[1] + (Q[1] - P[1]) / 2 - 12], text: '8 km' }] },
    { say: 'Every new point needs its own North line. Draw one at Q.', ops: [lsg(Q, Qn, { cls: 'lb-thin' }), { t: 'lab', p: [Qn[0], Qn[1] - 10], text: 'N', cls: 'lb-n' }] },
    { say: 'Put the protractor on Q, 0 on the North line, and count clockwise to 150°. Make a dot.', ops: [{ t: 'prot', v: Q, d: 90, a: 150, cw: true, r: 70 }] },
    { say: 'Join Q to the dot and measure 3 cm: that is 6 km. Mark R.', ops: [lsg(Q, R), lpt(R, 'R', 12, 6), { t: 'lab', p: [Q[0] + (R[0] - Q[0]) / 2 + 22, Q[1] + (R[1] - Q[1]) / 2], text: '6 km' }] },
    { say: 'Join P to R and measure it: 5 cm, so the ship is 10 km from P. The turn at Q is 90°, so Pythagoras agrees: √(8² + 6²) = √100 = 10 km.', ops: [lsg(P, R, { dash: true }), { t: 'rt', v: Q, a: P, b: R }, { t: 'lab', p: [P[0] + (R[0] - P[0]) / 2, P[1] + (R[1] - P[1]) / 2 + 14], text: '10 km' }] }
  ];
} });
LAB.push({ id: 'graph', name: 'Plot a graph from a table', blurb: 'y = x² − 2x − 3, then read off the roots', h: 300, steps: () => {
  const xs = [-2, -1, 0, 1, 2, 3, 4], f = x => x * x - 2 * x - 3, X = x => 140 + x * 42, Y = y => 190 - y * 18;
  const cx = i => 52 + i * 43, tab = [lsg([10, 10], [352, 10], { plain: true, cls: 'lb-thin' }), lsg([10, 30], [352, 30], { plain: true, cls: 'lb-thin' }), lsg([10, 50], [352, 50], { plain: true, cls: 'lb-thin' }), lsg([32, 10], [32, 50], { plain: true, cls: 'lb-thin' }),
    { t: 'lab', p: [21, 20], text: 'x', cls: 'lb-tabh', dur: 0.05 }, { t: 'lab', p: [21, 40], text: 'y', cls: 'lb-tabh', dur: 0.05 }, ...xs.map((x, i) => ({ t: 'lab', p: [cx(i), 20], text: nm(x), cls: 'lb-tab', dur: 0.05 }))];
  const ticks = [...[-2, -1, 1, 2, 3, 4].map(x => ({ t: 'lab', p: [X(x), Y(0) + 11], text: nm(x), cls: 'lb-ax', dur: 0.04 })), ...[-4, -2, 2, 4, 6].map(y => ({ t: 'lab', p: [X(0) - 10, Y(y)], text: nm(y), cls: 'lb-ax', dur: 0.04 }))];
  return [
    { say: 'Make a table of values. For each x, work out y = x² − 2x − 3. For example, when x = −2: 4 + 4 − 3 = 5.', ops: [...tab, ...xs.map((x, i) => ({ t: 'lab', p: [cx(i), 40], text: nm(f(x)), cls: 'lb-tab', dur: 0.4 }))] },
    { say: 'Draw the axes with your ruler and mark a scale: one step for each unit of x and of y.', ops: [lsg([X(-2.6), Y(0)], [X(4.6), Y(0)]), lsg([X(0), Y(-4.8)], [X(0), Y(6.6)]), ...ticks] },
    { say: 'Plot every point from the table with a small, neat cross.', ops: xs.map(x => ({ t: 'x', p: [X(x), Y(f(x))] })) },
    { say: 'Join the crosses with one smooth curve, drawn freehand. Never use a ruler for a curve, and never join the points with straight lines.', ops: [{ t: 'curve', pts: xs.map(x => [X(x), Y(f(x))]) }] },
    { say: 'Now read the graph. It crosses the x-axis at x = −1 and x = 3: those are the roots of x² − 2x − 3 = 0. Its lowest point, the turning point, is (1, −4).', ops: [lpt([X(-1), Y(0)], '−1', -2, -14), lpt([X(3), Y(0)], '3', 6, -14), lsg([X(1), Y(0)], [X(1), Y(-4)], { dash: true, plain: true }), lpt([X(1), Y(-4)], '(1, −4)', 0, 16)].map(o => Object.assign(o, { quiet: true })) }
  ];
} });
LAB.push({ id: 'loci-region', name: 'Loci: shade a region', blurb: 'Less than 4 cm from A and nearer to B than to A', steps: () => {
  const A = [130, 160], B = [310, 160], r = 120, P = LV.meet(A, B, 130, -1), Q = LV.meet(A, B, 130, 1), y1 = 160 - Math.sqrt(r * r - 90 * 90), y2 = 160 + Math.sqrt(r * r - 90 * 90);
  return [
    { say: 'Here are two points, A and B, 6 cm apart.', ops: [lpt(A, 'A', -12, 0), lpt(B, 'B', 12, 0), lsg(A, B, { cls: 'lb-thin' })] },
    { say: 'Points less than 4 cm from A lie inside a circle. Open the compass to 4 cm, put the point on A and draw the full circle.', ops: [{ t: 'arc', c: A, r, a0: -40, a1: 319.5, dur: 2.2 }] },
    { say: 'Points nearer to B than to A lie on B\'s side of the perpendicular bisector of AB. Construct it: arcs from A and from B, above and below the line.', ops: [{ t: 'arc', c: A, r: 130, a0: -52, a1: 52 }, { t: 'arc', c: B, r: 130, a0: 128, a1: 232 }] },
    { say: 'Join the two crossing points with your ruler. Every point on this line is the same distance from A and from B.', ops: [lsg(LV.ext(P, Q, -0.1), LV.ext(P, Q, 1.1))] },
    { say: 'Shade the region that obeys both rules: inside the circle, and on B\'s side of the line. That shaded region is the answer.', ops: [{ t: 'shade', d: `M220 ${fx1(y1)} A${r} ${r} 0 0 1 220 ${fx1(y2)} Z` }, { t: 'lab', p: [234, 140], text: 'R', cls: 'lb-n' }] }
  ];
} });

/* ── the rest of the Lab ── */
const far = (P, Q, r, V) => { const a = LV.meet(P, Q, r, 1), b = LV.meet(P, Q, r, -1); return LV.dist(a, V) > LV.dist(b, V) ? a : b; };
const circum = (A, B, C) => { const d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1])), s = p => p[0] * p[0] + p[1] * p[1];
  return [(s(A) * (B[1] - C[1]) + s(B) * (C[1] - A[1]) + s(C) * (A[1] - B[1])) / d, (s(A) * (C[0] - B[0]) + s(B) * (A[0] - C[0]) + s(C) * (B[0] - A[0])) / d]; };
const foot = (P, A, B) => { const dx = B[0] - A[0], dy = B[1] - A[1], t = ((P[0] - A[0]) * dx + (P[1] - A[1]) * dy) / (dx * dx + dy * dy); return [A[0] + t * dx, A[1] + t * dy]; };
const full = (c, r, from = 0) => ({ t: 'arc', c, r, a0: from, a1: from + 359.5, dur: 2.2 });
/* the arcs and line that bisect segment PQ */
const bisectOps = (P, Q, k = 0.72) => { const r = LV.dist(P, Q) * k, M = LV.meet(P, Q, r, 1), N = LV.meet(P, Q, r, -1); return { M, N, arcs: [LV.arcAt(P, M, 16), LV.arcAt(P, N, 16), LV.arcAt(Q, M, 16), LV.arcAt(Q, N, 16)], line: lsg(LV.ext(M, N, -0.08), LV.ext(M, N, 1.08)) }; };
/* the arcs and line that bisect the angle at V between rays to P and Q */
const angBisOps = (V, P, Q, r = 50, len = 200) => { const D = LV.at(V, r, LV.dir(V, P)), E = LV.at(V, r, LV.dir(V, Q)), R = LV.meet(D, E, r * 0.9, LV.dist(LV.meet(D, E, r * 0.9, 1), V) > LV.dist(LV.meet(D, E, r * 0.9, -1), V) ? 1 : -1);
  const a0 = LV.dir(V, P), a1 = LV.dir(V, Q); let s = Math.min(a0, a1), e = Math.max(a0, a1); if (e - s > 180) [s, e] = [e, s + 360];
  return { R, arcs: [{ t: 'arc', c: V, r, a0: s - 6, a1: e + 6 }, LV.arcAt(D, R, 16), LV.arcAt(E, R, 16)], line: lsg(V, LV.ext(V, R, len / LV.dist(V, R))) }; };

LAB.push({ id: 'copy-angle', name: 'Copy an angle', blurb: 'Make an angle equal to a given angle', cat: 1, steps: () => {
  const A = [40, 165], B = LV.at(A, 135, 0), C = LV.at(A, 130, 48), P = [205, 255], L = [350, 255], r = 70, D = LV.at(A, r, 0), E = LV.at(A, r, 48), F = LV.at(P, r, 0), G = LV.at(P, r, 48), de = LV.dist(D, E);
  return [
    { say: 'Here is the angle BAC that we want to copy, and a line starting at P where the copy will go.', ops: [lsg(A, B), lsg(A, C), lpt(A, 'A', -10, 10), lpt(B, 'B', 8, 14), lpt(C, 'C', -8, -10), lsg(P, L), lpt(P, 'P', -8, 14)] },
    { say: 'Put the compass on A and draw an arc that cuts both arms at D and E.', ops: [{ t: 'arc', c: A, r, a0: -8, a1: 58 }, lpt(D, 'D', 6, 14), lpt(E, 'E', -12, -2)] },
    { say: 'Keep the same radius. Put the compass on P and draw a long arc that cuts the line at F.', ops: [{ t: 'arc', c: P, r, a0: -8, a1: 70 }, lpt(F, 'F', 6, 14)] },
    { say: 'Now measure the gap: put the compass on D and open it to reach E.', ops: [{ t: 'arc', c: D, r: de, a0: LV.dir(D, E) - 8, a1: LV.dir(D, E) + 8 }] },
    { say: 'With that opening, put the compass on F and draw an arc that crosses the long arc at G.', ops: [LV.arcAt(F, G, 14), lpt(G, 'G', -10, -8)] },
    { say: 'Join P to G. Angle GPF is exactly equal to angle BAC.', ops: [lsg(P, LV.ext(P, G, 2.0)), { t: 'ang', v: A, a: B, b: C, label: '=', r: 30 }, { t: 'ang', v: P, a: L, b: G, label: '=', r: 30 }] }
  ];
} });
LAB.push({ id: 'parallel', name: 'A parallel line through a point', blurb: 'Draw a line through P parallel to AB', cat: 1, steps: () => {
  const A = [30, 220], B = [340, 220], P = [175, 110], Q = [120, 220], d = LV.dist(P, Q), R = [Q[0] + d, 220], S = [P[0] + d, 110];
  return [
    { say: 'Here is the line AB and the point P. We want a line through P that never meets AB.', ops: [lsg(A, B), lpt(A, 'A', 0, 16), lpt(B, 'B', 0, 16), lpt(P, 'P', -8, -12)] },
    { say: 'Choose a point Q on AB. Open the compass from Q to P, and with the point on Q draw an arc that cuts AB at R.', ops: [lpt(Q, 'Q', 0, 16), { t: 'arc', c: Q, r: d, a0: -12, a1: 76 }, lpt(R, 'R', 0, 16)] },
    { say: 'Keep the same radius. Put the compass on P and draw an arc to the right.', ops: [LV.arcAt(P, S, 16)] },
    { say: 'Same radius again. Put the compass on R and draw an arc that crosses the last one at S.', ops: [LV.arcAt(R, S, 16), lpt(S, 'S', 8, -10)] },
    { say: 'Join P to S and extend it. PQRS is a rhombus, so its opposite sides are parallel: PS is parallel to AB.', ops: [lsg([20, 110], [345, 110]), lsg(P, Q, { dash: true, plain: true }), lsg(R, S, { dash: true, plain: true })] }
  ];
} });
LAB.push({ id: 'angle-75', name: 'Construct an angle of 75°', blurb: 'Halfway between 60° and 90°', cat: 1, steps: () => {
  const O = [90, 240], L = [340, 240], r = 110, P = LV.at(O, r, 0), Q60 = LV.at(O, r, 60), Q120 = LV.at(O, r, 120), R90 = far(Q60, Q120, 95, O), Q90 = LV.at(O, r, 90), S = far(Q60, Q90, 80, O), Sf = LV.at(O, 215, 75);
  return [
    { say: 'Draw a line and mark O. With the compass on O, draw a big arc that cuts the line at P.', ops: [lsg([20, 240], L), lpt(O, 'O', 0, 16), { t: 'arc', c: O, r, a0: -6, a1: 135 }, lpt(P, 'P', 4, 16)] },
    { say: 'Same radius: step from P to mark 60° on the arc, then step again to mark 120°.', ops: [LV.arcAt(P, Q60, 14), lpt(Q60, '60°', 18, -4), LV.arcAt(Q60, Q120, 14), lpt(Q120, '120°', -16, -10)] },
    { say: 'Bisect between the 60° and 120° marks to get 90°: two arcs that cross, then a line from O.', ops: [LV.arcAt(Q60, R90, 14), LV.arcAt(Q120, R90, 14), lsg(O, LV.ext(O, R90, 1.15)), lpt(Q90, '', 0, 0)] },
    { say: 'Now bisect between the 60° mark and the 90° line: arcs from each that cross at S.', ops: [LV.arcAt(Q60, S, 14), LV.arcAt(Q90, S, 14), lpt(S, 'S', 12, -4)] },
    { say: 'Join O to S. Halfway between 60° and 90° is 75°.', ops: [lsg(O, Sf), { t: 'ang', v: O, a: P, b: S, label: '75°', r: 46 }] }
  ];
} });
LAB.push({ id: 'angle-135', name: 'Construct an angle of 135°', blurb: '90° plus half of another 90°', cat: 1, steps: () => {
  const O = [210, 240], r = 70, Aa = LV.at(O, r, 180), Bb = LV.at(O, r, 0), P = LV.meet(Bb, Aa, 120, 1), Q = LV.at(O, r, 90), R = [O[0] - r, O[1] - r], Rf = LV.ext(O, R, 2.0);
  return [
    { say: 'Draw a line and mark O. Construct 90° at O: arcs at A and B on the line, then arcs from A and B that meet at P. Join O to P.', ops: [lsg([20, 240], [345, 240]), lpt(O, 'O', 0, 16), LV.arcAt(O, Aa, 12), LV.arcAt(O, Bb, 12), lpt(Aa, 'A', 0, 16), lpt(Bb, 'B', 0, 16), LV.arcAt(Aa, P, 12), LV.arcAt(Bb, P, 12), lsg(O, LV.ext(O, P, 1.2))] },
    { say: 'With the compass on O and radius OA, mark Q where the arc cuts OP.', ops: [{ t: 'arc', c: O, r, a0: 84, a1: 186 }, lpt(Q, 'Q', 12, 0)] },
    { say: 'Bisect angle QOA: arcs from Q and from A with the same radius, crossing at R.', ops: [LV.arcAt(Q, R, 14), LV.arcAt(Aa, R, 14), lpt(R, 'R', -12, -6)] },
    { say: 'Join O to R. Angle ROB is 90° + 45° = 135°.', ops: [lsg(O, Rf), { t: 'ang', v: O, a: Bb, b: R, label: '135°', r: 32 }] }
  ];
} });
LAB.push({ id: 'triangle-sas', name: 'Triangle from two sides and an angle', blurb: 'AB = 7 cm, angle A = 60°, AC = 5 cm', cat: 2, steps: () => {
  const k = 30, A = [70, 240], B = [70 + 7 * k, 240], r = 70, P = LV.at(A, r, 0), Q = LV.at(A, r, 60), C = LV.at(A, 5 * k, 60);
  return [
    { say: 'Draw AB, 7 cm long.', ops: [lsg(A, B), lpt(A, 'A', -8, 14), lpt(B, 'B', 8, 14)] },
    { say: 'Construct 60° at A: an arc from A cutting AB, then the same radius from where it cuts, to mark the 60° point.', ops: [{ t: 'arc', c: A, r, a0: -6, a1: 76 }, LV.arcAt(P, Q, 16)] },
    { say: 'Draw a line from A through the 60° point.', ops: [lsg(A, LV.ext(A, Q, 2.6))] },
    { say: 'Open the compass to 5 cm. With the point on A, cut the 60° line at C.', ops: [LV.arcAt(A, C, 10), lpt(C, 'C', -10, -8)] },
    { say: 'Join C to B. Triangle ABC has AB = 7 cm, AC = 5 cm and angle A = 60°.', ops: [lsg(C, B), { t: 'ang', v: A, a: B, b: C, label: '60°', r: 30 }] }
  ];
} });
LAB.push({ id: 'circumcircle', name: 'The circle through three points', blurb: 'Draw the circumcircle of a triangle', cat: 2, h: 300, steps: () => {
  const A = [95, 225], B = [275, 235], C = [165, 105], O = circum(A, B, C), R = LV.dist(O, A), b1 = bisectOps(A, B), b2 = bisectOps(B, C);
  return [
    { say: 'Here is triangle ABC. We want one circle that passes through all three corners.', ops: [lsg(A, B), lsg(B, C), lsg(C, A), lpt(A, 'A', -10, 10), lpt(B, 'B', 10, 10), lpt(C, 'C', -4, -12)] },
    { say: 'Construct the perpendicular bisector of AB. Every point on it is the same distance from A and B.', ops: [...b1.arcs, b1.line] },
    { say: 'Construct the perpendicular bisector of BC. Every point on it is the same distance from B and C.', ops: [...b2.arcs, b2.line] },
    { say: 'The two bisectors cross at O, which is the same distance from all three corners.', ops: [lpt(O, 'O', 12, 4)] },
    { say: 'Put the compass on O, open it to A, and draw the circle. It passes through A, B and C: the circumcircle.', ops: [full(O, R, LV.dir(O, A))] }
  ];
} });
LAB.push({ id: 'incircle', name: 'The circle inside a triangle', blurb: 'Draw the inscribed circle', cat: 2, h: 300, steps: () => {
  const A = [60, 250], B = [310, 250], C = [150, 70], a = LV.dist(B, C), b = LV.dist(A, C), c = LV.dist(A, B), I = [(a * A[0] + b * B[0] + c * C[0]) / (a + b + c), (a * A[1] + b * B[1] + c * C[1]) / (a + b + c)], F = foot(I, A, B), r = LV.dist(I, F);
  const ba = angBisOps(A, B, C, 45, 230), bb = angBisOps(B, A, C, 45, 230);
  return [
    { say: 'Here is triangle ABC. We want the biggest circle that fits inside it, touching all three sides.', ops: [lsg(A, B), lsg(B, C), lsg(C, A), lpt(A, 'A', -10, 6), lpt(B, 'B', 10, 6), lpt(C, 'C', 0, -12)] },
    { say: 'Bisect angle A. Points on this line are the same distance from AB and AC.', ops: [...ba.arcs, ba.line] },
    { say: 'Bisect angle B. Points on this line are the same distance from AB and BC.', ops: [...bb.arcs, bb.line] },
    { say: 'The bisectors cross at I. Drop a perpendicular from I to AB: its length is the radius.', ops: [lpt(I, 'I', 12, -6), lsg(I, F, { dash: true }), { t: 'rt', v: F, a: B, b: I }] },
    { say: 'Put the compass on I, open it to the foot of the perpendicular, and draw the circle. It touches all three sides: the inscribed circle.', ops: [full(I, r, 270)] }
  ];
} });
/* statistics: a frequency table drawn as a histogram, then as an ogive */
const STAT = { cls: ['0–10', '10–20', '20–30', '30–40', '40–50'], f: [4, 8, 12, 10, 6] };
LAB.push({ id: 'histogram', name: 'Draw a histogram', blurb: 'Bars from a grouped frequency table', cat: 4, h: 300, steps: () => {
  const X = x => 60 + x * 5.4, Y = y => 260 - y * 15, bars = STAT.f.map((f, i) => ({ t: 'shade', d: `M${X(i * 10)} ${Y(0)} L${X(i * 10)} ${Y(f)} L${X(i * 10 + 10)} ${Y(f)} L${X(i * 10 + 10)} ${Y(0)} Z`, dur: 0.45 }));
  return [
    { say: 'Here is the table: marks out of 50 for 40 students, in classes of width 10. Frequencies: 4, 8, 12, 10 and 6.', ops: [{ t: 'lab', p: [28, 18], text: 'Marks', cls: 'lb-tabh', dur: 0.1 }, { t: 'lab', p: [28, 38], text: 'Freq.', cls: 'lb-tabh', dur: 0.1 }, ...STAT.cls.flatMap((c, i) => [{ t: 'lab', p: [X(i * 10 + 5), 18], text: c, cls: 'lb-tab', dur: 0.12 }, { t: 'lab', p: [X(i * 10 + 5), 38], text: STAT.f[i], cls: 'lb-tab', dur: 0.12 }])] },
    { say: 'Draw the axes with your ruler. Marks go along the bottom, from 0 to 50. Frequency goes up the side, from 0 to 12.', ops: [lsg([X(0), Y(0)], [X(52), Y(0)]), lsg([X(0), Y(0)], [X(0), Y(13)]), ...[0, 10, 20, 30, 40, 50].map(x => ({ t: 'lab', p: [X(x), Y(0) + 12], text: x, cls: 'lb-ax', dur: 0.04 })), ...[2, 4, 6, 8, 10, 12].map(y => ({ t: 'lab', p: [X(0) - 12, Y(y)], text: y, cls: 'lb-ax', dur: 0.04 }))] },
    { say: 'Draw one bar for each class. The bars touch, because the classes run on from each other. Each bar is as tall as its frequency.', ops: [...bars, ...STAT.f.map((f, i) => lsg([X(i * 10), Y(f)], [X(i * 10 + 10), Y(f)], { plain: true })), ...STAT.f.map((f, i) => lsg([X(i * 10 + 10), Y(0)], [X(i * 10 + 10), Y(Math.max(f, STAT.f[i + 1] || 0))], { plain: true })), lsg([X(0), Y(0)], [X(0), Y(4)], { plain: true })] },
    { say: 'Read it: the tallest bar is 20–30, so 20–30 is the modal class.', ops: [{ t: 'lab', p: [X(25), Y(12) - 12], text: 'modal class', cls: 'lb-n' }] }
  ];
} });
LAB.push({ id: 'ogive', name: 'Draw an ogive and find the median', blurb: 'Cumulative frequency curve from the same table', cat: 4, h: 300, steps: () => {
  const X = x => 60 + x * 5.4, Y = y => 262 - y * 4.9, cf = [0, 4, 12, 24, 34, 40], ub = [0, 10, 20, 30, 40, 50], med = 20 + 10 * (20 - 12) / 12;
  return [
    { say: 'Add up the frequencies as you go: 4, then 4 + 8 = 12, then 24, 34 and 40. These are the cumulative frequencies.', ops: [{ t: 'lab', p: [30, 14], text: 'Up to', cls: 'lb-tabh', dur: 0.1 }, { t: 'lab', p: [30, 32], text: 'Cum. f', cls: 'lb-tabh', dur: 0.1 }, ...cf.slice(1).flatMap((c, i) => [{ t: 'lab', p: [X(ub[i + 1]), 14], text: ub[i + 1], cls: 'lb-tab', dur: 0.12 }, { t: 'lab', p: [X(ub[i + 1]), 32], text: c, cls: 'lb-tab', dur: 0.12 }])] },
    { say: 'Draw the axes: marks along the bottom, cumulative frequency from 0 to 40 up the side.', ops: [lsg([X(0), Y(0)], [X(52), Y(0)]), lsg([X(0), Y(0)], [X(0), Y(42)]), ...ub.map(x => ({ t: 'lab', p: [X(x), Y(0) + 12], text: x, cls: 'lb-ax', dur: 0.04 })), ...[10, 20, 30, 40].map(y => ({ t: 'lab', p: [X(0) - 12, Y(y)], text: y, cls: 'lb-ax', dur: 0.04 }))] },
    { say: 'Plot each cumulative frequency at the upper end of its class: (10, 4), (20, 12), (30, 24), (40, 34) and (50, 40). Start the curve at (0, 0).', ops: ub.map((x, i) => ({ t: 'x', p: [X(x), Y(cf[i])] })) },
    { say: 'Join the points with a smooth S-shaped curve. This curve is the ogive.', ops: [{ t: 'curve', pts: ub.map((x, i) => [X(x), Y(cf[i])]) }] },
    { say: 'Find the median: half of 40 is 20. Read across from 20 to the curve, then straight down. The median is about 27 marks.', ops: [lsg([X(0), Y(20)], [X(med), Y(20)], { dash: true }), lsg([X(med), Y(20)], [X(med), Y(0)], { dash: true }), { t: 'lab', p: [X(med) + 2, Y(0) - 10], text: '≈ 27', cls: 'lb-n' }] }
  ];
} });
/* solids: a cylinder opened into its net */
const pathOp = (d, o = {}) => Object.assign({ t: 'path', d }, o);
LAB.push({ id: 'net-cylinder', name: 'The net of a cylinder', blurb: 'See where 2πr² + 2πrh comes from', cat: 5, h: 300, steps: () => {
  const cx = 80, top = 70, bot = 200, rx = 40, ry = 12;
  return [
    { say: 'Here is a closed cylinder with radius r and height h.', ops: [pathOp(`M${cx - rx} ${top} A${rx} ${ry} 0 1 0 ${cx + rx} ${top} A${rx} ${ry} 0 1 0 ${cx - rx} ${top}`), pathOp(`M${cx - rx} ${top} L${cx - rx} ${bot} A${rx} ${ry} 0 0 0 ${cx + rx} ${bot} L${cx + rx} ${top}`), { t: 'lab', p: [cx, top - 22], text: 'r', cls: 'lb-n' }, { t: 'lab', p: [cx + rx + 12, (top + bot) / 2], text: 'h', cls: 'lb-n' }] },
    { say: 'Cut off the top and the bottom. Each is a circle of radius r, with area πr².', ops: [pathOp(`M170 66 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0`), pathOp(`M170 234 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0`), { t: 'lab', p: [170, 66], text: 'πr²', cls: 'lb-tab' }, { t: 'lab', p: [170, 234], text: 'πr²', cls: 'lb-tab' }] },
    { say: 'Cut the curved side straight down and unroll it. It becomes a rectangle.', ops: [pathOp('M150 90 L340 90 L340 210 L150 210 Z')] },
    { say: 'Its height is h. Its length goes once round the circle, so it is the circumference, 2πr. Its area is 2πr × h = 2πrh.', ops: [{ t: 'lab', p: [245, 222], text: 'length = 2πr', cls: 'lb-ax' }, { t: 'lab', p: [352, 150], text: 'h', cls: 'lb-n' }, { t: 'lab', p: [245, 150], text: '2πrh', cls: 'lb-tab' }] },
    { say: 'Add the three pieces: total surface area = 2πr² + 2πrh = 2πr(r + h).', ops: [{ t: 'lab', p: [245, 274], text: 'Total = 2πr² + 2πrh', cls: 'lb-n' }] }
  ];
} });

/* keep related items next to each other in the list */
{ const order = ['bisect-line', 'bisect-angle', 'copy-angle', 'perp-point', 'parallel', 'angle-60', 'angle-30', 'angle-90', 'angle-45', 'angle-120', 'angle-75', 'angle-135', 'protractor'];
  LAB.sort((a, b) => { const i = order.indexOf(a.id), j = order.indexOf(b.id); return (i < 0 ? 99 : i) - (j < 0 ? 99 : j); }); }
/* sections for the Lab list */
const LAB_CATS = ['Lines and angles', 'Lines and angles', 'Triangles and circles', 'Bearings and loci', 'Graphs and statistics', 'Solids'];
Object.entries({ 'bisect-line': 1, 'bisect-angle': 1, 'angle-60': 1, 'angle-30': 1, 'angle-90': 1, 'angle-45': 1, 'angle-120': 1, protractor: 1, 'perp-point': 1, 'triangle-sss': 2, bearings: 3, 'loci-region': 3, graph: 4 }).forEach(([id, c]) => { const L = LAB.find(x => x.id === id); if (L) L.cat = c; });

const LIC = (() => {
  const T = (x, y, t) => `<text x="${x}" y="${y}" font-size="6.5" font-weight="700" fill="currentColor" stroke="none" text-anchor="middle" font-family="var(--body)">${t}</text>`;
  const ang = (deg, t) => {
    const ob = deg > 90, V = ob ? [16, 20] : [3, 20], r = ob ? 12 : 17, a = ob ? 4.5 : 6, c = Math.cos(deg * Math.PI / 180), sn = Math.sin(deg * Math.PI / 180);
    const E = [V[0] + r * c, V[1] - r * sn], M = [V[0] + a * c, V[1] - a * sn], f = n => n.toFixed(1);
    return `<path d="M${V[0]} 20H${ob ? 23 : 22}M${V[0]} 20L${f(E[0])} ${f(E[1])}"/><path d="M${V[0] + a} 20A${a} ${a} 0 0 0 ${f(M[0])} ${f(M[1])}" stroke-width="1.5"/>`
      + `<text x="${ob ? 16 : deg < 40 ? 11 : deg < 50 ? 18.5 : 17}" y="${ob ? 7 : deg < 40 ? 7.5 : 17}" font-size="8" font-weight="800" fill="currentColor" stroke="none" text-anchor="middle" font-family="var(--body)">${t}</text>`;
  };
  return {
    'bisect-line': '<path d="M3 13h18M12 3v18"/><path d="M8 6a6 6 0 0 1 8 0M8 20a6 6 0 0 0 8 0" stroke-width="1.5"/><circle cx="12" cy="13" r="1.4" fill="currentColor"/>',
    'bisect-angle': '<path d="M4 19h17M4 19L16 5M4 19l17-7"/><path d="M11 19a7 7 0 0 0-1.6-4.6" stroke-width="1.5"/>',
    'copy-angle': '<path d="M2 11h9M2 11l6-7M13 21h9M13 21l6-7"/><path d="M6 11a4 4 0 0 0-1.4-3M17 21a4 4 0 0 0-1.4-3" stroke-width="1.5"/>',
    'perp-point': '<path d="M3 19h18M12 19V6"/><path d="M12 15h4v4" stroke-width="1.5"/><circle cx="12" cy="4.5" r="1.6" fill="currentColor"/>',
    parallel: '<path d="M3 8h18M3 17h18"/><path d="M9 6l2 2-2 2M15 15l2 2-2 2" stroke-width="1.5"/>',
    'angle-60': ang(60, '60°'), 'angle-30': ang(30, '30°'), 'angle-90': ang(90, '90°'), 'angle-45': ang(45, '45°'),
    'angle-120': ang(120, '120°'), 'angle-75': ang(75, '75°'), 'angle-135': ang(135, '135°'),
    protractor: '<path d="M3 18a9 9 0 0 1 18 0z"/><path d="M12 18l5-7" stroke-width="1.5"/><path d="M5.5 12.5l1.2 1M12 9v1.6M18.5 12.5l-1.2 1" stroke-width="1.3"/>',
    'triangle-sss': '<path d="M3 19L12 4l9 15z"/><path d="M7 11l1.6 1M16 11l-1.6 1M12 17.5v3" stroke-width="1.5"/>',
    'triangle-sas': '<path d="M3 19L10 5l11 14z"/><path d="M8 19a5 5 0 0 0-2.8-4.4" stroke-width="1.5"/>',
    circumcircle: '<circle cx="12" cy="12" r="9"/><path d="M5 16.5L12 3l7.5 14z" stroke-width="1.5"/>',
    incircle: '<path d="M2 20L12 3l10 17z"/><circle cx="12" cy="14.2" r="4.6" stroke-width="1.5"/>',
    bearings: '<path d="M6 21V3M6 3l-2 3M6 3l2 3"/><path d="M6 14L20 8" stroke-width="1.5"/><path d="M6 9a5 5 0 0 1 4.6 3" stroke-width="1.3"/><text x="10" y="6" font-size="6.5" font-weight="700" fill="currentColor" stroke="none" font-family="var(--body)">N</text>',
    graph: '<path d="M3 3v18h18"/><path d="M6 6c2 13 7 13 12 0" stroke-width="1.8"/>',
    'loci-region': '<circle cx="9" cy="12" r="6" stroke-dasharray="2.5 2" stroke-width="1.5"/><path d="M16 3v18" stroke-width="1.5"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/>',
    histogram: '<path d="M3 21h18"/><path d="M4 21v-6h4v6M8 21V9h4v12M12 21V5h4v16M16 21v-9h4v9" stroke-width="1.6"/>',
    ogive: '<path d="M3 3v18h18"/><path d="M5 19c6 0 6-12 15-13" stroke-width="1.8"/><path d="M3 12h7v9" stroke-dasharray="2 2" stroke-width="1.2"/>',
    'net-cylinder': '<circle cx="12" cy="4.5" r="2.8"/><rect x="4" y="7.3" width="16" height="9.4" rx="1"/><circle cx="12" cy="19.5" r="2.8"/>'
  };
})();
const labGlyph = (id, s = 26) => `<svg aria-hidden="true" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${LIC[id] || IC.pen}</svg>`;

const CLK = (() => {
  const n2 = d => d.toFixed(2);
  const show = (at, svg, o = {}) => ({ at, until: o.until, par: o.par, dur: o.dur != null ? o.dur : 0.5, f: (d, anim) => anim ? `<g class="cl-in" style="animation-delay:${n2(d)}s">${svg}</g>` : svg });
  const gone = (at, svg, o = {}) => ({ at, until: at, par: o.par, dur: o.dur != null ? o.dur : 0.9, f: (d, anim) => anim ? `<g class="cl-out" style="animation-delay:${n2(d)}s">${svg}</g>` : '' });
  const lab = (at, p, text, o = {}) => show(at, `${o.to ? `<path class="cl-ld" d="M${o.to[0]} ${o.to[1]}L${p[0] + (o.anchor === 'start' ? -4 : o.anchor === 'end' ? 4 : 0)} ${p[1]}"/><circle class="cl-ld-dot" cx="${o.to[0]}" cy="${o.to[1]}" r="2.1"/>` : ''}<text class="cl-lbl${o.cls ? ' ' + o.cls : ''}" x="${p[0]}" y="${p[1]}" text-anchor="${o.anchor || 'middle'}" dy=".35em">${text}</text>`, { until: o.until, dur: o.dur != null ? o.dur : 0.35, par: o.par });
  /* a liquid whose level moves: the bottom stays put, the height goes from h0 to h1, with a crisp meniscus rim */
  const liq = (at, o) => ({ at, until: o.until, par: o.par, dur: o.dur != null ? o.dur : 1.6, f: (d, anim) => {
    const dur = o.dur != null ? o.dur : 1.6, clipAttr = o.clip ? ` clip-path="url(#${o.clip})"` : '', base = `class="cl-lq" fill="${o.fill}"${clipAttr} x="${o.x}" width="${o.w}"`;
    if (!anim || o.h0 === o.h1) {
      const yTop = o.bottom - o.h1;
      const men = o.h1 > 2 ? `<line class="cl-meniscus"${clipAttr} x1="${o.x}" x2="${o.x + o.w}" y1="${yTop}" y2="${yTop}"/>` : '';
      return `<rect ${base} y="${yTop}" height="${o.h1}"/>${men}`;
    }
    const y0 = o.bottom - o.h0, y1 = o.bottom - o.h1;
    const menAnim = o.h1 > 2 || o.h0 > 2 ? `<line class="cl-meniscus"${clipAttr} x1="${o.x}" x2="${o.x + o.w}" y1="${y0}" y2="${y0}"><animate attributeName="y1" from="${y0}" to="${y1}" begin="${n2(d)}s" dur="${dur}s" fill="freeze"/><animate attributeName="y2" from="${y0}" to="${y1}" begin="${n2(d)}s" dur="${dur}s" fill="freeze"/></line>` : '';
    return `<rect ${base} y="${y0}" height="${o.h0}"><animate attributeName="y" from="${y0}" to="${y1}" begin="${n2(d)}s" dur="${dur}s" fill="freeze"/><animate attributeName="height" from="${o.h0}" to="${o.h1}" begin="${n2(d)}s" dur="${dur}s" fill="freeze"/></rect>${menAnim}`;
  } });
  const drops = (at, x, y0, y1, n, o = {}) => ({ at, until: at, par: o.par, dur: n * 0.42, f: (d, anim) => !anim ? '' : `<circle r="2.4" cx="${x}" cy="${y0}" fill="${o.fill || '#D9EEFF'}" stroke="#FFFFFF" stroke-opacity=".55" stroke-width=".6" opacity="0"><set attributeName="opacity" to="1" begin="${n2(d)}s" dur="${n2(n * 0.42)}s"/><animate attributeName="cy" from="${y0}" to="${y1}" begin="${n2(d)}s" dur="0.42s" repeatCount="${n}"/></circle>` });
  /* bubbles keep rising for as long as the piece is on screen */
  const bubbles = (at, pts, o = {}) => ({ at, until: o.until, par: o.par, dur: o.dur != null ? o.dur : 1.2, f: (d, anim) => pts.map(([x, y0, y1], i) => { const b = n2((anim ? d : 0) + i * 0.31), t = o.t || 1.5; return `<circle class="cl-bub" r="${o.r || 2.2}" cx="${x}" cy="${y0}" opacity="0"><animate attributeName="cy" from="${y0}" to="${y1}" begin="${b}s" dur="${t}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.9;.9;0" begin="${b}s" dur="${t}s" repeatCount="indefinite"/></circle>`; }).join('') });
  const move = (at, svg, from, o = {}) => ({ at, until: o.until, par: o.par, dur: o.dur != null ? o.dur : 1, f: (d, anim) => !anim ? svg : `<g opacity="0"><set attributeName="opacity" to="1" begin="${n2(d)}s" fill="freeze"/><animateTransform attributeName="transform" type="translate" from="${from[0]} ${from[1]}" to="0 0" begin="${n2(d)}s" dur="${o.dur != null ? o.dur : 1}s" fill="freeze"/>${svg}</g>` });
  /* a spot that travels up the paper */
  const rise = (at, x, y0, y1, fill, o = {}) => ({ at, until: o.until, par: true, dur: 0, f: (d, anim) => anim ? `<ellipse cx="${x}" cy="${y0}" rx="7" ry="5" fill="${fill}"><animate attributeName="cy" from="${y0}" to="${y1}" begin="${n2(d)}s" dur="${o.dur || 3}s" fill="freeze"/></ellipse>` : `<ellipse cx="${x}" cy="${y1}" rx="7" ry="5" fill="${fill}"/>` });

  /* ── borosilicate glassware & precision apparatus ── */
  const beaker = (x, y, w, h) => `<path class="cl-gl" d="M${x - 4} ${y}h4v${h - 6}q0 6 6 6h${w - 12}q6 0 6-6v-${h - 6}h4"/><path class="cl-spec" d="M${x + 4} ${y + 6}v${Math.max(8, h - 18)}"/>`;
  const flaskPts = (cx, top, bot, nw = 8, bw = 36, nh = 22) => `${cx - nw + 1},${top} ${cx - nw + 1},${top + nh} ${cx - bw + 3},${bot - 1.5} ${cx + bw - 3},${bot - 1.5} ${cx + nw - 1},${top + nh} ${cx + nw - 1},${top}`;
  const flask = (cx, top, bot, nw = 8, bw = 36, nh = 22) => `<path class="cl-gl" d="M${cx - nw} ${top}V${top + nh}L${cx - bw} ${bot - 5}Q${cx - bw - 2} ${bot} ${cx - bw + 5} ${bot}H${cx + bw - 5}Q${cx + bw + 2} ${bot} ${cx + bw} ${bot - 5}L${cx + nw} ${top + nh}V${top}"/><path class="cl-spec" d="M${cx - nw + 3} ${top + nh + 3}L${cx - bw + 7} ${bot - 9}"/><path class="cl-ln" d="M${cx - nw - 3} ${top}H${cx + nw + 3}"/>`;
  const burette = (x, top, len) => { let g = ''; for (let i = 0; i <= 10; i++) g += `<path class="cl-thin" d="M${x - 6} ${top + 9 + i * (len - 18) / 10}h${i % 5 ? 4 : 7}"/>`; return `<rect class="cl-gl" x="${x - 6}" y="${top}" width="12" height="${len}" rx="1.5"/><path class="cl-spec" d="M${x - 3.5} ${top + 4}v${Math.max(10, len - 8)}"/>${g}<path class="cl-gl" d="M${x - 6} ${top + len}L${x - 2} ${top + len + 8}V${top + len + 26}M${x + 6} ${top + len}L${x + 2} ${top + len + 8}V${top + len + 26}"/><path class="cl-ln" d="M${x - 9} ${top + len + 13}H${x + 9}" stroke-width="3"/><circle cx="${x}" cy="${top + len + 13}" r="2.6" fill="#FFC531"/>`; };
  const stand = (x, top, base, cy, tox) => `<path class="cl-ln" d="M${x} ${top}V${base}" stroke-width="2.6"/><rect class="cl-ln" x="${x - 26}" y="${base}" width="78" height="6.5" rx="2" fill="rgba(213,226,219,.18)"/><rect x="${x - 4}" y="${cy - 5}" width="8" height="10" rx="1.5" fill="#9AA8A1" stroke="#D5E2DB" stroke-width="1"/><path class="cl-ln" d="M${x + 4} ${cy}H${tox - 7}M${tox - 9} ${cy - 6}v12h18v-12"/>`;
  const pipette = (cx, tip) => `<path class="cl-gl" d="M${cx - 2} ${tip}V${tip - 36}C${cx - 10} ${tip - 40} ${cx - 10} ${tip - 62} ${cx - 2} ${tip - 66}V${tip - 112}M${cx + 2} ${tip}V${tip - 36}C${cx + 10} ${tip - 40} ${cx + 10} ${tip - 62} ${cx + 2} ${tip - 66}V${tip - 112}"/><path class="cl-thin" d="M${cx - 4} ${tip - 80}h8"/>`;
  const dropper = (cx, tip) => `<path class="cl-gl" d="M${cx - 2.5} ${tip}V${tip - 22}h5V${tip}"/><ellipse class="cl-gl" cx="${cx}" cy="${tip - 29}" rx="5.5" ry="8.5" fill="rgba(245,196,81,.24)"/>`;
  const funnel = (cx, top, w, stem) => `<path class="cl-gl" d="M${cx - w / 2} ${top}L${cx - 3} ${top + w * 0.62}V${stem}M${cx + w / 2} ${top}L${cx + 3} ${top + w * 0.62}V${stem - 3}"/><path class="cl-ln" d="M${cx - w / 2 - 2} ${top}H${cx + w / 2 + 2}"/>`;
  const tube = (x, top, h, w = 22) => `<path class="cl-gl" d="M${x - w / 2} ${top}V${top + h - w / 2}A${w / 2} ${w / 2} 0 0 0 ${x + w / 2} ${top + h - w / 2}V${top}"/><path class="cl-spec" d="M${x - w / 2 + 3.5} ${top + 5}V${top + h - w / 2 - 2}"/><path class="cl-ln" d="M${x - w / 2 - 2} ${top}H${x + w / 2 + 2}"/>`;
  const tubeClip = (id, x, top, h, w = 22) => `<clipPath id="${id}"><path d="M${x - w / 2 + 1} ${top}V${top + h - w / 2}A${w / 2 - 1} ${w / 2 - 1} 0 0 0 ${x + w / 2 - 1} ${top + h - w / 2}V${top}Z"/></clipPath>`;
  const burner = (cx, base, top) => `<rect class="cl-ln" x="${cx - 22}" y="${base - 7}" width="44" height="7" rx="2" fill="rgba(213,226,219,.18)"/><rect class="cl-ln" x="${cx - 5}" y="${top}" width="10" height="${base - 7 - top}" fill="rgba(213,226,219,.13)"/><rect x="${cx - 7}" y="${base - 21}" width="14" height="6" rx="1" fill="rgba(255,197,49,.22)" stroke="#D5E2DB" stroke-width="1.1"/><path class="cl-thin" d="M${cx - 22} ${base - 3}h-18"/>`;
  const flame = (cx, y, h, fill = '#5AA9FF', op = 0.65) => `<g class="cl-flame"><path fill="${fill}" fill-opacity="${op}" d="M${cx} ${y}C${cx - h * 0.32} ${y - h * 0.3} ${cx - h * 0.17} ${y - h * 0.64} ${cx} ${y - h}C${cx + h * 0.17} ${y - h * 0.64} ${cx + h * 0.32} ${y - h * 0.3} ${cx} ${y}Z"/><path fill="#E8F6FF" fill-opacity="${Math.min(0.88, op + 0.2)}" d="M${cx} ${y}C${cx - h * 0.14} ${y - h * 0.16} ${cx - h * 0.08} ${y - h * 0.36} ${cx} ${y - h * 0.52}C${cx + h * 0.08} ${y - h * 0.36} ${cx + h * 0.14} ${y - h * 0.16} ${cx} ${y}Z"/></g>`;
  const tripod = (cx, top, base, w = 64) => `<path class="cl-ln" d="M${cx - w / 2} ${top}H${cx + w / 2}M${cx - w / 2 + 4} ${top}L${cx - w / 2 - 4} ${base}M${cx + w / 2 - 4} ${top}L${cx + w / 2 + 4} ${base}"/><rect x="${cx - w / 2 + 2}" y="${top - 3.5}" width="${w - 4}" height="3" rx="1" fill="rgba(233,239,236,.32)" stroke="#D5E2DB" stroke-width=".9" stroke-dasharray="3 2"/>`;
  const bench = (y, x0 = 10, x1 = 350) => `<path class="cl-bench" d="M${x0} ${y}H${x1}"/><path class="cl-thin" d="M${x0} ${y + 3}H${x1}" stroke-opacity=".22"/>`;
  return { show, gone, lab, liq, drops, bubbles, move, rise, beaker, flask, flaskPts, burette, stand, pipette, dropper, funnel, tube, tubeClip, burner, flame, tripod, bench };
})();

const CWATER = 'rgba(140,203,255,.34)', CCLEAR = 'rgba(205,228,245,.22)', CPINK = 'rgba(245,96,160,.62)', CBLUE = 'rgba(59,155,255,.6)';
const CLAB_CATS = {
  q: 'Volumetric & quantitative analysis',
  s: 'Separation & purification techniques',
  g: 'Preparation & tests for gases',
  i: 'Qualitative ion & salt analysis',
  p: 'Rates, energetics & electrolysis',
  o: 'Organic & biochemical tests',
};

/* ── 1. Titration ── */
LAB.push({ id: 'c-titration', subj: 'chem', cat: 'q', h: 306, name: 'Acid–base titration', blurb: 'Find the volume of acid that neutralises 25.0 cm³ of alkali',
  tip: `Read the burette at eye level, at the bottom of the meniscus, and record every reading to two decimal places. Use only concordant titres for the average.`,
  defs: `<clipPath id="clt-f"><polygon points="${CLK.flaskPts(175, 206, 286)}"/></clipPath>`,
  steps: () => [
    { say: 'Rinse a pipette with the sodium hydroxide solution, then use it to transfer exactly 25.0 cm³ of the alkali into a clean conical flask standing on a white tile.' },
    { say: 'Add two or three drops of phenolphthalein indicator. The alkali turns pink.' },
    { say: 'Rinse the burette with the hydrochloric acid, then fill it with the acid through a funnel. Remove the funnel and record the initial reading: 0.00 cm³.' },
    { say: 'Run the acid into the flask, swirling the flask all the time. Near the end point, add the acid drop by drop.' },
    { say: 'Stop at the end point, when one drop of acid turns the solution from pink to colourless. Record the final reading: 23.50 cm³. Titre = 23.50 − 0.00 = 23.50 cm³.' },
    { say: 'Repeat the titration until two titres agree within 0.10 cm³. Average the concordant titres: (23.50 + 23.40) ÷ 2 = 23.45 cm³.' }
  ],
  scene: () => { const K = CLK; return [
    K.show(0, `<rect x="118" y="287" width="114" height="6" rx="1.5" fill="#E9EFEC" fill-opacity=".85"/>` + K.flask(175, 206, 286), { dur: 0.6 }),
    K.lab(0, [262, 290], 'white tile', { anchor: 'start', to: [234, 290] }),
    K.lab(0, [262, 262], 'conical flask', { anchor: 'start', to: [208, 262] }),
    K.move(0, K.pipette(175, 222) + `<rect x="173.5" y="150" width="3" height="70" fill="${CWATER}"/>`, [0, -70], { until: 0, dur: 1.1 }),
    K.lab(0, [106, 150], 'pipette', { anchor: 'end', to: [166, 150], until: 0, par: true }),
    K.lab(0, [106, 164], '25.0 cm³ NaOH(aq)', { anchor: 'end', until: 0, cls: 'dimm' }),
    K.liq(0, { x: 135, w: 80, bottom: 285, h0: 0, h1: 22, fill: CCLEAR, clip: 'clt-f', until: 1, dur: 1.8 }),
    K.move(1, K.dropper(175, 204), [0, -40], { until: 1, dur: 0.7 }),
    K.lab(1, [106, 178], 'phenolphthalein', { anchor: 'end', to: [168, 178], until: 1, par: true }),
    K.drops(1, 175, 206, 262, 3, { fill: '#F2F7F3' }),
    K.show(1, `<rect class="cl-lq" fill="${CPINK}" clip-path="url(#clt-f)" x="135" width="80" y="263" height="22"/>`, { until: 2, dur: 0.9 }),
    K.show(2, K.stand(92, 8, 293, 60, 175) + K.burette(175, 12, 152), { dur: 0.7 }),
    K.lab(2, [262, 44], 'burette', { anchor: 'start', to: [183, 44], par: true }),
    K.lab(2, [262, 58], 'HCl(aq)', { anchor: 'start', cls: 'dimm' }),
    K.show(2, K.funnel(175, 2, 22, 20), { until: 2, dur: 0.4 }),
    K.liq(2, { x: 170, w: 10, bottom: 163, h0: 0, h1: 140, fill: CWATER, until: 2, dur: 2 }),
    K.lab(2, [156, 23], '0.00', { anchor: 'end', to: [168, 23], cls: 'eq' }),
    K.drops(3, 175, 192, 256, 9, { par: true }),
    K.liq(3, { x: 170, w: 10, bottom: 163, h0: 140, h1: 69.5, fill: CWATER, dur: 3.8, par: true }),
    K.liq(3, { x: 135, w: 80, bottom: 285, h0: 22, h1: 34, fill: CPINK, clip: 'clt-f', until: 3, dur: 3.8 }),
    K.gone(4, `<rect class="cl-lq" fill="${CPINK}" clip-path="url(#clt-f)" x="135" width="80" y="251" height="34"/>`, { par: true, dur: 0.9 }),
    K.show(4, `<rect class="cl-lq" fill="${CCLEAR}" clip-path="url(#clt-f)" x="135" width="80" y="251" height="34"/>`, { dur: 0.9 }),
    K.lab(4, [156, 93.5], '23.50', { anchor: 'end', to: [168, 93.5], cls: 'eq' }),
    K.lab(4, [262, 238], 'end point', { anchor: 'start', cls: 'eq' }),
    K.lab(5, [252, 98], 'Titres / cm³', { anchor: 'start', cls: 'big' }),
    K.lab(5, [252, 118], 'Rough   24.10', { anchor: 'start', cls: 'dimm' }),
    K.lab(5, [252, 134], 'First    23.50', { anchor: 'start' }),
    K.lab(5, [252, 150], 'Second 23.40', { anchor: 'start' }),
    K.lab(5, [252, 170], 'Average 23.45', { anchor: 'start', cls: 'eq' })
  ]; } });

/* ── 2. Sand and salt ── */
LAB.push({ id: 'c-filter', subj: 'chem', cat: 's', h: 300, vy: 96, name: 'Separate sand and salt', blurb: 'Dissolving, filtration, evaporation and crystallisation',
  tip: `Choose each method from the property that differs. Salt is soluble and sand is not, so filtration separates them. Water boils off and salt does not, so evaporation recovers the salt.`,
  defs: `<clipPath id="clf-f"><polygon points="${CLK.flaskPts(168, 196, 270, 8, 32, 20)}"/></clipPath>`,
  steps: () => [
    { say: 'Add the mixture of sand and salt to warm water in a beaker and stir. The salt dissolves. The sand does not.' },
    { say: 'Pour the mixture through a filter paper in a funnel. The insoluble sand cannot pass through the paper.' },
    { say: 'The sand left on the filter paper is the residue. The salt solution that passes through is the filtrate.' },
    { say: 'Pour the filtrate into an evaporating dish and heat it gently. The water evaporates and the solution becomes saturated.' },
    { say: 'Stop heating when crystals begin to form, and leave the dish to cool. Crystals of salt remain. Wash and dry the residue to recover the sand.' }
  ],
  scene: () => { const K = CLK, sand = (pts, r = 2) => pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="#C9A66B"/>`).join(''); return [
    K.show(0, K.bench(271) + K.beaker(18, 178, 70, 92), { dur: 0.5 }),
    K.liq(0, { x: 20, w: 66, bottom: 268, h0: 0, h1: 56, fill: CWATER, until: 0, dur: 1.2 }),
    K.show(0, sand([[28, 264], [36, 265], [44, 263], [52, 265], [60, 264], [68, 265], [76, 263], [32, 259], [48, 259], [64, 260], [72, 258]]), { until: 0 }),
    K.show(0, `<path class="cl-ln" d="M62 150L46 256" stroke-width="2.6"/>`, { until: 0, dur: 0.4 }),
    K.lab(0, [53, 286], 'sand + salt + water', { cls: 'dimm', until: 0 }),
    K.show(1, K.flask(168, 196, 270, 8, 32, 20) + K.funnel(168, 136, 58, 208) + `<path class="cl-thin" d="M141 138L168 170L195 138" stroke-dasharray="3 2"/>`, { dur: 0.6 }),
    K.show(1, `<path class="cl-ld" d="M84 172C100 130 124 118 142 130" marker-end="url(#cl-arr)"/>`, { until: 1, dur: 0.4 }),
    K.liq(1, { x: 20, w: 66, bottom: 268, h0: 56, h1: 6, fill: CWATER, dur: 3.2, par: true }),
    K.show(1, sand([[28, 266], [40, 266], [60, 266]]), { par: true, dur: 0.3 }),
    K.drops(1, 168, 210, 262, 8, { par: true }),
    K.liq(1, { x: 134, w: 68, bottom: 269, h0: 0, h1: 24, fill: CWATER, clip: 'clf-f', until: 2, dur: 3.2 }),
    K.show(1, sand([[160, 160], [166, 163], [172, 161], [177, 158], [168, 157], [163, 155], [173, 155]]), { dur: 0.6 }),
    K.lab(2, [210, 146], 'residue', { anchor: 'start', to: [182, 156], cls: 'eq' }),
    K.lab(2, [216, 246], 'filtrate', { anchor: 'start', to: [194, 258], cls: 'eq', until: 2 }),
    K.lab(2, [216, 260], '(salt solution)', { anchor: 'start', cls: 'dimm', until: 2 }),
    K.show(3, K.tripod(296, 214, 270, 60) + K.burner(296, 270, 236) + `<path class="cl-gl" d="M266 196Q296 226 326 196"/><path class="cl-ln" d="M264 196H328"/>`, { dur: 0.6 }),
    K.liq(3, { x: 134, w: 68, bottom: 269, h0: 24, h1: 0, fill: CWATER, clip: 'clf-f', dur: 1.2, until: 3, par: true }),
    K.show(3, `<path fill="${CWATER}" d="M270 199Q296 222 322 199Z"/>`, { until: 3, dur: 1.2 }),
    K.show(3, K.flame(296, 236, 22), { until: 3, dur: 0.3 }),
    { at: 3, until: 3, dur: 1.5, f: () => [282, 296, 310].map((x, i) => `<path class="cl-steam" style="animation-delay:${i * 0.5}s" d="M${x} 188q-4-6 0-12t0-12"/>`).join('') },
    K.lab(3, [296, 288], 'evaporating dish', { cls: 'dimm' }),
    K.gone(4, `<path fill="${CWATER}" d="M270 199Q296 222 322 199Z"/>`, { par: true }),
    K.show(4, [[284, 204], [292, 207], [300, 207], [308, 204], [296, 203]].map(p => `<rect x="${p[0] - 2.5}" y="${p[1] - 2.5}" width="5" height="5" fill="#F2F7F3" transform="rotate(20 ${p[0]} ${p[1]})"/>`).join(''), { dur: 1 }),
    K.lab(4, [296, 172], 'salt crystals', { cls: 'eq', to: [296, 198] })
  ]; } });

/* ── 3. Chromatography ── */
LAB.push({ id: 'c-chroma', subj: 'chem', cat: 's', h: 300, name: 'Paper chromatography', blurb: 'Separate the dyes in an ink and find R<sub>f</sub> values',
  tip: `Draw the start line in pencil, keep the spots small, and keep the solvent level below the start line. Measure every distance from the start line.`,
  steps: () => [
    { say: 'Draw a pencil line about 2 cm from the bottom of the chromatography paper. Pencil is used because it does not dissolve in the solvent.' },
    { say: 'Put a small spot of the ink on the line. Beside it, put spots of three known dyes: A, B and C.' },
    { say: 'Stand the paper in a beaker containing a little solvent. The solvent level must be below the pencil line, so that the spots are not washed off. Cover the beaker.' },
    { say: 'The solvent rises up the paper and carries the dyes with it. Each dye moves at its own rate, so the dyes separate.' },
    { say: 'When the solvent is near the top, remove the paper, mark the solvent front and dry the paper. The ink has given two spots, level with A and C. The ink contains dyes A and C.' },
    { say: 'Calculate R<sub>f</sub> for dye A. R<sub>f</sub> = distance moved by the spot ÷ distance moved by the solvent front = 3.0 ÷ 7.5 = 0.40.' }
  ],
  scene: () => { const K = CLK, X = [142, 168, 194, 220], col = ['#2BD67B', '#FFC531', '#FF8A73'], dot = (x, fill) => `<ellipse cx="${x}" cy="220" rx="6" ry="4.5" fill="${fill}"/>`; return [
    K.show(0, `<rect x="122" y="30" width="118" height="222" fill="#EEF3EF" fill-opacity=".12" stroke="#D5E2DB" stroke-width="1.2"/>`, { dur: 0.5 }),
    { at: 0, dur: 1, f: (d, anim) => anim ? `<path class="cl-pen lb-draw" pathLength="1" style="animation-delay:${d.toFixed(2)}s;animation-duration:.9s" d="M126 220H236"/>` : `<path class="cl-pen" d="M126 220H236"/>` },
    K.lab(0, [112, 220], 'pencil line', { anchor: 'end', to: [124, 220], until: 1 }),
    K.show(1, dot(X[0], '#6A7BD9'), { until: 2, dur: 0.3 }), K.show(1, dot(X[1], col[0]), { until: 2, dur: 0.3 }), K.show(1, dot(X[2], col[1]), { until: 2, dur: 0.3 }), K.show(1, dot(X[3], col[2]), { until: 2, dur: 0.3 }),
    K.lab(1, [X[0], 236], 'ink'), K.lab(1, [X[1], 236], 'A'), K.lab(1, [X[2], 236], 'B'), K.lab(1, [X[3], 236], 'C'),
    K.show(2, K.beaker(96, 56, 170, 216) + `<path class="cl-ln" d="M88 50H274" stroke-width="3"/>`, { until: 3, dur: 0.6 }),
    K.liq(2, { x: 98, w: 166, bottom: 270, h0: 0, h1: 26, fill: CWATER, until: 3, dur: 1 }),
    K.lab(2, [286, 258], 'solvent', { anchor: 'start', to: [262, 258], until: 3 }),
    K.lab(2, [286, 50], 'cover', { anchor: 'start', to: [274, 50], until: 3 }),
    K.liq(3, { x: 122, w: 118, bottom: 244, h0: 0, h1: 174, fill: 'rgba(140,203,255,.14)', dur: 3.4, par: true }),
    K.rise(3, X[0], 220, 160, col[0], { dur: 3.2 }), K.rise(3, X[0], 220, 100, col[2], { dur: 3.2 }),
    K.rise(3, X[1], 220, 160, col[0], { dur: 3.2 }), K.rise(3, X[2], 220, 130, col[1], { dur: 3.2 }), K.rise(3, X[3], 220, 100, col[2], { dur: 3.2 }),
    { at: 3, dur: 3.4, f: () => '' },
    K.show(4, `<path class="cl-pen" d="M126 70H236" stroke-dasharray="4 3"/>`, { dur: 0.4 }),
    K.lab(4, [112, 70], 'solvent front', { anchor: 'end', to: [124, 70] }),
    K.show(4, `<path class="cl-ld" d="M${X[0] + 8} 160H${X[1] - 8}M${X[0] + 8} 100H${X[3] - 8}" stroke-dasharray="2 3"/>`, { dur: 0.6 }),
    K.show(5, `<path class="cl-dim" d="M252 220V160M248 220h8M248 160h8"/><path class="cl-dim" d="M306 220V70M302 220h8M302 70h8"/>`, { dur: 0.6 }),
    K.lab(5, [258, 190], '3.0 cm', { anchor: 'start', cls: 'eq' }), K.lab(5, [312, 145], '7.5 cm', { anchor: 'start', cls: 'eq' }),
    K.lab(5, [180, 280], 'R<tspan baseline-shift="sub" font-size="9">f</tspan> of A = 3.0 ÷ 7.5 = 0.40', { cls: 'big' })
  ]; } });

/* ── 4. Electrolysis ── */
LAB.push({ id: 'c-electro', subj: 'chem', cat: 'p', h: 332, name: 'Electrolysis of copper(II) sulphate solution', blurb: 'With carbon electrodes: copper at the cathode, oxygen at the anode',
  tip: `For any electrolysis, list the ions present first, including H⁺ and OH⁻ from water. Then decide which ion is discharged at each electrode.`,
  steps: () => [
    { say: 'Two carbon electrodes dip into copper(II) sulphate solution and are connected to a battery. The electrode joined to the negative terminal is the cathode. The electrode joined to the positive terminal is the anode.' },
    { say: 'The solution contains Cu²⁺ and SO₄²⁻ ions from the salt, and H⁺ and OH⁻ ions from water. When the current flows, the positive ions migrate to the cathode and the negative ions migrate to the anode.' },
    { say: 'At the cathode, Cu²⁺ is discharged in preference to H⁺, because copper is lower in the electrochemical series. Cu²⁺ + 2e⁻ → Cu. A reddish-brown deposit of copper forms on the cathode.' },
    { say: 'At the anode, OH⁻ is discharged in preference to SO₄²⁻. 4OH⁻ → 2H₂O + O₂ + 4e⁻. Bubbles of oxygen are given off.' },
    { say: 'As Cu²⁺ ions are removed, the blue colour of the solution fades. The H⁺ and SO₄²⁻ ions that remain make the solution acidic: it becomes dilute sulphuric acid.' }
  ],
  scene: () => { const K = CLK, el = x => `<rect x="${x - 7}" y="84" width="14" height="168" rx="2" fill="#4A5550" stroke="#9AA8A1" stroke-width="1.2"/>`; return [
    K.show(0, K.bench(283) + K.beaker(92, 122, 176, 160), { dur: 0.5 }),
    K.liq(0, { x: 94, w: 172, bottom: 280, h0: 0, h1: 112, fill: CBLUE, until: 3, dur: 1.2 }),
    K.show(0, el(138) + el(222), { dur: 0.5 }),
    K.show(0, `<path class="cl-ln" d="M138 84V40H172M222 84V40H188"/><path class="cl-ln" d="M172 31v18" stroke-width="3.4"/><path class="cl-ln" d="M188 22v36" stroke-width="1.6"/>`, { dur: 0.6 }),
    K.lab(0, [163, 16], '−', { cls: 'big' }), K.lab(0, [198, 16], '+', { cls: 'big' }),
    K.lab(0, [84, 100], 'cathode (−)', { anchor: 'end', to: [129, 100] }), K.lab(0, [276, 100], 'anode (+)', { anchor: 'start', to: [231, 100] }),
    K.lab(0, [180, 294], 'copper(II) sulphate solution', { cls: 'dimm', until: 3 }),
    K.move(1, `<text class="cl-lbl ion" x="166" y="196" text-anchor="middle">Cu²⁺</text><text class="cl-lbl ion" x="164" y="236" text-anchor="middle">H⁺</text>`, [14, 0], { until: 3, dur: 1.6, par: true }),
    K.move(1, `<text class="cl-lbl ion" x="194" y="216" text-anchor="middle">SO₄²⁻</text><text class="cl-lbl ion" x="196" y="256" text-anchor="middle">OH⁻</text>`, [-14, 0], { until: 3, dur: 1.6 }),
    K.show(2, `<rect x="129.5" y="170" width="17" height="83" rx="2.5" fill="#B5651D"/>`, { dur: 1.6 }),
    K.lab(2, [84, 210], 'copper', { anchor: 'end', to: [129, 210], cls: 'eq' }),
    K.lab(2, [14, 310], 'Cathode: Cu²⁺ + 2e⁻ → Cu', { anchor: 'start', cls: 'eq' }),
    K.bubbles(3, [[212, 246, 172], [232, 236, 172], [214, 216, 172], [231, 250, 172]], { dur: 1.6 }),
    K.lab(3, [276, 150], 'oxygen', { anchor: 'start', to: [234, 166], cls: 'eq' }),
    K.lab(3, [14, 325], 'Anode: 4OH⁻ → 2H₂O + O₂ + 4e⁻', { anchor: 'start', cls: 'eq' }),
    K.gone(4, `<rect class="cl-lq" fill="${CBLUE}" x="94" width="172" y="168" height="112"/><g class="cl-lbl ion"><text x="166" y="196" text-anchor="middle">Cu²⁺</text><text x="164" y="236" text-anchor="middle">H⁺</text><text x="194" y="216" text-anchor="middle">SO₄²⁻</text><text x="196" y="256" text-anchor="middle">OH⁻</text></g>`, { par: true, dur: 1.6 }),
    K.show(4, `<rect class="cl-lq" fill="rgba(140,203,255,.2)" x="94" width="172" y="168" height="112"/><text class="cl-lbl ion" x="166" y="226" text-anchor="middle">H⁺</text><text class="cl-lbl ion" x="194" y="226" text-anchor="middle">SO₄²⁻</text>`, { dur: 1.6 }),
    K.lab(4, [180, 294], 'dilute sulphuric acid remains', { cls: 'dimm' })
  ]; } });

/* ── 5. Oxygen ── */
LAB.push({ id: 'c-oxygen', subj: 'chem', cat: 'g', h: 300, vy: 40, name: 'Prepare and test oxygen', blurb: 'From hydrogen peroxide, collected over water',
  tip: `A gas is collected over water only if it is not very soluble in water. Always let the first bubbles escape: they are air from the flask.`,
  defs: `<clipPath id="clo-f"><polygon points="${CLK.flaskPts(66, 180, 270, 9, 38, 24)}"/></clipPath>`,
  steps: () => [
    { say: 'Put manganese(IV) oxide, the catalyst, in a flask fitted with a dropping funnel and a delivery tube. The delivery tube leads under a gas jar full of water, inverted in a trough of water.' },
    { say: 'Run hydrogen peroxide solution slowly on to the manganese(IV) oxide. It decomposes rapidly: 2H₂O₂ → 2H₂O + O₂.' },
    { say: 'Let the first bubbles escape, because they are air. Then the oxygen bubbles into the gas jar and pushes the water down and out. This is collection by the downward displacement of water.' },
    { say: 'Test for oxygen: lower a glowing splint into the jar of gas. The splint relights.' }
  ],
  scene: () => { const K = CLK, U = 2; return [
    K.show(0, K.bench(271) + K.flask(66, 180, 270, 9, 38, 24) + `<rect x="56" y="174" width="20" height="9" rx="2" fill="#8A6B4A"/>` + `<ellipse cx="66" cy="265" rx="22" ry="3.5" fill="#1B1F1D" stroke="#555" stroke-width=".6"/>`, { until: U, dur: 0.6 }),
    K.show(0, `<path class="cl-gl" d="M50 96L60 118V250M72 96L62 118V250"/><path class="cl-ln" d="M48 96H74"/><path class="cl-ln" d="M55 132h12" stroke-width="3"/>`, { until: U, dur: 0.5 }),
    K.show(0, `<path class="cl-ln" d="M72 196V150H206V256H240V246" stroke-width="3.2" stroke-opacity=".55"/>`, { until: U, dur: 0.7 }),
    K.show(0, K.beaker(178, 204, 166, 66), { until: U, dur: 0.5 }),
    K.liq(0, { x: 180, w: 162, bottom: 268, h0: 0, h1: 50, fill: CWATER, until: U, dur: 1, par: true }),
    K.show(0, `<path class="cl-gl" d="M226 252V112h30V252"/><path class="cl-ln" d="M222 258l6-8h26l6 8z" fill="rgba(213,226,219,.2)"/>`, { until: U, dur: 0.5 }),
    K.liq(0, { x: 228, w: 26, bottom: 252, h0: 138, h1: 138, fill: CWATER, until: 1, dur: 0.2 }),
    K.lab(0, [70, 286], 'manganese(IV) oxide', { until: U }),
    K.lab(0, [140, 138], 'delivery tube', { until: U, cls: 'dimm' }),
    K.lab(0, [290, 100], 'gas jar', { anchor: 'start', to: [256, 126], until: U }), K.lab(0, [264, 286], 'trough of water', { until: U, cls: 'dimm' }),
    K.show(1, `<path fill="${CWATER}" d="M52.5 99h17l-7.5 17h-2z"/>`, { until: U, dur: 0.5 }),
    K.lab(1, [84, 100], 'hydrogen peroxide', { anchor: 'start', to: [72, 106], until: U }),
    K.drops(1, 61, 136, 252, 6, { par: true }),
    K.liq(1, { x: 28, w: 76, bottom: 269, h0: 0, h1: 18, fill: CWATER, clip: 'clo-f', until: U, dur: 2.4 }),
    K.bubbles(1, [[54, 264, 250], [66, 266, 250], [78, 264, 250]], { until: U, t: 0.9, r: 1.8, dur: 1 }),
    K.bubbles(2, [[240, 248, 150], [236, 248, 160], [245, 248, 156]], { until: U, par: true }),
    K.liq(2, { x: 228, w: 26, bottom: 252, h0: 138, h1: 30, fill: CWATER, until: U, dur: 4 }),
    K.lab(2, [241, 170], 'O₂', { cls: 'eq', until: U }),
    K.show(3, K.bench(271, 110, 250) + `<path class="cl-gl" d="M160 270V130h40V270"/><path class="cl-ln" d="M156 270H204"/>`, { dur: 0.5 }),
    K.lab(3, [216, 248], 'jar of oxygen', { anchor: 'start', to: [200, 248], cls: 'dimm' }),
    K.move(3, `<path d="M250 60L186 170" stroke="#C9A66B" stroke-width="3" stroke-linecap="round"/><circle cx="186" cy="170" r="3.5" fill="#FF8A3D"/>`, [30, -60], { dur: 1.4 }),
    K.lab(3, [262, 60], 'glowing splint', { anchor: 'start', to: [252, 62] }),
    K.show(3, K.flame(186, 170, 34, '#FFC531', 0.9) + K.flame(186, 170, 18, '#FFF3C4', 0.9), { dur: 0.5 }),
    K.lab(3, [130, 150], 'relights', { anchor: 'end', to: [176, 152], cls: 'eq' })
  ]; } });

/* ── 6. Cations with sodium hydroxide ── */
const CAT_T = [['Cu²⁺', 66, 'rgba(77,163,255,.6)', '#2F7FE0', 'blue', 'Cu(OH)₂'], ['Fe²⁺', 142, 'rgba(159,216,160,.42)', '#5E8C4A', 'green', 'Fe(OH)₂'], ['Fe³⁺', 218, 'rgba(232,197,71,.5)', '#9C4A1A', 'red-brown', 'Fe(OH)₃'], ['Zn²⁺', 294, CCLEAR, '#F2F2F2', 'white', 'Zn(OH)₂']];
LAB.push({ id: 'c-cations', subj: 'chem', cat: 'i', h: 300, name: 'Test for metal ions with sodium hydroxide', blurb: 'Cu²⁺, Fe²⁺, Fe³⁺ and Zn²⁺: precipitate colours, then excess',
  tip: `Add the sodium hydroxide a few drops at a time first, and record the colour of the precipitate. Only then add it in excess, and record whether the precipitate dissolves.`,
  defs: CAT_T.map((t, i) => CLK.tubeClip('clc-' + i, t[1], 70, 160, 30)).join(''),
  steps: () => [
    { say: 'Put about 2 cm³ of each solution into a separate test tube. Copper(II) ions are blue, iron(II) ions are pale green, iron(III) ions are yellow and zinc ions are colourless.' },
    { say: 'Add sodium hydroxide solution to each tube, a few drops at a time.' },
    { say: 'Each metal ion forms an insoluble hydroxide. Copper(II) gives a blue precipitate, iron(II) a green precipitate, iron(III) a reddish-brown precipitate and zinc a white precipitate.' },
    { say: 'Now add sodium hydroxide solution in excess. Only the white precipitate of zinc hydroxide dissolves, giving a colourless solution, because zinc hydroxide is amphoteric. The other precipitates are insoluble in excess.' },
    { say: 'The ionic equation has the same form each time. For copper(II): Cu²⁺(aq) + 2OH⁻(aq) → Cu(OH)₂(s).' }
  ],
  scene: () => { const K = CLK, ops = [K.show(0, `<path class="cl-ln" d="M30 238H330M30 238V250M330 238V250" stroke-width="2.4"/>` + CAT_T.map(t => K.tube(t[1], 70, 160, 30)).join(''), { dur: 0.6 })];
    CAT_T.forEach((t, i) => {
      const x = t[1], L = (at, h0, h1, o = {}) => K.liq(at, Object.assign({ x: x - 15, w: 30, bottom: 230, h0, h1, fill: t[2], clip: 'clc-' + i }, o));
      ops.push(L(0, 0, 44, { until: 0, dur: 0.8, par: i < 3 }), K.lab(0, [x, 262], t[0], { cls: 'big', par: true }));
    });
    CAT_T.forEach((t, i) => { const x = t[1];
      ops.push(K.move(1, K.dropper(x, 64), [0, -30], { until: 1, dur: 0.4, par: true }), K.drops(1, x, 66, 182, 3, { par: true }),
        K.liq(1, { x: x - 15, w: 30, bottom: 230, h0: 44, h1: 54, fill: t[2], clip: 'clc-' + i, until: 2, dur: 1.3 })); });
    ops.push(K.lab(1, [180, 12], 'sodium hydroxide solution, a few drops', { cls: 'dimm', until: 2 }));
    CAT_T.forEach((t, i) => { ops.push(K.liq(3, { x: t[1] - 15, w: 30, bottom: 230, h0: 54, h1: 92, fill: t[2], clip: 'clc-' + i, dur: 1.6, par: true })); });
    CAT_T.forEach((t, i) => { const x = t[1], ppt = `<rect x="${x - 15}" y="196" width="30" height="34" fill="${t[3]}" clip-path="url(#clc-${i})"/>`;
      ops.push(K.show(2, ppt, { until: i === 3 ? 2 : undefined, dur: 0.9, par: true }), K.lab(2, [x, 280], t[4], { cls: 'eq', until: i === 3 ? 2 : undefined, par: true })); });
    ops.push({ at: 2, dur: 1.2, f: () => '' });
    ops.push(K.gone(3, `<rect x="279" y="196" width="30" height="34" fill="#F2F2F2" clip-path="url(#clc-3)"/><text class="cl-lbl eq" x="294" y="280" text-anchor="middle" dy=".35em">white</text>`, { par: true, dur: 1.6 }), K.lab(3, [294, 280], 'dissolves', { cls: 'eq' }));
    ops.push(K.lab(3, [180, 12], 'sodium hydroxide solution, in excess', { cls: 'dimm' }), { at: 3, dur: 1.6, f: () => '' });
    CAT_T.forEach((t, i) => { if (i < 3) ops.push(K.lab(4, [t[1], 52], t[5], { par: true })); });
    ops.push(K.lab(4, [294, 52], 'soluble'), { at: 4, dur: 0.6, f: () => '' });
    return ops; } });

/* ── 7. Flame tests ── */
const FLT = [['Na⁺', 'golden yellow', '#FFC531'], ['K⁺', 'lilac', '#C8A2FF'], ['Ca²⁺', 'brick-red', '#E2553B'], ['Cu²⁺', 'blue-green', '#3FD6B0']];
LAB.push({ id: 'c-flame', subj: 'chem', cat: 'i', h: 300, name: 'Flame tests', blurb: 'Identify Na⁺, K⁺, Ca²⁺ and Cu²⁺ from the colour of the flame',
  tip: `Clean the wire in concentrated hydrochloric acid between tests, until it gives no colour to the flame. Use a non-luminous flame, so the colour is easy to see.`,
  steps: () => [
    { say: 'Clean a platinum or nichrome wire: dip it in concentrated hydrochloric acid and hold it in a non-luminous Bunsen flame. Repeat until the wire gives no colour to the flame.' },
    { say: 'Dip the clean wire into the solid to be tested, and hold it in the edge of the flame.' },
    { say: 'Sodium compounds colour the flame golden yellow.' },
    { say: 'Potassium compounds colour the flame lilac.' },
    { say: 'Calcium compounds colour the flame brick-red.' },
    { say: 'Copper(II) compounds colour the flame blue-green.' }
  ],
  scene: () => { const K = CLK, wire = `<path class="cl-ln" d="M330 150L262 136" stroke-width="5" stroke-opacity=".5"/><path class="cl-thin" d="M262 136L204 124" stroke-opacity="1"/><circle class="cl-thin" cx="201" cy="123" r="3" stroke-opacity="1"/>`;
    const ops = [K.show(0, K.bench(271) + K.burner(180, 270, 176) + `<path class="cl-thin" d="M158 267H110"/>`, { dur: 0.5 }),
      K.show(0, K.flame(180, 176, 96, '#5AA9FF', 0.4) + K.flame(180, 176, 46, '#8CCBFF', 0.6), { dur: 0.5 }),
      K.lab(0, [180, 286], 'Bunsen burner', { cls: 'dimm' }),
      K.show(0, K.beaker(30, 226, 46, 44) + `<rect class="cl-lq" x="32" y="246" width="42" height="22" fill="${CCLEAR}"/>`, { dur: 0.4 }), K.lab(0, [53, 214], 'conc. HCl', { cls: 'dimm' }),
      K.move(0, wire, [-140, 110], { dur: 1.4 }), K.lab(0, [300, 166], 'wire', { anchor: 'start', cls: 'dimm' }),
      K.show(1, `<path class="cl-gl" d="M276 262q24 12 48 0"/><path fill="#F2F7F3" fill-opacity=".8" d="M286 264q14 -9 28 0q-14 5 -28 0z"/>`, { dur: 0.4 }), K.lab(1, [300, 286], 'solid salt', { cls: 'dimm' }),
      K.move(1, `<circle cx="201" cy="123" r="3.4" fill="#F2F7F3"/>`, [100, 140], { dur: 1.2 })];
    FLT.forEach((t, i) => {
      ops.push(K.show(2 + i, K.flame(180, 176, 112, t[2], 0.75) + K.flame(186, 150, 70, t[2], 0.5), { until: 2 + i, dur: 0.8 }),
        K.show(2 + i, `<circle cx="22" cy="${40 + i * 22}" r="5.5" fill="${t[2]}"/>`, { par: true, dur: 0.3 }),
        K.lab(2 + i, [34, 40 + i * 22], `${t[0]} ${t[1]}`, { anchor: 'start', cls: 'bold' }));
    });
    return ops; } });

/* ── 8–20. Complete SS1–SS3 Chemistry Practicals ── */
LAB.push(...buildExtraChemLabs(CLK));
/* ── Complete SS1–SS3 Physics Practicals ── */
LAB.push(...buildPhysLabs(CLK));
/* ── Complete SS1–SS3 Biology Practicals ── */
LAB.push(...buildBioLabs(CLK));
/* ── Complete SS1–SS3 Agricultural Science Practicals ── */
LAB.push(...buildAgricLabs(CLK));
for (let i = 0; i < LAB.length; i++) {
  LAB[i] = sanitizeLabForNationalLearning(LAB[i]);
}
const CHEM_CAT_ORDER = ['q', 's', 'g', 'i', 'p', 'o'];
LAB.sort((a, b) => {
  if (a.subj !== 'chem' || b.subj !== 'chem') return 0;
  return CHEM_CAT_ORDER.indexOf(String(a.cat)) - CHEM_CAT_ORDER.indexOf(String(b.cat));
});

const labSvg0 = labSvg;
labSvg = function (L, k) {
  if (!L.scene) return labSvg0(L, k);
  let body = '', t = 0.2;
  L.scene().forEach(op => {
    if (op.at > k || (op.until != null && k > op.until)) return;
    const anim = op.at === k; body += op.f(t, anim); if (anim && !op.par) t += op.dur;
  });
  const vh = (L.h || 300) - (L.vy || 0);
  const gridDefs = `<pattern id="clGridMinor" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M 18 0 L 0 0 0 18" fill="none" stroke="#CBE4D7" stroke-opacity=".045" stroke-width=".6"/></pattern><linearGradient id="clGlassGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".14"/><stop offset=".32" stop-color="#D5E2DB" stop-opacity=".04"/><stop offset=".85" stop-color="#D5E2DB" stop-opacity=".02"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".11"/></linearGradient>`;
  return { svg: `<svg class="lb-svg cl-svg" viewBox="0 ${L.vy || 0} 360 ${vh}" role="img" aria-label="${L.name.replace(/<[^>]+>/g, '')}, step ${k + 1}"><defs>${gridDefs}<marker id="cl-arr" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L7 4L1 7" fill="none" stroke="#FFC531" stroke-width="1.5"/></marker>${L.defs || ''}</defs><rect class="lb-grid-layer" x="0" y="${L.vy || 0}" width="360" height="${vh}" fill="url(#clGridMinor)"/>${body}</svg>`, dur: t + 0.4 };
};

const CLAB_IC = {
  'c-titration': '<path d="M10.5 2v9l-1.5 2M13.5 2v9l1.5 2M9 6.5h6"/><path d="M10 15.5L6 21.5h12l-4-6" /><path class="ia" d="M12 13.2v1.6"/>',
  'c-filter': '<path d="M4 4h16l-6.5 8v5l-3 2v-7z"/><path class="ia" d="M8 7h8"/>',
  'c-chroma': '<rect x="6" y="2.5" width="12" height="19" rx="1"/><path d="M6 17.5h12" stroke-dasharray="2 2" stroke-width="1.2"/><circle class="id" cx="9.5" cy="12" r="1.5"/><circle class="id" cx="14.5" cy="7.5" r="1.5"/><circle class="id" cx="14.5" cy="13.5" r="1.5"/>',
  'c-electro': '<path d="M4 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"/><path class="ia" d="M9 4v13M15 4v13"/><path d="M9 4h2M13 4h2" stroke-width="1.4"/>',
  'c-oxygen': '<path d="M8 21V7h8v14"/><path d="M6 21h12"/><circle class="ia" cx="12" cy="16" r="1.4"/><circle class="ia" cx="10.5" cy="11.5" r="1"/><circle class="ia" cx="13.5" cy="9" r="1"/>',
  'c-cations': '<path d="M5 3v14a2.5 2.5 0 0 0 5 0V3M14 3v14a2.5 2.5 0 0 0 5 0V3M4 3h7M13 3h7"/><path class="ia" d="M5.6 14h3.8M14.6 12h3.8"/>',
  'c-flame': '<path d="M12 3c-4 5-4.5 8-2.6 10.5a3.4 3.4 0 0 0 5.2 0C16.5 11 16 8 12 3z" class="ia"/><path d="M10.5 15.5v5M13.5 15.5v5M7 21h10"/>',
  ...EXTRA_CLAB_ICONS,
};
const clIc = id => `<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${CLAB_IC[id] || IC.flask}</svg>`;

export {
  LAB_CATS,
  CLAB_CATS,
  PLAB_CATS,
  BLAB_CATS,
  ALAB_CATS,
  LIC,
  CLAB_IC,
  PLAB_IC,
  BLAB_IC,
  ALAB_IC,
  PHYS_LAB_FOR_TOPIC,
  BIO_LAB_FOR_TOPIC,
  AGRIC_LAB_FOR_TOPIC,
};

export function getLabsForSubject(subj: SubjectId): LabItem[] {
  if (
    subj === "fmaths" ||
    subj === "geog" ||
    subj === "eng" ||
    subj === "econ" ||
    subj === "civic" ||
    subj === "digitech" ||
    subj === "dataproc"
  ) {
    return [];
  }
  if (subj === "chem") return LAB.filter(L => L.subj === "chem");
  if (subj === "phys") return LAB.filter(L => L.subj === "phys");
  if (subj === "bio") return LAB.filter(L => L.subj === "bio");
  if (subj === "agric") return LAB.filter(L => L.subj === "agric");
  return LAB.filter(L => !L.subj);
}

export function getLabById(id: string): LabItem | undefined {
  return LAB.find(L => L.id === id);
}

export function renderLabSvg(item: LabItem, stepIdx: number): { svg: string; dur: number } {
  return labSvg(item, stepIdx);
}

export const MATH_LAB_FOR_TOPIC: Record<string, string> = {
  geom: "circumcircle",
  "m-proof": "triangle-sss",
  loci: "loci-region",
  trig: "angle-60",
  "m-bearing": "bearings",
  quad: "graph",
  poly: "graph",
  simul: "graph",
  ineq: "loci-region",
  "m-linprog": "loci-region",
  coord: "perp-point",
  "m-vec": "parallel",
  mens: "net-cylinder",
  "m-earth": "circumcircle",
  stats: "histogram",
  disp: "ogive",
};

export const CHEM_LAB_FOR_TOPIC: Record<string, string> = {
  "c-intro": "c-stdsol",
  "c-sep": "c-filter",
  "c-part": "c-sublim",
  "c-mol": "c-stdsol",
  "c-gas": "c-hydrogen",
  "c-energy": "c-calorim",
  "c-rate": "c-rate-thio",
  "c-eqm": "c-co2",
  "c-acid": "c-titration",
  "c-vol": "c-titration",
  "c-sol": "c-distill",
  "c-water": "c-distill",
  "c-elec": "c-electro",
  "c-redox": "c-redox-tit",
  "c-air": "c-oxygen",
  "c-carbon": "c-co2",
  "c-nonm": "c-ammonia",
  "c-metal": "c-flame",
  "c-qual": "c-cations",
  "c-org1": "c-org-unsat",
  "c-petro": "c-org-unsat",
  "c-org2": "c-org-unsat",
  "c-poly": "c-food-tests",
  "c-ind": "c-cations-nh3",
  "c-env": "c-anions",
  "c-ethics": "c-anions",
};
