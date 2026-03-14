import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

interface LevelUpModalProps {
  level: number;
  title: string;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, title, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 마운트 후 약간의 지연으로 트랜지션 시작
    const t1 = setTimeout(() => setVisible(true), 50);
    // 3초 뒤 자동 닫기
    const t2 = setTimeout(() => handleClose(), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 350);
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-300
        ${visible ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0'}
      `}
      onClick={handleClose}
    >
      <div
        className={`
          relative max-w-xs w-full text-center
          bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700
          rounded-3xl p-10 shadow-2xl shadow-violet-900/40 text-white
          transition-all duration-350
          ${visible ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-8'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 배경 광채 */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          {/* 아이콘 */}
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center ring-4 ring-white/30 shadow-lg animate-bounce">
            <Star size={40} className="text-yellow-300 fill-yellow-300" />
          </div>

          <div>
            <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-1">
              Level Up!
            </p>
            <div className="text-7xl font-black leading-none">
              {level}
            </div>
          </div>

          <div className="bg-white/20 rounded-2xl px-6 py-2">
            <span className="text-lg font-bold">{title}</span>
          </div>

          <p className="text-white/60 text-xs mt-2">탭하면 닫힙니다</p>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;
