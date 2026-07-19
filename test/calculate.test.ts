import { describe, it, expect } from 'bun:test';
import { samples, calculateSetStatus } from '../src';
import { PIECE_KEYS } from '../src/types';

const TOLERANCE = 0.01;
const PIECE_WEIGHT_TOLERANCE = 0.01;
const DURABILITY_TOLERANCE = 1.0;
const DEFENSE_TOLERANCE = 0.01;
const MATERIAL_TOLERANCE = 2;

function roundedDiff(a: number, b: number): number {
  return Math.round(Math.abs(a - b) * 1e10) / 1e10;
}

function expectClose(
  actual: number,
  expected: number,
  message: string,
  tolerance = TOLERANCE,
) {
  const diff = roundedDiff(actual, expected);
  if (diff > tolerance) {
    throw new Error(
      `${message}: expected ${expected}, got ${actual} (diff: ${diff})`,
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

      it('should match setWeight', () => {
        expectClose(result.setWeight, sample.setWeight, 'setWeight');
      });

      it('should match setDura', () => {
        expectClose(
          result.setDura,
          sample.setDura,
          'setDura',
          DURABILITY_TOLERANCE,
        );
      });

      (['base', 'padding'] as const).forEach((material) => {
        it(`should match setMaterialUsage.${material}`, () => {
          expect(
            Math.abs(
              result.setMaterialUsage[material] -
                sample.setMaterialUsage[material],
            ),
          ).toBeLessThanOrEqual(MATERIAL_TOLERANCE);
        });
      });

      (['blunt', 'pierce', 'slash'] as const).forEach((damage) => {
        it(`should match setDefense.${damage}`, () => {
          expectClose(
            result.setDefense[damage],
            sample.setDefense[damage],
            `setDefense.${damage}`,
            DEFENSE_TOLERANCE,
          );
        });
      });

      describe('pieceWeight', () => {
        PIECE_KEYS.forEach((piece) => {
          it(`should match ${piece}`, () => {
            expectClose(
              result.pieceWeight[piece],
              sample.pieceWeight[piece],
              `pieceWeight.${piece}`,
              PIECE_WEIGHT_TOLERANCE,
            );
          });
        });
      });

      describe('pieceDurability', () => {
        PIECE_KEYS.forEach((piece) => {
          it(`should match ${piece}`, () => {
            expectClose(
              result.pieceDurability[piece],
              sample.pieceDurability[piece],
              `pieceDurability.${piece}`,
              DURABILITY_TOLERANCE,
            );
          });
        });
      });

      describe('pieceMaterialUsage', () => {
        PIECE_KEYS.forEach((piece) => {
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
        });
      });
    });
  });

  it('rejects a Core material outside the armor family', () => {
    expect(() =>
      calculateSetStatus({
        armorStyle: 'Mercenary Plate',
        base: 'Leptoid Scales',
        padding: 'Ironfur',
        baseDensity: 100,
        paddingDensity: 100,
      }),
    ).toThrow(
      'Base material "Leptoid Scales" is not compatible with armor style "Mercenary Plate".',
    );
  });

  it('describes catalog-compatible pairings that still need calibration', () => {
    expect(() =>
      calculateSetStatus({
        armorStyle: 'Draconigena Armatus',
        base: 'Aabam',
        padding: 'Ironfur',
        baseDensity: 100,
        paddingDensity: 100,
      }),
    ).toThrow('catalog-compatible with armor style "Draconigena Armatus" but this pairing is not calibrated.');
  });

  it('rejects padding outside the staged calibration pairing', () => {
    expect(() =>
      calculateSetStatus({
        armorStyle: 'Draconigena Armatus',
        base: 'Plate Scales',
        padding: 'Silk',
        baseDensity: 100,
        paddingDensity: 100,
      }),
    ).toThrow(
      'Padding material "Silk" is catalog-compatible with armor style "Draconigena Armatus" but this pairing is not calibrated.',
    );
  });

  it('keeps armor styles with unusable piece usage unsupported', () => {
    expect(() =>
      calculateSetStatus({
        armorStyle: 'Kallardian Banded',
        base: 'Plate Scales',
        padding: 'Ironfur',
        baseDensity: 100,
        paddingDensity: 100,
      }),
    ).toThrow('Armor style "Kallardian Banded" is not configured.');
  });
});
