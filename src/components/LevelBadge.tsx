import React from 'react';
import { LEVEL_TABLE } from '../lib/xpSystem';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  className?: string;
}

/** 레벨별 배경 그라디언트 */
const levelColors: Record<number, string> = {
  1:  'from-slate-400 to-slate-500',
  2:  'from-green-400 to-emerald-500',
  3:  'from-teal-400 to-cyan-500',
  4:  'from-blue-400 to-indigo-500',
  5:  'from-violet-400 to-purple-500',
  6:  'from-fuchsia-400 to-pink-500',
  7:  'from-rose-400 to-red-500',
  8:  'from-orange-400 to-amber-500',
  9:  'from-yellow-300 to-amber-400',
  10: 'from-yellow-300 via-amber-300 to-orange-400',
};

const sizeMap = {
  sm: { badge: 'w-8 h-8 text-sm',  label: 'text-xs' },
  md: { badge: 'w-12 h-12 text-xl', label: 'text-sm' },
  lg: { badge: 'w-16 h-16 text-2xl', label: 'text-base' },
};

const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  size = 'md',
  showTitle = false,
  className = '',
}) => {
  const clampedLevel = Math.max(1, Math.min(10, level));
  const gradient = levelColors[clampedLevel] ?? levelColors[10];
  const title = LEVEL_TABLE.find((l) => l.level === clampedLevel)?.title ?? '';
  const { badge, label } = sizeMap[size];

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div
        className={`
          ${badge} rounded-full bg-gradient-to-br ${gradient}
          flex items-center justify-center font-black text-white
          shadow-md ring-2 ring-white/30
        `}
      >
        {clampedLevel}
      </div>
      {showTitle && (
        <span className={`${label} font-bold text-slate-500 dark:text-zinc-400`}>
          {title}
        </span>
      )}
    </div>
  );
};

export default LevelBadge;
