/**
 * BHARAT — Build the Civilization
 * Historical Sources & Academic References Modal (Part 5)
 */

import React, { useState } from 'react';
import { SourceReference } from '../../types/history';
import { ACADEMIC_SOURCES } from '../../data/historicalData';
import {
  BookOpen,
  X,
  ExternalLink,
  Landmark,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  focusedSourceId?: string;
}

export const SourcesModal: React.FC<SourcesModalProps> = ({
  isOpen,
  onClose,
  focusedSourceId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const sourcesList: SourceReference[] = Object.values(ACADEMIC_SOURCES);

  const categories = ['ALL', 'Government / Institutional', 'Museum / Heritage', 'Academic', 'Educational'];

  const filtered = sourcesList.filter((s) => {
    const matchCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.authorOrInstitution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-amber-900/60 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col max-h-[85vh]">
        {/* Top Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-stone-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-600/50 flex items-center justify-center text-amber-400 shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xl text-amber-200">
                  HISTORICAL SOURCES & REFERENCES
                </h2>
                <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded font-semibold">
                  Verified Academic
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Pedagogical citations supporting archaeological descriptions, timeline eras, and material culture in BHARAT
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search institution, title, or topic..."
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-500 outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-stone-950'
                      : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  {cat === 'Government / Institutional' ? 'Government' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Source Cards List */}
        <div className="p-6 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {filtered.map((s) => {
              const isFocused = s.id === focusedSourceId;
              return (
                <div
                  key={s.id}
                  className={`p-4 rounded-xl border transition-all space-y-2 ${
                    isFocused
                      ? 'bg-amber-950/40 border-amber-500 shadow-md'
                      : 'bg-stone-950/70 border-stone-800 hover:border-amber-800/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                        {s.category}
                      </span>
                      <h3 className="font-display font-bold text-sm sm:text-base text-stone-100 mt-1">
                        {s.title}
                      </h3>
                      <p className="text-xs text-amber-300/80 font-medium">
                        {s.authorOrInstitution}
                      </p>
                    </div>

                    {s.link && (
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 bg-stone-900 border border-amber-900/40 px-3 py-1.5 rounded-lg transition-colors shrink-0 self-start sm:self-center"
                      >
                        <span>Official Archive</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed pt-1 border-t border-stone-850">
                    {s.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400">
          <div className="flex items-center gap-1.5 text-stone-400">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Historically informed and source-backed educational gameplay (ASI · NCERT · UNESCO)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Sources
          </button>
        </div>
      </div>
    </div>
  );
};
