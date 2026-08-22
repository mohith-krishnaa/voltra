import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  HelpCircle, 
  AlertTriangle, 
  Layers, 
  Receipt, 
  ArrowUpRight 
} from 'lucide-react';

export default function SlabReceipt({ billInfo }) {
  if (!billInfo) return null;

  const {
    tariff_name,
    total_units,
    applied_category,
    energy_charge,
    fixed_charge,
    duty_rate_percent,
    duty_amount,
    subsidy_applied,
    subsidy_amount,
    total_bill,
    effective_rate_per_kwh,
    slab_breakdown = [],
    currency_symbol = "?"
  } = billInfo;

  return (
    <div className="utility-card p-5 sm:p-6 space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">Discom Slab Receipt & Meter Accounting</h3>
            <p className="text-[11px] text-slate-400">{tariff_name} • Category {applied_category}</p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider self-start sm:self-auto">
          Official Tariff Math
        </span>
      </div>

      {/* Signature Element: Telescopic Slab Ladder Barometer */}
      <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Layers className="h-4 w-4 text-amber-400" />
            <span>Telescopic Slab Ladder</span>
          </div>
          <span className="text-[10px] text-slate-400">Total Billed: <strong className="text-white tabular-nums">{total_units} kWh</strong></span>
        </div>

        {/* Step Ladder Visual Progress Track */}
        <div className="w-full flex h-3.5 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 p-0.5 gap-1">
          {slab_breakdown.filter(s => s.active).map((slab, idx) => {
            const widthPct = Math.max(12, Math.round((slab.units / Math.max(1, total_units)) * 100));
            const colors = [
              'bg-emerald-500', 
              'bg-amber-500', 
              'bg-orange-500', 
              'bg-rose-500', 
              'bg-purple-500'
            ];
            return (
              <div 
                key={idx}
                style={{ width: `${widthPct}%` }}
                className={`${colors[idx % colors.length]} rounded-sm transition-all relative group cursor-pointer`}
                title={`${slab.label}: ${slab.units} units @ ${currency_symbol}${slab.rate}`}
              />
            );
          })}
        </div>

        {/* Plain-English Explanation */}
        <div className="flex items-start gap-2 text-[11px] text-slate-400 pt-1">
          <HelpCircle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-200">How Slabs Work:</strong> Units are charged in progressive blocks. Your first {slab_breakdown[0]?.units || 100} units are locked at the cheapest base rate ({currency_symbol}{slab_breakdown[0]?.rate}/unit), before higher blocks apply.
          </p>
        </div>
      </div>

      {/* Itemized Slab Breakdown Rows */}
      <div className="space-y-2 text-xs">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          Itemized Energy Slabs:
        </div>

        {slab_breakdown.map((slab, idx) => (
          <div
            key={idx}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-2.5 rounded-xl transition-all ${
              slab.active
                ? 'bg-slate-900/90 border border-slate-800 text-slate-200'
                : 'text-slate-600 opacity-40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${slab.active ? 'bg-amber-400' : 'bg-slate-700'}`} />
              <span className="font-semibold text-slate-200 truncate">{slab.label}</span>
              <span className="text-[11px] text-slate-400 tabular-nums">(@ {currency_symbol}{slab.rate}/unit)</span>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 tabular-nums self-end sm:self-auto text-xs">
              <span className="text-slate-400">{slab.units} kWh</span>
              <span className="font-bold text-white min-w-[5rem] text-right">
                {currency_symbol}{slab.amount.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Surcharge & Utility Standing Charges */}
      <div className="pt-3 border-t border-dashed border-slate-800 space-y-2 text-xs text-slate-300">
        <div className="flex justify-between">
          <span className="text-slate-400">Subtotal Energy Charge:</span>
          <span className="tabular-nums text-slate-200 font-semibold">{currency_symbol}{energy_charge.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Fixed Customer / Meter Charge:</span>
          <span className="tabular-nums text-slate-200">{currency_symbol}{fixed_charge.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">State Electricity Duty ({duty_rate_percent}%):</span>
          <span className="tabular-nums text-slate-200">{currency_symbol}{duty_amount.toFixed(2)}</span>
        </div>

        {subsidy_applied && (
          <div className="flex justify-between text-emerald-400 font-bold bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/30">
            <span>Gruha Jyothi Zero-Bill Subsidy:</span>
            <span className="tabular-nums">-{currency_symbol}{subsidy_amount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Net Total Amount Payable */}
      <div className="pt-3 border-t border-slate-800 flex items-end justify-between">
        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Total Net Estimated Bill</span>
          <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 mt-0.5 tabular-nums">
            <ShieldCheck className="h-3.5 w-3.5" />
            Avg. {currency_symbol}{effective_rate_per_kwh} / kWh
          </span>
        </div>

        <div className="text-right">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight">
            {currency_symbol}{total_bill.toFixed(2)}
          </span>
        </div>
      </div>

    </div>
  );
}
