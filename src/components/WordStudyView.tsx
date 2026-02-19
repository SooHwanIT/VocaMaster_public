import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';

import { DATA_SETS } from '../data';
import { getModeProgress } from '../db';
import { MODE_LABELS } from '../app/constants';
import type { ResumeState } from '../app/types';

const WordStudyView = ({
    onOpenModePicker,
    resumeState,
    onResume
}: {
    onOpenModePicker: (id: string) => void;
    resumeState: ResumeState | null;
    onResume: () => void;
}) => {
    const [progressMap, setProgressMap] = useState<Record<string, { choiceLearned: number; choiceMastered: number; writeLearned: number; writeMastered: number; total: number }>>({});
    const [loadingProgress, setLoadingProgress] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const loadProgress = async () => {
            setLoadingProgress(true);
            const rows = await Promise.all(
                DATA_SETS.map(async (day) => {
                    const choiceProgress = await getModeProgress(day.id, 'CHOICE');
                    const writeProgress = await getModeProgress(day.id, 'WRITE');
                    return {
                        id: day.id,
                        choiceLearned: choiceProgress.learnedCount,
                        choiceMastered: choiceProgress.masteredCount,
                        writeLearned: writeProgress.learnedCount,
                        writeMastered: writeProgress.masteredCount,
                        total: day.words.length
                    };
                })
            );
            if (cancelled) return;
            const nextMap: Record<string, { choiceLearned: number; choiceMastered: number; writeLearned: number; writeMastered: number; total: number }> = {};
            rows.forEach(row => { nextMap[row.id] = row; });
            setProgressMap(nextMap);
            setLoadingProgress(false);
        };
        loadProgress();
        return () => { cancelled = true; };
    }, []);

    return (
        <div className="flex flex-col h-full w-full p-4 md:p-8 overflow-y-auto bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
            <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary dark:text-white tracking-tight font-sans transition-colors">단어 학습</h2>
            </div>

            {resumeState && (
                <div className="mb-8 bg-white dark:bg-zinc-900 shadow-sm p-6 flex items-center justify-between transition-colors">
                    <div>
                        <div className="text-xs text-accent font-bold uppercase tracking-widest mb-1">이어하기</div>
                        <div className="text-text-primary dark:text-white font-bold text-lg transition-colors">
                            {MODE_LABELS[resumeState.mode as keyof typeof MODE_LABELS]} · {resumeState.dayId ? (DATA_SETS.find(d => d.id === resumeState.dayId)?.title ?? '선택한 Day') : '오늘의 학습'}
                        </div>
                    </div>
                    <button onClick={onResume} className="bg-accent text-white px-6 py-3 text-sm font-bold hover:bg-accent/90 transition-all shadow-sm active:opacity-90">
                        이어하기
                    </button>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                {DATA_SETS.map((day, index) => {
                    const progress = progressMap[day.id];
                    const total = progress?.total ?? day.words.length;
                    
                    const choiceMastered = progress?.choiceMastered ?? 0;
                    const choiceLearned = progress?.choiceLearned ?? 0;
                    const choiceLearning = Math.max(0, choiceLearned - choiceMastered); // 진행중인 단어 수

                    const writeMastered = progress?.writeMastered ?? 0;
                    const writeLearned = progress?.writeLearned ?? 0;
                    const writeLearning = Math.max(0, writeLearned - writeMastered); // 진행중인 단어 수

                    const choiceMasteredPercent = total > 0 ? (choiceMastered / total) * 100 : 0;
                    const choiceLearningPercent = total > 0 ? (choiceLearning / total) * 100 : 0;
                    
                    const writeMasteredPercent = total > 0 ? (writeMastered / total) * 100 : 0;
                    const writeLearningPercent = total > 0 ? (writeLearning / total) * 100 : 0;

                    const isComplete = total > 0 && choiceMastered >= total && writeMastered >= total;
                    const dayNumber = index + 1;

                    return (
                        <div
                            key={day.id}
                            onClick={() => onOpenModePicker(day.id)}
                            className="group relative bg-white dark:bg-zinc-900 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
                        >
                            <div className="relative h-24 bg-gradient-to-b from-slate-50 to-white dark:from-zinc-800 dark:to-zinc-900 p-6 flex flex-col justify-between overflow-hidden transition-colors">
                                <span className="text-6xl font-black text-slate-100 dark:text-zinc-800 absolute -bottom-4 -right-4 select-none transition-colors">
                                    {dayNumber.toString().padStart(2, '0')}
                                </span>
                                
                                <div className="z-10 flex justify-between items-center w-full">
                                    <h3 className="text-xl font-bold text-text-primary dark:text-white z-10 truncate font-sans transition-colors">{day.title}</h3>
                                    {isComplete && (
                                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 transition-colors">
                                            완료
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-text-secondary dark:text-zinc-400">객관식 마스터</span>
                                        <div className="flex gap-2">
                                            {choiceLearning > 0 && <span className="text-emerald-400 font-bold dark:text-emerald-600/70 text-[10px] self-end mb-0.5">+{choiceLearning} 학습중</span>}
                                            <span className="font-bold text-text-primary dark:text-white">{Math.round(choiceMasteredPercent)}%</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 overflow-hidden flex rounded-full">
                                        <div className="h-full bg-emerald-500" style={{ width: `${choiceMasteredPercent}%` }} />
                                        <div className="h-full bg-emerald-200 dark:bg-emerald-900/50" style={{ width: `${choiceLearningPercent}%` }} />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-text-secondary dark:text-zinc-400">주관식 마스터</span>
                                        <div className="flex gap-2">
                                            {writeLearning > 0 && <span className="text-indigo-400 font-bold dark:text-indigo-600/70 text-[10px] self-end mb-0.5">+{writeLearning} 학습중</span>}
                                            <span className="font-bold text-text-primary dark:text-white">{Math.round(writeMasteredPercent)}%</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 overflow-hidden flex rounded-full">
                                        <div className="h-full bg-indigo-500" style={{ width: `${writeMasteredPercent}%` }} />
                                        <div className="h-full bg-indigo-200 dark:bg-indigo-900/50" style={{ width: `${writeLearningPercent}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WordStudyView;
