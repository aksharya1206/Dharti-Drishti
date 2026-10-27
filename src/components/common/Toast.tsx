import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let borderClass = 'border-forest-200 bg-white text-agri-charcoal';
        let Icon = Info;
        let iconColor = 'text-forest-600';

        if (toast.type === 'success') {
          borderClass = 'border-emerald-200 bg-white';
          Icon = CheckCircle2;
          iconColor = 'text-forest-600';
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-200 bg-white';
          Icon = AlertTriangle;
          iconColor = 'text-agri-amber';
        } else if (toast.type === 'error') {
          borderClass = 'border-red-200 bg-white';
          Icon = AlertCircle;
          iconColor = 'text-agri-red';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg flex items-start gap-3 transition-all duration-300 animate-slide-in ${borderClass}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <h5 className="font-heading font-semibold text-xs text-agri-charcoal">{toast.title}</h5>
              <p className="text-xs text-agri-muted mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-agri-muted hover:text-agri-charcoal p-1 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

