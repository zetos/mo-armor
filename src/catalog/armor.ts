export const CORE_FAMILIES = ['Hard', 'Medium', 'Scale', 'Soft'] as const;

export type CoreFamily = (typeof CORE_FAMILIES)[number];

export const ARMOR_STYLE_CATALOG = [
  { id: 392, name: 'Draconigena Armatus', coreFamilies: ['Hard'] },
  { id: 433, name: 'Kallardian Banded', coreFamilies: ['Medium', 'Scale'] },
  { id: 307, name: 'Kallardian Norse', coreFamilies: ['Medium', 'Scale'] },
  { id: 313, name: 'Khurite Splinted', coreFamilies: ['Medium', 'Scale'] },
  { id: 309, name: 'Mercenary Plate', coreFamilies: ['Hard'] },
  { id: 383, name: 'Ranger Armor', coreFamilies: ['Medium', 'Scale'] },
  { id: 310, name: 'Risar Berserker', coreFamilies: ['Medium', 'Scale'] },
  { id: 308, name: 'Risar Soldier', coreFamilies: ['Hard'] },
  { id: 391, name: 'Rugged Garments', coreFamilies: ['Soft'] },
  { id: 427, name: 'Rustic Garments', coreFamilies: ['Medium', 'Scale'] },
  { id: 429, name: 'Tindremic Attire', coreFamilies: ['Soft'] },
  { id: 311, name: 'Tindremic Guard', coreFamilies: ['Medium', 'Scale'] },
  { id: 312, name: 'Tindremic Knight', coreFamilies: ['Hard'] },
] as const satisfies readonly {
  id: number;
  name: string;
  coreFamilies: readonly CoreFamily[];
}[];

export const ARMOR_MATERIAL_CATALOG = [
  { id: 45, name: 'Aabam', coreFamilies: ['Hard'], padding: false },
  { id: 118, name: 'Alvarin Skin', coreFamilies: ['Medium', 'Soft'], padding: true },
  { id: 46, name: 'Arthropod Carapace', coreFamilies: ['Hard', 'Scale'], padding: false },
  { id: 48, name: 'Bleck', coreFamilies: ['Hard'], padding: false },
  { id: 202, name: 'Bloodsilk', coreFamilies: ['Soft'], padding: true },
  { id: 50, name: 'Bone Tissue', coreFamilies: ['Hard'], padding: false },
  { id: 52, name: 'Bron', coreFamilies: ['Hard'], padding: false },
  { id: 56, name: 'Compact Horn', coreFamilies: ['Hard'], padding: false },
  { id: 57, name: 'Cotton', coreFamilies: ['Soft'], padding: true },
  { id: 58, name: 'Crepite', coreFamilies: ['Hard'], padding: false },
  { id: 59, name: 'Cronite', coreFamilies: ['Hard'], padding: false },
  { id: 60, name: 'Crustacean Carapace', coreFamilies: ['Hard', 'Scale'], padding: false },
  { id: 61, name: 'Cuprum', coreFamilies: ['Hard'], padding: false },
  { id: 63, name: 'Dense Crepite', coreFamilies: ['Hard'], padding: false },
  { id: 65, name: 'Emalj', coreFamilies: ['Hard'], padding: false },
  { id: 67, name: 'Flakestone', coreFamilies: ['Hard'], padding: false },
  { id: 68, name: 'Fullgrain Leather', coreFamilies: ['Medium', 'Soft'], padding: true },
  { id: 70, name: 'Ganoid Scales', coreFamilies: ['Medium', 'Soft'], padding: false },
  { id: 71, name: 'Gold', coreFamilies: ['Hard'], padding: false },
  { id: 72, name: 'Grain Steel', coreFamilies: ['Hard'], padding: false },
  { id: 74, name: 'Great Horn', coreFamilies: ['Hard'], padding: false },
  { id: 76, name: 'Ground Fur', coreFamilies: ['Medium', 'Soft'], padding: true },
  { id: 77, name: 'Guard Fur', coreFamilies: ['Medium', 'Soft'], padding: true },
  { id: 78, name: 'Heavy Carapace', coreFamilies: ['Hard', 'Scale'], padding: false },
  { id: 79, name: 'Horn', coreFamilies: ['Hard'], padding: false },
  { id: 80, name: 'Horned Scales', coreFamilies: ['Hard', 'Scale'], padding: false },
  { id: 119, name: 'Human Skin', coreFamilies: ['Medium', 'Soft'], padding: true },
  { id: 82, name: 'Incisium', coreFamilies: ['Hard'], padding: false },
  { id: 83, name: 'Ironbone', coreFamilies: ['Hard'], padding: false },
  { id: 84, name: 'Ironfur', coreFamilies: ['Medium', 'Soft'], padding: true },
  { id: 85, name: 'Ironsilk', coreFamilies: ['Soft'], padding: true },
  { id: 87, name: 'Ironwool', coreFamilies: ['Soft'], padding: true },
  { id: 89, name: 'Jadeite', coreFamilies: ['Hard'], padding: false },
  { id: 90, name: 'Keeled Scales', coreFamilies: ['Hard', 'Scale'], padding: false },
  { id: 92, name: 'Leptoid Scales', coreFamilies: ['Medium', 'Soft'], padding: false },
  { id: 93, name: 'Maalite', coreFamilies: ['Hard'], padding: false },
  { id: 94, name: 'Messing', coreFamilies: ['Hard'], padding: false },
  { id: 95, name: 'Molarium', coreFamilies: ['Hard'], padding: false },
  { id: 96, name: 'Nyx', coreFamilies: ['Hard'], padding: false },
  { id: 120, name: 'Oghmir Skin', coreFamilies: ['Medium', 'Soft'], padding: true },
  { id: 97, name: 'Oghmium', coreFamilies: ['Hard'], padding: false },
  { id: 103, name: 'Pansar Carapace', coreFamilies: ['Hard', 'Scale'], padding: false },
  { id: 104, name: 'Pansar Scales', coreFamilies: ['Hard', 'Scale'], padding: false },
  { id: 106, name: 'Pig Iron', coreFamilies: ['Hard'], padding: false },
  { id: 107, name: 'Placoid Scales', coreFamilies: ['Medium', 'Soft'], padding: false },
  { id: 108, name: 'Plate Scales', coreFamilies: ['Hard', 'Scale'], padding: false },
  { id: 109, name: 'Quality Leather', coreFamilies: ['Medium', 'Soft'], padding: true },
  { id: 110, name: 'Rawhide', coreFamilies: ['Medium', 'Soft'], padding: true },
  { id: 111, name: 'Reptile Carapace', coreFamilies: ['Hard', 'Scale'], padding: false },
  { id: 114, name: 'Silk', coreFamilies: ['Soft'], padding: true },
  { id: 115, name: 'Silver', coreFamilies: ['Hard'], padding: false },
  { id: 116, name: 'Skadite', coreFamilies: ['Hard'], padding: false },
  { id: 124, name: 'Steel', coreFamilies: ['Hard'], padding: false },
  { id: 122, name: 'Thursar Skin', coreFamilies: ['Medium', 'Soft'], padding: true },
  { id: 128, name: 'Tindremic Messing', coreFamilies: ['Hard'], padding: false },
  { id: 129, name: 'Tungsteel', coreFamilies: ['Hard'], padding: false },
  { id: 131, name: 'Wool', coreFamilies: ['Soft'], padding: true },
] as const satisfies readonly {
  id: number;
  name: string;
  coreFamilies: readonly CoreFamily[];
  padding: boolean;
}[];

export const PADDING_MATERIAL_NAMES = [
  'Alvarin Skin',
  'Bloodsilk',
  'Cotton',
  'Fullgrain Leather',
  'Ground Fur',
  'Guard Fur',
  'Human Skin',
  'Ironfur',
  'Ironsilk',
  'Ironwool',
  'Oghmir Skin',
  'Quality Leather',
  'Rawhide',
  'Silk',
  'Thursar Skin',
  'Wool',
] as const;

export type ArmorStyleName = (typeof ARMOR_STYLE_CATALOG)[number]['name'];
export type ArmorMaterialName = (typeof ARMOR_MATERIAL_CATALOG)[number]['name'];
export type PaddingMaterialName = (typeof PADDING_MATERIAL_NAMES)[number];

export function getArmorStyleById(id: number) {
  return ARMOR_STYLE_CATALOG.find((style) => style.id === id);
}

export function getArmorStyleByName(name: ArmorStyleName) {
  return ARMOR_STYLE_CATALOG.find((style) => style.name === name);
}

export function getArmorMaterialById(id: number) {
  return ARMOR_MATERIAL_CATALOG.find((material) => material.id === id);
}

export function getArmorMaterialByName(name: ArmorMaterialName) {
  return ARMOR_MATERIAL_CATALOG.find((material) => material.name === name);
}

export function isCoreCompatible(
  style: (typeof ARMOR_STYLE_CATALOG)[number],
  material: (typeof ARMOR_MATERIAL_CATALOG)[number],
): boolean {
  return style.coreFamilies.some((family) =>
    (material.coreFamilies as readonly CoreFamily[]).includes(family),
  );
}
