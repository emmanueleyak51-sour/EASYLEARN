import React, { useEffect, useMemo, useState } from 'react';
import type { UserProgress } from '../../types';
import {
  CHEM_FORMULAS,
  CHEM_FORMULA_CATEGORIES,
  type ChemFormulaCatId,
  type ChemFormulaItem,
} from '../../data/chemFormulas';
import {
  MATH_FORMULAS,
  MATH_FORMULA_CATEGORIES,
  type MathFormulaCatId,
  type MathFormulaItem,
} from '../../data/mathFormulas';
import {
  ENG_FORMULAS,
  ENG_FORMULA_CATEGORIES,
  type EngFormulaCatId,
  type EngFormulaItem,
} from '../../data/engFormulas';
import {
  PHYS_FORMULAS,
  PHYS_FORMULA_CATEGORIES,
  type PhysFormulaCatId,
  type PhysFormulaItem,
} from '../../data/physFormulas';
import {
  ECON_FORMULAS,
  ECON_FORMULA_CATEGORIES,
  type EconFormulaCatId,
  type EconFormulaItem,
} from '../../data/econFormulas';
import {
  FMATH_FORMULAS,
  FMATH_FORMULA_CATEGORIES,
  type FMathFormulaCatId,
  type FMathFormulaItem,
} from '../../data/fmathFormulas';
import {
  GEOG_FORMULAS,
  GEOG_FORMULA_CATEGORIES,
  type GeogFormulaCatId,
  type GeogFormulaItem,
} from '../../data/geogFormulas';
import {
  DIGITECH_FORMULAS,
  DIGITECH_FORMULA_CATEGORIES,
  type DigiTechFormulaCatId,
  type DigiTechFormulaItem,
} from '../../data/digitechFormulas';
import {
  DATAPROC_FORMULAS,
  DATAPROC_FORMULA_CATEGORIES,
  type DataProcFormulaCatId,
  type DataProcFormulaItem,
} from '../../data/dataprocFormulas';
import { CHEM_NERDC_MAP } from '../../data/chemNerdc2027';
import { MATH_NERDC_MAP } from '../../data/mathNerdc2027';
import { FMATH_NERDC_MAP } from '../../data/fmathNerdc2027';
import { PHYS_NERDC_MAP } from '../../data/physNerdc2027';
import { GEOG_NERDC_MAP } from '../../data/geogNerdc2027';
import { ECON_NERDC_MAP } from '../../data/econNerdc2027';
import { ENG_NERDC_MAP } from '../../data/engNerdc2027';
import { DIGITECH_NERDC_MAP } from '../../data/digitechNerdc2027';
import { DATAPROC_NERDC_MAP } from '../../data/dataprocNerdc2027';
import { getTopic } from '../../data/curriculum';
import {
  buildFormulaDrillDeck,
  extractFormulaSpeechScript,
  filterChemFormulas,
  type FormulaDrillQuestion,
} from '../../utils/chemFormulaLogic';
import {
  buildMathFormulaDrillDeck,
  extractMathFormulaSpeechScript,
  filterMathFormulas,
  type MathFormulaDrillQuestion,
} from '../../utils/mathFormulaLogic';
import {
  buildPhysFormulaDrillDeck,
  extractPhysFormulaSpeechScript,
  filterPhysFormulas,
  type PhysFormulaDrillQuestion,
} from '../../utils/physFormulaLogic';
import {
  buildEconFormulaDrillDeck,
  extractEconFormulaSpeechScript,
  filterEconFormulas,
  type EconFormulaDrillQuestion,
} from '../../utils/econFormulaLogic';
import {
  buildEngFormulaDrillDeck,
  extractEngFormulaSpeechScript,
  filterEngFormulas,
  type EngFormulaDrillQuestion,
} from '../../utils/engFormulaLogic';
import {
  buildFMathFormulaDrillDeck,
  extractFMathFormulaSpeechScript,
  filterFMathFormulas,
  type FMathFormulaDrillQuestion,
} from '../../utils/fmathFormulaLogic';
import {
  buildGeogFormulaDrillDeck,
  extractGeogFormulaSpeechScript,
  filterGeogFormulas,
  type GeogFormulaDrillQuestion,
} from '../../utils/geogFormulaLogic';
import {
  buildDigiTechFormulaDrillDeck,
  extractDigiTechFormulaSpeechScript,
  filterDigiTechFormulas,
  type DigiTechFormulaDrillQuestion,
} from '../../utils/digitechFormulaLogic';
import {
  buildDataProcFormulaDrillDeck,
  extractDataProcFormulaSpeechScript,
  filterDataProcFormulas,
  type DataProcFormulaDrillQuestion,
} from '../../utils/dataprocFormulaLogic';
import { htmlToSpeakableChem } from '../../utils/chemVoiceLogic';
import { calibrateQuestionItem } from '../../utils/jambDistractorCalibrator';
import {
  sanitizeFormulaForNationalLearning,
  sanitizeNationalText,
} from '../../utils/nationalLearningSanitizer';
import { typesetMathHtml } from '../../utils/mathTypesetter';
import { buildFormulaSheetPdf, downloadPdfBytes } from '../../utils/pdfExport';
import { AnimatedNumber } from '../AnimatedNumber';
import { SubscreenTopBar } from '../AppShell';
import { ChemMadScientistBar } from '../ChemMadScientistBar';
import { Icon } from '../Icons';
import { MotivationBanner } from '../MotivationBanner';
import { LiquidCapsuleBar, SlidingTabs, SmoothProgressBar } from '../ULessonMotion';

const EXPLORER_BATCH_SIZE = 6;

type StudioMode = 'explorer' | 'drill' | 'recall';
type UnifiedFormulaItem =
  | ChemFormulaItem
  | MathFormulaItem
  | FMathFormulaItem
  | PhysFormulaItem
  | GeogFormulaItem
  | EconFormulaItem
  | EngFormulaItem
  | DigiTechFormulaItem
  | DataProcFormulaItem;
type UnifiedDrillQuestion =
  | FormulaDrillQuestion
  | MathFormulaDrillQuestion
  | FMathFormulaDrillQuestion
  | PhysFormulaDrillQuestion
  | GeogFormulaDrillQuestion
  | EconFormulaDrillQuestion
  | EngFormulaDrillQuestion
  | DigiTechFormulaDrillQuestion
  | DataProcFormulaDrillQuestion;

export function ChemFormulasScreen({
  progress,
  initialFormulaId,
  initialTopicId,
  onBack,
  onOpenLab,
  onOpenTopic,
  onRecordFormulaAttempt,
  onCelebrate,
  onSound,
}: {
  progress: UserProgress;
  initialFormulaId?: string | null;
  initialTopicId?: string | null;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenTopic: (tid: string) => void;
  onRecordFormulaAttempt: (formulaId: string, ok: boolean) => void;
  onCelebrate?: () => void;
  onSound?: (kind: 'ok' | 'no' | 'done') => void;
}) {
  const isFMath = progress.subj === 'fmaths';
  const isChem = progress.subj === 'chem';
  const isPhys = progress.subj === 'phys';
  const isGeog = progress.subj === 'geog';
  const isEcon = progress.subj === 'econ';
  const isEng = progress.subj === 'eng';
  const isDigiTech = progress.subj === 'digitech';
  const isDataProc = progress.subj === 'dataproc';
  const subjName = isDataProc
    ? 'Data Processing'
    : isDigiTech
      ? 'Digital Technologies'
      : isEng
        ? 'English'
        : isEcon
          ? 'Economics'
          : isGeog
            ? 'Geography'
            : isPhys
              ? 'Physics'
              : isChem
                ? 'Chemistry'
                : isFMath
                  ? 'Further Maths'
                  : 'Mathematics';
  const itemNoun = isEng ? 'rule' : 'formula';
  const itemNounPlural = isEng ? 'rules' : 'formulas';
  const allFormulas: UnifiedFormulaItem[] = useMemo(() => {
    const raw: UnifiedFormulaItem[] = isDataProc
      ? DATAPROC_FORMULAS
      : isDigiTech
        ? DIGITECH_FORMULAS
        : isEng
          ? ENG_FORMULAS
          : isEcon
            ? ECON_FORMULAS
            : isGeog
              ? GEOG_FORMULAS
              : isPhys
                ? PHYS_FORMULAS
                : isChem
                  ? CHEM_FORMULAS
                  : isFMath
                    ? FMATH_FORMULAS
                    : MATH_FORMULAS;
    return raw.map((f) => sanitizeFormulaForNationalLearning(f));
  }, [isDataProc, isDigiTech, isEng, isEcon, isGeog, isPhys, isChem, isFMath]);
  const formulaCategories = isDataProc
    ? DATAPROC_FORMULA_CATEGORIES
    : isDigiTech
      ? DIGITECH_FORMULA_CATEGORIES
      : isEng
        ? ENG_FORMULA_CATEGORIES
        : isEcon
          ? ECON_FORMULA_CATEGORIES
          : isGeog
            ? GEOG_FORMULA_CATEGORIES
            : isPhys
              ? PHYS_FORMULA_CATEGORIES
              : isChem
                ? CHEM_FORMULA_CATEGORIES
                : isFMath
                  ? FMATH_FORMULA_CATEGORIES
                  : MATH_FORMULA_CATEGORIES;

  const [mode, setMode] = useState<StudioMode>('explorer');
  const [catFilter, setCatFilter] = useState<string>('all');
  const [topicFilterId, setTopicFilterId] = useState<string | null>(initialTopicId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rearrIdxById, setRearrIdxById] = useState<Record<string, number>>({});
  const [openWorkedId, setOpenWorkedId] = useState<string | null>(
    initialFormulaId ||
      (isDataProc
        ? DATAPROC_FORMULAS[0]?.id || null
        : isDigiTech
          ? DIGITECH_FORMULAS[0]?.id || null
          : isEng
            ? 'ef-accomp-prox'
            : isEcon
              ? 'efm-ped'
              : isGeog
                ? GEOG_FORMULAS[0]?.id || null
                : isPhys
                  ? 'pf-v-u-at'
                  : isChem
                    ? 'f-mole-mass'
                    : isFMath
                      ? FMATH_FORMULAS[0]?.id || null
                      : 'mf-quad-formula')
  );
  const [activeVoiceFormulaId, setActiveVoiceFormulaId] = useState<string | null>(null);
  const [explorerPage, setExplorerPage] = useState(0);
  const [showAllExplorer, setShowAllExplorer] = useState(false);

  // Drill session state
  const [drillScopeCat, setDrillScopeCat] = useState<string>('all');
  const [drillTargetFormulaId, setDrillTargetFormulaId] = useState<string | null>(
    initialFormulaId || null
  );
  const [drillSeed, setDrillSeed] = useState<number>(104729);
  const [drillIdx, setDrillIdx] = useState(0);
  const [drillPicked, setDrillPicked] = useState<number | null>(null);
  const [drillShowHint, setDrillShowHint] = useState(false);
  const [drillRightCount, setDrillRightCount] = useState(0);
  const [drillStreak, setDrillStreak] = useState(0);
  const [drillFinished, setDrillFinished] = useState(false);

  // Recall 3D Flip Flashcard state
  const [recallIdx, setRecallIdx] = useState(0);
  const [recallFlipped, setRecallFlipped] = useState(false);
  const [recallKnownCount, setRecallKnownCount] = useState(0);

  // Reset filters cleanly if subject switches while Formula Studio is open
  useEffect(() => {
    setCatFilter('all');
    setSearchQuery('');
    setExplorerPage(0);
    setShowAllExplorer(false);
    setDrillScopeCat('all');
    setDrillTargetFormulaId(null);
    setDrillIdx(0);
    setDrillPicked(null);
    setDrillShowHint(false);
    setDrillRightCount(0);
    setDrillStreak(0);
    setDrillFinished(false);
    setRecallIdx(0);
    setRecallFlipped(false);
    setActiveVoiceFormulaId(null);
    setOpenWorkedId(
      progress.subj === 'dataproc'
        ? DATAPROC_FORMULAS[0]?.id || null
        : progress.subj === 'digitech'
          ? DIGITECH_FORMULAS[0]?.id || null
          : progress.subj === 'eng'
            ? 'ef-accomp-prox'
            : progress.subj === 'econ'
              ? 'efm-ped'
              : progress.subj === 'geog'
                ? GEOG_FORMULAS[0]?.id || null
                : progress.subj === 'phys'
                  ? 'pf-v-u-at'
                  : progress.subj === 'chem'
                    ? 'f-mole-mass'
                    : progress.subj === 'fmaths'
                      ? FMATH_FORMULAS[0]?.id || null
                      : 'mf-quad-formula'
    );
  }, [progress.subj]);

  useEffect(() => {
    if (initialFormulaId) {
      setDrillTargetFormulaId(initialFormulaId);
      setOpenWorkedId(initialFormulaId);
      setTopicFilterId(null);
      setCatFilter('all');
    } else if (initialTopicId) {
      setTopicFilterId(initialTopicId);
      setCatFilter('all');
      setDrillTargetFormulaId(null);
    } else {
      setTopicFilterId(null);
    }
  }, [initialFormulaId, initialTopicId]);

  const masteredCount = useMemo(
    () => allFormulas.filter((f) => !!progress.flags[`fmaster:${f.id}`]).length,
    [allFormulas, progress.flags]
  );

  const filteredFormulas: UnifiedFormulaItem[] = useMemo(() => {
    const baseRaw: UnifiedFormulaItem[] = isDataProc
      ? filterDataProcFormulas(
          DATAPROC_FORMULAS,
          catFilter as DataProcFormulaCatId | 'all',
          searchQuery
        )
      : isDigiTech
        ? filterDigiTechFormulas(
            DIGITECH_FORMULAS,
            catFilter as DigiTechFormulaCatId | 'all',
            searchQuery
          )
        : isEng
          ? filterEngFormulas(ENG_FORMULAS, catFilter as EngFormulaCatId | 'all', searchQuery)
          : isEcon
            ? filterEconFormulas(ECON_FORMULAS, catFilter as EconFormulaCatId | 'all', searchQuery)
            : isGeog
              ? filterGeogFormulas(GEOG_FORMULAS, catFilter as GeogFormulaCatId | 'all', searchQuery)
              : isPhys
                ? filterPhysFormulas(PHYS_FORMULAS, catFilter as PhysFormulaCatId | 'all', searchQuery)
                : isChem
                  ? filterChemFormulas(CHEM_FORMULAS, catFilter as ChemFormulaCatId | 'all', searchQuery)
                  : isFMath
                    ? filterFMathFormulas(
                        FMATH_FORMULAS,
                        catFilter as FMathFormulaCatId | 'all',
                        searchQuery
                      )
                    : filterMathFormulas(
                        MATH_FORMULAS,
                        catFilter as MathFormulaCatId | 'all',
                        searchQuery
                      );
    const base = baseRaw.map((f) => sanitizeFormulaForNationalLearning(f));
    if (!topicFilterId) return base;
    return base.filter((f) => f.topicId === topicFilterId);
  }, [
    isDataProc,
    isDigiTech,
    isEng,
    isEcon,
    isGeog,
    isPhys,
    isChem,
    isFMath,
    catFilter,
    searchQuery,
    topicFilterId,
  ]);

  const catCounts = useMemo(() => {
    const map: Record<string, number> = { all: allFormulas.length };
    for (const c of formulaCategories) {
      if (c.id !== 'all') {
        map[c.id] = allFormulas.filter((f) => f.cat === c.id).length;
      }
    }
    return map;
  }, [allFormulas, formulaCategories]);

  const drillDeck: UnifiedDrillQuestion[] = useMemo(() => {
    const rawDeck: UnifiedDrillQuestion[] = isDataProc
      ? buildDataProcFormulaDrillDeck(
          drillScopeCat as DataProcFormulaCatId | 'all',
          drillTargetFormulaId,
          8,
          drillSeed
        )
      : isDigiTech
        ? buildDigiTechFormulaDrillDeck(
            drillScopeCat as DigiTechFormulaCatId | 'all',
            drillTargetFormulaId,
            8,
            drillSeed
          )
        : isEng
          ? buildEngFormulaDrillDeck(
              drillScopeCat as EngFormulaCatId | 'all',
              drillTargetFormulaId,
              8,
              drillSeed
            )
          : isEcon
            ? buildEconFormulaDrillDeck(
                drillScopeCat as EconFormulaCatId | 'all',
                drillTargetFormulaId,
                8,
                drillSeed
              )
            : isGeog
              ? buildGeogFormulaDrillDeck(
                  drillScopeCat as GeogFormulaCatId | 'all',
                  drillTargetFormulaId,
                  8,
                  drillSeed
                )
              : isPhys
                ? buildPhysFormulaDrillDeck(
                    drillScopeCat as PhysFormulaCatId | 'all',
                    drillTargetFormulaId,
                    8,
                    drillSeed
                  )
                : isChem
                  ? buildFormulaDrillDeck(
                      drillScopeCat as ChemFormulaCatId | 'all',
                      drillTargetFormulaId,
                      8,
                      drillSeed
                    )
                  : isFMath
                    ? buildFMathFormulaDrillDeck(
                        drillScopeCat as FMathFormulaCatId | 'all',
                        drillTargetFormulaId,
                        8,
                        drillSeed
                      )
                    : buildMathFormulaDrillDeck(
                        drillScopeCat as MathFormulaCatId | 'all',
                        drillTargetFormulaId,
                        8,
                        drillSeed
                      );

    return rawDeck.map((item) => {
      const cal = calibrateQuestionItem(
        progress.subj,
        `fdrill|${progress.subj}|${item.id}`,
        sanitizeNationalText(item.promptHtml),
        item.options.map(sanitizeNationalText),
        item.answerIdx,
        sanitizeNationalText(item.explanationHtml)
      );
      return {
        ...item,
        formulaName: sanitizeNationalText(item.formulaName),
        promptHtml: sanitizeNationalText(item.promptHtml),
        hintHtml: sanitizeNationalText(item.hintHtml),
        options: cal.options,
        explanationHtml: cal.explanation ?? sanitizeNationalText(item.explanationHtml),
      };
    });
  }, [
    isDataProc,
    isDigiTech,
    isEng,
    isEcon,
    isGeog,
    isPhys,
    isChem,
    isFMath,
    drillScopeCat,
    drillTargetFormulaId,
    drillSeed,
    progress.subj,
  ]);

  const currentDrillQ = drillDeck[drillIdx] || drillDeck[0];
  const currentDrillFormula = useMemo(
    () => allFormulas.find((f) => f.id === currentDrillQ?.formulaId) || allFormulas[0],
    [allFormulas, currentDrillQ]
  );

  const drillUpcomingScripts = useMemo(
    () =>
      drillDeck.map((dq) =>
        htmlToSpeakableChem(
          `${dq.formulaName}. ${dq.promptHtml}`
        )
      ),
    [drillDeck]
  );

  const recallDeck: UnifiedFormulaItem[] = useMemo(
    () => (filteredFormulas.length > 0 ? filteredFormulas : allFormulas),
    [filteredFormulas, allFormulas]
  );
  const currentRecallCard = recallDeck[recallIdx % recallDeck.length] || allFormulas[0];
  const recallUpcomingScripts = useMemo(
    () =>
      recallDeck.slice(0, 8).map((rc) =>
        htmlToSpeakableChem(
          `${rc.name}. ${rc.summary}. Trap: ${rc.trap}`
        )
      ),
    [recallDeck]
  );

  const usePagedExplorer =
    !showAllExplorer &&
    catFilter === 'all' &&
    !topicFilterId &&
    searchQuery.trim().length === 0 &&
    filteredFormulas.length > EXPLORER_BATCH_SIZE;

  const totalExplorerPages = Math.max(
    1,
    Math.ceil(filteredFormulas.length / EXPLORER_BATCH_SIZE)
  );
  const clampedExplorerPage = Math.min(explorerPage, totalExplorerPages - 1);
  const visibleExplorerFormulas = usePagedExplorer
    ? filteredFormulas.slice(
        clampedExplorerPage * EXPLORER_BATCH_SIZE,
        (clampedExplorerPage + 1) * EXPLORER_BATCH_SIZE
      )
    : filteredFormulas;

  const startFreshDrill = (opts?: {
    formulaId?: string | null;
    cat?: string;
    nextSeed?: number;
  }) => {
    if (opts?.formulaId !== undefined) setDrillTargetFormulaId(opts.formulaId);
    if (opts?.cat !== undefined) setDrillScopeCat(opts.cat);
    setDrillSeed((s) => opts?.nextSeed ?? s + 7919);
    setDrillIdx(0);
    setDrillPicked(null);
    setDrillShowHint(false);
    setDrillRightCount(0);
    setDrillStreak(0);
    setDrillFinished(false);
    setMode('drill');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePickDrillOption = (optIdx: number) => {
    if (!currentDrillQ || drillPicked !== null) return;
    const ok = optIdx === currentDrillQ.answerIdx;
    setDrillPicked(optIdx);
    if (ok) {
      setDrillRightCount((c) => c + 1);
      setDrillStreak((s) => s + 1);
      onSound?.('ok');
    } else {
      setDrillStreak(0);
      onSound?.('no');
    }
    onRecordFormulaAttempt(currentDrillQ.formulaId, ok);
  };

  const handleNextDrill = () => {
    if (drillIdx + 1 >= drillDeck.length) {
      setDrillFinished(true);
      onSound?.('done');
      if (drillRightCount >= 5) {
        onCelebrate?.();
      }
      return;
    }
    setDrillIdx((i) => i + 1);
    setDrillPicked(null);
    setDrillShowHint(false);
  };

  const [pdfSavedFlash, setPdfSavedFlash] = useState(false);
  const activeTopicFilterMeta = topicFilterId ? getTopic(progress.subj, topicFilterId) : undefined;

  if (progress.subj === 'bio' || progress.subj === 'agric' || progress.subj === 'civic') {
    return null;
  }

  const handleDownloadFormulaPdf = () => {
    const pdfBytes = buildFormulaSheetPdf({
      subjectLabel: subjName,
      itemNounPlural,
      items: allFormulas.map((f) => ({
        name: f.name,
        expressionHtml: f.rearrangements[0]?.exprHtml || f.summary,
        trapHtml: f.trap,
      })),
    });
    downloadPdfBytes(
      pdfBytes,
      `Easy-Learn-${subjName}-${isEng ? 'Rules' : 'Formulas'}-Sheet.pdf`
    );
    setPdfSavedFlash(true);
    window.setTimeout(() => setPdfSavedFlash(false), 2600);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="no-print flex flex-col gap-5">
      <SubscreenTopBar
        title={isEng ? 'Grammar rules' : 'Formulas'}
        subtitle={`${subjName} · ${masteredCount} of ${allFormulas.length} ${itemNounPlural} mastered`}
        onBack={onBack}
        right={
          <div className="no-print flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadFormulaPdf}
              className="min-h-[38px] px-3 rounded-xl bg-[var(--card)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--gold)] text-[12.5px] font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap shrink-0"
            >
              <Icon
                name={pdfSavedFlash ? 'check' : 'download'}
                size={14}
                className="text-[var(--gold)]"
              />
              <span>{pdfSavedFlash ? 'PDF saved' : 'Download PDF'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              aria-label="Print formula sheet"
              className="min-h-[38px] px-2.5 rounded-xl bg-[var(--card)] text-[var(--dim)] hover:text-[var(--ink)] border border-[var(--line)] text-[12px] font-bold hidden sm:inline-flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap shrink-0"
            >
              <Icon name="printer" size={14} />
              <span>Print</span>
            </button>
            {!isEng && !isEcon && !isFMath && !isGeog && !isDigiTech && !isDataProc && (
              <button
                type="button"
                onClick={onOpenLab}
                className="min-h-[38px] px-3.5 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] shadow-[0_2px_0_var(--acc-d)] text-[12.5px] font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Icon name={isChem ? 'flask' : isPhys ? 'atom' : 'pen'} size={15} />
                <span>Labs</span>
              </button>
            )}
          </div>
        }
      />

      <MotivationBanner variant="compact" studentName={progress.name} subj={progress.subj} />

      {/* Mode Switcher Bar + Summary */}
      <section className="rtc-card rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex flex-col min-[880px]:flex-row min-[880px]:items-center justify-between gap-3.5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[12.5px] font-bold text-[var(--dim)]">
              <span className="text-[var(--gold)] font-extrabold">
                All {allFormulas.length} {subjName} {isEng ? 'Rules' : 'Formulas'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {masteredCount}/{allFormulas.length} drilled &amp; mastered
              </span>
            </div>
            <p className="text-[14px] text-[var(--dim)]">
              {isDataProc
                ? 'Rearrange every relational cardinality, 1NF–3NF key rule, record-storage size, Excel cell formula, SQL aggregate, and Mod-10 check-digit rule with live drills.'
                : isDigiTech
                  ? 'Rearrange every binary/hex base law, two’s complement range, IEC/SI storage size, CPU clock cycle, De Morgan logic identity, and IPv4 subnetting formula with live drills.'
                  : isEng
                    ? 'Switch every concord, subjunctive, clause, Oral English sound, and register pattern, inspect grammar traps, and practise live sentence drills.'
                    : isEcon
                      ? 'Rearrange every elasticity, cost, revenue, statistics, GDP, CPI, multiplier, and trade formula, spot key traps, and practise live numerical drills.'
                      : isGeog
                        ? 'Rearrange every topographic map scale, area, contour gradient, longitude/time, sun elevation, lapse rate, humidity, and demographic formula with live drills.'
                        : isPhys
                          ? 'Rearrange every mechanics, optics, circuit, field, and nuclear equation by subject, check SI units & sign conventions, and practise live Physics calculations.'
                          : isChem
                            ? 'Rearrange every equation by subject, check SI units & key traps, and practise live calculations with step-by-step substitutions.'
                            : isFMath
                              ? 'Rearrange every calculus derivative/integral, binomial, matrix, vector, mechanics, and probability identity, inspect sign traps, and practise live drills.'
                              : 'Rearrange every theorem and equation by subject, spot sign & unit traps, and practise live randomized Maths calculations step by step.'}
            </p>
            <SmoothProgressBar
              value={masteredCount}
              max={allFormulas.length}
              tone="emerald"
              heightClass="h-3"
              className="max-w-[260px]"
            />
          </div>

          <div className="overflow-x-auto max-w-full shrink-0">
            <SlidingTabs
              items={[
                {
                  id: 'explorer',
                  label: isEng
                    ? `Rule Sheet (${allFormulas.length})`
                    : `Formula Sheet (${allFormulas.length})`,
                  icon: 'book',
                },
                {
                  id: 'drill',
                  label: isEng ? 'Usage & Pattern Drill' : 'Calculation Drill',
                  icon: 'bolt',
                },
                { id: 'recall', label: '3D Recall Cards', icon: 'rev' },
              ]}
              value={mode}
              onChange={(nextMode) => {
                setMode(nextMode);
                if (nextMode === 'recall') setRecallFlipped(false);
              }}
              ariaLabel={isEng ? 'English rules studio mode' : 'Formula studio mode'}
              variant="indigo"
              className="min-w-[420px]"
            />
          </div>
        </div>

        {activeTopicFilterMeta && mode === 'explorer' && (
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--line)] text-[13px]">
            <span className="text-[var(--ink)] font-semibold">
              Showing {itemNounPlural} linked to <strong>{activeTopicFilterMeta.name}</strong> (
              {filteredFormulas.length})
            </span>
            <button
              type="button"
              onClick={() => setTopicFilterId(null)}
              className="text-[var(--gold)] font-bold hover:underline cursor-pointer whitespace-nowrap"
            >
              Show all {allFormulas.length} {itemNounPlural}
            </button>
          </div>
        )}
      </section>

      {/* ═══════════════ MODE 1: FORMULA / RULE SHEET & PATTERN SWITCHER ═══════════════ */}
      {mode === 'explorer' && (
        <div key="panel-explorer" className="flex flex-col gap-5 anim-tab-panel">
          <div className="rtc-card rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="eyebrow text-[var(--dim)] tabular-nums">
                  Filter by {subjName} {isEng ? 'domain' : 'branch'} · {filteredFormulas.length} shown
                </span>
                {catFilter === 'all' && !topicFilterId && searchQuery.trim().length === 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAllExplorer((v) => !v);
                      setExplorerPage(0);
                    }}
                    className="min-h-[30px] px-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12px] font-bold text-[var(--gold)] hover:text-[var(--ink)] transition cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {showAllExplorer
                      ? `Focus ${EXPLORER_BATCH_SIZE} at a time`
                      : `Show all ${filteredFormulas.length}`}
                  </button>
                )}
              </div>
              <div className="relative sm:w-[320px] shrink-0">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={`Search ${subjName} ${itemNounPlural}`}
                  placeholder={
                    isDataProc
                      ? 'Search SQL, 3NF, VLOOKUP, cardinality, parity, RTO...'
                      : isDigiTech
                        ? 'Search binary, two’s complement, ALU, NAND, CIDR, Mb/s...'
                        : isEng
                          ? 'Search concord, neither, stress, vowel, clause...'
                          : isEcon
                            ? 'Search elasticity, MC, multiplier, CPI, GDP...'
                            : isGeog
                              ? 'Search scale, gradient, longitude, lapse rate, density...'
                              : isPhys
                                ? 'Search projectile, lens, Ohm, half-life...'
                                : isChem
                                  ? 'Search Boyle, Faraday, pH, mole...'
                                  : isFMath
                                    ? 'Search binomial, integral, dot product, Poisson, pulley...'
                                    : 'Search quadratic, sine, cone, AP...'
                  }
                  className="w-full min-h-[38px] pl-3.5 pr-9 rounded-xl bg-[var(--bg)] border border-[var(--line)] focus:border-[var(--gold)] focus:bg-[var(--card)] text-[13.5px] font-medium text-[var(--ink)] outline-none transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label={`Clear ${itemNoun} search`}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md text-[var(--dim)] hover:text-[var(--ink)] flex items-center justify-center cursor-pointer"
                  >
                    <Icon name="x" size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto max-w-full pb-0.5">
              <LiquidCapsuleBar
                roleType="group"
                size="sm"
                ariaLabel="Filter formulas by branch"
                items={formulaCategories.map((cat) => ({
                  id: cat.id,
                  label: `${cat.shortLabel} (${catCounts[cat.id] ?? 0})`,
                }))}
                value={topicFilterId ? null : catFilter}
                onChange={(cid) => {
                  setTopicFilterId(null);
                  setCatFilter(cid);
                  setExplorerPage(0);
                }}
              />
            </div>
          </div>

          {filteredFormulas.length === 0 ? (
            <div className="rounded-2xl bg-[var(--card)] border border-[var(--line)] p-6 text-center flex flex-col items-center gap-3">
              <p className="text-[15px] font-semibold text-[var(--ink)]">
                No {subjName} {itemNounPlural} matched “{searchQuery}”.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCatFilter('all');
                  setTopicFilterId(null);
                  setExplorerPage(0);
                }}
                className="btn-tactile paper min-h-[38px] px-4 text-[13.5px] whitespace-nowrap"
              >
                <span>Reset filters</span>
              </button>
            </div>
          ) : (
            <>
              {usePagedExplorer && (
                <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-[13px] font-semibold text-[var(--dim)]">
                  <span>
                    Calm study batch {clampedExplorerPage + 1} of {totalExplorerPages} ·{' '}
                    <strong className="text-[var(--ink)]">
                      {clampedExplorerPage * EXPLORER_BATCH_SIZE + 1}–
                      {Math.min(
                        (clampedExplorerPage + 1) * EXPLORER_BATCH_SIZE,
                        filteredFormulas.length
                      )}
                    </strong>{' '}
                    of {filteredFormulas.length} {itemNounPlural}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={clampedExplorerPage === 0}
                      onClick={() => setExplorerPage((p) => Math.max(0, p - 1))}
                      className="min-h-[34px] px-3 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--acc-line)] disabled:opacity-40 disabled:cursor-default text-[12.5px] font-bold text-[var(--ink)] cursor-pointer whitespace-nowrap"
                    >
                      Prev {EXPLORER_BATCH_SIZE}
                    </button>
                    <button
                      type="button"
                      disabled={clampedExplorerPage >= totalExplorerPages - 1}
                      onClick={() =>
                        setExplorerPage((p) => Math.min(totalExplorerPages - 1, p + 1))
                      }
                      className="min-h-[34px] px-3 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] disabled:opacity-40 disabled:cursor-default text-[12.5px] font-bold cursor-pointer whitespace-nowrap"
                    >
                      Next {EXPLORER_BATCH_SIZE}
                    </button>
                  </div>
                </div>
              )}

              <div className="stagger-grid grid grid-cols-1 min-[900px]:grid-cols-2 gap-4 items-start">
                {visibleExplorerFormulas.map((f) => {
                const rIdx = rearrIdxById[f.id] || 0;
                const activeRearr = f.rearrangements[rIdx] || f.rearrangements[0];
                const isWorkedOpen = openWorkedId === f.id;
                const isVoiceOpen = activeVoiceFormulaId === f.id;
                const isMastered = !!progress.flags[`fmaster:${f.id}`];
                const linkedTopic = getTopic(progress.subj, f.topicId);
                const nerdcMeta = isDataProc
                  ? DATAPROC_NERDC_MAP[f.topicId]
                  : isDigiTech
                    ? DIGITECH_NERDC_MAP[f.topicId]
                    : isEng
                      ? ENG_NERDC_MAP[f.topicId]
                      : isEcon
                        ? ECON_NERDC_MAP[f.topicId]
                        : isGeog
                          ? GEOG_NERDC_MAP[f.topicId]
                          : isPhys
                            ? PHYS_NERDC_MAP[f.topicId]
                            : isChem
                              ? CHEM_NERDC_MAP[f.topicId]
                              : isFMath
                                ? FMATH_NERDC_MAP[f.topicId]
                                : MATH_NERDC_MAP[f.topicId];
                const classLabel = nerdcMeta
                  ? nerdcMeta.classId.toUpperCase().replace('SS', 'SS ')
                  : 'SS 1–3';
                const catMeta = formulaCategories.find((c) => c.id === f.cat);

                return (
                  <article
                    key={f.id}
                    className="rtc-card rounded-2xl p-5 flex flex-col gap-3.5"
                  >
                    {/* Clean unboxed metadata row */}
                    <div className="flex items-center justify-between gap-2.5 text-[12px] font-semibold text-[var(--dim)]">
                      <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                        <span>{catMeta?.shortLabel || subjName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{classLabel}</span>
                        {isMastered && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[var(--green)] font-bold">Mastered</span>
                          </>
                        )}
                      </div>
                      {linkedTopic && (
                        <button
                          type="button"
                          title={linkedTopic.name}
                          onClick={() => onOpenTopic(linkedTopic.id)}
                          className="min-w-0 max-w-[62%] truncate text-right text-[12px] font-bold text-[var(--gold)] hover:underline cursor-pointer"
                        >
                          {linkedTopic.name}
                        </button>
                      )}
                    </div>

                    <div>
                      <h2 className="h18 text-[var(--ink)]">{f.name}</h2>
                      <p
                        className="text-[13.5px] text-[var(--dim)] mt-0.5 leading-snug"
                        dangerouslySetInnerHTML={{
                          __html: typesetMathHtml(f.summary, progress.subj),
                        }}
                      />
                    </div>

                    {/* Obsidian Scientific Equation Plate */}
                    <div className="rtc-eq-plate rounded-2xl px-3.5 py-4 min-h-[96px] text-center flex flex-col items-center justify-center gap-1.5">
                      <span className="text-[11.5px] font-semibold text-slate-400">
                        {activeRearr.label}
                      </span>
                      <div
                        key={`${f.id}-eq-${rIdx}`}
                        className="anim-eq-swap font-[var(--display)] font-bold text-[15.5px] sm:text-[17px] text-[#F8FAFC] tracking-[0.005em] leading-snug text-balance tabular-nums max-w-full overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: typesetMathHtml(activeRearr.exprHtml, progress.subj),
                        }}
                      />
                      {activeRearr.note && (
                        <span
                          className="text-[11.5px] text-amber-300/95 font-medium text-balance"
                          dangerouslySetInnerHTML={{
                            __html: typesetMathHtml(activeRearr.note, progress.subj),
                          }}
                        />
                      )}
                    </div>

                    {/* Interactive Subject-of-Formula Rearranger */}
                    {f.rearrangements.length > 1 && (
                      <div
                        className="flex items-center gap-1.5 flex-wrap"
                        role="group"
                        aria-label={`Rearrange ${f.name}`}
                      >
                        {f.rearrangements.map((r, idx) => {
                          const active = rIdx === idx;
                          return (
                            <button
                              key={`${r.solveFor}-${idx}`}
                              type="button"
                              aria-pressed={active}
                              onClick={() => setRearrIdxById((m) => ({ ...m, [f.id]: idx }))}
                              className={`min-h-[30px] px-2.5 rounded-lg text-[12px] font-semibold border transition cursor-pointer whitespace-nowrap ${
                                active
                                  ? 'bg-[var(--gold)] border-[var(--gold)] text-[var(--on-acc)] font-bold'
                                  : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)] hover:border-[var(--acc-line)]'
                              }`}
                            >
                              {r.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Variables & Constants Table */}
                    <div className="flex flex-col gap-2">
                      <div className="tw tw-compact">
                        <table>
                          <thead>
                            <tr>
                              <th>{isEng ? 'Element / Cue' : 'Symbol'}</th>
                              <th>
                                {isEng
                                  ? 'Grammatical Rule & Usage'
                                  : isDataProc
                                    ? 'Database / Spreadsheet Meaning & Unit'
                                    : isDigiTech
                                      ? 'Computing Quantity & Binary / SI Unit'
                                      : isEcon
                                        ? 'Economic Meaning & Unit'
                                        : isGeog
                                          ? 'Quantity & Map / Climate Unit'
                                          : 'Quantity & SI Unit'}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {f.variables.map(([sym, meaning], i) => (
                              <tr key={i}>
                                <td>
                                  <span
                                    className="font-mono font-bold text-[var(--gold)]"
                                    dangerouslySetInnerHTML={{
                                      __html: typesetMathHtml(sym, progress.subj),
                                    }}
                                  />
                                </td>
                                <td
                                  dangerouslySetInnerHTML={{
                                    __html: typesetMathHtml(meaning, progress.subj),
                                  }}
                                />
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {f.constants && f.constants.length > 0 && (
                        <div
                          className="text-[12px] font-semibold text-[var(--green)] tabular-nums"
                          dangerouslySetInnerHTML={{
                            __html: typesetMathHtml(
                              `${isEng ? 'Key triggers' : 'Constants'}: ${f.constants.join(' · ')}`,
                              progress.subj
                            ),
                          }}
                        />
                      )}
                    </div>

                    {/* Trap Callout */}
                    <div className="text-[12.5px] text-[var(--ink)] bg-[var(--warn-soft)] border border-[var(--warn-line)] rounded-xl px-3 py-2 leading-snug">
                      <strong className="font-bold text-[var(--warn-ink)]">Trap: </strong>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: typesetMathHtml(f.trap, progress.subj),
                        }}
                      />
                    </div>

                    {/* Smooth CSS Grid Accordion for Worked Example (#57) */}
                    <div className={`accordion-grid ${isWorkedOpen ? 'is-open' : ''}`}>
                      <div className="accordion-inner">
                        <div className="rounded-xl bg-[var(--bg)] border border-[var(--line)] p-3.5 flex flex-col gap-1.5 text-[13px] mt-0.5">
                          <div
                            className="font-bold text-[var(--ink)]"
                            dangerouslySetInnerHTML={{
                              __html: typesetMathHtml(f.worked.qHtml, progress.subj),
                            }}
                          />
                          <div className="flex flex-col gap-1 text-[var(--dim)] leading-relaxed tabular-nums">
                            {f.worked.stepsHtml.map((stepLine, sIdx) => (
                              <div
                                key={sIdx}
                                dangerouslySetInnerHTML={{
                                  __html: typesetMathHtml(stepLine, progress.subj),
                                }}
                              />
                            ))}
                          </div>
                          <div
                            className="font-extrabold text-[var(--green)] pt-1 tabular-nums"
                            dangerouslySetInnerHTML={{
                              __html: typesetMathHtml(
                                `Answer: ${f.worked.ansHtml}`,
                                progress.subj
                              ),
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Optional Studio Voice Coach */}
                    {isVoiceOpen && (
                      <ChemMadScientistBar
                        mode={
                          isDataProc
                            ? 'dataproc'
                            : isDigiTech
                              ? 'digitech'
                              : isEng
                                ? 'eng'
                                : isEcon
                                  ? 'econ'
                                  : isGeog
                                    ? 'geog'
                                    : isPhys
                                      ? 'phys'
                                      : isChem
                                        ? 'chem'
                                        : isFMath
                                          ? 'fmath'
                                          : 'math'
                        }
                        variant="compact"
                        muted={progress.muted}
                        sessionKey={`formula-explorer|${progress.subj}`}
                        stepKey={`formula|${progress.subj}|${f.id}|${rIdx}`}
                        context={{
                          topicName: f.name,
                          sectionName: isEng
                            ? 'English Rules Studio'
                            : `${subjName} Formula Studio`,
                          stepLabel: isEng
                            ? 'Rule & Usage Walkthrough'
                            : 'Formula & Intuition Walkthrough',
                          stepText: isDataProc
                            ? extractDataProcFormulaSpeechScript(f as DataProcFormulaItem, rIdx)
                            : isDigiTech
                              ? extractDigiTechFormulaSpeechScript(f as DigiTechFormulaItem, rIdx)
                              : isEng
                                ? extractEngFormulaSpeechScript(f as EngFormulaItem, rIdx)
                                : isEcon
                                  ? extractEconFormulaSpeechScript(f as EconFormulaItem, rIdx)
                                  : isGeog
                                    ? extractGeogFormulaSpeechScript(f as GeogFormulaItem, rIdx)
                                    : isPhys
                                      ? extractPhysFormulaSpeechScript(f as PhysFormulaItem, rIdx)
                                      : isChem
                                        ? extractFormulaSpeechScript(f as ChemFormulaItem, rIdx)
                                        : isFMath
                                          ? extractFMathFormulaSpeechScript(f as FMathFormulaItem, rIdx)
                                          : extractMathFormulaSpeechScript(f as MathFormulaItem, rIdx),
                          examTrap: f.trap,
                        }}
                      />
                    )}

                    {/* Action Footer */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--line)] flex-wrap">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-expanded={isWorkedOpen}
                          onClick={() => setOpenWorkedId(isWorkedOpen ? null : f.id)}
                          className="min-h-[36px] px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12.5px] font-bold text-[var(--ink)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <Icon
                            name="go"
                            size={13}
                            className={`chevron-turn ${isWorkedOpen ? 'is-open' : ''}`}
                          />
                          <span>{isWorkedOpen ? 'Hide example' : 'Worked example'}</span>
                        </button>
                        <button
                          type="button"
                          aria-expanded={isVoiceOpen}
                          onClick={() => setActiveVoiceFormulaId(isVoiceOpen ? null : f.id)}
                          className="min-h-[36px] px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12.5px] font-bold text-[var(--dim)] hover:text-[var(--ink)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <Icon name="vol" size={14} />
                          <span>Voice</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => startFreshDrill({ formulaId: f.id })}
                        className="min-h-[36px] px-3.5 rounded-xl bg-[var(--gold)] text-[var(--on-acc)] shadow-[0_1px_2px_rgba(15,23,42,0.16)] hover:brightness-105 active:translate-y-[1px] text-[12.5px] font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                      >
                        <span>{isEng ? 'Practise rule' : 'Practise formula'}</span>
                        <Icon name="go" size={14} />
                      </button>
                    </div>
                  </article>
                );
              })}
              </div>

              {usePagedExplorer && (
                <div className="rounded-2xl bg-[var(--card)] border border-[var(--line)] p-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={clampedExplorerPage === 0}
                    onClick={() => {
                      setExplorerPage((p) => Math.max(0, p - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="btn-tactile paper min-h-[40px] px-4 text-[13px] disabled:opacity-40 disabled:cursor-default whitespace-nowrap"
                  >
                    <span>Previous {EXPLORER_BATCH_SIZE}</span>
                  </button>
                  <span className="text-[13px] font-bold text-[var(--dim)] tabular-nums">
                    Batch {clampedExplorerPage + 1} / {totalExplorerPages}
                  </span>
                  <button
                    type="button"
                    disabled={clampedExplorerPage >= totalExplorerPages - 1}
                    onClick={() => {
                      setExplorerPage((p) => Math.min(totalExplorerPages - 1, p + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="btn-tactile indigo min-h-[40px] px-4 text-[13px] disabled:opacity-40 disabled:cursor-default whitespace-nowrap"
                  >
                    <span>Next {EXPLORER_BATCH_SIZE} {itemNounPlural}</span>
                    <Icon name="go" size={15} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ═══════════════ MODE 2: INTERACTIVE CALCULATION & FORMULA DRILL ═══════════════ */}
      {mode === 'drill' && (
        <div key="panel-drill" className="flex flex-col gap-5 anim-tab-panel">
          <div className="rtc-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label="Choose calculation drill scope"
            >
              {drillTargetFormulaId && (
                <button
                  type="button"
                  aria-pressed={true}
                  onClick={() => startFreshDrill({ formulaId: null, cat: 'all' })}
                  className="min-h-[34px] px-3 rounded-lg bg-[var(--gold)] text-[var(--on-acc)] text-[12.5px] font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>
                    Focused:{' '}
                    {allFormulas.find((f) => f.id === drillTargetFormulaId)?.name ||
                      (isEng ? 'Rule' : 'Formula')}
                  </span>
                  <Icon name="x" size={13} />
                </button>
              )}
              {formulaCategories.map((c) => {
                const active = !drillTargetFormulaId && drillScopeCat === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => startFreshDrill({ formulaId: null, cat: c.id })}
                    className={`min-h-[34px] px-3 rounded-lg text-[12.5px] font-bold border transition cursor-pointer whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[var(--acc-soft)] border-[var(--acc-line)] text-[var(--gold)]'
                        : 'bg-[var(--bg)] border-[var(--line)] text-[var(--dim)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {c.shortLabel}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => startFreshDrill({})}
              className="min-h-[36px] px-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--acc-line)] text-[12.5px] font-bold text-[var(--ink)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Icon name="replay" size={14} />
              <span>{isEng ? 'New sentences' : 'New numbers'}</span>
            </button>
          </div>

          {drillFinished ? (
            <section className="max-w-[680px] w-full mx-auto rtc-card rounded-2xl p-6 text-center flex flex-col items-center gap-4 anim-rise">
              <div className="w-14 h-14 rounded-2xl bg-[var(--ok-soft)] text-[var(--green)] flex items-center justify-center anim-stamp">
                <Icon name="trophy" size={28} />
              </div>
              <div>
                <span className="eyebrow text-[var(--gold)]">
                  {isEng ? 'Rules Drill Complete' : 'Formula Drill Complete'}
                </span>
                <h2 className="h26 text-[var(--ink)] mt-1 tabular-nums">
                  <AnimatedNumber value={drillRightCount} /> / {drillDeck.length}{' '}
                  {isEng ? 'questions' : 'calculations'} solved
                </h2>
                <p className="text-[14.5px] text-[var(--dim)] mt-1">
                  {isEng
                    ? 'Every drill rotates fresh sentence frames and traps so you master genuine grammatical structure and sound patterns.'
                    : 'Every problem uses fresh randomized values so you master the actual formula and units rather than memorizing answers.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => startFreshDrill({})}
                  className="btn-tactile indigo whitespace-nowrap"
                >
                  <Icon name="replay" size={17} />
                  <span>{isEng ? 'Try 8 new questions' : 'Try 8 new problems'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('explorer')}
                  className="btn-tactile paper whitespace-nowrap"
                >
                  <span>{isEng ? 'Back to rule sheet' : 'Back to formula sheet'}</span>
                </button>
              </div>
            </section>
          ) : (
            currentDrillQ && (
              <div className="max-w-[780px] w-full mx-auto flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3 text-[13px] font-bold">
                  <span className="text-[var(--dim)] tabular-nums">
                    {isEng ? 'Question' : 'Problem'} {drillIdx + 1} of {drillDeck.length} ·{' '}
                    {currentDrillFormula.name}
                  </span>
                  <div className="flex items-center gap-2 text-[var(--dim)] tabular-nums">
                    <span className="text-[var(--green)]">{drillRightCount} right</span>
                    {drillStreak >= 2 && (
                      <span
                        key={`st-${drillStreak}`}
                        className="anim-streak-pop text-[var(--coral-ink)] font-extrabold"
                      >
                        · {drillStreak}x streak
                      </span>
                    )}
                  </div>
                </div>

                {/* Animated Progress Track (#37) */}
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {drillDeck.map((qItem, idx) => (
                    <span
                      key={qItem.id}
                      className={`h-3 flex-1 rounded-full transition-all duration-200 ${
                        idx < drillIdx
                          ? 'bg-[var(--green)]'
                          : idx === drillIdx
                            ? 'bg-[var(--gold)]'
                            : 'bg-[var(--line)]'
                      }`}
                    />
                  ))}
                </div>

                <ChemMadScientistBar
                  mode={
                    isDataProc
                      ? 'dataproc'
                      : isDigiTech
                        ? 'digitech'
                        : isEng
                          ? 'eng'
                          : isEcon
                            ? 'econ'
                            : isGeog
                              ? 'geog'
                              : isPhys
                                ? 'phys'
                                : isChem
                                  ? 'chem'
                                  : isFMath
                                    ? 'fmath'
                                    : 'math'
                  }
                  variant="compact"
                  muted={progress.muted}
                  sessionKey={`fdrill-session|${progress.subj}|${drillSeed}`}
                  stepKey={`fdrill|${progress.subj}|${currentDrillQ.id}|${drillPicked !== null ? 'exp' : 'q'}`}
                  upcomingScripts={drillUpcomingScripts}
                  context={{
                    topicName: currentDrillFormula.name,
                    sectionName: isEng
                      ? 'English Usage & Pattern Drill'
                      : `${subjName} Calculation Drill`,
                    stepLabel:
                      drillPicked !== null
                        ? isEng
                          ? 'Worked Rule Analysis'
                          : 'Worked Formula Solution'
                        : `${isEng ? 'Question' : 'Problem'} ${drillIdx + 1}`,
                    stepText:
                      drillPicked !== null
                        ? `Explanation for ${currentDrillFormula.name}. ${htmlToSpeakableChem(
                            currentDrillQ.explanationHtml
                          )}`
                        : `${isEng ? 'English pattern question' : 'Calculation problem'} on ${
                            currentDrillFormula.name
                          }. ${htmlToSpeakableChem(currentDrillQ.promptHtml)}`,
                    examTrap: currentDrillFormula.trap,
                  }}
                />

                {/* Question Card with Question Transition Animation (#31) */}
                <section
                  key={currentDrillQ.id}
                  className="anim-q-enter rtc-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
                >
                  <p
                    className="text-[17px] leading-relaxed font-semibold text-[var(--ink)] tabular-nums"
                    dangerouslySetInnerHTML={{
                      __html: typesetMathHtml(currentDrillQ.promptHtml, progress.subj),
                    }}
                  />

                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      aria-expanded={drillShowHint}
                      onClick={() => setDrillShowHint((v) => !v)}
                      className="text-[13px] font-bold text-[var(--gold)] hover:underline flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Icon name="book" size={14} />
                      <span>
                        {drillShowHint
                          ? `Hide ${itemNoun} hint`
                          : isEng
                            ? 'Show rule & pattern hint'
                            : 'Show formula & unit hint'}
                      </span>
                    </button>
                  </div>

                  {drillShowHint && (
                    <div
                      className="anim-explain-reveal rtc-eq-plate rounded-xl px-4 py-3 text-[14px] font-semibold tabular-nums"
                      dangerouslySetInnerHTML={{
                        __html: typesetMathHtml(currentDrillQ.hintHtml, progress.subj),
                      }}
                    />
                  )}

                  {/* 4 Options with Pop, Shake & Option Elimination (#32, #33, #34, #43) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {currentDrillQ.options.map((optHtml, idx) => {
                      const isAnswered = drillPicked !== null;
                      const isRightOpt = idx === currentDrillQ.answerIdx;
                      const isPickedOpt = drillPicked === idx;

                      let stateCls = '';
                      if (isAnswered) {
                        if (isRightOpt) stateCls = 'ok';
                        else if (isPickedOpt) stateCls = 'no anim-shake';
                        else stateCls = 'opt-eliminated';
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handlePickDrillOption(idx)}
                          className={`opt-tile tabular-nums ${stateCls}`}
                        >
                          <span className="opt-bubble">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span
                            className="flex-1 font-bold text-[15px] leading-snug"
                            dangerouslySetInnerHTML={{
                              __html: typesetMathHtml(optHtml, progress.subj),
                            }}
                          />
                          {isAnswered && isRightOpt && (
                            <Icon
                              name="check"
                              size={18}
                              className="text-[var(--green)] shrink-0 anim-check-draw"
                            />
                          )}
                          {isAnswered && isPickedOpt && !isRightOpt && (
                            <Icon name="x" size={18} className="text-[var(--coral)] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Step-by-Step Worked Substitution Reveal (#42) */}
                  {drillPicked !== null && (
                    <div
                      className={`anim-explain-reveal rounded-2xl border p-4 flex flex-col gap-2 ${
                        drillPicked === currentDrillQ.answerIdx
                          ? 'bg-[var(--ok-soft)]/70 border-[var(--ok-line)]'
                          : 'bg-[var(--bad-soft)]/70 border-[var(--bad-line)]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`font-[var(--display)] font-extrabold text-[15px] ${
                            drillPicked === currentDrillQ.answerIdx
                              ? 'text-[var(--green)]'
                              : 'text-[var(--coral-ink)]'
                          }`}
                        >
                          {drillPicked === currentDrillQ.answerIdx
                            ? `Spot on! ${isEng ? 'Rule' : 'Formula'} mastered`
                            : isEng
                              ? 'Check the grammatical rule & pattern below'
                              : 'Check the substitution & units below'}
                        </span>
                      </div>
                      <div
                        className="text-[14px] text-[var(--ink)] leading-relaxed tabular-nums"
                        dangerouslySetInnerHTML={{
                          __html: typesetMathHtml(currentDrillQ.explanationHtml, progress.subj),
                        }}
                      />
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={handleNextDrill}
                          className="btn-tactile indigo min-h-[42px] px-5 whitespace-nowrap"
                        >
                          <span>
                            {drillIdx + 1 >= drillDeck.length
                              ? 'Finish drill'
                              : isEng
                                ? 'Next question'
                                : 'Next calculation'}
                          </span>
                          <Icon name="go" size={17} />
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )
          )}
        </div>
      )}

      {/* ═══════════════ MODE 3: 3D CARD FLIP RECALL CHECK (#49) ═══════════════ */}
      {mode === 'recall' && currentRecallCard && (
        <div
          key="panel-recall"
          className="max-w-[680px] w-full mx-auto flex flex-col gap-4 anim-tab-panel"
        >
          <div className="flex items-center justify-between text-[13px] font-bold text-[var(--dim)] tabular-nums">
            <span>
              Recall Card {(recallIdx % recallDeck.length) + 1} of {recallDeck.length}
            </span>
            <span className="text-[var(--green)]">{recallKnownCount} recalled cleanly</span>
          </div>

          <ChemMadScientistBar
            mode={
              isDataProc
                ? 'dataproc'
                : isDigiTech
                  ? 'digitech'
                  : isEng
                    ? 'eng'
                    : isEcon
                      ? 'econ'
                      : isGeog
                        ? 'geog'
                        : isPhys
                          ? 'phys'
                          : isChem
                            ? 'chem'
                            : isFMath
                              ? 'fmath'
                              : 'math'
            }
            variant="compact"
            muted={progress.muted}
            sessionKey={`frecall-session|${progress.subj}`}
            stepKey={`frecall|${progress.subj}|${currentRecallCard.id}|${recallFlipped ? 'back' : 'front'}`}
            upcomingScripts={recallUpcomingScripts}
            context={{
              topicName: currentRecallCard.name,
              sectionName: `${subjName} Recall Cards`,
              stepLabel: recallFlipped ? 'Back · Exact Formula & Trap' : 'Front · Recall Prompt',
              stepText: recallFlipped
                ? htmlToSpeakableChem(
                    `${currentRecallCard.name}: ${
                      currentRecallCard.rearrangements[0]?.exprHtml || ''
                    }. Trap: ${currentRecallCard.trap}`
                  )
                : htmlToSpeakableChem(
                    `Recall card: ${currentRecallCard.name}. ${currentRecallCard.summary}`
                  ),
              examTrap: currentRecallCard.trap,
            }}
          />

          <div className="flip-stage">
            <div className={`flip-card-inner ${recallFlipped ? 'is-flipped' : ''}`}>
              {/* Front Face: Prompt & Variables */}
              <section
                aria-hidden={recallFlipped}
                className={`flip-face rtc-card rounded-2xl p-6 flex flex-col justify-between gap-5 ${
                  recallFlipped ? 'pointer-events-none' : ''
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="text-[12px] font-bold text-[var(--gold)]">
                    {isEng
                      ? 'Front · Recall the exact grammatical / phonetic pattern before flipping'
                      : 'Front · Recall the exact formula & SI units before flipping'}
                  </div>
                  <h2 className="h22 text-[var(--ink)]">{currentRecallCard.name}</h2>
                  <p
                    className="text-[15px] text-[var(--dim)] leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: typesetMathHtml(currentRecallCard.summary, progress.subj),
                    }}
                  />
                  <div className="text-[13px] text-[var(--ink)] bg-[var(--bg)] border border-[var(--line)] rounded-xl p-3.5">
                    <strong>{isEng ? 'Key elements: ' : 'Quantities involved: '}</strong>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: typesetMathHtml(
                          currentRecallCard.variables.map(([sym]) => sym).join(' · '),
                          progress.subj
                        ),
                      }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setRecallFlipped(true)}
                  className="btn-tactile indigo w-full justify-center whitespace-nowrap"
                >
                  <Icon name="rev" size={17} />
                  <span>{isEng ? 'Flip card to reveal rule' : 'Flip card to reveal formula'}</span>
                </button>
              </section>

              {/* Back Face: Obsidian Equation Plate, Rearrangements & Self-Grade */}
              <section
                aria-hidden={!recallFlipped}
                className={`flip-face flip-face-back absolute inset-0 rtc-card rounded-2xl p-6 flex flex-col justify-between gap-4 overflow-y-auto ${
                  !recallFlipped ? 'pointer-events-none' : ''
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-[12px] font-bold text-[var(--green)]">
                    <span>
                      {isEng
                        ? 'Back · Exact Pattern & Trap'
                        : 'Back · Exact Equation & Trap'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRecallFlipped(false)}
                      className="text-[var(--dim)] hover:text-[var(--ink)] underline cursor-pointer"
                    >
                      Flip back
                    </button>
                  </div>

                  <div className="rtc-eq-plate rounded-2xl p-4 text-center">
                    <div
                      className="font-[var(--display)] font-bold text-[19px] text-white tabular-nums"
                      dangerouslySetInnerHTML={{
                        __html: typesetMathHtml(
                          currentRecallCard.rearrangements[0]?.exprHtml || '',
                          progress.subj
                        ),
                      }}
                    />
                  </div>

                  <div className="text-[13px] text-[var(--ink)] bg-[var(--warn-soft)] border border-[var(--warn-line)] rounded-xl p-3 leading-snug">
                    <strong className="font-bold text-[var(--warn-ink)]">Trap: </strong>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: typesetMathHtml(currentRecallCard.trap, progress.subj),
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setRecallFlipped(false);
                      window.setTimeout(() => setRecallIdx((i) => i + 1), 160);
                    }}
                    className="btn-tactile paper justify-center whitespace-nowrap"
                  >
                    <span>Review again</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRecallKnownCount((n) => n + 1);
                      onRecordFormulaAttempt(currentRecallCard.id, true);
                      onSound?.('ok');
                      setRecallFlipped(false);
                      window.setTimeout(() => setRecallIdx((i) => i + 1), 160);
                    }}
                    className="btn-tactile emerald justify-center whitespace-nowrap"
                  >
                    <Icon name="check" size={17} />
                    <span>Got it right</span>
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Printable 1-Page Formula / Rules Cheat Sheet */}
      <section className="hidden print:block print-sheet">
        <h2 className="font-bold text-[18px] mb-2">
          Easy Learn — {subjName} Complete {isEng ? 'Rules' : 'Formulas'} Sheet ({allFormulas.length})
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {allFormulas.map((f, idx) => (
            <div key={f.id} className="border border-slate-300 rounded p-2 break-inside-avoid">
              <div className="font-bold text-[11px]">{idx + 1}. {f.name}</div>
              <div
                className="text-[11.5px] font-semibold my-0.5"
                dangerouslySetInnerHTML={{
                  __html: typesetMathHtml(f.rearrangements[0]?.exprHtml || f.summary, progress.subj),
                }}
              />
              <div
                className="text-[10px] text-slate-600"
                dangerouslySetInnerHTML={{ __html: typesetMathHtml(f.trap, progress.subj) }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
