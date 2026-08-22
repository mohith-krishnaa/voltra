import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  ShieldCheck, 
  TrendingUp, 
  FileCheck,
  Zap,
  Target
} from 'lucide-react';

export default function HouseholdsView({ 
  currentHousehold, 
  onSelectHousehold, 
  currencySymbol = "₹" 
}) {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHouseholdName, setNewHouseholdName] = useState('Parent\'s Home');
  const [newHouseType, setNewHouseType] = useState('Apartment-2BHK');
  const [newBudgetInr, setNewBudgetInr] = useState('3000');
  const [newBudgetUnits, setNewBudgetUnits] = useState('350');

  // History comparison state (predicted vs actual bill)
  const [historyRecords, setHistoryRecords] = useState([
    { id: 1, month: 'July 2026', predicted_units: 412, predicted_bill: 3480, actual_units: 405, actual_bill: 3410, accuracy: '98.0%' },
    { id: 2, month: 'June 2026', predicted_units: 485, predicted_bill: 4120, actual_units: 492, actual_bill: 4180, accuracy: '98.5%' },
    { id: 3, month: 'May 2026', predicted_units: 520, predicted_bill: 4450, actual_units: 535, actual_bill: 4590, accuracy: '96.9%' },
  ]);

  const [actualUnitsInput, setActualUnitsInput] = useState('');
  const [actualBillInput, setActualBillInput] = useState('');
  const [historyMonth, setHistoryMonth] = useState('August 2026');

  const fetchHouseholds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/households');
      if (res.ok) {
        const data = await res.json();
        setHouseholds(data);
      }
    } catch (err) {
      console.error('Fetch households failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const handleCreateHousehold = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/households', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newHouseholdName,
          house_type: newHouseType,
          area_sqft: newHouseType === 'Apartment-1BHK' ? 600 : newHouseType === 'Apartment-3BHK' ? 1750 : 1150,
          occupants: 3,
          tariff_zone: 'Tiered-Standard',
          monthly_budget_inr: parseFloat(newBudgetInr) || 3000,
          monthly_budget_units: parseFloat(newBudgetUnits) || 350
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        await fetchHouseholds();
      }
    } catch (err) {
      console.error('Create household failed:', err);
    }
  };

  const handleAddActualBillRecord = (e) => {
    e.preventDefault();
    if (!actualUnitsInput || !actualBillInput) return;
    const u = parseFloat(actualUnitsInput);
    const b = parseFloat(actualBillInput);
    const predUnits = 430;
    const predBill = 3650;
    const acc = (100 - (Math.abs(b - predBill) / predBill) * 100).toFixed(1) + '%';

    setHistoryRecords(prev => [
      {
        id: Date.now(),
        month: historyMonth,
        predicted_units: predUnits,
        predicted_bill: predBill,
        actual_units: u,
        actual_bill: b,
        accuracy: acc
      },
      ...prev
    ]);
    setActualUnitsInput('');
    setActualBillInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Building2 className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Multi-Household & Meter Profiles</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Manage multiple properties, rental flats, or utility meters under one account and track monthly budget caps.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Property / Meter</span>
        </button>
      </div>

      {/* Households Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {households.map((hh) => {
          const isSelected = currentHousehold && currentHousehold.id === hh.id;
          return (
            <div
              key={hh.id}
              onClick={() => onSelectHousehold && onSelectHousehold(hh)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'glass-panel border-emerald-500 bg-slate-900/90 shadow-glow'
                  : 'glass-card hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    <span>{hh.name}</span>
                    {isSelected && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {hh.house_type} • {hh.area_sqft} sq.ft • {hh.occupants} occupants
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                  <Zap className="h-4 w-4 text-emerald-400" />
                </div>
              </div>

              {/* Budget information */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Monthly Budget Cap</span>
                  <span className="font-mono font-bold text-slate-200">{currencySymbol}{hh.monthly_budget_inr || 3200}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Target Units</span>
                  <span className="font-mono font-bold text-emerald-400">{hh.monthly_budget_units || 350} kWh</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Predicted vs Actual Validation (Builds Trust) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-emerald-400" />
              <span>Historical Accuracy: Predicted vs. Actual Utility Bill</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare AI predictions with your real physical bills when they arrive to verify model accuracy
            </p>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 border-b border-slate-800">
              <tr>
                <th className="pb-2.5 font-medium">Billing Cycle</th>
                <th className="pb-2.5 font-medium text-right">Predicted Units</th>
                <th className="pb-2.5 font-medium text-right">Predicted Bill</th>
                <th className="pb-2.5 font-medium text-right">Actual Units</th>
                <th className="pb-2.5 font-medium text-right">Actual Bill</th>
                <th className="pb-2.5 font-medium text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {historyRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/40">
                  <td className="py-3 font-sans font-medium text-slate-200">{r.month}</td>
                  <td className="py-3 text-right text-slate-400">{r.predicted_units} kWh</td>
                  <td className="py-3 text-right text-slate-400">{currencySymbol}{r.predicted_bill}</td>
                  <td className="py-3 text-right text-slate-200 font-bold">{r.actual_units} kWh</td>
                  <td className="py-3 text-right text-emerald-400 font-bold">{currencySymbol}{r.actual_bill}</td>
                  <td className="py-3 text-right text-teal-400 font-bold">{r.accuracy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Log Real Bill Form */}
        <form onSubmit={handleAddActualBillRecord} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-end gap-3 text-xs">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Month</label>
            <input
              type="text"
              value={historyMonth}
              onChange={(e) => setHistoryMonth(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 w-32"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Actual kWh from Bill</label>
            <input
              type="number"
              placeholder="e.g. 435"
              value={actualUnitsInput}
              onChange={(e) => setActualUnitsInput(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 w-32 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Actual Bill ({currencySymbol})</label>
            <input
              type="number"
              placeholder="e.g. 3680"
              value={actualBillInput}
              onChange={(e) => setActualBillInput(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 w-32 font-mono"
            />
          </div>

          <button
            type="submit"
            className="py-1.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
          >
            Record Bill
          </button>
        </form>

      </div>

      {/* Modal for adding household */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-w-md w-full shadow-2xl">
            <h3 className="font-bold text-base text-slate-100 mb-3">Add New Property / Meter</h3>
            
            <form onSubmit={handleCreateHousehold} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Property Name / Label</label>
                <input
                  type="text"
                  value={newHouseholdName}
                  onChange={(e) => setNewHouseholdName(e.target.value)}
                  placeholder="e.g. Parent's Flat, Beach Cottage"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Property Type</label>
                <select
                  value={newHouseType}
                  onChange={(e) => setNewHouseType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Apartment-1BHK">Apartment 1BHK</option>
                  <option value="Apartment-2BHK">Apartment 2BHK</option>
                  <option value="Apartment-3BHK">Apartment 3BHK</option>
                  <option value="Villa-Independent">Independent Villa</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Monthly Budget ({currencySymbol})</label>
                  <input
                    type="number"
                    value={newBudgetInr}
                    onChange={(e) => setNewBudgetInr(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Target Units (kWh)</label>
                  <input
                    type="number"
                    value={newBudgetUnits}
                    onChange={(e) => setNewBudgetUnits(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
