import type { Provider } from '../types/resourceTypes.ts';

export const PROVIDERS: Provider[] = ['AWS', 'GCP', 'Azure'];

/** Mantine color per provider, used by badges and graph nodes. */
export const PROVIDER_COLORS: Record<Provider, string> = {
  AWS: 'orange',
  GCP: 'blue',
  Azure: 'cyan',
};
