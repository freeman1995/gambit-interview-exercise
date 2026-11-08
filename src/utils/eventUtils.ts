import type { KeyboardEvent, SyntheticEvent } from 'react';

/** Keys that activate a custom `role="button"` element. */
export const isActivationKey = (event: KeyboardEvent): boolean =>
  event.key === 'Enter' || event.key === ' ';

export const preventDefault = (event: SyntheticEvent): void => event.preventDefault();

export const stopPropagation = (event: SyntheticEvent): void => event.stopPropagation();
