import React from 'react';
import { GameState } from '../../types/game';
import {
  Compass,
  CheckCircle,
  Circle,
  Lock,
  Sparkles,
  ArrowRight,
  X,
  BookOpen,
  Award,
  Layers,
  Landmark,
} from 'lucide-react';

interface CivilizationProgressionModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onOpenTimeline?: () => void;
  onAdvanceEra?: (eraId: string) => void;
}

export const CivilizationProgressionModal: React.FC<CivilizationProgressionModalProps> = ({
  isOpen,
  onClose,
  gameState,
  onOpenTimeline,
  onAdvanceEra,
}) => {
  if (!isOpen) return null;

  const currentEra =
    gameState.historicalEras.find((e) => e.id === gameState.activeEraId) ||
    gameState.historicalEras[0];

  const constructedCount = gameState.buildings.reduce((sum, b) => sum + (b.currentCount || 0), 0);
  const discoveredCount = (gameState.discoveries || []).filter((d) => d.discovered).length;
  const completedMissionsCount = (gameState.missions || []).filter((m) => m.completed).length;
  const unlockedTechCount = (gameState.technologies || []).filter((t) => t.unlocked).length;
  const upgradedSlotCount = gameState.buildingSlots.filter((s) => (s.level || 1) > 1).length;

  // Criteria evaluations
  const foundationComplete = constructedCount >= 1 && (gameState.gatheredTotals?.wood || 0) >= 20;
  const developmentComplete = constructedCount >= 3 && unlockedTechCount >= 1;
  const discoveryComplete = discoveredCount >= 2 && completedMissionsCount >= 1;

  // Chapter 2 unlock requirements
  const nextEraReq = currentEra.unlockRequirements || { population: 7 };
  const canAdvance =
    gameState.civilization.population >= (nextEraReq.population || 7) &&
    foundationComplete &&
    developmentComplete;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in text-left">
      <div className="bg-stone-900 border border-amber-700/60 rounded-2xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/40">
                CIVILIZATION MILESTONE TRACKER
              </span>
              <span className="text-stone-600">·</span>
              <span className="text-xs text-stone-300 font-medium">Chapter {currentEra.chapterNumber}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-amber-100">
              CIVILIZATION PROGRESSION & MILESTONES
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Historical Educational Integrity Note */}
        <div className="bg-stone-950/80 border border-amber-900/40 rounded-xl p-3.5 text-xs text-stone-300 leading-relaxed space-y-1">
          <span className="font-bold text-amber-400 block text-[11px] uppercase tracking-wider">
            Educational Historical Note: Non-Linear Subcontinental Development
          </span>
          <p className="text-stone-300 text-[11px] sm:text-xs">
            Indian history is characterized by dynamic, contemporaneous regional traditions across the Indus-Saraswati basin, Ganga-Yamuna Doab, Deccan plateau, and southern coastal corridors. The stages below represent educational gameplay milestones rather than a rigid linear prescription.
          </p>
        </div>

        {/* 4 Progressive Stages */}
        <div className="space-y-4">
          {/* Stage 1: FOUNDATION */}
          <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-950/70 border border-amber-700/60 flex items-center justify-center text-amber-400 font-bold text-xs">
                  1
                </span>
                <div>
                  <h3 className="font-display font-bold text-sm text-stone-100">
                    FOUNDATION · Hearth & Alluvium
                  </h3>
                  <span className="text-[11px] text-stone-400">Establish settlement camp and early gathering</span>
                </div>
              </div>

              {foundationComplete ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Completed</span>
                </span>
              ) : (
                <span className="text-xs text-amber-400 font-medium">In Progress</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
              <div className="p-2.5 bg-stone-900/80 rounded-lg border border-stone-800 flex items-center gap-2">
                {constructedCount >= 1 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-stone-500 shrink-0" />
                )}
                <span>Erect First Living Hut ({constructedCount >= 1 ? '1/1' : '0/1'})</span>
              </div>

              <div className="p-2.5 bg-stone-900/80 rounded-lg border border-stone-800 flex items-center gap-2">
                {(gameState.gatheredTotals?.wood || 0) >= 20 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-stone-500 shrink-0" />
                )}
                <span>Gather Sal Timber ({Math.min(20, gameState.gatheredTotals?.wood || 0)}/20)</span>
              </div>

              <div className="p-2.5 bg-stone-900/80 rounded-lg border border-stone-800 flex items-center gap-2">
                {(gameState.gatheredTotals?.stone || 0) >= 10 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-stone-500 shrink-0" />
                )}
                <span>Quarry Granite Stone ({Math.min(10, gameState.gatheredTotals?.stone || 0)}/10)</span>
              </div>
            </div>
          </div>

          {/* Stage 2: DEVELOPMENT */}
          <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-950/70 border border-amber-700/60 flex items-center justify-center text-amber-400 font-bold text-xs">
                  2
                </span>
                <div>
                  <h3 className="font-display font-bold text-sm text-stone-100">
                    DEVELOPMENT · Architecture & Mastery
                  </h3>
                  <span className="text-[11px] text-stone-400">Expand modular architecture, upgrade structures and research</span>
                </div>
              </div>

              {developmentComplete ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Completed</span>
                </span>
              ) : (
                <span className="text-xs text-amber-400 font-medium">In Progress</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
              <div className="p-2.5 bg-stone-900/80 rounded-lg border border-stone-800 flex items-center gap-2">
                {constructedCount >= 3 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-stone-500 shrink-0" />
                )}
                <span>Construct 3 Structures ({constructedCount}/3)</span>
              </div>

              <div className="p-2.5 bg-stone-900/80 rounded-lg border border-stone-800 flex items-center gap-2">
                {upgradedSlotCount >= 1 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-stone-500 shrink-0" />
                )}
                <span>Upgrade Structure to Tier 2 ({upgradedSlotCount}/1)</span>
              </div>

              <div className="p-2.5 bg-stone-900/80 rounded-lg border border-stone-800 flex items-center gap-2">
                {unlockedTechCount >= 1 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-stone-500 shrink-0" />
                )}
                <span>Research Technology ({unlockedTechCount}/1)</span>
              </div>
            </div>
          </div>

          {/* Stage 3: DISCOVERY */}
          <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-950/70 border border-amber-700/60 flex items-center justify-center text-amber-400 font-bold text-xs">
                  3
                </span>
                <div>
                  <h3 className="font-display font-bold text-sm text-stone-100">
                    DISCOVERY · Archaeology & Knowledge
                  </h3>
                  <span className="text-[11px] text-stone-400">Survey 3D sites, investigate material culture, claim rewards</span>
                </div>
              </div>

              {discoveryComplete ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Completed</span>
                </span>
              ) : (
                <span className="text-xs text-amber-400 font-medium">In Progress</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
              <div className="p-2.5 bg-stone-900/80 rounded-lg border border-stone-800 flex items-center gap-2">
                {discoveredCount >= 2 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-stone-500 shrink-0" />
                )}
                <span>Investigate 2 3D Sites ({discoveredCount}/2)</span>
              </div>

              <div className="p-2.5 bg-stone-900/80 rounded-lg border border-stone-800 flex items-center gap-2">
                {gameState.resources.knowledge >= 40 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-stone-500 shrink-0" />
                )}
                <span>Accumulate Knowledge ({gameState.resources.knowledge}/40)</span>
              </div>

              <div className="p-2.5 bg-stone-900/80 rounded-lg border border-stone-800 flex items-center gap-2">
                {completedMissionsCount >= 1 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-stone-500 shrink-0" />
                )}
                <span>Fulfill Chapter Mission ({completedMissionsCount}/1)</span>
              </div>
            </div>
          </div>

          {/* Stage 4: ADVANCEMENT */}
          <div className="bg-gradient-to-r from-amber-950/50 via-stone-900 to-stone-950 border border-amber-700/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-600 text-stone-950 flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <div>
                  <h3 className="font-display font-bold text-sm text-amber-200">
                    ADVANCEMENT · Chapter Transition
                  </h3>
                  <span className="text-[11px] text-stone-400">Advance to Mature Harappan Urbanism (c. 2600–1900 BCE)</span>
                </div>
              </div>

              <span className="text-xs text-amber-400 font-semibold">
                Pop: {gameState.civilization.population} / {nextEraReq.population || 7}
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Transition from rural village hamlets to planned brick metropolises with covered drainage networks, standardized brick measures, and oceanic maritime trade.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => {
                  if (onAdvanceEra) onAdvanceEra('harappan');
                  onClose();
                }}
                disabled={!canAdvance}
                className="py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>ADVANCE TO HARAPPAN CHAPTER</span>
              </button>

              {onOpenTimeline && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenTimeline();
                  }}
                  className="py-2.5 px-3 bg-stone-850 hover:bg-stone-800 text-stone-300 text-xs font-semibold rounded-xl border border-stone-750 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>View All 11 Historical Chapters</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
