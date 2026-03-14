import { useCallback, useEffect, useRef, useState } from 'react';
import { addXP, getProfileXP } from '../lib/userDb';
import { getXPProgress, type XPProgress } from '../lib/xpSystem';
import type { XPReason } from '../lib/xpSystem';

interface LevelUpNotification {
  level: number;
  title: string;
}

interface UseUserLevelReturn {
  totalXP: number;
  currentLevel: number;
  streakDays: number;
  xpProgress: XPProgress;
  levelUpInfo: LevelUpNotification | null;
  clearLevelUp: () => void;
  giveXP: (amount: number, reason: XPReason, wordId?: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useUserLevel = (): UseUserLevelReturn => {
  const [totalXP, setTotalXP]         = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [streakDays, setStreakDays]    = useState(0);
  const [levelUpInfo, setLevelUpInfo] = useState<LevelUpNotification | null>(null);

  const prevLevelRef = useRef<number>(1);

  const refresh = useCallback(async () => {
    const data = await getProfileXP();
    if (!data) return;

    setTotalXP(data.total_xp ?? 0);
    setStreakDays(data.streak_days ?? 0);

    const newLevel = data.current_level ?? 1;
    if (newLevel > prevLevelRef.current) {
      // 레벨업 감지 → 알림 발동
      const { getLevelFromXP } = await import('../lib/xpSystem');
      const info = getLevelFromXP(data.total_xp ?? 0);
      setLevelUpInfo({ level: newLevel, title: info.title });
    }
    prevLevelRef.current = newLevel;
    setCurrentLevel(newLevel);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const giveXP = useCallback(
    async (amount: number, reason: XPReason, wordId?: string) => {
      const result = await addXP(amount, reason, wordId);
      if (!result) return;

      const newLevel = result.current_level ?? 1;
      if (newLevel > prevLevelRef.current) {
        const { getLevelFromXP } = await import('../lib/xpSystem');
        const info = getLevelFromXP(result.total_xp ?? 0);
        setLevelUpInfo({ level: newLevel, title: info.title });
      }
      prevLevelRef.current = newLevel;

      setTotalXP(result.total_xp ?? 0);
      setCurrentLevel(result.current_level ?? 1);
      setStreakDays(result.streak_days ?? 0);
    },
    []
  );

  const clearLevelUp = useCallback(() => setLevelUpInfo(null), []);

  return {
    totalXP,
    currentLevel,
    streakDays,
    xpProgress: getXPProgress(totalXP),
    levelUpInfo,
    clearLevelUp,
    giveXP,
    refresh,
  };
};
