import React, { useEffect, useState } from 'react';
import { DATA_SETS } from '../data';
import { getModeProgress, getTodayStats } from '../db';
import { Activity, Trophy, Zap, Clock, Calendar, CheckSquare, Edit3, BookOpen } from 'lucide-react';

const DashboardView = () => {
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? '좋은 아침이에요' : currentHour < 18 ? '좋은 오후에요' : '좋은 저녁이에요';
    
    const [totalStats, setTotalStats] = useState({
        totalWords: 0,
        masteredWords: 0,
        daysCompleted: 0
    });

    const [todayStats, setTodayStats] = useState({
        uniqueWords: 0,
        totalReviews: 0,
        choiceCount: 0,
        writeCount: 0
    });

    useEffect(() => {
        const loadStats = async () => {
            let totalWords = 0;
            let totalMastered = 0;
            let daysCompleted = 0;

            for (const day of DATA_SETS) {
                totalWords += day.words.length;
                const choice = await getModeProgress(day.id, 'CHOICE');
                const write = await getModeProgress(day.id, 'WRITE');
                
                // 간단하게 두 모드 모두 마스터한 단어 수로 추정하거나,
                // 각각의 진행률을 보여줄 수 있습니다. 여기서는 단순히 합산하여 대략적인 수치를 보여줍니다.
                // 실제로는 DB 구조에 따라 '단어' 단위의 마스터 여부를 따져야 하지만,
                // 현재 구조상 모드별 통계를 사용하므로 평균 진행률을 계산해봅니다.
                
                if (choice.masteredCount >= day.words.length && write.masteredCount >= day.words.length) {
                    daysCompleted++;
                }

                // 대략적인 마스터 단어 수 (평균)
                totalMastered += Math.round((choice.masteredCount + write.masteredCount) / 2);
            }

            setTotalStats({
                totalWords,
                masteredWords: totalMastered,
                daysCompleted
            });

            // Load Today Stats
            const today = await getTodayStats();
            setTodayStats(today);
        };
        loadStats();
    }, []);

    const progressPercent = totalStats.totalWords > 0 
        ? Math.round((totalStats.masteredWords / totalStats.totalWords) * 100) 
        : 0;

    return (
        <div className="flex flex-col h-full w-full p-4 md:p-8 overflow-y-auto bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
            <div className="mb-8 md:mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary dark:text-white tracking-tight font-sans mb-2 transition-colors">{greeting}</h2>
                <p className="text-text-secondary dark:text-zinc-400">오늘도 영어 실력을 향상시켜보세요.</p>
            </div>

            {/* Today's Stats Section */}
            <div className="mb-12">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <Calendar className="text-blue-500" size={24} />
                    오늘의 학습
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 dark:text-zinc-400 font-bold">학습한 단어</div>
                            <div>
                                <span className="text-2xl font-black text-slate-800 dark:text-white">{todayStats.uniqueWords}</span>
                                <span className="text-xs text-slate-400 ml-1">개</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center">
                            <Activity size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 dark:text-zinc-400 font-bold">총 학습 횟수</div>
                            <div>
                                <span className="text-2xl font-black text-slate-800 dark:text-white">{todayStats.totalReviews}</span>
                                <span className="text-xs text-slate-400 ml-1">회</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center">
                            <CheckSquare size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 dark:text-zinc-400 font-bold">객관식 퀴즈</div>
                            <div>
                                <span className="text-2xl font-black text-slate-800 dark:text-white">{todayStats.choiceCount}</span>
                                <span className="text-xs text-slate-400 ml-1">회</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center">
                            <Edit3 size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 dark:text-zinc-400 font-bold">주관식 퀴즈</div>
                            <div>
                                <span className="text-2xl font-black text-slate-800 dark:text-white">{todayStats.writeCount}</span>
                                <span className="text-xs text-slate-400 ml-1">회</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <Trophy className="text-amber-500" size={24} />
                전체 학습 현황
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 transition-colors group hover:shadow-md hover:-translate-y-1 duration-300">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Activity size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-text-secondary dark:text-zinc-400 font-bold uppercase">전체 진행률</div>
                            <div className="text-2xl font-black text-text-primary dark:text-white">{progressPercent}%</div>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 transition-colors group hover:shadow-md hover:-translate-y-1 duration-300">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Zap size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-text-secondary dark:text-zinc-400 font-bold uppercase">마스터한 단어</div>
                            <div className="text-2xl font-black text-text-primary dark:text-white">
                                {totalStats.masteredWords} <span className="text-sm text-text-secondary dark:text-zinc-500 font-medium">/ {totalStats.totalWords}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 transition-colors group hover:shadow-md hover:-translate-y-1 duration-300">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Trophy size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-text-secondary dark:text-zinc-400 font-bold uppercase">완료한 Day</div>
                            <div className="text-2xl font-black text-text-primary dark:text-white">
                                {totalStats.daysCompleted} <span className="text-sm text-text-secondary dark:text-zinc-500 font-medium">/ {DATA_SETS.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 transition-colors">
                    <h3 className="text-xl font-bold text-text-primary dark:text-white mb-6 flex items-center gap-2">
                        <Clock size={20} className="text-accent" />
                        학습 팁
                    </h3>
                    <ul className="space-y-4 text-text-secondary dark:text-zinc-400">
                        <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                            <p>매일 꾸준히 학습하는 것이 중요합니다. 하루 10분이라도 투자해보세요.</p>
                        </li>
                        <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                            <p>객관식 퀴즈로 기본기를 다지고, 받아쓰기로 철자를 완벽하게 익히세요.</p>
                        </li>
                        <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                            <p>틀린 단어는 오답 노트를 통해 반복해서 학습할 수 있습니다.</p>
                        </li>
                    </ul>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
                    
                    <h3 className="text-2xl font-bold mb-4 relative z-10">오늘의 동기부여</h3>
                    <blockquote className="text-lg italic font-serif leading-relaxed opacity-90 relative z-10 mb-6">
                        "The beautiful thing about learning is that no one can take it away from you."
                    </blockquote>
                    <p className="text-right font-medium opacity-80 relative z-10">- B.B. King</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
