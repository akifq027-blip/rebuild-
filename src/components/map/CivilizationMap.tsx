import React, { useState } from 'react';
import { BuildingSlot, BuildingItem } from '../../types/game';
import {
  Sparkles,
  MapPin,
  Waves,
  Trees,
  Sprout,
  Mountain,
  Home,
  Hammer,
  Package,
  Plus,
  Timer,
} from 'lucide-react';

interface CivilizationMapProps {
  slots: BuildingSlot[];
  buildings: BuildingItem[];
  onSelectSlot?: (slotId: number) => void;
  onGatherResource?: (type: 'wood' | 'stone' | 'food' | 'water') => void;
  nodeCooldowns: Record<string, number>; // timestamp until cooldown ends
}

interface TerrainZone {
  id: string;
  name: string;
  type: string;
  description: string;
  gatherType: 'wood' | 'stone' | 'food' | 'water';
  gatherLabel: string;
  gatherAmount: number;
}

export const CivilizationMap: React.FC<CivilizationMapProps> = ({
  slots = [],
  buildings = [],
  onSelectSlot,
  onGatherResource,
  nodeCooldowns,
}) => {
  const safeSlots = Array.isArray(slots) ? slots : [];
  const safeBuildings = Array.isArray(buildings) ? buildings : [];
  const [activeTerrain, setActiveTerrain] = useState<TerrainZone | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<{ slot: BuildingSlot; building?: BuildingItem } | null>(null);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [now, setNow] = useState(Date.now());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, []);

  const terrainZones: Record<string, TerrainZone> = {
    river: {
      id: 'river',
      name: 'Perennial River Basin',
      type: 'Waterway',
      description: 'Perennial river waters flowing steadily from distant mountains.',
      gatherType: 'water',
      gatherLabel: 'Collect Water',
      gatherAmount: 10,
    },
    farmland: {
      id: 'farmland',
      name: 'Alluvial Fields & Wild Crops',
      type: 'Agriculture',
      description: 'Fertile river silt where wild barley and roots grow abundantly.',
      gatherType: 'food',
      gatherLabel: 'Gather Food',
      gatherAmount: 10,
    },
    forest: {
      id: 'forest',
      name: 'Sacred Banyan & Sal Grove',
      type: 'Woodland',
      description: 'Dense woodland providing timber and reeds for shelter framing.',
      gatherType: 'wood',
      gatherLabel: 'Gather Wood',
      gatherAmount: 10,
    },
    rocks: {
      id: 'rocks',
      name: 'Stone Outcrop & River Quarry',
      type: 'Mineral Reserve',
      description: 'Weathered granite boulders and river gravel for hearth stones.',
      gatherType: 'stone',
      gatherLabel: 'Gather Stone',
      gatherAmount: 5,
    },
  };

  const getCooldownInfo = (nodeId: string) => {
    const cdEnd = nodeCooldowns[nodeId] || 0;
    const isCooling = cdEnd > now;
    const remainingSec = Math.max(1, Math.ceil((cdEnd - now) / 1000));
    return { isCooling, remainingSec };
  };

  const handleGatherFromZone = (zone: TerrainZone) => {
    const { isCooling } = getCooldownInfo(zone.id);
    if (!isCooling && onGatherResource) {
      onGatherResource(zone.gatherType);
    }
  };

  const handleInspectBuilding = (slot: BuildingSlot) => {
    if (slot.buildingId) {
      const b = buildings.find((item) => item.id === slot.buildingId);
      setSelectedBuilding({ slot, building: b });
    } else {
      onSelectSlot?.(slot.id);
    }
  };

  // Helper to render building graphics based on building ID in slot
  const renderSlotBuilding = (slot: BuildingSlot) => {
    if (!slot.buildingId) {
      return (
        <g
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => onSelectSlot?.(slot.id)}
        >
          <rect
            x={slot.x - 24}
            y={slot.y - 24}
            width="48"
            height="48"
            rx="8"
            fill="rgba(28, 25, 23, 0.6)"
            stroke="rgba(217, 119, 6, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <circle cx={slot.x} cy={slot.y} r="10" fill="#292524" />
          <path
            d={`M${slot.x - 5},${slot.y} L${slot.x + 5},${slot.y} M${slot.x},${slot.y - 5} L${slot.x},${slot.y + 5}`}
            stroke="#fbbf24"
            strokeWidth="1.5"
          />
          <text
            x={slot.x}
            y={slot.y + 20}
            textAnchor="middle"
            fill="#a8a29e"
            fontSize="7"
            fontWeight="bold"
          >
            SLOT {slot.id}
          </text>
        </g>
      );
    }

    switch (slot.buildingId) {
      case 'hut':
        return (
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => onSelectSlot?.(slot.id)}
          >
            <rect
              x={slot.x - 26}
              y={slot.y - 24}
              width="52"
              height="48"
              rx="8"
              fill="#1c1917"
              stroke="#d97706"
              strokeWidth="2"
            />
            {/* Thatched roof */}
            <path
              d={`M${slot.x - 18},${slot.y - 3} L${slot.x},${slot.y - 17} L${slot.x + 18},${slot.y - 3} Z`}
              fill="#92400e"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            {/* Mud-brick walls & door */}
            <rect x={slot.x - 14} y={slot.y - 3} width="28" height="17" fill="#78350f" />
            <rect x={slot.x - 4} y={slot.y + 3} width="8" height="11" fill="#1c1917" />
            <text x={slot.x} y={slot.y + 20} textAnchor="middle" fill="#fef3c7" fontSize="8" fontWeight="bold">
              HUT
            </text>
            <circle cx={slot.x + 20} cy={slot.y - 18} r="6" fill="#10b981" />
            <text x={slot.x + 20} y={slot.y - 15} textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">✓</text>
          </g>
        );

      case 'farm':
        return (
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => onSelectSlot?.(slot.id)}
          >
            <rect
              x={slot.x - 26}
              y={slot.y - 24}
              width="52"
              height="48"
              rx="8"
              fill="#1c1917"
              stroke="#f59e0b"
              strokeWidth="2"
            />
            {/* Crops furrows & barn */}
            <path
              d={`M${slot.x - 16},${slot.y + 6} L${slot.x + 16},${slot.y + 6} M${slot.x - 14},${slot.y} L${slot.x + 14},${slot.y}`}
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d={`M${slot.x - 10},${slot.y - 6} L${slot.x},${slot.y - 16} L${slot.x + 10},${slot.y - 6} Z`}
              fill="#b45309"
              stroke="#fbbf24"
              strokeWidth="1"
            />
            <text x={slot.x} y={slot.y + 20} textAnchor="middle" fill="#fef3c7" fontSize="8" fontWeight="bold">
              FARM
            </text>
            <circle cx={slot.x + 20} cy={slot.y - 18} r="6" fill="#10b981" />
            <text x={slot.x + 20} y={slot.y - 15} textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">✓</text>
          </g>
        );

      case 'well':
        return (
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => onSelectSlot?.(slot.id)}
          >
            <rect
              x={slot.x - 24}
              y={slot.y - 24}
              width="48"
              height="48"
              rx="8"
              fill="#1c1917"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <circle cx={slot.x} cy={slot.y - 3} r="12" fill="#075985" stroke="#38bdf8" strokeWidth="2" />
            <circle cx={slot.x} cy={slot.y - 3} r="7" fill="#0284c7" />
            <path
              d={`M${slot.x - 8},${slot.y - 12} L${slot.x - 8},${slot.y - 4} M${slot.x + 8},${slot.y - 12} L${slot.x + 8},${slot.y - 4} M${slot.x - 10},${slot.y - 12} L${slot.x + 10},${slot.y - 12}`}
              stroke="#e2e8f0"
              strokeWidth="1.5"
            />
            <text x={slot.x} y={slot.y + 20} textAnchor="middle" fill="#e0f2fe" fontSize="8" fontWeight="bold">
              WELL
            </text>
            <circle cx={slot.x + 18} cy={slot.y - 18} r="6" fill="#10b981" />
            <text x={slot.x + 18} y={slot.y - 15} textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">✓</text>
          </g>
        );

      case 'storage':
        return (
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => onSelectSlot?.(slot.id)}
          >
            <rect
              x={slot.x - 26}
              y={slot.y - 24}
              width="52"
              height="48"
              rx="8"
              fill="#1c1917"
              stroke="#d97706"
              strokeWidth="2"
            />
            <rect x={slot.x - 14} y={slot.y - 4} width="28" height="13" fill="#78350f" stroke="#b45309" strokeWidth="1.5" />
            <path
              d={`M${slot.x - 18},${slot.y - 4} L${slot.x},${slot.y - 15} L${slot.x + 18},${slot.y - 4} Z`}
              fill="#92400e"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            <line x1={slot.x - 10} y1={slot.y + 9} x2={slot.x - 10} y2={slot.y + 13} stroke="#d97706" strokeWidth="2" />
            <line x1={slot.x + 10} y1={slot.y + 9} x2={slot.x + 10} y2={slot.y + 13} stroke="#d97706" strokeWidth="2" />
            <text x={slot.x} y={slot.y + 20} textAnchor="middle" fill="#fef3c7" fontSize="8" fontWeight="bold">
              STORAGE
            </text>
            <circle cx={slot.x + 20} cy={slot.y - 18} r="6" fill="#10b981" />
            <text x={slot.x + 20} y={slot.y - 15} textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">✓</text>
          </g>
        );

      case 'workshop':
        return (
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => onSelectSlot?.(slot.id)}
          >
            <rect
              x={slot.x - 26}
              y={slot.y - 24}
              width="52"
              height="48"
              rx="8"
              fill="#1c1917"
              stroke="#fbbf24"
              strokeWidth="2"
            />
            {/* Workshop anvil & tools */}
            <path
              d={`M${slot.x - 14},${slot.y + 3} L${slot.x + 14},${slot.y + 3} L${slot.x + 9},${slot.y - 5} L${slot.x - 9},${slot.y - 5} Z`}
              fill="#57534e"
              stroke="#a8a29e"
              strokeWidth="1.5"
            />
            <line x1={slot.x - 4} y1={slot.y - 13} x2={slot.x + 6} y2={slot.y - 5} stroke="#f59e0b" strokeWidth="2" />
            <text x={slot.x} y={slot.y + 20} textAnchor="middle" fill="#fef3c7" fontSize="7" fontWeight="bold">
              WORKSHOP
            </text>
            <circle cx={slot.x + 20} cy={slot.y - 18} r="6" fill="#10b981" />
            <text x={slot.x + 20} y={slot.y - 15} textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">✓</text>
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-stone-900/90 border border-amber-900/40 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Top Map Bar with Gathering Action Quick Buttons */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-stone-950/90 border-b border-amber-900/30 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="font-display font-bold text-sm sm:text-base text-amber-200 tracking-wide">
            CIVILIZATION MAP — INTERACTIVE HARVEST BASIN
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-400 hidden sm:inline-block">Click nodes to gather:</span>
          {/* Quick gather triggers */}
          <button
            onClick={() => handleGatherFromZone(terrainZones.forest)}
            disabled={getCooldownInfo('forest').isCooling}
            className="flex items-center gap-1 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-emerald-300 border border-emerald-800/60 px-2 py-1 rounded cursor-pointer"
          >
            <Trees className="w-3.5 h-3.5" />
            <span>+10 Wood</span>
          </button>
          <button
            onClick={() => handleGatherFromZone(terrainZones.rocks)}
            disabled={getCooldownInfo('rocks').isCooling}
            className="flex items-center gap-1 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-stone-300 border border-stone-700 px-2 py-1 rounded cursor-pointer"
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>+5 Stone</span>
          </button>
          <button
            onClick={() => handleGatherFromZone(terrainZones.farmland)}
            disabled={getCooldownInfo('farmland').isCooling}
            className="flex items-center gap-1 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-amber-300 border border-amber-800/60 px-2 py-1 rounded cursor-pointer"
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>+10 Food</span>
          </button>
          <button
            onClick={() => handleGatherFromZone(terrainZones.river)}
            disabled={getCooldownInfo('river').isCooling}
            className="flex items-center gap-1 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-sky-300 border border-sky-800/60 px-2 py-1 rounded cursor-pointer"
          >
            <Waves className="w-3.5 h-3.5" />
            <span>+10 Water</span>
          </button>
        </div>
      </div>

      {/* 2D Interactive SVG & Map Canvas */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[580px] bg-gradient-to-b from-stone-950 via-[#1c1815] to-[#12100e] overflow-hidden select-none">
        <svg
          viewBox="0 0 900 520"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2c241c" />
              <stop offset="40%" stopColor="#221b14" />
              <stop offset="100%" stopColor="#18130e" />
            </linearGradient>

            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#075985" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <linearGradient id="farmlandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#45311c" />
              <stop offset="100%" stopColor="#352414" />
            </linearGradient>

            <linearGradient id="forestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#143422" />
              <stop offset="100%" stopColor="#0e2317" />
            </linearGradient>

            <linearGradient id="rockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#44403c" />
              <stop offset="100%" stopColor="#292524" />
            </linearGradient>
          </defs>

          {/* Base Ground */}
          <rect width="900" height="520" fill="url(#groundGrad)" />

          {/* Topographic Contour Lines */}
          <g stroke="rgba(217, 119, 6, 0.08)" strokeWidth="1" fill="none">
            <ellipse cx="200" cy="140" rx="160" ry="90" />
            <ellipse cx="750" cy="380" rx="170" ry="110" />
            <ellipse cx="450" cy="270" rx="350" ry="190" strokeDasharray="6 6" />
          </g>

          {/* ==================== 1. FOREST GROVE (Wood node) ==================== */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => setActiveTerrain(terrainZones.forest)}
          >
            <path
              d="M-20,-20 L320,-20 Q280,120 180,190 Q90,240 -20,200 Z"
              fill="url(#forestGrad)"
              stroke="rgba(16, 185, 129, 0.2)"
              strokeWidth="1.5"
            />
            <g fill="#1b4d32" stroke="#0f2e1e" strokeWidth="1.5">
              <circle cx="50" cy="60" r="34" />
              <circle cx="95" cy="45" r="28" />
              <circle cx="135" cy="70" r="32" />
              <circle cx="80" cy="95" r="36" />
              <circle cx="40" cy="120" r="26" />
              <circle cx="105" cy="135" r="30" />
              <circle cx="160" cy="115" r="25" />
              <circle cx="210" cy="60" r="28" />
              <circle cx="235" cy="110" r="22" />
              <circle cx="140" cy="165" r="20" />
            </g>
            <g transform="translate(60, 160)">
              <rect x="0" y="0" width="110" height="24" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
              <text x="55" y="16" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="bold">
                🌲 GATHER WOOD (+10)
              </text>
            </g>
          </g>

          {/* ==================== 2. RIVER WATERWAY (Water node) ==================== */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-95"
            onClick={() => setActiveTerrain(terrainZones.river)}
          >
            <path
              d="M740,-30 C690,110 580,180 500,240 C410,310 320,360 210,540 L120,540 C240,360 340,300 430,220 C520,150 630,70 660,-30 Z"
              fill="#26382c"
              opacity="0.4"
            />
            <path
              d="M720,-20 C680,100 570,175 490,235 C400,305 310,355 200,530 L150,530 C260,355 350,295 440,225 C530,155 640,80 670,-20 Z"
              fill="url(#riverGrad)"
              stroke="rgba(56, 189, 248, 0.4)"
              strokeWidth="2"
            />
            <path d="M660,40 Q630,90 560,140" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" strokeDasharray="12 8" />
            <path d="M510,210 Q460,250 410,290" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" strokeDasharray="10 6" />
            <path d="M340,345 Q280,390 230,460" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" strokeDasharray="14 10" />

            <g transform="translate(560, 150) rotate(-30)">
              <rect x="0" y="0" width="120" height="22" rx="6" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1" />
              <text x="60" y="15" textAnchor="middle" fill="#bae6fd" fontSize="9" fontWeight="bold">
                💧 COLLECT WATER (+10)
              </text>
            </g>
          </g>

          {/* ==================== 3. FARMLAND (Food node) ==================== */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-95"
            onClick={() => setActiveTerrain(terrainZones.farmland)}
          >
            <path d="M480,20 L660,20 L600,140 L450,110 Z" fill="url(#farmlandGrad)" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="1.5" />
            <path d="M340,50 L460,35 L440,115 L320,120 Z" fill="url(#farmlandGrad)" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="1.5" />
            <g stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1.5">
              <line x1="490" y1="35" x2="640" y2="35" />
              <line x1="480" y1="55" x2="625" y2="55" />
              <line x1="470" y1="75" x2="610" y2="75" />
              <line x1="460" y1="95" x2="590" y2="95" />
            </g>
            <g transform="translate(340, 25)">
              <rect x="0" y="0" width="115" height="22" rx="6" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
              <text x="57" y="15" textAnchor="middle" fill="#fef3c7" fontSize="9" fontWeight="bold">
                🌾 GATHER FOOD (+10)
              </text>
            </g>
          </g>

          {/* ==================== 4. STONE RIDGE (Stone node) ==================== */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-95"
            onClick={() => setActiveTerrain(terrainZones.rocks)}
          >
            <path
              d="M720,240 Q840,210 920,260 L920,530 L660,530 Q700,430 680,350 Q660,290 720,240 Z"
              fill="url(#rockGrad)"
              stroke="rgba(168, 162, 158, 0.25)"
              strokeWidth="1.5"
            />
            <g fill="#57534e" stroke="#292524" strokeWidth="1.5">
              <polygon points="760,290 810,260 840,300 780,320" />
              <polygon points="700,380 750,340 770,390 720,410" />
              <polygon points="810,380 870,350 890,410 830,425" />
              <polygon points="750,450 810,420 830,480 770,490" />
            </g>
            <g transform="translate(740, 260)">
              <rect x="0" y="0" width="115" height="22" rx="6" fill="#292524" stroke="#a8a29e" strokeWidth="1" />
              <text x="57" y="15" textAnchor="middle" fill="#f5f5f4" fontSize="9" fontWeight="bold">
                🪨 GATHER STONE (+5)
              </text>
            </g>
          </g>

          {/* ==================== 5. CENTRAL SETTLEMENT GROUNDS ==================== */}
          <ellipse
            cx="440"
            cy="340"
            rx="210"
            ry="130"
            fill="#261e16"
            stroke="rgba(217, 119, 6, 0.35)"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
          {/* Paths connecting slots */}
          <path
            d="M440,340 L260,240 M440,340 L480,70 M440,340 L415,380 M440,340 L560,240 M440,340 L350,280 M440,340 L500,320 M440,340 L200,320 M440,340 L420,220"
            stroke="rgba(217, 119, 6, 0.2)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Central Fire Hearth */}
          <circle cx="440" cy="340" r="14" fill="#451a03" stroke="#f97316" strokeWidth="1.5" />
          <circle cx="440" cy="340" r="6" fill="#fbbf24" className="animate-ping" opacity="0.6" />
          <circle cx="440" cy="340" r="5" fill="#f59e0b" />

          {/* ==================== DYNAMIC BUILDING SLOTS ==================== */}
          {safeSlots.map((slot) => (
            <g key={slot.id}>{renderSlotBuilding(slot)}</g>
          ))}
        </svg>

        {/* Map Legend Overlay Widget */}
        <div className="absolute top-3 left-3 z-30">
          <button
            type="button"
            onClick={() => setIsLegendOpen((prev) => !prev)}
            className="px-2.5 py-1 bg-stone-900/90 hover:bg-stone-850 text-amber-300 text-[11px] font-bold rounded-lg border border-amber-800/50 shadow-md flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
          >
            <span>🗺️ Map Legend</span>
            <span className="text-[10px] text-stone-400">{isLegendOpen ? '▴' : '▾'}</span>
          </button>

          {isLegendOpen && (
            <div className="mt-1.5 p-3 bg-stone-950/95 border border-amber-900/50 rounded-xl shadow-xl backdrop-blur-md text-[11px] text-stone-300 space-y-1.5 animate-in fade-in duration-150 min-w-44">
              <div className="flex items-center gap-2">
                <span>🏠</span>
                <span>Settlement Slots (1–8)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🌾</span>
                <span>Alluvial Farmland (Food)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🌲</span>
                <span>Sacred Grove (Wood)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🪨</span>
                <span>Quarry Ridge (Stone/Metal)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💧</span>
                <span>Perennial River (Water)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔥</span>
                <span>Communal Hearth (Hearthfire)</span>
              </div>
            </div>
          )}
        </div>

        {/* Building Inspector Dialog */}
        {selectedBuilding && selectedBuilding.building && (
          <div className="absolute bottom-3 right-3 left-3 sm:left-auto sm:max-w-sm bg-stone-950/95 border border-amber-600/70 rounded-xl p-4 shadow-2xl backdrop-blur-md z-30 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-amber-400" />
                <h4 className="font-display font-bold text-sm text-amber-200">
                  {selectedBuilding.building.name} (Slot {selectedBuilding.slot.id})
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBuilding(null)}
                className="text-stone-400 hover:text-stone-100 text-xs px-1.5 py-0.5 rounded hover:bg-stone-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-300 mb-2 leading-relaxed">
              {selectedBuilding.building.shortDescription}
            </p>

            <div className="bg-stone-900/80 p-2 rounded-lg border border-stone-800 text-[11px] space-y-1 mb-3">
              <div className="flex justify-between">
                <span className="text-stone-400">Total Erected:</span>
                <span className="font-bold text-amber-300">{selectedBuilding.building.currentCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Civil Function:</span>
                <span className="text-stone-200">{selectedBuilding.building.productionEffect?.label || 'Shelter & Community'}</span>
              </div>
            </div>

            <p className="text-[10px] text-amber-400/90 italic border-t border-stone-850 pt-2">
              Historical Context: Mud-brick construction with standard proportioned sun-dried bricks rooted in Mehrgarh and Harappan architectural tradition.
            </p>
          </div>
        )}

        {/* Terrain Node Inspection / Action Dialog */}
        {activeTerrain && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md bg-stone-950/95 border border-amber-600/70 rounded-xl p-4 shadow-2xl backdrop-blur-md z-30 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <h4 className="font-display font-bold text-sm text-amber-200">
                  {activeTerrain.name}
                </h4>
              </div>
              <button
                onClick={() => setActiveTerrain(null)}
                className="text-stone-400 hover:text-stone-100 text-xs px-1.5 py-0.5 rounded hover:bg-stone-800"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-stone-300 mb-3 leading-relaxed">
              {activeTerrain.description}
            </p>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-800">
              <div className="text-xs text-stone-400">
                {getCooldownInfo(activeTerrain.id).isCooling ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5 animate-spin" />
                    Recovering ({getCooldownInfo(activeTerrain.id).remainingSec}s)
                  </span>
                ) : (
                  <span className="text-emerald-400">Available to harvest</span>
                )}
              </div>

              <button
                onClick={() => handleGatherFromZone(activeTerrain)}
                disabled={getCooldownInfo(activeTerrain.id).isCooling}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                  !getCooldownInfo(activeTerrain.id).isCooling
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 active:scale-98'
                    : 'bg-stone-800 text-stone-400 cursor-not-allowed border border-stone-700'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {activeTerrain.gatherLabel} (+{activeTerrain.gatherAmount})
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
