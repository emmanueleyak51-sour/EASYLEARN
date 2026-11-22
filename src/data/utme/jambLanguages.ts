import { buildUtmeSubjectCurriculum, compactUtmeTopic, type CompactTopicInput } from './builder';
import { FRENCH_EXTRA_SPECS, ARABIC_EXTRA_SPECS, HAUSA_EXTRA_SPECS } from './extraLangsA';
import { IGBO_EXTRA_SPECS, YORUBA_EXTRA_SPECS } from './extraLangsB';

const FRENCH_SPECS: CompactTopicInput[] = [
  {
    id: 'french-articles-nouns-adjectives',
    name: 'Articles, gender, plurals and adjective agreement',
    sec: 'French grammar',
    goals: [
      'Choose correct definite, indefinite and partitive articles matching masculine/feminine nouns',
      'Apply French adjective agreement and placement accurately in sentences',
    ],
    trap: 'After a negative verb ("ne... pas"), indefinite and partitive articles (un, une, des, du, de la) change to DE or D’ — e.g., "J’ai un livre" becomes "Je n’ai pas de livre" (NEVER "pas un livre")!',
    p1: {
      title: 'Definite, indefinite and partitive articles',
      idea: 'Every French noun has grammatical gender (masculine or feminine) and requires an agreeing article. Definite articles ("the"): le (masc.), la (fem.), l’ (before vowel/mute h), les (plural). Indefinite articles ("a/some"): un (masc.), une (fem.), des (plural). Partitive articles ("some" for uncountable items like water or bread): du, de la, de l’, des.',
      terms: [
        ['Elision (l’)', 'Dropping the vowel in le/la before a vowel or silent h: l’école, l’homme'],
        ['Contraction (au / du)', 'à + le = au; à + les = aux; de + le = du; de + les = des'],
        ['Partitive article', 'Expresses an unspecified quantity ("du pain" = some bread, "de l’eau" = some water)'],
      ],
      rules: [
        'In negation (ne... pas), un/une/des/du/de la become "de/d’" (except with the verb être: "Ce n’est pas un stylo").',
        'Nouns ending in -eau or -al take special plurals: un bateau → des bateaux; un journal → des journaux.',
      ],
      headers: ['Article type', 'Masculine / Feminine / Plural'],
      rows: [
        ['Definite ("the")', 'le / la / l’ / les'],
        ['Indefinite ("a / some")', 'un / une / des'],
        ['Partitive ("some")', 'du / de la / de l’ / des'],
      ],
      exQ: 'Turn "Il mange du riz" (He eats rice) into the negative.',
      exSteps: [
        ['Wrap verb with ne...pas', 'Il ne mange pas...'],
        ['Change partitive "du" to "de"', 'Il ne mange pas de riz.'],
      ],
      checkQ: 'Choose the grammatically correct French negative sentence for "I do not have any money":',
      checkO: [
        'Je n’ai pas d’argent.',
        'Je n’ai pas de l’argent.',
        'Je n’ai pas du argent.',
        'Je pas ai argent.',
      ],
      checkH: [
        'After "ne... pas", the partitive article simplifies to "de" (or "d’" before a vowel).',
        '"Argent" begins with the vowel "a".',
      ],
      checkE: 'After "ne... pas", "de l’" reduces to "d’" before a vowel: "Je n’ai pas d’argent."',
    },
    p2: {
      title: 'Adjective agreement and position',
      idea: 'French adjectives must agree in gender and number with the noun they describe (usually adding -e for feminine and -s for plural: petit → petite → petites). Most adjectives follow the noun ("une robe rouge"), EXCEPT short common BAGS adjectives (Beauty, Age, Goodness, Size: beau, jeune, vieux, bon, grand, petit, nouveau) which normally precede the noun.',
      terms: [
        ['BAGS adjectives', 'Beauty, Age, Goodness and Size adjectives placed BEFORE the noun (e.g., une grande maison)'],
        ['Irregular feminine', 'beau → belle; vieux → vieille; nouveau → nouvelle; heureux → heureuse; actif → active'],
        ['Possessive adjectives', 'mon/ma/mes (my), ton/ta/tes (your), son/sa/ses (his/her) — agree with the POSSESSED noun, NOT the owner!'],
      ],
      rules: [
        'Use mon/ton/son even before a FEMININE noun starting with a vowel: "mon amie" (not "ma amie"), "son école".',
        'Colours, nationalities and shapes always go AFTER the noun: "un drapeau vert".',
      ],
      headers: ['Rule', 'Correct French example'],
      rows: [
        ['Standard adjective after noun', 'Une voiture blanche (a white car)'],
        ['BAGS adjective before noun', 'Un petit garçon (a small boy)'],
        ['Possessive before feminine vowel', 'Mon école (my school — uses "mon" for smooth sound)'],
      ],
      exQ: 'Translate "my Nigerian friend (female)" into French.',
      exSteps: [
        ['Possessive before vowel "amie"', 'Use "mon" → mon amie'],
        ['Feminine nationality after noun', 'nigérian → nigériane → mon amie nigériane'],
      ],
      checkQ: 'Which phrase correctly translates "her school" into French (knowing "école" is feminine)?',
      checkO: ['son école', 'sa école', 'ses école', 'le école'],
      checkH: [
        'Although "école" is feminine, it starts with a vowel sound ("é").',
        'French avoids two clashing vowels ("sa école") by using the masculine singular possessive form.',
      ],
      checkE: 'Before any singular feminine noun beginning with a vowel or silent h, French uses mon/ton/son: "son école".',
    },
    qs: [
      ['Choose the correct contraction to complete: "Nous allons ___ marché."', 'au', 'à le', 'du', 'aux', 'à + le always contracts to "au" ("au marché").'],
      ['What is the plural of "un journal" (a newspaper)?', 'des journaux', 'des journals', 'les journale', 'un journaux', 'Most French nouns ending in -al change to -aux in the plural.'],
      ['Complete correctly: "Elle boit ___ eau fraîche."', 'de l’', 'du', 'des', 'la de', '"Eau" is feminine singular starting with a vowel, taking the partitive "de l’".'],
      ['Which adjective correctly agrees in "Les étudiantes sont ___"?', 'intelligentes', 'intelligent', 'intelligents', 'intelligente', '"Les étudiantes" is feminine plural, requiring -es ("intelligentes").'],
      ['Which sentence correctly translates "I see a beautiful house"?', 'Je vois une belle maison.', 'Je vois une maison beau.', 'Je vois un belle maison.', 'Je vois une beaux maison.', '"Beau" becomes feminine "belle" and precedes the noun ("une belle maison").'],
      ['Choose the correct negative: "Tu as des frères?" — "Non, je n’ai pas ___ frères."', 'de', 'des', 'du', 'les', 'Indefinite "des" becomes "de" after "ne... pas".'],
    ],
  },
  {
    id: 'french-verbs-tenses-communication',
    name: 'French verb tenses, pronouns and everyday communication',
    sec: 'Verbs and usage',
    goals: [
      'Conjugate regular -er/-ir/-re and key irregular verbs (être, avoir, aller, faire) in Présent, Passé Composé and Futur',
      'Use everyday Francophone greetings, time expressions, prepositions and comprehension clues',
    ],
    trap: 'Do not use AVOIR for every verb in the Passé Composé: reflexive verbs ("se lever") and the DR MRS VANDERTRAMP verbs of motion (aller, venir, arriver, partir, naître, mourir) take ÊTRE and their past participle agrees with the subject!',
    p1: {
      title: 'Présent, Passé Composé and Futur Proche',
      idea: 'French verbs fall into three regular groups (-er like parler, -ir like finir, -re like vendre) plus vital irregulars (être, avoir, aller, faire, pouvoir, vouloir). To talk about the near future, use Aller + infinitive ("Je vais étudier"). To talk about completed past actions, use Passé Composé = auxiliary (avoir or être) + past participle ("J’ai mangé", "Elle est allée").',
      terms: [
        ['Futur Proche', 'Present tense of aller + infinitive ("Nous allons voyager" = We are going to travel)'],
        ['Passé Composé', 'Compound past tense: present of avoir/être + past participle (-é, -i, -u)'],
        ['Reflexive verbs', 'Verbs with se (se réveiller, s’appeler) always taking ÊTRE in Passé Composé'],
      ],
      rules: [
        'Regular -er present endings: -e, -es, -e, -ons, -ez, -ent.',
        'With ÊTRE in Passé Composé, add -e (feminine) and -s (plural) to the past participle: "Elles sont arrivées."',
      ],
      headers: ['Tense', 'Example ("to speak" / "to go")'],
      rows: [
        ['Présent', 'Nous parlons / Ils vont'],
        ['Futur Proche', 'Je vais parler / Tu vas aller'],
        ['Passé Composé', 'J’ai parlé / Elle est allée'],
      ],
      exQ: 'Put "Marie (aller) au lycée hier" into the Passé Composé.',
      exSteps: [
        ['Choose auxiliary', '"Aller" is a motion verb → uses ÊTRE ("est")'],
        ['Agree past participle with feminine Marie', 'allé + e → "Marie est allée au lycée hier."'],
      ],
      checkQ: 'Choose the correct Passé Composé form: "Hier, mes sœurs ___ à Abuja." (arriver)',
      checkO: ['sont arrivées', 'ont arrivé', 'est arrivée', 'sont arrivé'],
      checkH: [
        '"Arriver" uses the auxiliary ÊTRE, not AVOIR.',
        '"Mes sœurs" is feminine plural, so the past participle needs -es.',
      ],
      checkE: '"Arriver" takes être and agrees with feminine plural "mes sœurs": "sont arrivées".',
    },
    p2: {
      title: 'Prepositions, pronouns and everyday dialogues',
      idea: 'Mastering polite expressions ("Bonjour", "S’il vous plaît", "Je voudrais..."), days, weather ("Il fait chaud"), telling time ("Il est huit heures et demie") and geographic prepositions lets you ace French comprehension and dialogue cloze passages. Use "en" for feminine countries ("en France", "en Côte d’Ivoire"), "au" for masculine countries ("au Nigeria", "au Togo") and "à" for cities ("à Lagos", "à Paris").',
      terms: [
        ['Geographic prepositions', 'à + city ("à Abuja"); au + masc. country ("au Nigeria"); en + fem. country ("en France")'],
        ['Tu vs Vous', 'Tu is informal singular (friends/family); Vous is formal singular (elders/teachers) or plural'],
        ['Direct object pronouns', 'le, la, l’, les placed BEFORE the verb ("Je le vois" = I see him/it)'],
      ],
      rules: [
        'Countries ending in -e are mostly feminine ("en Guinée"), except le Mexique, le Mozambique, le Zimbabwe and le Cambodge.',
        'Use "Quel âge as-tu?" / "J’ai seize ans" (using AVOIR, never être, for age in French!).',
      ],
      headers: ['English expression', 'Natural French idiom'],
      rows: [
        ['I am 16 years old', 'J’ai seize ans (uses avoir)'],
        ['It is hot today', 'Il fait chaud aujourd’hui (uses faire)'],
        ['I am hungry / thirsty', 'J’ai faim / J’ai soif (uses avoir)'],
      ],
      exQ: 'Complete the sentence: "Mon oncle travaille ___ Nigeria, mais il habite maintenant ___ Paris."',
      exSteps: [
        ['Nigeria is masculine country', 'au Nigeria'],
        ['Paris is a city', 'à Paris'],
      ],
      checkQ: 'Which sentence correctly says "I am seventeen years old" in French?',
      checkO: ['J’ai dix-sept ans.', 'Je suis dix-sept ans.', 'Je fais dix-sept ans.', 'J’ai dix-sept heures.'],
      checkH: [
        'In French, you literally "have" years rather than "being" years.',
        'Choose the verb AVOIR ("J’ai...").',
      ],
      checkE: 'French expresses age with the verb avoir: "J’ai dix-sept ans."',
    },
    qs: [
      ['Complete the present tense: "Nous ___ français chaque jour." (parler)', 'parlons', 'parlez', 'parlent', 'parle', 'First-person plural (-er verb) takes -ons: "nous parlons".'],
      ['Choose the right preposition: "Bola habite ___ Lagos, ___ Nigeria."', 'à ... au', 'en ... à', 'au ... en', 'dans ... aux', 'Cities take "à" ("à Lagos") and masculine countries take "au" ("au Nigeria").'],
      ['Which verb is used in French weather idioms like "It is cold" ("Il ___ froid")?', 'fait', 'est', 'a', 'va', 'Weather expressions use faire: "Il fait froid / chaud / beau."'],
      ['What is the correct Futur Proche for "They are going to eat"?', 'Ils vont manger.', 'Ils ont mangé.', 'Ils mangent.', 'Ils sont mangés.', 'Futur Proche = present of aller ("vont") + infinitive ("manger").'],
      ['Which pronoun should a Nigerian student use when speaking politely to their school principal?', 'Vous', 'Tu', 'Ils', 'On', '"Vous" shows formal politeness to elders, strangers and teachers.'],
      ['Complete correctly: "J’ai oublié mon livre, mais Paul ___ a trouvé."', 'l’', 'lui', 'en', 'y', 'Direct object pronoun "le" elides to "l’" before the vowel in "a trouvé".'],
    ],
  },
];

const ARABIC_SPECS: CompactTopicInput[] = [
  {
    id: 'arabic-nahw-sentences',
    name: 'Arabic grammar (Nahw): nominal and verbal sentences',
    sec: 'Arabic grammar',
    goals: [
      'Distinguish the three parts of Arabic speech (Ism, Fi’l, Harf) and vowel signs (Harakat)',
      'Analyse Nominal Sentences (Jumlah Ismiyyah) and Verbal Sentences (Jumlah Fi’liyyah) with correct case endings',
    ],
    trap: 'Do not mix up the case endings of Subject (Fa’il) and Direct Object (Maf’ul bihi): in a verbal sentence, the Subject is ALWAYS Marfu’ (nominative, -u / Dammah), while the Direct Object is ALWAYS Mansub (accusative, -a / Fathah).',
    p1: {
      title: 'Parts of speech and Jumlah Ismiyyah (Nominal sentence)',
      idea: 'Every word in Arabic belongs to one of three classes: Ism (noun/adjective/pronoun), Fi’l (verb) or Harf (preposition/particle). A sentence beginning with a noun is a Nominal Sentence (Jumlah Ismiyyah), made of two core pillars: Mubtada’ (subject — usually definite and Marfu’) and Khabar (predicate — usually indefinite and Marfu’), as in "Al-kitabu mufidun" (The book is useful).',
      terms: [
        ['Mubtada’ & Khabar', 'The Subject (Mubtada’) and Predicate (Khabar) of a nominal sentence — both normally Marfu’ (Dammah)'],
        ['Al-Shamsiyyah vs Al-Qamariyyah', 'Sun letters assimilate the "l" of "al-" (ash-shams); Moon letters pronounce the "l" clearly (al-qamar)'],
        ['Inna & Kana', 'Inna puts the subject in Mansub (-a); Kana puts the predicate in Mansub (-a)'],
      ],
      rules: [
        'Standard vowel signs (Harakat): Fathah (-a), Kasrah (-i), Dammah (-u), Sukun (no vowel) and Shaddah (doubled consonant).',
        'After any preposition (Harf Jarr like fi, ila, min, ala), the following noun becomes Majrur (takes Kasrah, -i): "fil-madrasati".',
      ],
      headers: ['Case (I’rab)', 'Primary singular vowel ending & role'],
      rows: [
        ['Raf’ (Marfu’)', 'Dammah (-u) — Subject (Fa’il), Mubtada’, Khabar'],
        ['Nasb (Mansub)', 'Fathah (-a) — Direct Object (Maf’ul bihi)'],
        ['Jarr (Majrur)', 'Kasrah (-i) — Noun after a preposition or Mudaf Ilayhi'],
      ],
      exQ: 'Identify the Mubtada’ and Khabar in "Al-mu’allimu mujtahidun" (The teacher is diligent).',
      exSteps: [
        ['First definite noun', 'Al-mu’allimu = Mubtada’ (Marfu’ with Dammah)'],
        ['Information about it', 'mujtahidun = Khabar (Marfu’ with Tanwin Damm)'],
      ],
      checkQ: 'What grammatical case does a noun take immediately after an Arabic preposition (Harf Jarr) such as "fi" (in) or "ila" (to)?',
      checkO: ['Majrur (marked typically by Kasrah, -i)', 'Marfu’ (Dammah)', 'Mansub (Fathah)', 'Majzum (Sukun)'],
      checkH: [
        'Prepositions are called "Huruf al-Jarr" in Arabic.',
        'Recall "fil-bayti" or "ilal-madrasati" — hear the ending vowel.',
      ],
      checkE: 'A preposition puts the following noun into the genitive case (Majrur), marked by Kasrah (-i) on singular nouns.',
    },
    p2: {
      title: 'Jumlah Fi’liyyah (Verbal sentence) and Sarf (Morphology)',
      idea: 'A Verbal Sentence begins with a verb (Fi’l) — either Madi (past, e.g., kataba), Mudari’ (present/future, e.g., yaktubu) or Amr (command, e.g., uktub) — followed by the Doer/Subject (Fa’il, always Marfu’) and, for transitive verbs, the Direct Object (Maf’ul bihi, always Mansub), as in "Qara’a at-talibu ad-darsa" (The student read the lesson). Arabic morphology (Sarf) builds families of related words from three-letter roots (e.g., k-t-b → kataba, kitab, maktab, katib).',
      terms: [
        ['Three-letter root (Jidr)', 'Consonant core carrying shared meaning: k-t-b (writing) yields kitab (book), maktabah (library), katib (writer)'],
        ['Fa’il & Maf’ul bihi', 'Doer of the verb (Marfu’, -u) and receiver/object of the action (Mansub, -a)'],
        ['Idafah (Genitive construct)', 'Possessive pairing like "Kitabu at-talibi" (the student’s book) — first word drops "al-" and Tanwin; second is Majrur'],
      ],
      rules: [
        'In a standard verbal sentence (Verb–Subject–Object), the initial verb stays SINGULAR even when the explicit noun subject is dual or plural ("Dhahaba at-tullabu").',
        'Dual nouns end in -ani (Marfu’) or -ayni (Mansub/Majrur); sound masculine plurals end in -una or -ina.',
      ],
      headers: ['Verb tense', 'Example from root k-t-b (write)'],
      rows: [
        ['Al-Madi (Past)', 'Kataba (he wrote)'],
        ['Al-Mudari’ (Present)', 'Yaktubu (he writes / is writing)'],
        ['Al-Amr (Imperative)', 'Uktub! (Write!)'],
      ],
      exQ: 'Which three-letter root connects "madrasah" (school), "mudarris" (teacher) and "dars" (lesson)?',
      exSteps: [
        ['Strip prefixes and vowels', 'Remove ma-, mu- and feminine -ah'],
        ['Find shared consonants', 'd – r – s (meaning study/learn)'],
      ],
      checkQ: 'In the Arabic sentence "Kataba at-talibu ad-darsa" (The student wrote the lesson), what is the grammatical role of "ad-darsa"?',
      checkO: [
        'Maf’ul bihi (Direct Object, Mansub with Fathah)',
        'Fa’il (Subject, Marfu’)',
        'Mubtada’ (Nominal Subject)',
        'Harf Jarr (Preposition)',
      ],
      checkH: [
        'Ask: who wrote (student = Fa’il), and WHAT received the writing?',
        'Notice the final -a (Fathah) marking the accusative case.',
      ],
      checkE: '"Ad-darsa" receives the action of writing, making it the Direct Object (Maf’ul bihi) in the Mansub case.',
    },
    qs: [
      ['Which three categories encompass every word in the Arabic language?', 'Ism (noun), Fi’l (verb) and Harf (particle)', 'Prefix, suffix and comma', 'Verse, stanza and rhyme', 'Sun, moon and star', 'Classical Arabic grammar divides all words into Ism, Fi’l and Harf.'],
      ['In "Ash-shamsu mushriqatun" (The sun is shining), why is the "l" of "al-" silent in pronunciation?', 'Because "shin" is a Sun letter (Harf Shamsi) that assimilates the lam', 'Because the word is plural', 'Because it follows a preposition', 'Because it is a verb', 'Sun letters assimilate the "l" of "al-" and double the opening consonant.'],
      ['Which word is derived from the three-letter root "k-t-b" (writing)?', 'Maktabah (library)', 'Madrasah (school)', 'Masjid (mosque)', 'Mal’ab (playground)', 'Maktabah shares the consonants k-t-b with kataba (wrote) and kitab (book).'],
      ['What happens to the Mubtada’ (subject) when the particle "Inna" (Indeed) enters a nominal sentence?', 'It changes from Marfu’ (-u) to Mansub (-a)', 'It disappears completely', 'It becomes a past verb', 'It takes Sukun', '"Inna" puts its noun (Ism Inna) into Mansub while keeping Khabar Inna Marfu’.'],
      ['In an Idafah possessive phrase such as "Babu al-fasli" (the door of the classroom), what case does the second noun ("al-fasli") ALWAYS take?', 'Majrur (genitive)', 'Marfu’ (nominative)', 'Mansub (accusative)', 'Imperative', 'The Mudaf Ilayhi (second noun in Idafah) is always Majrur.'],
      ['Which Arabic verb form gives a direct command such as "Iqra’!" (Read!)?', 'Fi’l al-Amr (Imperative)', 'Fi’l al-Madi (Past)', 'Mubtada’', 'Harf al-Atf', 'Al-Amr is the command/imperative verb mood.'],
    ],
  },
  {
    id: 'arabic-literature-nigeria',
    name: 'Arabic literature, rhetoric and West African Arabic scholarship',
    sec: 'Arabic literature',
    goals: [
      'Outline the major periods of Arabic literature (Jahiliyyah, Islamic, Umayyad, Abbasid, Modern) and core rhetoric (Balaghah)',
      'Recognise the rich heritage of Nigerian Arabic scholars (Uthman dan Fodio, Abdullahi dan Fodio, Muhammad Bello, Adam al-Ilory)',
    ],
    trap: 'Arabic literature in Nigeria is NOT purely foreign — West African and Nigerian scholars composed hundreds of celebrated Arabic poems, histories and legal treatises across Borno, Kano, Sokoto and Ilorin!',
    p1: {
      title: 'Classical periods and Balaghah (Rhetoric)',
      idea: 'Arabic literary history spans Pre-Islamic (Al-Asr al-Jahili — famed for oral odes called Mu’allaqat by poets like Imru’ al-Qays and Antara), Early Islamic (shaped by the Qur’an’s eloquence and poets like Hassan ibn Thabit), Umayyad (political and love poetry), Abbasid (Golden Age prose by al-Jahiz and poetry by al-Mutanabbi) and Modern Arabic literature. Arabic rhetoric (Al-Balaghah) studies Tashbih (simile), Isti’arah (metaphor) and Kinayah (allusion).',
      terms: [
        ['Al-Mu’allaqat', 'The famous pre-Islamic long odes celebrated for masterful imagery and eloquence'],
        ['Tashbih', 'Arabic simile comparing two things using particles like "ka-" or "mithla"'],
        ['Isti’arah', 'Arabic metaphor borrowing a quality directly without a comparison particle'],
      ],
      rules: [
        'Hassan ibn Thabit was honoured as "Sha’ir al-Rasul" (the Prophet’s poet) in Early Islamic literature.',
        'Al-Mutanabbi is famed in Abbasid poetry for aphorisms on courage, ambition and wisdom.',
      ],
      headers: ['Literary era', 'Signature feature / figure'],
      rows: [
        ['Pre-Islamic (Jahiliyyah)', 'Qasidah odes (Mu’allaqat); Imru’ al-Qays, Antara'],
        ['Early Islamic', 'Qur’anic eloquence, Hadith style, Hassan ibn Thabit'],
        ['Abbasid Golden Age', 'Scientific & literary prose (al-Jahiz), al-Mutanabbi'],
      ],
      exQ: 'In Arabic Balaghah, what differentiates "Zaydun kal-asadi" (Zayd is like a lion) from "Ra’aytu asadan yaqra’u" (I saw a lion reading)?',
      exSteps: [
        ['First phrase uses "ka-"', 'Explicit comparison → Tashbih (simile)'],
        ['Second omits "ka-"', 'Direct borrowing of "lion" for a brave student → Isti’arah (metaphor)'],
      ],
      checkQ: 'Which renowned Companion earned the title "Sha’ir al-Rasul" (Poet of the Messenger) in Early Islamic Arabic literature?',
      checkO: ['Hassan ibn Thabit', 'Imru’ al-Qays', 'Al-Mutanabbi', 'Al-Jahiz'],
      checkH: [
        'He defended Islam eloquently through poetry in Madinah.',
        'Imru’ al-Qays was pre-Islamic and al-Mutanabbi was Abbasid.',
      ],
      checkE: 'Hassan ibn Thabit was celebrated as the Prophet’s poet in Early Islamic literature.',
    },
    p2: {
      title: 'Nigerian Arabic literature and scholars',
      idea: 'For centuries, Nigerian centres like Gazargamo (Borno), Katsina (Muhammad ibn Masani), Kano, Sokoto and Ilorin produced outstanding Arabic works. Shaykh Uthman dan Fodio, Abdullahi dan Fodio (Tazyin al-Waraqat), Sultan Muhammad Bello (Infaq al-Maysur) and Nana Asma’u wrote history, law and didactic verse. In the 20th century, Shaykh Adam Abdullah al-Ilory founded the Markaz Arabic Training Centre in Agege, Lagos, modernising Arabic education across Yorubaland and West Africa.',
      terms: [
        ['Tazyin al-Waraqat', 'Famous Arabic literary and historical chronicle with poetry authored by Abdullahi dan Fodio'],
        ['Infaq al-Maysur', 'Landmark Arabic history of the Western Sudan written by Sultan Muhammad Bello'],
        ['Shaykh Adam al-Ilory', '20th-century Nigerian scholar who founded Markaz Agege (Lagos) and authored major Arabic histories of Islam in Nigeria'],
      ],
      rules: [
        'West African Arabic manuscripts preserve vital primary sources for pre-colonial African history.',
        'Nigerian Arabic prose and poetry span theology, history, biography, ethics and social reform.',
      ],
      headers: ['Nigerian Arabic author', 'Major Arabic work / legacy'],
      rows: [
        ['Abdullahi dan Fodio', 'Tazyin al-Waraqat; Diya al-Ta’wil'],
        ['Muhammad Bello', 'Infaq al-Maysur (history of Sokoto & Borno)'],
        ['Shaykh Adam al-Ilory', 'Al-Islam fi Nayjiriya; founder of Markaz Agege'],
      ],
      exQ: 'Why are Nigerian Arabic manuscripts from Sokoto, Borno and Ilorin priceless to historians today?',
      exSteps: [
        ['Indigenous written record', 'Written directly by African eyewitnesses centuries before colonial arrival'],
        ['Broad themes', 'Preserve diplomacy, poetry, law, education and social life'],
      ],
      checkQ: 'Who authored the renowned Nigerian Arabic literary-historical work "Tazyin al-Waraqat"?',
      checkO: ['Abdullahi dan Fodio', 'Imru’ al-Qays', 'Al-Jahiz', 'Hassan ibn Thabit'],
      checkH: [
        'He was the younger brother of Shaykh Uthman dan Fodio and Emir of Gwandu.',
        'His work blends Arabic prose history with eloquent poems.',
      ],
      checkE: 'Abdullahi dan Fodio wrote "Tazyin al-Waraqat", a classic of Nigerian Arabic literature.',
    },
    qs: [
      ['In Arabic Balaghah, an explicit comparison using the particle "ka-" or "mithla" is called', 'Tashbih', 'Isti’arah', 'Idafah', 'Sukun', 'Tashbih is Arabic simile using an explicit comparison tool.'],
      ['Which celebrated Nigerian scholar founded the Markaz Arabic and Islamic Training Centre in Agege, Lagos?', 'Shaykh Adam Abdullah al-Ilory', 'Al-Mutanabbi', 'Antara ibn Shaddad', 'Al-Tabari', 'Shaykh Adam al-Ilory pioneered modern structured Arabic schooling in southwestern Nigeria.'],
      ['The seven celebrated pre-Islamic long Arabic odes are collectively known as', 'Al-Mu’allaqat', 'Al-Harakaat', 'Al-Idafah', 'Al-Maktabah', 'Al-Mu’allaqat represent the pinnacle of pre-Islamic Arabic poetic craft.'],
      ['Which Sultan of Sokoto wrote the Arabic historical masterpiece "Infaq al-Maysur"?', 'Muhammad Bello', 'Mai Humai', 'Sarki Yaji', 'Mansa Musa', 'Muhammad Bello documented the history of Hausaland, Borno and the Sokoto Caliphate in Arabic.'],
      ['In which classical era did prose master al-Jahiz and poet al-Mutanabbi flourish?', 'Abbasid era', 'Pre-Islamic era', 'Modern era', 'Colonial era', 'The Abbasid period was the Golden Age of classical Arabic prose, science and poetry.'],
      ['What is the traditional name for a classical Arabic long monorhyme ode?', 'Qasidah', 'Haiku', 'Sonnet', 'Limerick', 'A Qasidah is a classical Arabic ode maintaining a single metre and end-rhyme throughout.'],
    ],
  },
];

const HAUSA_SPECS: CompactTopicInput[] = [
  {
    id: 'hausa-phonology-grammar',
    name: 'Hausa orthography, phonology and grammar (Nahawu)',
    sec: 'Hausa language',
    goals: [
      'Identify standard Hausa vowels (wasali), special hooked consonants (ɓ, ɗ, ƙ, ’y) and tone/vowel length contrasts',
      'Apply grammatical gender (jinsi), plurals (jam’i) and tense-aspect markers in Hausa sentences',
    ],
    trap: 'In Hausa, vowel LENGTH and TONE change word meaning completely — e.g., "fito" (whistle / coming out) and "fari" (white / beginning / drought) must be read carefully in context!',
    p1: {
      title: 'Baku, wasali and special Hausa sounds',
      idea: 'Standard Hausa orthography (Boko) uses five basic vowels (a, e, i, o, u — each occurring short or long) plus two diphthongs (ai, au), alongside distinct glottalised/hooked consonants — ɓ (implosive b, as in ɓera "rat"), ɗ (implosive d, as in ɗaki "room"), ƙ (ejective k, as in ƙasa "land/earth") and ’y (as in ’ya’ya "children") — plus digraphs sh, ts, fy, ky, gy, kw, gw.',
      terms: [
        ['Wasali (Vowels)', 'Five vowels (a, e, i, o, u) that contrast in length (short vs long) plus diphthongs ai, au'],
        ['Baƙaƙe masu lanƙwasa', 'Hooked letters ɓ, ɗ, ƙ (and ’y) — distinct phonemes from plain b, d, k'],
        ['Karin sauti (Tone)', 'Hausa has High, Low and Falling tones that distinguish otherwise identical spellings'],
      ],
      rules: [
        'Changing plain "k" to hooked "ƙ" changes meaning entirely: "kasa" (fail/divide) vs "ƙasa" (earth/country).',
        'Similarly, "baƙi" (black / guests) differs from "baki" (mouth).',
      ],
      headers: ['Minimal pair', 'Meaning contrast'],
      rows: [
        ['baki vs baƙi', 'mouth vs black / guests'],
        ['dawa vs ɗawa', 'guinea corn / forest vs (distinct ɗ articulation)'],
        ['bara vs ɓara', 'last year / begging vs cracking nuts'],
      ],
      exQ: 'Explain why writing "kasa" instead of "ƙasa" changes the meaning of a Hausa sentence.',
      exSteps: [
        ['Plain "k"', '"kasa" can mean to divide or fail'],
        ['Hooked "ƙ"', '"ƙasa" means earth, floor or country (e.g., ƙasar Nijeriya)'],
      ],
      checkQ: 'Which set contains the three hooked letters (baƙaƙe masu lanƙwasa) unique to standard Hausa orthography?',
      checkO: ['ɓ, ɗ, ƙ', 'c, q, x', 'p, v, z', 'm, n, r'],
      checkH: [
        'They are modified versions of b, d and k.',
        'You see them in words like ɓera, ɗaki and ƙasa.',
      ],
      checkE: 'Standard Hausa uses the hooked consonants ɓ, ɗ and ƙ (plus ’y) to represent glottalised sounds.',
    },
    p2: {
      title: 'Gender (Jinsi), plurals (Jam’i) and sentence structure',
      idea: 'Hausa nouns have two grammatical genders: Masculine (namiji — mostly ending in consonants or -i/-o/-u/-e, taking linker -n: "gidan malami") and Feminine (mace — mostly ending in -a, taking linker -r/-t: "motar malami"). Hausa verbs do not conjugate by themselves; instead, a pre-verbal Person-Aspect Marker (PAC) carries person, gender and tense: "Ya tafi" (he went), "Ta tafi" (she went), "Yana tafiya" (he is going), "Zai tafi" (he will go).',
      terms: [
        ['Jinsi (Gender)', 'Masculine ("yaro" — boy) vs Feminine ("yarinya" — girl); governs pronouns, adjectives and genitive linkers (-n / -r)'],
        ['Jam’i (Plural)', 'Formed by internal/suffix patterns: yaro → yara; malami → malamai; gida → gidaje; kogi → koguna'],
        ['Lokaci (Tense/Aspect)', 'Completive (ya ci), Continuative (yana ci), Future (zai ci), Habitual (yakan ci)'],
      ],
      rules: [
        'Watch gender exceptions: "ruwa" (water), "wata" (moon/month) and "baba" (father) end in -a yet are MASCULINE; "mace" (woman) ends in -e yet is FEMININE!',
        'Standard Hausa word order is SVO: Subject + Aspect Marker + Verb + Object ("Musa yana karanta littafi").',
      ],
      headers: ['Aspect', '3rd-person masc. example ("tafi" = go)'],
      rows: [
        ['Completive (Shudadden lokaci)', 'Ya tafi (He went)'],
        ['Continuative (Mai ci)', 'Yana tafiya (He is going)'],
        ['Future (Mai zuwa)', 'Zai tafi (He will go)'],
        ['Habitual (Na al’ada)', 'Yakan tafi (He usually goes)'],
      ],
      exQ: 'Choose the right genitive linker (-n or -r) for "littafi" (book, masc.) and "mota" (car, fem.) belonging to Bello.',
      exSteps: [
        ['Masculine noun "littafi"', 'Takes -n → littafin Bello'],
        ['Feminine noun "mota"', 'Takes -r → motar Bello'],
      ],
      checkQ: 'Which Hausa sentence correctly expresses the FUTURE tense ("Amina will read a book")?',
      checkO: [
        'Amina za ta karanta littafi.',
        'Amina ta karanta littafi.',
        'Amina tana karanta littafi.',
        'Amina zai karanta littafi.',
      ],
      checkH: [
        'Future tense uses "za" + feminine pronoun "ta" (not masculine "ya/zai").',
        '"ta karanta" is past; "tana karanta" is present continuous.',
      ],
      checkE: '"Za ta" marks feminine singular future tense: "Amina za ta karanta littafi."',
    },
    qs: [
      ['What is the standard plural (jam’i) of the Hausa noun "malami" (teacher)?', 'malamai', 'malamoci', 'malamuna', 'malamomi', '"Malami" forms its plural as "malamai".'],
      ['Which Hausa noun ends in "-a" yet is grammatically MASCULINE?', 'ruwa (water)', 'mota (car)', 'makaranta (school)', 'yarinya (girl)', '"Ruwa" takes masculine agreement ("ruwan sanyi", not "ruwar").'],
      ['In "Bala yana rubutu" (Bala is writing), which aspect is expressed by "yana"?', 'Continuative / progressive (lokaci mai ci)', 'Future tense', 'Negative past', 'Imperative', '"Yana" expresses ongoing/progressive action.'],
      ['Which phrase uses the correct feminine genitive linker for "school of Kano"?', 'makarantar Kano', 'makarantan Kano', 'makaranta Kano', 'makarantun Kano', 'Singular feminine "makaranta" attaches the linker "-r" ("makarantar").'],
      ['Which pair shows a real meaning difference caused by plain "b" vs hooked "ɓ"?', 'baki (mouth) vs baƙi (black/guests) — or bara (begging) vs ɓara (cracking)', 'gida vs gida', 'rana vs rana', 'yaro vs yaro', 'Hooked consonants (ɓ, ɗ, ƙ) are separate phonemes in Hausa.'],
      ['What is the Hausa plural of "gida" (house)?', 'gidaje', 'gidai', 'giduna', 'gidoci', '"Gida" takes the plural form "gidaje".'],
    ],
  },
  {
    id: 'hausa-literature-culture',
    name: 'Hausa oral literature, proverbs (Karin Magana) and culture',
    sec: 'Hausa literature and culture',
    goals: [
      'Interpret Hausa proverbs (Karin Magana), idioms (Habaici/Zambo), folktales (Tatsuniya) and praise singing (Waka)',
      'Explain key Hausa cultural institutions, crafts and modern Hausa written literature',
    ],
    trap: 'Do not translate Hausa proverbs (Karin Magana) word-for-word literally — exams test the DEEP MORAL WISDOM behind the metaphor (e.g., "Sannu ba ta hana zuwa" teaches that steady patience still reaches the goal).',
    p1: {
      title: 'Karin Magana (Proverbs), Tatsuniya and Waka',
      idea: 'Hausa oral literature (Adabin Baka) preserves wit, morals and history through Tatsuniya (evening folktales featuring Gizo the clever spider), Karin Magana (concise proverbs), Kacici-kacici (riddles sharpening children’s minds) and Waka (oral poetry/praise song by famous griots like Mamman Shata and Dan Maraya Jos).',
      terms: [
        ['Karin Magana', 'Traditional Hausa proverbs conveying wisdom through vivid everyday imagery'],
        ['Tatsuniya', 'Evening folktales told by elders, famously starring Gizo (the trickster spider) and Koki'],
        ['Kacici-kacici', 'Traditional Hausa riddles used to test quick thinking before storytelling'],
      ],
      rules: [
        'Proverb wisdom: "Hannu daya ba ya daukar jinka" = One hand cannot lift a roof (teamwork and unity are vital).',
        '"Komai nisan jifa, ƙasa zai faɗo" = However high a throw goes, it returns to earth (pride falls; truth catches up).',
      ],
      headers: ['Hausa proverb (Karin Magana)', 'Core moral lesson'],
      rows: [
        ['Hannu ɗaya ba ya ɗaukar jinka', 'Unity and cooperation accomplish what one person cannot'],
        ['Sannu ba ta hana zuwa', 'Slow, steady perseverance still reaches the destination'],
        ['Da rarrafe yaro kan tashi', 'Every big mastery begins with small humble steps'],
      ],
      exQ: 'What practical lesson does the proverb "Da rarrafe yaro kan tashi" teach a student preparing for JAMB?',
      exSteps: [
        ['Literal picture', 'A child learns to stand up only after crawling first'],
        ['Moral meaning', 'Steady daily practice builds mastery step by step'],
      ],
      checkQ: 'What is the central message of the Hausa proverb "Hannu ɗaya ba ya ɗaukar jinka" (One hand cannot lift a thatched roof)?',
      checkO: [
        'Cooperation and teamwork are essential for big tasks',
        'Roofs should never be built',
        'Working alone is always superior',
        'Only rich people need friends',
      ],
      checkH: [
        'Think about why lifting a heavy roof onto a round hut requires neighbours working together.',
        'It celebrates unity over isolation.',
      ],
      checkE: 'The proverb teaches that unity and collective effort achieve what a single person cannot do alone.',
    },
    p2: {
      title: 'Written Hausa literature and traditional culture',
      idea: 'Written Hausa literature flourished first in Ajami script (poetry of Uthman dan Fodio and Nana Asma’u) and then in modern Boko script after the 1933 Northern Literature Bureau competition, which birthed classics by Abubakar Imam (Ruwan Bagaja, Magana Jari Ce) and Abubakar Tafawa Balewa (Shaihu Umar). Traditional Hausa culture honours hospitality (karamci), respect for elders (ladabi), crafts (dyeing pits of Kofar Mata in Kano, leatherwork, weaving) and Sallah Durbar celebrations (Hawan Sallah).',
      terms: [
        ['Abubakar Imam', 'Pioneering Hausa novelist and editor (Gaskiya Ta Fi Kwabo), author of "Magana Jari Ce" and "Ruwan Bagaja"'],
        ['Kofar Mata dye pits', 'Historic indigo dyeing pits in Kano symbolising centuries of Hausa textile craft'],
        ['Hawan Sallah (Durbar)', 'Colourful royal equestrian procession celebrating Eid al-Fitr and Eid al-Adha in northern emirates'],
      ],
      rules: [
        'In Hausa etiquette, greetings (gaisuwa) vary by time and occasion: "Ina kwana?" (morning), "Ina wuni?" (afternoon/day), "Barka da Sallah" (festivals).',
        'Hausa traditional trades (sana’o’in gargajiya) include rini (dyeing), jima (leather tanning), kira (blacksmithing) and saƙa (weaving).',
      ],
      headers: ['Traditional craft (Sana’a)', 'Meaning'],
      rows: [
        ['Rini', 'Cloth dyeing (e.g., Kano indigo pits)'],
        ['Jima', 'Leather tanning and craft'],
        ['Kira', 'Blacksmithing (hoes, tools)'],
        ['Saƙa', 'Traditional cloth weaving'],
      ],
      exQ: 'Match the two famous Hausa literary pioneers to their landmark 1930s books: Abubakar Imam and Abubakar Tafawa Balewa.',
      exSteps: [
        ['Abubakar Imam', 'Ruwan Bagaja and Magana Jari Ce'],
        ['Abubakar Tafawa Balewa', 'Shaihu Umar'],
      ],
      checkQ: 'Who is the iconic trickster character featured most frequently in traditional Hausa folktales (Tatsuniya)?',
      checkO: ['Gizo (the spider)', 'Sarki', 'Zaki (the lion)', 'Biri (the monkey)'],
      checkH: [
        'He plays a role similar to Tortoise (Ijapa/Mbe) in Yoruba and Igbo tales.',
        'His wife in the tales is Koki.',
      ],
      checkE: 'Gizo the spider is the famous trickster figure of Hausa Tatsuniya folktales.',
    },
    qs: [
      ['What is the traditional Hausa term for riddles exchanged before evening storytelling?', 'Kacici-kacici', 'Karin Magana', 'Hawan Sallah', 'Jima', 'Kacici-kacici are Hausa riddles that sharpen wit and observation.'],
      ['Who authored the celebrated Hausa prose classic "Magana Jari Ce"?', 'Abubakar Imam', 'Wole Soyinka', 'Chinua Achebe', 'D.O. Fagunwa', 'Dr. Abubakar Imam wrote "Ruwan Bagaja" and the three-volume "Magana Jari Ce".'],
      ['Which Hausa craft term refers to traditional indigo cloth dyeing?', 'Rini', 'Kira', 'Jima', 'Noma', 'Rini is traditional dyeing, famously practised at Kano’s Kofar Mata dye pits.'],
      ['What does the proverb "Sannu ba ta hana zuwa" encourage?', 'Patient, steady effort without giving up', 'Rushing carelessly', 'Refusing to travel', 'Ignoring advice', 'Literally "slowly does not stop arrival" — steady persistence succeeds.'],
      ['What is the standard respectful Hausa morning greeting asking "How did you sleep?"', 'Ina kwana?', 'Sai anjima', 'Barka da dare', 'Ina kasuwa?', '"Ina kwana?" is the standard Hausa morning greeting, answered "Lafiya lau".'],
      ['The royal horseback parade staged across northern emirates during Eid festivals is called', 'Hawan Sallah (Durbar)', 'Tatsuniya', 'Kacici-kacici', 'Saƙa', 'Hawan Sallah / Durbar showcases emirate horsemanship and cultural heritage.'],
    ],
  },
];

const IGBO_SPECS: CompactTopicInput[] = [
  {
    id: 'igbo-abidii-vowel-harmony',
    name: 'Igbo orthography (Abidii), vowel harmony and tones',
    sec: 'Igbo language',
    goals: [
      'Master the 36 letters of the Standard Igbo alphabet (Abidii — Onwu Orthography), 8 vowels and 28 consonants',
      'Apply Vowel Harmony (Ndakorita Udaume) and Tone Marks (Akara Udaolu) accurately',
    ],
    trap: 'Never mix heavy (open/dotted) vowels {a, ị, ọ, ụ} with light (close/undotted) vowels {e, i, o, u} inside the same simple Igbo root word or verb affix — Vowel Harmony chooses the exact matching prefix ("o riri" vs "ọ tara")!',
    p1: {
      title: 'Abidii (36 letters) and Ndakorita Udaume (Vowel Harmony)',
      idea: 'Standard Igbo (Onwu Orthography, 1961) has 36 letters: 8 vowels (Udaume: a, e, i, ị, o, ọ, u, ụ) and 28 consonants (Mgbochiume), including 9 digraphs (ch, gb, gh, gw, kp, kw, nw, ny, sh). The 8 vowels split neatly into two harmonic teams: Group A (Undotted / +ATR: e, i, o, u) and Group E/O (Dotted / −ATR: a, ị, ọ, ụ). Simple roots and verb prefixes match their vowel team!',
      terms: [
        ['Udaume (8 Vowels)', 'Split into Undotted {e, i, o, u} and Dotted {a, ị, ọ, ụ}'],
        ['Ndakorita Udaume', 'Vowel harmony rule requiring prefixes/suffixes to share the same vowel group as the verb root'],
        ['Mgbochiume mkpi (Digraphs)', 'Nine double-letter consonants treated as single Igbo letters: ch, gb, gh, gw, kp, kw, nw, ny, sh'],
      ],
      rules: [
        'If a verb root has a dotted vowel (e.g., "ta" chew, "zụ" buy, "chọ" look for), its prefix uses dotted "a-" or "ọ-": "Ọ zụrụ akwụkwọ."',
        'If a verb root has an undotted vowel (e.g., "ri" eat, "je" go, "gbu" cut), its prefix uses undotted "e-" or "o-": "O riri nri."',
      ],
      headers: ['Vowel group', 'Members & example verb phrase'],
      rows: [
        ['Group 1 (Undotted / Light)', 'e, i, o, u → O jere ahịa (He/she went...); e-ri'],
        ['Group 2 (Dotted / Heavy)', 'a, ị, ọ, ụ → Ọ zụrụ akwụkwọ (He/she bought a book); a-zụ'],
      ],
      exQ: 'Choose the harmonious 3rd-person singular pronoun ("O" or "Ọ") for the verbs "ri" (eat) and "ta" (chew).',
      exSteps: [
        ['Verb "ri" has undotted "i"', 'Matches undotted "O" → O riri nri'],
        ['Verb "ta" has dotted-group "a"', 'Matches dotted "Ọ" → Ọ tara anụ'],
      ],
      checkQ: 'Following Igbo Vowel Harmony (Ndakorita Udaume), which sentence uses the correct pronoun prefix?',
      checkO: [
        'Ọ zụrụ akwụkwọ. (He/she bought a book)',
        'O zụrụ akwụkwọ.',
        'Ọ riri nri.',
        'O tara anụ.',
      ],
      checkH: [
        'Check the vowel inside the verb root "zụ" — it has a subdot (ụ), placing it in the {a, ị, ọ, ụ} group.',
        'Match dotted "ụ" with dotted pronoun "Ọ".',
      ],
      checkE: '"zụ" belongs to the dotted vowel group {a, ị, ọ, ụ}, so it harmonises with "Ọ" ("Ọ zụrụ akwụkwọ").',
    },
    p2: {
      title: 'Tone marks (Akara Udaolu) and Igbo grammar',
      idea: 'Igbo is a tonal language with three pitch levels: High tone (Uda elu, acute ´), Low tone (Uda ala, grave `) and Downstep (Uda nsuda, macron ¯). Tone distinguishes completely different words spelled identically — famously "akwa" means cry (ákwá, H-H), cloth (ákwà, H-L), egg (àkwá, L-H) or bed/bridge (àkwà, L-L)!',
      terms: [
        ['Akara Udaolu', 'Tone marks distinguishing lexical and grammatical meaning across identical spellings'],
        ['Ahiriokwu (Sentence)', 'Follows SVO order: Isiokwu (Subject) + Ngwaa (Verb) + Nnara (Object)'],
        ['Mbuuzo & Njiko', 'Prepositions ("na" — in/at/on) and conjunctions ("na" — and, "mana" — but)'],
      ],
      rules: [
        'Learn the classic 4-way "akwa" set: ákwá (cry), ákwà (cloth), àkwá (egg), àkwà (bed/bridge).',
        'Igbo past tense typically adds the harmonic -rV suffix copying the root vowel: ri → riri; zụ → zụrụ; de → dere.',
      ],
      headers: ['Tone pattern on "akwa"', 'English meaning'],
      rows: [
        ['ákwá (High–High)', 'Cry / weeping'],
        ['ákwà (High–Low)', 'Cloth / wrapper'],
        ['àkwá (Low–High)', 'Egg'],
        ['àkwà (Low–Low)', 'Bed or bridge'],
      ],
      exQ: 'Form the past tense (-rV suffix) of the Igbo verbs "de" (write) and "ba" (enter).',
      exSteps: [
        ['Copy vowel "e" after -r-', 'de → dere ("O dere akwụkwọ")'],
        ['Copy vowel "a" after -r-', 'ba → bara ("Ọ bara ụlọ")'],
      ],
      checkQ: 'In Standard Igbo, which tone pattern on the word "akwa" means "egg"?',
      checkO: ['Low–High (àkwá)', 'High–High (ákwá)', 'High–Low (ákwà)', 'Low–Low (àkwà)'],
      checkH: [
        'H–H = cry; H–L = cloth; L–L = bed/bridge.',
        'The remaining pattern rises from Low to High.',
      ],
      checkE: 'àkwá (Low–High tone) means "egg" in Igbo.',
    },
    qs: [
      ['How many letters make up the complete Standard Igbo alphabet (Abidii / Onwu Orthography)?', '36 (8 vowels and 28 consonants)', '26', '24', '40', 'Onwu Orthography standardises 8 vowels and 28 consonants = 36 letters.'],
      ['Which vowel set forms the dotted (−ATR) harmony group in Igbo?', 'a, ị, ọ, ụ', 'e, i, o, u', 'a, e, i, o', 'i, o, u, ụ', 'Igbo vowel harmony pairs {a, ị, ọ, ụ} together and {e, i, o, u} together.'],
      ['Which of the following is one of the nine consonant digraphs (mgbochiume mkpi) in Igbo?', 'gb', 'st', 'tr', 'pl', 'The nine Igbo digraphs are ch, gb, gh, gw, kp, kw, nw, ny, sh.'],
      ['What is the past tense (-rV) form of the Igbo verb "je" (go)?', 'jere', 'jara', 'juru', 'jọrọ', 'The -rV past suffix copies the root vowel "e": je → jere.'],
      ['What does "ákwà" (High–Low tone) mean in Igbo?', 'Cloth / wrapper', 'Egg', 'Cry', 'Bed', 'ákwà (H–L) means cloth.'],
      ['How many vowels exist in Standard Igbo?', '8', '5', '7', '10', 'Igbo has 8 vowels: a, e, i, ị, o, ọ, u, ụ.'],
    ],
  },
  {
    id: 'igbo-literature-proverbs-culture',
    name: 'Igbo proverbs (Ilu), oral literature and Omenala (Culture)',
    sec: 'Igbo literature and culture',
    goals: [
      'Interpret Igbo proverbs (Ilu), idioms (Akpaalaokwu), folktales (Akuko Ifo) and traditional poetry',
      'Explain key Igbo cultural institutions: Kola nut (Oji), New Yam Festival (Iri Ji), Age grades (Ogbo) and Omenala',
    ],
    trap: 'Do not confuse ILU (proverb — a complete wise saying expressing cultural truth) with AKPAALAOKWU (idiom — a figurative phrase whose meaning cannot be guessed literally from each word, like "iri ego" = taking a bribe).',
    p1: {
      title: 'Ilu (Proverbs), Akpaalaokwu and Akuko Ifo',
      idea: 'In Igbo culture, "Ilu bụ mmanụ e ji eri okwu" (Proverbs are the palm oil with which words are eaten). Oral literature (Agụmagụ Ọnụ) spans Ilu (proverbs), Akpaalaokwu (idioms), Agwụgwa (riddles), Akụkọ Ifo (folktales featuring Mbe the tortoise) and Abu Ọdịnala (traditional songs/chants). Modern written Igbo prose began with Pita Nwana’s landmark 1933 novel "Omenụkọ".',
      terms: [
        ['Ilu', 'Traditional Igbo proverbs packaging deep moral philosophy into crisp metaphors'],
        ['Akpaalaokwu', 'Figurative Igbo idioms (e.g., "ịgba ọsọ ndụ" = fleeing for one’s life; "aka nri" = trusted helper)'],
        ['Mbe (Tortoise)', 'Famous clever trickster hero/anti-hero of Igbo Akụkọ Ifo folktales'],
      ],
      rules: [
        '"Otu mkpịsị aka rụta mmanụ, o zuo ọha ọnụ" = If one finger brings oil, it soils the others (one person’s misconduct affects the whole family/community).',
        '"Egbe bere ugo bere" = Let the kite perch and let the eagle perch (live and let live; peaceful coexistence).',
      ],
      headers: ['Igbo proverb (Ilu)', 'Core meaning'],
      rows: [
        ['Egbe bere, ugo bere', 'Peaceful coexistence and fairness for everyone'],
        ['Otu osisi anaghị eme ọhịa', 'One tree does not make a forest (unity/teamwork)'],
        ['Nwata kwochaa aka, o soro ogaranya rie nri', 'Hard work and character earn a young person respect among elders'],
      ],
      exQ: 'Explain the social ethic captured in the proverb "Egbe bere, ugo bere".',
      exSteps: [
        ['Two birds sharing the branch', 'Both kite and eagle have a right to live peacefully'],
        ['Moral message', 'Tolerance, justice and peaceful coexistence in society'],
      ],
      checkQ: 'Which classic 1933 novel by Pita Nwana is celebrated as the very first published novel written in the Igbo language?',
      checkO: ['Omenụkọ', 'Things Fall Apart', 'Magana Jari Ce', 'Ogboju Ode'],
      checkH: [
        'It tells the moral story of a wealthy trader who seeks redemption after a grave mistake.',
        'Its title is the main character’s name.',
      ],
      checkE: 'Pita Nwana’s "Omenụkọ" (1933) is the pioneering novel of written Igbo literature.',
    },
    p2: {
      title: 'Omenala: Oji (Kola nut), Iri Ji and community life',
      idea: 'Igbo culture (Omenala) centres on hospitality, family honour, hard work and community harmony. Breaking the Kola nut (Ịwa Ọjị) welcomes visitors with prayers for life and peace ("Onye wetara ọjị wetara ndụ" — who brings kola brings life). The New Yam Festival (Iri Ji Ọhụrụ) gives thanks for the harvest, while the four-day Igbo market week (Eke, Orie, Afọ, Nkwọ) structures trade and social life.',
      terms: [
        ['Ịwa Ọjị', 'Ceremonial presentation, blessing and breaking of the kola nut as the highest symbol of Igbo hospitality'],
        ['Iri Ji Ọhụrụ', 'Annual New Yam Festival thanking God and celebrating the harvest of yam, king of Igbo crops'],
        ['Izụ Igbo (4-day week)', 'The four traditional Igbo market days in order: Eke, Orie, Afọ, Nkwọ'],
      ],
      rules: [
        'Remember the exact sequence of Igbo market days: Eke → Orie → Afọ → Nkwọ.',
        'Umuada (daughters of the lineage) and Otu Ọgbọ (age grades) play vital roles in peacekeeping, funerals and community development.',
      ],
      headers: ['Cultural institution', 'Social role'],
      rows: [
        ['Ọjị (Kola nut)', 'Hospitality, peace, covenant and prayers for life'],
        ['Umuada', 'Lineage daughters acting as moral guardians and peacemakers'],
        ['Otu Ọgbọ (Age grade)', 'Civic self-help projects, security and discipline'],
      ],
      exQ: 'Why do Igbo elders say "Ọjị anaghị anụ bekee" (Kola nut does not hear English) during traditional welcoming ceremonies?',
      exSteps: [
        ['Cultural pride', 'Blessing the kola nut in Igbo preserves ancestral language and dignity'],
        ['Spiritual meaning', 'Connects guests directly to community heritage and goodwill'],
      ],
      checkQ: 'What is the exact chronological order of the four traditional Igbo market days (Izụ Igbo)?',
      checkO: ['Eke, Orie, Afọ, Nkwọ', 'Afọ, Eke, Nkwọ, Orie', 'Nkwọ, Orie, Eke, Afọ', 'Orie, Afọ, Eke, Nkwọ'],
      checkH: [
        'It begins with Eke and ends with Nkwọ.',
        'Recall the four-day rhythm E – O – A – N.',
      ],
      checkE: 'The four Igbo market days follow the strict order: Eke, Orie, Afọ, Nkwọ.',
    },
    qs: [
      ['What is the Igbo proverb "Otu osisi anaghị eme ọhịa" (One tree does not make a forest) teaching?', 'Teamwork and community cooperation are vital', 'Trees should be cut down', 'Solitude guarantees wealth', 'Farming needs no rain', 'No single person can replace the strength of a united community.'],
      ['Who is the celebrated clever animal trickster in Igbo folktales (Akụkọ Ifo)?', 'Mbe (Tortoise)', 'Gizo (Spider)', 'Agu (Leopard)', 'Enyi (Elephant)', 'Mbe the tortoise is the central trickster character of Igbo folktales.'],
      ['Which festival celebrates thanksgiving for the annual yam harvest across Igboland?', 'Iri Ji Ọhụrụ (New Yam Festival)', 'Argungu Festival', 'Eyo Festival', 'Durbar', 'Iri Ji Ọhụrụ honours the harvest of yam, the chief traditional crop.'],
      ['Which traditional item is presented first to welcome guests with prayers for life and peace in Igbo culture?', 'Ọjị (Kola nut)', 'Salt alone', 'Iron bell', 'Chalkboard', '"Onye wetara ọjị wetara ndụ" — presenting kola nut symbolises warmth and goodwill.'],
      ['In Igbo language studies, figurative phrases like "ịta ahụhụ" (to suffer) are classified as', 'Akpaalaokwu (idioms)', 'Abidii', 'Udaume', 'Ọgbọ', 'Akpaalaokwu are idiomatic expressions carrying non-literal meanings.'],
      ['Which Igbo community group consists of daughters born into a lineage who serve as respected mediators and peacemakers?', 'Umuada', 'Eze mmuo', 'Onwu', 'Oja', 'Umuada wield strong moral authority in settling family disputes and upholding Omenala.'],
    ],
  },
];

const YORUBA_SPECS: CompactTopicInput[] = [
  {
    id: 'yoruba-alphabet-tones-grammar',
    name: 'Yoruba orthography (Abd), tone marks (Ami Ohun) and grammar',
    sec: 'Yoruba language',
    goals: [
      'Master the 25 letters of the Yoruba alphabet (7 oral vowels, 5 nasal vowels, 18 consonants) and the three tone marks',
      'Apply Yoruba parts of speech (Ọ̀rọ̀-orúkọ, Ọ̀rọ̀-ìṣe, Ọ̀rọ̀-arọ́pò) and sentence structure accurately',
    ],
    trap: 'Never leave tone marks (Àmì Ohùn) out when words share spelling: "ọkọ" means husband (ọkọ, M-M), hoe (ọkọ́, M-H), vehicle/ship (ọkọ̀, M-L) or spear (ọ̀kọ̀, L-L)!',
    p1: {
      title: 'Fáwẹ́lì (Vowels), Kọ́ńsónáǹtì and Àmì Ohùn (Tones)',
      idea: 'Standard Yoruba has 25 letters (omitting c, q, v, x, z and adding ẹ, gb, ọ, ṣ): 7 oral vowels (Fáwẹ́lì àìránmúpè: a, e, ẹ, i, o, ọ, u), 5 nasal vowels (Fáwẹ́lì àránmúpè: an, ẹn, in, ọn, un) and 18 consonants (including the double-letter labial-velar "gb"). Three tones sit on vowels and syllabic nasals: Do (Ohùn ìsàlẹ̀, grave `), Re (Ohùn àárín, unmarked) and Mi (Ohùn òkè, acute ´).',
      terms: [
        ['Àmì Ohùn (Tone marks)', 'Do (` Low), Re (unmarked Mid) and Mi (´ High) — essential for reading exact meaning'],
        ['Fáwẹ́lì àránmúpè', 'Five nasal vowels written with trailing "n": an, ẹn, in, ọn, un (as in "ìyàn", "ọkàn")'],
        ['Gb', 'Single Yoruba consonant pronounced by closing lips and back of tongue simultaneously (e.g., "ìgbà")'],
      ],
      rules: [
        'Classic minimal set "igba": igba (200, M-M), igbá (calabash, M-H), ìgbà (time/season, L-L), ìgbá (locust bean tree, L-H), igbà (climbing rope, M-L).',
        'Yoruba syllables NEVER end in a consonant — every syllable is open (V, CV or syllabic nasal N).',
      ],
      headers: ['Tone on "ọkọ"', 'Meaning in English'],
      rows: [
        ['ọkọ (Mid–Mid)', 'Husband'],
        ['ọkọ́ (Mid–High)', 'Hoe (farming tool)'],
        ['ọkọ̀ (Mid–Low)', 'Vehicle / car / ship'],
        ['ọ̀kọ̀ (Low–Low)', 'Spear'],
      ],
      exQ: 'Identify the tone pattern (Do, Re, Mi) of the Yoruba word "ọmọdé" (child).',
      exSteps: [
        ['First syllable "ọ"', 'Unmarked → Mid (Re)'],
        ['Second syllable "mọ"', 'Unmarked → Mid (Re)'],
        ['Third syllable "dé"', 'Acute accent ´ → High (Mi) → Re–Re–Mi'],
      ],
      checkQ: 'How many oral vowels (fáwẹ́lì àìránmúpè) and nasal vowels (fáwẹ́lì àránmúpè) exist in Standard Yoruba?',
      checkO: ['7 oral vowels and 5 nasal vowels', '5 oral vowels and 3 nasal vowels', '8 oral vowels and 2 nasal vowels', '6 oral vowels and 6 nasal vowels'],
      checkH: [
        'Oral vowels add dotted ẹ and ọ to a, e, i, o, u (5 + 2 = 7).',
        'Note that "e" and "o" do NOT have nasal counterparts — only a, ẹ, i, ọ, u do.',
      ],
      checkE: 'Standard Yoruba has 7 oral vowels (a, e, ẹ, i, o, ọ, u) and 5 nasal vowels (an, ẹn, in, ọn, un).',
    },
    p2: {
      title: 'Gírámà (Grammar): parts of speech and tense markers',
      idea: 'Yoruba grammar builds sentences cleanly in SVO order using invariable verbs combined with pre-verbal tense/aspect particles: "ń" (ongoing/progressive: "Bọ́lá ń kàwé"), "ti" (perfect/completed: "Ó ti jẹun"), "yóò / á" (future: "Wọ́n á lọ") and "kò / ò" (negation: "Kò lọ"). Honorific plural pronouns ("Ẹ", "Wọ́n") are used respectfully when addressing or referring to elders.',
      terms: [
        ['Ọ̀rọ̀-orúkọ & Ọ̀rọ̀-ìṣe', 'Noun (Ọ̀rọ̀-orúkọ) and Verb (Ọ̀rọ̀-ìṣe)'],
        ['Ẹ / Wọ́n (Honorific)', 'Plural pronouns used for a single elder to express Yoruba respect (ọmọlúàbí)'],
        ['Ìpàrójẹ (Elision)', 'Blending two adjacent vowels across word boundaries in speech: "ra + epo" → "repo" (buy oil)'],
      ],
      rules: [
        'Pre-verbal markers: ń = ongoing; ti = already/completed; yóò/máa = future/habitual.',
        'Never greet an elder with informal singular "O"; always use respectful "Ẹ" ("Ẹ káàárọ̀", "Ẹ ṣé").',
      ],
      headers: ['Aspect particle', 'Example sentence'],
      rows: [
        ['ń (Progressive)', 'Adé ń kọ ìwé (Ade is writing a book)'],
        ['ti (Perfect)', 'Adé ti kọ ìwé (Ade has written a book)'],
        ['yóò / á (Future)', 'Adé yóò kọ ìwé (Ade will write a book)'],
        ['kò (Negation)', 'Adé kò lọ sí ilé-ìwé (Ade did not go to school)'],
      ],
      exQ: 'Turn "Tọ́pẹ́ jẹun" (Tope ate) into the present progressive ("Tope is eating") and negative ("Tope did not eat").',
      exSteps: [
        ['Progressive', 'Insert "ń" before verb → Tọ́pẹ́ ń jẹun'],
        ['Negative', 'Insert "kò" before verb → Tọ́pẹ́ kò jẹun'],
      ],
      checkQ: 'Which Yoruba pre-verbal particle expresses an ongoing/progressive action (equivalent to "-ing" in English)?',
      checkO: ['ń', 'ti', 'yóò', 'kò'],
      checkH: [
        'Compare "Ó ń sùn" (He/she is sleeping) with "Ó ti sùn" (He/she has slept).',
        'It is a single high-toned nasal letter.',
      ],
      checkE: 'The particle "ń" marks ongoing progressive or habitual action in Yoruba.',
    },
    qs: [
      ['Which five English alphabet letters do NOT appear in the Standard Yoruba alphabet?', 'c, q, v, x, z', 'a, e, i, o, u', 'b, d, g, k, m', 'f, h, j, l, r', 'Standard Yoruba omits c, q, v, x and z while adding ẹ, gb, ọ and ṣ.'],
      ['What is the English meaning of the Yoruba word "igbá" (Mid–High tone)?', 'Calabash', 'Time / season', 'Two hundred', 'Vehicle', 'igbá (M–H) means calabash; ìgbà (L–L) means time; igba (M–M) means 200.'],
      ['Which pronoun correctly shows respect when greeting a single elder in the morning ("Good morning, sir/ma")?', 'Ẹ káàárọ̀', 'O káàárọ̀', 'Ìwọ káàárọ̀', 'Èmi káàárọ̀', 'Honorific "Ẹ" demonstrates Yoruba respect (ọmọlúàbí) toward elders.'],
      ['In Yoruba grammar, what is a verb called?', 'Ọ̀rọ̀-ìṣe', 'Ọ̀rọ̀-orúkọ', 'Ọ̀rọ̀-àpèjúwe', 'Àmì ohùn', 'Ọ̀rọ̀-ìṣe means action word (verb); Ọ̀rọ̀-orúkọ is a noun.'],
      ['Contracting "jẹ + ẹran" (eat meat) into "jẹran" in natural Yoruba speech is an example of', 'elision (ìpàrójẹ)', 'tone reversal', 'borrowing', 'alliteration', 'Vowel elision drops one of two meeting vowels smoothly across words.'],
      ['Which tone mark represents the LOW tone (Do) in Yoruba writing?', 'Grave accent (`)', 'Acute accent (´)', 'Unmarked vowel', 'Question mark', 'Grave (`) marks Low (Do), unmarked marks Mid (Re), and acute (´) marks High (Mi).'],
    ],
  },
  {
    id: 'yoruba-literature-owe-asa',
    name: 'Yoruba proverbs (Owe), oral poetry (Ewì) and Àṣà (Culture)',
    sec: 'Yoruba literature and culture',
    goals: [
      'Interpret Yoruba proverbs (Òwe), oral poetry genres (Oríkì, Ìjálá, Ewì) and pioneer written works (D.O. Fagunwa)',
      'Explain core Yoruba cultural ethics (Ọmọlúàbí), greetings, naming ceremonies and traditional crafts',
    ],
    trap: 'Do not confuse ORÍKÌ with ÌJÁLÁ: Oríkì is praise poetry celebrating lineages, towns or individuals, whereas Ìjálá is the distinct rhythmic chanted poetry of Yoruba hunters (Ọdẹ) honouring Ògún and wildlife.',
    p1: {
      title: 'Òwe (Proverbs), oral poetry and written classics',
      idea: 'Yoruba oral literature (Lítíréṣọ̀ Alohùn) holds immense beauty: "Òwe l’ẹṣin ọ̀rọ̀, ọ̀rọ̀ l’ẹṣin òwe; bí ọ̀rọ̀ bá sọnù, òwe la fi ń wá a" (Proverbs are the horse of speech; when speech is lost, proverbs find it). Major oral poetry genres include Oríkì (praise poetry), Ìjálá (hunters’ chant), Rárà (royal/festive chant), Ẹkún Ìyàwó (bridal farewell chant) and Àlọ́ (folktales starring Ìjàpá the tortoise). Modern Yoruba novels began with Chief D.O. Fagunwa’s classic "Ògbójú Ọdẹ Nínú Igbó Irúnmọlẹ̀" (1938).',
      terms: [
        ['Oríkì', 'Praise poetry celebrating personal, family or town ancestry and heroic deeds'],
        ['Ìjálá', 'Traditional chanted oral poetry performed by Yoruba hunters'],
        ['D.O. Fagunwa', 'Pioneering Yoruba novelist, author of "Ògbójú Ọdẹ Nínú Igbó Irúnmọlẹ̀" (1938)'],
      ],
      rules: [
        '"Ìwà l’ẹwà" = Good character is true beauty.',
        '"Àgbájọ ọwọ́ la fi ń sọ̀yà" = Unity/togetherness gives strength and confidence.',
      ],
      headers: ['Oral genre', 'Who performs it / occasion'],
      rows: [
        ['Oríkì', 'Lineage, personal or town praise poetry'],
        ['Ìjálá', 'Chanted poetry of Yoruba hunters'],
        ['Ẹkún Ìyàwó', 'Emotional farewell chant sung by a bride leaving her parents’ home'],
        ['Àlọ́ Àpamọ̀ / Àpagbè', 'Riddles (Àpamọ̀) and moral folktales with song (Àpagbè, starring Ìjàpá)'],
      ],
      exQ: 'What core Yoruba moral value is summed up in the proverb "Ìwà l’ẹwà"?',
      exSteps: [
        ['Translate literally', 'Character is beauty'],
        ['Apply meaning', 'Integrity, humility and kindness matter far more than outward appearance or clothes'],
      ],
      checkQ: 'Which Yoruba oral poetry genre is performed specifically by traditional hunters?',
      checkO: ['Ìjálá', 'Ẹkún Ìyàwó', 'Àlọ́ Àpamọ̀', 'Rárà ìyàwó'],
      checkH: [
        'It praises courage, animals of the forest and the craft of hunting.',
        'Ẹkún Ìyàwó is sung by brides, not hunters.',
      ],
      checkE: 'Ìjálá is the renowned oral poetry chanted by Yoruba hunters.',
    },
    p2: {
      title: 'Ọmọlúàbí, Àṣà (Culture) and traditional institutions',
      idea: 'The highest ideal of Yoruba character is Ọmọlúàbí — a person of honesty (òtítọ́), respect (ìtẹríba), hard work (iṣẹ́ àṣekára), courage and goodwill. Yoruba culture is famous for rich greetings for every season and activity (e.g., "Ẹ kú iṣẹ́" — well done at work; "Ẹ kú ọjọ́ mẹ́ta" — long time no see), naming ceremonies (Ìsọmọlórúkọ) where symbolic items like honey (oyin), salt (iyọ̀) and water (omi) bless the newborn, and historic crafts (Adire, Aso-Oke, bronze and wood carving).',
      terms: [
        ['Ọmọlúàbí', 'The Yoruba ethical ideal of a well-bred, honest, respectful and hardworking person'],
        ['Ìdọ̀bálẹ̀ & Ìkúnlẹ̀', 'Traditional respectful gestures: boys prostrating (ìdọ̀bálẹ̀) and girls kneeling (ìkúnlẹ̀) to greet elders'],
        ['Ìsọmọlórúkọ', 'Traditional Yoruba naming ceremony blessing a newborn with symbolic items and meaningful names'],
      ],
      rules: [
        'Yoruba names carry deep meaning: Amútọ̀runwá (brought from heaven, e.g., Táíwò/Kẹ́hìndé for twins, Ìdòwú after twins), Àbísọ (given based on family circumstances, e.g., Babátúndé, Ọlúwadáre).',
        'In naming ceremonies, honey (oyin) symbolises sweetness/joy in life and salt (iyọ̀) symbolises flavour and honour.',
      ],
      headers: ['Yoruba greeting', 'Occasion'],
      rows: [
        ['Ẹ kú àárọ̀ / ọ̀sán / ìrọ̀lẹ́', 'Good morning / afternoon / evening'],
        ['Ẹ kú iṣẹ́', 'Greeting someone busy working'],
        ['Ẹ kú oríire', 'Congratulations on a success or blessing'],
        ['Ẹ kú àbọ̀', 'Welcome back home'],
      ],
      exQ: 'In Yoruba naming customs, why are twins named Táíwò and Kẹ́hìndé, and which twin is traditionally regarded as the elder?',
      exSteps: [
        ['Táíwò (first born)', 'Sent ahead to "taste the world" (Tọ́-ayé-wò)'],
        ['Kẹ́hìndé (second born)', 'Traditionally honoured as the senior twin who sent Táíwò ahead'],
      ],
      checkQ: 'Which Yoruba term describes a well-brought-up person embodying honesty, respect, diligence and good character?',
      checkO: ['Ọmọlúàbí', 'Ìjàpá', 'Àlọ́', 'Ìjálá'],
      checkH: [
        'It is the cornerstone ethical ideal of Yoruba home training (ẹ̀kọ́ ilé).',
        'Literally linked to "child born of noble character".',
      ],
      checkE: 'Ọmọlúàbí is the supreme Yoruba ideal of moral integrity, respect and good character.',
    },
    qs: [
      ['Who authored the landmark 1938 Yoruba novel "Ògbójú Ọdẹ Nínú Igbó Irúnmọlẹ̀"?', 'Chief D.O. Fagunwa', 'Pita Nwana', 'Abubakar Imam', 'Chinua Achebe', 'D.O. Fagunwa pioneered imaginative written Yoruba fiction.'],
      ['Who is the witty trickster character starring in traditional Yoruba folktales (Àlọ́)?', 'Ìjàpá (Tortoise)', 'Gizo (Spider)', 'Kìnìún (Lion)', 'Ẹfọ̀n (Buffalo)', 'Ìjàpá and his wife Yánníbo star in classic Yoruba Àlọ́ tales.'],
      ['What is the traditional Yoruba greeting offered to congratulate someone on an achievement or wedding?', 'Ẹ kú oríire', 'Ẹ kú ọ̀fọ̀', 'Ẹ kú òtútù', 'Ó dàbọ̀', '"Ẹ kú oríire" conveys warm congratulations.'],
      ['Which Yoruba name category covers automatic birth-circumstance names such as Táíwò, Kẹ́hìndé and Ìdòwú?', 'Orúkọ Àmútọ̀runwá', 'Oríkì', 'Ìnágijẹ', 'Òwe', 'Àmútọ̀runwá names are determined automatically by the circumstances of birth.'],
      ['In a Yoruba naming ceremony, what does honey (oyin) symbolise for the newborn child?', 'A sweet, joyful and prosperous life', 'Bitterness and struggle', 'Travel abroad', 'Silence', 'Honey prays that the child’s life will be sweet and pleasant.'],
      ['What is the farewell chant performed by a Yoruba bride to bless and thank her parents before moving to her husband’s home?', 'Ẹkún Ìyàwó', 'Ìjálá', 'Àlọ́ Àpamọ̀', 'Iwì Egúngún', 'Ẹkún Ìyàwó expresses a bride’s gratitude and transition into married life.'],
    ],
  },
];

export function buildFrenchCurriculum() {
  return buildUtmeSubjectCurriculum([...FRENCH_SPECS.map(compactUtmeTopic), ...FRENCH_EXTRA_SPECS]);
}
export function buildArabicCurriculum() {
  return buildUtmeSubjectCurriculum([...ARABIC_SPECS.map(compactUtmeTopic), ...ARABIC_EXTRA_SPECS]);
}
export function buildHausaCurriculum() {
  return buildUtmeSubjectCurriculum([...HAUSA_SPECS.map(compactUtmeTopic), ...HAUSA_EXTRA_SPECS]);
}
export function buildIgboCurriculum() {
  return buildUtmeSubjectCurriculum([...IGBO_SPECS.map(compactUtmeTopic), ...IGBO_EXTRA_SPECS]);
}
export function buildYorubaCurriculum() {
  return buildUtmeSubjectCurriculum([...YORUBA_SPECS.map(compactUtmeTopic), ...YORUBA_EXTRA_SPECS]);
}
