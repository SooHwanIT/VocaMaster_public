export const getLevenshteinDistance = (a: string, b: string): number => {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }
    return matrix[b.length][a.length];
};

export const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
};

export const shuffleArray = <T,>(items: T[]): T[] => {
    const cloned = [...items];
    for (let i = cloned.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
    }
    return cloned;
};

export const getPercentage = (numerator: number, denominator: number): number => {
    if (denominator <= 0) return 0;
    return (numerator / denominator) * 100;
};

export const getRoundedPercentage = (
    numerator: number,
    denominator: number,
    decimals = 0
): number => {
    const percentage = getPercentage(numerator, denominator);
    const factor = 10 ** decimals;
    return Math.round(percentage * factor) / factor;
};

export const getCorrectCount = (totalTries: number, wrongAttempts = 0): number =>
    Math.max(0, totalTries - wrongAttempts);

export const getTestScorePercent = (
    totalTries: number,
    wrongAttempts: number,
    totalWordCount: number
): number => getRoundedPercentage(getCorrectCount(totalTries, wrongAttempts), totalWordCount, 0);

declare global {
    interface Window {
        electronAPI?: unknown;
    }
}

export const isElectron = (): boolean => {
    if (typeof window !== 'undefined') {
        const userAgent = window.navigator?.userAgent ?? '';
        if (userAgent.includes('Electron')) return true;
        if (typeof window.electronAPI !== 'undefined') return true;
    }

    const processLike = (globalThis as typeof globalThis & {
        process?: { versions?: Record<string, string | undefined> };
    }).process;

    return Boolean(processLike?.versions?.electron);
};
