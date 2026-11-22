import { useCallback, useEffect, useState } from 'react';
import type { SubjectId } from '../types';
import {
  QUESTION_BANK_SUBJECTS,
  computeQuestionHash,
  deduplicateBankQuestions,
  validateBankImportPayload,
  type BankExamType,
  type BankQuestion,
} from './questionBankLogic';

const DB_NAME = 'rtc_hybrid_question_bank_v1';
const DB_VERSION = 1;
const STORE_NAME = 'questions';
export const QBANK_CHANGED_EVENT = 'rtc:qbank-changed';

export type SubjectCountMap = Record<SubjectId, number>;

export function createEmptySubjectCounts(): SubjectCountMap {
  const counts = {} as SubjectCountMap;
  for (const cfg of QUESTION_BANK_SUBJECTS) {
    counts[cfg.id] = 0;
  }
  return counts;
}

let dbPromise: Promise<IDBDatabase> | null = null;

export function notifyQuestionBankChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(QBANK_CHANGED_EVENT));
  }
}

export function openQuestionBankDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not supported in this browser environment.'));
  }
  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      let store: IDBObjectStore;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      } else {
        store = req.transaction!.objectStore(STORE_NAME);
      }

      if (!store.indexNames.contains('subject')) {
        store.createIndex('subject', 'subject', { unique: false });
      }
      if (!store.indexNames.contains('examType')) {
        store.createIndex('examType', 'examType', { unique: false });
      }
      if (!store.indexNames.contains('topic')) {
        store.createIndex('topic', 'topic', { unique: false });
      }
      if (!store.indexNames.contains('normHash')) {
        store.createIndex('normHash', 'normHash', { unique: true });
      }
    };

    req.onsuccess = () => {
      const db = req.result;
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };

    req.onerror = () => {
      dbPromise = null;
      reject(req.error || new Error('Failed to open IndexedDB question bank.'));
    };
  });

  return dbPromise;
}

export async function getQuestionCountsBySubject(): Promise<SubjectCountMap> {
  const counts = createEmptySubjectCounts();
  if (typeof indexedDB === 'undefined') return counts;

  const db = await openQuestionBankDb();
  return new Promise<SubjectCountMap>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const subjIndex = store.index('subject');

    let remaining = QUESTION_BANK_SUBJECTS.length;
    for (const cfg of QUESTION_BANK_SUBJECTS) {
      const req = subjIndex.count(IDBKeyRange.only(cfg.id));
      req.onsuccess = () => {
        counts[cfg.id] = req.result || 0;
        remaining--;
        if (remaining === 0) resolve(counts);
      };
      req.onerror = () => {
        remaining--;
        if (remaining === 0) resolve(counts);
      };
    }

    tx.onerror = () => reject(tx.error || new Error('Failed to read subject counts from IndexedDB.'));
  });
}

export async function getExistingHashesForSubjects(subjects: SubjectId[]): Promise<Set<string>> {
  const hashes = new Set<string>();
  if (typeof indexedDB === 'undefined' || subjects.length === 0) return hashes;

  const db = await openQuestionBankDb();
  return new Promise<Set<string>>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const subjIndex = store.index('subject');

    let remaining = subjects.length;
    for (const sid of subjects) {
      const req = subjIndex.getAll(IDBKeyRange.only(sid));
      req.onsuccess = () => {
        const rows = (req.result || []) as BankQuestion[];
        for (const r of rows) {
          hashes.add(r.normHash || computeQuestionHash(r.subject, r.question));
        }
        remaining--;
        if (remaining === 0) resolve(hashes);
      };
      req.onerror = () => {
        remaining--;
        if (remaining === 0) resolve(hashes);
      };
    }

    tx.onerror = () => reject(tx.error || new Error('Failed to load deduplication hashes.'));
  });
}

export async function saveQuestionsDeduplicated(
  incoming: BankQuestion[]
): Promise<{ saved: number; duplicates: number }> {
  if (!incoming.length) return { saved: 0, duplicates: 0 };

  const uniqueSubjects = Array.from(new Set(incoming.map((q) => q.subject)));
  const existingHashes = await getExistingHashesForSubjects(uniqueSubjects);
  const { unique, duplicatesSkipped } = deduplicateBankQuestions(incoming, existingHashes);

  if (!unique.length) {
    return { saved: 0, duplicates: duplicatesSkipped };
  }

  const db = await openQuestionBankDb();
  let savedCount = 0;
  let constraintDupes = 0;

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    for (const q of unique) {
      const record: BankQuestion = {
        ...q,
        normHash: q.normHash || computeQuestionHash(q.subject, q.question),
      };
      const req = store.add(record);
      req.onsuccess = () => {
        savedCount++;
      };
      req.onerror = (ev) => {
        // Gracefully ignore duplicate unique-index or key collisions without aborting transaction
        ev.preventDefault();
        ev.stopPropagation();
        constraintDupes++;
      };
    }

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('Failed to write questions to IndexedDB.'));
  });

  if (savedCount > 0) {
    notifyQuestionBankChanged();
  }

  return { saved: savedCount, duplicates: duplicatesSkipped + constraintDupes };
}

export async function queryQuestionsFromDb(filter?: {
  subject?: SubjectId;
  examType?: BankExamType | 'ALL';
  topic?: string;
  search?: string;
  limit?: number;
}): Promise<BankQuestion[]> {
  if (typeof indexedDB === 'undefined') return [];
  const db = await openQuestionBankDb();

  const rawRows = await new Promise<BankQuestion[]>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    let req: IDBRequest<BankQuestion[]>;
    if (filter?.subject) {
      req = store.index('subject').getAll(IDBKeyRange.only(filter.subject));
    } else if (filter?.examType && filter.examType !== 'ALL') {
      req = store.index('examType').getAll(IDBKeyRange.only(filter.examType));
    } else {
      req = store.getAll();
    }

    req.onsuccess = () => resolve((req.result || []) as BankQuestion[]);
    req.onerror = () => reject(req.error || new Error('Failed to query IndexedDB questions.'));
  });

  const searchLower = filter?.search?.trim().toLowerCase() || '';
  const topicLower = filter?.topic?.trim().toLowerCase() || '';

  const filtered = rawRows.filter((q) => {
    if (filter?.examType && filter.examType !== 'ALL' && q.examType !== filter.examType) return false;
    if (topicLower && !q.topic.toLowerCase().includes(topicLower)) return false;
    if (searchLower) {
      const hay = `${q.question} ${q.topic} ${q.options.A} ${q.options.B} ${q.options.C} ${q.options.D}`.toLowerCase();
      if (!hay.includes(searchLower)) return false;
    }
    return true;
  });

  // Newest year first
  filtered.sort((a, b) => b.year - a.year || a.topic.localeCompare(b.topic));

  if (filter?.limit && filter.limit > 0) {
    return filtered.slice(0, filter.limit);
  }
  return filtered;
}

export async function exportAllQuestionsFromDb(): Promise<BankQuestion[]> {
  return queryQuestionsFromDb({});
}

export async function importQuestionsFromJsonPayload(
  raw: unknown
): Promise<{ ok: true; saved: number; duplicates: number; invalid: number } | { ok: false; error: string }> {
  const parsed = validateBankImportPayload(raw);
  if (!parsed.ok) return parsed;
  const { saved, duplicates } = await saveQuestionsDeduplicated(parsed.questions);
  return {
    ok: true,
    saved,
    duplicates,
    invalid: parsed.invalidCount,
  };
}

export async function clearSubjectQuestionsInDb(subject: SubjectId): Promise<number> {
  if (typeof indexedDB === 'undefined') return 0;
  const db = await openQuestionBankDb();
  let deleted = 0;

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const idx = store.index('subject');
    const cursorReq = idx.openCursor(IDBKeyRange.only(subject));

    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result;
      if (cursor) {
        cursor.delete();
        deleted++;
        cursor.continue();
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('Failed to clear subject questions.'));
  });

  if (deleted > 0) notifyQuestionBankChanged();
  return deleted;
}

export async function clearAllQuestionsInDb(): Promise<void> {
  if (typeof indexedDB === 'undefined') return;
  const db = await openQuestionBankDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('Failed to clear IndexedDB question bank.'));
  });
  notifyQuestionBankChanged();
}

/**
 * React hook subscribing to live IndexedDB counts across all 12 subjects.
 */
export function useQuestionBankCounts(): {
  counts: SubjectCountMap;
  totalCount: number;
  loading: boolean;
  refresh: () => void;
} {
  const [counts, setCounts] = useState<SubjectCountMap>(() => createEmptySubjectCounts());
  const [loading, setLoading] = useState<boolean>(true);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    let alive = true;
    void getQuestionCountsBySubject()
      .then((next) => {
        if (alive) {
          setCounts(next);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [tick]);

  useEffect(() => {
    const onChanged = () => setTick((t) => t + 1);
    window.addEventListener(QBANK_CHANGED_EVENT, onChanged);
    return () => window.removeEventListener(QBANK_CHANGED_EVENT, onChanged);
  }, []);

  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  const totalCount = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return {
    counts,
    totalCount,
    loading,
    refresh,
  };
}
