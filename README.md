# Mortal Online 2 Armor Calculator

A TypeScript proof of concept that reproduces armor statistics from Mortal
Online 2. The formulas and coefficients were inferred from 174 in-game samples,
then checked against those samples with automated regression tests.

The calculator returns:

- total and per-piece weight;
- total and per-piece durability;
- blunt, pierce, and slash defense;
- total and per-piece base and padding material usage.

> [!IMPORTANT]
> This is an empirical model, not an official formula published by Star Vault.
> It is reliable for the sampled styles, materials, and density range, but game
> updates or combinations outside the sample data may produce different results.

## Quick Start

This project uses [Bun](https://bun.sh).

```bash
bun install
bun test
bunx tsc --noEmit
```

Call `calculateSetStatus` with an armor style, a base material, a padding
material, and both densities:

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
```

The result is:

```typescript
{
  armorStyle: 'Kallardian Norse',
  base: 'Plate Scales',
  padding: 'Ironfur',
  baseDensity: 100,
  paddingDensity: 100,
  setWeight: 7.4,
  setDura: 1975.52,
  setMaterialUsage: { base: 254, padding: 404 },
  setDefense: { blunt: 47.87, pierce: 41.6, slash: 37.6 },
  pieceWeight: {
    helm: 0.89,
    torso: 2.37,
    rightArm: 0.96,
    leftArm: 0.96,
    legs: 2.22,
  },
  pieceDurability: {
    helm: 395.1,
    torso: 493.88,
    rightArm: 296.33,
    leftArm: 296.33,
    legs: 493.88,
  },
  pieceMaterialUsage: {
    helm: { base: 31, padding: 48 },
    torso: { base: 81, padding: 130 },
    rightArm: { base: 33, padding: 52 },
    leftArm: { base: 33, padding: 52 },
    legs: { base: 76, padding: 122 },
  },
}
```

The intended density range is 0 to 100. The function does not clamp or validate
densities, so callers are responsible for supplying values in that range.

## Configured Data

### Armor Styles

| Style | Model characteristics |
| --- | --- |
| Kallardian Norse | Lower-weight style with strong pierce defense |
| Risar Berserker | Soft armor style with strong blunt defense |
| Khurite Splinted | Heavier style with higher base defense and material usage |
| Ranger Armor | Lower-weight style with strong slash defense |

### Base Materials

- Plate Scales
- Arthropod Carapace
- Horned Scales
- Keeled Scales
- Leptoid Scales
- Placoid Scales
- Pansar Scales

### Padding Materials

- Ironfur
- Ironsilk
- Ironwool
- Bloodsilk
- Guard Fur

`Ganoid Scales`, base variants of the fiber materials, `Quality Leather`, and
`Raw Hide` exist in the public type unions but are not configured. Passing one
of them in an unsupported role throws a descriptive error until enough sample
data is available to calibrate it.

## Calculation Model

All coefficients are empirical. They live in:

- [`src/data/armorStyles.ts`](./src/data/armorStyles.ts) for style and piece
  coefficients;
- [`src/data/baseMaterials.ts`](./src/data/baseMaterials.ts) for base material
  coefficients;
- [`src/data/paddingMaterials.ts`](./src/data/paddingMaterials.ts) for padding
  coefficients.

The implementation is in [`src/calculate.ts`](./src/calculate.ts).

### Notation

| Symbol | Meaning |
| --- | --- |
| $d_b$, $d_p$ | Base and padding density percentages |
| $x=d_b/100$, $y=d_p/100$ | Densities normalized to the range 0 to 1 |
| $s$ | Selected armor style |
| $m$ | Selected base material |
| $q$ | Selected padding material |
| $i$ | Armor piece: helm, torso, right arm, left arm, or legs |
| $t$ | Damage type: blunt, pierce, or slash |
| $R_2(z)$ | Round $z$ to two decimal places |

Many properties use the same linear density scale:

$$
L(d; a,b)=a+b\frac{d}{100}
$$

The coefficients $a$ and $b$ depend on the property, style, material, and in
some cases damage type. They are not interchangeable.

### Defense

For each damage type $t$, defense combines a scaled base-material contribution
with a scaled padding contribution:

$$
D_t = R_2\left(
\max\left(0,
B_{s,m,t}L(d_b; a^{B}_{s,m,t},b^{B}_{s,m,t})
+P_{q,t}L(d_p; a^{P}_{q,t},b^{P}_{q,t})
\right)
\right)
$$

Where:

- $B_{s,m,t}$ is the base defense for the style and base-material combination;
- $P_{q,t}$ is the padding material's defense contribution;
- the two pairs of density coefficients independently scale base and padding;
- the combined value is floored at zero and then rounded, so a padding material
  may have a negative contribution without producing negative final defense.

Plate Scales uses the armor style's default defense configuration. Other base
materials can override both base defense and density scaling for each style.

### Set Weight

Set weight is a calibrated additive model:

$$
W_{\mathrm{set}}=R_2\left(
W^{\min}_{s}
+O^{\min}_{q}
+O^{\min}_{m}
+C^{b}_{s}M^{b}_{m}x
+C^{p}_{q}y
\right)
$$

Where:

- $W^{\min}_{s}$ is the style's minimum set weight;
- $O^{\min}_{q}$ and $O^{\min}_{m}$ are padding and base-material minimum
  weight offsets;
- $C^{b}_{s}$ is the style's base-density contribution;
- $M^{b}_{m}$ adjusts that contribution for the base material;
- $C^{p}_{q}$ is the padding-density contribution.

Weight is not calculated from material usage. The game samples fit this
independent additive model more accurately.

### Piece Weight

Each piece also has its own independently calibrated additive model. First,
the style establishes a baseline minimum-weight total:

$$
I_s=\sum_i w^{\min}_{s,i},
\qquad
r_{s,i}=\frac{w^{\min}_{s,i}}{I_s}
$$

Then the weight of piece $i$ is:

$$
w_i=R_2\left(
w^{\min}_{s,i}
-\left(0.5-O^{\min}_{q}\right)r_{s,i}
+O^{\min}_{m}r_{s,i}
+C^{b}_{s,i}M^{b}_{m}x
+C^{p}_{s,i}R^{p}_{q}y
\right)
$$

$R^{p}_{q}$ is the padding material's per-piece contribution ratio. The
constant $0.5$ is the calibrated Ironfur minimum-weight offset.

The set-weight and piece-weight formulas are separate calibrations. Do not
derive one by summing or distributing the other; doing so can change results
because their coefficients and rounding points differ.

### Durability

The style and base material select three durability coefficients:
$A^{\min}_{s,m}$, $A^{b}_{s,m}$, and $A^{p}_{s,m}$. Padding supplies a minimum
multiplier $M^{\min}_{s,q}$ and a padding multiplier $M^{p}_{q}$.

Durability for piece $i$ is:

$$
H_i=R_2\left[
\left(
A^{\min}_{s,m}M^{\min}_{s,q}
+A^{b}_{s,m}x
+A^{p}_{s,m}M^{p}_{q}y
\right)K_i
\right]
$$

The fixed piece multipliers are:

| Piece | $K_i$ |
| --- | ---: |
| Helm | 0.8 |
| Torso | 1.0 |
| Right arm | 0.6 |
| Left arm | 0.6 |
| Legs | 1.0 |

Total set durability sums the already-rounded piece values and rounds once
more:

$$
H_{\mathrm{set}}=R_2\left(\sum_i H_i\right)
$$

Padding minimum multipliers are style-specific where sample data is available;
padding-density multipliers are shared across styles.

### Material Usage

Base material usage for piece $i$ is:

$$
U^{b}_i=\operatorname{round}\left[
N^{b}_{s,i}
M^{u}_{s,m}(d_b)
L(d_b;a^{u}_{s},b^{u}_{s})
\right]
$$

Where $N^{b}_{s,i}$ is the style's baseline usage and
$M^{u}_{s,m}(d_b)$ is either a fixed material multiplier or another calibrated
linear scale:

$$
M^{u}_{s,m}(d_b)=a^{m}_{s,m}+b^{m}_{s,m}\frac{d_b}{100}
$$

Padding usage uses a shared density scale:

$$
U^{p}_i=\operatorname{round}\left[
N^{p}_{s,i}M^{u}_{q}
\left(\frac{1}{3}+\frac{2}{3}\frac{d_p}{100}\right)
\right]
$$

Material totals sum the independently rounded piece values:

$$
U^{b}_{\mathrm{set}}=\sum_i U^{b}_i,
\qquad
U^{p}_{\mathrm{set}}=\sum_i U^{p}_i
$$

This rounding order matters. Rounding only after summing the unrounded piece
values can produce a different total.

## Accuracy

The test suite compares all 174 collected samples against these tolerances:

| Statistic | Allowed difference |
| --- | ---: |
| Set weight | 0.01 kg |
| Piece weight | 0.01 kg |
| Defense | 0.01 |
| Set and piece durability | 1.0 |
| Set and piece material usage | 2 units |

These are regression tolerances for the current sample set, not guarantees for
unobserved combinations. See [`test/calculate.test.ts`](./test/calculate.test.ts)
for the assertions and [`samples/`](./samples/) for the source data.

## Project Structure

```text
.
|-- src/
|   |-- index.ts                  # Public exports
|   |-- calculate.ts              # Calculation and rounding order
|   |-- types.ts                  # Public TypeScript types and piece keys
|   `-- data/
|       |-- armorStyles.ts        # Style and per-piece coefficients
|       |-- baseMaterials.ts      # Base-material coefficients
|       `-- paddingMaterials.ts   # Padding-material coefficients
|-- samples/                      # 174 in-game regression samples
|-- test/
|   `-- calculate.test.ts         # Sample-driven regression tests
`-- scripts/
    |-- parseSample.ts            # Convert raw/API data into sample objects
    `-- analyzeRounding.ts        # Inspect piece-weight rounding behavior
```

## Development

```bash
# Run all regression tests
bun test

# Run one matching group
bun test --test-name-pattern "Kallardian Norse"

# Generate a coverage report
bun test --coverage

# Type-check without emitting files
bunx tsc --noEmit

# Parse sample input
bun scripts/parseSample.ts sample.txt

# Analyze weight rounding
bun scripts/analyzeRounding.ts
```

When changing a formula or coefficient, update its regression samples at the
same time and run both `bun test` and `bunx tsc --noEmit`. Preserve the order of
operations and rounding in `src/calculate.ts`; algebraically equivalent-looking
expressions can behave differently at the configured tolerances.

## Contributing

Contributions with additional in-game samples are welcome:

1. Collect data in the format accepted by `scripts/parseSample.ts`.
2. Run `bun scripts/parseSample.ts sample.txt`.
3. Add the parsed result to the appropriate file in `samples/`.
4. Calibrate the relevant configuration if the sample introduces a new
   material or exposes a coefficient mismatch.
5. Run the tests and type checker.

## License and Acknowledgments

This project is for educational and research purposes. Mortal Online 2 is the
property of Star Vault AB.

- Runtime: [Bun](https://bun.sh)
- Game data: Mortal Online 2 by Star Vault AB
- Sample source: [Mortal Data Workbench](https://mortaldata.com/workbench)
