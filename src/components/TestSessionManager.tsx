import React, { useMemo, useRef, useState } from 'react';
import { DATA_SETS } from '../data';
import TestModeUI from './TestModeUI';
import TestResultView from './TestResultView';
import type { SessionStats } from '../app/types';

interface TestSessionManagerProps {
    dataSetId: string;
    onFinish: (stats: SessionStats) => void;
    onQuit: () => void;
}

const TestSessionManager: React.FC<TestSessionManagerProps> = ({
    dataSetId,
    onFinish,
    onQuit
}) => {
    const startTimeRef = useRef(Date.now());
    const [view, setView] = useState<'TEST' | 'RESULT'>('TEST');
    const [testResults, setTestResults] = useState<{ wordId: string; isCorrect: boolean }[]>([]);
    const [testStats, setTestStats] = useState<SessionStats | null>(null);
    const [testType, setTestType] = useState<'EN_TO_KR' | 'KR_TO_EN'>('EN_TO_KR');

    const words = useMemo(() => {
        const dataSet = DATA_SETS.find(d => d.id === dataSetId);
        if (!dataSet) return [];
        // Shuffle words for test? usually yes.
        // Let's shuffle them randomly each time
        return [...dataSet.words].sort(() => Math.random() - 0.5);
    }, [dataSetId]); 

    const handleComplete = (results: { wordId: string; isCorrect: boolean }[], direction: 'EN_TO_KR' | 'KR_TO_EN') => {
        const endTime = Date.now();
        const totalCount = results.length;
        const correctCount = results.filter(r => r.isCorrect).length;
        const wrongCount = totalCount - correctCount;
        
        const wrongWords = results.filter(r => !r.isCorrect).map(r => r.wordId);
        const mostWrong = wrongWords.length > 0 ? wrongWords[0] : '';

        const stats: SessionStats = {
            startTime: startTimeRef.current,
            endTime,
            totalTries: totalCount,
            wrongAttempts: wrongCount,
            totalWordCount: totalCount,
            masteredCount: 0, 
            mostWrong,
            wrongWords // Add wrongWords list
        };

        setTestResults(results);
        setTestStats(stats);
        setTestType(direction);
        setView('RESULT');
        
        // 상위 컴포넌트(App.tsx)에 통계를 보내어 저장 등 처리
        onFinish(stats);
    };

    if (words.length === 0) {
        return <div className="flex items-center justify-center h-full text-red-500">데이터를 불러올 수 없습니다.</div>;
    }

    if (view === 'RESULT' && testStats) {
        return (
            <TestResultView 
                stats={testStats}
                results={testResults}
                words={words}
                testType={testType}
                onRetry={() => {
                    setView('TEST');
                    startTimeRef.current = Date.now();
                }}
                onDashboard={onQuit}
            />
        );
    }

    return (
        <TestModeUI 
            words={words} 
            onComplete={handleComplete} 
            onQuit={onQuit} 
        />
    );
};

export default TestSessionManager;
