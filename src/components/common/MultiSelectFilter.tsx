import { useCallback, type KeyboardEvent } from 'react';
import { Box, Group, MultiSelect, type MultiSelectProps } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import type { MRT_Column, MRT_RowData } from 'mantine-react-table';

import type { FilterOption, FilterValueRenderer } from '../../types/tableTypes.ts';
import { stopPropagation } from '../../utils/eventUtils.ts';

// Render the dropdown inside MRT's popover, so picking an option doesn't count as an outside
// click that closes the popover.
const COMBOBOX_PROPS: MultiSelectProps['comboboxProps'] = { withinPortal: false };
const STYLES: MultiSelectProps['styles'] = { pillsList: { gap: 4 } };

interface MultiSelectFilterProps<T extends MRT_RowData> {
  column: MRT_Column<T>;
  options: FilterOption[];
  renderValue: FilterValueRenderer;
}

/**
 * Column filter shown inside MRT's header popover. Replaces MRT's built-in multi-select so
 * selections render as the table's badges and there's a single clear button.
 *
 * Generic over the row type, so it's a plain generic function rather than `FC<Props>`.
 */
const MultiSelectFilter = <T extends MRT_RowData>({
  column,
  options,
  renderValue,
}: MultiSelectFilterProps<T>) => {
  // Not memoized: `column` is a mutable TanStack object, its reference doesn't change.
  const value = (column.getFilterValue() as string[] | undefined) ?? [];
  const header = column.columnDef.header;

  const handleChange = useCallback(
    (next: string[]) => column.setFilterValue(next.length ? next : undefined),
    [column],
  );

  // MRT closes the popover on Enter; keep Enter for picking options.
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter') stopPropagation(event);
  }, []);

  const renderPill = useCallback<NonNullable<MultiSelectProps['renderPill']>>(
    ({ value: pillValue, onRemove }) =>
      pillValue === undefined ? null : renderValue(String(pillValue), onRemove),
    [renderValue],
  );

  const renderOption = useCallback<NonNullable<MultiSelectProps['renderOption']>>(
    ({ option, checked }) => (
      <Group gap="xs" wrap="nowrap">
        {checked ? <IconCheck size={14} /> : <Box w={14} />}
        {renderValue(option.value)}
      </Group>
    ),
    [renderValue],
  );

  return (
    <MultiSelect
      w="100%"
      data={options}
      value={value}
      onChange={handleChange}
      placeholder={value.length ? undefined : `Filter by ${header}`}
      aria-label={`Filter by ${header}`}
      searchable
      clearable
      comboboxProps={COMBOBOX_PROPS}
      onKeyDown={handleKeyDown}
      renderPill={renderPill}
      renderOption={renderOption}
      styles={STYLES}
    />
  );
};

export default MultiSelectFilter;
