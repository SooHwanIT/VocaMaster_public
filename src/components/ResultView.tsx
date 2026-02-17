import React from 'react';
import { Library, RotateCcw } from 'lucide-react';

import type { SessionStats } from '../app/types';

const ResultView = ({
    stats,
    onRetry,
    onDashboard
}: {
    stats: SessionStats;
    onRetry: () => void;
    onDashboard: () => void;
}) => {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-white dark:bg-[#121212] p-8 animate-fade-in">
            <div className="text-center max-w-2xl w-full">
                <p className="text-[#1db954] font-bold tracking-widest uppercase mb-4 text-sm">학습 완료</p>
                <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-900 dark:text-white mb-6 tracking-tighter">오늘의 목표</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    <div className="bg-zinc-50 dark:bg-[#181818] p-6 rounded-lg border border-zinc-200 dark:border-[#282828]">
                        <div className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase mb-2">총 시도</div>
                        <div className="text-3xl font-bold text-zinc-900 dark:text-white">{stats.totalTries}</div>
                    </div>
                    <div className="bg-zinc-50 dark:bg-[#181818] p-6 rounded-lg border border-zinc-200 dark:border-[#282828]">
                        <div className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase mb-2">새로 마스터</div>
                        <div className="text-3xl font-bold text-[#1db954]">+{stats.masteredCount}</div>
                    </div>
                    <div className="bg-zinc-50 dark:bg-[#181818] p-6 rounded-lg border border-zinc-200 dark:border-[#282828]">
                        <div className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase mb-2">보완 필요</div>
                        <div className="text-xl font-bold text-red-500 dark:text-red-400 truncate">{stats.mostWrong}</div>
                    </div>
                </div>

                <div className="flex justify-center items-center gap-6">
                    <button onClick={onRetry} className="px-8 py-3 bg-[#1db954] text-white dark:text-black rounded-full font-bold hover:bg-[#1ed760] transition-colors text-sm tracking-wide flex items-center gap-2">
                        <RotateCcw size={16} /> 계속하기
                    </button>
                    <button onClick={onDashboard} className="px-8 py-3 bg-transparent border border-zinc-300 dark:border-[#2a2a2a] text-zinc-900 dark:text-white rounded-full font-bold hover:border-zinc-400 dark:hover:border-[#3a3a3a] transition-colors text-sm tracking-wide flex items-center gap-2">
                        <Library size={16} /> 대시보드
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultView;
