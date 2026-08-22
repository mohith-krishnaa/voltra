import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Share2, 
  Check, 
  Copy, 
  IndianRupee, 
  Clock, 
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ApplianceIcon } from './common/ApplianceLogos';

export default function BillSplitterView({ predictionResult, currencySymbol = '₹' }) {
  const totalBillAmount = Math.round(predictionResult?.bill?.total_bill || 3450);
  const [totalBill, setTotalBill] = useState(totalBillAmount);
  const [copied, setCopied] = useState(false);

  const [roommates, setRoommates] = useState([
    { id: 1, name: 'Room 1 (Rahul)', acHours: 6, hasFridgeShare: true },
    { id: 2, name: 'Room 2 (Aditya)', acHours: 4, hasFridgeShare: true },
    { id: 3, name: 'Room 3 (Naveen)', acHours: 1, hasFridgeShare: true },
  ]);

  const handleAddRoommate = () => {
    const nextId = roommates.length + 1;
    setRoommates([
      ...roommates,
      { id: nextId, name: `Room ${nextId} (Flatmate)`, acHours: 4, hasFridgeShare: true }
    ]);
  };

  const handleRemoveRoommate = (id) => {
    if (roommates.length <= 2) return;
    setRoommates(roommates.filter(r => r.id !== id));
  };

  const handleUpdate = (id, field, value) => {
    setRoommates(roommates.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // Algorithm: 40% Common baseline (equal split) + 60% AC/Dynamic runtime (weighted split)
  const commonPoolTotal = totalBill * 0.40;
  const commonSharePerPerson = commonPoolTotal / roommates.length;

  const acPoolTotal = totalBill * 0.60;
  const totalAcHours = roommates.reduce((sum, r) => sum + (r.acHours || 0), 0) || 1;

  const calculations = roommates.map(r => {
    const acRatio = (r.acHours || 0) / totalAcHours;
    const individualAcShare = acPoolTotal * acRatio;
    const totalDue = Math.round(commonSharePerPerson + individualAcShare);
    const percentage = ((totalDue / totalBill) * 100).toFixed(1);

    return {
      ...r,
      commonShare: Math.round(commonSharePerPerson),
      acShare: Math.round(individualAcShare),
      totalDue,
      percentage
    };
  });

  const handleCopyWhatsApp = () => {
    let text = "⚡ Voltra - Roommate Electricity Bill Split\n";
    text += "Total Invoiced Bill: " + currencySymbol + totalBill.toLocaleString('en-IN') + "\n\n";
    calculations.forEach((c) => {
      text += "👤 " + c.name + ": " + currencySymbol + c.totalDue + " (" + c.percentage + "%)\n";
      text += "   • Baseline Common: " + currencySymbol + c.commonShare + "\n";
      text += "   • Room AC (" + c.acHours + "h/day): " + currencySymbol + c.acShare + "\n\n";
    });
    text += "Calculated via Voltra Smart Bill Splitter";

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-100 dark:bg-orange-950 text-[#E15B2D]">
              SHARED APARTMENTS & FLATS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Fair Roommate Electricity Bill Splitter
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Divides baseline shared power (fridge, lights, router) equally while allocating high-wattage bedroom ACs proportionally to actual daily runtime hours.
          </p>
        </div>

        <button
          onClick={handleCopyWhatsApp}
          className="btn-orange-primary text-xs py-2.5 px-4 flex items-center gap-2 self-start md:self-auto cursor-pointer shadow-sm"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Export to WhatsApp'}</span>
        </button>
      </div>

      {/* Total Bill Input */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
            MONTHLY INVOICED BILL AMOUNT
          </span>
          <p className="text-xs text-slate-500">
            Enter the exact total amount to divide among flatmates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-black font-mono text-slate-400">{currencySymbol}</span>
          <input
            type="number"
            value={totalBill}
            onChange={(e) => setTotalBill(Math.max(0, parseInt(e.target.value) || 0))}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-2xl font-black font-mono text-slate-900 dark:text-white w-40 text-right focus:outline-none focus:border-[#E15B2D]"
          />
        </div>
      </div>

      {/* Roommates Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
            FLATMATES & AC RUNTIMES ({roommates.length} ROOMS)
          </span>

          <button
            onClick={handleAddRoommate}
            className="btn-outline-card text-xs py-1.5 px-3 flex items-center gap-1.5 text-[#E15B2D] font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Flatmate</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {calculations.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => handleUpdate(c.id, 'name', e.target.value)}
                    className="text-sm font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#E15B2D] focus:outline-none"
                  />
                  {roommates.length > 2 && (
                    <button onClick={() => handleRemoveRoommate(c.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Big Share Due */}
                <div className="p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Calculated Share</span>
                  <div className="text-3xl font-black font-mono text-[#E15B2D]">
                    {currencySymbol}{c.totalDue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs font-mono text-slate-500">{c.percentage}% of total bill</div>
                </div>

                {/* AC Hours Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#E15B2D]" /> AC Runtime:
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{c.acHours} hrs/day</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="16"
                    step="0.5"
                    value={c.acHours}
                    onChange={(e) => handleUpdate(c.id, 'acHours', parseFloat(e.target.value))}
                    className="w-full accent-[#E15B2D] cursor-pointer"
                  />
                </div>
              </div>

              {/* Breakdown Detail */}
              <div className="text-[11px] font-mono text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                <span>Baseline Common: {currencySymbol}{c.commonShare}</span>
                <span>AC Share: {currencySymbol}{c.acShare}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
