import React from 'react';
import { PHYS_NERDC_MAP } from '../data/physNerdc2027';

function PhysPlateShell({
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
    <figure className="rounded-2xl bg-[#13293D] border border-[#244B6E] overflow-hidden shadow-[0_3px_0_#0B1926]">
      <div className="px-4 py-2.5 bg-[#0E2030] border-b border-[#214363] flex items-center justify-between gap-3">
        <span className="text-[12px] font-bold tracking-wide text-[#FFD84D] truncate">
          {title}
        </span>
        <span className="text-[11px] font-semibold text-[#9CC5E8] whitespace-nowrap shrink-0">
          Physics Diagram Plate
        </span>
      </div>
      <div className="p-3 sm:p-4 flex items-center justify-center bg-[#13293D]">
        <svg
          viewBox="0 0 560 200"
          role="img"
          aria-label={ariaLabel}
          className="w-full max-w-[560px] h-auto block select-none"
        >
          <defs>
            <marker id="pnv-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#FFD84D" />
            </marker>
            <marker id="pnv-cyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38BDF8" />
            </marker>
            <marker id="pnv-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#34D399" />
            </marker>
          </defs>
          {children}
        </svg>
      </div>
      <figcaption className="px-4 py-2.5 bg-[#0F2233] border-t border-[#214363] text-[12.5px] leading-snug text-[#D6E8F8]">
        {caption}
      </figcaption>
    </figure>
  );
}

export function PhysNoteVisual({
  topicId,
  partIdx = 0,
}: {
  topicId: string;
  partIdx?: number;
}) {
  const domain = PHYS_NERDC_MAP[topicId]?.domain || 'mechanics';

  if (domain === 'mechanics') {
    return partIdx === 0 ? (
      <PhysPlateShell
        title="Vector Resolution, Trajectory & Equilibrium"
        ariaLabel="Diagram resolving vector F into horizontal F cos theta and vertical F sin theta components alongside parabolic flight"
        caption="Always resolve oblique forces or velocities into perpendicular horizontal (cos θ) and vertical (sin θ) components before applying ΣF = ma."
      >
        {/* Left: Force / Velocity resolution */}
        <line x1="45" y1="160" x2="225" y2="160" stroke="#9CC5E8" strokeWidth="2" markerEnd="url(#pnv-cyan)" />
        <line x1="45" y1="160" x2="45" y2="35" stroke="#9CC5E8" strokeWidth="2" markerEnd="url(#pnv-cyan)" />
        <line x1="45" y1="160" x2="195" y2="62" stroke="#FFD84D" strokeWidth="3.2" markerEnd="url(#pnv-arr)" />
        <line x1="195" y1="62" x2="195" y2="160" stroke="#34D399" strokeDasharray="5 4" strokeWidth="1.8" />
        <path d="M90 160 A45 45 0 0 0 82 136" fill="none" stroke="#FFD84D" strokeWidth="2" />
        <text x="98" y="150" fill="#FFD84D" fontSize="12" fontWeight="700">θ</text>
        <text x="120" y="96" fill="#FFD84D" fontSize="13" fontWeight="800">F (or U)</text>
        <text x="120" y="182" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="700">Fx = F cos θ</text>
        <text x="204" y="116" fill="#34D399" fontSize="12" fontWeight="700">Fy = F sin θ</text>

        {/* Right: Moment / Trajectory balance */}
        <line x1="290" y1="158" x2="530" y2="158" stroke="#64748B" strokeWidth="2.5" />
        <path d="M300 158 Q410 24 520 158" fill="none" stroke="#34D399" strokeWidth="3" />
        <line x1="410" y1="91" x2="410" y2="158" stroke="#FFD84D" strokeDasharray="4 4" strokeWidth="2" />
        <text x="418" y="128" fill="#FFD84D" fontSize="11.5" fontWeight="700">H_max</text>
        <text x="410" y="180" textAnchor="middle" fill="#E2E8F0" fontSize="11.5" fontWeight="700">Range R = U² sin 2θ / g</text>
      </PhysPlateShell>
    ) : (
      <PhysPlateShell
        title="Principle of Moments & Energy Conservation"
        ariaLabel="Uniform metre rule balanced on knife-edge pivot showing clockwise and anticlockwise moments"
        caption="In rotational equilibrium, sum of anticlockwise moments (F₁d₁) equals sum of clockwise moments (F₂d₂), with a uniform rule's weight acting at 50 cm."
      >
        <rect x="80" y="88" width="400" height="14" rx="4" fill="#38BDF8" fillOpacity="0.28" stroke="#38BDF8" strokeWidth="2" />
        <polygon points="260,102 246,132 274,132" fill="#FFD84D" />
        <line x1="140" y1="102" x2="140" y2="156" stroke="#FF8A73" strokeWidth="2.8" markerEnd="url(#pnv-arr)" />
        <line x1="390" y1="102" x2="390" y2="156" stroke="#34D399" strokeWidth="2.8" markerEnd="url(#pnv-green)" />
        <text x="140" y="175" textAnchor="middle" fill="#FF8A73" fontSize="12" fontWeight="800">F₁ (Anticlockwise)</text>
        <text x="390" y="175" textAnchor="middle" fill="#34D399" fontSize="12" fontWeight="800">F₂ (Clockwise)</text>
        <text x="200" y="76" textAnchor="middle" fill="#E2E8F0" fontSize="12" fontWeight="700">← d₁ →</text>
        <text x="325" y="76" textAnchor="middle" fill="#E2E8F0" fontSize="12" fontWeight="700">← d₂ →</text>
        <text x="260" y="152" textAnchor="middle" fill="#FFD84D" fontSize="11.5" fontWeight="700">Pivot: F₁d₁ = F₂d₂</text>
      </PhysPlateShell>
    );
  }

  if (domain === 'thermal') {
    return (
      <PhysPlateShell
        title="Heating Curve, Phase Plateaus & Kelvin Gas Scale"
        ariaLabel="Temperature versus heat added graph showing constant-temperature melting and boiling plateaus"
        caption="Sloped segments follow Q = mcΔθ (kinetic energy rises); flat phase plateaus follow Q = mL at constant melting/boiling temperature."
      >
        <line x1="56" y1="166" x2="516" y2="166" stroke="#9CC5E8" strokeWidth="2" markerEnd="url(#pnv-cyan)" />
        <line x1="56" y1="166" x2="56" y2="26" stroke="#9CC5E8" strokeWidth="2" markerEnd="url(#pnv-cyan)" />
        <polyline
          points="66,154 136,122 226,122 326,64 436,64 496,34"
          fill="none"
          stroke="#FFD84D"
          strokeWidth="3.2"
        />
        <text x="181" y="113" textAnchor="middle" fill="#34D399" fontSize="11.5" fontWeight="700">Melt: Q = mLf (0 °C)</text>
        <text x="381" y="54" textAnchor="middle" fill="#38BDF8" fontSize="11.5" fontWeight="700">Boil: Q = mLv (100 °C)</text>
        <text x="285" y="106" fill="#E2E8F0" fontSize="11.5" fontWeight="700">Water: Q = mcΔθ</text>
        <text x="286" y="188" textAnchor="middle" fill="#9CC5E8" fontSize="11.5">Heat Energy Supplied Q (J) · Always use T(K) = θ(°C) + 273 in Gas Laws</text>
      </PhysPlateShell>
    );
  }

  if (domain === 'waves') {
    return (
      <PhysPlateShell
        title="Wave Profile, Refraction & Principal Focus Ray Geometry"
        ariaLabel="Sinusoidal wave showing wavelength and amplitude beside converging lens ray focus"
        caption="Wave speed v = fλ; for thin lenses and spherical mirrors 1/f = 1/u + 1/v under the Real-is-Positive sign convention."
      >
        {/* Left: Wave */}
        <line x1="30" y1="102" x2="264" y2="102" stroke="#64748B" strokeWidth="1.8" />
        <path
          d="M36 102 Q64 38 92 102 T148 102 T204 102 T260 102"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="3"
        />
        <line x1="64" y1="70" x2="176" y2="70" stroke="#FFD84D" strokeWidth="2" markerEnd="url(#pnv-arr)" markerStart="url(#pnv-arr)" />
        <text x="120" y="60" textAnchor="middle" fill="#FFD84D" fontSize="12" fontWeight="800">Wavelength λ (v = fλ)</text>

        {/* Right: Converging lens */}
        <line x1="295" y1="102" x2="535" y2="102" stroke="#64748B" strokeWidth="1.8" />
        <ellipse cx="415" cy="102" rx="10" ry="56" fill="#38BDF8" fillOpacity="0.22" stroke="#38BDF8" strokeWidth="2.2" />
        <line x1="325" y1="102" x2="325" y2="62" stroke="#34D399" strokeWidth="3" markerEnd="url(#pnv-green)" />
        <polyline points="325,62 415,62 505,134" fill="none" stroke="#FFD84D" strokeWidth="2" />
        <line x1="325" y1="62" x2="505" y2="134" stroke="#FFD84D" strokeWidth="2" strokeDasharray="4 3" />
        <line x1="505" y1="102" x2="505" y2="134" stroke="#FF8A73" strokeWidth="3" />
        <text x="460" y="96" fill="#FFD84D" fontSize="11.5" fontWeight="700">F</text>
        <text x="415" y="182" textAnchor="middle" fill="#E2E8F0" fontSize="11.5" fontWeight="700">1/f = 1/u + 1/v · m = v/u</text>
      </PhysPlateShell>
    );
  }

  if (domain === 'electricity') {
    return (
      <PhysPlateShell
        title="EMF, Fields, Induction & RLC Phasor Triangle"
        ariaLabel="DC circuit with internal resistance r beside AC impedance right-angled triangle"
        caption="DC cell terminal p.d. V = E − Ir; in series AC circuits, impedance Z = √[R² + (XL − XC)²] with resonance at XL = XC."
      >
        {/* Left: EMF + internal r */}
        <rect x="44" y="42" width="210" height="116" rx="8" fill="none" stroke="#9CC5E8" strokeWidth="2.2" />
        <rect x="108" y="32" width="84" height="22" rx="4" fill="#1E3A5F" stroke="#FFD84D" strokeWidth="1.8" />
        <text x="150" y="47" textAnchor="middle" fill="#FFD84D" fontSize="11" fontWeight="700">Cell (E, r)</text>
        <rect x="112" y="146" width="76" height="22" rx="4" fill="#1E3A5F" stroke="#34D399" strokeWidth="2" />
        <text x="150" y="161" textAnchor="middle" fill="#34D399" fontSize="11.5" fontWeight="700">Load R</text>
        <text x="150" y="188" textAnchor="middle" fill="#E2E8F0" fontSize="11.5" fontWeight="700">E = I(R + r) = V + Ir</text>

        {/* Right: Impedance triangle */}
        <polygon points="320,152 480,152 480,54" fill="#38BDF8" fillOpacity="0.14" stroke="#38BDF8" strokeWidth="2.4" />
        <text x="400" y="172" textAnchor="middle" fill="#34D399" fontSize="12" fontWeight="800">Resistance R</text>
        <text x="490" y="108" fill="#FF8A73" fontSize="12" fontWeight="800">XL − XC</text>
        <text x="385" y="94" fill="#FFD84D" fontSize="12.5" fontWeight="800">Impedance Z</text>
        <text x="352" y="145" fill="#E2E8F0" fontSize="11.5">φ</text>
      </PhysPlateShell>
    );
  }

  // Modern & Electronics
  return (
    <PhysPlateShell
      title="Quantum Transitions, Half-Life Decay & Digital Gates"
      ariaLabel="Bohr atomic energy levels emitting photon hf alongside exponential radioactive half-life curve"
      caption="Photon energy ΔE = hf = hc/λ; Einstein photoelectric KEmax = hf − W₀; radioactive undecayed nuclei N = N₀(½)ⁿ."
    >
      {/* Left: Energy levels */}
      <line x1="48" y1="44" x2="215" y2="44" stroke="#38BDF8" strokeWidth="2.5" />
      <line x1="48" y1="88" x2="215" y2="88" stroke="#38BDF8" strokeWidth="2.5" />
      <line x1="48" y1="152" x2="215" y2="152" stroke="#34D399" strokeWidth="3" />
      <line x1="125" y1="44" x2="125" y2="148" stroke="#FFD84D" strokeWidth="2.8" markerEnd="url(#pnv-arr)" />
      <path d="M130 96 Q145 86 160 96 T190 96" fill="none" stroke="#FFD84D" strokeWidth="2.2" markerEnd="url(#pnv-arr)" />
      <text x="196" y="100" fill="#FFD84D" fontSize="12" fontWeight="800">hf = E₂ − E₁</text>
      <text x="52" y="172" fill="#E2E8F0" fontSize="11.5">Ground E₁</text>

      {/* Right: Half-life decay */}
      <line x1="305" y1="158" x2="525" y2="158" stroke="#9CC5E8" strokeWidth="2" />
      <line x1="305" y1="158" x2="305" y2="34" stroke="#9CC5E8" strokeWidth="2" />
      <path d="M305 42 Q365 118 515 150" fill="none" stroke="#FF8A73" strokeWidth="3" />
      <line x1="305" y1="100" x2="365" y2="100" stroke="#FFD84D" strokeDasharray="4 3" strokeWidth="1.6" />
      <line x1="365" y1="100" x2="365" y2="158" stroke="#FFD84D" strokeDasharray="4 3" strokeWidth="1.6" />
      <text x="282" y="104" fill="#FFD84D" fontSize="11" fontWeight="700">N₀/2</text>
      <text x="365" y="176" textAnchor="middle" fill="#FFD84D" fontSize="11.5" fontWeight="700">T½</text>
      <text x="445" y="82" fill="#E2E8F0" fontSize="12" fontWeight="700">N = N₀(½)ⁿ</text>
    </PhysPlateShell>
  );
}
