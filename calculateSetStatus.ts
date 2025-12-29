import type {
  ArmorStyle,
  BaseMaterial,
  SupportMaterial,
  SetStats,
  CalculateSetStatusInput,
  PieceStats,
  MaterialUsage,
  DefenseStats,
  PieceKey,
} from './types';
import { armorStyles, type DefenseDensityCoeffs } from './data/armorStyles';
import { getBaseMaterial } from './data/baseMaterials';
import { getPaddingMaterial } from './data/paddingMaterials';

const PIECES: readonly PieceKey[] = ['helm', 'torso', 'rightArm', 'leftArm', 'legs'] as const;

/**
 * Durability multipliers for each piece relative to torso (torso = 1.0)
 */
const DURABILITY_PIECE_MULTIPLIERS: PieceStats<number> = {
  helm: 0.8,
  torso: 1.0,
  rightArm: 0.6,
  leftArm: 0.6,
  legs: 1.0,
};



/**
 * Rounds a number to 2 decimal places
 */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calculates the density scaling factor for padding material usage.
 * At density 100 -> 1.0, at density 50 -> 0.667, at density 0 -> 0.333
 * Formula: 1/3 + 2/3 * (density / 100)
 */
function densityScalePaddingUsage(density: number): number {
  return 1 / 3 + (2 / 3) * (density / 100);
}

/**
 * Calculates the density scaling factor for base material usage.
 * At density 100 -> 1.0, at density 50 -> 0.75, at density 0 -> 0.5
 * Formula: 0.5 + 0.5 * (density / 100)
 */
function densityScaleBaseUsage(density: number): number {
  return 0.5 + 0.5 * (density / 100);
}

/**
 * Calculates the density scaling factor for weight.
 * Weight doesn't scale as aggressively as material usage.
 * At density 100 -> 1.0, at density 50 -> 0.81, at density 0 -> ~0.62
 * Formula: 0.62 + 0.38 * (density / 100)
 */
function densityScaleWeight(density: number): number {
  return 0.62 + 0.38 * (density / 100);
}



/**
 * Calculates base material usage for a piece
 * Formula: round(styleBaseUsage * materialUsageMult * densityScale)
 */
function calculateBaseUsage(styleBaseUsage: number, materialUsageMultiplier: number, baseDensity: number): number {
  return Math.round(styleBaseUsage * materialUsageMultiplier * densityScaleBaseUsage(baseDensity));
}

/**
 * Calculates padding material usage for a piece
 * Formula: round(basePadding * materialMult * densityScale)
 */
function calculatePaddingUsage(
  basePaddingUsage: number,
  materialMultiplier: number,
  paddingDensity: number
): number {
  return Math.round(basePaddingUsage * materialMultiplier * densityScalePaddingUsage(paddingDensity));
}

/**
 * Calculates weight for a piece.
 * Weight uses the style's base material values (at 100% density) but scales differently
 * than material usage. Weight decreases less aggressively at low densities.
 * 
 * Formula: (styleBaseUsage * baseMaterialUsageMult * baseWeight * baseWeightScale + 
 *           stylePaddingUsage * padMaterialMult * padWeight * padWeightScale) * pieceMultiplier
 */
function calculatePieceWeight(
  styleBaseUsage: number,
  baseMaterialUsageMultiplier: number,
  baseMaterialWeight: number,
  stylePaddingUsage: number,
  paddingMaterialMultiplier: number,
  paddingMaterialWeight: number,
  baseDensity: number,
  paddingDensity: number,
  pieceMultiplier: number
): number {
  const baseContrib = styleBaseUsage * baseMaterialUsageMultiplier * baseMaterialWeight * densityScaleWeight(baseDensity);
  const padContrib = stylePaddingUsage * paddingMaterialMultiplier * paddingMaterialWeight * densityScaleWeight(paddingDensity);
  return round2((baseContrib + padContrib) * pieceMultiplier);
}

/**
 * Calculates durability for a piece.
 * Formula: styleDuraBase * pieceMultiplier * baseMaterialDuraMult * paddingDurabilityMult * baseDensityFactor * paddingDensityFactor
 *
 * Note: durabilityBase is calibrated for Arthropod Carapace (for Risar Berserker).
 * Other base materials have a durability multiplier relative to this baseline.
 *
 * baseDensityFactor = 0.654 + 0.346 * (baseDensity / 100)
 * paddingDensityFactor = 0.793 + 0.207 * (paddingDensity / 100)
 */
function calculatePieceDurability(
  durabilityBase: number,
  pieceMultiplier: number,
  baseMaterialDurabilityMult: number,
  paddingDurabilityMult: number,
  baseDensity: number,
  paddingDensity: number
): number {
  const baseDensityFactor = 0.654 + 0.346 * (baseDensity / 100);
  const paddingDensityFactor = 0.793 + 0.207 * (paddingDensity / 100);
  const totalDura =
    durabilityBase * pieceMultiplier * baseMaterialDurabilityMult * paddingDurabilityMult * baseDensityFactor * paddingDensityFactor;
  return round2(totalDura);
}

/**
 * Calculates defense density scale for a given density and coefficients.
 * Formula: a + b * (density / 100)
 */
function defenseScale(density: number, coeffs: { a: number; b: number }): number {
  return coeffs.a + coeffs.b * (density / 100);
}

/**
 * Calculates defense for the armor set.
 * Formula per damage type:
 *   defense = (baseDefense + baseMaterialOffset) * baseScale(baseDensity) + paddingDefense * padScale(paddingDensity)
 *
 * Where baseScale and padScale use per-damage-type linear coefficients.
 * Each armor style has its own baseDefenseDensityCoeffs.
 * Padding contribution is floored at 0 (no negative defense).
 */
function calculateDefense(
  baseDefense: DefenseStats,
  baseMaterialDefenseOffset: DefenseStats,
  baseDensityCoeffs: DefenseDensityCoeffs,
  paddingDefense: DefenseStats,
  paddingDensityCoeffs: DefenseDensityCoeffs,
  baseDensity: number,
  paddingDensity: number
): DefenseStats {
  const types: (keyof DefenseStats)[] = ['blunt', 'pierce', 'slash'];
  const result: DefenseStats = { blunt: 0, pierce: 0, slash: 0 };

  for (const type of types) {
    const effectiveBaseDefense = baseDefense[type] + baseMaterialDefenseOffset[type];
    const baseContrib = effectiveBaseDefense * defenseScale(baseDensity, baseDensityCoeffs[type]);
    const padScale = defenseScale(paddingDensity, paddingDensityCoeffs[type]);
    // Padding can contribute negative values (e.g., Ironsilk reduces blunt defense)
    const padContrib = paddingDefense[type] * padScale;
    // Floor total defense at 0
    result[type] = round2(Math.max(0, baseContrib + padContrib));
  }

  return result;
}

/**
 * Main function to calculate armor set statistics
 */
export function calculateSetStatus<B extends BaseMaterial, S extends SupportMaterial>({
  armorStyle,
  base,
  padding,
  baseDensity = 100,
  paddingDensity = 100,
}: CalculateSetStatusInput<B, S>): SetStats {
  const styleConfig = armorStyles[armorStyle];
  const baseMaterialConfig = getBaseMaterial(base);
  const paddingMaterialConfig = getPaddingMaterial(padding);

  // Calculate piece-level material usage
  const pieceMaterialUsage: PieceStats<MaterialUsage> = {
    helm: { base: 0, padding: 0 },
    torso: { base: 0, padding: 0 },
    rightArm: { base: 0, padding: 0 },
    leftArm: { base: 0, padding: 0 },
    legs: { base: 0, padding: 0 },
  };

  const pieceWeight: PieceStats<number> = {
    helm: 0,
    torso: 0,
    rightArm: 0,
    leftArm: 0,
    legs: 0,
  };

  const pieceDurability: PieceStats<number> = {
    helm: 0,
    torso: 0,
    rightArm: 0,
    leftArm: 0,
    legs: 0,
  };

  for (const piece of PIECES) {
    // Material usage - now both base and padding scale with density
    const baseUsage = calculateBaseUsage(
      styleConfig.baseMaterialUsage[piece],
      baseMaterialConfig.usageMultiplier,
      baseDensity
    );
    const paddingUsage = calculatePaddingUsage(
      styleConfig.paddingUsage[piece],
      paddingMaterialConfig.materialMultiplier,
      paddingDensity
    );

    pieceMaterialUsage[piece] = {
      base: baseUsage,
      padding: paddingUsage,
    };

    // Weight calculation - uses style base values with weight density scaling
    pieceWeight[piece] = calculatePieceWeight(
      styleConfig.baseMaterialUsage[piece],
      baseMaterialConfig.usageMultiplier,
      baseMaterialConfig.weight,
      styleConfig.paddingUsage[piece],
      paddingMaterialConfig.materialMultiplier,
      paddingMaterialConfig.weight,
      baseDensity,
      paddingDensity,
      styleConfig.pieceWeightMultipliers[piece]
    );

    // Durability calculation - uses both density factors and material multipliers
    pieceDurability[piece] = calculatePieceDurability(
      styleConfig.durabilityBase,
      DURABILITY_PIECE_MULTIPLIERS[piece],
      baseMaterialConfig.durability,
      paddingMaterialConfig.durabilityMultiplier,
      baseDensity,
      paddingDensity
    );
  }

  // Calculate set totals
  const setMaterialUsage: MaterialUsage = {
    base: PIECES.reduce((sum, piece) => sum + pieceMaterialUsage[piece].base, 0),
    padding: PIECES.reduce((sum, piece) => sum + pieceMaterialUsage[piece].padding, 0),
  };

  const setWeight = round2(PIECES.reduce((sum, piece) => sum + pieceWeight[piece], 0));
  const setDura = round2(PIECES.reduce((sum, piece) => sum + pieceDurability[piece], 0));

  // Defense calculation - uses per-style base density coefficients and per-padding padding coefficients
  const setDefense = calculateDefense(
    styleConfig.baseDefense,
    baseMaterialConfig.defenseOffset,
    styleConfig.baseDefenseDensityCoeffs,
    paddingMaterialConfig.defense,
    paddingMaterialConfig.defenseDensityCoeffs,
    baseDensity,
    paddingDensity
  );

  return {
    armorStyle,
    base,
    padding,
    baseDensity,
    paddingDensity,
    setWeight,
    setDura,
    setMaterialUsage,
    setDefense,
    pieceWeight,
    pieceDurability,
    pieceMaterialUsage,
  };
}
