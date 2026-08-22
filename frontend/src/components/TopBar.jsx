import React from 'react';
import { 
  Zap, 
  Sparkles, 
  Bell, 
  User, 
  LogOut, 
  Menu,
  ShieldAlert
} from 'lucide-react';

export default function TopBar({ 
  activeTabTitle = "Electricity Bill Predictor", 
  user, 
  onOpenAuth, 
  onLogout, 
  activeAlertsCount = 0, 
  onSelectDemoPreset,
  onOpenMobileNav 
}) {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#090e1f]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20 flex-shrink-0">
      
      {/* Mobile Menu & Active View Heading */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
            {activeTabTitle}
          </h1>
          <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            LT-1 Domestic
          </span>
        </div>
      </div>

      {/* Right Actions: Demo Presets, Alerts, User Profile */}
      <div className="flex items-center gap-2.5">
        
        {/* Judge Demo Scenarios Dropdown */}
        <div className="relative group">
          <button 
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
            title="1-Click demo scenarios for judges"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Judge Scenarios</span>
          </button>
          
          <div className="absolute right-0 mt-1 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 hidden group-hover:block group-focus-within:block z-50">
            <p className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">Select Demo Case</p>
            <button
              onClick={() => onSelectDemoPreset('tgspdcl_summer_2bhk_family')}
              className="w-full text-left px-2.5 py-2 text-xs rounded-xl hover:bg-slate-800 text-slate-200 hover:text-amber-400 flex flex-col gap-0.5"
            >
              <span className="font-semibold">? TGSPDCL 2BHK Family (Summer AC)</span>
              <span className="text-[10px] text-slate-400">Hyderabad 4-member with AC, fridge, fans</span>
            </button>
            <button
              onClick={() => onSelectDemoPreset('gruha_jyothi_1bhk')}
              className="w-full text-left px-2.5 py-2 text-xs rounded-xl hover:bg-slate-800 text-slate-200 hover:text-emerald-400 flex flex-col gap-0.5"
            >
              <span className="font-semibold">?? Gruha Jyothi ?0 Zero-Bill (Under 200U)</span>
              <span className="text-[10px] text-slate-400">Telangana 100% subsidy eligible 1BHK</span>
            </button>
            <button
              onClick={() => onSelectDemoPreset('villa_ev_luxury')}
              className="w-full text-left px-2.5 py-2 text-xs rounded-xl hover:bg-slate-800 text-slate-200 hover:text-amber-400 flex flex-col gap-0.5"
            >
              <span className="font-semibold">? Luxury Villa with EV Charging</span>
              <span className="text-[10px] text-slate-400">4 ACs, Level-2 EV Charging, high slab</span>
            </button>
          </div>
        </div>

        {/* User Account / Sign In */}
        {user ? (
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 py-1 px-2.5 rounded-xl">
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold text-[10px]">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <span className="text-xs font-semibold text-slate-200 max-w-[90px] truncate hidden sm:inline">
              {user.name || user.email}
            </span>
            <button
              onClick={onLogout}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <User className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>
        )}

      </div>
    </header>
  );
}
