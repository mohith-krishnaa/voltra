import React from 'react';
import { 
  Sparkles, 
  TrendingDown, 
  Lightbulb, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Tag, 
  Sliders, 
  IndianRupee 
} from 'lucide-react';

export default function SavingsView({ 
  predictionResult, 
  household, 
  onStartWhatIf, 
  onViewOffers, 
  currencySymbol = '₹' 
}) {
  const tips = predictionResult?.actionable_tips || [
    { title: 'Increase AC Set Temperature to 24°C', savings_inr: 420, category: 'Cooling', difficulty: 'Easy', desc: 'Each 1°C increase above 18°C reduces AC compressor power consumption by 6%.' },
    { title: 'Upgrade 3 Ceiling Fans to 28W BLDC Models', savings_inr: 310, category: 'Efficiency', difficulty: 'Medium', desc: 'BLDC motor fans consume only 28W compared to traditional 75W induction fans.' },
    { title: 'Clean Refrigerator Coils & Set 4°C', savings_inr: 140, category: 'Kitchen', difficulty: 'Easy', desc: 'Dust-free condenser coils allow the compressor to dissipate heat efficiently.' },
    { title: 'Shift Washing Machine Load to 11 AM - 3 PM', savings_inr: 180, category: 'Time-of-Day', difficulty: 'Easy', desc: 'Take advantage of daytime solar off-peak tariff rebates and avoid evening surcharges.' }
  ];

  const totalPotentialSavings = tips.reduce((sum, t) => sum + (t.savings_inr || 0), 0);

  return (
    <div className='space-y-10 max-w-5xl mx-auto py-2'>
      
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <span className='px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-100 dark:bg-orange-950 text-[#E15B2D]'>
              ENERGY CONSERVATION ENGINE
            </span>
          </div>
          <h2 className='text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
            Personalized Savings & Efficiency Recommendations
          </h2>
          <p className='text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed'>
            Targeted adjustments ranked by highest rupee return to keep your monthly usage in lower tariff slabs.
          </p>
        </div>

        <div className='p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-right'>
          <span className='text-[10px] font-mono uppercase text-slate-500 block font-bold'>Total Monthly Potential</span>
          <span className='text-2xl font-black font-mono text-[#E15B2D]'>+{currencySymbol}{totalPotentialSavings} / mo</span>
        </div>
      </div>

      {/* Tips Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className='p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between hover:border-slate-300 transition-colors'
          >
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold'>
                  {tip.category}
                </span>
                <span className='text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400'>
                  Save ~{currencySymbol}{tip.savings_inr}/mo
                </span>
              </div>

              <h4 className='text-base font-bold text-slate-900 dark:text-white'>{tip.title}</h4>
              <p className='text-xs text-slate-600 dark:text-slate-400 leading-relaxed'>{tip.desc || tip.description}</p>
            </div>

            <div className='pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500'>
              <span className='font-mono'>Difficulty: {tip.difficulty}</span>
              <span className='text-[#E15B2D] font-semibold flex items-center gap-1'>
                <span>Apply Step</span>
                <ArrowRight className='w-3.5 h-3.5' />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className='p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6'>
        <div className='space-y-1 text-center sm:text-left'>
          <h4 className='font-bold text-base text-slate-900 dark:text-white'>Want to see the financial impact in real-time?</h4>
          <p className='text-xs text-slate-500'>Open the What-If Simulator to calculate exact progressive slab savings.</p>
        </div>

        <button
          onClick={onStartWhatIf}
          className='btn-orange-primary text-xs py-3 px-6 flex items-center gap-2 cursor-pointer shadow-sm'
        >
          <span>Open What-If Simulator</span>
          <ArrowRight className='w-4 h-4' />
        </button>
      </div>

    </div>
  );
}
