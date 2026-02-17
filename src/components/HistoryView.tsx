import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { History, Calendar, CheckCircle, Clock } from 'lucide-react';
import { db } from '../db';
import { DATA_SETS } from '../data';

const HistoryView = () => {
    const sessions = useLiveQuery(() => 
        db.studySessions.orderBy('endTime').reverse().toArray()
    );

    if (!sessions) return <div className="p-8">Loading...</div>;

    if (sessions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                <History size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">아직 학습 기록이 없습니다.</p>
                <p className="text-sm">학습을 시작하여 기록을 남겨보세요!</p>
            </div>
        );
    }

    // Group by Date
    const grouped = sessions.reduce((groups, session) => {
        const date = format(session.endTime, 'yyyy-MM-dd');
        if (!groups[date]) groups[date] = [];
        groups[date].push(session);
        return groups;
    }, {} as Record<string, typeof sessions>);

    const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-zinc-950 overflow-y-auto">
            <div className="p-8 pb-4 shrink-0">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2 flex items-center gap-3">
                    <History className="text-blue-500" size={32} />
                    학습 기록
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    지난 학습 활동을 확인하세요.
                </p>
            </div>

            <div className="flex-1 p-8 pt-0 space-y-8 pb-20">
                {dates.map(date => (
                    <div key={date}>
                        <h3 className="text-sm font-bold text-slate-500 dark:text-zinc-500 mb-4 flex items-center gap-2">
                            <Calendar size={16} />
                            {format(new Date(date), 'yyyy년 MM월 dd일 (EEE)', { locale: ko })}
                        </h3>
                        
                        <div className="space-y-3">
                            {grouped[date].map(session => {
                                const dataset = DATA_SETS.find(d => d.id === session.dataSetId);
                                const title = dataset ? dataset.title : session.dataSetId;
                                const durationSec = Math.floor((session.endTime - session.startTime) / 1000);
                                const durationMin = Math.floor(durationSec / 60);

                                return (
                                    <div key={session.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                session.mode === 'CHOICE' 
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                                                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                            }`}>
                                                {session.mode === 'CHOICE' ? '객' : '주'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-white">{title}</h4>
                                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {format(session.endTime, 'a h:mm', { locale: ko })}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{durationMin > 0 ? `${durationMin}분` : `${durationSec}초`}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-lg font-black text-slate-800 dark:text-white">
                                                {Math.round((session.correctCount / (session.correctCount + session.wrongCount)) * 100)}%
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-zinc-400">
                                                {session.correctCount} / {session.correctCount + session.wrongCount} 정답
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryView;
