import type {
  ArmorStyle,
  PieceStats,
  DefenseStats,
  ArmorStyleConfig,
  DefenseDensityCoeffs,
  PieceWeightCoeffs,
} from '../types';

export type { DefenseDensityCoeffs };

export const armorStyles: Record<ArmorStyle, ArmorStyleConfig> = {
  'Risar Berserker': {
    // Note: baseMaterialUsage is calibrated for Plate Scales (usageMultiplier = 1.0)
    baseMaterialUsage: {
      helm: 35,
      torso: 96,
      rightArm: 35,
      leftArm: 35,
      legs: 90,
    },
    // Derived: at0=130, at100=291 => a = 130/291 = 0.4467
    baseMaterialUsageDensityCoeffs: { a: 0.4467, b: 0.5533 },
    paddingUsage: {
      helm: 48,
      torso: 134,
      rightArm: 48,
      leftArm: 48,
      legs: 126,
    },
    // Derived from Plate Scales 100/100 sample (weightMultiplier = 1.0)
    // actual / (baseW + padW) where baseW = 35*0.01431, padW = 48*0.0093
    pieceWeightMultipliers: {
      helm: 1.0876,
      torso: 1.0458,
      rightArm: 1.1719,
      leftArm: 1.1719,
      legs: 1.0447,
    },
    // Derived from Kallardian Norse: baseScale(0) = 0.62
    baseWeightDensityCoeffs: { a: 0.62, b: 0.38 },
    // Durability additive model: dura = baseMin*padMinMult + baseDensityContrib*bd/100 + padContrib*padPadMult*pd/100
    // Derived from 100/0, 0/100, 100/100 Ironfur samples (at0_0 derived = 221.75)
    durabilityCoeffs: {
      baseMin: 221.75,
      baseDensityContrib: 216.13,
      padContrib: 111.0,
    },
    // Derived from 100/0 Ironfur sample
    baseDefense: {
      blunt: 41.08,
      pierce: 32.84,
      slash: 34.56,
    },
    // Derived from 0/100 vs 100/0 samples: baseScale(0) = (D(0/100) - padDef) / baseDef
    baseDefenseDensityCoeffs: {
      blunt: { a: 0.8513, b: 0.1487 },
      pierce: { a: 0.8280, b: 0.1720 },
      slash: { a: 0.8533, b: 0.1467 },
    },
    // Weight additive model: setWeight = minWeight + baseContrib*(bd/100) + padContrib*(pd/100)
    // baseMinWeight: Weight at 0/0 with Plate Scales + Ironsilk
    // baseContrib: Weight contribution from base density 0->100% with Plate Scales
    weightConfig: {
      baseMinWeight: 4.85,
      baseContrib: 1.82,
    },
    // Per-piece weight coefficients (derived from Ironfur corner samples)
    pieceWeightCoeffs: {
      helm: { minWeight: 0.64, baseContrib: 0.22, padContrib: 0.17 },
      torso: { minWeight: 1.71, baseContrib: 0.58, padContrib: 0.45 },
      rightArm: { minWeight: 0.7, baseContrib: 0.23, padContrib: 0.18 },
      leftArm: { minWeight: 0.7, baseContrib: 0.23, padContrib: 0.18 },
      legs: { minWeight: 1.61, baseContrib: 0.54, padContrib: 0.42 },
    },
  },
  'Kallardian Norse': {
    baseMaterialUsage: {
      helm: 31,
      torso: 81,
      rightArm: 33,
      leftArm: 33,
      legs: 76,
    },
    // Derived: at0=129, at100=254 => a = 129/254 = 0.5079
    baseMaterialUsageDensityCoeffs: { a: 0.5079, b: 0.4921 },
    paddingUsage: {
      helm: 48,
      torso: 130,
      rightArm: 52,
      leftArm: 52,
      legs: 122,
    },
    pieceWeightMultipliers: {
      helm: 1.0,
      torso: 1.0,
      rightArm: 1.0,
      leftArm: 1.0,
      legs: 1.0,
    },
    // Derived from 0/100 samples: baseScale(0) = 0.62
    baseWeightDensityCoeffs: { a: 0.62, b: 0.38 },
    // Durability additive model: dura = baseMin*padMinMult + baseDensityContrib*bd/100 + padContrib*padPadMult*pd/100
    // Derived from 0/0, 100/0, 0/100, 100/100 Ironfur samples
    durabilityCoeffs: {
      baseMin: 221.5,
      baseDensityContrib: 170.63,
      padContrib: 101.75,
    },
    // Derived from 100/0 Ironfur sample
    baseDefense: {
      blunt: 37.2,
      pierce: 35.1,
      slash: 31.0,
    },
    // Derived from 0/100 vs 100/0 samples: baseScale(0) = (D(0/100) - padDef) / baseDef
    baseDefenseDensityCoeffs: {
      blunt: { a: 0.8737, b: 0.1263 },
      pierce: { a: 0.8761, b: 0.1239 },
      slash: { a: 0.8742, b: 0.1258 },
    },
    // Weight additive model: setWeight = minWeight + baseContrib*(bd/100) + padContrib*(pd/100)
    weightConfig: {
      baseMinWeight: 4.1,
      baseContrib: 1.4,
    },
    // Per-piece weight coefficients (derived from Ironfur corner samples)
    pieceWeightCoeffs: {
      helm: { minWeight: 0.55, baseContrib: 0.17, padContrib: 0.17 },
      torso: { minWeight: 1.47, baseContrib: 0.45, padContrib: 0.45 },
      rightArm: { minWeight: 0.6, baseContrib: 0.18, padContrib: 0.18 },
      leftArm: { minWeight: 0.6, baseContrib: 0.18, padContrib: 0.18 },
      legs: { minWeight: 1.38, baseContrib: 0.42, padContrib: 0.42 },
    },
  },
  'Khurite Splinted': {
    baseMaterialUsage: {
      helm: 52,
      torso: 142,
      rightArm: 52,
      leftArm: 52,
      legs: 133,
    },
    // Derived: at0=130, at100=431 => a = 130/431 = 0.3016
    baseMaterialUsageDensityCoeffs: { a: 0.3016, b: 0.6984 },
    paddingUsage: {
      helm: 48,
      torso: 134,
      rightArm: 48,
      leftArm: 48,
      legs: 126,
    },
    pieceWeightMultipliers: {
      helm: 1.193,
      torso: 1.159,
      rightArm: 1.294,
      leftArm: 1.294,
      legs: 1.158,
    },
    // Derived from 100/100 vs 0/100 Ironfur samples: baseScale(0) = 0.5249
    baseWeightDensityCoeffs: { a: 0.5249, b: 0.4751 },
    // Durability additive model: dura = baseMin*padMinMult + baseDensityContrib*bd/100 + padContrib*padPadMult*pd/100
    // Derived from 100/0, 0/100, 100/100 Ironfur samples (at0_0 derived = 221.0)
    durabilityCoeffs: {
      baseMin: 221.0,
      baseDensityContrib: 430.5,
      padContrib: 83.25,
    },
    // Derived from 100/0 Ironfur sample
    baseDefense: {
      blunt: 47.97,
      pierce: 41.22,
      slash: 38.28,
    },
    // Derived from 0/100 vs 100/0 samples: baseScale(0) = (D(0/100) - padDef) / baseDef
    baseDefenseDensityCoeffs: {
      blunt: { a: 0.7649, b: 0.2351 },
      pierce: { a: 0.7467, b: 0.2533 },
      slash: { a: 0.7555, b: 0.2445 },
    },
    // Weight additive model: setWeight = minWeight + baseContrib*(bd/100) + padContrib*(pd/100)
    weightConfig: {
      baseMinWeight: 6.6,
      baseContrib: 3.36,
    },
    // Per-piece weight coefficients (derived from Ironfur corner samples)
    pieceWeightCoeffs: {
      helm: { minWeight: 0.85, baseContrib: 0.41, padContrib: 0.17 },
      torso: { minWeight: 2.27, baseContrib: 1.08, padContrib: 0.45 },
      rightArm: { minWeight: 0.92, baseContrib: 0.44, padContrib: 0.19 },
      leftArm: { minWeight: 0.92, baseContrib: 0.44, padContrib: 0.19 },
      legs: { minWeight: 2.13, baseContrib: 1.01, padContrib: 0.42 },
    },
  },
  'Ranger Armor': {
    baseMaterialUsage: {
      helm: 28,
      torso: 84,
      rightArm: 39,
      leftArm: 39,
      legs: 89,
    },
    // Derived: at0=128, at100=279 => a = 128/279 = 0.4588
    baseMaterialUsageDensityCoeffs: { a: 0.4588, b: 0.5412 },
    paddingUsage: {
      helm: 40,
      torso: 122,
      rightArm: 56,
      leftArm: 56,
      legs: 130,
    },
    pieceWeightMultipliers: {
      helm: 1.061,
      torso: 1.121,
      rightArm: 1.066,
      leftArm: 1.066,
      legs: 0.987,
    },
    // Derived from 100/100 vs 0/100 Ironfur samples: baseScale(0) = 0.5901
    baseWeightDensityCoeffs: { a: 0.5901, b: 0.4099 },
    // Durability additive model: dura = baseMin*padMinMult + baseDensityContrib*bd/100 + padContrib*padPadMult*pd/100
    // Derived from 100/0, 0/100, 100/100 Ironfur samples (at0_0 derived = 226.01)
    durabilityCoeffs: {
      baseMin: 226.01,
      baseDensityContrib: 207.37,
      padContrib: 106.37,
    },
    // Derived from 100/0 Ironfur sample
    baseDefense: {
      blunt: 36.45,
      pierce: 33.26,
      slash: 37.04,
    },
    // Derived from 0/100 vs 100/0 samples: baseScale(0) = (D(0/100) - padDef) / baseDef
    baseDefenseDensityCoeffs: {
      blunt: { a: 0.8453, b: 0.1547 },
      pierce: { a: 0.8431, b: 0.1569 },
      slash: { a: 0.8737, b: 0.1263 },
    },
    // Weight additive model: setWeight = minWeight + baseContrib*(bd/100) + padContrib*(pd/100)
    weightConfig: {
      baseMinWeight: 4.6,
      baseContrib: 1.68,
    },
    // Per-piece weight coefficients (derived from Ironfur corner samples)
    pieceWeightCoeffs: {
      helm: { minWeight: 0.51, baseContrib: 0.17, padContrib: 0.14 },
      torso: { minWeight: 1.63, baseContrib: 0.54, padContrib: 0.45 },
      rightArm: { minWeight: 0.71, baseContrib: 0.24, padContrib: 0.2 },
      leftArm: { minWeight: 0.71, baseContrib: 0.24, padContrib: 0.2 },
      legs: { minWeight: 1.53, baseContrib: 0.5, padContrib: 0.42 },
    },
  },
};
