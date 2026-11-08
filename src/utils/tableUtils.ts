import type {
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_RowData,
  MRT_SortingState,
  MRT_TableOptions,
} from 'mantine-react-table';

import type { UrlFilterConfig } from '../types/tableTypes.ts';

// ---------------------------------------------------------------------------------------------
// Table setup
// ---------------------------------------------------------------------------------------------

/**
 * Options shared by the app's tables: no pagination, resizable columns, column filters in header
 * popovers, and search/actions moved to the FiltersPanel rendered above the table.
 */
export const sharedTableOptions = <T extends MRT_RowData>(): Partial<MRT_TableOptions<T>> => ({
  enablePagination: false,
  enableBottomToolbar: false,
  enableTopToolbar: false,
  enableGlobalFilter: false,
  enableColumnResizing: true,
  enableStickyHeader: true,
  columnFilterDisplayMode: 'popover',
  mantinePaperProps: { withBorder: true, shadow: 'xs' },
});

/** Returns the columns with resizing turned off for the last one (nothing to its right). */
export const disableLastColumnResizing = <T extends MRT_RowData>(
  columns: MRT_ColumnDef<T>[],
): MRT_ColumnDef<T>[] =>
  columns.map((column, index) =>
    index === columns.length - 1 ? { ...column, enableResizing: false } : column,
  );

// ---------------------------------------------------------------------------------------------
// Table state <-> URL
// ---------------------------------------------------------------------------------------------

const SORT_SEPARATOR = ',';
const SORT_DIRECTION_SEPARATOR = ':';

/** `"criticality:desc,name:asc"` → `[{ id: 'criticality', desc: true }, { id: 'name', desc: false }]` */
export const parseSorting = (raw: string | null, allowedIds: readonly string[]): MRT_SortingState =>
  (raw ?? '')
    .split(SORT_SEPARATOR)
    .map((part) => {
      const [id, direction] = part.split(SORT_DIRECTION_SEPARATOR);
      return { id, desc: direction === 'desc' };
    })
    .filter(({ id }) => allowedIds.includes(id));

export const serializeSorting = (sorting: MRT_SortingState): string =>
  sorting
    .map(({ id, desc }) => `${id}${SORT_DIRECTION_SEPARATOR}${desc ? 'desc' : 'asc'}`)
    .join(SORT_SEPARATOR);

export const parseColumnFilters = (
  params: URLSearchParams,
  config: UrlFilterConfig,
): MRT_ColumnFiltersState =>
  Object.entries(config).flatMap(([id, kind]): MRT_ColumnFiltersState => {
    if (kind === 'multi') {
      const values = params.getAll(id).filter(Boolean);
      return values.length ? [{ id, value: values }] : [];
    }
    const value = params.get(id);
    return value ? [{ id, value }] : [];
  });

/** Returns a copy of `params` where every configured filter param reflects `filters`. */
export const writeColumnFilters = (
  params: URLSearchParams,
  filters: MRT_ColumnFiltersState,
  config: UrlFilterConfig,
): URLSearchParams => {
  const next = new URLSearchParams(params);
  Object.keys(config).forEach((id) => next.delete(id));

  filters.forEach(({ id, value }) => {
    if (!(id in config)) return;
    const values = (Array.isArray(value) ? value : [value]).map(String).filter(Boolean);
    values.forEach((v) => next.append(id, v));
  });

  return next;
};
