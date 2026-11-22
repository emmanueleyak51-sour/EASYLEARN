import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Variants } from 'motion/react';
import type { ChemClassId, SubjectId, Topic, UserProgress } from '../../types';
import { isUtmeSingleBlockSubject, isWaecOnlySubject } from '../../utils/examSubjects';
import { SUBJECT_TUTOR_REGISTRY } from '../../utils/tutorRegistry';
import { hasFormulaSheet, SUBJECT_STUDIO_META } from '../../utils/subjectStudioMeta';
import {
  CHEM_CLASSES,
  CHEM_NERDC_MAP,
  filterChemTopicsByClass,
  getChemClassMeta,
} from '../../data/chemNerdc2027';
import {
  MATH_CLASSES,
  MATH_NERDC_MAP,
  filterMathTopicsByClass,
  getMathClassMeta,
  type MathDomainId,
} from '../../data/mathNerdc2027';
import {
  FMATH_CLASSES,
  FMATH_NERDC_MAP,
  filterFMathTopicsByClass,
  getFMathClassMeta,
  type FMathDomainId,
} from '../../data/fmathNerdc2027';
import {
  PHYS_CLASSES,
  PHYS_NERDC_MAP,
  filterPhysTopicsByClass,
  getPhysClassMeta,
  type PhysDomainId,
} from '../../data/physNerdc2027';
import {
  BIO_CLASSES,
  BIO_NERDC_MAP,
  filterBioTopicsByClass,
  getBioClassMeta,
  type BioDomainId,
} from '../../data/bioNerdc2027';
import {
  AGRIC_CLASSES,
  AGRIC_NERDC_MAP,
  filterAgricTopicsByClass,
  getAgricClassMeta,
  type AgricDomainId,
} from '../../data/agricNerdc2027';
import {
  GEOG_CLASSES,
  GEOG_NERDC_MAP,
  filterGeogTopicsByClass,
  getGeogClassMeta,
  type GeogDomainId,
} from '../../data/geogNerdc2027';
import {
  ECON_CLASSES,
  ECON_NERDC_MAP,
  filterEconTopicsByClass,
  getEconClassMeta,
  type EconDomainId,
} from '../../data/econNerdc2027';
import {
  ENG_CLASSES,
  ENG_NERDC_MAP,
  filterEngTopicsByClass,
  getEngClassMeta,
  type EngDomainId,
} from '../../data/engNerdc2027';
import {
  CIVIC_CLASSES,
  CIVIC_NERDC_MAP,
  filterCivicTopicsByClass,
  getCivicClassMeta,
  type CivicDomainId,
} from '../../data/civicNerdc2027';
import {
  DIGITECH_CLASSES,
  DIGITECH_NERDC_MAP,
  filterDigiTechTopicsByClass,
  getDigiTechClassMeta,
  type DigiTechDomainId,
} from '../../data/digitechNerdc2027';
import {
  DATAPROC_CLASSES,
  DATAPROC_NERDC_MAP,
  filterDataProcTopicsByClass,
  getDataProcClassMeta,
  type DataProcDomainId,
} from '../../data/dataprocNerdc2027';
import { getInteractiveLesson, getTopics } from '../../data/curriculum';
import {
  SUBJECT_INFO,
  computeTopicsProgressPct,
  isPro,
  isTopicLocked,
  mpct,
  nextMission,
  tstate,
  tstatus,
} from '../../utils/engine';
import { Icon, MiniRing } from '../Icons';
import {
  FLUID_SCREEN_EXIT,
  FLUID_SCREEN_SPRING,
  LiquidCapsuleBar,
  SlidingTabs,
  SmoothCollapse,
  SmoothProgressBar,
  SmoothViewSwitch,
} from '../ULessonMotion';
import { computeSubjectSwitchDirection } from '../../utils/screenTransitionLogic';

interface TopicsSubjectGlideCustom {
  dir: -1 | 0 | 1;
  reduced: boolean;
}

const TOPICS_SUBJECT_VARIANTS: Variants = {
  initial: (c: TopicsSubjectGlideCustom) =>
    c?.reduced ? { opacity: 0 } : { opacity: 0, x: (c?.dir || 1) * 20, scale: 0.996 },
  animate: (c: TopicsSubjectGlideCustom) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: c?.reduced ? { duration: 0.01 } : FLUID_SCREEN_SPRING,
  }),
  exit: (c: TopicsSubjectGlideCustom) =>
    c?.reduced
      ? { opacity: 0, pointerEvents: 'none', transition: { duration: 0.01 } }
      : {
          opacity: 0,
          x: -(c?.dir || 1) * 16,
          scale: 0.996,
          pointerEvents: 'none',
          transition: FLUID_SCREEN_EXIT,
        },
};

type ChemDomainFilter = 'all' | 'physical' | 'inorganic' | 'organic' | 'applied';
type MathDomainFilter = 'all' | MathDomainId;
type PhysDomainFilter = 'all' | PhysDomainId;
type BioDomainFilter = 'all' | BioDomainId;
type AgricDomainFilter = 'all' | AgricDomainId;
type EconDomainFilter = 'all' | EconDomainId;
type EngDomainFilter = 'all' | EngDomainId;

const CHEM_DOMAIN_TABS: { id: ChemDomainFilter; label: string }[] = [
  { id: 'all', label: 'All Branches' },
  { id: 'physical', label: 'Physical' },
  { id: 'inorganic', label: 'Inorganic' },
  { id: 'organic', label: 'Organic' },
  { id: 'applied', label: 'Industry & Environment' },
];

const MATH_DOMAIN_TABS: { id: MathDomainFilter; label: string }[] = [
  { id: 'all', label: 'All Branches' },
  { id: 'number', label: 'Number' },
  { id: 'algebra', label: 'Algebra' },
  { id: 'geometry', label: 'Geometry' },
  { id: 'trig', label: 'Trigonometry' },
  { id: 'calcstats', label: 'Calculus & Stats' },
];

const ENG_DOMAIN_TABS: { id: EngDomainFilter; label: string }[] = [
  { id: 'all', label: 'All Branches' },
  { id: 'oral', label: 'Oral English' },
  { id: 'lexis', label: 'Lexis & Idioms' },
  { id: 'grammar', label: 'Grammar & Concord' },
  { id: 'comp', label: 'Comprehension' },
  { id: 'writing', label: 'Essay & Letters' },
];

const PHYS_DOMAIN_TABS: { id: PhysDomainFilter; label: string }[] = [
  { id: 'all', label: 'All Branches' },
  { id: 'mechanics', label: 'Mechanics' },
  { id: 'thermal', label: 'Heat & Gas Laws' },
  { id: 'waves', label: 'Waves & Optics' },
  { id: 'electricity', label: 'Electricity' },
  { id: 'modern', label: 'Modern Physics' },
];

const BIO_DOMAIN_TABS: { id: BioDomainFilter; label: string }[] = [
  { id: 'all', label: 'All Branches' },
  { id: 'cells', label: 'Cells & Life' },
  { id: 'physiology', label: 'Physiology' },
  { id: 'plants', label: 'Plant Biology' },
  { id: 'ecology', label: 'Ecology & Health' },
  { id: 'genetics', label: 'Genetics & Evolution' },
];

const AGRIC_DOMAIN_TABS: { id: AgricDomainFilter; label: string }[] = [
  { id: 'all', label: 'All Branches' },
  { id: 'ecology', label: 'Ecology & Farm Power' },
  { id: 'soil', label: 'Soil & Engineering' },
  { id: 'crops', label: 'Crop Science' },
  { id: 'livestock', label: 'Animal & Fisheries' },
  { id: 'agribiz', label: 'Breeding & Agribusiness' },
];

const ECON_DOMAIN_TABS: { id: EconDomainFilter; label: string }[] = [
  { id: 'all', label: 'All Branches' },
  { id: 'principles', label: 'Principles & Systems' },
  { id: 'micro', label: 'Micro & Markets' },
  { id: 'quant', label: 'Quantitative Tools' },
  { id: 'macro', label: 'Macro & Money' },
  { id: 'dev', label: 'Trade & Development' },
];

type CivicDomainFilter = 'all' | CivicDomainId;
type FMathDomainFilter = 'all' | FMathDomainId;
type GeogDomainFilter = 'all' | GeogDomainId;

const FMATH_DOMAIN_TABS: { id: FMathDomainFilter; label: string }[] = [
  { id: 'all', label: 'All Branches' },
  { id: 'pure', label: 'Pure Maths' },
  { id: 'calculus', label: 'Calculus' },
  { id: 'vectors', label: 'Vectors & Matrices' },
  { id: 'mechanics', label: 'Mechanics' },
  { id: 'stats', label: 'Stats & Prob.' },
];

const GEOG_DOMAIN_TABS: { id: GeogDomainFilter; label: string }[] = [
  { id: 'all', label: 'All Branches' },
  { id: 'mapwork', label: 'Map Reading & GIS' },
  { id: 'physical', label: 'Physical Geog' },
  { id: 'climate', label: 'Climatology' },
  { id: 'human', label: 'Human & Econ' },
  { id: 'regional', label: 'Nigeria & Africa' },
];

const CIVIC_DOMAIN_TABS: { id: CivicDomainFilter; label: string }[] = [
  { id: 'all', label: 'All Branches' },
  { id: 'values', label: 'Values & Ethics' },
  { id: 'citizenship', label: 'Citizenship' },
  { id: 'democracy', label: 'Democracy & Polls' },
  { id: 'rights', label: 'Human Rights' },
  { id: 'governance', label: 'Law & Governance' },
];

type DigiTechDomainFilter = 'all' | DigiTechDomainId;
type DataProcDomainFilter = 'all' | DataProcDomainId;

const DIGITECH_DOMAIN_TABS: { id: DigiTechDomainFilter; label: string }[] = [
  { id: 'all', label: 'All Branches' },
  { id: 'systems', label: 'Architecture & Hardware' },
  { id: 'representation', label: 'Binary & Logic Gates' },
  { id: 'software', label: 'Software & Algorithms' },
  { id: 'networks', label: 'Networks & Cloud' },
  { id: 'cyber', label: 'Cybersecurity & AI' },
];

const DATAPROC_DOMAIN_TABS: { id: DataProcDomainFilter; label: string }[] = [
  { id: 'all', label: 'All Branches' },
  { id: 'fundamentals', label: 'Data & Info Systems' },
  { id: 'files', label: 'File Organization' },
  { id: 'database', label: 'DBMS & 1NF–3NF' },
  { id: 'packages', label: 'Excel, SQL & Packages' },
  { id: 'maintenance', label: 'Integrity & Security' },
];

export function TopicsMapScreen({
  progress,
  onSelectSubject,
  onSelectClass,
  onManageSubjects,
  onOpenTopic,
  onOpenLab,
  onOpenFormulas,
  onOpenStudio,
}: {
  progress: UserProgress;
  onSelectSubject: (s: SubjectId) => void;
  onSelectClass?: (cls: ChemClassId) => void;
  onManageSubjects: () => void;
  onOpenTopic: (tid: string) => void;
  onOpenLab: () => void;
  onOpenFormulas?: () => void;
  onOpenStudio?: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [expandAll, setExpandAll] = useState(false);

  useEffect(() => {
    setDomainFilter('all');
    setExpandAll(false);
  }, [progress.subj]);

  const prefersReduced = useReducedMotion();
  const isSingleBlock = isUtmeSingleBlockSubject(progress.subj);
  const isFMath = progress.subj === 'fmaths';
  const isChem = progress.subj === 'chem';
  const isPhys = progress.subj === 'phys';
  const isBio = progress.subj === 'bio';
  const isAgric = progress.subj === 'agric';
  const isGeog = progress.subj === 'geog';
  const isEcon = progress.subj === 'econ';
  const isEng = progress.subj === 'eng';
  const isCivic = progress.subj === 'civic';
  const isDigiTech = progress.subj === 'digitech';
  const isDataProc = progress.subj === 'dataproc';
  const activeClass: ChemClassId = isSingleBlock
    ? 'all'
    : isFMath
      ? progress.fmathClass || 'all'
      : isChem
        ? progress.chemClass || 'all'
        : isPhys
          ? progress.physClass || 'all'
          : isBio
            ? progress.bioClass || 'all'
            : isAgric
              ? progress.agricClass || 'all'
              : isGeog
                ? progress.geogClass || 'all'
                : isEcon
                  ? progress.econClass || 'all'
                  : isEng
                    ? progress.engClass || 'all'
                    : isCivic
                      ? progress.civicClass || 'all'
                      : isDigiTech
                        ? progress.digitechClass || 'all'
                        : isDataProc
                          ? progress.dataprocClass || 'all'
                          : progress.mathClass || 'all';
  const classList = isFMath
    ? FMATH_CLASSES
    : isChem
      ? CHEM_CLASSES
      : isPhys
        ? PHYS_CLASSES
        : isBio
          ? BIO_CLASSES
          : isAgric
            ? AGRIC_CLASSES
            : isGeog
              ? GEOG_CLASSES
              : isEcon
                ? ECON_CLASSES
                : isEng
                  ? ENG_CLASSES
                  : isCivic
                    ? CIVIC_CLASSES
                    : isDigiTech
                      ? DIGITECH_CLASSES
                      : isDataProc
                        ? DATAPROC_CLASSES
                        : MATH_CLASSES;
  const classMeta = isFMath
    ? getFMathClassMeta(activeClass)
    : isChem
      ? getChemClassMeta(activeClass)
      : isPhys
        ? getPhysClassMeta(activeClass)
        : isBio
          ? getBioClassMeta(activeClass)
          : isAgric
            ? getAgricClassMeta(activeClass)
            : isGeog
              ? getGeogClassMeta(activeClass)
              : isEcon
                ? getEconClassMeta(activeClass)
                : isEng
                  ? getEngClassMeta(activeClass)
                  : isCivic
                    ? getCivicClassMeta(activeClass)
                    : isDigiTech
                      ? getDigiTechClassMeta(activeClass)
                      : isDataProc
                        ? getDataProcClassMeta(activeClass)
                        : getMathClassMeta(activeClass);

  const allSubjectTopics = getTopics(progress.subj);

  const singleBlockDomainTabs = useMemo(() => {
    if (!isSingleBlock) return [];
    const seen = new Set<string>();
    const tabs: { id: string; label: string }[] = [{ id: 'all', label: 'All sections' }];
    for (const t of allSubjectTopics) {
      if (t.sec && !seen.has(t.sec)) {
        seen.add(t.sec);
        tabs.push({ id: t.sec, label: t.sec });
      }
    }
    return tabs.length > 2 ? tabs : [];
  }, [isSingleBlock, allSubjectTopics]);

  const domainTabs = isSingleBlock
    ? singleBlockDomainTabs
    : isFMath
      ? FMATH_DOMAIN_TABS
      : isChem
        ? CHEM_DOMAIN_TABS
        : isPhys
          ? PHYS_DOMAIN_TABS
          : isBio
            ? BIO_DOMAIN_TABS
            : isAgric
              ? AGRIC_DOMAIN_TABS
              : isGeog
                ? GEOG_DOMAIN_TABS
                : isEcon
                  ? ECON_DOMAIN_TABS
                  : isEng
                    ? ENG_DOMAIN_TABS
                    : isCivic
                      ? CIVIC_DOMAIN_TABS
                      : isDigiTech
                        ? DIGITECH_DOMAIN_TABS
                        : isDataProc
                          ? DATAPROC_DOMAIN_TABS
                          : MATH_DOMAIN_TABS;

  const getNerdcMeta = (tid: string) =>
    isSingleBlock
      ? undefined
      : isFMath
        ? FMATH_NERDC_MAP[tid]
        : isChem
          ? CHEM_NERDC_MAP[tid]
          : isPhys
            ? PHYS_NERDC_MAP[tid]
            : isBio
              ? BIO_NERDC_MAP[tid]
              : isAgric
                ? AGRIC_NERDC_MAP[tid]
                : isGeog
                  ? GEOG_NERDC_MAP[tid]
                  : isEcon
                    ? ECON_NERDC_MAP[tid]
                    : isEng
                      ? ENG_NERDC_MAP[tid]
                      : isCivic
                        ? CIVIC_NERDC_MAP[tid]
                        : isDigiTech
                          ? DIGITECH_NERDC_MAP[tid]
                          : isDataProc
                            ? DATAPROC_NERDC_MAP[tid]
                            : MATH_NERDC_MAP[tid];

  const classScopedTopics = useMemo(
    () =>
      isSingleBlock
        ? allSubjectTopics
        : isFMath
          ? filterFMathTopicsByClass(allSubjectTopics, activeClass)
          : isChem
            ? filterChemTopicsByClass(allSubjectTopics, activeClass)
            : isPhys
              ? filterPhysTopicsByClass(allSubjectTopics, activeClass)
              : isBio
                ? filterBioTopicsByClass(allSubjectTopics, activeClass)
                : isAgric
                  ? filterAgricTopicsByClass(allSubjectTopics, activeClass)
                  : isGeog
                    ? filterGeogTopicsByClass(allSubjectTopics, activeClass)
                    : isEcon
                      ? filterEconTopicsByClass(allSubjectTopics, activeClass)
                      : isEng
                        ? filterEngTopicsByClass(allSubjectTopics, activeClass)
                        : isCivic
                          ? filterCivicTopicsByClass(allSubjectTopics, activeClass)
                          : isDigiTech
                            ? filterDigiTechTopicsByClass(allSubjectTopics, activeClass)
                            : isDataProc
                              ? filterDataProcTopicsByClass(allSubjectTopics, activeClass)
                              : filterMathTopicsByClass(allSubjectTopics, activeClass),
    [
      allSubjectTopics,
      isSingleBlock,
      isFMath,
      isChem,
      isPhys,
      isBio,
      isAgric,
      isGeog,
      isEcon,
      isEng,
      isCivic,
      isDigiTech,
      isDataProc,
      activeClass,
    ]
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matchesTopicSearch = (t: Topic, q: string) => {
    if (!q) return true;
    const meta = getNerdcMeta(t.id);
    const hay = [
      t.name,
      t.sec,
      t.boss,
      ...t.goals,
      ...(meta?.keywords || []),
      meta?.nerdcTheme || '',
      meta?.termLabel || '',
    ]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  };

  const filteredTopics = useMemo(() => {
    return classScopedTopics.filter((t) => {
      if (activeClass === 'all' && domainFilter !== 'all') {
        if (isSingleBlock) {
          if (t.sec !== domainFilter) return false;
        } else {
          const meta = getNerdcMeta(t.id);
          if (meta?.domain !== domainFilter) return false;
        }
      }
      return matchesTopicSearch(t, normalizedQuery);
    });
  }, [
    classScopedTopics,
    isSingleBlock,
    isFMath,
    isChem,
    isPhys,
    isBio,
    isAgric,
    isGeog,
    isEcon,
    isEng,
    isCivic,
    isDigiTech,
    isDataProc,
    activeClass,
    domainFilter,
    normalizedQuery,
  ]);

  const allClassesSearchCount = useMemo(() => {
    if (!normalizedQuery || filteredTopics.length > 0) return 0;
    return allSubjectTopics.filter((t) => matchesTopicSearch(t, normalizedQuery)).length;
  }, [
    normalizedQuery,
    filteredTopics.length,
    allSubjectTopics,
    isFMath,
    isChem,
    isPhys,
    isBio,
    isAgric,
    isGeog,
    isEcon,
    isEng,
    isCivic,
    isDigiTech,
    isDataProc,
  ]);

  const mission = nextMission(progress, classScopedTopics, allSubjectTopics);
  const recommended = mission?.t.id;
  const studentIsPro = isPro(progress);

  const sections: { name: string; sub?: string; items: Topic[] }[] = useMemo(() => {
    if (activeClass !== 'all') {
      const terms: { term: 1 | 2 | 3; name: string; sub: string }[] = isFMath
        ? [
            { term: 1, name: 'First Term', sub: `${classMeta.label} · Pure Algebra, Functions, Polynomials & Matrices` },
            { term: 2, name: 'Second Term', sub: `${classMeta.label} · Calculus, Vectors, Conics & Differential Equations` },
            { term: 3, name: 'Third Term', sub: `${classMeta.label} · Mechanics, Dynamics, Probability & Distributions` },
          ]
        : isChem
          ? [
              { term: 1, name: 'First Term', sub: `${classMeta.label} · Foundation & Core Principles` },
              { term: 2, name: 'Second Term', sub: `${classMeta.label} · Quantitative & Chemical Systems` },
              { term: 3, name: 'Third Term', sub: `${classMeta.label} · Applied, Environmental & Synthesis` },
            ]
          : isPhys
            ? [
                { term: 1, name: 'First Term', sub: `${classMeta.label} · Mechanics, Vectors, Fields & Motion` },
                { term: 2, name: 'Second Term', sub: `${classMeta.label} · Energy, Thermal Physics, Waves & Circuits` },
                { term: 3, name: 'Third Term', sub: `${classMeta.label} · Optics, Electromagnetism & Modern Physics` },
              ]
            : isBio
              ? [
                  { term: 1, name: 'First Term', sub: `${classMeta.label} · Cells, Classification, Osmosis & Nutrition` },
                  { term: 2, name: 'Second Term', sub: `${classMeta.label} · Transport, Respiration, Excretion & Coordination` },
                  { term: 3, name: 'Third Term', sub: `${classMeta.label} · Ecology, Reproduction, Genetics & Evolution` },
                ]
              : isAgric
                ? [
                    { term: 1, name: 'First Term', sub: `${classMeta.label} · Agro-Ecology, Soil Science & Plant Nutrients` },
                    { term: 2, name: 'Second Term', sub: `${classMeta.label} · Farm Engineering, Crop Husbandry & Protection` },
                    { term: 3, name: 'Third Term', sub: `${classMeta.label} · Livestock, Aquaculture, Breeding & Agribusiness` },
                  ]
                : isGeog
                  ? [
                      { term: 1, name: 'First Term', sub: `${classMeta.label} · Earth System, Rocks, Landforms & Map Reading` },
                      { term: 2, name: 'Second Term', sub: `${classMeta.label} · Climatology, Vegetation, Denudation & GIS` },
                      { term: 3, name: 'Third Term', sub: `${classMeta.label} · Human Settlement, Nigeria, ECOWAS & Africa` },
                    ]
                  : isEcon
                    ? [
                        { term: 1, name: 'First Term', sub: `${classMeta.label} · Scarcity, Demand, Elasticity & Trade Foundations` },
                        { term: 2, name: 'Second Term', sub: `${classMeta.label} · Production, Costs, Markets & Growth Policy` },
                        { term: 3, name: 'Third Term', sub: `${classMeta.label} · Money, Public Finance, GDP & Global Economics` },
                      ]
                    : isEng
                      ? [
                          { term: 1, name: 'First Term', sub: `${classMeta.label} · Oral English Sounds, Word Classes & Concord` },
                          { term: 2, name: 'Second Term', sub: `${classMeta.label} · Clauses, Tenses, Registers & Lexis` },
                          { term: 3, name: 'Third Term', sub: `${classMeta.label} · Comprehension, Summary & Continuous Writing` },
                        ]
                      : isCivic
                        ? [
                            { term: 1, name: 'First Term', sub: `${classMeta.label} · National Values, Citizenship & Ethics` },
                            { term: 2, name: 'Second Term', sub: `${classMeta.label} · Constitutional Democracy, Federalism & Rights` },
                            { term: 3, name: 'Third Term', sub: `${classMeta.label} · Public Service, Rule of Law & Global Citizenship` },
                          ]
                        : isDigiTech
                          ? [
                              { term: 1, name: 'First Term', sub: `${classMeta.label} · Hardware Architecture, CPU Cycle & Binary Logic` },
                              { term: 2, name: 'Second Term', sub: `${classMeta.label} · Operating Systems, Algorithms & Programming` },
                              { term: 3, name: 'Third Term', sub: `${classMeta.label} · Computer Networks, Cloud, Cybersecurity & AI` },
                            ]
                          : isDataProc
                            ? [
                                { term: 1, name: 'First Term', sub: `${classMeta.label} · Data Cycles, File Organization & Information Systems` },
                                { term: 2, name: 'Second Term', sub: `${classMeta.label} · Relational DBMS, ER Modelling & 1NF–3NF` },
                                { term: 3, name: 'Third Term', sub: `${classMeta.label} · Spreadsheets, SQL Queries, Backup & NDPA Security` },
                              ]
                            : [
                                { term: 1, name: 'First Term', sub: `${classMeta.label} · Number, Surds & Core Foundations` },
                                { term: 2, name: 'Second Term', sub: `${classMeta.label} · Algebraic Processes, Equations & Proofs` },
                                { term: 3, name: 'Third Term', sub: `${classMeta.label} · Geometry, Trigonometry, Calculus & Data` },
                              ];
      return terms
        .map((tm) => ({
          name: tm.name,
          sub: tm.sub,
          items: filteredTopics.filter((t) => {
            const meta = getNerdcMeta(t.id);
            return meta?.term === tm.term;
          }),
        }))
        .filter((s) => s.items.length > 0);
    }

    const out: { name: string; items: Topic[] }[] = [];
    for (const t of filteredTopics) {
      let sec = out.find((s) => s.name === t.sec);
      if (!sec) {
        sec = { name: t.sec, items: [] };
        out.push(sec);
      }
      sec.items.push(t);
    }
    return out;
  }, [
    isFMath,
    isChem,
    isPhys,
    isBio,
    isAgric,
    isGeog,
    isEcon,
    isEng,
    isCivic,
    isDigiTech,
    isDataProc,
    activeClass,
    classMeta.label,
    filteredTopics,
  ]);

  // Default to expanding ONLY the single active unit containing `recommended` (or the first unit),
  // so students see 1 friendly bite-sized unit instead of an overwhelming textbook wall!
  useEffect(() => {
    if (sections.length === 0) return;
    const activeSec =
      sections.find((s) => s.items.some((t) => t.id === recommended)) ||
      sections.find((s) => s.items.some((t) => !tstate(progress, t.id).boss)) ||
      sections[0];

    const initial: Record<string, boolean> = {};
    sections.forEach((s) => {
      initial[s.name] = s.name === activeSec.name;
    });
    setOpenSections(initial);
    setExpandAll(false);
  }, [progress.subj, activeClass, domainFilter, sections.length]);

  const toggleSection = (secName: string) => {
    if (expandAll) {
      setExpandAll(false);
      setOpenSections((prev) => ({ ...prev, [secName]: !prev[secName] }));
    } else {
      setOpenSections((prev) => (prev[secName] ? { [secName]: false } : { [secName]: true }));
    }
  };

  const handleToggleExpandAll = () => {
    const next = !expandAll;
    setExpandAll(next);
    const updated: Record<string, boolean> = {};
    sections.forEach((s, idx) => {
      updated[s.name] = next ? true : idx === 0;
    });
    if (!next && recommended) {
      const recSec = sections.find((s) => s.items.some((t) => t.id === recommended));
      if (recSec) {
        sections.forEach((s) => {
          updated[s.name] = s.name === recSec.name;
        });
      }
    }
    setOpenSections(updated);
  };

  const overallPct = computeTopicsProgressPct(progress, classScopedTopics);

  const subjTransRef = useRef<{ subj: SubjectId; dir: -1 | 0 | 1 }>({
    subj: progress.subj,
    dir: 0,
  });
  if (subjTransRef.current.subj !== progress.subj) {
    subjTransRef.current = {
      subj: progress.subj,
      dir: computeSubjectSwitchDirection(subjTransRef.current.subj, progress.subj),
    };
  }
  const subjGlideCustom: TopicsSubjectGlideCustom = {
    dir: subjTransRef.current.dir,
    reduced: Boolean(prefersReduced),
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Calm, Reassuring Page Header + Subject Tool Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
        <div>
          <span className="eyebrow text-[var(--gold)]">Topics</span>
          <h1 className="h28 text-[var(--ink)]">{SUBJECT_INFO[progress.subj].name}</h1>
          <p className="text-[13px] text-[var(--dim)] mt-0.5 tabular-nums">
            One short topic at a time · {overallPct}% progress
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {SUBJECT_STUDIO_META[progress.subj] && onOpenStudio && (
            <button
              type="button"
              onClick={onOpenStudio}
              className="min-h-[38px] px-3.5 rounded-xl bg-[var(--acc-soft)] border-2 border-[var(--acc-line)] hover:bg-[var(--card)] text-[12.5px] font-bold text-[var(--gold)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
            >
              <Icon name={SUBJECT_STUDIO_META[progress.subj]!.icon} size={14} />
              <span>{SUBJECT_STUDIO_META[progress.subj]!.title}</span>
              <Icon name="go" size={13} />
            </button>
          )}
          {(progress.subj === 'maths' || isChem || isPhys || isBio || isAgric) && (
            <button
              type="button"
              onClick={onOpenLab}
              className="min-h-[38px] px-3.5 rounded-xl bg-[var(--acc-soft)] border-2 border-[var(--acc-line)] hover:bg-[var(--card)] text-[12.5px] font-bold text-[var(--gold)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
            >
              <Icon
                name={
                  isChem
                    ? 'flask'
                    : isAgric
                      ? 'leaf'
                      : isBio
                        ? 'dna'
                        : isPhys
                          ? 'atom'
                          : 'pen'
                }
                size={14}
              />
              <span>Labs</span>
              <Icon name="go" size={13} />
            </button>
          )}
          {onOpenFormulas && hasFormulaSheet(progress.subj) && (
              <button
                type="button"
                onClick={onOpenFormulas}
                className="min-h-[38px] px-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12.5px] font-bold text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
              >
                <Icon name={isEng ? 'book' : 'sigma'} size={14} />
                <span>{isEng ? 'Grammar rules' : 'Formulas'}</span>
              </button>
            )}
          <button
            type="button"
            onClick={onManageSubjects}
            className="min-h-[38px] px-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12.5px] font-bold text-[var(--dim)] hover:text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
          >
            <Icon name={SUBJECT_INFO[progress.subj].icon} size={14} />
            <span>Switch subject</span>
            <Icon name="go" size={14} />
          </button>
        </div>
      </div>

      <div className="relative overflow-x-clip">
        <AnimatePresence initial={false} mode="popLayout" custom={subjGlideCustom}>
          <motion.div
            key={progress.subj}
            custom={subjGlideCustom}
            variants={TOPICS_SUBJECT_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-3.5 will-change-transform"
          >
            <LayoutGroup id={`topics-subj-${progress.subj}`}>
      {/* Spotlight: Your Next 8-Minute Step (Eliminates Decision Paralysis) */}
      {mission && !normalizedQuery && (
        <section className="rtc-card rounded-2xl border-[var(--acc-line)] bg-gradient-to-r from-[var(--acc-soft)]/35 via-[var(--card)] to-[var(--card)] px-3.5 py-3 sm:px-4 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <MiniRing value={mpct(progress, mission.t.id)} size={40} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-[var(--gold)]">
                <span>Next topic</span>
                <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                <span className="text-[var(--green)] font-semibold">
                  Take it one step at a time
                </span>
              </div>
              <h2 className="h18 text-[var(--ink)] mt-0.5 truncate">{mission.t.name}</h2>
              <p className="text-[12.5px] text-[var(--dim)] truncate">
                {mission.t.sec} · {mission.t.parts.length} short chapters + 6 practice questions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenTopic(mission.t.id)}
            className="btn-tactile indigo min-h-[40px] px-4 text-[13.5px] whitespace-nowrap shrink-0"
          >
            <span>Continue this topic</span>
            <Icon name="go" size={15} className="ul-arrow" />
          </button>
        </section>
      )}

      {/* Class Switcher (only for class-tabbed subjects) + Live Search + Section Filter */}
      <section className="rtc-card rounded-2xl p-3 sm:p-3.5 flex flex-col gap-2.5">
        <div className="flex flex-col min-[880px]:flex-row min-[880px]:items-center justify-between gap-3">
          {isSingleBlock ? (
            <div className="flex flex-col gap-0.5">
              <div className="font-[var(--display)] font-bold text-[15px] text-[var(--ink)]">
                {isWaecOnlySubject(progress.subj)
                  ? 'Full WAEC/NECO syllabus'
                  : 'Full JAMB and WAEC syllabus'}
              </div>
              <div className="text-[12.5px] text-[var(--dim)]">
                {allSubjectTopics.length} topics arranged in one clear syllabus block
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <SlidingTabs
                items={classList.map((cls) => ({
                  id: cls.id,
                  label: cls.shortLabel,
                }))}
                value={activeClass}
                onChange={(nextCls) => {
                  onSelectClass?.(nextCls);
                  if (nextCls !== 'all') setDomainFilter('all');
                }}
                ariaLabel={`Select ${SUBJECT_INFO[progress.subj].name} class`}
                variant="indigo"
                className="min-w-[340px] sm:min-w-[390px]"
              />
            </div>
          )}

          {/* Search Input */}
          <div className="relative flex-1 min-[880px]:max-w-[380px]">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={`Search ${SUBJECT_INFO[progress.subj].name} topics`}
              placeholder={SUBJECT_TUTOR_REGISTRY[progress.subj]?.searchPlaceholder || 'Search any topic...'}
              className="w-full min-h-[40px] pl-3.5 pr-9 rounded-xl bg-[var(--bg)] border border-[var(--line)] focus:border-[var(--gold)] focus:bg-[var(--card)] text-[14px] font-medium text-[var(--ink)] outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md text-[var(--dim)] hover:text-[var(--ink)] flex items-center justify-center cursor-pointer"
              >
                <Icon name="x" size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Branch / Section Filter + Focus/Expand Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-[var(--line)]/70">
          {activeClass === 'all' && domainTabs.length > 0 ? (
            <LiquidCapsuleBar
              roleType="group"
              size="sm"
              ariaLabel={`Filter by ${SUBJECT_INFO[progress.subj].name} branch`}
              items={domainTabs}
              value={domainFilter}
              onChange={setDomainFilter}
              className="overflow-x-auto max-w-full"
            />
          ) : (
            <span className="text-[12.5px] font-semibold text-[var(--dim)]">
              Showing your current term open first so you can focus calmly.
            </span>
          )}

          {sections.length > 1 && !normalizedQuery && (
            <button
              type="button"
              onClick={handleToggleExpandAll}
              className="min-h-[32px] px-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12px] font-bold text-[var(--dim)] hover:text-[var(--ink)] transition cursor-pointer whitespace-nowrap shrink-0"
            >
              {expandAll ? 'Focus on active unit' : `Expand all ${sections.length} units`}
            </button>
          )}
        </div>
      </section>

      {/* Syllabus Units — cleanly separated from subject tools */}

      {/* Empty Search State */}
      {sections.length === 0 && (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--line)] p-6 text-center flex flex-col items-center gap-3">
          <p className="text-[15px] font-semibold text-[var(--ink)]">
            No topics in <strong>{classMeta.label}</strong> matched “{searchQuery}”.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {allClassesSearchCount > 0 && onSelectClass && (
              <button
                type="button"
                onClick={() => onSelectClass('all')}
                className="btn-tactile indigo min-h-[38px] text-[13.5px] px-4 whitespace-nowrap"
              >
                <span>Show {allClassesSearchCount} matching in All Classes</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setDomainFilter('all');
              }}
              className="btn-tactile paper min-h-[38px] text-[13.5px] px-4 whitespace-nowrap"
            >
              <span>Reset filters</span>
            </button>
          </div>
        </div>
      )}

      {/* Calm Progressive-Disclosure Accordion Units */}
      <SmoothViewSwitch
        viewKey={`${activeClass}-${domainFilter}`}
        className="flex flex-col gap-2.5"
      >
        {sections.map((sec) => {
          const secPct = computeTopicsProgressPct(progress, sec.items);
          const hasRecommended = sec.items.some((t) => t.id === recommended);
          const isOpen = !!normalizedQuery || !!openSections[sec.name];

          return (
            <section
              key={sec.name}
              className={`rounded-2xl border transition-colors ${
                isOpen
                  ? 'rtc-card p-3 sm:p-4'
                  : 'bg-[var(--card)]/85 border-[var(--line)] hover:border-[var(--acc-line)] px-3.5 py-2.5'
              } flex flex-col`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleSection(sec.name)}
                className="w-full text-left flex items-center justify-between gap-2.5 cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="h18 text-[var(--ink)]">{sec.name}</h2>
                    {hasRecommended && !isOpen && (
                      <span className="text-[11px] font-extrabold text-[var(--gold)]">
                        · Active unit
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[var(--dim)] mt-0.5 leading-snug">
                    {sec.sub ? `${sec.sub} · ` : ''}
                    {sec.items.length} {sec.items.length === 1 ? 'short topic' : 'bite-sized topics'} (~8 min each)
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="hidden sm:block w-20">
                    <SmoothProgressBar
                      value={secPct}
                      max={100}
                      tone="emerald"
                      heightClass="h-2.5"
                    />
                  </div>
                  <span
                    className={`text-[12.5px] font-extrabold tabular-nums whitespace-nowrap shrink-0 ${
                      secPct >= 70
                        ? 'text-[var(--green)]'
                        : secPct > 0
                          ? 'text-[var(--gold)]'
                          : 'text-[var(--dim)]'
                    }`}
                  >
                    {secPct}%
                  </span>
                  <span className="w-6 h-6 rounded-md bg-[var(--bg)] border border-[var(--line)] text-[var(--dim)] flex items-center justify-center shrink-0">
                    <Icon
                      name="go"
                      size={13}
                      className={`chevron-turn ${isOpen ? 'is-open' : ''}`}
                    />
                  </span>
                </div>
              </button>

              <SmoothCollapse open={isOpen}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2.5 mt-2.5 border-t border-[var(--line)]">
                  {sec.items.map((t) => {
                    const locked = isTopicLocked(progress, t.id, allSubjectTopics);
                    const pctVal = mpct(progress, t.id);
                    const st = tstate(progress, t.id);
                    const status = tstatus(progress, t.id);
                    const isNext = recommended === t.id;
                    const meta = getNerdcMeta(t.id);
                    const il = getInteractiveLesson(progress.subj, t.id);
                    const hasSim = !!il?.parts.some((p) => p.beats.some((b) => b.k === 'explore'));

                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => onOpenTopic(t.id)}
                        className={`study-card text-left rounded-xl border px-3 py-2.5 sm:px-3.5 sm:py-3 flex items-center gap-2.5 sm:gap-3 cursor-pointer ${
                          st.boss
                            ? 'bg-[var(--ok-soft)]/55 border-[var(--ok-line)]'
                            : locked
                              ? 'bg-[var(--bg)]/45 border-[var(--line)] hover:border-[var(--acc-line)]'
                              : isNext
                                ? 'bg-[var(--acc-soft)]/40 border-[var(--acc-line)] hover:border-[var(--gold)]'
                                : 'bg-[var(--bg)]/55 border-[var(--line)] hover:bg-[var(--card)] hover:border-[var(--acc-line)]'
                        }`}
                      >
                        <MiniRing value={pctVal} size={38} />
                        <div className="min-w-0 flex-1">
                          {meta && activeClass === 'all' && (
                            <div className="flex items-center gap-1 text-[10.5px] font-semibold text-[var(--dim)] mb-0.5 truncate">
                              <span className="font-bold text-[var(--ink)]">
                                {meta.classId.toUpperCase().replace('SS', 'SS ')}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{meta.termLabel}</span>
                            </div>
                          )}
                          <div className="font-[var(--display)] font-bold text-[14px] sm:text-[14.5px] text-[var(--ink)] leading-snug">
                            {t.name}
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap mt-0.5 text-[11.5px] font-semibold">
                            <span
                              className={
                                st.boss
                                  ? 'text-[var(--green)] font-bold'
                                  : locked
                                    ? 'text-[var(--dim)] font-bold'
                                    : 'text-[var(--gold)] font-bold'
                              }
                            >
                              {locked ? 'Premium' : isNext && !st.boss ? 'Up next' : status}
                            </span>
                            {!studentIsPro && !locked && !st.boss && (
                              <>
                                <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                                <span className="text-[var(--green)] font-bold">Free</span>
                              </>
                            )}
                            <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                            <span className="text-[var(--dim)]">~8 min</span>
                            {hasSim && (
                              <>
                                <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                                <span className="text-[var(--green)] font-bold">Simulation</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Icon
                          name={locked ? 'lock' : st.boss ? 'check' : 'go'}
                          size={15}
                          className={`ul-arrow ${
                            st.boss
                              ? 'text-[var(--green)] shrink-0'
                              : isNext
                                ? 'text-[var(--gold)] shrink-0'
                                : 'text-[var(--dim)] shrink-0'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </SmoothCollapse>
            </section>
          );
        })}
      </SmoothViewSwitch>
            </LayoutGroup>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
