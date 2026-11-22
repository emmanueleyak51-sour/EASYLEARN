import React, { useState } from 'react';
import type { SubjectId } from '../../types';

const CONSTITUTION_SECTIONS = [
  { chapter: 'Chapter I', title: 'General Provisions (Sections 1–12)', summary: 'Supremacy of the Constitution, Nigeria as an indivisible federal republic, and separation of powers into Legislature, Executive and Judiciary.' },
  { chapter: 'Chapter II', title: 'Fundamental Objectives & Directive Principles', summary: 'Social, economic, educational and foreign policy goals of the Nigerian state (generally non-justiciable guides for governance).' },
  { chapter: 'Chapter III', title: 'Citizenship (Sections 25–32)', summary: 'Three routes to Nigerian citizenship: by birth, by registration, and by naturalisation.' },
  { chapter: 'Chapter IV', title: 'Fundamental Human Rights (Sections 33–46)', summary: 'Right to life, dignity, personal liberty, fair hearing, privacy, freedom of thought/conscience, expression, peaceful assembly, movement and freedom from discrimination.' },
  { chapter: 'Exclusive List', title: 'Federal Government only (68 items)', summary: 'Defence, currency, foreign affairs, aviation, customs, police, railways, mines and minerals.' },
  { chapter: 'Concurrent List', title: 'Shared by Federal & State Governments', summary: 'Education, electricity generation, agriculture, antiquities and scientific research — Federal law prevails when conflict arises.' },
];

const NIGERIA_REPUBLICS = [
  { era: 'First Republic (1963–1966)', system: 'Parliamentary (Westminster)', leaders: 'Nnamdi Azikiwe (President) & Abubakar Tafawa Balewa (Prime Minister)' },
  { era: 'Second Republic (1979–1983)', system: 'Presidential (1979 Constitution)', leaders: 'Shehu Shagari (Executive President)' },
  { era: 'Third Republic (1992–1993)', system: 'Aborted transition', leaders: 'June 12, 1993 election annulled; Interim National Government under Ernest Shonekan' },
  { era: 'Fourth Republic (1999–present)', system: 'Presidential (1999 Constitution)', leaders: 'Continuous civilian democratic rule with 36 states + FCT Abuja' },
];

// Original unseen poetry lines for Literature device spotting (never set texts)
const UNSEEN_LINES = [
  { line: 'The harmattan wind whispered old secrets through the mango leaves.', device: 'Personification', choices: ['Personification', 'Oxymoron', 'Hyperbole'], why: 'The wind is given the human action of whispering secrets.' },
  { line: 'Her exam hall silence was a deafening roar inside her chest.', device: 'Oxymoron', choices: ['Simile', 'Oxymoron', 'Alliteration'], why: '“Deafening” and “silence” place two opposite ideas side by side.' },
  { line: 'Bright brass bells beat briskly by the busy bridge.', device: 'Alliteration', choices: ['Alliteration', 'Irony', 'Metaphor'], why: 'The initial /b/ consonant sound repeats across closely placed words.' },
  { line: 'Time is a stubborn landlord who never forgets a single rent day.', device: 'Metaphor', choices: ['Simile', 'Metaphor', 'Onomatopoeia'], why: 'Time is directly called a landlord without using “like” or “as”.' },
  { line: 'The fire station burned to ashes while the firemen read safety pamphlets.', device: 'Situational irony', choices: ['Situational irony', 'Assonance', 'Allusion'], why: 'The outcome is the exact opposite of what you expect from a fire station.' },
];

const HISTORY_TIMELINE = [
  { era: 'Pre-colonial', year: 'c. 11th century', event: 'Kanem-Bornu & Hausa City-States', detail: 'Trans-Saharan trade flourished across Katsina, Kano, Zaria and Borno.' },
  { era: 'Pre-colonial', year: '14th–17th century', event: 'Rise of Oyo & Benin Empires', detail: 'Oyo developed the Alaafin/Oyomesi check-and-balance system; Benin excelled in diplomacy and brass casting.' },
  { era: 'Pre-colonial', year: '1804', event: 'Sokoto Jihad & Caliphate', detail: 'Usman dan Fodio unified the Hausa states under an emirate administration centred in Sokoto.' },
  { era: 'Colonial', year: '1914', event: 'Amalgamation of Northern & Southern Protectorates', detail: 'Lord Frederick Lugard merged the two protectorates under British Indirect Rule.' },
  { era: 'Colonial', year: '1922–1954', event: 'Clifford, Richards, Macpherson & Lyttleton Constitutions', detail: 'Gradual shift from elective principle in Lagos/Calabar to true federalism in 1954.' },
  { era: 'Post-independence', year: '1 Oct 1960', event: 'Nigerian Independence', detail: 'Nigeria gained independence from Britain and became a Republic on 1 Oct 1963.' },
  { era: 'Post-independence', year: '1975', event: 'Formation of ECOWAS in Lagos', detail: 'Nigeria co-founded the Economic Community of West African States for regional integration.' },
];

const LANGUAGE_PACKS: Record<string, {
  title: string;
  tip: string;
  phrases: { phrase: string; meaning: string; note: string }[];
  numbers: { num: string; word: string }[];
}> = {
  hausa: {
    title: 'Hausa greetings, tones & proverbs',
    tip: 'Hausa uses hooked letters (ɓ, ɗ, ƙ, ƴ) that are distinct consonants from b, d, k, y.',
    phrases: [
      { phrase: 'Sannu da zuwa', meaning: 'Welcome', note: 'Warm everyday greeting' },
      { phrase: 'Ina kwana? — Lafiya lau', meaning: 'Good morning — Very well', note: 'Morning greeting & reply' },
      { phrase: 'Na gode sosai', meaning: 'Thank you very much', note: 'Polite expression of gratitude' },
      { phrase: 'Haba! Komai yana da iyaka', meaning: 'Everything has a limit', note: 'Common proverb (karin magana)' },
    ],
    numbers: [
      { num: '1', word: 'ɗaya' }, { num: '2', word: 'biyu' }, { num: '3', word: 'uku' },
      { num: '4', word: 'huɗu' }, { num: '5', word: 'biyar' }, { num: '10', word: 'goma' },
    ],
  },
  igbo: {
    title: 'Igbo orthography, vowel harmony & ilu',
    tip: 'Igbo vowels split into two harmony groups: light (a, ị, ọ, ụ) and heavy (e, i, o, u).',
    phrases: [
      { phrase: 'Nnọọ', meaning: 'Welcome', note: 'Uses dotted ọ (light vowel group)' },
      { phrase: 'Ụtụtụ ọma', meaning: 'Good morning', note: 'All dotted vowels stay in the same harmony group' },
      { phrase: 'Daalụ / Imela', meaning: 'Thank you', note: 'Standard Igbo expressions of thanks' },
      { phrase: 'Onye aghala nwanne ya', meaning: 'Be your brother’s keeper', note: 'Popular Igbo proverb (ilu)' },
    ],
    numbers: [
      { num: '1', word: 'otu' }, { num: '2', word: 'abụọ' }, { num: '3', word: 'atọ' },
      { num: '4', word: 'anọ' }, { num: '5', word: 'ise' }, { num: '10', word: 'iri' },
    ],
  },
  yoruba: {
    title: 'Yoruba Do-Re-Mi tones, greetings & owe',
    tip: 'Yoruba has 3 tones: Do (low, à), Re (mid, unmarked a), Mi (high, á). Tone changes word meaning completely (igbá = calabash, ìgbà = time, igba = 200).',
    phrases: [
      { phrase: 'Ẹ káàbọ̀', meaning: 'Welcome (respectful)', note: 'Use Ẹ for elders or groups' },
      { phrase: 'Ẹ káàárọ̀ — Ó dàárọ̀', meaning: 'Good morning', note: 'Standard morning greeting' },
      { phrase: 'Ẹ ṣé púpọ̀', meaning: 'Thank you very much', note: 'Under-dotted ṣ sounds like “sh”' },
      { phrase: 'Ìwà l’ẹwà', meaning: 'Character is beauty', note: 'Classic Yoruba proverb (òwe)' },
    ],
    numbers: [
      { num: '1', word: 'ọ̀kan' }, { num: '2', word: 'èjì' }, { num: '3', word: 'ẹ̀ta' },
      { num: '4', word: 'ẹ̀rin' }, { num: '5', word: 'àrún' }, { num: '20', word: 'ogún (base-20)' },
    ],
  },
  french: {
    title: 'French phrases, verbs & gender cues',
    tip: 'Watch masculine (le / un) vs feminine (la / une) nouns and core irregular verbs être, avoir, aller, faire.',
    phrases: [
      { phrase: 'Bonjour, comment allez-vous ?', meaning: 'Hello, how are you? (formal)', note: 'Use vous with teachers & elders' },
      { phrase: 'Je m’appelle… / J’ai seize ans', meaning: 'My name is… / I am 16 years old', note: 'French uses avoir (have) for age' },
      { phrase: 'Où est la bibliothèque ?', meaning: 'Where is the library?', note: 'Feminine noun: la bibliothèque' },
      { phrase: 'Petit à petit, l’oiseau fait son nid', meaning: 'Little by little, the bird builds its nest', note: 'Popular French proverb' },
    ],
    numbers: [
      { num: '1', word: 'un' }, { num: '2', word: 'deux' }, { num: '3', word: 'trois' },
      { num: '10', word: 'dix' }, { num: '20', word: 'vingt' }, { num: '80', word: 'quatre-vingts' },
    ],
  },
  arabic: {
    title: 'Arabic script phrases & root patterns',
    tip: 'Arabic reads from right to left. Most words grow from a 3-letter root (e.g. ك-ت-ب k-t-b gives kitab = book, maktab = desk, katib = writer).',
    phrases: [
      { phrase: 'السَّلَامُ عَلَيْكُمْ (As-salamu alaykum)', meaning: 'Peace be upon you', note: 'Reply: Wa alaykum as-salam' },
      { phrase: 'صَبَاحُ الْخَيْرِ (Sabah al-khayr)', meaning: 'Good morning', note: 'Reply: Sabah an-nur' },
      { phrase: 'شُكْرًا جَزِيلًا (Shukran jazilan)', meaning: 'Thank you very much', note: 'Polite gratitude' },
      { phrase: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ', meaning: 'Seeking knowledge is a duty', note: 'Classic Arabic study maxim' },
    ],
    numbers: [
      { num: '1', word: 'وَاحِد (wahid)' }, { num: '2', word: 'اِثْنَان (ithnan)' }, { num: '3', word: 'ثَلَاثَة (thalathah)' },
      { num: '4', word: 'أَرْبَعَة (arba‘ah)' }, { num: '5', word: 'خَمْسَة (khamsah)' }, { num: '10', word: 'عَشَرَة (‘asharah)' },
    ],
  },
};

export function HumanitiesAndLanguageStudio({ subj }: { subj: SubjectId }) {
  const [search, setSearch] = useState<string>('');
  const [lineIdx, setLineIdx] = useState<number>(0);
  const [pickedDevice, setPickedDevice] = useState<string | null>(null);
  const [histFilter, setHistFilter] = useState<string>('All');

  if (subj === 'govt' || subj === 'civic') {
    const q = search.trim().toLowerCase();
    const filtered = CONSTITUTION_SECTIONS.filter(
      (s) => !q || s.title.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q) || s.chapter.toLowerCase().includes(q)
    );
    return (
      <div className="flex flex-col gap-5">
        <section className="rtc-card rounded-[28px] p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h2 className="h22 text-[var(--ink)]">1999 Nigerian Constitution Explorer</h2>
              <p className="text-[13.5px] text-[var(--dim)]">Search chapters, rights, citizenship and legislative lists</p>
            </div>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rights, citizenship, exclusive..."
              className="min-h-[42px] px-3.5 rounded-[16px] bg-[var(--bg)] border-2 border-[var(--line)] text-[14px] text-[var(--ink)] w-full sm:w-72"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((sec) => (
              <div key={sec.chapter} className="rounded-[20px] bg-[var(--bg)] border-2 border-[var(--line)] p-4">
                <span className="tile-peach px-2.5 py-0.5 rounded-full text-[11.5px] font-bold">{sec.chapter}</span>
                <h3 className="font-extrabold text-[15px] text-[var(--ink)] mt-2">{sec.title}</h3>
                <p className="text-[13.5px] text-[var(--dim)] mt-1 leading-relaxed">{sec.summary}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rtc-card rounded-[26px] p-5 flex flex-col gap-3">
          <h3 className="h18 text-[var(--ink)]">Nigeria’s Four Republics at a glance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {NIGERIA_REPUBLICS.map((r) => (
              <div key={r.era} className="rounded-[18px] bg-[var(--bg)] border-2 border-[var(--line)] p-4">
                <div className="font-extrabold text-[15px] text-[var(--gold)]">{r.era}</div>
                <div className="text-[13px] font-bold text-[var(--ink)] mt-0.5">{r.system}</div>
                <p className="text-[13px] text-[var(--dim)] mt-1">{r.leaders}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (subj === 'lit') {
    const item = UNSEEN_LINES[lineIdx];
    return (
      <section className="rtc-card rounded-[28px] p-5 sm:p-7 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h2 className="h22 text-[var(--ink)]">Unseen poetry device spotter</h2>
            <p className="text-[13.5px] text-[var(--dim)]">
              Practise spotting literary devices on original unseen lines ({lineIdx + 1} of {UNSEEN_LINES.length})
            </p>
          </div>
          <span className="tile-sky px-3 py-1 rounded-full text-[12px] font-bold">Original unseen verse</span>
        </div>

        <blockquote className="rounded-[22px] bg-[var(--acc-soft)] border-2 border-[var(--acc-line)] p-5 font-[var(--serif)] text-[20px] leading-relaxed text-[var(--ink)]">
          “{item.line}”
        </blockquote>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {item.choices.map((ch) => {
            const chosen = pickedDevice === ch;
            const correct = ch === item.device;
            const stateClass =
              pickedDevice === null
                ? 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)]'
                : correct
                  ? 'bg-[var(--ok-soft)] border-[var(--ok-line)] text-[#0B4A37]'
                  : chosen
                    ? 'bg-[var(--bad-soft)] border-[var(--bad-line)] text-[#8A1C2A]'
                    : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] opacity-70';
            return (
              <button
                key={ch}
                type="button"
                onClick={() => setPickedDevice(ch)}
                className={`min-h-[48px] px-4 rounded-[18px] border-2 font-bold text-[14.5px] cursor-pointer ${stateClass}`}
              >
                {ch}
              </button>
            );
          })}
        </div>

        {pickedDevice && (
          <div className="rounded-[18px] bg-[var(--bg)] border-2 border-[var(--line)] p-4 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-[14px] text-[var(--ink)]">
              <strong className="text-[var(--gold)]">{item.device}:</strong> {item.why}
            </p>
            <button
              type="button"
              onClick={() => {
                setPickedDevice(null);
                setLineIdx((i) => (i + 1) % UNSEEN_LINES.length);
              }}
              className="btn-tactile indigo py-2 px-4 text-[13.5px]"
            >
              Next unseen line
            </button>
          </div>
        )}
      </section>
    );
  }

  if (subj === 'hist') {
    const items = HISTORY_TIMELINE.filter((t) => histFilter === 'All' || t.era === histFilter);
    return (
      <section className="rtc-card rounded-[28px] p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h2 className="h22 text-[var(--ink)]">Nigerian & West African History Timeline</h2>
            <p className="text-[13.5px] text-[var(--dim)]">Filter major milestones from pre-colonial kingdoms to modern Nigeria</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', 'Pre-colonial', 'Colonial', 'Post-independence'].map((era) => (
              <button
                key={era}
                type="button"
                onClick={() => setHistFilter(era)}
                className={`px-3 py-1.5 rounded-[14px] border-2 text-[12.5px] font-bold cursor-pointer ${
                  histFilter === era
                    ? 'bg-[var(--gold)] text-[var(--on-acc)] border-[var(--acc-d)]'
                    : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)]'
                }`}
              >
                {era}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.event} className="rounded-[20px] bg-[var(--bg)] border-2 border-[var(--line)] p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="tile-peach px-3 py-1 rounded-full text-[12.5px] font-extrabold shrink-0 self-start">
                {item.year}
              </span>
              <div>
                <h3 className="font-extrabold text-[15.5px] text-[var(--ink)]">{item.event}</h3>
                <p className="text-[13.5px] text-[var(--dim)] mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Languages (Hausa, Igbo, Yoruba, French, Arabic)
  const pack = LANGUAGE_PACKS[subj] || LANGUAGE_PACKS.yoruba;
  const speak = (text: string) => {
    try {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = subj === 'french' ? 'fr-FR' : subj === 'arabic' ? 'ar-SA' : 'en-NG';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch {
      /* ignore if speech unsupported */
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="rtc-card rounded-[28px] p-5 sm:p-6 flex flex-col gap-4">
        <div>
          <h2 className="h22 text-[var(--ink)]">{pack.title}</h2>
          <p className="text-[13.5px] text-[var(--dim)] mt-1">{pack.tip}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pack.phrases.map((p) => (
            <div key={p.phrase} className="rounded-[20px] bg-[var(--bg)] border-2 border-[var(--line)] p-4 flex flex-col justify-between gap-2">
              <div>
                <div className="text-[17px] font-extrabold text-[var(--ink)]">{p.phrase}</div>
                <div className="text-[14px] font-bold text-[var(--gold)] mt-0.5">{p.meaning}</div>
                <p className="text-[12.5px] text-[var(--dim)] mt-1">{p.note}</p>
              </div>
              <button
                type="button"
                onClick={() => speak(p.phrase)}
                className="self-start px-3 py-1.5 rounded-[14px] bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[12px] font-bold text-[var(--gold)] cursor-pointer"
              >
                Listen aloud
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rtc-card rounded-[26px] p-5 flex flex-col gap-3">
        <h3 className="h18 text-[var(--ink)]">Core numbers</h3>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
          {pack.numbers.map((n) => (
            <div key={n.num} className="rounded-[18px] tile-mint p-3 text-center">
              <div className="text-[20px] font-extrabold">{n.num}</div>
              <div className="text-[13px] font-bold">{n.word}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
