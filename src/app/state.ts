import { STORAGE_KEY } from './constants';
import type { AppAction, AppState } from './types';

const normalizeState = (state: AppState): AppState => {
    if ((state.view === 'QUIZ' || state.view === 'RESULT') && !state.dayId && state.mode !== 'TODAY') {
        return { ...state, view: 'DASHBOARD', lastStats: null };
    }
    if (state.view === 'RESULT' && !state.lastStats) {
        return { ...state, view: 'DASHBOARD' };
    }
    return state;
};

export const getInitialState = (): AppState => {
    const defaultState: AppState = {
        view: 'DASHBOARD',
        mode: 'CHOICE',
        dayId: null,
        lastStats: null,
        theme: 'light' // Default
    };

    if (typeof window === 'undefined') return defaultState;

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultState;
        const parsed = JSON.parse(raw);
        const theme = parsed?.theme === 'dark' ? 'dark' : 'light';

        return {
            ...defaultState,
            theme
        };
    } catch {
        return defaultState;
    }
};

export const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'SET_THEME':
            return {
                ...state,
                theme: action.theme
            };
        case 'SET_MODE': {
            const next: AppState = {
                ...state,
                mode: action.mode,
                view: 'DASHBOARD',
                dayId: null,
                lastStats: null
            };
            return normalizeState(next);
        }
        case 'START_DAY_MODE': {
            const nextView =
                action.mode === 'CHOICE' ||
                action.mode === 'WRITE' ||
                action.mode === 'TEST' ||
                action.mode === 'WORD_LIST' ||
                action.mode === 'PROGRESS' ||
                action.mode === 'PLAYER' ||
                action.mode === 'TODAY'
                    ? 'QUIZ'
                    : 'DASHBOARD';
            return normalizeState({
                ...state,
                mode: action.mode,
                dayId: action.dayId,
                view: nextView,
                lastStats: null
            });
        }
        case 'SELECT_DAY': {
            const nextView =
                state.mode === 'CHOICE' ||
                state.mode === 'WRITE' ||
                state.mode === 'TEST' ||
                state.mode === 'WORD_LIST' ||
                state.mode === 'PROGRESS' ||
                state.mode === 'PLAYER' ||
                state.mode === 'TODAY'
                    ? 'QUIZ'
                    : 'DASHBOARD';
            return normalizeState({
                ...state,
                dayId: action.dayId,
                view: nextView,
                lastStats: null
            });
        }
        case 'BACK_DASHBOARD':
            return normalizeState({ ...state, view: 'DASHBOARD', mode: 'CHOICE', dayId: null, lastStats: null });
        case 'QUIZ_FINISH':
            return normalizeState({ ...state, view: 'RESULT', lastStats: action.stats });
        case 'RETRY_QUIZ':
            return normalizeState({ ...state, view: 'QUIZ' });
        case 'CLEAR_DAY':
            return normalizeState({ ...state, dayId: null });
        default:
            return state;
    }
};
