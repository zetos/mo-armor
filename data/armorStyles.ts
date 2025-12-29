import type { ArmorStyle, PieceStats, DefenseStats } from '../types';

/**
 * Defense density scale coefficients per damage type.
 * Formula: scale(density) = a + b * (density / 100)
 * At density 100 -> 1.0, at density 0 -> a
 */
export type DefenseDensityCoeffs = {
  blunt: { a: number; b: number };
  pierce: { a: number; b: number };
  slash: { a: number; b: number };
};

/**
 * Density scale coefficients for base material usage.
 * Formula: usage(density) = baseUsage * (a + b * density/100)
 * At density=100: a + b = 1.0
 * At density=0: scale = a (intercept)
 */
export type UsageDensityCoeffs = { a: number; b: number };

/**
 * Durability density coefficients (additive model).
 * Formula: dura = (baseMin * paddingMinMult) + (baseDensityContrib * bd/100) + (padContrib * paddingPadMult * pd/100)
 * All values are for the torso piece at 100/100 with Ironfur.
 * Piece multipliers apply on top.
 */
export type DurabilityCoeffs = {
  /** Durability at 0/0 with Ironfur */
  baseMin: number;
  /** Additional durability from base density 0->100 */
  baseDensityContrib: number;
  /** Additional durability from padding density 0->100 with Ironfur */
  padContrib: number;
};

/**
 * Armor style configurations.
 * Each style defines:
 * - baseMaterialUsage: Amount of base material needed per piece (at 100% density)
 * - baseMaterialUsageDensityCoeffs: Density scaling for base material usage
 * - paddingUsage: Base padding amount per piece (before material multiplier, at 100% density)
 * - pieceWeightMultipliers: Per-piece weight adjustment multipliers
 * - durabilityCoeffs: Additive durability model coefficients
 * - baseDefense: Base defense values at 100% base density (from 100/0 Ironfur sample)
 * - baseDefenseDensityCoeffs: Per-damage-type density scaling for base defense
 */
export type ArmorStyleConfig = {
  baseMaterialUsage: PieceStats<number>;
  baseMaterialUsageDensityCoeffs: UsageDensityCoeffs;
  paddingUsage: PieceStats<number>;
  pieceWeightMultipliers: PieceStats<number>;
  durabilityCoeffs: DurabilityCoeffs;
  baseDefense: DefenseStats;
  baseDefenseDensityCoeffs: DefenseDensityCoeffs;
};

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
    pieceWeightMultipliers: {
      helm: 0.997,
      torso: 0.969,
      rightArm: 1.081,
      leftArm: 1.081,
      legs: 0.968,
    },
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
  },
};
