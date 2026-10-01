import { ExplorationLocation, DiscoveryItem } from '../types/game';

export const INITIAL_EXPLORATION_LOCATIONS: ExplorationLocation[] = [
  {
    id: 'river',
    name: 'Saraswati River Delta Tributary',
    description: 'Follow the gentle bends of the river to chart seasonal flood marks and aquatic flora.',
    rewards: {
      water: 10,
      knowledge: 5,
    },
    possibleDiscoveryId: 'disc_river_flow',
    cooldownSeconds: 3,
  },
  {
    id: 'forest',
    name: 'Dense Banyan & Sal Foothills',
    description: 'Forage through ancient canopy trails for seasoned timber, medicinal roots, and game tracks.',
    rewards: {
      wood: 15,
      knowledge: 5,
    },
    possibleDiscoveryId: 'disc_timber_joinery',
    cooldownSeconds: 3,
  },
  {
    id: 'hills',
    name: 'Granite Ridges & Mineral Hills',
    description: 'Prospect the rocky terrace slopes where exposed veins of quartzite and raw ores glimmer.',
    rewards: {
      stone: 10,
      metal: 5,
      knowledge: 5,
    },
    possibleDiscoveryId: 'disc_copper_traces',
    cooldownSeconds: 4,
  },
  {
    id: 'ancient_site',
    name: 'Ancestral Mound & Megaliths',
    description: 'Investigate weathered stone circles and ancient hearth pits left by prior nomadic clans.',
    rewards: {
      knowledge: 10,
      culture: 5,
    },
    possibleDiscoveryId: 'disc_ancient_markings',
    cooldownSeconds: 4,
  },
];

export const INITIAL_DISCOVERIES: DiscoveryItem[] = [
  {
    id: 'disc_river_flow',
    title: 'Hydraulic River Observations',
    description: 'Your scouts noted that seasonal monsoon silt enriches the riverbank soil, inspiring early water retention bunds.',
    rewardKnowledge: 10,
    rewardCulture: 5,
    discovered: false,
  },
  {
    id: 'disc_timber_joinery',
    title: 'Notched Timber Joinery',
    description: 'Woodworkers discovered how interlocking notches allow sturdier thatched roof framing without iron nails.',
    rewardKnowledge: 10,
    rewardCulture: 5,
    discovered: false,
  },
  {
    id: 'disc_copper_traces',
    title: 'Native Copper Vein Outcrop',
    description: 'Prospectors discovered malleable green-tinged stone in the rocky foothills that can be cold-hammered.',
    rewardKnowledge: 15,
    rewardCulture: 10,
    discovered: false,
  },
  {
    id: 'disc_ancient_markings',
    title: 'Incised Pottery Markings',
    description: 'Fragments of fired terracotta showing geometric fish and tree symbols, an early precursor to proto-script.',
    rewardKnowledge: 15,
    rewardCulture: 15,
    discovered: false,
  },
];
