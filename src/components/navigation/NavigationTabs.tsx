import React from 'react';
import { GameTab } from '../../types/game';
import {
  Map,
  Hammer,
  Compass,
  Cpu,
  Target,
  Landmark,
  GraduationCap,
  Globe,
  Clock,
  BookOpen,
} from 'lucide-react';

interface NavigationTabsProps {
  activeTab: GameTab;
  onTabChange: (tab: GameTab) => void;
  missionBadgeCount?: number;
  techBadgeCount?: number;
  museumBadgeCount?: number;
  onOpenTimeline?: () => void;
  onOpenJournal?: () => void;
}

interface TabItem {
  id: GameTab;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  missionBadgeCount = 0,
  techBadgeCount = 0,
  museumBadgeCount = 0,
  onOpenTimeline,
  onOpenJournal,
}) => {
  const tabs: TabItem[] = [
    {
      id: 'HOME',
      label: '3D WORLD',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      id: 'BUILD',
      label: 'BUILD',
      icon: <Hammer className="w-4 h-4" />,
    },
    {
      id: 'EXPLORE',
      label: 'EXPLORE',
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: 'TECHNOLOGY',
      label: 'TECHNOLOGY',
      icon: <Cpu className="w-4 h-4" />,
      badge: techBadgeCount,
    },
    {
      id: 'MISSIONS',
      label: 'MISSIONS',
      icon: <Target className="w-4 h-4" />,
      badge: missionBadgeCount,
    },
    {
      id: 'MUSEUM',
      label: 'MUSEUM',
      icon: <Landmark className="w-4 h-4" />,
      badge: museumBadgeCount,
    },
    {
      id: 'LEARN',
      label: 'LEARN',
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      id: 'MAP',
      label: 'MAP',
      icon: <Globe className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="w-full bg-stone-950/90 border-y border-amber-900/30 px-3 sm:px-6 py-2 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                isActive
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40 font-bold'
                  : 'text-stone-300 hover:text-amber-200 hover:bg-stone-900/90'
              }`}
            >
              <span className={isActive ? 'text-stone-950' : 'text-amber-400'}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 ? (
                <span
                  className={`w-2 h-2 rounded-full ${
                    isActive ? 'bg-stone-950' : 'bg-amber-400 animate-pulse'
                  }`}
                />
              ) : null}
            </button>
          );
        })}

        {/* Timeline Quick Button */}
        {onOpenTimeline && (
          <button
            onClick={onOpenTimeline}
            className="relative flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] text-stone-300 hover:text-amber-200 hover:bg-stone-900/90 focus:outline-none focus:ring-1 focus:ring-amber-500"
            title="Inspect historical eras and chapter progressions"
          >
            <Clock className="w-4 h-4 text-sky-400" />
            <span>TIMELINE</span>
          </button>
        )}

        {/* Journal Quick Button */}
        {onOpenJournal && (
          <button
            onClick={onOpenJournal}
            className="relative flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] text-stone-300 hover:text-amber-200 hover:bg-stone-900/90 focus:outline-none focus:ring-1 focus:ring-amber-500"
            title="Read your civilization's historical chronicle"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>JOURNAL</span>
          </button>
        )}
      </div>
    </nav>
  );
};
