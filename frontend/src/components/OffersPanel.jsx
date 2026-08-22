import React, { useState } from 'react';
import { 
  Tag, 
  Percent, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  Smartphone,
  CreditCard,
  Zap
} from 'lucide-react';
import offersData from '../data/offers.json';

export default function OffersPanel({ currencySymbol = '?' }) {
  const [copiedCode, setCopiedCode] = useState(null);
  const [filterType, setFilterType] = useState('All');

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredOffers = offersData.filter(o => 
    filterType === 'All' || o.provider === filterType || o.discount_type.includes(filterType)
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="utility-card p-5 sm:p-6 border-l-4 border-l-amber-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Tag className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-100">Utility Bill Payment Offers & Discounts</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                BBPS Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified UPI, Credit Card & Wallet cashback offers when paying your state electricity bill.
            </p>
          </div>
        </div>

        {/* Informational Disclaimer Badge */}
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2 text-xs text-slate-400 max-w-sm">
          <AlertCircle className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <span className="text-[10px] leading-tight">
            Offers are curated for informational purposes. Terms are governed by respective payment gateways (GPay, PhonePe, CRED).
          </span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-slate-400 font-semibold mr-1">Filter by:</span>
        {['All', 'Google Pay', 'PhonePe', 'CRED', 'Amazon Pay', 'Paytm'].map(provider => (
          <button
            key={provider}
            onClick={() => setFilterType(provider)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filterType === provider
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {provider}
          </button>
        ))}
      </div>

      {/* Offers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOffers.map((offer) => (
          <div 
            key={offer.id}
            className="utility-card utility-card-hover p-5 flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Card Header: Provider badge & discount type */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {offer.provider}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {offer.discount_type}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-sm text-slate-100 leading-snug">{offer.title}</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{offer.description}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              
              {/* Promo Code & Copy Action */}
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/80 border border-dashed border-slate-700">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Promo Code</span>
                  <span className="font-mono font-bold text-xs text-amber-400 tracking-wider">{offer.code}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(offer.code)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center gap-1 transition"
                  title="Copy code"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Offer Metadata & Discom eligibility */}
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Min Bill: <strong className="text-slate-200 font-mono">{currencySymbol}{offer.min_bill}</strong></span>
                <span>Valid: <strong className="text-slate-200">{offer.valid_till}</strong></span>
              </div>

              {/* External Link Action */}
              <a
                href={offer.action_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 hover:border-amber-500/40 transition active:scale-95"
              >
                <span>Avail on {offer.provider}</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
