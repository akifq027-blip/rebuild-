/**
 * BHARAT — Build the Civilization
 * Player State Persistence & Validation Service (Aiven MySQL)
 */

import { pool } from '../config/database';

// In-memory fallback repository when MySQL is not yet configured
const inMemoryPlayerStore = new Map<number, any>();

export interface SaveStatePayload {
  civilization?: {
    name?: string;
    level?: number;
    xp?: number;
    xpToNextLevel?: number;
    population?: number;
    populationCapacity?: number;
    maxStorage?: number;
  };
  resources?: {
    food?: number;
    water?: number;
    wood?: number;
    stone?: number;
    metal?: number;
    knowledge?: number;
    culture?: number;
    trade?: number;
  };
  storedProduction?: {
    food?: number;
    water?: number;
    knowledge?: number;
  };
  activeEraId?: string;
  buildings?: Array<{ id: string; currentCount: number; status: string }>;
  buildingSlots?: Array<{ id: number; buildingId: string | null; name: string }>;
  technologies?: Array<{ id: string; unlocked: boolean }>;
  missions?: Array<{ id: string; progress: number; target: number; completed: boolean; claimed: boolean }>;
  artifacts?: Array<{ id: string; discovered: boolean; discoveredAt?: string }>;
  discoveries?: Array<{ id: string; discovered: boolean }>;
  completedChallengeIds?: string[];
  journalEntries?: any[];
  gatheredTotals?: {
    wood?: number;
    stone?: number;
    food?: number;
    water?: number;
  };
}

/**
 * Validate and sanitize player state to prevent corruption or unrealistic values
 */
export function validateState(payload: SaveStatePayload): SaveStatePayload {
  const sanitized = { ...payload };

  if (sanitized.resources) {
    sanitized.resources.food = Math.max(0, Math.min(100000, Number(sanitized.resources.food || 0)));
    sanitized.resources.water = Math.max(0, Math.min(100000, Number(sanitized.resources.water || 0)));
    sanitized.resources.wood = Math.max(0, Math.min(100000, Number(sanitized.resources.wood || 0)));
    sanitized.resources.stone = Math.max(0, Math.min(100000, Number(sanitized.resources.stone || 0)));
    sanitized.resources.metal = Math.max(0, Math.min(100000, Number(sanitized.resources.metal || 0)));
    sanitized.resources.knowledge = Math.max(0, Math.min(100000, Number(sanitized.resources.knowledge || 0)));
    sanitized.resources.culture = Math.max(0, Math.min(100000, Number(sanitized.resources.culture || 0)));
    sanitized.resources.trade = Math.max(0, Math.min(100000, Number(sanitized.resources.trade || 0)));
  }

  if (sanitized.civilization) {
    sanitized.civilization.population = Math.max(1, Math.min(10000, Number(sanitized.civilization.population || 1)));
    sanitized.civilization.level = Math.max(1, Math.min(100, Number(sanitized.civilization.level || 1)));
    sanitized.civilization.xp = Math.max(0, Number(sanitized.civilization.xp || 0));
  }

  return sanitized;
}

/**
 * Initialize new player data upon registration
 */
export async function initializePlayerData(userId: number, civilizationName: string = 'My Bharat') {
  if (!pool) {
    inMemoryPlayerStore.set(userId, {
      profile: {
        userId,
        civilizationName,
        currentEra: 'early_settlements',
        civilizationLevel: 1,
        xp: 0,
        xpToNextLevel: 100,
        population: 3,
        populationCapacity: 5,
        maxStorage: 500,
      },
      resources: {
        food: 120,
        water: 80,
        wood: 60,
        stone: 40,
        metal: 10,
        knowledge: 10,
        culture: 5,
        trade: 0,
        storedFood: 0,
        storedWater: 0,
        storedKnowledge: 0,
      },
      buildings: [{ id: 'hut', quantity: 1, status: 'AVAILABLE' }],
      technologies: [],
      missions: [],
      artifacts: [],
      discoveries: [],
      events: [],
      progress: {
        activeEraId: 'early_settlements',
        gatheredWood: 0,
        gatheredStone: 0,
        gatheredFood: 0,
        gatheredWater: 0,
      },
    });
    return;
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Profile
    await conn.query(
      `INSERT INTO player_profiles (user_id, civilization_name, current_era, civilization_level, xp, xp_to_next_level, population, population_capacity, max_storage)
       VALUES (?, ?, 'early_settlements', 1, 0, 100, 3, 5, 500)
       ON DUPLICATE KEY UPDATE civilization_name = VALUES(civilization_name)`,
      [userId, civilizationName]
    );

    // 2. Resources
    await conn.query(
      `INSERT INTO player_resources (user_id, food, water, wood, stone, metal, knowledge, culture, trade)
       VALUES (?, 120, 80, 60, 40, 10, 10, 5, 0)
       ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)`,
      [userId]
    );

    // 3. Buildings (Start with 1 Hut)
    await conn.query(
      `INSERT INTO player_buildings (user_id, building_id, quantity, status)
       VALUES (?, 'hut', 1, 'AVAILABLE')
       ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`,
      [userId]
    );

    // 4. Progress
    await conn.query(
      `INSERT INTO player_progress (user_id, active_era_id)
       VALUES (?, 'early_settlements')
       ON DUPLICATE KEY UPDATE active_era_id = VALUES(active_era_id)`,
      [userId]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

/**
 * Load complete player state
 */
export async function getPlayerState(userId: number) {
  if (!pool) {
    const memory = inMemoryPlayerStore.get(userId);
    return memory || null;
  }

  const conn = await pool.getConnection();
  try {
    // 1. Profile
    const [profileRows]: any = await conn.query(
      'SELECT * FROM player_profiles WHERE user_id = ? LIMIT 1',
      [userId]
    );
    const profile = profileRows[0] || null;

    // 2. Resources
    const [resourceRows]: any = await conn.query(
      'SELECT * FROM player_resources WHERE user_id = ? LIMIT 1',
      [userId]
    );
    const resources = resourceRows[0] || null;

    // 3. Buildings
    const [buildings]: any = await conn.query(
      'SELECT building_id AS id, quantity AS currentCount, status FROM player_buildings WHERE user_id = ?',
      [userId]
    );

    // 4. Technologies
    const [technologies]: any = await conn.query(
      'SELECT technology_id AS id, unlocked FROM player_technologies WHERE user_id = ?',
      [userId]
    );

    // 5. Missions
    const [missions]: any = await conn.query(
      'SELECT mission_id AS id, progress, completed, claimed FROM player_missions WHERE user_id = ?',
      [userId]
    );

    // 6. Artifacts
    const [artifacts]: any = await conn.query(
      'SELECT artifact_id AS id, discovered_at_era AS discoveredAt, true AS discovered FROM player_artifacts WHERE user_id = ?',
      [userId]
    );

    // 7. Discoveries
    const [discoveries]: any = await conn.query(
      'SELECT discovery_id AS id, true AS discovered FROM player_discoveries WHERE user_id = ?',
      [userId]
    );

    // 8. Progress & Slots & Journal
    const [progressRows]: any = await conn.query(
      'SELECT * FROM player_progress WHERE user_id = ? LIMIT 1',
      [userId]
    );
    const progress = progressRows[0] || null;

    return {
      profile,
      resources,
      buildings,
      technologies,
      missions,
      artifacts,
      discoveries,
      progress: progress ? {
        activeEraId: progress.active_era_id,
        buildingSlots: progress.building_slots_json ? JSON.parse(progress.building_slots_json) : null,
        completedChallenges: progress.completed_challenges_json ? JSON.parse(progress.completed_challenges_json) : [],
        unlockedEras: progress.unlocked_eras_json ? JSON.parse(progress.unlocked_eras_json) : null,
        journalEntries: progress.journal_entries_json ? JSON.parse(progress.journal_entries_json) : [],
        gatheredTotals: {
          wood: progress.gathered_wood,
          stone: progress.gathered_stone,
          food: progress.gathered_food,
          water: progress.gathered_water,
        },
      } : null,
    };
  } finally {
    conn.release();
  }
}

/**
 * Save complete player state
 */
export async function savePlayerState(userId: number, payload: SaveStatePayload) {
  const sanitized = validateState(payload);

  if (!pool) {
    const existing = inMemoryPlayerStore.get(userId) || {};
    inMemoryPlayerStore.set(userId, {
      ...existing,
      ...sanitized,
      lastSaved: new Date().toISOString(),
    });
    return { success: true, savedTo: 'memory' };
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Update Profile
    if (sanitized.civilization) {
      await conn.query(
        `UPDATE player_profiles
         SET civilization_name = COALESCE(?, civilization_name),
             civilization_level = COALESCE(?, civilization_level),
             xp = COALESCE(?, xp),
             xp_to_next_level = COALESCE(?, xp_to_next_level),
             population = COALESCE(?, population),
             population_capacity = COALESCE(?, population_capacity),
             max_storage = COALESCE(?, max_storage),
             current_era = COALESCE(?, current_era)
         WHERE user_id = ?`,
        [
          sanitized.civilization.name || null,
          sanitized.civilization.level || null,
          sanitized.civilization.xp || null,
          sanitized.civilization.xpToNextLevel || null,
          sanitized.civilization.population || null,
          sanitized.civilization.populationCapacity || null,
          sanitized.civilization.maxStorage || null,
          sanitized.activeEraId || null,
          userId,
        ]
      );
    }

    // 2. Update Resources
    if (sanitized.resources) {
      await conn.query(
        `UPDATE player_resources
         SET food = ?, water = ?, wood = ?, stone = ?, metal = ?, knowledge = ?, culture = ?, trade = ?,
             stored_food = ?, stored_water = ?, stored_knowledge = ?
         WHERE user_id = ?`,
        [
          sanitized.resources.food ?? 0,
          sanitized.resources.water ?? 0,
          sanitized.resources.wood ?? 0,
          sanitized.resources.stone ?? 0,
          sanitized.resources.metal ?? 0,
          sanitized.resources.knowledge ?? 0,
          sanitized.resources.culture ?? 0,
          sanitized.resources.trade ?? 0,
          sanitized.storedProduction?.food ?? 0,
          sanitized.storedProduction?.water ?? 0,
          sanitized.storedProduction?.knowledge ?? 0,
          userId,
        ]
      );
    }

    // 3. Upsert Buildings
    if (sanitized.buildings && sanitized.buildings.length > 0) {
      for (const b of sanitized.buildings) {
        await conn.query(
          `INSERT INTO player_buildings (user_id, building_id, quantity, status)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), status = VALUES(status)`,
          [userId, b.id, b.currentCount, b.status]
        );
      }
    }

    // 4. Upsert Technologies
    if (sanitized.technologies && sanitized.technologies.length > 0) {
      for (const t of sanitized.technologies) {
        if (t.unlocked) {
          await conn.query(
            `INSERT INTO player_technologies (user_id, technology_id, unlocked)
             VALUES (?, ?, true)
             ON DUPLICATE KEY UPDATE unlocked = true`,
            [userId, t.id]
          );
        }
      }
    }

    // 5. Upsert Missions
    if (sanitized.missions && sanitized.missions.length > 0) {
      for (const m of sanitized.missions) {
        await conn.query(
          `INSERT INTO player_missions (user_id, mission_id, progress, completed, claimed)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE progress = VALUES(progress), completed = VALUES(completed), claimed = VALUES(claimed)`,
          [userId, m.id, m.progress, m.completed, m.claimed]
        );
      }
    }

    // 6. Upsert Artifacts
    if (sanitized.artifacts && sanitized.artifacts.length > 0) {
      for (const a of sanitized.artifacts) {
        if (a.discovered) {
          await conn.query(
            `INSERT INTO player_artifacts (user_id, artifact_id, discovered_at_era)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE discovered_at_era = VALUES(discovered_at_era)`,
            [userId, a.id, a.discoveredAt || 'Early Settlements']
          );
        }
      }
    }

    // 7. Upsert Discoveries
    if (sanitized.discoveries && sanitized.discoveries.length > 0) {
      for (const d of sanitized.discoveries) {
        if (d.discovered) {
          await conn.query(
            `INSERT INTO player_discoveries (user_id, discovery_id)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE discovery_id = VALUES(discovery_id)`,
            [userId, d.id]
          );
        }
      }
    }

    // 8. Update Progress JSON
    const slotsJson = sanitized.buildingSlots ? JSON.stringify(sanitized.buildingSlots) : null;
    const challengesJson = sanitized.completedChallengeIds ? JSON.stringify(sanitized.completedChallengeIds) : null;
    const journalJson = sanitized.journalEntries ? JSON.stringify(sanitized.journalEntries.slice(0, 50)) : null;

    await conn.query(
      `INSERT INTO player_progress (
        user_id, active_era_id, building_slots_json, completed_challenges_json,
        gathered_wood, gathered_stone, gathered_food, gathered_water, journal_entries_json
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        active_era_id = VALUES(active_era_id),
        building_slots_json = VALUES(building_slots_json),
        completed_challenges_json = VALUES(completed_challenges_json),
        gathered_wood = VALUES(gathered_wood),
        gathered_stone = VALUES(gathered_stone),
        gathered_food = VALUES(gathered_food),
        gathered_water = VALUES(gathered_water),
        journal_entries_json = VALUES(journal_entries_json)`,
      [
        userId,
        sanitized.activeEraId || 'early_settlements',
        slotsJson,
        challengesJson,
        sanitized.gatheredTotals?.wood || 0,
        sanitized.gatheredTotals?.stone || 0,
        sanitized.gatheredTotals?.food || 0,
        sanitized.gatheredTotals?.water || 0,
        journalJson,
      ]
    );

    await conn.commit();
    return { success: true, savedTo: 'mysql' };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
