import React, { useState } from 'react';
import { 
  Zap, 
  IndianRupee, 
  TrendingDown, 
  Share2, 
  Check, 
  Clock, 
  Sun, 
  Leaf, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

const EV_PRESETS = [
  {
    id: 'ola_s1_pro',
    name: 'Ola S1 Pro (Gen 2)',
    type: '2-Wheeler',
    batteryKwh: 4.0,
    rangeKm: 180,
    efficiencyKmPerKwh: 45.0, // 45 km per kWh
    petrolEquivalentMileage: 40.0 // 40 km / liter
  },
  {
    id: 'ather_450x',
    name: 'Ather 450X',
    type: '2-Wheeler',
    batteryKwh: 3.7,
    rangeKm: 150,
    efficiencyKmPerKwh: 40.0,
    petrolEquivalentMileage: 42.0
  },
  {
    id: 'tvs_iqube',
    name: 'TVS iQube Electric',
    type: '2-Wheeler',
    batteryKwh: 3.4,
    rangeKm: 140,
    efficiencyKmPerKwh: 41.0,
    petrolEquivalentMileage: 45.0
  },
  {
    id: 'tata_nexon_ev',
    name: 'Tata Nexon EV (Long Range)',
    type: '4-Wheeler SUV',
    batteryKwh: 45.0,
    rangeKm: 465,
    efficiencyKmPerKwh: 10.3, // 10.3 km per kWh
    petrolEquivalentMileage: 14.0 // 14 km / liter petrol
  },
  {
    id: 'tata_punch_ev',
    name: 'Tata Punch EV',
    type: '4-Wheeler SUV',
    batteryKwh: 35.0,
    rangeKm: 365,
    efficiencyKmPerKwh: 10.4,
    petrolEquivalentMileage: 16.0
  },
  {
    id: 'mg_zs_ev',
    name: 'MG ZS EV',
    type: '4-Wheeler SUV',
    batteryKwh: 50.3,
    rangeKm: 461,
    efficiencyKmPerKwh: 9.2,
    petrolEquivalentMileage: 12.0
  }
];

export default function EvCalculatorView({ household, predictionResult, currencySymbol = "₹" }) {
  const [selectedEvId, setSelectedEvId] = useState('ola_s1_pro');
  const [dailyCommuteKm, setDailyCommuteKm] = useState(35);
  const [petrolPricePerLiter, setPetrolPricePerLiter] = useState(108.0);
  const [chargingWindow, setChargingWindow] = useState('solar'); // 'solar', 'normal', 'peak'
  const [copied, setCopied] = useState(false);

  const activeEv = EV_PRESETS.find(e => e.id === selectedEvId) || EV_PRESETS[0];

  // Monthly Distance
  const monthlyKm = dailyCommuteKm * 30;

  // EV Energy Calculations
  const monthlyEvUnitsKwh = Math.round((monthlyKm / activeEv.efficiencyKmPerKwh) * 10) / 10;
  
  // Electricity Rate depending on window
  const baseRatePerKwh = 6.80;
  const effectiveRate = chargingWindow === 'solar' 
    ? baseRatePerKwh * 0.80 // 20% discount
    : chargingWindow === 'peak' 
      ? baseRatePerKwh * 1.20 // 20% surcharge
      : baseRatePerKwh;

  const monthlyEvCost = Math.round(monthlyEvUnitsKwh * effectiveRate);

  // Petrol Equivalent Calculations
  const monthlyPetrolLiters = monthlyKm / activeEv.petrolEquivalentMileage;
  const monthlyPetrolCost = Math.round(monthlyPetrolLiters * petrolPricePerLiter);

  // Net Savings
  const monthlySavingsInr = Math.max(0, monthlyPetrolCost - monthlyEvCost);
  const annualSavingsInr = monthlySavingsInr * 12;
  const fiveYearSavingsInr = annualSavingsInr * 5;

  // Environmental Metrics (Petrol ~ 2.3 kg CO2/L vs Grid EV ~ 0.82 kg CO2/kWh)
  const petrolCo2Kg = Math.round(monthlyPetrolLiters * 2.31);
  const evCo2Kg = Math.round(monthlyEvUnitsKwh * 0.82);
  const monthlyCo2SavedKg = Math.max(0, petrolCo2Kg - evCo2Kg);

  const handleShareWhatsApp = () => {
    const text = `🚗 *EV VS PETROL SAVINGS REPORT*\n\n` +
      `⚡ *Model:* ${activeEv.name} (${activeEv.type})\n` +
      `📍 *Daily Commute:* ${dailyCommuteKm} km (${monthlyKm} km/mo)\n\n` +
      `🔌 *Home EV Charging Cost:* ${currencySymbol}${monthlyEvCost.toLocaleString('en-IN')}/mo (${monthlyEvUnitsKwh} kWh)\n` +
      `⛽ *Petrol Equivalent Cost:* ${currencySymbol}${monthlyPetrolCost.toLocaleString('en-IN')}/mo\n` +
      `💰 *Net Monthly Savings:* ${currencySymbol}${monthlySavingsInr.toLocaleString('en-IN')} (Save ${currencySymbol}${annualSavingsInr.toLocaleString('en-IN')}/year)\n` +
      `🌱 *CO2 Emissions Cut:* ${monthlyCo2SavedKg} kg/mo\n\n` +
      `👉 Calculate your EV savings at: https://voltra.netlify.app`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#A3FF6B]/15 text-[#A3FF6B] border border-[#A3FF6B]/30">
              ⚡ EV MOBILITY & FUEL COST OPTIMIZER
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F3ED] tracking-tight">
            Electric Vehicle Home Charging Calculator
          </h2>
          <p className="text-sm text-[#8A8A84] max-w-2xl leading-relaxed">
            Compare residential grid charging tariffs against petrol fuel expenses. Optimize charging during solar off-peak windows for maximum savings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="editorial-btn-lime text-xs flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Share EV Report</span>
        </button>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Card 1: Vehicle Model Selection */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#111111] border border-white/10 space-y-5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8A8A84] font-bold block">
              01 / SELECT ELECTRIC VEHICLE
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EV_PRESETS.map((ev) => {
                const isSelected = selectedEvId === ev.id;
                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEvId(ev.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-[#A3FF6B]/10 border-[#A3FF6B] shadow-sm'
                        : 'bg-[#0B0B0B] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`text-xs font-bold ${isSelected ? 'text-[#A3FF6B]' : 'text-[#F5F3ED]'}`}>
                          {ev.name}
                        </h4>
                        <span className="text-[10px] font-mono text-[#8A8A84]">{ev.type}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-[#8A8A84]">
                        {ev.batteryKwh} kWh
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-[#8A8A84] pt-2 border-t border-white/5 flex justify-between">
                      <span>Range: {ev.rangeKm} km</span>
                      <span>{ev.efficiencyKmPerKwh} km/kWh</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Daily Commute Slider */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#111111] border border-white/10 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8A8A84] font-bold block">
              02 / DAILY DRIVING COMMUTE
            </span>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#8A8A84]">Average Daily Travel:</span>
                <span className="text-[#A3FF6B] font-bold text-base">{dailyCommuteKm} km / day</span>
              </div>

              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={dailyCommuteKm}
                onChange={(e) => setDailyCommuteKm(parseInt(e.target.value))}
                className="w-full accent-[#A3FF6B] cursor-pointer"
              />

              <div className="flex justify-between text-[10px] font-mono text-[#8A8A84]">
                <span>5 km/day</span>
                <span>{monthlyKm} km / month</span>
                <span>150 km/day</span>
              </div>
            </div>

            {/* Charging Time Window Selector */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="text-[11px] font-mono text-[#8A8A84] block uppercase">
                CHARGING SCHEDULE WINDOW
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChargingWindow('solar')}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition ${
                    chargingWindow === 'solar'
                      ? 'bg-[#A3FF6B] text-[#0B0B0B] border-[#A3FF6B]'
                      : 'bg-[#0B0B0B] text-[#8A8A84] border-white/10 hover:text-[#F5F3ED]'
                  }`}
                >
                  ☀️ Solar (10AM-4PM)
                </button>

                <button
                  type="button"
                  onClick={() => setChargingWindow('normal')}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition ${
                    chargingWindow === 'normal'
                      ? 'bg-[#A3FF6B] text-[#0B0B0B] border-[#A3FF6B]'
                      : 'bg-[#0B0B0B] text-[#8A8A84] border-white/10 hover:text-[#F5F3ED]'
                  }`}
                >
                  ⚡ Night Normal
                </button>

                <button
                  type="button"
                  onClick={() => setChargingWindow('peak')}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition ${
                    chargingWindow === 'peak'
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-[#0B0B0B] text-[#8A8A84] border-white/10 hover:text-[#F5F3ED]'
                  }`}
                >
                  ⚠️ Peak (6PM-10PM)
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Comparative Financial Analytics */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="p-7 rounded-3xl bg-[#111111] border border-white/10 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8A8A84] font-bold block">
              03 / MONTHLY FUEL SAVINGS
            </span>

            {/* Highlighted Monthly Savings Card */}
            <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-[#A3FF6B]/30 space-y-2">
              <span className="text-xs font-mono uppercase text-[#8A8A84]">Net Monthly Fuel Savings</span>
              <div className="text-5xl sm:text-6xl font-black font-mono text-[#A3FF6B] tracking-tight">
                +{currencySymbol}{monthlySavingsInr.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-[#8A8A84]">
                Compared to spending {currencySymbol}{monthlyPetrolCost.toLocaleString('en-IN')} on petrol fuel at ₹{petrolPricePerLiter}/liter.
              </p>
            </div>

            {/* Comparative Breakdown Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-[#0B0B0B] border border-white/5 space-y-1">
                <span className="text-[#8A8A84] block text-[10px] uppercase">EV Power Consumed</span>
                <span className="text-lg font-bold text-[#F5F3ED]">{monthlyEvUnitsKwh} kWh</span>
                <span className="text-[10px] text-[#A3FF6B] block">Cost: {currencySymbol}{monthlyEvCost.toLocaleString('en-IN')}/mo</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0B0B] border border-white/5 space-y-1">
                <span className="text-[#8A8A84] block text-[10px] uppercase">Petrol Equivalent</span>
                <span className="text-lg font-bold text-red-400">{monthlyPetrolLiters.toFixed(1)} Liters</span>
                <span className="text-[10px] text-red-400 block">Cost: {currencySymbol}{monthlyPetrolCost.toLocaleString('en-IN')}/mo</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0B0B] border border-white/5 space-y-1">
                <span className="text-[#8A8A84] block text-[10px] uppercase">1-Year Savings</span>
                <span className="text-lg font-bold text-[#A3FF6B]">+{currencySymbol}{annualSavingsInr.toLocaleString('en-IN')}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0B0B] border border-white/5 space-y-1">
                <span className="text-[#8A8A84] block text-[10px] uppercase">5-Year Total Return</span>
                <span className="text-lg font-bold text-[#A3FF6B]">+{currencySymbol}{fiveYearSavingsInr.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Environmental Impact Banner */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3 text-xs font-mono text-emerald-300">
              <Leaf className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <strong>Carbon Reduction:</strong> Cuts <strong>{monthlyCo2SavedKg} kg CO2/month</strong> ({Math.round(monthlyCo2SavedKg * 12)} kg/year) vs ICE internal combustion engines.
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
