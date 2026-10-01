/**
 * BHARAT — Build the Civilization
 * Acharya Card Component (Part 4 Active AI Historical Mentor)
 */

import React from 'react';
import { Bot, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

interface AcharyaCardProps {
  onOpenAcharya?: () => void;
  currentEraTitle?: string;
}

export const AcharyaCard: React.FC<AcharyaCardProps> = ({
  onOpenAcharya,
  currentEraTitle = 'Early Settlements',
}) => {
  return (
    <div className="w-full bg-gradient-to-r from-amber-950/30 via-stone-900/90 to-stone-900/50 border border-amber-800/40 rounded-xl p-4 sm:p-5 text-left relative overflow-hidden flex flex-col justify-between gap-3 shadow-lg">
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-600/50 flex items-center justify-center text-amber-400 shrink-0 shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display font-bold text-sm sm:text-base text-amber-200 tracking-wide">
                ACHARYA
              </h4>
              <span className="text-[10px] bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded font-semibold border border-emerald-800/60">
                AI Active · Part 4
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Historical mentor & archaeological guide
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAcharya}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-md"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Ask Acharya</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="pt-2 border-t border-stone-800/80 text-xs text-stone-300 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p className="text-stone-400 italic">
          "Ask me about ancient hydrology, trade across the seas, monuments, or how to advance {currentEraTitle}."
        </p>

        <button
          type="button"
          onClick={onOpenAcharya}
          className="sm:hidden self-start inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Consult Acharya</span>
        </button>
      </div>
    </div>
  );
};
