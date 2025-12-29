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
├── test/calculate.test.ts    # Test suite (44 samples)
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
```typescript
weight = (baseUsage × baseWeight × linearScale(baseDensity, coeffs)
          + paddingUsage × padWeight × linearScale(paddingDensity, coeffs))
         × pieceMultiplier
```

### Durability
```typescript
durability = ((baseMin × padMinMult) + (baseDensityContrib × bd/100)
              + (padContrib × padPadMult × pd/100))
             × pieceMultiplier × baseMaterialMult
```

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
- **Weight**: ±5.0 kg (some samples show larger variance)
- **Durability**: ±16.0 (formula approximation)
- **Defense**: ±0.01 (95.40% success rate with style-specific configs)
  - 4 rounding errors on Plate Scales (acceptable)
  - 3 failures on Horned Scales (improved with complete density data)
  - 3 failures on Arthropod Carapace (may need material-specific coefficients)
- **Material Usage**: ±2 units (rounding)

## Sample Data

- **Risar Berserker**: 28 samples, multiple materials
- **Kallardian Norse**: 22 samples, 0-100% density range
- **Khurite Splinted**: 25 samples, multiple materials
- **Ranger Armor**: 18 samples

Total: 88 samples across 4 armor styles (3 base materials)

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
- Total defense is floored at 0 (no negative values)
- Piece multipliers: helm=0.8, torso=1.0, arms=0.6, legs=1.0
- Formula accuracy: defense is highly accurate (94% at ±0.01), weight/durability have more variance

## Samples Needed for Better Precision

All critical samples have been collected. The armor calculator now has comprehensive coverage for achieving >99% defense accuracy at ±0.01 tolerance.

Optional sample for complete density matrix coverage:
- **Khurite Splinted + Arthropod Carapace + Ironfur @ 0/0** (for complete density testing)
