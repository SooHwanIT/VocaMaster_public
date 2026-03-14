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
@keyframes orb-a {
  0%,100% { transform: translate(-50%,0px) scale(1); }
  40%     { transform: translate(-50%,-55px) scale(1.07); }
  75%     { transform: translate(-50%,28px) scale(0.94); }
}
@keyframes orb-b {
  0%,100% { transform: translate(0,0) scale(1); }
  35%     { transform: translate(45px,-60px) scale(1.09); }
  70%     { transform: translate(-30px,35px) scale(0.93); }
}
@keyframes orb-c {
  0%,100% { transform: translate(0,0) scale(1); }
  50%     { transform: translate(-45px,-40px) scale(1.06); }
}
@keyframes star-twinkle {
  0%,100% { opacity: 0.2; }
  50%     { opacity: 0.8; }
}
@keyframes aurora-shift {
  0%,100% { opacity: 0.6; transform: scaleX(1) translateX(0); }
  50%     { opacity: 0.9; transform: scaleX(1.06) translateX(-10px); }
}
@keyframes badge-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(139,92,246,0); }
  50%     { box-shadow: 0 0 14px 3px rgba(139,92,246,0.35); }
}
@keyframes float-card {
  0%,100% { transform: translateY(0px); }
  50%     { transform: translateY(-6px); }
}
`;

interface Star { x: number; y: number; r: number; delay: number; dur: number; }
const STARS: Star[] = Array.from({ length: 80 }, (_, i) => ({
  x:     (i * 137.508) % 100,
  y:     (i * 97.333)  % 100,
  r:     0.5 + (i % 5) * 0.28,
  delay: (i * 0.43)    % 7,
  dur:   2 + (i % 6)   * 0.5,
}));

const LandingBackground = () => (
  <>
    <style>{BG_STYLE}</style>
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 베이스 */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 130% 90% at 50% -5%, #0d1224 0%, #080b12 45%, #050709 100%)',
      }} />
      {/* 도트 그리드 */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)',
        backgroundSize: '38px 38px',
        opacity: 0.09,
      }} />
      {/* 퍼플 메인 오브 */}
      <div className="absolute rounded-full" style={{
        top: -200, left: '50%', width: 800, height: 800,
        background: 'radial-gradient(circle at 50% 40%, rgba(124,58,237,0.40) 0%, rgba(79,70,229,0.22) 35%, transparent 68%)',
        filter: 'blur(50px)',
        animation: 'orb-a 16s ease-in-out infinite',
      }} />
      {/* 블루/시안 */}
      <div className="absolute rounded-full" style={{
        top: '8%', left: '-10%', width: 640, height: 640,
        background: 'radial-gradient(circle at 65% 40%, rgba(56,189,248,0.36) 0%, rgba(14,165,233,0.16) 40%, transparent 68%)',
        filter: 'blur(55px)',
        animation: 'orb-b 20s ease-in-out infinite',
      }} />
      {/* 핑크/바이올렛 */}
      <div className="absolute rounded-full" style={{
        bottom: '-12%', right: '-10%', width: 620, height: 620,
        background: 'radial-gradient(circle at 40% 50%, rgba(236,72,153,0.30) 0%, rgba(168,85,247,0.16) 40%, transparent 68%)',
        filter: 'blur(58px)',
        animation: 'orb-b 24s ease-in-out infinite reverse',
      }} />
      {/* 에메랄드 */}
      <div className="absolute rounded-full" style={{
        top: '35%', right: '0%', width: 450, height: 450,
        background: 'radial-gradient(circle, rgba(16,185,129,0.30) 0%, rgba(5,150,105,0.12) 45%, transparent 68%)',
        filter: 'blur(48px)',
        animation: 'orb-c 17s ease-in-out infinite',
      }} />
      {/* 딥 바이올렛 */}
      <div className="absolute rounded-full" style={{
        top: '65%', left: '22%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(139,92,246,0.26) 0%, rgba(109,40,217,0.10) 45%, transparent 68%)',
        filter: 'blur(52px)',
        animation: 'orb-c 19s ease-in-out infinite reverse',
      }} />
      {/* 오로라 라인 */}
      <div className="absolute" style={{
        top: '20%', left: '-5%', right: '-5%', height: 2,
        background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0) 5%, rgba(139,92,246,0.36) 25%, rgba(56,189,248,0.42) 50%, rgba(16,185,129,0.30) 75%, rgba(99,102,241,0) 95%, transparent 100%)',
        filter: 'blur(2px)',
        animation: 'aurora-shift 12s ease-in-out infinite',
      }} />
      <div className="absolute" style={{
        top: '21%', left: '-5%', right: '-5%', height: 48,
        background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.07) 25%, rgba(56,189,248,0.09) 50%, rgba(16,185,129,0.06) 75%, transparent)',
        filter: 'blur(14px)',
        animation: 'aurora-shift 12s ease-in-out infinite',
      }} />
      {/* 별빛 */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {STARS.map((s, i) => (
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white"
            style={{ animation: `star-twinkle ${s.dur}s ease-in-out infinite`, animationDelay: `${s.delay}s` }} />
        ))}
      </svg>
      {/* 하단 비네트 */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 100% 45% at 50% 100%, rgba(0,0,0,0.65) 0%, transparent 58%)',
      }} />
    </div>
  </>
);

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
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/15',
    dotColor: 'bg-violet-400',
    glowColor: 'rgba(124,58,237,0.12)',
    visualGradient: 'linear-gradient(135deg, rgba(124,58,237,0.32) 0%, rgba(59,130,246,0.22) 100%)',
    visualTag: 'TODAY FLOW',
    title: '오늘 분량만, 가장 짧은 동선으로',
    desc: '해야 할 학습만 자동으로 정리해 집중이 끊기지 않습니다.',
    points: ['오늘 학습 자동 구성', '복습 우선순위 정렬', '학습 기록 즉시 반영'],
  },
  {
    eyebrow: 'SMART REVIEW',
    icon: Brain,
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-500/15',
    dotColor: 'bg-sky-400',
    glowColor: 'rgba(56,189,248,0.12)',
    visualGradient: 'linear-gradient(135deg, rgba(56,189,248,0.30) 0%, rgba(99,102,241,0.20) 100%)',
    visualTag: 'SMART REVIEW',
    title: '기억이 흐려질 때 정확히 다시',
    desc: '정답률과 복습 시점을 기반으로 개인 맞춤 복습을 제공합니다.',
    points: ['오답 중심 리마인드', '난이도 기반 반복', '진도·정확도 동시 추적'],
  },
  {
    eyebrow: 'RESULTS',
    icon: BarChart3,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15',
    dotColor: 'bg-emerald-400',
    glowColor: 'rgba(16,185,129,0.12)',
    visualGradient: 'linear-gradient(135deg, rgba(16,185,129,0.28) 0%, rgba(59,130,246,0.18) 100%)',
    visualTag: 'RESULT SNAPSHOT',
    title: '실력은 숫자로, 변화는 체감으로',
    desc: '학습량보다 중요한 건 유지율. 핵심 지표로 성장을 확인하세요.',
    points: ['일/주간 성과 지표', '누적 학습 히스토리', '실전 대비 모드 연계'],
  },
];

const STATS = [
  { value: '4,800+', label: '총 단어 수' },
  { value: '3가지', label: '학습 모드' },
  { value: '10단계', label: '레벨 시스템' },
];

const SectionDivider = () => (
  <div className="my-14 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
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
  const ActiveIcon = activeFeature.icon;

  const reveal = (id: string) => {
    if (reduceMotion) return '';
    return visibleMap[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-white">

      {/* 스크롤 진행 바 */}
      <div className="fixed left-0 top-0 z-50 h-[2px] w-full bg-white/5">
        <div
          className="h-full transition-[width] duration-100"
          style={{
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #7c3aed, #38bdf8, #10b981)',
          }}
        />
      </div>

      <LandingBackground />

      {/* ── NAVBAR ── */}
      <nav className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-6 py-4 sm:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-500/10">
            <BookOpen size={16} className="text-violet-400" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">Etyvoca</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onStartLogin}
            className="h-8 rounded-md px-4 text-xs font-medium text-white/60 transition hover:text-white"
          >
            로그인
          </button>
          <button
            onClick={onStartSignup}
            className="h-8 rounded-md px-4 text-xs font-semibold text-white transition hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
              boxShadow: '0 0 10px rgba(124,58,237,0.22)',
            }}
          >
            시작하기
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-5 pb-32 pt-28 sm:px-8">

        {/* ── HERO ── */}
        <section
          data-reveal-id="hero"
          className={`transition-all duration-700 ${reveal('hero')}`}
        >
          {/* 뱃지 */}
          <div
            className="mb-7 inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-semibold"
            style={{
              background: 'rgba(139,92,246,0.10)',
              color: '#c4b5fd',
              animation: reduceMotion ? 'none' : 'badge-pulse 3s ease-in-out infinite',
            }}
          >
            <Sparkles size={13} className="text-violet-400" />
            AI-POWERED ENGLISH VOCABULARY
            <span className="ml-0.5 rounded-sm bg-violet-500/25 px-1.5 py-0.5 text-[10px] font-bold text-violet-300">
              NEW
            </span>
          </div>

          {/* 메인 타이틀 */}
          <h1 className="max-w-4xl text-[2.6rem] font-bold leading-[1.15] tracking-tight sm:text-[4rem]">
            단어 학습을<br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%)' }}
            >
              더 단순하고, 더 강력하게.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400">
            복잡한 설정 없이 바로 시작하고, 매일의 작은 학습을
            <br className="hidden sm:block" />
            확실한 실력으로 연결합니다.
          </p>

          {/* CTA 버튼 */}
          <div className="mt-9 flex flex-wrap gap-3">
            <button
              onClick={onStartSignup}
              className="group inline-flex h-12 items-center gap-2 rounded-lg px-7 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 60%, #2563eb 100%)',
                boxShadow: '0 0 12px rgba(124,58,237,0.25), 0 2px 8px rgba(0,0,0,0.28)',
              }}
            >
              무료로 시작하기
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={onStartLogin}
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-white/7 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/12"
            >
              로그인
            </button>
          </div>

          {/* 신뢰 지표 */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-white">{s.value}</span>
                <span className="text-xs text-slate-500">{s.label}</span>
              </div>
            ))}
            <div className="hidden h-3 w-px bg-white/10 sm:block" />
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <CheckCircle2 size={12} className="text-emerald-500" />
              가입 즉시 이용 가능
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── FEATURES ── */}
        <section ref={featureSectionRef} className="mt-28 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">

          {/* 왼쪽 sticky 패널 */}
          <div className="lg:sticky lg:top-24 lg:h-[72vh]">
            <div
              data-reveal-id="preview"
              className={`relative h-full overflow-hidden rounded-xl bg-white/[0.03] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.36)] backdrop-blur-xl transition-all duration-700 ${reveal('preview')}`}
              style={{ animation: reduceMotion ? 'none' : 'float-card 6s ease-in-out infinite' }}
            >
              {/* 상단 글로우 */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20" style={{
                background: `linear-gradient(180deg, ${activeFeature.glowColor} 0%, transparent 100%)`,
              }} />

              <div className="relative">
                <div className="mb-5 overflow-hidden rounded-lg bg-black/25">
                  <div className="relative aspect-[16/9]">
                    <div
                      className="absolute inset-0 transition-all duration-500"
                      style={{ background: activeFeature.visualGradient }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16)_0%,transparent_45%)]" />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />
                    <div className="absolute left-3 top-3 rounded-sm border border-white/20 bg-black/35 px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-white/70">
                      {activeFeature.visualTag}
                    </div>
                    <div className="absolute bottom-3 left-3 text-xs font-medium text-white/90">학습 화면 미리보기</div>
                  </div>
                </div>

                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${activeFeature.iconBg} transition-all duration-500`}>
                  <ActiveIcon size={18} className={`${activeFeature.iconColor} transition-all duration-500`} />
                </div>

                <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-white/35">
                  {activeFeature.eyebrow}
                </p>
                <h2 className="mt-3 text-2xl font-bold leading-snug text-white transition-all duration-500 sm:text-3xl">
                  {activeFeature.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-400 transition-all duration-500 sm:text-base">
                  {activeFeature.desc}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {activeFeature.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-3 text-sm text-slate-300">
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
                        i === activeIndex ? `w-6 ${f.dotColor}` : 'w-1.5 bg-white/15'
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
                  <div
                    className={`sticky top-24 cursor-pointer rounded-xl p-6 transition-all duration-300 sm:p-8 ${
                      isActive
                        ? 'bg-white/[0.07] shadow-[0_8px_30px_rgba(0,0,0,0.26)]'
                        : 'bg-white/[0.02] hover:bg-white/[0.035]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-semibold tracking-[0.18em] text-white/30">
                          {feature.eyebrow}
                        </p>
                        <h3 className="mt-3 text-xl font-bold leading-snug text-white sm:text-2xl">
                          {feature.title}
                        </h3>
                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500 sm:text-base">
                          {feature.desc}
                        </p>
                      </div>
                      <div className={`ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                        isActive ? feature.iconBg : 'bg-white/5'
                      }`}>
                        <Icon size={18} className={`transition-all duration-300 ${isActive ? feature.iconColor : 'text-white/25'}`} />
                      </div>
                    </div>

                    {isActive && (
                      <>
                        <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
                        <ul className="mt-4 space-y-2">
                          {feature.points.map((pt) => (
                            <li key={pt} className="flex items-center gap-3 text-sm text-slate-400">
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
          className={`mt-28 transition-all duration-700 ${reveal('why')}`}
        >
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-violet-400">WHY ETYVOCA</p>
            <h2 className="text-2xl font-bold sm:text-3xl">단순한 단어장과의 차이</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                  className="rounded-xl bg-white/[0.03] p-6 backdrop-blur-sm transition-all hover:bg-white/[0.05]"
                >
                  <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${item.bg}`}>
                    <Icon size={18} className={item.color} />
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <SectionDivider />

        {/* ── CTA 섹션 ── */}
        <section
          data-reveal-id="cta"
          className={`relative mt-24 overflow-hidden rounded-xl transition-all duration-700 ${reveal('cta')}`}
          style={{
            background: 'linear-gradient(135deg, rgba(13,18,36,0.96) 0%, rgba(8,11,18,0.98) 100%)',
          }}
        >
          <div
            className="relative rounded-xl p-8 sm:p-12"
            style={{ background: 'transparent' }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-violet-400">READY TO START</p>
                <h2 className="text-2xl font-bold leading-snug sm:text-4xl">
                  오늘부터,<br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa, #60a5fa)' }}
                  >
                    학습 루틴을 바꿔보세요.
                  </span>
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                  회원가입 후 바로 학습을 시작할 수 있습니다. 신용카드 없이 무료로 사용하세요.
                </p>
                <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-500">
                  {['무료 가입', '즉시 시작', '클라우드 저장'].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center gap-3">
                <button
                  onClick={onStartSignup}
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 60%, #2563eb 100%)',
                    boxShadow: '0 0 12px rgba(124,58,237,0.24)',
                  }}
                >
                  무료 회원가입
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={onStartLogin}
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-white/8 px-6 text-sm font-medium text-white/75 backdrop-blur-sm transition hover:bg-white/14 hover:text-white"
                >
                  이미 계정이 있어요
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md border border-violet-500/30 bg-violet-500/10">
              <BookOpen size={12} className="text-violet-400" />
            </div>
            <span className="text-xs font-semibold text-white/40">Etyvoca</span>
          </div>
          <p className="text-xs text-white/20">© 2026 Etyvoca. All rights reserved.</p>
        </div>
      </footer>

      {/* ── 플로팅 CTA ── */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
        <button
          onClick={onStartSignup}
          className="pointer-events-auto inline-flex h-11 items-center gap-2 rounded-lg px-6 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.92) 0%, rgba(79,70,229,0.92) 100%)',
            boxShadow: '0 6px 18px rgba(124,58,237,0.28), 0 2px 8px rgba(0,0,0,0.35)',
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
