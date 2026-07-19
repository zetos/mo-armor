import { resolve } from 'node:path';
import { ARMOR_CAMPAIGN, type CampaignBatch } from './armorCampaign';
import type { PersistedCampaignBatch } from './fetchArmorCampaign';
import { armorStyles } from '../src/data/armorStyles';
import { getBaseMaterial } from '../src/data/baseMaterials';
import { getPaddingMaterial } from '../src/data/paddingMaterials';
import {
  mapPieceStats,
  PIECE_KEYS,
  type ArmorStyle,
  type ArmorStyleConfig,
  type BaseMaterial,
  type BaseMaterialConfig,
  type DefenseStats,
  type PaddingMaterialConfig,
  type PieceKey,
  type SetStats,
  type SupportMaterial,
} from '../src/types';

type ActiveArmorStyleConfig = Omit<
  ArmorStyleConfig,
  'pieceWeightMultipliers' | 'baseWeightDensityCoeffs'
>;
type ActiveBaseMaterialConfig = Omit<BaseMaterialConfig, 'weight'>;
type GeneratedPaddingConfig = PaddingMaterialConfig & {
  styleMinMult: Partial<Record<ArmorStyle, number>>;
  additiveWeightConfig: {
    minWeightOffset: number;
    padContrib: number;
    padContribRatio: number;
  };
};

const INPUT_DIRECTORY = resolve(import.meta.dir, '../samples/fetched');
const CONFIG_OUTPUT = resolve(import.meta.dir, '../src/data/generatedCampaign.ts');
const SAMPLE_OUTPUT = resolve(import.meta.dir, '../samples/generatedCampaign.ts');

const round = (value: number, digits = 4): number =>
  Math.round(value * 10 ** digits) / 10 ** digits;

function sumPieces(values: Record<PieceKey, number>): number {
  return PIECE_KEYS.reduce((total, piece) => total + values[piece], 0);
}

function fitScalar(
  initial: number,
  predictErrors: (candidate: number) => readonly number[],
  radius = 0.03,
): number {
  let best = initial;
  let bestMax = Number.POSITIVE_INFINITY;
  let bestTotal = Number.POSITIVE_INFINITY;
  const start = Math.max(0, initial - radius);
  const end = initial + radius;
  for (let candidate = start; candidate <= end; candidate += 0.0001) {
    const roundedCandidate = round(candidate, 4);
    const errors = predictErrors(roundedCandidate);
    const max = Math.max(...errors);
    const total = errors.reduce((sum, error) => sum + error, 0);
    if (max < bestMax || (max === bestMax && total < bestTotal)) {
      best = roundedCandidate;
      bestMax = max;
      bestTotal = total;
    }
  }
  return best;
}

function fitUsageCoefficients(
  style: ActiveArmorStyleConfig,
  zero: SetStats,
  full: SetStats,
  midpoint: SetStats,
): { a: number; b: number; full: number } {
  const initialA =
    zero.setMaterialUsage.base /
    (sumPieces(style.baseMaterialUsage) *
      style.baseMaterialUsageDensityCoeffs.a);
  const initialFull =
    full.setMaterialUsage.base / sumPieces(style.baseMaterialUsage);
  let bestA = initialA;
  let bestFull = initialFull;
  let bestMax = Number.POSITIVE_INFINITY;
  let bestTotal = Number.POSITIVE_INFINITY;

  for (let a = Math.max(0, initialA - 0.02); a <= initialA + 0.02; a += 0.0001) {
    const roundedA = round(a, 4);
    for (
      let fullScale = Math.max(0, initialFull - 0.02);
      fullScale <= initialFull + 0.02;
      fullScale += 0.0001
    ) {
      const roundedFull = round(fullScale, 4);
      const b = roundedFull - roundedA;
      const errors = [zero, full, midpoint].flatMap((sample) => {
        const density = sample.baseDensity / 100;
        const materialScale = roundedA + b * density;
        const styleScale =
          style.baseMaterialUsageDensityCoeffs.a +
          style.baseMaterialUsageDensityCoeffs.b * density;
        return PIECE_KEYS.map((piece) =>
          Math.abs(
            Math.round(
              style.baseMaterialUsage[piece] * materialScale * styleScale,
            ) - sample.pieceMaterialUsage[piece].base,
          ),
        );
      });
      const max = Math.max(...errors);
      const total = errors.reduce((sum, error) => sum + error, 0);
      if (max < bestMax || (max === bestMax && total < bestTotal)) {
        bestA = roundedA;
        bestFull = roundedFull;
        bestMax = max;
        bestTotal = total;
      }
    }
  }
  return {
    a: bestA,
    b: round(bestFull - bestA, 4),
    full: bestFull,
  };
}

function fitPieceUsageCoefficients(
  style: ActiveArmorStyleConfig,
  piece: PieceKey,
  zero: SetStats,
  full: SetStats,
  midpoint: SetStats,
): { a: number; b: number } {
  const styleUsage = style.baseMaterialUsage[piece];
  const styleA = style.baseMaterialUsageDensityCoeffs.a;
  const initialA = zero.pieceMaterialUsage[piece].base / (styleUsage * styleA);
  const initialFull = full.pieceMaterialUsage[piece].base / styleUsage;
  let bestA = initialA;
  let bestFull = initialFull;
  let bestMax = Number.POSITIVE_INFINITY;
  let bestTotal = Number.POSITIVE_INFINITY;

  // Probe values throughout each endpoint's integer-rounding interval. This
  // preserves endpoints while selecting the value that also explains 50%.
  for (let zeroOffset = -0.49; zeroOffset <= 0.49; zeroOffset += 0.049) {
    const a = round(
      (zero.pieceMaterialUsage[piece].base + zeroOffset) /
        (styleUsage * styleA),
      6,
    );
    for (let fullOffset = -0.49; fullOffset <= 0.49; fullOffset += 0.049) {
      const fullScale = round(
        (full.pieceMaterialUsage[piece].base + fullOffset) / styleUsage,
        6,
      );
      const b = fullScale - a;
      const errors = [zero, full, midpoint].map((sample) => {
        const density = sample.baseDensity / 100;
        const styleScale =
          styleA + style.baseMaterialUsageDensityCoeffs.b * density;
        return Math.abs(
          Math.round(styleUsage * (a + b * density) * styleScale) -
            sample.pieceMaterialUsage[piece].base,
        );
      });
      const max = Math.max(...errors);
      const total = errors.reduce((sum, error) => sum + error, 0);
      if (max < bestMax || (max === bestMax && total < bestTotal)) {
        bestA = a;
        bestFull = fullScale;
        bestMax = max;
        bestTotal = total;
      }
    }
  }

  return { a: bestA, b: round(bestFull - bestA, 6) };
}

function fitPaddingPieceUsageCoefficients(
  style: ActiveArmorStyleConfig,
  piece: PieceKey,
  zero: SetStats,
  full: SetStats,
  midpoint: SetStats,
): { a: number; b: number } {
  const styleUsage = style.paddingUsage[piece];
  let bestA = zero.pieceMaterialUsage[piece].padding / styleUsage;
  let bestFull = full.pieceMaterialUsage[piece].padding / styleUsage;
  let bestMax = Number.POSITIVE_INFINITY;
  let bestTotal = Number.POSITIVE_INFINITY;

  for (let zeroOffset = -0.49; zeroOffset <= 0.49; zeroOffset += 0.049) {
    const a = round(
      (zero.pieceMaterialUsage[piece].padding + zeroOffset) / styleUsage,
      6,
    );
    for (let fullOffset = -0.49; fullOffset <= 0.49; fullOffset += 0.049) {
      const fullScale = round(
        (full.pieceMaterialUsage[piece].padding + fullOffset) / styleUsage,
        6,
      );
      const b = fullScale - a;
      const errors = [zero, full, midpoint].map((sample) => {
        const density = sample.paddingDensity / 100;
        return Math.abs(
          Math.round(styleUsage * (a + b * density)) -
            sample.pieceMaterialUsage[piece].padding,
        );
      });
      const max = Math.max(...errors);
      const total = errors.reduce((sum, error) => sum + error, 0);
      if (max < bestMax || (max === bestMax && total < bestTotal)) {
        bestA = a;
        bestFull = fullScale;
        bestMax = max;
        bestTotal = total;
      }
    }
  }

  return { a: bestA, b: round(bestFull - bestA, 6) };
}

function sampleAt(
  persisted: PersistedCampaignBatch,
  baseDensity: number,
  paddingDensity: number,
): SetStats {
  const result = persisted.batch.results.find(
    ({ sample }) =>
      sample.baseDensity === baseDensity &&
      sample.paddingDensity === paddingDensity,
  );
  if (!result) {
    throw new Error(
      `${persisted.subject.slug}: missing ${baseDensity}/${paddingDensity}`,
    );
  }
  return result.sample;
}

function normalizedDefense(
  zero: DefenseStats,
  full: DefenseStats,
  paddingAtZero: DefenseStats,
) {
  const derive = (type: keyof DefenseStats) => {
    const baseDefense = round(full[type] - paddingAtZero[type], 4);
    const a = round((zero[type] - paddingAtZero[type]) / baseDefense, 4);
    return { baseDefense, density: { a, b: round(1 - a, 4) } };
  };
  const blunt = derive('blunt');
  const pierce = derive('pierce');
  const slash = derive('slash');
  return {
    baseDefense: {
      blunt: blunt.baseDefense,
      pierce: pierce.baseDefense,
      slash: slash.baseDefense,
    },
    densityCoeffs: {
      blunt: blunt.density,
      pierce: pierce.density,
      slash: slash.density,
    },
  };
}

function deriveStyle(persisted: PersistedCampaignBatch): ActiveArmorStyleConfig {
  const zero = sampleAt(persisted, 0, 0);
  const baseFull = sampleAt(persisted, 100, 0);
  const paddingFull = sampleAt(persisted, 0, 100);
  const baseMaterial = getBaseMaterial(zero.base);
  const paddingMaterial = getPaddingMaterial(zero.armorStyle, zero.padding);
  const usageMultiplier = baseMaterial.usageMultiplier;

  const baseMaterialUsage = mapPieceStats((piece) =>
    Math.round(baseFull.pieceMaterialUsage[piece].base / usageMultiplier),
  );
  const baseUsageZero = sumPieces(
    mapPieceStats((piece) => zero.pieceMaterialUsage[piece].base),
  );
  const baseUsageDenominator = PIECE_KEYS.reduce(
    (total, piece) =>
      total + baseMaterialUsage[piece] * usageMultiplier,
    0,
  );
  const usageA = round(baseUsageZero / baseUsageDenominator, 4);

  const paddingUsage = mapPieceStats(
    (piece) => paddingFull.pieceMaterialUsage[piece].padding,
  );
  const paddingUsageA = round(
    sumPieces(
      mapPieceStats((piece) => zero.pieceMaterialUsage[piece].padding),
    ) / sumPieces(paddingUsage),
    4,
  );
  const baseDurabilityMultiplier = baseMaterial.durability;
  const durabilityCoeffs = {
    baseMin: round(zero.pieceDurability.torso / baseDurabilityMultiplier, 6),
    baseDensityContrib: round(
      (baseFull.pieceDurability.torso - zero.pieceDurability.torso) /
        baseDurabilityMultiplier,
      6,
    ),
    padContrib: round(
      (paddingFull.pieceDurability.torso - zero.pieceDurability.torso) /
        paddingMaterial.durabilityMults.padMult,
      6,
    ),
  };

  const paddingAtZero = mapDefense(() => 0);
  const defense = normalizedDefense(
    zero.setDefense,
    baseFull.setDefense,
    paddingAtZero,
  );
  const ironfurDefense = getPaddingMaterial(zero.armorStyle, 'Ironfur').defense;
  const paddingDefenseMultiplier = round(
    (['blunt', 'pierce', 'slash'] as const).reduce(
      (total, type) =>
        total +
        (paddingFull.setDefense[type] - zero.setDefense[type]) /
          ironfurDefense[type],
      0,
    ) / 3,
    4,
  );
  const weightConfig = {
    baseMinWeight: round(
      zero.setWeight -
        paddingMaterial.additiveWeightConfig.minWeightOffset -
        baseMaterial.additiveWeightConfig.minWeightOffset,
      4,
    ),
    baseContrib: round(
      (baseFull.setWeight - zero.setWeight) /
        baseMaterial.additiveWeightConfig.baseContribMult,
      4,
    ),
  };

  let pieceMinimums: Record<PieceKey, number>;
  if (baseMaterial.additiveWeightConfig.minWeightOffset === 0) {
    pieceMinimums = zero.pieceWeight;
  } else {
    const observedTotal = sumPieces(zero.pieceWeight);
    const baselineTotal =
      observedTotal - baseMaterial.additiveWeightConfig.minWeightOffset;
    pieceMinimums = mapPieceStats((piece) =>
      round(zero.pieceWeight[piece] * (baselineTotal / observedTotal), 6),
    );
  }
  const pieceWeightCoeffs = mapPieceStats((piece) => ({
    minWeight: pieceMinimums[piece],
    baseContrib: round(
      (baseFull.pieceWeight[piece] - zero.pieceWeight[piece]) /
        baseMaterial.additiveWeightConfig.baseContribMult,
      6,
    ),
    padContrib: round(
      (paddingFull.pieceWeight[piece] - zero.pieceWeight[piece]) /
        paddingMaterial.additiveWeightConfig.padContribRatio,
      6,
    ),
  }));

  return {
    baseMaterialUsage,
    baseMaterialUsageDensityCoeffs: {
      a: usageA,
      b: round(1 - usageA, 4),
    },
    paddingUsage,
    paddingUsageDensityCoeffs: {
      a: paddingUsageA,
      b: round(1 - paddingUsageA, 4),
    },
    paddingDefenseMultiplier,
    paddingWeightMultiplier: round(
      (paddingFull.setWeight - zero.setWeight) /
        paddingMaterial.additiveWeightConfig.padContrib,
      4,
    ),
    durabilityCoeffs,
    baseDefense: defense.baseDefense,
    baseDefenseDensityCoeffs: defense.densityCoeffs,
    weightConfig,
    pieceWeightCoeffs,
  };
}

function mapDefense(map: (type: keyof DefenseStats) => number): DefenseStats {
  return {
    blunt: map('blunt'),
    pierce: map('pierce'),
    slash: map('slash'),
  };
}

function derivePadding(
  persisted: PersistedCampaignBatch,
  style: ActiveArmorStyleConfig,
): GeneratedPaddingConfig {
  const zero = sampleAt(persisted, 0, 0);
  const paddingFull = sampleAt(persisted, 0, 100);
  const midpoint = sampleAt(persisted, 50, 50);
  const initialMaterialMultiplier = round(
    sumPieces(
      mapPieceStats((piece) => paddingFull.pieceMaterialUsage[piece].padding),
    ) / sumPieces(style.paddingUsage),
    4,
  );
  const materialMultiplier = fitScalar(
    initialMaterialMultiplier,
    (candidate) =>
      [zero, paddingFull, midpoint].flatMap((sample) => {
        const density = sample.paddingDensity / 100;
        const densityScale =
          style.paddingUsageDensityCoeffs.a +
          style.paddingUsageDensityCoeffs.b * density;
        return PIECE_KEYS.map((piece) =>
          Math.abs(
            Math.round(style.paddingUsage[piece] * candidate * densityScale) -
              sample.pieceMaterialUsage[piece].padding,
          ),
        );
      }),
  );
  const pieceMaterialMultiplierConfig = mapPieceStats((piece) =>
    fitPaddingPieceUsageCoefficients(
      style,
      piece,
      zero,
      paddingFull,
      midpoint,
    ),
  );
  const minMult = round(
    zero.pieceDurability.torso / style.durabilityCoeffs.baseMin,
    6,
  );
  const padMult = round(
    (paddingFull.pieceDurability.torso - zero.pieceDurability.torso) /
      style.durabilityCoeffs.padContrib,
    6,
  );
  const coreAtZero = mapDefense(
    (type) =>
      style.baseDefense[type] *
      style.baseDefenseDensityCoeffs[type].a,
  );
  const defense = mapDefense((type) =>
    round(
      (paddingFull.setDefense[type] - coreAtZero[type]) /
        style.paddingDefenseMultiplier,
      4,
    ),
  );
  const defenseDensityCoeffs = mapDefenseCoeffs((type) => {
    const atZero =
      (zero.setDefense[type] - coreAtZero[type]) /
      style.paddingDefenseMultiplier;
    const a = round(atZero / defense[type], 4);
    return { a, b: round(1 - a, 4) };
  });
  const minWeightOffset = round(zero.setWeight - style.weightConfig.baseMinWeight, 4);
  const padContrib = round(
    (paddingFull.setWeight - zero.setWeight) /
      style.paddingWeightMultiplier,
    4,
  );
  const pieceRatios = PIECE_KEYS.map(
    (piece) =>
      (paddingFull.pieceWeight[piece] - zero.pieceWeight[piece]) /
      style.pieceWeightCoeffs[piece].padContrib,
  ).filter(Number.isFinite);
  const padContribRatio = round(
    pieceRatios.reduce((sum, value) => sum + value, 0) / pieceRatios.length,
    4,
  );

  return {
    materialMultiplier,
    pieceMaterialMultiplierConfig,
    durabilityMults: { minMult, padMult },
    styleMinMult: { [zero.armorStyle]: minMult },
    defense,
    defenseDensityCoeffs,
    additiveWeightConfig: {
      minWeightOffset,
      padContrib,
      padContribRatio,
    },
  };
}

function mapDefenseCoeffs(
  map: (type: keyof DefenseStats) => { a: number; b: number },
) {
  return {
    blunt: map('blunt'),
    pierce: map('pierce'),
    slash: map('slash'),
  };
}

function deriveCore(
  persisted: PersistedCampaignBatch,
  style: ActiveArmorStyleConfig,
  padding: GeneratedPaddingConfig | ReturnType<typeof getPaddingMaterial>,
): ActiveBaseMaterialConfig {
  const zero = sampleAt(persisted, 0, 0);
  const baseFull = sampleAt(persisted, 100, 0);
  const paddingFull = sampleAt(persisted, 0, 100);
  const midpoint = sampleAt(persisted, 50, 50);
  const usage = fitUsageCoefficients(style, zero, baseFull, midpoint);
  const pieceUsage = mapPieceStats((piece) =>
    fitPieceUsageCoefficients(style, piece, zero, baseFull, midpoint),
  );
  const durability = {
    baseMin: round(
      zero.pieceDurability.torso / padding.durabilityMults.minMult,
      6,
    ),
    baseDensityContrib: round(
      baseFull.pieceDurability.torso - zero.pieceDurability.torso,
      6,
    ),
    padContrib: round(
      (paddingFull.pieceDurability.torso - zero.pieceDurability.torso) /
        padding.durabilityMults.padMult,
      6,
    ),
  };
  const paddingAtZero = mapDefense(
    (type) =>
      padding.defense[type] *
      padding.defenseDensityCoeffs[type].a *
      style.paddingDefenseMultiplier,
  );
  const defense = normalizedDefense(
    zero.setDefense,
    baseFull.setDefense,
    paddingAtZero,
  );
  const minWeightOffset = round(
    zero.setWeight -
      style.weightConfig.baseMinWeight -
      padding.additiveWeightConfig.minWeightOffset,
    4,
  );
  const baseContribMult = round(
    (baseFull.setWeight - zero.setWeight) / style.weightConfig.baseContrib,
    4,
  );
  const pieceBaseContribMult = mapPieceStats((piece) =>
    round(
      (baseFull.pieceWeight[piece] - zero.pieceWeight[piece]) /
        style.pieceWeightCoeffs[piece].baseContrib,
      6,
    ),
  );
  const durabilityRatio = round(
    durability.baseMin / style.durabilityCoeffs.baseMin,
    6,
  );

  return {
    usageMultiplier: usage.full,
    usageMultiplierConfig: {
      [zero.armorStyle]: { a: usage.a, b: usage.b },
    },
    pieceUsageMultiplierConfig: {
      [zero.armorStyle]: pieceUsage,
    },
    durability: durabilityRatio,
    durabilityConfig: { [zero.armorStyle]: durability },
    additiveWeightConfig: {
      minWeightOffset,
      baseContribMult,
      pieceBaseContribMult,
    },
    defenseConfig: {
      [zero.armorStyle]: {
        baseDefense: defense.baseDefense,
        densityCoeffs: defense.densityCoeffs,
      },
    },
  };
}

async function loadCampaign(): Promise<Map<string, PersistedCampaignBatch>> {
  const entries = await Promise.all(
    ARMOR_CAMPAIGN.map(async (subject) => {
      const persisted = (await Bun.file(
        resolve(INPUT_DIRECTORY, `${subject.slug}.json`),
      ).json()) as PersistedCampaignBatch;
      if (persisted.batch.status !== 'complete') {
        throw new Error(`${subject.slug}: persisted batch is not complete`);
      }
      return [subject.slug, persisted] as const;
    }),
  );
  return new Map(entries);
}

function serialize(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

async function main(): Promise<void> {
  const persisted = await loadCampaign();
  const generatedStyles: Partial<Record<ArmorStyle, ActiveArmorStyleConfig>> = {};
  const generatedPaddings: Partial<Record<SupportMaterial, GeneratedPaddingConfig>> = {};
  const generatedCores: Partial<Record<BaseMaterial, ActiveBaseMaterialConfig>> = {};

  ARMOR_CAMPAIGN.filter(({ roles }) => roles.includes('armor')).forEach((subject) => {
    generatedStyles[subject.armorStyle] = deriveStyle(persisted.get(subject.slug)!);
  });

  ARMOR_CAMPAIGN.filter(({ roles }) => roles.includes('padding-anchor')).forEach(
    (subject) => {
      generatedPaddings[subject.padding] = derivePadding(
        persisted.get(subject.slug)!,
        generatedStyles['Mercenary Plate']!,
      );
    },
  );

  ARMOR_CAMPAIGN.filter(({ roles }) => roles.includes('core')).forEach((subject) => {
    const style = generatedStyles[subject.armorStyle] ?? armorStyles[subject.armorStyle];
    if (!style) throw new Error(`Missing style config: ${subject.armorStyle}`);
    const padding =
      generatedPaddings[subject.padding] ??
      getPaddingMaterial(subject.armorStyle, subject.padding);
    generatedCores[subject.base] = deriveCore(
      persisted.get(subject.slug)!,
      style,
      padding,
    );
  });

  const styleCoreSupport = [...new Set(ARMOR_CAMPAIGN.map(
    ({ armorStyle, base }) => `${armorStyle}\u0000${base}`,
  ))];
  const stylePaddingSupport = [...new Set(ARMOR_CAMPAIGN.map(
    ({ armorStyle, padding }) => `${armorStyle}\u0000${padding}`,
  ))];
  const configSource = `import type {\n  ArmorStyle,\n  ArmorStyleConfig,\n  BaseMaterial,\n  BaseMaterialConfig,\n  PaddingMaterialConfig,\n  SupportMaterial,\n} from '../types';\n\ntype ActiveArmorStyleConfig = Omit<\n  ArmorStyleConfig,\n  'pieceWeightMultipliers' | 'baseWeightDensityCoeffs'\n>;\ntype ActiveBaseMaterialConfig = Omit<BaseMaterialConfig, 'weight'>;\nexport type GeneratedPaddingConfig = PaddingMaterialConfig & {\n  styleMinMult: Partial<Record<ArmorStyle, number>>;\n  additiveWeightConfig: {\n    minWeightOffset: number;\n    padContrib: number;\n    padContribRatio: number;\n  };\n};\n\n// Generated by scripts/calibrateArmorCampaign.ts from persisted MortalData responses.\nexport const generatedArmorStyles = ${serialize(generatedStyles)} satisfies Partial<Record<ArmorStyle, ActiveArmorStyleConfig>>;\n\nexport const generatedBaseMaterials = ${serialize(generatedCores)} satisfies Partial<Record<BaseMaterial, ActiveBaseMaterialConfig>>;\n\nexport const generatedPaddingMaterials = ${serialize(generatedPaddings)} satisfies Partial<Record<SupportMaterial, GeneratedPaddingConfig>>;\n\nexport const generatedStyleCoreSupport = new Set(${serialize(styleCoreSupport)});\nexport const generatedStylePaddingSupport = new Set(${serialize(stylePaddingSupport)});\n`;
  await Bun.write(CONFIG_OUTPUT, configSource);

  const samples = ARMOR_CAMPAIGN.flatMap(
    ({ slug }) => persisted.get(slug)!.batch.results.map(({ sample }) => sample),
  );
  const sampleSource = `import type { SetStats } from '../src/types';\n\n// Generated by scripts/calibrateArmorCampaign.ts from persisted MortalData responses.\nexport const generatedCampaignSamples = ${serialize(samples)} satisfies SetStats[];\n`;
  await Bun.write(SAMPLE_OUTPUT, sampleSource);
  console.info(
    `Generated ${Object.keys(generatedStyles).length} styles, ${Object.keys(generatedCores).length} Core materials, ${Object.keys(generatedPaddings).length} paddings, and ${samples.length} samples.`,
  );
}

if (import.meta.main) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
