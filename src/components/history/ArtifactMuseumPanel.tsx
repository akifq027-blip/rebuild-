import React, { useState } from 'react';
import { ArtifactItem } from '../../types/history';
import {
  Landmark,
  Sparkles,
  BookOpen,
  MapPin,
  CheckCircle,
  Lock,
  ExternalLink,
  Filter,
} from 'lucide-react';

interface ArtifactMuseumPanelProps {
  artifacts: ArtifactItem[];
}

export const ArtifactMuseumPanel: React.FC<ArtifactMuseumPanelProps> = ({ artifacts = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const safeArtifacts = Array.isArray(artifacts) ? artifacts : [];
  const categories = ['ALL', 'Seals', 'Sculptures', 'Pottery', 'Coins', 'Tools'];

  const filteredArtifacts =
    selectedCategory === 'ALL'
      ? safeArtifacts
      : safeArtifacts.filter((a) => a.category === selectedCategory);

  const discoveredCount = safeArtifacts.filter((a) => a.discovered).length;

  return (
    <div className="w-full space-y-5 text-left max-w-7xl mx-auto">
      {/* Museum Title Banner */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-600/50 text-amber-400">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-amber-100 tracking-wide">
                MY CIVILIZATION MUSEUM
              </h2>
              <p className="text-xs text-stone-400">
                Catalogued archaeological relics, numismatics, and material evidence from across Indian history
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 text-xs text-amber-300">
            <span>Relics Catalogued:</span>
            <strong className="text-sm font-bold text-amber-400 tabular-nums">
              {discoveredCount} / {artifacts.length}
            </strong>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <Filter className="w-3.5 h-3.5 text-stone-400 mr-1 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wider transition-colors shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-950 hover:bg-stone-850 text-stone-300 border border-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Artifacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArtifacts.map((art) => (
          <div
            key={art.id}
            className={`rounded-xl border p-5 transition-all flex flex-col justify-between ${
              art.discovered
                ? 'bg-stone-900/90 border-amber-700/60 shadow-lg'
                : 'bg-stone-950/50 border-stone-850 opacity-60'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                  {art.category}
                </span>

                {art.discovered ? (
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                    <CheckCircle className="w-3 h-3 text-emerald-400" /> Discovered
                  </span>
                ) : (
                  <span className="text-[10px] bg-stone-900 text-stone-400 border border-stone-800 px-2 py-0.5 rounded flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Undiscovered
                  </span>
                )}
              </div>

              <h3 className="font-display font-bold text-base text-amber-100 mb-1">
                {art.name}
              </h3>

              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 mb-3">
                <span>{art.period}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" /> {art.region}
                </span>
              </div>

              {art.discovered ? (
                <div className="space-y-3">
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {art.description}
                  </p>

                  <div className="p-2.5 rounded-lg bg-stone-950/80 border border-stone-800 text-[11px] text-stone-300 leading-relaxed">
                    <strong className="text-amber-300 block mb-0.5">Why It Matters:</strong>
                    {art.historicalSignificance}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic py-4">
                  Explore during the {art.period} or complete era milestones to unearth this relic for your museum.
                </p>
              )}
            </div>

            {/* Footer with Evidence Status & Source */}
            {art.discovered && (
              <div className="pt-3 mt-3 border-t border-stone-800/80 text-[11px] text-stone-400 flex items-center justify-between">
                <span className="text-amber-400/90 font-medium">
                  {art.evidenceStatus}
                </span>

                {art.sources[0]?.link && (
                  <a
                    href={art.sources[0].link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-stone-400 hover:text-amber-300 flex items-center gap-1"
                    title={art.sources[0].title}
                  >
                    <span>{art.sources[0].authorOrInstitution}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
