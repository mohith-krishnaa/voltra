import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Trash2, 
  ArrowRight, 
  Zap, 
  Sparkles,
  Search
} from 'lucide-react';

export default function BillUploadView({ currencySymbol = '₹' }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedBills, setUploadedBills] = useState([
    { id: 1, month: 'July 2026', units: 315, amount: 2045, date: '04 Aug 2026', status: 'Verified OCR', usc: '1029384729' },
    { id: 2, month: 'June 2026', units: 360, amount: 2480, date: '03 Jul 2026', status: 'Verified OCR', usc: '1029384729' },
    { id: 3, month: 'May 2026', units: 395, amount: 2810, date: '04 Jun 2026', status: 'Verified OCR', usc: '1029384729' },
  ]);

  const handleSimulateUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploadedBills([
        { id: Date.now(), month: 'August 2026 (Live Bill)', units: 324, amount: 2108, date: 'Today', status: 'Verified OCR', usc: '1029384729' },
        ...uploadedBills
      ]);
    }, 1200);
  };

  const dropzoneClass = dragActive
    ? 'border-[#E15B2D] bg-orange-50/50 dark:bg-orange-950/20'
    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-[#E15B2D] shadow-xs';

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-100 dark:bg-orange-950 text-[#E15B2D]">
              SMART OCR & PAST BILL HISTORY
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Upload Utility Bills & Past Tracking
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Upload PDF or image electricity bills to automatically extract USC numbers, metered units, fuel adjustment charges (FACA), and slab transitions.
          </p>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleSimulateUpload(); }}
        onClick={handleSimulateUpload}
        className={`p-10 sm:p-12 rounded-3xl border-2 border-dashed text-center transition-all cursor-pointer space-y-4 ${dropzoneClass}`}
      >
        <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#E15B2D] flex items-center justify-center mx-auto">
          <UploadCloud className="w-8 h-8" />
        </div>

        <div className="space-y-1 max-w-sm mx-auto">
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            {uploading ? 'Extracting Bill Fields via OCR...' : 'Click to browse or drop electricity bill PDF / Image'}
          </h4>
          <p className="text-xs text-slate-500">
            Supports TGSPDCL, TSSPDCL, BESCOM, TNEB, and MSEDCL monthly consumer invoices (Max 15 MB).
          </p>
        </div>

        <button
          type="button"
          className="btn-orange-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
        >
          <span>Select Document File</span>
        </button>
      </div>

      {/* Historical Uploads Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold block">
          EXTRACTED HISTORICAL BILLS ({uploadedBills.length} CYCLES)
        </span>

        <div className="grid grid-cols-1 gap-3">
          {uploadedBills.map(b => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#E15B2D]" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{b.month}</div>
                  <div className="text-slate-400 text-[11px]">USC: {b.usc} • Uploaded {b.date}</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Metered</span>
                  <span className="font-bold text-slate-900 dark:text-white">{b.units} kWh</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Invoiced Total</span>
                  <span className="font-bold text-[#E15B2D] text-sm">{currencySymbol}{b.amount}</span>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
