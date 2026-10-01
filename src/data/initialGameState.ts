import { GameState, ResourceItem } from '../types/game';
import { INITIAL_BUILDINGS, INITIAL_BUILDING_SLOTS } from '../game/buildings';
import { INITIAL_TECHNOLOGIES } from '../game/technologies';
import { INITIAL_MISSIONS } from '../game/missions';
import { INITIAL_DISCOVERIES } from '../game/exploration';
import { INITIAL_ACHIEVEMENTS } from './achievementsData';
import { HISTORICAL_ERAS, HISTORICAL_ARTIFACTS } from './historicalData';

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'food',
    name: 'Food',
    value: 120,
    iconName: 'Wheat',
    category: 'sustenance',
    description: 'Grain, wild roots, and pulses harvested from the fertile soils.',
  },
  {
    id: 'water',
    name: 'Water',
    value: 80,
    iconName: 'Droplets',
    category: 'sustenance',
    description: 'Fresh water drawn from the perennial river and natural aquifers.',
  },
  {
    id: 'wood',
    name: 'Wood',
    value: 60,
    iconName: 'Trees',
    category: 'materials',
    description: 'Timber and reeds gathered from dense riverine forests for framing.',
  },
  {
    id: 'stone',
    name: 'Stone',
    value: 40,
    iconName: 'Gem',
    category: 'materials',
    description: 'River pebbles and quarry rock shaped for foundations and hearths.',
  },
  {
    id: 'metal',
    name: 'Metal',
    value: 10,
    iconName: 'Hammer',
    category: 'materials',
    description: 'Early copper and bronze nuggets discovered along gravel beds.',
  },
  {
    id: 'knowledge',
    name: 'Knowledge',
    value: 10,
    iconName: 'Scroll',
    category: 'development',
    description: 'Observations of seasons, seeds, star navigation, and craftsmanship.',
  },
  {
    id: 'culture',
    name: 'Culture',
    value: 5,
    iconName: 'Sparkles',
    category: 'development',
    description: 'Community traditions, pottery motifs, and communal gatherings.',
  },
  {
    id: 'trade',
    name: 'Trade',
    value: 0,
    iconName: 'Coins',
    category: 'development',
    description: 'Barter exchange established with traveling clans and foragers.',
  },
];

export const INITIAL_GAME_STATE: GameState = {
  player: {
    name: 'Explorer',
  },
  civilization: {
    name: 'My Bharat',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    population: 5,
    populationCapacity: 5,
    maxStorage: 500,
  },
  era: {
    id: 1,
    name: 'EARLY SETTLEMENTS',
    shortDescription:
      'The journey begins with a small community learning how to survive, settle, cultivate resources and build a shared future.',
    historicalContext:
      'Transition from foraging groups to settled agrarian hamlets in river basins, marking the birth of collective civilization.',
  },
  resources: {
    food: 120,
    water: 80,
    wood: 60,
    stone: 40,
    metal: 10,
    knowledge: 10,
    culture: 5,
    trade: 0,
  },
  resourceList: INITIAL_RESOURCES,
  buildings: INITIAL_BUILDINGS,
  buildingSlots: INITIAL_BUILDING_SLOTS,
  technologies: INITIAL_TECHNOLOGIES,
  missions: INITIAL_MISSIONS,
  discoveries: INITIAL_DISCOVERIES,
  currentObjective: {
    title: 'Gather Wood for Settlement',
    description: 'Gather 30 timber from the sacred riverine grove to supply construction needs.',
    progress: 0,
    target: 30,
  },
  storedProduction: {
    food: 0,
    water: 0,
    knowledge: 0,
  },
  gatheredTotals: {
    wood: 0,
    stone: 0,
    food: 0,
    water: 0,
  },
  // Part 3 Historical Data
  activeEraId: 'early_settlements',
  historicalEras: HISTORICAL_ERAS,
  artifacts: HISTORICAL_ARTIFACTS,
  journalEntries: [
    {
      id: 'entry_init',
      timestamp: 'Dawn of Settlement',
      eraTitle: 'Early Settlements',
      title: 'Settlement Founded in the River Basin',
      detail: 'Our community has cleared communal ground along the fertile alluvium, lighting the first hearth and observing wild grain patterns.',
      type: 'era',
    },
  ],
  completedChallengeIds: [],
  achievements: INITIAL_ACHIEVEMENTS,
  isDemoMode: false,
};
