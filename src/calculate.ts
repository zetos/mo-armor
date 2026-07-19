import type {
  ArmorStyle,
  BaseMaterial,
  CalculateSetStatusInput,
  DefenseDensityCoeffs,
  DefenseStats,
  DurabilityCoeffs,
  DurabilityMults,
  MaterialUsage,
  PieceStats,
  SetStats,
  SupportMaterial,
} from './types';
import { mapPieceStats, PIECE_KEYS } from './types';
import {
  getArmorMaterialByName,
  getArmorStyleByName,
  isCoreCompatible,
} from './catalog/armor';
import { getArmorStyle } from './data/armorStyles';
import { getBaseMaterial } from './data/baseMaterials';
import { getPaddingMaterial } from './data/paddingMaterials';
import {
  generatedArmorStyles,
  generatedBaseMaterials,
  generatedPaddingMaterials,
  generatedStyleCoreSupport,
  generatedStylePaddingSupport,
} from './data/generatedCampaign';

const DURABILITY_PIECE_MULTIPLIERS: PieceStats<number> = {
  helm: 0.8,
  torso: 1,
  rightArm: 0.6,
  leftArm: 0.6,
  legs: 1,
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function linearScale(
  density: number,
  { a, b }: { a: number; b: number },
): number {
  return a + b * (density / 100);
}

function calculatePieceDurability(
  durability: DurabilityCoeffs,
  pieceMultiplier: number,
  padding: DurabilityMults,
  baseDensity: number,
  paddingDensity: number,
): number {
  return round2(
    (durability.baseMin * padding.minMult +
      durability.baseDensityContrib * (baseDensity / 100) +
      durability.padContrib * padding.padMult * (paddingDensity / 100)) *
      pieceMultiplier,
  );
}

function calculateDefense(
  materialDefense: DefenseStats,
  materialDensity: DefenseDensityCoeffs,
  paddingDefense: DefenseStats,
  paddingDensityCoeffs: DefenseDensityCoeffs,
  baseDensity: number,
  paddingDensity: number,
): DefenseStats {
  const calculate = (type: keyof DefenseStats) =>
    round2(
      Math.max(
        0,
        materialDefense[type] * linearScale(baseDensity, materialDensity[type]) +
          paddingDefense[type] *
            linearScale(paddingDensity, paddingDensityCoeffs[type]),
      ),
    );

  return {
    blunt: calculate('blunt'),
    pierce: calculate('pierce'),
    slash: calculate('slash'),
  };
}

export function calculateSetStatus<
  B extends BaseMaterial,
  S extends SupportMaterial,
>({
  armorStyle,
  base,
  padding,
  baseDensity = 100,
  paddingDensity = 100,
}: CalculateSetStatusInput<B, S>): SetStats {
  const catalogStyle = getArmorStyleByName(armorStyle);
  const catalogBase = getArmorMaterialByName(base);
  const catalogPadding = getArmorMaterialByName(padding);
  if (!catalogStyle) throw new Error(`Unknown armor style "${armorStyle}".`);
  if (!catalogBase) throw new Error(`Unknown base material "${base}".`);
  if (!catalogPadding?.padding) {
    throw new Error(`Unknown padding material "${padding}".`);
  }
  if (!isCoreCompatible(catalogStyle, catalogBase)) {
    throw new Error(
      `Base material "${base}" is not compatible with armor style "${armorStyle}".`,
    );
  }
  const supportKey = `${armorStyle}\u0000`;
  if (
    (armorStyle in generatedArmorStyles || base in generatedBaseMaterials) &&
    !generatedStyleCoreSupport.has(`${supportKey}${base}`)
  ) {
    throw new Error(
      `Base material "${base}" is catalog-compatible with armor style "${armorStyle}" but this pairing is not calibrated.`,
    );
  }
  if (
    (armorStyle in generatedArmorStyles || padding in generatedPaddingMaterials) &&
    !generatedStylePaddingSupport.has(`${supportKey}${padding}`)
  ) {
    throw new Error(
      `Padding material "${padding}" is catalog-compatible with armor style "${armorStyle}" but this pairing is not calibrated.`,
    );
  }
  const style = getArmorStyle(armorStyle);
  const baseMaterial = getBaseMaterial(base);
  const paddingMaterial = getPaddingMaterial(armorStyle, padding);

  const durability = baseMaterial.durabilityConfig?.[armorStyle] ?? {
    baseMin: style.durabilityCoeffs.baseMin * baseMaterial.durability,
    baseDensityContrib:
      style.durabilityCoeffs.baseDensityContrib * baseMaterial.durability,
    padContrib: style.durabilityCoeffs.padContrib,
  };
  const usageConfig = baseMaterial.usageMultiplierConfig?.[armorStyle];
  const pieceUsageConfig =
    baseMaterial.pieceUsageMultiplierConfig?.[armorStyle];
  const usageMultiplier = usageConfig
    ? linearScale(baseDensity, usageConfig)
    : baseMaterial.usageMultiplier;

  const pieceMaterialUsage = mapPieceStats((piece) => ({
    base: Math.round(
      style.baseMaterialUsage[piece] *
        (pieceUsageConfig
          ? linearScale(baseDensity, pieceUsageConfig[piece])
          : usageMultiplier) *
        linearScale(baseDensity, style.baseMaterialUsageDensityCoeffs),
    ),
    padding: Math.round(
      style.paddingUsage[piece] *
        (paddingMaterial.pieceMaterialMultiplierConfig
          ? linearScale(
              paddingDensity,
              paddingMaterial.pieceMaterialMultiplierConfig[piece],
            )
          : paddingMaterial.materialMultiplier *
            linearScale(paddingDensity, style.paddingUsageDensityCoeffs)),
    ),
  }));
  const pieceDurability = mapPieceStats((piece) =>
    calculatePieceDurability(
      durability,
      DURABILITY_PIECE_MULTIPLIERS[piece],
      paddingMaterial.durabilityMults,
      baseDensity,
      paddingDensity,
    ),
  );
  const setMaterialUsage = PIECE_KEYS.reduce<MaterialUsage>(
    (total, piece) => ({
      base: total.base + pieceMaterialUsage[piece].base,
      padding: total.padding + pieceMaterialUsage[piece].padding,
    }),
    { base: 0, padding: 0 },
  );

  const styleWeight = style.weightConfig;
  const baseWeight = baseMaterial.additiveWeightConfig;
  const paddingWeight = paddingMaterial.additiveWeightConfig;
  const setWeight = round2(
    styleWeight.baseMinWeight +
      paddingWeight.minWeightOffset +
      baseWeight.minWeightOffset +
      styleWeight.baseContrib *
        baseWeight.baseContribMult *
        (baseDensity / 100) +
      paddingWeight.padContrib *
        style.paddingWeightMultiplier *
        (paddingDensity / 100),
  );

  const pieceCoeffs = style.pieceWeightCoeffs;
  const ironfurMinimum = PIECE_KEYS.reduce(
    (sum, piece) => sum + pieceCoeffs[piece].minWeight,
    0,
  );
  const paddingOffset = 0.5 - paddingWeight.minWeightOffset;
  const pieceWeight = mapPieceStats((piece) => {
    const coefficient = pieceCoeffs[piece];
    const ratio = coefficient.minWeight / ironfurMinimum;
    const pieceBaseMultiplier = baseWeight.pieceBaseContribMult;
    const resolvedPieceBaseMultiplier =
      typeof pieceBaseMultiplier === 'number'
        ? pieceBaseMultiplier
        : pieceBaseMultiplier?.[piece] ?? baseWeight.baseContribMult;
    return round2(
      coefficient.minWeight -
        paddingOffset * ratio +
        baseWeight.minWeightOffset * ratio +
        coefficient.baseContrib *
          resolvedPieceBaseMultiplier *
          (baseDensity / 100) +
        coefficient.padContrib *
          paddingWeight.padContribRatio *
          (paddingDensity / 100),
    );
  });

  const defense = baseMaterial.defenseConfig[armorStyle] ?? {
    baseDefense: style.baseDefense,
    densityCoeffs: style.baseDefenseDensityCoeffs,
  };

  return {
    armorStyle,
    base,
    padding,
    baseDensity,
    paddingDensity,
    setWeight,
    setDura: round2(
      PIECE_KEYS.reduce(
        (sum, piece) => sum + pieceDurability[piece],
        0,
      ),
    ),
    setMaterialUsage,
    setDefense: calculateDefense(
      defense.baseDefense,
      defense.densityCoeffs,
      mapDefenseStats(
        paddingMaterial.defense,
        style.paddingDefenseMultiplier,
      ),
      paddingMaterial.defenseDensityCoeffs,
      baseDensity,
      paddingDensity,
    ),
    pieceWeight,
    pieceDurability,
    pieceMaterialUsage,
  };
}

function mapDefenseStats(
  defense: DefenseStats,
  multiplier: number,
): DefenseStats {
  return {
    blunt: defense.blunt * multiplier,
    pierce: defense.pierce * multiplier,
    slash: defense.slash * multiplier,
  };
}
