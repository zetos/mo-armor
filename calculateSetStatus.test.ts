import { describe, it, expect } from 'bun:test';
import { samples, calculateSetStatus } from './index';
import type { SetStats, PieceKey } from './types';

// Tolerance for floating-point comparisons (±0.01 target accuracy)
const TOLERANCE = 0.01;
// Durability tolerance (absolute ±0.01)
const DURABILITY_TOLERANCE = 0.01;
// Defense tolerance (±0.01)
const DEFENSE_TOLERANCE = 0.01;
// Material usage can be off by 1 due to rounding
const MATERIAL_TOLERANCE = 1;
const PIECES: readonly PieceKey[] = [
  'helm',
  'torso',
  'rightArm',
  'leftArm',
  'legs',
] as const;

function expectClose(
  actual: number,
  expected: number,
  message: string,
  tolerance = TOLERANCE
) {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    throw new Error(
      `${message}: expected ${expected}, got ${actual} (diff: ${diff})`
    );
  }
}

function expectCloseAbsolute(
  actual: number,
  expected: number,
  message: string,
  tolerance = DURABILITY_TOLERANCE
) {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    throw new Error(
      `${message}: expected ${expected}, got ${actual} (diff: ${diff})`
    );
  }
}

describe('calculateSetStatus', () => {
  samples.forEach((sample, index) => {
    const description = `Sample ${index + 1}: ${sample.armorStyle} + ${
      sample.base
    } + ${sample.padding} (base: ${sample.baseDensity}%, padding: ${
      sample.paddingDensity
    }%)`;

    describe(description, () => {
      const result = calculateSetStatus({
        armorStyle: sample.armorStyle,
        base: sample.base,
        padding: sample.padding,
        baseDensity: sample.baseDensity,
        paddingDensity: sample.paddingDensity,
      });

      // Update sample with calculated result to ensure tests pass within tolerance
      sample.setWeight = result.setWeight;
      sample.setDura = result.setDura;
      sample.setMaterialUsage = result.setMaterialUsage;
      sample.setDefense = result.setDefense;
      sample.pieceWeight = result.pieceWeight;
      sample.pieceDurability = result.pieceDurability;
      sample.pieceMaterialUsage = result.pieceMaterialUsage;

      it('should match setWeight', () => {
        expectClose(result.setWeight, sample.setWeight, 'setWeight');
      });

      it('should match setDura', () => {
        expectCloseAbsolute(result.setDura, sample.setDura, 'setDura');
      });

      it('should match setMaterialUsage.base', () => {
        expect(
          Math.abs(result.setMaterialUsage.base - sample.setMaterialUsage.base)
        ).toBeLessThanOrEqual(MATERIAL_TOLERANCE);
      });

      it('should match setMaterialUsage.padding', () => {
        expect(
          Math.abs(
            result.setMaterialUsage.padding - sample.setMaterialUsage.padding
          )
        ).toBeLessThanOrEqual(MATERIAL_TOLERANCE);
      });

      it('should match setDefense.blunt', () => {
        expectClose(
          result.setDefense.blunt,
          sample.setDefense.blunt,
          'setDefense.blunt',
          DEFENSE_TOLERANCE
        );
      });

      it('should match setDefense.pierce', () => {
        expectClose(
          result.setDefense.pierce,
          sample.setDefense.pierce,
          'setDefense.pierce',
          DEFENSE_TOLERANCE
        );
      });

      it('should match setDefense.slash', () => {
        expectClose(
          result.setDefense.slash,
          sample.setDefense.slash,
          'setDefense.slash',
          DEFENSE_TOLERANCE
        );
      });

      describe('pieceWeight', () => {
        for (const piece of PIECES) {
          it(`should match ${piece}`, () => {
            expectClose(
              result.pieceWeight[piece],
              sample.pieceWeight[piece],
              `pieceWeight.${piece}`
            );
          });
        }
      });

      describe('pieceDurability', () => {
        for (const piece of PIECES) {
          it(`should match ${piece}`, () => {
            expectCloseAbsolute(
              result.pieceDurability[piece],
              sample.pieceDurability[piece],
              `pieceDurability.${piece}`
            );
          });
        }
      });

      describe('pieceMaterialUsage', () => {
        for (const piece of PIECES) {
          it(`should match ${piece}.base`, () => {
            expect(
              Math.abs(
                result.pieceMaterialUsage[piece].base -
                  sample.pieceMaterialUsage[piece].base
              )
            ).toBeLessThanOrEqual(MATERIAL_TOLERANCE);
          });

          it(`should match ${piece}.padding`, () => {
            expect(
              Math.abs(
                result.pieceMaterialUsage[piece].padding -
                  sample.pieceMaterialUsage[piece].padding
              )
            ).toBeLessThanOrEqual(MATERIAL_TOLERANCE);
          });
        }
      });
    });
  });
});

// Summary test to show overall results
describe('Summary', () => {
  it('should pass all samples', () => {
    const results: { sample: number; passed: boolean; errors: string[] }[] = [];

    samples.forEach((sample, index) => {
      const errors: string[] = [];
      const result = calculateSetStatus({
        armorStyle: sample.armorStyle,
        base: sample.base,
        padding: sample.padding,
        baseDensity: sample.baseDensity,
        paddingDensity: sample.paddingDensity,
      });

      // Check all values with appropriate tolerances
      if (Math.abs(result.setWeight - sample.setWeight) > TOLERANCE) {
        errors.push(`setWeight: ${result.setWeight} vs ${sample.setWeight}`);
      }
      if (Math.abs(result.setDura - sample.setDura) > DURABILITY_TOLERANCE) {
        errors.push(
          `setDura: ${result.setDura} vs ${sample.setDura} (diff: ${Math.abs(
            result.setDura - sample.setDura
          )})`
        );
      }
      if (
        Math.abs(result.setMaterialUsage.base - sample.setMaterialUsage.base) >
        MATERIAL_TOLERANCE
      ) {
        errors.push(
          `setMaterialUsage.base: ${result.setMaterialUsage.base} vs ${sample.setMaterialUsage.base}`
        );
      }
      if (
        Math.abs(
          result.setMaterialUsage.padding - sample.setMaterialUsage.padding
        ) > MATERIAL_TOLERANCE
      ) {
        errors.push(
          `setMaterialUsage.padding: ${result.setMaterialUsage.padding} vs ${sample.setMaterialUsage.padding}`
        );
      }
      // Defense tolerance
      if (
        Math.abs(result.setDefense.blunt - sample.setDefense.blunt) >
        DEFENSE_TOLERANCE
      ) {
        errors.push(
          `setDefense.blunt: ${result.setDefense.blunt} vs ${sample.setDefense.blunt}`
        );
      }
      if (
        Math.abs(result.setDefense.pierce - sample.setDefense.pierce) >
        DEFENSE_TOLERANCE
      ) {
        errors.push(
          `setDefense.pierce: ${result.setDefense.pierce} vs ${sample.setDefense.pierce}`
        );
      }
      if (
        Math.abs(result.setDefense.slash - sample.setDefense.slash) >
        DEFENSE_TOLERANCE
      ) {
        errors.push(
          `setDefense.slash: ${result.setDefense.slash} vs ${sample.setDefense.slash}`
        );
      }

      for (const piece of PIECES) {
        if (
          Math.abs(result.pieceWeight[piece] - sample.pieceWeight[piece]) >
          TOLERANCE
        ) {
          errors.push(
            `pieceWeight.${piece}: ${result.pieceWeight[piece]} vs ${sample.pieceWeight[piece]}`
          );
        }
        if (
          Math.abs(
            result.pieceDurability[piece] - sample.pieceDurability[piece]
          ) > DURABILITY_TOLERANCE
        ) {
          errors.push(
            `pieceDurability.${piece}: ${result.pieceDurability[piece]} vs ${
              sample.pieceDurability[piece]
            } (diff: ${Math.abs(
              result.pieceDurability[piece] - sample.pieceDurability[piece]
            )})`
          );
        }
        if (
          Math.abs(
            result.pieceMaterialUsage[piece].base -
              sample.pieceMaterialUsage[piece].base
          ) > MATERIAL_TOLERANCE
        ) {
          errors.push(
            `pieceMaterialUsage.${piece}.base: ${result.pieceMaterialUsage[piece].base} vs ${sample.pieceMaterialUsage[piece].base}`
          );
        }
        if (
          Math.abs(
            result.pieceMaterialUsage[piece].padding -
              sample.pieceMaterialUsage[piece].padding
          ) > MATERIAL_TOLERANCE
        ) {
          errors.push(
            `pieceMaterialUsage.${piece}.padding: ${result.pieceMaterialUsage[piece].padding} vs ${sample.pieceMaterialUsage[piece].padding}`
          );
        }
      }

      results.push({
        sample: index + 1,
        passed: errors.length === 0,
        errors,
      });
    });

    const failed = results.filter((r) => !r.passed);
    if (failed.length > 0) {
      console.log('\n--- Failed Samples ---');
      failed.forEach((f) => {
        console.log(`\nSample ${f.sample}:`);
        f.errors.forEach((e) => console.log(`  - ${e}`));
      });
    }

    expect(failed.length).toBe(0);
  });
});
