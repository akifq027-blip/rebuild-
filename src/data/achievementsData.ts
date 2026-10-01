/**
 * BHARAT — Build the Civilization
 * Pre-defined Achievements Data (Part 5)
 */

import { AchievementItem } from '../types/game';

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'first_shelter',
    code: 'first_shelter',
    title: 'First Hearth',
    description: 'Construct your very first settlement structure to provide shelter.',
    category: 'building',
    iconName: 'Home',
    xpReward: 50,
    unlocked: false,
  },
  {
    id: 'master_builder',
    code: 'master_builder',
    title: 'Master Builder',
    description: 'Erect 5 or more structures in your riverine settlement.',
    category: 'building',
    iconName: 'Hammer',
    xpReward: 100,
    unlocked: false,
  },
  {
    id: 'curious_explorer',
    code: 'curious_explorer',
    title: 'Curious Explorer',
    description: 'Send scouts on expeditions across different terrain zones.',
    category: 'exploration',
    iconName: 'Compass',
    xpReward: 75,
    unlocked: false,
  },
  {
    id: 'knowledge_seeker',
    code: 'knowledge_seeker',
    title: 'Knowledge Seeker',
    description: 'Master 3 or more historical technologies in the Technology Tree.',
    category: 'technology',
    iconName: 'Scroll',
    xpReward: 100,
    unlocked: false,
  },
  {
    id: 'artifact_collector',
    code: 'artifact_collector',
    title: 'Relic Custodian',
    description: 'Unearth ancient artifacts and curate them in your Civilization Museum.',
    category: 'museum',
    iconName: 'Award',
    xpReward: 120,
    unlocked: false,
  },
  {
    id: 'time_traveler',
    code: 'time_traveler',
    title: 'Epoch Journeyer',
    description: 'Unlock and advance into subsequent chapters in the Journey Through Time.',
    category: 'progression',
    iconName: 'Clock',
    xpReward: 150,
    unlocked: false,
  },
  {
    id: 'cultural_explorer',
    code: 'cultural_explorer',
    title: 'Living Traditions',
    description: 'Accumulate 20 or more Culture through arts, traditions, and historical choices.',
    category: 'culture',
    iconName: 'Sparkles',
    xpReward: 80,
    unlocked: false,
  },
  {
    id: 'civilization_builder',
    code: 'civilization_builder',
    title: 'Architect of Bharat',
    description: 'Advance your civilization to Level 3 or higher through sustainable development.',
    category: 'progression',
    iconName: 'Landmark',
    xpReward: 200,
    unlocked: false,
  },
];
