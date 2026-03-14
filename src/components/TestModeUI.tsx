import { useEffect, useRef, useState } from 'react';
import { FileCheck } from 'lucide-react';
import type { Word } from '../data/types';
import useTestInputController from '../hooks/useTestInputController';

interface TestModeUIProps {
    words: Word[];
    onComplete: (results: { wordId: string; isCorrect: boolean }[], direction: 'EN_TO_KR' | 'KR_TO_EN') => void;
    onQuit: () => void;
}

type TestDirection = 'EN_TO_KR' | 'KR_TO_EN';

const ITEM_HEIGHT = 112; // h-28 = 7rem = 112px

const TestModeUI = ({ words, onComplete, onQuit }: TestModeUIProps) => {
    const [step, setStep] = useState<'CONFIG' | 'TEST'>('CONFIG');
    const [direction, setDirection] = useState<TestDirection>('EN_TO_KR');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const {
        answers,
        currentIndex,
        setCurrentIndex,
        handleInputChange,
        handleKeyDown,
        handleSubmit,
        handleWheel,
    } = useTestInputController({
        words,
        step,
        direction,
        inputRefs,
        onComplete,
    });

    useEffect(() => {
        if (step !== 'CONFIG') return;
        inputRefs.current = [];
    }, [step]);

    // 설정 화면 (Step 1)
    if (step === 'CONFIG') {
        return (
            <div className="vm-page flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200">
                <div className="max-w-md w-full text-center space-y-8">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <FileCheck size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary dark:text-white mb-2">실전 모의고사</h2>
                        <p className="text-text-secondary dark:text-zinc-400">
                            총 <span className="text-accent font-bold">{words.length}</span>개의 단어를 연속으로 테스트합니다.<br/>
                            중간에 답을 공개하지 않으며, 실제 시험처럼 진행됩니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mt-8">
                        <button
                            onClick={() => { setDirection('EN_TO_KR'); setStep('TEST'); }}
                            className="p-6 rounded-xl border-2 border-slate-200 dark:border-zinc-700 hover:border-accent dark:hover:border-accent vm-card transition-all text-left group hover:shadow-lg hover:-translate-y-1"
                        >
                            <span className="block text-xs font-bold text-accent mb-1 tracking-wider">TYPE 1</span>
                            <span className="text-lg font-bold text-text-primary dark:text-white group-hover:text-accent transition-colors">
                                영어 단어장 (1단계 Test)
                            </span>
                            <div className="text-sm text-slate-400 mt-2">영어 단어 &rarr; 한글 뜻 맞추기</div>
                        </button>
                        <button
                            onClick={() => { setDirection('KR_TO_EN'); setStep('TEST'); }}
                            className="p-6 rounded-xl border-2 border-slate-200 dark:border-zinc-700 hover:border-accent dark:hover:border-accent vm-card transition-all text-left group hover:shadow-lg hover:-translate-y-1"
                        >
                            <span className="block text-xs font-bold text-accent mb-1 tracking-wider">TYPE 2</span>
                            <span className="text-lg font-bold text-text-primary dark:text-white group-hover:text-accent transition-colors">
                                영어 철자 쓰기 (2단계 Test)
                            </span>
                            <div className="text-sm text-slate-400 mt-2">한글 뜻 &rarr; 영어 철자 맞추기</div>
                        </button>
                    </div>

                    <button onClick={onQuit} className="text-sm text-text-secondary hover:text-text-primary mt-8 underline decoration-slate-300 underline-offset-4">
                        나중에 하기
                    </button>
                </div>
            </div>
        );
    }

    // 시험 화면 (Step 2)
    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-zinc-950 relative">
            {/* 상단 프로그레스 */}
            <div className="h-14 flex items-center justify-between gap-3 px-4 md:px-6 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 z-10 shrink-0 shadow-sm">
                <div className="text-sm font-bold text-text-secondary dark:text-zinc-400 font-mono">
                    Problem <span className="text-accent text-lg">{currentIndex + 1}</span> <span className="text-slate-300 mx-1">/</span> {words.length}
                </div>
                <div className="hidden sm:block px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs font-bold text-text-secondary dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                    {direction === 'EN_TO_KR' ? '단어 ➔ 뜻' : '뜻 ➔ 단어'}
                </div>
                <button
                    onClick={() => {
                        if (window.confirm('작성을 완료하고 제출하시겠습니까?')) {
                            handleSubmit();
                        }
                    }}
                    className="px-4 py-1.5 bg-accent text-white text-sm font-bold rounded-lg hover:bg-accent/90 transition-all shadow-sm hover:shadow active:scale-95"
                >
                    최종 제출
                </button>
            </div>

            {/* 메인 리스트 영역 */}
            <div 
                className="flex-1 overflow-y-hidden relative flex flex-col items-center select-none cursor-default" 
                onClick={() => {
                    const input = inputRefs.current[currentIndex];
                    input?.focus();
                }}
                onWheel={handleWheel}
            >
                {/* 포커스 하이라이트 배경 (중앙) */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-28 bg-white dark:bg-zinc-800 border-y border-accent/20 dark:border-accent/20 shadow-sm z-0 pointer-events-none" />

                {/* 스크롤 가능한 리스트 컨테이너 */}
                <div 
                    className="w-full max-w-4xl px-4 h-full relative z-10 transition-transform duration-300 ease-out will-change-transform"
                    style={{ 
                        // 중앙 정렬을 위한 위치 계산
                        // 화면 중앙(50%) - (현재 인덱스 * 아이템높이) - (아이템높이의 절반)
                        transform: `translateY(calc(50% - ${currentIndex * ITEM_HEIGHT}px - ${ITEM_HEIGHT / 2}px))` 
                    }}
                >
                    {/* 상하 여백 제거 (transform으로 조정) */}
                    <div className="space-y-0 text-center"> 
                        {words.map((word, index) => {
                            const isFocused = index === currentIndex;
                            
                            // 렌더링 최적화: 현재 인덱스 주변만 렌더링해도 되지만, 
                            // transform 방식에서는 레이아웃 유지를 위해 모두 렌더링하되 
                            // 보이지 않는 것은 visibility: hidden 처리하거나 비워두는게 좋음.
                            // 하지만 갯수가 많지 않다면 일단 다 그려도 됨. 
                            // 성능 문제 발생시 가상 스크롤 도입 필요.
                            const distance = Math.abs(index - currentIndex);
                            const isVisible = distance <= 10; // 렌더링 범위 늘림

                            if (!isVisible) {
                                return <div key={word.id} style={{ height: ITEM_HEIGHT }} className="w-full" />;
                            }

                            return (
                                <div
                                    key={word.id}
                                    style={{ height: ITEM_HEIGHT }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentIndex(index);
                                    }}
                                    className={`flex items-center transition-all duration-300 cursor-pointer group px-4 rounded-xl box-border ${
                                        isFocused ? 'opacity-100 scale-100' : 'opacity-20 blur-[1px] scale-95 hover:opacity-60 hover:blur-0'
                                    }`}
                                >
                                    {/* 인덱스 */}
                                    <div className={`w-16 text-right mr-8 font-mono text-xl ${isFocused ? 'text-accent font-bold' : 'text-slate-300 dark:text-zinc-600'}`}>
                                        {index + 1}.
                                    </div>

                                    {/* 문제 영역 (좌측) */}
                                    <div className="flex-1 text-right pr-10 border-r border-slate-200 dark:border-zinc-700 h-16 flex flex-col justify-center items-end">
                                        <span className={`font-bold transition-colors line-clamp-2 ${
                                            isFocused ? 'text-3xl text-text-primary dark:text-white' : 'text-xl text-slate-400 dark:text-zinc-500'
                                        }`}>
                                            {direction === 'EN_TO_KR' ? word.word : word.definitions.join(', ')}
                                        </span>
                                    </div>

                                    {/* 입력 영역 (우측) */}
                                    <div className="flex-1 pl-10 h-16 flex flex-col justify-center items-start">
                                        <input
                                            ref={(el) => {
                                                inputRefs.current[index] = el;
                                            }}
                                            id={`input-${word.id}`}
                                            type="text"
                                            value={answers[word.id] || ''}
                                            onChange={(e) => handleInputChange(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            disabled={!isFocused}
                                            placeholder={isFocused ? (direction === 'EN_TO_KR' ? '뜻을 입력하세요' : '단어를 입력하세요') : ''}
                                            className={`w-full max-w-md bg-transparent text-2xl font-medium outline-none transition-colors border-b-2 placeholder:text-slate-300 dark:placeholder:text-zinc-700 placeholder:text-lg ${
                                                isFocused 
                                                    ? 'border-accent text-text-primary dark:text-white py-2' 
                                                    : 'border-transparent text-slate-400 dark:text-zinc-500 py-2'
                                            }`}
                                            autoComplete="off"
                                        />
                                    </div>
                                    
                                    {/* 작성 상태 표시 */}
                                    <div className="w-12 ml-4 flex justify-center">
                                         {answers[word.id] && !isFocused && (
                                             <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-200" />
                                         )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* 하단 힌트 */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-xs text-text-secondary dark:text-zinc-500 animate-fade-in pointer-events-none">
                <div className="flex items-center gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur px-4 py-2 rounded-full border border-slate-100 dark:border-zinc-800 shadow-sm">
                    <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-300 dark:border-zinc-600 font-mono text-[10px]">Enter</kbd> 다음 단어</span>
                    <span className="w-px h-3 bg-slate-300 dark:bg-zinc-700"></span>
                    <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-300 dark:border-zinc-600 font-mono text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-300 dark:border-zinc-600 font-mono text-[10px]">↓</kbd> 이동</span>
                    <span className="w-px h-3 bg-slate-300 dark:bg-zinc-700"></span>
                    <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-300 dark:border-zinc-600 font-mono text-[10px]">Wheel</kbd> 스크롤</span>
                </div>
            </div>
        </div>
    );
};

export default TestModeUI;