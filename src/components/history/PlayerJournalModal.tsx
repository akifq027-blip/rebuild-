import React from 'react';
import { JournalEntry } from '../../types/history';
import { BookOpen, Calendar, X, Sparkles, Landmark, Compass, Award } from 'lucide-react';

interface PlayerJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  civilizationName: string;
}

export const PlayerJournalModal: React.FC<PlayerJournalModalProps> = ({
  isOpen,
  onClose,
  entries = [],
  civilizationName,
}) => {
  if (!isOpen) return null;

  const safeEntries = Array.isArray(entries) ? entries : [];

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'era':
        return <Landmark className="w-4 h-4 text-amber-400" />;
      case 'artifact':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'challenge':
        return <Award className="w-4 h-4 text-emerald-400" />;
      case 'event':
        return <Compass className="w-4 h-4 text-sky-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-amber-700/60 rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl text-left relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-800">
          <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-600/50 text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
              EXPLORER’S CHRONICLE
            </span>
            <h3 className="font-display font-bold text-lg sm:text-xl text-amber-100">
              MY JOURNAL — {civilizationName.toUpperCase()}
            </h3>
          </div>
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {safeEntries.length === 0 ? (
            <div className="text-center py-10 text-stone-500 text-xs">
              Your journey has just begun. As you gather resources, build structures, and uncover relics, journal entries will appear here.
            </div>
          ) : (
            safeEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-3 text-xs"
              >
                <div className="p-2 rounded-lg bg-stone-900 border border-stone-800 mt-0.5 shrink-0">
                  {getEntryIcon(entry.type)}
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between text-stone-400 text-[11px]">
                    <span className="font-mono text-amber-400/90 font-medium">
                      {entry.eraTitle}
                    </span>
                    <span className="text-stone-400">{entry.timestamp}</span>
                  </div>
                  <h4 className="font-display font-semibold text-stone-200 text-sm">
                    {entry.title}
                  </h4>
                  <p className="text-stone-300 leading-relaxed text-xs">
                    {entry.detail}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-3 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md cursor-pointer"
          >
            Close Journal
          </button>
        </div>
      </div>
    </div>
  );
};
