import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronRight, Mic, MicOff } from 'lucide-react';
import { Model, createModel } from 'vosk-browser';

import type { QuizUIProps } from '../app/types';
import { getLevenshteinDistance } from '../app/utils';
import { loadMicSettings } from '../app/storage';

const workletProcessorCode = `
class MyRecorderProcessor extends AudioWorkletProcessor {
    process(inputs) {
        const input = inputs[0];
        if (input && input.length > 0) {
            const channelData = input[0];
            const copy = channelData.slice();
            this.port.postMessage(copy, [copy.buffer]);
        }
        return true;
    }
}

registerProcessor('my-recorder-processor', MyRecorderProcessor);
`;

const WriteQuizUI = ({
    current,
    remainingCount,
    masterPercent,
    sessionPercent,
    onResult,
    onExit,
    micEnabled = false,
    setMicEnabled = () => {},
    allWords = [] // Add allWords prop
}: QuizUIProps) => {
    const [inputVal, setInputVal] = useState('');
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong' | 'similar'>('idle');
    const [selectedDefIdx, setSelectedDefIdx] = useState(0);
    const [selectedExIdx, setSelectedExIdx] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isListening, setIsListening] = useState(false);
    const [micTranscript, setMicTranscript] = useState('');
    const [soundWave, setSoundWave] = useState<number[]>([]);

    // 모든 외부 참조는 ref로 관리 (의존성 순환 방지)
    const recognitionRef = useRef<{ strict: any; loose: any } | null>(null);
    const modelRef = useRef<Model | null>(null);
    const workletNodeRef = useRef<AudioWorkletNode | null>(null);
    const silenceGainRef = useRef<GainNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const stopTimeoutRef = useRef<number | null>(null);
    const isStoppingRef = useRef(false);
    const feedbackRef = useRef(feedback);
    const currentWordRef = useRef(current?.word ?? '');

    // ref를 최신값으로 동기화
    feedbackRef.current = feedback;
    currentWordRef.current = current?.word ?? '';

    // ── 음파 애니메이션 ──
    const startWaveAnimation = useCallback(() => {
        const loop = () => {
            if (!analyserRef.current) return;
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            const samples = Array.from(dataArray).slice(0, 32).map(v => v / 255);
            setSoundWave(samples);
            animFrameRef.current = requestAnimationFrame(loop);
        };
        loop();
    }, []);

    const stopWaveAnimation = useCallback(() => {
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
        }
        setSoundWave([]);
    }, []);

    // ── 마이크 완전 정지 ──
    const stopMic = useCallback(() => {
        isStoppingRef.current = true;
        if (stopTimeoutRef.current) {
            clearTimeout(stopTimeoutRef.current);
            stopTimeoutRef.current = null;
        }
        // Vosk Recognizer 정리
        if (recognitionRef.current) {
            try {
                recognitionRef.current.strict.remove?.();
                recognitionRef.current.loose.remove?.();
            } catch {}
            recognitionRef.current = null;
        }
        // 프로세서 정리
        if (workletNodeRef.current) {
            try {
                workletNodeRef.current.port.onmessage = null;
                workletNodeRef.current.disconnect();
            } catch {}
            workletNodeRef.current = null;
        }
        if (silenceGainRef.current) {
            try { silenceGainRef.current.disconnect(); } catch {}
            silenceGainRef.current = null;
        }
        // 오디오 스트림 정리
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (audioCtxRef.current) {
            try { audioCtxRef.current.close(); } catch {}
            audioCtxRef.current = null;
            analyserRef.current = null;
        }
        stopWaveAnimation();
        setIsListening(false);
    }, [stopWaveAnimation]);

    // ── 마이크 시작 (1회성) ──
    const startMic = useCallback(async () => {
        if (!modelRef.current || !modelRef.current.ready) return;

        // 이미 듣는 중이면 무시
        stopMic();
        isStoppingRef.current = false;

        const settings = loadMicSettings();

        try {
            const constraints: MediaStreamConstraints = {
                audio: settings.deviceId
                    ? { deviceId: { exact: settings.deviceId } }
                    : true
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            // 오디오 컨텍스트 설정
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioCtxRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(stream);
            
            // WaveformMonitor용 Analyser
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyserRef.current = analyser;

            // KaldiRecognizer 2개 생성 (이중 검증 전략)
            const targetWord = currentWordRef.current.toLowerCase();

            // 1. Strict Recognizer: 정답 아니면 [unk]
            const grammarStrict = JSON.stringify([targetWord, "[unk]"]);
            const recStrict = new modelRef.current.KaldiRecognizer(audioCtx.sampleRate, grammarStrict);

            // 2. Loose Recognizer: 정답 + 챕터 전체 단어 + [unk]
            // allWords prop 활용
            const distractorWords = (allWords || []).map(w => w.toLowerCase());
            const uniqueWords = Array.from(new Set([...distractorWords, targetWord, "[unk]"]));
            const grammarLoose = JSON.stringify(uniqueWords);
            const recLoose = new modelRef.current.KaldiRecognizer(audioCtx.sampleRate, grammarLoose);

            recognitionRef.current = { strict: recStrict, loose: recLoose };

            let strictRes: string | null = null;
            let looseRes: string | null = null;
            let hasHandledResult = false;

            const checkDualResult = () => {
                if (hasHandledResult) return;
                
                // 둘 다 결과가 나왔거나, Strict가 정답을 확신한 경우
                // 사실 Strict가 정답이면 Loose 기다릴 필요 없이 바로 통과 가능
                if (strictRes === targetWord) {
                     hasHandledResult = true;
                     processFinalResult(targetWord);
                     return;
                }

                // 둘 다 결과가 나왔을 때 판별
                if (strictRes !== null && looseRes !== null) {
                    hasHandledResult = true;

                    // 로직: 1차(Strict) 실패 시 2차(Loose) 확인
                    let finalAnswer = looseRes; 

                    // 만약 loose도 [unk]거나 비어있으면.. 그냥 strict 결과(unk) 따라가거나 빈값
                    if (!finalAnswer || finalAnswer === '[unk]') {
                        finalAnswer = strictRes;
                    }

                    console.log(`Dual Result -> Strict: ${strictRes}, Loose: ${looseRes} => Final: ${finalAnswer}`);
                    processFinalResult(finalAnswer || '');
                }
            };

            const processFinalResult = (transcript: string) => {
                 setMicTranscript(transcript);
                 
                 const word = currentWordRef.current;
                 const firstChar = word[0] || '';
                 
                 let inputWord = transcript;
                 // 첫 글자 매칭 보정
                 if (transcript.length > 0 && transcript[0].toLowerCase() === firstChar.toLowerCase()) {
                     inputWord = firstChar + transcript.slice(1);
                 }

                 const answer = inputWord.trim().toLowerCase();
                 const target = word.toLowerCase();

                 if (answer === target) {
                     setInputVal(inputWord);
                     setFeedback('correct');
                 } else {
                     // Loose 모드에서 다른 단어로 인식된 경우
                     if (answer && answer !== '[unk]') {
                         // 혹시라도 발음이 너무 유사해서 다른 단어로 인식되었는데, 
                         // 철자상으로는 매우 가까운 경우 (예: 스펠링 차이가 미미한 경우) 체크
                         const dist = getLevenshteinDistance(answer, target);
                         if (dist <= (target.length > 4 ? 2 : 1)) {
                             setInputVal(inputWord);
                             setFeedback('similar');
                         } else {
                             setInputVal(inputWord);
                             setFeedback('wrong');
                         }
                     } else {
                         // 인식 실패 / 잡음
                         // 너무 조용하거나, 아예 모르는 단어로 인식됨 -> 피드백 없음(다시 말하게 유도)
                         if (micTranscript && micTranscript !== '[unk]') {
                             setFeedback('idle'); 
                         }
                     }
                 }
                 
                 stopWaveAnimation();
                 setIsListening(false);
            };

            // 이벤트 핸들러 등록
            recStrict.on('result', (msg: any) => {
                if (msg?.result?.text) {
                    strictRes = msg.result.text.toLowerCase().trim();
                } else {
                    strictRes = ''; // text가 없으면 빈 문자열
                }
                checkDualResult();
            });

            recLoose.on('result', (msg: any) => {
                if (msg?.result?.text) {
                    looseRes = msg.result.text.toLowerCase().trim();
                } else {
                    looseRes = '';
                }
                checkDualResult();
            });

            // Partial은 Loose 모델 기준으로 보여줌 (다양한 후보가 뜨는게 피드백에 도움됨)
            recLoose.on('partialresult', (message: any) => {
                if (message.partial) {
                    const transcript = message.partial.toLowerCase().trim();
                    setMicTranscript(transcript);
                }
            });
            
            // AudioWorklet 로드 및 연결 (ScriptProcessor 대체)
            const blob = new Blob([workletProcessorCode], { type: 'application/javascript' });
            const processorUrl = URL.createObjectURL(blob);
            await audioCtx.audioWorklet.addModule(processorUrl);
            URL.revokeObjectURL(processorUrl);

            const workletNode = new AudioWorkletNode(audioCtx, 'my-recorder-processor');
            workletNodeRef.current = workletNode;

            workletNode.port.onmessage = (event) => {
                if (isStoppingRef.current || !recognitionRef.current) return;
                const inputData = event.data as Float32Array;
                try {
                    // 두 인식기에 오디오 데이터 공급
                    recognitionRef.current.strict.acceptWaveformFloat(inputData, audioCtx.sampleRate);
                    recognitionRef.current.loose.acceptWaveformFloat(inputData, audioCtx.sampleRate);
                } catch (e) {
                    console.error('Error sending audio:', e);
                }
            };

            source.connect(workletNode);
            const silenceGain = audioCtx.createGain();
            silenceGain.gain.value = 0;
            silenceGainRef.current = silenceGain;
            workletNode.connect(silenceGain);
            silenceGain.connect(audioCtx.destination);

            // 30초 후 자동 종료 (또는 수동으로 stopMic 호출)
            stopTimeoutRef.current = window.setTimeout(() => {
                stopMic();
            }, 30000);

            // 듣기 시작
            setIsListening(true);
            startWaveAnimation();

        } catch (e) {
            console.log('Mic stream error:', e);
            setIsListening(false);
            stopWaveAnimation();
        }
    }, [stopMic, startWaveAnimation]);

    // ── Vosk Model 초기화 (1회만 생성) ──
    useEffect(() => {
        const initModel = async () => {
            try {
                // 로컬 public 폴더에서 모델 로드 (tar.gz 형식)
                const modelPath = '/models/vosk-model-small-en-us-0.15.tar.gz';
                
                const model = await createModel(modelPath);
                modelRef.current = model;
                console.log('Vosk model loaded successfully');

            } catch (error) {
                console.error('Vosk model loading error:', error);
            }
        };

        initModel();

        return () => {
            if (modelRef.current) {
                modelRef.current.terminate();
                modelRef.current = null;
            }
            if (stopTimeoutRef.current) {
                clearTimeout(stopTimeoutRef.current);
                stopTimeoutRef.current = null;
            }
            if (workletNodeRef.current) {
                workletNodeRef.current.disconnect();
                workletNodeRef.current = null;
            }
            if (silenceGainRef.current) {
                silenceGainRef.current.disconnect();
                silenceGainRef.current = null;
            }
        };
    }, []);

    // ── 새 예문이 나올 때 ──
    useEffect(() => {
        if (!current) return;

        setInputVal(current.word.charAt(0));
        setFeedback('idle');
        setMicTranscript('');
        setSelectedDefIdx(Math.floor(Math.random() * current.definitions.length));
        setSelectedExIdx(Math.floor(Math.random() * current.examples.length));

        // 마이크 정지 (이전 세션 정리)
        stopMic();

        const timer = setTimeout(() => {
            inputRef.current?.focus();
            // autoStart 설정 확인
            const settings = loadMicSettings();
            if (settings.autoStart) {
                setMicEnabled(true);
                startMic();
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [current]); // current만 의존

    if (!current) return null;

    const handleSubmit = () => {
        if (feedback === 'correct' || feedback === 'wrong') return;
        const answer = inputVal.trim().toLowerCase();
        const target = current.word.toLowerCase();

        if (answer === target) {
            setFeedback('correct');
        } else {
            const dist = getLevenshteinDistance(answer, target);
            if (dist <= (target.length > 4 ? 2 : 1) && feedback === 'idle') {
                setFeedback('similar');
                return;
            }
            setFeedback('wrong');
        }
    };

    const handleNext = () => {
        onResult(feedback === 'correct');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === '.' || e.key === '0') {
            e.preventDefault();
            if (isListening) {
                stopMic();
            } else {
                setMicEnabled(true);
                startMic();
            }
            return;
        }

        if (e.key === 'Enter') {
            if (feedback === 'idle' || feedback === 'similar') handleSubmit();
            else if (feedback === 'correct' || feedback === 'wrong') handleNext();
        }
        if (e.key === 'Backspace' && inputVal.length <= 1) {
            e.preventDefault();
        }
    };

    const getMaskedValue = () => {
        if (feedback === 'correct') return current.word;
        if (feedback === 'wrong') return inputVal;
        const len = current.word.length;
        const currentLen = inputVal.length;
        return inputVal + '_'.repeat(Math.max(0, len - currentLen));
    };

    const currentExample = current.examples[selectedExIdx];

    const renderSentence = () => {
        const sentence = currentExample.text.replace(/\[.*?\]/g, (match: string) => {
            return match.toLowerCase().includes(current.word.toLowerCase()) ? '___' : match;
        });

        const chunks = sentence.split('___');

        return (
            <span>
                {chunks[0]}
                <span className={`inline-block border-b-4 px-2 mx-1 font-mono transition-colors
                    ${feedback === 'correct' ? 'border-green-500 text-green-600 dark:text-green-400' :
                        feedback === 'wrong' ? 'border-red-500 text-red-600 dark:text-red-400' : 'border-zinc-300 dark:border-zinc-500 text-zinc-800 dark:text-zinc-200'}
                `}>
                    {getMaskedValue()}
                </span>
                {chunks[1]}
            </span>
        );
    };

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-[#121212] p-6 md:p-10 overflow-hidden" onClick={() => inputRef.current?.focus()}>
            <div className="flex justify-between items-center mb-6 text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
                <span>예문퀴즈</span>
                <div className="flex items-center gap-4">
                    <span>{remainingCount} 남음</span>
                    <button onClick={onExit} className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white text-xs">종료</button>
                </div>
            </div>

            <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-none overflow-hidden mb-8 flex">
                <div className="h-full bg-[#1ed760] transition-all duration-700" style={{ width: `${masterPercent}%` }} />
                <div className="h-full bg-[#1db954] transition-all duration-300" style={{ width: `${sessionPercent}%` }} />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center -mt-10">
                <div className="text-2xl md:text-4xl text-zinc-900 dark:text-white font-bold text-center mb-8 leading-relaxed max-w-4xl">
                    {renderSentence()}
                </div>

                {feedback === 'wrong' && (
                    <div className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 px-4 py-2 border border-red-200 dark:border-red-900 mb-4 animate-bounce">
                        정답: {current.word}
                    </div>
                )}
                {feedback === 'similar' && (
                    <div className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-200 px-4 py-2 border border-yellow-200 dark:border-yellow-900 mb-4 animate-pulse">
                        거의 맞았어요. 오타를 확인하세요.
                    </div>
                )}

                <div className="bg-zinc-50 dark:bg-[#181818] p-6 text-center mb-8 border border-zinc-200 dark:border-[#282828]">
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">뜻: {current.definitions[selectedDefIdx]}</div>
                    <div className="text-xl md:text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                        {currentExample.korean.split(/\{|\}/).map((part: string, i: number) =>
                            i % 2 === 1 ? <span key={i} className="text-[#1db954]">{part}</span> : part
                        )}
                    </div>
                </div>

                <input
                    ref={inputRef}
                    value={inputVal}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val.length > 0 && val[0].toLowerCase() === current.word[0].toLowerCase()) {
                            setInputVal(val);
                        } else if (val.length === 0) {
                            setInputVal(current.word[0]);
                        }
                    }}
                    onKeyDown={handleKeyDown}
                    className="opacity-0 absolute"
                    autoFocus
                />
            </div>

            <div className="fixed bottom-10 right-10 flex flex-col items-center gap-4">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isListening) {
                            // 현재 듣는 중 → 중지
                            stopMic();
                            setMicEnabled(false);
                        } else {
                            // 듣는 중이 아님 → 시작
                            setMicEnabled(true);
                            startMic();
                        }
                    }}
                    className={`w-20 h-20 transition-all shadow-xl transform relative overflow-hidden ${
                        !micEnabled
                            ? 'bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600'
                            : isListening
                                ? 'bg-red-500 dark:bg-red-600 ring-4 ring-red-300 dark:ring-red-400 scale-110'
                                : 'bg-cyan-500 dark:bg-cyan-600 hover:bg-cyan-600 dark:hover:bg-cyan-700 hover:scale-105'
                    }`}
                    title={!micEnabled ? '마이크 켜기' : isListening ? '듣는 중... (클릭하면 중지)' : '마이크 준비 (클릭하면 시작)'}
                >
                    {isListening && soundWave.length > 0 && (
                        <svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 80 80"
                            preserveAspectRatio="none"
                        >
                            <defs>
                                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                                    <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                                </linearGradient>
                            </defs>

                            {soundWave.map((amplitude, idx) => {
                                const barWidth = 80 / soundWave.length;
                                const x = idx * barWidth;
                                const height = 10 + amplitude * 60;
                                const y = (80 - height) / 2;
                                return (
                                    <rect
                                        key={idx}
                                        x={x}
                                        y={y}
                                        width={barWidth * 0.8}
                                        height={height}
                                        fill="url(#waveGradient)"
                                        opacity={0.5 + amplitude * 0.5}
                                    />
                                );
                            })}

                            {[0, 1, 2].map((idx) => {
                                const avgAmplitude = soundWave.reduce((a, b) => a + b, 0) / soundWave.length;
                                const radius = 25 + (idx * 8) + (avgAmplitude * 10);
                                return (
                                    <circle
                                        key={`circle-${idx}`}
                                        cx="40"
                                        cy="40"
                                        r={radius}
                                        fill="none"
                                        stroke="rgba(255,255,255,0.3)"
                                        strokeWidth={2 - (idx * 0.5)}
                                        opacity={0.3 - (idx * 0.1)}
                                    />
                                );
                            })}
                        </svg>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        {!micEnabled ? (
                            <MicOff size={32} className="text-zinc-500 dark:text-zinc-400" />
                        ) : isListening ? (
                            <div className="bg-white/20 p-2">
                                <Mic size={24} className="text-white" />
                            </div>
                        ) : (
                            <Mic size={32} className="text-white" />
                        )}
                    </div>
                </button>

                {micTranscript && (
                    <div className="text-center text-xs text-cyan-700 dark:text-cyan-300 bg-white/70 dark:bg-black/50 px-3 py-1 rounded">
                        인식: <span className="font-mono">{micTranscript}</span>
                    </div>
                )}
            </div>

            {feedback !== 'idle' && (
                <div className="absolute bottom-10 left-10">
                    <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="bg-zinc-800 dark:bg-white text-white dark:text-black px-8 py-4 font-bold shadow-2xl hover:scale-105 flex items-center gap-2">
                        다음 <ChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
};

export default WriteQuizUI;
