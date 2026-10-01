import React, { useState } from 'react';
import { MapPin, Waves, Mountain, Landmark, ExternalLink, Info } from 'lucide-react';

interface HistoricalSite {
  id: string;
  name: string;
  era: string;
  x: number;
  y: number;
  description: string;
  evidence: string;
}

interface HistoricalSubcontinentMapProps {
  currentEraId: string;
}

export const HistoricalSubcontinentMap: React.FC<HistoricalSubcontinentMapProps> = ({
  currentEraId,
}) => {
  const [selectedSite, setSelectedSite] = useState<HistoricalSite | null>(null);

  const historicalSites: HistoricalSite[] = [
    {
      id: 'mohenjo_daro',
      name: 'Mohenjo-daro',
      era: 'harappan',
      x: 240,
      y: 190,
      description: 'Major urban centre with Great Bath, Granary, and extensive fired-brick residential sectors.',
      evidence: 'Archaeological excavations by ASI (1922 onwards)',
    },
    {
      id: 'harappa',
      name: 'Harappa',
      era: 'harappan',
      x: 290,
      y: 140,
      description: 'First identified Indus site, noted for citadel, granaries, and cemetery stratigraphy.',
      evidence: 'ASI excavation reports',
    },
    {
      id: 'dholavira',
      name: 'Dholavira',
      era: 'harappan',
      x: 260,
      y: 280,
      description: 'Gigantic stone-cut reservoirs, tripartite city division, and giant signboard inscription.',
      evidence: 'UNESCO World Heritage citation',
    },
    {
      id: 'lothal',
      name: 'Lothal',
      era: 'harappan',
      x: 290,
      y: 310,
      description: 'Tidal dock basin and carnelian bead-making factory for Persian Gulf trade.',
      evidence: 'ASI excavation reports (S.R. Rao)',
    },
    {
      id: 'pataliputra',
      name: 'Pataliputra (Patna)',
      era: 'mauryan',
      x: 520,
      y: 240,
      description: 'Imperial capital of Magadha, Mauryas, and Guptas along the Ganga-Son confluence.',
      evidence: 'Kumrahar excavations (wooden palisades & pillared hall)',
    },
    {
      id: 'taxila',
      name: 'Taxila (Takshashila)',
      era: 'mauryan',
      x: 260,
      y: 80,
      description: 'Ancient international university centre, junction of the Northern Route (Uttarapatha).',
      evidence: 'Bhir Mound & Sirkap excavations',
    },
    {
      id: 'sarnath',
      name: 'Sarnath',
      era: 'mauryan',
      x: 480,
      y: 230,
      description: 'Site of the first sermon of the Buddha, location of the Ashokan Lion Capital pillar.',
      evidence: 'Monolithic polished sandstone pillar in situ',
    },
    {
      id: 'ujjain',
      name: 'Ujjain (Avanti)',
      era: 'gupta',
      x: 340,
      y: 280,
      description: 'Meridian of ancient Indian astronomy and prime trade hub on the Dakshinapatha.',
      evidence: 'Astronomical treatises & Varahamihira records',
    },
    {
      id: 'thanjavur',
      name: 'Thanjavur',
      era: 'medieval',
      x: 410,
      y: 470,
      description: 'Chola capital featuring the monolithic granite Brihadisvara Temple and Grand Anicut irrigation network.',
      evidence: 'Chola stone inscriptions & UNESCO World Heritage listing',
    },
  ];

  return (
    <div className="w-full bg-stone-900/90 border border-amber-900/40 rounded-xl overflow-hidden shadow-2xl relative text-left">
      {/* Top Map Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-stone-950 border-b border-amber-900/30 gap-2">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-amber-400" />
          <h3 className="font-display font-bold text-sm sm:text-base text-amber-200 tracking-wide">
            HISTORICAL SUBCONTINENT GEOGRAPHY & ARCHAEOLOGICAL SITES
          </h3>
        </div>

        <span className="text-[11px] text-stone-400">
          Showing major river valleys, mountain ranges, and documented excavations
        </span>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[500px] bg-gradient-to-b from-[#1c1815] to-[#0c0a09] overflow-hidden select-none">
        <svg
          viewBox="0 0 750 540"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="mapCoastGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#082f49" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2c241c" />
              <stop offset="100%" stopColor="#1c1610" />
            </linearGradient>
          </defs>

          {/* Ocean Backdrop */}
          <rect width="750" height="540" fill="#0c1a24" />

          {/* Subcontinent Landmass Polygon (Stylized Educational Projection) */}
          <path
            d="M150,40 L380,40 L650,110 L680,180 L600,240 L540,280 L480,380 L410,510 L370,510 L330,420 L270,350 L240,290 L200,260 L140,200 L120,100 Z"
            fill="url(#landGrad)"
            stroke="rgba(217, 119, 6, 0.4)"
            strokeWidth="1.5"
          />

          {/* Mountain Ranges (Himalayas Arc) */}
          <path
            d="M200,60 Q400,50 630,120"
            stroke="#78716c"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="10 6"
            fill="none"
            opacity="0.6"
          />
          <text x="380" y="45" fill="#d6d3d1" fontSize="10" fontWeight="bold" letterSpacing="1.5">
            ▲ HIMALAYAS
          </text>

          {/* Vindhyas Central Divide */}
          <path
            d="M300,260 Q420,250 510,270"
            stroke="#57534e"
            strokeWidth="4"
            fill="none"
            opacity="0.5"
          />
          <text x="360" y="255" fill="#a8a29e" fontSize="8" fontWeight="bold">
            VINDHYA RANGE
          </text>

          {/* Major Rivers */}
          {/* Indus & Saraswati System */}
          <path
            d="M260,70 Q280,110 240,180 Q220,220 200,260"
            stroke="#38bdf8"
            strokeWidth="2.5"
            fill="none"
            opacity="0.8"
          />
          <text x="210" y="150" fill="#7dd3fc" fontSize="9" fontWeight="bold" transform="rotate(-65 210 150)">
            INDUS BASIN
          </text>

          {/* Ganga-Yamuna System */}
          <path
            d="M340,110 Q420,180 500,230 Q560,260 590,300"
            stroke="#38bdf8"
            strokeWidth="3"
            fill="none"
            opacity="0.8"
          />
          <text x="430" y="180" fill="#7dd3fc" fontSize="9" fontWeight="bold" transform="rotate(30 430 180)">
            GANGA-YAMUNA VALLEY
          </text>

          {/* Narmada */}
          <path d="M300,275 L450,270" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.7" />

          {/* Godavari & Krishna */}
          <path d="M320,340 Q400,350 490,360" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.7" />

          {/* Kaveri */}
          <path d="M350,450 Q390,460 430,465" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.7" />

          {/* Ocean Labels */}
          <text x="80" y="400" fill="#38bdf8" opacity="0.4" fontSize="12" fontWeight="bold" letterSpacing="2">
            ARABIAN SEA
          </text>
          <text x="560" y="420" fill="#38bdf8" opacity="0.4" fontSize="12" fontWeight="bold" letterSpacing="2">
            BAY OF BENGAL
          </text>
          <text x="360" y="535" fill="#38bdf8" opacity="0.4" fontSize="10" fontWeight="bold" letterSpacing="2" textAnchor="middle">
            INDIAN OCEAN
          </text>

          {/* Interactive Historical Sites */}
          {historicalSites.map((site) => {
            const isMatchCurrent = site.era === currentEraId;

            return (
              <g
                key={site.id}
                className="cursor-pointer transition-transform hover:scale-125"
                transform={`translate(${site.x}, ${site.y})`}
                onClick={() => setSelectedSite(site)}
              >
                <circle
                  cx="0"
                  cy="0"
                  r={isMatchCurrent ? '7' : '5'}
                  fill={isMatchCurrent ? '#f59e0b' : '#a8a29e'}
                  stroke="#1c1917"
                  strokeWidth="1.5"
                  className={isMatchCurrent ? 'animate-pulse' : ''}
                />
                <circle cx="0" cy="0" r="2" fill="#ffffff" />
                <text
                  x="8"
                  y="4"
                  fill={isMatchCurrent ? '#fef3c7' : '#d6d3d1'}
                  fontSize="9"
                  fontWeight={isMatchCurrent ? 'bold' : 'normal'}
                >
                  {site.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Site Floating Inspector */}
        {selectedSite && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm bg-stone-950/95 border border-amber-600/70 rounded-xl p-3.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 text-xs">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="font-display font-bold text-sm text-amber-200">
                {selectedSite.name}
              </h4>
              <button
                onClick={() => setSelectedSite(null)}
                className="text-stone-400 hover:text-stone-100 p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-stone-300 leading-relaxed mb-2">
              {selectedSite.description}
            </p>
            <div className="p-2 bg-stone-900 rounded border border-stone-800 text-[11px] text-amber-400/90">
              📜 <strong>Evidence:</strong> {selectedSite.evidence}
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-stone-950 border-t border-amber-900/30 text-xs text-stone-400 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Active Era Archaeological Centre</span>
        </span>
        <span className="italic">
          Historical boundaries varied across millennia. Displayed sites reflect verified excavation records.
        </span>
      </div>
    </div>
  );
};
