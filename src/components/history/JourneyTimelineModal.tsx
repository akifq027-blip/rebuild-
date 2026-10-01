import React, { useState } from 'react';
import { HistoricalEra } from '../../types/history';
import { HISTORICAL_ERAS } from '../../data/historicalData';
import {
  Compass,
  CheckCircle,
  Lock,
  ArrowRight,
  BookOpen,
  Calendar,
  X,
  Sparkles,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface JourneyTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  eras?: HistoricalEra[];
  currentEraId: string;
  onSelectEra: (eraId: string) => void;
  artifactsFoundCount: number;
  totalArtifactsCount: number;
}

export const JourneyTimelineModal: React.FC<JourneyTimelineModalProps> = ({
  isOpen,
  onClose,
  eras = [],
  currentEraId,
  onSelectEra,
  artifactsFoundCount,
  totalArtifactsCount,
}) => {
  const [selectedEraId, setSelectedEraId] = useState<string>(currentEraId);

  if (!isOpen) return null;

  const safeEras = Array.isArray(eras) && eras.length > 0 ? eras : HISTORICAL_ERAS;
  const currentEraIndex = safeEras.findIndex((e) => e.id === currentEraId);
  const selectedEra = safeEras.find((e) => e.id === selectedEraId) || safeEras[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-amber-700/60 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-stone-950 border-b border-amber-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-600/50 text-amber-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
                  SIH26208 AICTE FLAGSHIP FEATURE
                </span>
                <span className="text-[10px] bg-stone-850 text-stone-300 px-2 py-0.5 rounded border border-stone-750">
                  Part 3 Historical Campaign
                </span>
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-amber-100 tracking-wide">
                JOURNEY THROUGH TIME — INDIAN CIVILIZATION
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-100 p-1.5 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Zone Demonstration Banner (Required by Section 60) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 p-4 bg-stone-950/60 border-b border-stone-800 text-xs">
          <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800">
            <span className="text-stone-400 text-[10px] uppercase block font-semibold">WHERE YOU STARTED</span>
            <span className="font-bold text-amber-300">Chapter 1: Early Settlements</span>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-700/50">
            <span className="text-amber-400 text-[10px] uppercase block font-semibold">WHERE YOU ARE NOW</span>
            <span className="font-bold text-amber-200">{eras.find((e) => e.id === currentEraId)?.title}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800">
            <span className="text-stone-400 text-[10px] uppercase block font-semibold">WHAT YOU HAVE DISCOVERED</span>
            <span className="font-bold text-emerald-300 tabular-nums">
              {artifactsFoundCount} / {totalArtifactsCount} Artifacts
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800">
            <span className="text-stone-400 text-[10px] uppercase block font-semibold">WHAT COMES NEXT</span>
            <span className="font-bold text-stone-200">
              {currentEraIndex + 1 < eras.length ? eras[currentEraIndex + 1].title : 'British Colonial Period'}
            </span>
          </div>
        </div>

        {/* Modal Body: Left Timeline Stepper + Right Detail Card */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-stone-800">
          {/* Left Timeline Scroller */}
          <div className="md:col-span-5 p-4 space-y-2 overflow-y-auto max-h-[50vh] md:max-h-[60vh] no-scrollbar">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-2 px-1">
              Historical Timeline Chapters:
            </span>

            {safeEras.map((era, idx) => {
              const isCurrent = era.id === currentEraId;
              const isSelected = era.id === selectedEraId;
              const isUnlocked = era.unlocked;

              return (
                <button
                  key={era.id}
                  onClick={() => setSelectedEraId(era.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                      : 'bg-stone-900/60 hover:bg-stone-850 border-stone-800'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      {isUnlocked ? (
                        <CheckCircle className={`w-4 h-4 ${isCurrent ? 'text-amber-400' : 'text-emerald-400'}`} />
                      ) : (
                        <Lock className="w-4 h-4 text-stone-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-amber-500">
                          CH {era.chapterNumber}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] bg-amber-400 text-stone-950 font-bold px-1.5 py-0.2 rounded">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <h4 className="font-display font-semibold text-xs sm:text-sm text-stone-100">
                        {era.title}
                      </h4>
                      <span className="text-[10px] text-stone-400 font-mono block">
                        {era.approximateTimeDescription}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-medium text-stone-500 shrink-0 self-center">
                    {isUnlocked ? 'View' : 'Locked'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Detail Pane */}
          <div className="md:col-span-7 p-5 space-y-4 overflow-y-auto max-h-[50vh] md:max-h-[60vh]">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  Chapter {selectedEra.chapterNumber}
                </span>
                <span className="text-stone-600">·</span>
                <span className="text-[11px] bg-stone-950 text-stone-300 px-2 py-0.5 rounded border border-stone-800">
                  {selectedEra.evidenceStatus}
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-amber-100">
                {selectedEra.title}
              </h3>
              <p className="text-xs text-amber-300/90 italic mt-0.5">
                "{selectedEra.subtitle}"
              </p>
              <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                <span>{selectedEra.approximateTimeDescription}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <strong className="text-amber-200 block mb-1">Historical Context:</strong>
              {selectedEra.description}
            </div>

            {/* Key Developments */}
            <div className="space-y-2">
              <h5 className="text-xs uppercase tracking-wider font-semibold text-stone-400">
                Documented Developments:
              </h5>
              <ul className="space-y-1.5 text-xs text-stone-300">
                {(selectedEra?.keyDevelopments || []).map((dev, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span>{dev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Regions / Sites */}
            <div className="space-y-1.5">
              <h5 className="text-xs uppercase tracking-wider font-semibold text-stone-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" /> Key Archaeological / Historical Regions:
              </h5>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {(selectedEra?.regions || []).map((reg, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-300 text-[11px]">
                    {reg}
                  </span>
                ))}
              </div>
            </div>

            {/* Sources Display (Transparency as required by Section 40) */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Documented Institutional Sources:
              </span>
              <ul className="space-y-1 text-[11px] text-stone-400">
                {(selectedEra?.sources || []).map((s) => (
                  <li key={s.id} className="flex items-center justify-between">
                    <span>
                      <strong>{s.title}</strong> — {s.authorOrInstitution}
                    </span>
                    {s.link && (
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-0.5 ml-2"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-stone-400">
                {!selectedEra.unlocked && (
                  <span className="text-amber-500 font-medium">
                    Requirements: {selectedEra.unlockRequirements.description}
                  </span>
                )}
              </div>

              {selectedEra.unlocked && selectedEra.id !== currentEraId && (
                <button
                  onClick={() => {
                    onSelectEra(selectedEra.id);
                    onClose();
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Switch Focus to this Era</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-stone-950 border-t border-stone-800 text-[11px] text-stone-400 text-center">
          "Indian history encompasses multiple regions, overlapping developments, and diverse cultural centres. Progression simplified for gameplay."
        </div>
      </div>
    </div>
  );
};
