import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';

import { DATA_SETS } from '../data';
import { getWordsWithStats } from '../db';
import type { TodayDayStats } from '../app/types';
import QuizSessionManager from './QuizSessionManager';
import WriteQuizUI from './WriteQuizUI';

const TodayStudyView = ({ onExit }: { onExit: () => void }) => {
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dayStats, setDayStats] = useState<TodayDayStats | null>(null);
    const [allDone, setAllDone] = useState(false);
    const [sessionKey, setSessionKey] = useState(0);
    const loadIdRef = useRef(0);

    const loadNextIncomplete = useCallback(async (startIndex: number) => {
        const loadId = ++loadIdRef.current;
        setLoading(true);

        for (let i = startIndex; i < DATA_SETS.length; i += 1) {
            const dataSet = DATA_SETS[i];
            const { queue, mastered, totalCount } = await getWordsWithStats(dataSet.id, 'WRITE');

            if (loadIdRef.current !== loadId) return;

            if (queue.length > 0) {
                setCurrentIndex(i);
                setDayStats({
                    id: dataSet.id,
                    title: dataSet.title,
                    remaining: queue.length,
                    total: totalCount,
                    mastered: mastered.length
                });
                setAllDone(false);
                setLoading(false);
                return;
            }
        }

        if (loadIdRef.current !== loadId) return;

        setDayStats(null);
        setAllDone(true);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadNextIncomplete(0);
    }, [loadNextIncomplete]);

    const handleSessionFinish = useCallback(() => {
        void (async () => {
            await loadNextIncomplete(currentIndex);
            setSessionKey(prev => prev + 1);
        })();
    }, [loadNextIncomplete, currentIndex]);

    if (loading) {
        return <div className="text-white p-8 animate-pulse">오늘의 학습 불러오는 중...</div>;
    }

    if (allDone) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full bg-[#121212] p-8">
                <div className="text-center max-w-xl">
                    <p className="text-[#1db954] font-bold tracking-widest uppercase mb-3 text-sm">오늘의 학습</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">모든 Day 완료</h1>
                    <p className="text-zinc-400">예문퀴즈 기준으로 모든 Day를 완료했습니다.</p>
                </div>
            </div>
        );
    }

    if (!dayStats) {
        return <div className="text-white p-8">학습 데이터를 찾을 수 없습니다.</div>;
    }

    const nextIndex = currentIndex + 1 < DATA_SETS.length ? currentIndex + 1 : null;
    const nextTitle = nextIndex !== null ? DATA_SETS[nextIndex].title : 'Completed';
    const remainingDays = Math.max(0, DATA_SETS.length - currentIndex - 1);
    const masteryPercent = dayStats.total > 0 ? (dayStats.mastered / dayStats.total) * 100 : 0;

    return (
        <div className="flex flex-col h-full w-full bg-[#121212]">
            <div className="p-6 md:p-8 border-b border-[#1f1f1f]">
                <div className="flex items-center justify-between gap-6">
                    <div>
                        <p className="text-xs text-[#1db954] font-bold tracking-widest uppercase">오늘의 학습</p>
                        <h2 className="text-3xl font-bold text-white mt-2">{dayStats.title}</h2>
                        <p className="text-zinc-400 text-sm mt-1">예문퀴즈 순차 진행</p>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="bg-[#181818] p-4 rounded-lg border border-[#282828]">
                            <div className="text-xs text-zinc-500 uppercase mb-1">남은 단어</div>
                            <div className="text-xl font-bold text-white">{dayStats.remaining} / {dayStats.total}</div>
                        </div>
                        <div className="bg-[#181818] p-4 rounded-lg border border-[#282828]">
                            <div className="text-xs text-zinc-500 uppercase mb-1">다음 Day</div>
                            <div className="text-sm font-bold text-[#1ed760] truncate max-w-[180px]">{nextTitle}</div>
                            <div className="text-xs text-zinc-500 mt-1">{remainingDays}일 남음</div>
                        </div>
                        <button onClick={() => onExit()} className="text-zinc-400 hover:text-[#1db954] text-sm font-bold flex items-center gap-2">
                            <ChevronRight size={16} className="rotate-180" /> 종료
                        </button>
                    </div>
                </div>
                <div className="mt-4 w-full h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#1db954] transition-all duration-700"
                        style={{ width: `${masteryPercent}%` }}
                    />
                </div>
            </div>

            <div className="flex-1">
                <QuizSessionManager
                    key={`${dayStats.id}-${sessionKey}`}
                    dataSetId={dayStats.id}
                    mode="WRITE"
                    onFinish={handleSessionFinish}
                    onQuit={onExit}
                    renderQuizUI={(props) => <WriteQuizUI {...props} />}
                />
            </div>
        </div>
    );
};

export default TodayStudyView;
