/**
 * BHARAT — Build the Civilization
 * Martial Training Grounds & Army Muster (Akhada)
 */

import React, { useState } from 'react';
import {
  UnitType,
  ArmyTroopGroup,
  CoreResourceKey,
} from '../../types/civilization';
import { UNITS_CATALOG } from '../../game/armyData';
import { canAffordCost } from '../../game/gameState';
import {
  Shield,
  Swords,
  Crosshair,
  Zap,
  Wheat,
  Trees,
  Gem,
  Flame,
  BookOpen,
  CheckCircle,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';

interface ArmyTrainingPanelProps {
  army: ArmyTroopGroup[];
  currentResources: Record<CoreResourceKey, number>;
  trainingGroundLevel: number;
  unlockedTechIds: Set<string>;
  onTrainUnits: (unitId: string, count: number) => void;
}

export const ArmyTrainingPanel: React.FC<ArmyTrainingPanelProps> = ({
  army,
  currentResources,
  trainingGroundLevel,
  unlockedTechIds,
  onTrainUnits,
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>('padati');
  const [recruitCount, setRecruitCount] = useState<number>(5);

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

  const getTroopCount = (unitId: string) => {
    return army.find((a) => a.unitId === unitId)?.count || 0;
  };

  const totalTroops = army.reduce((sum, a) => sum + a.count, 0);

  const selectedUnit = UNITS_CATALOG[selectedUnitId];

  // Calculate batch cost
  const batchCost = {
    food: (selectedUnit.cost.food || 0) * recruitCount,
    wood: (selectedUnit.cost.wood || 0) * recruitCount,
    stone: (selectedUnit.cost.stone || 0) * recruitCount,
    clay: (selectedUnit.cost.clay || 0) * recruitCount,
  };

  const { affordable, missing } = canAffordCost(currentResources, batchCost);
  const isTechUnlocked = !selectedUnit.requiredTechId || unlockedTechIds.has(selectedUnit.requiredTechId);
  const isLevelMet = trainingGroundLevel >= selectedUnit.requiredBuildingLevel;
  const canRecruit = affordable && isTechUnlocked && isLevelMet && trainingGroundLevel > 0;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 text-left animate-fade-in">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-amber-900/50 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800/40">
              MARTIAL AKHADA
            </span>
            <span className="text-xs text-stone-400">Chaturanga Defensive Forces</span>
          </div>
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-amber-100 mt-1">
            CIVILIZATION GARRISON & REGIMENTS
          </h2>
          <p className="text-xs text-stone-300 max-w-xl mt-1 leading-relaxed">
            Mustering trained infantry, archers, cavalry scouts, and fortress war elephants ensures the safety of your agricultural stores and allows deep expeditions.
          </p>
        </div>

        {/* Total Army Stats Pill */}
        <div className="flex items-center gap-3 bg-stone-950/80 border border-stone-800 px-4 py-3 rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-700/60 flex items-center justify-center text-red-300">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-mono block">
              Standing Army
            </span>
            <span className="font-display font-bold text-lg text-stone-100 tabular-nums">
              {totalTroops} Warriors
            </span>
          </div>
        </div>
      </div>

      {/* No Training Ground Warning */}
      {trainingGroundLevel === 0 && (
        <div className="p-4 bg-amber-950/50 border border-amber-800/60 rounded-xl text-xs text-amber-300 flex items-center gap-2.5">
          <span className="text-lg">⚔️</span>
          <div>
            <strong className="block font-bold">Training Ground (Akhada) Not Yet Constructed</strong>
            <span>Construct a Training Ground from the BUILD tab to recruit and drill regiments.</span>
          </div>
        </div>
      )}

      {/* 2-Column: Left Units Selection & Right Recruitment Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Unit Cards List */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs text-stone-400 uppercase font-mono font-bold tracking-wider block">
            Select Regiment Type:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.values(UNITS_CATALOG).map((unit) => {
              const isSelected = selectedUnitId === unit.id;
              const hasTech = !unit.requiredTechId || unlockedTechIds.has(unit.requiredTechId);
              const count = getTroopCount(unit.id);

              return (
                <div
                  key={unit.id}
                  onClick={() => setSelectedUnitId(unit.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-950/80 border-amber-500 shadow-xl scale-102 ring-2 ring-amber-400/50'
                      : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm text-stone-100">
                          {unit.name}
                        </h4>
                        <span className="text-[10px] bg-stone-800 text-stone-300 font-mono px-1.5 py-0.5 rounded">
                          T{unit.tier}
                        </span>
                      </div>
                      <span className="text-xs text-amber-400/80 font-mono block italic">
                        {unit.sanskritName}
                      </span>
                    </div>

                    <span className="text-xs bg-stone-950 font-bold px-2 py-0.5 rounded border border-stone-800 text-amber-300">
                      {count} Ready
                    </span>
                  </div>

                  {/* Attributes */}
                  <div className="grid grid-cols-3 gap-1 pt-2.5 text-[10px] text-stone-300 font-mono">
                    <span className="bg-stone-950/70 p-1 rounded text-center">
                      ⚔️ ATK {unit.attack}
                    </span>
                    <span className="bg-stone-950/70 p-1 rounded text-center">
                      🛡️ DEF {unit.defense}
                    </span>
                    <span className="bg-stone-950/70 p-1 rounded text-center">
                      ❤️ HP {unit.health}
                    </span>
                  </div>

                  {!hasTech && (
                    <span className="mt-2 text-[10px] text-amber-400 block font-mono">
                      🔒 Requires Archery Research
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Training Detail & Batch Recruitment */}
        <div className="lg:col-span-5 bg-stone-900/90 border border-amber-900/50 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="border-b border-stone-800 pb-3">
            <span className="text-[10px] text-amber-400 uppercase font-mono font-bold tracking-wider">
              Selected Regiment
            </span>
            <h3 className="font-display font-bold text-lg text-amber-100 mt-0.5">
              {selectedUnit.name} ({selectedUnit.sanskritName})
            </h3>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              {selectedUnit.description}
            </p>
          </div>

          {/* Historical Note */}
          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800 text-xs text-stone-300 leading-relaxed italic">
            "{selectedUnit.historicalNote}"
          </div>

          {/* Quantity Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-300">
              <span>Recruit Batch Size:</span>
              <span className="font-mono text-amber-400 font-bold">{recruitCount} Units</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 5, 10, 20].map((qty) => (
                <button
                  key={qty}
                  onClick={() => setRecruitCount(qty)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer ${
                    recruitCount === qty
                      ? 'bg-amber-600 text-stone-950'
                      : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  +{qty}
                </button>
              ))}
            </div>
          </div>

          {/* Required Batch Resources */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] text-stone-400 uppercase font-mono font-semibold block">
              Required Sustenance & Equipment:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(batchCost) as (keyof typeof batchCost)[]).map((resKey) => {
                const req = batchCost[resKey] || 0;
                if (req === 0) return null;
                const have = currentResources[resKey] || 0;
                const isEnough = have >= req;

                return (
                  <span
                    key={resKey}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border font-mono ${
                      isEnough
                        ? 'bg-stone-950 border-stone-800 text-stone-200'
                        : 'bg-red-950/70 border-red-800/60 text-red-300'
                    }`}
                  >
                    {getResourceIcon(resKey)}
                    <span>{req} {resKey}</span>
                    <span className="text-[10px] text-stone-400">({have})</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Recruit Button */}
          <button
            onClick={() => onTrainUnits(selectedUnit.id, recruitCount)}
            disabled={!canRecruit}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-display font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4 text-stone-950" />
            <span>
              {trainingGroundLevel === 0
                ? 'AKHADA GROUND REQUIRED'
                : !isTechUnlocked
                ? 'TECHNOLOGY RESEARCH REQUIRED'
                : !affordable
                ? 'INSUFFICIENT RESOURCES'
                : `TRAIN ${recruitCount} ${selectedUnit.name.toUpperCase()}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
