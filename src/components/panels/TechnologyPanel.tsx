import React from 'react';
import { TechnologyItem } from '../../types/game';
import {
  Flame,
  Wrench,
  Sprout,
  Archive,
  Building,
  Droplets,
  Coins,
  Shield,
  CheckCircle,
  Lock,
  Sparkles,
  ArrowDown,
  Info,
} from 'lucide-react';

interface TechnologyPanelProps {
  technologies: TechnologyItem[];
  availableKnowledge: number;
  onResearch: (techId: string) => void;
}

export const TechnologyPanel: React.FC<TechnologyPanelProps> = ({
  technologies = [],
  availableKnowledge,
  onResearch,
}) => {
  const safeTechs = Array.isArray(technologies) ? technologies : [];
  const getTechIcon = (id: string) => {
    const iconClass = 'w-5 h-5';
    switch (id) {
      case 'fire':
        return <Flame className={`${iconClass} text-orange-400`} />;
      case 'tools':
        return <Wrench className={`${iconClass} text-stone-300`} />;
      case 'agriculture':
        return <Sprout className={`${iconClass} text-amber-400`} />;
      case 'pottery':
        return <Archive className={`${iconClass} text-amber-600`} />;
      case 'basic_construction':
        return <Building className={`${iconClass} text-yellow-500`} />;
      case 'water_management':
        return <Droplets className={`${iconClass} text-sky-400`} />;
      case 'trade':
        return <Coins className={`${iconClass} text-amber-300`} />;
      case 'early_metallurgy':
        return <Shield className={`${iconClass} text-orange-500`} />;
      default:
        return <Sparkles className={`${iconClass} text-amber-400`} />;
    }
  };

  const unlockedTechIds = new Set(safeTechs.filter((t) => t.unlocked).map((t) => t.id));

  return (
    <div className="w-full space-y-6 text-left max-w-5xl mx-auto">
      {/* Header & Disclaimer */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3 mb-3">
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-amber-100 tracking-wide">
              EARLY CIVILIZATION TECHNOLOGY TREE
            </h2>
            <p className="text-xs text-stone-400">
              Transform raw natural observation into generational civil engineering
            </p>
          </div>
          <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 text-xs text-amber-300">
            <span>Available Knowledge:</span>
            <strong className="text-sm font-bold text-amber-400 tabular-nums">
              {availableKnowledge}
            </strong>
          </div>
        </div>

        {/* Clear Pedagogical & Game Progression Disclaimer */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200/90">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 block">Game progression — simplified for gameplay.</strong>
            <span>
              This sequence provides an intuitive game progression for Early Settlement. Detailed historical and regional archaeological timelines will be introduced in later civilization chapters.
            </span>
          </div>
        </div>
      </div>

      {/* Visual Technology Flow Grid */}
      <div className="space-y-4">
        {safeTechs.map((tech, index) => {
          const isUnlocked = tech.unlocked;
          const prereqMet = !tech.prerequisiteId || unlockedTechIds.has(tech.prerequisiteId);
          const canAfford = availableKnowledge >= tech.knowledgeCost;
          const isReadyToResearch = !isUnlocked && prereqMet;

          return (
            <div key={tech.id} className="relative flex flex-col items-center">
              <div
                className={`w-full rounded-xl border p-4 sm:p-5 transition-all ${
                  isUnlocked
                    ? 'bg-stone-900/80 border-emerald-700/50 shadow-md'
                    : isReadyToResearch
                    ? 'bg-stone-900 border-amber-600/70 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/40'
                    : 'bg-stone-950/60 border-stone-850 opacity-65'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-3 rounded-xl border shrink-0 ${
                        isUnlocked
                          ? 'bg-emerald-950/60 border-emerald-700/60'
                          : isReadyToResearch
                          ? 'bg-amber-950/80 border-amber-600/60'
                          : 'bg-stone-950 border-stone-800'
                      }`}
                    >
                      {getTechIcon(tech.id)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display font-bold text-sm sm:text-base text-stone-100 tracking-wide">
                          {tech.name}
                        </h3>
                        {isUnlocked ? (
                          <span className="text-[10px] uppercase font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-400" /> Unlocked
                          </span>
                        ) : isReadyToResearch ? (
                          <span className="text-[10px] uppercase font-semibold bg-amber-950 text-amber-300 border border-amber-700 px-2 py-0.5 rounded">
                            Ready to Research
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-semibold bg-stone-900 text-stone-400 border border-stone-800 px-2 py-0.5 rounded flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
                        {tech.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-stone-400">
                        <span className="text-amber-400/90 font-medium">
                          ✦ Effect: {tech.effectDescription}
                        </span>
                        {tech.prerequisiteId && (
                          <span className="text-stone-500">
                            · Requires: {technologies.find((t) => t.id === tech.prerequisiteId)?.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Research Action Button */}
                  <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800">
                    {!isUnlocked ? (
                      <button
                        onClick={() => onResearch(tech.id)}
                        disabled={!isReadyToResearch || !canAfford}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                          isReadyToResearch && canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                            : 'bg-stone-800 text-stone-400 cursor-not-allowed border border-stone-700'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>RESEARCH</span>
                        <span className="tabular-nums font-mono text-[11px] opacity-90">
                          ({tech.knowledgeCost} Knowledge)
                        </span>
                      </button>
                    ) : (
                      <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 py-1.5">
                        <CheckCircle className="w-4 h-4" />
                        <span>Researched</span>
                      </div>
                    )}

                    {!isUnlocked && isReadyToResearch && !canAfford && (
                      <span className="text-[11px] text-amber-500/90">
                        Need {tech.knowledgeCost - availableKnowledge} more Knowledge
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Connecting Prerequisite Arrow */}
              {index < technologies.length - 1 && (
                <div className="my-1.5 text-stone-600">
                  <ArrowDown className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
