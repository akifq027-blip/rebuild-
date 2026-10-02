/**
 * BHARAT — Build the Civilization
 * Main Game Screen (Part 4 Full-Stack with AI Acharya & Cloud Sync)
 */

import React, { useState } from 'react';
import { GameState, GameTab, ToastNotification } from '../types/game';
import { HistoricalEra, EraChallenge, HistoricalEvent } from '../types/history';
import { ERA_CHALLENGES, HISTORICAL_EVENTS, HISTORICAL_ERAS } from '../data/historicalData';
import { INITIAL_EXPLORATION_LOCATIONS } from '../game/exploration';
import { Header } from '../components/common/Header';
import { ResourceBar } from '../components/common/ResourceBar';
import { NavigationTabs } from '../components/navigation/NavigationTabs';
import { CivilizationMap } from '../components/map/CivilizationMap';
import { Civilization3DCanvas } from '../game/3d/Civilization3DCanvas';
import { BuildingPanel } from '../components/buildings/BuildingPanel';
import { MissionsPanel } from '../components/panels/MissionsPanel';
import { TechnologyPanel } from '../components/panels/TechnologyPanel';
import { ExplorationPanel } from '../components/panels/ExplorationPanel';
import { ArtifactMuseumPanel } from '../components/history/ArtifactMuseumPanel';
import { LearnModePanel } from '../components/history/LearnModePanel';
import { HistoricalSubcontinentMap } from '../components/map/HistoricalSubcontinentMap';
import { JourneyTimelineModal } from '../components/history/JourneyTimelineModal';
import { CivilizationProgressionModal } from '../components/history/CivilizationProgressionModal';
import { EraTransitionModal } from '../components/history/EraTransitionModal';
import { EraChallengeModal } from '../components/history/EraChallengeModal';
import { HistoricalEventModal } from '../components/history/HistoricalEventModal';
import { PlayerJournalModal } from '../components/history/PlayerJournalModal';
import { ResetModal } from '../components/panels/ResetModal';
import { AcharyaCard } from '../components/common/AcharyaCard';
import { AcharyaDrawer } from '../components/acharya/AcharyaDrawer';
import { AuthModal } from '../components/auth/AuthModal';
import { ProfileModal } from '../components/auth/ProfileModal';
import { AchievementsModal } from '../components/panels/AchievementsModal';
import { SourcesModal } from '../components/history/SourcesModal';
import { HowToPlayModal } from '../components/common/HowToPlayModal';
import { FirstTimeTutorialModal } from '../components/common/FirstTimeTutorialModal';
import { AdminModal } from '../components/admin/AdminModal';
import { EducationalNote } from '../components/common/EducationalNote';
import { NotificationToast } from '../components/common/NotificationToast';
import { Target, ArrowRight, Award, Clock, Sparkles, BookOpen, AlertTriangle, Box, Layers } from 'lucide-react';

interface GameScreenProps {
  gameState: GameState;
  activeTab: GameTab;
  onTabChange: (tab: GameTab) => void;
  onReturnToStart: () => void;
  onGatherResource: (type: 'wood' | 'stone' | 'food' | 'water') => void;
  onBuild: (buildingId: string) => void;
  onUpgradeSlot?: (slotId: number) => void;
  onDiscoveryReward?: (knowledge: number, culture: number, discoveryId: string) => void;
  addToast?: (text: string, type?: 'success' | 'info' | 'warning' | 'level') => void;
  onResearch: (techId: string) => void;
  onExploreLocation: (locationId: string) => void;
  onClaimReward: (missionId: string) => void;
  onCollectProduction: () => void;
  onGrowCommunity: () => void;
  onResetGame: () => void;
  onSaveCloudNow: () => Promise<void>;
  onCloudAuthSuccess: (cloudState?: any) => void;
  nodeCooldowns: Record<string, number>;
  exploreCooldowns: Record<string, number>;
  notifications: ToastNotification[];
  onDismissNotification: (id: string) => void;
  onSelectEra: (eraId: string) => void;
  onCompleteChallenge: (challengeId: string, optionId: string, rewardKnow: number, rewardCult: number) => void;
  onResolveEvent: (eventId: string, optionId: string) => void;
  onResetDemo?: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  gameState,
  activeTab,
  onTabChange,
  onReturnToStart,
  onGatherResource,
  onBuild,
  onUpgradeSlot,
  onDiscoveryReward,
  addToast,
  onResearch,
  onExploreLocation,
  onClaimReward,
  onCollectProduction,
  onGrowCommunity,
  onResetGame,
  onSaveCloudNow,
  onCloudAuthSuccess,
  nodeCooldowns,
  exploreCooldowns,
  notifications,
  onDismissNotification,
  onSelectEra,
  onCompleteChallenge,
  onResolveEvent,
  onResetDemo,
}) => {
  // Modals & Panels
  const [homeViewMode, setHomeViewMode] = useState<'3d' | '2d'>('3d');
  const [isProgressionOpen, setIsProgressionOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAcharyaOpen, setIsAcharyaOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(() => !localStorage.getItem('bharat_tutorial_completed'));
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeChallengeModal, setActiveChallengeModal] = useState<EraChallenge | null>(null);
  const [activeEventModal, setActiveEventModal] = useState<HistoricalEvent | null>(null);
  const [transitionEra, setTransitionEra] = useState<HistoricalEra | null>(null);

  // Safe array lookups with fallbacks
  const historicalEras = gameState?.historicalEras?.length ? gameState.historicalEras : HISTORICAL_ERAS;
  const currentHistoricalEra =
    historicalEras.find((e) => e.id === gameState?.activeEraId) ||
    historicalEras[0];

  const buildingSlots = gameState?.buildingSlots || [];
  const technologies = gameState?.technologies || [];
  const missions = gameState?.missions || [];
  const artifacts = gameState?.artifacts || [];

  // Available slots count
  const availableSlotsCount = buildingSlots.filter((s) => !s.buildingId).length;

  // Badges
  const unclaimedMissionsCount = missions.filter((m) => m.completed && !m.claimed).length;

  const unlockedTechIds = new Set(technologies.filter((t) => t.unlocked).map((t) => t.id));
  const researchableTechCount = technologies.filter(
    (t) =>
      !t.unlocked &&
      (!t.prerequisiteId || unlockedTechIds.has(t.prerequisiteId)) &&
      (gameState?.resources?.knowledge || 0) >= t.knowledgeCost
  ).length;

  const undiscoveredArtifactsCount = artifacts.filter((a) => a.discovered).length;

  // Check if current era has an available challenge
  const eraChallengeKey = currentHistoricalEra?.unlockRequirements?.challengeRequired;
  const isChallengeAvailable =
    eraChallengeKey &&
    ERA_CHALLENGES[eraChallengeKey] &&
    !(gameState?.completedChallengeIds || []).includes(eraChallengeKey);

  const handleLaunchChallenge = () => {
    if (eraChallengeKey && ERA_CHALLENGES[eraChallengeKey]) {
      setActiveChallengeModal(ERA_CHALLENGES[eraChallengeKey]);
    }
  };

  // Trigger test/random historical event
  const handleTriggerEvent = () => {
    const uncompletedEvent = HISTORICAL_EVENTS.find((e) => e.eraId === currentHistoricalEra.id) || HISTORICAL_EVENTS[0];
    setActiveEventModal(uncompletedEvent);
  };

  return (
    <div className="min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-amber-800 selection:text-amber-100 relative">
      {/* 1. Header (Brand, Era, Civ Profile, Level, XP, Timeline Button, Connection & Auth) */}
      <Header
        player={gameState.player}
        civilization={gameState.civilization}
        era={gameState.era}
        currentEraTitle={currentHistoricalEra.title}
        unlockedAchievementsCount={gameState.achievements.filter((a) => a.unlocked).length}
        isDemoMode={Boolean(gameState.isDemoMode)}
        onOpenTimeline={() => setIsTimelineOpen(true)}
        onOpenJournal={() => setIsJournalOpen(true)}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenSources={() => setIsSourcesOpen(true)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onResetDemo={onResetDemo}
        onReturnToStart={onReturnToStart}
      />

      {/* 2. Resource Bar */}
      <ResourceBar
        resources={gameState.resourceList}
        maxStorage={gameState.civilization.maxStorage}
      />

      {/* 3. Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={(tab) => {
          onTabChange(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        missionBadgeCount={unclaimedMissionsCount}
        techBadgeCount={researchableTechCount}
        museumBadgeCount={undiscoveredArtifactsCount}
        onOpenTimeline={() => setIsTimelineOpen(true)}
        onOpenJournal={() => setIsJournalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-5 flex-1 space-y-5">
        {/* Era Banner & Interactive Progression Action Deck */}
        <section className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                CHAPTER {currentHistoricalEra.chapterNumber}
              </span>
              <span className="text-stone-600">·</span>
              <h2 className="font-display font-bold text-base sm:text-lg text-amber-200">
                {currentHistoricalEra.title}
              </h2>
              <span className="text-stone-500">·</span>
              <span className="text-xs text-amber-400/80 font-mono">
                {currentHistoricalEra.approximateTimeDescription}
              </span>
            </div>

            <p className="text-xs text-stone-300 max-w-3xl leading-relaxed">
              {currentHistoricalEra.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-stone-400">
              <span className="font-semibold text-stone-400">Material Culture:</span>
              <span className="text-amber-300/90">{currentHistoricalEra.keyDevelopments.slice(0, 3).join(' · ')}</span>
            </div>
          </div>

          {/* Interactive Historical Progression Deck */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-800">
            {isChallengeAvailable && (
              <button
                onClick={handleLaunchChallenge}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer animate-bounce"
              >
                <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                <span>ERA CHALLENGE AVAILABLE</span>
              </button>
            )}

            <button
              onClick={() => setIsProgressionOpen(true)}
              className="px-3 py-2 bg-gradient-to-r from-amber-900/60 to-stone-900 hover:from-amber-800 text-amber-200 text-xs font-bold rounded-lg border border-amber-700/60 hover:border-amber-500 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="View Civilization Progression Tracker"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Civilization Progress</span>
            </button>

            <button
              onClick={handleTriggerEvent}
              className="px-3 py-2 bg-stone-800 hover:bg-stone-750 text-amber-300 text-xs font-semibold rounded-lg border border-stone-700 hover:border-amber-600 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Historical Dilemma</span>
            </button>

            <button
              onClick={() => setIsTimelineOpen(true)}
              className="px-3 py-2 bg-stone-950 hover:bg-stone-850 text-stone-300 text-xs font-medium rounded-lg border border-stone-800 hover:border-stone-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>Era Catalog</span>
            </button>
          </div>
        </section>

        {/* Dynamic Tab Views */}
        {activeTab === 'HOME' && (
          <div className="space-y-4">
            {/* View Mode Switcher Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-stone-900/90 border border-stone-800 rounded-xl px-4 py-2.5 gap-2 shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  VIEWPORT
                </span>
                <span className="text-xs font-semibold text-stone-200">
                  {homeViewMode === '3d'
                    ? 'Playable 3D Civilization Basin · WASD / Arrows to Walk · E to Interact'
                    : '2D Tactical Grid Overview & Resource Nodes'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-center bg-stone-950 p-1 rounded-lg border border-stone-800">
                <button
                  onClick={() => setHomeViewMode('3d')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    homeViewMode === '3d'
                      ? 'bg-amber-600 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  title="Switch to 3D World"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>3D World</span>
                </button>
                <button
                  onClick={() => setHomeViewMode('2d')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    homeViewMode === '2d'
                      ? 'bg-amber-600 text-stone-950 font-bold shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  title="Switch to 2D Grid"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>2D Grid</span>
                </button>
              </div>
            </div>

            {/* 3D World or 2D Tactical View */}
            {homeViewMode === '3d' ? (
              <Civilization3DCanvas
                slots={gameState.buildingSlots}
                buildings={gameState.buildings}
                technologies={gameState.technologies}
                currentResources={gameState.resources}
                onGatherResource={onGatherResource}
                onBuild={onBuild}
                onUpgradeSlot={onUpgradeSlot}
                onDiscoveryReward={onDiscoveryReward}
                onOpenAcharyaFull={(q) => setIsAcharyaOpen(true)}
                discoveredIds={(gameState.discoveries || []).filter((d) => d.discovered).map((d) => d.id)}
                addToast={addToast}
              />
            ) : (
              <CivilizationMap
                slots={gameState.buildingSlots}
                buildings={gameState.buildings}
                onGatherResource={onGatherResource}
                nodeCooldowns={nodeCooldowns}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <BuildingPanel
                  buildings={gameState.buildings}
                  technologies={gameState.technologies}
                  civilization={gameState.civilization}
                  currentResources={gameState.resources}
                  storedProduction={gameState.storedProduction}
                  availableSlotCount={availableSlotsCount}
                  onBuild={onBuild}
                  onCollectProduction={onCollectProduction}
                  onGrowCommunity={onGrowCommunity}
                />
              </div>

              <div className="space-y-4">
                <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 sm:p-5 text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-sm text-amber-200">
                      COMMUNITY EXPANSION
                    </h3>
                    <span className="text-[10px] text-stone-400">
                      Hearth Growth
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">
                    Welcome new families to cultivate fields and manage civil structures.
                  </p>
                  <div className="text-xs text-stone-300 space-y-1 bg-stone-950/60 p-2.5 rounded-lg border border-stone-800/80">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Required:</span>
                      <span className="font-medium text-amber-400">20 Food · 10 Water</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Capacity:</span>
                      <span className="font-medium text-stone-200">
                        {gameState.civilization.population} / {gameState.civilization.populationCapacity}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={onGrowCommunity}
                    disabled={
                      gameState.resources.food < 20 ||
                      gameState.resources.water < 10 ||
                      gameState.civilization.population >= gameState.civilization.populationCapacity
                    }
                    className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Grow Settlement (+1 Pop)
                  </button>
                </div>

                <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 sm:p-5 text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-sm text-amber-200">
                      CURRENT MISSION
                    </h3>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-stone-200 block">
                      {gameState.currentObjective.title}
                    </span>
                    <p className="text-[11px] text-stone-400">
                      {gameState.currentObjective.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-stone-400">Status:</span>
                    <span className="font-bold text-amber-400">
                      {gameState.currentObjective.progress} / {gameState.currentObjective.target}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'BUILD' && (
          <BuildingPanel
            buildings={gameState.buildings}
            technologies={gameState.technologies}
            civilization={gameState.civilization}
            currentResources={gameState.resources}
            storedProduction={gameState.storedProduction}
            availableSlotCount={availableSlotsCount}
            onBuild={onBuild}
            onCollectProduction={onCollectProduction}
            onGrowCommunity={onGrowCommunity}
          />
        )}

        {activeTab === 'EXPLORE' && (
          <ExplorationPanel
            locations={INITIAL_EXPLORATION_LOCATIONS}
            discoveries={gameState.discoveries}
            onExploreLocation={onExploreLocation}
            activeCooldowns={exploreCooldowns}
          />
        )}

        {activeTab === 'TECHNOLOGY' && (
          <TechnologyPanel
            technologies={gameState.technologies}
            availableKnowledge={gameState.resources.knowledge}
            onResearch={onResearch}
          />
        )}

        {activeTab === 'MISSIONS' && (
          <MissionsPanel
            missions={gameState.missions}
            currentObjective={gameState.currentObjective}
            onClaimReward={onClaimReward}
          />
        )}

        {activeTab === 'MUSEUM' && (
          <ArtifactMuseumPanel
            artifacts={gameState.artifacts}
          />
        )}

        {activeTab === 'MAP' && (
          <HistoricalSubcontinentMap
            currentEraId={gameState.activeEraId}
          />
        )}

        {activeTab === 'LEARN' && (
          <LearnModePanel
            eras={gameState.historicalEras}
            onNavigateToTab={onTabChange}
            onOpenTimeline={() => setIsTimelineOpen(true)}
          />
        )}

        {/* Global Objective Bar */}
        <section className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 sm:p-5 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                  Civilization Milestone
                </span>
                <span className="text-stone-600">·</span>
                <span className="text-xs text-stone-400">
                  {currentHistoricalEra.title}
                </span>
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-stone-100">
                {gameState.currentObjective.title}
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                {gameState.currentObjective.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
            <div className="text-right">
              <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
                Progress
              </span>
              <span className="text-sm font-bold text-amber-400 tabular-nums">
                {gameState.currentObjective.progress} / {gameState.currentObjective.target}
              </span>
            </div>
            <button
              onClick={() => onTabChange('MISSIONS')}
              className="px-3.5 py-2 bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 hover:border-amber-600 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>View Missions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Acharya & Educational Rationale */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AcharyaCard
            onOpenAcharya={() => setIsAcharyaOpen(true)}
            currentEraTitle={currentHistoricalEra.title}
          />
          <EducationalNote />
        </div>
      </main>

      {/* Floating 🤖 ACHARYA Button (Part 4 Feature) */}
      <button
        onClick={() => setIsAcharyaOpen(true)}
        className="fixed bottom-5 right-5 z-40 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs sm:text-sm rounded-full shadow-2xl transition-all duration-200 flex items-center gap-2 cursor-pointer border border-amber-400/60 active:scale-95 group hover:shadow-amber-500/20"
        title="Consult Acharya, your AI Historical Guide"
      >
        <span className="text-base group-hover:scale-110 transition-transform">🤖</span>
        <span>ACHARYA</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </button>

      {/* Footer */}
      <footer className="w-full bg-stone-950 border-t border-stone-900 py-4 px-6 text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BHARAT — BUILD THE CIVILIZATION · Part 4 Full-Stack Architecture</span>
          <span className="text-stone-400">Smart India Hackathon SIH26208 AICTE Challenge · Powered by Express & Aiven MySQL</span>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AcharyaDrawer
        isOpen={isAcharyaOpen}
        onClose={() => setIsAcharyaOpen(false)}
        gameContext={{
          eraTitle: currentHistoricalEra.title,
          eraChapter: currentHistoricalEra.chapterNumber,
          civilizationName: gameState.civilization.name,
          currentObjective: gameState.currentObjective.title,
          population: gameState.civilization.population,
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={onCloudAuthSuccess}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        player={gameState.player}
        civilization={gameState.civilization}
        currentEraTitle={currentHistoricalEra.title}
        onSaveCloudNow={onSaveCloudNow}
        onOpenAuthModal={() => {
          setIsProfileModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      <JourneyTimelineModal
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        eras={gameState.historicalEras}
        currentEraId={gameState.activeEraId}
        onSelectEra={(eraId) => {
          onSelectEra(eraId);
          setIsTimelineOpen(false);
        }}
        artifactsFoundCount={gameState.artifacts.filter((a) => a.discovered).length}
        totalArtifactsCount={gameState.artifacts.length}
      />

      <CivilizationProgressionModal
        isOpen={isProgressionOpen}
        onClose={() => setIsProgressionOpen(false)}
        gameState={gameState}
        onOpenTimeline={() => {
          setIsProgressionOpen(false);
          setIsTimelineOpen(true);
        }}
        onAdvanceEra={(eraId) => {
          onSelectEra(eraId);
          setIsProgressionOpen(false);
        }}
      />

      <EraTransitionModal
        era={transitionEra}
        isOpen={!!transitionEra}
        onEnterEra={() => setTransitionEra(null)}
      />

      <EraChallengeModal
        challenge={activeChallengeModal}
        isOpen={!!activeChallengeModal}
        onClose={() => setActiveChallengeModal(null)}
        onCompleteChallenge={(challengeId, optionId, rKnow, rCult) => {
          onCompleteChallenge(challengeId, optionId, rKnow, rCult);
          setActiveChallengeModal(null);
        }}
      />

      <HistoricalEventModal
        event={activeEventModal}
        isOpen={!!activeEventModal}
        onClose={() => setActiveEventModal(null)}
        onResolveEvent={(eventId, optionId) => {
          onResolveEvent(eventId, optionId);
          setActiveEventModal(null);
        }}
      />

      <PlayerJournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        entries={gameState.journalEntries}
        civilizationName={gameState.civilization.name}
      />

      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={onResetGame}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={gameState.achievements}
      />

      <SourcesModal
        isOpen={isSourcesOpen}
        onClose={() => setIsSourcesOpen(false)}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <FirstTimeTutorialModal
        isOpen={isTutorialOpen}
        onComplete={() => {
          localStorage.setItem('bharat_tutorial_completed', 'true');
          setIsTutorialOpen(false);
        }}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <NotificationToast
        notifications={notifications}
        onDismiss={onDismissNotification}
      />
    </div>
  );
};
