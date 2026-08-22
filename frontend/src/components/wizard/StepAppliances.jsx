import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Trash2, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Search,
  X,
  Info,
  Zap
} from 'lucide-react';
import { ApplianceIcon } from '../common/ApplianceLogos';

const COMMON_APPLIANCES = [
  { id: 'ac', name: '1.5-Ton Inverter AC', defaultWatts: 1500, category: 'Cooling', defaultHours: 4.0 },
  { id: 'air_cooler', name: 'Desert Air Cooler', defaultWatts: 200, category: 'Cooling', defaultHours: 6.0 },
  { id: 'fan', name: 'Ceiling Fan (BLDC/Standard)', defaultWatts: 70, category: 'Cooling', defaultHours: 8.0 },
  { id: 'fridge', name: 'Refrigerator (Double Door)', defaultWatts: 250, category: 'Kitchen', defaultHours: 24.0 },
  { id: 'water_heater', name: 'Storage Geyser', defaultWatts: 2000, category: 'Utility', defaultHours: 0.5 },
  { id: 'washing_machine', name: 'Washing Machine (Front/Top)', defaultWatts: 500, category: 'Utility', defaultHours: 0.5 },
  { id: 'light', name: 'LED Tube & Bulb Points', defaultWatts: 20, category: 'Lighting', defaultHours: 6.0 },
  { id: 'tv_home_theater', name: 'Smart TV & Soundbar', defaultWatts: 120, category: 'Entertainment', defaultHours: 3.0 },
  { id: 'laptop_computer', name: 'Laptop / PC Workstation', defaultWatts: 90, category: 'Work', defaultHours: 6.0 },
  { id: 'wifi_router', name: 'Wi-Fi Fiber Router', defaultWatts: 15, category: 'Utility', defaultHours: 24.0 },
  { id: 'induction_cooktop', name: 'Induction Cooktop', defaultWatts: 1800, category: 'Kitchen', defaultHours: 0.5 },
  { id: 'microwave', name: 'Microwave Oven', defaultWatts: 1200, category: 'Kitchen', defaultHours: 0.2 },
  { id: 'water_purifier', name: 'RO Water Purifier', defaultWatts: 40, category: 'Kitchen', defaultHours: 1.0 },
  { id: 'iron_box', name: 'Steam Iron', defaultWatts: 1000, category: 'Utility', defaultHours: 0.2 },
  { id: 'ev_charger', name: 'Electric 2W/4W EV Charger', defaultWatts: 3300, category: 'Utility', defaultHours: 2.0 },
];

export default function StepAppliances({
  appliances,
  setAppliances,
  household,
  applianceSpecs,
  onSeasonChange,
  onNext,
  onPrev
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = ['All', 'Cooling', 'Kitchen', 'Utility', 'Lighting', 'Entertainment'];

  const handleUpdateHours = (id, hours) => {
    setAppliances({
      ...appliances,
      [id]: {
        ...(appliances[id] || { count: 1 }),
        hours: Math.max(0, parseFloat(hours) || 0)
      }
    });
  };

  const handleUpdateCount = (id, delta) => {
    const current = appliances[id] || { count: 0, hours: 2.0 };
    const newCount = Math.max(0, (current.count || 0) + delta);
    setAppliances({
      ...appliances,
      [id]: {
        ...current,
        count: newCount
      }
    });
  };

  const activeAppliances = Object.keys(appliances).filter(key => (appliances[key]?.count || 0) > 0);

  const filteredCatalog = COMMON_APPLIANCES.filter(app => {
    const matchesCat = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Configure your appliances
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Set active counts and estimated daily runtime hours for precision load simulation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn-orange-primary text-xs py-2.5 px-4 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add More Appliances</span>
        </button>
      </div>

      {/* Season Selector Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
            CURRENT BILLING SEASON
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Thermodynamic AC and refrigerator efficiency adjust automatically for seasonal temperatures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['Summer', 'Monsoon', 'Winter'].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => onSeasonChange && onSeasonChange(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border transition ${
                household.season === s
                  ? 'bg-[#E15B2D] text-white border-[#E15B2D] shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Active Appliances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeAppliances.map(id => {
          const appMeta = COMMON_APPLIANCES.find(a => a.id === id) || { name: id.replace('_', ' ').toUpperCase(), category: 'General' };
          const data = appliances[id];

          return (
            <div
              key={id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#E15B2D] flex items-center justify-center">
                    <ApplianceIcon type={id} className="w-5 h-5 text-[#E15B2D]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{appMeta.name}</h4>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">{appMeta.category}</span>
                  </div>
                </div>

                {/* Counter Pill */}
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => handleUpdateCount(id, -1)}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 shadow-xs transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-mono font-bold text-xs text-slate-900 dark:text-white">
                    {data.count}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUpdateCount(id, 1)}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 shadow-xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Daily Hours Slider */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#E15B2D]" /> Daily runtime:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{data.hours} hrs / day</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="24"
                  step="0.5"
                  value={data.hours}
                  onChange={(e) => handleUpdateHours(id, e.target.value)}
                  className="w-full accent-[#E15B2D] cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="btn-outline-card text-xs flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="btn-orange-primary text-sm flex items-center gap-2 cursor-pointer"
        >
          <span>Continue to Bill History</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Add Appliance Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Appliances to Profile</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search appliances (e.g. AC, Geyser, Induction)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#E15B2D]"
              />
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
              {filteredCatalog.map(app => {
                const count = appliances[app.id]?.count || 0;

                return (
                  <div
                    key={app.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <ApplianceIcon type={app.id} className="w-5 h-5 text-[#E15B2D]" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{app.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Avg. {app.defaultWatts}W • {app.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {count > 0 ? (
                        <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/50 px-2 py-1 rounded-lg border border-orange-200 dark:border-orange-800 text-xs font-mono font-bold text-[#E15B2D]">
                          <span>{count} added</span>
                          <button onClick={() => handleUpdateCount(app.id, 1)} className="hover:opacity-75">+</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleUpdateCount(app.id, 1)}
                          className="px-3 py-1 rounded-lg bg-slate-900 dark:bg-slate-700 hover:bg-[#E15B2D] text-white text-xs font-semibold transition"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowAddModal(false)}
              className="btn-orange-primary w-full text-xs py-2.5 font-bold"
            >
              Done Adding Appliances
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
