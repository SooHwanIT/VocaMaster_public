import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { AlertCircle, TrendingDown, CheckCircle2, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { getWrongWordStats, type WrongWordStat } from '../db';
import { DATA_SETS } from '../data.ts';
import { getRoundedPercentage, speakText } from '../app/utils';
import { TransitionPlaceholder } from './TransitionUI';
import useDelayedPending from '../hooks/useDelayedPending';

type SortKey = 'wrongCount' | 'accuracy' | 'lastAttemptAt';

export const WRONG_NOTES_CACHE_KEY = 'vm_wrong_notes_cache_v1';

type CachedWrongStats = {
    data: WrongWordStat[];
    updatedAt: number;
};

const safeReadJson = <T,>(key: string): T | null => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
};

const safeWriteJson = (key: string, value: unknown) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch { }
};

const WrongNotesView = () => {
    const [sortKey, setSortKey] = useState<SortKey>('wrongCount');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [wrongStats, setWrongStats] = useState<WrongWordStat[]>([]);
    const loadingVisible = useDelayedPending(loading);

    const fetchAndCache = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
        if (!silent) setLoading(true);
        try {
            const rows = await getWrongWordStats();
            setWrongStats(rows);
            safeWriteJson(WRONG_NOTES_CACHE_KEY, { data: rows, updatedAt: Date.now() } satisfies CachedWrongStats);
        } catch { /* silent */ } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    useEffect(() => {
        const cached = safeReadJson<CachedWrongStats>(WRONG_NOTES_CACHE_KEY);
        if (cached?.data) {
            setWrongStats(cached.data);
            setLoading(false);
            void fetchAndCache({ silent: true });
        } else {
            void fetchAndCache();
        }
    }, [fetchAndCache]);

    const stats = useMemo(() => {
        return wrongStats
            .map((s) => {
                const ds = DATA_SETS.find(d => d.id === s.dataSetId);
                const wordObj = ds?.words.find(w => w.id === s.wordId);
                return {
                    ...s,
                    word: wordObj?.word ?? s.wordId,
                    definitions: wordObj?.definitions ?? [],
                    etymo: wordObj?.etymo ?? '',
                    examples: wordObj?.examples ?? [],
                    dataSetTitle: ds?.title ?? s.dataSetId,
                };
            });
    }, [wrongStats]);

    const sorted = useMemo(() => {
        return [...stats].sort((a, b) => {
            if (sortKey === 'wrongCount') return b.wrongCount - a.wrongCount;
            if (sortKey === 'accuracy') return a.accuracy - b.accuracy;
            if (sortKey === 'lastAttemptAt') return b.lastAttemptAt - a.lastAttemptAt;
            return 0;
        });
    }, [stats, sortKey]);

    if (loading) {
        if (loadingVisible) {
            return (
                <TransitionPlaceholder
                    title="오답 노트를 정리 중이에요"
                    variant="list"
                    onRetry={() => void fetchAndCache()}
                />
            );
        }
        return <div className="vm-page" aria-busy="true" />;
    }

    if (sorted.length === 0) {
        return (
            <div className="vm-page flex-col items-center justify-center text-zinc-400 gap-4">
                <CheckCircle2 size={48} className="opacity-40 text-emerald-400" />
                <p className="text-lg font-semibold">오답 기록이 없습니다.</p>
                <p className="text-sm">퀴즈를 풀면 틀린 단어가 여기에 기록됩니다.</p>
            </div>
        );
    }

    const totalWrong = stats.reduce((s, r) => s + r.wrongCount, 0);
    const totalCorrect = stats.reduce((s, r) => s + r.correctCount, 0);
    const overallAccuracy = getRoundedPercentage(totalCorrect, totalWrong + totalCorrect, 0);

    const SortButton = ({ k, label }: { k: SortKey; label: string }) => (
        <button
            onClick={() => setSortKey(k)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                sortKey === k
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="vm-page">
            <div className="vm-page-header shrink-0">
                <h1 className="vm-page-title mb-2 flex items-center gap-3">
                    <AlertCircle className="text-red-500" size={32} />
                    오답 노트
                </h1>
                <p className="vm-page-subtitle">틀린 적 있는 단어들을 모아서 집중적으로 복습하세요.</p>
            </div>

            {/* 요약 카드 */}
            <div className="grid grid-cols-3 gap-3 mb-6 shrink-0">
                <div className="vm-card p-4 flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase text-slate-400 dark:text-zinc-500 tracking-wider">틀린 단어</span>
                    <span className="text-2xl font-black text-red-500">{stats.length}<span className="text-sm text-slate-400 font-medium ml-1">개</span></span>
                </div>
                <div className="vm-card p-4 flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase text-slate-400 dark:text-zinc-500 tracking-wider">총 오답 수</span>
                    <span className="text-2xl font-black text-orange-500">{totalWrong}<span className="text-sm text-slate-400 font-medium ml-1">회</span></span>
                </div>
                <div className="vm-card p-4 flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase text-slate-400 dark:text-zinc-500 tracking-wider">전체 정답률</span>
                    <span className="text-2xl font-black text-blue-500">{overallAccuracy}<span className="text-sm text-slate-400 font-medium ml-1">%</span></span>
                </div>
            </div>

            {/* 정렬 버튼 */}
            <div className="flex items-center gap-2 mb-4 shrink-0">
                <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium mr-1">정렬:</span>
                <SortButton k="wrongCount" label="오답 많은 순" />
                <SortButton k="accuracy" label="정답률 낮은 순" />
                <SortButton k="lastAttemptAt" label="최근 시도 순" />
            </div>

            {/* 단어 목록 */}
            <div className="flex-1 space-y-2 pb-20">
                {sorted.map((item, idx) => {
                    const isExpanded = expandedId === item.wordId;
                    const accuracyColor =
                        item.accuracy >= 70 ? 'text-emerald-500' :
                        item.accuracy >= 40 ? 'text-yellow-500' : 'text-red-500';

                    return (
                        <div key={item.wordId} className="vm-card-soft rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
                            {/* 헤더 행 */}
                            <button
                                className="w-full p-4 flex items-center gap-4 text-left hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors"
                                onClick={() => setExpandedId(isExpanded ? null : item.wordId)}
                            >
                                {/* 순위 */}
                                <span className="w-6 text-center text-sm font-black text-slate-300 dark:text-zinc-600 shrink-0">{idx + 1}</span>

                                {/* 단어 정보 */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <button
                                            className="text-xl font-extrabold text-slate-800 dark:text-white hover:text-blue-500 transition-colors"
                                            onClick={(e) => { e.stopPropagation(); speakText(item.word); }}
                                        >
                                            {item.word}
                                        </button>
                                        <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">{item.dataSetTitle}</span>
                                    </div>
                                    {item.definitions.length > 0 && (
                                        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5 truncate">{item.definitions[0]}</p>
                                    )}
                                </div>

                                {/* 통계 */}
                                <div className="flex items-center gap-4 shrink-0">
                                    <div className="text-right">
                                        <div className="flex items-center gap-1.5 justify-end">
                                            <TrendingDown size={13} className="text-red-400" />
                                            <span className="text-sm font-bold text-red-500">{item.wrongCount}회</span>
                                        </div>
                                        <div className={`text-xs font-bold ${accuracyColor}`}>{item.accuracy}%</div>
                                    </div>
                                    <div className="text-slate-300 dark:text-zinc-600">
                                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </div>
                                </div>
                            </button>

                            {/* 펼쳐진 상세 */}
                            {isExpanded && (
                                <div className="px-5 pb-5 border-t border-slate-100 dark:border-zinc-800 animate-in slide-in-from-top-2 duration-200">
                                    {/* 정답/오답 진행바 */}
                                    <div className="mt-4 mb-4">
                                        <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1.5">
                                            <span>정답 {item.correctCount}회</span>
                                            <span>오답 {item.wrongCount}회</span>
                                        </div>
                                        <div className="w-full h-2 bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                                                style={{ width: `${item.accuracy}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            마지막 시도: {format(new Date(item.lastAttemptAt), 'yyyy.MM.dd HH:mm', { locale: ko })}
                                        </div>
                                    </div>

                                    {/* 모든 뜻 */}
                                    {item.definitions.length > 0 && (
                                        <div className="mb-3">
                                            <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">뜻</div>
                                            <ul className="space-y-1">
                                                {item.definitions.map((def, i) => (
                                                    <li key={i} className="text-sm text-slate-700 dark:text-zinc-200 flex gap-2">
                                                        <span className="text-slate-300 dark:text-zinc-600 shrink-0">{i + 1}.</span>
                                                        {def}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* 어원 */}
                                    {item.etymo && (
                                        <div className="mb-3">
                                            <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">어원</div>
                                            <p className="text-sm text-slate-600 dark:text-zinc-300 italic">{item.etymo}</p>
                                        </div>
                                    )}

                                    {/* 예문 */}
                                    {item.examples.length > 0 && (
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">예문</div>
                                            <div className="space-y-2">
                                                {item.examples.slice(0, 2).map((ex, i) => (
                                                    <div key={i} className="bg-slate-50 dark:bg-zinc-900/60 rounded-lg p-3">
                                                        <p className="text-sm text-slate-700 dark:text-zinc-200"
                                                           dangerouslySetInnerHTML={{
                                                               __html: ex.text
                                                                   .replace(/\[([^\]]+)\]/g, '<strong class="text-blue-600 dark:text-blue-400">$1</strong>')
                                                           }}
                                                        />
                                                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1"
                                                           dangerouslySetInnerHTML={{
                                                               __html: ex.korean
                                                                   .replace(/\{([^}]+)\}/g, '<strong class="text-blue-500 dark:text-blue-400">$1</strong>')
                                                           }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* TTS 버튼 */}
                                    <button
                                        onClick={() => speakText(item.word)}
                                        className="mt-3 flex items-center gap-2 text-xs text-blue-500 hover:text-blue-600 font-semibold transition-colors"
                                    >
                                        <RotateCcw size={13} /> 발음 듣기
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WrongNotesView;
