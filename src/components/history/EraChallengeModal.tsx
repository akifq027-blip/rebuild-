import React, { useState } from 'react';
import { EraChallenge } from '../../types/history';
import { Sparkles, CheckCircle, BookOpen, ExternalLink, X, Award } from 'lucide-react';

interface EraChallengeModalProps {
  challenge: EraChallenge | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteChallenge: (challengeId: string, optionId: string, rewardKnowledge: number, rewardCulture: number) => void;
}

export const EraChallengeModal: React.FC<EraChallengeModalProps> = ({
  challenge,
  isOpen,
  onClose,
  onCompleteChallenge,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  if (!isOpen || !challenge) return null;

  const chosenOption = challenge.options.find((o) => o.id === selectedOptionId);

  const handleSubmit = () => {
    if (!chosenOption) return;
    setHasSubmitted(true);
    onCompleteChallenge(
      challenge.id,
      chosenOption.id,
      chosenOption.rewardKnowledge,
      chosenOption.rewardCulture
    );
  };

  const handleResetAndClose = () => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-amber-700/60 rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl text-left relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-1 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-600/50 text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
              HISTORICAL CIVILIZATION CHALLENGE
            </span>
            <h3 className="font-display font-bold text-lg sm:text-xl text-amber-100">
              {challenge.title}
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
          {challenge.description}
        </p>

        {/* Historical Context Card */}
        <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3.5 mb-5 text-xs text-stone-300 leading-relaxed">
          <strong className="text-amber-300 block mb-1">
            📜 Historical Context (Archaeological & Textual Record):
          </strong>
          {challenge.historicalContext}
        </div>

        {!hasSubmitted ? (
          <div className="space-y-3 mb-5">
            <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
              Choose your civilization’s strategic response:
            </span>

            {challenge.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedOptionId === opt.id
                    ? 'bg-amber-950/60 border-amber-500 ring-1 ring-amber-500/50'
                    : 'bg-stone-950/60 hover:bg-stone-850 border-stone-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-display font-bold text-xs sm:text-sm text-stone-100">
                    {opt.label}
                  </h4>
                  <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                    +{opt.rewardKnowledge} Know · +{opt.rewardCulture} Cult
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 italic">
                  Historical Basis: {opt.historicalBasis}
                </p>
              </button>
            ))}

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={handleResetAndClose}
                className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-stone-200"
              >
                Postpone
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedOptionId}
                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedOptionId
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md'
                    : 'bg-stone-800 text-stone-400 cursor-not-allowed border border-stone-700'
                }`}
              >
                Confirm Decision
              </button>
            </div>
          </div>
        ) : (
          /* Consequence & Sources Display */
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/60 text-xs sm:text-sm text-emerald-200 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>CHALLENGE COMPLETED — GAME RESULT:</span>
              </div>
              <p>{chosenOption?.consequenceText}</p>
              <div className="mt-2 text-[11px] text-emerald-400 font-mono">
                Awarded +{chosenOption?.rewardKnowledge} Knowledge and +{chosenOption?.rewardCulture} Culture to your civilization.
              </div>
            </div>

            {/* Sources Transparency */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Historical Sources & Citations:
              </span>
              <ul className="space-y-1 text-[11px] text-stone-400">
                {challenge.sources.map((s) => (
                  <li key={s.id} className="flex items-center justify-between">
                    <span>
                      <strong>{s.title}</strong> — {s.authorOrInstitution}
                    </span>
                    {s.link && (
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:text-amber-300 ml-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleResetAndClose}
                className="px-5 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md cursor-pointer"
              >
                Continue Journey
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
