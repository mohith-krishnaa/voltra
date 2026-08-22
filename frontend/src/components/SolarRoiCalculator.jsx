import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  IndianRupee, 
  TrendingDown, 
  ShieldCheck, 
  Award, 
  Layers, 
  Calendar, 
  TreePine, 
  Maximize2,
  Sparkles
} from 'lucide-react';

export default function SolarRoiCalculator({ 
  predictedUnits = 280, 
  predictedBill = 1650, 
  tariffZone = 'TGSPDCL-Telangana',
  currencySymbol = '?'
}) {
  const [roofArea, setRoofArea] = useState(450);
  const [systemKw, setSystemKw] = useState(2.0);
  const [solarData, setSolarData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSolarRoi();
  }, [predictedUnits, predictedBill, tariffZone, roofArea, systemKw]);

  const fetchSolarRoi = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/solar/roi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthly_units: Math.max(20, predictedUnits || 280),
          monthly_bill: Math.max(0, predictedBill || 1600),
          tariff_zone: tariffZone,
          roof_area_sqft: roofArea,
          system_kw: systemKw
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSolarData(data);
      }
    } catch (err) {
      console.error('Error calculating solar ROI:', err);
    } finally {
      setLoading(false);
    }
  };

  const financials = solarData?.financials;
  const netMetering = solarData?.net_metering;
  const env = solarData?.environmental;
  const specs = solarData?.system_specs;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="utility-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-amber-500">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Sun className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-100">Solar Rooftop ROI & Net-Metering Simulator</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PM Surya Ghar Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Accurately model grid-tied rooftop solar savings, central subsidies, and 25-year financial returns.
            </p>
          </div>
        </div>

        {/* Live Bill Reduction Badge */}
        {financials && (
          <div className="bg-slate-900 border border-amber-500/40 px-4 py-2.5 rounded-xl flex items-center gap-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Estimated New Bill</span>
              <span className="text-xl font-mono font-extrabold text-amber-400 tabular-nums">
                {currencySymbol}{netMetering?.post_solar_bill} <span className="text-xs text-slate-400 font-normal">/ mo</span>
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold block">Monthly Savings</span>
              <span className="text-base font-mono font-bold text-slate-100 tabular-nums">
                -{currencySymbol}{financials?.monthly_savings}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Controls & Financial Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Interactive Solar Sizing Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="utility-card p-5 space-y-5">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Layers className="h-4 w-4 text-amber-400" />
              <span>Rooftop Solar Configuration</span>
            </h3>

            {/* System Size Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Solar Plant Size:</span>
                <span className="font-mono font-bold text-amber-400 text-sm tabular-nums">{systemKw} kW</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.5"
                value={systemKw}
                onChange={(e) => setSystemKw(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>1 kW (Starter)</span>
                <span>3 kW (Standard Home)</span>
                <span>10 kW (Villa/Heavy)</span>
              </div>
            </div>

            {/* Roof Area Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  <Maximize2 className="h-3 w-3 text-slate-400" /> Shade-Free Roof Area:
                </span>
                <span className="font-mono font-bold text-slate-200 tabular-nums">{roofArea} sq.ft</span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={roofArea}
                onChange={(e) => setRoofArea(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Required for {systemKw} kW: ~{specs?.roof_area_required_sqft || (systemKw * 100)} sq.ft
              </span>
            </div>

            {/* PM Surya Ghar Subsidy Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                <h4 className="font-bold text-xs text-amber-300">PM Surya Ghar Central Subsidy</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Direct bank transfer subsidy applied: <strong className="text-emerald-300 font-mono tabular-nums">{currencySymbol}{financials?.pm_surya_ghar_subsidy?.toLocaleString()}</strong>
              </p>
              <div className="flex items-center justify-between text-[10px] pt-1 text-slate-400 border-t border-slate-800/80">
                <span>Gross Cost: {currencySymbol}{financials?.gross_investment?.toLocaleString()}</span>
                <span>Net You Pay: <strong className="text-slate-100 tabular-nums">{currencySymbol}{financials?.net_customer_cost?.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Net Generation Stats */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Solar Generation:</span>
                <span className="font-mono font-bold text-amber-400 tabular-nums">~{specs?.monthly_solar_generation_kwh} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Household Usage:</span>
                <span className="font-mono text-slate-200 tabular-nums">{netMetering?.pre_solar_units} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Net Units Billed to Grid:</span>
                <span className="font-mono font-bold text-emerald-400 tabular-nums">{netMetering?.post_solar_net_units} kWh</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Col: ROI Metrics, Payback Timeline, 25-Year Value (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3.5">
            
            <div className="utility-card p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Payback Period</span>
                <Calendar className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white tabular-nums font-mono">{financials?.payback_years}</span>
                <span className="text-xs text-slate-400 ml-1 font-medium">Years</span>
              </div>
              <span className="text-[10px] text-emerald-400 mt-1 block font-semibold">100% Capital Recovered</span>
            </div>

            <div className="utility-card p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Annual Savings</span>
                <TrendingDown className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-emerald-400 tabular-nums font-mono">{currencySymbol}{financials?.annual_savings?.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Recurring every year</span>
            </div>

            <div className="utility-card p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">25-Yr Net Savings</span>
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-amber-300 tabular-nums font-mono">{currencySymbol}{financials?.lifetime_25yr_net_savings?.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Pure profit after full payback</span>
            </div>

            <div className="utility-card p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">CO2 Avoided</span>
                <TreePine className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-emerald-300 tabular-nums font-mono">{env?.lifetime_co2_offset_tonnes}</span>
                <span className="text-xs text-slate-400 ml-1 font-medium">Tonnes</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">˜ {env?.equivalent_trees_planted} Trees Planted</span>
            </div>

          </div>

          {/* Comparison Flow */}
          <div className="utility-card p-5 space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Monthly Utility Comparison</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-rose-400 block">Standard Utility Grid (No Solar)</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold text-slate-200 tabular-nums font-mono">{currencySymbol}{netMetering?.pre_solar_bill}</span>
                  <span className="text-xs text-slate-400 tabular-nums">{netMetering?.pre_solar_units} kWh / mo</span>
                </div>
                <p className="text-[10px] text-slate-400">Full tiered slab electricity cost charged by discom.</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                <span className="text-[11px] font-semibold text-emerald-400 block">With {systemKw} kW Rooftop Solar</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold text-emerald-300 tabular-nums font-mono">{currencySymbol}{netMetering?.post_solar_bill}</span>
                  <span className="text-xs text-emerald-400 tabular-nums font-mono">{netMetering?.post_solar_net_units} kWh net</span>
                </div>
                <p className="text-[10px] text-slate-300">
                  Solar offsets {Math.min(100, Math.round((specs?.monthly_solar_generation_kwh / (netMetering?.pre_solar_units || 1)) * 100))}% of energy charges.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
