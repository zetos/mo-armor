---
name: sampler
description: Fetches armor calculation samples from MortalData API and parses them into JSON format.
mode: subagent
model: opencode/big-pickle
---

## Purpose

Fetches armor calculation samples from the MortalData API and parses them into JSON format.

CRITICAL: Always use the API to generate new samples and return the result already parsed in JSON format using the parseSample script. The script now supports direct API calls with parameters - no need to create intermediate files.

## API Endpoint

```
https://mortaldata.com/php/workbench/ArmorCalc.php
```

## Parameters

- `armorStyleId`: Armor style ID (310, 307, 313, 383)
- `baseMatId`: Base material ID (46, 70, 84, 85, 87, 90, 92, 104, 107, 108, 109, 110)
- `supportMatId`: Support material ID (46, 70, 77, 84, 85, 87, 202)
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
- 70: Ganoid Scales
- 77: Guard Fur
- 80: Horned Scales
- 84: Ironfur
- 85: Ironsilk
- 87: Ironwool
- 90: Keeled Scales
- 92: Leptoid Scales
- 104: Pansar Scales
- 107: Placoid Scales
- 108: Plate Scales
- 109: Quality Leather
- 110: Raw Hide
- 202: Bloodsilk

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

**Direct API Method (Recommended):**

1. Call parseSample script directly with API parameters
2. Script fetches data and returns parsed JSON
3. Add parsed JSON to appropriate sample file in `samples/`

**Legacy File Method:**

1. Fetch sample data using the API manually
2. Save response to a temporary file
3. Parse response using `scripts/parseSample.ts <file>`
4. Add parsed JSON to appropriate sample file in `samples/`

The direct API method eliminates intermediate files and streamlines the workflow.

## Commands

```bash
# Parse sample from file (backward compatibility)
bun scripts/parseSample.ts sample.txt

# Fetch sample directly from API (recommended)
bun scripts/parseSample.ts --armorStyleId 307 --baseMatId 46 --supportMatId 84 --baseDensity 100 --supportDensity 0

# Convenience scripts for armor styles
bun run sample-kallardian --baseMatId 46 --supportMatId 84 --baseDensity 100 --supportDensity 0
bun run sample-risar --baseMatId 108 --supportMatId 84 --baseDensity 50 --supportDensity 50
bun run sample-khurite --baseMatId 104 --supportMatId 84 --baseDensity 100 --supportDensity 0
bun run sample-ranger --baseMatId 108 --supportMatId 84 --baseDensity 25 --supportDensity 75

# Run tests
bun test
```
