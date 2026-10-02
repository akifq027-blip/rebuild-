/**
 * BHARAT — Build the Civilization
 * Centralized Game State Engine & Simulation Loop
 */

import {
  ActiveCivilizationGameState,
  CoreResourceKey,
  BuildingCost,
  BuildingPlot,
  ArmyTroopGroup,
} from '../types/civilization';
import {
  INITIAL_CIVILIZATION_OVERVIEW,
  INITIAL_RESOURCES,
  INITIAL_BUILDING_PLOTS,
} from './constants';
import { BUILDINGS_CATALOG } from './buildingsData';
import { TECHNOLOGIES_CATALOG } from './technologiesData';
import { UNITS_CATALOG } from './armyData';
import { ONBOARDING_STEPS, INITIAL_CIVILIZATION_MISSIONS } from './missionsData';
import { MAP_REGIONS_CATALOG } from './mapData';

const LOCAL_STORAGE_KEY = 'bharat_civ_v1_save';

export function getInitialGameState(): ActiveCivilizationGameState {
  // Check local cache
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.overview && parsed.resources) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[BHARAT GameState] Failed to restore cached state, using default:', err);
  }

  return {
    overview: INITIAL_CIVILIZATION_OVERVIEW,
    resources: { ...INITIAL_RESOURCES },
    plots: [...INITIAL_BUILDING_PLOTS],
    technologies: [...TECHNOLOGIES_CATALOG],
    army: [
      { unitId: 'padati', count: 4 },
    ],
    trainingQueue: [],
    missions: [...INITIAL_CIVILIZATION_MISSIONS],
    onboardingStep: 1,
    onboardingCompleted: false,
    regions: [...MAP_REGIONS_CATALOG],
    activeTab: 'HOME',
    selectedPlotId: null,
    activeBuildingModalId: null,
    activeResearchTechId: null,
    activeRegionId: null,
    historicalJournal: [
      {
        id: 'j_founding',
        timestamp: 'Day 1 of Settlement',
        title: 'Settlement Founded in the River Basin',
        description: 'Sovereign pioneers raised the initial mud-brick platform overlooking the sacred river waters.',
        category: 'civic',
      },
    ],
  };
}

/**
 * Checks whether player has enough resources for a cost
 */
export function canAffordCost(
  current: Record<CoreResourceKey, number>,
  cost: BuildingCost
): { affordable: boolean; missing: Partial<Record<CoreResourceKey, number>> } {
  const missing: Partial<Record<CoreResourceKey, number>> = {};
  let affordable = true;

  (Object.keys(cost) as CoreResourceKey[]).forEach((resKey) => {
    const required = cost[resKey] || 0;
    const have = current[resKey] || 0;
    if (have < required) {
      affordable = false;
      missing[resKey] = required - have;
    }
  });

  return { affordable, missing };
}

/**
 * Deducts cost safely from resources
 */
export function deductCost(
  current: Record<CoreResourceKey, number>,
  cost: BuildingCost
): Record<CoreResourceKey, number> {
  const updated = { ...current };
  (Object.keys(cost) as CoreResourceKey[]).forEach((resKey) => {
    const req = cost[resKey] || 0;
    updated[resKey] = Math.max(0, (updated[resKey] || 0) - req);
  });
  return updated;
}

/**
 * Calculates current total storage capacity based on buildings
 */
export function calculateTotalStorage(plots: BuildingPlot[]): number {
  let baseStorage = 400;
  plots.forEach((p) => {
    if (p.buildingId && !p.isConstructing) {
      const def = BUILDINGS_CATALOG[p.buildingId];
      if (def) {
        baseStorage += def.storageBonusForLevel(p.level);
      }
    }
  });
  return baseStorage;
}

/**
 * Calculates total population capacity
 */
export function calculateTotalPopulationCapacity(plots: BuildingPlot[]): number {
  let baseCap = 10;
  plots.forEach((p) => {
    if (p.buildingId && !p.isConstructing) {
      const def = BUILDINGS_CATALOG[p.buildingId];
      if (def) {
        baseCap += def.populationCapacityBonus(p.level);
      }
    }
  });
  return baseCap;
}

/**
 * Calculates military power from army
 */
export function calculateTotalMilitaryPower(army: ArmyTroopGroup[]): number {
  let power = 10;
  army.forEach((grp) => {
    const def = UNITS_CATALOG[grp.unitId];
    if (def) {
      power += grp.count * (def.attack + def.defense);
    }
  });
  return power;
}

/**
 * Saves state to local cache
 */
export function persistLocalState(state: ActiveCivilizationGameState): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('[BHARAT GameState] Failed to persist state:', err);
  }
}
