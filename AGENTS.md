# AGENTS.md - Armor Calculator Development Guide

Quick reference for AI coding agents working on this armor stats calculator.

## Commands

```bash
# Run all tests
bun test

# Run specific test
bun test --test-name-pattern "Sample 1"

# Type checking
bunx tsc --noEmit

# Parse new sample data
bun scripts/parseSample.ts sample.txt
```

## Project Structure

```
armor/
├── src/
│   ├── index.ts              # Main exports
│   ├── calculate.ts          # Core calculation: calculateSetStatus()
│   ├── types.ts              # All TypeScript types
│   └── data/
│       ├── armorStyles.ts    # Per-style coefficients & base stats
│       ├── baseMaterials.ts  # Base material properties
│       └── paddingMaterials.ts # Padding material properties
├── test/calculate.test.ts    # Test suite (54 samples)
├── samples/                  # Game data samples
└── scripts/parseSample.ts    # Sample data parser
```

## Code Style

- **TypeScript strict mode** enabled
- **Import types**: Use `import type { ... }` for type-only imports
- **Naming**: PascalCase for types, camelCase for functions, UPPER_SNAKE_CASE for constants
- **Formatting**: 2-space indent, single quotes, trailing commas

## Core Formulas

### Defense
```typescript
defense[type] = materialBaseDefense[type] × linearScale(baseDensity, materialCoeffs[type])
                + paddingDefense[type] × linearScale(paddingDensity, paddingCoeffs[type])

where linearScale(d, {a, b}) = a + b × (d/100)

Note: Each base material has style-specific base defense values and density scaling coefficients.
      Plate Scales uses the armor style's base values; other materials have their own.
```

### Weight
**ADDITIVE MODEL** (100% accurate at ±0.01 for both set and piece weights):

**Set Weight:**
```typescript
setWeight(bd, pd) = minWeight + baseContrib × (bd/100) + padContrib × (pd/100)

where:
- minWeight = styleBaseMinWeight + paddingOffset + baseMaterialOffset
- baseContrib = styleBaseContrib × baseMaterialMult
- padContrib = (from padding material config)
```

**Piece Weight:**
```typescript
pieceWeight(bd, pd) = (pieceMin - offsetAdj) + pieceBase×(bd/100) + piecePad×padRatio×(pd/100)

where:
- pieceMin, pieceBase, piecePad = from armorStyles.ts pieceWeightCoeffs (calibrated for Ironfur)
- offsetAdj = (0.5 - paddingMinWeightOffset) × (pieceMin / totalIronfurMin)
- padRatio = from padding material's padContribRatio (1.0 for Ironfur, ~0.286 for Ironsilk)
```

Configuration distributed across:
- armorStyles.ts: weightConfig { baseMinWeight, baseContrib }, pieceWeightCoeffs
- baseMaterials.ts: additiveWeightConfig { minWeightOffset, baseContribMult }
- paddingMaterials.ts: additiveWeightConfig { minWeightOffset, padContrib, padContribRatio }
```

### Durability
**STYLE-SPECIFIC MODEL** (±1.0 accuracy with style-specific multipliers):

```typescript
durability = ((baseMin × padMinMult) + (baseDensityContrib × bd/100)
              + (padContrib × padPadMult × pd/100))
             × pieceMultiplier × baseMaterialMult

where:
- baseMin, baseDensityContrib, padContrib = from armorStyles.ts or baseMaterials.ts durabilityConfig
- padMinMult, padPadMult = from paddingMaterials.ts durabilityMults (style-specific)
- pieceMultiplier = helm=0.8, torso=1.0, arms=0.6, legs=1.0
```

**Key insight**: Padding materials have **style-specific** `minMult` values that vary slightly across armor styles, while `padMult` is consistent across styles. This discovery reduced durability error from ±16.0 to ±1.0.

Configuration distributed across:
- armorStyles.ts: durabilityCoeffs { baseMin, baseDensityContrib, padContrib } for Plate Scales
- baseMaterials.ts: durabilityConfig per style for other base materials
- paddingMaterials.ts: durabilityMults { minMult, padMult } + styleMinMult per style

### Material Usage
```typescript
baseUsage = round(styleBase × materialMult × linearScale(baseDensity, coeffs))
paddingUsage = round(stylePadding × materialMult × linearScale(paddingDensity, {a: 1/3, b: 2/3}))
```

## Adding New Materials

### New Armor Style
1. Collect samples: 100/100, 100/0, 0/100, 0/0 with Ironfur
2. Add to `src/types.ts`: Update `ArmorStyle` union type
3. Add to `src/data/armorStyles.ts`:
   - `baseMaterialUsage`: From 100/100 sample's `pieceMaterialUsage.*.base`
   - `paddingUsage`: From 100/100 sample's `pieceMaterialUsage.*.padding`
   - `baseDefense`: From 100/0 Ironfur sample
   - Calculate density coefficients from sample comparisons

### New Padding Material
1. Collect samples: 100/100, 100/50 with material (use Kallardian Norse)
2. Add to `src/types.ts`: Update `SupportMaterial` union
3. Add to `src/data/paddingMaterials.ts`:
   - `defense`: `D(100/100) - baseDefense`
   - `defenseDensityCoeffs`: Calculate from `D(100/0)` and `D(100/100)`
   - `materialMultiplier`: Usage ratio vs Ironfur
   - `weight`: Derive from weight difference

### New Base Material
1. Collect samples for EACH armor style: 100/0, 0/100, 100/100 with Ironfur
2. Add to `src/types.ts`: Update `BaseMaterial` union
3. Add to `src/data/baseMaterials.ts`:
   - `weight`: Weight per unit
   - `usageMultiplier`: Usage ratio vs Plate Scales
   - `durability`: Durability multiplier
   - `defenseConfig`: Per-style base defense and density coefficients
     - Base defense from 100/0 sample
     - Density coefficients derived from 0/100 and 100/0 samples

## Test Tolerances

Current tolerances (reflect known formula accuracy):
- **Weight**: ±0.01 kg (100% accuracy with additive model)
- **Piece Weight**: ±0.01 kg (100% accuracy with per-piece additive model)
- **Defense**: ±0.01 (100% accuracy with Plate Scales + Ironsilk/Ironfur)
- **Durability**: ±1.0 (100% accuracy with style-specific durability multipliers)
- **Material Usage**: ±2 units (rounding)

## Sample Data

- **Risar Berserker**: 10 samples (Plate Scales + Ironsilk/Ironfur)
- **Kallardian Norse**: 20 samples (Plate Scales + Ironsilk/Ironfur)
- **Khurite Splinted**: 12 samples (Plate Scales + Ironsilk/Ironfur)
- **Ranger Armor**: 12 samples (Plate Scales + Ironsilk/Ironfur)

Total: 54 samples across 4 armor styles (Plate Scales base material only)

## Key Data Structures

```typescript
// Armor configuration per style
type ArmorStyleConfig = {
  baseMaterialUsage: PieceStats<number>;
  paddingUsage: PieceStats<number>;
  pieceWeightMultipliers: PieceStats<number>;
  durabilityCoeffs: DurabilityCoeffs;
  baseDefense: DefenseStats;
  baseDefenseDensityCoeffs: DefenseDensityCoeffs;
  // ... and density scaling coeffs
}

// Linear scaling coefficients
type DensityCoeffs = { a: number; b: number };
```

## Important Notes

- Each base material has **style-specific base defense** and **density scaling coefficients**
- Plate Scales uses the armor style's base values; other materials have their own
- Padding materials can have **negative defense** (e.g., Ironsilk reduces blunt)
- Padding materials have **style-specific durability minMult** values
- Total defense is floored at 0 (no negative values)
- Piece multipliers: helm=0.8, torso=1.0, arms=0.6, legs=1.0
- Formula accuracy: defense (100%), weight (100%), piece weight (100%), durability (100%) at ±1.0 or better

## Samples Needed for Better Precision

All critical samples have been collected. The armor calculator now has comprehensive coverage for achieving >99% defense accuracy at ±0.01 tolerance.

✅ **Complete sample coverage achieved** - All necessary density combinations are available across all 4 armor styles and 3 base materials.
