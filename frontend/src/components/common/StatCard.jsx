import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus 
} from 'lucide-react';

export default function StatCard({
  title,
  value,
  unit,
  change,
  changeType = 'neutral', // 'positive' | 'negative' | 'neutral'
  changeLabel,
  caption,
  icon: Icon,
  badgeText,
  badgeVariant = 'default', // 'default' | 'success' | 'warning' | 'info'
  className = ''
}) {
  const badgeStyles = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
    info: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60',
  };

  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 ${className}`}>
      
      {/* Top row: Title & Icon / Badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {badgeText ? (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyles[badgeVariant] || badgeStyles.default}`}>
            {badgeText}
          </span>
        ) : Icon ? (
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
      </div>

      {/* Main KPI Value */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {unit}
            </span>
          )}
        </div>

        {/* Change Indicator / Trend */}
        {(change !== undefined || changeLabel) && (
          <div className="flex items-center gap-1.5 text-xs">
            {changeType === 'positive' ? (
              <span className="flex items-center gap-0.5 font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                <TrendingUp className="h-3.5 w-3.5" />
                {change}
              </span>
            ) : changeType === 'negative' ? (
              <span className="flex items-center gap-0.5 font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                <TrendingDown className="h-3.5 w-3.5" />
                {change}
              </span>
            ) : change ? (
              <span className="flex items-center gap-0.5 font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                <Minus className="h-3 w-3" />
                {change}
              </span>
            ) : null}

            {changeLabel && (
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                {changeLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Optional bottom caption */}
      {caption && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          {caption}
        </div>
      )}

    </div>
  );
}
