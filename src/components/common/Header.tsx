/**
 * BHARAT — Build the Civilization
 * Header Component with Connection Indicator, Player Profile, Achievements & Sources
 */

import React from 'react';
import { PlayerProfile, CivilizationInfo, EraInfo } from '../../types/game';
import { ConnectionIndicator } from './ConnectionIndicator';
import { useAuth } from '../../context/AuthContext';
import {
  Landmark,
  Users,
  RotateCcw,
  Package,
  Award,
  Clock,
  BookOpen,
  User,
  LogIn,
  ShieldCheck,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface HeaderProps {
  player: PlayerProfile;
  civilization: CivilizationInfo;
  era: EraInfo;
  currentEraTitle: string;
  unlockedAchievementsCount?: number;
  isDemoMode?: boolean;
  onOpenTimeline: () => void;
  onOpenJournal: () => void;
  onOpenResetModal: () => void;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  onOpenAchievements?: () => void;
  onOpenSources?: () => void;
  onOpenHowToPlay?: () => void;
  onResetDemo?: () => void;
  onReturnToStart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  player,
  civilization,
  currentEraTitle,
  unlockedAchievementsCount = 0,
  isDemoMode = false,
  onOpenTimeline,
  onOpenJournal,
  onOpenResetModal,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenAchievements,
  onOpenSources,
  onOpenHowToPlay,
  onResetDemo,
  onReturnToStart,
}) => {
  const { user, isAuthenticated, connectionStatus } = useAuth();

  const xpPercent = Math.min(
    100,
    Math.round((civilization.xp / Math.max(1, civilization.xpToNextLevel)) * 100)
  );

  return (
    <header className="w-full bg-stone-900/90 border-b border-amber-900/40 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={onReturnToStart}
            className="group text-left focus:outline-none flex items-center gap-2.5 cursor-pointer"
            title="Return to Welcome Screen"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-600/40 flex items-center justify-center text-amber-400 group-hover:border-amber-500 transition-colors">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-bold text-lg sm:text-xl tracking-wider text-amber-100 group-hover:text-amber-300 transition-colors">
                BHARAT
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs tracking-widest text-amber-500/80 font-medium">
                BUILD THE CIVILIZATION
              </span>
            </div>
          </button>

          {/* Demo Mode Badge if active */}
          {isDemoMode && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] shadow-sm animate-pulse">
              <Sparkles className="w-3 h-3" />
              <span>SIH DEMO MODE</span>
              {onResetDemo && (
                <button
                  type="button"
                  onClick={onResetDemo}
                  className="ml-1 text-[9px] underline uppercase font-mono hover:text-stone-800 cursor-pointer"
                >
                  [Exit]
                </button>
              )}
            </div>
          )}

          {/* Mobile Right Quick Actions */}
          <div className="md:hidden flex items-center gap-2">
            <ConnectionIndicator
              status={connectionStatus}
              userEmail={user?.email}
              onClick={isAuthenticated ? onOpenProfileModal : onOpenAuthModal}
            />

            {isAuthenticated ? (
              <button
                onClick={onOpenProfileModal}
                className="px-2.5 py-1 bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <User className="w-3 h-3 text-amber-400" />
                <span className="truncate max-w-20">{user?.name}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-2.5 py-1 bg-amber-600 text-stone-950 text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Center Indicators: Timeline, Era, Level, Pop, Storage */}
        <div className="hidden md:flex items-center gap-3 text-xs text-stone-300">
          <button
            onClick={onOpenTimeline}
            className="group relative px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs rounded-lg shadow-md transition-all duration-150 flex items-center gap-1.5 cursor-pointer active:scale-98"
            title="Open Interactive Historical Timeline"
          >
            <Clock className="w-3.5 h-3.5 text-stone-950 group-hover:rotate-45 transition-transform" />
            <span>JOURNEY THROUGH TIME</span>
          </button>

          {/* Current Era Tag */}
          <div className="flex items-center gap-2 bg-stone-950/80 px-3 py-1.5 rounded-lg border border-amber-900/40">
            <span className="text-amber-500 font-bold tracking-wider uppercase text-[10px]">
              ERA
            </span>
            <span className="text-stone-500">·</span>
            <span className="font-semibold text-stone-100 truncate max-w-40" title={currentEraTitle}>
              {currentEraTitle}
            </span>
          </div>

          {/* Level & XP Progress Indicator */}
          <div className="flex items-center gap-2 bg-stone-950/80 px-3 py-1.5 rounded-lg border border-stone-800">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-amber-300">LVL {civilization.level}</span>
            <div className="w-14 bg-stone-850 rounded-full h-1.5 overflow-hidden border border-stone-800">
              <div
                className="bg-amber-400 h-full transition-all"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-stone-400 font-mono tabular-nums">
              {civilization.xp}/{civilization.xpToNextLevel}
            </span>
          </div>

          {/* Pop & Storage */}
          <div className="flex items-center gap-3 text-stone-400 pl-1">
            <div className="flex items-center gap-1" title="Community Population">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              <span>
                <strong className="text-stone-200 font-medium tabular-nums">
                  {civilization.population}/{civilization.populationCapacity}
                </strong>
              </span>
            </div>

            <span>·</span>

            <div className="flex items-center gap-1" title="Max Granary & Material Storage">
              <Package className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                <strong className="text-stone-200 font-medium tabular-nums">
                  {civilization.maxStorage}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions: Achievements, Sources, Connection, Profile, Journal, Reset */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-1.5 text-xs text-stone-400">
          {onOpenAchievements && (
            <button
              onClick={onOpenAchievements}
              className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 bg-stone-950/80 hover:bg-stone-900 border border-amber-900/50 px-2 py-1 rounded transition-colors cursor-pointer"
              title="View unlocked milestones and achievements"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Milestones ({unlockedAchievementsCount})</span>
              <span className="sm:hidden">({unlockedAchievementsCount})</span>
            </button>
          )}

          {onOpenSources && (
            <button
              onClick={onOpenSources}
              className="hidden lg:flex items-center gap-1 text-[11px] text-stone-300 hover:text-stone-100 bg-stone-950/80 hover:bg-stone-900 border border-stone-800 px-2 py-1 rounded transition-colors cursor-pointer"
              title="View ASI, NCERT, and UNESCO academic sources"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Sources</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-2">
            <ConnectionIndicator
              status={connectionStatus}
              userEmail={user?.email}
              onClick={isAuthenticated ? onOpenProfileModal : onOpenAuthModal}
            />

            {isAuthenticated ? (
              <button
                onClick={onOpenProfileModal}
                className="flex items-center gap-1.5 text-[11px] text-amber-300 hover:text-amber-200 bg-stone-950/80 hover:bg-stone-900 border border-amber-800/50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="View Player Profile & Cloud Sync"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold truncate max-w-28">{user?.name}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 text-[11px] text-stone-950 bg-amber-500 hover:bg-amber-400 font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-sm"
                title="Create Account to save in Aiven Cloud"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign In / Save</span>
              </button>
            )}
          </div>

          <button
            onClick={onOpenJournal}
            className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 bg-stone-950/80 hover:bg-stone-900 border border-amber-800/40 px-2 py-1 rounded transition-colors cursor-pointer"
            title="View personal journey chronicles"
          >
            <BookOpen className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Journal</span>
          </button>

          <button
            onClick={onOpenResetModal}
            className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 px-2 py-1 rounded transition-colors cursor-pointer"
            title="Reset civilization to starting state"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <button
            onClick={onReturnToStart}
            className="text-[11px] text-stone-400 hover:text-amber-300 transition-colors underline underline-offset-4 cursor-pointer ml-1"
          >
            Title
          </button>
        </div>
      </div>
    </header>
  );
};
