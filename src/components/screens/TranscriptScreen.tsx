import React, { useMemo, useState } from 'react';
import type { SubjectId, UserProgress } from '../../types';
import { SUBJECT_IDS, getTopics } from '../../data/curriculum';
import { CHEM_FORMULAS } from '../../data/chemFormulas';
import { MATH_FORMULAS } from '../../data/mathFormulas';
import { FMATH_FORMULAS } from '../../data/fmathFormulas';
import { PHYS_FORMULAS } from '../../data/physFormulas';
import { GEOG_FORMULAS } from '../../data/geogFormulas';
import { ECON_FORMULAS } from '../../data/econFormulas';
import { ENG_FORMULAS } from '../../data/engFormulas';
import { DIGITECH_FORMULAS } from '../../data/digitechFormulas';
import { DATAPROC_FORMULAS } from '../../data/dataprocFormulas';
import { SUBJECT_INFO, mpct, tstate } from '../../utils/engine';
import { waecGradeFromPct } from '../../utils/cbtEngine';
import { summarizeMistakeVault } from '../../utils/mistakeVaultLogic';
import { typesetMathHtml } from '../../utils/mathTypesetter';
import {
  buildFormulaSheetPdf,
  buildStudentReportCardPdf,
  downloadPdfBytes,
} from '../../utils/pdfExport';
import { SubscreenTopBar } from '../AppShell';
import { CrestSvg, Icon } from '../Icons';

type FormulaSubjId = 'maths' | 'fmaths' | 'chem' | 'phys' | 'geog' | 'econ' | 'eng' | 'digitech' | 'dataproc';

interface CheatSheetFormulaItem {
  id: string;
  name: string;
  summary: string;
  rearrangements: { exprHtml: string }[];
  trap: string;
}

const CHEAT_SHEET_SUBJECTS: { id: FormulaSubjId; label: string; items: CheatSheetFormulaItem[] }[] = [
  { id: 'maths', label: 'Mathematics', items: MATH_FORMULAS },
  { id: 'fmaths', label: 'Further Maths', items: FMATH_FORMULAS },
  { id: 'chem', label: 'Chemistry', items: CHEM_FORMULAS },
  { id: 'phys', label: 'Physics', items: PHYS_FORMULAS },
  { id: 'geog', label: 'Geography', items: GEOG_FORMULAS },
  { id: 'econ', label: 'Economics', items: ECON_FORMULAS },
  { id: 'eng', label: 'English Rules', items: ENG_FORMULAS },
  { id: 'digitech', label: 'Digital Tech', items: DIGITECH_FORMULAS },
  { id: 'dataproc', label: 'Data Processing', items: DATAPROC_FORMULAS },
];

export function TranscriptScreen({
  progress,
  onBack,
}: {
  progress: UserProgress;
  onBack: () => void;
}) {
  const [viewMode, setViewMode] = useState<'transcript' | 'cheatsheet'>('transcript');
  const [cheatSubj, setCheatSubj] = useState<FormulaSubjId>(() => {
    const found = CHEAT_SHEET_SUBJECTS.find((s) => s.id === progress.subj);
    return found ? found.id : 'maths';
  });

  const facultyRows = useMemo(() => {
    return SUBJECT_IDS.map((sid) => {
      const topics = getTopics(sid);
      const passed = topics.filter((t) => tstate(progress, t.id).boss).length;
      const lessonsDone = topics.filter((t) => tstate(progress, t.id).lesson).length;
      const avgMastery = topics.length
        ? Math.round(topics.reduce((s, t) => s + mpct(progress, t.id), 0) / topics.length)
        : 0;
      return {
        sid,
        name: SUBJECT_INFO[sid].name,
        totalTopics: topics.length,
        passed,
        lessonsDone,
        avgMastery,
        waec: waecGradeFromPct(avgMastery),
      };
    });
  }, [progress]);

  const overallAvg = useMemo(() => {
    const enrolled = facultyRows.filter((r) => progress.subjs.includes(r.sid));
    const list = enrolled.length ? enrolled : facultyRows;
    return Math.round(list.reduce((s, r) => s + r.avgMastery, 0) / Math.max(1, list.length));
  }, [facultyRows, progress.subjs]);

  const predictedUtme = Math.round((overallAvg / 100) * 400);
  const totalAns = progress.hist.length;
  const rightAns = progress.hist.filter((h) => h[1] === 1).length;
  const accuracyPct = totalAns ? Math.round((rightAns / totalAns) * 100) : 0;
  const mistakeSummary = useMemo(() => summarizeMistakeVault(progress.mistakes || {}), [progress.mistakes]);
  const cbtCount = progress.cbtHistory?.length || 0;
  const bestCbt = useMemo(() => {
    const jambRuns = (progress.cbtHistory || []).filter((c) => c.mode === 'jamb');
    if (!jambRuns.length) return null;
    return Math.max(...jambRuns.map((c) => c.scaledScore));
  }, [progress.cbtHistory]);

  const [pdfSavedFlash, setPdfSavedFlash] = useState(false);

  const activeSheet = CHEAT_SHEET_SUBJECTS.find((s) => s.id === cheatSubj) || CHEAT_SHEET_SUBJECTS[0];
  const issuedDate = new Date().toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Lagos',
  });

  const handleDownloadPdf = () => {
    if (viewMode === 'transcript') {
      const pdfBytes = buildStudentReportCardPdf({
        studentName: progress.name || 'Student',
        issuedDate,
        predictedUtme,
        overallAvg,
        overallWaec: waecGradeFromPct(overallAvg),
        targetPct: progress.target || 75,
        accuracyPct,
        totalAnswered: totalAns,
        bestCbt,
        cbtCount,
        mistakesCount: mistakeSummary.total,
        streakDays: progress.streak.n,
        enrolledCount: progress.subjs.length,
        rows: facultyRows.map((r) => ({
          name: r.name,
          lessonsDone: r.lessonsDone,
          totalTopics: r.totalTopics,
          passed: r.passed,
          avgMastery: r.avgMastery,
          waec: r.waec,
        })),
      });
      downloadPdfBytes(pdfBytes, `Easy-Learn-Report-Card-${progress.name || 'Student'}.pdf`);
    } else {
      const pdfBytes = buildFormulaSheetPdf({
        subjectLabel: activeSheet.label,
        itemNounPlural: activeSheet.id === 'eng' ? 'rules' : 'formulas',
        issuedDate,
        items: activeSheet.items.map((f) => ({
          name: f.name,
          expressionHtml: f.rearrangements[0]?.exprHtml || f.summary,
          trapHtml: f.trap,
        })),
      });
      downloadPdfBytes(pdfBytes, `Easy-Learn-${activeSheet.label}-Formulas-Sheet.pdf`);
    }
    setPdfSavedFlash(true);
    window.setTimeout(() => setPdfSavedFlash(false), 2600);
  };

  return (
    <div className="flex flex-col gap-5 anim-rise">
      <div className="no-print flex flex-col gap-4">
        <SubscreenTopBar
          title="Report card"
          subtitle="Progress summary for parents and teachers, plus printable formula sheets"
          onBack={onBack}
          right={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="btn-tactile indigo min-h-[38px] px-3.5 sm:px-4 text-[13px] whitespace-nowrap"
              >
                <Icon name={pdfSavedFlash ? 'check' : 'download'} size={15} />
                <span>{pdfSavedFlash ? 'PDF downloaded' : 'Download PDF'}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                aria-label="Print report card"
                className="btn-tactile paper min-h-[38px] px-3 text-[12.5px] whitespace-nowrap hidden sm:inline-flex"
              >
                <Icon name="printer" size={15} />
                <span>Print</span>
              </button>
            </div>
          }
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex p-1 rounded-xl bg-[var(--card)] border border-[var(--line)]">
            <button
              type="button"
              onClick={() => setViewMode('transcript')}
              className={`px-4 py-2 rounded-lg text-[13px] font-bold cursor-pointer transition ${
                viewMode === 'transcript'
                  ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                  : 'text-[var(--dim)] hover:text-[var(--ink)]'
              }`}
            >
              Report card
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cheatsheet')}
              className={`px-4 py-2 rounded-lg text-[13px] font-bold cursor-pointer transition ${
                viewMode === 'cheatsheet'
                  ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                  : 'text-[var(--dim)] hover:text-[var(--ink)]'
              }`}
            >
              Printable formula sheets
            </button>
          </div>

          {viewMode === 'cheatsheet' && (
            <div className="flex flex-wrap gap-1.5">
              {CHEAT_SHEET_SUBJECTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCheatSubj(s.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[12px] font-bold border cursor-pointer ${
                    cheatSubj === s.id
                      ? 'bg-[var(--acc-soft)] border-[var(--gold)] text-[var(--ink)]'
                      : 'bg-[var(--card)] border-[var(--line)] text-[var(--dim)]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════ REPORT CARD VIEW ═══════════════════ */}
      {viewMode === 'transcript' && (
        <article className="rtc-card print-sheet rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--line)]">
            <div className="flex items-center gap-3.5">
              <CrestSvg size={46} />
              <div>
                <div className="eyebrow text-[var(--gold)]">Easy Learn · Progress report</div>
                <h1 className="h26 text-[var(--ink)]">Student report card</h1>
                <div className="text-[13px] text-[var(--dim)]">
                  Student: <strong className="text-[var(--ink)]">{progress.name || 'Student'}</strong> · {issuedDate}
                </div>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-[11.5px] font-bold text-[var(--dim)]">Estimated JAMB score</div>
              <div className="font-[var(--display)] font-bold text-[28px] text-[var(--gold)] tabular-nums leading-tight">
                {predictedUtme} / 400
              </div>
              <div className="text-[12px] font-bold text-[var(--green)]">
                WAEC grade: {waecGradeFromPct(overallAvg)}
              </div>
            </div>
          </header>

          {/* Key Performance KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="tile-mint rounded-2xl p-3.5">
              <div className="text-[11.5px] font-bold opacity-80">Average score</div>
              <div className="font-[var(--display)] font-bold text-[22px] tabular-nums">
                {overallAvg}%
              </div>
              <div className="text-[11px] opacity-80">Target: {progress.target}%</div>
            </div>
            <div className="tile-sky rounded-2xl p-3.5">
              <div className="text-[11.5px] font-bold opacity-80">Accuracy</div>
              <div className="font-[var(--display)] font-bold text-[22px] tabular-nums">
                {accuracyPct}%
              </div>
              <div className="text-[11px] opacity-80">{totalAns} answered</div>
            </div>
            <div className="tile-peach rounded-2xl p-3.5">
              <div className="text-[11.5px] font-bold opacity-80">Mock exams</div>
              <div className="font-[var(--display)] font-bold text-[22px] tabular-nums">
                {bestCbt !== null ? `${bestCbt}/400` : `${cbtCount} taken`}
              </div>
              <div className="text-[11px] opacity-80">{cbtCount} timed papers</div>
            </div>
            <div className="rounded-2xl bg-[var(--acc-soft)] border border-[var(--acc-line)] p-3.5 text-[var(--ink)]">
              <div className="text-[11.5px] font-bold text-[var(--dim)]">Mistakes to fix</div>
              <div className="font-[var(--display)] font-bold text-[22px] tabular-nums">
                {mistakeSummary.total}
              </div>
              <div className="text-[11px] text-[var(--dim)]">
                {mistakeSummary.total === 0 ? 'All mistakes cleared' : 'Ready to practise'}
              </div>
            </div>
          </div>

          {/* Subject Mastery Table */}
          <div className="flex flex-col gap-2">
            <h2 className="h18 text-[var(--ink)]">Progress by subject</h2>
            <div className="tw">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Lessons</th>
                    <th>Topics passed</th>
                    <th>Score</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyRows.map((row) => (
                    <tr key={row.sid}>
                      <td>{row.name}</td>
                      <td className="mono">
                        {row.lessonsDone}/{row.totalTopics}
                      </td>
                      <td className="mono">
                        {row.passed}/{row.totalTopics}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 rounded-full bg-[var(--deep)] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[var(--gold)]"
                              style={{ width: `${row.avgMastery}%` }}
                            />
                          </div>
                          <span className="mono font-bold">{row.avgMastery}%</span>
                        </div>
                      </td>
                      <td className="font-bold text-[var(--gold)]">{row.waec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <footer className="pt-4 border-t border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px] text-[var(--dim)]">
            <span>
              Study streak: <strong className="text-[var(--ink)]">{progress.streak.n} days</strong> · Subjects:{' '}
              <strong className="text-[var(--ink)]">{progress.subjs.length}</strong>
            </span>
            <span>Prepared on Easy Learn</span>
          </footer>
        </article>
      )}

      {/* ═══════════════════ PRINTABLE 1-PAGE CHEAT SHEET ═══════════════════ */}
      {viewMode === 'cheatsheet' && (
        <article className="rtc-card print-sheet rounded-2xl p-6 flex flex-col gap-4">
          <header className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
            <div>
              <div className="eyebrow text-[var(--gold)]">Easy Learn · Quick revision sheet</div>
              <h1 className="h24 text-[var(--ink)] font-[var(--display)] font-bold text-[22px]">
                {activeSheet.label} — formulas and traps ({activeSheet.items.length} items)
              </h1>
            </div>
            <span className="text-[12px] font-bold text-[var(--dim)]">JAMB and WAEC</span>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeSheet.items.map((f, idx) => (
              <div
                key={f.id}
                className="rounded-xl border border-[var(--line)] bg-[var(--bg)]/50 p-3 flex flex-col gap-1 break-inside-avoid"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-[var(--display)] font-bold text-[13.5px] text-[var(--ink)]">
                    {idx + 1}. {f.name}
                  </span>
                </div>
                <div
                  className="text-[14px] font-bold text-[var(--gold)] py-0.5"
                  dangerouslySetInnerHTML={{
                    __html: typesetMathHtml(f.rearrangements[0]?.exprHtml || f.summary, cheatSubj as SubjectId),
                  }}
                />
                <div className="text-[11.5px] text-[var(--dim)] leading-snug">
                  <strong>Trap:</strong>{' '}
                  <span dangerouslySetInnerHTML={{ __html: typesetMathHtml(f.trap, cheatSubj as SubjectId) }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      )}
    </div>
  );
}
