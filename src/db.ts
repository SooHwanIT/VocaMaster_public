import Dexie, { type Table } from 'dexie';
import { DATA_SETS } from './data.ts';
import type { Word } from './data/types';
import { startOfDay } from 'date-fns';
import { supabase } from './lib/supabase';
import { validateWordAttempt, validateWrongWordStatRow, type ValidatedWrongWordStat } from './lib/validation';
import type { SessionWordSnapshot, TestDirection, TestResultEntry } from './app/types';

// --- Interfaces for DB ---
export interface StudyRecord {
  id?: number;
  wordId: string;
  dataSetId: string;
  mode: 'CHOICE' | 'WRITE' | 'TEST';
  correctCnt: number;
  wrongCnt: number;
  memoryScore: number;
  lastStudied: number;
}

export interface WordWithStats extends Word {
  record?: StudyRecord;
}

export interface Bookmark {
  id?: number;
  wordId: string;
  dataSetId: string;
  createdAt: number;
}

export interface StudySession {
  id?: number;
  dataSetId: string;
  mode: 'CHOICE' | 'WRITE' | 'TEST';
  startTime: number;
  endTime: number;
  totalCount: number;
  correctCount: number;
  wrongCount: number;
  wrongWords?: string[];
  testType?: TestDirection;
  testResults?: TestResultEntry[];
  sessionWords?: SessionWordSnapshot[];
}

export interface WordAttemptLog {
  id?: number;
  wordId: string;
  dataSetId: string;
  mode: 'CHOICE' | 'WRITE' | 'TEST';
  isCorrect: boolean;
  sessionDate: string; // 'YYYY-MM-DD'
  createdAt: number;
}

type SyncEntity = 'progress' | 'bookmark';
type SyncOp = 'upsert' | 'delete';
type SyncItemStatus = 'pending' | 'syncing' | 'failed';

interface SyncQueueItem {
  id?: number;
  entity: SyncEntity;
  itemKey: string;
  op: SyncOp;
  payload: string;
  updatedAt: number;
  status: SyncItemStatus;
  retryCount: number;
  lastError?: string;
  nextRetryAt?: number;
}

interface SyncMeta {
  key: string;
  value: string;
}

// --- Database Class ---
class VocaDatabase extends Dexie {
  studyRecords!: Table<StudyRecord>;
  bookmarks!: Table<Bookmark>;
  studySessions!: Table<StudySession>;
  wordAttemptLogs!: Table<WordAttemptLog>;
  syncQueue!: Table<SyncQueueItem>;
  syncMeta!: Table<SyncMeta>;

  constructor() {
    super('VocaMasterDB');
    this.version(1).stores({
      studyRecords: '++id, [wordId+mode], dataSetId'
    });
    this.version(2).stores({
      studyRecords: '++id, [wordId+mode], dataSetId'
    }).upgrade(async (_tx) => {
    });
    this.version(3).stores({
      bookmarks: '++id, wordId, dataSetId, [wordId+dataSetId]'
    });
    this.version(4).stores({
      studySessions: '++id, dataSetId, mode, endTime'
    });
    this.version(5).stores({
      studyRecords: '++id, [wordId+mode], dataSetId, wordId, mode, lastStudied',
      bookmarks: '++id, wordId, dataSetId, [wordId+dataSetId], createdAt',
      studySessions: '++id, dataSetId, mode, endTime',
      syncQueue: '++id, [entity+itemKey], entity, updatedAt',
      syncMeta: '&key'
    });
    this.version(6).stores({
      studyRecords: '++id, [wordId+mode], dataSetId, wordId, mode, lastStudied',
      bookmarks: '++id, wordId, dataSetId, [wordId+dataSetId], createdAt',
      studySessions: '++id, dataSetId, mode, endTime',
      wordAttemptLogs: '++id, wordId, dataSetId, mode, isCorrect, sessionDate, createdAt',
      syncQueue: '++id, [entity+itemKey], entity, updatedAt',
      syncMeta: '&key'
    });
  }
}

export const db = new VocaDatabase();

let flushTimer: number | null = null;
let flushInFlight = false;
const FLUSH_DEBOUNCE_MS = 1200;
const MAX_SYNC_RETRY_DELAY_MS = 30000;

export type SyncPhase = 'idle' | 'syncing' | 'error';

export interface SyncStatusSnapshot {
  phase: SyncPhase;
  pendingCount: number;
  failedCount: number;
  lastError: string | null;
  retryScheduledAt: number | null;
  lastSyncedAt: number | null;
}

const syncStatusListeners = new Set<(status: SyncStatusSnapshot) => void>();

let syncStatusSnapshot: SyncStatusSnapshot = {
  phase: 'idle',
  pendingCount: 0,
  failedCount: 0,
  lastError: null,
  retryScheduledAt: null,
  lastSyncedAt: null,
};

const emitSyncStatus = (nextStatus: SyncStatusSnapshot) => {
  syncStatusSnapshot = nextStatus;
  syncStatusListeners.forEach((listener) => listener(syncStatusSnapshot));
};

export const getSyncStatusSnapshot = () => syncStatusSnapshot;

export const subscribeToSyncStatus = (listener: (status: SyncStatusSnapshot) => void) => {
  syncStatusListeners.add(listener);
  listener(syncStatusSnapshot);
  return () => {
    syncStatusListeners.delete(listener);
  };
};

const normalizeSyncErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes('failed to fetch') || message.includes('network') || message.includes('offline')) {
      return '네트워크 연결이 불안정해 동기화에 실패했습니다.';
    }
    if (message.includes('json')) {
      return '동기화 대기열 데이터가 손상되어 재시도가 필요합니다.';
    }
    return error.message;
  }
  return '알 수 없는 동기화 오류가 발생했습니다.';
};

const refreshSyncStatus = async (phaseOverride?: SyncPhase, overrides?: Partial<SyncStatusSnapshot>) => {
  const queue = await db.syncQueue.toArray();
  const pendingCount = queue.length;
  const failedItems = queue.filter((item) => item.status === 'failed');
  const failedCount = failedItems.length;
  const retryScheduledAt = failedItems.reduce<number | null>((nearest, item) => {
    if (!item.nextRetryAt) return nearest;
    if (nearest === null) return item.nextRetryAt;
    return Math.min(nearest, item.nextRetryAt);
  }, null);

  const inferredPhase: SyncPhase = phaseOverride
    ?? (flushInFlight
      ? 'syncing'
      : failedCount > 0
        ? 'error'
        : 'idle');

  emitSyncStatus({
    ...syncStatusSnapshot,
    phase: inferredPhase,
    pendingCount,
    failedCount,
    retryScheduledAt,
    ...overrides,
  });
};

const getLoggedInUserId = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user?.id ?? null;
  } catch {
    return null;
  }
};

export const findDataSetIdByWordId = (wordId: string): string | null => {
  for (const dataSet of DATA_SETS) {
    if (dataSet.words.some((word) => word.id === wordId)) {
      return dataSet.id;
    }
  }
  return null;
};

const getMetaKey = (name: string, userId: string) => `${name}:${userId}`;

const enqueueSyncItem = async (item: {
  entity: SyncEntity;
  itemKey: string;
  op: SyncOp;
  payload: Record<string, unknown>;
}) => {
  const existing = await db.syncQueue.where('[entity+itemKey]').equals([item.entity, item.itemKey]).first();
  const nextPayload = JSON.stringify(item.payload);

  if (existing?.id) {
    await db.syncQueue.update(existing.id, {
      op: item.op,
      payload: nextPayload,
      updatedAt: Date.now(),
      status: 'pending',
      lastError: undefined,
      nextRetryAt: undefined,
    });
    await refreshSyncStatus();
    return;
  }

  await db.syncQueue.add({
    ...item,
    payload: nextPayload,
    updatedAt: Date.now(),
    status: 'pending',
    retryCount: 0,
  });
  await refreshSyncStatus();
};

const enqueueProgressUpsert = async (wordId: string, isMastered: boolean, lastStudied: number) => {
  const userId = await getLoggedInUserId();
  if (!userId) return;

  await enqueueSyncItem({
    entity: 'progress',
    itemKey: `${userId}:${wordId}`,
    op: 'upsert',
    payload: {
      user_id: userId,
      word_id: wordId,
      is_mastered: isMastered,
      last_reviewed_at: new Date(lastStudied).toISOString(),
      is_deleted: false,
    },
  });

  scheduleSyncFlush();
};

const enqueueBookmarkUpsert = async (wordId: string) => {
  const userId = await getLoggedInUserId();
  if (!userId) return;

  await enqueueSyncItem({
    entity: 'bookmark',
    itemKey: `${userId}:${wordId}`,
    op: 'upsert',
    payload: {
      user_id: userId,
      word_id: wordId,
      is_deleted: false,
    },
  });

  scheduleSyncFlush();
};

const enqueueBookmarkDelete = async (wordId: string) => {
  const userId = await getLoggedInUserId();
  if (!userId) return;

  await enqueueSyncItem({
    entity: 'bookmark',
    itemKey: `${userId}:${wordId}`,
    op: 'delete',
    payload: {
      user_id: userId,
      word_id: wordId,
      is_deleted: true,
    },
  });

  scheduleSyncFlush();
};

const applyRemoteProgressRowToLocal = async (row: {
  word_id: string;
  is_mastered: boolean;
  is_deleted?: boolean;
  last_reviewed_at?: string | null;
}) => {
  const dataSetId = findDataSetIdByWordId(row.word_id);
  if (!dataSetId) return;

  if (row.is_deleted) {
    await db.studyRecords.where('wordId').equals(row.word_id).delete();
    return;
  }

  const targetScore = row.is_mastered ? 3 : 0;
  const lastStudied = row.last_reviewed_at ? new Date(row.last_reviewed_at).getTime() : Date.now();
  const targetModes: Array<'CHOICE' | 'WRITE'> = ['CHOICE', 'WRITE'];

  for (const mode of targetModes) {
    const existing = await db.studyRecords.where({ wordId: row.word_id, mode }).first();
    if (existing?.id) {
      await db.studyRecords.update(existing.id, {
        memoryScore: targetScore,
        lastStudied,
      });
    } else {
      await db.studyRecords.add({
        wordId: row.word_id,
        dataSetId,
        mode,
        correctCnt: 0,
        wrongCnt: 0,
        memoryScore: targetScore,
        lastStudied,
      });
    }
  }
};

const applyRemoteBookmarkRowToLocal = async (row: {
  word_id: string;
  created_at?: string;
  is_deleted?: boolean;
}) => {
  const dataSetId = findDataSetIdByWordId(row.word_id);
  if (!dataSetId) return;

  const existing = await db.bookmarks.where({ wordId: row.word_id, dataSetId }).first();

  if (row.is_deleted) {
    if (existing?.id) {
      await db.bookmarks.delete(existing.id);
    }
    return;
  }

  const createdAt = row.created_at ? new Date(row.created_at).getTime() : Date.now();

  if (existing?.id) {
    await db.bookmarks.update(existing.id, { createdAt });
  } else {
    await db.bookmarks.add({
      wordId: row.word_id,
      dataSetId,
      createdAt,
    });
  }
};

const pullServerChangesToLocal = async (userId: string) => {
  const lastPulledAtKey = getMetaKey('lastPulledAt', userId);
  const lastPulledAt = (await db.syncMeta.get(lastPulledAtKey))?.value;

  try {
    let progressQuery = supabase
      .from('user_progress')
      .select('word_id,is_mastered,last_reviewed_at,updated_at,is_deleted')
      .eq('user_id', userId)
      .order('updated_at', { ascending: true });

    let bookmarkQuery = supabase
      .from('word_bookmarks')
      .select('word_id,created_at,updated_at,is_deleted')
      .eq('user_id', userId)
      .order('updated_at', { ascending: true });

    if (lastPulledAt) {
      progressQuery = progressQuery.gt('updated_at', lastPulledAt);
      bookmarkQuery = bookmarkQuery.gt('updated_at', lastPulledAt);
    }

    const [progressResult, bookmarkResult] = await Promise.all([progressQuery, bookmarkQuery]);

    if (progressResult.error || bookmarkResult.error) {
      throw progressResult.error ?? bookmarkResult.error;
    }

    const progressRows = progressResult.data ?? [];
    const bookmarkRows = bookmarkResult.data ?? [];

    await db.transaction('rw', db.studyRecords, db.bookmarks, async () => {
      for (const row of progressRows) {
        await applyRemoteProgressRowToLocal(row);
      }
      for (const row of bookmarkRows) {
        await applyRemoteBookmarkRowToLocal(row);
      }
    });

    await db.syncMeta.put({
      key: lastPulledAtKey,
      value: new Date().toISOString(),
    });
  } catch (error) {
    const [progressFallback, bookmarkFallback] = await Promise.all([
      supabase
        .from('user_progress')
        .select('word_id,is_mastered,last_reviewed_at,is_deleted')
        .eq('user_id', userId),
      supabase
        .from('word_bookmarks')
        .select('word_id,created_at,is_deleted')
        .eq('user_id', userId),
    ]);

    if (progressFallback.error || bookmarkFallback.error) {
      await refreshSyncStatus('error', {
        lastError: normalizeSyncErrorMessage(progressFallback.error ?? bookmarkFallback.error ?? error),
      });
      if (import.meta.env.DEV) {
        console.error('Sync pull fallback failed:', progressFallback.error ?? bookmarkFallback.error ?? error);
      }
      return;
    }

    await db.transaction('rw', db.studyRecords, db.bookmarks, async () => {
      for (const row of progressFallback.data ?? []) {
        await applyRemoteProgressRowToLocal(row);
      }
      for (const row of bookmarkFallback.data ?? []) {
        await applyRemoteBookmarkRowToLocal(row);
      }
    });
  }
};

export const flushSyncQueue = async (force = false) => {
  if (flushInFlight) return;
  const userId = await getLoggedInUserId();
  if (!userId) return;

  flushInFlight = true;
  await refreshSyncStatus('syncing', { lastError: null });
  try {
    const queue = await db.syncQueue.orderBy('updatedAt').toArray();
    if (queue.length === 0) return;

    const now = Date.now();
    const readyQueue = queue.filter((item) => force || !item.nextRetryAt || item.nextRetryAt <= now);
    if (readyQueue.length === 0) {
      await refreshSyncStatus('error');
      return;
    }

    await Promise.all(readyQueue.map((item) => item.id
      ? db.syncQueue.update(item.id, { status: 'syncing' })
      : Promise.resolve()));

    const progressRows: Array<Record<string, unknown>> = [];
    const bookmarkRows: Array<Record<string, unknown>> = [];

    readyQueue.forEach((item) => {
      const payload = JSON.parse(item.payload) as Record<string, unknown>;
      if (item.entity === 'progress') {
        progressRows.push(payload);
      } else {
        bookmarkRows.push(payload);
      }
    });

    if (progressRows.length > 0) {
      const { error } = await supabase.from('user_progress').upsert(progressRows, {
        onConflict: 'user_id,word_id',
      });
      if (error) throw error;
    }

    if (bookmarkRows.length > 0) {
      const { error } = await supabase.from('word_bookmarks').upsert(bookmarkRows, {
        onConflict: 'user_id,word_id',
      });
      if (error) throw error;
    }

    await db.syncQueue.bulkDelete(readyQueue.map((item) => item.id).filter((id): id is number => typeof id === 'number'));
    await refreshSyncStatus('idle', {
      lastError: null,
      retryScheduledAt: null,
      lastSyncedAt: Date.now(),
    });
  } catch (error) {
    const message = normalizeSyncErrorMessage(error);
    const failedAt = Date.now();

    const queue = await db.syncQueue.orderBy('updatedAt').toArray();
    const impactedItems = queue.filter((item) => item.status === 'syncing' || force || !item.nextRetryAt || item.nextRetryAt <= failedAt);
    const nextRetryAt = impactedItems.reduce<number | null>((latest, item) => {
      const retryCount = (item.retryCount ?? 0) + 1;
      const delay = Math.min(MAX_SYNC_RETRY_DELAY_MS, FLUSH_DEBOUNCE_MS * (2 ** retryCount));
      const retryAt = failedAt + delay;
      if (item.id) {
        void db.syncQueue.update(item.id, {
          status: 'failed',
          retryCount,
          lastError: message,
          nextRetryAt: retryAt,
        });
      }
      if (latest === null) return retryAt;
      return Math.min(latest, retryAt);
    }, null);

    if (import.meta.env.DEV) {
      console.error('Sync flush failed:', error);
    }

    await refreshSyncStatus('error', {
      lastError: message,
      retryScheduledAt: nextRetryAt,
    });

    if (nextRetryAt) {
      scheduleSyncFlush(Math.max(0, nextRetryAt - Date.now()));
    }
  } finally {
    flushInFlight = false;
    await refreshSyncStatus();
  }
};

export const scheduleSyncFlush = (delay = FLUSH_DEBOUNCE_MS) => {
  if (flushTimer) {
    window.clearTimeout(flushTimer);
  }

  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    void flushSyncQueue();
  }, delay);
};

export const initializeLocalFirstSync = async () => {
  const userId = await getLoggedInUserId();
  if (!userId) return;

  await pullServerChangesToLocal(userId);
  await flushSyncQueue();
};

export async function getTodayStats() {
  const start = startOfDay(new Date()).getTime();
  const records = await db.studyRecords.filter((r) => r.lastStudied >= start).toArray();

  const uniqueWords = new Set(records.map((r) => r.wordId)).size;
  const choiceCount = records.filter((r) => r.mode === 'CHOICE').length;
  const writeCount = records.filter((r) => r.mode === 'WRITE').length;

  return {
    uniqueWords,
    totalReviews: records.length,
    choiceCount,
    writeCount,
  };
}

export const getWordsWithStats = async (
  dataSetId: string,
  mode: 'CHOICE' | 'WRITE'
): Promise<{
  queue: WordWithStats[];
  mastered: WordWithStats[];
  totalCount: number;
}> => {
  const dataSet = DATA_SETS.find((d) => d.id === dataSetId);
  if (!dataSet) return { queue: [], mastered: [], totalCount: 0 };

  const allWords = dataSet.words;
  const records = await db.studyRecords
    .where('dataSetId').equals(dataSetId)
    .and((r) => r.mode === mode)
    .toArray();

  const recordMap = new Map(records.map((r) => [r.wordId, r]));

  const queue: WordWithStats[] = [];
  const mastered: WordWithStats[] = [];

  allWords.forEach((word) => {
    const record = recordMap.get(word.id);
    const wordWithStats = { ...word, dayId: dataSetId, record };

    if (record && record.memoryScore >= 3) {
      mastered.push(wordWithStats);
    } else {
      queue.push(wordWithStats);
    }
  });

  return {
    queue,
    mastered,
    totalCount: allWords.length,
  };
};

export const getModeProgress = async (
  dataSetId: string,
  mode: 'CHOICE' | 'WRITE'
): Promise<{
  learnedCount: number;
  masteredCount: number;
  totalCount: number;
}> => {
  const dataSet = DATA_SETS.find((d) => d.id === dataSetId);
  if (!dataSet) return { learnedCount: 0, masteredCount: 0, totalCount: 0 };

  const records = await db.studyRecords
    .where('dataSetId').equals(dataSetId)
    .and((r) => r.mode === mode)
    .toArray();

  const masteredCount = records.filter((r) => r.memoryScore >= 3).length;
  return {
    learnedCount: records.length,
    masteredCount,
    totalCount: dataSet.words.length,
  };
};

export const updateWordStats = async (
  wordId: string,
  dataSetId: string,
  mode: 'CHOICE' | 'WRITE',
  isCorrect: boolean,
  scoreDelta: number
) => {
  let nextScoreForSync = 0;
  const now = Date.now();

  await db.transaction('rw', db.studyRecords, async () => {
    const existing = await db.studyRecords.where({ wordId, mode }).first();

    if (existing) {
      const nextScore = Math.max(-3, Math.min(3, (existing.memoryScore ?? 0) + scoreDelta));
      nextScoreForSync = nextScore;
      await db.studyRecords.update(existing.id!, {
        correctCnt: existing.correctCnt + (isCorrect ? 1 : 0),
        wrongCnt: existing.wrongCnt + (isCorrect ? 0 : 1),
        memoryScore: nextScore,
        lastStudied: now,
      });
    } else {
      const nextScore = Math.max(-3, Math.min(3, scoreDelta));
      nextScoreForSync = nextScore;
      await db.studyRecords.add({
        wordId,
        dataSetId,
        mode,
        correctCnt: isCorrect ? 1 : 0,
        wrongCnt: isCorrect ? 0 : 1,
        memoryScore: nextScore,
        lastStudied: now,
      });
    }
  });

  await enqueueProgressUpsert(wordId, nextScoreForSync >= 3, now);
};

export const setMemoryScore = async (
  wordId: string,
  dataSetId: string,
  mode: 'CHOICE' | 'WRITE',
  memoryScore: number
) => {
  const nextScore = Math.max(-3, Math.min(3, memoryScore));
  const now = Date.now();

  await db.transaction('rw', db.studyRecords, async () => {
    const existing = await db.studyRecords.where({ wordId, mode }).first();

    if (existing) {
      await db.studyRecords.update(existing.id!, {
        memoryScore: nextScore,
        lastStudied: now,
      });
    } else {
      await db.studyRecords.add({
        wordId,
        dataSetId,
        mode,
        correctCnt: 0,
        wrongCnt: 0,
        memoryScore: nextScore,
        lastStudied: now,
      });
    }
  });

  await enqueueProgressUpsert(wordId, nextScore >= 3, now);
};

export const resetProgress = async (dataSetId: string) => {
  await db.studyRecords.where('dataSetId').equals(dataSetId).delete();
  await db.bookmarks.where('dataSetId').equals(dataSetId).delete();
};

export const saveStudySession = async (session: Omit<StudySession, 'id'>) => {
  await db.studySessions.add(session);
};

export const logWordAttempt = async (
  wordId: string,
  dataSetId: string,
  mode: 'CHOICE' | 'WRITE' | 'TEST',
  isCorrect: boolean
) => {
  try {
    // Validate all inputs
    const validated = validateWordAttempt(wordId, dataSetId, mode);
    const isCorrectBool = Boolean(isCorrect);
    const now = Date.now();
    const sessionDate = new Date(now).toISOString().slice(0, 10);
    
    await db.wordAttemptLogs.add({
      wordId: validated.wordId,
      dataSetId: validated.dataSetId,
      mode: validated.mode,
      isCorrect: isCorrectBool,
      sessionDate,
      createdAt: now,
    });

    const userId = await getLoggedInUserId();
    if (!userId) return;

    await supabase.from('word_attempt_logs').insert({
      user_id: userId,
      word_id: validated.wordId,
      dataset_id: validated.dataSetId,
      mode: validated.mode,
      is_correct: isCorrectBool,
      session_date: sessionDate,
      created_at: new Date(now).toISOString(),
    });
  } catch (error) {
    console.error('Failed to log word attempt:', error);
    throw error;
  }
};

export interface WrongWordStat {
  wordId: string;
  dataSetId: string;
  wrongCount: number;
  correctCount: number;
  accuracy: number;
  lastAttemptAt: number;
}

export const getWrongWordStats = async (): Promise<WrongWordStat[]> => {
  try {
    const userId = await getLoggedInUserId();
    if (userId) {
      const { data, error } = await supabase.rpc('get_wrong_notes_summary');

      if (!error && Array.isArray(data)) {
        const fromServer: WrongWordStat[] = data
          .map(validateWrongWordStatRow)
          .filter((row): row is ValidatedWrongWordStat => row !== null);

        return fromServer.sort((a, b) => b.wrongCount - a.wrongCount);
      }
    }
  } catch {
  }

  const logs = await db.wordAttemptLogs.toArray();
  const statsMap = new Map<string, { wrong: number; correct: number; lastAt: number; dataSetId: string }>();

  for (const log of logs) {
    const existing = statsMap.get(log.wordId) ?? { wrong: 0, correct: 0, lastAt: 0, dataSetId: log.dataSetId };
    if (log.isCorrect) existing.correct++;
    else existing.wrong++;
    if (log.createdAt > existing.lastAt) existing.lastAt = log.createdAt;
    statsMap.set(log.wordId, existing);
  }

  const fallbackResults: WrongWordStat[] = [];
  for (const [wordId, stat] of statsMap.entries()) {
    if (stat.wrong === 0) continue;
    const total = stat.wrong + stat.correct;
    fallbackResults.push({
      wordId,
      dataSetId: stat.dataSetId,
      wrongCount: stat.wrong,
      correctCount: stat.correct,
      accuracy: total > 0 ? Math.round((stat.correct / total) * 100) : 0,
      lastAttemptAt: stat.lastAt,
    });
  }

  return fallbackResults.sort((a, b) => b.wrongCount - a.wrongCount);
};

export const toggleBookmark = async (wordId: string, dataSetId: string) => {
  const existing = await db.bookmarks.where({ wordId, dataSetId }).first();
  if (existing) {
    await db.bookmarks.delete(existing.id!);
    await enqueueBookmarkDelete(wordId);
  } else {
    await db.bookmarks.add({ wordId, dataSetId, createdAt: Date.now() });
    await enqueueBookmarkUpsert(wordId);
  }
};

export const getBookmarks = async () => {
  return await db.bookmarks.toArray();
};

export const isBookmarked = async (wordId: string, dataSetId: string) => {
  const count = await db.bookmarks.where({ wordId, dataSetId }).count();
  return count > 0;
};

export const removeBookmark = async (wordId: string, dataSetId: string) => {
  const existing = await db.bookmarks.where({ wordId, dataSetId }).first();
  if (existing?.id) {
    await db.bookmarks.delete(existing.id);
    await enqueueBookmarkDelete(wordId);
  }
};
