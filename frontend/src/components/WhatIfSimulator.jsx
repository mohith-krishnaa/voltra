import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  ArrowRight, 
  TrendingDown, 
  Check, 
  RotateCcw,
  Zap,
  IndianRupee,
  ShieldCheck
} from 'lucide-react';
import { ApplianceIcon } from './common/ApplianceLogos';

export default function WhatIfSimulator({ 
  predictionResult, 
  household, 
  appliances, 
  onSaveScenario,
  currencySymbol = '₹' 
}) {
  const baseBill = Math.round(predictionResult?.bill?.total_bill || 2108);
  const baseUnits = Math.round(predictionResult?.predicted_units || 324);

  const [acHoursDelta, setAcHoursDelta] = useState(-1.5);
  const [hasBEE5StarAC, setHasBEE5StarAC] = useState(true);
  const [hasSolarRooftop, setHasSolarRooftop] = useState(false);
  const [bldcFanUpgrade, setBldcFanUpgrade] = useState(false);

  // Calculations
  let unitSavings = 0;
  if (acHoursDelta !== 0) unitSavings += Math.abs(acHoursDelta) * 1.5 * 30;
  if (hasBEE5StarAC) unitSavings += 45; // 45 kWh/mo saved via inverter compressor
  if (bldcFanUpgrade) unitSavings += 35; // 35 kWh/mo saved via BLDC motors
  if (hasSolarRooftop) unitSavings += 250; // 250 units generated

  const simulatedUnits = Math.max(50, Math.round(baseUnits - unitSavings));
  const avgSlabRate = 7.2;
  const simulatedSavings = Math.round(unitSavings * avgSlabRate);
  const simulatedBill = Math.max(80, baseBill - simulatedSavings);

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-100 dark:bg-orange-950 text-[#E15B2D]">
              WHAT-IF SIMULATION ENGINE
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Simulate Appliance & Behavior Upgrades
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Test how reducing AC runtime, installing 5-star inverter models, or upgrading to BLDC fans impacts your progressive slab bill before making changes.
          </p>
        </div>

        <button
          onClick={() => {
            setAcHoursDelta(0);
            setHasBEE5StarAC(false);
            setHasSolarRooftop(false);
            setBldcFanUpgrade(false);
          }}
          className="btn-outline-card text-xs py-2 px-3 flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Comparison Summary Banner */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-mono uppercase text-slate-400">Current Baseline</span>
          <div className="text-3xl font-black font-mono text-slate-700 dark:text-slate-300">{currencySymbol}{baseBill}</div>
          <span className="text-xs text-slate-400">{baseUnits} kWh / month</span>
        </div>

        <div className="flex items-center gap-3 text-[#E15B2D]">
          <ArrowRight className="w-8 h-8 hidden md:block" />
        </div>

        <div className="p-6 rounded-2xl bg-orange-50/80 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-center space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-[#E15B2D] font-bold">SIMULATED NEW BILL</span>
          <div className="text-4xl font-black font-mono text-[#E15B2D]">
            {currencySymbol}{simulatedBill}
          </div>
          <span className="text-xs font-mono text-emerald-600 font-bold">Save {currencySymbol}{simulatedSavings} / mo ({unitSavings} kWh)</span>
        </div>
      </div>

      {/* Interactive Levers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Lever 1: AC Runtime Reduction */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#E15B2D] flex items-center justify-center">
              <ApplianceIcon type="ac" className="w-5 h-5 text-[#E15B2D]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">AC Runtime Optimization</h4>
              <span className="text-xs text-slate-500">Adjust daily operating hours</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-500">Runtime Adjustment:</span>
              <span className="font-bold text-[#E15B2D]">{acHoursDelta > 0 ? ("+" + acHoursDelta) : acHoursDelta} hrs / day</span>
            </div>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.5"
              value={acHoursDelta}
              onChange={(e) => setAcHoursDelta(parseFloat(e.target.value))}
              className="w-full accent-[#E15B2D] cursor-pointer"
            />
          </div>
        </div>

        {/* Lever 2: BEE 5-Star Inverter Upgrade */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">BEE 5-Star Inverter Upgrade</h4>
                <span className="text-xs text-slate-500">Replace non-inverter compressor</span>
              </div>
            </div>

            <button
              onClick={() => setHasBEE5StarAC(!hasBEE5StarAC)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                hasBEE5StarAC ? 'bg-[#E15B2D]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                hasBEE5StarAC ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Variable speed inverter compressors adjust output seamlessly, consuming 35% less power than fixed-speed units.
          </p>
        </div>

        {/* Lever 3: BLDC Ceiling Fans */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#E15B2D] flex items-center justify-center">
                <ApplianceIcon type="fan" className="w-5 h-5 text-[#E15B2D]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Upgrade to 28W BLDC Fans</h4>
                <span className="text-xs text-slate-500">Saves 45W per fan running continuously</span>
              </div>
            </div>

            <button
              onClick={() => setBldcFanUpgrade(!bldcFanUpgrade)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                bldcFanUpgrade ? 'bg-[#E15B2D]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                bldcFanUpgrade ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            BLDC motor fans consume only 28-32W compared to standard 75W induction fans, generating 60% recurring savings.
          </p>
        </div>

        {/* Lever 4: Solar Rooftop Net Metering */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">2kW Solar Rooftop Net Metering</h4>
                <span className="text-xs text-slate-500">Generates ~250 units/month</span>
              </div>
            </div>

            <button
              onClick={() => setHasSolarRooftop(!hasSolarRooftop)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                hasSolarRooftop ? 'bg-[#E15B2D]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                hasSolarRooftop ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Solar generation offsets daytime grid draw, keeping total billed units in lower progressive slab tiers.
          </p>
        </div>

      </div>

    </div>
  );
}
