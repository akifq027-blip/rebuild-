import { TechnologyItem } from '../types/game';

export const INITIAL_TECHNOLOGIES: TechnologyItem[] = [
  {
    id: 'fire',
    name: 'FIRE MASTERY',
    description: 'Controlled flame for warmth, cooking grain, and safety from predators.',
    knowledgeCost: 10,
    prerequisiteId: null,
    unlocked: true, // Fire is the starting primal discovery
    effectDescription: 'Unlocks central hearth and primal communal shelter options.',
  },
  {
    id: 'tools',
    name: 'SHAPED STONE TOOLS',
    description: 'Chipped and ground river stones shaped into blades, axes, and adzes.',
    knowledgeCost: 15,
    prerequisiteId: 'fire',
    unlocked: false,
    effectDescription: 'Unlocks Workshop construction.',
    unlockedBuildingId: 'workshop',
  },
  {
    id: 'agriculture',
    name: 'AGRICULTURE',
    description: 'Systematic sowing and harvesting of wild barley, wheat, and pulses.',
    knowledgeCost: 20,
    prerequisiteId: 'tools',
    unlocked: false,
    effectDescription: 'Unlocks Farm construction.',
    unlockedBuildingId: 'farm',
  },
  {
    id: 'pottery',
    name: 'WHEEL-THROWN POTTERY',
    description: 'Clay vessels fired in pit kilns to store seed harvests and water.',
    knowledgeCost: 25,
    prerequisiteId: 'agriculture',
    unlocked: false,
    effectDescription: 'Unlocks Storage building construction.',
    unlockedBuildingId: 'storage',
  },
  {
    id: 'basic_construction',
    name: 'BASIC CONSTRUCTION',
    description: 'Sun-dried mud bricks and reed-thatch framing techniques.',
    knowledgeCost: 30,
    prerequisiteId: 'pottery',
    unlocked: false,
    effectDescription: 'Improves building durability and allows larger structures.',
  },
  {
    id: 'water_management',
    name: 'WATER MANAGEMENT',
    description: 'Hydraulic step-pits, riverbank bunds, and brick-lined wells.',
    knowledgeCost: 35,
    prerequisiteId: 'basic_construction',
    unlocked: false,
    effectDescription: 'Unlocks Well construction.',
    unlockedBuildingId: 'well',
  },
  {
    id: 'trade',
    name: 'REGIONAL TRADE',
    description: 'Exchanging coastal shells, lapis, and grains along river trails.',
    knowledgeCost: 40,
    prerequisiteId: 'water_management',
    unlocked: false,
    effectDescription: 'Prepares settlement for barter markets and caravans.',
  },
  {
    id: 'early_metallurgy',
    name: 'EARLY METALLURGY',
    description: 'Hammering and smelting native copper nuggets from mineral hills.',
    knowledgeCost: 50,
    prerequisiteId: 'trade',
    unlocked: false,
    effectDescription: 'Enables advanced bronze tool crafting and deep expeditions.',
  },
];

/**
 * Checks if a technology can be researched based on prerequisites and knowledge
 */
export function canResearchTechnology(
  tech: TechnologyItem,
  unlockedTechIds: Set<string>,
  availableKnowledge: number
): { canResearch: boolean; reason?: string } {
  if (tech.unlocked) {
    return { canResearch: false, reason: 'Already researched' };
  }

  if (tech.prerequisiteId && !unlockedTechIds.has(tech.prerequisiteId)) {
    return { canResearch: false, reason: 'Prerequisite technology not yet unlocked' };
  }

  if (availableKnowledge < tech.knowledgeCost) {
    const missing = tech.knowledgeCost - availableKnowledge;
    return { canResearch: false, reason: `Need ${missing} more Knowledge` };
  }

  return { canResearch: true };
}
