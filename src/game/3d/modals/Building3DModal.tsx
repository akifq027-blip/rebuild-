import React, { useState } from 'react';
import { BuildingItem, BuildingSlot, ResourceKey } from '../../../types/game';
import { canAfford } from '../../economy';
import {
  Hammer,
  Home,
  Sprout,
  CircleDot,
  Archive,
  X,
  Sparkles,
  ArrowUpCircle,
  AlertCircle,
  CheckCircle,
  Lock,
} from 'lucide-react';

interface Building3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: BuildingSlot | null;
  buildings: BuildingItem[];
  technologies: { id: string; unlocked: boolean }[];
  currentResources: Record<ResourceKey, number>;
  onBuild: (buildingId: string) => void;
  onUpgrade?: (slotId: number) => void;
  onNeedResourcesPrompt?: (buildingName: string, missingStr: string) => void;
}

export const Building3DModal: React.FC<Building3DModalProps> = ({
  isOpen,
  onClose,
  slot,
  buildings,
  technologies,
  currentResources,
  onBuild,
  onUpgrade,
  onNeedResourcesPrompt,
}) => {
  const [selectedForAdvice, setSelectedForAdvice] = useState<string | null>(null);

  if (!isOpen || !slot) return null;

  const unlockedTechIds = new Set(technologies.filter((t) => t.unlocked).map((t) => t.id));
  const existingBuilding = slot.buildingId
    ? buildings.find((b) => b.id === slot.buildingId)
    : null;

  const currentLevel = slot.level || 1;

  // Icon mapping
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="w-5 h-5 text-amber-400" />;
      case 'Sprout':
        return <Sprout className="w-5 h-5 text-emerald-400" />;
      case 'CircleDot':
        return <CircleDot className="w-5 h-5 text-cyan-400" />;
      case 'Archive':
        return <Archive className="w-5 h-5 text-orange-400" />;
      case 'Hammer':
        return <Hammer className="w-5 h-5 text-amber-400" />;
      default:
        return <Hammer className="w-5 h-5 text-amber-400" />;
    }
  };

  // Upgrade costs calculation (50% increase per level)
  const upgradeCost: Partial<Record<ResourceKey, number>> = existingBuilding
    ? Object.entries(existingBuilding.cost).reduce((acc, [k, v]) => {
        acc[k as ResourceKey] = Math.round((v || 0) * (currentLevel * 0.75 + 0.5));
        return acc;
      }, {} as Partial<Record<ResourceKey, number>>)
    : {};

  const canAffordUpgrade = existingBuilding
    ? canAfford(currentResources, upgradeCost).affordable
    : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in text-left">
      <div className="bg-stone-900 border border-amber-900/60 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                Plot #{slot.id} · 3D Settlement
              </span>
              <span className="text-stone-500">·</span>
              <span className="text-xs text-stone-400">{slot.name}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-amber-200">
              {existingBuilding
                ? `${existingBuilding.name} (Tier ${currentLevel})`
                : 'Construct New Building'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Building Details & Upgrade */}
        {existingBuilding ? (
          <div className="space-y-4">
            <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center shrink-0">
                  {getIcon(existingBuilding.iconName)}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-stone-100">
                    {existingBuilding.name}
                  </h3>
                  <p className="text-xs text-stone-300">
                    {existingBuilding.shortDescription}
                  </p>
                </div>
              </div>

              {/* Archaeological & Historical Significance */}
              <div className="bg-stone-900/90 border border-amber-900/30 rounded-lg p-3 text-xs text-stone-300 space-y-1">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">
                  Historical Evidence & Significance
                </span>
                <p className="leading-relaxed text-stone-300">
                  {existingBuilding.historicalSignificance}
                </p>
                <span className="text-[10px] text-stone-400 block pt-1 italic">
                  Category: {existingBuilding.category} · Educational architecture model
                </span>
              </div>

              {/* Current Output / Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-stone-900/70 p-2.5 rounded-lg border border-stone-800">
                  <span className="text-stone-400 block text-[11px]">Shelter & Capacity</span>
                  <span className="font-bold text-amber-300">
                    {existingBuilding.populationEffect > 0
                      ? `+${existingBuilding.populationEffect * currentLevel} Population Cap`
                      : 'Community Infrastructure'}
                  </span>
                </div>
                <div className="bg-stone-900/70 p-2.5 rounded-lg border border-stone-800">
                  <span className="text-stone-400 block text-[11px]">Production Output</span>
                  <span className="font-bold text-emerald-400">
                    {existingBuilding.productionEffect
                      ? `+${existingBuilding.productionEffect.amount * currentLevel} ${existingBuilding.productionEffect.resource}`
                      : 'Resource Storage / Hearth'}
                  </span>
                </div>
              </div>
            </div>

            {/* Upgrade Section */}
            {currentLevel < 3 ? (
              <div className="bg-gradient-to-r from-amber-950/40 to-stone-900 border border-amber-700/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowUpCircle className="w-5 h-5 text-amber-400" />
                    <span className="font-display font-bold text-sm text-amber-200">
                      Upgrade to Tier {currentLevel + 1}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400">
                    Max Tier: 3
                  </span>
                </div>

                <p className="text-xs text-stone-300">
                  Enhance building structural integrity with reinforced timber posts and improved hearth capacity.
                </p>

                {/* Upgrade Resource Requirements */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="text-xs text-stone-400 font-semibold">Cost:</span>
                  {Object.entries(upgradeCost).map(([res, cost]) => {
                    const have = currentResources[res as ResourceKey] || 0;
                    const isEnough = have >= (cost || 0);
                    return (
                      <span
                        key={res}
                        className={`text-xs px-2 py-0.5 rounded border ${
                          isEnough
                            ? 'bg-stone-800 text-stone-200 border-stone-700'
                            : 'bg-red-950/50 text-red-300 border-red-800/60'
                        }`}
                      >
                        {cost} {res.toUpperCase()} (Have: {have})
                      </span>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    if (onUpgrade) onUpgrade(slot.id);
                    onClose();
                  }}
                  disabled={!canAffordUpgrade}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>UPGRADE BUILDING</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 text-center text-xs text-amber-400/90 font-medium">
                ★ Structure is at maximum architectural tier (Tier 3).
              </div>
            )}
          </div>
        ) : (
          /* Empty Plot: Construction Catalog */
          <div className="space-y-3">
            <p className="text-xs text-stone-400">
              Select a modular civilization structure to construct on this foundation plot:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
              {buildings.map((b) => {
                const isUnlocked = !b.requiredTech || unlockedTechIds.has(b.requiredTech);
                const { affordable, missing } = canAfford(currentResources, b.cost);

                return (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                      isUnlocked
                        ? 'bg-stone-950/70 border-stone-800 hover:border-amber-700/60'
                        : 'bg-stone-950/30 border-stone-900 opacity-60'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center">
                            {getIcon(b.iconName)}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-stone-100">{b.name}</h4>
                            <span className="text-[10px] text-amber-500 uppercase tracking-wider block">
                              {b.category}
                            </span>
                          </div>
                        </div>

                        {!isUnlocked ? (
                          <span className="text-[10px] bg-red-950/60 text-red-400 border border-red-800/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </span>
                        ) : affordable ? (
                          <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Ready</span>
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-950/60 text-amber-400 border border-amber-800/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>Need Res</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed">
                        {b.shortDescription}
                      </p>

                      {/* Educational Note */}
                      <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed italic border-t border-stone-850 pt-1.5">
                        "{b.historicalSignificance}"
                      </p>

                      {/* Cost Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {Object.entries(b.cost).map(([res, cost]) => {
                          const have = currentResources[res as ResourceKey] || 0;
                          const isEnough = have >= (cost || 0);
                          return (
                            <span
                              key={res}
                              className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                isEnough
                                  ? 'bg-stone-900 text-stone-300 border-stone-800'
                                  : 'bg-red-950/60 text-red-300 border-red-800/50'
                              }`}
                            >
                              {cost} {res}
                            </span>
                          );
                        })}
                      </div>

                      {!isUnlocked && b.requiredTech && (
                        <span className="text-[11px] text-red-400 block">
                          Requires Technology: {b.requiredTech}
                        </span>
                      )}

                      {/* Acharya Contextual Guidance Banner when resources are needed */}
                      {selectedForAdvice === b.id && !affordable && (
                        <div className="bg-amber-950/60 border border-amber-800/60 rounded-lg p-2.5 mt-2 space-y-1 text-left animate-fade-in">
                          <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                            <span>🤖</span>
                            <span>Acharya:</span>
                          </div>
                          <p className="text-[11px] text-amber-100/90 leading-relaxed">
                            "You need more resources for this {b.name}. Explore the river terrace and gather{' '}
                            {Object.entries(missing).map(([k, v]) => `${v} ${k.toUpperCase()}`).join(', ')}."
                          </p>
                        </div>
                      )}
                    </div>

                    {!isUnlocked ? (
                      <button
                        disabled
                        className="mt-3 w-full py-2 px-3 bg-stone-800/60 opacity-50 cursor-not-allowed text-stone-400 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>LOCKED BY TECHNOLOGY</span>
                      </button>
                    ) : !affordable ? (
                      <button
                        onClick={() => {
                          const missingStr = Object.entries(missing)
                            .map(([k, v]) => `${v} ${k}`)
                            .join(', ');
                          setSelectedForAdvice(b.id);
                          if (onNeedResourcesPrompt) {
                            onNeedResourcesPrompt(b.name, missingStr);
                          }
                        }}
                        className="mt-3 w-full py-2 px-3 bg-stone-850 hover:bg-stone-800 text-amber-400 border border-amber-700/60 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>NEED RESOURCES (ASK ACHARYA)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onBuild(b.id);
                          onClose();
                        }}
                        className="mt-3 w-full py-2 px-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Hammer className="w-3.5 h-3.5 text-stone-950" />
                        <span>CONSTRUCT HERE</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
