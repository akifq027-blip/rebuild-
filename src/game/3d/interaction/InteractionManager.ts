import * as THREE from 'three';
import { NearestInteractable, ResourceNode3D, BuildingPlot3D, DiscoveryPoint3D } from '../types';

export interface InteractionManager {
  checkNearest: (playerPosition: THREE.Vector3) => NearestInteractable | null;
  raycastClick: (
    mouseNDC: THREE.Vector2,
    camera: THREE.Camera,
    playerPosition: THREE.Vector3
  ) => NearestInteractable | null;
}

export function createInteractionManager(
  resourceNodes: ResourceNode3D[],
  buildingPlots: BuildingPlot3D[],
  discoveryPoints: DiscoveryPoint3D[]
): InteractionManager {
  const raycaster = new THREE.Raycaster();

  const checkNearest = (playerPosition: THREE.Vector3): NearestInteractable | null => {
    let bestCandidate: NearestInteractable | null = null;
    let minDistance = Infinity;

    // 1. Check Resource Nodes
    for (const node of resourceNodes) {
      const dist = playerPosition.distanceTo(node.position);
      if (dist < 4.8 && dist < minDistance) {
        minDistance = dist;
        bestCandidate = {
          type: 'resource',
          id: node.id,
          name: node.name,
          actionLabel: `Harvest ${node.label}`,
          distance: dist,
          position: node.position,
          data: node,
        };
      }
    }

    // 2. Check Building Plots
    for (const plot of buildingPlots) {
      const dist = playerPosition.distanceTo(plot.position);
      if (dist < 5.2 && dist < minDistance) {
        minDistance = dist;
        const isOccupied = !!plot.buildingId;
        const buildingName = plot.buildingId ? plot.buildingId.toUpperCase() : '';
        bestCandidate = {
          type: isOccupied ? 'building' : 'building_slot',
          id: plot.slotId,
          name: isOccupied ? `${buildingName} (Plot ${plot.slotId})` : plot.name,
          actionLabel: isOccupied ? `Manage / Upgrade Building` : `Construct Building`,
          distance: dist,
          position: plot.position,
          data: plot,
        };
      }
    }

    // 3. Check Discovery Points
    for (const point of discoveryPoints) {
      const dist = playerPosition.distanceTo(point.position);
      if (dist < 5.2 && dist < minDistance) {
        minDistance = dist;
        bestCandidate = {
          type: 'discovery',
          id: point.id,
          name: point.title,
          actionLabel: point.discovered ? 'Read Historical Discovery' : 'Investigate Discovery Point',
          distance: dist,
          position: point.position,
          data: point,
        };
      }
    }

    return bestCandidate;
  };

  const raycastClick = (
    mouseNDC: THREE.Vector2,
    camera: THREE.Camera,
    playerPosition: THREE.Vector3
  ): NearestInteractable | null => {
    raycaster.setFromCamera(mouseNDC, camera);

    // Collect all interactive meshes
    const interactableObjects: { object: THREE.Object3D; entity: NearestInteractable }[] = [];

    resourceNodes.forEach((node) => {
      if (node.mesh) {
        interactableObjects.push({
          object: node.mesh,
          entity: {
            type: 'resource',
            id: node.id,
            name: node.name,
            actionLabel: `Harvest ${node.label}`,
            distance: playerPosition.distanceTo(node.position),
            position: node.position,
            data: node,
          },
        });
      }
    });

    buildingPlots.forEach((plot) => {
      if (plot.mesh) {
        const bName = plot.buildingId ? plot.buildingId.toUpperCase() : '';
        interactableObjects.push({
          object: plot.mesh,
          entity: {
            type: plot.buildingId ? 'building' : 'building_slot',
            id: plot.slotId,
            name: plot.buildingId ? `${bName} (Plot ${plot.slotId})` : plot.name,
            actionLabel: plot.buildingId ? 'Manage / Upgrade' : 'Construct',
            distance: playerPosition.distanceTo(plot.position),
            position: plot.position,
            data: plot,
          },
        });
      }
    });

    discoveryPoints.forEach((point) => {
      if (point.mesh) {
        interactableObjects.push({
          object: point.mesh,
          entity: {
            type: 'discovery',
            id: point.id,
            name: point.title,
            actionLabel: point.discovered ? 'Read Discovery' : 'Investigate',
            distance: playerPosition.distanceTo(point.position),
            position: point.position,
            data: point,
          },
        });
      }
    });

    for (const item of interactableObjects) {
      const intersects = raycaster.intersectObject(item.object, true);
      if (intersects.length > 0) {
        // Only allow clicking if player is within reasonable distance (<= 14 units)
        if (item.entity.distance <= 14) {
          return item.entity;
        }
      }
    }

    return null;
  };

  return {
    checkNearest,
    raycastClick,
  };
}
