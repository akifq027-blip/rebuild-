import * as THREE from 'three';

export interface WorldEnvironment {
  scene: THREE.Scene;
  terrainMesh: THREE.Mesh;
  riverMesh: THREE.Mesh;
  sunLight: THREE.DirectionalLight;
  hemiLight: THREE.HemisphereLight;
  ambientLight: THREE.AmbientLight;
  skyMesh: THREE.Mesh;
  update: (delta: number, time: number) => void;
  setLightingPreset: (preset: 'dawn' | 'noon' | 'sunset') => void;
}

export function createWorldEnvironment(scene: THREE.Scene): WorldEnvironment {
  // 1. Terrain Geometry & Materials
  const WORLD_SIZE = 220;
  const SEGMENTS = 90;
  const terrainGeo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, SEGMENTS, SEGMENTS);
  terrainGeo.rotateX(-Math.PI / 2);

  const posAttr = terrainGeo.attributes.position;
  const colorAttr = new THREE.BufferAttribute(new Float32Array(posAttr.count * 3), 3);

  // Palettes (Warm ancient Indian river valley: Alluvial silt, terracotta clay, fertile green, granite stone)
  const grassColor = new THREE.Color(0x3e6834);
  const fertileRiverBank = new THREE.Color(0x4d7c38);
  const siltClayColor = new THREE.Color(0x8a603c);
  const pathColor = new THREE.Color(0x9c7247);
  const hillStoneColor = new THREE.Color(0x6e6357);
  const riverBedColor = new THREE.Color(0x274338);

  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);

    // River channel curves along X ≈ -25 + 15 * sin(Z * 0.03)
    const riverCenter = -30 + Math.sin(z * 0.035) * 16;
    const distToRiver = Math.abs(x - riverCenter);

    // Radial distance from settlement center (0, 0)
    const distFromCenter = Math.sqrt(x * x + z * z);

    let y = 0;

    // Boundary hills
    if (distFromCenter > 75) {
      const edgeFactor = (distFromCenter - 75) / 35;
      y += Math.pow(edgeFactor, 1.8) * 8 + Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2;
    }

    // Gentle rolling terrain
    y += Math.sin(x * 0.05) * Math.cos(z * 0.05) * 1.5;
    y += Math.sin(x * 0.12 + 1) * Math.cos(z * 0.12) * 0.8;

    // River depression
    if (distToRiver < 18) {
      const riverDepth = (1 - distToRiver / 18) * 4.2;
      y -= riverDepth;
    }

    // Flatten main settlement terrace around center (-10 to 45 in X, -40 to 40 in Z)
    if (x > -15 && x < 50 && Math.abs(z) < 45) {
      y = y * 0.35 + 0.2;
    }

    posAttr.setY(i, y);

    // Vertex coloring based on terrain features
    const vertexColor = new THREE.Color();
    if (distToRiver < 9) {
      vertexColor.copy(riverBedColor);
    } else if (distToRiver < 16) {
      vertexColor.lerpColors(siltClayColor, fertileRiverBank, (distToRiver - 9) / 7);
    } else if (y > 6) {
      vertexColor.lerpColors(grassColor, hillStoneColor, Math.min(1, (y - 6) / 8));
    } else {
      // Main plain with clay path tinting
      const distToCenterSquare = Math.hypot(x - 15, z);
      if (distToCenterSquare < 28 && Math.sin(x * 0.5) * Math.cos(z * 0.5) > 0.3) {
        vertexColor.copy(pathColor);
      } else {
        vertexColor.lerpColors(grassColor, siltClayColor, Math.sin(x * 0.04 + z * 0.04) * 0.25 + 0.25);
      }
    }

    colorAttr.setXYZ(i, vertexColor.r, vertexColor.g, vertexColor.b);
  }

  terrainGeo.setAttribute('color', colorAttr);
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.88,
    metalness: 0.08,
    flatShading: true,
  });

  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.receiveShadow = true;
  scene.add(terrainMesh);

  // 2. River Water Surface
  // Create water plane spanning the river channel length
  const riverGeo = new THREE.PlaneGeometry(36, WORLD_SIZE * 0.95, 24, 60);
  riverGeo.rotateX(-Math.PI / 2);

  // Curve river geometry slightly to match the channel
  const riverPos = riverGeo.attributes.position;
  for (let i = 0; i < riverPos.count; i++) {
    const z = riverPos.getZ(i);
    const riverCenter = -30 + Math.sin(z * 0.035) * 16;
    riverPos.setX(i, riverPos.getX(i) + riverCenter);
    riverPos.setY(i, -1.1 + Math.sin(z * 0.1) * 0.06);
  }
  riverGeo.computeVertexNormals();

  const riverMat = new THREE.MeshStandardMaterial({
    color: 0x24757c,
    roughness: 0.22,
    metalness: 0.35,
    transparent: true,
    opacity: 0.84,
  });

  const riverMesh = new THREE.Mesh(riverGeo, riverMat);
  riverMesh.receiveShadow = true;
  scene.add(riverMesh);

  // 3. Sky Dome / Background Hemispherical Gradient
  const skyGeo = new THREE.SphereGeometry(180, 24, 16);
  const skyMat = new THREE.MeshBasicMaterial({
    color: 0x1d2736,
    side: THREE.BackSide,
  });
  const skyMesh = new THREE.Mesh(skyGeo, skyMat);
  scene.add(skyMesh);

  // 4. Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xfff1dc, 0.45);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xffe8c2, 0x2a3827, 0.55);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xffecd0, 1.25);
  sunLight.position.set(60, 90, 50);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 10;
  sunLight.shadow.camera.far = 250;
  sunLight.shadow.camera.left = -90;
  sunLight.shadow.camera.right = 90;
  sunLight.shadow.camera.top = 90;
  sunLight.shadow.camera.bottom = -90;
  sunLight.shadow.bias = -0.0006;
  scene.add(sunLight);

  // 5. Lighting presets
  const setLightingPreset = (preset: 'dawn' | 'noon' | 'sunset') => {
    if (preset === 'dawn') {
      sunLight.position.set(70, 45, 60);
      sunLight.color.setHex(0xffb774);
      sunLight.intensity = 1.1;
      ambientLight.color.setHex(0xffcf99);
      skyMat.color.setHex(0x382329);
      scene.fog = new THREE.FogExp2(0x382329, 0.0045);
    } else if (preset === 'noon') {
      sunLight.position.set(40, 100, 30);
      sunLight.color.setHex(0xfff8e8);
      sunLight.intensity = 1.35;
      ambientLight.color.setHex(0xffffff);
      skyMat.color.setHex(0x27435f);
      scene.fog = new THREE.FogExp2(0x27435f, 0.0035);
    } else {
      // Sunset / Dusk
      sunLight.position.set(-60, 35, -40);
      sunLight.color.setHex(0xfc8c44);
      sunLight.intensity = 1.05;
      ambientLight.color.setHex(0xd47348);
      skyMat.color.setHex(0x2d1726);
      scene.fog = new THREE.FogExp2(0x2d1726, 0.005);
    }
  };

  // Default to warm Golden Dawn / Morning light
  setLightingPreset('dawn');

  // Animation tick
  const update = (_delta: number, time: number) => {
    // Gentle water ripple offset
    const rPos = riverGeo.attributes.position;
    for (let i = 0; i < rPos.count; i++) {
      const z = rPos.getZ(i);
      const wave = Math.sin(time * 1.8 + z * 0.15) * 0.07;
      rPos.setY(i, -1.1 + wave);
    }
    riverGeo.computeVertexNormals();
    rPos.needsUpdate = true;
  };

  return {
    scene,
    terrainMesh,
    riverMesh,
    sunLight,
    hemiLight,
    ambientLight,
    skyMesh,
    update,
    setLightingPreset,
  };
}

/**
 * Utility to sample approximate ground elevation at (x, z)
 */
export function getTerrainHeightAt(x: number, z: number): number {
  const riverCenter = -30 + Math.sin(z * 0.035) * 16;
  const distToRiver = Math.abs(x - riverCenter);
  const distFromCenter = Math.sqrt(x * x + z * z);

  let y = 0;
  if (distFromCenter > 75) {
    const edgeFactor = (distFromCenter - 75) / 35;
    y += Math.pow(edgeFactor, 1.8) * 8 + Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2;
  }
  y += Math.sin(x * 0.05) * Math.cos(z * 0.05) * 1.5;
  y += Math.sin(x * 0.12 + 1) * Math.cos(z * 0.12) * 0.8;

  if (distToRiver < 18) {
    const riverDepth = (1 - distToRiver / 18) * 4.2;
    y -= riverDepth;
  }

  if (x > -15 && x < 50 && Math.abs(z) < 45) {
    y = y * 0.35 + 0.2;
  }

  return y;
}
