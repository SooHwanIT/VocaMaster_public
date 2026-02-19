import React from 'react';
import { CheckCircle, XCircle, Trophy, ArrowRight, RotateCcw, Home } from 'lucide-react';
import type { Word } from '../data/types';
import type { SessionStats } from '../app/types';

interface TestResultViewProps {
    stats: SessionStats;
    results: { wordId: string; isCorrect: boolean }[];
    words: Word[];
    testType: 'EN_TO_KR' | 'KR_TO_EN'; // 1단계 or 2단계
    onRetry: () => void;
    onDashboard: () => void;
}

const TestResultView: React.FC<TestResultViewProps> = ({ 
    stats, 
    results, 
    words,
    testType,
    onRetry, 
    onDashboard 
}) => {
    const score = Math.round(((stats.totalTries - (stats.wrongAttempts || 0)) / stats.totalWordCount) * 100);
    const isPass = score >= 80; // 80점 이상 합격 기준 예시

    // 오답 리스트
    const wrongResults = results.filter(r => !r.isCorrect);
    const wrongWords = wrongResults.map(r => words.find(w => w.id === r.wordId)).filter(Boolean) as Word[];

    const handleApplyLevel = () => {
        // 여기에 "단어로 설정 하시겠습니까?" 에 대한 로직 추가
        // 예: DB에 해당 단어들의 레벨을 업데이트하거나, 다음 학습 단계로 설정 등
        // 현재는 알림만 표시
        const levelName = testType === 'EN_TO_KR' ? '1단계' : '2단계';
        alert(`통과한 단어들을 [${levelName}] 완료 상태로 설정했습니다! (기능 준비중)`);
        onDashboard();
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-[#09090b] relative overflow-hidden">
            {/* 배경 데코레이션 */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-slate-100 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />

            <div className="flex-1 overflow-y-auto z-10 p-6 md:p-12 flex flex-col items-center">
                
                {/* 점수 카드 */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-zinc-800 w-full max-w-lg text-center mb-8 relative overflow-hidden group">
                    <div className={`absolute top-0 inset-x-0 h-2 ${isPass ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    
                    <div className="flex justify-center mb-6">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${
                            isPass 
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                                : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-600 dark:text-red-400'
                        }`}>
                            <Trophy size={40} className={isPass ? "animate-bounce" : ""} />
                        </div>
                    </div>

                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
                        {score}점
                    </h2>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium mb-6">
                        {isPass ? '축하합니다! 훌륭한 성적이에요.' : '조금만 더 노력해보세요!'}
                    </p>

                    <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-zinc-800 pt-6">
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalWordCount}</div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Total</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-emerald-500">{stats.totalTries - (stats.wrongAttempts || 0)}</div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Correct</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-red-500">{stats.wrongAttempts}</div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Wrong</div>
                        </div>
                    </div>
                </div>

                {/* 단계 설정 제안 카드 (점수가 높을 때만 표시하거나 항상 표시) */}
                {score >= 0 && (
                     <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-lg text-white w-full max-w-lg mb-8 flex items-center justify-between">
                        <div>
                            <div className="font-bold text-lg mb-1">
                                {testType === 'EN_TO_KR' ? '1단계' : '2단계'} 완료 설정
                            </div>
                            <div className="text-indigo-100 text-sm opacity-90">
                                현재 결과를 바탕으로 단어 레벨을 조정할까요?
                            </div>
                        </div>
                        <button 
                            onClick={handleApplyLevel}
                            className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors shadow-sm"
                        >
                            설정하기
                        </button>
                     </div>
                )}

                {/* 오답 노트 */}
                {wrongWords.length > 0 && (
                    <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                <XCircle size={20} className="text-red-500" />
                                오답 노트
                            </h3>
                            <span className="text-sm text-slate-500">{wrongWords.length}개 틀림</span>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-zinc-800 max-h-96 overflow-y-auto">
                            {wrongWords.map((word) => (
                                <div key={word.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <div>
                                        <div className="font-bold text-lg text-slate-900 dark:text-white mb-1">{word.word}</div>
                                        <div className="text-sm text-slate-600 dark:text-zinc-400">{word.definitions.join(', ')}</div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">오답</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* 하단 액션 바 */}
            <div className="p-4 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex justify-center gap-3 shrink-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button
                    onClick={onDashboard}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                >
                    <Home size={18} />
                    <span>홈으로</span>
                </button>
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-zinc-200 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                    <RotateCcw size={18} />
                    <span>다시 풀기</span>
                </button>
            </div>
        </div>
    );
};

export default TestResultView;
