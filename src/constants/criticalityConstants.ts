import type { Criticality } from '../types/resourceTypes.ts';

/** Ordered from least to most critical (also used for sorting). */
export const CRITICALITIES: Criticality[] = ['low', 'medium', 'high', 'critical'];

/** Mantine color per criticality, used by badges and graph nodes. */
export const CRITICALITY_COLORS: Record<Criticality, string> = {
  low: 'gray',
  medium: 'yellow',
  high: 'orange',
  critical: 'red',
};
