import React, { useCallback, useEffect, useState } from 'react';
import { Book, BookOpen, Home, Keyboard, Library, Minus, Square, Trophy, X, User as UserIcon, BarChart, Bookmark, Settings, History, Gamepad2, FileCheck, Menu, Play } from 'lucide-react';
import { ipcRenderer } from 'electron';

import { saveStudySession } from './db';
import { DATA_SETS } from './data';
import { STORAGE_KEY } from './app/constants';
import { appReducer, getInitialState } from './app/state';
import { clearResumeState, loadResumeState, saveResumeState } from './app/storage';
import type { AppMode, QuizMode, ResumeState, SessionStats } from './app/types';

import DashboardView from './components/DashboardView';
import WordStudyView from './components/WordStudyView';
import BookmarksView from './components/BookmarksView';
import StatsView from './components/StatsView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import WordListView from './components/WordListView';
import ProgressView from './components/ProgressView';
import ProfileView from './components/ProfileView';
import TodayStudyView from './components/TodayStudyView';
import QuizSessionManager from './components/QuizSessionManager';
import ChoiceQuizUI from './components/ChoiceQuizUI';
import WriteQuizUI from './components/WriteQuizUI';
import TestSessionManager from './components/TestSessionManager';
import ResultView from './components/ResultView';
import ArcadeView from './components/ArcadeView';
import PlayerView from './components/PlayerView';

const App = () => {
    const [state, dispatch] = React.useReducer(appReducer, undefined, getInitialState);
    const [modePickerDayId, setModePickerDayId] = useState<string | null>(null);
    const [resumeState, setResumeState] = useState<ResumeState | null>(() => loadResumeState());
    const [exitConfirm, setExitConfirm] = useState<{ mode: AppMode; dayId: string | null } | null>(null);

    // Sidebar navigation state (internal UI state)
    // Synchronize this with the reducer state if necessary, or just use it to switch views
    // If state.view is 'DASHBOARD', we check this explicitly to know which tab to show.
    // Ideally, we might want to move this into the main state, but for now we can manage it here or mapping it.
    // Let's use state.mode to determine the active tab if state.view is 'DASHBOARD'
    
    // Mapping:
    // Dashboard Tab -> state.mode === 'DASHBOARD_MAIN' (We need to add this mode or handle it)
    // Word Study Tab -> state.mode === 'WORD_LIST' (initially) or just 'WORD_STUDY_HOME' 
    // Profile Tab -> state.mode === 'PROFILE'

    // Let's assume we want a cleaner way. 
    // We can say:
    // Tab 1: Dashboard -> render DashboardView
    // Tab 2: Word Study -> render WordStudyView (which selects Day) -> Then goes to QUIZ/LIST modes
    // Tab 3: Profile -> render ProfileView
    
    // Current Reducer logic is a bit mode-centric.
    // Let's modify the view rendering logic below.

    const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'WORD_STUDY' | 'BOOKMARKS' | 'STATS' | 'ARCADE' | 'HISTORY' | 'SETTINGS' | 'PROFILE'>('DASHBOARD');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [activeTab]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            // Ignore persistence errors (private mode, quota, etc.)
        }
    }, [state]);

    useEffect(() => {
        if (state.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [state.theme]);

    useEffect(() => {
        if (state.view === 'DASHBOARD') {
            setResumeState(loadResumeState());
        }
    }, [state.view]);


    const openModePicker = useCallback((id: string) => {
        setModePickerDayId(id);
    }, []);

    const closeModePicker = useCallback(() => {
        setModePickerDayId(null);
    }, []);

    const handleStartDayMode = useCallback((mode: AppMode) => {
        if (!modePickerDayId) return;
        dispatch({ type: 'START_DAY_MODE', dayId: modePickerDayId, mode });
        setModePickerDayId(null);
    }, [modePickerDayId, dispatch]);

    const handleResume = () => {
        if (!resumeState) return;
        if (resumeState.mode === 'TODAY') {
            dispatch({ type: 'SET_MODE', mode: 'TODAY' });
            return;
        }
        if (!resumeState.dayId) return;
        dispatch({ type: 'START_DAY_MODE', dayId: resumeState.dayId, mode: resumeState.mode });
    };

    const requestExit = () => {
        if (state.mode === 'CHOICE' || state.mode === 'WRITE') {
            setExitConfirm({ mode: state.mode, dayId: state.dayId });
            return;
        }
        dispatch({ type: 'BACK_DASHBOARD' });
    };

    const handleExitSave = () => {
        saveResumeState({ mode: state.mode, dayId: state.dayId, savedAt: Date.now() });
        setResumeState(loadResumeState());
        setExitConfirm(null);
        dispatch({ type: 'BACK_DASHBOARD' });
    };

    const handleExitDiscard = () => {
        clearResumeState();
        setResumeState(null);
        setExitConfirm(null);
        dispatch({ type: 'BACK_DASHBOARD' });
    };

    useEffect(() => {
        if (!modePickerDayId) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeModePicker();
                return;
            }
            if (e.key === '1') handleStartDayMode('WORD_LIST');
            if (e.key === '2') handleStartDayMode('CHOICE');
            if (e.key === '3') handleStartDayMode('WRITE');
            if (e.key === '4') handleStartDayMode('TEST');
            if (e.key === '5') handleStartDayMode('PROGRESS');
            if (e.key === '6') handleStartDayMode('PLAYER');
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [modePickerDayId, handleStartDayMode, closeModePicker]);

    const handleQuizFinish = (stats: SessionStats) => {
        if (state.dayId && (state.mode === 'CHOICE' || state.mode === 'WRITE' || state.mode === 'TEST')) {
            saveStudySession({
                dataSetId: state.dayId,
                mode: state.mode,
                startTime: stats.startTime,
                endTime: stats.endTime,
                totalCount: stats.totalWordCount,
                correctCount: stats.totalTries - (stats.wrongAttempts || 0),
                wrongCount: stats.wrongAttempts || 0, // Use field from stats
                wrongWords: stats.wrongWords // 상세 오답 기록 저장
            });
            
            // 시험 모드일 경우 최고 점수 갱신
            if (state.mode === 'TEST') {
                const currentScore = Math.round(((stats.totalTries - (stats.wrongAttempts || 0)) / stats.totalWordCount) * 100);
                const key = `best_score_test_${state.dayId}`;
                const bestScore = parseInt(localStorage.getItem(key) || '0', 10);
                if (currentScore > bestScore) {
                    localStorage.setItem(key, currentScore.toString());
                }
            }
        }
        dispatch({ type: 'QUIZ_FINISH', stats });
    };

    const handleDashboard = () => {
        dispatch({ type: 'BACK_DASHBOARD' });
    };

    const navItems = [
        { id: 'DASHBOARD', icon: Home, label: '대시보드', color: 'text-accent' },
        { id: 'WORD_STUDY', icon: Book, label: '단어학습', color: 'text-blue-500' },
        { id: 'BOOKMARKS', icon: Bookmark, label: '나만의 단어장', color: 'text-emerald-500' },
        { id: 'STATS', icon: BarChart, label: '통계', color: 'text-orange-500' },
        { id: 'ARCADE', icon: Gamepad2, label: '아케이드', color: 'text-purple-500' },
        { id: 'HISTORY', icon: History, label: '학습 기록', color: 'text-blue-500' },
        { id: 'SETTINGS', icon: Settings, label: '설정', color: 'text-gray-500' },
        { id: 'PROFILE', icon: UserIcon, label: '프로필', color: 'text-purple-500' },
    ];

    const renderNav = (isMobile = false) => (
        <nav className={`flex-1 overflow-y-auto w-full space-y-2 ${isMobile ? 'px-3' : 'px-2 md:px-3'}`}>
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => {
                        setActiveTab(item.id as any);
                        if (isMobile) setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center ${isMobile ? 'justify-start px-4' : 'justify-center md:justify-start px-0 md:px-4'} py-3 rounded-xl text-sm font-medium transition-colors ${
                        activeTab === item.id
                            ? 'bg-white dark:bg-zinc-800 text-text-primary dark:text-white shadow-sm'
                            : 'text-text-secondary dark:text-zinc-400 hover:text-text-primary dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50'
                    }`}
                    title={item.label}
                >
                    <item.icon size={20} className={`shrink-0 ${activeTab === item.id ? item.color : ''}`} />
                    <span className={`${isMobile ? 'block' : 'hidden md:block'} whitespace-nowrap overflow-hidden ml-3`}>{item.label}</span>
                </button>
            ))}
        </nav>
    );

    const isLearningView = state.view !== 'DASHBOARD' || state.mode === 'WORD_LIST' || state.mode === 'PROGRESS' || state.mode === 'TODAY';
    const showSidebar = !isLearningView || activeTab === 'WORD_STUDY'; 
    // Actually, show sidebar always unless in Quiz/Active Learning Mode?
    // User requirement: Sidebar with tabs. 
    // "Content should move".
    // Let's refine `showSidebar`: 
    // Hide sidebar ONLY when in actual Quiz/Learning session (CHOICE, WRITE, WORD_LIST, TODAY).
    // Show sidebar in Dashboard, WordStudy(Overview), Profile.
    
    // We can assume state.view === 'DASHBOARD' && state.mode is NOT a specific learning sub-mode
    // But current architecture uses 'DASHBOARD' view to hold WordListView as well?
    // Let's check: WordListView is rendered when state.mode === 'WORD_LIST'.
    // So if state.mode is 'WORD_LIST', we are "learning".
    
    // Let's rely on checking if we overlap the main content.
    const isActiveLearning = state.view === 'QUIZ' || state.mode === 'WORD_LIST' || state.mode === 'PROGRESS' || state.mode === 'TODAY';
    const shouldShowSidebar = !isActiveLearning;

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden font-sans select-none text-text-primary relative bg-slate-50">
            {/* Custom Title Bar - Flat Style */}
            <div
                className="h-10 px-4 flex items-center justify-between z-50 bg-slate-100 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800"
                style={{ WebkitAppRegion: 'drag' }}
            >
                <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                    <div className="w-2.5 h-2.5 bg-accent" />
                    <span>VocaMaster</span>
                </div>
                <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' }}>
                    <button
                        onClick={() => ipcRenderer.send('window:minimize')}
                        className="w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center"
                        aria-label="Minimize"
                    >
                        <Minus size={14} />
                    </button>
                    <button
                        onClick={() => ipcRenderer.send('window:toggle-maximize')}
                        className="w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center"
                        aria-label="Maximize"
                    >
                        <Square size={12} />
                    </button>
                    <button
                        onClick={() => ipcRenderer.send('window:close')}
                        className="w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:text-white hover:bg-red-500 transition-colors flex items-center justify-center"
                        aria-label="Close"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative z-10">
                {/* Mobile Sidebar Overlay */}
                <div
                    className={`fixed inset-0 z-50 md:hidden flex transition-opacity duration-300 ${
                        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <div 
                        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
                        onClick={() => setIsMobileMenuOpen(false)} 
                    />
                    <div 
                        className={`relative w-64 bg-slate-100 dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col h-full shadow-2xl transition-transform duration-300 ease-out z-50 ${
                            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                    >
                             <div className="h-16 flex items-center px-6 gap-3 font-bold text-xl tracking-tighter text-text-primary dark:text-white">
                                <Trophy className="text-accent shrink-0" /> <span>VocaMaster</span>
                            </div>
                            {renderNav(true)}
                    </div>
                </div>
                
                {/* Floating Hamburger Button for Mobile - Glassmorphism Style */}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className={`fixed bottom-6 right-6 z-40 md:hidden w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) backdrop-blur-md border border-white/40 dark:border-white/10 overflow-hidden ${
                        shouldShowSidebar ? 'hidden' : ''
                    } ${
                        isMobileMenuOpen 
                            ? 'scale-0 opacity-0 rotate-90' 
                            : 'scale-100 opacity-100 rotate-0 bg-white/60 dark:bg-zinc-800/60 text-slate-800 dark:text-white hover:bg-white/80 dark:hover:bg-zinc-700/80 hover:scale-105 active:scale-95'
                    }`}
                    aria-label="Menu"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 pointer-events-none" />
                    <Menu size={24} className="relative z-10 drop-shadow-sm" />
                </button>


                {/* Flat Sidebar - Terrain Style */}
                {shouldShowSidebar && (
                    <div className="hidden md:flex w-20 md:w-64 bg-slate-100 dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex-col h-full shrink-0 z-20 transition-all duration-300">
                        <div className="h-20 flex items-center justify-center md:justify-start px-0 md:px-6 gap-3 font-bold text-xl tracking-tighter text-text-primary dark:text-white overflow-hidden whitespace-nowrap">
                            <Trophy className="text-accent shrink-0" /> <span className="hidden md:inline">VocaMaster</span>
                        </div>
                        {renderNav(false)}
                    </div>
                )}

                {/* Main Content Area */}
                <main className="flex-1 relative overflow-hidden bg-white dark:bg-[#09090b]">
                    <div className="w-full h-full relative flex flex-col">
                        
                        {/* 1. Dashboard Tab Content */}
                        {activeTab === 'DASHBOARD' && !isActiveLearning && (
                            <DashboardView />
                        )}

                        {/* 2. Word Study Tab Content */}
                        {activeTab === 'WORD_STUDY' && !isActiveLearning && (
                             <WordStudyView onOpenModePicker={openModePicker} resumeState={resumeState} onResume={handleResume} />
                        )}

                        {/* 5. History Tab Content */}
                        {activeTab === 'HISTORY' && !isActiveLearning && (
                            <HistoryView />
                        )}

                        {/* 3. Bookmarks Tab Content */}
                        {activeTab === 'BOOKMARKS' && !isActiveLearning && (
                            <BookmarksView />
                        )}

                        {/* 4. Stats Tab Content */}
                        {activeTab === 'STATS' && !isActiveLearning && (
                            <StatsView />
                        )}

                        {/* Arcade Tab Content */}
                        {activeTab === 'ARCADE' && !isActiveLearning && (
                            <ArcadeView />
                        )}

                        {/* 5. Settings Tab Content */}
                        {activeTab === 'SETTINGS' && !isActiveLearning && (
                            <SettingsView theme={state.theme ?? 'light'} onThemeChange={(theme) => dispatch({ type: 'SET_THEME', theme })} />
                        )}

                        {/* Active Learning Views (Take over the screen) */}
                        {state.mode === 'WORD_LIST' && state.dayId && (
                            <WordListView dataSetId={state.dayId} onExit={handleDashboard} />
                        )}

                        {state.mode === 'PLAYER' && state.dayId && (
                            <PlayerView dataSetId={state.dayId} onExit={handleDashboard} />
                        )}

                        {state.mode === 'PROGRESS' && (
                            <ProgressView dataSetId={state.dayId ?? undefined} onExit={handleDashboard} />
                        )}

                        {state.mode === 'TODAY' && (
                            <TodayStudyView onExit={requestExit} />
                        )}

                        {/* 6. Profile Tab Content */}
                        {activeTab === 'PROFILE' && !isActiveLearning && (
                            <ProfileView 
                                theme={state.theme ?? 'light'} 
                                onThemeChange={(theme) => dispatch({ type: 'SET_THEME', theme })} 
                            />
                        )}

                        {state.view === 'QUIZ' && state.dayId && (state.mode === 'CHOICE' || state.mode === 'WRITE') && (
                            <QuizSessionManager
                                key={`${state.dayId}-${state.mode}`}
                                dataSetId={state.dayId}
                                mode={state.mode as QuizMode}
                                onFinish={handleQuizFinish}
                                onQuit={handleDashboard}
                                renderQuizUI={(props) => (
                                    state.mode === 'CHOICE'
                                        ? <ChoiceQuizUI {...props} />
                                        : <WriteQuizUI {...props} />
                                )}
                            />
                        )}

                        {state.view === 'QUIZ' && state.dayId && state.mode === 'TEST' && (
                            <TestSessionManager
                                dataSetId={state.dayId}
                                onFinish={handleQuizFinish}
                                onQuit={handleDashboard}
                            />
                        )}

                        {state.view === 'RESULT' && state.lastStats && (
                            <ResultView 
                                stats={state.lastStats} 
                                words={DATA_SETS.find(d => d.id === state.dayId)?.words}
                                onRetry={() => dispatch({ type: 'RETRY_QUIZ' })} 
                                onDashboard={handleDashboard} 
                            />
                        )}
                    </div>
                </main>
            </div>

            {/* Mode Picker Modal */}
            {modePickerDayId && (
                <div className="absolute inset-0 z-50 bg-black/50 dark:bg-black/80 flex items-center justify-center animate-in fade-in duration-200 backdrop-blur-sm" onClick={closeModePicker}>
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 w-full max-w-2xl p-4 md:p-8 rounded-3xl mx-4 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between gap-4 mb-4 md:mb-8">
                            <div>
                                <p className="text-xs text-accent font-bold tracking-widest uppercase mb-2">학습 모드 선택</p>
                                <h3 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-white">
                                    {DATA_SETS.find(d => d.id === modePickerDayId)?.title ?? '선택한 Day'}
                                </h3>
                                <p className="text-text-secondary dark:text-zinc-400 text-sm mt-2">키보드 숫자키 1~4를 눌러 빠르게 시작하세요.</p>
                            </div>
                            <button onClick={closeModePicker} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-text-secondary dark:text-zinc-400 hover:text-text-primary dark:hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button onClick={() => handleStartDayMode('WORD_LIST')} className="group text-left p-6 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700 hover:border-accent dark:hover:border-accent hover:bg-white dark:hover:bg-zinc-800 transition-all relative overflow-hidden">
                                <div className="absolute top-4 right-4 text-xs font-bold text-text-secondary dark:text-zinc-500 border border-slate-200 dark:border-zinc-700 px-2 py-1 rounded-md bg-white dark:bg-zinc-900">1</div>
                                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                    <Library size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-text-primary dark:text-white mb-1">단어장</h3>
                                <p className="text-sm text-text-secondary dark:text-zinc-400">전체 단어 목록 학습</p>
                            </button>

                            <button onClick={() => handleStartDayMode('CHOICE')} className="group text-left p-6 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700 hover:border-accent dark:hover:border-accent hover:bg-white dark:hover:bg-zinc-800 transition-all relative overflow-hidden">
                                <div className="absolute top-4 right-4 text-xs font-bold text-text-secondary dark:text-zinc-500 border border-slate-200 dark:border-zinc-700 px-2 py-1 rounded-md bg-white dark:bg-zinc-900">2</div>
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                    <BookOpen size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-text-primary dark:text-white mb-1">객관식 퀴즈</h3>
                                <p className="text-sm text-text-secondary dark:text-zinc-400">4지 선다형 복습</p>
                            </button>

                            <button onClick={() => handleStartDayMode('WRITE')} className="group text-left p-6 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700 hover:border-accent dark:hover:border-accent hover:bg-white dark:hover:bg-zinc-800 transition-all relative overflow-hidden">
                                <div className="absolute top-4 right-4 text-xs font-bold text-text-secondary dark:text-zinc-500 border border-slate-200 dark:border-zinc-700 px-2 py-1 rounded-md bg-white dark:bg-zinc-900">3</div>
                                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                    <Keyboard size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-text-primary dark:text-white mb-1">받아쓰기</h3>
                                <p className="text-sm text-text-secondary dark:text-zinc-400">예문 듣고 빈칸 채우기</p>
                            </button>

                            <button onClick={() => handleStartDayMode('TEST')} className="group text-left p-6 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700 hover:border-red-500 dark:hover:border-red-500 hover:bg-white dark:hover:bg-zinc-800 transition-all relative overflow-hidden">
                                <div className="absolute top-4 right-4 text-xs font-bold text-text-secondary dark:text-zinc-500 border border-slate-200 dark:border-zinc-700 px-2 py-1 rounded-md bg-white dark:bg-zinc-900">4</div>
                                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                    <FileCheck size={24} />
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h3 className="text-xl font-bold text-text-primary dark:text-white mb-1">실전 모의고사</h3>
                                        <p className="text-sm text-text-secondary dark:text-zinc-400">즉시 채점 없는 실전 테스트</p>
                                    </div>
                                    {localStorage.getItem(`best_score_test_${modePickerDayId}`) && (
                                        <div className="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded border border-amber-100 dark:border-amber-800">
                                            Best: {localStorage.getItem(`best_score_test_${modePickerDayId}`)}점
                                        </div>
                                    )}
                                </div>
                            </button>

                            <button onClick={() => handleStartDayMode('PROGRESS')} className="group text-left p-6 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700 hover:border-accent dark:hover:border-accent hover:bg-white dark:hover:bg-zinc-800 transition-all relative overflow-hidden">
                                <div className="absolute top-4 right-4 text-xs font-bold text-text-secondary dark:text-zinc-500 border border-slate-200 dark:border-zinc-700 px-2 py-1 rounded-md bg-white dark:bg-zinc-900">5</div>
                                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                    <Trophy size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-text-primary dark:text-white mb-1">학습 현황</h3>
                                <p className="text-sm text-text-secondary dark:text-zinc-400">진도율 확인</p>
                            </button>

                            <button onClick={() => handleStartDayMode('PLAYER')} className="group text-left p-6 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700 hover:border-accent dark:hover:border-accent hover:bg-white dark:hover:bg-zinc-800 transition-all relative overflow-hidden">
                                <div className="absolute top-4 right-4 text-xs font-bold text-text-secondary dark:text-zinc-500 border border-slate-200 dark:border-zinc-700 px-2 py-1 rounded-md bg-white dark:bg-zinc-900">6</div>
                                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                    <Play size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-text-primary dark:text-white mb-1">재생 모드</h3>
                                <p className="text-sm text-text-secondary dark:text-zinc-400">오디오 플레이어로 학습</p>
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* Exit Confirmation Modal - unchanged */}
            {exitConfirm && (
                <div className="absolute inset-0 z-50 bg-black/20 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white border border-slate-200 w-full max-w-md p-6 rounded-3xl mx-4 shadow-xl scale-100 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-3">학습을 종료할까요?</h3>
                        <p className="text-text-secondary mb-8 leading-relaxed">진행 상황을 저장하면<br/>나중에 이어서 계속할 수 있어요.</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleExitSave}
                                className="w-full py-4 text-white bg-accent hover:bg-accent/90 rounded-xl font-bold text-lg shadow-sm transition-all hover:-translate-y-0.5"
                            >
                                저장하고 종료
                            </button>
                            <button
                                onClick={handleExitDiscard}
                                className="w-full py-4 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl font-bold text-lg transition-colors border border-red-100"
                            >
                                저장하지 않고 종료
                            </button>
                            <button
                                onClick={() => setExitConfirm(null)}
                                className="w-full py-3 text-text-secondary hover:text-text-primary font-medium transition-colors"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;