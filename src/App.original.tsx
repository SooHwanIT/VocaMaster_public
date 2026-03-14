import React, { useCallback, useEffect, useState } from 'react';
import { Book, BookOpen, Home, Keyboard, Library, Minus, Square, Trophy, X, User as UserIcon, BarChart, Bookmark, Settings, History, Gamepad2, FileCheck, Menu, Play, ChevronRight } from 'lucide-react';

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
import TestModeUI from './components/TestModeUI';
import TestResultView from './components/TestResultView';

const App = () => {
    const [state, dispatch] = React.useReducer(appReducer, undefined, getInitialState);
    const [modePickerDayId, setModePickerDayId] = useState<string | null>(null);
    const [resumeState, setResumeState] = useState<ResumeState | null>(() => loadResumeState());
    const [exitConfirm, setExitConfirm] = useState<{ mode: AppMode; dayId: string | null } | null>(null);

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
                wrongCount: stats.wrongAttempts || 0, 
                wrongWords: stats.wrongWords 
            });
            
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
    
    const isActiveLearning = state.view === 'QUIZ' || state.mode === 'WORD_LIST' || state.mode === 'PROGRESS' || state.mode === 'TODAY';
    const shouldShowSidebar = !isActiveLearning;

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden font-sans select-none text-text-primary relative bg-slate-50">
            <div className="h-10 px-4 flex items-center justify-between z-50 bg-slate-100 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                    <div className="w-2.5 h-2.5 bg-accent" />
                    <span>VocaMaster</span>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative z-10">
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
                
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className={`fixed bottom-6 right-6 z-40 md:hidden w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) backdrop-blur-md border border-white/40 dark:border-white/10 overflow-hidden ${
                        shouldShowSidebar ? 'hidden' : ''
                    } ${
                        isMobileMenuOpen 
                            ? 'scale-0 opacity-0 rotate-90' 
                            : 'scale-100 opacity-100 rotate-0 bg-white/60 dark:bg-zinc-800/60 text-slate-800 dark:text-white hover:bg-white/80 dark:hover:bg-zinc-700/80 hover:scale-105 active:scale-95'
                    }`}
                >
                     {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div 
                    className={`hidden md:flex flex-col border-r border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                        shouldShowSidebar ? 'w-64 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-8 border-none overflow-hidden'
                    }`}
                >
                    <div className="h-16 flex items-center px-6 gap-3 font-bold text-xl tracking-tighter text-text-primary dark:text-white shrink-0">
                        <Trophy className="text-accent shrink-0" /> <span>VocaMaster</span>
                    </div>
                    {renderNav()}
                    
                    <div className="p-4 mt-auto border-t border-slate-200 dark:border-zinc-800 shrink-0">
                        <div className="p-4 rounded-xl bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30">
                            <div className="flex items-center gap-2 mb-2 text-orange-700 dark:text-orange-400 font-semibold text-sm">
                                <Trophy size={16} />
                                <span>오늘의 습관</span>
                            </div>
                            <div className="text-xs text-orange-600 dark:text-orange-500/80 leading-relaxed">
                                매일 10분씩 학습하면<br/>1년이면 3,650단어!
                            </div>
                        </div>
                    </div>
                </div>

                <main className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-[#09090b]">
                    {state.view === 'DASHBOARD' ? (
                        <>
                            {activeTab === 'DASHBOARD' && (
                                <DashboardView 
                                    onResume={handleResume}
                                    resumeState={resumeState}
                                    onOpenModePicker={openModePicker}
                                    stats={state.stats}
                                />
                            )}
                            {activeTab === 'WORD_STUDY' && (
                                <WordStudyView onSelectDay={(dayId) => openModePicker(dayId)} />
                            )}
                            {activeTab === 'BOOKMARKS' && (
                                <BookmarksView />
                            )}
                             {activeTab === 'STATS' && (
                                <StatsView />
                            )}
                             {activeTab === 'HISTORY' && (
                                <HistoryView />
                            )}
                            {activeTab === 'SETTINGS' && (
                                <SettingsView />
                            )}
                            {activeTab === 'PROFILE' && (
                                <ProfileView />
                            )}
                            {activeTab === 'ARCADE' && (
                                <ArcadeView />
                            )}
                        </>
                    ) : (
                         <div className="absolute inset-0 z-20 bg-white dark:bg-[#09090b]">
                            {state.mode === 'WORD_LIST' && state.dayId && (
                                <WordListView 
                                    dataSetId={state.dayId} 
                                    onExit={requestExit} 
                                />
                            )}
                            {state.mode === 'CHOICE' && state.dayId && (
                                <QuizSessionManager
                                    dataSetId={state.dayId}
                                    mode="CHOICE"
                                    onFinish={handleQuizFinish}
                                    onExit={requestExit}
                                >
                                    {(props) => <ChoiceQuizUI {...props} />}
                                </QuizSessionManager>
                            )}
                            {state.mode === 'WRITE' && state.dayId && (
                                <QuizSessionManager
                                    dataSetId={state.dayId}
                                    mode="WRITE"
                                    onFinish={handleQuizFinish} 
                                    onExit={requestExit}
                                >
                                    {(props) => <WriteQuizUI {...props} />}
                                </QuizSessionManager>
                            )}
                            {state.mode === 'TEST' && state.dayId && (
                                <TestSessionManager
                                    dataSetId={state.dayId}
                                    onFinish={handleQuizFinish}
                                    onExit={requestExit}
                                >
                                    {(props) => <TestModeUI {...props} />}
                                </TestSessionManager>
                            )}
                             {state.mode === 'PROGRESS' && state.dayId && (
                                <ProgressView dataSetId={state.dayId} onExit={requestExit} />
                            )}
                            
                            {state.mode === 'PLAYER' && state.dayId && (
                                <PlayerView dataSetId={state.dayId} onExit={requestExit} />
                            )}

                            {state.mode === 'TODAY' && (
                                <TodayStudyView onExit={requestExit} />
                            )}

                            {state.view === 'RESULT' && state.lastSessionStats && (
                                state.mode === 'TEST' 
                                ? <TestResultView stats={state.lastSessionStats} onExit={handleDashboard} />
                                : <ResultView stats={state.lastSessionStats} onExit={handleDashboard} />
                            )}
                        </div>
                    )}
                    
                    {modePickerDayId && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 w-full max-w-md m-4 border border-slate-200 dark:border-zinc-800">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <BookOpen className="text-accent" /> 학습 모드 선택
                                    </h3>
                                    <button 
                                        onClick={closeModePicker}
                                        className="p-2 -mr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleStartDayMode('WORD_LIST')}
                                        className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 transition-all group text-left"
                                    >
                                        <div className="flex items-center gap-2 mb-2 font-bold text-blue-700 dark:text-blue-400">
                                            <Book size={20} /> 단어장
                                        </div>
                                        <div className="text-xs text-blue-600/80 dark:text-blue-400/80">
                                            전체 단어를 리스트로 학습합니다.
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handleStartDayMode('CHOICE')}
                                        className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-800 transition-all group text-left"
                                    >
                                        <div className="flex items-center gap-2 mb-2 font-bold text-purple-700 dark:text-purple-400">
                                            <Keyboard size={20} /> 객관식 퀴즈
                                        </div>
                                        <div className="text-xs text-purple-600/80 dark:text-purple-400/80">
                                            4지 선다형 퀴즈를 풉니다.
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handleStartDayMode('WRITE')}
                                        className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 transition-all group text-left"
                                    >
                                        <div className="flex items-center gap-2 mb-2 font-bold text-emerald-700 dark:text-emerald-400">
                                            <FileCheck size={20} /> 주관식/받아쓰기
                                        </div>
                                        <div className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                                            직접 쓰거나 말하며 학습합니다.
                                        </div>
                                    </button>
                                     <button
                                        onClick={() => handleStartDayMode('PLAYER')}
                                        className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 transition-all group text-left"
                                    >
                                        <div className="flex items-center gap-2 mb-2 font-bold text-indigo-700 dark:text-indigo-400">
                                            <Play size={20} /> 단어 플레이어
                                        </div>
                                        <div className="text-xs text-indigo-600/80 dark:text-indigo-400/80">
                                            단어를 자동으로 재생하며 듣습니다.
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handleStartDayMode('TEST')}
                                        className="col-span-2 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 border border-orange-200 dark:border-orange-800 transition-all group text-left flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2 mb-1 font-bold text-orange-700 dark:text-orange-400">
                                                <Trophy size={20} /> 시험 모드
                                            </div>
                                            <div className="text-xs text-orange-600/80 dark:text-orange-400/80">
                                                실전처럼 테스트를 봅니다. (점수 기록)
                                            </div>
                                        </div>
                                        <ChevronRight className="text-orange-300 group-hover:text-orange-500 transition-colors" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {exitConfirm && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm m-4 border border-slate-200 dark:border-zinc-800 text-center">
                                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">학습을 종료하시겠습니까?</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                    진행 중인 내용은 저장하거나 삭제할 수 있습니다.
                                </p>
                                <div className="flex flex-col gap-2">
                                     <button
                                        onClick={handleExitSave}
                                        className="w-full py-3 rounded-xl bg-accent text-white font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
                                    >
                                        저장하고 종료
                                    </button>
                                    <button
                                        onClick={handleExitDiscard}
                                        className="w-full py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                                    >
                                        저장하지 않고 종료
                                    </button>
                                    <button
                                        onClick={() => setExitConfirm(null)}
                                        className="w-full py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-medium transition-colors mt-2"
                                    >
                                        계속 학습하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
