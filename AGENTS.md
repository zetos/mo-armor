# Armor Calculator Agent Guide

TypeScript/Bun calculator derived from Mortal Online 2 sample data.

## Commands

```bash
bun install --frozen-lockfile
bun test
bun test --coverage
bun test --test-name-pattern "Sample 1:"
bunx tsc --noEmit
bun scripts/parseSample.ts sample.txt
bun scripts/analyzeRounding.ts
```

## Structure

- `src/calculate.ts`: formulas and public calculator
- `src/types.ts`: public types and fixed piece keys
- `src/data/`: style and material coefficients
- `samples/`: 174 regression samples across four armor styles
- `test/calculate.test.ts`: sample-driven regression tests
- `scripts/`: sample parser and weight analysis

Configured base materials: Plate, Horned, Keeled, Leptoid, Placoid, and Pansar Scales; Arthropod Carapace.

Configured padding materials: Ironfur, Ironsilk, Ironwool, Bloodsilk, and Guard Fur.

Some names in the public material unions are not configured and intentionally throw descriptive errors.

## Formula Invariants

- Density scale: `a + b * density / 100`.
- Defense combines style/material base defense with padding defense, then floors the total at zero.
- Set and piece weights use independently calibrated additive formulas; never derive one from the other.
- Durability uses material/style coefficients, padding multipliers, and piece multipliers.
- Material usage is independently rounded per piece before totals are summed.
- Preserve arithmetic and rounding order; calibrated decimal literals must not be algebraically derived.

Current tolerances: weight and defense `0.01`, durability `1.0`, material usage `2` units.

## Conventions

- TypeScript strict mode; type-only imports where applicable.
- Two spaces, single quotes, trailing commas.
- Prefer immutable `map`/`reduce` transformations over mutable iteration.
- Keep empirical data explicit and labeled; avoid generic configuration abstractions.
- Update runtime configuration and regression samples together.
- Run tests and type checking after every formula or coefficient change.
