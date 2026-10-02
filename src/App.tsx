/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  GameState,
  GameTab,
  ToastNotification,
  ResourceKey,
} from './types/game';
import { JournalEntry } from './types/history';
import { INITIAL_GAME_STATE, INITIAL_RESOURCES } from './data/initialGameState';
import { HISTORICAL_ERAS, HISTORICAL_EVENTS } from './data/historicalData';
import {
  canAfford,
  deductResources,
  addResource,
  calculateMaxStorage,
  calculatePopulationCapacity,
  calculateLevel,
} from './game/economy';
import { canResearchTechnology } from './game/technologies';
import { evaluateMissions, getActiveObjective } from './game/missions';
import { evaluateAchievements } from './game/achievements';
import { saveGameState, loadGameState, clearSavedGame } from './game/storage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { StartScreen } from './pages/StartScreen';
import { GameScreen } from './pages/GameScreen';
import api from './services/api';

/**
 * Merge loaded cloud data from MySQL into the application game state
 */
function mergeCloudStateIntoGame(cloudData: any, base: GameState): GameState {
  if (!cloudData) return base;

  let merged = { ...base };

  // 1. Resources
  if (cloudData.resources) {
    const cr = cloudData.resources;
    merged.resources = {
      food: Number(cr.food ?? base.resources.food),
      water: Number(cr.water ?? base.resources.water),
      wood: Number(cr.wood ?? base.resources.wood),
      stone: Number(cr.stone ?? base.resources.stone),
      metal: Number(cr.metal ?? base.resources.metal),
      knowledge: Number(cr.knowledge ?? base.resources.knowledge),
      culture: Number(cr.culture ?? base.resources.culture),
      trade: Number(cr.trade ?? base.resources.trade),
    };
    merged.storedProduction = {
      food: Number(cr.stored_food ?? base.storedProduction.food),
      water: Number(cr.stored_water ?? base.storedProduction.water),
      knowledge: Number(cr.stored_knowledge ?? base.storedProduction.knowledge),
    };
    merged.resourceList = INITIAL_RESOURCES.map((r) => ({
      ...r,
      value: merged.resources[r.id] !== undefined ? merged.resources[r.id] : r.value,
    }));
  }

  // 2. Profile
  if (cloudData.profile) {
    const cp = cloudData.profile;
    merged.civilization = {
      ...merged.civilization,
      name: cp.civilization_name || merged.civilization.name,
      level: Number(cp.civilization_level || merged.civilization.level),
      xp: Number(cp.xp ?? merged.civilization.xp),
      xpToNextLevel: Number(cp.xp_to_next_level || merged.civilization.xpToNextLevel),
      population: Number(cp.population || merged.civilization.population),
      populationCapacity: Number(cp.population_capacity || merged.civilization.populationCapacity),
      maxStorage: Number(cp.max_storage || merged.civilization.maxStorage),
    };
  }

  // 3. Buildings
  if (Array.isArray(cloudData.buildings)) {
    const bMap = new Map(cloudData.buildings.map((b: any) => [b.id, b]));
    merged.buildings = merged.buildings.map((b) => {
      const match = bMap.get(b.id) as any;
      if (match) {
        return {
          ...b,
          currentCount: Number(match.currentCount ?? b.currentCount),
          status: (match.status as any) || b.status,
        };
      }
      return b;
    });
  }

  // 4. Technologies
  if (Array.isArray(cloudData.technologies)) {
    const tSet = new Set(
      cloudData.technologies.filter((t: any) => t.unlocked).map((t: any) => t.id)
    );
    merged.technologies = merged.technologies.map((t) => ({
      ...t,
      unlocked: t.unlocked || tSet.has(t.id),
    }));
  }

  // 5. Missions
  if (Array.isArray(cloudData.missions)) {
    const mMap = new Map(cloudData.missions.map((m: any) => [m.id, m]));
    merged.missions = merged.missions.map((m) => {
      const match = mMap.get(m.id) as any;
      if (match) {
        return {
          ...m,
          progress: Number(match.progress ?? m.progress),
          completed: Boolean(match.completed ?? m.completed),
          claimed: Boolean(match.claimed ?? m.claimed),
        };
      }
      return m;
    });
    merged.currentObjective = getActiveObjective(merged.missions);
  }

  // 6. Artifacts
  if (Array.isArray(cloudData.artifacts)) {
    const aMap = new Map(cloudData.artifacts.map((a: any) => [a.id, a]));
    merged.artifacts = merged.artifacts.map((a) => {
      const match = aMap.get(a.id) as any;
      if (match) {
        return {
          ...a,
          discovered: true,
          discoveredAt: match.discoveredAt || a.discoveredAt,
        };
      }
      return a;
    });
  }

  // 7. Discoveries
  if (Array.isArray(cloudData.discoveries)) {
    const dSet = new Set(cloudData.discoveries.map((d: any) => d.id));
    merged.discoveries = merged.discoveries.map((d) => ({
      ...d,
      discovered: d.discovered || dSet.has(d.id),
    }));
  }

  // 8. Progress, Slots, Challenges, Journals
  if (cloudData.progress) {
    const cp = cloudData.progress;
    if (cp.activeEraId) {
      merged.activeEraId = cp.activeEraId;
      const eraObj = merged.historicalEras.find((e) => e.id === cp.activeEraId);
      if (eraObj) {
        merged.era = {
          id: eraObj.chapterNumber,
          name: eraObj.title.toUpperCase(),
          shortDescription: eraObj.subtitle,
          historicalContext: eraObj.description,
        };
      }
    }
    if (Array.isArray(cp.buildingSlots) && cp.buildingSlots.length > 0) {
      merged.buildingSlots = cp.buildingSlots;
    }
    if (Array.isArray(cp.completedChallenges)) {
      merged.completedChallengeIds = cp.completedChallenges;
    }
    if (Array.isArray(cp.journalEntries) && cp.journalEntries.length > 0) {
      merged.journalEntries = cp.journalEntries;
    }
    if (cp.gatheredTotals) {
      merged.gatheredTotals = {
        wood: Number(cp.gatheredTotals.wood || merged.gatheredTotals.wood),
        stone: Number(cp.gatheredTotals.stone || merged.gatheredTotals.stone),
        food: Number(cp.gatheredTotals.food || merged.gatheredTotals.food),
        water: Number(cp.gatheredTotals.water || merged.gatheredTotals.water),
      };
    }
  }

  return merged;
}

function BharatGame() {
  const { user, isAuthenticated, saveToServer } = useAuth();

  // Load saved state or use initial with backward-compatibility
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = loadGameState();
    if (saved) return saved;
    return INITIAL_GAME_STATE;
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<GameTab>('HOME');
  const [nodeCooldowns, setNodeCooldowns] = useState<Record<string, number>>({});
  const [exploreCooldowns, setExploreCooldowns] = useState<Record<string, number>>({});
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [isStartAuthModalOpen, setIsStartAuthModalOpen] = useState(false);

  // Track initial cloud sync
  const hasLoadedCloudRef = useRef(false);

  // Toast Notification dispatcher
  const addToast = useCallback(
    (text: string, type: 'success' | 'info' | 'warning' | 'level' = 'success') => {
      const id = `${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const toast: ToastNotification = { id, text, type, timestamp: Date.now() };
      setNotifications((prev) => [...prev.slice(-3), toast]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync resource list whenever resources change
  const syncResourceList = (resMap: Record<ResourceKey, number>) => {
    return INITIAL_RESOURCES.map((r) => ({
      ...r,
      value: resMap[r.id] !== undefined ? resMap[r.id] : r.value,
    }));
  };

  // Helper to add XP and check level advancement
  const awardXp = (
    currentXp: number,
    currentLevel: number,
    xpToAdd: number
  ): { xp: number; level: number; xpToNextLevel: number; leveledUp: boolean } => {
    const newTotalXp = currentXp + xpToAdd;
    const { level, xpToNextLevel } = calculateLevel(newTotalXp);
    const leveledUp = level > currentLevel;
    if (leveledUp) {
      addToast(`CIVILIZATION ADVANCED! Reached Level ${level}.`, 'level');
    }
    return {
      xp: newTotalXp,
      level,
      xpToNextLevel,
      leveledUp,
    };
  };

  // Helper to append a journal entry
  const createJournalEntry = (
    title: string,
    detail: string,
    type: 'era' | 'discovery' | 'artifact' | 'challenge' | 'event',
    eraTitle: string
  ): JournalEntry => ({
    id: `journal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    eraTitle,
    title,
    detail,
    type,
  });

  // Load cloud state on login or initial auth
  useEffect(() => {
    async function loadCloudProgress() {
      if (isAuthenticated && !hasLoadedCloudRef.current) {
        hasLoadedCloudRef.current = true;
        try {
          const res = await api.getPlayerState();
          if (res.success && res.data) {
            setGameState((prev) => mergeCloudStateIntoGame(res.data, prev));
            addToast('Your latest saved civilization was loaded from Aiven Cloud.', 'info');
          }
        } catch {
          // Fall back gracefully to localStorage
        }
      }
    }

    loadCloudProgress();
  }, [isAuthenticated, addToast]);

  // Handle immediate cloud authentication success
  const handleCloudAuthSuccess = useCallback(
    (cloudState?: any) => {
      if (cloudState) {
        setGameState((prev) => mergeCloudStateIntoGame(cloudState, prev));
        addToast('Welcome back! Civilization progress restored from cloud.', 'success');
      } else {
        // Newly registered, sync current local state to cloud immediately
        handleSaveCloudNow();
        addToast('Account created! Your civilization is now backed up in Aiven Cloud.', 'success');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addToast]
  );

  // Manual save to cloud
  const handleSaveCloudNow = useCallback(async () => {
    const payload = {
      civilization: {
        name: gameState.civilization.name,
        level: gameState.civilization.level,
        xp: gameState.civilization.xp,
        xpToNextLevel: gameState.civilization.xpToNextLevel,
        population: gameState.civilization.population,
        populationCapacity: gameState.civilization.populationCapacity,
        maxStorage: gameState.civilization.maxStorage,
      },
      resources: gameState.resources,
      storedProduction: gameState.storedProduction,
      activeEraId: gameState.activeEraId,
      buildings: (gameState.buildings || []).map((b) => ({
        id: b.id,
        currentCount: b.currentCount,
        status: b.status,
      })),
      buildingSlots: gameState.buildingSlots || [],
      technologies: (gameState.technologies || []).map((t) => ({
        id: t.id,
        unlocked: t.unlocked,
      })),
      missions: (gameState.missions || []).map((m) => ({
        id: m.id,
        progress: m.progress,
        target: m.target,
        completed: m.completed,
        claimed: m.claimed,
      })),
      artifacts: (gameState.artifacts || []).map((a) => ({
        id: a.id,
        discovered: a.discovered,
        discoveredAt: a.discoveredAt,
      })),
      discoveries: (gameState.discoveries || []).map((d) => ({
        id: d.id,
        discovered: d.discovered,
      })),
      completedChallengeIds: gameState.completedChallengeIds || [],
      journalEntries: gameState.journalEntries || [],
      gatheredTotals: gameState.gatheredTotals,
    };

    const ok = await saveToServer(payload);
    if (ok) {
      addToast('Civilization saved to cloud database.', 'success');
    }
  }, [gameState, saveToServer, addToast]);

  // Auto-save game: local storage immediately + debounced cloud sync if authenticated
  useEffect(() => {
    saveGameState(gameState);

    if (isAuthenticated) {
      const timer = setTimeout(() => {
        saveToServer({
          civilization: {
            name: gameState.civilization.name,
            level: gameState.civilization.level,
            xp: gameState.civilization.xp,
            xpToNextLevel: gameState.civilization.xpToNextLevel,
            population: gameState.civilization.population,
            populationCapacity: gameState.civilization.populationCapacity,
            maxStorage: gameState.civilization.maxStorage,
          },
          resources: gameState.resources,
          storedProduction: gameState.storedProduction,
          activeEraId: gameState.activeEraId,
          buildings: (gameState.buildings || []).map((b) => ({
            id: b.id,
            currentCount: b.currentCount,
            status: b.status,
          })),
          buildingSlots: gameState.buildingSlots || [],
          technologies: (gameState.technologies || []).map((t) => ({
            id: t.id,
            unlocked: t.unlocked,
          })),
          missions: (gameState.missions || []).map((m) => ({
            id: m.id,
            progress: m.progress,
            target: m.target,
            completed: m.completed,
            claimed: m.claimed,
          })),
          artifacts: (gameState.artifacts || []).map((a) => ({
            id: a.id,
            discovered: a.discovered,
            discoveredAt: a.discoveredAt,
          })),
          discoveries: (gameState.discoveries || []).map((d) => ({
            id: d.id,
            discovered: d.discovered,
          })),
          completedChallengeIds: gameState.completedChallengeIds || [],
          journalEntries: gameState.journalEntries || [],
          gatheredTotals: gameState.gatheredTotals,
        });
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [gameState, isAuthenticated, saveToServer]);

  // Periodic passive production accumulator
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState((prev) => {
        const farmCount = prev.buildings.find((b) => b.id === 'farm')?.currentCount || 0;
        const wellCount = prev.buildings.find((b) => b.id === 'well')?.currentCount || 0;
        const workshopCount = prev.buildings.find((b) => b.id === 'workshop')?.currentCount || 0;

        if (farmCount === 0 && wellCount === 0 && workshopCount === 0) {
          return prev;
        }

        const addedFood = farmCount * 5;
        const addedWater = wellCount * 5;
        const addedKnow = workshopCount * 2;

        return {
          ...prev,
          storedProduction: {
            food: Math.min(150, prev.storedProduction.food + addedFood),
            water: Math.min(150, prev.storedProduction.water + addedWater),
            knowledge: Math.min(100, prev.storedProduction.knowledge + addedKnow),
          },
        };
      });
    }, 20000);

    return () => clearInterval(timer);
  }, []);

  // Check and unlock next historical eras if requirements are met
  const checkEraUnlocks = useCallback(
    (
      currentEras: typeof HISTORICAL_ERAS,
      population: number,
      unlockedTechs: Set<string>,
      completedChallenges: string[],
      currentEraTitle: string
    ) => {
      let newlyUnlockedEra: typeof HISTORICAL_ERAS[0] | null = null;

      const updatedEras = currentEras.map((era) => {
        if (era.unlocked) return era;

        const req = era.unlockRequirements;
        const popMet = population >= req.population;
        const techMet = !req.techIdRequired || unlockedTechs.has(req.techIdRequired);
        const challengeMet = !req.challengeRequired || completedChallenges.includes(req.challengeRequired);

        if (popMet && techMet && challengeMet) {
          newlyUnlockedEra = era;
          return { ...era, unlocked: true };
        }
        return era;
      });

      if (newlyUnlockedEra) {
        const eraObj = newlyUnlockedEra as typeof HISTORICAL_ERAS[0];
        addToast(`ERA UNLOCKED! ${eraObj.title} is now accessible in Journey Through Time!`, 'level');
      }

      return updatedEras;
    },
    [addToast]
  );

  // 1. Gather Resource Handler
  const handleGatherResource = (type: 'wood' | 'stone' | 'food' | 'water') => {
    const now = Date.now();
    const cdEnd = nodeCooldowns[type] || 0;
    if (cdEnd > now) return;

    setNodeCooldowns((prev) => ({
      ...prev,
      [type]: now + 2500,
    }));

    const gatherAmount = type === 'stone' ? 5 : 10;

    setGameState((prev) => {
      const { newResources, actualAdded, limitReached } = addResource(
        prev.resources,
        type,
        gatherAmount,
        prev.civilization.maxStorage
      );

      if (limitReached && actualAdded === 0) {
        addToast(`Storage limit reached for ${type.toUpperCase()}!`, 'warning');
        return prev;
      }

      addToast(`+${actualAdded} ${type.toUpperCase()}`, 'success');

      const newTotals = {
        ...prev.gatheredTotals,
        [type]: (prev.gatheredTotals[type] || 0) + actualAdded,
      };

      const { xp, level, xpToNextLevel } = awardXp(
        prev.civilization.xp,
        prev.civilization.level,
        4
      );

      const unlockedIds = new Set(prev.technologies.filter((t) => t.unlocked).map((t) => t.id));
      const hutCount = prev.buildings.find((b) => b.id === 'hut')?.currentCount || 0;
      const farmCount = prev.buildings.find((b) => b.id === 'farm')?.currentCount || 0;
      const wellCount = prev.buildings.find((b) => b.id === 'well')?.currentCount || 0;
      const workshopCount = prev.buildings.find((b) => b.id === 'workshop')?.currentCount || 0;

      const updatedMissions = evaluateMissions(prev.missions, {
        gatheredWoodTotal: newTotals.wood,
        hutCount,
        farmCount,
        wellCount,
        workshopCount,
        population: prev.civilization.population,
        unlockedTechIds: unlockedIds,
      });

      return {
        ...prev,
        resources: newResources,
        resourceList: syncResourceList(newResources),
        gatheredTotals: newTotals,
        civilization: {
          ...prev.civilization,
          xp,
          level,
          xpToNextLevel,
        },
        missions: updatedMissions,
        currentObjective: getActiveObjective(updatedMissions),
      };
    });
  };

  // 2. Build Structure Handler
  const handleBuild = (buildingId: string) => {
    const building = gameState.buildings.find((b) => b.id === buildingId);
    if (!building) return;

    const { affordable, missing } = canAfford(gameState.resources, building.cost);
    if (!affordable) {
      const missingStr = Object.entries(missing)
        .map(([k, v]) => `${v} ${k}`)
        .join(', ');
      addToast(`Not enough resources. Need ${missingStr}`, 'warning');
      return;
    }

    const slotIndex = gameState.buildingSlots.findIndex((s) => !s.buildingId);
    if (slotIndex === -1) {
      addToast('Settlement full! All slots occupied.', 'warning');
      return;
    }

    setGameState((prev) => {
      const newResources = deductResources(prev.resources, building.cost);

      const updatedSlots = [...prev.buildingSlots];
      updatedSlots[slotIndex] = {
        ...updatedSlots[slotIndex],
        buildingId: building.id,
      };

      const updatedBuildings = prev.buildings.map((b) => {
        if (b.id === building.id) {
          return {
            ...b,
            currentCount: b.currentCount + 1,
            status: 'AVAILABLE' as const,
          };
        }
        return b;
      });

      const hutCount = updatedBuildings.find((b) => b.id === 'hut')?.currentCount || 0;
      const storageCount = updatedBuildings.find((b) => b.id === 'storage')?.currentCount || 0;
      const farmCount = updatedBuildings.find((b) => b.id === 'farm')?.currentCount || 0;
      const wellCount = updatedBuildings.find((b) => b.id === 'well')?.currentCount || 0;
      const workshopCount = updatedBuildings.find((b) => b.id === 'workshop')?.currentCount || 0;

      const newCap = calculatePopulationCapacity(hutCount);
      const newMaxStorage = calculateMaxStorage(storageCount);

      const { xp, level, xpToNextLevel } = awardXp(
        prev.civilization.xp,
        prev.civilization.level,
        25
      );

      const unlockedIds = new Set(prev.technologies.filter((t) => t.unlocked).map((t) => t.id));
      const updatedMissions = evaluateMissions(prev.missions, {
        gatheredWoodTotal: prev.gatheredTotals.wood,
        hutCount,
        farmCount,
        wellCount,
        workshopCount,
        population: prev.civilization.population,
        unlockedTechIds: unlockedIds,
      });

      const currentEraTitle = prev.historicalEras.find((e) => e.id === prev.activeEraId)?.title || 'Early Settlements';

      const updatedEras = checkEraUnlocks(
        prev.historicalEras,
        prev.civilization.population,
        unlockedIds,
        prev.completedChallengeIds,
        currentEraTitle
      );

      const newJournal = [
        createJournalEntry(
          `Constructed ${building.name}`,
          `Erected a new ${building.name.toLowerCase()} in the settlement sector. ${building.shortDescription}`,
          'era',
          currentEraTitle
        ),
        ...prev.journalEntries,
      ];

      addToast(`BUILDING CONSTRUCTED! ${building.name} erected.`, 'success');

      return {
        ...prev,
        resources: newResources,
        resourceList: syncResourceList(newResources),
        buildingSlots: updatedSlots,
        buildings: updatedBuildings,
        civilization: {
          ...prev.civilization,
          populationCapacity: newCap,
          maxStorage: newMaxStorage,
          xp,
          level,
          xpToNextLevel,
        },
        missions: updatedMissions,
        historicalEras: updatedEras,
        journalEntries: newJournal,
        currentObjective: getActiveObjective(updatedMissions),
      };
    });
  };

  // 2.5 Upgrade Structure Handler (3D Settlement)
  const handleUpgradeSlot = (slotId: number) => {
    const slot = gameState.buildingSlots.find((s) => s.id === slotId);
    if (!slot || !slot.buildingId) return;

    const building = gameState.buildings.find((b) => b.id === slot.buildingId);
    if (!building) return;

    const currentLevel = slot.level || 1;
    if (currentLevel >= 3) {
      addToast('Structure is already at maximum tier (Tier 3)!', 'info');
      return;
    }

    const upgradeCost: Partial<Record<ResourceKey, number>> = Object.entries(building.cost).reduce(
      (acc, [k, v]) => {
        acc[k as ResourceKey] = Math.round((v || 0) * (currentLevel * 0.75 + 0.5));
        return acc;
      },
      {} as Partial<Record<ResourceKey, number>>
    );

    const { affordable, missing } = canAfford(gameState.resources, upgradeCost);
    if (!affordable) {
      const missingStr = Object.entries(missing)
        .map(([k, v]) => `${v} ${k}`)
        .join(', ');
      addToast(`Not enough resources to upgrade. Need ${missingStr}`, 'warning');
      return;
    }

    setGameState((prev) => {
      const newResources = deductResources(prev.resources, upgradeCost);
      const nextLevel = currentLevel + 1;

      const updatedSlots = prev.buildingSlots.map((s) => {
        if (s.id === slotId) {
          return { ...s, level: nextLevel };
        }
        return s;
      });

      let extraCap = 0;
      let extraStorage = 0;
      if (building.id === 'hut') extraCap = 2;
      if (building.id === 'storage') extraStorage = 150;

      const { xp, level, xpToNextLevel } = awardXp(
        prev.civilization.xp,
        prev.civilization.level,
        35
      );

      const currentEraTitle =
        prev.historicalEras.find((e) => e.id === prev.activeEraId)?.title || 'Early Settlements';

      const newJournal = [
        createJournalEntry(
          `Upgraded ${building.name} to Tier ${nextLevel}`,
          `Reinforced the ${building.name.toLowerCase()} foundation and masonry in Plot #${slotId}.`,
          'era',
          currentEraTitle
        ),
        ...prev.journalEntries,
      ];

      addToast(`STRUCTURE UPGRADED! ${building.name} reached Tier ${nextLevel}.`, 'success');

      return {
        ...prev,
        resources: newResources,
        resourceList: syncResourceList(newResources),
        buildingSlots: updatedSlots,
        civilization: {
          ...prev.civilization,
          populationCapacity: prev.civilization.populationCapacity + extraCap,
          maxStorage: prev.civilization.maxStorage + extraStorage,
          xp,
          level,
          xpToNextLevel,
        },
        journalEntries: newJournal,
      };
    });
  };

  // 2.6 3D Discovery Reward Handler
  const handleDiscoveryReward = (rewardKnowledge: number, rewardCulture: number, discoveryId: string) => {
    setGameState((prev) => {
      const existingDisc = prev.discoveries.find((d) => d.id === discoveryId);
      if (existingDisc && existingDisc.discovered) return prev;

      const newKnowledge = (prev.resources.knowledge || 0) + rewardKnowledge;
      const newCulture = (prev.resources.culture || 0) + rewardCulture;

      const newResources = {
        ...prev.resources,
        knowledge: newKnowledge,
        culture: newCulture,
      };

      const updatedDiscoveries = prev.discoveries.some((d) => d.id === discoveryId)
        ? prev.discoveries.map((d) => (d.id === discoveryId ? { ...d, discovered: true } : d))
        : [
            ...prev.discoveries,
            {
              id: discoveryId,
              title: discoveryId.replace('disc_', '').replace(/_/g, ' ').toUpperCase(),
              description: 'Archaeological observation from the 3D civilization basin.',
              rewardKnowledge,
              rewardCulture,
              discovered: true,
              discoveredAt: new Date().toISOString(),
            },
          ];

      const { xp, level, xpToNextLevel } = awardXp(
        prev.civilization.xp,
        prev.civilization.level,
        25
      );

      const currentEraTitle =
        prev.historicalEras.find((e) => e.id === prev.activeEraId)?.title || 'Early Settlements';

      const newJournal = [
        createJournalEntry(
          '3D Discovery Recorded',
          `Explorers investigated an ancient archaeological site in the river basin (+${rewardKnowledge} Knowledge).`,
          'discovery',
          currentEraTitle
        ),
        ...prev.journalEntries,
      ];

      addToast(`DISCOVERY UNLOCKED! +${rewardKnowledge} Knowledge · +${rewardCulture} Culture`, 'success');

      return {
        ...prev,
        resources: newResources,
        resourceList: syncResourceList(newResources),
        discoveries: updatedDiscoveries,
        civilization: {
          ...prev.civilization,
          xp,
          level,
          xpToNextLevel,
        },
        journalEntries: newJournal,
      };
    });
  };

  // 3. Grow Community Handler
  const handleGrowCommunity = () => {
    if (
      gameState.resources.food < 20 ||
      gameState.resources.water < 10 ||
      gameState.civilization.population >= gameState.civilization.populationCapacity
    ) {
      if (gameState.civilization.population >= gameState.civilization.populationCapacity) {
        addToast('Build another Hut to increase population capacity!', 'warning');
      } else {
        addToast('Need 20 Food and 10 Water to welcome new community members.', 'warning');
      }
      return;
    }

    setGameState((prev) => {
      const newResources = {
        ...prev.resources,
        food: prev.resources.food - 20,
        water: prev.resources.water - 10,
      };

      const newPop = prev.civilization.population + 1;

      const { xp, level, xpToNextLevel } = awardXp(
        prev.civilization.xp,
        prev.civilization.level,
        20
      );

      const unlockedIds = new Set(prev.technologies.filter((t) => t.unlocked).map((t) => t.id));
      const hutCount = prev.buildings.find((b) => b.id === 'hut')?.currentCount || 0;
      const farmCount = prev.buildings.find((b) => b.id === 'farm')?.currentCount || 0;
      const wellCount = prev.buildings.find((b) => b.id === 'well')?.currentCount || 0;
      const workshopCount = prev.buildings.find((b) => b.id === 'workshop')?.currentCount || 0;

      const updatedMissions = evaluateMissions(prev.missions, {
        gatheredWoodTotal: prev.gatheredTotals.wood,
        hutCount,
        farmCount,
        wellCount,
        workshopCount,
        population: newPop,
        unlockedTechIds: unlockedIds,
      });

      const currentEraTitle = prev.historicalEras.find((e) => e.id === prev.activeEraId)?.title || 'Early Settlements';

      const updatedEras = checkEraUnlocks(
        prev.historicalEras,
        newPop,
        unlockedIds,
        prev.completedChallengeIds,
        currentEraTitle
      );

      const newJournal = [
        createJournalEntry(
          'Community Grew',
          `Welcomed new families to our settlement. Population is now ${newPop}.`,
          'era',
          currentEraTitle
        ),
        ...prev.journalEntries,
      ];

      addToast(`+1 POPULATION! Community expanded to ${newPop}.`, 'success');

      return {
        ...prev,
        resources: newResources,
        resourceList: syncResourceList(newResources),
        civilization: {
          ...prev.civilization,
          population: newPop,
          xp,
          level,
          xpToNextLevel,
        },
        missions: updatedMissions,
        historicalEras: updatedEras,
        journalEntries: newJournal,
        currentObjective: getActiveObjective(updatedMissions),
      };
    });
  };

  // 4. Collect Production Handler
  const handleCollectProduction = () => {
    const { food, water, knowledge } = gameState.storedProduction;
    const total = food + water + knowledge;
    if (total <= 0) {
      addToast('No stored production to collect yet.', 'info');
      return;
    }

    setGameState((prev) => {
      let updatedRes = { ...prev.resources };
      if (food > 0) {
        updatedRes = addResource(updatedRes, 'food', food, prev.civilization.maxStorage).newResources;
      }
      if (water > 0) {
        updatedRes = addResource(updatedRes, 'water', water, prev.civilization.maxStorage).newResources;
      }
      if (knowledge > 0) {
        updatedRes = addResource(updatedRes, 'knowledge', knowledge, prev.civilization.maxStorage).newResources;
      }

      addToast(`HARVEST COLLECTED! +${food} Food, +${water} Water, +${knowledge} Knowledge`, 'success');

      return {
        ...prev,
        resources: updatedRes,
        resourceList: syncResourceList(updatedRes),
        storedProduction: { food: 0, water: 0, knowledge: 0 },
      };
    });
  };

  // 5. Research Technology Handler
  const handleResearch = (techId: string) => {
    const tech = gameState.technologies.find((t) => t.id === techId);
    if (!tech) return;

    const unlockedIds = new Set(gameState.technologies.filter((t) => t.unlocked).map((t) => t.id));
    const { canResearch, reason } = canResearchTechnology(
      tech,
      unlockedIds,
      gameState.resources.knowledge
    );

    if (!canResearch) {
      addToast(reason || 'Cannot research technology', 'warning');
      return;
    }

    setGameState((prev) => {
      const newResources = {
        ...prev.resources,
        knowledge: prev.resources.knowledge - tech.knowledgeCost,
      };

      const updatedTechs = prev.technologies.map((t) =>
        t.id === techId ? { ...t, unlocked: true } : t
      );

      const newUnlockedIds = new Set(updatedTechs.filter((t) => t.unlocked).map((t) => t.id));

      const updatedBuildings = prev.buildings.map((b) => {
        if (b.requiredTech && newUnlockedIds.has(b.requiredTech)) {
          return { ...b, status: 'AVAILABLE' as const };
        }
        return b;
      });

      const { xp, level, xpToNextLevel } = awardXp(
        prev.civilization.xp,
        prev.civilization.level,
        40
      );

      const hutCount = updatedBuildings.find((b) => b.id === 'hut')?.currentCount || 0;
      const farmCount = updatedBuildings.find((b) => b.id === 'farm')?.currentCount || 0;
      const wellCount = updatedBuildings.find((b) => b.id === 'well')?.currentCount || 0;
      const workshopCount = updatedBuildings.find((b) => b.id === 'workshop')?.currentCount || 0;

      const updatedMissions = evaluateMissions(prev.missions, {
        gatheredWoodTotal: prev.gatheredTotals.wood,
        hutCount,
        farmCount,
        wellCount,
        workshopCount,
        population: prev.civilization.population,
        unlockedTechIds: newUnlockedIds,
      });

      const currentEraTitle = prev.historicalEras.find((e) => e.id === prev.activeEraId)?.title || 'Early Settlements';

      const updatedEras = checkEraUnlocks(
        prev.historicalEras,
        prev.civilization.population,
        newUnlockedIds,
        prev.completedChallengeIds,
        currentEraTitle
      );

      const newJournal = [
        createJournalEntry(
          `Discovered ${tech.name}`,
          tech.description,
          'discovery',
          currentEraTitle
        ),
        ...prev.journalEntries,
      ];

      addToast(`TECHNOLOGY UNLOCKED! ${tech.name} researched.`, 'success');

      return {
        ...prev,
        resources: newResources,
        resourceList: syncResourceList(newResources),
        technologies: updatedTechs,
        buildings: updatedBuildings,
        civilization: {
          ...prev.civilization,
          xp,
          level,
          xpToNextLevel,
        },
        missions: updatedMissions,
        historicalEras: updatedEras,
        journalEntries: newJournal,
        currentObjective: getActiveObjective(updatedMissions),
      };
    });
  };

  // 6. Explore Location Handler
  const handleExploreLocation = (locationId: string) => {
    const now = Date.now();
    const cdEnd = exploreCooldowns[locationId] || 0;
    if (cdEnd > now) return;

    setExploreCooldowns((prev) => ({
      ...prev,
      [locationId]: now + 3500,
    }));

    setGameState((prev) => {
      let updatedRes = { ...prev.resources };
      let lootToast = '';

      if (locationId === 'river') {
        updatedRes = addResource(updatedRes, 'water', 10, prev.civilization.maxStorage).newResources;
        updatedRes = addResource(updatedRes, 'knowledge', 5, prev.civilization.maxStorage).newResources;
        lootToast = '+10 Water, +5 Knowledge';
      } else if (locationId === 'forest') {
        updatedRes = addResource(updatedRes, 'wood', 15, prev.civilization.maxStorage).newResources;
        updatedRes = addResource(updatedRes, 'knowledge', 5, prev.civilization.maxStorage).newResources;
        lootToast = '+15 Wood, +5 Knowledge';
      } else if (locationId === 'hills') {
        updatedRes = addResource(updatedRes, 'stone', 10, prev.civilization.maxStorage).newResources;
        updatedRes = addResource(updatedRes, 'metal', 5, prev.civilization.maxStorage).newResources;
        updatedRes = addResource(updatedRes, 'knowledge', 5, prev.civilization.maxStorage).newResources;
        lootToast = '+10 Stone, +5 Metal, +5 Knowledge';
      } else if (locationId === 'ancient_site') {
        updatedRes = addResource(updatedRes, 'knowledge', 10, prev.civilization.maxStorage).newResources;
        updatedRes = addResource(updatedRes, 'culture', 5, prev.civilization.maxStorage).newResources;
        lootToast = '+10 Knowledge, +5 Culture';
      }

      addToast(`EXPEDITION RETURNED! ${lootToast}`, 'info');

      // Check discovery
      let updatedDiscoveries = [...prev.discoveries];
      const targetDisc = updatedDiscoveries.find(
        (d) =>
          !d.discovered &&
          ((locationId === 'river' && d.id === 'disc_river_flow') ||
            (locationId === 'forest' && d.id === 'disc_timber_joinery') ||
            (locationId === 'hills' && d.id === 'disc_copper_traces') ||
            (locationId === 'ancient_site' && d.id === 'disc_ancient_markings'))
      );

      const currentEraTitle = prev.historicalEras.find((e) => e.id === prev.activeEraId)?.title || 'Early Settlements';
      let newJournal = [...prev.journalEntries];

      if (targetDisc) {
        targetDisc.discovered = true;
        updatedRes = addResource(updatedRes, 'knowledge', targetDisc.rewardKnowledge, prev.civilization.maxStorage).newResources;
        updatedRes = addResource(updatedRes, 'culture', targetDisc.rewardCulture, prev.civilization.maxStorage).newResources;

        newJournal.unshift(
          createJournalEntry(
            `Discovery: ${targetDisc.title}`,
            targetDisc.description,
            'discovery',
            currentEraTitle
          )
        );

        addToast(`DISCOVERY FOUND! ${targetDisc.title}`, 'level');
      }

      // Chance to unearth an artifact for the museum
      let updatedArtifacts = [...prev.artifacts];
      const undiscoveredRelic = updatedArtifacts.find((a) => !a.discovered);
      if (undiscoveredRelic && Math.random() > 0.45) {
        undiscoveredRelic.discovered = true;
        undiscoveredRelic.discoveredAt = currentEraTitle;
        updatedRes = addResource(updatedRes, 'knowledge', undiscoveredRelic.rewardKnowledge, prev.civilization.maxStorage).newResources;

        newJournal.unshift(
          createJournalEntry(
            `Artifact Unearthed: ${undiscoveredRelic.name}`,
            `Scouts uncovered an ancient relic from ${undiscoveredRelic.region}. Added to My Civilization Museum!`,
            'artifact',
            currentEraTitle
          )
        );

        addToast(`ARTIFACT UNEARTHED! ${undiscoveredRelic.name} added to Museum`, 'level');
      }

      const { xp, level, xpToNextLevel } = awardXp(
        prev.civilization.xp,
        prev.civilization.level,
        15
      );

      return {
        ...prev,
        resources: updatedRes,
        resourceList: syncResourceList(updatedRes),
        discoveries: updatedDiscoveries,
        artifacts: updatedArtifacts,
        journalEntries: newJournal,
        civilization: {
          ...prev.civilization,
          xp,
          level,
          xpToNextLevel,
        },
      };
    });
  };

  // 7. Claim Mission Reward
  const handleClaimReward = (missionId: string) => {
    setGameState((prev) => {
      const mission = prev.missions.find((m) => m.id === missionId);
      if (!mission || !mission.completed || mission.claimed) return prev;

      let updatedRes = { ...prev.resources };
      if (mission.rewardResource) {
        updatedRes = addResource(
          updatedRes,
          mission.rewardResource.resource,
          mission.rewardResource.amount,
          prev.civilization.maxStorage
        ).newResources;
      }

      const { xp, level, xpToNextLevel } = awardXp(
        prev.civilization.xp,
        prev.civilization.level,
        mission.rewardXp
      );

      const updatedMissions = prev.missions.map((m) =>
        m.id === missionId ? { ...m, claimed: true } : m
      );

      const currentEraTitle = prev.historicalEras.find((e) => e.id === prev.activeEraId)?.title || 'Early Settlements';

      const newJournal = [
        createJournalEntry(
          `Mission Completed: ${mission.title}`,
          `Accomplished goal: ${mission.description}. Received ${mission.rewardText}`,
          'era',
          currentEraTitle
        ),
        ...prev.journalEntries,
      ];

      addToast(`MISSION COMPLETED! Awarded ${mission.rewardText}`, 'success');

      return {
        ...prev,
        resources: updatedRes,
        resourceList: syncResourceList(updatedRes),
        missions: updatedMissions,
        journalEntries: newJournal,
        currentObjective: getActiveObjective(updatedMissions),
        civilization: {
          ...prev.civilization,
          xp,
          level,
          xpToNextLevel,
        },
      };
    });
  };

  // 8. Era Challenge Completed Handler
  const handleCompleteChallenge = (
    challengeId: string,
    optionId: string,
    rewardKnowledge: number,
    rewardCulture: number
  ) => {
    setGameState((prev) => {
      let updatedRes = addResource(prev.resources, 'knowledge', rewardKnowledge, prev.civilization.maxStorage).newResources;
      updatedRes = addResource(updatedRes, 'culture', rewardCulture, prev.civilization.maxStorage).newResources;

      const newCompleted = [...prev.completedChallengeIds, challengeId];

      const currentEraTitle = prev.historicalEras.find((e) => e.id === prev.activeEraId)?.title || 'Early Settlements';

      const unlockedIds = new Set(prev.technologies.filter((t) => t.unlocked).map((t) => t.id));
      const updatedEras = checkEraUnlocks(
        prev.historicalEras,
        prev.civilization.population,
        unlockedIds,
        newCompleted,
        currentEraTitle
      );

      const { xp, level, xpToNextLevel } = awardXp(
        prev.civilization.xp,
        prev.civilization.level,
        50
      );

      const newJournal = [
        createJournalEntry(
          'Completed Historical Challenge',
          `Successfully solved era challenge with strategy option "${optionId}". Gained +${rewardKnowledge} Knowledge and +${rewardCulture} Culture.`,
          'challenge',
          currentEraTitle
        ),
        ...prev.journalEntries,
      ];

      addToast(`CHALLENGE COMPLETED! +${rewardKnowledge} Knowledge, +${rewardCulture} Culture`, 'level');

      return {
        ...prev,
        resources: updatedRes,
        resourceList: syncResourceList(updatedRes),
        completedChallengeIds: newCompleted,
        historicalEras: updatedEras,
        journalEntries: newJournal,
        civilization: {
          ...prev.civilization,
          xp,
          level,
          xpToNextLevel,
        },
      };
    });
  };

  // 9. Historical Event Dilemma Resolved Handler
  const handleResolveEvent = (eventId: string, optionId: string) => {
    const event = HISTORICAL_EVENTS.find((e) => e.id === eventId);
    if (!event) return;
    const option = event.options.find((o) => o.id === optionId);
    if (!option) return;

    setGameState((prev) => {
      let updatedRes = { ...prev.resources };

      if (option.knowledgeReward) {
        updatedRes = addResource(updatedRes, 'knowledge', option.knowledgeReward, prev.civilization.maxStorage).newResources;
      }
      if (option.cultureReward) {
        updatedRes = addResource(updatedRes, 'culture', option.cultureReward, prev.civilization.maxStorage).newResources;
      }
      if (option.resourceBonus) {
        const resKey = option.resourceBonus.resource as ResourceKey;
        updatedRes = addResource(updatedRes, resKey, option.resourceBonus.amount, prev.civilization.maxStorage).newResources;
      }

      const currentEraTitle = prev.historicalEras.find((e) => e.id === prev.activeEraId)?.title || 'Early Settlements';

      const newJournal = [
        createJournalEntry(
          `Event: ${event.title}`,
          `Addressed historical situation: ${option.label}. ${option.gameEffectText}`,
          'event',
          currentEraTitle
        ),
        ...prev.journalEntries,
      ];

      addToast(`HISTORICAL DECISION ENACTED: ${option.gameEffectText}`, 'info');

      return {
        ...prev,
        resources: updatedRes,
        resourceList: syncResourceList(updatedRes),
        journalEntries: newJournal,
      };
    });
  };

  // 10. Switch Active Era
  const handleSelectEra = (eraId: string) => {
    const era = gameState.historicalEras.find((e) => e.id === eraId);
    if (!era || !era.unlocked) return;

    setGameState((prev) => {
      const newJournal = [
        createJournalEntry(
          `Focused on Chapter ${era.chapterNumber}: ${era.title}`,
          `Civilization focus shifted to ${era.title} (${era.approximateTimeDescription}).`,
          'era',
          era.title
        ),
        ...prev.journalEntries,
      ];

      return {
        ...prev,
        activeEraId: era.id,
        era: {
          id: era.chapterNumber,
          name: era.title.toUpperCase(),
          shortDescription: era.subtitle,
          historicalContext: era.description,
        },
        journalEntries: newJournal,
      };
    });

    addToast(`Switched civilization focus to ${era.title}`, 'info');
  };

  // 11. Reset Game Handler
  const handleResetGame = () => {
    clearSavedGame();
    setGameState(INITIAL_GAME_STATE);
    setNodeCooldowns({});
    setExploreCooldowns({});
    addToast('Civilization reset to initial settlement state.', 'info');
  };

  // 12. SIH Demo Mode Handlers
  const handleLaunchDemoMode = () => {
    const harappanEra = gameState.historicalEras.find((e) => e.id === 'harappan_civilization') || gameState.historicalEras[1];
    const demoUpdatedEras = gameState.historicalEras.map((e) =>
      e.id === 'early_settlements' || e.id === 'harappan_civilization'
        ? { ...e, unlocked: true }
        : e
    );

    const demoTechs = gameState.technologies.map((t) =>
      ['fire', 'agriculture', 'pottery', 'tools'].includes(t.id) ? { ...t, unlocked: true } : t
    );

    const demoArtifacts = gameState.artifacts.map((a, i) =>
      i < 3 ? { ...a, discovered: true, discoveredAt: 'Indus / Harappan Civilization' } : a
    );

    const demoResources = {
      food: 420,
      water: 350,
      wood: 280,
      stone: 210,
      metal: 90,
      knowledge: 180,
      culture: 65,
      trade: 45,
    };

    const demoState: GameState = {
      ...gameState,
      isDemoMode: true,
      activeEraId: 'harappan_civilization',
      historicalEras: demoUpdatedEras,
      era: {
        id: harappanEra.chapterNumber,
        name: harappanEra.title.toUpperCase(),
        shortDescription: harappanEra.subtitle,
        historicalContext: harappanEra.description,
      },
      resources: demoResources,
      resourceList: syncResourceList(demoResources),
      technologies: demoTechs,
      artifacts: demoArtifacts,
      civilization: {
        ...gameState.civilization,
        name: 'Harappan Prototype',
        level: 3,
        xp: 260,
        population: 8,
        populationCapacity: 12,
        maxStorage: 750,
      },
    };

    setGameState(demoState);
    setIsPlaying(true);
    addToast('✨ SIH DEMO MODE: Harappan Civilization Chapter loaded with demonstration state.', 'level');
  };

  const handleResetDemo = () => {
    const saved = loadGameState();
    setGameState(saved || INITIAL_GAME_STATE);
    addToast('SIH Demo Mode exited. Normal civilization restored.', 'info');
  };

  // Evaluate achievements when game state evolves
  useEffect(() => {
    const { updatedAchievements, newlyUnlocked } = evaluateAchievements(gameState);
    if (newlyUnlocked.length > 0) {
      newlyUnlocked.forEach((ach) => {
        addToast(`🏆 MILESTONE UNLOCKED! ${ach.title}: ${ach.description}`, 'level');
      });
      setGameState((prev) => ({
        ...prev,
        achievements: updatedAchievements,
      }));
    }
  }, [gameState, addToast]);

  return (
    <div className="min-h-screen bg-stone-950 font-sans text-stone-100 antialiased selection:bg-amber-800 selection:text-amber-100">
      {!isPlaying ? (
        <StartScreen
          onStartJourney={() => setIsPlaying(true)}
          onOpenAuthModal={() => setIsStartAuthModalOpen(true)}
          onOpenLearnMode={() => {
            setActiveTab('LEARN');
            setIsPlaying(true);
          }}
          onLaunchDemoMode={handleLaunchDemoMode}
        />
      ) : (
        <GameScreen
          gameState={gameState}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onReturnToStart={() => setIsPlaying(false)}
          onGatherResource={handleGatherResource}
          onBuild={handleBuild}
          onUpgradeSlot={handleUpgradeSlot}
          onDiscoveryReward={handleDiscoveryReward}
          addToast={addToast}
          onResearch={handleResearch}
          onExploreLocation={handleExploreLocation}
          onClaimReward={handleClaimReward}
          onCollectProduction={handleCollectProduction}
          onGrowCommunity={handleGrowCommunity}
          onResetGame={handleResetGame}
          onSaveCloudNow={handleSaveCloudNow}
          onCloudAuthSuccess={handleCloudAuthSuccess}
          onResetDemo={handleResetDemo}
          nodeCooldowns={nodeCooldowns}
          exploreCooldowns={exploreCooldowns}
          notifications={notifications}
          onDismissNotification={dismissNotification}
          onSelectEra={handleSelectEra}
          onCompleteChallenge={handleCompleteChallenge}
          onResolveEvent={handleResolveEvent}
        />
      )}

      {/* Start Screen Auth Modal */}
      <AuthModal
        isOpen={isStartAuthModalOpen}
        onClose={() => setIsStartAuthModalOpen(false)}
        onAuthSuccess={(cloudState) => {
          handleCloudAuthSuccess(cloudState);
          setIsPlaying(true);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BharatGame />
    </AuthProvider>
  );
}
