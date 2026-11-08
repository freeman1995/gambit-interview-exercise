/** Distinct values, sorted alphabetically. */
export const uniqueSorted = (values: readonly string[]): string[] =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b));
