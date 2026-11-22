import type { UtmeTopicSpec } from './builder';

const SEC3 = 'Section 3: Foreign policy and international organisations';

export const GOVT_SEC3_SPECS: UtmeTopicSpec[] = [
  {
    id: 'govt-foreign-policy-basics',
    name: 'Foreign policy: aims, determinants and instruments',
    sec: SEC3,
    goals: [
      'Define foreign policy and national interest and list key domestic and external determinants.',
      'Compare the instruments of foreign policy: diplomacy, trade, aid, propaganda and military force.',
    ],
    trap: 'National interest — NOT permanent friendship — drives foreign policy: states have no permanent friends or enemies, only permanent interests.',
    parts: [
      {
        title: 'Aims and determinants of foreign policy',
        idea: 'Foreign policy is the set of strategies a country uses to interact with other states and global organisations in order to protect its national interest.',
        terms: [
          ['Foreign policy', 'Official goals and actions guiding a state’s relations with other countries.'],
          ['National interest', 'Core survival, security, economic prosperity and prestige goals that a state seeks abroad.'],
          ['Determinants', 'Internal and external factors — geography, economy, military strength, leadership and public opinion — that shape foreign policy.'],
        ],
        rules: [
          'Core aims: protect territorial sovereignty, boost trade and investment, defend citizens abroad and promote regional peace.',
          'Internal determinants include population, economic resources (like oil), political stability and leadership vision; external ones include global power balances and international law.',
        ],
        table: {
          headers: ['Category', 'Examples of determinants'],
          rows: [
            ['Internal (domestic)', 'Geography, natural resources, economy, military capability, leadership, public opinion'],
            ['External (global)', 'International law, UN/AU treaties, actions of neighbouring states, global markets'],
          ],
        },
        example: {
          q: 'How did Nigeria’s crude-oil boom in the 1970s strengthen its foreign policy?',
          steps: [
            ['Identify the determinant.', 'Economic wealth (oil revenue) is a major domestic determinant.'],
            ['Trace the foreign policy impact.', 'Oil wealth let Nigeria fund anti-apartheid liberation movements, launch ECOWAS (1975) and act as a regional leader without relying on foreign aid.'],
          ],
        },
        yourTurn: {
          q: 'What is the single overarching guide behind every country’s foreign policy decisions?',
          o: ['National interest', 'Personal hobbies of diplomats', 'Fixed eternal alliances', 'Local market fees'],
          a: 0,
          h: [
            'Countries adjust alliances when their security or economic needs shift.',
            'It covers territorial security, economic well-being and sovereignty.',
          ],
          e: 'National interest is the core compass guiding every sovereign state’s foreign policy.',
        },
      },
      {
        title: 'Instruments of foreign policy',
        idea: 'States pursue their goals abroad using peaceful tools first (diplomacy, economic aid, trade agreements, cultural exchange) and coercive tools (sanctions, military force) as a last resort.',
        terms: [
          ['Diplomacy', 'Peaceful negotiation and representation conducted by ambassadors and foreign ministries.'],
          ['Economic sanctions', 'Trade bans, asset freezes or travel restrictions used to pressure another state without war.'],
          ['Propaganda / public diplomacy', 'Shaping international opinion through broadcasts, cultural programmes and media.'],
        ],
        rules: [
          'Diplomacy is the primary and cheapest instrument of foreign policy; war is the most costly last resort.',
          'Embassies represent countries in non-Commonwealth states; High Commissions represent Commonwealth states in one another’s capitals.',
        ],
        table: {
          headers: ['Instrument', 'Peaceful or coercive?', 'Example'],
          rows: [
            ['Diplomacy', 'Peaceful', 'Signing bilateral trade or extradition treaties'],
            ['Economic aid / trade', 'Peaceful', 'Scholarships, technical assistance, tariff cuts'],
            ['Economic sanctions', 'Coercive (non-violent)', 'Oil embargo or visa ban'],
            ['Military force', 'Coercive (last resort)', 'Border defence or peacekeeping'],
          ],
        },
        example: {
          q: 'Why is Nigeria’s diplomatic mission in London called a High Commission while its mission in Washington, D.C. is called an Embassy?',
          steps: [
            ['Check Commonwealth membership.', 'Both Nigeria and the United Kingdom belong to the Commonwealth of Nations; the United States does not.'],
            ['Apply diplomatic naming convention.', 'Commonwealth countries exchange High Commissioners (High Commissions), while other states exchange Ambassadors (Embassies).'],
          ],
        },
        yourTurn: {
          q: 'Which instrument of foreign policy involves peaceful negotiation between official representatives of states?',
          o: ['Diplomacy', 'Economic embargo', 'Military blockade', 'Annexation'],
          a: 0,
          h: [
            'It is carried out daily by embassies, high commissions and foreign ministers.',
            'It seeks agreement without violence or trade bans.',
          ],
          e: 'Diplomacy is the primary peaceful instrument for managing relations and resolving disputes between states.',
        },
      },
    ],
    qs: [
      {
        q: 'Nigeria’s chief diplomatic representative in another Commonwealth country such as Ghana or the UK is called a:',
        o: ['High Commissioner', 'Governor-General', 'Consul-General only', 'Senator'],
        a: 0,
        e: 'Commonwealth nations exchange High Commissioners heading High Commissions.',
      },
      {
        q: 'Which of the following is an internal determinant of a country’s foreign policy?',
        o: ['Economic resources and political stability', 'UN Security Council veto rules', 'Foreign tariffs abroad', 'Neighbouring countries’ elections'],
        a: 0,
        e: 'Domestic economy, population, geography and stability are internal determinants.',
      },
      {
        q: 'Imposing a trade ban and freezing foreign assets to compel a country to change policy is an example of:',
        o: ['Economic sanctions', 'Cultural diplomacy', 'Technical aid', 'Non-alignment'],
        a: 0,
        e: 'Economic sanctions apply financial and trade pressure short of armed conflict.',
      },
      {
        q: 'The most costly and extreme instrument of foreign policy, used only as a last resort, is:',
        o: ['Military force (war)', 'Bilateral diplomacy', 'Cultural exchange', 'Foreign aid'],
        a: 0,
        e: 'Armed force carries immense human and economic costs and is reserved for self-defence or last resort.',
      },
      {
        q: 'The famous maxim in international relations states that nations have no permanent friends or permanent enemies, only permanent:',
        o: ['Interests', 'Ambassadors', 'Borders', 'Languages'],
        a: 0,
        e: 'National interest endures even as specific alliances shift over time.',
      },
      {
        q: 'Protection from arrest or local prosecution enjoyed by accredited foreign diplomats is called:',
        o: ['Diplomatic immunity', 'Parliamentary privilege', 'Executive veto', 'Sovereign debt'],
        a: 0,
        e: 'Under the Vienna Convention, diplomatic immunity allows envoys to perform their duties safely.',
      },
    ],
  },
  {
    id: 'govt-ng-foreign-policy',
    name: "Nigeria's foreign policy and international organisations",
    sec: SEC3,
    goals: [
      'State the core principles of Nigeria’s foreign policy, especially Africa as its centrepiece and non-alignment.',
      'Explain Nigeria’s changing foreign-policy posture from Balewa through Murtala/Obasanjo to the Fourth Republic.',
    ],
    trap: 'Non-alignment did NOT mean isolation or neutrality on colonialism — Nigeria stayed independent of Cold War blocs while fiercely opposing apartheid and colonial rule.',
    parts: [
      {
        title: 'Principles of Nigeria’s foreign policy',
        idea: 'Since 1960, Nigeria’s foreign policy has rested on Africa as its centrepiece, non-alignment, sovereign equality of states, non-interference, peaceful dispute settlement and multilateralism.',
        terms: [
          ['Africa as centrepiece', 'Commitment to African unity, decolonisation, peace and economic integration as Nigeria’s top external priority.'],
          ['Non-alignment', 'Refusal to join either the Western (NATO) or Eastern (Warsaw Pact) military bloc during the Cold War, judging each issue on merit.'],
          ['Citizen diplomacy', 'Fourth Republic emphasis on protecting the welfare and dignity of Nigerians living at home and abroad.'],
        ],
        rules: [
          'Section 19 of the 1999 Constitution enshrines promotion of national interest, African integration, international cooperation and respect for international law.',
          'Nigeria operates concentric circles of engagement: Nigeria’s own security → West Africa (ECOWAS) → Africa (AU) → wider world (UN/Commonwealth).',
        ],
        table: {
          headers: ['Era', 'Distinctive foreign-policy style'],
          rows: [
            ['Balewa (1960–66)', 'Pro-Western, cautious; broke ties with France over 1961 Sahara nuclear test; abrogated Anglo-Nigerian Defence Pact (1962)'],
            ['Murtala / Obasanjo (1975–79)', 'Dynamic, radical pan-Africanism; backed MPLA in Angola; nationalised British Petroleum (1979) over Zimbabwe'],
            ['Fourth Republic (1999–date)', 'Shuttle diplomacy, debt relief (2005), citizen diplomacy and multilateral economic ties'],
          ],
        },
        example: {
          q: 'Why did the Murtala/Obasanjo era earn praise as the “golden age” of Nigeria’s Afrocentric foreign policy?',
          steps: [
            ['Cite decisive actions.', 'Nigeria recognised the MPLA in Angola despite Western pressure and nationalised Barclays Bank and BP assets to push Britain toward Zimbabwe’s independence.'],
            ['State the principle.', 'It backed African liberation with real economic and diplomatic muscle.'],
          ],
        },
        yourTurn: {
          q: 'During the Cold War, refusing to join either the Western or Eastern military bloc while judging global issues independently was called:',
          o: ['Non-alignment', 'Assimilation', 'Mercantilism', 'Confederalism'],
          a: 0,
          h: [
            'Nigeria attended the 1961 Belgrade summit founding this global movement.',
            'It meant staying unattached to superpower military alliances.',
          ],
          e: 'Non-alignment kept newly independent states independent of the USA–USSR military blocs.',
        },
      },
      {
        title: 'Nigeria’s multilateral engagement',
        idea: 'Nigeria pursues diplomacy actively through regional and global bodies — UN, Commonwealth, AU, ECOWAS and OPEC — combining peacekeeping, debt diplomacy and trade cooperation.',
        terms: [
          ['Multilateralism', 'Working through multi-nation international organisations rather than acting solely alone.'],
          ['Concentric circles theory', 'Foreign policy model formulated under Prof. Ibrahim Gambari placing national interest at the core, surrounded by West Africa, Africa and the world.'],
          ['Abrogation of Anglo-Nigerian Defence Pact (1962)', 'Cancellation of a controversial post-independence defence deal with Britain after fierce student and nationalist protests.'],
        ],
        rules: [
          'Nigeria joined the UN in October 1960 as its 99th member and has served five times as a non-permanent member of the UN Security Council.',
          'Strong economic diplomacy under President Obasanjo (1999–2007) secured $18 billion in Paris Club debt relief in 2005.',
        ],
        table: {
          headers: ['Organisation', 'Year Nigeria joined', 'Key Nigerian role'],
          rows: [
            ['United Nations', '1960 (99th member)', 'Major peacekeeping contributor; UNGA Presidency'],
            ['Commonwealth', '1960', 'Emeka Anyaoku served as Secretary-General (1990–2000)'],
            ['OAU / AU', '1963 / 2002 (founding)', 'Peacekeeping, NEPAD & anti-apartheid leadership'],
            ['ECOWAS', '1975 (co-founder)', 'Hosts headquarters in Abuja; funds ECOMOG'],
            ['OPEC', '1971', 'Key African oil producer; produced OPEC Secretaries-General'],
          ],
        },
        example: {
          q: 'Why did Nigerian students protest and force the cancellation of the Anglo-Nigerian Defence Pact in 1962?',
          steps: [
            ['Check the pact’s terms.', 'It allowed Britain military overflight and staging facilities in Nigeria.'],
            ['Connect to policy principles.', 'Critics argued it contradicted Nigeria’s newly won sovereignty and non-alignment.'],
          ],
        },
        yourTurn: {
          q: 'Which guiding principle places African unity, liberation and regional peace at the very heart of Nigeria’s external relations?',
          o: ['Africa as the centrepiece of Nigeria’s foreign policy', 'Isolationism', 'Monroe Doctrine', 'Mercantilist expansion'],
          a: 0,
          h: [
            'Think of the phrase used in almost every Nigerian foreign-policy speech since 1960.',
            'It explains why Nigeria spent heavily on anti-apartheid and West African peacekeeping.',
          ],
          e: '“Africa as the centrepiece” has remained the cornerstone of Nigeria’s foreign policy since independence.',
        },
      },
    ],
    qs: [
      {
        q: 'Nigeria became the 99th member of the United Nations in:',
        o: ['October 1960', 'January 1966', 'May 1975', 'May 1999'],
        a: 0,
        e: 'Nigeria was admitted as the 99th member of the UN on 7 October 1960, a week after independence.',
      },
      {
        q: 'In 1961, Prime Minister Tafawa Balewa severed diplomatic ties with France to protest:',
        o: ['French atomic bomb tests in the Sahara Desert', 'Creation of ECOWAS', 'British membership of the Commonwealth', 'Oil price cuts by OPEC'],
        a: 0,
        e: 'Nigeria broke ties with France over nuclear weapons testing in the African Sahara.',
      },
      {
        q: 'Which Nigerian served as Secretary-General of the Commonwealth of Nations from 1990 to 2000?',
        o: ['Chief Emeka Anyaoku', 'Prof. Wole Soyinka', 'Sir Tafawa Balewa', 'Chief Obafemi Awolowo'],
        a: 0,
        e: 'Chief Emeka Anyaoku was the first African Secretary-General of the Commonwealth.',
      },
      {
        q: 'Which military government nationalised British Petroleum (BP) assets in 1979 to pressure Britain over Zimbabwe’s independence?',
        o: ['General Olusegun Obasanjo’s regime', 'General Yakubu Gowon’s regime', 'General Sani Abacha’s regime', 'Major-General Aguiyi-Ironsi’s regime'],
        a: 0,
        e: 'The Obasanjo regime nationalised BP (forming African Petroleum) just before the 1979 Lusaka Commonwealth Summit.',
      },
      {
        q: 'The “concentric circles” approach to Nigeria’s foreign policy places which priority at the innermost circle?',
        o: ['Nigeria’s own national security and economic survival', 'Relations with Antarctica', 'European monetary policy', 'Space exploration'],
        a: 0,
        e: 'Nigeria’s own security and prosperity sit at the centre, radiating outward to West Africa, Africa and the world.',
      },
      {
        q: 'Which controversial post-independence agreement was cancelled in 1962 after protests that it violated non-alignment?',
        o: ['Anglo-Nigerian Defence Pact', 'ECOWAS Treaty', 'Lagos Plan of Action', 'Abuja Treaty'],
        a: 0,
        e: 'Public and student opposition forced the abrogation of the Anglo-Nigerian Defence Pact in 1962.',
      },
    ],
  },
  {
    id: 'govt-ng-africa-ecomog',
    name: 'Nigeria in Africa: liberation, ECOMOG, TAC and NEPAD',
    sec: SEC3,
    goals: [
      'Detail Nigeria’s role in African liberation struggles and anti-apartheid solidarity.',
      'Explain the purpose and achievements of ECOMOG, the Technical Aid Corps (TAC) and NEPAD.',
    ],
    trap: 'Even though Nigeria is in West Africa, it was honoured as a “Frontline State” because of its massive financial and diplomatic support against apartheid in Southern Africa.',
    parts: [
      {
        title: 'African liberation and ECOMOG peacekeeping',
        idea: 'Nigeria spent billions of dollars and sacrificed brave soldiers to help liberate Southern Africa from colonialism/apartheid and to restore peace in Liberia and Sierra Leone through ECOMOG.',
        terms: [
          ['Frontline State status', 'Honorary recognition granted to Nigeria for funding and championing liberation in Angola, Zimbabwe, Namibia and South Africa.'],
          ['ECOMOG', 'ECOWAS Monitoring Group (formed 1990) — West African peacekeeping force led and largely funded by Nigeria to halt civil wars in Liberia and Sierra Leone.'],
          ['Southern African Relief Fund (SARF)', 'Public fund raised by Nigerian citizens and government in 1976 to support anti-apartheid fighters and students.'],
        ],
        rules: [
          'Nigeria boycotted the 1976 Montreal Olympics and 1986 Edinburgh Commonwealth Games to isolate apartheid South Africa.',
          'ECOMOG demonstrated “African solutions to African problems”, restoring elected civilian governments in Liberia (1997) and Sierra Leone (1998).',
        ],
        table: {
          headers: ['Initiative', 'Region / focus', 'Nigerian contribution'],
          rows: [
            ['Anti-apartheid & liberation', 'Angola, Zimbabwe, Namibia, South Africa', 'Funding (SARF), sports boycotts, scholarships, UN chair'],
            ['ECOMOG (1990s)', 'Liberia, Sierra Leone, Guinea-Bissau', 'Bulk of troops, logistics and finance to end civil wars'],
          ],
        },
        example: {
          q: 'Why did Nigeria lead the creation of ECOMOG in 1990 when civil war erupted in Liberia?',
          steps: [
            ['Consider regional stability.', 'A collapsing Liberia threatened to flood West Africa with refugees, weapons and instability.'],
            ['Apply Nigeria’s foreign policy.', 'With global powers distracted by the Gulf War, Nigeria mobilised ECOWAS states to stop the bloodshed and protect regional peace.'],
          ],
        },
        yourTurn: {
          q: 'What does the acronym ECOMOG stand for?',
          o: ['ECOWAS Monitoring Group', 'Economic Council of Modern Governments', 'Eastern Commission on Military Governance', 'European Committee on Maritime Growth'],
          a: 0,
          h: [
            'It is the peacekeeping arm created by ECOWAS in 1990.',
            'It deployed to Liberia and Sierra Leone.',
          ],
          e: 'ECOMOG stands for the ECOWAS Monitoring Group, West Africa’s regional peacekeeping force.',
        },
      },
      {
        title: 'Technical Aid Corps (TAC) and NEPAD',
        idea: 'Beyond peacekeeping, Nigeria shares skilled human capital through the Technical Aid Corps (TAC) and co-founded NEPAD to drive Africa’s own economic and governance renewal.',
        terms: [
          ['Technical Aid Corps (TAC, 1987)', 'Scheme launched under Prof. Bolaji Akinyemi sending Nigerian doctors, teachers, engineers and lawyers for 2-year volunteer service in Africa, the Caribbean and the Pacific (ACP).'],
          ['NEPAD (2001)', 'New Partnership for Africa’s Development — AU socio-economic framework co-championed by Nigeria, South Africa, Senegal, Algeria and Egypt.'],
          ['APRM', 'African Peer Review Mechanism — voluntary NEPAD tool where African states review each other’s governance and democracy.'],
        ],
        rules: [
          'TAC replaces cash handouts with practical Nigerian expertise, building goodwill across ACP nations.',
          'NEPAD focuses on eradicating poverty, attracting investment, closing infrastructure gaps and promoting good governance.',
        ],
        table: {
          headers: ['Programme', 'Year launched', 'Main goal'],
          rows: [
            ['Technical Aid Corps (TAC)', '1987', 'Deploy Nigerian professionals to assist ACP countries'],
            ['NEPAD', '2001', 'African-owned poverty eradication, infrastructure & growth'],
            ['APRM', '2003', 'Voluntary peer review of democratic & economic governance'],
          ],
        },
        example: {
          q: 'How does the Technical Aid Corps (TAC) differ from ordinary financial foreign aid?',
          steps: [
            ['Compare what is sent.', 'Financial aid sends money that can be misspent; TAC sends skilled Nigerian doctors, lecturers and engineers whose stipends Nigeria pays.'],
            ['State the diplomatic gain.', 'It showcases Nigerian talent and builds lasting people-to-people friendship.'],
          ],
        },
        yourTurn: {
          q: 'Which Nigerian-initiated programme sends Nigerian doctors, teachers and engineers to assist African, Caribbean and Pacific countries?',
          o: ['Technical Aid Corps (TAC)', 'ECOMOG', 'NYSC', 'NADECO'],
          a: 0,
          h: [
            'It was launched in 1987 during Prof. Bolaji Akinyemi’s tenure as Foreign Minister.',
            'NYSC operates inside Nigeria, while this corps serves abroad.',
          ],
          e: 'The Technical Aid Corps (TAC) dispatches Nigerian professionals on two-year developmental assignments across ACP states.',
        },
      },
    ],
    qs: [
      {
        q: 'In which two West African countries did Nigeria-led ECOMOG conduct its largest peacekeeping operations in the 1990s?',
        o: ['Liberia and Sierra Leone', 'Kenya and Tanzania', 'Egypt and Morocco', 'Botswana and Namibia'],
        a: 0,
        e: 'ECOMOG intervened in Liberia (from 1990) and restored elected government in Sierra Leone (1998).',
      },
      {
        q: 'NEPAD stands for:',
        o: ['New Partnership for Africa’s Development', 'National Economic Plan for African Defence', 'Nigerian Electoral Policy and Administration Directorate', 'Northern Economic Programme for Agricultural Development'],
        a: 0,
        e: 'NEPAD is the New Partnership for Africa’s Development adopted by the AU in 2001.',
      },
      {
        q: 'Under NEPAD, the voluntary tool by which African governments assess one another’s democratic and economic governance is the:',
        o: ['African Peer Review Mechanism (APRM)', 'Indigénat', 'Privy Council', 'Security Council veto'],
        a: 0,
        e: 'The APRM encourages African states to share best practices and strengthen governance.',
      },
      {
        q: 'The Technical Aid Corps (TAC) was introduced in 1987 during the tenure of which Nigerian Foreign Affairs Minister?',
        o: ['Prof. Bolaji Akinyemi', 'Chief Herbert Macaulay', 'Sir James Robertson', 'Chief Ernest Shonekan'],
        a: 0,
        e: 'Prof. Bolaji Akinyemi pioneered the TAC scheme under the Babangida administration.',
      },
      {
        q: 'Why did Nigeria boycott the 1976 Montreal Olympics and 1986 Commonwealth Games?',
        o: ['To protest sporting links with apartheid South Africa', 'Because Nigeria had no athletes', 'To protest ECOWAS tariffs', 'Because of bad weather'],
        a: 0,
        e: 'Nigeria led international boycotts to isolate the racist apartheid regime in South Africa.',
      },
      {
        q: 'Which five African countries spearheaded the launch of NEPAD in 2001?',
        o: ['Nigeria, South Africa, Senegal, Algeria and Egypt', 'Nigeria, Brazil, India, China and Japan', 'Ghana, Liberia, Togo, Benin and Niger', 'Kenya, Uganda, Rwanda, Burundi and Malawi'],
        a: 0,
        e: 'Nigeria (Obasanjo), South Africa (Mbeki), Senegal (Wade), Algeria (Bouteflika) and Egypt (Mubarak) championed NEPAD.',
      },
    ],
  },
  {
    id: 'govt-un-commonwealth',
    name: 'The United Nations and the Commonwealth',
    sec: SEC3,
    goals: [
      'Name the six principal organs of the United Nations and explain Security Council veto power.',
      'Explain the origins, principles, benefits and limitations of the Commonwealth of Nations.',
    ],
    trap: 'The UN Secretariat is in New York, EXCEPT the International Court of Justice (ICJ), which sits in The Hague, Netherlands!',
    parts: [
      {
        title: 'The United Nations (UN)',
        idea: 'Founded in 1945 after World War II to replace the failed League of Nations, the UN promotes global peace, human rights, international law and economic development.',
        terms: [
          ['General Assembly', 'Plenary parliament of all member states (one state, one vote) that debates global issues and approves the UN budget.'],
          ['Security Council', '15-member body responsible for international peace; 5 permanent members (USA, UK, France, Russia, China) hold veto power.'],
          ['Specialised agencies', 'Technical bodies linked to ECOSOC — WHO (health), UNESCO (education/culture), UNICEF (children), FAO (food), ILO (labour) and IMF/World Bank.'],
        ],
        rules: [
          'Six principal UN organs: General Assembly, Security Council, Secretariat, International Court of Justice (The Hague), Economic and Social Council (ECOSOC), and Trusteeship Council (suspended in 1994).',
          'Main UN challenges: big-power veto paralysis in the Security Council, funding shortfalls and lack of a standing UN army.',
        ],
        table: {
          headers: ['UN Principal Organ', 'Seat', 'Primary role'],
          rows: [
            ['General Assembly', 'New York', 'Deliberates global issues; one state, one vote'],
            ['Security Council', 'New York', 'Maintains peace; 5 permanent members have veto'],
            ['Secretariat', 'New York', 'Day-to-day administration led by Secretary-General'],
            ['International Court of Justice', 'The Hague', 'Settles legal disputes between states'],
            ['ECOSOC', 'New York', 'Coordinates economic, social & human-rights work'],
          ],
        },
        example: {
          q: 'Why did the International Court of Justice (ICJ) rule on the Bakassi Peninsula dispute between Nigeria and Cameroon?',
          steps: [
            ['Recall the ICJ’s mandate.', 'It settles legal disputes submitted by sovereign states under international law.'],
            ['Connect to Bakassi.', 'Nigeria peacefully respected the 2002 ICJ ruling via the 2006 Greentree Agreement rather than going to war.'],
          ],
        },
        yourTurn: {
          q: 'Which principal organ of the United Nations sits in The Hague, Netherlands rather than New York?',
          o: ['International Court of Justice (ICJ)', 'Security Council', 'General Assembly', 'ECOSOC'],
          a: 0,
          h: [
            'It is the judicial arm of the UN that hears state-to-state legal cases.',
            'Its headquarters is the Peace Palace in The Hague.',
          ],
          e: 'The International Court of Justice (ICJ) is seated at the Peace Palace in The Hague, Netherlands.',
        },
      },
      {
        title: 'The Commonwealth of Nations',
        idea: 'The Commonwealth is a voluntary association of 56 independent countries — mostly former British colonies — cooperating on democracy, education, trade and youth exchange.',
        terms: [
          ['Commonwealth Secretariat', 'Administrative headquarters in Marlborough House, London, headed by the Secretary-General.'],
          ['CHOGM', 'Commonwealth Heads of Government Meeting held every two years to set policy.'],
          ['Harare Declaration (1991)', 'Charter committing Commonwealth states to democracy, rule of law and human rights.'],
        ],
        rules: [
          'Membership is voluntary and members are equal sovereign states — even non-former British colonies like Mozambique, Rwanda, Gabon and Togo have joined.',
          'Benefits to Nigeria: Commonwealth scholarships, election observers, trade/sporting links (Commonwealth Games) and diplomatic voice. Limitation: no binding army or power to enforce rulings beyond suspension.',
        ],
        table: {
          headers: ['Feature', 'United Nations', 'Commonwealth'],
          rows: [
            ['Membership', 'Nearly all sovereign states (193)', 'Voluntary group (56 states, shared history/values)'],
            ['Headquarters', 'New York (ICJ in The Hague)', 'London (Marlborough House)'],
            ['Binding peace power', 'Security Council Chapter VII resolutions', 'Moral pressure & suspension only'],
          ],
        },
        example: {
          q: 'Why can the Commonwealth suspend a member state (as happened to Nigeria in 1995) but not send troops to enforce democracy?',
          steps: [
            ['Check the Commonwealth’s nature.', 'It is a voluntary association of equal sovereign nations without a standing military force.'],
            ['State its tool.', 'Its strongest sanction is diplomatic suspension under the Harare principles.'],
          ],
        },
        yourTurn: {
          q: 'Where is the headquarters of the Commonwealth Secretariat located?',
          o: ['London', 'New York', 'Addis Ababa', 'Abuja'],
          a: 0,
          h: [
            'It sits in Marlborough House.',
            'Addis Ababa hosts the AU, and Abuja hosts ECOWAS.',
          ],
          e: 'The Commonwealth Secretariat is headquartered at Marlborough House in London.',
        },
      },
    ],
    qs: [
      {
        q: 'Which five countries are permanent members of the UN Security Council with veto power?',
        o: ['USA, UK, France, Russia and China', 'USA, Germany, Japan, Brazil and Nigeria', 'UK, Canada, India, France and Italy', 'Russia, China, Egypt, South Africa and USA'],
        a: 0,
        e: 'The P5 (USA, UK, France, Russia and China) hold permanent seats and veto power.',
      },
      {
        q: 'Which UN specialised agency focuses specifically on global public health?',
        o: ['WHO', 'UNESCO', 'ILO', 'FAO'],
        a: 0,
        e: 'The World Health Organization (WHO) leads international public-health coordination.',
      },
      {
        q: 'Which principal UN organ suspended operations in 1994 after the last trust territory (Palau) gained independence?',
        o: ['Trusteeship Council', 'Security Council', 'General Assembly', 'Secretariat'],
        a: 0,
        e: 'The Trusteeship Council completed its decolonisation mandate when Palau became independent in 1994.',
      },
      {
        q: 'The biennial summit of leaders of Commonwealth countries is known as:',
        o: ['CHOGM', 'ECOWAS Summit', 'OPEC Conference', 'G20'],
        a: 0,
        e: 'CHOGM stands for Commonwealth Heads of Government Meeting.',
      },
      {
        q: 'A major criticism of the UN Security Council raised by African nations is:',
        o: ['Africa has no permanent seat with veto power', 'It meets only once every ten years', 'It has 193 permanent members', 'It bans peacekeeping'],
        a: 0,
        e: 'Despite making up over a quarter of UN members, Africa holds zero permanent Security Council seats.',
      },
      {
        q: 'Which country was NOT formerly colonised by Britain yet joined the Commonwealth?',
        o: ['Mozambique (or Rwanda)', 'Ghana', 'Kenya', 'India'],
        a: 0,
        e: 'Mozambique (formerly Portuguese) and Rwanda (formerly Belgian) joined the Commonwealth voluntarily.',
      },
    ],
  },
  {
    id: 'govt-au-ecowas-opec',
    name: 'The OAU and AU, ECOWAS and OPEC',
    sec: SEC3,
    goals: [
      'Trace the transformation of the OAU (1963) into the African Union (AU, 2002) and name key AU organs.',
      'Explain the aims, achievements and challenges of ECOWAS and OPEC.',
    ],
    trap: 'The OAU adhered strictly to non-interference in internal affairs, whereas the AU Constitutive Act allows intervention in cases of genocide, war crimes and unconstitutional coups.',
    parts: [
      {
        title: 'From OAU (1963) to African Union (2002)',
        idea: 'Founded in Addis Ababa in 1963 to liberate Africa from colonialism, the OAU transformed into the African Union (AU) in 2002 to deepen economic integration, democracy and peace.',
        terms: [
          ['OAU (1963)', 'Organisation of African Unity — formed by bridging the radical Casablanca and moderate Monrovia blocs; succeeded in ending colonialism and apartheid.'],
          ['African Union (AU, 2002)', 'Replaced OAU in Durban, South Africa; headquartered in Addis Ababa, Ethiopia; adds stronger peace, human rights and economic institutions.'],
          ['AU Peace and Security Council (PSC)', 'Standing decision-making organ for conflict prevention, peacekeeping and suspending coup regimes.'],
        ],
        rules: [
          'Key AU organs: Assembly of Heads of State, Executive Council, AU Commission (Addis Ababa), Pan-African Parliament (Midrand, SA), Peace and Security Council and African Court on Human and Peoples’ Rights.',
          'The AU’s flagship economic project is the African Continental Free Trade Area (AfCFTA).',
        ],
        table: {
          headers: ['Feature', 'OAU (1963–2002)', 'AU (2002–present)'],
          rows: [
            ['Primary mission', 'Decolonisation & ending apartheid', 'Economic integration, democracy & peace'],
            ['Intervention rule', 'Strict non-interference', 'Right to intervene in genocide / war crimes; zero tolerance for coups'],
            ['Headquarters', 'Addis Ababa, Ethiopia', 'Addis Ababa, Ethiopia'],
          ],
        },
        example: {
          q: 'Why did African leaders replace the OAU with the African Union in 2002?',
          steps: [
            ['Check what OAU had finished.', 'With South Africa’s 1994 democracy, formal decolonisation was complete.'],
            ['Identify the new priorities.', 'Africa needed stronger tools against civil wars, unconstitutional coups and economic fragmentation (modelled partly on the EU).'],
          ],
        },
        yourTurn: {
          q: 'Where is the headquarters of the African Union Commission located?',
          o: ['Addis Ababa, Ethiopia', 'Abuja, Nigeria', 'Vienna, Austria', 'London, UK'],
          a: 0,
          h: [
            'It stayed in the same East African capital where the OAU was founded in 1963.',
            'Abuja hosts ECOWAS, and Vienna hosts OPEC.',
          ],
          e: 'The African Union Commission is headquartered in Addis Ababa, Ethiopia.',
        },
      },
      {
        title: 'ECOWAS and OPEC',
        idea: 'ECOWAS promotes West African economic integration and free movement from its Abuja headquarters; OPEC coordinates crude-oil production among exporting countries from Vienna to stabilise prices.',
        terms: [
          ['ECOWAS (1975)', 'Economic Community of West African States — founded by the Treaty of Lagos (28 May 1975), championed by General Yakubu Gowon (Nigeria) and Gnassingbé Eyadéma (Togo).'],
          ['ECOWAS achievements', 'Visa-free movement of citizens, ECOWAS Passport, ECOMOG peacekeeping, West African Gas Pipeline and ECOWAS Court of Justice.'],
          ['OPEC (1960)', 'Organization of the Petroleum Exporting Countries — founded in Baghdad (headquarters Vienna, Austria); Nigeria joined in 1971.'],
        ],
        rules: [
          'ECOWAS challenges: multiple currencies (delayed Eco single currency), Anglophone/Francophone colonial ties, border barriers, member dues arrears and political instability/coups.',
          'OPEC challenges: quota cheating by members, rising non-OPEC oil output, global shift toward renewable energy and price volatility.',
        ],
        table: {
          headers: ['Body', 'Founded / HQ', 'Main goal'],
          rows: [
            ['ECOWAS', '1975 (Treaty of Lagos) / Abuja', 'West African common market, free movement & regional peace'],
            ['OPEC', '1960 (Baghdad) / Vienna', 'Stabilise global crude oil prices via production quotas'],
          ],
        },
        example: {
          q: 'How does OPEC try to stop global crude-oil prices from crashing during an oversupply?',
          steps: [
            ['Apply basic supply and demand.', 'Too much oil on the world market pushes prices down.'],
            ['State OPEC’s tool.', 'Member countries agree on coordinated production quotas (cuts) to tighten supply and support fair prices.'],
          ],
        },
        yourTurn: {
          q: 'Which two West African leaders spearheaded the founding of ECOWAS in Lagos in May 1975?',
          o: ['General Yakubu Gowon (Nigeria) and President Gnassingbé Eyadéma (Togo)', 'Kwame Nkrumah and Julius Nyerere', 'Nelson Mandela and Thabo Mbeki', 'Shehu Shagari and Jerry Rawlings'],
          a: 0,
          h: [
            'One was Nigeria’s wartime and post-war military head of state; the other led Togo.',
            'The founding treaty was signed in Lagos on 28 May 1975.',
          ],
          e: 'General Yakubu Gowon of Nigeria and President Gnassingbé Eyadéma of Togo championed the 1975 ECOWAS Treaty.',
        },
      },
    ],
    qs: [
      {
        q: 'The two rival political blocs that merged in 1963 to form the OAU were the:',
        o: ['Casablanca and Monrovia groups', 'NATO and Warsaw Pact', 'SDP and NRC', 'OPEC and Commonwealth'],
        a: 0,
        e: 'The radical Casablanca group and moderate Monrovia group compromised to launch the OAU in 1963.',
      },
      {
        q: 'Where is the headquarters of the ECOWAS Commission located?',
        o: ['Abuja, Nigeria', 'Accra, Ghana', 'Dakar, Senegal', 'Addis Ababa, Ethiopia'],
        a: 0,
        e: 'ECOWAS moved its secretariat (now Commission) from Lagos to Abuja, Nigeria.',
      },
      {
        q: 'In what year did Nigeria join the Organization of the Petroleum Exporting Countries (OPEC)?',
        o: ['1971', '1960', '1975', '1999'],
        a: 0,
        e: 'OPEC was founded in 1960, and Nigeria joined as its 11th member in July 1971.',
      },
      {
        q: 'Where is the headquarters of OPEC located?',
        o: ['Vienna, Austria', 'Baghdad, Iraq', 'Lagos, Nigeria', 'Geneva, Switzerland'],
        a: 0,
        e: 'OPEC was founded in Baghdad in 1960, moved to Geneva, and has been headquartered in Vienna since 1965.',
      },
      {
        q: 'A major economic achievement of ECOWAS for ordinary West African citizens is:',
        o: ['Visa-free movement across member states with the ECOWAS Passport', 'Adopting the US Dollar across Africa', 'Abolishing all national parliaments', 'Eliminating every language barrier'],
        a: 0,
        e: 'The ECOWAS Protocol on Free Movement allows citizens to travel across member states without visas.',
      },
      {
        q: 'Which key challenge regularly weakens OPEC’s ability to control world oil prices?',
        o: ['Member states exceeding their agreed production quotas and non-OPEC oil supply', 'Lack of any crude oil reserves', 'Having headquarters in Africa', 'Banning oil exports'],
        a: 0,
        e: 'Quota over-production by members and supply from non-OPEC producers like the USA dilute OPEC’s price control.',
      },
    ],
  },
];
