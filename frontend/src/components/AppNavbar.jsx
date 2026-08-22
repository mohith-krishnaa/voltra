import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Phone,
  ArrowRight, 
  Tag,
  ChevronDown,
  Activity,
  Sliders,
  Clock,
  Users,
  FileText,
  Sun,
  Zap,
  MapPin
} from 'lucide-react';
import VoltraLogo from './common/VoltraLogo';

export default function AppNavbar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onOpenAuth, 
  onOpenProfile 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toolsItems = [
    { id: 'usage', label: 'Usage Analytics', desc: 'Historical consumption & progressive slabs', icon: Activity },
    { id: 'whatif', label: 'What-If Simulator', desc: 'Simulate appliance & AC upgrades', icon: Sliders },
    { id: 'tod', label: 'ToD Grid Hours', desc: 'Live solar discounts vs peak surcharges', icon: Clock },
    { id: 'split', label: 'Roommate Bill Splitter', desc: 'AC-weighted fair bill division', icon: Users },
    { id: 'bills', label: 'Past Bills & OCR', desc: 'Upload and track past utility bills', icon: FileText },
  ];

  const isToolsActive = ['usage', 'whatif', 'tod', 'split', 'bills'].includes(activeTab);

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#0B0F17] border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Voltra FixRight Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="cursor-pointer transition-opacity hover:opacity-90 flex-shrink-0"
        >
          <VoltraLogo size="default" />
        </div>

        {/* Center: Streamlined Clean Navigation Links (No wrapping) */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
          
          {/* 1. Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`text-sm font-semibold tracking-tight whitespace-nowrap transition-colors py-1 ${
              activeTab === 'home' 
                ? 'text-[#E15B2D] border-b-2 border-[#E15B2D]' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Home
          </button>

          {/* 2. Services */}
          <button
            onClick={() => {
              setActiveTab('home');
              setTimeout(() => {
                const el = document.getElementById('services-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="text-sm font-semibold tracking-tight whitespace-nowrap text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-1 transition-colors"
          >
            Services
          </button>

          {/* 3. Predict */}
          <button
            onClick={() => setActiveTab('predict')}
            className={`text-sm font-semibold tracking-tight whitespace-nowrap transition-colors py-1 ${
              activeTab === 'predict' 
                ? 'text-[#E15B2D] border-b-2 border-[#E15B2D]' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Predict
          </button>

          {/* 4. Solar ROI */}
          <button
            onClick={() => setActiveTab('solar')}
            className={`text-sm font-semibold tracking-tight whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'solar' 
                ? 'text-[#E15B2D] border-b-2 border-[#E15B2D]' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Solar ROI</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-[#E15B2D] font-bold">
              ₹78k
            </span>
          </button>

          {/* 5. Tools Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              className={`text-sm font-semibold tracking-tight whitespace-nowrap transition-colors py-1 flex items-center gap-1 ${
                isToolsActive 
                  ? 'text-[#E15B2D] border-b-2 border-[#E15B2D]' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Smart Tools</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {toolsItems.map(item => {
                  const Icon = item.icon;
                  const isItemActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setToolsDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-3 ${
                        isItemActive 
                          ? 'bg-orange-50 dark:bg-orange-950/40 text-[#E15B2D]' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                        isItemActive ? 'bg-[#E15B2D] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 6. Rebates */}
          <button
            onClick={() => setActiveTab('offers')}
            className={`text-sm font-semibold tracking-tight whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'offers' 
                ? 'text-[#E15B2D] border-b-2 border-[#E15B2D]' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Rebates</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold">
              New
            </span>
          </button>

          {/* 7. Offices */}
          <button
            onClick={() => setActiveTab('offices')}
            className={`text-sm font-semibold tracking-tight whitespace-nowrap transition-colors py-1 ${
              activeTab === 'offices' 
                ? 'text-[#E15B2D] border-b-2 border-[#E15B2D]' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Offices
          </button>

        </nav>

        {/* Far Right: Phone Hotline & Profile/Auth */}
        <div className="hidden lg:flex items-center gap-5">
          {/* Phone Hotline Number (from template) */}
          <a
            href="tel:1912"
            className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-[#E15B2D] transition-colors whitespace-nowrap"
          >
            <Phone className="w-4 h-4 text-[#E15B2D]" />
            <span className="font-mono tracking-tight">(1912) 24x7 Power</span>
          </a>

          {user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white transition-all shadow-xs"
            >
              <div className="h-6 w-6 rounded-lg bg-[#E15B2D] text-white flex items-center justify-center font-bold text-[10px]">
                {user.full_name ? user.full_name[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : 'U'}
              </div>
              <span className="font-mono text-xs max-w-[100px] truncate">{user.full_name || user.email?.split('@')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-orange-primary flex items-center gap-1.5 text-xs py-2.5 px-4 shadow-sm whitespace-nowrap"
            >
              <span>Sign In</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] px-6 py-6 space-y-4 shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'predict', label: 'Predict Bill' },
              { id: 'solar', label: 'Solar ROI' },
              { id: 'usage', label: 'Usage Analytics' },
              { id: 'whatif', label: 'What-If Simulator' },
              { id: 'tod', label: 'ToD Grid Hours' },
              { id: 'split', label: 'Split Bill' },
              { id: 'offers', label: 'Rebates & Offers' },
              { id: 'bills', label: 'Past Bills' },
              { id: 'offices', label: 'Emergency Offices' },
            ].map(link => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => { setActiveTab(link.id); setMobileMenuOpen(false); }}
                  className={`text-left text-sm font-semibold p-2.5 rounded-xl transition ${
                    isActive ? 'bg-orange-50 text-[#E15B2D] font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
            <a
              href="tel:1912"
              className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 py-1"
            >
              <Phone className="w-4 h-4 text-[#E15B2D]" />
              <span>Helpline: 1912 (Toll Free)</span>
            </a>

            {!user ? (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="btn-orange-primary w-full text-center text-sm py-2.5 font-bold"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => { onOpenProfile(); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 text-sm font-bold text-slate-900 dark:text-white"
              >
                My Account ({user.full_name || user.email})
              </button>
            )}
          </div>
        </div>
      )}

    </header>
  );
}
