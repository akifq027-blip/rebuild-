import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  BuildingSlot,
  BuildingItem,
  ResourceKey,
} from '../../types/game';
import { NearestInteractable, FloatingText3D } from './types';
import { createWorldEnvironment } from './world/Terrain';
import { createNatureVegetation } from './world/Nature';
import { createResourceNodes } from './resources/ResourceNodes';
import { createBuildingSystem } from './buildings/BuildingRenderer';
import { createDiscoveryPoints } from './discoveries/DiscoveryPoints';
import { createPlayerController } from './player/PlayerController';
import { createThirdPersonCamera } from './camera/ThirdPersonCamera';
import { createInteractionManager } from './interaction/InteractionManager';
import { Building3DModal } from './modals/Building3DModal';
import { Discovery3DModal } from './modals/Discovery3DModal';
import {
  Compass,
  Maximize2,
  Minimize2,
  Sun,
  Sunrise,
  Sunset,
  Sparkles,
  HelpCircle,
  Sliders,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Zap,
  Bot,
  RotateCcw,
} from 'lucide-react';

interface Civilization3DCanvasProps {
  slots: BuildingSlot[];
  buildings: BuildingItem[];
  technologies: { id: string; unlocked: boolean }[];
  currentResources: Record<ResourceKey, number>;
  onGatherResource: (type: 'wood' | 'stone' | 'food' | 'water') => void;
  onBuild: (buildingId: string) => void;
  onUpgradeSlot?: (slotId: number) => void;
  onDiscoveryReward?: (knowledge: number, culture: number, discoveryId: string) => void;
  onOpenAcharyaFull?: (question?: string) => void;
  discoveredIds?: string[];
  addToast?: (text: string, type?: 'success' | 'info' | 'warning' | 'level') => void;
}

// WebGL support detector
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const Civilization3DCanvas: React.FC<Civilization3DCanvasProps> = ({
  slots = [],
  buildings = [],
  technologies = [],
  currentResources,
  onGatherResource,
  onBuild,
  onUpgradeSlot,
  onDiscoveryReward,
  onOpenAcharyaFull,
  discoveredIds = [],
  addToast,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Status & UI State
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const [isLoadingScene, setIsLoadingScene] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(20);
  const [nearestTarget, setNearestTarget] = useState<NearestInteractable | null>(null);
  const [selectedSlotForBuild, setSelectedSlotForBuild] = useState<BuildingSlot | null>(null);
  const [isBuildModalOpen, setIsBuildModalOpen] = useState(false);
  const [selectedDiscovery, setSelectedDiscovery] = useState<any | null>(null);
  const [isDiscoveryModalOpen, setIsDiscoveryModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lightingPreset, setLightingPreset] = useState<'dawn' | 'noon' | 'sunset'>('dawn');
  const [graphicsQuality, setGraphicsQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [showControlsHelp, setShowControlsHelp] = useState(true);
  const [showGraphicsSettings, setShowGraphicsSettings] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText3D[]>([]);
  const [acharyaTip, setAcharyaTip] = useState<{ text: string; actionText?: string; prompt?: string } | null>({
    text: 'Greetings, explorer! Walk along the river terrace to collect timber and stone, or discover the ancient inscribed menhir.',
    actionText: 'Ask Acharya',
    prompt: 'How did ancient river settlements choose their building locations?',
  });

  // State ref to keep animation loop detached from frequent React re-renders
  const stateRef = useRef({
    nearestTarget: null as NearestInteractable | null,
    isInteractingModalOpen: false,
    inputVector: { x: 0, z: 0, isSprinting: false },
    isDraggingMouse: false,
    prevMousePos: { x: 0, y: 0 },
    keysDown: new Set<string>(),
    graphicsQuality: 'medium' as 'low' | 'medium' | 'high',
    renderer: null as THREE.WebGLRenderer | null,
    resetPlayerPosition: null as (() => void) | null,
  });

  // Keep modal state updated in ref
  useEffect(() => {
    stateRef.current.isInteractingModalOpen = isBuildModalOpen || isDiscoveryModalOpen;
  }, [isBuildModalOpen, isDiscoveryModalOpen]);

  // Keep graphics quality updated in ref
  useEffect(() => {
    stateRef.current.graphicsQuality = graphicsQuality;
    if (stateRef.current.renderer) {
      if (graphicsQuality === 'low') {
        stateRef.current.renderer.setPixelRatio(1.0);
        stateRef.current.renderer.shadowMap.enabled = false;
      } else if (graphicsQuality === 'medium') {
        stateRef.current.renderer.setPixelRatio(1.25);
        stateRef.current.renderer.shadowMap.enabled = true;
      } else {
        stateRef.current.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        stateRef.current.renderer.shadowMap.enabled = true;
      }
    }
  }, [graphicsQuality]);

  // Main Three.js Lifecycle
  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebGLSupported(false);
      setIsLoadingScene(false);
      return;
    }

    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;

    // Simulated Loading Progress
    setLoadingProgress(40);

    // 1. Scene & Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1d2736);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      precision: 'mediump',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(graphicsQuality === 'high' ? Math.min(window.devicePixelRatio, 2) : 1.2);
    renderer.shadowMap.enabled = graphicsQuality !== 'low';
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    stateRef.current.renderer = renderer;

    setLoadingProgress(65);

    // 2. Camera
    const cameraController = createThirdPersonCamera(width / height);

    // 3. World Subsystems
    const worldEnv = createWorldEnvironment(scene);
    createNatureVegetation(scene);
    const resourceNodesMgr = createResourceNodes(scene);
    const buildingSystem = createBuildingSystem(scene);
    const discoveryPointsMgr = createDiscoveryPoints(scene);
    const player = createPlayerController(scene);
    stateRef.current.resetPlayerPosition = player.resetPosition;

    const interactionMgr = createInteractionManager(
      resourceNodesMgr.nodes,
      buildingSystem.plots,
      discoveryPointsMgr.points
    );

    // Initial sync
    buildingSystem.syncWithGameState(slots, buildings);
    discoveryPointsMgr.syncWithGameState(discoveredIds);

    setLoadingProgress(90);

    // 4. Keyboard Controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const code = e.code;
      stateRef.current.keysDown.add(code);

      // Interact Key 'E'
      if (code === 'KeyE') {
        const target = stateRef.current.nearestTarget;
        if (target && !stateRef.current.isInteractingModalOpen) {
          executeInteraction(target);
        }
      }

      if (code === 'Escape') {
        setIsBuildModalOpen(false);
        setIsDiscoveryModalOpen(false);
        setShowGraphicsSettings(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      stateRef.current.keysDown.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 5. Mouse Orbit / Drag Handling
    const handleMouseDown = (e: MouseEvent) => {
      stateRef.current.isDraggingMouse = true;
      stateRef.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!stateRef.current.isDraggingMouse) return;

      const dx = e.clientX - stateRef.current.prevMousePos.x;
      const dy = e.clientY - stateRef.current.prevMousePos.y;
      stateRef.current.prevMousePos = { x: e.clientX, y: e.clientY };

      cameraController.handleMouseMove(dx, dy);
    };

    const handleMouseUp = () => {
      stateRef.current.isDraggingMouse = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraController.handleZoom(e.deltaY);
    };

    // Click on canvas for direct interaction
    const handleClick = (e: MouseEvent) => {
      if (stateRef.current.isInteractingModalOpen) return;

      const rect = canvas.getBoundingClientRect();
      const mouseNDC = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const clickedEntity = interactionMgr.raycastClick(
        mouseNDC,
        cameraController.camera,
        player.position
      );
      if (clickedEntity) {
        executeInteraction(clickedEntity);
      }
    };

    // Touch support for camera orbiting on mobile
    let touchStartPos = { x: 0, y: 0 };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && !stateRef.current.isInteractingModalOpen) {
        const dx = e.touches[0].clientX - touchStartPos.x;
        const dy = e.touches[0].clientY - touchStartPos.y;
        touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        cameraController.handleMouseMove(dx * 1.5, dy * 1.5);
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 6. Interaction Action Handler
    function executeInteraction(target: NearestInteractable) {
      if (target.type === 'resource') {
        const node = target.data as any;
        resourceNodesMgr.triggerHarvestAnimation(node.id);
        onGatherResource(node.resourceKey);

        if (addToast) {
          addToast(node.educationalNote, 'success');
        }

        // Contextual Acharya prompt
        setAcharyaTip({
          text: `Collected ${node.resourceKey}! Early civilizations required steady stores of ${node.resourceKey} for monsoon shelters and village sustenance.`,
          actionText: 'Discuss Resources',
          prompt: `How did ancient Indian river communities manage ${node.resourceKey}?`,
        });

        // Add 3D floating text popup
        const floatId = `${Date.now()}_${Math.random()}`;
        setFloatingTexts((prev) => [
          ...prev,
          {
            id: floatId,
            text: `+${node.amount} ${node.resourceKey.toUpperCase()}`,
            position: node.position.clone().add(new THREE.Vector3(0, 2.5, 0)),
            color:
              node.resourceKey === 'food'
                ? '#fbbf24'
                : node.resourceKey === 'wood'
                ? '#d97706'
                : '#38bdf8',
            startTime: Date.now(),
            duration: 1800,
          },
        ]);
        setTimeout(() => {
          setFloatingTexts((prev) => prev.filter((f) => f.id !== floatId));
        }, 1800);
      } else if (target.type === 'building_slot' || target.type === 'building') {
        const slotData = target.data as any;
        const currentSlot = slots.find((s) => s.id === slotData.slotId) || {
          id: slotData.slotId,
          name: slotData.name,
          buildingId: slotData.buildingId,
          x: 0,
          y: 0,
          level: slotData.level || 1,
        };
        setSelectedSlotForBuild(currentSlot);
        setIsBuildModalOpen(true);
      } else if (target.type === 'discovery') {
        const disc = target.data as any;
        setSelectedDiscovery(disc);
        setIsDiscoveryModalOpen(true);

        if (!disc.discovered && onDiscoveryReward) {
          onDiscoveryReward(disc.rewardKnowledge, disc.rewardCulture, disc.id);
          disc.discovered = true;
          discoveryPointsMgr.syncWithGameState([...discoveredIds, disc.id]);
        }

        setAcharyaTip({
          text: `Investigated ${disc.title}! Discoveries represent authentic subcontinental archaeological evidence.`,
          actionText: 'Ask Acharya',
          prompt: `Can you explain the historical context of ${disc.title}?`,
        });
      }
    }

    // 7. Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = entry.contentRect.width;
        const newH = entry.contentRect.height;
        if (newW > 0 && newH > 0) {
          cameraController.camera.aspect = newW / newH;
          cameraController.camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // 8. Animation Loop
    let animFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animFrameId = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      const timeInSec = currentTime / 1000;

      // Calculate movement input
      let moveX = stateRef.current.inputVector.x;
      let moveZ = stateRef.current.inputVector.z;
      const keys = stateRef.current.keysDown;

      if (!stateRef.current.isInteractingModalOpen) {
        if (keys.has('KeyW') || keys.has('ArrowUp')) moveZ -= 1;
        if (keys.has('KeyS') || keys.has('ArrowDown')) moveZ += 1;
        if (keys.has('KeyA') || keys.has('ArrowLeft')) moveX -= 1;
        if (keys.has('KeyD') || keys.has('ArrowRight')) moveX += 1;
      }

      const isSprinting =
        stateRef.current.inputVector.isSprinting ||
        keys.has('ShiftLeft') ||
        keys.has('ShiftRight');

      // Update player
      player.update(
        delta,
        { x: moveX, z: moveZ, isSprinting },
        cameraController.azimuthAngle
      );

      // Update camera follow
      cameraController.update(delta, player.position);

      // Check proximity interaction
      const nearest = interactionMgr.checkNearest(player.position);
      stateRef.current.nearestTarget = nearest;
      setNearestTarget(nearest);

      // Tick world animations
      worldEnv.update(delta, timeInSec);
      resourceNodesMgr.update(timeInSec);
      buildingSystem.update(timeInSec);
      discoveryPointsMgr.update(timeInSec);

      renderer.render(scene, cameraController.camera);
    };

    setLoadingProgress(100);
    setTimeout(() => setIsLoadingScene(false), 350);

    animFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      resizeObserver.disconnect();
      renderer.dispose();
      stateRef.current.renderer = null;
    };
  }, [onGatherResource, addToast, onDiscoveryReward, graphicsQuality]);

  // Virtual directional control handlers (for mobile/tablet touch)
  const handleVirtualDirection = (dir: 'up' | 'down' | 'left' | 'right', isDown: boolean) => {
    if (dir === 'up') stateRef.current.inputVector.z = isDown ? -1 : 0;
    if (dir === 'down') stateRef.current.inputVector.z = isDown ? 1 : 0;
    if (dir === 'left') stateRef.current.inputVector.x = isDown ? -1 : 0;
    if (dir === 'right') stateRef.current.inputVector.x = isDown ? 1 : 0;
  };

  const handleVirtualSprint = (isSprint: boolean) => {
    stateRef.current.inputVector.isSprinting = isSprint;
  };

  if (!webGLSupported) {
    return (
      <div className="w-full h-80 rounded-2xl bg-stone-900 border border-amber-900/60 p-6 flex flex-col items-center justify-center text-center space-y-3">
        <AlertTriangle className="w-10 h-10 text-amber-400" />
        <h3 className="font-display font-bold text-lg text-amber-200">
          3D WebGL Acceleration Unavailable
        </h3>
        <p className="text-xs text-stone-300 max-w-md leading-relaxed">
          Your browser does not currently support WebGL 3D graphics hardware acceleration. You can continue playing with full functionality via the 2D Tactical Viewport below.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-amber-900/50 shadow-2xl bg-stone-950 transition-all select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'h-[520px] sm:h-[620px]'
      }`}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
      />

      {/* Loading Experience Screen */}
      {isLoadingScene && (
        <div className="absolute inset-0 z-40 bg-stone-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/40">
              BHARAT — BUILD THE CIVILIZATION
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-amber-100">
              Loading Civilization...
            </h3>
            <p className="text-xs text-stone-400 italic max-w-sm mx-auto">
              Synthesizing river geography, alluvial groves, and archaeological discovery sites...
            </p>
          </div>

          <div className="w-64 bg-stone-900 rounded-full h-2 overflow-hidden border border-amber-900/50">
            <div
              className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-amber-400/80">
            {loadingProgress}% Initialized
          </span>
        </div>
      )}

      {/* Top HUD: Title, Guide, Lighting, Quality & Fullscreen Toggle */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2 z-20">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-stone-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-900/40 flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-display font-bold text-xs sm:text-sm text-amber-200 tracking-wider">
              BHARAT 3D
            </span>
            <span className="text-stone-600 hidden sm:inline">·</span>
            <span className="text-[11px] text-stone-400 hidden sm:inline">
              Riverine Settlement
            </span>
          </div>

          <button
            onClick={() => setShowControlsHelp((prev) => !prev)}
            className="p-1.5 bg-stone-950/85 backdrop-blur-md rounded-xl border border-stone-800 text-stone-400 hover:text-amber-300 transition-colors pointer-events-auto"
            title="Controls & Instructions"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowGraphicsSettings((prev) => !prev)}
            className="p-1.5 bg-stone-950/85 backdrop-blur-md rounded-xl border border-stone-800 text-stone-400 hover:text-amber-300 transition-colors pointer-events-auto"
            title="Graphics & Quality Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* Lighting & Viewport Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <div className="bg-stone-950/85 backdrop-blur-md p-1 rounded-xl border border-stone-800 flex items-center gap-1">
            <button
              onClick={() => setLightingPreset('dawn')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                lightingPreset === 'dawn'
                  ? 'bg-amber-600 text-stone-950'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Dawn Atmosphere"
            >
              <Sunrise className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingPreset('noon')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                lightingPreset === 'noon'
                  ? 'bg-amber-600 text-stone-950'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Noon Atmosphere"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingPreset('sunset')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                lightingPreset === 'sunset'
                  ? 'bg-amber-600 text-stone-950'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Sunset Atmosphere"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              if (stateRef.current.resetPlayerPosition) {
                stateRef.current.resetPlayerPosition();
                if (addToast) addToast('Recentered avatar at Central Hearth.', 'info');
              }
            }}
            className="p-2 bg-stone-950/85 backdrop-blur-md rounded-xl border border-stone-800 text-stone-400 hover:text-amber-300 transition-colors"
            title="Recenter Avatar"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="p-2 bg-stone-950/85 backdrop-blur-md rounded-xl border border-stone-800 text-stone-300 hover:text-amber-300 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Maximize 3D World'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Graphics Quality Settings Dialog */}
      {showGraphicsSettings && (
        <div className="absolute top-14 right-3 bg-stone-950/90 backdrop-blur-md border border-stone-800 rounded-xl p-3.5 text-xs text-stone-300 space-y-2.5 shadow-2xl z-30 pointer-events-auto max-w-xs animate-fade-in">
          <div className="flex items-center justify-between font-bold text-amber-400">
            <span>Graphics Quality</span>
            <button
              onClick={() => setShowGraphicsSettings(false)}
              className="text-stone-500 hover:text-stone-300"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(['low', 'medium', 'high'] as const).map((q) => (
              <button
                key={q}
                onClick={() => setGraphicsQuality(q)}
                className={`py-1.5 px-2 rounded-lg text-center uppercase tracking-wider font-bold text-[10px] transition-colors ${
                  graphicsQuality === q
                    ? 'bg-amber-600 text-stone-950 shadow-md'
                    : 'bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-stone-400 leading-tight">
            Low quality reduces shadows and pixel ratio for smooth performance on low-end laptops and mobile devices.
          </p>
        </div>
      )}

      {/* Controls Overlay Guide */}
      {showControlsHelp && (
        <div className="absolute top-14 left-3 bg-stone-950/90 backdrop-blur-md border border-stone-800/80 rounded-xl p-3 text-[11px] text-stone-300 space-y-1.5 shadow-xl max-w-xs animate-fade-in pointer-events-auto z-20">
          <div className="flex items-center justify-between text-amber-400 font-bold text-xs">
            <span>Controls Guide</span>
            <button
              onClick={() => setShowControlsHelp(false)}
              className="text-stone-500 hover:text-stone-300"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-stone-400">
            <div>
              <span className="font-mono text-stone-200 font-semibold">WASD / Arrows</span>: Walk
            </div>
            <div>
              <span className="font-mono text-stone-200 font-semibold">Shift</span>: Sprint
            </div>
            <div>
              <span className="font-mono text-stone-200 font-semibold">Mouse Drag</span>: Look
            </div>
            <div>
              <span className="font-mono text-stone-200 font-semibold">Scroll</span>: Zoom
            </div>
            <div>
              <span className="font-mono text-amber-400 font-bold">E / Click</span>: Interact
            </div>
            <div>
              <span className="font-mono text-stone-200 font-semibold">ESC</span>: Close Menu
            </div>
          </div>
        </div>
      )}

      {/* Floating Contextual Acharya Tip Banner (Feature 8) */}
      {acharyaTip && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 max-w-md w-full px-3 z-20 pointer-events-auto animate-fade-in hidden sm:block">
          <div className="bg-stone-950/90 backdrop-blur-md border border-amber-800/50 rounded-xl p-2.5 shadow-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base shrink-0">🤖</span>
              <p className="text-[11px] text-stone-200 line-clamp-2">
                {acharyaTip.text}
              </p>
            </div>
            {onOpenAcharyaFull && acharyaTip.actionText && (
              <button
                onClick={() => onOpenAcharyaFull(acharyaTip.prompt)}
                className="px-2.5 py-1 bg-amber-600/90 hover:bg-amber-500 text-stone-950 font-bold text-[10px] rounded-lg shrink-0 transition-colors"
              >
                {acharyaTip.actionText}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating 3D Text Notifications */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {floatingTexts.map((f) => (
          <div
            key={f.id}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-extrabold text-sm sm:text-base animate-bounce px-3 py-1 rounded-full bg-stone-950/90 border border-amber-500/40 shadow-xl"
            style={{ color: f.color }}
          >
            {f.text}
          </div>
        ))}
      </div>

      {/* Feature 12: Mobile Virtual D-Pad / Touch Controls */}
      <div className="absolute bottom-5 left-4 z-20 pointer-events-auto sm:hidden">
        <div className="bg-stone-950/80 backdrop-blur-md p-2 rounded-2xl border border-stone-800 shadow-2xl grid grid-cols-3 gap-1.5 w-32 h-32 items-center justify-items-center">
          <div />
          <button
            onTouchStart={() => handleVirtualDirection('up', true)}
            onTouchEnd={() => handleVirtualDirection('up', false)}
            className="w-9 h-9 rounded-xl bg-stone-850 active:bg-amber-600 text-stone-200 active:text-stone-950 flex items-center justify-center border border-stone-700 font-bold shadow"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div />

          <button
            onTouchStart={() => handleVirtualDirection('left', true)}
            onTouchEnd={() => handleVirtualDirection('left', false)}
            className="w-9 h-9 rounded-xl bg-stone-850 active:bg-amber-600 text-stone-200 active:text-stone-950 flex items-center justify-center border border-stone-700 font-bold shadow"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onTouchStart={() => handleVirtualSprint(true)}
            onTouchEnd={() => handleVirtualSprint(false)}
            className="w-9 h-9 rounded-xl bg-amber-950/80 active:bg-amber-500 text-amber-300 active:text-stone-950 flex items-center justify-center border border-amber-700/60 font-bold shadow"
            title="Sprint"
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            onTouchStart={() => handleVirtualDirection('right', true)}
            onTouchEnd={() => handleVirtualDirection('right', false)}
            className="w-9 h-9 rounded-xl bg-stone-850 active:bg-amber-600 text-stone-200 active:text-stone-950 flex items-center justify-center border border-stone-700 font-bold shadow"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <div />
          <button
            onTouchStart={() => handleVirtualDirection('down', true)}
            onTouchEnd={() => handleVirtualDirection('down', false)}
            className="w-9 h-9 rounded-xl bg-stone-850 active:bg-amber-600 text-stone-200 active:text-stone-950 flex items-center justify-center border border-stone-700 font-bold shadow"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <div />
        </div>
      </div>

      {/* Bottom Center Interaction Prompt */}
      {nearestTarget && !isBuildModalOpen && !isDiscoveryModalOpen && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto animate-fade-in">
          <button
            onClick={() => {
              const event = new KeyboardEvent('keydown', { code: 'KeyE' });
              window.dispatchEvent(event);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs sm:text-sm rounded-full shadow-2xl border border-amber-300/80 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <span className="bg-stone-950 text-amber-300 px-2 py-0.5 rounded font-mono font-bold text-xs">
              E
            </span>
            <span>{nearestTarget.actionLabel}</span>
            <Sparkles className="w-4 h-4 text-stone-950" />
          </button>
        </div>
      )}

      {/* Modals */}
      <Building3DModal
        isOpen={isBuildModalOpen}
        onClose={() => setIsBuildModalOpen(false)}
        slot={selectedSlotForBuild}
        buildings={buildings}
        technologies={technologies}
        currentResources={currentResources}
        onBuild={onBuild}
        onUpgrade={(slotId) => {
          if (onUpgradeSlot) onUpgradeSlot(slotId);
        }}
        onNeedResourcesPrompt={(bName, missingStr) => {
          setAcharyaTip({
            text: `You need more resources for ${bName} (${missingStr}). Explore the river terrace and quarry!`,
            actionText: 'Ask Acharya',
            prompt: `Where should I harvest resources to construct ${bName}?`,
          });
          if (addToast) {
            addToast(`Acharya: You need ${missingStr} to construct ${bName}.`, 'warning');
          }
        }}
      />

      <Discovery3DModal
        isOpen={isDiscoveryModalOpen}
        onClose={() => setIsDiscoveryModalOpen(false)}
        discovery={selectedDiscovery}
        onOpenAcharyaFull={onOpenAcharyaFull}
      />
    </div>
  );
};
