export type ArmorStyle =
  | 'Ranger Armor'
  | 'Risar Berserker'
  | 'Kallardian Norse'
  | 'Khurite Splinted';

export type BaseMaterial =
  | 'Ironfur'
  | 'Ironsilk'
  | 'Ironwool'
  | 'Bloodsilk'
  | 'Leptoid Scales'
  | 'Horned Scales'
  | 'Keeled Scales'
  | 'Plate Scales'
  | 'Placoid Scales'
  | 'Pansar Scales'
  | 'Arthropod Carapace'
  | 'Ganoid Scales';

export type SupportMaterial =
  | 'Ironfur'
  | 'Ironsilk'
  | 'Ironwool'
  | 'Bloodsilk'
  | 'Guard Fur'
  | 'Quality Leather'
  | 'Raw Hide';

export type MaterialUsage = {
  base: number;
  padding: number;
};

export type DefenseStats = {
  blunt: number;
  pierce: number;
  slash: number;
};

export type PieceStats<T> = {
  helm: T;
  torso: T;
  rightArm: T;
  leftArm: T;
  legs: T;
};

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

export const PIECE_KEYS: readonly (keyof PieceStats<unknown>)[] = [
  'helm',
  'torso',
  'rightArm',
  'leftArm',
  'legs',
] as const;

export type PieceKey = (typeof PIECE_KEYS)[number];

/**
 * Linear density scale coefficients.
 * Formula: scale(density) = a + b * (density / 100)
 * At density 100: a + b = 1.0
 * At density 0: scale = a (intercept)
 */
export type DensityCoeffs = {
  a: number;
  b: number;
};

/**
 * Defense density scale coefficients per damage type.
 */
export type DefenseDensityCoeffs = {
  blunt: DensityCoeffs;
  pierce: DensityCoeffs;
  slash: DensityCoeffs;
};

/**
 * Durability multipliers for padding materials.
 * Used with the additive durability model:
 *   dura = (baseMin * minMult) + (baseDensityContrib * bd/100) + (padContrib * padMult * pd/100)
 */
export type DurabilityMults = {
  /** Multiplier for baseMin (durability at 0% densities) */
  minMult: number;
  /** Multiplier for padding density contribution */
  padMult: number;
};

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
 * Weight configuration for armor styles.
 * Used with the additive weight model:
 *   setWeight = (baseMinWeight + padOffset + baseOffset) + baseContrib*(bd/100) + padContrib*(pd/100)
 */
export type StyleWeightConfig = {
  /** Weight at 0% base and 0% padding density with Plate Scales + Ironsilk */
  baseMinWeight: number;
  /** Weight contribution from base density 0->100% with Plate Scales */
  baseContrib: number;
};

/**
 * Per-piece weight coefficients for the additive weight model.
 * Each piece has its own minWeight, baseContrib, and padContrib.
 *
 * Formula: pieceWeight(bd, pd) = minWeight + baseContrib*(bd/100) + padContrib*(pd/100)
 *
 * These are derived from corner samples with Ironfur padding.
 * For other padding materials, adjust minWeight and padContrib using
 * the padding material's minWeightOffset and padContrib ratio.
 */
export type PieceWeightCoeffs = {
  /** Weight at 0/0 density with Plate Scales + Ironfur */
  minWeight: number;
  /** Weight contribution from base density 0->100% */
  baseContrib: number;
  /** Weight contribution from padding density 0->100% with Ironfur */
  padContrib: number;
};

/**
 * Armor style configuration.
 * Each style defines base material usage, padding usage, weight multipliers,
 * durability coefficients, and defense values.
 */
export type ArmorStyleConfig = {
  baseMaterialUsage: PieceStats<number>;
  baseMaterialUsageDensityCoeffs: DensityCoeffs;
  paddingUsage: PieceStats<number>;
  pieceWeightMultipliers: PieceStats<number>;
  baseWeightDensityCoeffs: DensityCoeffs;
  durabilityCoeffs: DurabilityCoeffs;
  baseDefense: DefenseStats;
  baseDefenseDensityCoeffs: DefenseDensityCoeffs;
  /** Weight configuration for additive weight model (set-level) */
  weightConfig: StyleWeightConfig;
  /** Per-piece weight coefficients for additive weight model (derived from Ironfur samples) */
  pieceWeightCoeffs: PieceStats<PieceWeightCoeffs>;
};

/**
 * Style-specific defense configuration for a base material.
 * Each material can have different base defense values and density scaling per style.
 */
export type StyleSpecificDefenseConfig = {
  /** Base defense values at 100% density with 0% padding */
  baseDefense: DefenseStats;
  /** Density scaling coefficients for this material on this style */
  densityCoeffs: DefenseDensityCoeffs;
};

/**
 * Style-specific durability configuration for a base material.
 * Each material can have different durability coefficients per style.
 * Uses the same additive model as armor styles but with material-specific values.
 */
export type StyleSpecificDurabilityConfig = {
  /** Durability at 0/0 with Ironfur (base minimum) */
  baseMin: number;
  /** Additional durability from base density 0->100 */
  baseDensityContrib: number;
  /** Additional durability from padding density 0->100 with Ironfur */
  padContrib: number;
};

/**
 * Base material configuration.
 * Each material defines weight, usage, durability, and defense properties.
 * Defense values and scaling are style-specific for materials other than Plate Scales.
 */
/**
 * Style-specific usage multiplier configuration for a base material.
 * The effective multiplier scales with base density: mult(d) = a + b * (d / 100)
 */
export type StyleSpecificUsageMultiplierConfig = {
  /** Multiplier at 0% density */
  a: number;
  /** Additional multiplier contribution from 0% to 100% density */
  b: number;
};

/**
 * Style-specific weight configuration for a base material.
 * Allows overriding weight density coefficients per style.
 */
export type StyleSpecificWeightConfig = {
  /** Weight density coefficients (scale = a + b * density/100) */
  densityCoeffs: DensityCoeffs;
};

/**
 * Weight configuration for base materials in the additive model.
 * These values are added/multiplied to the armor style's base weight config.
 */
export type BaseMaterialWeightConfig = {
  /** Offset added to styleBaseMinWeight (e.g., -0.25 for Horned Scales) */
  minWeightOffset: number;
  /** Multiplier for styleBaseContrib (e.g., 0.82 for Horned Scales) */
  baseContribMult: number;
};

export type BaseMaterialConfig = {
  weight: number;
  /** Weight configuration for additive weight model */
  additiveWeightConfig: BaseMaterialWeightConfig;
  usageMultiplier: number;
  /** Style-specific usage multipliers with density scaling. If provided, overrides the base usageMultiplier for that style. */
  usageMultiplierConfig?: Partial<
    Record<ArmorStyle, StyleSpecificUsageMultiplierConfig>
  >;
  durability: number;
  /** Style-specific defense configurations. Empty for Plate Scales (uses armor style's base values). */
  defenseConfig: Partial<Record<ArmorStyle, StyleSpecificDefenseConfig>>;
  /** Style-specific durability configurations. If empty, uses the base durability multiplier. */
  durabilityConfig?: Partial<Record<ArmorStyle, StyleSpecificDurabilityConfig>>;
};

/**
 * Weight configuration for padding materials in the additive model.
 * These values are added to the armor style's base weight config.
 */
export type PaddingMaterialWeightConfig = {
  /** Offset added to minWeight (e.g., 0.5 for Ironfur, 0.0 for Ironsilk) */
  minWeightOffset: number;
  /** Weight contribution from padding density 0->100% (set-level, for fallback) */
  padContrib: number;
  /** Ratio to apply to per-piece padContrib (1.0 for Ironfur, ~0.286 for Ironsilk) */
  padContribRatio: number;
};

/**
 * Padding material configuration per armor style.
 * Each material + style combination defines usage, durability, and defense properties.
 * Weight values are retrieved from shared config (SHARED_PADDING_CONFIG) or style-specific config.
 */
export type PaddingMaterialConfig = {
  materialMultiplier: number;
  durabilityMults: DurabilityMults;
  defense: DefenseStats;
  defenseDensityCoeffs: DefenseDensityCoeffs;
};
