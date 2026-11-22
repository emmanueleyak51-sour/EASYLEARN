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
import { isUtmeSingleBlockSubject } from '../../utils/examSubjects';
import { hasFormulaSheet } from '../../utils/subjectStudioMeta';
import { SubscreenTopBar } from '../AppShell';
import { ChemMadScientistBar } from '../ChemMadScientistBar';
import { subjectToLiveCoachMode } from '../../context/LiveCoachContext';
import { Icon, RingGauge } from '../Icons';
import { SmoothCollapse, SmoothProgressBar } from '../ULessonMotion';
import {
  getToughJambDrillConfig,
  getWaecMistakeGuidance,
  resolveExamTrack,
} from '../../utils/examTrackLogic';

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
  const isMath = progress.subj === 'maths';
  const isPhys = progress.subj === 'phys';
  const isBio = progress.subj === 'bio';
  const isAgric = progress.subj === 'agric';
  const isGeog = progress.subj === 'geog';
  const isEcon = progress.subj === 'econ';
  const isEng = progress.subj === 'eng';
  const isCivic = progress.subj === 'civic';
  const isDigiTech = progress.subj === 'digitech';
  const isDataProc = progress.subj === 'dataproc';
  const isSingleBlock = isUtmeSingleBlockSubject(progress.subj);
  const nerdc = isSingleBlock
    ? undefined
    : isFMath
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
                          : isMath
                            ? MATH_NERDC_MAP[topic.id]
                            : undefined;
  const labId =
    isSingleBlock || isFMath || isGeog || isEng || isEcon || isCivic || isDigiTech || isDataProc
      ? undefined
      : isChem
        ? CHEM_LAB_FOR_TOPIC[topic.id]
        : isPhys
          ? PHYS_LAB_FOR_TOPIC[topic.id]
          : isBio
            ? BIO_LAB_FOR_TOPIC[topic.id]
            : isAgric
              ? AGRIC_LAB_FOR_TOPIC[topic.id]
              : isMath
                ? MATH_LAB_FOR_TOPIC[topic.id]
                : undefined;
  const linkedLab = !labId ? undefined : getLabById(labId);
  const topicFormulas =
    isSingleBlock || isBio || isAgric || isCivic
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
                      : isMath
                        ? getMathFormulasForTopic(topic.id)
                        : [];

  const hasExplorer = !!lesson?.parts.some((p) => p.beats.some((b) => b.k === 'explore'));
  const readChapters = topic.parts.filter((_, idx) => !!progress.flags[`note:${topic.id}:${idx}`]).length;

  const examTrack = resolveExamTrack(progress);
  const drillCfg = getToughJambDrillConfig(examTrack, progress.subj, progress.jambSubjects);
  const waecGuidance =
    examTrack === 'waec' || examTrack === 'both'
      ? getWaecMistakeGuidance(progress.subj, topic.trap)
      : null;

  const stages = [
    {
      num: 1,
      time: '~5 min',
      title: 'Learn step by step',
      desc: `Short interactive lesson${
        hasExplorer ? ' with a live try-it diagram' : ' with worked examples'
      }`,
      done: !!st.lesson,
      cta: st.lesson ? 'Read lesson again' : 'Start lesson',
      primary: !st.lesson,
      onClick: onStartLesson,
    },
    {
      num: 2,
      time: '~4 min',
      title: 'Practise 6 questions',
      desc: drillCfg.isToughJamb
        ? '6 tough JAMB-level questions with look-alike option traps (A–D)'
        : '6 exam-style questions with clear step-by-step explanations',
      done: !!st.practice,
      cta: st.practice ? 'Practise again' : 'Start practice',
      primary: !!st.lesson && !st.practice,
      onClick: onStartPractice,
    },
    {
      num: 3,
      time: drillCfg.isToughJamb ? '3 min 30s' : '5 min',
      title: drillCfg.isToughJamb ? 'Topic test (Tough JAMB)' : 'Topic test',
      desc: `Pass ${drillCfg.bossHp} of 7 timed questions in ${
        drillCfg.isToughJamb ? '3:30' : '5:00'
      } to finish ${topic.name}`,
      done: !!st.boss,
      cta: st.boss ? 'Retake test' : 'Take topic test',
      primary: !!st.lesson && !!st.practice && !st.boss,
      onClick: onStartTopicTest,
    },
  ];

  const subtitle = nerdc
    ? `${SUBJECT_INFO[progress.subj].short} · ${nerdc.classId.toUpperCase().replace('SS', 'SS ')} · ${nerdc.termLabel}`
    : `${SUBJECT_INFO[progress.subj].short} · ${topic.sec}`;

  const primaryGoals = topic.goals.slice(0, 3);
  const extraGoals = topic.goals.slice(3);

  return (
    <div className="max-w-[760px] mx-auto flex flex-col gap-3.5 anim-rise">
      <SubscreenTopBar title={topic.name} subtitle={subtitle} onBack={onBack} />

      {/* Calm Topic Summary & Bite-Sized Objectives */}
      <section className="rtc-card rounded-2xl p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center gap-4">
        <RingGauge value={score} size={78} stroke={7} onDark={false} label={`${topic.name} mastery`} />
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap text-[12px] font-bold">
            <span className={st.boss ? 'text-[var(--green)] font-extrabold' : 'text-[var(--gold)] font-extrabold'}>
              {status}
            </span>
            <span aria-hidden="true" className="text-[var(--dim)]">·</span>
            <span className="text-[var(--dim)]">3 short steps (~14 min total)</span>
          </div>

          {topic.goals.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-[11.5px] font-bold text-[var(--ink)]">
                What you’ll be able to do:
              </span>
              <ul className="text-[13.5px] text-[var(--dim)] space-y-1">
                {primaryGoals.map((g, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Icon name="check" size={14} className="text-[var(--green)] shrink-0 mt-0.5" />
                    <span dangerouslySetInnerHTML={{ __html: typesetMathHtml(g, progress.subj) }} />
                  </li>
                ))}
              </ul>
              {extraGoals.length > 0 && (
                <>
                  <SmoothCollapse open={showAllGoals}>
                    <ul className="text-[13.5px] text-[var(--dim)] space-y-1 pt-1">
                      {extraGoals.map((g, i) => (
                        <li key={i + 3} className="flex items-start gap-2">
                          <Icon name="check" size={14} className="text-[var(--green)] shrink-0 mt-0.5" />
                          <span dangerouslySetInnerHTML={{ __html: typesetMathHtml(g, progress.subj) }} />
                        </li>
                      ))}
                    </ul>
                  </SmoothCollapse>
                  <button
                    type="button"
                    aria-expanded={showAllGoals}
                    onClick={() => setShowAllGoals((v) => !v)}
                    className="self-start text-[11.5px] font-bold text-[var(--gold)] hover:underline cursor-pointer pt-0.5 whitespace-nowrap"
                  >
                    {showAllGoals
                      ? 'Show fewer objectives'
                      : `+ ${extraGoals.length} more learning objectives`}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Topic Voice Briefing & Live Coach */}
      <ChemMadScientistBar
        mode={subjectToLiveCoachMode(progress.subj)}
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
      <div className="stagger-grid flex flex-col gap-2.5">
        {stages.map((stg) => (
          <div
            key={stg.num}
            className={`study-card rounded-xl border px-3.5 py-3 sm:px-4 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              stg.done
                ? 'bg-[var(--ok-soft)]/50 border-[var(--ok-line)]'
                : stg.primary
                  ? 'rtc-card border-[var(--gold)] ring-1 ring-[var(--gold)]/20 bg-gradient-to-r from-[var(--acc-soft)]/30 via-[var(--card)] to-[var(--card)]'
                  : 'rtc-card'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`ul-icon-box w-8 h-8 rounded-lg font-[var(--display)] font-extrabold text-[14px] flex items-center justify-center shrink-0 ${
                  stg.done
                    ? 'bg-[var(--green)] text-white'
                    : stg.primary
                      ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                      : 'bg-[var(--acc-soft)] text-[var(--gold)]'
                }`}
              >
                {stg.done ? <Icon name="check" size={16} /> : stg.num}
              </span>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="h18 text-[var(--ink)]">
                    {stg.title}
                  </h2>
                  <span className="text-[11.5px] font-bold text-[var(--gold)]">
                    · {stg.time}
                  </span>
                </div>
                <p className="text-[13px] text-[var(--dim)] mt-0.5 leading-snug">{stg.desc}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={stg.onClick}
              className={`btn-tactile shrink-0 whitespace-nowrap ${stg.primary ? 'indigo' : 'paper'}`}
            >
              <span>{stg.cta}</span>
              <Icon name="go" size={16} className="ul-arrow" />
            </button>
          </div>
        ))}
      </div>

      {/* Focused Chapter-by-Chapter Study Notes + One-minute recap */}
      <div className="study-card rtc-card rounded-xl px-3.5 py-3 sm:px-4 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="ul-icon-box w-9 h-9 rounded-lg bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[var(--gold)] flex items-center justify-center shrink-0">
            <Icon name="book" size={17} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-[var(--gold)]">
              <span>Chapter notes and one-minute recap</span>
              <span aria-hidden="true" className="text-[var(--dim)]">·</span>
              <span className="text-[var(--dim)] tabular-nums">
                {topic.parts.length ? Math.round((readChapters / topic.parts.length) * 100) : 0}% read (~2m per chapter)
              </span>
            </div>
            <h2 className="h18 text-[var(--ink)] mt-0.5">
              One calm chapter at a time, with voice reading
            </h2>
            <div className="max-w-[200px] pt-1.5">
              <SmoothProgressBar
                value={readChapters}
                max={Math.max(1, topic.parts.length)}
                tone="emerald"
              />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenNotes}
          className="btn-tactile paper shrink-0 whitespace-nowrap"
        >
          <Icon name="book" size={16} />
          <span>{readChapters > 0 ? 'Continue notes' : 'Read notes'}</span>
        </button>
      </div>

      {/* Linked Practical / Construction Lab */}
      {linkedLab && (
        <button
          type="button"
          onClick={() => onOpenLab(linkedLab.id)}
          className="study-card rtc-eq-plate w-full text-left rounded-xl text-white px-3.5 py-3 sm:px-4 sm:py-3.5 flex items-center justify-between gap-3 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="ul-icon-box w-9 h-9 rounded-lg bg-white/15 border border-white/25 text-white flex items-center justify-center shrink-0">
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
              <span className="text-[11.5px] font-bold text-white/85">
                Virtual lab
              </span>
              <div className="font-[var(--display)] font-bold text-[16px] text-white">{linkedLab.name}</div>
              <div
                className="text-[13px] text-white/85"
                dangerouslySetInnerHTML={{ __html: typesetMathHtml(linkedLab.blurb, progress.subj) }}
              />
            </div>
          </div>
          <Icon name="go" size={18} className="text-white shrink-0 ul-arrow" />
        </button>
      )}

      {/* Linked Topic Formulas / English Rules */}
      {hasFormulaSheet(progress.subj) && topicFormulas.length > 0 && onOpenFormulas && (
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
                {isEng ? 'Grammar rules' : 'Formulas'} · {topicFormulas.length}
              </span>
              <div className="font-[var(--display)] font-bold text-[16px] text-[var(--ink)]">
                Practise {topic.name} {isEng ? 'rules' : 'formulas'}
              </div>
              <div className="text-[13px] text-[var(--dim)] truncate">
                {topicFormulas.map((f) => f.name).join(' · ')}
              </div>
            </div>
          </div>
          <Icon name="go" size={18} className="text-[var(--gold)] shrink-0 ul-arrow" />
        </button>
      )}

      {/* Exam Track Strategy & Common Mistake Callout */}
      {drillCfg.isToughJamb && (
        <div className="rtc-card rounded-2xl p-4 flex items-start gap-3">
          <span className="w-8 h-8 rounded-xl bg-[var(--acc-soft)] border border-[var(--acc-line)] text-[var(--gold)] flex items-center justify-center shrink-0">
            <Icon name="target" size={16} />
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="eyebrow text-[var(--gold)]">
              {examTrack === 'both'
                ? '70% JAMB Core · Tough UTME Drill'
                : 'Tough JAMB Syllabus Condition'}
            </span>
            <p className="text-[13.5px] text-[var(--dim)] leading-relaxed">
              Questions start at higher difficulty, Topic Test requires{' '}
              <strong className="text-[var(--ink)] tabular-nums">6/7 in 3:30</strong>, and options A–D
              test deep conceptual differences between look-alike answers so your real UTME score
              exceeds your mock score.
            </p>
          </div>
        </div>
      )}

      {waecGuidance && (
        <div className="rounded-2xl bg-[var(--warn-soft)] border border-[var(--warn-line)] p-4 flex flex-col gap-2.5">
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-xl bg-[var(--card)] border border-[var(--warn-line)] text-[var(--warn-ink)] flex items-center justify-center shrink-0">
              <Icon name="bolt" size={16} />
            </span>
            <div className="flex-1 min-w-0">
              <span className="eyebrow text-[var(--warn-ink)]">
                {examTrack === 'both'
                  ? '30% WAEC Paper 1 & 2 · Common Mistakes to Avoid'
                  : 'How WAEC Marks This & Mistakes to Avoid'}
              </span>
              <p className="text-[13.5px] text-[var(--ink)] font-semibold mt-0.5 leading-snug">
                {waecGuidance.examFormatLine}
              </p>
            </div>
          </div>
          <ul className="text-[13.5px] text-[var(--ink)] space-y-1.5 pl-1">
            {waecGuidance.mistakesToAvoid.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <Icon name="x" size={13} className="text-[var(--warn-ink)] shrink-0 mt-1" />
                <span dangerouslySetInnerHTML={{ __html: typesetMathHtml(item, progress.subj) }} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {!waecGuidance && (
        <div className="rounded-2xl bg-[var(--warn-soft)] border border-[var(--warn-line)] p-4 flex items-start gap-3">
          <span className="w-8 h-8 rounded-xl bg-[var(--card)] border border-[var(--warn-line)] text-[var(--warn-ink)] flex items-center justify-center shrink-0">
            <Icon name="bolt" size={16} />
          </span>
          <div>
            <span className="eyebrow text-[var(--warn-ink)]">JAMB look-alike trap to watch</span>
            <p
              className="text-[14px] text-[var(--ink)] mt-0.5 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: typesetMathHtml(topic.trap, progress.subj) }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
