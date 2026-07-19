# MortalData Armor Catalog and TODO

This document tracks the armor styles and materials exposed by the MortalData
Armor workbench and records how to rediscover their IDs and compatibility.

- Source: <https://mortaldata.com/workbench>
- Observed: 2026-07-19
- Armor styles: 13 total, 4 configured, 9 missing
- Core materials: 57 total, 7 configured, 50 missing
- Padding materials: 16 total, 5 configured, 11 missing

MortalData calls the calculator's base material the **Core Material**. This
project calls it the **base material**. The terms refer to the same API field,
`baseMatId`.

## Armor Styles

Core material availability is controlled by the armor style's family. A
Medium/Scale style accepts the union of Medium and Scale core materials.

| Done | ID | Armor style | Core family |
| --- | ---: | --- | --- |
| [ ] | 392 | Draconigena Armatus | Hard |
| [ ] | 433 | Kallardian Banded | Medium, Scale |
| [x] | 307 | Kallardian Norse | Medium, Scale |
| [x] | 313 | Khurite Splinted | Medium, Scale |
| [ ] | 309 | Mercenary Plate | Hard |
| [x] | 383 | Ranger Armor | Medium, Scale |
| [x] | 310 | Risar Berserker | Medium, Scale |
| [ ] | 308 | Risar Soldier | Hard |
| [ ] | 391 | Rugged Garments | Soft |
| [ ] | 427 | Rustic Garments | Medium, Scale |
| [ ] | 429 | Tindremic Attire | Soft |
| [ ] | 311 | Tindremic Guard | Medium, Scale |
| [ ] | 312 | Tindremic Knight | Hard |

### Missing Armor Checklist

- [ ] Add Draconigena Armatus (`392`, Hard).
- [ ] Add Kallardian Banded (`433`, Medium/Scale).
- [ ] Add Mercenary Plate (`309`, Hard).
- [ ] Add Risar Soldier (`308`, Hard).
- [ ] Add Rugged Garments (`391`, Soft).
- [ ] Add Rustic Garments (`427`, Medium/Scale).
- [ ] Add Tindremic Attire (`429`, Soft).
- [ ] Add Tindremic Guard (`311`, Medium/Scale).
- [ ] Add Tindremic Knight (`312`, Hard).

## Materials

The Core families column records where the material appears in the live Core
Material selector. A dash in the Padding column means the material does not
appear in the Padding Material selector and must not be fetched as padding.

Each unchecked role is a separate configuration TODO. Checked roles are
already configured in `src/data`. This means a material such as Bloodsilk is
complete as padding but still needs independent core calibration.

| ID | Material | Core families | Padding | Role TODO |
| ---: | --- | --- | :---: | --- |
| 45 | Aabam | Hard | - | [ ] Core |
| 118 | Alvarin Skin | Medium, Soft | Yes | [ ] Core, [ ] Padding |
| 46 | Arthropod Carapace | Hard, Scale | - | [x] Core |
| 48 | Bleck | Hard | - | [ ] Core |
| 202 | Bloodsilk | Soft | Yes | [ ] Core, [x] Padding |
| 50 | Bone Tissue | Hard | - | [ ] Core |
| 52 | Bron | Hard | - | [ ] Core |
| 56 | Compact Horn | Hard | - | [ ] Core |
| 57 | Cotton | Soft | Yes | [ ] Core, [ ] Padding |
| 58 | Crepite | Hard | - | [ ] Core |
| 59 | Cronite | Hard | - | [ ] Core |
| 60 | Crustacean Carapace | Hard, Scale | - | [ ] Core |
| 61 | Cuprum | Hard | - | [ ] Core |
| 63 | Dense Crepite | Hard | - | [ ] Core |
| 65 | Emalj | Hard | - | [ ] Core |
| 67 | Flakestone | Hard | - | [ ] Core |
| 68 | Fullgrain Leather | Medium, Soft | Yes | [ ] Core, [ ] Padding |
| 70 | Ganoid Scales | Medium, Soft | - | [ ] Core |
| 71 | Gold | Hard | - | [ ] Core |
| 72 | Grain Steel | Hard | - | [ ] Core |
| 74 | Great Horn | Hard | - | [ ] Core |
| 76 | Ground Fur | Medium, Soft | Yes | [ ] Core, [ ] Padding |
| 77 | Guard Fur | Medium, Soft | Yes | [ ] Core, [x] Padding |
| 78 | Heavy Carapace | Hard, Scale | - | [ ] Core |
| 79 | Horn | Hard | - | [ ] Core |
| 80 | Horned Scales | Hard, Scale | - | [x] Core |
| 119 | Human Skin | Medium, Soft | Yes | [ ] Core, [ ] Padding |
| 82 | Incisium | Hard | - | [ ] Core |
| 83 | Ironbone | Hard | - | [ ] Core |
| 84 | Ironfur | Medium, Soft | Yes | [ ] Core, [x] Padding |
| 85 | Ironsilk | Soft | Yes | [ ] Core, [x] Padding |
| 87 | Ironwool | Soft | Yes | [ ] Core, [x] Padding |
| 89 | Jadeite | Hard | - | [ ] Core |
| 90 | Keeled Scales | Hard, Scale | - | [x] Core |
| 92 | Leptoid Scales | Medium, Soft | - | [x] Core |
| 93 | Maalite | Hard | - | [ ] Core |
| 94 | Messing | Hard | - | [ ] Core |
| 95 | Molarium | Hard | - | [ ] Core |
| 96 | Nyx | Hard | - | [ ] Core |
| 120 | Oghmir Skin | Medium, Soft | Yes | [ ] Core, [ ] Padding |
| 97 | Oghmium | Hard | - | [ ] Core |
| 103 | Pansar Carapace | Hard, Scale | - | [ ] Core |
| 104 | Pansar Scales | Hard, Scale | - | [x] Core |
| 106 | Pig Iron | Hard | - | [ ] Core |
| 107 | Placoid Scales | Medium, Soft | - | [x] Core |
| 108 | Plate Scales | Hard, Scale | - | [x] Core |
| 109 | Quality Leather | Medium, Soft | Yes | [ ] Core, [ ] Padding |
| 110 | Rawhide | Medium, Soft | Yes | [ ] Core, [ ] Padding |
| 111 | Reptile Carapace | Hard, Scale | - | [ ] Core |
| 114 | Silk | Soft | Yes | [ ] Core, [ ] Padding |
| 115 | Silver | Hard | - | [ ] Core |
| 116 | Skadite | Hard | - | [ ] Core |
| 124 | Steel | Hard | - | [ ] Core |
| 122 | Thursar Skin | Medium, Soft | Yes | [ ] Core, [ ] Padding |
| 128 | Tindremic Messing | Hard | - | [ ] Core |
| 129 | Tungsteel | Hard | - | [ ] Core |
| 131 | Wool | Soft | Yes | [ ] Core, [ ] Padding |

### Missing Core Checklist

- [ ] Configure Aabam (`45`) as Hard Core.
- [ ] Configure Alvarin Skin (`118`) as Medium/Soft Core.
- [ ] Configure Bleck (`48`) as Hard Core.
- [ ] Configure Bloodsilk (`202`) as Soft Core.
- [ ] Configure Bone Tissue (`50`) as Hard Core.
- [ ] Configure Bron (`52`) as Hard Core.
- [ ] Configure Compact Horn (`56`) as Hard Core.
- [ ] Configure Cotton (`57`) as Soft Core.
- [ ] Configure Crepite (`58`) as Hard Core.
- [ ] Configure Cronite (`59`) as Hard Core.
- [ ] Configure Crustacean Carapace (`60`) as Hard/Scale Core.
- [ ] Configure Cuprum (`61`) as Hard Core.
- [ ] Configure Dense Crepite (`63`) as Hard Core.
- [ ] Configure Emalj (`65`) as Hard Core.
- [ ] Configure Flakestone (`67`) as Hard Core.
- [ ] Configure Fullgrain Leather (`68`) as Medium/Soft Core.
- [ ] Configure Ganoid Scales (`70`) as Medium/Soft Core.
- [ ] Configure Gold (`71`) as Hard Core.
- [ ] Configure Grain Steel (`72`) as Hard Core.
- [ ] Configure Great Horn (`74`) as Hard Core.
- [ ] Configure Ground Fur (`76`) as Medium/Soft Core.
- [ ] Configure Guard Fur (`77`) as Medium/Soft Core.
- [ ] Configure Heavy Carapace (`78`) as Hard/Scale Core.
- [ ] Configure Horn (`79`) as Hard Core.
- [ ] Configure Human Skin (`119`) as Medium/Soft Core.
- [ ] Configure Incisium (`82`) as Hard Core.
- [ ] Configure Ironbone (`83`) as Hard Core.
- [ ] Configure Ironfur (`84`) as Medium/Soft Core.
- [ ] Configure Ironsilk (`85`) as Soft Core.
- [ ] Configure Ironwool (`87`) as Soft Core.
- [ ] Configure Jadeite (`89`) as Hard Core.
- [ ] Configure Maalite (`93`) as Hard Core.
- [ ] Configure Messing (`94`) as Hard Core.
- [ ] Configure Molarium (`95`) as Hard Core.
- [ ] Configure Nyx (`96`) as Hard Core.
- [ ] Configure Oghmir Skin (`120`) as Medium/Soft Core.
- [ ] Configure Oghmium (`97`) as Hard Core.
- [ ] Configure Pansar Carapace (`103`) as Hard/Scale Core.
- [ ] Configure Pig Iron (`106`) as Hard Core.
- [ ] Configure Quality Leather (`109`) as Medium/Soft Core.
- [ ] Configure Rawhide (`110`) as Medium/Soft Core.
- [ ] Configure Reptile Carapace (`111`) as Hard/Scale Core.
- [ ] Configure Silk (`114`) as Soft Core.
- [ ] Configure Silver (`115`) as Hard Core.
- [ ] Configure Skadite (`116`) as Hard Core.
- [ ] Configure Steel (`124`) as Hard Core.
- [ ] Configure Thursar Skin (`122`) as Medium/Soft Core.
- [ ] Configure Tindremic Messing (`128`) as Hard Core.
- [ ] Configure Tungsteel (`129`) as Hard Core.
- [ ] Configure Wool (`131`) as Soft Core.

### Missing Padding Checklist

- [ ] Configure Alvarin Skin padding (`118`).
- [ ] Configure Cotton padding (`57`).
- [ ] Configure Fullgrain Leather padding (`68`).
- [ ] Configure Ground Fur padding (`76`).
- [ ] Configure Human Skin padding (`119`).
- [ ] Configure Oghmir Skin padding (`120`).
- [ ] Configure Quality Leather padding (`109`).
- [ ] Configure Rawhide padding (`110`).
- [ ] Configure Silk padding (`114`).
- [ ] Configure Thursar Skin padding (`122`).
- [ ] Configure Wool padding (`131`).

### Padding Reference

The live Padding Material selector currently contains these 16 IDs and does
not change when switching among the three armor families:

| ID | Padding material | Status |
| ---: | --- | --- |
| 118 | Alvarin Skin | [ ] Missing |
| 202 | Bloodsilk | [x] Configured |
| 57 | Cotton | [ ] Missing |
| 68 | Fullgrain Leather | [ ] Missing |
| 76 | Ground Fur | [ ] Missing |
| 77 | Guard Fur | [x] Configured |
| 119 | Human Skin | [ ] Missing |
| 84 | Ironfur | [x] Configured |
| 85 | Ironsilk | [x] Configured |
| 87 | Ironwool | [x] Configured |
| 120 | Oghmir Skin | [ ] Missing |
| 109 | Quality Leather | [ ] Missing |
| 110 | Rawhide | [ ] Missing |
| 114 | Silk | [ ] Missing |
| 122 | Thursar Skin | [ ] Missing |
| 131 | Wool | [ ] Missing |

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
- [ ] Split `src/data/armorStyles.ts` into one module per armor style.
- [ ] Split `src/data/baseMaterials.ts` into one module per Core material.
- [ ] Split `src/data/paddingMaterials.ts` into one module per padding material.
- [ ] Preserve thin registry indexes and existing resolver behavior.
- [ ] Split samples by armor style and calibration pairing.
- [ ] Preserve all existing literals, comments, sample order, and arithmetic.

Suggested layout:

```text
src/
  catalog/
    armorStyles.ts
    materials.ts
  data/
    armorStyles/
      index.ts
      <armor-style>.ts
    baseMaterials/
      index.ts
      <material>.ts
    paddingMaterials/
      index.ts
      <material>.ts
samples/
  <armor-style>/
    index.ts
    <core>-with-<padding>.ts
```

### 2. Add Catalog Data

- [ ] Add the 9 missing armor styles in Core-family batches.
- [ ] Establish and document a valid baseline for Soft armor styles.
- [ ] Add the 50 missing Core configurations in compatible-family batches.
- [ ] Add the 11 missing padding configurations.
- [x] Add compatibility checks so invalid style/Core combinations fail with a
  descriptive error.
- [ ] Add registry completeness and duplicate sample tests.
- [ ] Add tests for intentionally unsupported or invalid combinations.

### 3. Verify Every Batch

```bash
bun test
bunx tsc --noEmit
```

Do not combine the mechanical file split with coefficient or formula changes.
Move existing calibrated values first, verify them, and then add new catalog
data incrementally.
