import React from 'react';
import { 
  Building2, 
  Home as HomeIcon, 
  Users, 
  Maximize2, 
  MapPin, 
  ArrowRight, 
  Check, 
  Zap,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const HOUSE_TYPES = [
  { id: 'Apartment-1BHK', label: '1 BHK Flat', desc: 'Compact apartment', defaultSqft: 600, defaultOccupants: 2 },
  { id: 'Apartment-2BHK', label: '2 BHK Flat', desc: 'Standard family flat', defaultSqft: 1150, defaultOccupants: 4 },
  { id: 'Apartment-3BHK', label: '3 BHK Flat', desc: 'Spacious apartment', defaultSqft: 1750, defaultOccupants: 4 },
  { id: 'Independent-House', label: 'Independent House / Villa', desc: 'Multi-floor home', defaultSqft: 2400, defaultOccupants: 5 },
];

export default function StepHome({ household, setHousehold, tariffs = [], onNext }) {
  const selectedType = household.house_type || 'Apartment-2BHK';

  const handleSelectType = (ht) => {
    setHousehold({
      ...household,
      house_type: ht.id,
      area_sqft: ht.defaultSqft,
      occupants: ht.defaultOccupants
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Tell us about your home
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This sets your baseline consumption profile for lighting, base load, and square footage.
        </p>
      </div>

      {/* House Type Selection (4 Clean White Cards) */}
      <div className="space-y-3">
        <label className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
          HOME TYPE
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {HOUSE_TYPES.map((ht) => {
            const isSelected = selectedType === ht.id;

            return (
              <div
                key={ht.id}
                onClick={() => handleSelectType(ht)}
                className={`p-5 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-orange-50/50 dark:bg-orange-950/20 border-[#E15B2D] shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className={`text-base font-bold ${isSelected ? 'text-slate-950 dark:text-white font-extrabold' : 'text-slate-800 dark:text-slate-200'}`}>
                      {ht.label}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{ht.desc}</p>
                  </div>

                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    isSelected 
                      ? 'bg-[#E15B2D] border-[#E15B2D] text-white' 
                      : 'border-slate-300 dark:border-slate-700 bg-transparent'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span>Avg. {ht.defaultSqft} sq.ft</span>
                  <span>{ht.defaultOccupants} occupants</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Area & Occupants Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        
        {/* Floor Area */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-[#E15B2D]" />
              Floor Area (sq.ft)
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{household.area_sqft || 1150} sq.ft</span>
          </div>

          <input
            type="range"
            min="300"
            max="5000"
            step="50"
            value={household.area_sqft || 1150}
            onChange={(e) => setHousehold({ ...household, area_sqft: parseInt(e.target.value) })}
            className="w-full accent-[#E15B2D] cursor-pointer"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>300 sq.ft</span>
            <span>2,500 sq.ft</span>
            <span>5,000 sq.ft</span>
          </div>
        </div>

        {/* Occupants */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#E15B2D]" />
              Occupants (People)
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{household.occupants || 4} residents</span>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setHousehold({ ...household, occupants: num })}
                className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border transition ${
                  (household.occupants || 4) === num
                    ? 'bg-[#E15B2D] text-white border-[#E15B2D] shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* State & Utility Tariff Zone Selection */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <label className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#E15B2D]" />
          State Electricity Board / DISCOM Tariff
        </label>

        <select
          value={household.tariff_zone || 'TGSPDCL-Telangana'}
          onChange={(e) => setHousehold({ ...household, tariff_zone: e.target.value })}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#E15B2D] focus:bg-white"
        >
          <optgroup label="⚡ TELANGANA (TSERC LT-1 Domestic)">
            <option value="TGSPDCL-Telangana">TGSPDCL (Telangana Southern - Hyderabad, Ranga Reddy, Medchal, Nalgonda)</option>
            <option value="TGNPDCL-Telangana">TGNPDCL (Telangana Northern - Warangal, Karimnagar, Khammam, Nizamabad)</option>
          </optgroup>

          <optgroup label="⚡ ANDHRA PRADESH (APERC Domestic Slabs)">
            <option value="APSPDCL-AP">APSPDCL (Andhra Pradesh Southern - Tirupati, Nellore, Chittoor, Kadapa, Anantapur, Kurnool)</option>
            <option value="APEPDCL-AP">APEPDCL (Andhra Pradesh Eastern - Visakhapatnam, Srikakulam, East/West Godavari)</option>
            <option value="APCPDCL-AP">APCPDCL (Andhra Pradesh Central - Vijayawada, Guntur, Krishna, Prakasam)</option>
          </optgroup>

          <optgroup label="⚡ KARNATAKA (KERC LT-2a Domestic)">
            <option value="BESCOM-Karnataka">BESCOM (Bangalore Electricity Supply - Bengaluru, Kolar, Tumakuru)</option>
          </optgroup>

          <optgroup label="⚡ TAMIL NADU (TNERC Domestic)">
            <option value="TANGEDCO-TamilNadu">TANGEDCO / TNEB (Tamil Nadu - 100 Units Free Universal Subsidy)</option>
          </optgroup>

          <optgroup label="⚡ MAHARASHTRA (MERC Domestic)">
            <option value="MSEDCL-Maharashtra">MSEDCL (Maharashtra Mahavitaran - Mumbai Suburbs, Pune, Nagpur, Nashik)</option>
          </optgroup>

          <optgroup label="⚡ DELHI NCT (DERC Domestic)">
            <option value="BSES-Delhi">BSES Rajdhani / Yamuna (Delhi NCT - 200 Units 100% Free Subsidy)</option>
          </optgroup>

          <optgroup label="⚡ UTTAR PRADESH (UPERC LMV-1)">
            <option value="UPPCL-UP">UPPCL (Uttar Pradesh - PVVNL Noida/Ghaziabad, MVVNL Lucknow, DVVNL, PuVVNL)</option>
          </optgroup>

          <optgroup label="⚡ GUJARAT (GERC RGP Domestic)">
            <option value="GUVCL-Gujarat">GUVCL (Gujarat - DGVCL Surat, MGVCL Vadodara, PGVCL Rajkot, UGVCL Ahmedabad)</option>
          </optgroup>

          <optgroup label="⚡ KERALA (KSERC LT-1A)">
            <option value="KSEB-Kerala">KSEB (Kerala State Electricity Board - Thiruvananthapuram, Kochi, Kozhikode)</option>
          </optgroup>
        </select>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onNext}
          className="btn-orange-primary text-sm flex items-center gap-2"
        >
          <span>Continue to Appliances</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
