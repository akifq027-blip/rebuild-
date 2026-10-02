/**
 * Core type definitions for BHARAT — Build the Civilization
 * Updated for PART 3: Indian Civilization, History & Era Progression
 */

import {
  HistoricalEra,
  ArtifactItem,
  EraChallenge,
  HistoricalEvent,
  JournalEntry,
} from './history';
import { ArmyTroopGroup } from './civilization';

export type ResourceKey =
  | 'food'
  | 'water'
  | 'wood'
  | 'stone'
  | 'metal'
  | 'knowledge'
  | 'culture'
  | 'trade';

export interface ResourceItem {
  id: ResourceKey;
  name: string;
  value: number;
  iconName: string;
  category: 'sustenance' | 'materials' | 'development';
  description: string;
}

export interface PlayerProfile {
  name: string;
  title?: string;
}

export interface CivilizationInfo {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  population: number;
  populationCapacity: number;
  maxStorage: number;
}

export interface EraInfo {
  id: number;
  name: string;
  shortDescription: string;
  historicalContext: string;
}

export type BuildingStatus = 'AVAILABLE' | 'CONSTRUCTED' | 'LOCKED';

export interface BuildingProduction {
  resource: ResourceKey;
  amount: number;
  label: string;
}

export interface BuildingItem {
  id: string;
  name: string;
  iconName: string;
  shortDescription: string;
  status: BuildingStatus;
  category: 'shelter' | 'production' | 'storage' | 'utility' | 'workshop';
  cost: Partial<Record<ResourceKey, number>>;
  populationEffect: number;
  productionEffect?: BuildingProduction;
  requiredTech?: string;
  historicalSignificance: string;
  currentCount: number;
}

export interface BuildingSlot {
  id: number;
  name: string;
  buildingId: string | null;
  x: number;
  y: number;
  level?: number;
}

export interface TechnologyItem {
  id: string;
  name: string;
  description: string;
  knowledgeCost: number;
  prerequisiteId: string | null;
  unlocked: boolean;
  effectDescription: string;
  unlockedBuildingId?: string;
}

export interface MissionItem {
  id: string;
  title: string;
  description: string;
  type:
    | 'gather_wood'
    | 'build_hut'
    | 'build_farm'
    | 'build_well'
    | 'population'
    | 'tech_agriculture'
    | 'build_workshop'
    | 'establish_settlement'
    | 'discoveries';
  target: number;
  progress: number;
  rewardText: string;
  rewardResource?: {
    resource: ResourceKey;
    amount: number;
  };
  rewardXp: number;
  completed: boolean;
  claimed: boolean;
}

export interface DiscoveryItem {
  id: string;
  title: string;
  description: string;
  rewardKnowledge: number;
  rewardCulture: number;
  discovered: boolean;
  discoveredAt?: string;
}

export interface ExplorationLocation {
  id: string;
  name: string;
  description: string;
  rewards: Partial<Record<ResourceKey, number>>;
  possibleDiscoveryId: string;
  cooldownSeconds: number;
}

export interface ObjectiveItem {
  title: string;
  description: string;
  progress: number;
  target: number;
}

export type GameTab =
  | 'HOME'
  | 'BUILD'
  | 'ARMY'
  | 'EXPLORE'
  | 'TECHNOLOGY'
  | 'RESEARCH'
  | 'MISSIONS'
  | 'MUSEUM'
  | 'LEARN'
  | 'MAP';

export interface ToastNotification {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning' | 'level';
  timestamp: number;
}

export interface AchievementItem {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'building' | 'exploration' | 'technology' | 'museum' | 'progression' | 'culture';
  iconName: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'update' | 'event';
}

export interface GameState {
  player: PlayerProfile;
  civilization: CivilizationInfo;
  era: EraInfo;
  resources: Record<ResourceKey, number>;
  resourceList: ResourceItem[];
  buildings: BuildingItem[];
  buildingSlots: BuildingSlot[];
  technologies: TechnologyItem[];
  missions: MissionItem[];
  discoveries: DiscoveryItem[];
  currentObjective: ObjectiveItem;
  storedProduction: {
    food: number;
    water: number;
    knowledge: number;
  };
  gatheredTotals: {
    wood: number;
    stone: number;
    food: number;
    water: number;
  };
  // Part 3 Historical Systems
  activeEraId: string;
  historicalEras: HistoricalEra[];
  artifacts: ArtifactItem[];
  journalEntries: JournalEntry[];
  completedChallengeIds: string[];
  // Part 5 Systems
  achievements: AchievementItem[];
  isDemoMode?: boolean;
  army?: ArmyTroopGroup[];
}
