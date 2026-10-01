import React, { useState } from 'react';
import { BuildingItem, ResourceKey } from '../../types/game';
import {
  Home,
  Sprout,
  CircleDot,
  Archive,
  Hammer,
  Info,
  ChevronRight,
  CheckCircle,
  Lock,
  Plus,
} from 'lucide-react';

interface BuildingCardProps {
  building: BuildingItem;
  currentResources: Record<ResourceKey, number>;
  isUnlocked: boolean;
  requiredTechName?: string;
  onBuild: (buildingId: string) => void;
  availableSlotCount: number;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  currentResources,
  isUnlocked,
  requiredTechName,
  onBuild,
  availableSlotCount,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const renderIcon = (iconName: string) => {
    const iconClass = 'w-6 h-6 text-amber-400';
    switch (iconName) {
      case 'Home':
        return <Home className={iconClass} />;
      case 'Sprout':
        return <Sprout className={iconClass} />;
      case 'CircleDot':
        return <CircleDot className={iconClass} />;
      case 'Archive':
        return <Archive className={iconClass} />;
      case 'Hammer':
        return <Hammer className={iconClass} />;
      default:
        return <Info className={iconClass} />;
    }
  };

  // Check resource costs
  let canAfford = true;
  const missingResources: string[] = [];

  for (const [key, amount] of Object.entries(building.cost)) {
    const resKey = key as ResourceKey;
    const required = amount || 0;
    const available = currentResources[resKey] || 0;
    if (available < required) {
      canAfford = false;
      missingResources.push(`${required - available} ${resKey}`);
    }
  }

  const isBuildable = isUnlocked && canAfford && availableSlotCount > 0;

  return (
    <div
      className={`group relative rounded-xl transition-all duration-200 overflow-hidden border p-4 sm:p-5 flex flex-col justify-between ${
        isUnlocked
          ? 'bg-stone-900/90 border-stone-800 hover:border-amber-700/60 shadow-lg'
          : 'bg-stone-950/70 border-stone-850 opacity-80'
      }`}
    >
      <div>
        {/* Top Card Bar */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 group-hover:border-amber-700/60 transition-colors">
            {renderIcon(building.iconName)}
          </div>
          {isUnlocked ? (
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              AVAILABLE
            </span>
          ) : (
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-stone-900 text-stone-400 border border-stone-750 flex items-center gap-1.5">
              <span>🔒</span>
              <span>LOCKED</span>
            </span>
          )}
        </div>

        {/* Building Name & Count */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-display font-bold text-base sm:text-lg text-amber-100 group-hover:text-amber-200 transition-colors tracking-wide">
            {building.name}
          </h3>
          <span className="text-xs bg-stone-950 px-2 py-0.5 rounded text-amber-300/90 border border-stone-800 font-mono font-bold">
            Built: {building.currentCount}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-stone-300 leading-relaxed mb-3">
          "{building.shortDescription}"
        </p>

        {/* Production / Civ Effect */}
        <div className="bg-stone-950/70 border border-stone-800 rounded-lg p-2.5 mb-3 text-xs">
          <span className="text-stone-400 text-[10px] uppercase tracking-wider block font-semibold">
            Production & Effect:
          </span>
          <span className="text-emerald-400 font-medium">
            {building.populationEffect > 0 && `+${building.populationEffect} Population capacity`}
            {building.productionEffect && building.productionEffect.label}
            {building.category === 'storage' && '+250 Storage capacity'}
          </span>
        </div>

        {/* Construction Cost */}
        <div className="bg-stone-950/40 rounded-lg p-2.5 mb-4 border border-stone-850">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold mb-1">
            Construction Cost:
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            {Object.entries(building.cost).map(([res, amt]) => {
              const resKey = res as ResourceKey;
              const hasEnough = (currentResources[resKey] || 0) >= (amt || 0);
              return (
                <span
                  key={res}
                  className={`px-2 py-0.5 rounded font-mono text-[11px] border ${
                    hasEnough
                      ? 'bg-stone-900 text-stone-200 border-stone-700'
                      : 'bg-red-950/40 text-red-300 border-red-800/50 font-bold'
                  }`}
                >
                  {amt} {res.toUpperCase()}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Build CTA & Requirement Status */}
      <div className="space-y-2.5 pt-2 border-t border-stone-800/80">
        {isUnlocked ? (
          <div>
            <button
              onClick={() => onBuild(building.id)}
              disabled={!isBuildable}
              className={`w-full py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                isBuildable
                  ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 active:scale-98'
                  : 'bg-stone-800 text-stone-400 cursor-not-allowed border border-stone-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>BUILD</span>
            </button>

            {!canAfford && (
              <p className="text-[11px] text-amber-500/90 text-center mt-1.5 font-medium">
                Need {missingResources.join(', ')}
              </p>
            )}

            {canAfford && availableSlotCount <= 0 && (
              <p className="text-[11px] text-orange-400 text-center mt-1.5">
                Settlement slots full
              </p>
            )}
          </div>
        ) : (
          <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800 text-center space-y-1">
            <div className="text-xs font-bold text-stone-300 flex items-center justify-center gap-1">
              <span>🔒</span>
              <span>LOCKED</span>
            </div>
            <div className="text-[11px] text-stone-400">
              Required: <strong className="text-amber-400 font-semibold">{requiredTechName || 'Agriculture'}</strong>
            </div>
          </div>
        )}

        {/* Historical Insight Accordion */}
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-xs text-amber-400/90 hover:text-amber-300 transition-colors py-1 cursor-pointer"
        >
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            {showDetails ? 'Hide historical insight' : 'View historical insight'}
          </span>
          <ChevronRight
            className={`w-3.5 h-3.5 transition-transform ${showDetails ? 'rotate-90' : ''}`}
          />
        </button>

        {showDetails && (
          <div className="p-2.5 rounded-lg bg-stone-950 border border-amber-900/40 text-[11px] text-stone-300 leading-relaxed animate-in fade-in duration-150">
            <strong className="text-amber-300 block mb-0.5">Archaeological Insight:</strong>
            {building.historicalSignificance}
          </div>
        )}
      </div>
    </div>
  );
};
