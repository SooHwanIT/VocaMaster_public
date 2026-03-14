/**
 * Security & Data Validation Utilities
 * 입력값 검증 및 타입 안전성을 위한 유틸리티 함수들
 */

// ── Nickname & Bio Validation ──
export const validateNickname = (nickname: string): string => {
  if (!nickname || typeof nickname !== 'string') {
    throw new Error('닉네임은 필수입니다.');
  }
  const trimmed = nickname.trim();
  if (trimmed.length < 2) {
    throw new Error('닉네임은 최소 2글자 이상이어야 합니다.');
  }
  if (trimmed.length > 50) {
    throw new Error('닉네임은 50글자 이하여야 합니다.');
  }
  return trimmed;
};

export const validateBio = (bio?: string): string | undefined => {
  if (!bio) return undefined;
  if (typeof bio !== 'string') {
    throw new Error('자기소개는 텍스트여야 합니다.');
  }
  const trimmed = bio.trim();
  if (trimmed.length > 500) {
    throw new Error('자기소개는 500글자 이하여야 합니다.');
  }
  return trimmed || undefined;
};

// ── Word ID Validation ──
export const validateWordId = (wordId: string): string => {
  if (!wordId || typeof wordId !== 'string') {
    throw new Error('유효하지 않은 단어 ID입니다.');
  }
  const trimmed = wordId.trim();
  if (trimmed.length === 0) {
    throw new Error('단어 ID는 비워질 수 없습니다.');
  }
  if (trimmed.length > 100) {
    throw new Error('단어 ID는 100글자 이하여야 합니다.');
  }
  return trimmed;
};

// ── XP Validation ──
export const validateXPAmount = (xp: number, reason: string): number => {
  if (!Number.isInteger(xp) || xp < 0) {
    throw new Error('XP는 0 이상의 정수여야 합니다.');
  }
  // XP 양에 대한 합리성 검증 (이상치 탐지)
  const MAX_XP_PER_REASON = {
    'word_correct': 50,      // 최대 50
    'word_mastered': 100,    // 최대 100
  };
  const maxAllowed = (MAX_XP_PER_REASON as Record<string, number>)[reason] || 0;
  if (xp > maxAllowed) {
    console.warn(`[Security] Suspicious XP amount: ${xp} for reason: ${reason}. Expected max: ${maxAllowed}`);
    // 실제로는 RPC에서 검증되지만, 클라이언트에서도 경고
    throw new Error(`${reason}에 대한 XP가 이상하게 높습니다.`);
  }
  return xp;
};

// ── Quiz Mode Validation ──
export const validateQuizMode = (mode: string): 'CHOICE' | 'WRITE' | 'TEST' => {
  const validModes = ['CHOICE', 'WRITE', 'TEST'];
  if (!validModes.includes(mode)) {
    throw new Error('유효하지 않은 퀴즈 모드입니다.');
  }
  return mode as 'CHOICE' | 'WRITE' | 'TEST';
};

// ── Word Attempt Log Validation ──
export const validateWordAttempt = (
  wordId: string, 
  dataSetId: string, 
  mode: string
): { wordId: string; dataSetId: string; mode: 'CHOICE' | 'WRITE' | 'TEST' } => {
  const validatedWordId = validateWordId(wordId);
  const validatedDataSetId = validateWordId(dataSetId); // reuse same validation
  const validatedMode = validateQuizMode(mode);
  
  return {
    wordId: validatedWordId,
    dataSetId: validatedDataSetId,
    mode: validatedMode,
  };
};

// ── Email Validation ──
export const validateEmail = (email: string): string => {
  if (!email || typeof email !== 'string') {
    throw new Error('이메일은 필수입니다.');
  }
  const trimmed = email.trim().toLowerCase();
  // Simple email validation regex (not overly strict)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    throw new Error('유효한 이메일 주소를 입력하세요.');
  }
  if (trimmed.length > 254) {
    throw new Error('이메일이 너무 깁니다.');
  }
  return trimmed;
};

// ── Password Validation ──
export const validatePassword = (password: string): string => {
  if (!password || typeof password !== 'string') {
    throw new Error('비밀번호는 필수입니다.');
  }
  if (password.length < 8) {
    throw new Error('비밀번호는 최소 8글자 이상이어야 합니다.');
  }
  if (password.length > 128) {
    throw new Error('비밀번호는 128글자 이하여야 합니다.');
  }
  // Check for strong password: letter + number
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  if (!hasLetter || !hasNumber) {
    throw new Error('비밀번호는 영문과 숫자를 각각 1개 이상 포함해야 합니다.');
  }
  return password;
};

export const validateSignInPassword = (password: string): string => {
  if (!password || typeof password !== 'string') {
    throw new Error('비밀번호를 입력해 주세요.');
  }
  if (password.length > 128) {
    throw new Error('비밀번호 형식이 올바르지 않습니다.');
  }
  return password;
};

// ── RPC Response Validation ──
export interface ValidatedWrongWordStat {
  wordId: string;
  dataSetId: string;
  wrongCount: number;
  correctCount: number;
  accuracy: number;
  lastAttemptAt: number;
}

export const validateWrongWordStatRow = (row: any): ValidatedWrongWordStat | null => {
  try {
    if (!row || typeof row !== 'object') return null;
    
    const wordId = String(row.word_id ?? '').trim();
    const dataSetId = String(row.dataset_id ?? '').trim();
    
    if (!wordId || !dataSetId) return null;
    
    const wrongCount = Math.max(0, Number(row.wrong_count ?? 0));
    const correctCount = Math.max(0, Number(row.correct_count ?? 0));
    const accuracy = Math.min(100, Math.max(0, Number(row.accuracy_pct ?? 0)));
    
    const lastAttemptAtDate = new Date(row.last_attempted_at);
    if (isNaN(lastAttemptAtDate.getTime())) return null;
    
    return {
      wordId,
      dataSetId,
      wrongCount,
      correctCount,
      accuracy,
      lastAttemptAt: lastAttemptAtDate.getTime(),
    };
  } catch {
    return null;
  }
};

// ── Boolean Validation ──
export const validateBoolean = (value: any): boolean => {
  return Boolean(value);
};

// ── Environment/Security Helpers ──
/**
 * Check if code is running in development mode for secure logging
 */
export const isDevelopmentMode = (): boolean => {
  return import.meta.env.DEV;
};

/**
 * Secure console logging - only logs in development
 */
export const secureLog = (category: string, message: string, data?: unknown): void => {
  if (import.meta.env.DEV) {
    console.log(`[${category}] ${message}`, data);
  }
};

/**
 * Secure error logging - only logs in development
 */
export const secureError = (category: string, message: string, error?: unknown): void => {
  if (import.meta.env.DEV) {
    console.error(`[${category}] ${message}`, error);
  }
};

// ── Array Validation ──
export const validateIsArray = (value: any): boolean => {
  return Array.isArray(value);
};
