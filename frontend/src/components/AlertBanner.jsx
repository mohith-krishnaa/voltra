import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  X, 
  MessageSquare, 
  Share2, 
  Check 
} from 'lucide-react';

export default function AlertBanner({ alerts, onAcknowledge }) {
  const [sentAlertId, setSentAlertId] = useState(null);

  if (!alerts || alerts.length === 0) return null;

  const handleShareToWhatsApp = (alert) => {
    const text = `⚡ *VOLTRA ENERGY ALERT*\n\n${alert.title}\n\n📝 ${alert.message}\n\n👉 Track live on Voltra App: https://voltra.netlify.app`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setSentAlertId(alert.id || alert.title);
    setTimeout(() => setSentAlertId(null), 3000);
  };

  return (
    <div className="space-y-3 mb-6">
      {alerts.map((alert) => {
        const isDanger = alert.severity === 'danger' || alert.alert_type === 'OVERAGE_WARNING';
        const isSuccess = alert.severity === 'success';
        const isSent = sentAlertId === (alert.id || alert.title);

        return (
          <div
            key={alert.id || alert.title}
            className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
              isDanger
                ? 'bg-red-500/10 border-red-500/30 text-red-100'
                : isSuccess
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-100'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className={`p-2.5 rounded-xl flex-shrink-0 mt-0.5 ${
                isDanger ? 'bg-red-500/20 text-red-400' : isSuccess ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {isDanger ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : isSuccess ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <TrendingUp className="h-5 w-5" />
                )}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm tracking-wide text-white">
                  {alert.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  {alert.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
              <button
                type="button"
                onClick={() => handleShareToWhatsApp(alert)}
                className="px-3 py-1.5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Forward Alert to WhatsApp"
              >
                {isSent ? <Check className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                <span>{isSent ? 'Sent' : 'WhatsApp Alert'}</span>
              </button>

              {onAcknowledge && alert.id && (
                <button
                  type="button"
                  onClick={() => onAcknowledge(alert.id)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                  title="Dismiss Alert"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
