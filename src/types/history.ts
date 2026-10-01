/**
 * Historical Types for BHARAT — Build the Civilization (Part 3)
 */

export type EvidenceStatus =
  | 'Archaeological evidence'
  | 'Textual & archaeological evidence'
  | 'Multi-source documentation'
  | 'Scholarly interpretation'
  | 'Debated / uncertain';

export interface SourceReference {
  id: string;
  title: string;
  authorOrInstitution: string;
  category: 'Government / Institutional' | 'Museum / Heritage' | 'Academic' | 'Educational';
  link?: string;
  description: string;
}

export interface EraChallenge {
  id: string;
  eraId: string;
  title: string;
  subtitle: string;
  description: string;
  gameplayInstructions: string;
  historicalContext: string;
  options: {
    id: string;
    label: string;
    historicalBasis: string;
    rewardKnowledge: number;
    rewardCulture: number;
    consequenceText: string;
  }[];
  sources: SourceReference[];
}

export interface HistoricalEvent {
  id: string;
  eraId: string;
  title: string;
  category: 'Environmental' | 'Trade' | 'Governance' | 'Cultural' | 'Technological';
  whatHappened: string;
  historicalContext: string;
  evidenceStatus: EvidenceStatus;
  options: {
    id: string;
    label: string;
    gameEffectText: string;
    knowledgeReward?: number;
    cultureReward?: number;
    resourceBonus?: { resource: string; amount: number };
    historicalExplanation: string;
  }[];
  sources: SourceReference[];
}

export interface ArtifactItem {
  id: string;
  eraId: string;
  name: string;
  category: 'Seals' | 'Pottery' | 'Coins' | 'Sculptures' | 'Manuscripts' | 'Tools' | 'Crafts';
  period: string;
  region: string;
  discovered: boolean;
  discoveredAt?: string;
  description: string;
  historicalSignificance: string;
  evidenceStatus: EvidenceStatus;
  rewardKnowledge: number;
  sources: SourceReference[];
}

export interface HistoricalEra {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  approximateTimeDescription: string;
  description: string;
  evidenceStatus: EvidenceStatus;
  regions: string[];
  keyDevelopments: string[];
  unlocked: boolean;
  completed: boolean;
  unlockRequirements: {
    population: number;
    techIdRequired?: string;
    challengeRequired?: string;
    description: string;
  };
  sources: SourceReference[];
}

export interface JournalEntry {
  id: string;
  timestamp: string;
  eraTitle: string;
  title: string;
  detail: string;
  type: 'era' | 'discovery' | 'artifact' | 'challenge' | 'event';
}

export interface RegionalPath {
  id: string;
  name: string;
  geographicRegion: string;
  distinctiveFeatures: string[];
  historicalHighlights: string;
  sources: SourceReference[];
}
