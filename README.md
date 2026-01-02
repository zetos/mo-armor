# Mortal Online 2 - Armor Calculator (PoC)

A proof-of-concept calculator for armor statistics in Mortal Online 2. This project reverse-engineers the game's armor calculation formulas through empirical data collection and statistical analysis.

## Features

- **Accurate armor calculations** for weight, durability, defense, and material usage
- **Multiple armor styles** supported: Kallardian Norse, Risar Berserker, Khurite Splinted, Ranger Armor
- **Comprehensive material database** including base materials (scales, furs) and padding materials
- **Density scaling** support (0-100% for both base and padding materials)
- **Type-safe TypeScript implementation** with strict mode enabled

## Installation

This project uses [Bun](https://bun.sh) as the runtime.

```bash
# Install dependencies
bun install

# Run type checking
bunx tsc --noEmit

# Run tests
bun test
```

## Usage

### Basic Example

```typescript
import { calculateSetStatus } from './src';

const armorStats = calculateSetStatus({
  armorStyle: 'Kallardian Norse',
  base: 'Plate Scales',
  padding: 'Ironfur',
  baseDensity: 100,
  paddingDensity: 100,
});

console.log(armorStats);
// Output:
// {
//   setWeight: 7.4,
//   setDura: 1975.5,
//   setDefense: { blunt: 47.87, pierce: 41.6, slash: 37.6 },
//   pieceWeight: { helm: 0.89, torso: 2.37, ... },
//   // ... more stats
// }
```

### Supported Armor Styles

- **Kallardian Norse** - Soft armor, best at pierce
- **Risar Berserker** - Soft armor, best at blunt defense
- **Khurite Splinted** - Padded armor, Least weight efficient (18.32 defense/kg), but higher defense
- **Ranger Armor** - Soft armor, best at slashing

### Supported Materials

**Base Materials:**

- Plate Scales, Arthropod Carapace, Horned Scales
- Ironfur, Ironsilk, Ironwool, Bloodsilk
- Leptoid Scales, Keeled Scales, Pansar Scales, Placoid Scales

**Padding Materials:**

- Ironfur (baseline)
- Ironsilk (reduces blunt defense, increases pierce/slash)
- Guard Fur
- Bloodsilk
- Ironwool

## How It Works

The calculator uses reverse-engineered formulas derived from 174 in-game samples:

### Defense Calculation

```
defense[type] = (baseDefense[type] + materialOffset[type]) × baseScale(baseDensity)
                + paddingDefense[type] × padScale(paddingDensity)
```

Where `scale(density) = a + b × (density/100)` with per-armor-style coefficients.

### Weight Calculation

```
pieceWeight = (baseUsage × baseWeight × baseScale +
               paddingUsage × paddingWeight × padScale) × pieceMultiplier
```

### Durability Calculation

```
pieceDurability = ((baseMin × padMinMult) +
                   (baseDensityContrib × baseDensity/100) +
                   (padContrib × padPadMult × paddingDensity/100))
                  × pieceMultiplier × baseMaterialDuraMult
```

**Key insight**: Each padding material has **style-specific** `minMult` values that vary slightly across armor styles, while `padMult` is consistent. This allows for ±1.0 accuracy.

## Accuracy

The calculator achieves the following accuracy against game data:

- **Defense**: ±0.01 (100% accurate with style-specific coefficients)
- **Weight**: ±0.01 kg (100% accurate with additive model)
- **Piece Weight**: ±0.01 kg (100% accurate with per-piece additive model)
- **Durability**: ±1.0 (100% accurate with style-specific durability multipliers)
- **Material Usage**: ±2 units (rounding variance)

See [AGENTS.md](./AGENTS.md) for detailed formula documentation.

## Project Structure

```
armor/
├── src/
│   ├── index.ts              # Main exports
│   ├── calculate.ts          # Core calculation logic
│   ├── types.ts              # TypeScript type definitions
│   └── data/
│       ├── armorStyles.ts    # Armor style configurations
│       ├── baseMaterials.ts  # Base material properties
│       └── paddingMaterials.ts # Padding material properties
├── test/
│   └── calculate.test.ts     # Comprehensive test suite
├── samples/                  # Game data samples (174 samples)
│   ├── kallardianNorse.ts   # Kallardian Norse samples
│   ├── risarBerserker.ts    # Risar Berserker samples
│   ├── khuriteSplinted.ts   # Khurite Splinted samples
│   └── rangerArmor.ts       # Ranger Armor samples
└── scripts/
    └── parseSample.ts        # Utility to parse raw game data
```

## Development

### Running Tests

```bash
# Run all tests
bun test

# Run with pattern matching
bun test --test-name-pattern "Kallardian Norse"
```

### Type Checking

```bash
bunx tsc --noEmit
```

### Adding New Materials

See [AGENTS.md](./AGENTS.md) for detailed instructions on adding new armor styles or materials.

## Contributing

This is a proof-of-concept project for reverse-engineering MO2's armor system. Contributions are welcome!

To add new samples:

1. Collect in-game data using the format in `sample.txt`
2. Run `bun scripts/parseSample.ts sample.txt`
3. Add the parsed data to the appropriate sample file
4. Update the data configurations if needed

## License

This project is for educational and research purposes. Mortal Online 2 is property of Star Vault AB.

## Acknowledgments

- Built with [Bun](https://bun.sh) - Fast all-in-one JavaScript runtime
- Data collected from Mortal Online 2 by Star Vault AB
- Sample data retrieved using [Mortal Data Workbench](https://mortaldata.com/workbench) - API service for Mortal Online 2
