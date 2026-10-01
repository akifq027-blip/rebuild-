import React from 'react';
import { BookOpen } from 'lucide-react';

export const EducationalNote: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-amber-950/40 via-stone-900/80 to-stone-900/40 border border-amber-800/30 rounded-xl p-4 sm:p-5 text-left">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-700/40 text-amber-400 shrink-0 mt-0.5">
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-amber-300">
            WHY ARE WE BUILDING?
          </h4>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
            "History is more than dates and names. In BHARAT, you learn by making decisions, solving problems and developing your civilization."
          </p>
          <p className="text-[11px] text-stone-400 pt-1">
            Smart India Hackathon SIH26208 · Experiential Civilizational Learning Prototype
          </p>
        </div>
      </div>
    </div>
  );
};
