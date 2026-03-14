import { MIC_SETTINGS_KEY, RESUME_KEY, SESSION_KEY_PREFIX } from './constants';
import type { AppMode, MicSettings, QuizMode, QuizSessionSnapshot, ResumeState } from './types';

const getSessionKey = (dataSetId: string, mode: QuizMode) => `${SESSION_KEY_PREFIX}:${dataSetId}:${mode}`;

// Type-safe JSON parse with validation
const safeJsonParse = <T = unknown>(json: string | null, fallback: T): T => {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
};

export const saveMicSettings = (settings: MicSettings) => {
    try {
        localStorage.setItem(MIC_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
        // ignore
    }
};

export const loadMicSettings = (): MicSettings => {
    try {
        const str = localStorage.getItem(MIC_SETTINGS_KEY);
        if (str) {
          const parsed = safeJsonParse(str, null);
          if (parsed && typeof parsed === 'object' && 
              'sensitivity' in parsed && 'autoStart' in parsed && 'deviceId' in parsed) {
            return parsed as MicSettings;
          }
        }
    } catch {
        // ignore
    }
    return { sensitivity: 70, autoStart: true, deviceId: '' };
};

export const saveResumeState = (state: ResumeState) => {
    try {
        localStorage.setItem(RESUME_KEY, JSON.stringify(state));
    } catch {
        // ignore
    }
};

export const loadResumeState = (): ResumeState | null => {
    try {
        const raw = localStorage.getItem(RESUME_KEY);
        if (!raw) return null;
        const parsed = safeJsonParse(raw, null);
        if (!parsed || typeof parsed !== 'object') return null;
        if (typeof (parsed as any).mode !== 'string') return null;
        return {
            mode: (parsed as any).mode as AppMode,
            dayId: typeof (parsed as any).dayId === 'string' ? (parsed as any).dayId : null,
            savedAt: typeof (parsed as any).savedAt === 'number' ? (parsed as any).savedAt : Date.now()
        };
    } catch {
        return null;
    }
};

export const clearResumeState = () => {
    try {
        localStorage.removeItem(RESUME_KEY);
    } catch {
        // ignore
    }
};

export const saveQuizSession = (snapshot: QuizSessionSnapshot) => {
    try {
        localStorage.setItem(getSessionKey(snapshot.dataSetId, snapshot.mode), JSON.stringify(snapshot));
    } catch {
        // ignore
    }
};

export const loadQuizSession = (dataSetId: string, mode: QuizMode): QuizSessionSnapshot | null => {
    try {
        const raw = localStorage.getItem(getSessionKey(dataSetId, mode));
        if (!raw) return null;
        const parsed = safeJsonParse(raw, null);
        if (!parsed || typeof parsed !== 'object') return null;
        if (!Array.isArray((parsed as any).queue)) return null;
        return parsed as QuizSessionSnapshot;
    } catch {
        return null;
    }
};

export const clearQuizSession = (dataSetId: string, mode: QuizMode) => {
    try {
        localStorage.removeItem(getSessionKey(dataSetId, mode));
    } catch {
        // ignore
    }
};
