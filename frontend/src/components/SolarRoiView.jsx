import React, { useState } from 'react';
import { 
  Sun, 
  IndianRupee, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  Calculator,
  Sliders,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SolarRoiView({ household, predictionResult, currencySymbol = '₹' }) {
  const [systemCapacityKw, setSystemCapacityKw] = useState(3.0);
  const [rooftopAreaSqft, setRooftopAreaSqft] = useState(300);
  const [currentMonthlyUnits, setCurrentMonthlyUnits] = useState(Math.round(predictionResult?.predicted_units || 320));

  // Solar calculations based on MNRE / PM Surya Ghar guidelines
  // 1 kW generates approx 120 units/month in India
  const monthlySolarGenUnits = Math.round(systemCapacityKw * 120);
  const estimatedGrossCost = Math.round(systemCapacityKw * 50000); // approx Rs 50,000 / kW

  // Official Central Government PM Surya Ghar Subsidy
  let subsidyAmount = 0;
  if (systemCapacityKw <= 1.0) {
    subsidyAmount = 30000;
  } else if (systemCapacityKw <= 2.0) {
    subsidyAmount = 60000;
  } else {
    subsidyAmount = 78000; // max cap for domestic rooftop
  }

  const netEffectiveCost = Math.max(0, estimatedGrossCost - subsidyAmount);
  const avgTariffPerUnit = 7.5; // Rs / unit average upper slab
  const monthlySavingsInr = Math.min(currentMonthlyUnits, monthlySolarGenUnits) * avgTariffPerUnit;
  const annualSavingsInr = monthlySavingsInr * 12;
  const paybackPeriodYears = (netEffectiveCost / (annualSavingsInr || 1)).toFixed(1);
  const lifetime25YrProfitInr = Math.round((annualSavingsInr * 25) - netEffectiveCost);

  return (
    <div className='space-y-10 max-w-5xl mx-auto py-2'>
      
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <span className='px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-100 dark:bg-orange-950 text-[#E15B2D]'>
              PM SURYA GHAR : MUFT BIJLI YOJANA
            </span>
          </div>
          <h2 className='text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
            Solar Rooftop & Subsidy ROI Calculator
          </h2>
          <p className='text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed'>
            Calculate optimal rooftop solar capacity (kW), direct central government subsidies up to ₹78,000, and 25-year financial payback returns.
          </p>
        </div>

        <a
          href='https://pmsuryaghar.gov.in'
          target='_blank'
          rel='noopener noreferrer'
          className='btn-orange-primary text-xs py-2.5 px-4 flex items-center gap-1.5 self-start md:self-auto cursor-pointer'
        >
          <span>Apply on National Portal</span>
          <ExternalLink className='w-3.5 h-3.5' />
        </a>
      </div>

      {/* Main 2-Column Calculator Layout */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        
        {/* Left Column: Interactive Inputs */}
        <div className='lg:col-span-6 space-y-6'>
          
          {/* Card 1: System Sizing */}
          <div className='p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6'>
            <span className='text-xs font-mono uppercase tracking-widest text-slate-500 font-bold block'>
              01 / SOLAR SYSTEM CAPACITY
            </span>

            {/* Capacity Slider */}
            <div className='space-y-2'>
              <div className='flex justify-between text-xs font-mono'>
                <span className='text-slate-600 dark:text-slate-400'>Recommended Capacity:</span>
                <span className='text-[#E15B2D] font-bold text-sm'>{systemCapacityKw.toFixed(1)} kW</span>
              </div>
              <input
                type='range'
                min='1.0'
                max='5.0'
                step='0.5'
                value={systemCapacityKw}
                onChange={(e) => setSystemCapacityKw(parseFloat(e.target.value))}
                className='w-full accent-[#E15B2D] cursor-pointer'
              />
              <div className='flex justify-between text-[10px] font-mono text-slate-400'>
                <span>1 kW (120 units/mo)</span>
                <span>3 kW (360 units/mo)</span>
                <span>5 kW (600 units/mo)</span>
              </div>
            </div>

            {/* Rooftop Area Slider */}
            <div className='space-y-2'>
              <div className='flex justify-between text-xs font-mono'>
                <span className='text-slate-600 dark:text-slate-400'>Available Shadow-Free Rooftop:</span>
                <span className='text-slate-900 dark:text-white font-bold text-sm'>{rooftopAreaSqft} sq.ft</span>
              </div>
              <input
                type='range'
                min='100'
                max='1000'
                step='50'
                value={rooftopAreaSqft}
                onChange={(e) => setRooftopAreaSqft(parseInt(e.target.value))}
                className='w-full accent-[#E15B2D] cursor-pointer'
              />
            </div>

            {/* Monthly Consumption Slider */}
            <div className='space-y-2'>
              <div className='flex justify-between text-xs font-mono'>
                <span className='text-slate-600 dark:text-slate-400'>Current Monthly Electricity Consumption:</span>
                <span className='text-slate-900 dark:text-white font-bold text-sm'>{currentMonthlyUnits} kWh / mo</span>
              </div>
              <input
                type='range'
                min='100'
                max='800'
                step='10'
                value={currentMonthlyUnits}
                onChange={(e) => setCurrentMonthlyUnits(parseInt(e.target.value))}
                className='w-full accent-[#E15B2D] cursor-pointer'
              />
            </div>

          </div>

          {/* Card 2: Official Subsidy Structure Table */}
          <div className='p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4'>
            <div className='flex items-center gap-2'>
              <ShieldCheck className='w-4 h-4 text-emerald-600' />
              <h4 className='font-bold text-sm text-slate-900 dark:text-white'>Official Central Subsidy Rates</h4>
            </div>
            
            <div className='grid grid-cols-3 gap-2 text-center text-xs font-mono'>
              <div className='p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700'>
                <span className='text-slate-400 text-[10px] block'>1 kW System</span>
                <span className='font-bold text-slate-900 dark:text-white'>₹30,000</span>
              </div>
              <div className='p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700'>
                <span className='text-slate-400 text-[10px] block'>2 kW System</span>
                <span className='font-bold text-slate-900 dark:text-white'>₹60,000</span>
              </div>
              <div className='p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-[#E15B2D]'>
                <span className='text-[10px] block font-bold'>3 kW+ System</span>
                <span className='font-black'>₹78,000</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Financial Returns & ROI Metrics */}
        <div className='lg:col-span-6 space-y-6'>
          
          <div className='p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-8'>
            <span className='text-xs font-mono uppercase tracking-widest text-[#E15B2D] font-bold block'>
              02 / FINANCIAL BENEFIT BREAKDOWN
            </span>

            {/* Big Subsidy Number */}
            <div className='p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-2'>
              <span className='text-xs font-mono text-slate-500 uppercase'>Direct Govt Bank Transfer (DBT)</span>
              <div className='text-4xl sm:text-5xl font-black font-mono text-emerald-600 dark:text-emerald-400'>
                +{currencySymbol}{subsidyAmount.toLocaleString('en-IN')}
              </div>
              <p className='text-xs text-slate-500'>Credited directly to your DISCOM-linked bank account within 30 days of installation.</p>
            </div>

            {/* Financial Metrics Grid */}
            <div className='grid grid-cols-2 gap-4 text-xs font-mono'>
              <div className='p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700'>
                <span className='text-slate-400 block text-[11px] uppercase'>Estimated Gross Cost</span>
                <span className='text-lg font-bold text-slate-900 dark:text-white'>{currencySymbol}{estimatedGrossCost.toLocaleString('en-IN')}</span>
              </div>

              <div className='p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700'>
                <span className='text-slate-400 block text-[11px] uppercase'>Net Out-of-Pocket</span>
                <span className='text-lg font-bold text-[#E15B2D]'>{currencySymbol}{netEffectiveCost.toLocaleString('en-IN')}</span>
              </div>

              <div className='p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700'>
                <span className='text-slate-400 block text-[11px] uppercase'>Annual Bill Savings</span>
                <span className='text-lg font-bold text-emerald-600 dark:text-emerald-400'>+{currencySymbol}{Math.round(annualSavingsInr).toLocaleString('en-IN')}</span>
              </div>

              <div className='p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700'>
                <span className='text-slate-400 block text-[11px] uppercase'>Payback Period</span>
                <span className='text-lg font-bold text-slate-900 dark:text-white'>{paybackPeriodYears} Years</span>
              </div>
            </div>

            {/* 25-Year Net Profit */}
            <div className='p-6 rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 space-y-1.5'>
              <span className='text-xs font-mono uppercase tracking-widest text-[#E15B2D] font-bold'>25-Year Net Cumulative Return</span>
              <div className='text-3xl font-black font-mono text-[#E15B2D]'>
                +{currencySymbol}{lifetime25YrProfitInr.toLocaleString('en-IN')}
              </div>
              <p className='text-xs text-slate-600 dark:text-slate-400'>
                Assuming standard 25-year tier-1 solar panel warranty with net-metering grid injection.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
