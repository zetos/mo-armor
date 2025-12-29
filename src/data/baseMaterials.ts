import type { BaseMaterial, BaseMaterialConfig } from '../types';

export const baseMaterials: Partial<Record<BaseMaterial, BaseMaterialConfig>> = {
  'Plate Scales': {
    weight: 0.01431,
    // Baseline weight multiplier (Plate Scales is the baseline)
    weightMultiplier: 1.0,
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
    // Weight multiplier to match Plate Scales baseline
    // Derived from Risar Berserker samples: ~0.88
    weightMultiplier: 0.88,
    usageMultiplier: 1.96, // Derived from Kallardian Norse sample: 498/254 = 1.9606
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
     // Derived from Kallardian Norse samples: ~0.98
     weightMultiplier: 0.98,
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
