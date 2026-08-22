import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  MessageSquare, 
  MapPin, 
  ExternalLink, 
  ShieldAlert, 
  Search, 
  Clock, 
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import supportData from '../data/support_directory.json';

export default function SupportDirectory() {
  const [selectedDiscom, setSelectedDiscom] = useState('TGSPDCL');
  const [searchQuery, setSearchQuery] = useState('');

  const currentBoard = supportData.discoms.find(d => d.code === selectedDiscom) || supportData.discoms[0];

  const filteredCircles = currentBoard.key_circles.filter(c => 
    c.circle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="utility-card p-5 sm:p-6 border-l-4 border-l-sky-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-100">State Discom Support & Section Office Directory</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Official Helplines
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified 24×7 customer care numbers, WhatsApp grievance bots, and division offices for Indian discoms.
            </p>
          </div>
        </div>

        {/* National 1912 Emergency Box */}
        <div className="bg-rose-950/30 border border-rose-500/40 p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-rose-300 uppercase tracking-wider font-bold block">All-India Emergency</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white font-mono">{supportData.toll_free_national.number}</span>
              <span className="text-[10px] text-slate-400">(Toll-Free 24×7)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Human Verification Notice Disclaimer */}
      <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Notice:</strong> Section contact numbers are compiled from published gazettes and discom portals ({supportData.last_updated}). Before in-person visits, verify operating hours with your local consumer division.
        </p>
      </div>

      {/* Board Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {supportData.discoms.map(d => (
          <button
            key={d.code}
            onClick={() => { setSelectedDiscom(d.code); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
              selectedDiscom === d.code
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>{d.code}</span>
            <span className="text-[10px] font-normal opacity-80">({d.state})</span>
          </button>
        ))}
      </div>

      {/* Selected Discom Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Discom Central Contact Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="utility-card p-5 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">{currentBoard.state} State Discom</span>
              <h3 className="font-bold text-sm text-slate-100 mt-0.5">{currentBoard.name}</h3>
              <p className="text-xs text-slate-400 mt-1 flex items-start gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>HQ: {currentBoard.headquarters}</span>
              </p>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <span>24×7 Helpline</span>
                </div>
                <span className="font-mono font-bold text-emerald-300">{currentBoard.helpline_24x7}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <MessageSquare className="h-4 w-4 text-emerald-400" />
                  <span>WhatsApp Grievance Bot</span>
                </div>
                <span className="font-mono font-bold text-slate-200">{currentBoard.whatsapp_bot}</span>
              </div>
            </div>

            <a
              href={currentBoard.official_portal}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 hover:border-sky-500/40 transition active:scale-95"
            >
              <span>Visit Official {currentBoard.code} Portal</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </a>

          </div>
        </div>

        {/* Right: Key Circles and Local Offices (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="utility-card p-5 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-100">Division & Circle Offices</h4>
                <p className="text-[11px] text-slate-400">Local complaint centers and section engineer desks</p>
              </div>

              <div className="relative w-full sm:w-56">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search division or circle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Circle list */}
            <div className="space-y-2.5">
              {filteredCircles.length > 0 ? (
                filteredCircles.map((circle, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <h5 className="font-semibold text-slate-200">{circle.circle}</h5>
                      <span className="text-[11px] text-slate-400">{circle.address}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-300 font-mono self-start sm:self-auto bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      <Phone className="h-3 w-3 text-sky-400" />
                      <span>{circle.phone}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  No section offices match "{searchQuery}".
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
