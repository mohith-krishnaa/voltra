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
  MapPin, 
  Award, 
  Globe 
} from 'lucide-react';
import VoltraLogo from './common/VoltraLogo';
import translations from '../data/translations.json';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' }
];

export default function AppNavbar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onOpenAuth, 
  onOpenProfile,
  language = 'en',
  setLanguage
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const langRef = useRef(null);

  const t = translations[language] || translations.en;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setToolsDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toolsItems = [
    { id: 'ev', label: t.nav_ev || 'EV Charging', desc: 'EV power vs petrol fuel cost savings', icon: Zap },
    { id: 'rewards', label: t.nav_rewards || 'Eco Badges', desc: 'Household Eco Score & weekly quests', icon: Award },
    { id: 'whatif', label: t.nav_simulator || 'What-If Simulator', desc: 'Simulate appliance & AC upgrades', icon: Sliders },
    { id: 'usage', label: 'Usage Analytics', desc: 'Historical consumption & progressive slabs', icon: Activity },
    { id: 'tod', label: t.nav_tod || 'Grid Peak Clock', desc: 'Live solar discounts vs peak surcharges', icon: Clock },
    { id: 'split', label: t.nav_split || 'Bill Splitter', desc: 'AC-weighted fair bill division', icon: Users },
    { id: 'bills', label: t.nav_bills || 'Bill OCR Scanner', desc: 'Snap bill photo & analyze variance', icon: FileText },
  ];

  const isToolsActive = ['ev', 'rewards', 'usage', 'whatif', 'tod', 'split', 'bills'].includes(activeTab);

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#0B0F17] border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Voltra Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="cursor-pointer transition-opacity hover:opacity-90 flex-shrink-0"
        >
          <VoltraLogo size="default" />
        </div>

        {/* Center: Streamlined Navigation Links */}
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
            {t.nav_home}
          </button>

          {/* 2. Predict */}
          <button
            onClick={() => setActiveTab('predict')}
            className={`text-sm font-semibold tracking-tight whitespace-nowrap transition-colors py-1 ${
              activeTab === 'predict' 
                ? 'text-[#E15B2D] border-b-2 border-[#E15B2D]' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.nav_predict}
          </button>

          {/* 3. Solar ROI */}
          <button
            onClick={() => setActiveTab('solar')}
            className={`text-sm font-semibold tracking-tight whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'solar' 
                ? 'text-[#E15B2D] border-b-2 border-[#E15B2D]' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{t.nav_solar}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-[#E15B2D] font-bold">
              ₹78k
            </span>
          </button>

          {/* 4. Smart Tools Dropdown */}
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
              <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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

          {/* 5. Rebates */}
          <button
            onClick={() => setActiveTab('offers')}
            className={`text-sm font-semibold tracking-tight whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'offers' 
                ? 'text-[#E15B2D] border-b-2 border-[#E15B2D]' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{t.nav_offers}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold">
              New
            </span>
          </button>

          {/* 6. Offices */}
          <button
            onClick={() => setActiveTab('offices')}
            className={`text-sm font-semibold tracking-tight whitespace-nowrap transition-colors py-1 ${
              activeTab === 'offices' 
                ? 'text-[#E15B2D] border-b-2 border-[#E15B2D]' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.nav_offices}
          </button>

        </nav>

        {/* Far Right: Language Dropdown + Hotline & Profile */}
        <div className="hidden lg:flex items-center gap-4">
          
          {/* Indic Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 hover:border-[#E15B2D] transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#E15B2D]" />
              <span>{LANGUAGES.find(l => l.code === language)?.label.split(' ')[0] || 'EN'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {langDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      if (setLanguage) setLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                      language === lang.code
                        ? 'bg-orange-50 dark:bg-orange-950/40 text-[#E15B2D] font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {language === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-[#E15B2D]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hotline Number */}
          <a
            href="tel:1912"
            className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-[#E15B2D] transition-colors whitespace-nowrap"
          >
            <Phone className="w-4 h-4 text-[#E15B2D]" />
            <span className="font-mono tracking-tight">(1912)</span>
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
              className="btn-orange-primary text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>{t.sign_in}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

        </div>

        {/* Mobile Menu Hamburger */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Mobile Language Button */}
          <button
            onClick={() => {
              const nextIndex = (LANGUAGES.findIndex(l => l.code === language) + 1) % LANGUAGES.length;
              if (setLanguage) setLanguage(LANGUAGES[nextIndex].code);
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold"
          >
            {language.toUpperCase()}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0B0F17] border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
              activeTab === 'home' ? 'bg-orange-50 dark:bg-orange-950/40 text-[#E15B2D]' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.nav_home}
          </button>

          <button
            onClick={() => { setActiveTab('predict'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
              activeTab === 'predict' ? 'bg-orange-50 dark:bg-orange-950/40 text-[#E15B2D]' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.nav_predict}
          </button>

          <button
            onClick={() => { setActiveTab('solar'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
              activeTab === 'solar' ? 'bg-orange-50 dark:bg-orange-950/40 text-[#E15B2D]' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.nav_solar}
          </button>

          <button
            onClick={() => { setActiveTab('ev'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
              activeTab === 'ev' ? 'bg-orange-50 dark:bg-orange-950/40 text-[#E15B2D]' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            ⚡ {t.nav_ev || 'EV Charging'}
          </button>

          <button
            onClick={() => { setActiveTab('rewards'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
              activeTab === 'rewards' ? 'bg-orange-50 dark:bg-orange-950/40 text-[#E15B2D]' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            🏆 {t.nav_rewards || 'Eco Badges'}
          </button>

          <button
            onClick={() => { setActiveTab('whatif'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
              activeTab === 'whatif' ? 'bg-orange-50 dark:bg-orange-950/40 text-[#E15B2D]' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.nav_simulator}
          </button>

          <button
            onClick={() => { setActiveTab('split'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
              activeTab === 'split' ? 'bg-orange-50 dark:bg-orange-950/40 text-[#E15B2D]' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.nav_split}
          </button>

          <button
            onClick={() => { setActiveTab('bills'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
              activeTab === 'bills' ? 'bg-orange-50 dark:bg-orange-950/40 text-[#E15B2D]' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.nav_bills}
          </button>

          <button
            onClick={() => { setActiveTab('offers'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
              activeTab === 'offers' ? 'bg-orange-50 dark:bg-orange-950/40 text-[#E15B2D]' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.nav_offers}
          </button>

          <button
            onClick={() => { setActiveTab('offices'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
              activeTab === 'offices' ? 'bg-orange-50 dark:bg-orange-950/40 text-[#E15B2D]' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.nav_offices}
          </button>
        </div>
      )}
    </header>
  );
}
