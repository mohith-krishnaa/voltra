import React, { useState } from 'react';
import { 
  Sparkles, 
  Sun, 
  Percent, 
  ShieldCheck, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  Copy, 
  Clock, 
  Gift, 
  Zap, 
  CheckCircle2,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OFFERS = [
  {
    id: 'pmsurya',
    category: 'Government Subsidy',
    badge: 'Govt Approved',
    title: 'PM Surya Ghar: Muft Bijli Yojana',
    benefit: 'Up to ₹78,000 Direct Subsidy',
    description: 'Get direct central financial assistance for installing 1kW to 3kW rooftop solar systems. Zero electricity bill for up to 300 units/month.',
    code: 'PMSURYA78',
    validity: 'Valid till 31 Dec 2026',
    applicableTo: 'All Domestic Homeowners (1-Phase / 3-Phase)',
    actionText: 'Apply on National Portal',
    url: 'https://pmsuryaghar.gov.in',
    highlights: ['₹30,000 for 1kW system', '₹60,000 for 2kW system', '₹78,000 for 3kW+ system', 'Net-metering grid tie-in']
  },
  {
    id: 'gruhajyothi',
    category: 'State Welfare Scheme',
    badge: 'Telangana Zero Bill',
    title: 'Gruha Jyothi Scheme (200 Units Free)',
    benefit: '100% Free Electricity (<200 Units)',
    description: 'Telangana government provides zero electricity bills for domestic connections consuming under 200 units per month when linked to Aadhaar and Praja Palana.',
    code: 'GRUHA200',
    validity: 'Active (Ongoing Welfare Scheme)',
    applicableTo: 'Telangana Domestic LT-1 Consumers (<200 kWh/mo)',
    actionText: 'Check Eligibility & Guidelines',
    url: 'https://tgspdcl.cgg.gov.in',
    highlights: ['Zero energy charges', 'Zero fixed customer charges', 'Aadhaar + USC registration required', 'Auto-applied on monthly bill']
  },
  {
    id: 'bee5star',
    category: 'Energy Efficiency Rebate',
    badge: 'BEE Cashback',
    title: 'BEE 5-Star Inverter Appliance Upgrade Rebate',
    benefit: 'Save ₹3,500 – ₹5,000 / Year',
    description: 'Replace standard non-inverter 3-star ACs or old single-door refrigerators with Bureau of Energy Efficiency (BEE) 5-Star BLDC inverter models for instant recurring bill drops.',
    code: 'BEE5STAR',
    validity: 'Seasonal Manufacturer Rebate',
    applicableTo: 'All Domestic Consumers upgrading high-wattage loads',
    actionText: 'Simulate with What-If',
    highlights: ['Up to 45% lower active power draw', 'High seasonal energy efficiency ratio (ISEER > 5.0)', 'Eligible for manufacturer exchange credits']
  },
  {
    id: 'earlybird',
    category: 'DISCOM Cash Rebate',
    badge: 'Instant 1.5% Off',
    title: 'TGSPDCL / DISCOM Prompt Online Payment Discount',
    benefit: '1.5% Bill Discount',
    description: 'Pay your monthly electricity invoice within 5 days of bill presentation via digital UPI / NetBanking for an automated prompt-payment rebate credit.',
    code: 'PROMPT15',
    validity: 'Valid on all monthly billing cycles',
    applicableTo: 'All State Domestic & Commercial Connections',
    actionText: 'View State Tariff Orders',
    highlights: ['1.5% rebate credited in next cycle', 'Zero UPI processing surcharge', 'Prevents delayed payment surcharges (DPS)']
  },
  {
    id: 'todsolar',
    category: 'Tariff Time-of-Day',
    badge: '20% Cheaper',
    title: 'Solar Super Off-Peak Daytime Window Rebate',
    benefit: '20% Lower Daytime Tariff',
    description: 'Shift high energy loads (washing machines, EV chargers, heavy pumping) between 10:00 AM and 4:00 PM during peak solar injection periods to benefit from lower solar slab rates.',
    code: 'TODSOLAR20',
    validity: 'Active DISCOM Time-of-Day Grid Rule',
    applicableTo: 'Smart Meter & High-Load Domestic Connections',
    actionText: 'View ToD Hours Matrix',
    highlights: ['10 AM - 4 PM: 20% discount on base unit tariff', '6 PM - 10 PM: Avoid 20% peak surcharge', 'Saves ₹400-₹800/mo on AC/Washing machine']
  },
  {
    id: 'rooftopeco',
    category: 'Eco Green Initiative',
    badge: 'Carbon Credit',
    title: 'Green Energy Consumer Certification & Net-Metering',
    benefit: 'Green Energy Certificate + Grid Banking',
    description: 'Opt for 100% renewable power injection via net-metering. Surplus energy is banked and compensated at ERC-approved feed-in tariffs on your bi-monthly bill.',
    code: 'ECOGREEN',
    validity: 'Open Enrollment',
    applicableTo: 'Solar Rooftop & Prosumer Households',
    actionText: 'Learn Net-Metering Process',
    highlights: ['Feed-in tariff credits for export', 'Official state green energy certificate', 'Zero carbon footprint household']
  }
];

export default function OffersView({ onApplyOffer, onStartSolar }) {
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [appliedOffer, setAppliedOffer] = useState(null);

  const categories = ['All', 'Government Subsidy', 'State Welfare Scheme', 'Energy Efficiency Rebate', 'DISCOM Cash Rebate', 'Tariff Time-of-Day', 'Eco Green Initiative'];

  const filteredOffers = selectedCategory === 'All' 
    ? OFFERS 
    : OFFERS.filter(o => o.category === selectedCategory);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApply = (offer) => {
    setAppliedOffer(offer.code);
    if (onApplyOffer) {
      onApplyOffer(offer);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-100 dark:bg-orange-950 text-[#E15B2D]">
              VERIFIED REBATES & SCHEMES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Recommended Electricity Offers & Subsidies
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Take advantage of central government rooftop solar subsidies, DISCOM prompt-payment rebates, Gruha Jyothi zero-bill eligibility, and BEE 5-star appliance incentives.
          </p>
        </div>

        {onStartSolar && (
          <button
            onClick={onStartSolar}
            className="btn-orange-primary flex items-center gap-2 text-xs py-2.5 px-4 flex-shrink-0 self-start md:self-auto cursor-pointer shadow-sm"
          >
            <Sun className="w-4 h-4" />
            <span>PM Surya Ghar Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#E15B2D] text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOffers.map((offer) => {
          const isCopied = copiedCode === offer.code;
          const isApplied = appliedOffer === offer.code;

          return (
            <div
              key={offer.id}
              className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    {offer.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#E15B2D]">{offer.badge}</span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">{offer.title}</h3>
                  <div className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">{offer.benefit}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">{offer.description}</p>
                </div>

                {/* Key Highlights */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-500">
                  {offer.highlights?.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E15B2D] flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                {offer.url ? (
                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-orange-primary text-xs py-2 px-3 flex items-center gap-1.5"
                  >
                    <span>{offer.actionText || 'Apply Now'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <button
                    onClick={() => handleApply(offer)}
                    className="btn-orange-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>{isApplied ? 'Applied' : 'Apply Rebate'}</span>
                  </button>
                )}

                <button
                  onClick={() => copyCode(offer.code)}
                  className="btn-outline-card text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span className="font-mono font-bold">{isCopied ? 'Copied' : offer.code}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
