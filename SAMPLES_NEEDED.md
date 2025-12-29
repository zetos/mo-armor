# Samples Needed

This document tracks the samples we need to collect from the game to improve the accuracy of our armor calculator formulas.

---

## Samples Still Needed

### HIGH PRIORITY - To achieve theoretical ±0.01 tolerance

| Armor Style | Base Material | Padding | Base% | Pad% | Purpose |
| ----------- | ------------- | ------- | ----- | ---- | ------- |
|             |               |         |       |      |         |

### LOW PRIORITY - Additional validation samples

| Armor Style | Base Material | Padding | Base% | Pad% | Purpose |
| ----------- | ------------- | ------- | ----- | ---- | ------- |
|             |               |         |       |      |         |

### LOW PRIORITY - Additional base materials

| Armor Style | Base Material | Padding | Base% | Pad% | Purpose |
| ----------- | ------------- | ------- | ----- | ---- | ------- |
|             |               |         |       |      |         |

---

## Derived Values from Current Samples

### Defense Formula (VERIFIED - +-0.01 accuracy)

```
defense = baseDefense * baseScale(baseDensity) + paddingDefense * padScale(paddingDensity)

baseScale(d) = a + b * (d/100)  // per-style, per-damage-type
padScale(d) = a + b * (d/100)   // per-padding, per-damage-type
```

**Per-style baseDefense (from 100/0 Ironfur samples):**

- Kallardian Norse: { blunt: 37.2, pierce: 35.1, slash: 31.0 }
- Risar Berserker: { blunt: 41.08, pierce: 32.84, slash: 34.56 }
- Khurite Splinted: { blunt: 47.97, pierce: 41.22, slash: 38.28 }
- Ranger Armor: { blunt: 36.45, pierce: 33.26, slash: 37.04 }

**Per-style baseDefenseDensityCoeffs:**

- Kallardian Norse: blunt a=0.8737, pierce a=0.8761, slash a=0.8742
- Risar Berserker: blunt a=0.8513, pierce a=0.8280, slash a=0.8533
- Khurite Splinted: blunt a=0.7649, pierce a=0.7467, slash a=0.7555
- Ranger Armor: blunt a=0.8453, pierce a=0.8431, slash a=0.8737

**Padding defense values at 100%:**

- Ironfur: { blunt: 10.67, pierce: 6.50, slash: 6.60 }
- Ironsilk: { blunt: -0.93, pierce: 10.10, slash: 7.80 } (reduces blunt!)
- Guard Fur: { blunt: 5.39, pierce: 5.30, slash: 5.64 }
- Bloodsilk: { blunt: 0.57, pierce: 11.50, slash: 9.48 }

### Weight Formula (needs refinement)

```
weight = (baseUsage * baseWeight * baseWeightScale(baseDensity) +
          padUsage * padWeight * padWeightScale(paddingDensity)) * pieceMultiplier

baseWeightScale(d) = 0.622 + 0.378 * (d/100)
padWeightScale(d) = varies by padding material
```

**Padding weight scales at 0%:**

- Ironfur: 0.622 (same as base)
- Ironsilk: 0.818 (different!)
