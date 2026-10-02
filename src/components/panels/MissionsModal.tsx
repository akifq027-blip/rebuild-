/**
 * BHARAT — Build the Civilization
 * Civic Missions & Royal Decrees Modal
 */

import React from 'react';
import { CivilizationMission, CoreResourceKey } from '../../types/civilization';
import {
  X,
  Sparkles,
  CheckCircle,
  Award,
  Wheat,
  Trees,
  Gem,
  Flame,
  BookOpen,
} from 'lucide-react';

interface MissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  missions: CivilizationMission[];
  onClaimMission: (missionId: string) => void;
}

export const MissionsModal: React.FC<MissionsModalProps> = ({
  isOpen,
  onClose,
  missions,
  onClaimMission,
}) => {
  if (!isOpen) return null;

  const getResourceIcon = (key: CoreResourceKey) => {
    switch (key) {
      case 'food':
        return <Wheat className="w-3 h-3 text-amber-400" />;
      case 'wood':
        return <Trees className="w-3 h-3 text-amber-600" />;
      case 'stone':
        return <Gem className="w-3 h-3 text-slate-300" />;
      case 'clay':
        return <Flame className="w-3 h-3 text-orange-400" />;
      case 'knowledge':
        return <BookOpen className="w-3 h-3 text-sky-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in text-left">
      <div className="bg-stone-900 border border-amber-900/60 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-3">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
              ROYAL DECREES & QUESTS
            </span>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-amber-100 mt-1">
              CIVILIZATION MISSIONS
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Missions List */}
        <div className="space-y-3">
          {missions.map((mission) => {
            const isCompleted = mission.progress >= mission.target;
            const progressPercent = Math.min(
              100,
              Math.round((mission.progress / Math.max(1, mission.target)) * 100)
            );

            return (
              <div
                key={mission.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  mission.claimed
                    ? 'bg-stone-950/40 border-stone-850 opacity-60'
                    : isCompleted
                    ? 'bg-amber-950/40 border-amber-500/70 shadow-lg'
                    : 'bg-stone-950/70 border-stone-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-400 bg-stone-900 px-1.5 py-0.5 rounded">
                        {mission.category}
                      </span>
                      <h4 className="font-display font-bold text-sm sm:text-base text-amber-100">
                        {mission.title}
                      </h4>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed">
                      {mission.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                        <span>Progress: {mission.progress} / {mission.target}</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden border border-stone-800">
                        <div
                          className="bg-amber-500 h-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Rewards Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1.5 text-xs font-mono">
                      <span className="text-[10px] text-stone-400">Bounty:</span>
                      <span className="text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/50">
                        +{mission.rewardKnowledge} Vidya
                      </span>
                      <span className="text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/50">
                        +{mission.rewardXp} XP
                      </span>
                      {Object.entries(mission.rewardResources).map(([resKey, amt]) => (
                        <span
                          key={resKey}
                          className="text-stone-200 bg-stone-900 px-2 py-0.5 rounded border border-stone-750 flex items-center gap-1"
                        >
                          {getResourceIcon(resKey as CoreResourceKey)}
                          <span>+{amt} {resKey}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Claim Button */}
                  <div className="shrink-0 self-end sm:self-center">
                    {mission.claimed ? (
                      <span className="text-xs text-stone-500 font-mono font-semibold px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800">
                        Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => onClaimMission(mission.id)}
                        disabled={!isCompleted}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isCompleted
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 shadow-md animate-pulse'
                            : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-750'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'CLAIM BOUNTY' : 'IN PROGRESS'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
