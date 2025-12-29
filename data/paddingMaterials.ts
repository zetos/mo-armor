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
    // Derived from Kallardian Norse: D(100/100) - baseDefense
    // Note: Ironsilk REDUCES blunt defense but increases pierce/slash
    defense: {
      blunt: -0.93,
      pierce: 10.10,
      slash: 7.80,
    },
    // Derived from (D(100/0) - baseDefense) / (D(100/100) - baseDefense)
    // Very unusual scaling for blunt due to negative base defense value
    defenseDensityCoeffs: {
      blunt: { a: 6.2366, b: -5.2366 },
      pierce: { a: 0.1782, b: 0.8218 },
      slash: { a: 0.0769, b: 0.9231 },
    },
  },
  'Guard Fur': {
    materialMultiplier: 0.995, // 402/404 ratio from Ironfur
    weight: 0.0103, // Derived: (0.99/0.997 - 35*0.01431) / 48
    durabilityMultiplier: 0.989, // 2647.4/2676.2 from Samples 19/1
    // Derived from Risar Berserker: D(100/100) - baseDefense
    defense: {
      blunt: 5.39,
      pierce: 5.30,
      slash: 5.64,
    },
    // Negative intercepts mean Guard Fur reduces defense at low densities
    defenseDensityCoeffs: {
      blunt: { a: -0.4917, b: 1.4917 },
      pierce: { a: -0.1132, b: 1.1132 },
      slash: { a: -0.0851, b: 1.0851 },
    },
  },
  Bloodsilk: {
    materialMultiplier: 1.485, // 600/404 ratio from Ironfur
    weight: 0.0053, // Derived: (0.88/0.997 - 35*0.01431) / 72
    durabilityMultiplier: 0.992, // 2173.9/2166.7 * 0.989 from Samples 14/17
    // Derived from Risar Berserker: D(100/100) - baseDefense
    defense: {
      blunt: 0.57,
      pierce: 11.50,
      slash: 9.48,
    },
    // Very unusual scaling for blunt due to small base value
    defenseDensityCoeffs: {
      blunt: { a: -8.8596, b: 9.8596 },
      pierce: { a: 0.2174, b: 0.7826 },
      slash: { a: 0.1519, b: 0.8481 },
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
