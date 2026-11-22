import { buildUtmeSubjectCurriculum, type UtmeTopicSpec } from './builder';

const CRS_SPECS: UtmeTopicSpec[] = [
  {
    id: 'crs-creation-fall',
    name: 'The sovereignty of God: creation and the fall',
    sec: 'Old Testament foundations',
    goals: [
      'Compare the two creation accounts in Genesis 1 and Genesis 2 and explain what they teach about God’s sovereignty',
      'Explain the fall of humanity in Genesis 3 and its consequences for human relationships and work',
    ],
    trap: 'Genesis 1 and Genesis 2 do not contradict each other — Genesis 1 gives a broad six-day overview of cosmic order, while Genesis 2 zooms in on God’s intimate care in forming humanity and the Garden of Eden.',
    parts: [
      {
        title: 'Creation and God’s sovereignty',
        idea: 'The Bible opens with God as the sole, supreme Creator who brings order out of formlessness by His spoken word ("And God said..."). Humanity is created last as the crown of creation, made in God’s image and given stewardship — responsible care, not reckless abuse — over the earth.',
        terms: [
          ['Sovereignty of God', 'God’s supreme authority and complete control over all creation'],
          ['Image of God (Imago Dei)', 'Humanity’s spiritual, moral and rational capacity to relate to God and care for creation'],
          ['Stewardship', 'Trusteeship over creation — caring for and tending the earth on God’s behalf'],
        ],
        rules: [
          'Day 1: light; Day 2: sky/firmament; Day 3: land, seas and plants; Day 4: sun, moon and stars; Day 5: birds and sea creatures; Day 6: land animals and humanity; Day 7: God rested and blessed the Sabbath.',
          'In Genesis 1, God creates by spoken word; in Genesis 2, God forms Adam from dust and breathes the breath of life into him.',
          'Each stage of creation is pronounced "good", and the finished whole is "very good".',
        ],
        table: {
          headers: ['Feature', 'Genesis 1 account', 'Genesis 2 account'],
          rows: [
            ['Method of creation', 'Spoken word ("Let there be...")', 'Intimate shaping from dust and breath of life'],
            ['Focus', 'The whole universe in orderly six days', 'Humanity, the Garden of Eden and marriage'],
            ['Human role', 'Dominion and fruitfulness over earth', 'Tilling and keeping the garden in partnership'],
          ],
          trapNote: 'Light was created on Day 1, before the sun, moon and stars on Day 4 — a frequent exam check.',
        },
        example: {
          q: 'Why does Genesis 2 say God placed Adam in the Garden of Eden "to till it and keep it"?',
          steps: [
            ['Note the action verbs', '"till" (work productively) and "keep" (guard and protect)'],
            ['Connect to human dignity', 'Work existed before the fall as noble stewardship, not as a curse'],
          ],
        },
        yourTurn: {
          q: 'According to Genesis 1, on which day did God create the sun, moon and stars to mark seasons and days?',
          o: ['Day 4', 'Day 1', 'Day 2', 'Day 6'],
          a: 0,
          h: [
            'Remember that light itself appeared on Day 1, while the heavenly bodies appeared later.',
            'They correspond to Day 1 in the second half of the six-day pattern (Days 4–6 fill Days 1–3).',
          ],
          e: 'God created light on Day 1 and the sun, moon and stars on Day 4.',
        },
      },
      {
        title: 'The fall of humanity and its consequences',
        idea: 'In Genesis 3, the serpent tempts Eve by questioning God’s truthfulness and promising she will become "like God". Adam and Eve disobey the single command not to eat from the tree of the knowledge of good and evil. Sin breaks harmony between humanity and God, between husband and wife (blame-shifting), and between humanity and the soil.',
        terms: [
          ['The Fall', 'Humanity’s first act of disobedience in Eden that introduced sin, shame and broken fellowship'],
          ['Free will', 'The God-given ability to choose obedience or disobedience'],
          ['Blame-shifting', 'Refusing personal responsibility — Adam blamed Eve (and God), while Eve blamed the serpent'],
        ],
        rules: [
          'The serpent attacked trust in God’s word ("Did God really say...?") before attacking obedience.',
          'Immediate consequences included shame (hiding from God), strained relationships, pain in childbirth, hard toil on thorny ground and expulsion from Eden.',
          'Even in judgement, God showed mercy by clothing Adam and Eve and promising future victory over the serpent (Genesis 3:15).',
        ],
        table: {
          headers: ['Party judged', 'Consequence in Genesis 3'],
          rows: [
            ['The serpent', 'Crawling on its belly and enmity with the woman’s offspring'],
            ['The woman', 'Increased pain in childbearing and strained harmony with her husband'],
            ['The man', 'Cursed ground producing thorns, hard sweat for food, and return to dust'],
          ],
          trapNote: 'Work itself was NOT the curse — work began in Genesis 2 before sin; the fall made work painful and frustrating.',
        },
        example: {
          q: 'When God asked Adam whether he had eaten the forbidden fruit, how did Adam respond and what lesson does this teach?',
          steps: [
            ['Recall Adam’s reply', '"The woman whom you gave to be with me, she gave me fruit..."'],
            ['Draw the moral lesson', 'Sin breeds dishonesty and blame-shifting instead of humble confession'],
          ],
        },
        yourTurn: {
          q: 'Which statement accurately reflects the biblical teaching on work in Genesis 2 and 3?',
          o: [
            'Work was ordained by God before the fall, though the fall made labour painful and toilsome',
            'Work was invented only after Adam and Eve left Eden',
            'God forbade Adam from touching the soil of Eden',
            'Work is meant only as a punishment for the serpent',
          ],
          a: 0,
          h: [
            'Look back at what Adam was instructed to do in the Garden of Eden before the temptation.',
            'What changed after Genesis 3 was the hardship and thorns, not the existence of work itself.',
          ],
          e: 'God gave Adam meaningful work ("to till and keep" Eden) before the fall; sin turned labour into frustrating toil.',
        },
      },
    ],
    qs: [
      {
        q: 'In the first creation account, humanity is made in the image of God primarily to',
        o: [
          'reflect God’s moral nature and exercise responsible stewardship over creation',
          'replace God as ruler of heaven',
          'live without any work or responsibility',
          'destroy the animals of the earth',
        ],
        a: 0,
        e: 'Being made in God’s image equips human beings for fellowship with God and responsible stewardship over creation.',
      },
      {
        q: 'What did God create on the third day according to Genesis 1?',
        o: ['Dry land, seas and vegetation', 'Birds and sea creatures', 'Sun, moon and stars', 'Light and darkness'],
        a: 0,
        e: 'On Day 3 God gathered the waters into seas, brought forth dry land, and made vegetation sprout.',
      },
      {
        q: 'How did the serpent first approach Eve in Genesis 3?',
        o: [
          'By casting doubt on God’s command and goodness',
          'By physically forcing her to eat the fruit',
          'By bringing a message from Adam',
          'By promising she would never have to work',
        ],
        a: 0,
        e: 'The serpent first distorted and questioned God’s word ("Did God say...?") to sow distrust.',
      },
      {
        q: 'Why did Adam and Eve hide among the trees after eating the forbidden fruit?',
        o: [
          'Guilt and shame broke their open fellowship with God',
          'They wanted to surprise God with a gift',
          'A flood was rising in the garden',
          'They had lost their way back to the river',
        ],
        a: 0,
        e: 'Disobedience brought guilt and fear, replacing joyful fellowship with hiding.',
      },
      {
        q: 'How did God show continuing care for Adam and Eve even as He expelled them from Eden?',
        o: [
          'He made garments of skin to clothe them',
          'He cancelled all consequences of their disobedience',
          'He left the serpent unpunished',
          'He sent angels to harvest food for them daily',
        ],
        a: 0,
        e: 'God clothed Adam and Eve with garments of skin, demonstrating mercy alongside justice.',
      },
      {
        q: 'Which of the following was NOT a direct consequence of the fall in Genesis 3?',
        o: [
          'The creation of the Sabbath day of rest',
          'Expulsion from the Garden of Eden',
          'Painful toil on thorny ground',
          'Broken harmony and blame-shifting between Adam and Eve',
        ],
        a: 0,
        e: 'The Sabbath rest was blessed by God on Day 7 at the completion of creation, before the fall.',
      },
    ],
  },
  {
    id: 'crs-covenants',
    name: 'God’s covenants: Noah, Abraham and Sinai',
    sec: 'Old Testament foundations',
    goals: [
      'Explain the meaning of covenant and compare God’s covenants with Noah, Abraham and Israel at Mount Sinai',
      'Identify the sign, promises and human obligations attached to each covenant',
    ],
    trap: 'Do not confuse the signs of the covenants: the rainbow belongs to Noah, circumcision to Abraham, and the Sabbath/tablets of the Law to Sinai.',
    parts: [
      {
        title: 'The covenants with Noah and Abraham',
        idea: 'A covenant is a solemn, binding agreement initiated by God with humanity or a chosen people. After the flood, God made a universal covenant with Noah and every living creature never again to destroy the earth by flood, sealed with the rainbow. Later, God called Abram from Ur and Haran, promising him land (Canaan), countless descendants and blessing for all nations — sealed by circumcision and a new name, Abraham.',
        terms: [
          ['Covenant', 'A solemn sacred pact establishing a committed relationship with promises and duties'],
          ['Rainbow', 'The visible sign of God’s universal covenant with Noah and all creation'],
          ['Circumcision', 'The physical sign of God’s covenant with Abraham and his descendants (Genesis 17)'],
        ],
        rules: [
          'Noah’s covenant was unconditional and universal (with all living creatures), while forbidding murder because humans bear God’s image.',
          'Abraham showed faith by leaving Haran at age 75 without knowing his destination, and later by trusting God when tested with Isaac on Mount Moriah.',
          'God changed Abram’s name to Abraham ("father of a multitude") and Sarai to Sarah.',
        ],
        table: {
          headers: ['Covenant', 'Key promises from God', 'Visible sign'],
          rows: [
            ['Noah (Genesis 9)', 'Never again to destroy all flesh by a flood', 'The rainbow in the clouds'],
            ['Abraham (Genesis 12, 15, 17)', 'Land of Canaan, great nation, blessing to all families of earth', 'Circumcision on the eighth day'],
            ['Sinai (Exodus 19–20)', 'Israel as God’s treasured possession and kingdom of priests', 'The Ten Commandments / Sabbath'],
          ],
          trapNote: 'Abraham was justified by faith before circumcision (Genesis 15:6); circumcision in Genesis 17 sealed the covenant already promised.',
        },
        example: {
          q: 'Why is Abraham remembered as the "father of faith" in biblical history?',
          steps: [
            ['Check his first response', 'He left home and security in Haran purely on God’s promise'],
            ['Check his greatest test', 'He trusted God to provide even when asked to offer Isaac on Mount Moriah'],
          ],
        },
        yourTurn: {
          q: 'What visible sign did God establish for His covenant with Abraham and his male descendants in Genesis 17?',
          o: ['Circumcision', 'The rainbow', 'The bronze serpent', 'The Passover lamb'],
          a: 0,
          h: [
            'The rainbow belongs to Noah’s earlier covenant after the flood.',
            'Genesis 17 commands a physical rite performed on every eight-day-old male child in Abraham’s household.',
          ],
          e: 'Circumcision was appointed as the outward sign of the Abrahamic covenant.',
        },
      },
      {
        title: 'The Sinai covenant and the Ten Commandments',
        idea: 'After delivering Israel from Egypt, God entered a conditional national covenant with Israel at Mount Sinai through Moses. If Israel obeyed God’s voice, they would be His treasured possession and a holy nation. The Decalogue (Ten Commandments) summed up Israel’s duty to God (Commandments 1–4) and duty to neighbour (Commandments 5–10).',
        terms: [
          ['Decalogue', 'The Ten Commandments given by God on Mount Sinai (Exodus 20)'],
          ['Conditional covenant', 'A covenant whose blessings depend on the people’s faithful obedience'],
          ['New Covenant', 'Prophesied by Jeremiah (31:31–34): God’s law written on human hearts rather than stone tablets'],
        ],
        rules: [
          'Commandments 1–4 govern vertical duties toward God (no other gods, no idols, honouring God’s name, keeping the Sabbath).',
          'Commandments 5–10 govern horizontal duties toward people (honouring parents, no murder, adultery, theft, false witness or coveting).',
          'The fifth commandment ("Honour your father and your mother") is the first commandment with a promise of long life in the land.',
        ],
        table: {
          headers: ['Division of Decalogue', 'Commandments', 'Core focus'],
          rows: [
            ['First table', '1 to 4', 'Right worship and loyalty to God alone'],
            ['Second table', '5 to 10', 'Justice, respect, honesty and purity in community'],
          ],
          trapNote: 'Jeremiah’s New Covenant did NOT abolish obedience — it promised inner renewal so people obey willingly from the heart.',
        },
        example: {
          q: 'Why did Moses sprinkle blood on both the altar and the people at Mount Sinai (Exodus 24)?',
          steps: [
            ['Identify the two parties', 'The altar represented God; the people represented Israel'],
            ['Explain the symbol', 'Blood sealed the solemn covenant uniting both parties in commitment'],
          ],
        },
        yourTurn: {
          q: 'How does the New Covenant promised through Jeremiah (31:31–34) differ from the Sinai covenant?',
          o: [
            'God’s law would be written on people’s hearts with personal knowledge of God and forgiveness of sin',
            'It removed all moral standards from Israel',
            'It applied only to priests inside the temple',
            'It was carved onto gold pillars instead of stone',
          ],
          a: 0,
          h: [
            'Think about where the Sinai law was written (tablets of stone) compared with where Jeremiah said the new law would be placed.',
            'It emphasises inner transformation rather than external pressure alone.',
          ],
          e: 'Jeremiah prophesied a New Covenant in which God writes His law on human hearts and forgives iniquity.',
        },
      },
    ],
    qs: [
      {
        q: 'God’s covenant with Noah differed from the Sinai covenant because Noah’s covenant was',
        o: [
          'universal and made with all humanity and living creatures',
          'limited strictly to the tribe of Levi',
          'sealed by circumcision on Mount Moriah',
          'given only after Israel entered Canaan',
        ],
        a: 0,
        e: 'God’s covenant with Noah included all humankind and every living creature on earth.',
      },
      {
        q: 'Which promise was part of God’s initial call to Abram in Genesis 12?',
        o: [
          'All families of the earth would be blessed through him',
          'He would immediately become king of Egypt',
          'He would build the temple in Jerusalem',
          'He would never experience famine or travel',
        ],
        a: 0,
        e: 'God promised Abram a great nation, a great name and that all families on earth would be blessed through him.',
      },
      {
        q: 'Which of the Ten Commandments carries an explicit promise of long life?',
        o: [
          'Honour your father and your mother',
          'You shall not steal',
          'You shall not bear false witness',
          'You shall not covet',
        ],
        a: 0,
        e: 'The fifth commandment promises long life in the land God gives.',
      },
      {
        q: 'The first four of the Ten Commandments deal mainly with human duty toward',
        o: ['God', 'foreign nations', 'farm animals', 'political kings'],
        a: 0,
        e: 'Commandments 1–4 focus on exclusive worship, reverence for God’s name and Sabbath observance.',
      },
      {
        q: 'On Mount Moriah, when God tested Abraham’s obedience with Isaac, God provided a',
        o: ['ram caught in a thicket', 'dove from heaven', 'calf from Egypt', 'fish from the Jordan'],
        a: 0,
        e: 'God stopped Abraham and provided a ram caught by its horns in a thicket, showing He is "Jehovah Jireh" (the Lord provides).',
      },
      {
        q: 'At Mount Sinai, God declared that an obedient Israel would become His',
        o: [
          'treasured possession, kingdom of priests and holy nation',
          'wealthiest trading empire in Babylon',
          'army to conquer Rome',
          'group of nomadic herdsmen forever',
        ],
        a: 0,
        e: 'Exodus 19:5–6 defines Israel’s covenant vocation as God’s treasured possession, a kingdom of priests and a holy nation.',
      },
    ],
  },
  {
    id: 'crs-leadership-judges',
    name: 'Leadership: Joseph, Moses, Joshua and the judges',
    sec: 'Old Testament leadership',
    goals: [
      'Identify the leadership qualities of Joseph, Moses and Joshua from biblical narratives',
      'Explain the cycle of apostasy and deliverance in the period of the Judges, focusing on Deborah and Gideon',
    ],
    trap: 'Do not assume Old Testament "judges" were merely courtroom magistrates — they were charismatic military and spiritual deliverers raised by God in times of crisis.',
    parts: [
      {
        title: 'Joseph, Moses and Joshua',
        idea: 'God trains leaders through testing and humility. Joseph rose from slavery and prison in Egypt to prime minister through integrity, wisdom and forgiveness toward his brothers. Moses was called at the burning bush to deliver Israel from bondage, interceding patiently for a stubborn people. Joshua, Moses’ faithful assistant, led Israel across the Jordan into Canaan through courage and obedience to God’s law.',
        terms: [
          ['Intercession', 'Pleading with God on behalf of others, as Moses repeatedly did for Israel'],
          ['Theophany', 'A visible manifestation of God’s presence, such as the burning bush at Horeb'],
          ['Courageous stewardship', 'Leading through preparation, integrity and dependence on God rather than pride'],
        ],
        rules: [
          'Joseph resisted Potiphar’s wife out of reverence for God, planned ahead for the seven-year famine, and forgave his brothers ("You meant evil against me, but God meant it for good").',
          'Moses initially gave excuses at the burning bush (unworthiness, speech difficulty), yet obeyed when God assured him of His presence and gave Aaron as spokesman.',
          'Joshua renewed the covenant at Shechem, challenging Israel: "Choose this day whom you will serve... as for me and my house, we will serve the Lord."',
        ],
        table: {
          headers: ['Leader', 'Key crisis handled', 'Standout leadership virtue'],
          rows: [
            ['Joseph', 'Betrayal, false accusation and 7-year famine', 'Integrity, foresight and forgiveness'],
            ['Moses', 'Egyptian slavery, Red Sea and wilderness grumbling', 'Humility, intercession and patience'],
            ['Joshua', 'Crossing the Jordan and settling Canaan', 'Courage, military discipline and covenant loyalty'],
          ],
          trapNote: 'Moses was denied entry into Canaan because he struck the rock in anger at Meribah instead of speaking to it as God commanded.',
        },
        example: {
          q: 'What leadership lesson stands out from Joseph’s storage of grain during Egypt’s seven years of plenty?',
          steps: [
            ['Note his action', 'Stored one-fifth of every abundant harvest in city granaries'],
            ['Draw the lesson', 'Effective leaders plan ahead in good times to protect people during crises'],
          ],
        },
        yourTurn: {
          q: 'Why did God appoint Aaron to accompany Moses when Moses protested at the burning bush?',
          o: [
            'To serve as Moses’ spokesman because Moses complained he was slow of speech',
            'Because Moses refused to walk back to Egypt',
            'To replace Moses as the main prophet immediately',
            'Because Aaron was Pharaoh’s chief adviser',
          ],
          a: 0,
          h: [
            'Recall the personal weakness Moses raised as his final excuse before God.',
            'Aaron was known for speaking fluently on his brother’s behalf.',
          ],
          e: 'When Moses protested that he was slow of speech, God promised to be with his mouth and gave his brother Aaron to speak for him.',
        },
      },
      {
        title: 'The Judges: Deborah and Gideon',
        idea: 'After Joshua died, Israel fell into a repeating cycle in the Book of Judges: sin (idolatry) → servitude under foreign oppressors → supplication (crying out to God) → salvation through a judge → peace, until the next relapse. Deborah served as both prophetess and judge, inspiring Barak to defeat Sisera; Gideon, though hesitant at first, trusted God to defeat the vast Midianite army with just 300 men.',
        terms: [
          ['Cycle of Judges', 'Sin → oppression → repentance/cry for help → deliverance by a judge → peace'],
          ['Deborah', 'A prophetess and judge who settled disputes under a palm tree and rallied Israel against Jabin and Sisera'],
          ['Gideon', 'A judge called while threshing wheat in a winepress whose army God reduced from 32,000 to 300'],
        ],
        rules: [
          'Barak refused to march against Sisera unless Deborah went with him, so Deborah prophesied that the honour of killing Sisera would go to a woman (Jael).',
          'God reduced Gideon’s army to 300 men so Israel could not boast that their own strength saved them.',
          'Gideon used trumpets, empty jars and torches at night to throw the Midianites into confusion.',
        ],
        table: {
          headers: ['Judge', 'Oppressor', 'Key lesson'],
          rows: [
            ['Deborah', 'King Jabin of Hazor & general Sisera', 'God uses courageous women in spiritual and civic leadership'],
            ['Gideon', 'Midianites and Amalekites', 'Victory belongs to God, not to overwhelming human numbers'],
          ],
          trapNote: 'Jael — not Deborah — killed Sisera in her tent with a tent peg after Sisera fled the battlefield.',
        },
        example: {
          q: 'Why did God instruct Gideon to send most of his 32,000 soldiers home before fighting Midian?',
          steps: [
            ['Identify the danger of a huge army', 'Israel would boast, "My own hand has saved me"'],
            ['State God’s purpose', 'Winning with 300 men proved clearly that deliverance came from God alone'],
          ],
        },
        yourTurn: {
          q: 'In Deborah’s campaign against Sisera, who actually killed the fleeing enemy commander Sisera?',
          o: ['Jael', 'Deborah', 'Barak', 'Gideon'],
          a: 0,
          h: [
            'Deborah had warned Barak that the final honour would go into the hand of a woman.',
            'Remember the woman who welcomed the exhausted Sisera into her tent with milk before striking him.',
          ],
          e: 'Jael, the wife of Heber the Kenite, killed Sisera in her tent, fulfilling Deborah’s prophecy.',
        },
      },
    ],
    qs: [
      {
        q: 'Joseph’s refusal of Potiphar’s wife’s advances teaches primarily the value of',
        o: ['moral integrity and fear of God', 'political ambition', 'military strategy', 'secrecy'],
        a: 0,
        e: 'Joseph declared he could not commit such wickedness and sin against God, demonstrating steadfast integrity.',
      },
      {
        q: 'At Shechem, Joshua’s farewell speech urged Israel to',
        o: [
          'put away foreign gods and choose wholeheartedly to serve the Lord',
          'return to Egypt for protection',
          'appoint a hereditary king immediately',
          'stop keeping the Passover feast',
        ],
        a: 0,
        e: 'Joshua challenged Israel to renew covenant loyalty and declared that he and his household would serve the Lord.',
      },
      {
        q: 'Which sequence correctly summarises the recurring cycle in the Book of Judges?',
        o: [
          'Apostasy → oppression → cry for help → deliverance',
          'Deliverance → exile → temple building → monarchy',
          'Victory → taxation → famine → migration',
          'Prophecy → census → coronation → peace',
        ],
        a: 0,
        e: 'Israel repeatedly turned to idols, suffered foreign oppression, cried to God, and was rescued by a judge.',
      },
      {
        q: 'Where did Deborah sit to hear and settle disputes among the Israelites?',
        o: [
          'Under the Palm of Deborah between Ramah and Bethel',
          'Inside the palace of Jerusalem',
          'At the gate of Jericho',
          'On the summit of Mount Carmel',
        ],
        a: 0,
        e: 'Judges 4:5 records that Deborah held court under the palm tree named after her in the hill country of Ephraim.',
      },
      {
        q: 'How many soldiers remained in Gideon’s final band after God tested them at the water?',
        o: ['300', '3,000', '10,000', '32,000'],
        a: 0,
        e: 'Only 300 men lapped water with their hands to their mouths, showing alertness, and God used them to rout Midian.',
      },
      {
        q: 'When Joseph’s brothers feared revenge after Jacob’s death, Joseph comforted them by saying',
        o: [
          'God turned the evil they intended into good to save many lives',
          'they must pay back double the silver they took',
          'he had forgotten who they were',
          'Pharaoh would decide their punishment',
        ],
        a: 0,
        e: 'Joseph forgave them completely, recognising God’s providence in preserving the family during famine.',
      },
    ],
  },
  {
    id: 'crs-parents-monarchy',
    name: 'Parental responsibility and the united monarchy',
    sec: 'Monarchy in Israel',
    goals: [
      'Contrast responsible parenting (Asa) with parental neglect (Eli and Samuel) and explain their consequences',
      'Trace the rise and reigns of Saul, David and Solomon during the united monarchy',
    ],
    trap: 'Do not assume Saul was rejected merely because he was weak in battle — he was rejected for impatient, partial obedience ("to obey is better than sacrifice").',
    parts: [
      {
        title: 'Parental responsibility: Eli, Samuel and Asa',
        idea: 'Scripture teaches that godly parents must actively correct and guide their children rather than indulge wrongdoing. Eli knew his sons Hophni and Phinehas abused sacrifices and worshippers at Shiloh yet only gave weak rebukes; Samuel’s sons Joel and Abijah took bribes as judges in Beersheba, prompting Israel to demand a king. By contrast, King Asa of Judah acted decisively against idolatry even within his own family, removing his grandmother Maacah as queen mother for making an idol.',
        terms: [
          ['Eli’s failure', 'Honouring his corrupt sons above God by failing to restrain them firmly'],
          ['Ichabod', 'Name given by Phinehas’ dying wife meaning "the glory has departed from Israel" after the Ark was captured'],
          ['Asa’s reform', 'Courageous faithfulness to God even when it meant correcting a close relative'],
        ],
        rules: [
          'God judged Eli’s house: both sons died in battle against the Philistines, the Ark was captured, and Eli fell backward and died on hearing the news.',
          'Samuel’s personal integrity was spotless, yet his sons’ bribery showed that godly character is not automatically inherited without discipline.',
          'King Asa’s upright example was continued by his son Jehoshaphat, showing the long-term blessing of faithful leadership.',
        ],
        table: {
          headers: ['Parent / leader', 'Family issue', 'Outcome'],
          rows: [
            ['Eli', 'Sons Hophni & Phinehas desecrated offerings', 'Tragic death of sons and Eli; priesthood removed'],
            ['Samuel', 'Sons Joel & Abijah took bribes and perverted justice', 'Elders rejected their rule and demanded a king'],
            ['Asa', 'Queen mother Maacah made a detestable Asherah idol', 'Asa removed her and burned the idol; Judah enjoyed peace'],
          ],
          trapNote: 'Remember that Hophni and Phinehas were ELI’s sons, while Joel and Abijah were SAMUEL’s sons — exams often swap these pairs.',
        },
        example: {
          q: 'Why did the elders of Israel approach Samuel at Ramah to ask for a king "like all the nations"?',
          steps: [
            ['Identify the immediate trigger', 'Samuel was old and his sons Joel and Abijah accepted bribes'],
            ['Identify the deeper spiritual flaw', 'Israel wanted to copy pagan neighbours instead of trusting God as their King'],
          ],
        },
        yourTurn: {
          q: 'Who were the two corrupt sons of Samuel whose bribery led Israel’s elders to demand a king?',
          o: ['Joel and Abijah', 'Hophni and Phinehas', 'Nadab and Abihu', 'Absalom and Adonijah'],
          a: 0,
          h: [
            'Hophni and Phinehas were Eli’s sons at Shiloh.',
            'Samuel appointed his two sons as judges in Beersheba.',
          ],
          e: 'Samuel’s sons Joel and Abijah took bribes in Beersheba, giving Israel’s elders a pretext to ask for a king.',
        },
      },
      {
        title: 'The united monarchy: Saul, David and Solomon',
        idea: 'Israel’s united kingdom had three kings. Saul started humbly but lost the throne through unlawful sacrificing at Gilgal and partial obedience against Amalek. David — "a man after God’s own heart" — united the tribes, captured Jerusalem, showed mercy to Saul, and repented deeply when Nathan confronted him over Bathsheba and Uriah. Solomon prayed for wisdom, built the Temple, and brought prosperity, yet his many foreign wives turned his heart to idols in old age.',
        terms: [
          ['"To obey is better than sacrifice"', 'Samuel’s rebuke to Saul when Saul spared King Agag and choice livestock'],
          ['Nathan’s parable', 'The story of the rich man stealing a poor man’s single ewe lamb to expose David’s sin'],
          ['Solomon’s wisdom', 'Discernment requested at Gibeon rather than wealth or long life, shown in judging two mothers'],
        ],
        rules: [
          'Saul’s two fatal offences: offering burnt sacrifice himself at Gilgal without waiting for Samuel, and sparing King Agag and the best Amalekite animals.',
          'David respected "the Lord’s anointed" by sparing Saul’s life twice (in the cave at En-gedi and in the camp at Ziph).',
          'Solomon’s later sin (idolatry through foreign marriages plus heavy forced labour) sowed the seeds of the kingdom’s division.',
        ],
        table: {
          headers: ['King', 'Major strength', 'Major failure'],
          rows: [
            ['Saul', 'Early courage rescuing Jabesh-gilead', 'Impatience, jealousy of David and partial obedience'],
            ['David', 'Faith, mercy to Saul, sincere repentance', 'Adultery with Bathsheba and murder of Uriah'],
            ['Solomon', 'Wisdom, peace and building the Temple', 'Foreign wives leading him into idolatry; heavy taxation'],
          ],
          trapNote: 'Why was David forgiven while Saul lost his dynasty? When confronted by Nathan, David immediately confessed ("I have sinned against the Lord") instead of blaming the soldiers as Saul did.',
        },
        example: {
          q: 'How did Nathan’s parable of the poor man’s ewe lamb lead King David to genuine repentance?',
          steps: [
            ['Notice the indirect method', 'Nathan told a story that bypassed David’s defensive pride'],
            ['Watch David’s verdict', 'David grew angry and condemned the rich man'],
            ['Hear the climax', 'Nathan said, "You are the man!" and David humbly confessed his sin'],
          ],
        },
        yourTurn: {
          q: 'What crucial lesson did Samuel teach Saul after Saul spared the best Amalekite sheep and cattle to offer as sacrifices?',
          o: [
            'Obedience to God’s word is better than outward religious sacrifice',
            'Kings may alter God’s commands whenever soldiers insist',
            'Sacrifices cancel out intentional disobedience automatically',
            'Only rich animals are acceptable to God',
          ],
          a: 0,
          h: [
            'Saul tried to excuse partial obedience by claiming the animals were for worship.',
            'Recall Samuel’s famous contrast between obeying and sacrificing.',
          ],
          e: 'Samuel declared that "to obey is better than sacrifice", teaching that God values wholehearted obedience over ritual.',
        },
      },
    ],
    qs: [
      {
        q: 'Which two sons of Eli disgraced the priesthood at Shiloh?',
        o: ['Hophni and Phinehas', 'Joel and Abijah', 'Jacob and Esau', 'Cain and Abel'],
        a: 0,
        e: 'Hophni and Phinehas treated the Lord’s offerings with contempt and abused worshippers at Shiloh.',
      },
      {
        q: 'How did King Asa demonstrate firm commitment to God within his own royal household?',
        o: [
          'He removed his grandmother Maacah as queen mother for making an Asherah idol',
          'He allowed idols inside the palace courtyard',
          'He ignored the prophets of Judah',
          'He formed a religious alliance with Sidon',
        ],
        a: 0,
        e: 'Asa placed loyalty to God above family favouritism by deposing Maacah and burning her idol.',
      },
      {
        q: 'Why did David refuse to kill King Saul when he found him asleep in a cave at En-gedi?',
        o: [
          'He respected Saul as the Lord’s anointed king and left vengeance to God',
          'He had no weapon with him',
          'His soldiers threatened to desert him if he struck Saul',
          'Saul had already abdicated the throne',
        ],
        a: 0,
        e: 'David spared Saul out of reverence for God’s anointed, refusing to seize the throne by violence.',
      },
      {
        q: 'At Gibeon, what gift did young King Solomon ask from God in a dream?',
        o: ['An understanding mind (wisdom) to govern God’s people justly', 'Long life and gold', 'Victory over Egypt', 'A larger army than David’s'],
        a: 0,
        e: 'Solomon asked for wisdom to discern good and evil, pleasing God who also granted him riches and honour.',
      },
      {
        q: 'What primary spiritual fault led to the decline of Solomon’s later reign?',
        o: [
          'Marrying many foreign wives who turned his heart after other gods',
          'Refusing to build the Jerusalem temple',
          'Failing to trade with Tyre',
          'Refusing to listen to the Queen of Sheba',
        ],
        a: 0,
        e: 'Solomon’s foreign wives led him to build high places for pagan gods, provoking God’s displeasure.',
      },
      {
        q: 'Which prophet confronted David with the parable of the rich man and the poor man’s lamb?',
        o: ['Nathan', 'Samuel', 'Elijah', 'Amos'],
        a: 0,
        e: 'Prophet Nathan used the parable of the ewe lamb to expose David’s sin with Bathsheba and Uriah.',
      },
    ],
  },
  {
    id: 'crs-divided-kingdom-elijah',
    name: 'The divided kingdom, Elijah and religious reform',
    sec: 'Monarchy in Israel',
    goals: [
      'Explain the causes of the division of Israel under Rehoboam and Jeroboam',
      'Trace Elijah’s confrontation with Ahab and Jezebel (Mount Carmel and Naboth’s vineyard) and King Josiah’s religious reforms',
    ],
    trap: 'Do not mix up the two kingdoms: the Northern Kingdom kept the name ISRAEL (10 tribes, led first by Jeroboam I, capital later Samaria), while the Southern Kingdom was JUDAH (2 tribes, led by Rehoboam, capital Jerusalem).',
    parts: [
      {
        title: 'Division of the kingdom and greed versus justice',
        idea: 'After Solomon died, his son Rehoboam rejected the elders’ wise counsel to lighten taxation and followed his young friends’ harsh boast instead. Ten northern tribes broke away under Jeroboam I to form Israel, leaving Rehoboam with Judah and Benjamin. Fearful that northerners visiting Jerusalem to worship would return to Rehoboam, Jeroboam set up golden calves at Bethel and Dan — the "sin of Jeroboam". Later in the North, King Ahab and Queen Jezebel promoted Baal worship and murdered Naboth to steal his ancestral vineyard.',
        terms: [
          ['Rehoboam’s folly', 'Rejecting seasoned elders’ advice to ease burdens, sparking the 931 BC split'],
          ['Sin of Jeroboam', 'Setting up golden calves at Bethel and Dan and appointing non-Levitical priests'],
          ['Naboth’s vineyard', 'Ahab coveted Naboth’s inheritance; Jezebel forged letters and bribed false witnesses to have Naboth stoned'],
        ],
        rules: [
          'Solomon’s idolatry was the spiritual root of the split; Rehoboam’s harsh answer was the political trigger.',
          'Naboth refused to sell his vineyard not out of stubbornness, but because Mosaic law forbade selling ancestral family land permanently.',
          'Elijah confronted Ahab right inside the stolen vineyard, proving that rulers are accountable to God’s justice.',
        ],
        table: {
          headers: ['Kingdom', 'First king', 'Tribes & main worship centre'],
          rows: [
            ['Northern Kingdom (Israel)', 'Jeroboam I', '10 tribes; golden calves set up at Bethel and Dan'],
            ['Southern Kingdom (Judah)', 'Rehoboam', 'Judah and Benjamin; the Temple in Jerusalem'],
          ],
          trapNote: 'Jeroboam set up his calves at BETHEL (south border) and DAN (north border) — not Samaria, which was built later by Omri.',
        },
        example: {
          q: 'Why did Jeroboam set up golden calves at Bethel and Dan?',
          steps: [
            ['Spot his political fear', 'If northern citizens travelled to Jerusalem for feasts, their loyalty might swing back to Judah'],
            ['Spot his mistake', 'He put political survival ahead of God’s law, introducing idolatry into Israel'],
          ],
        },
        yourTurn: {
          q: 'How did Queen Jezebel obtain Naboth’s vineyard for King Ahab?',
          o: [
            'By writing letters in Ahab’s seal arranging false witnesses to accuse Naboth of cursing God and the king',
            'By offering Naboth three times the market price in silver',
            'By appealing to the elders of Jerusalem for a fair ruling',
            'By trading a royal palace for the vineyard',
          ],
          a: 0,
          h: [
            'Naboth refused both a trade and money because the land was his ancestral inheritance.',
            'Jezebel abused royal authority and staged a fake trial with two dishonest men.',
          ],
          e: 'Jezebel used Ahab’s royal seal to frame Naboth with false witnesses so he was stoned to death and Ahab seized the land.',
        },
      },
      {
        title: 'Elijah on Mount Carmel and King Josiah’s reforms',
        idea: 'When Ahab and Jezebel led Israel into Baal worship, Elijah announced a three-year drought and later challenged 450 prophets of Baal on Mount Carmel: "How long will you go limping with two different opinions?" Baal’s prophets failed despite shouting and cutting themselves; God answered Elijah’s drenched altar with fire from heaven, and the people cried, "The Lord, He is God!" Years later in Judah, young King Josiah discovered the Book of the Law during temple repairs and carried out sweeping religious reforms.',
        terms: [
          ['Mount Carmel contest', 'Elijah’s public showdown proving Yahweh — not Baal — is the living God'],
          ['Syncretism', 'Mixing the worship of the true God with pagan practices'],
          ['Josiah’s reform', 'Destroying idols, cleansing the temple, renewing the covenant and keeping the greatest Passover since the Judges'],
        ],
        rules: [
          'Elijah poured twelve jars of water over the wood and sacrifice so nobody could claim hidden sparks lit the fire.',
          'After Mount Carmel, Elijah fled Jezebel’s threat to Mount Horeb, where God met him not in wind, earthquake or fire, but in a gentle whisper ("still small voice").',
          'High priest Hilkiah found the Book of the Law in the temple; scribe Shaphan read it to Josiah, who tore his clothes in repentance.',
        ],
        table: {
          headers: ['Reformer', 'Context', 'Key action'],
          rows: [
            ['Elijah', 'Northern Kingdom under Ahab & Jezebel', 'Challenged Baal prophets on Mount Carmel; rebuked greed over Naboth'],
            ['Josiah', 'Southern Kingdom (Judah) at age 26', 'Repaired the Temple, read the Law publicly, smashed idols and restored Passover'],
          ],
          trapNote: 'Remember the two names in Josiah’s story: HILKIAH the high priest found the scroll; SHAPHAN the secretary read it to the king; HULDAH the prophetess confirmed God’s word.',
        },
        example: {
          q: 'Why did King Josiah tear his royal robes when Shaphan read the discovered Book of the Law?',
          steps: [
            ['Recognise the gesture', 'Tearing garments was an Israelite sign of deep grief and repentance'],
            ['Identify the reason', 'Josiah realised how far Judah had strayed from God’s covenant laws'],
          ],
        },
        yourTurn: {
          q: 'On Mount Horeb, in what way did God finally speak to the discouraged prophet Elijah?',
          o: [
            'In a gentle whisper (still small voice)',
            'In the fierce wind that split the rocks',
            'In the earthquake',
            'In the roaring fire',
          ],
          a: 0,
          h: [
            'Wind, earthquake and fire all passed by first, and Scripture says the Lord was NOT in them.',
            'God chose a quiet, calming contrast to show Elijah he was not alone.',
          ],
          e: 'After the wind, earthquake and fire, God spoke to Elijah in a still small voice (gentle whisper) and reminded him of 7,000 faithful Israelites.',
        },
      },
    ],
    qs: [
      {
        q: 'Whose advice did Rehoboam follow when the northern tribes asked him to lighten Solomon’s heavy yoke?',
        o: [
          'The harsh advice of the young men who had grown up with him',
          'The gentle advice of Solomon’s older counsellors',
          'The counsel of Prophet Elijah',
          'The advice of the Queen of Sheba',
        ],
        a: 0,
        e: 'Rehoboam ignored the elders’ wise counsel and threatened harsher burdens, triggering the ten tribes’ revolt.',
      },
      {
        q: 'In which two northern towns did Jeroboam place golden calves to stop people worshipping in Jerusalem?',
        o: ['Bethel and Dan', 'Samaria and Jericho', 'Hebron and Beersheba', 'Carmel and Gilgal'],
        a: 0,
        e: 'Jeroboam erected golden calves at Bethel in the south of his territory and Dan in the north.',
      },
      {
        q: 'Why did Elijah pour water over the altar three times on Mount Carmel?',
        o: [
          'To prove beyond any doubt that the fire came miraculously from God',
          'To cool down the hot afternoon sun',
          'Because the prophets of Baal asked him to do so',
          'To wash away the stones of the altar',
        ],
        a: 0,
        e: 'Drenching the wood and filling the trench removed every suspicion of trickery when God’s fire consumed the sacrifice.',
      },
      {
        q: 'Who discovered the Book of the Law in the temple during King Josiah’s reign?',
        o: ['Hilkiah the high priest', 'Shaphan the secretary', 'Naboth of Jezreel', 'Gehazi'],
        a: 0,
        e: 'High priest Hilkiah found the Book of the Law during temple repairs and gave it to Shaphan to read to Josiah.',
      },
      {
        q: 'Naboth’s refusal to sell his vineyard to King Ahab was based on',
        o: [
          'the Mosaic law protecting ancestral family inheritance',
          'hatred for King Ahab personally',
          'a desire to sell it to Syria for more money',
          'an order from Prophet Elisha',
        ],
        a: 0,
        e: 'Under Israelite law, ancestral land was a sacred family trust from God and not to be sold away permanently.',
      },
      {
        q: 'Which prophetess confirmed God’s message when King Josiah sent envoys to inquire about the discovered scroll?',
        o: ['Huldah', 'Deborah', 'Miriam', 'Hannah'],
        a: 0,
        e: 'Prophetess Huldah confirmed judgement for Judah’s past idolatry while promising Josiah peace in his own lifetime for his humility.',
      },
    ],
  },
  {
    id: 'crs-prophets-exile-return',
    name: 'The prophets, exile and return',
    sec: 'Prophets and restoration',
    goals: [
      'Summarise the core messages of Amos, Hosea, Isaiah and Jeremiah on social justice, steadfast love and true religion',
      'Explain the Babylonian exile, faithfulness in exile (Daniel, Shadrach, Meshach, Abednego) and the return under Nehemiah and Ezra',
    ],
    trap: 'Do not confuse Amos and Hosea: Amos preached mainly about SOCIAL JUSTICE ("let justice roll down like waters"), while Hosea used his marriage to Gomer to picture GOD’S STEADFAST LOVE despite Israel’s unfaithfulness.',
    parts: [
      {
        title: 'Amos, Hosea, Isaiah and Jeremiah',
        idea: 'Israel’s prophets were God’s spokesmen calling the nation back to covenant faithfulness. Amos, a herdsman from Tekoa sent to the wealthy North, condemned cheating merchants, corrupt judges and empty worship without justice. Hosea’s loyal love for his unfaithful wife Gomer illustrated God’s tender mercy toward unfaithful Israel. Isaiah saw God’s holiness in the temple ("Here am I! Send me") and prophesied a righteous Messiah, while Jeremiah warned Judah honestly despite persecution.',
        terms: [
          ['Social justice (Amos)', 'Fair courts, honest weights and protection of the poor rather than empty noisy festivals'],
          ['Steadfast love (Hosea)', 'God’s loyal, forgiving covenant love ("I desire steadfast love and not sacrifice")'],
          ['Holiness (Isaiah)', 'God’s moral purity requiring cleansed lips and a faithful life'],
        ],
        rules: [
          'Amos condemned selling the needy "for a pair of sandals", using false scales and lounging in luxury while ignoring the poor.',
          'Both Amos and Hosea taught that religious rituals mean nothing to God if worshippers practise injustice and idolatry.',
          'Isaiah responded to God’s call ("Whom shall I send?") with willing obedience ("Here am I! Send me").',
        ],
        table: {
          headers: ['Prophet', 'Main audience', 'Signature message'],
          rows: [
            ['Amos', 'Northern Kingdom (Israel)', 'Social justice, honest trade and sincere worship'],
            ['Hosea', 'Northern Kingdom (Israel)', 'God’s steadfast love calling unfaithful Israel home'],
            ['Isaiah', 'Southern Kingdom (Judah)', 'God’s holiness, trust in God and coming Messiah'],
            ['Jeremiah', 'Judah before Babylonian exile', 'True repentance, personal responsibility and the New Covenant'],
          ],
          trapNote: 'Amos came FROM Judah (Tekoa) but prophesied TO the Northern Kingdom (Bethel/Samaria).',
        },
        example: {
          q: 'What did Amos mean when he declared in God’s name, "Take away from me the noise of your songs... let justice roll down like waters"?',
          steps: [
            ['Identify what God rejected', 'Loud songs and offerings paired with oppression of the poor'],
            ['Identify what God desired', 'Continuous, flowing fairness and righteousness in daily society'],
          ],
        },
        yourTurn: {
          q: 'Which prophet’s faithful marriage to an unfaithful wife, Gomer, dramatised God’s steadfast love for Israel?',
          o: ['Hosea', 'Amos', 'Nehemiah', 'Jonah'],
          a: 0,
          h: [
            'Think of the prophet whose family life served as a living parable of God’s covenant love.',
            'He also declared, "I desire steadfast love and not sacrifice."',
          ],
          e: 'God instructed Hosea to love Gomer faithfully as a living sign of His loyal love for unfaithful Israel.',
        },
      },
      {
        title: 'Faithfulness in exile and return to Jerusalem',
        idea: 'Because Judah ignored repeated prophetic warnings, Babylon destroyed Jerusalem in 586 BC and took exiles away. Even in Babylon, young Jews stayed faithful: Shadrach, Meshach and Abednego refused to bow to Nebuchadnezzar’s golden image and were delivered from the fiery furnace, while Daniel prayed openly to God despite King Darius’ decree and was saved from the lions’ den. Later, King Cyrus of Persia allowed the exiles to return; Ezra restored teaching of the Law, and Nehemiah rebuilt Jerusalem’s broken walls despite fierce opposition from Sanballat and Tobiah.',
        terms: [
          ['Exile', 'The forced deportation of Judah’s citizens to Babylon after Jerusalem fell'],
          ['Cyrus’ edict', 'The Persian king’s decree allowing Jewish exiles to return and rebuild the Temple'],
          ['Nehemiah’s leadership', 'Combining prayer, careful planning and watchful courage to rebuild Jerusalem’s walls in 52 days'],
        ],
        rules: [
          'Shadrach, Meshach and Abednego declared that God could rescue them, "but even if He does not", they would still refuse idolatry.',
          'Daniel’s enemies could find no corruption in his public work, so they targeted his daily habit of praying three times a day toward Jerusalem.',
          'Nehemiah faced mockery and threats from Sanballat, Tobiah and Geshem by praying and arming builders while they worked.',
        ],
        table: {
          headers: ['Figure', 'Test faced', 'Faithful response'],
          rows: [
            ['Shadrach, Meshach & Abednego', 'Command to worship a golden statue or burn', 'Refused idolatry; God protected them in the furnace'],
            ['Daniel', 'Decree banning prayer to anyone except King Darius', 'Kept praying openly; God shut the lions’ mouths'],
            ['Nehemiah', 'Ruined walls and sabotage plots by Sanballat & Tobiah', 'Prayed, inspected quietly, organised families and kept watch'],
          ],
          trapNote: 'Remember the Persian king who freed the exiles was CYRUS (not Nebuchadnezzar, who destroyed Jerusalem, and not Darius, who signed the lions’ den decree).',
        },
        example: {
          q: 'How did Nehemiah respond when Sanballat and Tobiah mocked and threatened the builders in Jerusalem?',
          steps: [
            ['Note his spiritual step', 'He prayed to God rather than giving in to fear'],
            ['Note his practical step', 'He stationed armed guards and had builders carry a tool in one hand and a weapon in the other'],
          ],
        },
        yourTurn: {
          q: 'Why did Daniel’s jealous rivals persuade King Darius to ban prayer to any god or person except the king for thirty days?',
          o: [
            'Because Daniel’s public administration was completely honest, so only his devotion to God could be used to trap him',
            'Because Daniel had stolen money from the royal treasury',
            'Because Daniel refused to interpret a dream for Darius',
            'Because Daniel led an army against Persia',
          ],
          a: 0,
          h: [
            'Think about what the officials discovered when they first audited Daniel’s government work.',
            'Finding zero corruption, they looked for a clash between the king’s law and God’s law.',
          ],
          e: 'Daniel was so trustworthy in office that his rivals could trap him only by outlawing his faithful prayer life.',
        },
      },
    ],
    qs: [
      {
        q: 'Amos condemned the wealthy people of Samaria mainly because they',
        o: [
          'oppressed the poor and cheated in trade while keeping noisy religious feasts',
          'refused to build ships for foreign trade',
          'lived in tents instead of stone houses',
          'prayed too quietly in the temple',
        ],
        a: 0,
        e: 'Amos exposed the hypocrisy of lavish worship paired with bribery, dishonest weights and mistreatment of the poor.',
      },
      {
        q: 'In Isaiah’s temple vision (Isaiah 6), how did Isaiah respond after his lips were cleansed with a live coal?',
        o: ['"Here am I! Send me."', '"I am too young to speak."', '"Send my brother Aaron."', '"I will flee to Tarshish."'],
        a: 0,
        e: 'Once cleansed of sin, Isaiah volunteered eagerly for God’s mission.',
      },
      {
        q: 'Which Persian ruler issued the decree permitting Jewish exiles to return and rebuild the Jerusalem Temple?',
        o: ['Cyrus', 'Nebuchadnezzar', 'Ahab', 'Pharaoh Neco'],
        a: 0,
        e: 'King Cyrus of Persia issued the edict freeing the exiles to return and rebuild.',
      },
      {
        q: 'Who were the main opponents who mocked and tried to halt Nehemiah’s rebuilding of Jerusalem’s walls?',
        o: ['Sanballat and Tobiah', 'Hophni and Phinehas', 'Korach and Dathan', 'Balaam and Balak'],
        a: 0,
        e: 'Sanballat the Horonite and Tobiah the Ammonite (along with Geshem) mocked and plotted against Nehemiah’s work.',
      },
      {
        q: 'Shadrach, Meshach and Abednego’s reply to Nebuchadnezzar ("but if not, be it known to you...") shows',
        o: [
          'unconditional loyalty to God regardless of the personal cost',
          'doubt that God existed',
          'willingness to compromise in secret',
          'desire to overthrow Babylon by force',
        ],
        a: 0,
        e: 'Their faith did not depend on guaranteed rescue — they chose faithfulness to God even at the risk of death.',
      },
      {
        q: 'What important office did Nehemiah hold in the Persian palace before returning to rebuild Jerusalem?',
        o: ['Cupbearer to King Artaxerxes', 'Captain of the guard', 'Chief tax collector', 'High priest of Susa'],
        a: 0,
        e: 'Nehemiah was the trusted cupbearer to King Artaxerxes in Susa before receiving leave to rebuild Jerusalem.',
      },
    ],
  },
  {
    id: 'crs-birth-early-ministry',
    name: 'Birth and early ministry of Jesus',
    sec: 'The Gospels',
    goals: [
      'Compare the birth narratives in Matthew and Luke and explain the significance of the gifts of the Magi',
      'Explain the baptism of Jesus, His three temptations in the wilderness and the calling of the first disciples',
    ],
    trap: 'Do not mix up Matthew’s and Luke’s birth accounts: Matthew records the Magi (wise men), star and flight to Egypt; Luke records the annunciation to Mary, manger and shepherds.',
    parts: [
      {
        title: 'The birth and infancy of Jesus',
        idea: 'The Gospels present Jesus as the promised Messiah born in humble circumstances in Bethlehem. Luke highlights God’s care for the lowly — the angel Gabriel appearing to Mary, the census under Augustus, the manger and angels announcing peace to shepherds. Matthew highlights Jesus as King of the Jews and Saviour for all nations — wise men from the East guided by a star bringing gold, frankincense and myrrh, and Joseph protecting the child by fleeing Herod’s cruelty to Egypt.',
        terms: [
          ['Immanuel', 'Hebrew name meaning "God with us" (Matthew 1:23)'],
          ['Jesus', 'Name meaning "the Lord saves", because He would save His people from their sins'],
          ['Gifts of the Magi', 'Gold (kingship), frankincense (priesthood/divinity) and myrrh (suffering and burial)'],
        ],
        rules: [
          'Gold symbolised royalty; frankincense symbolised worship/divinity; myrrh foreshadowed Jesus’ sacrificial death.',
          'Mary responded to Gabriel’s announcement with humble faith: "Let it be to me according to your word."',
          'Herod’s massacre of Bethlehem’s boys fulfilled the theme of worldly rulers fearing God’s true King.',
        ],
        table: {
          headers: ['Detail', 'Gospel of Matthew', 'Gospel of Luke'],
          rows: [
            ['Angel speaks to...', 'Joseph in dreams', 'Mary in Nazareth (and Zechariah)'],
            ['Visitors to Jesus', 'Wise men (Magi) from the East', 'Local shepherds from the fields'],
            ['Key theme', 'Jesus as royal Messiah welcomed by Gentiles', 'Jesus as humble Saviour for the poor and outcast'],
          ],
          trapNote: 'Notice that the Magi visited Jesus in a HOUSE (not the manger) sometime after the shepherds had visited on the night of His birth.',
        },
        example: {
          q: 'What does each of the three gifts brought by the Magi signify about Jesus?',
          steps: [
            ['Gold', 'Signifies His kingship as the promised Messiah'],
            ['Frankincense', 'Incense used in temple worship — signifies His divinity and priesthood'],
            ['Myrrh', 'Spice used in embalming — foreshadows His suffering and death'],
          ],
        },
        yourTurn: {
          q: 'Which Gospel records the shepherds visiting baby Jesus lying in a manger?',
          o: ['Luke', 'Matthew', 'Mark', 'John'],
          a: 0,
          h: [
            'Matthew highlights the royal Magi and the star from the East.',
            'Which Gospel writer focuses especially on humble, ordinary people like shepherds?',
          ],
          e: 'Luke records the angels appearing to shepherds and directing them to the child laid in a manger.',
        },
      },
      {
        title: 'Baptism, temptation and calling of the first disciples',
        idea: 'Jesus began His public ministry around age thirty by coming to John the Baptist at the River Jordan — not because He had sins to confess, but to identify with sinful humanity and "fulfil all righteousness". Immediately afterward, the Spirit led Him into the wilderness for forty days, where He defeated three temptations using Scripture rather than selfish power. He then called ordinary fishermen (Peter, Andrew, James, John) and a tax collector (Matthew/Levi) to follow Him.',
        terms: [
          ['Baptism of Jesus', 'The heavens opened, the Spirit descended like a dove, and the Father’s voice affirmed Him as His beloved Son'],
          ['Three temptations', 'Turning stones to bread, jumping from the temple pinnacle, and bowing to Satan for earthly kingdoms'],
          ['Discipleship', 'Immediate, wholehearted response to follow Jesus and become "fishers of men"'],
        ],
        rules: [
          'Jesus defeated every temptation by quoting Deuteronomy ("It is written..."), rejecting easy popularity, spectacle and political compromise.',
          'The first disciples left nets, boats and tax booths immediately, showing that discipleship puts God’s call first.',
          'Calling Matthew (a despised tax collector) proved Jesus’ kingdom welcomes repentant outsiders.',
        ],
        table: {
          headers: ['Temptation', 'Hidden trap', 'Jesus’ Scriptural reply'],
          rows: [
            ['Stones into bread', 'Using divine power selfishly instead of trusting God', '"Man shall not live by bread alone..."'],
            ['Jump from temple pinnacle', 'Testing God recklessly to win cheap spectacle', '"You shall not put the Lord your God to the test"'],
            ['Bow for world kingdoms', 'Winning power by compromising worship', '"Worship the Lord your God and serve Him only"'],
          ],
          trapNote: 'Matthew and Luke list the second and third temptations in slightly different order, but the three tests and Jesus’ Scripture answers are the same.',
        },
        example: {
          q: 'Why did John the Baptist hesitate when Jesus stepped into the Jordan to be baptised?',
          steps: [
            ['Recall John’s baptism', 'It was a baptism of repentance for sinners'],
            ['Recall Jesus’ character', 'John recognised Jesus as greater and sinless ("I need to be baptised by you")'],
            ['Recall Jesus’ reason', 'To identify with humanity and "fulfil all righteousness"'],
          ],
        },
        yourTurn: {
          q: 'How did Jesus resist all three of Satan’s temptations in the wilderness?',
          o: [
            'By quoting and obeying the Word of God from Scripture',
            'By calling twelve legions of angels to fight Satan',
            'By turning stones into bread to regain strength',
            'By debating with the Pharisees',
          ],
          a: 0,
          h: [
            'Look at the repeated phrase Jesus spoke every single time Satan tempted Him.',
            'He relied on faithful obedience to Scripture ("It is written...").',
          ],
          e: 'Jesus overcame every temptation by relying on God’s Word ("It is written...") and refusing to misuse His power.',
        },
      },
    ],
    qs: [
      {
        q: 'What does the name "Immanuel" mean?',
        o: ['God with us', 'The Lord heals', 'Prince of Bethlehem', 'Servant of the law'],
        a: 0,
        e: 'Matthew 1:23 translates Immanuel as "God with us".',
      },
      {
        q: 'In the gifts of the Magi, myrrh specifically foreshadowed Jesus’',
        o: ['suffering and sacrificial death', 'escape to Nazareth', 'carpentry trade', 'journey across Galilee'],
        a: 0,
        e: 'Myrrh was a fragrant resin used in burial preparation, pointing ahead to Jesus’ sacrificial death.',
      },
      {
        q: 'At Jesus’ baptism in the Jordan, the Holy Spirit descended upon Him in the form of a',
        o: ['dove', 'cloud of smoke', 'pillar of fire', 'eagle'],
        a: 0,
        e: 'All four Gospels testify to the Spirit descending like a dove upon Jesus.',
      },
      {
        q: 'What did Satan tempt Jesus to do first after forty days of fasting in the wilderness?',
        o: [
          'Command stones to become loaves of bread',
          'Overthrow the Roman governor',
          'Walk across the Sea of Galilee',
          'Build a new temple in Nazareth',
        ],
        a: 0,
        e: 'Satan first appealed to physical hunger, urging Jesus to turn stones into bread.',
      },
      {
        q: 'What was Matthew (Levi) doing when Jesus called him to be a disciple?',
        o: ['Sitting at the tax booth', 'Mending fishing nets', 'Tending sheep near Bethlehem', 'Copying scrolls in Jerusalem'],
        a: 0,
        e: 'Matthew (Levi) was a tax collector seated at his tax booth when Jesus called him.',
      },
      {
        q: 'By calling Simon Peter and Andrew to become "fishers of men", Jesus meant they would',
        o: [
          'bring people into the kingdom of God through the gospel',
          'expand their fishing business to Judea',
          'teach fishermen how to weave stronger nets',
          'collect temple taxes along the lakeshore',
        ],
        a: 0,
        e: 'Jesus used their everyday trade as a vivid picture of winning human souls for God’s kingdom.',
      },
    ],
  },
  {
    id: 'crs-teachings-parables',
    name: 'The teachings of Jesus: the Sermon on the Mount and the parables',
    sec: 'The Gospels',
    goals: [
      'Explain key lessons of the Sermon on the Mount: the Beatitudes, salt and light, forgiveness, prayer and avoiding anxiety',
      'Interpret major parables of the kingdom, God’s love and wise stewardship (Sower, Prodigal Son, Good Samaritan, Talents)',
    ],
    trap: 'A parable is NOT a complicated allegory where every tiny prop has a secret code — always look first for the ONE main spiritual truth Jesus is driving home.',
    parts: [
      {
        title: 'The Sermon on the Mount',
        idea: 'In Matthew 5–7, Jesus taught the ethics of God’s kingdom — focusing on the heart behind actions rather than outward show. The Beatitudes bless the humble, merciful, pure in heart and peacemakers. Jesus calls disciples "salt of the earth" (preserving goodness) and "light of the world" (shining truth), urges love even for enemies, warns against showy prayer and giving, teaches the Lord’s Prayer, and closes with the wise and foolish builders.',
        terms: [
          ['Beatitudes', 'Eight blessings ("Blessed are...") describing the character of true citizens of God’s kingdom'],
          ['Salt and light', 'Images showing believers must positively influence and illuminate society'],
          ['Golden Rule', '"Whatever you wish that others would do to you, do also to them" (Matthew 7:12)'],
        ],
        rules: [
          'Jesus deepened the law: anger and insult violate the spirit of "do not murder", and lust violates the spirit of "do not commit adultery".',
          'Giving, praying and fasting should be done sincerely before God, not to win human applause.',
          'The wise builder builds on rock by HEARING and OBEYING Jesus’ words; the foolish builder hears without doing.',
        ],
        table: {
          headers: ['Beatitude', 'Promised blessing'],
          rows: [
            ['Poor in spirit', 'Theirs is the kingdom of heaven'],
            ['The meek', 'They shall inherit the earth'],
            ['The merciful', 'They shall receive mercy'],
            ['Pure in heart', 'They shall see God'],
            ['Peacemakers', 'They shall be called sons of God'],
          ],
          trapNote: '"Poor in spirit" means recognising your complete spiritual dependence on God — not merely having empty pockets.',
        },
        example: {
          q: 'Why did Jesus compare His followers to salt that must not lose its taste?',
          steps: [
            ['Recall what salt does', 'Salt preserves food from decay and adds flavour'],
            ['Apply to Christian living', 'If believers compromise their character, they lose their positive influence in society'],
          ],
        },
        yourTurn: {
          q: 'According to the Beatitudes in Matthew 5, who are promised that "they shall be called sons of God"?',
          o: ['The peacemakers', 'The wealthy', 'The loudest speakers', 'The Pharisees'],
          a: 0,
          h: [
            'Match each character quality in the Beatitudes to its specific promise.',
            'Those who actively reconcile enemies reflect God’s own nature.',
          ],
          e: 'Matthew 5:9 states: "Blessed are the peacemakers, for they shall be called sons of God."',
        },
      },
      {
        title: 'The parables of Jesus',
        idea: 'A parable is an earthly story with a heavenly meaning, drawn from farming, weddings, households and travel so ordinary listeners grasp kingdom truths. The Parable of the Sower explains four heart responses to God’s word; the Prodigal Son reveals the Father’s eager forgiveness (and warns against the elder brother’s jealousy); the Good Samaritan defines "neighbour" across ethnic barriers; and the Talents teaches faithful stewardship.',
        terms: [
          ['Parable of the Sower', 'Path (hard heart), rocky ground (shallow joy), thorns (worries/wealth), good soil (fruitful obedience)'],
          ['Good Samaritan', 'A despised outsider stops to care for a wounded traveller after a priest and Levite pass by'],
          ['Prodigal Son', 'The father runs to welcome the repentant younger son while urging the resentful elder brother to rejoice'],
        ],
        rules: [
          'In the Good Samaritan, Jesus flipped the lawyer’s question from "Who qualifies as my neighbour?" to "Be a compassionate neighbour to anyone in need."',
          'In the Parable of the Talents, the servant with one talent was condemned not for having less, but for laziness and fear that buried his gift.',
          'Parables of the Lost Sheep, Lost Coin and Lost Son (Luke 15) all answer critics who complained that Jesus welcomed sinners.',
        ],
        table: {
          headers: ['Parable', 'Central lesson'],
          rows: [
            ['The Sower', 'How we receive and obey God’s word determines our fruitfulness'],
            ['Good Samaritan', 'True neighbourly love crosses ethnic and social boundaries in practical mercy'],
            ['Prodigal Son', 'God joyfully forgives the repentant and rebukes self-righteous jealousy'],
            ['The Talents', 'God expects faithful, active use of the abilities entrusted to us'],
          ],
          trapNote: 'In the Parable of the Prodigal Son, do not forget the ELDER brother — Jesus told the story specifically to challenge the grumbling Pharisees.',
        },
        example: {
          q: 'In the Parable of the Sower, what do the "thorns" that choke the growing seed represent?',
          steps: [
            ['Recall Jesus’ own interpretation', 'Seed among thorns starts growing but gets crowded out'],
            ['State the meaning', 'The cares of the world and the deceitfulness of riches choking spiritual growth'],
          ],
        },
        yourTurn: {
          q: 'In the Parable of the Talents, why was the servant who received one talent rebuked by his master?',
          o: [
            'Because he buried it out of fear and laziness instead of putting it to productive use',
            'Because he invested it and lost half in a storm',
            'Because he gave it to the poor',
            'Because he asked for ten talents instead',
          ],
          a: 0,
          h: [
            'Compare what he did with his talent against what the five-talent and two-talent servants did.',
            'He returned the coin untouched after hiding it in the ground.',
          ],
          e: 'The master rebuked the third servant for slothful neglect — burying his gift instead of using it faithfully.',
        },
      },
    ],
    qs: [
      {
        q: 'In the Sermon on the Mount, the wise man who built his house on rock represents a person who',
        o: [
          'hears Jesus’ words and puts them into practice',
          'memorises the law without obeying it',
          'owns valuable land in Judea',
          'avoids all storms and trials in life',
        ],
        a: 0,
        e: 'Jesus explicitly compared the wise builder to everyone who hears His words and obeys them.',
      },
      {
        q: 'According to Matthew 5:8, what is promised to the "pure in heart"?',
        o: ['They shall see God', 'They shall inherit the land', 'They shall be comforted', 'They shall never be persecuted'],
        a: 0,
        e: 'Jesus declared: "Blessed are the pure in heart, for they shall see God."',
      },
      {
        q: 'Why did Jesus tell the Parable of the Good Samaritan?',
        o: [
          'To answer a lawyer’s question, "And who is my neighbour?"',
          'To teach disciples how to travel safely to Jericho',
          'To explain Roman road taxes',
          'To praise the priest and the Levite',
        ],
        a: 0,
        e: 'Jesus told the parable to show that a true neighbour shows practical mercy to anyone in need regardless of background.',
      },
      {
        q: 'In the Parable of the Sower, seed falling on rocky ground represents people who',
        o: [
          'receive the word gladly at first but fall away quickly when trouble or persecution comes',
          'never hear the word at all',
          'produce a hundredfold harvest',
          'are distracted solely by great wealth',
        ],
        a: 0,
        e: 'Shallow soil produces quick sprouting with no deep root, picturing enthusiasm that withers under hardship.',
      },
      {
        q: 'In the Parable of the Prodigal Son, the elder brother’s angry reaction at the feast represents',
        o: [
          'the self-righteous resentment of the Pharisees toward repentant sinners',
          'the joy of heaven over one sinner who repents',
          'the father’s regret over welcoming his son',
          'a warning against farming',
        ],
        a: 0,
        e: 'Luke 15 opens with Pharisees grumbling that Jesus welcomed sinners; the elder brother mirrors their resentful attitude.',
      },
      {
        q: 'What does Jesus teach about prayer in the Sermon on the Mount?',
        o: [
          'Pray sincerely to God in secret rather than showing off on street corners for human praise',
          'Repeat the longest speeches possible so God hears you',
          'Pray only inside the Jerusalem temple',
          'Avoid forgiving others before you pray',
        ],
        a: 0,
        e: 'Jesus taught sincere, humble prayer directed to the heavenly Father rather than hypocritical display.',
      },
    ],
  },
  {
    id: 'crs-miracles-confession',
    name: 'Miracles, Peter’s confession and the transfiguration',
    sec: 'The Gospels',
    goals: [
      'Classify Jesus’ miracles (nature, healing, exorcism, raising the dead) and explain their spiritual significance',
      'Explain Peter’s confession at Caesarea Philippi and the meaning of the Transfiguration',
    ],
    trap: 'Jesus’ miracles were NEVER magic tricks to impress crowds — in the Gospels they are "signs" revealing God’s compassion and the arrival of God’s kingdom.',
    parts: [
      {
        title: 'The miracles of Jesus',
        idea: 'Jesus’ miracles demonstrated His authority over nature (calming the storm, feeding the five thousand, turning water into wine), sickness (healing the paralytic, centurion’s servant and blind Bartimaeus), evil spirits (the Gerasene demoniac) and death itself (Jairus’ daughter, the widow of Nain’s son and Lazarus). Almost always, miracles answered humble faith and pointed to deeper spiritual wholeness.',
        terms: [
          ['Nature miracle', 'A miracle revealing Jesus’ sovereignty over physical creation, such as calming the Galilean storm'],
          ['Healing miracle', 'Restoring physical health while often forgiving sin or commending faith (e.g., the paralytic lowered through the roof)'],
          ['Sign (in John)', 'John’s special term for miracles because each points beyond itself to who Jesus is (e.g., feeding 5,000 → "I am the bread of life")'],
        ],
        rules: [
          'In healing the paralytic lowered through the roof, Jesus first forgave his sins, proving His spiritual authority before healing his legs.',
          'The Roman centurion amazed Jesus by trusting His spoken word from a distance, showing faith reaches beyond Israel.',
          'Raising Lazarus after four days in the tomb pointed directly to Jesus’ claim: "I am the resurrection and the life."',
        ],
        table: {
          headers: ['Category', 'Biblical example', 'What it reveals about Jesus'],
          rows: [
            ['Nature', 'Calming the storm; feeding 5,000', 'Lord over creation and generous provider'],
            ['Healing', 'Paralytic; blind Bartimaeus', 'Compassion and authority to forgive and restore'],
            ['Exorcism', 'Gerasene demoniac', 'Victory over evil and restoration to human dignity'],
            ['Raising the dead', 'Jairus’ daughter; Lazarus', 'Power over death itself'],
          ],
          trapNote: 'Remember that Jesus’ FIRST recorded miracle in John’s Gospel was turning water into wine at the wedding in Cana of Galilee.',
        },
        example: {
          q: 'Why did the scribes accuse Jesus of blasphemy when He healed the paralysed man lowered through the roof?',
          steps: [
            ['Check Jesus’ first words', '"Son, your sins are forgiven"'],
            ['Check the scribes’ belief', 'They rightly knew only God can forgive sins, yet refused to recognise Jesus’ divine authority'],
          ],
        },
        yourTurn: {
          q: 'Why did Jesus marvel at the faith of the Roman centurion whose servant was ill in Capernaum?',
          o: [
            'Because the centurion trusted that Jesus’ spoken word alone could heal from a distance',
            'Because the centurion offered a huge sum of gold',
            'Because the centurion was a Pharisee scholar',
            'Because the centurion carried his servant onto the roof',
          ],
          a: 0,
          h: [
            'Remember what the Roman officer told Jesus about giving orders to soldiers under his command.',
            'He believed Jesus did not even need to step under his roof.',
          ],
          e: 'The centurion recognised Jesus’ supreme authority, trusting that a single spoken word could heal his servant.',
        },
      },
      {
        title: 'Peter’s confession and the Transfiguration',
        idea: 'At Caesarea Philippi, Jesus asked His disciples, "Who do you say that I am?" Peter answered boldly: "You are the Christ, the Son of the living God." Right away, Jesus predicted His coming suffering, death and resurrection — showing that His Messiahship meant the cross, not a violent political revolt. Shortly afterward, on a high mountain, Jesus was transfigured before Peter, James and John, gleaming in glory alongside Moses and Elijah while the Father’s voice declared, "This is my beloved Son; listen to Him."',
        terms: [
          ['Caesarea Philippi', 'The place where Peter confessed Jesus as the Messiah (the Christ)'],
          ['Transfiguration', 'The moment Jesus’ appearance shone with heavenly glory before Peter, James and John'],
          ['Moses and Elijah', 'Representing the Law (Moses) and the Prophets (Elijah), both fulfilled in Jesus'],
        ],
        rules: [
          'When Peter tried to forbid Jesus from suffering, Jesus rebuked him ("Get behind me, Satan!") because Peter was thinking in human political terms rather than God’s saving plan.',
          'True discipleship means denying oneself, taking up one’s cross daily and following Jesus.',
          'Only Peter, James and John — the inner circle — witnessed the Transfiguration, and Jesus told them to keep silent until after His resurrection.',
        ],
        table: {
          headers: ['Event', 'Witnesses / setting', 'Core theological meaning'],
          rows: [
            ['Peter’s confession', 'The Twelve at Caesarea Philippi', 'Recognises Jesus as Messiah, linked directly to His coming cross'],
            ['Transfiguration', 'Peter, James & John on a high mountain', 'Confirms Jesus’ divine glory and His superiority over Law (Moses) and Prophets (Elijah)'],
          ],
          trapNote: 'Peter’s offer to build three tents treated Jesus, Moses and Elijah as equals — the voice from the cloud corrected this by pointing solely to Jesus: "Listen to Him!"',
        },
        example: {
          q: 'What did the appearance of Moses and Elijah beside Jesus during the Transfiguration signify?',
          steps: [
            ['Identify Moses', 'The giver of the Law'],
            ['Identify Elijah', 'A leading representative of the Prophets'],
            ['Combine the meaning', 'Both the Old Testament Law and Prophets bear witness to and find fulfilment in Jesus'],
          ],
        },
        yourTurn: {
          q: 'Which three disciples did Jesus take with Him up the mountain to witness the Transfiguration?',
          o: [
            'Peter, James and John',
            'Peter, Andrew and Matthew',
            'Thomas, Philip and Bartholomew',
            'Judas, James and Simon',
          ],
          a: 0,
          h: [
            'Think of Jesus’ three closest inner-circle disciples who also stayed closest in Gethsemane.',
            'They include Simon Peter and the two sons of Zebedee.',
          ],
          e: 'Jesus took Peter, James and John up the high mountain where He was transfigured before them.',
        },
      },
    ],
    qs: [
      {
        q: 'Which miracle was the first "sign" recorded in John’s Gospel?',
        o: [
          'Turning water into wine at Cana',
          'Feeding the five thousand',
          'Raising Lazarus',
          'Walking on water',
        ],
        a: 0,
        e: 'John 2:11 states that turning water into wine at the Cana wedding was the first of Jesus’ signs.',
      },
      {
        q: 'In the healing of blind Bartimaeus outside Jericho, what did Bartimaeus do when the crowd told him to be quiet?',
        o: [
          'He cried out all the more, "Son of David, have mercy on me!"',
          'He returned home discouraged',
          'He asked the Pharisees to speak for him',
          'He waited until the next morning',
        ],
        a: 0,
        e: 'Bartimaeus’ persistent faith led Jesus to stop, call him forward and restore his sight.',
      },
      {
        q: 'Where did Peter make his great confession, "You are the Christ, the Son of the living God"?',
        o: ['Caesarea Philippi', 'Bethlehem', 'Cana', 'Bethany'],
        a: 0,
        e: 'Peter’s confession took place in the district of Caesarea Philippi.',
      },
      {
        q: 'Why did Jesus rebuke Peter right after Peter’s confession at Caesarea Philippi?',
        o: [
          'Peter rejected Jesus’ prediction that the Messiah must suffer and die',
          'Peter refused to pay the temple tax',
          'Peter fell asleep during a sermon',
          'Peter argued with John over seating',
        ],
        a: 0,
        e: 'Peter expected a conquering earthly Messiah and tried to stop Jesus from speaking of suffering and death.',
      },
      {
        q: 'At the Transfiguration, Moses and Elijah appeared with Jesus to symbolise that Jesus fulfils',
        o: ['the Law and the Prophets', 'Rome and Greece', 'the Pharisees and Sadducees', 'the tribes of Judah and Benjamin'],
        a: 0,
        e: 'Moses represents the Law and Elijah represents the Prophets, both pointing to Christ.',
      },
      {
        q: 'What instruction did the voice from the bright cloud give the disciples on the Mount of Transfiguration?',
        o: [
          '"This is my beloved Son; listen to Him."',
          '"Build three shelters on this hill."',
          '"Go immediately to Rome."',
          '"Tell the crowds before sunset."',
        ],
        a: 0,
        e: 'God the Father affirmed Jesus’ unique authority above Moses and Elijah and commanded the disciples to listen to Him.',
      },
    ],
  },
  {
    id: 'crs-passion-resurrection',
    name: 'The passion, death, resurrection and ascension of Jesus',
    sec: 'The Gospels',
    goals: [
      'Trace the events of Passion Week from the Triumphal Entry and Last Supper to the trials and crucifixion',
      'Explain the significance of the Resurrection, post-resurrection appearances and Ascension for Christian faith',
    ],
    trap: 'Do not confuse the two trials of Jesus: the Jewish Sanhedrin accused Him of BLASPHEMY (a religious charge), whereas before Roman governor Pontius Pilate they reframed it as TREASON (claiming to be a rival king) to obtain a Roman death sentence.',
    parts: [
      {
        title: 'Triumphal Entry, Last Supper, trials and crucifixion',
        idea: 'Jesus entered Jerusalem humbly on a donkey (fulfilling Zechariah 9:9 as a king of peace) and cleansed the Temple courtyard of dishonest commerce. At the Last Supper, He gave bread and wine as symbols of His body and blood sealing the New Covenant. After praying in agony in Gethsemane ("Not my will, but yours"), Judas betrayed Him for thirty pieces of silver. Peter denied Him three times; the Sanhedrin condemned Him for blasphemy; Pilate bowed to crowd pressure and released Barabbas; and Jesus was crucified at Golgotha, praying "Father, forgive them."',
        terms: [
          ['Last Supper (Eucharist)', 'Jesus’ final Passover meal establishing the New Covenant in His broken body and shed blood'],
          ['Gethsemane', 'The garden on the Mount of Olives where Jesus prayed in deep anguish before His arrest'],
          ['Golgotha', '"Place of a Skull", outside Jerusalem where Jesus was crucified between two criminals'],
        ],
        rules: [
          'Simon of Cyrene was compelled by Roman soldiers to carry Jesus’ cross.',
          'At Jesus’ death, the heavy temple curtain tore in two from top to bottom — symbolising direct access to God through Christ.',
          'The Roman centurion watching Jesus die confessed, "Truly this man was the Son of God!"',
        ],
        table: {
          headers: ['Court / authority', 'Charge pressed', 'Outcome'],
          rows: [
            ['Sanhedrin (Caiaphas)', 'Blasphemy (claiming to be the Christ, Son of God)', 'Declared deserving of death, but lacked Roman execution power'],
            ['Pontius Pilate (Roman)', 'Political sedition / claiming to be King of the Jews', 'Found no guilt, yet yielded to the crowd and ordered crucifixion'],
            ['Herod Antipas (Luke)', 'Hoped to see a miracle; mocked Jesus', 'Sent Jesus back to Pilate in a bright robe'],
          ],
          trapNote: 'Pilate washed his hands to claim innocence, yet he remained morally responsible because he knowingly sentenced an innocent man to please the crowd.',
        },
        example: {
          q: 'What is the spiritual significance of the temple curtain tearing from top to bottom at Jesus’ death?',
          steps: [
            ['Recall the curtain’s role', 'It separated ordinary worshippers from the Most Holy Place, entered only once a year by the High Priest'],
            ['Note "from top to bottom"', 'It was God’s own act opening direct access to Himself through Jesus’ sacrifice'],
          ],
        },
        yourTurn: {
          q: 'Why did Jesus choose to ride a young donkey rather than a warhorse during the Triumphal Entry into Jerusalem?',
          o: [
            'To show He came as a humble King of peace in fulfilment of Zechariah’s prophecy',
            'Because horses were forbidden inside Judea',
            'To hide from the crowds altogether',
            'Because Pilate ordered Him to use a donkey',
          ],
          a: 0,
          h: [
            'Think about the contrast between a conquering general on a stallion and a peaceful ruler on a colt.',
            'Old Testament prophecy in Zechariah 9:9 foretold this exact symbol of peace.',
          ],
          e: 'Riding a donkey fulfilled Zechariah 9:9 and declared that Jesus’ kingdom comes through humility and peace, not military force.',
        },
      },
      {
        title: 'Resurrection, Great Commission and Ascension',
        idea: 'On the first day of the week (Sunday), women disciples (including Mary Magdalene) went to the tomb to anoint Jesus’ body, found the stone rolled away, and heard angels declare He had risen. Jesus appeared to Mary Magdalene, two disciples on the road to Emmaus, the disciples behind locked doors (and doubting Thomas), and Peter by the Sea of Galilee. Before ascending into heaven, He gave the Great Commission: go and make disciples of all nations.',
        terms: [
          ['Resurrection', 'Jesus rising bodily from the dead on the third day, validating His victory over sin and death'],
          ['Great Commission', 'Jesus’ command to make disciples of all nations, baptising and teaching them (Matthew 28:18–20)'],
          ['Ascension', 'Jesus’ return to heavenly glory forty days after His resurrection (Acts 1:9–11)'],
        ],
        rules: [
          'Women were the very first witnesses of the empty tomb — strong evidence of historical honesty in an era when women’s testimony was undervalued.',
          'To doubting Thomas, Jesus showed His nail-pierced hands and side; Thomas confessed, "My Lord and my God!"',
          'Jesus promised to remain with His followers always and to send the Holy Spirit to empower their witness.',
        ],
        table: {
          headers: ['Appearance', 'Key detail', 'Lesson'],
          rows: [
            ['Road to Emmaus (Luke 24)', 'Recognised Jesus in the breaking of bread', 'Scripture and fellowship reveal the risen Christ'],
            ['Upper room with Thomas (John 20)', 'Invited Thomas to inspect His wounds', 'Blessed are those who believe without seeing'],
            ['Galilee (Matthew 28)', 'The Great Commission', 'The gospel mission is worldwide for every nation'],
          ],
          trapNote: 'Remember the two disciples walking to Emmaus (one named Cleopas) appear in LUKE’s Gospel, while doubting Thomas appears in JOHN’s Gospel.',
        },
        example: {
          q: 'Why does Paul later say in 1 Corinthians 15 that without the Resurrection, Christian faith would be futile?',
          steps: [
            ['Link death and resurrection', 'If Jesus stayed dead, sin and death would remain undefeated'],
            ['State the assurance', 'His resurrection proves His sacrifice was accepted and guarantees eternal life for believers'],
          ],
        },
        yourTurn: {
          q: 'Who was forced by Roman soldiers to help carry Jesus’ cross on the way to Golgotha?',
          o: ['Simon of Cyrene', 'Joseph of Arimathea', 'Nicodemus', 'Barabbas'],
          a: 0,
          h: [
            'Joseph of Arimathea later asked Pilate for Jesus’ body for burial, so it was not him.',
            'Look for a visitor from North Africa passing by from the countryside.',
          ],
          e: 'Roman soldiers pressed Simon of Cyrene, a traveller from North Africa, to carry Jesus’ cross.',
        },
      },
    ],
    qs: [
      {
        q: 'Which prisoner did the crowd demand Pontius Pilate release instead of Jesus?',
        o: ['Barabbas', 'Barnabas', 'Silas', 'Lazarus'],
        a: 0,
        e: 'The crowd chose Barabbas, a notorious rebel, while demanding Jesus’ crucifixion.',
      },
      {
        q: 'Who donated his own unused rock-cut tomb for the burial of Jesus?',
        o: ['Joseph of Arimathea', 'Simon of Cyrene', 'Caiaphas', 'Zacchaeus'],
        a: 0,
        e: 'Joseph of Arimathea, a respected council member, requested Jesus’ body from Pilate and laid Him in his new tomb.',
      },
      {
        q: 'How did the two disciples on the road to Emmaus finally recognise the risen Jesus?',
        o: [
          'When He took bread, blessed it, broke it and gave it to them',
          'When He walked on the river beside them',
          'When Pilate announced His resurrection',
          'When they saw His robe at the temple gate',
        ],
        a: 0,
        e: 'Their eyes were opened when Jesus blessed and broke bread at the table in Emmaus.',
      },
      {
        q: 'What confession did Thomas make upon seeing the risen Jesus?',
        o: ['"My Lord and my God!"', '"Lord, save me!"', '"Teacher, where do you stay?"', '"Blessed is the King!"'],
        a: 0,
        e: 'Thomas moved from doubt to one of the highest confessions in the Gospels: "My Lord and my God!"',
      },
      {
        q: 'In the Great Commission (Matthew 28:18–20), Jesus commanded His disciples to',
        o: [
          'make disciples of all nations, baptising them and teaching them to obey His commands',
          'stay permanently inside Jerusalem',
          'build a stone monument on Mount Sinai',
          'avoid speaking to Gentiles',
        ],
        a: 0,
        e: 'Jesus sent His followers into all nations with the assurance of His abiding presence.',
      },
      {
        q: 'Which statement best explains why Jesus was tried before both the Sanhedrin and Pontius Pilate?',
        o: [
          'The Jewish council condemned Him on religious grounds but needed the Roman governor’s authority for execution',
          'Pilate was a member of the Sanhedrin',
          'Jesus requested an appeal to Rome immediately',
          'The Sanhedrin had already acquitted Jesus',
        ],
        a: 0,
        e: 'Under Roman rule, the Sanhedrin could not legally carry out capital punishment without the Roman governor’s approval.',
      },
    ],
  },
  {
    id: 'crs-early-church-acts',
    name: 'The early church in Acts and the mission of Peter and Paul',
    sec: 'The Early Church',
    goals: [
      'Describe Pentecost, communal life in the early church, the choice of the seven deacons and Stephen’s martyrdom',
      'Trace the expansion of the gospel to Gentiles through Peter (Cornelius), the Jerusalem Council and Paul’s missionary journeys',
    ],
    trap: 'Do not confuse Philip the EVANGELIST (one of the seven deacons who preached in Samaria and baptised the Ethiopian eunuch) with Philip the Apostle.',
    parts: [
      {
        title: 'Pentecost, community life and the first martyr',
        idea: 'On the Day of Pentecost, the Holy Spirit descended with the sound of a rushing wind and tongues of fire, enabling the apostles to declare God’s mighty works in many languages. Peter preached boldly and about 3,000 believed. Early believers devoted themselves to apostolic teaching, fellowship, breaking bread and sharing generously — though Ananias and Sapphira were judged for lying about their donation. When Greek-speaking (Hellenist) widows were overlooked in daily food distribution, the church chose seven Spirit-filled men (including Stephen and Philip) to serve. Stephen became the first Christian martyr, praying for his killers’ forgiveness while Saul watched.',
        terms: [
          ['Pentecost', 'The outpouring of the Holy Spirit fifty days after Passover, marking the birth of the Church’s global mission'],
          ['The Seven Deacons', 'Seven men of good repute chosen so the apostles could focus on prayer and preaching the word'],
          ['Stephen', 'The first Christian martyr, stoned after his bold speech before the Sanhedrin'],
        ],
        rules: [
          'Ananias and Sapphira’s sin was not keeping part of their money, but lying to the Holy Spirit to appear more generous than they were.',
          'Persecution after Stephen’s death scattered believers from Jerusalem — ironically spreading the gospel into Judea and Samaria.',
          'Philip preached in Samaria and guided an Ethiopian court official reading Isaiah 53 to faith and baptism.',
        ],
        table: {
          headers: ['Early church challenge', 'Wise response / outcome'],
          rows: [
            ['Dishonesty (Ananias & Sapphira)', 'Solemn judgement warned the church to value honesty and reverence'],
            ['Complaint over neglected Hellenist widows', 'Appointed seven capable deacons to ensure fair administration'],
            ['Persecution after Stephen’s martyrdom', 'Scattered believers preached wherever they went, growing the church'],
          ],
          trapNote: 'The seven deacons were NOT forbidden from preaching — both Stephen and Philip preached powerfully alongside their practical service.',
        },
        example: {
          q: 'Why did the apostles ask the Jerusalem congregation to choose seven men of good reputation in Acts 6?',
          steps: [
            ['Identify the problem', 'Hellenist widows were being neglected in the daily food distribution'],
            ['Identify the principle', 'Delegating welfare service freed the apostles to focus on prayer and ministry of the word'],
          ],
        },
        yourTurn: {
          q: 'What was the exact sin of Ananias and Sapphira in Acts 5?',
          o: [
            'Lying to God and the church by pretending they had brought the full price of their land',
            'Refusing to sell their family home',
            'Eating with Gentile converts',
            'Forgetting to attend evening prayer',
          ],
          a: 0,
          h: [
            'Peter reminded Ananias that the land and its money belonged to him freely before he lied.',
            'Their offence was hypocritical deception to win praise.',
          ],
          e: 'Giving was voluntary; Ananias and Sapphira sinned by deliberately lying to the Holy Spirit to appear more generous than they were.',
        },
      },
      {
        title: 'Peter, Cornelius, Paul’s conversion and the Jerusalem Council',
        idea: 'God broke down barriers between Jews and Gentiles through Peter’s vision of the sheet on a rooftop in Joppa, leading him to preach to Roman centurion Cornelius in Caesarea, where the Holy Spirit fell on Gentiles too. Meanwhile, Saul of Tarsus — a fierce persecutor — met the risen Jesus on the road to Damascus, was healed by Ananias, and became Paul, apostle to the Gentiles. With Barnabas and later Silas, Paul planted churches across Asia Minor and Europe (Antioch, Philippi, Corinth, Ephesus). When some insisted Gentile converts must be circumcised, the Jerusalem Council (Acts 15) affirmed salvation by grace through faith alone.',
        terms: [
          ['Cornelius', 'A devout Roman centurion whose household became the first Gentile converts baptised by Peter'],
          ['Road to Damascus', 'Site of Saul’s dramatic conversion when the risen Christ asked, "Saul, Saul, why are you persecuting me?"'],
          ['Jerusalem Council (Acts 15)', 'First church council, led by James, Peter and Paul, confirming Gentiles need not be circumcised to be saved'],
        ],
        rules: [
          'At Antioch in Syria, believers were first called "Christians" (Acts 11:26).',
          'The Jerusalem Council asked Gentile believers only to abstain from food offered to idols, blood, strangled meat and sexual immorality for harmonious fellowship.',
          'At Philippi, Paul and Silas sang hymns in prison at midnight; after an earthquake, they stayed put and led the jailer and his family to faith.',
        ],
        table: {
          headers: ['Milestone', 'Key figures', 'Lasting impact'],
          rows: [
            ['Caesarea (Acts 10)', 'Peter & Cornelius', 'Proved God shows no partiality toward any nation'],
            ['Damascus (Acts 9)', 'Saul & Ananias', 'Turned the church’s fiercest persecutor into its greatest missionary'],
            ['Jerusalem Council (Acts 15)', 'James, Peter, Paul & Barnabas', 'Protected gospel freedom: salvation by grace, not circumcision'],
          ],
          trapNote: 'Do not confuse Ananias of JERUSALEM (the liar in Acts 5) with Ananias of DAMASCUS (the faithful disciple who prayed for Saul’s sight in Acts 9).',
        },
        example: {
          q: 'What did God teach Peter through the vision of clean and unclean animals in Joppa (Acts 10)?',
          steps: [
            ['Recall the voice', '"What God has made clean, do not call common"'],
            ['Apply to people', 'Peter realised he must not treat Gentiles like Cornelius as spiritually unclean'],
          ],
        },
        yourTurn: {
          q: 'In which city were the disciples of Jesus first called "Christians"?',
          o: ['Antioch in Syria', 'Jerusalem', 'Corinth', 'Damascus'],
          a: 0,
          h: [
            'This city became the main sending base for Paul and Barnabas’ missionary journeys.',
            'It is recorded in Acts 11:26.',
          ],
          e: 'Acts 11:26 states that the disciples were first called Christians in Antioch.',
        },
      },
    ],
    qs: [
      {
        q: 'Approximately how many people believed and were baptised after Peter’s sermon on the Day of Pentecost?',
        o: ['3,000', '120', '500', '70'],
        a: 0,
        e: 'Acts 2:41 records that about three thousand souls were added to the church on Pentecost.',
      },
      {
        q: 'Who was the first Christian martyr, stoned while praying that God would not hold the sin against his attackers?',
        o: ['Stephen', 'James', 'Barnabas', 'Silas'],
        a: 0,
        e: 'Stephen echoed Jesus’ forgiving spirit as he was stoned outside Jerusalem.',
      },
      {
        q: 'Which devout Roman officer in Caesarea sent for Peter after seeing an angel in a vision?',
        o: ['Cornelius', 'Pilate', 'Felix', 'Festus'],
        a: 0,
        e: 'Cornelius, a centurion of the Italian Cohort, welcomed Peter and received the gospel with his household.',
      },
      {
        q: 'Which faithful disciple in Damascus was sent by God to lay hands on the blinded Saul?',
        o: ['Ananias', 'Barnabas', 'Timothy', 'Apollos'],
        a: 0,
        e: 'Ananias of Damascus overcame his fear, prayed for Saul’s sight to return, and baptised him.',
      },
      {
        q: 'What central issue was settled at the Jerusalem Council in Acts 15?',
        o: [
          'Whether Gentile converts had to be circumcised and keep the Mosaic law to be saved',
          'Whether the temple should be rebuilt',
          'Who should replace Judas Iscariot',
          'Where Paul should retire',
        ],
        a: 0,
        e: 'The council ruled that Gentiles are saved by God’s grace through faith without requiring circumcision.',
      },
      {
        q: 'What did the Philippian jailer ask Paul and Silas after the midnight earthquake when he saw no prisoner had fled?',
        o: [
          '"Sirs, what must I do to be saved?"',
          '"Where have you hidden the keys?"',
          '"Why did you sing so loudly?"',
          '"Are you citizens of Athens?"',
        ],
        a: 0,
        e: 'Amazed by their integrity and God’s power, the jailer asked how to be saved, and his whole household believed.',
      },
    ],
  },
  {
    id: 'crs-epistles-living',
    name: 'Christian living in the epistles: faith, love, work, authority and hope',
    sec: 'The Epistles',
    goals: [
      'Explain key New Testament teachings on justification by faith, faith working through deeds, spiritual gifts and Christian love',
      'Apply epistle teachings on dignity of labour, civic responsibility, humility and the Second Coming of Christ',
    ],
    trap: 'Paul and James do NOT contradict each other on faith and works: Paul teaches we cannot EARN salvation by dead legalism (Romans 3), while James teaches that genuine saving faith naturally PRODUCES active love and good deeds (James 2).',
    parts: [
      {
        title: 'Faith, works, spiritual gifts and love',
        idea: 'The Epistles (letters to churches and believers) show how gospel truth shapes everyday life. Paul teaches in Romans and Galatians that sinners are justified (declared right with God) by grace through faith in Christ, not by earning merit. James adds that true faith proves itself through practical compassion ("faith by itself, if it does not have works, is dead"). In 1 Corinthians 12–13, Paul compares the church to one body with diverse spiritual gifts, crowned by agape love — patient, kind, unselfish and enduring.',
        terms: [
          ['Justification by faith', 'Being declared righteous before God through trusting Christ’s sacrifice rather than human merit'],
          ['Faith and works (James)', 'Active mercy toward the needy as the visible fruit of genuine living faith'],
          ['Agape love (1 Cor 13)', 'Self-giving, patient, forgiving love — the greatest Christian virtue above faith and hope'],
        ],
        rules: [
          'Spiritual gifts (teaching, healing, service, wisdom) are given by the same Spirit for the common good of the whole church, never for personal boasting.',
          'Without love, even speaking in tongues, prophecy or giving away possessions amounts to nothing.',
          'James warns against favouritism in church — honouring a wealthy visitor in fine clothes while humiliating a poor guest.',
        ],
        table: {
          headers: ['Epistle passage', 'Core focus', 'Everyday application'],
          rows: [
            ['Romans 3–5', 'Justification by faith', 'Humility and peace with God through Christ'],
            ['James 2', 'Faith demonstrated by works', 'Helping neighbours in practical need; avoiding partiality'],
            ['1 Corinthians 12–13', 'One body, many gifts, supreme love', 'Serving others humbly without envy or pride'],
          ],
          trapNote: 'In 1 Corinthians 13:13 ("faith, hope, and love abide, these three"), the GREATEST of the three is love because faith and hope will be fulfilled in heaven while love lasts forever.',
        },
        example: {
          q: 'How can a student reconcile Paul’s teaching in Romans 3:28 with James’ teaching in James 2:17?',
          steps: [
            ['Read Paul’s context', 'Paul opposes trusting human achievement or legal rules to earn God’s favour'],
            ['Read James’ context', 'James opposes empty lip-service that claims faith while ignoring hungry neighbours'],
            ['Unite both', 'Faith alone saves, yet true saving faith is never alone — it produces loving deeds'],
          ],
        },
        yourTurn: {
          q: 'According to 1 Corinthians 13, which of the three enduring Christian virtues — faith, hope and love — is the greatest?',
          o: ['Love', 'Faith', 'Hope', 'Speaking in tongues'],
          a: 0,
          h: [
            'Paul says that even miraculous gifts without this virtue are like a noisy gong.',
            'Recall the closing sentence of 1 Corinthians 13.',
          ],
          e: '1 Corinthians 13:13 concludes: "So now faith, hope, and love abide, these three; but the greatest of these is love."',
        },
      },
      {
        title: 'Dignity of labour, civic authority, humility and Christian hope',
        idea: 'The Epistles call believers to be model citizens and diligent workers. In 2 Thessalonians 3, Paul corrects idle believers waiting lazily for Christ’s return ("If anyone is not willing to work, let him not eat"). In Romans 13 and 1 Peter 2, Christians are urged to respect lawful civic authorities, pay taxes and do good — while obeying God above humans if laws demand sin. Philippians 2 points to Christ’s humility as the pattern for Christian relationships, and 1 Thessalonians 4–5 teaches watchful, hopeful readiness for Christ’s Second Coming.',
        terms: [
          ['Dignity of labour', 'Working honestly to support oneself and help others rather than living off others in idleness'],
          ['Civic responsibility', 'Paying taxes, obeying just laws and praying for leaders (Romans 13; 1 Peter 2)'],
          ['Parousia (Second Coming)', 'Christ’s promised return — sudden like a "thief in the night", calling for sober, daily readiness'],
        ],
        rules: [
          'Paul set a personal example in Thessalonica by working night and day as a tentmaker so he would not burden the young church.',
          'Philippians 2 teaches that Christ humbled Himself to the death of the cross, and therefore God highly exalted Him.',
          'First Peter encourages believers facing unfair suffering to respond with gentleness and good conduct rather than returning evil for evil.',
        ],
        table: {
          headers: ['Theme', 'Key letter', 'Guiding rule'],
          rows: [
            ['Honest work', '2 Thessalonians 3', 'Avoid idleness; earn your own living diligently'],
            ['Civic duty', 'Romans 13; 1 Peter 2', 'Respect lawful authority, pay taxes and live honourably'],
            ['Humility', 'Philippians 2; 1 Peter 5', 'Count others more significant than yourself; God opposes the proud'],
            ['Second Coming', '1 Thessalonians 4–5', 'Comfort one another and stay spiritually alert every day'],
          ],
          trapNote: 'Paul’s rule "if anyone is NOT WILLING to work, let him not eat" rebukes deliberate laziness — NOT people who are sick, elderly or genuinely unable to work.',
        },
        example: {
          q: 'Why did some believers in Thessalonica stop working, and how did Paul correct them?',
          steps: [
            ['Identify the misunderstanding', 'They assumed Christ’s return was so immediate that ordinary jobs no longer mattered'],
            ['State Paul’s correction', 'He reminded them of his own hardworking example and ordered them to work quietly and earn their living'],
          ],
        },
        yourTurn: {
          q: 'In 1 Thessalonians 5, Paul compares the timing of Christ’s Second Coming to "a thief in the night" in order to teach believers to',
          o: [
            'live sober, faithful and spiritually watchful lives at all times',
            'quit their jobs and wait on hilltops',
            'calculate the exact calendar date of the end',
            'live in constant terror of the future',
          ],
          a: 0,
          h: [
            'A thief never sends an appointment card ahead of time.',
            'So the lesson is steady daily readiness rather than panic or date-setting.',
          ],
          e: 'Because the exact time is unannounced, believers are called to stay awake, sober and faithful every day.',
        },
      },
    ],
    qs: [
      {
        q: 'In Paul’s illustration of the church in 1 Corinthians 12, believers with different spiritual gifts are compared to',
        o: [
          'different organs of one human body working together',
          'competing athletes running separate races',
          'isolated islands in the Mediterranean',
          'soldiers serving rival kings',
        ],
        a: 0,
        e: 'Paul compares the church to one body with many interdependent parts, each needed for the health of the whole.',
      },
      {
        q: 'According to James 2, showing special honour to a rich guest while telling a poor guest to sit on the floor is condemned as',
        o: ['partiality (favouritism)', 'hospitality', 'stewardship', 'intercession'],
        a: 0,
        e: 'James warns that partiality toward wealth contradicts faith in Christ.',
      },
      {
        q: 'In Philippians 2, whose example does Paul hold up as the supreme model of humility?',
        o: ['Jesus Christ', 'King Solomon', 'Julius Caesar', 'Gamaliel'],
        a: 0,
        e: 'Paul points to Christ, who emptied Himself, took a servant’s form and obeyed unto death on a cross.',
      },
      {
        q: 'According to Romans 13, Christians ought to pay taxes and respect lawful civic authorities because',
        o: [
          'governing authority is instituted to maintain order and restrain wrongdoing',
          'government officials never make mistakes',
          'churches are exempt from all laws',
          'Christians are forbidden from holding public office',
        ],
        a: 0,
        e: 'Paul teaches that lawful authority serves public order and good conduct, so believers obey for conscience’ sake as well as law.',
      },
      {
        q: 'Paul reminded the Thessalonians of his own dignity of labour by pointing out that he',
        o: [
          'worked night and day to support himself so he would not burden anyone',
          'inherited royal estates in Tarsus',
          'collected heavy fees for every sermon',
          'stopped working once he became an apostle',
        ],
        a: 0,
        e: 'Paul worked diligently with his own hands to model honest self-support.',
      },
      {
        q: 'What comfort did Paul give the Thessalonians concerning believers who had already died before Christ’s return?',
        o: [
          'They will rise first at Christ’s coming and be reunited with living believers forever',
          'They have missed out on eternal life',
          'They must wait a thousand years behind living believers',
          'No one can know anything about life after death',
        ],
        a: 0,
        e: '1 Thessalonians 4:16–17 assures believers that the dead in Christ will rise first and all believers will always be with the Lord.',
      },
    ],
  },
];

export function buildCrsCurriculum() {
  return buildUtmeSubjectCurriculum(CRS_SPECS);
}
