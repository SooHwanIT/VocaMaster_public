import { supabase } from './supabase';
import { validateEmail, validatePassword, validateSignInPassword } from './validation';

type AuthAction = 'SESSION' | 'SIGN_IN' | 'SIGN_UP' | 'SIGN_OUT' | 'RESET_PASSWORD';

const isNetworkError = (message: string) => {
  const lowered = message.toLowerCase();
  return (
    lowered.includes('failed to fetch') ||
    lowered.includes('network') ||
    lowered.includes('timeout') ||
    lowered.includes('fetch')
  );
};

const mapAuthErrorMessage = (action: AuthAction, rawMessage?: string) => {
  const message = (rawMessage ?? '').toLowerCase();

  if (isNetworkError(message)) {
    return '네트워크 연결이 불안정합니다. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.';
  }

  if (action === 'SIGN_IN') {
    if (message.includes('invalid login credentials') || message.includes('email not confirmed')) {
      return '이메일 또는 비밀번호가 올바르지 않거나 인증이 완료되지 않았습니다.';
    }
    if (message.includes('too many requests') || message.includes('rate limit')) {
      return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.';
    }
    return '로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  }

  if (action === 'SIGN_UP') {
    if (message.includes('already registered') || message.includes('already exists')) {
      return '이미 가입된 이메일입니다. 로그인하거나 비밀번호 재설정을 이용해 주세요.';
    }
    if (message.includes('too many requests') || message.includes('rate limit')) {
      return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.';
    }
    return '회원가입 중 문제가 발생했습니다. 입력값을 확인하고 다시 시도해 주세요.';
  }

  if (action === 'RESET_PASSWORD') {
    if (message.includes('too many requests') || message.includes('rate limit')) {
      return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.';
    }
    return '비밀번호 재설정 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.';
  }

  if (action === 'SESSION') {
    return '세션 확인 중 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요.';
  }

  return '인증 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';
};

export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined;
    throw new Error(mapAuthErrorMessage('SESSION', message));
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const validatedEmail = validateEmail(email);
    const validatedPassword = validateSignInPassword(password);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedEmail,
      password: validatedPassword,
    });
    if (error) throw error;
    return data.user;
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined;
    throw new Error(mapAuthErrorMessage('SIGN_IN', message));
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const validatedEmail = validateEmail(email);
    const validatedPassword = validatePassword(password);

    const { data, error } = await supabase.auth.signUp({
      email: validatedEmail,
      password: validatedPassword,
    });
    if (error) throw error;
    return data.user;
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined;
    throw new Error(mapAuthErrorMessage('SIGN_UP', message));
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch {
    throw new Error('로그아웃 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const validatedEmail = validateEmail(email);
    const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(validatedEmail, {
      redirectTo,
    });
    if (error) throw error;
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined;
    throw new Error(mapAuthErrorMessage('RESET_PASSWORD', message));
  }
};
