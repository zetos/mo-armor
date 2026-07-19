import type {
  ArmorMaterialName,
  ArmorStyleName,
  PaddingMaterialName,
} from './catalog/armor';

export type ArmorStyle = ArmorStyleName;
export type BaseMaterial = ArmorMaterialName;
export type SupportMaterial = PaddingMaterialName;

export type MaterialUsage = {
  base: number;
  padding: number;
};

export type DefenseStats = {
  blunt: number;
  pierce: number;
  slash: number;
};

export const PIECE_KEYS = [
  'helm',
  'torso',
  'rightArm',
  'leftArm',
  'legs',
] as const;

export type PieceKey = (typeof PIECE_KEYS)[number];

export type PieceStats<T> = Record<PieceKey, T>;

export function mapPieceStats<T>(map: (piece: PieceKey) => T): PieceStats<T> {
  return {
    helm: map('helm'),
    torso: map('torso'),
    rightArm: map('rightArm'),
    leftArm: map('leftArm'),
    legs: map('legs'),
  };
}

export type SetStats = {
  armorStyle: ArmorStyle;
  base: BaseMaterial;
  padding: SupportMaterial;
  baseDensity: number;
  paddingDensity: number;
  setWeight: number;
  setDura: number;
  setMaterialUsage: MaterialUsage;
  setDefense: DefenseStats;
  pieceWeight: PieceStats<number>;
  pieceDurability: PieceStats<number>;
  pieceMaterialUsage: PieceStats<MaterialUsage>;
};

export type CalculateSetStatusInput<
  B extends BaseMaterial,
  S extends SupportMaterial
> = {
  armorStyle: ArmorStyle;
  base: B;
  padding: S;
  baseDensity: number;
  paddingDensity: number;
};

/** Scale = a + b * density / 100. */
export type DensityCoeffs = {
  a: number;
  b: number;
};

export type DefenseDensityCoeffs = {
  blunt: DensityCoeffs;
  pierce: DensityCoeffs;
  slash: DensityCoeffs;
};

export type DurabilityMults = {
  minMult: number;
  padMult: number;
};

/** Torso durability coefficients calibrated with Ironfur. */
export type DurabilityCoeffs = {
  baseMin: number;
  baseDensityContrib: number;
  padContrib: number;
};

/** Set weight = minimum + base contribution + padding contribution. */
export type StyleWeightConfig = {
  baseMinWeight: number;
  baseContrib: number;
};

/**
 * Formula: pieceWeight(bd, pd) = minWeight + baseContrib*(bd/100) + padContrib*(pd/100)
 */
export type PieceWeightCoeffs = {
  minWeight: number;
  baseContrib: number;
  padContrib: number;
};

export type ArmorStyleConfig = {
  baseMaterialUsage: PieceStats<number>;
  baseMaterialUsageDensityCoeffs: DensityCoeffs;
  paddingUsage: PieceStats<number>;
  paddingUsageDensityCoeffs: DensityCoeffs;
  paddingDefenseMultiplier: number;
  paddingWeightMultiplier: number;
  /** @deprecated Not used by the additive weight model. */
  pieceWeightMultipliers: PieceStats<number>;
  /** @deprecated Not used by the additive weight model. */
  baseWeightDensityCoeffs: DensityCoeffs;
  durabilityCoeffs: DurabilityCoeffs;
  baseDefense: DefenseStats;
  baseDefenseDensityCoeffs: DefenseDensityCoeffs;
  weightConfig: StyleWeightConfig;
  pieceWeightCoeffs: PieceStats<PieceWeightCoeffs>;
};

export type StyleSpecificDefenseConfig = {
  baseDefense: DefenseStats;
  densityCoeffs: DefenseDensityCoeffs;
};

export type StyleSpecificDurabilityConfig = DurabilityCoeffs;

export type StyleSpecificUsageMultiplierConfig = DensityCoeffs;

/** @deprecated Not used by the additive weight model. */
export type StyleSpecificWeightConfig = {
  densityCoeffs: DensityCoeffs;
};

export type BaseMaterialWeightConfig = {
  minWeightOffset: number;
  baseContribMult: number;
  pieceBaseContribMult?: number | PieceStats<number>;
};

export type BaseMaterialConfig = {
  /** @deprecated Not used by the additive weight model. */
  weight: number;
  additiveWeightConfig: BaseMaterialWeightConfig;
  usageMultiplier: number;
  usageMultiplierConfig?: Partial<
    Record<ArmorStyle, StyleSpecificUsageMultiplierConfig>
  >;
  pieceUsageMultiplierConfig?: Partial<
    Record<ArmorStyle, PieceStats<StyleSpecificUsageMultiplierConfig>>
  >;
  durability: number;
  defenseConfig: Partial<Record<ArmorStyle, StyleSpecificDefenseConfig>>;
  durabilityConfig?: Partial<Record<ArmorStyle, StyleSpecificDurabilityConfig>>;
};

export type PaddingMaterialWeightConfig = {
  minWeightOffset: number;
  padContrib: number;
  padContribRatio: number;
};

export type PaddingMaterialConfig = {
  materialMultiplier: number;
  pieceMaterialMultiplierConfig?: PieceStats<DensityCoeffs>;
  durabilityMults: DurabilityMults;
  defense: DefenseStats;
  defenseDensityCoeffs: DefenseDensityCoeffs;
};
