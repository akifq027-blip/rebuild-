import { ResourceKey } from '../types/game';

export const BASE_STORAGE = 500;
export const STORAGE_PER_BUILDING = 250;
export const BASE_POPULATION_CAPACITY = 3;
export const CAPACITY_PER_HUT = 2;

/**
 * Calculates max storage limit based on constructed storage buildings
 */
export function calculateMaxStorage(storageCount: number): number {
  return BASE_STORAGE + storageCount * STORAGE_PER_BUILDING;
}

/**
 * Calculates maximum population capacity from constructed huts
 */
export function calculatePopulationCapacity(hutCount: number): number {
  return BASE_POPULATION_CAPACITY + hutCount * CAPACITY_PER_HUT;
}

/**
 * Checks if the player has enough resources for a cost object
 */
export function canAfford(
  currentResources: Record<ResourceKey, number>,
  cost: Partial<Record<ResourceKey, number>>
): { affordable: boolean; missing: Partial<Record<ResourceKey, number>> } {
  let affordable = true;
  const missing: Partial<Record<ResourceKey, number>> = {};

  for (const [key, amount] of Object.entries(cost)) {
    const resKey = key as ResourceKey;
    const required = amount || 0;
    const available = currentResources[resKey] || 0;
    if (available < required) {
      affordable = false;
      missing[resKey] = required - available;
    }
  }

  return { affordable, missing };
}

/**
 * Safely adds resource amount capped at maxStorage. Returns updated value and actual added.
 */
export function addResource(
  currentResources: Record<ResourceKey, number>,
  key: ResourceKey,
  amount: number,
  maxStorage: number
): {
  newResources: Record<ResourceKey, number>;
  actualAdded: number;
  limitReached: boolean;
} {
  const current = currentResources[key] || 0;
  // Metal limit is 300 base, others maxStorage
  const specificLimit = key === 'metal' ? Math.min(300, maxStorage) : maxStorage;
  const target = current + amount;
  const finalValue = Math.min(specificLimit, Math.max(0, target));
  const actualAdded = finalValue - current;

  return {
    newResources: {
      ...currentResources,
      [key]: finalValue,
    },
    actualAdded,
    limitReached: finalValue >= specificLimit,
  };
}

/**
 * Deducts resource cost safely without going negative
 */
export function deductResources(
  currentResources: Record<ResourceKey, number>,
  cost: Partial<Record<ResourceKey, number>>
): Record<ResourceKey, number> {
  const updated = { ...currentResources };
  for (const [key, amount] of Object.entries(cost)) {
    const resKey = key as ResourceKey;
    const current = updated[resKey] || 0;
    const deduction = amount || 0;
    updated[resKey] = Math.max(0, current - deduction);
  }
  return updated;
}

/**
 * Calculates level from XP
 * Level 1: 0 - 100 XP
 * Level 2: 100 - 250 XP
 * Level 3: 250 - 500 XP
 * Level 4: 500+ XP
 */
export function calculateLevel(xp: number): {
  level: number;
  xpInCurrentLevel: number;
  xpToNextLevel: number;
} {
  if (xp < 100) {
    return { level: 1, xpInCurrentLevel: xp, xpToNextLevel: 100 };
  } else if (xp < 250) {
    return { level: 2, xpInCurrentLevel: xp - 100, xpToNextLevel: 150 };
  } else if (xp < 500) {
    return { level: 3, xpInCurrentLevel: xp - 250, xpToNextLevel: 250 };
  } else {
    return { level: 4, xpInCurrentLevel: xp - 500, xpToNextLevel: 500 };
  }
}
