import type { BaseMaterial, DefenseStats } from '../types';

/**
 * Base material configurations.
 * Each material defines:
 * - weight: Weight per unit of material
 * - usageMultiplier: Multiplier for material usage relative to the style's base (1.0 = baseline)
 *   The armorStyles.ts uses Arthropod Carapace as the baseline for Risar Berserker.
 *   Other base materials need a multiplier (e.g., Plate Scales uses ~0.51x the material).
 * - durability: Durability multiplier (1.0 = baseline)
 * - defense: Base defense values (blunt, pierce, slash) - NOTE: Currently unused, defense is style-based
 *
 * Note: Only materials used in samples are configured.
 * Add new materials here as samples become available.
 */
export type BaseMaterialConfig = {
  weight: number;
  usageMultiplier: number;
  durability: number;
  /**
   * Defense offset relative to Plate Scales (the baseline).
   * Positive = more defense, negative = less defense.
   * This is ADDED to the armorStyle's baseDefense.
   */
  defenseOffset: DefenseStats;
};

export const baseMaterials: Partial<Record<BaseMaterial, BaseMaterialConfig>> = {
  'Plate Scales': {
    weight: 0.01431,
    usageMultiplier: 1.0, // Baseline - armorStyles are calibrated with Plate Scales
    durability: 1.0, // Baseline for durability
    defenseOffset: {
      blunt: 0,
      pierce: 0,
      slash: 0,
    },
  },
  'Arthropod Carapace': {
    weight: 0.01082,
    usageMultiplier: 1.97, // 69/35 ratio vs Plate Scales in Risar Berserker
    durability: 1.221, // 1/0.819, higher durability than Plate Scales
    // Derived from Risar Berserker: D(Arthropod, 100/100) - D(Plate Scales, 100/0) - ironfurDefense
    defenseOffset: {
      blunt: -5.37,
      pierce: -0.46,
      slash: 0.92,
    },
  },
  'Horned Scales': {
    weight: 0.0153,
    usageMultiplier: 0.83, // 29/35 ratio vs Plate Scales (from Sample 20)
    durability: 0.91,
    // Derived from Sample 17 (Plate Scales) vs Sample 20 (Horned Scales)
    // Sample 20: blunt=43.45, pierce=36.68, slash=38.82
    defenseOffset: {
      blunt: -3.02, // 43.45 - 46.47
      pierce: -1.46, // 36.68 - 38.14
      slash: -1.38, // 38.82 - 40.20
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
