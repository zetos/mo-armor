import type { BaseMaterial, DefenseStats } from '../types';

/**
 * Base material configurations.
 * Each material defines:
 * - weight: Weight per unit of material
 * - durability: Durability multiplier (1.0 = baseline)
 * - defense: Base defense values (blunt, pierce, slash)
 *
 * Note: Only materials used in samples are configured.
 * Add new materials here as samples become available.
 */
export type BaseMaterialConfig = {
  weight: number;
  durability: number;
  defense: DefenseStats;
};

export const baseMaterials: Partial<Record<BaseMaterial, BaseMaterialConfig>> = {
  'Plate Scales': {
    weight: 0.01431,
    durability: 1.0,
    defense: {
      blunt: 31.87,
      pierce: 27.6,
      slash: 23.6,
    },
  },
  'Arthropod Carapace': {
    weight: 0.01082,
    durability: 1.355,
    defense: {
      blunt: 30.38,
      pierce: 24.88,
      slash: 28.08,
    },
  },
};

export function getBaseMaterial(material: BaseMaterial): BaseMaterialConfig {
  const config = baseMaterials[material];
  if (!config) {
    throw new Error(
      `Base material "${material}" is not configured. Please add sample data to derive its properties.`
    );
  }
  return config;
}
