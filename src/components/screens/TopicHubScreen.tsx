import React, { useState } from 'react';
import type { InteractiveLesson, Topic, UserProgress } from '../../types';
import { CHEM_NERDC_MAP } from '../../data/chemNerdc2027';
import { MATH_NERDC_MAP } from '../../data/mathNerdc2027';
import { FMATH_NERDC_MAP } from '../../data/fmathNerdc2027';
import { PHYS_NERDC_MAP } from '../../data/physNerdc2027';
import { BIO_NERDC_MAP } from '../../data/bioNerdc2027';
import { AGRIC_NERDC_MAP } from '../../data/agricNerdc2027';
import { GEOG_NERDC_MAP } from '../../data/geogNerdc2027';
import { ECON_NERDC_MAP } from '../../data/econNerdc2027';
import { ENG_NERDC_MAP } from '../../data/engNerdc2027';
import { CIVIC_NERDC_MAP } from '../../data/civicNerdc2027';
import { DIGITECH_NERDC_MAP } from '../../data/digitechNerdc2027';
import { DATAPROC_NERDC_MAP } from '../../data/dataprocNerdc2027';
import {
  AGRIC_LAB_FOR_TOPIC,
  CHEM_LAB_FOR_TOPIC,
  MATH_LAB_FOR_TOPIC,
  PHYS_LAB_FOR_TOPIC,
  getLabById,
} from '../../data/labs';
import { BIO_LAB_FOR_TOPIC } from '../../data/bioLabs';
import { getFormulasForTopic } from '../../utils/chemFormulaLogic';
import { getMathFormulasForTopic } from '../../utils/mathFormulaLogic';
import { getFMathFormulasForTopic } from '../../utils/fmathFormulaLogic';
import { getPhysFormulasForTopic } from '../../utils/physFormulaLogic';
import { getGeogFormulasForTopic } from '../../utils/geogFormulaLogic';
import { getEconFormulasForTopic } from '../../utils/econFormulaLogic';
import { getEngFormulasForTopic } from '../../utils/engFormulaLogic';
import { getDigiTechFormulasForTopic } from '../../utils/digitechFormulaLogic';
import { getDataProcFormulasForTopic } from '../../utils/dataprocFormulaLogic';
import { extractTopicOverviewSpeechScript } from '../../utils/chemVoiceLogic';
import { typesetMathHtml } from '../../utils/mathTypesetter';
import { SUBJECT_INFO, mpct, tstate, tstatus } from '../../utils/engine';
import { SubscreenTopBar } from '../AppShell';
import { ChemMadScientistBar } from '../ChemMadScientistBar';
import { Icon, RingGauge } from '../Icons';
import { SmoothProgressBar } from '../ULessonMotion';

export { NotesScreen } from './NotesScreen';

export function TopicHubScreen({
  topic,
  lesson,
  progress,
  onBack,
  onStartLesson,
  onOpenNotes,
  onStartPractice,
  onStartTopicTest,
  onOpenLab,
  onOpenFormulas,
}: {
  topic: Topic;
  lesson?: InteractiveLesson;
  progress: UserProgress;
  onBack: () => void;
  onStartLesson: () => void;
  onOpenNotes: () => void;
  onStartPractice: () => void;
  onStartTopicTest: () => void;
  onOpenLab: (labId: string) => void;
  onOpenFormulas?: (topicId: string) => void;
}) {
  const [showAllGoals, setShowAllGoals] = useState(false);

  const st = tstate(progress, topic.id);
  const score = mpct(progress, topic.id);
  const status = tstatus(progress, topic.id);
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
  const nerdc = isFMath
    ? FMATH_NERDC_MAP[topic.id]
    : isChem
      ? CHEM_NERDC_MAP[topic.id]
      : isPhys
        ? PHYS_NERDC_MAP[topic.id]
        : isBio
          ? BIO_NERDC_MAP[topic.id]
          : isAgric
            ? AGRIC_NERDC_MAP[topic.id]
            : isGeog
              ? GEOG_NERDC_MAP[topic.id]
              : isEcon
                ? ECON_NERDC_MAP[topic.id]
                : isEng
                  ? ENG_NERDC_MAP[topic.id]
                  : isCivic
                    ? CIVIC_NERDC_MAP[topic.id]
                    : isDigiTech
                      ? DIGITECH_NERDC_MAP[topic.id]
                      : isDataProc
                        ? DATAPROC_NERDC_MAP[topic.id]
                        : MATH_NERDC_MAP[topic.id];
  const labId =
    isFMath || isGeog || isEng || isEcon || isCivic || isDigiTech || isDataProc
      ? undefined
      : isChem
        ? CHEM_LAB_FOR_TOPIC[topic.id]
        : isPhys
          ? PHYS_LAB_FOR_TOPIC[topic.id]
          : isBio
            ? BIO_LAB_FOR_TOPIC[topic.id]
            : isAgric
              ? AGRIC_LAB_FOR_TOPIC[topic.id]
              : MATH_LAB_FOR_TOPIC[topic.id];
  const linkedLab =
    isFMath || isGeog || isEng || isEcon || isCivic || isDigiTech || isDataProc || !labId
      ? undefined
      : getLabById(labId);
  const topicFormulas =
    isBio || isAgric || isCivic
      ? []
      : isDataProc
        ? getDataProcFormulasForTopic(topic.id)
        : isDigiTech
          ? getDigiTechFormulasForTopic(topic.id)
          : isFMath
            ? getFMathFormulasForTopic(topic.id)
            : isChem
              ? getFormulasForTopic(topic.id)
              : isPhys
                ? getPhysFormulasForTopic(topic.id)
                : isGeog
                  ? getGeogFormulasForTopic(topic.id)
                  : isEcon
                    ? getEconFormulasForTopic(topic.id)
                    : isEng
                      ? getEngFormulasForTopic(topic.id)
                      : getMathFormulasForTopic(topic.id);

  const hasExplorer = !!lesson?.parts.some((p) => p.beats.some((b) => b.k === 'explore'));
  const readChapters = topic.parts.filter((_, idx) => !!progress.flags[`note:${topic.id}:${idx}`]).length;

  const stages = [
    {
      num: 1,
      time: '~5 min',
      title: 'Learn Step-by-Step',
      desc: `Bite-sized interactive lesson${
        hasExplorer ? ' with live chalkboard simulation' : ' with guided worked examples'
      }`,
      done: !!st.lesson,
      cta: st.lesson ? 'Review lesson' : 'Start lesson',
      primary: !st.lesson,
      onClick: onStartLesson,
    },
    {
      num: 2,
      time: '~4 min',
      title: 'Practise 6 Questions',
      desc: '6 mastery practice questions with instant step-by-step explanations',
      done: !!st.practice,
      cta: st.practice ? 'Practise again' : 'Start practice',
      primary: !!st.lesson && !st.practice,
      onClick: onStartPractice,
    },
    {
      num: 3,
      time: '5 min',
      title: 'Mastery Check',
      desc: `Pass 5 of 7 timed questions to lock in ${topic.name}`,
      done: !!st.boss,
      cta: st.boss ? 'Retake test' : 'Take topic test',
      primary: !!st.lesson && !!st.practice && !st.boss,
      onClick: onStartTopicTest,
    },
  ];

  const subtitle = nerdc
    ? `${SUBJECT_INFO[progress.subj].short} · ${nerdc.classId.toUpperCase().replace('SS', 'SS ')} · ${nerdc.termLabel}`
    : `${SUBJECT_INFO[progress.subj].short} · ${topic.sec}`;

  const visibleGoals = showAllGoals ? topic.goals : topic.goals.slice(0, 3);

  return (
    <div className="max-w-[780px] mx-auto flex flex-col gap-5 anim-rise">
      <SubscreenTopBar title={topic.name} subtitle={subtitle} onBack={onBack} />

      {/* Calm Topic Summary & Bite-Sized Objectives */}
      <section className="rtc-card rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5">
        <RingGauge value={score} size={92} stroke={8} onDark={false} label={`${topic.name} mastery`} />
        <div className="flex-1 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 flex-wrap text-[12.5px] font-bold">
            <span className={st.boss ? 'text-[var(--green)] font-extrabold' : 'text-[var(--gold)] font-extrabold'}>
              {status}
            </span>
            <span aria-hidden="true" className="text-[var(--dim)]">·</span>
            <span className="text-[var(--dim)]">3 short steps (~14 min total)</span>
          </div>

          {topic.goals.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-bold text-[var(--ink)]">
                What you’ll be able to do:
              </span>
              <ul className="text-[14px] text-[var(--dim)] space-y-1">
                {visibleGoals.map((g, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Icon name="check" size={15} className="text-[var(--green)] shrink-0 mt-0.5" />
                    <span dangerouslySetInnerHTML={{ __html: typesetMathHtml(g, progress.subj) }} />
                  </li>
                ))}
              </ul>
              {topic.goals.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllGoals((v) => !v)}
                  className="self-start text-[12px] font-bold text-[var(--gold)] hover:underline cursor-pointer pt-0.5"
                >
                  {showAllGoals
                    ? 'Show fewer objectives'
                    : `+ ${topic.goals.length - 3} more learning objectives`}
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Topic Voice Briefing & Live Coach */}
      <ChemMadScientistBar
        mode={
          isDataProc
            ? 'dataproc'
            : isDigiTech
              ? 'digitech'
              : isCivic
                ? 'civic'
                : isEng
                  ? 'eng'
                  : isEcon
                    ? 'econ'
                    : isGeog
                      ? 'geog'
                      : isAgric
                        ? 'agric'
                        : isBio
                          ? 'bio'
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
        stepKey={`hub|${progress.subj}|${topic.id}`}
        context={{
          topicName: topic.name,
          sectionName: topic.sec,
          stepLabel: 'Topic Overview & Trap',
          stepText: extractTopicOverviewSpeechScript(topic),
          examTrap: topic.trap,
          goals: topic.goals,
        }}
      />

      {/* 3 Calm Learning Stages */}
      <div className="stagger-grid flex flex-col gap-3">
        {stages.map((stg) => (
          <div
            key={stg.num}
            className={`study-card rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              stg.done
                ? 'bg-[var(--ok-soft)]/50 border-[var(--ok-line)]'
                : stg.primary
                  ? 'rtc-card border-[var(--gold)] ring-1 ring-[var(--gold)]/20 bg-gradient-to-r from-[var(--acc-soft)]/30 via-[var(--card)] to-[var(--card)]'
                  : 'rtc-card'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <span
                className={`ul-icon-box w-9 h-9 rounded-xl font-[var(--display)] font-extrabold text-[15px] flex items-center justify-center shrink-0 ${
                  stg.done
                    ? 'bg-[var(--green)] text-white'
                    : stg.primary
                      ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                      : 'bg-[var(--acc-soft)] text-[var(--gold)]'
                }`}
              >
                {stg.done ? <Icon name="check" size={18} /> : stg.num}
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="h18 text-[var(--ink)]">
                    {stg.num}. {stg.title}
                  </h2>
                  <span className="text-[12px] font-bold text-[var(--gold)]">
                    · {stg.time}
                  </span>
                </div>
                <p className="text-[14px] text-[var(--dim)] mt-0.5 leading-snug">{stg.desc}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={stg.onClick}
              className={`btn-tactile shrink-0 whitespace-nowrap ${stg.primary ? 'indigo' : 'paper'}`}
            >
              <span>{stg.cta}</span>
              <Icon name="go" size={17} className="ul-arrow" />
            </button>
          </div>
        ))}
      </div>

      {/* Focused Chapter-by-Chapter Study Notes + 1-Min Reread Sheet */}
      <div className="study-card rtc-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <span className="ul-icon-box w-10 h-10 rounded-xl bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[var(--gold)] flex items-center justify-center shrink-0">
            <Icon name="book" size={19} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--gold)]">
              <span>Chapter Notes &amp; 1-Min Reread Sheet</span>
              <span aria-hidden="true" className="text-[var(--dim)]">·</span>
              <span className="text-[var(--dim)] tabular-nums">
                {readChapters}/{topic.parts.length} read (~2m per chapter)
              </span>
            </div>
            <h2 className="h18 text-[var(--ink)] mt-0.5">
              One calm chapter at a time, with continuous voice teaching
            </h2>
            <div className="max-w-[220px] pt-2">
              <SmoothProgressBar
                value={readChapters}
                max={Math.max(1, topic.parts.length)}
                tone="emerald"
                heightClass="h-1.5"
              />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenNotes}
          className="btn-tactile paper shrink-0 whitespace-nowrap"
        >
          <Icon name="book" size={17} />
          <span>{readChapters > 0 ? 'Continue notes' : 'Read notes'}</span>
        </button>
      </div>

      {/* Linked Practical / Construction Lab */}
      {linkedLab && (
        <button
          type="button"
          onClick={() => onOpenLab(linkedLab.id)}
          className="study-card rtc-eq-plate w-full text-left rounded-2xl text-white p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-white/25 cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <span className="ul-icon-box w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-amber-300 flex items-center justify-center shrink-0">
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
                size={20}
              />
            </span>
            <div>
              <span className="text-[11.5px] font-bold text-amber-300">
                Hands-On Virtual Lab
              </span>
              <div className="font-[var(--display)] font-bold text-[16px] text-white">{linkedLab.name}</div>
              <div
                className="text-[13px] text-slate-300"
                dangerouslySetInnerHTML={{ __html: linkedLab.blurb }}
              />
            </div>
          </div>
          <Icon name="go" size={18} className="text-amber-300 shrink-0 ul-arrow" />
        </button>
      )}

      {/* Linked Topic Formulas / English Rules */}
      {!isBio && !isAgric && !isCivic && topicFormulas.length > 0 && onOpenFormulas && (
        <button
          type="button"
          onClick={() => onOpenFormulas(topic.id)}
          className="study-card rtc-card w-full text-left rounded-2xl hover:border-[var(--acc-line)] p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="ul-icon-box w-10 h-10 rounded-xl bg-[var(--acc-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
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
                size={20}
              />
            </span>
            <div className="min-w-0">
              <span className="text-[11.5px] font-bold text-[var(--gold)]">
                {isEng ? 'Topic Grammar Rules' : 'Topic Formulas'} · {topicFormulas.length}
              </span>
              <div className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)]">
                Practise {topic.name} {isEng ? 'Rules' : 'Formulas'}
              </div>
              <div className="text-[13px] text-[var(--dim)] truncate">
                {topicFormulas.map((f) => f.name).join(' · ')}
              </div>
            </div>
          </div>
          <Icon name="go" size={18} className="text-[var(--gold)] shrink-0 ul-arrow" />
        </button>
      )}

      {/* Trap */}
      <div className="rounded-2xl bg-[var(--bad-soft)] border border-[var(--bad-line)] p-4 flex items-start gap-3">
        <span className="w-8 h-8 rounded-xl bg-[var(--card)] text-[var(--coral-ink)] flex items-center justify-center shrink-0">
          <Icon name="bolt" size={16} />
        </span>
        <div>
          <span className="eyebrow text-[var(--coral-ink)]">Trap</span>
          <p
            className="text-[14px] text-[var(--ink)] mt-0.5 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: typesetMathHtml(topic.trap, progress.subj) }}
          />
        </div>
      </div>
    </div>
  );
}
