import React from 'react';
import { Zap, Home, Calendar, Sliders, Lightbulb, User, Sparkles, Building2, Bell } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, user, onOpenAuth, onLogout, activeAlertsCount, onSelectDemoPreset }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('predictor')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-glow flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="h-5 w-5 text-emerald-400 fill-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                  Voltra
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AI PREDICTOR
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Smart Electricity Forecast & Slab Analyzer</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('predictor')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'predictor'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              Bill Predictor
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              What-If Simulator
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'tracker'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              Daily Tracker & Pace
              {activeAlertsCount > 0 && (
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('tips')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'tips'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              Savings Tips
            </button>

            <button
              onClick={() => setActiveTab('solar')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'solar'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Solar ROI
            </button>

            <button
              onClick={() => setActiveTab('households')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'households'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Multi-Home
            </button>
          </nav>

          {/* Right Action Items: Demo Selector & User Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Dropdown */}
            <div className="relative group">
              <button 
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
                title="1-Click demo scenarios for judges"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Demo Presets</span>
              </button>
              
              <div className="absolute right-0 mt-1 w-72 bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl p-2 hidden group-hover:block group-focus-within:block z-50 backdrop-blur-md">
                <p className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">Select Judge Demo</p>
                <button
                  onClick={() => onSelectDemoPreset('tgspdcl_summer_2bhk_family')}
                  className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-slate-800/80 text-slate-200 hover:text-emerald-400 flex flex-col gap-0.5"
                >
                  <span className="font-semibold">⚡ TGSPDCL 2BHK Family (Summer AC + Kitchen)</span>
                  <span className="text-[10px] text-slate-400">Full Indian household with TGSPDCL official slabs</span>
                </button>
                <button
                  onClick={() => onSelectDemoPreset('gruha_jyothi_1bhk')}
                  className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-slate-800/80 text-slate-200 hover:text-emerald-400 flex flex-col gap-0.5"
                >
                  <span className="font-semibold">🌱 1BHK Eco (Gruha Jyothi ₹0 Bill)</span>
                  <span className="text-[10px] text-slate-400">Under 200 units — 100% free subsidy applied</span>
                </button>
                <button
                  onClick={() => onSelectDemoPreset('wfh_techie_3bhk')}
                  className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-slate-800/80 text-slate-200 hover:text-emerald-400 flex flex-col gap-0.5"
                >
                  <span className="font-semibold">💻 3BHK IT Techie (PS5, Dual AC, Servers)</span>
                  <span className="text-[10px] text-slate-400">BESCOM Bangalore — gaming + WFH setup</span>
                </button>
                <button
                  onClick={() => onSelectDemoPreset('villa_ev_luxury')}
                  className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-slate-800/80 text-slate-200 hover:text-emerald-400 flex flex-col gap-0.5"
                >
                  <span className="font-semibold">⚡ Villa with EV & Heavy Load</span>
                  <span className="text-[10px] text-slate-400">4 ACs, EV charger, dishwasher — peak tier bills</span>
                </button>
              </div>
            </div>

            {/* Auth Profile / Login */}
            {user ? (
              <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 rounded-xl px-2.5 py-1.5">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-extrabold text-xs shadow-sm">
                  {user.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[110px]">
                    {user.full_name || 'Eco User'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Logged In</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors ml-1 p-1 hover:bg-slate-800 rounded"
                  title="Sign out of account"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all shadow-sm"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign In / Sign Up</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/60 overflow-x-auto text-[11px]">
          <button
            onClick={() => setActiveTab('predictor')}
            className={`px-2 py-1 rounded font-medium whitespace-nowrap ${activeTab === 'predictor' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Predictor
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-2 py-1 rounded font-medium whitespace-nowrap ${activeTab === 'simulator' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            What-If
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-2 py-1 rounded font-medium whitespace-nowrap ${activeTab === 'tracker' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Daily Tracker
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`px-2 py-1 rounded font-medium whitespace-nowrap ${activeTab === 'tips' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Tips
          </button>
          <button
            onClick={() => setActiveTab('households')}
            className={`px-2 py-1 rounded font-medium whitespace-nowrap ${activeTab === 'households' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Multi-Home
          </button>
        </div>

      </div>
    </header>
  );
}
