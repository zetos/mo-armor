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
import { armorStyles } from './data/armorStyles';
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
 * Calculates the density scaling factor for material usage
 * At density 100 -> 1.0, at density 50 -> 0.667, at density 0 -> 0.333
 * Formula: 1/3 + 2/3 * (density / 100)
 */
function densityScaleMaterial(density: number): number {
  return 1 / 3 + (2 / 3) * (density / 100);
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
  return Math.round(basePaddingUsage * materialMultiplier * densityScaleMaterial(paddingDensity));
}

/**
 * Calculates weight for a piece
 * Formula: (baseUsage * baseMaterialWeight + paddingUsage * paddingMaterialWeight) * pieceMultiplier
 */
function calculatePieceWeight(
  baseMatUsage: number,
  baseMaterialWeight: number,
  paddingUsage: number,
  paddingMaterialWeight: number,
  pieceMultiplier: number
): number {
  const rawWeight = baseMatUsage * baseMaterialWeight + paddingUsage * paddingMaterialWeight;
  return round2(rawWeight * pieceMultiplier);
}

/**
 * Calculates durability for a piece
 * Formula: styleDuraBase * pieceMultiplier * paddingDurabilityMult * densityFactor
 * where densityFactor = 0.834 + 0.166 * paddingDensity/100
 */
function calculatePieceDurability(
  durabilityBase: number,
  pieceMultiplier: number,
  paddingDurabilityMult: number,
  paddingDensity: number
): number {
  const densityFactor = 0.834 + 0.166 * (paddingDensity / 100);
  const totalDura = durabilityBase * pieceMultiplier * paddingDurabilityMult * densityFactor;
  return round2(totalDura);
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
    // Material usage (base doesn't change with density, padding does)
    const baseUsage = styleConfig.baseMaterialUsage[piece];
    const paddingUsage = calculatePaddingUsage(
      styleConfig.paddingUsage[piece],
      paddingMaterialConfig.materialMultiplier,
      paddingDensity
    );

    pieceMaterialUsage[piece] = {
      base: baseUsage,
      padding: paddingUsage,
    };

    // Weight calculation
    pieceWeight[piece] = calculatePieceWeight(
      baseUsage,
      baseMaterialConfig.weight,
      paddingUsage,
      paddingMaterialConfig.weight,
      styleConfig.pieceWeightMultipliers[piece]
    );

    // Durability calculation
    pieceDurability[piece] = calculatePieceDurability(
      styleConfig.durabilityBase,
      DURABILITY_PIECE_MULTIPLIERS[piece],
      paddingMaterialConfig.durabilityMultiplier,
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

  // Defense calculation
  // Defense is based on style's base defense + padding defense
  // Note: At 100% density, padding contributes full defense value
  const densityScale = paddingDensity / 100;
  const setDefense: DefenseStats = {
    blunt: round2(styleConfig.baseDefense.blunt + paddingMaterialConfig.defense.blunt * densityScale),
    pierce: round2(styleConfig.baseDefense.pierce + paddingMaterialConfig.defense.pierce * densityScale),
    slash: round2(styleConfig.baseDefense.slash + paddingMaterialConfig.defense.slash * densityScale),
  };

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
