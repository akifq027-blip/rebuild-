/**
 * BHARAT — Build the Civilization
 * Historical & Gameplay Encyclopedia / Guide Modal
 */

import React from 'react';
import {
  X,
  BookOpen,
  Wheat,
  Trees,
  Gem,
  Flame,
  Landmark,
  Shield,
  Compass,
} from 'lucide-react';
import { CORE_RESOURCES_INFO } from '../../game/constants';
import { CoreResourceKey } from '../../types/civilization';

interface CivilizationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CivilizationGuideModal: React.FC<CivilizationGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in text-left">
      <div className="bg-stone-900 border border-amber-900/60 rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-3">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
              ENCYCLOPEDIA & ARCHAEOLOGICAL GUIDE
            </span>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-amber-100 mt-1">
              BHARAT CIVILIZATION GUIDE
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. The Core Strategic Loop */}
        <div className="space-y-2">
          <h3 className="font-display font-bold text-sm text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-amber-400" />
            <span>The Civilization Strategy Loop</span>
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/70 p-3 rounded-xl border border-stone-800">
            <strong>BUILD → COLLECT → UPGRADE → RESEARCH → TRAIN → DISCOVER → EXPAND</strong>.
            Manage 5 essential resources (Food, Wood, Stone, Clay, Knowledge) to establish foundational granaries and kilns, research non-linear technologies, drill defensive regiments, and launch expeditions across the subcontinental horizons.
          </p>
        </div>

        {/* 2. The Five Primary Resources */}
        <div className="space-y-2">
          <h3 className="font-display font-bold text-sm text-amber-300 uppercase tracking-wider">
            Five Strategic Resources (Pancha Sampada)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {(Object.keys(CORE_RESOURCES_INFO) as CoreResourceKey[]).map((k) => {
              const res = CORE_RESOURCES_INFO[k];
              return (
                <div key={k} className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-100">
                    <span className="font-mono text-amber-400">{res.name} ({res.sanskritName})</span>
                  </div>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    {res.description}
                  </p>
                  <span className="text-[10px] text-amber-400/90 font-mono block">
                    Strategic Role: {res.strategicPurpose}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Archaeological Accuracy & Citations */}
        <div className="space-y-2 border-t border-stone-800 pt-3">
          <h3 className="font-display font-bold text-sm text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Archaeological Grounding & Sources</span>
          </h3>
          <div className="text-xs text-stone-300 space-y-1.5 leading-relaxed bg-stone-950/80 p-3.5 rounded-xl border border-stone-800">
            <p>
              The mechanics and terminology in <em>BHARAT — Build the Civilization</em> are grounded in real excavations published by the <strong>Archaeological Survey of India (ASI)</strong>, <strong>NCERT Class XI: Themes in Indian History</strong>, and <strong>UNESCO World Heritage Monographs</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-stone-300">
              <li><strong>Dholavira Reservoirs</strong>: Rock-cut stepped water management defying desert aridity.</li>
              <li><strong>1:2:4 Brick Ratio</strong>: Universal standard Harappan fired brick metric enabling English-bond masonry.</li>
              <li><strong>Lothal Basin</strong>: Earliest known tidal maritime dockyard engineered with kiln-fired sluice gates.</li>
              <li><strong>Sinauli Chariots</strong>: Solid-wheeled bronze-inlaid battle chariots from the Yamuna Doab.</li>
              <li><strong>Bhimbetka Shelters</strong>: Ochre rock art depicting hunting, humped cattle, and ritual dances.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
