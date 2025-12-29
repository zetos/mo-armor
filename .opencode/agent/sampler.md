---
name: sampler
description: Fetches armor calculation samples from MortalData API
mode: subagent
model: opencode/big-pickle
---

## Purpose

Fetches armor calculation samples from the MortalData API and parses them into JSON format.

## API Endpoint

```
https://mortaldata.com/php/workbench/ArmorCalc.php
```

## Parameters

- `armorStyleId`: Armor style ID (310, 307, 313, 383)
- `baseMatId`: Base material ID (46, 84, 85, 87, 202, 90, 104, 108, 77, 80)
- `supportMatId`: Support material ID (46, 84, 85, 87, 202, 77)
- `baseDensity`: Base material density (0-100)
- `supportDensity`: Support material density (0-100)

## Material ID Reference

### Armor Styles

- 310: Risar Berserker
- 307: Kallardian Norse
- 313: Khurite Splinted
- 383: Ranger Armor

### Materials

- 46: Arthropod Carapace
- 84: Ironfur
- 85: Ironsilk
- 87: Ironwool
- 202: Bloodsilk
- 90: Keeled Scales
- 104: Pansar Scales
- 108: Plate Scales
- 77: Guard Fur
- 80: Horned Scales

## Usage Examples

### Single Sample

```
https://mortaldata.com/php/workbench/ArmorCalc.php?armorStyleId=307&baseMatId=46&supportMatId=84&baseDensity=100&supportDensity=0
```

### Density Range Testing

Fetch samples at 0%, 50%, 100% densities for material analysis.

## Response Format

```
307|46|84|100|0|34.7|31.8|32.53|7.2|0.86|0.94|2.3|0.94|2.16|1997.5|399.5|299.63|499.38|299.63|499.38|46[495]84[136]|46[60]84[16]|46[65]84[17]|46[159]84[43]|46[65]84[17]|46[149]84[40]|
```

## Integration Workflow

1. Fetch sample data using the API
2. Parse response using `scripts/parseSample.ts`
3. Add parsed JSON to appropriate sample file in `samples/`
4. Update `samples/index.ts` to export new samples
5. Run tests to validate integration

## Commands

```bash
# Parse sample from file
bun scripts/parseSample.ts sample.txt

# Run tests
bun test
```
