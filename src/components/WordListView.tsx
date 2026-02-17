import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle, ChevronRight, Volume2, Star } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';

import { DATA_SETS } from '../data';
import { getWordsWithStats, setMemoryScore, type StudyRecord, db, toggleBookmark } from '../db';
import type { Word } from '../data/types';
import { speakText } from '../app/utils';

const WordListView = ({
    dataSetId,
    onExit
}: {
    dataSetId: string;
    onExit: () => void;
}) => {
    type WordWithMemory = Word & {
        choiceRecord?: StudyRecord;
        writeRecord?: StudyRecord;
    };

    type SortType = 'index' | 'alphabetical' | 'achievement';

    const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
    const [words, setWords] = useState<WordWithMemory[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortType, setSortType] = useState<SortType>('index');

    const dataSet = DATA_SETS.find(d => d.id === dataSetId);
    const bookmarks = useLiveQuery(() => db.bookmarks.where('dataSetId').equals(dataSetId).toArray(), [dataSetId]);

    const loadWords = useCallback(async () => {
        setLoading(true);
        const [choiceData, writeData] = await Promise.all([
            getWordsWithStats(dataSetId, 'CHOICE'),
            getWordsWithStats(dataSetId, 'WRITE')
        ]);
        const allChoice = [...choiceData.mastered, ...choiceData.queue];
        const allWrite = [...writeData.mastered, ...writeData.queue];
        const choiceMap = new Map(allChoice.map(word => [word.id, word.record]));
        const writeMap = new Map(allWrite.map(word => [word.id, word.record]));

        const merged = (DATA_SETS.find(d => d.id === dataSetId)?.words ?? []).map(word => ({
            ...word,
            choiceRecord: choiceMap.get(word.id),
            writeRecord: writeMap.get(word.id)
        }));

        setWords(merged);
        setLoading(false);
    }, [dataSetId]);

    useEffect(() => {
        loadWords();
    }, [loadWords]);

    const getStage = (word: WordWithMemory) => {
        const choiceScore = word.choiceRecord?.memoryScore ?? 0;
        const writeScore = word.writeRecord?.memoryScore ?? 0;
        if (writeScore >= 3) return 2;
        if (choiceScore >= 3) return 1;
        return 0;
    };

    const getStageLabel = (stage: number) => {
        if (stage === 2) return '2단계';
        if (stage === 1) return '1단계';
        return '0단계';
    };

    const getLevelColor = (stage: number) => {
        if (stage === 2) return 'text-[#1ed760] bg-[#1db954]/20 border border-[#1db954]/40 hover:bg-[#1db954]/30';
        if (stage === 1) return 'text-[#1db954] bg-[#1db954]/10 border border-[#1db954]/30 hover:bg-[#1db954]/20';
        return 'text-zinc-300 bg-[#1f1f1f] border border-[#2a2a2a] hover:bg-[#242424]';
    };

    const getSortedWords = () => {
        const sorted = [...words];
        switch (sortType) {
            case 'alphabetical':
                sorted.sort((a, b) => a.word.localeCompare(b.word, 'en'));
                break;
            case 'achievement':
                sorted.sort((a, b) => {
                    const stageA = getStage(a);
                    const stageB = getStage(b);
                    if (stageA !== stageB) return stageB - stageA;
                    const scoreA = Math.max((a.choiceRecord?.memoryScore ?? 0), (a.writeRecord?.memoryScore ?? 0));
                    const scoreB = Math.max((b.choiceRecord?.memoryScore ?? 0), (b.writeRecord?.memoryScore ?? 0));
                    return scoreB - scoreA;
                });
                break;
            case 'index':
            default:
                sorted.sort((a, b) => parseInt(a.id) - parseInt(b.id));
                break;
        }
        return sorted;
    };

    const handleToggleStage = async (word: WordWithMemory) => {
        const currentStage = getStage(word);
        const nextStage = (currentStage + 1) % 3;

        if (nextStage === 0) {
            await Promise.all([
                setMemoryScore(word.id, dataSetId, 'CHOICE', 0),
                setMemoryScore(word.id, dataSetId, 'WRITE', 0)
            ]);
        } else if (nextStage === 1) {
            await Promise.all([
                setMemoryScore(word.id, dataSetId, 'CHOICE', 3),
                setMemoryScore(word.id, dataSetId, 'WRITE', 0)
            ]);
        } else {
            await Promise.all([
                setMemoryScore(word.id, dataSetId, 'CHOICE', 3),
                setMemoryScore(word.id, dataSetId, 'WRITE', 3)
            ]);
        }

        loadWords();
    };

    if (loading) return <div className="text-text-secondary dark:text-zinc-400 p-8 animate-pulse text-lg transition-colors">단어 불러오는 중...</div>;
    if (!dataSet) return <div className="text-text-secondary dark:text-zinc-400 p-8 text-lg transition-colors">데이터를 찾을 수 없습니다.</div>;

    const GlassCard = ({ word, onToggleStage }: { word: WordWithMemory, onToggleStage: (w: WordWithMemory) => void }) => {
        const [isFlipped, setIsFlipped] = useState(false);
        const stage = getStage(word);
        const isBookmarked = bookmarks?.some(b => b.wordId === word.id && b.dataSetId === dataSetId);

        return (
            <div 
                className="group w-full aspect-[4/5] perspective-1000 cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                    {/* Front Face - Flat Card */}
                    <div className="absolute inset-0 backface-hidden bg-white dark:bg-zinc-900 shadow-sm dark:shadow-none dark:border dark:border-zinc-800 p-6 flex flex-col items-center justify-between hover:shadow-md transition-all">
                         <div className="w-full flex justify-between items-start">
                             <div className="flex gap-1 h-1.5 w-1/3">
                                <div className={`h-full flex-1 ${stage >= 1 ? 'bg-emerald-400' : 'bg-slate-100 dark:bg-zinc-800'}`} />
                                <div className={`h-full flex-1 ${stage >= 2 ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-zinc-800'}`} />
                             </div>
                             <div className="flex gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleBookmark(word.id, dataSetId); }}
                                    className={`text-slate-300 hover:text-emerald-500 transition-colors ${isBookmarked ? 'text-emerald-500 fill-emerald-500' : ''}`}
                                >
                                    <Star size={16} className={isBookmarked ? 'fill-emerald-500' : ''}/>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onToggleStage(word); }}
                                    className={`text-xs font-bold px-3 py-1.5 transition-all ${getLevelColor(stage)}`}
                                >
                                    {getStageLabel(stage)}
                                </button>
                             </div>
                         </div>



                        <div className="flex-1 flex flex-col items-center justify-center w-full text-center space-y-4">
                            <h3 className="text-4xl font-extrabold text-text-primary dark:text-white tracking-tight font-sans transition-colors">{word.word}</h3>
                            <button
                                onClick={(e) => { e.stopPropagation(); speakText(word.word); }}
                                className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-zinc-800 text-accent hover:bg-accent hover:text-white transition-all active:scale-95"
                            >
                                <Volume2 size={20} />
                            </button>
                        </div>
                        
                        <div className="w-full text-center text-text-secondary dark:text-zinc-500 text-sm font-medium opacity-60 transition-colors">
                            Click to Flip
                        </div>
                    </div>

                    {/* Back Face - Flat Card */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-none dark:border dark:border-zinc-800 p-6 flex flex-col justify-center items-center text-center transition-colors">
                        <div className="flex-1 flex flex-col items-center justify-center w-full space-y-6">
                            <div>
                                <h4 className="text-lg font-korean font-bold text-text-primary dark:text-white mb-2 line-clamp-2 leading-relaxed transition-colors">
                                    {word.definitions.join(', ')}
                                </h4>
                                <p className="text-xs text-text-secondary dark:text-zinc-400 transition-colors">{word.etymo}</p>
                            </div>

                            <div className="w-full h-px bg-slate-100 dark:bg-zinc-800 transition-colors" />

                            <div className="w-full">
                                <p className="font-serif italic text-text-secondary dark:text-zinc-300 mb-2 text-lg leading-relaxed transition-colors">
                                    "{word.examples[0].text}"
                                </p>
                                <p className="font-korean text-sm text-text-secondary dark:text-zinc-500 opacity-80 transition-colors">
                                    {word.examples[0].korean}
                                </p>
                            </div>
                        </div>

                        <div className="w-full flex gap-2 mt-4">
                             <button
                                onClick={(e) => { e.stopPropagation(); onToggleStage(word); }}
                                className="flex-1 py-2 bg-accent text-white font-bold text-sm shadow-sm hover:bg-accent/90 transition-transform active:scale-95"
                            >
                                암기 완료
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full w-full p-4 md:p-8 overflow-y-auto bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
            {/* Header - Flat Sticky */}
            <div className="bg-slate-50 dark:bg-[#09090b] px-4 py-4 md:px-6 md:py-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-40 transition-all">
                <div>
                    <button onClick={onExit} className="text-text-secondary dark:text-zinc-400 hover:text-text-primary dark:hover:text-white mb-1 flex items-center gap-1 text-sm font-medium transition-colors">
                        <ChevronRight size={14} className="rotate-180" /> 돌아가기
                    </button>
                    <h2 className="text-3xl font-extrabold text-text-primary dark:text-white tracking-tight font-sans transition-colors">
                        {dataSet.title}
                    </h2>
                    <p className="text-text-secondary dark:text-zinc-500 text-sm font-medium mt-1 transition-colors">{dataSet.description}</p>
                </div>
                
                <div className="flex gap-2">
                    <div className="bg-slate-200 dark:bg-zinc-800 p-0.5 flex gap-0.5 transition-colors">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white dark:bg-zinc-700 text-text-primary dark:text-white shadow-sm' : 'text-text-secondary dark:text-zinc-500 hover:text-text-primary dark:hover:text-zinc-300'}`}
                        >
                            List
                        </button>
                        <button
                            onClick={() => setViewMode('card')}
                            className={`px-4 py-2 text-sm font-bold transition-all ${viewMode === 'card' ? 'bg-white dark:bg-zinc-700 text-text-primary dark:text-white shadow-sm' : 'text-text-secondary dark:text-zinc-500 hover:text-text-primary dark:hover:text-zinc-300'}`}
                        >
                            Card
                        </button>
                    </div>
                </div>
            </div>

            {/* List Mode - Flat */}
            {viewMode === 'list' && (
                <div className="space-y-0.5 pb-8 max-w-4xl mx-auto w-full">
                    {getSortedWords().map((word) => {
                        const isBookmarked = bookmarks?.some(b => b.wordId === word.id && b.dataSetId === dataSetId);
                        return (
                        <div
                            key={word.id}
                            className="bg-white dark:bg-zinc-900 p-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all group flex items-center gap-4 border-b border-slate-100 dark:border-zinc-800 last:border-none"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-bold text-text-primary dark:text-white font-sans transition-colors">{word.word}</h3>
                                    <button
                                        onClick={() => speakText(word.word)}
                                        className="text-text-secondary dark:text-zinc-500 hover:text-accent transition-colors p-1 hover:bg-slate-100 dark:hover:bg-zinc-800"
                                    >
                                        <Volume2 size={16} />
                                    </button>
                                </div>
                                <div className="flex gap-2 items-center text-sm text-text-secondary dark:text-zinc-400 transition-colors">
                                    <span className="font-korean font-medium">{word.definitions.join(', ')}</span>
                                    <span className="w-1 h-1 bg-slate-300 dark:bg-zinc-700" />
                                    <span className="font-serif italic opacity-80 truncate max-w-md">{word.examples[0].text}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleBookmark(word.id, dataSetId); }}
                                    className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors ${isBookmarked ? 'text-emerald-500' : 'text-slate-300'}`}
                                >
                                    <Star size={18} className={isBookmarked ? 'fill-emerald-500' : ''} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleToggleStage(word); }}
                                    className={`text-xs font-bold px-3 py-1.5 transition-all ${getLevelColor(getStage(word))}`}
                                >
                                    {getStageLabel(getStage(word))}
                                </button>
                            </div>
                        </div>
                    );
                })}
                </div>
            )}

            {/* Card Mode */}
            {viewMode === 'card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                    {getSortedWords().map((word) => (
                        <GlassCard key={word.id} word={word} onToggleStage={handleToggleStage} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WordListView;

