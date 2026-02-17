
import React, { useState, useEffect } from 'react';
import { DATA_SETS } from '../data';
import type { Word } from '../data';
import { Play, Grid, Type, Clock, ArrowLeft, RefreshCw, Trophy, X, Heart, Pause } from 'lucide-react';

// --- Types ---
type GameType = 'NONE' | 'MATCHING' | 'TYPING' | 'QUIZ';

interface CardItem {
    id: string; // unique internal id for the grid
    wordId: string; // actual word id used for matching
    text: string;
    type: 'EN' | 'KO';
    isMatched: boolean;
}

// --- Matching Game Component ---
const MatchingGame = ({ onExit }: { onExit: () => void }) => {
    const [cards, setCards] = useState<CardItem[]>([]);
    const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
    const [matches, setMatches] = useState(0);
    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [isGameOver, setIsGameOver] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // Initialize Game
    useEffect(() => {
        startRound(1, 3, 0);
    }, []);

    const startRound = (roundNum: number, currentLives: number, currentScore: number) => {
        // 1.단어 데이터에서 랜덤으로 8개 뽑기
        const allWords = DATA_SETS.flatMap(d => d.words);
        const shuffledWords = [...allWords].sort(() => 0.5 - Math.random());
        const selectedWords = shuffledWords.slice(0, 8);

        // 2. 카드 만들기 (영어 8개 + 한글 8개 = 16개)
        const gameCards: CardItem[] = [];
        selectedWords.forEach((w: Word) => {
            gameCards.push({ id: `en-${w.id}`, wordId: w.id, text: w.word, type: 'EN', isMatched: false });
            gameCards.push({ id: `ko-${w.id}`, wordId: w.id, text: w.definitions[0], type: 'KO', isMatched: false });
        });

        // 3. 카드 섞기
        setCards(gameCards.sort(() => 0.5 - Math.random()));
        setSelectedCards([]);
        setMatches(0);
        setLives(currentLives);
        setScore(currentScore);
        setRound(roundNum);
        setIsGameOver(false);
        setMessage(null);
    };

    const handleCardClick = (clickedCard: CardItem) => {
        // 게임 오버 상태거나, 이미 매칭되었거나, 이미 선택된 카드라면 무시
        if (isGameOver || clickedCard.isMatched || selectedCards.find(c => c.id === clickedCard.id)) return;

        // 이미 2장 선택된 상태라면 무시 (처리 중)
        if (selectedCards.length >= 2) return;

        const newSelected = [...selectedCards, clickedCard];
        setSelectedCards(newSelected);

        // 2장이 선택되었을 때 매칭 검사
        if (newSelected.length === 2) {
            const [first, second] = newSelected;
            
            if (first.wordId === second.wordId) {
                // 매칭 성공
                setTimeout(() => {
                    setCards(prev => prev.map(c => 
                        (c.id === first.id || c.id === second.id) 
                        ? { ...c, isMatched: true } 
                        : c
                    ));
                    setSelectedCards([]);
                    setScore(prev => prev + 100);
                    setMatches(prev => {
                        const newMatches = prev + 1;
                        if (newMatches === 8) {
                            // Round Clear
                            setTimeout(() => {
                                startRound(round + 1, lives, score + 500); // 보너스 점수
                            }, 1000);
                        }
                        return newMatches;
                    });
                }, 300);
            } else {
                // 매칭 실패
                setTimeout(() => {
                    setSelectedCards([]);
                    setLives(prev => {
                        const newLives = prev - 1;
                        if (newLives <= 0) {
                            setIsGameOver(true);
                        }
                        return newLives;
                    });
                    // 틀렸을 때 시각적 피드백
                    setMessage("Miss!");
                    setTimeout(() => setMessage(null), 800);
                }, 800);
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-zinc-950 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={onExit} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                    <ArrowLeft size={20} /> <span className="font-bold">나가기</span>
                </button>
                <div className="flex gap-6 text-sm font-bold items-center">
                    <div className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-full shadow-sm text-slate-600 dark:text-slate-300">
                        ROUND <span className="text-purple-500 text-lg ml-1">{round}</span>
                    </div>
                    <div className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-full shadow-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <Heart size={18} className="text-red-500 fill-red-500" />
                        <span className="text-lg">{lives}</span>
                    </div>
                    <div className="min-w-[100px] text-right text-xl font-black text-slate-800 dark:text-white">
                        {score.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Game Board */}
            <div className="flex-1 flex flex-col justify-center items-center relative">
                {message && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-4xl font-black text-red-500 animate-bounce">
                        {message}
                    </div>
                )}

                {isGameOver ? (
                    <div className="text-center animate-in zoom-in duration-300 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-zinc-800">
                        <Trophy size={64} className="mx-auto text-yellow-400 mb-4" />
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Game Over</h2>
                        <div className="space-y-1 mb-8">
                            <p className="text-slate-500">최종 라운드: <span className="font-bold text-slate-800 dark:text-white">{round}</span></p>
                            <p className="text-slate-500">최종 점수: <span className="font-bold text-slate-800 dark:text-white text-xl">{score.toLocaleString()}</span></p>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <button onClick={() => startRound(1, 3, 0)} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30">
                                <RefreshCw size={18} /> 다시 도전하기
                            </button>
                            <button onClick={onExit} className="bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 text-slate-700 dark:text-white px-6 py-3 rounded-xl font-bold transition-all">
                                메뉴로
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-5xl mx-auto h-full flex flex-col justify-center">
                        <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full">
                        {cards.map(card => {
                            const isSelected = selectedCards.find(c => c.id === card.id);
                            return (
                                <button
                                    key={card.id}
                                    onClick={() => handleCardClick(card)}
                                    disabled={card.isMatched}
                                    className={`
                                        relative group rounded-2xl font-bold text-center p-3 md:p-6 flex items-center justify-center select-none transition-all duration-150
                                        min-h-[100px] md:min-h-[140px]
                                        ${card.isMatched 
                                            ? 'opacity-0 scale-90 pointer-events-none' 
                                            : 'opacity-100 scale-100'}
                                        ${isSelected
                                            ? 'bg-indigo-500/90 dark:bg-indigo-600 text-white shadow-inner translate-y-1'
                                            : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-slate-200 shadow-[0_4px_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_4px_0_0_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgba(0,0,0,0.1)] dark:hover:shadow-[0_6px_0_0_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-none border border-slate-200 dark:border-zinc-700'}
                                    `}
                                >
                                    <span className={`leading-snug break-keep ${card.type === 'EN' ? 'text-lg md:text-2xl font-black tracking-tight' : 'text-base md:text-xl font-bold'}`}>
                                        {card.text}
                                    </span>
                                    {/* Type Indicator (Optional) */}
                                    <span className={`absolute top-2 right-2 text-[10px] uppercase tracking-wider font-bold opacity-30 ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                                        {card.type}
                                    </span>
                                </button>
                            );
                        })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Arcade View ---
const ArcadeView = () => {
    const [activeGame, setActiveGame] = useState<GameType>('NONE');

    // Menu Screen
    if (activeGame === 'NONE') {
        return (
            <div className="flex flex-col h-full bg-slate-50 dark:bg-zinc-950 p-8 overflow-y-auto">
                <div className="pb-8">
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2 flex items-center gap-3">
                        <span className="bg-purple-500 text-white p-2 rounded-lg"><Grid size={24} /></span>
                        Arcade
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        지루한 암기는 그만! 게임으로 즐겁게 단어를 학습하세요.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Game Card 1: Speed Match */}
                    <button 
                        onClick={() => setActiveGame('MATCHING')}
                        className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 text-left hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="absolute top-4 right-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                            인기
                        </div>
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Grid className="text-blue-500" size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Speed Match</h3>
                        <p className="text-slate-500 dark:text-zinc-400 text-sm mb-6 leading-relaxed">
                            뒤집힌 카드의 짝을 맞추세요.<br/>기억력과 단어 연결 능력이 향상됩니다.
                        </p>
                        <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                            <Play size={16} fill="currentColor" /> Play Game
                        </div>
                    </button>

                    {/* Game Card 2: Word Rain (Placeholder) */}
                    <button 
                        disabled
                        className="group relative bg-slate-100 dark:bg-zinc-900/50 rounded-2xl border border-transparent p-6 text-left opacity-70 cursor-not-allowed"
                    >
                        <div className="absolute top-4 right-4 bg-slate-200 dark:bg-zinc-800 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
                            준비중
                        </div>
                        <div className="w-14 h-14 bg-slate-200 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-6">
                            <Type className="text-slate-400" size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400 mb-2">Word Rain</h3>
                        <p className="text-slate-400 dark:text-zinc-500 text-sm mb-6 leading-relaxed">
                            하늘에서 떨어지는 단어를<br/>타이핑하여 막아내세요.
                        </p>
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                            <Clock size={16} /> Coming Soon
                        </div>
                    </button>

                    {/* Game Card 3: Survival Quiz (Placeholder) */}
                    <button 
                        disabled
                        className="group relative bg-slate-100 dark:bg-zinc-900/50 rounded-2xl border border-transparent p-6 text-left opacity-70 cursor-not-allowed"
                    >
                         <div className="absolute top-4 right-4 bg-slate-200 dark:bg-zinc-800 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
                            준비중
                        </div>
                        <div className="w-14 h-14 bg-slate-200 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-6">
                            <Clock className="text-slate-400" size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400 mb-2">Survival Quiz</h3>
                        <p className="text-slate-400 dark:text-zinc-500 text-sm mb-6 leading-relaxed">
                            제한 시간 내에 정답을 맞추세요.<br/>틀리면 게임이 종료됩니다.
                        </p>
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                            <Clock size={16} /> Coming Soon
                        </div>
                    </button>
                </div>
            </div>
        );
    }

    // Active Game Screen
    if (activeGame === 'MATCHING') {
        return <MatchingGame onExit={() => setActiveGame('NONE')} />;
    }

    return null;
};

export default ArcadeView;
