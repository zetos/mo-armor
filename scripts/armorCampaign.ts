import type { ArmorStyle, BaseMaterial, SupportMaterial } from '../src/types';

export type CampaignRole = 'armor' | 'core' | 'padding-anchor';

export interface CampaignBatch {
  slug: string;
  armorStyle: ArmorStyle;
  armorStyleId: number;
  base: BaseMaterial;
  baseMatId: number;
  padding: SupportMaterial;
  supportMatId: number;
  roles: readonly CampaignRole[];
}

const armor = (
  slug: string,
  armorStyle: ArmorStyle,
  armorStyleId: number,
  base: BaseMaterial,
  baseMatId: number,
): CampaignBatch => ({
  slug,
  armorStyle,
  armorStyleId,
  base,
  baseMatId,
  padding: 'Ironfur',
  supportMatId: 84,
  roles: ['armor'],
});

const core = (
  slug: string,
  armorStyle: ArmorStyle,
  armorStyleId: number,
  base: BaseMaterial,
  baseMatId: number,
  padding: SupportMaterial = 'Ironfur',
  supportMatId = 84,
): CampaignBatch => ({
  slug,
  armorStyle,
  armorStyleId,
  base,
  baseMatId,
  padding,
  supportMatId,
  roles: ['core'],
});

const paired = (
  slug: string,
  base: BaseMaterial,
  baseMatId: number,
  padding: SupportMaterial,
  supportMatId: number,
): CampaignBatch => ({
  slug,
  armorStyle: 'Mercenary Plate',
  armorStyleId: 309,
  base,
  baseMatId,
  padding,
  supportMatId,
  roles: ['core'],
});

const paddingAnchor = (
  slug: string,
  padding: SupportMaterial,
  supportMatId: number,
): CampaignBatch => ({
  slug,
  armorStyle: 'Mercenary Plate',
  armorStyleId: 309,
  base: 'Plate Scales',
  baseMatId: 108,
  padding,
  supportMatId,
  roles: ['padding-anchor'],
});

export const ARMOR_CAMPAIGN: readonly CampaignBatch[] = [
  armor('draconigena-armatus--plate-scales--ironfur', 'Draconigena Armatus', 392, 'Plate Scales', 108),
  armor('mercenary-plate--plate-scales--ironfur', 'Mercenary Plate', 309, 'Plate Scales', 108),
  armor('risar-soldier--plate-scales--ironfur', 'Risar Soldier', 308, 'Plate Scales', 108),
  armor('rugged-garments--leptoid-scales--ironfur', 'Rugged Garments', 391, 'Leptoid Scales', 92),
  armor('tindremic-guard--plate-scales--ironfur', 'Tindremic Guard', 311, 'Plate Scales', 108),
  armor('tindremic-knight--plate-scales--ironfur', 'Tindremic Knight', 312, 'Plate Scales', 108),

  paired('mercenary-plate--aabam--alvarin-skin', 'Aabam', 45, 'Alvarin Skin', 118),
  paired('mercenary-plate--bleck--cotton', 'Bleck', 48, 'Cotton', 57),
  paired('mercenary-plate--bone-tissue--fullgrain-leather', 'Bone Tissue', 50, 'Fullgrain Leather', 68),
  paired('mercenary-plate--bron--ground-fur', 'Bron', 52, 'Ground Fur', 76),
  paired('mercenary-plate--compact-horn--human-skin', 'Compact Horn', 56, 'Human Skin', 119),
  paired('mercenary-plate--crepite--oghmir-skin', 'Crepite', 58, 'Oghmir Skin', 120),
  paired('mercenary-plate--cronite--quality-leather', 'Cronite', 59, 'Quality Leather', 109),
  paired('mercenary-plate--crustacean-carapace--rawhide', 'Crustacean Carapace', 60, 'Rawhide', 110),
  paired('mercenary-plate--cuprum--silk', 'Cuprum', 61, 'Silk', 114),
  paired('mercenary-plate--dense-crepite--thursar-skin', 'Dense Crepite', 63, 'Thursar Skin', 122),
  paired('mercenary-plate--emalj--wool', 'Emalj', 65, 'Wool', 131),

  core('mercenary-plate--flakestone--ironfur', 'Mercenary Plate', 309, 'Flakestone', 67),
  core('mercenary-plate--gold--ironfur', 'Mercenary Plate', 309, 'Gold', 71),
  core('mercenary-plate--grain-steel--ironfur', 'Mercenary Plate', 309, 'Grain Steel', 72),
  core('mercenary-plate--great-horn--ironfur', 'Mercenary Plate', 309, 'Great Horn', 74),
  core('mercenary-plate--heavy-carapace--ironfur', 'Mercenary Plate', 309, 'Heavy Carapace', 78),
  core('mercenary-plate--horn--ironfur', 'Mercenary Plate', 309, 'Horn', 79),
  core('mercenary-plate--incisium--ironfur', 'Mercenary Plate', 309, 'Incisium', 82),
  core('mercenary-plate--ironbone--ironfur', 'Mercenary Plate', 309, 'Ironbone', 83),
  core('mercenary-plate--jadeite--ironfur', 'Mercenary Plate', 309, 'Jadeite', 89),
  core('mercenary-plate--maalite--ironfur', 'Mercenary Plate', 309, 'Maalite', 93),
  core('mercenary-plate--messing--ironfur', 'Mercenary Plate', 309, 'Messing', 94),
  core('mercenary-plate--molarium--ironfur', 'Mercenary Plate', 309, 'Molarium', 95),
  core('mercenary-plate--nyx--ironfur', 'Mercenary Plate', 309, 'Nyx', 96),
  core('mercenary-plate--oghmium--ironfur', 'Mercenary Plate', 309, 'Oghmium', 97),
  core('mercenary-plate--pansar-carapace--ironfur', 'Mercenary Plate', 309, 'Pansar Carapace', 103),
  core('mercenary-plate--pig-iron--ironfur', 'Mercenary Plate', 309, 'Pig Iron', 106),
  core('mercenary-plate--reptile-carapace--ironfur', 'Mercenary Plate', 309, 'Reptile Carapace', 111),
  core('mercenary-plate--silver--ironfur', 'Mercenary Plate', 309, 'Silver', 115),
  core('mercenary-plate--skadite--ironfur', 'Mercenary Plate', 309, 'Skadite', 116),
  core('mercenary-plate--steel--ironfur', 'Mercenary Plate', 309, 'Steel', 124),
  core('mercenary-plate--tindremic-messing--ironfur', 'Mercenary Plate', 309, 'Tindremic Messing', 128),
  core('mercenary-plate--tungsteel--ironfur', 'Mercenary Plate', 309, 'Tungsteel', 129),

  core('ranger-armor--alvarin-skin--ironfur', 'Ranger Armor', 383, 'Alvarin Skin', 118),
  core('ranger-armor--fullgrain-leather--ironfur', 'Ranger Armor', 383, 'Fullgrain Leather', 68),
  core('ranger-armor--ganoid-scales--ironfur', 'Ranger Armor', 383, 'Ganoid Scales', 70),
  core('ranger-armor--ground-fur--ironfur', 'Ranger Armor', 383, 'Ground Fur', 76),
  core('ranger-armor--guard-fur--ironfur', 'Ranger Armor', 383, 'Guard Fur', 77),
  core('ranger-armor--human-skin--ironfur', 'Ranger Armor', 383, 'Human Skin', 119),
  core('ranger-armor--ironfur--guard-fur', 'Ranger Armor', 383, 'Ironfur', 84, 'Guard Fur', 77),
  core('ranger-armor--oghmir-skin--ironfur', 'Ranger Armor', 383, 'Oghmir Skin', 120),

  core('rugged-garments--bloodsilk--ironfur', 'Rugged Garments', 391, 'Bloodsilk', 202),
  core('rugged-garments--cotton--ironfur', 'Rugged Garments', 391, 'Cotton', 57),
  core('rugged-garments--ironsilk--ironfur', 'Rugged Garments', 391, 'Ironsilk', 85),
  core('rugged-garments--ironwool--ironfur', 'Rugged Garments', 391, 'Ironwool', 87),
  core('rugged-garments--quality-leather--ironfur', 'Rugged Garments', 391, 'Quality Leather', 109),
  core('rugged-garments--rawhide--ironfur', 'Rugged Garments', 391, 'Rawhide', 110),
  core('rugged-garments--silk--ironfur', 'Rugged Garments', 391, 'Silk', 114),
  core('rugged-garments--thursar-skin--ironfur', 'Rugged Garments', 391, 'Thursar Skin', 122),
  core('rugged-garments--wool--ironfur', 'Rugged Garments', 391, 'Wool', 131),

  paddingAnchor('mercenary-plate--plate-scales--alvarin-skin', 'Alvarin Skin', 118),
  paddingAnchor('mercenary-plate--plate-scales--cotton', 'Cotton', 57),
  paddingAnchor('mercenary-plate--plate-scales--fullgrain-leather', 'Fullgrain Leather', 68),
  paddingAnchor('mercenary-plate--plate-scales--ground-fur', 'Ground Fur', 76),
  paddingAnchor('mercenary-plate--plate-scales--human-skin', 'Human Skin', 119),
  paddingAnchor('mercenary-plate--plate-scales--oghmir-skin', 'Oghmir Skin', 120),
  paddingAnchor('mercenary-plate--plate-scales--quality-leather', 'Quality Leather', 109),
  paddingAnchor('mercenary-plate--plate-scales--rawhide', 'Rawhide', 110),
  paddingAnchor('mercenary-plate--plate-scales--silk', 'Silk', 114),
  paddingAnchor('mercenary-plate--plate-scales--thursar-skin', 'Thursar Skin', 122),
  paddingAnchor('mercenary-plate--plate-scales--wool', 'Wool', 131),
];
