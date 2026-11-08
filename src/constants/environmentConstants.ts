import type { Environment } from '../types/resourceTypes.ts';

export const ENVIRONMENTS: Environment[] = ['production', 'staging', 'development'];

/** Mantine color per environment, used by badges. */
export const ENVIRONMENT_COLORS: Record<Environment, string> = {
  production: 'red',
  staging: 'yellow',
  development: 'gray',
};
