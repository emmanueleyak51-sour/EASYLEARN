import type { ChemClassId, Topic } from '../types';
import type { ChemClassMeta } from './chemNerdc2027';

export const ECON_CLASSES: ChemClassMeta[] = [
  {
    id: 'ss1',
    label: 'SS 1',
    shortLabel: 'SS 1',
    fullTitle: 'SS 1 Economics',
    kicker: 'NERDC Year 1 · Scarcity, Statistics, Production, Population & Finance',
    description:
      'Scarcity & opportunity cost, economic systems, statistical tools, factors & scale of production, business units, population, labour market, agriculture & banking.',
  },
  {
    id: 'ss2',
    label: 'SS 2',
    shortLabel: 'SS 2',
    fullTitle: 'SS 2 Economics',
    kicker: 'NERDC Year 2 · Utility, Price Theory, Elasticity, Costs, Markets & National Income',
    description:
      'Marginal utility, demand & supply laws, price controls, elasticity, TP/AP/MP, short-run costs & revenue, market structures, money, taxation & GDP multiplier.',
  },
  {
    id: 'ss3',
    label: 'SS 3',
    shortLabel: 'SS 3',
    fullTitle: 'SS 3 Economics',
    kicker: 'NERDC Year 3 · International Trade, BOP, Integration, Development & Policy',
    description:
      'Comparative advantage, balance of payments & FX, ECOWAS/OPEC/IMF, growth vs development, industrialization, petroleum, unemployment, Asian Tigers & CBN policy.',
  },
  {
    id: 'all',
    label: 'All Classes',
    shortLabel: 'All',
    fullTitle: 'Complete Economics (SS1–SS3)',
    kicker: 'National Curriculum · 30 Topics',
    description:
      'Complete Nigerian NERDC SS1–SS3 Economics curriculum covering principles, microeconomics, quantitative analysis, macroeconomics, and development policy.',
  },
];

export type EconDomainId = 'principles' | 'micro' | 'quant' | 'macro' | 'dev';

export interface EconNerdcTopicPlacement {
  classId: 'ss1' | 'ss2' | 'ss3';
  term: 1 | 2 | 3;
  termLabel: 'First Term' | 'Second Term' | 'Third Term';
  nerdcTheme:
    | 'Principles & Economic Systems'
    | 'Quantitative & Statistical Tools'
    | 'Microeconomics, Price & Firm Theory'
    | 'Money, Public Finance & National Income'
    | 'International & Development Economics';
  order: number;
  domain: EconDomainId;
  keywords: string[];
}

export const ECON_NERDC_MAP: Record<string, EconNerdcTopicPlacement> = {
  // ─────────────────────────── SS 1 (10 Topics) ───────────────────────────
  'ec-nature': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Principles & Economic Systems',
    order: 1,
    domain: 'principles',
    keywords: ['lionel robbins', 'scarcity', 'scale of preference', 'opportunity cost', 'choice', 'wants', 'production possibility curve', 'ppc', 'positive', 'normative'],
  },
  'ec-systems': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Principles & Economic Systems',
    order: 2,
    domain: 'principles',
    keywords: ['capitalism', 'free market', 'laissez-faire', 'socialism', 'command economy', 'mixed economy', 'price mechanism', 'consumer sovereignty', 'central planning'],
  },
  'ec-stats': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Quantitative & Statistical Tools',
    order: 3,
    domain: 'quant',
    keywords: ['arithmetic mean', 'median', 'mode', 'range', 'mean deviation', 'variance', 'standard deviation', 'pie chart', 'histogram', 'frequency polygon'],
  },
  'ec-production': {
    classId: 'ss1',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Principles & Economic Systems',
    order: 4,
    domain: 'principles',
    keywords: ['primary production', 'secondary production', 'tertiary production', 'land', 'labour', 'capital', 'entrepreneur', 'rent', 'wages', 'interest', 'profit'],
  },
  'ec-division-scale': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Principles & Economic Systems',
    order: 5,
    domain: 'principles',
    keywords: ['adam smith', 'division of labour', 'specialization', 'internal economies of scale', 'external economies', 'diseconomies of scale', 'monotony'],
  },
  'ec-business': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Principles & Economic Systems',
    order: 6,
    domain: 'principles',
    keywords: ['sole proprietorship', 'partnership', 'limited liability', 'plc', 'ltd', 'ordinary shares', 'preference shares', 'debentures', 'cooperatives', 'public corporation', 'privatization', 'commercialization'],
  },
  'ec-population': {
    classId: 'ss1',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'International & Development Economics',
    order: 7,
    domain: 'dev',
    keywords: ['thomas malthus', 'geometric progression', 'arithmetic progression', 'optimum population', 'overpopulation', 'ageing population', 'dependency ratio', 'census', 'population density'],
  },
  'ec-labour': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Principles & Economic Systems',
    order: 8,
    domain: 'micro',
    keywords: ['labour force', 'efficiency of labour', 'geographical mobility', 'occupational mobility', 'trade union', 'collective bargaining', 'picketing', 'minimum wage'],
  },
  'ec-agric-mining': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'International & Development Economics',
    order: 9,
    domain: 'dev',
    keywords: ['peasant farming', 'plantation', 'mechanized agriculture', 'marketing boards', 'land tenure', 'crude oil', 'solid minerals', 'coal', 'columbite', 'limestone'],
  },
  'ec-financial': {
    classId: 'ss1',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Money, Public Finance & National Income',
    order: 10,
    domain: 'macro',
    keywords: ['commercial bank', 'central bank', 'cbn', 'merchant bank', 'development bank', 'money market', 'capital market', 'treasury bills', 'stock exchange', 'credit creation'],
  },

  // ─────────────────────────── SS 2 (10 Topics) ───────────────────────────
  'ec-utility': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Microeconomics, Price & Firm Theory',
    order: 1,
    domain: 'micro',
    keywords: ['total utility', 'marginal utility', 'diminishing marginal utility', 'utility maximization', 'consumer surplus', 'indifference curve', 'budget line', 'marginal rate of substitution'],
  },
  'ec-demand': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Microeconomics, Price & Firm Theory',
    order: 2,
    domain: 'micro',
    keywords: ['law of demand', 'demand schedule', 'change in quantity demanded', 'change in demand', 'giffen goods', 'veblen', 'ostentatious', 'joint demand', 'derived demand', 'composite demand'],
  },
  'ec-supply-eq': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Microeconomics, Price & Firm Theory',
    order: 3,
    domain: 'micro',
    keywords: ['law of supply', 'joint supply', 'competitive supply', 'market equilibrium', 'excess demand', 'excess supply', 'price ceiling', 'maximum price', 'price floor', 'minimum price', 'black market'],
  },
  'ec-elasticity': {
    classId: 'ss2',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'Quantitative & Statistical Tools',
    order: 4,
    domain: 'quant',
    keywords: ['price elasticity of demand', 'income elasticity', 'cross elasticity', 'elasticity of supply', 'total revenue test', 'inferior good', 'normal good', 'substitutes', 'complements'],
  },
  'ec-prod-func': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Microeconomics, Price & Firm Theory',
    order: 5,
    domain: 'quant',
    keywords: ['total product', 'average product', 'marginal product', 'law of diminishing returns', 'variable proportions', 'short run', 'long run', 'returns to scale'],
  },
  'ec-costs-rev': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Microeconomics, Price & Firm Theory',
    order: 6,
    domain: 'quant',
    keywords: ['fixed cost', 'variable cost', 'total cost', 'average cost', 'marginal cost', 'total revenue', 'marginal revenue', 'break-even', 'economists profit', 'accountants profit'],
  },
  'ec-markets': {
    classId: 'ss2',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'Microeconomics, Price & Firm Theory',
    order: 7,
    domain: 'micro',
    keywords: ['perfect competition', 'monopoly', 'monopolistic competition', 'oligopoly', 'duopoly', 'price discrimination', 'cartel', 'price taker', 'shut down point'],
  },
  'ec-money-inf': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Money, Public Finance & National Income',
    order: 8,
    domain: 'macro',
    keywords: ['trade by barter', 'double coincidence of wants', 'transactions motive', 'precautionary motive', 'speculative motive', 'quantity theory of money', 'irving fisher', 'demand-pull inflation', 'cost-push inflation', 'deflation', 'stagflation'],
  },
  'ec-public-fin': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Money, Public Finance & National Income',
    order: 9,
    domain: 'macro',
    keywords: ['canons of taxation', 'direct tax', 'indirect tax', 'progressive tax', 'regressive tax', 'proportional tax', 'tax incidence', 'value added tax', 'balanced budget', 'budget deficit', 'national debt'],
  },
  'ec-nat-income': {
    classId: 'ss2',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Money, Public Finance & National Income',
    order: 10,
    domain: 'macro',
    keywords: ['gdp', 'gnp', 'nnp', 'net factor income from abroad', 'depreciation', 'double counting', 'value added', 'transfer payments', 'mpc', 'mps', 'keynesian multiplier'],
  },

  // ─────────────────────────── SS 3 (10 Topics) ───────────────────────────
  'ec-intl-trade': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'International & Development Economics',
    order: 1,
    domain: 'macro',
    keywords: ['david ricardo', 'comparative cost advantage', 'absolute advantage', 'tariffs', 'import quota', 'embargo', 'infant industry', 'dumping', 'protectionism'],
  },
  'ec-bop-fx': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'International & Development Economics',
    order: 2,
    domain: 'macro',
    keywords: ['balance of trade', 'balance of payments', 'invisible trade', 'current account', 'capital account', 'terms of trade', 'devaluation', 'depreciation', 'exchange rate'],
  },
  'ec-integration': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'International & Development Economics',
    order: 3,
    domain: 'dev',
    keywords: ['free trade area', 'customs union', 'common market', 'economic union', 'ecowas', 'afdb', 'imf', 'ibrd', 'world bank', 'wto', 'unctad'],
  },
  'ec-growth-dev': {
    classId: 'ss3',
    term: 1,
    termLabel: 'First Term',
    nerdcTheme: 'International & Development Economics',
    order: 4,
    domain: 'dev',
    keywords: ['economic growth', 'economic development', 'underdevelopment', 'vicious circle of poverty', 'ragnar nurkse', 'development planning', 'per capita income', 'hdi'],
  },
  'ec-ind-local': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'International & Development Economics',
    order: 5,
    domain: 'dev',
    keywords: ['industrialization', 'localization of industries', 'import substitution', 'export promotion', 'indigenization', 'nationalization', 'small and medium enterprises'],
  },
  'ec-petrol-opec': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'International & Development Economics',
    order: 6,
    domain: 'dev',
    keywords: ['petroleum', 'upstream', 'downstream', 'nnpc', 'opec', 'quota', 'dutch disease', 'mono-economy', 'economic diversification', 'gas flaring'],
  },
  'ec-human-cap': {
    classId: 'ss3',
    term: 2,
    termLabel: 'Second Term',
    nerdcTheme: 'International & Development Economics',
    order: 7,
    domain: 'dev',
    keywords: ['human capital', 'physical capital', 'brain drain', 'frictional unemployment', 'structural unemployment', 'cyclical unemployment', 'disguised unemployment', 'seasonal unemployment'],
  },
  'ec-asian-tigers': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'International & Development Economics',
    order: 8,
    domain: 'dev',
    keywords: ['asian tigers', 'south korea', 'singapore', 'taiwan', 'hong kong', 'japan', 'export-led growth', 'technology transfer', 'high savings rate'],
  },
  'ec-env-sustain': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Principles & Economic Systems',
    order: 9,
    domain: 'micro',
    keywords: ['distributive trade', 'wholesaler', 'retailer', 'middlemen', 'hoarding', 'artificial scarcity', 'externalities', 'social cost', 'sustainable development'],
  },
  'ec-global-reform': {
    classId: 'ss3',
    term: 3,
    termLabel: 'Third Term',
    nerdcTheme: 'Money, Public Finance & National Income',
    order: 10,
    domain: 'macro',
    keywords: ['open market operations', 'omo', 'cash reserve ratio', 'bank rate', 'monetary policy rate', 'moral suasion', 'special directives', 'debt servicing', 'structural adjustment'],
  },
};

export function getEconClassMeta(classId?: ChemClassId): ChemClassMeta {
  return ECON_CLASSES.find((c) => c.id === (classId || 'all')) || ECON_CLASSES[3];
}

export function filterEconTopicsByClass(topics: Topic[], classId?: ChemClassId): Topic[] {
  if (!classId || classId === 'all') return topics;
  return topics
    .filter((t) => ECON_NERDC_MAP[t.id]?.classId === classId)
    .sort((a, b) => (ECON_NERDC_MAP[a.id]?.order ?? 99) - (ECON_NERDC_MAP[b.id]?.order ?? 99));
}
