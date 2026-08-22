import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Sun, 
  Moon, 
  Zap, 
  TrendingDown, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders,
  Calendar
} from 'lucide-react';
import { ApplianceIcon } from './common/ApplianceLogos';

export default function TodTariffView({ currencySymbol = '₹' }) {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [selectedAppliance, setSelectedAppliance] = useState('washing_machine');
  const [shiftedHours, setShiftedHours] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  let currentZone = 'normal';
  let zoneLabel = 'Normal Grid Hours';
  let zoneColor = 'text-slate-900 dark:text-white';
  let zoneBadge = 'Base Slab Rate';

  if (currentHour >= 10 && currentHour < 16) {
    currentZone = 'solar';
    zoneLabel = 'Solar / Off-Peak Window (20% Cheaper)';
    zoneColor = 'text-amber-600 dark:text-amber-400';
    zoneBadge = 'Lowest Tariff';
  } else if (currentHour >= 18 && currentHour < 22) {
    currentZone = 'peak';
    zoneLabel = 'Peak Load Hours (20% Surcharge)';
    zoneColor = 'text-red-500';
    zoneBadge = 'High Tariff Surcharge';
  }

  const shiftSavings = Math.round(shiftedHours * 1.5 * 30 * 1.8);

  const cardBackground = currentZone === 'solar' 
    ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800' 
    : currentZone === 'peak' 
      ? 'bg-red-50/60 dark:bg-red-950/20 border-red-300 dark:border-red-800' 
      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800';

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-100 dark:bg-orange-950 text-[#E15B2D]">
              TIME-OF-DAY (ToD) TARIFF
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Live Grid Peak Hours & Smart Load Shifting
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            State power grids charge higher tariffs during evening peak demand (6 PM – 10 PM) and offer rebates during daytime solar generation (10 AM – 4 PM).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-2xl shadow-xs">
          <Clock className="w-4 h-4 text-[#E15B2D]" />
          <span>Local Time: <strong className="text-slate-900 dark:text-white">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</strong></span>
        </div>
      </div>

      {/* Live Status Card */}
      <div className={`p-8 rounded-3xl border transition-all ${cardBackground} flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm`}>
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
            LIVE GRID WINDOW STATUS
          </span>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${zoneColor} flex items-center gap-3`}>
            {currentZone === 'solar' && <Sun className="w-8 h-8 text-amber-500 animate-spin" />}
            {currentZone === 'peak' && <AlertTriangle className="w-8 h-8 text-red-500" />}
            {currentZone === 'normal' && <Clock className="w-8 h-8 text-slate-700 dark:text-slate-300" />}
            <span>{zoneLabel}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            {currentZone === 'solar' && 'Now is the best time to run heavy appliances (Washing machine, Water heater, EV Charging, AC) to take advantage of low solar grid tariffs.'}
            {currentZone === 'peak' && 'Peak demand on the state grid. Avoid running high-wattage appliances (Iron box, Geyser, Washing machine) until 10:00 PM to prevent peak surcharges.'}
            {currentZone === 'normal' && 'Grid demand is moderate. Normal base slab tariffs are active.'}
          </p>
        </div>

        <div className="flex-shrink-0 sm:text-right font-mono">
          <span className="text-xs text-slate-400 block uppercase">STATUS</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
            currentZone === 'solar' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-800 border-slate-200'
          }`}>
            {zoneBadge}
          </span>
        </div>
      </div>

      {/* 3-Tier Daily Grid Schedule Timeline */}
      <div className="space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold block">
          24-HOUR OFFICIAL DISCOM TARIFF SCHEDULE
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-600 font-bold">10:00 AM – 04:00 PM</span>
              <Sun className="w-5 h-5 text-amber-500" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Solar Super Off-Peak</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">20% rebate on base unit tariff. Maximum renewable solar power injection.</p>
            <div className="text-xs font-mono text-amber-600 font-bold">Best for: Washing Machine, EV, Geyser</div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-red-500 font-bold">06:00 PM – 10:00 PM</span>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Evening Peak Surcharge</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">20% surcharge on slab rate. Grid peak strain across residential feeders.</p>
            <div className="text-xs font-mono text-red-500 font-bold">Avoid: Electric motors, Water geysers</div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500 font-bold">10:00 PM – 10:00 AM</span>
              <Moon className="w-5 h-5 text-slate-400" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Normal Overnight Window</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Standard baseline progressive slab rate with zero additional surcharges.</p>
            <div className="text-xs font-mono text-slate-500 font-bold">Best for: Refrigerator, Fan, Night AC</div>
          </div>
        </div>
      </div>

      {/* Smart Load Shifting Savings Simulator */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-xs space-y-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#E15B2D] font-bold block">
          LOAD SHIFT SAVINGS ESTIMATOR
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <label className="block text-xs text-slate-600 dark:text-slate-400">
              Select heavy appliance to shift from Peak (7 PM) to Solar (1 PM):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'washing_machine', label: 'Washing Machine' },
                { id: 'water_heater', label: 'Geyser' },
                { id: 'ac', label: '1.5-Ton AC' },
              ].map(app => (
                <button
                  key={app.id}
                  onClick={() => setSelectedAppliance(app.id)}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                    selectedAppliance === app.id
                      ? 'border-[#E15B2D] bg-orange-50/60 dark:bg-orange-950/40 text-[#E15B2D] shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <ApplianceIcon type={app.id} className="w-5 h-5 text-[#E15B2D]" />
                  <span>{app.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 dark:text-slate-400">Daily Shifted Runtime:</span>
                <span className="text-[#E15B2D] font-bold">{shiftedHours} hrs/day</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                step="1"
                value={shiftedHours}
                onChange={(e) => setShiftedHours(parseInt(e.target.value))}
                className="w-full accent-[#E15B2D] cursor-pointer"
              />
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
              ESTIMATED MONTHLY SAVINGS
            </span>
            <div className="text-4xl font-black font-mono text-[#E15B2D]">
              +{currencySymbol}{shiftSavings} <span className="text-sm font-normal text-slate-500">/ month</span>
            </div>
            <p className="text-xs text-slate-500">
              By avoiding peak surcharges and shifting load into the solar window.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
