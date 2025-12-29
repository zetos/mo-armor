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
  | 'Arthropod Carapace';

export type SupportMaterial =
  | 'Ironfur'
  | 'Ironsilk'
  | 'Ironwool'
  | 'Bloodsilk'
  | 'Guard Fur';

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

export type BaseMaterialConfig = {
  weight: number;
  weightMultiplier: number;
  /** Style-specific weight density coefficients. If provided, overrides the armor style's base coefficients. */
  weightConfig?: Partial<Record<ArmorStyle, StyleSpecificWeightConfig>>;
  usageMultiplier: number;
  /** Style-specific usage multipliers with density scaling. If provided, overrides the base usageMultiplier for that style. */
  usageMultiplierConfig?: Partial<Record<ArmorStyle, StyleSpecificUsageMultiplierConfig>>;
  durability: number;
  /** Style-specific defense configurations. Empty for Plate Scales (uses armor style's base values). */
  defenseConfig: Partial<Record<ArmorStyle, StyleSpecificDefenseConfig>>;
  /** Style-specific durability configurations. If empty, uses the base durability multiplier. */
  durabilityConfig?: Partial<Record<ArmorStyle, StyleSpecificDurabilityConfig>>;
};

/**
 * Padding material configuration per armor style.
 * Each material + style combination defines usage, weight, durability, and defense properties.
 */
export type PaddingMaterialConfig = {
  materialMultiplier: number;
  weight: number;
  weightDensityCoeffs: DensityCoeffs;
  /** Base-material-specific weight density coefficients. If provided, overrides weightDensityCoeffs for specific base materials. */
  weightDensityCoeffsPerBase?: Partial<Record<BaseMaterial, DensityCoeffs>>;
  durabilityMults: DurabilityMults;
  defense: DefenseStats;
  defenseDensityCoeffs: DefenseDensityCoeffs;
};
