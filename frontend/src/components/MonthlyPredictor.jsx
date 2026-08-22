import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Users, 
  Maximize2, 
  Sun, 
  CloudRain, 
  Snowflake, 
  Flower2, 
  MapPin, 
  Calculator, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
  FileText,
  Clock
} from 'lucide-react';
import ApplianceCard from './ApplianceCard';
import BreakdownCharts from './BreakdownCharts';
import SlabReceipt from './SlabReceipt';
import ActionableTips from './ActionableTips';
import OfficialBillModal from './OfficialBillModal';

const CATEGORIES_LIST = ['Climate', 'Kitchen', 'Electronics', 'Cleaning', 'Lighting'];

const SEASONS = [
  { id: 'Summer', label: 'Summer', icon: Sun, color: 'text-amber-400' },
  { id: 'Monsoon', label: 'Monsoon', icon: CloudRain, color: 'text-sky-400' },
  { id: 'Winter', label: 'Winter', icon: Snowflake, color: 'text-indigo-400' },
  { id: 'Spring', label: 'Spring/Aut', icon: Flower2, color: 'text-emerald-400' },
];

const HOUSE_TYPES = [
  { id: 'Apartment-1BHK', label: '1BHK Flat', defArea: 600, defOcc: 2 },
  { id: 'Apartment-2BHK', label: '2BHK Flat', defArea: 1150, defOcc: 3 },
  { id: 'Apartment-3BHK', label: '3BHK Flat', defArea: 1750, defOcc: 4 },
  { id: 'Villa-Independent', label: 'Villa / House', defArea: 2800, defOcc: 5 },
];

export default function MonthlyPredictor({ 
  household, 
  setHousehold, 
  appliances, 
  setAppliances, 
  predictionResult, 
  tariffs = [], 
  applianceSpecs = [],
  onSeasonChange,
  onApplyPreset,
  onRunPrediction, 
  loading 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [billModalOpen, setBillModalOpen] = useState(false);

  const [expandedCategories, setExpandedCategories] = useState({
    'Climate': true,
    'Kitchen': true,
    'Electronics': false,
    'Cleaning': false,
    'Lighting': false
  });

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const updateHouseholdField = (field, val) => {
    if (field === 'season' && onSeasonChange) {
      onSeasonChange(val);
    } else {
      setHousehold(prev => ({ ...prev, [field]: val }));
    }
  };

  const handleHouseTypeSelect = (ht) => {
    const selected = HOUSE_TYPES.find(h => h.id === ht);
    setHousehold(prev => ({
      ...prev,
      house_type: ht,
      area_sqft: selected ? selected.defArea : prev.area_sqft,
      occupants: selected ? selected.defOcc : prev.occupants
    }));
  };

  const updateApplianceCount = (appKey, count) => {
    setAppliances(prev => ({
      ...prev,
      [appKey]: { ...(prev[appKey] || { count: 0, hours: 0 }), count }
    }));
  };

  const updateApplianceHours = (appKey, hours) => {
    setAppliances(prev => ({
      ...prev,
      [appKey]: { ...(prev[appKey] || { count: 1, hours: 0 }), hours }
    }));
  };

  const currencySymbol = predictionResult?.bill?.currency_symbol || "?";
  const predictedUnits = predictionResult?.predicted_units || 0;
  const totalBill = predictionResult?.bill?.total_bill || 0;
  const effectiveRate = predictionResult?.bill?.effective_rate_per_kwh || 0;
  const benchmark = predictionResult?.benchmark;
  const carbon = predictionResult?.carbon_footprint;

  const specMap = useMemo(() => {
    const map = {};
    if (applianceSpecs && applianceSpecs.length > 0) {
      applianceSpecs.forEach(s => { map[s.key] = s; });
    }
    return map;
  }, [applianceSpecs]);

  const breakdownMap = useMemo(() => {
    const map = {};
    if (predictionResult?.appliance_breakdown) {
      predictionResult.appliance_breakdown.forEach(item => {
        map[item.appliance] = item;
      });
    }
    return map;
  }, [predictionResult]);

  const categorizedAppliances = useMemo(() => {
    const grouped = {
      'Climate': [],
      'Kitchen': [],
      'Electronics': [],
      'Cleaning': [],
      'Lighting': []
    };

    Object.entries(appliances).forEach(([key, data]) => {
      const spec = specMap[key];
      const name = spec?.display || key.replace('_', ' ');
      const category = spec?.category || 'Electronics';

      if (searchQuery.trim()) {
        if (name.toLowerCase().includes(searchQuery.trim().toLowerCase())) {
          if (!grouped[category]) grouped[category] = [];
          grouped[category].push([key, data, spec]);
        }
      } else {
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push([key, data, spec]);
      }
    });

    return grouped;
  }, [appliances, specMap, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* 1-Click Usage Presets Banner */}
      <div className="utility-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">1-Click Household Presets</h4>
            <p className="text-[10px] text-slate-400">Instant realistic appliances setup for Indian family scenarios</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onApplyPreset && onApplyPreset('preset_small_household')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200 hover:border-amber-500 hover:text-white transition active:scale-95 flex items-center gap-1.5"
          >
            <span>?? Small Household (1BHK)</span>
          </button>

          <button
            type="button"
            onClick={() => onApplyPreset && onApplyPreset('preset_family_ac')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition active:scale-95 flex items-center gap-1.5"
          >
            <span>??????????? Family + AC (2BHK)</span>
          </button>

          <button
            type="button"
            onClick={() => onApplyPreset && onApplyPreset('preset_heavy_usage')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200 hover:border-amber-500 hover:text-white transition active:scale-95 flex items-center gap-1.5"
          >
            <span>? Heavy Usage (3BHK + EV)</span>
          </button>
        </div>
      </div>

      {/* Main Top Grid: Inputs (5 cols) + Predicted Bill Hero (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Household Parameters Config */}
        <div className="lg:col-span-5 space-y-4">
          <div className="utility-card p-5 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Building className="h-4 w-4 text-amber-400" />
                <span>Household Configuration</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                Profile
              </span>
            </div>

            {/* House Type */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">House Type</label>
              <div className="grid grid-cols-2 gap-2">
                {HOUSE_TYPES.map(ht => (
                  <button
                    key={ht.id}
                    type="button"
                    onClick={() => handleHouseTypeSelect(ht.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all text-left flex flex-col justify-center ${
                      household.house_type === ht.id
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-semibold">{ht.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{ht.defArea} sq.ft</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Area & Occupants */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Maximize2 className="h-3 w-3" /> Area (Sq.Ft)
                </label>
                <input
                  type="number"
                  min="200"
                  max="10000"
                  step="50"
                  value={household.area_sqft}
                  onChange={(e) => updateHouseholdField('area_sqft', parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Users className="h-3 w-3" /> Occupants
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={household.occupants}
                  onChange={(e) => updateHouseholdField('occupants', parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Season Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Season & Climate</label>
              <div className="grid grid-cols-4 gap-1.5">
                {SEASONS.map(s => {
                  const Icon = s.icon;
                  const isSelected = household.season === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => updateHouseholdField('season', s.id)}
                      className={`p-2 rounded-xl text-xs font-medium border transition-all flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'bg-slate-800 border-amber-500 text-white shadow-sm font-bold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${s.color}`} />
                      <span className="text-[11px]">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tariff Zone */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-amber-400" /> Utility Tariff Board
              </label>
              <select
                value={household.tariff_zone}
                onChange={(e) => updateHouseholdField('tariff_zone', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
              >
                {tariffs.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} (Fixed: {t.currency_symbol}{t.fixed_charge})
                  </option>
                ))}
              </select>
            </div>

            {household.tariff_zone === 'TGSPDCL-Telangana' && (
              <label className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(household.enable_gruha_jyothi)}
                  onChange={(e) => updateHouseholdField('enable_gruha_jyothi', e.target.checked)}
                  className="mt-0.5 accent-emerald-500"
                />
                <span className="text-xs text-slate-300">
                  <strong className="text-emerald-300">Gruha Jyothi Zero-Bill Subsidy</strong>
                  <br />
                  <span className="text-[10px] text-slate-400">Apply Telangana government 200-unit ?0 zero-bill exemption check.</span>
                </span>
              </label>
            )}

            {/* Recalculate Prediction Action */}
            <button
              onClick={onRunPrediction}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Calculator className="h-4 w-4" />
              <span>{loading ? 'Predicting with AI...' : 'Recalculate Bill Prediction'}</span>
            </button>

          </div>
        </div>

        {/* Right: Predicted Bill Hero Display & Slab Barometer */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Hero Predicted Total Box */}
          <div className="utility-card p-6 border-l-4 border-l-amber-500 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 fill-amber-400" />
                  AI-Predicted Monthly Power Bill
                </span>
                
                {/* Hero Animated Number Reveal */}
                <motion.div 
                  key={totalBill}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-baseline gap-2 mt-1"
                >
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tabular-nums tracking-tight">
                    {currencySymbol}{totalBill}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/ month</span>
                </motion.div>

                <p className="text-xs text-slate-300 mt-1">
                  Estimated Consumption: <strong className="text-white tabular-nums">{predictedUnits} kWh (Units)</strong>
                </p>
              </div>

              {/* View Official Bill Slip Button */}
              <button
                type="button"
                onClick={() => setBillModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition self-start sm:self-center"
              >
                <FileText className="h-4 w-4 text-amber-400" />
                <span>View Official Bill</span>
              </button>
            </div>

            {/* Benchmark Pill */}
            {benchmark && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Neighborhood Comparison:</span>
                <span className={`font-bold tabular-nums flex items-center gap-1 ${
                  benchmark.status === 'higher' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {benchmark.status === 'higher' ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {benchmark.difference_percentage > 0 ? `+${benchmark.difference_percentage}%` : `${benchmark.difference_percentage}%`} vs City Benchmark
                </span>
              </div>
            )}

            {/* Key Telemetry Quick Bar */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Effective Rate</span>
                <span className="tabular-nums font-bold text-slate-200">{currencySymbol}{effectiveRate} / unit</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Carbon Footprint</span>
                <span className="tabular-nums font-bold text-emerald-400">{carbon?.total_co2_kg || 0} kg CO2</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Tree Equivalent</span>
                <span className="tabular-nums font-bold text-teal-300">{carbon?.equivalent_trees || 1} Trees / yr</span>
              </div>
            </div>
          </div>

          {/* Progressive Slab Receipt */}
          <SlabReceipt billInfo={predictionResult?.bill} />

        </div>

      </div>

      {/* Appliance Inventory Accordions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-400" />
              <span>Appliance Inventory & Daily Usage</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Categories organized cleanly. Expand any room or category to adjust appliances and see real-time ? costs.
            </p>
          </div>

          <div className="relative block sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search 22+ appliances…" 
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-slate-100 outline-none focus:border-amber-500" 
            />
          </div>
        </div>

        {/* Collapsible Categories */}
        <div className="space-y-3.5">
          {CATEGORIES_LIST.map((cat) => {
            const items = categorizedAppliances[cat] || [];
            if (items.length === 0) return null;
            const isExpanded = expandedCategories[cat] || searchQuery.trim().length > 0;
            const activeCount = items.filter(([_, d]) => d.count > 0).length;

            return (
              <div key={cat} className="utility-card overflow-hidden">
                
                {/* Category Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className="w-full px-4 py-3 bg-[#0e162c] hover:bg-[#121c38] flex items-center justify-between text-left transition border-b border-slate-800/80"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-xs sm:text-sm text-slate-100">{cat} Appliances</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {items.length} appliances {activeCount > 0 && `• ${activeCount} active`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                    <span className="text-[11px] hidden sm:inline">{isExpanded ? 'Collapse' : 'Expand'}</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {/* Category Grid */}
                {isExpanded && (
                  <div className="p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 bg-slate-950/20">
                    {items.map(([appKey, data, spec]) => {
                      const itemBreakdown = breakdownMap[appKey];
                      return (
                        <ApplianceCard
                          key={appKey}
                          appKey={appKey}
                          count={data.count}
                          hours={data.hours}
                          onChangeCount={(c) => updateApplianceCount(appKey, c)}
                          onChangeHours={(h) => updateApplianceHours(appKey, h)}
                          liveKwh={itemBreakdown?.monthly_kwh}
                          liveCost={itemBreakdown?.estimated_cost}
                          currencySymbol={currencySymbol}
                          applianceSpec={spec}
                        />
                      );
                    })}
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

      {/* Visual Analytics & Breakdown */}
      <BreakdownCharts breakdown={predictionResult?.appliance_breakdown} currencySymbol={currencySymbol} />

      {/* Actionable Tips */}
      <ActionableTips tips={predictionResult?.actionable_tips} currencySymbol={currencySymbol} />

      {/* Official Bill Modal */}
      <OfficialBillModal 
        isOpen={billModalOpen} 
        onClose={() => setBillModalOpen(false)} 
        billInfo={predictionResult?.bill} 
        household={household} 
      />

    </div>
  );
}
