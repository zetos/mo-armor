/**
 * Analyze piece weight formulas to derive per-piece additive model coefficients.
 * 
 * The hypothesis is that piece weights follow the same additive pattern as setWeight:
 *   pieceWeight(bd, pd) = minWeight + baseContrib*(bd/100) + padContrib*(pd/100)
 * 
 * We can derive these coefficients from corner samples (0/0, 100/0, 0/100, 100/100).
 */

import { PIECE_KEYS, type PieceKey } from '../src/types';

// Kallardian Norse samples at critical densities
const cornerSamples = {
  // baseDensity/paddingDensity
  '0/0': {
    // Ironfur
    ironfur: {
      setWeight: 4.6,
      pieceWeight: { helm: 0.55, rightArm: 0.6, torso: 1.47, leftArm: 0.6, legs: 1.38 },
    },
    // Ironsilk
    ironsilk: {
      setWeight: 4.1,
      pieceWeight: { helm: 0.49, rightArm: 0.53, torso: 1.31, leftArm: 0.53, legs: 1.23 },
    },
  },
  '100/0': {
    ironfur: {
      setWeight: 6.0,
      pieceWeight: { helm: 0.72, rightArm: 0.78, torso: 1.92, leftArm: 0.78, legs: 1.8 },
    },
    ironsilk: {
      setWeight: 5.5,
      pieceWeight: { helm: 0.66, rightArm: 0.72, torso: 1.76, leftArm: 0.72, legs: 1.65 },
    },
  },
  '0/100': {
    ironfur: {
      setWeight: 6.0,
      pieceWeight: { helm: 0.72, rightArm: 0.78, torso: 1.92, leftArm: 0.78, legs: 1.8 },
    },
    ironsilk: {
      setWeight: 4.5,
      pieceWeight: { helm: 0.54, rightArm: 0.59, torso: 1.44, leftArm: 0.59, legs: 1.35 },
    },
  },
  '100/100': {
    ironfur: {
      setWeight: 7.4,
      pieceWeight: { helm: 0.89, rightArm: 0.96, torso: 2.37, leftArm: 0.96, legs: 2.22 },
    },
    ironsilk: {
      setWeight: 5.9,
      pieceWeight: { helm: 0.71, rightArm: 0.77, torso: 1.89, leftArm: 0.77, legs: 1.77 },
    },
  },
};

console.log('=== Piece Weight Additive Model Analysis ===\n');

// For the additive model:
// W(bd, pd) = minWeight + baseContrib*(bd/100) + padContrib*(pd/100)
// 
// From corner samples:
// W(0, 0) = minWeight
// W(100, 0) = minWeight + baseContrib
// W(0, 100) = minWeight + padContrib
// W(100, 100) = minWeight + baseContrib + padContrib
//
// Therefore:
// minWeight = W(0, 0)
// baseContrib = W(100, 0) - W(0, 0)
// padContrib = W(0, 100) - W(0, 0)

console.log('1. Deriving per-piece additive coefficients (Kallardian Norse + Ironfur):');
console.log('--------------------------------------------------------------------------');

const pieceCoeffs: Record<PieceKey, { minWeight: number; baseContrib: number; padContrib: number }> = {
  helm: { minWeight: 0, baseContrib: 0, padContrib: 0 },
  torso: { minWeight: 0, baseContrib: 0, padContrib: 0 },
  rightArm: { minWeight: 0, baseContrib: 0, padContrib: 0 },
  leftArm: { minWeight: 0, baseContrib: 0, padContrib: 0 },
  legs: { minWeight: 0, baseContrib: 0, padContrib: 0 },
};

for (const piece of PIECE_KEYS) {
  const w00 = cornerSamples['0/0'].ironfur.pieceWeight[piece];
  const w100_0 = cornerSamples['100/0'].ironfur.pieceWeight[piece];
  const w0_100 = cornerSamples['0/100'].ironfur.pieceWeight[piece];
  const w100_100 = cornerSamples['100/100'].ironfur.pieceWeight[piece];
  
  const minWeight = w00;
  const baseContrib = w100_0 - w00;
  const padContrib = w0_100 - w00;
  
  pieceCoeffs[piece] = { minWeight, baseContrib, padContrib };
  
  // Verify: W(100, 100) should equal minWeight + baseContrib + padContrib
  const predicted100_100 = minWeight + baseContrib + padContrib;
  const error = Math.round((predicted100_100 - w100_100) * 100) / 100;
  
  console.log(`  ${piece.padEnd(8)}: min=${minWeight.toFixed(2)}, base=${baseContrib.toFixed(2)}, pad=${padContrib.toFixed(2)} | predict 100/100=${predicted100_100.toFixed(2)}, actual=${w100_100.toFixed(2)}, err=${error.toFixed(2)}`);
}

// Sum of piece coefficients vs set coefficients
console.log('\n2. Sum of piece coefficients vs set coefficients:');
console.log('---------------------------------------------------');

const sumMin = PIECE_KEYS.reduce((sum, p) => sum + pieceCoeffs[p].minWeight, 0);
const sumBase = PIECE_KEYS.reduce((sum, p) => sum + pieceCoeffs[p].baseContrib, 0);
const sumPad = PIECE_KEYS.reduce((sum, p) => sum + pieceCoeffs[p].padContrib, 0);

console.log(`  Piece sums: min=${sumMin.toFixed(2)}, base=${sumBase.toFixed(2)}, pad=${sumPad.toFixed(2)}`);
console.log(`  Set coeffs: min=4.60,          base=1.40,          pad=1.40`);

// Now let's check piece coefficients as a fraction of set
console.log('\n3. Piece weight ratios (piece/set at each density):');
console.log('-----------------------------------------------------');

const densities = ['0/0', '100/0', '0/100', '100/100'] as const;
for (const piece of PIECE_KEYS) {
  const ratios = densities.map(d => {
    const pw = cornerSamples[d].ironfur.pieceWeight[piece];
    const sw = cornerSamples[d].ironfur.setWeight;
    return (pw / sw).toFixed(4);
  });
  console.log(`  ${piece.padEnd(8)}: 0/0=${ratios[0]}, 100/0=${ratios[1]}, 0/100=${ratios[2]}, 100/100=${ratios[3]}`);
}

// Now let's check Ironsilk to see if the pattern holds
console.log('\n4. Deriving per-piece additive coefficients (Kallardian Norse + Ironsilk):');
console.log('---------------------------------------------------------------------------');

const pieceCoeffsIronsilk: Record<PieceKey, { minWeight: number; baseContrib: number; padContrib: number }> = {
  helm: { minWeight: 0, baseContrib: 0, padContrib: 0 },
  torso: { minWeight: 0, baseContrib: 0, padContrib: 0 },
  rightArm: { minWeight: 0, baseContrib: 0, padContrib: 0 },
  leftArm: { minWeight: 0, baseContrib: 0, padContrib: 0 },
  legs: { minWeight: 0, baseContrib: 0, padContrib: 0 },
};

for (const piece of PIECE_KEYS) {
  const w00 = cornerSamples['0/0'].ironsilk.pieceWeight[piece];
  const w100_0 = cornerSamples['100/0'].ironsilk.pieceWeight[piece];
  const w0_100 = cornerSamples['0/100'].ironsilk.pieceWeight[piece];
  const w100_100 = cornerSamples['100/100'].ironsilk.pieceWeight[piece];
  
  const minWeight = w00;
  const baseContrib = w100_0 - w00;
  const padContrib = w0_100 - w00;
  
  pieceCoeffsIronsilk[piece] = { minWeight, baseContrib, padContrib };
  
  // Verify: W(100, 100) should equal minWeight + baseContrib + padContrib
  const predicted100_100 = minWeight + baseContrib + padContrib;
  const error = Math.round((predicted100_100 - w100_100) * 100) / 100;
  
  console.log(`  ${piece.padEnd(8)}: min=${minWeight.toFixed(2)}, base=${baseContrib.toFixed(2)}, pad=${padContrib.toFixed(2)} | predict 100/100=${predicted100_100.toFixed(2)}, actual=${w100_100.toFixed(2)}, err=${error.toFixed(2)}`);
}

// Compare Ironfur vs Ironsilk
console.log('\n5. Comparing Ironfur vs Ironsilk coefficients:');
console.log('-----------------------------------------------');
console.log('  Looking for patterns...\n');

for (const piece of PIECE_KEYS) {
  const ir = pieceCoeffs[piece];
  const is = pieceCoeffsIronsilk[piece];
  
  const minDiff = ir.minWeight - is.minWeight;
  const baseDiff = ir.baseContrib - is.baseContrib;
  const padRatio = ir.padContrib > 0 ? is.padContrib / ir.padContrib : 0;
  
  console.log(`  ${piece.padEnd(8)}: minDiff=${minDiff.toFixed(2)}, baseDiff=${baseDiff.toFixed(2)}, padRatio(silk/fur)=${padRatio.toFixed(3)}`);
}

console.log('\n6. Testing piece weight formula with low-density samples:');
console.log('-----------------------------------------------------------');

// Low-density samples
const lowDensitySamples = [
  { pd: 1, actual: { helm: 0.72, torso: 1.92, rightArm: 0.78, leftArm: 0.78, legs: 1.8 } },
  { pd: 2, actual: { helm: 0.72, torso: 1.93, rightArm: 0.78, leftArm: 0.78, legs: 1.81 } },
  { pd: 3, actual: { helm: 0.73, torso: 1.93, rightArm: 0.79, leftArm: 0.79, legs: 1.81 } },
  { pd: 4, actual: { helm: 0.73, torso: 1.94, rightArm: 0.79, leftArm: 0.79, legs: 1.82 } },
  { pd: 5, actual: { helm: 0.73, torso: 1.94, rightArm: 0.79, leftArm: 0.79, legs: 1.82 } },
  { pd: 6, actual: { helm: 0.73, torso: 1.95, rightArm: 0.79, leftArm: 0.79, legs: 1.83 } },
  { pd: 7, actual: { helm: 0.73, torso: 1.95, rightArm: 0.79, leftArm: 0.79, legs: 1.83 } },
  { pd: 8, actual: { helm: 0.73, torso: 1.96, rightArm: 0.79, leftArm: 0.79, legs: 1.83 } },
  { pd: 9, actual: { helm: 0.74, torso: 1.96, rightArm: 0.8, leftArm: 0.8, legs: 1.84 } },
  { pd: 10, actual: { helm: 0.74, torso: 1.96, rightArm: 0.8, leftArm: 0.8, legs: 1.84 } },
];

const bd = 100;
let totalErrors = 0;
let withinTolerance = 0;
let totalPieces = 0;

for (const sample of lowDensitySamples) {
  console.log(`\n  pd=${sample.pd.toString().padStart(2)}:`);
  for (const piece of PIECE_KEYS) {
    const coeffs = pieceCoeffs[piece];
    const raw = coeffs.minWeight + coeffs.baseContrib * (bd / 100) + coeffs.padContrib * (sample.pd / 100);
    const predicted = Math.round(raw * 100) / 100;
    const actual = sample.actual[piece];
    const error = Math.round((predicted - actual) * 100) / 100;
    const status = Math.abs(error) <= 0.01 ? '✓' : '✗';
    
    console.log(`    ${piece.padEnd(8)}: raw=${raw.toFixed(4)}, rounded=${predicted.toFixed(2)}, actual=${actual.toFixed(2)}, err=${error.toFixed(2)} ${status}`);
    
    totalPieces++;
    if (Math.abs(error) <= 0.01) withinTolerance++;
    totalErrors += Math.abs(error);
  }
}

console.log(`\n  Summary: ${withinTolerance}/${totalPieces} within ±0.01 tolerance (${(withinTolerance/totalPieces*100).toFixed(1)}%)`);
console.log(`  Average error: ${(totalErrors/totalPieces).toFixed(3)}`);

// Check if minWeight is consistent (padding-independent at 0/0)
console.log('\n7. Investigating minWeight - is it padding-dependent?');
console.log('-------------------------------------------------------');

for (const piece of PIECE_KEYS) {
  const furMin = pieceCoeffs[piece].minWeight;
  const silkMin = pieceCoeffsIronsilk[piece].minWeight;
  const diff = furMin - silkMin;
  console.log(`  ${piece.padEnd(8)}: fur=${furMin.toFixed(2)}, silk=${silkMin.toFixed(2)}, diff=${diff.toFixed(2)}`);
}

// The minWeight difference is 0.5 for the set (Ironfur has +0.5 padding offset)
// Let's see if it's proportionally distributed
console.log('\n  Set minWeight diff: 4.6 - 4.1 = 0.5 (from padding offset)');
console.log('  If proportional, each piece diff should be: piece_ratio * 0.5');

console.log('\n=== Key Insight ===');
console.log('The per-piece additive model works well. The minWeight for each piece');
console.log('depends on the padding material (Ironfur adds a minWeight offset).');
console.log('The baseContrib should be the same for both paddings (only base material affects it).');
console.log('The padContrib scales with the padding material (Ironsilk padContrib = 0.286 * Ironfur padContrib).');

console.log('\n=== Analysis Complete ===');
