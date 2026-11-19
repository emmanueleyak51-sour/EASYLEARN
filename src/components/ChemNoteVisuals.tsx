import React from 'react';

export interface ChemNoteVisualSpec {
  title: string;
  caption: string;
  svg: React.ReactNode;
}

function StageShell({
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
            <marker id="cnv-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#FFD84D" />
            </marker>
            <marker id="cnv-arr-cyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#7DD3FC" />
            </marker>
            <marker id="cnv-arr-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
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

export function ChemNoteVisual({
  topicId,
  partIdx = 0,
}: {
  topicId: string;
  partIdx?: number;
}) {
  // 1. Introduction to Chemistry, Scientific Method & Lab Safety
  if (topicId === 'c-intro') {
    if (partIdx === 0) {
      return (
        <StageShell
          title="The Scientific Method Cycle"
          ariaLabel="Flowchart of Observation, Hypothesis, Experiment, Theory, and Scientific Law"
          caption="A hypothesis is a testable explanation; repeated verification promotes it to a Theory, while a concise universal summary of what happens becomes a Scientific Law."
        >
          {[
            { x: 12, label: '1. Observe', sub: 'Notice pattern', col: '#7DD3FC' },
            { x: 121, label: '2. Hypothesis', sub: 'Testable idea', col: '#FFD84D' },
            { x: 230, label: '3. Experiment', sub: 'Controlled test', col: '#3BDC86' },
            { x: 339, label: '4. Theory', sub: 'Explains WHY', col: '#C4B5FD' },
            { x: 448, label: '5. Law', sub: 'States WHAT', col: '#FF8A73' },
          ].map((item, idx) => (
            <g key={item.label}>
              <rect x={item.x} y={54} width={100} height={74} rx={12} fill="#1D4031" stroke={item.col} strokeWidth={2} />
              <text x={item.x + 50} y={84} textAnchor="middle" fill={item.col} fontSize="11" fontWeight="800">
                {item.label}
              </text>
              <text x={item.x + 50} y={106} textAnchor="middle" fill="#E8F5EE" fontSize="10">
                {item.sub}
              </text>
              {idx < 4 && (
                <line
                  x1={item.x + 101}
                  y1={91}
                  x2={item.x + 119}
                  y2={91}
                  stroke="#FFD84D"
                  strokeWidth={2}
                  markerEnd="url(#cnv-arr)"
                />
              )}
            </g>
          ))}
          <path d="M 280 132 Q 280 178 172 178 Q 172 150 172 132" fill="none" stroke="#FF8A73" strokeWidth="1.6" strokeDasharray="4 3" markerEnd="url(#cnv-arr)" />
          <text x="230" y="194" textAnchor="middle" fill="#FF8A73" fontSize="11" fontWeight="700">
            If results contradict → revise hypothesis &amp; re-test
          </text>
        </StageShell>
      );
    }
    return (
      <StageShell
        title="Volumetric Meniscus Reading & Counter-Current Condenser"
        ariaLabel="Burette lower meniscus eye level reading and Liebig condenser water flow"
        caption="Always read the bottom of a colourless concave meniscus at eye level (0.05 cm³ precision), and feed cooling water into the lowest Liebig jacket inlet."
      >
        {/* Left: Burette Meniscus */}
        <rect x="34" y="20" width="190" height="170" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
        <text x="129" y="40" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="700">
          Burette Meniscus (Eye Level)
        </text>
        <line x1="88" y1="54" x2="88" y2="172" stroke="#F5FBF7" strokeWidth="2.2" />
        <line x1="142" y1="54" x2="142" y2="172" stroke="#F5FBF7" strokeWidth="2.2" />
        <path d="M 88 102 Q 115 122 142 102 L 142 168 L 88 168 Z" fill="rgba(125,211,252,0.32)" />
        <path d="M 88 102 Q 115 122 142 102" fill="none" stroke="#7DD3FC" strokeWidth="2.5" />
        <line x1="68" y1="112" x2="195" y2="112" stroke="#3BDC86" strokeWidth="1.8" strokeDasharray="4 3" />
        <text x="178" y="106" textAnchor="middle" fill="#3BDC86" fontSize="11" fontWeight="800">
          24.50 cm³ ✓
        </text>
        {/* Right: Liebig Condenser */}
        <rect x="248" y="20" width="280" height="170" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
        <text x="388" y="40" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="700">
          Liebig Counter-Current Jacket
        </text>
        <line x1="280" y1="74" x2="490" y2="134" stroke="#F5FBF7" strokeWidth="10" strokeLinecap="round" opacity="0.25" />
        <rect x="315" y="78" width="140" height="36" rx="8" transform="rotate(16 385 96)" fill="rgba(59,220,134,0.18)" stroke="#7DD3FC" strokeWidth="2" />
        <line x1="435" y1="158" x2="435" y2="125" stroke="#7DD3FC" strokeWidth="2.2" markerEnd="url(#cnv-arr-cyan)" />
        <text x="435" y="174" textAnchor="middle" fill="#7DD3FC" fontSize="11" fontWeight="700">
          Cold water IN (bottom)
        </text>
        <line x1="335" y1="76" x2="335" y2="48" stroke="#FF8A73" strokeWidth="2.2" markerEnd="url(#cnv-arr)" />
        <text x="335" y="60" dx="-38" textAnchor="end" fill="#FF8A73" fontSize="11" fontWeight="700">
          Warm OUT (top)
        </text>
      </StageShell>
    );
  }

  // 2. Separation Techniques & Purity
  if (topicId === 'c-sep') {
    return (
      <StageShell
        title="Choosing the Right Separation Method & Purity Criteria"
        ariaLabel="Comparison of Paper Chromatography Rf ratio, Separating Funnel immiscible layers, and Melting Point curve"
        caption="Pure solids melt sharply at one fixed temperature; mixtures melt over a wide, lowered range. In chromatography, Rf = distance moved by solute ÷ solvent front."
      >
        {/* Left: Chromatography */}
        <rect x="20" y="20" width="166" height="170" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
        <text x="103" y="39" textAnchor="middle" fill="#FFD84D" fontSize="11.5" fontWeight="700">
          Chromatography (Rf)
        </text>
        <rect x="68" y="48" width="70" height="126" rx="4" fill="#F5FBF7" opacity="0.92" />
        <line x1="68" y1="154" x2="138" y2="154" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="68" y1="66" x2="138" y2="66" stroke="#0284C7" strokeWidth="1.8" />
        <circle cx="103" cy="96" r="6" fill="#EF4444" />
        <circle cx="103" cy="126" r="5.5" fill="#2563EB" />
        <text x="103" y="184" textAnchor="middle" fill="#7DD3FC" fontSize="10.5" fontWeight="700">
          Pencil baseline · Rf &lt; 1
        </text>

        {/* Center: Separating funnel */}
        <rect x="198" y="20" width="164" height="170" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
        <text x="280" y="39" textAnchor="middle" fill="#FFD84D" fontSize="11.5" fontWeight="700">
          Immiscible Liquids
        </text>
        <path d="M 244 58 L 316 58 L 292 138 L 285 166 L 275 166 L 268 138 Z" fill="none" stroke="#F5FBF7" strokeWidth="2" />
        <path d="M 248 72 L 312 72 L 302 105 L 258 105 Z" fill="rgba(255,216,77,0.55)" />
        <path d="M 258 105 L 302 105 L 292 138 L 268 138 Z" fill="rgba(125,211,252,0.5)" />
        <text x="280" y="92" textAnchor="middle" fill="#141C33" fontSize="10" fontWeight="800">
          Kerosene (less dense)
        </text>
        <text x="280" y="124" textAnchor="middle" fill="#F5FBF7" fontSize="10" fontWeight="700">
          Water (denser)
        </text>

        {/* Right: Purity check */}
        <rect x="374" y="20" width="166" height="170" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
        <text x="457" y="39" textAnchor="middle" fill="#FFD84D" fontSize="11.5" fontWeight="700">
          Purity Check
        </text>
        <line x1="398" y1="156" x2="522" y2="156" stroke="#9EC4B1" strokeWidth="1.5" />
        <line x1="398" y1="156" x2="398" y2="56" stroke="#9EC4B1" strokeWidth="1.5" />
        <polyline points="402,146 436,96 482,96 516,62" fill="none" stroke="#3BDC86" strokeWidth="2.6" />
        <polyline points="402,148 434,116 484,100 516,68" fill="none" stroke="#FF8A73" strokeWidth="2" strokeDasharray="4 3" />
        <text x="460" y="88" textAnchor="middle" fill="#3BDC86" fontSize="10.5" fontWeight="700">
          Pure: flat plateau
        </text>
        <text x="464" y="138" textAnchor="middle" fill="#FF8A73" fontSize="10" fontWeight="700">
          Impure: sloped range
        </text>
      </StageShell>
    );
  }

  // 3. Particulate Nature of Matter, Valency & IUPAC Nomenclature
  if (topicId === 'c-part') {
    return (
      <StageShell
        title="Atomicity Gallery & Valency Cross-Swap Rule"
        ariaLabel="Atomicity of He, O2, O3, P4, S8 and criss-cross valency swap for Al2(SO4)3"
        caption="Swap ionic charges diagonally and reduce to lowest ratio: Al³⁺ and SO₄²⁻ cross to give Al₂(SO₄)₃ — tetraoxosulphate(VI) of aluminium."
      >
        <rect x="20" y="20" width="250" height="170" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
        <text x="145" y="40" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="700">
          Atomicity of Elements
        </text>
        {[
          { x: 52, sym: 'He', n: '1 (Mono)', c: '#7DD3FC' },
          { x: 108, sym: 'O₂', n: '2 (Di)', c: '#3BDC86' },
          { x: 164, sym: 'P₄', n: '4 (Tetra)', c: '#FFD84D' },
          { x: 224, sym: 'S₈', n: '8 (Octa)', c: '#FF8A73' },
        ].map((el) => (
          <g key={el.sym}>
            <circle cx={el.x} cy="96" r="22" fill="#142C21" stroke={el.c} strokeWidth="2" />
            <text x={el.x} y="101" textAnchor="middle" fill="#F5FBF7" fontSize="14" fontWeight="800">
              {el.sym}
            </text>
            <text x={el.x} y="142" textAnchor="middle" fill={el.c} fontSize="10.5" fontWeight="700">
              {el.n}
            </text>
          </g>
        ))}

        <rect x="286" y="20" width="254" height="170" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
        <text x="413" y="40" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="700">
          Criss-Cross Formula Builder
        </text>
        <text x="355" y="80" textAnchor="middle" fill="#7DD3FC" fontSize="18" fontWeight="800">
          Al³⁺
        </text>
        <text x="470" y="80" textAnchor="middle" fill="#3BDC86" fontSize="18" fontWeight="800">
          SO₄²⁻
        </text>
        <line x1="368" y1="88" x2="452" y2="128" stroke="#FFD84D" strokeWidth="2" markerEnd="url(#cnv-arr)" />
        <line x1="456" y1="88" x2="372" y2="128" stroke="#7DD3FC" strokeWidth="2" markerEnd="url(#cnv-arr-cyan)" />
        <rect x="334" y="138" width="158" height="38" rx="10" fill="#132B20" stroke="#FFD84D" strokeWidth="1.8" />
        <text x="413" y="163" textAnchor="middle" fill="#FFD84D" fontSize="17" fontWeight="800">
          Al₂(SO₄)₃
        </text>
      </StageShell>
    );
  }

  // 4. Chemical Combination & Mole Concept
  if (topicId === 'c-mole') {
    return (
      <StageShell
        title="The Four-Spoke Stoichiometry & Mole Hub"
        ariaLabel="Central mole n connected to Mass m/M, Gas Volume V/22.4 dm3 at STP, Particles N/NA, and Solution C times V"
        caption="Every stoichiometry problem passes through Moles (n): convert given data into moles first, apply balanced equation ratios, then convert to the target unit."
      >
        <circle cx="280" cy="105" r="38" fill="#FFD84D" />
        <text x="280" y="101" textAnchor="middle" fill="#141C33" fontSize="14" fontWeight="900">
          MOLES (n)
        </text>
        <text x="280" y="118" textAnchor="middle" fill="#141C33" fontSize="10.5" fontWeight="700">
          Central Hub
        </text>

        {[
          { x: 24, y: 24, t: 'Mass (g)', f: 'n = m ÷ M', c: '#7DD3FC', lx: 164, ly: 58, cx: 244, cy: 86 },
          { x: 396, y: 24, t: 'Gas @ STP', f: 'n = V ÷ 22.4 dm³', c: '#3BDC86', lx: 396, ly: 58, cx: 316, cy: 86 },
          { x: 24, y: 132, t: 'Particles (N)', f: 'n = N ÷ 6.02×10²³', c: '#C4B5FD', lx: 164, ly: 156, cx: 244, cy: 124 },
          { x: 396, y: 132, t: 'Solutions', f: 'n = C × V(dm³)', c: '#FF8A73', lx: 396, ly: 156, cx: 316, cy: 124 },
        ].map((b) => (
          <g key={b.t}>
            <rect x={b.x} y={b.y} width={140} height={56} rx={12} fill="#1B3C2E" stroke={b.c} strokeWidth="2" />
            <text x={b.x + 70} y={b.y + 23} textAnchor="middle" fill={b.c} fontSize="12" fontWeight="800">
              {b.t}
            </text>
            <text x={b.x + 70} y={b.y + 43} textAnchor="middle" fill="#F5FBF7" fontSize="11.5" fontWeight="700">
              {b.f}
            </text>
            <line x1={b.lx} y1={b.ly} x2={b.cx} y2={b.cy} stroke={b.c} strokeWidth="2" markerEnd="url(#cnv-arr)" />
          </g>
        ))}
      </StageShell>
    );
  }

  // 5. Kinetic Theory of Matter & Gas Laws
  if (topicId === 'c-kin') {
    return (
      <StageShell
        title="Boyle’s, Charles’s & Graham’s Gas Law Curves"
        ariaLabel="Graphs of P vs V hyperbola, V vs Kelvin T line through origin, and Graham diffusion inverse square root"
        caption="Always convert °C to Kelvin (T = °C + 273) before applying gas laws! Lighter gases diffuse faster: r₁/r₂ = √(M₂/M₁)."
      >
        <rect x="18" y="20" width="166" height="170" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
        <text x="101" y="40" textAnchor="middle" fill="#7DD3FC" fontSize="11.5" fontWeight="800">
          Boyle: P₁V₁ = P₂V₂
        </text>
        <line x1="42" y1="158" x2="162" y2="158" stroke="#9EC4B1" strokeWidth="1.6" />
        <line x1="42" y1="158" x2="42" y2="54" stroke="#9EC4B1" strokeWidth="1.6" />
        <path d="M 52 64 Q 68 138 154 148" fill="none" stroke="#7DD3FC" strokeWidth="2.8" />
        <text x="108" y="176" textAnchor="middle" fill="#D6EBE0" fontSize="10.5">
          Volume V (Const T)
        </text>

        <rect x="197" y="20" width="166" height="170" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
        <text x="280" y="40" textAnchor="middle" fill="#3BDC86" fontSize="11.5" fontWeight="800">
          Charles: V₁/T₁ = V₂/T₂
        </text>
        <line x1="220" y1="158" x2="342" y2="158" stroke="#9EC4B1" strokeWidth="1.6" />
        <line x1="220" y1="158" x2="220" y2="54" stroke="#9EC4B1" strokeWidth="1.6" />
        <line x1="220" y1="158" x2="336" y2="66" stroke="#3BDC86" strokeWidth="2.8" />
        <text x="282" y="176" textAnchor="middle" fill="#D6EBE0" fontSize="10.5">
          Temp T in Kelvin (0 K)
        </text>

        <rect x="376" y="20" width="166" height="170" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
        <text x="459" y="40" textAnchor="middle" fill="#FFD84D" fontSize="11.5" fontWeight="800">
          Graham’s Diffusion
        </text>
        <text x="459" y="88" textAnchor="middle" fill="#F5FBF7" fontSize="14" fontWeight="800">
          r₁ / r₂ = √(M₂ / M₁)
        </text>
        <text x="459" y="118" textAnchor="middle" fill="#FFD84D" fontSize="11.5" fontWeight="700">
          H₂ (M=2) vs O₂ (M=32)
        </text>
        <text x="459" y="144" textAnchor="middle" fill="#3BDC86" fontSize="11.5" fontWeight="800">
          H₂ diffuses 4× faster!
        </text>
      </StageShell>
    );
  }

  // 6. Atomic Structure, Orbitals & Periodic Table
  if (topicId === 'c-atom' || topicId === 'c-per') {
    return (
      <StageShell
        title={topicId === 'c-atom' ? 's & p Orbital Shapes + Aufbau Cr & Cu Exceptions' : 'Periodic Trends Across a Period & Down a Group'}
        ariaLabel="Atomic orbitals s sphere and p dumbbell plus periodic trends arrows"
        caption={
          topicId === 'c-atom'
            ? 's orbitals are spherical; p orbitals are three perpendicular dumbbells (px, py, pz). Watch Cr ([Ar] 3d⁵ 4s¹) and Cu ([Ar] 3d¹⁰ 4s¹) half/full-subshell stability!'
            : 'Across a period (left → right): Ionisation Energy & Electronegativity INCREASE while Atomic Radius DECREASES due to rising nuclear charge.'
        }
      >
        {topicId === 'c-atom' ? (
          <>
            <rect x="22" y="22" width="160" height="166" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
            <text x="102" y="42" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="800">
              s-Orbital (Spherical)
            </text>
            <circle cx="102" cy="112" r="42" fill="rgba(125,211,252,0.22)" stroke="#7DD3FC" strokeWidth="2.4" />
            <line x1="48" y1="112" x2="156" y2="112" stroke="#9EC4B1" strokeDasharray="3 2" />
            <line x1="102" y1="58" x2="102" y2="166" stroke="#9EC4B1" strokeDasharray="3 2" />

            <rect x="196" y="22" width="166" height="166" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
            <text x="279" y="42" textAnchor="middle" fill="#3BDC86" fontSize="12" fontWeight="800">
              p-Orbital (Dumbbell)
            </text>
            <ellipse cx="249" cy="112" rx="28" ry="18" fill="rgba(59,220,134,0.25)" stroke="#3BDC86" strokeWidth="2.2" />
            <ellipse cx="309" cy="112" rx="28" ry="18" fill="rgba(255,216,77,0.25)" stroke="#FFD84D" strokeWidth="2.2" />
            <circle cx="279" cy="112" r="3.5" fill="#F5FBF7" />
            <text x="279" y="162" textAnchor="middle" fill="#D6EBE0" fontSize="10.5">
              3 degenerate: px, py, pz
            </text>

            <rect x="376" y="22" width="164" height="166" rx="12" fill="#1B3C2E" stroke="#FFD84D" strokeWidth="1.6" />
            <text x="458" y="42" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
              2 Classic Anomalies
            </text>
            <text x="458" y="84" textAnchor="middle" fill="#F5FBF7" fontSize="13" fontWeight="800">
              ₂₄Cr: [Ar] 3d⁵ 4s¹
            </text>
            <text x="458" y="104" textAnchor="middle" fill="#9EC4B1" fontSize="10.5">
              Half-filled 3d⁵ stability
            </text>
            <text x="458" y="140" textAnchor="middle" fill="#F5FBF7" fontSize="13" fontWeight="800">
              ₂₉Cu: [Ar] 3d¹⁰ 4s¹
            </text>
            <text x="458" y="160" textAnchor="middle" fill="#9EC4B1" fontSize="10.5">
              Fully-filled 3d¹⁰ stability
            </text>
          </>
        ) : (
          <>
            <rect x="70" y="34" width="420" height="142" rx="14" fill="#1B3C2E" stroke="#2E5C48" strokeWidth="2" />
            <line x1="110" y1="62" x2="450" y2="62" stroke="#FFD84D" strokeWidth="3" markerEnd="url(#cnv-arr)" />
            <text x="280" y="52" textAnchor="middle" fill="#FFD84D" fontSize="12.5" fontWeight="800">
              Across Period → Ionisation Energy &amp; Electronegativity INCREASE
            </text>
            <line x1="450" y1="98" x2="110" y2="98" stroke="#7DD3FC" strokeWidth="2.5" markerEnd="url(#cnv-arr-cyan)" />
            <text x="280" y="116" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="700">
              ← Atomic Radius INCREASES towards Group 1
            </text>
            <line x1="94" y1="74" x2="94" y2="164" stroke="#3BDC86" strokeWidth="3" markerEnd="url(#cnv-arr-green)" />
            <text x="285" y="156" textAnchor="middle" fill="#3BDC86" fontSize="12" fontWeight="800">
              Down Group ↓ Shells &amp; Metallic Reactivity INCREASE · IE DECREASES
            </text>
          </>
        )}
      </StageShell>
    );
  }

  // 7. Chemical Bonding & Molecular Shapes
  if (topicId === 'c-bond') {
    return (
      <StageShell
        title="Lone-Pair Repulsion & Molecular Bond Angles"
        ariaLabel="Comparison of CO2 linear 180, CH4 tetrahedral 109.5, NH3 trigonal pyramidal 107, and H2O bent 104.5"
        caption="Each lone pair squeezes bonding pairs closer by ~2.5°: CH₄ (0 LP = 109.5°) → NH₃ (1 LP = 107°) → H₂O (2 LP = 104.5°)."
      >
        {[
          { x: 18, m: 'CO₂', shape: 'Linear', ang: '180°', lp: '0 lone pairs', c: '#7DD3FC' },
          { x: 152, m: 'CH₄', shape: 'Tetrahedral', ang: '109.5°', lp: '0 lone pairs', c: '#3BDC86' },
          { x: 286, m: 'NH₃', shape: 'Pyramidal', ang: '107°', lp: '1 lone pair', c: '#FFD84D' },
          { x: 420, m: 'H₂O', shape: 'V-Bent', ang: '104.5°', lp: '2 lone pairs', c: '#FF8A73' },
        ].map((item) => (
          <g key={item.m}>
            <rect x={item.x} y={24} width={122} height={162} rx={12} fill="#1B3C2E" stroke={item.c} strokeWidth="2" />
            <text x={item.x + 61} y={54} textAnchor="middle" fill="#F5FBF7" fontSize="20" fontWeight="900">
              {item.m}
            </text>
            <text x={item.x + 61} y={84} textAnchor="middle" fill={item.c} fontSize="13" fontWeight="800">
              {item.shape}
            </text>
            <rect x={item.x + 22} y={98} width={78} height={32} rx={8} fill="#12291F" />
            <text x={item.x + 61} y={119} textAnchor="middle" fill="#FFD84D" fontSize="14" fontWeight="800">
              {item.ang}
            </text>
            <text x={item.x + 61} y={156} textAnchor="middle" fill="#D6EBE0" fontSize="11">
              {item.lp}
            </text>
          </g>
        ))}
      </StageShell>
    );
  }

  // 8. Carbon, Allotropes, Coal & Oxides of Carbon
  if (topicId === 'c-carbon') {
    return (
      <StageShell
        title="Diamond (sp³ Rigid Network) vs Graphite (sp² Mobile-Electron Sheets)"
        ariaLabel="Tetrahedral sp3 diamond crystal vs layered hexagonal sp2 graphite with delocalised electrons"
        caption="Diamond bonds all 4 valence electrons tetrahedrally (hardest, non-conductor); Graphite bonds 3 per carbon in flat hexagons, leaving 1 free electron per C to conduct electricity!"
      >
        <rect x="22" y="20" width="246" height="170" rx="12" fill="#1B3C2E" stroke="#7DD3FC" strokeWidth="2" />
        <text x="145" y="42" textAnchor="middle" fill="#7DD3FC" fontSize="12.5" fontWeight="800">
          Diamond · sp³ Tetrahedral
        </text>
        <line x1="145" y1="62" x2="145" y2="98" stroke="#F5FBF7" strokeWidth="2.5" />
        <line x1="145" y1="98" x2="105" y2="132" stroke="#F5FBF7" strokeWidth="2.5" />
        <line x1="145" y1="98" x2="185" y2="132" stroke="#F5FBF7" strokeWidth="2.5" />
        <line x1="145" y1="98" x2="145" y2="142" stroke="#F5FBF7" strokeWidth="2.5" />
        {[
          [145, 62],
          [145, 98],
          [105, 132],
          [185, 132],
          [145, 142],
        ].map(([cx, cy], idx) => (
          <circle key={idx} cx={cx} cy={cy} r="8" fill="#7DD3FC" stroke="#10261D" strokeWidth="2" />
        ))}
        <text x="145" y="174" textAnchor="middle" fill="#D6EBE0" fontSize="11">
          0 free e⁻ · Insulator · Drills &amp; Glass cutters
        </text>

        <rect x="292" y="20" width="246" height="170" rx="12" fill="#1B3C2E" stroke="#FFD84D" strokeWidth="2" />
        <text x="415" y="42" textAnchor="middle" fill="#FFD84D" fontSize="12.5" fontWeight="800">
          Graphite · sp² Hexagonal Sheets
        </text>
        <polygon points="365,76 395,66 425,76 425,94 395,104 365,94" fill="none" stroke="#3BDC86" strokeWidth="2.2" />
        <polygon points="425,76 455,66 485,76 485,94 455,104 425,94" fill="none" stroke="#3BDC86" strokeWidth="2.2" />
        <polygon points="365,126 395,116 425,126 425,144 395,154 365,144" fill="none" stroke="#3BDC86" strokeWidth="2.2" />
        <polygon points="425,126 455,116 485,126 485,144 455,154 425,144" fill="none" stroke="#3BDC86" strokeWidth="2.2" />
        <line x1="395" y1="104" x2="395" y2="116" stroke="#FFD84D" strokeDasharray="3 2" strokeWidth="1.8" />
        <line x1="455" y1="104" x2="455" y2="116" stroke="#FFD84D" strokeDasharray="3 2" strokeWidth="1.8" />
        <text x="415" y="174" textAnchor="middle" fill="#FFD84D" fontSize="11" fontWeight="700">
          1 mobile e⁻/C · Conductor &amp; Dry Lubricant
        </text>
      </StageShell>
    );
  }

  // 9. Water, Hardness of Water & Municipal Water Treatment
  if (topicId === 'c-water') {
    if (partIdx === 0) {
      return (
        <StageShell
          title="V-Shaped H₂O Hydrogen Bonding (104.5°) & Chemical Water Tests"
          ariaLabel="Bent water molecule 104.5 degrees with intermolecular H-bond and anhydrous CuSO4 / CoCl2 colour changes"
          caption="Chemical tests prove the PRESENCE of water (white CuSO₄ → blue; blue CoCl₂ → pink), while a sharp 100 °C boiling point at 1 atm proves PURITY."
        >
          <rect x="20" y="22" width="248" height="166" rx="12" fill="#1B3C2E" stroke="#7DD3FC" strokeWidth="2" />
          <text x="144" y="44" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="800">
            Bent H₂O (104.5°) &amp; H-Bonds
          </text>
          <line x1="114" y1="88" x2="78" y2="128" stroke="#F5FBF7" strokeWidth="3" />
          <line x1="114" y1="88" x2="150" y2="128" stroke="#F5FBF7" strokeWidth="3" />
          <circle cx="114" cy="88" r="15" fill="#EF4444" />
          <text x="114" y="93" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="900">O</text>
          <circle cx="78" cy="128" r="10" fill="#7DD3FC" />
          <text x="78" y="132" textAnchor="middle" fill="#141C33" fontSize="10" fontWeight="900">H</text>
          <circle cx="150" cy="128" r="10" fill="#7DD3FC" />
          <text x="150" y="132" textAnchor="middle" fill="#141C33" fontSize="10" fontWeight="900">H</text>
          <line x1="162" y1="128" x2="212" y2="108" stroke="#FFD84D" strokeWidth="2.2" strokeDasharray="4 3" />
          <circle cx="224" cy="104" r="13" fill="#EF4444" opacity="0.85" />
          <text x="224" y="108" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="800">O</text>
          <text x="144" y="168" textAnchor="middle" fill="#FFD84D" fontSize="10.5" fontWeight="700">
            Max density = 1.00 g cm⁻³ at 4 °C
          </text>

          <rect x="286" y="22" width="254" height="166" rx="12" fill="#1B3C2E" stroke="#FFD84D" strokeWidth="2" />
          <text x="413" y="44" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
            2 Specific Chemical Tests
          </text>
          <rect x="302" y="58" width="222" height="52" rx="9" fill="#12291F" stroke="#7DD3FC" />
          <text x="413" y="79" textAnchor="middle" fill="#F5FBF7" fontSize="11" fontWeight="800">
            Anhydrous CuSO₄ (White)
          </text>
          <text x="413" y="98" textAnchor="middle" fill="#7DD3FC" fontSize="11" fontWeight="800">
            + 5H₂O → Blue CuSO₄·5H₂O
          </text>
          <rect x="302" y="120" width="222" height="52" rx="9" fill="#12291F" stroke="#FF8A73" />
          <text x="413" y="141" textAnchor="middle" fill="#7DD3FC" fontSize="11" fontWeight="800">
            Dry CoCl₂ Paper (Blue)
          </text>
          <text x="413" y="160" textAnchor="middle" fill="#FF8A73" fontSize="11" fontWeight="800">
            + 6H₂O → Pink CoCl₂·6H₂O
          </text>
        </StageShell>
      );
    }

    if (partIdx === 1) {
      return (
        <StageShell
          title="Temporary Hardness vs Permanent Hardness Comparison"
          ariaLabel="Comparison of Temporary hardness Ca(HCO3)2 removed by boiling vs Permanent hardness CaSO4 needing Na2CO3 or Permutit"
          caption="Boiling decomposes soluble Ca(HCO₃)₂ into insoluble CaCO₃ fur/kettle scale, removing Temporary hardness — but CaSO₄ is thermally stable and needs Na₂CO₃ or Permutit!"
        >
          <rect x="20" y="22" width="250" height="166" rx="12" fill="#1B3C2E" stroke="#3BDC86" strokeWidth="2" />
          <text x="145" y="44" textAnchor="middle" fill="#3BDC86" fontSize="12.5" fontWeight="800">
            Temporary Hardness
          </text>
          <text x="145" y="72" textAnchor="middle" fill="#F5FBF7" fontSize="12" fontWeight="800">
            Ca(HCO₃)₂ &amp; Mg(HCO₃)₂
          </text>
          <text x="145" y="102" textAnchor="middle" fill="#FFD84D" fontSize="10.5" fontWeight="700">
            ✓ Removed by Boiling (forms CaCO₃↓)
          </text>
          <text x="145" y="126" textAnchor="middle" fill="#3BDC86" fontSize="10.5" fontWeight="700">
            ✓ Calculated Slaked Lime Ca(OH)₂
          </text>
          <text x="145" y="156" textAnchor="middle" fill="#9EC4B1" fontSize="10">
            Forms stalactites &amp; kettle scale
          </text>

          <rect x="288" y="22" width="252" height="166" rx="12" fill="#1B3C2E" stroke="#FF8A73" strokeWidth="2" />
          <text x="414" y="44" textAnchor="middle" fill="#FF8A73" fontSize="12.5" fontWeight="800">
            Permanent Hardness
          </text>
          <text x="414" y="72" textAnchor="middle" fill="#F5FBF7" fontSize="12" fontWeight="800">
            CaSO₄, MgSO₄, CaCl₂
          </text>
          <text x="414" y="102" textAnchor="middle" fill="#FF8A73" fontSize="10.5" fontWeight="700">
            ✗ NOT removed by boiling!
          </text>
          <text x="414" y="126" textAnchor="middle" fill="#FFD84D" fontSize="10.5" fontWeight="700">
            ✓ Washing Soda (Na₂CO₃)
          </text>
          <text x="414" y="150" textAnchor="middle" fill="#7DD3FC" fontSize="10.5" fontWeight="700">
            ✓ Permutit Ion-Exchange Resin
          </text>
        </StageShell>
      );
    }

    return (
      <StageShell
        title="Municipal Township Water Treatment Pipeline"
        ariaLabel="5-stage water treatment pipeline from Aeration and Alum Coagulation to Sedimentation, Sand Filtration, and Chlorination"
        caption="Alum [KAl(SO₄)₂] coagulates fine clay into flocs; Sand filters trap solids; Chlorine kills bacteria; Ca(OH)₂ adjusts pH to protect pipes."
      >
        {[
          { x: 12, s: '1. Aeration', d: 'Oxidises Fe²⁺', c: '#7DD3FC' },
          { x: 121, s: '2. Coagulate', d: 'Alum flocs clay', c: '#FFD84D' },
          { x: 230, s: '3. Settle', d: 'Flocs sink down', c: '#C4B5FD' },
          { x: 339, s: '4. Filter', d: 'Sand & gravel', c: '#3BDC86' },
          { x: 448, s: '5. Chlorinate', d: 'Cl₂ kills germs', c: '#FF8A73' },
        ].map((st, idx) => (
          <g key={st.s}>
            <rect x={st.x} y={32} width={100} height={74} rx={11} fill="#1B3C2E" stroke={st.c} strokeWidth="2" />
            <text x={st.x + 50} y={60} textAnchor="middle" fill={st.c} fontSize="11" fontWeight="800">
              {st.s}
            </text>
            <text x={st.x + 50} y={82} textAnchor="middle" fill="#F5FBF7" fontSize="9.8">
              {st.d}
            </text>
            {idx < 4 && (
              <line x1={st.x + 101} y1={69} x2={st.x + 119} y2={69} stroke="#FFD84D" strokeWidth="2" markerEnd="url(#cnv-arr)" />
            )}
          </g>
        ))}
        <rect x="20" y="124" width="250" height="62" rx="10" fill="#12291F" stroke="#3BDC86" />
        <text x="145" y="146" textAnchor="middle" fill="#3BDC86" fontSize="11" fontWeight="800">
          pH Control: Slaked Lime Ca(OH)₂
        </text>
        <text x="145" y="167" textAnchor="middle" fill="#D6EBE0" fontSize="10">
          Prevents acidic corrosion of town mains
        </text>

        <rect x="286" y="124" width="254" height="62" rx="10" fill="#12291F" stroke="#7DD3FC" />
        <text x="413" y="146" textAnchor="middle" fill="#7DD3FC" fontSize="11" fontWeight="800">
          Optional Polishing: Carbon &amp; F⁻
        </text>
        <text x="413" y="167" textAnchor="middle" fill="#D6EBE0" fontSize="10">
          Charcoal removes odour · NaF prevents decay
        </text>
      </StageShell>
    );
  }

  // 10. Solutions, Solubility, Colloids & Suspensions
  if (topicId === 'c-sol') {
    return (
      <StageShell
        title="True Solution vs Colloid (Tyndall Light Cone) vs Suspension"
        ariaLabel="Laser beam passing invisibly through true solution, scattering visibly as Tyndall cone in colloid, and settling in suspension"
        caption="Colloids (1–1000 nm, e.g. milk, fog, Harmattan haze, starch sol) pass through filter paper like true solutions, yet scatter a light beam (Tyndall effect)!"
      >
        {/* Torch */}
        <rect x="14" y="88" width="38" height="28" rx="6" fill="#FFD84D" />
        <text x="33" y="132" textAnchor="middle" fill="#FFD84D" fontSize="10" fontWeight="700">
          Light
        </text>

        {/* Beaker 1: True Solution */}
        <rect x="78" y="42" width="128" height="122" rx="10" fill="rgba(125,211,252,0.12)" stroke="#7DD3FC" strokeWidth="2" />
        <text x="142" y="32" textAnchor="middle" fill="#7DD3FC" fontSize="11.5" fontWeight="800">
          True Solution (&lt;1 nm)
        </text>
        <text x="142" y="182" textAnchor="middle" fill="#D6EBE0" fontSize="10.5">
          No beam visible (NaCl aq)
        </text>

        {/* Beaker 2: Colloid */}
        <rect x="236" y="42" width="132" height="122" rx="10" fill="rgba(255,216,77,0.12)" stroke="#FFD84D" strokeWidth="2.2" />
        <polygon points="236,95 368,82 368,122 236,109" fill="rgba(255,216,77,0.48)" />
        <text x="302" y="32" textAnchor="middle" fill="#FFD84D" fontSize="11.5" fontWeight="800">
          Colloid (1–1000 nm)
        </text>
        <text x="302" y="106" textAnchor="middle" fill="#141C33" fontSize="10.5" fontWeight="900">
          TYNDALL CONE!
        </text>
        <text x="302" y="182" textAnchor="middle" fill="#FFD84D" fontSize="10.5" fontWeight="700">
          Milk · Fog · Harmattan
        </text>

        {/* Beaker 3: Suspension */}
        <rect x="398" y="42" width="132" height="122" rx="10" fill="rgba(255,138,115,0.12)" stroke="#FF8A73" strokeWidth="2" />
        <rect x="400" y="144" width="128" height="18" rx="4" fill="rgba(255,138,115,0.55)" />
        <text x="464" y="32" textAnchor="middle" fill="#FF8A73" fontSize="11.5" fontWeight="800">
          Suspension (&gt;1000 nm)
        </text>
        <text x="464" y="157" textAnchor="middle" fill="#141C33" fontSize="10" fontWeight="800">
          Sediment settles
        </text>
        <text x="464" y="182" textAnchor="middle" fill="#D6EBE0" fontSize="10.5">
          Blocked by filter paper
        </text>
      </StageShell>
    );
  }

  // 11. Acids, Bases, pH, Buffers & Volumetric Analysis
  if (topicId === 'c-acid' || topicId === 'c-vol') {
    return (
      <StageShell
        title="pH 0–14 Spectrum & Titration Indicator Selection Map"
        ariaLabel="pH 0 to 14 colour spectrum and indicator match rules for Methyl Orange and Phenolphthalein"
        caption="Match the indicator to the steep pH jump: Strong Acid + Weak Base → Methyl Orange (pH 3.1–4.4); Weak Acid + Strong Base → Phenolphthalein (pH 8.3–10.0)."
      >
        {[
          { x: 24, w: 120, c: '#EF4444', t: 'Strong Acid (0–3)' },
          { x: 146, w: 100, c: '#F59E0B', t: 'Weak Acid (4–6)' },
          { x: 248, w: 64, c: '#10B981', t: 'Neutral 7' },
          { x: 314, w: 100, c: '#06B6D4', t: 'Weak Base (8–10)' },
          { x: 416, w: 120, c: '#6366F1', t: 'Strong Base (11–14)' },
        ].map((seg) => (
          <g key={seg.t}>
            <rect x={seg.x} y={32} width={seg.w} height={38} rx={6} fill={seg.c} />
            <text x={seg.x + seg.w / 2} y={55} textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="800">
              {seg.t}
            </text>
          </g>
        ))}

        <rect x="24" y="92" width="248" height="88" rx="12" fill="#1B3C2E" stroke="#FFD84D" strokeWidth="1.8" />
        <text x="148" y="116" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
          Methyl Orange (pH 3.1 – 4.4)
        </text>
        <text x="148" y="138" textAnchor="middle" fill="#F5FBF7" fontSize="11">
          Red in Acid · Yellow in Alkali
        </text>
        <text x="148" y="160" textAnchor="middle" fill="#3BDC86" fontSize="11" fontWeight="700">
          Best for: Strong Acid + Weak Base (Na₂CO₃)
        </text>

        <rect x="288" y="92" width="248" height="88" rx="12" fill="#1B3C2E" stroke="#FF8A73" strokeWidth="1.8" />
        <text x="412" y="116" textAnchor="middle" fill="#FF8A73" fontSize="12" fontWeight="800">
          Phenolphthalein (pH 8.3 – 10.0)
        </text>
        <text x="412" y="138" textAnchor="middle" fill="#F5FBF7" fontSize="11">
          Colourless in Acid · Pink in Alkali
        </text>
        <text x="412" y="160" textAnchor="middle" fill="#3BDC86" fontSize="11" fontWeight="700">
          Best for: Weak Acid (CH₃COOH) + Strong Base
        </text>
      </StageShell>
    );
  }

  // 12. Energy, Rates & Chemical Equilibrium
  if (topicId === 'c-energy' || topicId === 'c-rate' || topicId === 'c-equil') {
    return (
      <StageShell
        title="Activation Energy Profile, Catalyst Path & Gibbs Spontaneity"
        ariaLabel="Reaction profile showing uncatalysed Ea vs lower catalysed Ea, enthalpy change delta H, and Gibbs free energy delta G"
        caption="A catalyst provides an alternative pathway with LOWER activation energy (Ea), speeding up forward and reverse rates equally without changing ΔH or K!"
      >
        <rect x="22" y="20" width="290" height="170" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
        <line x1="50" y1="164" x2="292" y2="164" stroke="#9EC4B1" strokeWidth="1.6" />
        <line x1="50" y1="164" x2="50" y2="38" stroke="#9EC4B1" strokeWidth="1.6" />
        <path d="M 56 112 L 96 112 Q 154 22 212 142 L 280 142" fill="none" stroke="#FF8A73" strokeWidth="2.6" />
        <path d="M 96 112 Q 154 64 212 142" fill="none" stroke="#3BDC86" strokeWidth="2.6" strokeDasharray="5 3" />
        <text x="156" y="44" textAnchor="middle" fill="#FF8A73" fontSize="10.5" fontWeight="800">
          Uncatalysed Ea
        </text>
        <text x="156" y="96" textAnchor="middle" fill="#3BDC86" fontSize="10.5" fontWeight="800">
          Catalysed Ea ↓
        </text>
        <text x="248" y="134" textAnchor="middle" fill="#FFD84D" fontSize="10.5" fontWeight="800">
          ΔH &lt; 0 (Exo)
        </text>

        <rect x="326" y="20" width="212" height="170" rx="12" fill="#1B3C2E" stroke="#FFD84D" strokeWidth="1.8" />
        <text x="432" y="46" textAnchor="middle" fill="#FFD84D" fontSize="12.5" fontWeight="800">
          Gibbs Master Equation
        </text>
        <rect x="348" y="60" width="168" height="36" rx="8" fill="#12291F" />
        <text x="432" y="84" textAnchor="middle" fill="#F5FBF7" fontSize="15" fontWeight="900">
          ΔG = ΔH − TΔS
        </text>
        <text x="432" y="118" textAnchor="middle" fill="#3BDC86" fontSize="11.5" fontWeight="800">
          ΔG &lt; 0 → Spontaneous
        </text>
        <text x="432" y="140" textAnchor="middle" fill="#7DD3FC" fontSize="11" fontWeight="700">
          ΔG = 0 → At Equilibrium
        </text>
        <text x="432" y="162" textAnchor="middle" fill="#FF8A73" fontSize="11" fontWeight="700">
          ΔG &gt; 0 → Non-spontaneous
        </text>
      </StageShell>
    );
  }

  // 13. Redox & Electrolysis
  if (topicId === 'c-redox' || topicId === 'c-elec') {
    return (
      <StageShell
        title="Electrochemical Cell, Preferential Discharge & Faraday’s Laws"
        ariaLabel="Anode oxidation vs Cathode reduction, ECS discharge order, and Faraday Q = It = nF equation"
        caption="AN OX & RED CAT: Oxidation always occurs at the Anode; Reduction always occurs at the Cathode. Lower ions in the ECS (Cu²⁺, Ag⁺) discharge preferentially!"
      >
        <rect x="20" y="22" width="250" height="166" rx="12" fill="#1B3C2E" stroke="#7DD3FC" strokeWidth="2" />
        <text x="145" y="44" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="800">
          Electrode Polarity &amp; Action
        </text>
        <rect x="36" y="60" width="100" height="68" rx="8" fill="#12291F" stroke="#FF8A73" />
        <text x="86" y="82" textAnchor="middle" fill="#FF8A73" fontSize="11.5" fontWeight="800">
          ANODE (Oxidation)
        </text>
        <text x="86" y="102" textAnchor="middle" fill="#F5FBF7" fontSize="10.5">
          Loss of e⁻ (OIL)
        </text>
        <rect x="154" y="60" width="100" height="68" rx="8" fill="#12291F" stroke="#3BDC86" />
        <text x="204" y="82" textAnchor="middle" fill="#3BDC86" fontSize="11.5" fontWeight="800">
          CATHODE (Red.)
        </text>
        <text x="204" y="102" textAnchor="middle" fill="#F5FBF7" fontSize="10.5">
          Gain of e⁻ (RIG)
        </text>
        <text x="145" y="156" textAnchor="middle" fill="#FFD84D" fontSize="11" fontWeight="700">
          Galvanized Iron: Zn sacrifices itself for Fe
        </text>

        <rect x="286" y="22" width="254" height="166" rx="12" fill="#1B3C2E" stroke="#FFD84D" strokeWidth="2" />
        <text x="413" y="44" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">
          Faraday’s Stoichiometry Bridge
        </text>
        <text x="413" y="80" textAnchor="middle" fill="#F5FBF7" fontSize="15" fontWeight="900">
          Q = I × t  |  1 F = 96,500 C
        </text>
        <text x="413" y="112" textAnchor="middle" fill="#3BDC86" fontSize="13" fontWeight="800">
          m = (Q × M) ÷ (z × 96,500)
        </text>
        <text x="413" y="142" textAnchor="middle" fill="#D6EBE0" fontSize="11">
          Ag⁺ needs 1 F/mol · Cu²⁺ needs 2 F/mol
        </text>
        <text x="413" y="164" textAnchor="middle" fill="#7DD3FC" fontSize="11" fontWeight="700">
          Al³⁺ needs 3 F/mol to deposit 1 mole!
        </text>
      </StageShell>
    );
  }

  // 14. Petroleum, Cracking, Octane Rating & Nigerian Petrochemicals
  if (topicId === 'c-petro') {
    return (
      <StageShell
        title="Crude Oil Fractionating Column & Catalytic Cracking"
        ariaLabel="Fractionating tower from Refinery Gas under 40C at top to Bitumen above 350C at base"
        caption="Nigerian Bonny Light crude is 'sweet' (low sulphur). Fractional distillation separates by boiling point; Cracking breaks heavy gas-oil into high-demand petrol + alkenes!"
      >
        {/* Tower */}
        <rect x="34" y="18" width="166" height="174" rx="12" fill="#1B3C2E" stroke="#FFD84D" strokeWidth="2" />
        {[
          { y: 26, name: 'LPG (<40°C) · C₁–C₄', col: '#7DD3FC' },
          { y: 54, name: 'Petrol (40–200°C)', col: '#3BDC86' },
          { y: 82, name: 'Kerosene (200–250°C)', col: '#FFD84D' },
          { y: 110, name: 'Diesel (250–350°C)', col: '#F59E0B' },
          { y: 138, name: 'Lubricating Oil / Wax', col: '#FB7185' },
          { y: 164, name: 'Bitumen (>350°C · Roads)', col: '#94A3B8' },
        ].map((f) => (
          <g key={f.name}>
            <rect x="44" y={f.y} width="146" height="22" rx="5" fill="#11281E" stroke={f.col} strokeWidth="1.3" />
            <text x="117" y={f.y + 15} textAnchor="middle" fill={f.col} fontSize="10" fontWeight="800">
              {f.name}
            </text>
          </g>
        ))}

        {/* Right: Cracking & Octane */}
        <rect x="222" y="20" width="316" height="170" rx="12" fill="#1B3C2E" stroke="#2E5C48" />
        <text x="380" y="44" textAnchor="middle" fill="#FFD84D" fontSize="12.5" fontWeight="800">
          Cracking &amp; Octane Number
        </text>
        <rect x="240" y="58" width="280" height="44" rx="9" fill="#12291F" stroke="#3BDC86" />
        <text x="380" y="85" textAnchor="middle" fill="#F5FBF7" fontSize="13.5" fontWeight="800">
          C₁₂H₂₆ → C₈H₁₈ (Petrol) + 2 C₂H₄ (Ethene)
        </text>
        <text x="380" y="126" textAnchor="middle" fill="#7DD3FC" fontSize="11.5" fontWeight="700">
          0 = n-Heptane (knocks badly) · 100 = Iso-octane
        </text>
        <text x="380" y="150" textAnchor="middle" fill="#3BDC86" fontSize="11.5" fontWeight="700">
          Reforming converts straight chains → branched/aromatic
        </text>
        <text x="380" y="172" textAnchor="middle" fill="#D6EBE0" fontSize="10.5">
          Nigerian Hubs: Port Harcourt, Warri, Kaduna, Dangote Lekki
        </text>
      </StageShell>
    );
  }

  // 15. Hydrocarbons, Functional Groups & Macromolecules
  if (topicId === 'c-hydro' || topicId === 'c-func' || topicId === 'c-poly') {
    return (
      <StageShell
        title="Organic Functional Group Conversion & Polymer Map"
        ariaLabel="Reaction pathway from Alkene to Alkanol, Alkanal, Alkanoic Acid, Ester, and Soap saponification"
        caption="Unsaturated alkenes/alkynes decolourise reddish-brown Br₂ water; terminal alkynes give a pale-yellow/white precipitate with ammoniacal AgNO₃!"
      >
        {[
          { x: 12, t: 'Alkene', sub: 'C=C (sp²)', c: '#7DD3FC' },
          { x: 121, t: '1° Alkanol', sub: 'R–CH₂OH', c: '#3BDC86' },
          { x: 230, t: 'Alkanal', sub: 'R–CHO', c: '#FFD84D' },
          { x: 339, t: 'Alkanoic', sub: 'R–COOH', c: '#FF8A73' },
          { x: 448, t: 'Ester', sub: 'R–COOR′', c: '#C4B5FD' },
        ].map((node, idx) => (
          <g key={node.t}>
            <rect x={node.x} y={38} width={100} height={68} rx={11} fill="#1B3C2E" stroke={node.c} strokeWidth="2" />
            <text x={node.x + 50} y={66} textAnchor="middle" fill={node.c} fontSize="12" fontWeight="800">
              {node.t}
            </text>
            <text x={node.x + 50} y={88} textAnchor="middle" fill="#F5FBF7" fontSize="11" fontWeight="700">
              {node.sub}
            </text>
            {idx < 4 && (
              <line x1={node.x + 101} y1={72} x2={node.x + 119} y2={72} stroke="#FFD84D" strokeWidth="2" markerEnd="url(#cnv-arr)" />
            )}
          </g>
        ))}
        <text x="125" y="30" textAnchor="middle" fill="#9EC4B1" fontSize="10" fontWeight="700">
          +Steam/H₃PO₄
        </text>
        <text x="288" y="30" textAnchor="middle" fill="#9EC4B1" fontSize="10" fontWeight="700">
          Acidified K₂Cr₂O₇ [O]
        </text>
        <text x="448" y="30" textAnchor="middle" fill="#9EC4B1" fontSize="10" fontWeight="700">
          +R′OH / conc. H₂SO₄
        </text>

        <rect x="24" y="124" width="514" height="62" rx="11" fill="#12291F" stroke="#2E5C48" />
        <text x="281" y="147" textAnchor="middle" fill="#FFD84D" fontSize="11.5" fontWeight="800">
          Distinguishing Tests &amp; Saponification
        </text>
        <text x="281" y="169" textAnchor="middle" fill="#D6EBE0" fontSize="11">
          Alkanal + Fehling’s → Brick-red Cu₂O · Fat/Oil + NaOH(aq) → Soap + Propane-1,2,3-triol
        </text>
      </StageShell>
    );
  }

  // 16. Metals, Non-Metals & Chemical Industries
  if (topicId === 'c-metal' || topicId === 'c-nsc' || topicId === 'c-ind') {
    return (
      <StageShell
        title="Industrial Reactor Benchmarks: Blast Furnace, Haber & Contact"
        ariaLabel="Industrial catalysts and temperatures for Iron Blast Furnace, Haber Ammonia Fe, and Contact H2SO4 V2O5"
        caption="Memorise every industrial catalyst: Finely divided Fe (Haber NH₃), V₂O₅ at 450°C (Contact H₂SO₄), Pt-Rh gauze (Ostwald HNO₃), and Ni (Oil hardening)."
      >
        <rect x="18" y="22" width="166" height="166" rx="12" fill="#1B3C2E" stroke="#FF8A73" strokeWidth="2" />
        <text x="101" y="44" textAnchor="middle" fill="#FF8A73" fontSize="12" fontWeight="800">
          Iron Blast Furnace
        </text>
        <text x="101" y="74" textAnchor="middle" fill="#F5FBF7" fontSize="10.5">
          Feed: Fe₂O₃ + Coke + CaCO₃
        </text>
        <text x="101" y="100" textAnchor="middle" fill="#FFD84D" fontSize="10.5" fontWeight="700">
          Fe₂O₃ + 3CO → 2Fe + 3CO₂
        </text>
        <text x="101" y="126" textAnchor="middle" fill="#3BDC86" fontSize="10.5">
          CaO + SiO₂ → CaSiO₃ (Slag)
        </text>
        <text x="101" y="156" textAnchor="middle" fill="#9EC4B1" fontSize="10">
          Al: Hall-Héroult in Cryolite
        </text>

        <rect x="197" y="22" width="166" height="166" rx="12" fill="#1B3C2E" stroke="#7DD3FC" strokeWidth="2" />
        <text x="280" y="44" textAnchor="middle" fill="#7DD3FC" fontSize="12" fontWeight="800">
          Haber &amp; Contact
        </text>
        <text x="280" y="76" textAnchor="middle" fill="#F5FBF7" fontSize="11" fontWeight="700">
          Haber (NH₃): Fe catalyst
        </text>
        <text x="280" y="96" textAnchor="middle" fill="#9EC4B1" fontSize="10.5">
          450°C · 200 atm · N₂ + 3H₂
        </text>
        <text x="280" y="130" textAnchor="middle" fill="#FFD84D" fontSize="11" fontWeight="700">
          Contact (H₂SO₄): V₂O₅
        </text>
        <text x="280" y="150" textAnchor="middle" fill="#9EC4B1" fontSize="10.5">
          450°C · 1–2 atm · Oleum H₂S₂O₇
        </text>

        <rect x="376" y="22" width="166" height="166" rx="12" fill="#1B3C2E" stroke="#3BDC86" strokeWidth="2" />
        <text x="459" y="44" textAnchor="middle" fill="#3BDC86" fontSize="12" fontWeight="800">
          Heavy vs Fine
        </text>
        <text x="459" y="78" textAnchor="middle" fill="#F5FBF7" fontSize="11" fontWeight="700">
          Heavy: H₂SO₄, NaOH, NH₃
        </text>
        <text x="459" y="98" textAnchor="middle" fill="#9EC4B1" fontSize="10">
          High tonnage · industrial bulk
        </text>
        <text x="459" y="132" textAnchor="middle" fill="#FFD84D" fontSize="11" fontWeight="700">
          Fine: Drugs, Dyes, Analytical
        </text>
        <text x="459" y="152" textAnchor="middle" fill="#9EC4B1" fontSize="10">
          Low volume · ultra-high purity
        </text>
      </StageShell>
    );
  }

  // 17. Nuclear Chemistry
  if (topicId === 'c-nuc') {
    return (
      <StageShell
        title="Penetrating Power & Field Deflection of α, β and γ Rays"
        ariaLabel="Alpha stopped by paper, Beta stopped by aluminium sheet, Gamma attenuated only by thick lead block"
        caption="Alpha (⁴₂He²⁺) is heavy & stopped by paper; Beta (⁰₋₁e) is stopped by 5 mm Al; Gamma (⁰₀γ) is uncharged EM radiation requiring thick lead."
      >
        <rect x="24" y="64" width="76" height="82" rx="10" fill="#12291F" stroke="#FFD84D" strokeWidth="2" />
        <text x="62" y="102" textAnchor="middle" fill="#FFD84D" fontSize="11.5" fontWeight="800">
          Nuclide
        </text>
        <text x="62" y="120" textAnchor="middle" fill="#9EC4B1" fontSize="10">
          Source
        </text>

        {/* Barriers */}
        <rect x="210" y="30" width="14" height="150" rx="3" fill="#F5FBF7" />
        <text x="217" y="22" textAnchor="middle" fill="#F5FBF7" fontSize="10.5" fontWeight="700">
          Paper
        </text>

        <rect x="340" y="30" width="20" height="150" rx="3" fill="#94A3B8" />
        <text x="350" y="22" textAnchor="middle" fill="#7DD3FC" fontSize="10.5" fontWeight="700">
          Al Sheet
        </text>

        <rect x="472" y="30" width="44" height="150" rx="4" fill="#475569" stroke="#CBD5E1" />
        <text x="494" y="22" textAnchor="middle" fill="#FFD84D" fontSize="10.5" fontWeight="700">
          Thick Pb
        </text>

        {/* Rays */}
        <line x1="100" y1="78" x2="206" y2="78" stroke="#FF8A73" strokeWidth="3.5" markerEnd="url(#cnv-arr)" />
        <text x="152" y="70" textAnchor="middle" fill="#FF8A73" fontSize="11.5" fontWeight="800">
          α (⁴₂He²⁺)
        </text>

        <line x1="100" y1="108" x2="336" y2="108" stroke="#7DD3FC" strokeWidth="2.6" markerEnd="url(#cnv-arr-cyan)" />
        <text x="278" y="100" textAnchor="middle" fill="#7DD3FC" fontSize="11.5" fontWeight="800">
          β (⁰₋₁e⁻)
        </text>

        <line x1="100" y1="138" x2="468" y2="138" stroke="#3BDC86" strokeWidth="2.4" strokeDasharray="6 3" markerEnd="url(#cnv-arr-green)" />
        <text x="412" y="130" textAnchor="middle" fill="#3BDC86" fontSize="11.5" fontWeight="800">
          γ (EM Wave)
        </text>
      </StageShell>
    );
  }

  // 18. Astronomical Chemistry & Earth's Spheres
  if (topicId === 'c-astro') {
    return (
      <StageShell
        title="Solar System Architecture (8 Planets) & Earth’s Geochemical Spheres"
        ariaLabel="Sun with 4 terrestrial inner planets, 4 gas/ice outer giants, Pluto dwarf planet note, and Earth's 3 spheres"
        caption="8 official planets orbit the Sun (Mercury → Neptune; Pluto is an IAU Dwarf Planet). Earth’s Atmosphere is 78% N₂, 21% O₂, 0.93% Ar, 0.04% CO₂."
      >
        <circle cx="28" cy="68" r="22" fill="#FFD84D" />
        <text x="28" y="72" textAnchor="middle" fill="#141C33" fontSize="10" fontWeight="900">
          SUN
        </text>
        {[
          { x: 74, r: 5, n: 'Mer', c: '#CBD5E1' },
          { x: 106, r: 7, n: 'Ven', c: '#FDE047' },
          { x: 142, r: 7.5, n: 'Ear', c: '#38BDF8' },
          { x: 178, r: 6, n: 'Mar', c: '#FB7185' },
          { x: 232, r: 16, n: 'Jup', c: '#F59E0B' },
          { x: 288, r: 13, n: 'Sat', c: '#FCD34D' },
          { x: 340, r: 10, n: 'Ura', c: '#67E8F9' },
          { x: 388, r: 10, n: 'Nep', c: '#60A5FA' },
        ].map((p) => (
          <g key={p.n}>
            <circle cx={p.x} cy="68" r={p.r} fill={p.c} />
            <text x={p.x} y="102" textAnchor="middle" fill="#E8F5EE" fontSize="10" fontWeight="700">
              {p.n}
            </text>
          </g>
        ))}
        <rect x="424" y="42" width="116" height="52" rx="9" fill="#12291F" stroke="#FF8A73" />
        <text x="482" y="64" textAnchor="middle" fill="#FF8A73" fontSize="10.5" fontWeight="800">
          Pluto = Dwarf Planet
        </text>
        <text x="482" y="82" textAnchor="middle" fill="#D6EBE0" fontSize="9.5">
          Kuiper Belt (IAU 2006)
        </text>

        <rect x="24" y="122" width="516" height="64" rx="11" fill="#1B3C2E" stroke="#2E5C48" />
        <text x="282" y="145" textAnchor="middle" fill="#3BDC86" fontSize="11.5" fontWeight="800">
          Earth’s Three Chemical Spheres
        </text>
        <text x="282" y="168" textAnchor="middle" fill="#F5FBF7" fontSize="11">
          Atmosphere (78% N₂, 21% O₂, 0.93% Ar) · Hydrosphere (97% Oceans) · Lithosphere (O &gt; Si &gt; Al &gt; Fe)
        </text>
      </StageShell>
    );
  }

  // Default / Diagnostic & Inorganic Qualitative / Air / Halogens / Pollution / Ethics
  return (
    <StageShell
      title={
        topicId === 'c-qual'
          ? 'Qualitative Ion & Gas Diagnostic Matrix'
          : topicId === 'c-ethics'
            ? 'Nigerian Regulatory Agencies & Gas Drying Agent Guide'
            : 'Core Chemical Reactions, Gas Tests & Environmental Matrix'
      }
      ariaLabel="Diagnostic summary matrix of gas tests, precipitates, drying agents, and regulatory benchmarks"
      caption={
        topicId === 'c-ethics'
          ? 'Never dry basic NH₃ with acidic conc. H₂SO₄ or fused CaCl₂ — always dry Ammonia over Quicklime (CaO)!'
          : 'Confirm every ion & gas with a specific reagent: CO₂ turns limewater milky; Cl₂ bleaches damp litmus; Cu²⁺ gives a deep-blue complex in excess NH₃(aq).'
      }
    >
      <rect x="20" y="22" width="166" height="166" rx="12" fill="#1B3C2E" stroke="#7DD3FC" strokeWidth="2" />
      <text x="103" y="44" textAnchor="middle" fill="#7DD3FC" fontSize="11.5" fontWeight="800">
        Signature Gas Tests
      </text>
      <text x="103" y="74" textAnchor="middle" fill="#F5FBF7" fontSize="10.5">
        H₂: ‘Pop’ with lighted splint
      </text>
      <text x="103" y="98" textAnchor="middle" fill="#F5FBF7" fontSize="10.5">
        O₂: Relights glowing splint
      </text>
      <text x="103" y="122" textAnchor="middle" fill="#FFD84D" fontSize="10.5" fontWeight="700">
        CO₂: Limewater milky
      </text>
      <text x="103" y="146" textAnchor="middle" fill="#3BDC86" fontSize="10.5" fontWeight="700">
        SO₂: K₂Cr₂O₇ orange → green
      </text>
      <text x="103" y="170" textAnchor="middle" fill="#FF8A73" fontSize="10.5">
        Cl₂: Bleaches damp litmus
      </text>

      <rect x="197" y="22" width="166" height="166" rx="12" fill="#1B3C2E" stroke="#FFD84D" strokeWidth="2" />
      <text x="280" y="44" textAnchor="middle" fill="#FFD84D" fontSize="11.5" fontWeight="800">
        Cation &amp; Anion Keys
      </text>
      <text x="280" y="74" textAnchor="middle" fill="#7DD3FC" fontSize="10.5" fontWeight="700">
        Cu²⁺: Deep-blue in excess NH₃
      </text>
      <text x="280" y="98" textAnchor="middle" fill="#3BDC86" fontSize="10.5">
        Zn²⁺: Soluble in both excesses
      </text>
      <text x="280" y="122" textAnchor="middle" fill="#FF8A73" fontSize="10.5">
        Fe³⁺: Reddish-brown ppt
      </text>
      <text x="280" y="146" textAnchor="middle" fill="#F5FBF7" fontSize="10.5">
        SO₄²⁻: HCl + BaCl₂ white ppt
      </text>
      <text x="280" y="170" textAnchor="middle" fill="#FFD84D" fontSize="10.5">
        NO₃⁻: Brown-ring FeSO₄/H₂SO₄
      </text>

      <rect x="374" y="22" width="166" height="166" rx="12" fill="#1B3C2E" stroke="#3BDC86" strokeWidth="2" />
      <text x="457" y="44" textAnchor="middle" fill="#3BDC86" fontSize="11.5" fontWeight="800">
        Safety &amp; Environment
      </text>
      <text x="457" y="76" textAnchor="middle" fill="#FFD84D" fontSize="10.5" fontWeight="700">
        Dry NH₃ ONLY with CaO
      </text>
      <text x="457" y="102" textAnchor="middle" fill="#F5FBF7" fontSize="10.5">
        NAFDAC: Food, Drugs &amp; Water
      </text>
      <text x="457" y="126" textAnchor="middle" fill="#F5FBF7" fontSize="10.5">
        SON: Industrial NIS Standards
      </text>
      <text x="457" y="150" textAnchor="middle" fill="#7DD3FC" fontSize="10.5">
        NESREA: Effluents &amp; Air
      </text>
      <text x="457" y="172" textAnchor="middle" fill="#FF8A73" fontSize="10">
        CFCs → Cl• destroys O₃ ozone
      </text>
    </StageShell>
  );
}
