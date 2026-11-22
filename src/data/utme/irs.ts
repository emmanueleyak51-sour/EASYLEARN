import { buildUtmeSubjectCurriculum, type UtmeTopicSpec } from './builder';

const IRS_SPECS: UtmeTopicSpec[] = [
  {
    id: 'irs-quran-revelation-tafsir',
    name: 'Revelation, preservation and tafsir of the Qur’an',
    sec: 'The Glorious Qur’an',
    goals: [
      'Trace the gradual revelation (wahy), compilation under Abu Bakr and standardisation under Uthman',
      'Explain the meaning, sources and rules of Tafsir (Qur’anic exegesis)',
    ],
    trap: 'Do not confuse the roles of Abu Bakr and Uthman: Abu Bakr compiled the first complete single copy (suhuf) after the Battle of Yamamah, while Uthman produced standardised copies in the Quraysh dialect and distributed them to major provinces.',
    parts: [
      {
        title: 'Revelation and preservation of the Qur’an',
        idea: 'The Glorious Qur’an is the final revelation of Allah sent to Prophet Muhammad (SAW) through Angel Jibril over 23 years (13 years in Makkah, 10 years in Madinah). Gradual revelation made memorisation easy, responded to real events and eased believers into Islamic rules step by step. It was preserved simultaneously in memory (hifz) and writing by scribes such as Zayd ibn Thabit.',
        terms: [
          ['Wahy', 'Divine revelation from Allah to His prophets, primarily delivered to Prophet Muhammad (SAW) by Angel Jibril'],
          ['Makkan vs Madinan surahs', 'Makkan chapters stress Tawhid, resurrection and moral character; Madinan chapters cover law, social life and governance'],
          ['Mushaf Uthmani', 'The standardised written copy of the Qur’an prepared under Caliph Uthman ibn Affan'],
        ],
        rules: [
          'The very first verses revealed were Surah al-Alaq (96:1–5) in the Cave of Hira ("Read in the name of your Lord...").',
          'After many memorisers (huffaz) fell at the Battle of Yamamah, Umar advised Caliph Abu Bakr to compile one master copy led by Zayd ibn Thabit.',
          'Under Caliph Uthman, differences in regional recitation dialects prompted the standardisation of copies distributed to major Islamic centres.',
        ],
        table: {
          headers: ['Stage', 'Leader & key scribe', 'Purpose'],
          rows: [
            ['Prophet’s lifetime', 'Prophet Muhammad (SAW) & scribes like Zayd ibn Thabit', 'Memorised and recorded on parchment, bone and leather as revealed'],
            ['Caliph Abu Bakr', 'Zayd ibn Thabit (advised by Umar)', 'Compiled scattered writings into one verified copy after Yamamah'],
            ['Caliph Uthman', 'Committee headed by Zayd ibn Thabit', 'Unified recitation on Quraysh dialect and sent copies to provinces'],
          ],
          trapNote: 'Remember Zayd ibn Thabit headed the compilation committee under BOTH Abu Bakr and Uthman.',
        },
        example: {
          q: 'Why was the Qur’an revealed gradually over 23 years instead of all at once?',
          steps: [
            ['Heart and memory', 'It strengthened the Prophet’s heart and made memorisation and understanding steady'],
            ['Practical guidance', 'Verses answered real questions and introduced social reforms (like prohibiting intoxicants) in manageable stages'],
          ],
        },
        yourTurn: {
          q: 'Which battle’s heavy loss of Qur’an memorisers (huffaz) prompted Caliph Abu Bakr to compile the Qur’an into a single manuscript?',
          o: ['Battle of Yamamah', 'Battle of Badr', 'Battle of Uhud', 'Battle of Tabuk'],
          a: 0,
          h: [
            'This battle happened shortly after the Prophet’s death during Abu Bakr’s caliphate.',
            'Umar ibn al-Khattab feared losing memorisers of the Qur’an after this clash against Musaylimah.',
          ],
          e: 'After many memorisers died at the Battle of Yamamah, Umar persuaded Caliph Abu Bakr to compile the Qur’an into one master manuscript.',
        },
      },
      {
        title: 'Tafsir: explaining the Qur’an',
        idea: 'Tafsir is the scholarly explanation and interpretation of the Qur’an so Muslims apply Allah’s guidance accurately. Authentic Tafsir follows a strict order of sources: explaining the Qur’an by the Qur’an itself, then by the Prophet’s Hadith, then by the understanding of the Companions (Sahabah), and then by sound classical Arabic language and context of revelation (Asbab al-Nuzul).',
        terms: [
          ['Tafsir', 'Authoritative explanation and commentary on the meanings of Qur’anic verses'],
          ['Tafsir bil-Ma’thur', 'Interpretation grounded in transmitted reports (Qur’an, Sunnah and Companions)'],
          ['Asbab al-Nuzul', 'The historical occasions or circumstances behind the revelation of specific verses'],
        ],
        rules: [
          'The highest source of Tafsir is explaining one verse of the Qur’an using another clearer verse of the Qur’an.',
          'A qualified Mufassir (commentator) must master Arabic grammar, Hadith, Islamic jurisprudence (Fiqh) and Asbab al-Nuzul.',
          'Renowned classical Tafsir scholars include Ibn Jarir al-Tabari, Ibn Kathir and al-Qurtubi.',
        ],
        table: {
          headers: ['Rank', 'Source of Tafsir', 'Why it matters'],
          rows: [
            ['1', 'Qur’an by the Qur’an', 'Brief verses in one place are explained in detail elsewhere'],
            ['2', 'Qur’an by the Sunnah / Hadith', 'The Prophet (SAW) is the primary divinely guided explainer'],
            ['3', 'Sayings of the Sahabah', 'Companions witnessed revelation firsthand (e.g., Ibn Abbas)'],
            ['4', 'Classical Arabic & sound reasoning', 'Clarifies idioms, grammar and legal principles'],
          ],
          trapNote: 'Personal opinion without mastery of Arabic and transmitted sources (Tafsir bil-Ra’y al-Madhmum) is rejected in Islamic scholarship.',
        },
        example: {
          q: 'Why does knowing Asbab al-Nuzul (occasions of revelation) help a scholar interpret a verse accurately?',
          steps: [
            ['Identify the context', 'Shows the exact situation or question that prompted the verse'],
            ['Prevent misreading', 'Avoids lifting a verse out of context while preserving its universal moral lesson'],
          ],
        },
        yourTurn: {
          q: 'What is the very first and highest source used in authentic Tafsir of the Qur’an?',
          o: [
            'Interpreting the Qur’an by other verses of the Qur’an itself',
            'Guessing meanings from modern newspapers',
            'Relying solely on poetry from outside Arabia',
            'Ignoring the Arabic text altogether',
          ],
          a: 0,
          h: [
            'Before consulting secondary commentaries, scholars check whether another verse already clarifies the topic.',
            'This is the foundation of Tafsir bil-Ma’thur.',
          ],
          e: 'The highest level of Tafsir is explaining the Qur’an through other verses of the Qur’an, followed by the Prophet’s Hadith.',
        },
      },
    ],
    qs: [
      {
        q: 'Which verses were the very first revealed to Prophet Muhammad (SAW) in the Cave of Hira?',
        o: ['Surah al-Alaq (96:1–5)', 'Surah al-Fatihah (1:1–7)', 'Surah al-Baqarah (2:1–5)', 'Surah al-Ikhlas (112:1–4)'],
        a: 0,
        e: 'The opening five verses of Surah al-Alaq ("Iqra...") were the first revelation in Cave Hira.',
      },
      {
        q: 'Who led the committee appointed by both Abu Bakr and Uthman to compile and standardise the Qur’an?',
        o: ['Zayd ibn Thabit', 'Khalid ibn al-Walid', 'Bilal ibn Rabah', 'Salman al-Farisi'],
        a: 0,
        e: 'Zayd ibn Thabit, a trusted young scribe and memoriser, chaired both committees.',
      },
      {
        q: 'Which feature is most characteristic of Makkan surahs?',
        o: [
          'Short, rhythmic verses emphasising Tawhid, the Day of Judgement and moral uprightness',
          'Long chapters detailing state treaties and inheritance shares',
          'Rules about international diplomacy in Madinah',
          'Military regulations for the army of Madinah',
        ],
        a: 0,
        e: 'Makkan surahs focused on core creed (Tawhid, prophethood, hereafter) and perseverance.',
      },
      {
        q: 'Which Companion earned the title "Interpreter of the Qur’an" (Tarjuman al-Qur’an) for his deep mastery of Tafsir?',
        o: ['Abdullah ibn Abbas', 'Abu Hurayrah', 'Abu Lahab', 'Amr ibn al-As'],
        a: 0,
        e: 'Abdullah ibn Abbas was famously blessed by the Prophet’s prayer for deep understanding of the Qur’an.',
      },
      {
        q: 'What does "Asbab al-Nuzul" mean in Qur’anic studies?',
        o: [
          'The historical occasions or contexts of revelation of specific verses',
          'The vocal rules of reciting the Qur’an melodiously',
          'The number of chapters in the Qur’an',
          'The division of the Qur’an into thirty equal parts',
        ],
        a: 0,
        e: 'Asbab al-Nuzul records the specific events or questions that occasioned the revelation of verses.',
      },
      {
        q: 'Why did Caliph Uthman send official copies of the Qur’an to major provinces of the Muslim world?',
        o: [
          'To preserve uniformity of recitation and prevent disputes over regional dialects',
          'To replace the Arabic text with Persian',
          'To shorten the Qur’an to fifty chapters',
          'Because no one had memorised the Qur’an anymore',
        ],
        a: 0,
        e: 'Standardised Uthmanic copies prevented dialect disputes as Islam expanded across diverse regions.',
      },
    ],
  },
  {
    id: 'irs-surahs-themes',
    name: 'Surahs and themes of the Qur’an',
    sec: 'The Glorious Qur’an',
    goals: [
      'Explain the core themes and lessons of key syllabus surahs (Al-Fatihah, Al-Ikhlas, Al-Falaq, Al-Nas, Al-Asr, Al-Ma’un, Al-Duha, Al-Tin)',
      'Connect Qur’anic teachings on worship, gratitude, time, orphans and sincerity to daily Muslim conduct',
    ],
    trap: 'Do not confuse Surah al-Falaq and Surah al-Nas (the Mu’awwidhatayn): Al-Falaq seeks refuge from external harms (darkness, envy, witchcraft), while Al-Nas seeks refuge from internal whispering (waswas) into human hearts.',
    parts: [
      {
        title: 'Al-Fatihah, Al-Ikhlas and the protective surahs',
        idea: 'Surah al-Fatihah ("The Opening") is recited in every unit of prayer; it praises Allah as Lord of all worlds, declares exclusive worship and asks for guidance along the straight path (Sirat al-Mustaqim). Surah al-Ikhlas defines pure monotheism cleanly: Allah is One, Eternal, neither begets nor was begotten, and has no equal. Al-Falaq and Al-Nas teach believers to seek protection solely from Allah against visible and unseen harms.',
        terms: [
          ['Al-Fatihah (Umm al-Kitab)', 'The Opening chapter of seven verses summarising praise, worship and seeking guidance'],
          ['Al-Ikhlas (Surah 112)', 'The definitive declaration of pure Tawhid, described in Hadith as equal in meaning to a third of the Qur’an'],
          ['Al-Mu’awwidhatayn', 'Surahs al-Falaq (113) and al-Nas (114), recited for Allah’s protection from evil and envy'],
        ],
        rules: [
          'Al-Fatihah balances Allah’s mercy (Al-Rahman, Al-Rahim) with accountability on the Day of Judgement (Maliki Yawmid-Din).',
          'Al-Ikhlas rejects every form of polytheism, anthropomorphism and attributing offspring to Allah.',
          'Seeking refuge in Allah alone in Al-Falaq and Al-Nas replaces superstitious charms and amulets with trust in Allah.',
        ],
        table: {
          headers: ['Surah', 'Chapter no.', 'Central teaching'],
          rows: [
            ['Al-Fatihah', '1', 'Praise of Allah, exclusive worship and prayer for the straight path'],
            ['Al-Ikhlas', '112', 'Absolute Oneness and uniqueness of Allah (Tawhid)'],
            ['Al-Falaq', '113', 'Seeking Allah’s shelter from darkness, malice and envy'],
            ['Al-Nas', '114', 'Seeking Allah’s shelter from evil whisperings in the heart'],
          ],
          trapNote: 'Remember that "Al-Samad" in Surah al-Ikhlas means the Eternal, Self-Sufficient Master upon whom all creation depends while He depends on none.',
        },
        example: {
          q: 'Why is Surah al-Fatihah called "Umm al-Kitab" (Mother of the Book)?',
          steps: [
            ['Review its themes', 'Tawhid (Lord of worlds), Mercy, Hereafter, exclusive worship and seeking guidance'],
            ['Conclude', 'It encapsulates the entire message of the Qur’an in seven concise verses'],
          ],
        },
        yourTurn: {
          q: 'Which attribute of Allah in Surah al-Ikhlas means "the Self-Sufficient Eternal Master on whom all creation depends"?',
          o: ['Al-Samad', 'Al-Falaq', 'Al-Asr', 'Al-Kawthar'],
          a: 0,
          h: [
            'Think of the second verse of Surah al-Ikhlas ("Allahu...").',
            'It affirms that Allah needs nothing while every creature depends on Him.',
          ],
          e: 'Al-Samad signifies Allah’s eternal self-sufficiency and complete independence.',
        },
      },
      {
        title: 'Moral and social surahs: Al-Asr, Al-Ma’un, Al-Duha and Al-Kawthar',
        idea: 'Short Makkan surahs pack powerful life lessons. Surah al-Asr warns that humanity is in loss except those who unite four habits: true faith, righteous deeds, encouraging truth and encouraging patience. Surah al-Ma’un exposes religious hypocrisy — someone who repels orphans, ignores the needy and prays only to be seen. Surah al-Duha comforts the grieving Prophet (SAW) with reassurance and commands kindness to orphans and those who ask.',
        terms: [
          ['Surah al-Asr (103)', 'Swears by time to teach the four pillars of salvation: faith, good deeds, truth and patience'],
          ['Surah al-Ma’un (107)', 'Links genuine faith directly to compassion for orphans, feeding the poor and sincere prayer'],
          ['Surah al-Duha (93)', 'Assures believers that Allah has not forsaken them and that ease follows hardship'],
        ],
        rules: [
          'In Surah al-Asr, personal faith is not enough alone — believers also support one another in truth (haqq) and patience (sabr).',
          'Surah al-Ma’un condemns "riya" (showing off in prayer) and refusing small everyday neighbourly help (ma’un).',
          'Surah al-Duha closes with three duties: do not oppress the orphan, do not scold the petitioner, and proclaim the blessings of your Lord.',
        ],
        table: {
          headers: ['Surah', 'Core moral warning or comfort'],
          rows: [
            ['Al-Asr (103)', 'Time slips away unless anchored in faith, righteous action, truth and patience'],
            ['Al-Ma’un (107)', 'Careless, show-off worship combined with cruelty to orphans denies religion'],
            ['Al-Duha (93)', 'Allah never abandons His faithful servant; gratitude shows in helping the vulnerable'],
            ['Al-Kawthar (108)', 'Abundant goodness is answered with sincere prayer and sacrifice to Allah'],
          ],
          trapNote: 'Surah al-Kawthar (3 verses) is the SHORTEST surah in the Qur’an; Surah al-Baqarah (286 verses) is the longest.',
        },
        example: {
          q: 'According to Surah al-Ma’un, what three behaviours expose someone who truly denies the Day of Judgement?',
          steps: [
            ['Social cruelty', 'Harshly pushing away the orphan and failing to encourage feeding the poor'],
            ['Hypocritical worship', 'Being heedless of prayer, praying merely to be seen, and withholding small neighbourly kindnesses'],
          ],
        },
        yourTurn: {
          q: 'Which four qualities save a person from loss according to Surah al-Asr (103)?',
          o: [
            'Faith, righteous deeds, mutual advice to truth and mutual advice to patience',
            'Wealth, power, long travel and fame',
            'Fasting alone without prayer or charity',
            'Silence, isolation, wealth and pride',
          ],
          a: 0,
          h: [
            'Notice that the first two qualities are personal and the last two are communal.',
            'They combine Iman, Amal Salih, Haqq and Sabr.',
          ],
          e: 'Surah al-Asr lists faith, righteous deeds, enjoining truth and enjoining patience as the four conditions of success.',
        },
      },
    ],
    qs: [
      {
        q: 'Which surah is obligatory to recite in every rak’ah of Salah?',
        o: ['Surah al-Fatihah', 'Surah al-Kawthar', 'Surah al-Tin', 'Surah al-Fil'],
        a: 0,
        e: 'Surah al-Fatihah is an essential pillar of every unit (rak’ah) of Islamic prayer.',
      },
      {
        q: 'Which surah is the shortest chapter in the Glorious Qur’an?',
        o: ['Surah al-Kawthar (108)', 'Surah al-Fatihah (1)', 'Surah al-Falaq (113)', 'Surah al-Duha (93)'],
        a: 0,
        e: 'Surah al-Kawthar consists of just three concise verses.',
      },
      {
        q: 'Surah al-Ma’un strongly condemns worshippers who',
        o: [
          'are neglectful of their prayers, pray only to show off and withhold small acts of kindness',
          'pray quietly at dawn',
          'share meals with neighbours',
          'protect orphans’ property',
        ],
        a: 0,
        e: 'Surah al-Ma’un exposes hypocrisy where outward prayer is detached from sincerity and social care.',
      },
      {
        q: 'Surah al-Duha was revealed to comfort Prophet Muhammad (SAW) during a pause in revelation by assuring him that',
        o: [
          'his Lord has neither forsaken him nor is displeased with him',
          'he would never face opposition in Makkah',
          'revelation had ended permanently',
          'he should leave prayer altogether',
        ],
        a: 0,
        e: 'Surah al-Duha reassured the Prophet (SAW) of Allah’s constant care and future blessings.',
      },
      {
        q: 'Surah al-Nas specifically teaches Muslims to seek refuge in Allah from',
        o: [
          'the retreating whisperer who whispers evil into human hearts',
          'thunderstorms at sea',
          'forgetting trade accounts',
          'physical fatigue after travel',
        ],
        a: 0,
        e: 'Surah al-Nas seeks Allah’s protection from the insidious whisperer (al-Waswas al-Khannas) among jinn and humans.',
      },
      {
        q: 'In Surah al-Fatihah, asking Allah to guide us to "Sirat al-Mustaqim" means asking for',
        o: ['the straight path of truth and obedience', 'material wealth alone', 'victory in trade', 'long journeys'],
        a: 0,
        e: 'Sirat al-Mustaqim is the straight, balanced path of faith and righteous living pleasing to Allah.',
      },
    ],
  },
  {
    id: 'irs-hadith-science',
    name: 'Hadith: collection, classification and selected traditions',
    sec: 'Hadith and Sunnah',
    goals: [
      'Distinguish between Hadith and Sunnah, Isnad and Matn, and the main grades of Hadith (Sahih, Hasan, Da’if, Mawdu’)',
      'Apply core moral lessons from Imam al-Nawawi’s selected Hadiths (intention, brotherhood, halal/haram, avoiding anger and harm)',
    ],
    trap: 'Do not confuse Isnad and Matn: ISNAD is the chain of narrators tracing back to the Prophet (SAW), while MATN is the actual text/message of the Hadith.',
    parts: [
      {
        title: 'Structure, collection and classification of Hadith',
        idea: 'Hadith is the recorded report of what Prophet Muhammad (SAW) said, did or silently approved; Sunnah is his lived way of life — the second primary source of Islamic law after the Qur’an. Every Hadith has two parts: Isnad (the chain of reporters) and Matn (the text). Scholars carefully verified every reporter’s honesty and memory to separate authentic (Sahih) reports from weak (Da’if) or fabricated (Mawdu’) ones, producing the six major collections (Kutub al-Sittah).',
        terms: [
          ['Isnad (Sanad)', 'The unbroken chain of narrators who transmitted a Hadith back to the Prophet (SAW)'],
          ['Matn', 'The actual spoken or reported text/content of the Hadith'],
          ['Sahih vs Da’if', 'Sahih is fully authentic with reliable, continuous narrators; Da’if is weak due to a broken chain or weak narrator'],
          ['Hadith Qudsi', 'A Hadith whose meaning comes directly from Allah while its wording is spoken by Prophet Muhammad (SAW)'],
        ],
        rules: [
          'The six major authentic collections (Kutub al-Sittah) are Sahih al-Bukhari, Sahih Muslim, Sunan Abu Dawud, Jami’ al-Tirmidhi, Sunan al-Nasa’i and Sunan Ibn Majah.',
          'Sahih al-Bukhari and Sahih Muslim are the two most authentic Hadith compilations (Al-Sahihan).',
          'Mawdu’ means a fabricated report falsely attributed to the Prophet (SAW) — strictly rejected.',
        ],
        table: {
          headers: ['Grade', 'Meaning', 'Reliability'],
          rows: [
            ['Sahih', 'Sound / authentic', 'Continuous chain of upright, sharp-memory narrators; zero hidden defect'],
            ['Hasan', 'Good', 'Reliable chain, slightly lighter precision than Sahih; valid for practice'],
            ['Da’if', 'Weak', 'Missing link in chain or unreliable narrator; not used to establish law'],
            ['Mawdu’', 'Fabricated', 'Invented lie attributed to the Prophet (SAW); forbidden to pass as Hadith'],
          ],
          trapNote: 'Distinguish Qur’an from Hadith Qudsi: the Qur’an is Allah’s exact wording recited in Salah, whereas Hadith Qudsi is not recited in Salah and uses the Prophet’s own words.',
        },
        example: {
          q: 'Why did Hadith scholars examine the biography and character (Ilm al-Rijal) of every narrator in an Isnad?',
          steps: [
            ['Check honesty (Adalah)', 'Ensure no narrator was known for lying or open sin'],
            ['Check accuracy (Dabt)', 'Verify strong memory or accurate written notes and prove each teacher actually met their student'],
          ],
        },
        yourTurn: {
          q: 'In Hadith terminology, what is the "Matn"?',
          o: [
            'The actual text or subject matter of the Prophet’s saying or action',
            'The chain of narrators transmitting the report',
            'The town where the collector was born',
            'A fabricated story rejected by scholars',
          ],
          a: 0,
          h: [
            'Every Hadith consists of two halves: the chain (Isnad) and the actual message.',
            'Matn refers to the body/content itself.',
          ],
          e: 'The Matn is the actual content or text of the Hadith, whereas the Isnad is the chain of narrators.',
        },
      },
      {
        title: 'Selected Hadiths of al-Nawawi and daily ethics',
        idea: 'Imam al-Nawawi’s famous Forty Hadiths distil the heart of Islamic conduct. Actions are judged by intentions (Hadith 1); true faith means loving for one’s neighbour/brother what one loves for oneself (Hadith 13); whoever believes in Allah and the Last Day should speak good or stay silent, honour neighbours and guests (Hadith 15); do not become angry (Hadith 16); leave what does not concern you (Hadith 12); and cause neither harm nor retaliatory harm (La darar wa la dirar).',
        terms: [
          ['Niyyah (Intention)', 'Sincere purpose in the heart — determines whether an act earns reward from Allah (Hadith 1)'],
          ['Halal, Haram & Shubuhah', 'Clear lawful, clear unlawful, and doubtful grey areas which the cautious believer avoids (Hadith 6)'],
          ['Good speech & hospitality', 'Speaking kindly or keeping quiet, respecting neighbours and welcoming guests (Hadith 15)'],
        ],
        rules: [
          'Hadith 1 ("Actions are judged by intentions") teaches that sincerity turns even everyday work and study into worship.',
          'Hadith 6 compares the heart to a ruler: if the heart is sound, the whole body is sound; if corrupt, the whole body is corrupt.',
          'Hadith 34 teaches changing wrongdoing with one’s hand (lawful authority), or with one’s tongue (wise advice), or at least detesting it in the heart.',
        ],
        table: {
          headers: ['Hadith theme', 'Practical lesson for students'],
          rows: [
            ['Intentions (Hadith 1)', 'Study and worship sincerely for Allah’s pleasure, not to show off'],
            ['Clear & doubtful matters (Hadith 6)', 'Protect honesty by steering clear of grey, suspicious shortcuts'],
            ['Brotherhood (Hadith 13)', 'Wish classmates and neighbours the same fairness and success you wish for yourself'],
            ['Self-control (Hadith 16)', 'Restrain anger before speaking or acting recklessly'],
          ],
          trapNote: 'In Hadith 34 (changing wrong "with the hand"), Islamic scholars explain that forceful correction belongs to lawful authority or personal responsibility — not vigilante chaos.',
        },
        example: {
          q: 'How does Hadith 15 ("speak good or remain silent") guide a student using social media today?',
          steps: [
            ['Before posting or replying', 'Check whether the comment is true, helpful and kind'],
            ['If it is gossip or insult', 'Stay silent instead of spreading harm online'],
          ],
        },
        yourTurn: {
          q: 'According to the famous first Hadith in al-Nawawi’s collection narrated by Umar ibn al-Khattab, what determines the true value of every deed?',
          o: ['Intentions (Niyyah)', 'Public applause', 'Speed of completion', 'Cost of the deed'],
          a: 0,
          h: [
            'Think of the opening words: "Innama al-a’malu bin-niyyat..."',
            'Two people can do the exact same outward act yet receive different rewards based on what is in their hearts.',
          ],
          e: 'The Prophet (SAW) taught that "actions are judged according to intentions", making sincerity the foundation of every act.',
        },
      },
    ],
    qs: [
      {
        q: 'The unbroken chain of reporters through which a Hadith is traced back to Prophet Muhammad (SAW) is called the',
        o: ['Isnad', 'Matn', 'Qiyas', 'Ijma'],
        a: 0,
        e: 'Isnad (or Sanad) is the chain of narrators verifying how a Hadith was transmitted.',
      },
      {
        q: 'Which two compilations are regarded as the most authentic books of Hadith (Al-Sahihan)?',
        o: [
          'Sahih al-Bukhari and Sahih Muslim',
          'Muwatta Malik and Tafsir al-Jalalayn',
          'Sunan Ibn Majah and Al-Shifa',
          'Kitab al-Kharaj and Al-Risalah',
        ],
        a: 0,
        e: 'Sahih al-Bukhari and Sahih Muslim hold the highest standing among the six canonical Hadith collections.',
      },
      {
        q: 'A Hadith found to have been deliberately invented and falsely attributed to the Prophet (SAW) is graded as',
        o: ['Mawdu’', 'Sahih', 'Hasan', 'Mutawatir'],
        a: 0,
        e: 'Mawdu’ designates a fabricated report that must be rejected.',
      },
      {
        q: 'According to Hadith 6 of al-Nawawi, which organ determines the moral soundness of the entire human body?',
        o: ['The heart', 'The hand', 'The ear', 'The foot'],
        a: 0,
        e: 'The Prophet (SAW) said there is a morsel of flesh in the body — the heart — which if sound makes the whole body sound.',
      },
      {
        q: 'When a man repeatedly asked Prophet Muhammad (SAW) for concise life advice (Hadith 16 of al-Nawawi), the Prophet answered:',
        o: ['"Do not become angry."', '"Travel to distant lands."', '"Never speak to strangers."', '"Store up silver."'],
        a: 0,
        e: 'The Prophet repeated "Do not become angry", highlighting anger as a root of regret and injustice.',
      },
      {
        q: 'Which statement accurately defines a Hadith Qudsi?',
        o: [
          'A sacred tradition whose meaning is from Allah while its wording is expressed by Prophet Muhammad (SAW)',
          'A verse recited as part of the Qur’an during Salah',
          'A legal ruling made solely by a jurist',
          'A Hadith narrated only in Madinah',
        ],
        a: 0,
        e: 'Hadith Qudsi conveys Allah’s direct message in the Prophet’s words and is distinct from the Qur’an.',
      },
    ],
  },
  {
    id: 'irs-tawhid-iman',
    name: 'Tawhid, shirk and the articles of faith',
    sec: 'Aqidah (Islamic creed)',
    goals: [
      'Explain the three dimensions of Tawhid and distinguish major shirk from minor shirk (such as riya)',
      'List and explain the six Articles of Faith (Arkan al-Iman)',
    ],
    trap: 'Do not mix up the Five Pillars of ISLAM (Shahadah, Salah, Zakah, Sawm, Hajj — acts of worship) with the Six Articles of IMAN (belief in Allah, Angels, Books, Messengers, Last Day, Qadar — beliefs of the heart).',
    parts: [
      {
        title: 'Tawhid and avoiding Shirk',
        idea: 'Tawhid — the absolute Oneness of Allah — is the bedrock of Islam. It has three aspects: Tawhid al-Rububiyyah (Allah alone is Creator and Sustainer), Tawhid al-Uluhiyyah (Allah alone deserves worship and supplication), and Tawhid al-Asma’ wal-Sifat (affirming Allah’s beautiful names and attributes without comparing Him to creation). Its opposite is Shirk (associating partners with Allah), the gravest sin in Islam.',
        terms: [
          ['Tawhid', 'Declaring and living by the absolute Oneness of Allah in Lordship, Worship and Names/Attributes'],
          ['Shirk al-Akbar (Major Shirk)', 'Worshipping idols, graves, charms or any partner alongside Allah — nullifies faith unless repented'],
          ['Shirk al-Asghar (Minor Shirk)', 'Hidden insincerity such as Riya (showing off in worship to win human praise)'],
        ],
        rules: [
          'Wearing protective charms (amulets) believing they independently ward off harm violates Tawhid.',
          'Allah forgives every sin if one repents sincerely in this life, while dying upon unrepented Shirk is unforgivable (Qur’an 4:48).',
          'Tawhid liberates human beings from superstition and fear of anything other than Allah.',
        ],
        table: {
          headers: ['Category of Tawhid', 'Core affirmation'],
          rows: [
            ['Al-Rububiyyah (Lordship)', 'Allah alone creates, provides, gives life and governs the universe'],
            ['Al-Uluhiyyah (Worship)', 'Prayer, sacrifice, vows and trust belong exclusively to Allah'],
            ['Al-Asma’ wal-Sifat', 'Allah possesses perfect Names and Attributes unique to Him'],
          ],
          trapNote: 'Even the pre-Islamic Makkans admitted Allah created the heavens (Rububiyyah), yet they committed Shirk by directing worship (Uluhiyyah) to idols.',
        },
        example: {
          q: 'Why did Prophet Muhammad (SAW) describe Riya (showing off in prayer or charity) as "hidden shirk"?',
          steps: [
            ['Check the intention', 'The worshipper performs an act meant for Allah in order to impress people'],
            ['Identify the fault', 'It mixes seeking human applause into worship that belongs to Allah alone'],
          ],
        },
        yourTurn: {
          q: 'Which aspect of Tawhid focuses specifically on directing all acts of worship — prayer, supplication and sacrifice — to Allah alone?',
          o: [
            'Tawhid al-Uluhiyyah',
            'Tawhid al-Rububiyyah',
            'Qiyas',
            'Ijma',
          ],
          a: 0,
          h: [
            'Rububiyyah refers to Lordship and creation; look for the term rooted in "Ilah" (the One worshipped).',
            'It matches the Shahadah: "There is no deity worthy of worship except Allah."',
          ],
          e: 'Tawhid al-Uluhiyyah affirms that Allah alone is worthy of every act of worship and devotion.',
        },
      },
      {
        title: 'The six Articles of Faith (Arkan al-Iman)',
        idea: 'Authentic Islamic belief rests on six pillars of faith (Iman): belief in (1) Allah, (2) His Angels (Mala’ikah), (3) His Revealed Books (Tawrah, Zabur, Injil, Qur’an), (4) His Messengers (from Adam to Muhammad SAW), (5) the Last Day (Yawm al-Qiyamah) and accountability, and (6) Divine Decree (Al-Qada wal-Qadar) — both good and challenging outcomes happen by Allah’s knowledge and wisdom while humans remain responsible for their choices.',
        terms: [
          ['Mala’ikah (Angels)', 'Sinless beings created from light who obey Allah — e.g., Jibril (revelation), Mika’il (rain/sustenance), Israfil (trumpet), Azra’il (angel of death)'],
          ['Revealed Books', 'Tawrah (Musa), Zabur (Dawud), Injil (Isa) and the final preserved Qur’an (Muhammad SAW)'],
          ['Al-Qadar (Divine Decree)', 'Belief that Allah knows, records, wills and creates all things while granting humans moral choice'],
        ],
        rules: [
          'Muslims believe in all prophets without rejecting any — Prophet Muhammad (SAW) is Khatam al-Nabiyyin (Seal of the Prophets).',
          'Belief in the Last Day motivates justice, honesty and hope even when wrongdoing seems unpunished in this world.',
          'Belief in Qadar encourages both hard work ("tie your camel first, then trust in Allah") and calm resilience during setbacks.',
        ],
        table: {
          headers: ['Angel / Book', 'Assigned role / Prophet'],
          rows: [
            ['Jibril', 'Conveying revelation (Wahy) to prophets'],
            ['Kiraman Katibin', 'Recording every human’s good and bad deeds'],
            ['Tawrah / Zabur / Injil', 'Revealed to Musa / Dawud / Isa (AS)'],
            ['The Qur’an', 'Final preserved revelation to Prophet Muhammad (SAW)'],
          ],
          trapNote: 'Belief in Qadar is NOT lazy fatalism — Islam commands effort, study and planning alongside trust in Allah (Tawakkul).',
        },
        example: {
          q: 'How does belief in the recording angels (Kiraman Katibin) and the Last Day shape a student’s honesty during an exam?',
          steps: [
            ['Self-accountability', 'Even if an invigilator looks away, Allah sees and every deed is recorded'],
            ['Moral outcome', 'Encourages genuine integrity rather than cheating'],
          ],
        },
        yourTurn: {
          q: 'Which of the following is one of the six Articles of Faith (Iman) rather than one of the five Pillars of Islam?',
          o: [
            'Belief in Divine Decree (Al-Qadar)',
            'Giving Zakah',
            'Fasting in Ramadan',
            'Performing Hajj to Makkah',
          ],
          a: 0,
          h: [
            'Zakah, Sawm and Hajj are outward acts of worship belonging to the five Pillars of Islam.',
            'Look for an inner article of creed (Iman).',
          ],
          e: 'Belief in Al-Qadar (Divine Decree) is the sixth Article of Faith (Iman), whereas Zakah, Sawm and Hajj are Pillars of Islam.',
        },
      },
    ],
    qs: [
      {
        q: 'Which revealed scripture was given to Prophet Dawud (AS)?',
        o: ['Zabur (Psalms)', 'Tawrah', 'Injil', 'Suhuf Ibrahim'],
        a: 0,
        e: 'Allah revealed the Zabur to Prophet Dawud (AS), the Tawrah to Musa (AS), the Injil to Isa (AS) and the Qur’an to Muhammad (SAW).',
      },
      {
        q: 'Which angel is entrusted with blowing the trumpet to announce the Day of Resurrection?',
        o: ['Israfil', 'Jibril', 'Mika’il', 'Malik'],
        a: 0,
        e: 'Angel Israfil is appointed to blow the trumpet (Sur) on the Last Day.',
      },
      {
        q: 'Performing prayers or giving charity mainly so others praise your piety is called',
        o: ['Riya (minor shirk)', 'Tawakkul', 'Zakah', 'Ihsan'],
        a: 0,
        e: 'Riya (ostentation) undermines sincerity and is classified as minor/hidden shirk.',
      },
      {
        q: 'From what were the angels created according to Islamic teaching?',
        o: ['Light (Nur)', 'Smokeless fire', 'Clay', 'Water'],
        a: 0,
        e: 'Angels were created from light, jinn from smokeless fire, and humanity from clay.',
      },
      {
        q: 'Why is Prophet Muhammad (SAW) called "Khatam al-Nabiyyin"?',
        o: [
          'Because he is the final Seal of the Prophets with no prophet after him',
          'Because he was the first human created',
          'Because he lived only in Madinah',
          'Because he wrote the Tawrah',
        ],
        a: 0,
        e: 'Qur’an 33:40 designates Prophet Muhammad (SAW) as the Seal of the Prophets.',
      },
      {
        q: 'What does true Islamic belief in Al-Qadar (Divine Decree) require from a student preparing for examinations?',
        o: [
          'Making sincere, diligent effort while trusting Allah with the final outcome',
          'Refusing to study because results are already known',
          'Relying on lucky charms',
          'Blaming fate for laziness',
        ],
        a: 0,
        e: 'Islamic Tawakkul pairs responsible effort ("tie your camel") with humble reliance upon Allah.',
      },
    ],
  },
  {
    id: 'irs-taharah-salah',
    name: 'Taharah and salah',
    sec: 'Ibadah (Worship)',
    goals: [
      'Explain the forms of ritual purification: Wudu, Ghusl and Tayammum, including when each is required and what breaks Wudu',
      'Explain the conditions, pillars, times and spiritual/social benefits of Salah, including Jumu’ah, Qasr and Jama’ah',
    ],
    trap: 'Tayammum (dry ablution with clean earth/dust) is NOT a lazy shortcut when water is simply cold — it is permitted only when clean water is unavailable or using water would genuinely harm health or worsen illness.',
    parts: [
      {
        title: 'Taharah: Wudu, Ghusl and Tayammum',
        idea: 'Cleanliness (Taharah) is half of faith and a prerequisite for valid prayer. Minor ritual impurity is removed by Wudu (ablution); major ritual impurity (Janabah, menstruation, post-natal bleeding) requires Ghusl (full ritual bath). When water is absent or medically harmful, Allah’s mercy permits Tayammum using clean earth or dust.',
        terms: [
          ['Wudu', 'Washing face, arms to elbows, wiping head and washing feet to ankles with clean water'],
          ['Ghusl', 'Full-body ritual washing ensuring water reaches every part of the skin and hair'],
          ['Tayammum', 'Dry ablution by lightly striking clean earth/dust and wiping face and hands when water cannot be used'],
        ],
        rules: [
          'The four Qur’anic obligatory acts (Fard) of Wudu (5:6) are washing the face, washing arms up to elbows, wiping the head and washing feet up to ankles (plus intention and order).',
          'Things that break Wudu include answering the call of nature, passing wind, deep sleep and loss of consciousness.',
          'Tayammum becomes invalid as soon as clean water becomes safely available or anything that breaks Wudu occurs.',
        ],
        table: {
          headers: ['Purification', 'When required', 'Key actions'],
          rows: [
            ['Wudu', 'Before Salah after minor impurity', 'Face, forearms to elbows, wipe head, feet to ankles'],
            ['Ghusl', 'After major impurity (Janabah, Hayd, Nifas)', 'Intention + washing entire body thoroughly'],
            ['Tayammum', 'No water available or water medically harmful', 'Strike clean earth once/twice; wipe face and hands'],
          ],
          trapNote: 'Remember that washing the mouth and nose, wiping ears and washing three times are emphasised Sunnah acts of Wudu, while the four Qur’anic limbs are Fard (obligatory).',
        },
        example: {
          q: 'A traveller in a dry area cannot find water before Dhuhr ends. What should the traveller do, and what happens if water is found later before Asr?',
          steps: [
            ['At Dhuhr', 'Perform Tayammum with clean earth and pray Dhuhr validly'],
            ['Before Asr when water appears', 'Tayammum ends — perform normal Wudu with water for Asr'],
          ],
        },
        yourTurn: {
          q: 'Which of the following requires Ghusl (a full ritual bath) rather than Wudu alone before praying?',
          o: [
            'Ending of menstruation (Hayd) or state of Janabah',
            'Waking up from a brief nap',
            'Eating lunch',
            'Entering a marketplace',
          ],
          a: 0,
          h: [
            'Distinguish minor ritual impurities (handled by Wudu) from major ritual impurities (handled by Ghusl).',
            'Major states include Janabah, Hayd and Nifas.',
          ],
          e: 'Major ritual states such as Janabah, Hayd and Nifas require Ghusl before performing Salah.',
        },
      },
      {
        title: 'Salah: pillars, types and special prayers',
        idea: 'Salah (the five daily prayers: Fajr 2, Dhuhr 4, Asr 4, Maghrib 3, Isha 4) is the second Pillar of Islam and the believer’s direct daily meeting with Allah. Valid Salah requires purity, facing the Qiblah (Ka’bah), proper timing, modest dress (Satr al-Awrah) and intention. Islam also honours congregational prayer (Jama’ah), Friday prayer (Jumu’ah), Eid prayers, Janazah (funeral prayer) and traveller concessions (Qasr — shortening 4-rak’ah prayers to 2).',
        terms: [
          ['Fard pillars of Salah', 'Standing (Qiyam), Takbiratul Ihram, reciting Al-Fatihah, Ruku (bowing), Sujud (prostration), final sitting (Tashahhud) and Taslim'],
          ['Salat al-Jumu’ah', 'Friday congregational prayer (2 rak’ahs preceded by two sermons/Khutbah) replacing Dhuhr'],
          ['Qasr and Jam’', 'Shortening 4-rak’ah prayers to 2 (Qasr) and combining pairs (Dhuhr+Asr, Maghrib+Isha) while travelling'],
          ['Sujud al-Sahw', 'Two extra prostrations of forgetfulness correcting unintended omissions or additions in Salah'],
        ],
        rules: [
          'Fajr has 2 rak’ahs, Maghrib has 3, and Dhuhr, Asr and Isha have 4 each (total 17 obligatory rak’ahs daily).',
          'Congregational prayer (Jama’ah) earns 27 times the reward of praying alone and builds equality and punctuality.',
          'Salat al-Janazah (funeral prayer) has four Takbirs and is performed standing — with NO Ruku (bowing) and NO Sujud (prostration).',
        ],
        table: {
          headers: ['Prayer', 'Obligatory Rak’ahs', 'Special note'],
          rows: [
            ['Fajr', '2', 'Dawn before sunrise; recited aloud'],
            ['Dhuhr / Asr', '4 / 4', 'Shortened to 2 each during Qasr travel'],
            ['Maghrib', '3', 'Just after sunset; never shortened'],
            ['Isha', '4', 'Night; shortened to 2 during Qasr travel'],
            ['Jumu’ah', '2', 'Replaces Dhuhr on Friday after two Khutbahs'],
          ],
          trapNote: 'During travel (Qasr), ONLY 4-rak’ah prayers (Dhuhr, Asr, Isha) are shortened to 2 — Fajr (2) and Maghrib (3) stay unchanged.',
        },
        example: {
          q: 'How many obligatory rak’ahs does a Muslim on a long journey pray for Dhuhr and Maghrib respectively using Qasr?',
          steps: [
            ['Check Dhuhr', 'Normally 4 rak’ahs → shortened to 2 rak’ahs'],
            ['Check Maghrib', 'Normally 3 rak’ahs → never shortened, remains 3 rak’ahs'],
          ],
        },
        yourTurn: {
          q: 'Which special Islamic prayer is performed standing with four Takbirs and NO bowing (Ruku) or prostration (Sujud)?',
          o: ['Salat al-Janazah (funeral prayer)', 'Salat al-Jumu’ah', 'Salat al-Eid', 'Salat al-Fajr'],
          a: 0,
          h: [
            'This communal obligation (Fard Kifayah) is offered to pray for Allah’s mercy on a deceased Muslim.',
            'Because it has no Ruku or Sujud, worshippers remain standing throughout.',
          ],
          e: 'Salat al-Janazah is performed standing with four Takbirs, supplicating for the deceased without bowing or prostrating.',
        },
      },
    ],
    qs: [
      {
        q: 'Which of the following invalidates Wudu (ablution)?',
        o: ['Deep sleep', 'Drinking water', 'Smiling politely', 'Walking outdoors'],
        a: 0,
        e: 'Deep sleep removes awareness of bodily states and therefore nullifies Wudu.',
      },
      {
        q: 'How many obligatory (Fard) rak’ahs are there across the five daily prayers altogether?',
        o: ['17', '12', '15', '20'],
        a: 0,
        e: 'Fajr (2) + Dhuhr (4) + Asr (4) + Maghrib (3) + Isha (4) = 17 obligatory rak’ahs.',
      },
      {
        q: 'What are the two extra prostrations performed to rectify an accidental forgetful mistake in Salah called?',
        o: ['Sujud al-Sahw', 'Takbiratul Ihram', 'Tashahhud', 'Qunut'],
        a: 0,
        e: 'Sujud al-Sahw (prostrations of forgetfulness) repairs unintentional omissions or additions in Salah.',
      },
      {
        q: 'Which prayers may be shortened (Qasr) to two rak’ahs by a traveller?',
        o: ['Dhuhr, Asr and Isha', 'Fajr, Maghrib and Isha', 'All five daily prayers', 'Only Maghrib'],
        a: 0,
        e: 'Only the four-rak’ah prayers (Dhuhr, Asr and Isha) are shortened to two rak’ahs in Qasr.',
      },
      {
        q: 'Before Salat al-Jumu’ah on Friday, the Imam delivers',
        o: ['two sermons (Khutbahs) separated by a brief sitting', 'four bowing postures', 'three rak’ahs of silent prayer', 'a fasting announcement'],
        a: 0,
        e: 'Jumu’ah consists of two Khutbahs followed by two obligatory rak’ahs in congregation.',
      },
      {
        q: 'Which social virtue is directly fostered when rich and poor stand shoulder to shoulder in congregational prayer (Jama’ah)?',
        o: ['Human equality and brotherhood', 'Commercial competition', 'Tribal separation', 'Secrecy'],
        a: 0,
        e: 'Standing side by side regardless of status reinforces Islamic brotherhood, discipline and equality before Allah.',
      },
    ],
  },
  {
    id: 'irs-zakah-sawm-hajj',
    name: 'Zakah, sawm and hajj',
    sec: 'Ibadah (Worship)',
    goals: [
      'Explain the rules, Nisab, rate and eight beneficiaries of Zakah and how it differs from voluntary Sadaqah',
      'Explain the rules and wisdom of Sawm (Ramadan fasting) and the rites and significance of Hajj and Umrah',
    ],
    trap: 'Do not confuse Zakah with voluntary charity (Sadaqah): Zakah is OBLIGATORY on eligible wealth above Nisab held for one lunar year (Hawl) at fixed rates (commonly 2.5% on cash/gold) and goes only to the eight Qur’anic categories (Surah 9:60).',
    parts: [
      {
        title: 'Zakah and Sawm (Ramadan fasting)',
        idea: 'Zakah ("purification and growth") is the third Pillar of Islam: Muslims whose surplus wealth reaches the minimum threshold (Nisab) for one full lunar year (Hawl) pay a fixed share (2.5% on cash, gold and trade goods) to eight specified groups in Qur’an 9:60, narrowing poverty and purifying wealth from greed. Sawm (the fourth Pillar) requires abstaining from food, drink and marital relations from dawn (Fajr) to sunset (Maghrib) throughout Ramadan to cultivate Taqwa (God-consciousness) and empathy for the hungry.',
        terms: [
          ['Nisab & Hawl', 'Nisab is the minimum zakatable wealth threshold; Hawl is holding that wealth for one complete lunar year'],
          ['Zakat al-Fitr', 'Small food charity paid before Eid al-Fitr prayer so poor families also rejoice on Eid'],
          ['Laylat al-Qadr', 'The Night of Decree in the last ten odd nights of Ramadan, "better than a thousand months"'],
        ],
        rules: [
          'The eight beneficiaries of Zakah (Qur’an 9:60): the poor (Fuqara), the needy (Masakin), Zakah collectors, reconciling hearts, freeing captives, debtors, in the cause of Allah, and stranded travellers.',
          'Exempt from Ramadan fasting: the sick, travellers, pregnant/nursing mothers (who make up missed days — Qada), and frail elderly/chronically ill (who pay Fidyah — feeding a poor person per day).',
          'Eating or drinking by genuine forgetfulness does NOT break a fast — the fasting person simply resumes fasting.',
        ],
        table: {
          headers: ['Feature', 'Zakah', 'Sadaqah (voluntary charity)'],
          rows: [
            ['Ruling', 'Obligatory Pillar of Islam', 'Voluntary and recommended anytime'],
            ['Amount & timing', 'Fixed rate (e.g., 2.5%) above Nisab after 1 lunar year', 'Any amount at any time'],
            ['Recipients', 'Strictly the 8 categories in Qur’an 9:60', 'Open to any worthy person or public cause'],
          ],
          trapNote: 'Zakah CANNOT be paid to one’s own parents, children or spouse (whom one is already obliged to support).',
        },
        example: {
          q: 'A Muslim trader holds ₦2,000,000 in surplus savings (above Nisab) for a full lunar year. How much Zakah is due?',
          steps: [
            ['Apply the cash Zakah rate', '2.5% = 1/40 of the eligible amount'],
            ['Compute', '2,000,000 ÷ 40 = ₦50,000'],
          ],
        },
        yourTurn: {
          q: 'Which Qur’anic goal is explicitly stated as the ultimate spiritual purpose of fasting (Sawm) in Surah al-Baqarah 2:183?',
          o: [
            'Attaining Taqwa (God-consciousness and self-restraint)',
            'Saving money on groceries',
            'Winning political office',
            'Replacing the five daily prayers',
          ],
          a: 0,
          h: [
            'Recall the closing words of Qur’an 2:183: "...la’allakum tattaqun."',
            'Physical hunger trains spiritual discipline and awareness of Allah.',
          ],
          e: 'Qur’an 2:183 states that fasting is prescribed "so that you may attain Taqwa" (God-consciousness).',
        },
      },
      {
        title: 'Hajj and Umrah',
        idea: 'Hajj is the fifth Pillar of Islam — pilgrimage to Makkah in the month of Dhul-Hijjah, obligatory once in a lifetime for every adult Muslim who is physically and financially able (Istita’ah). Its essential rites include entering Ihram at the Miqat, standing at Arafat on 9th Dhul-Hijjah (the pillar without which Hajj is invalid), staying at Muzdalifah, stoning the Jamarat at Mina, sacrificing an animal (Eid al-Adha), Tawaf al-Ifadah around the Ka’bah and Sa’y between Safa and Marwah.',
        terms: [
          ['Ihram', 'Sacred state of intention and simple white seamless garments for men, symbolising equality before Allah'],
          ['Wuquf at Arafat', 'Standing in devotion on the plain of Arafat on 9th Dhul-Hijjah — the single most essential pillar of Hajj'],
          ['Tawaf & Sa’y', 'Tawaf is circling the Ka’bah seven times anti-clockwise; Sa’y is walking seven times between Safa and Marwah recalling Hajar’s search for water'],
        ],
        rules: [
          'The Prophet (SAW) declared: "Hajj is Arafat" — missing the standing at Arafat invalidates the Hajj.',
          'Umrah (the lesser pilgrimage) consists of Ihram, Tawaf, Sa’y and shaving/trimming hair, and can be performed at any time of the year.',
          'Hajj has three forms: Ifrad (Hajj alone), Qiran (Hajj and Umrah combined in one Ihram) and Tamattu’ (Umrah then exiting Ihram before Hajj).',
        ],
        table: {
          headers: ['Rite', 'Location', 'Symbolic lesson'],
          rows: [
            ['Ihram', 'Miqat boundary', 'Strips away class and pride; everyone stands equal'],
            ['Wuquf', 'Plain of Arafat (9th Dhul-Hijjah)', 'Remembrance of the Day of Judgement and sincere repentance'],
            ['Ramy al-Jamarat', 'Mina', 'Rejecting Satan’s temptations as Prophet Ibrahim (AS) did'],
            ['Tawaf & Sa’y', 'Masjid al-Haram (Ka’bah, Safa & Marwah)', 'God-centred life and perseverance in trust (Hajar)'],
          ],
          trapNote: 'Do not confuse Umrah with Hajj: Umrah has NO standing at Arafat, NO Mina stoning, and is not tied to Dhul-Hijjah.',
        },
        example: {
          q: 'What does walking seven times between Safa and Marwah (Sa’y) commemorate?',
          steps: [
            ['Recall the historical story', 'Hajar ran seven times between the two hills searching for water for baby Isma’il'],
            ['Recall Allah’s mercy', 'Allah caused the spring of Zamzam to gush forth, rewarding faith paired with effort'],
          ],
        },
        yourTurn: {
          q: 'Which single rite of Hajj did Prophet Muhammad (SAW) emphasise as so essential that missing it invalidates the entire Hajj?',
          o: [
            'Standing on the plain of Arafat on 9th Dhul-Hijjah',
            'Buying souvenirs in Makkah',
            'Visiting Madinah before Dhul-Hijjah',
            'Drinking Zamzam water twice',
          ],
          a: 0,
          h: [
            'Recall the short Hadith: "Al-Hajju Arafah."',
            'It takes place on the ninth day of Dhul-Hijjah.',
          ],
          e: 'Wuquf (standing) at Arafat on 9th Dhul-Hijjah is the central pillar of Hajj without which Hajj is incomplete.',
        },
      },
    ],
    qs: [
      {
        q: 'How many categories of Zakah recipients are explicitly listed in Surah al-Tawbah (9:60)?',
        o: ['8', '5', '6', '10'],
        a: 0,
        e: 'Qur’an 9:60 specifies exactly eight categories eligible to receive Zakah.',
      },
      {
        q: 'What is the standard Zakah rate payable on cash savings and gold held above Nisab for one lunar year?',
        o: ['2.5%', '5%', '10%', '20%'],
        a: 0,
        e: 'Cash, gold, silver and commercial inventory carry a standard Zakah rate of 2.5% (one-fortieth).',
      },
      {
        q: 'What happens if a fasting Muslim in Ramadan accidentally drinks water out of genuine forgetfulness?',
        o: [
          'The fast remains valid and the person simply continues fasting once they remember',
          'The fast is broken and requires sixty days of expiation',
          'The entire month of Ramadan is cancelled',
          'The person must pay Zakah immediately',
        ],
        a: 0,
        e: 'Prophet Muhammad (SAW) taught that eating or drinking purely out of forgetfulness does not break the fast.',
      },
      {
        q: 'In which Islamic lunar month is the annual pilgrimage (Hajj) performed?',
        o: ['Dhul-Hijjah', 'Ramadan', 'Muharram', 'Shawwal'],
        a: 0,
        e: 'The main rites of Hajj occur between the 8th and 12th/13th of Dhul-Hijjah.',
      },
      {
        q: 'Circling the Ka’bah seven times anti-clockwise during Hajj or Umrah is called',
        o: ['Tawaf', 'Sa’y', 'Wuquf', 'Ramy'],
        a: 0,
        e: 'Tawaf is the sevenfold circumambulation of the Ka’bah.',
      },
      {
        q: 'What is the payment made by a chronically ill or very frail elderly person who cannot fast Ramadan or make it up later?',
        o: ['Fidyah (feeding a needy person for each missed day)', 'Nisab', 'Mahr', 'Kharaj'],
        a: 0,
        e: 'Fidyah provides daily food for a needy person in place of each fast missed due to permanent inability.',
      },
    ],
  },
  {
    id: 'irs-jihad-shariah-family',
    name: 'Jihad, shari’ah and Islamic family law',
    sec: 'Fiqh and Shari’ah',
    goals: [
      'Explain the true scope of Jihad, the four primary sources of Shari’ah and the five legal rulings (Ahkam)',
      'Explain Islamic family law: marriage (Nikah), Mahr, divorce (Talaq, Khul’), Iddah and inheritance (Mirath)',
    ],
    trap: 'Jihad does NOT mean mindless violence — its root meaning is "striving in the way of Allah", starting with Jihad al-Nafs (struggling against one’s own selfish desires), peaceful outreach, charity and lawful self-defence governed by strict ethics.',
    parts: [
      {
        title: 'Jihad and the sources of Shari’ah',
        idea: 'Jihad means sincere striving to uphold goodness and resist evil — beginning with disciplining one’s own soul (Jihad al-Nafs), speaking truth peacefully, learning and defending the innocent under strict rules that forbid harming civilians, women, children or trees. Shari’ah (the Islamic legal and moral path) rests on four classic Sunni sources: Qur’an, Sunnah, Ijma (scholarly consensus) and Qiyas (analogical reasoning).',
        terms: [
          ['Jihad al-Nafs', 'The inner moral struggle against selfishness, laziness, anger and temptation'],
          ['Ijma', 'Unanimous agreement of qualified Islamic scholars of an era on a legal question'],
          ['Qiyas', 'Extending a ruling from a clear Qur’anic/Hadith case to a new case sharing the same underlying reason (e.g., banning modern narcotics by analogy with Khamr/intoxicants)'],
        ],
        rules: [
          'Five categories of actions in Shari’ah (Al-Ahkam al-Khamsah): Fard/Wajib (obligatory), Mustahabb/Mandub (recommended), Mubah (permissible), Makruh (disliked) and Haram (forbidden).',
          'Five core objectives of Shari’ah (Maqasid al-Shari’ah): protecting religion, life, intellect, lineage and property.',
          'The four major Sunni schools of jurisprudence (Madhhabs) are Hanafi, Maliki (predominant in West Africa/Nigeria), Shafi’i and Hanbali.',
        ],
        table: {
          headers: ['Source of Shari’ah', 'Type', 'Example'],
          rows: [
            ['Qur’an', 'Primary (divine revelation)', 'Prohibition of Khamr (wine/intoxicants)'],
            ['Sunnah / Hadith', 'Primary (prophetic guidance)', 'Exact method and rak’ahs of daily prayers'],
            ['Ijma', 'Secondary (consensus)', 'Consensus on compiling the Qur’an into a single book'],
            ['Qiyas', 'Secondary (analogy)', 'Prohibiting modern addictive drugs because they intoxicate like Khamr'],
          ],
          trapNote: 'Remember that the MALIKI school of jurisprudence (founded by Imam Malik ibn Anas) is the main Madhhab practised across Nigeria and West Africa.',
        },
        example: {
          q: 'How do Islamic jurists use Qiyas to rule on modern hard drugs not named in 7th-century Arabia?',
          steps: [
            ['Original case', 'Khamr (grape/date wine) is explicitly Haram in the Qur’an'],
            ['Shared effective cause (Illah)', 'Intoxication that clouds human intellect'],
            ['Conclusion by Qiyas', 'All modern intoxicants and narcotics are equally Haram'],
          ],
        },
        yourTurn: {
          q: 'Which secondary source of Islamic law derives a ruling for a new issue by matching its underlying cause (Illah) to a clear text in the Qur’an or Hadith?',
          o: ['Qiyas (analogical reasoning)', 'Ijma', 'Tafsir', 'Iddah'],
          a: 0,
          h: [
            'Ijma means consensus of scholars; look for the term meaning legal analogy.',
            'It is how scholars extend the ban on wine to all modern intoxicants.',
          ],
          e: 'Qiyas uses analogical reasoning based on a shared effective cause (Illah) to address new situations.',
        },
      },
      {
        title: 'Islamic family law: Nikah, Talaq, Iddah and Mirath',
        idea: 'Islam treats marriage (Nikah) as a sacred social contract built on love, mercy and mutual responsibility. Valid Nikah requires mutual consent, a marriage guardian (Wali), two reliable witnesses and Mahr (bridal gift paid solely to the bride). Divorce (Talaq) is strongly discouraged yet permitted as a last resort after arbitration, with a waiting period (Iddah) to confirm pregnancy and allow reconciliation. Inheritance (Mirath) ensures fixed Qur’anic shares for both male and female relatives.',
        terms: [
          ['Mahr (Sadaq)', 'Obligatory bridal gift given directly to the bride as her exclusive personal property'],
          ['Khul’', 'Divorce initiated by the wife when marriage becomes unbearable, usually returning the Mahr'],
          ['Iddah', 'Waiting period after divorce (three menstrual cycles) or widowhood (4 months and 10 days) before remarrying'],
        ],
        rules: [
          'Forced marriage without the bride’s consent violates Islamic teaching.',
          'In revocable divorce (Talaq Raj’i), the husband stays responsible for housing and maintenance during Iddah and may reconcile without a new contract; after three separate divorces it becomes irrevocable.',
          'Before distributing an estate (Mirath), funeral costs, debts and valid bequests (Wasiyyah, capped at one-third of the estate) are settled first.',
        ],
        table: {
          headers: ['Family law concept', 'Key Islamic rule'],
          rows: [
            ['Mahr', 'Belongs strictly to the bride, not her parents'],
            ['Iddah of divorced woman', 'Three menstrual cycles (or until delivery if pregnant)'],
            ['Iddah of widow', 'Four lunar months and ten days (or until delivery if pregnant)'],
            ['Wasiyyah (Will)', 'At most one-third of net estate; cannot disinherit legal heirs'],
          ],
          trapNote: 'Why does a son often receive twice a daughter’s share in Mirath? Because in Islamic law a man bears full legal obligation to pay Mahr and financially maintain his wife, children and dependents, while a woman keeps all her own wealth and earnings.',
        },
        example: {
          q: 'A Muslim leaves behind ₦1,200,000 after funeral expenses and debts, with no will. How much may a Muslim validly bequeath in a voluntary will (Wasiyyah) to a charity?',
          steps: [
            ['Recall the Prophetic cap', 'A voluntary will cannot exceed one-third (1/3) of the net estate'],
            ['Calculate', '1/3 × ₦1,200,000 = ₦400,000 maximum'],
          ],
        },
        yourTurn: {
          q: 'How long is the Iddah (waiting period) for a non-pregnant Muslim widow after her husband’s death?',
          o: [
            'Four lunar months and ten days',
            'Three menstrual cycles',
            'Forty days',
            'One full year',
          ],
          a: 0,
          h: [
            'Three menstrual cycles apply to divorce, whereas widowhood carries a slightly longer period stated in Qur’an 2:234.',
            'It is four months plus ten days.',
          ],
          e: 'Qur’an 2:234 fixes a non-pregnant widow’s Iddah at four lunar months and ten days.',
        },
      },
    ],
    qs: [
      {
        q: 'In Islamic legal terminology, an act that is strictly forbidden and brings sin if committed is classified as',
        o: ['Haram', 'Mubah', 'Mustahabb', 'Makruh'],
        a: 0,
        e: 'Haram denotes acts explicitly prohibited by Shari’ah.',
      },
      {
        q: 'Which Sunni school of jurisprudence (Madhhab) is historically predominant in Nigeria and West Africa?',
        o: ['Maliki', 'Hanafi', 'Hanbali', 'Zahiri'],
        a: 0,
        e: 'The Maliki Madhhab spread across North and West Africa and remains the primary legal tradition in Nigeria.',
      },
      {
        q: 'Who is the rightful owner of the Mahr (bridal gift) in an Islamic marriage?',
        o: ['The bride herself', 'The bride’s uncle', 'The marriage witnesses', 'The local mosque'],
        a: 0,
        e: 'Qur’an 4:4 commands giving women their Mahr graciously as their own exclusive property.',
      },
      {
        q: 'What is divorce initiated by the wife through mutual agreement (typically returning the Mahr) called?',
        o: ['Khul’', 'Zihar', 'Ijma', 'Wasiyyah'],
        a: 0,
        e: 'Khul’ grants a woman a legal path to dissolve an unworkable marriage.',
      },
      {
        q: 'What is the maximum fraction of a net estate that a Muslim may bequeath in a voluntary will (Wasiyyah) to non-heirs?',
        o: ['One-third (1/3)', 'One-half (1/2)', 'Three-quarters (3/4)', 'All of it'],
        a: 0,
        e: 'The Prophet (SAW) told Sa’d ibn Abi Waqqas that one-third is the maximum ("One-third, and even one-third is plenty").',
      },
      {
        q: 'Which form of Jihad is regarded as the continuous everyday foundation of a Muslim’s spiritual life?',
        o: [
          'Jihad al-Nafs (striving to purify one’s soul and resist sin)',
          'Attacking innocent bystanders',
          'Refusing to learn useful knowledge',
          'Breaking trade contracts',
        ],
        a: 0,
        e: 'Disciplining one’s own desires and staying steadfast in obedience to Allah (Jihad al-Nafs) is the constant basis of Jihad.',
      },
    ],
  },
  {
    id: 'irs-economic-moral-social',
    name: 'Economic, moral and social teachings of Islam',
    sec: 'Islamic ethics and society',
    goals: [
      'Explain Islamic economic principles: lawful earning (Halal), prohibition of Riba (usury), hoarding, cheating and gambling',
      'Explain core Islamic moral and social duties toward parents, neighbours, orphans, elders and human dignity',
    ],
    trap: 'Islam does NOT oppose profit in honest trade — Qur’an 2:275 explicitly distinguishes lawful trade ("Allah has permitted trade") from Riba ("and forbidden usury/interest").',
    parts: [
      {
        title: 'Islamic economic ethics',
        idea: 'Islam encourages productive work, honest trade and circulation of wealth while strictly forbidding exploitation. Riba (usury/interest), Gharar (excessive deceptive uncertainty), Maysir (gambling), Tatfif (cheating in weights and measures), hoarding essential goods (Ihtikar) and bribery (Rishwah) are all prohibited so wealth serves justice and community welfare.',
        terms: [
          ['Riba', 'Guaranteed interest or usurious gain charged on loans without sharing genuine business risk'],
          ['Tatfif', 'Cheating customers with dishonest scales, short measures or hidden defects'],
          ['Mudarabah', 'Lawful Islamic business partnership where one party supplies capital and the other supplies skill/labour, sharing profits fairly'],
        ],
        rules: [
          'Honest manual labour is praised in Hadith: "Nobody has ever eaten a better meal than that earned by the work of their own hands."',
          'Workers must be paid promptly and fairly ("Give the worker his wages before his sweat dries").',
          'Zakah, Waqf (charitable endowment) and Sadaqah ensure wealth does not stay locked only among the rich.',
        ],
        table: {
          headers: ['Permitted in Islam', 'Forbidden in Islam'],
          rows: [
            ['Honest buying and selling at fair profit', 'Riba (usurious interest on loans)'],
            ['Risk-sharing partnerships (Mudarabah, Musharakah)', 'Gambling (Maysir) and fraud'],
            ['Transparent quality and exact measures', 'Short weights (Tatfif), bribery and hoarding'],
          ],
          trapNote: 'Remember Surah al-Mutaffifin ("Woe to those who give less than due") specifically warns traders who demand full measure when buying yet cheat when selling.',
        },
        example: {
          q: 'Why does Islam forbid hoarding basic foodstuffs during a scarcity (Ihtikar)?',
          steps: [
            ['Identify the harm', 'Holding back grain or cooking oil artificially drives prices up so poor families suffer'],
            ['State the Islamic principle', 'Trade must benefit society fairly, never exploit human desperation'],
          ],
        },
        yourTurn: {
          q: 'Which Arabic term denotes cheating customers by giving short weights or altered measures in trade?',
          o: ['Tatfif', 'Mudarabah', 'Waqf', 'Tawakkul'],
          a: 0,
          h: [
            'An entire chapter of the Qur’an (Surah 83, al-Mutaffifin) warns against this commercial sin.',
            'It refers specifically to short-changing buyers on scales.',
          ],
          e: 'Tatfif is cheating in weights and measures, strongly condemned in Surah al-Mutaffifin.',
        },
      },
      {
        title: 'Moral and social values in Islam',
        idea: 'Islamic character (Akhlaq) begins at home and radiates across society. Respect and kindness to parents (Birr al-Walidayn) comes immediately after worshipping Allah alone (Qur’an 17:23–24). Islam also emphasises truthfulness (Sidq), trustworthiness (Amanah), modesty (Haya), caring for orphans, respecting neighbours (Muslim or non-Muslim), banning backbiting (Ghibah) and alcohol, and affirming human equality ("No Arab is superior to a non-Arab except by Taqwa").',
        terms: [
          ['Birr al-Walidayn', 'Dutifulness, gentle speech and lifelong care toward parents — never even saying "Uff" in irritation'],
          ['Amanah', 'Trustworthiness in keeping promises, public funds, secrets and duties'],
          ['Ghibah', 'Backbiting — speaking negatively about someone behind their back, likened in Qur’an 49:12 to eating a dead brother’s flesh'],
        ],
        rules: [
          'When asked who deserves the best companionship, Prophet Muhammad (SAW) answered "Your mother" three times before saying "Your father".',
          'Islam prohibits intoxicants (Khamr) and gambling completely because they destroy health, families and judgement.',
          'The Farewell Sermon affirmed universal racial and social equality: superiority lies only in righteousness (Taqwa).',
        ],
        table: {
          headers: ['Virtue / duty', 'Qur’anic or Hadith guidance'],
          rows: [
            ['Parents', 'Speak kindly, lower the wing of humility and pray for their mercy (17:23–24)'],
            ['Neighbours', 'Angel Jibril emphasised neighbourly rights so much the Prophet thought neighbours might inherit'],
            ['Truthfulness & trust', 'Lying, breaking promises and betraying trusts are signs of hypocrisy (Nifaq)'],
            ['Human equality', 'All humans descend from Adam; honour belongs to the most God-conscious (49:13)'],
          ],
          trapNote: 'Even if parents disagree with a believer’s faith, Qur’an 31:15 still commands treating them with kindness and respect in worldly affairs while obeying Allah alone.',
        },
        example: {
          q: 'What are the three signs of a hypocrite (Munafiq) named in the famous Hadith?',
          steps: [
            ['Speech', 'When he speaks, he lies'],
            ['Commitment', 'When he makes a promise, he breaks it'],
            ['Trust', 'When entrusted with something (Amanah), he betrays the trust'],
          ],
        },
        yourTurn: {
          q: 'According to Surah al-Hujurat (49:13) and the Prophet’s Farewell Sermon, what is the ONLY valid standard of superiority among human beings before Allah?',
          o: ['Taqwa (righteousness and God-consciousness)', 'Wealth and property', 'Tribe or skin colour', 'Family fame'],
          a: 0,
          h: [
            'Islam rejects racism, tribalism and pride in wealth.',
            'Recall the verse: "Indeed, the most noble of you in the sight of Allah is the most righteous of you."',
          ],
          e: 'Qur’an 49:13 establishes Taqwa (righteousness) as the sole measure of true nobility before Allah.',
        },
      },
    ],
    qs: [
      {
        q: 'Which financial practice is explicitly contrasted with lawful trade and prohibited in Qur’an 2:275?',
        o: ['Riba (usury/interest)', 'Waqf (endowment)', 'Mudarabah (profit-sharing)', 'Sadaqah (charity)'],
        a: 0,
        e: 'Qur’an 2:275 declares: "Allah has permitted trade and forbidden Riba."',
      },
      {
        q: 'In Qur’an 17:23, kindness and respect to parents is placed immediately after',
        o: ['worshipping Allah alone', 'performing Hajj', 'paying trade taxes', 'building a house'],
        a: 0,
        e: 'Surah al-Isra 17:23 joins exclusive worship of Allah directly with dutiful kindness to parents.',
      },
      {
        q: 'Which social vice does Surah al-Hujurat (49:12) compare to eating the flesh of one’s dead brother?',
        o: ['Backbiting (Ghibah)', 'Late prayer', 'Forgetting a promise', 'Oversleeping'],
        a: 0,
        e: 'Qur’an 49:12 uses that stark image to show how repulsive backbiting is.',
      },
      {
        q: 'In Hadith, what instruction did Prophet Muhammad (SAW) give employers regarding their workers’ wages?',
        o: [
          'Pay the worker promptly before their sweat dries',
          'Delay payment until the next harvest',
          'Withhold half the wage as security',
          'Pay only when asked in court',
        ],
        a: 0,
        e: 'Prompt, fair compensation reflects Islamic respect for human labour.',
      },
      {
        q: 'Which of the following is a permanent charitable endowment (such as a well, school or hospital) whose ongoing benefit serves the community?',
        o: ['Waqf', 'Maysir', 'Ihtikar', 'Rishwah'],
        a: 0,
        e: 'Waqf is a dedicated public endowment providing continuous charity (Sadaqah Jariyah).',
      },
      {
        q: 'When asked who among people is most deserving of good companionship, Prophet Muhammad (SAW) named the mother',
        o: ['three times before naming the father', 'once after all uncles', 'only after neighbours', 'equal to business partners'],
        a: 0,
        e: 'The Prophet honoured mothers’ sacrifice in pregnancy, childbirth and nursing by naming the mother three times before the father.',
      },
    ],
  },
  {
    id: 'irs-sirah-caliphs',
    name: 'The life of Prophet Muhammad and the Rightly Guided Caliphs',
    sec: 'Islamic history',
    goals: [
      'Trace the key milestones in the life of Prophet Muhammad (SAW) from Makkah and Hijrah to Madinah, Hudaybiyyah and the Conquest of Makkah',
      'Summarise the major achievements and leadership qualities of the four Rightly Guided Caliphs (Khulafa’ al-Rashidun)',
    ],
    trap: 'The Hijrah (622 CE) was NOT a cowardly escape — it was a strategic, divinely permitted migration to Madinah that established the first Islamic civic state and marks Year 1 of the Islamic (Hijri) calendar.',
    parts: [
      {
        title: 'Life of Prophet Muhammad (SAW) in Makkah and Madinah',
        idea: 'Born in Makkah in 570 CE (Year of the Elephant), Muhammad (SAW) was admired as Al-Amin (the Trustworthy) long before prophethood at age 40. Facing thirteen years of persecution and boycott in Makkah, he migrated to Yathrib (Madinah) in 622 CE (Hijrah), where he paired Muhajirun (migrants) with Ansar (helpers) and drafted the Constitution of Madinah granting religious freedom and shared defence. Key turning points followed: Badr (624), Uhud (625), Khandaq/Trench (627), the Treaty of Hudaybiyyah (628), the peaceful Conquest of Makkah (630) with general amnesty, and the Farewell Pilgrimage (632).',
        terms: [
          ['Al-Amin', 'Title meaning "the Trustworthy", earned by Muhammad (SAW) in his youth in Makkah'],
          ['Hijrah (622 CE)', 'Migration from Makkah to Madinah; start of the Islamic lunar calendar'],
          ['Treaty of Hudaybiyyah (628 CE)', 'Ten-year peace pact with Quraysh that the Qur’an called a "manifest victory" because peace let Islam spread rapidly'],
        ],
        rules: [
          'The Constitution of Madinah united Muslims, Jews and local tribes into one political community (Ummah) with mutual security and religious liberty.',
          'At Uhud, archers leaving their hill post against the Prophet’s strict order turned victory into setback — teaching discipline and obedience.',
          'At the Conquest of Makkah (630 CE), the Prophet (SAW) forgave his former persecutors ("Go, for you are free!"), showing unmatched mercy.',
        ],
        table: {
          headers: ['Milestone', 'Year (CE)', 'Historical significance'],
          rows: [
            ['Hijrah to Madinah', '622', 'Birth of the Madinan state and Year 1 of the Hijri calendar'],
            ['Battle of Badr', '624', '313 Muslims overcame ~1,000 Quraysh; confirmed survival of the young community'],
            ['Treaty of Hudaybiyyah', '628', 'Opened peaceful diplomacy and mass acceptance of Islam across Arabia'],
            ['Conquest of Makkah', '630', 'Peaceful liberation of the Ka’bah from idols and sweeping amnesty'],
          ],
          trapNote: 'Remember that the Islamic calendar begins with the HIJRAH (622 CE) — NOT the Prophet’s birth (570 CE) or first revelation (610 CE).',
        },
        example: {
          q: 'Why did the Qur’an call the Treaty of Hudaybiyyah a "clear victory" even though some terms initially looked unfavourable to Muslims?',
          steps: [
            ['Immediate political win', 'Quraysh formally recognised the Muslim community in Madinah as an equal treaty partner'],
            ['Long-term impact', 'Peace allowed open preaching across Arabia — more people embraced Islam in two years of peace than in the previous eighteen years'],
          ],
        },
        yourTurn: {
          q: 'Which event marks Year 1 of the Islamic (Hijri) calendar?',
          o: [
            'The migration (Hijrah) of Prophet Muhammad (SAW) from Makkah to Madinah in 622 CE',
            'The Year of the Elephant (570 CE)',
            'The Battle of Badr (624 CE)',
            'The Conquest of Makkah (630 CE)',
          ],
          a: 0,
          h: [
            'Caliph Umar ibn al-Khattab instituted the calendar around the turning point that created the Muslim community state.',
            'Notice the calendar’s very name: "Hijri".',
          ],
          e: 'The Hijri calendar begins with the Hijrah of 622 CE, marking the founding of the Madinan community.',
        },
      },
      {
        title: 'The four Rightly Guided Caliphs (Khulafa’ al-Rashidun)',
        idea: 'After Prophet Muhammad (SAW) passed away in 632 CE, four close Companions led the Muslim community through consultation (Shura), humility and accountability: Abu Bakr al-Siddiq (632–634), Umar ibn al-Khattab (634–644), Uthman ibn Affan (644–656) and Ali ibn Abi Talib (656–661). Together they preserved the Qur’an, built honest public institutions and spread Islam beyond Arabia.',
        terms: [
          ['Abu Bakr al-Siddiq', 'First Caliph; preserved unity during Riddah wars and compiled the first complete Qur’an manuscript'],
          ['Umar ibn al-Khattab', 'Second Caliph; established the Hijri calendar, public treasury (Bayt al-Mal), judiciary, police and provincial governance'],
          ['Uthman ibn Affan', 'Third Caliph; standardised the Mushaf Uthmani, expanded Masjid al-Nabawi and built the first Muslim navy'],
          ['Ali ibn Abi Talib', 'Fourth Caliph; renowned jurist and warrior who moved the capital to Kufa and championed justice and scholarship'],
        ],
        rules: [
          'Abu Bakr’s inaugural speech set the model of accountable rule: "Help me if I am right; correct me if I go wrong."',
          'Umar was famed as Al-Faruq (Distinguisher between truth and falsehood), walking Madinah’s streets at night to check on poor families.',
          'Uthman was known as Dhul-Nurayn (Possessor of Two Lights) for marrying two daughters of the Prophet (SAW) and for his extraordinary generosity.',
        ],
        table: {
          headers: ['Caliph', 'Reign (CE)', 'Signature achievement'],
          rows: [
            ['Abu Bakr', '632–634', 'Compiled Qur’an into one volume; preserved Arabian unity'],
            ['Umar', '634–644', 'Bayt al-Mal, Hijri calendar, independent judges, welfare stipends'],
            ['Uthman', '644–656', 'Standardised Qur’an copies; established first Muslim naval fleet'],
            ['Ali', '656–661', 'Reformed administration, moved capital to Kufa, promoted Arabic grammar & Fiqh'],
          ],
          trapNote: 'Remember the exact chronological order: Abu Bakr → Umar → Uthman → Ali.',
        },
        example: {
          q: 'Which administrative institutions did Caliph Umar ibn al-Khattab pioneer that still inspire modern public administration?',
          steps: [
            ['Financial & welfare', 'Organised the public treasury (Bayt al-Mal) with welfare stipends for orphans, widows and the needy'],
            ['Justice & records', 'Separated the judiciary from governors, kept state registers (Diwan) and adopted the Hijri calendar'],
          ],
        },
        yourTurn: {
          q: 'Which of the Rightly Guided Caliphs established the Bayt al-Mal (public treasury) and adopted the Hijri calendar?',
          o: ['Umar ibn al-Khattab', 'Abu Bakr al-Siddiq', 'Uthman ibn Affan', 'Ali ibn Abi Talib'],
          a: 0,
          h: [
            'He was the second Caliph, celebrated for building strong administrative institutions.',
            'He also earned the title Al-Faruq.',
          ],
          e: 'Caliph Umar ibn al-Khattab organised the Bayt al-Mal, separated the judiciary and instituted the Hijri calendar.',
        },
      },
    ],
    qs: [
      {
        q: 'What were the local Madinan Muslims who welcomed and shared their homes with the Makkan migrants called?',
        o: ['Ansar (Helpers)', 'Muhajirun', 'Quraysh', 'Tabi’un'],
        a: 0,
        e: 'The Madinan hosts were honoured as Ansar ("Helpers"), while the Makkan migrants were the Muhajirun.',
      },
      {
        q: 'What crucial lesson did Muslims learn from the setback at the Battle of Uhud?',
        o: [
          'The vital importance of obeying leadership orders and avoiding greed for war booty',
          'That Madinah could never be defended',
          'That treaties should never be signed',
          'That cavalry is useless in battle',
        ],
        a: 0,
        e: 'Archers abandoning their defensive post on the hill against the Prophet’s order allowed Quraysh cavalry to counterattack.',
      },
      {
        q: 'How did Prophet Muhammad (SAW) treat the people of Makkah after the peaceful Conquest of Makkah in 630 CE?',
        o: [
          'He granted a sweeping general amnesty and forgave former enemies',
          'He banished every resident from the city',
          'He destroyed all houses in Makkah',
          'He imposed heavy revenge fines on every family',
        ],
        a: 0,
        e: 'The Prophet (SAW) showed remarkable clemency, declaring general forgiveness and winning hearts across Arabia.',
      },
      {
        q: 'Which Caliph built the first organised Muslim naval fleet in the Mediterranean?',
        o: ['Uthman ibn Affan', 'Abu Bakr', 'Umar ibn al-Khattab', 'Ali ibn Abi Talib'],
        a: 0,
        e: 'Under Caliph Uthman, the first Muslim navy was commissioned to protect coastal provinces.',
      },
      {
        q: 'To which city in Iraq did Caliph Ali ibn Abi Talib move the administrative capital of the Caliphate?',
        o: ['Kufa', 'Damascus', 'Cairo', 'Basra'],
        a: 0,
        e: 'Caliph Ali relocated the capital from Madinah to Kufa for closer strategic administration.',
      },
      {
        q: 'What key principle did the Constitution of Madinah establish for non-Muslim tribes living in Madinah?',
        o: [
          'Freedom of religion alongside shared civic security and mutual defence',
          'Forced conversion within thirty days',
          'Exclusion from all trade markets',
          'Loss of private property',
        ],
        a: 0,
        e: 'The Madinan Charter protected religious freedom while binding all citizens to collective defence and justice.',
      },
    ],
  },
  {
    id: 'irs-west-africa-nigeria',
    name: 'Islam in West Africa and Nigeria',
    sec: 'Islamic history',
    goals: [
      'Trace the peaceful spread of Islam into West Africa and Nigeria via Trans-Saharan trade, scholars and rulers (Kanem-Borno, Hausaland, Yorubaland)',
      'Explain the 1804 Sokoto Jihad of Shaykh Uthman dan Fodio and the contributions of Islamic scholarship to Nigerian society',
    ],
    trap: 'Islam did NOT enter Nigeria first by conquest — it arrived peacefully centuries earlier via Trans-Saharan traders and travelling scholars (starting in Kanem-Borno in the 11th century and Hausaland in the 14th century).',
    parts: [
      {
        title: 'Arrival and growth of Islam in West Africa and Nigeria',
        idea: 'Islam reached West Africa peacefully from the 8th–11th centuries along Trans-Saharan trade routes linking North Africa to Ghana, Mali (Mansa Musa and Timbuktu’s Sankore university) and Songhai (Askia Muhammad). In Nigeria, Islam entered Kanem-Borno first under Mai Humai (11th century), reached Kano and Katsina in the 14th century through Wangarawa scholars from Mali (later strengthened by Muhammad Rumfa and scholar al-Maghili), and spread into Yorubaland via northern traders and scholars from the 17th–18th centuries.',
        terms: [
          ['Kanem-Borno', 'First Nigerian region to embrace Islam (11th century), famed for Qur’anic scholarship under rulers like Mai Idris Alooma'],
          ['Wangarawa scholars', 'Malian Muslim scholars and traders who brought Islam formally to Kano under Sarki Yaji (14th century)'],
          ['Al-Maghili', 'North African jurist who advised Emir Muhammad Rumfa of Kano and wrote a treatise on just Islamic governance'],
        ],
        rules: [
          'Key agents of Islam’s peaceful spread: honest Trans-Saharan merchants, itinerant scholars (Ulama), Sufi brotherhoods, intermarriage and royal patronage.',
          'Timbuktu (Mali) and Gazargamo (Borno) became major centres of literacy, Arabic manuscripts and Islamic jurisprudence.',
          'Islam introduced Arabic literacy, Ajami script (writing Hausa, Fulfulde, Kanuri and Yoruba in Arabic letters), formal courts and diplomatic links.',
        ],
        table: {
          headers: ['Region in Nigeria', 'How Islam entered', 'Notable figure / centre'],
          rows: [
            ['Kanem-Borno', 'Trans-Saharan trade via Fezzan/Lake Chad (11th century)', 'Mai Humai; Mai Idris Alooma; Gazargamo'],
            ['Hausaland (Kano, Katsina)', 'Wangarawa scholars from Mali (14th century)', 'Sarki Yaji; Muhammad Rumfa; al-Maghili'],
            ['Yorubaland (Oyo, Ilorin, Lagos)', 'Northern traders, scholars & Ilorin emirate (17th–19th centuries)', 'Old Oyo, Ilorin, Ibadan, Abeokuta & Lagos mosques'],
          ],
          trapNote: 'Remember KANEM-BORNO received Islam about three centuries BEFORE Hausaland — a favourite exam chronology question.',
        },
        example: {
          q: 'How did the Ajami script help spread Islamic knowledge among ordinary Nigerian communities?',
          steps: [
            ['Define Ajami', 'Writing local languages like Hausa, Fulfulde and Kanuri using Arabic letters'],
            ['Explain impact', 'Scholars composed poems and lessons in everyday mother tongues so women and non-Arabic speakers could learn easily'],
          ],
        },
        yourTurn: {
          q: 'Which part of present-day Nigeria was the earliest to receive Islam in the 11th century?',
          o: ['Kanem-Borno', 'Lagos Colony', 'Benin Kingdom', 'Calabar'],
          a: 0,
          h: [
            'Look toward northeastern Nigeria around Lake Chad, directly connected to the Trans-Saharan trail from Tripoli and Fezzan.',
            'Mai Humai became its first documented Muslim ruler.',
          ],
          e: 'Kanem-Borno received Islam earliest in Nigeria during the 11th century via Trans-Saharan contacts.',
        },
      },
      {
        title: 'Shaykh Uthman dan Fodio and the Sokoto Caliphate',
        idea: 'By the late 18th century, many Hausa rulers mixed Islam with pagan rituals (syncretism), levied oppressive un-Islamic taxes and neglected women’s education. Shaykh Uthman dan Fodio (1754–1817) — supported by his brother Abdullahi dan Fodio, son Muhammad Bello and scholarly daughter Nana Asma’u — began decades of peaceful preaching before migrating (Hijrah to Gudu in 1804) when persecuted by Yunfa of Gobir. The resulting Sokoto Caliphate unified northern Nigeria under Islamic justice, scholarship and widespread literacy.',
        terms: [
          ['Shaykh Uthman dan Fodio', 'Scholar and reformer from Degel who led the 1804 reform movement and founded the Sokoto Caliphate'],
          ['Nana Asma’u', 'Renowned scholar, poet and educator (daughter of Uthman dan Fodio) who pioneered women’s mass education (Yan Taru)'],
          ['Syncretism', 'Mixing Islamic practices with pagan customs — the main spiritual abuse Uthman dan Fodio preached against'],
        ],
        rules: [
          'Uthman dan Fodio’s reforms targeted four issues: religious syncretism, unfair taxation/extortion, corruption in courts and denial of women’s education.',
          'His major writings include Ihya al-Sunnah wa Ikhmad al-Bid’ah (Reviving the Sunnah) and Bayan Wujub al-Hijrah.',
          'Nana Asma’u’s Yan Taru network trained female teachers (Jajis) to educate rural women in Hausa, Fulfulde and Arabic.',
        ],
        table: {
          headers: ['Key Sokoto leader', 'Primary contribution'],
          rows: [
            ['Shaykh Uthman dan Fodio', 'Spiritual leader, prolific author and founder of the Sokoto Caliphate'],
            ['Abdullahi dan Fodio', 'Jurist, Qur’an commentator (Diya al-Ta’wil) and Emir of Gwandu'],
            ['Sultan Muhammad Bello', 'Administrator, historian (Infaq al-Maysur) and builder of Sokoto city'],
            ['Nana Asma’u', 'Multilingual poet and pioneer of structured women’s education (Yan Taru)'],
          ],
          trapNote: 'Notice that Shaykh Uthman dan Fodio spent nearly THIRTY years teaching peacefully before taking up arms in self-defence after Gobir’s ruler Yunfa attacked his community.',
        },
        example: {
          q: 'Why is Nana Asma’u remembered today as a pioneering Nigerian educator?',
          steps: [
            ['Recall her organisation', 'She created the Yan Taru women’s education movement across the Sokoto Caliphate'],
            ['Recall her method', 'She wrote clear educational poems in Hausa, Fulfulde and Arabic and trained women teachers (Jajis) to reach villages'],
          ],
        },
        yourTurn: {
          q: 'Which female scholar of the Sokoto Caliphate established the Yan Taru movement to educate women across northern Nigeria?',
          o: ['Nana Asma’u', 'Queen Amina', 'Moremi Ajasoro', 'Funmilayo Ransome-Kuti'],
          a: 0,
          h: [
            'She was the multilingual daughter of Shaykh Uthman dan Fodio.',
            'Her educational poems were taught in Hausa, Fulfulde and Arabic.',
          ],
          e: 'Nana Asma’u (1793–1864) founded the Yan Taru network, championing women’s literacy and Islamic learning.',
        },
      },
    ],
    qs: [
      {
        q: 'Which group of travelling Muslim scholars from Mali helped establish Islam formally in Kano in the 14th century?',
        o: ['The Wangarawa', 'The Portuguese', 'The Phoenicians', 'The Romans'],
        a: 0,
        e: 'Wangarawa scholars from Mali brought organised Islamic learning and prayer to Kano during Sarki Yaji’s reign.',
      },
      {
        q: 'Which famous North African scholar visited Kano during Emir Muhammad Rumfa’s reign and wrote a manual on Islamic governance?',
        o: ['Muhammad al-Maghili', 'Ibn Sina', 'Al-Khwarizmi', 'Al-Razi'],
        a: 0,
        e: 'Shaykh al-Maghili advised Muhammad Rumfa and authored "The Obligations of Princes" for Kano.',
      },
      {
        q: 'What was the main spiritual reason behind Shaykh Uthman dan Fodio’s 1804 reform movement?',
        o: [
          'Purifying Islam from syncretism, unjust taxes and judicial corruption',
          'Banning Arabic schools in Hausaland',
          'Closing Trans-Saharan trade routes',
          'Replacing Maliki law with Roman law',
        ],
        a: 0,
        e: 'Dan Fodio campaigned against mixing pagan customs with Islam, oppressive taxation, corruption and neglect of women’s education.',
      },
      {
        q: 'To which town did Shaykh Uthman dan Fodio make his Hijrah in 1804 after threats from King Yunfa of Gobir?',
        o: ['Gudu', 'Kano', 'Lagos', 'Katsina'],
        a: 0,
        e: 'Uthman dan Fodio migrated from Degel to Gudu in February 1804, where followers pledged allegiance to him as Amir al-Mu’minin.',
      },
      {
        q: 'Which son of Uthman dan Fodio succeeded him as Sultan of Sokoto and wrote the historical work "Infaq al-Maysur"?',
        o: ['Muhammad Bello', 'Idris Alooma', 'Mansa Musa', 'Askia Muhammad'],
        a: 0,
        e: 'Sultan Muhammad Bello administered the eastern Caliphate from Sokoto and authored major historical and medical works.',
      },
      {
        q: 'What is "Ajami" in West African Islamic literary history?',
        o: [
          'Writing local African languages such as Hausa or Fulfulde using the Arabic alphabet',
          'A medieval currency used in Kano',
          'A style of mosque tower',
          'A taxation system in Borno',
        ],
        a: 0,
        e: 'Ajami adapted Arabic script to local African tongues, spreading literacy far beyond Arabic specialists.',
      },
    ],
  },
];

export function buildIrsCurriculum() {
  return buildUtmeSubjectCurriculum(IRS_SPECS);
}
