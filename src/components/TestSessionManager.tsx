import React, { useMemo, useRef } from 'react';
import { DATA_SETS } from '../data';
import TestModeUI from './TestModeUI';
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

    const words = useMemo(() => {
        const dataSet = DATA_SETS.find(d => d.id === dataSetId);
        if (!dataSet) return [];
        // Shuffle words for test? usually yes.
        // Let's shuffle them randomly each time
        return [...dataSet.words].sort(() => Math.random() - 0.5);
    }, [dataSetId]); 

    const handleComplete = (results: { wordId: string; isCorrect: boolean }[]) => {
        const endTime = Date.now();
        const totalCount = results.length;
        const correctCount = results.filter(r => r.isCorrect).length;
        const wrongCount = totalCount - correctCount;
        
        // Find most wrong word? In bulk mode we don't track repetitions
        // Just pick one wrong word if any
        const wrongWords = results.filter(r => !r.isCorrect).map(r => r.wordId);
        const mostWrong = wrongWords.length > 0 ? wrongWords[0] : ''; // Simple fallback

        const stats: SessionStats = {
            startTime: startTimeRef.current,
            endTime,
            totalTries: totalCount, // In test mode, tries = count (1 attempt per word)
            wrongAttempts: wrongCount,
            totalWordCount: totalCount,
            masteredCount: 0, // Test mode doesn't track mastery directly here
            mostWrong
        };

        onFinish(stats);
    };

    if (words.length === 0) {
        return <div className="flex items-center justify-center h-full text-red-500">데이터를 불러올 수 없습니다.</div>;
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
