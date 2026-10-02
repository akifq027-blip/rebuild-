/**
 * BHARAT — Build the Civilization
 * Comprehensive Game State & Strategy Mechanics Type Definitions
 */

export type CoreResourceKey = 'food' | 'wood' | 'stone' | 'clay' | 'knowledge';

export type ExtendedResourceKey = CoreResourceKey | 'water' | 'metal' | 'culture' | 'trade';

export interface ResourceItemInfo {
  id: CoreResourceKey;
  name: string;
  sanskritName: string;
  iconName: string;
  color: string;
  description: string;
  strategicPurpose: string;
}

export type BuildingCategory =
  | 'citadel'
  | 'production'
  | 'storage'
  | 'military'
  | 'science'
  | 'economy'
  | 'water';

export interface BuildingCost {
  food?: number;
  wood?: number;
  stone?: number;
  clay?: number;
  knowledge?: number;
}

export interface BuildingProductionRate {
  resource: CoreResourceKey;
  amountPerHour: number;
  label: string;
}

export interface BuildingDefinition {
  id: string;
  name: string;
  sanskritName: string;
  category: BuildingCategory;
  footprint: { width: number; height: number };
  maxLevel: number;
  description: string;
  historicalSignificance: string;
  archaeologicalSiteRef: string;
  requiredCivCenterLevel: (level: number) => number;
  requiredTechId?: string;
  costForLevel: (level: number) => BuildingCost;
  upgradeTimeSeconds: (level: number) => number;
  productionForLevel: (level: number) => BuildingProductionRate | null;
  storageBonusForLevel: (level: number) => number;
  populationCapacityBonus: (level: number) => number;
}

export interface BuildingPlot {
  id: number;
  name: string;
  gridX: number;
  gridY: number;
  size: { width: number; height: number };
  buildingId: string | null;
  level: number;
  isConstructing?: boolean;
  constructionStartedAt?: number;
  constructionEndsAt?: number;
  lastCollectedAt?: number;
  storedYield?: number;
}

export interface UnitType {
  id: string;
  name: string;
  sanskritName: string;
  category: 'infantry' | 'archer' | 'cavalry' | 'chariot' | 'elephant';
  tier: number;
  attack: number;
  defense: number;
  health: number;
  speed: number;
  cost: BuildingCost;
  trainingTimeSeconds: number;
  requiredTechId?: string;
  requiredBuildingLevel: number;
  description: string;
  historicalNote: string;
}

export interface ArmyTroopGroup {
  unitId: string;
  count: number;
}

export interface ActiveTrainingJob {
  id: string;
  unitId: string;
  count: number;
  startedAt: number;
  finishesAt: number;
  totalSeconds: number;
}

export interface TechnologyItem {
  id: string;
  name: string;
  sanskritName: string;
  era: 'early_settlements' | 'regional_crafts' | 'urban_horizons';
  category: 'agriculture' | 'engineering' | 'science' | 'military' | 'urban';
  knowledgeCost: number;
  prerequisites: string[];
  unlocked: boolean;
  isResearching?: boolean;
  researchTimeSeconds: number;
  effectSummary: string;
  historicalContext: string;
  unlockedBuildingId?: string;
  unlockedUnitId?: string;
}

export interface OnboardingStep {
  step: number;
  title: string;
  badge: string;
  task: string;
  hint: string;
  actionButtonLabel: string;
  targetTab?: 'HOME' | 'BUILD' | 'ARMY' | 'MAP' | 'RESEARCH';
  completed: boolean;
}

export interface CivilizationMission {
  id: string;
  title: string;
  sanskritTitle?: string;
  category: 'foundation' | 'production' | 'military' | 'research' | 'discovery';
  description: string;
  progress: number;
  target: number;
  rewardResources: BuildingCost;
  rewardXp: number;
  rewardKnowledge: number;
  completed: boolean;
  claimed: boolean;
}

export interface SubcontinentMapRegion {
  id: string;
  title: string;
  sanskritName: string;
  historicalEra: string;
  terrainDescription: string;
  archaeologicalSite: string;
  historicalInsight: string;
  recommendedPower: number;
  scoutDurationSeconds: number;
  rewards: {
    knowledge: number;
    wood?: number;
    stone?: number;
    clay?: number;
    artifactTitle?: string;
  };
  status: 'locked' | 'unlocked' | 'scouting' | 'explored';
  scoutEndsAt?: number;
  coordinates: { x: number; y: number }; // Percentage 0-100 on subcontinental map
}

export interface CivilizationOverview {
  name: string;
  motto: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  population: number;
  populationCapacity: number;
  maxStorage: number;
  militaryPower: number;
  foundedAt: string;
}

export interface ActiveCivilizationGameState {
  overview: CivilizationOverview;
  resources: Record<CoreResourceKey, number>;
  plots: BuildingPlot[];
  technologies: TechnologyItem[];
  army: ArmyTroopGroup[];
  trainingQueue: ActiveTrainingJob[];
  missions: CivilizationMission[];
  onboardingStep: number; // 1 to 8
  onboardingCompleted: boolean;
  regions: SubcontinentMapRegion[];
  activeTab: 'HOME' | 'BUILD' | 'ARMY' | 'MAP' | 'RESEARCH';
  selectedPlotId: number | null;
  activeBuildingModalId: string | null;
  activeResearchTechId: string | null;
  activeRegionId: string | null;
  historicalJournal: Array<{
    id: string;
    timestamp: string;
    title: string;
    description: string;
    category: 'civic' | 'construction' | 'military' | 'discovery';
  }>;
}
