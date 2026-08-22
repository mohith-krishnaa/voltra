import React from 'react';
import { 
  Lightbulb, 
  TrendingDown, 
  Leaf, 
  Clock, 
  Zap, 
  AirVent, 
  Timer, 
  Flame, 
  Fan, 
  Refrigerator, 
  Power,
  ChevronRight
} from 'lucide-react';

const TIP_ICONS = {
  AirVent: AirVent,
  Timer: Timer,
  Flame: Flame,
  Fan: Fan,
  Refrigerator: Refrigerator,
  Power: Power,
  TrendingDown: TrendingDown,
  Zap: Zap
};

export default function ActionableTips({ tips = [], currencySymbol = "₹" }) {
  if (!tips || tips.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center text-slate-400">
        Run prediction to generate personalized savings tips.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-400 fill-amber-400/20" />
            <span>Tailored Cost-Saving Recommendations</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Calculated specifically from your highest-consuming appliances
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {tips.map((tip, idx) => {
          const Icon = TIP_ICONS[tip.icon] || Zap;
          const isHighPriority = tip.difficulty === 'High Priority' || tip.category.includes('Boundary');

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isHighPriority
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-md shadow-rose-950/20 hover:border-rose-400'
                  : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/90'
              }`}
            >
              <div>
                {/* Header tag */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isHighPriority
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  }`}>
                    {tip.category}
                  </span>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>{tip.payback || 'Immediate'}</span>
                  </div>
                </div>

                {/* Title and Icon */}
                <div className="flex items-start gap-2.5 mt-1">
                  <div className={`p-2 rounded-lg mt-0.5 flex-shrink-0 ${
                    isHighPriority ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100 leading-snug">{tip.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </div>

              {/* Bottom savings badge */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>Save ~{currencySymbol}{tip.monthly_cost_savings}/mo</span>
                  <span className="text-[10px] text-slate-400 font-normal">({tip.monthly_kwh_savings} kWh)</span>
                </div>

                <div className="flex items-center gap-1 text-teal-400 text-[11px]">
                  <Leaf className="h-3 w-3 text-teal-400" />
                  <span>-{tip.co2_savings_kg} kg CO₂</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
