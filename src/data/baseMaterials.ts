import type { BaseMaterial, BaseMaterialConfig, ArmorStyle, DefenseStats, StyleSpecificDefenseConfig, StyleSpecificDurabilityConfig, StyleSpecificUsageMultiplierConfig, StyleSpecificWeightConfig } from '../types';

export const baseMaterials: Partial<Record<BaseMaterial, BaseMaterialConfig>> = {
  'Plate Scales': {
    weight: 0.01431,
    // Baseline weight multiplier (Plate Scales is the baseline)
    weightMultiplier: 1.0,
    usageMultiplier: 1.0, // Baseline - armorStyles are calibrated with Plate Scales
    durability: 1.0, // Baseline for durability
    // Plate Scales uses each armor style's base defense and density coefficients
    defenseConfig: {},
  },
  'Arthropod Carapace': {
    weight: 0.01131,  // Derived from 100%/0% analysis: baseContrib / (baseUsage * pieceMult)
    // Weight multiplier to match Plate Scales baseline  
    weightMultiplier: 1.0,  // Baked into weight value
    // Style-specific weight density coefficients
    // Arthropod Carapace has INVERSE density scaling: weight per unit is HIGHER at low densities
    // At 0% density: scale = ~1.96, at 100% density: scale = 1.0
    // This is because the material usage increases faster than the weight
    weightConfig: {
      'Khurite Splinted': { densityCoeffs: { a: 1.96, b: -0.96 } },
    },
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
    },
  },
   'Horned Scales': {
     weight: 0.0153,
     // Derived from Kallardian Norse samples: ~0.98
     weightMultiplier: 0.98,
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
  resolvedWeightConfig: StyleSpecificWeightConfig | null;
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
  
  // Resolve style-specific weight config
  // If not configured, return null (caller will use armor style's base weight coefficients)
  const resolvedWeightConfig = config.weightConfig?.[armorStyle] ?? null;
  
  return { 
    ...config, 
    resolvedDefenseConfig,
    resolvedDurabilityConfig,
    resolvedUsageMultiplierConfig,
    resolvedWeightConfig
  };
}
