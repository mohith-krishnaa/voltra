import React from 'react';
import { AlertTriangle, CheckCircle2, TrendingUp, X } from 'lucide-react';

export default function AlertBanner({ alerts, onAcknowledge }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {alerts.map((alert) => {
        const isDanger = alert.severity === 'danger' || alert.alert_type === 'OVERAGE_WARNING';
        const isSuccess = alert.severity === 'success';

        return (
          <div
            key={alert.id || alert.title}
            className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 shadow-lg ${
              isDanger
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-200 shadow-rose-950/20'
                : isSuccess
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 shadow-emerald-950/20'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-200 shadow-amber-950/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg mt-0.5 ${
                isDanger ? 'bg-rose-500/20 text-rose-400' : isSuccess ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {isDanger ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : isSuccess ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <TrendingUp className="h-5 w-5" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-wide flex items-center gap-2">
                  {alert.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {alert.message}
                </p>
              </div>
            </div>

            {onAcknowledge && alert.id && (
              <button
                onClick={() => onAcknowledge(alert.id)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
                title="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
