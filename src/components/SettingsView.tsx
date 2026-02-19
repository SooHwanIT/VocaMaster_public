import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Moon, Sun, Monitor, Bell, Volume2, Shield, CircleHelp, Info, Settings2, Mic, MicOff, Activity, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Model, createModel } from 'vosk-browser';
import type { AppTheme, MicSettings } from '../app/types';
import { loadMicSettings, saveMicSettings } from '../app/storage';

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

type AudioDevice = { deviceId: string; label: string };
type TestState = 'idle' | 'listening' | 'success' | 'fail';

const SettingsView = ({ theme, onThemeChange }: { theme: AppTheme; onThemeChange: (theme: AppTheme) => void }) => {
    // 임시 설정 상태 (나중에 실제 기능과 연동 필요)
    const [notifications, setNotifications] = useState(true);
    const [soundEffects, setSoundEffects] = useState(true);
    const [dailyGoal, setDailyGoal] = useState(50);
    const [ttsSpeed, setTtsSpeed] = useState(1.0);

    // 마이크 설정 상태
    const [micSettings, setMicSettings] = useState<MicSettings>(loadMicSettings());
    const [devices, setDevices] = useState<AudioDevice[]>([]);
    const [loadingDevices, setLoadingDevices] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

    // 테스트 상태
    const [testState, setTestState] = useState<TestState>('idle');
    const [testWord] = useState('Apple');
    const [testTranscript, setTestTranscript] = useState('');
    const [soundLevel, setSoundLevel] = useState(0);
    
    // Vosk references
    const modelRef = useRef<Model | null>(null);
    const recognitionRef = useRef<any>(null); // KaldiRecognizer
    const workletNodeRef = useRef<AudioWorkletNode | null>(null);

    const streamRef = useRef<MediaStream | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const animRef = useRef<number | null>(null);

    const loadDevices = useCallback(async () => {
        setLoadingDevices(true);
        try {
            // 권한 확인/요청
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(t => t.stop());
                setPermissionGranted(true);
            } catch (err) {
                console.error('Permission request failed:', err);
                setPermissionGranted(false);
                setLoadingDevices(false);
                return;
            }

            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const audioInputs = allDevices
                .filter(d => d.kind === 'audioinput')
                .map(d => ({
                    deviceId: d.deviceId,
                    label: d.label || `마이크 ${d.deviceId.slice(0, 8)}`
                }));
            setDevices(audioInputs);
        } catch (e) {
            console.error('Mic permission denied:', e);
            setPermissionGranted(false);
        }
        setLoadingDevices(false);
    }, []);

    useEffect(() => {
        // Vosk Model 로드
        const initModel = async () => {
            try {
                // Check if model file exists by fetching HEAD first? Or just try createModel
                const modelPath = '/models/vosk-model-small-en-us-0.15.tar.gz';
                console.log('Loading Vosk model from:', modelPath);
                
                // createModel might fail if file not found
                const model = await createModel(modelPath);
                modelRef.current = model;
                console.log('Vosk model loaded successfully in SettingsView');
            } catch (error) {
                console.error('Vosk model loading failed:', error);
                // Don't crash, just log. 
                // Maybe set a flag 'modelError' to show UI warning
            }
        };
        initModel();

        return () => {
            if (modelRef.current) {
                modelRef.current.terminate();
                modelRef.current = null;
            }
            stopTest();
        };
    }, []);

    const stopTest = useCallback(() => {
        if (recognitionRef.current) {
            try { 
                recognitionRef.current.remove?.(); 
            } catch {}
            recognitionRef.current = null;
        }
        if (workletNodeRef.current) {
            try {
                workletNodeRef.current.port.onmessage = null;
                workletNodeRef.current.disconnect();
            } catch {}
            workletNodeRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (audioCtxRef.current) {
            try { audioCtxRef.current.close(); } catch {}
            audioCtxRef.current = null;
        }
        if (animRef.current) {
            cancelAnimationFrame(animRef.current);
            animRef.current = null;
        }
        setSoundLevel(0);
    }, []);

    const VUMeter = ({ level }: { level: number }) => {
        const bars = 30; // 30 segments
        const activeBars = Math.floor(level * bars);
        return (
            <div className="flex items-end gap-[2px] h-12 w-full max-w-md mx-auto">
                {Array.from({ length: bars }).map((_, i) => {
                    const isActive = i < activeBars;
                    // Color gradient logic: 0-70% Green, 70-90% Yellow, 90-100% Red
                    let colorClass = 'bg-emerald-500';
                    if (i > bars * 0.7) colorClass = 'bg-yellow-400';
                    if (i > bars * 0.9) colorClass = 'bg-red-500';
                    
                    // In dark mode, dim the inactive bars more
                    return (
                        <div
                            key={i}
                            className={`flex-1 transition-all duration-75 ${
                                isActive 
                                    ? `${colorClass} opacity-100 scale-y-100 shadow-[0_0_8px_rgba(16,185,129,0.5)]` 
                                    : 'bg-slate-200 dark:bg-slate-700 opacity-30 scale-y-50'
                            }`}
                            style={{ 
                                height: isActive ? `${20 + Math.random() * 80}%` : '20%',
                                minHeight: '4px'
                            }}
                        />
                    );
                })}
            </div>
        );
    };

    const startTest = useCallback(async () => {
        stopTest();
        setTestState('listening');
        setTestTranscript('');

        if (!modelRef.current || !modelRef.current.ready) {
            setTestState('fail');
            setTestTranscript('음성 인식 모델 로딩 중... 잠시 후 시도해주세요.');
            return;
        }

        try {
            const constraints: MediaStreamConstraints = {
                audio: micSettings.deviceId
                    ? { deviceId: { exact: micSettings.deviceId } }
                    : true
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioCtxRef.current = audioCtx;
            
            // 워클릿 로드
            const blob = new Blob([workletProcessorCode], { type: 'application/javascript' });
            const processorUrl = URL.createObjectURL(blob);
            await audioCtx.audioWorklet.addModule(processorUrl);
            URL.revokeObjectURL(processorUrl);

            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);

            // Worklet 연결
            const workletNode = new AudioWorkletNode(audioCtx, 'my-recorder-processor');
            workletNodeRef.current = workletNode;
            source.connect(workletNode);
            workletNode.connect(audioCtx.destination); // 필요: 가비지 컬렉션 방지 및 처리 활성화

            // VU 미터
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const updateLevel = () => {
                analyser.getByteFrequencyData(dataArray);
                const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
                setSoundLevel(avg);
                animRef.current = requestAnimationFrame(updateLevel);
            };
            updateLevel();

            // Vosk Recognizer 생성
            const recognizer = new modelRef.current.KaldiRecognizer(audioCtx.sampleRate);
            recognitionRef.current = recognizer;

            recognizer.on('result', (message: any) => {
                const text = message.result ? message.result.text : '';
                if (text) {
                    const transcript = text.toLowerCase().trim();
                    setTestTranscript(transcript);
                    
                    if (transcript.includes(testWord.toLowerCase())) {
                        setTestState('success');
                        stopTest();
                    }
                }
            });

            recognizer.on('partialresult', (message: any) => {
                if (message.partial) {
                    const partial = message.partial.toLowerCase();
                    setTestTranscript(partial);
                    if (partial.includes(testWord.toLowerCase())) {
                         // 부분 결과에서도 감지되면 성공 처리 (빠른 피드백)
                         setTestState('success');
                         stopTest();
                    }
                }
            });

            // 오디오 데이터 전달
            workletNode.port.onmessage = (event) => {
                if (recognitionRef.current) {
                    try {
                        recognitionRef.current.acceptWaveformFloat(event.data, audioCtx.sampleRate);
                    } catch (e) {
                         // ignore
                    }
                }
            };

        } catch (e) {
            console.error('Audio stream error:', e);
            setTestState('fail');
            setTestTranscript('마이크에 접근할 수 없습니다.');
        }
    }, [micSettings.deviceId, testWord, stopTest]);

    useEffect(() => {
        loadDevices();
    }, [loadDevices]);

    useEffect(() => {
        if (!loadingDevices && devices.length > 0) {
            const currentValid = devices.find(d => d.deviceId === micSettings.deviceId);
            if (!currentValid && !micSettings.deviceId) {
                 const updated = { ...micSettings, deviceId: devices[0].deviceId };
                 setMicSettings(updated);
                 saveMicSettings(updated);
            }
        }
    }, [loadingDevices, devices, micSettings.deviceId]);

    const handleSensitivityChange = (value: number) => {
        const updated = { ...micSettings, sensitivity: value };
        setMicSettings(updated);
        saveMicSettings(updated);
    };

    const handleAutoStartToggle = () => {
        const updated = { ...micSettings, autoStart: !micSettings.autoStart };
        setMicSettings(updated);
        saveMicSettings(updated);
    };

    const handleDeviceChange = (deviceId: string) => {
        const updated = { ...micSettings, deviceId };
        setMicSettings(updated);
        saveMicSettings(updated);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-zinc-950 overflow-y-auto w-full">
             <div className="p-4 md:p-8 pb-4 shrink-0 w-full max-w-5xl mx-auto">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2 flex items-center gap-3">
                    <Settings2 className="text-gray-500" size={32} />
                    설정
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    앱 환경설정 및 개인화 옵션
                </p>
            </div>

            <div className="flex-1 p-4 md:p-8 pt-0 space-y-8 pb-20 w-full max-w-5xl mx-auto">
                {/* 1. Appearance */}
                <section>
                    <h2 className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-4 px-2">
                        화면 및 테마

                    {/* === Mic Test Visualization === */}
                    <div className="mt-4 bg-slate-900 dark:bg-black border border-slate-800 dark:border-zinc-800 p-6 md:p-8 relative overflow-hidden rounded-3xl flex flex-col justify-center min-h-[300px] md:min-h-[400px]">
                        {/* Grid Background Effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                        <div className="flex items-center justify-between relative z-10 mb-6 md:mb-8 w-full">
                                <div className="flex items-center gap-3">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500/20 flex items-center justify-center text-emerald-400 rounded-lg">
                                    <Activity size={16} className="md:w-5 md:h-5" />
                                </div>
                                <div>
                                    <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-white">Voice Calibration</div>
                                    <div className="text-[10px] md:text-xs text-slate-400 font-mono hidden sm:block">Test your microphone input</div>
                                </div>
                            </div>
                            <div className={`px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[10px] font-mono font-bold border rounded ${
                                testState === 'listening' ? 'text-red-400 border-red-900 bg-red-900/20 animate-pulse' : 'text-slate-500 border-slate-700'
                            }`}>
                                {testState === 'listening' ? '● REC' : '○ IDLE'}
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-8 md:gap-12 relative z-10 w-full max-w-2xl mx-auto flex-1 justify-center">
                            {/* Target Phrase */}
                            <div className="text-center">
                                <div className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 md:mb-4">Say this word</div>
                                <div className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl transition-all">
                                    {testWord}
                                </div>
                            </div>

                            {/* VU Meter Visualization */}
                                <div className={`w-full transition-opacity duration-300 ${testState === 'listening' ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                                <VUMeter level={soundLevel} />
                            </div>
                            
                            {/* Result Display */}
                            {testTranscript && (
                                <div className={`w-full px-4 py-3 md:p-4 border-l-4 transition-all bg-black/50 backdrop-blur-sm ${
                                    testState === 'success' ? 'border-emerald-500' :
                                    testState === 'fail' ? 'border-red-500' :
                                    'border-slate-500'
                                }`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-[9px] md:text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Detected Input</div>
                                            <div className={`text-xl md:text-2xl font-bold font-mono ${
                                                testState === 'success' ? 'text-emerald-400' :
                                                testState === 'fail' ? 'text-red-400' :
                                                'text-white'
                                            }`}>
                                                "{testTranscript}"
                                            </div>
                                        </div>
                                        {testState === 'success' && <CheckCircle className="text-emerald-500 w-5 h-5 md:w-6 md:h-6" />}
                                        {testState === 'fail' && <XCircle className="text-red-500 w-5 h-5 md:w-6 md:h-6" />}
                                    </div>
                                </div>
                            )}

                            {/* Control Button */}
                            <button
                                onClick={testState === 'listening' ? () => { stopTest(); setTestState('idle'); } : startTest}
                                disabled={!permissionGranted}
                                className={`w-full sm:w-auto px-8 md:px-12 py-3 md:py-4 font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-3 border rounded-xl ${
                                    testState === 'listening'
                                        ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/20'
                                        : !permissionGranted
                                            ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                                            : 'bg-white text-black hover:bg-slate-200 border-white hover:scale-105'
                                }`}
                            >
                                {testState === 'listening' ? (
                                    <>
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        STOP REC
                                    </>
                                ) : (
                                    <>
                                        <Mic size={16} className="md:w-4 md:h-4" />
                                        START TEST
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    </h2>
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 last:border-0">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500">
                                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">테마 설정</h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">앱의 밝기 모드를 선택합니다.</p>
                                </div>
                            </div>
                            <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg">
                                <button
                                    onClick={() => onThemeChange('light')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${theme === 'light' ? 'bg-white dark:bg-zinc-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300'}`}
                                >
                                    Light
                                </button>
                                <button
                                    onClick={() => onThemeChange('dark')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${theme === 'dark' ? 'bg-white dark:bg-zinc-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300'}`}
                                >
                                    Dark
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Learning Preferences */}
                <section>
                    <h2 className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-4 px-2">
                        학습 환경
                    </h2>
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
                         {/* Daily Goal */}
                         <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500">
                                    <Monitor size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">일일 목표 단어</h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">하루에 학습할 단어 수를 설정합니다.</p>
                                </div>
                            </div>
                            <select 
                                value={dailyGoal}
                                onChange={(e) => setDailyGoal(Number(e.target.value))}
                                className="bg-slate-50 dark:bg-zinc-800 border-none rounded-lg text-sm font-bold text-slate-700 dark:text-white px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value={30}>30개</option>
                                <option value={50}>50개</option>
                                <option value={100}>100개</option>
                            </select>
                        </div>

                         {/* TTS Speed */}
                         <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                    <Volume2 size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">음성 재생 속도</h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">단어 읽기 속도를 조절합니다.</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 w-8 text-right">{ttsSpeed}x</span>
                                <input 
                                    type="range" 
                                    min="0.5" 
                                    max="2.0" 
                                    step="0.1" 
                                    value={ttsSpeed}
                                    onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
                                    className="w-24 accent-blue-500 h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer"
                                />
                             </div>
                        </div>
                    </div>
                </section>

                {/* 3. Voice & Audio Settings */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h2 className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                            음성 인식 및 오디오
                        </h2>
                        <button 
                            onClick={loadDevices}
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded"
                        >
                            <RefreshCw size={12} className={loadingDevices ? 'animate-spin' : ''} />
                            갱신
                        </button>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
                         {/* Microphone Selection */}
                         <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center text-violet-500">
                                    <Mic size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">입력 마이크</h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">사용할 마이크 장치를 선택합니다.</p>
                                </div>
                            </div>
                            
                            <div className="flex-1 max-w-sm w-full">
                                {!permissionGranted && permissionGranted !== null ? (
                                    <div className="text-sm text-red-500 font-bold flex items-center gap-2">
                                        <MicOff size={16} /> 접근 권한 없음
                                    </div>
                                ) : (
                                    <select 
                                        value={micSettings.deviceId}
                                        onChange={(e) => handleDeviceChange(e.target.value)}
                                        disabled={devices.length === 0}
                                        className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-lg text-sm font-bold text-slate-700 dark:text-white px-3 py-2 focus:ring-2 focus:ring-violet-500 truncate"
                                    >
                                        {devices.length === 0 ? (
                                            <option>장치 없음</option>
                                        ) : devices.map(d => (
                                            <option key={d.deviceId} value={d.deviceId}>{d.label}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        {/* Sensitivity */}
                        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">마이크 민감도</h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                                        {micSettings.sensitivity}% (낮을수록 엄격함)
                                    </p>
                                </div>
                            </div>
                             <div className="flex items-center gap-3 w-full max-w-[200px]">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    step="10" 
                                    value={micSettings.sensitivity}
                                    onChange={(e) => handleSensitivityChange(Number(e.target.value))}
                                    className="flex-1 accent-orange-500 h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                         {/* Auto-Listen Toggle */}
                         <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500">
                                    <RefreshCw size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">자동 음성 감지</h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">새 단어 학습 시 자동으로 마이크를 켭니다.</p>
                                </div>
                            </div>
                            
                            <button
                                onClick={handleAutoStartToggle}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                                    micSettings.autoStart ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-700'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        micSettings.autoStart ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </section>

                {/* 3. Notifications & Interface */}
                <section>
                    <h2 className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-4 px-2">
                        알림 및 소리
                    </h2>
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
                        <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setNotifications(!notifications)}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${notifications ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'}`}>
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">학습 알림</h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">정해진 시간에 학습 알림을 받습니다.</p>
                                </div>
                            </div>
                            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${notifications ? 'bg-orange-500' : 'bg-slate-200 dark:bg-zinc-700'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ease-in-out ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                        </div>

                        <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setSoundEffects(!soundEffects)}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${soundEffects ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-500' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'}`}>
                                    <Volume2 size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">효과음</h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">정답/오답 소리 및 버튼 효과음</p>
                                </div>
                            </div>
                            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${soundEffects ? 'bg-purple-500' : 'bg-slate-200 dark:bg-zinc-700'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ease-in-out ${soundEffects ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Info */}
                <section>
                    <h2 className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-4 px-2">
                        정보
                    </h2>
                     <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
                        <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500">
                                    <Info size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">버전 정보</h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">v1.0.0 (Beta)</p>
                                </div>
                            </div>
                        </div>
                         <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500">
                                    <CircleHelp size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">도움말 및 지원</h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">앱 사용법 및 문의하기</p>
                                </div>
                            </div>
                        </div>
                         <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">개인정보 처리방침</h3>
                                </div>
                            </div>
                        </div>
                     </div>
                </section>
                
                <div className="text-center text-xs text-slate-400 py-8">
                    &copy; 2026 VocaMaster. All rights reserved.
                </div>
            </div>
        </div>
    );
};

// SettingsView.tsx
export default SettingsView;
