import React, { useEffect, useMemo, useState } from 'react';

type TransitionSurfaceProps = {
    transitionKey: string;
    children: React.ReactNode;
    className?: string;
    busy?: boolean;
};

export const TransitionSurface = ({
    transitionKey,
    children,
    className = '',
    busy = false
}: TransitionSurfaceProps) => {
    const [animKey, setAnimKey] = useState(0);

    useEffect(() => {
        setAnimKey((prev) => prev + 1);
    }, [transitionKey]);

    return (
        <section className={className} aria-busy={busy}>
            <div key={`${transitionKey}:${animKey}`} className="vm-transition-enter">
                {children}
            </div>
        </section>
    );
};

type TransitionPlaceholderProps = {
    title?: string;
    className?: string;
    fullScreen?: boolean;
    variant?: 'list' | 'stats' | 'cards' | 'compact';
    onRetry?: () => void;
};

const getStageText = (elapsed: number) => {
    if (elapsed < 1200) return '화면을 전환하고 있어요';
    if (elapsed < 3000) return '학습 데이터를 정리하는 중이에요';
    return '연결 상태를 확인하고 다시 시도할 수 있어요';
};

const SkeletonRows = ({ count = 5 }: { count?: number }) => (
    <div className="space-y-3">
        {Array.from({ length: count }).map((_, idx) => (
            <div key={`row-${idx}`} className="vm-skeleton-shimmer h-12 w-full rounded-xl" />
        ))}
    </div>
);

const SkeletonStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, idx) => (
            <div key={`stat-${idx}`} className="vm-card p-5">
                <div className="vm-skeleton-shimmer h-3 w-20 rounded mb-3" />
                <div className="vm-skeleton-shimmer h-8 w-24 rounded mb-3" />
                <div className="vm-skeleton-shimmer h-2 w-full rounded" />
            </div>
        ))}
    </div>
);

const SkeletonCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
            <div key={`card-${idx}`} className="vm-card p-5 h-48">
                <div className="vm-skeleton-shimmer h-4 w-24 rounded mb-4" />
                <div className="vm-skeleton-shimmer h-8 w-2/3 rounded mb-5" />
                <div className="vm-skeleton-shimmer h-3 w-full rounded mb-2" />
                <div className="vm-skeleton-shimmer h-3 w-5/6 rounded" />
            </div>
        ))}
    </div>
);

export const TransitionPlaceholder = ({
    title = '콘텐츠 준비 중',
    className = '',
    fullScreen = false,
    variant = 'list',
    onRetry
}: TransitionPlaceholderProps) => {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const start = Date.now();
        const id = window.setInterval(() => {
            setElapsed(Date.now() - start);
        }, 250);
        return () => window.clearInterval(id);
    }, []);

    const stageText = useMemo(() => getStageText(elapsed), [elapsed]);

    return (
        <div
            className={`${fullScreen ? 'h-screen w-screen' : 'vm-page min-h-[40vh]'} ${className}`}
            aria-busy="true"
            aria-live="polite"
        >
            <div className="mx-auto w-full max-w-5xl">
                <div className="vm-card p-5 md:p-6 mb-4">
                    <div className="h-1 w-full rounded-full overflow-hidden bg-slate-200 dark:bg-zinc-800 mb-4">
                        <div className="vm-progress-indeterminate h-full w-1/2 rounded-full bg-violet-500" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">{stageText}</p>
                    {elapsed >= 3000 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {onRetry && (
                                <button onClick={onRetry} className="vm-btn-secondary h-9 px-3 text-xs">
                                    다시 시도
                                </button>
                            )}
                            <span className="text-xs text-slate-400 dark:text-zinc-500 self-center">
                                오프라인 상태를 확인하거나 잠시 후 다시 시도해 주세요.
                            </span>
                        </div>
                    )}
                </div>

                {variant === 'stats' && <SkeletonStats />}
                {variant === 'cards' && <SkeletonCards />}
                {variant === 'compact' && <SkeletonRows count={3} />}
                {variant === 'list' && <SkeletonRows count={6} />}
            </div>
        </div>
    );
};
