import * as THREE from 'three';
import { ResourceNode3D } from '../types';
import { getTerrainHeightAt } from '../world/Terrain';

export interface ResourceNodesManager {
  nodes: ResourceNode3D[];
  group: THREE.Group;
  update: (time: number) => void;
  triggerHarvestAnimation: (nodeId: string) => void;
}

export function createResourceNodes(scene: THREE.Scene): ResourceNodesManager {
  const group = new THREE.Group();
  group.name = 'resource_nodes';

  const nodes: ResourceNode3D[] = [
    {
      id: 'wood_grove',
      name: 'Sal & Timber Grove',
      resourceKey: 'wood',
      position: new THREE.Vector3(36, 0, 24),
      label: 'Harvest Wood',
      amount: 10,
      cooldownSeconds: 2.5,
      educationalNote: 'Wood collected · Seasoned Sal and Teak timber provided sturdy framing and rafters for early dwellings.',
      category: 'Woodland Resource',
    },
    {
      id: 'stone_quarry',
      name: 'Granite Outcrop & Quarry',
      resourceKey: 'stone',
      position: new THREE.Vector3(26, 0, -32),
      label: 'Quarry Stone',
      amount: 5,
      cooldownSeconds: 2.5,
      educationalNote: 'Stone collected · Granite boulders and quartzite pebbles served as hearthstones and seed-grinding querns.',
      category: 'Mineral Reserve',
    },
    {
      id: 'food_terrace',
      name: 'Alluvial Barley Fields',
      resourceKey: 'food',
      position: new THREE.Vector3(12, 0, 32),
      label: 'Harvest Crops',
      amount: 10,
      cooldownSeconds: 2.5,
      educationalNote: 'Food harvested · Cultivation of six-row barley and wild pulses in seasonal river silt sustained the village.',
      category: 'Agrarian Reserve',
    },
    {
      id: 'water_basin',
      name: 'Saraswati Riverbank Ghat',
      resourceKey: 'water',
      position: new THREE.Vector3(-19, 0, 4),
      label: 'Draw Water & Clay',
      amount: 10,
      cooldownSeconds: 2.5,
      educationalNote: 'Water drawn · Perennial river waters nourished community crops, cattle herds, and clay pottery tempering.',
      category: 'Hydraulic Source',
    },
  ];

  // Adjust Y positions to match terrain height
  nodes.forEach((node) => {
    node.position.y = getTerrainHeightAt(node.position.x, node.position.z);
  });

  // Materials
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x7a4c28, roughness: 0.85, flatShading: true });
  const barkMat = new THREE.MeshStandardMaterial({ color: 0x472f1b, roughness: 0.9, flatShading: true });
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x76746f, roughness: 0.85, flatShading: true });
  const cropMat = new THREE.MeshStandardMaterial({ color: 0xc49b38, roughness: 0.8, flatShading: true });
  const clayMat = new THREE.MeshStandardMaterial({ color: 0x9c5a3c, roughness: 0.85, flatShading: true });
  const jarMat = new THREE.MeshStandardMaterial({ color: 0xa84d2b, roughness: 0.7, flatShading: true });
  const glowRingMat = new THREE.MeshBasicMaterial({
    color: 0xe5a93c,
    transparent: true,
    opacity: 0.55,
    wireframe: true,
  });

  // 1. Build Timber Grove Node Mesh
  function buildWoodMesh(): THREE.Group {
    const nodeGroup = new THREE.Group();

    // Stacked felled logs
    for (let i = 0; i < 4; i++) {
      const logGeo = new THREE.CylinderGeometry(0.3, 0.35, 3.2, 6);
      logGeo.rotateZ(Math.PI / 2);
      const log = new THREE.Mesh(logGeo, barkMat);
      log.position.set((i % 2) * 0.7 - 0.35, Math.floor(i / 2) * 0.45 + 0.3, (i % 2) * 0.3);
      log.castShadow = true;
      nodeGroup.add(log);
    }

    // Wood chips / stump
    const stumpGeo = new THREE.CylinderGeometry(0.65, 0.75, 1.0, 7);
    const stump = new THREE.Mesh(stumpGeo, woodMat);
    stump.position.set(1.5, 0.5, -0.6);
    stump.castShadow = true;
    nodeGroup.add(stump);

    // Axe / tool wedged into stump (stylized bronze/stone wedge)
    const wedgeGeo = new THREE.BoxGeometry(0.35, 0.6, 0.08);
    const wedgeMat = new THREE.MeshStandardMaterial({ color: 0x546e7a, metalness: 0.6, roughness: 0.3 });
    const wedge = new THREE.Mesh(wedgeGeo, wedgeMat);
    wedge.position.set(1.5, 1.1, -0.6);
    wedge.rotation.z = 0.3;
    nodeGroup.add(wedge);

    return nodeGroup;
  }

  // 2. Build Quarry Node Mesh
  function buildStoneMesh(): THREE.Group {
    const nodeGroup = new THREE.Group();

    // Large central boulder
    const bigRockGeo = new THREE.DodecahedronGeometry(1.6, 1);
    const bigRock = new THREE.Mesh(bigRockGeo, stoneMat);
    bigRock.position.set(0, 0.9, 0);
    bigRock.scale.set(1.4, 0.9, 1.2);
    bigRock.castShadow = true;
    nodeGroup.add(bigRock);

    // Dressed stone blocks around base
    for (let i = 0; i < 3; i++) {
      const blockGeo = new THREE.BoxGeometry(0.8, 0.5, 0.7);
      const block = new THREE.Mesh(blockGeo, stoneMat);
      const angle = (i * Math.PI * 2) / 3;
      block.position.set(Math.cos(angle) * 1.6, 0.25, Math.sin(angle) * 1.6);
      block.rotation.y = angle + 0.4;
      block.castShadow = true;
      nodeGroup.add(block);
    }

    return nodeGroup;
  }

  // 3. Build Crop Terrace Mesh
  function buildCropMesh(): THREE.Group {
    const nodeGroup = new THREE.Group();

    // Raised earth mound
    const moundGeo = new THREE.BoxGeometry(3.5, 0.4, 3.5);
    const moundMat = new THREE.MeshStandardMaterial({ color: 0x5a4228, roughness: 0.95 });
    const mound = new THREE.Mesh(moundGeo, moundMat);
    mound.position.y = 0.2;
    mound.receiveShadow = true;
    nodeGroup.add(mound);

    // Golden barley sheaves
    for (let x = -1.2; x <= 1.2; x += 0.8) {
      for (let z = -1.2; z <= 1.2; z += 0.8) {
        const sheafGeo = new THREE.ConeGeometry(0.28, 1.3, 5);
        const sheaf = new THREE.Mesh(sheafGeo, cropMat);
        sheaf.position.set(x + (Math.random() - 0.5) * 0.2, 0.9, z + (Math.random() - 0.5) * 0.2);
        sheaf.rotation.y = Math.random() * Math.PI;
        sheaf.castShadow = true;
        nodeGroup.add(sheaf);
      }
    }

    return nodeGroup;
  }

  // 4. Build River Ghat & Water Basin Mesh
  function buildWaterMesh(): THREE.Group {
    const nodeGroup = new THREE.Group();

    // Stone terrace / stepped platform
    for (let step = 0; step < 2; step++) {
      const stepGeo = new THREE.BoxGeometry(3.2 - step * 0.6, 0.35, 2.2);
      const stepMesh = new THREE.Mesh(stepGeo, clayMat);
      stepMesh.position.set(0, step * 0.35 + 0.18, step * 0.4);
      stepMesh.castShadow = true;
      stepMesh.receiveShadow = true;
      nodeGroup.add(stepMesh);
    }

    // Terracotta water storage jars (Matkas / amphorae)
    const jarOffsets = [[-0.8, 0.5, 0.6], [0.8, 0.5, 0.7], [0, 0.85, 0.8]];
    jarOffsets.forEach(([jx, jy, jz]) => {
      const jarGeo = new THREE.SphereGeometry(0.35, 7, 7);
      const jar = new THREE.Mesh(jarGeo, jarMat);
      jar.position.set(jx, jy, jz);
      jar.scale.set(1, 1.2, 1);
      jar.castShadow = true;
      nodeGroup.add(jar);

      // Jar rim
      const rimGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.12, 6);
      const rim = new THREE.Mesh(rimGeo, jarMat);
      rim.position.set(jx, jy + 0.42, jz);
      nodeGroup.add(rim);
    });

    return nodeGroup;
  }

  // Attach meshes and pulsing rings to nodes
  nodes.forEach((node) => {
    const nodeGroup = new THREE.Group();
    nodeGroup.position.copy(node.position);

    let contentMesh: THREE.Group;
    if (node.resourceKey === 'wood') contentMesh = buildWoodMesh();
    else if (node.resourceKey === 'stone') contentMesh = buildStoneMesh();
    else if (node.resourceKey === 'food') contentMesh = buildCropMesh();
    else contentMesh = buildWaterMesh();

    nodeGroup.add(contentMesh);

    // Glowing ground beacon ring
    const ringGeo = new THREE.RingGeometry(2.2, 2.5, 16);
    ringGeo.rotateX(-Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, glowRingMat.clone());
    ring.position.y = 0.08;
    ring.name = 'beacon_ring';
    nodeGroup.add(ring);

    // Floating symbol badge
    const badgeGeo = new THREE.OctahedronGeometry(0.35, 0);
    const badgeMat = new THREE.MeshStandardMaterial({
      color: node.resourceKey === 'wood' ? 0x8d5b32 : node.resourceKey === 'stone' ? 0x90a4ae : node.resourceKey === 'food' ? 0xffb300 : 0x00bcd4,
      emissive: node.resourceKey === 'food' ? 0xffa000 : 0x00acc1,
      emissiveIntensity: 0.4,
      roughness: 0.3,
    });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.y = 2.8;
    badge.name = 'floating_badge';
    nodeGroup.add(badge);

    node.mesh = nodeGroup;
    group.add(nodeGroup);
  });

  scene.add(group);

  const update = (time: number) => {
    nodes.forEach((node) => {
      if (!node.mesh) return;

      // Pulse beacon ring
      const ring = node.mesh.getObjectByName('beacon_ring') as THREE.Mesh;
      if (ring && ring.material) {
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.35 + Math.sin(time * 3 + node.position.x) * 0.25;
      }

      // Bob & rotate floating badge
      const badge = node.mesh.getObjectByName('floating_badge') as THREE.Mesh;
      if (badge) {
        badge.position.y = 2.8 + Math.sin(time * 2.2 + node.position.z) * 0.22;
        badge.rotation.y = time * 1.5;
      }
    });
  };

  const triggerHarvestAnimation = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node || !node.mesh) return;

    // Quick pop scale animation
    const mesh = node.mesh;
    mesh.scale.set(1.2, 1.2, 1.2);
    setTimeout(() => {
      mesh.scale.set(1, 1, 1);
    }, 180);
  };

  return {
    nodes,
    group,
    update,
    triggerHarvestAnimation,
  };
}
