# Samples Needed

This document tracks the samples we need to collect from the game to improve the accuracy of our armor calculator formulas.

## Current Status

**Good news!** We now have all the critical Ironfur 100/0 and 0/100 samples for all 4 armor styles. The defense formula is now accurate to +-0.01.

**Remaining issues:**
- Weight scaling at low densities (especially for Ironsilk)
- Base material usage at 0% density shows style-specific variation
- Durability at mixed densities has ~5% error due to non-multiplicative behavior

---

## Samples We Now Have

### Kallardian Norse (18 samples)
- 100/100, 100/0, 0/100, 100/50, 50/100, 50/50, 0/50, 50/0, 100/10, 88/8 with Ironfur
- 100/100, 100/0, 0/100, 0/0, 100/50, 100/90 with Ironsilk

### Risar Berserker (14 samples)
- 100/100 with Arthropod Carapace + Ironfur
- 100/100, 100/50, 100/20 with Guard Fur
- 100/100 with Arthropod Carapace + Guard Fur
- 100/100 with Horned Scales + Guard Fur
- 100/100, 100/50 with Bloodsilk
- 100/0, 0/100, 50/50 with Ironfur
- 100/0, 0/0 with Ironsilk

### Khurite Splinted (6 samples)
- 100/100, 100/0, 0/100 with Ironfur
- 0/0, 100/0, 0/100 with Ironsilk

### Ranger Armor (6 samples)
- 100/100, 100/0, 0/100 with Ironfur
- 0/0, 0/100, 100/0 with Ironsilk

---

## Samples Still Needed

### LOW PRIORITY - To verify weight formula at low densities

| Armor Style | Base Material | Padding | Base% | Pad% | Purpose |
|-------------|---------------|---------|-------|------|---------|
| Kallardian Norse | Plate Scales | Ironfur | 0 | 0 | Verify weight at 0/0 |
| Risar Berserker | Plate Scales | Ironfur | 100 | 100 | Complete Ironfur set |

### LOW PRIORITY - Additional base materials

| Armor Style | Base Material | Padding | Base% | Pad% | Purpose |
|-------------|---------------|---------|-------|------|---------|
| Kallardian Norse | Arthropod Carapace | Ironfur | 100 | 100 | Verify base material offset |
| Kallardian Norse | Horned Scales | Ironfur | 100 | 100 | Verify base material offset |

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

### Durability Formula (has ~5% error at mixed densities)

```
durability = duraBase * pieceMultiplier * baseMaterialDuraMult * paddingDuraMult * 
             baseDensityFactor(baseDensity) * paddingDensityFactor(paddingDensity)

baseDensityFactor(d) = 0.654 + 0.346 * (d/100)
paddingDensityFactor(d) = 0.793 + 0.207 * (d/100)
```

Note: The multiplicative model works perfectly for 100/x and x/100 cases but has ~5% error for mixed densities like 50/50.

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
