import type { ArmorStyle, BaseMaterial, SupportMaterial } from '../types';

/**
 * Weight configuration for armor combinations.
 * 
 * Formula: Weight(bd, pd) = minWeight + baseContrib × (bd/100) + padContrib × (pd/100)
 * 
 * Where:
 * - minWeight: Weight at 0% base and 0% padding density
 * - baseContrib: Weight added by going from 0% to 100% base density
 * - padContrib: Weight added by going from 0% to 100% padding density
 */
export interface WeightConfig {
  minWeight: number;
  baseContrib: number;
  padContrib: number;
}

type WeightConfigKey = `${ArmorStyle}|${BaseMaterial}|${SupportMaterial}`;

export const weightConfigs: Partial<Record<WeightConfigKey, WeightConfig>> = {
  'Risar Berserker|Arthropod Carapace|Ironfur': {
    minWeight: 5.95,
    baseContrib: 2.6,
    padContrib: 1.4,
  },
  'Risar Berserker|Plate Scales|Bloodsilk': {
    minWeight: 4.95,
    baseContrib: 1.82,
    padContrib: 0.6,
  },
  'Risar Berserker|Plate Scales|Guard Fur': {
    minWeight: 5.25,
    baseContrib: 1.82,
    padContrib: 1.2,
  },
  'Risar Berserker|Arthropod Carapace|Guard Fur': {
    minWeight: 5.85,
    baseContrib: 2.6,
    padContrib: 1.2,
  },
  'Risar Berserker|Horned Scales|Guard Fur': {
    minWeight: 5.0,
    baseContrib: 1.5,
    padContrib: 1.2,
  },
  'Risar Berserker|Plate Scales|Ironsilk': {
    minWeight: 4.85,
    baseContrib: 1.82,
    padContrib: 0.4,
  },
  'Risar Berserker|Plate Scales|Ironfur': {
    minWeight: 5.35,
    baseContrib: 1.82,
    padContrib: 1.4,
  },
  'Risar Berserker|Horned Scales|Ironfur': {
    minWeight: 5.1,
    baseContrib: 1.5,
    padContrib: 1.4,
  },
  'Risar Berserker|Horned Scales|Ironsilk': {
    minWeight: 4.6,
    baseContrib: 1.5,
    padContrib: 0.4,
  },
  'Kallardian Norse|Plate Scales|Ironfur': {
    minWeight: 4.6,
    baseContrib: 1.4,
    padContrib: 1.4,
  },
  'Kallardian Norse|Plate Scales|Ironsilk': {
    minWeight: 4.1,
    baseContrib: 1.4,
    padContrib: 0.4,
  },
  'Kallardian Norse|Arthropod Carapace|Ironfur': {
    minWeight: 5.2,
    baseContrib: 2.0,
    padContrib: 1.4,
  },
  'Kallardian Norse|Horned Scales|Ironfur': {
    minWeight: 4.35,
    baseContrib: 1.15,
    padContrib: 1.4,
  },
  'Khurite Splinted|Plate Scales|Ironfur': {
    minWeight: 7.1,
    baseContrib: 3.36,
    padContrib: 1.4,
  },
  'Khurite Splinted|Plate Scales|Ironsilk': {
    minWeight: 6.6,
    baseContrib: 3.36,
    padContrib: 0.4,
  },
  'Khurite Splinted|Horned Scales|Ironfur': {
    minWeight: 6.85,
    baseContrib: 2.76,
    padContrib: 1.4,
  },
  'Khurite Splinted|Arthropod Carapace|Ironfur': {
    minWeight: 7.7,
    baseContrib: 4.8,
    padContrib: 1.4,
  },
  'Ranger Armor|Plate Scales|Ironfur': {
    minWeight: 5.1,
    baseContrib: 1.68,
    padContrib: 1.4,
  },
  'Ranger Armor|Plate Scales|Ironsilk': {
    minWeight: 4.6,
    baseContrib: 1.68,
    padContrib: 0.4,
  },
  'Ranger Armor|Horned Scales|Ironfur': {
    minWeight: 4.85,
    baseContrib: 1.38,
    padContrib: 1.4,
  },
  'Ranger Armor|Horned Scales|Ironsilk': {
    minWeight: 4.35,
    baseContrib: 1.38,
    padContrib: 0.4,
  },
};

/**
 * Get weight config for a given armor combination.
 * Returns the config if available, otherwise null.
 */
export function getWeightConfig(
  armorStyle: ArmorStyle,
  base: BaseMaterial,
  padding: SupportMaterial
): WeightConfig | null {
  const key: WeightConfigKey = `${armorStyle}|${base}|${padding}`;
  return weightConfigs[key] ?? null;
}

/**
 * Calculate weight using the additive model.
 * Formula: W(bd, pd) = minWeight + baseContrib × (bd/100) + padContrib × (pd/100)
 */
export function calculateWeight(
  config: WeightConfig,
  baseDensity: number,
  paddingDensity: number
): number {
  return (
    config.minWeight +
    config.baseContrib * (baseDensity / 100) +
    config.padContrib * (paddingDensity / 100)
  );
}
