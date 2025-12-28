import type { ArmorStyle, PieceStats, DefenseStats } from '../types';

/**
 * Armor style configurations.
 * Each style defines:
 * - baseMaterialUsage: Amount of base material needed per piece (at 100% density)
 * - paddingUsage: Base padding amount per piece (before material multiplier, at 100% density)
 * - pieceWeightMultipliers: Per-piece weight adjustment multipliers
 * - durabilityBase: Base durability value for torso (other pieces scale from this)
 * - baseDefense: Base defense values before padding is added
 */
export type ArmorStyleConfig = {
  baseMaterialUsage: PieceStats<number>;
  paddingUsage: PieceStats<number>;
  pieceWeightMultipliers: PieceStats<number>;
  durabilityBase: number;
  baseDefense: DefenseStats;
};

export const armorStyles: Record<ArmorStyle, ArmorStyleConfig> = {
  'Risar Berserker': {
    baseMaterialUsage: {
      helm: 69,
      torso: 188,
      rightArm: 69,
      leftArm: 69,
      legs: 177,
    },
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
    durabilityBase: 669.05,
    baseDefense: {
      blunt: 30.38,
      pierce: 24.88,
      slash: 28.08,
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
    durabilityBase: 493.88,
    baseDefense: {
      blunt: 31.87,
      pierce: 27.6,
      slash: 23.6,
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
    durabilityBase: 734.75,
    baseDefense: {
      blunt: 42.64,
      pierce: 33.72,
      slash: 30.88,
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
    durabilityBase: 539.75,
    baseDefense: {
      blunt: 31.12,
      pierce: 25.76,
      slash: 29.64,
    },
  },
};
