import type { WordWithStats } from '../db';

export type ViewState = 'DASHBOARD' | 'QUIZ' | 'RESULT' | 'WORD_STUDY_MAIN';
export type AppMode = 'WORD_LIST' | 'CHOICE' | 'WRITE' | 'PROGRESS' | 'TODAY' | 'PROFILE' | 'DASHBOARD_MAIN';
export type QuizMode = 'CHOICE' | 'WRITE';

export type AppTheme = 'light' | 'dark';

export type MicSettings = {
    sensitivity: number;
    autoStart: boolean;
    deviceId: string;
};

export type SessionStats = {
    totalTries: number;
    mostWrong: string;
    masteredCount: number;
    startTime: number;
    endTime: number;
    totalWordCount: number;
    wrongAttempts: number;
};

export type ResumeState = {
    mode: AppMode;
    dayId: string | null;
    savedAt: number;
};

export type QuizSessionSnapshot = {
    dataSetId: string;
    mode: QuizMode;
    queue: Array<{ id: string; sessionStatus: QuizSessionItem['sessionStatus'] }>;
    sessionTries: number;
    sessionWrongs: Record<string, number>;
    masteredCount: number;
    totalWordCount: number;
    newMasteredInSession: number;
};

export type TodayDayStats = {
    id: string;
    title: string;
    remaining: number;
    total: number;
    mastered: number;
};

export type AppState = {
    view: ViewState;
    mode: AppMode;
    dayId: string | null;
    lastStats: SessionStats | null;
    theme?: AppTheme;
};

export type AppAction =
    | { type: 'SET_MODE'; mode: AppMode }
    | { type: 'SELECT_DAY'; dayId: string }
    | { type: 'START_DAY_MODE'; dayId: string; mode: AppMode }
    | { type: 'BACK_DASHBOARD' }
    | { type: 'QUIZ_FINISH'; stats: SessionStats }
    | { type: 'RETRY_QUIZ' }
    | { type: 'CLEAR_DAY' }
    | { type: 'SET_THEME'; theme: AppTheme };

export interface QuizSessionItem extends WordWithStats {
    sessionStatus: 'pending' | 'correct' | 'wrong';
}

export type QuizUIProps = {
    current: QuizSessionItem | null;
    remainingCount: number;
    masterPercent: number;
    sessionPercent: number;
    totalCount: number;
    onResult: (isCorrect: boolean) => void;
    onExit: () => void;
    micEnabled?: boolean;
    setMicEnabled?: (value: boolean | ((prev: boolean) => boolean)) => void;
    // For dual-grammar speech recognition
    allWords?: string[];
};
