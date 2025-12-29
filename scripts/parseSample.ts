import type {
  ArmorStyle,
  BaseMaterial,
  SetStats,
  SupportMaterial,
} from '../src/types';

// Lookup tables for ID to name mapping
const armorStyleNames: Record<number, ArmorStyle> = {
  310: 'Risar Berserker',
  307: 'Kallardian Norse',
  313: 'Khurite Splinted',
  383: 'Ranger Armor',
};

const materialNames: Record<number, BaseMaterial | SupportMaterial> = {
  46: 'Arthropod Carapace',
  84: 'Ironfur',
  85: 'Ironsilk',
  87: 'Ironwool',
  202: 'Bloodsilk',
  90: 'Keeled Scales',
  104: 'Pansar Scales',
  108: 'Plate Scales',
  77: 'Guard Fur',
  80: 'Horned Scales',
};

function getField(fields: string[], index: number): string {
  const value = fields[index];
  if (value === undefined) {
    throw new Error(`Missing field at index ${index}`);
  }
  return value;
}

function parseMaterialUsage(str: string): { base: number; padding: number } {
  const matches = str.match(/\d+\[(\d+)\]\d+\[(\d+)\]/);
  if (!matches) {
    throw new Error(`Invalid material usage format: ${str}`);
  }

  return {
    base: parseInt(matches[1]!),
    padding: parseInt(matches[2]!),
  };
}

function parseSampleLine(line: string): SetStats {
  const fields = line.split('|').filter((f) => f !== '');

  const armorStyleId = parseInt(getField(fields, 0));
  const baseMaterialId = parseInt(getField(fields, 1));
  const paddingMaterialId = parseInt(getField(fields, 2));

  const armorStyle = armorStyleNames[armorStyleId];
  const base = materialNames[baseMaterialId] as BaseMaterial | undefined;
  const padding = materialNames[paddingMaterialId] as
    | SupportMaterial
    | undefined;

  if (!armorStyle) throw new Error(`Unknown armor style ID: ${armorStyleId}`);
  if (!base) throw new Error(`Unknown base material ID: ${baseMaterialId}`);
  if (!padding)
    throw new Error(`Unknown padding material ID: ${paddingMaterialId}`);

  const pieceMaterialUsage = {
    helm: parseMaterialUsage(getField(fields, 21)),
    rightArm: parseMaterialUsage(getField(fields, 22)),
    torso: parseMaterialUsage(getField(fields, 23)),
    leftArm: parseMaterialUsage(getField(fields, 24)),
    legs: parseMaterialUsage(getField(fields, 25)),
  };

  const setMaterialUsage = {
    base:
      pieceMaterialUsage.helm.base +
      pieceMaterialUsage.torso.base +
      pieceMaterialUsage.rightArm.base +
      pieceMaterialUsage.leftArm.base +
      pieceMaterialUsage.legs.base,
    padding:
      pieceMaterialUsage.helm.padding +
      pieceMaterialUsage.torso.padding +
      pieceMaterialUsage.rightArm.padding +
      pieceMaterialUsage.leftArm.padding +
      pieceMaterialUsage.legs.padding,
  };

  return {
    armorStyle,
    base,
    padding,
    baseDensity: parseInt(getField(fields, 3)),
    paddingDensity: parseInt(getField(fields, 4)),
    setDefense: {
      pierce: parseFloat(getField(fields, 5)),
      slash: parseFloat(getField(fields, 6)),
      blunt: parseFloat(getField(fields, 7)),
    },
    setWeight: parseFloat(getField(fields, 8)),
    pieceWeight: {
      helm: parseFloat(getField(fields, 9)),
      rightArm: parseFloat(getField(fields, 10)),
      torso: parseFloat(getField(fields, 11)),
      leftArm: parseFloat(getField(fields, 12)),
      legs: parseFloat(getField(fields, 13)),
    },
    setDura: parseFloat(getField(fields, 14)),
    pieceDurability: {
      helm: parseFloat(getField(fields, 15)),
      rightArm: parseFloat(getField(fields, 16)),
      torso: parseFloat(getField(fields, 17)),
      leftArm: parseFloat(getField(fields, 18)),
      legs: parseFloat(getField(fields, 19)),
    },
    setMaterialUsage,
    pieceMaterialUsage,
  };
}

async function main() {
  const filePath = process.argv[2] || 'sample.txt';
  const file = Bun.file(filePath);
  const content = await file.text();

  const lines = content
    .trim()
    .split('\n')
    .filter((line) => line.trim() !== '');

  for (const line of lines) {
    const sample = parseSampleLine(line);
    console.log(JSON.stringify(sample, null, 2));
  }
}

main().catch(console.error);
