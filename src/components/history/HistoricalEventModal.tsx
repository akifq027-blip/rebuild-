import React, { useState } from 'react';
import { HistoricalEvent } from '../../types/history';
import { AlertCircle, CheckCircle, BookOpen, ExternalLink, X } from 'lucide-react';

interface HistoricalEventModalProps {
  event: HistoricalEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onResolveEvent: (eventId: string, optionId: string) => void;
}

export const HistoricalEventModal: React.FC<HistoricalEventModalProps> = ({
  event,
  isOpen,
  onClose,
  onResolveEvent,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasResolved, setHasResolved] = useState<boolean>(false);

  if (!isOpen || !event) return null;

  const chosenOption = event.options.find((o) => o.id === selectedOptionId);

  const handleResolve = () => {
    if (!chosenOption) return;
    setHasResolved(true);
    onResolveEvent(event.id, chosenOption.id);
  };

  const handleClose = () => {
    setSelectedOptionId(null);
    setHasResolved(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-amber-700/60 rounded-2xl max-w-xl w-full p-5 sm:p-7 shadow-2xl text-left relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category & Title */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
            {event.category} EVENT
          </span>
          <span className="text-[10px] text-stone-400 font-mono">
            {event.evidenceStatus}
          </span>
        </div>

        <h3 className="font-display font-bold text-lg sm:text-xl text-amber-100 mb-3">
          {event.title}
        </h3>

        {/* What Happened Box */}
        <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 mb-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
          <strong className="text-amber-300 block mb-1 text-xs">WHAT HAPPENED?</strong>
          {event.whatHappened}
        </div>

        {!hasResolved ? (
          <div className="space-y-3 mb-4">
            <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
              YOUR CIVILIZATION: What will you do?
            </span>

            {event.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedOptionId === opt.id
                    ? 'bg-amber-950/60 border-amber-500 ring-1 ring-amber-500/50'
                    : 'bg-stone-950/60 hover:bg-stone-850 border-stone-800'
                }`}
              >
                <h4 className="font-display font-bold text-xs sm:text-sm text-stone-100 mb-0.5">
                  {opt.label}
                </h4>
                <span className="text-[11px] text-emerald-400 font-mono">
                  Game Effect: {opt.gameEffectText}
                </span>
              </button>
            ))}

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-stone-200"
              >
                Dismiss
              </button>
              <button
                onClick={handleResolve}
                disabled={!selectedOptionId}
                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedOptionId
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md'
                    : 'bg-stone-800 text-stone-400 cursor-not-allowed border border-stone-700'
                }`}
              >
                Implement Decision
              </button>
            </div>
          </div>
        ) : (
          /* Result & Historical Context */
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-700/60 text-xs sm:text-sm text-emerald-200">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>GAME EFFECT:</span>
              </div>
              <p>{chosenOption?.gameEffectText}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 text-xs text-stone-300 leading-relaxed">
              <strong className="text-amber-300 block mb-1">HISTORICAL CONTEXT:</strong>
              <p>{event.historicalContext}</p>
              <p className="mt-2 text-stone-400 italic">
                Archaeological Basis: {chosenOption?.historicalExplanation}
              </p>
            </div>

            {/* Sources */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Sources:
              </span>
              <ul className="space-y-0.5 text-[11px] text-stone-400">
                {event.sources.map((s) => (
                  <li key={s.id} className="flex items-center justify-between">
                    <span>{s.title} — {s.authorOrInstitution}</span>
                    {s.link && (
                      <a href={s.link} target="_blank" rel="noreferrer" className="text-amber-400 hover:text-amber-300 ml-2">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleClose}
                className="px-5 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md cursor-pointer"
              >
                Close Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
