import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { SubjectId } from '../types';
import type { ChemLessonVoiceContext } from '../utils/chemVoiceLogic';

export type LiveCoachMode = SubjectId | 'math' | 'fmath';

export function subjectToLiveCoachMode(subj: SubjectId): LiveCoachMode {
  if (subj === 'maths') return 'math';
  if (subj === 'fmaths') return 'fmath';
  return subj;
}

export function liveCoachModeToSubjectId(mode: LiveCoachMode | 'mathLab'): SubjectId {
  if (mode === 'math' || mode === 'mathLab') return 'maths';
  if (mode === 'fmath') return 'fmaths';
  return mode;
}

export interface ActiveLiveContextEntry {
  stepKey: string;
  mode: LiveCoachMode;
  context: ChemLessonVoiceContext;
}

interface LiveCoachRegistryValue {
  activeEntry: ActiveLiveContextEntry;
  registerOverride: (id: string, entry: ActiveLiveContextEntry) => void;
  unregisterOverride: (id: string) => void;
}

const DEFAULT_ENTRY: ActiveLiveContextEntry = {
  stepKey: 'global-home',
  mode: 'eng',
  context: {
    topicName: 'Easy Learn Studio',
    partTitle: 'Nigerian JAMB and WAEC Learning',
    stepLabel: 'Overview',
    stepText: 'Ask any question across all 49 JAMB UTME and WAEC/NECO subjects aloud.',
  },
};

const LiveCoachRegistryContext = createContext<LiveCoachRegistryValue>({
  activeEntry: DEFAULT_ENTRY,
  registerOverride: () => {},
  unregisterOverride: () => {},
});

export function LiveCoachProvider({
  fallbackEntry,
  children,
}: {
  fallbackEntry: ActiveLiveContextEntry;
  children: React.ReactNode;
}) {
  const [overrides, setOverrides] = useState<{ id: string; entry: ActiveLiveContextEntry }[]>([]);

  const registerOverride = useCallback((id: string, entry: ActiveLiveContextEntry) => {
    setOverrides((prev) => {
      const idx = prev.findIndex((item) => item.id === id);
      if (idx >= 0) {
        const cur = prev[idx].entry;
        if (
          cur.stepKey === entry.stepKey &&
          cur.mode === entry.mode &&
          cur.context.topicName === entry.context.topicName &&
          cur.context.partTitle === entry.context.partTitle &&
          cur.context.stepLabel === entry.context.stepLabel &&
          cur.context.stepText === entry.context.stepText
        ) {
          return prev;
        }
        const next = [...prev];
        next[idx] = { id, entry };
        return next;
      }
      return [...prev, { id, entry }];
    });
  }, []);

  const unregisterOverride = useCallback((id: string) => {
    setOverrides((prev) => (prev.some((item) => item.id === id) ? prev.filter((item) => item.id !== id) : prev));
  }, []);

  const activeEntry = overrides.length > 0 ? overrides[overrides.length - 1].entry : fallbackEntry;

  const value = useMemo(
    () => ({
      activeEntry,
      registerOverride,
      unregisterOverride,
    }),
    [activeEntry, registerOverride, unregisterOverride]
  );

  return (
    <LiveCoachRegistryContext.Provider value={value}>
      {children}
    </LiveCoachRegistryContext.Provider>
  );
}

export function useActiveLiveCoachEntry(): ActiveLiveContextEntry {
  return useContext(LiveCoachRegistryContext).activeEntry;
}

/**
 * Automatically syncs the currently mounted study screen's exact step/chapter/formula context
 * to the global Floating Live Coach so live conversations always match what's on screen.
 */
export function useSyncLiveCoachContext(
  stepKey: string,
  context: ChemLessonVoiceContext,
  mode: LiveCoachMode
) {
  const { registerOverride, unregisterOverride } = useContext(LiveCoachRegistryContext);
  const instanceId = React.useId();

  useEffect(() => {
    registerOverride(instanceId, {
      stepKey,
      mode,
      context,
    });
  }, [
    instanceId,
    mode,
    registerOverride,
    stepKey,
    context.topicName,
    context.partTitle,
    context.stepLabel,
    context.stepText,
    context,
  ]);

  useEffect(() => {
    return () => {
      unregisterOverride(instanceId);
    };
  }, [instanceId, unregisterOverride]);
}
