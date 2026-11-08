import { Fragment, useCallback, type ReactNode } from 'react';
import { Button, Divider, Group, Paper, Text } from '@mantine/core';
import {
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  type MRT_RowData,
  type MRT_TableInstance,
} from 'mantine-react-table';

import type { FilterValueRenderer } from '../../types/tableTypes.ts';
import ActiveColumnFilter from './ActiveColumnFilter.tsx';
import SearchInput from './SearchInput.tsx';
import ValueBadge from './ValueBadge.tsx';

interface FiltersPanelProps<T extends MRT_RowData> {
  table: MRT_TableInstance<T>;
  search: string;
  onSearchChange(value: string): void;
  searchPlaceholder: string;
  /**
   * Renders an active filter value like the column's cells. Returning nothing falls back to a
   * neutral badge (used for plain-text columns).
   */
  renderFilterValue?: (columnId: string, ...args: Parameters<FilterValueRenderer>) => ReactNode;
}

/**
 * Panel above a table: name search, every active column filter (removable one value at a time)
 * and the table's view actions. Column filters themselves are edited in header popovers.
 *
 * Generic over the row type, so it's a plain generic function rather than `FC<Props>`.
 */
const FiltersPanel = <T extends MRT_RowData>({
  table,
  search,
  onSearchChange,
  searchPlaceholder,
  renderFilterValue,
}: FiltersPanelProps<T>) => {
  // Not memoized: `table` is a mutable TanStack instance, its reference doesn't change.
  const columnFilters = table.getState().columnFilters;
  const hasFilters = columnFilters.length > 0 || !!search;

  const clearAll = useCallback(() => {
    table.resetColumnFilters(true);
    onSearchChange('');
  }, [table, onSearchChange]);

  const setColumnFilter = useCallback(
    (columnId: string, value: string[] | undefined) =>
      table.getColumn(columnId).setFilterValue(value),
    [table],
  );

  const renderValue = useCallback(
    (columnId: string, value: string, onRemove: () => void) =>
      renderFilterValue?.(columnId, value, onRemove) ?? (
        <ValueBadge
          variant="default"
          fw={500}
          onRemove={onRemove}
          removeLabel={`Remove ${value} filter`}
        >
          {value}
        </ValueBadge>
      ),
    [renderFilterValue],
  );

  return (
    <Paper withBorder shadow="xs" p="sm">
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md">
        <Group gap="sm" align="center" style={{ flex: 1 }} miw={0}>
          <SearchInput value={search} onChange={onSearchChange} placeholder={searchPlaceholder} />

          {columnFilters.map(({ id, value }) => (
            <Fragment key={id}>
              <Divider orientation="vertical" />
              <ActiveColumnFilter
                columnId={id}
                label={String(table.getColumn(id).columnDef.header)}
                value={value}
                onFilterChange={setColumnFilter}
                renderFilterValue={renderValue}
              />
            </Fragment>
          ))}

          {!columnFilters.length && (
            <Text size="sm" c="dimmed">
              Use the filter icons in the column headers to filter.
            </Text>
          )}
        </Group>

        <Group gap={4} wrap="nowrap">
          {hasFilters && (
            <Button variant="subtle" color="gray" size="xs" onClick={clearAll}>
              Clear all
            </Button>
          )}
          <MRT_ShowHideColumnsButton table={table} />
          <MRT_ToggleDensePaddingButton table={table} />
        </Group>
      </Group>
    </Paper>
  );
};

export default FiltersPanel;
