import type { SupportMaterial, DefenseStats } from '../types';

/**
 * Defense density scale coefficients.
 * Formula: scale(density) = a + b * (density / 100)
 * At density=100, scale=1.0 (a + b = 1)
 * At density=0, scale=a (intercept)
 *
 * Negative intercepts mean the padding reduces defense at low densities.
 * The actual defense contribution is floored at 0 (no negative defense).
 */
export type DefenseDensityCoeffs = {
  blunt: { a: number; b: number };
  pierce: { a: number; b: number };
  slash: { a: number; b: number };
};

/**
 * Padding material configurations.
 * Each material defines:
 * - materialMultiplier: Multiplier for padding material usage (1.0 = baseline)
 * - weight: Weight per unit of padding material
 * - durabilityMultiplier: Multiplier for durability contribution (1.0 = baseline)
 * - defense: Defense contribution values at 100% density (blunt, pierce, slash)
 * - defenseDensityCoeffs: Per-damage-type density scaling coefficients
 *
 * Ironfur is the baseline material.
 */
export type PaddingMaterialConfig = {
  materialMultiplier: number;
  weight: number;
  durabilityMultiplier: number;
  defense: DefenseStats;
  defenseDensityCoeffs: DefenseDensityCoeffs;
};

export const paddingMaterials: Partial<Record<SupportMaterial, PaddingMaterialConfig>> = {
  Ironfur: {
    materialMultiplier: 1.0,
    weight: 0.0093,
    durabilityMultiplier: 1.0,
    // Derived from Kallardian Norse: D(100/100) - D(100/0) = padding contribution at 100%
    defense: {
      blunt: 10.67,
      pierce: 6.50,
      slash: 6.60,
    },
    // Linear scaling: padScale(d) = d/100
    // At 0% density, padding contributes 0; at 100% density, padding contributes full defense
    defenseDensityCoeffs: {
      blunt: { a: 0.0, b: 1.0 },
      pierce: { a: 0.0, b: 1.0 },
      slash: { a: 0.0, b: 1.0 },
    },
  },
  Ironsilk: {
    materialMultiplier: 1.33,
    weight: 0.00421,
    durabilityMultiplier: 0.9415,
    // Derived from Sample 12 (100/100) using new Kallardian baseDefense
    defense: {
      blunt: 4.40,
      pierce: 13.35,
      slash: 11.10,
    },
    defenseDensityCoeffs: {
      // Derived from Samples 11 (50%) and 12 (100%)
      blunt: { a: -0.11, b: 1.11 },
      pierce: { a: 0.378, b: 0.622 },
      slash: { a: 0.352, b: 0.648 },
    },
  },
  'Guard Fur': {
    materialMultiplier: 0.995, // 402/404 ratio from Ironfur
    weight: 0.0103, // Derived: (0.99/0.997 - 35*0.01431) / 48
    durabilityMultiplier: 0.989, // 2647.4/2676.2 from Samples 19/1
    defense: {
      blunt: 11.19,
      pierce: 3.50,
      slash: 5.04,
    },
    defenseDensityCoeffs: {
      blunt: { a: 0.282, b: 0.718 },
      // Pierce and slash have negative intercepts
      pierce: { a: -0.686, b: 1.686 },
      slash: { a: -0.215, b: 1.215 },
    },
  },
  Bloodsilk: {
    materialMultiplier: 1.485, // 600/404 ratio from Ironfur
    weight: 0.0053, // Derived: (0.88/0.997 - 35*0.01431) / 72
    durabilityMultiplier: 0.992, // 2173.9/2166.7 * 0.989 from Samples 14/17
    defense: {
      blunt: 6.37,
      pierce: 9.70,
      slash: 8.88,
    },
    defenseDensityCoeffs: {
      blunt: { a: 0.118, b: 0.882 },
      pierce: { a: 0.072, b: 0.928 },
      slash: { a: 0.094, b: 0.906 },
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
