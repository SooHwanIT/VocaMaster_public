import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { DATA_SETS } from '../data';
import { BarChart, CheckCircle, XCircle, TrendingUp, Award, Calendar } from 'lucide-react';

const StatsView = () => {
    // 1. Fetch all records
    const records = useLiveQuery(() => db.studyRecords.toArray());

    if (!records) return <div className="p-8">Loading stats...</div>;

    // --- Calculations ---

    // 1. Total Stats
    const totalMastered = records.filter(r => r.memoryScore >= 3).length;
    // Note: records are per (wordId + mode). So a word might be counted twice if studied in both modes.
    // Let's count unique words mastered.
    // A word is considered "Mastered" if it has score >= 3 in EITHER mode? Or BOTH?
    // Current logic in WordListView: "Memory Score" is usually treated per mode.
    // Let's simplify: Count total "Mastered Records" (meaning a mode of a word is mastered).
    // Or better: Unique words that have AT LEAST one mode mastered?
    // Let's stand by: Total Mastered "Items" (Word X Mode combinaton) is fine for now, or maybe aggregate.
    
    // Let's aggregate by WordId to see "Unique Words Studied"
    const uniqueWordsStudied = new Set(records.map(r => r.wordId)).size;
    const totalWordsAvailable = DATA_SETS.reduce((acc, d) => acc + d.words.length, 0);

    const totalCorrect = records.reduce((acc, r) => acc + r.correctCnt, 0);
    const totalWrong = records.reduce((acc, r) => acc + r.wrongCnt, 0);
    const totalAttempts = totalCorrect + totalWrong;
    const accuracy = totalAttempts > 0 ? ((totalCorrect / totalAttempts) * 100).toFixed(1) : '0';

    // 2. Mastery by Day (DataSet)
    // We want to see per Day (DataSet), how many are mastered vs total.
    const statsByDay = DATA_SETS.map(ds => {
        const dsRecords = records.filter(r => r.dataSetId === ds.id);
        
        // Count unique words in this dataset that are mastered in ANY mode
        // For strict mastery, maybe we require BOTH modes?
        // Let's stick to "If any record for this word has score >= 3", it's mastered?
        // Actually, db stores separate records.
        // Let's calculate "Mastery Rate" based on total possible mastered slots (Words * 2 modes)? 
        // Or just "Words that have at least one Green card"?
        
        // Let's simply count "number of Mastered Records" vs "Total records possible"?
        // No, user assumes "I mastered Word X".
        // Let's define "Mastered Word" as: Average score >= 3? Or Max score >= 3?
        // Let's use: If ANY mode is >= 3, it contributes to "Mastered".
        
        const masteredWordIds = new Set(dsRecords.filter(r => r.memoryScore >= 3).map(r => r.wordId));
        const totalWords = ds.words.length;
        
        return {
            id: ds.id,
            title: ds.title,
            totalWords,
            masteredCount: masteredWordIds.size,
            percentage: totalWords > 0 ? (masteredWordIds.size / totalWords) * 100 : 0
        };
    });

    // 3. Worst Words (Most Wrong Cnt)
    // Aggregate wrongs by wordId
    const wrongCounts: Record<string, { count: number; word: string; dayTitle: string }> = {};
    
    records.forEach(r => {
        if (r.wrongCnt > 0) {
            if (!wrongCounts[r.wordId]) {
                const dataset = DATA_SETS.find(d => d.id === r.dataSetId);
                const wordObj = dataset?.words.find(w => w.id === r.wordId);
                if (wordObj) {
                    wrongCounts[r.wordId] = {
                        count: 0,
                        word: wordObj.word,
                        dayTitle: dataset?.title || r.dataSetId
                    };
                }
            }
            if (wrongCounts[r.wordId]) {
                wrongCounts[r.wordId].count += r.wrongCnt;
            }
        }
    });

    const worstWords = Object.values(wrongCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-zinc-950 overflow-y-auto">
             <div className="p-8 pb-4 shrink-0">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2 flex items-center gap-3">
                    <BarChart className="text-orange-500" size={32} />
                    학습 통계
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    전체 학습 현황과 성취도를 한눈에 확인하세요.
                </p>
            </div>

            <div className="flex-1 p-8 pt-0 space-y-8 pb-20">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-32">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-wider">
                            <TrendingUp size={16} /> 학습한 단어
                        </div>
                        <div className="text-3xl font-black text-slate-800 dark:text-white">
                            {uniqueWordsStudied} <span className="text-lg text-slate-400 font-medium">/ {totalWordsAvailable}</span>
                        </div>
                     </div>
                     <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-32">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-wider">
                            <Award size={16} /> 암기 완료
                        </div>
                         <div className="text-3xl font-black text-emerald-500">
                            {totalMastered} <span className="text-lg text-slate-400 font-medium">records</span>
                        </div>
                     </div>
                     <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-32">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-wider">
                            <CheckCircle size={16} /> 정답률
                        </div>
                         <div className="text-3xl font-black text-blue-500">
                            {accuracy}%
                        </div>
                     </div>
                     <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-32">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-wider">
                            <XCircle size={16} /> 총 오답 수
                        </div>
                         <div className="text-3xl font-black text-red-500">
                            {totalWrong}
                        </div>
                     </div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Mastery By Day */}
                    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                             <Calendar size={20} className="text-slate-400" /> 챕터별 암기 현황
                        </h3>
                        <div className="space-y-6">
                            {statsByDay.map(day => (
                                <div key={day.id}>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="font-bold text-slate-700 dark:text-zinc-300 text-sm">{day.title}</span>
                                        <span className="text-xs font-medium text-slate-400">
                                            {day.masteredCount} / {day.totalWords} ({day.percentage.toFixed(0)}%)
                                        </span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${day.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Worst Words */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm p-6 overflow-hidden">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                             <TrendingUp size={20} className="text-red-500" /> 많이 틀린 단어 TOP 5
                        </h3>
                        <div className="space-y-3">
                            {worstWords.length === 0 ? (
                                <div className="text-center py-12 text-slate-400 text-sm">
                                    데이터가 부족합니다.
                                </div>
                            ) : (
                                worstWords.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                                        <div className="flex items-center gap-4">
                                            <span className="font-black text-red-300 dark:text-red-800 text-xl w-6 text-center">{idx + 1}</span>
                                            <div>
                                                <div className="font-bold text-slate-800 dark:text-red-100 text-lg">{item.word}</div>
                                                <div className="text-xs text-slate-500 dark:text-red-300/70 font-medium">{item.dayTitle}</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs text-red-400 font-bold uppercase">Wrong</span>
                                            <span className="font-mono font-black text-red-500 text-xl leading-none">
                                                {item.count}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsView;
