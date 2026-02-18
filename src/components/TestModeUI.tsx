import React, { useState, useEffect, useRef } from 'react';
import { FileCheck } from 'lucide-react';
import type { Word } from '../data/types';

interface TestModeUIProps {
    words: Word[];
    onComplete: (results: { wordId: string; isCorrect: boolean }[]) => void;
    onQuit: () => void;
}

type TestDirection = 'EN_TO_KR' | 'KR_TO_EN';

const ITEM_HEIGHT = 112; // h-28 = 7rem = 112px

const TestModeUI: React.FC<TestModeUIProps> = ({ words, onComplete, onQuit }) => {
    const [step, setStep] = useState<'CONFIG' | 'TEST'>('CONFIG');
    const [direction, setDirection] = useState<TestDirection>('EN_TO_KR');
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]); // Keep this for legacy or fallback
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // 스크롤 중앙 정렬 및 오토 포커스 로직
    useEffect(() => {
        if (step === 'TEST') {
            // 2. 입력창 포커스 (약간의 지연을 주어 부드럽게 처리)
            // requestAnimationFrame을 사용하여 렌더링 직후 실행 보장
            requestAnimationFrame(() => {
                const input = inputRefs.current[currentIndex];
                input?.focus();
            });
        }
    }, [currentIndex, step, words]);

    // 마우스 휠 이벤트 핸들러
    const lastWheelTime = useRef(0);
    const handleWheel = (e: React.WheelEvent) => {
        const now = Date.now();
        // 너무 빠른 스크롤 방지 (Throttle: 50ms)
        if (now - lastWheelTime.current < 50) return;
        
        if (e.deltaY > 0) {
            // 아래로 스크롤 -> 다음 문제
            if (currentIndex < words.length - 1) {
                setCurrentIndex(prev => prev + 1);
                lastWheelTime.current = now;
            }
        } else if (e.deltaY < 0) {
            // 위로 스크롤 -> 이전 문제
            if (currentIndex > 0) {
                setCurrentIndex(prev => prev - 1);
                lastWheelTime.current = now;
            }
        }
    };

    // 입력 처리
    const handleInputChange = (value: string) => {
        setAnswers(prev => ({
            ...prev,
            [words[currentIndex].id]: value
        }));
    };

    // 다음 문제로 이동
    const handleNext = () => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // 마지막 문제인 경우 제출 확인
            if (window.confirm('모든 문제를 풀었습니다. 제출하시겠습니까?')) {
                handleSubmit();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 기본 줄바꿈 방지
            handleNext();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (currentIndex < words.length - 1) setCurrentIndex(prev => prev + 1);
        }
    };

    const handleSubmit = () => {
        const results = words.map(word => {
            const userAnswer = (answers[word.id] || '').trim().toLowerCase();
            let isCorrect = false;

            if (direction === 'EN_TO_KR') {
                // 단어(EN) 보고 뜻(KR) 맞추기
                // 정답 체크 로직 개선:
                // 1. (명), (동) 등의 품사 태그 제거
                // 2. 쉼표(,) 등으로 구분된 여러 뜻 각각 비교
                // 3. 공백 제거 후 비교
                
                // 전처리 함수: 괄호 안의 내용 제거, 공백 제거
                const normalize = (str: string) => str.replace(/\([^)]*\)/g, '').replace(/[\s\.]/g, '').toLowerCase();
                const cleanUserAnswer = normalize(userAnswer);

                if (cleanUserAnswer.length > 0) {
                    // definitions 배열의 각 항목에 대해 쉼표로 분리하여 모든 가능한 정답군 생성
                    const validAnswers = word.definitions.flatMap(def => 
                        def.replace(/\([^)]*\)/g, '') // 괄호 제거
                           .split(/[,/]/)             // 쉼표나 슬래시로 구분
                           .map(d => normalize(d))    // 정규화
                    ).filter(d => d.length > 0);      // 빈 문자열 제거

                    // 하나라도 일치하면 정답
                    isCorrect = validAnswers.some(ans => cleanUserAnswer === ans || cleanUserAnswer.includes(ans) && ans.length > 1);
                    // includes 조건 추가: "거의" 입력 시 "거의, 가까운" 중 "거의"와 일치.
                    // 단, 너무 짧은 단어 매칭 오작동 방지 위해 길이 체크, 하지만 === 체크가 있으므로 includes는 보조적.
                    // 사용자가 "거의"라고 쳤는데 정답 데이터가 "거의없는" 이라면? 
                    // 사용자가 "거의"라고 쳤는데 데이터가 "거의"라면 === 로 통과.
                    // 사용자가 "임원"이라 쳤는데 데이터가 "경영진, 임원" -> split되어 "임원" 존재 -> 통과.
                    // includes는 사용자가 "경영진"을 "경영진들"이라고 썼을 때 등을 위한 것인데,
                    // 반대로 정답이 "run"인데 사용자가 "running"이라고 쓴 경우? (한글 뜻 맞추기니까 이건 아님)
                    // 사용자가 "가까운"이라고 썼는데 정답이 "가까운, 친밀한" -> split되어 "가까운" 존재 -> 통과.
                    
                    // 정확히 일치하는 것을 우선으로 하되, 사용자의 입력이 정답의 일부이거나 정답이 사용자 입력의 일부인 경우도?
                    // 사용자의 요구사항: "(명)거의, 가까운" -> "거의" 정답 인정.
                    // 위 로직(split)으로 "거의"가 validAnswers에 포함되므로 === 비교로 충분함.
                    isCorrect = validAnswers.some(ans => cleanUserAnswer === ans);
                }
            } else {
                // 뜻(KR) 보고 단어(EN) 맞추기
                isCorrect = userAnswer === word.word.toLowerCase();
            }
            return { wordId: word.id, isCorrect };
        });
        
        // 점수 저장 (App.tsx에서 로컬스토리지를 읽을 수 있도록 저장)
        // 현재 words가 속한 dayId를 알기 어려우므로(props에 없음), 여기서는 순수 기능만 수행하고, 
        // App.tsx나 상위 컴포넌트에서 결과 처리 시 점수를 저장하도록 하는게 맞음.
        // 하지만 요구사항에 메뉴에서 점수를 보여달라고 했으므로, 
        // 편의상 여기서 저장하거나 onComplete 이후 상위에서 처리해야 함.
        // QuizSessionManager가 dataSetId를 가지고 있으므로 거기서 처리하는게 좋지만,
        // QuizSessionManager 코드를 수정하지 않고 처리하려면 여기서 저장해야하는데 dayId가 없음.
        // 일단 로컬스토리지 저장은 onComplete 이후 상위(QuizSessionManager -> handleQuizFinish -> App)에서 처리되는게 정석.
        // 다만 App.tsx의 handleQuizFinish에서 "Test Mode"일 경우 점수를 로컬스토리지에 저장하는 로직을 추가해야 함.
        // 지금은 우선 UI 구현에 집중.

        onComplete(results);
    };

    // 설정 화면 (Step 1)
    if (step === 'CONFIG') {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 bg-slate-50 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-200">
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
                            className="p-6 rounded-xl border-2 border-slate-200 dark:border-zinc-700 hover:border-accent dark:hover:border-accent bg-white dark:bg-zinc-800 transition-all text-left group hover:shadow-lg hover:-translate-y-1"
                        >
                            <span className="block text-xs font-bold text-accent mb-1 tracking-wider">TYPE 1</span>
                            <span className="text-lg font-bold text-text-primary dark:text-white group-hover:text-accent transition-colors">
                                영어 단어 보고 &rarr; 한글 뜻 쓰기
                            </span>
                        </button>
                        <button
                            onClick={() => { setDirection('KR_TO_EN'); setStep('TEST'); }}
                            className="p-6 rounded-xl border-2 border-slate-200 dark:border-zinc-700 hover:border-accent dark:hover:border-accent bg-white dark:bg-zinc-800 transition-all text-left group hover:shadow-lg hover:-translate-y-1"
                        >
                            <span className="block text-xs font-bold text-accent mb-1 tracking-wider">TYPE 2</span>
                            <span className="text-lg font-bold text-text-primary dark:text-white group-hover:text-accent transition-colors">
                                한글 뜻 보고 &rarr; 영어 스펠링 쓰기
                            </span>
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
        <div className="h-full flex flex-col bg-slate-50 dark:bg-zinc-900 relative">
            {/* 상단 프로그레스 */}
            <div className="h-14 flex items-center justify-between px-6 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 z-10 shrink-0 shadow-sm">
                <div className="text-sm font-bold text-text-secondary dark:text-zinc-400 font-mono">
                    Problem <span className="text-accent text-lg">{currentIndex + 1}</span> <span className="text-slate-300 mx-1">/</span> {words.length}
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs font-bold text-text-secondary dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
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
                    ref={containerRef}
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
                                    ref={(el) => { itemRefs.current[index] = el; }}
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
                                            ref={el => inputRefs.current[index] = el}
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