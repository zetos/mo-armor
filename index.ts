type armorStyle =
  | 'Ranger Armor'
  | 'Risar Berseker'
  | 'Kallardian Norse'
  | 'Khurite Splinted';

type baseMaterial =
  | 'Ironfur'
  | 'Ironsilk'
  | 'Ironwool'
  | 'Bloodsilk'
  | 'Keeled Scales'
  | 'Plate Scales'
  | 'Placoid Scales'
  | 'Pansar Scales'
  | 'Arthropod Carapace';

type supportMaterial = 'Ironfur' | 'Ironsilk' | 'Ironwool' | 'Bloodsilk';

type materialUsage = {
  base: number;
  padding: number;
};

type setStats = {
  armorStyle: armorStyle;
  base: baseMaterial;
  padding: supportMaterial;
  baseDensity: number;
  paddingDensity: number;
  setWeight: number;
  setDura: number;
  setMaterialUsage: materialUsage;
  setDefense: {
    blunt: number;
    pierce: number;
    slash: number;
  };
  pieceWeight: {
    helm: number;
    torso: number;
    rightArm: number;
    leftArm: number;
    legs: number;
  };
  pieceDurability: {
    helm: number;
    torso: number;
    rightArm: number;
    leftArm: number;
    legs: number;
  };
  pieceMaterialUsage: {
    helm: materialUsage;
    torso: materialUsage;
    rightArm: materialUsage;
    leftArm: materialUsage;
    legs: materialUsage;
  };
};

function calculateSetStatus<B extends baseMaterial, S extends supportMaterial>({
  armorStyle,
  base,
  padding,
  baseDensity = 100,
  paddingDensity = 100,
}: {
  armorStyle: armorStyle;
  base: B;
  padding: S;
  baseDensity: number;
  paddingDensity: number;
}): setStats {
  throw new Error('Not implemented.');
}

const samples: setStats[] = [
  {
    armorStyle: 'Risar Berseker',
    base: 'Arthropod Carapace',
    padding: 'Ironfur',
    baseDensity: 100,
    paddingDensity: 100,
    setWeight: 9.95,
    setDura: 2676.2,
    setMaterialUsage: {
      base: 572,
      padding: 404,
    },
    setDefense: {
      blunt: 46.38,
      pierce: 38.88,
      slash: 42.08,
    },
    pieceWeight: {
      helm: 1.19,
      torso: 3.18,
      rightArm: 1.29,
      leftArm: 1.29,
      legs: 2.99,
    },
    pieceDurability: {
      helm: 535.24,
      torso: 669.05,
      rightArm: 401.43,
      leftArm: 401.43,
      legs: 669.05,
    },
    pieceMaterialUsage: {
      helm: {
        base: 69,
        padding: 48,
      },
      torso: {
        base: 188,
        padding: 134,
      },
      rightArm: {
        base: 69,
        padding: 48,
      },
      leftArm: {
        base: 69,
        padding: 48,
      },
      legs: {
        base: 177,
        padding: 126,
      },
    },
  },
  {
    armorStyle: 'Risar Berseker',
    base: 'Arthropod Carapace',
    padding: 'Ironfur',
    baseDensity: 100,
    paddingDensity: 50,
    setWeight: 9.25,
    setDura: 2454.2,
    setMaterialUsage: {
      base: 572,
      padding: 269,
    },
    setDefense: {
      blunt: 41.05,
      pierce: 35.63,
      slash: 38.78,
    },
    pieceWeight: {
      helm: 1.11,
      torso: 2.96,
      rightArm: 1.2,
      leftArm: 1.2,
      legs: 2.78,
    },
    pieceDurability: {
      helm: 490.84,
      torso: 613.55,
      rightArm: 368.13,
      leftArm: 368.13,
      legs: 613.55,
    },
    pieceMaterialUsage: {
      helm: {
        base: 69,
        padding: 32,
      },
      torso: {
        base: 188,
        padding: 89,
      },
      rightArm: {
        base: 69,
        padding: 32,
      },
      leftArm: {
        base: 69,
        padding: 32,
      },
      legs: {
        base: 177,
        padding: 84,
      },
    },
  },
  {
    armorStyle: 'Kallardian Norse',
    base: 'Plate Scales',
    padding: 'Ironfur',
    baseDensity: 100,
    paddingDensity: 100,
    setWeight: 7.4,
    setDura: 1975.5,
    setMaterialUsage: {
      base: 254,
      padding: 404,
    },
    setDefense: {
      blunt: 47.87,
      pierce: 41.6,
      slash: 37.6,
    },
    pieceWeight: {
      helm: 0.89,
      torso: 2.37,
      rightArm: 0.96,
      leftArm: 0.96,
      legs: 2.22,
    },
    pieceDurability: {
      helm: 395.1,
      torso: 493.88,
      rightArm: 296.33,
      leftArm: 296.33,
      legs: 493.88,
    },
    pieceMaterialUsage: {
      helm: {
        base: 31,
        padding: 48,
      },
      torso: {
        base: 81,
        padding: 130,
      },
      rightArm: {
        base: 33,
        padding: 52,
      },
      leftArm: {
        base: 33,
        padding: 52,
      },
      legs: {
        base: 76,
        padding: 122,
      },
    },
  },
  {
    armorStyle: 'Khurite Splinted',
    base: 'Plate Scales',
    padding: 'Ironfur',
    baseDensity: 100,
    paddingDensity: 100,
    setWeight: 11.86,
    setDura: 2939,
    setMaterialUsage: {
      base: 431,
      padding: 404,
    },
    setDefense: {
      blunt: 58.64,
      pierce: 47.72,
      slash: 44.88,
    },
    pieceWeight: {
      helm: 1.42,
      torso: 3.8,
      rightArm: 1.54,
      leftArm: 1.54,
      legs: 3.56,
    },
    pieceDurability: {
      helm: 587.8,
      torso: 734.75,
      rightArm: 440.85,
      leftArm: 440.85,
      legs: 734.75,
    },
    pieceMaterialUsage: {
      helm: {
        base: 52,
        padding: 48,
      },
      torso: {
        base: 142,
        padding: 134,
      },
      rightArm: {
        base: 52,
        padding: 48,
      },
      leftArm: {
        base: 52,
        padding: 48,
      },
      legs: {
        base: 133,
        padding: 126,
      },
    },
  },
];
