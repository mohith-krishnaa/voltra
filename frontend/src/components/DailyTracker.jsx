import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Plus, 
  Activity,
  Flame,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function DailyTracker({ householdId = 1, currencySymbol = "?", onAlertsUpdated }) {
  const [dailyLogs, setDailyLogs] = useState([]);
  const [adaptiveForecast, setAdaptiveForecast] = useState(null);
  const [newUnits, setNewUnits] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogsAndForecast();
  }, [householdId]);

  const fetchLogsAndForecast = async () => {
    setLoading(true);
    try {
      const [logsRes, forecastRes] = await Promise.all([
        fetch(`/api/daily-logs/${householdId}`),
        fetch(`/api/forecast/adaptive/${householdId}`)
      ]);

      if (logsRes.ok) {
        const logs = await logsRes.json();
        setDailyLogs(logs);
      }

      if (forecastRes.ok) {
        const forecast = await forecastRes.json();
        setAdaptiveForecast(forecast);
        if (onAlertsUpdated && forecast.alerts) {
          onAlertsUpdated(forecast.alerts);
        }
      }
    } catch (err) {
      console.error('Error fetching tracker data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!newUnits || isNaN(newUnits)) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch('/api/daily-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          household_id: householdId,
          log_date: today,
          units_consumed: parseFloat(newUnits)
        })
      });

      if (res.ok) {
        setNewUnits('');
        fetchLogsAndForecast();
      }
    } catch (err) {
      console.error('Error adding daily log:', err);
    }
  };

  const pace = adaptiveForecast?.pace;
  const projected = adaptiveForecast?.projected_units;
  const budget = adaptiveForecast?.budget_units;
  const isOverBudget = pace?.status === 'over_budget';

  return (
    <div className="space-y-6">
      
      {/* Tracker Header */}
      <div className="utility-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">Daily Meter Tracker & Mid-Month Pace</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Log your actual physical meter readings daily to prevent accidental tier slab escalations before bill close.
            </p>
          </div>
        </div>

        {/* Quick Log Form */}
        <form onSubmit={handleAddLog} className="flex items-center gap-2">
          <input
            type="number"
            step="0.1"
            placeholder="Today's kWh..."
            value={newUnits}
            onChange={(e) => setNewUnits(e.target.value)}
            className="w-36 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-amber-500/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Log Meter</span>
          </button>
        </form>
      </div>

      {/* Pace Alert Telemetry Cards */}
      {adaptiveForecast && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="utility-card p-5 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Target Budget</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-200 tabular-nums">
                {budget} kWh
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Slab boundary limit target</p>
          </div>

          <div className={`utility-card p-5 space-y-1 ${
            isOverBudget 
              ? 'border-rose-500/50 bg-rose-950/20 text-rose-300' 
              : 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
              Projected Month-End Usage
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold tabular-nums">
                {projected} kWh
              </span>
            </div>
            <p className="text-xs font-semibold mt-1 flex items-center gap-1">
              {isOverBudget ? <AlertTriangle className="h-3.5 w-3.5 text-rose-400" /> : <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />}
              <span>{isOverBudget ? 'Tracking above budget pace' : 'Well within optimal slab budget'}</span>
            </p>
          </div>

          <div className="utility-card p-5 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Forecasted Bill Total</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                {currencySymbol}{adaptiveForecast.projected_bill}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Based on daily running velocity</p>
          </div>

        </div>
      )}

      {/* Historical Daily Readings List */}
      <div className="utility-card p-5 space-y-4">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
          <Activity className="h-4 w-4 text-emerald-400" />
          <span>Recent Meter Readings Log</span>
        </h3>

        {dailyLogs.length > 0 ? (
          <div className="divide-y divide-slate-800 text-xs">
            {dailyLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-mono text-slate-300">{log.log_date}</span>
                </div>
                <span className="font-mono font-bold text-slate-100 tabular-nums">
                  {log.units_consumed} kWh
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500">
            No meter readings recorded yet. Use the form above to log today's consumption.
          </div>
        )}
      </div>

    </div>
  );
}
