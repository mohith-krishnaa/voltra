import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  Search, 
  Clock, 
  ShieldAlert, 
  ExternalLink, 
  AlertTriangle, 
  Zap, 
  Navigation,
  CheckCircle2
} from 'lucide-react';

const TGSPDCL_OFFICES = [
  {
    id: 1,
    name: 'KPHB Sub-Station & Fuse Call Center',
    division: 'Kukatpally Division (Circle 9)',
    address: 'Near JNTU Metro Station, Road No. 1, KPHB Colony, Hyderabad - 500072',
    phone: '040-23454884',
    altPhone: '9440812345',
    aeContact: 'Er. Suresh Reddy (AE Operations)',
    distance: '0.8 km',
    type: '33/11 kV Sub-Station'
  },
  {
    id: 2,
    name: 'Madhapur 33/11kV Sub-Station & Section Office',
    division: 'Cybercity Division',
    address: 'Near Ayyappa Society Main Road, Madhapur, Hyderabad - 500081',
    phone: '040-23115678',
    altPhone: '9440815678',
    aeContact: 'Er. P. Madhav (AE Tech)',
    distance: '2.4 km',
    type: 'Section Office & Fuse Call'
  },
  {
    id: 3,
    name: 'Gachibowli Electrical Section Desk',
    division: 'Financial District Division',
    address: 'Opp. Biodiversity Park, Gachibowli, Hyderabad - 500032',
    phone: '040-23009988',
    altPhone: '9440819988',
    aeContact: 'Er. K. Venkat (AE Lines)',
    distance: '4.1 km',
    type: '33/11 kV Sub-Station'
  },
  {
    id: 4,
    name: 'Banjara Hills Circle Office (Road No. 12)',
    division: 'Banjara Hills Circle',
    address: 'Road No. 12, Near MLA Colony, Banjara Hills, Hyderabad - 500034',
    phone: '040-23301122',
    altPhone: '9440811122',
    aeContact: 'Er. R. Anjaneyulu (Divisional Engineer)',
    distance: '6.5 km',
    type: 'Circle Head Office'
  }
];

export default function NearbyOfficesView() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOffices = TGSPDCL_OFFICES.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.division.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-100 dark:bg-orange-950 text-[#E15B2D]">
              TGSPDCL EMERGENCY DIRECTORY
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Nearby Fuse Call Offices & Emergency Desks
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Direct official contact numbers for local Telangana electricity board sub-stations, line inspectors, and Assistant Engineers.
          </p>
        </div>

        <a
          href="tel:1912"
          className="btn-orange-primary text-xs py-2.5 px-4 flex items-center gap-2 self-start md:self-auto cursor-pointer shadow-sm"
        >
          <Phone className="w-4 h-4" />
          <span>Call 1912 (Toll Free)</span>
        </a>
      </div>

      {/* 24x7 Emergency Hotlines Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">CENTRAL TOLL-FREE HELPLINE</span>
          <div className="text-2xl font-black font-mono text-[#E15B2D]">1912</div>
          <p className="text-xs text-slate-500">24x7 power outage & fuse failure reporting across Telangana.</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">WHATSAPP BILLING DESK</span>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">+91 94408 19120</div>
          <p className="text-xs text-slate-500">Send USC number for live meter reading & complaints.</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">SAFETY & HAZARD CONTROL</span>
          <div className="text-2xl font-black font-mono text-red-500">1800 425 0028</div>
          <p className="text-xs text-slate-500">Report broken conductors, fallen poles & transformer sparks.</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search by area name, colony, pin code, or division (e.g. KPHB, Madhapur, Gachibowli)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-900 dark:text-white shadow-xs focus:outline-none focus:border-[#E15B2D]"
        />
      </div>

      {/* Sub-Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOffices.map((office) => (
          <div
            key={office.id}
            className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  {office.type}
                </span>
                <span className="text-xs font-mono font-bold text-[#E15B2D] flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  {office.distance}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">{office.name}</h3>
              <p className="text-xs text-slate-500 flex items-start gap-1.5 leading-relaxed">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>{office.address}</span>
              </p>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                Officer: <strong className="text-slate-900 dark:text-white">{office.aeContact}</strong>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <a
                href={"tel:" + office.phone}
                className="btn-orange-primary text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Sub-Station</span>
              </a>

              <a
                href={"tel:" + office.altPhone}
                className="btn-outline-card text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <span>AE Mobile</span>
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
