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
import type { QuizMode, QuizSessionItem, QuizSessionSnapshot, QuizUIProps, SessionStats } from '../app/types';

const QuizSessionManager = ({
    dataSetId,
    mode,
    onFinish,
    onQuit,
    renderQuizUI
}: {
    dataSetId: string;
    mode: QuizMode;
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

    const handleSaveExit = () => {
        const snapshot: QuizSessionSnapshot = {
            dataSetId,
            mode,
            queue: queue.map(item => ({ id: item.id, sessionStatus: item.sessionStatus })),
            sessionTries,
            sessionWrongs,
            masteredCount,
            totalWordCount,
            newMasteredInSession
        };
        saveQuizSession(snapshot);
        saveResumeState({ mode, dayId: dataSetId, savedAt: Date.now() });
        setShowExitConfirm(false);
        onQuit();
    };

    const handleDiscardExit = () => {
        clearQuizSession(dataSetId, mode);
        clearResumeState();
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
                <div className="absolute inset-0 z-40 bg-black/70 flex items-center justify-center transition-colors">
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-xl transition-colors">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 transition-colors">학습을 종료할까요?</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 transition-colors">저장하면 다음 학습에서 이어할 수 있습니다.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowExitConfirm(false)} className="px-4 py-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">취소</button>
                            <button onClick={handleDiscardExit} className="px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-full text-zinc-800 dark:text-white hover:border-slate-400 dark:hover:border-zinc-500 transition-colors">저장 안 함</button>
                            <button onClick={handleSaveExit} className="px-4 py-2 bg-[#1db954] hover:bg-[#1ed760] text-white rounded-full font-bold transition-all shadow-lg hover:shadow-[#1db954]/20 hover:scale-105">
                                저장하고 종료
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuizSessionManager;
