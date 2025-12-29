import type { SetStats } from '../types';
import { risarBerserkerSamples } from './risarBerserker';
import { kallardianNorseSamples } from './kallardianNorse';
import { khuriteSplintedSamples } from './khuriteSplinted';
import { rangerArmorSamples } from './rangerArmor';

export { risarBerserkerSamples } from './risarBerserker';
export { kallardianNorseSamples } from './kallardianNorse';
export { khuriteSplintedSamples } from './khuriteSplinted';
export { rangerArmorSamples } from './rangerArmor';

export const samples: SetStats[] = [
  ...risarBerserkerSamples,
  ...kallardianNorseSamples,
  ...khuriteSplintedSamples,
  ...rangerArmorSamples,
];
