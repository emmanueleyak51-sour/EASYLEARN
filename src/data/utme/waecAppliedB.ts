import { buildUtmeSubjectCurriculum, compactUtmeTopic, type CompactTopicInput } from './builder';
import { MARKETING_EXTRA_SPECS, OFFICEPRAC_EXTRA_SPECS, INSURANCE_EXTRA_SPECS } from './extraWaecSchoolB1';
import { STOREMGT_EXTRA_SPECS, BOOKKEEP_EXTRA_SPECS } from './extraWaecSchoolB2';

const MARKETING_SPECS: CompactTopicInput[] = [
  {
    id: 'mkt-mix-segmentation',
    name: 'Marketing concepts, segmentation and the marketing mix',
    sec: 'Marketing foundations',
    goals: [
      'Distinguish between the selling concept and the marketing concept',
      'Apply market segmentation and the 4Ps of marketing to Nigerian businesses',
    ],
    trap: 'Do not confuse selling (pushing existing stock) with marketing (identifying customer needs first and designing products to satisfy them profitably).',
    p1: {
      title: 'Marketing orientation and market segmentation',
      idea: 'Marketing starts with discovering what buyers need and creating value they gladly pay for. Because no single product pleases everyone, firms divide a broad market into smaller segments by age, income, location (demographic/geographic) or lifestyle (psychographic), then target the most promising group.',
      terms: [
        ['Marketing concept', 'Customer-first approach that earns profit by satisfying identified buyer needs better than rivals'],
        ['Market segmentation', 'Dividing a large diverse market into distinct groups with similar needs and buying habits'],
        ['Positioning', 'Shaping a clear, memorable image of a brand in the minds of target customers'],
      ],
      rules: [
        'Needs are basic states of felt deprivation (food, shelter); wants are shaped by culture; demands are wants backed by purchasing power.',
        'Effective segments must be measurable, accessible, substantial enough to profit from, and actionable.',
      ],
      headers: ['Segmentation basis', 'Nigerian example'],
      rows: [
        ['Demographic', 'Children’s malt drinks vs adult energy drinks'],
        ['Geographic', 'Heavy cardigans marketed in Jos during harmattan'],
        ['Behavioural', 'Frequent-buyer loyalty points at supermarkets'],
      ],
      exQ: 'A shoe brand designs affordable rain boots mainly for commuters in Lagos and Port Harcourt during June–September. Which two segmentation bases are used?',
      exSteps: [
        ['Location and climate', 'Geographic segmentation (rainy coastal cities)'],
        ['Income sensitivity', 'Demographic segmentation (budget-conscious commuters)'],
      ],
      checkQ: 'Which business philosophy begins with identifying customer needs before designing a product?',
      checkO: ['The marketing concept', 'The production concept', 'The hard-selling concept', 'The warehousing concept'],
      checkH: ['Selling pushes whatever was already made; marketing listens first.', 'It centres on buyer satisfaction as the route to profit.'],
      checkE: 'The marketing concept begins with customer needs and builds products to satisfy them.',
    },
    p2: {
      title: 'The 4Ps: Product, Price, Place and Promotion',
      idea: 'Every marketing plan blends four controllable tools called the marketing mix (4Ps): Product (features, quality, packaging, brand), Price (discounts, penetration or skimming), Place (distribution channels from factory to shop), and Promotion (advertising, personal selling, sales promotion and public relations).',
      terms: [
        ['Penetration pricing', 'Setting a low entry price to attract buyers quickly and gain market share'],
        ['Price skimming', 'Setting a high initial price for an innovative product before lowering it later'],
        ['Sales promotion', 'Short-term incentives like coupons, free samples or buy-one-get-one offers'],
      ],
      rules: [
        'All four Ps must match: a luxury watch needs prestige pricing, selective outlets and refined promotion.',
        'Product life cycle stages are introduction, growth, maturity and decline.',
      ],
      headers: ['Mix element', 'Core decisions'],
      rows: [
        ['Product', 'Quality, packaging, branding, warranty'],
        ['Price', 'List price, discounts, credit terms'],
        ['Place', 'Wholesalers, retailers, online delivery'],
        ['Promotion', 'Advertising, PR, personal selling, promos'],
      ],
      exQ: 'A new biscuit factory launches its snack at ₦100 when rivals sell at ₦150 to win quick trial. Name this pricing strategy.',
      exSteps: [
        ['Compare launch price with rivals', 'Significantly lower to capture fast volume'],
        ['Name strategy', 'Penetration pricing'],
      ],
      checkQ: 'Free tasting sachets handed out at a market square for one weekend are an example of',
      checkO: ['sales promotion', 'price skimming', 'direct wholesaling', 'product obsolescence'],
      checkH: ['It is a short-term incentive to encourage immediate trial.', 'Think of the four promotional tools.'],
      checkE: 'Free samples are a classic short-term sales promotion technique.',
    },
    qs: [
      ['A want becomes an economic demand only when it is backed by', 'ability and willingness to pay', 'a loud advertisement', 'government licensing', 'factory machinery'],
      ['Dividing buyers into teenagers, young professionals and retirees uses', 'demographic segmentation', 'geographic segmentation', 'climate segmentation', 'industrial zoning'],
      ['Charging a high launch price for a brand-new smartphone model to recover research costs early is', 'price skimming', 'penetration pricing', 'loss-leader pricing', 'dumping'],
      ['Which element of the marketing mix covers wholesalers, retailers and transport logistics?', 'Place', 'Product', 'Price', 'Promotion'],
      ['At which stage of the product life cycle do sales peak and competition become most intense?', 'Maturity', 'Introduction', 'Idea screening', 'Disposal'],
      ['Unpaid favourable news coverage of a company’s scholarship scheme is called', 'publicity (public relations)', 'personal selling', 'direct mail', 'price discounting'],
    ].map(([q, a, b, c, d, e]) => [q, a, b, c, d, e || `${a} is correct under standard marketing principles.`] as [string, string, string, string, string, string]),
  },
  {
    id: 'mkt-research-distribution-ecommerce',
    name: 'Marketing research, distribution channels and e-marketing',
    sec: 'Market intelligence & channels',
    goals: [
      'Plan primary and secondary marketing research using surveys and observation',
      'Select suitable distribution channels and digital marketing tools',
    ],
    trap: 'Do not confuse primary data (collected fresh for the current problem) with secondary data (already published in reports, census tables or sales records).',
    p1: {
      title: 'Marketing research and consumer behaviour',
      idea: 'Marketing research systematically gathers and analyses facts so businesses avoid costly guesswork. Secondary data is quick and cheap (trade journals, NBS reports), while primary data (questionnaires, focus groups, taste tests) answers specific new questions about why consumers buy.',
      terms: [
        ['Primary data', 'Fresh, first-hand data gathered directly from respondents for a specific study'],
        ['Secondary data', 'Existing data already collected and published for another purpose'],
        ['Sample', 'Representative subset of the target population surveyed to estimate overall opinion'],
      ],
      rules: [
        'Research sequence: define problem → design plan → collect data → analyse findings → present report.',
        'Consumer buying steps: need recognition → information search → evaluating options → purchase → post-purchase feeling.',
      ],
      headers: ['Data type', 'Strengths & examples'],
      rows: [
        ['Primary', 'Tailored and current; surveys, interviews, observation'],
        ['Secondary', 'Fast and low-cost; company invoices, NBS statistics'],
      ],
      exQ: 'Before opening a pharmacy in Enugu, an entrepreneur checks National Bureau of Statistics population data and interviews 80 local residents. Classify each source.',
      exSteps: [
        ['NBS population tables', 'Secondary data (already published)'],
        ['Interviews with 80 residents', 'Primary data (collected fresh)'],
      ],
      checkQ: 'Which of the following is an example of secondary marketing data?',
      checkO: ['Last year’s industry report published by a trade association', 'A new questionnaire filled out by shoppers today', 'Live observation of supermarket queues', 'A fresh focus-group tasting session'],
      checkH: ['Secondary data already existed before the researcher began.', 'Look for a previously published document.'],
      checkE: 'A published industry report is existing secondary data.',
    },
    p2: {
      title: 'Distribution channels and digital marketing',
      idea: 'Distribution channels move goods from producer to final user. Perishable or custom industrial goods often use short direct channels (Producer → Consumer), whereas mass-market soap or noodles use longer channels through wholesalers and neighbourhood retailers. Digital marketing adds websites, search visibility and social media engagement.',
      terms: [
        ['Direct channel', 'Producer sells straight to final users with zero middlemen (e.g. farm stall or brand website)'],
        ['Intensive distribution', 'Stocking convenience goods in as many retail outlets as possible'],
        ['E-marketing', 'Using internet channels such as websites, email and social media to reach and serve buyers'],
      ],
      rules: [
        'Perishable items (fresh milk, bakery bread) require short, fast channels to prevent spoilage.',
        'Wholesalers break bulk, store inventory and extend trade credit to smaller retailers.',
      ],
      headers: ['Distribution intensity', 'Typical product'],
      rows: [
        ['Intensive', 'Sachet water, detergent, recharge cards'],
        ['Selective', 'Home appliances, branded footwear'],
        ['Exclusive', 'Luxury cars, bespoke designer outfits'],
      ],
      exQ: 'Why does a poultry farmer selling dressed chicken prefer a direct channel over a four-layer middleman chain?',
      exSteps: [
        ['Check product nature', 'Fresh meat spoils rapidly without cold chain'],
        ['Match channel', 'Direct delivery keeps meat fresh and cuts spoilage loss'],
      ],
      checkQ: 'Stocking everyday toothpaste in supermarkets, kiosks and pharmacies nationwide is an example of',
      checkO: ['intensive distribution', 'exclusive distribution', 'barter trade', 'reverse logistics'],
      checkH: ['Convenience goods should be within easy walking reach everywhere.', 'Think of maximum outlet coverage.'],
      checkE: 'Intensive distribution places convenience goods in as many outlets as possible.',
    },
    qs: [
      ['What is the very first step in conducting marketing research?', 'Defining the problem and research objectives', 'Printing colourful flyers', 'Hiring delivery vans', 'Cutting product prices', 'Clear problem definition prevents collecting irrelevant data.'],
      ['Observing which shelf height shoppers reach for most in a mall yields', 'primary data', 'secondary data', 'audited tax data', 'archived census data', 'Fresh observation gathered directly by the researcher is primary data.'],
      ['A company selling heavy custom factory turbines usually uses a', 'direct producer-to-buyer channel', 'hawker and kiosk channel', 'four-tier wholesale chain', 'vending machine network', 'Complex high-value industrial goods need direct technical negotiation.'],
      ['Which middleman buys in large bulk from manufacturers and sells in smaller lots to retailers?', 'Wholesaler', 'Final consumer', 'Freight insurer', 'Customs officer', 'Wholesalers break bulk between producers and retailers.'],
      ['Doubt or regret a buyer sometimes feels right after making a costly purchase is', 'post-purchase cognitive dissonance', 'market skimming', 'brand loyalty', 'price elasticity', 'Good after-sales support reduces post-purchase doubt.'],
      ['One key advantage of digital marketing for a small Nigerian craft shop is', 'reaching distant buyers at low cost with measurable clicks', 'eliminating the need for product quality', 'avoiding delivery of physical goods', 'banning customer reviews', 'Online channels let small firms reach wide audiences affordably.'],
    ],
  },
];

const OFFICEPRAC_SPECS: CompactTopicInput[] = [
  {
    id: 'op-office-organisation-mail',
    name: 'The office, organisational structure and mail handling',
    sec: 'Office administration',
    goals: [
      'Compare open-plan and partitioned office layouts and departmental functions',
      'Process incoming and outgoing mail systematically using standard registers',
    ],
    trap: 'Do not open mail marked "Confidential" or "Personal" in the general mailroom — log the envelope unopened and hand it straight to the named addressee.',
    p1: {
      title: 'Functions of an office and office layouts',
      idea: 'An office is the nerve centre of an organisation where information is received, recorded, processed, stored and communicated. Organisations choose between open-plan offices (large shared halls encouraging teamwork and lower rent) and cellular/partitioned offices (private rooms for confidential work and quiet focus).',
      terms: [
        ['Open-plan office', 'Large shared workspace without full floor-to-ceiling walls between desks'],
        ['Organisational chart', 'Diagram showing departments, roles and lines of authority from top management downwards'],
        ['Span of control', 'Number of subordinates reporting directly to one supervisor'],
      ],
      rules: [
        'Core office functions: receiving information, recording it, arranging/analysing it, giving information and safeguarding assets.',
        'Departments (Administration, Accounts, HR, Sales, Purchasing) coordinate through clear communication channels.',
      ],
      headers: ['Layout type', 'Main advantage & drawback'],
      rows: [
        ['Open-plan', 'Saves space and eases supervision; noisier with less privacy'],
        ['Partitioned (cellular)', 'Quiet and confidential; costlier lighting, space and partitions'],
      ],
      exQ: 'A law firm handles sensitive client divorce files every day. Which office layout best fits its lawyers’ desks?',
      exSteps: [
        ['Identify key need', 'High confidentiality and quiet concentration'],
        ['Choose layout', 'Partitioned/cellular offices'],
      ],
      checkQ: 'Which office layout saves floor space and makes supervision easy, though noise and lack of privacy can be drawbacks?',
      checkO: ['Open-plan office', 'Underground vault', 'Cellular private suite', 'Mobile kiosk'],
      checkH: ['Staff share one large room without solid internal walls.', 'Teamwork and lighting are shared.'],
      checkE: 'Open-plan offices save space and aid supervision while trading off privacy.',
    },
    p2: {
      title: 'Handling incoming and outgoing mail',
      idea: 'Disciplined mail handling stops invoices, cheques and official letters from getting lost. Incoming letters are sorted (urgent and private separated), opened (except confidential ones), date-stamped, entered in the Inward Mail Register, and routed. Outgoing letters are checked for signatures and enclosures, recorded in the Postage Book, franked or stamped, and dispatched.',
      terms: [
        ['Inward mail register', 'Logbook recording date, sender, subject and recipient department of every received letter'],
        ['Franking machine', 'Device that prints prepaid postal value directly onto outgoing envelopes'],
        ['Dispatch book', 'Register signed by recipients when hand-delivered letters or parcels are handed over'],
      ],
      rules: [
        'Never open envelopes marked Private, Personal or Confidential in the mailroom.',
        'Always verify that every enclosure mentioned in a letter is actually attached before sealing.',
      ],
      headers: ['Mail document', 'Purpose'],
      rows: [
        ['Inward mail register', 'Tracks every incoming letter and remittance'],
        ['Postage book', 'Controls petty cash spent on stamps and courier fees'],
        ['Dispatch book', 'Provides signed proof of hand delivery'],
      ],
      exQ: 'A mail clerk receives an envelope addressed to "The Principal — Confidential". What is the proper action?',
      exSteps: [
        ['Check marking', 'Confidential means mailroom staff must not open it'],
        ['Record and deliver', 'Log envelope details unopened and hand directly to the Principal'],
      ],
      checkQ: 'Which office machine prints prepaid postage impressions directly onto bulk outgoing envelopes?',
      checkO: ['Franking machine', 'Paper shredder', 'Guillotine trimmer', 'Laminator'],
      checkH: ['It replaces sticking individual paper postage stamps.', 'Post offices license businesses to reload credit on it.'],
      checkE: 'A franking machine imprints prepaid postage values on outgoing mail.',
    },
    qs: [
      ['Which department is primarily responsible for recruiting, training and maintaining staff welfare?', 'Human Resources (Personnel)', 'Purchasing', 'Transport', 'Maintenance', 'Human Resources manages recruitment, training and employee records.'],
      ['The diagram that shows the hierarchy and reporting lines inside a firm is an', 'organisational chart', 'invoice register', 'imprest voucher', 'attendance sheet', 'An organisational chart maps roles and lines of authority.'],
      ['When a mail clerk opens a routine letter and finds a cheque inside, they should immediately', 'record it in the remittance/inward register and pass it safely to Accounts', 'keep it in their pocket until Friday', 'throw away the envelope without checking the address', 'photocopy it for the noticeboard', 'Logging remittances immediately prevents loss or theft.'],
      ['Which book requires the receiving clerk to sign as proof that a messenger delivered a letter by hand?', 'Dispatch book', 'Petty cash book', 'Stock bin card', 'Minutes book', 'A dispatch book records signed acknowledgement of hand-delivered items.'],
      ['What should a secretary check before sealing an outgoing business letter?', 'Signature, correct address and all listed enclosures', 'Only the envelope colour', 'Whether the printer is unplugged', 'Only the sender’s favourite quote', 'Missing signatures or enclosures delay business transactions.'],
      ['An office machine used to destroy expired confidential paper documents into thin strips is a', 'paper shredder', 'binding machine', 'duplicator', 'photocopier', 'Shredders protect sensitive information when disposing of paper files.'],
    ],
  },
  {
    id: 'op-filing-meetings-communication',
    name: 'Filing systems, business communication and meetings',
    sec: 'Records & meetings',
    goals: [
      'Choose alphabetical, numerical, geographical or subject filing for office records',
      'Draft clear memos and understand notice, agenda, quorum and minutes of meetings',
    ],
    trap: 'Do not confuse an agenda (the list of items to be discussed BEFORE a meeting) with minutes (the official record of decisions taken DURING a meeting).',
    p1: {
      title: 'Filing methods and indexing',
      idea: 'Filing stores documents systematically so any record can be retrieved within seconds. Common classifications include alphabetical (by surname or firm name), numerical (file numbers linked to an index), geographical (by state or region) and subject filing (by topic such as Tax or Insurance). Out-cards (tracer cards) show who borrowed a file.',
      terms: [
        ['Filing', 'Systematic arrangement and safe storage of records for quick retrieval'],
        ['Cross-referencing', 'Placing a pointer sheet when a document could logically be looked up under two names'],
        ['Tracer (out) card', 'Card placed in a cabinet slot showing who removed a file and when'],
      ],
      rules: [
        'Centralised filing keeps all files in one registry with trained clerks; departmental filing keeps files inside each unit.',
        'Good filing is simple, compact, secure, economical and easy to expand.',
      ],
      headers: ['Filing method', 'Best suited for'],
      rows: [
        ['Alphabetical', 'Small offices and customer correspondence files'],
        ['Numerical', 'Hospitals, banks and universities with numbered folders'],
        ['Geographical', 'Sales branches organised by Nigerian states'],
        ['Subject', 'Projects and policy files grouped by topic'],
      ],
      exQ: 'A hospital assigns every patient a unique folder number (e.g. PT-04821) backed by an alphabetical name index. Name the filing method.',
      exSteps: [
        ['Look at folder sequence', 'Arranged by assigned numbers'],
        ['Identify method', 'Numerical filing'],
      ],
      checkQ: 'What is placed in a filing cabinet whenever a staff member borrows a folder so others know where it is?',
      checkO: ['A tracer (out) card', 'A blank cheque', 'An agenda sheet', 'A franking slip'],
      checkH: ['It traces who took the missing folder and the date borrowed.', 'Also called an out-card.'],
      checkE: 'A tracer (out) card records who borrowed a file and when it left the cabinet.',
    },
    p2: {
      title: 'Office communication and meeting procedures',
      idea: 'Internal office messages travel quickly via memoranda (memos), notices and email, while external communication uses formal business letters. Formal meetings require advance notice and an agenda, cannot take binding decisions without a quorum (minimum required attendance), are chaired impartially, and are recorded permanently in minutes.',
      terms: [
        ['Memorandum (Memo)', 'Brief written internal message between staff within the same organisation'],
        ['Agenda', 'Ordered list of items to be discussed at an upcoming meeting'],
        ['Quorum', 'Minimum number of eligible members required to be present for valid decisions'],
        ['Minutes', 'Official concise record of proceedings and resolutions passed at a meeting'],
      ],
      rules: [
        'A memo uses TO, FROM, DATE and SUBJECT headings without "Dear Sir" or "Yours faithfully".',
        'At the next meeting, previous minutes are read, corrected if needed, adopted and signed by the Chairperson.',
      ],
      headers: ['Meeting term', 'Role in the meeting'],
      rows: [
        ['Notice', 'Formal invitation stating date, time and venue'],
        ['Agenda', 'List of business items to cover'],
        ['Quorum', 'Minimum attendance needed to start valid business'],
        ['Minutes', 'Permanent record of resolutions taken'],
      ],
      exQ: 'A club constitution sets a quorum of 12 members. Only 9 arrive at 4:00 pm. Can the meeting pass binding budget votes?',
      exSteps: [
        ['Compare attendance with quorum', '9 < 12'],
        ['Conclude', 'No — the meeting lacks a quorum and must wait or adjourn'],
      ],
      checkQ: 'Which official document lists the items of business to be discussed before a meeting begins?',
      checkO: ['Agenda', 'Minutes', 'Voucher', 'Receipt'],
      checkH: ['Minutes are written after the meeting; this list is circulated beforehand.', 'Members prepare their contributions from it.'],
      checkE: 'The agenda is the advance schedule of items to be discussed at a meeting.',
    },
    qs: [
      ['Which filing system arranges folders by Lagos, Kano, Rivers and Oyo sales territories?', 'Geographical filing', 'Chronological filing', 'Alphabetical filing', 'Numerical filing', 'Grouping records by location or region is geographical filing.'],
      ['A short written message sent from the Accounts Manager to the Storekeeper inside the same company is a', 'memorandum (memo)', 'bill of lading', 'letter of credit', 'manifest', 'Memos are designed for internal organisational communication.'],
      ['What is the minimum number of members needed for a meeting’s decisions to be legally valid?', 'Quorum', 'Motion', 'Proxy', 'Adjournment', 'Without a quorum, formal resolutions are invalid.'],
      ['Who keeps the official minutes and issues the notice and agenda of a committee meeting?', 'The Secretary', 'The Gatekeeper', 'The External Auditor', 'The Courier', 'The Secretary prepares notices, agendas and minutes.'],
      ['A formal proposal put forward for discussion and voting during a meeting is called a', 'motion', 'memo', 'voucher', 'ledger', 'Once a motion is voted on and passed, it becomes a resolution.'],
      ['Why is cross-referencing used in an office filing system?', 'To help clerks locate a document that could be filed under more than one name or subject', 'To delete old files automatically', 'To increase postage charges', 'To lock cabinets permanently', 'Cross-reference sheets prevent wasted searches when a file fits two headings.'],
    ],
  },
];

const INSURANCE_SPECS: CompactTopicInput[] = [
  {
    id: 'ins-risk-principles',
    name: 'Risk, nature of insurance and core principles',
    sec: 'Foundations of insurance',
    goals: [
      'Distinguish insurable pure risks from uninsurable speculative risks',
      'Apply utmost good faith, insurable interest, indemnity, subrogation and contribution',
    ],
    trap: 'Do not confuse indemnity (restoring the insured to their pre-loss position without profit) with life assurance (which pays an agreed fixed sum because human life cannot be valued in cash).',
    p1: {
      title: 'Pure vs speculative risk and pooling',
      idea: 'Insurance transfers financial uncertainty from one person or firm to a shared pool managed by an insurer. Only pure risks (where only loss or no loss can happen, like fire or theft) are insurable. Speculative risks (starting a new business or buying shares where profit or loss can occur) are not insurable.',
      terms: [
        ['Premium', 'Regular payment made by the policyholder to the insurer for financial protection'],
        ['Pure risk', 'Situation offering only the chance of loss or break-even (e.g. fire, accident); insurable'],
        ['Speculative risk', 'Situation offering a chance of gain as well as loss (e.g. gambling, price swings); uninsurable'],
      ],
      rules: [
        'Insurance works through the law of large numbers: small premiums from many policyholders pay the heavy losses of the unfortunate few.',
        'An actuary calculates fair premiums using historical loss statistics.',
      ],
      headers: ['Risk type', 'Can it be insured?'],
      rows: [
        ['Pure risk (fire, motor crash, burglary)', 'Yes — measurable chance of loss only'],
        ['Speculative risk (fashion shift, share trading)', 'No — includes chance of profit'],
      ],
      exQ: 'A trader wants to insure her shop against fire and also against failing to make profit if shoppers dislike her fabrics. Which risk can be insured?',
      exSteps: [
        ['Check fire damage', 'Pure risk — insurable'],
        ['Check poor sales/profit', 'Speculative business risk — uninsurable'],
      ],
      checkQ: 'Which type of risk is insurable because it involves only the possibility of loss or no loss, never profit?',
      checkO: ['Pure risk', 'Speculative risk', 'Gambling risk', 'Market fashion risk'],
      checkH: ['Insurance compensates loss; it does not guarantee business profits.', 'Fire and theft are examples.'],
      checkE: 'Pure risks involve only loss or no loss and are insurable.',
    },
    p2: {
      title: 'The six core principles of insurance',
      idea: 'Insurance contracts rest on six strict legal principles: Insurable Interest (you must suffer financial loss if the item is damaged), Utmost Good Faith / Uberrimae Fidei (honest disclosure of all material facts), Indemnity (no profit from a loss), Proximate Cause (the immediate active cause must be covered), Contribution (multiple insurers share one loss) and Subrogation (after paying you, the insurer takes over your right to recover from the negligent third party).',
      terms: [
        ['Utmost good faith', 'Duty on both insurer and applicant to disclose all material facts truthfully'],
        ['Indemnity', 'Restoring the insured financially to the exact position before the loss, no richer'],
        ['Subrogation', 'Insurer’s right, after paying a claim, to step into the insured’s shoes and pursue the guilty third party'],
        ['Proximate cause', 'The dominant, direct cause that set off the chain of events leading to loss'],
      ],
      rules: [
        'Concealing a material fact (like an existing engine fault or prior fire) entitles the insurer to void the policy.',
        'Contribution prevents a policyholder from claiming full compensation twice from two different insurers for the same fire.',
      ],
      headers: ['Principle', 'Core safeguard'],
      rows: [
        ['Insurable interest', 'Stops people insuring strangers’ houses like a bet'],
        ['Indemnity', 'Prevents profiting from a claim'],
        ['Contribution', 'Splits a single loss fairly across multiple insurers'],
        ['Subrogation', 'Stops insured from collecting from both insurer and guilty party'],
      ],
      exQ: 'A shop worth ₦10 million is insured with Insurer A for ₦10 million and Insurer B for ₦10 million. Fire destroys ₦4 million of stock. How much does each pay?',
      exSteps: [
        ['Apply contribution', 'Total payout cannot exceed actual loss of ₦4 million'],
        ['Split equally (1:1)', 'Each insurer pays ₦2 million'],
      ],
      checkQ: 'After paying a car owner in full for a crash caused by a reckless lorry driver, the insurer sues the lorry company to recover the money. Which principle applies?',
      checkO: ['Subrogation', 'Contribution', 'Utmost good faith', 'Average clause'],
      checkH: ['The insurer steps into the policyholder’s legal rights against the third party.', 'Starts with "Sub-".'],
      checkE: 'Subrogation transfers recovery rights against a negligent third party to the insurer after claim settlement.',
    },
    qs: [
      ['The consideration paid by an insured person to an insurance company for cover is called the', 'premium', 'dividend', 'interest', 'commission', 'Premium is the fee paid for insurance protection.'],
      ['Hiding a serious pre-existing heart condition on a life proposal form breaches the principle of', 'utmost good faith', 'subrogation', 'contribution', 'proximate cause', 'Utmost good faith requires full disclosure of all material facts.'],
      ['Why can you not insure your neighbour’s car in your own name?', 'You lack insurable interest in the car', 'Cars are uninsurable', 'Only banks may buy motor insurance', 'Premiums are illegal', 'Insurable interest requires a direct legal or financial stake in the subject matter.'],
      ['Which principle ensures that an insured person does not make a profit out of a property loss?', 'Indemnity', 'Speculation', 'Underwriting', 'Brokerage', 'Indemnity restores the insured to their pre-loss financial position only.'],
      ['A cargo insured against storm damage is ruined solely because rats chewed the sacks in calm weather. Under proximate cause, the insurer will', 'reject the claim because rats are not an insured peril', 'pay double the cargo value', 'insure the rats', 'cancel maritime law', 'Proximate cause checks whether the dominant cause of loss is an insured peril.'],
      ['The specialist who uses statistics and probability to calculate insurance premiums is an', 'actuary', 'auctioneer', 'stevedore', 'curator', 'Actuaries model risk probabilities to price premiums accurately.'],
    ],
  },
  {
    id: 'ins-classes-policies-claims',
    name: 'Classes of insurance, policies and claims settlement',
    sec: 'Policies & claims',
    goals: [
      'Differentiate life assurance, motor, fire, marine and fidelity guarantee policies',
      'Explain underwriting, proposal forms, cover notes and claims settlement steps',
    ],
    trap: 'Do not confuse Third-Party motor insurance (minimum statutory cover for injury/damage to OTHER people) with Comprehensive cover (which also covers damage or theft of YOUR own car).',
    p1: {
      title: 'Major classes of insurance in Nigeria',
      idea: 'Insurance splits into Life Assurance (whole life and endowment policies covering events certain to occur — death or maturity) and General Insurance (Motor, Fire, Marine, Burglary, Fidelity Guarantee and Public Liability). In Nigeria, NAICOM regulates insurers and Third-Party motor insurance is mandatory by law.',
      terms: [
        ['Third-party motor cover', 'Statutory minimum cover paying for death, injury or property damage caused to other road users'],
        ['Comprehensive motor cover', 'Broad cover protecting third parties AND the policyholder’s own vehicle against crash, fire or theft'],
        ['Fidelity guarantee', 'Policy protecting an employer against theft or fraud committed by employees handling cash'],
      ],
      rules: [
        'Use "assurance" for life policies (death or maturity is certain); use "insurance" for risks that may or may not happen.',
        'Endowment policies combine life protection with savings paid at a chosen maturity date.',
      ],
      headers: ['Policy class', 'What it protects'],
      rows: [
        ['Endowment assurance', 'Pays sum assured on maturity date or earlier death'],
        ['Comprehensive motor', 'Third parties + own vehicle damage, fire and theft'],
        ['Marine cargo', 'Goods shipped by sea against maritime perils'],
        ['Fidelity guarantee', 'Employer loss from dishonest staff'],
      ],
      exQ: 'A supermarket owner worries that a cashier might embezzle daily takings. Which policy protects the business?',
      exSteps: [
        ['Identify risk', 'Employee dishonesty with company money'],
        ['Match policy', 'Fidelity guarantee insurance'],
      ],
      checkQ: 'Which motor policy is the compulsory legal minimum required to drive on Nigerian public roads?',
      checkO: ['Third-party motor insurance', 'Marine hull insurance', 'Whole-life assurance', 'Aviation cargo cover'],
      checkH: ['It protects pedestrians and other motorists if you cause an accident.', 'Comprehensive is optional; this one is mandatory by law.'],
      checkE: 'Third-party motor insurance is the statutory minimum cover on Nigerian roads.',
    },
    p2: {
      title: 'Proposal forms, cover notes, reinsurance and claims',
      idea: 'Buying cover starts with filling a Proposal Form truthfully. While the formal Policy Document is being prepared, the insurer issues a temporary Cover Note. For giant risks like oil rigs or aircraft, insurers spread exposure using Reinsurance. When loss occurs, the insured notifies the insurer promptly, submits a Claim Form, a Loss Adjuster assesses damage, and the insurer settles by cash, repair, replacement or reinstatement.',
      terms: [
        ['Cover note', 'Temporary written proof of insurance issued while the full policy document is prepared'],
        ['Reinsurance', 'Insurer transferring part of a very large risk to another insurance company'],
        ['Loss adjuster', 'Independent specialist who investigates and values a major insurance claim'],
      ],
      rules: [
        'Report any insured accident or fire promptly and obtain a police report where required (e.g. theft or road crash).',
        'Under the average clause, if you under-insure a ₦10m house for ₦5m, the insurer pays only half (5/10) of any partial loss.',
      ],
      headers: ['Document / role', 'Function'],
      rows: [
        ['Proposal form', 'Applicant’s formal questionnaire declaring material facts'],
        ['Cover note', 'Immediate temporary evidence of cover'],
        ['Loss adjuster', 'Assesses fair value of damage on a claim'],
      ],
      exQ: 'A warehouse worth ₦20m is insured for ₦10m under a fire policy with an average clause. Fire causes ₦4m damage. How much does the insurer pay?',
      exSteps: [
        ['Apply average clause formula', 'Claim = (Sum Insured ÷ Actual Value) × Loss'],
        ['Calculate payout', '(10m ÷ 20m) × ₦4m = ₦2m'],
      ],
      checkQ: 'Why do insurance companies buy reinsurance for huge risks like commercial aircraft or refineries?',
      checkO: ['To share catastrophic exposure so one major disaster does not bankrupt the insurer', 'To avoid issuing policy documents', 'To double the customer’s loss', 'To replace third-party motor laws'],
      checkH: ['Even big insurers can be wiped out by one giant claim.', 'Think of insurance for insurance companies.'],
      checkE: 'Reinsurance spreads mega-risks across multiple insurers to preserve solvency.',
    },
    qs: [
      ['Which regulatory body supervises insurance companies in Nigeria?', 'NAICOM (National Insurance Commission)', 'NAFDAC', 'FRSC', 'NCC', 'NAICOM regulates and supervises the Nigerian insurance industry.'],
      ['A life policy that pays the sum assured either after 15 years or upon earlier death is an', 'endowment policy', 'third-party policy', 'fidelity policy', 'marine voyage policy', 'Endowment policies pay at maturity or earlier death.'],
      ['Which temporary document proves a motorist is insured while waiting for the permanent certificate?', 'Cover note', 'Bill of exchange', 'Credit note', 'Waybill', 'A cover note grants immediate temporary proof of cover.'],
      ['When an insurer settles a damaged building claim by rebuilding the structure itself, the method is called', 'reinstatement', 'brokerage', 'reinsurance', 'underwriting', 'Reinstatement restores the damaged property directly.'],
      ['An insurance intermediary who represents the client and shops across several insurers for the best policy is a', 'broker', 'loss adjuster', 'underwriter', 'actuary', 'Insurance brokers act independently on behalf of policyholders.'],
      ['Under an average clause, deliberately insuring a ₦12m building for only ₦6m results in', 'receiving only half of any partial loss claim', 'receiving double compensation', 'free fire-fighting equipment', 'automatic policy renewal', 'Under-insurance penalises partial claims proportionally under the average clause.'],
    ],
  },
];

const STOREMGT_SPECS: CompactTopicInput[] = [
  {
    id: 'sm-receiving-bin-stock-control',
    name: 'Storekeeping, receiving goods and stock control levels',
    sec: 'Inventory control',
    goals: [
      'Verify deliveries using purchase orders, delivery notes and goods received notes',
      'Compute minimum, maximum and re-order stock levels to prevent stock-outs',
    ],
    trap: 'Do not confuse a Bin Card (kept beside the physical shelf showing quantities ONLY) with a Stores Ledger Card (kept in Accounts showing quantities AND monetary values).',
    p1: {
      title: 'Receiving, inspecting and recording stock',
      idea: 'A storekeeper safeguards raw materials, spare parts and finished goods from arrival to issue. When a lorry arrives, the storekeeper checks items against the Purchase Order and supplier’s Delivery Note, inspects quality, logs shortages, prepares a Goods Received Note (GRN), updates the Bin Card on the rack, and issues stock only against an authorised Materials Requisition Note.',
      terms: [
        ['Goods Received Note (GRN)', 'Internal store document confirming quantity and condition of accepted deliveries'],
        ['Bin card', 'Quantity-only stock record kept directly beside each storage bin or rack'],
        ['Materials requisition', 'Authorised written request required before a storekeeper releases items to a department'],
      ],
      rules: [
        'Never release stock verbally; always demand a signed Materials Requisition Note.',
        'Bin cards record Receipts, Issues and Balance in physical units only — no naira prices.',
      ],
      headers: ['Store document', 'Who keeps it & what it shows'],
      rows: [
        ['Bin card', 'Storekeeper; quantities received, issued and remaining'],
        ['Stores ledger card', 'Accounts department; quantities AND unit/total values'],
        ['Goods Received Note', 'Confirming verified delivery to Purchasing and Accounts'],
      ],
      exQ: 'A factory supervisor asks the storekeeper for 20 litres of engine oil without a written form. What should the storekeeper do?',
      exSteps: [
        ['Check control rule', 'All stock issues require written authorisation'],
        ['Action', 'Politely request a signed Materials Requisition Note before releasing the oil'],
      ],
      checkQ: 'What is the key difference between a Bin Card and a Stores Ledger Card?',
      checkO: ['A bin card shows quantities only, whereas a stores ledger card shows both quantities and values', 'A bin card is kept in a bank vault', 'A stores ledger card never records issues', 'A bin card is sent to suppliers as payment'],
      checkH: ['Storekeepers track unit counts at the rack; Accounts tracks naira cost.', 'Compare units vs money.'],
      checkE: 'Bin cards track quantities only; stores ledger cards record both quantities and values.',
    },
    p2: {
      title: 'Re-order, minimum and maximum stock levels',
      idea: 'Holding too much stock ties up cash and risks spoilage; holding too little halts production (stock-out). Store managers compute exact control levels using daily usage and supplier lead time (waiting days from ordering to delivery): Re-order Level = Max Usage × Max Lead Time.',
      terms: [
        ['Lead time', 'Period between placing a purchase order and receiving the goods in store'],
        ['Re-order level', 'Stock quantity that triggers raising a fresh purchase order'],
        ['Buffer (minimum) stock', 'Safety reserve kept to guard against unexpected spikes in usage or delivery delays'],
      ],
      rules: [
        'Re-order Level = Maximum Usage × Maximum Lead Time.',
        'Minimum Stock = Re-order Level − (Normal Usage × Normal Lead Time).',
      ],
      headers: ['Stock level', 'Formula'],
      rows: [
        ['Re-order level', 'Max usage × Max lead time'],
        ['Minimum level', 'Re-order level − (Normal usage × Normal lead time)'],
        ['Maximum level', 'Re-order level + Re-order qty − (Min usage × Min lead time)'],
      ],
      exQ: 'A bakery uses between 20 and 30 bags of flour daily, and delivery takes 3 to 5 days. Calculate the Re-order Level.',
      exSteps: [
        ['Pick maximum usage and maximum lead time', 'Max usage = 30 bags/day; Max lead time = 5 days'],
        ['Multiply', '30 × 5 = 150 bags'],
      ],
      checkQ: 'If maximum daily usage is 40 units and maximum supplier lead time is 6 days, what is the re-order level?',
      checkO: ['240 units', '46 units', '120 units', '60 units'],
      checkH: ['Re-order Level = Maximum Usage × Maximum Lead Time.', 'Multiply 40 by 6.'],
      checkE: '40 units/day × 6 days = 240 units.',
    },
    qs: [
      ['Which document is prepared by the storekeeper to confirm that delivered goods were counted and found in good condition?', 'Goods Received Note (GRN)', 'Debit note', 'Sales invoice', 'Bank statement', 'The GRN verifies accepted deliveries for Accounts and Purchasing.'],
      ['Where is a Bin Card normally kept?', 'Attached to or right beside the physical storage rack or bin', 'In the Managing Director’s car', 'At the tax office', 'Inside the supplier’s factory', 'Bin cards sit with the stock for instant quantity updates.'],
      ['The waiting period between sending an order to a supplier and receiving the goods is called', 'lead time', 'shelf life', 'grace period', 'depreciation', 'Lead time determines how early a new order must be placed.'],
      ['Running completely out of a vital raw material so factory machines stand idle is called a', 'stock-out', 'stock-take', 'stock-split', 'surplus', 'Stock-outs cause lost output and customer dissatisfaction.'],
      ['If re-order level is 200 units, normal daily usage is 25 units and normal lead time is 4 days, what is the minimum stock level?', '100 units', '300 units', '50 units', '225 units', 'Minimum stock = 200 − (25 × 4) = 100 units.'],
      ['Which document must be signed by a department head before materials leave the store?', 'Materials Requisition Note', 'Quotation', 'Catalogue', 'Payslip', 'Authorised requisitions prevent unauthorised withdrawals.'],
    ],
  },
  {
    id: 'sm-valuation-stocktaking-safety',
    name: 'Stock valuation (FIFO/LIFO), stocktaking and store safety',
    sec: 'Valuation & warehousing',
    goals: [
      'Price stock issues accurately using FIFO, LIFO and Weighted Average methods',
      'Compare periodic vs perpetual stocktaking and enforce warehouse safety rules',
    ],
    trap: 'Do not confuse physical rotation of goods (always issue older perishables first so they do not expire) with accounting valuation methods like FIFO or Weighted Average.',
    p1: {
      title: 'FIFO, LIFO and Weighted Average pricing',
      idea: 'When identical raw materials are bought at different prices during inflation, store accountants must price each issue consistently. FIFO (First-In, First-Out) prices issues using the oldest batch cost first, leaving closing stock valued at recent prices. LIFO prices issues from the newest batch first. Weighted Average divides total cost by total units to get one smooth unit cost.',
      terms: [
        ['FIFO (First-In, First-Out)', 'Assumes earliest purchased units are issued first; closing stock reflects current costs'],
        ['LIFO (Last-In, First-Out)', 'Assumes most recently purchased units are issued first'],
        ['Weighted average (AVCO)', 'Recalculates average unit cost = Total cost ÷ Total units in store'],
      ],
      rules: [
        'During rising prices, FIFO reports a higher closing stock value and higher profit than LIFO.',
        'Perishable goods (medicines, food) must always be physically rotated FIFO regardless of accounting method.',
      ],
      headers: ['Method', 'Effect when prices are rising'],
      rows: [
        ['FIFO', 'Lower cost of issues, higher closing stock valuation'],
        ['LIFO', 'Higher cost of issues, lower closing stock valuation'],
        ['Weighted average', 'Smooths out price spikes between FIFO and LIFO'],
      ],
      exQ: 'Store receives 10 units at ₦100 on Day 1 and 10 units at ₦140 on Day 2. On Day 3, 12 units are issued under FIFO. Find the cost of the 12 issued units.',
      exSteps: [
        ['Take all 10 oldest units first', '10 × ₦100 = ₦1,000'],
        ['Take remaining 2 units from Day 2 batch', '2 × ₦140 = ₦280; Total = ₦1,280'],
      ],
      checkQ: 'Under FIFO, if a store bought 5 tins at ₦200 and later 5 tins at ₦300, what is the cost of issuing 6 tins?',
      checkO: ['₦1,300', '₦1,700', '₦1,500', '₦1,200'],
      checkH: ['Issue all 5 older tins at ₦200 first.', 'Add 1 tin from the ₦300 batch: ₦1,000 + ₦300.'],
      checkE: '(5 × ₦200) + (1 × ₦300) = ₦1,300.',
    },
    p2: {
      title: 'Stocktaking and warehouse safety',
      idea: 'Stocktaking physically counts items on shelves and compares them with bin cards to uncover theft, breakage or clerical errors. Periodic stocktaking closes the store once a year for a full count; continuous (perpetual) stocktaking counts a few items every week without halting work. Good stores also keep aisles clear, heavy loads low, fire extinguishers ready and inflammable items isolated.',
      terms: [
        ['Periodic stocktaking', 'Full physical count of all store items at fixed intervals such as year-end'],
        ['Continuous stocktaking', 'Rolling count of selected stock items throughout the year without closing the store'],
        ['ABC analysis', 'Classifying stock into A (high-value tight control), B (moderate) and C (low-value bulk)'],
      ],
      rules: [
        'Store heavy bulky cartons on bottom shelves and lighter items higher up to prevent toppling.',
        'Clearly label hazardous chemicals and keep emergency exits and fire extinguishers completely unobstructed.',
      ],
      headers: ['Stocktaking type', 'Key advantage'],
      rows: [
        ['Periodic', 'Complete snapshot on one balance-sheet date'],
        ['Continuous', 'No production shutdown; catches discrepancies early'],
      ],
      exQ: 'Why does a busy 24-hour beverage factory prefer continuous stocktaking over shutting down its warehouse for a week?',
      exSteps: [
        ['Check operational impact', 'Closing stops bottling lines and customer deliveries'],
        ['Explain benefit', 'Continuous stocktaking verifies counts steadily without halting operations'],
      ],
      checkQ: 'In ABC inventory control, which category receives the tightest security and most frequent checks?',
      checkO: ['Category A (few items accounting for the highest total value)', 'Category C (cheap abundant bolts and pins)', 'Expired waste cartons', 'Broken wooden pallets'],
      checkH: ['Think of the 80/20 rule in warehousing.', 'Protect the smallest group of items that hold most of the naira value.'],
      checkE: 'Category A items represent the highest monetary value and receive the strictest control.',
    },
    qs: [
      ['A store holds 40 units costing ₦8,000 in total. Under the Weighted Average method, the unit issue price is', '₦200', '₦400', '₦160', '₦80', '₦8,000 ÷ 40 units = ₦200 per unit.'],
      ['When purchase prices are rising steadily, which method values closing inventory highest?', 'FIFO', 'LIFO', 'Scrap valuation', 'Zero costing', 'FIFO leaves the newest, higher-priced batches in closing stock.'],
      ['Counting a small selection of items every week throughout the year without shutting the warehouse is', 'continuous stocktaking', 'annual closure', 'blind ordering', 'liquidation', 'Continuous stocktaking verifies stock steadily with zero downtime.'],
      ['Where should the heaviest boxes be stacked on warehouse racking?', 'On the lowest shelves or floor pallets', 'On the very top shelf', 'Blocking the fire exit', 'On top of fragile glass cartons', 'Keeping heavy loads low lowers the centre of gravity and prevents injury.'],
      ['Items that remain unused in store for years because product designs changed are called', 'obsolete stock', 'buffer stock', 'fast-moving stock', 'consignment stock', 'Obsolete stock has lost usefulness due to design or technology changes.'],
      ['Which piece of handling equipment is best for lifting heavy palletised loads onto high warehouse racks?', 'Forklift truck', 'Wheelbarrow', 'Hand broom', 'Stapler', 'Forklifts safely lift and stack heavy pallet loads.'],
    ],
  },
];

const BOOKKEEP_SPECS: CompactTopicInput[] = [
  {
    id: 'bk-source-docs-double-entry',
    name: 'Source documents, books of original entry and double entry',
    sec: 'Recording transactions',
    goals: [
      'Match invoices, receipts, credit notes and vouchers to the right day books',
      'Apply the double-entry rule accurately across asset, liability, income and expense accounts',
    ],
    trap: 'Do not enter cash sales in the Sales Day Book — the Sales Day Book records CREDIT sales only; cash sales go straight into the Cash Book.',
    p1: {
      title: 'Source documents and subsidiary day books',
      idea: 'Every bookkeeping entry starts with a paper or digital proof called a source document: Invoices support credit sales/purchases, Credit Notes record returns, Receipts prove cash paid, and Petty Cash Vouchers support minor spending. Similar transactions are first listed in Books of Original Entry (day books) before posting to the ledger.',
      terms: [
        ['Source document', 'Original written proof of a business transaction (invoice, receipt, credit note)'],
        ['Sales day book', 'Book of original entry listing all credit sales of goods'],
        ['Credit note', 'Document sent by a seller reducing a buyer’s debt after goods are returned or overcharged'],
      ],
      rules: [
        'Sales Day Book & Purchases Day Book record CREDIT transactions of goods for resale only.',
        'Buying a delivery van on credit goes into the General Journal, not the Purchases Day Book.',
      ],
      headers: ['Transaction', 'Book of original entry'],
      rows: [
        ['Credit sale of trading goods', 'Sales Day Book'],
        ['Customer returns damaged goods', 'Returns Inwards (Sales Returns) Journal'],
        ['Cash or cheque received/paid', 'Cash Book'],
        ['Buying machinery on credit', 'General Journal (Journal Proper)'],
      ],
      exQ: 'A stationery shop buys ₦40,000 of exercise books on credit for resale and returns ₦5,000 worth of torn copies. Name the two day books used.',
      exSteps: [
        ['Credit purchase for resale', 'Purchases Day Book'],
        ['Returning goods to supplier', 'Returns Outwards (Purchases Returns) Journal'],
      ],
      checkQ: 'Which book of original entry records the purchase of a computer on credit for office use (not for resale)?',
      checkO: ['General Journal', 'Purchases Day Book', 'Sales Day Book', 'Petty Cash Book'],
      checkH: ['The Purchases Day Book is strictly for trading stock bought to resell.', 'Non-routine entries use the journal proper.'],
      checkE: 'Credit purchases of non-current assets like office computers are recorded in the General Journal.',
    },
    p2: {
      title: 'The golden rule of double entry and the accounting equation',
      idea: 'Bookkeeping rests on Assets = Capital + Liabilities. Every transaction affects at least two accounts equally: one Debit (Dr) and one Credit (Cr). Assets and Expenses increase on the Debit side; Liabilities, Capital and Revenues increase on the Credit side.',
      terms: [
        ['Double entry', 'Recording every transaction twice — once as a debit and once as an equal credit'],
        ['Debit (Dr)', 'Left-hand side of a ledger account (increases assets and expenses)'],
        ['Credit (Cr)', 'Right-hand side of a ledger account (increases liabilities, capital and income)'],
      ],
      rules: [
        'DEAD CLIC memory aid: Debit Expenses, Assets, Drawings; Credit Liabilities, Income, Capital.',
        'Total debits must ALWAYS equal total credits for every single entry.',
      ],
      headers: ['Account type', 'To increase', 'To decrease'],
      rows: [
        ['Asset / Expense', 'Debit (Dr)', 'Credit (Cr)'],
        ['Liability / Capital / Income', 'Credit (Cr)', 'Debit (Dr)'],
      ],
      exQ: 'The owner pays ₦250,000 rent by bank transfer. State the debit and credit entries.',
      exSteps: [
        ['Rent is an expense increasing', 'Debit Rent Expense ₦250,000'],
        ['Bank is an asset decreasing', 'Credit Bank Account ₦250,000'],
      ],
      checkQ: 'A business buys office furniture for ₦180,000 cash. What is the correct double entry?',
      checkO: ['Debit Furniture ₦180,000; Credit Cash ₦180,000', 'Debit Cash ₦180,000; Credit Furniture ₦180,000', 'Debit Purchases ₦180,000; Credit Sales ₦180,000', 'Debit Capital ₦180,000; Credit Cash ₦180,000'],
      checkH: ['Furniture (an asset) increases; Cash (an asset) decreases.', 'Increase an asset on the Debit side, decrease on the Credit side.'],
      checkE: 'Debit Furniture (asset increases) and Credit Cash (asset decreases).',
    },
    qs: [
      ['Which source document does a seller issue when a buyer returns defective goods?', 'Credit note', 'Pay-in slip', 'Purchase order', 'Waybill', 'A credit note reduces the amount owed by the customer.'],
      ['If Assets = ₦950,000 and Liabilities = ₦320,000, what is the owner’s Capital?', '₦630,000', '₦1,270,000', '₦320,000', '₦600,000', 'Capital = Assets − Liabilities = ₦950,000 − ₦320,000 = ₦630,000.'],
      ['Cash sales of ₦45,000 are recorded first in the', 'Cash Book', 'Sales Day Book', 'Returns Inwards Journal', 'Purchases Ledger', 'The Cash Book captures all cash and bank receipts and payments.'],
      ['When a business receives ₦60,000 cash from a credit customer (Amina), the entry is', 'Debit Cash ₦60,000; Credit Amina ₦60,000', 'Debit Amina ₦60,000; Credit Cash ₦60,000', 'Debit Sales ₦60,000; Credit Amina ₦60,000', 'Debit Capital ₦60,000; Credit Cash ₦60,000', 'Cash (asset) increases on Debit; customer balance decreases on Credit.'],
      ['Goods taken by the business owner for personal family use are debited to', 'Drawings Account', 'Rent Account', 'Sales Account', 'Bank Account', 'Personal withdrawals by the owner are recorded as Drawings.'],
      ['Which book serves as BOTH a book of original entry AND a ledger account?', 'Cash Book', 'Sales Day Book', 'Purchases Day Book', 'Returns Outwards Book', 'The Cash Book records receipts/payments first and also acts as the cash/bank ledger.'],
    ],
  },
  {
    id: 'bk-cashbook-trial-balance-final',
    name: 'Cash book, petty cash imprest, trial balance and final accounts',
    sec: 'Controls & statements',
    goals: [
      'Record three-column cash books, contra entries and petty cash imprest reimbursements',
      'Prepare a trial balance and simple trading, profit and loss account and balance sheet',
    ],
    trap: 'Do not assume a balanced Trial Balance proves there are zero errors — errors of omission, commission, principle and complete reversal still allow totals to agree!',
    p1: {
      title: 'Three-column cash book and petty cash imprest',
      idea: 'A Three-Column Cash Book tracks Cash, Bank and Cash Discounts (Discount Allowed on Dr, Discount Received on Cr). Moving cash from the office till into the bank (or withdrawing cash for office use) is a Contra Entry marked "C". Small expenses like postage and tea use a Petty Cash Book run on the Imprest System, where the float is topped up to the exact starting amount each period.',
      terms: [
        ['Contra entry', 'Entry appearing on both debit and credit sides of the cash book (cash banked or withdrawn for office)'],
        ['Imprest system', 'Petty cash method where the cashier is reimbursed the exact sum spent to restore the fixed float'],
        ['Cash discount', 'Allowance for prompt payment (Allowed is an expense; Received is income)'],
      ],
      rules: [
        'Discount columns are memorandum totals — they are NEVER balanced off; total Discount Allowed posts to Dr of Discount Allowed Account.',
        'Imprest Reimbursement = Amount spent during the period, restoring Petty Cash to the fixed float.',
      ],
      headers: ['Cash book column', 'What goes there'],
      rows: [
        ['Discount Allowed (Dr)', 'Cash discount granted to customers who pay promptly'],
        ['Discount Received (Cr)', 'Cash discount earned from suppliers for early payment'],
        ['Contra (C)', 'Cash deposited into bank or withdrawn from bank to till'],
      ],
      exQ: 'A petty cashier starts the week with an imprest float of ₦20,000 and spends ₦13,400 on stamps and transport. How much reimbursement restores the float?',
      exSteps: [
        ['Check closing cash', '₦20,000 − ₦13,400 = ₦6,600 left'],
        ['Calculate top-up', 'Reimbursement = exact amount spent = ₦13,400'],
      ],
      checkQ: 'Depositing ₦100,000 from the office cash till into the company bank account is recorded as a',
      checkO: ['contra entry (Debit Bank, Credit Cash)', 'credit sale', 'bad debt write-off', 'trade discount'],
      checkH: ['Both Cash and Bank live inside the same Cash Book.', 'Cash drops while Bank rises by ₦100,000.'],
      checkE: 'Banking office cash is a contra entry: Debit Bank, Credit Cash.',
    },
    p2: {
      title: 'Trial balance and basic final accounts',
      idea: 'At period end, every ledger balance is listed in a Trial Balance to verify arithmetical accuracy (Dr = Cr). From it, the bookkeeper builds the Trading Account (Sales − Cost of Goods Sold = Gross Profit), the Profit and Loss Account (Gross Profit + Other Income − Expenses = Net Profit), and the Balance Sheet (Assets = Capital + Net Profit − Drawings + Liabilities).',
      terms: [
        ['Trial balance', 'Two-column list of all closing ledger balances verifying total debits equal total credits'],
        ['Gross profit', 'Net sales minus cost of goods sold'],
        ['Net profit', 'Gross profit plus other incomes minus operating expenses'],
      ],
      rules: [
        'Cost of Goods Sold = Opening Stock + Net Purchases + Carriage Inwards − Closing Stock.',
        'Carriage Inwards adds to Purchases in the Trading Account; Carriage Outwards is an expense in Profit and Loss.',
      ],
      headers: ['Financial statement', 'Main result shown'],
      rows: [
        ['Trading Account', 'Gross Profit (or Gross Loss)'],
        ['Profit & Loss Account', 'Net Profit (or Net Loss)'],
        ['Balance Sheet', 'Financial position (Assets, Capital, Liabilities) at a date'],
      ],
      exQ: 'Sales = ₦500,000; Opening Stock = ₦60,000; Purchases = ₦310,000; Closing Stock = ₦70,000. Calculate Gross Profit.',
      exSteps: [
        ['Find Cost of Goods Sold', '₦60,000 + ₦310,000 − ₦70,000 = ₦300,000'],
        ['Subtract from Sales', '₦500,000 − ₦300,000 = ₦200,000 Gross Profit'],
      ],
      checkQ: 'Which transport charge is added to Purchases inside the Trading Account?',
      checkO: ['Carriage inwards', 'Carriage outwards', 'Staff bus allowance', 'Delivery van insurance'],
      checkH: ['It is the cost of bringing bought stock IN to your shop.', 'Delivery out to customers belongs in Profit & Loss.'],
      checkE: 'Carriage inwards is part of the cost of acquiring stock and goes in the Trading Account.',
    },
    qs: [
      ['An office keeps a ₦15,000 petty cash imprest and spends ₦11,200 in March. What amount is reimbursed to begin April?', '₦11,200', '₦3,800', '₦15,000', '₦26,200', 'Under the imprest system, reimbursement equals exact expenditure (₦11,200).'],
      ['Which error will STILL allow a Trial Balance to agree?', 'Completely omitting a ₦10,000 credit sale from the books', 'Posting only the debit side of a ₦10,000 rent payment', 'Adding the Cash column wrongly by ₦500', 'Entering ₦4,000 Dr and ₦400 Cr for one invoice', 'An error of omission leaves both sides short by the same amount, so totals still agree.'],
      ['Given Gross Profit = ₦180,000 and Operating Expenses = ₦115,000, what is Net Profit?', '₦65,000', '₦295,000', '₦115,000', '₦75,000', 'Net Profit = ₦180,000 − ₦115,000 = ₦65,000.'],
      ['Where does Closing Stock appear in the Balance Sheet?', 'Under Current Assets', 'Under Long-term Liabilities', 'Deducted from Capital', 'Under Non-current Assets', 'Unsold inventory is a Current Asset expected to turn into cash soon.'],
      ['Recording the purchase of a delivery lorry in the Motor Repairs Expense account is an error of', 'principle', 'omission', 'original entry', 'addition', 'Mixing up capital expenditure (asset) with revenue expenditure (expense) is an error of principle.'],
      ['Discount Received from a supplier is treated in the Profit and Loss Account as', 'other income added to Gross Profit', 'an operating expense deducted from Gross Profit', 'a current liability', 'a drawing', 'Discount received reduces cash paid and boosts profit as other income.'],
    ],
  },
];

export function buildMarketingCurriculum() {
  return buildUtmeSubjectCurriculum([...MARKETING_SPECS.map(compactUtmeTopic), ...MARKETING_EXTRA_SPECS]);
}

export function buildOfficePracCurriculum() {
  return buildUtmeSubjectCurriculum([...OFFICEPRAC_SPECS.map(compactUtmeTopic), ...OFFICEPRAC_EXTRA_SPECS]);
}

export function buildInsuranceCurriculum() {
  return buildUtmeSubjectCurriculum([...INSURANCE_SPECS.map(compactUtmeTopic), ...INSURANCE_EXTRA_SPECS]);
}

export function buildStoreMgtCurriculum() {
  return buildUtmeSubjectCurriculum([...STOREMGT_SPECS.map(compactUtmeTopic), ...STOREMGT_EXTRA_SPECS]);
}

export function buildBookKeepCurriculum() {
  return buildUtmeSubjectCurriculum([...BOOKKEEP_SPECS.map(compactUtmeTopic), ...BOOKKEEP_EXTRA_SPECS]);
}
