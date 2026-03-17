import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Brain,
  BarChart3,
  Zap,
  Target,
  TrendingUp,
  Shield,
} from 'lucide-react';

/* ─────────────────────────────────────────
   배경 keyframes
───────────────────────────────────────── */
const BG_STYLE = `
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
@keyframes veil-drift {
  0%,100% { transform: translateX(0) translateY(0); }
  50%     { transform: translateX(-2.5%) translateY(1.5%); }
}
@keyframes badge-pulse {
  0%,100% { opacity: 0.9; }
  50%     { opacity: 1; }
}
@keyframes float-card {
  0%,100% { transform: translateY(0px); }
  50%     { transform: translateY(-6px); }
}
`;

type FeatureBackgroundTheme = {
  page: string;
  base: string;
  top: string;
  left: string;
  right: string;
  bottom: string;
};

const LandingBackground = ({ theme }: { theme: FeatureBackgroundTheme }) => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <style>{BG_STYLE}</style>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* 베이스 배경 */}
        <div 
          className="absolute inset-0" 
          style={{
            background: theme.base,
            transition: 'background-color 1000ms cubic-bezier(0.22, 1, 0.36, 1)',
          }} 
        />

        {/* 엣지 블러 격자 */}
        <div 
          className="absolute inset-0 opacity-[0.25]" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(148, 163, 184, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(148, 163, 184, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
          }} 
        />

        {/* 유영하는 메시 그라디언트 블롭 */}
        <div className="absolute inset-0 overflow-hidden blur-[80px] saturate-150 transition-all duration-1000">
          <div 
            className="absolute -top-[10%] left-[10%] h-[50vh] w-[50vw] rounded-full"
            style={{
              background: theme.top,
              animation: 'blob 15s infinite alternate ease-in-out',
              transition: 'background 1000ms ease',
            }}
          />
          <div 
            className="absolute left-[-10%] top-[30%] h-[60vh] w-[40vw] rounded-full"
            style={{
              background: theme.left,
              animation: 'blob 18s infinite alternate-reverse ease-in-out',
              transition: 'background 1000ms ease',
            }}
          />
          <div 
            className="absolute right-[-10%] top-[20%] h-[55vh] w-[45vw] rounded-full"
            style={{
              background: theme.right,
              animation: 'blob 20s infinite alternate ease-in-out',
              animationDelay: '2s',
              transition: 'background 1000ms ease',
            }}
          />
        </div>

        {/* 인터랙티브 마우스 스포트라이트 */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay transition-opacity duration-300"
          style={{
            background: `radial-gradient(800px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.9), transparent 40%)`,
          }}
        />

        {/* 사선 하이라이트 베일 */}
        <div 
          className="absolute -inset-[10%] opacity-40" 
          style={{
            background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 70%)',
            animation: 'veil-drift 22s ease-in-out infinite alternate',
            backgroundSize: '200% 200%',
          }} 
        />

        {/* 종이/노이즈 질감 오버레이 */}
        <div 
          className="absolute inset-0 mix-blend-overlay" 
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 140 140\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'140\' height=\'140\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
            opacity: 0.12,
          }} 
        />

        {/* 하단 비네팅 */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[40vh]" 
          style={{
            background: theme.bottom,
            transition: 'background 1000ms cubic-bezier(0.22, 1, 0.36, 1)',
          }} 
        />
      </div>
    </>
  );
};

/* ─────────────────────────────────────────
   데이터
───────────────────────────────────────── */
interface LandingPageProps {
  onStartLogin: () => void;
  onStartSignup: () => void;
}

const FEATURES = [
  {
    eyebrow: 'FOCUS FLOW',
    icon: Zap,
    iconColor: 'text-violet-700',
    iconBg: 'bg-violet-100',
    dotColor: 'bg-violet-600',
    glowColor: 'rgba(124,58,237,0.12)',
    visualGradient: 'linear-gradient(135deg, rgba(124,58,237,0.32) 0%, rgba(59,130,246,0.22) 100%)',
    visualTag: 'TODAY FLOW',
    previewSrc: '/screenshots/word-study-grid.png',
    title: '오늘 분량만, 가장 짧은 동선으로',
    desc: '해야 할 학습만 자동으로 정리해 집중이 끊기지 않습니다.',
    points: ['오늘 학습 자동 구성', '복습 우선순위 정렬', '학습 기록 즉시 반영'],
  },
  {
    eyebrow: 'SMART REVIEW',
    icon: Brain,
    iconColor: 'text-sky-700',
    iconBg: 'bg-sky-100',
    dotColor: 'bg-sky-600',
    glowColor: 'rgba(56,189,248,0.12)',
    visualGradient: 'linear-gradient(135deg, rgba(56,189,248,0.30) 0%, rgba(99,102,241,0.20) 100%)',
    visualTag: 'SMART REVIEW',
    previewSrc: '/screenshots/quiz-choice.png',
    title: '기억이 흐려질 때 정확히 다시',
    desc: '정답률과 복습 시점을 기반으로 개인 맞춤 복습을 제공합니다.',
    points: ['오답 중심 리마인드', '난이도 기반 반복', '진도·정확도 동시 추적'],
  },
  {
    eyebrow: 'RESULTS',
    icon: BarChart3,
    iconColor: 'text-emerald-700',
    iconBg: 'bg-emerald-100',
    dotColor: 'bg-emerald-600',
    glowColor: 'rgba(16,185,129,0.12)',
    visualGradient: 'linear-gradient(135deg, rgba(16,185,129,0.28) 0%, rgba(59,130,246,0.18) 100%)',
    visualTag: 'RESULT SNAPSHOT',
    previewSrc: '/screenshots/stats.png',
    title: '실력은 숫자로, 변화는 체감으로',
    desc: '학습량보다 중요한 건 유지율. 핵심 지표로 성장을 확인하세요.',
    points: ['일/주간 성과 지표', '누적 학습 히스토리', '실전 대비 모드 연계'],
  },
];

const FEATURE_BACKGROUND_THEMES: FeatureBackgroundTheme[] = [
  {
    page: '#f8fafc',
    base: '#f8fafc',
    top: 'radial-gradient(70% 85% at 50% 0%, rgba(99,102,241,0.17) 0%, rgba(56,189,248,0.10) 36%, rgba(248,250,252,0) 75%)',
    left: 'radial-gradient(closest-side, rgba(139,92,246,0.10) 0%, rgba(139,92,246,0.04) 35%, rgba(139,92,246,0) 78%)',
    right: 'radial-gradient(closest-side, rgba(56,189,248,0.10) 0%, rgba(56,189,248,0.04) 35%, rgba(56,189,248,0) 78%)',
    bottom: 'linear-gradient(180deg, transparent 55%, rgba(148,163,184,0.16) 100%)',
  },
  {
    page: '#f7fafc',
    base: '#f7fafc',
    top: 'radial-gradient(70% 85% at 50% 0%, rgba(56,189,248,0.16) 0%, rgba(99,102,241,0.10) 38%, rgba(247,250,252,0) 75%)',
    left: 'radial-gradient(closest-side, rgba(56,189,248,0.10) 0%, rgba(56,189,248,0.04) 35%, rgba(56,189,248,0) 78%)',
    right: 'radial-gradient(closest-side, rgba(99,102,241,0.09) 0%, rgba(99,102,241,0.04) 35%, rgba(99,102,241,0) 78%)',
    bottom: 'linear-gradient(180deg, transparent 55%, rgba(125,211,252,0.14) 100%)',
  },
  {
    page: '#f8fbf9',
    base: '#f8fbf9',
    top: 'radial-gradient(70% 85% at 50% 0%, rgba(16,185,129,0.16) 0%, rgba(56,189,248,0.08) 36%, rgba(248,251,249,0) 75%)',
    left: 'radial-gradient(closest-side, rgba(16,185,129,0.09) 0%, rgba(16,185,129,0.04) 35%, rgba(16,185,129,0) 78%)',
    right: 'radial-gradient(closest-side, rgba(56,189,248,0.09) 0%, rgba(56,189,248,0.04) 35%, rgba(56,189,248,0) 78%)',
    bottom: 'linear-gradient(180deg, transparent 55%, rgba(110,231,183,0.13) 100%)',
  },
];

const STATS = [
  { value: '4,800+', label: '총 단어 수' },
  { value: '3가지', label: '학습 모드' },
  { value: '10단계', label: '레벨 시스템' },
];

type ShowcaseItem = {
  title: string;
  desc: string;
  src: string;
};

const APP_SHOWCASES: ShowcaseItem[] = [
  {
    title: '대시보드',
    desc: '오늘 학습량, 전체 진행률, 동기부여 영역을 한 화면에서 확인합니다.',
    src: '/screenshots/dashboard.png',
  },
  {
    title: '단어 학습 챕터 선택',
    desc: 'Day별 진도와 객관식/주관식 마스터 현황을 빠르게 파악합니다.',
    src: '/screenshots/word-study-grid.png',
  },
  {
    title: '나만의 단어장',
    desc: '북마크한 단어를 Day 기준으로 정리해 복습 우선순위를 관리합니다.',
    src: '/screenshots/bookmarks.png',
  },
  {
    title: '학습 통계',
    desc: '정답률, 오답 수, 챕터별 완료율을 통해 학습 흐름을 점검합니다.',
    src: '/screenshots/stats.png',
  },
  {
    title: '객관식 퀴즈',
    desc: '문항 진행 바와 선택지를 통해 빠르게 반복 학습합니다.',
    src: '/screenshots/quiz-choice.png',
  },
  {
    title: '플레이어 모드',
    desc: '한 단어 집중 화면으로 뜻·예문을 몰입감 있게 익힙니다.',
    src: '/screenshots/player-mode.png',
  },
  {
    title: '주관식 테스트',
    desc: '쓰기 기반 입력으로 기억을 강화하고 실전 감각을 높입니다.',
    src: '/screenshots/test-mode.png',
  },
];

const ShowcaseImage = ({ item }: { item: ShowcaseItem }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="group overflow-hidden rounded-[22px] bg-white/88 shadow-[0_10px_32px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
      {!hasError ? (
        <div className="relative overflow-hidden rounded-t-[22px]">
          <img
            src={item.src}
            alt={item.title}
            className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            loading="lazy"
            onError={() => setHasError(true)}
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/50" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/25 to-transparent" />
        </div>
      ) : (
        <div className="relative flex aspect-[16/9] items-center justify-center rounded-t-[22px] bg-slate-100">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-wide text-slate-500">SCREENSHOT PREVIEW</p>
            <p className="mt-2 text-xl font-bold text-slate-800">{item.title}</p>
          </div>
        </div>
      )}
      <div className="px-5 py-4">
        <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.desc}</p>
      </div>
    </div>
  );
};

const SectionDivider = () => (
  <div className="h-px w-full bg-slate-200" />
);

/* ─────────────────────────────────────────
   훅
───────────────────────────────────────── */
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  return progress;
};

/* ─────────────────────────────────────────
   컴포넌트
───────────────────────────────────────── */
const LandingPage = ({ onStartLogin, onStartSignup }: LandingPageProps) => {
  const progress = useScrollProgress();
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>({});
  const [featurePreviewError, setFeaturePreviewError] = useState<Record<number, boolean>>({});
  const [reduceMotion, setReduceMotion] = useState(false);
  const featureSectionRef = useRef<HTMLElement | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const snapDeltaRef = useRef(0);
  const snapLockUntilRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduceMotion(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal-id]');
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleMap((prev) => {
          const next = { ...prev };
          for (const entry of entries) {
            const id = entry.target.getAttribute('data-reveal-id');
            if (!id) continue;
            if (entry.isIntersecting) next[id] = true;
          }
          return next;
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        let best = 0;
        let bestDist = Infinity;
        const anchor = window.innerHeight * 0.36;
        stepRefs.current.forEach((el, i) => {
          if (!el) return;
          const dist = Math.abs(el.getBoundingClientRect().top - anchor);
          if (dist < bestDist) { bestDist = dist; best = i; }
        });
        setActiveIndex(best);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  useEffect(() => {
    const SNAP_THRESHOLD = 70;
    const SNAP_LOCK_MS = 300;
    const STICKY_TOP_OFFSET = 96;

    const onWheel = (event: WheelEvent) => {
      if (reduceMotion) return;
      const section = featureSectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const inSnapZone = rect.top < window.innerHeight * 0.45 && rect.bottom > window.innerHeight * 0.55;
      if (!inSnapZone) return;

      const now = Date.now();
      if (now < snapLockUntilRef.current) {
        event.preventDefault();
        return;
      }

      snapDeltaRef.current += event.deltaY;
      if (Math.abs(snapDeltaRef.current) < SNAP_THRESHOLD) return;

      const direction = snapDeltaRef.current > 0 ? 1 : -1;
      snapDeltaRef.current = 0;

      const nextIndex = Math.min(FEATURES.length - 1, Math.max(0, activeIndex + direction));
      if (nextIndex === activeIndex) return;

      event.preventDefault();
      snapLockUntilRef.current = now + SNAP_LOCK_MS;
      setActiveIndex(nextIndex);

      const target = stepRefs.current[nextIndex];
      if (target) {
        const nextTop = target.getBoundingClientRect().top + window.scrollY - STICKY_TOP_OFFSET;
        window.scrollTo({ top: nextTop, behavior: 'smooth' });
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [activeIndex, reduceMotion]);

  const activeFeature = useMemo(() => FEATURES[activeIndex], [activeIndex]);
  const activeBackground = useMemo(
    () => FEATURE_BACKGROUND_THEMES[activeIndex] ?? FEATURE_BACKGROUND_THEMES[0],
    [activeIndex]
  );
  const ActiveIcon = activeFeature.icon;

  const reveal = (id: string) => {
    if (reduceMotion) return '';
    return visibleMap[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';
  };

  return (
    <div className="min-h-screen text-slate-900" style={{
      backgroundColor: activeBackground.page,
      transition: 'background-color 800ms cubic-bezier(0.22, 1, 0.36, 1)',
    }}>

      {/* 스크롤 진행 바 */}
      <div className="fixed left-0 top-0 z-50 h-[2px] w-full bg-slate-200">
        <div
          className="h-full transition-[width] duration-100"
          style={{
            width: `${progress * 100}%`,
            background: '#6366f1',
          }}
        />
      </div>

      <LandingBackground theme={activeBackground} />

      {/* ── NAVBAR ── */}
      <nav className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between bg-white/88 px-6 py-4 backdrop-blur-sm sm:px-10 lg:px-16">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-500/10">
            <BookOpen size={16} className="text-violet-600" />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900">Etyvoca</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onStartLogin}
            className="h-8 rounded-md px-4 text-xs font-medium text-slate-600 transition hover:text-slate-900"
          >
            로그인
          </button>
          <button
            onClick={onStartSignup}
            className="h-8 rounded-sm bg-violet-600 px-4 text-xs font-semibold text-white transition hover:bg-violet-500"
            style={{
              boxShadow: 'none',
            }}
          >
            시작하기
          </button>
        </div>
      </nav>

      <main className="w-full pb-32 pt-24">

        {/* ── HERO ── */}
        <section
          data-reveal-id="hero"
          className={`px-6 py-16 transition-all duration-700 sm:px-10 lg:px-16 lg:py-20 ${reveal('hero')}`}
        >
          {/* 뱃지 */}
          <div
            className="mb-7 inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-semibold"
            style={{
              background: 'rgba(139,92,246,0.10)',
              color: '#6d28d9',
              animation: reduceMotion ? 'none' : 'badge-pulse 3s ease-in-out infinite',
            }}
          >
            <Sparkles size={13} className="text-violet-600" />
            AI-POWERED ENGLISH VOCABULARY
            <span className="ml-0.5 rounded-sm bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-700">
              NEW
            </span>
          </div>

          {/* 메인 타이틀 */}
          <h1 className="max-w-5xl text-[2.4rem] font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-[3.6rem] lg:text-[4.4rem]">
            단어 학습을<br />
            <span className="text-slate-900">
              더 단순하고, 더 강력하게.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-700">
            복잡한 설정 없이 바로 시작하고, 매일의 작은 학습을
            <br className="hidden sm:block" />
            확실한 실력으로 연결합니다.
          </p>

          {/* CTA 버튼 */}
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              onClick={onStartSignup}
              className="group inline-flex h-12 items-center gap-2 rounded-md bg-violet-600 px-7 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
              style={{
                boxShadow: 'none',
              }}
            >
              무료로 시작하기
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={onStartLogin}
              className="inline-flex h-12 items-center gap-2 rounded-md bg-slate-100 px-7 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
            >
              로그인
            </button>
          </div>

          {/* 신뢰 지표 */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-slate-900">{s.value}</span>
                <span className="text-xs text-slate-500">{s.label}</span>
              </div>
            ))}
            <div className="hidden h-3 w-px bg-slate-300 sm:block" />
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <CheckCircle2 size={12} className="text-emerald-500" />
              가입 즉시 이용 가능
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── FEATURES ── */}
        <section ref={featureSectionRef} className="grid grid-cols-1 gap-10 bg-white px-6 py-20 sm:px-10 lg:grid-cols-2 lg:items-start lg:gap-20 lg:px-16">

          {/* 왼쪽 sticky 패널 */}
          <div className="lg:sticky lg:top-24 lg:h-[72vh]">
            <div
              data-reveal-id="preview"
              className={`relative h-full overflow-hidden p-1 transition-all duration-700 ${reveal('preview')}`}
              style={{ animation: reduceMotion ? 'none' : 'float-card 6s ease-in-out infinite' }}
            >
              <div className="relative">
                <div className="mb-7 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200/80 shadow-[0_8px_28px_rgba(15,23,42,0.08)]">
                  <div className="relative aspect-[16/9]">
                    {!featurePreviewError[activeIndex] ? (
                      <img
                        src={activeFeature.previewSrc}
                        alt={activeFeature.title}
                        className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
                        onError={() => setFeaturePreviewError((prev) => ({ ...prev, [activeIndex]: true }))}
                      />
                    ) : (
                      <div
                        className="absolute inset-0 transition-all duration-500"
                        style={{ background: 'rgba(148, 163, 184, 0.20)' }}
                      />
                    )}
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/50" />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/45 to-transparent" />
                    <div className="absolute left-3 top-3 rounded-sm bg-white/85 px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-slate-600">
                      {activeFeature.visualTag}
                    </div>
                    <div className="absolute bottom-3 left-3 text-xs font-medium text-slate-700">학습 화면 미리보기</div>
                  </div>
                </div>

                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-md ${activeFeature.iconBg} transition-all duration-500`}>
                  <ActiveIcon size={18} className={`${activeFeature.iconColor} transition-all duration-500`} />
                </div>

                <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-slate-500">
                  {activeFeature.eyebrow}
                </p>
                <h2 className="mt-3 text-3xl font-extrabold leading-snug text-slate-900 transition-all duration-500 lg:text-4xl">
                  {activeFeature.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-700 transition-all duration-500 sm:text-lg">
                  {activeFeature.desc}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {activeFeature.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <CheckCircle2 size={14} className={`${activeFeature.iconColor} shrink-0`} />
                      {pt}
                    </li>
                  ))}
                </ul>

                {/* 인디케이터 */}
                <div className="mt-8 flex items-center gap-1.5">
                  {FEATURES.map((f, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i === activeIndex ? `w-6 ${f.dotColor}` : 'w-1.5 bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 카드 */}
          <div className="space-y-0">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === activeIndex;
              return (
                <div
                  key={feature.title}
                  ref={(el) => { stepRefs.current[index] = el; }}
                  className="relative h-[74vh] scroll-mt-24"
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <div className="sticky top-24 cursor-pointer p-2 transition-all duration-300 sm:p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                          {feature.eyebrow}
                        </p>
                        <h3 className="mt-3 text-2xl font-extrabold leading-snug text-slate-900 sm:text-3xl">
                          {feature.title}
                        </h3>
                        <p className="mt-4 max-w-md text-base leading-relaxed text-slate-700 sm:text-lg">
                          {feature.desc}
                        </p>
                      </div>
                      <div className={`ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-all duration-300 ${
                        isActive ? feature.iconBg : 'bg-slate-100/70'
                      }`}>
                        <Icon size={18} className={`transition-all duration-300 ${isActive ? feature.iconColor : 'text-slate-400'}`} />
                      </div>
                    </div>

                    {isActive && (
                      <>
                        <div className="mt-6 h-px bg-slate-200" />
                        <ul className="mt-4 space-y-2">
                          {feature.points.map((pt) => (
                            <li key={pt} className="flex items-center gap-3 text-sm text-slate-600">
                              <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${feature.dotColor}`} />
                              {pt}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <SectionDivider />

        {/* ── WHY 섹션 ── */}
        <section
          data-reveal-id="why"
          className={`bg-slate-50 px-6 py-20 transition-all duration-700 sm:px-10 lg:px-16 ${reveal('why')}`}
        >
          <div className="mb-14">
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-violet-600">WHY ETYVOCA</p>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">단순한 단어장과의 차이</h2>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {[
              {
                icon: Target,
                color: 'text-violet-400',
                bg: 'bg-violet-500/10',
                title: '맞춤 학습',
                desc: '내 정답률을 분석해 약한 단어에 집중합니다.',
              },
              {
                icon: TrendingUp,
                color: 'text-sky-400',
                bg: 'bg-sky-500/10',
                title: '성장 추적',
                desc: 'XP와 레벨로 매일의 성과를 눈에 보이게 측정합니다.',
              },
              {
                icon: Shield,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
                title: '안전한 동기화',
                desc: '클라우드 기반으로 어디서든 이어서 학습합니다.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-1"
                >
                  <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md ${item.bg}`}>
                    <Icon size={18} className={item.color} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-slate-900">{item.title}</h3>
                  <p className="text-base leading-relaxed text-slate-700">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <SectionDivider />

        {/* ── SCREENSHOTS ── */}
        <section
          data-reveal-id="screenshots"
          className={`bg-white px-6 py-20 transition-all duration-700 sm:px-10 lg:px-16 ${reveal('screenshots')}`}
        >
          <div className="mb-12">
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-violet-600">PRODUCT SNAPSHOTS</p>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">실제 학습 화면</h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
              홈부터 퀴즈, 통계, 오답 복습까지 학습 흐름이 어떻게 이어지는지 실제 화면으로 확인할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {APP_SHOWCASES.map((item) => (
              <ShowcaseImage key={item.title} item={item} />
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* ── CTA 섹션 ── */}
        <section
          data-reveal-id="cta"
          className={`relative overflow-hidden bg-slate-900 px-6 py-20 text-white transition-all duration-700 sm:px-10 lg:px-16 ${reveal('cta')}`}
          style={{
            background: '#0f172a',
          }}
        >
          <div className="relative">
            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-violet-300">READY TO START</p>
                <h2 className="text-3xl font-extrabold leading-snug text-white sm:text-5xl">
                  오늘부터,<br />
                  <span className="text-white">
                    학습 루틴을 바꿔보세요.
                  </span>
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
                  회원가입 후 바로 학습을 시작할 수 있습니다. 신용카드 없이 무료로 사용하세요.
                </p>
                <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-400">
                  {['무료 가입', '즉시 시작', '클라우드 저장'].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center gap-3">
                <button
                  onClick={onStartSignup}
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-violet-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
                  style={{
                    boxShadow: 'none',
                  }}
                >
                  무료 회원가입
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={onStartLogin}
                  className="inline-flex h-12 items-center justify-center rounded-md bg-white/12 px-6 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  이미 계정이 있어요
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm border border-violet-200 bg-violet-50">
              <BookOpen size={12} className="text-violet-600" />
            </div>
            <span className="text-xs font-semibold text-slate-600">Etyvoca</span>
          </div>
          <p className="text-xs text-slate-500">© 2026 Etyvoca. All rights reserved.</p>
        </div>
      </footer>

      {/* ── 플로팅 CTA ── */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent" />
      <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
        <button
          onClick={onStartSignup}
          className="pointer-events-auto inline-flex h-11 items-center gap-2 rounded-md bg-violet-600 px-6 text-xs font-semibold text-white transition-colors hover:bg-violet-500"
          style={{
            boxShadow: 'none',
          }}
        >
          <Sparkles size={12} />
          지금 무료로 시작하기
        </button>
      </div>
    </div>
  );
};

export default LandingPage;