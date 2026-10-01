import React from 'react';
import { ToastNotification } from '../../types/game';
import { Sparkles, AlertCircle, Award, CheckCircle } from 'lucide-react';

interface NotificationToastProps {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notifications,
  onDismiss,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {notifications.slice(-4).map((toast) => {
        let borderClass = 'border-amber-600/60 bg-stone-900/95 text-amber-200';
        let icon = <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />;

        if (toast.type === 'level') {
          borderClass = 'border-amber-400 bg-amber-950/95 text-amber-100 shadow-amber-500/20';
          icon = <Award className="w-5 h-5 text-amber-300 shrink-0 animate-bounce" />;
        } else if (toast.type === 'warning') {
          borderClass = 'border-orange-500/80 bg-stone-900/95 text-orange-200';
          icon = <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />;
        } else if (toast.type === 'info') {
          borderClass = 'border-sky-500/60 bg-stone-900/95 text-sky-200';
          icon = <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            onClick={() => onDismiss(toast.id)}
            className={`pointer-events-auto border rounded-xl px-4 py-3 shadow-xl backdrop-blur-md flex items-center justify-between gap-3 text-xs sm:text-sm font-medium animate-in slide-in-from-right-4 fade-in duration-200 cursor-pointer ${borderClass}`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span>{toast.text}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(toast.id);
              }}
              className="text-stone-400 hover:text-stone-200 text-xs px-1"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
};
