/**
 * BHARAT — Build the Civilization
 * Knowledge Center Technology Tree (Gurukula Vidya)
 */

import React, { useState } from 'react';
import { TechnologyItem } from '../../types/civilization';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Sparkles,
  Lock,
  ArrowRight,
  Compass,
  Award,
} from 'lucide-react';

interface ResearchTreePanelProps {
  technologies: TechnologyItem[];
  currentKnowledge: number;
  onResearchTech: (techId: string) => void;
}

export const ResearchTreePanel: React.FC<ResearchTreePanelProps> = ({
  technologies,
  currentKnowledge,
  onResearchTech,
}) => {
  const [selectedTechId, setSelectedTechId] = useState<string>('brickmaking');

  const selectedTech =
    technologies.find((t) => t.id === selectedTechId) || technologies[0];

  const unlockedTechIds = new Set(
    technologies.filter((t) => t.unlocked).map((t) => t.id)
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 text-left animate-fade-in">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-amber-900/50 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest bg-sky-950/80 px-2.5 py-0.5 rounded border border-sky-800/40">
              GURUKULA VIDYA
            </span>
            <span className="text-xs text-stone-400">Ancient Indian Scientific Treatises</span>
          </div>
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-amber-100 mt-1">
            CIVILIZATION KNOWLEDGE TREE
          </h2>
          <p className="text-xs text-stone-300 max-w-xl mt-1 leading-relaxed">
            From two-row barley domestication and fired brick ratios to astronomical nakshatra calendars, research unlocks new architectural forms and martial prowess.
          </p>
        </div>

        {/* Current Knowledge Stash */}
        <div className="flex items-center gap-3 bg-stone-950/80 border border-stone-800 px-4 py-3 rounded-xl shrink-0">
          <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-700/60 flex items-center justify-center text-sky-300">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-mono block">
              Available Vidya
            </span>
            <span className="font-display font-bold text-lg text-sky-300 tabular-nums">
              {currentKnowledge} Knowledge
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column: Left Tech Tree List & Right Tech Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Tree Grid */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs text-stone-400 uppercase font-mono font-bold tracking-wider block">
            Scientific Disciplines:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {technologies.map((tech) => {
              const isSelected = selectedTechId === tech.id;
              const isUnlocked = tech.unlocked;
              const prereqsMet = tech.prerequisites.every((p) => unlockedTechIds.has(p));
              const canResearch = !isUnlocked && prereqsMet && currentKnowledge >= tech.knowledgeCost;

              return (
                <div
                  key={tech.id}
                  onClick={() => setSelectedTechId(tech.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-950/80 border-amber-500 shadow-xl scale-102 ring-2 ring-amber-400/50'
                      : isUnlocked
                      ? 'bg-stone-900/80 border-emerald-900/50 hover:border-emerald-700'
                      : 'bg-stone-900/40 border-stone-850 hover:border-stone-700 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-display font-bold text-sm text-stone-100">
                        {tech.name}
                      </h4>
                      <span className="text-xs text-sky-400/90 font-mono block italic">
                        {tech.sanskritName}
                      </span>
                    </div>

                    {isUnlocked ? (
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Mastered</span>
                      </span>
                    ) : (
                      <span className="text-[10px] bg-stone-950 text-sky-300 font-mono font-bold px-2 py-0.5 rounded border border-stone-800">
                        {tech.knowledgeCost} Vidya
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-stone-300 line-clamp-2 mt-2 leading-relaxed">
                    {tech.effectSummary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Tech Detail & Research Action */}
        <div className="lg:col-span-5 bg-stone-900/90 border border-amber-900/50 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-sky-400 uppercase font-mono font-bold tracking-wider">
                {selectedTech.category.toUpperCase()} · ERA: {selectedTech.era.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h3 className="font-display font-bold text-lg text-amber-100 mt-1">
              {selectedTech.name}
            </h3>
            <span className="text-xs font-mono text-amber-400/90 block italic">
              {selectedTech.sanskritName}
            </span>
          </div>

          {/* Practical Gameplay Effect */}
          <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800 space-y-1">
            <span className="text-[10px] text-stone-400 uppercase font-mono font-semibold block">
              Strategic Impact:
            </span>
            <p className="text-xs text-emerald-300 leading-relaxed font-semibold">
              {selectedTech.effectSummary}
            </p>
          </div>

          {/* Historical Evidence Box */}
          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800 space-y-1">
            <div className="flex items-center gap-1.5 text-sky-400 font-bold text-[10px] uppercase font-mono">
              <BookOpen className="w-3 h-3" />
              <span>Historical Context:</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed italic">
              "{selectedTech.historicalContext}"
            </p>
          </div>

          {/* Unlock Requirements */}
          <div className="space-y-1 text-xs">
            <span className="text-[10px] text-stone-400 uppercase font-mono font-semibold block">
              Prerequisites:
            </span>
            {selectedTech.prerequisites.length === 0 ? (
              <span className="text-stone-400 italic">None (Foundation Technology)</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {selectedTech.prerequisites.map((pId) => {
                  const pName = technologies.find((t) => t.id === pId)?.name || pId;
                  const isMet = unlockedTechIds.has(pId);
                  return (
                    <span
                      key={pId}
                      className={`px-2 py-0.5 rounded font-mono text-[10px] border ${
                        isMet
                          ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                          : 'bg-red-950/80 border-red-800 text-red-300'
                      }`}
                    >
                      {pName} {isMet ? '✓' : '✗'}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Research Button */}
          {selectedTech.unlocked ? (
            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/40 text-center text-xs text-emerald-300 font-bold flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Technology Fully Mastered</span>
            </div>
          ) : (
            <button
              onClick={() => onResearchTech(selectedTech.id)}
              disabled={
                !selectedTech.prerequisites.every((p) => unlockedTechIds.has(p)) ||
                currentKnowledge < selectedTech.knowledgeCost
              }
              className="w-full py-3 px-4 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-display font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>
                {currentKnowledge < selectedTech.knowledgeCost
                  ? `NEED ${selectedTech.knowledgeCost - currentKnowledge} MORE KNOWLEDGE`
                  : !selectedTech.prerequisites.every((p) => unlockedTechIds.has(p))
                  ? 'PREREQUISITES UNMET'
                  : `RESEARCH (${selectedTech.knowledgeCost} VIDYA)`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
