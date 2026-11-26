import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { SubjectId, UserProgress } from '../types';
import { SUBJECT_IDS, getTopics } from '../data/curriculum';
import { getLabsForSubject } from '../data/labs';
import { JAMB_WAEC_NOVELS } from '../data/jambWaecNovels';
import { CORE_UNIVERSE_WORLDS } from '../data/learningUniverseWorlds';
import { SUBJECT_INFO } from '../utils/engine';
import {
  searchGlobalCatalog,
  type GlobalCatalogFilter,
  type GlobalCatalogItem,
  type GlobalCatalogRouteAction,
} from '../utils/platformUpgradesLogic';
import { Icon } from './Icons';

const LAB_SUBJECTS: readonly SubjectId[] = ['chem', 'phys', 'bio', 'agric', 'maths'];

const FILTER_TABS: { id: GlobalCatalogFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'topic', label: 'Topics' },
  { id: 'world', label: 'Worlds' },
  { id: 'lab', label: 'Labs' },
  { id: 'novel', label: 'Novels' },
  { id: 'tool', label: 'Workspaces' },
];

const CATEGORY_LABEL: Record<GlobalCatalogItem['category'], string> = {
  topic: 'Topic',
  world: 'World',
  lab: 'Lab',
  novel: 'Set Novel',
  tool: 'Workspace',
};

function buildFullPlatformCatalog(progress: UserProgress): GlobalCatalogItem[] {
  const items: GlobalCatalogItem[] = [];
  const activeSubj = progress.subj;
  const enrolledSet = new Set<SubjectId>(progress.subjs);

  // 1. Flagship 3D Adventure & Core Workspaces
  items.push(
    {
      id: 'world-3d-heart',
      category: 'world',
      title: 'Voyage Through the 3D Living Heart',
      subtitle: 'Biology Interactive 3D Expedition · Chambers, valves & lung alveoli',
      keywords: 'circulatory system blood heart aorta vena cava pulmonary lungs 3d',
      icon: 'dna',
      priority: 108,
      action: { kind: 'heart-3d', subj: 'bio' },
    },
    {
      id: 'tool-cbt-arena',
      category: 'tool',
      title: 'Exam Arena (JAMB & WAEC Mock CBT)',
      subtitle: 'Timed 4-subject UTME simulator & Saturday National CBT',
      keywords: 'cbt mock exam hall jamb utme waec timer practice test',
      icon: 'clock',
      priority: 104,
      action: { kind: 'screen', screen: 'cbt' },
    },
    {
      id: 'tool-mistakes',
      category: 'tool',
      title: 'Mistakes to Fix',
      subtitle: 'Spaced redemption vault for missed exam questions',
      keywords: 'mistake vault wrong answers review revise errors',
      icon: 'target',
      priority: 98,
      action: { kind: 'screen', screen: 'mistakes' },
    },
    {
      id: 'tool-theory',
      category: 'tool',
      title: 'Theory Answers & Marking Guides',
      subtitle: 'WAEC & NECO structured essay grading rubrics',
      keywords: 'theory essay paper 2 marking scheme written answers',
      icon: 'pen',
      priority: 94,
      action: { kind: 'screen', screen: 'theory' },
    },
    {
      id: 'tool-duel',
      category: 'tool',
      title: 'Classmate Duels',
      subtitle: '10-question head-to-head speed & accuracy challenge',
      keywords: 'duel multiplayer challenge friend race quiz',
      icon: 'trophy',
      priority: 92,
      action: { kind: 'screen', screen: 'duel' },
    },
    {
      id: 'tool-sandboxes',
      category: 'tool',
      title: 'Interactive Science & Math Sandboxes',
      subtitle: 'Live graphing, logic gates, optics & circuit explorers',
      keywords: 'sandbox interactive graph simulator tools',
      icon: 'cpu',
      priority: 90,
      action: { kind: 'screen', screen: 'sandboxes' },
    },
    {
      id: 'tool-planner',
      category: 'tool',
      title: 'Exam Study Planner',
      subtitle: 'Daily timetable & countdown to your UTME / WASSCE date',
      keywords: 'study plan timetable calendar schedule countdown',
      icon: 'calendar',
      priority: 88,
      action: { kind: 'screen', screen: 'planner' },
    },
    {
      id: 'tool-leaderboard',
      category: 'tool',
      title: 'National Scholars Leaderboard',
      subtitle: 'Campus target standings & weekly scholar ranks',
      keywords: 'leaderboard rank standings unilag ui oau unn',
      icon: 'crown',
      priority: 86,
      action: { kind: 'screen', screen: 'leaderboard' },
    },
    {
      id: 'tool-formulas',
      category: 'tool',
      title: 'Formula & Grammar Rules Studio',
      subtitle: 'Core equations, unit traps, concord & stress drills',
      keywords: 'formulas equations grammar concord rules sheet',
      icon: 'sigma',
      priority: 85,
      action: { kind: 'formulas', subj: activeSubj },
    }
  );

  // 2. All 8 Prescribed JAMB & WAEC Set Novels
  for (const novel of JAMB_WAEC_NOVELS) {
    items.push({
      id: `novel-${novel.id}`,
      category: 'novel',
      title: novel.title,
      subtitle: `${novel.examBodies.join(' / ')} Set Novel · ${novel.author}`,
      keywords: `${novel.statusLabel} ${novel.setting} literature english prose novel`,
      icon: 'book',
      priority: novel.id === 'lekki-headmaster' ? 102 : 84,
      action: { kind: 'novel', subj: novel.subjectId, novelId: novel.id },
    });
  }

  // 3. Practical Virtual Labs across Chemistry, Physics, Biology, Agric & Maths
  for (const sid of LAB_SUBJECTS) {
    const labs = getLabsForSubject(sid);
    const sInfo = SUBJECT_INFO[sid];
    for (const lab of labs) {
      items.push({
        id: `lab-${sid}-${lab.id}`,
        category: 'lab',
        title: lab.name,
        subtitle: `${sInfo.name} Practical Lab · ${lab.blurb}`,
        keywords: `${sInfo.name} ${sInfo.short} practical experiment virtual lab ${lab.cat || ''}`,
        icon: 'flask',
        priority: sid === activeSubj ? 91 : enrolledSet.has(sid) ? 80 : 70,
        action: { kind: 'lab', subj: sid, labId: lab.id },
      });
    }
  }

  // 4. Subject Learning Worlds & All 49 Subject Syllabus Topics
  for (const sid of SUBJECT_IDS) {
    const sInfo = SUBJECT_INFO[sid];
    const bespokeWorld = CORE_UNIVERSE_WORLDS[sid];
    const isCurrent = sid === activeSubj;
    const isEnrolled = enrolledSet.has(sid);

    items.push({
      id: `world-${sid}`,
      category: 'world',
      title: bespokeWorld ? `${bespokeWorld.worldTitle} (${sInfo.name})` : `${sInfo.name} Learning World`,
      subtitle: bespokeWorld
        ? `Guide: ${bespokeWorld.companionName} · ${bespokeWorld.heroMissionHeadline}`
        : `Interactive 4-stage missions & world boss for ${sInfo.name}`,
      keywords: `${sInfo.name} ${sInfo.short} learning world adventure mission ${bespokeWorld?.companionName || ''}`,
      icon: bespokeWorld?.icon || sInfo.icon,
      priority: bespokeWorld ? (isCurrent ? 100 : 89) : isEnrolled ? 76 : 62,
      action: { kind: 'world', subj: sid },
    });

    const topics = getTopics(sid);
    for (const t of topics) {
      items.push({
        id: `topic-${sid}-${t.id}`,
        category: 'topic',
        title: t.name,
        subtitle: `${sInfo.name} · ${t.sec}`,
        keywords: `${sInfo.name} ${sInfo.short} ${t.sec} ${t.goals?.[0] || ''} syllabus topic notes practice`,
        icon: sInfo.icon,
        priority: isCurrent ? 93 : isEnrolled ? 78 : 64,
        action: { kind: 'topic', subj: sid, topicId: t.id },
      });
    }
  }

  return items;
}

export function CommandPaletteModal({
  open,
  progress,
  onClose,
  onExecuteAction,
}: {
  open: boolean;
  progress: UserProgress;
  onClose: () => void;
  onExecuteAction: (action: GlobalCatalogRouteAction) => void;
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<GlobalCatalogFilter>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const catalog = useMemo(() => {
    if (!open) return [];
    return buildFullPlatformCatalog(progress);
  }, [open, progress]);

  const results = useMemo(
    () => searchGlobalCatalog(catalog, query, filter, 16),
    [catalog, query, filter]
  );

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setFilter('all');
    setActiveIndex(0);
    const id = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 20);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, filter]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) =>
          results.length > 0 ? (prev - 1 + results.length) % results.length : 0
        );
        return;
      }
      if (e.key === 'Enter' && results[activeIndex]) {
        e.preventDefault();
        const picked = results[activeIndex];
        onClose();
        onExecuteAction(picked.action);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, onClose, onExecuteAction, open, results]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-xs flex items-start justify-center px-3 sm:px-6 pt-12 sm:pt-20 pb-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Quick search across subjects, topics, worlds, labs, and novels"
        className="w-full max-w-[660px] rounded-2xl bg-[var(--card)] text-[var(--ink)] border border-[var(--line)] shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
      >
        {/* Search Input Header */}
        <div className="px-4 py-3.5 border-b border-[var(--line)] flex items-center gap-3">
          <Icon name="search" size={18} className="text-[var(--gold)] shrink-0" />
          <label htmlFor="rtc-global-command-input" className="sr-only">
            Search topics, learning worlds, practical labs, novels, and workspaces
          </label>
          <input
            ref={inputRef}
            id="rtc-global-command-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to any topic, world, practical lab, set novel, or tool..."
            autoComplete="off"
            className="flex-1 min-w-0 bg-transparent text-[15px] font-medium text-[var(--ink)] placeholder:text-[var(--dim)] outline-none focus:outline-none focus-visible:outline-none border-0 ring-0"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search text"
              className="p-1.5 rounded-lg text-[var(--dim)] hover:text-[var(--ink)] hover:bg-[var(--bg)] cursor-pointer shrink-0"
            >
              <Icon name="x" size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quick search"
            className="min-h-[32px] px-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[12px] font-bold text-[var(--dim)] hover:text-[var(--ink)] cursor-pointer shrink-0 whitespace-nowrap"
          >
            Esc
          </button>
        </div>

        {/* Category Filter Bar */}
        <div
          role="tablist"
          aria-label="Filter search results by type"
          className="px-4 py-2 border-b border-[var(--line)] bg-[var(--bg)]/60 flex items-center gap-1.5 overflow-x-auto"
        >
          {FILTER_TABS.map((tab) => {
            const isSelected = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setFilter(tab.id)}
                className={`min-h-[32px] px-3 rounded-lg text-[12px] font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[var(--gold)] text-[var(--on-acc)]'
                    : 'text-[var(--dim)] hover:text-[var(--ink)] hover:bg-[var(--card)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Ranked Results List */}
        <div className="overflow-y-auto divide-y divide-[var(--line)] flex-1">
          {results.length === 0 ? (
            <div className="px-6 py-10 text-center flex flex-col items-center gap-2">
              <p className="text-[14.5px] font-semibold text-[var(--ink)]">
                No match found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-[12.5px] text-[var(--dim)] max-w-sm">
                Try searching by subject name (Biology, Economics), practical (Titration, Osmosis), or set novel (Lekki Headmaster).
              </p>
            </div>
          ) : (
            results.map((item, idx) => {
              const isHighlighted = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => {
                    onClose();
                    onExecuteAction(item.action);
                  }}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                    isHighlighted ? 'bg-[var(--acc-soft)]/70' : 'hover:bg-[var(--bg)]/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-[var(--gold)] flex items-center justify-center shrink-0">
                      <Icon name={item.icon} size={16} />
                    </span>
                    <div className="min-w-0">
                      <div className="font-[var(--display)] font-bold text-[14.5px] text-[var(--ink)] truncate">
                        {item.title}
                      </div>
                      <div className="text-[12px] text-[var(--dim)] truncate">
                        <span className="font-semibold text-[var(--gold)]">
                          {CATEGORY_LABEL[item.category]}
                        </span>
                        <span aria-hidden="true"> · </span>
                        <span>{item.subtitle}</span>
                      </div>
                    </div>
                  </div>
                  <Icon
                    name="go"
                    size={15}
                    className={`shrink-0 transition-transform ${
                      isHighlighted ? 'text-[var(--gold)] translate-x-0.5' : 'text-[var(--dim)]'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Quiet Keyboard Hint Footer */}
        <div className="px-4 py-2 border-t border-[var(--line)] bg-[var(--bg)]/50 flex items-center justify-between gap-2 text-[11.5px] text-[var(--dim)]">
          <span>49 subjects · Interactive worlds · Virtual labs · 8 set novels</span>
          <span className="hidden sm:inline tabular-nums">↑↓ navigate · Enter open · Esc close</span>
        </div>
      </div>
    </div>
  );
}
