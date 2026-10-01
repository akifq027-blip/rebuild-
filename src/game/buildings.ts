import { BuildingItem, BuildingSlot } from '../types/game';

export const INITIAL_BUILDINGS: BuildingItem[] = [
  {
    id: 'hut',
    name: 'HUT',
    iconName: 'Home',
    shortDescription: 'Provides shelter for the community.',
    status: 'AVAILABLE',
    category: 'shelter',
    cost: {
      wood: 20,
      stone: 5,
    },
    populationEffect: 2,
    historicalSignificance:
      'Early dwellings utilized wattle-and-daub, sun-dried clay, and woven thatch to protect families from seasonal monsoons.',
    currentCount: 1, // Starts with 1 initial hut
  },
  {
    id: 'farm',
    name: 'FARM',
    iconName: 'Sprout',
    shortDescription: 'Produces grain and sustains population.',
    status: 'LOCKED',
    category: 'production',
    cost: {
      wood: 15,
      stone: 5,
    },
    populationEffect: 0,
    productionEffect: {
      resource: 'food',
      amount: 5,
      label: '+5 Food production',
    },
    requiredTech: 'agriculture',
    historicalSignificance:
      'Domestication of barley and wheat along alluvial floodplains formed the agricultural bedrock of early Indian river civilizations.',
    currentCount: 0,
  },
  {
    id: 'well',
    name: 'WELL',
    iconName: 'CircleDot',
    shortDescription: 'Improves access to clean water.',
    status: 'LOCKED',
    category: 'utility',
    cost: {
      stone: 20,
      wood: 5,
    },
    populationEffect: 0,
    productionEffect: {
      resource: 'water',
      amount: 5,
      label: '+5 Water production',
    },
    requiredTech: 'water_management',
    historicalSignificance:
      'Brick-lined wells and hydraulic planning represented an extraordinary leap in public hygiene and communal stability.',
    currentCount: 0,
  },
  {
    id: 'storage',
    name: 'STORAGE',
    iconName: 'Archive',
    shortDescription: 'Stores resources and safeguards harvests.',
    status: 'LOCKED',
    category: 'storage',
    cost: {
      wood: 25,
      stone: 15,
    },
    populationEffect: 0,
    requiredTech: 'pottery',
    historicalSignificance:
      'Elevated granaries protected seed stocks from moisture and pests, enabling communities to survive lean seasons.',
    currentCount: 0,
  },
  {
    id: 'workshop',
    name: 'WORKSHOP',
    iconName: 'Hammer',
    shortDescription: 'Allows basic technological development.',
    status: 'LOCKED',
    category: 'workshop',
    cost: {
      wood: 30,
      stone: 20,
    },
    populationEffect: 0,
    productionEffect: {
      resource: 'knowledge',
      amount: 2,
      label: '+2 Knowledge production',
    },
    requiredTech: 'tools',
    historicalSignificance:
      'Specialized craft quarters knapped flint blades, bored carnelian beads, and passed down apprentice craft secrets.',
    currentCount: 0,
  },
];

export const INITIAL_BUILDING_SLOTS: BuildingSlot[] = [
  {
    id: 1,
    name: 'West Hearth Plot',
    buildingId: 'hut', // Starts with first Hut
    x: 260,
    y: 240,
  },
  {
    id: 2,
    name: 'Alluvial Field Plot',
    buildingId: null,
    x: 480,
    y: 70,
  },
  {
    id: 3,
    name: 'Riverbank Well Site',
    buildingId: null,
    x: 415,
    y: 380,
  },
  {
    id: 4,
    name: 'East Granary Platform',
    buildingId: null,
    x: 560,
    y: 240,
  },
  {
    id: 5,
    name: 'Central Craft Square',
    buildingId: null,
    x: 350,
    y: 280,
  },
  {
    id: 6,
    name: 'South Living Quarter',
    buildingId: null,
    x: 500,
    y: 320,
  },
  {
    id: 7,
    name: 'Lower River Terrace',
    buildingId: null,
    x: 200,
    y: 320,
  },
  {
    id: 8,
    name: 'North-East Clearing',
    buildingId: null,
    x: 420,
    y: 220,
  },
];

/**
 * Checks whether a building is unlocked based on researched technologies
 */
export function isBuildingUnlocked(
  building: BuildingItem,
  unlockedTechIds: Set<string>
): boolean {
  if (!building.requiredTech) {
    return true;
  }
  return unlockedTechIds.has(building.requiredTech);
}
