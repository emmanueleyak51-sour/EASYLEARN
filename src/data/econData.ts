import type {
  Beat,
  IdeaBeat,
  InteractiveLesson,
  TeachBeat,
  TeachBlock,
  Topic,
} from '../types';
import { perm } from '../utils/engine';
import { ECON_TOPICS_PART1 } from './econTopicsPart1';
import { ECON_TOPICS_PART2 } from './econTopicsPart2';
import { ECON_TOPICS_PART3 } from './econTopicsPart3';

interface EconTableSpec {
  title: string;
  headers: string[];
  rows: string[][];
}

const ECON_TEACH_TABLES: Record<string, EconTableSpec> = {
  'ec-nature': {
    title: 'Core Foundations: Scarcity, Scale of Preference, Opportunity Cost & PPC',
    headers: ['Concept', 'Precise Economic Meaning', 'WAEC / JAMB Distinction'],
    rows: [
      ['Scarcity', 'Resources are limited in supply RELATIVE to insatiable human wants', 'Universal root cause of all economic problems for households, firms & states'],
      ['Scale of Preference', 'Ranked list of unsatisfied wants arranged in descending order of priority', 'Enables rational choice so maximum satisfaction is achieved per Naira'],
      ['Opportunity (Real) Cost', 'The single NEXT BEST alternative forgone when a choice is made', 'Measured in sacrificed physical alternatives — NEVER money price paid!'],
      ['PPC Frontier', 'Boundary = full employment; Inside = unemployment; Outside = currently unattainable', 'Concave (bowed out) = increasing opportunity cost; Linear = constant cost'],
    ],
  },
  'ec-systems': {
    title: 'Comparative Economic Systems: Capitalism vs Socialism vs Mixed Economy',
    headers: ['Feature', 'Free-Market Capitalism', 'Centrally Planned Socialism / Mixed'],
    rows: [
      ['Ownership of Factors', 'Private individuals and corporations', 'Socialism: State-owned · Mixed (Nigeria): Both private & public sectors'],
      ['Resource Allocation', 'Invisible hand of Price Mechanism & profit signals', 'Socialism: Central Planning Board · Mixed: Market prices + state regulation'],
      ['What & For Whom', 'Consumer sovereignty & purchasing power', 'Socialism: State priorities & need · Mixed: Market + progressive welfare'],
      ['Key Weakness', 'Income inequality, monopoly abuse & neglect of public goods', 'Socialism: Bureaucracy, weak incentives & restricted consumer choice'],
    ],
  },
  'ec-stats': {
    title: 'Statistical Tools: Central Tendency vs Dispersion & Charts',
    headers: ['Measure / Tool', 'Formula / Construction Rule', 'Best Economic Use & Exam Trap'],
    rows: [
      ['Pie Chart Angle', 'θ = (Category Value ÷ Grand Total) × 360°', 'Convert to 360° degrees — NEVER leave as 100% percentage!'],
      ['Grouped Mean (x̄)', 'x̄ = Σfx ÷ Σf', 'Divide Σfx by total frequency Σf — NEVER by number of table rows!'],
      ['Median vs Mode', 'Median = middle ordered value · Mode = highest frequency', 'Median resists billionaire outliers in skewed income distributions'],
      ['Variance & Std Dev', 'σ² = Σf(x − x̄)² ÷ Σf · σ = √σ²', 'Measures spread/risk; Σ(x − x̄) is always zero before squaring'],
    ],
  },
  'ec-production': {
    title: 'Factors of Production, Characteristics & Factor Rewards',
    headers: ['Factor', 'Economic Characteristics', 'Factor Reward'],
    rows: [
      ['Land', 'Free gift of nature (soil, minerals, rivers); fixed supply; geographically immobile', 'Rent'],
      ['Labour', 'Human physical & mental effort; perishable; mobile geographically & occupationally', 'Wages & Salaries'],
      ['Capital', 'Man-made wealth used to produce wealth: Fixed (machines) vs Working (raw materials, cash)', 'Interest'],
      ['Entrepreneur', 'Coordinates other factors & bears non-insurable uncertainty (distinct from salaried manager!)', 'Profit (can be negative loss)'],
    ],
  },
  'ec-division-scale': {
    title: 'Division of Labour & Internal vs External Economies of Scale',
    headers: ['Concept', 'Driving Mechanism', 'Cost Curve / Market Impact'],
    rows: [
      ['Division of Labour', 'Splitting production into narrow stages (Adam Smith’s pin factory)', 'Limited primarily by EXTENT OF THE MARKET; risks monotony & strike bottlenecks'],
      ['Internal Economies', 'Cost savings enjoyed by ONE firm expanding its own scale (technical, financial, bulk marketing)', 'Movement DOWNWARD along the firm’s Long-Run Average Cost (LRAC) curve'],
      ['Internal Diseconomies', 'Managerial red tape, slow coordination & worker alienation past optimal size', 'Movement UPWARD along the right-hand arm of LRAC'],
      ['External Economies', 'Industry-wide benefits from geographical clustering (shared skilled labour pool, repair hubs)', 'Downward SHIFT of every firm’s LRAC curve in the cluster'],
    ],
  },
  'ec-business': {
    title: 'Business Units, Corporate Securities & Public Enterprise Reforms',
    headers: ['Entity / Security', 'Ownership, Liability & Capital', 'Control & Return'],
    rows: [
      ['Sole Trader & Partnership', '1 owner vs 2–20 partners; UNLIMITED personal liability', 'Quick decisions, small capital; creditor claims can seize personal assets'],
      ['Private (Ltd) vs Public (Plc)', 'Separate legal entity; LIMITED liability to unpaid share value', 'Plc trades shares publicly on NGX; Ltd restricts share transfer'],
      ['Ordinary vs Debentures', 'Ordinary = true risk-bearing equity owners · Debentures = LOAN CREDITORS', 'Debentures earn fixed interest even in loss years; Ordinary paid variable dividends last'],
      ['Privatization vs Commercialization', 'Privatization sells state equity to private investors', 'Commercialization keeps state ownership but removes subsidies to run for profit'],
    ],
  },
  'ec-population': {
    title: 'Demographic Formulas, Malthusian Trap & Optimum Population',
    headers: ['Concept / Theory', 'Core Relationship', 'Economic Consequence'],
    rows: [
      ['Growth & Dependency', 'Pop Change = (B − D) + (I − E) · Dependency = Dependents ÷ Working Age', 'High youthful dependency lowers household saving and strains school/health budgets'],
      ['Malthusian Theory (1798)', 'Population grows Geometrically (1,2,4,8) vs Food Arithmetically (1,2,3,4)', 'Disproved in advanced nations by mechanization, Green Revolution, trade & family planning'],
      ['Optimum Population', 'Population combining with existing resources/tech to MAXIMIZE output per head', 'Dynamic — rises whenever capital stock and technology advance'],
      ['Under vs Over-Population', 'Below optimum = underutilized resources · Past optimum = falling output per head', 'Over-population is relative to capital/tech, NEVER judged by land area alone!'],
    ],
  },
  'ec-labour': {
    title: 'Labour Market Mobility, Collective Bargaining & Unemployment Types',
    headers: ['Category', 'Mechanism / Definition', 'Policy / Market Outcome'],
    rows: [
      ['Derived Demand (MRP)', 'Firms hire workers for Marginal Revenue Product (MPP × MR)', 'Binding minimum wage ABOVE equilibrium creates excess labour supply'],
      ['Union vs Employer Weapons', 'Union: collective bargaining, work-to-rule, picketing, strike', 'Employer counterpart to strike: LOCKOUT (closing factory gates temporarily)'],
      ['Frictional vs Structural', 'Frictional = short search time · Structural = permanent skill/tech mismatch', 'Structural unemployment cured by TVET/digital retraining'],
      ['Cyclical vs Disguised', 'Cyclical = Keynesian aggregate demand slump · Disguised = MPP is ZERO!', 'Cyclical cured by deficit fiscal stimulus; Disguised common on crowded family farms'],
    ],
  },
  'ec-agric-mining': {
    title: 'Agricultural Systems, Marketing Boards & Nigerian Mineral Map',
    headers: ['Sector / Institution', 'Key Features', 'Nigerian Economic Context'],
    rows: [
      ['Peasant vs Plantation', 'Peasant: fragmented plots, family labour · Plantation: monoculture cash crop + mill', 'Communal land fragmentation & 35% post-harvest rot hinder peasant output'],
      ['Marketing Boards', 'Bought export crops at pre-announced prices to stabilize farmer incomes', 'Abolished 1986 after paying far below world prices (implicit rural tax)'],
      ['Solid Minerals Map', 'Tin & Columbite → Jos Plateau · Coal → Enugu · Iron Ore → Itakpe (Kogi)', 'Limestone (Ewekoro, Ibese, Sokoto, Gboko) powers domestic cement plants'],
      ['Exhaustible Nature', 'Minerals are non-renewable wasting assets (unlike sustainable forestry)', 'Requires reinvesting depletion rents into diversified industry & infrastructure'],
    ],
  },
  'ec-financial': {
    title: 'Central Bank vs Commercial Banks & Money vs Capital Markets',
    headers: ['Institution / Market', 'Core Instruments & Functions', 'Key Formula / Exam Rule'],
    rows: [
      ['Central Bank (CBN)', 'Sole currency issuer, government banker, Lender of Last Resort, monetary policy', 'Non-profit macroeconomic regulator of the entire financial system'],
      ['Commercial Credit Creation', 'Multiplier m = 1/r · Max Deposits = D₀/r · Net Credit = D₀/r − D₀', 'Current accounts use cheques (0% interest); Fixed deposits earn highest interest'],
      ['Money Market (≤ 1 yr)', 'Short-term liquid debt: 91-day Treasury Bills, Commercial Paper, Call Money', 'Provides working-capital liquidity for banks, firms & treasury'],
      ['Capital Market (> 1 yr)', 'Long-term equity & debt: Ordinary Shares, Debentures, Dev. Loan Stock (NGX & SEC)', 'Primary market raises fresh IPO capital; Secondary market provides investor liquidity'],
    ],
  },
  'ec-utility': {
    title: 'Cardinal & Ordinal Consumer Utility Rules',
    headers: ['Concept', 'Mathematical Condition', 'Behavioural Interpretation'],
    rows: [
      ['TU & MU Link', 'MU = ΔTU ÷ ΔQ · TU = ΣMU', 'When MU > 0 and falling, TU still RISES; TU peaks where MU = 0!'],
      ['Equi-Marginal Equilibrium', 'MUx ÷ Px = MUy ÷ Py (or MUx = Px for 1 good)', 'If Px falls, MUx/Px > MUy/Py → consumer buys MORE X (Law of Demand)'],
      ['Paradox of Value', 'Water: huge TU, tiny MU · Diamonds: low TU, huge MU', 'Market price reflects MARGINAL utility, giving huge Consumer Surplus on water'],
      ['Indifference Curves', 'Downward-sloping, convex to origin (diminishing MRS), NEVER intersect', 'Ordinal equilibrium where Budget Line is tangent to highest Indifference Curve'],
    ],
  },
  'ec-demand': {
    title: 'Movements vs Shifts, Interrelated Demand & Exceptional Curves',
    headers: ['Phenomenon', 'Driving Cause', 'Graph / Market Direction'],
    rows: [
      ['Change in Qty Demanded', 'Change in the commodity’s OWN PRICE only', 'Movement ALONG fixed demand curve (extension if P falls, contraction if P rises)'],
      ['Change in Demand', 'Income, tastes, population, or prices of substitutes/complements', 'Bodily SHIFT of entire demand curve (Right = increase, Left = decrease)'],
      ['Interrelated Demands', 'Competitive (Milo/Bournvita), Joint (car/petrol), Derived (flour), Composite (palm oil)', 'Rise in complement price shifts partner’s demand LEFTWARD'],
      ['Exceptional Demand', 'Giffen staples, Veblen ostentatious luxuries, fear of future shortages', 'Abnormal UPWARD-sloping demand segment (higher P → higher Qd)'],
    ],
  },
  'ec-supply-eq': {
    title: 'Market Equilibrium (Qd = Qs) & Legislated Price Controls',
    headers: ['Market Regime', 'Price Level vs P*', 'Resulting Market Outcome'],
    rows: [
      ['Free Equilibrium', 'P = P* where Qd = Qs', 'Market clears completely — zero shortage and zero unsold surplus'],
      ['Maximum Price (Ceiling)', 'Set strictly BELOW P* to protect consumers', 'Qd > Qs → Persistent shortages, queues, hoarding, rationing & BLACK MARKETS!'],
      ['Minimum Price (Floor)', 'Set strictly ABOVE P* (farm support / minimum wage)', 'Qs > Qd → Excess supply / unsold surpluses (requires government buffer stock)'],
      ['Joint vs Competitive Supply', 'Joint: beef & hides · Competitive: maize vs cassava on fixed land', 'Subsidies shift S rightward; indirect taxes shift S leftward'],
    ],
  },
  'ec-elasticity': {
    title: 'Elasticity Coefficients, Total Revenue Rule & Tax Incidence',
    headers: ['Elasticity Type', 'Value / Sign Interpretation', 'Total Revenue & Tax Incidence Rule'],
    rows: [
      ['Elastic PED (> 1)', '|%ΔQd| > |%ΔP| (close substitutes, luxuries)', 'CUT price to raise Total Revenue; PRODUCERS bear larger share of indirect tax'],
      ['Inelastic PED (< 1)', '|%ΔQd| < |%ΔP| (salt, petrol, habit goods)', 'RAISE price to raise Total Revenue; CONSUMERS bear larger share of indirect tax'],
      ['Income Elasticity (YED)', 'YED > 0 = Normal good · YED < 0 = Inferior good', 'Keep the sign! Negative YED immediately identifies an inferior commodity'],
      ['Cross Elasticity (XED)', 'XED > 0 = Substitutes · XED < 0 = Complements · 0 = Unrelated', 'Agricultural short-run PES is inelastic due to tree-crop gestation lags'],
    ],
  },
  'ec-prod-func': {
    title: 'Short-Run Production Stages (TP, AP, MP) & Long-Run Scale',
    headers: ['Stage / Curve', 'Boundary & Curve Geometry', 'Rational Firm Decision'],
    rows: [
      ['Stage I (Increasing Avg)', 'From L = 0 up to Maximum AP (where MP = AP)', 'Keep hiring! Fixed plant is underutilized while AP is still rising'],
      ['Stage II (Rational Zone)', 'From Maximum AP (MP = AP) to MP = 0 (Maximum TP)', 'ONLY rational economic stage of short-run production!'],
      ['Stage III (Negative MP)', 'Past Maximum TP where MP < 0 due to overcrowding', 'IRRATIONAL even at zero wages because extra workers destroy output'],
      ['Long-Run Returns to Scale', 'All inputs varied simultaneously (no fixed factors)', 'Output > %input = Increasing · = %input = Constant · < %input = Decreasing'],
    ],
  },
  'ec-costs-rev': {
    title: 'Short-Run Cost Geometry, Profit Types & Shut-Down Rule',
    headers: ['Cost / Revenue Concept', 'Exact Formula & Curve Rule', 'Profit / Shut-Down Implication'],
    rows: [
      ['TFC, TVC & TC', 'TC = TFC + TVC · At Q = 0, TC = TFC (NOT zero!)', 'AFC = TFC/Q slopes continuously downward (rectangular hyperbola)'],
      ['Marginal Cost (MC)', 'MC = ΔTC/ΔQ = ΔTVC/ΔQ (independent of TFC)', 'U-shaped MC cuts BOTH AVC and ATC from below at their MINIMUM points'],
      ['Accountant vs Economist', 'Accountant: TR − Explicit · Economist: TR − (Explicit + Implicit)', 'Normal profit = zero economic profit (covers opportunity cost of owner inputs)'],
      ['Profit & Shut-Down', 'Max Profit at MR = MC (MC rising) · AR = P always', 'Short run: keep operating if P ≥ min AVC; shut down immediately if P < min AVC'],
    ],
  },
  'ec-markets': {
    title: 'Market Structures Comparison Matrix',
    headers: ['Structure', 'Firms, Product & Entry', 'Price/MR Relation & Long-Run Profit'],
    rows: [
      ['Perfect Competition', 'Many small firms, homogeneous good, free entry/exit', 'Price-taker: P = AR = MR; Long run P = MC = min ATC (Normal profit ONLY)'],
      ['Pure Monopoly', 'Single seller, no close substitutes, strong entry barriers', 'Price-maker: P = AR > MR; can retain Supernormal profit in long run'],
      ['Monopolistic Competition', 'Many firms, differentiated brands (soap, eateries), free entry', 'Downward D (P > MR); Long-run Normal profit with excess capacity'],
      ['Oligopoly & Price Discrim.', 'Few interdependent giants (telecoms, cement, OPEC cartel)', 'Kinked rigid prices or cartel quotas; Price discrim. charges MORE where PED is inelastic'],
    ],
  },
  'ec-money-inf': {
    title: 'Money Demand, Quantity Theory (MV = PT) & Inflation Remedies',
    headers: ['Topic', 'Core Principle / Formula', 'Winners, Losers & Policy Cure'],
    rows: [
      ['Keynesian Liquidity', 'Transactions & Precautionary (↑ with Y) · Speculative (↑ as r falls)', 'Value of Money = 1/P (inversely proportional to general price level)'],
      ['Fisher’s MV = PT & CPI', 'P = MV/T · Inflation = [(CPI₂ − CPI₁) ÷ CPI₁] × 100%', 'Base-year CPI is ALWAYS 100; divide index gain by CPI₁, never just subtract!'],
      ['Inflation Redistribution', 'Unanticipated rise in P erodes real value of fixed claims', 'WINNERS: Debtors & equity businessmen · LOSERS: Creditors, pensioners & fixed earners'],
      ['Anti-Inflation Mix', 'Demand-Pull vs Cost-Push (Stagflation = inflation + unemployment)', 'Surplus budget (cut G, raise T) + OMO sales + higher MPR/CRR + boost local farm/power supply'],
    ],
  },
  'ec-public-fin': {
    title: 'Tax Systems, Direct vs Indirect Taxes & Fiscal Policy',
    headers: ['Classification', 'Defining Criterion', 'Macroeconomic & Equity Impact'],
    rows: [
      ['Direct vs Indirect Tax', 'Direct (PAYE, CIT): unshiftable · Indirect (VAT, Customs, Excise): on goods', 'Excise = local manufactures; Customs = cross-border; buyer bears tax when PED is inelastic'],
      ['Progressive Tax', 'Tax percentage (Tax ÷ Income) RISES as income rises', 'Reduces income inequality (satisfies Adam Smith’s Canon of Equity)'],
      ['Proportional vs Regressive', 'Proportional = flat % · Regressive = tax % FALLS as income rises', 'Flat Naira poll tax & VAT on essentials are REGRESSIVE against poor households!'],
      ['Fiscal Budgets & Debt', 'Surplus (T > G) cools inflation · Deficit (G > T) fights recession', 'External USD debt drains scarce FX reserves; Internal Naira debt redistributes domestically'],
    ],
  },
  'ec-nat-income': {
    title: 'National Income Conversions & Keynesian Multiplier',
    headers: ['Aggregate / Tool', 'Exact Conversion Formula', 'Critical Accounting Trap'],
    rows: [
      ['GDP to GNP & NNP', 'GNP = GDP + NFIA · NNP = GNP − Depreciation', 'In Nigeria, foreign profit outflows make NFIA negative → GDP > GNP!'],
      ['Market Price → Factor Cost', 'NI (Factor Cost) = NNPmp − Indirect Taxes + Subsidies', 'Subtract indirect taxes (inflate P) and add back subsidies (lower P)'],
      ['Output & Income Methods', 'Sum Value Added ONLY · Exclude Transfer Payments', 'Adding wheat + flour + bread commits DOUBLE COUNTING; exclude pensions/bursaries!'],
      ['Keynesian Multiplier (k)', 'k = 1 ÷ (1 − MPC) = 1 ÷ MPS · ΔY = k × ΔI', 'MPC + MPS = 1; higher MPC yields a LARGER national income multiplier'],
    ],
  },
  'ec-intl-trade': {
    title: 'Comparative Advantage & Commercial Policy Instruments',
    headers: ['Principle / Tool', 'Economic Mechanism', 'Trade & Welfare Effect'],
    rows: [
      ['Comparative Cost (Ricardo)', 'Specialize in the good with LOWER domestic opportunity cost', 'Holds even when one nation has Absolute Advantage in BOTH goods!'],
      ['Import Tariff vs Quota', 'Tariff = customs tax raising import price · Quota = physical volume cap', 'Tariffs raise treasury revenue; Embargo imposes an absolute zero-trade ban'],
      ['Infant-Industry Shield', 'Temporary tariff letting young local plants reach scale economies', 'Danger: permanent protection breeds complacent, high-cost local monopolies'],
      ['Predatory Dumping', 'Exporting below home-market price/cost to crush domestic rivals', 'Countered via targeted WTO-consistent Anti-Dumping Countervailing Duties'],
    ],
  },
  'ec-bop-fx': {
    title: 'Balance of Payments Accounts, Terms of Trade & FX Regimes',
    headers: ['Account / Concept', 'Exact Scope / Formula', 'Exam Distinction'],
    rows: [
      ['Balance of Trade (BOT)', 'Visible Exports minus Visible Imports (physical goods ONLY!)', 'Excludes shipping, banking, insurance & tourism (those are INVISIBLE trade!)'],
      ['Current vs Capital Acct', 'Current = Goods + Services + Transfers · Capital = FDI, loans, portfolio', 'Official Reserves (FX/gold/SDRs) settle overall BOP surpluses or deficits'],
      ['Terms of Trade (TOT)', 'TOT = (Export Price Index Px ÷ Import Price Index Pm) × 100', 'TOT > 100 = favourable; primary exporters often suffer secular TOT decline'],
      ['Devaluation vs Depreciation', 'Devaluation = official cut of FIXED peg · Depreciation = FLOATING market fall', 'Cures BOP deficit ONLY if Marshall–Lerner holds (|PED_x| + |PED_m| > 1)'],
    ],
  },
  'ec-integration': {
    title: 'Four Stages of Economic Integration & Global Institutions',
    headers: ['Stage / Institution', 'Defining Policy Layer / Mandate', 'Key West African / Global Facts'],
    rows: [
      ['1. FTA → 2. Customs Union', 'FTA: zero internal tariffs · Customs Union: + Common External Tariff (CET)', 'Trade Creation raises welfare; Trade Diversion (switching to dearer partner) lowers it'],
      ['3. Common Mkt → 4. Econ Union', 'Common Market: + Free Labour & Capital mobility · Econ Union: + Single Currency', 'ECOWAS (28 May 1975, Lagos): low intra-trade (~11%) due to identical raw exports'],
      ['IMF vs World Bank (1944)', 'IMF: short-term BOP & FX liquidity · World Bank: long-term infrastructure loans', 'Never swap IMF (monetary/BOP) with IBRD/World Bank (long-term projects)!'],
      ['AfDB, WTO & UNCTAD', 'AfDB (1964, Abidjan; includes Nigeria Trust Fund) · WTO (multilateral rules)', 'UNCTAD (1964) champions fairer commodity terms & GSP access for developing nations'],
    ],
  },
  'ec-growth-dev': {
    title: 'Economic Growth vs Economic Development & Planning',
    headers: ['Dimension', 'Economic Growth', 'Economic Development'],
    rows: [
      ['Core Definition', 'Sustained quantitative rise in Real GDP / output per head', 'Growth PLUS structural transformation, equity, health, literacy & institutional quality'],
      ['Primary Indicator', 'Annual % change in Real GDP', 'UNDP Human Development Index (HDI: life expectancy, schooling, PPP GNI/head)'],
      ['Enclave Oil Boom Trap', 'Real GDP rises ("Growth without Development")', 'Fails Dudley Seers’ test if poverty, unemployment & inequality worsen!'],
      ['Plan Failures in W. Africa', 'Wolfgang Stolper: "Planning Without Facts" (weak census/data)', 'Volatile mono-export revenue, corruption, abandoned projects across regime changes'],
    ],
  },
  'ec-ind-local': {
    title: 'Location vs Localization of Industries & Industrial Strategy',
    headers: ['Concept', 'Meaning & Drivers', 'Advantages vs Risks'],
    rows: [
      ['Location of a Plant', 'Siting ONE factory: weight-losing limestone → quarry; bulky drinks → city market', 'Aluminium smelting locates near cheap hydro/gas power ("congealed electricity")'],
      ['Localization of Industries', 'Clustering MANY firms of the SAME industry in one geographical zone', 'External economies & skilled pool vs urban congestion, pollution & localized slump risk'],
      ['Import Substitution (ISI)', 'Tariff-protected local assembly of previously imported consumer goods', 'Failed when CKD plants imported 85%+ inputs in USD without backward integration'],
      ['Export Promotion & SMEs', 'Processing local agro/mineral inputs for global export markets', 'SMEs maximize jobs per Naira of capital; crippled mainly by erratic grid electricity'],
    ],
  },
  'ec-petrol-opec': {
    title: 'Nigerian Oil & Gas Sector, Dutch Disease & OPEC Cartel',
    headers: ['Aspect', 'Key Milestones & Structure', 'Macroeconomic Impact'],
    rows: [
      ['Upstream vs Downstream', 'Oloibiri 1956 (export 1958) · Upstream = drilling · Downstream = refining/retail', 'Domestic refining (e.g., Lekki + state refineries) saves massive FX spent on fuel imports'],
      ['Dutch Disease', '1970s oil boom appreciated FX & pulled resources out of cocoa/groundnuts/palm', 'Created mono-export vulnerability to oil price crashes + Niger Delta gas flaring/spills'],
      ['OPEC (1960 / Nig. 1971)', 'Founded Sept 1960 (Baghdad, HQ Vienna); Nigeria joined July 1971', 'Stabilizes oil price via member OUTPUT QUOTAS (works short-run while PED < 1)'],
      ['Cartel Challenges', 'Member quota cheating, non-OPEC shale rivals & EV/renewable transition', 'Diversification into LNG, petrochemicals, agro-processing & ICT is essential'],
    ],
  },
  'ec-human-cap': {
    title: 'Human Capital, Brain Drain & Structural Poverty Reduction',
    headers: ['Concept', 'Core Distinction', 'Effective Policy Response'],
    rows: [
      ['Human vs Physical Capital', 'Human = skills/health embodied in people · Physical = tangible machines/roads', 'Imported machines fail without trained engineers & healthy workers to run them'],
      ['Brain Drain ("Japa")', 'Push: low real pay, poor lab/hospital gear, insecurity · Pull: high FX pay & labs', 'Competitive specialist pay, modern hospital/R&D gear & diaspora "Brain Gain" bonds'],
      ['Skills Mismatch & Migration', 'Unemployed theoretical graduates alongside technician vacancies; Todaro drift', 'TVET/digital curriculum reform + rural electrification & agro-parks'],
      ['Absolute vs Relative Poverty', 'Absolute = below survival calories/shelter · Relative = inequality (Lorenz/Gini)', 'Gini = 0 (perfect equality) to 1 (total inequality); cure via education & SME power'],
    ],
  },
  'ec-asian-tigers': {
    title: 'East Asian Miracle: The Four Tigers & Japan vs West Africa',
    headers: ['Pillar', 'Four Tigers (S. Korea, Singapore, Taiwan, Hong Kong) & Japan', 'Actionable Lesson for Nigeria'],
    rows: [
      ['Exact Membership', 'Tigers: South Korea, Singapore, Taiwan, Hong Kong · Pioneer: Post-1945 Japan', 'Excludes China, India, Malaysia & Thailand; thrived with ZERO oil/mineral wealth!'],
      ['Industrial Strategy', 'Outward Export-Led Industrialization; cheap state credit tied strictly to export targets', 'Replace uncompetitive CKD assembly with export-disciplined local value addition'],
      ['Savings & Human Capital', '30–40% domestic GDP savings + universal STEM/TVET schooling & R&D', 'Deepen domestic pension/capital savings and technical engineering education'],
      ['Infrastructure & Governance', '24/7 industrial power, world-class container ports & meritocratic institutions', 'Fix grid electricity, port customs speed, and land/agrarian productivity'],
    ],
  },
  'ec-env-sustain': {
    title: 'Distributive Channels, Middlemen & Sustainable Resource Economics',
    headers: ['Domain', 'Mechanism / Market Failure', 'Economic Remedy'],
    rows: [
      ['Wholesaler & Retailer', 'Wholesaler breaks bulk, warehouses & finances; Retailer sells tiny convenient units', 'Bypass middlemen for bespoke turbines/perishables; use Cooperatives against hoarding'],
      ['West African Price Spread', '5–7 petty middlemen + hoarding + 30% spoilage on bad rural roads', 'Rail freight, cold-chain silos, and direct farmer-to-retail cooperative hubs'],
      ['Negative Externalities', 'Pollution/deforestation: Social Cost > Private Cost; Tragedy of the Commons', 'Pigouvian "polluter-pays" taxes, community property quotas & cheap LPG substitutes'],
      ['Sustainable Development', 'Meet present needs without compromising future generations (Brundtland 1987)', 'Hartwick Rule: invest finite oil-depletion rents into SWF, schools & infrastructure'],
    ],
  },
  'ec-global-reform': {
    title: 'CBN Monetary Policy Matrix & Nigerian Economic Reforms',
    headers: ['Instrument / Reform', 'Fight INFLATION (Contractionary)', 'Fight RECESSION / Key Reform Impact'],
    rows: [
      ['Open Market Operations', 'CBN SELLS Treasury Bills (drains cash from banks/public!)', 'CBN BUYS Treasury Bills (injects fresh cash into bank reserves!)'],
      ['MPR & Cash Reserve Ratio', 'RAISE Monetary Policy Rate & RAISE Cash Reserve Ratio', 'LOWER Monetary Policy Rate & LOWER Cash Reserve Ratio (expands 1/r)'],
      ['Moral Suasion & Directives', 'Persuade banks to curb speculative loans; cap luxury credit', 'Steer selective credit toward agriculture, manufacturing & SMEs'],
      ['SAP, Banks & NSIA', 'SAP (1986): SFEM FX, ended Marketing Boards · 2005: ₦25bn bank consolidation', 'High Debt-Service/Revenue (>70%) crowds out roads/schools; NSIA holds 3 SWF rings'],
    ],
  },
};

function shuffleMcq(
  key: string,
  o: string[],
  a: number,
  fb?: string[]
): { o: string[]; a: number; fb?: string[] } {
  const order = perm(key, o.length);
  return {
    o: order.map((idx) => o[idx]),
    a: Math.max(0, order.indexOf(a)),
    fb: fb ? order.map((idx) => fb[idx] ?? '') : undefined,
  };
}

function buildInteractiveForEconTopic(topic: Topic): InteractiveLesson {
  const tableSpec = ECON_TEACH_TABLES[topic.id];

  return {
    title: topic.name,
    goals: topic.goals,
    trap: topic.trap,
    parts: topic.parts.map((part, pIdx) => {
      const beats: Beat[] = [];

      // 1. Core Economic Principle & Mechanisms (IdeaBeat)
      const ideaBeat: IdeaBeat = {
        k: 'idea',
        kl: `Chapter ${pIdx + 1} · Core Principle`,
        title: part.title,
        idea: part.idea,
        g: part.g,
        cap: part.cap,
        rules: part.rules,
        rh: 'Essential Economic Principles & Exam Rules',
      };
      beats.push(ideaBeat);

      // 2. Structured Mastery Comparison Table on Chapter 1
      if (pIdx === 0 && tableSpec) {
        const body: TeachBlock[] = [
          ['h', tableSpec.title],
          ['tb', tableSpec.headers, tableSpec.rows],
          ['wn', `<b>WAEC & JAMB Watchout:</b> ${topic.trap}`],
        ];
        const teachBeat: TeachBeat = {
          k: 'teach',
          kl: 'Mastery Comparison Chart',
          title: tableSpec.title,
          body,
        };
        beats.push(teachBeat);
      }

      // 3. Step-by-Step Worked Economic Analysis / Calculation (FadeBeat)
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
        kl: 'Worked Economic Analysis',
        lv: pIdx === 0 ? 'full' : 'one',
        title: `Worked Example — ${part.title}`,
        q: part.ex.q,
        g: part.ex.g,
        steps: fadeSteps,
      });

      // 4. Spot-the-Exam-Trap Beat (when present)
      if (topic.spot && topic.spot.part === pIdx) {
        const sp = shuffleMcq(
          `spot|${topic.id}|${pIdx}`,
          topic.spot.o,
          topic.spot.a ?? 0,
          topic.spot.fb
        );
        beats.push({
          k: 'spot',
          kl: 'Spot the Exam Trap',
          title: `Audit ${topic.spot.who}’s Working`,
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

      // 5. Quick Mastery Check Beat
      const defaultFb = part.tryit.o.map((_, idx) =>
        idx === part.tryit.a
          ? `Spot on! ${part.tryit.e}`
          : `Review the exact economic principle: ${part.tryit.e}`
      );
      const cp = shuffleMcq(
        `tryit|${topic.id}|${pIdx}`,
        part.tryit.o,
        part.tryit.a,
        part.tryit.fb || defaultFb
      );
      beats.push({
        k: 'check',
        kl: 'Quick Exam Check',
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

export function buildEconCurriculum(): {
  topics: Topic[];
  il: Record<string, InteractiveLesson>;
} {
  const rawTopics: Topic[] = [
    ...ECON_TOPICS_PART1,
    ...ECON_TOPICS_PART2,
    ...ECON_TOPICS_PART3,
  ];

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
    il[t.id] = buildInteractiveForEconTopic(t);
  }

  return { topics, il };
}
