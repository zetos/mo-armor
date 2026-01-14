import type { BaseMaterial, BaseMaterialConfig, ArmorStyle, DefenseStats, StyleSpecificDefenseConfig, StyleSpecificDurabilityConfig, StyleSpecificUsageMultiplierConfig } from '../types';

export const baseMaterials: Partial<Record<BaseMaterial, BaseMaterialConfig>> = {
  'Plate Scales': {
    weight: 0.01431,
    usageMultiplier: 1.0, // Baseline - armorStyles are calibrated with Plate Scales
    durability: 1.0, // Baseline for durability
    // Plate Scales uses each armor style's base defense and density coefficients
    defenseConfig: {},
    // Weight additive model: Plate Scales is the baseline (no offset, mult = 1.0)
    additiveWeightConfig: {
      minWeightOffset: 0.0,
      baseContribMult: 1.0,
    },
  },
  'Arthropod Carapace': {
    weight: 0.01131,  // Derived from 100%/0% analysis: baseContrib / (baseUsage * pieceMult)
    usageMultiplier: 1.96, // Fallback (Kallardian Norse at 100%)
    // Style-specific usage multipliers with density scaling (mult = a + b * density/100)
    // Derived from 0% and 100% density samples
    usageMultiplierConfig: {
      'Risar Berserker': { a: 1.9155, b: 0.0501 },
      'Kallardian Norse': { a: 1.9456, b: 0.0150 },
      'Khurite Splinted': { a: 1.917, b: 0.037 },
      'Ranger Armor': { a: 1.9530, b: 0.0112 },
    },
    durability: 1.221, // Fallback value
    // Style-specific durability configurations (derived from 0%/0%, 100%/0%, 0%/100% samples)
    durabilityConfig: {
      'Risar Berserker': { baseMin: 274.0, baseDensityContrib: 284.05, padContrib: 111.0 },
      'Kallardian Norse': { baseMin: 275.125, baseDensityContrib: 224.25, padContrib: 101.75 },
      'Khurite Splinted': { baseMin: 277.375, baseDensityContrib: 565.8, padContrib: 83.25 },
      'Ranger Armor': { baseMin: 280.3125, baseDensityContrib: 272.55, padContrib: 106.375 },
    },
    // Weight additive model: Arthropod Carapace is heavier than Plate Scales
    // Derived from corner samples: offset=+0.6 (heavier at 0 density), mult=1.4286 (higher base density contribution)
    additiveWeightConfig: {
      minWeightOffset: 0.6,
      baseContribMult: 1.4286,
    },
    // Style-specific defense configurations derived from 100/0 and 100/100 samples
    // For styles without 0% density samples, density coefficients default to style's base coefficients
    defenseConfig: {
      'Risar Berserker': {
        baseDefense: { blunt: 35.71, pierce: 32.38, slash: 35.48 },
        // Derived from 0%/0% and 100%/0% samples
        densityCoeffs: {
          blunt: { a: 0.89274713, b: 0.10725287 },
          pierce: { a: 0.83137739, b: 0.16862261 },
          slash: { a: 0.84611048, b: 0.15388952 },
        },
      },
      'Kallardian Norse': {
        baseDefense: { blunt: 32.53, pierce: 34.70, slash: 31.80 },
        // Derived from 0%/0% and 100%/0% samples
        densityCoeffs: {
          blunt: { a: 0.90931448, b: 0.09068552 },
          pierce: { a: 0.87896254, b: 0.12103746 },
          slash: { a: 0.86792453, b: 0.13207547 },
        },
      },
      'Khurite Splinted': {
        baseDefense: { blunt: 40.04, pierce: 40.54, slash: 39.64 },
        densityCoeffs: {
          blunt: { a: 0.8232, b: 0.1768 },
          pierce: { a: 0.7514, b: 0.2486 },
          slash: { a: 0.7457, b: 0.2543 },
        },
      },
      'Ranger Armor': {
        baseDefense: { blunt: 31.32, pierce: 32.82, slash: 37.92 },
        // Derived from 0%/0% and 100%/0% samples
        densityCoeffs: {
          blunt: { a: 0.88697318, b: 0.11302682 },
          pierce: { a: 0.84643510, b: 0.15356490 },
          slash: { a: 0.86708861, b: 0.13291139 },
        },
      },
    },
  },
   'Horned Scales': {
      weight: 0.0153,
      usageMultiplier: 0.82, // Fallback (adjusted to minimize errors)
     // Style-specific usage multipliers (fixed values, no density scaling)
     // Derived from optimizing against sample data for each style
     usageMultiplierConfig: {
       'Risar Berserker': { a: 0.818, b: 0 },
       'Kallardian Norse': { a: 0.821, b: 0 },
       'Khurite Splinted': { a: 0.824, b: 0 },
       'Ranger Armor': { a: 0.821, b: 0 },
     },
     durability: 0.91, // Fallback value
     // Weight additive model: Horned Scales is lighter than Plate Scales
     // Derived from corner samples: offset=-0.25 (lighter at 0 density), mult=0.821 (lower base density contribution)
     additiveWeightConfig: {
       minWeightOffset: -0.25,
       baseContribMult: 0.821,
     },
     // Style-specific durability configurations (derived from 0%/0%, 100%/0%, 0%/100% samples)
     durabilityConfig: {
       'Risar Berserker': { baseMin: 200.375, baseDensityContrib: 188.3375, padContrib: 111.0 },
       'Kallardian Norse': { baseMin: 199.5625, baseDensityContrib: 148.6875, padContrib: 101.75 },
       'Khurite Splinted': { baseMin: 197.9375, baseDensityContrib: 375.15, padContrib: 83.25 },
       'Ranger Armor': { baseMin: 203.7825, baseDensityContrib: 180.7125, padContrib: 106.375 },
     },
     // Style-specific defense configurations with material-specific density scaling
      defenseConfig: {
        'Risar Berserker': {
          baseDefense: { blunt: 38.06, pierce: 31.38, slash: 33.18 },
          densityCoeffs: {
            blunt: { a: 0.8731, b: 0.1269 },
            pierce: { a: 0.8397, b: 0.1603 },
            slash: { a: 0.8650, b: 0.1350 },
          },
        },
        'Kallardian Norse': {
          baseDefense: { blunt: 34.58, pierce: 33.83, slash: 29.80 },
          densityCoeffs: {
            blunt: { a: 0.8924, b: 0.1076 },
            pierce: { a: 0.8856, b: 0.1144 },
            slash: { a: 0.8842, b: 0.1158 },
          },
        },
        'Khurite Splinted': {
          baseDefense: { blunt: 43.52, pierce: 39.07, slash: 36.24 },
          densityCoeffs: {
            blunt: { a: 0.7948, b: 0.2052 },
            pierce: { a: 0.7620, b: 0.2380 },
            slash: { a: 0.7715, b: 0.2285 },
          },
        },
        'Ranger Armor': {
          baseDefense: { blunt: 33.57, pierce: 31.87, slash: 35.72 },
          densityCoeffs: {
            blunt: { a: 0.8671, b: 0.1329 },
            pierce: { a: 0.8541, b: 0.1459 },
            slash: { a: 0.8841, b: 0.1159 },
          },
        },
      },
    },
  'Keeled Scales': {
    weight: 0.0109,
    usageMultiplier: 0.65, // Fallback
    // Style-specific usage multipliers with density scaling
    usageMultiplierConfig: {
      'Risar Berserker': { a: 0.638, b: 0.012 },
      'Kallardian Norse': { a: 0.643, b: 0.007 },
      'Khurite Splinted': { a: 0.638, b: 0.010 },
      'Ranger Armor': { a: 0.656, b: -0.014 },
    },
    durability: 0.80, // Fallback value
    // Style-specific durability configurations
    durabilityConfig: {
      'Risar Berserker': { baseMin: 179.0, baseDensityContrib: 160.55, padContrib: 111.0 },
      'Kallardian Norse': { baseMin: 177.625, baseDensityContrib: 126.75, padContrib: 101.75 },
      'Khurite Splinted': { baseMin: 174.875, baseDensityContrib: 319.8, padContrib: 83.25 },
      'Ranger Armor': { baseMin: 181.5625, baseDensityContrib: 154.05, padContrib: 106.375 },
    },
    // Weight additive model: Keeled Scales is lighter than Plate Scales
    additiveWeightConfig: {
      minWeightOffset: -0.5,
      baseContribMult: 0.643,
    },
    // Style-specific defense configurations
    defenseConfig: {
      'Risar Berserker': {
        baseDefense: { blunt: 36.43, pierce: 29.93, slash: 31.8 },
        densityCoeffs: {
          blunt: { a: 0.8864, b: 0.1136 },
          pierce: { a: 0.8523, b: 0.1477 },
          slash: { a: 0.8774, b: 0.1226 },
        },
      },
      'Kallardian Norse': {
        baseDefense: { blunt: 33.16, pierce: 32.57, slash: 28.6 },
        densityCoeffs: {
          blunt: { a: 0.9038, b: 0.0962 },
          pierce: { a: 0.8956, b: 0.1044 },
          slash: { a: 0.8951, b: 0.1049 },
        },
      },
      'Khurite Splinted': {
        baseDefense: { blunt: 41.1, pierce: 36.91, slash: 34.2 },
        densityCoeffs: {
          blunt: { a: 0.8141, b: 0.1859 },
          pierce: { a: 0.7789, b: 0.2211 },
          slash: { a: 0.7895, b: 0.2105 },
        },
      },
      'Ranger Armor': {
        baseDefense: { blunt: 32.0, pierce: 30.47, slash: 34.4 },
        densityCoeffs: {
          blunt: { a: 0.8806, b: 0.1194 },
          pierce: { a: 0.8661, b: 0.1339 },
          slash: { a: 0.8953, b: 0.1047 },
        },
      },
    },
  },
  'Leptoid Scales': {
    weight: 0.0055,
    usageMultiplier: 0.36, // Fallback
    // Style-specific usage multipliers with density scaling
    usageMultiplierConfig: {
      'Risar Berserker': { a: 0.362, b: 0.0 },
      'Kallardian Norse': { a: 0.364, b: 0.0 },
      'Khurite Splinted': { a: 0.362, b: 0.0 },
      'Ranger Armor': { a: 0.375, b: -0.017 },
    },
    durability: 0.45, // Fallback value
    // Style-specific durability configurations
    durabilityConfig: {
      'Risar Berserker': { baseMin: 103.0, baseDensityContrib: 61.75, padContrib: 111.0 },
      'Kallardian Norse': { baseMin: 99.625, baseDensityContrib: 48.75, padContrib: 101.75 },
      'Khurite Splinted': { baseMin: 92.875, baseDensityContrib: 123.0, padContrib: 83.25 },
      'Ranger Armor': { baseMin: 102.5625, baseDensityContrib: 59.25, padContrib: 106.375 },
    },
    // Weight additive model: Leptoid Scales is much lighter than Plate Scales
    additiveWeightConfig: {
      minWeightOffset: -1.15,
      baseContribMult: 0.179,
    },
    // Style-specific defense configurations
    defenseConfig: {
      'Risar Berserker': {
        baseDefense: { blunt: 30.5, pierce: 22.54, slash: 25.54 },
        densityCoeffs: {
          blunt: { a: 0.9469, b: 0.0531 },
          pierce: { a: 0.9428, b: 0.0572 },
          slash: { a: 0.9514, b: 0.0486 },
        },
      },
      'Kallardian Norse': {
        baseDefense: { blunt: 28.0, pierce: 26.14, slash: 23.16 },
        densityCoeffs: {
          blunt: { a: 0.9554, b: 0.0446 },
          pierce: { a: 0.9621, b: 0.0379 },
          slash: { a: 0.9585, b: 0.0415 },
        },
      },
      'Khurite Splinted': {
        baseDefense: { blunt: 32.33, pierce: 25.99, slash: 24.95 },
        densityCoeffs: {
          blunt: { a: 0.9072, b: 0.0928 },
          pierce: { a: 0.9084, b: 0.0916 },
          slash: { a: 0.9078, b: 0.0922 },
        },
      },
      'Ranger Armor': {
        baseDefense: { blunt: 26.33, pierce: 23.4, slash: 28.42 },
        densityCoeffs: {
          blunt: { a: 0.9430, b: 0.0570 },
          pierce: { a: 0.9496, b: 0.0504 },
          slash: { a: 0.9592, b: 0.0408 },
        },
      },
    },
  },
  'Placoid Scales': {
    weight: 0.0055,
    usageMultiplier: 0.36, // Fallback
    // Style-specific usage multipliers with density scaling
    usageMultiplierConfig: {
      'Risar Berserker': { a: 0.362, b: 0.0 },
      'Kallardian Norse': { a: 0.364, b: 0.0 },
      'Khurite Splinted': { a: 0.362, b: 0.0 },
      'Ranger Armor': { a: 0.375, b: -0.017 },
    },
    durability: 0.50, // Fallback value
    // Style-specific durability configurations
    // Risar Berserker baseMin corrected from 110.35 to 113.45 based on 0/0 sample analysis
    durabilityConfig: {
      'Risar Berserker': { baseMin: 113.45, baseDensityContrib: 75.335, padContrib: 111.0 },
      'Kallardian Norse': { baseMin: 110.35, baseDensityContrib: 59.475, padContrib: 101.75 },
      'Khurite Splinted': { baseMin: 104.15, baseDensityContrib: 150.06, padContrib: 83.25 },
      'Ranger Armor': { baseMin: 113.425, baseDensityContrib: 72.1425, padContrib: 106.375 },
    },
    // Weight additive model: Placoid Scales is much lighter than Plate Scales
    additiveWeightConfig: {
      minWeightOffset: -1.2,
      baseContribMult: 0.143,
    },
    // Style-specific defense configurations
    defenseConfig: {
      'Risar Berserker': {
        baseDefense: { blunt: 30.88, pierce: 23.35, slash: 26.28 },
        densityCoeffs: {
          blunt: { a: 0.9421, b: 0.0579 },
          pierce: { a: 0.9302, b: 0.0698 },
          slash: { a: 0.9407, b: 0.0593 },
        },
      },
      'Kallardian Norse': {
        baseDefense: { blunt: 28.33, pierce: 26.85, slash: 23.8 },
        densityCoeffs: {
          blunt: { a: 0.9512, b: 0.0488 },
          pierce: { a: 0.9531, b: 0.0469 },
          slash: { a: 0.9496, b: 0.0504 },
        },
      },
      'Khurite Splinted': {
        baseDefense: { blunt: 32.89, pierce: 27.19, slash: 26.04 },
        densityCoeffs: {
          blunt: { a: 0.9000, b: 0.1000 },
          pierce: { a: 0.8893, b: 0.1107 },
          slash: { a: 0.8894, b: 0.1106 },
        },
      },
      'Ranger Armor': {
        baseDefense: { blunt: 26.7, pierce: 24.18, slash: 29.12 },
        densityCoeffs: {
          blunt: { a: 0.9382, b: 0.0618 },
          pierce: { a: 0.9380, b: 0.0620 },
          slash: { a: 0.9505, b: 0.0495 },
        },
      },
    },
  },
  'Pansar Scales': {
    weight: 0.0169,
    usageMultiplier: 1.21, // Fallback
    // Style-specific usage multipliers with density scaling
    usageMultiplierConfig: {
      'Risar Berserker': { a: 1.209, b: 0.014 },
      'Kallardian Norse': { a: 1.194, b: 0.015 },
      'Khurite Splinted': { a: 1.200, b: 0.013 },
      'Ranger Armor': { a: 1.211, b: 0.008 },
    },
    durability: 1.10, // Fallback value
    // Style-specific durability configurations
    // Kallardian Norse baseMin corrected from 242.75 to 243.44 based on 0/0 sample analysis
    durabilityConfig: {
      'Risar Berserker': { baseMin: 243.125, baseDensityContrib: 243.9125, padContrib: 111.0 },
      'Kallardian Norse': { baseMin: 243.44, baseDensityContrib: 192.7, padContrib: 101.75 },
      'Khurite Splinted': { baseMin: 244.0625, baseDensityContrib: 485.85, padContrib: 83.25 },
      'Ranger Armor': { baseMin: 248.22, baseDensityContrib: 234.0375, padContrib: 106.375 },
    },
    // Weight additive model: Pansar Scales is heavier than Plate Scales
    additiveWeightConfig: {
      minWeightOffset: 0.3,
      baseContribMult: 1.214,
    },
    // Style-specific defense configurations
    defenseConfig: {
      'Risar Berserker': {
        baseDefense: { blunt: 45.02, pierce: 34.3, slash: 35.94 },
        densityCoeffs: {
          blunt: { a: 0.8271, b: 0.1729 },
          pierce: { a: 0.8168, b: 0.1832 },
          slash: { a: 0.8425, b: 0.1575 },
        },
      },
      'Kallardian Norse': {
        baseDefense: { blunt: 40.62, pierce: 36.37, slash: 32.2 },
        densityCoeffs: {
          blunt: { a: 0.8529, b: 0.1471 },
          pierce: { a: 0.8671, b: 0.1329 },
          slash: { a: 0.8646, b: 0.1354 },
        },
      },
      'Khurite Splinted': {
        baseDefense: { blunt: 53.79, pierce: 43.37, slash: 40.32 },
        densityCoeffs: {
          blunt: { a: 0.7330, b: 0.2670 },
          pierce: { a: 0.7330, b: 0.2670 },
          slash: { a: 0.7411, b: 0.2589 },
        },
      },
      'Ranger Armor': {
        baseDefense: { blunt: 40.22, pierce: 34.65, slash: 38.36 },
        densityCoeffs: {
          blunt: { a: 0.8215, b: 0.1785 },
          pierce: { a: 0.8331, b: 0.1669 },
          slash: { a: 0.8639, b: 0.1361 },
        },
      },
    },
  },
};

/**
 * Get base material configuration with resolved defense, durability, and usage configs for the given armor style.
 * 
 * @param material - The base material
 * @param armorStyle - The armor style (affects defense values, durability, usage, and scaling)
 * @returns Base material config with resolved configurations
 */
export function getBaseMaterial(
  material: BaseMaterial,
  armorStyle: ArmorStyle
): BaseMaterialConfig & {
  resolvedDefenseConfig: StyleSpecificDefenseConfig | null;
  resolvedDurabilityConfig: StyleSpecificDurabilityConfig | null;
  resolvedUsageMultiplierConfig: StyleSpecificUsageMultiplierConfig | null;
} {
  const config = baseMaterials[material];
  if (!config) {
    throw new Error(
      `Base material "${material}" is not configured. Please add sample data to derive its properties.`
    );
  }

  // Resolve style-specific defense config
  // If null, caller should use armor style's base defense and density coefficients
  const resolvedDefenseConfig = config.defenseConfig[armorStyle] ?? null;

  // Resolve style-specific durability config
  // If null, caller should use base durability multiplier
  const resolvedDurabilityConfig = config.durabilityConfig?.[armorStyle] ?? null;

  // Resolve style-specific usage multiplier config
  // If not configured, return null (caller will use base usage multiplier)
  const resolvedUsageMultiplierConfig = config.usageMultiplierConfig?.[armorStyle] ?? null;

  return {
    ...config,
    resolvedDefenseConfig,
    resolvedDurabilityConfig,
    resolvedUsageMultiplierConfig,
  };
}
