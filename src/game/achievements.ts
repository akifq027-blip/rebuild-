/**
 * BHARAT — Build the Civilization
 * Achievement Evaluator Engine (Part 5)
 */

import { GameState, AchievementItem } from '../types/game';

export interface AchievementEvaluationResult {
  updatedAchievements: AchievementItem[];
  newlyUnlocked: AchievementItem[];
}

export function evaluateAchievements(state: GameState): AchievementEvaluationResult {
  const newlyUnlocked: AchievementItem[] = [];

  const totalBuildingsCount = state.buildings.reduce((sum, b) => sum + b.currentCount, 0);
  const unlockedTechCount = state.technologies.filter((t) => t.unlocked).length;
  const discoveredArtifactsCount = state.artifacts.filter((a) => a.discovered).length;
  const discoveredSitesCount = state.discoveries.filter((d) => d.discovered).length;
  const cultureAmount = state.resources.culture || 0;
  const civLevel = state.civilization.level;
  const hasAdvancedEra = state.activeEraId !== 'early_settlements' || state.completedChallengeIds.length > 0;

  const updatedAchievements = state.achievements.map((ach) => {
    if (ach.unlocked) return ach;

    let shouldUnlock = false;

    switch (ach.code) {
      case 'first_shelter':
        shouldUnlock = totalBuildingsCount >= 1;
        break;
      case 'master_builder':
        shouldUnlock = totalBuildingsCount >= 5;
        break;
      case 'curious_explorer':
        shouldUnlock = discoveredSitesCount >= 2;
        break;
      case 'knowledge_seeker':
        shouldUnlock = unlockedTechCount >= 3;
        break;
      case 'artifact_collector':
        shouldUnlock = discoveredArtifactsCount >= 1;
        break;
      case 'time_traveler':
        shouldUnlock = hasAdvancedEra;
        break;
      case 'cultural_explorer':
        shouldUnlock = cultureAmount >= 20;
        break;
      case 'civilization_builder':
        shouldUnlock = civLevel >= 2;
        break;
      default:
        break;
    }

    if (shouldUnlock) {
      const unlockedItem: AchievementItem = {
        ...ach,
        unlocked: true,
        unlockedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };
      newlyUnlocked.push(unlockedItem);
      return unlockedItem;
    }

    return ach;
  });

  return {
    updatedAchievements,
    newlyUnlocked,
  };
}
