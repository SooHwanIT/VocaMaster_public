import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Settings } from 'lucide-react';
// import { getAllAudioUrls } from 'google-tts-api';
import { DATA_SETS } from '../data';
import type { Word } from '../data/types';

interface PlayerSettings {
    rate: number;          // 0.8, 1.0, 1.2, 1.5
    includeMeaning: boolean;
    includeExample: boolean;
    repeatCount: number;   // 1, 2, 3
    delay: number;         // 0, 1, 2, 3 (seconds)
    randomOrder: boolean;
}

const DEFAULT_SETTINGS: PlayerSettings = {
    rate: 1.0,
    includeMeaning: true,
    includeExample: true,
    repeatCount: 1,
    delay: 1,
    randomOrder: false
};

const PlayerView = ({ dataSetId, onExit }: { dataSetId: string; onExit: () => void }) => {
    // 1. Settings (Load from Local Storage safely)
    const [settings, setSettings] = useState<PlayerSettings>(() => {
        try {
            const saved = localStorage.getItem('playerParams');
            return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
        } catch (e) {
            return DEFAULT_SETTINGS;
        }
    });

    // 2. State
    const [words, setWords] = useState<Word[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // 3. Refs
    const isComponentMounted = useRef(true);
    const isPlayingRef = useRef(false);
    const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
    const dataSet = DATA_SETS.find(d => d.id === dataSetId);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    // 4. Initialize Words
    useEffect(() => {
        if (!dataSet) return;
        let list = [...dataSet.words];
        if (settings.randomOrder) {
            list = list.sort(() => Math.random() - 0.5);
        }
        setWords(list as any);
        setCurrentIndex(0);
    }, [dataSetId, settings.randomOrder]);

    // 5. Save Settings
    useEffect(() => {
        localStorage.setItem('playerParams', JSON.stringify(settings));
    }, [settings]);

    // 6. Cleanup on Unmount
    useEffect(() => {
        isComponentMounted.current = true;
        window.speechSynthesis.cancel();
        currentUtterance.current = null;
        
        return () => {
            isComponentMounted.current = false;
            window.speechSynthesis.cancel();
            currentUtterance.current = null;
        };
    }, []);


    // --- Core TTS Function ---
    const speakOne = useCallback((text: string, lang: string, rate: number): Promise<void> => {
        return new Promise((resolve) => {
            if (!text || !isComponentMounted.current) {
                resolve();
                return;
            }

            if (!isPlayingRef.current) {
                resolve();
                return;
            }

            window.speechSynthesis.cancel();
            currentUtterance.current = null;

            try {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = lang;
                utterance.rate = rate;
                utterance.pitch = 1;
                currentUtterance.current = utterance;

                const finish = () => {
                    if (currentUtterance.current === utterance) {
                        currentUtterance.current = null;
                    }
                    resolve();
                };

                utterance.onend = finish;
                utterance.onerror = finish;

                window.speechSynthesis.speak(utterance);
            } catch (e) {
                console.error('TTS error:', e);
                resolve();
            }
        });
    }, []);


    // --- Sequence Player Logic ---
    const playSequence = useCallback(async (index: number) => {
        // 유효성 체크
        if (!isComponentMounted.current || index >= words.length) {
            if (index >= words.length && isPlaying) setIsPlaying(false);
            return;
        }

        const wordPayload = words[index];
        // 캡처된 시점의 설정 사용 (loop 중간에 설정 바뀌는 것 방지)
        const currentSettings = settings;

        // --- Step 1: Word (English) ---
        // UI 업데이트: 현재 단어로 이동
        setCurrentIndex(index);
        
        for (let r = 0; r < currentSettings.repeatCount; r++) {
            if (!isComponentMounted.current || !isPlayingRef.current) return;

             // 1. Word
            await speakOne(wordPayload.word, 'en-US', currentSettings.rate);
            if (!isComponentMounted.current || !isPlayingRef.current) return;
            await new Promise(res => setTimeout(res, currentSettings.delay * 1000));

            // 2. Meaning (Korean)
            if (currentSettings.includeMeaning) {
                // 괄호 등으로 지저분한 텍스트 정리
                const cleanMeaning = wordPayload.definitions.join(', ').replace(/\(.*\)/g, '');
                
                await speakOne(cleanMeaning, 'ko-KR', currentSettings.rate);
                if (!isComponentMounted.current || !isPlayingRef.current) return;
                await new Promise(res => setTimeout(res, currentSettings.delay * 1000));
            }

            // 3. Example (English)
            if (currentSettings.includeExample && wordPayload.examples && wordPayload.examples.length > 0) {
                const exampleText = wordPayload.examples[0].text;
                await speakOne(exampleText, 'en-US', currentSettings.rate);
                if (!isComponentMounted.current || !isPlayingRef.current) return;
                await new Promise(res => setTimeout(res, currentSettings.delay * 1000));
            }
        }
        
        // --- Next Word Trigger ---
        // 재귀 호출 대신 useEffect를 트리거하기 위해 currentIndex를 업데이트
        // 단, 마지막 단어면 종료
        if (index < words.length - 1) {
             setCurrentIndex(prev => prev + 1);
        } else {
             setIsPlaying(false); // End of list
        }

    }, [words, settings, isPlaying, speakOne]);


    // --- Effect: Trigger Sequence when Index Changes ---
    useEffect(() => {
        let isCancelled = false;
        
        const run = async () => {
            if (isPlaying && currentIndex < words.length && !isCancelled) {
                // 비동기 시퀀스 실행
                await playSequence(currentIndex);
            }
        };

        run();

        return () => {
            isCancelled = true;
        };
    // 의존성 배열 주의: currentIndex가 바뀌면 다음 단어 재생 시작
    // isPlaying이 true가 될 때도 시작
    }, [currentIndex, isPlaying]); // playSequence 제외 (무한루프 방지)


    // --- Controls ---
    const stopAudio = () => {
        window.speechSynthesis.cancel();
        currentUtterance.current = null;
    };

    const togglePlay = () => {
        if (isPlaying) {
            setIsPlaying(false);
            stopAudio();
        } else {
            setIsPlaying(true);
        }
    };

    const handleNext = () => {
        setIsPlaying(false); // 잠깐 멈춤
        stopAudio();
        setTimeout(() => {
            setCurrentIndex(prev => Math.min(prev + 1, words.length - 1));
            // 자동 재생 원하면 여기서 setIsPlaying(true)
        }, 100);
    };

    const handlePrev = () => {
        setIsPlaying(false);
        stopAudio();
        setTimeout(() => {
            setCurrentIndex(prev => Math.max(prev - 1, 0));
        }, 100);
    };


    // --- Render ---
    const currentWord = words[currentIndex];
    if (!dataSet) return null;

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-zinc-950 relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                    <button onClick={onExit} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
                        <X size={24} className="text-slate-500 dark:text-zinc-400" />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">{dataSet.title}</h2>
                        <p className="text-xs text-slate-500 dark:text-zinc-500">Player Mode • {currentIndex + 1} / {words.length}</p>
                    </div>
                </div>
                <button onClick={() => setShowSettings(true)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                    <Settings size={24} />
                </button>
            </div>

            {/* Main Content (Karaoke Style) */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
                {currentWord ? (
                    <>
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 dark:text-white tracking-tight">
                                {currentWord.word}
                            </h1>
                            {settings.includeMeaning && (
                                <div className="text-2xl md:text-3xl text-slate-600 dark:text-zinc-400 font-medium">
                                    {currentWord.definitions.join(', ')}
                                </div>
                            )}
                        </div>

                        {settings.includeExample && currentWord.examples && currentWord.examples[0] && (
                            <div className="max-w-2xl p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
                                <p className="text-xl text-slate-700 dark:text-zinc-300 font-medium leading-relaxed">
                                    {currentWord.examples[0].text}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-zinc-500 mt-2">
                                    {currentWord.examples[0].korean}
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-slate-400">Loading words...</div>
                )}
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-zinc-900 p-6 border-t border-slate-200 dark:border-zinc-800 pb-8">
                {/* Progress Bar */}
                <div className="mb-6 flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400 dark:text-zinc-600 w-8 text-right">{currentIndex + 1}</span>
                    <input 
                        type="range" 
                        min="0" 
                        max={words.length - 1} 
                        value={currentIndex} 
                        onChange={(e) => {
                            setIsPlaying(false);
                            stopAudio();
                            setCurrentIndex(parseInt(e.target.value));
                        }}
                        className="flex-1 h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent"

                    />
                    <span className="text-xs font-mono text-slate-400 dark:text-zinc-600 w-8">{words.length}</span>
                </div>

                <div className="flex items-center justify-center gap-8">
                    <button onClick={handlePrev} className="p-4 rounded-full text-slate-400 hover:text-slate-600 dark:text-zinc-600 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">
                        <SkipBack size={32} />
                    </button>
                    
                    <button 
                        onClick={togglePlay} 
                        className={`p-6 rounded-full text-white shadow-lg transform active:scale-95 transition-all ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-accent hover:bg-accent/90'}`}
                    >
                        {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
                    </button>

                    <button onClick={handleNext} className="p-4 rounded-full text-slate-400 hover:text-slate-600 dark:text-zinc-600 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">
                        <SkipForward size={32} />
                    </button>
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center animate-in fade-in" onClick={() => setShowSettings(false)}>
                    <div className="bg-white dark:bg-zinc-900 w-full md:max-w-md p-6 rounded-t-3xl md:rounded-3xl shadow-2xl" onClick={e => e.stopPropagation()}>
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Settings size={20} /> Player Settings
                            </h3>
                            <button onClick={() => setShowSettings(false)}>
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Speed */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Speed</label>
                                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl">
                                    {[0.8, 1.0, 1.2, 1.5].map(speed => (
                                        <button 
                                            key={speed}
                                            onClick={() => setSettings(s => ({ ...s, rate: speed }))}
                                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${settings.rate === speed ? 'bg-white dark:bg-zinc-700 shadow text-accent' : 'text-slate-400 dark:text-zinc-500'}`}
                                        >
                                            {speed}x
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content Toggles */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Content</label>
                                <div className="space-y-2">
                                    <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-zinc-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800/50">
                                        <span className="font-medium text-slate-700 dark:text-zinc-300">뜻 듣기 (Korean)</span>
                                        <input type="checkbox" checked={settings.includeMeaning} onChange={e => setSettings(s => ({...s, includeMeaning: e.target.checked}))} className="accent-accent w-5 h-5"/>
                                    </label>
                                    <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-zinc-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800/50">
                                        <span className="font-medium text-slate-700 dark:text-zinc-300">예문 듣기 (Example)</span>
                                        <input type="checkbox" checked={settings.includeExample} onChange={e => setSettings(s => ({...s, includeExample: e.target.checked}))} className="accent-accent w-5 h-5"/>
                                    </label>
                                </div>
                            </div>

                             {/* Loop Count */}
                             <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Repeats / Word</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(count => (
                                        <button 
                                            key={count}
                                            onClick={() => setSettings(s => ({ ...s, repeatCount: count }))}
                                            className={`flex-1 py-2 border rounded-xl text-sm font-bold transition-all ${settings.repeatCount === count ? 'border-accent text-accent bg-accent/5' : 'border-slate-200 dark:border-zinc-800 text-slate-400'}`}
                                        >
                                            {count}회
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Delay */}
                             <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Interval Delay</label>
                                <div className="flex gap-2">
                                    {[0, 1, 2, 3].map(sec => (
                                        <button 
                                            key={sec}
                                            onClick={() => setSettings(s => ({ ...s, delay: sec }))}
                                            className={`flex-1 py-2 border rounded-xl text-sm font-bold transition-all ${settings.delay === sec ? 'border-accent text-accent bg-accent/5' : 'border-slate-200 dark:border-zinc-800 text-slate-400'}`}
                                        >
                                            {sec}s
                                        </button>
                                    ))}
                                </div>
                            </div>

                             {/* Order */}
                             <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Order</label>
                                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl">
                                    <button 
                                        onClick={() => setSettings(s => ({ ...s, randomOrder: false }))}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!settings.randomOrder ? 'bg-white dark:bg-zinc-700 shadow text-accent' : 'text-slate-400 dark:text-zinc-500'}`}
                                    >
                                        Sequential
                                    </button>
                                    <button 
                                        onClick={() => setSettings(s => ({ ...s, randomOrder: true }))}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${settings.randomOrder ? 'bg-white dark:bg-zinc-700 shadow text-accent' : 'text-slate-400 dark:text-zinc-500'}`}
                                    >
                                        Random Shuffle
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerView;
