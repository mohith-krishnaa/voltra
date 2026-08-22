import React from 'react';
import { 
  AirVent, 
  Wind, 
  Fan, 
  Flame, 
  Droplets, 
  Sparkles, 
  Refrigerator, 
  Utensils, 
  Coffee, 
  Shirt, 
  Tv, 
  Laptop, 
  Gamepad2, 
  Volume2, 
  Smartphone, 
  Headphones, 
  Wifi, 
  Scissors, 
  Zap, 
  Lightbulb, 
  Plus, 
  Minus,
  Info
} from 'lucide-react';

const ICON_MAP = {
  ac: AirVent,
  air_cooler: Wind,
  fan: Fan,
  water_heater: Flame,
  immersion_rod: Zap,
  air_purifier: Sparkles,
  fridge: Refrigerator,
  rice_cooker: Utensils,
  mixer_grinder: Coffee,
  wet_grinder: Droplets,
  induction_cooktop: Flame,
  microwave: Utensils,
  electric_kettle: Coffee,
  water_purifier: Droplets,
  dishwasher: Sparkles,
  mobile_chargers: Smartphone,
  earbuds_chargers: Headphones,
  laptop_computer: Laptop,
  smart_speakers: Volume2,
  tv_home_theater: Tv,
  gaming_console: Gamepad2,
  wifi_router: Wifi,
  iron_box: Shirt,
  washing_machine: Shirt,
  vacuum_cleaner: Sparkles,
  hair_dryer: Scissors,
  ev_charger: Zap,
  light: Lightbulb
};

export default function ApplianceCard({ 
  appKey, 
  count = 0, 
  hours = 0, 
  onChangeCount, 
  onChangeHours, 
  liveKwh = 0, 
  liveCost = 0, 
  currencySymbol = "?",
  applianceSpec = null
}) {
  const Icon = ICON_MAP[appKey] || Zap;
  
  const meta = applianceSpec ? {
    title: applianceSpec.display || appKey.replace('_', ' '),
    desc: applianceSpec.desc || `${applianceSpec.category} appliance`,
    watt: applianceSpec.default_watt || `${applianceSpec.effective_watts}W avg. running draw`,
    cat: applianceSpec.category || "General",
    maxHours: applianceSpec.max_hours || 24.0
  } : { 
    title: appKey.replace('_', ' '), 
    desc: "Household Appliance", 
    watt: "100W avg. running draw", 
    cat: "General", 
    maxHours: 24 
  };

  const isActive = count > 0 && hours > 0;
  const isContinuous = appKey === 'fridge' || appKey === 'wifi_router';
  const isBrief = ['electric_kettle', 'hair_dryer', 'immersion_rod', 'mixer_grinder', 'wet_grinder'].includes(appKey);
  const maxSliderHours = isContinuous ? 24 : meta.maxHours || (isBrief ? 3 : 24);
  const sliderStep = isBrief ? 0.1 : (appKey === 'water_heater' || appKey === 'microwave') ? 0.2 : 0.5;

  return (
    <div className={`utility-card p-4 transition-all flex flex-col justify-between ${
      isActive 
        ? 'border-amber-500/50 bg-[#131f3b] shadow-lg shadow-amber-950/20' 
        : 'border-slate-800/80 bg-[#0d162a]/70 opacity-75 hover:opacity-100 hover:border-slate-700'
    }`}>
      
      {/* Header: Category Badge, Running Wattage & Real-Time ?/mo cost */}
      <div>
        <div className="flex items-center justify-between gap-1.5 mb-2.5">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase tracking-wider">
            {meta.cat}
          </span>
          
          <div className="flex items-center gap-1.5">
            {isActive && liveCost > 0 && (
              <span className="text-[10px] tabular-nums font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {currencySymbol}{liveCost}/mo
              </span>
            )}
            <span className="text-[10px] tabular-nums font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
              {meta.watt}
            </span>
          </div>
        </div>

        {/* Appliance Icon, Name & Quantity Counter */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-2 rounded-xl flex-shrink-0 transition-colors ${
              isActive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-slate-100 truncate">{meta.title}</h4>
              <p className="text-[10px] text-slate-400 truncate">{meta.desc}</p>
            </div>
          </div>

          {/* Stepper controls */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 flex-shrink-0">
            <button
              type="button"
              onClick={() => onChangeCount(Math.max(0, count - 1))}
              className="h-5 w-5 rounded flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800 active:scale-95 transition disabled:opacity-30"
              disabled={count <= 0}
              aria-label={`Decrease ${meta.title}`}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-4 text-center font-bold text-xs text-slate-100 tabular-nums">{count}</span>
            <button
              type="button"
              onClick={() => onChangeCount(count + 1)}
              className="h-5 w-5 rounded flex items-center justify-center text-amber-400 hover:text-amber-300 hover:bg-slate-800 active:scale-95 transition"
              aria-label={`Increase ${meta.title}`}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Runtime Slider & Real-Time Telemetry */}
      {count > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-300 font-medium">Daily Runtime:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-amber-300 tabular-nums">
                {isContinuous ? '24 hrs / day' : `${hours} hrs / day`}
              </span>
              {liveCost > 0 && (
                <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/40 px-1.5 rounded tabular-nums">
                  ({currencySymbol}{liveCost}/mo)
                </span>
              )}
            </div>
          </div>

          {!isContinuous ? (
            <input
              type="range"
              min="0"
              max={maxSliderHours}
              step={sliderStep}
              value={hours}
              onChange={(e) => onChangeHours(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          ) : (
            <div className="w-full bg-amber-950/30 border border-amber-500/30 py-0.5 px-2 rounded text-[10px] text-amber-300 text-center font-medium">
              Continuous 24×7 Base Load
            </div>
          )}

          {liveKwh > 0 && (
            <div className="flex items-center justify-between text-[10px] mt-2 pt-1.5 border-t border-slate-800/60 text-slate-300">
              <span>Units: <strong className="text-slate-100 tabular-nums">{liveKwh} kWh</strong></span>
              <span>Impact: <strong className="text-amber-300 tabular-nums">{currencySymbol}{liveCost}</strong></span>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
