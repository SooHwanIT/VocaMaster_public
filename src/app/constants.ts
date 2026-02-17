import type { AppMode } from './types';

export const MODE_LABELS: Record<AppMode, string> = {
    WORD_LIST: '단어장',
    CHOICE: '단어퀴즈',
    WRITE: '예문퀴즈',
    PROGRESS: '진행도',
    TODAY: '오늘의 학습',
    PROFILE: '프로필'
};

export const STORAGE_KEY = 'voca-app-state-v1';
export const RESUME_KEY = 'voca-resume-state-v1';
export const SESSION_KEY_PREFIX = 'voca-quiz-session-v1';
export const MIC_SETTINGS_KEY = 'voca-mic-settings-v1';
