import type {
  SupportMaterial,
  ArmorStyle,
  PaddingMaterialConfig,
  DefenseStats,
  DefenseDensityCoeffs,
  DensityCoeffs,
  DurabilityMults,
  PaddingMaterialWeightConfig,
} from '../types';

/**
 * SHARED PADDING CONFIGURATIONS
 *
 * Defense values, density coefficients, and weight contributions are UNIVERSAL across all armor styles.
 * Only per-piece weight properties vary per style.
 */
interface SharedPaddingConfig {
  /** Material usage multiplier relative to Ironfur */
  materialMultiplier: number;
  /** Durability multipliers */
  durabilityMults: DurabilityMults;
  /** Defense contribution at 100% padding density */
  defense: DefenseStats;
  /** Defense density scaling coefficients */
  defenseDensityCoeffs: DefenseDensityCoeffs;
  /** Weight configuration for additive weight model */
  additiveWeightConfig: PaddingMaterialWeightConfig;
}

/**
 * Shared configurations for each padding material.
 * These values are identical across all armor styles.
 */
const SHARED_PADDING_CONFIG: Partial<
  Record<SupportMaterial, SharedPaddingConfig>
> = {
  Ironfur: {
    materialMultiplier: 1.0,
    durabilityMults: { minMult: 1.0, padMult: 1.0 },
    defense: { blunt: 10.67, pierce: 6.5, slash: 6.6 },
    // Simple linear scaling: contribution = defense × (density/100)
    defenseDensityCoeffs: {
      blunt: { a: 0.0, b: 1.0 },
      pierce: { a: 0.0, b: 1.0 },
      slash: { a: 0.0, b: 1.0 },
    },
    // Weight additive model: Ironfur adds 0.5 to minWeight and 1.4 to padContrib
    // padContribRatio = 1.0 (baseline for per-piece weights)
    additiveWeightConfig: {
      minWeightOffset: 0.5,
      padContrib: 1.4,
      padContribRatio: 1.0,
    },
  },
  Ironsilk: {
    materialMultiplier: 1.33,
    durabilityMults: { minMult: 0.955, padMult: 0.8108 },
    // Note: Ironsilk REDUCES blunt defense but increases pierce/slash
    defense: { blunt: -0.93, pierce: 10.1, slash: 7.8 },
    // Unusual blunt scaling due to negative base defense value
    defenseDensityCoeffs: {
      blunt: { a: 6.2366, b: -5.2366 },
      pierce: { a: 0.1782, b: 0.8218 },
      slash: { a: 0.0769, b: 0.9231 },
    },
    // Weight additive model: Ironsilk is the baseline (offset = 0)
    // padContribRatio = 0.4/1.4 ≈ 0.2857
    additiveWeightConfig: {
      minWeightOffset: 0.0,
      padContrib: 0.4,
      padContribRatio: 0.2857,
    },
  },
  'Guard Fur': {
    materialMultiplier: 0.995,
    durabilityMults: { minMult: 0.989, padMult: 0.989 },
    defense: { blunt: 5.39, pierce: 5.3, slash: 5.64 },
    // Negative intercepts mean Guard Fur reduces defense at low densities
    defenseDensityCoeffs: {
      blunt: { a: -0.4917, b: 1.4917 },
      pierce: { a: -0.1132, b: 1.1132 },
      slash: { a: -0.0851, b: 1.0851 },
    },
    // Weight additive model
    // padContribRatio = 1.2/1.4 ≈ 0.8571
    additiveWeightConfig: {
      minWeightOffset: 0.4,
      padContrib: 1.2,
      padContribRatio: 0.8571,
    },
  },
  Bloodsilk: {
    materialMultiplier: 1.485,
    durabilityMults: { minMult: 0.992, padMult: 0.992 },
    defense: { blunt: 0.57, pierce: 11.5, slash: 9.48 },
    defenseDensityCoeffs: {
      blunt: { a: -8.8596, b: 9.8596 },
      pierce: { a: 0.2174, b: 0.7826 },
      slash: { a: 0.1519, b: 0.8481 },
    },
    // Weight additive model
    // padContribRatio = 0.6/1.4 ≈ 0.4286
    additiveWeightConfig: {
      minWeightOffset: 0.1,
      padContrib: 0.6,
      padContribRatio: 0.4286,
    },
  },
  Ironwool: {
    materialMultiplier: 0.8571,
    durabilityMults: { minMult: 0.996, padMult: 0.996 },
    // Defense contribution at 100% padding density
    // Derived from: D(0/100) - baseContrib(0)
    // blunt: 38.55 - 32.50 = 6.05
    // pierce: 33.85 - 30.75 = 3.10
    // slash: 31.54 - 27.10 = 4.44
    defense: { blunt: 6.05, pierce: 3.10, slash: 4.44 },
    // Defense density scaling coefficients
    // At padding 0: contribution = a * defense
    // At padding 100: contribution = (a + b) * defense = 1 * defense
    // From D(0/0): padding contrib = D(0/0) - baseContrib(0) = 30.19 - 32.50 = -2.31
    // a * 6.05 = -2.31 => a = -0.3818, b = 1.3818
    // pierce: (29.05 - 30.75) / 3.10 = -0.5484, b = 1.5484
    // slash: (26.02 - 27.10) / 4.44 = -0.2432, b = 1.2432
    defenseDensityCoeffs: {
      blunt: { a: -0.3818, b: 1.3818 },
      pierce: { a: -0.5484, b: 1.5484 },
      slash: { a: -0.2432, b: 1.2432 },
    },
    // Weight additive model
    // padContribRatio = 0.6/1.4 ≈ 0.4286
    additiveWeightConfig: {
      minWeightOffset: 0.1,
      padContrib: 0.6,
      padContribRatio: 0.4286,
    },
  },
};

/**
 * STYLE-SPECIFIC WEIGHT CONFIGURATIONS
 *
 * Weight properties vary per armor style due to different piece configurations.
 */
interface StyleWeightConfig {
  weight: number;
  weightDensityCoeffs: DensityCoeffs;
}

type StyleWeightConfigs = Partial<Record<SupportMaterial, StyleWeightConfig>>;

const STYLE_WEIGHT_CONFIGS: Record<ArmorStyle, StyleWeightConfigs> = {
  'Risar Berserker': {
    Ironfur: { weight: 0.0093, weightDensityCoeffs: { a: 0.628, b: 0.372 } },
    Ironsilk: {
      weight: 0.00443,
      weightDensityCoeffs: { a: 0.8406, b: 0.1594 },
    },
    'Guard Fur': {
      weight: 0.00868,
      weightDensityCoeffs: { a: 0.6816, b: 0.3184 },
    },
    Bloodsilk: {
      weight: 0.00443,
      weightDensityCoeffs: { a: 0.7909, b: 0.2091 },
    },
    Ironwool: {
      weight: 0.00443,
      weightDensityCoeffs: { a: 0.7909, b: 0.2091 },
    },
  },
  'Kallardian Norse': {
    Ironfur: { weight: 0.0093, weightDensityCoeffs: { a: 0.628, b: 0.372 } },
    Ironsilk: {
      weight: 0.00418,
      weightDensityCoeffs: { a: 0.8303, b: 0.1697 },
    },
    'Guard Fur': {
      weight: 0.00868,
      weightDensityCoeffs: { a: 0.6816, b: 0.3184 },
    },
    Bloodsilk: {
      weight: 0.00443,
      weightDensityCoeffs: { a: 0.7909, b: 0.2091 },
    },
    Ironwool: {
      weight: 0.00443,
      weightDensityCoeffs: { a: 0.7909, b: 0.2091 },
    },
  },
  'Khurite Splinted': {
    Ironfur: { weight: 0.0095, weightDensityCoeffs: { a: 0.72, b: 0.28 } },
    Ironsilk: {
      weight: 0.00488,
      weightDensityCoeffs: { a: 0.8722, b: 0.1278 },
    },
    'Guard Fur': {
      weight: 0.00868,
      weightDensityCoeffs: { a: 0.6816, b: 0.3184 },
    },
    Bloodsilk: {
      weight: 0.00443,
      weightDensityCoeffs: { a: 0.7909, b: 0.2091 },
    },
    Ironwool: {
      weight: 0.00443,
      weightDensityCoeffs: { a: 0.7909, b: 0.2091 },
    },
  },
  'Ranger Armor': {
    Ironfur: { weight: 0.0093, weightDensityCoeffs: { a: 0.628, b: 0.372 } },
    Ironsilk: {
      weight: 0.00442,
      weightDensityCoeffs: { a: 0.8406, b: 0.1594 },
    },
    'Guard Fur': {
      weight: 0.00868,
      weightDensityCoeffs: { a: 0.6816, b: 0.3184 },
    },
    Bloodsilk: {
      weight: 0.00443,
      weightDensityCoeffs: { a: 0.7909, b: 0.2091 },
    },
    Ironwool: {
      weight: 0.00443,
      weightDensityCoeffs: { a: 0.7909, b: 0.2091 },
    },
  },
};

/**
 * Builds the full padding material config by combining shared config with style-specific weight.
 */
function buildPaddingConfig(
  material: SupportMaterial,
  style: ArmorStyle
): PaddingMaterialConfig | null {
  const sharedConfig = SHARED_PADDING_CONFIG[material];
  const styleWeight = STYLE_WEIGHT_CONFIGS[style]?.[material];

  if (!sharedConfig || !styleWeight) {
    return null;
  }

  return {
    materialMultiplier: sharedConfig.materialMultiplier,
    weight: styleWeight.weight,
    weightDensityCoeffs: styleWeight.weightDensityCoeffs,
    durabilityMults: sharedConfig.durabilityMults,
    defense: sharedConfig.defense,
    defenseDensityCoeffs: sharedConfig.defenseDensityCoeffs,
  };
}

/**
 * Pre-built padding materials configuration.
 * This maintains backward compatibility with the existing structure.
 */
export const paddingMaterials: Record<
  ArmorStyle,
  Partial<Record<SupportMaterial, PaddingMaterialConfig>>
> = {
  'Risar Berserker': {
    Ironfur: buildPaddingConfig('Ironfur', 'Risar Berserker')!,
    Ironsilk: buildPaddingConfig('Ironsilk', 'Risar Berserker')!,
    'Guard Fur': buildPaddingConfig('Guard Fur', 'Risar Berserker')!,
    Bloodsilk: buildPaddingConfig('Bloodsilk', 'Risar Berserker')!,
    Ironwool: buildPaddingConfig('Ironwool', 'Risar Berserker')!,
  },
  'Kallardian Norse': {
    Ironfur: buildPaddingConfig('Ironfur', 'Kallardian Norse')!,
    Ironsilk: buildPaddingConfig('Ironsilk', 'Kallardian Norse')!,
    'Guard Fur': buildPaddingConfig('Guard Fur', 'Kallardian Norse')!,
    Bloodsilk: buildPaddingConfig('Bloodsilk', 'Kallardian Norse')!,
    Ironwool: buildPaddingConfig('Ironwool', 'Kallardian Norse')!,
  },
  'Khurite Splinted': {
    Ironfur: buildPaddingConfig('Ironfur', 'Khurite Splinted')!,
    Ironsilk: buildPaddingConfig('Ironsilk', 'Khurite Splinted')!,
    'Guard Fur': buildPaddingConfig('Guard Fur', 'Khurite Splinted')!,
    Bloodsilk: buildPaddingConfig('Bloodsilk', 'Khurite Splinted')!,
    Ironwool: buildPaddingConfig('Ironwool', 'Khurite Splinted')!,
  },
  'Ranger Armor': {
    Ironfur: buildPaddingConfig('Ironfur', 'Ranger Armor')!,
    Ironsilk: buildPaddingConfig('Ironsilk', 'Ranger Armor')!,
    'Guard Fur': buildPaddingConfig('Guard Fur', 'Ranger Armor')!,
    Bloodsilk: buildPaddingConfig('Bloodsilk', 'Ranger Armor')!,
    Ironwool: buildPaddingConfig('Ironwool', 'Ranger Armor')!,
  },
};

export function getPaddingMaterial(
  armorStyle: ArmorStyle,
  material: SupportMaterial
): PaddingMaterialConfig {
  const styleMaterials = paddingMaterials[armorStyle];
  if (!styleMaterials) {
    throw new Error(
      `Armor style "${armorStyle}" is not configured for padding materials.`
    );
  }

  const config = styleMaterials[material];
  if (!config) {
    throw new Error(
      `Padding material "${material}" is not configured for armor style "${armorStyle}". Please add sample data to derive its properties.`
    );
  }
  return config;
}

/**
 * Get shared padding configuration (for analysis/debugging).
 */
export function getSharedPaddingConfig(
  material: SupportMaterial
): SharedPaddingConfig | undefined {
  return SHARED_PADDING_CONFIG[material];
}
