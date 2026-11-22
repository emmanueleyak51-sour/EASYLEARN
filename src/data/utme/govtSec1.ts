import type { UtmeTopicSpec } from './builder';

const SEC1 = 'Section 1: Elements of government';

export const GOVT_SEC1_SPECS: UtmeTopicSpec[] = [
  {
    id: 'govt-state-nation',
    name: 'Government, state and nation',
    sec: SEC1,
    goals: [
      'Distinguish clearly between government, the state, a nation and a society.',
      'Identify the four essential features of a state and the main functions of government.',
    ],
    trap: 'Students often confuse the state with the government. A government changes after elections, while the state stays permanent.',
    parts: [
      {
        title: 'Government as institution, process and academic field',
        idea: 'Government is the machinery through which a state makes laws, enforces them and settles disputes so people can live together safely.',
        terms: [
          ['Government as institution', 'The organs — legislature, executive and judiciary — that run the state.'],
          ['Government as process', 'The day-to-day art of making, enforcing and interpreting public policies.'],
          ['State', 'A politically organised group of people living in a defined territory with an independent government.'],
        ],
        rules: [
          'Every state must have four permanent elements: population, defined territory, government and sovereignty.',
          'Government is only an agency of the state — it is temporary, whereas the state is permanent.',
          'A state without sovereignty is a colony or protectorate, not a true state.',
        ],
        table: {
          headers: ['Concept', 'Permanent?', 'Core basis'],
          rows: [
            ['State', 'Yes', 'Defined territory, population, government and sovereignty'],
            ['Government', 'No (changes periodically)', 'Machinery exercising state authority'],
            ['Nation', 'Yes', 'Shared history, language, culture or common identity'],
            ['Society', 'Yes', 'All human associations, wider than the state'],
          ],
        },
        example: {
          q: 'Why was Nigeria in 1955 not yet a sovereign state even though it had people, borders and a colonial administration?',
          steps: [
            ['List the four essential features of a state.', 'Population, defined territory, government and sovereignty.'],
            ['Check which feature was missing in 1955.', 'Britain held final supreme authority over Nigeria until independence in 1960.'],
            ['State the conclusion.', 'Without sovereignty, a territory is a colony, not an independent state.'],
          ],
        },
        yourTurn: {
          q: 'Which feature separates a sovereign state from a local community or cultural association?',
          o: ['Sovereignty', 'Large population', 'Shared language', 'Written constitution'],
          a: 0,
          h: [
            'Think of the one power that only an independent country holds over everyone inside its borders.',
            'Cultural associations have members and rules, but they cannot enforce supreme law over a territory.',
          ],
          e: 'Sovereignty — supreme, independent authority within a territory — distinguishes a state from every other association.',
        },
      },
      {
        title: 'Nation, nation-state and functions of government',
        idea: 'A nation rests on shared cultural or historical identity, while a state is a legal political unit. Modern governments protect citizens, keep order and provide public services.',
        terms: [
          ['Nation', 'People bound by common language, ancestry, history or shared sense of belonging.'],
          ['Nation-state', 'A sovereign state whose population shares a single dominant national identity.'],
          ['Multi-national state', 'One sovereign state containing several distinct ethnic nations, such as Nigeria.'],
        ],
        rules: [
          'A nation can exist without its own state, and a single state can contain many nations.',
          'Core functions of government include law-making, defence, maintaining law and order, social welfare and foreign relations.',
        ],
        table: {
          headers: ['Function of government', 'Concrete Nigerian example'],
          rows: [
            ['Law-making', 'National Assembly passing an Education Act'],
            ['Maintenance of order', 'Nigeria Police Force investigating crime'],
            ['External defence', 'Armed Forces guarding national borders'],
            ['Social welfare', 'Public hospitals, roads and schools'],
          ],
        },
        example: {
          q: 'Why is Nigeria described as a multi-national state rather than a single-nation state?',
          steps: [
            ['Recall what defines a nation.', 'A group sharing language, culture and history.'],
            ['Apply to Nigeria.', 'Nigeria unites over 250 ethnic nationalities under one federal government and constitution.'],
          ],
        },
        yourTurn: {
          q: 'A group of people with one language and history spread across three neighbouring countries is best called a:',
          o: ['Nation', 'Sovereign state', 'Government', 'Confederation'],
          a: 0,
          h: [
            'Notice that they do not share one single territory or government.',
            'Which term depends on cultural and historical identity rather than political borders?',
          ],
          e: 'A nation is defined by shared identity, history and culture, even when its people live across different states.',
        },
      },
    ],
    qs: [
      {
        q: 'Which of the following is NOT an essential attribute of a state?',
        o: ['Sovereignty', 'Defined territory', 'One common language', 'Government'],
        a: 2,
        e: 'A state requires population, territory, government and sovereignty, but citizens do not need to speak one language.',
      },
      {
        q: 'Unlike the state, a government is:',
        o: ['Permanent and unchanging', 'Temporary and replaceable', 'Wider than society', 'Independent of citizens'],
        a: 1,
        e: 'Governments come and go through elections or constitutional change, while the state continues.',
      },
      {
        q: 'Studying how elections are won and how public policy is made treats government primarily as:',
        o: ['An academic field of study', 'A religious body', 'A private corporation', 'A family unit'],
        a: 0,
        e: 'Government as an academic field examines political institutions, ideas, elections and public administration.',
      },
      {
        q: 'The broadest umbrella covering families, clubs, churches, mosques and the state itself is:',
        o: ['The executive', 'Society', 'The civil service', 'A nation-state'],
        a: 1,
        e: 'Society encompasses all human groupings and interactions, of which the state is one political part.',
      },
      {
        q: 'Which organ of government interprets laws and settles disputes between citizens and the state?',
        o: ['The legislature', 'The judiciary', 'The civil service', 'The electoral commission'],
        a: 1,
        e: 'The judiciary interprets laws and adjudicates disputes impartially.',
      },
      {
        q: 'A territory that has people, borders and local officials but answers to a foreign power lacks:',
        o: ['Population', 'Sovereignty', 'Culture', 'Taxation'],
        a: 1,
        e: 'Sovereignty means freedom from external control and supreme legal power within the territory.',
      },
    ],
  },
  {
    id: 'govt-power-sovereignty',
    name: 'Power, authority, legitimacy and sovereignty',
    sec: SEC1,
    goals: [
      'Contrast raw power with rightful authority and legitimacy.',
      'Explain the types and limits of sovereignty in a modern state.',
    ],
    trap: 'Power can force obedience through fear, but only authority carries the accepted right to command.',
    parts: [
      {
        title: 'Power, authority and legitimacy',
        idea: 'Power is the ability to make others do something even against their will; authority is power backed by law or accepted right; legitimacy is the citizens’ belief that rulers deserve to be obeyed.',
        terms: [
          ['Power', 'Capacity to influence or compel behaviour, using force, wealth, persuasion or office.'],
          ['Authority', 'The recognised legal or moral right to issue orders and expect obedience.'],
          ['Legitimacy', 'Widespread public acceptance that a government rules rightfully.'],
        ],
        rules: [
          'Max Weber identified three sources of authority: traditional (custom/kingship), charismatic (personal magnetism) and legal-rational (constitution and laws).',
          'A military coup leader may hold physical power without popular legitimacy.',
          'Free and fair elections, good governance and respect for rights strengthen legitimacy.',
        ],
        table: {
          headers: ['Weberian authority', 'Source of right to rule', 'Example'],
          rows: [
            ['Traditional', 'Long-standing custom and inheritance', 'Oba, Emir or Obi'],
            ['Charismatic', 'Extraordinary personal appeal', 'Inspiring liberation leader'],
            ['Legal-rational', 'Written law and constitutional office', 'Elected President or judge'],
          ],
        },
        example: {
          q: 'An armed robber demands money on a lonely road, while a tax officer collects income tax under an Act. Who exercises authority?',
          steps: [
            ['Check who uses raw force.', 'The robber has coercive power, not lawful right.'],
            ['Check who holds recognised legal backing.', 'The tax officer acts under valid law — legal-rational authority.'],
          ],
        },
        yourTurn: {
          q: 'Authority derived from the constitution and clearly defined public offices is called:',
          o: ['Legal-rational authority', 'Charismatic authority', 'Traditional authority', 'Military power'],
          a: 0,
          h: [
            'Recall Max Weber’s three types of authority.',
            'Which type rests on formal rules and constitutional office rather than custom or personality?',
          ],
          e: 'Legal-rational authority rests on written laws, constitutions and established offices.',
        },
      },
      {
        title: 'Sovereignty and its limits',
        idea: 'Sovereignty is the supreme, final legal power of a state over its territory and people, free from external control — though in practice international law and public opinion limit it.',
        terms: [
          ['Internal sovereignty', 'Supreme authority of the state over all persons and groups within its borders.'],
          ['External sovereignty', 'Independence of a state from control by other countries.'],
          ['De jure vs De facto', 'De jure is lawful sovereignty; de facto is actual control on the ground.'],
        ],
        rules: [
          'Popular sovereignty locates ultimate political power in the electorate (the people).',
          'Legal sovereignty belongs to the law-making body (or constitution in a constitutional state).',
          'Practical limits on sovereignty include international treaties, global trade, public opinion and the constitution.',
        ],
        table: {
          headers: ['Type of sovereignty', 'Where it resides'],
          rows: [
            ['Legal sovereignty', 'Body with power to make and repeal supreme laws'],
            ['Political / popular sovereignty', 'The electorate who vote leaders in or out'],
            ['Internal sovereignty', 'Control over citizens and institutions inside the state'],
            ['External sovereignty', 'Freedom from foreign dictation'],
          ],
        },
        example: {
          q: 'Why can even a sovereign country not ignore all international treaties without consequences?',
          steps: [
            ['Distinguish legal independence from practical reality.', 'Legally a state is sovereign, but it depends on trade, diplomacy and international organisations.'],
            ['State the limit.', 'International treaties, sanctions and global public opinion act as real limits on sovereignty.'],
          ],
        },
        yourTurn: {
          q: 'When voters remove an unpopular government at the ballot box, they are exercising:',
          o: ['Political (popular) sovereignty', 'External sovereignty', 'Judicial sovereignty', 'Traditional authority'],
          a: 0,
          h: [
            'Ask who holds the ultimate political power behind the lawmakers in a democracy.',
            'It is the sovereignty that belongs to the electorate.',
          ],
          e: 'Political or popular sovereignty resides in the electorate, who choose and replace their representatives.',
        },
      },
    ],
    qs: [
      {
        q: 'Which concept describes citizens’ willing acceptance of a government’s right to rule?',
        o: ['Coercion', 'Legitimacy', 'Autocracy', 'Censorship'],
        a: 1,
        e: 'Legitimacy is public recognition and acceptance that a government holds power rightfully.',
      },
      {
        q: 'An Emir who commands respect because his office is inherited through centuries of custom holds:',
        o: ['Traditional authority', 'Legal-rational authority', 'Delegated authority', 'External sovereignty'],
        a: 0,
        e: 'Traditional authority rests on inherited custom and long-established cultural norms.',
      },
      {
        q: 'A government that seizes power by force and controls the territory without constitutional backing exercises:',
        o: ['De jure sovereignty', 'De facto sovereignty', 'Popular sovereignty', 'Parliamentary authority'],
        a: 1,
        e: 'De facto sovereignty is actual control on the ground even without legal entitlement.',
      },
      {
        q: 'Which of the following is a practical limitation on the sovereignty of a modern state?',
        o: ['International treaties and public opinion', 'Having a national flag', 'Collecting domestic taxes', 'Running local schools'],
        a: 0,
        e: 'International law, treaties, economic interdependence and public opinion all restrain state actions.',
      },
      {
        q: 'External sovereignty means that a state:',
        o: ['Has no written laws', 'Is free from foreign control and interference', 'Cannot join the United Nations', 'Must have a monarch'],
        a: 1,
        e: 'External sovereignty is independence in international relations without subordination to another state.',
      },
      {
        q: 'Power differs from authority mainly because power:',
        o: ['Always requires an election', 'Can be exercised without legal or moral right', 'Belongs only to judges', 'Never involves influence'],
        a: 1,
        e: 'Power can compel obedience through force or pressure even when it lacks rightful legitimacy.',
      },
    ],
  },
  {
    id: 'govt-democracy-forms',
    name: 'Monarchy, aristocracy, oligarchy and democracy',
    sec: SEC1,
    goals: [
      'Compare rule by one, rule by a few and rule by the people.',
      'Explain direct vs representative democracy and the conditions democracy needs to thrive.',
    ],
    trap: 'Constitutional monarchy is NOT absolute dictatorship — in a constitutional monarchy like the UK, elected leaders run the government.',
    parts: [
      {
        title: 'Monarchy, aristocracy and oligarchy',
        idea: 'Early political thinkers classified governments by how many people hold supreme power: one person (monarchy), a noble few (aristocracy), a wealthy or powerful clique (oligarchy), or the people (democracy).',
        terms: [
          ['Absolute monarchy', 'A king or queen holds unrestricted power to make and enforce laws.'],
          ['Constitutional monarchy', 'The monarch’s powers are strictly limited by a constitution and an elected parliament.'],
          ['Oligarchy', 'Rule by a small privileged group — whether wealthy (plutocracy) or military.'],
        ],
        rules: [
          'Aristocracy literally means rule by the “best” or hereditary nobility; oligarchy is self-interested rule by a few.',
          'In a constitutional monarchy, the monarch is ceremonial Head of State while the Prime Minister leads government.',
        ],
        table: {
          headers: ['Form', 'Who rules', 'Key feature'],
          rows: [
            ['Absolute monarchy', 'One hereditary ruler', 'Unlimited authority'],
            ['Constitutional monarchy', 'Elected government + ceremonial monarch', 'Monarch reigns but does not govern'],
            ['Aristocracy', 'Hereditary noble class', 'Birth and social status'],
            ['Oligarchy', 'Small powerful clique', 'Wealth, military or clique control'],
          ],
        },
        example: {
          q: 'Britain has a King, yet it is classified as a democracy. Why?',
          steps: [
            ['Identify the type of monarchy.', 'Britain is a constitutional monarchy.'],
            ['Locate real political power.', 'Voters elect Parliament and the Prime Minister makes policy; the King performs ceremonial duties.'],
          ],
        },
        yourTurn: {
          q: 'A system where a small clique of wealthy individuals controls state decisions for their own gain is:',
          o: ['Oligarchy', 'Direct democracy', 'Constitutional monarchy', 'Federalism'],
          a: 0,
          h: [
            'Focus on “rule by a small privileged group”.',
            'It is not rule by one person or by all citizens.',
          ],
          e: 'Oligarchy is rule by a small powerful group (and when based on wealth, specifically plutocracy).',
        },
      },
      {
        title: 'Direct and representative democracy',
        idea: 'Democracy means government by the people. Because modern countries have millions of citizens, they use representative democracy rather than assembling everyone in one square.',
        terms: [
          ['Direct democracy', 'Citizens vote personally on every law and major public decision.'],
          ['Representative democracy', 'Citizens elect officials for fixed terms to make laws on their behalf.'],
          ['Referendum', 'A direct yes-or-no vote by all citizens on a major constitutional or policy issue.'],
        ],
        rules: [
          'Pillars of democracy: periodic free and fair elections, rule of law, independent judiciary, free press and protection of minority rights.',
          'Majority rule must always respect minority rights — otherwise it becomes tyranny of the majority.',
        ],
        table: {
          headers: ['Feature', 'Direct democracy', 'Representative democracy'],
          rows: [
            ['How laws are made', 'Citizens assemble and vote directly', 'Elected legislators debate and pass laws'],
            ['Best suited for', 'Very small communities (ancient Athens)', 'Large modern states like Nigeria'],
            ['Modern trace', 'Referendum and recall', 'General elections every 4 years'],
          ],
        },
        example: {
          q: 'Why can Nigeria not run pure direct democracy for every federal bill?',
          steps: [
            ['Consider population size and geography.', 'Over 200 million citizens cannot gather daily to debate every bill.'],
            ['Give the democratic solution.', 'Citizens elect representatives to the National Assembly and hold them accountable at elections.'],
          ],
        },
        yourTurn: {
          q: 'Which condition is essential for a genuine democracy to survive?',
          o: ['Free, fair and periodic elections', 'One-party monopoly of parliament', 'Banning independent newspapers', 'Hereditary succession to office'],
          a: 0,
          h: [
            'Democracy requires peaceful ways for citizens to choose and replace leaders.',
            'Eliminate options that silence voters or competition.',
          ],
          e: 'Periodic free and fair elections allow citizens to grant or withdraw consent peacefully.',
        },
      },
    ],
    qs: [
      {
        q: 'In a constitutional monarchy, the monarch:',
        o: ['Has unlimited power over courts', 'Exercises only powers permitted by the constitution', 'Appoints all members of parliament directly', 'Abolishes political parties'],
        a: 1,
        e: 'A constitutional monarch is bound by the constitution and plays a largely ceremonial role.',
      },
      {
        q: 'Direct democracy worked in ancient Athens mainly because:',
        o: ['It had a small citizen population', 'It used electronic voting', 'It had a written federal constitution', 'It banned public debate'],
        a: 0,
        e: 'Small population size made it possible for eligible citizens to meet directly in one assembly.',
      },
      {
        q: 'Rule by a hereditary noble class is known as:',
        o: ['Aristocracy', 'Republic', 'Anarchy', 'Federalism'],
        a: 0,
        e: 'Aristocracy places political power in a privileged hereditary nobility.',
      },
      {
        q: 'When citizens vote directly “yes” or “no” on a proposed constitutional amendment, the vote is a:',
        o: ['Referendum', 'Filibuster', 'Veto', 'Prorogation'],
        a: 0,
        e: 'A referendum submits a specific public or constitutional question directly to the electorate.',
      },
      {
        q: 'A key weakness of democracy if unchecked by human rights protections is:',
        o: ['Tyranny of the majority', 'Hereditary succession', 'Total absence of elections', 'Elimination of political parties'],
        a: 0,
        e: 'Without constitutional rights, a numerical majority could oppress minorities.',
      },
      {
        q: 'Which of the following best describes a republic?',
        o: ['A state whose Head of State is not a hereditary monarch', 'A state ruled by soldiers', 'A country with only one political party', 'A territory controlled by a foreign power'],
        a: 0,
        e: 'In a republic, the Head of State (usually a President) holds office by election or appointment, not inheritance.',
      },
    ],
  },
  {
    id: 'govt-systems',
    name: 'Forms and systems of government',
    sec: SEC1,
    goals: [
      'Contrast unitary, federal and confederal distributions of power.',
      'Compare presidential and parliamentary (cabinet) systems of government.',
    ],
    trap: 'In a parliamentary system the executive sits INSIDE the legislature (fusion of powers), whereas in a presidential system they are separate.',
    parts: [
      {
        title: 'Unitary, federal and confederal systems',
        idea: 'States organise territory in three main ways depending on whether power sits at the centre (unitary), is constitutionally shared (federal), or stays mainly with member states (confederal).',
        terms: [
          ['Unitary system', 'Supreme authority sits in one central government, which may delegate tasks to local units (e.g. UK, Ghana).'],
          ['Federal system', 'A written constitution divides power between central and component governments (e.g. Nigeria, USA).'],
          ['Confederation', 'A loose union of sovereign states keeping most power and the right to secede.'],
        ],
        rules: [
          'Federalism requires a written, rigid constitution, an independent Supreme Court to settle centre-state disputes, and clear legislative lists.',
          'In Nigeria, Exclusive List = federal only; Concurrent List = federal and state (federal prevails in conflict); Residual List = state only.',
        ],
        table: {
          headers: ['Feature', 'Unitary', 'Federal', 'Confederal'],
          rows: [
            ['Where power sits', 'Central government', 'Shared constitutionally', 'Member states'],
            ['Constitution type', 'Often flexible', 'Written and rigid', 'Treaty / pact'],
            ['Right to secede', 'No', 'No', 'Usually yes'],
          ],
        },
        example: {
          q: 'Both the National Assembly and a State House of Assembly pass laws on a Concurrent List item, and the two laws clash. Which law applies?',
          steps: [
            ['Identify the legislative list.', 'Concurrent List powers belong to both federal and state governments.'],
            ['Apply the federal supremacy rule.', 'Where a valid federal law conflicts with a state law on a concurrent matter, the federal law prevails to the extent of the inconsistency.'],
          ],
        },
        yourTurn: {
          q: 'Which type of constitution is essential for a federal system to protect the division of powers?',
          o: ['Written and rigid constitution', 'Unwritten and flexible constitution', 'Secret executive decree', 'Single-party manifesto'],
          a: 0,
          h: [
            'Component states must be sure the central government cannot casually erase their powers overnight.',
            'Which constitution type puts power sharing in clear text and requires a special process to amend?',
          ],
          e: 'A written and rigid constitution clearly spells out federal and state powers and prevents unilateral alteration.',
        },
      },
      {
        title: 'Presidential vs parliamentary systems',
        idea: 'Presidential systems separate the executive and legislature under an elected President; parliamentary systems fuse them so the Prime Minister and Cabinet come from Parliament.',
        terms: [
          ['Presidential system', 'One person is both Head of State and Head of Government, elected independently of parliament (e.g. Nigeria, USA).'],
          ['Parliamentary system', 'Ceremonial Head of State is separate from the Prime Minister (Head of Government), who leads the parliamentary majority.'],
          ['Collective responsibility', 'In a cabinet system, all ministers publicly defend cabinet decisions or resign together if defeated on a confidence vote.'],
        ],
        rules: [
          'Presidential system: separation of powers, fixed tenure, individual ministerial responsibility, removal only by impeachment.',
          'Parliamentary system: fusion of powers, collective responsibility, Parliament can remove the government via a vote of no confidence.',
        ],
        table: {
          headers: ['Feature', 'Presidential (Nigeria today)', 'Parliamentary (First Republic)'],
          rows: [
            ['Head of State & Government', 'Merged in the President', 'Split (President/Monarch vs Prime Minister)'],
            ['Ministers in legislature?', 'No (must resign seat if appointed)', 'Yes (must be MPs)'],
            ['Removal before term ends', 'Impeachment for gross misconduct', 'Vote of no confidence'],
          ],
        },
        example: {
          q: 'In Nigeria’s First Republic (1963–1966), Dr. Nnamdi Azikiwe was ceremonial President while Sir Abubakar Tafawa Balewa was Prime Minister. Which system was that?',
          steps: [
            ['Notice the split executive.', 'Head of State and Head of Government were two different people.'],
            ['Name the system.', 'That dual executive is the hallmark of a parliamentary (cabinet) system.'],
          ],
        },
        yourTurn: {
          q: 'Which mechanism allows a parliamentary legislature to remove the Prime Minister and Cabinet before elections are due?',
          o: ['Vote of no confidence', 'Executive veto', 'Judicial review', 'Filibuster'],
          a: 0,
          h: [
            'The Prime Minister stays in office only while commanding majority support in Parliament.',
            'What vote proves that Parliament no longer trusts the Cabinet?',
          ],
          e: 'A vote of no confidence forces the Prime Minister and Cabinet to resign or call a fresh general election.',
        },
      },
    ],
    qs: [
      {
        q: 'In a federal system, matters reserved exclusively for the component states belong to the:',
        o: ['Exclusive list', 'Residual list', 'Concurrent list', 'Judicial list'],
        a: 1,
        e: 'Residual powers belong solely to the state governments.',
      },
      {
        q: 'A major advantage of a unitary system of government is that it:',
        o: ['Eliminates the central government', 'Avoids duplication of offices and promotes uniform laws', 'Allows regions to secede freely', 'Requires a dual executive'],
        a: 1,
        e: 'Unitary states have one centre of law-making, which cuts administrative duplication and promotes uniform policy.',
      },
      {
        q: 'Under the presidential system of government, cabinet ministers are:',
        o: ['Always elected members of the legislature', 'Individually responsible to the President', 'Removed only by a vote of no confidence', 'Immune from dismissal by the President'],
        a: 1,
        e: 'In a presidential system, ministers are appointed by and individually accountable to the President.',
      },
      {
        q: 'Collective responsibility is a defining principle of the:',
        o: ['Parliamentary system', 'Military regime', 'Confederal treaty', 'Absolute monarchy'],
        a: 0,
        e: 'Collective responsibility binds cabinet ministers in a parliamentary system to stand or fall together.',
      },
      {
        q: 'In a confederation, sovereignty rests primarily with the:',
        o: ['Central secretariat', 'Component member states', 'Supreme Court alone', 'Local government councils'],
        a: 1,
        e: 'Member states in a confederation keep their sovereignty and grant only limited delegated powers to the centre.',
      },
      {
        q: 'Which feature is shared by Nigeria’s current system and the United States?',
        o: ['Both combine Head of State and Head of Government in an elected President', 'Both have a hereditary monarch', 'Both require ministers to sit in the Senate', 'Both operate a unitary constitution'],
        a: 0,
        e: 'Both Nigeria and the United States operate federal presidential systems with a single executive President.',
      },
    ],
  },
  {
    id: 'govt-organs',
    name: 'The legislature, executive and judiciary',
    sec: SEC1,
    goals: [
      'State the composition and core functions of the legislature, executive and judiciary.',
      'Explain unicameral vs bicameral legislatures and the independence of the judiciary.',
    ],
    trap: 'The legislature does not only pass bills — it also approves the national budget, screens key nominees and oversees ministries.',
    parts: [
      {
        title: 'The legislature and the executive',
        idea: 'The legislature makes laws and represents citizens; the executive carries out laws, directs ministries and conducts foreign policy.',
        terms: [
          ['Bicameral legislature', 'A parliament with two chambers — e.g. Nigeria’s Senate and House of Representatives.'],
          ['Unicameral legislature', 'A legislature with a single chamber — e.g. Nigerian State Houses of Assembly and Ghana’s Parliament.'],
          ['Delegated legislation', 'Rules and bye-laws made by ministers or agencies under powers granted by an Act of Parliament.'],
        ],
        rules: [
          'Bicameralism slows down hasty bills and ensures equal regional representation in the upper house.',
          'The executive has two arms: the political executive (President, Governors, Ministers) and the permanent executive (civil servants).',
        ],
        table: {
          headers: ['Organ', 'Primary role', 'Other key duties'],
          rows: [
            ['Legislature', 'Make, amend and repeal laws', 'Approve budget, confirm nominees, oversight, impeachment'],
            ['Executive', 'Implement laws and run daily administration', 'Command armed forces, sign treaties, grant pardons'],
            ['Judiciary', 'Interpret laws and settle disputes', 'Judicial review, protect fundamental rights'],
          ],
        },
        example: {
          q: 'Why does Nigeria use a bicameral legislature at the federal level but unicameral Houses of Assembly in the 36 states?',
          steps: [
            ['Check federal diversity.', 'The Senate gives every state equal representation (3 senators each), while the House of Representatives reflects population.'],
            ['Check state scale.', 'States are smaller and less costly to run with a single legislative chamber.'],
          ],
        },
        yourTurn: {
          q: 'Bye-laws made by a local government council under powers granted by an Act of the legislature are examples of:',
          o: ['Delegated legislation', 'Judicial review', 'Executive veto', 'Impeachment'],
          a: 0,
          h: [
            'Parliament cannot write every minor traffic or market rule itself, so it hands down rule-making power.',
            'What phrase describes law-making power passed down by Parliament to subordinate bodies?',
          ],
          e: 'Delegated legislation is subordinate law made by ministers, agencies or local councils under parliamentary authority.',
        },
      },
      {
        title: 'The judiciary and judicial independence',
        idea: 'Courts protect citizens from unfair government action and settle disputes. Judges can only be fair when they are independent of politicians.',
        terms: [
          ['Judicial independence', 'Freedom of judges to decide cases strictly by law without fear, favour or political interference.'],
          ['Judicial review', 'Power of courts to strike down laws or executive acts that violate the constitution.'],
          ['Security of tenure', 'Judges cannot be fired at will by the President; they serve until retirement unless removed by strict constitutional procedure.'],
        ],
        rules: [
          'Safeguards of judicial independence: open merit appointment, security of tenure, salaries charged to the Consolidated Revenue Fund, and judicial immunity for courtroom acts.',
          'Judges must remain politically neutral and decide cases solely on evidence and law.',
        ],
        table: {
          headers: ['Safeguard', 'How it protects fairness'],
          rows: [
            ['Security of tenure', 'Prevents the President from sacking a judge over an unpopular ruling'],
            ['Consolidated Revenue Fund pay', 'Stops politicians from cutting judges’ salaries as punishment'],
            ['Merit appointment (NJC)', 'Reduces political favouritism in selecting judges'],
          ],
        },
        example: {
          q: 'Why are judges’ salaries paid directly from the Consolidated Revenue Fund rather than debated annually by politicians?',
          steps: [
            ['Spot the risk.', 'If lawmakers could slash judges’ pay each year, judges might fear ruling against government.'],
            ['State the protection.', 'Automatic charging to the Consolidated Revenue Fund shields judges from financial pressure.'],
          ],
        },
        yourTurn: {
          q: 'The power of a Supreme Court to declare an unconstitutional Act of the National Assembly null and void is called:',
          o: ['Judicial review', 'Delegated legislation', 'Prerogative of mercy', 'Parliamentary privilege'],
          a: 0,
          h: [
            'Courts examine whether a law matches the constitution.',
            'This checking power of the judiciary is a two-word phrase starting with “Judicial”.',
          ],
          e: 'Judicial review empowers courts to nullify laws or executive actions that contravene the constitution.',
        },
      },
    ],
    qs: [
      {
        q: 'Which of the following is an example of a unicameral legislature?',
        o: ['Nigeria’s National Assembly', 'A Nigerian State House of Assembly', 'The United States Congress', 'The British Parliament'],
        a: 1,
        e: 'Each Nigerian State House of Assembly has only one chamber, unlike the two-chamber National Assembly.',
      },
      {
        q: 'Approval of the annual national budget (Appropriation Bill) is a primary function of the:',
        o: ['Legislature', 'Judiciary', 'Police Service Commission', 'Traditional rulers'],
        a: 0,
        e: 'No money may lawfully be spent from the Consolidated Revenue Fund without legislative appropriation.',
      },
      {
        q: 'Which measure directly strengthens the independence of the judiciary?',
        o: ['Allowing the President to dismiss judges at pleasure', 'Paying judges from the Consolidated Revenue Fund', 'Requiring judges to join the ruling party', 'Making court hearings secret'],
        a: 1,
        e: 'Financial independence through the Consolidated Revenue Fund prevents politicians from pressuring judges.',
      },
      {
        q: 'Granting state pardon to a convicted person (prerogative of mercy) is exercised by the:',
        o: ['Executive', 'Electoral commission', 'Senate Clerk', 'Civil service union'],
        a: 0,
        e: 'The President or Governor exercises the prerogative of mercy on behalf of the executive arm.',
      },
      {
        q: 'A major criticism of delegated legislation is that it:',
        o: ['Saves parliamentary time', 'Can reduce direct democratic control if poorly supervised', 'Helps experts handle technical details', 'Speeds up emergency response'],
        a: 1,
        e: 'Because unelected officials draft regulations, weak parliamentary oversight can lead to abuse of power.',
      },
      {
        q: 'In Nigeria’s bicameral National Assembly, states have equal representation in the:',
        o: ['Senate', 'House of Representatives', 'Federal Executive Council', 'Council of State'],
        a: 0,
        e: 'Every Nigerian state elects 3 senators regardless of population (plus 1 for the FCT).',
      },
    ],
  },
  {
    id: 'govt-ideologies',
    name: 'Political ideologies',
    sec: SEC1,
    goals: [
      'Compare capitalism, socialism, communism, communalism, feudalism and fascism.',
      'Explain how mixed economies balance private enterprise with state welfare.',
    ],
    trap: 'Do not mix up socialism and communism: socialism allows state ownership with wages based on work, while Karl Marx’s communism envisions a stateless, classless society.',
    parts: [
      {
        title: 'Communalism, feudalism, capitalism and mixed economy',
        idea: 'Political ideologies are organised beliefs about who should own resources and how society should be governed — from shared village land in communalism to private profit in capitalism.',
        terms: [
          ['Communalism', 'Traditional system where land and major resources are owned collectively by the community.'],
          ['Feudalism', 'Medieval hierarchy where kings and lords owned land worked by serfs in exchange for protection.'],
          ['Capitalism', 'Private ownership of means of production driven by profit and market competition.'],
        ],
        rules: [
          'Capitalism encourages innovation and choice but can widen inequality without regulation.',
          'Nigeria runs a mixed economy: private businesses operate alongside state-owned infrastructure and regulation.',
        ],
        table: {
          headers: ['Ideology', 'Who owns property', 'Main goal'],
          rows: [
            ['Communalism', 'The community jointly', 'Solidarity and mutual care'],
            ['Feudalism', 'Lords and monarchs', 'Land-for-service hierarchy'],
            ['Capitalism', 'Private individuals & firms', 'Profit and efficiency'],
            ['Mixed economy', 'Both private sector and state', 'Growth plus public welfare'],
          ],
        },
        example: {
          q: 'Why is Nigeria classified as a mixed economy rather than pure capitalism?',
          steps: [
            ['Check private ownership.', 'Banks, farms, telecoms and shops are privately owned.'],
            ['Check state role.', 'Government still owns public roads, regulates prices/monopolies and runs public universities and hospitals.'],
          ],
        },
        yourTurn: {
          q: 'Which system relies on private ownership of factories and farms guided mainly by profit and market prices?',
          o: ['Capitalism', 'Communalism', 'Feudalism', 'Communism'],
          a: 0,
          h: [
            'Focus on private ownership and competition in the market.',
            'Communalism shares land collectively, while feudalism ties serfs to lords.',
          ],
          e: 'Capitalism centres on private ownership of productive resources and market-driven profit.',
        },
      },
      {
        title: 'Socialism, communism, fascism and totalitarianism',
        idea: 'Socialism puts key industries under public ownership for fairer distribution; communism aims for a classless, stateless society; fascism and totalitarianism crush opposition under an all-powerful state.',
        terms: [
          ['Socialism', 'State or public ownership of major industries with central planning for social equality.'],
          ['Communism', 'Final Marxist stage: classless, stateless society where goods are shared according to need.'],
          ['Fascism', 'Extreme nationalist dictatorship glorifying one leader and crushing dissent (e.g. Mussolini’s Italy).'],
        ],
        rules: [
          'Karl Marx and Friedrich Engels formulated scientific socialism / communism.',
          'Totalitarianism controls every area of life — media, schools, unions and speech — allowing no opposition.',
        ],
        table: {
          headers: ['Ideology', 'Key thinker / example', 'Attitude to opposition'],
          rows: [
            ['Socialism', 'Democratic socialists / public planning', 'Can coexist with democracy'],
            ['Communism', 'Karl Marx & Friedrich Engels', 'Aims to end class conflict'],
            ['Fascism', 'Benito Mussolini (Italy)', 'Violently suppresses all opposition'],
            ['Nazism', 'Adolf Hitler (Germany)', 'Racial supremacy & totalitarian state'],
          ],
        },
        example: {
          q: 'How does fascism differ from Marxism even though both reject laissez-faire capitalism?',
          steps: [
            ['Check Marxism’s focus.', 'Marxism focuses on class struggle of workers across borders and ending private capital.'],
            ['Check fascism’s focus.', 'Fascism glorifies extreme nationalism, obeys one supreme leader, and allows private business so long as it serves the state.'],
          ],
        },
        yourTurn: {
          q: 'An authoritarian ideology built around aggressive nationalism, glorification of war and one supreme dictator is:',
          o: ['Fascism', 'Communalism', 'Liberal democracy', 'Social democracy'],
          a: 0,
          h: [
            'Think of Mussolini’s Italy in the 1920s–1940s.',
            'It elevates the nation and leader above every individual right.',
          ],
          e: 'Fascism combines extreme nationalism, one-party dictatorship and suppression of opposition.',
        },
      },
    ],
    qs: [
      {
        q: 'In traditional African communalism, land was generally owned by:',
        o: ['Foreign corporations', 'The community as a whole', 'The military alone', 'Commercial banks'],
        a: 1,
        e: 'Communalism vests land in the community or family lineage rather than individual speculators.',
      },
      {
        q: 'Under feudalism, the peasants who worked the lord’s land in return for protection were called:',
        o: ['Serfs', 'Proletarians', 'Citizens', 'Capitalists'],
        a: 0,
        e: 'Feudal serfs tilled the estate in exchange for physical security and a share of produce.',
      },
      {
        q: 'Who are the founders of scientific socialism (Marxism)?',
        o: ['John Locke and Montesquieu', 'Karl Marx and Friedrich Engels', 'Adam Smith and David Ricardo', 'Thomas Hobbes and Rousseau'],
        a: 1,
        e: 'Karl Marx and Friedrich Engels authored The Communist Manifesto and developed Marxist theory.',
      },
      {
        q: 'A totalitarian state is one that:',
        o: ['Separates church and state completely', 'Seeks total control over both public and private life', 'Holds multi-party elections every four years', 'Protects press freedom'],
        a: 1,
        e: 'Totalitarian regimes control media, education, economy and political life, banning opposition.',
      },
      {
        q: 'Which economic system combines private enterprise with government regulation and public services?',
        o: ['Mixed economy', 'Pure feudalism', 'Anarchism', 'Absolute communism'],
        a: 0,
        e: 'A mixed economy blends private initiative with state intervention to correct market failures.',
      },
      {
        q: 'According to Marxist theory, the working class that sells its labour in a capitalist society is the:',
        o: ['Bourgeoisie', 'Proletariat', 'Aristocracy', 'Oligarchy'],
        a: 1,
        e: 'Marx called the wage-earning working class the proletariat and the factory-owning class the bourgeoisie.',
      },
    ],
  },
  {
    id: 'govt-constitutions',
    name: 'Constitutions and constitutionalism',
    sec: SEC1,
    goals: [
      'Classify written, unwritten, rigid, flexible, federal and unitary constitutions.',
      'Explain constitutionalism and why a constitution alone does not guarantee limited government.',
    ],
    trap: 'An “unwritten” constitution like Britain’s still has written statutes (like Magna Carta) — it simply is NOT gathered into one single book.',
    parts: [
      {
        title: 'Sources and types of constitutions',
        idea: 'A constitution is the supreme set of rules that establishes the organs of government, defines their powers and guarantees citizens’ rights.',
        terms: [
          ['Written constitution', 'Fundamental rules codified into one single authoritative document (e.g. Nigeria, USA).'],
          ['Unwritten constitution', 'Rules spread across statutes, judicial precedents and conventions rather than one book (e.g. UK).'],
          ['Rigid vs Flexible', 'Rigid requires a special supermajority to amend; flexible can be amended like an ordinary Act.'],
        ],
        rules: [
          'Sources of a constitution include constitutional conferences, Acts of Parliament, judicial decisions, conventions and international treaties.',
          'Written constitutions are usually rigid; unwritten constitutions are usually flexible.',
        ],
        table: {
          headers: ['Type', 'How it is amended', 'Example'],
          rows: [
            ['Written & rigid', 'Special supermajority + state approval', 'Nigeria (1999), USA'],
            ['Unwritten & flexible', 'Ordinary simple majority in Parliament', 'United Kingdom'],
          ],
        },
        example: {
          q: 'Why is Nigeria’s 1999 Constitution classed as rigid?',
          steps: [
            ['Check the amendment rule in Section 9.', 'An amendment needs a two-thirds majority in both federal chambers PLUS approval by at least two-thirds (24) of the 36 State Houses of Assembly.'],
            ['Match to definition.', 'Because it cannot be changed by ordinary law-making, it is rigid.'],
          ],
        },
        yourTurn: {
          q: 'Which statement is TRUE about the British unwritten constitution?',
          o: ['Parts of it are written down in statutes and charters, just not in one single document', 'Not a single British law has ever been written down', 'It cannot be changed by Parliament', 'It bans all constitutional conventions'],
          a: 0,
          h: [
            'Think about famous British documents like the Bill of Rights (1689) and Acts of Parliament.',
            '“Unwritten” means uncodified, not completely oral.',
          ],
          e: 'An unwritten (uncodified) constitution combines written statutes, court rulings and unwritten conventions across many sources.',
        },
      },
      {
        title: 'Constitutionalism and constitutional supremacy',
        idea: 'Constitutionalism means rulers actually obey the constitution in practice, accepting clear limits on their power so citizens’ rights stay safe.',
        terms: [
          ['Constitutionalism', 'The principle that government authority is limited by law and rulers must obey the constitution.'],
          ['Constitutional supremacy', 'The constitution overrides every other law; any conflicting law is void.'],
          ['Conventions', 'Unwritten political habits respected as binding even though courts may not enforce them.'],
        ],
        rules: [
          'A country can have a written constitution on paper without practising constitutionalism if leaders ignore court orders.',
          'Constitutionalism is upheld by judicial review, separation of powers, free elections and an active civil society.',
        ],
        table: {
          headers: ['Principle', 'What it prevents'],
          rows: [
            ['Constitutional supremacy', 'Parliament passing laws that violate fundamental rights'],
            ['Constitutionalism', 'Arbitrary executive rule outside legal limits'],
            ['Judicial review', 'Unchecked breaches of constitutional rules'],
          ],
        },
        example: {
          q: 'If a State Assembly passes a law restricting freedom of movement contrary to Chapter IV of Nigeria’s Constitution, what happens?',
          steps: [
            ['Apply constitutional supremacy.', 'Section 1(3) makes the Constitution supreme over all other laws.'],
            ['Give the legal effect.', 'The conflicting state law is null and void to the extent of its inconsistency.'],
          ],
        },
        yourTurn: {
          q: 'The principle that no leader or organ of government may act above the limits set by the constitution is called:',
          o: ['Constitutionalism', 'Parliamentary sovereignty', 'Oligarchy', 'Delegated legislation'],
          a: 0,
          h: [
            'It describes limited government under the constitution in real practice.',
            'Look for the term ending in “-ism” linked to obeying the constitution.',
          ],
          e: 'Constitutionalism means government power is strictly bound by constitutional limits in practice.',
        },
      },
    ],
    qs: [
      {
        q: 'A flexible constitution is one that can be amended:',
        o: ['Only by a military decree', 'Through the same procedure as ordinary laws', 'Only after a national referendum', 'Only by the Supreme Court'],
        a: 1,
        e: 'Flexible constitutions require no special supermajority beyond ordinary legislative procedure.',
      },
      {
        q: 'Under constitutional supremacy, any ordinary law that conflicts with the constitution is:',
        o: ['Enforced until the next election', 'Null and void to the extent of its inconsistency', 'Automatically added to the constitution', 'Decided by the police'],
        a: 1,
        e: 'The constitution is the supreme law; any inconsistent law is invalid to the extent of the conflict.',
      },
      {
        q: 'Which of the following is a major advantage of a written constitution?',
        o: ['It reduces ambiguity by setting out powers and rights clearly', 'It makes all elections unnecessary', 'It can be altered overnight by one minister', 'It removes the need for courts'],
        a: 0,
        e: 'A written constitution gives citizens and officials a clear, accessible reference for powers and rights.',
      },
      {
        q: 'Unwritten customs observed by politicians as binding political rules — such as a Prime Minister resigning after losing an election — are:',
        o: ['Constitutional conventions', 'Criminal statutes', 'Bye-laws', 'Executive orders'],
        a: 0,
        e: 'Conventions are established political practices respected as constitutional norms.',
      },
      {
        q: 'A country with a written constitution whose leaders routinely disobey court orders lacks:',
        o: ['A territory', 'Constitutionalism', 'A legislature', 'Taxation'],
        a: 1,
        e: 'Constitutionalism requires real obedience to constitutional limits, not merely owning a document.',
      },
      {
        q: 'Which country is the classic example of an unwritten (uncodified) constitution?',
        o: ['Nigeria', 'United Kingdom', 'United States', 'Ghana'],
        a: 1,
        e: 'The United Kingdom relies on statutes, common law and conventions rather than one codified document.',
      },
    ],
  },
  {
    id: 'govt-separation-rule-of-law',
    name: 'Separation of powers, checks and balances, rule of law',
    sec: SEC1,
    goals: [
      'Explain Montesquieu’s separation of powers and how checks and balances prevent tyranny.',
      'State A. V. Dicey’s three pillars of the rule of law and their real-world limitations.',
    ],
    trap: 'Separation of powers does NOT mean the three organs never interact — checks and balances let each organ restrain the others.',
    parts: [
      {
        title: 'Separation of powers and checks and balances',
        idea: 'Baron de Montesquieu argued that liberty is destroyed if the same person makes laws, enforces them and judges breaches. Splitting power and adding checks keeps every branch honest.',
        terms: [
          ['Separation of powers', 'Dividing state authority among distinct legislature, executive and judiciary organs.'],
          ['Checks and balances', 'Constitutional mechanisms letting each branch restrain overreach by the other two.'],
          ['Executive veto', 'Power of the President to withhold assent from a bill (which lawmakers can override with a 2/3 vote).'],
        ],
        rules: [
          'Presidential systems practise stricter separation of powers; parliamentary systems practise fusion of executive and legislature.',
          'Examples of checks: legislative budget approval and impeachment; presidential veto; judicial review by courts.',
        ],
        table: {
          headers: ['Branch checking', 'Branch checked', 'Tool used'],
          rows: [
            ['Legislature', 'Executive', 'Budget control, confirmation of ministers, impeachment'],
            ['Executive', 'Legislature', 'Withholding assent (veto)'],
            ['Judiciary', 'Both', 'Judicial review striking down unconstitutional acts'],
          ],
        },
        example: {
          q: 'In Nigeria, the President nominates ministers, the Senate screens and confirms them, and courts can review ministerial actions. What principle is at work?',
          steps: [
            ['Observe shared oversight.', 'No single organ gets unchecked power over appointments or actions.'],
            ['Name the principle.', 'Checks and balances operating alongside separation of powers.'],
          ],
        },
        yourTurn: {
          q: 'Which French political philosopher is most famously associated with the doctrine of separation of powers?',
          o: ['Baron de Montesquieu', 'A. V. Dicey', 'Karl Marx', 'Max Weber'],
          a: 0,
          h: [
            'He wrote The Spirit of the Laws (1748).',
            'Dicey is linked to the Rule of Law, and Weber to authority types.',
          ],
          e: 'Baron de Montesquieu formulated the modern doctrine of separation of powers in The Spirit of the Laws (1748).',
        },
      },
      {
        title: 'The rule of law and fundamental human rights',
        idea: 'A. V. Dicey popularised the rule of law: law rules over everyone equally, nobody is punished without a fair trial, and fundamental rights are safeguarded by courts.',
        terms: [
          ['Supremacy of law', 'No person is punished except for a clear breach of law proven before an ordinary court.'],
          ['Equality before the law', 'Rich and poor, rulers and citizens alike are subject to the same courts and laws.'],
          ['Fundamental human rights', 'Inalienable entitlements such as life, personal liberty, fair hearing and free speech.'],
        ],
        rules: [
          'Dicey’s 3 principles: supremacy of regular law, equality before the law, and protection of individual liberties.',
          'Practical limits on equality before the law include diplomatic immunity, executive immunity while in office, state of emergency, poverty/legal costs and delegated tribunals.',
        ],
        table: {
          headers: ['Limit on rule of law', 'Why it occurs'],
          rows: [
            ['Executive / diplomatic immunity', 'Shields serving presidents, governors or foreign diplomats from prosecution during tenure'],
            ['State of emergency', 'Temporarily restricts movement or assembly during war or severe crisis'],
            ['High cost of litigation', 'Poor citizens struggle to hire lawyers unless legal aid is provided'],
          ],
        },
        example: {
          q: 'A citizen is detained for three weeks without being charged to court. Which principle of Dicey’s rule of law is violated?',
          steps: [
            ['Recall Dicey’s first pillar.', 'Nobody should be punished or deprived of liberty except for a proven breach of law in court.'],
            ['Identify the right breached.', 'Supremacy of law and the right to personal liberty / fair hearing (remedied by a writ of habeas corpus).'],
          ],
        },
        yourTurn: {
          q: 'A court order requiring authorities to produce a detained person in court and justify their detention is called:',
          o: ['Habeas corpus', 'Vote of confidence', 'Gerrymandering', 'Filibuster'],
          a: 0,
          h: [
            'It is a Latin phrase meaning “you shall have the body”.',
            'Lawyers use this writ to stop unlawful detention without trial.',
          ],
          e: 'A writ of habeas corpus safeguards personal liberty by forcing authorities to bring a detainee before a judge.',
        },
      },
    ],
    qs: [
      {
        q: 'The primary aim of separation of powers is to:',
        o: ['Eliminate the judiciary', 'Prevent tyranny and abuse of concentrated power', 'Speed up military decrees', 'Merge parliament and cabinet'],
        a: 1,
        e: 'Splitting law-making, execution and adjudication stops any single organ from becoming tyrannical.',
      },
      {
        q: 'Who popularised the three classical principles of the Rule of Law?',
        o: ['A. V. Dicey', 'Karl Marx', 'Niccolo Machiavelli', 'Thomas Hobbes'],
        a: 0,
        e: 'British jurist A. V. Dicey articulated the three core principles of the rule of law in 1885.',
      },
      {
        q: 'When the Nigerian National Assembly overrides a Presidential veto with a two-thirds majority in both houses, it is exercising:',
        o: ['Checks and balances', 'Delegated legislation', 'Executive immunity', 'Traditional authority'],
        a: 0,
        e: 'The legislative override checks presidential veto power so neither arm dominates law-making.',
      },
      {
        q: 'Which of the following is an exception to strict equality before the law?',
        o: ['Diplomatic immunity', 'Public court trials', 'Right to a lawyer', 'Written statutes'],
        a: 0,
        e: 'Foreign diplomats enjoy diplomatic immunity from local prosecution under international law.',
      },
      {
        q: 'Fundamental human rights can lawfully be restricted during:',
        o: ['A duly declared state of emergency or by valid court sentence', 'Any politician’s speech', 'Ordinary school holidays', 'A routine election campaign'],
        a: 0,
        e: 'Constitutions permit proportionate limits during emergencies, public health crises or lawful court sentences.',
      },
      {
        q: 'Strict separation of powers operates more closely in a:',
        o: ['Presidential system', 'Parliamentary system', 'Military dictatorship', 'Absolute monarchy'],
        a: 0,
        e: 'Presidential systems separate personnel and tenure between executive and legislature.',
      },
    ],
  },
  {
    id: 'govt-representative',
    name: 'Accountability, responsibility and representative government',
    sec: SEC1,
    goals: [
      'Explain representative government and how citizens hold elected leaders accountable.',
      'Distinguish centralisation from decentralisation, devolution and deconcentration.',
    ],
    trap: 'Devolution transfers real decision-making authority to elected local or regional bodies, while deconcentration merely posts central officials out to field offices.',
    parts: [
      {
        title: 'Representative government and political accountability',
        idea: 'In a representative government, citizens elect officials to act on their behalf and keep them accountable through elections, audits, public hearings and recall.',
        terms: [
          ['Representative government', 'A system where elected citizens govern in trust for the people and renew their mandate periodically.'],
          ['Political accountability', 'Duty of public office-holders to explain their actions and accept consequences for failure.'],
          ['Recall', 'Constitutional process allowing voters in a constituency to remove an underperforming legislator before term ends.'],
        ],
        rules: [
          'Features of representative government: universal adult suffrage, periodic free elections, independent electoral body, multi-party choice and free media.',
          'Accountability tools include legislative oversight, Auditor-General reports, Ombudsman (Public Complaints Commission) and asset declaration (CCB).',
        ],
        table: {
          headers: ['Accountability tool', 'What it checks'],
          rows: [
            ['Periodic elections', 'Overall mandate of leaders'],
            ['Auditor-General & Public Accounts Committee', 'How public money was spent'],
            ['Code of Conduct Bureau (CCB)', 'Assets and conflicts of interest'],
            ['Public Complaints Commission', 'Administrative unfairness to citizens'],
          ],
        },
        example: {
          q: 'How does the Public Complaints Commission (Ombudsman) help ordinary citizens?',
          steps: [
            ['Identify the problem it solves.', 'Citizens often suffer delays, unfair treatment or red tape from public agencies without money for court.'],
            ['State its role.', 'The Ombudsman investigates administrative injustice free of charge and recommends remedies.'],
          ],
        },
        yourTurn: {
          q: 'The constitutional procedure by which voters in a constituency can remove their serving legislator before the next general election is:',
          o: ['Recall', 'Veto', 'Prorogation', 'Dissolution'],
          a: 0,
          h: [
            'Think of voters “calling back” a representative they no longer trust.',
            'Veto is used by a President, not constituency voters.',
          ],
          e: 'Recall enables constituents (through a verified petition and referendum) to remove a legislator mid-term.',
        },
      },
      {
        title: 'Centralisation and decentralisation',
        idea: 'Centralisation concentrates decision-making at the national capital; decentralisation spreads authority outward through deconcentration or devolution.',
        terms: [
          ['Centralisation', 'Concentrating administrative and political power in a single central authority.'],
          ['Deconcentration', 'Posting branch offices of central ministries to states or districts while keeping final control at the centre.'],
          ['Devolution', 'Transferring autonomous legal powers to elected sub-national or local bodies.'],
        ],
        rules: [
          'Decentralisation brings government closer to rural communities, speeds up local solutions and trains local leaders.',
          'Excessive centralisation causes red tape and ignores local needs; poorly supervised decentralisation can create uneven standards.',
        ],
        table: {
          headers: ['Form', 'Who holds final decision power?'],
          rows: [
            ['Centralisation', 'Headquarters only'],
            ['Deconcentration', 'Headquarters via field branches'],
            ['Devolution', 'Elected local / regional bodies'],
          ],
        },
        example: {
          q: 'A federal ministry opens a branch office in Enugu run by staff who still take all orders from Abuja. Is this devolution or deconcentration?',
          steps: [
            ['Check who controls decisions.', 'Final authority stays with the headquarters in Abuja.'],
            ['Classify accurately.', 'That is administrative deconcentration, not political devolution.'],
          ],
        },
        yourTurn: {
          q: 'Which form of decentralisation gives elected regional or local councils independent law-making power over local matters?',
          o: ['Devolution', 'Deconcentration', 'Centralisation', 'Totalitarianism'],
          a: 0,
          h: [
            'Compare sending headquarters staff to a field office versus transferring genuine autonomy.',
            'Devolution hands over real decision-making authority.',
          ],
          e: 'Devolution transfers autonomous decision-making and service powers to elected sub-national governments.',
        },
      },
    ],
    qs: [
      {
        q: 'Which institution is Nigeria’s Ombudsman for investigating administrative injustice against citizens?',
        o: ['Public Complaints Commission', 'Central Bank of Nigeria', 'Armed Forces Council', 'Federal Character Commission'],
        a: 0,
        e: 'The Public Complaints Commission investigates complaints of administrative maladministration.',
      },
      {
        q: 'Representative government depends fundamentally on:',
        o: ['The consent of the governed expressed through free elections', 'Hereditary titles', 'Military decrees', 'Banning opposition parties'],
        a: 0,
        e: 'Representative government derives its legitimacy from voters choosing representatives freely.',
      },
      {
        q: 'Opening regional branch offices of a central agency that still obey headquarters in every decision is:',
        o: ['Deconcentration', 'Devolution', 'Confederalism', 'Secession'],
        a: 0,
        e: 'Deconcentration disperses offices geographically while keeping decision power at the centre.',
      },
      {
        q: 'A key advantage of decentralisation is that it:',
        o: ['Reduces workload at the centre and encourages grassroots participation', 'Abolishes all national standards', 'Eliminates local taxation', 'Stops citizens from voting'],
        a: 0,
        e: 'Decentralisation relieves central congestion and involves local people in solving local problems.',
      },
      {
        q: 'In Nigeria, public officers declare their assets to promote accountability before the:',
        o: ['Code of Conduct Bureau', 'National Youth Service Corps', 'Nigerian Railway Corporation', 'Standards Organisation of Nigeria'],
        a: 0,
        e: 'The Code of Conduct Bureau monitors asset declarations and enforces public-service ethics.',
      },
      {
        q: 'Which of the following weakens political accountability in a democracy?',
        o: ['An independent press', 'Electoral rigging and voter apathy', 'Transparent public audits', 'Legislative oversight hearings'],
        a: 1,
        e: 'Rigged elections and voter apathy break the link between citizens’ wishes and leaders’ survival in office.',
      },
    ],
  },
  {
    id: 'govt-legislation-process',
    name: 'The process of legislation',
    sec: SEC1,
    goals: [
      'Distinguish public bills, private bills, private member’s bills and money bills.',
      'Trace every stage a bill passes through before becoming an Act of Parliament.',
    ],
    trap: 'The First Reading involves NO debate — the Clerk simply reads the bill’s title and prints it for lawmakers.',
    parts: [
      {
        title: 'Types of bills',
        idea: 'A proposed law is called a bill; once passed by the legislature and signed (assented to) by the President or Governor, it becomes an Act or Law.',
        terms: [
          ['Public bill', 'A bill affecting the whole country or general public, usually sponsored by the executive.'],
          ['Private member’s bill', 'A public bill introduced by an individual legislator who is not acting for the executive.'],
          ['Private bill', 'A bill affecting only a specific person, company or local body.'],
          ['Money bill (Appropriation)', 'A bill dealing with taxation, public revenue or government spending.'],
        ],
        rules: [
          'Before assent it is a “bill”; after assent at the federal level it is an “Act”, and at the state level a “Law”.',
          'Rules made by local government councils are called “bye-laws”.',
        ],
        table: {
          headers: ['Bill type', 'Who sponsors it', 'Who it affects'],
          rows: [
            ['Executive (public) bill', 'President / Minister', 'Entire public'],
            ['Private member’s bill', 'Individual Senator / Rep', 'Entire public'],
            ['Private bill', 'Interested group via MP', 'Specific company / locality'],
            ['Money bill', 'Executive (Finance)', 'National revenue & budget'],
          ],
        },
        example: {
          q: 'A Senator who is not a minister introduces a bill to establish a national scholarship fund for all Nigerian students. What kind of bill is it?',
          steps: [
            ['Check who it affects.', 'It affects the general public (all Nigerian students), so it is a public-interest bill.'],
            ['Check who introduced it.', 'An ordinary legislator, not the executive — therefore it is a Private Member’s Bill.'],
          ],
        },
        yourTurn: {
          q: 'A bill sponsored by the executive to authorise annual government expenditure is called a:',
          o: ['Money (Appropriation) bill', 'Private bill', 'Bye-law', 'Judicial decree'],
          a: 0,
          h: [
            'Focus on national revenue and public spending.',
            'At the start of each fiscal year the President lays the budget before the National Assembly.',
          ],
          e: 'Money or Appropriation bills deal with taxation, public funds and the annual budget.',
        },
      },
      {
        title: 'Stages of passing a bill into law',
        idea: 'Bills pass through structured stages — First Reading, Second Reading, Committee Stage, Report Stage, Third Reading, second chamber concurrence and Presidential Assent.',
        terms: [
          ['Second Reading', 'Stage where lawmakers debate the broad principles and merits of the bill.'],
          ['Committee Stage', 'Detailed clause-by-clause scrutiny, public hearings and amendments.'],
          ['Assent / Veto override', 'The President signs the bill within 30 days, or both chambers override a veto by a 2/3 majority.'],
        ],
        rules: [
          'Order of stages: Drafting → First Reading (title only) → Second Reading (general principles) → Committee Stage (clause-by-clause) → Report Stage → Third Reading (final vote) → Other Chamber → Presidential Assent.',
          'In Nigeria, if the President withholds assent, a two-thirds majority of BOTH the Senate and House of Representatives turns the bill into an Act without the President’s signature.',
        ],
        table: {
          headers: ['Stage', 'What happens'],
          rows: [
            ['First Reading', 'Clerk reads the title; no debate'],
            ['Second Reading', 'Full debate on core principles; vote to proceed'],
            ['Committee Stage', 'Clause-by-clause examination and amendments'],
            ['Third Reading', 'Final review and vote to pass the chamber'],
            ['Assent', 'President signs bill into an Act (or 2/3 override)'],
          ],
        },
        example: {
          q: 'At which stage do citizens and experts usually testify at public hearings to suggest wording changes to specific clauses?',
          steps: [
            ['Recall the purpose of each stage.', 'First Reading has no debate; Second Reading debates broad principles only.'],
            ['Identify the detailed scrutiny stage.', 'The Committee Stage examines every clause in detail and holds public hearings.'],
          ],
        },
        yourTurn: {
          q: 'During which legislative stage is a bill examined clause by clause for detailed amendments?',
          o: ['Committee Stage', 'First Reading', 'Presidential Assent', 'Dissolution'],
          a: 0,
          h: [
            'Second Reading covers the big picture, while a smaller specialist group checks every sentence.',
            'Which stage takes place inside a standing or whole-house committee?',
          ],
          e: 'At the Committee Stage, lawmakers scrutinise the bill clause by clause and propose amendments.',
        },
      },
    ],
    qs: [
      {
        q: 'What happens during the First Reading of a bill?',
        o: ['The Clerk reads the bill’s title with no debate', 'The President signs the bill', 'Lawmakers amend every clause', 'Judges review the bill'],
        a: 0,
        e: 'First Reading merely introduces the bill by title and orders it to be printed.',
      },
      {
        q: 'In Nigeria, a bill passed by the National Assembly becomes law without Presidential assent if:',
        o: ['The Senate President signs it alone', 'Both chambers pass it again by a two-thirds majority', 'The Inspector-General of Police approves it', 'Fifty citizens sign a petition'],
        a: 1,
        e: 'Section 58(5) allows a two-thirds majority of each chamber to override a presidential veto.',
      },
      {
        q: 'The broad principles and general merits of a bill are debated at the:',
        o: ['First Reading', 'Second Reading', 'Assent Stage', 'Gazette Stage'],
        a: 1,
        e: 'Second Reading is the decisive debate on whether the bill’s overall purpose deserves support.',
      },
      {
        q: 'A law passed by a Nigerian State House of Assembly and signed by the Governor is formally called a:',
        o: ['Law', 'Decree', 'Bye-law', 'Treaty'],
        a: 0,
        e: 'Federal enactments are Acts, state enactments are Laws, and local council rules are bye-laws.',
      },
      {
        q: 'When the Senate and House of Representatives pass slightly different versions of the same bill, they reconcile them through a:',
        o: ['Joint Conference Committee', 'Cabinet reshuffle', 'Electoral tribunal', 'Referendum'],
        a: 0,
        e: 'A Joint Conference Committee harmonises differences between the two chambers before final passage.',
      },
      {
        q: 'Prolonged speech-making used by a minority of lawmakers to delay a vote on a bill is known as:',
        o: ['Filibustering', 'Gerrymandering', 'Impeachment', 'Prorogation'],
        a: 0,
        e: 'Filibustering uses extended debate to stall or block a legislative vote.',
      },
    ],
  },
  {
    id: 'govt-citizenship-culture',
    name: 'Citizenship, political socialisation and culture',
    sec: SEC1,
    goals: [
      'State the ways Nigerian citizenship is acquired and when it can be lost.',
      'Explain political socialisation, political culture and political participation.',
    ],
    trap: 'A citizen by birth in Nigeria CANNOT be stripped of citizenship — only citizens by registration or naturalisation can have theirs revoked.',
    parts: [
      {
        title: 'Citizenship: acquisition, duties and loss',
        idea: 'A citizen is a full legal member of a state who enjoys constitutional rights and owes civic duties such as obeying laws, paying taxes and defending the country.',
        terms: [
          ['Citizenship by birth', 'Acquired through Nigerian parents/grandparents (jus sanguinis) or birthplace where applicable (jus soli).'],
          ['Registration', 'Available to foreign spouses of Nigerians or persons of Nigerian descent born abroad who apply and swear allegiance.'],
          ['Naturalisation', 'Granted to a foreign adult who meets residency (15 years in Nigeria), good character and integration requirements.'],
        ],
        rules: [
          'Citizenship by birth cannot be forfeited or revoked by the government in Nigeria.',
          'Naturalised citizens may lose citizenship if convicted of treason/disloyalty or imprisoned for 3+ years within 7 years of naturalisation.',
          'Aliens enjoy basic human rights (like life and fair trial) but cannot vote or hold political office.',
        ],
        table: {
          headers: ['Mode in Nigeria', 'Who qualifies', 'Can be revoked?'],
          rows: [
            ['Birth', 'Parent or grandparent belongs to a Nigerian indigenous community', 'No'],
            ['Registration', 'Foreign spouse of a Nigerian / person of Nigerian descent', 'Yes (for disloyalty/fraud)'],
            ['Naturalisation', 'Resident foreigner (15 years), good character, accepted by local community', 'Yes (for disloyalty/serious crime)'],
          ],
        },
        example: {
          q: 'A Ghanaian engineer has lived peacefully in Lagos for 16 years, speaks Yoruba, pays taxes and is endorsed by the local community. Which route to Nigerian citizenship fits him?',
          steps: [
            ['Check parentage and marriage.', 'He has no Nigerian parents and is not applying via marriage.'],
            ['Match residency and integration.', '15+ years of residence and local community acceptance qualify him for naturalisation.'],
          ],
        },
        yourTurn: {
          q: 'Under Nigeria’s Constitution, which category of citizen can NEVER have their citizenship revoked by the President?',
          o: ['Citizen by birth', 'Citizen by naturalisation', 'Citizen by registration', 'Honorary resident'],
          a: 0,
          h: [
            'Naturalisation and registration are granted by application and carry conditions.',
            'Which mode of citizenship is permanently protected?',
          ],
          e: 'Citizenship by birth is irrevocable under Nigeria’s Constitution.',
        },
      },
      {
        title: 'Political socialisation, political culture and participation',
        idea: 'Political socialisation is how people pick up political attitudes and values across life; political culture is the shared pattern of beliefs about politics in a country.',
        terms: [
          ['Political socialisation', 'Lifelong process of learning political norms through family, school, peers, media and parties.'],
          ['Political culture', 'Collective attitudes, beliefs and emotions of citizens towards their political system.'],
          ['Political participation', 'Active involvement in politics — voting, campaigning, petitioning or contesting office.'],
        ],
        rules: [
          'Almond and Verba identified three types of political culture: parochial (low awareness), subject (obeys government passively) and participant (actively engages and demands accountability).',
          'The family is the first and most foundational agent of political socialisation.',
        ],
        table: {
          headers: ['Political culture type', 'Citizen awareness', 'Citizen role'],
          rows: [
            ['Parochial', 'Very low awareness of national politics', 'Focused only on local village affairs'],
            ['Subject', 'Aware of government outputs', 'Passively obeys laws without active input'],
            ['Participant', 'High awareness of rights and processes', 'Votes, petitions and holds leaders accountable'],
          ],
        },
        example: {
          q: 'Students hold a mock election in secondary school and debate manifesto promises. Which agent of political socialisation is acting?',
          steps: [
            ['Identify the setting.', 'The activity takes place inside an educational institution.'],
            ['State the agent.', 'The school is socialising students into democratic norms and participant culture.'],
          ],
        },
        yourTurn: {
          q: 'In Almond and Verba’s classification, citizens who know how government works, vote regularly and actively petition lawmakers display a:',
          o: ['Participant political culture', 'Parochial political culture', 'Subject political culture', 'Feudal political culture'],
          a: 0,
          h: [
            'Look at the word describing active involvement in both inputs and outputs of government.',
            'Parochial means unaware; subject means passive obedience.',
          ],
          e: 'A participant political culture features informed citizens who actively engage in shaping public decisions.',
        },
      },
    ],
    qs: [
      {
        q: 'Which is universally regarded as the primary (first) agent of political socialisation?',
        o: ['The family', 'The Supreme Court', 'The stock exchange', 'Foreign embassies'],
        a: 0,
        e: 'Children first absorb attitudes toward authority, fairness and community within the family.',
      },
      {
        q: 'How many years of continuous residence in Nigeria are normally required to apply for citizenship by naturalisation?',
        o: ['3 years', '5 years', '15 years', '30 years'],
        a: 2,
        e: 'Nigeria’s 1999 Constitution specifies an aggregate or continuous residency period of 15 years for naturalisation.',
      },
      {
        q: 'Which right belongs strictly to citizens and NOT to resident aliens?',
        o: ['Right to life', 'Right to vote and contest public office', 'Protection by the police', 'Right to own personal clothes'],
        a: 1,
        e: 'Political rights such as voting and standing for election are reserved for citizens.',
      },
      {
        q: 'Citizens who know government exists and obey its taxes and laws, yet feel powerless to influence policy, exhibit a:',
        o: ['Subject political culture', 'Participant political culture', 'Parochial political culture', 'Anarchist culture'],
        a: 0,
        e: 'A subject political culture is aware of government authority but remains passive regarding political input.',
      },
      {
        q: 'Which of the following is a civic duty of every Nigerian citizen?',
        o: ['Paying lawful taxes promptly', 'Joining only the ruling party', 'Ignoring jury or witness summons', 'Avoiding voter registration'],
        a: 0,
        e: 'Paying taxes honestly funds public infrastructure and services.',
      },
      {
        q: 'Refusal of eligible citizens to register or turn out on election day is called:',
        o: ['Political apathy', 'Political socialisation', 'Naturalisation', 'Franchise'],
        a: 0,
        e: 'Political apathy is indifference or lack of interest in political participation.',
      },
    ],
  },
  {
    id: 'govt-electoral-process',
    name: 'Electoral process and electoral systems',
    sec: SEC1,
    goals: [
      'Compare simple plurality (FPTP), absolute majority, proportional representation and electoral college systems.',
      'Explain suffrage, constituencies, gerrymandering and the conditions for free and fair elections.',
    ],
    trap: 'Simple plurality (First-Past-the-Post) lets a candidate win with less than 50% of votes — only absolute majority requires over 50%.',
    parts: [
      {
        title: 'Franchise, constituencies and free elections',
        idea: 'Elections let citizens choose leaders peacefully. Fair elections need an independent electoral commission, an accurate voter register, secret ballots and equal constituencies.',
        terms: [
          ['Franchise (suffrage)', 'The legal right of qualified adult citizens to vote (universal adult suffrage in Nigeria starts at 18).'],
          ['Constituency', 'A geographical area represented by one or more elected lawmakers.'],
          ['Gerrymandering', 'Unfairly redrawing constituency boundaries to favour one political party.'],
        ],
        rules: [
          'Direct elections let voters pick candidates directly; indirect elections use an intermediate Electoral College.',
          'Requirements for free and fair elections: independent umpire (e.g. INEC), secret ballot, accurate voter roll, equal media access and impartial election tribunals.',
        ],
        table: {
          headers: ['Term', 'Meaning'],
          rows: [
            ['Universal adult suffrage', 'All sane adult citizens (18+ in Nigeria) can vote regardless of wealth or gender'],
            ['Limited / restricted franchise', 'Voting restricted by property, tax, education or gender'],
            ['Secret ballot', 'Voters mark choices privately to prevent intimidation'],
            ['Gerrymandering', 'Manipulating district lines for partisan advantage'],
          ],
        },
        example: {
          q: 'Why is the secret ballot considered vital for free elections?',
          steps: [
            ['Consider what happens with open voting.', 'Employers, landlords or political thugs can intimidate or punish voters who pick rivals.'],
            ['State the safeguard.', 'Secret balloting protects each voter’s freedom of conscience.'],
          ],
        },
        yourTurn: {
          q: 'Deliberately reshaping electoral district boundaries so one party wins extra seats is known as:',
          o: ['Gerrymandering', 'Recall', 'Proportional representation', 'Universal suffrage'],
          a: 0,
          h: [
            'It is named after a 19th-century governor whose oddly shaped district looked like a salamander.',
            'It manipulates constituency maps rather than ballot counting.',
          ],
          e: 'Gerrymandering distorts constituency boundaries to give a party an unfair seat advantage.',
        },
      },
      {
        title: 'Electoral systems compared',
        idea: 'Different electoral systems turn votes into seats in different ways: simple plurality rewards the highest scorer, absolute majority demands over 50%, and proportional representation allocates seats matching vote share.',
        terms: [
          ['Simple plurality (FPTP)', 'The candidate with the highest number of votes wins, even without 50% (used for Nigerian legislative seats).'],
          ['Absolute majority', 'Winner must obtain more than 50% of valid votes (otherwise a run-off / second ballot is held).'],
          ['Proportional representation', 'Parties receive parliamentary seats roughly in proportion to their total percentage of votes.'],
        ],
        rules: [
          'Simple plurality is easy to understand and produces decisive governments, but wastes losing votes and under-represents small parties.',
          'Proportional representation reflects minority voices fairly, but often leads to unstable coalition governments.',
          'Nigeria’s presidential election adds a geographic spread rule: highest votes PLUS at least 25% in at least two-thirds (24) of the 36 states.',
        ],
        table: {
          headers: ['System', 'Winning rule', 'Main strength / weakness'],
          rows: [
            ['Simple plurality (FPTP)', 'Most votes wins', 'Simple & stable / can win with < 50%'],
            ['Absolute majority', '50% + 1 vote (or run-off)', 'Broad backing / extra cost of run-off'],
            ['Proportional representation', 'Seats match % of votes', 'Fair to minorities / frequent coalitions'],
          ],
        },
        example: {
          q: 'In a three-way race, Candidate A gets 42%, B gets 35% and C gets 23%. Who wins under simple plurality vs absolute majority?',
          steps: [
            ['Apply simple plurality.', 'Candidate A has the highest vote (42%) and wins immediately.'],
            ['Apply absolute majority.', 'Nobody reached > 50%, so Candidates A and B enter a run-off (second ballot).'],
          ],
        },
        yourTurn: {
          q: 'Which electoral system gives small minority parties parliamentary seats roughly matching their share of total votes?',
          o: ['Proportional representation', 'Simple plurality', 'Single-member FPTP', 'Appointed council'],
          a: 0,
          h: [
            'Look for the system whose name means seats are awarded in exact ratio to votes.',
            'Under FPTP, a party winning 15% everywhere could still get zero seats.',
          ],
          e: 'Proportional representation awards seats in proportion to each party’s vote share.',
        },
      },
    ],
    qs: [
      {
        q: 'In Nigeria, the minimum voting age under universal adult suffrage is:',
        o: ['16 years', '18 years', '21 years', '25 years'],
        a: 1,
        e: 'Nigerian citizens aged 18 and above are eligible to register and vote.',
      },
      {
        q: 'A major criticism of the First-Past-the-Post (simple plurality) system is that:',
        o: ['It is too slow to count', 'A candidate can win without winning over half of the votes cast', 'It bans multi-party competition', 'It forces coalition cabinets'],
        a: 1,
        e: 'In multi-candidate races, a plurality winner may be opposed by a combined majority of voters.',
      },
      {
        q: 'An election held to fill a single legislative seat vacated by death or resignation is called a:',
        o: ['Bye-election', 'General election', 'Referendum', 'Plebiscite'],
        a: 0,
        e: 'A bye-election fills an individual vacancy between general elections.',
      },
      {
        q: 'In an indirect election (such as the US presidential Electoral College), voters:',
        o: ['Vote for electors who then choose the final office-holder', 'Vote directly for cabinet ministers', 'Cannot belong to political parties', 'Vote in open voice roll-calls'],
        a: 0,
        e: 'Indirect elections use an intermediate body of electors chosen by the voters.',
      },
      {
        q: 'To win Nigeria’s presidential election on the first ballot, a candidate must score the highest votes AND at least:',
        o: ['25% of votes in at least two-thirds of the states', '50% in every local government', '10% in 10 states', '75% nationwide'],
        a: 0,
        e: 'Nigeria’s Constitution requires both a nationwide plurality and at least 25% in at least two-thirds of states (24 states).',
      },
      {
        q: 'Which body conducts federal and state governorship elections in Nigeria?',
        o: ['INEC', 'SIEC', 'EFCC', 'NJC'],
        a: 0,
        e: 'The Independent National Electoral Commission (INEC) conducts federal and state-level elections, while SIECs run local council polls.',
      },
    ],
  },
  {
    id: 'govt-parties-pressure',
    name: 'Political parties, pressure groups and public opinion',
    sec: SEC1,
    goals: [
      'Contrast political parties with pressure groups in aim, structure and methods.',
      'Explain party systems (one-party, two-party, multi-party) and how public opinion is formed and measured.',
    ],
    trap: 'Pressure groups try to INFLUENCE government policy — they do NOT contest elections to form the government.',
    parts: [
      {
        title: 'Political parties and party systems',
        idea: 'A political party is an organised group of people sharing political principles who contest elections to win and exercise government power.',
        terms: [
          ['Manifesto', 'A party’s published statement of policies and promises to voters.'],
          ['Two-party system', 'Two major parties alternate in power even if smaller parties exist (e.g. USA).'],
          ['Multi-party system', 'Three or more parties compete seriously for votes and seats (e.g. Nigeria).'],
        ],
        rules: [
          'Core functions of parties: recruit leaders, educate voters, aggregate interests, present manifestos and form either government or loyal opposition.',
          'One-party systems risk dictatorship; two-party systems aid stability; multi-party systems widen choice but can cause coalitions.',
        ],
        table: {
          headers: ['Party system', 'Main advantage', 'Main disadvantage'],
          rows: [
            ['One-party', 'Quick decisions, less partisan friction', 'Suppresses dissent and encourages dictatorship'],
            ['Two-party', 'Clear choice and stable governments', 'Narrows ideological options'],
            ['Multi-party', 'Represents diverse groups fairly', 'May create fragile coalitions'],
          ],
        },
        example: {
          q: 'Why does a healthy democracy need an opposition party?',
          steps: [
            ['Check what happens without critics.', 'A government without rivals faces little scrutiny over spending or rights.'],
            ['State the role.', 'The opposition criticises policy, exposes waste and offers voters a ready alternative government.'],
          ],
        },
        yourTurn: {
          q: 'Which document sets out a political party’s programme and promises before an election?',
          o: ['Manifesto', 'Gazette', 'Affidavit', 'White paper'],
          a: 0,
          h: [
            'Voters read this document to compare what each party plans to do in office.',
            'A White Paper is issued by government after a panel report, not as a campaign pledge.',
          ],
          e: 'A party manifesto presents the party’s policies and goals to the electorate.',
        },
      },
      {
        title: 'Pressure groups and public opinion',
        idea: 'Pressure groups (like NLC, NBA, NMA or ASUU) defend their members’ interests or public causes by lobbying, strikes or media campaigns; public opinion is the prevailing view of citizens on public issues.',
        terms: [
          ['Economic / occupational pressure group', 'Protects workers or professions — e.g. Nigeria Labour Congress (NLC), Nigerian Bar Association (NBA).'],
          ['Promotional (cause) group', 'Campaigns for a broad public cause rather than members’ pay — e.g. human rights or environmental groups.'],
          ['Anomic pressure group', 'Spontaneous, unorganised crowd protest that erupts suddenly over a grievance.'],
        ],
        rules: [
          'Pressure groups influence policy through lobbying, petitions, boycotts, strikes, peaceful demonstrations and court action — without seeking to run government.',
          'Public opinion is measured through opinion polls, elections, referenda, letters/media commentary and public hearings.',
        ],
        table: {
          headers: ['Feature', 'Political party', 'Pressure group'],
          rows: [
            ['Main aim', 'Win elections and control government', 'Influence government policy'],
            ['Membership scope', 'Broad across society', 'Often narrow (profession, trade or cause)'],
            ['Puts up candidates?', 'Yes', 'No'],
          ],
        },
        example: {
          q: 'The Nigerian Medical Association (NMA) lobbies the Ministry of Health for better hospital equipment and doctors’ allowances. What kind of group is NMA?',
          steps: [
            ['Check if NMA contests elections.', 'No — it seeks to influence health policy.'],
            ['Classify its type.', 'Because it represents a specific profession’s welfare, it is an occupational / sectional pressure group.'],
          ],
        },
        yourTurn: {
          q: 'What is the clearest difference between a political party and a pressure group?',
          o: ['A political party seeks to capture political power through elections, while a pressure group only seeks to influence policy', 'Pressure groups never speak to lawmakers', 'Political parties have no leaders', 'Pressure groups write national constitutions'],
          a: 0,
          h: [
            'Compare their ultimate goal regarding control of government.',
            'Both may campaign and educate citizens, so focus on contesting office.',
          ],
          e: 'Political parties contest elections to form government; pressure groups seek to influence policy without governing.',
        },
      },
    ],
    qs: [
      {
        q: 'The Nigeria Labour Congress (NLC) and Academic Staff Union of Universities (ASUU) are examples of:',
        o: ['Occupational pressure groups', 'Political parties', 'Judicial commissions', 'Electoral colleges'],
        a: 0,
        e: 'Both protect the working conditions and interests of specific worker groups without contesting elections.',
      },
      {
        q: 'Persuading lawmakers privately to support or amend a bill is a pressure-group tactic called:',
        o: ['Lobbying', 'Filibustering', 'Impeachment', 'Privatisation'],
        a: 0,
        e: 'Lobbying involves direct persuasion of legislators or officials to shape policy decisions.',
      },
      {
        q: 'Which of the following is the most scientific method of measuring public opinion between elections?',
        o: ['Opinion polls based on representative sampling', 'Rumours at a single market', 'Decrees by a minister', 'Secret cabinet minutes'],
        a: 0,
        e: 'Well-designed opinion polls sample diverse segments of the public to gauge prevailing views.',
      },
      {
        q: 'A spontaneous, unorganised protest that breaks out suddenly without formal leadership is an:',
        o: ['Anomic pressure group', 'Institutional group', 'Cadre party', 'Two-party system'],
        a: 0,
        e: 'Anomic pressure groups arise spontaneously in response to immediate frustration.',
      },
      {
        q: 'Combining diverse citizen demands into a coherent policy programme is the party function known as:',
        o: ['Interest aggregation', 'Judicial review', 'Deconcentration', 'Gerrymandering'],
        a: 0,
        e: 'Parties aggregate varied societal interests into broader policy platforms.',
      },
      {
        q: 'Which factor can distort public opinion in a country?',
        o: ['Media censorship and widespread illiteracy', 'Free independent newspapers', 'Public town-hall debates', 'Regular opinion surveys'],
        a: 0,
        e: 'Censorship and low access to accurate information hinder informed public opinion.',
      },
    ],
  },
  {
    id: 'govt-civil-service-corps',
    name: 'Civil service, public corporations and local government',
    sec: SEC1,
    goals: [
      'State the five classic principles of the civil service and how it differs from public corporations.',
      'Explain why local government exists and how central/state authorities supervise it.',
    ],
    trap: 'Civil servants are anonymous and politically neutral — the Minister, NOT the Permanent Secretary, takes public credit or blame in Parliament.',
    parts: [
      {
        title: 'The civil service and public corporations',
        idea: 'The civil service is the permanent body of professional administrators who advise ministers and implement policy; public corporations are state-owned bodies set up by law to run commercial or utility services efficiently.',
        terms: [
          ['Anonymity', 'Civil servants work behind the scenes; ministers take public responsibility for ministry actions.'],
          ['Political neutrality', 'Civil servants serve whichever party wins power without partisan bias.'],
          ['Public corporation', 'A state enterprise created by an Act of Parliament with its own legal personality and board (e.g. NNPC/FAAN/NPA).'],
        ],
        rules: [
          'Core civil service traits: permanence, neutrality, anonymity, impartiality, expertise and hierarchy (bureaucracy).',
          'Public corporations enjoy greater financial and operational flexibility than ministries so they can deliver essential services without ministry red tape.',
        ],
        table: {
          headers: ['Feature', 'Civil service ministry', 'Public corporation'],
          rows: [
            ['Political head', 'Minister / Commissioner', 'Board of Directors'],
            ['Administrative head', 'Permanent Secretary', 'Managing Director / General Manager'],
            ['Main purpose', 'Policy advice & core administration', 'Essential utility / commercial service'],
            ['Funding', 'Annual government budget', 'Government grant + user charges/fees'],
          ],
        },
        example: {
          q: 'Why does a Permanent Secretary stay in office after a general election brings in a new President and new Ministers?',
          steps: [
            ['Recall civil service principles.', 'Permanence and political neutrality ensure continuity of government records and administration.'],
            ['Apply the principle.', 'Political heads change with elections, while career civil servants provide institutional memory.'],
          ],
        },
        yourTurn: {
          q: 'Which principle requires civil servants to avoid partisan politics and serve any elected government loyally?',
          o: ['Political neutrality', 'Red tape', 'Privatisation', 'Collective bargaining'],
          a: 0,
          h: [
            'Think about staying non-partisan when power changes hands.',
            'Anonymity is about staying out of the press; this principle is about not taking party sides.',
          ],
          e: 'Political neutrality obliges civil servants to serve every lawful government impartially.',
        },
      },
      {
        title: 'Local government: purpose and control',
        idea: 'Local government is the third tier of government created to bring basic services — primary schools, markets, rural roads and health centres — close to grassroots communities.',
        terms: [
          ['Local government', 'Grassroots political authority established by law with elected councillors to manage local affairs.'],
          ['Bye-laws', 'Local rules enacted by a local government council for its area (e.g. market sanitation).'],
          ['Red tape', 'Excessive adherence to rigid official routines that slows down public service delivery.'],
        ],
        rules: [
          'Local governments raise internal revenue (market rates, tenement rates, licences) and receive statutory allocations from higher tiers.',
          'Controls over local government include legislative oversight, judicial review (ultra vires), audit of accounts and ministry guidelines.',
        ],
        table: {
          headers: ['Function of local government', 'Control mechanism'],
          rows: [
            ['Building/maintaining markets & motor parks', 'External financial auditing'],
            ['Primary healthcare & basic sanitation', 'Courts striking down ultra vires bye-laws'],
            ['Registration of births, deaths & marriages', 'State/federal statutory guidelines'],
          ],
        },
        example: {
          q: 'A local government council passes a bye-law attempting to regulate international aviation. What will a court do?',
          steps: [
            ['Check the council’s legal powers.', 'Aviation is on the federal Exclusive List, far outside local powers.'],
            ['Apply judicial control.', 'The court declares the bye-law ultra vires (beyond its powers) and void.'],
          ],
        },
        yourTurn: {
          q: 'Excessive adherence to rigid forms and bureaucratic routines that delays decisions in the civil service is commonly called:',
          o: ['Red tape', 'Anonymity', 'Devolution', 'Naturalisation'],
          a: 0,
          h: [
            'It is a two-word idiom referring to the ribbon once used to tie thick official files.',
            'It describes slow bureaucratic delay.',
          ],
          e: 'Red tape (red-tapism) refers to excessive bureaucratic formality that slows down public administration.',
        },
      },
    ],
    qs: [
      {
        q: 'The civil service principle that prevents civil servants from taking public credit or blame for ministry policy is:',
        o: ['Anonymity', 'Permanence', 'Hierarchy', 'Commercialisation'],
        a: 0,
        e: 'Under anonymity, civil servants remain out of public partisan debate while ministers answer publicly.',
      },
      {
        q: 'Who serves as the chief accounting and administrative officer of a Nigerian federal ministry?',
        o: ['Permanent Secretary', 'Senate President', 'Chief Justice', 'Chairman of INEC'],
        a: 0,
        e: 'The Permanent Secretary is the career administrative head of a ministry beneath the political Minister.',
      },
      {
        q: 'Public corporations are established primarily to:',
        o: ['Provide essential services efficiently with less bureaucratic delay', 'Replace the judiciary', 'Conduct national elections', 'Abolish private trade'],
        a: 0,
        e: 'Public corporations deliver strategic utilities and services with greater operational autonomy than ministries.',
      },
      {
        q: 'When a court cancels a local council bye-law because the council acted outside its legal authority, the bye-law is declared:',
        o: ['Ultra vires', 'Habeas corpus', 'De facto', 'Bicameral'],
        a: 0,
        e: 'Ultra vires means “beyond the powers” granted by law.',
      },
      {
        q: 'Which of the following is an internal source of revenue for local governments?',
        o: ['Market stall fees and tenement rates', 'Crude oil export royalties', 'Customs duties at seaports', 'Printing national currency'],
        a: 0,
        e: 'Local councils collect market fees, motor-park dues, licences and tenement rates.',
      },
      {
        q: 'A key advantage of local government is that it:',
        o: ['Encourages grassroots democracy and trains future national leaders', 'Eliminates the need for a national constitution', 'Controls foreign policy', 'Commands the armed forces'],
        a: 0,
        e: 'Local government brings governance close to citizens and serves as a training ground for democratic leadership.',
      },
    ],
  },
];
