import { useSearchParams } from 'react-router';
import type { MRT_ColumnFiltersState, MRT_SortingState, MRT_Updater } from 'mantine-react-table';

import { URL_PARAMS } from '../constants/tableConstants.ts';
import type { UrlFilterConfig } from '../types/tableTypes.ts';
import {
  parseColumnFilters,
  parseSorting,
  serializeSorting,
  writeColumnFilters,
} from '../utils/tableUtils.ts';

const resolveUpdater = <T>(updater: MRT_Updater<T>, previous: T): T =>
  updater instanceof Function ? updater(previous) : updater;

/**
 * Keeps a table's search / column filters / sorting in the URL,
 * so they survive refreshes and can be deep-linked (e.g. `/resources?q=auth-keyvault`).
 */
export const useTableUrlState = (
  filterConfig: UrlFilterConfig,
  sortableColumnIds: readonly string[],
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get(URL_PARAMS.search) ?? '';
  const sorting = parseSorting(searchParams.get(URL_PARAMS.sort), sortableColumnIds);
  const columnFilters = parseColumnFilters(searchParams, filterConfig);

  // Build on the *current* URL rather than react-router's `prev`, which is the snapshot from the
  // last render: two updates in one tick (e.g. "Clear all" resetting filters and search) would
  // otherwise overwrite each other. `replace` so typing / toggling filters doesn't flood history.
  const updateParams = (mutate: (params: URLSearchParams) => URLSearchParams) =>
    setSearchParams(mutate(new URLSearchParams(window.location.search)), { replace: true });

  const setSearch = (value: string) =>
    updateParams((prev) => {
      const next = new URLSearchParams(prev);
      const trimmed = value.trim();
      if (trimmed) next.set(URL_PARAMS.search, trimmed);
      else next.delete(URL_PARAMS.search);
      return next;
    });

  const onSortingChange = (updater: MRT_Updater<MRT_SortingState>) =>
    updateParams((prev) => {
      const next = new URLSearchParams(prev);
      const serialized = serializeSorting(resolveUpdater(updater, sorting));
      if (serialized) next.set(URL_PARAMS.sort, serialized);
      else next.delete(URL_PARAMS.sort);
      return next;
    });

  const onColumnFiltersChange = (updater: MRT_Updater<MRT_ColumnFiltersState>) =>
    updateParams((prev) =>
      writeColumnFilters(prev, resolveUpdater(updater, columnFilters), filterConfig),
    );

  return { search, setSearch, sorting, onSortingChange, columnFilters, onColumnFiltersChange };
};
