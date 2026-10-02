/**
 * BHARAT — Build the Civilization
 * Military Units & Ancient Martial Systems (Chaturanga)
 */

import { UnitType } from '../types/civilization';

export const UNITS_CATALOG: Record<string, UnitType> = {
  padati: {
    id: 'padati',
    name: 'Foot Guards',
    sanskritName: 'Padati',
    category: 'infantry',
    tier: 1,
    attack: 18,
    defense: 25,
    health: 90,
    speed: 12,
    cost: {
      food: 25,
      wood: 20,
    },
    trainingTimeSeconds: 10,
    requiredBuildingLevel: 1,
    description: 'Disciplined river valley infantry equipped with fire-hardened bamboo lances and rawhide bucklers.',
    historicalNote: 'Ancient Indian infantry (Padati) formed the steadfast bedrock of regional armies, holding defensive river crossings and fortified gates.',
  },

  dhanurdhara: {
    id: 'dhanurdhara',
    name: 'Archer Scouts',
    sanskritName: 'Dhanurdhara',
    category: 'archer',
    tier: 1,
    attack: 28,
    defense: 14,
    health: 65,
    speed: 15,
    cost: {
      food: 30,
      wood: 35,
    },
    trainingTimeSeconds: 15,
    requiredTechId: 'archery',
    requiredBuildingLevel: 1,
    description: 'Agile sharpshooters wielding seasoned bamboo composite bows with bone and bronze-tipped arrows.',
    historicalNote: 'Classical Indian archers were renowned for resting one end of their longbows upon the earth and drawing the bowstring back to the ear for devastating armor penetration.',
  },

  ashva_arohi: {
    id: 'ashva_arohi',
    name: 'Horse Patrols',
    sanskritName: 'Ashvarohi',
    category: 'cavalry',
    tier: 2,
    attack: 35,
    defense: 22,
    health: 120,
    speed: 24,
    cost: {
      food: 55,
      wood: 30,
      clay: 20,
    },
    trainingTimeSeconds: 25,
    requiredBuildingLevel: 2,
    description: 'Swift frontier cavalry scouts trained for long-distance desert and scrubland reconnaissance.',
    historicalNote: 'Horsemen from the northwestern marches provided rapid early warning along trade caravan corridors against raiding nomadic tribes.',
  },

  ratha: {
    id: 'ratha',
    name: 'Battle Chariots',
    sanskritName: 'Ratha',
    category: 'chariot',
    tier: 3,
    attack: 60,
    defense: 45,
    health: 220,
    speed: 18,
    cost: {
      food: 75,
      wood: 70,
      stone: 35,
    },
    trainingTimeSeconds: 40,
    requiredBuildingLevel: 3,
    description: 'Two-wheeled spoked timber chariots carrying a warrior and driver, capable of delivering crushing flank assaults.',
    historicalNote: 'Spoked bronze and timber wheels discovered at Sinauli (c. 2000 BCE) represent early subcontinental chariot engineering and warrior elite traditions.',
  },

  gaja_dal: {
    id: 'gaja_dal',
    name: 'Fortress Elephants',
    sanskritName: 'Gaja Dal',
    category: 'elephant',
    tier: 4,
    attack: 110,
    defense: 95,
    health: 480,
    speed: 10,
    cost: {
      food: 140,
      wood: 80,
      stone: 60,
      clay: 50,
    },
    trainingTimeSeconds: 65,
    requiredBuildingLevel: 4,
    description: 'Towering armored war elephants outfitted with hardened timber howdahs, capable of demolishing palisades and routing enemy formations.',
    historicalNote: 'The Kautilyan Arthashastra dedicated entire chapters (Hastyadhyaksha) to the veterinary care, tactical deployment, and training of royal elephant corps.',
  },
};
