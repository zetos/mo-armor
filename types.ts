export type ArmorStyle =
  | 'Ranger Armor'
  | 'Risar Berseker'
  | 'Kallardian Norse'
  | 'Khurite Splinted';

export type BaseMaterial =
  | 'Ironfur'
  | 'Ironsilk'
  | 'Ironwool'
  | 'Bloodsilk'
  | 'Keeled Scales'
  | 'Plate Scales'
  | 'Placoid Scales'
  | 'Pansar Scales'
  | 'Arthropod Carapace';

export type SupportMaterial = 'Ironfur' | 'Ironsilk' | 'Ironwool' | 'Bloodsilk';

export type MaterialUsage = {
  base: number;
  padding: number;
};

export type DefenseStats = {
  blunt: number;
  pierce: number;
  slash: number;
};

export type PieceStats<T> = {
  helm: T;
  torso: T;
  rightArm: T;
  leftArm: T;
  legs: T;
};

export type SetStats = {
  armorStyle: ArmorStyle;
  base: BaseMaterial;
  padding: SupportMaterial;
  baseDensity: number;
  paddingDensity: number;
  setWeight: number;
  setDura: number;
  setMaterialUsage: MaterialUsage;
  setDefense: DefenseStats;
  pieceWeight: PieceStats<number>;
  pieceDurability: PieceStats<number>;
  pieceMaterialUsage: PieceStats<MaterialUsage>;
};

export type CalculateSetStatusInput<
  B extends BaseMaterial,
  S extends SupportMaterial,
> = {
  armorStyle: ArmorStyle;
  base: B;
  padding: S;
  baseDensity: number;
  paddingDensity: number;
};

export const PIECE_KEYS: readonly (keyof PieceStats<unknown>)[] = [
  'helm',
  'torso',
  'rightArm',
  'leftArm',
  'legs',
] as const;

export type PieceKey = (typeof PIECE_KEYS)[number];
