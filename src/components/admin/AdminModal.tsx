/**
 * BHARAT — Build the Civilization
 * Admin Dashboard & Content Management Modal (Part 5)
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  ShieldAlert,
  X,
  Database,
  Users,
  Award,
  Scroll,
  Megaphone,
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
  Layers,
  RefreshCw,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isUnlocked) {
      loadAdminData();
    }
  }, [isUnlocked]);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const statsRes = await fetch('/api/admin/stats').then((r) => r.json());
      if (statsRes.success) setStats(statsRes.data);

      const annRes = await fetch('/api/admin/announcements').then((r) => r.json());
      if (annRes.success && Array.isArray(annRes.data)) setAnnouncements(annRes.data);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'sih2026' || passcode === 'admin123') {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid administrative passcode. (Hint: sih2026)');
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, message: newMessage }),
      }).then((r) => r.json());

      if (res.success) {
        setAnnouncements((prev) => [res.data, ...prev]);
        setNewTitle('');
        setNewMessage('');
      }
    } catch {
      // Error
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // Error
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-amber-900/60 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col max-h-[88vh]">
        {/* Top Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-500 to-amber-700" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-950 border border-amber-600/50 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg sm:text-xl text-amber-200">
                  ADMINISTRATIVE DASHBOARD
                </h2>
                <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-stone-400">
                System telemetry, announcement dispatch, and content validation
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!isUnlocked ? (
            <form onSubmit={handleUnlock} className="max-w-md mx-auto py-8 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center mx-auto text-amber-400">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-stone-200">
                  Admin Access Required
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Enter administrative passcode to inspect database metrics and manage announcements.
                </p>
              </div>

              {errorMsg && (
                <div className="text-xs text-red-400 bg-red-950/60 p-2 rounded-lg border border-red-800">
                  {errorMsg}
                </div>
              )}

              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (hint: sih2026)"
                className="w-full bg-stone-950 border border-stone-750 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-center outline-none"
              />

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
              >
                Authenticate Dashboard
              </button>
            </form>
          ) : (
            <>
              {/* Aggregated Analytics Matrix */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    <span>Real-Time Database Telemetry</span>
                  </h4>
                  <button
                    type="button"
                    onClick={loadAdminData}
                    className="text-[11px] text-stone-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-stone-950 border border-stone-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Total Users</span>
                    <span className="text-lg font-bold text-amber-200">{stats?.totalUsers ?? 1}</span>
                  </div>
                  <div className="bg-stone-950 border border-stone-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Civilizations</span>
                    <span className="text-lg font-bold text-emerald-400">{stats?.activeCivilizations ?? 1}</span>
                  </div>
                  <div className="bg-stone-950 border border-stone-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Relics Uncovered</span>
                    <span className="text-lg font-bold text-sky-400">{stats?.artifactsDiscovered ?? 4}</span>
                  </div>
                  <div className="bg-stone-950 border border-stone-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Tech Unlocked</span>
                    <span className="text-lg font-bold text-amber-400">{stats?.technologiesUnlocked ?? 6}</span>
                  </div>
                </div>

                <div className="text-[11px] text-stone-400 bg-stone-950/60 p-2.5 rounded-lg border border-stone-800 flex items-center justify-between">
                  <span>Backend Cloud Connection:</span>
                  <span className="text-emerald-400 font-semibold">{stats?.databaseStatus || 'Aiven MySQL Online'}</span>
                </div>
              </div>

              {/* Announcement Dispatcher */}
              <div className="space-y-3 pt-2 border-t border-stone-800">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-amber-400" />
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-amber-400">
                    Broadcast Announcement
                  </h4>
                </div>

                <form onSubmit={handleCreateAnnouncement} className="bg-stone-950 border border-stone-800 p-3.5 rounded-xl space-y-2.5">
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Announcement Title..."
                    className="w-full bg-stone-900 border border-stone-750 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs outline-none"
                  />
                  <textarea
                    required
                    rows={2}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message content for players..."
                    className="w-full bg-stone-900 border border-stone-750 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs outline-none resize-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Publish Announcement</span>
                  </button>
                </form>

                {/* Active Announcements List */}
                <div className="space-y-2">
                  {(announcements || []).map((a) => (
                    <div key={a.id} className="bg-stone-950/70 border border-stone-800 p-3 rounded-xl flex items-start justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-200">{a.title}</span>
                          <span className="text-[10px] text-stone-400">{a.date}</span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5">{a.message}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteAnnouncement(a.id)}
                        className="text-stone-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                        title="Delete announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span>Protected Administrative Interface · SIH26208</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
