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
  92: 'Leptoid Scales',
  104: 'Pansar Scales',
  107: 'Placoid Scales',
  108: 'Plate Scales',
  77: 'Guard Fur',
  80: 'Horned Scales',
  70: 'Ganoid Scales',
  109: 'Quality Leather',
  110: 'Raw Hide',
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

interface SampleParams {
  armorStyleId: number;
  baseMatId: number;
  supportMatId: number;
  baseDensity: number;
  supportDensity: number;
}

function parseArgs(): { mode: 'file' | 'api'; data: string | SampleParams } {
  const args = process.argv.slice(2);

  // Check if first argument looks like a file (contains no numeric IDs)
  if (args.length === 0 || (args[0] && args[0].match(/^[a-zA-Z]/))) {
    return {
      mode: 'file',
      data: args[0] || 'sample.txt',
    };
  }

  // Parse CLI parameters
  const params: Partial<SampleParams> = {};

  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];

    if (!value) {
      throw new Error(`Missing value for flag: ${flag}`);
    }

    switch (flag) {
      case '--armorStyleId':
      case '--armor-style-id':
        params.armorStyleId = parseInt(value);
        break;
      case '--baseMatId':
      case '--base-mat-id':
        params.baseMatId = parseInt(value);
        break;
      case '--supportMatId':
      case '--support-mat-id':
        params.supportMatId = parseInt(value);
        break;
      case '--baseDensity':
      case '--base-density':
        params.baseDensity = parseInt(value);
        break;
      case '--supportDensity':
      case '--support-density':
        params.supportDensity = parseInt(value);
        break;
      default:
        throw new Error(`Unknown flag: ${flag}`);
    }
  }

  const required: (keyof SampleParams)[] = [
    'armorStyleId',
    'baseMatId',
    'supportMatId',
    'baseDensity',
    'supportDensity',
  ];
  const missing = required.filter((key) => params[key] === undefined);

  if (missing.length > 0) {
    throw new Error(`Missing required parameters: ${missing.join(', ')}`);
  }

  return {
    mode: 'api',
    data: params as SampleParams,
  };
}

async function fetchFromAPI(params: SampleParams): Promise<string> {
  const url = new URL('https://mortaldata.com/php/workbench/ArmorCalc.php');
  url.searchParams.set('armorStyleId', params.armorStyleId.toString());
  url.searchParams.set('baseMatId', params.baseMatId.toString());
  url.searchParams.set('supportMatId', params.supportMatId.toString());
  url.searchParams.set('baseDensity', params.baseDensity.toString());
  url.searchParams.set('supportDensity', params.supportDensity.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return await response.text();
}

async function processContent(content: string) {
  const lines = content
    .trim()
    .split('\n')
    .filter((line) => line.trim() !== '');

  for (const line of lines) {
    const sample = parseSampleLine(line);
    console.log(JSON.stringify(sample, null, 2));
  }
}

async function main() {
  try {
    const { mode, data } = parseArgs();

    let content: string;

    if (mode === 'file') {
      const filePath = data as string;
      const file = Bun.file(filePath);
      content = await file.text();
      console.info(`# Reading from file: ${filePath}`, '\n\n');
    } else {
      const params = data as SampleParams;
      console.info(`# Fetching from API:`, params, '\n\n');
      content = await fetchFromAPI(params);
    }

    await processContent(content);
  } catch (error) {
    console.error(
      '# Error:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

main().catch(console.error);
