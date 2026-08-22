import React from 'react';
import { 
  ArrowLeft, 
  Zap, 
  Target, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle,
  IndianRupee
} from 'lucide-react';

export default function StepHistory({
  household,
  setHousehold,
  onRunPrediction,
  onPrev,
  currencySymbol = '₹'
}) {
  const budgetInr = household.monthly_budget_inr || 3200;
  const budgetUnits = household.monthly_budget_units || 350;

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Budget goals & past baseline
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Set your monthly electricity budget targets and enable state government welfare subsidies.
        </p>
      </div>

      {/* Monthly Budget Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#E15B2D]" />
              Target Monthly Electricity Budget
            </span>
            <p className="text-xs text-slate-500">
              We will calculate actionable conservation tips if your projected load exceeds this limit.
            </p>
          </div>

          <div className="text-2xl font-mono font-black text-[#E15B2D]">
            {currencySymbol}{budgetInr}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-500">
            <span>{currencySymbol}1,000</span>
            <span>{currencySymbol}5,000</span>
            <span>{currencySymbol}12,000</span>
          </div>

          <input
            type="range"
            min="1000"
            max="12000"
            step="200"
            value={budgetInr}
            onChange={(e) => setHousehold({ ...household, monthly_budget_inr: parseInt(e.target.value) })}
            className="w-full accent-[#E15B2D] cursor-pointer"
          />
        </div>
      </div>

      {/* Gruha Jyothi Zero Bill Eligibility Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Gruha Jyothi Zero Bill Scheme (Telangana)
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold">
                100% Free &lt; 200 Units
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              If enabled and your monthly domestic consumption stays within 200 units, the state government waives 100% of energy and fixed charges.
            </p>
          </div>

          {/* Toggle */}
          <button
            type="button"
            onClick={() => setHousehold({ ...household, enable_gruha_jyothi: !household.enable_gruha_jyothi })}
            className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
              household.enable_gruha_jyothi ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              household.enable_gruha_jyothi ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="btn-outline-card text-xs flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Appliances</span>
        </button>

        <button
          type="button"
          onClick={onRunPrediction}
          className="btn-orange-primary text-sm flex items-center gap-2 cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>Generate Forecast Bill</span>
        </button>
      </div>

    </div>
  );
}
