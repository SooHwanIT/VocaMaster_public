import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

import { DATA_SETS } from '../data';
import { getModeProgress } from '../db';

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

    if (loading) return <div className="text-white p-8 animate-pulse">진행도 불러오는 중...</div>;

    const totalWords = progressData.reduce((sum, d) => sum + d.totalWords, 0);
    const totalLearnedChoice = progressData.reduce((sum, d) => sum + d.learnedChoice, 0);
    const totalLearnedWrite = progressData.reduce((sum, d) => sum + d.learnedWrite, 0);
    const totalMasteredChoice = progressData.reduce((sum, d) => sum + d.masteredChoice, 0);
    const totalMasteredWrite = progressData.reduce((sum, d) => sum + d.masteredWrite, 0);
    const overallChoicePercent = totalWords > 0 ? (totalLearnedChoice / totalWords) * 100 : 0;
    const overallWritePercent = totalWords > 0 ? (totalLearnedWrite / totalWords) * 100 : 0;
    const overallChoiceMasteredPercent = totalWords > 0 ? (totalMasteredChoice / totalWords) * 100 : 0;
    const overallWriteMasteredPercent = totalWords > 0 ? (totalMasteredWrite / totalWords) * 100 : 0;

    return (
        <div className="flex flex-col h-full w-full bg-[#121212] p-8 overflow-y-auto">
            <div className="mb-8 flex items-start justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">학습 진행도</h2>
                    <p className="text-zinc-400 text-sm">
                        {activeDay ? `${activeDay.title} 진행도` : '전체 학습 진행도를 확인하세요'}
                    </p>
                </div>
                <button onClick={onExit} className="text-zinc-400 hover:text-[#1db954] text-sm font-bold flex items-center gap-2">
                    <ChevronRight size={16} className="rotate-180" /> 종료
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#181818] p-6 rounded-lg border border-[#282828]">
                    <div className="text-zinc-400 text-xs font-bold uppercase mb-2">총 단어</div>
                    <div className="text-4xl font-bold text-white">{totalWords}</div>
                </div>
                <div className="bg-[#181818] p-6 rounded-lg border border-[#282828]">
                    <div className="text-zinc-400 text-xs font-bold uppercase mb-2">단어퀴즈 진행</div>
                    <div className="text-4xl font-bold text-[#1db954]">{overallChoicePercent.toFixed(1)}%</div>
                    <div className="text-sm text-zinc-500 mt-1">학습중 {totalLearnedChoice} / {totalWords} · 마스터 {totalMasteredChoice}</div>
                    <div className="mt-3 w-full h-2 bg-zinc-800 rounded-full overflow-hidden relative">
                        <div className="h-full bg-[#1db954]/50" style={{ width: `${overallChoicePercent}%` }} />
                        <div className="absolute inset-y-0 left-0 bg-[#1ed760]" style={{ width: `${overallChoiceMasteredPercent}%` }} />
                    </div>
                </div>
                <div className="bg-[#181818] p-6 rounded-lg border border-[#282828]">
                    <div className="text-zinc-400 text-xs font-bold uppercase mb-2">예문퀴즈 진행</div>
                    <div className="text-4xl font-bold text-[#1db954]">{overallWritePercent.toFixed(1)}%</div>
                    <div className="text-sm text-zinc-500 mt-1">학습중 {totalLearnedWrite} / {totalWords} · 마스터 {totalMasteredWrite}</div>
                    <div className="mt-3 w-full h-2 bg-zinc-800 rounded-full overflow-hidden relative">
                        <div className="h-full bg-[#1db954]/50" style={{ width: `${overallWritePercent}%` }} />
                        <div className="absolute inset-y-0 left-0 bg-[#1ed760]" style={{ width: `${overallWriteMasteredPercent}%` }} />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {progressData.map((data) => {
                    const choicePercent = data.totalWords > 0 ? (data.learnedChoice / data.totalWords) * 100 : 0;
                    const writePercent = data.totalWords > 0 ? (data.learnedWrite / data.totalWords) * 100 : 0;
                    const choiceMasteredPercent = data.totalWords > 0 ? (data.masteredChoice / data.totalWords) * 100 : 0;
                    const writeMasteredPercent = data.totalWords > 0 ? (data.masteredWrite / data.totalWords) * 100 : 0;

                    return (
                        <div key={data.id} className="bg-[#181818] p-6 rounded-lg border border-[#282828]">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{data.title}</h3>
                                    <p className="text-sm text-zinc-500">{data.totalWords} 단어</p>
                                </div>
                                <div className="flex gap-4 text-sm">
                                    <div className="text-center">
                                        <div className="text-xs text-zinc-500 mb-1">단어퀴즈</div>
                                        <div className="text-lg font-bold text-[#1db954]">{choicePercent.toFixed(0)}%</div>
                                        <div className="text-xs text-zinc-500 mt-1">마스터 {data.masteredChoice}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-zinc-500 mb-1">예문퀴즈</div>
                                        <div className="text-lg font-bold text-[#1db954]">{writePercent.toFixed(0)}%</div>
                                        <div className="text-xs text-zinc-500 mt-1">마스터 {data.masteredWrite}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="flex justify-between text-xs text-zinc-500 mb-1">
                                    <span>단어퀴즈</span>
                                    <span>학습중 {data.learnedChoice} / {data.totalWords} · 마스터 {data.masteredChoice}</span>
                                </div>
                                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden relative">
                                    <div
                                        className="h-full bg-[#1db954]/50 transition-all duration-700"
                                        style={{ width: `${choicePercent}%` }}
                                    />
                                    <div
                                        className="absolute inset-y-0 left-0 bg-[#1ed760] transition-all duration-700"
                                        style={{ width: `${choiceMasteredPercent}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs text-zinc-500 mb-1">
                                    <span>예문퀴즈</span>
                                    <span>학습중 {data.learnedWrite} / {data.totalWords} · 마스터 {data.masteredWrite}</span>
                                </div>
                                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden relative">
                                    <div
                                        className="h-full bg-[#1db954]/50 transition-all duration-700"
                                        style={{ width: `${writePercent}%` }}
                                    />
                                    <div
                                        className="absolute inset-y-0 left-0 bg-[#1ed760] transition-all duration-700"
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
