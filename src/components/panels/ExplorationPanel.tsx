import React, { useState } from 'react';
import { ExplorationLocation, DiscoveryItem, ResourceKey } from '../../types/game';
import {
  Compass,
  Waves,
  Trees,
  Mountain,
  MapPin,
  Sparkles,
  BookOpen,
  CheckCircle,
  Timer,
  Info,
} from 'lucide-react';

interface ExplorationPanelProps {
  locations: ExplorationLocation[];
  discoveries: DiscoveryItem[];
  onExploreLocation: (locationId: string) => void;
  activeCooldowns: Record<string, number>; // timestamp until cooldown ends
}

export const ExplorationPanel: React.FC<ExplorationPanelProps> = ({
  locations = [],
  discoveries = [],
  onExploreLocation,
  activeCooldowns,
}) => {
  const safeLocations = Array.isArray(locations) ? locations : [];
  const safeDiscoveries = Array.isArray(discoveries) ? discoveries : [];
  const [now, setNow] = useState(Date.now());

  // Tick every second to update cooldowns
  React.useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(interval);
  }, []);

  const getLocationIcon = (id: string) => {
    switch (id) {
      case 'river':
        return <Waves className="w-6 h-6 text-sky-400" />;
      case 'forest':
        return <Trees className="w-6 h-6 text-emerald-400" />;
      case 'hills':
        return <Mountain className="w-6 h-6 text-amber-500" />;
      case 'ancient_site':
        return <Compass className="w-6 h-6 text-purple-400" />;
      default:
        return <MapPin className="w-6 h-6 text-amber-400" />;
    }
  };

  const discoveredCount = discoveries.filter((d) => d.discovered).length;

  return (
    <div className="w-full space-y-6 text-left max-w-5xl mx-auto">
      {/* Intro Header */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-600/50 text-amber-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-amber-100 tracking-wide">
                TERRITORIAL EXPEDITIONS & SCOUTING
              </h2>
              <p className="text-xs text-stone-400">
                Dispatch scouts beyond the settlement clearing to survey natural resources and unearth discoveries
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 text-xs text-amber-300">
            <span>Discoveries Logged:</span>
            <strong className="text-sm font-bold text-amber-400 tabular-nums">
              {discoveredCount} / {discoveries.length}
            </strong>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          The subcontinent’s early river valleys were bordered by dense woodlands, mineral-rich hill ranges, and ancestral mounds. Send expeditions to gather materials, observe terrain, and gain precious Knowledge.
        </p>
      </div>

      {/* Exploration Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safeLocations.map((loc) => {
          const cooldownEnd = activeCooldowns[loc.id] || 0;
          const isCoolingDown = cooldownEnd > now;
          const secondsRemaining = Math.max(1, Math.ceil((cooldownEnd - now) / 1000));

          return (
            <div
              key={loc.id}
              className="bg-stone-900/80 hover:bg-stone-850 border border-stone-800 hover:border-amber-700/60 rounded-xl p-5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800">
                    {getLocationIcon(loc.id)}
                  </div>
                  {isCoolingDown ? (
                    <span className="text-[10px] uppercase font-semibold bg-stone-800 text-stone-300 border border-stone-700 px-2 py-0.5 rounded flex items-center gap-1">
                      <Timer className="w-3 h-3 text-amber-400 animate-spin" />
                      Scouting ({secondsRemaining}s)
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                      Available
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-base text-amber-100 mb-1">
                  {loc.name}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed mb-4">
                  {loc.description}
                </p>

                {/* Expected Rewards */}
                <div className="bg-stone-950/70 border border-stone-800 rounded-lg p-3 text-xs text-stone-300 space-y-1 mb-4">
                  <span className="text-stone-400 text-[10px] uppercase tracking-wider block font-semibold">
                    Expedition Rewards:
                  </span>
                  <div className="flex flex-wrap gap-2 text-amber-300 font-medium">
                    {Object.entries(loc.rewards).map(([res, amt]) => (
                      <span key={res} className="bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                        +{amt} {res.toUpperCase()}
                      </span>
                    ))}
                    <span className="text-purple-300 bg-purple-950/40 border border-purple-800/40 px-2 py-0.5 rounded">
                      ✦ Chance of Discovery
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onExploreLocation(loc.id)}
                disabled={isCoolingDown}
                className={`w-full py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  !isCoolingDown
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                    : 'bg-stone-800 text-stone-400 cursor-not-allowed border border-stone-700'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>{isCoolingDown ? `SCOUTING REGION...` : 'SEND EXPEDITION'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Discoveries Journal */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <h3 className="font-display font-bold text-sm sm:text-base text-amber-200">
            DISCOVERIES JOURNAL
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {safeDiscoveries.map((disc) => (
            <div
              key={disc.id}
              className={`p-3.5 rounded-lg border text-xs transition-all ${
                disc.discovered
                  ? 'bg-stone-950/90 border-amber-700/60 text-stone-200'
                  : 'bg-stone-950/40 border-stone-850 text-stone-400 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-semibold text-stone-100 flex items-center gap-1.5">
                  {disc.discovered ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-stone-400" />
                  )}
                  {disc.discovered ? disc.title : 'Undiscovered Observation'}
                </span>
                {disc.discovered && (
                  <span className="text-[10px] text-amber-400 font-medium">
                    +{disc.rewardKnowledge} Know · +{disc.rewardCulture} Cult
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                {disc.discovered
                  ? disc.description
                  : 'Send scouting expeditions to the surrounding river delta, forest groves, and hills to unlock.'}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-400 italic">
          * Gameplay discoveries are simplified conceptual milestones. Authentic archaeological historical context will be introduced in the next civilization stage.
        </div>
      </div>
    </div>
  );
};
