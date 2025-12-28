import type { SupportMaterial, DefenseStats } from '../types';

/**
 * Padding material configurations.
 * Each material defines:
 * - materialMultiplier: Multiplier for padding material usage (1.0 = baseline)
 * - weight: Weight per unit of padding material
 * - durabilityMultiplier: Multiplier for durability contribution (1.0 = baseline)
 * - defense: Defense contribution values (blunt, pierce, slash)
 *
 * Ironfur is the baseline material.
 */
export type PaddingMaterialConfig = {
  materialMultiplier: number;
  weight: number;
  durabilityMultiplier: number;
  defense: DefenseStats;
};

export const paddingMaterials: Partial<Record<SupportMaterial, PaddingMaterialConfig>> = {
  Ironfur: {
    materialMultiplier: 1.0,
    weight: 0.0093,
    durabilityMultiplier: 1.0,
    defense: {
      blunt: 16,
      pierce: 14,
      slash: 14,
    },
  },
  Ironsilk: {
    materialMultiplier: 1.33,
    weight: 0.00421,
    durabilityMultiplier: 0.9415,
    defense: {
      blunt: 4.4,
      pierce: 17.6,
      slash: 15.2,
    },
  },
};

export function getPaddingMaterial(material: SupportMaterial): PaddingMaterialConfig {
  const config = paddingMaterials[material];
  if (!config) {
    throw new Error(
      `Padding material "${material}" is not configured. Please add sample data to derive its properties.`
    );
  }
  return config;
}
