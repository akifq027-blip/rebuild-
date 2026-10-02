/**
 * BHARAT — Build the Civilization
 * Master Strategy Game Shell & Simulation Loop
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActiveCivilizationGameState,
  CoreResourceKey,
  BuildingPlot,
  BuildingCost,
} from '../types/civilization';
import {
  getInitialGameState,
  canAffordCost,
  deductCost,
  calculateTotalStorage,
  calculateTotalPopulationCapacity,
  calculateTotalMilitaryPower,
  persistLocalState,
} from '../game/gameState';
import { BUILDINGS_CATALOG } from '../game/buildingsData';
import { UNITS_CATALOG } from '../game/armyData';
import { ONBOARDING_STEPS } from '../game/missionsData';
import { TopHeaderBar } from '../components/hud/TopHeaderBar';
import { StrategyNavigationDock, GameTabType } from '../components/navigation/StrategyNavigationDock';
import { CivilizationWorldMap } from '../components/world/CivilizationWorldMap';
import { ContextualBuildingPanel } from '../components/panels/ContextualBuildingPanel';
import { BuildCatalogModal } from '../components/panels/BuildCatalogModal';
import { ArmyTrainingPanel } from '../components/panels/ArmyTrainingPanel';
import { ResearchTreePanel } from '../components/panels/ResearchTreePanel';
import { SubcontinentRegionalMap } from '../components/panels/SubcontinentRegionalMap';
import { OnboardingGuide } from '../components/onboarding/OnboardingGuide';
import { MissionsModal } from '../components/panels/MissionsModal';
import { CivilizationGuideModal } from '../components/panels/CivilizationGuideModal';
import { AuthModal } from '../components/auth/AuthModal';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  Shield,
  Clock,
  Landmark,
  CheckCircle,
} from 'lucide-react';

interface CivilizationStrategyGameProps {
  onReturnToTitle?: () => void;
}

export const CivilizationStrategyGame: React.FC<CivilizationStrategyGameProps> = ({
  onReturnToTitle,
}) => {
  const { user, isAuthenticated, saveToServer } = useAuth();

  const [gameState, setGameState] = useState<ActiveCivilizationGameState>(() =>
    getInitialGameState()
  );

  // Modals state
  const [isBuildCatalogOpen, setIsBuildCatalogOpen] = useState(false);
  const [catalogTargetPlotId, setCatalogTargetPlotId] = useState<number | null>(null);
  const [isMissionsModalOpen, setIsMissionsModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = useCallback(
    (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
      setToastMessage({ text, type });
      setTimeout(() => {
        setToastMessage((prev) => (prev?.text === text ? null : prev));
      }, 3500);
    },
    []
  );

  // Auto-save locally whenever state changes
  useEffect(() => {
    persistLocalState(gameState);
  }, [gameState]);

  // Debounced Cloud Save to Backend / Aiven MySQL
  const cloudSaveTimerRef = useRef<any>(null);
  useEffect(() => {
    if (isAuthenticated) {
      if (cloudSaveTimerRef.current) clearTimeout(cloudSaveTimerRef.current);
      cloudSaveTimerRef.current = setTimeout(() => {
        const payload = {
          civilization: {
            name: gameState.overview.name,
            level: gameState.overview.level,
            xp: gameState.overview.xp,
            xpToNextLevel: gameState.overview.xpToNextLevel,
            population: gameState.overview.population,
            populationCapacity: gameState.overview.populationCapacity,
            maxStorage: gameState.overview.maxStorage,
          },
          resources: {
            food: gameState.resources.food,
            wood: gameState.resources.wood,
            stone: gameState.resources.stone,
            clay: gameState.resources.clay,
            knowledge: gameState.resources.knowledge,
          },
          buildingSlots: gameState.plots.map((p) => ({
            id: p.id,
            buildingId: p.buildingId,
            name: p.name,
            level: p.level,
            x: p.gridX,
            y: p.gridY,
          })),
          onboardingStep: gameState.onboardingStep,
        };
        saveToServer(payload).catch(() => {});
      }, 3000);
    }
  }, [gameState, isAuthenticated, saveToServer]);

  // Load cloud progress on initial mount if authenticated
  const hasLoadedCloudRef = useRef(false);
  useEffect(() => {
    async function loadCloud() {
      if (isAuthenticated && !hasLoadedCloudRef.current) {
        hasLoadedCloudRef.current = true;
        try {
          const res = await api.getPlayerState();
          if (res.success && res.data) {
            const data = res.data;
            setGameState((prev) => {
              const updatedRes = { ...prev.resources };
              if (data.resources) {
                if (data.resources.food !== undefined) updatedRes.food = data.resources.food;
                if (data.resources.wood !== undefined) updatedRes.wood = data.resources.wood;
                if (data.resources.stone !== undefined) updatedRes.stone = data.resources.stone;
                if (data.resources.clay !== undefined) updatedRes.clay = data.resources.clay;
                if (data.resources.knowledge !== undefined) updatedRes.knowledge = data.resources.knowledge;
              }

              const updatedOverview = { ...prev.overview };
              if (data.profile) {
                updatedOverview.name = data.profile.civilization_name || prev.overview.name;
                updatedOverview.level = Number(data.profile.civilization_level || prev.overview.level);
                updatedOverview.xp = Number(data.profile.xp ?? prev.overview.xp);
                updatedOverview.population = Number(data.profile.population || prev.overview.population);
              }

              // Update plots if saved
              let updatedPlots = [...prev.plots];
              if (data.progress?.buildingSlots && Array.isArray(data.progress.buildingSlots)) {
                const sMap = new Map(data.progress.buildingSlots.map((s: any) => [s.id, s]));
                updatedPlots = updatedPlots.map((p) => {
                  const saved = sMap.get(p.id) as any;
                  if (saved) {
                    return {
                      ...p,
                      buildingId: saved.buildingId ?? p.buildingId,
                      level: Number(saved.level || p.level),
                    };
                  }
                  return p;
                });
              }

              return {
                ...prev,
                overview: updatedOverview,
                resources: updatedRes,
                plots: updatedPlots,
              };
            });
            showToast('Civilization restored from Aiven Cloud.', 'info');
          }
        } catch {
          // Graceful fallback to local
        }
      }
    }
    loadCloud();
  }, [isAuthenticated, showToast]);

  // Periodic Passive Yield Production (Every 10 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState((prev) => {
        let addedYield: Partial<Record<CoreResourceKey, number>> = {
          food: 0,
          wood: 0,
          stone: 0,
          clay: 0,
          knowledge: 0,
        };

        const updatedPlots = prev.plots.map((plot) => {
          if (!plot.buildingId || plot.isConstructing) return plot;
          const def = BUILDINGS_CATALOG[plot.buildingId];
          if (!def) return plot;

          const prod = def.productionForLevel(plot.level);
          if (prod) {
            // 10s tick = amountPerHour / 360
            const tickAmount = Math.max(1, Math.round(prod.amountPerHour / 360));
            addedYield[prod.resource] = (addedYield[prod.resource] || 0) + tickAmount;
            return {
              ...plot,
              storedYield: Math.min(200, (plot.storedYield || 0) + tickAmount),
            };
          }
          return plot;
        });

        // Add to main resources capped at maxStorage
        const maxStorage = prev.overview.maxStorage;
        const newResources = { ...prev.resources };
        (Object.keys(addedYield) as CoreResourceKey[]).forEach((res) => {
          const add = addedYield[res] || 0;
          if (add > 0) {
            newResources[res] = Math.min(maxStorage, (newResources[res] || 0) + add);
          }
        });

        return {
          ...prev,
          resources: newResources,
          plots: updatedPlots,
        };
      });
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // Award XP and check Civilization level up
  const awardCivilizationXp = useCallback(
    (xpToAdd: number) => {
      setGameState((prev) => {
        const totalXp = prev.overview.xp + xpToAdd;
        let newLevel = prev.overview.level;
        let nextReq = prev.overview.xpToNextLevel;

        if (totalXp >= nextReq) {
          newLevel += 1;
          nextReq = Math.round(nextReq * 1.6);
          showToast(`CIVILIZATION LEVEL ADVANCED! Reached Level ${newLevel}.`, 'success');
        }

        return {
          ...prev,
          overview: {
            ...prev.overview,
            xp: totalXp,
            level: newLevel,
            xpToNextLevel: nextReq,
          },
        };
      });
    },
    [showToast]
  );

  // Check Onboarding Step completion
  const advanceOnboardingIfStep = useCallback((step: number) => {
    setGameState((prev) => {
      if (prev.onboardingStep === step) {
        const nextStep = step + 1;
        const isDone = nextStep > 8;
        return {
          ...prev,
          onboardingStep: nextStep,
          onboardingCompleted: isDone,
        };
      }
      return prev;
    });
  }, []);

  // Handlers for Player Actions
  // 1. Natural Resource Quick Gathering
  const handleQuickHarvestNode = useCallback(
    (res: CoreResourceKey, amount: number) => {
      setGameState((prev) => {
        const current = prev.resources[res] || 0;
        const max = prev.overview.maxStorage;
        if (current >= max) {
          showToast(`Storage capacity reached for ${res.toUpperCase()}! Upgrade Granary.`, 'warning');
          return prev;
        }

        const added = Math.min(amount, max - current);
        const newResources = {
          ...prev.resources,
          [res]: current + added,
        };

        // Advance onboarding if on step 2
        if (prev.onboardingStep === 2) {
          setTimeout(() => advanceOnboardingIfStep(2), 500);
        }

        // Mission update
        const updatedMissions = prev.missions.map((m) => {
          if (m.id === 'm_harvest_timber' && res === 'wood') {
            const nextProgress = Math.min(m.target, m.progress + added);
            return {
              ...m,
              progress: nextProgress,
              completed: nextProgress >= m.target,
            };
          }
          return m;
        });

        return {
          ...prev,
          resources: newResources,
          missions: updatedMissions,
        };
      });

      awardCivilizationXp(5);
    },
    [awardCivilizationXp, advanceOnboardingIfStep, showToast]
  );

  // 2. Select Building Plot
  const handleSelectPlot = useCallback(
    (plotId: number) => {
      setGameState((prev) => {
        // If on onboarding step 1 and selecting civ center (plot 1)
        if (prev.onboardingStep === 1 && plotId === 1) {
          setTimeout(() => advanceOnboardingIfStep(1), 500);
        }
        return {
          ...prev,
          selectedPlotId: plotId,
        };
      });
    },
    [advanceOnboardingIfStep]
  );

  // 3. Collect Stored Yield from a specific plot
  const handleCollectPlotYield = useCallback((plotId: number) => {
    setGameState((prev) => {
      const plot = prev.plots.find((p) => p.id === plotId);
      if (!plot || (plot.storedYield || 0) <= 0 || !plot.buildingId) return prev;

      const def = BUILDINGS_CATALOG[plot.buildingId];
      if (!def) return prev;
      const prod = def.productionForLevel(plot.level);
      if (!prod) return prev;

      const resKey = prod.resource;
      const amount = plot.storedYield || 0;
      const newResources = {
        ...prev.resources,
        [resKey]: Math.min(prev.overview.maxStorage, (prev.resources[resKey] || 0) + amount),
      };

      const updatedPlots = prev.plots.map((p) =>
        p.id === plotId ? { ...p, storedYield: 0, lastCollectedAt: Date.now() } : p
      );

      return {
        ...prev,
        resources: newResources,
        plots: updatedPlots,
      };
    });
    awardCivilizationXp(8);
  }, [awardCivilizationXp]);

  // 4. Collect All Settlement Yields
  const handleCollectAllYields = useCallback(() => {
    setGameState((prev) => {
      const newResources = { ...prev.resources };
      let totalClaimed = 0;

      const updatedPlots = prev.plots.map((p) => {
        if (!p.buildingId || !p.storedYield || p.storedYield <= 0) return p;
        const def = BUILDINGS_CATALOG[p.buildingId];
        if (!def) return p;
        const prod = def.productionForLevel(p.level);
        if (!prod) return p;

        totalClaimed += p.storedYield;
        newResources[prod.resource] = Math.min(
          prev.overview.maxStorage,
          (newResources[prod.resource] || 0) + p.storedYield
        );
        return { ...p, storedYield: 0, lastCollectedAt: Date.now() };
      });

      return {
        ...prev,
        resources: newResources,
        plots: updatedPlots,
      };
    });
    showToast('Collected all settlement resource yields!', 'success');
    awardCivilizationXp(15);
  }, [awardCivilizationXp, showToast]);

  // 5. Construct Building on Empty Plot
  const handleConstructBuilding = useCallback(
    (buildingId: string, plotId: number) => {
      const def = BUILDINGS_CATALOG[buildingId];
      if (!def) return;

      const cost = def.costForLevel(1);
      const { affordable } = canAffordCost(gameState.resources, cost);
      if (!affordable) {
        showToast('Insufficient materials to construct this building!', 'warning');
        return;
      }

      setGameState((prev) => {
        const newResources = deductCost(prev.resources, cost);
        const updatedPlots = prev.plots.map((p) =>
          p.id === plotId
            ? {
                ...p,
                buildingId,
                level: 1,
                lastCollectedAt: Date.now(),
                storedYield: 0,
              }
            : p
        );

        const newStorage = calculateTotalStorage(updatedPlots);
        const newCap = calculateTotalPopulationCapacity(updatedPlots);

        // Advance onboarding if on step 3
        if (prev.onboardingStep === 3) {
          setTimeout(() => advanceOnboardingIfStep(3), 500);
        }

        // Mission update
        const constructedCount = updatedPlots.filter((p) => p.buildingId).length;
        const updatedMissions = prev.missions.map((m) => {
          if (m.id === 'm_construct_structures') {
            return {
              ...m,
              progress: constructedCount,
              completed: constructedCount >= m.target,
            };
          }
          return m;
        });

        const newJournal = [
          {
            id: `j_${Date.now()}`,
            timestamp: `Cycle ${prev.overview.level}`,
            title: `Constructed ${def.name}`,
            description: `Masons and craftsmen erected the ${def.name} (${def.sanskritName}) on Plot #${plotId}.`,
            category: 'construction' as const,
          },
          ...prev.historicalJournal,
        ];

        return {
          ...prev,
          resources: newResources,
          plots: updatedPlots,
          overview: {
            ...prev.overview,
            maxStorage: newStorage,
            populationCapacity: newCap,
          },
          missions: updatedMissions,
          historicalJournal: newJournal,
        };
      });

      showToast(`CONSTRUCTION COMPLETED: ${def.name}!`, 'success');
      awardCivilizationXp(30);
    },
    [gameState.resources, advanceOnboardingIfStep, awardCivilizationXp, showToast]
  );

  // 6. Upgrade Building
  const handleUpgradeBuilding = useCallback(
    (plotId: number) => {
      const plot = gameState.plots.find((p) => p.id === plotId);
      if (!plot || !plot.buildingId) return;
      const def = BUILDINGS_CATALOG[plot.buildingId];
      if (!def || plot.level >= def.maxLevel) return;

      const nextLevel = plot.level + 1;
      const cost = def.costForLevel(nextLevel);
      const { affordable } = canAffordCost(gameState.resources, cost);
      if (!affordable) {
        showToast('Insufficient materials to upgrade this building!', 'warning');
        return;
      }

      setGameState((prev) => {
        const newResources = deductCost(prev.resources, cost);
        const updatedPlots = prev.plots.map((p) =>
          p.id === plotId ? { ...p, level: nextLevel } : p
        );

        const newStorage = calculateTotalStorage(updatedPlots);
        const newCap = calculateTotalPopulationCapacity(updatedPlots);

        // Advance onboarding if on step 4
        if (prev.onboardingStep === 4) {
          setTimeout(() => advanceOnboardingIfStep(4), 500);
        }

        // Mission update
        const civCenterPlot = updatedPlots.find((p) => p.buildingId === 'civ_center');
        const updatedMissions = prev.missions.map((m) => {
          if (m.id === 'm_upgrade_citadel' && civCenterPlot) {
            return {
              ...m,
              progress: civCenterPlot.level,
              completed: civCenterPlot.level >= m.target,
            };
          }
          return m;
        });

        const newJournal = [
          {
            id: `j_${Date.now()}`,
            timestamp: `Cycle ${prev.overview.level}`,
            title: `Upgraded ${def.name} to Level ${nextLevel}`,
            description: `Reinforced the foundations of ${def.name} on Plot #${plotId}.`,
            category: 'construction' as const,
          },
          ...prev.historicalJournal,
        ];

        return {
          ...prev,
          resources: newResources,
          plots: updatedPlots,
          overview: {
            ...prev.overview,
            maxStorage: newStorage,
            populationCapacity: newCap,
          },
          missions: updatedMissions,
          historicalJournal: newJournal,
        };
      });

      showToast(`UPGRADE COMPLETE! ${def.name} reached Level ${nextLevel}.`, 'success');
      awardCivilizationXp(40);
    },
    [gameState.plots, gameState.resources, advanceOnboardingIfStep, awardCivilizationXp, showToast]
  );

  // 7. Research Technology
  const handleResearchTech = useCallback(
    (techId: string) => {
      const tech = gameState.technologies.find((t) => t.id === techId);
      if (!tech || tech.unlocked) return;

      if (gameState.resources.knowledge < tech.knowledgeCost) {
        showToast(`Need ${tech.knowledgeCost - gameState.resources.knowledge} more Knowledge!`, 'warning');
        return;
      }

      setGameState((prev) => {
        const newResources = {
          ...prev.resources,
          knowledge: Math.max(0, prev.resources.knowledge - tech.knowledgeCost),
        };

        const updatedTechs = prev.technologies.map((t) =>
          t.id === techId ? { ...t, unlocked: true } : t
        );

        // Advance onboarding if on step 5
        if (prev.onboardingStep === 5) {
          setTimeout(() => advanceOnboardingIfStep(5), 500);
        }

        // Mission update
        const unlockedCount = updatedTechs.filter((t) => t.unlocked).length;
        const updatedMissions = prev.missions.map((m) => {
          if (m.id === 'm_research_tech') {
            return {
              ...m,
              progress: unlockedCount,
              completed: unlockedCount >= m.target,
            };
          }
          return m;
        });

        const newJournal = [
          {
            id: `j_${Date.now()}`,
            timestamp: `Cycle ${prev.overview.level}`,
            title: `Mastered ${tech.name}`,
            description: `Scholars recorded the treatise of ${tech.name} (${tech.sanskritName}). ${tech.effectSummary}`,
            category: 'discovery' as const,
          },
          ...prev.historicalJournal,
        ];

        return {
          ...prev,
          resources: newResources,
          technologies: updatedTechs,
          missions: updatedMissions,
          historicalJournal: newJournal,
        };
      });

      showToast(`TECHNOLOGY MASTERED: ${tech.name}!`, 'success');
      awardCivilizationXp(50);
    },
    [gameState.technologies, gameState.resources.knowledge, advanceOnboardingIfStep, awardCivilizationXp, showToast]
  );

  // 8. Train Army Units
  const handleTrainUnits = useCallback(
    (unitId: string, count: number) => {
      const unit = UNITS_CATALOG[unitId];
      if (!unit) return;

      const batchCost = {
        food: (unit.cost.food || 0) * count,
        wood: (unit.cost.wood || 0) * count,
        stone: (unit.cost.stone || 0) * count,
        clay: (unit.cost.clay || 0) * count,
      };

      const { affordable } = canAffordCost(gameState.resources, batchCost);
      if (!affordable) {
        showToast('Insufficient materials to drill this regiment!', 'warning');
        return;
      }

      setGameState((prev) => {
        const newResources = deductCost(prev.resources, batchCost);
        const updatedArmy = [...prev.army];
        const existing = updatedArmy.find((a) => a.unitId === unitId);
        if (existing) {
          existing.count += count;
        } else {
          updatedArmy.push({ unitId, count });
        }

        const newPower = calculateTotalMilitaryPower(updatedArmy);

        // Advance onboarding if on step 6
        if (prev.onboardingStep === 6) {
          setTimeout(() => advanceOnboardingIfStep(6), 500);
        }

        // Mission update
        const totalPadati = updatedArmy.find((a) => a.unitId === 'padati')?.count || 0;
        const updatedMissions = prev.missions.map((m) => {
          if (m.id === 'm_recruit_guards') {
            return {
              ...m,
              progress: totalPadati,
              completed: totalPadati >= m.target,
            };
          }
          return m;
        });

        const newJournal = [
          {
            id: `j_${Date.now()}`,
            timestamp: `Cycle ${prev.overview.level}`,
            title: `Mustered ${count} ${unit.name}`,
            description: `Recruited and drilled ${count} ${unit.name} (${unit.sanskritName}) at the martial training pavilion.`,
            category: 'military' as const,
          },
          ...prev.historicalJournal,
        ];

        return {
          ...prev,
          resources: newResources,
          army: updatedArmy,
          overview: {
            ...prev.overview,
            militaryPower: newPower,
          },
          missions: updatedMissions,
          historicalJournal: newJournal,
        };
      });

      showToast(`REGIMENT MUSTERED: +${count} ${unit.name}!`, 'success');
      awardCivilizationXp(25);
    },
    [gameState.resources, advanceOnboardingIfStep, awardCivilizationXp, showToast]
  );

  // 9. Dispatch Regional Expedition
  const handleDispatchExpedition = useCallback(
    (regionId: string) => {
      const region = gameState.regions.find((r) => r.id === regionId);
      if (!region) return;

      if (gameState.overview.militaryPower < region.recommendedPower) {
        showToast(`Requires ${region.recommendedPower} Military Power to explore!`, 'warning');
        return;
      }

      setGameState((prev) => {
        const updatedRegions = prev.regions.map((r) =>
          r.id === regionId ? { ...r, status: 'explored' as const } : r
        );

        // Also unlock the next region in line
        const idx = updatedRegions.findIndex((r) => r.id === regionId);
        if (idx !== -1 && idx + 1 < updatedRegions.length && updatedRegions[idx + 1].status === 'locked') {
          updatedRegions[idx + 1].status = 'unlocked';
        }

        // Grant expedition rewards
        const newResources = {
          ...prev.resources,
          knowledge: prev.resources.knowledge + region.rewards.knowledge,
          wood: prev.resources.wood + (region.rewards.wood || 0),
          stone: prev.resources.stone + (region.rewards.stone || 0),
          clay: prev.resources.clay + (region.rewards.clay || 0),
        };

        // Advance onboarding if on step 8
        if (prev.onboardingStep === 8) {
          setTimeout(() => advanceOnboardingIfStep(8), 500);
        }

        // Mission update
        const updatedMissions = prev.missions.map((m) => {
          if (m.id === 'm_scout_delta') {
            return { ...m, progress: 1, completed: true };
          }
          return m;
        });

        const newJournal = [
          {
            id: `j_${Date.now()}`,
            timestamp: `Cycle ${prev.overview.level}`,
            title: `Expedition Completed: ${region.title}`,
            description: `Scouts surveyed ${region.title} (${region.sanskritName}) and recovered ${region.rewards.knowledge} Knowledge.`,
            category: 'discovery' as const,
          },
          ...prev.historicalJournal,
        ];

        return {
          ...prev,
          regions: updatedRegions,
          resources: newResources,
          missions: updatedMissions,
          historicalJournal: newJournal,
        };
      });

      showToast(`EXPEDITION SUCCESS: ${region.title}! +${region.rewards.knowledge} Knowledge.`, 'success');
      awardCivilizationXp(75);
    },
    [gameState.regions, gameState.overview.militaryPower, advanceOnboardingIfStep, awardCivilizationXp, showToast]
  );

  // 10. Claim Mission Bounty
  const handleClaimMission = useCallback(
    (missionId: string) => {
      const mission = gameState.missions.find((m) => m.id === missionId);
      if (!mission || !mission.completed || mission.claimed) return;

      setGameState((prev) => {
        const newResources = { ...prev.resources };
        (Object.keys(mission.rewardResources) as CoreResourceKey[]).forEach((resKey) => {
          newResources[resKey] = Math.min(
            prev.overview.maxStorage,
            (newResources[resKey] || 0) + (mission.rewardResources[resKey] || 0)
          );
        });
        newResources.knowledge += mission.rewardKnowledge;

        const updatedMissions = prev.missions.map((m) =>
          m.id === missionId ? { ...m, claimed: true } : m
        );

        // Advance onboarding if on step 7
        if (prev.onboardingStep === 7) {
          setTimeout(() => advanceOnboardingIfStep(7), 500);
        }

        return {
          ...prev,
          resources: newResources,
          missions: updatedMissions,
        };
      });

      showToast(`BOUNTY CLAIMED: +${mission.rewardKnowledge} Vidya · +${mission.rewardXp} XP!`, 'success');
      awardCivilizationXp(mission.rewardXp);
    },
    [gameState.missions, advanceOnboardingIfStep, awardCivilizationXp, showToast]
  );

  // Computed badges
  const selectedPlot = gameState.plots.find((p) => p.id === gameState.selectedPlotId) || null;
  const civCenterLevel =
    gameState.plots.find((p) => p.buildingId === 'civ_center')?.level || 1;
  const trainingGroundLevel =
    gameState.plots.find((p) => p.buildingId === 'training_ground')?.level || 0;

  const unlockedTechIds = new Set(
    gameState.technologies.filter((t) => t.unlocked).map((t) => t.id)
  );
  const existingBuildingIds = new Set(
    gameState.plots.filter((p) => p.buildingId).map((p) => p.buildingId as string)
  );

  const availableResearchCount = gameState.technologies.filter(
    (t) =>
      !t.unlocked &&
      t.prerequisites.every((p) => unlockedTechIds.has(p)) &&
      gameState.resources.knowledge >= t.knowledgeCost
  ).length;

  const unclaimedMissionsCount = gameState.missions.filter(
    (m) => m.completed && !m.claimed
  ).length;

  return (
    <div className="min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col justify-between select-none relative pb-16 sm:pb-20">
      {/* 1. Top HUD Bar */}
      <TopHeaderBar
        overview={gameState.overview}
        resources={gameState.resources}
        onboardingStep={gameState.onboardingStep}
        onboardingCompleted={gameState.onboardingCompleted}
        onOpenMissions={() => setIsMissionsModalOpen(true)}
        onOpenHelp={() => setIsGuideModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onReturnToTitle={onReturnToTitle}
        isAuthenticated={isAuthenticated}
        userEmail={user?.email}
      />

      {/* 2. Guided Interactive Onboarding Step */}
      <OnboardingGuide
        currentStepNumber={gameState.onboardingStep}
        onboardingCompleted={gameState.onboardingCompleted}
        onActionClick={(tab) => {
          if (tab) {
            setGameState((prev) => ({ ...prev, activeTab: tab as GameTabType }));
          } else if (gameState.onboardingStep === 1) {
            handleSelectPlot(1);
          } else if (gameState.onboardingStep === 7) {
            setIsMissionsModalOpen(true);
          }
        }}
        onDismissGuide={() => {
          setGameState((prev) => ({ ...prev, onboardingCompleted: true }));
        }}
      />

      {/* 3. Main Center Content Viewport */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-5 py-3 flex-1 flex flex-col space-y-4">
        {/* TAB 1: HOME — Playable Civilization Landscape */}
        {gameState.activeTab === 'HOME' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Desktop Left Quick-Intel Sidebar */}
            <div className="hidden lg:flex lg:col-span-3 flex-col gap-3">
              {/* Civic Status Card */}
              <div className="bg-stone-900/90 border border-amber-900/50 rounded-2xl p-4 shadow-xl space-y-3 text-left">
                <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                  <Landmark className="w-4 h-4 text-amber-400" />
                  <span className="font-display font-bold text-xs uppercase tracking-wider text-amber-200">
                    Sovereign Overview
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Civilization:</span>
                    <span className="font-semibold text-amber-100">{gameState.overview.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Total Plots Built:</span>
                    <span className="font-bold text-stone-100 font-mono">
                      {gameState.plots.filter((p) => p.buildingId).length} / 12
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Military Strength:</span>
                    <span className="font-bold text-red-300 font-mono">
                      {gameState.overview.militaryPower} PWR
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Granary Limit:</span>
                    <span className="font-bold text-stone-100 font-mono">
                      {gameState.overview.maxStorage}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMissionsModalOpen(true)}
                  className="w-full py-2 px-3 bg-amber-950/70 hover:bg-amber-900 border border-amber-700/60 text-amber-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Royal Decrees</span>
                  </span>
                  {unclaimedMissionsCount > 0 && (
                    <span className="bg-red-600 text-white font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {unclaimedMissionsCount} Ready
                    </span>
                  )}
                </button>
              </div>

              {/* Historical Journal Feed */}
              <div className="bg-stone-900/90 border border-amber-900/50 rounded-2xl p-4 shadow-xl space-y-2.5 text-left max-h-[300px] overflow-y-auto">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-mono block border-b border-stone-800 pb-1.5">
                  Subcontinental Chronicles
                </span>
                <div className="space-y-2">
                  {gameState.historicalJournal.slice(0, 4).map((j) => (
                    <div key={j.id} className="text-xs space-y-0.5 border-b border-stone-850 pb-1.5">
                      <span className="text-[9px] text-stone-500 font-mono block">{j.timestamp}</span>
                      <strong className="text-stone-200 font-semibold block text-[11px]">{j.title}</strong>
                      <p className="text-[10px] text-stone-400 leading-tight line-clamp-2">{j.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center: Playable Civilization Landscape */}
            <div className="lg:col-span-6 w-full">
              <CivilizationWorldMap
                plots={gameState.plots}
                selectedPlotId={gameState.selectedPlotId}
                onSelectPlot={handleSelectPlot}
                onQuickHarvestNode={handleQuickHarvestNode}
                onCollectPlotYield={handleCollectPlotYield}
                onCollectAllYields={handleCollectAllYields}
                onOpenBuildCatalogForPlot={(plotId) => {
                  setCatalogTargetPlotId(plotId);
                  setIsBuildCatalogOpen(true);
                }}
              />
            </div>

            {/* Right: Contextual Building Panel */}
            <div className="lg:col-span-3 w-full">
              <ContextualBuildingPanel
                plot={selectedPlot}
                currentResources={gameState.resources}
                civCenterLevel={civCenterLevel}
                onClose={() => setGameState((prev) => ({ ...prev, selectedPlotId: null }))}
                onUpgradeBuilding={handleUpgradeBuilding}
                onOpenBuildCatalog={(plotId) => {
                  setCatalogTargetPlotId(plotId);
                  setIsBuildCatalogOpen(true);
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 2: BUILD — Architectural Catalog */}
        {gameState.activeTab === 'BUILD' && (
          <div className="space-y-4">
            <BuildCatalogModal
              isOpen={true}
              onClose={() => setGameState((prev) => ({ ...prev, activeTab: 'HOME' }))}
              targetPlot={selectedPlot || gameState.plots.find((p) => !p.buildingId) || gameState.plots[1]}
              currentResources={gameState.resources}
              civCenterLevel={civCenterLevel}
              unlockedTechIds={unlockedTechIds}
              existingBuildingIds={existingBuildingIds}
              onConstructBuilding={(bId, pId) => {
                handleConstructBuilding(bId, pId);
                setGameState((prev) => ({ ...prev, activeTab: 'HOME' }));
              }}
            />
          </div>
        )}

        {/* TAB 3: ARMY — Martial Akhada */}
        {gameState.activeTab === 'ARMY' && (
          <ArmyTrainingPanel
            army={gameState.army}
            currentResources={gameState.resources}
            trainingGroundLevel={trainingGroundLevel}
            unlockedTechIds={unlockedTechIds}
            onTrainUnits={handleTrainUnits}
          />
        )}

        {/* TAB 4: MAP — Subcontinental Expeditions */}
        {gameState.activeTab === 'MAP' && (
          <SubcontinentRegionalMap
            regions={gameState.regions}
            playerMilitaryPower={gameState.overview.militaryPower}
            onDispatchExpedition={handleDispatchExpedition}
          />
        )}

        {/* TAB 5: RESEARCH — Gurukula Tech Tree */}
        {gameState.activeTab === 'RESEARCH' && (
          <ResearchTreePanel
            technologies={gameState.technologies}
            currentKnowledge={gameState.resources.knowledge}
            onResearchTech={handleResearchTech}
          />
        )}
      </main>

      {/* 4. Strategy Navigation Dock (Fixed Bottom on Mobile, Atmospheric on Desktop) */}
      <StrategyNavigationDock
        activeTab={gameState.activeTab}
        onTabChange={(tab) => {
          setGameState((prev) => ({ ...prev, activeTab: tab }));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        availableBuildCount={gameState.plots.filter((p) => !p.buildingId).length}
        availableResearchCount={availableResearchCount}
        unclaimedMissionsCount={unclaimedMissionsCount}
      />

      {/* 5. Standalone Build Catalog Modal if triggered from a plot */}
      {isBuildCatalogOpen && catalogTargetPlotId && (
        <BuildCatalogModal
          isOpen={isBuildCatalogOpen}
          onClose={() => {
            setIsBuildCatalogOpen(false);
            setCatalogTargetPlotId(null);
          }}
          targetPlot={gameState.plots.find((p) => p.id === catalogTargetPlotId) || null}
          currentResources={gameState.resources}
          civCenterLevel={civCenterLevel}
          unlockedTechIds={unlockedTechIds}
          existingBuildingIds={existingBuildingIds}
          onConstructBuilding={handleConstructBuilding}
        />
      )}

      {/* 6. Missions Modal */}
      <MissionsModal
        isOpen={isMissionsModalOpen}
        onClose={() => setIsMissionsModalOpen(false)}
        missions={gameState.missions}
        onClaimMission={handleClaimMission}
      />

      {/* 7. Civilization Guide / Encyclopedia */}
      <CivilizationGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* 8. Auth / Aiven Cloud Persistence Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => {
          setIsAuthModalOpen(false);
          showToast('Signed in! Your civilization is synced with Aiven Cloud.', 'success');
        }}
      />

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
          <div
            className={`px-4 py-2 rounded-xl shadow-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
              toastMessage.type === 'warning'
                ? 'bg-red-950/90 border-red-700 text-red-200'
                : toastMessage.type === 'info'
                ? 'bg-sky-950/90 border-sky-700 text-sky-200'
                : 'bg-emerald-950/90 border-emerald-600 text-emerald-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};
