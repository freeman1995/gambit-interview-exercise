/** Shortens `text` to at most `max` characters, ending with an ellipsis when cut. */
export const truncate = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;

/** `pluralize(1, 'resource')` → `"1 resource"`, `pluralize(3, 'resource')` → `"3 resources"`. */
export const pluralize = (count: number, singular: string, plural = `${singular}s`): string =>
  `${count} ${count === 1 ? singular : plural}`;
