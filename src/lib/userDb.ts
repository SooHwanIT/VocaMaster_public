import { supabase } from './supabase';
import type { XPReason } from './xpSystem';
import { validateNickname, validateBio, validateWordId, validateXPAmount, validateEmail, validatePassword } from './validation';

export interface ProfileRow {
  id: string;
  nickname: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
  total_xp: number;
  current_level: number;
  streak_days: number;
  last_study_date: string | null;
}

export interface AddXPResult {
  total_xp: number;
  current_level: number;
  streak_days: number;
}

export interface UserProgressRow {
  id: number;
  user_id: string;
  word_id: string;
  is_mastered: boolean;
  last_reviewed_at: string | null;
  created_at: string;
}

export interface WordBookmarkRow {
  id: number;
  user_id: string;
  word_id: string;
  created_at: string;
}

export const getCurrentUser = async () => {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;

  const user = authData.user;
  if (!user) throw new Error('로그인 사용자를 찾을 수 없습니다.');
  return user;
};

export const getMyProfile = async () => {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data as ProfileRow | null;
};



export const upsertProfile = async (nickname: string, bio?: string) => {
  const user = await getCurrentUser();

  // Validate inputs
  const validatedNickname = validateNickname(nickname);
  const validatedBio = validateBio(bio);

  const payload: { id: string; nickname: string; bio?: string } = {
    id: user.id,
    nickname: validatedNickname,
  };

  if (typeof validatedBio === 'string') {
    payload.bio = validatedBio;
  }

  const { error } = await supabase.from('profiles').upsert(payload);
  if (error) throw error;
};

export const getUserProgress = async () => {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  const userId = authData.user?.id;
  if (!userId) throw new Error('로그인 사용자를 찾을 수 없습니다.');

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as UserProgressRow[];
};



export const upsertWordProgress = async (wordId: string, isMastered: boolean) => {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;

  const userId = authData.user?.id;
  if (!userId) throw new Error('로그인 사용자를 찾을 수 없습니다.');

  // Validate wordId
  const validatedWordId = validateWordId(wordId);

  const { error } = await supabase.from('user_progress').upsert(
    {
      user_id: userId,
      word_id: validatedWordId,
      is_mastered: Boolean(isMastered),
      last_reviewed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,word_id' }
  );

  if (error) throw error;
};

export const getBookmarks = async () => {
  const { data, error } = await supabase
    .from('word_bookmarks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as WordBookmarkRow[];
};

export const toggleBookmark = async (wordId: string) => {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;

  const userId = authData.user?.id;
  if (!userId) throw new Error('로그인 사용자를 찾을 수 없습니다.');

  const { data: found, error: selectError } = await supabase
    .from('word_bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('word_id', wordId)
    .maybeSingle();

  if (selectError) throw selectError;

  if (found?.id) {
    const { error: deleteError } = await supabase.from('word_bookmarks').delete().eq('id', found.id);
    if (deleteError) throw deleteError;
    return false;
  }

  const { error: insertError } = await supabase.from('word_bookmarks').insert({
    user_id: userId,
    word_id: wordId,
  });
  if (insertError) throw insertError;
  return true;
};

export const removeBookmark = async (wordId: string) => {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;

  const userId = authData.user?.id;
  if (!userId) throw new Error('로그인 사용자를 찾을 수 없습니다.');

  const { error } = await supabase
    .from('word_bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('word_id', wordId);

  if (error) throw error;
};

// ── XP / 레벨 시스템 ─────────────────────────────────────────

/**
 * Supabase RPC `add_xp` 를 호출하여 현재 로그인된 유저에게 XP를 부여합니다.
 * DB 함수가 streak, 레벨 재계산을 처리하므로 프론트엔드 계산 불필요.
 * 
 * Security: 
 * - Client-side XP amount validation (합리성 검증)
 * - Server-side RPC에서 최종 검증 (중요!)
 */
export const addXP = async (
  xp: number,
  reason: XPReason,
  wordId?: string
): Promise<AddXPResult | null> => {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return null;

  try {
    // Validate XP amount on client side (security check)
    const validatedXP = validateXPAmount(xp, reason);
    
    // Validate wordId if provided
    let validatedWordId = wordId;
    if (wordId && typeof wordId === 'string') {
      validatedWordId = validateWordId(wordId);
    } else {
      validatedWordId = null;
    }

    const { data, error } = await supabase.rpc('add_xp', {
      p_user_id: authData.user.id,
      p_xp: validatedXP,
      p_reason: reason,
      p_word_id: validatedWordId,
    });

    if (error) {
      console.error('[addXP] RPC error:', error.message);
      return null;
    }

    return data as AddXPResult;
  } catch (error) {
    console.error('[addXP] Validation error:', error);
    return null;
  }
};

/** profiles 테이블에서 XP/레벨 정보만 빠르게 조회 */
export const getProfileXP = async (): Promise<Pick<ProfileRow, 'total_xp' | 'current_level' | 'streak_days'> | null> => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('total_xp, current_level, streak_days')
    .eq('id', authData.user.id)
    .maybeSingle();

  if (error) return null;
  return data as Pick<ProfileRow, 'total_xp' | 'current_level' | 'streak_days'> | null;
};
