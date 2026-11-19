import React from 'react';

function EngStageShell({
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
              id="env-arr"
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
              id="env-arr-cyan"
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
              id="env-arr-green"
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

export function EngNoteVisual({
  topicId,
  partIdx = 0,
}: {
  topicId: string;
  partIdx?: number;
}) {
  void partIdx;

  // 1. Pure Vowels: IPA Vowel Trapezium
  if (topicId === 'e-vowels') {
    return (
      <EngStageShell
        title="IPA Pure Vowel Trapezium (12 Monophthongs: 5 Long ː · 7 Short)"
        caption="Tongue height (Close → Open) and advancement (Front → Central → Back) separate minimal pairs like /iː/ (quay) vs /ɪ/ (women) and central /ʌ/ (blood), /ɜː/ (colonel), /ə/ (schwa)."
        ariaLabel="IPA pure vowel trapezium showing 12 English monophthongs"
      >
        <text x="110" y="22" fill="#9EC4B1" fontSize="11" fontWeight="700" textAnchor="middle">FRONT</text>
        <text x="275" y="22" fill="#9EC4B1" fontSize="11" fontWeight="700" textAnchor="middle">CENTRAL</text>
        <text x="440" y="22" fill="#9EC4B1" fontSize="11" fontWeight="700" textAnchor="middle">BACK</text>
        {/* Trapezium frame */}
        <polygon points="85,36 465,36 465,182 185,182" fill="#10251B" stroke="#396D56" strokeWidth="2" />
        <line x1="118" y1="85" x2="465" y2="85" stroke="#254A3A" strokeDasharray="4 4" />
        <line x1="152" y1="134" x2="465" y2="134" stroke="#254A3A" strokeDasharray="4 4" />
        <line x1="275" y1="36" x2="325" y2="182" stroke="#254A3A" strokeDasharray="4 4" />
        <text x="24" y="46" fill="#9EC4B1" fontSize="10" fontWeight="700">CLOSE</text>
        <text x="24" y="112" fill="#9EC4B1" fontSize="10" fontWeight="700">MID</text>
        <text x="24" y="178" fill="#9EC4B1" fontSize="10" fontWeight="700">OPEN</text>
        {[
          { x: 105, y: 50, sym: 'iː', ex: 'quay', long: true },
          { x: 168, y: 68, sym: 'ɪ', ex: 'women', long: false },
          { x: 145, y: 108, sym: 'e', ex: 'bury', long: false },
          { x: 185, y: 162, sym: 'æ', ex: 'plait', long: false },
          { x: 292, y: 98, sym: 'ɜː', ex: 'colonel', long: true },
          { x: 280, y: 128, sym: 'ə', ex: 'police', long: false },
          { x: 302, y: 162, sym: 'ʌ', ex: 'blood', long: false },
          { x: 445, y: 50, sym: 'uː', ex: 'tomb', long: true },
          { x: 392, y: 68, sym: 'ʊ', ex: 'wolf', long: false },
          { x: 445, y: 112, sym: 'ɔː', ex: 'sword', long: true },
          { x: 445, y: 154, sym: 'ɒ', ex: 'yacht', long: false },
          { x: 382, y: 174, sym: 'ɑː', ex: 'clerk', long: true },
        ].map((v) => (
          <g key={v.sym}>
            <circle cx={v.x} cy={v.y} r="13" fill={v.long ? '#FFD84D' : '#1F4B38'} stroke={v.long ? '#FFF3B0' : '#7DD3FC'} strokeWidth="1.5" />
            <text x={v.x} y={v.y + 4} fill={v.long ? '#10251B' : '#FFFFFF'} fontSize="11" fontWeight="800" textAnchor="middle">
              {v.sym}
            </text>
            <text x={v.x + 17} y={v.y + 4} fill="#D6EBE0" fontSize="10" fontWeight="600">
              {v.ex}
            </text>
          </g>
        ))}
      </EngStageShell>
    );
  }

  // 2. Diphthongs & Triphthongs: Glide Arrows
  if (topicId === 'e-diphthongs') {
    return (
      <EngStageShell
        title="8 English Diphthong Glides: Closing (→ /ɪ/, /ʊ/) vs Centring (→ /ə/)"
        caption="Every diphthong glides smoothly from a starting tongue position to a target (/ɪ/, /ʊ/, or /ə/) inside ONE syllable."
        ariaLabel="Classification tree and glide targets of the 8 English diphthongs"
      >
        <rect x="20" y="20" width="165" height="170" rx="12" fill="#10251B" stroke="#3BDC86" strokeWidth="1.6" />
        <text x="102" y="42" fill="#3BDC86" fontSize="12" fontWeight="800" textAnchor="middle">CLOSING → /ɪ/</text>
        <text x="34" y="72" fill="#FFD84D" fontSize="13" fontWeight="800">/eɪ/</text>
        <text x="72" y="72" fill="#E6F4EC" fontSize="11">gauge, steak, gaol</text>
        <text x="34" y="110" fill="#FFD84D" fontSize="13" fontWeight="800">/aɪ/</text>
        <text x="72" y="110" fill="#E6F4EC" fontSize="11">height, aisle, buy</text>
        <text x="34" y="148" fill="#FFD84D" fontSize="13" fontWeight="800">/ɔɪ/</text>
        <text x="72" y="148" fill="#E6F4EC" fontSize="11">buoy, choice, coin</text>

        <rect x="198" y="20" width="165" height="170" rx="12" fill="#10251B" stroke="#7DD3FC" strokeWidth="1.6" />
        <text x="280" y="42" fill="#7DD3FC" fontSize="12" fontWeight="800" textAnchor="middle">CLOSING → /ʊ/</text>
        <text x="212" y="80" fill="#FFD84D" fontSize="13" fontWeight="800">/əʊ/</text>
        <text x="252" y="80" fill="#E6F4EC" fontSize="11">sew, brooch, soul</text>
        <text x="212" y="124" fill="#FFD84D" fontSize="13" fontWeight="800">/aʊ/</text>
        <text x="252" y="124" fill="#E6F4EC" fontSize="11">bough, drought</text>
        <text x="212" y="164" fill="#9EC4B1" fontSize="10.5">+ /ə/ = Triphthongs:</text>
        <text x="212" y="180" fill="#FFD84D" fontSize="10.5" fontWeight="700">choir /aɪə/ · hour /aʊə/</text>

        <rect x="376" y="20" width="164" height="170" rx="12" fill="#10251B" stroke="#FFD84D" strokeWidth="1.6" />
        <text x="458" y="42" fill="#FFD84D" fontSize="12" fontWeight="800" textAnchor="middle">CENTRING → /ə/</text>
        <text x="390" y="74" fill="#3BDC86" fontSize="13" fontWeight="800">/ɪə/</text>
        <text x="428" y="74" fill="#E6F4EC" fontSize="11">weird, fierce, ear</text>
        <text x="390" y="114" fill="#3BDC86" fontSize="13" fontWeight="800">/eə/</text>
        <text x="428" y="114" fill="#E6F4EC" fontSize="11">heir, air, scarce</text>
        <text x="390" y="154" fill="#3BDC86" fontSize="13" fontWeight="800">/ʊə/</text>
        <text x="428" y="154" fill="#E6F4EC" fontSize="11">pure, tour, cure</text>
      </EngStageShell>
    );
  }

  // 3. Consonants, Voicing & Silent Letters
  if (topicId === 'e-consonants') {
    return (
      <EngStageShell
        title="Consonant Voicing Pairs, '-ed' Assimilation & Silent Letters"
        caption="Voiceless endings (/p, k, f, θ, s, ʃ, tʃ/) force '-ed' to /t/ (laughed = /lɑːft/), voiced take /d/, and /t, d/ take /ɪd/."
        ariaLabel="Consonant voicing pairs, past ed rule, and silent letters chart"
      >
        <rect x="18" y="18" width="252" height="174" rx="12" fill="#10251B" stroke="#396D56" strokeWidth="1.6" />
        <text x="144" y="38" fill="#FFD84D" fontSize="11.5" fontWeight="800" textAnchor="middle">8 VOICELESS ↔ VOICED PAIRS</text>
        <text x="32" y="62" fill="#7DD3FC" fontSize="11" fontWeight="700">Voiceless (No vibe)</text>
        <text x="162" y="62" fill="#3BDC86" fontSize="11" fontWeight="700">Voiced (Vibrates)</text>
        {[
          ['/p, t, k/', '/b, d, ɡ/'],
          ['/f/  (leaf)', '/v/  (leave)'],
          ['/θ/  (breath)', '/ð/  (breathe)'],
          ['/s/  (price)', '/z/  (prize)'],
          ['/ʃ/  (chalet)', '/ʒ/  (seizure)'],
          ['/tʃ/ (chin)', '/dʒ/ (soldier)'],
        ].map(([vl, vd], i) => (
          <g key={vl}>
            <text x="32" y={84 + i * 17} fill="#E6F4EC" fontSize="11">{vl}</text>
            <text x="162" y={84 + i * 17} fill="#E6F4EC" fontSize="11">{vd}</text>
          </g>
        ))}

        <rect x="284" y="18" width="258" height="82" rx="12" fill="#10251B" stroke="#FFD84D" strokeWidth="1.6" />
        <text x="413" y="38" fill="#FFD84D" fontSize="11.5" fontWeight="800" textAnchor="middle">PAST "-ed" PRONUNCIATION</text>
        <text x="298" y="58" fill="#7DD3FC" fontSize="11">After voiceless → /t/: walked, laughed</text>
        <text x="298" y="75" fill="#3BDC86" fontSize="11">After voiced → /d/: begged, breathed</text>
        <text x="298" y="92" fill="#FDE68A" fontSize="11">After /t, d/ → /ɪd/: wanted, landed</text>

        <rect x="284" y="110" width="258" height="82" rx="12" fill="#10251B" stroke="#7DD3FC" strokeWidth="1.6" />
        <text x="413" y="130" fill="#7DD3FC" fontSize="11.5" fontWeight="800" textAnchor="middle">SILENT CONSONANT TRAPS</text>
        <text x="298" y="150" fill="#E6F4EC" fontSize="11">Silent B: subtle, debt, plumber, womb</text>
        <text x="298" y="167" fill="#E6F4EC" fontSize="11">Silent P/T: receipt, coup · mortgage, chalet</text>
        <text x="298" y="184" fill="#E6F4EC" fontSize="11">Silent W/L: sword, two · salmon, calm</text>
      </EngStageShell>
    );
  }

  // 4. Word Stress & Stress-Shifting Suffixes
  if (topicId === 'e-stress') {
    return (
      <EngStageShell
        title="Word Stress Staircase: Counting Backwards from the Suffix"
        caption="Suffixes '-ion/-ic' stress the 2nd syllable from the end; '-ity/-ate/-phy/-gy' stress the 3rd from the end; COL-league & CA-len-dar stress the 1st!"
        ariaLabel="Word stress backwards syllable counting chart"
      >
        <rect x="20" y="22" width="520" height="50" rx="10" fill="#10251B" stroke="#FFD84D" strokeWidth="1.5" />
        <text x="34" y="44" fill="#FFD84D" fontSize="12" fontWeight="800">LAW 1 (2nd from End):</text>
        <text x="190" y="44" fill="#FFFFFF" fontSize="12" fontWeight="700">-ion · -ic · -ial · -ian</text>
        <text x="34" y="63" fill="#9EC4B1" fontSize="11">in-for-MA-tion · ec-o-NOM-ic · pol-i-TI-cian  (Watch exception: POL-i-tics, A-ra-bic)</text>

        <rect x="20" y="82" width="520" height="50" rx="10" fill="#10251B" stroke="#3BDC86" strokeWidth="1.5" />
        <text x="34" y="104" fill="#3BDC86" fontSize="12" fontWeight="800">LAW 2 (3rd from End):</text>
        <text x="190" y="104" fill="#FFFFFF" fontSize="12" fontWeight="700">-ity · -ate · -phy · -gy · -cy</text>
        <text x="34" y="123" fill="#9EC4B1" fontSize="11">op-por-TU-ni-ty · com-MU-ni-cate · pho-TOG-ra-phy · de-MOC-ra-cy</text>

        <rect x="20" y="142" width="520" height="50" rx="10" fill="#10251B" stroke="#7DD3FC" strokeWidth="1.5" />
        <text x="34" y="164" fill="#7DD3FC" fontSize="12" fontWeight="800">1st-SYLLABLE TRAPS:</text>
        <text x="190" y="164" fill="#FFFFFF" fontSize="12" fontWeight="700">COL-league · MA-dam · CA-len-dar · MAIN-te-nance · TRI-bal-ism</text>
        <text x="34" y="183" fill="#9EC4B1" fontSize="11">2-Syllable Shift: EX-port (Noun) → ex-PORT (Verb) · RE-cord (Noun) → re-CORD (Verb)</text>
      </EngStageShell>
    );
  }

  // 5. Emphatic Stress & Intonation Tunes
  if (topicId === 'e-emphatic') {
    return (
      <EngStageShell
        title="Emphatic Stress Contrast Filter & Falling (↘) vs Rising (↗) Tunes"
        caption="Never repeat the CAPITALISED word in the question — replace ONLY that slot while keeping every unstressed word intact!"
        ariaLabel="Emphatic stress contrast diagram and intonation curves"
      >
        <rect x="18" y="20" width="305" height="170" rx="12" fill="#10251B" stroke="#FFD84D" strokeWidth="1.6" />
        <text x="170" y="42" fill="#FFD84D" fontSize="12" fontWeight="800" textAnchor="middle">EMPHATIC STRESS 2-CHECK FILTER</text>
        <text x="32" y="68" fill="#FFFFFF" fontSize="12" fontWeight="700">Prompt: &quot;Musa bought a </text>
        <rect x="176" y="53" width="42" height="20" rx="4" fill="#FFD84D" />
        <text x="197" y="68" fill="#10251B" fontSize="12" fontWeight="900" textAnchor="middle">NEW</text>
        <text x="223" y="68" fill="#FFFFFF" fontSize="12" fontWeight="700"> car.&quot;</text>
        <line x1="197" y1="76" x2="197" y2="102" stroke="#FFD84D" strokeWidth="2" markerEnd="url(#env-arr)" />
        <rect x="30" y="106" width="280" height="34" rx="8" fill="#183A2B" stroke="#3BDC86" />
        <text x="170" y="127" fill="#3BDC86" fontSize="11.5" fontWeight="800" textAnchor="middle">✓ &quot;Did Musa buy an OLD car?&quot;</text>
        <text x="32" y="162" fill="#FCA5A5" fontSize="10.5">✗ &quot;Did Ali buy a new car?&quot; (kept NEW, changed Musa!)</text>
        <text x="32" y="180" fill="#9EC4B1" fontSize="10.5">✓ Or WH: &quot;What kind of car did Musa buy?&quot;</text>

        <rect x="336" y="20" width="206" height="170" rx="12" fill="#10251B" stroke="#7DD3FC" strokeWidth="1.6" />
        <text x="439" y="42" fill="#7DD3FC" fontSize="12" fontWeight="800" textAnchor="middle">INTONATION TUNES</text>
        <text x="350" y="68" fill="#FFD84D" fontSize="11.5" fontWeight="800">FALLING TUNE ↘</text>
        <text x="350" y="85" fill="#E6F4EC" fontSize="10.5">• Statements &amp; Commands</text>
        <text x="350" y="101" fill="#E6F4EC" fontSize="10.5">• WH-Questions (&quot;Where...? ↘&quot;)</text>
        <text x="350" y="117" fill="#E6F4EC" fontSize="10.5">• Exclamations</text>
        <text x="350" y="143" fill="#3BDC86" fontSize="11.5" fontWeight="800">RISING TUNE ↗</text>
        <text x="350" y="160" fill="#E6F4EC" fontSize="10.5">• Yes/No Questions (&quot;Are you...?&quot;)</text>
        <text x="350" y="176" fill="#E6F4EC" fontSize="10.5">• Polite Requests &amp; List items</text>
      </EngStageShell>
    );
  }

  // 6. Rhymes & C-V Syllable Structure
  if (topicId === 'e-rhyme-rhythm') {
    return (
      <EngStageShell
        title="English Syllable Blueprint (C₀₋₃) V (C₀₋₄) & Phonetic Rhyme"
        caption="Always convert letters into IPA phonemes BEFORE counting C and V: 'queue' = /kjuː/ (CCV) and 'box' = /bɒks/ (CVCC)!"
        ariaLabel="Syllable onset nucleus coda diagram and phonetic rhyme examples"
      >
        <rect x="30" y="24" width="145" height="72" rx="10" fill="#10251B" stroke="#7DD3FC" strokeWidth="1.6" />
        <text x="102" y="46" fill="#7DD3FC" fontSize="12" fontWeight="800" textAnchor="middle">ONSET (0–3 C)</text>
        <text x="102" y="66" fill="#E6F4EC" fontSize="11" textAnchor="middle">CCC starts with /s/!</text>
        <text x="102" y="83" fill="#FFD84D" fontSize="11" fontWeight="700" textAnchor="middle">/str-/ in &quot;street&quot;</text>

        <line x1="175" y1="60" x2="205" y2="60" stroke="#FFD84D" strokeWidth="2" markerEnd="url(#env-arr)" />

        <rect x="208" y="24" width="144" height="72" rx="10" fill="#183A2B" stroke="#FFD84D" strokeWidth="2" />
        <text x="280" y="46" fill="#FFD84D" fontSize="12" fontWeight="800" textAnchor="middle">NUCLEUS (1 V)</text>
        <text x="280" y="66" fill="#FFFFFF" fontSize="11" textAnchor="middle">Obligatory Vowel</text>
        <text x="280" y="83" fill="#3BDC86" fontSize="11" fontWeight="700" textAnchor="middle">/iː/ or Diphthong</text>

        <line x1="352" y1="60" x2="382" y2="60" stroke="#FFD84D" strokeWidth="2" markerEnd="url(#env-arr)" />

        <rect x="385" y="24" width="145" height="72" rx="10" fill="#10251B" stroke="#3BDC86" strokeWidth="1.6" />
        <text x="457" y="46" fill="#3BDC86" fontSize="12" fontWeight="800" textAnchor="middle">CODA (0–4 C)</text>
        <text x="457" y="66" fill="#E6F4EC" fontSize="11" textAnchor="middle">&quot;texts&quot; = /teksts/</text>
        <text x="457" y="83" fill="#FFD84D" fontSize="11" fontWeight="700" textAnchor="middle">CVCCCC (4 C’s!)</text>

        <rect x="30" y="114" width="500" height="76" rx="10" fill="#10251B" stroke="#396D56" strokeWidth="1.5" />
        <text x="280" y="135" fill="#FFD84D" fontSize="11.5" fontWeight="800" textAnchor="middle">RHYME = IDENTICAL [NUCLEUS + CODA] SOUND (IGNORE SPELLING!)</text>
        <text x="48" y="158" fill="#E6F4EC" fontSize="11">• quay /kiː/ ↔ free /friː/     • colonel /ˈkɜːnl/ ↔ journal     • draught /drɑːft/ ↔ laughed</text>
        <text x="48" y="177" fill="#7DD3FC" fontSize="11">• queue = /k-j-uː/ → CCV    • church = /tʃ-ɜː-tʃ/ → CVC     • box = /b-ɒ-k-s/ → CVCC</text>
      </EngStageShell>
    );
  }

  // 7. Nouns, Pronouns & Case Usage
  if (topicId === 'e-nouns') {
    return (
      <EngStageShell
        title="Uncountable Noun Shield & Pronoun Case Switchboard"
        caption="Uncountable nouns reject plural '-s' and 'a/an'; prepositions and 'Let' strictly govern Objective pronouns (me, him, her, us, them, whom)."
        ariaLabel="Uncountable nouns and pronoun case grammar visual"
      >
        <rect x="20" y="20" width="250" height="170" rx="12" fill="#10251B" stroke="#FFD84D" strokeWidth="1.6" />
        <text x="145" y="42" fill="#FFD84D" fontSize="12" fontWeight="800" textAnchor="middle">UNCOUNTABLE NOUNS (NO -S!)</text>
        <text x="34" y="66" fill="#E6F4EC" fontSize="11">• information · advice · equipment</text>
        <text x="34" y="85" fill="#E6F4EC" fontSize="11">• furniture · luggage · stationery</text>
        <text x="34" y="104" fill="#E6F4EC" fontSize="11">• machinery · traffic · accommodation</text>
        <rect x="32" y="120" width="226" height="56" rx="8" fill="#183A2B" />
        <text x="145" y="141" fill="#3BDC86" fontSize="11" fontWeight="700" textAnchor="middle">✓ &quot;three pieces of equipment&quot;</text>
        <text x="145" y="162" fill="#7DD3FC" fontSize="10.5" textAnchor="middle">Note: damages (Law) = court payout!</text>

        <rect x="286" y="20" width="254" height="170" rx="12" fill="#10251B" stroke="#3BDC86" strokeWidth="1.6" />
        <text x="413" y="42" fill="#3BDC86" fontSize="12" fontWeight="800" textAnchor="middle">PRONOUN CASE TRIGGERS</text>
        <text x="300" y="68" fill="#FFD84D" fontSize="11" fontWeight="700">Subjective (I, he, she, we, who):</text>
        <text x="300" y="86" fill="#E6F4EC" fontSize="11">• &quot;Amaka runs faster than I [do].&quot;</text>
        <text x="300" y="114" fill="#7DD3FC" fontSize="11" fontWeight="700">Objective (me, him, her, us, whom):</text>
        <text x="300" y="132" fill="#E6F4EC" fontSize="11">• &quot;Between you and ME...&quot; (after prep.)</text>
        <text x="300" y="150" fill="#E6F4EC" fontSize="11">• &quot;Let Ada and ME lead.&quot; (after Let)</text>
        <text x="300" y="174" fill="#FDE68A" fontSize="10.5">Possessive: its, yours, theirs, one’s</text>
      </EngStageShell>
    );
  }

  // 8. Verbs, Tense & Aspect Timeline
  if (topicId === 'e-verbs') {
    return (
      <EngStageShell
        title="English Tense Timeline: Past Perfect (1st Past) → Simple Past (2nd Past) → Now"
        caption="When two past events occur, Past Perfect (had + V₃) marks the EARLIER event, and Simple Past (V₂) marks the LATER event or 'since' anchor!"
        ariaLabel="Timeline showing Past Perfect, Simple Past, and Present Perfect"
      >
        <line x1="40" y1="95" x2="520" y2="95" stroke="#7DD3FC" strokeWidth="3" markerEnd="url(#env-arr-cyan)" />
        {/* Node 1: Past Perfect */}
        <circle cx="120" cy="95" r="10" fill="#FFD84D" />
        <text x="120" y="52" fill="#FFD84D" fontSize="12" fontWeight="800" textAnchor="middle">1st PAST ACTION</text>
        <text x="120" y="70" fill="#FFFFFF" fontSize="11" fontWeight="700" textAnchor="middle">had + V₃ (had left)</text>
        <text x="120" y="124" fill="#D6EBE0" fontSize="10.5" textAnchor="middle">&quot;The train HAD LEFT...&quot;</text>

        {/* Node 2: Simple Past */}
        <circle cx="290" cy="95" r="10" fill="#3BDC86" />
        <text x="290" y="52" fill="#3BDC86" fontSize="12" fontWeight="800" textAnchor="middle">2nd PAST / DEFINITE</text>
        <text x="290" y="70" fill="#FFFFFF" fontSize="11" fontWeight="700" textAnchor="middle">V₂ (arrived / yesterday)</text>
        <text x="290" y="124" fill="#D6EBE0" fontSize="10.5" textAnchor="middle">&quot;...before we ARRIVED.&quot;</text>

        {/* Span: Present Perfect */}
        <path d="M 290 145 Q 385 175 480 145" fill="none" stroke="#FFD84D" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#env-arr)" />
        <text x="385" y="182" fill="#FFD84D" fontSize="11" fontWeight="700" textAnchor="middle">have/has + V₃ + SINCE + V₂ (&quot;since he wrote&quot;)</text>

        {/* Node 3: NOW */}
        <circle cx="480" cy="95" r="10" fill="#FFFFFF" />
        <text x="480" y="68" fill="#FFFFFF" fontSize="12" fontWeight="800" textAnchor="middle">NOW</text>
      </EngStageShell>
    );
  }

  // 9. Concord: The 12 Laws Decision Map
  if (topicId === 'e-concord') {
    return (
      <EngStageShell
        title="Subject–Verb Concord Router: Head vs Proximity vs Relative Antecedent"
        caption="Accompaniment ('as well as / with') locks onto Subject 1; 'neither...nor' locks onto the NEARER subject; 'one of the boys who' takes PLURAL!"
        ariaLabel="Concord decision diagram for accompaniment, proximity, and one of the plural noun"
      >
        <rect x="18" y="20" width="166" height="170" rx="12" fill="#10251B" stroke="#FFD84D" strokeWidth="1.6" />
        <text x="101" y="42" fill="#FFD84D" fontSize="11.5" fontWeight="800" textAnchor="middle">ACCOMPANIMENT</text>
        <text x="101" y="62" fill="#9EC4B1" fontSize="10.5" textAnchor="middle">with · as well as · along with</text>
        <text x="101" y="92" fill="#FFFFFF" fontSize="11.5" fontWeight="700" textAnchor="middle">[S₁] + with S₂ → match S₁</text>
        <text x="101" y="124" fill="#3BDC86" fontSize="11" fontWeight="700" textAnchor="middle">&quot;The coach, with his</text>
        <text x="101" y="140" fill="#3BDC86" fontSize="11" fontWeight="700" textAnchor="middle">players, IS ready.&quot;</text>
        <text x="101" y="172" fill="#FDE68A" fontSize="10.5" textAnchor="middle">Many a boy FAILS (Sing.)</text>

        <rect x="197" y="20" width="166" height="170" rx="12" fill="#10251B" stroke="#7DD3FC" strokeWidth="1.6" />
        <text x="280" y="42" fill="#7DD3FC" fontSize="11.5" fontWeight="800" textAnchor="middle">PROXIMITY LAW</text>
        <text x="280" y="62" fill="#9EC4B1" fontSize="10.5" textAnchor="middle">either...or · neither...nor</text>
        <text x="280" y="92" fill="#FFFFFF" fontSize="11.5" fontWeight="700" textAnchor="middle">Neither S₁ nor [S₂] → S₂</text>
        <text x="280" y="124" fill="#3BDC86" fontSize="11" fontWeight="700" textAnchor="middle">&quot;Neither the boys nor</text>
        <text x="280" y="140" fill="#3BDC86" fontSize="11" fontWeight="700" textAnchor="middle">Ada WAS late.&quot;</text>
        <text x="280" y="172" fill="#7DD3FC" fontSize="10.5" textAnchor="middle">The poor ARE · Police ARE</text>

        <rect x="376" y="20" width="166" height="170" rx="12" fill="#10251B" stroke="#3BDC86" strokeWidth="1.6" />
        <text x="459" y="42" fill="#3BDC86" fontSize="11.5" fontWeight="800" textAnchor="middle">&quot;ONE OF THE...&quot; TRAP</text>
        <text x="459" y="72" fill="#FFFFFF" fontSize="11" fontWeight="700" textAnchor="middle">one of the [girls] who</text>
        <text x="459" y="90" fill="#FFD84D" fontSize="12" fontWeight="800" textAnchor="middle">→ HAVE won (Plural!)</text>
        <line x1="392" y1="108" x2="526" y2="108" stroke="#254A3A" />
        <text x="459" y="130" fill="#FFFFFF" fontSize="11" fontWeight="700" textAnchor="middle">the ONLY one ... who</text>
        <text x="459" y="148" fill="#7DD3FC" fontSize="12" fontWeight="800" textAnchor="middle">→ HAS won (Singular!)</text>
        <text x="459" y="175" fill="#9EC4B1" fontSize="10" textAnchor="middle">THE number IS / A number ARE</text>
      </EngStageShell>
    );
  }

  // 10. Adjectives & Adverbs (OSASCOMP)
  if (topicId === 'e-adj-adv') {
    const slots = [
      ['D', 'Det', 'two'],
      ['O', 'Opinion', 'sleek'],
      ['S', 'Size', 'small'],
      ['A', 'Age', 'new'],
      ['S', 'Shape', 'oval'],
      ['C', 'Colour', 'black'],
      ['O', 'Origin', 'Italian'],
      ['M', 'Material', 'leather'],
      ['P', 'Purpose', 'riding'],
    ];
    return (
      <EngStageShell
        title="Royal Order of Adjectives: D – O – S – A – S – C – O – M – P + Noun"
        caption="Adjectives march from subjective Opinion to permanent Material & Purpose right before the Noun; for TWO items use 'the taller' (never 'tallest')."
        ariaLabel="OSASCOMP adjective ordering slots before head noun"
      >
        {slots.map(([lettr, lbl, ex], idx) => {
          const x = 16 + idx * 58;
          return (
            <g key={`${lettr}-${idx}`}>
              <rect x={x} y="30" width="53" height="92" rx="8" fill="#10251B" stroke={idx === 1 || idx >= 6 ? '#FFD84D' : '#3BDC86'} strokeWidth="1.5" />
              <text x={x + 26.5} y="54" fill="#FFD84D" fontSize="15" fontWeight="900" textAnchor="middle">{lettr}</text>
              <text x={x + 26.5} y="74" fill="#9EC4B1" fontSize="9.5" fontWeight="700" textAnchor="middle">{lbl}</text>
              <text x={x + 26.5} y="102" fill="#FFFFFF" fontSize="10.5" fontWeight="700" textAnchor="middle">{ex}</text>
            </g>
          );
        })}
        <rect x="20" y="138" width="520" height="52" rx="10" fill="#183A2B" stroke="#7DD3FC" strokeWidth="1.4" />
        <text x="280" y="159" fill="#FFFFFF" fontSize="11.5" fontWeight="700" textAnchor="middle">
          Latinate Comparatives: senior / junior / superior / inferior / prefer + TO (NEVER &quot;more&quot; or &quot;than&quot;!)
        </text>
        <text x="280" y="178" fill="#FFD84D" fontSize="11" fontWeight="700" textAnchor="middle">
          Adverb End Order = M–P–T: Manner (brilliantly) → Place (in the hall) → Time (last night)
        </text>
      </EngStageShell>
    );
  }

  // 11. Prepositions, Conjunctions & Collocations
  if (topicId === 'e-prep' || topicId === 'e-cloze') {
    return (
      <EngStageShell
        title="Collocation & Correlative Bridge Locks"
        caption="Active 'comprise/discuss/emphasise' take ZERO preposition; 'look forward to / accustomed to' take '-ing'; correlative pairs never mix!"
        ariaLabel="Preposition collocation and correlative conjunction diagram"
      >
        <rect x="20" y="20" width="250" height="170" rx="12" fill="#10251B" stroke="#FFD84D" strokeWidth="1.6" />
        <text x="145" y="42" fill="#FFD84D" fontSize="11.5" fontWeight="800" textAnchor="middle">ZERO-PREPOSITION VERBS</text>
        <text x="34" y="66" fill="#3BDC86" fontSize="11" fontWeight="700">✓ comprises ten chapters (NO &quot;of&quot;)</text>
        <text x="34" y="86" fill="#3BDC86" fontSize="11" fontWeight="700">✓ discussed the budget (NO &quot;about&quot;)</text>
        <text x="34" y="106" fill="#3BDC86" fontSize="11" fontWeight="700">✓ emphasised safety (NO &quot;on&quot;)</text>
        <text x="34" y="132" fill="#7DD3FC" fontSize="11" fontWeight="700">PREPOSITIONAL &quot;TO + V-ING&quot;:</text>
        <text x="34" y="152" fill="#E6F4EC" fontSize="11">• look forward to SEEING you</text>
        <text x="34" y="171" fill="#E6F4EC" fontSize="11">• with a view to CUTTING waste</text>

        <rect x="286" y="20" width="254" height="170" rx="12" fill="#10251B" stroke="#7DD3FC" strokeWidth="1.6" />
        <text x="413" y="42" fill="#7DD3FC" fontSize="11.5" fontWeight="800" textAnchor="middle">CORRELATIVE &amp; CLOZE LOCKS</text>
        <text x="300" y="66" fill="#FFD84D" fontSize="11" fontWeight="700">• No sooner ... THAN</text>
        <text x="300" y="86" fill="#FFD84D" fontSize="11" fontWeight="700">• Hardly / Scarcely ... WHEN</text>
        <text x="300" y="106" fill="#E6F4EC" fontSize="11">• Despite X = In spite of X (NO &quot;despite of&quot;)</text>
        <text x="300" y="126" fill="#E6F4EC" fontSize="11">• Between 8 a.m. AND 4 p.m. (NO &quot;to&quot;)</text>
        <text x="300" y="148" fill="#3BDC86" fontSize="11">• wreak havoc · prefer charges · privy to</text>
        <text x="300" y="168" fill="#3BDC86" fontSize="11">• tantamount to · fraught with · lodge a...</text>
      </EngStageShell>
    );
  }

  // 12. Phrases & Clauses Decision Tree
  if (topicId === 'e-phrases' || topicId === 'e-clauses') {
    return (
      <EngStageShell
        title="Grammatical Name & Function 3-Step Decision Tree"
        caption="Step 1: Check inside the underlined words for a FINITE verb (Phrase = NO, Clause = YES). Step 2: Test Noun ('IT') vs Adj (which noun?) vs Adv (when/where/why?)."
        ariaLabel="Decision tree for grammatical name and function of phrases and clauses"
      >
        <rect x="175" y="14" width="210" height="38" rx="9" fill="#FFD84D" />
        <text x="280" y="37" fill="#10251B" fontSize="12" fontWeight="900" textAnchor="middle">Has a FINITE Verb Inside?</text>

        <line x1="220" y1="52" x2="130" y2="80" stroke="#7DD3FC" strokeWidth="2" markerEnd="url(#env-arr-cyan)" />
        <line x1="340" y1="52" x2="430" y2="80" stroke="#3BDC86" strokeWidth="2" markerEnd="url(#env-arr-green)" />

        <rect x="24" y="84" width="232" height="108" rx="10" fill="#10251B" stroke="#7DD3FC" strokeWidth="1.6" />
        <text x="140" y="104" fill="#7DD3FC" fontSize="12" fontWeight="800" textAnchor="middle">NO → PHRASE (incl. -ing / to-V)</text>
        <text x="36" y="126" fill="#E6F4EC" fontSize="10.5">• Noun Phrase → Subj / Obj of verb &quot;...&quot;</text>
        <text x="36" y="146" fill="#E6F4EC" fontSize="10.5">• Adjectival Phrase → Qualifies noun &quot;...&quot;</text>
        <text x="36" y="166" fill="#E6F4EC" fontSize="10.5">• Adverbial Phrase → Modifies verb &quot;...&quot;</text>
        <text x="36" y="183" fill="#FFD84D" fontSize="10">Always quote the exact verb/noun!</text>

        <rect x="304" y="84" width="232" height="108" rx="10" fill="#10251B" stroke="#3BDC86" strokeWidth="1.6" />
        <text x="420" y="104" fill="#3BDC86" fontSize="12" fontWeight="800" textAnchor="middle">YES → SUBORDINATE CLAUSE</text>
        <text x="316" y="126" fill="#E6F4EC" fontSize="10.5">• Noun Clause → Subj/Obj/Prep/Appos.</text>
        <text x="316" y="146" fill="#E6F4EC" fontSize="10.5">• Adjectival (Relative) → Qualifies noun</text>
        <text x="316" y="166" fill="#E6F4EC" fontSize="10.5">• Adverbial (9 types) → Modifies verb</text>
        <text x="316" y="183" fill="#FFD84D" fontSize="10">&quot;The rumour that...&quot; (fails &quot;which&quot; = NP appos!)</text>
      </EngStageShell>
    );
  }

  // 13. Modals & Question Tags
  if (topicId === 'e-modals-tags') {
    return (
      <EngStageShell
        title="Question Tag Polarity Inverter & 6 Special Traps"
        caption="Positive statements flip to Negative tags; Semi-negatives (hardly, scarcely, seldom, little, few) count as NEGATIVE so their tag is POSITIVE!"
        ariaLabel="Question tag polarity inverter diagram"
      >
        <rect x="20" y="22" width="240" height="72" rx="10" fill="#10251B" stroke="#3BDC86" strokeWidth="1.6" />
        <text x="140" y="45" fill="#3BDC86" fontSize="12" fontWeight="800" textAnchor="middle">(+) STATEMENT → (−) TAG</text>
        <text x="140" y="66" fill="#FFFFFF" fontSize="11" textAnchor="middle">&quot;There is A little milk, ISN’T there?&quot;</text>
        <text x="140" y="84" fill="#FFD84D" fontSize="10.5" textAnchor="middle">&quot;I am next, AREN’T I?&quot;</text>

        <rect x="300" y="22" width="240" height="72" rx="10" fill="#10251B" stroke="#7DD3FC" strokeWidth="1.6" />
        <text x="420" y="45" fill="#7DD3FC" fontSize="12" fontWeight="800" textAnchor="middle">(−) / SEMI-NEG → (+) TAG</text>
        <text x="420" y="66" fill="#FFFFFF" fontSize="11" textAnchor="middle">&quot;She HARDLY calls, DOES she?&quot;</text>
        <text x="420" y="84" fill="#FFD84D" fontSize="10.5" textAnchor="middle">&quot;There is little milk, IS there?&quot;</text>

        <rect x="20" y="108" width="520" height="82" rx="10" fill="#183A2B" stroke="#FFD84D" strokeWidth="1.5" />
        <text x="280" y="130" fill="#FFD84D" fontSize="11.5" fontWeight="800" textAnchor="middle">SPECIAL PRONOUN &amp; MODAL TAGS</text>
        <text x="38" y="152" fill="#E6F4EC" fontSize="11">• Let’s go, SHALL WE?   • Open the door, WILL YOU?   • Everyone clapped, DIDN’T THEY?</text>
        <text x="38" y="174" fill="#E6F4EC" fontSize="11">• He used to smoke, DIDN’T HE?   • Past Deduction: must have + V₃ vs couldn’t have + V₃</text>
      </EngStageShell>
    );
  }

  // 14. Active/Passive & Reported Speech
  if (topicId === 'e-voice-speech') {
    return (
      <EngStageShell
        title="Active ↔ Passive Swap & Reported Speech Backshift Engine"
        caption="Passive preserves exact tense via [BE + V₃] ('is painting' → 'is BEING painted'); Reported Questions revert to Subject + Verb statement order!"
        ariaLabel="Active passive swap and reported speech backshift diagram"
      >
        <rect x="20" y="20" width="250" height="170" rx="12" fill="#10251B" stroke="#FFD84D" strokeWidth="1.6" />
        <text x="145" y="42" fill="#FFD84D" fontSize="11.5" fontWeight="800" textAnchor="middle">ACTIVE → PASSIVE [BE + V₃]</text>
        <text x="34" y="66" fill="#E6F4EC" fontSize="10.5">• writes → is/are written</text>
        <text x="34" y="86" fill="#3BDC86" fontSize="10.5" fontWeight="700">• is writing → is BEING written</text>
        <text x="34" y="106" fill="#E6F4EC" fontSize="10.5">• has written → has BEEN written</text>
        <text x="34" y="126" fill="#E6F4EC" fontSize="10.5">• wrote → was/were written</text>
        <text x="34" y="150" fill="#FCA5A5" fontSize="10.5">✗ Intransitive (occur/happen/arrive):</text>
        <text x="34" y="168" fill="#FCA5A5" fontSize="10.5">NEVER passive (*was occurred)!</text>

        <rect x="286" y="20" width="254" height="170" rx="12" fill="#10251B" stroke="#7DD3FC" strokeWidth="1.6" />
        <text x="413" y="42" fill="#7DD3FC" fontSize="11.5" fontWeight="800" textAnchor="middle">REPORTED SPEECH SHIFTS</text>
        <text x="300" y="66" fill="#E6F4EC" fontSize="10.5">• V₁ → V₂  |  V₂ / have V₃ → had + V₃</text>
        <text x="300" y="86" fill="#E6F4EC" fontSize="10.5">• tomorrow → the following day</text>
        <text x="300" y="106" fill="#E6F4EC" fontSize="10.5">• yesterday → the previous day</text>
        <text x="300" y="130" fill="#FFD84D" fontSize="11" fontWeight="700">Reported Question = Statement Order:</text>
        <text x="300" y="150" fill="#3BDC86" fontSize="11" fontWeight="700">✓ &quot;...asked how old I WAS.&quot;</text>
        <text x="300" y="170" fill="#FCA5A5" fontSize="10.5">✗ &quot;...asked how old was I.&quot;</text>
      </EngStageShell>
    );
  }

  // 15. Conditionals & Subjunctive
  if (topicId === 'e-conditionals') {
    return (
      <EngStageShell
        title="Conditionals (Types 1–3) & High-Yield Subjunctive Triggers"
        caption="Memorise 'It is high time + Subject + V₂ (went/started)' and Mandative 'recommend/insist that + Subject + bare stem (be/apologise)'!"
        ariaLabel="Conditionals and subjunctive mood formula plate"
      >
        <rect x="18" y="18" width="262" height="174" rx="12" fill="#10251B" stroke="#3BDC86" strokeWidth="1.6" />
        <text x="149" y="40" fill="#3BDC86" fontSize="11.5" fontWeight="800" textAnchor="middle">CONDITIONAL EQUATIONS</text>
        <text x="30" y="66" fill="#E6F4EC" fontSize="11">Type 1: If + V₁  →  will + V₁</text>
        <text x="30" y="94" fill="#FFD84D" fontSize="11" fontWeight="700">Type 2: If + V₂ (were)  →  would + V₁</text>
        <text x="30" y="122" fill="#7DD3FC" fontSize="11" fontWeight="700">Type 3: If + had V₃  →  would have V₃</text>
        <rect x="30" y="138" width="238" height="40" rx="7" fill="#183A2B" />
        <text x="149" y="162" fill="#FFFFFF" fontSize="10.5" fontWeight="700" textAnchor="middle">Inverted: &quot;Had I known, I would have...&quot;</text>

        <rect x="292" y="18" width="250" height="174" rx="12" fill="#10251B" stroke="#FFD84D" strokeWidth="1.6" />
        <text x="417" y="40" fill="#FFD84D" fontSize="11.5" fontWeight="800" textAnchor="middle">SUBJUNCTIVE GOLDMINE</text>
        <text x="306" y="66" fill="#FFFFFF" fontSize="11" fontWeight="700">1. It is (high) time + Subj + V₂:</text>
        <text x="306" y="84" fill="#3BDC86" fontSize="11">&quot;It is high time we WENT home.&quot;</text>
        <text x="306" y="112" fill="#FFFFFF" fontSize="11" fontWeight="700">2. would rather + NEW Subj + V₂:</text>
        <text x="306" y="130" fill="#3BDC86" fontSize="11">&quot;I’d rather you STAYED.&quot;</text>
        <text x="306" y="156" fill="#FFFFFF" fontSize="11" fontWeight="700">3. Mandative (insist/urge that):</text>
        <text x="306" y="174" fill="#7DD3FC" fontSize="11">&quot;...recommended that he BE freed.&quot;</text>
      </EngStageShell>
    );
  }

  // 16. Modifiers, Parallelism & Inversion + Usage Traps
  if (topicId === 'e-modifiers' || topicId === 'e-usage-traps') {
    return (
      <EngStageShell
        title={topicId === 'e-modifiers' ? 'Modifier Attachment, Parallelism & Negative Inversion' : 'Eliminating Pleonasms (Tautology) & Non-Standard Traps'}
        caption={
          topicId === 'e-modifiers'
            ? 'An opening participial phrase MUST attach to the subject right after the comma; fronted negative adverbs trigger Auxiliary + Subject inversion!'
            : 'Prefix re- already means "back/again" (never *return back / *repeat again); say "a mature student", "by instalments", and "in the shade"!'
        }
        ariaLabel="Sentence structure traps and corrections plate"
      >
        {topicId === 'e-modifiers' ? (
          <>
            <rect x="20" y="20" width="520" height="52" rx="10" fill="#10251B" stroke="#FFD84D" strokeWidth="1.5" />
            <text x="34" y="42" fill="#FCA5A5" fontSize="11">✗ Dangling: &quot;Walking along the bush path, a snake bit Musa.&quot; (Implies the snake walked!)</text>
            <text x="34" y="61" fill="#3BDC86" fontSize="11" fontWeight="700">✓ Fixed: &quot;Walking along the bush path, MUSA was bitten by a snake.&quot;</text>

            <rect x="20" y="82" width="520" height="50" rx="10" fill="#10251B" stroke="#7DD3FC" strokeWidth="1.5" />
            <text x="34" y="103" fill="#7DD3FC" fontSize="11.5" fontWeight="800">FRONTED NEGATIVE INVERSION = [Neg. Opener] + AUX + SUBJECT + V₁/V₃</text>
            <text x="34" y="122" fill="#FFFFFF" fontSize="11">&quot;Little DID Kola know...&quot; · &quot;Hardly HAD she sat when...&quot; · &quot;Under no circumstances SHOULD you...&quot;</text>

            <rect x="20" y="142" width="520" height="48" rx="10" fill="#10251B" stroke="#3BDC86" strokeWidth="1.5" />
            <text x="34" y="162" fill="#3BDC86" fontSize="11.5" fontWeight="800">PARALLELISM:</text>
            <text x="135" y="162" fill="#FFFFFF" fontSize="11">&quot;reducing waste, boosting output, AND creating jobs&quot; (all -ing!)</text>
            <text x="34" y="180" fill="#9EC4B1" fontSize="10.5">&quot;praised not only [for his honesty] but also [for his diligence]&quot;</text>
          </>
        ) : (
          <>
            <rect x="20" y="20" width="250" height="170" rx="12" fill="#10251B" stroke="#FCA5A5" strokeWidth="1.5" />
            <text x="145" y="42" fill="#FCA5A5" fontSize="11.5" fontWeight="800" textAnchor="middle">✗ NON-STANDARD TRAPS</text>
            <text x="34" y="66" fill="#E6F4EC" fontSize="11">• *return back / *repeat again</text>
            <text x="34" y="86" fill="#E6F4EC" fontSize="11">• *night vigil / *consensus of opinion</text>
            <text x="34" y="106" fill="#E6F4EC" fontSize="11">• *should in case / *can be able</text>
            <text x="34" y="126" fill="#E6F4EC" fontSize="11">• *a matured man / *wake-keeping</text>
            <text x="34" y="146" fill="#E6F4EC" fontSize="11">• *borrow me / *under the shade</text>
            <text x="34" y="166" fill="#E6F4EC" fontSize="11">• *installmental / *offhead</text>

            <rect x="286" y="20" width="254" height="170" rx="12" fill="#10251B" stroke="#3BDC86" strokeWidth="1.6" />
            <text x="413" y="42" fill="#3BDC86" fontSize="11.5" fontWeight="800" textAnchor="middle">✓ STANDARD ENGLISH FORMS</text>
            <text x="300" y="66" fill="#FFFFFF" fontSize="11" fontWeight="700">• return / repeat</text>
            <text x="300" y="86" fill="#FFFFFF" fontSize="11" fontWeight="700">• vigil / consensus</text>
            <text x="300" y="106" fill="#FFFFFF" fontSize="11" fontWeight="700">• in case (or should...) / can</text>
            <text x="300" y="126" fill="#FFFFFF" fontSize="11" fontWeight="700">• a MATURE man / wake (wake-keep)</text>
            <text x="300" y="146" fill="#FFFFFF" fontSize="11" fontWeight="700">• LEND me / IN the shade</text>
            <text x="300" y="166" fill="#FFFFFF" fontSize="11" fontWeight="700">• by instalments / by heart (offhand)</text>
          </>
        )}
      </EngStageShell>
    );
  }

  // 17. Lexis, Registers, Phrasal Verbs & Sentence Interpretation
  if (
    topicId === 'e-lexis-syn' ||
    topicId === 'e-registers' ||
    topicId === 'e-phrasal-idioms' ||
    topicId === 'e-register-syn'
  ) {
    return (
      <EngStageShell
        title="Lexis, Registers & Idiomatic Interpretation Matrix"
        caption="Always decode words and idioms from full-sentence CONTEXT — literal meanings are deliberate distractors!"
        ariaLabel="Lexis registers phrasal verbs and idioms visual chart"
      >
        <rect x="18" y="20" width="166" height="170" rx="12" fill="#10251B" stroke="#FFD84D" strokeWidth="1.6" />
        <text x="101" y="42" fill="#FFD84D" fontSize="11.5" fontWeight="800" textAnchor="middle">PARONYMS &amp; CONTEXT</text>
        <text x="30" y="66" fill="#E6F4EC" fontSize="10.5">• eminent (famous)</text>
        <text x="30" y="82" fill="#9EC4B1" fontSize="10.5">  vs imminent (soon)</text>
        <text x="30" y="104" fill="#E6F4EC" fontSize="10.5">• disinterested (fair)</text>
        <text x="30" y="120" fill="#9EC4B1" fontSize="10.5">  vs uninterested (bored)</text>
        <text x="30" y="144" fill="#3BDC86" fontSize="10.5">• militate AGAINST</text>
        <text x="30" y="162" fill="#3BDC86" fontSize="10.5">• mitigate (= relieve)</text>

        <rect x="197" y="20" width="166" height="170" rx="12" fill="#10251B" stroke="#7DD3FC" strokeWidth="1.6" />
        <text x="280" y="42" fill="#7DD3FC" fontSize="11.5" fontWeight="800" textAnchor="middle">SPECIALIST REGISTERS</text>
        <text x="209" y="66" fill="#E6F4EC" fontSize="10.5">• Law: subpoena, acquit,</text>
        <text x="209" y="82" fill="#9EC4B1" fontSize="10.5">  libel (print) / slander</text>
        <text x="209" y="104" fill="#E6F4EC" fontSize="10.5">• Med: diagnosis vs</text>
        <text x="209" y="120" fill="#9EC4B1" fontSize="10.5">  prognosis, benign</text>
        <text x="209" y="144" fill="#E6F4EC" fontSize="10.5">• Air: hangar → taxi →</text>
        <text x="209" y="162" fill="#FFD84D" fontSize="10.5">  runway → cockpit</text>

        <rect x="376" y="20" width="166" height="170" rx="12" fill="#10251B" stroke="#3BDC86" strokeWidth="1.6" />
        <text x="459" y="42" fill="#3BDC86" fontSize="11.5" fontWeight="800" textAnchor="middle">IDIOMS &amp; PARAPHRASE</text>
        <text x="388" y="66" fill="#E6F4EC" fontSize="10.5">• round OFF a speech</text>
        <text x="388" y="84" fill="#E6F4EC" fontSize="10.5">• round UP suspects</text>
        <text x="388" y="106" fill="#FFD84D" fontSize="10.5">• For all X = Despite X</text>
        <text x="388" y="124" fill="#FFD84D" fontSize="10.5">• all but = almost</text>
        <text x="388" y="144" fill="#E6F4EC" fontSize="10.5">• white elephant = costly</text>
        <text x="388" y="162" fill="#9EC4B1" fontSize="10.5">  useless project</text>
      </EngStageShell>
    );
  }

  // 18. Comprehension, Summary & Figures of Speech
  if (
    topicId === 'e-comp-lit' ||
    topicId === 'e-summary' ||
    topicId === 'e-figures' ||
    topicId === 'e-comp-crit'
  ) {
    return (
      <EngStageShell
        title={
          topicId === 'e-summary'
            ? '30-Mark Summary Pruning Funnel (Raw Passage → Autonomous Sentence)'
            : 'Comprehension, Inference & Figurative Contrast Blueprint'
        }
        caption={
          topicId === 'e-summary'
            ? 'Strip examples, similes, and repetitions → replace lists with one hypernym → output 1 complete sentence (Subject + Finite Verb) per point!'
            : 'Track pivot words (however, yet) for the author’s real stance, and separate Oxymoron/Paradox, Synecdoche/Metonymy, and Euphemism/Litotes.'
        }
        ariaLabel="Reading comprehension, summary pruning, and figures of speech plate"
      >
        {topicId === 'e-summary' ? (
          <>
            <polygon points="35,28 245,28 205,112 75,112" fill="#10251B" stroke="#FFD84D" strokeWidth="1.6" />
            <text x="140" y="52" fill="#FFD84D" fontSize="11" fontWeight="800" textAnchor="middle">RAW 500-WORD PASSAGE</text>
            <text x="140" y="72" fill="#FCA5A5" fontSize="10" textAnchor="middle">Prune: examples, idioms,</text>
            <text x="140" y="88" fill="#FCA5A5" fontSize="10" textAnchor="middle">statistics, flowery adjectives</text>
            <line x1="230" y1="74" x2="282" y2="74" stroke="#3BDC86" strokeWidth="2.5" markerEnd="url(#env-arr-green)" />
            <rect x="290" y="24" width="250" height="162" rx="12" fill="#10251B" stroke="#3BDC86" strokeWidth="1.6" />
            <text x="415" y="46" fill="#3BDC86" fontSize="11.5" fontWeight="800" textAnchor="middle">5 IRON SUMMARY LAWS</text>
            <text x="304" y="68" fill="#FFFFFF" fontSize="10.5">1. Full Sentence (Subj + Finite Verb)</text>
            <text x="304" y="88" fill="#FFFFFF" fontSize="10.5">2. Own Words (Lifting = 0 marks!)</text>
            <text x="304" y="108" fill="#FFFFFF" fontSize="10.5">3. Compress Lists (&quot;food crops&quot;)</text>
            <text x="304" y="128" fill="#FFFFFF" fontSize="10.5">4. ONE point per numbered slot</text>
            <text x="304" y="148" fill="#FFD84D" fontSize="10.5">5. Zero grammar/spelling slips</text>
            <text x="140" y="152" fill="#7DD3FC" fontSize="11" fontWeight="700" textAnchor="middle">Skip risky preambles → write</text>
            <text x="140" y="170" fill="#7DD3FC" fontSize="11" fontWeight="700" textAnchor="middle">clean standalone sentences!</text>
          </>
        ) : (
          <>
            <rect x="20" y="20" width="252" height="170" rx="12" fill="#10251B" stroke="#FFD84D" strokeWidth="1.6" />
            <text x="146" y="42" fill="#FFD84D" fontSize="11.5" fontWeight="800" textAnchor="middle">FIGURES OF SPEECH PAIRS</text>
            <text x="34" y="66" fill="#E6F4EC" fontSize="10.5">• Oxymoron: &quot;deafening silence&quot; (2 words)</text>
            <text x="34" y="84" fill="#E6F4EC" fontSize="10.5">• Paradox: &quot;Child is father of the man&quot;</text>
            <text x="34" y="106" fill="#7DD3FC" fontSize="10.5">• Synecdoche: part/whole (&quot;7 mouths&quot;)</text>
            <text x="34" y="124" fill="#7DD3FC" fontSize="10.5">• Metonymy: symbol (&quot;Bench / Crown&quot;)</text>
            <text x="34" y="146" fill="#3BDC86" fontSize="10.5">• Euphemism: &quot;joined his ancestors&quot;</text>
            <text x="34" y="164" fill="#3BDC86" fontSize="10.5">• Litotes: &quot;no mean feat&quot; (= great!)</text>

            <rect x="288" y="20" width="252" height="170" rx="12" fill="#10251B" stroke="#7DD3FC" strokeWidth="1.6" />
            <text x="414" y="42" fill="#7DD3FC" fontSize="11.5" fontWeight="800" textAnchor="middle">CRITICAL READING &amp; TONE</text>
            <text x="302" y="66" fill="#FFD84D" fontSize="10.5" fontWeight="700">Pivot Law (&quot;Critics say X; YET Y&quot;):</text>
            <text x="302" y="84" fill="#E6F4EC" fontSize="10.5">Author’s true stance sits AFTER &quot;yet&quot;!</text>
            <text x="302" y="108" fill="#E6F4EC" fontSize="10.5">• Pyrrhic victory = ruinously costly win</text>
            <text x="302" y="126" fill="#E6F4EC" fontSize="10.5">• Achilles’ heel = one fatal weakness</text>
            <text x="302" y="144" fill="#E6F4EC" fontSize="10.5">• Rubicon = irreversible step</text>
            <text x="302" y="166" fill="#3BDC86" fontSize="10.5">Match exact tense in word replacement!</text>
          </>
        )}
      </EngStageShell>
    );
  }

  // 19. Default / Writing & Mechanics Layout Blueprint (Letters, Essays, Articles, Speeches, Mechanics)
  return (
    <EngStageShell
      title="50-Mark Continuous Writing & Format Blueprint (COEMA: 10 · 10 · 20 · 10)"
      caption="Match exact genre architecture: Formal Letter (2 addresses + Yours faithfully,), Informal (1 address + first name), Article (Title + Full Name & Town), Debate (Vocatives + 1 firm stance)."
      ariaLabel="Continuous writing layout comparison across formal letter, informal letter, article, and debate"
    >
      <rect x="16" y="20" width="126" height="170" rx="10" fill="#10251B" stroke="#FFD84D" strokeWidth="1.5" />
      <text x="79" y="40" fill="#FFD84D" fontSize="11" fontWeight="800" textAnchor="middle">FORMAL LETTER</text>
      <text x="26" y="60" fill="#E6F4EC" fontSize="9.5">• Writer Addr (Right)</text>
      <text x="26" y="76" fill="#E6F4EC" fontSize="9.5">• Recip. Addr (Left)</text>
      <text x="26" y="92" fill="#E6F4EC" fontSize="9.5">• Dear Sir,</text>
      <text x="26" y="108" fill="#3BDC86" fontSize="9.5">• HEADING (CAPS)</text>
      <text x="26" y="124" fill="#E6F4EC" fontSize="9.5">• No contractions!</text>
      <text x="26" y="146" fill="#FFD84D" fontSize="9.5" fontWeight="700">Yours faithfully,</text>
      <text x="26" y="162" fill="#E6F4EC" fontSize="9.5">Signature + Full Name</text>

      <rect x="150" y="20" width="126" height="170" rx="10" fill="#10251B" stroke="#3BDC86" strokeWidth="1.5" />
      <text x="213" y="40" fill="#3BDC86" fontSize="11" fontWeight="800" textAnchor="middle">INFORMAL / SEMI</text>
      <text x="160" y="60" fill="#E6F4EC" fontSize="9.5">• ONLY 1 Addr (Right)</text>
      <text x="160" y="76" fill="#FCA5A5" fontSize="9.5">• ZERO Heading!</text>
      <text x="160" y="94" fill="#E6F4EC" fontSize="9.5">• Dear Kemi, (Warm)</text>
      <text x="160" y="112" fill="#FFD84D" fontSize="9.5" fontWeight="700">Yours sincerely,</text>
      <text x="160" y="128" fill="#E6F4EC" fontSize="9.5">+ First Name ONLY!</text>
      <text x="160" y="152" fill="#7DD3FC" fontSize="9.5">Semi-Formal: no slang</text>
      <text x="160" y="168" fill="#7DD3FC" fontSize="9.5">+ Full Name at end</text>

      <rect x="284" y="20" width="126" height="170" rx="10" fill="#10251B" stroke="#7DD3FC" strokeWidth="1.5" />
      <text x="347" y="40" fill="#7DD3FC" fontSize="11" fontWeight="800" textAnchor="middle">ARTICLE (PRINT)</text>
      <text x="294" y="60" fill="#FCA5A5" fontSize="9.5">• ZERO Addresses!</text>
      <text x="294" y="76" fill="#FCA5A5" fontSize="9.5">• ZERO &quot;Dear Sir&quot;!</text>
      <text x="294" y="96" fill="#FFD84D" fontSize="9.5" fontWeight="700">• CATCHY TITLE</text>
      <text x="294" y="114" fill="#E6F4EC" fontSize="9.5">• Engaging paragraphs</text>
      <text x="294" y="144" fill="#3BDC86" fontSize="9.5" fontWeight="700">Bottom Byline:</text>
      <text x="294" y="160" fill="#E6F4EC" fontSize="9.5">Full Name + Town</text>
      <text x="294" y="176" fill="#9EC4B1" fontSize="9">(or SS 3A for school)</text>

      <rect x="418" y="20" width="126" height="170" rx="10" fill="#10251B" stroke="#FDE68A" strokeWidth="1.5" />
      <text x="481" y="40" fill="#FDE68A" fontSize="11" fontWeight="800" textAnchor="middle">DEBATE / SPEECH</text>
      <text x="428" y="60" fill="#FFD84D" fontSize="9.5" fontWeight="700">• Ranked Vocatives:</text>
      <text x="428" y="76" fill="#E6F4EC" fontSize="9">  Mr Chairman, Judges,</text>
      <text x="428" y="90" fill="#E6F4EC" fontSize="9">  Timekeeper...</text>
      <text x="428" y="110" fill="#3BDC86" fontSize="9.5">• ONE firm stance!</text>
      <text x="428" y="128" fill="#E6F4EC" fontSize="9.5">• Rebuttal + 3 points</text>
      <text x="428" y="152" fill="#FFD84D" fontSize="9.5" fontWeight="700">• Close: &quot;Thank you.&quot;</text>
      <text x="428" y="170" fill="#9EC4B1" fontSize="9">450+ words · Check spelling!</text>
    </EngStageShell>
  );
}
