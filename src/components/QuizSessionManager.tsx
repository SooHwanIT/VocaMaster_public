import React, { useEffect, useState } from 'react';

import { getWordsWithStats, updateWordStats } from '../db';
import {
    clearQuizSession,
    clearResumeState,
    loadQuizSession,
    loadResumeState,
    saveQuizSession,
    saveResumeState
} from '../app/storage';
import type { QuizSessionItem, QuizSessionSnapshot, QuizUIProps, SessionStats } from '../app/types';

type QuizStudyMode = 'CHOICE' | 'WRITE';

const QuizSessionManager = ({
    dataSetId,
    mode,
    onFinish,
    onQuit,
    renderQuizUI
}: {
    dataSetId: string;
    mode: QuizStudyMode;
    onFinish: (stats: SessionStats) => void;
    onQuit: () => void;
    renderQuizUI: (props: QuizUIProps) => React.ReactElement;
}) => {
    const [loading, setLoading] = useState(true);
    const [queue, setQueue] = useState<QuizSessionItem[]>([]);
    const [current, setCurrent] = useState<QuizSessionItem | null>(null);
    const [masteredCount, setMasteredCount] = useState(0);
    const [totalWordCount, setTotalWordCount] = useState(0);
    const [newMasteredInSession, setNewMasteredInSession] = useState(0);
    const [allWordsList, setAllWordsList] = useState<string[]>([]);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [micEnabled, setMicEnabled] = useState(false);

    const [sessionTries, setSessionTries] = useState(0);
    const [sessionWrongs, setSessionWrongs] = useState<Record<string, number>>({});
    
    // Track session start time
    const startTimeRef = React.useRef(Date.now());

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            const saved = loadQuizSession(dataSetId, mode);
            const { queue: freshQueue, mastered, totalCount } = await getWordsWithStats(dataSetId, mode);
            const allWords = [...freshQueue, ...mastered];
            setAllWordsList(allWords.map(w => w.word));
            const map = new Map(allWords.map(w => [w.id, w]));

            if (saved && saved.queue.length > 0) {
                const restoredQueue = saved.queue
                    .map(item => {
                        const word = map.get(item.id);
                        if (!word) return null;
                        return { ...word, sessionStatus: item.sessionStatus } as QuizSessionItem;
                    })
                    .filter((item): item is QuizSessionItem => Boolean(item));

                if (restoredQueue.length > 0) {
                    setQueue(restoredQueue);
                    setCurrent(restoredQueue[0]);
                    setMasteredCount(mastered.length);
                    setTotalWordCount(totalCount);
                    setNewMasteredInSession(saved.newMasteredInSession || 0);
                    setSessionTries(saved.sessionTries || 0);
                    setSessionWrongs(saved.sessionWrongs || {});
                    setLoading(false);
                    return;
                }
            }

            const shuffled = freshQueue.map(w => ({ ...w, sessionStatus: 'pending' as const }));
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            setQueue(shuffled);
            setMasteredCount(mastered.length);
            setTotalWordCount(totalCount);
            setLoading(false);
        };
        init();
    }, [dataSetId, mode]);

    useEffect(() => {
        if (!loading && !current) {
            if (queue.length > 0) {
                setCurrent(queue[0]);
            } else if (totalWordCount > 0) {
                finishSession();
            }
        }
    }, [queue, current, loading, totalWordCount]);

    const finishSession = () => {
        clearQuizSession(dataSetId, mode);
        const resume = loadResumeState();
        if (resume && resume.mode === mode && resume.dayId === dataSetId) {
            clearResumeState();
        }
        let maxWrong = 0;
        let worstWord = '없음';
        let totalWrongs = 0;
        Object.entries(sessionWrongs).forEach(([word, cnt]) => {
            if (cnt > maxWrong) { maxWrong = cnt; worstWord = `${word} (${cnt})`; }
            totalWrongs += cnt;
        });
        
        onFinish({
            totalTries: sessionTries, 
            mostWrong: worstWord, 
            masteredCount: newMasteredInSession,
            startTime: startTimeRef.current,
            endTime: Date.now(),
            totalWordCount: totalWordCount,
            wrongAttempts: totalWrongs
        });
    };

    const handleResult = async (isCorrect: boolean) => {
        if (!current) return;

        setSessionTries(prev => prev + 1);
        if (!isCorrect) {
            setSessionWrongs(prev => ({ ...prev, [current.word]: (prev[current.word] || 0) + 1 }));
        }

        const currentScore = current.record ? current.record.memoryScore : 0;
        const hadWrongBefore = (current.record?.wrongCnt ?? 0) > 0;
        const isRetry = current.sessionStatus === 'wrong';
        const scoreDelta = isCorrect
            ? ((isRetry || hadWrongBefore) ? 1 : 2)
            : -1;
        const nextScore = Math.max(-3, Math.min(3, currentScore + scoreDelta));
        const masteredNow = nextScore >= 3 && currentScore < 3;

        updateWordStats(current.id, dataSetId, mode, isCorrect, scoreDelta);

        setQueue(prev => {
            const nextQueue = [...prev];
            nextQueue.shift();

            if (isCorrect) {
                if (masteredNow) {
                    setNewMasteredInSession(prev => prev + 1);
                }
            } else {
                const retryItem = { ...current, sessionStatus: 'wrong' as const };
                const insertIdx = Math.min(nextQueue.length, 3);
                nextQueue.splice(insertIdx, 0, retryItem);
            }
            return nextQueue;
        });

        setCurrent(null);
    };

    if (loading) return <div className="text-zinc-800 dark:text-white p-8 animate-pulse">학습 데이터를 불러오는 중...</div>;
    if (!current && queue.length === 0 && totalWordCount === 0) return <div className="text-zinc-800 dark:text-white">단어가 없습니다.</div>;

    const totalMastered = masteredCount + newMasteredInSession;
    const currentQueueSize = queue.length;
    const sessionPercent = (totalWordCount > 0)
        ? ((totalWordCount - totalMastered - currentQueueSize) / totalWordCount) * 100
        : 0;
    const masterPercent = (totalMastered / totalWordCount) * 100;

    const handleSuspend = () => {
        // 중단하기 (저장 후 종료)
        // 1. 현재 상태 저장 (Resume)
        const snapshot: QuizSessionSnapshot = {
            dataSetId,
            mode,
            // 큐 상태 저장: 현재 진행중인 단어 포함
            queue: (current ? [current, ...queue] : queue).map(item => ({ id: item.id, sessionStatus: item.sessionStatus })),
            sessionTries,
            sessionWrongs,
            masteredCount,
            totalWordCount,
            newMasteredInSession
        };
        saveQuizSession(snapshot);
        saveResumeState({ mode, dayId: dataSetId, savedAt: Date.now() });

        // 2. 학습 기록 저장 (History) - 부분 결과라도 저장
        let maxWrong = 0;
        let worstWord = '없음';
        let totalWrongs = 0;
        Object.entries(sessionWrongs).forEach(([word, cnt]) => {
            if (cnt > maxWrong) { maxWrong = cnt; worstWord = `${word} (${cnt})`; }
            totalWrongs += cnt;
        });

        // 현재까지의 오답 목록 수집
        const wrongWordsList = Object.keys(sessionWrongs);

        onFinish({
            totalTries: sessionTries, 
            mostWrong: worstWord, 
            masteredCount: newMasteredInSession,
            startTime: startTimeRef.current,
            endTime: Date.now(),
            totalWordCount: totalWordCount, // 전체 단어 수 (진행률 계산용)
            wrongAttempts: totalWrongs,
            wrongWords: wrongWordsList
        });
        // onFinish가 Result화면을 보여주므로 onQuit는 호출하지 않음 (ResultView에서 홈으로 이동)
        setShowExitConfirm(false);
    };

    const handleQuitNow = () => {
        clearQuizSession(dataSetId, mode);
        const resume = loadResumeState();
        if (resume && resume.mode === mode && resume.dayId === dataSetId) {
            clearResumeState();
        }
        setShowExitConfirm(false);
        onQuit();
    };

    return (
        <>
            {renderQuizUI({
                current,
                remainingCount: queue.length,
                masterPercent,
                sessionPercent,
                totalCount: totalWordCount,
                onResult: handleResult,
                onExit: () => setShowExitConfirm(true),
                micEnabled,
                setMicEnabled,
                allWords: allWordsList
            })}

            {showExitConfirm && (
                <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-md p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">학습을 중단할까요?</h3>
                        <p className="text-slate-500 dark:text-zinc-400 mb-8 leading-relaxed">
                            현재까지의 학습 내용을 저장합니다.<br/>
                            작성한 오답 노트와 통계가 기록되며,<br/>
                            나중에 이어서 계속할 수 있습니다.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleSuspend} 
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                            >
                                중단하고 결과 보기
                            </button>
                            <button
                                onClick={handleQuitNow}
                                className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 rounded-xl font-bold transition-colors"
                            >
                                저장하지 않고 종료
                            </button>
                            <button 
                                onClick={() => setShowExitConfirm(false)} 
                                className="w-full py-3 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white font-medium transition-colors"
                            >
                                계속 학습하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuizSessionManager;
