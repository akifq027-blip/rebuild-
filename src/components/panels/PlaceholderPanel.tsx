import React from 'react';
import {
  Compass,
  Cpu,
  Palette,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface PlaceholderPanelProps {
  tab: string;
  onNavigateHome: () => void;
}

export const PlaceholderPanel: React.FC<PlaceholderPanelProps> = ({
  tab,
  onNavigateHome,
}) => {
  const getTabConfig = () => {
    switch (tab) {
      case 'CULTURE':
        return {
          title: 'TRADITIONS, SYMBOLS & PHILOSOPHY',
          subtitle: 'Communal lore, seal engraving, rituals, and seasonal festivals',
          icon: <Palette className="w-8 h-8 text-amber-400" />,
          previewPoints: [
            'Steatite Carvings & Geometric Pottery Motifs',
            'Oral Knowledge Transmission & Hymn Preservation',
            'Communal Harvest Festivals & Fire Traditions',
          ],
          eraPreview: 'Integrated into Learn Mode, Artifact Museum, and Historical Challenges.',
        };
      default:
        return {
          title: 'CIVILIZATION ARCHIVE',
          subtitle: 'Exploration of historical facets',
          icon: <Sparkles className="w-8 h-8 text-amber-400" />,
          previewPoints: [
            'Regional traditions across the subcontinent',
            'Material evidence from ASI and National Museum catalogs',
          ],
          eraPreview: 'Explore through the Learn Mode and Journey Through Time.',
        };
    }
  };

  const config = getTabConfig();

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5 text-left py-4 sm:py-8">
      <div className="bg-stone-900/90 border border-amber-800/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="p-3.5 rounded-2xl bg-stone-950 border border-amber-700/50 shadow-inner">
            {config.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-widest font-bold text-amber-500">
                {tab} ARCHIVE
              </span>
              <span className="text-[11px] bg-amber-950/80 text-amber-300 border border-amber-800 px-2 py-0.5 rounded font-semibold">
                Historical Archive
              </span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-stone-100 tracking-wide">
              {config.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
              {config.subtitle}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 mb-6 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
            <strong className="text-amber-300 font-semibold block mb-0.5">
              Available in Learn Mode & Museum
            </strong>
            Cultural traditions, regional schools of art, and spiritual philosophies are documented in the dedicated Learn Mode and Museum tabs.
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-400">
            Archive Highlights:
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
            {config.previewPoints.map((point, idx) => (
              <li key={idx} className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-stone-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-400 italic">
            {config.eraPreview}
          </p>
          <button
            onClick={onNavigateHome}
            className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>Return to Civilization Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
