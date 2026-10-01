import { GameState } from '../types/game';
import { INITIAL_GAME_STATE, INITIAL_RESOURCES } from '../data/initialGameState';
import { HISTORICAL_ERAS, HISTORICAL_ARTIFACTS } from '../data/historicalData';
import { INITIAL_ACHIEVEMENTS } from '../data/achievementsData';

const SAVE_KEY = 'bharat_civilization_save_v3';
const OLD_SAVE_KEY_V2 = 'bharat_civilization_save_v2';

/**
 * Saves game state to browser localStorage
 */
export function saveGameState(state: GameState): boolean {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(SAVE_KEY, serialized);
    return true;
  } catch (err) {
    console.warn('Failed to save game to localStorage:', err);
    return false;
  }
}

/**
 * Loads game state with safe backward-compatibility migrations
 */
export function loadGameState(): GameState | null {
  try {
    // Try V3 first
    let raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      // Fallback check for V2
      raw = localStorage.getItem(OLD_SAVE_KEY_V2);
    }
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      // Rebuild safe resourceList if missing or outdated
      const safeResourceList =
        Array.isArray(parsed.resourceList) && parsed.resourceList.length > 0
          ? parsed.resourceList
          : INITIAL_RESOURCES.map((r) => ({
              ...r,
              value:
                parsed.resources && parsed.resources[r.id] !== undefined
                  ? parsed.resources[r.id]
                  : r.value,
            }));

      // Safely merge with INITIAL_GAME_STATE so all arrays and keys are guaranteed
      const merged: GameState = {
        ...INITIAL_GAME_STATE,
        ...parsed,
        civilization: {
          ...INITIAL_GAME_STATE.civilization,
          ...(parsed.civilization || {}),
        },
        resources: {
          ...INITIAL_GAME_STATE.resources,
          ...(parsed.resources || {}),
        },
        storedProduction: {
          ...INITIAL_GAME_STATE.storedProduction,
          ...(parsed.storedProduction || {}),
        },
        gatheredTotals: {
          ...INITIAL_GAME_STATE.gatheredTotals,
          ...(parsed.gatheredTotals || {}),
        },
        resourceList: safeResourceList,
        buildings: Array.isArray(parsed.buildings) && parsed.buildings.length > 0
          ? parsed.buildings
          : INITIAL_GAME_STATE.buildings,
        buildingSlots: Array.isArray(parsed.buildingSlots) && parsed.buildingSlots.length > 0
          ? parsed.buildingSlots
          : INITIAL_GAME_STATE.buildingSlots,
        technologies: Array.isArray(parsed.technologies) && parsed.technologies.length > 0
          ? parsed.technologies
          : INITIAL_GAME_STATE.technologies,
        missions: Array.isArray(parsed.missions) && parsed.missions.length > 0
          ? parsed.missions
          : INITIAL_GAME_STATE.missions,
        discoveries: Array.isArray(parsed.discoveries) && parsed.discoveries.length > 0
          ? parsed.discoveries
          : INITIAL_GAME_STATE.discoveries,
        achievements: Array.isArray(parsed.achievements) && parsed.achievements.length > 0
          ? parsed.achievements
          : INITIAL_ACHIEVEMENTS,
        historicalEras: Array.isArray(parsed.historicalEras) && parsed.historicalEras.length > 0
          ? parsed.historicalEras
          : HISTORICAL_ERAS,
        artifacts: Array.isArray(parsed.artifacts) && parsed.artifacts.length > 0
          ? parsed.artifacts
          : HISTORICAL_ARTIFACTS,
        journalEntries: Array.isArray(parsed.journalEntries) && parsed.journalEntries.length > 0
          ? parsed.journalEntries
          : INITIAL_GAME_STATE.journalEntries,
        completedChallengeIds: Array.isArray(parsed.completedChallengeIds)
          ? parsed.completedChallengeIds
          : [],
        activeEraId: parsed.activeEraId || 'early_settlements',
      };

      return merged;
    }
    return null;
  } catch (err) {
    console.warn('Failed to load game from localStorage:', err);
    return null;
  }
}

/**
 * Clears saved game from localStorage
 */
export function clearSavedGame(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(OLD_SAVE_KEY_V2);
  } catch (err) {
    console.warn('Failed to clear saved game:', err);
  }
}
