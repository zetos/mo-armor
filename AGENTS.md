# AGENTS.md - Armor Calculator Codebase Guide

This document provides context for AI coding agents working on this armor stats calculator.

## Build/Lint/Test Commands

```bash
# Run all tests
bun test

# Run a single test file
bun test calculateSetStatus.test.ts

# Run tests matching a pattern
bun test --test-name-pattern "Sample 1"

# Type checking (no emit, strict mode)
bunx tsc --noEmit

# Run the main module
bun run start
```

## Project Structure

```
armor/
├── index.ts                    # Main exports and sample data
├── calculateSetStatus.ts       # Core calculation function
├── types.ts                    # Shared type definitions
├── calculateSetStatus.test.ts  # Tests comparing against samples
├── samples/                    # Game samples organized by armor style
│   ├── index.ts
│   ├── kallardianNorse.ts     # 18 samples
│   ├── risarBerserker.ts      # 14 samples
│   ├── khuriteSplinted.ts     # 6 samples
│   └── rangerArmor.ts         # 6 samples
└── data/
    ├── armorStyles.ts          # Armor style configurations
    ├── baseMaterials.ts        # Base material properties
    └── paddingMaterials.ts     # Padding material properties
```

## Code Style Guidelines

### Imports

- Use `import type { ... }` for type-only imports (required by `verbatimModuleSyntax`)
- Group imports: types first, then modules
- Use relative paths for local imports

### Formatting

- 2-space indentation
- Single quotes for strings
- Trailing commas in multi-line objects/arrays
- No semicolons (optional, but be consistent)

### Types

- TypeScript strict mode is enabled
- Use explicit types for function parameters and return values
- Prefer `type` over `interface` for object shapes
- Use generic constraints when appropriate: `<B extends BaseMaterial>`

### Naming Conventions

- PascalCase: types, interfaces (`ArmorStyle`, `SetStats`)
- camelCase: functions, variables (`calculateSetStatus`, `pieceWeight`)
- UPPER_SNAKE_CASE: constants (`PIECES`, `DURABILITY_PIECE_MULTIPLIERS`)
- Descriptive names: `baseMaterialUsage`, `paddingDensity`

### Error Handling

- Throw descriptive errors for missing configurations
- Use `Partial<Record<...>>` for incomplete data maps with getter functions that throw

---

## Reverse-Engineered Formulas

### Defense Calculation (VERIFIED - +-0.01 accuracy)

```typescript
// Defense = base contribution + padding contribution
// Each uses linear density scaling with per-type coefficients

defense[type] =
  baseDefense[type] * baseScale(baseDensity, baseCoeffs[type]) +
  paddingDefense[type] * padScale(paddingDensity, padCoeffs[type]);

// where scale(d, coeffs) = coeffs.a + coeffs.b * (d/100)
// and coeffs.a + coeffs.b = 1.0 (so scale(100) = 1.0)
```

**Key insight:** Each armor style has its own `baseDefense` (from 100/0 Ironfur sample) and its own per-damage-type `baseDefenseDensityCoeffs`. Each padding material also has unique `defense` values and `defenseDensityCoeffs`.

**Important:** Some paddings like Ironsilk have NEGATIVE defense contributions for certain damage types (blunt). The total defense is floored at 0.

### Material Usage

```typescript
// Base material usage scales with density
baseUsage = round(
  styleBaseUsage *
    baseMaterialUsageMultiplier *
    densityScaleBaseUsage(baseDensity)
);
// where densityScaleBaseUsage(d) = 0.5 + 0.5 * (d/100)
// Note: Actual ratio at 0% varies slightly by style (0.45-0.51)

// Padding usage scales with density
paddingUsage = round(
  stylePaddingUsage *
    paddingMaterialMultiplier *
    densityScalePaddingUsage(paddingDensity)
);
// where densityScalePaddingUsage(d) = 1/3 + 2/3 * (d/100)
// At 100% -> 1.0, at 50% -> 0.667, at 0% -> 0.333
```

### Weight Calculation

```typescript
// Weight = (base contribution + padding contribution) * piece multiplier
// Both scale with density, but less aggressively than material usage

pieceWeight = round2(
  (baseUsage * baseMaterialWeight * densityScaleWeight(baseDensity) +
    paddingUsage * paddingWeight * densityScaleWeight(paddingDensity)) *
    pieceMultiplier
);

// where densityScaleWeight(d) = 0.62 + 0.38 * (d/100)
// Note: Ironsilk has different padding weight scale (~0.82 at 0%)
```

### Durability Calculation

```typescript
// Durability uses multiplicative density factors
pieceDurability = round2(
  styleDuraBase *
    pieceMultiplier *
    baseMaterialDurability *
    paddingDurabilityMult *
    baseDensityFactor *
    paddingDensityFactor
);

// where:
// baseDensityFactor = 0.654 + 0.346 * (baseDensity/100)
// paddingDensityFactor = 0.793 + 0.207 * (paddingDensity/100)
// Piece multipliers: helm=0.8, torso=1.0, arms=0.6, legs=1.0

// Note: Multiplicative model has ~5% error at mixed densities like 50/50
```

---

## Key Data Structures

### ArmorStyleConfig (in armorStyles.ts)

```typescript
{
  baseMaterialUsage: PieceStats<number>,     // Material usage per piece at 100%
  paddingUsage: PieceStats<number>,          // Padding usage per piece at 100%
  pieceWeightMultipliers: PieceStats<number>, // Per-piece weight adjustments
  durabilityBase: number,                    // Torso durability at 100/100
  baseDefense: DefenseStats,                 // From 100/0 Ironfur sample
  baseDefenseDensityCoeffs: DefenseDensityCoeffs, // Per-type scaling
}
```

### PaddingMaterialConfig (in paddingMaterials.ts)

```typescript
{
  materialMultiplier: number,      // Usage multiplier vs Ironfur
  weight: number,                  // Weight per unit
  durabilityMultiplier: number,    // Durability multiplier vs Ironfur
  defense: DefenseStats,           // Defense at 100% (can be negative!)
  defenseDensityCoeffs: DefenseDensityCoeffs, // Per-type scaling
}
```

---

## Adding New Materials/Styles

### To Add a New Armor Style

1. Collect samples at 100/100 and 100/0 with Ironfur
2. Add to `data/armorStyles.ts`:
   - `baseMaterialUsage`: Copy from 100/100 sample's `pieceMaterialUsage.*.base`
   - `paddingUsage`: Copy from 100/100 sample's `pieceMaterialUsage.*.padding`
   - `durabilityBase`: Use the torso durability at 100/100
   - `baseDefense`: Use defense values from 100/0 Ironfur sample
   - `baseDefenseDensityCoeffs`: Calculate from 0/100 vs 100/0 samples
   - `pieceWeightMultipliers`: Derive by comparing calculated vs actual weights

### To Add a New Padding Material

1. Collect samples at 100/100 and 100/50 with the new padding (preferably Kallardian Norse)
2. Add to `data/paddingMaterials.ts`:
   - `defense`: Calculate as `D(100/100) - baseDefense`
   - `defenseDensityCoeffs`: Calculate from `D(100/0)` and `D(100/100)`
   - `materialMultiplier`: ratio of new padding usage / Ironfur padding usage
   - `weight`: Derive from weight difference between samples
   - `durabilityMultiplier`: ratio of new durability / Ironfur durability

---

## Deriving Values from Samples

### Defense Values (MOST RELIABLE)

1. Get 100/0 Ironfur sample for the armor style -> this is `baseDefense`
2. Get 0/100 Ironfur sample -> calculate `baseScale(0) = (D(0/100) - ironfurDefense) / baseDefense`
3. For new padding: `paddingDefense = D(100/100) - baseDefense`
4. `padScale(0) = (D(100/0) - baseDefense) / paddingDefense`

### Weight Coefficients

Kallardian Norse is the baseline (all piece multipliers = 1.0):

- **Plate Scales weight**: 0.01431 per unit
- **Arthropod Carapace weight**: 0.01082 per unit
- **Ironfur weight**: 0.0093 per unit
- **Ironsilk weight**: 0.00421 per unit

### Piece Weight Multipliers

For non-Kallardian styles, compare calculated vs actual weights:

```
pieceMultiplier = actualWeight / calculatedWeight
```

---

## Test Tolerances

Target accuracy: **+-0.01** for all values.

---

## Sample Count by Armor Style

| Armor Style      | Count | Density Range | Notes                                  |
| ---------------- | ----- | ------------- | -------------------------------------- |
| Kallardian Norse | 18    | 0-100 / 0-100 | Best coverage, used as baseline        |
| Risar Berserker  | 14    | 0-100 / 0-100 | Good coverage, multiple base materials |
| Khurite Splinted | 6     | 0-100 / 0-100 | Has 100/0 and 0/100 for Ironfur        |
| Ranger Armor     | 6     | 0-100 / 0-100 | Has 100/0 and 0/100 for Ironfur        |

---
