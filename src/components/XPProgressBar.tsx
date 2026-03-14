import React from 'react';
import type { XPProgress } from '../lib/xpSystem';

interface XPProgressBarProps {
  xpProgress: XPProgress;
  totalXP: number;
  compact?: boolean;
  className?: string;
}

const XPProgressBar: React.FC<XPProgressBarProps> = ({
  xpProgress,
  totalXP,
  compact = false,
  className = '',
}) => {
  const { current, next, percent, xpInLevel, xpNeeded } = xpProgress;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* 레벨 뱃지 (작은 원) */}
        <div className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-black flex items-center justify-center shadow">
          {current.level}
        </div>

        <div className="flex-1 min-w-0">
          <div className="w-full h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <span className="shrink-0 text-[10px] font-mono text-slate-400 dark:text-zinc-500">
          {totalXP.toLocaleString()} XP
        </span>
      </div>
    );
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* 라벨 행 */}
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-500 dark:text-zinc-400">
          Lv.{current.level} <span className="text-slate-400 dark:text-zinc-500">{current.title}</span>
        </span>
        {next ? (
          <span className="text-slate-400 dark:text-zinc-500 font-mono">
            {xpInLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP
          </span>
        ) : (
          <span className="text-amber-500 font-bold">MAX</span>
        )}
      </div>

      {/* 진행 바 */}
      <div className="w-full h-3 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* 하단 정보 */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
        <span>Total {totalXP.toLocaleString()} XP</span>
        {next && <span>→ Lv.{next.level} {next.title} ({percent}%)</span>}
      </div>
    </div>
  );
};

export default XPProgressBar;
