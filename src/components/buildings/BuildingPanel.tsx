import React from 'react';
import { BuildingItem, TechnologyItem, ResourceKey, CivilizationInfo } from '../../types/game';
import { BuildingCard } from './BuildingCard';
import {
  Hammer,
  Users,
  Package,
  Sprout,
  Waves,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';

interface BuildingPanelProps {
  buildings: BuildingItem[];
  technologies: TechnologyItem[];
  civilization: CivilizationInfo;
  currentResources: Record<ResourceKey, number>;
  storedProduction: {
    food: number;
    water: number;
    knowledge: number;
  };
  availableSlotCount: number;
  onBuild: (buildingId: string) => void;
  onCollectProduction: () => void;
  onGrowCommunity: () => void;
}

export const BuildingPanel: React.FC<BuildingPanelProps> = ({
  buildings = [],
  technologies = [],
  civilization,
  currentResources,
  storedProduction,
  availableSlotCount,
  onBuild,
  onCollectProduction,
  onGrowCommunity,
}) => {
  const safeTechs = Array.isArray(technologies) ? technologies : [];
  const safeBuildings = Array.isArray(buildings) ? buildings : [];
  const unlockedTechIds = new Set(safeTechs.filter((t) => t.unlocked).map((t) => t.id));

  const totalProductionStored =
    storedProduction.food + storedProduction.water + storedProduction.knowledge;

  // Population growth requirements
  const canGrowPop =
    currentResources.food >= 20 &&
    currentResources.water >= 10 &&
    civilization.population < civilization.populationCapacity;

  const isCapacityFull = civilization.population >= civilization.populationCapacity;

  return (
    <div className="w-full space-y-6 text-left max-w-7xl mx-auto">
      {/* Top Settlement Summary and Action Deck */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-5 shadow-lg space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-600/50 text-amber-400">
              <Hammer className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-amber-100 tracking-wide">
                SETTLEMENT CONSTRUCTION & INFRASTRUCTURE
              </h2>
              <p className="text-xs text-stone-400">
                Erect communal dwellings, agrarian plots, and craft workshops along the river basin
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Population:</span>
              <strong className="text-amber-300 tabular-nums">
                {civilization.population} / {civilization.populationCapacity}
              </strong>
            </div>

            <div className="bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Storage Limit:</span>
              <strong className="text-emerald-300 tabular-nums">
                {civilization.maxStorage}
              </strong>
            </div>

            <div className="bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Available Slots:</span>
              <strong className="text-sky-300 tabular-nums">
                {availableSlotCount}
              </strong>
            </div>
          </div>
        </div>

        {/* Action Controls: Grow Community & Collect Production */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* 1. GROW COMMUNITY ACTION */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-display font-bold text-sm text-stone-200 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  GROW COMMUNITY
                </span>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                  Cost: 20 Food, 10 Water
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Welcome traveling families to increase community population. Each hut provides +2 capacity.
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-850">
              {isCapacityFull ? (
                <span className="text-[11px] text-amber-500 font-medium">
                  ⚠️ Housing capacity reached. Build a Hut first!
                </span>
              ) : !canGrowPop ? (
                <span className="text-[11px] text-stone-400 font-medium">
                  Need {Math.max(0, 20 - currentResources.food)} Food, {Math.max(0, 10 - currentResources.water)} Water
                </span>
              ) : (
                <span className="text-[11px] text-emerald-400 font-medium">
                  ✓ Ready to welcome new citizens
                </span>
              )}

              <button
                onClick={onGrowCommunity}
                disabled={!canGrowPop}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md ${
                  canGrowPop
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 active:scale-98'
                    : 'bg-stone-800 text-stone-400 cursor-not-allowed border border-stone-700'
                }`}
              >
                <span>GROW (+1 POP)</span>
              </button>
            </div>
          </div>

          {/* 2. COLLECT BUILDING PRODUCTION */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-display font-bold text-sm text-stone-200 flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  SETTLEMENT PRODUCTION YIELD
                </span>
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                  {totalProductionStored > 0 ? 'Production Ready' : 'Awaiting Harvest'}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Harvest output from farms, water drawn from wells, and tools shaped in workshops.
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-850">
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <span className="flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5 text-amber-400" />
                  <strong className="text-amber-200 tabular-nums">+{storedProduction.food}</strong> Food
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Waves className="w-3.5 h-3.5 text-sky-400" />
                  <strong className="text-sky-200 tabular-nums">+{storedProduction.water}</strong> Water
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <strong className="text-yellow-200 tabular-nums">+{storedProduction.knowledge}</strong> Know
                </span>
              </div>

              <button
                onClick={onCollectProduction}
                disabled={totalProductionStored <= 0}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md ${
                  totalProductionStored > 0
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 active:scale-98 animate-pulse'
                    : 'bg-stone-800 text-stone-400 cursor-not-allowed border border-stone-700'
                }`}
              >
                <span>COLLECT PRODUCTION</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Buildings Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {safeBuildings.map((building) => {
          const isUnlocked = !building.requiredTech || unlockedTechIds.has(building.requiredTech);
          const requiredTech = building.requiredTech
            ? safeTechs.find((t) => t.id === building.requiredTech)
            : undefined;

          return (
            <BuildingCard
              key={building.id}
              building={building}
              currentResources={currentResources}
              isUnlocked={isUnlocked}
              requiredTechName={requiredTech?.name}
              onBuild={onBuild}
              availableSlotCount={availableSlotCount}
            />
          );
        })}
      </div>
    </div>
  );
};
