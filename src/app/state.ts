import { STORAGE_KEY } from './constants';
import type { AppAction, AppState, AppMode, ViewState } from './types';

const normalizeState = (state: AppState): AppState => {
    if ((state.view === 'QUIZ' || state.view === 'RESULT') && !state.dayId) {
        return { ...state, view: 'DASHBOARD', lastStats: null };
    }
    if (state.view === 'RESULT' && !state.lastStats) {
        return { ...state, view: 'DASHBOARD' };
    }
    if (state.mode === 'PROGRESS' || state.mode === 'WORD_LIST' || state.mode === 'PROFILE') {
        return { ...state, view: 'DASHBOARD' };
    }
    if (state.mode === 'TODAY') {
        return { ...state, view: 'DASHBOARD', dayId: null, lastStats: null };
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
        const view = parsed?.view as ViewState | undefined;
        const mode = parsed?.mode as AppMode | undefined;
        const dayId = typeof parsed?.dayId === 'string' ? parsed.dayId : null;
        const lastStats = parsed?.lastStats;
        const theme = parsed?.theme === 'dark' ? 'dark' : 'light';

        const isValidView = view === 'DASHBOARD' || view === 'QUIZ' || view === 'RESULT';
        const isValidMode = mode === 'WORD_LIST' || mode === 'CHOICE' || mode === 'WRITE' || mode === 'PROGRESS' || mode === 'TODAY' || mode === 'PROFILE';
        const isValidStats = lastStats &&
            typeof lastStats.totalTries === 'number' &&
            typeof lastStats.mostWrong === 'string' &&
            typeof lastStats.masteredCount === 'number';

        const state: AppState = {
            view: isValidView ? view : defaultState.view,
            mode: isValidMode ? mode : defaultState.mode,
            dayId,
            lastStats: isValidStats ? lastStats : null,
            theme,
        };

        return normalizeState(state);
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
            const nextView = action.mode === 'CHOICE' || action.mode === 'WRITE' ? 'QUIZ' : 'DASHBOARD';
            return normalizeState({
                ...state,
                mode: action.mode,
                dayId: action.dayId,
                view: nextView,
                lastStats: null
            });
        }
        case 'SELECT_DAY': {
            const nextView = state.mode === 'CHOICE' || state.mode === 'WRITE' ? 'QUIZ' : 'DASHBOARD';
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
