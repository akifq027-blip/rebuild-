/**
 * BHARAT — Build the Civilization
 * How to Play Tutorial Modal (Part 5)
 */

import React from 'react';
import {
  X,
  Compass,
  Hammer,
  Target,
  Scroll,
  Clock,
  Award,
  BookOpen,
  Bot,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPlaying?: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  onStartPlaying,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '1',
      title: 'Gather Resources',
      desc: 'Tap riverbeds, timber groves, and mineral slopes on the map to collect food, water, wood, and stone.',
      icon: <Compass className="w-5 h-5 text-emerald-400" />,
    },
    {
      step: '2',
      title: 'Build Structures',
      desc: 'Construct mud-brick huts, farms, wells, and granaries to house families and increase daily passive harvests.',
      icon: <Hammer className="w-5 h-5 text-amber-400" />,
    },
    {
      step: '3',
      title: 'Complete Missions',
      desc: 'Follow pedagogical objectives to earn Knowledge, Culture, resources, and civilization XP.',
      icon: <Target className="w-5 h-5 text-amber-300" />,
    },
    {
      step: '4',
      title: 'Research Technologies',
      desc: 'Unlock historical breakthroughs like Fire Mastery, Agriculture, Metallurgy, Pottery, and Water Hydrology.',
      icon: <Scroll className="w-5 h-5 text-amber-400" />,
    },
    {
      step: '5',
      title: 'Explore Historical Eras',
      desc: 'Advance from early Neolithic hearths through Indus, Vedic, Mauryan, Gupta, and Medieval chapters in Journey Through Time.',
      icon: <Clock className="w-5 h-5 text-sky-400" />,
    },
    {
      step: '6',
      title: 'Collect Museum Artifacts',
      desc: 'Send scouts into archaeological terrain to unearth real historical seals, pottery, terracotta figurines, and bronze relics.',
      icon: <Award className="w-5 h-5 text-amber-300" />,
    },
    {
      step: '7',
      title: 'Learn Historical Context',
      desc: 'Open Learn Mode to examine material culture, architectural developments, and peer-reviewed educational citations.',
      icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
    },
    {
      step: '8',
      title: 'Ask Acharya',
      desc: 'Consult your AI historical mentor anytime for authentic historical insights and friendly civilization guidance.',
      icon: <Bot className="w-5 h-5 text-amber-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-amber-900/60 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col max-h-[90vh]">
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
        <div className="p-6 pb-4 border-b border-stone-800 space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>2-Minute Quick Guide</span>
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-amber-200">
            HOW TO BUILD YOUR CIVILIZATION
          </h2>
          <p className="text-xs text-stone-400">
            "Experience India's history by building, exploring, solving problems, and discovering knowledge."
          </p>
        </div>

        {/* Visual Cards Grid */}
        <div className="p-6 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {steps.map((s) => (
              <div
                key={s.step}
                className="bg-stone-950/80 border border-stone-800/80 hover:border-amber-800/60 p-3.5 rounded-xl transition-colors flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-750 flex items-center justify-center shrink-0">
                  {s.icon}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-400 border border-amber-800/40 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {s.step}
                    </span>
                    <h3 className="font-display font-bold text-xs sm:text-sm text-stone-200">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
          >
            Close Guide
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onStartPlaying?.();
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Enter Civilization</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
