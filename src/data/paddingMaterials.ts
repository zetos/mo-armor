import type { SupportMaterial, ArmorStyle, PaddingMaterialConfig } from '../types';

export const paddingMaterials: Record<ArmorStyle, Partial<Record<SupportMaterial, PaddingMaterialConfig>>> = {
  'Risar Berserker': {
    Ironfur: {
      materialMultiplier: 1.0,
      weight: 0.0093,
      // Derived: padScale(0) = 0.628 from Kallardian Norse samples (universal for Ironfur)
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
      weight: 0.00443, // Adjusted for precision: was 0.00421
      // Derived: padScale(0) = 0.8406 from Risar Berserker samples
      weightDensityCoeffs: { a: 0.8406, b: 0.1594 },
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
      // Derived from Risar Berserker samples: 0.00868
      weight: 0.00868,
      // Derived from 100/0 vs 100/100 samples: baseScale(0) = 0.6816
      weightDensityCoeffs: { a: 0.6816, b: 0.3184 },
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
      // Derived from Risar Berserker samples: 0.00443
      weight: 0.00443,
      // Derived from 100/0 vs 100/100 samples: baseScale(0) = 0.7909
      weightDensityCoeffs: { a: 0.7909, b: 0.2091 },
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
  },
  'Kallardian Norse': {
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
      weight: 0.00418, // Derived from Kallardian Norse samples
      // Derived: padScale(0) = 0.8303 from Kallardian Norse samples
      weightDensityCoeffs: { a: 0.8303, b: 0.1697 },
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
      materialMultiplier: 0.995,
      weight: 0.00868,
      weightDensityCoeffs: { a: 0.6816, b: 0.3184 },
      durabilityMults: { minMult: 0.989, padMult: 0.989 },
      defense: {
        blunt: 5.39,
        pierce: 5.30,
        slash: 5.64,
      },
      defenseDensityCoeffs: {
        blunt: { a: -0.4917, b: 1.4917 },
        pierce: { a: -0.1132, b: 1.1132 },
        slash: { a: -0.0851, b: 1.0851 },
      },
    },
    Bloodsilk: {
      materialMultiplier: 1.485,
      weight: 0.00443,
      weightDensityCoeffs: { a: 0.7909, b: 0.2091 },
      durabilityMults: { minMult: 0.992, padMult: 0.992 },
      defense: {
        blunt: 0.57,
        pierce: 11.50,
        slash: 9.48,
      },
      defenseDensityCoeffs: {
        blunt: { a: -8.8596, b: 9.8596 },
        pierce: { a: 0.2174, b: 0.7826 },
        slash: { a: 0.1519, b: 0.8481 },
      },
    },
  },
  'Khurite Splinted': {
    Ironfur: {
      materialMultiplier: 1.0,
      weight: 0.0095, // Adjusted: was 0.0093
      // Adjusted for Khurite Splinted: a adjusted to balance samples
      weightDensityCoeffs: { a: 0.72, b: 0.28 },
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
      weight: 0.00488, // Derived from Khurite Splinted samples
      // Derived: padScale(0) = 0.8722 from Khurite Splinted samples
      weightDensityCoeffs: { a: 0.8722, b: 0.1278 },
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
      materialMultiplier: 0.995,
      weight: 0.00868,
      weightDensityCoeffs: { a: 0.6816, b: 0.3184 },
      durabilityMults: { minMult: 0.989, padMult: 0.989 },
      defense: {
        blunt: 5.39,
        pierce: 5.30,
        slash: 5.64,
      },
      defenseDensityCoeffs: {
        blunt: { a: -0.4917, b: 1.4917 },
        pierce: { a: -0.1132, b: 1.1132 },
        slash: { a: -0.0851, b: 1.0851 },
      },
    },
    Bloodsilk: {
      materialMultiplier: 1.485,
      weight: 0.00443,
      weightDensityCoeffs: { a: 0.7909, b: 0.2091 },
      durabilityMults: { minMult: 0.992, padMult: 0.992 },
      defense: {
        blunt: 0.57,
        pierce: 11.50,
        slash: 9.48,
      },
      defenseDensityCoeffs: {
        blunt: { a: -8.8596, b: 9.8596 },
        pierce: { a: 0.2174, b: 0.7826 },
        slash: { a: 0.1519, b: 0.8481 },
      },
    },
  },
  'Ranger Armor': {
    Ironfur: {
      materialMultiplier: 1.0,
      weight: 0.0093,
      // Derived: padScale(0) = 0.628 from Kallardian Norse samples (universal for Ironfur)
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
      weight: 0.00442, // Derived from Ranger Armor samples
      // Derived: padScale(0) = 0.8406 from Ranger Armor samples
      weightDensityCoeffs: { a: 0.8406, b: 0.1594 },
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
      materialMultiplier: 0.995,
      weight: 0.00868,
      weightDensityCoeffs: { a: 0.6816, b: 0.3184 },
      durabilityMults: { minMult: 0.989, padMult: 0.989 },
      defense: {
        blunt: 5.39,
        pierce: 5.30,
        slash: 5.64,
      },
      defenseDensityCoeffs: {
        blunt: { a: -0.4917, b: 1.4917 },
        pierce: { a: -0.1132, b: 1.1132 },
        slash: { a: -0.0851, b: 1.0851 },
      },
    },
    Bloodsilk: {
      materialMultiplier: 1.485,
      weight: 0.00443,
      weightDensityCoeffs: { a: 0.7909, b: 0.2091 },
      durabilityMults: { minMult: 0.992, padMult: 0.992 },
      defense: {
        blunt: 0.57,
        pierce: 11.50,
        slash: 9.48,
      },
      defenseDensityCoeffs: {
        blunt: { a: -8.8596, b: 9.8596 },
        pierce: { a: 0.2174, b: 0.7826 },
        slash: { a: 0.1519, b: 0.8481 },
      },
    },
  },
};

export function getPaddingMaterial(armorStyle: ArmorStyle, material: SupportMaterial): PaddingMaterialConfig {
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
