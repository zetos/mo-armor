# Samples Needed

This document tracks the samples we need to collect from the game to improve the accuracy of our armor calculator formulas.

## Current Issues

Based on test failures, we have the following issues to resolve:

### 1. Defense Calculation (Khurite Splinted)
- Sample 3: Khurite Splinted + Plate Scales + Ironfur @ 100/100
  - pierce: expected 47.72, got 52.77 (diff: 5.05)
- The defense formula needs per-style calibration

### 2. Weight Calculation at Non-100% Densities
- Multiple samples show weight errors of 0.15-1.1
- The weight density scaling formula needs refinement

### 3. 0% Density Samples
- Sample 22: Risar Berserker @ 0/0 has major discrepancies
  - Material usage: expected base=130, got 147
  - Durability off by ~27%
  - Weight off by ~0.85

### 4. Base Material Usage at 0% Density
- Current formula: `0.5 + 0.5 * (density/100)` gives 0.5 at 0%
- Actual data suggests ~0.447 at 0% density

---

## Samples Needed by Priority

### HIGH PRIORITY - To fix defense per armor style

We need 100/0 (full base, zero padding) samples with Ironfur for each armor style to isolate the base defense values:

| Armor Style | Base Material | Padding | Base% | Pad% | Status |
|-------------|---------------|---------|-------|------|--------|
| Kallardian Norse | Plate Scales | Ironfur | 100 | 0 | NEEDED |
| Risar Berserker | Plate Scales | Ironfur | 100 | 0 | NEEDED |
| Khurite Splinted | Plate Scales | Ironfur | 100 | 0 | NEEDED |
| Ranger Armor | Plate Scales | Ironfur | 100 | 0 | NEEDED |

### HIGH PRIORITY - To fix Ironfur defense coefficients

We need 0/100 (zero base, full padding) samples with Ironfur:

| Armor Style | Base Material | Padding | Base% | Pad% | Status |
|-------------|---------------|---------|-------|------|--------|
| Kallardian Norse | Plate Scales | Ironfur | 0 | 100 | NEEDED |
| Risar Berserker | Plate Scales | Ironfur | 0 | 100 | NEEDED |
| Khurite Splinted | Plate Scales | Ironfur | 0 | 100 | NEEDED |
| Ranger Armor | Plate Scales | Ironfur | 0 | 100 | NEEDED |

### MEDIUM PRIORITY - To verify weight formula

Mid-density samples to verify weight scaling:

| Armor Style | Base Material | Padding | Base% | Pad% | Status |
|-------------|---------------|---------|-------|------|--------|
| Kallardian Norse | Plate Scales | Ironfur | 50 | 0 | NEEDED |
| Kallardian Norse | Plate Scales | Ironfur | 0 | 50 | NEEDED |
| Risar Berserker | Plate Scales | Ironfur | 50 | 50 | NEEDED |

### LOW PRIORITY - Additional base materials

To verify base material properties with different armor styles:

| Armor Style | Base Material | Padding | Base% | Pad% | Status |
|-------------|---------------|---------|-------|------|--------|
| Kallardian Norse | Arthropod Carapace | Ironfur | 100 | 100 | NEEDED |
| Kallardian Norse | Horned Scales | Ironfur | 100 | 100 | NEEDED |
| Khurite Splinted | Arthropod Carapace | Ironfur | 100 | 100 | NEEDED |

---

## How to Collect Samples

1. Craft the armor set with the specified materials and densities
2. Record ALL values from the crafting/inspection UI:
   - Total weight, durability, and defense (blunt/pierce/slash)
   - Per-piece weight, durability, and material usage
3. Add the sample to the appropriate file in `samples/`:
   - `risarBerserker.ts`
   - `kallardianNorse.ts`
   - `khuriteSplinted.ts`
   - `rangerArmor.ts`

---

## Sample Template

```typescript
{
  armorStyle: 'ARMOR_STYLE',
  base: 'BASE_MATERIAL',
  padding: 'PADDING_MATERIAL',
  baseDensity: BASE_DENSITY,
  paddingDensity: PADDING_DENSITY,
  setDefense: {
    blunt: 0,
    pierce: 0,
    slash: 0,
  },
  setWeight: 0,
  pieceWeight: {
    helm: 0,
    torso: 0,
    rightArm: 0,
    leftArm: 0,
    legs: 0,
  },
  setDura: 0,
  pieceDurability: {
    helm: 0,
    torso: 0,
    rightArm: 0,
    leftArm: 0,
    legs: 0,
  },
  setMaterialUsage: {
    base: 0,
    padding: 0,
  },
  pieceMaterialUsage: {
    helm: { base: 0, padding: 0 },
    torso: { base: 0, padding: 0 },
    rightArm: { base: 0, padding: 0 },
    leftArm: { base: 0, padding: 0 },
    legs: { base: 0, padding: 0 },
  },
}
```

---

## Current Sample Coverage

| Armor Style | Count | Density Range | Notes |
|-------------|-------|---------------|-------|
| Risar Berserker | 10 | 0-100 / 0-100 | Good coverage, needs Ironfur 100/0 |
| Kallardian Norse | 13 | 0-100 / 0-100 | Good coverage, needs Ironfur 100/0 and 0/100 |
| Khurite Splinted | 4 | 0-100 / 0-100 | Needs Ironfur samples |
| Ranger Armor | 4 | 0-100 / 0-100 | Needs Ironfur samples |
