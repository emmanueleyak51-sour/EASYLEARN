import React from 'react';

function MathStageShell({
  title,
  caption,
  ariaLabel,
  children,
}: {
  title: string;
  caption: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="rounded-2xl bg-[#163226] border border-[#274F3E] overflow-hidden shadow-[0_3px_0_#0E2219]">
      <div className="px-4 py-2.5 bg-[#11281E] border-b border-[#254A3A] flex items-center justify-between gap-3">
        <span className="text-[12px] font-bold tracking-wide text-[#FFD84D] truncate">
          {title}
        </span>
        <span className="text-[11px] font-semibold text-[#9EC4B1] whitespace-nowrap shrink-0">
          Visual Study Plate
        </span>
      </div>
      <div className="p-3 sm:p-4 flex items-center justify-center bg-[#163226]">
        <svg
          viewBox="0 0 560 210"
          role="img"
          aria-label={ariaLabel}
          className="w-full max-w-[560px] h-auto block select-none"
        >
          <defs>
            <marker
              id="mnv-arr"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#FFD84D" />
            </marker>
            <marker
              id="mnv-arr-cyan"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#7DD3FC" />
            </marker>
            <marker
              id="mnv-arr-green"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#3BDC86" />
            </marker>
          </defs>
          {children}
        </svg>
      </div>
      <figcaption className="px-4 py-2.5 bg-[#12291F] border-t border-[#254A3A] text-[12.5px] leading-snug text-[#D6EBE0]">
        {caption}
      </figcaption>
    </figure>
  );
}

export function MathNoteVisual({
  topicId,
  partIdx = 0,
}: {
  topicId: string;
  partIdx?: number;
}) {
  void partIdx;

  // 1. Number Bases & Modular Clock Arithmetic
  if (topicId === 'bases' || topicId === 'm-mod') {
    if (topicId === 'm-mod') {
      const residues = [0, 1, 2, 3, 4];
      return (
        <MathStageShell
          title="Modulo 5 Residue Clock & Standard Form A × 10ⁿ"
          ariaLabel="Modulo 5 clock dial and standard form decimal shift diagram"
          caption="In mod n, every integer wraps onto residues {0, 1, ..., n − 1}. In standard form A × 10ⁿ, keep 1 ≤ A < 10."
        >
          <rect x="20" y="18" width="240" height="174" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
          <text x="140" y="38" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
            Modulo 5 Clock (Residues 0–4)
          </text>
          <circle cx="140" cy="114" r="54" fill="none" stroke="#7DD3FC" strokeWidth="2" />
          {residues.map((r) => {
            const ang = ((r * 72 - 90) * Math.PI) / 180;
            const x = 140 + 54 * Math.cos(ang);
            const y = 114 + 54 * Math.sin(ang);
            return (
              <g key={r}>
                <circle cx={x} cy={y} r="12" fill="#163226" stroke="#FFD84D" strokeWidth="1.8" />
                <text x={x} y={y + 4} textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">
                  {r}
                </text>
              </g>
            );
          })}
          <text x="140" y="184" textAnchor="middle" fill="#3BDC86" fontSize="10.5" fontWeight="700">
            −3 ≡ 2 (mod 5) · 17 ≡ 2 (mod 5)
          </text>

          <rect x="278" y="18" width="262" height="174" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
          <text x="409" y="38" textAnchor="middle" fill="#3BDC86" fontSize="12" fontWeight="800">
            Standard Form: A × 10ⁿ (1 ≤ A &lt; 10)
          </text>
          <rect x="298" y="56" width="222" height="52" rx="10" fill="#163226" stroke="#7DD3FC" />
          <text x="409" y="76" textAnchor="middle" fill="#7DD3FC" fontSize="11" fontWeight="700">
            0.000472 → move decimal 4 places right
          </text>
          <text x="409" y="96" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800">
            = 4.72 × 10⁻⁴ (3 s.f.)
          </text>
          <rect x="298" y="120" width="222" height="54" rx="10" fill="#163226" stroke="#FFD84D" />
          <text x="409" y="141" textAnchor="middle" fill="#FFD84D" fontSize="11" fontWeight="700">
            58,400 → move decimal 4 places left
          </text>
          <text x="409" y="162" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800">
            = 5.84 × 10⁴
          </text>
        </MathStageShell>
      );
    }

    return (
      <MathStageShell
        title="Place-Value Bridge: Base b → Base 10 → Target Base"
        ariaLabel="Place value powers in base 2 and repeated division to convert base 10"
        caption="Multiply digits by powers b², b¹, b⁰, b⁻¹ to reach base 10; divide repeatedly and read remainders from bottom to top for a new base."
      >
        {[
          { x: 24, d: '1', p: '2³ = 8', v: '8' },
          { x: 100, d: '0', p: '2² = 4', v: '0' },
          { x: 176, d: '1', p: '2¹ = 2', v: '2' },
          { x: 252, d: '1', p: '2⁰ = 1', v: '1' },
          { x: 338, d: '1', p: '2⁻¹ = ½', v: '0.5' },
        ].map((c, idx) => (
          <g key={idx}>
            <rect x={c.x} y="32" width="66" height="92" rx="10" fill="#1B3C2E" stroke="#7DD3FC" strokeWidth="1.8" />
            <text x={c.x + 33} y="62" textAnchor="middle" fill="#FFD84D" fontSize="20" fontWeight="800">
              {c.d}
            </text>
            <text x={c.x + 33} y="86" textAnchor="middle" fill="#9EC4B1" fontSize="10.5" fontWeight="700">
              {c.p}
            </text>
            <text x={c.x + 33} y="110" textAnchor="middle" fill="#3BDC86" fontSize="11.5" fontWeight="800">
              +{c.v}
            </text>
          </g>
        ))}
        <circle cx="328" cy="64" r="3.5" fill="#FFD84D" />
        <rect x="424" y="32" width="116" height="92" rx="10" fill="#11281E" stroke="#FFD84D" strokeWidth="2" />
        <text x="482" y="58" textAnchor="middle" fill="#9EC4B1" fontSize="10.5" fontWeight="700">
          1011.1₂ in Base 10
        </text>
        <text x="482" y="88" textAnchor="middle" fill="#FFD84D" fontSize="18" fontWeight="800">
          11.5₁₀
        </text>
        <text x="482" y="110" textAnchor="middle" fill="#3BDC86" fontSize="10" fontWeight="700">
          Digits &lt; base b always!
        </text>
        <rect x="24" y="142" width="516" height="46" rx="10" fill="#1B3C2E" stroke="#2E5C48" />
        <text x="282" y="170" textAnchor="middle" fill="#E8F5EE" fontSize="12" fontWeight="700">
          Base 10 → Base b: Divide repeatedly by b and read remainders ↑ UPWARDS (bottom to top)
        </text>
      </MathStageShell>
    );
  }

  // 2. Fractions/Percentages, Indices/Logs & Surds
  if (topicId === 'frac' || topicId === 'indices' || topicId === 'surds') {
    if (topicId === 'frac') {
      return (
        <MathStageShell
          title="Ratio Sharing, Percentage Change & Percentage Error"
          ariaLabel="Ratio bar model and percentage error denominator rule"
          caption="Always divide by the ORIGINAL or TRUE value when calculating percentage profit/loss or percentage error — never the new or measured value."
        >
          <rect x="24" y="24" width="246" height="162" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
          <text x="147" y="46" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
            Ratio 2 : 3 : 5 (Total = 10 parts)
          </text>
          <rect x="42" y="64" width="42" height="34" rx="6" fill="#7DD3FC" />
          <rect x="86" y="64" width="63" height="34" rx="6" fill="#FFD84D" />
          <rect x="151" y="64" width="103" height="34" rx="6" fill="#3BDC86" />
          <text x="63" y="85" textAnchor="middle" fill="#10261D" fontSize="11" fontWeight="800">2/10</text>
          <text x="117" y="85" textAnchor="middle" fill="#10261D" fontSize="11" fontWeight="800">3/10</text>
          <text x="202" y="85" textAnchor="middle" fill="#10261D" fontSize="11" fontWeight="800">5/10</text>
          <text x="147" y="128" textAnchor="middle" fill="#E8F5EE" fontSize="11.5" fontWeight="700">
            1 part = Total ÷ (2 + 3 + 5)
          </text>
          <text x="147" y="154" textAnchor="middle" fill="#9EC4B1" fontSize="11">
            BODMAS: Brackets → Of → ÷/× → +/−
          </text>

          <rect x="288" y="24" width="248" height="162" rx="12" fill="#1B3C2E" stroke="#FFD84D" strokeWidth="1.8" />
          <text x="412" y="48" textAnchor="middle" fill="#3BDC86" fontSize="12" fontWeight="800">
            Exact Error Formula
          </text>
          <text x="412" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="800">
            % Error = |Measured − Actual| ÷ Actual × 100%
          </text>
          <line x1="312" y1="108" x2="512" y2="108" stroke="#2E5C48" />
          <text x="412" y="134" textAnchor="middle" fill="#FFD84D" fontSize="11.5" fontWeight="700">
            Selling Price = Cost × (100 ± %Profit/Loss) ÷ 100
          </text>
          <text x="412" y="160" textAnchor="middle" fill="#FF8A73" fontSize="11" fontWeight="700">
            Trap: Denominator is ALWAYS Cost / Actual!
          </text>
        </MathStageShell>
      );
    }

    if (topicId === 'surds') {
      return (
        <MathStageShell
          title="Simplifying Surds & Conjugate Rationalisation"
          ariaLabel="Conjugate difference of two squares rationalising surd denominator"
          caption="Multiply top and bottom by the conjugate (a − b√c) so the denominator becomes a rational difference of two squares: a² − b²c."
        >
          <rect x="24" y="24" width="244" height="162" rx="12" fill="#1B3C2E" stroke="#7DD3FC" strokeWidth="1.8" />
          <text x="146" y="48" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="800">
            1. Extract Largest Perfect Square
          </text>
          <text x="146" y="86" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="800">
            √72 = √(36 × 2) = 6√2
          </text>
          <text x="146" y="118" textAnchor="middle" fill="#3BDC86" fontSize="12" fontWeight="700">
            Like surds combine: 6√2 − 2√2 = 4√2
          </text>
          <text x="146" y="152" textAnchor="middle" fill="#FF8A73" fontSize="11" fontWeight="700">
            Never write √(a + b) = √a + √b!
          </text>

          <rect x="286" y="24" width="250" height="162" rx="12" fill="#1B3C2E" stroke="#FFD84D" strokeWidth="1.8" />
          <text x="411" y="48" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
            2. Conjugate Pair: (a + √b)(a − √b)
          </text>
          <text x="411" y="86" textAnchor="middle" fill="#FFFFFF" fontSize="14.5" fontWeight="800">
            1 / (3 + √5) × (3 − √5) / (3 − √5)
          </text>
          <text x="411" y="120" textAnchor="middle" fill="#3BDC86" fontSize="14" fontWeight="800">
            = (3 − √5) / (9 − 5) = (3 − √5) / 4
          </text>
          <text x="411" y="154" textAnchor="middle" fill="#9EC4B1" fontSize="11">
            Middle surd terms +a√b and −a√b cancel cleanly
          </text>
        </MathStageShell>
      );
    }

    return (
      <MathStageShell
        title="The Index–Logarithm Bridge: aˣ = N  ⇔  logₐ N = x"
        ariaLabel="Index form to logarithm form equivalence and laws of indices and logs"
        caption="A logarithm is simply an exponent! The base a stays the base when you switch between aˣ = N and logₐ N = x."
      >
        <rect x="24" y="22" width="512" height="68" rx="12" fill="#11281E" stroke="#FFD84D" strokeWidth="2" />
        <text x="158" y="63" textAnchor="middle" fill="#FFD84D" fontSize="20" fontWeight="800">
          aˣ = N
        </text>
        <line x1="225" y1="56" x2="335" y2="56" stroke="#3BDC86" strokeWidth="2.4" markerStart="url(#mnv-arr-green)" markerEnd="url(#mnv-arr-green)" />
        <text x="280" y="44" textAnchor="middle" fill="#3BDC86" fontSize="10.5" fontWeight="800">
          SAME BASE a
        </text>
        <text x="412" y="63" textAnchor="middle" fill="#7DD3FC" fontSize="20" fontWeight="800">
          logₐ N = x
        </text>

        {[
          { x: 24, t: 'Product Law', eq: 'aᵐ × aⁿ = aᵐ⁺ⁿ', lg: 'log(XY) = log X + log Y' },
          { x: 198, t: 'Quotient Law', eq: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ', lg: 'log(X/Y) = log X − log Y' },
          { x: 372, t: 'Fractional & Zero', eq: 'a⁰ = 1 · a⁻ⁿ = 1/aⁿ', lg: 'a^(m/n) = (ⁿ√a)ᵐ' },
        ].map((item, idx) => (
          <g key={idx}>
            <rect x={item.x} y="104" width="164" height="84" rx="10" fill="#1B3C2E" stroke="#2E5C48" />
            <text x={item.x + 82} y="126" textAnchor="middle" fill="#FFD84D" fontSize="11" fontWeight="800">
              {item.t}
            </text>
            <text x={item.x + 82} y="150" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="700">
              {item.eq}
            </text>
            <text x={item.x + 82} y="172" textAnchor="middle" fill="#3BDC86" fontSize="11" fontWeight="700">
              {item.lg}
            </text>
          </g>
        ))}
      </MathStageShell>
    );
  }

  // 3. Sets & Logical Reasoning
  if (topicId === 'sets' || topicId === 'm-logic') {
    if (topicId === 'm-logic') {
      return (
        <MathStageShell
          title="Implication p ⇒ q, Contrapositive & Truth-Value Rules"
          ariaLabel="Logical connectives truth summary and contrapositive equivalence"
          caption="p ⇒ q is FALSE in only ONE case: when p is True and q is False. The contrapositive (~q ⇒ ~p) is always logically equivalent to p ⇒ q."
        >
          <rect x="22" y="20" width="268" height="170" rx="12" fill="#1B3C2E" stroke="#7DD3FC" strokeWidth="1.8" />
          <text x="156" y="42" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="800">
            4 Core Connective Signatures
          </text>
          <text x="40" y="72" fill="#FFFFFF" fontSize="12" fontWeight="700">p ∧ q (AND): True ONLY if T, T</text>
          <text x="40" y="98" fill="#3BDC86" fontSize="12" fontWeight="700">p ∨ q (OR): False ONLY if F, F</text>
          <text x="40" y="124" fill="#FFD84D" fontSize="12" fontWeight="800">p ⇒ q (IF…THEN): False ONLY if T ⇒ F</text>
          <text x="40" y="150" fill="#C4B5FD" fontSize="12" fontWeight="700">p ⇔ q (IFF): True when p and q match</text>
          <text x="40" y="174" fill="#9EC4B1" fontSize="10.5">De Morgan: ~(p ∧ q) ≡ ~p ∨ ~q</text>

          <rect x="306" y="20" width="232" height="170" rx="12" fill="#1B3C2E" stroke="#FFD84D" strokeWidth="1.8" />
          <text x="422" y="42" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
            Equivalent Pairs
          </text>
          <rect x="324" y="56" width="196" height="52" rx="8" fill="#163226" stroke="#3BDC86" />
          <text x="422" y="76" textAnchor="middle" fill="#3BDC86" fontSize="11.5" fontWeight="800">
            Original ≡ Contrapositive
          </text>
          <text x="422" y="96" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800">
            (p ⇒ q)  ≡  (~q ⇒ ~p)
          </text>
          <rect x="324" y="120" width="196" height="52" rx="8" fill="#163226" stroke="#FF8A73" />
          <text x="422" y="140" textAnchor="middle" fill="#FF8A73" fontSize="11.5" fontWeight="800">
            Converse ≡ Inverse (Not Original!)
          </text>
          <text x="422" y="160" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800">
            (q ⇒ p)  ≡  (~p ⇒ ~q)
          </text>
        </MathStageShell>
      );
    }

    return (
      <MathStageShell
        title="Two-Set & Three-Set Venn Regions: Always Fill Intersection First!"
        ariaLabel="Two-set Venn diagram showing A only, intersection, B only, and complement"
        caption="Always place x = n(A ∩ B) in the overlap first, then subtract x from n(A) and n(B) so the intersection is never double-counted."
      >
        <rect x="24" y="20" width="290" height="170" rx="12" fill="#1B3C2E" stroke="#9EC4B1" strokeWidth="1.6" />
        <text x="40" y="38" fill="#FFD84D" fontSize="11.5" fontWeight="800">ξ (Universal Set)</text>
        <circle cx="136" cy="108" r="54" fill="rgba(125,211,252,0.18)" stroke="#7DD3FC" strokeWidth="2.2" />
        <circle cx="202" cy="108" r="54" fill="rgba(59,220,134,0.18)" stroke="#3BDC86" strokeWidth="2.2" />
        <text x="98" y="72" fill="#7DD3FC" fontSize="12" fontWeight="800">A</text>
        <text x="240" y="72" fill="#3BDC86" fontSize="12" fontWeight="800">B</text>
        <text x="104" y="112" textAnchor="middle" fill="#FFFFFF" fontSize="11.5" fontWeight="800">a − x</text>
        <text x="169" y="112" textAnchor="middle" fill="#FFD84D" fontSize="13" fontWeight="800">x</text>
        <text x="234" y="112" textAnchor="middle" fill="#FFFFFF" fontSize="11.5" fontWeight="800">b − x</text>
        <text x="278" y="176" textAnchor="end" fill="#9EC4B1" fontSize="11" fontWeight="700">(A ∪ B)′</text>

        <rect x="330" y="20" width="208" height="170" rx="12" fill="#11281E" stroke="#2E5C48" />
        <text x="434" y="46" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
          Inclusion–Exclusion
        </text>
        <text x="434" y="78" textAnchor="middle" fill="#FFFFFF" fontSize="12.5" fontWeight="800">
          n(A ∪ B) = n(A) + n(B) − n(A ∩ B)
        </text>
        <text x="434" y="112" textAnchor="middle" fill="#3BDC86" fontSize="11.5" fontWeight="700">
          Subsets of k elements = 2ᵏ
        </text>
        <text x="434" y="138" textAnchor="middle" fill="#7DD3FC" fontSize="11.5" fontWeight="700">
          De Morgan: (A ∪ B)′ = A′ ∩ B′
        </text>
        <text x="434" y="164" textAnchor="middle" fill="#FF8A73" fontSize="11" fontWeight="700">
          A only = A ∩ B′ = n(A) − x
        </text>
      </MathStageShell>
    );
  }

  // 4. Quadratics, Simultaneous, Polynomials & Variation
  if (topicId === 'quad' || topicId === 'simul' || topicId === 'poly' || topicId === 'variation') {
    return (
      <MathStageShell
        title="Quadratic Parabola, Discriminant Δ = b² − 4ac & Root Relations"
        ariaLabel="Parabola showing roots alpha and beta, vertex, and discriminant cases"
        caption="For ax² + bx + c = 0: α + β = −b/a and αβ = c/a. Δ > 0 gives 2 distinct real roots, Δ = 0 gives equal roots, Δ < 0 gives no real roots."
      >
        <rect x="22" y="18" width="256" height="174" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
        <line x1="38" y1="126" x2="262" y2="126" stroke="#9EC4B1" strokeWidth="1.5" />
        <line x1="150" y1="30" x2="150" y2="180" stroke="#9EC4B1" strokeWidth="1.5" />
        <path d="M 64 42 Q 150 212 236 42" fill="none" stroke="#3BDC86" strokeWidth="3" />
        <circle cx="98" cy="126" r="5" fill="#FFD84D" />
        <circle cx="202" cy="126" r="5" fill="#FFD84D" />
        <circle cx="150" cy="164" r="4.5" fill="#FF8A73" />
        <text x="90" y="144" fill="#FFD84D" fontSize="11" fontWeight="800">α</text>
        <text x="206" y="144" fill="#FFD84D" fontSize="11" fontWeight="800">β</text>
        <text x="150" y="182" textAnchor="middle" fill="#FF8A73" fontSize="10.5" fontWeight="700">
          Vertex x = −b / (2a)
        </text>

        <rect x="294" y="18" width="244" height="174" rx="12" fill="#11281E" stroke="#FFD84D" strokeWidth="1.8" />
        <text x="416" y="42" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
          Key Algebraic Identities
        </text>
        <text x="416" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="12.5" fontWeight="800">
          x² − (α + β)x + αβ = 0
        </text>
        <text x="416" y="96" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="700">
          α + β = −b/a   ·   αβ = c/a
        </text>
        <text x="416" y="122" textAnchor="middle" fill="#3BDC86" fontSize="11.5" fontWeight="700">
          Remainder of P(x) ÷ (x − a) is P(a)
        </text>
        <text x="416" y="148" textAnchor="middle" fill="#C4B5FD" fontSize="11.5" fontWeight="700">
          Direct y = kx · Inverse y = k/x
        </text>
        <text x="416" y="174" textAnchor="middle" fill="#FF8A73" fontSize="11" fontWeight="700">
          Partial variation: y = a + bx (2 constants!)
        </text>
      </MathStageShell>
    );
  }

  // 5. Progressions, Commercial Finance, Matrices & Binary Operations
  if (topicId === 'prog' || topicId === 'm-fin' || topicId === 'matrix' || topicId === 'binop') {
    if (topicId === 'matrix' || topicId === 'binop') {
      return (
        <MathStageShell
          title="2×2 Matrix Determinant, Adjoint Inverse & Binary Identity"
          ariaLabel="2 by 2 matrix determinant ad minus bc and inverse swap and negate rule"
          caption="To invert a 2×2 matrix: swap the leading diagonal (a ↔ d), negate the other diagonal (−b, −c), and divide by det A = ad − bc ≠ 0."
        >
          <rect x="22" y="20" width="268" height="170" rx="12" fill="#1B3C2E" stroke="#7DD3FC" strokeWidth="1.8" />
          <text x="156" y="42" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="800">
            2×2 Inverse Rule (det A = ad − bc)
          </text>
          <text x="156" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="800">
            A = [ a   b ;  c   d ]
          </text>
          <text x="156" y="116" textAnchor="middle" fill="#3BDC86" fontSize="13.5" fontWeight="800">
            A⁻¹ = 1/(ad − bc) · [ d  −b ; −c   a ]
          </text>
          <text x="156" y="152" textAnchor="middle" fill="#FF8A73" fontSize="11" fontWeight="700">
            Singular matrix ⇔ ad − bc = 0 (no inverse)
          </text>

          <rect x="306" y="20" width="232" height="170" rx="12" fill="#11281E" stroke="#FFD84D" strokeWidth="1.8" />
          <text x="422" y="42" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
            Binary Operations (a * b)
          </text>
          <text x="422" y="76" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="700">
            Commutative: a * b = b * a
          </text>
          <text x="422" y="104" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="700">
            Identity e: a * e = e * a = a
          </text>
          <text x="422" y="132" textAnchor="middle" fill="#3BDC86" fontSize="12" fontWeight="800">
            Inverse a⁻¹: a * a⁻¹ = e
          </text>
          <text x="422" y="162" textAnchor="middle" fill="#9EC4B1" fontSize="10.5">
            Find identity e FIRST before solving for a⁻¹!
          </text>
        </MathStageShell>
      );
    }

    return (
      <MathStageShell
        title="Linear (AP +d) vs Exponential Growth (GP ×r & Compound Interest)"
        ariaLabel="Comparison of linear AP and Simple Interest against exponential GP and Compound Interest"
        caption="AP and Simple Interest add a constant step each period; GP and Compound Interest multiply by a constant ratio each period."
      >
        <rect x="22" y="20" width="250" height="170" rx="12" fill="#1B3C2E" stroke="#7DD3FC" strokeWidth="1.8" />
        <text x="147" y="42" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="800">
          Arithmetic (AP) &amp; Simple Interest
        </text>
        <text x="147" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800">
          Tₙ = a + (n − 1)d
        </text>
        <text x="147" y="102" textAnchor="middle" fill="#3BDC86" fontSize="12.5" fontWeight="700">
          Sₙ = n/2 · [2a + (n − 1)d]
        </text>
        <text x="147" y="134" textAnchor="middle" fill="#FFD84D" fontSize="12.5" fontWeight="800">
          I = PRT / 100  ·  A = P + I
        </text>
        <text x="147" y="164" textAnchor="middle" fill="#9EC4B1" fontSize="11">
          Constant difference d = T₂ − T₁
        </text>

        <rect x="288" y="20" width="250" height="170" rx="12" fill="#1B3C2E" stroke="#FFD84D" strokeWidth="1.8" />
        <text x="413" y="42" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
          Geometric (GP) &amp; Compound Growth
        </text>
        <text x="413" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800">
          Tₙ = arⁿ⁻¹  ·  S∞ = a / (1 − r)
        </text>
        <text x="413" y="102" textAnchor="middle" fill="#3BDC86" fontSize="12.5" fontWeight="700">
          Compound: A = P(1 + R/100)ⁿ
        </text>
        <text x="413" y="134" textAnchor="middle" fill="#FF8A73" fontSize="12.5" fontWeight="800">
          Depreciation: V = P(1 − R/100)ⁿ
        </text>
        <text x="413" y="164" textAnchor="middle" fill="#9EC4B1" fontSize="11">
          S∞ exists ONLY when |r| &lt; 1
        </text>
      </MathStageShell>
    );
  }

  // 6. Inequalities & Linear Programming Feasible Polygon
  if (topicId === 'ineq' || topicId === 'm-linprog') {
    return (
      <MathStageShell
        title="Inequality Boundary Lines & Linear Programming Corner-Point Theorem"
        ariaLabel="Feasible region polygon bounded by inequality lines with corner vertices"
        caption="Use dashed lines for strict (<, >) and solid lines for inclusive (≤, ≥). Maximum/minimum of Z = ax + by occurs at a vertex of the feasible polygon!"
      >
        <rect x="22" y="18" width="272" height="174" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
        <line x1="54" y1="166" x2="270" y2="166" stroke="#9EC4B1" strokeWidth="1.8" markerEnd="url(#mnv-arr)" />
        <line x1="54" y1="166" x2="54" y2="32" stroke="#9EC4B1" strokeWidth="1.8" markerEnd="url(#mnv-arr)" />
        <polygon points="54,166 54,74 138,94 196,166" fill="rgba(59,220,134,0.26)" stroke="#3BDC86" strokeWidth="2.4" />
        <circle cx="54" cy="74" r="4.5" fill="#FFD84D" />
        <circle cx="138" cy="94" r="5" fill="#FFD84D" />
        <circle cx="196" cy="166" r="4.5" fill="#FFD84D" />
        <text x="108" y="138" textAnchor="middle" fill="#FFFFFF" fontSize="11.5" fontWeight="800">
          Feasible R
        </text>
        <text x="174" y="88" fill="#FFD84D" fontSize="10.5" fontWeight="800">Optimal Vertex</text>

        <rect x="310" y="18" width="228" height="174" rx="12" fill="#11281E" stroke="#FFD84D" strokeWidth="1.8" />
        <text x="424" y="44" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
          3 Golden Inequality Rules
        </text>
        <text x="424" y="76" textAnchor="middle" fill="#FF8A73" fontSize="11.5" fontWeight="800">
          1. Multiply/divide by −ve ⇒ FLIP sign!
        </text>
        <text x="424" y="106" textAnchor="middle" fill="#7DD3FC" fontSize="11.5" fontWeight="700">
          2. Open ○ / dashed for &lt;, &gt;
        </text>
        <text x="424" y="132" textAnchor="middle" fill="#3BDC86" fontSize="11.5" fontWeight="700">
          3. Closed ● / solid for ≤, ≥
        </text>
        <text x="424" y="164" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700">
          Test (0, 0) to pick the true half-plane
        </text>
      </MathStageShell>
    );
  }

  // 7. Circle Theorems, Deductive Proofs/Polygons & Loci
  if (topicId === 'geom' || topicId === 'm-proof' || topicId === 'loci') {
    return (
      <MathStageShell
        title="Circle Theorems, Polygon Angles & Classical Compass Loci"
        ariaLabel="Circle theorem angle at centre is twice circumference and polygon angle rules"
        caption="Angle at the centre = 2× angle at circumference; opposite cyclic quad angles sum to 180°; exterior angles of ANY convex polygon sum to 360°."
      >
        <rect x="20" y="18" width="246" height="174" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
        <circle cx="143" cy="104" r="64" fill="none" stroke="#7DD3FC" strokeWidth="2.2" />
        <circle cx="143" cy="104" r="3.5" fill="#FFD84D" />
        <polyline points="92,143 143,40 194,143" fill="none" stroke="#3BDC86" strokeWidth="2.2" />
        <polyline points="92,143 143,104 194,143" fill="none" stroke="#FFD84D" strokeWidth="2.2" />
        <text x="143" y="64" textAnchor="middle" fill="#3BDC86" fontSize="11.5" fontWeight="800">θ</text>
        <text x="143" y="124" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">2θ</text>
        <text x="143" y="182" textAnchor="middle" fill="#E8F5EE" fontSize="10.5" fontWeight="700">
          Centre angle = 2 × Circumference angle
        </text>

        <rect x="282" y="18" width="258" height="174" rx="12" fill="#11281E" stroke="#FFD84D" strokeWidth="1.8" />
        <text x="411" y="42" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
          Polygons, Similarity &amp; Loci
        </text>
        <text x="411" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800">
          Interior sum = (n − 2) × 180°  ·  Ext = 360°/n
        </text>
        <text x="411" y="98" textAnchor="middle" fill="#3BDC86" fontSize="12" fontWeight="700">
          Similar ratio k ⇒ Area = k² · Vol = k³
        </text>
        <text x="411" y="128" textAnchor="middle" fill="#7DD3FC" fontSize="11.5" fontWeight="700">
          Equidistant from A, B → ⊥ bisector of AB
        </text>
        <text x="411" y="156" textAnchor="middle" fill="#C4B5FD" fontSize="11.5" fontWeight="700">
          Equidistant from AB, AC → ∠ bisector of A
        </text>
      </MathStageShell>
    );
  }

  // 8. Mensuration & Earth Longitude/Latitude
  if (topicId === 'mens' || topicId === 'm-earth') {
    if (topicId === 'm-earth') {
      return (
        <MathStageShell
          title="Earth Sphere: Great Circles (R = 6400 km) vs Parallel of Latitude (r = R cos α)"
          ariaLabel="Earth globe showing Equator radius R and parallel of latitude radius r equals R cos alpha"
          caption="Along any meridian or the Equator use R; along a parallel of latitude α° N/S, the circle shrinks to radius r = R cos α!"
        >
          <rect x="22" y="18" width="252" height="174" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
          <circle cx="148" cy="106" r="66" fill="none" stroke="#7DD3FC" strokeWidth="2.2" />
          <ellipse cx="148" cy="106" rx="66" ry="18" fill="none" stroke="#FFD84D" strokeWidth="2" />
          <ellipse cx="148" cy="70" rx="52" ry="13" fill="none" stroke="#3BDC86" strokeWidth="2" strokeDasharray="4 3" />
          <line x1="148" y1="40" x2="148" y2="172" stroke="#9EC4B1" strokeDasharray="3 3" />
          <line x1="148" y1="106" x2="214" y2="106" stroke="#FFD84D" strokeWidth="2" />
          <line x1="148" y1="70" x2="200" y2="70" stroke="#3BDC86" strokeWidth="2" />
          <text x="180" y="101" fill="#FFD84D" fontSize="11" fontWeight="800">R</text>
          <text x="174" y="65" fill="#3BDC86" fontSize="10.5" fontWeight="800">r = R cos α</text>

          <rect x="290" y="18" width="250" height="174" rx="12" fill="#11281E" stroke="#FFD84D" strokeWidth="1.8" />
          <text x="415" y="42" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
            Earth Distance Rules
          </text>
          <text x="415" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800">
            Great Circle = (θ / 360°) × 2πR
          </text>
          <text x="415" y="102" textAnchor="middle" fill="#3BDC86" fontSize="12" fontWeight="800">
            Along Latitude α = (θ / 360°) × 2πR cos α
          </text>
          <text x="415" y="134" textAnchor="middle" fill="#7DD3FC" fontSize="11.5" fontWeight="700">
            Same hemisphere: subtract · Opposite: add
          </text>
          <text x="415" y="162" textAnchor="middle" fill="#FF8A73" fontSize="11" fontWeight="700">
            Earth spins 15° per hour (East = ahead)
          </text>
        </MathStageShell>
      );
    }

    return (
      <MathStageShell
        title="Sectors, Cylinders, Cones (l² = r² + h²) & Spheres"
        ariaLabel="Sector arc length and area alongside cylinder and cone mensuration formulas"
        caption="Cone curved surface area uses slant height l = √(r² + h²) in πrl, whereas cone volume uses perpendicular height h in ⅓πr²h!"
      >
        <rect x="20" y="18" width="250" height="174" rx="12" fill="#1B3C2E" stroke="#7DD3FC" strokeWidth="1.8" />
        <text x="145" y="42" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="800">
          Circle Sector (Angle θ°)
        </text>
        <path d="M 88 148 L 194 148 A 106 106 0 0 0 156 64 Z" fill="rgba(125,211,252,0.2)" stroke="#FFD84D" strokeWidth="2.2" />
        <text x="142" y="166" fill="#FFD84D" fontSize="11" fontWeight="800">r</text>
        <text x="115" y="138" fill="#3BDC86" fontSize="11" fontWeight="800">θ</text>
        <text x="145" y="184" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700">
          Arc = (θ/360)2πr · Area = (θ/360)πr²
        </text>

        <rect x="286" y="18" width="254" height="174" rx="12" fill="#11281E" stroke="#FFD84D" strokeWidth="1.8" />
        <text x="413" y="42" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
          3D Solids Quick Sheet
        </text>
        <text x="413" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="700">
          Cylinder: V = πr²h · TSA = 2πr(r + h)
        </text>
        <text x="413" y="102" textAnchor="middle" fill="#3BDC86" fontSize="12" fontWeight="800">
          Cone: V = ⅓πr²h · CSA = πrl
        </text>
        <text x="413" y="132" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="700">
          Sphere: V = ⁴⁄₃πr³ · A = 4πr²
        </text>
        <text x="413" y="162" textAnchor="middle" fill="#FF8A73" fontSize="11" fontWeight="700">
          Perimeter of sector = Arc + 2r (don’t forget 2r!)
        </text>
      </MathStageShell>
    );
  }

  // 9. Trigonometry, Special Angles, Sine/Cosine Rules & 3-Figure Bearings
  if (topicId === 'trig' || topicId === 'm-bearing') {
    return (
      <MathStageShell
        title="Special Angles, CAST Quadrants, Sine/Cosine Rules & 3-Figure Bearings"
        ariaLabel="North clockwise 3-figure bearing diagram and Sine and Cosine rule summary"
        caption="Bearings are measured CLOCKWISE from North in 3 digits (000°–360°). Back bearing = θ ± 180°. Remember sin²θ + cos²θ = 1."
      >
        <rect x="20" y="18" width="244" height="174" rx="12" fill="#1B3C2E" stroke="#7DD3FC" strokeWidth="1.8" />
        <text x="142" y="40" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="800">
          3-Figure Bearing from A to B
        </text>
        <line x1="96" y1="158" x2="96" y2="56" stroke="#FFD84D" strokeWidth="2.2" markerEnd="url(#mnv-arr)" />
        <text x="96" y="50" textAnchor="middle" fill="#FFD84D" fontSize="11" fontWeight="800">N</text>
        <line x1="96" y1="138" x2="210" y2="86" stroke="#3BDC86" strokeWidth="2.6" markerEnd="url(#mnv-arr-green)" />
        <path d="M 96 104 A 34 34 0 0 1 126 124" fill="none" stroke="#FFD84D" strokeWidth="2" />
        <text x="134" y="106" fill="#FFFFFF" fontSize="11.5" fontWeight="800">065°</text>
        <text x="84" y="148" fill="#FFFFFF" fontSize="11" fontWeight="800">A</text>
        <text x="220" y="88" fill="#3BDC86" fontSize="11" fontWeight="800">B</text>
        <text x="142" y="180" textAnchor="middle" fill="#9EC4B1" fontSize="10.5" fontWeight="700">
          Back bearing of A from B = 065° + 180° = 245°
        </text>

        <rect x="280" y="18" width="260" height="174" rx="12" fill="#11281E" stroke="#FFD84D" strokeWidth="1.8" />
        <text x="410" y="42" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
          Trig Ratios &amp; Non-Right Triangles
        </text>
        <text x="410" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800">
          a / sin A = b / sin B = c / sin C
        </text>
        <text x="410" y="98" textAnchor="middle" fill="#3BDC86" fontSize="12" fontWeight="800">
          a² = b² + c² − 2bc cos A
        </text>
        <text x="410" y="126" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="700">
          Area = ½ab sin C  ·  sin²θ + cos²θ = 1
        </text>
        <text x="410" y="156" textAnchor="middle" fill="#C4B5FD" fontSize="11" fontWeight="700">
          30°: sin=½, cos=√3/2 · 45°: tan=1 · 60°: sin=√3/2
        </text>
      </MathStageShell>
    );
  }

  // 10. Coordinate Geometry & 2D Vectors / Plane Transformations
  if (topicId === 'coord' || topicId === 'm-vec') {
    return (
      <MathStageShell
        title="Coordinate Lines (m₁m₂ = −1) & 2D Vector Triangle Law (AB = OB − OA)"
        ariaLabel="Coordinate line gradient midpoint and vector triangle law diagram"
        caption="Perpendicular lines have m₁m₂ = −1. Position vector AB = OB − OA (Head minus Tail), and a · b = 0 proves two vectors are perpendicular!"
      >
        <rect x="20" y="18" width="252" height="174" rx="12" fill="#1B3C2E" stroke="#7DD3FC" strokeWidth="1.8" />
        <text x="146" y="40" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="800">
          Straight Line Geometry
        </text>
        <text x="146" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800">
          m = (y₂ − y₁) / (x₂ − x₁)
        </text>
        <text x="146" y="98" textAnchor="middle" fill="#3BDC86" fontSize="12" fontWeight="700">
          y − y₁ = m(x − x₁)  ·  y = mx + c
        </text>
        <text x="146" y="126" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
          Parallel: m₁ = m₂ · Perp: m₁m₂ = −1
        </text>
        <text x="146" y="156" textAnchor="middle" fill="#9EC4B1" fontSize="11">
          Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2)
        </text>

        <rect x="288" y="18" width="252" height="174" rx="12" fill="#11281E" stroke="#FFD84D" strokeWidth="1.8" />
        <text x="414" y="40" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
          Vectors &amp; Transformations
        </text>
        <line x1="330" y1="146" x2="386" y2="74" stroke="#7DD3FC" strokeWidth="2.4" markerEnd="url(#mnv-arr-cyan)" />
        <line x1="330" y1="146" x2="486" y2="136" stroke="#3BDC86" strokeWidth="2.4" markerEnd="url(#mnv-arr-green)" />
        <line x1="386" y1="74" x2="484" y2="134" stroke="#FFD84D" strokeWidth="2.4" markerEnd="url(#mnv-arr)" />
        <text x="318" y="154" fill="#FFFFFF" fontSize="11" fontWeight="800">O</text>
        <text x="382" y="66" fill="#7DD3FC" fontSize="11" fontWeight="800">A</text>
        <text x="496" y="140" fill="#3BDC86" fontSize="11" fontWeight="800">B</text>
        <text x="448" y="96" fill="#FFD84D" fontSize="11" fontWeight="800">AB = b − a</text>
        <text x="414" y="178" textAnchor="middle" fill="#E8F5EE" fontSize="11" fontWeight="700">
          |r| = √(x² + y²) · a · b = |a||b|cos θ
        </text>
      </MathStageShell>
    );
  }

  // 11. Calculus: Differentiation & Integration
  if (topicId === 'diff' || topicId === 'integ') {
    return (
      <MathStageShell
        title="Calculus Dual Power: Tangent Gradient dy/dx vs Area Under Curve ∫ y dx"
        ariaLabel="Curve showing stationary turning point dy/dx equals 0 and shaded definite integral area"
        caption="Differentiation finds instantaneous gradient & turning points (dy/dx = 0); Integration reverses it (add 1 to power, divide by new power, + C)."
      >
        <rect x="20" y="18" width="252" height="174" rx="12" fill="#1B3C2E" stroke="#7DD3FC" strokeWidth="1.8" />
        <text x="146" y="40" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="800">
          Differentiation: dy/dx = naxⁿ⁻¹
        </text>
        <path d="M 48 156 Q 112 52 176 128 T 246 76" fill="none" stroke="#3BDC86" strokeWidth="2.6" />
        <line x1="74" y1="90" x2="150" y2="90" stroke="#FFD84D" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="112" cy="90" r="4.5" fill="#FFD84D" />
        <text x="146" y="156" textAnchor="middle" fill="#FFFFFF" fontSize="11.5" fontWeight="700">
          Turning point: dy/dx = 0
        </text>
        <text x="146" y="178" textAnchor="middle" fill="#9EC4B1" fontSize="10.5">
          d²y/dx² &lt; 0 ⇒ Max · d²y/dx² &gt; 0 ⇒ Min
        </text>

        <rect x="288" y="18" width="252" height="174" rx="12" fill="#11281E" stroke="#FFD84D" strokeWidth="1.8" />
        <text x="414" y="40" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
          Integration: ∫ axⁿ dx = axⁿ⁺¹/(n+1) + C
        </text>
        <path d="M 332 146 L 332 108 Q 410 68 486 96 L 486 146 Z" fill="rgba(255,216,77,0.22)" stroke="#FFD84D" strokeWidth="2" />
        <line x1="312" y1="146" x2="512" y2="146" stroke="#9EC4B1" strokeWidth="1.6" />
        <text x="332" y="162" textAnchor="middle" fill="#7DD3FC" fontSize="11" fontWeight="800">a</text>
        <text x="486" y="162" textAnchor="middle" fill="#7DD3FC" fontSize="11" fontWeight="800">b</text>
        <text x="414" y="180" textAnchor="middle" fill="#3BDC86" fontSize="11.5" fontWeight="800">
          Area = F(b) − F(a)  ·  Kinematics: v = ∫a dt, s = ∫v dt
        </text>
      </MathStageShell>
    );
  }

  // 12. Statistics, Dispersion, Permutations/Combinations & Probability (default / stats group)
  return (
    <MathStageShell
      title="Grouped Statistics, Variance σ², Counting (ⁿPᵣ vs ⁿCᵣ) & Probability"
      ariaLabel="Summary plate of grouped mean, standard deviation, permutations, combinations and probability laws"
      caption="Order matters in Permutations (ⁿPᵣ); order does NOT matter in Combinations (ⁿCᵣ). In probability, AND multiplies while OR adds!"
    >
      <rect x="20" y="18" width="252" height="174" rx="12" fill="#1B3C2E" stroke="#7DD3FC" strokeWidth="1.8" />
      <text x="146" y="40" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="800">
        Averages &amp; Spread (Dispersion)
      </text>
      <text x="146" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="12.5" fontWeight="800">
        Mean x̄ = ∑fx / ∑f
      </text>
      <text x="146" y="98" textAnchor="middle" fill="#3BDC86" fontSize="12" fontWeight="700">
        Variance σ² = ∑f(x − x̄)² / ∑f
      </text>
      <text x="146" y="126" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
        SD σ = √Variance  ·  IQR = Q₃ − Q₁
      </text>
      <text x="146" y="158" textAnchor="middle" fill="#9EC4B1" fontSize="10.5">
        Pie sector angle = (freq / Total) × 360°
      </text>

      <rect x="288" y="18" width="252" height="174" rx="12" fill="#11281E" stroke="#FFD84D" strokeWidth="1.8" />
      <text x="414" y="40" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
        Counting &amp; Probability Laws
      </text>
      <text x="414" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800">
        ⁿPᵣ = n! / (n − r)!  ·  ⁿCᵣ = n! / [r!(n − r)!]
      </text>
      <text x="414" y="100" textAnchor="middle" fill="#3BDC86" fontSize="12" fontWeight="700">
        P(E′) = 1 − P(E)  ·  0 ≤ P(E) ≤ 1
      </text>
      <text x="414" y="128" textAnchor="middle" fill="#7DD3FC" fontSize="11.5" fontWeight="700">
        OR (Mutually excl.): P(A ∪ B) = P(A) + P(B)
      </text>
      <text x="414" y="156" textAnchor="middle" fill="#FF8A73" fontSize="11.5" fontWeight="700">
        AND (Independent): P(A ∩ B) = P(A) × P(B)
      </text>
    </MathStageShell>
  );
}
