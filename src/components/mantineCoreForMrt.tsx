/**
 * ⚠️ Not imported anywhere directly, so IDEs report "0 usages" — but it IS used:
 * `vite.config.ts` (mantineReactTableCompat plugin) resolves `@mantine/core` to this module for
 * every import made by `mantine-react-table`. Deleting it breaks the app at startup.
 *
 * Why: Mantine React Table v2 (beta) targets Mantine 7, where `<Collapse>` is controlled by an
 * `in` prop. Mantine 9 renamed it to `expanded`, so MRT's filter popovers/rows, alert banner,
 * global filter and progress bars never open (and React warns about an unknown `in` attribute).
 * Everything else is re-exported from Mantine as-is.
 */
import type { FC } from 'react';
import { Collapse as MantineCollapse, type CollapseProps } from '@mantine/core';

// eslint-disable-next-line react-refresh/only-export-components
export * from '@mantine/core';

type LegacyCollapseProps = Omit<CollapseProps, 'expanded'> & { in?: boolean; expanded?: boolean };

export const Collapse: FC<LegacyCollapseProps> = ({ in: legacyIn, expanded, ...props }) => (
  <MantineCollapse expanded={expanded ?? legacyIn ?? false} {...props} />
);
