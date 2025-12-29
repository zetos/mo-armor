import type { BaseMaterial, BaseMaterialConfig, ArmorStyle, DefenseStats, StyleSpecificDefenseConfig } from '../types';

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
    weight: 0.01082,
    // Weight multiplier to match Plate Scales baseline
    // Derived from Risar Berserker samples: ~0.88
    weightMultiplier: 0.88,
    usageMultiplier: 1.96, // Derived from Kallardian Norse sample: 498/254 = 1.9606
    durability: 1.221, // 1/0.819, higher durability than Plate Scales
    // Style-specific defense configurations derived from 100/0 and 100/100 samples
    // For styles without 0% density samples, density coefficients default to style's base coefficients
    defenseConfig: {
      'Risar Berserker': {
        baseDefense: { blunt: 35.71, pierce: 32.38, slash: 35.48 },
        densityCoeffs: { /* Use style's base coeffs as fallback */
          blunt: { a: 0.8513, b: 0.1487 },
          pierce: { a: 0.8280, b: 0.1720 },
          slash: { a: 0.8533, b: 0.1467 },
        },
      },
      'Kallardian Norse': {
        baseDefense: { blunt: 32.53, pierce: 34.70, slash: 31.80 },
        densityCoeffs: { /* Use style's base coeffs as fallback */
          blunt: { a: 0.8737, b: 0.1263 },
          pierce: { a: 0.8761, b: 0.1239 },
          slash: { a: 0.8742, b: 0.1258 },
        },
      },
      'Khurite Splinted': {
        baseDefense: { blunt: 40.04, pierce: 40.54, slash: 39.64 },
        densityCoeffs: {
          blunt: { a: 0.8232, b: 0.1768 },
          pierce: { a: 0.7514, b: 0.2486 },
          slash: { a: 0.7465, b: 0.2535 },
        },
      },
    },
  },
   'Horned Scales': {
     weight: 0.0153,
     // Derived from Kallardian Norse samples: ~0.98
     weightMultiplier: 0.98,
     usageMultiplier: 0.83, // Derived from multiple samples
     durability: 0.91,
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
         densityCoeffs: { /* Use style's base coeffs as fallback */
           blunt: { a: 0.8453, b: 0.1547 },
           pierce: { a: 0.8431, b: 0.1569 },
           slash: { a: 0.8737, b: 0.1263 },
         },
       },
     },
   },
};

/**
 * Get base material configuration with resolved defense config for the given armor style.
 * 
 * @param material - The base material
 * @param armorStyle - The armor style (affects defense values and scaling)
 * @returns Base material config with resolved defense configuration
 */
export function getBaseMaterial(
  material: BaseMaterial, 
  armorStyle: ArmorStyle
): BaseMaterialConfig & { resolvedDefenseConfig: StyleSpecificDefenseConfig | null } {
  const config = baseMaterials[material];
  if (!config) {
    throw new Error(
      `Base material "${material}" is not configured. Please add sample data to derive its properties.`
    );
  }
  
  // Resolve style-specific defense config
  // If null, caller should use armor style's base defense and density coefficients
  const resolvedDefenseConfig = config.defenseConfig[armorStyle] ?? null;
  
  return { 
    ...config, 
    resolvedDefenseConfig 
  };
}
