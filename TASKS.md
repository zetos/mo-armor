# TASKS.md - Armor Calculator Improvement Roadmap

This file tracks incremental improvements to the armor calculator's accuracy and code quality.

## Status Legend
- ⏳ **Not Started**
- 🚧 **In Progress**
- ✅ **Complete**
- ❌ **Blocked**

---

## Phase 1: Sample Data Cleanup (✅)

### 1.1 Remove Non-Standard Material Samples
**Status:** ✅ COMPLETE  
**Goal:** Keep only Plate Scales samples (with Ironsilk OR Ironfur) to establish baseline accuracy.

**Decision:** Keeping both Ironsilk and Ironfur padding materials as they are both standard. Removing only non-standard base materials (Arthropod Carapace, Horned Scales) and non-standard padding (Bloodsilk, Guard Fur).

- [x] Clean up `samples/risarBerserker.ts` - Remove Arthropod Carapace, Horned Scales, Bloodsilk, Guard Fur (44 → 10 samples)
- [x] Clean up `samples/kallardianNorse.ts` - Remove Arthropod Carapace, Horned Scales (27 → 19 samples)
- [x] Clean up `samples/khuriteSplinted.ts` - Remove Arthropod Carapace, Horned Scales (26 → 11 samples)
- [x] Clean up `samples/rangerArmor.ts` - Remove Horned Scales samples (20 → 10 samples)
- [x] Update test counts in `test/calculate.test.ts` after cleanup
- [x] Run tests to verify all remaining samples pass (1351 tests, all passing ✓)

**Result:** 50 samples remaining (down from 117). Only Plate Scales + (Ironsilk OR Ironfur) combinations remain.

---

## Phase 2: Ensure Critical Density Samples (✅)

### 2.1 Audit Existing Samples
**Status:** ✅ COMPLETE  
**Goal:** Identify which critical density combinations are missing per armor style.

**Audit Results:**
- Risar Berserker: ✅ Has all critical densities (0/0, 0/100, 100/0, 100/100, 50/50)
- Kallardian Norse: ❌ Missing Ironsilk @ 50/50
- Khurite Splinted: ❌ Missing Ironsilk @ 50/50
- Ranger Armor: ❌ Missing both Ironsilk @ 50/50 and Ironfur @ 50/50

**Acceptance Criteria:** ✅ Identified 4 missing samples.

### 2.2 Collect Missing Samples
**Status:** ✅ COMPLETE  
**Goal:** Use sampler tool to gather missing critical density combinations.

- [x] Collect Kallardian Norse: Plate Scales/Ironsilk @ 50/50 ✅
- [x] Collect Khurite Splinted: Plate Scales/Ironsilk @ 50/50 ✅
- [x] Collect Ranger Armor: Plate Scales/Ironsilk @ 50/50 ✅
- [x] Collect Ranger Armor: Plate Scales/Ironfur @ 50/50 ✅
- [x] Add new samples to respective files (kallardianNorse.ts, khuriteSplinted.ts, rangerArmor.ts)
- [x] Run tests to verify new samples (1459 tests, all passing ✓)

**Result:** All 4 armor styles now have complete critical density coverage. Total: 54 samples.

---

## Phase 3: Defense Calculation Accuracy (✅)

### 3.0 Defense Accuracy Analysis
**Status:** ✅ COMPLETE  
**Goal:** Measure current defense accuracy and identify optimization opportunities.

- [x] Create defense accuracy analyzer script (`scripts/analyzeDefense.ts`)
- [x] Run analysis and document baseline accuracy metrics
- [x] Identify systematic bias patterns

**Results:**
- 98.1% of defense values within ±0.01 tolerance
- 95.7% perfect matches (error = 0)
- Only 7 values at exactly ±0.01 boundary
- Small positive bias on blunt defense (+0.000556 mean error)

### 3.1-3.4 Armor Style Defense Reviews
**Status:** ✅ COMPLETE  
**Goal:** Verify defense accuracy for all armor styles.

**Results per armor style:**
- Risar Berserker: 96.7% within ±0.01, max error 0.01
- Kallardian Norse: 98.3% within ±0.01, max error 0.01  
- Khurite Splinted: 97.2% within ±0.01, max error 0.01
- Ranger Armor: 100% within ±0.01, max error 0.01

All coefficients verified and working correctly. No adjustments needed.

### 3.5 Code Refactoring - Padding Materials
**Status:** ✅ COMPLETE  
**Goal:** Simplify paddingMaterials.ts by extracting shared defense configurations.

**Key Findings:**
1. Padding defense values are IDENTICAL across all armor styles
2. Ironfur uses simple linear scaling (a=0, b=1) for all defense types
3. Only weight properties vary per armor style

**Changes Made:**
- Extracted shared defense configs to `SHARED_PADDING_DEFENSE` constant
- Separated style-specific weight configs to `STYLE_WEIGHT_CONFIGS`
- Created `buildPaddingConfig()` helper function
- Reduced file from ~340 lines to ~170 lines (50% reduction)
- Added `getSharedPaddingDefense()` export for analysis

### 3.6 Cross-Validation with Varied Density Samples
**Status:** ✅ COMPLETE  
**Goal:** Validate formula accuracy with non-standard density combinations.

**Samples Tested (not added to permanent test suite):**
- Risar Berserker: 20/90, 30/40, 25/75
- Kallardian Norse: 15/85, 35/45, 60/20
- Khurite Splinted: 10/80, 45/55, 70/30
- Ranger Armor: 5/95, 55/35, 80/10

**Result:** 100% pass rate at ±0.01 tolerance. Formula works correctly across all density ranges.

---

## Phase 4: Weight Calculation Refactor (✅)

### 4.1 Analyze Current Weight Implementation
**Status:** ✅ COMPLETE  
**Goal:** Understand the structure of `weightConfigs` and identify patterns.

- [x] Document current `weightConfigs` structure and all combinations
- [x] Extract `minWeight`, `baseContrib`, `padContrib` patterns per armor style
- [x] Check if `baseContrib` is consistent across padding materials (for same armor+base)
- [x] Check if `padContrib` is consistent across base materials (for same armor+padding)
- [x] Identify if coefficients can be factored into material-level properties
- [x] Document findings and proposed refactor approach

**Key Findings:**
1. `padContrib` is UNIVERSAL per padding material (same across all styles and base materials)
   - Ironfur: 1.4, Ironsilk: 0.4, Guard Fur: 1.2, Bloodsilk: 0.6
2. `baseContrib` is per style+base (padding-independent)
   - Can be decomposed as: `baseContrib = styleBaseContrib × materialMultiplier`
3. `minWeight` decomposes cleanly:
   - `minWeight = styleBaseMinWeight + paddingOffset + baseMaterialOffset`

### 4.2 Design Improved Weight Model
**Status:** ✅ COMPLETE  
**Goal:** Design a cleaner weight calculation system without hardcoded combos.

- [x] Propose weight coefficient structure for `armorStyles.ts`
- [x] Propose weight coefficient structure for `baseMaterials.ts`
- [x] Propose weight coefficient structure for `paddingMaterials.ts`
- [x] Determine if additional per-style base material configs are needed
- [x] Write migration plan from `weightConfigs` to new structure
- [x] Document new weight formula and coefficient meanings

**New Weight Formula:**
```typescript
setWeight = minWeight + baseContrib*(bd/100) + padContrib*(pd/100)

where:
  minWeight = styleBaseMinWeight + paddingOffset + baseMaterialOffset
  baseContrib = styleBaseContrib × baseMaterialMult
  padContrib = (from padding material config)
```

### 4.3 Implement New Weight Calculation
**Status:** ✅ COMPLETE  
**Goal:** Refactor weight calculation to use material properties.

- [x] Add weight coefficients to `src/data/armorStyles.ts` (StyleWeightConfig)
- [x] Add weight coefficients to `src/data/baseMaterials.ts` (BaseMaterialWeightConfig)
- [x] Add weight coefficients to `src/data/paddingMaterials.ts` (PaddingMaterialWeightConfig)
- [x] Update weight calculation in `src/calculate.ts` to use new coefficients
- [x] Run tests to verify weight accuracy remains at ±0.01 (1459 tests passing)
- [x] Remove `src/data/weightConfigs.ts` file
- [x] Update imports in `src/calculate.ts`
- [x] Add new types to `src/types.ts`

### 4.4 Verify Weight Calculation Accuracy
**Status:** ✅ COMPLETE  
**Goal:** Ensure new weight model maintains 100% accuracy.

- [x] Run full test suite and verify all weight tests pass (1459/1459)
- [x] Compare new vs old weight calculations for all samples
- [x] Document any tolerance changes or edge cases
- [x] Investigate piece weight tolerance improvement to ±0.01

**Results:**
- setWeight: 100% accuracy at ±0.01 tolerance
- pieceWeight: 77.8% accuracy at ±0.01, 100% at ±0.03 (unchanged)
  - Max error: 0.02, caused by proportional scaling rounding
  - Cannot be improved without per-piece weight formulas from the game
- PIECE_WEIGHT_TOLERANCE remains at 0.03 (inherent limitation of proportional scaling)

---

## Phase 5: Final Validation & Documentation (✅)

### 5.0 Piece Weight Rounding Investigation
**Status:** ✅ COMPLETE  
**Goal:** Understand piece weight rounding behavior and improve tolerance to ±0.01.

- [x] Collect low-density padding samples (1%-10%) using sampler
- [x] Analyze rounding patterns from new samples
- [x] Derive per-piece additive weight model coefficients
- [x] Implement per-piece additive weight calculation
- [x] Verify 100% pass rate at ±0.01 tolerance

**Key Findings:**
- Piece weights follow the same additive pattern as set weights
- Each piece has its own minWeight, baseContrib, and padContrib coefficients
- Coefficients derived from Ironfur corner samples (0/0, 100/0, 0/100, 100/100)
- Padding minWeightOffset distributed proportionally across pieces
- padContribRatio scales piece padContrib for different padding materials

**New Piece Weight Formula:**
```typescript
pieceWeight(bd, pd) = (pieceMin - offsetAdj) + pieceBase×(bd/100) + piecePad×padRatio×(pd/100)
where:
  offsetAdj = (0.5 - paddingMinWeightOffset) × (pieceMin / totalIronfurMin)
  padRatio = padContribRatio from padding material (1.0 for Ironfur, 0.286 for Ironsilk)
```

### 5.1 Comprehensive Test Pass
**Status:** ✅ COMPLETE  
**Goal:** Ensure all calculations are accurate across all samples.

- [x] Run full test suite: `bun test`
- [x] Verify 100% pass rate for defense (±0.01)
- [x] Verify 100% pass rate for weight (±0.01)
- [x] Verify 100% pass rate for piece weight (±0.01) - NEW!
- [x] Verify durability passes within acceptable tolerance (±16.0)
- [x] Verify material usage passes within acceptable tolerance (±2)

**Results:**
- 1459 tests passing
- Defense: 100% at ±0.01
- Weight: 100% at ±0.01
- Piece Weight: 100% at ±0.01 (90.4% perfect matches)
- Durability: 100% at ±16.0
- Material Usage: 100% at ±2

### 5.2 Update Documentation
**Status:** ✅ COMPLETE  
**Goal:** Reflect improvements in project documentation.

- [x] Update `AGENTS.md` with per-piece weight calculation formula
- [x] Update `AGENTS.md` test tolerance section
- [x] Update `TASKS.md` with Phase 5 completion
- [x] Add `pieceWeightCoeffs` to `armorStyles.ts`
- [x] Add `padContribRatio` to padding materials config

**Acceptance Criteria:** Documentation accurately reflects current implementation.

---

## Notes

- Each phase builds on the previous one
- Sample cleanup should happen first to avoid wasting effort on non-standard materials
- Defense accuracy depends on having critical density samples
- Weight refactor should only happen after defense is accurate
- All changes must maintain or improve test pass rates

## Progress Tracking

**Overall Progress:** 59/59 tasks complete (100%)

**Phase 1:** 6/6 tasks ✅ COMPLETE  
**Phase 2:** 6/6 tasks ✅ COMPLETE  
**Phase 3:** 12/12 tasks ✅ COMPLETE  
**Phase 4:** 20/20 tasks ✅ COMPLETE  
**Phase 5:** 15/15 tasks ✅ COMPLETE
