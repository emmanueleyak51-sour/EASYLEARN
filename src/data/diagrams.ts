// @ts-nocheck
import type { DiagramSpec } from "../types";

const D = (() => {
  const R = n => Math.round(n * 10) / 10;
  const rad = d => d * Math.PI / 180;
  const svg = (w, h, label, body) => `<svg class="dg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">${body}</svg>`;
  const ln = (a, b, c = 'ln') => `<line class="${c}" x1="${R(a[0])}" y1="${R(a[1])}" x2="${R(b[0])}" y2="${R(b[1])}"/>`;
  const tx = (p, t, c = 'vl') => `<text class="${c}" x="${R(p[0])}" y="${R(p[1])}" text-anchor="middle" dy=".35em">${t}</text>`;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const mul = (a, k) => [a[0] * k, a[1] * k];
  const unit = a => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l]; };

  /* angle mark at vertex v, between the rays towards p and q, labelled t */
  function ang(v, p, q, t) {
    const u = unit(sub(p, v)), w = unit(sub(q, v));
    const th = Math.acos(Math.max(-1, Math.min(1, u[0] * w[0] + u[1] * w[1])));
    const r = 15, a = add(v, mul(u, r)), b = add(v, mul(w, r));
    const sweep = (u[0] * w[1] - u[1] * w[0]) > 0 ? 1 : 0;
    const d = Math.max(27, Math.min(42, 15 / Math.sin(th / 2)));
    const lp = add(v, mul(unit(add(u, w)), d));
    return `<path class="ac" d="M${R(a[0])} ${R(a[1])} A${r} ${r} 0 0 ${sweep} ${R(b[0])} ${R(b[1])}"/>` + tx(lp, t, 'al');
  }

  const kit = {};

  /* triangle with base angles A (left) and B (right). Labels: a, b, c (apex), e (exterior at right) */
  kit.tri = o => {
    let L = 180, A = rad(o.A), B = rad(o.B);
    let pr = L * Math.sin(B) / Math.sin(A + B), h = pr * Math.sin(A);
    if (h > 112) { const k = 112 / h; L *= k; pr *= k; h = 112; }
    const P = [36, 146], Q = [36 + L, 146], T = [P[0] + pr * Math.cos(A), P[1] - h], S = [Q[0] + 58, 146];
    let b = `<polygon class="ln" points="${R(P[0])},${P[1]} ${R(Q[0])},${Q[1]} ${R(T[0])},${R(T[1])}"/>`;
    if (o.e) b += ln(Q, S) + ang(Q, S, T, o.e);
    if (o.a) b += ang(P, Q, T, o.a);
    if (o.b) b += ang(Q, P, T, o.b);
    if (o.c) b += ang(T, P, Q, o.c);
    return svg(300, 166, o.label, b);
  };

  /* circle, centre O. pts: name → degrees round the circle. segs: pairs of names. marks: [vertex, from, to, label] */
  kit.circ = o => {
    const C = [150, 108], r = 84, pos = { O: C };
    for (const k in o.pts) pos[k] = [C[0] + r * Math.cos(rad(o.pts[k])), C[1] - r * Math.sin(rad(o.pts[k]))];
    let b = `<circle class="ln" cx="${C[0]}" cy="${C[1]}" r="${r}"/>`;
    o.segs.forEach(s => { b += ln(pos[s[0]], pos[s[1]]); });
    (o.marks || []).forEach(m => { b += ang(pos[m[0]], pos[m[1]], pos[m[2]], m[3]); });
    let ol = add(C, o.oOff || [-11, -10]);
    const mo = (o.marks || []).find(m => m[0] === 'O');
    if (mo && !o.oOff) ol = sub(C, mul(unit(add(unit(sub(pos[mo[1]], C)), unit(sub(pos[mo[2]], C)))), 13));
    b += `<circle class="pt" cx="${C[0]}" cy="${C[1]}" r="3"/>` + tx(ol, 'O');
    for (const k in o.pts) b += tx(add(pos[k], mul(unit(sub(pos[k], C)), 13)), k);
    return svg(300, 216, o.label, b);
  };

  /* two parallel lines PQ and RS cut by a transversal at t degrees; alternate angles labelled top and bot */
  kit.par = o => {
    const y1 = 54, y2 = 130, t = rad(o.t);
    const U = [176, y1], Lw = [U[0] - (y2 - y1) / Math.tan(t), y2], dir = [Math.cos(t), -Math.sin(t)];
    let b = ln([34, y1], [266, y1]) + ln([34, y2], [266, y2]) + ln(add(Lw, mul(dir, -38)), add(U, mul(dir, 42)));
    b += `<path class="ln" d="M226 ${y1 - 5}l8 5-8 5M226 ${y2 - 5}l8 5-8 5"/>`;
    b += ang(U, [34, y1], Lw, o.top) + ang(Lw, [266, y2], U, o.bot);
    b += tx([22, y1], 'P') + tx([278, y1], 'Q') + tx([22, y2], 'R') + tx([278, y2], 'S');
    return svg(300, 180, o.label, b);
  };

  /* bar chart of frequencies */
  kit.bars = o => {
    const n = o.x.length, mx = Math.max(...o.f), step = mx > 6 ? 2 : 1, top = Math.ceil(mx / step) * step;
    const X0 = 46, Y0 = 146, W = 236, H = 120, bw = W / n;
    let b = '';
    for (let v = 0; v <= top; v += step) {
      const y = Y0 - H * v / top;
      b += ln([X0, y], [X0 + W, y], v ? 'gr' : 'ax') + `<text class="tk" x="${X0 - 8}" y="${R(y)}" text-anchor="end" dy=".35em">${v}</text>`;
    }
    b += ln([X0, Y0], [X0, Y0 - H - 6], 'ax');
    o.x.forEach((lab, i) => {
      const h = H * o.f[i] / top;
      b += `<rect class="br" x="${R(X0 + i * bw + bw * 0.2)}" y="${R(Y0 - h)}" width="${R(bw * 0.6)}" height="${R(h)}" rx="3"/>` + tx([X0 + i * bw + bw / 2, Y0 + 13], lab, 'tk');
    });
    b += tx([X0 + W / 2, Y0 + 32], o.xl, 'at') + `<text class="at" transform="rotate(-90 14 ${Y0 - H / 2})" x="14" y="${Y0 - H / 2}" text-anchor="middle" dy=".35em">${o.yl}</text>`;
    return svg(300, 190, o.label, b);
  };

  /* pie chart. s: [[label, degrees], ...] */
  kit.pie = o => {
    const C = [150, 100], r = 82;
    let a0 = -90, b = '';
    o.s.forEach((s, i) => {
      const a1 = a0 + s[1];
      const p0 = [C[0] + r * Math.cos(rad(a0)), C[1] + r * Math.sin(rad(a0))], p1 = [C[0] + r * Math.cos(rad(a1)), C[1] + r * Math.sin(rad(a1))];
      b += `<path class="p${i % 4 + 1}" d="M${C[0]} ${C[1]}L${R(p0[0])} ${R(p0[1])}A${r} ${r} 0 ${s[1] > 180 ? 1 : 0} 1 ${R(p1[0])} ${R(p1[1])}Z"/>`;
      const am = rad((a0 + a1) / 2), m = [C[0] + r * 0.6 * Math.cos(am), C[1] + r * 0.6 * Math.sin(am)];
      b += tx([m[0], m[1] - 7], s[0], 'pl') + tx([m[0], m[1] + 8], s[1] + '°', 'pl');
      a0 = a1;
    });
    return svg(300, 200, o.label, b);
  };

  /* quadratic curve y = ax² + bx + c. ax: [x0, x1, y0, y1] axes window. pl: [from, to] part of the curve drawn */
  kit.parab = o => {
    /* cf: coefficients [c0, c1, c2, c3] for any polynomial, in place of a, b, c. shade: [from, to] area under the curve */
    const [x0, x1, y0, y1] = o.ax, f = o.cf ? x => o.cf.reduce((s, c, i) => s + c * Math.pow(x, i), 0) : x => o.a * x * x + o.b * x + o.c;
    const sx = x => 20 + (x - x0) / (x1 - x0) * 260, sy = y => 182 - (y - y0) / (y1 - y0) * 164;
    let d = '';
    for (let i = 0; i <= 60; i++) { const x = o.pl[0] + (o.pl[1] - o.pl[0]) * i / 60; d += (i ? 'L' : 'M') + R(sx(x)) + ' ' + R(sy(f(x))); }
    let b = '';
    if (o.shade) {
      let a = `M${R(sx(o.shade[0]))} ${R(sy(0))}`;
      for (let i = 0; i <= 50; i++) { const x = o.shade[0] + (o.shade[1] - o.shade[0]) * i / 50; a += `L${R(sx(x))} ${R(sy(f(x)))}`; }
      b += `<path class="rg" d="${a}L${R(sx(o.shade[1]))} ${R(sy(0))}Z"/>`;
    }
    b += ln([20, sy(0)], [280, sy(0)], 'ax') + ln([sx(0), 14], [sx(0), 186], 'ax');
    for (let x = Math.ceil(x0); x <= x1; x++) if (x !== 0) b += ln([sx(x), sy(0) - 3], [sx(x), sy(0) + 3], 'ax');
    b += `<path class="cv" d="${d}"/>`;
    for (let x = Math.ceil(x0); x <= x1; x++) if (x !== 0) b += tx([sx(x), sy(0) + 13], String(x).replace('-', '−'), 'tk');
    (o.roots || []).forEach(r => { b += `<circle class="rt" cx="${R(sx(r))}" cy="${R(sy(0))}" r="5"/>`; });
    if (o.tan != null) { const m = 2 * o.a * o.tan + o.b, y = f(o.tan), w = 1.1; b += ln([sx(o.tan - w), sy(y - m * w)], [sx(o.tan + w), sy(y + m * w)], 'tn') + `<circle class="rt" cx="${R(sx(o.tan))}" cy="${R(sy(y))}" r="5"/>`; }
    if (o.mark) b += `<circle class="rt" cx="${R(sx(o.mark[0]))}" cy="${R(sy(o.mark[1]))}" r="5"/>`;
    b += tx([288, sy(0) - 11], 'x', 'at') + tx([sx(0) + 11, 12], 'y', 'at');
    return svg(300, 200, o.label, b);
  };

  /* place-value table for 1011 in base two */
  kit.place = () => `<table class="tbl" aria-label="Place values of 1011 in base two">
<tr><th scope="row">Place value</th><td>2<sup>3</sup> = 8</td><td>2<sup>2</sup> = 4</td><td>2<sup>1</sup> = 2</td><td>2<sup>0</sup> = 1</td></tr>
<tr><th scope="row">Digit</th><td class="big">1</td><td class="big">0</td><td class="big">1</td><td class="big">1</td></tr>
<tr><th scope="row">Worth</th><td>8</td><td>0</td><td>2</td><td>1</td></tr></table>`;

  /* frequency table. x: values, f: frequencies */
  kit.ftable = o => `<table class="tbl" aria-label="${o.label}">
<tr><th scope="row">x</th>${o.x.map(v => `<td>${v}</td>`).join('')}</tr>
<tr><th scope="row">f</th>${o.f.map(v => `<td>${v}</td>`).join('')}</tr></table>`;

  /* right-angled triangle, right angle at bottom right. b, h set the shape. Labels: base, ht, hyp, ang (bottom left) */
  kit.rtri = o => {
    const k = Math.min(190 / o.b, 108 / o.h), ax = Math.max(30, (300 - o.b * k) / 2 - 10);
    const A = [ax, 138], B = [ax + o.b * k, 138], C = [B[0], 138 - o.h * k];
    let s = `<polygon class="ln" points="${R(A[0])},${A[1]} ${R(B[0])},${B[1]} ${R(C[0])},${R(C[1])}"/><path class="ln" d="M${R(B[0] - 10)} ${B[1]}v-10h10"/>`;
    if (o.ang) s += ang(A, B, C, o.ang);
    if (o.base) s += tx([(A[0] + B[0]) / 2, 153], o.base);
    if (o.ht) s += `<text class="vl" x="${R(B[0] + 9)}" y="${R((B[1] + C[1]) / 2)}" dy=".35em">${o.ht}</text>`;
    if (o.hyp) { const n = unit([-o.h, -o.b]); s += `<text class="vl" x="${R((A[0] + C[0]) / 2 + n[0] * 9)}" y="${R((A[1] + C[1]) / 2 + n[1] * 9)}" text-anchor="end">${o.hyp}</text>`; }
    return svg(300, 166, o.label, s);
  };

  /* sector of a circle, opening upward. deg: angle. Labels: r (radius), a (angle), arc */
  kit.sector = o => {
    const C = [150, 150], r = 112, a1 = rad(90 + o.deg / 2), a2 = rad(90 - o.deg / 2);
    const p1 = [C[0] + r * Math.cos(a1), C[1] - r * Math.sin(a1)], p2 = [C[0] + r * Math.cos(a2), C[1] - r * Math.sin(a2)];
    const d = unit(sub(p1, C)), n = [d[1], -d[0]];
    let s = `<path class="sf" d="M${C[0]} ${C[1]}L${R(p1[0])} ${R(p1[1])}A${r} ${r} 0 0 1 ${R(p2[0])} ${R(p2[1])}Z"/>` + ang(C, p1, p2, o.a);
    if (o.r) s += `<text class="vl" x="${R((C[0] + p1[0]) / 2 + n[0] * 10)}" y="${R((C[1] + p1[1]) / 2 + n[1] * 10)}" text-anchor="end" dy=".35em">${o.r}</text>`;
    if (o.arc) s += tx([C[0], C[1] - r - 12], o.arc);
    return svg(300, 168, o.label, s);
  };

  /* cylinder or cone. rn, hn set the proportions. Labels: r, h, l (slant height of a cone) */
  kit.solid = o => {
    const k = Math.min(70 / o.rn, 110 / o.hn), rx = o.rn * k, ry = rx * 0.26, H = o.hn * k, cx = 140, cyl = o.kind === 'cyl';
    const yT = 16 + (cyl ? ry : 0), yB = yT + H, L = R(cx - rx), Rt = R(cx + rx);
    let s = `<path class="ln ds" d="M${L} ${R(yB)}A${R(rx)} ${R(ry)} 0 0 1 ${Rt} ${R(yB)}"/><path class="ln" d="M${L} ${R(yB)}A${R(rx)} ${R(ry)} 0 0 0 ${Rt} ${R(yB)}"/>`;
    s += ln([cx, yB], [cx + rx, yB], 'ln ds') + `<circle class="pt" cx="${cx}" cy="${R(yB)}" r="2.5"/>` + tx([cx + rx / 2, yB + ry + 13], o.r);
    if (cyl) s += `<ellipse class="ln" cx="${cx}" cy="${R(yT)}" rx="${R(rx)}" ry="${R(ry)}"/>` + ln([cx - rx, yT], [cx - rx, yB]) + ln([cx + rx, yT], [cx + rx, yB]) + `<text class="vl" x="${R(cx + rx + 10)}" y="${R((yT + yB) / 2)}" dy=".35em">${o.h}</text>`;
    else {
      s += ln([cx, yT], [cx - rx, yB]) + ln([cx, yT], [cx + rx, yB]) + ln([cx, yT], [cx, yB], 'ln ds') + `<text class="vl" x="${cx - 8}" y="${R(yT + H * 0.6)}" text-anchor="end" dy=".35em">${o.h}</text>`;
      if (o.l) s += `<text class="vl" x="${R(cx + rx / 2 + 10)}" y="${R((yT + yB) / 2)}" dy=".35em">${o.l}</text>`;
    }
    return svg(300, R(yB + ry + 28), o.label, s);
  };

  /* coordinate grid. ax: [x0, x1, y0, y1]. pts: [x, y, label, dx, dy, anchor]. segs: [x1, y1, x2, y2]. lines: [m, c]. steps: run and rise for a segment */
  kit.grid = o => {
    /* fit: fill the width, with separate x and y scales (for graphs where the y-range is much taller than the x-range) */
    const [x0, x1, y0, y1] = o.ax, u = Math.min(260 / (x1 - x0), 180 / (y1 - y0));
    const ux = o.fit ? 260 / (x1 - x0) : u, uy = o.fit ? 180 / (y1 - y0) : u, ox = (300 - ux * (x1 - x0)) / 2;
    const sx = x => ox + (x - x0) * ux, sy = y => 12 + (y1 - y) * uy, stx = ux < 16 ? 2 : 1, sty = uy < 16 ? 2 : 1;
    let s = '';
    for (let x = Math.ceil(x0); x <= x1; x++) s += ln([sx(x), sy(y0)], [sx(x), sy(y1)], x ? 'gr' : 'ax');
    for (let y = Math.ceil(y0); y <= y1; y++) s += ln([sx(x0), sy(y)], [sx(x1), sy(y)], y ? 'gr' : 'ax');
    (o.lines || []).forEach(([m, c]) => {
      let a = x0, b = x1;
      if (m) { const t1 = (y0 - c) / m, t2 = (y1 - c) / m; a = Math.max(a, Math.min(t1, t2)); b = Math.min(b, Math.max(t1, t2)); }
      s += ln([sx(a), sy(m * a + c)], [sx(b), sy(m * b + c)], 'cv');
    });
    /* shaded half-plane: [m, c, above, dashed]. The window is clipped to the side of y = mx + c that is shaded. */
    (o.half || []).forEach(([m, c, above, dashed]) => {
      const side = (x, y) => above ? y - (m * x + c) : (m * x + c) - y;
      const box = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], poly = [];
      box.forEach((p, i) => {
        const q = box[(i + 1) % 4], fp = side(p[0], p[1]), fq = side(q[0], q[1]);
        if (fp >= 0) poly.push(p);
        if ((fp >= 0) !== (fq >= 0)) { const t = fp / (fp - fq); poly.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); }
      });
      if (poly.length > 2) s += `<polygon class="rg" points="${poly.map(p => R(sx(p[0])) + ',' + R(sy(p[1]))).join(' ')}"/>`;
      let a = x0, b = x1;
      if (m) { const t1 = (y0 - c) / m, t2 = (y1 - c) / m; a = Math.max(a, Math.min(t1, t2)); b = Math.min(b, Math.max(t1, t2)); }
      s += ln([sx(a), sy(m * a + c)], [sx(b), sy(m * b + c)], dashed ? 'cv dsh' : 'cv');
    });
    /* inverse variation y = k / x, drawn for x > 0 */
    (o.hyps || []).forEach(k => {
      let d = '', st = false;
      for (let i = 0; i <= 120; i++) {
        const x = Math.max(x0, 0) + (x1 - Math.max(x0, 0)) * i / 120; if (x <= 0) continue;
        const y = k / x; if (y > y1 || y < y0) { st = false; continue; }
        d += (st ? 'L' : 'M') + R(sx(x)) + ' ' + R(sy(y)); st = true;
      }
      s += `<path class="cv" d="${d}"/>`;
    });
    (o.segs || []).forEach(g => { s += ln([sx(g[0]), sy(g[1])], [sx(g[2]), sy(g[3])], g[4] ? 'cv dsh' : 'cv'); });
    /* dashed circles [cx, cy, r], for loci */
    (o.circles || []).forEach(([cx, cy, r]) => { s += `<ellipse class="cv dsh" cx="${R(sx(cx))}" cy="${R(sy(cy))}" rx="${R(r * ux)}" ry="${R(r * uy)}" fill="none"/>`; });
    (o.steps || []).forEach(g => {
      s += `<path class="ln ds" d="M${R(sx(g[0]))} ${R(sy(g[1]))}H${R(sx(g[2]))}V${R(sy(g[3]))}"/>` + tx([(sx(g[0]) + sx(g[2])) / 2, sy(g[1]) + 11], 'run ' + (g[2] - g[0]), 'tk')
        + `<text class="tk" x="${R(sx(g[2]) + 6)}" y="${R((sy(g[1]) + sy(g[3])) / 2)}" dy=".35em">rise ${g[3] - g[1]}</text>`;
    });
    for (let x = Math.ceil(x0); x <= x1; x++) if (x && x % stx === 0) s += tx([sx(x), sy(0) + 10], String(x).replace('-', '−'), 'tk');
    for (let y = Math.ceil(y0); y <= y1; y++) if (y && y % sty === 0) s += `<text class="tk" x="${R(sx(0) - 7)}" y="${R(sy(y))}" text-anchor="end" dy=".35em">${String(y).replace('-', '−')}</text>`;
    s += tx([sx(x1) + 9, sy(0)], 'x', 'at') + tx([sx(0), sy(y1) - 7], 'y', 'at');
    (o.pts || []).forEach(p => { s += `<circle class="rt" cx="${R(sx(p[0]))}" cy="${R(sy(p[1]))}" r="4.5"/><text class="vl" x="${R(sx(p[0]) + (p[3] == null ? 8 : p[3]))}" y="${R(sy(p[1]) + (p[4] == null ? -10 : p[4]))}"${p[5] ? ` text-anchor="${p[5]}"` : ''} dy=".35em">${p[2]}</text>`; });
    return svg(300, R(12 + uy * (y1 - y0) + 12), o.label, s);
  };

  /* Venn diagram in a universal set. Two sets: sets [A, B], v: { a, ab, b, out }.
     Three sets: sets [A, B, C], v: { a, b, c, ab, bc, ac, abc, out }. Region values are strings. shade: region keys to shade */
  kit.venn = o => {
    const three = o.sets.length === 3, v = o.v || {}, sh = o.shade || [];
    const H = three ? 236 : 176, r = three ? 62 : 64;
    const C = three ? [[118, 92], [182, 92], [150, 148]] : [[116, 92], [184, 92]];
    let s = `<rect class="ln" x="8" y="8" width="284" height="${H - 16}" rx="8"/><text class="at" x="18" y="24" dy=".35em">${o.u || 'U'}</text>`;
    if (sh.length) {
      // shade with a clip-path built from the circles each region is inside, masked by those it is outside
      const id = 'v' + Math.random().toString(36).slice(2, 8);
      const inside = { a: [0], b: [1], c: [2], ab: [0, 1], bc: [1, 2], ac: [0, 2], abc: [0, 1, 2] };
      sh.forEach((k, n) => {
        const ins = inside[k], outs = [0, 1, 2].slice(0, o.sets.length).filter(i => !ins.includes(i));
        const mid = `${id}${n}`;
        s += `<defs><mask id="${mid}m"><rect x="0" y="0" width="300" height="${H}" fill="#fff"/>${outs.map(i => `<circle cx="${C[i][0]}" cy="${C[i][1]}" r="${r}" fill="#000"/>`).join('')}</mask></defs>`;
        let g = `<rect class="vs" x="0" y="0" width="300" height="${H}" mask="url(#${mid}m)"/>`;
        ins.forEach((i, j) => { s += `<clipPath id="${mid}c${j}"><circle cx="${C[i][0]}" cy="${C[i][1]}" r="${r}"/></clipPath>`; });
        ins.slice().reverse().forEach((i, j) => { g = `<g clip-path="url(#${mid}c${ins.length - 1 - j})">${g}</g>`; });
        s += g;
      });
    }
    C.slice(0, o.sets.length).forEach(c => { s += `<circle class="ln" cx="${c[0]}" cy="${c[1]}" r="${r}"/>`; });
    const nameAt = three ? [[66, 40], [234, 40], [226, 200]] : [[64, 36], [236, 36]];
    o.sets.forEach((n, i) => { s += tx(nameAt[i], n, 'al'); });
    const at = three
      ? { a: [94, 74], b: [206, 74], c: [150, 178], ab: [150, 62], ac: [112, 130], bc: [188, 130], abc: [150, 112], out: [262, 214] }
      : { a: [82, 92], ab: [150, 92], b: [218, 92], out: [262, 156] };
    for (const k in v) if (at[k]) s += tx(at[k], v[k]);
    return svg(300, H, o.label, s);
  };

  /* number line from ax[0] to ax[1]. seg: [from, to, fromFilled, toFilled]; null for an end that runs on with an arrow */
  kit.nline = o => {
    const [x0, x1] = o.ax, sx = x => 26 + (x - x0) / (x1 - x0) * 248, y = 46;
    let s = ln([12, y], [288, y], 'ax') + `<path class="ln" d="M282 ${y - 5}l7 5-7 5M18 ${y - 5}l-7 5 7 5"/>`;
    for (let x = x0; x <= x1; x++) s += ln([sx(x), y - 5], [sx(x), y + 5], 'ax') + tx([sx(x), y + 18], String(x).replace('-', '−'), 'tk');
    (o.seg || []).forEach(([a, b, fa, fb]) => {
      const A = a == null ? 14 : sx(a), B = b == null ? 286 : sx(b);
      s += `<line class="sg" x1="${R(A)}" y1="${y}" x2="${R(B)}" y2="${y}"/>`;
      if (a == null) s += `<path class="sgh" d="M${R(A + 9)} ${y - 7}l-9 7 9 7"/>`;
      if (b == null) s += `<path class="sgh" d="M${R(B - 9)} ${y - 7}l9 7-9 7"/>`;
      if (a != null) s += `<circle class="${fa ? 'dotf' : 'doto'}" cx="${R(A)}" cy="${y}" r="6"/>`;
      if (b != null) s += `<circle class="${fb ? 'dotf' : 'doto'}" cx="${R(B)}" cy="${y}" r="6"/>`;
    });
    return svg(300, 76, o.label, s);
  };

  /* totals for two dice. hl: totals to highlight */
  kit.dice = o => {
    const hl = o.hl || [];
    let rows = `<tr><th scope="col">+</th>${[1, 2, 3, 4, 5, 6].map(n => `<th scope="col">${n}</th>`).join('')}</tr>`;
    for (let a = 1; a <= 6; a++) rows += `<tr><th scope="row">${a}</th>${[1, 2, 3, 4, 5, 6].map(b => `<td${hl.includes(a + b) ? ' class="hit"' : ''}>${a + b}</td>`).join('')}</tr>`;
    return `<table class="tbl dice" aria-label="${o.label}">${rows}</table>`;
  };

  /* two-stage tree diagram. b1: [[label, p], [label, p]]; b2: for each first branch, [[label, p], [label, p]] */
  kit.tree = o => {
    const S = [18, 104], F = [[118, 50], [118, 158]], G = [[232, 22], [232, 78], [232, 130], [232, 186]];
    let s = `<circle class="pt" cx="${S[0]}" cy="${S[1]}" r="3"/>`;
    const lab = (p, q, t, up) => { const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + (up ? -12 : 12)]; return `<text class="tl" x="${R(m[0])}" y="${R(m[1])}" text-anchor="middle" dy=".35em">${t}</text>`; };
    o.b1.forEach((b, i) => {
      s += ln(S, [F[i][0] - 12, F[i][1]]) + lab(S, F[i], b[1], i === 0) + tx(F[i], b[0], 'al');
      o.b2[i].forEach((c, j) => { const g = G[i * 2 + j]; s += ln([F[i][0] + 12, F[i][1]], [g[0] - 12, g[1]]) + lab(F[i], g, c[1], j === 0) + tx(g, c[0], 'al'); });
    });
    return svg(300, 208, o.label, s);
  };

  /* a sequence: terms in boxes with the step between them, such as +4 or ×3 */
  kit.seq = o => `<div class="seqd" role="img" aria-label="${o.label}">${o.t.map((v, i) => `${i ? `<span class="sq-op">${o.op}</span>` : ''}<span class="sq-t">${v}</span>`).join('')}<span class="sq-op">…</span></div>`;

  /* places filled one after another: the number of choices for each place, multiplied */
  kit.slots = o => `<div class="slotd" role="img" aria-label="${o.label}">${o.n.map((v, i) => `${i ? '<span class="sl-x">×</span>' : ''}<span class="sl"><b>${v}</b><small>${o.names[i]}</small></span>`).join('')}<span class="sl-x">=</span><span class="sl tot"><b>${o.n.reduce((a, b) => a * b, 1)}</b><small>ways</small></span></div>`;

  /* any small table. head: the top row, rows: the other rows (their first cell is a heading) */
  kit.table = o => `<table class="tbl" aria-label="${o.label}"><tr>${o.head.map((h, i) => `<th scope="col"${i ? '' : ' class="corner"'}>${h}</th>`).join('')}</tr>${o.rows.map(r => `<tr>${r.map((c, i) => i ? `<td>${c}</td>` : `<th scope="row">${c}</th>`).join('')}</tr>`).join('')}</table>`;

  /* the four basic loci. kind: circle, perp, angle, parallel */
  kit.locus = o => {
    let b = '';
    const dot = (p, t, dx, dy) => `<circle class="pt" cx="${p[0]}" cy="${p[1]}" r="4"/>` + tx([p[0] + (dx || 0), p[1] + (dy == null ? -13 : dy)], t);
    if (o.kind === 'circle') {
      const C = [150, 92], r = 62;
      b = `<circle class="lc" cx="${C[0]}" cy="${C[1]}" r="${r}"/>` + ln(C, [C[0] + r, C[1]]) + tx([C[0] + r / 2, C[1] - 11], o.r || 'r') + dot(C, o.c || 'O', -12, 4);
      [30, 110, 200, 290].forEach(a => { const t = a * Math.PI / 180; b += `<circle class="rt" cx="${R(C[0] + r * Math.cos(t))}" cy="${R(C[1] - r * Math.sin(t))}" r="4"/>`; });
      return svg(300, 184, o.label, b);
    }
    if (o.kind === 'perp') {
      const A = [80, 120], B = [220, 120], M = [150, 120], P = [150, 40];
      b = ln(A, B) + `<line class="lc" x1="150" y1="16" x2="150" y2="170"/>` + `<path class="ln" d="M150 110h10v10"/>` + `<path class="ln" d="M112 115v10M188 115v10"/>`
        + `<line class="ds ln" x1="${P[0]}" y1="${P[1]}" x2="${A[0]}" y2="${A[1]}"/><line class="ds ln" x1="${P[0]}" y1="${P[1]}" x2="${B[0]}" y2="${B[1]}"/>`
        + `<circle class="rt" cx="${P[0]}" cy="${P[1]}" r="4.5"/>` + tx([P[0] + 14, P[1] - 4], 'X') + dot(A, o.a || 'A', -10, 14) + dot(B, o.b || 'B', 10, 14);
      return svg(300, 184, o.label, b);
    }
    if (o.kind === 'angle') {
      const V = [40, 150], A = [270, 150], B = [200, 18], h = Math.atan2(150 - 30, 235 - 40) / 2;
      b = ln(V, A) + ln(V, B) + `<line class="lc" x1="${V[0]}" y1="${V[1]}" x2="${R(V[0] + 250 * Math.cos(h))}" y2="${R(V[1] - 250 * Math.sin(h))}"/>` + ang(V, A, [V[0] + 10 * Math.cos(h), V[1] - 10 * Math.sin(h)], '') + ang(V, [V[0] + 10 * Math.cos(h), V[1] - 10 * Math.sin(h)], B, '')
        + dot(V, 'V', -12, 6) + tx([A[0] + 4, A[1] + 14], 'A') + tx([B[0] + 10, B[1] - 6], 'B');
      return svg(300, 172, o.label, b);
    }
    // parallel
    b = ln([20, 92], [280, 92]) + tx([290, 92], 'l') + `<line class="lc" x1="20" y1="42" x2="280" y2="42"/><line class="lc" x1="20" y1="142" x2="280" y2="142"/>`
      + `<path class="ln" d="M70 92V46M66 50l4-6 4 6M70 92v46M66 134l4 6 4-6"/>` + tx([96, 66], o.d || 'd') + tx([96, 118], o.d || 'd');
    return svg(300, 184, o.label, b);
  };

  /* ── gap-fill diagrams ── */
  const at = (C, r, deg) => [C[0] + r * Math.cos(rad(deg)), C[1] - r * Math.sin(rad(deg))];
  const cross = (p1, p2, p3, p4) => { const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]), t = ((p1[0] - p3[0]) * (p3[1] - p4[1]) - (p1[1] - p3[1]) * (p3[0] - p4[0])) / d; return [p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])]; };
  const lab = (a, b, t, off) => { const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], u = unit(sub(b, a)), n = [-u[1] * (off || 11), u[0] * (off || 11)]; return tx(add(m, n), t); };

  /* clock for modular arithmetic: n numbers round a circle, hi: numbers to highlight */
  kit.clock = o => {
    const C = [150, 96], r = 72; let b = `<circle class="ln" cx="${C[0]}" cy="${C[1]}" r="${r}"/>`;
    for (let k = 0; k < o.n; k++) {
      const p = at(C, r, 90 - k * 360 / o.n), q = at(C, r + 16, 90 - k * 360 / o.n), h = (o.hi || []).includes(k);
      b += `<circle class="${h ? 'rt' : 'pt'}" cx="${R(p[0])}" cy="${R(p[1])}" r="${h ? 6 : 3.5}"/>` + tx(q, k, h ? 'al' : 'vl');
    }
    if (o.from != null) { const p = at(C, r - 14, 90 - o.from * 360 / o.n), q = at(C, r - 14, 90 - o.to * 360 / o.n); b += `<path class="ac" d="M${R(p[0])} ${R(p[1])}A${r - 14} ${r - 14} 0 ${o.big ? 1 : 0} 1 ${R(q[0])} ${R(q[1])}"/>`; }
    return svg(300, 196, o.label, b + tx(C, o.mid || '', 'at'));
  };

  /* two chords crossing at X inside a circle, with the four parts labelled */
  kit.chords = o => {
    const C = [150, 100], r = 84, A = at(C, r, 205), B = at(C, r, 5), Cc = at(C, r, 112), D = at(C, r, 285), X = cross(A, B, Cc, D);
    let b = `<circle class="ln" cx="${C[0]}" cy="${C[1]}" r="${r}"/>` + ln(A, B) + ln(Cc, D) + `<circle class="rt" cx="${R(X[0])}" cy="${R(X[1])}" r="4.5"/>`;
    b += lab(A, X, o.a, -12) + lab(X, B, o.b, -12) + lab(Cc, X, o.c, 12) + lab(X, D, o.d, 12);
    [[A, 'A', 205], [B, 'B', 5], [Cc, 'C', 112], [D, 'D', 285]].forEach(([p, t, d]) => { b += tx(at(C, r + 13, d), t); });
    return svg(300, 200, o.label, b + tx([X[0] + 2, X[1] + 16], 'X', 'al'));
  };

  /* constructing a 60° angle with compasses */
  kit.construct = o => {
    const V = [50, 150], r = 110, B = [V[0] + r, 150], P = at(V, r, 60);
    let b = ln([30, 150], [280, 150]) + `<path class="lc" d="M${R(at(V, r, -6)[0])} ${R(at(V, r, -6)[1])}A${r} ${r} 0 0 0 ${R(at(V, r, 80)[0])} ${R(at(V, r, 80)[1])}"/>`;
    b += `<path class="lc" d="M${R(at(B, r, 105)[0])} ${R(at(B, r, 105)[1])}A${r} ${r} 0 0 0 ${R(at(B, r, 135)[0])} ${R(at(B, r, 135)[1])}"/>`;
    b += ln(V, at(V, 175, 60)) + `<circle class="pt" cx="${V[0]}" cy="${V[1]}" r="4"/><circle class="pt" cx="${B[0]}" cy="${B[1]}" r="4"/><circle class="rt" cx="${R(P[0])}" cy="${R(P[1])}" r="4.5"/>`;
    b += ang(V, B, P, '60°') + tx([V[0] - 4, 166], 'V') + tx([B[0], 166], 'B') + tx([P[0] - 14, P[1] - 6], 'P');
    return svg(300, 180, o.label, b);
  };

  /* minor segment of a circle cut off by a chord, angle deg at the centre */
  kit.segment = o => {
    const C = [150, 120], r = 90, a1 = 90 + o.deg / 2, a2 = 90 - o.deg / 2, P = at(C, r, a1), Q = at(C, r, a2);
    let b = `<circle class="ln" cx="${C[0]}" cy="${C[1]}" r="${r}"/><path class="sf" d="M${R(P[0])} ${R(P[1])}A${r} ${r} 0 0 1 ${R(Q[0])} ${R(Q[1])}Z"/>`;
    b += ln(C, P, 'ln ds') + ln(C, Q, 'ln ds') + ang(C, P, Q, o.deg + '°') + lab(C, P, o.r || 'r', 12) + `<circle class="pt" cx="${C[0]}" cy="${C[1]}" r="3"/>` + tx([C[0], C[1] + 15], 'O');
    return svg(300, 220, o.label, b);
  };

  /* square-based pyramid */
  kit.pyramid = o => {
    const A = [70, 150], B = [200, 150], Cc = [250, 112], D = [120, 112], M = [160, 131], T = [160, 22];
    let b = ln(A, B) + ln(B, Cc) + ln(Cc, D, 'ln ds') + ln(D, A, 'ln ds') + ln(T, A) + ln(T, B) + ln(T, Cc) + ln(T, D, 'ln ds') + ln(T, M, 'ln ds') + `<path class="ln" d="M160 123h8v8"/>`;
    b += tx([135, 165], o.b || '') + `<text class="vl" x="${168}" y="${82}" dy=".35em">${o.h || ''}</text>`;
    return svg(300, 180, o.label, b);
  };

  /* the earth as a sphere, with a circle of latitude */
  kit.earth = o => {
    const C = [150, 104], R0 = 84, y = C[1] - R0 * Math.sin(rad(o.lat)), w = R0 * Math.cos(rad(o.lat)), P = [C[0] + w, y];
    let b = `<circle class="ln" cx="${C[0]}" cy="${C[1]}" r="${R0}"/><ellipse class="ln ds" cx="${C[0]}" cy="${C[1]}" rx="${R0}" ry="14"/>`;
    b += `<ellipse class="lc" cx="${C[0]}" cy="${R(y)}" rx="${R(w)}" ry="${R(14 * Math.cos(rad(o.lat)))}"/>` + ln(C, [C[0] + R0, C[1]]) + ln(C, P) + ln([C[0], y], P, 'ln ds');
    b += ang(C, [C[0] + R0, C[1]], P, o.lat + '°') + `<circle class="pt" cx="${C[0]}" cy="${C[1]}" r="3"/>` + tx([C[0] - 12, C[1] + 4], 'O') + tx([C[0], C[1] - R0 - 10], 'N') + tx([C[0], C[1] + R0 + 12], 'S');
    b += tx([C[0] + w / 2, y - 22], o.small || 'r') + tx([C[0] + R0 + 26, C[1]], 'equator', 'tk');
    return svg(300, 212, o.label, b);
  };

  /* bearing of B from A, measured clockwise from north */
  kit.bearing = o => {
    const A = [150, 112], N = [150, 22], B = at(A, 88, 90 - o.deg), r = 30, S = at(A, r, 90), E = at(A, r, 90 - o.deg);
    let b = ln(A, N) + `<path class="ln" d="M144 32l6-12 6 12"/>` + tx([150, 12], 'N', 'al') + ln(A, B) + `<circle class="pt" cx="${A[0]}" cy="${A[1]}" r="4"/><circle class="rt" cx="${R(B[0])}" cy="${R(B[1])}" r="4.5"/>`;
    b += `<path class="ac" d="M${R(S[0])} ${R(S[1])}A${r} ${r} 0 ${o.deg > 180 ? 1 : 0} 1 ${R(E[0])} ${R(E[1])}"/>`;
    const L = at(A, r + 18, 90 - o.deg / 2);
    b += tx(L, o.t || o.deg + '°', 'al') + tx([A[0] - 12, A[1] + 12], o.a || 'A') + tx(add(B, mul(unit(sub(B, A)), 13)), o.b || 'B');
    return svg(300, 206, o.label, b);
  };

  /* y = sin x and y = cos x for x from 0° to 360° */
  kit.wave = o => {
    const sx = x => 34 + x / 360 * 246, sy = y => 92 - y * 62;
    let b = ln([34, sy(0)], [286, sy(0)], 'ax') + ln([34, 22], [34, 162], 'ax');
    [90, 180, 270, 360].forEach(x => { b += ln([sx(x), sy(0) - 3], [sx(x), sy(0) + 3], 'ax') + tx([sx(x), sy(0) + 13], x + '°', 'tk'); });
    [1, -1].forEach(y => { b += ln([30, sy(y)], [286, sy(y)], 'gr') + `<text class="tk" x="27" y="${sy(y)}" text-anchor="end" dy=".35em">${y > 0 ? 1 : '−1'}</text>`; });
    (o.f || ['sin']).forEach((f, i) => {
      let d = ''; for (let x = 0; x <= 360; x += 5) d += (x ? 'L' : 'M') + R(sx(x)) + ' ' + R(sy(f === 'sin' ? Math.sin(rad(x)) : Math.cos(rad(x))));
      b += `<path class="${i ? 'cv dsh' : 'cv'}" d="${d}"/>`;
    });
    (o.marks || []).forEach(([x, y, t]) => { b += `<circle class="rt" cx="${R(sx(x))}" cy="${R(sy(y))}" r="4.5"/>` + tx([sx(x), sy(y) + (y > 0 ? -12 : 14)], t); });
    if (o.keys) b += tx([160, 186], o.keys.join('   ·   '), 'at');
    return svg(300, o.keys ? 198 : 176, o.label, b);
  };

  /* histogram: bars that touch, edges are the class boundaries */
  kit.hist = o => {
    const x0 = o.edges[0], x1 = o.edges[o.edges.length - 1], mx = Math.max(...o.f), top = Math.ceil(mx / 2) * 2;
    const sx = x => 46 + (x - x0) / (x1 - x0) * 234, sy = y => 146 - y / top * 120;
    let b = '';
    for (let v = 0; v <= top; v += 2) b += ln([46, sy(v)], [280, sy(v)], v ? 'gr' : 'ax') + `<text class="tk" x="40" y="${R(sy(v))}" text-anchor="end" dy=".35em">${v}</text>`;
    o.f.forEach((f, i) => { b += `<rect class="br hb" x="${R(sx(o.edges[i]))}" y="${R(sy(f))}" width="${R(sx(o.edges[i + 1]) - sx(o.edges[i]))}" height="${R(sy(0) - sy(f))}"/>`; });
    o.edges.forEach(e => { b += tx([sx(e), 159], e, 'tk'); });
    b += tx([163, 176], o.xl, 'at') + `<text class="at" transform="rotate(-90 14 86)" x="14" y="86" text-anchor="middle" dy=".35em">${o.yl || 'Frequency'}</text>`;
    return svg(300, 186, o.label, b);
  };

  /* ogive (cumulative frequency curve). ub: upper class boundaries, cf: cumulative frequencies. read: a cumulative frequency to read across */
  kit.ogive = o => {
    const x0 = o.x0, x1 = o.ub[o.ub.length - 1], top = o.top || o.cf[o.cf.length - 1];
    const sx = x => 46 + (x - x0) / (x1 - x0) * 234, sy = y => 146 - y / top * 124;
    let b = '';
    for (let v = 0; v <= top; v += o.step || 10) b += ln([46, sy(v)], [280, sy(v)], v ? 'gr' : 'ax') + `<text class="tk" x="40" y="${R(sy(v))}" text-anchor="end" dy=".35em">${v}</text>`;
    [x0, ...o.ub].forEach(x => { b += tx([sx(x), 159], x, 'tk'); });
    const pts = [[x0, 0], ...o.ub.map((x, i) => [x, o.cf[i]])];
    let d = ''; pts.forEach((p, i) => { d += (i ? 'L' : 'M') + R(sx(p[0])) + ' ' + R(sy(p[1])); });
    b += `<path class="cv" d="${d}"/>` + pts.map(p => `<circle class="pt" cx="${R(sx(p[0]))}" cy="${R(sy(p[1]))}" r="3"/>`).join('');
    if (o.read != null) {
      let xr = x0; for (let i = 1; i < pts.length; i++) if (pts[i][1] >= o.read) { const [a, c] = [pts[i - 1], pts[i]]; xr = a[0] + (o.read - a[1]) / (c[1] - a[1]) * (c[0] - a[0]); break; }
      b += `<path class="lc" d="M46 ${R(sy(o.read))}H${R(sx(xr))}V${R(sy(0))}"/>`;
    }
    b += tx([163, 176], o.xl, 'at') + `<text class="at" transform="rotate(-90 14 86)" x="14" y="86" text-anchor="middle" dy=".35em">Cumulative frequency</text>`;
    return svg(300, 186, o.label, b);
  };

  /* people seated round a table */
  kit.round = o => {
    const C = [150, 96], r = 58; let b = `<circle class="sf" cx="${C[0]}" cy="${C[1]}" r="${r - 20}"/>`;
    for (let k = 0; k < o.n; k++) { const p = at(C, r + 6, 90 - k * 360 / o.n); b += `<circle class="${k === 0 && o.fix ? 'rt' : 'seat'}" cx="${R(p[0])}" cy="${R(p[1])}" r="13"/>` + tx(p, o.names ? o.names[k] : String.fromCharCode(65 + k), 'pl'); }
    return svg(300, 192, o.label, b + (o.fix ? tx([150, 186], o.fix, 'tk') : ''));
  };

  /* picture of row-by-column multiplication */
  kit.mxmul = () => {
    const m = (rows, hl) => `<span class="mx">${rows.map((r, i) => `<span class="mr">${r.map((v, j) => `<span${hl(i, j) ? ' class="hl"' : ''}>${v}</span>`).join('')}</span>`).join('')}</span>`;
    return `<div class="mm" role="img" aria-label="The matrix with rows 1 2 and 3 4, times the matrix with rows 5 6 and 7 8, equals the matrix with rows 19 22 and 43 50. The first row and the first column are highlighted">${m([[1, 2], [3, 4]], i => i === 0)}<span>×</span>${m([[5, 6], [7, 8]], (i, j) => j === 0)}<span>=</span>${m([[19, 22], [43, 50]], (i, j) => i === 0 && j === 0)}</div>`;
  };

  return kit;
})();

(() => {
  const R = n => Math.round(n * 10) / 10, rad = d => d * Math.PI / 180;
  const svg = (w, h, label, body) => `<svg class="dg cg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">${body}</svg>`;
  const ln = (a, b, c = 'ln') => `<line class="${c}" x1="${R(a[0])}" y1="${R(a[1])}" x2="${R(b[0])}" y2="${R(b[1])}"/>`;
  const tx = (p, t, c = 'vl', anchor = 'middle') => `<text class="${c}" x="${R(p[0])}" y="${R(p[1])}" text-anchor="${anchor}" dy=".35em">${t}</text>`;
  const at = (c, r, deg) => [c[0] + r * Math.cos(rad(deg)), c[1] - r * Math.sin(rad(deg))];
  const circ = (c, r, cls = 'ln') => `<circle class="${cls}" cx="${R(c[0])}" cy="${R(c[1])}" r="${R(r)}"/>`;
  const path = (d, cls = 'ln') => `<path class="${cls}" d="${d}"/>`;
  /* labels with a leader line, placed outside the drawing */
  const tag = (p, q, t, anchor = 'start') => ln(p, q, 'ld') + tx([q[0] + (anchor === 'start' ? 4 : anchor === 'end' ? -4 : 0), q[1]], t, 'cl', anchor);

  /* Bohr model: shells [2, 8, 1], symbol, optional p and n in the nucleus */
  D.atom = o => {
    const C = [150, 104], sh = o.shells, r0 = 30, gap = sh.length > 3 ? 18 : 22;
    let b = circ(C, 22, 'nu') + tx([C[0], C[1] - (o.p != null ? 7 : 0)], o.sym, 'cs');
    if (o.p != null) b += tx([C[0], C[1] + 9], `${o.p}p ${o.n}n`, 'cn');
    sh.forEach((n, i) => {
      const r = r0 + i * gap; b += circ(C, r, 'shl');
      let grp = '';
      for (let k = 0; k < n; k++) {
        /* electrons in pairs round the shell, the way they are drawn in class */
        const slots = n <= 2 ? [90, 270] : [90, 0, 270, 180], pair = Math.floor(k / slots.length), base = slots[k % slots.length];
        const a = base + (n <= 2 ? 0 : (pair ? 9 : -9) * (n > 4 ? 1 : 0));
        const p = at(C, r, n > 8 ? 90 + k * 360 / n : a);
        grp += `<circle class="el" cx="${R(p[0])}" cy="${R(p[1])}" r="4"/>`;
      }
      b += `<g class="shl-orb">${grp}<animateTransform attributeName="transform" type="rotate" from="0 ${C[0]} ${C[1]}" to="${i % 2 ? -360 : 360} ${C[0]} ${C[1]}" dur="${18 + i * 6}s" repeatCount="indefinite"/></g>`;
    });
    if (o.cap) b += tx([C[0], 204], o.cap, 'tk');
    return svg(300, 212, o.label || `Atom of ${o.sym} with electrons ${sh.join(', ')}`, b);
  };

  /* dot-and-cross. Covalent: centre symbol, outer atoms with bond orders, lone pairs on the centre.
     o = { c: 'O', out: [['H', 1], ['H', 1]], lone: 2 }  Ionic: o = { ion: [['Na', '+', 8], ['Cl', '−', 8]] } */
  D.dotx = o => {
    if (o.ion) {
      let b = ''; o.ion.forEach(([s, ch, n], i) => {
        const C = [80 + i * 140, 98], r = 38; b += circ(C, r, 'shl') + tx(C, s, 'cs');
        for (let k = 0; k < n; k++) { const p = at(C, r, 45 + Math.floor(k / 2) * 90 + (k % 2 ? 11 : -11)); b += k >= n - (o.moved && i === 1 ? o.moved : 0) ? `<g class="ex"><path d="M${R(p[0] - 4)} ${R(p[1] - 4)}l8 8M${R(p[0] + 4)} ${R(p[1] - 4)}l-8 8"/></g>` : `<circle class="el" cx="${R(p[0])}" cy="${R(p[1])}" r="4"/>`; }
        b += `<path class="ln" d="M${C[0] - r - 14} ${C[1] - r - 6}v${2 * r + 12}M${C[0] + r + 14} ${C[1] - r - 6}v${2 * r + 12}"/>` + tx([C[0] + r + 26, C[1] - r - 2], ch, 'cs');
      });
      return svg(300, 196, o.label, b);
    }
    const C = [150, 100], r = 34, d = 52, out = o.out, n = out.length;
    const dirs = { 1: [0], 2: o.lin ? [0, 180] : [200, 340], 3: [90, 210, 330], 4: [45, 135, 225, 315] }[n];
    let b = circ(C, r, 'shl') + tx(C, o.c, 'cs');
    out.forEach(([s, ord], i) => {
      const a = dirs[i], A = at(C, d * 1.25, a); b += circ(A, r - 6, 'shl') + tx(A, s, 'cs');
      const m = at(C, d * 0.62, a);   // where the two shells overlap
      for (let k = 0; k < ord; k++) {
        const off = (k - (ord - 1) / 2) * 13, nrm = [Math.cos(rad(a + 90)) * off, -Math.sin(rad(a + 90)) * off];
        const p1 = at([m[0] + nrm[0], m[1] + nrm[1]], 4.5, a + 180), p2 = at([m[0] + nrm[0], m[1] + nrm[1]], 4.5, a);
        b += `<circle class="el" cx="${R(p1[0])}" cy="${R(p1[1])}" r="3.6"/><g class="ex"><path d="M${R(p2[0] - 3.5)} ${R(p2[1] - 3.5)}l7 7M${R(p2[0] + 3.5)} ${R(p2[1] - 3.5)}l-7 7"/></g>`;
      }
      if (o.olone && o.olone[i]) for (let k = 0; k < o.olone[i]; k++) { const la = a + [-55, 0, 55][k] , p = at(A, r - 6, la); [-1, 1].forEach(sg => { const q = at(p, 4, la + 90 * sg); b += `<circle class="el" cx="${R(q[0])}" cy="${R(q[1])}" r="3.2"/>`; }); }
    });
    /* lone pairs on the centre go in the gaps between bonds */
    const free = [90, 270, 0, 180, 45, 135, 225, 315].filter(a => dirs.every(x => Math.abs(((a - x + 540) % 360) - 180) > 40));
    for (let k = 0; k < (o.lone || 0); k++) { const a = free[k], p = at(C, r, a); [-1, 1].forEach(sg => { const q = at(p, 4.5, a + 90 * sg); b += `<circle class="el" cx="${R(q[0])}" cy="${R(q[1])}" r="3.6"/>`; }); }
    if (o.cap) b += tx([150, 196], o.cap, 'tk');
    return svg(300, 204, o.label, b);
  };

  /* energy profile. o = { type: 'exo'|'endo', cat: true, r: 'reactants', p: 'products' } */
  D.eprof = o => {
    const exo = o.type !== 'endo', X0 = 44, X1 = 292, yR = exo ? 118 : 150, yP = exo ? 154 : 104, top = 40;
    let b = ln([X0, 18], [X0, 176], 'ax') + ln([X0, 176], [X1, 176], 'ax');
    b += `<text class="at" transform="rotate(-90 18 98)" x="18" y="98" text-anchor="middle" dy=".35em">Energy</text>` + tx([168, 192], 'Progress of reaction', 'at');
    const pathFor = h => `M${X0 + 6} ${yR} H96 C128 ${yR} 132 ${h} 160 ${h} C188 ${h} 192 ${yP} 224 ${yP} H${X1 - 4}`;
    const dMain = pathFor(top), dCat = pathFor(top + 42);
    b += path(dMain, 'cv'); if (o.cat) b += path(dCat, 'cv ds2');
    b += `<circle class="rxn-dot" r="4"><animateMotion dur="3.4s" repeatCount="indefinite" path="${dMain}"/></circle>`;
    if (o.cat) b += `<circle class="rxn-dot cat" r="3.6"><animateMotion dur="2.2s" repeatCount="indefinite" path="${dCat}"/></circle>`;
    b += tx([72, yR + 12], o.r || 'reactants', 'tk') + tx([254, yP + (exo ? 12 : -12)], o.p || 'products', 'tk');
    /* Ea: from the reactants up to the peak. ΔH: from the reactants level to the products level */
    b += ln([96, yR], [160, yR], 'ld') + path(`M160 ${yR}V${top + 3}`, 'arr') + tx([154, (yR + top) / 2 + (o.cat ? -14 : 0)], 'E<tspan baseline-shift="sub" font-size="9">a</tspan>', 'cl', 'end');
    b += ln([200, yR], [284, yR], 'ld') + path(`M276 ${yR}V${yP}`, 'arr') + tx([270, (yR + yP) / 2], `ΔH ${exo ? 'negative' : 'positive'}`, 'cl', 'end');
    if (o.cat) b += tag([178, top + 50], [200, top + 18], 'with a catalyst');
    return svg(300, 202, o.label || `${exo ? 'Exothermic' : 'Endothermic'} energy profile`, b);
  };

  /* line graph with named curves. o = { xl, yl, xmax, ymax, curves: [{ pts: [[x, y]...], name, dash }], xt: [..], yt: [..], read: [x, y] } */
  D.cplot = o => {
    const X0 = 50, Y0 = 166, W = 226, H = 140, sx = x => X0 + x / o.xmax * W, sy = y => Y0 - y / o.ymax * H;
    let b = ln([X0, Y0 - H - 6], [X0, Y0], 'ax') + ln([X0, Y0], [X0 + W + 6, Y0], 'ax');
    (o.xt || []).forEach(x => { b += tx([sx(x), Y0 + 11], x, 'tk'); }); (o.yt || []).forEach(y => { b += tx([X0 - 13, sy(y)], y, 'tk') + ln([X0, sy(y)], [X0 + W, sy(y)], 'gr'); });
    o.curves.forEach(c => {
      const P = c.pts.map(p => [sx(p[0]), sy(p[1])]);
      let d = `M${R(P[0][0])} ${R(P[0][1])}`;
      for (let i = 0; i < P.length - 1; i++) { const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2; d += ` C${R(p1[0] + (p2[0] - p0[0]) / 6)} ${R(p1[1] + (p2[1] - p0[1]) / 6)} ${R(p2[0] - (p3[0] - p1[0]) / 6)} ${R(p2[1] - (p3[1] - p1[1]) / 6)} ${R(p2[0])} ${R(p2[1])}`; }
      b += path(d, c.dash ? 'cv ds2' : c.alt ? 'cv2' : 'cv');
      if (c.name) { const L = P[c.at != null ? c.at : P.length - 1]; b += tx([Math.min(L[0], X0 + W - 10), L[1] - 10], c.name, 'cl', 'end'); }
    });
    if (o.read) b += path(`M${X0} ${R(sy(o.read[1]))}H${R(sx(o.read[0]))}V${Y0}`, 'lc');
    b += tx([X0 + W / 2, Y0 + 26], o.xl, 'at') + `<text class="at" transform="rotate(-90 16 ${Y0 - H / 2})" x="16" y="${Y0 - H / 2}" text-anchor="middle" dy=".35em">${o.yl}</text>`;
    return svg(300, 200, o.label, b);
  };

  /* particles in solids, liquids and gases */
  D.states = _o => {
    const box = (x, kind) => {
      let b = `<rect class="ln" x="${x}" y="40" width="80" height="80" rx="4"/>`;
      if (kind === 's') for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) b += circ([x + 13 + i * 18, 55 + j * 18], 7.5, (i + j) % 2 ? 'pa pa-s1' : 'pa pa-s2');
      if (kind === 'l') [[14, 104], [31, 106], [48, 103], [65, 105], [20, 88], [38, 89], [56, 87], [70, 74], [12, 71], [29, 72], [47, 72]].forEach((p, idx) => { b += circ([x + p[0], p[1]], 7.5, idx % 2 ? 'pa pa-l1' : 'pa pa-l2'); });
      if (kind === 'g') [[16, 54], [58, 62], [34, 92], [66, 104], [22, 112]].forEach((p, idx) => { b += circ([x + p[0], p[1]], 7.5, `pa pa-g${(idx % 3) + 1}`); });
      return b + tx([x + 40, 136], { s: 'Solid', l: 'Liquid', g: 'Gas' }[kind], 'cl');
    };
    return svg(300, 150, 'Particles in a solid: packed in rows and vibrating in place. In a liquid: close together and sliding past one another. In a gas: far apart and darting rapidly', box(14, 's') + box(110, 'l') + box(206, 'g'));
  };

  /* structural formula from a text grid: letters are atoms, - | = # are bonds. rows of equal length */
  D.struct = o => {
    const rows = o.rows, cw = 22, ch = 22, w = rows[0].length * cw, h = rows.length * ch, ox = (300 - w) / 2 + cw / 2, oy = 14 + ch / 2;
    let b = '';
    rows.forEach((row, j) => [...row].forEach((c, i) => {
      const x = ox + i * cw, y = oy + j * ch;
      if (c === '-') b += ln([x - 8, y], [x + 8, y], 'bd');
      else if (c === '=') b += ln([x - 8, y - 3], [x + 8, y - 3], 'bd') + ln([x - 8, y + 3], [x + 8, y + 3], 'bd');
      else if (c === '#') b += [-4, 0, 4].map(d => ln([x - 8, y + d], [x + 8, y + d], 'bd')).join('');
      else if (c === '|') b += ln([x, y - 8], [x, y + 8], 'bd');
      else if (c === '"') b += ln([x - 3, y - 8], [x - 3, y + 8], 'bd') + ln([x + 3, y - 8], [x + 3, y + 8], 'bd');
      else if (c !== ' ') b += tx([x, y], c, 'ca');
    }));
    if (o.name) b += tx([150, oy + h + 4], o.name, 'tk');
    return svg(300, h + 40, o.label || o.name, b);
  };

  /* a small periodic table, first 20 elements. hl: symbols to highlight, grp: a group number to highlight */
  D.ptab = o => {
    const E = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'];
    const col = z => z === 1 ? 0 : z === 2 ? 7 : z <= 10 ? [0, 1, 2, 3, 4, 5, 6, 7][z - 3] : z <= 18 ? z - 11 : z - 19;
    const row = z => z <= 2 ? 0 : z <= 10 ? 1 : z <= 18 ? 2 : 3, cw = 33, chh = 30, ox = 18, oy = 26;
    let b = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', '0'].map((g, i) => tx([ox + i * cw + cw / 2, 12], g, 'tk')).join('');
    E.forEach((s, k) => {
      const z = k + 1, x = ox + col(z) * cw, y = oy + row(z) * chh, g = col(z) + 1, on = (o.hl || []).includes(s) || o.grp === g || (o.per && o.per === row(z) + 1);
      b += `<rect class="${on ? 'pc on' : 'pc'}" x="${x + 1}" y="${y + 1}" width="${cw - 2}" height="${chh - 2}" rx="4"/>` + tx([x + cw / 2, y + 11], s, on ? 'ps on' : 'ps') + tx([x + cw / 2, y + 23], z, 'pz');
    });
    return svg(300, oy + 4 * chh + 6, o.label || 'The first 20 elements of the periodic table', b);
  };

  /* apparatus */
  const flame = (x, y) => `<path class="fl" d="M${x} ${y}c-7-9 -2-15 0-22c2 7 7 13 0 22z"/><rect class="ln" x="${x - 6}" y="${y}" width="12" height="16" rx="2"/>`;
  const beaker = (x, y, w, h, lq) => `${lq ? `<rect class="lq" x="${x + 2}" y="${y + h - lq}" width="${w - 4}" height="${lq - 2}"/>` : ''}${path(`M${x - 3} ${y}h3v${h - 4}q0 4 4 4h${w - 8}q4 0 4-4v-${h - 4}`, 'gl')}`;
  const flask = (x, y, lq) => `${lq ? path(`M${x - 22} ${y + 46}h44l6 8a4 4 0 0 1-4 6h-48a4 4 0 0 1-4-6z`, 'lq') : ''}${path(`M${x - 6} ${y}v20l-24 34a4 4 0 0 0 4 6h52a4 4 0 0 0 4-6l-24-34v-20`, 'gl')}`;
  D.app = o => {
    const k = o.kind; let b = '';
    if (k === 'filter') {
      b += path('M110 30h80l-34 46v26h-12v-26z', 'gl') + path('M118 36h64l-28 38h-8z', 'fp') + beaker(118, 120, 64, 56, 22) + path('M150 104v40', 'dr');
      b += tag([176, 40], [214, 40], 'filter paper') + tag([170, 56], [214, 62], 'residue') + tag([180, 166], [214, 156], 'filtrate') + tag([156, 96], [214, 96], 'funnel');
      b += path('M150 42c-8 4-14 8-18 0', 'rs');
    }
    if (k === 'distil') {
      /* flask, still head with thermometer, Liebig condenser sloping down to the receiver */
      const A = [76, 53.5], B = [230.5, 115.5], d = [B[0] - A[0], B[1] - A[1]], L = Math.hypot(d[0], d[1]), u = [d[0] / L, d[1] / L], nrm = [-u[1], u[0]];
      const P = t => [A[0] + d[0] * t, A[1] + d[1] * t], off = (p, k) => [p[0] + nrm[0] * k, p[1] + nrm[1] * k], S = P(0.22), E = P(0.82);
      const j = [off(S, -11), off(E, -11), off(E, 11), off(S, 11)];
      b += `<polygon class="lq" points="${j.map(p => R(p[0]) + ',' + R(p[1])).join(' ')}"/>` + ln(j[0], j[1], 'gl') + ln(j[3], j[2], 'gl') + ln(j[0], j[3], 'gl') + ln(j[1], j[2], 'gl');
      b += ln(off(A, -3.5), off(B, -3.5), 'gl') + ln(off(A, 3.5), off(B, 3.5), 'gl');
      const wi = off(E, 11), wo = off(S, -11);
      b += path(`M${R(wi[0])} ${R(wi[1])}v14`, 'wt') + path(`M${R(wo[0])} ${R(wo[1])}v-14`, 'wt');
      b += flask(70, 70, true) + path('M64 70V44M76 70V44', 'gl') + `<rect class="ln" x="61" y="38" width="18" height="7" rx="1"/>` + `<rect class="gl" x="67.5" y="14" width="5" height="46" rx="2.5"/>` + circ([70, 61], 3.5, 'pt');
      b += flame(70, 158) + beaker(214, 128, 52, 44, 16) + ln(B, [234, 136], 'gl');
      b += `<circle class="cl-bub b1" cx="64" cy="123" r="2.2"/><circle class="cl-bub b2" cx="71" cy="126" r="1.8"/><circle class="cl-bub b3" cx="76" cy="121" r="2.1"/>`;
      b += `<circle class="lq-drop" cx="234" cy="136" r="2.3"><animate attributeName="cy" values="136;155" dur="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.95;0.9;0" dur="1.2s" repeatCount="indefinite"/></circle>`;
      b += tag([73, 20], [96, 14], 'thermometer') + tag([wo[0], wo[1] - 14], [wo[0] + 10, wo[1] - 22], 'water out') + tag([wi[0], wi[1] + 14], [wi[0] - 10, wi[1] + 26], 'water in', 'end');
      const mid = off(P(0.52), -11);
      b += tag(mid, [mid[0] + 22, mid[1] - 22], 'condenser') + tag([50, 118], [6, 150], 'mixture') + ln([246, 162], [252, 182], 'ld') + tx([252, 191], 'distillate', 'cl');
      return svg(300, 200, o.label || 'Simple distillation: the mixture is heated, the vapour is cooled in a water-cooled condenser and the pure liquid drips into a beaker', b);
    }
    if (k === 'chrom') {
      const spots = o.spots || [[0, [0.3, 0.7]], [1, [0.3]], [2, [0.7]], [3, [0.5]]], names = o.names || ['mix', 'A', 'B', 'C'];
      b += `<rect class="fp" x="70" y="18" width="160" height="160"/>` + path('M70 150h160', 'ds') + path('M70 34h160', 'ds');
      b += `<rect class="lq" x="60" y="164" width="180" height="22"/>` + path('M56 186h188M56 186V10M244 186V10', 'gl');
      spots.forEach(([i, fs]) => { const x = 94 + i * 38; b += tx([x, 158], '·', 'tk'); fs.forEach(f => { const m = spots.find(([j, g]) => j > 0 && g.length === 1 && g[0] === f), cls = m ? m[0] : i; b += `<ellipse class="spot s${cls}" cx="${x}" cy="${R(150 - f * 116)}" rx="7" ry="5"/>`; }); b += tx([x, 196], names[i], 'cl'); });
      b += tag([230, 150], [252, 150], 'start line') + tag([230, 34], [252, 34], 'solvent front') + tag([236, 172], [252, 176], 'solvent');
      return svg(330, 206, o.label || 'Paper chromatogram', b);
    }
    if (k === 'titr') {
      b += `<rect class="gl" x="141" y="10" width="18" height="118" rx="2"/><rect class="lq" x="143" y="30" width="14" height="96"/>`;
      for (let i = 0; i < 9; i++) b += ln([141, 34 + i * 10], [148, 34 + i * 10], 'ld');
      b += path('M146 128v12h8v-12M150 140v10', 'gl') + path('M136 132h28', 'ln') + flask(150, 150, true) + `<rect class="ln" x="96" y="212" width="108" height="6"/>` + path('M70 8V224M52 226h48', 'ln') + path('M70 54h71M136 48v12h10V48', 'ln');
      b += `<circle class="lq-drop" cx="150" cy="151" r="2.4"><animate attributeName="cy" values="151;194" dur="1.15s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.95;0.9;0" dur="1.15s" repeatCount="indefinite"/></circle>`;
      b += tag([159, 40], [190, 36], 'burette (acid)') + tag([164, 132], [190, 128], 'tap') + tag([176, 196], [204, 182], 'conical flask:') + tx([208, 196], 'alkali + indicator', 'cl', 'start') + tag([120, 214], [100, 236], 'white tile', 'end');
      return svg(300, 244, o.label || 'Titration: a burette over a conical flask on a white tile', b);
    }
    if (k === 'elec') {
      b += beaker(80, 80, 140, 92, 70) + `<rect class="ed" x="104" y="56" width="12" height="94"/><rect class="ed" x="184" y="56" width="12" height="94"/>`;
      b += `<circle class="cl-bub b1" cx="119" cy="140" r="2"/><circle class="cl-bub b2" cx="101" cy="132" r="1.8"/><circle class="cl-bub b3" cx="181" cy="138" r="2.1"/><circle class="cl-bub b1" cx="199" cy="130" r="1.8"/>`;
      b += path('M110 56V26h30M190 56V26h-30', 'ln') + `<path class="ln" d="M140 16v20M148 20v12"/>`;
      b += tx([110, 162], '−', 'cs') + tx([190, 162], '+', 'cs');
      b += tag([104, 100], [74, 70], 'cathode (−)', 'end') + tag([196, 100], [228, 70], 'anode (+)') + tag([150, 18], [176, 10], 'battery') + tag([200, 150], [228, 158], o.el || 'electrolyte');
      if (o.ions) b += tx([150, 132], o.ions, 'cl');
    }
    if (k === 'gas') {
      const m = o.m || 'water';
      b += flask(64, 60, true) + path('M58 60h12', 'ln') + path('M64 60V40h86', 'gl');
      if (m === 'water') { b = b.replace(path('M64 60V40h86', 'gl'), path('M64 60V40h100v118h28', 'gl')); b += beaker(156, 104, 112, 66, 48) + `<rect class="gl" x="190" y="76" width="26" height="84" rx="3"/><rect class="lq" x="192" y="118" width="22" height="40"/><circle class="cl-bub b1" cx="199" cy="146" r="2.1"/><circle class="cl-bub b2" cx="206" cy="136" r="1.8"/><circle class="cl-bub b3" cx="202" cy="126" r="2"/>` + tag([216, 92], [232, 70], 'gas') + tag([262, 150], [282, 96], 'water', 'middle') + tx([150, 192], 'over water: for gases that do not dissolve much', 'tk'); }
      if (m === 'up') { b = b.replace(path('M64 60V40h86', 'gl'), path('M64 60V40h86v136h56v-112', 'gl')); b += path('M190 156V38q0-4 4-4h24q4 0 4 4v118', 'gl') + tag([190, 64], [176, 24], 'jar, mouth down', 'end') + tx([150, 192], 'upward delivery: for gases lighter than air', 'tk'); }
      if (m === 'down') { b = b.replace(path('M64 60V40h86', 'gl'), path('M64 60V40h86v-14h56v130', 'gl')); b += path('M190 44v114q0 4 4 4h24q4 0 4-4V44', 'gl') + tag([190, 120], [176, 100], 'jar, mouth up', 'end') + tx([150, 192], 'downward delivery: for gases denser than air', 'tk'); }
      b += tx([64, 136], o.what || 'reactants', 'cl');
      return svg(300, 200, o.label || 'Collecting a gas', b);
    }
    if (k === 'sepf') {
      const cx = 104, X = n => R(cx + n);
      b += `<clipPath id="sfc"><path d="M${X(-8)} 38C${X(-30)} 48 ${X(-40)} 64 ${X(-38)} 82C${X(-36)} 104 ${X(-12)} 116 ${X(-4)} 128h8C${X(12)} 116 ${X(36)} 104 ${X(38)} 82C${X(40)} 64 ${X(30)} 48 ${X(8)} 38z"/></clipPath>`;
      b += `<g clip-path="url(#sfc)"><rect class="oil-lq" x="${X(-44)}" y="56" width="88" height="32"/><rect class="lq" x="${X(-44)}" y="88" width="88" height="42"/></g>`;
      b += path(`M${X(-8)} 24v14C${X(-30)} 48 ${X(-40)} 64 ${X(-38)} 82C${X(-36)} 104 ${X(-12)} 116 ${X(-4)} 128v26M${X(8)} 24v14C${X(30)} 48 ${X(40)} 64 ${X(38)} 82C${X(36)} 104 ${X(12)} 116 ${X(4)} 128v26`, 'gl');
      b += `<rect class="ln" x="${X(-11)}" y="14" width="22" height="10" rx="2"/><rect class="ln" x="${X(-13)}" y="133" width="26" height="7" rx="2"/>` + path(`M${X(13)} 136.5h10`, 'gl');
      b += beaker(X(-28), 160, 56, 34, 10);
      b += tag([X(11), 19], [X(62), 16], 'stopper') + tag([X(30), 70], [X(62), 62], 'oil: lighter, on top') + tag([X(30), 104], [X(62), 104], 'water: denser, below') + tag([X(23), 136.5], [X(62), 140], 'tap') + tag([X(26), 184], [X(62), 180], 'water run off first');
      return svg(300, 200, o.label || 'Separating funnel: oil floats on water, and the water is run off through the tap', b);
    }
    if (k === 'evap' || k === 'subl') {
      const cx = 130;
      b += path(`M${cx - 70} 132h140`, 'ln') + path(`M${cx - 62} 132l-10 60M${cx + 62} 132l10 60`, 'ln') + flame(cx, 164);
      if (k === 'evap') {
        b += `<path class="lq" d="M${cx - 44} 108q44 26 88 0z"/>` + path(`M${cx - 56} 96q56 62 112 0`, 'gl');
        [-22, 0, 22].forEach((d, idx) => { b += path(`M${cx + d} 84q-7 -9 0 -18q7 -9 0 -18`, `cl-steam st-${idx + 1}`); });
        b += tag([cx + 50, 104], [cx + 84, 104], 'evaporating basin') + tag([cx + 16, 114], [cx + 84, 124], 'salt solution') + tag([cx + 24, 60], [cx + 84, 56], 'water vapour leaves') + tag([cx + 8, 156], [cx + 84, 164], 'heat');
        return svg(340, 200, o.label || 'Evaporation: a salt solution is heated in an evaporating basin until the water has gone', b);
      }
      b += `<path class="lq" d="M${cx - 30} 116q30 18 60 0z"/>` + path(`M${cx - 56} 104q56 56 112 0`, 'gl');
      b += path(`M${cx - 46} 106L${cx - 9} 52V22h18v30L${cx + 46} 106`, 'gl') + `<rect class="fp" x="${cx - 8}" y="16" width="16" height="8" rx="3"/>`;
      [[-30, 86], [-22, 74], [-14, 62], [30, 86], [22, 74], [14, 62], [-6, 40], [6, 34]].forEach(p => { b += circ([cx + p[0], p[1]], 3, 'pa'); });
      b += tag([cx + 8, 20], [cx + 84, 16], 'cotton wool plug') + tag([cx + 24, 74], [cx + 84, 60], 'ammonium chloride') + tx([cx + 88, 73], 're-forms as a solid', 'tk', 'start') + tag([cx + 38, 98], [cx + 84, 100], 'inverted funnel') + tag([cx + 14, 122], [cx + 84, 122], 'mixture') + tag([cx + 8, 156], [cx + 84, 164], 'heat');
      return svg(340, 200, o.label || 'Sublimation: the mixture is heated under an inverted funnel. Ammonium chloride turns to vapour and re-forms as a solid on the cool funnel', b);
    }
    if (k === 'frac') {
      /* flask, fractionating column packed with glass beads, thermometer, condenser, receiver */
      const A = [78, 44], Bp = [226, 118], d = [Bp[0] - A[0], Bp[1] - A[1]], L = Math.hypot(d[0], d[1]), u = [d[0] / L, d[1] / L], nrm = [-u[1], u[0]];
      const P = t => [A[0] + d[0] * t, A[1] + d[1] * t], off = (p, q) => [p[0] + nrm[0] * q, p[1] + nrm[1] * q], S = P(0.24), E = P(0.84);
      const j = [off(S, -10), off(E, -10), off(E, 10), off(S, 10)];
      b += `<polygon class="lq" points="${j.map(p => R(p[0]) + ',' + R(p[1])).join(' ')}"/>` + ln(j[0], j[1], 'gl') + ln(j[3], j[2], 'gl') + ln(j[0], j[3], 'gl') + ln(j[1], j[2], 'gl');
      b += ln(off(A, -3.5), off(Bp, -3.5), 'gl') + ln(off(A, 3.5), off(Bp, 3.5), 'gl');
      b += flask(70, 138, true) + `<rect class="gl" x="61" y="34" width="18" height="106" rx="3"/>`;
      for (let r = 0; r < 9; r++) for (let c = 0; c < 2; c++) b += circ([66 + c * 8 + (r % 2 ? 0 : 0.01), 60 + r * 9], 3.2, 'ln');
      b += `<rect class="gl" x="67.5" y="8" width="5" height="40" rx="2.5"/>` + circ([70, 46], 3.2, 'pt') + `<rect class="ln" x="60" y="28" width="20" height="7" rx="1"/>`;
      b += flame(70, 226) + beaker(208, 132, 52, 44, 14) + ln(Bp, [230, 140], 'gl');
      b += `<circle class="cl-bub b1" cx="64" cy="191" r="2.1"/><circle class="cl-bub b2" cx="72" cy="194" r="1.8"/><circle class="cl-bub b3" cx="76" cy="189" r="2"/>`;
      b += `<circle class="lq-drop" cx="230" cy="140" r="2.3"><animate attributeName="cy" values="140;158" dur="1.25s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.95;0.9;0" dur="1.25s" repeatCount="indefinite"/></circle>`;
      const mid = off(P(0.54), -10);
      b += tag([73, 14], [98, 10], 'thermometer') + tag([79, 110], [112, 142], 'fractionating') + tx([116, 155], 'column', 'cl', 'start') + tx([116, 168], 'glass beads', 'tk', 'start') + tag(mid, [mid[0] + 20, mid[1] - 22], 'condenser') + tag([92, 190], [112, 206], 'ethanol + water') + tag([246, 168], [250, 190], 'ethanol first', 'middle');
      return svg(300, 250, o.label || 'Fractional distillation: a flask, a fractionating column packed with glass beads, a thermometer, a condenser and a receiver', b);
    }
    return svg(300, 200, o.label || 'Apparatus', b);
  };
})();

{ const st0 = D.struct; D.struct = o => st0(o).replace(/<text class="ca" x="([\d.]+)" y="([\d.]+)" text-anchor="middle" dy=".35em">([\\/])<\/text>/g, (m, x, y, c) => { x = +x; y = +y; const d = c === '/' ? [x + 7, y - 7, x - 7, y + 7] : [x - 7, y - 7, x + 7, y + 7]; return `<line class="bd" x1="${d[0]}" y1="${d[1]}" x2="${d[2]}" y2="${d[3]}"/>`; }); }

export { D };

export function renderDiagram(g?: DiagramSpec): string {
  if (!g) return "";
  const fn = (D as Record<string, (o: any) => string>)[g[0]];
  return fn ? fn(g[1]) : "";
}

export function figureHtml(g?: DiagramSpec, cap?: string): string {
  if (!g) return "";
  return `<figure class="fig">${renderDiagram(g)}${cap ? `<figcaption>${cap}</figcaption>` : ""}</figure>`;
}
