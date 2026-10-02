import * as THREE from 'three';
import { ResourceKey, BuildingItem, BuildingSlot, DiscoveryItem } from '../../types/game';

export type InteractableType = 'resource' | 'building_slot' | 'building' | 'discovery';

export interface WorldPosition3D {
  x: number;
  y: number;
  z: number;
}

export interface ResourceNode3D {
  id: string;
  name: string;
  resourceKey: 'wood' | 'stone' | 'food' | 'water';
  position: THREE.Vector3;
  label: string;
  amount: number;
  cooldownSeconds: number;
  educationalNote: string;
  category: string;
  mesh?: THREE.Group;
}

export interface BuildingPlot3D {
  slotId: number;
  name: string;
  position: THREE.Vector3;
  buildingId: string | null;
  level: number;
  mesh?: THREE.Group;
}

export interface DiscoveryPoint3D {
  id: string;
  title: string;
  category: 'Technology' | 'Culture' | 'Architecture' | 'Agriculture' | 'Trade' | 'Settlement' | 'Artifact' | 'Region';
  position: THREE.Vector3;
  whatYouDiscovered: string;
  rewardKnowledge: number;
  rewardCulture: number;
  discovered: boolean;
  historicalContext: string;
  significance: string;
  gameplayConnection: string;
  academicSource: string;
  evidenceType: 'Archaeological evidence' | 'Historical interpretation' | 'Gameplay representation';
  mesh?: THREE.Group;
}

export interface FloatingText3D {
  id: string;
  text: string;
  position: THREE.Vector3;
  color: string;
  startTime: number;
  duration: number;
}

export interface NearestInteractable {
  type: InteractableType;
  id: string | number;
  name: string;
  actionLabel: string;
  distance: number;
  position: THREE.Vector3;
  data: ResourceNode3D | BuildingPlot3D | DiscoveryPoint3D;
}
