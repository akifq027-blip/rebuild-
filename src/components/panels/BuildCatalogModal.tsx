/**
 * BHARAT — Build the Civilization
 * Architectural Construction Catalog Modal (10 Original Structures)
 */

import React, { useState } from 'react';
import {
  BuildingDefinition,
  BuildingPlot,
  BuildingCategory,
  CoreResourceKey,
} from '../../types/civilization';
import { BUILDINGS_CATALOG } from '../../game/buildingsData';
import { canAffordCost } from '../../game/gameState';
import {
  X,
  Hammer,
  Lock,
  CheckCircle,
  Clock,
  Wheat,
  Trees,
  Gem,
  Flame,
  BookOpen,
  Filter,
} from 'lucide-react';

interface BuildCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlot: BuildingPlot | null;
  currentResources: Record<CoreResourceKey, number>;
  civCenterLevel: number;
  unlockedTechIds: Set<string>;
  existingBuildingIds: Set<string>;
  onConstructBuilding: (buildingId: string, plotId: number) => void;
}

export const BuildCatalogModal: React.FC<BuildCatalogModalProps> = ({
  isOpen,
  onClose,
  targetPlot,
  currentResources,
  civCenterLevel,
  unlockedTechIds,
  existingBuildingIds,
  onConstructBuilding,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<BuildingCategory | 'all'>('all');

  if (!isOpen || !targetPlot) return null;

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

  const categories: Array<{ id: BuildingCategory | 'all'; label: string }> = [
    { id: 'all', label: 'All Structures' },
    { id: 'production', label: 'Production' },
    { id: 'storage', label: 'Storage' },
    { id: 'military', label: 'Military' },
    { id: 'science', label: 'Science' },
    { id: 'water', label: 'Water & Health' },
    { id: 'economy', label: 'Trade & Economy' },
  ];

  const filteredBuildings = Object.values(BUILDINGS_CATALOG).filter((b) => {
    if (b.id === 'civ_center') return false; // Civilization center already placed
    if (selectedCategory === 'all') return true;
    return b.category === selectedCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in text-left">
      <div className="bg-stone-900 border border-amber-900/60 rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800/40">
                SETTLEMENT Nirmana
              </span>
              <span className="text-xs text-stone-400">Plot #{targetPlot.id}: {targetPlot.name}</span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-amber-100 mt-1">
              ARCHITECTURAL CONSTRUCTION CATALOG
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-amber-600 text-stone-950 font-bold shadow-md'
                  : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Buildings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredBuildings.map((b) => {
            const cost = b.costForLevel(1);
            const { affordable, missing } = canAffordCost(currentResources, cost);
            const reqCivCenter = b.requiredCivCenterLevel(1);
            const isCivCenterMet = civCenterLevel >= reqCivCenter;
            const isTechMet = !b.requiredTechId || unlockedTechIds.has(b.requiredTechId);
            const isAlreadyBuilt = existingBuildingIds.has(b.id);
            const canBuild = affordable && isCivCenterMet && isTechMet;

            const initialProduction = b.productionForLevel(1);

            return (
              <div
                key={b.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  canBuild
                    ? 'bg-stone-950/70 border-stone-800 hover:border-amber-700/60 shadow-md'
                    : 'bg-stone-950/40 border-stone-850 opacity-70'
                }`}
              >
                <div className="space-y-2">
                  {/* Top: Name & Category */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-sm sm:text-base text-amber-100">
                          {b.name}
                        </h3>
                        {isAlreadyBuilt && (
                          <span className="text-[9px] bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded font-mono">
                            Built
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-amber-400/80 font-mono italic">
                        {b.sanskritName} · {b.category.toUpperCase()}
                      </span>
                    </div>

                    {/* Lock / Ready Status */}
                    {!isCivCenterMet ? (
                      <span className="text-[10px] bg-red-950/70 border border-red-800/60 text-red-300 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Citadel Lvl {reqCivCenter}</span>
                      </span>
                    ) : !isTechMet ? (
                      <span className="text-[10px] bg-amber-950/70 border border-amber-800/60 text-amber-300 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Tech Required</span>
                      </span>
                    ) : affordable ? (
                      <span className="text-[10px] bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Ready</span>
                      </span>
                    ) : (
                      <span className="text-[10px] bg-stone-900 border border-stone-700 text-amber-400 px-2 py-0.5 rounded font-mono">
                        Need Materials
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {b.description}
                  </p>

                  {/* Initial Production or Benefits */}
                  {initialProduction && (
                    <div className="text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2 py-1 rounded-lg">
                      Yield: +{initialProduction.amountPerHour} {initialProduction.resource.toUpperCase()} / hour
                    </div>
                  )}

                  {/* Cost Chips */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-stone-400 uppercase font-mono font-medium block">
                      Construction Cost:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(Object.keys(cost) as CoreResourceKey[]).map((resKey) => {
                        const req = cost[resKey] || 0;
                        const have = currentResources[resKey] || 0;
                        const isEnough = have >= req;

                        return (
                          <span
                            key={resKey}
                            className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg border font-mono ${
                              isEnough
                                ? 'bg-stone-900 border-stone-750 text-stone-200'
                                : 'bg-red-950/70 border-red-800/60 text-red-300'
                            }`}
                          >
                            {getResourceIcon(resKey)}
                            <span>{req} {resKey}</span>
                            <span className="text-[9px] text-stone-400">({have})</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Construct Button */}
                <button
                  onClick={() => {
                    onConstructBuilding(b.id, targetPlot.id);
                    onClose();
                  }}
                  disabled={!canBuild}
                  className="mt-3.5 w-full py-2.5 px-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 disabled:opacity-30 disabled:cursor-not-allowed text-stone-950 font-bold text-xs rounded-xl transition-transform hover:scale-102 cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Hammer className="w-3.5 h-3.5 text-stone-950" />
                  <span>
                    {!isCivCenterMet
                      ? `REQUIRES CITADEL LVL ${reqCivCenter}`
                      : !isTechMet
                      ? 'REQUIRES TECHNOLOGY RESEARCH'
                      : !affordable
                      ? 'INSUFFICIENT MATERIALS'
                      : `CONSTRUCT ON PLOT #${targetPlot.id}`}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
