import React from 'react';
import { HistoricalEra } from '../../types/history';
import { Landmark, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface EraTransitionModalProps {
  era: HistoricalEra | null;
  isOpen: boolean;
  onEnterEra: () => void;
}

export const EraTransitionModal: React.FC<EraTransitionModalProps> = ({
  era,
  isOpen,
  onEnterEra,
}) => {
  if (!isOpen || !era) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-stone-900 border border-amber-600/70 rounded-2xl max-w-xl w-full p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden bg-parchment-pattern">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

        <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-500/60 flex items-center justify-center text-amber-300 mx-auto mb-4 shadow-lg shadow-amber-950/50">
          <Landmark className="w-7 h-7" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-amber-950/60 border border-amber-700/50 text-[11px] uppercase tracking-widest text-amber-300 font-bold mb-3">
          A NEW CHAPTER OF YOUR JOURNEY
        </div>

        <h2 className="font-display font-black text-2xl sm:text-3xl text-amber-100 tracking-wide mb-2 uppercase">
          {era.title}
        </h2>

        <p className="text-xs sm:text-sm text-amber-300/90 font-medium italic mb-4">
          "{era.subtitle}"
        </p>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-lg mx-auto mb-6 bg-stone-950/60 p-4 rounded-xl border border-stone-800 text-left">
          {era.description}
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onEnterEra}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-display font-bold text-sm tracking-wider rounded-xl shadow-xl shadow-amber-950/50 transition-all duration-200 hover:scale-105 cursor-pointer flex items-center gap-2"
          >
            <span>ENTER ERA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
