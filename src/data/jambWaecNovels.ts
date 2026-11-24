export type NovelExamCategory = 'jamb-english' | 'african-prose' | 'non-african-prose';

export type NovelArtworkKey = 'lekki' | 'life-changer' | 'african' | 'non-african';

export type NovelSceneArtworkKey =
  | 'assembly'
  | 'airport'
  | 'courtyard'
  | 'campus'
  | 'courtroom'
  | 'manuscript';

export interface NovelChapterGuide {
  number: number;
  title: string;
  summary: string;
  keyEvents: string[];
  examTrap: string;
}

export interface NovelCharacterProfile {
  name: string;
  role: string;
  traits: string;
  examNote: string;
}

export interface NovelThemeNote {
  theme: string;
  analysis: string;
  deviceConnection: string;
}

export interface NovelExamQuestion {
  id: string;
  examTag: string;
  q: string;
  o: [string, string, string, string];
  a: 0 | 1 | 2 | 3;
  explanation: string;
  trapNote: string;
}

export interface NovelEssayPrompt {
  prompt: string;
  examPaper: string;
  markingPoints: string[];
}

export interface PrescribedNovel {
  id: string;
  title: string;
  author: string;
  nationality: string;
  category: NovelExamCategory;
  examBodies: ('JAMB' | 'WAEC' | 'NECO')[];
  subjectId: 'eng' | 'lit';
  syllabusWindow: string;
  statusLabel: string;
  artworkKey: NovelArtworkKey;
  setting: string;
  pointOfView: string;
  structureLabel: string;
  logline: string;
  overview: string;
  chapters: NovelChapterGuide[];
  characters: NovelCharacterProfile[];
  themes: NovelThemeNote[];
  literaryDevices: { device: string; example: string }[];
  questions: NovelExamQuestion[];
  essayPrompts: NovelEssayPrompt[];
}

export const JAMB_WAEC_NOVELS: PrescribedNovel[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. THE LEKKI HEADMASTER — KABIR ALABI GARBA (OFFICIAL JAMB USE OF ENGLISH)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'lekki-headmaster',
    title: 'The Lekki Headmaster',
    author: 'Kabir Alabi Garba',
    nationality: 'Nigerian',
    category: 'jamb-english',
    examBodies: ['JAMB'],
    subjectId: 'eng',
    syllabusWindow: '2025–2027 UTME Cycle',
    statusLabel: 'Current Compulsory JAMB English Novel',
    artworkKey: 'lekki',
    setting: 'Stardom Schools, Lekki (Lagos), Badagry, Abeokuta & Murtala Muhammed International Airport',
    pointOfView: 'Third-person omniscient narration woven with flashbacks and interior monologue',
    structureLabel: '12 Chapters (Dusk to Dawn)',
    logline:
      'Torn between his family in London and two decades of moral leadership at Stardom Schools in Lekki, Principal Bepo Adewale confronts Nigeria’s “Japa” wave at the departure gate.',
    overview:
      'Kabir Alabi Garba’s novel opens at morning assembly in Stardom Schools, Lekki, where beloved Principal Adebepo (“Bepo”) Adewale unexpectedly breaks down in tears. Across twelve chapters framed symbolically from “Dusk” to “Dawn”, the narrative unpacks the administrative battles of elite Nigerian private schools, parent-teacher friction, heritage excursions, and the intense pressure from Bepo’s wife, Seri, to relocate (“Japa”) to the United Kingdom—culminating in a gripping psychological turning point at the international airport.',
    chapters: [
      {
        number: 1,
        title: 'Chapter 1: Dusk — Tears on the Assembly Podium',
        summary:
          'At Tuesday morning assembly in Stardom Schools, Lekki, Principal Adebepo (Bepo) Adewale steps up to address students and staff but is overwhelmed by grief and weeps openly. Managing Director Mrs. Ibidun Gloss, Vice-Principal Mrs. Grace Apeh, and anxious teachers rush him to his office, sparking rumours across the school.',
        keyEvents: [
          'Bepo breaks down in tears on the assembly podium before speaking a word.',
          'Mrs. Ibidun Gloss and Mrs. Grace Apeh calm the assembly and escort Bepo to his office.',
          'Staff speculate over whether Bepo lost a relative or is facing health or marital trouble.',
        ],
        examTrap:
          'Examiners test WHY Bepo wept in Chapter 1: it was NOT because he was sacked or bereaved, but because of the agonising emotional pain of leaving Stardom Schools and Nigeria for the UK.',
      },
      {
        number: 2,
        title: 'Chapter 2: The Enticement — Seri & the Japa Ultimatum',
        summary:
          'The root of Bepo’s anguish is revealed: his wife, Seri, a nurse already living in London with their two children (Nike and Kike), has given him a firm ultimatum to relocate permanently to the UK. Seri argues that Bepo can earn far higher wages in pounds Sterling than his principal’s salary in Lagos.',
        keyEvents: [
          'Seri pressures Bepo from London, comparing UK hourly care/support pay in pounds with his Lagos salary.',
          'Their daughters Nike and Kike also miss their father and expect him to join them.',
          'Bepo finally confides in Mrs. Ibidun Gloss that he intends to resign and relocate.',
        ],
        examTrap:
          'Keep the names straight: Bepo’s wife is Seri, and their two children in the UK are Nike and Kike (not Titi or Bimpe).',
      },
      {
        number: 3,
        title: 'Chapter 3: Migration Tales — Dreams & Harsh Realities Abroad',
        summary:
          'Through staffroom conversations and Bepo’s reflections, the novel contrasts glossy “Japa” success stories with sobering tales of Nigerian professionals trapped in menial jobs, loneliness, or marital collapse abroad—such as colleagues who borrowed millions for visas or faced cold domestic rules overseas.',
        keyEvents: [
          'Bepo recalls teachers like Mr. Nsikak and Sola who migrated through student and care routes.',
          'Cautionary stories surface about Nigerian husbands mistreated or reported to police abroad when power dynamics flip.',
          'Bepo’s nickname “The Lekki Headmaster” is traced back to his diplomatic conflict-resolution style reminiscent of the classic TV drama The Village Headmaster.',
        ],
        examTrap:
          'Bepo earned the nickname “The Lekki Headmaster” from former colleague Mr. Audu because he settled disputes wisely like Chief Oloja/headmaster figures in The Village Headmaster—NOT because Stardom was a primary-only school.',
      },
      {
        number: 4,
        title: 'Chapter 4: A Case of Visa Denied & Schoolroom Friction',
        summary:
          'Flashbacks highlight everyday administrative tensions at Stardom Schools, including Mr. Fafore’s near-dismissal after a wealthy parent complained about a grammar correction, and Bepo’s calm, evidence-based intervention that saved fair standards without humiliating staff.',
        keyEvents: [
          'A parent accuses English teacher Mr. Fafore over a clause/grammar note in a student’s book.',
          'Bepo investigates impartially rather than bowing blindly to rich Lekki parents.',
          'Teachers face visa anxieties and embassy rejections while chasing foreign dreams.',
        ],
        examTrap:
          'Watch how Stardom handles wealthy parents: Mrs. Ibidun Gloss fears losing fee-paying parents, whereas Bepo balances business survival with academic integrity.',
      },
      {
        number: 5,
        title: 'Chapter 5: Snake in the Roof — Land, Debt & Cooperative Politics',
        summary:
          'During an inspection of Stardom’s land and staff cooperative investments, a literal and symbolic “snake in the roof” episode exposes hidden financial and administrative dangers: some staff members borrow heavily from the school cooperative to fund secret relocation plans without repaying.',
        keyEvents: [
          'Discovery of a snake in the roof mirrors hidden betrayal inside the staff cooperative.',
          'Staff cooperative loans are abused by departing teachers funding Japa travel.',
          'Board and management tighten financial oversight at Stardom Schools.',
        ],
        examTrap:
          '“Snake in the roof” operates both literally (an actual reptile incident) and metaphorically (hidden treachery/debt default within the school cooperative).',
      },
      {
        number: 6,
        title: 'Chapter 6: Ade as Well as Jide — Student Rivalries & Parental Feuds',
        summary:
          'Long-standing rivalry between two student families—Jide Ajayi and Banky Bankole—erupts during prefectship elections and school debates, dragging parents’ old political and social grudges onto campus until Bepo restores order.',
        keyEvents: [
          'Prefectship politics pits Banky against Tosh/Jide, exposing class arrogance and family feuds.',
          'Parents threaten lawsuits and withdrawals, testing Bepo’s mediation skill.',
          'Grammar concord (“Ade as well as Jide COMES”) echoes Mr. Fafore’s earlier classroom lesson.',
        ],
        examTrap:
          'Notice the title’s concord clue (“Ade as well as Jide” takes a SINGULAR verb)—Garba weaves an actual JAMB English concord rule right into the chapter title!',
      },
      {
        number: 7,
        title: 'Chapter 7: Ritualists, Excursions & Cultural Awakening',
        summary:
          'Bepo champions educational excursions across Nigeria—including Badagry Slave Relics, Erin-Ijesha Waterfalls, Ikogosi Warm Springs, and Sungbo’s Eredo—teaching affluent Lekki students to value Nigerian history while confronting superstition and security fears.',
        keyEvents: [
          'Open Day and excursion memories take students from Lekki to Badagry, Abeokuta, and Ekiti/Osun.',
          'At Badagry’s Point of No Return, historical chains foreshadow Bepo’s later crisis over voluntary modern exile.',
          'Rumours and moral panics are countered through rational inquiry.',
        ],
        examTrap:
          'Remember the Badagry Slave Museum excursion: seeing the chains and “Point of No Return” plants the psychological seed for Bepo’s airport nightmare later.',
      },
      {
        number: 8,
        title: 'Chapter 8: Missions Accomplished — Stardom’s Academic Triumphs',
        summary:
          'Reflecting on twenty-four years of service, Bepo takes pride in generations of Stardom alumni thriving in medicine, law, tech, and arts, alongside the school’s Breath Project and invention clubs, making his looming departure even harder to bear.',
        keyEvents: [
          'Bepo reviews Stardom’s WAEC/UTME distinctions and student innovation projects.',
          'News of his resignation spreads officially, leaving students and teachers heartbroken.',
          'Bepo struggles with sleeplessness as his flight date draws near.',
        ],
        examTrap:
          'Bepo is NOT leaving because he failed at Stardom—the school is flourishing under his stewardship, which heightens his inner conflict.',
      },
      {
        number: 9,
        title: 'Chapter 9: Laughing Waterfalls — Heritage & National Pride',
        summary:
          'Further memories of Nigeria’s natural wonders (Erin-Ijesha, Ikogosi where warm and cold springs meet, Gurara, and Yankari) reinforce Bepo’s deep love for his homeland and his conviction that Nigeria possesses neglected beauty and potential.',
        keyEvents: [
          'Detailed recollections of Ikogosi Warm Springs (Ekiti) and Erin-Ijesha Waterfalls (Osun).',
          'Bepo contrasts Nigeria’s rich cultural warmth with the cold individualism of life abroad.',
          'Final handover notes are prepared for Vice-Principal Mrs. Grace Apeh.',
        ],
        examTrap:
          'Match tourist sites to states accurately: Ikogosi Warm Springs is in Ekiti State; Erin-Ijesha (Olumirin) Waterfalls is in Osun State.',
      },
      {
        number: 10,
        title: 'Chapter 10: Passport Pains — NIN, Renewals & Departure Prep',
        summary:
          'Bepo endures the frustrating bureaucracy of passport renewal along the Ibadan/Abeokuta axis—tout rackets, NIN hitches, and biometric delays—before finally securing his travel documents as Stardom prepares a grand send-forth.',
        keyEvents: [
          'Bepo travels outside Lagos to fast-track his passport renewal amid administrative bottlenecks.',
          'He witnesses ordinary Nigerians desperate to obtain passports at any cost.',
          'His flight ticket to London is confirmed.',
        ],
        examTrap:
          'Passport renewal exposes real Nigerian institutional inefficiency—the novel is realistic rather than romanticising Nigeria’s public bureaucracy.',
      },
      {
        number: 11,
        title: 'Chapter 11: Point of No Return — Send-Forth & Airport Nightmare',
        summary:
          'After an emotional valedictory celebration with cultural dances and a $10,000 gift cheque from Mrs. Ibidun Gloss, Bepo is driven to Murtala Muhammed International Airport. At the departure lounge, haunted by a vivid vision equating desperate mass migration to Badagry’s chains of “New Slavery”, he turns back from boarding his London flight.',
        keyEvents: [
          'Stardom hosts a grand send-forth; cultural troupes perform and Mrs. Gloss presents a generous gift.',
          'Mr. Jeremi Amos drives Bepo to Murtala Muhammed International Airport, Ikeja.',
          'Haunted by images of ancestral slave chains and loss of purpose, Bepo abandons the flight at the gate.',
        ],
        examTrap:
          'Chapter 11 is the CLIMAX: Bepo is NOT deported or denied boarding by immigration—he voluntarily walks away from the departure gate out of patriotic and vocational conviction.',
      },
      {
        number: 12,
        title: 'Chapter 12: Dawn — Return to Stardom',
        summary:
          'As morning breaks (“Dawn”), Bepo returns unannounced to Stardom Schools instead of landing in Heathrow. Stunned joy erupts across the assembly ground as students, teachers, and Mrs. Ibidun Gloss welcome back the Lekki Headmaster, symbolising renewed hope and commitment to nation-building.',
        keyEvents: [
          'The darkness of Chapter 1 (“Dusk”) resolves into sunrise in Chapter 12 (“Dawn”).',
          'Bepo reappears at Stardom Schools to thunderous jubilation from students and staff.',
          'He resolves to face Seri’s anger calmly and continue moulding Nigeria’s future leaders at home.',
        ],
        examTrap:
          'Note the circular structural frame: Chapter 1 opens at assembly in “Dusk” (tears of departure) and Chapter 12 closes at assembly in “Dawn” (joy of return).',
      },
    ],
    characters: [
      {
        name: 'Mr. Adebepo (“Bepo”) Adewale',
        role: 'Protagonist & Principal of Stardom Schools, Lekki',
        traits: 'Principled, empathetic, patriotic, diplomatic, deeply devoted to teaching',
        examNote:
          'Studied English/Education; nicknamed “The Lekki Headmaster” for his wise conflict resolution; chooses nation-building over relocating to the UK.',
      },
      {
        name: 'Seri Adewale',
        role: 'Bepo’s wife living in the United Kingdom',
        traits: 'Pragmatic, persistent, materialistic-leaning, family-focused',
        examNote:
          'Works in the UK with daughters Nike and Kike; pressures Bepo relentlessly to leave his principalship for pound-earning jobs abroad.',
      },
      {
        name: 'Mrs. Ibidun Gloss',
        role: 'Managing Director / Proprietor of Stardom Schools',
        traits: 'Business-savvy, appreciative, firm yet generous',
        examNote:
          'Deeply values Bepo’s stabilizing leadership, honours him lavishly at his send-forth, and welcomes him back warmly at Dawn.',
      },
      {
        name: 'Mrs. Grace Apeh',
        role: 'Vice-Principal at Stardom Schools',
        traits: 'Supportive, observant, loyal administrator',
        examNote:
          'Stands beside Bepo during the Chapter 1 assembly breakdown and prepares to hold the fort during his planned exit.',
      },
      {
        name: 'Mr. Audu',
        role: 'Witty colleague who coined Bepo’s nickname',
        traits: 'Humorous, perceptive, grounded',
        examNote:
          'Named Bepo “The Lekki Headmaster” in allusion to Nigeria’s classic television drama The Village Headmaster.',
      },
      {
        name: 'Mr. Fafore',
        role: 'English teacher caught in a parent-complaint storm',
        traits: 'Competent but shaken by elite parental intimidation',
        examNote:
          'Illustrates the vulnerability of private-school teachers and Bepo’s fair, protective leadership.',
      },
    ],
    themes: [
      {
        theme: 'The “Japa” Syndrome & Brain Drain',
        analysis:
          'Examines the mass exodus of skilled Nigerian educators, doctors, and youths seeking economic security abroad, weighing foreign wages against loss of status, identity, and national capacity.',
        deviceConnection: 'Historical allusion to the Badagry transatlantic “Point of No Return”.',
      },
      {
        theme: 'Patriotism, Sacrifice & Nation-Building',
        analysis:
          'Through Bepo’s refusal to board the London flight, Garba argues that Nigeria can only be rebuilt when principled professionals stay to mentor the next generation.',
        deviceConnection: 'Symbolic title progression from “Dusk” (Ch. 1) to “Dawn” (Ch. 12).',
      },
      {
        theme: 'Educational Leadership & Integrity',
        analysis:
          'Contrasts commercial pressure in elite private schools with Bepo’s insistence on academic honesty, fair discipline, and teacher dignity.',
        deviceConnection: 'Intertextual allusion to The Village Headmaster.',
      },
      {
        theme: 'Family Pressure vs Personal Vocation',
        analysis:
          'Highlights the agonising domestic strain when one spouse relocates abroad and equates success strictly with foreign currency rather than vocational fulfilment.',
        deviceConnection: 'Interior monologue and flashback.',
      },
      {
        theme: 'Cultural Heritage & Domestic Tourism',
        analysis:
          'Celebrates Nigerian landmarks—Badagry, Ikogosi, Erin-Ijesha, Abeokuta—showing that Nigerian youths gain confidence when connected to their own history.',
        deviceConnection: 'Vivid visual imagery and travelogue narration.',
      },
    ],
    literaryDevices: [
      {
        device: 'In Media Res & Suspense',
        example:
          'Opening directly with Bepo weeping on the assembly podium withholds the cause until Chapter 2, gripping the reader immediately.',
      },
      {
        device: 'Symbolism (Dusk vs Dawn)',
        example:
          '“Dusk” symbolises emotional gloom and impending exile; “Dawn” symbolises moral clarity, rebirth, and homecoming.',
      },
      {
        device: 'Allusion',
        example:
          'References to NTA’s The Village Headmaster and the Badagry Slave Relics’ “Point of No Return” deepen Bepo’s moral crisis.',
      },
      {
        device: 'Flashback (Analepsis)',
        example:
          'Chapters 3–9 weave episodes from Bepo’s 24-year career into the days leading up to his scheduled flight.',
      },
    ],
    questions: [
      {
        id: 'lh-q1',
        examTag: 'JAMB UTME · Plot & Suspense',
        q: 'In Chapter 1 (“Dusk”) of The Lekki Headmaster, why does Mr. Bepo Adewale break down in tears on the morning assembly podium?',
        o: [
          'He is overwhelmed by the emotional agony of leaving Stardom Schools and his lifelong calling in Nigeria for the UK',
          'The Managing Director, Mrs. Ibidun Gloss, has just issued him a summary dismissal letter',
          'WAEC cancelled Stardom Schools’ final-year examination results',
          'He received a phone call announcing the sudden death of his colleague Mr. Audu',
        ],
        a: 0,
        explanation:
          'Bepo’s tears stem from his deep internal conflict over resigning from his beloved students and Stardom Schools under pressure from his wife Seri to relocate to the UK.',
        trapNote: 'Candidates who guess before reading Chapter 2 often fall for bereavement or dismissal distractors.',
      },
      {
        id: 'lh-q2',
        examTag: 'JAMB UTME · Characterisation',
        q: 'How did Mr. Bepo Adewale originally earn the sobriquet “The Lekki Headmaster”?',
        o: [
          'Mr. Audu coined it to praise his wise, humane way of settling disputes, echoing the classic TV drama The Village Headmaster',
          'He previously served as headmaster of Lekki Local Government Primary School before joining Stardom',
          'Wealthy parents used it mockingly because he refused to wear a suit to assembly',
          'The Lagos State Ministry of Education conferred the title on him during Independence Day',
        ],
        a: 0,
        explanation:
          'His colleague Mr. Audu gave him the nickname in admiration of his calm, Solomon-like conflict resolution reminiscent of The Village Headmaster.',
        trapNote: 'Look out for the literal “primary school headmaster” trap—Bepo is Principal of Stardom Secondary School.',
      },
      {
        id: 'lh-q3',
        examTag: 'JAMB UTME · Symbolism & Climax',
        q: 'What triggers Bepo’s sudden decision to abandon his London-bound flight at Murtala Muhammed International Airport in Chapter 11?',
        o: [
          'A haunting psychological conviction equating his pressured relocation to a voluntary “New Slavery” past the Point of No Return',
          'UK Border Force revoked his visa electronically at the boarding gate',
          'His passport expired because of an unresolved NIN mismatch in Abeokuta',
          'Mrs. Ibidun Gloss arrived at the airport with police officers over a cooperative loan',
        ],
        a: 0,
        explanation:
          'Recalling the chains and “Point of No Return” from the Badagry excursion, Bepo realises that abandoning his purpose under pressure would enslave his spirit, so he walks back.',
        trapNote: 'His documents and visa were completely valid—his reversal was 100% voluntary.',
      },
      {
        id: 'lh-q4',
        examTag: 'JAMB UTME · Family Conflict',
        q: 'Which members of Bepo’s immediate family are already residing in the United Kingdom and urging him to join them?',
        o: [
          'His wife Seri and their two daughters, Nike and Kike',
          'His wife Ibidun and their two sons, Ade and Jide',
          'His sister Grace and his nephew Banky',
          'His wife Seri and their son Omar',
        ],
        a: 0,
        explanation:
          'Seri (a nurse in the UK) and their daughters Nike and Kike live in London and press Bepo to relocate permanently.',
        trapNote: 'Do not confuse Mrs. Ibidun Gloss (MD of Stardom) or Ade/Jide (students) with Bepo’s nuclear family.',
      },
      {
        id: 'lh-q5',
        examTag: 'JAMB UTME · Figurative Title',
        q: 'In Chapter 5, the image of a “snake in the roof” symbolizes both a literal incident on school grounds and',
        o: [
          'hidden financial betrayal by staff who took cooperative loans to fund secret relocation plans',
          'a plot by rival Lekki schools to poach Stardom’s best science students',
          'examination malpractice leaked by external invigilators',
          'an electrical fault in the Stardom boarding hostel',
        ],
        a: 0,
        explanation:
          'Alongside the physical reptile scare, “snake in the roof” mirrors the concealed breach of trust inside the staff cooperative society.',
        trapNote: 'Always connect Garba’s chapter metaphors to the administrative sub-plot of that chapter.',
      },
      {
        id: 'lh-q6',
        examTag: 'JAMB UTME · Grammar & Plot Link',
        q: 'Why was English teacher Mr. Fafore nearly dismissed at Stardom Schools before Bepo intervened?',
        o: [
          'An influential parent raised an uproar over a grammar correction in a student’s note',
          'He embezzled excursion funds meant for the Badagry trip',
          'He flogged Banky Bankole during prefectship campaigns',
          'He travelled to Abuja for a visa interview without permission',
        ],
        a: 0,
        explanation:
          'A wealthy parent confronted the school over a classroom grammar issue, illustrating the pressure private-school teachers face from entitled parents.',
        trapNote: 'Distinguish Mr. Fafore’s grammar episode from the cooperative loan defaulters.',
      },
      {
        id: 'lh-q7',
        examTag: 'JAMB UTME · Setting & Heritage',
        q: 'Which historical landmark visited on a Stardom Schools excursion directly foreshadows Chapter 11’s “Point of No Return”?',
        o: [
          'The Badagry Heritage Museum and Slave Route',
          'Ikogosi Warm and Cold Springs in Ekiti',
          'Olumo Rock in Abeokuta',
          'Erin-Ijesha Waterfalls in Osun',
        ],
        a: 0,
        explanation:
          'Badagry’s historic “Point of No Return” along the Atlantic slave route recurs in Bepo’s mind as he stands at the international departure gate.',
        trapNote: 'Ikogosi and Erin-Ijesha appear in the excursions, but only Badagry features the historic “Point of No Return”.',
      },
      {
        id: 'lh-q8',
        examTag: 'JAMB UTME · Structural Frame',
        q: 'The progression of chapter titles from Chapter 1 (“Dusk”) to Chapter 12 (“Dawn”) primarily conveys',
        o: [
          'a journey from emotional darkness and confusion to moral clarity and renewed national purpose',
          'that the entire plot of the novel takes place within a single twelve-hour night',
          'the decline of Stardom Schools from prosperity into bankruptcy',
          'Bepo’s overnight flight schedule from Lagos to London Heathrow',
        ],
        a: 0,
        explanation:
          '“Dusk” to “Dawn” is symbolic: the novel spans weeks/years through flashbacks, moving from sorrowful indecision to joyous renewal.',
        trapNote: 'Reject the literal 12-hour night trap—the story spans days of preparation and decades of flashbacks.',
      },
    ],
    essayPrompts: [
      {
        prompt:
          'Examine how Kabir Alabi Garba uses Mr. Bepo Adewale’s internal conflict to critique Nigeria’s “Japa” phenomenon without ignoring local systemic challenges.',
        examPaper: 'Use of English Critical Synthesis',
        markingPoints: [
          'Identify Seri’s economic argument (pound-to-naira wage gap, family unity in London) alongside local frustrations like passport renewal bottlenecks.',
          'Contrast financial lure with Bepo’s vocational dignity and impact at Stardom Schools over 24 years.',
          'Analyse the Badagry “Point of No Return” symbolism in Chapter 11 and Bepo’s triumphant return in “Dawn”.',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. THE LIFE CHANGER — KHADIJA ABUBAKAR JALLI (JAMB USE OF ENGLISH CLASSIC)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'life-changer',
    title: 'The Life Changer',
    author: 'Khadija Abubakar Jalli',
    nationality: 'Nigerian',
    category: 'jamb-english',
    examBodies: ['JAMB'],
    subjectId: 'eng',
    syllabusWindow: 'UTME Foundation & Revision Text',
    statusLabel: 'JAMB Use of English Companion Novel',
    artworkKey: 'life-changer',
    setting: 'Lafiya (Northern Nigeria) & Ahmadu Bello University (ABU), Zaria',
    pointOfView: 'Frame narrative: third-person home frame around Ummi’s first-person campus recollections',
    structureLabel: '9 Chapters',
    logline:
      'When her eldest son Omar celebrates Law admission at ABU Zaria, Ummi gathers her four children under the courtyard tree to share cautionary campus tales of Salma, Talle, and Salim.',
    overview:
      'Khadija Abubakar Jalli’s nine-chapter novel uses a warm domestic frame narrative in Lafiya: university-educated mother Ummi sits with her children—Omar (newly admitted to read Law with a 230 UTME score), Teemah, Jamila, and witty five-year-old Bint—to prepare Omar for campus life. Through the rise, moral stumble, and redemption of Salma Mohammed, the secret double life of quiet neighbour Talle, and Salim’s late-night smartphone ambush, Ummi proves why university truly is “the life changer”.',
    chapters: [
      {
        number: 1,
        title: 'Chapter 1: Classroom Wit & Omar’s Law Admission',
        summary:
          'Five-year-old Bint recounts how her meddlesome Social Studies teacher, Mallam Salihu, embarrassed himself trying to translate “Good morning” into French (“Bonjour”) before calling the French mistress. Moments later, 18-year-old Omar bursts in celebrating his JAMB admission to read Law at ABU Zaria (having scored 230).',
        keyEvents: [
          'Bint narrates how Mallam Salihu fumbled “Good morning” in French class.',
          'Omar announces his admission to study Law at Ahmadu Bello University, Zaria, after scoring 230 in UTME.',
          'Omar demands zobo and boasts “My learned sister”, prompting Ummi to call university “the life changer”.',
        ],
        examTrap:
          'Remember exact details: Mallam Salihu taught Social Studies (NOT French!), Omar scored 230 in UTME to study Law, and Bint is 5 years old.',
      },
      {
        number: 2,
        title: 'Chapter 2: Ummi’s Registration & Salma’s First Blunder',
        summary:
          'Ummi flashes back twenty years to her own admission at ABU Zaria—already married to her supportive husband before matriculation. At the HOD’s office, she meets bold, fashion-conscious Salma Mohammed, who complains loudly to a quiet young man in the queue about “corrupt lecturers”, not knowing he is Dr. Samuel Johnson, the HOD himself!',
        keyEvents: [
          'Ummi explains she married Omar’s father before starting university in Zaria.',
          'Ummi’s modest dressing initially surprises Dr. Samuel Johnson, who turns out to be her husband’s friend (“SamJohn”).',
          'Salma insults lecturers in front of Dr. Samuel Johnson, only to panic when she enters his office for clearance.',
        ],
        examTrap:
          'Dr. Samuel Johnson was NOT harassing Ummi—he recognised her surname/husband’s connection and treated both Ummi and even rude Salma with integrity.',
      },
      {
        number: 3,
        title: 'Chapter 3: Talle, “The Quiet One” of Lafayette',
        summary:
          'Digressing to explain why appearances deceive, Ummi recalls Talle—an orphan and local government driver in their quiet town of Lafayette, nicknamed “the quiet one” because of his gentle manners. Shockingly, police uncover that Talle collaborated with thug Zaki to kidnap a market boy (his stepmother’s/district head circle victim) and hide him in Talle’s own house for ₦250,000 ransom.',
        keyEvents: [
          'Talle lost both parents early and seemed blameless in the community.',
          'His suspiciously large daily grocery purchases at the market finally alert neighbours.',
          'Police arrest Zaki and Talle, rescuing the kidnapped teenager held inside Talle’s compound.',
        ],
        examTrap:
          'What exposed Talle? Having lived alone for years buying tiny portions of food, he suddenly began buying food enough for multiple people!',
      },
      {
        number: 4,
        title: 'Chapter 4: Roommates at Queen Amina Hall & Habib’s Ride',
        summary:
          'Returning to Salma’s story, Salma shares a hostel room with three supportive friends from diverse Nigerian regions—Tomiwa (Ibadan), Ngozi (Imo), and Ada (Benue)—sharing indomie and danwake. Driving back from town, Hon. Habib (a wealthy state lawmaker) and his driver Labaran offer Salma a lift; Salma cleverly gives Tomiwa’s phone number instead of her own.',
        keyEvents: [
          'Salma bonds warmly with roommates Tomiwa, Ngozi, and Ada across ethnic lines.',
          'Hon. Habib and his friend/driver Labaran meet Salma and request her contact.',
          'Tomiwa ends up dating Habib first before jealous tensions and money shift the triangle toward Salma.',
        ],
        examTrap:
          'Memorise Salma’s three roommates and their origins: Tomiwa (Oyo/Yoruba), Ngozi (Imo/Igbo), and Ada (Benue)—symbolising campus national unity.',
      },
      {
        number: 5,
        title: 'Chapter 5: Money, Temptation & Moral Drift',
        summary:
          'Generous cash gifts from Hon. Habib trigger rivalry and compromise among the roommates, pulling Salma deeper into materialistic campus distractions while her attendance at lectures and study discipline steadily erode.',
        keyEvents: [
          'Habib sends large sums of cash through Labaran, dazzling the hostel.',
          'Salma reconciles with her roommates by splitting money, normalising transactional dating.',
          'Salma neglects continuous assessment and lectures until final-year Moral Philosophy looms.',
        ],
        examTrap:
          'Notice the fatal course waiting in final year: Moral Philosophy—ironic because Salma’s own moral compass is slipping!',
      },
      {
        number: 6,
        title: 'Chapter 6: The Moral Philosophy Cheat-Note Disaster',
        summary:
          'Unprepared for her final-year General Studies / Moral Philosophy paper, Salma smuggles a tiny handwritten cheat sheet (“expo”) into the exam hall and copies blindly without looking up, unaware that a strict young female invigilator is standing right behind her. Caught red-handed, she implicates brilliant classmate Kolawole Abdul.',
        keyEvents: [
          'Salma panics over her final paper in Moral Philosophy and brings illicit micro-notes.',
          'Caught by the invigilator, she fills the Examination Malpractice (EMAL) form.',
          'Desperate not to sink alone, she names Kolawole Abdul, dragging him before the disciplinary committee.',
        ],
        examTrap:
          'Which paper got Salma expelled? Moral Philosophy (her very last university paper!). And the classmate she implicated was Kolawole Abdul.',
      },
      {
        number: 7,
        title: 'Chapter 7: The Bribe Scam — Dr. Kabir & the Fake Chairman',
        summary:
          'Facing the Senate Examination Ethics & Malpractice Committee, Salma turns to Hon. Habib for help. Labaran introduces her to “Dr. Mohammed Kabir”, a smooth-talking laboratory technologist who poses as the Malpractice Committee Chairman and fleeces Salma/Habib of ₦300,000 in total—before Salma walks into the actual panel and sees a completely different real Chairman!',
        keyEvents: [
          'Salma obtains ₦200,000+ from Habib and pays “Dr. Kabir” (actually a lab technologist and compulsive gambler named Kabir/Kartagi).',
          'Inside the real Senate panel, Salma realises she has been duped and is expelled outright.',
          'Labaran tracks down gambling addict Kabir at a card joint and recovers part of the battered fraudster’s pride, not Salma’s degree.',
        ],
        examTrap:
          '“Dr. Mohammed Kabir” was NOT a lecturer or panel chairman—he was merely a laboratory technologist and gambler who impersonated the chairman!',
      },
      {
        number: 8,
        title: 'Chapter 8: Salim’s Smartphone & the Natasha Ambush',
        summary:
          'Following her expulsion and her father’s heartbreak, a humbled, repentant Salma confides in Ummi’s husband’s friend Salim, who buys a new smartphone. Despite being warned by Salma about campus and online traps, Salim falls for a stranger named “Natasha”, driving out late at night to an uncompleted building where armed robbers ambush him before he narrowly escapes.',
        keyEvents: [
          'Omar gets a new smartphone from his father as an admission gift, prompting Ummi’s smartphone warning.',
          'Salim chats obsessively with “Natasha” on social media despite earlier engagements with Lawal’s sister.',
          'Lured to a dark outskirts address at night, Salim escapes armed captors with his life while abandoning his car briefly.',
        ],
        examTrap:
          'Keep SALMA (female student expelled over Moral Philosophy) distinct from SALIM (young man lured at night through his smartphone by “Natasha”)!',
      },
      {
        number: 9,
        title: 'Chapter 9: Redemption & Omar’s Promise',
        summary:
          'Ummi concludes her stories: Salma genuinely reformed, started a thriving business, married responsibly, and redeemed her character, while Salim swore off reckless online rendezvous and married happily. Humbled and wiser, Omar pledges to guard his integrity at ABU Zaria as a true positive “life changer”.',
        keyEvents: [
          'Salma rebuilds her life honestly after expulsion, proving failure need not be permanent.',
          'Omar sheds his Chapter 1 arrogance and thanks his mother for the timely moral armour.',
          'The family closes under the courtyard shade united in discipline and gratitude.',
        ],
        examTrap:
          'The title “The Life Changer” refers primarily to university experience itself (and wise mentorship), which transforms youths for good or ill depending on their choices.',
      },
    ],
    characters: [
      {
        name: 'Ummi (Mrs. Ahmed)',
        role: 'Frame narrator, disciplined teacher & mother of four',
        traits: 'Observant, modest, articulate, morally grounded',
        examNote:
          'Narrates Chapters 2–9 to prepare Omar for university; graduated cleanly from ABU Zaria as a married undergraduate.',
      },
      {
        name: 'Omar',
        role: 'Ummi’s 18-year-old eldest child & Law freshman',
        traits: 'Bright, initially boastful, receptive to correction',
        examNote:
          'Scored 230 in UTME to study Law at ABU Zaria; nicknamed “My learned brother” by Teemah.',
      },
      {
        name: 'Bint',
        role: 'Ummi’s 5-year-old youngest daughter',
        traits: 'Precocious, inquisitive, witty',
        examNote:
          'Opens Chapter 1 with her amusing French “Bonjour” encounter involving Social Studies teacher Mallam Salihu.',
      },
      {
        name: 'Salma Mohammed',
        role: 'Central figure of Ummi’s campus cautionary tale',
        traits: 'Vivacious, proud, susceptible to materialism, ultimately repentant',
        examNote:
          'Caught cheating in final-year Moral Philosophy, duped by fake chairman Kabir, expelled, and later reformed.',
      },
      {
        name: 'Talle (“The Quiet One”)',
        role: 'Deceptively gentle neighbour in Lafayette',
        traits: 'Secretive, easily compromised by greed, hypocritical',
        examNote:
          'Conspires with Zaki in a kidnapping/extortion plot exposed when his market food purchases suddenly triple.',
      },
      {
        name: 'Hon. Habib & Labaran',
        role: 'Wealthy politician suitor and his friend/driver',
        traits: 'Flashy, transactional, morally careless',
        examNote:
          'Funds Salma’s extravagant hostel lifestyle and inadvertently connects her to fraudster “Dr. Kabir”.',
      },
      {
        name: 'Salim',
        role: 'Smartphone-obsessed young professional',
        traits: 'Friendly but gullible online',
        examNote:
          'Nearly kidnapped after visiting online bait “Natasha” late at night in Chapter 8.',
      },
    ],
    themes: [
      {
        theme: 'University as a Moral Crucible',
        analysis:
          'Sudden freedom away from parental supervision exposes undergraduates to cultism, transactional dating, and shortcuts that test personal character.',
        deviceConnection: 'Frame narrative contrasting home safety with campus autonomy.',
      },
      {
        theme: 'Consequences of Examination Malpractice',
        analysis:
          'Four years of university study collapse in minutes when Salma brings cheat notes into her very last paper (Moral Philosophy).',
        deviceConnection: 'Situational irony (cheating in Moral Philosophy).',
      },
      {
        theme: 'Deceptive Appearances (“Don’t Judge by the Cover”)',
        analysis:
          'Dr. Samuel Johnson looks like a junior clerk; Talle “the quiet one” hides a kidnap victim; “Dr. Kabir” is a lab gambler in disguise.',
        deviceConnection: 'Dramatic & situational irony across multiple episodes.',
      },
      {
        theme: 'Social Media & Cyber-Trap Dangers',
        analysis:
          'Salim’s near-fatal midnight visit to “Natasha” warns youths against unverified digital romances and catfishing syndicates.',
        deviceConnection: 'Suspense and cautionary anecdote.',
      },
      {
        theme: 'Parental Mentorship & Second Chances',
        analysis:
          'Ummi guides her children through dialogue rather than harshness, while Salma’s honest post-expulsion recovery shows redemption is possible.',
        deviceConnection: 'Didactic storytelling in the African oral-courtyard tradition.',
      },
    ],
    literaryDevices: [
      {
        device: 'Frame Narrative (Story-within-a-Story)',
        example:
          'The Lafiya family conversation under the mango tree frames Ummi’s flashbacks to ABU Zaria and Lafayette.',
      },
      {
        device: 'Situational Irony',
        example:
          'Salma insults lecturers directly to HOD Dr. Samuel Johnson, and later gets expelled for cheating in Moral Philosophy.',
      },
      {
        device: 'Foreshadowing',
        example:
          'Talle’s unusual bulk food purchases subtly foreshadow the hidden kidnap victim inside his compound.',
      },
    ],
    questions: [
      {
        id: 'lc-q1',
        examTag: 'JAMB UTME · Opening Details',
        q: 'In Chapter 1 of The Life Changer, which subject did Mallam Salihu actually teach before embarrassing himself over the French translation of “Good morning”?',
        o: ['Social Studies', 'French Language', 'English Literature', 'Islamic Studies'],
        a: 0,
        explanation:
          'Mallam Salihu was Bint’s Social Studies teacher who meddled in answering Bint’s French question before seeking help from the French mistress.',
        trapNote: 'Many rushed candidates pick “French Language” just because the word “Bonjour” was discussed!',
      },
      {
        id: 'lc-q2',
        examTag: 'JAMB UTME · Character & Plot',
        q: 'What exact clue aroused neighbours’ suspicion against Talle (“the quiet one”) during the kidnapping investigation in Lafayette?',
        o: [
          'A bachelor who always bought tiny portions suddenly began buying large quantities of food in the market',
          'Neighbours heard the kidnapped boy shouting from Talle’s rooftop at midnight',
          'Zaki confessed publicly at the Emir’s palace before the police arrived',
          'Talle bought a brand-new luxury SUV with the ₦250,000 ransom',
        ],
        a: 0,
        explanation:
          'Because Talle lived alone, his sudden purchase of food meant for multiple adults tipped off observant market women and elders.',
        trapNote: 'Watch out for sensational distractors—it was mundane market observation that broke the case.',
      },
      {
        id: 'lc-q3',
        examTag: 'JAMB UTME · Situational Irony',
        q: 'In which final-year examination paper was Salma Mohammed caught with an illicit cheat sheet, leading to her expulsion?',
        o: ['Moral Philosophy', 'Constitutional Law', 'Use of English', 'Sociology of Crime'],
        a: 0,
        explanation:
          'In sharp situational irony, Salma was caught cheating in Moral Philosophy, her very last university examination.',
        trapNote: 'Omar goes to study Law, NOT Salma—Salma’s fateful exam was Moral Philosophy.',
      },
      {
        id: 'lc-q4',
        examTag: 'JAMB UTME · Impersonation Subplot',
        q: 'Who was “Dr. Mohammed Kabir”, the man who collected ₦300,000 from Salma promising to clear her before the Senate Malpractice Committee?',
        o: [
          'A university laboratory technologist and chronic gambler impersonating the committee chairman',
          'The actual Chairman of the Examination Ethics and Malpractice Committee',
          'Hon. Habib’s legislative aide in the State House of Assembly',
          'The Head of Department who registered Ummi during her first year',
        ],
        a: 0,
        explanation:
          'Kabir (nicknamed Kartagi at gambling joints) was merely a laboratory technologist who posed as the committee chairman to fleece desperate students.',
        trapNote: 'Do not confuse fraudster Kabir with Dr. Samuel Johnson (the honest HOD in Chapter 2).',
      },
      {
        id: 'lc-q5',
        examTag: 'JAMB UTME · Digital Caution',
        q: 'In Chapter 8, how does Salim narrowly escape catastrophe after receiving a new smartphone?',
        o: [
          'He flees an armed ambush at an uncompleted building after being lured out at night by an online bait named “Natasha”',
          'He refuses to open a fraudulent bank-verification SMS sent by Zaki',
          'Ummi confiscates his phone before he can transfer tuition fees to a scammer',
          'Police rescue him from Examination Malpractice syndicate blackmailers',
        ],
        a: 0,
        explanation:
          'Salim chats online with “Natasha”, drives to meet her at night, discovers it is a criminal kidnap/robbery trap, and barely escapes alive.',
        trapNote: 'Keep Salim’s smartphone ambush separate from Talle’s kidnapping case in Chapter 3.',
      },
      {
        id: 'lc-q6',
        examTag: 'JAMB UTME · Admissions Fact',
        q: 'What UTME score earned Omar admission to study Law at Ahmadu Bello University, Zaria?',
        o: ['230', '280', '195', '310'],
        a: 0,
        explanation:
          'Omar scored 230 in UTME (above the 200 cut-off benchmark mentioned in the text) and secured admission to read Law at ABU Zaria.',
        trapNote: 'JAMB frequently tests exact numeric details from Chapter 1 of its Use of English text.',
      },
    ],
    essayPrompts: [
      {
        prompt:
          'Show how Khadija Abubakar Jalli uses irony and a courtyard frame narrative to warn Nigerian youths about campus shortcuts and digital gullibility.',
        examPaper: 'Use of English Critical Synthesis',
        markingPoints: [
          'Explain how Ummi’s home conversations with Omar, Teemah, Jamila, and Bint make moral instruction warm and relatable.',
          'Trace situational irony in Salma’s encounter with Dr. Samuel Johnson and her Moral Philosophy expulsion.',
          'Link Talle’s quiet facade and Salim’s “Natasha” ambush to critical vigilance in adult life.',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. SO THE PATH DOES NOT DIE — PEDE HOLLIST (AFRICAN PROSE 2026–2030)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'so-the-path',
    title: 'So the Path Does Not Die',
    author: 'Pede Hollist',
    nationality: 'Sierra Leonean',
    category: 'african-prose',
    examBodies: ['WAEC', 'JAMB', 'NECO'],
    subjectId: 'lit',
    syllabusWindow: '2026–2030 Harmonized Syllabus',
    statusLabel: 'Prescribed African Prose (2026–2030)',
    artworkKey: 'african',
    setting: 'Talaba village, Freetown (Sierra Leone), Trinidad & Washington D.C. metro area (USA)',
    pointOfView: 'Third-person narration centered closely on Finaba Marah’s consciousness',
    structureLabel: 'Multi-part Diaspora Bildungsroman',
    logline:
      'From a disrupted village initiation in northern Sierra Leone to university and professional life in America, Finaba Marah fights to honour her Fulani-Kuranko heritage without preserving customs that wound girls.',
    overview:
      'Prescribed by WAEC and JAMB for 2026–2030 African Prose, Pede Hollist’s novel follows Finaba (“Fina”) Marah from rural Talaba in Sierra Leone—where her father Pa Marah breaks ancestral taboo to rescue her from female circumcision (fafei/Bondo bush)—through wartime displacement in Freetown and immigrant struggles in Washington D.C. Caught between grandmother Baramusu’s haunting plea (“so the path does not die”) and Western alienation, Fina redefines cultural continuity through ethical compassion rather than ritual harm.',
    chapters: [
      {
        number: 1,
        title: 'Part I: Talaba & the Disrupted Initiation',
        summary:
          'In rural Talaba, elder grandmother Baramusu insists young Finaba undergo traditional initiation so the ancestral “path does not die”. Haunted by the earlier death of Fina’s sister during circumcision, Fina’s father, Pa Aguibou Marah, defies secret-society taboo by storming the bush to pull Fina out—resulting in the family’s ostracism from Talaba.',
        keyEvents: [
          'Baramusu champions ancestral continuity (“so the path does not die”).',
          'Pa Marah interrupts the sacred Bondo/fafei initiation to save Fina’s life.',
          'Exiled from Talaba for breaking sacred custom, the family relocates to Freetown.',
        ],
        examTrap:
          'Crucial plot fact: Fina’s initiation is INTERRUPTED by her father Pa Marah (causing social stigma in both worlds—seen as uninitiated at home yet scarred by guilt).',
      },
      {
        number: 2,
        title: 'Part II: Freetown Youth, Class Snobbery & Crowther',
        summary:
          'Growing up in Freetown, Fina navigates Krio vs up-country ethnic prejudice, university politics, and painful romantic betrayal before winning an opportunity to travel abroad as Sierra Leone’s political and economic climate deteriorates.',
        keyEvents: [
          'Fina experiences Freetown’s social stratification against provincial ethnic groups.',
          'Her grandmother Baramusu’s dying words burden Fina with survivor’s guilt over the “path”.',
          'Fina secures passage to study in the United States.',
        ],
        examTrap:
          'Notice intra-African prejudice in Freetown (urban Krio elitism vs up-country Fulani/Kuranko identity) before Fina ever faces racism in America.',
      },
      {
        number: 3,
        title: 'Part III: Washington D.C. Diaspora Struggle',
        summary:
          'In the Washington D.C. metropolitan area, Fina works gruelling immigrant jobs, confronts subtle racism from both white Americans and African-Americans, and joins an African diaspora circle wrestling with green-card marriages, homesickness, and fractured identities.',
        keyEvents: [
          'Fina works tirelessly through college and social-work/counselling roles in America.',
          'Tension between African immigrants and African-Americans exposes fractures within the Black diaspora.',
          'Fina’s friend Amanzing and diaspora peers illustrate contrasting immigrant survival choices.',
        ],
        examTrap:
          'Hollist avoids painting America as paradise: diaspora life brings cold isolation, credential devaluation, and identity tension.',
      },
      {
        number: 4,
        title: 'Part IV: Cammy, Marriage Trials & Moral Choice',
        summary:
          'Fina’s relationship with wealthy Trinidadian surgeon Cammy promises material comfort and elite social standing, yet emotional incompatibility, infidelity/control, and Fina’s unhealed cultural questions force her to choose self-respect over a gilded cage.',
        keyEvents: [
          'Cammy offers affluence in the diaspora but fails to respect Fina’s inner cultural and emotional autonomy.',
          'Fina supports vulnerable girls and confronts abusive silences within immigrant households.',
          'She steps out of an unfulfilling union to reclaim agency.',
        ],
        examTrap:
          'Cammy is a Caribbean (Trinidadian) physician—highlighting cross-cultural Pan-African diaspora dynamics.',
      },
      {
        number: 5,
        title: 'Part V: Return to Sierra Leone & Redefining “The Path”',
        summary:
          'Returning to post-civil-war Sierra Leone, Fina channels her resources into practical community rehabilitation and girls’ education/protection. She realises that keeping Baramusu’s “path” alive means preserving communal care, resilience, and heritage while discarding destructive practices like FGM.',
        keyEvents: [
          'Fina returns home to a war-scarred Sierra Leone and invests in youth/child welfare.',
          'She reconciles with her past and honours Pa Marah’s courageous sacrifice.',
          '“The path” is redefined as living ethical heritage rather than blind ritual mutilation.',
        ],
        examTrap:
          'The resolution is synthesis, NOT total Westernisation: Fina embraces Sierra Leonean communal responsibility while rejecting FGM.',
      },
    ],
    characters: [
      {
        name: 'Finaba (“Fina”) Marah',
        role: 'Protagonist & Sierra Leonean woman navigating two worlds',
        traits: 'Resilient, introspective, compassionate, fiercely independent',
        examNote:
          'Carries psychological guilt from her interrupted initiation until she redefines cultural fidelity through service to Sierra Leonean youths.',
      },
      {
        name: 'Baramusu',
        role: 'Fina’s traditionalist maternal/paternal elder grandmother',
        traits: 'Devout custodian of custom, loving yet bound by ancestral fear',
        examNote:
          'Utters the novel’s titular refrain (“so the path does not die”); sincerely believes uninitiated girls sever ancestral continuity.',
      },
      {
        name: 'Pa Aguibou Marah',
        role: 'Fina’s protective father',
        traits: 'Courageous, sacrificial, progressive ahead of his village',
        examNote:
          'Having lost an older daughter to circumcision complications, he defies village taboo to rescue Fina, paying the price of exile.',
      },
      {
        name: 'Memuna (Mawaf / Mother)',
        role: 'Fina’s mother torn between custom and family survival',
        traits: 'Enduring, conflicted by communal shame',
        examNote:
          'Reflects the immense social pressure placed on rural women to conform to secret-society norms.',
      },
      {
        name: 'Cammy',
        role: 'Affluent Trinidadian doctor & Fina’s fiancé/husband in the US',
        traits: 'Successful, charming, status-driven, emotionally controlling',
        examNote:
          'Represents diaspora material security that still leaves Fina spiritually unfulfilled.',
      },
      {
        name: 'Amanzing & Edna',
        role: 'Diaspora confidants and foils to Fina',
        traits: 'Contrasting responses to immigrant loneliness and cultural negotiation',
        examNote:
          'Used by Hollist to dramatise diverse African and Caribbean immigrant experiences in Washington D.C.',
      },
    ],
    themes: [
      {
        theme: 'Tradition versus Human Dignity (Critique of FGM)',
        analysis:
          'Dramatises the human cost of female genital cutting while treating village elders like Baramusu with psychological complexity rather than flat caricature.',
        deviceConnection: 'Titular motif “so the path does not die” transformed from ritual blade to ethical legacy.',
      },
      {
        theme: 'Diaspora Alienation & Hybrid Identity',
        analysis:
          'Tracks Fina’s triple marginalisation—up-country outsider in Freetown, African immigrant in America, and “modern” returnee back home.',
        deviceConnection: 'Contrasting geographical settings (Talaba, Freetown, Washington D.C.).',
      },
      {
        theme: 'Paternal Courage & Female Agency',
        analysis:
          'Pa Marah’s brave rescue plants the seed for Fina’s adult determination to claim bodily and professional autonomy.',
        deviceConnection: 'Character foil between Pa Marah’s sacrificial love and patriarchal abusers.',
      },
      {
        theme: 'Post-War Reconstruction & Homecoming',
        analysis:
          'Suggests that African diaspora success finds its deepest meaning when reconnected to healing war-torn homelands.',
        deviceConnection: 'Circular journey motif (departure and redemptive return).',
      },
    ],
    literaryDevices: [
      {
        device: 'Motif & Refrain',
        example:
          'Baramusu’s phrase “so the path does not die” echoes across decades, shifting meaning as Fina matures.',
      },
      {
        device: 'Bildungsroman Structure',
        example:
          'Traces Fina’s moral, psychological, and cultural growth from childhood trauma in Talaba to self-actualised adulthood.',
      },
      {
        device: 'Foil Characters',
        example:
          'Baramusu (custodian of rigid custom) vs Pa Marah (protector of life); Cammy’s materialism vs Fina’s quest for authentic belonging.',
      },
    ],
    questions: [
      {
        id: 'stp-q1',
        examTag: 'WAEC & JAMB · Plot Catalyst',
        q: 'In Pede Hollist’s So the Path Does Not Die, why is Pa Marah’s family ostracised from Talaba village?',
        o: [
          'Pa Marah violates sacred custom by storming the initiation bush to rescue young Finaba from female circumcision',
          'Pa Marah sells communal farmland to diamond miners from Freetown',
          'Finaba refuses an arranged marriage to the paramount chief’s son',
          'Baramusu converts the family shrine into a Western mission school',
        ],
        a: 0,
        explanation:
          'Haunted by the death of an elder daughter during circumcision, Pa Marah breaks secret-society taboo to save Fina, forcing the family into exile.',
        trapNote: 'Remember that Pa Marah—not a foreign missionary—initiates Fina’s rescue.',
      },
      {
        id: 'stp-q2',
        examTag: 'WAEC & JAMB · Titular Symbolism',
        q: 'Who repeatedly voices the warning that girls must follow ancestral custom “so the path does not die”?',
        o: ['Grandmother Baramusu', 'Cammy', 'Edna', 'Pa Aguibou Marah'],
        a: 0,
        explanation:
          'Grandmother Baramusu embodies ancestral continuity and fears that abandoning initiation rites will sever the lineage’s spiritual path.',
        trapNote: 'Baramusu speaks out of sincere cultural belief rather than malice, creating poignant tragic tension.',
      },
      {
        id: 'stp-q3',
        examTag: 'WAEC & JAMB · Thematic Resolution',
        q: 'How does Finaba ultimately resolve the burden of keeping “the path” alive at the end of the novel?',
        o: [
          'By returning to support war-affected Sierra Leonean youths, preserving communal care while rejecting harmful rites',
          'By submitting to traditional initiation in Talaba to appease Baramusu’s spirit',
          'By severing all ties with Sierra Leone and adopting American identity permanently',
          'By emigrating with Cammy to Trinidad to practise medicine',
        ],
        a: 0,
        explanation:
          'Fina discovers that a culture’s true path lives through compassion, education, and community renewal—not physical mutilation.',
        trapNote: 'Avoid extreme options—Hollist champions cultural reform and reconnection, not total rejection of Africa.',
      },
      {
        id: 'stp-q4',
        examTag: 'WAEC & JAMB · Diaspora Dynamics',
        q: 'In the American chapters of So the Path Does Not Die, Cammy is best described as',
        o: [
          'a wealthy Trinidadian doctor whose material success cannot compensate for emotional control and incompatibility',
          'a Sierra Leonean rebel commander hiding from war-crimes prosecution in Maryland',
          'an immigration lawyer who deports Fina back to Freetown',
          'Fina’s supportive childhood cousin from Talaba',
        ],
        a: 0,
        explanation:
          'Cammy’s affluent Caribbean-American lifestyle offers financial security, yet Fina refuses to trade her dignity and cultural purpose for comfort.',
        trapNote: 'Do not confuse Cammy with characters from Redemption Road (Liberian war commanders).',
      },
    ],
    essayPrompts: [
      {
        prompt:
          '“In So the Path Does Not Die, Pede Hollist critiques harmful tradition without demonising African heritage.” Discuss with close reference to Baramusu, Pa Marah, and Finaba.',
        examPaper: 'WAEC Literature Paper 3 (African Prose)',
        markingPoints: [
          'M1 (Context & Plot): Contextualise Talaba’s Bondo/fafei rite, the earlier sister’s death, and Pa Marah’s taboo-breaking rescue.',
          'M2 (Character Contrast): Contrast Baramusu’s devotion to ancestral survival with Pa Marah’s protective love and Fina’s lifelong guilt.',
          'A1 (Synthesis): Show how Fina’s return to post-war Sierra Leone redefines “the path” as life-affirming heritage and youth empowerment.',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. REDEMPTION ROAD — ELMA SHAW (AFRICAN PROSE 2026–2030)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'redemption-road',
    title: 'Redemption Road',
    author: 'Elma Shaw',
    nationality: 'Liberian',
    category: 'african-prose',
    examBodies: ['WAEC', 'JAMB', 'NECO'],
    subjectId: 'lit',
    syllabusWindow: '2026–2030 Harmonized Syllabus',
    statusLabel: 'Prescribed African Prose (2026–2030)',
    artworkKey: 'african',
    setting: 'Monrovia & rebel forest base Camp Sande, Liberia (during and 10 years after the Civil War)',
    pointOfView: 'Third-person narration using non-linear flashbacks (in media res)',
    structureLabel: 'Post-Conflict Psychological & Legal Drama',
    logline:
      'Ten years after surviving captivity in a Liberian rebel camp, NGO director Bendu Lewis spots notorious warlord Commander Cobra walking free on the streets of Monrovia.',
    overview:
      'Set in Liberia a decade after the civil war, Elma Shaw’s Redemption Road opens at Grandmother Eva’s funeral and follows Bendu Lewis, founder of trauma-counselling NGO Peace in Practice (PIP). Though admired publicly, Bendu hides agonising wartime secrets from her captivity at Camp Sande under sadistic rebel leader Moses Varney (“Commander Cobra”). When Bendu spots Varney living openly in Monrovia with impunity, her pursuit of war-crimes prosecution forces her family, survivors like Tenneh, and Liberia itself onto a painful road toward truth, accountability, and healing.',
    chapters: [
      {
        number: 1,
        title: 'Stage 1: In Media Res — Monrovia Ten Years After the War',
        summary:
          'Opening ten years after ceasefire amid Grandmother Eva’s funeral, Bendu Lewis leads Peace in Practice (PIP), counselling war-scarred Liberian women and girls such as young Tenneh while hiding her own insomnia, survivor’s guilt, and estrangement from secrets of the war.',
        keyEvents: [
          'Grandmother Eva’s passing gathers the Lewis family (Bendu, sister Siatta, brother Terrance).',
          'Bendu runs Peace in Practice (PIP) in Monrovia to rehabilitate female war survivors.',
          'Beneath her composed leadership, Bendu suffers flashbacks and hides a child/captivity secret.',
        ],
        examTrap:
          'Note the narrative technique: Redemption Road opens IN MEDIA RES (ten years after the war) and reconstructs Camp Sande horrors through flashbacks.',
      },
      {
        number: 2,
        title: 'Stage 2: Sighting Commander Cobra (Moses Varney)',
        summary:
          'On a Monrovia street, Bendu freezes upon recognising Moses Varney—formerly “Commander Cobra”, the brutal rebel warlord who abducted, abused, and terrorised civilians at Camp Sande—now walking free, wealthy, and untouchable in post-war society.',
        keyEvents: [
          'Bendu spots Moses Varney (“Commander Cobra”) thriving in post-war Monrovia.',
          'Outrage over warlord impunity collides with fear of reopening buried trauma.',
          'Flashbacks reveal how Bendu was captured during the war and forced to become Cobra’s “bush wife” to survive.',
        ],
        examTrap:
          'Keep both names together: Commander Cobra’s real civilian name in post-war Monrovia is Moses Varney.',
      },
      {
        number: 3,
        title: 'Stage 3: Camp Sande Flashbacks & Buried Guilt',
        summary:
          'Harrowing flashbacks return to Camp Sande, exposing the atrocities inflicted on captives, the moral compromises forced upon victims merely to stay alive, and the secret child Bendu bore—explaining the silent gulf between Bendu, her family, and suitor Calvin.',
        keyEvents: [
          'Camp Sande’s reign of terror under Commander Cobra is laid bare.',
          'Survival required agonising compromises that left survivors burdened with misplaced shame.',
          'Young survivor Tenneh’s trauma mirrors the generational wounds across Liberia.',
        ],
        examTrap:
          'Shaw shows that war victims often carry false guilt for what they endured to survive, even though moral culpability belongs to perpetrators like Cobra.',
      },
      {
        number: 4,
        title: 'Stage 4: Seeking Legal Justice vs Fear of Retaliation',
        summary:
          'Determined that peace without accountability is hollow, Bendu gathers courage and allies to bring legal charges against Moses Varney despite threats, institutional weakness, and relatives who beg her to “let sleeping dogs lie”.',
        keyEvents: [
          'Bendu pursues legal prosecution against Varney rather than vigilante revenge or silent denial.',
          'Varney intimidates witnesses, testing the courage of PIP survivors and Bendu’s loved ones.',
          'Bendu confesses her full wartime truth to her family and Calvin.',
        ],
        examTrap:
          'Bendu chooses the rule of law and truth-telling—not personal violence—to confront Commander Cobra.',
      },
      {
        number: 5,
        title: 'Stage 5: Reckoning, Truth & the Road to Redemption',
        summary:
          'As secrets come into the open and Moses Varney’s impunity is shattered, Bendu experiences emotional release. Honest confession restores intimacy within her family and proves that true national and personal redemption begins only when hidden wounds are confronted truthfully.',
        keyEvents: [
          'Public exposure and legal confrontation strip Commander Cobra of untouchable power.',
          'Bendu reconciles with her past, her daughter/family ties, and her right to love again.',
          'Liberia’s post-war recovery is framed as an ongoing moral journey (“Redemption Road”).',
        ],
        examTrap:
          '“Redemption” in the title applies to survivors reclaiming wholeness from shame AND a nation confronting impunity through truth.',
      },
    ],
    characters: [
      {
        name: 'Bendu Lewis',
        role: 'Protagonist & Director of Peace in Practice (PIP)',
        traits: 'Courageous, empathetic, outwardly poised yet inwardly haunted',
        examNote:
          'Abducted to Camp Sande during the Liberian Civil War; leads the legal and moral fight to hold Commander Cobra accountable.',
      },
      {
        name: 'Moses Varney (“Commander Cobra”)',
        role: 'Antagonist & former rebel warlord',
        traits: 'Ruthless, arrogant, unrepentant, manipulative',
        examNote:
          'Symbolises post-war impunity in West Africa—war criminals enjoying wealth and freedom beside their traumatised victims.',
      },
      {
        name: 'Tenneh',
        role: 'Traumatised young war survivor counselled at PIP',
        traits: 'Fragile, scarred, gradually healing under Bendu’s care',
        examNote:
          'Illustrates the devastating impact of civil conflict on young girls and the necessity of trauma rehabilitation.',
      },
      {
        name: 'Siatta',
        role: 'Bendu’s sister',
        traits: 'Protective, domestic, initially cautious about reopening war wounds',
        examNote:
          'Highlights how war fractures communication even among loving siblings.',
      },
      {
        name: 'Calvin',
        role: 'Bendu’s patient, supportive partner/suitor',
        traits: 'Understanding, principled, steadfast',
        examNote:
          'Demonstrates compassionate partnership as Bendu finally shares the truth of her wartime past.',
      },
    ],
    themes: [
      {
        theme: 'Invisible Psychological Scars of War (PTSD)',
        analysis:
          'Even ten years after guns fall silent, nightmares, shame, and unspoken secrets haunt survivors like Bendu and Tenneh.',
        deviceConnection: 'Non-linear flashbacks intruding into present-day Monrovia.',
      },
      {
        theme: 'Justice, Impunity & Forgiveness',
        analysis:
          'Questions whether genuine peace can exist when warlords like Moses Varney walk free without facing truth or legal justice.',
        deviceConnection: 'Courtroom/activist conflict between Bendu and Varney.',
      },
      {
        theme: 'Women’s Resilience & Community Reconstruction',
        analysis:
          'Through Peace in Practice (PIP), women who suffered the worst wartime atrocities lead Liberia’s moral and emotional rebuilding.',
        deviceConnection: 'Symbolism of PIP as a sanctuary of collective healing.',
      },
      {
        theme: 'Truth-Telling as Liberation',
        analysis:
          'Secrecy imprisons Bendu in shame; speaking her truth aloud breaks Cobra’s psychological hold over her life.',
        deviceConnection: 'Metaphor of “Redemption Road” as an arduous journey out of silence.',
      },
    ],
    literaryDevices: [
      {
        device: 'In Media Res & Flashback',
        example:
          'Starts ten years post-war and alternates with Camp Sande memories to mirror how trauma invades the present.',
      },
      {
        device: 'Irony of Post-War Impunity',
        example:
          'Warlord Moses Varney lives comfortably in Monrovia while his victims struggle silently with nightmares and stigma.',
      },
      {
        device: 'Symbolism (“Redemption Road” & “Commander Cobra”)',
        example:
          '“Cobra” evokes venomous predatory terror; “Redemption Road” signifies the long process of justice and inner healing.',
      },
    ],
    questions: [
      {
        id: 'rr-q1',
        examTag: 'WAEC & JAMB · Setting & NGO',
        q: 'In Elma Shaw’s Redemption Road, what is the name of the Monrovia non-governmental organisation founded by Bendu Lewis to counsel war survivors?',
        o: [
          'Peace in Practice (PIP)',
          'Women of Camp Sande (WCS)',
          'Liberian Truth Forum (LTF)',
          'Stardom Relief Foundation',
        ],
        a: 0,
        explanation:
          'Bendu directs Peace in Practice (PIP), providing trauma counselling and empowerment to women and girls scarred by the Liberian Civil War.',
        trapNote: 'Camp Sande was the rebel forest base of captivity, NOT Bendu’s NGO!',
      },
      {
        id: 'rr-q2',
        examTag: 'WAEC & JAMB · Antagonist Identity',
        q: 'Which notorious rebel commander from Camp Sande does Bendu recognise living freely in post-war Monrovia under the civilian name Moses Varney?',
        o: ['Commander Cobra', 'General Scorpion', 'Colonel Viper', 'Major Zaki'],
        a: 0,
        explanation:
          'Moses Varney is the feared wartime rebel leader “Commander Cobra”, whose impunity in Monrovia ignites the central conflict.',
        trapNote: 'Examiners pair venomous look-alike nicknames (“Scorpion/Viper”)—lock onto Commander Cobra = Moses Varney.',
      },
      {
        id: 'rr-q3',
        examTag: 'WAEC & JAMB · Narrative Technique',
        q: 'Elma Shaw’s decision to open Redemption Road ten years after the Liberian Civil War and reveal Camp Sande events gradually illustrates the use of',
        o: [
          'in media res combined with psychological flashbacks',
          'epistolary narration written entirely in letters',
          'first-person child narration',
          'comic relief and farce',
        ],
        a: 0,
        explanation:
          'Beginning post-war (in media res) and cutting back to Camp Sande mirrors how unhealed war trauma repeatedly interrupts survivors’ present lives.',
        trapNote: 'Contrast this with To Kill a Mockingbird (first-person child perspective).',
      },
      {
        id: 'rr-q4',
        examTag: 'WAEC & JAMB · Theme of Justice',
        q: 'How does Bendu Lewis respond after discovering Moses Varney’s presence in Monrovia?',
        o: [
          'She overcomes fear and secrecy to pursue legal accountability and public truth against him',
          'She flees Liberia permanently to live anonymously in Washington D.C.',
          'She hires former fighters to ambush Varney outside his compound',
          'She closes Peace in Practice to protect her family’s reputation',
        ],
        a: 0,
        explanation:
          'Bendu confronts both societal silence and her own hidden shame to demand lawful justice.',
        trapNote: 'Do not mix up Bendu (stays in Monrovia to fight impunity) with Finaba (migrates to Washington D.C. in So the Path Does Not Die).',
      },
    ],
    essayPrompts: [
      {
        prompt:
          'Assess the tension between silent survival and legal justice in Elma Shaw’s Redemption Road.',
        examPaper: 'WAEC Literature Paper 3 (African Prose)',
        markingPoints: [
          'M1 (Post-War Context): Establish Monrovia ten years after ceasefire and the culture of silence allowing Moses Varney (“Commander Cobra”) to thrive.',
          'M2 (Psychological Conflict): Examine Bendu’s dual role as PIP healer and secret Camp Sande survivor alongside Tenneh’s trauma.',
          'A1 (Resolution): Show how confronting Varney through law and truth-telling unlocks personal and national redemption.',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. TO KILL A MOCKINGBIRD — HARPER LEE (NON-AFRICAN PROSE 2026–2030)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'mockingbird',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    nationality: 'American',
    category: 'non-african-prose',
    examBodies: ['WAEC', 'JAMB', 'NECO'],
    subjectId: 'lit',
    syllabusWindow: '2026–2030 Harmonized Syllabus',
    statusLabel: 'Prescribed Non-African Prose (2026–2030)',
    artworkKey: 'non-african',
    setting: 'Maycomb, Alabama, USA (1933–1935 during the Great Depression)',
    pointOfView: 'First-person retrospective narration through young Jean Louise (“Scout”) Finch',
    structureLabel: '2 Parts (31 Chapters)',
    logline:
      'In Depression-era Alabama, young Scout Finch watches her father Atticus risk everything in court to defend Tom Robinson, an innocent Black man falsely accused by Bob Ewell.',
    overview:
      'Prescribed for 2026–2030 Non-African Prose by WAEC and JAMB, Harper Lee’s classic links two unforgettable storylines in 1930s Maycomb, Alabama: Scout, Jem, and Dill’s childhood fascination with reclusive neighbour Arthur (“Boo”) Radley, and principled lawyer Atticus Finch’s courageous courtroom defence of Tom Robinson against fabricated rape charges by Bob and Mayella Ewell. Both plots converge on Atticus’s core moral rule—that it is a sin to kill a “mockingbird”, an innocent being who does nothing but bring harmless good.',
    chapters: [
      {
        number: 1,
        title: 'Part One (Chs. 1–6): Maycomb, Boo Radley & Atticus’s Empathy Lesson',
        summary:
          'Six-year-old Scout, her brother Jem (whose broken arm frames Chapter 1), and summer friend Dill dare one another around the shuttered Radley Place. At school, Scout defends impoverished Walter Cunningham Jr., and Atticus teaches her to “climb into another person’s skin and walk around in it”.',
        keyEvents: [
          'Introduction of Maycomb County, housekeeper Calpurnia, Dill Harris, and the Boo Radley legend.',
          'Mysterious gifts (chewing gum, Indian-head pennies, carved soap dolls) appear in the Radley oak tree knot-hole.',
          'Nathan Radley cements the knot-hole shut, claiming the healthy oak tree is dying.',
        ],
        examTrap:
          'Who left the carved soap figures in the oak tree? Arthur (“Boo”) Radley—quietly reaching out in friendship to Scout and Jem!',
      },
      {
        number: 2,
        title: 'Part One (Chs. 7–11): Snow, the Mad Dog & Mrs. Dubose’s Courage',
        summary:
          'Miss Maudie’s house catches fire on a freezing night (Boo secretly drapes a blanket over Scout’s shoulders). Atticus reveals why “it’s a sin to kill a mockingbird”, shoots rabid dog Tim Johnson in one shot, and makes Jem read to morphine-addicted Mrs. Dubose to learn true moral courage.',
        keyEvents: [
          'Miss Maudie Atkinson explains Atticus’s mockingbird rule: mockingbirds only make music and never harm crops.',
          'Atticus (“One-Shot Finch”) reluctantly shoots rabid dog Tim Johnson.',
          'Atticus defines real courage through Mrs. Dubose: knowing you’re licked before you begin, yet seeing it through.',
        ],
        examTrap:
          'Remember Atticus’s definition of real courage: NOT a man with a gun, but moral perseverance even when defeat seems certain (foreshadowing Tom Robinson’s trial!).',
      },
      {
        number: 3,
        title: 'Part Two (Chs. 12–16): Calpurnia’s Church & the Jailhouse Mob',
        summary:
          'Aunt Alexandra moves in to instil “gentlewoman” manners as racial hostility rises against Atticus for defending Tom Robinson. Outside Maycomb jail at night, Atticus sits unarmed before Walter Cunningham Sr.’s lynch mob—until Scout’s innocent conversation shames Mr. Cunningham into dispersing the crowd.',
        keyEvents: [
          'Calpurnia takes Jem and Scout to First Purchase African M.E. Church, where Reverend Sykes raises money for Tom’s wife Helen.',
          'Atticus guards Tom Robinson alone outside the county jail.',
          'Scout’s polite talk about Walter Jr. and entailments humanises the moment and breaks the mob mentality.',
        ],
        examTrap:
          'What disperses the lynch mob in Chapter 15? Scout’s innocent, personal conversation with Mr. Walter Cunningham Sr. (forcing him to stand in Atticus’s shoes)—NOT Sheriff Heck Tate’s gun!',
      },
      {
        number: 4,
        title: 'Part Two (Chs. 17–21): The Trial of Tom Robinson',
        summary:
          'In Judge Taylor’s packed courtroom, Atticus proves beyond doubt that Mayella Ewell was beaten on the right side of her face by a left-handed attacker—her father Bob Ewell—whereas Tom Robinson’s left arm was crippled in a childhood cotton-gin accident. Yet the all-white jury still convicts Tom.',
        keyEvents: [
          'Sheriff Heck Tate testifies no doctor was called and Mayella’s right eye was bruised.',
          'Atticus demonstrates Bob Ewell is ambidextrous/left-handed while Tom Robinson’s left arm is completely useless.',
          'Despite irrefutable truth, racial prejudice prevails; Black citizens stand silently in respect as Atticus exits.',
        ],
        examTrap:
          'Crucial forensic proof: Mayella’s bruises were on the RIGHT side of her face (dealt by a LEFT hand), and Tom Robinson’s LEFT arm was shrivelled and 12 inches shorter from a cotton gin!',
      },
      {
        number: 5,
        title: 'Part Two (Chs. 22–31): Tom’s Death & Boo Radley’s Halloween Rescue',
        summary:
          'Tom Robinson is shot seventeen times trying to escape prison, crushing Jem’s faith in justice. Spiteful Bob Ewell spits on Atticus and attacks Scout (in her wire ham pageant costume) and Jem under the dark oak on Halloween night—until silent Boo Radley rescues the children, Bob Ewell dies on his own/kitchen knife, and Sheriff Heck Tate protects shy Boo from publicity (“it’d be sort of like shootin’ a mockingbird”).',
        keyEvents: [
          'Bob Ewell vows revenge despite winning the verdict because Atticus exposed him as a liar.',
          'Scout’s chicken-wire ham costume deflects Ewell’s knife; Jem’s arm is broken in the struggle.',
          'Arthur (“Boo”) Radley carries injured Jem home; Scout walks Boo to his porch and finally sees Maycomb from his perspective.',
        ],
        examTrap:
          'Identify the TWO main symbolic “mockingbirds” in the novel: Tom Robinson (destroyed by racism) and Arthur “Boo” Radley (spared destructive limelight by Sheriff Heck Tate).',
      },
    ],
    characters: [
      {
        name: 'Jean Louise (“Scout”) Finch',
        role: 'Child protagonist & first-person narrator',
        traits: 'Tomboyish, outspoken, observant, morally growing',
        examNote:
          'Grows from quick-fisted six-year-old innocence to genuine empathy when standing on Boo Radley’s porch in Chapter 31.',
      },
      {
        name: 'Atticus Finch',
        role: 'Maycomb lawyer & widowed father of Jem and Scout',
        traits: 'Principled, calm, empathetic, egalitarian',
        examNote:
          'Maycomb’s moral conscience; defends Tom Robinson wholeheartedly despite racial backlash.',
      },
      {
        name: 'Tom Robinson',
        role: 'Hardworking Black field hand falsely accused of rape',
        traits: 'Compassionate, honest, dignified, physically disabled in his left arm',
        examNote:
          'Helps lonely Mayella Ewell out of pure kindness (“felt right sorry for her”); tragic mockingbird figure.',
      },
      {
        name: 'Arthur (“Boo”) Radley',
        role: 'Reclusive neighbour feared in childhood rumours',
        traits: 'Shy, gentle, protective, misunderstood',
        examNote:
          'Leaves gifts in the oak tree, covers Scout with a blanket during the fire, and saves Jem and Scout from Bob Ewell.',
      },
      {
        name: 'Bob Ewell',
        role: 'Antagonist; abusive, racist patriarch',
        traits: 'Vindictive, dishonest, cowardly, neglectful',
        examNote:
          'Beats his daughter Mayella, frames Tom Robinson to hide his shame, and ambushes two children in the dark.',
      },
      {
        name: 'Jeremy (“Jem”) Finch & Miss Maudie Atkinson',
        role: 'Scout’s older brother & wise neighbour',
        traits: 'Jem: idealistic & protective; Maudie: candid moral ally of Atticus',
        examNote:
          'Jem’s broken arm opens and closes the narrative frame; Miss Maudie unpacks the mockingbird symbol.',
      },
    ],
    themes: [
      {
        theme: 'Racial Injustice & Institutional Prejudice',
        analysis:
          'Tom Robinson’s conviction despite ironclad physical evidence exposes how entrenched racism corrupts law and jury duty in 1930s Alabama.',
        deviceConnection: 'Courtroom dramatic irony and the mockingbird symbol.',
      },
      {
        theme: 'Empathy & Moral Education',
        analysis:
          'Atticus teaches Scout and Jem to judge individuals by stepping into their skin, culminating in Scout viewing the street from Boo’s porch.',
        deviceConnection: 'Dual first-person voice (child’s immediate eye + adult Scout’s hindsight).',
      },
      {
        theme: 'Coexistence of Good and Evil (Loss of Innocence)',
        analysis:
          'Jem and Scout move from childhood faith in Maycomb’s goodness to witnessing human cruelty alongside quiet heroism.',
        deviceConnection: 'Bildungsroman & Gothic-to-realist transformation of the Radley house.',
      },
      {
        theme: 'True Moral Courage vs Physical Bravado',
        analysis:
          'Contrasts Atticus’s unarmed courtroom/jailhouse stand and Mrs. Dubose’s struggle with Bob Ewell’s cowardly violence.',
        deviceConnection: 'Contrast with the rabid dog Tim Johnson scene.',
      },
    ],
    literaryDevices: [
      {
        device: 'Central Symbolism (The Mockingbird)',
        example:
          'Innocent beings (Tom Robinson and Boo Radley) who do no harm and whose destruction or persecution is a moral sin.',
      },
      {
        device: 'Retrospective Child Point of View',
        example:
          'Scout’s naive childhood observations expose adult hypocrisy with disarming candour and gentle humour.',
      },
      {
        device: 'Framing Device',
        example:
          'Opens in Chapter 1 asking how Jem broke his arm and resolves that exact Halloween attack in Chapters 28–31.',
      },
    ],
    questions: [
      {
        id: 'tkam-q1',
        examTag: 'WAEC & JAMB · Courtroom Proof',
        q: 'During Tom Robinson’s trial in To Kill a Mockingbird, what physical evidence proves Tom could not have inflicted Mayella Ewell’s right-eye bruises?',
        o: [
          'Tom’s left arm was crippled in a childhood cotton-gin accident, whereas Bob Ewell is left-handed',
          'Tom was out of Maycomb working in Montgomery on November 21',
          'Sheriff Heck Tate produced a medical report clearing Tom completely',
          'Calpurnia testified that Tom was repairing pews at First Purchase Church',
        ],
        a: 0,
        explanation:
          'A blow to the right side of Mayella’s face came from a left-handed striker facing her; Tom’s left arm was shrivelled and useless, while Bob Ewell wrote with his left hand in court.',
        trapNote: 'Remember Heck Tate testified NO doctor was ever summoned—Atticus relied on left-hand physical proof.',
      },
      {
        id: 'tkam-q2',
        examTag: 'WAEC & JAMB · Central Symbolism',
        q: 'When Sheriff Heck Tate insists that dragging shy Boo Radley into public spotlight over Bob Ewell’s death “would be sort of like shootin’ a mockingbird”, he means',
        o: [
          'exposing a gentle, harmless rescuer to intrusive public attention would cruelly punish goodness',
          'Boo Radley would be convicted by a Maycomb jury just like Tom Robinson',
          'Atticus Finch broke Alabama hunting laws when shooting Tim Johnson',
          'Scout’s Halloween costume resembled a bird in the dark',
        ],
        a: 0,
        explanation:
          'Boo saved the children out of pure care; parading a painfully shy recluse before town gossip would violate Atticus’s own mockingbird ethic.',
        trapNote: 'Connect Heck Tate’s line directly to Miss Maudie and Atticus’s mockingbird principle.',
      },
      {
        id: 'tkam-q3',
        examTag: 'WAEC & JAMB · Conflict Resolution',
        q: 'What causes the lynch mob outside Maycomb jail to disperse peacefully in Chapter 15?',
        o: [
          'Scout recognises Mr. Walter Cunningham Sr. and speaks innocently about his son and legal entailments, awakening his empathy',
          'Sheriff Heck Tate fires a warning shot from the courthouse roof',
          'Jem threatens to fetch Judge Taylor and the National Guard',
          'Tom Robinson addresses the crowd from his cell window',
        ],
        a: 0,
        explanation:
          'Scout’s polite childhood friendliness pulls Walter Cunningham Sr. out of anonymous mob mentality and makes him stand in Atticus’s shoes.',
        trapNote:
          'Mr. Underwood had a shotgun hidden upstairs in his newspaper office, yet it was Scout’s innocent words—not weapons—that dispersed the mob.',
      },
      {
        id: 'tkam-q4',
        examTag: 'WAEC & JAMB · Character Foil',
        q: 'Why does Atticus Finch make Jem read aloud every afternoon to cantankerous Mrs. Henry Lafayette Dubose?',
        o: [
          'So Jem witnesses real moral courage—fighting morphine addiction before death despite knowing pain awaits',
          'To pay off a legal debt owed by the Finch family at Finch’s Landing',
          'Because Mrs. Dubose promised to testify in favour of Tom Robinson',
          'To punish Scout for fighting Walter Cunningham in the schoolyard',
        ],
        a: 0,
        explanation:
          'After Jem cuts Mrs. Dubose’s camellia bushes in anger at her slurs, Atticus uses her battle against morphine addiction to teach Jem non-violent moral fortitude.',
        trapNote: 'Notice the camellia flower Mrs. Dubose sends Jem after her death as a token of peace and courage.',
      },
    ],
    essayPrompts: [
      {
        prompt:
          'Discuss the significance of the “mockingbird” symbol in uniting the Boo Radley and Tom Robinson plots of Harper Lee’s To Kill a Mockingbird.',
        examPaper: 'WAEC Literature Paper 3 (Non-African Prose)',
        markingPoints: [
          'M1 (Symbolic Definition): Cite Atticus and Miss Maudie’s explanation that mockingbirds do no harm and only make music.',
          'M2 (Dual Application): Analyse Tom Robinson (innocent helper destroyed by racial prejudice) and Boo Radley (misjudged recluse who protects Jem and Scout).',
          'A1 (Structural Unity): Show how Halloween night merges both plots and completes Scout’s education in empathy.',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. PATH OF LUCAS: THE JOURNEY HE ENDURED — SUSANNE BELLEFEUILLE (2026–2030)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'path-of-lucas',
    title: 'Path of Lucas: The Journey He Endured',
    author: 'Susanne Bellefeuille',
    nationality: 'Canadian',
    category: 'non-african-prose',
    examBodies: ['WAEC', 'JAMB', 'NECO'],
    subjectId: 'lit',
    syllabusWindow: '2026–2030 Harmonized Syllabus',
    statusLabel: 'Prescribed Non-African Prose (2026–2030)',
    artworkKey: 'non-african',
    setting: 'Eastern Ontario, Canada (1950s rural roots to modern hospital vigil)',
    pointOfView: 'Hospital bedside frame narrative & intimate retrospective storytelling',
    structureLabel: 'Chronological Life Flashbacks Framed by Hospital Vigil',
    logline:
      'Keeping vigil beside the hospital bed of his comatose daughter Lucy, devoted Canadian father Lucas Clarkson recounts decades of love, grief, financial hardship, and unyielding family endurance.',
    overview:
      'Prescribed by WAEC and JAMB for 2026–2030 Non-African Prose, Susanne Bellefeuille’s poignant biographical-style novel opens in an intensive-care hospital room where Lucas Clarkson speaks tenderly to his unconscious daughter, Lucy. Hoping his voice will anchor her back to life, Lucas retraces his journey from mid-century Eastern Ontario through his deep romance and marriage with Isabelle, raising a large family amid economic setbacks, illness, and devastating personal losses—celebrating quiet paternal sacrifice and resilience.',
    chapters: [
      {
        number: 1,
        title: 'Stage 1: The Hospital Bedside Frame — Vigil for Lucy',
        summary:
          'At a hospital bedside in Ontario, aging father Lucas Clarkson sits beside his beloved daughter Lucy, who lies in a coma. Encouraged to talk to her because coma patients may still hear familiar voices, Lucas begins narrating his life story from the beginning.',
        keyEvents: [
          'Lucy’s sudden medical crisis and coma establish the emotional hospital frame.',
          'Lucas uses spoken memory as a lifeline of paternal love to reach his unconscious daughter.',
          'Present-day hospital monitors alternate with warm flashbacks to mid-20th-century Canada.',
        ],
        examTrap:
          'Memorise the framing device: Lucas is speaking at the bedside of his COMATOSE DAUGHTER LUCY (not writing a diary from prison or addressing a courtroom).',
      },
      {
        number: 2,
        title: 'Stage 2: Youth in Eastern Ontario & Courting Isabelle',
        summary:
          'Lucas recalls his hardworking rural upbringing in 1950s Eastern Ontario, early labour, and meeting Isabelle—the woman whose steadfast partnership becomes the emotional bedrock of his adult life.',
        keyEvents: [
          'Depiction of modest post-war Canadian family life and work ethic.',
          'Courtship and marriage between Lucas Clarkson and Isabelle.',
          'Shared dream of building a loving, tightly knit home despite limited means.',
        ],
        examTrap:
          'Keep the names clear: Lucas Clarkson is the father; Isabelle is his wife; Lucy is the comatose daughter.',
      },
      {
        number: 3,
        title: 'Stage 3: Raising a Family Through Economic & Health Storms',
        summary:
          'As Lucas and Isabelle welcome children, relentless trials test their marriage—job pressures, financial strain, farm/household setbacks, and repeated health scares—yet Lucas shoulders gruelling sacrifices without bitterness.',
        keyEvents: [
          'Lucas works tireless hours to shield Isabelle and the children from deprivation.',
          'Episodes of bereavement and illness test the family’s faith and unity.',
          'Lucas models gentle, emotionally present fatherhood rather than stoic detachment.',
        ],
        examTrap:
          'Notice how Bellefeuille portrays masculinity: Lucas’s strength lies in tenderness, fidelity, and domestic sacrifice, not aggression.',
      },
      {
        number: 4,
        title: 'Stage 4: Grief, Community Grace & Quiet Fortitude',
        summary:
          'When profound bereavement and sudden setbacks strike the Clarkson home, Lucas confronts grief with quiet dignity, leaning on faithful love and small acts of community kindness rather than despair.',
        keyEvents: [
          'Painful family losses deepen Lucas’s compassion and spiritual resilience.',
          'Isabelle’s steadfast companionship sustains the home through its darkest seasons.',
          'Lucas’s unspoken sacrifices become an enduring moral compass for his children.',
        ],
        examTrap:
          'Distinguish Lucas’s response to grief: he neither abandons his responsibilities nor hardens into bitterness—his endurance remains compassionate.',
      },
      {
        number: 5,
        title: 'Stage 5: Generational Memory, Healing & Endurance',
        summary:
          'Returning repeatedly to Lucy’s hospital room, Lucas’s recollections weave past endurance into present hope, affirming that unconditional family love outlasts every tragedy along life’s path.',
        keyEvents: [
          'Past lessons of survival give the Clarkson family strength at Lucy’s bedside.',
          'Memory functions as therapy for both father and family.',
          'The title “Path of Lucas” culminates as a testament to ordinary human fortitude.',
        ],
        examTrap:
          'The central conflict is human endurance against fate, illness, and hardship (man vs circumstance), sustained by family devotion.',
      },
    ],
    characters: [
      {
        name: 'Lucas Clarkson',
        role: 'Protagonist, devoted husband & bedside narrator',
        traits: 'Selfless, resilient, tender-hearted, hardworking, faithful',
        examNote:
          'Anchors the entire narrative; embodies quiet paternal heroism across decades of Canadian family life.',
      },
      {
        name: 'Lucy',
        role: 'Lucas and Isabelle’s comatose daughter',
        traits: 'Cherished daughter whose crisis prompts the retrospective vigil',
        examNote:
          'Serves as the silent listener and emotional catalyst of the novel’s frame structure.',
      },
      {
        name: 'Isabelle Clarkson',
        role: 'Lucas’s beloved wife and lifelong partner',
        traits: 'Loving, nurturing, steadfast through poverty and grief',
        examNote:
          'Co-pilots the Clarkson household; her bond with Lucas illustrates enduring marital solidarity.',
      },
    ],
    themes: [
      {
        theme: 'Unconditional Paternal Love & Devotion',
        analysis:
          'Lucas’s tireless hospital vigil and lifelong sacrifices foreground the depth of a father’s emotional bond with his children.',
        deviceConnection: 'Direct bedside address and frame narrative.',
      },
      {
        theme: 'Resilience & Endurance Through Adversity',
        analysis:
          'Tracks how ordinary working families survive financial blows, illness, and grief without surrendering hope or kindness.',
        deviceConnection: 'Titular metaphor “Path of Lucas: The Journey He Endured”.',
      },
      {
        theme: 'Healing Power of Memory & Storytelling',
        analysis:
          'Recounting shared family history sustains Lucas during Lucy’s coma and binds generations together.',
        deviceConnection: 'Chronological flashbacks nested inside hospital vigils.',
      },
    ],
    literaryDevices: [
      {
        device: 'Frame Narrative (Hospital Vigil)',
        example:
          'Lucy’s coma room opens, punctuates, and closes Lucas’s decades-spanning life recollections.',
      },
      {
        device: 'Flashback & Chronological Retrospective',
        example:
          'Moves from 1950s Ontario youth through marriage, parenthood, and maturity.',
      },
      {
        device: 'Path / Journey Metaphor',
        example:
          'Life’s unpredictable hardships are figured as a rugged road endured step by step through love.',
      },
    ],
    questions: [
      {
        id: 'pol-q1',
        examTag: 'WAEC & JAMB · Frame Structure',
        q: 'What immediate situation frames Lucas Clarkson’s retrospective storytelling in Susanne Bellefeuille’s Path of Lucas?',
        o: [
          'He sits at a hospital bedside speaking to his comatose daughter, Lucy',
          'He testifies before an Ontario agricultural commission to save his family farm',
          'He writes farewell letters aboard a ship emigrating from Europe to Canada',
          'He addresses his grandchildren at his golden wedding anniversary banquet',
        ],
        a: 0,
        explanation:
          'Lucy’s coma in the hospital serves as the framing situation: Lucas narrates his life and family memories beside her bed to keep her connected to life.',
        trapNote: 'Always anchor Path of Lucas questions to the hospital coma vigil for Lucy.',
      },
      {
        id: 'pol-q2',
        examTag: 'WAEC & JAMB · Setting & Relationships',
        q: 'Where is Path of Lucas primarily set, and who is Lucas Clarkson’s lifelong wife?',
        o: [
          'Eastern Ontario, Canada — Isabelle',
          'Maycomb, Alabama — Mayella',
          'Nova Scotia, Canada — Edna',
          'Montreal, Quebec — Seri',
        ],
        a: 0,
        explanation:
          'The novel unfolds in Eastern Ontario, Canada, tracing Lucas’s enduring marriage to Isabelle.',
        trapNote: 'Keep the two Non-African prose settings distinct: Alabama USA (Mockingbird) vs Eastern Ontario Canada (Path of Lucas).',
      },
      {
        id: 'pol-q3',
        examTag: 'WAEC & JAMB · Characterisation',
        q: 'In Path of Lucas: The Journey He Endured, Lucas Clarkson’s character is primarily celebrated for',
        o: [
          'quiet paternal sacrifice, marital fidelity, and steadfast endurance through family trials',
          'political activism against racial segregation in North American courts',
          'accumulating vast industrial wealth after abandoning rural life',
          'solving a mysterious neighbourhood crime from his youth',
        ],
        a: 0,
        explanation:
          'Bellefeuille elevates ordinary domestic heroism—a father’s tender loyalty, hard work, and resilience across decades of hardship.',
        trapNote: 'Courtroom civil-rights activism belongs to Atticus Finch in To Kill a Mockingbird.',
      },
    ],
    essayPrompts: [
      {
        prompt:
          'Examine how Susanne Bellefeuille uses the hospital bedside frame to highlight paternal devotion and resilience in Path of Lucas: The Journey He Endured.',
        examPaper: 'WAEC Literature Paper 3 (Non-African Prose)',
        markingPoints: [
          'M1 (Frame Mechanics): Explain how Lucy’s coma motivates Lucas’s spoken recollections and creates emotional urgency.',
          'M2 (Life Trials): Trace Lucas and Isabelle’s partnership across 1950s–present Ontario hardships, work, and family crises.',
          'A1 (Thematic Impact): Conclude on how memory and gentle fatherhood turn suffering into dignified endurance.',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. SECOND CLASS CITIZEN — BUCHI EMECHETA (AFRICAN PROSE CLASSIC)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'second-class-citizen',
    title: 'Second Class Citizen',
    author: 'Buchi Emecheta',
    nationality: 'Nigerian',
    category: 'african-prose',
    examBodies: ['WAEC', 'NECO', 'JAMB'],
    subjectId: 'lit',
    syllabusWindow: 'WAEC / NECO & UTME African Prose Classic',
    statusLabel: 'African Prose Revision Classic',
    artworkKey: 'african',
    setting: 'Ibuza & Lagos (Nigeria) and North London (United Kingdom, 1960s)',
    pointOfView: 'Third-person limited narration closely aligned with Adah Ofili',
    structureLabel: '13 Chapters',
    logline:
      'Defying patriarchal neglect in Lagos and both racist landlords and an abusive husband in 1960s London, Adah Ofili fights for education, authorship, and her children’s future.',
    overview:
      'Buchi Emecheta’s semi-autobiographical classic follows Adah Ofili, an Igbo girl in Lagos who sneaks herself into school after her family prioritises her younger brother Boy. Winning a scholarship to Methodist Girls’ High School and working as a first-class librarian in Lagos, Adah marries student Francis Obi and joins him in London—only to discover cramped racist tenements, neglectful childminder Trudy, and Francis’s violent jealousy culminating in the burning of her first novel manuscript, The Bride Price.',
    chapters: [
      {
        number: 1,
        title: 'Chs. 1–2: Lagos Childhood, Pa’s Death & Sneaking into School',
        summary:
          'Born when her parents hoped for a boy, eight-year-old Adah runs to Mr. Cole’s Methodist school on her own. After her father (Pa) dies, she endures harsh servitude in Uncle Vincent’s house while Boy is pampered, yet risks severe punishment by using two shillings of market money to sit and win the secondary scholarship exam.',
        keyEvents: [
          'Adah’s childhood dream of the United Kingdom and determination to be educated.',
          'Pa dies early; Ma is inherited and Boy’s schooling takes priority.',
          'Adah endures 103 strokes from Cousin Vincent over the exam fee, then wins the scholarship to Methodist Girls’ High School.',
        ],
        examTrap:
          'Remember how Adah funded her Common Entrance registration: she secretly used the two-shilling market money meant for meat and endured Vincent’s cane without regret!',
      },
      {
        number: 2,
        title: 'Chs. 3–4: Methodist Girls’ High School, Francis & American Consulate Library',
        summary:
          'Needing a home base to continue studying, teenage Adah marries accounting student Francis Obi (without bride price, angering her kin) and secures a prestigious, well-paid post at the American Consulate Library in Lagos, funding Francis’s studies in London.',
        keyEvents: [
          'Adah earns middle-class “first-class” comfort in Lagos at the American Consulate Library.',
          'Francis travels ahead to London while Adah supports his in-laws and saves for passage.',
          'Adah persuades her reluctant in-laws to let her sail to England with her children Titi and Vicky.',
        ],
        examTrap:
          'Irony alert: In Nigeria, educated Adah enjoyed elite status; moving to her dreamland Britain demotes her to a “second-class citizen”!',
      },
      {
        number: 3,
        title: 'Chs. 5–6: Arrival in Britain & Ashdown Street “No Coloureds”',
        summary:
          'Arriving in cold, grey Liverpool and London, Adah is shocked by Francis’s single cramped room on Ashdown Street and his blunt warning that Black immigrants must accept second-class status. Refusing factory drudgery, Adah secures a library job at North Finchley Library.',
        keyEvents: [
          '“No Coloureds” housing signs confine Black immigrant families to squalid tenements.',
          'Francis adopts a defeatist, patriarchal posture while expecting Adah to fund the household.',
          'Adah defies defeatism by winning a professional post at North Finchley Library.',
        ],
        examTrap:
          'Notice the contrast: Francis accepts second-class identity passively, whereas Adah refuses factory work and fights for professional dignity.',
      },
      {
        number: 4,
        title: 'Chs. 7–8: Trudy’s Neglect, Vicky’s Meningitis & Maternal Courage',
        summary:
          'While Adah works to support the family, unscrupulous childminder Trudy neglects Titi and Vicky in filthy conditions until little Vicky contracts viral meningitis and nearly dies—forcing Adah to confront Trudy’s lies and fight fiercely for decent housing and healthcare.',
        keyEvents: [
          'Vicky falls gravely ill with viral meningitis due to Trudy’s unsanitary backyard.',
          'Adah exposes Trudy’s falsehoods before the Child Welfare Officer.',
          'Adah navigates lonely hospital births and racial condescension with fierce maternal devotion.',
        ],
        examTrap:
          'What illness nearly killed little Vicky due to Trudy’s unsanitary care? Viral meningitis!',
      },
      {
        number: 5,
        title: 'Chs. 9–10: Chalk Farm Library, Bill & Writing “The Bride Price”',
        summary:
          'Despite repeated pregnancies and Francis’s chronic exam failures and abuse, Adah finds intellectual refuge among warm colleagues like Canadian librarian Bill and Peggy, discovering African literature and pouring her soul into writing her debut novel, The Bride Price.',
        keyEvents: [
          'Bill introduces Adah to Chinua Achebe, Flora Nwapa, and James Baldwin.',
          'Library colleagues celebrate Adah’s handwritten novel manuscript, The Bride Price.',
          'Authorship becomes Adah’s “brainchild” and symbol of self-worth.',
        ],
        examTrap:
          'Bill (the Canadian colleague at the library) is the pivotal mentor who encourages Adah’s literary voice and calls her manuscript genuine literature.',
      },
      {
        number: 6,
        title: 'Chs. 11–13: The Burnt Manuscript & Clerkenwell Courtroom Liberation',
        summary:
          'Consumed by bitter jealousy, Francis burns Adah’s manuscript of The Bride Price and ridicules her ambition—shattering the last thread of their marriage. Adah leaves with her children, wins legal custody and protection in Clerkenwell court, and meets old acquaintance Mr. Chima as she claims her freedom.',
        keyEvents: [
          'Francis burns Adah’s handwritten novel, declaring a Black woman cannot be a writer.',
          'Adah walks out permanently with her children to protect both her family and her voice.',
          'In Clerkenwell court, Francis denies their marriage, paradoxically freeing Adah to start anew.',
        ],
        examTrap:
          'What is the final straw that makes Adah leave Francis permanently? Burning her manuscript The Bride Price (“killing her brainchild”)—followed by his violent assault after she moves out.',
      },
    ],
    characters: [
      {
        name: 'Adah Ofili',
        role: 'Protagonist, librarian, mother & aspiring novelist',
        traits: 'Brilliant, industrious, resilient, protective mother',
        examNote:
          'Overcomes Igbo patriarchal bias, British housing racism, and domestic abuse to claim independence.',
      },
      {
        name: 'Francis Obi',
        role: 'Adah’s parasitic and abusive husband',
        traits: 'Insecure, lazy, patriarchal, cruel, dependent',
        examNote:
          'Fails cost-and-works accounting exams repeatedly, exploits Adah’s income, and burns her manuscript.',
      },
      {
        name: 'Boy',
        role: 'Adah’s younger brother',
        traits: 'Privileged solely by male birthright',
        examNote:
          'Embodies traditional son-preference in colonial Lagos.',
      },
      {
        name: 'Trudy',
        role: 'Neglectful London daily childminder',
        traits: 'Deceitful, slovenly, irresponsible',
        examNote:
          'Exposes how racist housing/childcare barriers endanger immigrant children like Vicky.',
      },
      {
        name: 'Bill',
        role: 'Kind Canadian colleague at Chalk Farm Library',
        traits: 'Encouraging, literary-minded, egalitarian',
        examNote:
          'Nurtures Adah’s confidence as a writer and calls her manuscript her “brainchild”.',
      },
    ],
    themes: [
      {
        theme: 'Patriarchy & Son-Preference',
        analysis:
          'From Lagos schooling to Francis’s marital tyranny, women are treated as economic assets rather than autonomous minds.',
        deviceConnection: 'Contrast between Adah’s brilliance and Francis’s mediocrity.',
      },
      {
        theme: 'Immigrant Disillusionment & Racism',
        analysis:
          'Shatters the colonial myth of London as “heaven”, exposing colour-bar landlords and second-class treatment.',
        deviceConnection: 'Ironic title Second Class Citizen.',
      },
      {
        theme: 'Education & Writing as Female Emancipation',
        analysis:
          'Library qualifications pay the rent, and creative writing births Adah’s psychological freedom.',
        deviceConnection: 'Symbolism of The Bride Price manuscript as Adah’s “brainchild”.',
      },
    ],
    literaryDevices: [
      {
        device: 'Situational Irony',
        example:
          'Moving from Lagos to London lowers Adah’s social standing from middle-class librarian to “second-class” tenant.',
      },
      {
        device: 'Symbolism (The Presence & The Brainchild)',
        example:
          '“The Presence” symbolises Adah’s inner creative drive; the burnt manuscript symbolises her assaulted identity.',
      },
    ],
    questions: [
      {
        id: 'scc-q1',
        examTag: 'WAEC & JAMB · Climax',
        q: 'In Buchi Emecheta’s Second Class Citizen, what callous act by Francis finally compels Adah to end their marriage?',
        o: [
          'He burns the handwritten manuscript of her first novel, The Bride Price',
          'He sends Titi and Vicky back to Ibuza without Adah’s consent',
          'He resigns from North Finchley Library on Adah’s behalf',
          'He sells her Methodist Girls’ High School scholarship certificate',
        ],
        a: 0,
        explanation:
          'Adah views her manuscript The Bride Price as her “brainchild”; when Francis burns it in spite, her remaining loyalty to the marriage dies.',
        trapNote: 'Remember the exact title of Adah’s burnt manuscript: The Bride Price.',
      },
      {
        id: 'scc-q2',
        examTag: 'WAEC & JAMB · Plot Detail',
        q: 'Which life-threatening illness does Adah’s son Vicky contract while under childminder Trudy’s neglectful care in London?',
        o: ['Viral meningitis', 'Tuberculosis', 'Yellow fever', 'Poliomyelitis'],
        a: 0,
        explanation:
          'Playing in dirty rubbish behind Trudy’s house, Vicky falls critically ill with viral meningitis at Royal Free Hospital.',
        trapNote: 'Examiners test exact medical/plot details from the London chapters.',
      },
    ],
    essayPrompts: [
      {
        prompt:
          'Show how education serves as Adah Ofili’s primary weapon against both African patriarchy and British racism in Second Class Citizen.',
        examPaper: 'WAEC Literature Paper 3 (African Prose)',
        markingPoints: [
          'M1: Trace Adah’s childhood fight for schooling in Lagos (Mr. Cole’s class, scholarship despite 103 cane strokes).',
          'M2: Contrast Adah’s white-collar library employment in Lagos and London with Francis’s dependency.',
          'A1: Analyse authorship (The Bride Price) and her courtroom emancipation.',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. UNEXPECTED JOY AT DAWN — ALEX AGYEI-AGYIRI (AFRICAN PROSE CLASSIC)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'unexpected-joy',
    title: 'Unexpected Joy at Dawn',
    author: 'Alex Agyei-Agyiri',
    nationality: 'Ghanaian',
    category: 'african-prose',
    examBodies: ['WAEC', 'NECO', 'JAMB'],
    subjectId: 'lit',
    syllabusWindow: 'WAEC / NECO & UTME African Prose Classic',
    statusLabel: 'African Prose Revision Classic',
    artworkKey: 'african',
    setting: 'Accra (Ghana) & Lagos / Illere (Nigeria) during 1969 & 1983 Aliens Expulsions',
    pointOfView: 'Third-person omniscient alternating between Accra and Lagos plotlines',
    structureLabel: '2 Parts',
    logline:
      'Separated for fourteen years by West African “Aliens Must Go” expulsion decrees, siblings Mama Orojo in Lagos and Moses Nii Tackie in Accra risk borders and xenophobia to reunite at dawn.',
    overview:
      'Alex Agyei-Agyiri’s Pan-African novel indicts state-sponsored xenophobia across West Africa—tracing the 1969 Ghana Compliance Order that drove Mama Orojo to Nigeria while leaving her brother Moses Nii Tackie behind in Accra, and the 1983 Nigerian expulsion that forces desperate Nii (carrying tribal marks yet raised Ghanaian) onto a harrowing journey to Lagos. Amid corrupt immigration officers, gold-ring fraudsters, and religious zealotry, the siblings miraculously reunite at dawn.',
    chapters: [
      {
        number: 1,
        title: 'Part I (Early): Accra Hardship, Expense Bank & Nii’s Identity Crisis',
        summary:
          'Assistant bank manager Moses Nii Tackie struggles under harsh economic controls at Expense Bank in Accra. Though born and raised in Ghana with a Ga name, Nii bears Yoruba tribal marks and Nigerian parentage from the 1969 Compliance Order split, leaving him vulnerable to xenophobia.',
        keyEvents: [
          'Economic collapse in early-1980s Ghana erodes bank salaries and fuels hostility toward foreigners.',
          'Expense Bank rejects inventor Aaron Tsuru’s Ant Hill brick project despite Nii’s sympathy.',
          'Nii’s Yoruba facial marks haunt him whenever Ghanaian authorities hunt undocumented “aliens”.',
        ],
        examTrap:
          'Irony of Nii’s identity: In Ghana he fears exposure as a Nigerian “alien” because of his Yoruba tribal marks; when he reaches Nigeria, officials treat him as an illegal Ghanaian alien because he speaks Ga/English without Yoruba!',
      },
      {
        number: 2,
        title: 'Part I (Mid): Massa’s Illness, Tragic Loss & Decision to Leave Ghana',
        summary:
          'Nii devotes himself to nursing his gravely ill partner Massa Awosika, taking her on a desperate journey toward spiritual healing. Following Massa’s heartbreaking death and mounting economic despair, Nii decides to cross the border to Nigeria to find his long-lost sister.',
        keyEvents: [
          'Massa’s tender Pan-African ideals contrast sharply with state xenophobia.',
          'Massa dies tragically during the journey for treatment, devastating Nii.',
          'Grief-stricken Nii resolves to leave Accra and search for his family roots in Lagos.',
        ],
        examTrap:
          'Remember Massa Awosika’s role: her illness and tragic death sever Nii’s last emotional anchor in Accra, triggering his overland journey to Nigeria.',
      },
      {
        number: 3,
        title: 'Part I (Late): Mama Orojo, Amen Kristi & The Gold Fraud in Ghana',
        summary:
          'In Illere, Lagos, prosperous businesswoman and Amen Kristi evangelist Mama Orojo travels to Ghana to trace her brother Nii. Along the way, conman “I-Put-It-To-You” dupes her with a fake gold ring before honest Ghanaian miner Joe (Billy) wins her trust and heart.',
        keyEvents: [
          'Mama Orojo thrived in Nigeria after surviving Ghana’s 1969 Compliance Order.',
          'Fraudster “I-Put-It-To-You” swindles her in a bogus gold-ring transaction.',
          'Honest Ghanaian businessman Joe helps Mama search for Nii and travels back toward Lagos with her.',
        ],
        examTrap:
          'Dramatic timing irony: Mama flies TO Accra searching for Nii at the very time Nii is trekking FROM Ghana to Lagos!',
      },
      {
        number: 4,
        title: 'Part II (Early): 1983 “Aliens Must Go”, Hajj Camp & Cassava Farm',
        summary:
          'Reaching Lagos amid Nigeria’s 1983 expulsion order without Yoruba fluency or residency papers, Nii and fellow Ghanaian Aaron Tsuru are rounded up, detained at the chaotic Hajj deportation camp, and exploited as desperate labourers on a harsh cassava farm.',
        keyEvents: [
          'Immigrants endure extortion, hunger, and fear at the Ijora/Hajj deportation camp.',
          'Nii’s inability to speak Yoruba undermines his claim to Nigerian ancestry.',
          'Nii and Aaron flee exploitative labour on a cassava plantation while evading corrupt guards.',
        ],
        examTrap:
          'Both 1969 (Ghana Compliance Order) and 1983 (Nigeria “Aliens Must Go”) mirror each other—showing xenophobia as a shared regional tragedy rather than one country’s fault.',
      },
      {
        number: 5,
        title: 'Part II (Climax): Sahm’s Fanatics, Aaron’s Death & Dawn Reunion in Illere',
        summary:
          'After sectarian violence by Sahm’s fanatics and the tragic death of Aaron Tsuru during a desperate rooftop escape, exhausted Nii takes refuge in a compound in Illere at dawn—where Mama Orojo recognises his tribal marks and heritage, turning terror into unexpected joy.',
        keyEvents: [
          'Aaron Tsuru dies tragically while trying to escape pursuit from an uncompleted building.',
          'Hunted and exhausted, Nii slips into Mama Orojo’s compound at daybreak.',
          'Mama Orojo and Joe recognise Nii, uniting Nigerian and Ghanaian destinies at dawn.',
        ],
        examTrap:
          'Aaron Tsuru (inventor of the Ant Hill brick project rejected by Expense Bank) dies tragically leap-escaping a storey building before reaching the dawn reunion.',
      },
    ],
    characters: [
      {
        name: 'Moses Nii Tackie',
        role: 'Dual-heritage protagonist & assistant manager at Expense Bank, Accra',
        traits: 'Resilient, compassionate, caught between two nationalities',
        examNote:
          'Has Nigerian (Orojo) parentage and Yoruba facial marks but Ghanaian upbringing—exposing arbitrary colonial borders.',
      },
      {
        name: 'Mama Orojo',
        role: 'Nii’s elder sister, prosperous Illere businesswoman & Amen Kristi member',
        traits: 'Industrious, devout, loyal to family bloodlines',
        examNote:
          'Overcomes initial anti-alien prejudice by falling in love with Ghanaian Joe and tirelessly seeking Nii.',
      },
      {
        name: 'Joe',
        role: 'Ghanaian gold businessman (“Daga” mining) & Mama Orojo’s fiancé',
        traits: 'Resourceful, loyal, cross-border bridge-builder',
        examNote:
          'His union with Nigerian Mama Orojo symbolises genuine ECOWAS/West African brotherhood.',
      },
      {
        name: 'Massa Awosika',
        role: 'Nii’s young, Pan-Africanist partner in Accra',
        traits: 'Idealistic, loving, tragically frail',
        examNote:
          'Voices the novel’s Pan-African vision that all Africans share one destiny before dying at twenty-two.',
      },
      {
        name: 'Aaron Tsuru',
        role: 'Brilliant Ghanaian soil scientist & Nii’s fellow traveller',
        traits: 'Innovative, persistent, tragic victim of state neglect',
        examNote:
          'Creator of the Ant Hill brick innovation; perishes in Lagos while fleeing deportation arrest.',
      },
    ],
    themes: [
      {
        theme: 'Xenophobia & Artificial Colonial Borders',
        analysis:
          'Condemns retaliatory 1969 Ghanaian and 1983 Nigerian expulsion decrees that turned West African neighbours into hunted “aliens”.',
        deviceConnection: 'Parallel settings (Accra & Lagos) and Nii’s dual rejection.',
      },
      {
        theme: 'Crisis of National Identity',
        analysis:
          'Nii Tackie is “too Nigerian” in Ghana (tribal marks) and “too Ghanaian” in Nigeria (language/accent), proving citizenship is deeper than bureaucracy.',
        deviceConnection: 'Situational irony and facial-mark symbolism.',
      },
      {
        theme: 'Family Loyalty & Pan-African Reconciliation',
        analysis:
          'Mama Orojo’s marriage to Ghanaian Joe and her dawn reunion with Nii triumph over state hatred.',
        deviceConnection: 'Climactic dawn symbolism.',
      },
    ],
    literaryDevices: [
      {
        device: 'Parallel / Alternating Plot Structure',
        example:
          'Cuts back and forth between Nii’s ordeal from Accra and Mama Orojo’s search from Lagos until both lines collide at dawn.',
      },
      {
        device: 'Situational & Dramatic Irony',
        example:
          'A blood-born Nigerian (Nii) is detained at Lagos Hajj camp as an illegal Ghanaian alien.',
      },
    ],
    questions: [
      {
        id: 'ujd-q1',
        examTag: 'WAEC & JAMB · Irony of Identity',
        q: 'Why is Moses Nii Tackie ironically treated as an illegal “alien” upon arriving in Nigeria in Unexpected Joy at Dawn?',
        o: [
          'Despite his Nigerian parentage and Yoruba tribal marks, he speaks Ghanaian languages and lacks Nigerian papers or Yoruba fluency',
          'Immigration Officer Paleo discovers he forged an Expense Bank passport in Accra',
          'Mama Orojo publicly disowns him at the Amen Kristi church crusade',
          'He refuses to declare gold bars belonging to Joe at Seme border',
        ],
        a: 0,
        explanation:
          'Raised in Ghana after his family split, Nii cannot speak Yoruba or prove Nigerian residency during the 1983 expulsion clampdown, despite his Yoruba facial marks.',
        trapNote: 'This double-alienation is the central irony of Agyei-Agyiri’s novel.',
      },
      {
        id: 'ujd-q2',
        examTag: 'WAEC & JAMB · Historical Backdrop',
        q: 'Which two historical West African policies form the socio-political backdrop of Unexpected Joy at Dawn?',
        o: [
          'Ghana’s 1969 Aliens Compliance Order and Nigeria’s 1983 expulsion of undocumented immigrants',
          'The 1914 Amalgamation of Nigeria and the 1957 Ghanaian Independence Act',
          'The Liberian Civil War ceasefire and the Sierra Leonean Lomé Peace Accord',
          'The formation of ECOWAS in 1975 and the introduction of the Naira in 1973',
        ],
        a: 0,
        explanation:
          'The 1969 Ghanaian expulsion separated Mama Orojo from Nii, and the 1983 Nigerian “Aliens Must Go” order traps Nii upon reaching Lagos.',
        trapNote: 'Keep West African historical backdrops distinct across novels (Liberia = Redemption Road; Ghana/Nigeria 1969/1983 = Unexpected Joy at Dawn).',
      },
      {
        id: 'ujd-q3',
        examTag: 'WAEC & JAMB · Character & Sub-Plot',
        q: 'What scientific innovation did Aaron Tsuru struggle to fund at Expense Bank in Accra before trekking to Nigeria with Nii?',
        o: [
          'The Ant Hill low-cost housing brick project',
          'A solar-powered cocoa dryer in Kumasi',
          'An offshore oil-drilling rig in Takoradi',
          'A mechanized cassava-peeling factory in Illere',
        ],
        a: 0,
        explanation:
          'Aaron Tsuru invented a durable, affordable Ant Hill brick technique for housing, but bureaucratic Expense Bank rejected his loan application.',
        trapNote: 'Aaron’s wasted brilliance highlights how economic mismanagement drives brain drain across West Africa.',
      },
      {
        id: 'ujd-q4',
        examTag: 'WAEC & JAMB · Resolution',
        q: 'Where does the final “unexpected joy at dawn” reunion between Moses Nii Tackie and his sister Mama Orojo occur?',
        o: [
          'At Mama Orojo and Joe’s uncompleted/residential compound in Illere, Nigeria, as Nii flees in terror at dawn',
          'Inside the banking hall of Expense Bank in Accra',
          'At Kotoka International Airport VIP lounge',
          'Inside the courtroom of the Lagos High Court',
        ],
        a: 0,
        explanation:
          'Exhausted and pursued as a suspected thief/alien at dawn in Illere, Nii stumbles into Mama Orojo and Joe’s property, where sister and brother recognise their shared Orojo heritage.',
        trapNote: 'Notice how Agyei-Agyiri brings the two alternating plot threads together physically in the final chapter.',
      },
    ],
    essayPrompts: [
      {
        prompt:
          '“Moses Nii Tackie is a stranger in two homelands.” Discuss how Alex Agyei-Agyiri uses Nii’s plight to critique xenophobia in Unexpected Joy at Dawn.',
        examPaper: 'WAEC Literature Paper 3 (African Prose)',
        markingPoints: [
          'M1: Explain the 1969 and 1983 expulsion policies separating Nii in Accra and Mama Orojo in Lagos.',
          'M2: Detail Nii’s double alienation—Yoruba tribal marks in Ghana vs lack of Yoruba speech/papers at Lagos Hajj camp and cassava farms.',
          'A1: Show how Joe + Mama’s love and the dawn sibling reunion champion Pan-African humanity.',
        ],
      },
    ],
  },
];
