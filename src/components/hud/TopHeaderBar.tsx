/**
 * BHARAT — Build the Civilization
 * Responsive Top HUD: Resources, Civilization Level, Population & Cloud Sync
 */

import React from 'react';
import {
  CoreResourceKey,
  CivilizationOverview,
} from '../../types/civilization';
import { CORE_RESOURCES_INFO } from '../../game/constants';
import {
  Wheat,
  Trees,
  Gem,
  Flame,
  BookOpen,
  Users,
  Shield,
  Cloud,
  CheckCircle,
  Sparkles,
  HelpCircle,
  Menu,
} from 'lucide-react';

interface TopHeaderBarProps {
  overview: CivilizationOverview;
  resources: Record<CoreResourceKey, number>;
  onboardingStep: number;
  onboardingCompleted: boolean;
  onOpenMissions: () => void;
  onOpenHelp: () => void;
  onOpenAuthModal?: () => void;
  onReturnToTitle?: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
}

export const TopHeaderBar: React.FC<TopHeaderBarProps> = ({
  overview,
  resources,
  onboardingStep,
  onboardingCompleted,
  onOpenMissions,
  onOpenHelp,
  onOpenAuthModal,
  onReturnToTitle,
  isAuthenticated = false,
  userEmail,
}) => {
  const getResourceIcon = (key: CoreResourceKey) => {
    switch (key) {
      case 'food':
        return <Wheat className="w-3.5 h-3.5 text-amber-400" />;
      case 'wood':
        return <Trees className="w-3.5 h-3.5 text-amber-600" />;
      case 'stone':
        return <Gem className="w-3.5 h-3.5 text-slate-300" />;
      case 'clay':
        return <Flame className="w-3.5 h-3.5 text-orange-400" />;
      case 'knowledge':
        return <BookOpen className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  const xpPercent = Math.min(
    100,
    Math.round((overview.xp / Math.max(1, overview.xpToNextLevel)) * 100)
  );

  return (
    <header className="w-full bg-stone-900/95 border-b border-amber-900/50 backdrop-blur-md sticky top-0 z-40 select-none shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2 flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Left: Brand & Civilization Status */}
        <div className="w-full md:w-auto flex items-center justify-between gap-3">
          <div
            onClick={onReturnToTitle}
            className={`flex items-center gap-2.5 ${onReturnToTitle ? 'cursor-pointer group' : ''}`}
            title={onReturnToTitle ? 'Click to return to Title / Start Screen' : undefined}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-700 to-amber-950 border border-amber-500/50 flex items-center justify-center text-amber-200 shadow-md group-hover:scale-105 transition-transform">
              <span className="font-display font-black text-sm">भ</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-display font-extrabold text-sm sm:text-base tracking-wider text-amber-100 uppercase group-hover:text-amber-300 transition-colors">
                  {overview.name}
                </h1>
                <span className="text-[10px] bg-amber-950/80 border border-amber-700/60 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                  Lvl {overview.level}
                </span>
              </div>
              {/* Level XP Bar */}
              <div className="w-32 sm:w-40 bg-stone-950 h-1.5 rounded-full overflow-hidden border border-stone-800 mt-0.5">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Mobile Right: Quick Actions */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onOpenMissions}
              className="p-1.5 rounded-lg bg-stone-800 text-amber-300 hover:bg-stone-700 text-xs font-semibold flex items-center gap-1 border border-stone-700"
              title="Quests & Missions"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quests</span>
            </button>
            <button
              onClick={onOpenHelp}
              className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white"
              title="Help & Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: 5 Central Resources Display */}
        <div className="w-full md:w-auto overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-3 min-w-max">
            {(Object.keys(CORE_RESOURCES_INFO) as CoreResourceKey[]).map((resKey) => {
              const info = CORE_RESOURCES_INFO[resKey];
              const value = resources[resKey] || 0;
              const isNearMax = value >= overview.maxStorage * 0.95;

              return (
                <div
                  key={resKey}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-stone-950/80 border border-stone-800 shadow-sm"
                  title={`${info.name} (${info.sanskritName}): ${info.description} Max storage: ${overview.maxStorage}`}
                >
                  {getResourceIcon(resKey)}
                  <div className="flex flex-col">
                    <span className="text-[10px] text-stone-400 uppercase font-mono font-medium leading-none">
                      {info.name}
                    </span>
                    <span
                      className={`text-xs font-bold tabular-nums leading-tight ${
                        isNearMax ? 'text-amber-400' : 'text-stone-100'
                      }`}
                    >
                      {value.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Population, Military, Cloud Persistence & Missions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Population */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-950/60 border border-stone-800 text-xs text-stone-300"
            title="Population / Housing Capacity"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold tabular-nums">
              {overview.population} / {overview.populationCapacity}
            </span>
          </div>

          {/* Military Power */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-950/60 border border-stone-800 text-xs text-stone-300"
            title="Total Military Power"
          >
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span className="font-semibold tabular-nums text-red-200">
              {overview.militaryPower}
            </span>
          </div>

          {/* Missions Shortcut */}
          <button
            onClick={onOpenMissions}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/70 hover:bg-amber-900/80 border border-amber-700/60 text-amber-200 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Missions</span>
          </button>

          {/* Cloud Sync Button */}
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isAuthenticated
                  ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
                  : 'bg-stone-950/80 border-amber-800/50 text-amber-300 hover:bg-stone-800'
              }`}
              title={
                isAuthenticated
                  ? `Saved to Aiven Cloud (${userEmail})`
                  : 'Sign in to sync progress with Aiven MySQL'
              }
            >
              {isAuthenticated ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate max-w-24">Cloud Saved</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cloud Save</span>
                </>
              )}
            </button>
          )}

          {/* Help */}
          <button
            onClick={onOpenHelp}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors cursor-pointer"
            title="Civilization Guide & Encyclopedia"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
