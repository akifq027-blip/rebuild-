/**
 * BHARAT — Build the Civilization
 * Player Profile & Cloud Sync Modal
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CivilizationInfo, PlayerProfile } from '../../types/game';
import {
  User,
  Shield,
  Cloud,
  LogOut,
  X,
  Sparkles,
  RefreshCw,
  Landmark,
  CheckCircle2,
  Database,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  civilization: CivilizationInfo;
  currentEraTitle: string;
  onSaveCloudNow: () => Promise<void>;
  onOpenAuthModal: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  player,
  civilization,
  currentEraTitle,
  onSaveCloudNow,
  onOpenAuthModal,
}) => {
  const { user, isAuthenticated, logout, connectionStatus } = useAuth();
  const [isSavingManual, setIsSavingManual] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleManualSave = async () => {
    setIsSavingManual(true);
    await onSaveCloudNow();
    setIsSavingManual(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 border border-amber-900/60 rounded-2xl shadow-2xl overflow-hidden text-stone-100">
        {/* Top Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-950 border border-amber-700/60 flex items-center justify-center text-amber-400 shadow-inner">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xl text-amber-200">
                  {isAuthenticated ? user?.name : player.title}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800/40 text-amber-400">
                  LVL {civilization.level}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {isAuthenticated ? user?.email : 'Local Guest Explorer'}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-stone-950/80 border border-stone-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Civilization</span>
              <span className="text-xs sm:text-sm font-bold text-amber-200 truncate block">
                {civilization.name}
              </span>
            </div>
            <div className="bg-stone-950/80 border border-stone-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Current Era</span>
              <span className="text-xs sm:text-sm font-bold text-amber-400 truncate block">
                {currentEraTitle}
              </span>
            </div>
            <div className="bg-stone-950/80 border border-stone-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Population</span>
              <span className="text-xs sm:text-sm font-bold text-amber-300 block">
                {civilization.population} / {civilization.populationCapacity}
              </span>
            </div>
            <div className="bg-stone-950/80 border border-stone-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">XP Progress</span>
              <span className="text-xs sm:text-sm font-bold text-amber-400 block">
                {civilization.xp} XP
              </span>
            </div>
          </div>

          {/* Persistence & Database Status */}
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-stone-200">Database Storage</span>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  connectionStatus === 'connected'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-stone-800 text-stone-400 border border-stone-700'
                }`}
              >
                {connectionStatus === 'connected' ? 'Aiven MySQL Online' : 'Browser LocalStorage'}
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              {isAuthenticated
                ? 'Your civilization progress is automatically synchronized with your cloud database account.'
                : 'You are playing in local mode. Create an account to permanently sync with Aiven MySQL.'}
            </p>

            {saveSuccessMsg && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 p-2 rounded-lg border border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Civilization state saved to cloud database successfully!</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleManualSave}
                  disabled={isSavingManual}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSavingManual ? 'animate-spin' : ''}`} />
                  <span>{isSavingManual ? 'Saving...' : 'Sync & Save Now'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuthModal();
                  }}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-stone-950 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Link Account & Save to Aiven Cloud</span>
                </button>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-800">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
            ) : (
              <span className="text-xs text-stone-400">Offline / Guest Player</span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
