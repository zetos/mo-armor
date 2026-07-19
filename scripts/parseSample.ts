import type {
  ArmorStyle,
  BaseMaterial,
  MaterialUsage,
  PieceStats,
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

function parsePieces<T>(
  fields: string[],
  start: number,
  parse: (value: string) => T,
): PieceStats<T> {
  return {
    helm: parse(getField(fields, start)),
    rightArm: parse(getField(fields, start + 1)),
    torso: parse(getField(fields, start + 2)),
    leftArm: parse(getField(fields, start + 3)),
    legs: parse(getField(fields, start + 4)),
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

  const pieceMaterialUsage = parsePieces(fields, 21, parseMaterialUsage);
  const setMaterialUsage = Object.values(pieceMaterialUsage).reduce<MaterialUsage>(
    (total, usage) => ({
      base: total.base + usage.base,
      padding: total.padding + usage.padding,
    }),
    { base: 0, padding: 0 },
  );

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
    pieceWeight: parsePieces(fields, 9, parseFloat),
    setDura: parseFloat(getField(fields, 14)),
    pieceDurability: parsePieces(fields, 15, parseFloat),
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

const PARAM_KEYS: Record<string, keyof SampleParams> = {
  '--armorStyleId': 'armorStyleId',
  '--armor-style-id': 'armorStyleId',
  '--baseMatId': 'baseMatId',
  '--base-mat-id': 'baseMatId',
  '--supportMatId': 'supportMatId',
  '--support-mat-id': 'supportMatId',
  '--baseDensity': 'baseDensity',
  '--base-density': 'baseDensity',
  '--supportDensity': 'supportDensity',
  '--support-density': 'supportDensity',
};

function parseArgs(): { mode: 'file' | 'api'; data: string | SampleParams } {
  const args = process.argv.slice(2);

  if (!args[0]?.startsWith('--')) {
    return {
      mode: 'file',
      data: args[0] || 'sample.txt',
    };
  }

  const params = args.reduce<Partial<SampleParams>>((parsed, flag, index) => {
    if (index % 2 !== 0) return parsed;
    const value = args[index + 1];
    if (!value) throw new Error(`Missing value for flag: ${flag}`);
    const key = PARAM_KEYS[flag];
    if (!key) throw new Error(`Unknown flag: ${flag}`);
    return { ...parsed, [key]: parseInt(value) };
  }, {});

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
  content
    .trim()
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map(parseSampleLine)
    .forEach((sample) => console.log(JSON.stringify(sample, null, 2)));
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
