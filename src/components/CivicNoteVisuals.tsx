import React from 'react';

export function CivicNoteVisual({ topicId }: { topicId: string; partIdx?: number }) {
  // 1. Traffic Regulations & Road Safety (FRSC Geometry)
  if (/traffic/i.test(topicId)) {
    return (
      <figure className="rounded-2xl bg-[#11261D] border border-[#254A3A] p-4 flex flex-col gap-2.5 overflow-hidden">
        <div className="flex items-center justify-between gap-2 text-[11.5px] font-bold text-[#9ED6B5]">
          <span>Highway Code Geometry: Regulatory Circles, Warning Triangles &amp; Informative Rectangles</span>
          <span className="text-[#FFD84D]">Conceptual Diagram Guide</span>
        </div>
        <svg
          viewBox="0 0 640 194"
          className="w-full h-auto rounded-xl bg-[#0D1F17]"
          role="img"
          aria-label="Road sign geometry diagram showing regulatory circles, warning triangles, and informative rectangles"
        >
          <g stroke="#1E3F30" strokeWidth="1">
            <line x1="214" y1="16" x2="214" y2="178" strokeDasharray="4 4" />
            <line x1="428" y1="16" x2="428" y2="178" strokeDasharray="4 4" />
          </g>

          {/* Panel 1: Regulatory (Circular) */}
          <g transform="translate(18, 16)">
            <rect x="0" y="0" width="180" height="162" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
            <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">1. Regulatory (Circle)</text>
            <circle cx="58" cy="78" r="28" fill="#FEE2E2" stroke="#EF4444" strokeWidth="6" />
            <text x="58" y="84" textAnchor="middle" fill="#111827" fontSize="15" fontWeight="800">80</text>
            <circle cx="128" cy="78" r="26" fill="#2563EB" stroke="#93C5FD" strokeWidth="2.5" />
            <path d="M116 78h22M130 70l8 8-8 8" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <text x="14" y="132" fill="#FFD84D" fontSize="9.5" fontWeight="700">Red ring = Prohibitory</text>
            <text x="14" y="147" fill="#E2F2EA" fontSize="9" fontWeight="600">Blue disc = Mandatory order</text>
          </g>

          {/* Panel 2: Warning (Equilateral Triangle) */}
          <g transform="translate(230, 16)">
            <rect x="0" y="0" width="182" height="162" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
            <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">2. Warning (Triangle)</text>
            <polygon points="91,38 134,110 48,110" fill="#FEF3C7" stroke="#EF4444" strokeWidth="5.5" strokeLinejoin="round" />
            <path d="M85 98c0-10 12-10 12-20 0-5-5-8-9-11" stroke="#111827" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <circle cx="91" cy="102" r="2.2" fill="#111827" />
            <text x="14" y="132" fill="#FFD84D" fontSize="9.5" fontWeight="700">Apex-up Red Triangle</text>
            <text x="14" y="147" fill="#E2F2EA" fontSize="9" fontWeight="600">Alerts bends, bridges &amp; school</text>
          </g>

          {/* Panel 3: Informative (Rectangular) */}
          <g transform="translate(442, 16)">
            <rect x="0" y="0" width="180" height="162" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
            <text x="12" y="20" fill="#9ED6B5" fontSize="10.5" fontWeight="700">3. Informative (Box)</text>
            <rect x="26" y="46" width="58" height="58" rx="8" fill="#1D4ED8" stroke="#93C5FD" strokeWidth="2" />
            <text x="55" y="84" textAnchor="middle" fill="#FFFFFF" fontSize="26" fontWeight="800">H</text>
            <rect x="96" y="54" width="66" height="42" rx="6" fill="#15803D" stroke="#86EFAC" strokeWidth="1.8" />
            <text x="129" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="800">ABUJA</text>
            <text x="129" y="86" textAnchor="middle" fill="#FFD84D" fontSize="8.5" fontWeight="700">42 km ↑</text>
            <text x="14" y="132" fill="#3BDC86" fontSize="9.5" fontWeight="700">FRSC (1988) · Call 122</text>
            <text x="14" y="147" fill="#E2F2EA" fontSize="9" fontWeight="600">Guidance, routes &amp; hospitals</text>
          </g>
        </svg>
      </figure>
    );
  }

  // 2. Federalism & Legislative Lists (Exclusive / Concurrent / Residual)
  if (/fed|const|nat-int|local/i.test(topicId)) {
    return (
      <figure className="rounded-2xl bg-[#11261D] border border-[#254A3A] p-4 flex flex-col gap-2.5 overflow-hidden">
        <div className="flex items-center justify-between gap-2 text-[11.5px] font-bold text-[#9ED6B5]">
          <span>1999 Constitution Division of Powers: 3 Tiers &amp; Legislative Lists</span>
          <span className="text-[#FFD84D]">Conceptual Diagram Guide</span>
        </div>
        <svg
          viewBox="0 0 640 194"
          className="w-full h-auto rounded-xl bg-[#0D1F17]"
          role="img"
          aria-label="Nigerian federalism division of legislative powers across Exclusive, Concurrent, and Residual lists"
        >
          <g stroke="#1E3F30" strokeWidth="1">
            <line x1="214" y1="16" x2="214" y2="178" strokeDasharray="4 4" />
            <line x1="428" y1="16" x2="428" y2="178" strokeDasharray="4 4" />
          </g>

          <g transform="translate(18, 16)">
            <rect x="0" y="0" width="180" height="162" rx="14" fill="#132C21" stroke="#FFD84D" strokeWidth="1.6" />
            <text x="12" y="22" fill="#FFD84D" fontSize="11" fontWeight="800">1. Exclusive List (68)</text>
            <text x="12" y="40" fill="#9ED6B5" fontSize="9.5" fontWeight="700">Federal Govt ONLY (NASS)</text>
            <rect x="12" y="50" width="156" height="72" rx="9" fill="#0F241B" stroke="#2D5D47" />
            <text x="20" y="68" fill="#F4F8F5" fontSize="9.5">• Defence &amp; Armed Forces</text>
            <text x="20" y="84" fill="#F4F8F5" fontSize="9.5">• Currency &amp; Central Bank</text>
            <text x="20" y="100" fill="#F4F8F5" fontSize="9.5">• Foreign Affairs &amp; Passports</text>
            <text x="20" y="115" fill="#F4F8F5" fontSize="9.5">• Customs, Police &amp; Mines</text>
            <text x="12" y="145" fill="#FFD84D" fontSize="9" fontWeight="700">1 Federal Center (Abuja)</text>
          </g>

          <g transform="translate(230, 16)">
            <rect x="0" y="0" width="182" height="162" rx="14" fill="#132C21" stroke="#3BDC86" strokeWidth="1.6" />
            <text x="12" y="22" fill="#3BDC86" fontSize="11" fontWeight="800">2. Concurrent List</text>
            <text x="12" y="40" fill="#9ED6B5" fontSize="9.5" fontWeight="700">Federal + 36 States Share</text>
            <rect x="12" y="50" width="158" height="72" rx="9" fill="#0F241B" stroke="#2D5D47" />
            <text x="20" y="68" fill="#F4F8F5" fontSize="9.5">• University &amp; Tech Education</text>
            <text x="20" y="84" fill="#F4F8F5" fontSize="9.5">• Electric Power &amp; Health</text>
            <text x="20" y="100" fill="#F4F8F5" fontSize="9.5">• Agriculture &amp; Housing</text>
            <text x="20" y="115" fill="#FFD84D" fontSize="9" fontWeight="700">Conflict? Federal law prevails!</text>
            <text x="12" y="145" fill="#3BDC86" fontSize="9" fontWeight="700">Sec. 4(5) Doctrine of Covering</text>
          </g>

          <g transform="translate(442, 16)">
            <rect x="0" y="0" width="180" height="162" rx="14" fill="#132C21" stroke="#93C5FD" strokeWidth="1.6" />
            <text x="12" y="22" fill="#93C5FD" fontSize="11" fontWeight="800">3. Residual &amp; 774 LGAs</text>
            <text x="12" y="40" fill="#9ED6B5" fontSize="9.5" fontWeight="700">States + Grassroots Functions</text>
            <rect x="12" y="50" width="156" height="72" rx="9" fill="#0F241B" stroke="#2D5D47" />
            <text x="20" y="68" fill="#F4F8F5" fontSize="9.5">• Chieftaincy &amp; Rural Markets</text>
            <text x="20" y="84" fill="#F4F8F5" fontSize="9.5">• Primary Health &amp; Naming</text>
            <text x="20" y="100" fill="#F4F8F5" fontSize="9.5">• Motor Parks &amp; Births Reg.</text>
            <text x="20" y="115" fill="#F4F8F5" fontSize="9.5">• Fourth Schedule LGA Duties</text>
            <text x="12" y="145" fill="#93C5FD" fontSize="9" fontWeight="700">36 States · FCT · 774 LGAs</text>
          </g>
        </svg>
      </figure>
    );
  }

  // 3. Human Rights, UDHR & Rule of Law / ADR
  if (/udhr|hr-|rights|rule|citizen|emerg/i.test(topicId)) {
    return (
      <figure className="rounded-2xl bg-[#11261D] border border-[#254A3A] p-4 flex flex-col gap-2.5 overflow-hidden">
        <div className="flex items-center justify-between gap-2 text-[11.5px] font-bold text-[#9ED6B5]">
          <span>Fundamental Rights (Chapter IV), UDHR Generations &amp; ADR Spectrum</span>
          <span className="text-[#FFD84D]">Conceptual Diagram Guide</span>
        </div>
        <svg
          viewBox="0 0 640 194"
          className="w-full h-auto rounded-xl bg-[#0D1F17]"
          role="img"
          aria-label="Human rights categories, rule of law pillars, and alternative dispute resolution spectrum"
        >
          <g stroke="#1E3F30" strokeWidth="1">
            <line x1="214" y1="16" x2="214" y2="178" strokeDasharray="4 4" />
            <line x1="428" y1="16" x2="428" y2="178" strokeDasharray="4 4" />
          </g>

          <g transform="translate(18, 16)">
            <rect x="0" y="0" width="180" height="162" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
            <text x="12" y="21" fill="#FFD84D" fontSize="10.5" fontWeight="800">1. Dicey’s Rule of Law</text>
            <rect x="14" y="34" width="152" height="30" rx="7" fill="#1A3E2F" stroke="#3BDC86" strokeWidth="1.2" />
            <text x="90" y="53" textAnchor="middle" fill="#F4F8F5" fontSize="9.5" fontWeight="700">Supremacy of Regular Law</text>
            <rect x="14" y="72" width="152" height="30" rx="7" fill="#1A3E2F" stroke="#93C5FD" strokeWidth="1.2" />
            <text x="90" y="91" textAnchor="middle" fill="#F4F8F5" fontSize="9.5" fontWeight="700">Equality Before the Law</text>
            <rect x="14" y="110" width="152" height="30" rx="7" fill="#1A3E2F" stroke="#FFD84D" strokeWidth="1.2" />
            <text x="90" y="129" textAnchor="middle" fill="#F4F8F5" fontSize="9.5" fontWeight="700">Fundamental Liberties</text>
            <text x="14" y="154" fill="#9ED6B5" fontSize="8.8">Audi alteram partem (Fair hearing)</text>
          </g>

          <g transform="translate(230, 16)">
            <rect x="0" y="0" width="182" height="162" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
            <text x="12" y="21" fill="#3BDC86" fontSize="10.5" fontWeight="800">2. UDHR &amp; Chapter IV</text>
            <text x="14" y="42" fill="#93C5FD" fontSize="9.5" fontWeight="700">1st Gen (Justiciable Ch. IV):</text>
            <text x="14" y="56" fill="#E2F2EA" fontSize="9">Life, Dignity, Fair Hearing, Vote</text>
            <text x="14" y="78" fill="#FFD84D" fontSize="9.5" fontWeight="700">2nd Gen (Socio-Econ Ch. II):</text>
            <text x="14" y="92" fill="#E2F2EA" fontSize="9">Education, Shelter, Livelihood</text>
            <text x="14" y="114" fill="#FCA5A5" fontSize="9.5" fontWeight="700">Lawful Limits:</text>
            <text x="14" y="128" fill="#E2F2EA" fontSize="9">Libel/Slander, Curfew, Court</text>
            <text x="14" y="152" fill="#9ED6B5" fontSize="8.8">UDHR: 10 Dec 1948 · 30 Articles</text>
          </g>

          <g transform="translate(442, 16)">
            <rect x="0" y="0" width="180" height="162" rx="14" fill="#132C21" stroke="#2D5D47" strokeWidth="1.5" />
            <text x="12" y="21" fill="#93C5FD" fontSize="10.5" fontWeight="800">3. ADR Escalation Ladder</text>
            <rect x="16" y="34" width="148" height="22" rx="6" fill="#0F241B" stroke="#3BDC86" />
            <text x="90" y="49" textAnchor="middle" fill="#3BDC86" fontSize="9" fontWeight="700">1. Negotiation (Direct Parties)</text>
            <rect x="16" y="62" width="148" height="22" rx="6" fill="#0F241B" stroke="#93C5FD" />
            <text x="90" y="77" textAnchor="middle" fill="#93C5FD" fontSize="9" fontWeight="700">2. Mediation / Conciliation</text>
            <rect x="16" y="90" width="148" height="22" rx="6" fill="#0F241B" stroke="#FFD84D" />
            <text x="90" y="105" textAnchor="middle" fill="#FFD84D" fontSize="9" fontWeight="700">3. Arbitration (Binding Award)</text>
            <rect x="16" y="118" width="148" height="22" rx="6" fill="#3A1A1A" stroke="#FCA5A5" />
            <text x="90" y="133" textAnchor="middle" fill="#FCA5A5" fontSize="9" fontWeight="700">4. Litigation (Court Judgment)</text>
            <text x="16" y="154" fill="#E2F2EA" fontSize="8.5">ADR = Faster, private, preserves ties</text>
          </g>
        </svg>
      </figure>
    );
  }

  // 4. Public Service, Anti-Corruption Watchdogs & Social Issues (ICPC, EFCC, NAFDAC, NDLEA, NAPTIP)
  if (/pub-serv|corrupt|civil-soc|drug|hiv|cult|traffick|youth|values|parent|intercom/i.test(topicId)) {
    return (
      <figure className="rounded-2xl bg-[#11261D] border border-[#254A3A] p-4 flex flex-col gap-2.5 overflow-hidden">
        <div className="flex items-center justify-between gap-2 text-[11.5px] font-bold text-[#9ED6B5]">
          <span>Civic Integrity Architecture: Statutory Watchdogs, Public Service &amp; Social Safeguards</span>
          <span className="text-[#FFD84D]">Conceptual Diagram Guide</span>
        </div>
        <svg
          viewBox="0 0 640 194"
          className="w-full h-auto rounded-xl bg-[#0D1F17]"
          role="img"
          aria-label="Statutory civic integrity agencies including ICPC, EFCC, CCB, NAFDAC, NDLEA, and NAPTIP"
        >
          <g stroke="#1E3F30" strokeWidth="1">
            <line x1="214" y1="16" x2="214" y2="178" strokeDasharray="4 4" />
            <line x1="428" y1="16" x2="428" y2="178" strokeDasharray="4 4" />
          </g>

          <g transform="translate(18, 16)">
            <rect x="0" y="0" width="180" height="162" rx="14" fill="#132C21" stroke="#FFD84D" strokeWidth="1.5" />
            <text x="12" y="21" fill="#FFD84D" fontSize="10.5" fontWeight="800">1. Anti-Graft Watchdogs</text>
            <rect x="12" y="34" width="156" height="34" rx="7" fill="#0F241B" stroke="#2D5D47" />
            <text x="20" y="49" fill="#FFD84D" fontSize="9.5" fontWeight="800">ICPC (2000)</text>
            <text x="20" y="62" fill="#E2F2EA" fontSize="8.8">Public-sector bribery &amp; abuse</text>
            <rect x="12" y="74" width="156" height="34" rx="7" fill="#0F241B" stroke="#2D5D47" />
            <text x="20" y="89" fill="#3BDC86" fontSize="9.5" fontWeight="800">EFCC (2004)</text>
            <text x="20" y="102" fill="#E2F2EA" fontSize="8.8">419, money laundering, cybercrime</text>
            <rect x="12" y="114" width="156" height="34" rx="7" fill="#0F241B" stroke="#2D5D47" />
            <text x="20" y="129" fill="#93C5FD" fontSize="9.5" fontWeight="800">CCB / CCT</text>
            <text x="20" y="142" fill="#E2F2EA" fontSize="8.8">Asset declaration by public officers</text>
          </g>

          <g transform="translate(230, 16)">
            <rect x="0" y="0" width="182" height="162" rx="14" fill="#132C21" stroke="#3BDC86" strokeWidth="1.5" />
            <text x="12" y="21" fill="#3BDC86" fontSize="10.5" fontWeight="800">2. Social Protection</text>
            <rect x="12" y="34" width="158" height="34" rx="7" fill="#0F241B" stroke="#2D5D47" />
            <text x="20" y="49" fill="#3BDC86" fontSize="9.5" fontWeight="800">NAFDAC (1993)</text>
            <text x="20" y="62" fill="#E2F2EA" fontSize="8.8">Regulates food, drugs &amp; cosmetics</text>
            <rect x="12" y="74" width="158" height="34" rx="7" fill="#0F241B" stroke="#2D5D47" />
            <text x="20" y="89" fill="#FFD84D" fontSize="9.5" fontWeight="800">NDLEA (1989)</text>
            <text x="20" y="102" fill="#E2F2EA" fontSize="8.8">Narcotics &amp; illicit drug trafficking</text>
            <rect x="12" y="114" width="158" height="34" rx="7" fill="#0F241B" stroke="#2D5D47" />
            <text x="20" y="129" fill="#FCA5A5" fontSize="9.5" fontWeight="800">NAPTIP (2003)</text>
            <text x="20" y="142" fill="#E2F2EA" fontSize="8.8">Human trafficking rescue &amp; law</text>
          </g>

          <g transform="translate(442, 16)">
            <rect x="0" y="0" width="180" height="162" rx="14" fill="#132C21" stroke="#93C5FD" strokeWidth="1.5" />
            <text x="12" y="21" fill="#93C5FD" fontSize="10.5" fontWeight="800">3. Civil Service Ethos</text>
            <text x="14" y="44" fill="#F4F8F5" fontSize="9.5">• <tspan fill="#FFD84D" fontWeight="700">Permanence:</tspan> Outlasts regimes</text>
            <text x="14" y="64" fill="#F4F8F5" fontSize="9.5">• <tspan fill="#3BDC86" fontWeight="700">Neutrality:</tspan> Non-partisan</text>
            <text x="14" y="84" fill="#F4F8F5" fontSize="9.5">• <tspan fill="#93C5FD" fontWeight="700">Anonymity:</tspan> Minister answers</text>
            <text x="14" y="104" fill="#F4F8F5" fontSize="9.5">• <tspan fill="#FFD84D" fontWeight="700">Merit:</tspan> FCSC / SCSC exams</text>
            <rect x="14" y="118" width="152" height="30" rx="7" fill="#0F241B" stroke="#2D5D47" />
            <text x="90" y="137" textAnchor="middle" fill="#9ED6B5" fontSize="8.8" fontWeight="700">Ombudsman = Public Complaints</text>
          </g>
        </svg>
      </figure>
    );
  }

  // 5. Default: 3 Arms of Government, Separation of Powers, INEC & Democracy
  return (
    <figure className="rounded-2xl bg-[#11261D] border border-[#254A3A] p-4 flex flex-col gap-2.5 overflow-hidden">
      <div className="flex items-center justify-between gap-2 text-[11.5px] font-bold text-[#9ED6B5]">
        <span>Constitutional Democracy: 3 Arms, Checks &amp; Balances &amp; INEC Electoral Mandate</span>
        <span className="text-[#FFD84D]">Conceptual Diagram Guide</span>
      </div>
      <svg
        viewBox="0 0 640 194"
        className="w-full h-auto rounded-xl bg-[#0D1F17]"
        role="img"
        aria-label="Three arms of government with checks and balances and INEC electoral framework"
      >
        <g stroke="#1E3F30" strokeWidth="1">
          <line x1="214" y1="16" x2="214" y2="178" strokeDasharray="4 4" />
          <line x1="428" y1="16" x2="428" y2="178" strokeDasharray="4 4" />
        </g>

        {/* Panel 1: Legislature */}
        <g transform="translate(18, 16)">
          <rect x="0" y="0" width="180" height="162" rx="14" fill="#132C21" stroke="#FFD84D" strokeWidth="1.5" />
          <text x="12" y="21" fill="#FFD84D" fontSize="10.5" fontWeight="800">1. Legislature (Sec. 4)</text>
          <text x="12" y="38" fill="#9ED6B5" fontSize="9" fontWeight="700">Bicameral NASS (469 Seats)</text>
          <rect x="12" y="48" width="156" height="68" rx="8" fill="#0F241B" stroke="#2D5D47" />
          <text x="20" y="66" fill="#F4F8F5" fontSize="9.2">• Senate: 109 (3/state + 1 FCT)</text>
          <text x="20" y="82" fill="#F4F8F5" fontSize="9.2">• Reps: 360 (Population)</text>
          <text x="20" y="98" fill="#F4F8F5" fontSize="9.2">• Approves Budget &amp; Treaties</text>
          <text x="20" y="112" fill="#3BDC86" fontSize="9" fontWeight="700">• Checks: 2/3 Override, Impeach</text>
          <text x="12" y="144" fill="#FFD84D" fontSize="8.8" fontWeight="700">States: Unicameral Assembly</text>
        </g>

        {/* Panel 2: Executive */}
        <g transform="translate(230, 16)">
          <rect x="0" y="0" width="182" height="162" rx="14" fill="#132C21" stroke="#3BDC86" strokeWidth="1.5" />
          <text x="12" y="21" fill="#3BDC86" fontSize="10.5" fontWeight="800">2. Executive (Sec. 5)</text>
          <text x="12" y="38" fill="#9ED6B5" fontSize="9" fontWeight="700">President, Governors &amp; Cabinet</text>
          <rect x="12" y="48" width="158" height="68" rx="8" fill="#0F241B" stroke="#2D5D47" />
          <text x="20" y="66" fill="#F4F8F5" fontSize="9.2">• Enforces Laws &amp; Policies</text>
          <text x="20" y="82" fill="#F4F8F5" fontSize="9.2">• Prepares Appropriation Bill</text>
          <text x="20" y="98" fill="#F4F8F5" fontSize="9.2">• Prerogative of Mercy</text>
          <text x="20" y="112" fill="#FFD84D" fontSize="9" fontWeight="700">• Checks: Assent / Veto Bills</text>
          <text x="12" y="144" fill="#3BDC86" fontSize="8.8" fontWeight="700">INEC: BVAS + IReV · 18+ Suffrage</text>
        </g>

        {/* Panel 3: Judiciary */}
        <g transform="translate(442, 16)">
          <rect x="0" y="0" width="180" height="162" rx="14" fill="#132C21" stroke="#93C5FD" strokeWidth="1.5" />
          <text x="12" y="21" fill="#93C5FD" fontSize="10.5" fontWeight="800">3. Judiciary (Sec. 6)</text>
          <text x="12" y="38" fill="#9ED6B5" fontSize="9" fontWeight="700">Supreme Court to Magistrates</text>
          <rect x="12" y="48" width="156" height="68" rx="8" fill="#0F241B" stroke="#2D5D47" />
          <text x="20" y="66" fill="#F4F8F5" fontSize="9.2">• Interprets the Constitution</text>
          <text x="20" y="82" fill="#F4F8F5" fontSize="9.2">• Bastion of the Common Citizen</text>
          <text x="20" y="98" fill="#F4F8F5" fontSize="9.2">• NJC Safeguards Independence</text>
          <text x="20" y="112" fill="#FCA5A5" fontSize="9" fontWeight="700">• Checks: Declares Ultra Vires</text>
          <text x="12" y="144" fill="#93C5FD" fontSize="8.8" fontWeight="700">Consolidated Revenue Salaries</text>
        </g>
      </svg>
    </figure>
  );
}
