import { describe, expect, it } from 'bun:test';
import {
  parseArgs,
  parseSampleLine,
  STANDARD_DENSITY_MATRIX,
  validateSampleParams,
} from '../scripts/parseSample';

const SAMPLE =
  '383|108|84|25|75|34.22|38.48|40.22|6.57|0.66|0.92|2.1|0.92|1.97|1430.5|286.1|214.58|357.63|214.58|357.63|108[164]84[339]|108[17]84[33]|108[23]84[47]|108[50]84[101]|108[23]84[47]|108[53]84[108]|';

describe('parseSampleLine', () => {
  it('parses a complete response and derives set usage from pieces', () => {
    const sample = parseSampleLine(SAMPLE, {
      armorStyleId: 383,
      baseMatId: 108,
      supportMatId: 84,
      baseDensity: 25,
      supportDensity: 75,
    });

    expect(sample.armorStyle).toBe('Ranger Armor');
    expect(sample.base).toBe('Plate Scales');
    expect(sample.padding).toBe('Ironfur');
    expect(sample.setMaterialUsage).toEqual({ base: 166, padding: 336 });
    expect(sample.pieceWeight).toEqual({
      helm: 0.66,
      rightArm: 0.92,
      torso: 2.1,
      leftArm: 0.92,
      legs: 1.97,
    });
  });

  it('rejects malformed field counts and response echo mismatches', () => {
    expect(() => parseSampleLine(SAMPLE.replace('|108[53]84[108]|', '|'))).toThrow(
      'Expected 26 response fields',
    );
    expect(() =>
      parseSampleLine(SAMPLE, {
        armorStyleId: 383,
        baseMatId: 108,
        supportMatId: 84,
        baseDensity: 0,
        supportDensity: 75,
      }),
    ).toThrow('Response IDs or densities do not match the request');
  });

  it('rejects usage fields whose embedded IDs do not match', () => {
    expect(() => parseSampleLine(SAMPLE.replace('108[17]84[33]', '107[17]84[33]'))).toThrow(
      'Material usage IDs 107/84 do not match response IDs 108/84',
    );
    expect(() =>
      parseSampleLine(SAMPLE.replace('108[164]84[339]', '107[164]84[339]')),
    ).toThrow('Material usage IDs 107/84 do not match response IDs 108/84');
  });
});

describe('sample request validation', () => {
  const valid = {
    armorStyleId: 309,
    baseMatId: 108,
    supportMatId: 84,
    baseDensity: 0,
    supportDensity: 100,
  };

  it('accepts a role- and family-compatible request', () => {
    expect(() => validateSampleParams(valid)).not.toThrow();
  });

  it('rejects invalid family, padding role, density, and identical IDs', () => {
    expect(() => validateSampleParams({ ...valid, baseMatId: 70 })).toThrow(
      'is not a valid Core material',
    );
    expect(() => validateSampleParams({ ...valid, supportMatId: 108 })).toThrow(
      'is not a valid padding material',
    );
    expect(() => validateSampleParams({ ...valid, baseDensity: 101 })).toThrow(
      'baseDensity must be an integer from 0 to 100',
    );
    expect(() =>
      validateSampleParams({
        armorStyleId: 391,
        baseMatId: 84,
        supportMatId: 84,
        baseDensity: 0,
        supportDensity: 0,
      }),
    ).toThrow('Core and padding must use different material IDs');
  });
});

describe('parseArgs', () => {
  it('expands the standard density matrix in deterministic order', () => {
    const options = parseArgs([
      '--armorStyleId',
      '309',
      '--baseMatId',
      '108',
      '--supportMatId',
      '84',
      '--density-matrix',
      'standard',
      '--json',
    ]);

    expect(options.mode).toBe('api');
    if (options.mode !== 'api') throw new Error('Expected API options');
    expect(options.densities).toEqual(STANDARD_DENSITY_MATRIX);
    expect(options.json).toBe(true);
  });

  it('rejects duplicate aliases and unexpected file arguments', () => {
    expect(() =>
      parseArgs([
        '--armorStyleId',
        '309',
        '--armor-style-id',
        '383',
        '--baseMatId',
        '108',
        '--supportMatId',
        '84',
        '--density-matrix',
        'standard',
      ]),
    ).toThrow('Duplicate parameter: armorStyleId');
    expect(() => parseArgs(['sample.txt', '--unknown'])).toThrow(
      'File mode accepts only a file path and optional --json',
    );
  });
});
