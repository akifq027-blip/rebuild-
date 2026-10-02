/**
 * BHARAT — Build the Civilization
 * Core Game Constants, Resource Metadata & Starter Layout
 */

import {
  CoreResourceKey,
  ResourceItemInfo,
  BuildingPlot,
  CivilizationOverview,
} from '../types/civilization';

export const CORE_RESOURCES_INFO: Record<CoreResourceKey, ResourceItemInfo> = {
  food: {
    id: 'food',
    name: 'Food',
    sanskritName: 'Dhanya',
    iconName: 'Wheat',
    color: '#eab308', // Warm Amber Gold
    description: 'Grain, barley, pulses, and river produce.',
    strategicPurpose: 'Sustains growing community and trains military units.',
  },
  wood: {
    id: 'wood',
    name: 'Wood',
    sanskritName: 'Kashta',
    iconName: 'Trees',
    color: '#d97706', // Warm Rich Timber
    description: 'Seasoned Sal, Teak, and Acacia timber from river groves.',
    strategicPurpose: 'Primary framing for all structures and toolmaking.',
  },
  stone: {
    id: 'stone',
    name: 'Stone',
    sanskritName: 'Shila',
    iconName: 'Gem',
    color: '#94a3b8', // Granite Slate
    description: 'Hewn sandstone, granite blocks, and river cobbles.',
    strategicPurpose: 'Foundations, citadels, defensive walls, and water tanks.',
  },
  clay: {
    id: 'clay',
    name: 'Clay',
    sanskritName: 'Mrittika',
    iconName: 'Flame',
    color: '#f97316', // Terracotta Orange
    description: 'Alluvial river silt and sun-dried/kiln-fired terracotta.',
    strategicPurpose: 'Standardized 1:2:4 bricks, kiln pottery, and granary urns.',
  },
  knowledge: {
    id: 'knowledge',
    name: 'Knowledge',
    sanskritName: 'Vidya',
    iconName: 'BookOpen',
    color: '#38bdf8', // Scribe Sky Blue
    description: 'Scribe observations, astronomical alignments, and craft mastery.',
    strategicPurpose: 'Researches technologies, unlocks military tiers, and decodes discoveries.',
  },
};

export const INITIAL_CIVILIZATION_OVERVIEW: CivilizationOverview = {
  name: 'Saraswati Realm',
  motto: 'From the Alluvium to the Citadel',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  population: 5,
  populationCapacity: 12,
  maxStorage: 400,
  militaryPower: 10,
  foundedAt: 'Dawn of River Settlements',
};

export const INITIAL_RESOURCES: Record<CoreResourceKey, number> = {
  food: 150,
  wood: 120,
  stone: 80,
  clay: 90,
  knowledge: 25,
};

/**
 * 12 Fixed Spatial Plots on the Civilization Landscape Map
 * Centered around the grand administrative terrace and riverine irrigation.
 */
export const INITIAL_BUILDING_PLOTS: BuildingPlot[] = [
  // 1. Central Citadel Plot (Civilization Center already established)
  {
    id: 1,
    name: 'Grand Citadel Terrace',
    gridX: 4,
    gridY: 3,
    size: { width: 2, height: 2 },
    buildingId: 'civ_center',
    level: 1,
    lastCollectedAt: Date.now(),
    storedYield: 0,
  },
  // 2. North-West Harvest Quarter
  {
    id: 2,
    name: 'North-West Grove Plot',
    gridX: 2,
    gridY: 2,
    size: { width: 1, height: 1 },
    buildingId: 'timber_yard',
    level: 1,
    lastCollectedAt: Date.now(),
    storedYield: 0,
  },
  // 3. North River Terrace
  {
    id: 3,
    name: 'Alluvial Riverbank Plot',
    gridX: 6,
    gridY: 2,
    size: { width: 1, height: 1 },
    buildingId: 'clay_workshop',
    level: 1,
    lastCollectedAt: Date.now(),
    storedYield: 0,
  },
  // 4. Central Granary Terrace
  {
    id: 4,
    name: 'East Granary Mound',
    gridX: 7,
    gridY: 4,
    size: { width: 1, height: 1 },
    buildingId: 'granary',
    level: 1,
    lastCollectedAt: Date.now(),
    storedYield: 0,
  },
  // 5. South-East Craft Quarter
  {
    id: 5,
    name: 'South-East Quarry Plot',
    gridX: 6,
    gridY: 6,
    size: { width: 1, height: 1 },
    buildingId: null, // Empty for player construction
    level: 1,
  },
  // 6. South Training Ground Plot
  {
    id: 6,
    name: 'South Akhada Grounds',
    gridX: 4,
    gridY: 6,
    size: { width: 1, height: 1 },
    buildingId: null, // Empty for player construction
    level: 1,
  },
  // 7. South-West Scholar Glade
  {
    id: 7,
    name: 'Scholar Glade Plot',
    gridX: 2,
    gridY: 5,
    size: { width: 1, height: 1 },
    buildingId: null,
    level: 1,
  },
  // 8. West Water Stepwell Plot
  {
    id: 8,
    name: 'West Silt Basin Plot',
    gridX: 1,
    gridY: 3,
    size: { width: 1, height: 1 },
    buildingId: null,
    level: 1,
  },
  // 9. North-East Craft Pavilion
  {
    id: 9,
    name: 'North-East Artisan Plot',
    gridX: 8,
    gridY: 2,
    size: { width: 1, height: 1 },
    buildingId: null,
    level: 1,
  },
  // 10. East Caravan Square
  {
    id: 10,
    name: 'East Trade Way Plot',
    gridX: 8,
    gridY: 5,
    size: { width: 1, height: 1 },
    buildingId: null,
    level: 1,
  },
  // 11. South-West Rampart Plot
  {
    id: 11,
    name: 'South-West Bastion Plot',
    gridX: 1,
    gridY: 6,
    size: { width: 1, height: 1 },
    buildingId: null,
    level: 1,
  },
  // 12. Central Market Plaza
  {
    id: 12,
    name: 'Central Assembly Plot',
    gridX: 4,
    gridY: 1,
    size: { width: 1, height: 1 },
    buildingId: null,
    level: 1,
  },
];
