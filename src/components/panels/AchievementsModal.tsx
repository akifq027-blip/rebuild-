/**
 * BHARAT — Build the Civilization
 * Achievements & Milestones Modal (Part 5)
 */

import React, { useState } from 'react';
import { AchievementItem } from '../../types/game';
import {
  Award,
  X,
  CheckCircle2,
  Lock,
  Sparkles,
  Home,
  Hammer,
  Compass,
  Scroll,
  Clock,
  Landmark,
} from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: AchievementItem[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements = [],
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const safeAchievements = Array.isArray(achievements) ? achievements : [];
  const unlockedCount = safeAchievements.filter((a) => a.unlocked).length;
  const progressPercent = Math.round((unlockedCount / Math.max(1, safeAchievements.length)) * 100);

  const categories = ['ALL', 'building', 'exploration', 'technology', 'museum', 'progression', 'culture'];

  const filtered = activeCategory === 'ALL'
    ? safeAchievements
    : safeAchievements.filter((a) => a.category === activeCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home': return <Home className="w-5 h-5 text-amber-400" />;
      case 'Hammer': return <Hammer className="w-5 h-5 text-amber-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-emerald-400" />;
      case 'Scroll': return <Scroll className="w-5 h-5 text-amber-300" />;
      case 'Clock': return <Clock className="w-5 h-5 text-sky-400" />;
      case 'Landmark': return <Landmark className="w-5 h-5 text-amber-300" />;
      default: return <Award className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-amber-900/60 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col max-h-[85vh]">
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
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-amber-200">
                CIVILIZATION ACHIEVEMENTS
              </h2>
              <p className="text-xs text-stone-400">
                Honoring milestones across architectural, scientific, and cultural developments
              </p>
            </div>
          </div>

          {/* Progress Banner */}
          <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-200">Progress:</span>
                <span className="text-xs font-bold text-amber-400">
                  {unlockedCount} of {achievements.length} Milestones Unlocked ({progressPercent}%)
                </span>
              </div>
              <div className="w-60 max-w-full bg-stone-850 h-2 rounded-full overflow-hidden border border-stone-800">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <span className="text-[11px] text-stone-400 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-lg">
              +{unlockedCount * 75} Civilization XP Earned
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors uppercase tracking-wider text-[10px] shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-amber-600 text-stone-950 font-bold'
                    : 'bg-stone-950 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Achievement Cards Grid */}
        <div className="p-6 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  ach.unlocked
                    ? 'bg-gradient-to-br from-amber-950/30 to-stone-900/90 border-amber-700/60 shadow-md'
                    : 'bg-stone-950/60 border-stone-850 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    ach.unlocked
                      ? 'bg-amber-950/80 border-amber-600/50'
                      : 'bg-stone-900 border-stone-800 text-stone-600'
                  }`}
                >
                  {ach.unlocked ? getIcon(ach.iconName) : <Lock className="w-4 h-4 text-stone-600" />}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className={`font-display font-bold text-xs sm:text-sm truncate ${
                      ach.unlocked ? 'text-amber-200' : 'text-stone-400'
                    }`}>
                      {ach.title}
                    </h3>
                    {ach.unlocked ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest shrink-0">
                        Locked
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-stone-400 leading-relaxed line-clamp-2">
                    {ach.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span className="text-amber-400/90 font-mono">+{ach.xpReward} XP</span>
                    {ach.unlockedAt && (
                      <span className="text-stone-400">{ach.unlockedAt}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span>Achievements save permanently to your cloud account</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
