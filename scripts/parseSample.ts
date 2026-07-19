import {
  getArmorMaterialById,
  getArmorStyleById,
  isCoreCompatible,
} from '../src/catalog/armor';
import type {
  ArmorStyle,
  BaseMaterial,
  MaterialUsage,
  PieceStats,
  SetStats,
  SupportMaterial,
} from '../src/types';

const API_URL = 'https://mortaldata.com/php/workbench/ArmorCalc.php';
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_ATTEMPTS = 3;
const CONCURRENCY = 3;

export const STANDARD_DENSITY_MATRIX = [
  { baseDensity: 0, supportDensity: 0 },
  { baseDensity: 100, supportDensity: 0 },
  { baseDensity: 0, supportDensity: 100 },
  { baseDensity: 100, supportDensity: 100 },
  { baseDensity: 50, supportDensity: 50 },
] as const;

export interface SampleParams {
  armorStyleId: number;
  baseMatId: number;
  supportMatId: number;
  baseDensity: number;
  supportDensity: number;
}

export interface SampleResult {
  key: string;
  request: SampleParams;
  attempts: number;
  raw: string;
  sample: SetStats;
  validation: {
    requestEchoMatched: true;
    fieldCountValid: true;
    pieceCountValid: true;
    allNumbersFinite: true;
    usageIdsMatched: true;
    setUsageDerivedFromPieces: true;
  };
}

export interface SampleFailure {
  key: string;
  request: SampleParams;
  attempts: number;
  error: string;
}

export interface SampleBatch {
  status: 'complete' | 'partial' | 'failed';
  requested: number;
  succeeded: number;
  failed: number;
  results: SampleResult[];
  failures: SampleFailure[];
}

interface ApiOptions {
  armorStyleId: number;
  baseMatId: number;
  supportMatId: number;
  densities: readonly {
    baseDensity: number;
    supportDensity: number;
  }[];
  json: boolean;
}

class FetchSampleError extends Error {
  constructor(
    message: string,
    readonly attempts: number,
  ) {
    super(message);
  }
}

type CliOptions =
  | { mode: 'file'; filePath: string; json: boolean }
  | ({ mode: 'api' } & ApiOptions);

function getField(fields: string[], index: number): string {
  const value = fields[index];
  if (value === undefined) {
    throw new Error(`Missing field at index ${index}`);
  }
  return value;
}

function parseInteger(value: string, label: string): number {
  if (!/^-?\d+$/.test(value)) {
    throw new Error(`Invalid integer for ${label}: ${value}`);
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`Invalid integer for ${label}: ${value}`);
  }
  return parsed;
}

function parseNumber(value: string, label: string): number {
  const parsed = Number(value);
  if (value.trim() === '' || !Number.isFinite(parsed)) {
    throw new Error(`Invalid number for ${label}: ${value}`);
  }
  return parsed;
}

function parseMaterialUsage(
  value: string,
  baseMatId: number,
  supportMatId: number,
): MaterialUsage {
  const match = value.match(/^(\d+)\[(\d+)\](\d+)\[(\d+)\]$/);
  if (!match) {
    throw new Error(`Invalid material usage format: ${value}`);
  }

  const embeddedBaseId = parseInteger(match[1]!, 'usage base material ID');
  const embeddedSupportId = parseInteger(match[3]!, 'usage padding material ID');
  if (embeddedBaseId !== baseMatId || embeddedSupportId !== supportMatId) {
    throw new Error(
      `Material usage IDs ${embeddedBaseId}/${embeddedSupportId} do not match response IDs ${baseMatId}/${supportMatId}`,
    );
  }

  return {
    base: parseInteger(match[2]!, 'base material usage'),
    padding: parseInteger(match[4]!, 'padding material usage'),
  };
}

function parsePieces<T>(
  fields: string[],
  start: number,
  parse: (value: string, index: number) => T,
): PieceStats<T> {
  return {
    helm: parse(getField(fields, start), start),
    rightArm: parse(getField(fields, start + 1), start + 1),
    torso: parse(getField(fields, start + 2), start + 2),
    leftArm: parse(getField(fields, start + 3), start + 3),
    legs: parse(getField(fields, start + 4), start + 4),
  };
}

function splitResponseLine(line: string): string[] {
  const fields = line.trim().split('|');
  if (fields.at(-1) === '') fields.pop();
  if (fields.length !== 26) {
    throw new Error(`Expected 26 response fields, received ${fields.length}`);
  }
  const emptyIndex = fields.findIndex((field) => field === '');
  if (emptyIndex !== -1) {
    throw new Error(`Empty response field at index ${emptyIndex}`);
  }
  return fields;
}

export function validateSampleParams(params: SampleParams): void {
  const style = getArmorStyleById(params.armorStyleId);
  const base = getArmorMaterialById(params.baseMatId);
  const padding = getArmorMaterialById(params.supportMatId);

  if (!style) throw new Error(`Unknown armor style ID: ${params.armorStyleId}`);
  if (!base) throw new Error(`Unknown base material ID: ${params.baseMatId}`);
  if (!padding) {
    throw new Error(`Unknown padding material ID: ${params.supportMatId}`);
  }
  if (!isCoreCompatible(style, base)) {
    throw new Error(
      `${base.name} (${base.id}) is not a valid Core material for ${style.name} (${style.id})`,
    );
  }
  if (!padding.padding) {
    throw new Error(
      `${padding.name} (${padding.id}) is not a valid padding material`,
    );
  }
  if (params.baseMatId === params.supportMatId) {
    throw new Error(
      'Core and padding must use different material IDs because MortalData collapses identical usage fields',
    );
  }

  for (const [label, density] of [
    ['baseDensity', params.baseDensity],
    ['supportDensity', params.supportDensity],
  ] as const) {
    if (!Number.isInteger(density) || density < 0 || density > 100) {
      throw new Error(`${label} must be an integer from 0 to 100`);
    }
  }
}

export function parseSampleLine(line: string, expected?: SampleParams): SetStats {
  const fields = splitResponseLine(line);
  const armorStyleId = parseInteger(getField(fields, 0), 'armor style ID');
  const baseMaterialId = parseInteger(getField(fields, 1), 'base material ID');
  const paddingMaterialId = parseInteger(
    getField(fields, 2),
    'padding material ID',
  );
  const baseDensity = parseInteger(getField(fields, 3), 'base density');
  const paddingDensity = parseInteger(getField(fields, 4), 'padding density');
  const params = {
    armorStyleId,
    baseMatId: baseMaterialId,
    supportMatId: paddingMaterialId,
    baseDensity,
    supportDensity: paddingDensity,
  };
  validateSampleParams(params);

  if (
    expected &&
    (expected.armorStyleId !== armorStyleId ||
      expected.baseMatId !== baseMaterialId ||
      expected.supportMatId !== paddingMaterialId ||
      expected.baseDensity !== baseDensity ||
      expected.supportDensity !== paddingDensity)
  ) {
    throw new Error('Response IDs or densities do not match the request');
  }

  const armorStyle = getArmorStyleById(armorStyleId)!;
  const base = getArmorMaterialById(baseMaterialId)!;
  const padding = getArmorMaterialById(paddingMaterialId)!;
  parseMaterialUsage(
    getField(fields, 20),
    baseMaterialId,
    paddingMaterialId,
  );
  const pieceMaterialUsage = parsePieces(fields, 21, (value) =>
    parseMaterialUsage(value, baseMaterialId, paddingMaterialId),
  );
  const setMaterialUsage = Object.values(pieceMaterialUsage).reduce<MaterialUsage>(
    (total, usage) => ({
      base: total.base + usage.base,
      padding: total.padding + usage.padding,
    }),
    { base: 0, padding: 0 },
  );

  return {
    armorStyle: armorStyle.name as ArmorStyle,
    base: base.name as BaseMaterial,
    padding: padding.name as SupportMaterial,
    baseDensity,
    paddingDensity,
    setDefense: {
      pierce: parseNumber(getField(fields, 5), 'pierce defense'),
      slash: parseNumber(getField(fields, 6), 'slash defense'),
      blunt: parseNumber(getField(fields, 7), 'blunt defense'),
    },
    setWeight: parseNumber(getField(fields, 8), 'set weight'),
    pieceWeight: parsePieces(fields, 9, (value, index) =>
      parseNumber(value, `piece weight field ${index}`),
    ),
    setDura: parseNumber(getField(fields, 14), 'set durability'),
    pieceDurability: parsePieces(fields, 15, (value, index) =>
      parseNumber(value, `piece durability field ${index}`),
    ),
    setMaterialUsage,
    pieceMaterialUsage,
  };
}

function requestKey(params: SampleParams): string {
  return [
    params.armorStyleId,
    params.baseMatId,
    params.supportMatId,
    params.baseDensity,
    params.supportDensity,
  ].join(':');
}

function buildUrl(params: SampleParams): URL {
  const url = new URL(API_URL);
  url.searchParams.set('armorStyleId', params.armorStyleId.toString());
  url.searchParams.set('baseMatId', params.baseMatId.toString());
  url.searchParams.set('supportMatId', params.supportMatId.toString());
  url.searchParams.set('baseDensity', params.baseDensity.toString());
  url.searchParams.set('supportDensity', params.supportDensity.toString());
  return url;
}

function retryDelay(response: Response | undefined, attempt: number): number {
  const retryAfter = response?.headers.get('Retry-After');
  if (retryAfter && /^\d+$/.test(retryAfter)) {
    return Number(retryAfter) * 1_000;
  }
  return 250 * 2 ** (attempt - 1) + Math.floor(Math.random() * 100);
}

async function fetchSample(params: SampleParams): Promise<SampleResult> {
  validateSampleParams(params);
  let finalError = 'Unknown request failure';
  let attempts = 0;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    attempts = attempt;
    let response: Response | undefined;
    try {
      response = await fetch(buildUrl(params), {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!response.ok) {
        const transient = response.status === 429 || response.status >= 500;
        finalError = `API request failed: ${response.status} ${response.statusText}`;
        if (!transient || attempt === MAX_ATTEMPTS) throw new Error(finalError);
        await Bun.sleep(retryDelay(response, attempt));
        continue;
      }

      const raw = (await response.text()).trim();
      if (!raw || raw.includes('\n')) {
        throw new Error('Expected one non-empty response line');
      }
      const sample = parseSampleLine(raw, params);
      return {
        key: requestKey(params),
        request: params,
        attempts: attempt,
        raw,
        sample,
        validation: {
          requestEchoMatched: true,
          fieldCountValid: true,
          pieceCountValid: true,
          allNumbersFinite: true,
          usageIdsMatched: true,
          setUsageDerivedFromPieces: true,
        },
      };
    } catch (error) {
      finalError = error instanceof Error ? error.message : String(error);
      const transient =
        (error instanceof DOMException && error.name === 'TimeoutError') ||
        error instanceof TypeError;
      if (!transient || attempt === MAX_ATTEMPTS) break;
      await Bun.sleep(retryDelay(response, attempt));
    }
  }

  throw new FetchSampleError(finalError, attempts);
}

export async function fetchSampleBatch(
  requests: readonly SampleParams[],
): Promise<SampleBatch> {
  requests.forEach(validateSampleParams);
  const keys = requests.map(requestKey);
  if (new Set(keys).size !== keys.length) {
    throw new Error('Batch contains duplicate requests');
  }

  const settled: ({ result: SampleResult } | { failure: SampleFailure })[] = [];
  for (let start = 0; start < requests.length; start += CONCURRENCY) {
    const chunk = requests.slice(start, start + CONCURRENCY);
    settled.push(
      ...(await Promise.all(
        chunk.map(async (request) => {
          try {
            return { result: await fetchSample(request) };
          } catch (error) {
            return {
              failure: {
                key: requestKey(request),
                request,
                attempts:
                  error instanceof FetchSampleError ? error.attempts : 1,
                error: error instanceof Error ? error.message : String(error),
              },
            };
          }
        }),
      )),
    );
  }

  const results = settled.flatMap((item) => ('result' in item ? [item.result] : []));
  const failures = settled.flatMap((item) =>
    'failure' in item ? [item.failure] : [],
  );
  return {
    status:
      failures.length === 0
        ? 'complete'
        : results.length === 0
          ? 'failed'
          : 'partial',
    requested: requests.length,
    succeeded: results.length,
    failed: failures.length,
    results,
    failures,
  };
}

function parseCliInteger(value: string | undefined, flag: string): number {
  if (value === undefined) throw new Error(`Missing value for flag: ${flag}`);
  return parseInteger(value, flag);
}

export function parseArgs(args = process.argv.slice(2)): CliOptions {
  if (!args[0]?.startsWith('--')) {
    const extraArgs = args.slice(1);
    if (
      extraArgs.some((arg) => arg !== '--json') ||
      extraArgs.filter((arg) => arg === '--json').length > 1
    ) {
      throw new Error('File mode accepts only a file path and optional --json');
    }
    return {
      mode: 'file',
      filePath: args[0] || 'sample.txt',
      json: args.includes('--json'),
    };
  }

  const values = new Map<string, string>();
  const flagKeys: Record<string, string> = {
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
    '--density-matrix': 'densityMatrix',
  };
  let json = false;
  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index]!;
    if (flag === '--json') {
      if (json) throw new Error('Duplicate flag: --json');
      json = true;
      continue;
    }
    const key = flagKeys[flag];
    if (!key) throw new Error(`Unknown flag: ${flag}`);
    if (values.has(key)) throw new Error(`Duplicate parameter: ${key}`);
    const value = args[index + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for flag: ${flag}`);
    }
    values.set(key, value);
    index += 1;
  }

  const armorStyleId = parseCliInteger(
    values.get('armorStyleId'),
    '--armorStyleId',
  );
  const baseMatId = parseCliInteger(
    values.get('baseMatId'),
    '--baseMatId',
  );
  const supportMatId = parseCliInteger(
    values.get('supportMatId'),
    '--supportMatId',
  );
  const matrix = values.get('densityMatrix');
  let densities: ApiOptions['densities'];
  if (matrix !== undefined) {
    if (matrix !== 'standard') {
      throw new Error(`Unknown density matrix: ${matrix}`);
    }
    if (
      values.get('baseDensity') !== undefined ||
      values.get('supportDensity') !== undefined
    ) {
      throw new Error('Use either --density-matrix or individual densities');
    }
    densities = STANDARD_DENSITY_MATRIX;
  } else {
    densities = [
      {
        baseDensity: parseCliInteger(
          values.get('baseDensity'),
          '--baseDensity',
        ),
        supportDensity: parseCliInteger(
          values.get('supportDensity'),
          '--supportDensity',
        ),
      },
    ];
  }

  const options: CliOptions = {
    mode: 'api',
    armorStyleId,
    baseMatId,
    supportMatId,
    densities,
    json,
  };
  options.densities.forEach(({ baseDensity, supportDensity }) =>
    validateSampleParams({
      armorStyleId,
      baseMatId,
      supportMatId,
      baseDensity,
      supportDensity,
    }),
  );
  return options;
}

async function processFile(filePath: string): Promise<SetStats[]> {
  const content = await Bun.file(filePath).text();
  return content
    .trim()
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => parseSampleLine(line));
}

async function main(): Promise<void> {
  const options = parseArgs();
  if (options.mode === 'file') {
    const samples = await processFile(options.filePath);
    if (!options.json) console.info(`# Reading from file: ${options.filePath}`, '\n');
    console.log(
      options.json
        ? JSON.stringify(samples)
        : samples.map((sample) => JSON.stringify(sample, null, 2)).join('\n'),
    );
    return;
  }

  const requests = options.densities.map(({ baseDensity, supportDensity }) => ({
    armorStyleId: options.armorStyleId,
    baseMatId: options.baseMatId,
    supportMatId: options.supportMatId,
    baseDensity,
    supportDensity,
  }));
  if (!options.json) {
    console.info(
      '# Fetching from API:',
      {
        armorStyleId: options.armorStyleId,
        baseMatId: options.baseMatId,
        supportMatId: options.supportMatId,
        requests: requests.length,
      },
      '\n',
    );
  }
  const batch = await fetchSampleBatch(requests);
  console.log(
    options.json
      ? JSON.stringify(batch)
      : batch.results
          .map((result) => JSON.stringify(result.sample, null, 2))
          .join('\n'),
  );
  if (batch.failed > 0) {
    if (!options.json) {
      console.error(
        batch.failures
          .map((failure) => `# ${failure.key}: ${failure.error}`)
          .join('\n'),
      );
    }
    process.exitCode = 1;
  }
}

if (import.meta.main) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    if (process.argv.includes('--json')) {
      console.error(JSON.stringify({ status: 'blocked', error: message }));
    } else {
      console.error('# Error:', message);
    }
    process.exitCode = 1;
  });
}
