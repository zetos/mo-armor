# MortalData Armor Catalog and TODO

This document tracks the armor styles and materials exposed by the MortalData
Armor workbench and records how to rediscover their IDs and compatibility.

- Source: <https://mortaldata.com/workbench>
- Observed: 2026-07-19
- Armor styles: 13 total, 10 configured, 3 blocked by missing piece usage
- Core materials: 57 total, all calibrated in at least one canonical pairing
- Padding materials: 16 total, all calibrated in at least one canonical pairing
- Persisted campaign: 67 calibration-ready batches and 335 regression samples

MortalData calls the calculator's base material the **Core Material**. This
project calls it the **base material**. The terms refer to the same API field,
`baseMatId`.

## Armor Styles

Core material availability is controlled by the armor style's family. A
Medium/Scale style accepts the union of Medium and Scale core materials.

| Done | ID | Armor style | Core family |
| --- | ---: | --- | --- |
| [x] | 392 | Draconigena Armatus | Hard |
| [ ] | 433 | Kallardian Banded | Medium, Scale |
| [x] | 307 | Kallardian Norse | Medium, Scale |
| [x] | 313 | Khurite Splinted | Medium, Scale |
| [x] | 309 | Mercenary Plate | Hard |
| [x] | 383 | Ranger Armor | Medium, Scale |
| [x] | 310 | Risar Berserker | Medium, Scale |
| [x] | 308 | Risar Soldier | Hard |
| [x] | 391 | Rugged Garments | Soft |
| [ ] | 427 | Rustic Garments | Medium, Scale |
| [ ] | 429 | Tindremic Attire | Soft |
| [x] | 311 | Tindremic Guard | Medium, Scale |
| [x] | 312 | Tindremic Knight | Hard |

### Armor Rollout Checklist

- [x] Add Draconigena Armatus (`392`, Hard).
- [ ] Add Kallardian Banded (`433`, Medium/Scale): blocked because MortalData reports aggregate usage but zero usage for every piece.
- [x] Add Mercenary Plate (`309`, Hard).
- [x] Add Risar Soldier (`308`, Hard).
- [x] Add Rugged Garments (`391`, Soft).
- [ ] Add Rustic Garments (`427`, Medium/Scale): blocked by the same aggregate-only response.
- [ ] Add Tindremic Attire (`429`, Soft): blocked by the same aggregate-only response.
- [x] Add Tindremic Guard (`311`, Medium/Scale).
- [x] Add Tindremic Knight (`312`, Hard).

## Materials

The Core families column records where the material appears in the live Core
Material selector. A dash in the Padding column means the material does not
appear in the Padding Material selector and must not be fetched as padding.

Every listed Core and padding role now has a generated canonical calibration.
Support remains restricted to the exact style/material pairings represented by
the campaign; catalog compatibility alone does not enable an unmeasured pair.

| ID | Material | Core families | Padding | Role TODO |
| ---: | --- | --- | :---: | --- |
| 45 | Aabam | Hard | - | [x] Core |
| 118 | Alvarin Skin | Medium, Soft | Yes | [x] Core, [x] Padding |
| 46 | Arthropod Carapace | Hard, Scale | - | [x] Core |
| 48 | Bleck | Hard | - | [x] Core |
| 202 | Bloodsilk | Soft | Yes | [x] Core, [x] Padding |
| 50 | Bone Tissue | Hard | - | [x] Core |
| 52 | Bron | Hard | - | [x] Core |
| 56 | Compact Horn | Hard | - | [x] Core |
| 57 | Cotton | Soft | Yes | [x] Core, [x] Padding |
| 58 | Crepite | Hard | - | [x] Core |
| 59 | Cronite | Hard | - | [x] Core |
| 60 | Crustacean Carapace | Hard, Scale | - | [x] Core |
| 61 | Cuprum | Hard | - | [x] Core |
| 63 | Dense Crepite | Hard | - | [x] Core |
| 65 | Emalj | Hard | - | [x] Core |
| 67 | Flakestone | Hard | - | [x] Core |
| 68 | Fullgrain Leather | Medium, Soft | Yes | [x] Core, [x] Padding |
| 70 | Ganoid Scales | Medium, Soft | - | [x] Core |
| 71 | Gold | Hard | - | [x] Core |
| 72 | Grain Steel | Hard | - | [x] Core |
| 74 | Great Horn | Hard | - | [x] Core |
| 76 | Ground Fur | Medium, Soft | Yes | [x] Core, [x] Padding |
| 77 | Guard Fur | Medium, Soft | Yes | [x] Core, [x] Padding |
| 78 | Heavy Carapace | Hard, Scale | - | [x] Core |
| 79 | Horn | Hard | - | [x] Core |
| 80 | Horned Scales | Hard, Scale | - | [x] Core |
| 119 | Human Skin | Medium, Soft | Yes | [x] Core, [x] Padding |
| 82 | Incisium | Hard | - | [x] Core |
| 83 | Ironbone | Hard | - | [x] Core |
| 84 | Ironfur | Medium, Soft | Yes | [x] Core, [x] Padding |
| 85 | Ironsilk | Soft | Yes | [x] Core, [x] Padding |
| 87 | Ironwool | Soft | Yes | [x] Core, [x] Padding |
| 89 | Jadeite | Hard | - | [x] Core |
| 90 | Keeled Scales | Hard, Scale | - | [x] Core |
| 92 | Leptoid Scales | Medium, Soft | - | [x] Core |
| 93 | Maalite | Hard | - | [x] Core |
| 94 | Messing | Hard | - | [x] Core |
| 95 | Molarium | Hard | - | [x] Core |
| 96 | Nyx | Hard | - | [x] Core |
| 120 | Oghmir Skin | Medium, Soft | Yes | [x] Core, [x] Padding |
| 97 | Oghmium | Hard | - | [x] Core |
| 103 | Pansar Carapace | Hard, Scale | - | [x] Core |
| 104 | Pansar Scales | Hard, Scale | - | [x] Core |
| 106 | Pig Iron | Hard | - | [x] Core |
| 107 | Placoid Scales | Medium, Soft | - | [x] Core |
| 108 | Plate Scales | Hard, Scale | - | [x] Core |
| 109 | Quality Leather | Medium, Soft | Yes | [x] Core, [x] Padding |
| 110 | Rawhide | Medium, Soft | Yes | [x] Core, [x] Padding |
| 111 | Reptile Carapace | Hard, Scale | - | [x] Core |
| 114 | Silk | Soft | Yes | [x] Core, [x] Padding |
| 115 | Silver | Hard | - | [x] Core |
| 116 | Skadite | Hard | - | [x] Core |
| 124 | Steel | Hard | - | [x] Core |
| 122 | Thursar Skin | Medium, Soft | Yes | [x] Core, [x] Padding |
| 128 | Tindremic Messing | Hard | - | [x] Core |
| 129 | Tungsteel | Hard | - | [x] Core |
| 131 | Wool | Soft | Yes | [x] Core, [x] Padding |

### Material Rollout

- [x] Calibrate all 50 previously missing Core roles in canonical compatible styles.
- [x] Calibrate all 11 previously missing padding roles against Mercenary Plate.
- [x] Persist every source response under `samples/fetched/`.
- [x] Generate coefficients and 335 regression samples deterministically.
- [ ] Expand support to additional catalog-compatible style/material pairings only after collecting matching samples.

### Padding Reference

The live Padding Material selector currently contains these 16 IDs and does
not change when switching among the three armor families:

| ID | Padding material | Status |
| ---: | --- | --- |
| 118 | Alvarin Skin | [x] Canonically calibrated |
| 202 | Bloodsilk | [x] Configured |
| 57 | Cotton | [x] Canonically calibrated |
| 68 | Fullgrain Leather | [x] Canonically calibrated |
| 76 | Ground Fur | [x] Canonically calibrated |
| 77 | Guard Fur | [x] Configured |
| 119 | Human Skin | [x] Canonically calibrated |
| 84 | Ironfur | [x] Configured |
| 85 | Ironsilk | [x] Configured |
| 87 | Ironwool | [x] Configured |
| 120 | Oghmir Skin | [x] Canonically calibrated |
| 109 | Quality Leather | [x] Canonically calibrated |
| 110 | Rawhide | [x] Canonically calibrated |
| 114 | Silk | [x] Canonically calibrated |
| 122 | Thursar Skin | [x] Canonically calibrated |
| 131 | Wool | [x] Canonically calibrated |

ID 110 now uses the canonical MortalData label `Rawhide`. This intentionally
replaced the previous public spelling, `Raw Hide`.

## Chrome DevTools Navigation

1. Navigate to <https://mortaldata.com/workbench>.
2. Select the `ARMOR` tab in the top navigation.
3. Open `Armor Style`, `Core Material`, or `Padding Material`.
4. Read the visible options and their `data-value` attributes.
5. Select at least one style from every distinct family before declaring the
   Core catalog complete:
   - Hard, for example Mercenary Plate: 38 Core options.
   - Medium/Scale, for example Kallardian Banded: 22 Core options.
   - Soft, for example Rugged Garments: 19 Core options.
6. Recheck Padding separately. It currently has 16 options.

The controls are Material UI listboxes. After opening a selector, this snippet
returns its labels and IDs:

```js
() => [...document.querySelectorAll('[role="option"]')].map((option) => ({
  id: Number(option.getAttribute('data-value')),
  name: option.textContent.trim(),
}))
```

Do not scrape only the default armor. The Core selector is filtered by the
selected armor's family, so doing so misses all Soft and Medium/Scale-only
materials.

### Bundle Fallback

The catalog is embedded in a hashed JavaScript chunk. If interacting with all
selectors becomes slow:

1. List JavaScript resources with
   `performance.getEntriesByType('resource')`.
2. Fetch the resources and locate the one containing `ArmorCalc.php`.
3. Extract records with `armorStyle`, `materialArmorHard`,
   `materialArmorMedium`, `materialArmorScale`, `materialArmorSoft`, and
   `materialArmorSupport` flags.
4. Verify the extracted counts against at least one live selector per family.

Never hardcode the chunk filename because its content hash changes when the
site is deployed.

## Fetch Samples After Discovering IDs

Use Chrome DevTools only to discover and verify the catalog. Once the IDs are
known, use the existing parser's direct API mode:

```bash
bun scripts/parseSample.ts \
  --armorStyleId <armor-id> \
  --baseMatId <core-id> \
  --supportMatId <padding-id> \
  --baseDensity <0-100> \
  --supportDensity <0-100>
```

The script calls:

```text
GET https://mortaldata.com/php/workbench/ArmorCalc.php
    ?armorStyleId=<armor-id>
    &baseMatId=<core-id>
    &supportMatId=<padding-id>
    &baseDensity=<base-density>
    &supportDensity=<padding-density>
```

For each calibration subject, collect:

- `0/0`
- `100/0`
- `0/100`
- `100/100`
- `50/50` for validation

Prefer Ironfur padding when calibrating a new Core material and Plate Scales
Core when calibrating a new padding material. These baselines are usable for
Hard and Medium/Scale styles. Plate Scales is not offered by the UI for Soft
styles, so choose and document a valid Soft baseline before calibrating those
styles.

### Sample Fetch Progress

These tables track API collection. The 67 canonical batches are persisted in
`samples/fetched/`; the three aggregate-only armor responses are documented
here but excluded from the calibration manifest.

All completed batches contain `0/0`, `100/0`, `0/100`, `100/100`, and `50/50`.

#### Missing Armor Baselines

| Status | Armor style | Core / padding | Result |
| --- | --- | --- | --- |
| [x] | Draconigena Armatus (`392`) | Plate Scales (`108`) / Ironfur (`84`) | 5/5 valid |
| [x] | Kallardian Banded (`433`) | Plate Scales (`108`) / Ironfur (`84`) | 5/5 fetched; blocked: all piece usage fields are zero; reproduced with Leptoid Scales (`92`) |
| [x] | Mercenary Plate (`309`) | Plate Scales (`108`) / Ironfur (`84`) | 5/5 valid |
| [x] | Risar Soldier (`308`) | Plate Scales (`108`) / Ironfur (`84`) | 5/5 valid |
| [x] | Rugged Garments (`391`) | Leptoid Scales (`92`) / Ironfur (`84`) | 5/5 valid; Soft baseline established |
| [x] | Rustic Garments (`427`) | Plate Scales (`108`) / Ironfur (`84`) | 5/5 fetched; blocked: all piece usage fields are zero; reproduced with Leptoid Scales (`92`) |
| [x] | Tindremic Attire (`429`) | Leptoid Scales (`92`) / Ironfur (`84`) | 5/5 fetched; blocked: all piece usage fields are zero; reproduced with Guard Fur (`77`) padding |
| [x] | Tindremic Guard (`311`) | Plate Scales (`108`) / Ironfur (`84`) | 5/5 valid |
| [x] | Tindremic Knight (`312`) | Plate Scales (`108`) / Ironfur (`84`) | 5/5 valid |

#### Material Batches

| Status | Armor style | Core / padding | Roles covered | Result |
| --- | --- | --- | --- | --- |
| [x] | Mercenary Plate (`309`) | Aabam (`45`) / Alvarin Skin (`118`) | Core, padding | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Bleck (`48`) / Cotton (`57`) | Core, padding | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Bone Tissue (`50`) / Fullgrain Leather (`68`) | Core, padding | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Bron (`52`) / Ground Fur (`76`) | Core, padding | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Compact Horn (`56`) / Human Skin (`119`) | Core, padding | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Crepite (`58`) / Oghmir Skin (`120`) | Core, padding | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Cronite (`59`) / Quality Leather (`109`) | Core, padding | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Crustacean Carapace (`60`) / Rawhide (`110`) | Core, padding | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Cuprum (`61`) / Silk (`114`) | Core, padding | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Dense Crepite (`63`) / Thursar Skin (`122`) | Core, padding | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Emalj (`65`) / Wool (`131`) | Core, padding | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Flakestone (`67`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Gold (`71`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Grain Steel (`72`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Great Horn (`74`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Heavy Carapace (`78`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Horn (`79`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Incisium (`82`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Ironbone (`83`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Jadeite (`89`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Maalite (`93`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Messing (`94`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Molarium (`95`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Nyx (`96`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Oghmium (`97`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Pansar Carapace (`103`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Pig Iron (`106`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Reptile Carapace (`111`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Silver (`115`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Skadite (`116`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Steel (`124`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Tindremic Messing (`128`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Mercenary Plate (`309`) | Tungsteel (`129`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Ranger Armor (`383`) | Alvarin Skin (`118`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Ranger Armor (`383`) | Fullgrain Leather (`68`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Ranger Armor (`383`) | Ganoid Scales (`70`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Ranger Armor (`383`) | Ground Fur (`76`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Ranger Armor (`383`) | Guard Fur (`77`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Ranger Armor (`383`) | Human Skin (`119`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Ranger Armor (`383`) | Ironfur (`84`) / Guard Fur (`77`) | Core | 5/5 valid |
| [x] | Ranger Armor (`383`) | Oghmir Skin (`120`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Rugged Garments (`391`) | Bloodsilk (`202`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Rugged Garments (`391`) | Cotton (`57`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Rugged Garments (`391`) | Ironsilk (`85`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Rugged Garments (`391`) | Ironwool (`87`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Rugged Garments (`391`) | Quality Leather (`109`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Rugged Garments (`391`) | Rawhide (`110`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Rugged Garments (`391`) | Silk (`114`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Rugged Garments (`391`) | Thursar Skin (`122`) / Ironfur (`84`) | Core | 5/5 valid |
| [x] | Rugged Garments (`391`) | Wool (`131`) / Ironfur (`84`) | Core | 5/5 valid |

All 50 missing Core roles and all 11 missing padding roles now have a
calibration-ready batch.

### API and Parser Hazards

- `ArmorCalc.php` currently returns data for some combinations that the UI
  does not offer. Treat the UI compatibility matrix as authoritative unless a
  non-UI combination is deliberately used only for calibration.
- `scripts/parseSample.ts` consumes `src/catalog/armor.ts`; newly discovered
  IDs and roles must be added to that shared catalog before parsing.
- The parser validates Core family compatibility and padding eligibility before
  making a request.
- If Core and padding use the same material ID, MortalData collapses usage to
  fields such as `84[204]`. The parser rejects that ambiguous combination.
- The API-provided set usage field can differ from the sum of independently
  rounded pieces. Continue deriving `setMaterialUsage` from the five piece
  fields.
- The response piece order is helm, right arm, torso, left arm, legs. Preserve
  that order while parsing.

## Implementation Order

### 1. Prepare the Data Layout

- [x] Add a shared catalog for MortalData names, IDs, roles, and Core families.
- [x] Derive or validate public armor/material names against that catalog.
- [x] Make `scripts/parseSample.ts` consume the shared catalog.
- [x] Add explicit Core and padding role validation.
- [x] Reject ambiguous same-material Core/padding usage fields.
- [x] Add a resumable 67-batch campaign manifest and fetcher.
- [x] Persist source responses separately from generated coefficients.
- [x] Generate armor, Core, padding, support-gating, and regression data.
- [x] Preserve the existing registries and resolver behavior.

Implemented generated-data layout:

```text
scripts/armorCampaign.ts
scripts/fetchArmorCampaign.ts
scripts/calibrateArmorCampaign.ts
samples/fetched/*.json
samples/generatedCampaign.ts
src/data/generatedCampaign.ts
```

### 2. Add Catalog Data

- [ ] Add the 9 missing armor styles in Core-family batches (6 complete, 3 blocked).
- [x] Establish and document a valid baseline for Soft armor styles.
- [x] Add the 50 missing Core configurations in canonical compatible-family batches.
- [x] Add the 11 missing padding configurations.
- [x] Add compatibility checks so invalid style/Core combinations fail with a
  descriptive error.
- [ ] Add registry completeness and duplicate sample tests.
- [x] Add tests for intentionally unsupported or invalid combinations.

### 3. Verify Every Batch

```bash
bun test
bunx tsc --noEmit
```

Do not combine the mechanical file split with coefficient or formula changes.
Move existing calibrated values first, verify them, and then add new catalog
data incrementally.
