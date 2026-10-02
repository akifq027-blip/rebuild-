import * as THREE from 'three';
import { getTerrainHeightAt } from '../world/Terrain';

export interface PlayerController {
  mesh: THREE.Group;
  position: THREE.Vector3;
  rotationY: number;
  isMoving: boolean;
  update: (delta: number, inputVector: { x: number; z: number; isSprinting?: boolean }, cameraAngle: number) => void;
  resetPosition: (x?: number, z?: number) => void;
}

export function createPlayerController(scene: THREE.Scene): PlayerController {
  const mesh = new THREE.Group();
  mesh.name = 'player_character';

  // Materials
  const skinMat = new THREE.MeshStandardMaterial({ color: 0x8a5534, roughness: 0.8 });
  const dhotiMat = new THREE.MeshStandardMaterial({ color: 0xd9822b, roughness: 0.75 }); // Warm terracotta ochre
  const sashMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e1, roughness: 0.8 });   // Natural cotton white
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x1f1917, roughness: 0.9 });
  const staffMat = new THREE.MeshStandardMaterial({ color: 0x4a3319, roughness: 0.7 });
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.45 });

  // 1. Build Stylized Pioneer Character Mesh
  // Torso
  const torsoGeo = new THREE.BoxGeometry(0.7, 0.9, 0.45);
  const torso = new THREE.Mesh(torsoGeo, dhotiMat);
  torso.position.y = 1.25;
  torso.castShadow = true;
  mesh.add(torso);

  // Diagonal Sash / Angavastram
  const sashGeo = new THREE.BoxGeometry(0.74, 0.25, 0.48);
  const sash = new THREE.Mesh(sashGeo, sashMat);
  sash.position.set(0, 1.35, 0);
  sash.rotation.z = 0.35;
  mesh.add(sash);

  // Head
  const headGeo = new THREE.SphereGeometry(0.32, 8, 8);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.y = 1.95;
  head.castShadow = true;
  mesh.add(head);

  // Hair bun / Topknot
  const hairGeo = new THREE.SphereGeometry(0.18, 6, 6);
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.set(0, 2.22, -0.06);
  mesh.add(hair);

  // Legs / Dhoti wrap
  const legLGeo = new THREE.BoxGeometry(0.28, 0.8, 0.35);
  const legL = new THREE.Mesh(legLGeo, dhotiMat);
  legL.position.set(-0.2, 0.45, 0);
  legL.castShadow = true;
  mesh.add(legL);

  const legRGeo = new THREE.BoxGeometry(0.28, 0.8, 0.35);
  const legR = new THREE.Mesh(legRGeo, dhotiMat);
  legR.position.set(0.2, 0.45, 0);
  legR.castShadow = true;
  mesh.add(legR);

  // Walking Staff
  const staffGeo = new THREE.CylinderGeometry(0.04, 0.05, 2.1, 5);
  const staff = new THREE.Mesh(staffGeo, staffMat);
  staff.position.set(0.5, 1.1, 0.2);
  staff.rotation.x = 0.1;
  staff.castShadow = true;
  mesh.add(staff);

  // Shadow disc on ground
  const shadowGeo = new THREE.CircleGeometry(0.65, 12);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.position.y = 0.03;
  mesh.add(shadow);

  // Initial Spawn Point in Central Hearth Terrace
  const startX = 0;
  const startZ = 0;
  const startY = getTerrainHeightAt(startX, startZ);
  mesh.position.set(startX, startY, startZ);

  scene.add(mesh);

  let isMoving = false;
  let animTimer = 0;

  const update = (delta: number, inputVector: { x: number; z: number; isSprinting?: boolean }, cameraAngle: number) => {
    const hasInput = Math.abs(inputVector.x) > 0.01 || Math.abs(inputVector.z) > 0.01;
    isMoving = hasInput;

    if (hasInput) {
      // Normalize input
      const len = Math.hypot(inputVector.x, inputVector.z);
      const nx = inputVector.x / len;
      const nz = inputVector.z / len;

      // Transform direction based on camera horizontal angle
      const forwardX = -Math.sin(cameraAngle);
      const forwardZ = -Math.cos(cameraAngle);
      const rightX = Math.cos(cameraAngle);
      const rightZ = -Math.sin(cameraAngle);

      const moveX = rightX * nx + forwardX * -nz;
      const moveZ = rightZ * nx + forwardZ * -nz;

      const baseSpeed = inputVector.isSprinting ? 12.5 : 7.8;
      const speed = baseSpeed * delta;

      // Proposed new position
      const nextX = mesh.position.x + moveX * speed;
      const nextZ = mesh.position.z + moveZ * speed;

      // Boundary circle limit (keep within 72 units of center)
      const distFromCenter = Math.hypot(nextX, nextZ);
      if (distFromCenter < 72) {
        mesh.position.x = nextX;
        mesh.position.z = nextZ;
      }

      // Smoothly rotate character to face movement direction
      const targetRotation = Math.atan2(moveX, moveZ);
      let diff = targetRotation - mesh.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      mesh.rotation.y += diff * Math.min(1, delta * 14);

      // Walk cycle animation (bobbing)
      animTimer += delta * (inputVector.isSprinting ? 16 : 10);
      torso.position.y = 1.25 + Math.abs(Math.sin(animTimer)) * 0.1;
      head.position.y = 1.95 + Math.abs(Math.sin(animTimer)) * 0.1;
      staff.rotation.x = Math.sin(animTimer) * 0.35;
      legL.rotation.x = Math.sin(animTimer) * 0.6;
      legR.rotation.x = -Math.sin(animTimer) * 0.6;
    } else {
      // Idle breathing
      animTimer += delta * 2;
      torso.position.y = 1.25 + Math.sin(animTimer) * 0.02;
      head.position.y = 1.95 + Math.sin(animTimer) * 0.02;
      legL.rotation.x = 0;
      legR.rotation.x = 0;
      staff.rotation.x = 0.1;
    }

    // Keep player grounded on terrain
    const groundY = getTerrainHeightAt(mesh.position.x, mesh.position.z);
    mesh.position.y = groundY;
  };

  const resetPosition = (x = 0, z = 0) => {
    const y = getTerrainHeightAt(x, z);
    mesh.position.set(x, y, z);
    mesh.rotation.set(0, 0, 0);
  };

  return {
    mesh,
    get position() {
      return mesh.position;
    },
    get rotationY() {
      return mesh.rotation.y;
    },
    isMoving,
    update,
    resetPosition,
  };
}
