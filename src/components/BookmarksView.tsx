import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { DATA_SETS } from '../data';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';

const BookmarksView = () => {
    const bookmarks = useLiveQuery(() => db.bookmarks.toArray());

    if (!bookmarks) return <div className="p-8">Loading...</div>;

    const bookmarkCount = bookmarks.length;

    // Group bookmarks by dataset
    const grouped = bookmarks.reduce((acc, b) => {
        if (!acc[b.dataSetId]) acc[b.dataSetId] = [];
        acc[b.dataSetId].push(b.wordId);
        return acc;
    }, {} as Record<string, string[]>);

    const handleRemove = async (id: number) => {
        await db.bookmarks.delete(id);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-zinc-950">
             {/* Header */}
             <div className="p-8 pb-4 shrink-0">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2 flex items-center gap-3">
                    <Bookmark className="text-emerald-500" size={32} />
                    나만의 단어장
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{bookmarkCount}개</span>의 단어가 저장되어 있습니다.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-8">
                {bookmarkCount === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl">
                        <Bookmark size={48} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium">아직 저장된 단어가 없어요</p>
                        <p className="text-sm">학습 중에 별표를 눌러 단어를 추가해보세요!</p>
                    </div>
                ) : (
                    Object.entries(grouped).map(([dataSetId, wordIds]) => {
                        const dataSet = DATA_SETS.find(d => d.id === dataSetId);
                        if (!dataSet) return null;

                        return (
                            <div key={dataSetId} className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                    {dataSet.title}
                                    <span className="bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 px-2 py-0.5 rounded text-xs">
                                        {wordIds.length}
                                    </span>
                                </h3>
                                
                                <div className="grid grid-cols-1 gap-3">
                                    {wordIds.map(wordId => {
                                        const word = dataSet.words.find(w => w.id === wordId);
                                        const bookmarkEntry = bookmarks.find(b => b.wordId === wordId && b.dataSetId === dataSetId);
                                        
                                        if (!word || !bookmarkEntry) return null;

                                        return (
                                            <div key={wordId} className="group bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-baseline gap-3 mb-1">
                                                        <h4 className="text-xl font-bold text-slate-800 dark:text-white">{word.word}</h4>
                                                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                            {word.definitions.join(', ')}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
                                                        {word.etymo}
                                                    </p>
                                                    {/* Example (Show on hover or always?) -> Let's show first one */}
                                                    <div className="mt-3 p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg text-sm text-slate-600 dark:text-zinc-400">
                                                        <p className="mb-1 text-slate-800 dark:text-zinc-300">
                                                            {word.examples[0].text.replace(/\[(.*?)\]/g, (match, p1) => p1)}
                                                        </p>
                                                        <p className="text-slate-400 text-xs">
                                                            {word.examples[0].korean.replace(/\{(.*?)\}/g, (match, p1) => p1)}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => handleRemove(bookmarkEntry.id!)}
                                                    className="shrink-0 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="단어장에서 제거"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default BookmarksView;
