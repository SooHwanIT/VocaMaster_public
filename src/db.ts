import Dexie, { type Table } from 'dexie';
import { DATA_SETS } from './data/index';
import type { Word } from './data/types';
import { startOfDay } from 'date-fns';

// --- Interfaces for DB ---
export interface StudyRecord {
  id?: number; // Auto-increment ID
  wordId: string;
  dataSetId: string; // day1, day2...
  mode: 'CHOICE' | 'WRITE' | 'TEST';
  correctCnt: number;
  wrongCnt: number;
  memoryScore: number; // -3 to 3, mastery when >= 3
  lastStudied: number; // timestamp
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
}

// --- Database Class ---
class VocaDatabase extends Dexie {
  studyRecords!: Table<StudyRecord>;
  bookmarks!: Table<Bookmark>;
  studySessions!: Table<StudySession>;

  constructor() {
    super('VocaMasterDB');
    this.version(1).stores({
      studyRecords: '++id, [wordId+mode], dataSetId' // 복합 인덱스 사용
    });
    this.version(2).stores({
      studyRecords: '++id, [wordId+mode], dataSetId'
    }).upgrade(async (tx) => {
      // ... same upgrade logic
    });
    this.version(3).stores({
        bookmarks: '++id, wordId, dataSetId, [wordId+dataSetId]'
    });
    this.version(4).stores({
        studySessions: '++id, dataSetId, mode, endTime'
    });
  }
}

export const db = new VocaDatabase();

export async function getTodayStats() {
    const start = startOfDay(new Date()).getTime();
    const records = await db.studyRecords.filter(r => r.lastStudied >= start).toArray();

    const uniqueWords = new Set(records.map(r => r.wordId)).size;
    
    // Count per mode
    const choiceCount = records.filter(r => r.mode === 'CHOICE').length;
    const writeCount = records.filter(r => r.mode === 'WRITE').length;
    
    return {
        uniqueWords,
        totalReviews: records.length,
        choiceCount,
        writeCount
    };
}


// --- Helpers ---

// 1. 통계가 포함된 단어 리스트 가져오기 (마스터 여부 확인용)
export const getWordsWithStats = async (dataSetId: string, mode: 'CHOICE' | 'WRITE'): Promise<{
  queue: WordWithStats[];
  mastered: WordWithStats[];
  totalCount: number;
}> => {
  const dataSet = DATA_SETS.find(d => d.id === dataSetId);
  if (!dataSet) return { queue: [], mastered: [], totalCount: 0 };

  const allWords = dataSet.words;
  const records = await db.studyRecords
    .where('dataSetId').equals(dataSetId)
    .and(r => r.mode === mode)
    .toArray();

  const recordMap = new Map(records.map(r => [r.wordId, r]));

  const queue: WordWithStats[] = [];
  const mastered: WordWithStats[] = [];

  allWords.forEach(word => {
    const record = recordMap.get(word.id);
    const wordWithStats = { ...word, record };
    
    // 마스터 기준: 기억 점수 3 이상
    if (record && record.memoryScore >= 3) {
      mastered.push(wordWithStats);
    } else {
      queue.push(wordWithStats);
    }
  });

  return {
    queue,
    mastered,
    totalCount: allWords.length
  };
};

// 2. 모드별 진행도 카운트 (학습중/마스터)
export const getModeProgress = async (dataSetId: string, mode: 'CHOICE' | 'WRITE'): Promise<{
  learnedCount: number;
  masteredCount: number;
  totalCount: number;
}> => {
  const dataSet = DATA_SETS.find(d => d.id === dataSetId);
  if (!dataSet) return { learnedCount: 0, masteredCount: 0, totalCount: 0 };

  const records = await db.studyRecords
    .where('dataSetId').equals(dataSetId)
    .and(r => r.mode === mode)
    .toArray();

  const masteredCount = records.filter(r => r.memoryScore >= 3).length;
  return {
    learnedCount: records.length,
    masteredCount,
    totalCount: dataSet.words.length
  };
};

// 3. 학습 결과 업데이트 (정답/오답 처리)
export const updateWordStats = async (
  wordId: string, 
  dataSetId: string, 
  mode: 'CHOICE' | 'WRITE', 
  isCorrect: boolean,
  scoreDelta: number
) => {
  await db.transaction('rw', db.studyRecords, async () => {
    // 기존 기록 조회
    const existing = await db.studyRecords.where({ wordId, mode }).first();

    if (existing) {
      const nextScore = Math.max(-3, Math.min(3, (existing.memoryScore ?? 0) + scoreDelta));
      // 기록 업데이트
      await db.studyRecords.update(existing.id!, {
        correctCnt: existing.correctCnt + (isCorrect ? 1 : 0),
        wrongCnt: existing.wrongCnt + (isCorrect ? 0 : 1),
        memoryScore: nextScore,
        lastStudied: Date.now()
      });
    } else {
      const nextScore = Math.max(-3, Math.min(3, scoreDelta));
      // 새 기록 생성
      await db.studyRecords.add({
        wordId,
        dataSetId,
        mode,
        correctCnt: isCorrect ? 1 : 0,
        wrongCnt: isCorrect ? 0 : 1,
        memoryScore: nextScore,
        lastStudied: Date.now()
      });
    }
  });
};

// 4. 기억 점수 수동 설정 (스테이지 토글용)
export const setMemoryScore = async (
  wordId: string,
  dataSetId: string,
  mode: 'CHOICE' | 'WRITE',
  memoryScore: number
) => {
  const nextScore = Math.max(-3, Math.min(3, memoryScore));

  await db.transaction('rw', db.studyRecords, async () => {
    const existing = await db.studyRecords.where({ wordId, mode }).first();

    if (existing) {
      await db.studyRecords.update(existing.id!, {
        memoryScore: nextScore,
        lastStudied: Date.now()
      });
    } else {
      await db.studyRecords.add({
        wordId,
        dataSetId,
        mode,
        correctCnt: 0,
        wrongCnt: 0,
        memoryScore: nextScore,
        lastStudied: Date.now()
      });
    }
  });
};
// 5. 통계 초기화 (옵션)
export const resetProgress = async (dataSetId: string) => {
  await db.studyRecords.where('dataSetId').equals(dataSetId).delete();
  await db.bookmarks.where('dataSetId').equals(dataSetId).delete();
};

export const saveStudySession = async (session: Omit<StudySession, 'id'>) => {
    await db.studySessions.add(session);
};

export const toggleBookmark = async (wordId: string, dataSetId: string) => {
  const existing = await db.bookmarks.where({ wordId, dataSetId }).first();
  if (existing) {
    await db.bookmarks.delete(existing.id!);
  } else {
    await db.bookmarks.add({ wordId, dataSetId, createdAt: Date.now() });
  }
};

export const getBookmarks = async () => {
    return await db.bookmarks.toArray();
};

export const isBookmarked = async (wordId: string, dataSetId: string) => {
    const count = await db.bookmarks.where({ wordId, dataSetId }).count();
    return count > 0;
};