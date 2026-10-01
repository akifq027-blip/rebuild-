import React from 'react';
import { MissionItem, ObjectiveItem } from '../../types/game';
import { Target, CheckCircle2, Award, Gift, Sparkles } from 'lucide-react';

interface MissionsPanelProps {
  currentObjective: ObjectiveItem;
  missions: MissionItem[];
  onClaimReward: (missionId: string) => void;
}

export const MissionsPanel: React.FC<MissionsPanelProps> = ({
  currentObjective,
  missions = [],
  onClaimReward,
}) => {
  const safeMissions = Array.isArray(missions) ? missions : [];
  const completedCount = safeMissions.filter((m) => m.claimed).length;

  return (
    <div className="w-full space-y-5 text-left max-w-5xl mx-auto">
      {/* Primary Current Objective Banner */}
      <div className="bg-stone-900/90 border border-amber-800/50 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-950/80 border border-amber-600/40 text-amber-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
                ACTIVE CIVILIZATION OBJECTIVE
              </span>
              <h3 className="font-display font-bold text-lg text-amber-100">
                {currentObjective.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-center">
            <div className="text-right">
              <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
                Progress
              </span>
              <span className="text-sm font-bold text-amber-400 tabular-nums">
                {currentObjective.progress} / {currentObjective.target}
              </span>
            </div>
            <div className="text-right pl-3 border-l border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
                Total Completed
              </span>
              <span className="text-sm font-bold text-stone-200 tabular-nums">
                {completedCount} / {missions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-950 rounded-full h-2.5 overflow-hidden border border-stone-800 mb-3">
          <div
            className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 h-full transition-all duration-300"
            style={{
              width: `${Math.min(100, (currentObjective.progress / Math.max(1, currentObjective.target)) * 100)}%`,
            }}
          />
        </div>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          {currentObjective.description}
        </p>
      </div>

      {/* Full Missions List */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5">
        <h4 className="font-display font-semibold text-sm text-stone-200 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>EARLY SETTLEMENT MISSIONS & MILESTONES</span>
        </h4>

        <div className="space-y-3">
          {safeMissions.map((mission, index) => {
            const isCompleted = mission.completed;
            const isClaimed = mission.claimed;
            const progressPercent = Math.min(100, Math.round((mission.progress / mission.target) * 100));

            return (
              <div
                key={mission.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isClaimed
                    ? 'bg-stone-950/60 border-stone-850 opacity-70'
                    : isCompleted
                    ? 'bg-amber-950/30 border-amber-600/70 shadow-md ring-1 ring-amber-500/40'
                    : 'bg-stone-950/80 border-stone-800'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400/90 tabular-nums">
                      {index + 1}.
                    </span>
                    <h5 className="font-display font-bold text-sm text-stone-100">
                      {mission.title}
                    </h5>
                    {isClaimed ? (
                      <span className="text-[10px] bg-stone-850 text-stone-300 px-2 py-0.5 rounded border border-stone-750 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Completed
                      </span>
                    ) : isCompleted ? (
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold animate-pulse">
                        Ready to Claim!
                      </span>
                    ) : (
                      <span className="text-[10px] bg-stone-900 text-stone-400 px-2 py-0.5 rounded border border-stone-800">
                        In Progress
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed">
                    {mission.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-stone-400">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-stone-400">Progress:</span>
                      <div className="w-24 bg-stone-900 rounded-full h-1.5 overflow-hidden border border-stone-800">
                        <div
                          className="bg-amber-500 h-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-stone-300 tabular-nums">
                        {mission.progress} / {mission.target}
                      </span>
                    </div>

                    <span className="text-stone-600">·</span>

                    <span className="text-amber-400/90 font-medium flex items-center gap-1">
                      <Gift className="w-3 h-3" /> Reward: {mission.rewardText}
                    </span>
                  </div>
                </div>

                {/* Claim Button */}
                <div className="shrink-0 self-end sm:self-center">
                  {!isClaimed && isCompleted ? (
                    <button
                      onClick={() => onClaimReward(mission.id)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-xs rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5 animate-bounce"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>CLAIM REWARD</span>
                    </button>
                  ) : isClaimed ? (
                    <div className="text-xs text-stone-400 font-medium px-3 py-1 bg-stone-900/60 rounded border border-stone-800/80">
                      Claimed ✓
                    </div>
                  ) : (
                    <div className="text-xs text-stone-400 font-medium px-3 py-1 bg-stone-900/40 rounded border border-stone-800/40">
                      {progressPercent}% Done
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
