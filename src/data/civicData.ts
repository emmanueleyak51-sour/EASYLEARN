import type {
  Beat,
  IdeaBeat,
  InteractiveLesson,
  TeachBeat,
  TeachBlock,
  Topic,
} from '../types';
import { perm } from '../utils/engine';
import { CIVIC_NERDC_MAP } from './civicNerdc2027';
import { CIVIC_TOPICS_PART1 } from './civicTopicsPart1';
import { CIVIC_TOPICS_PART2 } from './civicTopicsPart2';
import { CIVIC_TOPICS_PART3 } from './civicTopicsPart3';

interface CivicTableSpec {
  title: string;
  headers: string[];
  rows: string[][];
}

const CIVIC_TEACH_TABLES: Record<string, CivicTableSpec> = {
  'cv-values': {
    title: 'Core National Values: Integrity, Probity, Contentment & Discipline',
    headers: ['Value', 'Precise Civic Meaning', 'Key Distinction'],
    rows: [
      ['Integrity', 'Unwavering adherence to moral truth even without supervision', 'Consistency between public words and private conduct'],
      ['Probity', 'Strict financial and administrative uprightness over public assets', 'Prevents contract inflation, kickbacks, and treasury leakage'],
      ['Contentment', 'Satisfaction with lawful earnings while working for honest progress', 'Never confuse with laziness or complacency'],
      ['Self-Discipline', 'Internal self-control, moderation, and voluntary rule obedience', 'Endures in private unlike externally forced compliance'],
    ],
  },
  'cv-selflessness': {
    title: 'Selflessness, Philanthropy & Community Service',
    headers: ['Concept', 'Civic Expression', 'Societal Impact'],
    rows: [
      ['Altruism / Selflessness', 'Prioritizing collective welfare above narrow personal gain', 'Builds trust, solidarity, and disaster resilience'],
      ['Community Development', 'Grassroots self-help projects (boreholes, clinics, sanitation)', 'Complements state infrastructure and fosters ownership'],
      ['Volunteering (NYSC / Red Cross)', 'Unpaid civic service across regions and emergencies', 'Bridges ethnic divides and saves vulnerable lives'],
    ],
  },
  'cv-hiv': {
    title: 'HIV / AIDS Transmission vs Safe Everyday Contact',
    headers: ['Confirmed Transmission Routes', 'Safe Everyday Interactions (Zero Risk)', 'Prevention & Civic Duty'],
    rows: [
      ['Unprotected sexual contact with an infected partner', 'Hugging, handshakes, sharing classrooms or offices', 'Abstinence, mutual fidelity, consistent barrier protection'],
      ['Unscreened blood transfusion or shared sharp needles', 'Sharing plates, cups, swimming pools, or mosquito bites', 'Use screened blood banks and sterile single-use syringes'],
      ['Mother-to-child (pregnancy, delivery, breastfeeding)', 'Caring for PLWHA with compassion and dignity', 'PMTCT antiretroviral therapy & zero workplace stigma'],
    ],
  },
  'cv-youth': {
    title: 'Youth Empowerment Skills & Institutional Channels',
    headers: ['Skill Category', 'Concrete Examples', 'Primary Civic Outcome'],
    rows: [
      ['Life Coping Skills', 'Critical thinking, emotional regulation, conflict resolution', 'Resists peer pressure, substance abuse, and thuggery'],
      ['Manipulative / Vocational', 'Solar installation, tailoring, precision welding, coding', 'Creates self-employment and industrial productivity'],
      ['Intellectual & Communicative', 'Financial literacy, public speaking, civic advocacy', 'Equips youth to lead enterprises and hold leaders accountable'],
    ],
  },
  'cv-citizenship': {
    title: 'Modes of Acquiring Nigerian Citizenship (1999 Constitution)',
    headers: ['Mode', 'Qualifying Requirement', 'Constitutional Scope'],
    rows: [
      ['By Birth (Sec. 25)', 'Born in/outside Nigeria to a Nigerian parent or grandparent', 'Inalienable; eligible for highest elective offices'],
      ['By Registration (Sec. 26)', 'Foreign woman married to a Nigerian; person of full age born abroad with Nigerian grandparent', 'Requires good character, domicile intent & Oath of Allegiance'],
      ['By Naturalization (Sec. 27)', 'Foreigner aged 18+ with 15 years continuous residence & local assimilation', 'Granted by President; revocable for treason or disloyalty'],
    ],
  },
  'cv-democracy': {
    title: 'Direct vs Representative Constitutional Democracy',
    headers: ['Dimension', 'Direct Democracy', 'Representative Democracy'],
    rows: [
      ['Decision Mechanism', 'All citizens vote directly in person on every law', 'Citizens elect accountable legislators and executives'],
      ['Historical / Modern Context', 'Ancient Athens; modern Swiss cantonal referendums', 'Modern nation-states (Nigeria, USA, India, Ghana)'],
      ['Safeguards Against Tyranny', 'Assembly debate', 'Periodic free elections, independent courts & bill of rights'],
    ],
  },
  'cv-pillars': {
    title: 'Three Arms of Government & Separation of Powers',
    headers: ['Arm of Government', 'Primary Constitutional Mandate', 'Check on Other Arms'],
    rows: [
      ['Legislature (National Assembly)', 'Enacts laws, approves budget, ratifies treaties', 'Oversight hearings, confirmation of nominees, impeachment'],
      ['Executive (President / Governors)', 'Implements laws, formulates policy, maintains security', 'Presidential assent/veto, prerogative of mercy'],
      ['Judiciary (Supreme & High Courts)', 'Interprets Constitution and adjudicates disputes', 'Judicial review striking down unconstitutional statutes/acts'],
    ],
  },
  'cv-federalism': {
    title: 'Constitutional Division of Legislative Powers in Nigeria',
    headers: ['Legislative List', 'Exercising Tier(s)', 'Representative Subjects'],
    rows: [
      ['Exclusive List (68 items)', 'Federal Government ONLY', 'Defence, currency, customs, passports, mines, aviation, foreign affairs'],
      ['Concurrent List', 'Both Federal & State Governments (Federal prevails on conflict)', 'University/polytechnic education, electric power, industrial development'],
      ['Residual Matters & 4th Schedule', 'State Houses of Assembly / 774 Local Governments', 'Chieftaincy, primary healthcare, markets, motor parks, street naming'],
    ],
  },
  'cv-udhr': {
    title: 'Seven Core Freedoms of the 1948 Universal Declaration (UDHR)',
    headers: ['Core Freedom / Right', 'Civic Meaning', 'Constitutional Protection'],
    rows: [
      ['Right to Life & Dignity', 'Protection from arbitrary killing, torture, and slavery', '1999 Constitution Sections 33 & 34'],
      ['Personal Liberty & Fair Hearing', 'Prompt arraignment, presumption of innocence, impartial court', 'Sections 35 & 36 (audi alteram partem)'],
      ['Expression, Assembly & Conscience', 'Free press, peaceful protest, religious freedom', 'Sections 38, 39 & 40'],
    ],
  },
  'cv-cultism': {
    title: 'Campus & Street Cultism: Root Causes, Consequences & Eradication',
    headers: ['Root Drivers', 'Destructive Consequences', 'Preventive Safeguards'],
    rows: [
      ['Peer pressure & false quest for security/power', 'Rival killings, rustication/expulsion, criminal prosecution', 'Firm parental upbringing & value orientation'],
      ['Broken homes & campus gangsterism glamour', 'Substance addiction, destruction of academic calendars', 'Transparent university security, counselling & anti-cult laws'],
    ],
  },
  'cv-cit-ed': {
    title: 'Citizenship Education, National Consciousness & Symbols',
    headers: ['Civic Element', 'Core Purpose', 'Examples'],
    rows: [
      ['Citizenship Education', 'Equips learners with constitutional rights, duties & critical inquiry', 'Voter literacy, tax compliance, tolerance'],
      ['National Symbols', 'Embody shared sovereignty, history, and collective aspiration', 'Green-White-Green Flag (Taiwo Akinkunmi), Coat of Arms, Anthem'],
      ['National Unity Institutions', 'Foster cross-regional integration among youth and public servants', 'NYSC (1973), Unity Schools, Federal Character Commission'],
    ],
  },
  'cv-cap-dem': {
    title: 'Capitalist Democracy vs One-Party Authoritarian Systems',
    headers: ['Feature', 'Capitalist Democracy', 'Authoritarian / Command System'],
    rows: [
      ['Political Competition', 'Multi-party pluralism & periodic competitive elections', 'Single ruling party or military junta monopoly'],
      ['Economic Organization', 'Private enterprise + market competition + regulatory welfare', 'Central state monopoly over production and pricing'],
      ['Civil Society & Press', 'Independent media, trade unions, and judicial review', 'Censorship and suppression of opposition'],
    ],
  },
  'cv-apathy': {
    title: 'Political Apathy: Manifestations, Causes & Remedies',
    headers: ['Forms of Apathy', 'Underlying Causes', 'Democratic Remedies'],
    rows: [
      ['Refusal to register or collect PVC', 'Broken campaign promises & perceived electoral rigging', 'Electronic result transparency & credible INEC logistics'],
      ['Boycotting elections & public town halls', 'Electoral violence, thuggery & lack of civic education', 'Strict prosecution of electoral offenders & accountable governance'],
    ],
  },
  'cv-pop-part': {
    title: 'Traditional vs Modern Modes of Popular Participation',
    headers: ['Participation Mode', 'Arena & Tools', 'Civic Effect'],
    rows: [
      ['Electoral & Partisan', 'Voting, contesting office, joining political parties, observing polls', 'Directly selects and replaces state decision-makers'],
      ['Civil & Grassroots', 'Town-hall meetings, peaceful protests, FOI requests, petitions', 'Keeps officials accountable between election cycles'],
      ['Digital Civic Engagement', 'Online budget tracking, e-petitions, fact-checking platforms', 'Widens youth inclusion while requiring verification against misinformation'],
    ],
  },
  'cv-hr-limits': {
    title: 'Lawful Constitutional Limitations on Human Rights',
    headers: ['Right Limited', 'Lawful Ground / Condition', 'Constitutional Safeguard'],
    rows: [
      ['Right to Movement / Curfew', 'Declared State of Emergency or epidemic quarantine', 'Must be backed by legislative resolution and time-bound'],
      ['Freedom of Expression', 'Libel, slander, sedition, or incitement to violence', 'Adjudicated by independent courts under clear statutes'],
      ['Right to Property', 'Compulsory acquisition for overriding public infrastructure', 'Prompt payment of fair compensation & right of court appeal'],
    ],
  },
  'cv-drugs': {
    title: 'Drug Abuse vs Drug Trafficking & Regulatory Agencies',
    headers: ['Agency', 'Core Statutory Mandate', 'Key Distinction'],
    rows: [
      ['NDLEA (1989)', 'Interdicts illicit narcotics, arrests traffickers, rehabilitates users', 'Targets hard/illicit narcotics (cocaine, heroin, meth, cannabis trafficking)'],
      ['NAFDAC (1993)', 'Tests, registers, and polices food, medicines, cosmetics & bottled water', 'Eliminates counterfeit/adulterated pharmaceuticals & unwholesome food'],
    ],
  },
  'cv-parenthood': {
    title: 'Responsible Parenthood: Roles & Societal Dividends',
    headers: ['Parental Duty', 'Practical Action', 'National Dividend'],
    rows: [
      ['Provision & Healthcare', 'Balanced nutrition, immunization, safe shelter, formal schooling', 'Healthy, skilled human capital'],
      ['Moral & Civic Socialization', 'Modelling honesty, empathy, tolerance, and respect for law', 'Lower juvenile delinquency, cultism, and corruption'],
      ['Family Planning', 'Spacing births to match household resources and maternal health', 'Prevents child neglect and street hawking'],
    ],
  },
  'cv-traffic': {
    title: 'FRSC Road Sign Categories & Traffic Safety Compliance',
    headers: ['Road Sign Category', 'Geometric Shape & Colour', 'Driver Obligation'],
    rows: [
      ['Regulatory (Prohibitory)', 'Circular with RED border (e.g., No U-Turn, Speed Limit)', 'Mandatory legal prohibition; violation attracts statutory penalty'],
      ['Regulatory (Mandatory)', 'Solid BLUE circle with white pictogram (e.g., Keep Right)', 'Compulsory positive instruction'],
      ['Warning & Informative', 'Equilateral TRIANGLE (red border) vs RECTANGLE (green/blue)', 'Warning alerts to hazards ahead; Informative guides routes/hospitals'],
    ],
  },
  'cv-interpersonal': {
    title: 'Types & Skills of Healthy Interpersonal Relationships',
    headers: ['Relationship Sphere', 'Foundational Virtues', 'Destructive Threats'],
    rows: [
      ['Peer, Family & Workplace', 'Honesty, active listening, empathy, mutual respect, patience', 'Deceit, arrogance, cyber-bullying, intolerance'],
      ['Citizen–State Relations', 'Law obedience, tax payment, constructive civic feedback', 'Impunity, police brutality, vandalism of public utilities'],
    ],
  },
  'cv-intercommunal': {
    title: 'Inter-Communal Conflict Resolution Spectrum',
    headers: ['Mechanism', 'Third-Party Role', 'Binding Force'],
    rows: [
      ['Dialogue & Negotiation', 'Direct talks between communities without external umpire', 'Voluntary mutual agreement'],
      ['Mediation & Conciliation', 'Neutral facilitator proposes common ground without imposing verdict', 'Non-binding until signed as peace accord'],
      ['Arbitration & Litigation', 'Arbitrator or High Court Judge hears evidence and issues ruling', 'Legally binding and enforceable by state authority'],
    ],
  },
  'cv-hr-cat': {
    title: 'Generations of Human Rights (Karel Vasak Framework)',
    headers: ['Generation', 'Category Focus', 'Concrete Examples'],
    rows: [
      ['First Generation ("Blue")', 'Civil & Political Liberties', 'Right to life, fair hearing, speech, voting, freedom from torture'],
      ['Second Generation ("Red")', 'Economic, Social & Cultural Rights', 'Education, healthcare, fair wages, shelter, social security'],
      ['Third Generation ("Green")', 'Collective / Solidarity Rights', 'Clean environment, peace, self-determination, sustainable development'],
    ],
  },
  'cv-pub-serv': {
    title: 'Core Principles of the Career Civil Service vs Political Appointees',
    headers: ['Principle', 'Operational Meaning', 'Accountability Rule'],
    rows: [
      ['Permanence & Continuity', 'Career civil servants retain tenure across changing administrations', 'Prevents governance vacuum during electoral transitions'],
      ['Political Neutrality & Impartiality', 'Serves any elected government faithfully without partisan bias', 'Civil servants must resign before contesting partisan office'],
      ['Anonymity & Meritocracy', 'Ministers take public praise/blame in parliament; recruitment by merit', 'Curbs nepotism while Public Complaints Commission redresses maladministration'],
    ],
  },
  'cv-civil-soc': {
    title: 'Civil Society Organizations (CSOs) vs Political Parties',
    headers: ['Dimension', 'Civil Society Organizations (CSOs)', 'Political Parties'],
    rows: [
      ['Core Objective', 'Influence policy, defend rights, monitor elections & deliver aid', 'Capture state executive/legislative power via elections'],
      ['Autonomy & Funding', 'Non-governmental, non-profit; donor/member funded', 'Funded by dues, lawful donations; field candidates on ballot'],
      ['Key Vulnerability', 'Donor dependency, urban elitism, or partisan compromise', 'Internal godfatherism and lack of ideological discipline'],
    ],
  },
  'cv-elections': {
    title: 'INEC Electoral Cycle, BVAS Accreditation & Free/Fair Safeguards',
    headers: ['Safeguard', 'Institutional Function', 'Fraud Prevented'],
    rows: [
      ['Independent Umpire (INEC)', 'Delimits constituencies, registers voters, conducts polls', 'Partisan manipulation of electoral boundaries and registers'],
      ['BVAS Biometric Accreditation', 'Verifies PVC holder via fingerprint/facial match on election day', 'Multiple voting, ghost voters, and over-voting'],
      ['Secret Ballot & Collation Transparency', 'Private thumbprinting + party/observer result sheet signing', 'Vote buying intimidation and result falsification in transit'],
    ],
  },
  'cv-const-dem': {
    title: 'Constitutionalism vs Mere Possession of a Written Constitution',
    headers: ['Concept', 'Exact Meaning', 'Practical Test'],
    rows: [
      ['Constitution', 'Body of fundamental rules establishing organs and powers of state', 'May exist on paper even under an authoritarian regime'],
      ['Constitutionalism', 'Living practice of LIMITED government strictly bound by supreme law', 'Rulers obey court orders, term limits, and due process'],
    ],
  },
  'cv-trafficking': {
    title: 'Human Trafficking vs Migrant Smuggling & NAPTIP Mandate',
    headers: ['Dimension', 'Human Trafficking', 'Migrant Smuggling'],
    rows: [
      ['Core Crime', 'Crime against the PERSON via force, fraud, coercion, or exploitation', 'Crime against state BORDER laws via consensual paid illegal crossing'],
      ['Consent & Movement', 'Victim consent is irrelevant where deception/exploitation exists; can be internal', 'Always crosses an international border; ends upon arrival'],
      ['Lead Nigerian Agency', 'NAPTIP (2003): Prevention, Protection, Prosecution & Partnership', 'Nigeria Immigration Service (NIS) border enforcement'],
    ],
  },
  'cv-corruption': {
    title: 'Anti-Corruption Watchdogs: ICPC vs EFCC vs CCB',
    headers: ['Agency', 'Primary Statutory Focus', 'Signature Enforcement Tool'],
    rows: [
      ['ICPC (2000)', 'Public-sector bribery, contract inflation, abuse of official office', 'System reviews of ministries + prosecution of corrupt officers'],
      ['EFCC (2004)', 'Financial & economic crimes across public AND private sectors', 'Tracks money laundering, cyber-fraud (419), terrorism financing & asset forfeiture'],
      ['Code of Conduct Bureau (CCB)', 'Public officers’ conflict of interest & illicit enrichment', 'Mandatory asset declaration on assuming and leaving office'],
    ],
  },
  'cv-nat-int': {
    title: 'Mechanisms of National Integration in a Plural Federation',
    headers: ['Mechanism', 'Constitutional / Policy Design', 'Integration Goal'],
    rows: [
      ['Federal Character Principle', 'Sec. 14(3): Equitable representation across states/zones in federal appointments', 'Prevents domination by one ethnic or sectional group (must balance with merit)'],
      ['NYSC & Unity Schools', 'Deploys graduates and secondary students outside states of origin', 'Replaces stereotypes with lived cross-cultural friendships'],
      ['Fiscal Revenue Allocation', 'RMAFC formula sharing Federation Account across 3 tiers', 'Supports balanced national development'],
    ],
  },
  'cv-global-cit': {
    title: 'International Organizations: UN, AU, ECOWAS & Commonwealth',
    headers: ['Organization', 'Headquarters & Founding', 'Signature Regional / Global Mandate'],
    rows: [
      ['ECOWAS (1975)', 'Abuja, Nigeria (15 West African states)', 'Visa-free movement protocol, common tariff & ECOMOG peacekeeping'],
      ['African Union — AU (2002)', 'Addis Ababa, Ethiopia (succeeded OAU 1963)', 'Continental integration, AfCFTA trade, Peace & Security Council'],
      ['United Nations — UN (1945)', 'New York, USA (Security Council 5 permanent veto members)', 'Global peace, SDGs, WHO, UNESCO, UNICEF, ICJ at The Hague'],
    ],
  },
  'cv-rule-adr': {
    title: 'A.V. Dicey’s Rule of Law Pillars & Alternative Dispute Resolution (ADR)',
    headers: ['Pillar / Forum', 'Core Legal Principle', 'Practical Advantage / Limit'],
    rows: [
      ['Supremacy of Regular Law', 'No punishment except for breach of established law proven in court', 'Abolishes arbitrary detention and executive decrees'],
      ['Equality Before the Law', 'All citizens and officials subject to ordinary courts', 'Qualified narrowly by temporary executive/diplomatic immunity'],
      ['ADR (Mediation / Arbitration)', 'Faster, confidential, relationship-preserving dispute settlement', 'Cannot try capital felonies (murder, treason) or constitutional interpretation'],
    ],
  },
};

function shuffleMcq(
  seed: string,
  o: string[],
  a: number,
  fb?: string[]
): { o: string[]; a: number; fb?: string[] } {
  if (o.length !== 4) return { o, a, fb };
  const order = perm(seed, o.length);
  return {
    o: order.map((idx) => o[idx]),
    a: Math.max(0, order.indexOf(a)),
    fb: fb ? order.map((idx) => fb[idx] ?? '') : undefined,
  };
}

function buildInteractiveForCivicTopic(topic: Topic): InteractiveLesson {
  const tableSpec = CIVIC_TEACH_TABLES[topic.id];

  return {
    title: topic.name,
    goals: topic.goals,
    trap: topic.trap,
    parts: topic.parts.map((part, pIdx) => {
      const beats: Beat[] = [];

      const ideaBeat: IdeaBeat = {
        k: 'idea',
        kl: `Chapter ${pIdx + 1} · Core Principle`,
        title: part.title,
        idea: part.idea,
        g: part.g,
        cap: part.cap,
        rules: part.rules,
        rh: 'Essential Constitutional & Civic Principles',
      };
      beats.push(ideaBeat);

      if (pIdx === 0 && tableSpec) {
        const body: TeachBlock[] = [
          ['h', tableSpec.title],
          ['tb', tableSpec.headers, tableSpec.rows],
          ['wn', `<b>Trap:</b> ${topic.trap}`],
        ];
        const teachBeat: TeachBeat = {
          k: 'teach',
          kl: 'Civic Mastery Comparison',
          title: tableSpec.title,
          body,
        };
        beats.push(teachBeat);
      }

      const fadeSteps = part.ex.steps.map((st, sIdx) => {
        const isLast = sIdx === part.ex.steps.length - 1;
        if (isLast && part.ex.why) {
          const [, wq, wo, wfb] = part.ex.why;
          return {
            m: st[0],
            why: st[1],
            whyQ: {
              q: wq,
              o: wo,
              a: 0,
              fb: wfb,
            },
          };
        }
        return {
          m: st[0],
          why: st[1],
        };
      });

      beats.push({
        k: 'fade',
        kl: 'Worked Civic Case Study',
        lv: pIdx === 0 ? 'full' : 'one',
        title: `Case Study — ${part.title}`,
        q: part.ex.q,
        g: part.ex.g,
        steps: fadeSteps,
      });

      if (topic.spot && topic.spot.part === pIdx) {
        const sp = shuffleMcq(
          `spot|${topic.id}|${pIdx}`,
          topic.spot.o,
          topic.spot.a ?? 0,
          topic.spot.fb
        );
        beats.push({
          k: 'spot',
          kl: 'Spot the Trap',
          title: `Audit ${topic.spot.who}’s Reasoning`,
          who: topic.spot.who,
          q: topic.spot.q,
          lines: topic.spot.lines,
          bad: topic.spot.bad,
          okfb: topic.spot.okfb,
          o: sp.o,
          a: sp.a,
          fb: sp.fb || ['', '', '', ''],
          h: topic.spot.h,
          fix: topic.spot.fix,
        });
      }

      const defaultFb = part.tryit.o.map((_, idx) =>
        idx === part.tryit.a
          ? `Spot on! ${part.tryit.e}`
          : `Review the civic principle: ${part.tryit.e}`
      );
      const cp = shuffleMcq(
        `tryit|${topic.id}|${pIdx}`,
        part.tryit.o,
        part.tryit.a,
        part.tryit.fb || defaultFb
      );
      beats.push({
        k: 'check',
        kl: 'Quick Mastery Check',
        title: `Your Turn — ${part.title}`,
        q: part.tryit.q,
        o: cp.o,
        a: cp.a,
        fb: cp.fb || defaultFb,
        h: [part.tryit.h],
      });

      return {
        title: part.title,
        beats,
      };
    }),
  };
}

export function buildCivicCurriculum(): {
  topics: Topic[];
  il: Record<string, InteractiveLesson>;
} {
  const rawTopics: Topic[] = [
    ...CIVIC_TOPICS_PART1,
    ...CIVIC_TOPICS_PART2,
    ...CIVIC_TOPICS_PART3,
  ].sort((a, b) => {
    const oa = CIVIC_NERDC_MAP[a.id]?.order ?? 999;
    const ob = CIVIC_NERDC_MAP[b.id]?.order ?? 999;
    return oa - ob;
  });

  const topics: Topic[] = rawTopics.map((topic) => ({
    ...topic,
    qs: topic.qs.map((q, qIdx) => {
      const p = shuffleMcq(`q|${topic.id}|${qIdx}`, q.o, q.a, q.w);
      return {
        ...q,
        o: p.o,
        a: p.a,
        w: p.fb,
      };
    }),
  }));

  const il: Record<string, InteractiveLesson> = {};
  for (const t of rawTopics) {
    il[t.id] = buildInteractiveForCivicTopic(t);
  }

  return { topics, il };
}
