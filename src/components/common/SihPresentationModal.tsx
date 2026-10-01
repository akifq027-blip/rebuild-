/**
 * BHARAT — Build the Civilization
 * Smart India Hackathon (SIH26208) AICTE Presentation & Demo Modal (Part 5)
 */

import React from 'react';
import {
  X,
  Award,
  Sparkles,
  Clock,
  Landmark,
  Compass,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Database,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface SihPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchDemoMode: () => void;
}

export const SihPresentationModal: React.FC<SihPresentationModalProps> = ({
  isOpen,
  onClose,
  onLaunchDemoMode,
}) => {
  if (!isOpen) return null;

  const demoFlow = [
    { time: '0:00', label: 'Open BHARAT & State the Problem', detail: 'Students often learn history through passive memorization of isolated dates.' },
    { time: '0:40', label: 'Start Civilization', detail: 'Found an early settlement in the fertile river basin (Era 1: Early Settlements).' },
    { time: '1:00', label: 'Resource Gathering & Economy', detail: 'Collect food, water, wood, and stone with storage capacity management.' },
    { time: '1:40', label: 'Era Challenge Resolution', detail: 'Solve historical dilemmas based on actual archaeological trade/hydrology records.' },
    { time: '2:10', label: 'Advance into Indus Civilization', detail: 'Erect grid-planned brick buildings and covered urban drainage stepwells.' },
    { time: '3:00', label: 'Museum Relic Unearthed', detail: 'Inspect steatite unicorn seals and lost-wax bronze casting with ASI citations.' },
    { time: '3:40', label: 'AI Acharya Mentor', detail: 'Ask Acharya about Harappan hydrology; receive accurate, source-grounded response.' },
    { time: '4:20', label: 'Journey Through Time', detail: 'Display the 11-chapter timeline, cloud persistence, and student progress metrics.' },
    { time: '5:00', label: 'Closing & Impact', detail: 'Reiterate SIH26208 impact: History transformed into living, playable knowledge.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-amber-900/60 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col max-h-[90vh]">
        {/* Top Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-stone-800 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800/60">
              SIH26208 · AICTE Challenge
            </span>
            <span className="text-stone-500">·</span>
            <span className="text-xs text-stone-400 font-semibold">Hackathon Jury Sheet</span>
          </div>

          <h2 className="font-display font-bold text-xl sm:text-2xl text-amber-200">
            BHARAT — BUILD THE CIVILIZATION
          </h2>
          <p className="text-xs text-stone-300 italic">
            "Challenge your creative mind to conceptualize and develop unique toys and games based on our civilization, history, and culture."
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* SIH Core Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-stone-950/80 border border-stone-800 p-3.5 rounded-xl space-y-1.5">
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider block">1. The Problem</span>
              <p className="text-xs text-stone-300 leading-relaxed">
                Indian history is often taught through passive rote memorization of textbook dates, detaching students from how civilizations actually solved material problems.
              </p>
            </div>

            <div className="bg-stone-950/80 border border-stone-800 p-3.5 rounded-xl space-y-1.5">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">2. The Solution</span>
              <p className="text-xs text-stone-300 leading-relaxed">
                An active simulation where history becomes gameplay: students manage resources, build mud-brick settlements, and solve authentic civil dilemmas.
              </p>
            </div>

            <div className="bg-stone-950/80 border border-stone-800 p-3.5 rounded-xl space-y-1.5">
              <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">3. The Innovation</span>
              <p className="text-xs text-stone-300 leading-relaxed">
                Every structure, technology, and artifact is accompanied by verified citations (ASI, NCERT, UNESCO) and a server-side AI mentor (Acharya).
              </p>
            </div>
          </div>

          {/* 5-Minute Demonstration Flow */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="font-display font-bold text-sm text-stone-200">
                  Recommended 5-Minute Hackathon Demo Flow
                </h3>
              </div>
              <span className="text-[10px] text-stone-400">Jury Presentation Guide</span>
            </div>

            <div className="bg-stone-950/90 border border-stone-800 rounded-xl divide-y divide-stone-850">
              {demoFlow.map((d) => (
                <div key={d.time} className="p-2.5 sm:p-3 flex items-start gap-3 text-xs">
                  <span className="font-mono text-amber-400 font-bold bg-stone-900 px-2 py-0.5 rounded border border-stone-800 shrink-0 text-[11px]">
                    {d.time}
                  </span>
                  <div className="space-y-0.5">
                    <span className="font-bold text-stone-200 block">{d.label}</span>
                    <span className="text-stone-400 text-[11px] block">{d.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Matrix */}
          <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl space-y-2">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-amber-400">
              Full-Stack Architecture & Cloud Persistence
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-stone-900/80 p-2 rounded-lg border border-stone-800">
                <span className="text-stone-400 block text-[10px]">Frontend</span>
                <span className="font-semibold text-stone-200">React 19 + Vite</span>
              </div>
              <div className="bg-stone-900/80 p-2 rounded-lg border border-stone-800">
                <span className="text-stone-400 block text-[10px]">Backend</span>
                <span className="font-semibold text-stone-200">Express + Node.js</span>
              </div>
              <div className="bg-stone-900/80 p-2 rounded-lg border border-stone-800">
                <span className="text-stone-400 block text-[10px]">Database</span>
                <span className="font-semibold text-stone-200">Aiven Cloud MySQL</span>
              </div>
              <div className="bg-stone-900/80 p-2 rounded-lg border border-stone-800">
                <span className="text-stone-400 block text-[10px]">AI Mentor</span>
                <span className="font-semibold text-stone-200">Google Gemini API</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-stone-400">
            Historically informed & source-backed educational gameplay
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-850 hover:bg-stone-800 text-stone-300 text-xs font-semibold rounded-xl border border-stone-750 transition-colors cursor-pointer w-full sm:w-auto"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onLaunchDemoMode();
              }}
              className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Launch SIH Demo Mode</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
