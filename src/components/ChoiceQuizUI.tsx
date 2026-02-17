import React, { useEffect, useState } from 'react';
import { SkipForward } from 'lucide-react';

import { DATA_SETS } from '../data';
import type { Word } from '../data/types';
import type { QuizUIProps } from '../app/types';
import { getLevenshteinDistance, speakText } from '../app/utils';

const ChoiceQuizUI = ({
    current,
    remainingCount,
    masterPercent,
    sessionPercent,
    onResult,
    onExit
}: QuizUIProps) => {
    const [options, setOptions] = useState<Word[]>([]);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        if (!current) return;
        const allWords = DATA_SETS.flatMap(d => d.words);
        const others = allWords.filter(w => w.id !== current.id);

        others.sort((a, b) => getLevenshteinDistance(current.word, a.word) - getLevenshteinDistance(current.word, b.word));

        const distractors = others.slice(0, 3);
        const opts = [current, ...distractors].sort(() => Math.random() - 0.5);

        setOptions(opts);
        setIsAnswered(false);
        setSelectedId(null);
        setIsCorrect(false);
        speakText(current.word);
    }, [current]);

    const handleAnswer = (id: string) => {
        if (isAnswered) return;
        setIsAnswered(true);
        setSelectedId(id);
        const correct = id === current?.id;
        setIsCorrect(correct);
    };

    const handleNext = () => {
        onResult(isCorrect);
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (!isAnswered && ['1', '2', '3', '4'].includes(e.key)) {
                const idx = parseInt(e.key) - 1;
                if (options[idx]) handleAnswer(options[idx].id);
            }
            if (isAnswered && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleNext();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isAnswered, options, isCorrect]);

    if (!current) return null;

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-[#121212] p-6 md:p-10 overflow-hidden">
            <div className="flex justify-between items-center mb-6 text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
                <span>단어퀴즈</span>
                <div className="flex items-center gap-4">
                    <span>{remainingCount} 남음</span>
                    <button onClick={onExit} className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white text-xs">종료</button>
                </div>
            </div>

            <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 overflow-hidden mb-8 flex">
                <div className="h-full bg-[#1ed760] transition-all duration-700 relative group" style={{ width: `${masterPercent}%` }}>
                    <div className="absolute opacity-0 group-hover:opacity-100 bottom-4 left-1/2 -translate-x-1/2 bg-[#1db954]/20 text-[#1ed760] text-xs px-2 py-1 whitespace-nowrap">
                        장기 마스터
                    </div>
                </div>
                <div className="h-full bg-[#1db954] transition-all duration-300" style={{ width: `${sessionPercent}%` }} />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <div className="relative group cursor-pointer" onClick={() => speakText(current.word)}>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-zinc-900 dark:text-white mb-2 hover:text-[#1db954] transition-colors text-center">{current.word}</h1>
                    <div className="flex justify-center gap-2">
                        {current.sessionStatus === 'wrong' && <span className="text-xs font-bold text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-1 border border-red-200 dark:border-red-700">재도전</span>}
                    </div>
                </div>

                <div className="w-full max-w-2xl grid grid-cols-1 gap-3">
                    {options.map((opt, idx) => {
                        let btnStyle = 'bg-white hover:bg-zinc-50 dark:bg-[#181818] dark:hover:bg-[#202020] text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-[#282828] shadow-sm dark:shadow-none';
                        if (isAnswered) {
                            if (opt.id === current.id) btnStyle = 'bg-[#1db954] text-white dark:text-black border-[#1ed760] ring-2 ring-[#1db954]/40 shadow-[0_0_15px_rgba(29,185,84,0.35)]';
                            else if (opt.id === selectedId) btnStyle = 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800';
                            else btnStyle = 'opacity-40 bg-zinc-100 dark:bg-black';
                        }

                        return (
                            <button
                                key={opt.id}
                                disabled={isAnswered}
                                onClick={() => handleAnswer(opt.id)}
                                className={`w-full p-4 border transition-all duration-200 flex items-center gap-4 text-left ${btnStyle}`}
                            >
                                <span className={`flex items-center justify-center w-6 h-6 text-xs font-bold rounded-sm ${isAnswered && opt.id === current.id ? 'bg-white text-[#1db954]' : 'bg-zinc-100 dark:bg-[#2a2a2a] text-zinc-500 dark:text-zinc-400'}`}>
                                    {idx + 1}
                                </span>
                                <span className="text-lg font-medium">{opt.definitions[0]}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {isAnswered && (
                <div className="w-full max-w-2xl mx-auto mt-4 animate-fade-in flex gap-4 items-center bg-zinc-50 dark:bg-zinc-900/80 p-4 border border-zinc-200 dark:border-zinc-700">
                    <div className="flex-1">
                        <div className="text-xs text-zinc-500 font-bold uppercase mb-1">어원</div>
                        <div className="text-sm text-zinc-700 dark:text-zinc-300">{current.etymo}</div>
                    </div>
                    <button onClick={handleNext} className="bg-zinc-900 dark:bg-white text-white dark:text-black p-3 hover:scale-110 transition-transform shadow-lg">
                        <SkipForward size={24} className="fill-white dark:fill-black" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChoiceQuizUI;
