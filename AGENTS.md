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
- UPPER_SNAKE_CASE: constants (`PIECE_KEYS`, `DURABILITY_PIECE_MULTIPLIERS`)
- Descriptive names: `baseMaterialUsage`, `paddingDensity`

### Error Handling
- Throw descriptive errors for missing configurations
- Use `Partial<Record<...>>` for incomplete data maps with getter functions that throw

---

## Reverse-Engineered Formulas

### Material Usage
```typescript
// Padding usage scales with density and material multiplier
paddingUsage = round(basePadding * materialMultiplier * densityScale)
// where densityScale = 1/3 + 2/3 * (paddingDensity / 100)
// At 100% -> 1.0, at 50% -> 0.667
```

### Weight Calculation
```typescript
// Weight = (base contribution + padding contribution) * piece multiplier
pieceWeight = round2((baseUsage * baseMaterialWeight + paddingUsage * paddingWeight) * pieceMultiplier)
```

### Durability Calculation
```typescript
// Durability uses style base, piece ratio, padding multiplier, and density factor
pieceDurability = round2(styleDuraBase * pieceMultiplier * paddingDuraMult * densityFactor)
// where densityFactor = 0.834 + 0.166 * (paddingDensity / 100)
// Piece multipliers: helm=0.8, torso=1.0, arm=0.6, legs=1.0
```

### Defense Calculation
```typescript
// Defense is style-dependent base + padding contribution
setDefense = styleBaseDefense + paddingDefense * (paddingDensity / 100)
```

---

## Adding New Materials/Styles

### To Add a New Armor Style
1. Collect a sample with the new style at 100/100 density
2. Add to `data/armorStyles.ts`:
   - `baseMaterialUsage`: Copy from sample's `pieceMaterialUsage.*.base`
   - `paddingUsage`: Copy from sample's `pieceMaterialUsage.*.padding`
   - `durabilityBase`: Use the torso durability value
   - `baseDefense`: Calculate as `sampleDefense - paddingDefense` (Ironfur: blunt=16, pierce=14, slash=14)
   - `pieceWeightMultipliers`: Derive by comparing calculated vs actual weights

### To Add a New Base Material
1. Collect a sample using the new base material (preferably with Kallardian Norse + Ironfur)
2. Add to `data/baseMaterials.ts`:
   - `weight`: Derive from weight formula (see analysis below)
   - `durability`: Currently unused (durability is style-based)
   - `defense`: Currently unused (defense is style-based)

### To Add a New Padding Material
1. Collect two samples: same style with Ironfur vs new padding
2. Add to `data/paddingMaterials.ts`:
   - `materialMultiplier`: ratio of new padding usage / Ironfur padding usage
   - `weight`: Derive from weight difference between samples
   - `durabilityMultiplier`: ratio of new durability / Ironfur durability
   - `defense`: Calculate as `newSampleDefense - styleBaseDefense`

---

## Deriving Values from Samples

### Weight Coefficients
Kallardian Norse is the baseline (all piece multipliers = 1.0):
- **Plate Scales weight**: 0.01431 per unit
- **Arthropod Carapace weight**: 0.01082 per unit
- **Ironfur weight**: 0.0093 per unit
- **Ironsilk weight**: 0.00421 per unit

To derive a new base material weight from a Kallardian Norse sample:
```
baseWeight = (helmWeight - paddingUsage * 0.0093) / baseUsage
```

### Piece Weight Multipliers
For non-Kallardian styles, compare calculated vs actual weights:
```
pieceMultiplier = actualWeight / (baseUsage * baseWeight + paddingUsage * paddingWeight)
```

### Durability Base
The `durabilityBase` equals the torso durability at 100/100 density with Ironfur (duraMult=1.0).

### Ironsilk Material Multiplier
The multiplier is approximately 1.33, but rounding causes ±1 unit differences per piece.

---

## Test Tolerances

- **Numeric values** (weight, durability, defense): tolerance of 0.1
- **Material usage** (integer counts): tolerance of 1 unit (due to rounding)

---

## Known Limitations

1. **Density < 100%**: The 50% density sample was excluded due to inconsistencies. When adding new density samples, verify the formulas.

2. **Per-piece padding multipliers**: Ironsilk padding ratios vary slightly per piece (1.32-1.35), suggesting the game may use per-piece multipliers we haven't fully captured.

3. **Base material durability**: Currently unused. Durability appears to be purely style + padding based, but more samples may reveal base material effects.

4. **Defense by material type**: Defense values in `baseMaterials.ts` are not used. Defense is calculated from armor style's `baseDefense` + padding contribution.
