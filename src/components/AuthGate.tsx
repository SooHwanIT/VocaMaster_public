import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, BookOpen, Loader2, Mail } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { getSession, requestPasswordReset, signIn, signUp } from '../lib/auth';
import { initializeLocalFirstSync } from '../db';
import { migrateDexieToSupabase } from '../lib/migration';
import { supabase } from '../lib/supabase';
import { getCurrentUser, getMyProfile, upsertProfile } from '../lib/userDb';
import LandingPage from './LandingPage';
import { TransitionPlaceholder } from './TransitionUI';

type AuthMode = 'SIGN_IN' | 'SIGN_UP';
type AuthRoute = 'LANDING' | 'AUTH';
type AuthStage = 'FORM' | 'VERIFY_WAIT';

const isStrongPassword = (value: string) => {
  if (value.length < 8) return false;
  const hasLetter = /[A-Za-z]/.test(value);
  const hasNumber = /\d/.test(value);
  return hasLetter && hasNumber;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message?.trim()) {
    return error.message;
  }
  return fallback;
};

const parseAuthModeFromLocation = (): AuthMode => {
  if (typeof window === 'undefined') return 'SIGN_IN';

  const path = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const modeParam = params.get('authMode') ?? params.get('mode');

  if (path === '/signup' || modeParam === 'signup') return 'SIGN_UP';
  return 'SIGN_IN';
};

const parseAuthRouteFromLocation = (): AuthRoute => {
  if (typeof window === 'undefined') return 'LANDING';

  const path = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const hasAuthMode = params.has('authMode') || params.get('mode') === 'signup' || params.get('mode') === 'signin';
  if (hasAuthMode) return 'AUTH';
  if (path === '/auth' || path === '/login' || path === '/signup') return 'AUTH';
  return 'LANDING';
};

interface AuthGateProps {
  children: React.ReactNode;
}

const AuthGate = ({ children }: AuthGateProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authStage, setAuthStage] = useState<AuthStage>('FORM');
  const [mode, setMode] = useState<AuthMode>(() => parseAuthModeFromLocation());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pendingSignupEmail, setPendingSignupEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [authRoute, setAuthRoute] = useState<AuthRoute>(() => parseAuthRouteFromLocation());
  const [requiresProfileSetup, setRequiresProfileSetup] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('setup') === 'profile';
  });
  const [profileSetupLoading, setProfileSetupLoading] = useState(false);
  const [profileSetupNickname, setProfileSetupNickname] = useState('');
  const [profileSetupBio, setProfileSetupBio] = useState('');
  const [profileSetupError, setProfileSetupError] = useState('');

  useEffect(() => {
    let mounted = true;
    getSession()
      .then((currentSession) => {
        if (mounted) setSession(currentSession);
      })
      .catch((error) => {
        if (!mounted) return;
        setErrorMessage(getErrorMessage(error, '세션 확인 중 문제가 발생했습니다.'));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      // 이메일 인증 링크 클릭으로 SIGNED_IN된 경우 프로필 설정 화면으로
      if (event === 'SIGNED_IN' && typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('setup') === 'profile') {
          setRequiresProfileSetup(true);
          window.history.replaceState({}, '', '/');
        }
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const submitLabel = useMemo(() => (mode === 'SIGN_IN' ? '로그인' : '회원가입'), [mode]);

  const goToAuth = (nextMode: AuthMode) => {
    setMode(nextMode);
    setAuthRoute('AUTH');
    setAuthStage('FORM');
    setErrorMessage('');
    setInfoMessage('');
    if (typeof window !== 'undefined') {
      const target = `/?authMode=${nextMode === 'SIGN_UP' ? 'signup' : 'signin'}`;
      window.history.pushState({}, '', target);
    }
  };

  const goToLanding = () => {
    setAuthRoute('LANDING');
    setAuthStage('FORM');
    setErrorMessage('');
    setInfoMessage('');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
  };

  const changeAuthMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setAuthStage('FORM');
    setErrorMessage('');
    setInfoMessage('');
    if (typeof window !== 'undefined' && parseAuthRouteFromLocation() === 'AUTH') {
      const target = `/?authMode=${nextMode === 'SIGN_UP' ? 'signup' : 'signin'}`;
      window.history.replaceState({}, '', target);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setAuthRoute(parseAuthRouteFromLocation());
      setMode(parseAuthModeFromLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    setErrorMessage('');
    setInfoMessage('');
    setSubmitting(true);

    try {
      if (mode === 'SIGN_IN') {
        await signIn(email.trim(), password);
      } else {
        if (password !== confirmPassword) {
          throw new Error('비밀번호 확인이 일치하지 않습니다.');
        }
        if (!isStrongPassword(password)) {
          throw new Error('비밀번호는 8자 이상이며 영문과 숫자를 각각 1개 이상 포함해야 합니다.');
        }
        await signUp(email.trim(), password);
        setPendingSignupEmail(email.trim());
        setAuthStage('VERIFY_WAIT');
        setInfoMessage('회원가입이 완료되었습니다. 이메일 인증 후 계속 진행해 주세요.');
      }
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setErrorMessage(getErrorMessage(error, '인증 요청 중 오류가 발생했습니다.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (submitting) return;

    setErrorMessage('');
    setInfoMessage('');

    if (!email.trim()) {
      setErrorMessage('비밀번호 재설정을 위해 이메일을 먼저 입력해 주세요.');
      return;
    }

    setSubmitting(true);
    try {
      await requestPasswordReset(email.trim());
      setInfoMessage('비밀번호 재설정 링크를 이메일로 전송했습니다.');
    } catch (error) {
      setErrorMessage(getErrorMessage(error, '비밀번호 재설정 요청 중 오류가 발생했습니다.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerificationContinue = async () => {
    setErrorMessage('');
    setInfoMessage('');

    const targetEmail = (pendingSignupEmail || email).trim();

    if (!targetEmail || !password) {
      setErrorMessage('인증 확인을 위해 이메일과 비밀번호를 다시 입력해 주세요.');
      setAuthStage('FORM');
      setMode('SIGN_IN');
      return;
    }

    setSubmitting(true);
    try {
      await signIn(targetEmail, password);
      setInfoMessage('이메일 인증 확인 후 로그인되었습니다.');
      setAuthStage('FORM');
      setMode('SIGN_IN');
      setPendingSignupEmail('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setErrorMessage(getErrorMessage(error, '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.'));
      if (import.meta.env.DEV) {
        console.debug('[Auth] Verification failed:', error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleProfileSetupSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setProfileSetupError('');
    const nickname = profileSetupNickname.trim();
    if (!nickname) {
      setProfileSetupError('닉네임을 입력해 주세요.');
      return;
    }

    setProfileSetupLoading(true);
    try {
      await upsertProfile(nickname, profileSetupBio.trim());
      try { sessionStorage.setItem('vm_new_user_goto_profile', '1'); } catch { }
      setRequiresProfileSetup(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : '프로필 저장 중 오류가 발생했습니다.';
      setProfileSetupError(message);
    } finally {
      setProfileSetupLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;

    let cancelled = false;

    const runMigration = async () => {
      try {
        await migrateDexieToSupabase();
        await initializeLocalFirstSync();
        if (cancelled) return;
      } catch (error) {
        if (cancelled) return;
        if (import.meta.env.DEV) {
          console.error('Data migration failed:', error);
        }
      }
    };

    runMigration();
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id) {
      setRequiresProfileSetup(false);
      return;
    }

    let cancelled = false;

    const checkProfile = async () => {
      try {
        const [user, profile] = await Promise.all([getCurrentUser(), getMyProfile()]);
        if (cancelled) return;

        const hasNickname = Boolean(profile?.nickname && profile.nickname.trim());
        if (hasNickname) {
          setRequiresProfileSetup(false);
          return;
        }

        const fallbackNickname = user.email?.split('@')[0] ?? '';
        setProfileSetupNickname(fallbackNickname);
        setProfileSetupBio(profile?.bio ?? '');
        setRequiresProfileSetup(true);
      } catch {
      }
    };

    checkProfile();
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  useEffect(() => {
    if (!session || typeof window === 'undefined') return;

    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    if (path === '/auth' || path === '/login' || path === '/signup' || params.has('authMode')) {
      window.history.replaceState({}, '', '/');
    }
  }, [session]);

  useEffect(() => {
    if (session || typeof window === 'undefined') return;

    if (authRoute === 'LANDING') {
      const current = `${window.location.pathname}${window.location.search}`;
      if (current !== '/') {
        window.history.replaceState({}, '', '/');
      }
      return;
    }

    const desired = `/?authMode=${mode === 'SIGN_UP' ? 'signup' : 'signin'}`;
    const current = `${window.location.pathname}${window.location.search}`;
    if (current !== desired) {
      window.history.replaceState({}, '', desired);
    }
  }, [authRoute, mode, session]);

  if (loading) {
    return <TransitionPlaceholder fullScreen title="앱 환경을 준비하는 중이에요" variant="compact" />;
  }

  if (!session) {
    if (authRoute === 'LANDING') {
      return (
        <LandingPage
          onStartLogin={() => goToAuth('SIGN_IN')}
          onStartSignup={() => goToAuth('SIGN_UP')}
        />
      );
    }

    return (
      <div className="min-h-screen w-screen bg-slate-50 text-slate-900 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.06) 1px, transparent 1px)',
            backgroundSize: '38px 38px',
            opacity: 0.25,
          }} />
          <div className="absolute -left-[280px] top-[12%] h-[72vh] w-[560px]" style={{
            background: 'radial-gradient(closest-side, rgba(139,92,246,0.10) 0%, rgba(139,92,246,0.03) 36%, rgba(139,92,246,0) 78%)',
            filter: 'blur(32px)',
          }} />
          <div className="absolute -right-[280px] top-[18%] h-[68vh] w-[560px]" style={{
            background: 'radial-gradient(closest-side, rgba(56,189,248,0.10) 0%, rgba(56,189,248,0.03) 36%, rgba(56,189,248,0) 78%)',
            filter: 'blur(32px)',
          }} />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-3xl overflow-hidden bg-white/85 backdrop-blur-md shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
            <section className="hidden lg:flex flex-col justify-between p-10 bg-slate-900 text-white">
              <div>
                <div className="inline-flex items-center gap-2 h-8 px-3 rounded-full bg-white/10 text-white/85 text-xs font-semibold mb-6">
                  <BookOpen size={14} />
                  SECURE ACCOUNT
                </div>

                <h2 className="text-3xl font-semibold leading-tight mb-3 text-white">
                  학습 데이터를
                  <br />
                  안전하게 이어가세요
                </h2>
                <p className="text-sm text-white/75 leading-relaxed">
                  로그인하면 북마크, 진도, 학습 기록을 계속 이어서 볼 수 있습니다.
                </p>
              </div>

              <div className="space-y-2 text-sm text-white/75">
                <p>• 어디서든 이어서 학습</p>
                <p>• 나만의 학습 흐름 유지</p>
                <p>• 매일의 성장을 꾸준히 기록</p>
              </div>
            </section>

            <section className="p-5 sm:p-7 md:p-8 lg:p-10">
              <button
                onClick={goToLanding}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-5"
              >
                <ArrowLeft size={14} />
                랜딩으로 돌아가기
              </button>

              <div className="lg:hidden mb-5 p-4 rounded-xl bg-slate-100">
                <p className="text-sm font-semibold text-slate-900 mb-1">Etyvoca 계정</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  로그인하면 다음 접속에서도 바로 이어서 학습할 수 있습니다.
                </p>
              </div>

              {authStage === 'VERIFY_WAIT' ? (
                <div>
                  <h1 className="text-2xl font-semibold mb-1">이메일 인증을 기다리는 중</h1>
                  <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                    {pendingSignupEmail || email} 주소로 인증 메일을 보냈습니다. 메일에서 인증을 완료한 뒤 계속 진행해 주세요.
                  </p>

                  {errorMessage && (
                    <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                  {infoMessage && (
                    <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 mb-3">
                      {infoMessage}
                    </p>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={handleVerificationContinue}
                      disabled={submitting}
                      className="w-full h-11 rounded-xl bg-violet-600 text-white font-semibold disabled:opacity-60 flex items-center justify-center gap-2 hover:bg-violet-500"
                    >
                      {submitting && <Loader2 size={16} className="animate-spin" />}
                      {submitting ? '확인 중...' : '인증 완료 후 계속'}
                    </button>
                    <button
                      onClick={() => {
                        setAuthStage('FORM');
                        setMode('SIGN_IN');
                        setInfoMessage('로그인으로 전환했습니다. 인증 완료 후 로그인해 주세요.');
                      }}
                      className="w-full h-11 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                    >
                      로그인 화면으로 이동
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-semibold mb-1">{mode === 'SIGN_IN' ? '로그인' : '회원가입'}</h1>
                  <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                    {mode === 'SIGN_IN'
                      ? '계정으로 접속해 학습을 이어서 진행하세요.'
                      : '새 계정을 만들고 학습 데이터를 저장하세요.'}
                  </p>

                  <div className="flex mb-5 gap-2 p-1 bg-slate-100 rounded-xl">
                    <button
                      onClick={() => changeAuthMode('SIGN_IN')}
                      className={`flex-1 h-10 rounded-lg text-sm font-semibold transition-colors ${
                        mode === 'SIGN_IN'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-white/70'
                      }`}
                    >
                      로그인
                    </button>
                    <button
                      onClick={() => changeAuthMode('SIGN_UP')}
                      className={`flex-1 h-10 rounded-lg text-sm font-semibold transition-colors ${
                        mode === 'SIGN_UP'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-white/70'
                      }`}
                    >
                      회원가입
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">이메일</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="you@example.com"
                          className="vm-input pl-9 pr-3"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">비밀번호</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder={mode === 'SIGN_UP' ? '비밀번호 (8자 이상, 영문/숫자 포함)' : '비밀번호'}
                        className="vm-input"
                        minLength={mode === 'SIGN_UP' ? 8 : 1}
                        required
                      />
                      {mode === 'SIGN_UP' && (
                        <p className="mt-1.5 text-xs text-slate-500">8자 이상, 영문과 숫자를 각각 1개 이상 포함해 주세요.</p>
                      )}
                    </div>

                    {mode === 'SIGN_UP' && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">비밀번호 확인</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          placeholder="비밀번호를 다시 입력하세요"
                          className="vm-input"
                          minLength={8}
                          required
                        />
                      </div>
                    )}

                    {errorMessage && (
                      <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}
                    {infoMessage && (
                      <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                        {infoMessage}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-11 rounded-xl bg-violet-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-violet-500 disabled:opacity-60"
                    >
                      {submitting && <Loader2 size={16} className="animate-spin" />}
                      {submitting ? '처리 중...' : submitLabel}
                    </button>
                  </form>

                  {mode === 'SIGN_IN' && (
                    <button
                      onClick={handlePasswordReset}
                      className="w-full mt-3 text-xs font-semibold text-slate-500 hover:text-slate-900"
                    >
                      비밀번호를 잊으셨나요?
                    </button>
                  )}

                </>
              )}
            </section>
          </div>
        </div>
      </div>
    );
  }

  if (requiresProfileSetup) {
    return (
      <div className="min-h-screen w-screen bg-slate-50 text-slate-900 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.06) 1px, transparent 1px)',
            backgroundSize: '38px 38px',
            opacity: 0.25,
          }} />
          <div className="absolute -left-[260px] top-[14%] h-[70vh] w-[520px]" style={{
            background: 'radial-gradient(closest-side, rgba(139,92,246,0.10) 0%, rgba(139,92,246,0.03) 36%, rgba(139,92,246,0) 78%)',
            filter: 'blur(30px)',
          }} />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md rounded-3xl bg-white/88 backdrop-blur-md p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
            <h1 className="text-2xl font-semibold mb-1">프로필 설정</h1>
            <p className="text-sm text-slate-600 mb-5">마지막 단계입니다. 이름을 설정하면 바로 학습을 시작할 수 있어요.</p>

            <form onSubmit={handleProfileSetupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">닉네임</label>
                <input
                  type="text"
                  value={profileSetupNickname}
                  onChange={(event) => setProfileSetupNickname(event.target.value)}
                  placeholder="표시할 이름"
                  className="vm-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">한 줄 소개 (선택)</label>
                <textarea
                  value={profileSetupBio}
                  onChange={(event) => setProfileSetupBio(event.target.value)}
                  placeholder="예: 매일 20분씩 꾸준히 학습 중"
                  className="vm-textarea h-24"
                />
              </div>

              {profileSetupError && (
                <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{profileSetupError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={profileSetupLoading}
                className="w-full h-11 rounded-xl bg-violet-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-violet-500 disabled:opacity-60"
              >
                {profileSetupLoading && <Loader2 size={16} className="animate-spin" />}
                {profileSetupLoading ? '저장 중...' : '프로필 저장하고 시작하기'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGate;
