import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MutableRefObject, type WheelEvent as ReactWheelEvent } from 'react';
import type { TestDirection, TestResultEntry } from '../app/types';
import type { Word } from '../data/types';

const normalizeKoreanAnswer = (value: string) => value.replace(/\([^)]*\)/g, '').replace(/[\s\.]/g, '').toLowerCase();

const getKoreanValidAnswers = (definitions: string[]) => {
    return definitions
        .flatMap((definition) => definition.replace(/\([^)]*\)/g, '').split(/[,/]/))
        .map((item) => normalizeKoreanAnswer(item))
        .filter((item) => item.length > 0);
};

interface UseTestInputControllerArgs {
    words: Word[];
    step: 'CONFIG' | 'TEST';
    direction: TestDirection;
    inputRefs: MutableRefObject<(HTMLInputElement | null)[]>;
    onComplete: (results: TestResultEntry[], direction: TestDirection) => void;
}

export const useTestInputController = ({
    words,
    step,
    direction,
    inputRefs,
    onComplete,
}: UseTestInputControllerArgs) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const lastWheelTimeRef = useRef(0);

    useEffect(() => {
        if (step !== 'TEST') {
            setAnswers({});
            setCurrentIndex(0);
            return;
        }

        requestAnimationFrame(() => {
            inputRefs.current[currentIndex]?.focus();
        });
    }, [currentIndex, inputRefs, step, words]);

    const handleInputChange = useCallback((value: string) => {
        const currentWord = words[currentIndex];
        if (!currentWord) return;

        setAnswers((prev) => ({
            ...prev,
            [currentWord.id]: value,
        }));
    }, [currentIndex, words]);

    const evaluateResults = useCallback((): TestResultEntry[] => {
        return words.map((word) => {
            const userAnswer = (answers[word.id] || '').trim().toLowerCase();

            if (direction === 'EN_TO_KR') {
                const validAnswers = getKoreanValidAnswers(word.definitions);
                const normalizedAnswer = normalizeKoreanAnswer(userAnswer);
                return {
                    wordId: word.id,
                    isCorrect: validAnswers.some((answer) => answer === normalizedAnswer),
                };
            }

            return {
                wordId: word.id,
                isCorrect: userAnswer === word.word.toLowerCase(),
            };
        });
    }, [answers, direction, words]);

    const handleSubmit = useCallback(() => {
        onComplete(evaluateResults(), direction);
    }, [direction, evaluateResults, onComplete]);

    const handleNext = useCallback(() => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            return;
        }

        if (window.confirm('모든 문제를 풀었습니다. 제출하시겠습니까?')) {
            handleSubmit();
        }
    }, [currentIndex, handleSubmit, words.length]);

    const handleKeyDown = useCallback((event: ReactKeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleNext();
            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setCurrentIndex((prev) => Math.max(0, prev - 1));
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setCurrentIndex((prev) => Math.min(words.length - 1, prev + 1));
        }
    }, [handleNext, words.length]);

    const handleWheel = useCallback((event: ReactWheelEvent) => {
        const now = Date.now();
        if (now - lastWheelTimeRef.current < 50) return;

        if (event.deltaY > 0 && currentIndex < words.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            lastWheelTimeRef.current = now;
            return;
        }

        if (event.deltaY < 0 && currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            lastWheelTimeRef.current = now;
        }
    }, [currentIndex, words.length]);

    return {
        answers,
        currentIndex,
        setCurrentIndex,
        handleInputChange,
        handleKeyDown,
        handleNext,
        handleSubmit,
        handleWheel,
    };
};

export default useTestInputController;
