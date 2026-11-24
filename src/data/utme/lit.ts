import { buildUtmeSubjectCurriculum, type UtmeTopicSpec } from './builder';

const LIT_SPECS: UtmeTopicSpec[] = [
  {
    id: 'lit-genres-oral',
    name: 'Literature, its genres and oral literature',
    sec: 'Foundations of literature',
    goals: [
      'Distinguish between the three main genres of literature: drama, prose and poetry',
      'Identify the forms and functions of African oral literature in society',
    ],
    trap: 'Do not confuse "literature" (imaginative writing or oral art) with ordinary factual reports; oral literature is still literature even before it is written down.',
    parts: [
      {
        title: 'Literature and its three main genres',
        idea: 'Literature is creative art expressed through spoken or written words to mirror human life, feelings and society. It is grouped into three main genres: drama (meant to be performed in dialogue and action), prose (continuous everyday sentences arranged in paragraphs) and poetry (compressed, rhythmic lines arranged in stanzas).',
        terms: [
          ['Genre', 'A major class or type of literary work, such as drama, prose or poetry'],
          ['Didactic literature', 'A work designed mainly to teach a moral or social lesson'],
          ['Aesthetic function', 'The pleasure and beauty a reader or listener gets from well-crafted language'],
        ],
        rules: [
          'Drama relies mainly on dialogue and stage directions rather than a narrator.',
          'Prose uses ordinary sentences and paragraphs; it can be fiction (imagined) or non-fiction (real events).',
          'Poetry uses dense imagery, rhythm and line breaks to pack deep meaning into few words.',
        ],
        table: {
          headers: ['Genre', 'Basic unit', 'Main mode of delivery'],
          rows: [
            ['Drama', 'Acts and scenes', 'Performance on stage through dialogue and action'],
            ['Prose', 'Sentences, paragraphs and chapters', 'Continuous narration read silently or aloud'],
            ['Poetry', 'Lines and stanzas', 'Recitation or reading with rhythm and musicality'],
          ],
          trapNote: 'A play written in verse (like some classic tragedies) is still classified as drama because it is structured for stage performance.',
        },
        example: {
          q: 'A student reads an original text containing character names in the margin, dialogue, and brief instructions in brackets telling an actor to walk to a window. Which genre is this?',
          steps: [
            ['Spot the layout clues', 'Speaker names followed by spoken lines show dialogue'],
            ['Spot the bracketed notes', 'Instructions about movement are stage directions'],
            ['Conclude the genre', 'Dialogue plus stage directions define drama'],
          ],
        },
        yourTurn: {
          q: 'Which feature separates drama most clearly from prose fiction?',
          o: [
            'It is built primarily for live performance through dialogue and stage action',
            'It never contains conflict or human characters',
            'It always uses rhyming couplets at the end of every line',
            'It must be based strictly on true historical dates',
          ],
          a: 0,
          h: [
            'Think about how an audience normally experiences a play compared with a novel.',
            'Plays rely on actors speaking and moving rather than a narrator describing paragraphs of thought.',
          ],
          e: 'Drama is designed for performance through dialogue and stage action, whereas prose fiction relies mainly on continuous narration.',
        },
      },
      {
        title: 'African oral literature',
        idea: 'Before writing spread widely, African communities preserved history, wisdom and entertainment through oral literature — spoken or sung art passed down by word of mouth. Oral literature includes folktales, myths, legends, proverbs, riddles, dirges and praise poetry.',
        terms: [
          ['Myth', 'A traditional story explaining creation, gods or why natural things behave as they do'],
          ['Legend', 'A traditional story centred on a heroic human figure whose deeds grow larger with retelling'],
          ['Folktale', 'An imaginative traditional story — often with animal tricksters like the tortoise — told to entertain and teach morals'],
          ['Proverb', 'A short, memorable traditional saying that expresses community wisdom'],
        ],
        rules: [
          'Oral literature is dynamic: each performer adapts voice, gesture and call-and-response to the live audience.',
          'Myths usually involve supernatural beings and origins; legends centre on memorable human heroes.',
          'Dirges mourn the dead, while panegyrics (praise poems) celebrate achievements or lineage.',
        ],
        table: {
          headers: ['Oral form', 'Main subject', 'Everyday social role'],
          rows: [
            ['Myth', 'Origins of the world, death or natural events', 'Explains beliefs and sacred traditions'],
            ['Legend', 'Courageous human ancestors or founders', 'Builds community pride and memory'],
            ['Folktale', 'Clever animals or ordinary villagers', 'Entertains children and teaches good conduct'],
            ['Dirge', 'Loss of a loved one or elder', 'Expresses grief and honours the departed'],
          ],
          trapNote: 'Do not mix up myth and legend: if the story explains how the sky moved far from the earth, it is a myth; if it celebrates a famous warrior who founded a town, it is a legend.',
        },
        example: {
          q: 'An elder tells children a story about why the tortoise has a cracked shell after trying to trick the birds at a feast. What oral form is this?',
          steps: [
            ['Check the characters', 'Talking animals with a trickster figure'],
            ['Check the purpose', 'Entertains while warning against greed'],
            ['Name the form', 'It is a folktale (specifically an aetiological trickster tale)'],
          ],
        },
        yourTurn: {
          q: 'Which statement best distinguishes a legend from a myth?',
          o: [
            'A legend centres on a notable human hero, while a myth usually explains origins through supernatural beings',
            'A legend is always sung in rhyme, while a myth is always acted on stage',
            'A legend is written in modern newspapers, while a myth is found only in science textbooks',
            'A legend never changes during retelling, while a myth has no plot',
          ],
          a: 0,
          h: [
            'Compare who the central character is in each form.',
            'One is rooted in human history and heroism; the other focuses on creation and sacred origins.',
          ],
          e: 'Legends focus on heroic human figures linked to community memory, whereas myths explain cosmic or natural origins through supernatural forces.',
        },
      },
    ],
    qs: [
      {
        q: 'Which of the following is the primary medium of literature?',
        o: ['Language, spoken or written', 'Oil paint and canvas', 'Carved stone and bronze', 'Musical instruments alone'],
        a: 0,
        e: 'Literature is an art form whose primary medium is creative language, whether spoken (oral) or written.',
      },
      {
        q: 'A story told by a village elder to explain how fire first came to human beings is an example of a',
        o: ['myth', 'sonnet', 'farce', 'biography'],
        a: 0,
        e: 'A myth is a traditional narrative explaining the origin of natural or cultural phenomena such as fire or the sky.',
      },
      {
        q: 'Which oral literary form is specifically performed to mourn someone who has died?',
        o: ['Dirge', 'Riddle', 'Lullaby', 'Fable'],
        a: 0,
        e: 'A dirge is a funeral song or chant expressing grief and honouring the dead.',
      },
      {
        q: 'In oral performance, the audience often joins the storyteller with a repeated chorus. This feature is known as',
        o: ['call and response', 'soliloquy', 'blank verse', 'stream of consciousness'],
        a: 0,
        e: 'Call and response invites active audience participation, a hallmark of African oral performance.',
      },
      {
        q: 'A written work whose main aim is to teach a clear moral lesson is described as',
        o: ['didactic', 'lyrical', 'pastoral', 'absurdist'],
        a: 0,
        e: 'Didactic literature intentionally instructs the reader in moral, civic or ethical behaviour.',
      },
      {
        q: 'Why can oral literature vary slightly each time it is performed?',
        o: [
          'The performer adapts tone, gesture and detail to suit each live audience',
          'Oral performers are forbidden from remembering stories',
          'Oral literature has no themes or structure',
          'Only printed books can have a beginning and an ending',
        ],
        a: 0,
        e: 'Because oral literature lives in performance, storytellers reshape pace, phrasing and gestures to engage the audience before them.',
      },
    ],
  },
  {
    id: 'lit-drama-elements',
    name: 'Drama: types and elements',
    sec: 'Drama',
    goals: [
      'Identify major types of drama including tragedy, comedy, tragicomedy, farce and melodrama',
      'Explain key dramatic elements and stage devices such as dialogue, soliloquy, aside and dramatic irony',
    ],
    trap: 'Do not confuse a soliloquy with a monologue or an aside: in a soliloquy the speaker is alone on stage (or believes they are alone), whereas in an aside other characters are on stage but are meant not to hear.',
    parts: [
      {
        title: 'Types of drama',
        idea: 'Plays differ in tone, seriousness and how they end. Tragedy deals with serious suffering and downfall; comedy uses wit and misunderstandings to end happily; tragicomedy blends serious danger with a hopeful resolution; farce uses wildly exaggerated physical comedy; and melodrama relies on sharp contrasts between pure heroes and obvious villains.',
        terms: [
          ['Comedy', 'A play that uses humour, mistaken identity or gentle satire and ends in harmony'],
          ['Tragicomedy', 'A play combining serious tragic tension with comic relief or a happy turn at the end'],
          ['Farce', 'Light comedy built on improbable situations, fast chases and physical exaggeration'],
          ['Melodrama', 'A sensational play with heightened emotions, clear good-versus-evil characters and dramatic twists'],
        ],
        rules: [
          'Comic relief is a short humorous scene inside a serious play to ease tension briefly.',
          'Satirical comedy mocks human greed, hypocrisy or folly to encourage correction.',
          'Mime tells a story purely through body movement and facial expression without spoken words.',
        ],
        table: {
          headers: ['Type of drama', 'Tone', 'Typical ending'],
          rows: [
            ['Tragedy', 'Grave and dignified', 'Catastrophe, loss or death of the hero'],
            ['Comedy', 'Light, witty or playful', 'Reconciliation, celebration or marriage'],
            ['Tragicomedy', 'Mixed suspense and relief', 'Disaster narrowly avoided'],
            ['Farce', 'Boisterous and absurd', 'Chaotic mix-ups untangled in laughter'],
          ],
          trapNote: 'A play with a few funny lines is not automatically a comedy; serious tragedies often use comic relief to make the coming sorrow feel sharper.',
        },
        example: {
          q: 'In an original play, two twin tailors keep entering the wrong shop through opposite doors until their confused customers chase them around a market square. Which type of drama is this?',
          steps: [
            ['Inspect the action', 'Fast-paced mistaken identity and physical chasing'],
            ['Check the tone', 'Exaggerated and wildly improbable purely for laughter'],
            ['Identify the type', 'Farce'],
          ],
        },
        yourTurn: {
          q: 'Why does a playwright insert a brief humorous scene right before a tense climax in a serious play?',
          o: [
            'To provide comic relief that eases tension briefly and heightens the contrast of what follows',
            'To turn the play permanently into a farce',
            'To replace the main plot with a separate story',
            'To show that the playwright forgot the tragic theme',
          ],
          a: 0,
          h: [
            'Think about how an audience feels after long, unbroken tension.',
            'A short moment of laughter lowers the pressure for a second so the next shock hits harder.',
          ],
          e: 'Comic relief temporarily releases emotional tension in a serious play and sharpens the impact of the tragic events that follow.',
        },
      },
      {
        title: 'Elements and stage devices in drama',
        idea: 'Because a play has no narrator speaking between sentences, playwrights reveal secrets and inner thoughts through stage devices: stage directions, dialogue, monologue, soliloquy, aside, prologue, epilogue and dramatic irony.',
        terms: [
          ['Soliloquy', 'A speech delivered by a character alone on stage to reveal private thoughts to the audience'],
          ['Aside', 'A brief remark spoken directly to the audience while other characters on stage are supposed not to hear'],
          ['Dramatic irony', 'A situation in which the audience knows a vital truth that a character on stage does not know'],
          ['Stage directions', 'Italics or bracketed notes guiding movement, lighting, props and tone of voice'],
        ],
        rules: [
          'A monologue is a long speech addressed to other characters on stage; a soliloquy is spoken aloud when alone.',
          'A prologue introduces the setting or background before Act 1; an epilogue offers closing reflections after the final scene.',
          'Props (stage properties) are movable objects actors handle on stage, such as a lantern, letter or walking stick.',
        ],
        table: {
          headers: ['Device', 'Who is listening on stage?', 'Main purpose'],
          rows: [
            ['Dialogue', 'Two or more characters', 'Advances plot and reveals relationships'],
            ['Monologue', 'Other characters present', 'Allows one character to make an extended speech'],
            ['Soliloquy', 'No one else (speaker alone)', 'Exposes hidden plans, doubts or motives'],
            ['Aside', 'Others present, but cannot hear', 'Shares a quick secret comment with the audience'],
          ],
          trapNote: 'If two characters are standing together and one turns slightly toward the audience to whisper a private remark, that is an aside — not a soliloquy.',
        },
        example: {
          q: 'In an original scene, Chief Ojo welcomes his nephew warmly while the audience already saw the nephew hide a forged land deed in his bag. Which device is at work?',
          steps: [
            ['Check what the audience knows', 'The audience knows the nephew is deceitful'],
            ['Check what Chief Ojo knows', 'Chief Ojo trusts him completely'],
            ['Name the device', 'Dramatic irony'],
          ],
        },
        yourTurn: {
          q: 'A character stands alone in a dark courtyard and speaks aloud about her fear of betraying her village. This speech is a',
          o: ['soliloquy', 'chorus', 'epilogue', 'farce'],
          a: 0,
          h: [
            'Notice that the speaker is completely alone on stage.',
            'Which dramatic device lets an isolated character voice private thoughts directly to the audience?',
          ],
          e: 'A soliloquy is a speech delivered by a character alone on stage to reveal inner thoughts and feelings.',
        },
      },
    ],
    qs: [
      {
        q: 'In drama, the written instructions that tell actors how to move, speak or use lighting are called',
        o: ['stage directions', 'footnotes', 'epilogues', 'stanzas'],
        a: 0,
        e: 'Stage directions guide performance details such as entrances, exits, gestures, props and lighting.',
      },
      {
        q: 'When the audience knows a poison is in the cup, but the trusting guest lifts it to drink, the playwright is using',
        o: ['dramatic irony', 'comic relief', 'poetic justice', 'alliteration'],
        a: 0,
        e: 'Dramatic irony occurs when the audience possesses crucial knowledge that a character on stage lacks.',
      },
      {
        q: 'A short comment whispered by an actor to the audience while other actors remain on stage unaware is an',
        o: ['aside', 'prologue', 'elegy', 'allegory'],
        a: 0,
        e: 'An aside is spoken directly to the audience so that other characters present on stage are treated as unable to hear it.',
      },
      {
        q: 'Which type of play relies on exaggerated physical mix-ups and absurd situations purely to provoke laughter?',
        o: ['Farce', 'Tragedy', 'Elegy', 'Pastoral'],
        a: 0,
        e: 'Farce achieves broad comedy through improbable mix-ups, rapid entrances and exits, and physical exaggeration.',
      },
      {
        q: 'A movable object handled by an actor during a performance — such as a ledger or umbrella — is called a',
        o: ['prop', 'motif', 'couplet', 'canto'],
        a: 0,
        e: 'Props (stage properties) are portable items used on stage to support realistic action.',
      },
      {
        q: 'A play that opens with a brief introductory speech explaining the background of a feud begins with a',
        o: ['prologue', 'climax', 'denouement', 'flashback'],
        a: 0,
        e: 'A prologue introduces background facts or themes before the main dramatic action begins.',
      },
    ],
  },
  {
    id: 'lit-tragedy-hero',
    name: 'Tragedy and the tragic hero',
    sec: 'Drama',
    goals: [
      'Explain the classical and modern features of tragedy',
      'Identify hamartia, hubris, peripeteia, anagnorisis and catharsis in dramatic plots',
    ],
    trap: 'Hamartia is not always deliberate wickedness; it can be an error of judgement, stubbornness or excessive pride (hubris) in an otherwise admirable person.',
    parts: [
      {
        title: 'The tragic hero and tragic flaw',
        idea: 'In classical tragedy, the protagonist (tragic hero) is a person of stature and noble potential whose downfall results partly from fate or circumstance and partly from a flaw or error of judgement called hamartia. Because the hero is neither completely evil nor completely blameless, the audience feels both pity and fear.',
        terms: [
          ['Hamartia', 'The tragic flaw or fatal error of judgement that sets the hero’s downfall in motion'],
          ['Hubris', 'Excessive pride or arrogance that makes a hero ignore wise warnings'],
          ['Nemesis', 'The unavoidable consequence or retribution that follows hubris'],
        ],
        rules: [
          'A purely wicked villain falling does not create true tragedy because the audience feels relief rather than pity.',
          'A hero who falls purely by random accident feels senseless; hamartia links the hero’s own choices to the catastrophe.',
          'Modern tragedy can feature an ordinary person (such as a fisherman or schoolteacher) whose dignity and choices still carry deep weight.',
        ],
        table: {
          headers: ['Concept', 'Plain meaning', 'Example in an original plot'],
          rows: [
            ['Hamartia', 'Fatal error or character weakness', 'A respected judge rushes a verdict without checking a key witness'],
            ['Hubris', 'Blinding overconfidence or pride', 'A captain refuses to lower sails despite clear storm warnings'],
            ['Nemesis', 'Inevitable payback', 'The storm wrecks the ship and costs the captain his crew'],
          ],
          trapNote: 'Hubris is one specific kind of hamartia (excessive pride), so not every hamartia is pride — rash anger or blind trust can also be hamartia.',
        },
        example: {
          q: 'An honourable village chief ignores three scouts who warn that the bridge planks are rotten, insisting his reputation demands he cross first. The bridge collapses. Which tragic concept does his refusal best show?',
          steps: [
            ['Spot the motive', 'He ignores clear warnings out of excessive pride in his reputation'],
            ['Match the term', 'Excessive pride that blinds a leader to danger is hubris'],
          ],
        },
        yourTurn: {
          q: 'Why does a tragic hero normally possess both admirable qualities and a human weakness?',
          o: [
            'So the audience respects the hero yet understands how their own choices help trigger the downfall',
            'So the play can end with a cheerful wedding celebration',
            'Because plays are forbidden from having minor characters',
            'So the audience laughs whenever the hero makes a mistake',
          ],
          a: 0,
          h: [
            'Consider what emotions tragedy aims to stir in the audience: pity and fear.',
            'We feel pity for someone admirable, and fear because a believable human weakness could trip anyone.',
          ],
          e: 'Combining nobility with a believable flaw makes the downfall moving and meaningful rather than merely accidental or purely villainous.',
        },
      },
      {
        title: 'Reversal, recognition and catharsis',
        idea: 'As tragedy unfolds, three key moments shape the audience’s experience: peripeteia (a sudden reversal of fortune), anagnorisis (the moment the hero finally recognises the painful truth) and catharsis (the emotional cleansing of pity and fear felt by the audience at the end).',
        terms: [
          ['Peripeteia', 'A sudden turning point where the hero’s fortune shifts from success to ruin'],
          ['Anagnorisis', 'The moment of painful self-discovery when ignorance turns into knowledge'],
          ['Catharsis', 'The release and cleansing of intense pity and fear experienced by the audience'],
          ['Catastrophe', 'The final disastrous resolution of a tragedy'],
        ],
        rules: [
          'Peripeteia often arrives right when the hero believes a plan has succeeded.',
          'Anagnorisis usually comes too late to stop the catastrophe, which deepens the tragedy.',
          'Catharsis happens in the audience — it leaves viewers sobered and emotionally cleansed, not merely depressed.',
        ],
        table: {
          headers: ['Stage', 'Who experiences it?', 'What happens?'],
          rows: [
            ['Peripeteia', 'The hero and plot', 'Good fortune abruptly flips into disaster'],
            ['Anagnorisis', 'The hero', 'Sees the truth about their own error or hidden identity'],
            ['Catharsis', 'The audience', 'Feels a purging release of pity and fear'],
          ],
          trapNote: 'Remember the difference: anagnorisis is what the hero realises; catharsis is the emotional release felt by the audience.',
        },
        example: {
          q: 'At the close of an original play, a merchant realises too late that the stranger he banished from his town was his own long-lost son. Which term describes this moment of discovery?',
          steps: [
            ['Identify what changes', 'The merchant moves from ignorance to painful truth'],
            ['Name the term', 'Anagnorisis (recognition)'],
          ],
        },
        yourTurn: {
          q: 'Which term refers specifically to the emotional purging of pity and fear felt by the audience at the end of a tragedy?',
          o: ['Catharsis', 'Hubris', 'Peripeteia', 'Satire'],
          a: 0,
          h: [
            'Look for the term describing the effect of tragedy on the spectators rather than on the hero alone.',
            'It comes from a Greek word meaning cleansing or purging.',
          ],
          e: 'Catharsis is the emotional cleansing or release of pity and fear experienced by the audience at the close of a tragedy.',
        },
      },
    ],
    qs: [
      {
        q: 'A tragic hero’s fatal error of judgement or weakness is called',
        o: ['hamartia', 'catharsis', 'epilogue', 'euphemism'],
        a: 0,
        e: 'Hamartia is the tragic flaw or error of judgement that leads a tragic hero toward downfall.',
      },
      {
        q: 'Excessive pride that leads a powerful character to dismiss wise counsel is known as',
        o: ['hubris', 'pathos', 'diction', 'metre'],
        a: 0,
        e: 'Hubris is overbearing pride or arrogance that invites downfall.',
      },
      {
        q: 'A sudden reversal in which a hero’s expected triumph turns into disaster is called',
        o: ['peripeteia', 'exposition', 'allusion', 'soliloquy'],
        a: 0,
        e: 'Peripeteia is the sharp reversal of fortune in a tragic plot.',
      },
      {
        q: 'The moment a tragic character finally recognises the hidden truth about their mistake is',
        o: ['anagnorisis', 'farce', 'alliteration', 'pastoral'],
        a: 0,
        e: 'Anagnorisis is the moment of recognition or discovery when ignorance gives way to truth.',
      },
      {
        q: 'Which statement is true of modern tragedy compared with ancient classical tragedy?',
        o: [
          'Modern tragedy can centre on an ordinary citizen rather than a king or noble',
          'Modern tragedy must always end happily',
          'Modern tragedy never uses conflict',
          'Modern tragedy forbids dialogue on stage',
        ],
        a: 0,
        e: 'While classical tragedy centred on royal or noble figures, modern tragedy shows that ordinary people can also face profound tragic choices.',
      },
      {
        q: 'In tragedy, the final disastrous event that resolves the main conflict is the',
        o: ['catastrophe', 'prologue', 'comic relief', 'chorus'],
        a: 0,
        e: 'Catastrophe is the final tragic resolution of the plot, often marked by grave loss or death.',
      },
    ],
  },
  {
    id: 'lit-prose-pov',
    name: 'Prose fiction: forms and point of view',
    sec: 'Prose',
    goals: [
      'Distinguish between the novel, novella, short story, fable, allegory, biography and autobiography',
      'Identify first-person, third-person limited and third-person omniscient points of view',
    ],
    trap: 'Do not confuse the author with the narrator: even when a novel uses "I", the speaker is a created character (the persona or first-person narrator), not necessarily the writer.',
    parts: [
      {
        title: 'Forms of prose (fiction and non-fiction)',
        idea: 'Prose uses continuous sentences and paragraphs. Fiction springs from imagination — ranging from a tight short story focusing on one key incident, through a novella, to a full-length novel with multiple subplots. Non-fiction recounts real lives and ideas, including biography, autobiography, memoir and essays.',
        terms: [
          ['Novel', 'An extended fictional prose narrative exploring characters, setting and multiple linked events'],
          ['Short story', 'A brief fictional narrative focused tightly on a single conflict or turning point'],
          ['Allegory', 'A narrative whose characters and events carry a second, deeper moral or political meaning'],
          ['Autobiography', 'The account of a person’s own life written by that same person'],
        ],
        rules: [
          'A biography is written by someone else about a real person; an autobiography is written by the subject themselves.',
          'A novella sits between a short story and a novel in length and scope.',
          'An epistolary novel tells its story through a sequence of letters or diary entries.',
        ],
        table: {
          headers: ['Prose form', 'Fiction or non-fiction?', 'Key feature'],
          rows: [
            ['Novel', 'Fiction', 'Long scope with several settings and subplots'],
            ['Short story', 'Fiction', 'Compressed length aiming at one sharp effect'],
            ['Fable', 'Fiction', 'Brief tale, often with animals, ending in a clear moral'],
            ['Biography', 'Non-fiction', 'Life story written by another writer'],
            ['Autobiography', 'Non-fiction', 'Life story written by the person who lived it'],
          ],
          trapNote: 'An autobiography uses "I" because the writer is telling their own true life; a first-person novel also uses "I", yet remains fiction.',
        },
        example: {
          q: 'A writer publishes a book made entirely of imagined letters exchanged between two cousins living in Lagos and Kano. What form of novel is this?',
          steps: [
            ['Check whether it is real or imagined', 'Imagined characters → fiction (novel)'],
            ['Check the narrative format', 'Told purely through letters → epistolary novel'],
          ],
        },
        yourTurn: {
          q: 'Which prose form tells the true life story of a renowned scientist written by a journalist?',
          o: ['Biography', 'Autobiography', 'Fable', 'Epistolary novel'],
          a: 0,
          h: [
            'Notice that the writer and the subject are two different people.',
            'Non-fiction about another real person’s life has a specific name without "auto-".',
          ],
          e: 'A biography is a factual account of someone’s life written by another author; an autobiography is written by the subject themselves.',
        },
      },
      {
        title: 'Narrative point of view',
        idea: 'Point of view is the angle from which a story is told. A first-person narrator ("I", "we") is a character inside the story with a personal, sometimes biased view. A third-person omniscient narrator ("he", "she", "they") knows every character’s thoughts and hidden motives, whereas a third-person limited narrator follows the thoughts of just one character closely.',
        terms: [
          ['First-person narrator', 'A participant inside the story who tells events using "I" or "we"'],
          ['Omniscient narrator', 'An all-knowing outside voice who can enter any character’s mind and move across time and place'],
          ['Third-person limited', 'An outside narrator who sticks closely to one character’s perspective and inner thoughts'],
          ['Unreliable narrator', 'A narrator whose bias, youth or self-deception makes the reader question their version of events'],
        ],
        rules: [
          'Check pronouns first ("I/my" vs "he/she/they"), then check whose inner thoughts are revealed.',
          'First-person narration creates closeness and intimacy, but limits what the narrator can witness.',
          'Second-person narration ("you") places the reader inside the action, though it is rare in novels.',
        ],
        table: {
          headers: ['Point of view', 'Pronouns', 'Access to minds'],
          rows: [
            ['First-person', 'I, me, we', 'Only the narrator’s own mind'],
            ['Third-person limited', 'He, she, they', 'One chosen character’s mind'],
            ['Third-person omniscient', 'He, she, they', 'Any character’s thoughts, past or future'],
          ],
          trapNote: 'Seeing "I" inside quotation marks (dialogue) does not make a story first-person — check the narration outside the speech marks.',
        },
        example: {
          q: 'Read this original line: "Tunde smiled at his sister, hiding his worry about the school fees, while she quietly wondered why his eyes looked so tired." Which point of view is used?',
          steps: [
            ['Check the pronouns', 'Uses "his" and "she" → third-person'],
            ['Check whose minds we enter', 'We see inside both Tunde’s mind and his sister’s mind'],
            ['Conclude', 'Third-person omniscient point of view'],
          ],
        },
        yourTurn: {
          q: 'In an original passage, the narration uses "he" throughout, reveals only Musa’s unspoken fears, and never tells us what other characters are thinking. This is',
          o: [
            'third-person limited point of view',
            'first-person point of view',
            'third-person omniscient point of view',
            'dramatic monologue',
          ],
          a: 0,
          h: [
            'The pronoun "he" rules out first-person narration.',
            'Since the narrator enters only one character’s mind instead of everyone’s, is it limited or omniscient?',
          ],
          e: 'Third-person limited uses third-person pronouns while restricting inner access to one character’s perspective.',
        },
      },
    ],
    qs: [
      {
        q: 'Which prose form is typically brief, focused on a single crucial conflict and built for one unified impression?',
        o: ['Short story', 'Epic', 'Autobiography', 'Travelogue'],
        a: 0,
        e: 'A short story is compact and concentrates on one central incident or turning point.',
      },
      {
        q: 'A story in which characters and events systematically stand for abstract moral or political ideas is an',
        o: ['allegory', 'anecdote', 'epilogue', 'elegy'],
        a: 0,
        e: 'An allegory operates on two levels: a surface narrative and a sustained symbolic moral or political meaning.',
      },
      {
        q: 'Read this original line: "I locked the gate twice, convinced that no one had followed me down the lane." What point of view is this?',
        o: ['First-person', 'Third-person omniscient', 'Third-person objective', 'Second-person'],
        a: 0,
        e: 'The use of "I" and "me" in the narration marks the first-person point of view.',
      },
      {
        q: 'An advantage of the third-person omniscient narrator is that the storyteller can',
        o: [
          'reveal the private thoughts and motives of several different characters',
          'avoid describing any setting or background',
          'speak only through stage directions',
          'prevent the reader from knowing anything outside one room',
        ],
        a: 0,
        e: 'An omniscient narrator has full freedom to move between minds, places and moments in time.',
      },
      {
        q: 'When a narrator misreads clues out of vanity so the reader spots the truth before the narrator does, the narrator is described as',
        o: ['unreliable', 'omniscient', 'didactic', 'objective'],
        a: 0,
        e: 'An unreliable narrator’s bias, naivety or dishonesty forces the reader to read between the lines.',
      },
      {
        q: 'A true account of a retired teacher’s childhood written by herself is an',
        o: ['autobiography', 'allegory', 'fable', 'novella'],
        a: 0,
        e: 'An autobiography is a person’s own written account of their real life.',
      },
    ],
  },
  {
    id: 'lit-plot-character',
    name: 'Plot, conflict and characterisation',
    sec: 'Prose',
    goals: [
      'Trace the structure of a plot and recognise techniques like flashback, foreshadowing and suspense',
      'Distinguish between character types (protagonist, antagonist, foil, flat, round, static, dynamic) and methods of characterisation',
    ],
    trap: 'Do not confuse plot with story: a story is just events in time order ("the king died, then the queen died"), whereas plot shows cause and effect ("the king died, and the queen died of grief").',
    parts: [
      {
        title: 'Plot structure, conflict and narrative devices',
        idea: 'Plot is the causal arrangement of events driven by conflict — a struggle between opposing forces. Classic plot movement passes through exposition, rising action, climax, falling action and resolution (denouement). Writers also shape time and tension using flashback, foreshadowing, in medias res and suspense.',
        terms: [
          ['Exposition', 'The opening section that introduces characters, setting and the initial situation'],
          ['Climax', 'The peak moment of tension where the main conflict reaches its decisive turning point'],
          ['Denouement', 'The untangling or final resolution of the plot after the climax'],
          ['Foreshadowing', 'Subtle early hints that prepare the reader for a later event'],
        ],
        rules: [
          'Conflict can be external (character vs character, society or nature) or internal (character vs conscience or fear).',
          'A flashback interrupts the present timeline to show an earlier event that explains current behaviour.',
          'Starting in medias res means opening right in the middle of exciting action before explaining earlier events.',
        ],
        table: {
          headers: ['Device', 'Direction in time', 'Effect on the reader'],
          rows: [
            ['Flashback', 'Looks backward to an earlier event', 'Explains hidden motives or past trauma'],
            ['Foreshadowing', 'Hints forward at what is coming', 'Builds dread, anticipation and unity'],
            ['Suspense', 'Holds back the outcome in the present', 'Keeps the reader anxious to turn the page'],
            ['In medias res', 'Starts mid-action', 'Hooks attention immediately'],
          ],
          trapNote: 'Foreshadowing gives a hint of the future; flashback returns to the past. Check whether the scene jumps backward or drops a clue about what lies ahead.',
        },
        example: {
          q: 'Early in an original story, a boy notices a single loose bolt on his bicycle brake and shrugs it off. Three chapters later, the brake fails on a steep hill. Which technique did the writer use in chapter one?',
          steps: [
            ['Identify the clue', 'The loose bolt noticed early on'],
            ['Identify the later payoff', 'Brake failure on the steep hill'],
            ['Name the technique', 'Foreshadowing'],
          ],
        },
        yourTurn: {
          q: 'A student torn between reporting a friend who cheated and staying loyal to their friendship is facing which type of conflict?',
          o: [
            'Internal conflict (character against self)',
            'External conflict (character against nature)',
            'Chronological flashback',
            'Poetic justice',
          ],
          a: 0,
          h: [
            'Where is the struggle taking place — outdoors in a storm, or inside the student’s own mind and conscience?',
            'A struggle between two competing values inside one character has a clear label.',
          ],
          e: 'A moral dilemma inside one character’s mind is an internal conflict (character versus self).',
        },
      },
      {
        title: 'Character types and characterisation',
        idea: 'Characterisation is how a writer builds believable people — directly (telling us traits outright) or indirectly (showing speech, actions, thoughts, appearance and other characters’ reactions). Characters can be round or flat, dynamic or static, and serve roles like protagonist, antagonist or foil.',
        terms: [
          ['Protagonist', 'The central character whose goals drive the main plot'],
          ['Antagonist', 'The person or force opposing the protagonist'],
          ['Foil', 'A character placed beside another so their contrasting traits stand out sharply'],
          ['Round vs flat character', 'A round character is complex and lifelike; a flat character is built around one simple trait'],
        ],
        rules: [
          'A dynamic character changes significantly through the events of the story; a static character stays basically the same.',
          'Indirect characterisation ("show, don’t tell") lets readers infer personality from actions and dialogue.',
          'A stock character is a familiar stereotype, such as the greedy landlord or boastful coward.',
        ],
        table: {
          headers: ['Pair', 'First type', 'Second type'],
          rows: [
            ['Depth', 'Round: multi-layered, surprises believably', 'Flat: one-dimensional, built on one trait'],
            ['Change', 'Dynamic: grows or changes inside the story', 'Static: remains unchanged from start to end'],
            ['Role', 'Protagonist: central figure of the conflict', 'Antagonist: main opposing force'],
          ],
          trapNote: 'A protagonist does not have to be morally perfect, and an antagonist does not have to be a person — a drought or unjust law can serve as an antagonist.',
        },
        example: {
          q: 'In an original novel, cautious, soft-spoken Amina shares a room with loud, impulsive Zainab so the reader notices Amina’s quiet discipline even more clearly. What role does Zainab play toward Amina?',
          steps: [
            ['Spot the relationship', 'Two contrasting personalities placed side by side'],
            ['Check the effect', 'Zainab’s impulsiveness highlights Amina’s discipline'],
            ['Name the character role', 'A foil'],
          ],
        },
        yourTurn: {
          q: 'A proud trader who starts a story refusing to help neighbours, suffers a fire, and becomes generous and humble by the final chapter is best described as a',
          o: ['dynamic character', 'static character', 'stock character', 'chorus'],
          a: 0,
          h: [
            'Ask whether the character’s inner attitude changes meaningfully across the plot.',
            'Which term describes a character who undergoes real inner development?',
          ],
          e: 'A dynamic character undergoes significant internal change as a result of the story’s events.',
        },
      },
    ],
    qs: [
      {
        q: 'In plot structure, the point of highest tension where the central conflict turns decisively is the',
        o: ['climax', 'exposition', 'setting', 'prologue'],
        a: 0,
        e: 'The climax is the peak of dramatic tension and turning point of the main conflict.',
      },
      {
        q: 'When a narrative breaks away from the present scene to recount an event from ten years earlier, the device is',
        o: ['flashback', 'foreshadowing', 'denouement', 'irony'],
        a: 0,
        e: 'A flashback inserts an earlier incident into the current narrative timeline.',
      },
      {
        q: 'A character whose main purpose is to highlight another character’s qualities through sharp contrast is a',
        o: ['foil', 'narrator', 'protagonist', 'eponymous hero'],
        a: 0,
        e: 'A foil contrasts with another character so key traits stand out clearly.',
      },
      {
        q: 'A character who displays only one predictable trait throughout a story and never changes is',
        o: ['flat and static', 'round and dynamic', 'tragic and omniscient', 'symbolic and lyrical'],
        a: 0,
        e: 'A flat character has one simple trait, and a static character undergoes no internal change.',
      },
      {
        q: 'Instead of saying "Musa was kind", a writer shows Musa quietly paying a stranger’s bus fare. This is',
        o: ['indirect characterisation', 'direct exposition', 'dramatic irony', 'pathetic fallacy'],
        a: 0,
        e: 'Indirect characterisation reveals personality through actions, speech and choices rather than blunt labels.',
      },
      {
        q: 'Opening a story abruptly in the middle of a heated chase before giving background details is called starting',
        o: ['in medias res', 'at the denouement', 'with an epilogue', 'in a soliloquy'],
        a: 0,
        e: 'In medias res means starting right in the middle of ongoing action.',
      },
    ],
  },
  {
    id: 'lit-poetry-forms',
    name: 'Poetry: forms and stanzas',
    sec: 'Poetry',
    goals: [
      'Identify major poetic forms: lyric, sonnet, elegy, ode, ballad, epic and pastoral',
      'Recognise common stanza types and distinguish between rhymed verse, blank verse and free verse',
    ],
    trap: 'Do not confuse blank verse with free verse: blank verse has a regular rhythm (usually iambic pentameter) without rhyme, whereas free verse has neither regular rhyme nor a fixed metrical beat.',
    parts: [
      {
        title: 'Major forms of poetry',
        idea: 'Poems are grouped by subject, length and tone. A lyric expresses personal feeling; an elegy mourns the dead; an ode addresses and praises a person, object or idea with dignity; a ballad tells a dramatic story in song-like stanzas; an epic is a long narrative poem celebrating heroic deeds; and a sonnet is a tightly structured 14-line poem.',
        terms: [
          ['Sonnet', 'A 14-line lyric poem with a set rhyme scheme — commonly Petrarchan (8 + 6 lines) or Shakespearean (three quatrains + a closing couplet)'],
          ['Elegy', 'A solemn, reflective poem mourning someone who has died'],
          ['Ode', 'A dignified lyric poem directly addressing and praising a noble subject'],
          ['Ballad', 'A narrative poem in short song-like stanzas that tells a vivid story, often with a refrain'],
        ],
        rules: [
          'Petrarchan (Italian) sonnet divides into an octave (8 lines) and a sestet (6 lines), with a turn (volta) at line 9.',
          'Shakespearean (English) sonnet has three quatrains (ABAB CDCD EFEF) and a final rhyming couplet (GG).',
          'Pastoral poetry idealises quiet rural life, shepherds and countryside landscapes.',
        ],
        table: {
          headers: ['Poetic form', 'Core purpose', 'Signature clue'],
          rows: [
            ['Sonnet', 'Compact argument or emotion', 'Exactly 14 lines with a clear turn (volta)'],
            ['Elegy', 'Grief and remembrance', 'Mourns loss and moves toward quiet acceptance'],
            ['Ode', 'Elevated praise', 'Direct address ("O bright morning sun...")'],
            ['Ballad', 'Storytelling in song', 'Short narrative stanzas, simple dialogue and refrain'],
            ['Epic', 'Heroic national or mythic tale', 'Grand scale, elevated style and heroic journeys'],
          ],
          trapNote: 'A lament over a dead friend is an elegy, not an ode — even if it praises the friend’s virtues while mourning.',
        },
        example: {
          q: 'An original poem has 14 lines rhyming ABAB CDCD EFEF GG and ends with a punchy two-line summary. Which exact poetic form is this?',
          steps: [
            ['Count the lines', '14 lines → sonnet'],
            ['Check the rhyme pattern', 'Three quatrains + final rhyming couplet (GG)'],
            ['Name the exact subtype', 'Shakespearean (English) sonnet'],
          ],
        },
        yourTurn: {
          q: 'Which poetic form tells a dramatic folk story in short, musical stanzas often featuring a repeated refrain?',
          o: ['Ballad', 'Elegy', 'Pastoral', 'Limerick'],
          a: 0,
          h: [
            'Look for a narrative poem rooted in folk song rather than solemn mourning.',
            'Its stanzas are short and often repeat a chorus-like refrain.',
          ],
          e: 'A ballad is a narrative poem composed in short, musical stanzas, frequently with dialogue and a refrain.',
        },
      },
      {
        title: 'Stanzas, blank verse and free verse',
        idea: 'Just as prose groups sentences into paragraphs, poetry groups lines into stanzas: couplet (2), tercet (3), quatrain (4), sestet (6) and octave (8). Poems also vary in how strictly they follow rhyme and beat.',
        terms: [
          ['Couplet', 'Two successive lines of verse, usually rhyming and of the same length'],
          ['Quatrain', 'A four-line stanza, the most common stanza unit in English poetry'],
          ['Blank verse', 'Unrhymed lines written in a regular metrical beat (typically iambic pentameter)'],
          ['Free verse', 'Poetry with no fixed rhyme scheme and no regular metrical pattern'],
        ],
        rules: [
          'Enjambment (run-on lines) occurs when a sentence flows across a line break without punctuation at the end of the line.',
          'An end-stopped line ends with clear punctuation such as a full stop, comma or question mark.',
          'A refrain is a line or group of lines repeated at intervals to build rhythm and emphasis.',
        ],
        table: {
          headers: ['Verse type', 'Regular rhyme?', 'Regular metre (beat)?'],
          rows: [
            ['Rhymed metrical verse', 'Yes', 'Yes'],
            ['Blank verse', 'No', 'Yes'],
            ['Free verse', 'No', 'No'],
          ],
          trapNote: 'Remember the word "blank" means "empty of rhyme", NOT empty of rhythm — blank verse still keeps a steady beat.',
        },
        example: {
          q: 'Read these original lines:\n"The harmattan sweeps softly through the street\nWithout a rhyme, yet keeping steady beat."\nActually wait — those two lines rhyme (street/beat)! What if they read:\n"The harmattan sweeps softly through the lane\nAnd dusts the mango leaves with silver ash"?',
          steps: [
            ['Check the end words', '"lane" and "ash" do not rhyme'],
            ['Count the steady alternating beat', 'Five da-DUM beats per line (iambic pentameter)'],
            ['Classify the verse', 'Unrhymed with regular metre → blank verse'],
          ],
        },
        yourTurn: {
          q: 'What is the main difference between blank verse and free verse?',
          o: [
            'Blank verse follows a regular metrical rhythm without rhyme, while free verse follows neither regular metre nor rhyme',
            'Blank verse has no words on every second line',
            'Free verse must always contain 14 lines',
            'Blank verse always uses end rhyme in couplets',
          ],
          a: 0,
          h: [
            'Compare both rhyme AND rhythm (metre) in the two verse styles.',
            'Both skip regular end rhyme, so the difference lies in whether the beat stays regular.',
          ],
          e: 'Blank verse is unrhymed but keeps a regular metre (usually iambic pentameter), whereas free verse avoids both regular rhyme and fixed metre.',
        },
      },
    ],
    qs: [
      {
        q: 'A poem of fourteen lines arranged into an octave and a sestet is a',
        o: ['Petrarchan sonnet', 'Shakespearean sonnet', 'ballad', 'limerick'],
        a: 0,
        e: 'A Petrarchan (Italian) sonnet consists of an eight-line octave followed by a six-line sestet.',
      },
      {
        q: 'A four-line stanza in poetry is called a',
        o: ['quatrain', 'couplet', 'tercet', 'octave'],
        a: 0,
        e: 'A quatrain is a stanza consisting of four lines.',
      },
      {
        q: 'Which poetic form is a solemn poem mourning the loss of a loved one?',
        o: ['Elegy', 'Ode', 'Epigram', 'Farce'],
        a: 0,
        e: 'An elegy expresses sorrow and meditation over death or serious loss.',
      },
      {
        q: 'When a grammatical sentence continues smoothly from the end of one poetic line into the next without punctuation, the poet is using',
        o: ['enjambment', 'caesura', 'onomatopoeia', 'refrain'],
        a: 0,
        e: 'Enjambment (run-on line) carries sense and syntax across a line break without pausing punctuation.',
      },
      {
        q: 'Unrhymed poetry written in a regular metrical rhythm is known as',
        o: ['blank verse', 'free verse', 'prose fiction', 'heroic couplet'],
        a: 0,
        e: 'Blank verse omits end rhyme while keeping a consistent metrical beat.',
      },
      {
        q: 'A poem that celebrates peaceful countryside life and shepherds is described as',
        o: ['pastoral', 'epic', 'satirical', 'didactic'],
        a: 0,
        e: 'Pastoral poetry idealises rural life, nature and simple country living.',
      },
    ],
  },
  {
    id: 'lit-rhythm-sound',
    name: 'Rhythm, metre, rhyme and sound devices',
    sec: 'Poetry',
    goals: [
      'Identify rhyme schemes and basic metrical patterns (rhythm, foot, iamb, caesura)',
      'Recognise sound devices: alliteration, assonance, consonance, onomatopoeia and repetition',
    ],
    trap: 'Do not judge rhyme or alliteration by spelling alone — judge by SOUND. "Know" and "new" alliterate (/n/), while "cat" and "city" do not (/k/ vs /s/).',
    parts: [
      {
        title: 'Rhythm, metre and rhyme schemes',
        idea: 'Rhythm is the natural rise and fall of stressed and unstressed syllables in speech. When a poet arranges stressed and unstressed beats into a repeating pattern, that measured rhythm is called metre. Rhyme matches ending sounds at the close of lines (end rhyme) or inside a single line (internal rhyme).',
        terms: [
          ['Metre', 'A regular pattern of stressed and unstressed syllables arranged in units called feet'],
          ['Iamb', 'A two-syllable foot with an unstressed syllable followed by a stressed one (da-DUM, as in "a-WAY")'],
          ['Rhyme scheme', 'The pattern of end rhymes in a stanza labelled with letters such as ABAB or AABB'],
          ['Caesura', 'A deliberate pause inside a line of poetry, often marked by a comma, dash or full stop'],
        ],
        rules: [
          'Label the first end sound "A"; every later line ending with the same sound also gets "A"; the next new sound gets "B", and so on.',
          'Iambic pentameter has five iambs (ten syllables) per line: da-DUM da-DUM da-DUM da-DUM da-DUM.',
          'Half rhyme (slant rhyme) matches similar but not exact ending sounds (e.g., "wind" and "sand").',
        ],
        table: {
          headers: ['Pattern', 'Letters', 'Feel of the stanza'],
          rows: [
            ['Alternate rhyme', 'ABAB', 'Balanced and flowing'],
            ['Couplet rhyme', 'AABB', 'Crisp, paired and musical'],
            ['Enclosed rhyme', 'ABBA', 'Framed and reflective'],
            ['Internal rhyme', 'Mid-line + end-line', 'Quickens pace inside a single line'],
          ],
          trapNote: 'Eye rhyme ("love" and "move") looks identical on paper but does not sound the same when read aloud.',
        },
        example: {
          q: 'Find the rhyme scheme of this original stanza:\n"The morning bells begin to chime,\nAcross the mist-grey river bend;\nWe walk the path of quiet time,\nWhere dusty village alleys end."',
          steps: [
            ['Line 1 ends with "chime"', 'Label A'],
            ['Line 2 ends with "bend"', 'New sound → Label B'],
            ['Line 3 ends with "time"', 'Rhymes with chime → Label A'],
            ['Line 4 ends with "end"', 'Rhymes with bend → Label B → Scheme is ABAB'],
          ],
        },
        yourTurn: {
          q: 'What is the rhyme scheme of this original stanza?\n"Bright lanterns glow along the quay,\nWarm ginger steams in earthen bowls,\nWhile night winds soothe our weary souls,\nAnd tides creep softly from the sea."',
          o: ['ABBA', 'ABAB', 'AABB', 'ABCD'],
          a: 0,
          h: [
            'Compare the sound of line 1 ("quay") with line 4 ("sea").',
            'Then compare lines 2 ("bowls") and 3 ("souls") in the middle.',
          ],
          e: '"Quay" rhymes with "sea" (A) and "bowls" rhymes with "souls" (B), giving an enclosed rhyme scheme of ABBA.',
        },
      },
      {
        title: 'Sound devices in poetry',
        idea: 'Poets choose sounds deliberately to create music, speed, calm or harshness. Alliteration repeats opening consonant sounds; assonance repeats internal vowel sounds; consonance repeats consonant sounds anywhere in nearby words; and onomatopoeia uses words that imitate real-world sounds.',
        terms: [
          ['Alliteration', 'Repetition of the same initial consonant sound in nearby words (e.g., "silent silver stream")'],
          ['Assonance', 'Repetition of identical or similar vowel sounds inside nearby words (e.g., "slow boats float home")'],
          ['Consonance', 'Repetition of consonant sounds in the middle or end of nearby words (e.g., "blank clock struck")'],
          ['Onomatopoeia', 'Words whose sound imitates the noise they name (e.g., "hiss", "clatter", "buzz", "thud")'],
        ],
        rules: [
          'Sibilance is a soft form of alliteration/consonance using /s/ or /sh/ sounds to suggest whispers, wind or snakes.',
          'Always say the line softly in your head to hear the true sounds rather than trusting spelling.',
          'In exam questions, name the sound device AND note the effect it creates (music, haste, harshness or calm).',
        ],
        table: {
          headers: ['Sound device', 'What repeats?', 'Original example'],
          rows: [
            ['Alliteration', 'Initial consonant sounds', '"Bold drums beat beside the bridge"'],
            ['Assonance', 'Internal vowel sounds', '"Deep green reeds sleep in peace"'],
            ['Consonance', 'Middle or final consonant sounds', '"Soft tufts drift past the loft"'],
            ['Onomatopoeia', 'Noise-imitating words', '"Raindrops patter, hiss and splash"'],
          ],
          trapNote: 'Alliteration requires consonant SOUNDS at the start of stressed words — repeating vowel sounds like "eager eagles eat" is assonance rather than true consonance.',
        },
        example: {
          q: 'Identify the dominant sound device in this original line: "The tin roof clattered as the sudden thunder boomed."',
          steps: [
            ['Read the noise words', '"clattered" and "boomed"'],
            ['Check what they do', 'Both words imitate the real physical sounds of rain and thunder'],
            ['Name the device', 'Onomatopoeia'],
          ],
        },
        yourTurn: {
          q: 'Which sound device stands out most in the original line "Long golden boats float slowly home"?',
          o: ['Assonance', 'Onomatopoeia', 'Caesura', 'Enjambment'],
          a: 0,
          h: [
            'Listen to the vowel sound inside "golden", "boats", "float", "slowly" and "home".',
            'Repetition of internal vowel sounds has its own specific name.',
          ],
          e: 'The repeated long /o/ vowel sound across "golden", "boats", "float", "slowly" and "home" is assonance.',
        },
      },
    ],
    qs: [
      {
        q: 'In the original line "Wild winds whipped the wooden wall", the dominant sound device is',
        o: ['alliteration', 'assonance', 'onomatopoeia', 'oxymoron'],
        a: 0,
        e: 'The repeated initial /w/ consonant sound in "Wild", "winds", "whipped", "wooden" and "wall" is alliteration.',
      },
      {
        q: 'A deliberate pause near the middle of a line of verse is called a',
        o: ['caesura', 'couplet', 'stanza', 'refrain'],
        a: 0,
        e: 'A caesura is an internal pause within a line of poetry, often marked by punctuation.',
      },
      {
        q: 'Which pair of words illustrates onomatopoeia?',
        o: ['Buzz and clatter', 'Tall and bright', 'River and mountain', 'Hope and courage'],
        a: 0,
        e: '"Buzz" and "clatter" imitate the real-world sounds they describe.',
      },
      {
        q: 'Read this original line: "The pale rain stays on grey clay plains." Which sound device dominates?',
        o: ['Assonance', 'Sibilance', 'Alliteration', 'Internal conflict'],
        a: 0,
        e: 'The repeated long /eɪ/ vowel sound in "pale", "rain", "stays", "grey", "clay" and "plains" is assonance.',
      },
      {
        q: 'What rhyme scheme is formed by four lines ending in "light / road / bright / load"?',
        o: ['ABAB', 'AABB', 'ABBA', 'ABCB'],
        a: 0,
        e: '"Light" rhymes with "bright" (A) and "road" rhymes with "load" (B), producing ABAB.',
      },
      {
        q: 'Why does "photo" alliterate with "flame" even though they start with different letters?',
        o: [
          'Because alliteration depends on matching consonant sounds (/f/), not matching letters',
          'Because both words have two syllables',
          'Because both words are nouns',
          'Because poets ignore pronunciation',
        ],
        a: 0,
        e: 'Sound devices are determined by spoken sound: "ph" in "photo" and "f" in "flame" share the /f/ sound.',
      },
    ],
  },
  {
    id: 'lit-figures-speech',
    name: 'Figures of speech',
    sec: 'Literary devices',
    goals: [
      'Identify figures of comparison and association: simile, metaphor, personification, metonymy and synecdoche',
      'Identify figures of contrast, emphasis and understatement: oxymoron, paradox, antithesis, hyperbole, litotes, euphemism and apostrophe',
    ],
    trap: 'Do not mix up oxymoron and paradox: an oxymoron puts two contradictory words right next to each other ("bitter sweet", "deafening silence"), whereas a paradox is a full statement that seems contradictory at first yet holds a deeper truth.',
    parts: [
      {
        title: 'Comparison, personification and association',
        idea: 'Figurative language stretches words beyond literal meaning to paint vivid pictures. Simile compares two unlike things using "like" or "as"; metaphor states directly that one thing IS another; personification gives human traits to non-human things; synecdoche uses a part for the whole (or whole for a part); and metonymy replaces a thing with something closely linked to it.',
        terms: [
          ['Simile', 'Explicit comparison using "like" or "as" (e.g., "Her laugh rang like a brass bell")'],
          ['Metaphor', 'Direct comparison calling one thing another without "like" or "as" (e.g., "Time is a quiet thief")'],
          ['Personification', 'Giving human actions, speech or feelings to objects, nature or abstract ideas'],
          ['Synecdoche vs Metonymy', 'Synecdoche uses a physical part ("all hands on deck"); metonymy uses an associated item ("the crown" for the monarch)'],
        ],
        rules: [
          'Not every sentence with "like" is a simile: "She likes mangoes" is a verb, not a comparison.',
          'An extended metaphor carries one comparison across several lines or a whole stanza.',
          'Apostrophe addresses an absent person, dead hero or non-human thing directly ("O stubborn rain, hold back your tears!").',
        ],
        table: {
          headers: ['Figure', 'Original example', 'Clue to spot it'],
          rows: [
            ['Simile', '"The highway unrolled like a dark ribbon."', 'Uses "like" or "as" between unlike things'],
            ['Metaphor', '"Anger is a brushfire in dry grass."', 'Direct equation without "like" or "as"'],
            ['Personification', '"The tired bridge groaned under the lorry."', 'Non-human object given human feeling/action'],
            ['Synecdoche', '"Twenty hungry mouths waited at the table."', 'Part ("mouths") stands for whole people'],
            ['Metonymy', '"The bench delivered a firm judgement."', 'Associated object ("bench") stands for judges'],
          ],
          trapNote: 'Check synecdoche vs metonymy carefully: a hand is physically PART of a sailor (synecdoche); a crown is WORN BY a king, not part of his body (metonymy).',
        },
        example: {
          q: 'Identify the figure of speech in this original sentence: "The dry harmattan wind slapped our cheeks and argued with the shutters."',
          steps: [
            ['Look at the verbs', '"slapped" and "argued" are human actions'],
            ['Look at the subject', 'The harmattan wind is a natural force, not a human'],
            ['Name the figure', 'Personification'],
          ],
        },
        yourTurn: {
          q: 'In the original sentence "We need more wheels on the road before the harvest begins", using "wheels" to mean vehicles is an example of',
          o: ['synecdoche', 'simile', 'oxymoron', 'euphemism'],
          a: 0,
          h: [
            'Ask whether wheels are a physical part of a vehicle or just an unrelated symbol.',
            'Using a physical part to represent the whole object has a specific Greek-derived name.',
          ],
          e: 'Using a physical part ("wheels") to represent the whole object (vehicles) is synecdoche.',
        },
      },
      {
        title: 'Contrast, emphasis and polite expression',
        idea: 'Writers also sharpen impact through deliberate clashes, exaggeration or gentle wording. Oxymoron pairs opposite words; antithesis balances contrasting ideas side by side; paradox hides truth inside an apparent contradiction; hyperbole exaggerates boldly; litotes understates using a negative; and euphemism softens harsh realities.',
        terms: [
          ['Oxymoron', 'Two directly opposite words placed side by side (e.g., "living death", "open secret")'],
          ['Paradox', 'A seemingly self-contradictory statement that reveals a genuine truth on reflection'],
          ['Antithesis', 'Balanced placement of contrasting ideas in parallel phrasing (e.g., "Man proposes, God disposes")'],
          ['Euphemism', 'A mild, polite expression replacing a blunt or painful one (e.g., "passed away" for "died")'],
        ],
        rules: [
          'Hyperbole is deliberate exaggeration for emphasis ("My schoolbag weighs a tonne").',
          'Litotes affirms a positive by negating its opposite ("She is no ordinary swimmer" = she is an excellent swimmer).',
          'A pun plays on two meanings of a word or similar-sounding words for wit.',
        ],
        table: {
          headers: ['Figure', 'Original example', 'How it works'],
          rows: [
            ['Oxymoron', '"A deafening silence filled the hall."', 'Two opposite words side by side'],
            ['Paradox', '"You must spend patience to save time."', 'Full statement that looks contradictory yet proves true'],
            ['Hyperbole', '"I have warned you a million times."', 'Bold, deliberate exaggeration'],
            ['Litotes', '"That physics paper was not easy."', 'Understatement using negation'],
            ['Euphemism', '"The company let forty workers go."', 'Softens a harsh reality (dismissal)'],
          ],
          trapNote: 'Do not confuse euphemism with litotes: euphemism softens unpleasantness ("laid to rest"), while litotes uses "not + opposite" to understate ("not bad at all").',
        },
        example: {
          q: 'Classify this original statement: "The noisier the boast, the emptier the courage."',
          steps: [
            ['Check the structure', 'Two balanced halves contrasting "noisier boast" and "emptier courage"'],
            ['Match the figure', 'Antithesis'],
          ],
        },
        yourTurn: {
          q: 'Which figure of speech is used in the original phrase "a painful pleasure"?',
          o: ['Oxymoron', 'Simile', 'Metonymy', 'Apostrophe'],
          a: 0,
          h: [
            'Notice that two opposite ideas sit directly next to each other inside a two-word phrase.',
            'It is shorter than a full paradoxical sentence.',
          ],
          e: 'Placing two directly opposite words ("painful" and "pleasure") side by side creates an oxymoron.',
        },
      },
    ],
    qs: [
      {
        q: 'In the original line "O restless river, tell me where the vanished years have gone", the speaker uses',
        o: ['apostrophe', 'litotes', 'synecdoche', 'alliteration'],
        a: 0,
        e: 'Apostrophe directly addresses a non-human object, abstract idea or absent person as though it could reply.',
      },
      {
        q: 'Saying "The old watchman has gone to join his ancestors" instead of "He died" is an example of',
        o: ['euphemism', 'hyperbole', 'antithesis', 'onomatopoeia'],
        a: 0,
        e: 'Euphemism substitutes a gentle, respectful expression for a harsh or painful reality.',
      },
      {
        q: 'Which of the following original sentences contains a metaphor?',
        o: [
          'Her stubborn pride was a wall between the two sisters.',
          'Her stubborn pride rose like a brick wall.',
          'She stood beside the brick wall.',
          'The brick wall stood five metres high.',
        ],
        a: 0,
        e: 'Calling pride directly "a wall" without "like" or "as" is a metaphor.',
      },
      {
        q: 'Saying "He is not unfamiliar with hard work" to mean he works very hard is an example of',
        o: ['litotes', 'hyperbole', 'pun', 'oxymoron'],
        a: 0,
        e: 'Litotes creates deliberate understatement by negating the opposite ("not unfamiliar").',
      },
      {
        q: 'In "The pen speaks louder than the sword", using "pen" for writing and "sword" for warfare is',
        o: ['metonymy', 'simile', 'paradox', 'anaphora'],
        a: 0,
        e: 'Metonymy replaces an idea with an object closely associated with it.',
      },
      {
        q: 'Which original line best illustrates hyperbole?',
        o: [
          'After the race, I could drink the entire River Niger dry.',
          'After the race, I drank two cups of cool water.',
          'After the race, the runner rested in the shade.',
          'After the race, the stadium emptied calmly.',
        ],
        a: 0,
        e: 'Claiming to drink the entire River Niger is deliberate exaggeration (hyperbole) to emphasise extreme thirst.',
      },
    ],
  },
  {
    id: 'lit-irony-tone-mood',
    name: 'Irony, satire, symbol, tone and mood',
    sec: 'Literary devices',
    goals: [
      'Distinguish verbal irony, situational irony, dramatic irony and sarcasm',
      'Explain symbolism, motif, satire, tone and mood in prose, drama and poetry',
    ],
    trap: 'Do not mix up tone and mood: tone is the WRITER’s or SPEAKER’s attitude toward the subject, while mood is the emotional ATMOSPHERE felt by the READER.',
    parts: [
      {
        title: 'Irony and satire',
        idea: 'Irony rests on a sharp gap between appearance and reality. Verbal irony says the opposite of what is meant; situational irony happens when the outcome reverses expectations; dramatic irony happens when the audience knows more than a character. Satire uses humour, irony and exaggeration to expose foolishness or corruption in society so people will think and reform.',
        terms: [
          ['Verbal irony', 'Saying one thing while clearly meaning the opposite'],
          ['Situational irony', 'An outcome that sharply contradicts what everyone reasonably expected'],
          ['Satire', 'Writing that uses wit, irony or ridicule to criticise social vices or hypocrisy'],
          ['Sarcasm', 'Biting, sharp-edged verbal irony aimed at mocking or hurting a specific target'],
        ],
        rules: [
          'All sarcasm is a harsh kind of verbal irony, but gentle verbal irony does not have to be cruel.',
          'A fire station burning down while its crew is away giving a fire-safety talk is situational irony.',
          'Satire differs from pure comedy because satire has a serious corrective target — greed, corruption or vanity.',
        ],
        table: {
          headers: ['Device', 'Where does the contrast live?', 'Original example'],
          rows: [
            ['Verbal irony', 'Between words spoken and real meaning', 'Saying "Lovely weather!" during a heavy flood'],
            ['Situational irony', 'Between expected result and actual result', 'A pickpocket having his own wallet stolen at a rally'],
            ['Dramatic irony', 'Between audience knowledge and character ignorance', 'Audience knows the letter is forged while the hero trusts it'],
            ['Satire', 'Between noble claims and foolish social reality', 'A comic sketch mocking officials who hold a luxury feast to discuss austerity'],
          ],
          trapNote: 'Bad luck alone (getting caught in rain on your birthday) is merely unfortunate, not situational irony; irony needs a neat twist against expectation.',
        },
        example: {
          q: 'In an original short story, a boastful safety inspector trips over his own untied shoelaces while lecturing workers on watching where they step. Which type of irony is this?',
          steps: [
            ['Spot the expectation', 'A safety lecturer is expected to be the most careful person present'],
            ['Spot the outcome', 'He trips over his own hazard mid-speech'],
            ['Classify', 'Situational irony'],
          ],
        },
        yourTurn: {
          q: 'What distinguishes satire from light entertainment comedy?',
          o: [
            'Satire uses wit and irony to expose social folly or corruption with the aim of prompting reform',
            'Satire never uses humour or exaggeration',
            'Satire is always written in fourteen-line sonnets',
            'Satire avoids mentioning human behaviour',
          ],
          a: 0,
          h: [
            'Think about the social purpose behind a satirical play or essay.',
            'Does the writer merely want giggles, or do they want readers to see through hypocrisy?',
          ],
          e: 'Satire combines humour or irony with social criticism to expose vices, hypocrisy or foolishness.',
        },
      },
      {
        title: 'Symbol, motif, tone and mood',
        idea: 'A symbol is a concrete object, colour or event that carries deeper abstract meaning (like a broken chain representing freedom). A motif is a recurring image, phrase or idea woven through a whole work to reinforce its theme. Tone reflects the writer’s or speaker’s attitude (bitter, affectionate, mocking, solemn), while mood is the feeling created for the reader (tense, eerie, joyful, mournful).',
        terms: [
          ['Symbol', 'Something concrete that stands for a larger idea beyond its literal self'],
          ['Motif', 'An image, sound or idea repeated across a work to support the central theme'],
          ['Tone', 'The speaker’s or writer’s attitude revealed through word choice (diction) and rhythm'],
          ['Mood', 'The prevailing emotional atmosphere experienced by the reader'],
        ],
        rules: [
          'Always justify tone or mood by pointing to specific words (diction) in the passage.',
          'A single rose in one scene can be a symbol; recurring images of rusted locks across five chapters form a motif.',
          'Theme is the central insight about life — never confuse it with a one-word topic alone (e.g., "unchecked ambition destroys trust" rather than just "ambition").',
        ],
        table: {
          headers: ['Element', 'Key question to ask', 'Example words'],
          rows: [
            ['Tone', 'How does the speaker feel about the topic?', 'Sarcastic, nostalgic, indignant, reverent'],
            ['Mood', 'How does the scene make the reader feel?', 'Suspenseful, gloomy, peaceful, triumphant'],
            ['Symbol', 'What deeper idea does this object stand for?', 'Dawn → new hope; locked gate → exclusion'],
            ['Motif', 'What image keeps returning across the text?', 'Repeated references to rain, shadows or clocks'],
          ],
          trapNote: 'Exam questions love swapping tone and mood — remember: Tone = Talker’s attitude; Mood = My (reader’s) feeling.',
        },
        example: {
          q: 'Read this original excerpt: "The empty classroom smelled of chalk dust; cobwebs draped the quiet desks where laughter once bounced off the rafters." What mood is created?',
          steps: [
            ['Pick out loaded words', '"empty", "dust", "cobwebs", "quiet", "once"'],
            ['Sense the atmosphere', 'Lonely, wistful and melancholic'],
            ['State the mood', 'Nostalgic / melancholic mood'],
          ],
        },
        yourTurn: {
          q: 'Throughout an original novel about drought, the writer keeps bringing back the image of cracked clay pots in chapters 1, 5, 9 and 14. This recurring image is best called a',
          o: ['motif', 'farce', 'couplet', 'prologue'],
          a: 0,
          h: [
            'Notice that the image is not mentioned just once — it repeats across the entire book to strengthen the theme.',
            'Which literary term names a recurring image or pattern running through a work?',
          ],
          e: 'A motif is a recurring image, phrase or element repeated throughout a literary work to reinforce its theme.',
        },
      },
    ],
    qs: [
      {
        q: 'Looking out at a torrential downpour that ruins a picnic, a character remarks, "What a glorious day for eating on the grass!" This is',
        o: ['verbal irony', 'dramatic irony', 'metonymy', 'allegory'],
        a: 0,
        e: 'Saying the opposite of what the situation clearly shows is verbal irony.',
      },
      {
        q: 'The attitude of a writer or poetic persona toward the subject of a work is its',
        o: ['tone', 'mood', 'plot', 'setting'],
        a: 0,
        e: 'Tone expresses the writer’s or speaker’s attitude through diction and syntax.',
      },
      {
        q: 'The emotional atmosphere that a literary scene evokes in the reader is called',
        o: ['mood', 'diction', 'metre', 'satire'],
        a: 0,
        e: 'Mood is the feeling or emotional climate experienced by the reader.',
      },
      {
        q: 'In an original story, a newly planted mango sapling beside a rebuilt house represents fresh hope after loss. The sapling functions as a',
        o: ['symbol', 'pun', 'caesura', 'farce'],
        a: 0,
        e: 'A concrete object standing for a deeper abstract idea (hope) is a symbol.',
      },
      {
        q: 'A writer composes a witty play ridiculing corrupt town councillors who award road contracts to their own cousins. This work is a',
        o: ['satire', 'elegy', 'pastoral', 'lullaby'],
        a: 0,
        e: 'Satire uses wit and irony to expose social corruption or hypocrisy.',
      },
      {
        q: 'Which option best states a literary theme rather than merely a topic?',
        o: [
          'Unchecked greed gradually destroys family trust',
          'Greed',
          'A marketplace in Ibadan',
          'Chapter four',
        ],
        a: 0,
        e: 'A theme expresses a complete insight or message about human life rather than a single word or setting.',
      },
    ],
  },
  {
    id: 'lit-unseen-appreciation',
    name: 'Literary appreciation: unseen prose and poetry',
    sec: 'Unseen appreciation',
    goals: [
      'Analyse an unseen prose passage for setting, diction, mood, point of view and figurative devices',
      'Read an unseen poem step by step to uncover speaker, central idea, imagery and tone',
    ],
    trap: 'Never guess the meaning of an unseen passage from one dramatic word alone — read the whole extract twice, check who is speaking, and verify every option directly against the text.',
    parts: [
      {
        title: 'Approaching unseen prose',
        idea: 'Unseen prose questions test your ability to read a fresh passage closely without prior notes. Use a four-step checklist: (1) who is telling the story (point of view), (2) where and when it happens (setting), (3) what specific word choices (diction) reveal about tone and mood, and (4) which literary devices sharpen the meaning.',
        terms: [
          ['Diction', 'The writer’s deliberate choice of words (simple, formal, harsh, tender or vivid)'],
          ['Imagery', 'Sensory language appealing to sight, sound, smell, taste or touch'],
          ['Setting', 'The physical place, time period and social environment of a passage'],
          ['Inference', 'A sensible conclusion drawn from textual clues rather than wild guesswork'],
        ],
        rules: [
          'Read the passage once for the big picture, then a second time while noticing verbs, adjectives and comparisons.',
          'Sensory imagery is named by the sense it appeals to: visual (sight), auditory (sound), tactile (touch), olfactory (smell) and gustatory (taste).',
          'Eliminate answer options that add facts never hinted at in the passage.',
        ],
        table: {
          headers: ['Unseen question asks for...', 'Where to look in the passage'],
          rows: [
            ['Point of view', 'Narration pronouns ("I" vs "he/she") and whose thoughts appear'],
            ['Mood / atmosphere', 'Adjectives describing weather, light, silence, speed or space'],
            ['Attitude / tone', 'Evaluative words showing praise, anger, pity or mockery'],
            ['Dominant device', 'Comparisons, repeated sounds, contrasts or human actions given to objects'],
          ],
          trapNote: 'In unseen comprehension, a metaphor or personification inside the passage still counts even when it lasts only three words — check the exact line referenced.',
        },
        example: {
          q: 'Read this original unseen prose extract:\n"By dusk the motor park had shrunk to a few coughing minibuses and the sour smell of diesel. Chidi tightened his thin jumper around his ribs and stared at the last conductor counting crumpled notes beneath a flickering bulb."\nWhat two senses dominate the imagery, and what mood does the passage build?',
          steps: [
            ['Spot sensory details', '"coughing minibuses" (sound + personification), "sour smell of diesel" (smell), "flickering bulb" (sight)'],
            ['Read emotional clues', '"shrunk", "thin jumper", "crumpled notes", "flickering"'],
            ['Conclude', 'Auditory/olfactory/visual imagery creating a weary, bleak evening mood'],
          ],
        },
        yourTurn: {
          q: 'In the original extract above, describing the minibuses as "coughing" is an example of',
          o: ['personification', 'simile', 'oxymoron', 'allusion'],
          a: 0,
          h: [
            'Ask whether a vehicle can literally cough like a human being.',
            'Giving a human bodily action to a machine has a specific literary name.',
          ],
          e: 'Describing minibuses as "coughing" attributes a human action to machines, which is personification.',
        },
      },
      {
        title: 'Approaching unseen poetry',
        idea: 'When facing an unseen poem, ignore panic and read sentences rather than stopping artificially at every line break. Ask four questions: Who is the persona (speaker)? What is the central image or contrast? How do rhythm, sound and stanza breaks support the message? And does the tone shift near the end?',
        terms: [
          ['Persona', 'The imaginary voice or speaker talking inside the poem (distinct from the poet)'],
          ['Volta (turn)', 'A shift in mood, perspective or argument partway through a poem'],
          ['Central image', 'The main picture around which the poem builds its meaning'],
        ],
        rules: [
          'Follow punctuation (full stops and commas), not line ends alone, to unpack poetic meaning accurately.',
          'Look for contrast words like "yet", "but", "however" or "now" — they often signal a shift in tone or theme.',
          'Every interpretation must fit the whole poem, not just line one.',
        ],
        table: {
          headers: ['Original unseen poem excerpt', 'Clue inside the lines', 'Sound literary reading'],
          rows: [
            ['"The concrete swallowed every mango root,\nYet green shoots crack the kerbstone underfoot."', 'Contrast word "Yet"; concrete vs green shoots', 'Theme of nature’s quiet resilience against urban spread'],
            ['"Your laughter lingers in the folded shawl,\nThough dust now gathers softly in the hall."', '"lingers" vs "dust now gathers"', 'Elegiac, nostalgic tone of quiet grief'],
          ],
          trapNote: 'Never assume the poet’s biography is being tested in an unseen poem — base every answer strictly on the words printed on the page.',
        },
        example: {
          q: 'Read this original unseen stanza:\n"We built our walls of gleaming glass and stone,\nAnd locked the noisy courtyard out of sight;\nYet in the spotless rooms we sat alone,\nAnd missed the smoky warmth of lantern light."\nWhat is the central theme of this stanza?',
          steps: [
            ['Identify the contrast', '"gleaming glass / spotless rooms" vs "alone / missed the smoky warmth"'],
            ['Locate the turning word', '"Yet" in line 3 pivots from modern pride to loneliness'],
            ['State the theme', 'Modern comfort can bring isolation and loss of warm community life'],
          ],
        },
        yourTurn: {
          q: 'In the original stanza above ("We built our walls of gleaming glass..."), what is the rhyme scheme and tone?',
          o: [
            'ABAB rhyme scheme with a regretful, reflective tone',
            'AABB rhyme scheme with a mocking, joyful tone',
            'Unrhymed free verse with an angry tone',
            'ABBA rhyme scheme with a boastful tone',
          ],
          a: 0,
          h: [
            'Check the ending words: "stone / sight / alone / light".',
            'Then notice the speaker’s feeling in the last two lines ("sat alone", "missed the smoky warmth").',
          ],
          e: '"Stone/alone" (A) and "sight/light" (B) give ABAB, while the longing for lost warmth creates a regretful, reflective tone.',
        },
      },
    ],
    qs: [
      {
        q: 'Read this original unseen poem:\n"At dawn the fisher casts a silver net\nAcross the waking mirror of the creek;\nBefore the village roofs are warm or dry,\nHis wooden paddle speaks without a tongue."\nCalling the calm creek a "waking mirror" combines',
        o: [
          'personification and metaphor',
          'simile and farce',
          'hyperbole and euphemism',
          'oxymoron and satire',
        ],
        a: 0,
        e: '"Waking" gives the creek a human action (personification), while calling it a "mirror" directly compares water to glass (metaphor).',
      },
      {
        q: 'In the original poem above, what does the line "His wooden paddle speaks without a tongue" suggest?',
        o: [
          'The rhythmic dipping of the paddle communicates skill and presence in the quiet morning',
          'The fisherman has lost his voice permanently',
          'The paddle is made of metal rather than wood',
          'The village roofs are flooding',
        ],
        a: 0,
        e: 'The personification ("speaks without a tongue") highlights the gentle, expressive sound of the paddle breaking the dawn stillness.',
      },
      {
        q: 'Read this original unseen prose line:\n"Ada folded the acceptance letter three times, pressed it against her chest, and watched the rain turn the dusty compound into shining gold."\nThe mood at this moment is',
        o: ['joyful and hopeful', 'bitter and hostile', 'eerie and terrifying', 'bored and indifferent'],
        a: 0,
        e: 'Pressing the acceptance letter to her chest and seeing ordinary rain as "shining gold" convey deep joy and hope.',
      },
      {
        q: 'In unseen literary appreciation, the word "diction" specifically refers to the writer’s',
        o: ['choice of words', 'number of chapters', 'year of birth', 'length of paragraphs'],
        a: 0,
        e: 'Diction means the deliberate selection of words used to shape tone, clarity and imagery.',
      },
      {
        q: 'Read this original unseen couplet:\n"Old lanterns fade beside the neon glare,\nYet moths still circle memories in the air."\nWhich word signals the contrast or shift in thought?',
        o: ['Yet', 'Old', 'Beside', 'In'],
        a: 0,
        e: '"Yet" introduces the contrast between fading old lanterns and lingering attachment.',
      },
      {
        q: 'When reading an unseen poem with run-on lines (enjambment), what is the best way to understand its plain meaning first?',
        o: [
          'Read smoothly to each punctuation mark as a complete sentence rather than stopping at every line end',
          'Read only the last word of every line',
          'Skip all metaphors and count only the nouns',
          'Assume the poem is always about the poet’s childhood',
        ],
        a: 0,
        e: 'Following sentence punctuation across run-on lines reveals the grammatical meaning before you examine imagery and rhythm.',
      },
    ],
  },
  {
    id: 'lit-african-prose-set',
    name: 'Prescribed African Prose (WAEC & JAMB Set Novels)',
    sec: 'Prescribed prose texts',
    goals: [
      'Analyse plot, character arcs, themes and narrative techniques in So the Path Does Not Die, Redemption Road, Second Class Citizen and Unexpected Joy at Dawn',
      'Connect textual evidence and literary devices to WAEC Paper 3 essay prompts and UTME twin-option questions',
    ],
    trap: 'Never retell the plot blindly in WAEC Paper 3 essays or confuse character pairs across African set novels (e.g., Finaba/Cammy in So the Path Does Not Die vs Bendu/Commander Cobra in Redemption Road).',
    parts: [
      {
        title: '2026–2030 Harmonized African Prose: Hollist & Shaw',
        idea: 'The harmonized WAEC/NECO & JAMB 2026–2030 Literature-in-English syllabus features two landmark West African novels: Pede Hollist’s So the Path Does Not Die (Sierra Leone & diaspora identity, Female Genital Cutting, and Finaba Marah’s return home) and Elma Shaw’s Redemption Road (post-war Monrovia, Liberia, where NGO director Bendu Lewis confronts former rebel Commander Cobra / Moses Varney).',
        terms: [
          ['Fafei / Initiation rite', 'The traditional Kono female initiation ceremony in Talaba that triggers Finaba’s childhood trauma and family rupture'],
          ['Peace in Practice', 'The Monrovia trauma-healing NGO directed by Bendu Lewis in Elma Shaw’s Redemption Road'],
          ['Camp Sande', 'The wartime rebel forest camp in Redemption Road where Bendu survived captivity under Commander Cobra'],
          ['Diaspora alienation', 'The feeling of cultural homelessness experienced by African migrants between Western cities and ancestral homelands'],
        ],
        rules: [
          'In So the Path Does Not Die, Pa Aguibou Marah breaks with village elders after Baramusu’s secret FGC rite on young Finaba, moving the family to Freetown.',
          'In Washington D.C., Finaba marries African-American physician Cammy before returning to Sierra Leone to build a sanctuary for vulnerable girls.',
          'In Redemption Road, Bendu’s pursuit of legal accountability against Moses Varney (Commander Cobra) exposes the tension between political impunity and survivor healing.',
        ],
        table: {
          headers: ['Prescribed Novel', 'Author & Setting', 'Protagonist & Central Conflict'],
          rows: [
            ['So the Path Does Not Die', 'Pede Hollist · Talaba, Freetown & Washington D.C.', 'Finaba (Fina) Marah negotiates FGC trauma, diaspora identity and cultural renewal'],
            ['Redemption Road', 'Elma Shaw · Monrovia & Camp Sande, Liberia', 'Bendu Lewis confronts wartime captor Moses Varney (Commander Cobra) in peacetime Monrovia'],
          ],
          trapNote: 'Remember the exact countries: Pede Hollist writes on Sierra Leone (Kono/Freetown), while Elma Shaw writes on Liberia (Monrovia).',
        },
        example: {
          q: 'How does the title "So the Path Does Not Die" function symbolically in Pede Hollist’s novel?',
          steps: [
            ['Trace the ancestral proverb', 'Elders invoke keeping the ancestral path alive to justify unbroken custom'],
            ['Trace Finaba’s redefinition', 'Finaba preserves Kono communal heritage while reforming harmful practices through girls’ education in Sierra Leone'],
            ['State the thematic synthesis', 'A culture survives by ethical renewal rather than rigid harm or total Western abandonment'],
          ],
        },
        yourTurn: {
          q: 'In Elma Shaw’s Redemption Road, what triggers Bendu Lewis’s psychological crisis in peacetime Monrovia?',
          o: [
            'Spotting her wartime rebel captor, Moses Varney (Commander Cobra), walking freely as an influential civilian',
            'Losing her university scholarship in Freetown after a student protest',
            'Being deported from Accra during the Aliens Compliance Order',
            'Having her first novel manuscript burned by her husband in London',
          ],
          a: 0,
          h: [
            'Think about the post-civil-war Liberian setting in Monrovia.',
            'Commander Cobra now lives openly under his civilian name, Moses Varney.',
          ],
          e: 'Seeing Moses Varney (Commander Cobra) enjoying status and impunity in Monrovia reawakens Bendu’s buried Camp Sande trauma and drives her quest for justice.',
        },
      },
      {
        title: 'Classic African Prose Continuity: Emecheta & Agyei-Agyiri',
        idea: 'Alongside the 2026–2030 texts, Buchi Emecheta’s Second Class Citizen and Alex Agyei-Agyiri’s Unexpected Joy at Dawn remain core West African prose benchmarks testing patriarchy, migration, pan-African identity, and resilience.',
        terms: [
          ['The Presence', 'Adah Ofili’s inner voice of ambition and determination in Second Class Citizen'],
          ['The Bride Price', 'Adah’s first novel manuscript, which Francis callously burns in London'],
          ['Aliens Compliance Order', 'Historical expulsion policies (1969 Ghana / 1983 Nigeria) driving twin journeys in Unexpected Joy at Dawn'],
          ['Parallel plot', 'Narrative technique in Unexpected Joy at Dawn alternating between Nii Tackie in Ghana and Mama Orojo in Nigeria'],
        ],
        rules: [
          'Adah Ofili refuses “second-class” status first as an Igbo girl denied early schooling in Lagos, and later as a Black mother enduring racism and domestic abuse under Francis in London.',
          'Francis burning Adah’s manuscript is the irreversible climax that makes Adah leave with her children.',
          'Unexpected Joy at Dawn alternates between Accra and Lagos as siblings Moses Nii Tackie and Mama Orojo search for each other across artificial colonial borders.',
        ],
        table: {
          headers: ['Prescribed Novel', 'Protagonist(s)', 'Climactic Turning Point'],
          rows: [
            ['Second Class Citizen (Buchi Emecheta)', 'Adah Ofili (vs Francis Obi)', 'Francis burns Adah’s manuscript ("brainchild"), prompting her legal separation'],
            ['Unexpected Joy at Dawn (Alex Agyei-Agyiri)', 'Moses Nii Tackie & Mama Orojo', 'Unexpected sibling reunion in Nigeria after perilous deportation and border trauma'],
          ],
          trapNote: 'In Unexpected Joy at Dawn, Nii Tackie carries Nigerian Yoruba blood (Orojo) despite bearing a Ga name and working as an assistant bank manager in Accra.',
        },
        example: {
          q: 'Why does Buchi Emecheta describe Adah’s first manuscript as her "brainchild" in Second Class Citizen?',
          steps: [
            ['Connect motherhood and authorship', 'Adah values intellectual creation alongside her devotion to her biological children'],
            ['Contrast Francis’s reaction', 'Burning the manuscript attacks Adah’s independent mind and voice'],
            ['Link to the resolution', 'Destroying her "brainchild" breaks the final bond of her oppressive marriage'],
          ],
        },
        yourTurn: {
          q: 'Which narrative structure does Alex Agyei-Agyiri employ in Unexpected Joy at Dawn?',
          o: [
            'Parallel plots alternating between Accra (Ghana) and Lagos/Illere (Nigeria)',
            'A single courtroom diary narrated by a nine-year-old child in Alabama',
            'An epistolary exchange of letters between Paris and Dakar',
            'A hospital bedside vigil in Eastern Ontario, Canada',
          ],
          a: 0,
          h: [
            'Follow the simultaneous journeys of Moses Nii Tackie and his sister Mama Orojo.',
            'One storyline unfolds in Ghana while the twin storyline unfolds in Nigeria.',
          ],
          e: 'Agyei-Agyiri alternates chapters between Ghana and Nigeria, mirroring the shared destiny of West Africans divided by xenophobic expulsion decrees.',
        },
      },
    ],
    qs: [
      {
        q: 'In Pede Hollist’s So the Path Does Not Die, why does Pa Aguibou Marah leave Talaba village for Freetown with his family?',
        o: [
          'Grandmother Baramusu secretly subjects young Finaba to the Fafei initiation rite against his promise',
          'A diamond mining company buys his cocoa plantation',
          'Finaba wins an immediate medical scholarship to Washington D.C.',
          'Civil war rebels burn down the village schoolhouse',
        ],
        a: 0,
        e: 'Baramusu’s secret circumcision of Finaba shatters Pa Aguibou’s trust and prompts his permanent break with Talaba.',
      },
      {
        q: 'Who is Cammy in Pede Hollist’s So the Path Does Not Die?',
        o: [
          'The Trinidadian-born physician whom Finaba marries in the United States',
          'The village elder who leads the Kono initiation society',
          'Bendu Lewis’s defense lawyer in Monrovia',
          'Adah Ofili’s negligent childminder in London',
        ],
        a: 0,
        e: 'Cammy is a successful Caribbean-American doctor whose marriage to Finaba exposes cultural misunderstandings around her childhood trauma and longing for Sierra Leone.',
      },
      {
        q: 'In Elma Shaw’s Redemption Road, what is the wartime alias of Moses Varney?',
        o: ['Commander Cobra', 'Commander Scorpion', 'General Lion', 'Major Viper'],
        a: 0,
        e: 'Moses Varney is the civilian name of former rebel warlord Commander Cobra, who held Bendu captive at Camp Sande.',
      },
      {
        q: 'What is the name of the trauma-counselling NGO led by Bendu Lewis in Redemption Road?',
        o: ['Peace in Practice', 'Pathways Home', 'Stardom Foundation', 'Shield of Liberia'],
        a: 0,
        e: 'Bendu directs Peace in Practice in Monrovia while secretly struggling with her own unhealed war memories.',
      },
      {
        q: 'In Buchi Emecheta’s Second Class Citizen, how does young Adah first gain entry into Methodist School in Lagos?',
        o: [
          'She sneaks away from home on her own and runs into Mr. Cole’s classroom',
          'Her father registers her ahead of her younger brother Boy',
          'Francis pays her primary school scholarship from London',
          'Her mother petitions the colonial district officer',
        ],
        a: 0,
        e: 'Eight-year-old Adah slips out of the house with a slate and presents herself in Mr. Cole’s classroom.',
      },
      {
        q: 'In Alex Agyei-Agyiri’s Unexpected Joy at Dawn, why is Moses Nii Tackie still treated as an "alien" by immigration officials despite his Ga name?',
        o: [
          'His biological heritage is Nigerian (Yoruba), and he lacks official Ghanaian citizenship papers during the 1983 crisis',
          'He refuses to speak English at the Accra bank',
          'He entered Ghana illegally the week before the novel begins',
          'He works as a diamond smuggler for Tally O',
        ],
        a: 0,
        e: 'Raised by a Ga foster family in Ghana, Nii Tackie bears Yoruba tribal marks and Nigerian ancestry without Ghanaian documentation.',
      },
    ],
  },
  {
    id: 'lit-nonafrican-prose-set',
    name: 'Prescribed Non-African Prose (2026–2030 Set Novels)',
    sec: 'Prescribed prose texts',
    goals: [
      'Analyse perspective, symbolism, moral courage and racial injustice in Harper Lee’s To Kill a Mockingbird',
      'Trace the dual-timeline hospital vigil, family devotion and resilience in Susanne Bellefeuille’s Path of Lucas: The Journey He Endured',
    ],
    trap: 'In To Kill a Mockingbird, distinguish nine-year-old Scout’s innocent eye from adult Jean Louise’s retrospective irony; in Path of Lucas, keep the present hospital frame (Lucy’s coma) distinct from the chronological flashbacks of Lucas’s life.',
    parts: [
      {
        title: 'Harper Lee: To Kill a Mockingbird',
        idea: 'Set in Maycomb, Alabama during the 1930s Great Depression, Harper Lee’s To Kill a Mockingbird uses the first-person voice of Jean Louise (“Scout”) Finch to link two storylines: the children’s fascination with reclusive neighbour Arthur (“Boo”) Radley and Atticus Finch’s courageous courtroom defence of Tom Robinson, a Black farmhand falsely accused by Bob and Mayella Ewell.',
        terms: [
          ['Mockingbird motif', 'Symbol of harmless innocence that brings only music/goodness; destroying it (Tom Robinson, Boo Radley) is a sin'],
          ['Retrospective first-person narration', 'Adult Scout looking back through her childhood eyes to expose Maycomb’s racial hypocrisy'],
          ['Moral empathy', 'Atticus’s lesson that you never truly understand a person until you climb into his skin and walk around in it'],
        ],
        rules: [
          'Physical evidence proves Tom Robinson’s left arm was crippled in a cotton gin accident, whereas Mayella Ewell was bruised mainly on the right side of her face by a left-handed attacker (her father, Bob Ewell).',
          'Despite clear proof, the all-white jury convicts Tom Robinson, who is later shot dead while trying to escape prison.',
          'On Halloween night, Boo Radley rescues Jem and Scout from Bob Ewell’s knife attack, and Sheriff Heck Tate insists Ewell "fell on his knife" to spare shy Boo destructive publicity.',
        ],
        table: {
          headers: ['Symbolic "Mockingbird"', 'How Innocence Is Shown', 'Outcome in the Novel'],
          rows: [
            ['Tom Robinson', 'Helps lonely Mayella Ewell out of pure kindness without pay', 'Wrongly convicted by racial prejudice and killed in prison'],
            ['Arthur ("Boo") Radley', 'Leaves secret gifts in the knot-hole, blankets Scout in the fire, saves the children', 'Protected by Sheriff Heck Tate and understood empathetically by Scout on his porch'],
          ],
          trapNote: 'Miss Maudie Atkinson (not Aunt Alexandra) explains why it is a sin to kill a mockingbird after Atticus warns the children with their air-rifles.',
        },
        example: {
          q: 'Why does Sheriff Heck Tate refuse to arrest Arthur ("Boo") Radley after Bob Ewell dies under the oak tree?',
          steps: [
            ['Identify Boo’s action', 'Boo saved Jem and Scout from Bob Ewell’s murderous assault'],
            ['Weigh Maycomb’s attention', 'Dragging shy, reclusive Boo into public limelight would torment him for doing a heroic deed'],
            ['Connect to the mockingbird symbol', 'Scout affirms Heck Tate’s wisdom by saying exposing Boo "would be sort of like shootin’ a mockingbird"'],
          ],
        },
        yourTurn: {
          q: 'During Tom Robinson’s trial in To Kill a Mockingbird, what crucial medical/physical fact does Atticus demonstrate in court?',
          o: [
            'Tom Robinson’s left arm is permanently crippled and useless, whereas Mayella was struck by a strong left-handed man',
            'Bob Ewell was out of town in Montgomery on the evening of November 21',
            'Sheriff Heck Tate had taken fingerprints from the Ewell cabin window',
            'Tom Robinson had never stepped inside the Ewell yard before that day',
          ],
          a: 0,
          h: [
            'Watch what happens when Atticus asks Bob Ewell to write his name in court.',
            'Bob Ewell is left-handed, while Tom’s left arm was mangled in a childhood cotton-gin accident.',
          ],
          e: 'Atticus proves Bob Ewell is left-handed while Tom’s left arm is shrivelled and twelve inches shorter, making it physically impossible for Tom to have inflicted Mayella’s right-side facial bruises.',
        },
      },
      {
        title: 'Susanne Bellefeuille: Path of Lucas — The Journey He Endured',
        idea: 'Prescribed on the 2026–2030 WAEC/JAMB Non-African Prose list, Canadian novelist Susanne Bellefeuille’s Path of Lucas: The Journey He Endured uses a frame narrative: sitting beside his comatose daughter Lucy after a devastating car crash in Eastern Ontario, narrator-protagonist Lucas Clarkson recounts his life’s love, losses, and quiet endurance with his wife Isabelle.',
        terms: [
          ['Frame narrative (bedside vigil)', 'Present-tense hospital scenes beside comatose Lucy that enclose chronological flashbacks of Lucas’s life'],
          ['First-person confessional voice', 'Lucas speaking intimately to his unconscious daughter to tether her spirit back to life'],
          ['Domestic stoicism', 'Quiet, everyday fatherly sacrifice through financial strain, grief and medical crisis'],
        ],
        rules: [
          'The present-day anchor is Lucy’s hospital room following a severe road accident; Lucas believes recounting their family’s full story will help awaken her.',
          'Flashbacks trace Lucas’s courtship and marriage to Isabelle, rural/small-town Canadian work ethic, parenting joys, and devastating family trials.',
          'In WAEC essays, always connect the dual timelines: every past hardship Lucas endured strengthens his refusal to give up hope at Lucy’s bedside.',
        ],
        table: {
          headers: ['Narrative Layer', 'Key Characters', 'Dramatic Function'],
          rows: [
            ['Present Frame (Hospital Vigil)', 'Lucas Clarkson, comatose daughter Lucy, doctors & family', 'Creates immediate emotional suspense and tenderness'],
            ['Retrospective Journey (Flashbacks)', 'Young Lucas, Isabelle, growing children', 'Demonstrates how enduring love survives grief and hardship'],
          ],
          trapNote: 'Do not confuse Lucas Clarkson (the father and narrator) with Lucy (his injured daughter in the hospital bed).',
        },
        example: {
          q: 'How does the hospital bedside setting shape the tone of Susanne Bellefeuille’s Path of Lucas?',
          steps: [
            ['Identify the frame situation', 'Lucas speaks to his daughter Lucy while she lies in a coma'],
            ['Analyse the emotional effect', 'Every memory of Isabelle and family life carries urgent, tender weight rather than casual nostalgia'],
            ['State the thematic payoff', 'Storytelling itself becomes an act of paternal love and healing'],
          ],
        },
        yourTurn: {
          q: 'In Susanne Bellefeuille’s Path of Lucas: The Journey He Endured, what frames Lucas Clarkson’s narration of his past?',
          o: [
            'His vigil at the hospital bedside of his comatose daughter, Lucy, after a terrible accident',
            'A courtroom testimony defending a falsely accused farm worker',
            'A farewell speech on a Lagos secondary school assembly podium',
            'A deportation camp near the Ghana–Togo border',
          ],
          a: 0,
          h: [
            'Recall why Lucas is telling his life story out loud.',
            'He is sitting beside his injured daughter Lucy in a Canadian hospital room.',
          ],
          e: 'Lucas’s bedside vigil for his comatose daughter Lucy serves as the emotional frame through which he recounts his life with Isabelle and their family.',
        },
      },
    ],
    qs: [
      {
        q: 'In Harper Lee’s To Kill a Mockingbird, who explains to Scout that mockingbirds do nothing except make music for people to enjoy?',
        o: ['Miss Maudie Atkinson', 'Calpurnia', 'Mrs. Henry Lafayette Dubose', 'Mayella Ewell'],
        a: 0,
        e: 'After Atticus tells Jem and Scout it is a sin to kill a mockingbird, neighbour Miss Maudie Atkinson explains why—mockingbirds harm no crops or gardens and only sing.',
      },
      {
        q: 'Why does Atticus Finch make Jem read aloud to Mrs. Henry Lafayette Dubose every afternoon in To Kill a Mockingbird?',
        o: [
          'So Jem can witness real moral courage as the dying old woman battles her morphine addiction before death',
          'Because Mrs. Dubose is Jem’s schoolteacher in Maycomb',
          'To earn money to replace Scout’s lost overalls',
          'Because Sheriff Heck Tate ordered community service after the fire',
        ],
        a: 0,
        e: 'Although Jem initially goes as punishment for cutting her camellia bushes, Atticus wants him to see genuine courage—fighting a battle you know is hard purely on principle.',
      },
      {
        q: 'Who places the woollen blanket around Scout’s shoulders on the freezing night Miss Maudie’s house burns down?',
        o: ['Arthur ("Boo") Radley', 'Dill Harris', 'Bob Ewell', 'Mr. Dolphus Raymond'],
        a: 0,
        e: 'While Jem and Scout stand transfixed watching the fire in front of the Radley gate, Boo Radley quietly steps out and drapes a blanket over Scout.',
      },
      {
        q: 'In Susanne Bellefeuille’s Path of Lucas: The Journey He Endured, what is the relationship between Lucas and Isabelle?',
        o: [
          'Husband and wife whose enduring bond anchors the family across decades of trials',
          'Brother and sister separated between Ontario and London',
          'Defense lawyer and prosecutor in a rural Canadian trial',
          'Doctor and head nurse at Lucy’s hospital',
        ],
        a: 0,
        e: 'Isabelle is Lucas’s beloved wife; their courtship, marriage, parenthood, and shared trials form the heart of Lucas’s retrospective story.',
      },
      {
        q: 'Which narrative perspective is used in Path of Lucas: The Journey He Endured?',
        o: [
          'First-person narration by Lucas Clarkson addressing his comatose daughter and recalling his life',
          'Second-person instruction manual addressed to medical students',
          'Detached newspaper reports from Ottawa journalists',
          'Choral dramatic dialogue without a narrator',
        ],
        a: 0,
        e: 'Lucas narrates in an intimate first-person voice from his daughter Lucy’s bedside, weaving present hospital moments with memories.',
      },
      {
        q: 'What thematic thread links Harper Lee’s To Kill a Mockingbird and Susanne Bellefeuille’s Path of Lucas despite their different settings?',
        o: [
          'Quiet fatherly devotion, moral resilience, and protecting loved ones through painful trials',
          'Post-colonial military coups in West Africa',
          'Satire of corrupt urban municipal politicians',
          'Supernatural intervention by forest deities',
        ],
        a: 0,
        e: 'Both Atticus Finch and Lucas Clarkson embody steadfast paternal love, quiet integrity, and endurance in the face of grief and crisis.',
      },
    ],
  },
];

export function buildLitCurriculum() {
  return buildUtmeSubjectCurriculum(LIT_SPECS);
}
