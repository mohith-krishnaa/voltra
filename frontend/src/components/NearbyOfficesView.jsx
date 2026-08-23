import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  Search, 
  Globe, 
  MessageSquare,
  ShieldAlert, 
  ExternalLink, 
  AlertTriangle, 
  Zap, 
  Navigation,
  Building2
} from 'lucide-react';
import supportData from '../data/support_directory.json';

export default function NearbyOfficesView() {
  const [selectedState, setSelectedState] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const discomList = supportData?.discoms || [];

  const filteredDiscoms = discomList.filter(d => {
    const matchesState = selectedState === 'ALL' || d.state === selectedState;
    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.key_circles.some(c => 
        c.circle.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesState && matchesSearch;
  });

  const availableStates = ['ALL', ...new Set(discomList.map(d => d.state))];

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-100 dark:bg-orange-950 text-[#E15B2D]">
              ALL-INDIA STATE DISCOM DIRECTORY
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            State Electricity Boards & Emergency Desks
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Direct 24x7 toll-free lines, WhatsApp grievance bots, and divisional circle offices for TG, AP, Karnataka, Tamil Nadu, Maharashtra, Delhi, UP, Gujarat, and Kerala.
          </p>
        </div>

        <a
          href="tel:1912"
          className="btn-orange-primary text-xs py-2.5 px-4 flex items-center gap-2 self-start md:self-auto cursor-pointer shadow-sm"
        >
          <Phone className="w-4 h-4" />
          <span>Call 1912 (National Toll Free)</span>
        </a>
      </div>

      {/* 24x7 Emergency Hotlines Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">ALL-INDIA POWER EMERGENCY</span>
          <div className="text-2xl font-black font-mono text-[#E15B2D]">1912</div>
          <p className="text-xs text-slate-500">24x7 fuse failure, power outage & emergency reporting nationwide.</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">TELANGANA (TGSPDCL / TGNPDCL)</span>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">1800 425 0028</div>
          <p className="text-xs text-slate-500">WhatsApp live reading bot: +91 94408 19120</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">ANDHRA PRADESH (APSPDCL / APEPDCL)</span>
          <div className="text-2xl font-black font-mono text-emerald-600">1800 425 155333</div>
          <p className="text-xs text-slate-500">Tirupati / Vizag / Vijayawada Central Control Desks</p>
        </div>
      </div>

      {/* State Filter Pills & Search */}
      <div className="space-y-4">
        {/* State Tabs */}
        <div className="flex flex-wrap gap-2">
          {availableStates.map(st => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedState === st
                  ? 'bg-[#E15B2D] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              {st === 'ALL' ? '🇮🇳 All States' : st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by state, discom code, circle (e.g. TGSPDCL, Hyderabad, Tirupati, Vizag, BESCOM, TNEB)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-900 dark:text-white shadow-xs focus:outline-none focus:border-[#E15B2D]"
          />
        </div>
      </div>

      {/* DISCOMs & Circles Accordion/Grid */}
      <div className="space-y-6">
        {filteredDiscoms.map((d) => (
          <div
            key={d.code}
            className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6"
          >
            {/* DISCOM Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-[#E15B2D]/10 text-[#E15B2D]">
                    {d.code}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {d.state}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{d.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>HQ: {d.headquarters}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={"tel:" + d.helpline_24x7.split('/')[0].trim()}
                  className="btn-orange-primary text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{d.helpline_24x7}</span>
                </a>

                {d.official_portal && (
                  <a
                    href={d.official_portal}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline-card text-xs py-2 px-3 flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Key Divisional Circles */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                PRIMARY DIVISIONAL OFFICES & SUB-STATIONS
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {d.key_circles.map((circle, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{circle.circle}</h4>
                      <p className="text-[11px] text-slate-500 leading-snug flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
                        <span>{circle.address}</span>
                      </p>
                    </div>

                    <a
                      href={"tel:" + circle.phone}
                      className="text-xs font-mono font-bold text-[#E15B2D] hover:underline flex items-center gap-1 pt-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{circle.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
