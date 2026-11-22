import { buildUtmeSubjectCurriculum, type UtmeTopicSpec } from './builder';

const COMM_SPECS: UtmeTopicSpec[] = [
  {
    id: 'comm-meaning-occupation-production',
    name: 'Meaning, scope and history of commerce, occupation and production',
    sec: 'Foundations of commerce',
    goals: [
      'Define commerce, trade and the aids to trade, and trace the evolution from barter to modern commerce in Nigeria',
      'Classify occupations (industrial, commercial, direct services) and explain division of labour and specialisation',
    ],
    trap: 'Do not confuse COMMERCE with TRADE: trade is only buying and selling, whereas commerce equals trade PLUS all the aids to trade (banking, transport, insurance, warehousing, communication, advertising and tourism).',
    parts: [
      {
        title: 'Scope and evolution of commerce',
        idea: 'Commerce covers every activity that moves goods and services smoothly from the producer to the final consumer. It has two branches: trade (home and foreign buying and selling) and aids to trade (ancillary services such as transport, banking, insurance, warehousing, communication and advertising). Historically, Nigerians traded by barter before adopting cowries, manillas, coins, paper money and digital transfers.',
        terms: [
          ['Commerce', 'Trade plus all ancillary services (aids to trade) that make distribution of goods possible'],
          ['Trade by barter', 'Direct exchange of goods for goods without money, hindered by the double coincidence of wants'],
          ['Aids to trade', 'Banking, transport, insurance, warehousing, communication, advertising and tourism'],
        ],
        rules: [
          'Barter failed as economies grew because of double coincidence of wants, indivisibility of bulky items, lack of a common measure of value and difficulty storing perishables.',
          'Each aid to trade removes a specific barrier: transport removes distance, warehousing removes time gaps, banking removes finance barriers and insurance reduces risk.',
          'Production is NOT complete until goods reach the final consumer — so commerce is an essential part of production.',
        ],
        table: {
          headers: ['Barrier in trade', 'Aid to trade that solves it'],
          rows: [
            ['Distance between factory and buyer', 'Transport'],
            ['Time gap between harvest and sale', 'Warehousing'],
            ['Risk of fire, theft or shipwreck', 'Insurance'],
            ['Need for credit and safe payment', 'Banking'],
            ['Lack of buyer awareness', 'Advertising & communication'],
          ],
          trapNote: 'Students often think only factory workers "produce". In Commerce, wholesalers, drivers and shopkeepers are productive too because they create place, time and possession utility.',
        },
        example: {
          q: 'A cocoa farmer in Ondo stores dried beans in a depot for two months before shipping them to Lagos. Which two aids to trade are directly involved?',
          steps: [
            ['Storing for two months', 'Warehousing (creates time utility)'],
            ['Shipping to Lagos', 'Transport (creates place utility)'],
          ],
        },
        yourTurn: {
          q: 'Which of the following equations accurately defines commerce?',
          o: [
            'Trade + aids to trade',
            'Manufacturing + farming only',
            'Barter + taxation only',
            'Retailing minus wholesaling',
          ],
          a: 0,
          h: [
            'Commerce includes buying and selling PLUS the support services that make buying and selling work smoothly.',
            'Those support services include banking, insurance, transport and warehousing.',
          ],
          e: 'Commerce comprises trade (home and foreign) together with all aids to trade.',
        },
      },
      {
        title: 'Occupation, production and specialisation',
        idea: 'An occupation is any lawful economic work a person does to earn a living. Occupations fall into three main groups: industry (extractive, manufacturing and construction), commerce (trade and aids to trade) and direct services (personal and public services like teachers, doctors and barbers). Division of labour breaks production into narrow tasks so workers specialise and boost output.',
        terms: [
          ['Extractive industry', 'Obtaining raw materials directly from nature (farming, fishing, mining, quarrying, crude oil drilling)'],
          ['Direct services', 'Personal services rendered straight to consumers (e.g., doctors, lawyers, hairdressers, police)'],
          ['Division of labour', 'Splitting a production process into separate tasks handled by different specialised workers'],
        ],
        rules: [
          'The four factors of production and their rewards: Land (rent), Labour (wages/salaries), Capital (interest) and Entrepreneur (profit).',
          'Division of labour raises skill, saves tool-changing time and enables mechanisation, but can cause monotony and over-dependence if one stage breaks down.',
          'Specialisation is limited by the size of the market — a tiny village cannot support ten different specialist surgeons.',
        ],
        table: {
          headers: ['Occupational class', 'Examples in Nigeria'],
          rows: [
            ['Extractive (Primary)', 'Farming, fishing, limestone quarrying, crude oil extraction'],
            ['Manufacturing & construction (Secondary)', 'Cement factories, textile mills, road building'],
            ['Commercial (Tertiary)', 'Wholesalers, bank tellers, freight hauliers, insurers'],
            ['Direct services (Tertiary)', 'Teachers, nurses, mechanics, musicians'],
          ],
          trapNote: 'Remember that a nurse or teacher provides a DIRECT SERVICE (not commerce), whereas a banker or warehouse manager works in COMMERCE.',
        },
        example: {
          q: 'Classify these three Nigerian workers into their exact occupational classes: (a) crude oil driller, (b) shoe factory stitcher, (c) commercial bank cashier.',
          steps: [
            ['Crude oil driller', 'Extractive industry (primary)'],
            ['Shoe factory stitcher', 'Manufacturing industry (secondary)'],
            ['Commercial bank cashier', 'Commercial occupation (aid to trade)'],
          ],
        },
        yourTurn: {
          q: 'Which limitation most directly restricts how far division of labour can be carried in a business?',
          o: [
            'The size of the market (demand for the product)',
            'The colour of the factory walls',
            'Having too many eager buyers',
            'Availability of paved highways',
          ],
          a: 0,
          h: [
            'Think of Adam Smith’s famous principle about specialisation.',
            'If very few customers buy a product, hiring ten narrow specialists does not pay off.',
          ],
          e: 'Division of labour is limited by the extent of the market — large demand is needed to absorb specialised mass output.',
        },
      },
    ],
    qs: [
      {
        q: 'Which problem was the single greatest obstacle to trade by barter?',
        o: [
          'Double coincidence of wants',
          'Excessive use of cheques',
          'Too many commercial banks',
          'High internet charges',
        ],
        a: 0,
        e: 'Barter required two people each wanting exactly what the other offered at the same time.',
      },
      {
        q: 'Warehousing primarily creates which type of utility in commerce?',
        o: ['Time utility', 'Form utility', 'Natural utility', 'Mining utility'],
        a: 0,
        e: 'Warehousing bridges the time gap between production and consumption, creating time utility.',
      },
      {
        q: 'Which of the following is an example of an extractive occupation?',
        o: ['Tin mining in Jos', 'Baking bread', 'Selling insurance policies', 'Teaching Economics'],
        a: 0,
        e: 'Mining extracts raw minerals directly from the earth, making it an extractive (primary) industry.',
      },
      {
        q: 'What is the factor reward earned by an entrepreneur for bearing business risk and organising production?',
        o: ['Profit', 'Rent', 'Interest', 'Wages'],
        a: 0,
        e: 'Land earns rent, labour earns wages, capital earns interest and the entrepreneur earns profit.',
      },
      {
        q: 'A major disadvantage of extreme division of labour for an individual worker is',
        o: [
          'monotony and boredom from repeating one narrow task all day',
          'increased speed of production',
          'easier training of new workers',
          'better use of specialist machines',
        ],
        a: 0,
        e: 'Repeating a single micro-task continuously reduces job satisfaction and narrows a worker’s broader skills.',
      },
      {
        q: 'Production is said to be complete only when goods and services',
        o: [
          'reach the final consumer',
          'leave the factory assembly line',
          'are packed into cartons',
          'arrive at the wholesaler’s store',
        ],
        a: 0,
        e: 'Goods only satisfy human wants once they reach the final consumer through commercial distribution.',
      },
    ],
  },
  {
    id: 'comm-retail-wholesale',
    name: 'Retail and wholesale trade in Nigeria',
    sec: 'Home trade',
    goals: [
      'Compare small-scale and large-scale retail outlets (hawkers, supermarkets, hypermarkets, chain stores, department stores, mail order)',
      'Explain the functions of wholesalers, channels of distribution and when a middleman may be bypassed',
    ],
    trap: 'Do not confuse a DEPARTMENT STORE with a CHAIN (MULTIPLE) STORE: a department store has many different product departments under ONE roof, whereas a chain store sells a similar line of goods across MANY branches in different locations.',
    parts: [
      {
        title: 'Retail trade and modern retailing',
        idea: 'Retailing is the final link in home trade, selling goods in small, affordable units directly to final consumers. In Nigeria, small-scale retailers (itinerant hawkers, roadside kiosks, market stalls, unit shops) thrive because they require little capital and stay close to neighbourhoods. Large-scale retailers (supermarkets, department stores, multiple/chain stores, hypermarkets, mail-order and e-commerce shops) use bulk buying, self-service and branding to cut unit prices.',
        terms: [
          ['Retailer', 'A trader who buys in larger lots from wholesalers/producers and breaks bulk to sell in small quantities to final consumers'],
          ['Supermarket', 'A large self-service store dealing mainly in groceries and household goods with checkout counters'],
          ['Department store', 'Many specialised shops (clothing, electronics, cosmetics) operating under one roof and one management'],
          ['Chain (multiple) store', 'Several identical branches across towns owned centrally and selling standardised product lines'],
        ],
        rules: [
          'Self-service reduces staff costs and boosts impulse buying, though it increases the risk of pilferage (shoplifting).',
          'Modern retail trends include branding, pre-packaging, barcoding, POS terminals, vending machines and online delivery.',
          'Small retailers survive alongside supermarkets by offering personal credit, tiny unit sizes, long hours and walking-distance convenience.',
        ],
        table: {
          headers: ['Large retail type', 'Layout & branches', 'Key feature'],
          rows: [
            ['Supermarket', 'One large floor', 'Self-service trolleys; focus on food and daily household items'],
            ['Department store', 'Multi-storey single building', 'Wide variety of unrelated goods split into separate departments'],
            ['Chain / multiple store', 'Many branches nationwide', 'Central bulk buying, uniform look and similar product line'],
            ['Hypermarket', 'Huge out-of-town site with parking', 'Combines supermarket and department store at discount prices'],
          ],
          trapNote: 'Impulse buying is buying an unplanned item on the spot because attractive shelf display caught your eye — common in self-service supermarkets.',
        },
        example: {
          q: 'Why do neighbourhood provision shops in Lagos or Kano continue to survive even near giant supermarkets?',
          steps: [
            ['Small quantities', 'They sell single sachets or small cups tailored to daily cash budgets'],
            ['Personal touch', 'They sit right on residential streets, stay open late and extend informal credit to trusted neighbours'],
          ],
        },
        yourTurn: {
          q: 'Which retail format operates numerous identical branches in different cities under one central head office?',
          o: ['Chain (multiple) store', 'Department store', 'Hawker', 'Mobile shop'],
          a: 0,
          h: [
            'A department store keeps all its sections inside one single building.',
            'Look for the format built around many standardised branches nationwide.',
          ],
          e: 'Chain (multiple) stores operate many centrally managed branches selling uniform product lines.',
        },
      },
      {
        title: 'Wholesale trade and channels of distribution',
        idea: 'A wholesaler buys goods in bulk from manufacturers, stores them, breaks bulk, extends trade credit to retailers, advises producers on market trends and helps stabilise prices through buffer warehousing. A channel of distribution is the route goods follow from producer to consumer. Sometimes producers bypass wholesalers — especially for perishable farm produce, fragile custom equipment, branded luxury items or direct online sales.',
        terms: [
          ['Wholesaler', 'A middleman who buys in bulk from producers and resells in smaller wholesale lots to retailers'],
          ['Breaking bulk', 'Dividing large factory consignments into manageable cartons for retailers'],
          ['Merchant vs Agent', 'A merchant wholesaler takes ownership/title to the goods; an agent (broker/factor) sells on commission without owning the goods'],
        ],
        rules: [
          'Typical channel for everyday consumer goods: Producer → Wholesaler → Retailer → Consumer.',
          'Producers eliminate wholesalers when goods are highly perishable (fresh bread, tomatoes), technically complex (industrial generators), custom-made or sold through the manufacturer’s own retail outlets.',
          'A del credere agent earns an extra commission in return for guaranteeing payment if a buyer defaults.',
        ],
        table: {
          headers: ['Type of middleman', 'Takes ownership of goods?', 'How paid'],
          rows: [
            ['Merchant wholesaler', 'Yes', 'Trading profit margin'],
            ['Broker', 'No (never holds goods)', 'Brokerage commission'],
            ['Factor', 'No (holds goods & sells in own name)', 'Commission'],
            ['Del credere agent', 'No (guarantees bad debts)', 'Higher del credere commission'],
          ],
          trapNote: 'Eliminating a wholesaler does NOT eliminate wholesale FUNCTIONS (storage, transport, finance) — the producer or large retailer simply has to absorb those costs themselves.',
        },
        example: {
          q: 'Why does a fresh bakery in Ibadan usually sell loaves directly to retail shops or consumers instead of passing through regional wholesalers?',
          steps: [
            ['Check product nature', 'Bread is highly perishable and stales within days'],
            ['Choose shortest channel', 'Direct delivery keeps loaves fresh and avoids spoilage losses'],
          ],
        },
        yourTurn: {
          q: 'Which agent receives an extra commission in exchange for guaranteeing to the principal that credit buyers will pay?',
          o: ['Del credere agent', 'Broker', 'Auctioneer', 'Jobber'],
          a: 0,
          h: [
            'A regular broker simply brings buyer and seller together without taking credit risk.',
            'Look for the Italian-derived term meaning an agent who guarantees payment.',
          ],
          e: 'A del credere agent earns extra commission by guaranteeing the principal against buyers’ default.',
        },
      },
    ],
    qs: [
      {
        q: 'Which service does a wholesaler perform directly for a manufacturer?',
        o: [
          'Buying in bulk, financing production early and providing market feedback',
          'Selling single sachets on street corners',
          'Issuing national currency',
          'Auditing government budgets',
        ],
        a: 0,
        e: 'Wholesalers clear factory floors by buying in bulk, paying promptly, storing stock and relaying customer demand.',
      },
      {
        q: 'A single large building housing separate specialised sections for clothing, furniture, toys and cosmetics under one management is a',
        o: ['department store', 'chain store', 'hawker’s tray', 'wholesale warehouse'],
        a: 0,
        e: 'A department store gathers multiple distinct product departments under one roof.',
      },
      {
        q: 'Which product is MOST likely to be distributed directly from producer to consumer without a wholesaler?',
        o: ['A custom-built industrial printing press', 'Packaged table salt', 'Boxes of safety matches', 'Bottled soft drinks'],
        a: 0,
        e: 'Custom, expensive and technically complex machinery is sold directly by the manufacturer to the user.',
      },
      {
        q: 'What is a major risk created by self-service layout in large supermarkets?',
        o: ['Pilferage (shoplifting) by dishonest shoppers', 'Too much personal conversation with clerks', 'Inability to display prices', 'Absence of trolleys'],
        a: 0,
        e: 'Open shelves make browsing effortless and boost sales, but increase exposure to shoplifting unless monitored.',
      },
      {
        q: 'A commercial middleman who brings buyer and seller together without taking possession or ownership of the goods is a',
        o: ['broker', 'merchant wholesaler', 'supermarket owner', 'hawker'],
        a: 0,
        e: 'Brokers negotiate contracts on commission without physically holding or owning the goods.',
      },
      {
        q: 'Which function of a wholesaler helps smooth seasonal shortages and stabilise market prices?',
        o: ['Warehousing surplus stock until demand rises', 'Banning imports', 'Printing banknotes', 'Setting income tax'],
        a: 0,
        e: 'Storing goods during gluts and releasing them during off-seasons keeps prices steadier.',
      },
    ],
  },
  {
    id: 'comm-foreign-trade-customs',
    name: 'Foreign trade, balance of payments and customs procedures',
    sec: 'International trade',
    goals: [
      'Distinguish between home trade, foreign trade (import, export, entrepot), balance of trade and balance of payments',
      'Identify key foreign trade documents (Bill of Lading, Certificate of Origin, Consular Invoice, Letter of Credit) and roles of Nigeria Customs Service and Ports Authority',
    ],
    trap: 'Do not confuse Balance of Trade (BOT) with Balance of Payments (BOP): BOT compares ONLY visible goods exported and imported, whereas BOP records ALL visible goods, invisible services (shipping, tourism, banking) and capital flows.',
    parts: [
      {
        title: 'Foreign trade, Balance of Trade and Balance of Payments',
        idea: 'Foreign (international) trade is the exchange of goods and services across national borders — driven by differences in natural resources, climate, technology and comparative advantage. It takes three forms: import (buying abroad), export (selling abroad) and entrepot (importing goods solely to re-export them). Countries restrict excessive imports using tariffs (customs duties), quotas, embargoes and exchange controls.',
        terms: [
          ['Entrepot trade', 'Importing goods from one country for re-export to another, often after repackaging or processing'],
          ['Balance of Trade (BOT)', 'Value of visible exports minus value of visible imports in a given year'],
          ['Balance of Payments (BOP)', 'Complete annual statement of a country’s visible trade, invisible services and capital receipts versus payments'],
          ['Terms of Trade (TOT)', '(Index of export prices ÷ Index of import prices) × 100'],
        ],
        rules: [
          'Visible trade covers physical goods (crude oil, cocoa, cars); invisible trade covers services (insurance, aviation, tourism, consulting).',
          'A tariff is a tax on imports; a quota is a physical quantity limit; an embargo is a total ban on trading specific goods or with a specific nation.',
          'Devaluation lowers a currency’s exchange rate to make exports cheaper abroad and imports costlier at home, helping correct a BOP deficit.',
        ],
        table: {
          headers: ['Trade tool', 'How it works'],
          rows: [
            ['Tariff (Customs duty)', 'Tax levied on imported goods (ad valorem = % of value; specific = fixed fee per unit)'],
            ['Import quota', 'Strict ceiling on the physical quantity allowed into the country'],
            ['Embargo', 'Complete legal prohibition on importing/exporting a banned product'],
            ['Export subsidy', 'Government support helping local exporters price goods competitively abroad'],
          ],
          trapNote: 'Remember: AD VALOREM duty is charged as a percentage of the goods’ monetary value, while SPECIFIC duty is charged per kilogram, litre or unit.',
        },
        example: {
          q: 'Country X exports ₦900bn of physical goods and imports ₦1,050bn of physical goods, while earning a net surplus of ₦250bn from shipping and tourism services. Find its Balance of Trade and Current Account balance.',
          steps: [
            ['Balance of Trade (visible only)', '₦900bn − ₦1,050bn = −₦150bn (unfavourable / deficit)'],
            ['Current Account (visible + invisible)', '−₦150bn + ₦250bn = +₦100bn (surplus)'],
          ],
        },
        yourTurn: {
          q: 'Importing raw cocoa from a neighbouring port, repacking it in a free zone and immediately re-exporting it to Europe is called',
          o: ['entrepot trade', 'home trade', 'barter trade', 'retail trade'],
          a: 0,
          h: [
            'The goods are neither produced locally nor consumed locally — the country acts as a trading hub.',
            'This third branch of foreign trade has a French-derived name.',
          ],
          e: 'Entrepot trade is the re-exporting of imported goods to a third country.',
        },
      },
      {
        title: 'Foreign trade documents and Nigerian ports/customs',
        idea: 'Because foreign buyer and seller live far apart under different laws, international trade relies on specialised documents. The Bill of Lading is the crucial shipping contract and document of title to goods at sea; a Documentary Letter of Credit guarantees bank payment once shipping documents match; and the Certificate of Origin proves where goods were made to qualify for tariff preferences. In Nigeria, the Nigeria Customs Service (NCS) collects duties and stops smuggling, while the Nigerian Ports Authority (NPA) manages seaports.',
        terms: [
          ['Bill of Lading', 'Document issued by a shipping line acting as receipt for goods, contract of carriage and document of title'],
          ['Certificate of Origin', 'Official certificate stating the country where exported goods were produced'],
          ['Letter of Credit', 'Bank guarantee assuring the exporter of payment once agreed shipping documents are presented'],
          ['Bonded warehouse', 'Customs-controlled warehouse where dutiable imports are stored until import duties are paid'],
        ],
        rules: [
          'A "clean" Bill of Lading shows goods were loaded in good condition; a "dirty/foul" Bill of Lading notes damaged packaging.',
          'Air Waybill serves air cargo like a Bill of Lading serves sea cargo, EXCEPT an Air Waybill is NOT a negotiable document of title.',
          'FOB (Free on Board) means the seller pays costs until goods cross the ship’s rail; CIF (Cost, Insurance and Freight) includes sea freight and marine insurance to the buyer’s port.',
        ],
        table: {
          headers: ['Document / abbreviation', 'Core purpose'],
          rows: [
            ['Indent (Open or Closed)', 'Order sent by an importer to an overseas buying agent'],
            ['Consular Invoice', 'Invoice certified by the importing country’s consul to prevent under-invoicing'],
            ['FOB vs CIF', 'FOB covers loading onto ship only; CIF covers cost + marine insurance + sea freight'],
            ['Bonded warehouse', 'Stores imports duty-free until cleared or re-exported'],
          ],
          trapNote: 'An OPEN indent lets the overseas agent pick the supplier; a CLOSED indent specifies the exact manufacturer and brand required.',
        },
        example: {
          q: 'An importer in Lagos receives a price quote marked "CIF Apapa". Which three costs are already included in the quoted price?',
          steps: [
            ['C', 'Cost of the goods themselves'],
            ['I', 'Marine insurance during the voyage'],
            ['F', 'Sea freight charges right up to Apapa port'],
          ],
        },
        yourTurn: {
          q: 'Which international shipping document serves simultaneously as a receipt for goods, a contract of carriage and a negotiable document of title?',
          o: ['Bill of Lading', 'Consular Invoice', 'Certificate of Origin', 'Delivery Note'],
          a: 0,
          h: [
            'Whoever legally holds an endorsed copy of this sea-freight document can claim the cargo at the destination port.',
            'It is issued by the shipping company once cargo is loaded aboard the vessel.',
          ],
          e: 'The Bill of Lading serves as cargo receipt, contract of carriage and document of title in sea trade.',
        },
      },
    ],
    qs: [
      {
        q: 'When the value of a country’s visible imports exceeds the value of its visible exports, the country has',
        o: [
          'an unfavourable Balance of Trade (trade deficit)',
          'a favourable Balance of Trade',
          'entrepot surplus',
          'zero customs revenue',
        ],
        a: 0,
        e: 'Visible imports exceeding visible exports produces a Balance of Trade deficit.',
      },
      {
        q: 'Which customs duty is calculated as a fixed percentage of the monetary value of imported goods?',
        o: ['Ad valorem duty', 'Specific duty', 'Excise refund', 'Poll tax'],
        a: 0,
        e: 'Ad valorem ("according to value") duty charges a percentage of the import’s invoice value.',
      },
      {
        q: 'Which Nigerian agency is primarily responsible for collecting customs duties and preventing smuggling across borders?',
        o: ['Nigeria Customs Service (NCS)', 'Nigerian Ports Authority (NPA)', 'NAFDAC', 'CAC'],
        a: 0,
        e: 'The Nigeria Customs Service enforces tariff collection and anti-smuggling controls.',
      },
      {
        q: 'Where are dutiable imported goods kept under customs supervision until the importer pays customs duty?',
        o: ['Bonded warehouse', 'Wholesale depot', 'Cold room', 'Supermarket shelf'],
        a: 0,
        e: 'Bonded warehouses hold uncleared imports securely until duty is paid or the goods are re-exported.',
      },
      {
        q: 'Which foreign trade document specifies the exact country where goods were manufactured so preferential tariffs can be applied?',
        o: ['Certificate of Origin', 'Bill of Sight', 'Shipping Note', 'Dock Warrant'],
        a: 0,
        e: 'A Certificate of Origin authenticates the goods’ country of production.',
      },
      {
        q: 'How does a closed indent differ from an open indent?',
        o: [
          'A closed indent names the exact supplier/brand required, while an open indent lets the agent choose',
          'A closed indent is only for air cargo',
          'An open indent requires no payment',
          'A closed indent is used only in local village markets',
        ],
        a: 0,
        e: 'Closed indents specify the exact manufacturer, whereas open indents give the overseas agent discretion.',
      },
    ],
  },
  {
    id: 'comm-money-banking',
    name: 'Money, banking and financial institutions',
    sec: 'Finance and banking',
    goals: [
      'Explain the functions and qualities of money and distinguish commercial banks from the Central Bank of Nigeria (CBN)',
      'Explain bank accounts, cheques (open, crossed, dishonoured), electronic banking and specialised Nigerian financial institutions',
    ],
    trap: 'Do not confuse a COMMERCIAL BANK with the CENTRAL BANK: commercial banks serve individuals and businesses for profit, whereas the Central Bank of Nigeria (CBN) is the government’s non-profit apex regulator, currency issuer and lender of last resort.',
    parts: [
      {
        title: 'Money, commercial banks and cheques',
        idea: 'Money is anything generally accepted as a medium of exchange, unit of account, store of value and standard of deferred payment. Commercial banks accept deposits (Current, Savings and Fixed Deposit accounts), grant loans/overdrafts, safeguard valuables, process transfers and issue cheques. A cheque is an unconditional written order instructing a bank to pay a stated sum on demand.',
        terms: [
          ['Current account', 'Cheque-operated business/personal account allowing withdrawals anytime and eligible for bank overdrafts'],
          ['Crossed cheque', 'A cheque with two parallel lines across its face — MUST be paid into a bank account, never cashed over the counter'],
          ['Bank overdraft', 'Short-term credit allowing a current account holder to withdraw slightly above their balance up to an agreed limit'],
        ],
        rules: [
          'Three parties to a cheque: Drawer (account holder who writes it), Drawee (the bank ordered to pay) and Payee (person receiving payment).',
          'A bank may dishonour (bounce) a cheque for insufficient funds ("R/D — Refer to Drawer"), irregular signature, stale date (over 6 months), post-dated date, words/figures mismatch or account closed.',
          'Qualities of good money: general acceptability, portability, durability, divisibility, homogeneity, scarcity and stability in value.',
        ],
        table: {
          headers: ['Account type', 'Cheque book?', 'Interest & access'],
          rows: [
            ['Current account', 'Yes', 'Usually zero/low interest; instant withdrawal + overdraft facility'],
            ['Savings account', 'No (passbook / ATM card)', 'Earns regular interest; aimed at personal savers'],
            ['Fixed (Time) deposit', 'No', 'Highest interest; money locked for an agreed term (e.g., 90 or 180 days)'],
          ],
          trapNote: 'Remember: an OPEN cheque can be cashed over the counter; a CROSSED cheque is safer because it can only be deposited into a bank account.',
        },
        example: {
          q: 'Why does adding "Account Payee Only" inside two parallel lines across a cheque protect the sender?',
          steps: [
            ['Two parallel lines', 'Prevents anyone from cashing it anonymously over the counter'],
            ['"Account Payee Only"', 'Stops endorsement to strangers — the funds can go strictly into the named payee’s own bank account'],
          ],
        },
        yourTurn: {
          q: 'In cheque transactions, who is the "Drawee"?',
          o: [
            'The commercial bank instructed to pay the cheque',
            'The customer who signs the cheque',
            'The trader receiving the money',
            'The Central Bank governor',
          ],
          a: 0,
          h: [
            'Drawer = writes the cheque; Payee = gets paid.',
            'Drawee is the institution ordered to honour the payment.',
          ],
          e: 'The drawee is always the bank on which the cheque is drawn and instructed to pay.',
        },
      },
      {
        title: 'Central Bank of Nigeria (CBN) and specialised banks',
        idea: 'The Central Bank of Nigeria (established 1958, commenced operations 1959) is Nigeria’s apex monetary authority. It issues Naira notes and coins, acts as banker to the federal government and commercial banks, manages foreign exchange reserves, acts as lender of last resort and controls inflation using monetary policy tools (Monetary Policy Rate, Open Market Operations, Cash Reserve Ratio). Alongside commercial banks operate merchant banks, development banks (BOI, BOA, FMBN), microfinance banks and mobile/electronic banking channels (POS, NIP transfers, USSD).',
        terms: [
          ['Lender of last resort', 'CBN’s role of providing emergency liquidity to solvent commercial banks facing temporary cash crunches'],
          ['Open Market Operations (OMO)', 'CBN buying or selling government securities (Treasury Bills) to expand or shrink money in circulation'],
          ['Development banks', 'Specialised long-term lenders like Bank of Industry (BOI), Bank of Agriculture (BOA) and Federal Mortgage Bank of Nigeria (FMBN)'],
        ],
        rules: [
          'To fight inflation (too much money chasing few goods), CBN RAISES the Cash Reserve Ratio, RAISES the Monetary Policy Rate and SELLS Treasury Bills.',
          'To stimulate a sluggish economy, CBN lowers reserve ratios, lowers interest rates and buys back securities.',
          'Mortgage banks (e.g., FMBN) provide long-term housing loans, whereas microfinance banks serve small traders and rural enterprises.',
        ],
        table: {
          headers: ['Institution', 'Primary focus'],
          rows: [
            ['Central Bank of Nigeria (CBN)', 'Currency issuance, monetary policy and banking supervision'],
            ['Commercial banks', 'Retail/business deposits, short-term loans, POS and payment services'],
            ['Bank of Industry (BOI)', 'Medium and long-term industrial & manufacturing finance'],
            ['Microfinance banks', 'Small loans and savings for micro-traders and low-income earners'],
          ],
          trapNote: 'Ordinary citizens CANNOT walk into the CBN to open a personal savings account — CBN banks only for the government and other banks.',
        },
        example: {
          q: 'If inflation rises sharply in Nigeria, should the Central Bank buy or sell Treasury Bills through Open Market Operations?',
          steps: [
            ['Identify the goal', 'Reduce excess cash circulating in the economy'],
            ['Select OMO action', 'SELL Treasury Bills so banks and investors hand cash to the CBN, tightening money supply'],
          ],
        },
        yourTurn: {
          q: 'Which monetary policy move by the Central Bank of Nigeria helps curb high inflation?',
          o: [
            'Increasing the Cash Reserve Ratio and selling government securities',
            'Printing extra banknotes without backing',
            'Cutting reserve requirements to zero',
            'Encouraging unlimited consumer borrowing',
          ],
          a: 0,
          h: [
            'Curbing inflation means pulling excess spending money OUT of circulation.',
            'Requiring banks to lock up higher reserves and selling securities absorbs surplus cash.',
          ],
          e: 'Raising the Cash Reserve Ratio and selling securities reduces bank lending capacity and cools inflationary pressure.',
        },
      },
    ],
    qs: [
      {
        q: 'A cheque dated more than six months ago that a bank refuses to honour is described as a',
        o: ['stale cheque', 'post-dated cheque', 'crossed cheque', 'traveller’s cheque'],
        a: 0,
        e: 'A cheque becomes stale after six months from its written date and banks decline payment.',
      },
      {
        q: 'Which type of bank account normally entitles a business customer to request a bank overdraft?',
        o: ['Current account', 'Savings account', 'Fixed deposit account', 'Children’s piggy account'],
        a: 0,
        e: 'Overdraft facilities are attached specifically to current accounts.',
      },
      {
        q: 'Which of the following is a function performed EXCLUSIVELY by the Central Bank of Nigeria?',
        o: [
          'Issuing legal tender currency (Naira notes and coins)',
          'Accepting personal savings deposits',
          'Issuing debit cards to students',
          'Financing supermarket renovations directly',
        ],
        a: 0,
        e: 'Only the Central Bank holds statutory monopoly to issue national legal tender currency.',
      },
      {
        q: 'Why does a crossed cheque offer greater security than an open cheque?',
        o: [
          'It cannot be cashed directly over the counter and must pass through a bank account',
          'It never expires',
          'It requires no drawer’s signature',
          'It automatically doubles the payment',
        ],
        a: 0,
        e: 'Tracing payment into a named bank account deters theft and fraud.',
      },
      {
        q: 'Which specialised financial institution focuses primarily on providing long-term loans for housing construction and purchase?',
        o: ['Mortgage bank', 'Microfinance bank', 'Clearing house', 'Bureau de change'],
        a: 0,
        e: 'Mortgage banks specialise in long-term real estate and residential housing finance.',
      },
      {
        q: 'Money serving as a common yardstick to compare the prices of yams, shoes and textbooks is fulfilling its function as a',
        o: ['unit of account (measure of value)', 'store of perishable goods', 'standard of barter', 'customs tariff'],
        a: 0,
        e: 'As a unit of account, money expresses the relative value of every good and service in one shared scale.',
      },
    ],
  },
  {
    id: 'comm-insurance-capital-market',
    name: 'Insurance and the Nigerian capital market',
    sec: 'Finance and banking',
    goals: [
      'Explain the six core principles of insurance, insurable vs uninsurable risks and main classes of insurance policies',
      'Explain the structure and instruments of the Nigerian Capital Market (NGX, SEC, shares, debentures, primary vs secondary market)',
    ],
    trap: 'Insurance is about RESTORATION (indemnity), never making a profit from disaster — except in Life Assurance, because human life has no fixed market replacement value.',
    parts: [
      {
        title: 'Principles and types of insurance',
        idea: 'Insurance pools premiums from many people facing similar risks so the unfortunate few who suffer loss are compensated. Six foundational principles govern insurance contracts: Insurable Interest, Utmost Good Faith (Uberrimae Fidei), Indemnity, Subrogation, Contribution and Proximate Cause. Only measurable, predictable risks (fire, theft, road accidents, marine loss) are insurable; speculative business losses from poor management or changing fashion are uninsurable.',
        terms: [
          ['Utmost Good Faith (Uberrimae Fidei)', 'Duty of both insurer and insured to disclose all material facts honestly — hiding facts voids the policy'],
          ['Indemnity', 'Restoring the insured to the exact financial position held before the loss — never letting them profit from a claim'],
          ['Subrogation', 'Once the insurer pays full compensation, the insurer takes over the insured’s right to claim salvage or sue a guilty third party'],
          ['Contribution', 'If one asset is insured with two insurers, both share the single loss proportionately rather than paying double'],
        ],
        rules: [
          'Insurable interest means you must stand to suffer genuine financial loss if the insured item is damaged — you cannot insure a stranger’s house.',
          'Proximate cause means compensation is paid only if the direct, closest cause of loss is a risk actually covered by the policy.',
          'Life ASSURANCE uses "assurance" because death is certain (only timing is unknown), while property/motor INSURANCE covers uncertain events.',
        ],
        table: {
          headers: ['Principle', 'Plain-English rule'],
          rows: [
            ['Insurable interest', 'You must have a genuine financial stake in what you insure'],
            ['Utmost good faith', 'Tell the whole truth on the proposal form'],
            ['Indemnity', 'Compensate the true loss only — no windfall profit'],
            ['Subrogation', 'Wreckage/recovery rights pass to the insurer after full payout'],
            ['Contribution', 'Multiple insurers split one claim fairly'],
            ['Proximate cause', 'The immediate cause of loss must be an insured peril'],
          ],
          trapNote: 'Indemnity, Subrogation and Contribution do NOT apply to Life Assurance — a family can claim validly on multiple life policies.',
        },
        example: {
          q: 'A shopkeeper insures a ₦4,000,000 shop for ₦4,000,000 each with Company A and Company B. Fire destroys the whole shop. How much does the shopkeeper collect in total, and which principle explains why?',
          steps: [
            ['Apply Indemnity + Contribution', 'Total payout cannot exceed the actual loss of ₦4,000,000'],
            ['Split fairly', 'Company A pays ₦2,000,000 and Company B pays ₦2,000,000 (Contribution)'],
          ],
        },
        yourTurn: {
          q: 'After an insurer pays full value for a stolen van that police later recover, which insurance principle gives the insurer legal ownership of the recovered van?',
          o: ['Subrogation', 'Contribution', 'Proximate cause', 'Utmost good faith'],
          a: 0,
          h: [
            'If the owner kept both the full cash payout AND the recovered van, they would profit unfairly.',
            'Which principle lets the insurer step into the insured’s shoes after full settlement?',
          ],
          e: 'Subrogation transfers the insured’s salvage and recovery rights to the insurer once full indemnity is paid.',
        },
      },
      {
        title: 'The Nigerian Capital Market (NGX and SEC)',
        idea: 'While the Money Market handles short-term funds (under 1 year, like Treasury Bills), the Capital Market mobilises medium- and long-term funds for companies and governments. New securities are sold in the Primary Market (e.g., an Initial Public Offering — IPO), while existing shares are bought and sold daily in the Secondary Market on the Nigerian Exchange (NGX), regulated by the Securities and Exchange Commission (SEC).',
        terms: [
          ['Ordinary shares (Equities)', 'Units of company ownership carrying voting rights and variable dividends'],
          ['Preference shares', 'Shares receiving a fixed dividend priority ahead of ordinary shareholders'],
          ['Debentures', 'Long-term loan certificates issued by companies paying fixed interest whether or not profits are made'],
          ['Bull vs Bear', 'A bull buys expecting share prices to rise; a bear sells expecting prices to fall'],
        ],
        rules: [
          'Shareholders are OWNERS receiving dividends; debenture holders are CREDITORS receiving fixed interest.',
          'The Securities and Exchange Commission (SEC) is the apex regulator protecting investors in the Nigerian capital market.',
          'Stockbrokers act as licensed agents buying and selling shares for investors on the exchange for a brokerage commission.',
        ],
        table: {
          headers: ['Instrument', 'Holder’s status', 'Return paid'],
          rows: [
            ['Ordinary share', 'Part-owner with voting rights', 'Variable dividend after all prior claims'],
            ['Preference share', 'Part-owner (usually non-voting)', 'Fixed percentage dividend ahead of ordinary shares'],
            ['Debenture', 'Long-term lender / creditor', 'Fixed interest obligatory even in low-profit years'],
            ['Government bond', 'Lender to Federal/State government', 'Fixed coupon interest; very low default risk'],
          ],
          trapNote: 'Do not confuse a STAG with a BULL: a bull buys existing shares hoping prices climb, while a stag applies for brand-new IPO shares hoping to resell them quickly at a listing premium.',
        },
        example: {
          q: 'Why is a debenture generally safer than an ordinary share if a company has a tough year?',
          steps: [
            ['Priority of payment', 'Debenture interest must be paid before any shareholder dividend is declared'],
            ['Winding-up priority', 'If the firm closes, debenture creditors are repaid before ordinary owners'],
          ],
        },
        yourTurn: {
          q: 'Which Nigerian body serves as the apex statutory regulator of the Nigerian Capital Market?',
          o: [
            'Securities and Exchange Commission (SEC)',
            'Nigeria Customs Service (NCS)',
            'Nigerian Ports Authority (NPA)',
            'National Orientation Agency (NOA)',
          ],
          a: 0,
          h: [
            'While the NGX provides the trading platform, a separate federal commission regulates brokers, issuers and investor protection.',
            'Its abbreviation is SEC.',
          ],
          e: 'The Securities and Exchange Commission (SEC) regulates and develops the Nigerian capital market.',
        },
      },
    ],
    qs: [
      {
        q: 'Which of the following is an UNINSURABLE risk?',
        o: [
          'Loss of sales caused by poor management or sudden change in fashion',
          'Fire destroying a warehouse',
          'Burglary of a retail shop',
          'Accident involving a delivery truck',
        ],
        a: 0,
        e: 'Speculative business risks like fashion shifts or bad management lack statistical predictability and cannot be insured.',
      },
      {
        q: 'Concealing a serious pre-existing heart condition when applying for life assurance breaches the principle of',
        o: ['utmost good faith (Uberrimae Fidei)', 'subrogation', 'contribution', 'indemnity'],
        a: 0,
        e: 'Utmost good faith requires complete, honest disclosure of all material facts.',
      },
      {
        q: 'A speculator on the stock exchange who buys shares in anticipation that market prices will rise is called a',
        o: ['bull', 'bear', 'broker', 'underwriter'],
        a: 0,
        e: 'Bulls expect rising prices ("charging upward"), while bears expect falling prices.',
      },
      {
        q: 'What is the main difference between the Money Market and the Capital Market?',
        o: [
          'The Money Market deals in short-term funds (under 1 year), while the Capital Market deals in long-term funds',
          'The Money Market uses coins only',
          'The Capital Market is strictly for small village loans',
          'Only foreigners may use the Capital Market',
        ],
        a: 0,
        e: 'Money markets provide short-term liquidity; capital markets finance long-term investments.',
      },
      {
        q: 'What return do debenture holders receive from a company?',
        o: ['Fixed interest', 'Variable profit bonuses only', 'Free company shares', 'Rent'],
        a: 0,
        e: 'Debentures are loan stock earning fixed interest regardless of profit levels.',
      },
      {
        q: 'Which insurance principle does NOT apply to Life Assurance?',
        o: ['Indemnity', 'Utmost good faith', 'Insurable interest', 'Offer and acceptance'],
        a: 0,
        e: 'Because human life cannot be priced or replaced mathematically, indemnity does not apply to life assurance.',
      },
    ],
  },
  {
    id: 'comm-transport-warehousing-tourism',
    name: 'Transport, warehousing and tourism',
    sec: 'Aids to trade',
    goals: [
      'Compare road, rail, water, air and pipeline transport and choose the best mode for different cargoes',
      'Classify types of warehouses and explain the commercial value of tourism in Nigeria',
    ],
    trap: 'Do not assume air transport is always "best" — suitability depends on the product’s weight, perishability, urgency, distance and value (crude oil needs pipelines; coal/cement suit rail or ship; fresh flowers or urgent vaccines suit air).',
    parts: [
      {
        title: 'Modes of transport and cargo selection',
        idea: 'Transport moves raw materials to factories and finished goods to markets, widening the market and enabling regional specialisation. Nigeria uses five main modes: road (flexible door-to-door), rail (heavy bulk inland), water (cheapest for huge international bulk), air (fastest for urgent/light high-value cargo) and pipeline (continuous, low-operating-cost flow of liquids and gases like crude oil and natural gas).',
        terms: [
          ['Containerisation', 'Packing cargo into standard sealed steel boxes that transfer swiftly between ships, trains and trucks with less theft'],
          ['Charter party', 'Contract for hiring an entire ship (voyage charter or time charter) for bulky cargo'],
          ['Pipeline transport', 'Underground/surface pipe networks carrying crude oil, refined fuel and gas continuously regardless of weather'],
        ],
        rules: [
          'Road transport gives unmatched door-to-door flexibility for short and medium distances.',
          'Water transport (ocean liners on fixed routes/schedules; tramp ships hired anywhere on demand) handles the largest tonnage at lowest cost per tonne.',
          'Key factors when choosing transport: nature of goods (perishable/fragile), urgency, weight/bulk, cost and distance.',
        ],
        table: {
          headers: ['Mode', 'Greatest strength', 'Best suited cargo'],
          rows: [
            ['Road', 'Door-to-door access and flexible timing', 'Retail deliveries, market produce, parcels'],
            ['Rail', 'Heavy inland bulk over long distances', 'Cement, coal, steel, containers'],
            ['Water (Sea)', 'Lowest unit cost for huge international loads', 'Machinery, vehicles, grain, cocoa, crude oil'],
            ['Air', 'Highest speed and security', 'Urgent medicines, perishables, jewellery, mail'],
            ['Pipeline', '24/7 continuous flow, zero traffic jams', 'Crude oil, petroleum products, natural gas'],
          ],
          trapNote: 'Distinguish LINERS (sail fixed routes on published timetables) from TRAMPS (have no fixed schedule and go wherever hired by charter party).',
        },
        example: {
          q: 'Which transport mode is most economical for moving 500,000 barrels of crude oil daily from Niger Delta wells to a coastal export terminal?',
          steps: [
            ['Check cargo state & volume', 'Continuous high-volume liquid'],
            ['Match optimal mode', 'Pipeline transport — zero road congestion and low running cost per barrel'],
          ],
        },
        yourTurn: {
          q: 'Which advantage makes containerisation especially valuable in modern international shipping?',
          o: [
            'Sealed standard containers speed up transfers between ship, rail and truck while reducing damage and pilferage',
            'Containers eliminate all customs checks worldwide',
            'Containers can only travel by aeroplane',
            'Containers remove the need for seaports',
          ],
          a: 0,
          h: [
            'Think about what happens when individual sacks are unloaded by hand versus lifting one locked steel box by crane.',
            'It improves speed, handling safety and theft protection across modes.',
          ],
          e: 'Standardised sealed containers enable rapid intermodal handling and greatly reduce breakage and theft.',
        },
      },
      {
        title: 'Warehousing and tourism',
        idea: 'Warehousing stores raw materials, seasonal harvests and finished products safely until needed, keeping supply steady and prices stable. Main types include ordinary/private warehouses, public warehouses (rented to any trader), wholesale warehouses, state warehouses (storing seized contraband) and bonded warehouses (storing uncleared dutiable imports). Tourism — travelling for leisure, culture, heritage or business — is a growing aid to trade that earns foreign exchange, creates hospitality jobs and showcases Nigerian landmarks like Yankari, Obudu, Olumo Rock and Osun-Osogbo.',
        terms: [
          ['Public warehouse', 'Commercial storage space located near ports or rail hubs that any business can rent for a fee'],
          ['State (King’s/Government) warehouse', 'Customs warehouse holding smuggled, abandoned or confiscated goods until auctioned or destroyed'],
          ['Tourism', 'Temporary movement of visitors for leisure, culture, ecotourism or conferences, boosting local commerce'],
        ],
        rules: [
          'Warehousing enables blending, grading, bottling and packaging of goods before final sale.',
          'Do not mix up a BONDED warehouse (legal uncleared imports awaiting duty) with a STATE warehouse (seized smuggled or abandoned goods).',
          'Tourism stimulates transport, hotels, crafts, restaurants and foreign exchange inflows, though it needs security, good roads and conservation.',
        ],
        table: {
          headers: ['Warehouse type', 'What it holds'],
          rows: [
            ['Bonded warehouse', 'Lawful imported goods awaiting customs duty payment or re-export'],
            ['State warehouse', 'Confiscated contraband or unclaimed port cargo'],
            ['Wholesale warehouse', 'Bulk inventory held by wholesalers for supply to retailers'],
            ['Public warehouse', 'Goods of any trader paying storage rent'],
          ],
          trapNote: 'Remember: BONDED = awaiting duty legally; STATE = seized contraband or abandoned cargo.',
        },
        example: {
          q: 'How does tourism act as an aid to trade and a boost to Nigeria’s economy?',
          steps: [
            ['Demand multiplier', 'Visitors spend on airlines, hotels, tour guides, food and local handicrafts'],
            ['Foreign exchange', 'International visitors bring foreign currency into the Nigerian economy'],
          ],
        },
        yourTurn: {
          q: 'Where does the Nigeria Customs Service store seized smuggled goods and unclaimed port cargo awaiting disposal?',
          o: ['State warehouse', 'Wholesale warehouse', 'Private factory store', 'Retail cold room'],
          a: 0,
          h: [
            'Lawful imports waiting for duty go into a bonded warehouse.',
            'Confiscated or abandoned items go into a government-run warehouse with a distinct name.',
          ],
          e: 'Seized contraband and abandoned goods are kept in a State (government) warehouse.',
        },
      },
    ],
    qs: [
      {
        q: 'Which transport mode offers the greatest door-to-door flexibility for local delivery?',
        o: ['Road transport', 'Rail transport', 'Ocean liner', 'Pipeline'],
        a: 0,
        e: 'Road vehicles reach nearly every shop, market and home directly.',
      },
      {
        q: 'Cargo ships that follow no fixed timetable or route and sail wherever chartered are called',
        o: ['tramps', 'conference liners', 'ferries', 'tugboats'],
        a: 0,
        e: 'Tramp vessels operate on flexible charter agreements rather than fixed published schedules.',
      },
      {
        q: 'Which transport mode is most suitable for transporting urgent vaccines from Europe to Abuja?',
        o: ['Air transport', 'Ocean tramp', 'Rail wagon', 'Pipeline'],
        a: 0,
        e: 'Air transport provides the speed and temperature-controlled handling needed for urgent, high-value medical cargo.',
      },
      {
        q: 'A warehouse owned privately by a trader or rented to any business near a seaport for commercial fees is a',
        o: ['public warehouse', 'state warehouse', 'embargo depot', 'clearing house'],
        a: 0,
        e: 'Public warehouses rent secure storage space to any member of the business public.',
      },
      {
        q: 'Which of the following is an economic benefit of well-managed tourism in Nigeria?',
        o: [
          'Foreign exchange earnings and employment in hospitality and local crafts',
          'Elimination of all agricultural production',
          'Higher smuggling rates',
          'Closure of domestic airlines',
        ],
        a: 0,
        e: 'Tourism generates foreign currency, stimulates hotels and transport, and creates local jobs.',
      },
      {
        q: 'Which Nigerian attraction is a renowned wildlife and warm-spring ecotourism destination in Bauchi State?',
        o: ['Yankari Game Reserve', 'Olumo Rock', 'Obudu Mountain Resort', 'Ikogosi Warm Springs'],
        a: 0,
        e: 'Yankari Game Reserve in Bauchi State is famous for wildlife conservation and Wikki Warm Springs.',
      },
    ],
  },
  {
    id: 'comm-comms-marketing-consumer',
    name: 'Communication, advertising, marketing and consumer protection',
    sec: 'Market outreach and protection',
    goals: [
      'Explain business communication channels, types of advertising and the four Ps of the marketing mix',
      'Explain consumer rights and the roles of Nigerian consumer protection agencies (FCCPC, NAFDAC, SON)',
    ],
    trap: 'Do not confuse SELLING with MARKETING: selling focuses on pushing out whatever the factory already made, whereas marketing starts by researching customer needs and designing products, prices, places and promotion to satisfy them profitably.',
    parts: [
      {
        title: 'Communication, advertising and the marketing mix',
        idea: 'Fast, accurate communication (postal/courier services, telephone, email, video calls, internet) keeps suppliers, banks and buyers linked across distances. Marketing is the full management process of identifying and profitably satisfying customer needs using the 4Ps (Marketing Mix): Product, Price, Place and Promotion. Advertising — one tool of promotion — informs buyers (informative), convinces them to prefer a brand (persuasive), competes against rivals (competitive) or promotes an entire industry (generic/collective).',
        terms: [
          ['Marketing Mix (4Ps)', 'Product (design/brand), Price (value/discounts), Place (distribution channels) and Promotion (advertising/sales promotion)'],
          ['Informative vs Persuasive advertising', 'Informative gives objective facts (launch dates, job vacancies); persuasive appeals to desire to buy a specific brand'],
          ['Market segmentation', 'Dividing a broad market into distinct customer groups (by age, income, location or habits) to serve each better'],
        ],
        rules: [
          'Public Relations (PR) builds long-term goodwill and reputation; Sales Promotion gives short-term incentives (coupons, buy-one-get-one, loyalty points); Personal Selling uses face-to-face persuasion.',
          'Generic (mass) advertising promotes an entire product category ("Drink milk every day") rather than one brand.',
          'NIPOST handles postal services in Nigeria, while private couriers (DHL, GIGL, Red Star) deliver urgent tracked parcels.',
        ],
        table: {
          headers: ['Element of 4Ps', 'Key business decisions'],
          rows: [
            ['Product', 'Quality, packaging, branding, warranty and after-sales support'],
            ['Price', 'Cost-plus pricing, penetration pricing, skimming, discounts'],
            ['Place', 'Channels (wholesalers, retailers, online), coverage and logistics'],
            ['Promotion', 'Advertising, sales promotion, personal selling and public relations'],
          ],
          trapNote: 'Remember that ADVERTISING is only ONE part of Promotion — Promotion also includes sales promotion, personal selling and public relations.',
        },
        example: {
          q: 'A new biscuit brand launches in Nigeria at a low introductory price to win rapid market share before raising prices gradually. Which pricing strategy is this?',
          steps: [
            ['Spot the pattern', 'Low starting price aimed at quick mass adoption'],
            ['Name the strategy', 'Market penetration pricing (the opposite of high-price market skimming)'],
          ],
        },
        yourTurn: {
          q: 'An advert stating "Eat Nigerian brown rice for stronger health" without naming any single company brand is an example of',
          o: [
            'generic (collective/mass) advertising',
            'competitive brand advertising',
            'personal selling',
            'price skimming',
          ],
          a: 0,
          h: [
            'Notice that no single company’s brand name appears — it promotes an entire product category.',
            'Several producers share the benefit of growing overall demand.',
          ],
          e: 'Generic (mass/collective) advertising promotes an entire product type rather than one specific company brand.',
        },
      },
      {
        title: 'Consumer rights and consumer protection in Nigeria',
        idea: 'Consumer protection shields buyers from fake drugs, underweight packages, misleading adverts, unsafe appliances and unfair monopolies. Consumers hold eight recognised rights: safety, information, choice, to be heard, redress, consumer education, basic needs and a healthy environment. In Nigeria, statutory agencies enforce these rights alongside consumer laws (like Caveat Emptor — "let the buyer beware" — now balanced by statutory warranties).',
        terms: [
          ['FCCPC', 'Federal Competition and Consumer Protection Commission — Nigeria’s primary agency protecting consumer rights and fair competition'],
          ['NAFDAC', 'National Agency for Food and Drug Administration and Control — regulates safety of foods, medicines, bottled water and cosmetics'],
          ['SON', 'Standards Organisation of Nigeria — sets and enforces quality standards for manufactured industrial and consumer goods'],
          ['Caveat Emptor', 'Latin phrase meaning "let the buyer beware", reminding shoppers to inspect goods carefully alongside statutory protection'],
        ],
        rules: [
          'Check NAFDAC registration numbers and expiry dates on foods and medicines, and MANCAP/SON marks on electrical and industrial products.',
          'FCCPC investigates unfair pricing, deceptive advertising, defective goods and anti-competitive monopolies.',
          'Consumers also protect themselves through consumer associations, boycotts and demanding official receipts.',
        ],
        table: {
          headers: ['Nigerian agency', 'Main area of protection'],
          rows: [
            ['FCCPC', 'General consumer rights, redress and fair market competition'],
            ['NAFDAC', 'Foods, drugs, packaged water, cosmetics and medical devices'],
            ['SON', 'Quality standards for cables, tyres, cement, appliances and local products'],
            ['NCC / NERC', 'Telecoms subscribers (NCC) and electricity consumers (NERC)'],
          ],
          trapNote: 'Do not mix up NAFDAC and SON: fake paracetamol or expired yoghurt falls under NAFDAC; substandard electrical wire or underweight cement falls under SON.',
        },
        example: {
          q: 'A shopper buys a new electric pressing iron whose plug melts on first use due to substandard wiring. Which two Nigerian agencies are most relevant to report this?',
          steps: [
            ['Product manufacturing standard', 'Standards Organisation of Nigeria (SON)'],
            ['Consumer redress & unsafe retail sale', 'Federal Competition and Consumer Protection Commission (FCCPC)'],
          ],
        },
        yourTurn: {
          q: 'Which Nigerian agency is specifically charged with regulating the safety and quality of packaged foods, medicines and bottled water?',
          o: ['NAFDAC', 'SON', 'NPA', 'NCS'],
          a: 0,
          h: [
            'Look for the agency whose registration number appears on every legitimate sachet water or medicine pack in Nigeria.',
            'Its full name starts with National Agency for Food and Drug Administration and Control.',
          ],
          e: 'NAFDAC regulates foods, medicines, bottled water, cosmetics and related consumables in Nigeria.',
        },
      },
    ],
    qs: [
      {
        q: 'Which of the following is NOT one of the traditional 4Ps of the marketing mix?',
        o: ['Profit', 'Product', 'Price', 'Place'],
        a: 0,
        e: 'The four Ps are Product, Price, Place and Promotion (profit is the business goal, not a marketing-mix tool).',
      },
      {
        q: 'Offering "Buy two packs, get one free" for two weeks to boost immediate store sales is an example of',
        o: ['sales promotion', 'public relations', 'market segmentation', 'warehousing'],
        a: 0,
        e: 'Sales promotion uses short-term incentives to spark immediate purchases.',
      },
      {
        q: 'What does the legal maxim "Caveat Emptor" mean?',
        o: ['Let the buyer beware', 'The seller is always right', 'Goods once sold are free', 'Pay before delivery'],
        a: 0,
        e: 'Caveat Emptor warns buyers to inspect goods carefully before purchase.',
      },
      {
        q: 'Which Nigerian agency sets and monitors quality standards for industrial products such as cement, tyres and electrical cables?',
        o: ['Standards Organisation of Nigeria (SON)', 'NAFDAC', 'CBN', 'INEC'],
        a: 0,
        e: 'SON establishes and enforces Nigerian Industrial Standards (NIS) for manufactured goods.',
      },
      {
        q: 'Setting a high initial price on a brand-new smartphone model to capture early adopters before cutting price later is called',
        o: ['price skimming', 'penetration pricing', 'loss-leader pricing', 'predatory dumping'],
        a: 0,
        e: 'Price skimming charges a premium early on before lowering the price for broader segments.',
      },
      {
        q: 'Which agency replaced the former Consumer Protection Council as Nigeria’s apex competition and consumer protection authority?',
        o: ['FCCPC', 'NIPOST', 'CAC', 'FMBN'],
        a: 0,
        e: 'The Federal Competition and Consumer Protection Commission (FCCPC) enforces consumer rights and fair competition nationwide.',
      },
    ],
  },
  {
    id: 'comm-business-units',
    name: 'Business units, partnerships, companies and public enterprises',
    sec: 'Business organisation',
    goals: [
      'Compare sole proprietorship, partnership, private and public limited companies, cooperative societies and public corporations',
      'Explain incorporation documents (Memorandum and Articles of Association), limited liability, nationalisation and privatisation',
    ],
    trap: 'Do not confuse PRIVATE Limited Companies (Ltd) with PUBLIC Limited Companies (Plc) or PUBLIC CORPORATIONS: both Ltd and Plc are privately owned businesses (Plc simply invites the general public to buy shares on the stock exchange), whereas a Public Corporation is owned by the GOVERNMENT.',
    parts: [
      {
        title: 'Sole proprietorship, partnership and cooperatives',
        idea: 'A sole proprietorship is owned and managed by one person — easy to start with quick decisions, but limited capital and unlimited personal liability. A partnership pools capital and skills of 2 to 20 partners (2 to 10 in banking) guided by a Partnership Deed, though ordinary partners still face unlimited liability. A cooperative society is democratically owned by members ("one member, one vote") to serve members’ welfare (consumers’, producers’, thrift/credit or multipurpose cooperatives) rather than maximise outsider profit.',
        terms: [
          ['Unlimited liability', 'Owner’s personal assets (house, car, savings) can be seized to settle unpaid business debts'],
          ['Partnership Deed', 'Written agreement setting out capital ratios, profit-sharing, salaries, drawings and dispute rules among partners'],
          ['Active vs Sleeping partner', 'An active partner manages daily operations; a sleeping (dormant) partner supplies capital without daily management'],
          ['Cooperative society', 'Voluntary association owned and controlled democratically ("one member, one vote") by its members'],
        ],
        rules: [
          'Without a Partnership Deed, the Partnership Act applies default rules: equal profit/loss sharing, no partner salaries, no interest on capital and 5% interest on partner loans.',
          'A nominal partner lends only their respected name to the firm without contributing capital or sharing profits, yet can still be held liable to outsiders who relied on their name.',
          'Cooperatives distribute surplus as "patronage dividends" based on how much a member used the cooperative, not merely share size.',
        ],
        table: {
          headers: ['Business form', 'Membership', 'Liability & continuity'],
          rows: [
            ['Sole proprietorship', '1 owner', 'Unlimited liability; ends on owner’s death'],
            ['Ordinary partnership', '2–20 (2–10 banking)', 'Unlimited; dissolves if a partner dies/leaves unless agreed'],
            ['Cooperative society', 'Open voluntary membership', 'Limited liability; democratic ("one member, one vote")'],
          ],
          trapNote: 'Remember: in a LIMITED company voting depends on number of shares held, whereas in a COOPERATIVE every member gets ONE vote regardless of shares.',
        },
        example: {
          q: 'Three friends open a printing partnership without signing a Partnership Deed. Partner A contributed ₦600k, B ₦300k and C ₦100k. How must a ₦900k profit be shared?',
          steps: [
            ['Check for Partnership Deed', 'None exists → Partnership Act default applies'],
            ['Apply default rule', 'Profits are shared EQUALLY regardless of capital contributed: ₦300k each'],
          ],
        },
        yourTurn: {
          q: 'Which core principle distinguishes a cooperative society most sharply from a public limited company?',
          o: [
            'Democratic control on the basis of "one member, one vote" rather than voting by number of shares',
            'Refusal to sell goods for cash',
            'Ownership strictly by the federal government',
            'Unlimited liability for every member',
          ],
          a: 0,
          h: [
            'Compare how decisions are voted on in a Plc versus a cooperative.',
            'In a cooperative, a wealthy member does not outvote ten modest members.',
          ],
          e: 'Cooperatives operate democratically on a "one member, one vote" basis to promote member welfare.',
        },
      },
      {
        title: 'Limited companies and public enterprises',
        idea: 'A limited liability company is a separate legal person registered in Nigeria with the Corporate Affairs Commission (CAC) under CAMA — it can own property, sue and be sued in its own name, enjoys perpetual succession and limits shareholders’ loss strictly to their unpaid share value. Private companies ("Ltd") restrict share transfer and cannot invite the public to buy shares; Public companies ("Plc") can raise massive capital from the public via a prospectus and list on the stock exchange. Public corporations (government-owned enterprises) provide strategic utilities, though many have been commercialised or privatised to boost efficiency.',
        terms: [
          ['Memorandum of Association', 'External constitution of a company stating its name, registered office, objects clause, capital and limited liability'],
          ['Articles of Association', 'Internal rules governing shareholder meetings, directors’ powers, voting and dividend payment'],
          ['Certificate of Incorporation', 'CAC birth certificate giving a company separate legal personality'],
          ['Privatisation vs Commercialisation', 'Privatisation sells government ownership to private investors; commercialisation keeps government ownership while requiring profit-oriented self-funding'],
        ],
        rules: [
          'A Private Limited Company (Ltd) starts business immediately upon receiving its Certificate of Incorporation; a Public Limited Company (Plc) also needs a Certificate of Trading.',
          'Memorandum = company’s relationship with the OUTSIDE world; Articles = company’s INTERNAL management rules.',
          'Nationalisation is when government takes over a private (often foreign) enterprise, usually with compensation.',
        ],
        table: {
          headers: ['Feature', 'Private Ltd (Ltd)', 'Public Ltd (Plc)'],
          rows: [
            ['Public share offer', 'Not allowed', 'Allowed via Prospectus / NGX'],
            ['Transfer of shares', 'Restricted (needs directors’ consent)', 'Freely transferable on stock exchange'],
            ['Published accounts', 'Need not publish to general public', 'Must publish audited annual accounts'],
            ['Trading start', 'After Certificate of Incorporation', 'After Certificate of Incorporation + Certificate of Trading'],
          ],
          trapNote: 'Remember the quick cue: Memorandum = Outside world; Articles = Inside rules.',
        },
        example: {
          q: 'A shareholder owns 1,000 fully paid shares worth ₦10 each in Acme Foods Ltd. If the company collapses owing ₦50 million, how much personal cash can creditors force that shareholder to pay?',
          steps: [
            ['Check liability status', 'Limited liability company; shares are already fully paid'],
            ['Conclude', '₦0 extra — the shareholder loses only the ₦10,000 already invested'],
          ],
        },
        yourTurn: {
          q: 'Which company registration document governs the INTERNAL management rules of a company, such as directors’ powers and voting procedures?',
          o: [
            'Articles of Association',
            'Memorandum of Association',
            'Certificate of Origin',
            'Bill of Lading',
          ],
          a: 0,
          h: [
            'Separate the external charter (objects, name, share capital) from the internal rulebook.',
            'Memorandum faces outward; the other document governs internal governance.',
          ],
          e: 'The Articles of Association set out a company’s internal rules for meetings, voting and directors.',
        },
      },
    ],
    qs: [
      {
        q: 'Which Nigerian body is legally responsible for registering companies and business names?',
        o: ['Corporate Affairs Commission (CAC)', 'Central Bank of Nigeria', 'Nigeria Customs Service', 'NAFDAC'],
        a: 0,
        e: 'The Corporate Affairs Commission (CAC) administers company registration under CAMA.',
      },
      {
        q: 'A partner who contributes capital and shares profits but takes no part in day-to-day running of the business is a',
        o: ['sleeping (dormant) partner', 'active partner', 'nominal partner', 'sole trader'],
        a: 0,
        e: 'A sleeping or dormant partner invests capital without participating in daily operations.',
      },
      {
        q: 'Which document serves as an invitation to the general public to subscribe for shares in a Public Limited Company (Plc)?',
        o: ['Prospectus', 'Partnership Deed', 'Credit Note', 'Consular Invoice'],
        a: 0,
        e: 'A prospectus discloses financial details and invites the public to buy shares in a Plc.',
      },
      {
        q: 'When government retains ownership of a public enterprise but stops annual grants so it operates commercially and covers its own costs, this is',
        o: ['commercialisation', 'privatisation', 'nationalisation', 'liquidation'],
        a: 0,
        e: 'Commercialisation retains public ownership while reorganising the enterprise to operate on commercial principles.',
      },
      {
        q: 'Which document legally brings a limited liability company into existence as a separate corporate person?',
        o: ['Certificate of Incorporation', 'Articles of Association', 'Trade Invoice', 'Promissory Note'],
        a: 0,
        e: 'The Certificate of Incorporation issued by CAC confers separate legal personality.',
      },
      {
        q: 'Why can a Public Limited Company outlive all of its original founders?',
        o: [
          'It enjoys perpetual succession as a separate legal entity',
          'Founders are forbidden from retiring',
          'Government pays its debts automatically',
          'It never pays dividends',
        ],
        a: 0,
        e: 'Separate legal personality gives a company perpetual succession — share transfers or death of members do not end the company.',
      },
    ],
  },
  {
    id: 'comm-trade-associations-exchanges',
    name: 'Trade associations, chambers of commerce and commodity exchanges',
    sec: 'Business organisation',
    goals: [
      'Distinguish between trade associations, chambers of commerce, cartels, trusts and holding companies',
      'Explain the structure, tradable commodities and economic benefits of a commodity exchange',
    ],
    trap: 'Do not confuse a TRADE ASSOCIATION with a CHAMBER OF COMMERCE: a trade association unites firms in ONE specific trade (e.g., Bakers’ Association), whereas a Chamber of Commerce unites ALL kinds of businesses within a city or region (e.g., Lagos Chamber of Commerce and Industry).',
    parts: [
      {
        title: 'Trade associations, chambers of commerce and business combinations',
        idea: 'Businesses often band together to protect shared interests. A trade association unites firms in the SAME line of business (e.g., Pharmaceutical Society or Master Bakers) to set ethical standards, lobby government and share market information. A Chamber of Commerce brings together diverse businesses in a city or nation (like LCCI or NACCIMA) to promote trade fairs, issue Certificates of Origin and advise on economic policy. Larger combinations include cartels (output/price quotas like OPEC), mergers, consortia and holding companies.',
        terms: [
          ['Trade association', 'Voluntary body of businesses operating in the same industry to protect common interests and standards'],
          ['Chamber of Commerce', 'Association of diverse commercial and industrial firms within a town, state or country promoting general trade'],
          ['Cartel', 'Formal agreement among independent rival producers to control output or prices (e.g., OPEC)'],
          ['Holding company', 'A parent company that acquires over 50% of the voting shares of subsidiary companies to control their policies'],
        ],
        rules: [
          'A horizontal merger joins two firms at the same production stage (two banks merging); a vertical merger joins firms at successive stages (a bakery buying a flour mill).',
          'A consortium is a temporary alliance of separate firms pooling massive capital and expertise for one giant project (e.g., building a bridge or refinery).',
          'Chambers of Commerce are non-profit and promote overall commerce, NOT the narrow price-fixing of one product.',
        ],
        table: {
          headers: ['Organisation / combination', 'Scope / structure'],
          rows: [
            ['Trade association', 'Same industry/trade; sets ethics & represents members'],
            ['Chamber of Commerce', 'All industries in a city/nation; organises trade fairs & advocacy'],
            ['Cartel', 'Independent rivals coordinating output/price'],
            ['Consortium', 'Temporary joint pool for one mega-contract'],
            ['Holding company', 'Parent firm owning >50% controlling shares in subsidiaries'],
          ],
          trapNote: 'Remember that in Nigeria, NACCIMA (Nigerian Association of Chambers of Commerce, Industry, Mines and Agriculture) is the national umbrella body of Chambers of Commerce.',
        },
        example: {
          q: 'A Nigerian cocoa-processing factory buys a 2,000-hectare cocoa plantation to secure its raw bean supply. What type of business integration is this?',
          steps: [
            ['Identify the stages', 'Factory (processing) acquires plantation (raw material supplier)'],
            ['Name the direction', 'Backward vertical integration'],
          ],
        },
        yourTurn: {
          q: 'Which body brings together banks, manufacturers, transporters and retailers across a single city to host trade fairs and advise government on business policy?',
          o: ['Chamber of Commerce', 'Cartel', 'Trade union', 'Consumer cooperative'],
          a: 0,
          h: [
            'Notice that members come from MANY different industries within one geographical area.',
            'Examples in Nigeria include LCCI and ACCI.',
          ],
          e: 'A Chamber of Commerce unites diverse businesses within a geographical area to promote general trade and commerce.',
        },
      },
      {
        title: 'Commodity exchanges',
        idea: 'A commodity exchange (such as the Abuja Securities and Commodity Exchange — ASCE — or AFEX in Nigeria) is an organised marketplace where standardised raw agricultural, mineral or energy commodities (cocoa, maize, sesame, soybeans, ginger, crude oil, gold) are traded by grade and sample rather than hauling sacks onto the floor. Trading includes spot contracts (immediate delivery) and futures contracts (agreed price today for delivery at a future date), which protect farmers and buyers from wild price swings.',
        terms: [
          ['Commodity exchange', 'Organised market for buying and selling standardised primary commodities by grade'],
          ['Spot trading', 'Buying or selling a commodity for immediate payment and delivery'],
          ['Futures contract', 'Binding agreement to buy or sell a fixed quantity and grade of a commodity at a preset price on a future date'],
          ['Hedging', 'Using futures contracts to lock in prices and protect farmers or processors from unpredictable price drops or spikes'],
        ],
        rules: [
          'Tradable commodities must be durable/storable, easily graded into uniform quality standards and widely demanded in bulk.',
          'Commodity exchanges provide transparent price discovery, reliable warehousing receipts (usable as bank loan collateral) and lower post-harvest losses.',
          'Challenges in Nigeria include inadequate rural storage, poor feeder roads, inconsistent grading and limited farmer awareness.',
        ],
        table: {
          headers: ['Contract type', 'Timing of delivery', 'Main use'],
          rows: [
            ['Spot contract', 'Immediate (now)', 'Routine cash buying and selling of available stock'],
            ['Forward / Futures contract', 'Agreed future month', 'Price protection (hedging) against harvest price swings'],
          ],
          trapNote: 'Goods traded on a commodity exchange do NOT have to be physically present on the trading floor — standardised grading certificates and warehouse receipts represent the cargo.',
        },
        example: {
          q: 'How does a warehouse receipt from a certified commodity exchange help a smallholder maize farmer in Kaduna?',
          steps: [
            ['Avoids distress sales', 'The farmer stores maize safely right after harvest instead of selling cheap immediately'],
            ['Unlocks credit', 'Banks accept the certified warehouse receipt as collateral for a low-risk loan until prices rise'],
          ],
        },
        yourTurn: {
          q: 'Which property is essential for an agricultural product to be traded smoothly on a commodity exchange?',
          o: [
            'It must be storable and easily graded into uniform quality standards',
            'It must spoil within 24 hours',
            'Every single unit must be completely unique and ungradable',
            'It must be sold only in tiny retail sachets',
          ],
          a: 0,
          h: [
            'Because buyers trade by contract and grade without inspecting every sack personally, consistency and shelf life matter most.',
            'Think of maize, cocoa, soybeans and sesame versus freshly cooked soup.',
          ],
          e: 'Commodities traded on an exchange must be durable enough for storage and capable of reliable standardisation and grading.',
        },
      },
    ],
    qs: [
      {
        q: 'Which of the following is an example of a trade association rather than a Chamber of Commerce?',
        o: [
          'Association of Master Bakers of Nigeria',
          'Lagos Chamber of Commerce and Industry',
          'NACCIMA',
          'Abuja Chamber of Commerce',
        ],
        a: 0,
        e: 'Master Bakers unites firms within one single trade, whereas Chambers of Commerce span all business sectors.',
      },
      {
        q: 'When two commercial banks merge to expand their branch network, this combination is a',
        o: ['horizontal merger', 'backward vertical merger', 'consortium', 'cartel'],
        a: 0,
        e: 'Two firms operating in the same industry at the same stage form a horizontal merger.',
      },
      {
        q: 'A temporary alliance of several engineering firms pooling funds and skills to build a major dam is called a',
        o: ['consortium', 'cooperative', 'sole proprietorship', 'cartel'],
        a: 0,
        e: 'A consortium pools resources temporarily to execute a single large-scale project.',
      },
      {
        q: 'Buying or selling graded soybeans on a commodity exchange for immediate cash payment and delivery is called',
        o: ['spot trading', 'futures hedging', 'entrepot trade', 'barter'],
        a: 0,
        e: 'Spot contracts settle for immediate payment and delivery.',
      },
      {
        q: 'Using a futures contract on a commodity exchange to lock in a guaranteed selling price before harvest is known as',
        o: ['hedging', 'dumping', 'smuggling', 'inflation'],
        a: 0,
        e: 'Hedging protects producers and processors against adverse future price fluctuations.',
      },
      {
        q: 'Which of the following is a primary benefit of a well-functioning commodity exchange to Nigerian farmers?',
        o: [
          'Transparent market prices and access to warehouse-receipt financing',
          'Elimination of all farming costs',
          'Banning exports of cocoa',
          'Replacing banks completely',
        ],
        a: 0,
        e: 'Commodity exchanges reduce middleman exploitation through open pricing and certified storage receipts.',
      },
    ],
  },
  {
    id: 'comm-contracts-agency-hp',
    name: 'Contracts, agency, sale of goods and hire purchase',
    sec: 'Commercial law',
    goals: [
      'Identify the essential elements of a valid contract, ways a contract ends and remedies for breach of contract',
      'Explain agency relationships, conditions vs warranties in Sale of Goods, and Hire Purchase vs Credit Sale (Deferred Payment)',
    ],
    trap: 'Do not confuse HIRE PURCHASE with CREDIT SALE (Deferred Payment): in Hire Purchase, legal ownership stays with the seller until the VERY LAST instalment is paid (so the seller can repossess on default); in Credit Sale, ownership passes to the buyer IMMEDIATELY on signing.',
    parts: [
      {
        title: 'Law of contract and agency',
        idea: 'A contract is a legally binding agreement enforceable by the courts. Every valid contract requires six essential elements: Offer, Acceptance, Consideration (something of value exchanged), Intention to create legal relations, Capacity to contract (adults of sound mind) and Legality of purpose. Contracts end (discharge) by performance, mutual agreement, frustration (unforeseen impossibility), lapse of time or breach. In Agency, an agent acts on behalf of a principal to create binding contracts with third parties.',
        terms: [
          ['Consideration', 'The price or benefit each party exchanges — without consideration, an ordinary promise is not enforceable'],
          ['Invitation to treat', 'A shop display or advert inviting customers to make an offer (NOT itself a binding offer)'],
          ['Frustration', 'Automatic end of a contract when an unforeseen outside event (e.g., a hall burning down before a concert) makes performance impossible'],
          ['Ratification', 'A principal later approving an unauthorised act done in their name, making it binding retroactively'],
        ],
        rules: [
          'Goods priced on a supermarket shelf are an INVITATION TO TREAT; the customer makes the offer at the checkout counter.',
          'Remedies for breach of contract include damages (money compensation), specific performance (court order to fulfil), injunction and rescission.',
          'Agency arises by express appointment, implication, necessity (emergency protection of goods) or ratification.',
        ],
        table: {
          headers: ['Contract term', 'Plain meaning'],
          rows: [
            ['Offer', 'Definite proposal ready to bind once accepted unconditionally'],
            ['Invitation to treat', 'Catalogue, auction notice or price tag inviting offers'],
            ['Counter-offer', 'Changing the terms — rejects the original offer and starts a new one'],
            ['Damages', 'Monetary compensation restoring the innocent party after a breach'],
          ],
          trapNote: 'If a buyer replies "I accept your car for ₦2m IF you change the tyres first", that is a COUNTER-OFFER, not acceptance — it kills the original offer.',
        },
        example: {
          q: 'A shop mistakenly tags a ₦250,000 laptop at ₦25,000 on display. At the checkout, the manager refuses to sell at ₦25,000. Has the shop breached a contract?',
          steps: [
            ['Classify the price tag', 'A shop display is an invitation to treat, not a binding offer'],
            ['Conclude', 'No contract existed yet until the cashier accepted payment, so there is no breach of contract'],
          ],
        },
        yourTurn: {
          q: 'If a booked wedding hall unexpectedly burns down two days before the ceremony through no fault of either party, the contract is discharged by',
          o: ['frustration', 'performance', 'ratification', 'counter-offer'],
          a: 0,
          h: [
            'Neither party breached the agreement deliberately — an unforeseen disaster made performance impossible.',
            'Look for the legal term covering supervening impossibility.',
          ],
          e: 'Frustration discharges a contract when an unforeseeable external event makes performance impossible.',
        },
      },
      {
        title: 'Sale of goods, hire purchase and credit sale',
        idea: 'Under the Sale of Goods Act, contract terms are either Conditions (vital terms — breach lets the buyer reject the goods and cancel the contract) or Warranties (minor terms — breach allows claiming damages only, not cancelling). For expensive items like vehicles or machines, buyers often pay in instalments via Hire Purchase (renting with an option to buy; ownership passes only on final payment) or Credit Sale / Deferred Payment (ownership passes immediately; seller can only sue for unpaid balance, not repossess).',
        terms: [
          ['Condition', 'A fundamental term at the heart of a sale contract; breaking it lets the buyer reject the goods and claim refund'],
          ['Warranty', 'A minor collateral term; breaking it entitles the buyer to damages but not cancellation of the sale'],
          ['Hire purchase', 'Instalment agreement where the buyer uses goods immediately but becomes legal owner only after paying the final instalment'],
          ['Credit sale (Deferred payment)', 'Instalment sale where ownership transfers immediately on purchase and the seller cannot repossess the goods'],
        ],
        rules: [
          'Implied conditions in Sale of Goods: seller has legal title to sell, goods match description/sample, goods are of merchantable quality and fit for known purpose.',
          'Under Hire Purchase, the buyer cannot validly resell the item before finishing all instalments because they do not yet own it.',
          'Hire Purchase costs more than a cash purchase because of interest/finance charges, yet helps low-cash buyers acquire durable assets.',
        ],
        table: {
          headers: ['Feature', 'Hire Purchase', 'Credit Sale (Deferred Payment)'],
          rows: [
            ['When ownership passes', 'Only after paying the FINAL instalment', 'IMMEDIATELY upon agreement'],
            ['If buyer defaults', 'Seller can repossess the goods (subject to law)', 'Seller cannot repossess; must sue for unpaid debt'],
            ['Can buyer resell early?', 'No (not yet the legal owner)', 'Yes (already the legal owner)'],
            ['Typical goods', 'Durable high-value assets (cars, generators)', 'Fast-depreciating or lower-value items'],
          ],
          trapNote: 'Memory anchor: HIRE purchase = you are HIRING (not owning) until the last naira is paid.',
        },
        example: {
          q: 'Chuka buys a motorbike on Credit Sale and stops paying after month three. Can the dealer legally seize the motorbike from Chuka’s compound?',
          steps: [
            ['Check the agreement type', 'Credit Sale (not Hire Purchase)'],
            ['Apply ownership rule', 'Ownership passed immediately to Chuka — the dealer cannot repossess and must sue for the remaining balance'],
          ],
        },
        yourTurn: {
          q: 'In a Sale of Goods contract, what happens if the seller breaches a fundamental "Condition" rather than a minor "Warranty"?',
          o: [
            'The buyer may reject the goods, cancel the contract and claim damages',
            'The buyer must keep the faulty goods with zero compensation',
            'The contract automatically becomes a Hire Purchase agreement',
            'Only the seller may cancel the contract',
          ],
          a: 0,
          h: [
            'Compare the seriousness of a condition (essential to the contract) with a warranty (secondary promise).',
            'Breaking a condition gives the stronger remedy of repudiation/rejection.',
          ],
          e: 'Breach of a condition entitles the buyer to repudiate (cancel) the contract, reject the goods and seek damages.',
        },
      },
    ],
    qs: [
      {
        q: 'Items displayed with price tags inside a shop window legally constitute',
        o: ['an invitation to treat', 'a completed contract', 'a binding acceptance', 'a breach of warranty'],
        a: 0,
        e: 'Displays and catalogues invite customers to make an offer; they are invitations to treat.',
      },
      {
        q: 'Which element of a valid contract represents the mutual exchange of something of value between the parties?',
        o: ['Consideration', 'Frustration', 'Subrogation', 'Ratification'],
        a: 0,
        e: 'Consideration is the value or promise exchanged by each contracting party.',
      },
      {
        q: 'When does legal ownership of a generator bought on Hire Purchase transfer to the buyer?',
        o: [
          'Upon payment of the very last instalment',
          'Immediately upon paying the initial deposit',
          'After paying half of the instalments',
          'As soon as the generator is delivered',
        ],
        a: 0,
        e: 'Under Hire Purchase, ownership stays with the seller until the final instalment is settled.',
      },
      {
        q: 'If a buyer defaults under a Credit Sale (deferred payment) agreement, the seller’s legal remedy is to',
        o: [
          'sue the buyer in court for the unpaid balance',
          'forcibly repossess the goods immediately',
          'cancel the buyer’s bank account',
          'charge customs duty',
        ],
        a: 0,
        e: 'Because title passed immediately in a Credit Sale, the seller can sue for the debt but cannot repossess the goods.',
      },
      {
        q: 'A principal who formally adopts an unauthorised contract previously entered into in their name creates agency by',
        o: ['ratification', 'necessity', 'frustration', 'indemnity'],
        a: 0,
        e: 'Ratification is the retrospective approval of an unauthorised act done on a principal’s behalf.',
      },
      {
        q: 'A court order compelling a seller of unique land to honour the agreed transfer instead of merely paying money damages is called',
        o: ['specific performance', 'injunction', 'frustration', 'consideration'],
        a: 0,
        e: 'Specific performance orders exact fulfilment where money damages alone would be inadequate.',
      },
    ],
  },
  {
    id: 'comm-management-environment-ecom',
    name: 'Management, business environment and e-commerce',
    sec: 'Modern business',
    goals: [
      'Explain the core functions of management, organisational structures and business social responsibility',
      'Explain the internal/external business environment and the features, benefits and risks of e-commerce',
    ],
    trap: 'Do not confuse SPAN OF CONTROL with CHAIN OF COMMAND: span of control is the NUMBER of subordinates directly reporting to one manager, while chain of command is the vertical LINE of authority from top executive down to frontline staff.',
    parts: [
      {
        title: 'Management functions, structure and business environment',
        idea: 'Management gets goals achieved efficiently through people using five classic functions: Planning, Organising, Staffing, Directing (Leading) and Controlling. Organisational charts clarify who reports to whom (line, functional or line-and-staff structure). Every business operates inside an environment — internal factors it controls (staff, capital, culture) and external PESTLE forces it adapts to (political, economic, social, technological, legal and ecological).',
        terms: [
          ['Span of control', 'The number of subordinates who report directly to a single supervisor or manager'],
          ['Delegation', 'Assigning specific tasks and matching authority to a subordinate while the manager keeps final accountability'],
          ['Corporate Social Responsibility (CSR)', 'A business’s ethical duty to care for employees, honest customers, local communities and the environment beyond mere profit'],
        ],
        rules: [
          'When you delegate a task, you pass authority and responsibility for doing it, but ultimate ACCOUNTABILITY remains with the delegating manager.',
          'Main business departments: Production, Marketing, Finance/Accounts, Human Resources (Personnel) and Administration.',
          'Internal environment is controllable by management; external environment (inflation, CBN interest rates, new laws, climate) must be monitored and adapted to.',
        ],
        table: {
          headers: ['Management function', 'Core question answered'],
          rows: [
            ['Planning', 'What goals are we aiming for and how will we reach them?'],
            ['Organising', 'How should tasks, teams and resources be grouped?'],
            ['Directing / Leading', 'How do we motivate and guide staff daily?'],
            ['Controlling', 'Are actual results matching our plan, and what needs fixing?'],
          ],
          trapNote: 'Remember: a manager can delegate AUTHORITY, never ultimate ACCOUNTABILITY — if a delegated project fails, the manager still answers for it.',
        },
        example: {
          q: 'A cement company builds a free community borehole, installs dust filters on its chimneys and awards local scholarships. What commercial concept does this illustrate?',
          steps: [
            ['Identify the beneficiaries', 'Local host community and natural environment'],
            ['Name the concept', 'Corporate Social Responsibility (CSR)'],
          ],
        },
        yourTurn: {
          q: 'What is the number of subordinates directly supervised by one manager called?',
          o: ['Span of control', 'Chain of command', 'Delegation', 'Division of labour'],
          a: 0,
          h: [
            'Think of how "wide" or "narrow" one supervisor’s team is.',
            'Chain of command is vertical; this term measures the horizontal headcount reporting to one boss.',
          ],
          e: 'Span of control is the number of subordinates reporting directly to a single manager.',
        },
      },
      {
        title: 'E-commerce and digital business',
        idea: 'Electronic commerce (e-commerce) is buying, selling, paying for and marketing goods and services over electronic networks like the internet. Models include B2C (online retail stores selling to shoppers), B2B (factories ordering from suppliers online), C2C (peer-to-peer marketplaces) and mobile commerce (m-commerce via banking apps and USSD). E-commerce breaks geographic limits and runs 24/7, but requires reliable logistics, digital trust and cybersecurity against phishing and online fraud.',
        terms: [
          ['E-commerce', 'Conducting commercial buying, selling and electronic payment over the internet'],
          ['B2C vs B2B', 'B2C = Business-to-Consumer (e.g., an online store selling phones to students); B2B = Business-to-Business (wholesalers supplying retailers online)'],
          ['E-payment', 'Cashless digital settlement via debit cards, bank transfers, USSD, mobile wallets or POS'],
        ],
        rules: [
          'Benefits of e-commerce: 24-hour trading, lower shop-rent overhead, wider nationwide/global reach and easy price comparison.',
          'Challenges in Nigeria: internet cost/coverage, delivery logistics in remote areas, inability to touch goods before delivery and online payment scams.',
          'Safe e-commerce practices: use verified HTTPS sites, never share card PINs/OTPs, verify merchant reviews and use escrow/pay-on-delivery when unsure.',
        ],
        table: {
          headers: ['E-commerce model', 'Who trades with whom?', 'Everyday example'],
          rows: [
            ['B2C', 'Business → Consumer', 'Student ordering textbooks from an online bookshop'],
            ['B2B', 'Business → Business', 'Bakery ordering 500 bags of flour from a mill’s portal'],
            ['C2C', 'Consumer → Consumer', 'Graduate selling a used laptop to another student on a classifieds app'],
          ],
          trapNote: 'E-commerce relies on strong PHYSICAL logistics (couriers and warehouses) — clicking "buy" is digital, yet physical goods still need reliable road/air delivery.',
        },
        example: {
          q: 'A small shoe maker in Aba sells handmade leather sandals via Instagram and WhatsApp to customers in Abuja using instant bank transfers and courier vans. Identify the e-commerce model and two benefits.',
          steps: [
            ['Model', 'Business-to-Consumer (B2C) social/m-commerce'],
            ['Benefits', 'Reaches national buyers without renting an Abuja shop; fast cashless payment'],
          ],
        },
        yourTurn: {
          q: 'A student selling a used scientific calculator directly to another student through an online classifieds platform illustrates which e-commerce model?',
          o: ['C2C (Consumer-to-Consumer)', 'B2B (Business-to-Business)', 'G2B (Government-to-Business)', 'Entrepot trade'],
          a: 0,
          h: [
            'Check whether either side is a registered retail store or if both sides are individual consumers.',
            'Individual-to-individual online trading has its own three-character code.',
          ],
          e: 'Direct online transactions between individual consumers are classified as C2C (Consumer-to-Consumer) e-commerce.',
        },
      },
    ],
    qs: [
      {
        q: 'Which management function involves comparing actual performance against set targets and correcting deviations?',
        o: ['Controlling', 'Planning', 'Staffing', 'Organising'],
        a: 0,
        e: 'Controlling monitors actual outcomes against planned standards and takes corrective action.',
      },
      {
        q: 'When a manager delegates a task to a junior officer, what can NEVER be fully delegated away?',
        o: ['Ultimate accountability', 'Routine data entry', 'Daily scheduling', 'Drafting memos'],
        a: 0,
        e: 'Authority can be delegated, but final accountability always remains with the delegating manager.',
      },
      {
        q: 'Which of the following belongs to a company’s EXTERNAL business environment?',
        o: [
          'Changes in Central Bank interest rates and inflation',
          'The company’s own factory machines',
          'The firm’s internal accounting staff',
          'The company’s product logo',
        ],
        a: 0,
        e: 'Macroeconomic policies like CBN interest rates and inflation lie outside the firm’s direct control.',
      },
      {
        q: 'An online portal where textile manufacturers supply bulk fabric orders exclusively to garment factories is an example of',
        o: ['B2B e-commerce', 'C2C e-commerce', 'barter trade', 'hawking'],
        a: 0,
        e: 'Commercial online trading between two businesses is B2B (Business-to-Business).',
      },
      {
        q: 'Which practice represents a major risk consumers must guard against in e-commerce?',
        o: [
          'Online fraud, fake stores and phishing for card OTPs',
          '24-hour store opening',
          'Comparing prices quickly',
          'Receiving electronic receipts',
        ],
        a: 0,
        e: 'Cybercrime and fraudulent listings require verified platforms and strong payment security.',
      },
      {
        q: 'A factory reducing river pollution and funding a local primary school library is demonstrating',
        o: [
          'Corporate Social Responsibility (CSR)',
          'price skimming',
          'vertical integration',
          'breach of warranty',
        ],
        a: 0,
        e: 'CSR reflects a firm’s ethical responsibility toward its community and environment.',
      },
    ],
  },
];

export function buildCommCurriculum() {
  return buildUtmeSubjectCurriculum(COMM_SPECS);
}
