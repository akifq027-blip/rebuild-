import { MissionItem, GameState } from '../types/game';

export const INITIAL_MISSIONS: MissionItem[] = [
  {
    id: 'm1_gather_wood',
    title: 'Gather Wood for Settlement',
    description: 'Gather 30 timber from the sacred riverine grove to supply construction needs.',
    type: 'gather_wood',
    target: 30,
    progress: 0,
    rewardText: '+10 Knowledge, +25 XP',
    rewardResource: {
      resource: 'knowledge',
      amount: 10,
    },
    rewardXp: 25,
    completed: false,
    claimed: false,
  },
  {
    id: 'm2_build_hut',
    title: 'Expand Living Shelters',
    description: 'Construct an additional Hut to house expanding tribal families.',
    type: 'build_hut',
    target: 2, // starts with 1 hut, building 1 more makes 2
    progress: 1,
    rewardText: '+10 Food, +30 XP',
    rewardResource: {
      resource: 'food',
      amount: 10,
    },
    rewardXp: 30,
    completed: false,
    claimed: false,
  },
  {
    id: 'm3_unlock_agri',
    title: 'Master Agriculture',
    description: 'Research the Agriculture technology to cultivate steady grain crops.',
    type: 'tech_agriculture',
    target: 1,
    progress: 0,
    rewardText: '+25 Culture, +50 XP',
    rewardResource: {
      resource: 'culture',
      amount: 25,
    },
    rewardXp: 50,
    completed: false,
    claimed: false,
  },
  {
    id: 'm4_build_farm',
    title: 'Cultivate First Farmland',
    description: 'Build your first Farm on the fertile alluvium to provide regular food production.',
    type: 'build_farm',
    target: 1,
    progress: 0,
    rewardText: '+15 Knowledge, +35 XP',
    rewardResource: {
      resource: 'knowledge',
      amount: 15,
    },
    rewardXp: 35,
    completed: false,
    claimed: false,
  },
  {
    id: 'm5_grow_pop',
    title: 'Grow the Community',
    description: 'Welcome new foragers and families to expand the settlement population to 8.',
    type: 'population',
    target: 8,
    progress: 5, // starts at 5
    rewardText: '+20 Knowledge, +45 XP',
    rewardResource: {
      resource: 'knowledge',
      amount: 20,
    },
    rewardXp: 45,
    completed: false,
    claimed: false,
  },
  {
    id: 'm6_build_well',
    title: 'Channel Perennial Water',
    description: 'Research Water Management and construct a brick Well for the community.',
    type: 'build_well',
    target: 1,
    progress: 0,
    rewardText: '+15 Culture, +40 XP',
    rewardResource: {
      resource: 'culture',
      amount: 15,
    },
    rewardXp: 40,
    completed: false,
    claimed: false,
  },
  {
    id: 'm7_build_workshop',
    title: 'Establish Craft Workshop',
    description: 'Research Shaped Stone Tools and construct a dedicated artisan Workshop.',
    type: 'build_workshop',
    target: 1,
    progress: 0,
    rewardText: '+30 Knowledge, +60 XP',
    rewardResource: {
      resource: 'knowledge',
      amount: 30,
    },
    rewardXp: 60,
    completed: false,
    claimed: false,
  },
];

/**
 * Updates mission progress dynamically from current game state
 */
export function evaluateMissions(
  missions: MissionItem[],
  state: {
    gatheredWoodTotal: number;
    hutCount: number;
    farmCount: number;
    wellCount: number;
    workshopCount: number;
    population: number;
    unlockedTechIds: Set<string>;
  }
): MissionItem[] {
  return missions.map((mission) => {
    let currentProgress = mission.progress;

    switch (mission.type) {
      case 'gather_wood':
        currentProgress = Math.min(mission.target, state.gatheredWoodTotal);
        break;
      case 'build_hut':
        currentProgress = Math.min(mission.target, state.hutCount);
        break;
      case 'build_farm':
        currentProgress = Math.min(mission.target, state.farmCount);
        break;
      case 'build_well':
        currentProgress = Math.min(mission.target, state.wellCount);
        break;
      case 'population':
        currentProgress = Math.min(mission.target, state.population);
        break;
      case 'tech_agriculture':
        currentProgress = state.unlockedTechIds.has('agriculture') ? 1 : 0;
        break;
      case 'build_workshop':
        currentProgress = Math.min(mission.target, state.workshopCount);
        break;
    }

    const isNowCompleted = currentProgress >= mission.target;

    return {
      ...mission,
      progress: currentProgress,
      completed: isNowCompleted,
    };
  });
}

/**
 * Gets the current primary objective for the main game screen
 */
export function getActiveObjective(missions: MissionItem[]) {
  const active = missions.find((m) => !m.claimed);
  if (!active) {
    return {
      title: 'Settlement Flourishing',
      description: 'You have completed all initial civilization goals for Early Settlement! Continue developing and preparing for the next era.',
      progress: 7,
      target: 7,
    };
  }
  return {
    title: active.title,
    description: active.description,
    progress: active.progress,
    target: active.target,
  };
}
