import * as THREE from 'three';
import { DiscoveryPoint3D } from '../types';
import { getTerrainHeightAt } from '../world/Terrain';

export interface DiscoveryPointsManager {
  points: DiscoveryPoint3D[];
  group: THREE.Group;
  syncWithGameState: (discoveredIds: string[]) => void;
  update: (time: number) => void;
}

export function createDiscoveryPoints(scene: THREE.Scene): DiscoveryPointsManager {
  const group = new THREE.Group();
  group.name = 'discovery_points';

  const points: DiscoveryPoint3D[] = [
    {
      id: 'disc_ancestral_megalith',
      title: 'Bhimbetka-Style Petroglyph Menhir',
      category: 'Culture',
      position: new THREE.Vector3(-45, 0, -35),
      whatYouDiscovered:
        'A standing granite menhir incised with ochre petroglyphs depicting communal hunting parties and humped zebu cattle.',
      rewardKnowledge: 15,
      rewardCulture: 10,
      discovered: false,
      historicalContext:
        'Rock art and carved stone alignments across central and northern India (e.g., Bhimbetka rock shelters in Madhya Pradesh, Belan Valley) document hunting, cattle herding, and spiritual motifs dating from the Mesolithic to Neolithic transitions.',
      significance:
        'Demonstrates human creative expression, animal domestication consciousness, and early symbolic culture before writing developed.',
      gameplayConnection:
        'Unlocks +15 Knowledge and +10 Culture. Contributes directly toward unlocking Chapter 2 (Indus / Harappan Civilization) and advances cultural milestone missions.',
      academicSource: 'NCERT Class XI: Themes in Indian History · ASI Bhimbetka Excavation Reports',
      evidenceType: 'Archaeological evidence',
    },
    {
      id: 'disc_hydraulic_bund',
      title: 'Dholavira-Inspired Stone Silt Reservoir',
      category: 'Architecture',
      position: new THREE.Vector3(-26, 0, 42),
      whatYouDiscovered:
        'A terraced stone bund and stepped silt trap engineered to slow monsoon runoff and deposit clean water into community cisterns.',
      rewardKnowledge: 20,
      rewardCulture: 10,
      discovered: false,
      historicalContext:
        'The Bronze Age city of Dholavira in Kutch engineered an extraordinary network of sixteen stone-cut reservoirs and stormwater check-dams to capture ephemeral monsoon streams.',
      significance:
        'Proves that ancient Indian societies pioneered advanced hydraulic planning, rainwater harvesting, and urban drought resilience over 4,500 years ago.',
      gameplayConnection:
        'Provides essential hydraulic insights, unlocks Water Management technology prerequisites, and grants +20 Knowledge.',
      academicSource: 'UNESCO World Heritage Inscription #1644: Dholavira · ASI Hydraulic Surveys',
      evidenceType: 'Archaeological evidence',
    },
    {
      id: 'disc_pottery_kiln',
      title: 'Terracotta Kiln & 1:2:4 Brick Molds',
      category: 'Technology',
      position: new THREE.Vector3(42, 0, -18),
      whatYouDiscovered:
        'A circular pit kiln filled with fired terracotta storage jars and standardized timber molds maintaining the exact 1:2:4 brick ratio.',
      rewardKnowledge: 15,
      rewardCulture: 15,
      discovered: false,
      historicalContext:
        'Mature Harappan urban architecture utilized standardized sun-dried and fired clay bricks strictly maintaining the 1:2:4 proportion (thickness : width : length), allowing interlocking English bond masonry.',
      significance:
        'Standardized weights, brick metrics, and high-temperature kiln firing reflect subcontinental civil coordination and specialized craft guilds.',
      gameplayConnection:
        'Enables advanced masonry construction, unlocks Pottery & Storage upgrade tiers, and awards +15 Knowledge and +15 Culture.',
      academicSource: 'ASI Harappa & Mohenjo-daro Monographs · National Museum New Delhi',
      evidenceType: 'Archaeological evidence',
    },
    {
      id: 'disc_copper_smelter',
      title: 'Aravalli Copper Smelting Hearth',
      category: 'Technology',
      position: new THREE.Vector3(38, 0, 45),
      whatYouDiscovered:
        'A primitive clay tuyere pipe and stone-lined charcoal hearth with fragments of malachite copper ore and forged chisel blanks.',
      rewardKnowledge: 20,
      rewardCulture: 15,
      discovered: false,
      historicalContext:
        'Excavations at Ganeshwar and Khetri in Rajasthan reveal early chalcolithic copper extraction centers that supplied native copper blades, chisels, and ornaments across regional river valleys.',
      significance:
        'Illustrates the leap from stone microliths to pyrotechnology and alloy metallurgy, fueling regional inter-community trade.',
      gameplayConnection:
        'Unlocks early bronze and copper metallurgy technology paths, granting +20 Knowledge and +15 Culture for your civilization.',
      academicSource: 'Archaeological Survey of India · Ganeshwar-Jodhpura Cultural Horizon Papers',
      evidenceType: 'Archaeological evidence',
    },
  ];

  // Adjust Y positions to terrain
  points.forEach((p) => {
    p.position.y = getTerrainHeightAt(p.position.x, p.position.z);
  });

  // Materials
  const megalithMat = new THREE.MeshStandardMaterial({ color: 0x5a5752, roughness: 0.9, flatShading: true });
  const brickMat = new THREE.MeshStandardMaterial({ color: 0xbf533b, roughness: 0.82, flatShading: true });
  const copperOreMat = new THREE.MeshStandardMaterial({ color: 0x2e8b57, roughness: 0.5, metalness: 0.35 });
  const stoneStepMat = new THREE.MeshStandardMaterial({ color: 0x756b5d, roughness: 0.85, flatShading: true });
  const beaconActiveMat = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    emissive: 0x00b0ff,
    emissiveIntensity: 0.65,
    roughness: 0.2,
  });
  const beaconDoneMat = new THREE.MeshStandardMaterial({
    color: 0xffd54f,
    emissive: 0xffb300,
    emissiveIntensity: 0.35,
    roughness: 0.3,
  });
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.6, wireframe: true });

  // 1. Build Visual Meshes for Each Discovery Point
  function buildMegalithMesh(): THREE.Group {
    const group = new THREE.Group();

    // Central inscribed standing stone (Menhir)
    const stoneGeo = new THREE.BoxGeometry(1.2, 3.4, 0.7);
    const stone = new THREE.Mesh(stoneGeo, megalithMat);
    stone.position.y = 1.7;
    stone.rotation.y = 0.2;
    stone.rotation.z = -0.06;
    stone.castShadow = true;
    group.add(stone);

    // Surrounding stone circle pebbles
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const pebbleGeo = new THREE.DodecahedronGeometry(0.4, 0);
      const pebble = new THREE.Mesh(pebbleGeo, megalithMat);
      pebble.position.set(Math.cos(angle) * 2.0, 0.2, Math.sin(angle) * 2.0);
      pebble.castShadow = true;
      group.add(pebble);
    }

    return group;
  }

  function buildHydraulicMesh(): THREE.Group {
    const group = new THREE.Group();

    // Stepped masonry check-bund
    for (let step = 0; step < 3; step++) {
      const stepGeo = new THREE.BoxGeometry(3.6 - step * 0.7, 0.35, 1.8 - step * 0.3);
      const stepMesh = new THREE.Mesh(stepGeo, stoneStepMat);
      stepMesh.position.set(0, step * 0.35 + 0.18, 0);
      stepMesh.castShadow = true;
      group.add(stepMesh);
    }

    // Water channel basin
    const basinGeo = new THREE.BoxGeometry(1.8, 0.1, 1.0);
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x1f7a8c, roughness: 0.2, metalness: 0.4 });
    const water = new THREE.Mesh(basinGeo, waterMat);
    water.position.set(0, 0.8, 0);
    group.add(water);

    return group;
  }

  function buildPotteryKilnMesh(): THREE.Group {
    const group = new THREE.Group();

    // Circular mud-brick kiln trench
    const kilnGeo = new THREE.CylinderGeometry(1.4, 1.6, 1.2, 8, 1, true);
    const kiln = new THREE.Mesh(kilnGeo, brickMat);
    kiln.position.y = 0.6;
    kiln.castShadow = true;
    group.add(kiln);

    // Fired terracotta vessels & bricks
    for (let i = 0; i < 3; i++) {
      const jarGeo = new THREE.SphereGeometry(0.3, 6, 6);
      const jar = new THREE.Mesh(jarGeo, brickMat);
      jar.position.set(0.6 * Math.cos((i * Math.PI * 2) / 3), 0.3, 0.6 * Math.sin((i * Math.PI * 2) / 3));
      group.add(jar);
    }

    return group;
  }

  function buildCopperSmelterMesh(): THREE.Group {
    const group = new THREE.Group();

    // Clay smelting furnace cone
    const coneGeo = new THREE.CylinderGeometry(0.5, 1.2, 1.8, 7);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0x733e24, roughness: 0.9 });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.y = 0.9;
    cone.castShadow = true;
    group.add(cone);

    // Green malachite / copper slag chunks
    for (let i = 0; i < 4; i++) {
      const oreGeo = new THREE.DodecahedronGeometry(0.25, 0);
      const ore = new THREE.Mesh(oreGeo, copperOreMat);
      const angle = (i * Math.PI * 2) / 4 + 0.3;
      ore.position.set(Math.cos(angle) * 1.5, 0.15, Math.sin(angle) * 1.5);
      group.add(ore);
    }

    return group;
  }

  // Construct points
  points.forEach((point) => {
    const pGroup = new THREE.Group();
    pGroup.position.copy(point.position);

    let siteMesh: THREE.Group;
    if (point.id === 'disc_ancestral_megalith') siteMesh = buildMegalithMesh();
    else if (point.id === 'disc_hydraulic_bund') siteMesh = buildHydraulicMesh();
    else if (point.id === 'disc_pottery_kiln') siteMesh = buildPotteryKilnMesh();
    else siteMesh = buildCopperSmelterMesh();

    pGroup.add(siteMesh);

    // Ground interaction ring
    const ringGeo = new THREE.RingGeometry(2.4, 2.7, 16);
    ringGeo.rotateX(-Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, ringMat.clone());
    ring.position.y = 0.08;
    ring.name = 'beacon_ring';
    pGroup.add(ring);

    // Floating discovery jewel beacon
    const jewelGeo = new THREE.OctahedronGeometry(0.42, 0);
    const jewel = new THREE.Mesh(jewelGeo, beaconActiveMat.clone());
    jewel.position.y = 3.2;
    jewel.name = 'floating_jewel';
    pGroup.add(jewel);

    point.mesh = pGroup;
    group.add(pGroup);
  });

  scene.add(group);

  const syncWithGameState = (discoveredIds: string[]) => {
    points.forEach((p) => {
      const isDiscovered = discoveredIds.includes(p.id);
      p.discovered = isDiscovered;

      if (p.mesh) {
        const jewel = p.mesh.getObjectByName('floating_jewel') as THREE.Mesh;
        if (jewel) {
          jewel.material = isDiscovered ? beaconDoneMat : beaconActiveMat;
        }

        const ring = p.mesh.getObjectByName('beacon_ring') as THREE.Mesh;
        if (ring && ring.material) {
          const mat = ring.material as THREE.MeshBasicMaterial;
          mat.color.setHex(isDiscovered ? 0xffd54f : 0x00e5ff);
        }
      }
    });
  };

  const update = (time: number) => {
    points.forEach((p) => {
      if (!p.mesh) return;

      const jewel = p.mesh.getObjectByName('floating_jewel') as THREE.Mesh;
      if (jewel) {
        jewel.position.y = 3.2 + Math.sin(time * 2.2 + p.position.x) * 0.25;
        jewel.rotation.y = time * 1.4;
        jewel.rotation.z = Math.sin(time) * 0.2;
      }

      const ring = p.mesh.getObjectByName('beacon_ring') as THREE.Mesh;
      if (ring && ring.material) {
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.35 + Math.sin(time * 2.5 + p.position.z) * 0.25;
      }
    });
  };

  return {
    points,
    group,
    syncWithGameState,
    update,
  };
}
