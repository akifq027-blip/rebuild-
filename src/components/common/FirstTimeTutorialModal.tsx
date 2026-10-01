/**
 * BHARAT — Build the Civilization
 * First-Time Player Interactive Onboarding Tutorial (Part 5)
 */

import React, { useState } from 'react';
import {
  Compass,
  Hammer,
  Target,
  Scroll,
  Clock,
  Bot,
  Landmark,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
} from 'lucide-react';

interface FirstTimeTutorialModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const FirstTimeTutorialModal: React.FC<FirstTimeTutorialModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tutorialSteps = [
    {
      title: 'Welcome, Civilization Builder.',
      subtitle: 'Experience Indian history by building, exploring, and discovering.',
      desc: 'You are embarking on a journey that begins with ancient river valley settlements and unfolds across millennia of innovation, philosophy, and material culture in the Indian subcontinent.',
      icon: <Landmark className="w-8 h-8 text-amber-400" />,
      actionHint: 'Your settlement awaits your guidance along the sacred riverbanks.',
    },
    {
      title: 'Gather resources to support your community.',
      subtitle: 'Sustain your settlement with raw materials.',
      desc: 'Tap the river, timber groves, and quarry ridges on the map to collect Food, Water, Wood, and Stone. Watch storage limits and construct granaries to expand capacity.',
      icon: <Compass className="w-8 h-8 text-emerald-400" />,
      actionHint: 'Timber and fresh water form the foundation of early life.',
    },
    {
      title: 'Build structures.',
      subtitle: 'Transform a campsite into a thriving town.',
      desc: 'Erect mud-brick dwellings to shelter more families, farms to cultivate barley and wheat, wells for fresh water, and workshops for artisan toolmakers.',
      icon: <Hammer className="w-8 h-8 text-amber-400" />,
      actionHint: 'Constructing Huts increases your population capacity.',
    },
    {
      title: 'Complete missions.',
      subtitle: 'Reach milestone objectives for rewards.',
      desc: 'Follow the active mission at the top of your dashboard to earn vital Knowledge, Culture, resources, and civilization XP that level up your leadership.',
      icon: <Target className="w-8 h-8 text-amber-300" />,
      actionHint: 'Check the Missions tab regularly to claim earned rewards.',
    },
    {
      title: 'Research knowledge.',
      subtitle: 'Unlock historical innovations in the Technology Tree.',
      desc: 'Spend gathered Knowledge to master Fire, Agriculture, Metallurgy, Pottery, and Urban Drainage. Each discovery unlocks new buildings and historical insights.',
      icon: <Scroll className="w-8 h-8 text-amber-400" />,
      actionHint: 'Knowledge unlocks the tools needed to advance eras.',
    },
    {
      title: 'Explore history.',
      subtitle: 'Progress through 11 historical chapters.',
      desc: 'Advance from early hearths into the Indus Civilization, Vedic assemblies, Mauryan administrative centers, and beyond. Explore dilemmas and resolve era challenges.',
      icon: <Clock className="w-8 h-8 text-sky-400" />,
      actionHint: 'Click "Journey Through Time" in the top bar to inspect all chapters.',
    },
    {
      title: 'Ask Acharya whenever you need help.',
      subtitle: 'Your AI historical mentor is always ready.',
      desc: 'Tap the floating 🤖 ACHARYA button anytime. Ask about archaeological evidence, ancient town planning, historical technologies, or gameplay tips.',
      icon: <Bot className="w-8 h-8 text-amber-400" />,
      actionHint: 'Acharya provides student-friendly, verified historical answers.',
    },
  ];

  const stepData = tutorialSteps[currentStep];
  const isLast = currentStep === tutorialSteps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 border border-amber-900/60 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col">
        {/* Top Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700" />

        {/* Skip Button */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 text-xs text-stone-400 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1 bg-stone-950/60 px-2.5 py-1 rounded-lg border border-stone-800"
        >
          <span>Skip Tutorial</span>
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Content */}
        <div className="p-7 space-y-5 text-center">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {tutorialSteps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === currentStep
                    ? 'w-6 bg-amber-400'
                    : i < currentStep
                    ? 'w-2 bg-amber-600'
                    : 'w-2 bg-stone-800'
                }`}
              />
            ))}
          </div>

          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-amber-950 border border-amber-600/50 flex items-center justify-center mx-auto shadow-lg">
            {stepData.icon}
          </div>

          {/* Texts */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">
              Step {currentStep + 1} of {tutorialSteps.length}
            </span>
            <h3 className="font-display font-bold text-lg sm:text-xl text-amber-200">
              {stepData.title}
            </h3>
            <p className="text-xs text-stone-300 font-medium">
              {stepData.subtitle}
            </p>
          </div>

          <p className="text-xs text-stone-400 leading-relaxed max-w-md mx-auto">
            {stepData.desc}
          </p>

          <div className="p-2.5 bg-stone-950/80 rounded-xl border border-stone-800/80 text-[11px] text-amber-300/90 italic">
            "{stepData.actionHint}"
          </div>
        </div>

        {/* Navigation Buttons Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-3.5 py-2 text-xs font-semibold text-stone-400 hover:text-stone-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            {isLast ? (
              <>
                <span>Begin Civilization</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
