import type { ReactNode } from 'react';
import { Box, Group, MultiSelect } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import type { MRT_Column, MRT_RowData } from 'mantine-react-table';

export interface FilterOption {
  value: string;
  label: string;
}

/** Renders a filter value the same way the table renders it; `onRemove` adds a × button. */
export type FilterValueRenderer = (value: string, onRemove?: () => void) => ReactNode;

interface MultiSelectFilterProps<T extends MRT_RowData> {
  column: MRT_Column<T>;
  options: FilterOption[];
  renderValue: FilterValueRenderer;
}

/**
 * Column filter shown inside MRT's header popover. Replaces MRT's built-in multi-select so
 * selections render as the table's badges and there's a single clear button.
 */
const MultiSelectFilter = <T extends MRT_RowData>({
  column,
  options,
  renderValue,
}: MultiSelectFilterProps<T>) => {
  const value = (column.getFilterValue() as string[] | undefined) ?? [];

  return (
    <MultiSelect
      w="100%"
      data={options}
      value={value}
      onChange={(next) => column.setFilterValue(next.length ? next : undefined)}
      placeholder={value.length ? undefined : `Filter by ${column.columnDef.header}`}
      aria-label={`Filter by ${column.columnDef.header}`}
      searchable
      clearable
      // Render the dropdown inside MRT's popover, so picking an option doesn't count as an
      // outside click that closes the popover.
      comboboxProps={{ withinPortal: false }}
      // MRT closes the popover on Enter; keep Enter for picking options.
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.stopPropagation();
      }}
      renderPill={({ value: pillValue, onRemove }) =>
        pillValue === undefined ? null : renderValue(String(pillValue), onRemove)
      }
      renderOption={({ option, checked }) => (
        <Group gap="xs" wrap="nowrap">
          {checked ? <IconCheck size={14} /> : <Box w={14} />}
          {renderValue(option.value)}
        </Group>
      )}
      styles={{ pillsList: { gap: 4 } }}
    />
  );
};

export default MultiSelectFilter;
