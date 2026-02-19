import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { History, Calendar, CheckCircle, Clock } from 'lucide-react';
import { db } from '../db';
import { DATA_SETS } from '../data';
import TestResultView from './TestResultView';
import ResultView from './ResultView';
import type { SessionStats } from '../app/types';

const HistoryView = () => {
    const sessions = useLiveQuery(() => 
        db.studySessions.orderBy('endTime').reverse().toArray()
    );
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

    if (!sessions) return <div className="p-8">Loading...</div>;

    // 선택된 세션 상세 팝업용 데이터
    const selectedSession = sessions.find(s => s.id === selectedSessionId);
    
    // TestResultView용 format으로 변환
    const statsForPopup: SessionStats | null = selectedSession ? {
        startTime: selectedSession.startTime,
        endTime: selectedSession.endTime,
        totalTries: selectedSession.totalCount, // totalCount가 tries와 같다고 가정 (or stored separately)
        wrongAttempts: selectedSession.wrongCount,
        totalWordCount: selectedSession.totalCount,
        masteredCount: 0, // DB에 저장되었는지 확인 필요. 현재는 0
        mostWrong: '', // DB에 저장 안 됨
        wrongWords: selectedSession.wrongWords // 오답/학습 단어 리스트
    } : null;

    // 해당 데이터셋 찾기
    const sessionDataSet = selectedSession ? DATA_SETS.find(d => d.id === selectedSession.dataSetId) : null;

    // 결과 뷰 렌더링을 위한 임시 empty results (DB에 상세 결과 저장을 안 함... ㅠㅠ)
    // 오답노트는 못 보여주고 점수만 보여줄 수 있음. 
    // 혹은 오답노트를 보고싶다면 session 저장 시 wrongWordsIdList를 저장해야함.
    // 현재 db.ts의 StudySession 인터페이스를 확인해보겠습니다.
    
    // 만약 `TestResultView`가 `results` prop을 필수로 요구한다면...
    // 일단 빈 배열을 넘겨서 점수판이라도 보여주도록 합시다.
    
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
        <div className="flex flex-col h-full bg-slate-50 dark:bg-zinc-950 overflow-y-auto relative">
            {/* 결과 팝업 */}
            {selectedSessionId && selectedSession && statsForPopup && sessionDataSet && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden relative">
                        <button 
                            onClick={() => setSelectedSessionId(null)}
                            className="absolute top-4 right-4 z-50 p-2 bg-white/50 dark:bg-black/50 rounded-full hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        
                        {/* 
                           DB에 저장된 wrongWords가 있으면 상세 오답 노트를 보여주고,
                           없으면(구 버전 데이터) 빈 배열 전달.
                        */}
                        <div className="relative h-full">
                            {sessionDataSet && (statsForPopup.wrongAttempts || 0) > 0 && !(selectedSession.wrongWords && selectedSession.wrongWords.length > 0) && (
                                <div className="absolute top-4 left-4 z-50 text-xs text-slate-500 bg-white/80 px-2 py-1 rounded-md border border-slate-200">
                                    * 과거 기록에는 상세 오답 목록이 저장되지 않았을 수 있습니다.
                                </div>
                            )}

                            {selectedSession.mode === 'TEST' ? (
                                <TestResultView 
                                    stats={statsForPopup}
                                    results={(selectedSession.wrongWords || []).map(id => ({ wordId: id, isCorrect: false }))}
                                    words={sessionDataSet?.words || []}
                                    testType="EN_TO_KR" // 저장 안하므로 기본값
                                    onRetry={() => setSelectedSessionId(null)} 
                                    onDashboard={() => setSelectedSessionId(null)} 
                                />
                            ) : (
                                <ResultView
                                    stats={statsForPopup}
                                    words={sessionDataSet?.words}
                                    onRetry={() => setSelectedSessionId(null)}
                                    onDashboard={() => setSelectedSessionId(null)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 md:p-8 pb-4 shrink-0">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2 flex items-center gap-3">
                    <History className="text-blue-500" size={32} />
                    학습 기록
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    지난 학습 활동을 확인하세요. 클릭하여 상세 결과를 볼 수 있습니다.
                </p>
            </div>

            <div className="flex-1 p-4 md:p-8 pt-0 space-y-8 pb-20">
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
                                    <div 
                                        key={session.id} 
                                        onClick={() => setSelectedSessionId(session.id!)}
                                        className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                                                session.mode === 'CHOICE' 
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                                                    : session.mode === 'TEST'
                                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                            }`}>
                                                {session.mode === 'CHOICE' ? '객' : session.mode === 'TEST' ? '시' : '주'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h4>
                                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {format(session.endTime, 'a h:mm', { locale: ko })}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{durationMin > 0 ? `${durationMin}분` : `${durationSec}초`}</span>
                                                    {session.mode === 'TEST' && <span className="font-bold text-red-500 ml-1">실전 모의고사</span>}
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
