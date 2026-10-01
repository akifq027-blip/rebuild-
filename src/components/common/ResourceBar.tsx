import React, { useState, useEffect, useRef } from 'react';
import { ResourceItem, ResourceKey } from '../../types/game';
import {
  Wheat,
  Droplets,
  Trees,
  Gem,
  Hammer,
  Scroll,
  Sparkles,
  Coins,
  Info,
  X,
  AlertCircle,
} from 'lucide-react';

interface ResourceBarProps {
  resources?: ResourceItem[];
  maxStorage: number;
}

interface FloatingDelta {
  id: string;
  delta: number;
  key: string;
}

export const ResourceBar: React.FC<ResourceBarProps> = ({ resources = [], maxStorage = 500 }) => {
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [deltas, setDeltas] = useState<Record<string, FloatingDelta | null>>({});
  const prevValuesRef = useRef<Record<string, number>>({});

  const safeResources = Array.isArray(resources) ? resources : [];

  // Detect deltas when resource values change
  useEffect(() => {
    if (!Array.isArray(resources) || resources.length === 0) return;

    const newDeltas: Record<string, FloatingDelta | null> = {};
    let hasDelta = false;

    resources.forEach((res) => {
      if (!res) return;
      const prev = prevValuesRef.current[res.id];
      if (prev !== undefined && prev !== res.value) {
        const diff = res.value - prev;
        if (diff !== 0) {
          hasDelta = true;
          newDeltas[res.id] = {
            id: res.id,
            delta: diff,
            key: `${res.id}-${Date.now()}`,
          };
        }
      }
      prevValuesRef.current[res.id] = res.value;
    });

    if (hasDelta) {
      setDeltas((prev) => ({ ...prev, ...newDeltas }));
      const timer = setTimeout(() => {
        setDeltas({});
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [resources]);

  // Icon resolver with thematic emoji & Lucide
  const renderIcon = (iconName: string, id: ResourceKey) => {
    const iconClass = 'w-4 h-4 shrink-0';
    switch (id) {
      case 'food':
        return <Wheat className={`${iconClass} text-amber-400`} />;
      case 'water':
        return <Droplets className={`${iconClass} text-sky-400`} />;
      case 'wood':
        return <Trees className={`${iconClass} text-emerald-400`} />;
      case 'stone':
        return <Gem className={`${iconClass} text-stone-300`} />;
      case 'metal':
        return <Hammer className={`${iconClass} text-orange-400`} />;
      case 'knowledge':
        return <Scroll className={`${iconClass} text-yellow-300`} />;
      case 'culture':
        return <Sparkles className={`${iconClass} text-purple-300`} />;
      case 'trade':
        return <Coins className={`${iconClass} text-amber-300`} />;
      default:
        return <Info className={`${iconClass} text-stone-400`} />;
    }
  };

  const getLimitForResource = (id: ResourceKey) => {
    return id === 'metal' ? Math.min(300, maxStorage) : maxStorage;
  };

  return (
    <div className="w-full bg-stone-950/85 border-b border-amber-950/60 shadow-inner py-2 px-3 sm:px-6 relative z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Resource items container with smooth horizontal scroll for mobile */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1 w-full">
          {safeResources.map((res) => {
            const limit = getLimitForResource(res.id);
            const isFull = res.value >= limit;
            const isLow = (res.id === 'food' || res.id === 'water') && res.value < 30;
            const deltaInfo = deltas[res.id];

            return (
              <div key={res.id} className="relative shrink-0">
                {/* Floating change animation (+10 or -20) */}
                {deltaInfo && (
                  <div
                    key={deltaInfo.key}
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[10px] font-black pointer-events-none z-30 animate-float-delta shadow-md ${
                      deltaInfo.delta > 0
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/70'
                        : 'bg-amber-950 text-amber-300 border border-amber-700/70'
                    }`}
                  >
                    {deltaInfo.delta > 0 ? `+${deltaInfo.delta}` : deltaInfo.delta}
                  </div>
                )}

                <button
                  onClick={() => setSelectedResource(res)}
                  title={`${res.name}: ${res.value} / ${limit} (Click for details)`}
                  className={`group flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-all text-left shrink-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                    isLow
                      ? 'bg-amber-950/30 border-amber-700/60 text-amber-200 hover:border-amber-500/80 shadow-xs'
                      : isFull
                      ? 'bg-stone-900/90 border-amber-700/50 text-amber-200'
                      : 'bg-stone-900/90 hover:bg-stone-850 border-stone-800 hover:border-amber-700/50'
                  }`}
                >
                  <div className="p-1 rounded bg-stone-950/70 border border-stone-800/80 group-hover:scale-105 transition-transform">
                    {renderIcon(res.iconName, res.id)}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                        {res.name}
                      </span>
                      {isLow && (
                        <span
                          className="inline-flex items-center gap-0.5 text-[9px] text-amber-400 font-semibold"
                          title="Resource supply is running low"
                        >
                          <AlertCircle className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                          <span>LOW</span>
                        </span>
                      )}
                      {isFull && <span className="text-[9px] text-amber-400 font-bold">MAX</span>}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-stone-100 tabular-nums">
                      {res.value.toLocaleString()}{' '}
                      <span className="text-[10px] text-stone-500 font-normal">
                        /{limit}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resource Detail Educational Dialog */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-stone-900 border border-amber-700/60 rounded-xl p-5 max-w-sm w-full shadow-2xl text-left relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedResource(null)}
              className="absolute top-3.5 right-3.5 text-stone-400 hover:text-stone-100 p-1 rounded-md transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-stone-950 border border-amber-700/40">
                {renderIcon(selectedResource.iconName, selectedResource.id)}
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-amber-200">
                  {selectedResource.name}
                </h3>
                <span className="text-xs text-amber-500 uppercase tracking-wider font-medium">
                  {selectedResource.category} Resource · Stored: {selectedResource.value} / {getLimitForResource(selectedResource.id)}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4 border-t border-stone-800 pt-3">
              {selectedResource.description}
            </p>

            <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800 text-xs mb-3 space-y-1">
              <div className="flex justify-between text-stone-400">
                <span>Current Reserves:</span>
                <strong className="text-stone-200 tabular-nums">{selectedResource.value} units</strong>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Storage Limit:</span>
                <strong className="text-amber-400 tabular-nums">{getLimitForResource(selectedResource.id)} units</strong>
              </div>
              {selectedResource.value >= getLimitForResource(selectedResource.id) && (
                <div className="text-[11px] text-amber-400 font-semibold pt-1">
                  ⚠️ Storage limit reached! Build Storage to expand.
                </div>
              )}
            </div>

            <div className="bg-amber-950/30 border border-amber-800/30 rounded-lg p-2.5 text-[11px] text-amber-300/90">
              💡 <strong>Historical Note:</strong> In early Indian river valley settlements, self-sufficiency in {selectedResource.name.toLowerCase()} allowed nomadic tribes to construct permanent communal settlements and pass down generational knowledge.
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedResource(null)}
                className="px-4 py-1.5 text-xs font-medium text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
