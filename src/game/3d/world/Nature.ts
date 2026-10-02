import * as THREE from 'three';
import { getTerrainHeightAt } from './Terrain';

export interface NatureManager {
  group: THREE.Group;
  update: (time: number) => void;
}

export function createNatureVegetation(scene: THREE.Scene): NatureManager {
  const natureGroup = new THREE.Group();
  natureGroup.name = 'nature_vegetation';

  // Common materials for low-poly stylized nature
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x5a3e28,
    roughness: 0.9,
    flatShading: true,
  });

  const banyanTrunkMat = new THREE.MeshStandardMaterial({
    color: 0x6e523b,
    roughness: 0.92,
    flatShading: true,
  });

  const leafGreenMat = new THREE.MeshStandardMaterial({
    color: 0x2e5c27,
    roughness: 0.75,
    flatShading: true,
  });

  const leafBrightMat = new THREE.MeshStandardMaterial({
    color: 0x487d2b,
    roughness: 0.78,
    flatShading: true,
  });

  const leafAutumnMat = new THREE.MeshStandardMaterial({
    color: 0x6d8534,
    roughness: 0.8,
    flatShading: true,
  });

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x6c6b65,
    roughness: 0.85,
    flatShading: true,
  });

  const riverStoneMat = new THREE.MeshStandardMaterial({
    color: 0x4f4d45,
    roughness: 0.6,
    flatShading: true,
  });

  const reedMat = new THREE.MeshStandardMaterial({
    color: 0x5b7f36,
    roughness: 0.8,
    flatShading: true,
  });

  // 1. Procedural Tree Builders
  function createBanyanTree(scale = 1): THREE.Group {
    const tree = new THREE.Group();

    // Central trunk
    const trunkGeo = new THREE.CylinderGeometry(0.55 * scale, 0.9 * scale, 3.8 * scale, 7);
    const trunk = new THREE.Mesh(trunkGeo, banyanTrunkMat);
    trunk.position.y = (3.8 * scale) / 2;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    // Aerial prop roots
    for (let r = 0; r < 4; r++) {
      const angle = (r * Math.PI) / 2 + 0.3;
      const rootDist = 1.3 * scale;
      const rootGeo = new THREE.CylinderGeometry(0.12 * scale, 0.22 * scale, 3.5 * scale, 5);
      const root = new THREE.Mesh(rootGeo, banyanTrunkMat);
      root.position.set(Math.cos(angle) * rootDist, (3.5 * scale) / 2, Math.sin(angle) * rootDist);
      root.rotation.z = (Math.cos(angle) * 0.1);
      root.castShadow = true;
      tree.add(root);
    }

    // Wide layered canopy
    const canopy1Geo = new THREE.DodecahedronGeometry(2.8 * scale, 1);
    const canopy1 = new THREE.Mesh(canopy1Geo, leafGreenMat);
    canopy1.position.y = 4.2 * scale;
    canopy1.scale.set(1.4, 0.65, 1.3);
    canopy1.castShadow = true;
    tree.add(canopy1);

    const canopy2Geo = new THREE.DodecahedronGeometry(2.1 * scale, 1);
    const canopy2 = new THREE.Mesh(canopy2Geo, leafBrightMat);
    canopy2.position.set(0.6 * scale, 5.2 * scale, -0.4 * scale);
    canopy2.scale.set(1.2, 0.6, 1.1);
    canopy2.castShadow = true;
    tree.add(canopy2);

    return tree;
  }

  function createSalTree(scale = 1): THREE.Group {
    const tree = new THREE.Group();

    const trunkGeo = new THREE.CylinderGeometry(0.25 * scale, 0.45 * scale, 4.8 * scale, 6);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = (4.8 * scale) / 2;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    // Layered conical foliage
    const layers = 3;
    for (let i = 0; i < layers; i++) {
      const radius = (1.9 - i * 0.4) * scale;
      const coneGeo = new THREE.ConeGeometry(radius, 2.2 * scale, 6);
      const cone = new THREE.Mesh(coneGeo, i % 2 === 0 ? leafGreenMat : leafAutumnMat);
      cone.position.y = (3.4 + i * 1.3) * scale;
      cone.castShadow = true;
      tree.add(cone);
    }

    return tree;
  }

  function createStoneBoulder(scale = 1): THREE.Mesh {
    const stoneGeo = new THREE.DodecahedronGeometry(1.2 * scale, 1);
    const stone = new THREE.Mesh(stoneGeo, stoneMat);
    stone.position.y = (1.2 * scale) * 0.4;
    stone.scale.set(1 + Math.random() * 0.4, 0.7 + Math.random() * 0.3, 1 + Math.random() * 0.4);
    stone.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    stone.castShadow = true;
    stone.receiveShadow = true;
    return stone;
  }

  function createRiverReeds(): THREE.Group {
    const reeds = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const h = 1.2 + Math.random() * 0.8;
      const reedGeo = new THREE.CylinderGeometry(0.04, 0.08, h, 4);
      const reed = new THREE.Mesh(reedGeo, reedMat);
      reed.position.set((Math.random() - 0.5) * 1.5, h / 2, (Math.random() - 0.5) * 1.5);
      reed.rotation.z = (Math.random() - 0.5) * 0.2;
      reeds.add(reed);
    }
    return reeds;
  }

  // 2. Populate Trees across Foothills, Groves, and Sacred Bounds
  const treeLocations: [number, number, 'banyan' | 'sal', number][] = [
    // Sacred Banyan Grove (North-West)
    [-8, 38, 'banyan', 1.2],
    [-2, 45, 'banyan', 1.0],
    [-14, 42, 'sal', 1.1],
    [-6, 52, 'sal', 0.95],
    // Eastern Woodland ridge
    [48, 12, 'sal', 1.1],
    [54, -8, 'sal', 1.25],
    [52, 28, 'sal', 1.0],
    [45, -25, 'banyan', 1.15],
    [62, -18, 'sal', 1.3],
    [58, 38, 'sal', 0.9],
    // South-East Foothills
    [32, -45, 'banyan', 1.05],
    [24, -52, 'sal', 1.1],
    [42, -50, 'sal', 1.2],
    // North Foothills
    [15, 55, 'sal', 1.15],
    [28, 48, 'sal', 1.0],
    [35, 58, 'banyan', 1.1],
    // Riverbank Shade Trees (spaced away from water edge)
    [-48, 15, 'banyan', 1.2],
    [-52, -20, 'sal', 1.1],
    [-46, -42, 'sal', 1.0],
  ];

  treeLocations.forEach(([x, z, type, scale]) => {
    const y = getTerrainHeightAt(x, z);
    const tree = type === 'banyan' ? createBanyanTree(scale) : createSalTree(scale);
    tree.position.set(x, y, z);
    tree.rotation.y = Math.random() * Math.PI * 2;
    natureGroup.add(tree);
  });

  // 3. Populate Rocks and River Boulders
  const rockLocations: [number, number, number][] = [
    // Quarry Foothills (East & South)
    [38, -32, 1.4],
    [44, -36, 1.8],
    [41, -28, 1.1],
    [55, -42, 2.2],
    [35, -40, 1.0],
    // North Ridge
    [18, 42, 1.3],
    [25, 46, 1.6],
    // River bank step boulders
    [-24, 2, 1.0],
    [-22, -14, 1.2],
    [-20, 22, 0.9],
  ];

  rockLocations.forEach(([x, z, scale]) => {
    const y = getTerrainHeightAt(x, z);
    const rock = createStoneBoulder(scale);
    rock.position.set(x, y, z);
    natureGroup.add(rock);
  });

  // 4. Populate River Reeds along Water Edge
  for (let z = -65; z < 65; z += 12) {
    const riverCenter = -30 + Math.sin(z * 0.035) * 16;
    const rx = riverCenter + (Math.random() > 0.5 ? 9.5 : -9.5);
    const ry = getTerrainHeightAt(rx, z);
    const reeds = createRiverReeds();
    reeds.position.set(rx, ry, z);
    natureGroup.add(reeds);
  }

  scene.add(natureGroup);

  const update = (_time: number) => {
    // Optional gentle foliage breeze sway
  };

  return {
    group: natureGroup,
    update,
  };
}
