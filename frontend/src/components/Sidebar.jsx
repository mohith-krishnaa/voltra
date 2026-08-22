import React from 'react';
import { 
  Zap, 
  Home, 
  Sliders, 
  Calendar, 
  Lightbulb, 
  Sun, 
  Tag, 
  Building2, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'predictor', label: 'Bill Predictor', icon: Zap, color: 'text-amber-400' },
  { id: 'simulator', label: 'What-If Simulator', icon: Sliders, color: 'text-sky-400' },
  { id: 'tracker', label: 'Daily Tracker & Pace', icon: Calendar, color: 'text-emerald-400' },
  { id: 'tips', label: 'Savings Tips', icon: Lightbulb, color: 'text-amber-300' },
  { id: 'solar', label: 'Solar Rooftop ROI', icon: Sun, color: 'text-amber-400' },
  { id: 'offers', label: 'Offers & Discounts', icon: Tag, color: 'text-rose-400' },
  { id: 'support', label: 'Support & Offices', icon: Building2, color: 'text-indigo-400' },
  { id: 'households', label: 'Multi-Household', icon: Users, color: 'text-teal-400' },
];

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  collapsed, 
  setCollapsed,
  activeAlertsCount = 0 
}) {
  return (
    <aside 
      className={`hidden md:flex flex-col justify-between border-r border-slate-800 bg-[#090e1f] transition-all duration-300 z-30 flex-shrink-0 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand & Logo Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <div 
            onClick={() => setActiveTab('predictor')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md flex items-center justify-center flex-shrink-0">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
              </div>
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white font-mono">Voltra</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    DISCOM AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">Indian Utility Tariff Engine</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Item Links */}
        <nav className="p-3 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-slate-950' : item.color}`} />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {item.id === 'tracker' && activeAlertsCount > 0 && (
                  <span className={`h-2 w-2 rounded-full bg-rose-500 animate-pulse ${collapsed ? 'absolute top-2 right-2' : 'ml-auto'}`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Discom Gazette Indicator */}
      {!collapsed ? (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
            <span>State Discom Tariffs 2026-27</span>
          </div>
          <span className="text-[9px] text-slate-400 mt-1 block">
            TGSPDCL • BESCOM • TNEB • MSEDCL
          </span>
        </div>
      ) : (
        <div className="p-2 border-t border-slate-800 flex justify-center">
          <ShieldCheck className="h-4 w-4 text-emerald-400" title="State Discom Tariffs Verified" />
        </div>
      )}
    </aside>
  );
}
