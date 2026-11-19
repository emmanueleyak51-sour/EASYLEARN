import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Variants } from 'motion/react';
import type { ChemClassId, SubjectId, Topic, UserProgress } from '../../types';
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
import { SUBJECT_INFO, isTopicLocked, mpct, nextMission, tstate, tstatus } from '../../utils/engine';
import { Icon, MiniRing } from '../Icons';
import { MotivationBanner } from '../MotivationBanner';
import {
  FLUID_SCREEN_EXIT,
  FLUID_SCREEN_SPRING,
  LIQUID_CAPSULE_SPRING,
  SlidingTabs,
  SmoothProgressBar,
  usePostMountLayoutGate,
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
}: {
  progress: UserProgress;
  onSelectSubject: (s: SubjectId) => void;
  onSelectClass?: (cls: ChemClassId) => void;
  onManageSubjects: () => void;
  onOpenTopic: (tid: string) => void;
  onOpenLab: () => void;
  onOpenFormulas?: () => void;
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
  const activeClass: ChemClassId = isFMath
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
  const domainTabs = isFMath
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
    isFMath
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

  const allSubjectTopics = getTopics(progress.subj);
  const classScopedTopics = useMemo(
    () =>
      isFMath
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
        const meta = getNerdcMeta(t.id);
        if (meta?.domain !== domainFilter) return false;
      }
      return matchesTopicSearch(t, normalizedQuery);
    });
  }, [
    classScopedTopics,
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

  const mission = nextMission(progress, classScopedTopics);
  const recommended = mission?.t.id;

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
    setOpenSections((prev) => ({ ...prev, [secName]: !prev[secName] }));
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

  const totalPassed = classScopedTopics.filter((t) => tstate(progress, t.id).boss).length;
  const overallPct = classScopedTopics.length
    ? Math.round((totalPassed / classScopedTopics.length) * 100)
    : 0;

  const domainLayoutReady = usePostMountLayoutGate();
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
    <div className="flex flex-col gap-5">
      {/* Calm, Reassuring Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="eyebrow text-[var(--gold)]">{classMeta.kicker}</span>
          <h1 className="h28 text-[var(--ink)]">{classMeta.fullTitle}</h1>
          <p className="text-[14px] text-[var(--dim)] mt-0.5">
            Guided step-by-step path · One short ~8 min topic at a time ({overallPct}% mastered)
          </p>
        </div>
        <button
          type="button"
          onClick={onManageSubjects}
          className="self-start sm:self-auto min-h-[36px] px-3.5 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12.5px] font-bold text-[var(--gold)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Icon name={SUBJECT_INFO[progress.subj].icon} size={14} />
          <span>Switch subject</span>
          <Icon name="go" size={14} />
        </button>
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
            className="flex flex-col gap-5 will-change-transform"
          >
            <LayoutGroup id={`topics-subj-${progress.subj}`}>
      {/* Rotating Scholar Motivation Strip */}
      <MotivationBanner
        variant="compact"
        studentName={progress.name}
        subj={progress.subj}
      />

      {/* Spotlight: Your Next 8-Minute Step (Eliminates Decision Paralysis) */}
      {mission && !normalizedQuery && (
        <section className="rtc-card rounded-2xl border-[var(--acc-line)] bg-gradient-to-r from-[var(--acc-soft)]/35 via-[var(--card)] to-[var(--card)] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <MiniRing value={mpct(progress, mission.t.id)} size={52} />
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--gold)]">
                <span>Your Next 8-Minute Step</span>
                <span aria-hidden="true" className="text-[var(--dim)]">·</span>
                <span className="text-[var(--green)] font-semibold">
                  No rush — focus only on this one
                </span>
              </div>
              <h2 className="h20 text-[var(--ink)] mt-0.5 truncate">{mission.t.name}</h2>
              <p className="text-[13.5px] text-[var(--dim)] truncate">
                {mission.t.sec} · {mission.t.parts.length} short chapters + 6 practice questions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenTopic(mission.t.id)}
            className="btn-tactile indigo min-h-[44px] px-5 whitespace-nowrap shrink-0"
          >
            <span>Continue this topic</span>
            <Icon name="go" size={17} className="ul-arrow" />
          </button>
        </section>
      )}

      {/* Class Switcher + Live Search + Domain Filter */}
      <section className="rtc-card rounded-2xl p-4 flex flex-col gap-3.5">
        <div className="flex flex-col min-[880px]:flex-row min-[880px]:items-center justify-between gap-3">
          {/* Clean Class Tabs (without intimidating topic-count walls) */}
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

          {/* Search Input */}
          <div className="relative flex-1 min-[880px]:max-w-[380px]">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={`Search ${SUBJECT_INFO[progress.subj].name} topics`}
              placeholder={
                isFMath
                  ? 'Jump to binomial, integral, vector, matrix, Poisson...'
                  : isGeog
                    ? 'Jump to contour, longitude, Harmattan, Kainji, GIS...'
                    : isChem
                      ? 'Jump to any topic, law, reagent...'
                      : isBio
                        ? 'Jump to cell, osmosis, enzyme, Mendel...'
                        : isAgric
                          ? 'Jump to soil, NPK, cassava, poultry, aquaculture...'
                          : isEcon
                            ? 'Jump to elasticity, monopoly, GDP, ECOWAS...'
                            : isPhys
                              ? 'Jump to motion, lens, Ohm, circuit...'
                              : isEng
                                ? 'Jump to concord, vowel, stress, idiom...'
                                : isCivic
                                  ? 'Jump to federalism, UDHR, INEC, FRSC, rule of law...'
                                  : isDigiTech
                                    ? 'Jump to ALU, binary, NAND, OSI, IPv4, encryption...'
                                    : isDataProc
                                      ? 'Jump to SQL, 3NF, primary key, VLOOKUP, ACID...'
                                      : 'Jump to topic, theorem, formula...'
              }
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

        {/* Branch Filter + Focus/Expand Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-[var(--line)]/70">
          {activeClass === 'all' ? (
            <div
              className="inline-flex items-center gap-0.5 p-1 rounded-xl bg-[var(--bg)] border border-[var(--line)] overflow-x-auto max-w-full"
              role="group"
              aria-label={`Filter by ${SUBJECT_INFO[progress.subj].name} branch`}
            >
              {domainTabs.map((d) => {
                const active = domainFilter === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setDomainFilter(d.id)}
                    className={`relative min-h-[30px] px-3 rounded-[9px] text-[12px] font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                      active
                        ? 'text-[var(--ink)] font-bold'
                        : 'text-[var(--dim)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId={domainLayoutReady ? `topics-domain-capsule-${progress.subj}` : undefined}
                        aria-hidden="true"
                        transition={prefersReduced ? { duration: 0 } : LIQUID_CAPSULE_SPRING}
                        className="pointer-events-none absolute inset-0 rounded-[9px] bg-[var(--card)] border border-[var(--acc-line)] shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
                      />
                    )}
                    <span className="relative z-10">{d.label}</span>
                  </button>
                );
              })}
            </div>
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

      {/* Compact Lab & Formula Studio Quick Bar (omitted for Civic Education — no Lab, no Formulas) */}
      {!isCivic && (
        <div
          className={`grid grid-cols-1 ${
            !isFMath &&
            !isGeog &&
            !isEng &&
            !isEcon &&
            !isDigiTech &&
            !isDataProc &&
            !isBio &&
            !isAgric &&
            onOpenFormulas
              ? 'min-[820px]:grid-cols-2'
              : ''
          } gap-3.5`}
        >
          {!isFMath && !isGeog && !isEng && !isEcon && !isDigiTech && !isDataProc && (
            <button
              type="button"
              onClick={onOpenLab}
              className="study-card rtc-eq-plate w-full text-left rounded-2xl text-white p-4 flex items-center justify-between gap-4 hover:border-white/25 cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="ul-icon-box w-11 h-11 rounded-xl bg-white/10 border border-white/15 text-amber-300 flex items-center justify-center shrink-0">
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
                    size={22}
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="font-[var(--display)] font-bold text-[16px] text-white truncate">
                    {isChem
                      ? 'Chemistry Practicals Lab'
                      : isAgric
                        ? 'Agricultural Science Practicals Lab'
                        : isBio
                          ? 'Biology Practicals Lab'
                          : isPhys
                            ? 'Physics Practicals Lab'
                            : 'Maths Constructions Lab'}
                  </h2>
                  <p className="text-[12.5px] text-slate-300 truncate">
                    {isChem
                      ? 'Interactive apparatus, meniscus readings & live curves'
                      : isAgric
                        ? 'Soil horizons, NPK trials, feed rations & farm assays'
                        : isBio
                          ? 'Microscopy, osmosis, food tests & enzyme kinetics'
                          : isPhys
                            ? 'Interactive vernier, optics, circuits & meters'
                            : 'Compass, ruler, protractor & locus animations'}
                  </p>
                </div>
              </div>
              <Icon name="go" size={18} className="text-amber-300 shrink-0 ul-arrow" />
            </button>
          )}

          {!isBio && !isAgric && onOpenFormulas && (
            <button
              type="button"
              onClick={onOpenFormulas}
              className="study-card rtc-card w-full text-left rounded-2xl hover:border-[var(--acc-line)] p-4 flex items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="ul-icon-box w-11 h-11 rounded-xl bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[var(--gold)] flex items-center justify-center shrink-0">
                  <Icon
                    name={
                      isDataProc
                        ? 'database'
                        : isDigiTech
                          ? 'cpu'
                          : isEng
                            ? 'book'
                            : isEcon
                              ? 'chart'
                              : isGeog
                                ? 'globe'
                                : isFMath
                                  ? 'integral'
                                  : 'sigma'
                    }
                    size={22}
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="font-[var(--display)] font-bold text-[16.5px] text-[var(--ink)] truncate">
                    {isDataProc
                      ? 'Data Processing SQL & Formula Studio'
                      : isDigiTech
                        ? 'Digital Tech Formula & Binary Studio'
                        : isEng
                          ? 'English Grammar & Rules Studio'
                          : isEcon
                            ? 'Economics Formula Studio'
                            : isGeog
                              ? 'Geography Calculations Studio'
                              : isFMath
                                ? 'Further Maths Formula Studio'
                                : isChem
                                  ? 'Chemistry Formula Studio'
                                  : isPhys
                                    ? 'Physics Formula Studio'
                                    : 'Mathematics Formula Studio'}
                  </h2>
                  <p className="text-[13px] text-[var(--dim)] truncate">
                    {isDataProc
                      ? '20 core formulas & SQL rules: relational algebra, 1NF–3NF, Excel & check-digit drills'
                      : isDigiTech
                        ? '20 core formulas: binary/hex, storage units, ALU clock, logic & subnetting drills'
                        : isEng
                          ? 'Concord laws, stress patterns & quick usage drills'
                          : isEcon
                            ? '24 quantitative formulas: elasticity, costs, CPI, multiplier & drills'
                            : isGeog
                              ? '20 quantitative formulas: map scale, gradient, longitude time & climate drills'
                              : isFMath
                                ? '25 core formulas: calculus, vectors, matrices, mechanics & probability drills'
                                : 'Interactive equation rearranger & calculation drills'}
                  </p>
                </div>
              </div>
              <Icon name="go" size={18} className="text-[var(--gold)] shrink-0 ul-arrow" />
            </button>
          )}
        </div>
      )}

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
      <div key={`${progress.subj}-${activeClass}-${domainFilter}`} className="flex flex-col gap-3.5 anim-tab-panel">
        {sections.map((sec) => {
          const secPassed = sec.items.filter((t) => tstate(progress, t.id).boss).length;
          const hasRecommended = sec.items.some((t) => t.id === recommended);
          const isOpen = !!normalizedQuery || !!openSections[sec.name];

          return (
            <section
              key={sec.name}
              className={`rounded-2xl border transition-colors ${
                isOpen
                  ? 'rtc-card p-4 sm:p-5'
                  : 'bg-[var(--card)]/85 border-[var(--line)] hover:border-[var(--acc-line)] px-4 py-3.5'
              } flex flex-col gap-3.5`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleSection(sec.name)}
                className="w-full text-left flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="h20 text-[var(--ink)]">{sec.name}</h2>
                    {hasRecommended && !isOpen && (
                      <span className="text-[11.5px] font-extrabold text-[var(--gold)]">
                        · Active unit
                      </span>
                    )}
                  </div>
                  <p className="text-[12.5px] text-[var(--dim)] mt-0.5">
                    {sec.sub ? `${sec.sub} · ` : ''}
                    {sec.items.length} {sec.items.length === 1 ? 'short topic' : 'bite-sized topics'} (~8 min each)
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:block w-24">
                    <SmoothProgressBar
                      value={secPassed}
                      max={Math.max(1, sec.items.length)}
                      tone="emerald"
                      heightClass="h-1.5"
                    />
                  </div>
                  <span className="text-[12.5px] font-bold text-[var(--dim)] tabular-nums whitespace-nowrap shrink-0">
                    {secPassed}/{sec.items.length} done
                  </span>
                  <span className="w-7 h-7 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--dim)] flex items-center justify-center shrink-0">
                    <Icon
                      name="go"
                      size={14}
                      className={`chevron-turn ${isOpen ? 'is-open' : ''}`}
                    />
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="stagger-grid grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[var(--line)]">
                  {sec.items.map((t) => {
                    const locked = isTopicLocked(progress, t.id);
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
                        className={`study-card text-left rounded-2xl border p-4 flex items-center gap-3.5 cursor-pointer ${
                          st.boss
                            ? 'bg-[var(--ok-soft)]/55 border-[var(--ok-line)]'
                            : isNext
                              ? 'bg-[var(--acc-soft)]/40 border-[var(--acc-line)] hover:border-[var(--gold)]'
                              : 'bg-[var(--bg)]/55 border-[var(--line)] hover:bg-[var(--card)] hover:border-[var(--acc-line)]'
                        }`}
                      >
                        <MiniRing value={pctVal} size={46} />
                        <div className="min-w-0 flex-1">
                          {meta && activeClass === 'all' && (
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--dim)] mb-0.5 truncate">
                              <span className="font-bold text-[var(--ink)]">
                                {meta.classId.toUpperCase().replace('SS', 'SS ')}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{meta.termLabel}</span>
                            </div>
                          )}
                          <div className="font-[var(--display)] font-bold text-[15.5px] text-[var(--ink)] leading-snug">
                            {t.name}
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap mt-1 text-[12px] font-semibold">
                            <span className={st.boss ? 'text-[var(--green)] font-bold' : 'text-[var(--gold)] font-bold'}>
                              {isNext && !st.boss ? 'Up next' : status}
                            </span>
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
                          size={17}
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
              )}
            </section>
          );
        })}
      </div>
            </LayoutGroup>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
