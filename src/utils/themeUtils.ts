/** CSS variable of a Mantine palette color, e.g. `var(--mantine-color-indigo-6)`. */
export const mantineColorVar = (name: string, shade = 6): string =>
  `var(--mantine-color-${name}-${shade})`;
