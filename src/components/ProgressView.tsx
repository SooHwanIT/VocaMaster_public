import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

import { DATA_SETS } from '../data.ts';
import { getModeProgress } from '../db';
import { TransitionPlaceholder } from './TransitionUI';
import useDelayedPending from '../hooks/useDelayedPending';
import { getPercentage } from '../app/utils';

const ProgressView = ({ dataSetId, onExit }: { dataSetId?: string; onExit: () => void }) => {
    const [progressData, setProgressData] = useState<Array<{
        id: string;
        title: string;
        totalWords: number;
        learnedChoice: number;
        learnedWrite: number;
        masteredChoice: number;
        masteredWrite: number;
    }>>([]);
    const [loading, setLoading] = useState(true);
    const loadingVisible = useDelayedPending(loading);
    const activeDay = dataSetId ? DATA_SETS.find(d => d.id === dataSetId) : null;
    const dataSets = dataSetId ? DATA_SETS.filter(d => d.id === dataSetId) : DATA_SETS;

    useEffect(() => {
        const loadProgress = async () => {
            setLoading(true);
            const data = await Promise.all(
                dataSets.map(async (dataSet) => {
                    const choiceProgress = await getModeProgress(dataSet.id, 'CHOICE');
                    const writeProgress = await getModeProgress(dataSet.id, 'WRITE');
                    return {
                        id: dataSet.id,
                        title: dataSet.title,
                        totalWords: dataSet.words.length,
                        learnedChoice: choiceProgress.learnedCount,
                        learnedWrite: writeProgress.learnedCount,
                        masteredChoice: choiceProgress.masteredCount,
                        masteredWrite: writeProgress.masteredCount,
                    };
                })
            );
            setProgressData(data);
            setLoading(false);
        };
        loadProgress();
    }, [dataSetId]);

    if (loading && loadingVisible) {
        return (
            <TransitionPlaceholder
                title="학습 진행도를 계산하고 있어요"
                variant="stats"
                onRetry={() => {
                    setLoading(true);
                }}
            />
        );
    }
    if (loading) return <div className="vm-page" aria-busy="true" />;

    const totalWords = progressData.reduce((sum, d) => sum + d.totalWords, 0);
    const totalLearnedChoice = progressData.reduce((sum, d) => sum + d.learnedChoice, 0);
    const totalLearnedWrite = progressData.reduce((sum, d) => sum + d.learnedWrite, 0);
    const totalMasteredChoice = progressData.reduce((sum, d) => sum + d.masteredChoice, 0);
    const totalMasteredWrite = progressData.reduce((sum, d) => sum + d.masteredWrite, 0);
    const overallChoicePercent = getPercentage(totalLearnedChoice, totalWords);
    const overallWritePercent = getPercentage(totalLearnedWrite, totalWords);
    const overallChoiceMasteredPercent = getPercentage(totalMasteredChoice, totalWords);
    const overallWriteMasteredPercent = getPercentage(totalMasteredWrite, totalWords);

    return (
        <div className="vm-page">
            <div className="vm-page-header flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h2 className="vm-page-title mb-2">학습 진행도</h2>
                    <p className="vm-page-subtitle text-sm">
                        {activeDay ? `${activeDay.title} 진행도` : '전체 학습 진행도를 확인하세요'}
                    </p>
                </div>
                <button onClick={onExit} className="text-slate-500 dark:text-zinc-400 hover:text-accent text-sm font-bold flex items-center gap-2">
                    <ChevronRight size={16} className="rotate-180" /> 종료
                </button>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-8">
                <div className="vm-card p-6 rounded-xl">
                    <div className="text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase mb-2">총 단어</div>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">{totalWords}</div>
                </div>
                <div className="vm-card p-6 rounded-xl">
                    <div className="text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase mb-2">단어퀴즈 진행</div>
                    <div className="text-4xl font-bold text-emerald-500">{overallChoicePercent.toFixed(1)}%</div>
                    <div className="text-sm text-slate-500 dark:text-zinc-500 mt-1">학습중 {totalLearnedChoice} / {totalWords} · 마스터 {totalMasteredChoice}</div>
                    <div className="mt-3 w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden relative">
                        <div className="h-full bg-emerald-500/50" style={{ width: `${overallChoicePercent}%` }} />
                        <div className="absolute inset-y-0 left-0 bg-emerald-500" style={{ width: `${overallChoiceMasteredPercent}%` }} />
                    </div>
                </div>
                <div className="vm-card p-6 rounded-xl">
                    <div className="text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase mb-2">예문퀴즈 진행</div>
                    <div className="text-4xl font-bold text-indigo-500">{overallWritePercent.toFixed(1)}%</div>
                    <div className="text-sm text-slate-500 dark:text-zinc-500 mt-1">학습중 {totalLearnedWrite} / {totalWords} · 마스터 {totalMasteredWrite}</div>
                    <div className="mt-3 w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden relative">
                        <div className="h-full bg-indigo-500/50" style={{ width: `${overallWritePercent}%` }} />
                        <div className="absolute inset-y-0 left-0 bg-indigo-500" style={{ width: `${overallWriteMasteredPercent}%` }} />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {progressData.map((data) => {
                    const choicePercent = getPercentage(data.learnedChoice, data.totalWords);
                    const writePercent = getPercentage(data.learnedWrite, data.totalWords);
                    const choiceMasteredPercent = getPercentage(data.masteredChoice, data.totalWords);
                    const writeMasteredPercent = getPercentage(data.masteredWrite, data.totalWords);

                    return (
                        <div key={data.id} className="vm-card p-6 rounded-xl">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{data.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-zinc-500">{data.totalWords} 단어</p>
                                </div>
                                <div className="flex gap-4 text-sm">
                                    <div className="text-center">
                                        <div className="text-xs text-slate-500 dark:text-zinc-500 mb-1">단어퀴즈</div>
                                        <div className="text-lg font-bold text-emerald-500">{choicePercent.toFixed(0)}%</div>
                                        <div className="text-xs text-slate-500 dark:text-zinc-500 mt-1">마스터 {data.masteredChoice}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-slate-500 dark:text-zinc-500 mb-1">예문퀴즈</div>
                                        <div className="text-lg font-bold text-indigo-500">{writePercent.toFixed(0)}%</div>
                                        <div className="text-xs text-slate-500 dark:text-zinc-500 mt-1">마스터 {data.masteredWrite}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-500 mb-1">
                                    <span>단어퀴즈</span>
                                    <span>학습중 {data.learnedChoice} / {data.totalWords} · 마스터 {data.masteredChoice}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden relative">
                                    <div
                                        className="h-full bg-emerald-500/50 transition-all duration-700"
                                        style={{ width: `${choicePercent}%` }}
                                    />
                                    <div
                                        className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-700"
                                        style={{ width: `${choiceMasteredPercent}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-500 mb-1">
                                    <span>예문퀴즈</span>
                                    <span>학습중 {data.learnedWrite} / {data.totalWords} · 마스터 {data.masteredWrite}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden relative">
                                    <div
                                        className="h-full bg-indigo-500/50 transition-all duration-700"
                                        style={{ width: `${writePercent}%` }}
                                    />
                                    <div
                                        className="absolute inset-y-0 left-0 bg-indigo-500 transition-all duration-700"
                                        style={{ width: `${writeMasteredPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressView;
