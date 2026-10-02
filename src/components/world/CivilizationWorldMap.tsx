/**
 * BHARAT — Build the Civilization
 * Central Civilization World Screen: Terrain, Grid Settlement, Interactive Buildings & Resources
 */

import React, { useState } from 'react';
import {
  BuildingPlot,
  CoreResourceKey,
} from '../../types/civilization';
import { BUILDINGS_CATALOG } from '../../game/buildingsData';
import {
  Hammer,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  Maximize2,
  Minimize2,
  Flame,
  Trees,
  Gem,
  CheckCircle,
  Clock,
  Wheat,
} from 'lucide-react';

interface CivilizationWorldMapProps {
  plots: BuildingPlot[];
  selectedPlotId: number | null;
  onSelectPlot: (plotId: number) => void;
  onQuickHarvestNode: (resource: CoreResourceKey, amount: number) => void;
  onCollectPlotYield: (plotId: number) => void;
  onCollectAllYields: () => void;
  onOpenBuildCatalogForPlot: (plotId: number) => void;
}

export const CivilizationWorldMap: React.FC<CivilizationWorldMapProps> = ({
  plots,
  selectedPlotId,
  onSelectPlot,
  onQuickHarvestNode,
  onCollectPlotYield,
  onCollectAllYields,
  onOpenBuildCatalogForPlot,
}) => {
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');
  const [floatingPops, setFloatingPops] = useState<
    Array<{ id: string; text: string; x: number; y: number; color: string }>
  >([]);

  // Trigger floating feedback particle
  const triggerFloatingText = (text: string, x: number, y: number, color: string) => {
    const id = `${Date.now()}_${Math.random()}`;
    setFloatingPops((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setFloatingPops((prev) => prev.filter((p) => p.id !== id));
    }, 1400);
  };

  const handleHarvestClick = (
    e: React.MouseEvent,
    res: CoreResourceKey,
    amount: number,
    label: string
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    triggerFloatingText(
      `+${amount} ${res.toUpperCase()}`,
      rect.left + rect.width / 2,
      rect.top,
      res === 'wood' ? '#d97706' : res === 'clay' ? '#f97316' : '#94a3b8'
    );
    onQuickHarvestNode(res, amount);
  };

  // Check if any plot has uncollected yields
  const totalUncollectedYield = plots.reduce((sum, p) => sum + (p.storedYield || 0), 0);

  // Time-of-day ambient filters
  const ambientBackgrounds = {
    day: 'from-amber-950/20 via-stone-900 to-stone-950',
    sunset: 'from-amber-900/40 via-red-950/30 to-stone-950',
    night: 'from-slate-950 via-indigo-950/30 to-stone-950',
  };

  return (
    <div className="relative w-full h-[580px] sm:h-[680px] rounded-2xl overflow-hidden border border-amber-900/60 shadow-2xl bg-stone-950 select-none">
      {/* 1. Map Top Utility Bar: Atmosphere Switcher & Collect All */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none gap-2">
        {/* Left: Region Tag & Settlement Status */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-stone-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-800/50 flex items-center gap-2 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-display font-extrabold text-xs sm:text-sm text-amber-200 tracking-wider">
              SARASWATI BASIN
            </span>
            <span className="text-stone-600 hidden sm:inline">·</span>
            <span className="text-[11px] text-amber-400/80 font-mono hidden sm:inline">
              Alluvial Settlement
            </span>
          </div>

          {/* Quick Collect All Yields */}
          {totalUncollectedYield > 0 && (
            <button
              onClick={onCollectAllYields}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 text-xs font-bold rounded-xl shadow-lg border border-amber-300 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer animate-bounce"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Collect Yields (+{totalUncollectedYield})</span>
            </button>
          )}
        </div>

        {/* Right: Lighting Preset Switcher */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-stone-950/90 backdrop-blur-md p-1 rounded-xl border border-stone-800 shadow-lg">
          <button
            onClick={() => setTimeOfDay('day')}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              timeOfDay === 'day'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Daylight Atmosphere"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTimeOfDay('sunset')}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              timeOfDay === 'sunset'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Monsoon Sunset Atmosphere"
          >
            <Sunset className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTimeOfDay('night')}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              timeOfDay === 'night'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Night Astronomy Atmosphere"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Strategy World Landscape Viewport (SVG / Canvas Hybrid Layer) */}
      <div
        className={`w-full h-full relative overflow-auto bg-gradient-to-b ${ambientBackgrounds[timeOfDay]} transition-colors duration-700`}
      >
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full min-w-[750px] min-h-[550px] object-cover"
        >
          {/* Defs for Textures & Gradients */}
          <defs>
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0369a1" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#075985" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="alluviumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3f3b2b" />
              <stop offset="100%" stopColor="#29251c" />
            </linearGradient>
            <linearGradient id="brickStreetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78350f" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#92400e" stopOpacity="0.8" />
            </linearGradient>
            <pattern id="brickPattern" width="20" height="10" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 20 0 M 10 0 L 10 10 M 0 10 L 20 10 M 0 5 L 20 5" stroke="#451a03" strokeWidth="0.8" fill="none" opacity="0.3" />
            </pattern>
          </defs>

          {/* 2.1 Base Fertile Alluvium Land */}
          <rect x="0" y="0" width="1000" height="700" fill="url(#alluviumGrad)" />

          {/* 2.2 Sacred River Meander (Top & North-East) */}
          <path
            d="M -20,60 C 200,40 350,110 500,80 C 680,50 820,130 1020,90 L 1020,0 L -20,0 Z"
            fill="url(#riverGrad)"
          />
          {/* Animated gentle wave lines */}
          <path
            d="M 50,65 Q 150,55 250,70 Q 350,85 450,75 Q 600,60 750,80"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="1.5"
            strokeDasharray="10 20"
            opacity="0.4"
          />
          <path
            d="M 120,40 Q 240,30 360,50 Q 500,60 680,45"
            fill="none"
            stroke="#e0f2fe"
            strokeWidth="1.2"
            strokeDasharray="8 16"
            opacity="0.3"
          />

          {/* Riverboat / Trading Dhow */}
          <g transform="translate(620, 65)">
            <path d="M 0,10 L 28,10 L 22,18 L 4,18 Z" fill="#78350f" />
            <path d="M 14,10 L 14,0 L 24,7 Z" fill="#fef3c7" opacity="0.8" />
          </g>

          {/* 2.3 Ancient Sal Forest Grove (North-West) */}
          <g transform="translate(40, 90)">
            <ellipse cx="80" cy="50" rx="90" ry="45" fill="#14532d" opacity="0.4" />
            {/* Clustered Sal Trees */}
            <circle cx="40" cy="40" r="18" fill="#15803d" />
            <circle cx="70" cy="30" r="22" fill="#166534" />
            <circle cx="100" cy="45" r="20" fill="#15803d" />
            <circle cx="60" cy="65" r="19" fill="#14532d" />
            <circle cx="120" cy="35" r="16" fill="#166534" />
          </g>

          {/* 2.4 Terracotta Riverbank Clay Pits (North-East) */}
          <g transform="translate(780, 85)">
            <ellipse cx="90" cy="50" rx="85" ry="40" fill="#7c2d12" opacity="0.35" />
            <rect x="50" y="30" width="30" height="20" rx="4" fill="#9a3412" stroke="#ea580c" strokeWidth="1" />
            <rect x="90" y="45" width="25" height="16" rx="3" fill="#c2410c" />
            <text x="55" y="24" fill="#fb923c" fontSize="9" fontWeight="bold" fontFamily="monospace">
              CLAY SILT PIT
            </text>
          </g>

          {/* 2.5 Granite & Sandstone Ridge (South) */}
          <g transform="translate(150, 610)">
            <polygon points="0,70 60,15 130,50 200,20 280,60 360,10 440,55 520,25 600,70 700,40 760,90 0,90" fill="#334155" opacity="0.6" />
            <polygon points="50,60 100,30 150,55" fill="#475569" />
            <polygon points="210,50 260,25 320,55" fill="#475569" />
            <polygon points="450,50 500,25 560,60" fill="#475569" />
          </g>

          {/* 2.6 Grid Streets / Paved Thoroughfares */}
          {/* Main East-West Axial Avenue */}
          <rect x="80" y="340" width="840" height="26" fill="url(#brickStreetGrad)" rx="3" />
          <rect x="80" y="340" width="840" height="26" fill="url(#brickPattern)" />

          {/* Main North-South Cardo Street */}
          <rect x="480" y="110" width="24" height="490" fill="url(#brickStreetGrad)" rx="3" />
          <rect x="480" y="110" width="24" height="490" fill="url(#brickPattern)" />

          {/* West Secondary Street */}
          <rect x="250" y="180" width="16" height="380" fill="url(#brickStreetGrad)" opacity="0.75" />
          {/* East Secondary Street */}
          <rect x="710" y="180" width="16" height="380" fill="url(#brickStreetGrad)" opacity="0.75" />

          {/* Central Assembly Ring */}
          <circle cx="492" cy="353" r="32" fill="#78350f" stroke="#d97706" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
        </svg>

        {/* 3. Interactive Natural Resource Nodes (Gathering Shortcuts) */}
        {/* Wood Harvesting Sal Grove */}
        <div
          onClick={(e) => handleHarvestClick(e, 'wood', 12, 'Harvest Sal Timber')}
          className="absolute top-28 left-10 sm:left-20 z-10 cursor-pointer group bg-stone-950/80 hover:bg-amber-950/90 border border-amber-800/60 p-2 sm:p-2.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          title="Sal Timber Grove: Click to harvest wood"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-900/60 border border-amber-600/60 flex items-center justify-center text-amber-300 group-hover:rotate-12 transition-transform">
            <Trees className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">
              Sal Grove
            </span>
            <span className="text-[11px] text-stone-200 font-semibold font-mono">
              +12 Wood
            </span>
          </div>
        </div>

        {/* Clay Harvesting Riverbank */}
        <div
          onClick={(e) => handleHarvestClick(e, 'clay', 10, 'Extract River Clay')}
          className="absolute top-24 right-10 sm:right-24 z-10 cursor-pointer group bg-stone-950/80 hover:bg-orange-950/90 border border-orange-800/60 p-2 sm:p-2.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          title="Alluvial Clay Bank: Click to extract clay silt"
        >
          <div className="w-8 h-8 rounded-xl bg-orange-900/60 border border-orange-600/60 flex items-center justify-center text-orange-300 group-hover:rotate-12 transition-transform">
            <Flame className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-[10px] text-orange-400 font-bold block uppercase tracking-wider">
              Clay Pit
            </span>
            <span className="text-[11px] text-stone-200 font-semibold font-mono">
              +10 Clay
            </span>
          </div>
        </div>

        {/* Stone Harvesting Quarry */}
        <div
          onClick={(e) => handleHarvestClick(e, 'stone', 10, 'Hew Sandstone Blocks')}
          className="absolute bottom-16 left-12 sm:left-32 z-10 cursor-pointer group bg-stone-950/80 hover:bg-slate-900/90 border border-slate-700/60 p-2 sm:p-2.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          title="Granite Ridge: Click to hew stone"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-800/70 border border-slate-500/60 flex items-center justify-center text-slate-300 group-hover:rotate-12 transition-transform">
            <Gem className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-[10px] text-slate-300 font-bold block uppercase tracking-wider">
              Stone Ridge
            </span>
            <span className="text-[11px] text-stone-200 font-semibold font-mono">
              +10 Stone
            </span>
          </div>
        </div>

        {/* 4. The 12 Fixed Spatial Building Plots */}
        {plots.map((plot) => {
          const isSelected = selectedPlotId === plot.id;
          const buildingDef = plot.buildingId ? BUILDINGS_CATALOG[plot.buildingId] : null;

          // Convert gridX / gridY (0-10) to percentages (10%-90%)
          const posX = 8 + plot.gridX * 9.2;
          const posY = 15 + plot.gridY * 10.5;

          const isCitadel = plot.buildingId === 'civ_center';
          const widthClass = isCitadel ? 'w-32 sm:w-36 h-28 sm:h-32' : 'w-24 sm:w-28 h-24 sm:h-28';

          return (
            <div
              key={plot.id}
              onClick={() => onSelectPlot(plot.id)}
              style={{
                left: `${posX}%`,
                top: `${posY}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute z-20 cursor-pointer transition-all duration-200 ${widthClass}`}
            >
              {/* Plot Container Card */}
              <div
                className={`w-full h-full rounded-2xl p-1.5 sm:p-2 flex flex-col items-center justify-between text-center transition-all ${
                  isSelected
                    ? 'ring-4 ring-amber-400 bg-amber-950/85 scale-105 shadow-2xl z-30'
                    : 'hover:scale-102 hover:shadow-xl'
                } ${
                  plot.buildingId
                    ? 'bg-stone-900/90 border border-amber-800/50 shadow-lg'
                    : 'border-2 border-dashed border-amber-600/40 hover:border-amber-400 bg-stone-950/60'
                }`}
              >
                {plot.buildingId && buildingDef ? (
                  /* CONSTRUCTED BUILDING TILE */
                  <>
                    {/* Top Tag: Level Badge & Category Icon */}
                    <div className="w-full flex items-center justify-between text-[10px]">
                      <span className="bg-amber-950/90 text-amber-300 font-mono font-bold px-1.5 py-0.5 rounded border border-amber-700/60">
                        Lvl {plot.level}
                      </span>
                      {plot.isConstructing ? (
                        <span className="flex items-center gap-1 text-[9px] text-amber-400 font-mono animate-pulse">
                          <Clock className="w-3 h-3" />
                          <span>UPGRADING</span>
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[9px] uppercase font-semibold truncate max-w-16">
                          {buildingDef.category}
                        </span>
                      )}
                    </div>

                    {/* Central Stylized Visual Illustration */}
                    <div className="my-auto relative flex items-center justify-center">
                      <div
                        className={`rounded-xl flex items-center justify-center shadow-inner ${
                          isCitadel
                            ? 'w-12 h-12 bg-gradient-to-br from-amber-700 to-amber-950 border border-amber-500/80 text-amber-200'
                            : 'w-10 h-10 bg-stone-800/90 border border-stone-700 text-amber-300'
                        }`}
                      >
                        {isCitadel ? (
                          <span className="font-display font-black text-xl">🏛️</span>
                        ) : buildingDef.category === 'storage' ? (
                          <span className="text-lg">🌾</span>
                        ) : buildingDef.category === 'military' ? (
                          <span className="text-lg">⚔️</span>
                        ) : buildingDef.category === 'science' ? (
                          <span className="text-lg">📜</span>
                        ) : buildingDef.category === 'water' ? (
                          <span className="text-lg">💧</span>
                        ) : (
                          <span className="text-lg">⚒️</span>
                        )}
                      </div>

                      {/* Stored Yield Harvest Bubble if production accumulated */}
                      {(plot.storedYield || 0) > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCollectPlotYield(plot.id);
                          }}
                          className="absolute -top-3 -right-3 px-2 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-[10px] shadow-lg animate-bounce border border-emerald-300 cursor-pointer"
                          title="Click to harvest accumulated yield"
                        >
                          +{plot.storedYield}
                        </button>
                      )}
                    </div>

                    {/* Building Name Label */}
                    <div className="w-full">
                      <span className="font-display font-bold text-[10px] sm:text-[11px] text-amber-100 truncate block leading-tight">
                        {buildingDef.name}
                      </span>
                      <span className="text-[8px] text-amber-400/80 font-mono block leading-none">
                        {buildingDef.sanskritName}
                      </span>
                    </div>
                  </>
                ) : (
                  /* EMPTY PLOT TILE */
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenBuildCatalogForPlot(plot.id);
                    }}
                    className="w-full h-full flex flex-col items-center justify-center p-2 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-stone-900 border border-amber-600/40 group-hover:border-amber-400 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <Hammer className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-300/80 group-hover:text-amber-200 mt-1 uppercase font-display">
                      + BUILD
                    </span>
                    <span className="text-[8px] text-stone-500 font-mono">
                      Plot #{plot.id}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Floating Resource Yield Animations */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingPops.map((pop) => (
          <div
            key={pop.id}
            style={{ left: `${pop.x}px`, top: `${pop.y}px` }}
            className="fixed -translate-x-1/2 -translate-y-1/2 font-display font-black text-sm sm:text-base animate-bounce px-2.5 py-1 rounded-full bg-stone-950/90 border border-amber-500/40 shadow-2xl"
          >
            <span style={{ color: pop.color }}>{pop.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
