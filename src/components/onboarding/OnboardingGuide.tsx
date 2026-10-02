/**
 * BHARAT — Build the Civilization
 * 8-Step Interactive Visual Onboarding System
 */

import React from 'react';
import { OnboardingStep } from '../../types/civilization';
import { ONBOARDING_STEPS } from '../../game/missionsData';
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  X,
  Compass,
} from 'lucide-react';

interface OnboardingGuideProps {
  currentStepNumber: number;
  onboardingCompleted: boolean;
  onActionClick: (targetTab?: string) => void;
  onDismissGuide: () => void;
}

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({
  currentStepNumber,
  onboardingCompleted,
  onActionClick,
  onDismissGuide,
}) => {
  if (onboardingCompleted || currentStepNumber > 8) return null;

  const currentStep =
    ONBOARDING_STEPS.find((s) => s.step === currentStepNumber) || ONBOARDING_STEPS[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 pt-3 animate-fade-in select-none">
      <div className="bg-gradient-to-r from-amber-950/90 via-stone-900/95 to-amber-950/80 border border-amber-600/50 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-left">
        {/* Step Progress & Title */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-stone-950 font-black font-display text-base flex items-center justify-center shrink-0 shadow-md">
            {currentStep.step}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                TUTORIAL · STEP {currentStep.step} OF 8 · {currentStep.badge}
              </span>
            </div>
            <h3 className="font-display font-bold text-sm sm:text-base text-amber-100">
              {currentStep.title}
            </h3>
            <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
              {currentStep.task}
            </p>
          </div>
        </div>

        {/* Action Button & Dismiss */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0 w-full sm:w-auto">
          <button
            onClick={() => onActionClick(currentStep.targetTab)}
            className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{currentStep.actionButtonLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-950" />
          </button>

          <button
            onClick={onDismissGuide}
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer"
            title="Minimize tutorial"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
