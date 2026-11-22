import type { UtmeTopicSpec } from './builder';

const SEC2 = 'Section 2: Political development in Nigeria';

export const GOVT_SEC2_SPECS: UtmeTopicSpec[] = [
  {
    id: 'govt-precolonial-ng',
    name: 'Pre-colonial political systems in Nigeria',
    sec: SEC2,
    goals: [
      'Compare the Hausa/Fulani emirate, Yoruba Oyo empire and Igbo acephalous systems.',
      'Explain how checks and balances operated in pre-colonial Nigerian societies.',
    ],
    trap: 'The pre-colonial Igbo system was NOT chaotic — it was decentralised (acephalous) with consensus decisions through the Oha-na-eze, Council of Elders and age grades.',
    parts: [
      {
        title: 'Hausa/Fulani emirate and Yoruba Oyo systems',
        idea: 'Before British rule, Nigerian peoples ran sophisticated political systems: the highly centralised Hausa/Fulani emirates in the north and the semi-centralised Oyo empire with strong checks in the west.',
        terms: [
          ['Emirate system', 'Centralised Islamic system established after the 1804 Jihad led by Usman dan Fodio, headed by Emirs under Sokoto and Gwandu.'],
          ['Oyomesi', 'Council of seven noble kingmakers in Old Oyo led by the Bashorun, who checked the Alaafin’s power.'],
          ['Ogboni cult', 'Secret society of elders mediating between the Alaafin and Oyomesi in Old Oyo.'],
        ],
        rules: [
          'In the Emirate system, the Emir held executive, legislative and judicial authority guided by Shari’ah (with Alkali courts and officials like Waziri, Galadima, Madawaki and Dogari).',
          'In Old Oyo, if the Alaafin became tyrannical, the Bashorun presented an empty calabash ordering him to commit suicide — a dramatic constitutional check.',
        ],
        table: {
          headers: ['System', 'Structure', 'Key check on power'],
          rows: [
            ['Hausa/Fulani', 'Highly centralised emirates', 'Shari’ah law and allegiance to Sultan of Sokoto'],
            ['Yoruba (Old Oyo)', 'Constitutional monarchy', 'Oyomesi (empty calabash) and Ogboni'],
            ['Igbo', 'Decentralised / acephalous', 'Village assembly (Oha-na-eze), Ofo holders, age grades'],
          ],
        },
        example: {
          q: 'Why is the pre-colonial Old Oyo empire often described as a constitutional monarchy?',
          steps: [
            ['Check the Alaafin’s power.', 'Although respected, the Alaafin could not rule arbitrarily.'],
            ['Name the checks.', 'The Oyomesi kingmakers could reject a tyrannical Alaafin, while the Ogboni checked abuses by the Oyomesi itself.'],
          ],
        },
        yourTurn: {
          q: 'In the pre-colonial Hausa/Fulani emirate, which official served as the Emir’s prime minister and chief administrative adviser?',
          o: ['Waziri', 'Madawaki', 'Dogari', 'Bashorun'],
          a: 0,
          h: [
            'Madawaki commanded the army, Dogari were the police, and Bashorun was in Old Oyo.',
            'Which title belonged to the Emir’s senior administrative adviser?',
          ],
          e: 'The Waziri acted as senior adviser and prime minister in the Hausa/Fulani emirate administration.',
        },
      },
      {
        title: 'The Igbo decentralised system',
        idea: 'Pre-colonial Igbo communities operated segmentary (acephalous) village democracies without a single central king, making laws by consensus across lineage heads, age grades and titled societies.',
        terms: [
          ['Acephalous (stateless) system', 'A political society without a single centralised king or standing bureaucracy.'],
          ['Ofo', 'Sacred staff of authority held by the oldest male (Okpara) of each lineage, symbolising justice.'],
          ['Age grades', 'Peer groups that enforced community decisions, cleared roads and defended the village.'],
        ],
        rules: [
          'Key Igbo institutions: Oha-na-eze (Village Assembly of adult males), Council of Elders (Amala/Ndichie), Ozo title holders, Age Grades and Oracles (e.g. Arochukwu) for final appeals.',
          'Indirect Rule struggled in Eastern Nigeria because British officials had to invent “Warrant Chiefs” where no kings existed.',
        ],
        table: {
          headers: ['Igbo institution', 'Main political role'],
          rows: [
            ['Oha-na-eze (Village Assembly)', 'Direct democratic law-making by consensus'],
            ['Okpara / Council of Elders', 'Preside over family/village disputes with Ofo'],
            ['Age grades', 'Public works, sanitation and enforcing fines'],
            ['Oracles (e.g. Ibini Ukpabi)', 'Final judicial court of appeal'],
          ],
        },
        example: {
          q: 'Why did the British Indirect Rule policy work smoothly in Northern Nigeria but trigger the 1929 Aba Women’s Riot in Eastern Nigeria?',
          steps: [
            ['Compare pre-colonial structures.', 'Northern Nigeria already had centralised Emirs and organised tax collection (Jangali/Kharaj).'],
            ['Contrast Eastern Nigeria.', 'Igbo society was decentralised and opposed direct taxation and imposed Warrant Chiefs.'],
          ],
        },
        yourTurn: {
          q: 'Which institution in pre-colonial Igbo society acted as the direct village legislature where every adult male could speak?',
          o: ['Oha-na-eze (Village Assembly)', 'Oyomesi', 'Alkali court', 'Warrant Chiefs'],
          a: 0,
          h: [
            'Recall that Igbo communities practised direct village democracy.',
            'Oyomesi belonged to Oyo, Alkali to the Emirates, and Warrant Chiefs were colonial inventions.',
          ],
          e: 'The Oha-na-eze (Village Assembly) allowed direct participation and consensus law-making.',
        },
      },
    ],
    qs: [
      {
        q: 'In pre-colonial Old Oyo, the commander-in-chief of the army who lived outside the capital was the:',
        o: ['Aare Ona Kakanfo', 'Madawaki', 'Waziri', 'Okpara'],
        a: 0,
        e: 'The Aare Ona Kakanfo commanded Old Oyo’s army and was expected to win battles or never return alive.',
      },
      {
        q: 'Which title belonged to the bodyguards and police in the pre-colonial Hausa/Fulani emirate?',
        o: ['Dogari', 'Ogboni', 'Ozo', 'Ilari'],
        a: 0,
        e: 'The Dogari maintained law and order and guarded the Emir’s palace.',
      },
      {
        q: 'Pre-colonial Igbo political organisation is best described as:',
        o: ['Decentralised and democratic', 'Absolute monarchy', 'Military dictatorship', 'Unitary bureaucracy'],
        a: 0,
        e: 'Igbo villages operated consensus-based, decentralised governance without a single supreme monarch.',
      },
      {
        q: 'Who led the 1804 Jihad that established the Sokoto Caliphate?',
        o: ['Usman dan Fodio', 'King Jaja of Opobo', 'Oba Ovonramwen', 'Herbert Macaulay'],
        a: 0,
        e: 'Sheikh Usman dan Fodio led the 1804 reform movement that created the Sokoto Caliphate.',
      },
      {
        q: 'In Old Oyo, the body that checked excesses of both the Alaafin and the Oyomesi was the:',
        o: ['Ogboni society', 'Alkali court', 'Age grades', 'Warrant chiefs'],
        a: 0,
        e: 'The Ogboni mediated constitutional crises and checked arbitrary acts by the Oyomesi or Alaafin.',
      },
      {
        q: 'In pre-colonial Hausa/Fulani emirates, justice was administered according to Islamic law by:',
        o: ['Alkali judges', 'Age grades', 'District officers', 'Warrant chiefs'],
        a: 0,
        e: 'Alkali (Qadi) courts administered Shari’ah justice across the emirates.',
      },
    ],
  },
  {
    id: 'govt-colonial-policies',
    name: 'British penetration and French colonial policy',
    sec: SEC2,
    goals: [
      'Explain British Indirect Rule and why it succeeded in the North, partially worked in the West and failed in the East.',
      'Compare British Indirect Rule with French Assimilation and Association policies.',
    ],
    trap: 'French Assimilation treated colonies as overseas extensions of France, while British Indirect Rule ruled through local traditional rulers.',
    parts: [
      {
        title: 'British Indirect Rule in Nigeria',
        idea: 'Introduced by Lord Frederick Lugard, Indirect Rule governed Nigerian territories through existing traditional rulers under the supervision of British Residents and District Officers.',
        terms: [
          ['Indirect Rule', 'British policy of administering colonies through indigenous chiefs and native authorities under British supervision.'],
          ['Warrant Chiefs', 'Artificial chiefs appointed by Britain in acephalous Eastern Nigeria where no kings existed.'],
          ['1914 Amalgamation', 'Merging of the Northern and Southern Protectorates by Lord Lugard mainly for financial and administrative convenience.'],
        ],
        rules: [
          'Reasons for Indirect Rule: shortage of British staff, lack of funds, vast territory, language barriers and success in Northern Nigeria.',
          'Indirect Rule succeeded in the North (centralised emirs), was partially successful in the West (educated elites & checks on Obas), and failed in the East (no centralised kings → 1929 Aba Women’s Riot).',
        ],
        table: {
          headers: ['Region', 'Outcome of Indirect Rule', 'Main reason'],
          rows: [
            ['Northern Nigeria', 'Largely successful', 'Centralised Emirs and existing tax system'],
            ['Western Nigeria', 'Partially successful', 'Obas had constitutional limits; educated elites opposed it'],
            ['Eastern Nigeria', 'Failed', 'Decentralised Igbo society rejected Warrant Chiefs & direct tax'],
          ],
        },
        example: {
          q: 'Why did Britain amalgamate the Northern and Southern Protectorates in 1914?',
          steps: [
            ['Check the finances.', 'The Southern Protectorate had revenue surpluses from coastal customs duties, while the Northern Protectorate ran a deficit.'],
            ['State the aim.', 'Amalgamation let Southern surpluses fund Northern administration and eased railway/customs coordination.'],
          ],
        },
        yourTurn: {
          q: 'Which event in 1929 exposed the failure of Indirect Rule and the Warrant Chief system in Eastern Nigeria?',
          o: ['The Aba Women’s Riot', 'The Kano Riot', 'The Enugu Coal Strike', 'The Berlin Conference'],
          a: 0,
          h: [
            'Market women protested fear of direct taxation and abuses by imposed chiefs.',
            'It took place in Aba and neighbouring Eastern towns in 1929.',
          ],
          e: 'The 1929 Aba Women’s Riot protested taxation and abusive Warrant Chiefs, forcing Britain to reform Eastern administration.',
        },
      },
      {
        title: 'French policies of Assimilation and Association',
        idea: 'France first pursued Assimilation — aiming to turn West African subjects into black French citizens — before shifting to Association when Assimilation proved too expensive and unpopular.',
        terms: [
          ['Policy of Assimilation', 'French effort to replace African culture with French language, law and citizenship (applied chiefly in Senegal’s Four Communes).'],
          ['Indigénat', 'Harsh French colonial code allowing arbitrary punishment and forced labour on unassimilated “sujets”.'],
          ['Policy of Association', 'Later French shift respecting local African customs while keeping firm central French control.'],
        ],
        rules: [
          'Only citizens of Senegal’s Four Communes (Dakar, Gorée, Rufisque, Saint-Louis) easily became French citizens (citoyens); most others remained subjects (sujets).',
          'Unlike Britain, France ruled directly, treated colonies as part of France, and let African deputies sit in the French National Assembly in Paris.',
        ],
        table: {
          headers: ['Dimension', 'British Indirect Rule', 'French Assimilation'],
          rows: [
            ['Role of chiefs', 'Retained and strengthened as Native Authorities', 'Reduced to minor tax/labour agents'],
            ['Cultural goal', 'Preserve local institutions where useful', 'Turn Africans into Frenchmen'],
            ['Representation', 'Local Legislative Councils', 'Deputies sent to Parliament in Paris'],
            ['End goal', 'Eventual separate self-government', 'Integration into Greater France'],
          ],
        },
        example: {
          q: 'Why did France abandon pure Assimilation for the Policy of Association?',
          steps: [
            ['Identify the obstacles.', 'Educating millions to full French status was too costly, French politicians feared being outvoted by African deputies, and Africans resisted erasing their own culture.'],
            ['State the shift.', 'France switched to Association to cooperate with local customs at lower cost.'],
          ],
        },
        yourTurn: {
          q: 'Under French colonial rule in West Africa, the harsh legal system imposing forced labour and summary punishment on unassimilated Africans was the:',
          o: ['Indigénat', 'Oyomesi', 'Warrant system', 'Loi Cadre'],
          a: 0,
          h: [
            'It applied to “sujets” (subjects), not full French “citoyens”.',
            'Loi Cadre (1956) actually expanded local self-government later on.',
          ],
          e: 'The Indigénat subjected unassimilated African subjects to forced labour and summary administrative penalties.',
        },
      },
    ],
    qs: [
      {
        q: 'Who introduced the Indirect Rule system in Nigeria?',
        o: ['Lord Frederick Lugard', 'Sir Hugh Clifford', 'Sir Arthur Richards', 'Sir John Macpherson'],
        a: 0,
        e: 'Lord Lugard introduced Indirect Rule in Northern Nigeria and extended it nationwide after 1914.',
      },
      {
        q: 'In French West Africa, full Assimilation was most fully practised in:',
        o: ['The Four Communes of Senegal', 'Northern Nigeria', 'Sierra Leone', 'The Gold Coast'],
        a: 0,
        e: 'Dakar, Gorée, Rufisque and Saint-Louis in Senegal enjoyed full French civic rights under Assimilation.',
      },
      {
        q: 'Which 1956 French reform granted greater internal autonomy to French West African territories?',
        o: ['Loi Cadre', 'Indigénat', 'Berlin Act', 'Clifford Decree'],
        a: 0,
        e: 'The 1956 Loi Cadre devolved substantial local legislative and executive power to French African territories.',
      },
      {
        q: 'A major reason Nigerian educated elites opposed Indirect Rule was that it:',
        o: ['Excluded educated Africans in favour of traditional rulers', 'Gave immediate independence', 'Abolished all native courts', 'Sent Nigerians to the British Parliament'],
        a: 0,
        e: 'Indirect Rule sidelined educated nationalists from administration and boosted conservative chiefs.',
      },
      {
        q: 'Under British colonial rule, Lagos was administered as a:',
        o: ['Crown Colony', 'French Commune', 'Confederation', 'Trust Territory'],
        a: 0,
        e: 'Lagos was annexed in 1861 and governed directly as a British Crown Colony.',
      },
      {
        q: 'How did Britain and France differ in their attitude toward African traditional rulers?',
        o: ['Britain governed through traditional rulers, whereas France largely bypassed or subordinated them', 'France gave traditional rulers supreme veto power', 'Britain abolished all emirs in 1914', 'Both countries eliminated every chief immediately'],
        a: 0,
        e: 'Britain relied on indigenous chiefs under Indirect Rule; France used direct French administrators.',
      },
    ],
  },
  {
    id: 'govt-colonial-nationalism',
    name: 'Colonial rule and nationalism',
    sec: SEC2,
    goals: [
      'Define nationalism and distinguish early resistance (proto-nationalism) from modern nationalism.',
      'Explain internal and external factors that accelerated Nigerian nationalism after 1945.',
    ],
    trap: 'The Second World War boosted Nigerian nationalism because returning soldiers saw that European powers were not invincible and heard Allied promises of self-determination.',
    parts: [
      {
        title: 'Impact of colonial rule and rise of nationalism',
        idea: 'Colonial rule introduced railways, Western schools and modern towns, yet it exploited African resources and denied political equality — sparking nationalism, the conscious drive for self-rule.',
        terms: [
          ['Nationalism', 'Strong sense of national consciousness and organised struggle to end foreign rule and win self-determination.'],
          ['Proto-nationalism', 'Early resistance by traditional rulers (such as King Jaja of Opobo, Nana of Itsekiri and Oba Ovonramwen) against British conquest.'],
          ['Modern nationalism', 'Organised struggle led by Western-educated elites using newspapers, unions and political parties to win independence.'],
        ],
        rules: [
          'Internal sparks: exclusion of educated elites under Indirect Rule, racial discrimination in the civil service, economic exploitation and nationalist newspapers (e.g. West African Pilot).',
          'External sparks: the 1941 Atlantic Charter, Second World War veterans, Indian independence (1947), Pan-African Congresses and the UN Charter.',
        ],
        table: {
          headers: ['Factor type', 'Examples'],
          rows: [
            ['Internal factors', 'Exclusion of elites, discriminatory pay, nationalist press, trade unions, WASU'],
            ['External factors', 'Atlantic Charter (1941), WWII ex-servicemen, India’s 1947 independence, UN anti-colonialism'],
          ],
        },
        example: {
          q: 'How did the 1941 Atlantic Charter inspire Nigerian nationalists?',
          steps: [
            ['Recall the Charter’s promise.', 'Clause 3 affirmed the right of all peoples to choose the form of government under which they live.'],
            ['Connect to Nigeria.', 'Nationalists like Nnamdi Azikiwe cited it to demand self-government from Britain.'],
          ],
        },
        yourTurn: {
          q: 'Which newspaper founded by Dr. Nnamdi Azikiwe in 1937 became a powerful voice for Nigerian nationalism?',
          o: ['West African Pilot', 'London Times', 'Daily Decree', 'Royal Gazette'],
          a: 0,
          h: [
            'Its famous motto was “Show the light and the people will find the way”.',
            'It was published in Lagos by Zik.',
          ],
          e: 'The West African Pilot mobilised public awareness across Nigeria against colonial injustice.',
        },
      },
      {
        title: 'Early nationalist organisations and methods',
        idea: 'Before mass political parties emerged, students, lawyers and trade unions formed cross-border groups like NCBWA and WASU to petition Britain for reforms.',
        terms: [
          ['NCBWA', 'National Congress of British West Africa (1920), founded by J. E. Casely Hayford to demand elected councils and a West African university.'],
          ['WASU', 'West African Students’ Union (London, 1925), founded by Ladipo Solanke to unite West African students against colonialism.'],
          ['NYM', 'Nigerian Youth Movement (1934), first truly nationwide nationalist movement in Nigeria.'],
        ],
        rules: [
          'Nationalists used constitutional methods in Nigeria: newspapers, petitions, delegations to London, labour strikes (1945 General Strike) and political rallies — rather than armed guerrilla war.',
          'Herbert Macaulay is widely revered as the “Father of Nigerian Nationalism” and founded the NNDP (1923).',
        ],
        table: {
          headers: ['Organisation', 'Key leader', 'Milestone'],
          rows: [
            ['NCBWA (1920)', 'J. E. Casely Hayford', 'Prompted Clifford’s elective principle'],
            ['NNDP (1923)', 'Herbert Macaulay', 'Nigeria’s first political party'],
            ['WASU (1925)', 'Ladipo Solanke', 'Trained future nationalist leaders in Britain'],
            ['NYM (1934)', 'Ernest Ikoli / Samuel Akinsanya', 'Challenged NNDP dominance in Lagos'],
          ],
        },
        example: {
          q: 'Why was the 1945 General Strike led by Michael Imoudu a turning point for Nigerian nationalism?',
          steps: [
            ['Identify who joined.', 'Railway, postal and civil service workers across the country struck for 45 days against poor wages and inflation.'],
            ['Explain the political effect.', 'It proved that organised Nigerian workers and nationalist leaders could paralyse colonial administration peacefully.'],
          ],
        },
        yourTurn: {
          q: 'Who is widely hailed as the “Father of Nigerian Nationalism” and founder of the NNDP in 1923?',
          o: ['Herbert Macaulay', 'Lord Lugard', 'Ahmadu Bello', 'Casely Hayford'],
          a: 0,
          h: [
            'He also published the Lagos Daily News and championed Eleko’s rights.',
            'His face appears on the Nigerian 1 Naira coin.',
          ],
          e: 'Herbert Macaulay led early nationalist opposition in Lagos and founded the NNDP in 1923.',
        },
      },
    ],
    qs: [
      {
        q: 'Which body founded in London in 1925 united West African students to campaign against colonial rule?',
        o: ['WASU', 'ECOWAS', 'OPEC', 'NEPAD'],
        a: 0,
        e: 'The West African Students’ Union (WASU), led by Ladipo Solanke, became a hub of anti-colonial activism.',
      },
      {
        q: 'Who led the 1920 National Congress of British West Africa (NCBWA)?',
        o: ['J. E. Casely Hayford', 'Lord Lugard', 'Obafemi Awolowo', 'Tafawa Balewa'],
        a: 0,
        e: 'Gold Coast lawyer J. E. Casely Hayford spearheaded the NCBWA across Nigeria, Gold Coast, Sierra Leone and The Gambia.',
      },
      {
        q: 'Early resistance by rulers like King Jaja of Opobo and Oba Ovonramwen is called:',
        o: ['Proto-nationalism', 'Neo-colonialism', 'Commercialisation', 'Federalism'],
        a: 0,
        e: 'Proto-nationalism refers to early traditional resistance against initial European conquest.',
      },
      {
        q: 'How did the Second World War accelerate Nigerian nationalism?',
        o: ['Returning soldiers challenged the myth of European invincibility and demanded promised freedoms', 'Britain ended all Western education', 'Nigeria joined the French Union', 'All newspapers were closed permanently'],
        a: 0,
        e: 'Exposure abroad and the Atlantic Charter spurred stronger demands for immediate self-government.',
      },
      {
        q: 'Nigeria’s first political party, formed in 1923 following the Clifford Constitution, was the:',
        o: ['NNDP', 'NPC', 'AG', 'PDP'],
        a: 0,
        e: 'Herbert Macaulay formed the Nigerian National Democratic Party (NNDP) in 1923.',
      },
      {
        q: 'Which movement grew out of the Lagos Youth Movement in 1934 to protest the status of Yaba Higher College?',
        o: ['Nigerian Youth Movement (NYM)', 'Northern People’s Congress', 'Action Group', 'NEPU'],
        a: 0,
        e: 'The Nigerian Youth Movement demanded higher educational standards and national unity.',
      },
    ],
  },
  {
    id: 'govt-nationalist-independence',
    name: 'Nationalist movements and the road to independence',
    sec: SEC2,
    goals: [
      'Trace the roles of NCNC, AG, NPC and NEPU in the final decade before 1960.',
      'Explain the 1953 self-government motion, London/Lagos conferences and 1960 independence.',
    ],
    trap: 'The 1953 motion for “self-government in 1956” was moved by Chief Anthony Enahoro (Action Group), NOT Nnamdi Azikiwe.',
    parts: [
      {
        title: 'Major pre-independence political parties',
        idea: 'Between 1944 and 1951, mass political parties took centre stage — NCNC (nationalist appeal), Action Group (Western Region) and NPC (Northern Region) — driving negotiations for independence.',
        terms: [
          ['NCNC (1944)', 'National Council of Nigeria and the Cameroons — first president Herbert Macaulay, secretary-general Nnamdi Azikiwe.'],
          ['Action Group (1951)', 'Emerged from Egbe Omo Oduduwa under Chief Obafemi Awolowo; championed federalism and free primary education.'],
          ['NPC (1951)', 'Northern People’s Congress led by Sir Ahmadu Bello (Sardauna of Sokoto), with Sir Abubakar Tafawa Balewa as deputy.'],
        ],
        rules: [
          'NEPU (Northern Elements Progressive Union), led by Mallam Aminu Kano, challenged conservative feudal privilege in the North.',
          'Regionalisation of parties later created ethnic tensions alongside rapid progress toward self-rule.',
        ],
        table: {
          headers: ['Party', 'Key leader', 'Stronghold / hallmark'],
          rows: [
            ['NCNC', 'Herbert Macaulay / Nnamdi Azikiwe', 'Broad nationalist appeal, strong in East & Lagos'],
            ['AG', 'Chief Obafemi Awolowo', 'Western Region; free primary education & welfare'],
            ['NPC', 'Sir Ahmadu Bello / Tafawa Balewa', 'Northern Region; “One North, One People”'],
            ['NEPU', 'Mallam Aminu Kano', 'Radical Talakawa (commoners’) party in North'],
          ],
        },
        example: {
          q: 'Why did the Action Group emerge from the cultural group Egbe Omo Oduduwa in 1951?',
          steps: [
            ['Identify the constitutional trigger.', 'The 1951 Macpherson Constitution introduced regional elections and ministries.'],
            ['Explain the strategy.', 'Chief Awolowo transformed the Yoruba cultural union into a disciplined party to win Western Region elections.'],
          ],
        },
        yourTurn: {
          q: 'Which leader founded the Northern Elements Progressive Union (NEPU) to defend the rights of commoners (Talakawa)?',
          o: ['Mallam Aminu Kano', 'Sir Ahmadu Bello', 'Chief Obafemi Awolowo', 'Chief Anthony Enahoro'],
          a: 0,
          h: [
            'He was a prominent reformist politician from Kano.',
            'Sir Ahmadu Bello led the rival conservative NPC.',
          ],
          e: 'Mallam Aminu Kano led NEPU to campaign for social justice and commoners’ rights in Northern Nigeria.',
        },
      },
      {
        title: 'The road from 1953 to 1 October 1960',
        idea: 'Following Chief Anthony Enahoro’s 1953 self-government motion and the Kano Riot, constitutional conferences in London and Lagos settled federalism, regional self-government and minority fears, culminating in independence on 1 October 1960.',
        terms: [
          ['1953 Self-Government Motion', 'Moved by Anthony Enahoro asking Britain for Nigerian self-government in 1956; NPC amended it to “as soon as practicable”.'],
          ['Willink Commission (1957)', 'Panel set up to examine fears of ethnic minorities; recommended fundamental human rights in the Constitution rather than new states.'],
          ['1959 Federal Election', 'Produced an NPC–NCNC coalition government with Tafawa Balewa as Prime Minister and AG in opposition.'],
        ],
        rules: [
          'Western and Eastern Regions got internal self-government in 1957; Northern Region followed in 1959.',
          'Nigeria became independent on 1 October 1960 with Queen Elizabeth II as titular Head of State (represented by Governor-General Nnamdi Azikiwe) until the 1963 Republic.',
        ],
        table: {
          headers: ['Milestone', 'Outcome'],
          rows: [
            ['1953 Enahoro Motion', 'Triggered London Conference & shift to true federalism'],
            ['1957 Self-Government', 'East and West attained internal self-rule; Balewa became first PM'],
            ['1957–58 Willink Commission', 'Recommended entrenched Bill of Rights'],
            ['1 Oct 1960', 'Full political independence for Nigeria'],
          ],
        },
        example: {
          q: 'How did the 1957 Willink Commission propose to calm minority fears before independence?',
          steps: [
            ['Recall the demand.', 'Minorities in the Mid-West, Middle Belt and Calabar-Ogoja-Rivers wanted separate regions.'],
            ['State the recommendation.', 'Instead of creating new regions before independence, Willink recommended entrenching Fundamental Human Rights in the 1960 Constitution and setting up the Niger Delta Development Board.'],
          ],
        },
        yourTurn: {
          q: 'Who moved the historic 1953 motion calling for Nigeria’s self-government in 1956?',
          o: ['Chief Anthony Enahoro', 'Sir Tafawa Balewa', 'Herbert Macaulay', 'Lord Lugard'],
          a: 0,
          h: [
            'He was an Action Group member of the House of Representatives from the Mid-West.',
            'NPC lawmakers proposed replacing “in 1956” with “as soon as practicable”.',
          ],
          e: 'Chief Anthony Enahoro moved the 1953 motion for Nigerian self-government in 1956.',
        },
      },
    ],
    qs: [
      {
        q: 'Which two parties formed Nigeria’s coalition government after the 1959 federal elections?',
        o: ['NPC and NCNC', 'AG and NEPU', 'NNDP and NYM', 'NPC and AG'],
        a: 0,
        e: 'The NPC and NCNC formed the independence coalition government while the Action Group formed the opposition.',
      },
      {
        q: 'The Willink Commission (1957–1958) was set up primarily to investigate:',
        o: ['Fears of ethnic minorities in the regions', 'Railway construction costs', 'Military coups', 'Oil pricing in OPEC'],
        a: 0,
        e: 'The Willink Commission examined minority grievances and recommended entrenched human rights provisions.',
      },
      {
        q: 'Which regions attained internal self-government in 1957?',
        o: ['Eastern and Western Regions', 'Northern Region only', 'Mid-Western Region only', 'Lagos Colony only'],
        a: 0,
        e: 'Eastern and Western Regions achieved internal self-government in 1957, followed by the North in 1959.',
      },
      {
        q: 'Who became Nigeria’s first Prime Minister in 1957 and led the country to independence in 1960?',
        o: ['Sir Abubakar Tafawa Balewa', 'Chief Obafemi Awolowo', 'Dr. Nnamdi Azikiwe', 'Sir Ahmadu Bello'],
        a: 0,
        e: 'Sir Abubakar Tafawa Balewa served as Prime Minister from 1957 until January 1966.',
      },
      {
        q: 'At independence on 1 October 1960, Dr. Nnamdi Azikiwe became Nigeria’s:',
        o: ['First indigenous Governor-General', 'Prime Minister', 'Chief Justice', 'Premier of the North'],
        a: 0,
        e: 'Azikiwe succeeded Sir James Robertson as Nigeria’s first Nigerian Governor-General in November 1960.',
      },
      {
        q: 'The cultural organisation from which the Action Group developed in 1951 was:',
        o: ['Egbe Omo Oduduwa', 'Jamiyyar Mutanen Arewa', 'Ibo State Union', 'WASU'],
        a: 0,
        e: 'Egbe Omo Oduduwa provided the foundation for the Action Group, while Jamiyyar Mutanen Arewa evolved into the NPC.',
      },
    ],
  },
  {
    id: 'govt-constitutional-dev',
    name: 'Constitutional development in Nigeria',
    sec: SEC2,
    goals: [
      'Identify the defining breakthrough of the Clifford (1922), Richards (1946), Macpherson (1951), Lyttleton (1954) and Independence (1960) Constitutions.',
      'Spot the key weakness that caused each colonial constitution to be replaced.',
    ],
    trap: 'Richards (1946) introduced REGIONALISM, while Lyttleton (1954) established TRUE FEDERALISM — do not swap those two!',
    parts: [
      {
        title: 'Clifford (1922) and Richards (1946) Constitutions',
        idea: 'Nigeria’s colonial constitutions evolved step by step from limited Lagos elections in 1922 to regional councils uniting North and South in 1946.',
        terms: [
          ['Clifford Constitution (1922)', 'Introduced the elective principle for the first time in British West Africa (3 seats for Lagos, 1 for Calabar).'],
          ['Richards Constitution (1946)', 'Introduced regionalism (North, West, East) and brought Northern Nigeria into the central Legislative Council for the first time.'],
          ['Unofficial majority', 'Having more non-official (African) members than colonial officials in the legislature, introduced under Richards.'],
        ],
        rules: [
          'Clifford’s flaw: excluded the North from the Legislative Council and imposed an income/male franchise (£100/year).',
          'Richards’ flaw: drafted without consulting Nigerians, prompting the NCNC nationwide protest tour.',
        ],
        table: {
          headers: ['Constitution', 'Major innovation', 'Main criticism'],
          rows: [
            ['Clifford (1922)', 'Elective principle (Lagos 3, Calabar 1); sparked NNDP', 'Isolated the North; narrow income franchise'],
            ['Richards (1946)', 'Regionalism (3 regions); North joined central council', 'Imposed without consulting Nigerians'],
          ],
        },
        example: {
          q: 'Why did the Clifford Constitution spark the birth of Nigeria’s first political parties and newspapers?',
          steps: [
            ['Spot the breakthrough.', 'It introduced 4 elected seats (3 in Lagos, 1 in Calabar).'],
            ['Trace the effect.', 'Politicians needed organised parties (like Macaulay’s NNDP) and newspapers to campaign and win those seats.'],
          ],
        },
        yourTurn: {
          q: 'Which colonial constitution first introduced the elective principle in Nigeria?',
          o: ['Clifford Constitution (1922)', 'Richards Constitution (1946)', 'Macpherson Constitution (1951)', 'Lyttleton Constitution (1954)'],
          a: 0,
          h: [
            'It allowed 3 elected members from Lagos and 1 from Calabar.',
            'It was enacted right before the NNDP was formed in 1923.',
          ],
          e: 'The 1922 Clifford Constitution introduced the elective principle in Lagos and Calabar.',
        },
      },
      {
        title: 'Macpherson (1951), Lyttleton (1954) and Independence (1960)',
        idea: 'Macpherson consulted Nigerians at the 1950 Ibadan Conference; Lyttleton built true federalism with regional Premiers; the 1960 Constitution brought full sovereignty under a parliamentary framework.',
        terms: [
          ['Macpherson Constitution (1951)', 'First constitution drafted with broad Nigerian consultation; created a central House of Representatives and ministerial offices.'],
          ['Lyttleton Constitution (1954)', 'Established true federalism, divided legislative lists, created Premiers for the regions and made Lagos a Federal Territory.'],
          ['Independence Constitution (1960)', 'Granted independence with a parliamentary system, entrenched fundamental rights and judicial appeals still going to the Privy Council in London.'],
        ],
        rules: [
          'Macpherson broke down over the 1953 Eastern Regional Crisis and the Enahoro self-government motion because regional powers were still too tightly tied to the centre.',
          'Lyttleton regionalised the civil service and judiciary — laying the permanent federal structure of Nigeria.',
        ],
        table: {
          headers: ['Constitution', 'Landmark feature', 'Remaining limit'],
          rows: [
            ['Macpherson (1951)', 'Wide Nigerian consultation; regional legislatures & ministers', 'Quasi-federal friction; no office of Prime Minister'],
            ['Lyttleton (1954)', 'True federalism; Exclusive/Concurrent/Residual lists; regional Premiers', 'No Prime Minister yet; Governor-General kept veto'],
            ['Independence (1960)', 'Sovereign parliamentary state + Bill of Rights', 'Queen stayed Head of State; Privy Council final court'],
          ],
        },
        example: {
          q: 'Why is the 1954 Lyttleton Constitution regarded as the true birth of Nigerian federalism?',
          steps: [
            ['Check what makes a federation.', 'Clear constitutional sharing of powers between central and regional governments.'],
            ['Match Lyttleton’s reforms.', 'It created Exclusive, Concurrent and Residual lists, regional Premiers, regional civil services and a federal Supreme Court.'],
          ],
        },
        yourTurn: {
          q: 'Which constitution formally established true federalism in Nigeria with Exclusive, Concurrent and Residual legislative lists?',
          o: ['Lyttleton Constitution (1954)', 'Clifford Constitution (1922)', 'Richards Constitution (1946)', 'Lugard Council (1914)'],
          a: 0,
          h: [
            'Richards introduced regionalism, while a later 1954 constitution made the federation real.',
            'It also made Lagos a Federal Capital Territory and created regional Premiers.',
          ],
          e: 'The 1954 Lyttleton Constitution instituted true federalism with clear legislative lists and autonomous regions.',
        },
      },
    ],
    qs: [
      {
        q: 'Which constitution first brought Northern and Southern Nigerians together into one central Legislative Council?',
        o: ['Richards Constitution (1946)', 'Clifford Constitution (1922)', 'Lugard Council (1914)', '1963 Republican Constitution'],
        a: 0,
        e: 'Richards integrated the North into the central Legislative Council while creating three regional assemblies.',
      },
      {
        q: 'Which constitution was preceded by grassroots consultations culminating in the 1950 Ibadan General Conference?',
        o: ['Macpherson Constitution (1951)', 'Clifford Constitution (1922)', 'Richards Constitution (1946)', '1979 Constitution'],
        a: 0,
        e: 'Sir John Macpherson consulted Nigerians from village to national level before enacting the 1951 Constitution.',
      },
      {
        q: 'Under the 1960 Independence Constitution, Nigeria’s final court of appeal was still the:',
        o: ['Judicial Committee of the Privy Council in London', 'Supreme Court of Nigeria', 'ECOWAS Court', 'House of Chiefs'],
        a: 0,
        e: 'Appeals still went to the British Privy Council until abolished by the 1963 Republican Constitution.',
      },
      {
        q: 'Under the 1954 Lyttleton Constitution, Lagos became:',
        o: ['A Federal Capital Territory separate from the Western Region', 'Part of the Eastern Region', 'A French Commune', 'Part of Northern Nigeria'],
        a: 0,
        e: 'Lyttleton detached Lagos from the Western Region as a separate Federal Territory.',
      },
      {
        q: 'Why did the NCNC tour Nigeria in 1946 to protest the Richards Constitution?',
        o: ['Nigerians had not been consulted before it was imposed', 'It abolished regional assemblies', 'It granted immediate independence', 'It removed the elective principle from Lagos'],
        a: 0,
        e: 'Nationalists resented that Sir Arthur Richards drafted the constitution unilaterally without consulting Nigerians.',
      },
      {
        q: 'Which colonial constitution first created the office of regional Premier?',
        o: ['Lyttleton Constitution (1954)', 'Clifford Constitution (1922)', 'Richards Constitution (1946)', 'Macpherson Constitution (1951)'],
        a: 0,
        e: 'Lyttleton introduced regional Premiers — Ahmadu Bello (North), Obafemi Awolowo (West) and Nnamdi Azikiwe (East).',
      },
    ],
  },
  {
    id: 'govt-republican-constitutions',
    name: 'The 1963, 1979, 1989 and 1999 constitutions',
    sec: SEC2,
    goals: [
      'Compare Nigeria’s post-independence constitutions — especially the shift from parliamentary (1963) to presidential (1979 & 1999).',
      'Highlight the distinctive features of the 1963, 1979, 1989 and 1999 Constitutions.',
    ],
    trap: 'The 1963 Constitution kept the parliamentary system — it was the 1979 Constitution that introduced the American-style executive President!',
    parts: [
      {
        title: '1963 Republican and 1979 Presidential Constitutions',
        idea: 'The 1963 Constitution ended British monarchy ties while keeping the parliamentary system; the 1979 Constitution switched Nigeria permanently to an executive presidential system.',
        terms: [
          ['1963 Republican Constitution', 'Made Nigeria a Republic, replaced the Queen with a ceremonial Nigerian President, and made the Supreme Court the final court of appeal.'],
          ['1979 Constitution', 'Introduced the executive President, strict separation of powers, federal character principle and a bi-cameral National Assembly.'],
          ['Federal Character', 'Constitutional rule requiring federal appointments to reflect Nigeria’s diverse states to foster national unity.'],
        ],
        rules: [
          '1963 ended appeals to the British Privy Council and created the 4th region (Mid-Western Region).',
          '1979 abolished the dual executive (President vs Prime Minister clash of 1964) by merging Head of State and Head of Government into an elected President.',
        ],
        table: {
          headers: ['Feature', '1963 Constitution', '1979 Constitution'],
          rows: [
            ['System', 'Parliamentary (cabinet)', 'Executive presidential'],
            ['Head of State / Govt', 'Split (President + Prime Minister)', 'Merged in Executive President'],
            ['Ministers in legislature?', 'Yes (MPs)', 'No (appointed from outside)'],
            ['Final court', 'Supreme Court of Nigeria', 'Supreme Court of Nigeria'],
          ],
        },
        example: {
          q: 'Why did the drafters of the 1979 Constitution abandon the parliamentary system of 1963?',
          steps: [
            ['Recall the First Republic crisis.', 'Clashes between the ceremonial President and the Prime Minister (1964 election deadlock) and regionalised coalitions paralysed government.'],
            ['State the 1979 solution.', 'An executive President elected nationwide with a geographic spread rule created a single unifying national symbol.'],
          ],
        },
        yourTurn: {
          q: 'Which Nigerian constitution ended appeals to the British Privy Council and made the Supreme Court of Nigeria the highest court?',
          o: ['1963 Republican Constitution', '1960 Independence Constitution', '1954 Lyttleton Constitution', '1989 Constitution'],
          a: 0,
          h: [
            'It took effect on 1 October 1963 when Nigeria became a Republic.',
            'It also replaced Queen Elizabeth II with a Nigerian ceremonial President.',
          ],
          e: 'The 1963 Republican Constitution severed judicial ties with the Privy Council and elevated the Supreme Court.',
        },
      },
      {
        title: '1989 and 1999 Constitutions',
        idea: 'The 1989 Constitution (Third Republic) tried a two-party presidential model that was aborted in 1993; the 1999 Constitution restored multi-party presidential democracy and remains Nigeria’s supreme law today.',
        terms: [
          ['1989 Constitution', 'Drafted under General Babangida; introduced a two-party system (SDP and NRC), part-time legislators and recall, but never took full national effect after the 1993 annulment.'],
          ['1999 Constitution', 'Promulgated by General Abdulsalami Abubakar; retains the 1979 presidential framework, multi-party democracy, 36 states + FCT and 774 LGAs.'],
          ['Dual citizenship', 'Permitted for Nigerians by birth under the 1999 Constitution.'],
        ],
        rules: [
          'Key traits of 1999: written, rigid, federal, presidential, bicameral National Assembly (109 Senators, 360 Reps), independent judiciary and multi-party system.',
          'Critics note that the 1999 Constitution was promulgated by military decree and concentrates too many items (68) on the Exclusive List.',
        ],
        table: {
          headers: ['Feature', '1989 Constitution', '1999 Constitution'],
          rows: [
            ['Party system', 'Strict two-party (SDP & NRC)', 'Multi-party system'],
            ['Republic', 'Aborted Third Republic', 'Fourth Republic (1999–present)'],
            ['Local governments', 'Directly elected, autonomy emphasized', '774 constitutionally listed LGAs'],
          ],
        },
        example: {
          q: 'What unique party rule distinguished the 1989 Constitution from both the 1979 and 1999 Constitutions?',
          steps: [
            ['Compare party provisions.', 'Both 1979 and 1999 allowed multi-party competition.'],
            ['Highlight 1989.', 'The 1989 Constitution mandated a strict two-party system (leading to the government-created SDP and NRC).'],
          ],
        },
        yourTurn: {
          q: 'Which constitution was unique in mandating a strict two-party system in Nigeria?',
          o: ['1989 Constitution', '1963 Constitution', '1979 Constitution', '1999 Constitution'],
          a: 0,
          h: [
            'It belonged to the aborted Third Republic under General Ibrahim Babangida.',
            'SDP and NRC competed under this constitutional framework.',
          ],
          e: 'The 1989 Constitution stipulated a two-party system to curb ethnic party fragmentation.',
        },
      },
    ],
    qs: [
      {
        q: 'Under the 1963 Republican Constitution, the Nigerian President was:',
        o: ['Ceremonial Head of State elected by Parliament', 'Directly elected Executive President', 'Commander of the British Privy Council', 'Appointed by the United Nations'],
        a: 0,
        e: 'In 1963 Nigeria remained parliamentary: Dr. Azikiwe was ceremonial President while Balewa was Prime Minister.',
      },
      {
        q: 'Which constitution first introduced the executive presidential system in Nigeria?',
        o: ['1979 Constitution', '1963 Constitution', '1954 Constitution', '1960 Constitution'],
        a: 0,
        e: 'The 1979 Second Republic Constitution introduced the executive presidency.',
      },
      {
        q: 'How many members sit in Nigeria’s Senate and House of Representatives under the 1999 Constitution?',
        o: ['109 Senators and 360 Representatives', '36 Senators and 100 Representatives', '72 Senators and 250 Representatives', '150 Senators and 500 Representatives'],
        a: 0,
        e: 'Each of the 36 states has 3 senators plus 1 for the FCT (109 total), and the House has 360 members.',
      },
      {
        q: 'The Federal Character principle was first enshrined in the:',
        o: ['1979 Constitution', '1922 Clifford Constitution', '1946 Richards Constitution', '1960 Independence Constitution'],
        a: 0,
        e: 'The 1979 Constitution introduced Federal Character to guarantee inclusive representation across states.',
      },
      {
        q: 'A major criticism of the 1999 Constitution is that:',
        o: ['It over-concentrates legislative powers in the federal Exclusive List', 'It has no fundamental human rights chapter', 'It abolishes state governors', 'It allows only one political party'],
        a: 0,
        e: 'With 68 items on the Exclusive List, many scholars argue it makes Nigerian federalism overly centralised.',
      },
      {
        q: 'Which constitution was promulgated by military Decree No. 24 to usher in the Fourth Republic?',
        o: ['1999 Constitution', '1963 Constitution', '1951 Macpherson Constitution', '1960 Constitution'],
        a: 0,
        e: 'General Abdulsalami Abubakar promulgated the 1999 Constitution via Decree No. 24 of 1999.',
      },
    ],
  },
  {
    id: 'govt-ng-organs-today',
    name: 'The executive, legislature and courts in Nigeria today',
    sec: SEC2,
    goals: [
      'Describe the structure, tenure and powers of the Nigerian executive and National Assembly under the 1999 Constitution.',
      'Trace the hierarchy of Nigerian courts from Magistrate/Customary Courts up to the Supreme Court.',
    ],
    trap: 'The Supreme Court has ORIGINAL jurisdiction in disputes between the Federation and a State (or between two States) — those cases do not start at the High Court.',
    parts: [
      {
        title: 'The Executive and National Assembly in Nigeria',
        idea: 'Executive power sits with the President (federal) and Governors (states) for a maximum of two 4-year terms; federal legislative power sits with the bicameral National Assembly.',
        terms: [
          ['Federal Executive Council (FEC)', 'The President, Vice President and Ministers who coordinate federal policy.'],
          ['National Assembly', 'Nigeria’s bicameral federal parliament: Senate (109) and House of Representatives (360).'],
          ['Impeachment', 'Constitutional removal of a President or Governor for gross misconduct, requiring 2/3 votes and an investigation panel.'],
        ],
        rules: [
          'The President must appoint at least one Minister from each of the 36 states, confirmed by the Senate.',
          'The Senate alone confirms federal ministers, ambassadors, judges and service chiefs.',
        ],
        table: {
          headers: ['Tier', 'Executive head', 'Legislature'],
          rows: [
            ['Federal', 'President (max two 4-year terms)', 'National Assembly (Senate + House of Reps)'],
            ['State', 'Governor (max two 4-year terms)', 'State House of Assembly (unicameral)'],
            ['Local Govt', 'Council Chairman', 'Local Government Legislative Council'],
          ],
        },
        example: {
          q: 'Which chamber of the National Assembly screens and confirms ministerial and Supreme Court nominees?',
          steps: [
            ['Recall exclusive Senate powers.', 'While both chambers pass bills and budgets, confirmation of presidential appointments belongs to the upper house.'],
            ['Name the chamber.', 'The Senate.'],
          ],
        },
        yourTurn: {
          q: 'What is the maximum number of four-year terms a Nigerian President or State Governor may constitutionally serve?',
          o: ['Two terms (8 years)', 'One term (4 years)', 'Three terms (12 years)', 'Unlimited terms'],
          a: 0,
          h: [
            'Count the first election plus re-election allowed by the 1999 Constitution.',
            'No president or governor may be elected to that office more than twice.',
          ],
          e: 'The 1999 Constitution limits both the President and Governors to a maximum of two four-year terms.',
        },
      },
      {
        title: 'Hierarchy of courts in Nigeria',
        idea: 'Nigeria’s judiciary is arranged in a clear hierarchy so litigants can appeal decisions from lower courts up to the Supreme Court, whose decision is final.',
        terms: [
          ['Supreme Court', 'Highest court in Nigeria, headed by the Chief Justice of Nigeria (CJN); final appellate court and original court for federal-state disputes.'],
          ['Court of Appeal', 'Hears appeals from Federal/State High Courts, National Industrial Court, Sharia and Customary Courts of Appeal; also hears presidential election petitions first.'],
          ['National Judicial Council (NJC)', 'Constitutional body that recommends appointment and discipline of superior court judges.'],
        ],
        rules: [
          'Superior Courts of Record: Supreme Court → Court of Appeal → Federal High Court / State High Courts / FCT High Court / National Industrial Court / Sharia Court of Appeal / Customary Court of Appeal.',
          'Inferior courts (established by state laws): Magistrate Courts, Area Courts and Customary Courts.',
        ],
        table: {
          headers: ['Court', 'Key jurisdiction'],
          rows: [
            ['Supreme Court', 'Final appeals; original jurisdiction in Federation vs State disputes'],
            ['Court of Appeal', 'Appeals from High Courts; first instance for Presidential election petitions'],
            ['Federal High Court', 'Federal revenue, aviation, admiralty, banking & federal agency matters'],
            ['State High Court', 'Unlimited general civil and criminal jurisdiction within the state'],
          ],
        },
        example: {
          q: 'Lagos State and the Federal Government disagree over VAT collection authority. Which court has original jurisdiction to hear this dispute directly?',
          steps: [
            ['Identify the parties.', 'A State government versus the Federation.'],
            ['Apply Section 232 of the 1999 Constitution.', 'The Supreme Court of Nigeria exercises exclusive original jurisdiction in Federation-vs-State disputes.'],
          ],
        },
        yourTurn: {
          q: 'Which court sits as the court of first instance (Presidential Election Petition Tribunal) for disputes over Nigeria’s presidential election?',
          o: ['Court of Appeal', 'Magistrate Court', 'Federal High Court', 'Customary Court of Appeal'],
          a: 0,
          h: [
            'Appeals from its decision go straight to the Supreme Court.',
            'It is the second-highest court in Nigeria.',
          ],
          e: 'Section 239 of the 1999 Constitution grants the Court of Appeal original jurisdiction over presidential election petitions.',
        },
      },
    ],
    qs: [
      {
        q: 'Who heads Nigeria’s judiciary and presides over the Supreme Court?',
        o: ['Chief Justice of Nigeria (CJN)', 'Attorney-General of the Federation', 'President of the Senate', 'Inspector-General of Police'],
        a: 0,
        e: 'The Chief Justice of Nigeria (CJN) is the head of the judiciary and chair of the NJC.',
      },
      {
        q: 'Which constitutional body recommends the appointment and discipline of superior court judges in Nigeria?',
        o: ['National Judicial Council (NJC)', 'Federal Executive Council', 'INEC', 'Code of Conduct Tribunal'],
        a: 0,
        e: 'The NJC shields judicial appointments and discipline from raw partisan politics.',
      },
      {
        q: 'Under the 1999 Constitution, the President must appoint at least how many ministers from each state?',
        o: ['One', 'Two', 'Three', 'None required'],
        a: 0,
        e: 'Section 147(3) mandates at least one minister who is an indigene of each of the 36 states.',
      },
      {
        q: 'Labour, trade union and workplace disputes fall under the specialised jurisdiction of the:',
        o: ['National Industrial Court', 'Sharia Court of Appeal', 'Customary Court', 'Election Tribunal'],
        a: 0,
        e: 'The National Industrial Court of Nigeria handles employment, labour and industrial relations matters.',
      },
      {
        q: 'In the National Assembly, the presiding officer of the Senate is the Senate President, while the House of Representatives is presided over by the:',
        o: ['Speaker', 'Prime Minister', 'Chief Whip', 'Clerk'],
        a: 0,
        e: 'The Speaker presides over sittings of the House of Representatives.',
      },
      {
        q: 'A dispute between two Nigerian states (e.g. over boundary revenue) is filed directly at the:',
        o: ['Supreme Court', 'Magistrate Court', 'Area Court', 'National Industrial Court'],
        a: 0,
        e: 'The Supreme Court holds original jurisdiction in disputes between States or between a State and the Federation.',
      },
    ],
  },
  {
    id: 'govt-public-commissions',
    name: 'Public commissions',
    sec: SEC2,
    goals: [
      'Identify the functions of major Nigerian federal executive bodies (INEC, FCC, CCB, RMAFC, NPC, FCSC, EFCC, ICPC).',
      'Distinguish constitutional bodies under Section 153 from statutory anti-corruption agencies.',
    ],
    trap: 'Do not mix up ICPC (public-sector corruption) and EFCC (economic & financial crimes including advance-fee fraud and money laundering).',
    parts: [
      {
        title: 'Constitutional commissions (Section 153)',
        idea: 'The 1999 Constitution creates independent commissions to protect fairness in elections, revenue sharing, civil service recruitment, census and national representation.',
        terms: [
          ['INEC', 'Independent National Electoral Commission — registers parties, maintains voter roll and conducts federal/state elections.'],
          ['FCC', 'Federal Character Commission — enforces equitable distribution of federal offices and socio-economic amenities across states.'],
          ['RMAFC', 'Revenue Mobilisation Allocation and Fiscal Commission — monitors Federation Account accruals and proposes revenue-sharing formulas and public-officer pay.'],
        ],
        rules: [
          'The National Population Commission (NPC) conducts periodic population censuses and vital statistics.',
          'The Federal Civil Service Commission (FCSC) handles recruitment, promotion and discipline of federal civil servants.',
        ],
        table: {
          headers: ['Commission', 'Core mandate'],
          rows: [
            ['INEC', 'Conducts federal/state elections & registers political parties'],
            ['FCC', 'Ensures fair representation of all states in federal appointments'],
            ['RMAFC', 'Designs revenue allocation formula & fixes political office pay'],
            ['NPC', 'Conducts national census & population data'],
            ['FCSC', 'Appoints, promotes and disciplines federal civil servants'],
          ],
        },
        example: {
          q: 'Which constitutional body recommends the formula for sharing Federation Account revenue among Federal, State and Local governments?',
          steps: [
            ['Match the revenue mandate.', 'Allocation of public revenue is a fiscal duty.'],
            ['Name the commission.', 'Revenue Mobilisation Allocation and Fiscal Commission (RMAFC).'],
          ],
        },
        yourTurn: {
          q: 'Which constitutional commission is charged with ensuring fair representation of Nigeria’s diverse states in federal appointments?',
          o: ['Federal Character Commission (FCC)', 'National Population Commission (NPC)', 'Police Service Commission', 'INEC'],
          a: 0,
          h: [
            'Its name matches the constitutional principle introduced in 1979.',
            'It prevents domination of federal offices by any one state or ethnic group.',
          ],
          e: 'The Federal Character Commission monitors and enforces equitable representation across Nigeria’s states.',
        },
      },
      {
        title: 'Ethics, anti-corruption and oversight bodies',
        idea: 'Accountability commissions investigate bribery, asset fraud, human rights abuses and administrative unfairness so public power is not abused.',
        terms: [
          ['Code of Conduct Bureau (CCB)', 'Receives and verifies asset declarations of public officers; breaches go to the Code of Conduct Tribunal (CCT).'],
          ['ICPC', 'Independent Corrupt Practices and Other Related Offences Commission (2000) — targets bribery and corruption in public bodies.'],
          ['EFCC', 'Economic and Financial Crimes Commission (2003) — investigates money laundering, cyber-fraud, embezzlement and financial crimes.'],
        ],
        rules: [
          'The National Human Rights Commission (NHRC) promotes and monitors human rights compliance in Nigeria.',
          'The Public Complaints Commission (PCC) acts as Nigeria’s Ombudsman against administrative unfairness.',
        ],
        table: {
          headers: ['Agency', 'Primary focus'],
          rows: [
            ['CCB / CCT', 'Public officers’ asset declarations and conflict-of-interest trials'],
            ['ICPC', 'Public-sector bribery, gratification and system-study prevention'],
            ['EFCC', 'Financial crimes, money laundering, bank/cyber fraud and looted funds'],
            ['NHRC', 'Promotion and protection of human rights'],
          ],
        },
        example: {
          q: 'A public officer fails to declare properties before taking office. Which pair of bodies handles verification and trial?',
          steps: [
            ['Identify the asset-declaration custodian.', 'Code of Conduct Bureau (CCB).'],
            ['Identify its adjudicating tribunal.', 'Code of Conduct Tribunal (CCT).'],
          ],
        },
        yourTurn: {
          q: 'Which statutory agency established in 2003 investigates money laundering, advance-fee fraud and financial crimes across both public and private sectors?',
          o: ['EFCC', 'NPC', 'RMAFC', 'FCSC'],
          a: 0,
          h: [
            'Its acronym begins with “Economic and Financial Crimes”.',
            'NPC runs censuses and RMAFC handles revenue sharing.',
          ],
          e: 'The Economic and Financial Crimes Commission (EFCC) investigates and prosecutes economic and financial crimes.',
        },
      },
    ],
    qs: [
      {
        q: 'Conducting periodic population censuses in Nigeria is the constitutional duty of the:',
        o: ['National Population Commission (NPC)', 'INEC', 'RMAFC', 'Federal Character Commission'],
        a: 0,
        e: 'The National Population Commission conducts censuses and publishes demographic data.',
      },
      {
        q: 'Which body fixes the remuneration (salaries and allowances) of political office-holders in Nigeria?',
        o: ['RMAFC', 'FCSC', 'EFCC', 'NJC'],
        a: 0,
        e: 'The Revenue Mobilisation Allocation and Fiscal Commission determines appropriate remuneration for political office-holders.',
      },
      {
        q: 'Recruitment, promotion and discipline of career federal civil servants is managed by the:',
        o: ['Federal Civil Service Commission (FCSC)', 'Code of Conduct Tribunal', 'National Assembly', 'National Population Commission'],
        a: 0,
        e: 'The FCSC ensures merit-based staffing and discipline across federal ministries.',
      },
      {
        q: 'Violations of the public officers’ code of conduct are tried before the:',
        o: ['Code of Conduct Tribunal (CCT)', 'Election Petition Tribunal', 'Customary Court', 'RMAFC'],
        a: 0,
        e: 'The Code of Conduct Tribunal adjudicates asset-declaration and conflict-of-interest charges filed by the CCB.',
      },
      {
        q: 'Both ICPC and EFCC were established during which Nigerian Republic?',
        o: ['Fourth Republic', 'First Republic', 'Second Republic', 'Colonial era'],
        a: 0,
        e: 'ICPC (2000) and EFCC (2003) were created during President Obasanjo’s Fourth Republic administration.',
      },
      {
        q: 'Which constitutional body advises the President on matters of national honour, prerogative of mercy and census approval?',
        o: ['Council of State', 'INEC', 'EFCC', 'Police Service Commission'],
        a: 0,
        e: 'The Council of State (including past Presidents, Chief Justices and serving Governors) advises the President on key national issues.',
      },
    ],
  },
  {
    id: 'govt-four-republics',
    name: "Party politics in Nigeria's four republics",
    sec: SEC2,
    goals: [
      'Track the major political parties and crises across Nigeria’s First, Second, Third and Fourth Republics.',
      'Explain how party registration rules evolved to promote national spread over ethnic enclaves.',
    ],
    trap: 'The Third Republic (1992–1993) was aborted — only two government-created parties (SDP and NRC) existed, and the June 12, 1993 presidential election was annulled.',
    parts: [
      {
        title: 'First Republic (1963–1966) and Second Republic (1979–1983)',
        idea: 'First Republic parties were strongly regional (NPC, NCNC, AG), leading to alliances (NNA vs UPGA) and severe electoral crises. Second Republic rules forced parties (NPN, UPN, NPP, PRP, GNPP, NAP) to prove national spread.',
        terms: [
          ['NNA vs UPGA (1964)', 'First Republic mega-alliances: Nigerian National Alliance (NPC + NNDP) vs United Progressive Grand Alliance (NCNC + AG + NEPU).'],
          ['Second Republic parties', 'NPN (Shehu Shagari), UPN (Obafemi Awolowo), NPP (Nnamdi Azikiwe), PRP (Aminu Kano), GNPP (Waziri Ibrahim) and NAP (Tunji Braithwaite).'],
          ['1962 Action Group Crisis', 'Rift between Chief Awolowo and Premier S. L. Akintola that triggered emergency rule in the Western Region.'],
        ],
        rules: [
          'First Republic collapse causes: 1962 AG crisis, 1962/63 census controversy, 1964 federal election boycott and 1965 Western Region election crisis (“Operation Wetie”).',
          'Second Republic required parties to maintain offices in at least two-thirds of the 19 states, yet old regional loyalties still resurfaced before the December 1983 coup.',
        ],
        table: {
          headers: ['Republic', 'Major parties', 'Key crisis / milestone'],
          rows: [
            ['First (1963–66)', 'NPC, NCNC, AG, NEPU, NNDP', '1962 AG split, 1964/65 election crises → Jan 1966 coup'],
            ['Second (1979–83)', 'NPN, UPN, NPP, PRP, GNPP, NAP', '12⅔ states legal dispute; 1983 landslide dispute → Dec 1983 coup'],
          ],
        },
        example: {
          q: 'What was the famous “two-thirds of 19 states” dispute in Nigeria’s 1979 presidential election?',
          steps: [
            ['State the constitutional rule.', 'Winner needed 25% of votes in two-thirds of 19 states.'],
            ['Explain the legal ruling.', 'Shagari (NPN) won 25% in 12 states and 19.9% in Kano; the Supreme Court upheld FEDECO’s interpretation of 12⅔ states (25% of two-thirds of Kano’s votes).'],
          ],
        },
        yourTurn: {
          q: 'Which Second Republic party led by Chief Obafemi Awolowo campaigned on free education, free healthcare, rural development and full employment?',
          o: ['Unity Party of Nigeria (UPN)', 'National Party of Nigeria (NPN)', 'Nigerian People’s Party (NPP)', 'People’s Redemption Party (PRP)'],
          a: 0,
          h: [
            'It was famous for its “four cardinal programmes”.',
            'NPN was led by Shehu Shagari, and NPP by Nnamdi Azikiwe.',
          ],
          e: 'The Unity Party of Nigeria (UPN) led by Chief Obafemi Awolowo championed the four cardinal programmes.',
        },
      },
      {
        title: 'Third Republic (aborted) and Fourth Republic (1999–present)',
        idea: 'In the aborted Third Republic, the military decreed two parties — SDP and NRC — leading to the annulled June 12, 1993 election won by M. K. O. Abiola. Since 1999, Nigeria has maintained unbroken multi-party democracy.',
        terms: [
          ['SDP & NRC', 'Social Democratic Party (“a little to the left”) and National Republican Convention (“a little to the right”).'],
          ['June 12, 1993', 'Historic presidential election widely judged Nigeria’s freest, won by Chief M. K. O. Abiola (SDP) before being annulled by General Babangida.'],
          ['2015 Democratic Alternation', 'First time an opposition party (APC, led by Muhammadu Buhari) defeated a sitting Nigerian president (Goodluck Jonathan, PDP) at the polls.'],
        ],
        rules: [
          'Fourth Republic started in 1999 with three parties (PDP, APP/ANPP, AD) and later expanded after a 2002 Supreme Court ruling liberalised party registration.',
          'Nigeria’s Fourth Republic is the longest stretch of civilian democratic rule in the country’s history.',
        ],
        table: {
          headers: ['Republic', 'Major parties', 'Landmark event'],
          rows: [
            ['Third (1992–93)', 'SDP, NRC', 'June 12, 1993 election annulment & Interim National Government'],
            ['Fourth (1999–date)', 'PDP, APC, LP, NNPP, APGA, etc.', 'Peaceful power handover from PDP to APC in 2015'],
          ],
        },
        example: {
          q: 'Why is the 2015 Nigerian general election considered a major milestone in African democracy?',
          steps: [
            ['Recall prior Nigerian transitions.', 'Earlier civilian governments had either ended in military coups or retained the incumbent party.'],
            ['Highlight 2015.', 'An opposition coalition (APC) defeated an incumbent president (PDP), who conceded peacefully.'],
          ],
        },
        yourTurn: {
          q: 'Which two political parties competed in the June 12, 1993 presidential election?',
          o: ['SDP and NRC', 'NPN and UPN', 'PDP and APC', 'NPC and NCNC'],
          a: 0,
          h: [
            'They were the only two parties permitted under the 1989 transition programme.',
            'Chief M. K. O. Abiola ran on the SDP ticket against Bashir Tofa of the NRC.',
          ],
          e: 'The Social Democratic Party (SDP) and National Republican Convention (NRC) contested the 1993 election.',
        },
      },
    ],
    qs: [
      {
        q: 'Which First Republic alliance united the NPC and Chief Akintola’s NNDP for the 1964 federal elections?',
        o: ['NNA (Nigerian National Alliance)', 'UPGA', 'SDP', 'APC'],
        a: 0,
        e: 'The Nigerian National Alliance (NNA) opposed the United Progressive Grand Alliance (UPGA) in 1964.',
      },
      {
        q: 'Who was the presidential flagbearer of the NPN and Nigeria’s first Executive President (1979–1983)?',
        o: ['Alhaji Shehu Shagari', 'Dr. Nnamdi Azikiwe', 'Chief Obafemi Awolowo', 'Chief M. K. O. Abiola'],
        a: 0,
        e: 'Alhaji Shehu Shagari won the 1979 and 1983 elections under the National Party of Nigeria (NPN).',
      },
      {
        q: 'Which three parties initially contested the 1999 elections that launched the Fourth Republic?',
        o: ['PDP, APP and AD', 'SDP, NRC and PRP', 'NPC, NCNC and AG', 'NPN, UPN and NPP'],
        a: 0,
        e: 'The People’s Democratic Party (PDP), All People’s Party (APP) and Alliance for Democracy (AD) contested in 1999.',
      },
      {
        q: 'Nigeria’s official Democracy Day was moved from May 29 to June 12 to honour:',
        o: ['The annulled June 12, 1993 presidential election won by Chief M. K. O. Abiola', 'The 1914 amalgamation', 'The 1960 independence parade', 'The 1979 inauguration'],
        a: 0,
        e: 'June 12 honours the watershed 1993 election and the struggle for democratic rule.',
      },
      {
        q: 'Which Second Republic party did Alhaji Waziri Ibrahim found after breaking away from the NPP?',
        o: ['GNPP (Great Nigeria People’s Party)', 'UPN', 'PRP', 'NAP'],
        a: 0,
        e: 'Waziri Ibrahim led the GNPP, famous for its slogan “politics without bitterness”.',
      },
      {
        q: 'What recurring weakness plagued political parties in Nigeria’s First and Second Republics?',
        o: ['Strong ethnic and regional loyalties overshadowing ideology', 'Total absence of manifestos', 'Lack of any voters', 'Foreign monarchs choosing candidates'],
        a: 0,
        e: 'Ethnic and regional polarisation repeatedly turned elections into bitter zero-sum contests.',
      },
    ],
  },
  {
    id: 'govt-ng-federalism',
    name: 'Nigerian federalism: structure and problems',
    sec: SEC2,
    goals: [
      'Explain why Nigeria adopted federalism and trace the creation of states from 3 regions to 36 states.',
      'Analyse core challenges of Nigerian federalism: revenue allocation, minority fears, census disputes and resource control.',
    ],
    trap: 'The 1967 creation of 12 states by General Yakubu Gowon broke up the giant regions so no single region could dominate the entire federation.',
    parts: [
      {
        title: 'Origins and evolution of states in Nigeria',
        idea: 'Nigeria adopted federalism in 1954 because of its huge size and cultural diversity. Over time, the original 3 regions were split into 36 states to ease minority fears and bring development closer to people.',
        terms: [
          ['Reasons for Nigerian federalism', 'Ethnic/cultural diversity, large geographical size, fear of minority domination and economic complementarity.'],
          ['State creation milestones', '3 regions (1954) → 4 regions (Mid-West, 1963) → 12 states (Gowon, 1967) → 19 states (Murtala, 1976) → 21 (Babangida, 1987) → 30 (Babangida, 1991) → 36 states (Abacha, 1996).'],
        ],
        rules: [
          'Only one region/state — Mid-Western Region in 1963 — was ever created under civilian rule; all later state creations were done by military decrees.',
          'Nigeria currently has 1 Federal Government, 36 States, 1 Federal Capital Territory (Abuja) and 774 Local Government Areas.',
        ],
        table: {
          headers: ['Year & Leader', 'Structure created'],
          rows: [
            ['1963 (Balewa)', '4 Regions (added Mid-West)'],
            ['1967 (Gowon)', '12 States (ended 4-region dominance)'],
            ['1976 (Murtala Mohammed)', '19 States + Abuja designated FCT'],
            ['1987 & 1991 (Babangida)', '21 States → 30 States'],
            ['1996 (Sani Abacha)', '36 States'],
          ],
        },
        example: {
          q: 'Why was Mid-Western Region (1963) unique among all territorial creations in Nigeria’s history?',
          steps: [
            ['Review how states were created.', '12, 19, 21, 30 and 36 states were all enacted by military decrees.'],
            ['Spot the exception.', 'Mid-Western Region was created democratically via parliamentary resolutions and a 1963 referendum.'],
          ],
        },
        yourTurn: {
          q: 'Which Nigerian head of state split the four regions into 12 states on the eve of the Civil War in 1967?',
          o: ['General Yakubu Gowon', 'General Murtala Mohammed', 'General Sani Abacha', 'Sir Tafawa Balewa'],
          a: 0,
          h: [
            'He created 12 states on 27 May 1967 to protect minorities and preserve national unity.',
            'Murtala later expanded 12 to 19 states in 1976.',
          ],
          e: 'General Yakubu Gowon created Nigeria’s first 12 states in May 1967.',
        },
      },
      {
        title: 'Revenue allocation and challenges of Nigerian federalism',
        idea: 'Sharing oil revenue fairly, resolving minority/resource-control demands, conducting trusted censuses and balancing federal supremacy with state autonomy remain the biggest tests of Nigerian federalism.',
        terms: [
          ['Derivation principle', 'Returning a set percentage (currently at least 13% under the 1999 Constitution) of natural-resource revenue to the producing states.'],
          ['Revenue allocation commissions', 'Phillipson (1946), Hicks-Phillipson (1951), Chick (1953), Raisman (1958), Binns (1964), Dina (1968), Aboyade (1977) and Okigbo (1980).'],
          ['Resource control', 'Demand especially by oil-producing states for greater ownership and fiscal benefit from natural resources in their territory.'],
        ],
        rules: [
          'Core challenges: over-dependence of states on federal oil allocations, census politicisation (tied to seats and revenue), ethno-religious friction and fiscal centralisation.',
          'Solutions include strengthening internally generated revenue (IGR), upholding Federal Character fairly and devolving more concurrent powers to states.',
        ],
        table: {
          headers: ['Revenue criterion', 'What it rewards'],
          rows: [
            ['Derivation (13% min.)', 'States that produce the natural resource'],
            ['Equality of states', 'Every state receives an equal base share'],
            ['Population', 'States with larger populations'],
            ['Landmass / terrain & IGR effort', 'Geographic size and local tax collection effort'],
          ],
        },
        example: {
          q: 'Why have Nigerian population censuses often been politically controversial?',
          steps: [
            ['Connect numbers to political rewards.', 'Both parliamentary seats (House of Reps) and a large slice of federal revenue allocation depend on population figures.'],
            ['State the effect.', 'Regions and states face strong temptation to inflate counts, sparking disputes.'],
          ],
        },
        yourTurn: {
          q: 'Under Nigeria’s 1999 Constitution, oil- and mineral-producing states receive a minimum derivation share of:',
          o: ['13%', '5%', '50%', '1%'],
          a: 0,
          h: [
            'Check Section 162(2) of the 1999 Constitution.',
            'It is higher than 5% and lower than the First Republic’s 50%.',
          ],
          e: 'Section 162(2) guarantees a minimum of 13% derivation to natural-resource-producing states.',
        },
      },
    ],
    qs: [
      {
        q: 'Which head of state created the 19-state structure and initiated the move of the federal capital to Abuja in 1976?',
        o: ['General Murtala Mohammed', 'General Yakubu Gowon', 'General Sani Abacha', 'President Shehu Shagari'],
        a: 0,
        e: 'General Murtala Mohammed created 7 new states (total 19) and set up the Aguda Panel that chose Abuja.',
      },
      {
        q: 'The principle that returns a percentage of resource revenue directly to the state where the resource is extracted is:',
        o: ['Derivation', 'Need', 'Landmass', 'Equality of states'],
        a: 0,
        e: 'Derivation allocates revenue back to the originating state.',
      },
      {
        q: 'Which of the following was the ONLY new territorial unit created in Nigeria under a civilian democratic government?',
        o: ['Mid-Western Region (1963)', 'Lagos State (1967)', 'Bayelsa State (1996)', 'Katsina State (1987)'],
        a: 0,
        e: 'The Mid-Western Region was created democratically in 1963; all later states came by military decree.',
      },
      {
        q: 'The first revenue allocation commission in colonial Nigeria (1946) was the:',
        o: ['Phillipson Commission', 'Okigbo Commission', 'Aboyade Commission', 'Willink Commission'],
        a: 0,
        e: 'Sir Sydney Phillipson chaired Nigeria’s first revenue commission in 1946.',
      },
      {
        q: 'A major factor that forced Nigeria to adopt federalism in 1954 was:',
        o: ['Ethnic and cultural diversity across a vast territory', 'Speaking only one language nationwide', 'Tiny population size', 'Absence of natural resources'],
        a: 0,
        e: 'Federalism allowed Nigeria’s diverse peoples unity at the centre with autonomy over local affairs.',
      },
      {
        q: 'Who created the last six states in 1996 to bring Nigeria to its current 36-state structure?',
        o: ['General Sani Abacha', 'General Ibrahim Babangida', 'General Yakubu Gowon', 'President Olusegun Obasanjo'],
        a: 0,
        e: 'General Sani Abacha added Bayelsa, Ebonyi, Ekiti, Gombe, Nasarawa and Zamfara in October 1996.',
      },
    ],
  },
  {
    id: 'govt-privatisation',
    name: 'Public corporations, privatisation and commercialisation',
    sec: SEC2,
    goals: [
      'Explain why Nigeria set up public corporations and why many underperformed.',
      'Distinguish privatisation, commercialisation and deregulation clearly.',
    ],
    trap: 'In commercialisation, the government STILL OWNS the enterprise — it merely stops subsidies and tells it to run profitably. In privatisation, ownership transfers to private investors.',
    parts: [
      {
        title: 'Public corporations in Nigeria: roles and problems',
        idea: 'Nigeria established public corporations (such as NPA, FAAN, NTA, NRC and formerly NEPA/NITEL) to provide vital utilities that needed huge capital and served national security.',
        terms: [
          ['Public corporation', 'A statutory state-owned body established by an Act to deliver essential services or strategic goods.'],
          ['Board of Directors', 'Policy-making body appointed by government to supervise a public corporation.'],
          ['Bureaucratic red tape', 'Slow political approvals and rigid routines that hamper business speed.'],
        ],
        rules: [
          'Why set them up: huge capital needed, preventing private monopolies in essential utilities, strategic security and affordable social access.',
          'Common problems in Nigeria: political interference in staffing, corruption, poor maintenance, over-staffing and heavy drain on the national budget.',
        ],
        table: {
          headers: ['Control over public corporations', 'Who exercises it'],
          rows: [
            ['Ministerial control', 'Supervising Minister (general policy directives)'],
            ['Parliamentary control', 'National Assembly (budgets, committee probes)'],
            ['Judicial control', 'Courts (contracts, torts and ultra vires review)'],
            ['Public control', 'Media, consumers and Ombudsman'],
          ],
        },
        example: {
          q: 'Why did government-run NITEL struggle while private GSM operators rapidly expanded phone access across Nigeria after 2001?',
          steps: [
            ['Diagnose the public monopoly problem.', 'NITEL suffered from under-investment, political interference and lack of competition.'],
            ['Explain the turnaround.', 'Licensing competing private telecom firms brought private capital, innovation and customer focus.'],
          ],
        },
        yourTurn: {
          q: 'Which problem most commonly undermined the profitability of Nigerian public corporations?',
          o: ['Political interference, corruption and poor management', 'Too much competition from private rivals', 'Lack of legal personality', 'Complete absence of customers'],
          a: 0,
          h: [
            'Think about patronage appointments and weak accountability in state monopolies.',
            'Public corporations DO have legal personality under their enabling Acts.',
          ],
          e: 'Political interference, mismanagement and corruption drained many public corporations.',
        },
      },
      {
        title: 'Privatisation, commercialisation and deregulation',
        idea: 'To cut fiscal losses and boost efficiency, Nigeria reformed public enterprises through privatisation (selling ownership), commercialisation (running state firms for profit) and deregulation (opening markets to competition).',
        terms: [
          ['Privatisation', 'Transfer of ownership and control of a state enterprise (fully or partly) to private investors (managed by the BPE).'],
          ['Commercialisation', 'Reorganising a state-owned enterprise to operate profitably without government subventions while government keeps ownership.'],
          ['Deregulation', 'Removing state monopoly laws and price controls so private competitors can enter an industry (e.g. telecoms, downstream fuel).'],
        ],
        rules: [
          'The Bureau of Public Enterprises (BPE) and National Council on Privatisation (NCP) supervise Nigeria’s privatisation programme.',
          'Benefits: cuts budget deficits, raises efficiency and attracts investment. Risks: higher tariffs for the poor, job cuts and private monopolies if poorly regulated.',
        ],
        table: {
          headers: ['Reform', 'Who owns the firm afterwards?', 'Nigerian example'],
          rows: [
            ['Privatisation', 'Private investors (full or majority)', 'Power distribution/generation firms (DisCos/GenCos)'],
            ['Commercialisation', 'Government keeps ownership', 'NNPC Limited operating commercially'],
            ['Deregulation', 'Multiple competing private firms', 'Telecoms (MTN, Airtel, Glo) & banking'],
          ],
        },
        example: {
          q: 'Government stops paying annual subsidies to a state railway company and directs it to charge commercial fares while keeping 100% state ownership. Which reform is this?',
          steps: [
            ['Check ownership.', 'The state still owns 100% of the company — so it is NOT privatisation.'],
            ['Check operating mandate.', 'Running a state-owned enterprise on profit-making lines is commercialisation.'],
          ],
        },
        yourTurn: {
          q: 'Opening up Nigeria’s telecommunications sector so private companies could compete against state-owned NITEL was primarily an act of:',
          o: ['Deregulation', 'Nationalisation', 'Communalism', 'Deconcentration'],
          a: 0,
          h: [
            'It removed the legal monopoly barrier so competitors could enter.',
            'Nationalisation is the exact opposite (government taking over private firms).',
          ],
          e: 'Deregulation removes statutory monopolies and restrictive rules to encourage private competition.',
        },
      },
    ],
    qs: [
      {
        q: 'Transferring ownership of a government-owned enterprise to private individuals or companies is called:',
        o: ['Privatisation', 'Commercialisation', 'Nationalisation', 'Indigenisation'],
        a: 0,
        e: 'Privatisation transfers state equity and control into private hands.',
      },
      {
        q: 'Which Nigerian agency is responsible for implementing the privatisation and commercialisation of federal public enterprises?',
        o: ['Bureau of Public Enterprises (BPE)', 'INEC', 'NPC', 'NYSC'],
        a: 0,
        e: 'The BPE serves as the secretariat implementing privatisation under the National Council on Privatisation.',
      },
      {
        q: 'In commercialisation, the government:',
        o: ['Retains ownership but requires the enterprise to operate profitably without subsidies', 'Sells 100% of shares to foreign buyers', 'Shuts down the enterprise permanently', 'Bans charging any user fees'],
        a: 0,
        e: 'Commercialisation keeps public ownership while enforcing profit-oriented, self-sustaining management.',
      },
      {
        q: 'A major fear of critics regarding full privatisation of basic utilities like electricity and water is:',
        o: ['Higher tariffs that hurt low-income citizens', 'Too much free electricity', 'Zero private investment', 'End of all corporate taxes'],
        a: 0,
        e: 'Private profit motives can raise tariffs or neglect unprofitable rural areas without strong regulation.',
      },
      {
        q: 'Government taking over a previously private company into state ownership is known as:',
        o: ['Nationalisation', 'Privatisation', 'Deregulation', 'Devolution'],
        a: 0,
        e: 'Nationalisation converts private enterprises into public state ownership.',
      },
      {
        q: 'Which reform best describes removing official price caps and monopoly rules so multiple private airlines can fly domestic routes?',
        o: ['Deregulation', 'Commercialisation', 'Collectivisation', 'Centralisation'],
        a: 0,
        e: 'Deregulation opens markets to multiple competing operators.',
      },
    ],
  },
  {
    id: 'govt-ng-local-govt',
    name: 'Local government in Nigeria',
    sec: SEC2,
    goals: [
      'Trace the evolution of Nigerian local government from Native Authorities to the landmark 1976 Reform.',
      'Explain the structure, funding and main challenges of Nigeria’s 774 Local Government Areas.',
    ],
    trap: 'The 1976 Local Government Reform (under Obasanjo/Yar’Adua) was the first time Nigeria created a UNIFORM single-tier local government system as a recognised third tier of government.',
    parts: [
      {
        title: 'From Native Authorities to the 1976 Reform',
        idea: 'Before 1976, each region ran its own local system (Native Authorities in the North, multi-tier councils in the South). The 1976 Reform unified Nigeria into one uniform single-tier local government system.',
        terms: [
          ['1976 Local Government Reform', 'Landmark reform establishing uniform, elected single-tier LGAs nationwide with statutory federal funding and recognised third-tier status.'],
          ['Fourth Schedule (1999 Constitution)', 'Lists the exclusive functions of LGAs: markets, motor parks, feeder roads, primary health, birth/death registration and tenement rates.'],
          ['SIEC', 'State Independent Electoral Commission — conducts local government council elections in each state.'],
        ],
        rules: [
          'The 1976 Reform stripped traditional rulers of direct executive control of local councils, moving them into advisory Emirate/Traditional Councils.',
          'Nigeria’s 1999 Constitution guarantees democratically elected local councils (Section 7) and lists 774 LGAs.',
        ],
        table: {
          headers: ['Period', 'Local government model'],
          rows: [
            ['Colonial era', 'Native Authority system under traditional rulers & District Officers'],
            ['1950s–1975', 'Regional variations (multi-tier in East/West; Native Authorities in North)'],
            ['1976 Reform onwards', 'Uniform single-tier third tier of government nationwide'],
          ],
        },
        example: {
          q: 'How did the 1976 Local Government Reform change the political role of traditional rulers?',
          steps: [
            ['Check their pre-1976 role.', 'In Northern Nigeria especially, Emirs had directly controlled Native Authorities.'],
            ['State the 1976 change.', 'Executive governance passed to elected Chairmen and Councillors, while traditional rulers were placed in advisory Traditional Councils to preserve their dignity above partisan politics.'],
          ],
        },
        yourTurn: {
          q: 'Which landmark reform established a uniform, single-tier local government system as the third tier of government across all of Nigeria?',
          o: ['1976 Local Government Reform', '1914 Amalgamation', '1946 Richards Constitution', '1986 SAP Reform'],
          a: 0,
          h: [
            'It took place during the Murtala/Obasanjo military administration.',
            'It also introduced direct statutory allocations from the Federation Account to LGAs.',
          ],
          e: 'The 1976 Local Government Reform created Nigeria’s modern uniform third tier of local government.',
        },
      },
      {
        title: 'Funding, roles and problems of Nigerian LGAs',
        idea: 'LGAs are funded through Federation Account allocations, state grants and internal levies — yet state interference, caretaker committees and weak staffing often limit their performance.',
        terms: [
          ['Statutory allocation', 'Share of the Federation Account constitutionally due to local governments.'],
          ['State-Local Joint Account', 'Account through which state governments historically disbursed LGA funds, often criticised for undermining LGA financial autonomy.'],
          ['Caretaker committee', 'Unelected officials appointed by a Governor to run an LGA instead of holding elections (held unconstitutional by courts).'],
        ],
        rules: [
          'Major challenges of Nigerian LGAs: undue interference by state governments, delayed council elections, shortage of skilled technical staff, corruption and low internal revenue.',
          'Supreme Court rulings affirming direct financial autonomy for democratically elected LGAs seek to strengthen grassroots delivery.',
        ],
        table: {
          headers: ['Challenge', 'Practical solution'],
          rows: [
            ['Financial control by states', 'Direct Federation Account disbursement to elected LGAs'],
            ['Unelected caretaker committees', 'Regular, credible SIEC elections'],
            ['Low internally generated revenue', 'Transparent digital market/rate collection & auditing'],
          ],
        },
        example: {
          q: 'Why does appointing unelected “caretaker committees” to run local councils violate Section 7 of Nigeria’s 1999 Constitution?',
          steps: [
            ['Recall Section 7(1).', 'It explicitly guarantees a system of local government by democratically elected local government councils.'],
            ['Draw the conclusion.', 'Replacing elected councillors with appointed caretakers undermines grassroots democracy and constitutional law.'],
          ],
        },
        yourTurn: {
          q: 'Which body conducts elections into local government councils in Nigerian states?',
          o: ['State Independent Electoral Commission (SIEC)', 'Federal Character Commission', 'National Judicial Council', 'Code of Conduct Bureau'],
          a: 0,
          h: [
            'INEC conducts federal and state governorship/assembly polls, while a state-level body handles local council polls.',
            'Look for the commission whose name starts with “State Independent Electoral”.',
          ],
          e: 'Each state’s State Independent Electoral Commission (SIEC) conducts local government elections.',
        },
      },
    ],
    qs: [
      {
        q: 'How many constitutionally recognised Local Government Areas exist in Nigeria?',
        o: ['774', '360', '109', '500'],
        a: 0,
        e: 'Nigeria’s 1999 Constitution lists 774 Local Government Areas (including the 6 FCT Area Councils).',
      },
      {
        q: 'Which of the following is an exclusive function of Local Governments under the Fourth Schedule of Nigeria’s Constitution?',
        o: ['Construction and maintenance of markets, motor parks and public conveniences', 'Printing national currency', 'External military defence', 'Issuing international passports'],
        a: 0,
        e: 'Markets, motor parks, local roads and birth/death registration belong to LGAs.',
      },
      {
        q: 'Under the 1976 Local Government Reform, traditional rulers were assigned to:',
        o: ['Advisory Traditional / Emirate Councils', 'Chair all state high courts', 'Lead national political parties', 'Control the Central Bank'],
        a: 0,
        e: 'The reform insulated traditional rulers from partisan politics in advisory councils.',
      },
      {
        q: 'A major obstacle to effective grassroots governance in Nigeria has been:',
        o: ['Excessive state-government interference in LGA funds and elections', 'Too much financial autonomy for councils', 'Absence of constitutional recognition', 'Having no markets to tax'],
        a: 0,
        e: 'State control over Joint Accounts and caretaker committees have long weakened LGA performance.',
      },
      {
        q: 'Which source provides the largest share of revenue for most Nigerian Local Governments?',
        o: ['Statutory allocation from the Federation Account', 'Customs duties', 'Company income tax', 'Foreign loans'],
        a: 0,
        e: 'Most LGAs rely heavily on monthly Federation Account allocations alongside modest internal levies.',
      },
      {
        q: 'Local government rules enacted for sanitation or market opening hours are called:',
        o: ['Bye-laws', 'Decrees', 'Edicts', 'Treaties'],
        a: 0,
        e: 'Local government councils enact bye-laws within their statutory jurisdiction.',
      },
    ],
  },
  {
    id: 'govt-military-federalism',
    name: 'Military rule and federalism in Nigeria',
    sec: SEC2,
    goals: [
      'Explain why the military intervened in Nigerian politics starting in January 1966.',
      'Analyse how military command structure centralised Nigerian federalism (Decrees, Edicts, Unification Decree 34).',
    ],
    trap: 'Military rule is inherently UNITARY in command even when states exist on paper — Military Governors took orders directly from the Head of State.',
    parts: [
      {
        title: 'Causes and structure of military rule',
        idea: 'The Nigerian military ruled for nearly 29 of Nigeria’s first 39 years after independence, suspending the constitution and governing through Decrees (federal) and Edicts (state).',
        terms: [
          ['Decree', 'Law issued by the federal military government (Supreme Military Council / AFRC / PRC).'],
          ['Edict', 'Law issued by a State Military Governor.'],
          ['Ouster clause', 'Provision in a military decree forbidding courts from questioning or reviewing the decree.'],
        ],
        rules: [
          'Causes of military coups: electoral rigging (e.g. 1965 West, 1983), corruption, ethnic/regional bitterness, economic hardship and personal ambition of officers.',
          'Military regimes fused legislative and executive power in one ruling council (SMC / AFRC / PRC) and suspended parts of the constitution.',
        ],
        table: {
          headers: ['Feature', 'Civilian constitutional rule', 'Military rule'],
          rows: [
            ['Supreme law', 'The Constitution', 'Federal Military Decrees'],
            ['State laws', 'Laws passed by elected Assembly', 'Edicts signed by Military Governor'],
            ['Legislature', 'Elected National Assembly', 'Suspended; fused with ruling military council'],
            ['Fundamental rights', 'Protected by courts', 'Often curtailed by decrees & ouster clauses'],
          ],
        },
        example: {
          q: 'Why did “ouster clauses” in military decrees severely weaken the rule of law?',
          steps: [
            ['Define ouster clause.', 'A clause stripping courts of jurisdiction to challenge an executive act or detention.'],
            ['State the effect.', 'Citizens could not seek judicial review or habeas corpus against unlawful detention (e.g. Decree No. 2).'],
          ],
        },
        yourTurn: {
          q: 'Under military rule in Nigeria, a law made by a State Military Governor was called an:',
          o: ['Edict', 'Act', 'Bye-law', 'Bill'],
          a: 0,
          h: [
            'Federal military laws were Decrees; state military laws had a shorter five-letter name.',
            'Acts and bills belong to civilian parliaments.',
          ],
          e: 'Military regimes enacted federal Decrees and state Edicts.',
        },
      },
      {
        title: 'Impact of military rule on Nigerian federalism',
        idea: 'Because armies obey a single chain of command, military rule dramatically centralised Nigeria — creating states by fiat, taking over regional revenue and expanding the federal Exclusive List.',
        terms: [
          ['Decree No. 34 of 1966 (Unification Decree)', 'Issued by Major-General Aguiyi-Ironsi, abolishing regions and unifying the civil service — triggering fear of domination and the July 1966 counter-coup.'],
          ['Unified command structure', 'Military Governors were officers posted and removable at will by the Commander-in-Chief.'],
          ['Centralised fiscal federalism', 'Military governments concentrated oil revenue in the Federation Account and expanded federal control over universities, land (Land Use Act) and policing.'],
        ],
        rules: [
          'Positive legacies often cited: preserving national unity during the Civil War (1967–70), creating states to protect minorities, NYSC (1973), Abuja FCT and the 1976 Local Government Reform.',
          'Negative legacies: weakening true federalism, eroding judicial autonomy, human rights abuses, institutionalised corruption and disrupted democratic learning.',
        ],
        table: {
          headers: ['Area', 'How military rule reshaped federalism'],
          rows: [
            ['State autonomy', 'Governors answered to the Head of State rather than state voters'],
            ['Revenue sharing', 'Derivation fell from 50% (1963) to very low levels until 1999 (13%)'],
            ['Structure of units', '4 strong regions broken into 36 smaller, federally dependent states'],
          ],
        },
        example: {
          q: 'Why did General Aguiyi-Ironsi’s Decree No. 34 of May 1966 spark intense opposition?',
          steps: [
            ['Check what Decree 34 did.', 'It abolished the federal regions, renamed them “groups of provinces”, and unified the civil services into a unitary system.'],
            ['Explain the backlash.', 'Northern leaders feared Southern civil servants would dominate the unified service, contributing to the July 1966 counter-coup.'],
          ],
        },
        yourTurn: {
          q: 'Which 1966 military decree temporarily abolished federalism and introduced a unitary system in Nigeria?',
          o: ['Decree No. 34 (Unification Decree)', 'Decree No. 24 of 1999', 'Land Use Decree of 1978', 'Indigenisation Decree of 1972'],
          a: 0,
          h: [
            'It was promulgated by Major-General J. T. U. Aguiyi-Ironsi in May 1966.',
            'General Yakubu Gowon quickly reversed it after taking power in July 1966.',
          ],
          e: 'Decree No. 34 of 1966 abolished the federal system until Gowon restored federalism later that year.',
        },
      },
    ],
    qs: [
      {
        q: 'Why is military governance structurally incompatible with true federalism?',
        o: ['The military operates a hierarchical single chain of command from the centre', 'Soldiers cannot create states', 'Military regimes always use parliamentary cabinets', 'Military governments abolish all taxes'],
        a: 0,
        e: 'Unified military command subordinates state governors directly to the federal Head of State.',
      },
      {
        q: 'Which scheme was created by General Yakubu Gowon’s military regime in 1973 to promote national unity after the Civil War?',
        o: ['National Youth Service Corps (NYSC)', 'EFCC', 'ECOWAS', 'NEPAD'],
        a: 0,
        e: 'NYSC deploys university and polytechnic graduates across different states to foster national integration.',
      },
      {
        q: 'A clause inserted into a military decree to bar courts from entertaining cases challenging it is an:',
        o: ['Ouster clause', 'Assent clause', 'Residual clause', 'Federal character clause'],
        a: 0,
        e: 'Ouster clauses removed judicial oversight over executive detentions and decrees.',
      },
      {
        q: 'Nigeria’s first military coup took place on:',
        o: ['15 January 1966', '1 October 1960', '29 May 1999', '31 December 1983'],
        a: 0,
        e: 'Young army officers led by Major Kaduna Nzeogwu staged Nigeria’s first coup on 15 January 1966.',
      },
      {
        q: 'Under military rule, federal laws were enacted as:',
        o: ['Decrees', 'Bills', 'Bye-laws', 'Conventions'],
        a: 0,
        e: 'The supreme military council enacted federal laws by Decree.',
      },
      {
        q: 'Which military head of state restored Nigeria’s federal system after the July 1966 counter-coup?',
        o: ['General Yakubu Gowon', 'Major-General Aguiyi-Ironsi', 'General Sani Abacha', 'General Abdulsalami Abubakar'],
        a: 0,
        e: 'General Gowon repealed Decree No. 34 and restored Nigeria’s federal structure.',
      },
    ],
  },
  {
    id: 'govt-military-sap-return',
    name: 'Military regimes, SAP and the return to civil rule',
    sec: SEC2,
    goals: [
      'Summarise Nigeria’s military regimes from 1966 to 1999 and the policies of the Structural Adjustment Programme (SAP).',
      'Trace the transition steps that returned Nigeria to democratic civilian rule on 29 May 1999.',
    ],
    trap: 'Two military heads of state successfully handed over power to elected civilian presidents: Olusegun Obasanjo (1979) and Abdulsalami Abubakar (1999).',
    parts: [
      {
        title: 'Military regimes and the Structural Adjustment Programme (SAP)',
        idea: 'Successive military regimes shaped Nigeria’s economy and politics — from the oil boom and 1979 handover under Murtala/Obasanjo to Buhari’s War Against Indiscipline (WAI) and Babangida’s 1986 SAP.',
        terms: [
          ['War Against Indiscipline (WAI)', 'Civic discipline and anti-corruption campaign launched by General Muhammadu Buhari (1983–1985).'],
          ['Structural Adjustment Programme (SAP, 1986)', 'Market-liberalisation programme introduced by General Ibrahim Babangida featuring Naira devaluation (SFEM), subsidy cuts, trade liberalisation and privatisation.'],
          ['MAMSER / DFRRI', 'Babangida-era agencies for mass civic mobilisation (MAMSER) and rural roads/infrastructure (DFRRI).'],
        ],
        rules: [
          'Sequence of military heads of state: Aguiyi-Ironsi (1966) → Gowon (1966–75) → Murtala Mohammed (1975–76) → Obasanjo (1976–79) → Buhari (1983–85) → Babangida (1985–93) → Abacha (1993–98) → Abdulsalami Abubakar (1998–99).',
          'SAP aimed to diversify Nigeria away from crude oil and boost non-oil exports, but sharp Naira depreciation triggered inflation, brain drain and urban hardship.',
        ],
        table: {
          headers: ['Regime', 'Signature programme / event'],
          rows: [
            ['Murtala / Obasanjo (1975–79)', '19 states, OFN, 1976 LG Reform, 1979 civilian handover'],
            ['Buhari (1983–85)', 'War Against Indiscipline (WAI), currency change'],
            ['Babangida (1985–93)', 'SAP (1986), 21→30 states, June 12 annulment'],
            ['Abacha (1993–98)', '36 states, PTF, human-rights isolation'],
          ],
        },
        example: {
          q: 'Why did the 1986 Structural Adjustment Programme (SAP) provoke student and worker protests in Nigeria?',
          steps: [
            ['Identify SAP’s core measures.', 'Devaluation of the Naira through SFEM, removal of subsidies and cuts in public spending.'],
            ['Trace the social impact.', 'Prices of food, transport and imported goods soared while real wages fell sharply.'],
          ],
        },
        yourTurn: {
          q: 'Which Nigerian military leader introduced the Structural Adjustment Programme (SAP) in 1986?',
          o: ['General Ibrahim Babangida', 'General Yakubu Gowon', 'General Muhammadu Buhari', 'General Abdulsalami Abubakar'],
          a: 0,
          h: [
            'He took power in August 1985 and rejected a direct IMF loan before launching a home-grown adjustment programme.',
            'He also created MAMSER and DFRRI.',
          ],
          e: 'General Ibrahim Babangida introduced SAP in 1986 to deregulate the economy and float the Naira.',
        },
      },
      {
        title: 'The 1998–1999 transition back to civil rule',
        idea: 'After the sudden death of General Sani Abacha in June 1998, General Abdulsalami Abubakar released political prisoners, created INEC, promulgated the 1999 Constitution and handed power to Chief Olusegun Obasanjo on 29 May 1999.',
        terms: [
          ['Interim National Government (ING, 1993)', 'Unelected caretaker government headed by Chief Ernest Shonekan after Babangida stepped aside; toppled by Abacha in Nov 1993.'],
          ['NADECO', 'National Democratic Coalition — pro-democracy civil movement demanding validation of June 12 and end to military rule.'],
          ['29 May 1999 Handover', 'Abdulsalami Abubakar’s 11-month transition inaugurating Nigeria’s Fourth Republic under President Olusegun Obasanjo.'],
        ],
        rules: [
          'Key steps of the 1998–99 transition: dissolving Abacha’s 5 parties, releasing detainees, establishing INEC, registering PDP/APP/AD, holding sequential LG/State/National elections and inaugurating civilians on 29 May 1999.',
          'Nigeria’s return to democracy restored its membership in the Commonwealth and ended international sanctions.',
        ],
        table: {
          headers: ['Transition step (1998–99)', 'Significance'],
          rows: [
            ['Creation of INEC', 'Replaced NECON with an independent electoral umpire'],
            ['Registration of PDP, APP, AD', 'Restored multi-party competition'],
            ['Promulgation of 1999 Constitution', 'Provided the legal foundation for the Fourth Republic'],
            ['29 May 1999 inauguration', 'Ended 16 consecutive years of military rule (1983–1999)'],
          ],
        },
        example: {
          q: 'Why was Nigeria suspended from the Commonwealth in 1995 and readmitted in 1999?',
          steps: [
            ['Identify the 1995 trigger.', 'Execution of Ogoni activist Ken Saro-Wiwa and eight others under General Abacha violated Commonwealth human-rights standards.'],
            ['Identify the 1999 turning point.', 'General Abdulsalami Abubakar’s swift return to democratic civilian rule restored Nigeria’s standing.'],
          ],
        },
        yourTurn: {
          q: 'Which military head of state oversaw the 11-month transition that returned Nigeria to democratic rule on 29 May 1999?',
          o: ['General Abdulsalami Abubakar', 'General Sani Abacha', 'General Ibrahim Babangida', 'General Yakubu Gowon'],
          a: 0,
          h: [
            'He assumed office in June 1998 after General Abacha’s death.',
            'He established INEC and handed over to President Olusegun Obasanjo.',
          ],
          e: 'General Abdulsalami Abubakar led the 1998–1999 transition into Nigeria’s Fourth Republic.',
        },
      },
    ],
    qs: [
      {
        q: 'Who headed the short-lived Interim National Government (ING) between August and November 1993?',
        o: ['Chief Ernest Shonekan', 'Chief M. K. O. Abiola', 'General Abdulsalami Abubakar', 'Alhaji Shehu Shagari'],
        a: 0,
        e: 'Chief Ernest Shonekan led the ING before General Sani Abacha took power in November 1993.',
      },
      {
        q: 'Which pro-democracy coalition campaigned relentlessly against military rule after the June 12, 1993 annulment?',
        o: ['NADECO', 'NCBWA', 'WASU', 'OPEC'],
        a: 0,
        e: 'The National Democratic Coalition (NADECO) mobilised domestic and international pressure for democracy.',
      },
      {
        q: 'Which of the following was a central policy element of Nigeria’s 1986 Structural Adjustment Programme (SAP)?',
        o: ['Market-determined exchange rate and trade liberalisation', 'Barter trade only', 'Nationalising all private shops', 'Abolishing all banks'],
        a: 0,
        e: 'SAP floated the Naira via SFEM, liberalised trade, cut subsidies and began privatisation.',
      },
      {
        q: 'Which two Nigerian military rulers successfully handed over power to democratically elected civilian presidents?',
        o: ['Olusegun Obasanjo (1979) and Abdulsalami Abubakar (1999)', 'Yakubu Gowon and Sani Abacha', 'Aguiyi-Ironsi and Muhammadu Buhari', 'Ibrahim Babangida and Sani Abacha'],
        a: 0,
        e: 'Obasanjo handed over to Shagari in 1979, and Abdulsalami Abubakar handed over to Obasanjo in 1999.',
      },
      {
        q: 'The “War Against Indiscipline” (WAI) was a hallmark of which military regime?',
        o: ['General Muhammadu Buhari (1983–1985)', 'General Yakubu Gowon', 'General Abdulsalami Abubakar', 'Major-General Aguiyi-Ironsi'],
        a: 0,
        e: 'The Buhari–Idiagbon administration launched WAI to promote orderliness, queuing culture and civic discipline.',
      },
      {
        q: 'Nigeria’s Fourth Republic formally began on:',
        o: ['29 May 1999', '1 October 1963', '12 June 1993', '15 January 1966'],
        a: 0,
        e: 'Chief Olusegun Obasanjo was sworn in as President on 29 May 1999, launching the Fourth Republic.',
      },
    ],
  },
];
