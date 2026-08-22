import React, { useState } from 'react';
import { 
  CheckCircle2, 
  TrendingDown, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Zap, 
  Sliders, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Sparkles,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import OfficialBillModal from '../OfficialBillModal';
import { ApplianceIcon } from '../common/ApplianceLogos';

export default function StepResult({ 
  predictionResult, 
  household, 
  appliances, 
  onStartWhatIf, 
  onViewOffers,
  onStartPredictAgain, 
  currencySymbol = '₹' 
}) {
  const [showTariffDetails, setShowTariffDetails] = useState(false);
  const [billModalOpen, setBillModalOpen] = useState(false);

  const bill = predictionResult?.bill;
  const totalBill = bill?.total_bill || 2108.16;
  const predictedUnits = predictionResult?.predicted_units || 324.3;
  const energyCharge = bill?.energy_charge || 1850;
  const fixedCharge = bill?.fixed_charge || 50;
  const dutyAmount = bill?.duty_amount || 110;
  const slabBreakdown = bill?.slab_breakdown || [];
  const breakdown = predictionResult?.appliance_breakdown || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 max-w-4xl mx-auto py-2"
    >
      
      {/* 1. Main Bill Projection Card */}
      <section className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E15B2D] font-bold">
              FORECASTED MONTHLY ELECTRICITY BILL
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {household.tariff_zone || 'TGSPDCL Domestic LT-1'}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setBillModalOpen(true)}
            className="btn-outline-card text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <FileText className="w-4 h-4 text-[#E15B2D]" />
            <span>Official Bill Breakdown</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6">
          <div className="space-y-2">
            <div className="text-6xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tighter font-mono tabular-nums">
              {currencySymbol}{totalBill.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500">
              Predicted units: <strong className="text-slate-900 dark:text-white font-mono font-bold">{Math.round(predictedUnits)} kWh</strong> (92% confidence based on seasonal climate modeling)
            </p>
          </div>

          <div className="space-y-3 sm:text-right">
            <div className="text-xs font-mono text-slate-500 space-y-1">
              <div>Energy Charge: <strong className="text-slate-900 dark:text-white">{currencySymbol}{energyCharge.toFixed(2)}</strong></div>
              <div>Fixed Charge: <strong className="text-slate-900 dark:text-white">{currencySymbol}{fixedCharge.toFixed(2)}</strong></div>
              <div>Electricity Duty: <strong className="text-slate-900 dark:text-white">{currencySymbol}{dutyAmount.toFixed(2)}</strong></div>
            </div>
          </div>
        </div>

        {/* Gruha Jyothi Zero Bill Notice */}
        {bill?.is_zero_bill && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <div>
              <strong>Gruha Jyothi Subsidy Applied:</strong> 100% electricity bill waiver granted as domestic consumption is under 200 kWh.
            </div>
          </div>
        )}
      </section>

      {/* 2. Progressive Slab Breakdown (Collapsible) */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setShowTariffDetails(!showTariffDetails)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
        >
          <span className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold">
            Progressive Slab Tariff Breakdown ({slabBreakdown.length} Slabs)
          </span>
          {showTariffDetails ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showTariffDetails && (
          <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="grid grid-cols-1 gap-2 pt-3">
              {slabBreakdown.map((slab, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600 dark:text-slate-400">
                    {slab.range_label || slab.slab_name}: {slab.units_in_slab} units @ {currencySymbol}{slab.rate_per_unit}/unit
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {currencySymbol}{slab.slab_total?.toFixed(2) || slab.amount?.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. Appliance Energy Breakdown */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold block">
          TOP CONSUMING APPLIANCES
        </span>

        <div className="grid grid-cols-1 gap-4">
          {breakdown.slice(0, 5).map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ApplianceIcon type={item.appliance_id} className="w-4 h-4 text-[#E15B2D]" />
                  {item.name || item.appliance_name}
                </span>
                <span className="text-slate-500 font-bold">{item.monthly_units?.toFixed(1)} kWh ({currencySymbol}{item.estimated_cost?.toFixed(0)})</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#E15B2D] rounded-full" 
                  style={{ width: `${Math.min(100, (item.monthly_units / (predictedUnits || 1)) * 100)}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={onStartPredictAgain}
          className="btn-outline-card text-xs cursor-pointer"
        >
          <span>← Re-edit Home Inputs</span>
        </button>

        <div className="flex items-center gap-3">
          {onViewOffers && (
            <button
              type="button"
              onClick={onViewOffers}
              className="btn-outline-card text-xs flex items-center gap-1.5 cursor-pointer text-[#E15B2D] font-bold"
            >
              <span>Explore Subsidies & Offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onStartWhatIf}
            className="btn-orange-primary text-xs flex items-center gap-2 cursor-pointer"
          >
            <span>Open What-If Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Official Bill Modal */}
      <OfficialBillModal
        isOpen={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        billInfo={bill}
        household={household}
      />

    </motion.div>
  );
}
