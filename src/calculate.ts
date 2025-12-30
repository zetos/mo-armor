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
import { getPaddingMaterial, getSharedPaddingConfig } from './data/paddingMaterials';

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
  
  // Use style-specific durability coefficients if available, otherwise use style's base coefficients with material multiplier
  const durabilityCoeffs = baseMaterialConfig.resolvedDurabilityConfig ?? {
    baseMin: styleConfig.durabilityCoeffs.baseMin * baseMaterialConfig.durability,
    baseDensityContrib: styleConfig.durabilityCoeffs.baseDensityContrib * baseMaterialConfig.durability,
    padContrib: styleConfig.durabilityCoeffs.padContrib,
  };
  
  // Calculate effective usage multiplier with density scaling if configured
  const usageMultiplier = baseMaterialConfig.resolvedUsageMultiplierConfig 
    ? baseMaterialConfig.resolvedUsageMultiplierConfig.a + baseMaterialConfig.resolvedUsageMultiplierConfig.b * (baseDensity / 100)
    : baseMaterialConfig.usageMultiplier;

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
      usageMultiplier,
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

     // Weight calculation - OLD: deprecated, kept as fallback
     // Use material-specific weight density coefficients if configured, otherwise use style's base coefficients
     const effectiveBaseWeightCoeffs = baseMaterialConfig.resolvedWeightConfig?.densityCoeffs 
       ?? styleConfig.baseWeightDensityCoeffs;
     
      const oldWeightCalc = calculatePieceWeight(
        baseUsage,
        paddingUsage,
        baseMaterialConfig.weight,
        baseMaterialConfig.weightMultiplier,
        paddingMaterialConfig.weight,
        effectiveBaseWeightCoeffs,
        paddingMaterialConfig.weightDensityCoeffs,
        baseDensity,
        paddingDensity,
        styleConfig.pieceWeightMultipliers[piece]
      );
      
      // Store the unrounded old calculation for now.
      // We'll round after any proportional scaling to avoid compounding rounding error.
      pieceWeight[piece] = oldWeightCalc;

     // Durability calculation - uses additive model with density and material coefficients
     pieceDurability[piece] = calculatePieceDurability(
       durabilityCoeffs,
       DURABILITY_PIECE_MULTIPLIERS[piece],
       1.0, // Material multiplier already baked into durabilityCoeffs
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

  // Calculate set weight using additive model
  // Formula: setWeight = minWeight + baseContrib*(bd/100) + padContrib*(pd/100)
  // Where: minWeight = styleBaseMinWeight + paddingOffset + baseMaterialOffset
  //        baseContrib = styleBaseContrib * baseMaterialMult
  const styleWeightConfig = styleConfig.weightConfig;
  const baseWeightConfig = baseMaterialConfig.additiveWeightConfig;
  const paddingWeightConfig = getSharedPaddingConfig(padding)?.additiveWeightConfig;

  let setWeight: number;

  if (styleWeightConfig && baseWeightConfig && paddingWeightConfig) {
    // Use new additive model for set weight
    const minWeight = styleWeightConfig.baseMinWeight 
      + paddingWeightConfig.minWeightOffset 
      + baseWeightConfig.minWeightOffset;
    const baseContrib = styleWeightConfig.baseContrib * baseWeightConfig.baseContribMult;
    const padContrib = paddingWeightConfig.padContrib;

    const targetWeight = minWeight + baseContrib * (baseDensity / 100) + padContrib * (paddingDensity / 100);
    setWeight = round2(targetWeight);

    // Use per-piece additive model for piece weights
    // Formula: pieceWeight = pieceMin + pieceBase*(bd/100) + piecePad*padRatio*(pd/100)
    // Where pieceMin accounts for padding's minWeightOffset
    const pieceCoeffs = styleConfig.pieceWeightCoeffs;
    const padContribRatio = paddingWeightConfig.padContribRatio;
    const minWeightOffset = paddingWeightConfig.minWeightOffset;
    
    // Calculate the per-piece minWeight adjustment.
    // The minWeightOffset (e.g., Ironfur=0.5, Ironsilk=0.0) is distributed proportionally
    // across pieces based on each piece's share of the total Ironfur weight at 0/0.
    // Since pieceCoeffs.minWeight IS the Ironfur 0/0 weight, we use those directly.
    const ironfurTotalAt0_0 = PIECE_KEYS.reduce((sum, p) => sum + pieceCoeffs[p].minWeight, 0);
    
    // The set minWeightOffset is 0.5 for Ironfur (relative to Ironsilk baseline).
    // So Ironsilk has offset 0.0, and Ironfur adds 0.5 to the total.
    // We need to SUBTRACT the difference: (0.5 - minWeightOffset) distributed proportionally.
    // For Ironfur: 0.5 - 0.5 = 0 (no adjustment needed)
    // For Ironsilk: 0.5 - 0.0 = 0.5 (subtract 0.5 total, proportionally)
    const totalOffsetAdjustment = 0.5 - minWeightOffset;
    
    for (const piece of PIECE_KEYS) {
      const pc = pieceCoeffs[piece];
      // Each piece's share of the offset adjustment
      const pieceRatio = pc.minWeight / ironfurTotalAt0_0;
      const pieceOffsetAdjustment = totalOffsetAdjustment * pieceRatio;
      
      // Per-piece additive formula
      // Subtract the adjustment because pieceCoeffs are calibrated for Ironfur
      const rawWeight = (pc.minWeight - pieceOffsetAdjustment) 
        + pc.baseContrib * (baseDensity / 100) 
        + pc.padContrib * padContribRatio * (paddingDensity / 100);
      pieceWeight[piece] = round2(rawWeight);
    }
  } else {
    // Fallback to old calculation (should not happen with properly configured materials)
    const oldSum = PIECE_KEYS.reduce((sum, piece) => sum + pieceWeight[piece], 0);
    setWeight = round2(oldSum);
    for (const piece of PIECE_KEYS) {
      pieceWeight[piece] = round2(pieceWeight[piece]);
    }
  }
  
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
