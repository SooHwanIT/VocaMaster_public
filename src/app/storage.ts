import { MIC_SETTINGS_KEY, RESUME_KEY, SESSION_KEY_PREFIX } from './constants';
import type { AppMode, MicSettings, QuizMode, QuizSessionSnapshot, ResumeState } from './types';

const getSessionKey = (dataSetId: string, mode: QuizMode) => `${SESSION_KEY_PREFIX}:${dataSetId}:${mode}`;

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
        if (str) return JSON.parse(str);
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
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed.mode !== 'string') return null;
        return {
            mode: parsed.mode as AppMode,
            dayId: typeof parsed.dayId === 'string' ? parsed.dayId : null,
            savedAt: typeof parsed.savedAt === 'number' ? parsed.savedAt : Date.now()
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
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.queue)) return null;
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
