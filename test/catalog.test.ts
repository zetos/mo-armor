import { describe, expect, it } from 'bun:test';
import {
  ARMOR_MATERIAL_CATALOG,
  ARMOR_STYLE_CATALOG,
  getArmorMaterialById,
  getArmorStyleById,
  isCoreCompatible,
} from '../src/catalog/armor';

describe('MortalData armor catalog', () => {
  it('contains the observed catalog totals', () => {
    expect(ARMOR_STYLE_CATALOG).toHaveLength(13);
    expect(ARMOR_MATERIAL_CATALOG).toHaveLength(57);
    expect(
      ARMOR_MATERIAL_CATALOG.filter((material) => material.padding),
    ).toHaveLength(16);
  });

  it('has unique IDs and names', () => {
    expect(new Set(ARMOR_STYLE_CATALOG.map((style) => style.id)).size).toBe(13);
    expect(new Set(ARMOR_STYLE_CATALOG.map((style) => style.name)).size).toBe(13);
    expect(new Set(ARMOR_MATERIAL_CATALOG.map((material) => material.id)).size).toBe(
      57,
    );
    expect(
      new Set(ARMOR_MATERIAL_CATALOG.map((material) => material.name)).size,
    ).toBe(57);
  });

  it('matches the three observed Core selector sizes', () => {
    const hard = getArmorStyleById(309)!;
    const mediumScale = getArmorStyleById(433)!;
    const soft = getArmorStyleById(391)!;

    expect(
      ARMOR_MATERIAL_CATALOG.filter((material) =>
        isCoreCompatible(hard, material),
      ),
    ).toHaveLength(38);
    expect(
      ARMOR_MATERIAL_CATALOG.filter((material) =>
        isCoreCompatible(mediumScale, material),
      ),
    ).toHaveLength(22);
    expect(
      ARMOR_MATERIAL_CATALOG.filter((material) =>
        isCoreCompatible(soft, material),
      ),
    ).toHaveLength(19);
  });

  it('uses MortalData canonical names', () => {
    expect(getArmorMaterialById(110)?.name).toBe('Rawhide');
  });
});
