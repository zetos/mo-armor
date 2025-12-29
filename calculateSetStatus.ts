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
 * Rounds a number to 3 decimal places for higher precision calculations
 */
function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
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
 * Formula: a + b * (density / 100)
 * Each armor style has its own coefficients.
 */
function densityScaleBaseUsage(density: number, coeffs: { a: number; b: number }): number {
  return coeffs.a + coeffs.b * (density / 100);
}

/**
 * Calculates the density scaling factor for base material weight.
 * Each armor style has its own coefficients.
 * Formula: a + b * (density / 100)
 */
function densityScaleBaseWeight(density: number, coeffs: { a: number; b: number }): number {
  return coeffs.a + coeffs.b * (density / 100);
}

/**
 * Calculates the density scaling factor for padding weight.
 * Each padding material has its own coefficients.
 * Formula: a + b * (density / 100)
 */
function densityScalePadWeight(density: number, coeffs: { a: number; b: number }): number {
  return coeffs.a + coeffs.b * (density / 100);
}



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
  return Math.round(styleBaseUsage * materialUsageMultiplier * densityScaleBaseUsage(baseDensity, densityCoeffs));
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
  const baseContrib = baseUsage * baseMaterialWeight * baseMaterialWeightMultiplier * densityScaleBaseWeight(baseDensity, baseWeightDensityCoeffs);
  const padContrib = paddingUsage * paddingMaterialWeight * densityScalePadWeight(paddingDensity, paddingWeightDensityCoeffs);
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

  for (const piece of PIECES) {
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
