import React, { useRef } from 'react';
import { X, Printer, CheckCircle, ShieldCheck, Download, Zap, Building } from 'lucide-react';

export default function OfficialBillModal({ isOpen, onClose, billInfo, household }) {
  if (!isOpen || !billInfo) return null;

  const printAreaRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const {
    tariff_name,
    state,
    board_code,
    applied_category,
    currency_symbol,
    total_units,
    energy_charge,
    fixed_charge,
    duty_rate_label,
    duty_amount,
    fsa_charge,
    subtotal_before_subsidy,
    subsidy_applied,
    subsidy_amount,
    total_bill,
    effective_rate_per_kwh,
    slab_breakdown = []
  } = billInfo;

  const billNo = "TG-2026-08-" + Math.floor(100000 + Math.random() * 900000);
  const uscNo = "10" + Math.floor(10000000 + Math.random() * 90000000);
  const meterNo = "MTR-" + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Zap className="h-4 w-4 fill-emerald-400" />
            </span>
            <span className="font-bold text-sm text-slate-200">
              Official Utility Bill Simulation Receipt
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Bill</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* The Physical Bill Replica (styled like authentic TGSPDCL electricity bill) */}
        <div className="p-6 sm:p-8 bg-amber-50/95 text-slate-900 font-mono text-xs selection:bg-amber-200 selection:text-slate-900" ref={printAreaRef}>
          
          {/* Bill Header */}
          <div className="border-b-2 border-slate-900 pb-3 text-center">
            <h2 className="font-extrabold text-sm sm:text-base tracking-wider uppercase">
              {board_code === 'TGSPDCL' ? 'SOUTHERN POWER DISTRIBUTION COMPANY OF TELANGANA LIMITED (TGSPDCL)' : tariff_name}
            </h2>
            <p className="text-[10px] text-slate-700 font-sans mt-0.5">
              Govt. of {state} Undertaking • LT Electricity Consumer Bill
            </p>
            <div className="flex justify-between items-center text-[10px] font-bold border-t border-dashed border-slate-400 mt-2 pt-1">
              <span>BILL NO: {billNo}</span>
              <span>BILL DATE: 22-AUG-2026</span>
              <span>DUE DATE: 06-SEP-2026</span>
            </div>
          </div>

          {/* Consumer & Meter Information Grid */}
          <div className="grid grid-cols-2 gap-3 py-3 border-b border-slate-900 text-[11px]">
            <div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">USC NO (Unique SC):</span>
                <span className="font-bold">{uscNo}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Consumer Name:</span>
                <span className="font-bold">RESIDENTIAL USER</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Tariff Category:</span>
                <span className="font-bold text-blue-900">{applied_category}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Connected Load:</span>
                <span className="font-bold">3.00 kW (Single Phase)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Meter Number:</span>
                <span className="font-bold">{meterNo}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Previous Reading:</span>
                <span className="font-bold">12450</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Current Reading:</span>
                <span className="font-bold">{12450 + Math.round(total_units)}</span>
              </div>
              <div className="flex justify-between py-0.5 bg-amber-200/80 px-1 font-bold">
                <span>BILLED UNITS (kWh):</span>
                <span className="text-sm">{total_units} Units</span>
              </div>
            </div>
          </div>

          {/* Slabs Breakdown Table */}
          <div className="py-3 border-b border-slate-900">
            <div className="font-bold text-[10px] uppercase tracking-wider text-slate-700 mb-1">
              Consumption Slabs & Telescopic Energy Charges:
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-400 text-[10px] text-slate-600">
                  <th className="pb-1 font-semibold">Slab Description</th>
                  <th className="pb-1 font-semibold text-right">Units</th>
                  <th className="pb-1 font-semibold text-right">Rate ({currency_symbol})</th>
                  <th className="pb-1 font-semibold text-right">Amount ({currency_symbol})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {slab_breakdown.filter(s => s.active && s.units > 0).map((slab, idx) => (
                  <tr key={idx} className="py-0.5">
                    <td className="py-1">{slab.label}</td>
                    <td className="py-1 text-right">{slab.units}</td>
                    <td className="py-1 text-right">{slab.rate.toFixed(2)}</td>
                    <td className="py-1 text-right font-bold">{slab.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Charges Breakdown Calculation */}
          <div className="py-3 space-y-1 text-[11px] border-b-2 border-slate-900">
            <div className="flex justify-between">
              <span className="text-slate-700">1. Total Energy Charges (CC):</span>
              <span className="font-bold">{currency_symbol}{energy_charge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-700">2. Customer / Fixed Meter Charges:</span>
              <span className="font-bold">{currency_symbol}{fixed_charge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-700">3. Electricity Duty ({duty_rate_label}):</span>
              <span className="font-bold">{currency_symbol}{duty_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-700">4. Fuel Surcharge Adjustment (FSA/FSC):</span>
              <span className="font-bold">{currency_symbol}{fsa_charge.toFixed(2)}</span>
            </div>

            <div className="flex justify-between pt-1 border-t border-dashed border-slate-400 font-bold">
              <span>Gross Total Assessment:</span>
              <span>{currency_symbol}{subtotal_before_subsidy.toFixed(2)}</span>
            </div>

            {/* Gruha Jyothi / Subsidy row */}
            {subsidy_applied && (
              <div className="flex justify-between text-emerald-800 font-bold bg-emerald-100 p-1 rounded">
                <span>Government Gruha Jyothi Subsidy (≤200 Units):</span>
                <span>-{currency_symbol}{subsidy_amount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Final Net Amount */}
          <div className="pt-3 flex items-center justify-between bg-amber-100 p-3 rounded-lg border border-slate-900 mt-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-700 block">
                NET AMOUNT PAYABLE BY DUE DATE
              </span>
              <span className="text-[10px] text-slate-500 font-sans">
                Effective tariff: {currency_symbol}{effective_rate_per_kwh} / unit
              </span>
            </div>

            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono">
                {currency_symbol}{total_bill.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Barcode watermark imitation */}
          <div className="mt-4 pt-2 border-t border-slate-400 flex items-center justify-between text-[9px] text-slate-500">
            <span>Scan to Pay via UPI / TGSPDCL App</span>
            <span className="tracking-widest font-mono">||| |||| || |||||| |||| ||| |||||||</span>
            <span>Generated by Voltra AI Engine</span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
          >
            Close Receipt
          </button>
        </div>

      </div>
    </div>
  );
}
