import React, { useState } from 'react';
import { HistoricalEra, SourceReference } from '../../types/history';
import { ACADEMIC_SOURCES, REGIONAL_PATHS, HISTORICAL_ERAS } from '../../data/historicalData';
import {
  BookOpen,
  GraduationCap,
  Layers,
  Sparkles,
  Landmark,
  Compass,
  ExternalLink,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface LearnModePanelProps {
  eras?: HistoricalEra[];
  onNavigateToTab?: (tab: 'HOME' | 'BUILD' | 'EXPLORE' | 'TECHNOLOGY' | 'MISSIONS' | 'MUSEUM' | 'MAP') => void;
  onOpenTimeline?: () => void;
}

export const LearnModePanel: React.FC<LearnModePanelProps> = ({
  eras = [],
  onNavigateToTab,
  onOpenTimeline,
}) => {
  const [activeSection, setActiveSection] = useState<'ERAS' | 'ARCHITECTURE' | 'SCIENCE' | 'REGIONS' | 'SOURCES'>('ERAS');
  const [selectedEraIndex, setSelectedEraIndex] = useState<number>(0);

  const safeEras = Array.isArray(eras) && eras.length > 0 ? eras : HISTORICAL_ERAS;
  const currentEra = safeEras[selectedEraIndex] || safeEras[0];

  return (
    <div className="w-full space-y-6 text-left max-w-7xl mx-auto">
      {/* Learn Mode Header */}
      <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-600/50 text-amber-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
                  SIH26208 ACADEMIC REFERENCE
                </span>
                <span className="text-[10px] bg-stone-950 text-stone-300 px-2 py-0.5 rounded border border-stone-800">
                  Interactive Encyclopedia
                </span>
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-amber-100 tracking-wide">
                BHARAT HISTORICAL KNOWLEDGE ARCHIVE
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Academic & Archaeological Grounding</span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveSection('ERAS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors shrink-0 cursor-pointer ${
              activeSection === 'ERAS' ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-950 text-stone-300 hover:bg-stone-850'
            }`}
          >
            HISTORICAL ERAS
          </button>
          <button
            onClick={() => setActiveSection('ARCHITECTURE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors shrink-0 cursor-pointer ${
              activeSection === 'ARCHITECTURE' ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-950 text-stone-300 hover:bg-stone-850'
            }`}
          >
            ARCHITECTURE & CITIES
          </button>
          <button
            onClick={() => setActiveSection('SCIENCE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors shrink-0 cursor-pointer ${
              activeSection === 'SCIENCE' ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-950 text-stone-300 hover:bg-stone-850'
            }`}
          >
            SCIENCE & METALLURGY
          </button>
          <button
            onClick={() => setActiveSection('REGIONS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors shrink-0 cursor-pointer ${
              activeSection === 'REGIONS' ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-950 text-stone-300 hover:bg-stone-850'
            }`}
          >
            REGIONAL DIVERSITY
          </button>
          <button
            onClick={() => setActiveSection('SOURCES')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors shrink-0 cursor-pointer ${
              activeSection === 'SOURCES' ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-950 text-stone-300 hover:bg-stone-850'
            }`}
          >
            SOURCES & REFERENCES
          </button>
        </div>
      </div>

      {/* 1. ERAS BROWSER */}
      {activeSection === 'ERAS' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-4 space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar">
            {safeEras.map((era, idx) => (
              <button
                key={era.id}
                onClick={() => setSelectedEraIndex(idx)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedEraIndex === idx
                    ? 'bg-amber-950/60 border-amber-500 text-amber-100 shadow-md ring-1 ring-amber-500/50'
                    : 'bg-stone-900/60 hover:bg-stone-850 border-stone-800 text-stone-300'
                }`}
              >
                <div className="text-[10px] font-mono text-amber-500 font-bold">
                  CHAPTER {era.chapterNumber}
                </div>
                <div className="font-display font-semibold text-xs sm:text-sm">
                  {era.title}
                </div>
                <div className="text-[10px] text-stone-400 font-mono">
                  {era.approximateTimeDescription}
                </div>
              </button>
            ))}
          </div>

          <div className="md:col-span-8 bg-stone-900/90 border border-amber-800/40 rounded-2xl p-6 space-y-4">
            <div>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                Chapter {currentEra.chapterNumber} Encyclopedia
              </span>
              <h3 className="font-display font-bold text-2xl text-stone-100">
                {currentEra.title}
              </h3>
              <p className="text-xs text-amber-300 italic mt-0.5">
                "{currentEra.subtitle}"
              </p>
              <span className="text-xs text-stone-400 font-mono block mt-1">
                Timeline: {currentEra.approximateTimeDescription}
              </span>
            </div>

            {/* WHAT */}
            <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <strong className="text-amber-300 block mb-1">WHAT WAS THIS ERA?</strong>
              {currentEra.description}
            </div>

            {/* WHERE */}
            <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 text-xs text-stone-300">
              <strong className="text-amber-300 block mb-1">WHERE (Key Regions & Sites):</strong>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(currentEra?.regions || []).map((r, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-stone-900 border border-stone-750 text-[11px]">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* WHAT EVIDENCE EXISTS */}
            <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 text-xs text-stone-300">
              <strong className="text-amber-300 block mb-1">WHAT EVIDENCE EXISTS?</strong>
              <span className="text-emerald-400 font-medium">{currentEra.evidenceStatus}</span>
              <ul className="space-y-1 mt-2 text-stone-400">
                {(currentEra?.keyDevelopments || []).map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2. ARCHITECTURE & CITIES */}
      {activeSection === 'ARCHITECTURE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold font-display text-base">
              <Building className="w-5 h-5 text-amber-400" />
              <span>Harappan Grid Town Planning</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Harappan settlements featured wide avenues oriented north-south and east-west, standard baked bricks conforming to the universal 1:2:4 thickness-to-width-to-length ratio, and multi-storey dwellings arranged around central courtyards.
            </p>
            <div className="p-2.5 bg-stone-950 rounded border border-stone-800 text-[11px] text-amber-400">
              Evidence: Mohenjo-daro HR Area, Kalibangan, and Lothal dock excavations.
            </div>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('BUILD')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                <span>EXPERIENCE IT: Build Settlement Structures</span>
              </button>
            )}
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold font-display text-base">
              <Building className="w-5 h-5 text-sky-400" />
              <span>Hydraulic Stepwells & Bunds (Vavs & Tanks)</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              From the rock-cut reservoirs of Dholavira to the multistoreyed stepwells of Gujarat and Rajasthan (Rani ki Vav) and the Chola grand cascade tanks (Eris), hydraulic engineering transformed semi-arid climates into enduring agricultural breadbaskets.
            </p>
            <div className="p-2.5 bg-stone-950 rounded border border-stone-800 text-[11px] text-sky-400">
              Evidence: UNESCO World Heritage inscription Dholavira & Rani ki Vav.
            </div>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('HOME')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-stone-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                <span>TRY IT: Inspect Settlement Hydrology</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. SCIENCE & METALLURGY */}
      {activeSection === 'SCIENCE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold font-display text-base">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Decimal Place-Value & Aryabhata’s Astronomy</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Indian mathematicians codified the zero (shunya) as both a placeholder and an operational numeral, laid out trigonometric sine tables (Jya), and determined that the Earth is a sphere rotating on its axis (Aryabhata, 499 CE).
            </p>
            <div className="p-2.5 bg-stone-950 rounded border border-stone-800 text-[11px] text-amber-400">
              Source: Aryabhatiya, Brahmasphutasiddhanta, and the Bakhshali Manuscript.
            </div>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold font-display text-base">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <span>Ancient High-Phosphorus Metallurgy & Wootz Steel</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              From lost-wax bronze casting in the Harappan period to the forge-welded, rustless Delhi Iron Pillar and high-carbon crucible Wootz steel forged in southern India, metalworkers developed unique chemical techniques that astounded contemporary Roman and Arab traders.
            </p>
            <div className="p-2.5 bg-stone-950 rounded border border-stone-800 text-[11px] text-orange-400">
              Source: National Physical Laboratory & ASI metallurgical spectroscopy studies.
            </div>
          </div>
        </div>
      )}

      {/* 4. REGIONAL DIVERSITY */}
      {activeSection === 'REGIONS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REGIONAL_PATHS.map((reg) => (
            <div key={reg.id} className="bg-stone-900/90 border border-stone-800 rounded-xl p-5 space-y-3">
              <h4 className="font-display font-bold text-base text-amber-200">
                {reg.name}
              </h4>
              <span className="text-xs text-stone-400 block font-mono">
                {reg.geographicRegion}
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                {reg.historicalHighlights}
              </p>
              <ul className="space-y-1 text-xs text-stone-400">
                {reg.distinctiveFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* 5. SOURCES & REFERENCES (Required by Section 39 & 40) */}
      {activeSection === 'SOURCES' && (
        <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-6 space-y-4">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="font-display font-bold text-lg text-amber-100">
              SOURCES & REFERENCES REPOSITORY
            </h3>
            <p className="text-xs text-stone-400">
              All historical information in BHARAT is grounded in verified institutional, museum, and curriculum sources.
            </p>
          </div>

          <div className="space-y-3">
            {Object.values(ACADEMIC_SOURCES).map((src) => (
              <div key={src.id} className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      {src.category}
                    </span>
                    <h4 className="font-display font-bold text-sm text-stone-200">
                      {src.title}
                    </h4>
                  </div>
                  <span className="text-xs text-stone-400 mt-1 block">
                    Author / Organization: <strong className="text-stone-300">{src.authorOrInstitution}</strong>
                  </span>
                  <p className="text-xs text-stone-400 mt-1">
                    {src.description}
                  </p>
                </div>

                {src.link && (
                  <a
                    href={src.link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 bg-stone-850 hover:bg-stone-800 text-amber-300 text-xs font-semibold rounded-lg border border-stone-700 hover:border-amber-600 transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <span>Visit Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
