import React from 'react';

interface VisualMeta {
  title: string;
  caption: string;
  render: () => React.ReactNode;
}

function SoilHorizonSvg() {
  return (
    <svg viewBox="0 0 560 220" className="w-full h-auto max-w-[540px] mx-auto block" role="img" aria-label="Soil profile horizons O, A, B, C, and D bedrock">
      <rect x="44" y="18" width="190" height="24" rx="4" fill="#234F37" stroke="#6EE7B7" strokeWidth="1.4" />
      <rect x="44" y="42" width="190" height="44" fill="#3B2B1E" stroke="#FBBF24" strokeWidth="1.4" />
      <rect x="44" y="86" width="190" height="46" fill="#7C4A24" stroke="#F59E0B" strokeWidth="1.4" />
      <rect x="44" y="132" width="190" height="38" fill="#6B5B4B" stroke="#CBD5E1" strokeWidth="1.4" />
      <rect x="44" y="170" width="190" height="34" rx="4" fill="#334155" stroke="#94A3B8" strokeWidth="1.4" />

      {/* Root penetration */}
      <path d="M138 18 V76 M138 48 L114 70 M138 56 L166 78 M138 74 L128 102" stroke="#6EE7B7" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* Parent rock fragments in C */}
      <polygon points="72,144 92,140 96,158 76,162" fill="#94A3B8" opacity="0.55" />
      <polygon points="154,142 180,146 172,162 148,158" fill="#94A3B8" opacity="0.55" />

      {/* Labels */}
      <g fontFamily="var(--body)" fontSize="12.5" fill="#F4F8F5">
        <line x1="238" y1="30" x2="268" y2="30" stroke="#6EE7B7" strokeWidth="1.4" />
        <text x="276" y="34" fontWeight="700" fill="#6EE7B7">O Horizon — Organic litter &amp; leaf mould</text>

        <line x1="238" y1="64" x2="268" y2="64" stroke="#FBBF24" strokeWidth="1.4" />
        <text x="276" y="68" fontWeight="700" fill="#FDE68A">A Horizon — Humus-rich topsoil (eluvial zone)</text>

        <line x1="238" y1="109" x2="268" y2="109" stroke="#F59E0B" strokeWidth="1.4" />
        <text x="276" y="113" fontWeight="700" fill="#FCD34D">B Horizon — Subsoil clay &amp; iron accumulation</text>

        <line x1="238" y1="151" x2="268" y2="151" stroke="#CBD5E1" strokeWidth="1.4" />
        <text x="276" y="155" fontWeight="600" fill="#E2E8F0">C Horizon — Weathered regolith / parent material</text>

        <line x1="238" y1="187" x2="268" y2="187" stroke="#94A3B8" strokeWidth="1.4" />
        <text x="276" y="191" fontWeight="600" fill="#CBD5E1">D / R Horizon — Unweathered consolidated bedrock</text>
      </g>
    </svg>
  );
}

function NitrogenRhizobiumSvg() {
  return (
    <svg viewBox="0 0 560 220" className="w-full h-auto max-w-[540px] mx-auto block" role="img" aria-label="Agricultural nitrogen cycle showing Rhizobium fixation, nitrification, and denitrification">
      <defs>
        <marker id="agArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#FFC531" />
        </marker>
      </defs>

      <rect x="195" y="14" width="170" height="36" rx="10" fill="#24493B" stroke="#8CCBFF" strokeWidth="1.6" />
      <text x="280" y="36" textAnchor="middle" fill="#E0F2FE" fontSize="13" fontWeight="700">Atmospheric N₂ (78%)</text>

      <rect x="26" y="92" width="158" height="44" rx="10" fill="#24493B" stroke="#3BDC86" strokeWidth="1.6" />
      <text x="105" y="111" textAnchor="middle" fill="#6EE7B7" fontSize="12.5" fontWeight="700">Legume Root Nodules</text>
      <text x="105" y="127" textAnchor="middle" fill="#D1FAE5" fontSize="11">Rhizobium + Azotobacter</text>

      <rect x="196" y="160" width="168" height="42" rx="10" fill="#24493B" stroke="#FFC531" strokeWidth="1.6" />
      <text x="280" y="179" textAnchor="middle" fill="#FDE68A" fontSize="12.5" fontWeight="700">Ammonium (NH₄⁺)</text>
      <text x="280" y="194" textAnchor="middle" fill="#E2E8F0" fontSize="11">Nitrosomonas → NO₂⁻</text>

      <rect x="380" y="92" width="156" height="44" rx="10" fill="#24493B" stroke="#3BDC86" strokeWidth="1.6" />
      <text x="458" y="111" textAnchor="middle" fill="#6EE7B7" fontSize="12.5" fontWeight="700">Soil Nitrate (NO₃⁻)</text>
      <text x="458" y="127" textAnchor="middle" fill="#D1FAE5" fontSize="11">Nitrobacter · Root uptake</text>

      {/* Cycle arrows */}
      <path d="M195 34 Q 108 42 105 88" fill="none" stroke="#FFC531" strokeWidth="2" markerEnd="url(#agArr)" />
      <text x="116" y="56" fill="#FDE68A" fontSize="11" fontWeight="700">N-Fixation</text>

      <path d="M115 138 Q 140 178 192 181" fill="none" stroke="#FFC531" strokeWidth="2" markerEnd="url(#agArr)" />
      <text x="132" y="176" fill="#CBD5E1" fontSize="10.5">Ammonification</text>

      <path d="M366 181 Q 434 176 454 140" fill="none" stroke="#FFC531" strokeWidth="2" markerEnd="url(#agArr)" />
      <text x="424" y="176" fill="#6EE7B7" fontSize="10.5" fontWeight="700">Nitrification</text>

      <path d="M456 88 Q 446 40 370 34" fill="none" stroke="#FF8A73" strokeWidth="1.8" strokeDasharray="5 4" markerEnd="url(#agArr)" />
      <text x="442" y="54" fill="#FCA5A5" fontSize="10.5" fontWeight="700">Pseudomonas loss</text>
    </svg>
  );
}

function CropRotationMatrixSvg() {
  return (
    <svg viewBox="0 0 560 214" className="w-full h-auto max-w-[540px] mx-auto block" role="img" aria-label="Four-year four-plot crop rotation matrix separating shallow cereals, deep tubers, and nitrogen-fixing legumes">
      <rect x="28" y="18" width="504" height="178" rx="12" fill="#1C3D31" stroke="#33604E" strokeWidth="1.5" />
      <g fontFamily="var(--body)" fontSize="12" fill="#F4F8F5">
        <text x="92" y="42" fontWeight="700" fill="#FFC531" textAnchor="middle">Cycle Stage</text>
        <text x="210" y="42" fontWeight="700" fill="#FFC531" textAnchor="middle">Plot I</text>
        <text x="318" y="42" fontWeight="700" fill="#FFC531" textAnchor="middle">Plot II</text>
        <text x="426" y="42" fontWeight="700" fill="#FFC531" textAnchor="middle">Plot III / IV</text>

        <line x1="44" y1="52" x2="516" y2="52" stroke="#33604E" strokeWidth="1.2" />

        {[
          { y: 78, yr: 'Year 1', p1: 'Yam (Deep root)', p2: 'Cowpea (Legume)', p3: 'Maize → Cassava' },
          { y: 112, yr: 'Year 2', p1: 'Cowpea (Fixes N)', p2: 'Maize (Shallow)', p3: 'Cassava → Yam' },
          { y: 146, yr: 'Year 3', p1: 'Maize (Uses N)', p2: 'Cassava (Feeder)', p3: 'Yam → Cowpea' },
          { y: 180, yr: 'Year 4', p1: 'Cassava (Rest)', p2: 'Yam (Deep root)', p3: 'Cowpea → Maize' },
        ].map((row) => (
          <g key={row.yr}>
            <text x="92" y={row.y} fontWeight="700" fill="#8CCBFF" textAnchor="middle">{row.yr}</text>
            <text x="210" y={row.y} textAnchor="middle" fill="#E2E8F0">{row.p1}</text>
            <text x="318" y={row.y} textAnchor="middle" fill="#6EE7B7">{row.p2}</text>
            <text x="426" y={row.y} textAnchor="middle" fill="#FDE68A">{row.p3}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function RuminantDigestionSvg() {
  return (
    <svg viewBox="0 0 560 216" className="w-full h-auto max-w-[540px] mx-auto block" role="img" aria-label="Ruminant four-chamber stomach flow from rumen and reticulum to omasum and true abomasum">
      <defs>
        <marker id="rumArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#3BDC86" />
        </marker>
      </defs>

      <rect x="24" y="54" width="114" height="84" rx="16" fill="#24493B" stroke="#3BDC86" strokeWidth="1.8" />
      <text x="81" y="84" textAnchor="middle" fill="#6EE7B7" fontSize="13" fontWeight="700">1. Rumen</text>
      <text x="81" y="103" textAnchor="middle" fill="#D1FAE5" fontSize="10.5">Largest chamber</text>
      <text x="81" y="119" textAnchor="middle" fill="#D1FAE5" fontSize="10.5">Cellulase microbes</text>

      <rect x="164" y="54" width="114" height="84" rx="16" fill="#24493B" stroke="#8CCBFF" strokeWidth="1.8" />
      <text x="221" y="84" textAnchor="middle" fill="#BAE6FD" fontSize="13" fontWeight="700">2. Reticulum</text>
      <text x="221" y="103" textAnchor="middle" fill="#E0F2FE" fontSize="10.5">Honeycomb wall</text>
      <text x="221" y="119" textAnchor="middle" fill="#E0F2FE" fontSize="10.5">Regurgitates cud</text>

      <rect x="304" y="54" width="108" height="84" rx="16" fill="#24493B" stroke="#FFC531" strokeWidth="1.8" />
      <text x="358" y="84" textAnchor="middle" fill="#FDE68A" fontSize="13" fontWeight="700">3. Omasum</text>
      <text x="358" y="103" textAnchor="middle" fill="#FEF3C7" fontSize="10.5">Manyplies folds</text>
      <text x="358" y="119" textAnchor="middle" fill="#FEF3C7" fontSize="10.5">Absorbs H₂O</text>

      <rect x="436" y="54" width="104" height="84" rx="16" fill="#24493B" stroke="#FF8A73" strokeWidth="1.8" />
      <text x="488" y="84" textAnchor="middle" fill="#FECACA" fontSize="13" fontWeight="700">4. Abomasum</text>
      <text x="488" y="103" textAnchor="middle" fill="#FEE2E2" fontSize="10.5">True stomach</text>
      <text x="488" y="119" textAnchor="middle" fill="#FEE2E2" fontSize="10.5">HCl + Pepsin</text>

      <line x1="138" y1="96" x2="160" y2="96" stroke="#3BDC86" strokeWidth="2.2" markerEnd="url(#rumArr)" />
      <line x1="278" y1="96" x2="300" y2="96" stroke="#3BDC86" strokeWidth="2.2" markerEnd="url(#rumArr)" />
      <line x1="412" y1="96" x2="432" y2="96" stroke="#3BDC86" strokeWidth="2.2" markerEnd="url(#rumArr)" />

      <path d="M221 52 Q 150 14 81 52" fill="none" stroke="#FFC531" strokeWidth="1.6" strokeDasharray="5 4" markerEnd="url(#rumArr)" />
      <text x="152" y="26" textAnchor="middle" fill="#FDE68A" fontSize="11" fontWeight="700">Cud chewing &amp; saliva buffering loop</text>
      <text x="280" y="176" textAnchor="middle" fill="#B9CCC1" fontSize="11.5">
        Contrast with Poultry (Monogastric): Crop (storage) → Proventriculus (enzymes) → Muscular Gizzard (grit grinding)
      </text>
    </svg>
  );
}

function PearsonSquareSvg() {
  return (
    <svg viewBox="0 0 560 220" className="w-full h-auto max-w-[540px] mx-auto block" role="img" aria-label="Pearson Square ration formulation showing Maize 10% CP and Groundnut Cake 45% CP balanced to 18% CP">
      <rect x="190" y="42" width="160" height="128" rx="8" fill="#1C3D31" stroke="#FFC531" strokeWidth="2" />
      <line x1="198" y1="50" x2="342" y2="162" stroke="#8CCBFF" strokeWidth="1.8" strokeDasharray="5 4" />
      <line x1="198" y1="162" x2="342" y2="50" stroke="#3BDC86" strokeWidth="1.8" strokeDasharray="5 4" />

      <circle cx="270" cy="106" r="24" fill="#24493B" stroke="#FFC531" strokeWidth="2" />
      <text x="270" y="103" textAnchor="middle" fill="#FFC531" fontSize="13" fontWeight="800">18%</text>
      <text x="270" y="117" textAnchor="middle" fill="#E2E8F0" fontSize="9.5">Target CP</text>

      <text x="176" y="48" textAnchor="end" fill="#BAE6FD" fontSize="12.5" fontWeight="700">Maize (10% CP)</text>
      <text x="176" y="168" textAnchor="end" fill="#6EE7B7" fontSize="12.5" fontWeight="700">GNC (45% CP)</text>

      <text x="364" y="48" fill="#6EE7B7" fontSize="12.5" fontWeight="700">|45 − 18| = 27 parts Maize (77.1%)</text>
      <text x="364" y="168" fill="#BAE6FD" fontSize="12.5" fontWeight="700">|18 − 10| = 8 parts GNC (22.9%)</text>
      <text x="270" y="198" textAnchor="middle" fill="#FDE68A" fontSize="12" fontWeight="700">
        Total = 35 parts · Diagonal subtraction guarantees exact 18.0% Crude Protein ration
      </text>
    </svg>
  );
}

function FishPondSvg() {
  return (
    <svg viewBox="0 0 560 214" className="w-full h-auto max-w-[540px] mx-auto block" role="img" aria-label="Earthen fishpond cross-section showing screened inlet, fertilized water column, dyke embankment, and monk outlet">
      {/* Screened inlet pipe */}
      <rect x="28" y="48" width="76" height="14" rx="3" fill="#64748B" stroke="#CBD5E1" strokeWidth="1.4" />
      <text x="66" y="40" textAnchor="middle" fill="#BAE6FD" fontSize="11.5" fontWeight="700">Screened Inlet</text>

      {/* Water body */}
      <path d="M88 76 H430 L404 166 H114 Z" fill="#0EA5E9" fillOpacity="0.28" stroke="#38BDF8" strokeWidth="1.6" />
      <text x="256" y="114" textAnchor="middle" fill="#E0F2FE" fontSize="12.5" fontWeight="700">Secchi Transparency 30–40 cm · DO ≥ 5 mg/L · pH 6.5–8.5</text>
      <text x="256" y="136" textAnchor="middle" fill="#6EE7B7" fontSize="11.5">Phytoplankton bloom + Clarias / Oreochromis polyculture</text>

      {/* Clay core dyke */}
      <polygon points="430,58 492,58 524,174 404,174" fill="#7C4A24" stroke="#FBBF24" strokeWidth="1.6" />
      <text x="466" y="124" textAnchor="middle" fill="#FDE68A" fontSize="11.5" fontWeight="700">Compacted</text>
      <text x="466" y="139" textAnchor="middle" fill="#FDE68A" fontSize="11.5" fontWeight="700">Clay Dyke</text>

      {/* Monk drainage */}
      <rect x="386" y="54" width="16" height="114" fill="#334155" stroke="#FFC531" strokeWidth="1.6" />
      <text x="394" y="44" textAnchor="middle" fill="#FFC531" fontSize="11.5" fontWeight="700">Monk Outlet</text>
    </svg>
  );
}

const AGRIC_VISUAL_BY_TOPIC: Record<string, VisualMeta> = {
  ag04: {
    title: 'Soil Horizon Profile (O – A – B – C – D)',
    caption: 'Feeder roots concentrate in the dark humus-rich A-horizon while leached clay and iron oxides accumulate in the B-horizon.',
    render: () => <SoilHorizonSvg />,
  },
  ag05: {
    title: 'Soil Texture & Structure Matrix',
    caption: 'Loam balances sand drainage, silt moisture retention, and clay cation exchange capacity inside stable crumb peds.',
    render: () => <SoilHorizonSvg />,
  },
  ag06: {
    title: 'Biological Nitrogen Fixation & Soil N-Cycle',
    caption: 'Symbiotic Rhizobium in legume nodules fixes atmospheric N₂, Nitrosomonas oxidizes NH₄⁺ to NO₂⁻, and Nitrobacter forms plant-ready NO₃⁻.',
    render: () => <NitrogenRhizobiumSvg />,
  },
  ag11: {
    title: 'Four-Course Crop Rotation Principle',
    caption: 'Alternating deep-rooted tubers, nitrogen-fixing legumes, and shallow-rooted cereals breaks pest cycles and restores topsoil nitrogen.',
    render: () => <CropRotationMatrixSvg />,
  },
  ag19: {
    title: 'Ruminant Polygastric vs Monogastric Digestion',
    caption: 'Cattle ferment cellulose microbially in the rumen before true enzymatic digestion in the abomasum.',
    render: () => <RuminantDigestionSvg />,
  },
  ag20: {
    title: 'Pearson Square Feed Ration Formulation',
    caption: 'Subtracting diagonally across the target crude protein percentage yields exact parts of basal energy grain and protein concentrate.',
    render: () => <PearsonSquareSvg />,
  },
  ag23: {
    title: 'Earthen Fishpond Engineering & Water Quality',
    caption: 'Compacted clay dykes, screened inlets, and monk boards regulate pond depth, dissolved oxygen, and plankton productivity.',
    render: () => <FishPondSvg />,
  },
};

export function AgricNoteVisuals({ topicId }: { topicId: string }) {
  // Map remaining topics to the closest agronomic visual archetype so every Agricultural Science note gets a sharp diagram
  const num = Number(topicId.replace(/\D/g, '')) || 1;
  const fallbackKey =
    num <= 5
      ? 'ag04'
      : num <= 10
        ? 'ag06'
        : num <= 18
          ? 'ag11'
          : num === 20
            ? 'ag20'
            : num <= 22
              ? 'ag19'
              : num === 23
                ? 'ag23'
                : 'ag20';

  const spec = AGRIC_VISUAL_BY_TOPIC[topicId] || AGRIC_VISUAL_BY_TOPIC[fallbackKey];
  if (!spec) return null;

  return (
    <figure className="fig anim-rise">
      <div className="flex items-center justify-between gap-2 px-1 pb-1">
        <span className="text-[12px] font-bold text-[#FFC531]">
          Farm diagram · {spec.title}
        </span>
      </div>
      {spec.render()}
      <figcaption>{spec.caption}</figcaption>
    </figure>
  );
}
