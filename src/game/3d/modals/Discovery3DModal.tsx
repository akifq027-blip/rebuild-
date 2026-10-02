import React, { useState } from 'react';
import { DiscoveryPoint3D } from '../types';
import {
  Sparkles,
  BookOpen,
  Award,
  ExternalLink,
  X,
  Compass,
  CheckCircle,
  HelpCircle,
  Bot,
  Loader2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import api from '../../../services/api';

interface Discovery3DModalProps {
  discovery: DiscoveryPoint3D | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAcharyaFull?: (initialQuestion?: string) => void;
}

export const Discovery3DModal: React.FC<Discovery3DModalProps> = ({
  discovery,
  isOpen,
  onClose,
  onOpenAcharyaFull,
}) => {
  const [acharyaNote, setAcharyaNote] = useState<string | null>(null);
  const [isLoadingAcharya, setIsLoadingAcharya] = useState(false);

  if (!isOpen || !discovery) return null;

  const handleAskAcharya = async () => {
    if (acharyaNote) return; // already loaded

    setIsLoadingAcharya(true);
    try {
      const res = await api.askAcharya(
        `Please explain the historical and civilizational significance of the discovery "${discovery.title}" for a student playing the game. What real artifacts or sites support this?`,
        {
          selectedArtifact: discovery.title,
          currentObjective: 'Investigate 3D historical site',
        }
      );
      if (res.success && res.data) {
        setAcharyaNote(res.data.answer);
      } else {
        setAcharyaNote(
          `[Historical Insight] Greetings, young explorer! This discovery represents real material evidence documented by institutions like the Archaeological Survey of India (ASI) and NCERT. It highlights how ancient communities adapted to river environments through collective craftsmanship, masonry, and water governance.`
        );
      }
    } catch {
      setAcharyaNote(
        `[Historical Insight] Archaeological surveys indicate this site represents early subcontinental community development, where craftsmen mastered materials and recorded communal observations long before standardized written chronicles.`
      );
    } finally {
      setIsLoadingAcharya(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in text-left">
      <div className="bg-stone-900 border border-cyan-800/60 rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50 flex items-center gap-1">
                <Compass className="w-3 h-3 text-cyan-400" />
                <span>DISCOVERY UNLOCKED</span>
              </span>
              <span className="text-stone-600">·</span>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                CATEGORY: {discovery.category}
              </span>
              <span className="text-stone-600">·</span>
              <span className="text-[10px] text-stone-300 bg-stone-800 px-2 py-0.5 rounded border border-stone-700">
                {discovery.evidenceType}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-bold text-amber-100 flex items-center gap-2 pt-1">
              <span>{discovery.title}</span>
            </h2>
          </div>

          <button
            onClick={() => {
              setAcharyaNote(null);
              onClose();
            }}
            className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reward Banner */}
        <div className="bg-gradient-to-r from-cyan-950/60 via-stone-900 to-amber-950/40 border border-cyan-700/40 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-900/60 border border-cyan-700/60 flex items-center justify-center text-cyan-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-200 block">
                CIVILIZATION PROGRESS ACCELERATED
              </span>
              <span className="text-[11px] text-stone-300">
                Archived in your permanent Subcontinental Learning Chronicle
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="bg-cyan-950 text-cyan-300 px-2.5 py-1 rounded border border-cyan-800/50">
              +{discovery.rewardKnowledge} Knowledge
            </span>
            <span className="bg-amber-950 text-amber-300 px-2.5 py-1 rounded border border-amber-800/50">
              +{discovery.rewardCulture} Culture
            </span>
          </div>
        </div>

        {/* Structured Educational Sections */}
        <div className="space-y-3.5 text-xs leading-relaxed text-stone-300">
          {/* 1. What You Discovered */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>What You Discovered</span>
              </div>
              <span className="text-[10px] text-amber-300/80 bg-amber-950/50 border border-amber-800/40 px-2 py-0.5 rounded font-mono">
                Educational interpretation
              </span>
            </div>
            <p className="text-stone-200 text-sm leading-relaxed">
              {discovery.whatYouDiscovered || discovery.significance}
            </p>
          </div>

          {/* 2. Historical Context */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Historical Context</span>
              </div>
              <span className="text-[10px] text-sky-300/80 bg-sky-950/50 border border-sky-800/40 px-2 py-0.5 rounded font-mono">
                Historical reference
              </span>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              {discovery.historicalContext}
            </p>
          </div>

          {/* 3. Gameplay Connection */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>Gameplay Connection</span>
              </div>
              <span className="text-[10px] text-emerald-300/80 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded font-mono">
                Gameplay representation
              </span>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              {discovery.gameplayConnection ||
                'Advances civilization milestones, contributes toward era unlock requirements, and expands your historical journal.'}
            </p>
          </div>

          {/* 4. Academic Source / Reference */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-3 flex items-start gap-2.5 text-stone-400">
            <ExternalLink className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-300 block text-[11px]">
                  Source / Reference:
                </span>
                <span className="text-[10px] text-stone-400 bg-stone-800 px-1.5 py-0.5 rounded font-mono">
                  Verified Archaeological Evidence
                </span>
              </div>
              <p className="text-[11px] text-amber-300/90 font-mono">
                {discovery.academicSource}
              </p>
            </div>
          </div>

          {/* Feature 8: Acharya AI Integration */}
          <div className="bg-gradient-to-r from-amber-950/30 via-stone-900 to-stone-950 border border-amber-800/50 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🤖</span>
                <span className="font-display font-bold text-xs text-amber-200">
                  ACHARYA HISTORICAL PERSPECTIVE
                </span>
              </div>

              {!acharyaNote && (
                <button
                  onClick={handleAskAcharya}
                  disabled={isLoadingAcharya}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold text-[11px] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  {isLoadingAcharya ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Consulting Acharya...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ask Acharya to Explain</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {acharyaNote ? (
              <div className="bg-stone-950/80 p-3 rounded-lg border border-amber-900/40 text-xs text-stone-200 leading-relaxed space-y-2">
                <p className="whitespace-pre-line text-[11px] sm:text-xs text-amber-100/90 font-sans">
                  {acharyaNote}
                </p>
                {onOpenAcharyaFull && (
                  <button
                    onClick={() => {
                      onOpenAcharyaFull(`Can you tell me more about ${discovery.title}?`);
                      onClose();
                    }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>Open full dialogue with Acharya</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-stone-400">
                Click above to consult your AI historical mentor Acharya on how this discovery fits into subcontinental history.
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            setAcharyaNote(null);
            onClose();
          }}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle className="w-4 h-4" />
          <span>RESUME CIVILIZATION EXPLORATION</span>
        </button>
      </div>
    </div>
  );
};
