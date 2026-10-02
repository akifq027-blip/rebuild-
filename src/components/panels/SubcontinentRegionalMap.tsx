/**
 * BHARAT — Build the Civilization
 * Subcontinental Regional Map & Historical Expeditions
 */

import React, { useState } from 'react';
import { SubcontinentMapRegion } from '../../types/civilization';
import {
  Compass,
  MapPin,
  Clock,
  Sparkles,
  Lock,
  CheckCircle,
  Shield,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface SubcontinentRegionalMapProps {
  regions: SubcontinentMapRegion[];
  playerMilitaryPower: number;
  onDispatchExpedition: (regionId: string) => void;
}

export const SubcontinentRegionalMap: React.FC<SubcontinentRegionalMapProps> = ({
  regions,
  playerMilitaryPower,
  onDispatchExpedition,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('saraswati_delta');

  const selectedRegion =
    regions.find((r) => r.id === selectedRegionId) || regions[0];

  const canScout =
    selectedRegion.status === 'unlocked' &&
    playerMilitaryPower >= selectedRegion.recommendedPower;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 text-left animate-fade-in">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-amber-900/50 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800/40">
              DESHA PARYATANA
            </span>
            <span className="text-xs text-stone-400">Subcontinental Exploration</span>
          </div>
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-amber-100 mt-1">
            REGIONAL EXPEDITIONS & ARTIFACT DISCOVERY
          </h2>
          <p className="text-xs text-stone-300 max-w-xl mt-1 leading-relaxed">
            Dispatch scout contingents across ancient river basins, salt flats, copper ranges, and cave sanctuaries to recover archaeological knowledge and historical artifacts.
          </p>
        </div>

        {/* Military Readiness Pill */}
        <div className="flex items-center gap-3 bg-stone-950/80 border border-stone-800 px-4 py-3 rounded-xl shrink-0">
          <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-700/60 flex items-center justify-center text-red-300">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-mono block">
              Garrison Power
            </span>
            <span className="font-display font-bold text-lg text-red-300 tabular-nums">
              {playerMilitaryPower} PWR
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column: Left Stylized Regional Map & Right Expedition Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Map Board Viewport */}
        <div className="lg:col-span-7 bg-stone-950 border border-amber-900/60 rounded-2xl p-4 relative overflow-hidden min-h-[380px] sm:min-h-[460px] flex flex-col justify-between shadow-2xl">
          {/* Subcontinental Map Visual Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-amber-500/40" strokeWidth="0.5">
              {/* Generalized Subcontinent Outline */}
              <path d="M 15,10 Q 30,5 50,12 Q 75,18 85,25 Q 75,50 60,70 Q 50,88 48,92 Q 35,70 25,55 Q 18,35 15,10 Z" fill="#78350f" fillOpacity="0.1" />
              {/* River lines */}
              <path d="M 25,18 Q 30,32 32,58" stroke="#38bdf8" strokeWidth="0.8" opacity="0.6" />
              <path d="M 50,22 Q 62,38 78,48" stroke="#38bdf8" strokeWidth="0.8" opacity="0.6" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>BHARAT SUB-CONTINENTAL SURVEY</span>
            <span>MAP GRID 1:2,500,000</span>
          </div>

          {/* Region Waypoints on the Map */}
          <div className="relative z-10 w-full h-72 my-auto">
            {regions.map((region) => {
              const isSelected = selectedRegionId === region.id;
              const isExplored = region.status === 'explored';
              const isLocked = region.status === 'locked';

              return (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegionId(region.id)}
                  style={{
                    left: `${region.coordinates.x}%`,
                    top: `${region.coordinates.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl transition-all cursor-pointer group flex flex-col items-center ${
                    isSelected
                      ? 'scale-125 z-30'
                      : 'hover:scale-110 z-20'
                  }`}
                  title={`${region.title} (${region.status})`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-transform ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 font-bold ring-4 ring-amber-400/60'
                        : isExplored
                        ? 'bg-emerald-600 text-white'
                        : isLocked
                        ? 'bg-stone-800 text-stone-500 border border-stone-700'
                        : 'bg-amber-900 border border-amber-500 text-amber-200'
                    }`}
                  >
                    {isExplored ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-bold font-display px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 font-extrabold'
                        : 'bg-stone-950/90 text-stone-300 border border-stone-800'
                    }`}
                  >
                    {region.title.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-800/80 pt-2">
            <span>● Green: Explored</span>
            <span>● Amber: Unlocked Expedition</span>
            <span>● Dark: Uncharted Frontier</span>
          </div>
        </div>

        {/* Right: Region Expedition Dossier */}
        <div className="lg:col-span-5 bg-stone-900/90 border border-amber-900/50 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="border-b border-stone-800 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">
                {selectedRegion.historicalEra}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${
                  selectedRegion.status === 'explored'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : selectedRegion.status === 'unlocked'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-stone-950 text-stone-400 border-stone-800'
                }`}
              >
                {selectedRegion.status}
              </span>
            </div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-amber-100 mt-1">
              {selectedRegion.title}
            </h3>
            <span className="text-xs font-mono text-amber-400/90 block italic">
              {selectedRegion.sanskritName}
            </span>
          </div>

          {/* Terrain & Environment */}
          <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800 space-y-1">
            <span className="text-[10px] text-stone-400 uppercase font-mono font-semibold block">
              Geography & Terrain:
            </span>
            <p className="text-xs text-stone-200 leading-relaxed">
              {selectedRegion.terrainDescription}
            </p>
          </div>

          {/* Historical Evidence Insight */}
          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[10px] uppercase font-mono">
              <BookOpen className="w-3 h-3" />
              <span>Archaeological Discovery Horizon:</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed italic">
              "{selectedRegion.historicalInsight}"
            </p>
            <span className="text-[10px] text-amber-400/80 font-mono block pt-1">
              Site: {selectedRegion.archaeologicalSite}
            </span>
          </div>

          {/* Potential Expedition Rewards */}
          <div className="space-y-1.5 text-xs">
            <span className="text-[10px] text-stone-400 uppercase font-mono font-semibold block">
              Expedition Bounty:
            </span>
            <div className="flex flex-wrap gap-2 text-stone-200">
              <span className="bg-sky-950/80 border border-sky-800/60 text-sky-300 px-2 py-1 rounded-lg font-mono">
                +{selectedRegion.rewards.knowledge} Vidya
              </span>
              {selectedRegion.rewards.artifactTitle && (
                <span className="bg-amber-950/80 border border-amber-800/60 text-amber-300 px-2 py-1 rounded-lg text-[11px]">
                  🏆 {selectedRegion.rewards.artifactTitle}
                </span>
              )}
            </div>
          </div>

          {/* Action Dispatch Button */}
          {selectedRegion.status === 'explored' ? (
            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/40 text-center text-xs text-emerald-300 font-bold flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Region Thoroughly Explored & Cataloged</span>
            </div>
          ) : selectedRegion.status === 'locked' ? (
            <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 text-center text-xs text-stone-400 font-medium">
              Frontier Locked. Explore adjacent river basins and increase garrison power to unlock.
            </div>
          ) : (
            <button
              onClick={() => onDispatchExpedition(selectedRegion.id)}
              disabled={!canScout}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-display font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-stone-950" />
              <span>
                {playerMilitaryPower < selectedRegion.recommendedPower
                  ? `REQUIRES ${selectedRegion.recommendedPower} MILITARY POWER`
                  : `DISPATCH EXPEDITION (${selectedRegion.scoutDurationSeconds}s)`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
