import React from 'react';
import { Library, RotateCcw, XCircle } from 'lucide-react';

import type { SessionStats } from '../app/types';
import type { Word } from '../data/types';

const ResultView = ({
    stats,
    words,
    onRetry,
    onDashboard
}: {
    stats: SessionStats;
    words?: Word[];
    onRetry: () => void;
    onDashboard: () => void;
}) => {
    // 오답 리스트 계산
    const wrongWordList = (stats.wrongWords || [])
        .map(id => words?.find(w => w.id === id))
        .filter(Boolean) as Word[];

    const hasWrongWords = wrongWordList.length > 0;

    return (
        <div className="flex flex-col items-center h-full w-full bg-white dark:bg-[#121212] p-4 md:p-8 animate-fade-in overflow-y-auto">
            <div className="text-center max-w-2xl w-full my-auto">
                <p className="text-[#1db954] font-bold tracking-widest uppercase mb-4 text-sm">학습 완료</p>
                <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-900 dark:text-white mb-6 tracking-tighter">오늘의 목표</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                        <div className="text-xl font-bold text-red-500 dark:text-red-400 truncate">{stats.mostWrong || '-'}</div>
                    </div>
                </div>

                {/* 오답/학습 단어 리스트 표시 영역 */}
                {hasWrongWords && (
                    <div className="w-full text-left mb-8 bg-zinc-50 dark:bg-[#181818] rounded-xl border border-zinc-200 dark:border-[#282828] overflow-hidden">
                         <div className="px-6 py-4 border-b border-zinc-200 dark:border-[#282828] bg-zinc-100/50 dark:bg-[#202020] flex justify-between items-center">
                            <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                                <XCircle size={20} className="text-red-500" />
                                학습이 필요한 단어
                            </h3>
                            <span className="text-sm text-zinc-500">{wrongWordList.length}개</span>
                        </div>
                        <div className="divide-y divide-zinc-200 dark:divide-[#282828] max-h-64 overflow-y-auto">
                            {wrongWordList.map((word) => (
                                <div key={word.id} className="p-4 flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-[#202020] transition-colors">
                                    <div>
                                        <div className="font-bold text-base text-zinc-900 dark:text-white mb-0.5">{word.word}</div>
                                        <div className="text-sm text-zinc-500">{word.definitions.join(', ')}</div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">오답</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
