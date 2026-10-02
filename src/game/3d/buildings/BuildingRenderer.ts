import * as THREE from 'three';
import { BuildingPlot3D } from '../types';
import { BuildingSlot, BuildingItem } from '../../../types/game';
import { getTerrainHeightAt } from '../world/Terrain';

export interface BuildingSystemManager {
  plots: BuildingPlot3D[];
  group: THREE.Group;
  syncWithGameState: (slots: BuildingSlot[], buildings: BuildingItem[]) => void;
  update: (time: number) => void;
}

// 3D settlement coordinates mapped for the 8 building slots
export const SLOT_3D_COORDINATES: Record<number, { x: number; z: number }> = {
  1: { x: -6, z: 8 },    // West Hearth Plot (default starting hut)
  2: { x: 14, z: 18 },   // Alluvial Field Plot
  3: { x: -14, z: -10 }, // Riverbank Well Site
  4: { x: 22, z: -4 },   // East Granary Platform
  5: { x: 4, z: -6 },    // Central Craft Square
  6: { x: 12, z: -20 },  // South Living Quarter
  7: { x: -18, z: 18 },  // Lower River Terrace
  8: { x: 18, z: 8 },    // North-East Clearing
};

export function createBuildingSystem(scene: THREE.Scene): BuildingSystemManager {
  const group = new THREE.Group();
  group.name = 'settlement_buildings';

  // Common materials
  const mudBrickMat = new THREE.MeshStandardMaterial({ color: 0x9e6945, roughness: 0.88, flatShading: true });
  const thatchMat = new THREE.MeshStandardMaterial({ color: 0xb58838, roughness: 0.9, flatShading: true });
  const timberMat = new THREE.MeshStandardMaterial({ color: 0x54361e, roughness: 0.82, flatShading: true });
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x6e6c66, roughness: 0.85, flatShading: true });
  const bakedBrickMat = new THREE.MeshStandardMaterial({ color: 0xb85135, roughness: 0.8, flatShading: true });
  const cropMat = new THREE.MeshStandardMaterial({ color: 0xcc9933, roughness: 0.8 });
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x226b70, roughness: 0.2, metalness: 0.4 });
  const markerMat = new THREE.MeshBasicMaterial({ color: 0xebb33b, transparent: true, opacity: 0.65, wireframe: true });
  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0xffb74d,
    emissive: 0xff9800,
    emissiveIntensity: 0.5,
    roughness: 0.2,
  });

  // 1. Procedural 3D Building Models
  function buildHutModel(level = 1): THREE.Group {
    const hut = new THREE.Group();

    // Mud-brick base
    const baseGeo = level >= 2 ? new THREE.BoxGeometry(3.6, 2.2, 3.6) : new THREE.CylinderGeometry(1.9, 2.1, 2.0, 8);
    const base = new THREE.Mesh(baseGeo, mudBrickMat);
    base.position.y = 1.0;
    base.castShadow = true;
    base.receiveShadow = true;
    hut.add(base);

    // Doorway opening
    const doorGeo = new THREE.BoxGeometry(0.8, 1.4, 0.4);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x2a1a0f, roughness: 0.9 });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 0.7, level >= 2 ? 1.82 : 1.9);
    hut.add(door);

    // Conical Thatch Roof
    const roofGeo = level >= 2 ? new THREE.ConeGeometry(2.9, 1.8, 8) : new THREE.ConeGeometry(2.6, 1.7, 8);
    const roof = new THREE.Mesh(roofGeo, thatchMat);
    roof.position.y = 2.8;
    roof.castShadow = true;
    hut.add(roof);

    // Level upgrades: Additional details
    if (level >= 2) {
      // Timber corner posts & eaves
      for (let i = 0; i < 4; i++) {
        const postGeo = new THREE.CylinderGeometry(0.12, 0.15, 2.4, 5);
        const post = new THREE.Mesh(postGeo, timberMat);
        const px = (i % 2 === 0 ? 1 : -1) * 1.8;
        const pz = (i < 2 ? 1 : -1) * 1.8;
        post.position.set(px, 1.2, pz);
        post.castShadow = true;
        hut.add(post);
      }
    }

    if (level >= 3) {
      // Courtyard terracotta wall banner & water jug
      const jarGeo = new THREE.SphereGeometry(0.3, 6, 6);
      const jarMat = new THREE.MeshStandardMaterial({ color: 0xa84824, roughness: 0.7 });
      const jar = new THREE.Mesh(jarGeo, jarMat);
      jar.position.set(1.4, 0.3, 2.1);
      jar.castShadow = true;
      hut.add(jar);
    }

    return hut;
  }

  function buildFarmModel(level = 1): THREE.Group {
    const farm = new THREE.Group();

    // Raised alluvial plot
    const plotGeo = new THREE.BoxGeometry(4.2, 0.3, 4.2);
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x4a341f, roughness: 0.95 });
    const plot = new THREE.Mesh(plotGeo, soilMat);
    plot.position.y = 0.15;
    plot.receiveShadow = true;
    farm.add(plot);

    // Furrow crops
    const cropCount = level >= 2 ? 24 : 16;
    for (let i = 0; i < cropCount; i++) {
      const cropGeo = new THREE.ConeGeometry(0.2, 0.9 + (level * 0.1), 4);
      const crop = new THREE.Mesh(cropGeo, cropMat);
      const row = Math.floor(i / 4) - 2;
      const col = (i % 4) - 1.5;
      crop.position.set(col * 0.9, 0.7, row * 0.7);
      crop.rotation.y = Math.random() * Math.PI;
      crop.castShadow = true;
      farm.add(crop);
    }

    // Wicker fence posts around plot
    for (let p = 0; p < 8; p++) {
      const angle = (p * Math.PI * 2) / 8;
      const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 4);
      const post = new THREE.Mesh(postGeo, timberMat);
      post.position.set(Math.cos(angle) * 2.1, 0.45, Math.sin(angle) * 2.1);
      post.castShadow = true;
      farm.add(post);
    }

    return farm;
  }

  function buildWellModel(level = 1): THREE.Group {
    const well = new THREE.Group();

    // Brick circular apron
    const apronGeo = new THREE.CylinderGeometry(2.2, 2.4, 0.25, 12);
    const apron = new THREE.Mesh(apronGeo, stoneMat);
    apron.position.y = 0.12;
    apron.receiveShadow = true;
    well.add(apron);

    // Brick well wall
    const wallGeo = new THREE.CylinderGeometry(1.2, 1.3, 1.1, 10, 1, true);
    const wall = new THREE.Mesh(wallGeo, bakedBrickMat);
    wall.position.y = 0.65;
    wall.castShadow = true;
    wall.receiveShadow = true;
    well.add(wall);

    // Water disc inside well
    const waterGeo = new THREE.CircleGeometry(1.15, 10);
    waterGeo.rotateX(-Math.PI / 2);
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = 0.55;
    well.add(water);

    // Wooden crossbeam structure
    const postGeo = new THREE.CylinderGeometry(0.08, 0.1, 2.5, 5);
    const postL = new THREE.Mesh(postGeo, timberMat);
    postL.position.set(-1.1, 1.25, 0);
    postL.castShadow = true;
    well.add(postL);

    const postR = new THREE.Mesh(postGeo, timberMat);
    postR.position.set(1.1, 1.25, 0);
    postR.castShadow = true;
    well.add(postR);

    const beamGeo = new THREE.BoxGeometry(2.4, 0.15, 0.15);
    const beam = new THREE.Mesh(beamGeo, timberMat);
    beam.position.set(0, 2.4, 0);
    beam.castShadow = true;
    well.add(beam);

    // Terracotta water vessel on apron
    const potGeo = new THREE.SphereGeometry(0.28, 6, 6);
    const potMat = new THREE.MeshStandardMaterial({ color: 0xb35334, roughness: 0.7 });
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.set(1.5, 0.35, 0.6);
    pot.castShadow = true;
    well.add(pot);

    return well;
  }

  function buildStorageModel(level = 1): THREE.Group {
    const granary = new THREE.Group();

    // Raised stone foundation pillars (protects grain from rodents & moisture)
    for (let i = 0; i < 4; i++) {
      const pillarGeo = new THREE.CylinderGeometry(0.22, 0.28, 1.0, 6);
      const pillar = new THREE.Mesh(pillarGeo, stoneMat);
      const px = (i % 2 === 0 ? 1 : -1) * 1.3;
      const pz = (i < 2 ? 1 : -1) * 1.3;
      pillar.position.set(px, 0.5, pz);
      pillar.castShadow = true;
      granary.add(pillar);
    }

    // Elevated timber floor
    const floorGeo = new THREE.BoxGeometry(3.4, 0.3, 3.4);
    const floor = new THREE.Mesh(floorGeo, timberMat);
    floor.position.y = 1.15;
    floor.castShadow = true;
    floor.receiveShadow = true;
    granary.add(floor);

    // Mud-brick granary walls
    const bodyGeo = new THREE.BoxGeometry(3.0, 2.0, 3.0);
    const body = new THREE.Mesh(bodyGeo, mudBrickMat);
    body.position.y = 2.3;
    body.castShadow = true;
    granary.add(body);

    // Gabled thatch roof
    const roofGeo = new THREE.ConeGeometry(2.7, 1.6, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roof = new THREE.Mesh(roofGeo, thatchMat);
    roof.position.y = 4.0;
    roof.castShadow = true;
    granary.add(roof);

    // Entrance ladder
    const ladderGeo = new THREE.BoxGeometry(0.5, 1.2, 0.1);
    const ladder = new THREE.Mesh(ladderGeo, timberMat);
    ladder.position.set(0, 0.6, 1.8);
    ladder.rotation.x = 0.25;
    granary.add(ladder);

    return granary;
  }

  function buildWorkshopModel(level = 1): THREE.Group {
    const workshop = new THREE.Group();

    // Low brick terrace
    const terraceGeo = new THREE.BoxGeometry(4.0, 0.35, 4.0);
    const terrace = new THREE.Mesh(terraceGeo, bakedBrickMat);
    terrace.position.y = 0.18;
    terrace.receiveShadow = true;
    workshop.add(terrace);

    // Timber pavilion corner posts
    for (let i = 0; i < 4; i++) {
      const postGeo = new THREE.CylinderGeometry(0.12, 0.15, 2.5, 6);
      const post = new THREE.Mesh(postGeo, timberMat);
      const px = (i % 2 === 0 ? 1 : -1) * 1.6;
      const pz = (i < 2 ? 1 : -1) * 1.6;
      post.position.set(px, 1.4, pz);
      post.castShadow = true;
      workshop.add(post);
    }

    // Open timber canopy roof
    const roofGeo = new THREE.BoxGeometry(4.2, 0.35, 4.2);
    const roof = new THREE.Mesh(roofGeo, thatchMat);
    roof.position.y = 2.8;
    roof.castShadow = true;
    workshop.add(roof);

    // Craft anvil & pottery platform
    const anvilGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.8, 8);
    const anvil = new THREE.Mesh(anvilGeo, stoneMat);
    anvil.position.set(-0.7, 0.75, 0);
    anvil.castShadow = true;
    workshop.add(anvil);

    // Terracotta firing pot/crucible
    const potGeo = new THREE.CylinderGeometry(0.3, 0.2, 0.5, 6);
    const pot = new THREE.Mesh(potGeo, bakedBrickMat);
    pot.position.set(0.8, 0.6, 0.5);
    pot.castShadow = true;
    workshop.add(pot);

    return workshop;
  }

  // 2. Build Empty Plot Foundation Marker
  function buildEmptyPlotMarker(): THREE.Group {
    const plotMarker = new THREE.Group();

    // Foundation perimeter stones
    const baseGeo = new THREE.BoxGeometry(3.6, 0.12, 3.6);
    const base = new THREE.Mesh(baseGeo, mudBrickMat);
    base.position.y = 0.06;
    base.receiveShadow = true;
    plotMarker.add(base);

    // Glowing border ring
    const ringGeo = new THREE.RingGeometry(2.3, 2.6, 16);
    ringGeo.rotateX(-Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, markerMat.clone());
    ring.position.y = 0.09;
    ring.name = 'plot_ring';
    plotMarker.add(ring);

    // Four corner pegs
    for (let i = 0; i < 4; i++) {
      const pegGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 5);
      const peg = new THREE.Mesh(pegGeo, timberMat);
      const px = (i % 2 === 0 ? 1 : -1) * 1.7;
      const pz = (i < 2 ? 1 : -1) * 1.7;
      peg.position.set(px, 0.3, pz);
      plotMarker.add(peg);
    }

    // Floating build beacon
    const beaconGeo = new THREE.DodecahedronGeometry(0.35, 0);
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 2.4;
    beacon.name = 'floating_beacon';
    plotMarker.add(beacon);

    return plotMarker;
  }

  // 3. Initialize 8 Plots
  const plots: BuildingPlot3D[] = [];

  for (let slotId = 1; slotId <= 8; slotId++) {
    const coords = SLOT_3D_COORDINATES[slotId] || { x: 0, z: 0 };
    const y = getTerrainHeightAt(coords.x, coords.z);

    const plot: BuildingPlot3D = {
      slotId,
      name: `Plot ${slotId}`,
      position: new THREE.Vector3(coords.x, y, coords.z),
      buildingId: null,
      level: 1,
    };

    const plotGroup = new THREE.Group();
    plotGroup.position.copy(plot.position);
    plot.mesh = plotGroup;

    group.add(plotGroup);
    plots.push(plot);
  }

  scene.add(group);

  // 4. Synchronization with GameState
  const syncWithGameState = (slots: BuildingSlot[], _buildings: BuildingItem[]) => {
    slots.forEach((slot) => {
      const plot = plots.find((p) => p.slotId === slot.id);
      if (!plot || !plot.mesh) return;

      const currentBuildingId = slot.buildingId || null;
      const level = slot.level || 1;

      // Rebuild content if state changed
      if (plot.buildingId !== currentBuildingId || plot.level !== level || plot.mesh.children.length === 0) {
        plot.buildingId = currentBuildingId;
        plot.level = level;

        // Clear existing children
        while (plot.mesh.children.length > 0) {
          const child = plot.mesh.children[0];
          plot.mesh.remove(child);
        }

        if (!currentBuildingId) {
          // Empty plot
          const marker = buildEmptyPlotMarker();
          plot.mesh.add(marker);
        } else {
          // Render the constructed building model
          let bMesh: THREE.Group;
          if (currentBuildingId === 'hut') bMesh = buildHutModel(level);
          else if (currentBuildingId === 'farm') bMesh = buildFarmModel(level);
          else if (currentBuildingId === 'well') bMesh = buildWellModel(level);
          else if (currentBuildingId === 'storage') bMesh = buildStorageModel(level);
          else if (currentBuildingId === 'workshop') bMesh = buildWorkshopModel(level);
          else bMesh = buildHutModel(level);

          plot.mesh.add(bMesh);

          // Subtle upgrade indicator ring if near level cap or upgradeable
          const upgradeRingGeo = new THREE.RingGeometry(2.3, 2.5, 16);
          upgradeRingGeo.rotateX(-Math.PI / 2);
          const upRingMat = new THREE.MeshBasicMaterial({ color: 0x55aa66, transparent: true, opacity: 0.35 });
          const upRing = new THREE.Mesh(upgradeRingGeo, upRingMat);
          upRing.position.y = 0.08;
          upRing.name = 'plot_ring';
          plot.mesh.add(upRing);
        }
      }
    });
  };

  const update = (time: number) => {
    plots.forEach((plot) => {
      if (!plot.mesh) return;

      // Rotate empty plot beacons
      const beacon = plot.mesh.getObjectByName('floating_beacon') as THREE.Mesh;
      if (beacon) {
        beacon.position.y = 2.4 + Math.sin(time * 2.5 + plot.slotId) * 0.18;
        beacon.rotation.y = time * 1.8;
      }

      // Pulse ground ring
      const ring = plot.mesh.getObjectByName('plot_ring') as THREE.Mesh;
      if (ring && ring.material) {
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.35 + Math.sin(time * 2.8 + plot.slotId) * 0.2;
      }
    });
  };

  return {
    plots,
    group,
    syncWithGameState,
    update,
  };
}
