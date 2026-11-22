import { buildUtmeSubjectCurriculum, compactUtmeTopic, type CompactTopicInput } from './builder';
import { HIST_EXTRA_SPECS, COMP_EXTRA_SPECS, HOMEEC_EXTRA_SPECS } from './extraHistCompHome';
import { PHE_EXTRA_SPECS, ART_EXTRA_SPECS, MUSIC_EXTRA_SPECS } from './extraPheArtMusic';

const HIST_SPECS: CompactTopicInput[] = [
  {
    id: 'hist-precolonial-nigeria',
    name: 'Pre-colonial Nigerian states and empires',
    sec: 'Nigerian history',
    goals: [
      'Compare centralised states (Kanem-Borno, Hausa states, Oyo, Benin) and non-centralised societies (Igbo, Tiv)',
      'Explain how trade, ironworking and diplomacy sustained early Nigerian kingdoms',
    ],
    trap: 'Non-centralised (acephalous) societies like pre-colonial Igbo or Tiv were NOT disorderly — they governed through well-structured village assemblies, age-grades, titled elders and lineage councils.',
    p1: {
      title: 'Centralised kingdoms of northern and southern Nigeria',
      idea: 'Before European arrival, sophisticated states flourished across Nigeria. Kanem-Borno grew around Lake Chad through Trans-Saharan trade and Islamic scholarship under rulers like Mai Idris Alooma; the seven Hausa city-states (Hausa Bakwai) thrived on leather, textiles and Kano/Katsina trade; Oyo built a constitutional empire with the Alaafin checked by the Oyo Mesi; and Benin became renowned for guild crafts, brass casting and well-planned city walls.',
      terms: [
        ['Hausa Bakwai', 'The seven original Hausa city-states: Daura, Kano, Katsina, Zaria, Gobir, Rano and Biram'],
        ['Oyo Mesi', 'Seven noble kingmakers in Old Oyo who balanced the Alaafin’s power'],
        ['Edo Guild System', 'Specialised royal craft guilds in Benin famous for bronze casting and ivory carving'],
      ],
      rules: [
        'Kanem-Borno’s long-lived Sefawa dynasty was later succeeded by the El-Kanemi dynasty in the 19th century.',
        'Benin’s Oba ruled with advisory chiefs (Uzama and Eghaevbo) and maintained diplomatic ties with Portugal as early as the late 15th century.',
      ],
      headers: ['Kingdom', 'Key political / economic pillar'],
      rows: [
        ['Kanem-Borno', 'Trans-Saharan trade, cavalry and Islamic learning at Gazargamo'],
        ['Old Oyo', 'Constitutional checks (Alaafin, Oyo Mesi, Ogboni) and cavalry'],
        ['Benin Empire', 'Divine monarchy (Oba), craft guilds and coastal/forest trade'],
      ],
      exQ: 'How did the Old Oyo Empire prevent an Alaafin from becoming an absolute tyrant?',
      exSteps: [
        ['Council check', 'The Oyo Mesi advised on state affairs and could reject an abusive king'],
        ['Spiritual check', 'The Ogboni council mediated between Alaafin and Oyo Mesi'],
      ],
      checkQ: 'Which historical city was the walled administrative capital of the Kanem-Borno Empire under Mai Ali Ghaji and Mai Idris Alooma?',
      checkO: ['Ngazargamu (Gazargamo)', 'Ile-Ife', 'Arochukwu', 'Calabar'],
      checkH: [
        'Look for the capital established west of Lake Chad in Borno.',
        'It served as a famed centre of Islamic learning for over three centuries.',
      ],
      checkE: 'Ngazargamu (Gazargamo) was the famed capital of the Borno Empire.',
    },
    p2: {
      title: 'Non-centralised societies and inter-group relations',
      idea: 'Non-centralised societies such as the Igbo, Tiv and Ibibio practiced village democracy where adult citizens participated directly in decision-making through village assemblies (Ohanaeze / Amala), age grades, women’s associations (Umuada) and oracle networks. Across Nigeria, pre-colonial groups interacted constantly through long-distance markets, river trade along the Niger and Benue, craft exchange and intermarriage.',
      terms: [
        ['Age-grade system', 'Peer groups of similar age assigned civic duties such as road clearing, security and market order'],
        ['Nok culture', 'Early Iron Age civilisation in central Nigeria (c. 500 BC–200 AD) famed for terracotta sculptures'],
        ['Igbo-Ukwu', '9th-century bronze-working civilisation revealing advanced metallurgy and long-distance trade'],
      ],
      rules: [
        'Nigeria’s ancient art centres — Nok (terracotta), Igbo-Ukwu (leaded bronze), Ife (naturalistic brass/terracotta) and Benin (court brass) — prove deep indigenous skill.',
        'Pre-colonial ethnic groups traded salt, horses, kola nuts, iron tools and cloth across ecological zones.',
      ],
      headers: ['Archaeological site', 'Signature cultural achievement'],
      rows: [
        ['Nok (Kaduna/Plateau)', 'Earliest sub-Saharan iron smelting and terracotta heads'],
        ['Igbo-Ukwu (Anambra)', 'Intricate cast bronze vessels and beaded regalia'],
        ['Ile-Ife (Osun)', 'Highly naturalistic royal brass and terracotta portraits'],
      ],
      exQ: 'What does the spread of kola nuts from southern forests to northern savannahs in pre-colonial Nigeria prove?',
      exSteps: [
        ['Economic link', 'Ecological zones complemented each other through peaceful trade'],
        ['Cultural link', 'Nigerian peoples were connected centuries before 1914'],
      ],
      checkQ: 'Which ancient Nigerian civilisation is famed as one of the earliest centres of iron smelting and terracotta sculpture in West Africa?',
      checkO: ['Nok culture', 'Sokoto Caliphate', 'Opobo Kingdom', 'Lagos Colony'],
      checkH: [
        'Its artefacts were first unearthed during tin mining near Jos and southern Kaduna.',
        'It flourished roughly between 500 BC and 200 AD.',
      ],
      checkE: 'The Nok culture of central Nigeria is celebrated for early ironworking and terracotta sculptures.',
    },
    qs: [
      ['Which ruler is celebrated for introducing firearms, Turkish military instructors and administrative reforms in Kanem-Borno?', 'Mai Idris Alooma', 'Queen Amina', 'Oba Ewuare', 'Sarki Yaji', 'Mai Idris Alooma modernised Borno’s army, roads and Islamic courts in the late 16th century.'],
      ['The seven traditional Hausa states descended from the Bayajidda legend are collectively called', 'Hausa Bakwai', 'Banza Bakwai', 'Oyo Mesi', 'Uzama', 'Hausa Bakwai means the seven authentic Hausa states.'],
      ['Which body held direct participatory authority in traditional Igbo village democracy?', 'The village assembly of adult citizens (Amala / Ohanaeze)', 'A hereditary emperor', 'A standing royal cavalry', 'A colonial resident', 'Pre-colonial Igbo communities governed by consensus in open village assemblies.'],
      ['In which part of Nigeria were the intricate 9th-century bronze artefacts of Igbo-Ukwu excavated?', 'Anambra State (Southeastern Nigeria)', 'Borno State', 'Sokoto State', 'Lagos Island', 'Igbo-Ukwu lies in present-day Anambra State.'],
      ['Which legendary warrior queen of Zazzau (Zaria) built defensive earthen walls (Ganuwar Amina) and expanded trade routes?', 'Queen Amina', 'Nana Asma’u', 'Moremi', 'Emotan', 'Queen Amina of Zazzau was renowned for military leadership and fortified town walls.'],
      ['What major lesson is shown by the shared Niger-Benue trade routes of pre-colonial Nigeria?', 'Pre-colonial Nigerian peoples maintained active economic and diplomatic ties across regions', 'Regions never traded before 1900', 'Only coastal towns used currency', 'Ironworking arrived only in 1890', 'Long-distance exchange of kola, salt, cloth and livestock connected northern and southern Nigeria for centuries.'],
    ],
  },
  {
    id: 'hist-trade-sokoto-legitimate',
    name: 'Trans-Atlantic slave trade, legitimate trade and 19th-century reforms',
    sec: 'Nigerian history',
    goals: [
      'Explain the impact of the Trans-Atlantic slave trade and the transition to palm-oil legitimate trade',
      'Trace the 19th-century transformations: the Sokoto Caliphate, Yoruba wars and Niger Delta city-states',
    ],
    trap: 'The British abolition of the slave trade (1807) did NOT immediately end European interference — "legitimate trade" in palm oil deepened European commercial rivalry and paved the way for colonial conquest.',
    p1: {
      title: 'Abolition and the rise of legitimate commerce',
      idea: 'For centuries, the Trans-Atlantic slave trade drained young African labour, fuelled wars and disrupted local crafts. After Britain outlawed the slave trade in 1807, European merchants shifted to "legitimate trade" in palm oil, palm kernels, cocoa and rubber to feed Europe’s Industrial Revolution. Niger Delta states like Bonny, Opobo (founded by King Jaja) and Itsekiri (Nana Olomu) grew wealthy as coastal middlemen before clashing with British trading monopolies.',
      terms: [
        ['Legitimate trade', '19th-century trade in agricultural commodities like palm oil replacing the export of enslaved Africans'],
        ['King Jaja of Opobo', 'Former enslaved man who rose to found prosperous Opobo and defended African trading autonomy against British encroachment'],
        ['Royal Niger Company', 'British chartered company led by George Goldie that monopolised Niger trade and laid the basis for colonial rule'],
      ],
      rules: [
        'Industrial Britain needed Nigerian palm oil to lubricate factory machines and make soap.',
        'British gunboat diplomacy deposed resilient African rulers like King Jaja (1887), Nana Olomu (1894) and Oba Ovonramwen of Benin (1897).',
      ],
      headers: ['Nigerian ruler', 'Reason for clash with Britain'],
      rows: [
        ['King Jaja of Opobo', 'Insisted on direct palm-oil export to Europe and taxed British traders'],
        ['Nana Olomu of Itsekiri', 'Controlled Benin River trade against British commercial monopoly'],
        ['Oba Ovonramwen of Benin', 'Resisted British interference in Benin sovereignty; exiled in 1897'],
      ],
      exQ: 'Why did the British consul deport King Jaja of Opobo in 1887?',
      exSteps: [
        ['Economic trigger', 'Jaja bypassed British coastal firms to ship palm oil straight to Liverpool'],
        ['Political outcome', 'Britain lured him aboard a gunboat under false promises and exiled him to the West Indies'],
      ],
      checkQ: 'Which agricultural commodity formed the backbone of 19th-century "legitimate trade" in the Niger Delta?',
      checkO: ['Palm oil', 'Wheat', 'Coffee', 'Tea'],
      checkH: [
        'European factories needed this vegetable oil for soap and machinery lubrication.',
        'The Delta was even called the "Oil Rivers" because of it.',
      ],
      checkE: 'Palm oil (and palm kernels) drove legitimate commerce in the Niger Delta.',
    },
    p2: {
      title: '19th-century internal transformations',
      idea: 'Two vast internal movements reshaped 19th-century Nigeria: in the north, the 1804 Sokoto Jihad unified Hausaland into the Sokoto Caliphate with emirates linked to Sokoto and Gwandu; in the southwest, the collapse of Old Oyo triggered the Yoruba civil wars (Ibadan, Ijaye, Kiriji/Ekitiparapo) and created new power centres like Ibadan and Abeokuta before the 1886 peace treaty.',
      terms: [
        ['Emirate system', 'Provincial governments under Emirs accountable to the Sultan of Sokoto or Emir of Gwandu'],
        ['Kiriji (Ekitiparapo) War', 'Long 19th-century war (1877–1886) between Ibadan and an Ekiti-Ijesa coalition'],
        ['Christian missions', 'CMS, Methodist and Baptist missions introducing Western schools, printing (Iwe Irohin, 1859) and early African clergy like Bishop Samuel Ajayi Crowther'],
      ],
      rules: [
        'Bishop Samuel Ajayi Crowther became the first African Anglican bishop (1864) and translated the Bible into Yoruba.',
        'Rev. Henry Townsend launched Nigeria’s first newspaper, Iwe Irohin, in Abeokuta in 1859.',
      ],
      headers: ['19th-century event', 'Long-term consequence'],
      rows: [
        ['Sokoto Caliphate (1804)', 'Political unity, Shari’ah courts and widespread literacy across northern Nigeria'],
        ['Fall of Old Oyo', 'Rise of new cities (Ibadan, Abeokuta) and refugee resettlement'],
        ['Missionary schools (1840s+)', 'Emergence of an educated Nigerian elite who later led nationalism'],
      ],
      exQ: 'How did the 19th-century Yoruba wars reshape the human geography of southwestern Nigeria?',
      exSteps: [
        ['Collapse of Old Oyo', 'Displaced populations moved south toward forest belts'],
        ['New urban centres', 'Founded fortified cities such as Ibadan (war camp) and Abeokuta (Egba refuge)'],
      ],
      checkQ: 'Who became the first African Anglican bishop in 1864 and pioneered Yoruba written literature and Bible translation?',
      checkO: ['Bishop Samuel Ajayi Crowther', 'King Kosoko', 'George Goldie', 'Lord Lugard'],
      checkH: [
        'Rescued from a slave ship as a boy and educated in Sierra Leone, he led the Niger Mission.',
        'His surname is Crowther.',
      ],
      checkE: 'Bishop Samuel Ajayi Crowther led the Niger Mission and laid foundations for written Yoruba scholarship.',
    },
    qs: [
      ['In what year did the British Parliament officially abolish the British Trans-Atlantic slave trade?', '1807', '1861', '1914', '1960', 'Britain enacted the Abolition of the Slave Trade Act in 1807.'],
      ['Which British trader merged rival firms to form the Royal Niger Company in 1886?', 'Sir George Taubman Goldie', 'Mungo Park', 'Hugh Clapperton', 'Richard Lander', 'George Goldie secured a royal charter giving the company trade monopoly and administrative powers on the Niger.'],
      ['Nigeria’s first newspaper, "Iwe Irohin", was first published in 1859 in which town?', 'Abeokuta', 'Lagos', 'Calabar', 'Kano', 'Rev. Henry Townsend published Iwe Irohin at Abeokuta in Yoruba and English.'],
      ['Which Benin monarch was deposed and exiled to Calabar following the British invasion of 1897?', 'Oba Ovonramwen', 'Oba Ewuare', 'Alaafin Abiodun', 'King Pepple', 'Oba Ovonramwen Nogbaisi was exiled to Calabar after the 1897 British expedition.'],
      ['Which fortified Yoruba city originated in the 1830s as a refuge settlement for Egba peoples displaced by the Oyo wars?', 'Abeokuta', 'Kano', 'Sokoto', 'Enugu', 'Sodeke led Egba refugees to settle under Olumo Rock, founding Abeokuta ("under the rock").'],
      ['Why was the Niger Delta known to 19th-century European merchants as the "Oil Rivers"?', 'Because it was the leading export region for palm oil', 'Because crude oil was drilled there in 1820', 'Because of olive plantations', 'Because of petroleum pipelines', 'Palm oil — long before 1956 crude oil — earned the Delta the name "Oil Rivers".'],
    ],
  },
  {
    id: 'hist-colonial-amalgamation',
    name: 'British conquest, amalgamation and colonial administration',
    sec: 'Colonial Nigeria',
    goals: [
      'Trace the British takeover from the 1861 annexation of Lagos to the 1914 Amalgamation',
      'Evaluate Lord Lugard’s Indirect Rule across Northern, Western and Eastern Nigeria and colonial economic policies',
    ],
    trap: 'The 1914 Amalgamation was driven primarily by British ADMINISTRATIVE AND FINANCIAL convenience (using southern customs surplus to offset northern deficits), NOT by a desire to build Nigerian national unity.',
    p1: {
      title: 'Conquest and the 1914 Amalgamation',
      idea: 'Britain occupied Nigeria piecemeal: annexing Lagos as a Crown Colony (1861), declaring the Oil Rivers / Niger Coast Protectorate, revoking the Royal Niger Company charter to proclaim the Northern and Southern Protectorates (1900), merging Lagos with Southern Nigeria (1906), and finally amalgamating the Northern and Southern Protectorates under Governor-General Sir Frederick Lugard on 1 January 1914.',
      terms: [
        ['1861 Annexation of Lagos', 'Treaty of Cession forced on Oba Dosunmu, making Lagos Britain’s first Nigerian Crown Colony'],
        ['1914 Amalgamation', 'Administrative merger of Northern and Southern Nigeria under Lord Lugard'],
        ['Indirect Rule', 'Governing colonised peoples through existing traditional rulers supervised by British Residents and District Officers'],
      ],
      rules: [
        'Indirect Rule succeeded most smoothly in Northern Nigeria (centralised emirates + existing tax system), had partial success in Yorubaland (Obas’ powers had traditional checks), and failed badly in Eastern Nigeria (artificial "Warrant Chiefs" sparked the 1929 Aba Women’s War).',
        'Britain kept separate Northern and Southern administrative styles even after 1914, creating lasting regional imbalances.',
      ],
      headers: ['Region', 'Result of Indirect Rule'],
      rows: [
        ['Northern Nigeria', 'Largely smooth — built on centralised emirates and existing taxation'],
        ['Western Nigeria', 'Partial — Obas lacked absolute power without chiefs’ consent'],
        ['Eastern Nigeria', 'Failed — appointed Warrant Chiefs lacked legitimacy; sparked 1929 Aba Women’s War'],
      ],
      exQ: 'Why did the 1929 Aba Women’s War erupt across southeastern Nigeria?',
      exSteps: [
        ['Political grievance', 'Unpopular, unaccountable Warrant Chiefs appointed by British officers'],
        ['Economic trigger', 'Fear of direct colonial taxation on women alongside falling palm-produce prices'],
      ],
      checkQ: 'Why did Britain amalgamate the Northern and Southern Protectorates of Nigeria in 1914?',
      checkO: [
        'To reduce administrative costs and use Southern customs surpluses to balance Northern budget deficits',
        'To grant immediate independence to Nigeria',
        'Because Northern and Southern leaders voted in a referendum',
        'To abolish all rail lines',
      ],
      checkH: [
        'Northern Nigeria was landlocked without coastal customs revenue and depended on British Treasury grants.',
        'London wanted Nigeria to pay for itself financially.',
      ],
      checkE: 'Financial and administrative convenience — offsetting Northern deficits with Southern port revenues — drove the 1914 Amalgamation.',
    },
    p2: {
      title: 'Colonial economy and infrastructure',
      idea: 'The colonial economy reoriented Nigeria toward exporting raw cash crops (cocoa in the West, groundnuts and cotton in the North, palm produce in the East) and minerals (Jos tin, Enugu coal) while importing British manufactured goods. Railways ran strictly north-south from inland producing areas to coastal ports (Lagos and Port Harcourt) to evacuate raw materials rather than link Nigerian towns laterally.',
      terms: [
        ['Cash-crop economy', 'Colonial emphasis on export crops (cocoa, groundnuts, palm oil) ahead of domestic industrial manufacturing'],
        ['Marketing Boards', 'Colonial boards buying export crops from Nigerian farmers at fixed prices, building reserves often invested in Britain'],
        ['Export-oriented railways', 'Lines running Kano–Lagos and Enugu–Port Harcourt designed to evacuate raw materials to seaports'],
      ],
      rules: [
        'Colonial banks (like Bank of British West Africa) mainly served European trading firms (such as UAC), limiting credit to Nigerian entrepreneurs.',
        'Colonial rule did introduce modern currency, railways, western hospitals and schools, yet neglected local manufacturing and balanced regional development.',
      ],
      headers: ['Region', 'Primary colonial export crop / mineral'],
      rows: [
        ['Northern Nigeria', 'Groundnuts, cotton, hides & skins, Jos tin'],
        ['Western Nigeria', 'Cocoa, timber and rubber'],
        ['Eastern Nigeria', 'Palm oil, palm kernels and Enugu coal'],
      ],
      exQ: 'Why did Nigeria’s colonial railway lines run vertically from Kano and Enugu straight to Lagos and Port Harcourt instead of east–west between Nigerian regions?',
      exSteps: [
        ['Identify the economic motive', 'Britain wanted fast evacuation of groundnuts, tin and coal to Atlantic ships'],
        ['Conclude', 'Railways served imperial export extraction rather than internal Nigerian integration'],
      ],
      checkQ: 'Which major mineral discovered at Udi Hill led to the rapid growth of Enugu and the Eastern Railway to Port Harcourt?',
      checkO: ['Coal', 'Uranium', 'Gold', 'Diamond'],
      checkH: [
        'Steam locomotives in colonial Nigeria burned this black fossil fuel.',
        'Enugu is still nicknamed the "Coal City".',
      ],
      checkE: 'Coal mined at Enugu powered colonial railways and spurred the development of Port Harcourt.',
    },
    qs: [
      ['Who signed the 1861 Treaty of Cession under British naval pressure, ceding Lagos to the British Crown?', 'Oba Dosunmu', 'Oba Kosoko', 'Oba Ewuare', 'Alaafin Atiba', 'Oba Dosunmu signed the 1861 treaty under pressure from British warships.'],
      ['Who served as the first Governor-General of amalgamated Nigeria in 1914?', 'Sir Frederick Lugard', 'Sir Hugh Clifford', 'Sir Arthur Richards', 'Sir James Robertson', 'Lord Lugard executed the 1914 Amalgamation and became Nigeria’s first Governor-General.'],
      ['In which part of Nigeria did the British introduce "Warrant Chiefs" because of the absence of centralised monarchs?', 'Eastern Nigeria', 'Sokoto Caliphate', 'Borno Emirate', 'Oyo Empire', 'Misunderstanding Igbo village democracy, British officers created artificial Warrant Chiefs.'],
      ['The 1929 protest by thousands of Igbo and Ibibio women against Warrant Chiefs and feared taxation is known as the', 'Aba Women’s War', 'Kiriji War', 'Adubi Rising', 'Satiru Revolt', 'The 1929 Women’s War forced Britain to dismantle the Warrant Chief system.'],
      ['What was the chief economic goal of the British colonial railway network in Nigeria?', 'Evacuating cash crops and minerals from the interior to coastal ports', 'Connecting every village school', 'Promoting heavy steel factories in Kano', 'Linking Nigeria directly to South Africa', 'Railways connected interior production zones directly to Lagos and Port Harcourt ports.'],
      ['Which major British trading conglomerate dominated Nigeria’s colonial import-export commerce?', 'United Africa Company (UAC)', 'OPEC', 'ECOWAS', 'NEPAD', 'The UAC controlled a huge share of colonial retail and produce purchasing.'],
    ],
  },
  {
    id: 'hist-nationalism-independence',
    name: 'Nationalism, independence and Nigeria since 1960',
    sec: 'Modern Nigeria',
    goals: [
      'Trace Nigerian nationalism from Herbert Macaulay to Nnamdi Azikiwe, Obafemi Awolowo, Ahmadu Bello and Anthony Enahoro',
      'Summarise post-independence milestones: First Republic, Civil War, military rule and return to democracy in 1999',
    ],
    trap: 'Do not confuse 1 October 1960 (Independence — Queen Elizabeth II remained ceremonial Head of State) with 1 October 1963 (Republic — Nigeria cut ties with the British monarch and Dr. Nnamdi Azikiwe became the first ceremonial President).',
    p1: {
      title: 'Nationalist movement and independence (1960)',
      idea: 'Nigerian nationalism grew through newspapers (Lagos Daily News, West African Pilot), student unions (WASU), trade unions (1945 General Strike led by Michael Imoudu) and political parties (NNDP, NYM, NCNC, AG, NPC). Chief Anthony Enahoro’s 1953 motion for self-government accelerated constitutional conferences in London and Lagos. Nigeria achieved independence on 1 October 1960 with Alhaji Sir Abubakar Tafawa Balewa as Prime Minister and became a Republic on 1 October 1963.',
      terms: [
        ['Herbert Macaulay', 'Widely called the "father of Nigerian nationalism"; founded Nigeria’s first political party (NNDP, 1923)'],
        ['West African Pilot', 'Influential nationalist newspaper founded by Dr. Nnamdi Azikiwe in 1937'],
        ['1953 Self-Government Motion', 'Motion moved by Chief Anthony Enahoro demanding independence by 1956'],
      ],
      rules: [
        'External sparks of nationalism included World War II (Nigerian soldiers saw European vulnerability), the Atlantic Charter (1941) and India’s independence (1947).',
        'Western and Eastern Regions gained internal self-government in 1957, and Northern Region in 1959, ahead of national independence in 1960.',
      ],
      headers: ['Nationalist leader', 'Key role in independence era'],
      rows: [
        ['Herbert Macaulay', 'Founded NNDP (1923); championed Lagos land and civic rights'],
        ['Dr. Nnamdi Azikiwe', 'Led NCNC; Governor-General (1960) and first President (1963)'],
        ['Chief Obafemi Awolowo', 'Led Action Group; first Premier of Western Region (free primary education)'],
        ['Sir Ahmadu Bello', 'Led NPC; first Premier of Northern Region'],
        ['Sir Abubakar Tafawa Balewa', 'First and only Prime Minister of independent Nigeria'],
      ],
      exQ: 'How did the Second World War (1939–1945) accelerate Nigerian demands for independence?',
      exSteps: [
        ['Myth broken', 'Nigerian soldiers fought alongside Europeans and saw colonial rulers were not invincible'],
        ['Global ideals', 'The 1941 Atlantic Charter affirmed every people’s right to choose their own government'],
      ],
      checkQ: 'Who moved the historic 1953 motion in the Federal House of Representatives calling for Nigeria’s self-government?',
      checkO: ['Chief Anthony Enahoro', 'Herbert Macaulay', 'Lord Lugard', 'Ernest Ikoli'],
      checkH: [
        'He was a young Action Group lawmaker from the Western Region.',
        'His motion triggered the constitutional conferences that brought independence.',
      ],
      checkE: 'Chief Anthony Enahoro moved the landmark 1953 self-government motion.',
    },
    p2: {
      title: 'Post-independence challenges and democratic return',
      idea: 'After 1960, regional rivalries, census disputes and election crises triggered the January and July 1966 coups and the painful Nigerian Civil War (1967–1970), after which General Yakubu Gowon proclaimed "No victor, no vanquished" and launched Reconciliation, Rehabilitation and Reconstruction (3Rs) plus the NYSC (1973). Oil wealth transformed the economy in the 1970s, while prolonged military rule gave way briefly to the Second Republic (1979–1983, President Shehu Shagari) and permanently to the Fourth Republic on 29 May 1999.',
      terms: [
        ['The 3Rs (1970)', 'Gowon’s post-war policy of Reconciliation, Rehabilitation and Reconstruction'],
        ['NYSC (1973)', 'National Youth Service Corps created to build national unity by deploying graduates across regions'],
        ['Fourth Republic (1999)', 'Nigeria’s longest continuous democratic era, ushered in under the 1999 Constitution'],
      ],
      rules: [
        'State creation grew Nigeria from 3 regions (1960) → 4 regions (1963) → 12 states (1967) → 19 (1976) → 21 (1987) → 30 (1991) → 36 states + FCT Abuja (1996).',
        'Discovery of crude oil in commercial quantity at Oloibiri (Bayelsa State) in 1956 shifted Nigeria from agriculture to petroleum exports.',
      ],
      headers: ['Milestone', 'Year'],
      rows: [
        ['Commercial oil discovery at Oloibiri', '1956'],
        ['Independence / Republic status', '1960 / 1963'],
        ['Nigerian Civil War', '1967–1970'],
        ['Return to Fourth Republic democracy', '1999'],
      ],
      exQ: 'Why did General Yakubu Gowon establish the National Youth Service Corps (NYSC) in 1973?',
      exSteps: [
        ['Post-war context', 'Heal distrust and foster friendship among young graduates after the Civil War'],
        ['Method', 'Deploy graduates to serve for one year in states other than their state of origin'],
      ],
      checkQ: 'Where was crude oil first discovered in commercial quantities in Nigeria in 1956?',
      checkO: ['Oloibiri (present-day Bayelsa State)', 'Jos', 'Enugu', 'Kano'],
      checkH: [
        'It lies in the Niger Delta, originally part of old Rivers Province.',
        'Shell-BP struck commercial oil there in 1956.',
      ],
      checkE: 'Shell-BP discovered commercial crude oil at Oloibiri in 1956.',
    },
    qs: [
      ['Who founded the Nigerian National Democratic Party (NNDP) in 1923, Nigeria’s first political party?', 'Herbert Macaulay', 'Ahmadu Bello', 'Yakubu Gowon', 'Tafawa Balewa', 'Herbert Macaulay formed the NNDP after the Clifford Constitution introduced elections in Lagos and Calabar.'],
      ['What changed constitutionally on 1 October 1963 when Nigeria became a Republic?', 'A Nigerian President replaced the British Queen as Head of State and Nigeria’s Supreme Court became final court of appeal', 'Britain regained control of Lagos', 'Nigeria left the United Nations', 'All regions were abolished immediately', 'The 1963 Republican Constitution ended ties to the British monarchy and Privy Council.'],
      ['Who led the landmark 1945 Nigerian General Strike that united workers across ethnic lines against colonial wages?', 'Michael Imoudu', 'Hugh Clifford', 'George Goldie', 'Oba Dosunmu', 'Pa Michael Imoudu ("Labour Leader No. 1") led the 1945 General Strike.'],
      ['How many states did General Yakubu Gowon create in May 1967 to replace Nigeria’s four regions?', '12 states', '19 states', '30 states', '36 states', 'Decree No. 14 of May 1967 split the four regions into 12 states.'],
      ['Which head of state established the National Youth Service Corps (NYSC) in 1973 to promote post-war national integration?', 'General Yakubu Gowon', 'General Sani Abacha', 'Sir Tafawa Balewa', 'Lord Lugard', 'Gowon’s administration founded NYSC in 1973 as part of post-war national unity.'],
      ['On what date did Nigeria transition from military rule to the Fourth Republic?', '29 May 1999', '1 October 1979', '12 June 1993', '15 January 1966', 'General Abdulsalami Abubakar handed power to elected President Olusegun Obasanjo on 29 May 1999.'],
    ],
  },
  {
    id: 'hist-africa-independence-unity',
    name: 'West African empires, decolonisation and African unity',
    sec: 'African history',
    goals: [
      'Summarise the rise and achievements of medieval Ghana, Mali and Songhai empires',
      'Explain African decolonisation, anti-apartheid solidarity and regional unity (OAU/AU and ECOWAS)',
    ],
    trap: 'Medieval Ghana Empire was located in present-day southeastern MAURITANIA and western MALI — NOT in modern Ghana (which chose the historic name at independence in 1957 to honour African greatness).',
    p1: {
      title: 'Great Western Sudanese empires: Ghana, Mali and Songhai',
      idea: 'Between the 8th and 16th centuries, three mighty empires rose across the West African savannah by taxing Trans-Saharan gold-for-salt trade: Ancient Ghana (Kumbi Saleh), Mali (founded by Sundiata Keita, famed for Mansa Musa’s 1324 pilgrimage and Timbuktu’s Sankore university) and Songhai (built by Sunni Ali and organised into provinces under Askia Muhammad before falling to Moroccan muskets at the Battle of Tondibi in 1591).',
      terms: [
        ['Gold-for-Salt trade', 'Trans-Saharan exchange linking North African salt mines (Taghaza) with West African goldfields (Wangara)'],
        ['Mansa Musa', 'Emperor of Mali (1312–1337) whose famed Hajj put Mali on European world maps and enriched Timbuktu scholarship'],
        ['Battle of Tondibi (1591)', 'Moroccan invasion using firearms that ended the Songhai Empire'],
      ],
      rules: [
        'Exact chronological order of the three empires: Ghana → Mali → Songhai.',
        'Timbuktu and Djenne flourished under both Mali and Songhai as centres of Islamic law, astronomy, medicine and trade.',
      ],
      headers: ['Empire', 'Famous ruler & capital/centre'],
      rows: [
        ['Ancient Ghana', 'Tunka Manin; Kumbi Saleh'],
        ['Mali Empire', 'Sundiata Keita & Mansa Musa; Niani & Timbuktu'],
        ['Songhai Empire', 'Sunni Ali & Askia Muhammad; Gao & Timbuktu'],
      ],
      exQ: 'Why did salt sell for almost its weight in gold in medieval West Africa?',
      exSteps: [
        ['Scarcity vs abundance', 'Savannah communities had rich goldfields (Wangara) but lacked natural salt needed for health and food preservation'],
        ['Mutually profitable trade', 'Saharan caravans brought salt slabs south and carried gold north'],
      ],
      checkQ: 'Which ruler founded the Mali Empire after defeating Sumanguru Kante at the Battle of Kirina around 1235?',
      checkO: ['Sundiata Keita', 'Askia Muhammad', 'Mai Idris Alooma', 'Kwame Nkrumah'],
      checkH: [
        'He is celebrated in the West African oral epic as the "Lion Prince of Mali".',
        'He preceded Mansa Musa.',
      ],
      checkE: 'Sundiata Keita founded the Mali Empire around 1235.',
    },
    p2: {
      title: 'Decolonisation, Pan-Africanism and continental unity',
      idea: 'Pan-Africanism united Africans and diaspora leaders (W.E.B. Du Bois, Marcus Garvey, Kwame Nkrumah, Nnamdi Azikiwe) to demand freedom from European rule. Ghana became the first sub-Saharan African country to win independence in 1957, inspiring a wave of independence in 1960 ("Year of Africa"). The Organisation of African Unity (OAU, 1963) backed liberation struggles in Angola, Mozambique, Zimbabwe, Namibia and against South African Apartheid (ending in 1994 under Nelson Mandela), before evolving into the African Union (AU, 2002) alongside sub-regional ECOWAS (1975).',
      terms: [
        ['Pan-Africanism', 'Movement promoting unity, dignity and political independence for all peoples of African descent'],
        ['Apartheid', 'South Africa’s former legal system of racial segregation, dismantled in 1994'],
        ['ECOWAS (1975)', 'Economic Community of West African States, co-founded by Nigeria and Togo to promote trade, free movement and peace'],
      ],
      rules: [
        'Nigeria played a frontline diplomatic and financial role against Apartheid and led ECOMOG peacekeeping missions in Liberia and Sierra Leone.',
        'The OAU was replaced by the African Union (AU) in 2002 to deepen economic integration, democracy and peace.',
      ],
      headers: ['Organisation', 'Founded & main mission'],
      rows: [
        ['OAU (Addis Ababa)', '1963 — end colonialism & apartheid; defend African sovereignty'],
        ['ECOWAS (Lagos Treaty)', '1975 — West African economic integration & regional peace'],
        ['African Union (AU)', '2002 — successor to OAU focusing on AfCFTA trade, governance and peace'],
      ],
      exQ: 'Why is 1960 remembered in African history as the "Year of Africa"?',
      exSteps: [
        ['Wave of freedom', 'Seventeen African colonies — including Nigeria — gained independence in a single year'],
        ['Global shift', 'African states joined the United Nations in force and accelerated the push to end remaining colonial rule'],
      ],
      checkQ: 'Which sub-Saharan African nation became the first to gain independence from British colonial rule in March 1957 under Kwame Nkrumah?',
      checkO: ['Ghana', 'Kenya', 'Senegal', 'Zimbabwe'],
      checkH: [
        'Formerly known as the Gold Coast, it took the name of a medieval West African empire.',
        'Its first Prime Minister was Dr. Kwame Nkrumah.',
      ],
      checkE: 'Ghana (formerly the Gold Coast) won independence on 6 March 1957 under Kwame Nkrumah.',
    },
    qs: [
      ['Which medieval West African empire was overthrown by Moroccan forces armed with muskets at the Battle of Tondibi in 1591?', 'Songhai Empire', 'Ancient Ghana', 'Benin Empire', 'Oyo Empire', 'Moroccan troops under Judar Pasha defeated Songhai at Tondibi in 1591.'],
      ['The historic Sankore university and manuscript libraries flourished in which West African city?', 'Timbuktu', 'Lagos', 'Accra', 'Nairobi', 'Timbuktu became a renowned centre of Islamic scholarship under Mali and Songhai.'],
      ['What were the two primary commodities exchanged across the medieval Trans-Saharan trade routes?', 'Gold and salt', 'Crude oil and steel', 'Cocoa and tea', 'Rubber and coal', 'West African gold was exchanged for Saharan rock salt alongside books, cloth and horses.'],
      ['In which city was the Organisation of African Unity (OAU) founded in May 1963?', 'Addis Ababa', 'Abuja', 'Cairo', 'Dakar', 'Thirty-two independent African states signed the OAU Charter in Addis Ababa, Ethiopia, in 1963.'],
      ['In what year did South Africa hold its first all-race democratic elections ending Apartheid under President Nelson Mandela?', '1994', '1963', '1975', '2002', 'Apartheid formally ended with South Africa’s democratic election in April 1994.'],
      ['Which Nigerian head of state co-championed the founding of ECOWAS alongside Togo’s Gnassingbe Eyadema in 1975?', 'General Yakubu Gowon', 'Sir Tafawa Balewa', 'Chief Ernest Shonekan', 'General Aguiyi-Ironsi', 'Gowon and Eyadema spearheaded the 1975 Treaty of Lagos creating ECOWAS.'],
    ],
  },
];

const COMP_SPECS: CompactTopicInput[] = [
  {
    id: 'comp-architecture-generations',
    name: 'Computer evolution, hardware and architecture',
    sec: 'Computer systems',
    goals: [
      'Trace the five generations of computers and classify hardware components (CPU, ALU, CU, registers, memory)',
      'Distinguish primary memory (RAM, ROM, cache) from secondary storage and input/output devices',
    ],
    trap: 'RAM is VOLATILE (loses its contents when power goes off), while ROM is NON-VOLATILE (keeps startup BIOS/firmware permanently even without power).',
    p1: {
      title: 'Generations of computers and the CPU',
      idea: 'Computers evolved across five generations: 1st (vacuum tubes), 2nd (transistors), 3rd (integrated circuits — ICs), 4th (microprocessors / VLSI) and 5th (artificial intelligence and parallel processing). Inside every modern computer, the Central Processing Unit (CPU) executes the fetch-decode-execute cycle using three core parts: the Arithmetic Logic Unit (ALU) for maths/comparisons, the Control Unit (CU) to direct signals, and high-speed Registers.',
      terms: [
        ['ALU', 'Arithmetic Logic Unit — performs addition, subtraction and logical comparisons (<, =, >)'],
        ['Control Unit (CU)', 'Directs the flow of instructions and data between memory, ALU and peripherals'],
        ['Registers', 'Tiny, ultra-fast memory slots right inside the CPU holding current instructions and operands'],
      ],
      rules: [
        'Each generation shrank computer size and heat while multiplying speed and reliability.',
        'System bus comprises the Data Bus (carries data), Address Bus (carries memory locations) and Control Bus (carries timing/read-write signals).',
      ],
      headers: ['Generation', 'Core electronic technology'],
      rows: [
        ['First (1940s–50s)', 'Vacuum tubes (huge, hot, power-hungry)'],
        ['Second (1950s–60s)', 'Transistors (smaller, faster, cooler)'],
        ['Third (1960s–70s)', 'Integrated Circuits (ICs)'],
        ['Fourth (1970s–present)', 'Microprocessors (VLSI chips)'],
      ],
      exQ: 'Which CPU component decides whether `score >= 50` is true before branching a program?',
      exSteps: [
        ['Spot the operation', 'Comparing two values (`>=`) is a logical comparison'],
        ['Identify component', 'Arithmetic Logic Unit (ALU)'],
      ],
      checkQ: 'Which core technology defined the THIRD generation of computers?',
      checkO: ['Integrated Circuits (ICs)', 'Vacuum tubes', 'Transistors', 'Mechanical gears'],
      checkH: [
        '1st = vacuum tubes, 2nd = transistors, 4th = microprocessors.',
        'The 3rd generation packed many transistors onto a single tiny silicon chip.',
      ],
      checkE: 'Integrated Circuits (ICs) defined third-generation computers.',
    },
    p2: {
      title: 'Memory hierarchy and input/output devices',
      idea: 'Memory is organised by speed and permanence. Primary memory (RAM, ROM and ultra-fast CPU Cache) interacts directly with the CPU; secondary storage (SSD, HDD, USB flash, optical discs) keeps files permanently at lower cost per gigabyte. Input devices (keyboard, mouse, scanner, barcode reader, microphone) feed raw data in; output devices (monitor, printer, speakers, plotter) present processed results.',
      terms: [
        ['RAM', 'Random Access Memory — volatile read/write workspace for running apps and open files'],
        ['ROM', 'Read-Only Memory — non-volatile chip storing permanent boot firmware (BIOS/UEFI)'],
        ['Cache memory', 'Ultra-fast SRAM sitting between CPU and RAM to store frequently reused instructions'],
      ],
      rules: [
        '1 byte = 8 bits; 1 KB = 1,024 bytes (binary); 1 MB = 1,024 KB; 1 GB = 1,024 MB.',
        'SSDs use flash chips with no moving parts, making them faster and more shock-resistant than spinning magnetic HDDs.',
      ],
      headers: ['Memory type', 'Volatile?', 'Typical role'],
      rows: [
        ['CPU Cache & RAM', 'Yes (clears on power loss)', 'Active running programs and immediate data'],
        ['ROM', 'No (permanent)', 'Startup boot instructions (BIOS/UEFI)'],
        ['SSD / HDD', 'No (permanent)', 'Long-term storage of OS, apps and user files'],
      ],
      exQ: 'Why does unsaved typing disappear if a desktop computer loses power suddenly, while the operating system itself stays intact?',
      exSteps: [
        ['Unsaved document', 'Sits in volatile RAM, which clears when electricity stops'],
        ['Operating system files', 'Stored on non-volatile SSD/HDD, which keeps data without power'],
      ],
      checkQ: 'How many bits make up 4 bytes of computer data?',
      checkO: ['32 bits', '16 bits', '8 bits', '64 bits'],
      checkH: [
        'Recall how many bits form one single byte.',
        'Multiply 4 by 8.',
      ],
      checkE: 'Since 1 byte = 8 bits, 4 bytes = 4 × 8 = 32 bits.',
    },
    qs: [
      ['Which component of the CPU coordinates timing signals and fetches instructions from memory?', 'Control Unit (CU)', 'Arithmetic Logic Unit', 'Hard Disk Drive', 'Printer spooler', 'The Control Unit fetches, decodes and coordinates execution across the CPU.'],
      ['Which memory type loses all stored data as soon as electrical power is switched off?', 'RAM', 'ROM', 'SSD', 'DVD-R', 'RAM is volatile primary memory.'],
      ['Which generation of computers introduced transistors to replace bulky vacuum tubes?', 'Second generation', 'First generation', 'Third generation', 'Fifth generation', 'Transistors defined the second generation of computers.'],
      ['A supermarket cashier scanning product stripes at checkout uses which type of device?', 'Barcode reader (input device)', 'Plotter (output device)', 'CPU cache', 'Impact printer', 'A barcode reader is an optical input device.'],
      ['Why is Cache memory placed closer to the CPU than main RAM?', 'To speed up processing by holding frequently needed instructions at ultra-low latency', 'To permanently archive family photos', 'To replace the power supply', 'To print graphics faster', 'Cache bridges the speed gap between the fast CPU and slower main RAM.'],
      ['Which storage medium uses solid-state flash memory with no spinning magnetic platters?', 'SSD (Solid State Drive)', 'Hard Disk Drive (HDD)', 'Magnetic tape', 'Floppy disk', 'SSDs store data electronically in flash memory chips with no moving parts.'],
    ],
  },
  {
    id: 'comp-number-bases-logic',
    name: 'Data representation, number bases and logic gates',
    sec: 'Digital logic',
    goals: [
      'Convert integers accurately between binary (base 2), octal (base 8), decimal (base 10) and hexadecimal (base 16)',
      'Construct truth tables for AND, OR, NOT, NAND, NOR and XOR logic gates',
    ],
    trap: 'In hexadecimal, digits 10–15 are A, B, C, D, E, F (so A = 10, F = 15) — never write "15" as two digits when converting a single hex place value!',
    p1: {
      title: 'Binary, octal and hexadecimal conversions',
      idea: 'Computers store every number, letter (ASCII/Unicode), sound and image as binary bits (0 and 1). Decimal converts to binary by repeated division by 2 (reading remainders upward). Grouping binary bits in 3s gives Octal (base 8); grouping binary bits in 4s gives Hexadecimal (base 16), which programmers use as compact shorthand for memory addresses and colour codes.',
      terms: [
        ['Bit & Nibble', 'A bit is 0 or 1; a nibble is 4 bits (exact size of one hexadecimal digit)'],
        ['ASCII / Unicode', 'Character encoding standards mapping letters and symbols to binary numbers'],
        ['Hexadecimal (Base 16)', 'Uses digits 0–9 and letters A–F (10–15)'],
      ],
      rules: [
        'Binary place values from right to left: 1, 2, 4, 8, 16, 32, 64, 128.',
        'One hex digit = 4 binary bits (e.g., 1011₂ = 8 + 2 + 1 = 11 = B₁₆).',
      ],
      headers: ['Decimal', '4-bit Binary / Hex'],
      rows: [
        ['10', '1010₂ / A₁₆'],
        ['12', '1100₂ / C₁₆'],
        ['15', '1111₂ / F₁₆'],
      ],
      exQ: 'Convert decimal 29 into binary and hexadecimal.',
      exSteps: [
        ['Powers of 2', '29 = 16 + 8 + 4 + 1 → 11101₂'],
        ['Group in 4s from right', '0001 1101 → 1 and 13(D) → 1D₁₆'],
      ],
      checkQ: 'What is the hexadecimal equivalent of binary 11011010₂?',
      checkO: ['DA₁₆', 'AD₁₆', 'C9₁₆', 'EB₁₆'],
      checkH: [
        'Split the 8 bits into two 4-bit nibbles: 1101 and 1010.',
        '1101 = 8+4+1 = 13 (D); 1010 = 8+2 = 10 (A).',
      ],
      checkE: '1101₂ = 13 = D and 1010₂ = 10 = A, so 11011010₂ = DA₁₆.',
    },
    p2: {
      title: 'Boolean logic gates and truth tables',
      idea: 'Inside every microchip, billions of tiny switches form Logic Gates that combine binary inputs (0 = False, 1 = True). AND outputs 1 only if ALL inputs are 1; OR outputs 1 if AT LEAST ONE input is 1; NOT inverts the input; NAND and NOR are inverted AND/OR (and are called universal gates because any other gate can be built from them); XOR outputs 1 only when inputs DIFFER.',
      terms: [
        ['Truth table', 'Table listing every possible binary input combination and the resulting gate output'],
        ['Universal gates', 'NAND and NOR gates — every other logic gate can be constructed using only NANDs or only NORs'],
        ['XOR (Exclusive OR)', 'Outputs 1 when inputs are different (0,1 or 1,0) and 0 when inputs are equal (0,0 or 1,1)'],
      ],
      rules: [
        'With n binary inputs, a truth table always has 2ⁿ rows (2 inputs → 4 rows; 3 inputs → 8 rows).',
        'De Morgan’s Laws: NOT(A AND B) = (NOT A) OR (NOT B), and NOT(A OR B) = (NOT A) AND (NOT B).',
      ],
      headers: ['Gate (inputs A, B)', 'Output is 1 when...'],
      rows: [
        ['AND (A · B)', 'Both A = 1 and B = 1'],
        ['OR (A + B)', 'A = 1 or B = 1 or both'],
        ['NAND', 'At least one input is 0 (opposite of AND)'],
        ['XOR', 'A and B are different'],
      ],
      exQ: 'Find the output of `(A AND B) OR (NOT C)` when A = 1, B = 0, C = 0.',
      exSteps: [
        ['Evaluate A AND B', '1 AND 0 = 0'],
        ['Evaluate NOT C', 'NOT 0 = 1'],
        ['Combine with OR', '0 OR 1 = 1'],
      ],
      checkQ: 'For inputs A = 1 and B = 1, what is the output of an XOR gate?',
      checkO: ['0', '1', '2', 'Undefined'],
      checkH: [
        'XOR stands for "Exclusive OR" — one OR the other, NOT both.',
        'When both inputs match (0,0 or 1,1), XOR outputs 0.',
      ],
      checkE: 'An XOR gate outputs 1 only when its two inputs differ; for (1, 1) it outputs 0.',
    },
    qs: [
      ['Convert binary 10110₂ to base 10 (decimal).', '22', '18', '26', '20', '16 + 0 + 4 + 2 + 0 = 22.'],
      ['What is the decimal value of hexadecimal 2F₁₆?', '47', '35', '42', '51', '2 × 16 + 15 = 32 + 15 = 47.'],
      ['Which logic gate outputs 0 ONLY when all of its inputs are 1?', 'NAND gate', 'AND gate', 'OR gate', 'NOR gate', 'NAND inverts AND, so (1, 1) produces 0 while all other pairs give 1.'],
      ['How many rows are needed in the truth table of a logic circuit with 3 binary inputs?', '8', '6', '4', '9', '2³ = 8 distinct input combinations.'],
      ['Why is Unicode preferred over classic 7-bit ASCII for modern global apps?', 'Unicode supports thousands of international scripts, accented Nigerian languages and emojis', 'ASCII cannot store English letters', 'Unicode uses zero memory', 'ASCII only works offline', '7-bit ASCII only holds 128 characters, whereas Unicode covers global writing systems including Yorùbá, Igbo and Hausa diacritics.'],
      ['Which two gates are known as "universal logic gates"?', 'NAND and NOR', 'AND and OR', 'XOR and NOT', 'OR and XOR', 'Any Boolean function can be built exclusively from NAND gates or exclusively from NOR gates.'],
    ],
  },
  {
    id: 'comp-software-algorithms-programming',
    name: 'Software, operating systems, algorithms and programming',
    sec: 'Software and coding',
    goals: [
      'Distinguish system software (OS, translators, utilities) from application software',
      'Design algorithms using flowcharts and pseudocode with sequence, selection and iteration',
    ],
    trap: 'Do not confuse a COMPILER with an INTERPRETER: a compiler translates the ENTIRE source program into machine code before running (faster runtime), whereas an interpreter translates and executes LINE BY LINE.',
    p1: {
      title: 'Operating systems and language translators',
      idea: 'Software tells hardware what to do. System software manages the computer itself — chiefly the Operating System (Windows, Linux, Android, macOS), which handles memory management, process scheduling, file systems, device drivers and user security. Language translators convert human-readable code into binary machine code: Assemblers (assembly language), Compilers (whole high-level program at once) and Interpreters (line by line).',
      terms: [
        ['Operating System (OS)', 'Master system software managing hardware resources, files, memory and user interfaces'],
        ['Compiler', 'Translates an entire high-level program into an executable machine-code file before execution'],
        ['Interpreter', 'Translates and runs high-level code one line at a time, making debugging quick'],
      ],
      rules: [
        'Utility software maintains system health: antivirus, disk defragmenter, file compression and backup tools.',
        'Application software performs specific user tasks: word processors, spreadsheets, browsers and accounting packages.',
      ],
      headers: ['Translator', 'How it works'],
      rows: [
        ['Assembler', 'Converts low-level mnemonic assembly code to machine code'],
        ['Compiler', 'Translates entire source code at once; creates standalone executable'],
        ['Interpreter', 'Translates and executes line-by-line during runtime'],
      ],
      exQ: 'Why do learners often prefer interpreted languages like Python when debugging, while game engines use compiled languages like C++?',
      exSteps: [
        ['Interpreted advantage', 'Stops immediately on the exact faulty line without waiting for full re-compilation'],
        ['Compiled advantage', 'Pre-translated machine code executes much faster for heavy graphics'],
      ],
      checkQ: 'Which core function belongs to an Operating System rather than a word processor?',
      checkO: [
        'Allocating CPU time and RAM safely among multiple running programs',
        'Checking spelling in a school essay',
        'Formatting newsletter columns',
        'Creating presentation slides',
      ],
      checkH: [
        'Think about low-level resource management shared by every program on the machine.',
        'Managing CPU scheduling and memory protection is an OS responsibility.',
      ],
      checkE: 'The Operating System manages CPU scheduling, RAM allocation, files and hardware devices.',
    },
    p2: {
      title: 'Flowcharts, pseudocode and control structures',
      idea: 'An algorithm is a finite, unambiguous step-by-step recipe to solve a problem. Programmers plan algorithms using Pseudocode (structured plain English) or Flowcharts (standard symbols: oval = Start/Stop, parallelogram = Input/Output, rectangle = Process, diamond = Decision). Every algorithm builds from three control structures: Sequence (one step after another), Selection (IF...THEN...ELSE) and Iteration/Loops (FOR, WHILE).',
      terms: [
        ['Flowchart diamond', 'Decision symbol representing a Yes/No condition branch'],
        ['Selection (Branching)', 'Choosing between alternative paths based on a condition (IF / ELSE)'],
        ['Iteration (Loop)', 'Repeating a block of instructions until a condition changes (FOR / WHILE)'],
      ],
      rules: [
        'Syntax errors break language grammar rules (caught before running); logic errors run without crashing yet give the wrong answer (e.g., adding instead of multiplying).',
        'Always trace a loop with a dry-run table tracking each variable step by step.',
      ],
      headers: ['Flowchart shape', 'Standard meaning'],
      rows: [
        ['Oval (Terminator)', 'Start or Stop of the algorithm'],
        ['Parallelogram', 'Input or Output (Read / Print)'],
        ['Rectangle', 'Processing / calculation (`total = a + b`)'],
        ['Diamond', 'Decision branch (`score >= 50?`)'],
      ],
      exQ: 'Trace this pseudocode: `sum = 0; FOR i = 1 TO 4: sum = sum + i; PRINT sum`. What is printed?',
      exSteps: [
        ['Step through i = 1, 2, 3, 4', 'sum becomes 1 → 3 → 6 → 10'],
        ['Final output', '10'],
      ],
      checkQ: 'Which flowchart symbol is always used to represent a decision condition such as `age >= 18`?',
      checkO: ['Diamond', 'Rectangle', 'Oval', 'Parallelogram'],
      checkH: [
        'It normally has two outgoing arrows labelled Yes (True) and No (False).',
        'Rectangles are for processing and parallelograms are for input/output.',
      ],
      checkE: 'A diamond shape represents conditional branching (decisions) in standard flowcharts.',
    },
    qs: [
      ['Which software translates an entire high-level source program into machine code before execution?', 'Compiler', 'Interpreter', 'Spreadsheet', 'Browser', 'A compiler translates the full source file into machine code prior to execution.'],
      ['In a flowchart, a parallelogram symbol denotes', 'Input or Output', 'Start or Stop', 'Decision', 'Loop counter', 'Standard flowcharts use parallelograms for reading inputs and displaying outputs.'],
      ['A program runs smoothly without error messages but computes area as `length + width` instead of `length * width`. This is a', 'logic error', 'syntax error', 'hardware fault', 'compiler crash', 'Logic errors violate intended problem-solving steps without breaking language syntax.'],
      ['Which control structure executes a block of code repeatedly while a condition remains true?', 'Iteration (loop)', 'Sequence', 'Compilation', 'Encapsulation', 'Iteration (FOR/WHILE loops) repeats statements based on a condition.'],
      ['Which utility program reduces file size for faster email attachment and lower storage space?', 'File compression utility', 'Device driver', 'Text editor', 'Assembler', 'Compression tools (like ZIP) shrink file size by removing redundancy.'],
      ['What is the output of `x = 2; WHILE x < 10: x = x * 2; PRINT x`?', '16', '8', '10', '4', 'x goes 2 → 4 → 8 → 16; once x is 16, `x < 10` is false so the loop stops and prints 16.'],
    ],
  },
  {
    id: 'comp-databases-networks-security',
    name: 'Databases, networking, internet and cybersecurity',
    sec: 'Data and networks',
    goals: [
      'Explain relational database keys (primary, foreign), tables and basic SQL queries',
      'Compare network topologies (LAN/WAN, Star/Bus/Ring), protocols (TCP/IP, HTTP/HTTPS, DNS) and cybersecurity safeguards',
    ],
    trap: 'Do not confuse a PRIMARY KEY with a FOREIGN KEY: a Primary Key uniquely identifies every row in its OWN table (no duplicates, never NULL), while a Foreign Key links to a Primary Key in ANOTHER table to create a relationship.',
    p1: {
      title: 'Relational databases and SQL basics',
      idea: 'A database organises related data into structured tables made of rows (records/tuples) and columns (fields/attributes) managed by a DBMS (e.g., PostgreSQL, MySQL, Access). Relational databases avoid duplication by splitting entities into linked tables joined via Primary and Foreign Keys, queried with SQL (`SELECT`, `FROM`, `WHERE`, `ORDER BY`).',
      terms: [
        ['Primary Key', 'A field (like `StudentID`) whose value is unique and non-empty for every record in a table'],
        ['Foreign Key', 'A field in one table referencing the Primary Key of another table to connect records safely'],
        ['SQL', 'Structured Query Language used to create, query and update relational databases'],
      ],
      rules: [
        'Hierarchy of data from smallest to largest: Bit → Byte/Character → Field → Record → Table/File → Database.',
        'Database normalisation eliminates redundant repetition and update anomalies.',
      ],
      headers: ['SQL clause', 'Purpose'],
      rows: [
        ['SELECT', 'Chooses which columns to display'],
        ['FROM', 'Names the table(s) to read'],
        ['WHERE', 'Filters only rows matching a condition'],
        ['ORDER BY', 'Sorts output ascending (ASC) or descending (DESC)'],
      ],
      exQ: 'Write a simple SQL query to list the names of students in `Students` table whose score is above 70.',
      exSteps: [
        ['Pick column and table', 'SELECT name FROM Students'],
        ['Add filter', 'WHERE score > 70;'],
      ],
      checkQ: 'Which property MUST hold true for every Primary Key column in a relational database table?',
      checkO: [
        'Every row must have a unique, non-null value',
        'Values must always be alphabetic text',
        'Duplicate values are encouraged',
        'It can be left blank for half the rows',
      ],
      checkH: [
        'A Primary Key’s sole purpose is to pinpoint one exact row unambiguously.',
        'Blanks (NULL) or duplicates would break uniqueness.',
      ],
      checkE: 'A Primary Key must uniquely identify each record and cannot contain NULL or duplicate values.',
    },
    p2: {
      title: 'Computer networks, internet protocols and security',
      idea: 'Networks connect computers to share files, printers and internet access — from LAN (one school/office) to MAN (city) and WAN (global internet). Most modern LANs use a Star topology connected to a central switch, while Routers forward packets across networks using IP addresses and TCP/IP. Online safety relies on HTTPS encryption, firewalls, strong unique passwords, two-factor authentication (2FA) and avoiding phishing links.',
      terms: [
        ['DNS (Domain Name System)', 'Internet directory translating human domain names (like `eyak.ng`) into numeric IP addresses'],
        ['HTTPS', 'Encrypted version of HTTP that protects passwords and bank details in transit'],
        ['Phishing', 'Deceptive fake emails, SMS or websites tricking victims into revealing passwords, PINs or OTPs'],
      ],
      rules: [
        'In a Star topology, one broken workstation cable does NOT crash the rest of the network, though failure of the central switch affects connected devices.',
        'Malware types: Virus (attaches to host files), Worm (self-replicates across networks without a host file), Trojan (disguised as useful software), Ransomware (encrypts files and demands payment).',
      ],
      headers: ['Network device / tool', 'Primary role'],
      rows: [
        ['Switch', 'Connects computers inside a LAN and forwards frames smartly to the target device'],
        ['Router', 'Connects separate networks (e.g., home LAN to the Internet) using IP addresses'],
        ['Firewall', 'Filters incoming and outgoing network traffic to block unauthorised access'],
      ],
      exQ: 'A student receives an urgent SMS claiming their bank account will close in 10 minutes unless they click a strange link and type their ATM PIN. What cyber threat is this?',
      exSteps: [
        ['Spot urgency & fake link', 'Classic social engineering designed to harvest secret credentials'],
        ['Name the attack', 'Phishing (specifically SMS phishing / smishing)'],
      ],
      checkQ: 'Which internet service translates human-friendly website names like `jamb.gov.ng` into numeric IP addresses?',
      checkO: ['DNS (Domain Name System)', 'HTML', 'USB', 'BIOS'],
      checkH: [
        'Think of it as the internet’s phonebook.',
        'It maps domain names to IP numbers.',
      ],
      checkE: 'The Domain Name System (DNS) resolves domain names into numeric IP addresses.',
    },
    qs: [
      ['In a relational database, a row representing all details about one single student is called a', 'record (tuple)', 'field', 'byte', 'primary index', 'Each horizontal row in a table is a record; each vertical column is a field.'],
      ['Which network covers a small geographical area such as a school computer laboratory?', 'LAN (Local Area Network)', 'WAN', 'Satellite grid', 'Global backbone', 'A LAN interconnects computers within a single building or campus.'],
      ['Which type of malware locks and encrypts a victim’s files, demanding money for the decryption key?', 'Ransomware', 'Firewall', 'Compiler', 'Cookie', 'Ransomware encrypts user data to extort a ransom payment.'],
      ['In a Star network topology, what happens if a single workstation cable is unplugged?', 'Only that workstation loses connection while all other computers keep working normally', 'The entire internet crashes', 'All other cables melt', 'Every server deletes its files', 'Star topology isolates individual node failures cleanly.'],
      ['What extra security feature does HTTPS provide compared with plain HTTP?', 'End-to-end encryption (TLS) protecting data sent between browser and server', 'Free unlimited mobile data', 'Faster screen brightness', 'Offline printing', 'HTTPS encrypts web traffic so eavesdroppers cannot read logins or payment details.'],
      ['Which SQL keyword filters rows so only records meeting a specific condition are returned?', 'WHERE', 'SORT', 'DELETE', 'CREATE', 'The WHERE clause specifies row-level filtering criteria in SQL.'],
    ],
  },
];

const HOMEEC_SPECS: CompactTopicInput[] = [
  {
    id: 'homeec-nutrition-meals',
    name: 'Food nutrients, balanced diet and meal planning',
    sec: 'Food and nutrition',
    goals: [
      'Classify the six food nutrients, their Nigerian food sources and deficiency diseases',
      'Plan balanced meals for different age groups and health needs (infants, adolescents, pregnant women, elderly)',
    ],
    trap: 'Do not confuse Kwashiorkor with Marasmus: Kwashiorkor stems primarily from severe PROTEIN deficiency (swollen belly, reddish hair), while Marasmus stems from severe overall ENERGY AND PROTEIN starvation (extreme wasting).',
    p1: {
      title: 'Six classes of nutrients and deficiencies',
      idea: 'Good nutrition fuels growth, energy and immunity through six nutrient classes: Carbohydrates (energy: yam, rice, garri), Proteins (growth and tissue repair: beans, fish, eggs, groundnuts), Fats/Oils (concentrated energy and insulation: palm oil, groundnut oil), Vitamins (protective regulators: fruits, leafy greens), Minerals (bones, blood, thyroid: calcium, iron, iodine) and Water (digestion and temperature control).',
      terms: [
        ['Balanced diet', 'A meal containing all six nutrient classes in the right proportions for a person’s age and activity'],
        ['Deficiency disease', 'Illness caused by prolonged lack of a specific nutrient (e.g., Scurvy from lack of Vitamin C; Goitre from lack of Iodine)'],
        ['Roughage (Dietary fibre)', 'Indigestible plant cellulose from vegetables and whole grains that prevents constipation'],
      ],
      rules: [
        'Fat-soluble vitamins: A, D, E, K (stored in body fat); Water-soluble vitamins: B-complex and C (must be eaten daily).',
        'Overcooking green vegetables in excess water destroys heat-sensitive Vitamin C and leaches B-vitamins.',
      ],
      headers: ['Missing nutrient', 'Deficiency disease'],
      rows: [
        ['Vitamin A', 'Night blindness'],
        ['Vitamin C', 'Scurvy (bleeding gums)'],
        ['Vitamin D / Calcium', 'Rickets (soft, bowed bones in children)'],
        ['Iron', 'Anaemia (fatigue, low haemoglobin)'],
        ['Iodine', 'Goitre (enlarged thyroid gland)'],
      ],
      exQ: 'Why does Nigeria fortify household table salt with iodine?',
      exSteps: [
        ['Role of iodine', 'Essential for thyroid hormones regulating metabolism and brain development'],
        ['Public health benefit', 'Prevents goitre and developmental impairment nationwide'],
      ],
      checkQ: 'Which vitamin deficiency leads to bleeding gums and slow wound healing (scurvy)?',
      checkO: ['Vitamin C', 'Vitamin A', 'Vitamin D', 'Vitamin K'],
      checkH: [
        'This water-soluble vitamin is abundant in oranges, guava, tomatoes and fresh peppers.',
        'Sailors on long sea voyages without fresh fruit suffered from this condition.',
      ],
      checkE: 'Vitamin C (ascorbic acid) deficiency causes scurvy.',
    },
    p2: {
      title: 'Meal planning across life stages',
      idea: 'Nutritional needs change with age, workload and health. Infants need exclusive breastfeeding for 6 months followed by nutrient-dense weaning foods; growing adolescents need extra protein, iron and energy; pregnant and lactating mothers need extra iron, folic acid, calcium and protein; manual labourers need high carbohydrates; while older adults need lighter, calcium-rich, easily digested meals low in excess salt and fat.',
      terms: [
        ['Weaning', 'Gradual introduction of soft, nutritious family foods alongside breastmilk after 6 months'],
        ['Malnutrition', 'Includes BOTH undernutrition (stunting, kwashiorkor) AND overnutrition (obesity)'],
        ['Food hygiene', 'Clean handling, thorough cooking and safe storage to prevent food poisoning'],
      ],
      rules: [
        'Combine affordable local foods smartly: e.g., rice + beans + leafy green stew gives complete amino acids, energy and vitamins.',
        'Pregnant women need iron and folic acid to prevent maternal anaemia and neural-tube defects.',
      ],
      headers: ['Group', 'Priority nutrients'],
      rows: [
        ['Adolescents', 'High energy, protein, calcium (bone growth) and iron (especially girls)'],
        ['Pregnant women', 'Iron, folic acid, protein and calcium'],
        ['Elderly adults', 'Moderate calories, high fibre, calcium, low saturated fat and salt'],
      ],
      exQ: 'Why should a manual bricklayer’s lunch include more carbohydrates than a sedentary office clerk’s lunch?',
      exSteps: [
        ['Energy demand', 'Heavy physical labour burns far more kilojoules per hour'],
        ['Dietary adjustment', 'Higher complex carbohydrates (e.g., yam, brown rice, beans) sustain stamina'],
      ],
      checkQ: 'Why is combining cereals (like rice or maize) with legumes (like cowpea beans or groundnuts) recommended in low-cost family meal planning?',
      checkO: [
        'Together they supply complementary amino acids for better-quality plant protein',
        'They completely remove the need to drink water',
        'They eliminate all carbohydrates from the meal',
        'They contain zero calories',
      ],
      checkH: [
        'Individual plant proteins often lack one or two essential amino acids.',
        'Pairing beans with grains fills each other’s amino-acid gaps affordably.',
      ],
      checkE: 'Cereals and legumes complement each other’s amino acids to provide high-quality, affordable protein.',
    },
    qs: [
      ['Which deficiency disease results from insufficient Vitamin D or calcium during childhood bone growth?', 'Rickets', 'Scurvy', 'Beriberi', 'Goitre', 'Lack of Vitamin D/calcium prevents proper bone mineralisation, causing rickets.'],
      ['Which group of vitamins is fat-soluble and stored in body tissues?', 'Vitamins A, D, E and K', 'Vitamins B1, B2 and C', 'Only Vitamin C', 'Fibre and starch', 'Vitamins A, D, E and K dissolve in dietary fats.'],
      ['Why should leafy vegetables like ugu or ewedu be cooked briefly with minimal water?', 'To preserve water-soluble Vitamin C and B-vitamins', 'To make them taste bitter', 'To remove all iron', 'To turn cellulose into fat', 'Prolonged boiling destroys Vitamin C and washes nutrients into discarded water.'],
      ['Severe protein deficiency in toddlers characterised by oedema (swollen abdomen) and reddish thin hair is', 'Kwashiorkor', 'Goitre', 'Night blindness', 'Anaemia', 'Kwashiorkor arises from inadequate dietary protein even when starch is eaten.'],
      ['Which mineral is essential for forming red blood cell haemoglobin and preventing anaemia?', 'Iron', 'Sodium', 'Fluorine', 'Chlorine', 'Iron forms the core of haemoglobin carrying oxygen in blood.'],
      ['For how long do health authorities recommend exclusive breastfeeding for healthy newborns before introducing weaning foods?', 'First 6 months', 'First 2 weeks', 'First 2 years exclusively', 'First 3 days', 'Exclusive breastfeeding for the first 6 months provides optimal immunity and nutrition.'],
    ],
  },
  {
    id: 'homeec-textiles-clothing',
    name: 'Textiles, laundry care and garment construction',
    sec: 'Clothing and textiles',
    goals: [
      'Classify natural and man-made textile fibres and choose suitable laundry care for each',
      'Identify sewing tools, basic stitches, seams and pattern markings in garment construction',
    ],
    trap: 'Do not wash wool or silk in boiling water or harsh alkaline bleach — protein animal fibres shrink, felt and weaken under high heat and strong alkali, unlike sturdy plant cellulose cotton.',
    p1: {
      title: 'Textile fibres and fabric care',
      idea: 'Textiles begin as fibres: Natural fibres come from plants (cotton, linen — cool, absorbent, washable at high heat) or animals (wool, silk — warm, lustrous, delicate protein fibres). Man-made fibres include regenerated cellulose (rayon/viscose) and synthetic petrochemicals (nylon, polyester — strong, crease-resistant, quick-drying, melt under a hot iron).',
      terms: [
        ['Natural fibres', 'Plant cellulose (cotton, linen) and animal protein (wool, silk)'],
        ['Synthetic fibres', 'Chemical polymer fibres (polyester, nylon, acrylic) that resist creasing but melt if ironed too hot'],
        ['Care label', 'Standard fabric tag symbols guiding safe washing temperature, bleaching, drying and ironing'],
      ],
      rules: [
        'Cotton suits Nigeria’s hot, humid climate best because it absorbs sweat and breathes comfortably.',
        'Always treat fresh stains promptly from the wrong side of the fabric before hot ironing sets the stain permanently.',
      ],
      headers: ['Fibre', 'Origin & care rule'],
      rows: [
        ['Cotton', 'Plant (cellulose) — absorbs moisture; tolerates warm washing and hot iron'],
        ['Wool / Silk', 'Animal (protein) — gentle cool wash, mild soap, dry flat (wool), low iron'],
        ['Polyester / Nylon', 'Synthetic — dries quickly, resists wrinkles; ALWAYS use cool iron'],
      ],
      exQ: 'Why does a 100% cotton school shirt feel cooler on a hot Lagos afternoon than a thick 100% polyester shirt?',
      exSteps: [
        ['Absorbency', 'Cotton absorbs sweat from skin and lets air circulate'],
        ['Synthetics', 'Polyester traps warm moisture against the body'],
      ],
      checkQ: 'Which fabric property makes cotton especially suitable for everyday tropical clothing and baby wear?',
      checkO: [
        'High absorbency, breathability and ability to withstand frequent washing',
        'It melts easily under a cool iron',
        'It repels all water completely',
        'It is heavier than wool in summer',
      ],
      checkH: [
        'Think about comfort in hot weather and hygiene for baby clothes.',
        'Cellulose plant fibres breathe well and tolerate regular laundering.',
      ],
      checkE: 'Cotton’s breathability, moisture absorbency and durability under washing make it ideal for warm climates and infant wear.',
    },
    p2: {
      title: 'Sewing tools, stitches and seams',
      idea: 'Accurate garment making uses measuring tools (tape measure, dressmaker’s chalk), cutting tools (dressmaker’s shears, pinking shears to prevent fraying) and stitching tools (hand needles, thimble, sewing machine). Stitches fall into temporary stitches (tacking/basting to hold layers briefly) and permanent stitches (running, backstitch for strength, hemming, overcasting). Common seams include plain open seam and French seam (ideal for sheer/fraying fabrics).',
      terms: [
        ['Tacking (Basting)', 'Temporary long stitches used to hold fabric pieces in place before permanent machine stitching'],
        ['French seam', 'A self-enclosed seam that hides raw edges cleanly — ideal for sheer fabrics and baby clothes'],
        ['Dart', 'Stitched tapered fold sewn into fabric to shape a flat cloth cleanly over body curves'],
      ],
      rules: [
        'Backstitch is the strongest hand stitch, mimicking machine lockstitch.',
        'Press every seam open or flat with an iron as you sew for a crisp professional finish.',
      ],
      headers: ['Stitch / Seam', 'Best practical use'],
      rows: [
        ['Tacking stitch', 'Holding pieces temporarily during fitting'],
        ['Backstitch', 'Strong permanent hand seam or mending stress points'],
        ['French seam', 'Neat enclosed seam for sheer, fraying or baby garments'],
        ['Pinking shears', 'Zigzag cut edge reducing fabric fraying'],
      ],
      exQ: 'Why should a tailor sew a French seam instead of an unfinished plain seam on a sheer chiffon blouse?',
      exSteps: [
        ['Check fabric', 'Chiffon frays rapidly and is see-through'],
        ['French seam advantage', 'Encloses all raw threads neatly inside a narrow second fold'],
      ],
      checkQ: 'Which hand stitch is the strongest permanent stitch for repairing a ripped seam when no sewing machine is available?',
      checkO: ['Backstitch', 'Even tacking', 'Diagonal basting', 'Loose running stitch'],
      checkH: [
        'Tacking and basting are temporary stitches meant to be pulled out later.',
        'This stitch overlaps backward on every step to lock the thread firmly.',
      ],
      checkE: 'Backstitch overlaps stitches tightly, making it the strongest permanent hand stitch.',
    },
    qs: [
      ['Which textile fibre is derived from an animal protein source?', 'Silk', 'Linen', 'Cotton', 'Nylon', 'Silk (silkworm cocoon) and wool (sheep fleece) are natural animal protein fibres.'],
      ['Why must polyester fabric always be pressed with a cool or low-temperature iron?', 'High heat melts synthetic thermoplastic fibres', 'It shrinks in cold air', 'It absorbs too much starch', 'It turns into linen', 'Synthetic polymers soften and melt under excessive iron heat.'],
      ['Which tool has serrated blades that cut a zigzag edge to help reduce fabric fraying?', 'Pinking shears', 'Thimble', 'Seam ripper', 'Tape measure', 'Pinking shears leave a zigzag edge that slows ravelling.'],
      ['A tapered stitched fold sewn into a bodice or skirt to give smooth three-dimensional body fit is a', 'dart', 'pleat hem', 'buttonhole', 'bobbin', 'Darts shape flat fabric cleanly around bust, waist or hips.'],
      ['Which seam completely encloses raw fabric edges, making it ideal for children’s clothes and sheer fabrics?', 'French seam', 'Unfinished plain seam', 'Basting line', 'Raw hem', 'A French seam hides raw edges neatly inside a closed channel.'],
      ['Why should blood stains be rinsed in COLD water rather than hot water first?', 'Hot water coagulates blood protein and sets the stain permanently', 'Cold water bleaches cotton white', 'Hot water dissolves cotton threads', 'Cold water adds starch', 'Protein stains (blood, egg, milk) set permanently if heated before rinsing in cold water.'],
    ],
  },
  {
    id: 'homeec-family-resources-housing',
    name: 'Family living, resource management and housing',
    sec: 'Family and home management',
    goals: [
      'Explain family types, human and non-human resources, budgeting and consumer decision-making',
      'Apply principles of home sanitation, ventilation, lighting and accident prevention',
    ],
    trap: 'Resources are NOT just money — TIME, ENERGY, SKILLS, KNOWLEDGE and ATTITUDES are vital human resources that often matter even more than cash!',
    p1: {
      title: 'Family life and managing resources',
      idea: 'The family is society’s primary social unit (nuclear, extended or single-parent), nurturing children’s values, security and health. Home management uses the four-step management process — Planning, Organising, Implementing and Evaluating — to achieve family goals using Human resources (time, energy, health, skills) and Non-human/material resources (money, house, tools, community libraries). A realistic family budget prioritises fixed needs (food, rent, school fees, savings) ahead of impulse wants.',
      terms: [
        ['Human resources', 'Intangible capacities inside people: skills, knowledge, time, energy and creativity'],
        ['Family budget', 'A written plan allocating household income across needs, savings and discretionary spending'],
        ['Impulse buying', 'Unplanned spending triggered by emotion or display rather than genuine need'],
      ],
      rules: [
        'Compare unit prices, check expiry dates and read labels before buying to stretch family income.',
        'Setting aside an emergency savings fund protects households against sudden illness or job loss.',
      ],
      headers: ['Resource class', 'Examples'],
      rows: [
        ['Human resources', 'Cooking skill, time, physical energy, education, patience'],
        ['Non-human resources', 'Salary, farmland, sewing machine, public water supply'],
      ],
      exQ: 'A student has ₦15,000 monthly allowance and lists textbooks, transport, lunch, savings and video-game skins. Which items must be budgeted FIRST?',
      exSteps: [
        ['Separate needs from wants', 'Transport, lunch, textbooks and modest savings are priority needs'],
        ['Allocate wants last', 'Entertainment comes only from any surplus remaining'],
      ],
      checkQ: 'Which of the following is classified as a HUMAN resource in home management?',
      checkO: ['Tailoring skill and time', 'A refrigerator', 'A savings account balance', 'A plot of farmland'],
      checkH: [
        'Human resources exist within a person and cannot be separated from them.',
        'Appliances, cash and land are material (non-human) resources.',
      ],
      checkE: 'Skills, knowledge, time and energy are human resources; appliances, money and land are material resources.',
    },
    p2: {
      title: 'Healthy housing, sanitation and home safety',
      idea: 'A healthy home provides clean air through cross-ventilation (windows on opposite walls), ample natural daylight, safe drinking water, covered waste disposal and clean drainage to stop mosquitoes and flies breeding. Home safety prevents the four commonest household accidents: falls (dry floors, sturdy stairs), burns/scalds (pot handles turned inward, gas leaks checked), poisoning (bleach and medicines locked high away from children) and electric shock (dry hands, intact insulation).',
      terms: [
        ['Cross-ventilation', 'Placing windows or vents on opposite walls so stale warm air exits while fresh cool air enters'],
        ['Refuse vs Sewage', 'Refuse is solid household waste; sewage is liquid wastewater from toilets, baths and sinks'],
        ['Ergonomics', 'Arranging kitchen work triangles (sink, stove, fridge) at comfortable heights to cut fatigue'],
      ],
      rules: [
        'Never pour water onto a burning cooking-oil fire — smother flames with a metal lid or fire blanket and switch off the heat.',
        'Always label chemicals clearly and NEVER store kerosene or bleach inside empty soft-drink bottles.',
      ],
      headers: ['Home hazard', 'Key prevention rule'],
      rows: [
        ['Kitchen scalds', 'Turn pot handles inward away from walkways and toddlers'],
        ['Child poisoning', 'Store medicines, bleach and insecticides in locked high cabinets'],
        ['Electrical shock', 'Never touch switches with wet hands; replace frayed cords immediately'],
      ],
      exQ: 'Why is pouring water onto a flaming pan of hot groundnut oil extremely dangerous?',
      exSteps: [
        ['Physics of oil & water', 'Water sinks beneath hotter oil, flashes instantly into steam and sprays blazing oil across the kitchen'],
        ['Safe action', 'Turn off stove and slide a snug metal lid over the pan to cut off oxygen'],
      ],
      checkQ: 'Why should household kerosene, bleach or pesticides NEVER be stored inside empty soft-drink bottles?',
      checkO: [
        'Children or visitors may mistake them for drinking water or soda and suffer fatal poisoning',
        'Plastic bottles make bleach smell sweeter',
        'It lowers the price of kerosene',
        'It improves kitchen ventilation',
      ],
      checkH: [
        'Think about accidental ingestion by young children.',
        'Familiar beverage bottles invite people to take a quick gulp without checking.',
      ],
      checkE: 'Storing toxic chemicals in beverage bottles is a leading cause of accidental household poisoning.',
    },
    qs: [
      ['Which sequence correctly states the four steps of the home management process?', 'Planning → Organising → Implementing → Evaluating', 'Buying → Cooking → Sleeping → Cleaning', 'Saving → Borrowing → Spending → Ignoring', 'Evaluating → Planning → Guessing → Stopping', 'Effective management plans goals, organises resources, executes the plan and evaluates outcomes.'],
      ['A household consisting of parents and their biological or adopted children living together is a', 'nuclear family', 'extended family', 'cooperative society', 'trade union', 'A nuclear family comprises parents and their children.'],
      ['Placing windows on opposite walls of a bedroom to allow steady fresh airflow is called', 'cross-ventilation', 'insulation', 'condensation', 'incineration', 'Cross-ventilation creates continuous airflow removing heat and stale air.'],
      ['What is the safest immediate action if cooking oil catches fire in a frying pan?', 'Turn off the heat source and smother the flames with a tight metal lid or fire blanket', 'Throw a bucket of cold water on it', 'Fan it vigorously with a newspaper', 'Carry the blazing pan through the living room', 'Smothering removes oxygen safely without causing an explosive steam splatter.'],
      ['Stagnant blocked drainage around a compound directly increases the spread of which disease?', 'Malaria (mosquito breeding)', 'Scurvy', 'Rickets', 'Goitre', 'Standing water breeds Anopheles mosquitoes that transmit malaria.'],
      ['In kitchen planning, the "work triangle" connects which three key centres to minimise wasted steps?', 'Storage (fridge/pantry), preparation (sink) and cooking (stove)', 'Dining table, TV and front gate', 'Bedroom, garage and laundry line', 'Sofa, bookshelf and balcony', 'The classic kitchen work triangle links storage, sink and cooker efficiently.'],
    ],
  },
];

const PHE_SPECS: CompactTopicInput[] = [
  {
    id: 'phe-anatomy-fitness',
    name: 'Human body systems, movement and physical fitness',
    sec: 'Sports science',
    goals: [
      'Explain how the skeletal, muscular, circulatory and respiratory systems work together during exercise',
      'Distinguish health-related fitness components from skill-related components and apply training principles',
    ],
    trap: 'Do not confuse TENDONS with LIGAMENTS: TENDONS connect MUSCLE to BONE to pull joints, whereas LIGAMENTS connect BONE to BONE to stabilise joints.',
    p1: {
      title: 'Body systems in exercise',
      idea: 'Human movement depends on four cooperating systems: the Skeletal system (206 bones providing framework, organ protection, leverage and blood cell production), the Muscular system (skeletal muscles pulling bones in antagonistic pairs like biceps/triceps), the Circulatory system (heart pumping oxygenated blood faster to active muscles) and the Respiratory system (lungs increasing breathing rate to supply oxygen and expel carbon dioxide).',
      terms: [
        ['Tendon vs Ligament', 'Tendon joins muscle to bone; ligament joins bone to bone across a joint'],
        ['Antagonistic muscles', 'Paired muscles where one contracts (agonist) while the opposite relaxes (antagonist), e.g., biceps and triceps'],
        ['Aerobic vs Anaerobic exercise', 'Aerobic uses oxygen for sustained effort (distance running); anaerobic bursts without full oxygen (100 m sprint), building lactic acid'],
      ],
      rules: [
        'Synovial joints allow wide movement: hinge joints (elbow, knee) move in one plane; ball-and-socket joints (shoulder, hip) move in all directions.',
        'Oxygen debt occurs after an intense sprint, causing heavy breathing afterward to clear lactic acid.',
      ],
      headers: ['Joint type', 'Example & motion'],
      rows: [
        ['Ball-and-socket', 'Shoulder and hip — full multi-directional rotation'],
        ['Hinge joint', 'Elbow and knee — flexion and extension in one plane'],
        ['Pivot joint', 'Neck (atlas/axis) — side-to-side head turning'],
      ],
      exQ: 'When you bend your elbow to lift a dumbbell, which muscle contracts and which relaxes?',
      exSteps: [
        ['Biceps (front of upper arm)', 'Contracts and shortens (agonist)'],
        ['Triceps (back of upper arm)', 'Relaxes and lengthens (antagonist)'],
      ],
      checkQ: 'Which tough fibrous connective tissue attaches a skeletal muscle to a bone?',
      checkO: ['Tendon', 'Ligament', 'Cartilage', 'Alveolus'],
      checkH: [
        'Ligaments hold bone to bone at a joint.',
        'Think of the Achilles structure linking your calf muscle to your heel bone.',
      ],
      checkE: 'Tendons attach muscles to bones so muscle contraction moves the skeleton.',
    },
    p2: {
      title: 'Components of fitness and training principles',
      idea: 'Physical fitness has Health-related components (cardiorespiratory endurance, muscular strength, muscular endurance, flexibility, body composition) and Skill-related components (agility, balance, coordination, power, reaction time, speed). Safe conditioning follows FITT (Frequency, Intensity, Time, Type) and core principles: Warm-up, Progressive Overload, Specificity, Reversibility ("use it or lose it") and Cool-down.',
      terms: [
        ['Progressive overload', 'Gradually increasing training load so the body adapts and grows stronger safely'],
        ['Specificity', 'Training the exact muscles and energy systems demanded by your chosen sport'],
        ['Warm-up & Cool-down', 'Warm-up raises heart rate and muscle temperature to prevent injury; cool-down clears lactic acid gradually'],
      ],
      rules: [
        'Agility is changing body direction quickly under control (vital in football and basketball); Power combines strength × speed (vital in long jump and shot put).',
        'Stopping training for weeks causes fitness gains to fade — known as Reversibility.',
      ],
      headers: ['Fitness type', 'Examples'],
      rows: [
        ['Health-related', 'Cardiovascular endurance, strength, flexibility, body composition'],
        ['Skill-related', 'Speed, agility, power, balance, coordination, reaction time'],
      ],
      exQ: 'A 100 m sprinter trains only by jogging slowly for two hours daily and wonders why her sprint time does not improve. Which training principle did she ignore?',
      exSteps: [
        ['Identify mismatch', '100 m sprinting is explosive anaerobic power, not slow aerobic jogging'],
        ['Name principle', 'Specificity'],
      ],
      checkQ: 'Which skill-related fitness component measures the ability to change direction rapidly while keeping body control?',
      checkO: ['Agility', 'Flexibility', 'Body composition', 'Muscular endurance'],
      checkH: [
        'Think of a winger dribbling past defenders in football or dodging in basketball.',
        'It combines quick footwork and sharp directional change.',
      ],
      checkE: 'Agility is the ability to change body position and direction rapidly with control.',
    },
    qs: [
      ['Which type of joint at the shoulder and hip allows movement in all directions including rotation?', 'Ball-and-socket joint', 'Hinge joint', 'Immovable suture', 'Gliding joint only', 'Ball-and-socket joints allow flexion, extension, abduction, adduction and circumduction.'],
      ['What substance accumulates in muscles during intense anaerobic sprinting, causing temporary fatigue?', 'Lactic acid', 'Glucose', 'Calcium carbonate', 'Bile', 'Anaerobic breakdown of glucose produces lactic acid.'],
      ['Connecting bone to bone across the knee to keep the joint stable is the job of a', 'ligament', 'tendon', 'haemoglobin', 'nerve axon', 'Ligaments bind bone to bone and prevent excessive joint movement.'],
      ['Gradually increasing training weight or distance over weeks so the body grows fitter is the principle of', 'progressive overload', 'reversibility', 'sedentary rest', 'overtraining injury', 'Progressive overload challenges tissues step-by-step to trigger adaptation.'],
      ['Why is a cool-down jog and gentle stretching vital immediately after a hard football match?', 'It lowers heart rate smoothly and helps flush lactic acid to reduce muscle stiffness', 'It dehydrates the body faster', 'It increases heart rate to maximum', 'It weakens tendons', 'Active cool-down restores circulation gradually and prevents blood pooling.'],
      ['Which fitness component combines maximum muscular strength with high speed?', 'Power', 'Balance', 'Flexibility', 'Reaction time', 'Power = Force × Velocity (explosive strength + speed).'],
    ],
  },
  {
    id: 'phe-athletics-games-firstaid',
    name: 'Athletics, ball games, first aid and community health',
    sec: 'Sports and health',
    goals: [
      'Explain key rules of track and field athletics and major team sports (football, basketball, volleyball)',
      'Apply immediate First Aid (RICE for sprains, bleeding control) and preventive community health measures',
    ],
    trap: 'Do not confuse a SPRAIN with a STRAIN: a SPRAIN stretches or tears a LIGAMENT at a joint (like an ankle twist), whereas a STRAIN stretches or tears a MUSCLE or TENDON (like a pulled hamstring).',
    p1: {
      title: 'Track and field athletics and ball games',
      idea: 'Athletics splits into Track events (sprints 100 m–400 m with crouch start, middle/long distances 800 m–10,000 m, hurdles and 4×100 m / 4×400 m relays using a 20 m baton exchange zone) and Field events (jumps: long jump, triple jump, high jump, pole vault; throws: shot put, discus, javelin, hammer). Major school team games follow strict court sizes and scoring: Football (11 players, 90 min), Basketball (5 on court, 2/3-point shots, dribbling), Volleyball (6 on court, max 3 hits per side, rally scoring to 25).',
      terms: [
        ['Baton exchange zone', 'The designated zone in relay races where the baton must legally pass between runners'],
        ['Triple jump phases', 'Hop (same foot), Step (other foot) and Jump (into the sand pit)'],
        ['Offside (Football)', 'Being nearer the opponents’ goal line than both the ball and second-last opponent when involved in active play'],
      ],
      rules: [
        'In shot put, the athlete must PUSH ("put") the metal shot from the neck — throwing it like a baseball is a foul.',
        'In volleyball, a player may NOT hit the ball twice in succession (except after a block), and a team has at most 3 touches to send it over the net.',
      ],
      headers: ['Sport', 'Active players per team & key rule'],
      rows: [
        ['Football', '11 players; only goalkeeper uses hands inside penalty area'],
        ['Basketball', '5 players; travelling (walking without dribbling) is a violation'],
        ['Volleyball', '6 players; maximum 3 touches per side; clockwise rotation on serve win'],
      ],
      exQ: 'In a 4 × 100 m relay, why do sprinters use a "non-visual" baton pass instead of turning around to stare at the incoming runner?',
      exSteps: [
        ['Speed preservation', 'Looking back slows the outgoing runner down'],
        ['Timing cue', 'A verbal call lets the receiver extend their hand smoothly at top sprint speed'],
      ],
      checkQ: 'What is the exact sequence of footwork phases required in the Triple Jump?',
      checkO: ['Hop, step and jump', 'Run, roll and dive', 'Step, hop and throw', 'Skip, crawl and leap'],
      checkH: [
        'First land on the SAME takeoff foot, then switch to the OTHER foot, then leap into the pit.',
        'Three words: H – S – J.',
      ],
      checkE: 'A legal triple jump consists of a hop (same foot), a step (opposite foot) and a final jump into the pit.',
    },
    p2: {
      title: 'First Aid, sports injuries and community health',
      idea: 'First Aid is the immediate, temporary care given to an injured or suddenly ill person before professional medical help arrives — aiming to preserve life, prevent worsening and promote recovery. Soft-tissue sprains and strains are managed initially using R.I.C.E. (Rest, Ice wrapped in cloth, Compression bandage, Elevation). Community health prevents communicable diseases (malaria, cholera, typhoid, HIV/AIDS) through immunisation, clean water, sanitation, avoiding drug abuse and health education.',
      terms: [
        ['R.I.C.E. protocol', 'Rest, Ice, Compression and Elevation — immediate first aid for sprains and mild strains to limit swelling'],
        ['Fracture vs Dislocation', 'Fracture is a cracked or broken bone; dislocation is a bone end forced completely out of its joint socket'],
        ['Immunisation', 'Vaccination stimulating the immune system to protect against polio, measles, tetanus and hepatitis'],
      ],
      rules: [
        'Never attempt to "pop" a dislocated shoulder or straighten a visibly deformed fracture yourself — immobilise gently with a splint/sling and seek medical care.',
        'For severe external bleeding, apply firm direct pressure with a clean sterile pad and elevate the limb if no fracture is suspected.',
      ],
      headers: ['Injury / condition', 'Correct First Aid action'],
      rows: [
        ['Ankle sprain', 'Apply R.I.C.E. (Rest, wrapped Ice, gentle Compression, Elevation)'],
        ['Open bleeding wound', 'Apply firm direct pressure with clean dressing and seek medical care'],
        ['Suspected fracture', 'Immobilise the limb gently in the position found; do not force movement'],
        ['Fainting', 'Lay casualty flat, loosen tight clothing, raise legs slightly and ensure fresh air'],
      ],
      exQ: 'A basketball player twists an ankle and it begins swelling immediately. List the four R.I.C.E. steps.',
      exSteps: [
        ['R & I', 'Rest off the foot; apply ice wrapped in a towel for 15 minutes'],
        ['C & E', 'Wrap lightly with an elastic compression bandage; elevate ankle above heart level'],
      ],
      checkQ: 'In the R.I.C.E. first-aid treatment for an ankle sprain, what does the letter "E" stand for?',
      checkO: ['Elevation', 'Exercise', 'Exertion', 'Electricity'],
      checkH: [
        'Raising the injured joint reduces fluid pooling and swelling.',
        'R = Rest, I = Ice, C = Compression, E = ...',
      ],
      checkE: 'Elevation raises the injured limb above heart level to reduce throbbing and swelling.',
    },
    qs: [
      ['How many players from one team are allowed on the court at the same time in a standard volleyball match?', '6', '5', '11', '9', 'Each volleyball team fields 6 active players on court.'],
      ['An injury involving overstretched or torn ligaments around the ankle joint is called a', 'sprain', 'strain', 'concussion', 'cramp', 'Sprains affect joint ligaments; strains affect muscles or tendons.'],
      ['Which start position is mandatory in official 100 m, 200 m and 400 m track sprint races?', 'Crouch start (using starting blocks)', 'Standing start', 'Seated start', 'Flying run-up', 'Sprint races up to 400 m require a crouch start from starting blocks.'],
      ['What is the safest immediate first-aid step for severe bleeding from a forearm cut?', 'Apply firm direct pressure over the wound with a clean pad', 'Rub dry sand onto the cut', 'Ignore it until evening', 'Give the victim hot pepper soup', 'Firm direct pressure controls blood loss safely until medical treatment.'],
      ['Which disease is transmitted mainly through contaminated drinking water and poor faecal sanitation?', 'Cholera', 'Malaria', 'Rickets', 'Asthma', 'Cholera spreads via water or food contaminated with Vibrio cholerae.'],
      ['In athletics, which throwing event requires pushing a heavy metal sphere smoothly from the side of the neck?', 'Shot put', 'Javelin', 'Discus', 'Hammer throw', 'Shot put forbids a throwing motion and requires a forward put from the neck/chin.'],
    ],
  },
];

const ART_SPECS: CompactTopicInput[] = [
  {
    id: 'art-elements-colour-perspective',
    name: 'Elements and principles of design, colour and perspective',
    sec: 'Visual fundamentals',
    goals: [
      'Apply the elements of art (line, shape, form, texture, value, colour, space) and principles of design (balance, rhythm, unity, contrast)',
      'Use colour theory (primary, secondary, tertiary, complementary) and linear/aerial perspective in drawing',
    ],
    trap: 'Do not confuse SHAPE with FORM: a SHAPE is flat and 2-dimensional (circle, square), whereas a FORM has 3-dimensional volume and depth (sphere, cube, cylinder) created through light and shading.',
    p1: {
      title: 'Elements of art and principles of design',
      idea: 'Every drawing, painting, poster or sculpture combines the seven Elements of Art (Line, Shape, Form, Value/Tone, Colour, Texture and Space) guided by Principles of Design: Balance (symmetrical or asymmetrical), Contrast, Emphasis (focal point), Rhythm, Proportion, Harmony and Unity.',
      terms: [
        ['Chiaroscuro (Value/Tone)', 'Use of light and shadow shading (hatching, cross-hatching, stippling, smudging) to show 3D volume'],
        ['Symmetrical balance', 'Mirror-like equal visual weight on both sides of a central axis'],
        ['Texture', 'Surface quality — actual tactile roughness (carved wood) or visual implied texture drawn on paper'],
      ],
      rules: [
        'Warm colours (red, orange, yellow) visually advance toward the viewer; cool colours (blue, green, violet) visually recede.',
        'Proportion compares relative sizes (e.g., an adult human figure is roughly 7.5 to 8 head-heights tall).',
      ],
      headers: ['Colour group', 'Examples on pigment colour wheel'],
      rows: [
        ['Primary colours', 'Red, Yellow, Blue (cannot be mixed from other pigments)'],
        ['Secondary colours', 'Orange (R+Y), Green (Y+B), Violet/Purple (R+B)'],
        ['Complementary pairs', 'Opposite on wheel: Red–Green, Blue–Orange, Yellow–Violet'],
      ],
      exQ: 'How do you create a "tint" versus a "shade" of blue paint?',
      exSteps: [
        ['Tint (lighter)', 'Add WHITE to blue → sky blue'],
        ['Shade (darker)', 'Add BLACK to blue → navy blue'],
      ],
      checkQ: 'Which colour sits directly opposite Blue on the standard pigment colour wheel as its complementary colour?',
      checkO: ['Orange', 'Green', 'Violet', 'Red'],
      checkH: [
        'Mix the OTHER two primary colours (Red + Yellow) to find Blue’s complement.',
        'Complementary colours produce vibrant contrast when placed side by side.',
      ],
      checkE: 'Orange (Red + Yellow) lies opposite Blue on the colour wheel, making Blue and Orange complementary colours.',
    },
    p2: {
      title: 'Drawing and perspective',
      idea: 'Perspective creates the convincing illusion of 3D depth on a flat 2D sheet. Linear perspective uses a Horizon Line (eye level) and one or more Vanishing Points where parallel receding edges (like railway tracks or road curbs) appear to converge. Aerial (atmospheric) perspective shows distant hills looking lighter, hazier and cooler/bluer than sharp foreground objects.',
      terms: [
        ['Horizon line', 'Imaginary horizontal line across the picture plane matching the viewer’s exact eye level'],
        ['Vanishing point', 'Point on the horizon line where parallel receding lines appear to meet'],
        ['Foreshortening', 'Drawing an object pointing toward the viewer shorter than its true length to show depth accurately'],
      ],
      rules: [
        'One-point perspective views an object straight-on (e.g., looking straight down a hallway); two-point perspective views the corner edge of a building.',
        'Still-life drawing arranges inanimate everyday objects (calabashes, bottles, fruits) to study light, overlap and cast shadows.',
      ],
      headers: ['Perspective type', 'Visual cue'],
      rows: [
        ['One-point linear', 'All receding lines converge to one single vanishing point'],
        ['Two-point linear', 'Corner of box faces viewer; left and right edges recede to two points'],
        ['Aerial / atmospheric', 'Distant objects grow paler, softer and slightly bluish'],
      ],
      exQ: 'Standing in the middle of a straight Nigerian highway looking ahead, where do the left and right edges of the road appear to meet?',
      exSteps: [
        ['Locate eye level', 'Along the horizon line'],
        ['Locate convergence', 'At a single central vanishing point (one-point perspective)'],
      ],
      checkQ: 'Adding white paint to pure red pigment produces a lighter value known as a',
      checkO: ['tint', 'shade', 'complementary hue', 'vanishing point'],
      checkH: [
        'White lightens a hue; black darkens a hue.',
        'Black produces a shade; white produces a ...',
      ],
      checkE: 'Mixing a colour with white creates a tint (pink is a tint of red); mixing with black creates a shade.',
    },
    qs: [
      ['Which three colours are the traditional pigment primary colours?', 'Red, Yellow and Blue', 'Red, Green and Black', 'Orange, Green and Violet', 'White, Grey and Black', 'Red, yellow and blue cannot be mixed from other pigments and generate secondary colours.'],
      ['The point on the horizon line where parallel receding railway tracks appear to meet is the', 'vanishing point', 'focal prism', 'primary tint', 'chiaroscuro', 'Parallel receding edges converge at a vanishing point on the horizon line.'],
      ['Shading a drawing with intersecting sets of parallel ink lines is called', 'cross-hatching', 'pointillism', 'batik', 'collaging', 'Cross-hatching layers crisscrossing lines to build darker tonal values.'],
      ['Which colours are considered "cool colours" that appear to recede in a landscape painting?', 'Blue, green and violet', 'Red, orange and yellow', 'Brown, ochre and crimson', 'Gold and scarlet', 'Cool hues evoke sky and water and visually recede into distance.'],
      ['What distinguishes a 3D form from a 2D shape in visual art?', 'Form possesses depth/volume in addition to height and width', 'Form can only be painted red', 'Shape always uses clay', 'Form has no outline', 'Shapes are flat (2D); forms have volume and depth (3D).'],
      ['Which principle of design directs the viewer’s eye first to the most important focal area of a poster?', 'Emphasis', 'Monotony', 'Foreshortening', 'Glazing', 'Emphasis uses contrast, size or placement to establish a clear focal point.'],
    ],
  },
  {
    id: 'art-nigerian-traditions-crafts',
    name: 'Nigerian art traditions, sculpture, ceramics and textile crafts',
    sec: 'Art history and crafts',
    goals: [
      'Compare major Nigerian traditional art centres (Nok, Igbo-Ukwu, Ife, Benin, Esie, Tsoede, Mbari) and modern Nigerian masters',
      'Explain craft processes in ceramics, tie-and-dye (Adire), batik, weaving (Aso-Oke, Akwete) and graphic printmaking',
    ],
    trap: 'Do not confuse TIE-AND-DYE (Adire Oniko) with BATIK (Adire Eleko): tie-and-dye resists dye by TYING/STITCHING fabric tightly, whereas batik resists dye by applying hot WAX or cassava starch paste!',
    p1: {
      title: 'Nigerian art heritage and modern pioneers',
      idea: 'Nigeria possesses one of Africa’s richest art histories: Nok terracotta figures (pierced triangular eyes, 500 BC–200 AD), Igbo-Ukwu leaded bronze vessels (9th century), Ife naturalistic brass heads with striated faces (12th–15th centuries), Benin royal bronze plaques made by the lost-wax (cire perdue) technique, Esie soapstone figures (Kwara) and Tsoede bronzes (Nupe). Modern Nigerian art was pioneered by Aina Onabolu (first trained Nigerian modern painter), Ben Enwonwu (sculptor of "Anyanwu" and "Sango"), Ladi Kwali (master Abuja potter) and Bruce Onobrakpeya (printmaking innovator).',
      terms: [
        ['Lost-wax (Cire perdue) casting', 'Ancient metal-casting method used in Ife and Benin where a wax model is encased in clay, melted out and replaced with molten bronze'],
        ['Terracotta', 'Fired brownish-red unglazed earthenware clay used famously in Nok and Ife sculptures'],
        ['Aina Onabolu', 'Widely recognised as the father of modern Nigerian art and formal art education in schools'],
      ],
      rules: [
        'Nok sculptures are identifiable by stylised triangular or semicircular pierced eyes and cylindrical/conical heads.',
        'Ladi Kwali fused traditional Gbagyi hand-built pottery with modern stoneware glazing at the Abuja Pottery Centre.',
      ],
      headers: ['Art centre / pioneer', 'Signature medium & hallmark'],
      rows: [
        ['Nok', 'Fired terracotta heads with pierced triangular eyes'],
        ['Ife & Benin', 'Lost-wax brass/bronze heads and palace plaques'],
        ['Esie (Kwara)', 'Hundreds of carved soapstone figures'],
        ['Ladi Kwali', 'Master Nigerian ceramicist honoured on the ₦20 note'],
      ],
      exQ: 'Which Nigerian ceramicist is honoured on the back of the Nigerian ₦20 banknote for elevating indigenous pottery to global acclaim?',
      exSteps: [
        ['Identify craft', 'Pottery / ceramics at the Abuja Pottery Centre'],
        ['Name artist', 'Dr. Ladi Kwali'],
      ],
      checkQ: 'Which ancient casting method did Ife and Benin royal sculptors use to produce hollow bronze heads and plaques?',
      checkO: ['Lost-wax (cire perdue) casting', 'Screen printing', 'Loom weaving', 'Origami folding'],
      checkH: [
        'A beeswax model over a clay core is melted away to leave a mould for molten metal.',
        'Its French name is "cire perdue".',
      ],
      checkE: 'Ife and Benin artists mastered the lost-wax (cire perdue) metal-casting process.',
    },
    p2: {
      title: 'Ceramics, Adire textiles and graphic arts',
      idea: 'Applied arts combine beauty with everyday function. In Ceramics, moist clay is wedged (to remove air bubbles so pots do not explode in the kiln), shaped by pinching, coiling, slabbing or throwing on a potter’s wheel, dried to leather-hard/bone-dry state, bisque-fired and glazed. In Nigerian textiles, artisans craft Adire (indigo resist-dyed cloth from Abeokuta/Ibadan using tying or cassava starch — Adire Eleko), Aso-Oke narrow-strip weaving (Yoruba) and Akwete broadloom weaving (Igbo). Graphic design communicates clearly through posters, typography, logos and screen printing.',
      terms: [
        ['Wedging (Kneading)', 'Working moist clay thoroughly before shaping to expel trapped air bubbles that could burst during firing'],
        ['Kiln', 'High-temperature oven used to fire clay pottery permanently into hard ceramic ware'],
        ['Adire Eleko', 'Traditional Yoruba resist-dyed cloth painted with cassava starch paste before indigo dyeing'],
      ],
      rules: [
        'A piece of clay must be completely bone-dry before firing in a kiln, otherwise trapped steam shatters the pot.',
        'Good graphic posters use bold legible typography, clear visual hierarchy and high contrast so readers grasp the message in seconds.',
      ],
      headers: ['Nigerian textile craft', 'Key method & region'],
      rows: [
        ['Adire Oniko', 'Tie-and-dye resist using raffia/thread (Abeokuta/Ibadan)'],
        ['Adire Eleko', 'Cassava-starch resist painted freehand or stencilled before indigo bath'],
        ['Akwete cloth', 'Intricate hand-woven broadloom cloth of Akwete (Abia State)'],
        ['Aso-Oke', 'Traditional Yoruba hand-woven narrow-strip ceremonial cloth'],
      ],
      exQ: 'Why must a ceramicist wedge clay thoroughly before coiling or throwing a water pot?',
      exSteps: [
        ['Air pockets inside clay', 'Expand explosively when heated to 900°C+ in a kiln'],
        ['Benefit of wedging', 'Removes trapped air and makes clay texture uniform'],
      ],
      checkQ: 'In pottery making, what is the main purpose of "wedging" clay before shaping a vessel?',
      checkO: [
        'To expel trapped air bubbles and make the clay smooth and uniform so it will not explode in the kiln',
        'To apply glossy coloured paint',
        'To freeze the clay solid',
        'To turn clay into plastic',
      ],
      checkH: [
        'Think about what happens to trapped air or steam inside a thick clay wall at 1,000°C.',
        'Wedging is similar to kneading bread dough carefully.',
      ],
      checkE: 'Wedging removes air pockets and evens moisture, preventing cracking or explosion during kiln firing.',
    },
    qs: [
      ['Which pioneering painter is widely honoured as the "father of modern Nigerian art"?', 'Aina Onabolu', 'Pablo Picasso', 'Leonardo da Vinci', 'Rembrandt', 'Aina Onabolu championed modern academic painting and introduced formal art teaching in Nigerian schools.'],
      ['The hundreds of ancient carved soapstone figures in Kwara State belong to which Nigerian art tradition?', 'Esie', 'Nok', 'Igbo-Ukwu', 'Benin', 'Esie in Kwara State houses Africa’s largest collection of carved soapstone sculptures.'],
      ['Which resist-dyeing method uses melted wax (or cassava starch paste) applied onto fabric before dipping in dye?', 'Batik (or Adire Eleko)', 'Etching', 'Carving', 'Mosaic', 'Wax or starch shields covered areas from absorbing dye.'],
      ['A high-temperature furnace built specifically for firing clay pottery into hard ceramics is a', 'kiln', 'loom', 'easel', 'palette', 'Kilns fire dried clay at extreme temperatures to vitrify pottery.'],
      ['Which renowned Nigerian sculptor created the iconic bronze statue "Anyanwu" at the National Museum in Lagos and "Sango" at Marina?', 'Ben Enwonwu', 'Ladi Kwali', 'Uche Okeke', 'Wole Soyinka', 'Prof. Ben Enwonwu was one of Africa’s foremost 20th-century sculptors and painters.'],
      ['What is the traditional hand-woven ceremonial cloth famous from Abia State in southeastern Nigeria?', 'Akwete', 'Kente', 'Tartan', 'Denim', 'Akwete women weavers are famed for rich geometric broadloom textiles.'],
    ],
  },
];

const MUSIC_SPECS: CompactTopicInput[] = [
  {
    id: 'music-notation-rhythm-scales',
    name: 'Staff notation, rhythm, time signatures and scales',
    sec: 'Music theory',
    goals: [
      'Read treble and bass clefs, note/rest durations, dotted notes and simple vs compound time signatures',
      'Construct major and minor scales, key signatures and diatonic intervals accurately',
    ],
    trap: 'Do not confuse 3/4 (Simple Triple: three crotchet beats) with 6/8 (Compound Duple: TWO dotted-crotchet beats grouped as 3 + 3 quavers) — both contain six quavers per bar, yet their rhythmic feel is completely different!',
    p1: {
      title: 'Staff, clefs, note values and time signatures',
      idea: 'Western staff notation writes pitch vertically on five lines and four spaces anchored by a Clef — Treble (G) clef fixes G4 on line 2 (lines E-G-B-D-F, spaces F-A-C-E), while Bass (F) clef fixes F3 on line 4 (lines G-B-D-F-A, spaces A-C-E-G). Rhythm is shown by note values: Semibreve (4 beats), Minim (2), Crotchet (1), Quaver (½) and Semiquaver (¼). A dot after a note increases its duration by HALF its own value.',
      terms: [
        ['Dotted note', 'Adds half the original note’s length (e.g., dotted minim = 2 + 1 = 3 crotchet beats)'],
        ['Simple time', 'Each beat divides naturally into 2 equal parts (e.g., 2/4, 3/4, 4/4)'],
        ['Compound time', 'Each beat is a dotted note dividing naturally into 3 equal parts (e.g., 6/8 = 2 dotted-crotchet beats)'],
      ],
      rules: [
        'In a simple time signature like 3/4: top number = beats per bar (3); bottom number = type of beat (4 = crotchet).',
        'In a compound time signature like 6/8: divide the top number by 3 to get main beats (6 ÷ 3 = 2 dotted-crotchet beats).',
      ],
      headers: ['Note name (UK / US)', 'Crotchet beats'],
      rows: [
        ['Semibreve (Whole note)', '4 beats'],
        ['Minim (Half note)', '2 beats'],
        ['Crotchet (Quarter note)', '1 beat'],
        ['Quaver (Eighth note)', '½ beat'],
      ],
      exQ: 'How many quaver (eighth-note) beats equal one dotted crotchet?',
      exSteps: [
        ['Plain crotchet', '2 quavers'],
        ['Dot adds half of 2', '+ 1 quaver → 3 quavers total'],
      ],
      checkQ: 'Which time signature is classified as COMPOUND DUPLE time (two dotted-crotchet beats per bar)?',
      checkO: ['6/8', '3/4', '4/4', '2/4'],
      checkH: [
        'Compound time signatures have 6, 9 or 12 as the top number.',
        'Divide the top number by 3 to get "duple" (2 main beats).',
      ],
      checkE: '6/8 has two main dotted-crotchet beats per bar (each subdividing into 3 quavers), making it compound duple time.',
    },
    p2: {
      title: 'Major/minor scales, key signatures and intervals',
      idea: 'Every Major scale follows the exact step pattern Tone–Tone–Semitone–Tone–Tone–Tone–Semitone (T-T-S-T-T-T-S). Key signatures place sharps (order: F-C-G-D-A-E-B) or flats (B-E-A-D-G-C-F) right after the clef so accidentals need not be rewritten. Every Major key shares its exact key signature with a Relative Minor key starting 3 semitones lower (e.g., C major → A minor; G major → E minor).',
      terms: [
        ['Major scale formula', 'T – T – S – T – T – T – S (semitones between degrees 3–4 and 7–8)'],
        ['Relative minor', 'The minor key sharing the exact same key signature as a major key (found on the 6th degree of the major scale)'],
        ['Harmonic minor', 'Natural minor scale with its 7th degree raised by one semitone to create a strong leading note'],
      ],
      rules: [
        'Quick sharp-key trick: the last sharp in the key signature is always the 7th note (leading note) — step up one semitone to name the Major key (e.g., F♯ → G major).',
        'Quick flat-key trick: the second-to-last flat names the Major key (except 1 flat B♭ = F major).',
      ],
      headers: ['Major key', 'Key signature & relative minor'],
      rows: [
        ['C Major', 'No sharps or flats → A minor'],
        ['G Major', '1 sharp (F♯) → E minor'],
        ['D Major', '2 sharps (F♯, C♯) → B minor'],
        ['F Major', '1 flat (B♭) → D minor'],
      ],
      exQ: 'A piece has two sharps (F♯ and C♯) in its key signature. What are the Major key and its Relative Minor?',
      exSteps: [
        ['Last sharp is C♯', 'One semitone above C♯ is D → D Major'],
        ['Step down 3 semitones from D', 'D → C♯ → C → B → B minor'],
      ],
      checkQ: 'Which Major key has ONE flat (B♭) in its key signature?',
      checkO: ['F Major', 'G Major', 'D Major', 'B♭ Major'],
      checkH: [
        'Build a major scale starting on F using T-T-S-T-T-T-S: F–G–A–B♭–C–D–E–F.',
        'Its relative minor is D minor.',
      ],
      checkE: 'F Major requires a single flat (B♭) to maintain the T-T-S-T-T-T-S major scale pattern.',
    },
    qs: [
      ['What are the letter names of the four SPACES of the treble staff from bottom to top?', 'F – A – C – E', 'E – G – B – D', 'A – C – E – G', 'G – B – D – F', 'The four treble spaces spell F-A-C-E.'],
      ['How many crotchet (quarter-note) beats does a dotted minim receive?', '3 beats', '2 beats', '4 beats', '1.5 beats', 'A minim (2 beats) plus half its value (1 beat) equals 3 beats.'],
      ['Between which scale degrees do the two semitones occur in every Major scale?', '3rd–4th and 7th–8th', '1st–2nd and 5th–6th', '2nd–3rd and 6th–7th', '4th–5th and 6th–7th', 'The T-T-S-T-T-T-S pattern places semitones at 3–4 and 7–8.'],
      ['What is the relative minor key of G Major (one sharp, F♯)?', 'E minor', 'A minor', 'D minor', 'C minor', 'The 6th degree of G major (3 semitones below G) is E minor.'],
      ['What does a sharp sign (♯) placed immediately before a note do to its pitch?', 'Raises the pitch by one semitone', 'Lowers the pitch by one semitone', 'Doubles its duration', 'Silences the note', 'A sharp raises pitch by one semitone; a flat lowers it by one semitone.'],
      ['Which dynamic marking instructs musicians to play very softly?', 'pp (pianissimo)', 'ff (fortissimo)', 'mf (mezzo-forte)', 'crescendo', 'pp stands for pianissimo (very soft); ff is fortissimo (very loud).'],
    ],
  },
  {
    id: 'music-harmony-african-instruments',
    name: 'Harmony, cadences, African instruments and music history',
    sec: 'Harmony and African music',
    goals: [
      'Identify primary triads (I, IV, V) and the four main cadences (Perfect, Plagal, Imperfect, Interrupted)',
      'Classify traditional African and Nigerian musical instruments (Sachs–Hornbostel system) and Nigerian popular/art music genres',
    ],
    trap: 'Do not confuse MEMBRANOPHONES with IDIOPHONES: drums with stretched animal skin (Dundun, Bata) are MEMBRANOPHONES, whereas bells, xylophones and rattles whose OWN solid body vibrates (Agogo, Ekwe, Shekere) are IDIOPHONES.',
    p1: {
      title: 'Triads, cadences and musical forms',
      idea: 'Harmony combines pitches sounded simultaneously into chords. The three Primary Triads of any key — Tonic (I), Subdominant (IV) and Dominant (V) — harmonise most melodies. Musical phrases end with punctuation points called Cadences: Perfect (V → I, final full stop), Plagal (IV → I, the "Amen" cadence), Imperfect (any chord → V, unfinished comma) and Interrupted/Deceptive (V → vi, surprise turn).',
      terms: [
        ['Perfect cadence (V → I)', 'Strong, conclusive ending moving from Dominant to Tonic'],
        ['Plagal cadence (IV → I)', 'Gentle, solemn ending moving from Subdominant to Tonic ("Amen" cadence)'],
        ['Binary (AB) vs Ternary (ABA) form', 'Binary has two contrasting sections; Ternary returns to the opening theme after a middle contrast'],
      ],
      rules: [
        'A major triad consists of Root + Major 3rd (4 semitones) + Perfect 5th (7 semitones), e.g., C–E–G.',
        'Rondo form repeats a main theme between episodes: A – B – A – C – A.',
      ],
      headers: ['Cadence', 'Chord progression & feel'],
      rows: [
        ['Perfect', 'V → I (strong, finished full stop)'],
        ['Plagal', 'IV → I (gentle "Amen" close)'],
        ['Imperfect', 'I / II / IV → V (open-ended musical comma)'],
        ['Interrupted', 'V → vi (unexpected surprise detour)'],
      ],
      exQ: 'In the key of C major, which two chords form a Perfect Cadence?',
      exSteps: [
        ['Find Dominant (V) in C major', 'G major chord (G–B–D)'],
        ['Find Tonic (I) in C major', 'C major chord (C–E–G) → G → C'],
      ],
      checkQ: 'Which cadence moves from the Subdominant chord (IV) to the Tonic chord (I) and is commonly called the "Amen" cadence?',
      checkO: ['Plagal cadence', 'Perfect cadence', 'Imperfect cadence', 'Interrupted cadence'],
      checkH: [
        'Perfect cadence uses V → I; look for the cadence using IV → I.',
        'It is often heard at the end of church hymns.',
      ],
      checkE: 'A Plagal cadence moves IV → I and is traditionally sung on "Amen".',
    },
    p2: {
      title: 'African musical instruments and Nigerian music heritage',
      idea: 'Ethnomusicologists classify African instruments into four families: Idiophones (self-sounding solid bodies: Agogo gong, Ekwe slit drum, Udu clay pot, Shekere rattle), Membranophones (stretched skin drums: Dundun talking drum, Bata, Kalangu), Chordophones (stringed instruments: Goje fiddle, Kora harp-lute, Molo) and Aerophones (wind instruments: Kakaki long trumpet, Algaita oboe, Oja wooden flute). African music shines through polyrhythm, call-and-response and social integration, inspiring Nigerian genres from Highlife, Juju, Fuji and Afrobeat (Fela Anikulapo-Kuti) to classical art music (Fela Sowande, Akin Euba).',
      terms: [
        ['Idiophone', 'Instrument whose own solid body vibrates when struck or shaken (Agogo, Ekwe, Udu, Sekere)'],
        ['Membranophone', 'Drum producing sound from a stretched animal membrane (Dundun talking drum, Bata)'],
        ['Polyrhythm', 'Two or more distinct rhythmic patterns played simultaneously — a hallmark of African ensembles'],
      ],
      rules: [
        'The Yoruba Dundun (hourglass talking drum) mimics the rising and falling tones of Yoruba speech when the drummer squeezes its tension cords.',
        'Fela Sowande is celebrated as the father of modern Nigerian art music ("African Suite").',
      ],
      headers: ['Instrument family', 'Nigerian examples'],
      rows: [
        ['Idiophones', 'Agogo (metal bell), Ekwe (wooden slit drum), Udu (clay pot), Shekere'],
        ['Membranophones', 'Dundun (talking drum), Bata, Kalangu, Igba'],
        ['Chordophones', 'Goje (one-string fiddle), Molo, Gurmi'],
        ['Aerophones', 'Kakaki (royal trumpet), Algaita, Oja (notched flute)'],
      ],
      exQ: 'Why is the Igbo Ekwe (carved wooden slit drum) classified as an Idiophone rather than a Membranophone?',
      exSteps: [
        ['Check sound source', 'No animal skin is stretched over the Ekwe — its carved hardwood body vibrates directly'],
        ['Classify', 'Idiophone'],
      ],
      checkQ: 'To which instrument family do the Hausa Kakaki trumpet and Igbo Oja wooden flute belong?',
      checkO: ['Aerophones', 'Chordophones', 'Membranophones', 'Idiophones'],
      checkH: [
        'Both produce musical sound through a vibrating column of AIR blown by the player.',
        'Look for the root "aero-" meaning air.',
      ],
      checkE: 'Aerophones produce sound by vibrating a column of air, including the Kakaki, Algaita and Oja.',
    },
    qs: [
      ['Which chord progression produces a conclusive Perfect Cadence?', 'V → I', 'IV → I', 'I → V', 'V → vi', 'Dominant (V) resolving to Tonic (I) forms a Perfect Cadence.'],
      ['The Yoruba Dundun (hourglass talking drum) belongs to which class of musical instruments?', 'Membranophones', 'Aerophones', 'Chordophones', 'Idiophones', 'Its sound comes from stretched skin membranes tightened by leather cords.'],
      ['Which traditional northern Nigerian instrument is a bowed one-string fiddle (chordophone)?', 'Goje', 'Kakaki', 'Ekwe', 'Agogo', 'The Goje is a classic West African bowed string chordophone.'],
      ['The musical form structured as A – B – A (statement, contrast, return of opening theme) is called', 'Ternary form', 'Binary form', 'Strophic unison', 'Monophony', 'Ternary form consists of three parts where the opening A section returns after contrasting B.'],
      ['Who pioneered the Afrobeat genre blending Yoruba rhythms, jazz horns and sharp social commentary?', 'Fela Anikulapo-Kuti', 'Fela Sowande', 'Ludwig van Beethoven', 'Wolfgang Mozart', 'Fela Anikulapo-Kuti created Afrobeat in Nigeria during the late 1960s and 1970s.'],
      ['Playing two or more contrasting rhythmic patterns simultaneously in an African drumming ensemble is called', 'polyrhythm', 'monotone', 'silence', 'plagal cadence', 'Polyrhythm layers interlocking beats, giving African music its rich rhythmic energy.'],
    ],
  },
];

export function buildHistCurriculum() {
  return buildUtmeSubjectCurriculum([...HIST_SPECS.map(compactUtmeTopic), ...HIST_EXTRA_SPECS]);
}
export function buildCompCurriculum() {
  return buildUtmeSubjectCurriculum([...COMP_SPECS.map(compactUtmeTopic), ...COMP_EXTRA_SPECS]);
}
export function buildHomeEcCurriculum() {
  return buildUtmeSubjectCurriculum([...HOMEEC_SPECS.map(compactUtmeTopic), ...HOMEEC_EXTRA_SPECS]);
}
export function buildPheCurriculum() {
  return buildUtmeSubjectCurriculum([...PHE_SPECS.map(compactUtmeTopic), ...PHE_EXTRA_SPECS]);
}
export function buildArtCurriculum() {
  return buildUtmeSubjectCurriculum([...ART_SPECS.map(compactUtmeTopic), ...ART_EXTRA_SPECS]);
}
export function buildMusicCurriculum() {
  return buildUtmeSubjectCurriculum([...MUSIC_SPECS.map(compactUtmeTopic), ...MUSIC_EXTRA_SPECS]);
}
