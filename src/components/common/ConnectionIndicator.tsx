/**
 * BHARAT — Build the Civilization
 * Connection & Cloud Sync Status Indicator
 */

import React from 'react';
import { ConnectionStatus } from '../../context/AuthContext';
import { Cloud, CloudOff, RefreshCw, Database } from 'lucide-react';

interface ConnectionIndicatorProps {
  status: ConnectionStatus;
  userEmail?: string;
  onClick?: () => void;
}

export const ConnectionIndicator: React.FC<ConnectionIndicatorProps> = ({
  status,
  userEmail,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      title={
        status === 'connected'
          ? `Synced to Aiven MySQL (${userEmail || 'Account active'})`
          : status === 'saving'
          ? 'Synchronizing state with cloud database...'
          : 'Playing in offline/local storage mode'
      }
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border cursor-pointer ${
        status === 'connected'
          ? 'bg-emerald-950/60 border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/60'
          : status === 'saving'
          ? 'bg-amber-950/60 border-amber-700/50 text-amber-300 animate-pulse'
          : 'bg-stone-900/80 border-stone-700/60 text-stone-400 hover:text-stone-200 hover:border-stone-500'
      }`}
    >
      {status === 'connected' ? (
        <>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <Cloud className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Aiven Cloud Synced</span>
          <span className="sm:hidden">Synced</span>
        </>
      ) : status === 'saving' ? (
        <>
          <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
          <span className="hidden sm:inline">Saving to Cloud...</span>
          <span className="sm:hidden">Saving...</span>
        </>
      ) : (
        <>
          <Database className="w-3 h-3 text-stone-400" />
          <span className="hidden sm:inline">Local Storage</span>
          <span className="sm:hidden">Local</span>
        </>
      )}
    </button>
  );
};
