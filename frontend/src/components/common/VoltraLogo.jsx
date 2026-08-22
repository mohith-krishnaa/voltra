import React from 'react';

export default function VoltraLogo({ size = 'default', showText = true, className = '' }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const iconDimension = isLarge ? 44 : isSmall ? 26 : 34;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* FixRight styled dark rounded square badge with bold 'V' */}
      <div 
        className="flex items-center justify-center rounded-xl bg-[#1E293B] text-white font-black shadow-sm flex-shrink-0 transition-transform duration-200 hover:scale-105"
        style={{ width: iconDimension, height: iconDimension }}
      >
        <span className={isLarge ? 'text-2xl font-bold' : isSmall ? 'text-sm font-bold' : 'text-lg font-bold'}>
          V
        </span>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span 
            className={`font-black tracking-tight text-slate-900 dark:text-white font-sans ${
              isLarge ? 'text-2xl tracking-tighter' : isSmall ? 'text-sm' : 'text-lg'
            }`}
          >
            Voltra
          </span>
          <span className="text-[9px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
            ENERGY SMART. SAVINGS TODAY.
          </span>
        </div>
      )}
    </div>
  );
}
