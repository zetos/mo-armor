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
 * Durability multipliers for padding materials.
 * Used with the additive durability model:
 *   dura = (baseMin * minMult) + (baseDensityContrib * bd/100) + (padContrib * padMult * pd/100)
 */
export type DurabilityMults = {
  /** Multiplier for baseMin (durability at 0% densities) */
  minMult: number;
  /** Multiplier for padding density contribution */
  padMult: number;
};

/**
 * Weight density scale coefficients.
 * Formula: weightScale(density) = a + b * (density/100)
 * At density=100: a + b = 1.0
 * At density=0: scale = a
 */
export type WeightDensityCoeffs = { a: number; b: number };

/**
 * Padding material configurations.
 * Each material defines:
 * - materialMultiplier: Multiplier for padding material usage (1.0 = baseline)
 * - weight: Weight per unit of padding material
 * - weightDensityCoeffs: Density scaling for weight (a + b * d/100)
 * - durabilityMults: Multipliers for the additive durability model
 * - defense: Defense contribution values at 100% density (blunt, pierce, slash)
 * - defenseDensityCoeffs: Per-damage-type density scaling coefficients
 *
 * Ironfur is the baseline material.
 */
export type PaddingMaterialConfig = {
  materialMultiplier: number;
  weight: number;
  weightDensityCoeffs: WeightDensityCoeffs;
  durabilityMults: DurabilityMults;
  defense: DefenseStats;
  defenseDensityCoeffs: DefenseDensityCoeffs;
};

export const paddingMaterials: Partial<Record<SupportMaterial, PaddingMaterialConfig>> = {
  Ironfur: {
    materialMultiplier: 1.0,
    weight: 0.0093,
    // Derived: padScale(0) = 0.628 from Kallardian Norse samples
    weightDensityCoeffs: { a: 0.628, b: 0.372 },
    // Baseline durability multipliers (all 1.0)
    durabilityMults: { minMult: 1.0, padMult: 1.0 },
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
    // Derived: padScale(0) = 0.822 from Kallardian Norse samples
    weightDensityCoeffs: { a: 0.822, b: 0.178 },
    // Derived: minMult ~0.955 (average across styles), padMult = 0.8108
    durabilityMults: { minMult: 0.955, padMult: 0.8108 },
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
    // Derived from Risar Berserker sample: (actual/pieceMult - baseW) / (padUsage * matMult) = 0.0087
    weight: 0.0087,
    // Assume similar to Ironfur (need more samples to verify)
    weightDensityCoeffs: { a: 0.628, b: 0.372 },
    // Derived: similar to Ironfur (from Risar Berserker samples)
    durabilityMults: { minMult: 0.989, padMult: 0.989 },
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
    // Derived from Risar Berserker sample: (actual/pieceMult - baseW) / (padUsage * matMult) = 0.00443
    weight: 0.00443,
    // Assume similar to Ironfur (need more samples to verify)
    weightDensityCoeffs: { a: 0.628, b: 0.372 },
    // Derived: similar to Ironfur (from Risar Berserker samples)
    durabilityMults: { minMult: 0.992, padMult: 0.992 },
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
