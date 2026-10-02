/**
 * BHARAT — Build the Civilization
 * Final Polished Start Screen / Landing Page (Part 5)
 */

import React, { useState } from 'react';
import {
  Compass,
  Landmark,
  ArrowRight,
  Sparkles,
  BookOpen,
  MapPin,
  ShieldCheck,
  Cloud,
  User,
  HelpCircle,
  Clock,
  ShieldAlert,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HowToPlayModal } from '../components/common/HowToPlayModal';
import { SihPresentationModal } from '../components/common/SihPresentationModal';
import { SourcesModal } from '../components/history/SourcesModal';
import { AdminModal } from '../components/admin/AdminModal';

interface StartScreenProps {
  onStartJourney: () => void;
  onOpenAuthModal?: () => void;
  onOpenLearnMode?: () => void;
  onLaunchDemoMode?: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartJourney,
  onOpenAuthModal,
  onOpenLearnMode,
  onLaunchDemoMode,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isSihModalOpen, setIsSihModalOpen] = useState(false);
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col justify-between relative overflow-hidden bg-parchment-pattern">
      {/* Ancient Decorative Geometry Header Line */}
      <div className="w-full h-1.5 bg-gradient-to-r from-amber-800 via-amber-500 to-amber-800" />

      {/* Top Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5 text-amber-300">
          <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-600/50 flex items-center justify-center text-amber-400">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-bold text-sm sm:text-base tracking-wider text-amber-100 block">
              BHARAT
            </span>
            <span className="text-[10px] text-amber-500 font-medium tracking-widest uppercase hidden sm:block">
              BUILD THE CIVILIZATION
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsSihModalOpen(true)}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-950/70 hover:bg-amber-950 border border-amber-700/60 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SIH26208 Jury Info</span>
            <span className="sm:hidden">SIH Info</span>
          </button>

          {isAuthenticated ? (
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span className="max-w-28 truncate">{user?.name}</span>
            </span>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 bg-stone-900 hover:bg-stone-850 border border-stone-750 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Central Hero Experience */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col items-center text-center z-10 space-y-6 my-auto">
        {/* Era Tag Indicator */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-900/90 border border-amber-700/50 shadow-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] uppercase tracking-widest text-amber-300 font-semibold">
            Browser-Based 3D Civilization Educational Game
          </span>
        </div>

        {/* Title Lockup */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-500 drop-shadow-sm">
            BHARAT
          </h1>
          <h2 className="font-display text-base sm:text-2xl md:text-3xl font-bold tracking-widest text-amber-300/90 uppercase">
            BUILD THE CIVILIZATION
          </h2>
          <p className="text-sm sm:text-lg text-amber-200/90 font-medium italic pt-1 max-w-2xl mx-auto">
            "Experience Indian history by building, exploring, solving problems, and discovering knowledge."
          </p>
        </div>

        {/* Visual Thematic Backdrop Graphic Card */}
        <div className="w-full max-w-2xl p-5 sm:p-6 rounded-2xl bg-stone-900/80 border border-amber-800/40 shadow-2xl backdrop-blur-md text-left space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-stone-300">
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-stone-950/60 border border-stone-800">
              <Compass className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-xs">
                <span className="text-stone-400 block text-[10px]">PHILOSOPHY</span>
                <span className="font-medium text-stone-200">Rebuild through Knowledge</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-stone-950/60 border border-stone-800">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <span className="text-stone-400 block text-[10px]">PERSISTENCE</span>
                <span className="font-medium text-stone-200">Aiven Cloud MySQL</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-stone-950/60 border border-stone-800">
              <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
              <div className="text-xs">
                <span className="text-stone-400 block text-[10px]">AI MENTOR</span>
                <span className="font-medium text-stone-200">Acharya Historical Guide</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-stone-300 leading-relaxed pt-2 border-t border-stone-800">
            Explore a playable 3D ancient river basin with your pioneer avatar. Walk through the settlement, harvest Sal wood and quarry stone, construct and upgrade modular architecture, investigate archaeological discoveries, consult your AI mentor Acharya, and advance through historical eras.
          </div>
        </div>

        {/* Primary and Secondary CTA Buttons */}
        <div className="pt-2 flex flex-col items-center gap-3 w-full max-w-xl">
          {/* Main Action Button */}
          <button
            onClick={onStartJourney}
            className="w-full sm:w-auto px-8 sm:px-12 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-display font-bold text-base sm:text-lg tracking-wider rounded-xl shadow-xl shadow-amber-950/60 transition-all duration-200 hover:scale-105 cursor-pointer flex items-center justify-center gap-3"
          >
            <span>{isAuthenticated ? 'CONTINUE CIVILIZATION' : 'START JOURNEY'}</span>
            <ArrowRight className="w-5 h-5 text-stone-950" />
          </button>

          {/* Secondary Buttons Grid */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 w-full">
            <button
              type="button"
              onClick={() => setIsHowToPlayOpen(true)}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-850 text-stone-200 text-xs font-semibold rounded-xl border border-stone-750 hover:border-amber-600 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>How to Play</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenLearnMode?.();
                onStartJourney();
              }}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-850 text-stone-200 text-xs font-semibold rounded-xl border border-stone-750 hover:border-amber-600 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Learn History</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSourcesModalOpen(true)}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-850 text-stone-200 text-xs font-semibold rounded-xl border border-stone-750 hover:border-amber-600 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>View Sources</span>
            </button>

            {onLaunchDemoMode && (
              <button
                type="button"
                onClick={onLaunchDemoMode}
                className="px-4 py-2.5 bg-amber-950/70 hover:bg-amber-950 text-amber-300 text-xs font-bold rounded-xl border border-amber-800/70 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>SIH Demo Mode</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer Notes */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-stone-400 z-10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span>Historically informed and source-backed educational gameplay (ASI · NCERT · UNESCO)</span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="text-stone-500 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
          >
            <ShieldAlert className="w-3 h-3" />
            <span>Admin</span>
          </button>
          <span>·</span>
          <span>SIH26208 AICTE Challenge</span>
        </div>
      </footer>

      {/* Modals */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
        onStartPlaying={onStartJourney}
      />

      <SihPresentationModal
        isOpen={isSihModalOpen}
        onClose={() => setIsSihModalOpen(false)}
        onLaunchDemoMode={() => {
          onLaunchDemoMode?.();
          setIsSihModalOpen(false);
        }}
      />

      <SourcesModal
        isOpen={isSourcesModalOpen}
        onClose={() => setIsSourcesModalOpen(false)}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
};
