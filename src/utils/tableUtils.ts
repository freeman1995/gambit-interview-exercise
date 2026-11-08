import type {
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_RowData,
  MRT_RowSelectionState,
  MRT_SortingState,
  MRT_TableOptions,
} from 'mantine-react-table';

import type { FilterOption, UrlFilterConfig } from '../types/tableTypes.ts';

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

/** `getRowId` for rows that carry their own id. */
export const getRowIdFromId = <T extends { id: string }>(row: T): string => row.id;

/** Ids of the given columns (explicit `id`, else `accessorKey`). */
export const getColumnIds = <T extends MRT_RowData>(columns: MRT_ColumnDef<T>[]): string[] =>
  columns.map((column) => column.id ?? String(column.accessorKey));

/** Ids of the selected rows. */
export const getSelectedIds = (rowSelection: MRT_RowSelectionState): string[] =>
  Object.keys(rowSelection).filter((id) => rowSelection[id]);

// ---------------------------------------------------------------------------------------------
// Filtering & sorting
// ---------------------------------------------------------------------------------------------

/**
 * The part of a table row that filter/sorting functions use. Typed structurally so the helpers
 * below fit any table's `filterFn` / `sortingFn` without generics.
 */
interface RowWithValues {
  getValue<V>(columnId: string): V;
}

/** Multi-select `filterFn`: matches when the cell value (or any of its items) is selected. */
export const matchesAnyOf = (
  row: RowWithValues,
  columnId: string,
  filterValue: string[] | undefined,
): boolean => {
  if (!filterValue?.length) return true;
  const value = row.getValue<string | string[]>(columnId);
  return Array.isArray(value)
    ? value.some((item) => filterValue.includes(item))
    : filterValue.includes(value);
};

/** `sortingFn` that orders by the value's position in `order` instead of alphabetically. */
export const byRank =
  (order: readonly string[]) =>
  (rowA: RowWithValues, rowB: RowWithValues, columnId: string): number =>
    order.indexOf(rowA.getValue<string>(columnId)) - order.indexOf(rowB.getValue<string>(columnId));

/** `sortingFn` for array cells: compares the items joined into one string. */
export const byJoinedValues = (
  rowA: RowWithValues,
  rowB: RowWithValues,
  columnId: string,
): number =>
  rowA
    .getValue<string[]>(columnId)
    .join(',')
    .localeCompare(rowB.getValue<string[]>(columnId).join(','));

/** Filter options whose label is the value itself. */
export const toFilterOptions = (values: readonly string[]): FilterOption[] =>
  values.map((value) => ({ value, label: value }));

/** A column filter value (single or multi) as a list of strings. */
export const toFilterValues = (value: unknown): string[] =>
  (Array.isArray(value) ? value : [value]).map(String);

/**
 * The filter value with `removed` taken out: the remaining values of a multi filter, or
 * `undefined` (no filter) when nothing is left / for single-value filters.
 */
export const withoutFilterValue = (value: unknown, removed: string): string[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  const remaining = toFilterValues(value).filter((v) => v !== removed);
  return remaining.length ? remaining : undefined;
};

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
    toFilterValues(value)
      .filter(Boolean)
      .forEach((v) => next.append(id, v));
  });

  return next;
};
