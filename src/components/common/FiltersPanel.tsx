import { Fragment, type ReactNode } from 'react';
import { Button, Divider, Group, Paper, Text } from '@mantine/core';
import {
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  type MRT_RowData,
  type MRT_TableInstance,
} from 'mantine-react-table';

import SearchInput from './SearchInput.tsx';
import type { FilterValueRenderer } from './MultiSelectFilter.tsx';
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

const renderDefaultFilterValue = (value: string, onRemove?: () => void) => (
  <ValueBadge variant="default" fw={500} onRemove={onRemove} removeLabel={`Remove ${value} filter`}>
    {value}
  </ValueBadge>
);

/**
 * Panel above a table: name search, every active column filter (removable one value at a time)
 * and the table's view actions. Column filters themselves are edited in header popovers.
 */
const FiltersPanel = <T extends MRT_RowData>({
  table,
  search,
  onSearchChange,
  searchPlaceholder,
  renderFilterValue,
}: FiltersPanelProps<T>) => {
  const columnFilters = table.getState().columnFilters;
  const hasFilters = columnFilters.length > 0 || !!search;

  const clearAll = () => {
    table.resetColumnFilters(true);
    onSearchChange('');
  };

  return (
    <Paper withBorder shadow="xs" p="sm">
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md">
        <Group gap="sm" align="center" style={{ flex: 1 }} miw={0}>
          <SearchInput value={search} onChange={onSearchChange} placeholder={searchPlaceholder} />

          {columnFilters.map(({ id, value }) => {
            const column = table.getColumn(id);
            const values = (Array.isArray(value) ? value : [value]).map(String);

            const removeValue = (removed: string) => {
              const remaining = values.filter((v) => v !== removed);

              column.setFilterValue(
                Array.isArray(value) && remaining.length ? remaining : undefined,
              );
            };

            return (
              <Fragment key={id}>
                <Divider orientation="vertical" />

                <Group gap={6} wrap="wrap" aria-label={`${column.columnDef.header} filter`}>
                  <Text size="sm" c="dimmed" fw={500}>
                    {column.columnDef.header}:
                  </Text>

                  {values.map((v) => (
                    <Fragment key={v}>
                      {renderFilterValue?.(id, v, () => removeValue(v)) ??
                        renderDefaultFilterValue(v, () => removeValue(v))}
                    </Fragment>
                  ))}
                </Group>
              </Fragment>
            );
          })}

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
