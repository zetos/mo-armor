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
  DefenseDensityCoeffs,
} from './types';
import { PIECE_KEYS } from './types';
import { armorStyles } from './data/armorStyles';
import { getBaseMaterial } from './data/baseMaterials';
import { getPaddingMaterial } from './data/paddingMaterials';

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
 * Calculates linear density scaling.
 * Formula: a + b * (density / 100)
 * 
 * Common use cases:
 * - At density 100: a + b = 1.0 (full scale)
 * - At density 0: scale = a (intercept)
 * 
 * @param density - Density value (0-100)
 * @param coeffs - Linear coefficients {a, b}
 * @returns Scaled value
 */
function linearScale(density: number, coeffs: { a: number; b: number }): number {
  return coeffs.a + coeffs.b * (density / 100);
}

/**
 * Padding usage density scale coefficients.
 * At density 100 -> 1.0, at density 50 -> 0.667, at density 0 -> 0.333
 */
const PADDING_USAGE_DENSITY_COEFFS = { a: 1 / 3, b: 2 / 3 };



/**
 * Calculates base material usage for a piece
 * Formula: round(styleBaseUsage * materialUsageMult * densityScale)
 */
function calculateBaseUsage(
  styleBaseUsage: number,
  materialUsageMultiplier: number,
  baseDensity: number,
  densityCoeffs: { a: number; b: number }
): number {
  return Math.round(styleBaseUsage * materialUsageMultiplier * linearScale(baseDensity, densityCoeffs));
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
  return Math.round(basePaddingUsage * materialMultiplier * linearScale(paddingDensity, PADDING_USAGE_DENSITY_COEFFS));
}

/**
 * Calculates weight for a piece.
 * Formula: (baseUsage * baseMaterialWeight * baseMaterialWeightMultiplier * densityScaleBaseWeight(baseDensity, baseWeightDensityCoeffs) +
 *           paddingUsage * paddingMaterialWeight * densityScalePadWeight(paddingDensity, paddingWeightDensityCoeffs)) * pieceMultiplier
 */
function calculatePieceWeight(
  baseUsage: number,
  paddingUsage: number,
  baseMaterialWeight: number,
  baseMaterialWeightMultiplier: number,
  paddingMaterialWeight: number,
  baseWeightDensityCoeffs: { a: number; b: number },
  paddingWeightDensityCoeffs: { a: number; b: number },
  baseDensity: number,
  paddingDensity: number,
  pieceMultiplier: number
): number {
  const baseContrib = baseUsage * baseMaterialWeight * baseMaterialWeightMultiplier * linearScale(baseDensity, baseWeightDensityCoeffs);
  const padContrib = paddingUsage * paddingMaterialWeight * linearScale(paddingDensity, paddingWeightDensityCoeffs);
  return (baseContrib + padContrib) * pieceMultiplier;
}

/**
 * Calculates durability for a piece using the additive model.
 * Formula: ((baseMin * padMinMult) + (baseDensityContrib * bd/100) + (padContrib * padPadMult * pd/100)) * pieceMultiplier * baseMaterialDuraMult
 *
 * Note: baseMaterialDuraMult is relative to Plate Scales (which has mult=1.0).
 * Other base materials like Arthropod Carapace have higher durability.
 */
function calculatePieceDurability(
  durabilityCoeffs: { baseMin: number; baseDensityContrib: number; padContrib: number },
  pieceMultiplier: number,
  baseMaterialDurabilityMult: number,
  paddingDurabilityMults: { minMult: number; padMult: number },
  baseDensity: number,
  paddingDensity: number
): number {
  const torsoDura =
    durabilityCoeffs.baseMin * paddingDurabilityMults.minMult +
    durabilityCoeffs.baseDensityContrib * (baseDensity / 100) +
    durabilityCoeffs.padContrib * paddingDurabilityMults.padMult * (paddingDensity / 100);
  const totalDura = torsoDura * pieceMultiplier * baseMaterialDurabilityMult;
  return round2(totalDura);
}

/**
 * Calculates defense for the armor set.
 * Formula per damage type:
 *   defense = materialBaseDefense * materialDensityScale(baseDensity) + paddingDefense * padScale(paddingDensity)
 *
 * Where materialDensityScale uses material-specific (or style-specific) linear coefficients.
 * Each material can have its own base defense and density scaling per armor style.
 * Padding contribution is floored at 0 (no negative defense).
 */
function calculateDefense(
   materialBaseDefense: DefenseStats,
   materialDensityCoeffs: DefenseDensityCoeffs,
   paddingDefense: DefenseStats,
   paddingDensityCoeffs: DefenseDensityCoeffs,
   baseDensity: number,
   paddingDensity: number
): DefenseStats {
  const types: (keyof DefenseStats)[] = ['blunt', 'pierce', 'slash'];
  const result: DefenseStats = { blunt: 0, pierce: 0, slash: 0 };

   for (const type of types) {
     const baseContrib = materialBaseDefense[type] * linearScale(baseDensity, materialDensityCoeffs[type]);
     const padScale = linearScale(paddingDensity, paddingDensityCoeffs[type]);
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
  const baseMaterialConfig = getBaseMaterial(base, armorStyle);
  const paddingMaterialConfig = getPaddingMaterial(armorStyle, padding);

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

  for (const piece of PIECE_KEYS) {
    // Material usage - now both base and padding scale with density
    const baseUsage = calculateBaseUsage(
      styleConfig.baseMaterialUsage[piece],
      baseMaterialConfig.usageMultiplier,
      baseDensity,
      styleConfig.baseMaterialUsageDensityCoeffs
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

     // Weight calculation - uses calculated usage with original weight scales
     pieceWeight[piece] = round2(calculatePieceWeight(
       baseUsage,
       paddingUsage,
       baseMaterialConfig.weight,
       baseMaterialConfig.weightMultiplier,
       paddingMaterialConfig.weight,
       styleConfig.baseWeightDensityCoeffs,
       paddingMaterialConfig.weightDensityCoeffs,
       baseDensity,
       paddingDensity,
       styleConfig.pieceWeightMultipliers[piece]
     ));

     // Durability calculation - uses additive model with density and material multipliers
     pieceDurability[piece] = calculatePieceDurability(
       styleConfig.durabilityCoeffs,
       DURABILITY_PIECE_MULTIPLIERS[piece],
       baseMaterialConfig.durability,
       paddingMaterialConfig.durabilityMults,
       baseDensity,
       paddingDensity
     );
  }

  // Calculate set totals
  const setMaterialUsage: MaterialUsage = {
    base: PIECE_KEYS.reduce((sum, piece) => sum + pieceMaterialUsage[piece].base, 0),
    padding: PIECE_KEYS.reduce((sum, piece) => sum + pieceMaterialUsage[piece].padding, 0),
  };

  const setWeight = round2(PIECE_KEYS.reduce((sum, piece) => sum + pieceWeight[piece], 0));
  const setDura = round2(PIECE_KEYS.reduce((sum, piece) => sum + pieceDurability[piece], 0));

   // Defense calculation - uses material-specific or style base defense and density coefficients
   // If material has style-specific config, use it; otherwise use style's base values
   const materialDefenseConfig = baseMaterialConfig.resolvedDefenseConfig ?? {
     baseDefense: styleConfig.baseDefense,
     densityCoeffs: styleConfig.baseDefenseDensityCoeffs,
   };
   
   const setDefense = calculateDefense(
     materialDefenseConfig.baseDefense,
     materialDefenseConfig.densityCoeffs,
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
