import * as THREE from 'three';
import { getTerrainHeightAt } from '../world/Terrain';

export interface ThirdPersonCamera {
  camera: THREE.PerspectiveCamera;
  azimuthAngle: number;
  pitchAngle: number;
  distance: number;
  update: (delta: number, targetPosition: THREE.Vector3) => void;
  handleMouseMove: (deltaX: number, deltaY: number) => void;
  handleZoom: (zoomDelta: number) => void;
  resetView: () => void;
}

export function createThirdPersonCamera(aspect: number): ThirdPersonCamera {
  const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 400);

  let azimuthAngle = 0; // Horizontal rotation around player
  let pitchAngle = 0.38; // Vertical tilt angle (~22 degrees looking down)
  let distance = 14.0;   // Distance from player

  const targetLookAt = new THREE.Vector3();
  const currentCameraPos = new THREE.Vector3(0, 10, 15);

  const update = (delta: number, targetPosition: THREE.Vector3) => {
    // Look at player's upper body
    const lookTarget = new THREE.Vector3(
      targetPosition.x,
      targetPosition.y + 1.5,
      targetPosition.z
    );
    targetLookAt.lerp(lookTarget, Math.min(1, delta * 12));

    // Calculate ideal camera position based on angles & distance
    const cx = targetLookAt.x + Math.sin(azimuthAngle) * Math.cos(pitchAngle) * distance;
    const cy = targetLookAt.y + Math.sin(pitchAngle) * distance;
    const cz = targetLookAt.z + Math.cos(azimuthAngle) * Math.cos(pitchAngle) * distance;

    // Ground clearance buffer (camera shouldn't clip below terrain)
    const terrainY = getTerrainHeightAt(cx, cz);
    const clampedY = Math.max(cy, terrainY + 1.8);

    const desiredPos = new THREE.Vector3(cx, clampedY, cz);
    currentCameraPos.lerp(desiredPos, Math.min(1, delta * 10));

    camera.position.copy(currentCameraPos);
    camera.lookAt(targetLookAt);
  };

  const handleMouseMove = (deltaX: number, deltaY: number) => {
    const sensitivity = 0.005;
    azimuthAngle -= deltaX * sensitivity;
    pitchAngle += deltaY * sensitivity;

    // Clamp pitch between ~5 degrees and ~75 degrees
    pitchAngle = Math.max(0.12, Math.min(1.28, pitchAngle));
  };

  const handleZoom = (zoomDelta: number) => {
    distance += zoomDelta * 0.012;
    distance = Math.max(6.5, Math.min(28.0, distance));
  };

  const resetView = () => {
    azimuthAngle = 0;
    pitchAngle = 0.38;
    distance = 14.0;
  };

  return {
    camera,
    get azimuthAngle() {
      return azimuthAngle;
    },
    get pitchAngle() {
      return pitchAngle;
    },
    get distance() {
      return distance;
    },
    update,
    handleMouseMove,
    handleZoom,
    resetView,
  };
}
