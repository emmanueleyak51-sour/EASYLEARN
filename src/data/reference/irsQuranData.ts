export type QuranEditionId = 'arabic' | 'transliteration' | 'sahih' | 'yusufali' | 'pickthall';

export interface QuranEditionMeta {
  id: QuranEditionId;
  label: string;
  sub: string;
}

export const QURAN_EDITIONS: readonly QuranEditionMeta[] = [
  { id: 'arabic', label: 'Arabic (Uthmani)', sub: 'Original script' },
  { id: 'transliteration', label: 'Transliteration', sub: 'Pronunciation guide' },
  { id: 'sahih', label: 'Sahih International', sub: 'Clear modern English' },
  { id: 'yusufali', label: 'Yusuf Ali', sub: 'Classic study commentary style' },
  { id: 'pickthall', label: 'Pickthall', sub: 'Traditional English' },
] as const;

export interface QuranSurahMeta {
  number: number;
  name: string;
  meaning: string;
  ayahs: number;
  revelation: 'Meccan' | 'Medinan';
}

export const QURAN_SURAHS: readonly QuranSurahMeta[] = [
  { number: 1, name: 'Al-Fatihah', meaning: 'The Opening', ayahs: 7, revelation: 'Meccan' },
  { number: 2, name: 'Al-Baqarah', meaning: 'The Cow', ayahs: 286, revelation: 'Medinan' },
  { number: 3, name: 'Ali Imran', meaning: 'Family of Imran', ayahs: 200, revelation: 'Medinan' },
  { number: 4, name: 'An-Nisa', meaning: 'The Women', ayahs: 176, revelation: 'Medinan' },
  { number: 5, name: 'Al-Ma’idah', meaning: 'The Table Spread', ayahs: 120, revelation: 'Medinan' },
  { number: 6, name: 'Al-An’am', meaning: 'The Cattle', ayahs: 165, revelation: 'Meccan' },
  { number: 12, name: 'Yusuf', meaning: 'Joseph', ayahs: 111, revelation: 'Meccan' },
  { number: 17, name: 'Al-Isra', meaning: 'The Night Journey', ayahs: 111, revelation: 'Meccan' },
  { number: 18, name: 'Al-Kahf', meaning: 'The Cave', ayahs: 110, revelation: 'Meccan' },
  { number: 31, name: 'Luqman', meaning: 'Luqman', ayahs: 34, revelation: 'Meccan' },
  { number: 36, name: 'Ya-Sin', meaning: 'Ya-Sin', ayahs: 83, revelation: 'Meccan' },
  { number: 49, name: 'Al-Hujurat', meaning: 'The Rooms', ayahs: 18, revelation: 'Medinan' },
  { number: 55, name: 'Ar-Rahman', meaning: 'The Most Merciful', ayahs: 78, revelation: 'Medinan' },
  { number: 67, name: 'Al-Mulk', meaning: 'The Sovereignty', ayahs: 30, revelation: 'Meccan' },
  { number: 87, name: 'Al-A’la', meaning: 'The Most High', ayahs: 19, revelation: 'Meccan' },
  { number: 91, name: 'Ash-Shams', meaning: 'The Sun', ayahs: 15, revelation: 'Meccan' },
  { number: 93, name: 'Ad-Duhaa', meaning: 'The Morning Hours', ayahs: 11, revelation: 'Meccan' },
  { number: 94, name: 'Ash-Sharh', meaning: 'The Relief', ayahs: 8, revelation: 'Meccan' },
  { number: 95, name: 'At-Tin', meaning: 'The Fig', ayahs: 8, revelation: 'Meccan' },
  { number: 96, name: 'Al-Alaq', meaning: 'The Clot (First Revelation)', ayahs: 19, revelation: 'Meccan' },
  { number: 97, name: 'Al-Qadr', meaning: 'The Night of Decree', ayahs: 5, revelation: 'Meccan' },
  { number: 99, name: 'Az-Zalzalah', meaning: 'The Earthquake', ayahs: 8, revelation: 'Medinan' },
  { number: 102, name: 'At-Takathur', meaning: 'Rivalry in Worldly Gain', ayahs: 8, revelation: 'Meccan' },
  { number: 103, name: 'Al-Asr', meaning: 'The Declining Day', ayahs: 3, revelation: 'Meccan' },
  { number: 105, name: 'Al-Fil', meaning: 'The Elephant', ayahs: 5, revelation: 'Meccan' },
  { number: 106, name: 'Quraysh', meaning: 'Quraysh', ayahs: 4, revelation: 'Meccan' },
  { number: 107, name: 'Al-Ma’un', meaning: 'Small Kindnesses', ayahs: 7, revelation: 'Meccan' },
  { number: 108, name: 'Al-Kawthar', meaning: 'The Abundance', ayahs: 3, revelation: 'Meccan' },
  { number: 109, name: 'Al-Kafirun', meaning: 'The Disbelievers', ayahs: 6, revelation: 'Meccan' },
  { number: 110, name: 'An-Nasr', meaning: 'Divine Support', ayahs: 3, revelation: 'Medinan' },
  { number: 111, name: 'Al-Masad', meaning: 'The Palm Fibre', ayahs: 5, revelation: 'Meccan' },
  { number: 112, name: 'Al-Ikhlas', meaning: 'Sincerity / Pure Monotheism', ayahs: 4, revelation: 'Meccan' },
  { number: 113, name: 'Al-Falaq', meaning: 'The Daybreak', ayahs: 5, revelation: 'Meccan' },
  { number: 114, name: 'An-Nas', meaning: 'Mankind', ayahs: 6, revelation: 'Meccan' },
] as const;

export interface QuranAyahItem {
  numberInSurah: number;
  arabic: string;
  transliteration: string;
  sahih: string;
  yusufali: string;
  pickthall: string;
}

export const OFFLINE_QURAN_SURAHS: Record<number, QuranAyahItem[]> = {
  1: [
    {
      numberInSurah: 1,
      arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
      transliteration: 'Bismillaahir Rahmaanir Raheem',
      sahih: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      yusufali: 'In the name of Allah, Most Gracious, Most Merciful.',
      pickthall: 'In the name of Allah, the Beneficent, the Merciful.',
    },
    {
      numberInSurah: 2,
      arabic: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
      transliteration: 'Alhamdu lillaahi Rabbil ‘aalameen',
      sahih: '[All] praise is [due] to Allah, Lord of the worlds —',
      yusufali: 'Praise be to Allah, the Cherisher and Sustainer of the worlds;',
      pickthall: 'Praise be to Allah, Lord of the Worlds,',
    },
    {
      numberInSurah: 3,
      arabic: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
      transliteration: 'Ar-Rahmaanir-Raheem',
      sahih: 'The Entirely Merciful, the Especially Merciful,',
      yusufali: 'Most Gracious, Most Merciful;',
      pickthall: 'The Beneficent, the Merciful.',
    },
    {
      numberInSurah: 4,
      arabic: 'مَٰلِكِ يَوْمِ ٱلدِّينِ',
      transliteration: 'Maaliki Yawmid-Deen',
      sahih: 'Sovereign of the Day of Recompense.',
      yusufali: 'Master of the Day of Judgment.',
      pickthall: 'Master of the Day of Judgment,',
    },
    {
      numberInSurah: 5,
      arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      transliteration: 'Iyyaaka na‘budu wa iyyaaka nasta‘een',
      sahih: 'It is You we worship and You we ask for help.',
      yusufali: 'Thee do we worship, and Thine aid we seek.',
      pickthall: 'Thee (alone) we worship; Thee (alone) we ask for help.',
    },
    {
      numberInSurah: 6,
      arabic: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ',
      transliteration: 'Ihdinas-Siraatal-Mustaqeem',
      sahih: 'Guide us to the straight path —',
      yusufali: 'Show us the straight way,',
      pickthall: 'Show us the straight path,',
    },
    {
      numberInSurah: 7,
      arabic: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ',
      transliteration: 'Siraatal-lazeena an‘amta ‘alaihim ghairil-maghdoobi ‘alaihim wa lad-daaalleen',
      sahih: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
      yusufali: 'The way of those on whom Thou hast bestowed Thy Grace, those whose (portion) is not wrath, and who go not astray.',
      pickthall: 'The path of those whom Thou hast favoured; Not the (path) of those who earn Thine anger nor of those who go astray.',
    },
  ],
  103: [
    {
      numberInSurah: 1,
      arabic: 'وَٱلْعَصْرِ',
      transliteration: 'Wal-‘asr',
      sahih: 'By time,',
      yusufali: 'By (the Token of) Time (through the ages),',
      pickthall: 'By the declining day,',
    },
    {
      numberInSurah: 2,
      arabic: 'إِنَّ ٱلْإِنسَٰنَ لَفِى خُسْرٍ',
      transliteration: 'Innal-insaana lafee khusr',
      sahih: 'Indeed, mankind is in loss,',
      yusufali: 'Verily Man is in loss,',
      pickthall: 'Lo! man is in a state of loss,',
    },
    {
      numberInSurah: 3,
      arabic: 'إِلَّا ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّٰلِحَٰتِ وَتَوَاصَوْا۟ بِٱلْحَقِّ وَتَوَاصَوْا۟ بِٱلصَّبْرِ',
      transliteration: 'Illal-lazeena aamanoo wa ‘amilus-saalihaati wa tawaasaw bil-haqqi wa tawaasaw bis-sabr',
      sahih: 'Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.',
      yusufali: 'Except such as have Faith, and do righteous deeds, and (join together) in the mutual teaching of Truth, and of Patience and Constancy.',
      pickthall: 'Save those who believe and do good works, and exhort one another to truth and exhort one another to endurance.',
    },
  ],
  108: [
    {
      numberInSurah: 1,
      arabic: 'إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ',
      transliteration: 'Innaaa a‘tainaakal-kawthar',
      sahih: 'Indeed, We have granted you, [O Muhammad], al-Kawthar.',
      yusufali: 'To thee have We granted the Fount (of Abundance).',
      pickthall: 'Lo! We have given thee Abundance;',
    },
    {
      numberInSurah: 2,
      arabic: 'فَصَلِّ لِرَبِّكَ وَٱنْحَرْ',
      transliteration: 'Fasalli li-Rabbika wanhar',
      sahih: 'So pray to your Lord and sacrifice [to Him alone].',
      yusufali: 'Therefore to thy Lord turn in Prayer and Sacrifice.',
      pickthall: 'So pray unto thy Lord, and sacrifice.',
    },
    {
      numberInSurah: 3,
      arabic: 'إِنَّ شَانِئَكَ هُوَ ٱلْأَبْتَرُ',
      transliteration: 'Inna shaani-aka huwal-abtar',
      sahih: 'Indeed, your enemy is the one cut off.',
      yusufali: 'For he who hateth thee, he will be cut off (from Future Hope).',
      pickthall: 'Lo! it is thy insulter (and not thou) who is without posterity.',
    },
  ],
  112: [
    {
      numberInSurah: 1,
      arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
      transliteration: 'Qul Huwallaahu Ahad',
      sahih: 'Say, “He is Allah, [who is] One,',
      yusufali: 'Say: He is Allah, the One and Only;',
      pickthall: 'Say: He is Allah, the One!',
    },
    {
      numberInSurah: 2,
      arabic: 'ٱللَّهُ ٱلصَّمَدُ',
      transliteration: 'Allaahus-Samad',
      sahih: 'Allah, the Eternal Refuge.',
      yusufali: 'Allah, the Eternal, Absolute;',
      pickthall: 'Allah, the eternally Besought of all!',
    },
    {
      numberInSurah: 3,
      arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      transliteration: 'Lam yalid wa lam yoolad',
      sahih: 'He neither begets nor is born,',
      yusufali: 'He begetteth not, nor is He begotten;',
      pickthall: 'He begetteth not nor was begotten.',
    },
    {
      numberInSurah: 4,
      arabic: 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ',
      transliteration: 'Wa lam yakul-lahoo kufuwan ahad',
      sahih: 'Nor is there to Him any equivalent.”',
      yusufali: 'And there is none like unto Him.',
      pickthall: 'And there is none comparable unto Him.',
    },
  ],
  113: [
    {
      numberInSurah: 1,
      arabic: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ',
      transliteration: 'Qul a‘oozu bi-Rabbil-falaq',
      sahih: 'Say, “I seek refuge in the Lord of daybreak',
      yusufali: 'Say: I seek refuge with the Lord of the Dawn',
      pickthall: 'Say: I seek refuge in the Lord of the Daybreak',
    },
    {
      numberInSurah: 2,
      arabic: 'مِن شَرِّ مَا خَلَقَ',
      transliteration: 'Min sharri maa khalaq',
      sahih: 'From the evil of that which He created',
      yusufali: 'From the mischief of created things;',
      pickthall: 'From the evil of that which He created;',
    },
    {
      numberInSurah: 3,
      arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
      transliteration: 'Wa min sharri ghaasiqin izaa waqab',
      sahih: 'And from the evil of darkness when it settles',
      yusufali: 'From the mischief of Darkness as it overspreads;',
      pickthall: 'From the evil of the darkness when it is intense,',
    },
    {
      numberInSurah: 4,
      arabic: 'وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ',
      transliteration: 'Wa min sharrin-naffaathaati fil-‘uqad',
      sahih: 'And from the evil of the blowers in knots',
      yusufali: 'From the mischief of those who practise secret arts;',
      pickthall: 'And from the evil of malignant witchcraft,',
    },
    {
      numberInSurah: 5,
      arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
      transliteration: 'Wa min sharri haasidin izaa hasad',
      sahih: 'And from the evil of an envier when he envies.”',
      yusufali: 'And from the mischief of the envious one as he practises envy.',
      pickthall: 'And from the evil of the envier when he envieth.',
    },
  ],
  114: [
    {
      numberInSurah: 1,
      arabic: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
      transliteration: 'Qul a‘oozu bi-Rabbin-naas',
      sahih: 'Say, “I seek refuge in the Lord of mankind,',
      yusufali: 'Say: I seek refuge with the Lord and Cherisher of Mankind,',
      pickthall: 'Say: I seek refuge in the Lord of mankind,',
    },
    {
      numberInSurah: 2,
      arabic: 'مَلِكِ ٱلنَّاسِ',
      transliteration: 'Malikin-naas',
      sahih: 'The Sovereign of mankind,',
      yusufali: 'The King (or Ruler) of Mankind,',
      pickthall: 'The King of mankind,',
    },
    {
      numberInSurah: 3,
      arabic: 'إِلَٰهِ ٱلنَّاسِ',
      transliteration: 'Ilaahin-naas',
      sahih: 'The God of mankind,',
      yusufali: 'The god (or judge) of Mankind,—',
      pickthall: 'The God of mankind,',
    },
    {
      numberInSurah: 4,
      arabic: 'مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ',
      transliteration: 'Min sharril-waswaasil-khannaas',
      sahih: 'From the evil of the retreating whisperer —',
      yusufali: 'From the mischief of the Whisperer (of Evil), who withdraws (after his whisper),—',
      pickthall: 'From the evil of the sneaking whisperer,',
    },
    {
      numberInSurah: 5,
      arabic: 'ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ',
      transliteration: 'Allazee yuwaswisu fee sudoorin-naas',
      sahih: 'Who whispers [evil] into the breasts of mankind —',
      yusufali: '(The same) who whispers into the hearts of Mankind,—',
      pickthall: 'Who whispereth in the hearts of mankind,',
    },
    {
      numberInSurah: 6,
      arabic: 'مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ',
      transliteration: 'Minal-jinnati wan-naas',
      sahih: 'From among the jinn and mankind.”',
      yusufali: 'Among Jinns and among men.',
      pickthall: 'Of the jinn and of mankind.',
    },
  ],
};

export interface HadithCard {
  num: number;
  title: string;
  narrator: string;
  text: string;
  lesson: string;
}

export const AN_NAWAWI_HADITHS: readonly HadithCard[] = [
  {
    num: 1,
    title: 'Actions are judged by intentions',
    narrator: 'Umar ibn al-Khattab (RA)',
    text: 'Actions are according to intentions, and everyone will get what was intended.',
    lesson: 'Sincerity (Ikhlas) gives worship and study their true spiritual value.',
  },
  {
    num: 3,
    title: 'The Five Pillars of Islam',
    narrator: 'Abdullah ibn Umar (RA)',
    text: 'Islam is built on five pillars: testifying that there is no deity worthy of worship except Allah and Muhammad is His Messenger, establishing prayer, paying Zakat, pilgrimage to the House, and fasting Ramadan.',
    lesson: 'Core syllabus foundation linking faith (Shahadah) to daily practice and charity.',
  },
  {
    num: 7,
    title: 'Religion is sincere advice',
    narrator: 'Tamim ad-Dari (RA)',
    text: 'Religion is Nasihah (sincerity and sincere advice) — to Allah, His Book, His Messenger, the leaders of the Muslims, and their common folk.',
    lesson: 'Encourages honest counsel, civic responsibility, and looking out for the community.',
  },
  {
    num: 13,
    title: 'Brotherhood and empathy',
    narrator: 'Anas ibn Malik (RA)',
    text: 'None of you truly believes until he loves for his brother what he loves for himself.',
    lesson: 'Key moral teaching on fairness, compassion, and eliminating envy.',
  },
  {
    num: 15,
    title: 'Good speech and hospitality',
    narrator: 'Abu Hurairah (RA)',
    text: 'Whoever believes in Allah and the Last Day should speak good or remain silent, be generous to his neighbour, and be generous to his guest.',
    lesson: 'Links faith directly to self-control in speech and community kindness.',
  },
  {
    num: 16,
    title: 'Control your anger',
    narrator: 'Abu Hurairah (RA)',
    text: 'A man said to the Prophet: “Advise me!” The Prophet said: “Do not become angry.” He repeated the request several times and each time the Prophet replied: “Do not become angry.”',
    lesson: 'Restraint under provocation protects relationships and sound judgement.',
  },
  {
    num: 18,
    title: 'God-consciousness and good character',
    narrator: 'Abu Dharr & Mu’adh ibn Jabal (RA)',
    text: 'Fear Allah wherever you are, follow up a bad deed with a good deed which will wipe it out, and behave well towards people.',
    lesson: 'Taqwa applies in private and public, paired with repentance and good manners.',
  },
  {
    num: 34,
    title: 'Correcting wrong with wisdom',
    narrator: 'Abu Sa’id al-Khudri (RA)',
    text: 'Whoever sees an evil should change it with his hand; if unable, then with his tongue; and if unable, then with his heart — and that is the weakest of faith.',
    lesson: 'Teaches responsible moral courage within lawful authority and wisdom.',
  },
] as const;
