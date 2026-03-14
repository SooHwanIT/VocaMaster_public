// ── XP / 레벨 시스템 코어 유틸리티 ──────────────────────────────

export interface LevelInfo {
  level: number;
  required_xp: number;
  title: string;
}

export const LEVEL_TABLE: LevelInfo[] = [
  { level: 1,  required_xp: 0,    title: '입문자' },
  { level: 2,  required_xp: 100,  title: '초보자' },
  { level: 3,  required_xp: 250,  title: '학습자' },
  { level: 4,  required_xp: 500,  title: '중급자' },
  { level: 5,  required_xp: 900,  title: '고급자' },
  { level: 6,  required_xp: 1400, title: '숙련자' },
  { level: 7,  required_xp: 2000, title: '전문가' },
  { level: 8,  required_xp: 2800, title: '마스터' },
  { level: 9,  required_xp: 3700, title: '그랜드마스터' },
  { level: 10, required_xp: 4800, title: '어휘왕 👑' },
];

// XP 보상 테이블
export const XP_REWARDS = {
  WORD_CORRECT:  5,   // 정답 처리
  WORD_MASTERED: 20,  // 단어 마스터 (추가 보너스)
} as const;

export type XPReason = 'word_correct' | 'word_mastered';

/** totalXP 로 현재 레벨 정보를 반환 */
export const getLevelFromXP = (totalXP: number): LevelInfo => {
  let result = LEVEL_TABLE[0];
  for (const info of LEVEL_TABLE) {
    if (totalXP >= info.required_xp) result = info;
    else break;
  }
  return result;
};

/** 다음 레벨 정보 반환 (최고 레벨이면 null) */
export const getNextLevel = (currentLevel: number): LevelInfo | null => {
  return LEVEL_TABLE.find((l) => l.level === currentLevel + 1) ?? null;
};

export interface XPProgress {
  current: LevelInfo;
  next: LevelInfo | null;
  /** 현재 레벨 구간 내 진행률 (0-100) */
  percent: number;
  /** 현재 레벨 시작 이후 축적된 XP */
  xpInLevel: number;
  /** 현재 → 다음 레벨까지 필요한 총 XP */
  xpNeeded: number;
}

/** totalXP 기준으로 레벨 진행 상황 계산 */
export const getXPProgress = (totalXP: number): XPProgress => {
  const current = getLevelFromXP(totalXP);
  const next = getNextLevel(current.level);

  if (!next) {
    return { current, next: null, percent: 100, xpInLevel: 0, xpNeeded: 0 };
  }

  const xpInLevel = totalXP - current.required_xp;
  const xpNeeded  = next.required_xp - current.required_xp;
  const percent   = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  return { current, next, percent, xpInLevel, xpNeeded };
};
