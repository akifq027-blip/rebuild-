/**
 * BHARAT — Build the Civilization
 * Contextual Building Inspector Panel (Desktop Side Dock & Mobile Modal Sheet)
 */

import React from 'react';
import {
  BuildingPlot,
  CoreResourceKey,
} from '../../types/civilization';
import { BUILDINGS_CATALOG } from '../../game/buildingsData';
import { canAffordCost } from '../../game/gameState';
import {
  X,
  Sparkles,
  ArrowUpCircle,
  Clock,
  Landmark,
  Layers,
  BookOpen,
  Wheat,
  Trees,
  Gem,
  Flame,
  CheckCircle,
  AlertCircle,
  Trash2,
} from 'lucide-react';

interface ContextualBuildingPanelProps {
  plot: BuildingPlot | null;
  currentResources: Record<CoreResourceKey, number>;
  civCenterLevel: number;
  onClose: () => void;
  onUpgradeBuilding: (plotId: number) => void;
  onDemolishBuilding?: (plotId: number) => void;
  onOpenBuildCatalog: (plotId: number) => void;
}

export const ContextualBuildingPanel: React.FC<ContextualBuildingPanelProps> = ({
  plot,
  currentResources,
  civCenterLevel,
  onClose,
  onUpgradeBuilding,
  onDemolishBuilding,
  onOpenBuildCatalog,
}) => {
  if (!plot) return null;

  const buildingDef = plot.buildingId ? BUILDINGS_CATALOG[plot.buildingId] : null;

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

  // If empty plot
  if (!plot.buildingId || !buildingDef) {
    return (
      <div className="w-full bg-stone-900 border border-amber-900/60 rounded-2xl p-5 shadow-2xl space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
              UNOCCUPIED PLOT #{plot.id}
            </span>
            <h3 className="font-display font-bold text-lg text-amber-100 mt-1">
              {plot.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          This cleared alluvial foundation terrace is ready for new civic or economic construction.
        </p>

        <button
          onClick={() => onOpenBuildCatalog(plot.id)}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 font-display font-bold text-sm rounded-xl shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-stone-950" />
          <span>OPEN ARCHITECTURAL CATALOG</span>
        </button>
      </div>
    );
  }

  // Active Building Calculations
  const currentLevel = plot.level;
  const isMaxLevel = currentLevel >= buildingDef.maxLevel;
  const nextLevel = currentLevel + 1;
  const upgradeCost = !isMaxLevel ? buildingDef.costForLevel(nextLevel) : {};
  const { affordable, missing } = !isMaxLevel
    ? canAffordCost(currentResources, upgradeCost)
    : { affordable: false, missing: {} };

  const requiredCivCenterLvl = !isMaxLevel
    ? buildingDef.requiredCivCenterLevel(nextLevel)
    : 1;
  const civCenterRequirementMet =
    buildingDef.id === 'civ_center' || civCenterLevel >= requiredCivCenterLvl;

  const currentProduction = buildingDef.productionForLevel(currentLevel);
  const nextProduction = !isMaxLevel ? buildingDef.productionForLevel(nextLevel) : null;
  const upgradeDuration = !isMaxLevel ? buildingDef.upgradeTimeSeconds(nextLevel) : 0;

  return (
    <div className="w-full bg-stone-900 border border-amber-900/60 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4 text-left animate-fade-in">
      {/* 1. Header: Building Name & Sanskrit Title */}
      <div className="flex items-start justify-between border-b border-stone-800 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-widest bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
              {buildingDef.category.toUpperCase()} · PLOT #{plot.id}
            </span>
            <span className="text-[10px] bg-amber-500 text-stone-950 font-bold px-1.5 py-0.5 rounded">
              LEVEL {currentLevel}
            </span>
          </div>

          <h2 className="font-display font-bold text-xl sm:text-2xl text-amber-100 flex items-center gap-2">
            <span>{buildingDef.name}</span>
          </h2>
          <span className="text-xs font-mono text-amber-400/90 italic block">
            {buildingDef.sanskritName}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Building Purpose Description */}
      <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
        {buildingDef.description}
      </p>

      {/* 3. Current Operational Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-stone-950/70 p-2.5 rounded-xl border border-stone-800 space-y-1">
          <span className="text-[10px] text-stone-400 uppercase font-mono block">
            Current Yield
          </span>
          <div className="font-bold text-stone-100 flex items-center gap-1.5">
            {currentProduction ? (
              <>
                {getResourceIcon(currentProduction.resource)}
                <span>+{currentProduction.amountPerHour}/hr</span>
              </>
            ) : (
              <span className="text-stone-400">Civic Administration</span>
            )}
          </div>
        </div>

        <div className="bg-stone-950/70 p-2.5 rounded-xl border border-stone-800 space-y-1">
          <span className="text-[10px] text-stone-400 uppercase font-mono block">
            Storage / Capacity
          </span>
          <span className="font-bold text-stone-100 block">
            +{buildingDef.storageBonusForLevel(currentLevel)} Capacity
          </span>
        </div>
      </div>

      {/* 4. Upgrade Section */}
      {!isMaxLevel ? (
        <div className="bg-stone-950/90 border border-amber-900/40 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <ArrowUpCircle className="w-4 h-4 text-amber-400" />
              <span>UPGRADE TO LEVEL {nextLevel}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-stone-400 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{upgradeDuration}s duration</span>
            </div>
          </div>

          {/* Upgraded Benefits Preview */}
          {nextProduction && (
            <div className="text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 p-2 rounded-lg flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                Production increases to +{nextProduction.amountPerHour}{' '}
                {nextProduction.resource.toUpperCase()} / hr
              </span>
            </div>
          )}

          {/* Required Resources Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-stone-400 uppercase font-mono font-semibold block">
              Required Construction Materials:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(upgradeCost) as CoreResourceKey[]).map((resKey) => {
                const req = upgradeCost[resKey] || 0;
                const have = currentResources[resKey] || 0;
                const isEnough = have >= req;

                return (
                  <div
                    key={resKey}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border font-mono ${
                      isEnough
                        ? 'bg-stone-900 border-stone-750 text-stone-200'
                        : 'bg-red-950/60 border-red-800/60 text-red-300 font-bold'
                    }`}
                  >
                    {getResourceIcon(resKey)}
                    <span>
                      {req} {resKey.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      ({have}/{req})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Required Civ Center Level notice if not met */}
          {!civCenterRequirementMet && (
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/60 border border-amber-800/60 p-2 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                Requires Civilization Center Level {requiredCivCenterLvl} first!
              </span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => onUpgradeBuilding(plot.id)}
            disabled={!affordable || !civCenterRequirementMet}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowUpCircle className="w-4 h-4 text-stone-950" />
            <span>
              {!civCenterRequirementMet
                ? 'CIVILIZATION CENTER LEVEL TOO LOW'
                : !affordable
                ? 'INSUFFICIENT RESOURCES'
                : `UPGRADE TO LEVEL ${nextLevel}`}
            </span>
          </button>
        </div>
      ) : (
        <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-800/40 text-center text-xs text-amber-300 font-bold">
          ★ Maximum Architectural Level Reached (Level {buildingDef.maxLevel})
        </div>
      )}

      {/* 5. Authentic Historical & Archaeological Insight Card */}
      <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-3.5 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[10px]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Historical & Archaeological Evidence:</span>
        </div>
        <p className="text-stone-300 leading-relaxed italic text-[11px] sm:text-xs">
          "{buildingDef.historicalSignificance}"
        </p>
        <span className="text-[10px] text-amber-400/80 font-mono block pt-1">
          Site Reference: {buildingDef.archaeologicalSiteRef}
        </span>
      </div>
    </div>
  );
};
