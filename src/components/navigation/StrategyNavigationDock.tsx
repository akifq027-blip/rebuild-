/**
 * BHARAT — Build the Civilization
 * Responsive Bottom & Desktop Navigation Dock (HOME, BUILD, ARMY, MAP, RESEARCH)
 */

import React from 'react';
import {
  Landmark,
  Hammer,
  Shield,
  Compass,
  BookOpen,
} from 'lucide-react';

export type GameTabType = 'HOME' | 'BUILD' | 'ARMY' | 'MAP' | 'RESEARCH';

interface StrategyNavigationDockProps {
  activeTab: GameTabType;
  onTabChange: (tab: GameTabType) => void;
  availableBuildCount?: number;
  availableResearchCount?: number;
  unclaimedMissionsCount?: number;
}

export const StrategyNavigationDock: React.FC<StrategyNavigationDockProps> = ({
  activeTab,
  onTabChange,
  availableBuildCount = 0,
  availableResearchCount = 0,
  unclaimedMissionsCount = 0,
}) => {
  const tabs: Array<{
    id: GameTabType;
    label: string;
    sanskritLabel: string;
    icon: React.ReactNode;
    badgeCount?: number;
  }> = [
    {
      id: 'HOME',
      label: 'WORLD',
      sanskritLabel: 'Nagara',
      icon: <Landmark className="w-5 h-5 sm:w-4 sm:h-4" />,
    },
    {
      id: 'BUILD',
      label: 'BUILD',
      sanskritLabel: 'Nirmana',
      icon: <Hammer className="w-5 h-5 sm:w-4 sm:h-4" />,
      badgeCount: availableBuildCount > 0 ? availableBuildCount : undefined,
    },
    {
      id: 'ARMY',
      label: 'ARMY',
      sanskritLabel: 'Sena',
      icon: <Shield className="w-5 h-5 sm:w-4 sm:h-4" />,
    },
    {
      id: 'MAP',
      label: 'EXPEDITIONS',
      sanskritLabel: 'Desha',
      icon: <Compass className="w-5 h-5 sm:w-4 sm:h-4" />,
    },
    {
      id: 'RESEARCH',
      label: 'RESEARCH',
      sanskritLabel: 'Vidya',
      icon: <BookOpen className="w-5 h-5 sm:w-4 sm:h-4" />,
      badgeCount: availableResearchCount > 0 ? availableResearchCount : undefined,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 border-t border-amber-900/60 backdrop-blur-md px-2 py-1.5 sm:py-2 select-none shadow-2xl"
      aria-label="Civilization Strategy Navigation"
    >
      <div className="max-w-xl mx-auto flex items-center justify-around sm:gap-2">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 sm:px-5 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-amber-600 to-amber-700 text-stone-950 font-extrabold shadow-lg shadow-amber-950/50 scale-105'
                  : 'text-stone-400 hover:text-amber-200 hover:bg-stone-900/80'
              }`}
            >
              <div className="relative">
                {t.icon}
                {t.badgeCount !== undefined && t.badgeCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-600 text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse border border-stone-950">
                    {t.badgeCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-wider uppercase font-display mt-0.5">
                {t.label}
              </span>
              <span
                className={`text-[8px] font-mono leading-none hidden sm:block ${
                  isActive ? 'text-amber-950' : 'text-stone-500'
                }`}
              >
                {t.sanskritLabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
