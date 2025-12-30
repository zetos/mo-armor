# TASKS.md - Material Expansion Roadmap

This file tracks the addition of new base materials and padding materials to the armor calculator.

## Status Legend
- ⏳ **Not Started**
- 🚧 **In Progress**
- ✅ **Complete**
- ❌ **Blocked**

## Using the Sampler

To collect samples for new materials, use the **sampler subagent** via the Task tool:

```
Task(subagent_type="sampler", prompt="Fetch samples for [Armor Style] with [Base Material] and [Padding Material] at densities [X/Y]...")
```

The sampler will:
1. Fetch armor calculation data from the MortalData API
2. Parse the response into the standard JSON format
3. Return the samples for adding to the appropriate sample file

**Critical Density Combinations Needed:**
- 0/0 (base 0%, padding 0%)
- 100/0 (base 100%, padding 0%)
- 0/100 (base 0%, padding 100%)
- 100/100 (base 100%, padding 100%)
- 50/50 (for validation)

---

## Phase 1: Horned Scales (Base Material) ✅

**Status:** ✅ Complete  
**Priority:** High (already has partial config)

Horned Scales has been fully configured and validated with 16 new samples across all 4 armor styles.

### 1.1 Collect Horned Scales Samples
**Goal:** Gather corner samples for all 4 armor styles using Ironfur padding.

- [x] Kallardian Norse + Horned Scales + Ironfur @ 0/0, 100/0, 0/100, 100/100
- [x] Risar Berserker + Horned Scales + Ironfur @ 0/0, 100/0, 0/100, 100/100
- [x] Khurite Splinted + Horned Scales + Ironfur @ 0/0, 100/0, 0/100, 100/100
- [x] Ranger Armor + Horned Scales + Ironfur @ 0/0, 100/0, 0/100, 100/100
- [x] Add samples to appropriate files in `samples/`

### 1.2 Validate Defense Configuration
**Goal:** Verify or update defense coefficients for Horned Scales.

- [x] Compare calculated vs actual defense values
- [x] Existing `defenseConfig` was correct - no updates needed
- [x] Verify defense passes at ±0.01 tolerance

### 1.3 Validate Weight Configuration
**Goal:** Add/verify weight coefficients for Horned Scales.

- [x] Derive `additiveWeightConfig` (minWeightOffset: -0.25, baseContribMult: 0.821)
- [x] Add `additiveWeightConfig` to Horned Scales in `baseMaterials.ts`
- [x] Update `calculate.ts` to apply base material's weight config to piece weights
- [x] Verify set weight passes at ±0.01 tolerance

### 1.4 Validate Durability Configuration
**Goal:** Verify durability coefficients for Horned Scales.

- [x] Compare calculated vs actual durability values
- [x] Existing `durabilityConfig` was correct - no updates needed
- [x] Verify durability passes at ±16.0 tolerance

### 1.5 Run Full Test Suite
**Goal:** Ensure Horned Scales passes all tests.

- [x] Run `bun test` - 1891 tests passing
- [x] No tolerance adjustments needed

---

## Phase 2: Arthropod Carapace (Base Material) ✅

**Status:** ✅ Complete  
**Priority:** High (already has partial config)

Arthropod Carapace has been fully configured and validated with 16 new samples across all 4 armor styles.

### 2.1 Collect Arthropod Carapace Samples
**Goal:** Gather corner samples for all 4 armor styles using Ironfur padding.

- [x] Kallardian Norse + Arthropod Carapace + Ironfur @ 0/0, 100/0, 0/100, 100/100
- [x] Risar Berserker + Arthropod Carapace + Ironfur @ 0/0, 100/0, 0/100, 100/100
- [x] Khurite Splinted + Arthropod Carapace + Ironfur @ 0/0, 100/0, 0/100, 100/100
- [x] Ranger Armor + Arthropod Carapace + Ironfur @ 0/0, 100/0, 0/100, 100/100
- [x] Add samples to appropriate files in `samples/`

### 2.2 Validate Defense Configuration
**Goal:** Verify or update defense coefficients.

- [x] Compare calculated vs actual defense values
- [x] Added `defenseConfig` for Ranger Armor (was missing)
- [x] Existing configs for Risar Berserker, Kallardian Norse, Khurite Splinted were correct
- [x] Verify defense passes at ±0.01 tolerance

### 2.3 Validate Weight Configuration
**Goal:** Add/verify weight coefficients.

- [x] Derived `additiveWeightConfig` (minWeightOffset: 0.6, baseContribMult: 1.4286)
- [x] Added `additiveWeightConfig` to Arthropod Carapace in `baseMaterials.ts`
- [x] Removed legacy `weightConfig` (no longer needed with additive model)
- [x] Verify set weight passes at ±0.01 tolerance

### 2.4 Validate Durability Configuration
**Goal:** Verify durability coefficients.

- [x] Compare calculated vs actual durability values
- [x] Existing `durabilityConfig` was correct - no updates needed
- [x] Verify durability passes at ±16.0 tolerance

### 2.5 Run Full Test Suite
**Goal:** Ensure Arthropod Carapace passes all tests.

- [x] Run `bun test` - 2323 tests passing (up from 1891 before adding Arthropod Carapace samples)
- [x] No tolerance adjustments needed

---

## Phase 3: Guard Fur (Padding Material) ✅

**Status:** ✅ Complete  
**Priority:** Medium (has partial config in SHARED_PADDING_CONFIG)

Guard Fur has been fully validated with 8 new samples across 2 armor styles (Kallardian Norse, Risar Berserker).

### 3.1 Collect Guard Fur Samples
**Goal:** Gather samples using Plate Scales base material.

- [x] Kallardian Norse + Plate Scales + Guard Fur @ 0/0, 100/0, 0/100, 100/100
- [x] Risar Berserker + Plate Scales + Guard Fur @ 0/0, 100/0, 0/100, 100/100
- [x] Add samples to appropriate files in `samples/`

### 3.2 Validate Defense Configuration
**Goal:** Verify defense coefficients for Guard Fur.

- [x] Compare calculated vs actual defense values
- [x] Existing `SHARED_PADDING_CONFIG` defense values were correct - no updates needed
- [x] Verify defense passes at ±0.01 tolerance

### 3.3 Validate Weight Configuration
**Goal:** Verify weight coefficients for Guard Fur.

- [x] Verify `additiveWeightConfig` values (minWeightOffset: 0.4, padContrib: 1.2, padContribRatio: 0.8571)
- [x] Existing `STYLE_WEIGHT_CONFIGS` were correct - no updates needed
- [x] Verify set weight and piece weight pass at ±0.01 tolerance

### 3.4 Validate Durability Configuration
**Goal:** Verify durability multipliers for Guard Fur.

- [x] Compare calculated vs actual durability values
- [x] Existing `durabilityMults` were correct - no updates needed
- [x] Verify durability passes at ±16.0 tolerance

### 3.5 Run Full Test Suite
**Goal:** Ensure Guard Fur passes all tests.

- [x] Run `bun test` - 2755 tests passing (up from 2323)

---

## Phase 4: Bloodsilk (Padding Material) ✅

**Status:** ✅ Complete  
**Priority:** Medium (has partial config in SHARED_PADDING_CONFIG)

Bloodsilk has been fully validated with 8 new samples across 2 armor styles (Kallardian Norse, Risar Berserker).

### 4.1 Collect Bloodsilk Samples
**Goal:** Gather samples using Plate Scales base material.

- [x] Kallardian Norse + Plate Scales + Bloodsilk @ 0/0, 100/0, 0/100, 100/100
- [x] Risar Berserker + Plate Scales + Bloodsilk @ 0/0, 100/0, 0/100, 100/100
- [x] Add samples to appropriate files in `samples/`

### 4.2 Validate Defense Configuration
**Goal:** Verify defense coefficients for Bloodsilk.

- [x] Compare calculated vs actual defense values
- [x] Existing `SHARED_PADDING_CONFIG` defense values were correct - no updates needed
- [x] Verify defense passes at ±0.01 tolerance

### 4.3 Validate Weight Configuration
**Goal:** Verify weight coefficients for Bloodsilk.

- [x] Verify `additiveWeightConfig` values (minWeightOffset: 0.1, padContrib: 0.6, padContribRatio: 0.4286)
- [x] Existing `STYLE_WEIGHT_CONFIGS` were correct - no updates needed
- [x] Verify set weight and piece weight pass at ±0.01 tolerance

### 4.4 Validate Durability Configuration
**Goal:** Verify durability multipliers for Bloodsilk.

- [x] Compare calculated vs actual durability values
- [x] Existing `durabilityMults` were correct - no updates needed
- [x] Verify durability passes at ±16.0 tolerance

### 4.5 Run Full Test Suite
**Goal:** Ensure Bloodsilk passes all tests.

- [x] Run `bun test` - 2755 tests passing

---

## Phase 5: Keeled Scales (Base Material) ✅

**Status:** ✅ Complete  
**Priority:** Low (not configured)

Keeled Scales has been fully configured and validated with 8 new samples across 2 armor styles (Kallardian Norse, Risar Berserker).

### 5.1 Collect Keeled Scales Samples
**Goal:** Gather corner samples for at least 2 armor styles to establish baseline.

- [x] Kallardian Norse + Keeled Scales + Ironfur @ 0/0, 100/0, 0/100, 100/100
- [x] Risar Berserker + Keeled Scales + Ironfur @ 0/0, 100/0, 0/100, 100/100
- [x] Add samples to `samples/` files

### 5.2 Configure Base Properties
**Goal:** Add Keeled Scales to `baseMaterials.ts`.

- [x] Derive `weight` from samples (0.0109)
- [x] Derive `usageMultiplier` (relative to Plate Scales: ~0.65)
- [x] Derive `durability` multiplier (~0.80)
- [x] Add `defenseConfig` for Kallardian Norse and Risar Berserker
- [x] Add `additiveWeightConfig` (minWeightOffset: -0.5, baseContribMult: 0.643)

### 5.3 Expand to Remaining Armor Styles
**Goal:** Add support for all 4 armor styles.

- [x] Collect Khurite Splinted samples (0/0, 100/0, 0/100, 100/100)
- [x] Collect Ranger Armor samples (0/0, 100/0, 0/100, 100/100)
- [x] Add defense/durability/usage configs for Khurite Splinted and Ranger Armor

### 5.4 Run Full Test Suite
**Goal:** Ensure Keeled Scales passes all tests.

- [x] Run `bun test` - 3619 tests passing (all 4 armor styles)

---

## Phase 6: Leptoid Scales (Base Material) ✅

**Status:** ✅ Complete  
**Priority:** Low (not configured)

Leptoid Scales has been fully configured and validated with 8 new samples across 2 armor styles (Kallardian Norse, Risar Berserker).

### 6.1 Collect Leptoid Scales Samples
- [x] Kallardian Norse + Leptoid Scales + Ironfur @ 0/0, 100/0, 0/100, 100/100
- [x] Risar Berserker + Leptoid Scales + Ironfur @ 0/0, 100/0, 0/100, 100/100

### 6.2 Configure Base Properties
- [x] Add Leptoid Scales to `baseMaterials.ts` with all required properties
  - weight: 0.0055
  - usageMultiplier: ~0.36
  - durability: ~0.45
  - defenseConfig for all 4 armor styles
  - additiveWeightConfig (minWeightOffset: -1.15, baseContribMult: 0.179)

### 6.3 Expand to Remaining Armor Styles
- [x] Collect Khurite Splinted samples (0/0, 100/0, 0/100, 100/100)
- [x] Collect Ranger Armor samples (0/0, 100/0, 0/100, 100/100)
- [x] Add defense/durability/usage configs for Khurite Splinted and Ranger Armor

### 6.4 Run Full Test Suite
- [x] Run `bun test` - 3619 tests passing (all 4 armor styles)

---

## Phase 7: Placoid Scales (Base Material) ⏳

**Status:** ⏳ Not Started  
**Priority:** Low (not configured)

### 7.1 Collect Placoid Scales Samples
- [ ] Kallardian Norse + Placoid Scales + Ironfur @ 0/0, 100/0, 0/100, 100/100
- [ ] Risar Berserker + Placoid Scales + Ironfur @ 0/0, 100/0, 0/100, 100/100

### 7.2 Configure Base Properties
- [ ] Add Placoid Scales to `baseMaterials.ts` with all required properties

### 7.3 Run Full Test Suite
- [ ] Run `bun test` and verify all tests pass

---

## Phase 8: Pansar Scales (Base Material) ⏳

**Status:** ⏳ Not Started  
**Priority:** Low (not configured)

### 8.1 Collect Pansar Scales Samples
- [ ] Kallardian Norse + Pansar Scales + Ironfur @ 0/0, 100/0, 0/100, 100/100
- [ ] Risar Berserker + Pansar Scales + Ironfur @ 0/0, 100/0, 0/100, 100/100

### 8.2 Configure Base Properties
- [ ] Add Pansar Scales to `baseMaterials.ts` with all required properties

### 8.3 Run Full Test Suite
- [ ] Run `bun test` and verify all tests pass

---

## Phase 9: Ironwool (Padding Material) ⏳

**Status:** ⏳ Not Started  
**Priority:** Low (not configured)

Ironwool is listed in types but not configured in `paddingMaterials.ts`.

### 9.1 Collect Ironwool Samples
- [ ] Kallardian Norse + Plate Scales + Ironwool @ 0/0, 100/0, 0/100, 100/100
- [ ] Risar Berserker + Plate Scales + Ironwool @ 0/0, 100/0, 0/100, 100/100

### 9.2 Configure Padding Properties
- [ ] Add Ironwool to `SHARED_PADDING_CONFIG` with defense values
- [ ] Add Ironwool to `STYLE_WEIGHT_CONFIGS` with weight properties
- [ ] Add `additiveWeightConfig` (minWeightOffset, padContrib, padContribRatio)
- [ ] Add durability multipliers

### 9.3 Run Full Test Suite
- [ ] Run `bun test` and verify all tests pass

---

## Phase 10: Code Refactoring & Cleanup ⏳

**Status:** ⏳ Not Started  
**Priority:** Low (code quality improvement)

This phase focuses on improving code quality and removing technical debt accumulated during the material expansion phases.

### 10.1 Consolidate Padding Weight Config
**Goal:** Move universal padding weight properties from `STYLE_WEIGHT_CONFIGS` to `SHARED_PADDING_CONFIG`.

**Background:** Guard Fur and Bloodsilk have identical `weight` and `weightDensityCoeffs` values across all armor styles. Only Ironfur and Ironsilk have style-specific variations.

- [ ] Identify which padding materials have universal vs style-specific weight configs
- [ ] Add optional `weight` and `weightDensityCoeffs` fields to `SharedPaddingConfig`
- [ ] Update `buildPaddingConfig()` to use shared values as fallback when style-specific not defined
- [ ] Remove redundant entries from `STYLE_WEIGHT_CONFIGS` for Guard Fur and Bloodsilk
- [ ] Verify all tests still pass at ±0.01 tolerance

### 10.2 Remove Legacy Weight Calculation Fallback
**Goal:** Remove the deprecated weight calculation code path in `calculate.ts`.

**Background:** The `calculatePieceWeight()` function and its fallback path (lines 234-254, 331-338) are no longer needed since all materials now use the additive weight model.

- [ ] Verify all base materials have `additiveWeightConfig` defined
- [ ] Verify all padding materials have `additiveWeightConfig` with `padContribRatio` defined
- [ ] Remove `calculatePieceWeight()` function from `calculate.ts`
- [ ] Remove the fallback else branch in the weight calculation section
- [ ] Remove unused imports and variables (`effectiveBaseWeightCoeffs`, `oldWeightCalc`, etc.)
- [ ] Clean up `PaddingMaterialConfig` type if `weight` and `weightDensityCoeffs` are no longer needed
- [ ] Verify all tests still pass

### 10.3 Simplify Material Config Types
**Goal:** Clean up type definitions after removing legacy code.

- [ ] Review `PaddingMaterialConfig` type - consider if `weight` and `weightDensityCoeffs` can be removed
- [ ] Review `BaseMaterialConfig` type - consider if legacy fields can be removed
- [ ] Update documentation comments to reflect current architecture
- [ ] Verify type safety is maintained

### 10.4 Run Full Test Suite
**Goal:** Ensure refactoring doesn't break anything.

- [ ] Run `bun test` and verify all tests pass
- [ ] Run `bunx tsc --noEmit` for type checking
- [ ] Verify no regressions in accuracy

---

## Notes

### Sample Collection Strategy
1. Always use **Ironfur** padding when testing new base materials (it's the baseline)
2. Always use **Plate Scales** base when testing new padding materials (it's the baseline)
3. Collect corner samples first (0/0, 100/0, 0/100, 100/100), then add 50/50 for validation
4. Use the **sampler subagent** to fetch samples from MortalData API

### Configuration Dependencies
- **Base materials** need: weight, weightMultiplier, usageMultiplier, durability, defenseConfig, additiveWeightConfig
- **Padding materials** need: materialMultiplier, defense, defenseDensityCoeffs, durabilityMults, additiveWeightConfig (with padContribRatio), and per-style weight/weightDensityCoeffs

### Test Tolerances
- Defense: ±0.01
- Weight (set): ±0.01
- Weight (piece): ±0.01
- Durability: ±16.0
- Material Usage: ±2

---

## Progress Tracking

**Overall Progress:** 29/51 tasks complete (57%)

**Phase 1 (Horned Scales):** 5/5 sections ✅  
**Phase 2 (Arthropod Carapace):** 5/5 sections ✅  
**Phase 3 (Guard Fur):** 5/5 sections ✅  
**Phase 4 (Bloodsilk):** 5/5 sections ✅  
**Phase 5 (Keeled Scales):** 4/4 sections ✅ (all 4 armor styles)  
**Phase 6 (Leptoid Scales):** 4/4 sections ✅ (all 4 armor styles)  
**Phase 7 (Placoid Scales):** 0/3 sections  
**Phase 8 (Pansar Scales):** 0/3 sections  
**Phase 9 (Ironwool):** 0/3 sections  
**Phase 10 (Code Refactoring):** 0/4 sections
