import { Fragment, useCallback, useMemo, type FC, type ReactNode } from 'react';
import { Group, Text } from '@mantine/core';

import { toFilterValues, withoutFilterValue } from '../../utils/tableUtils.ts';

interface ActiveColumnFilterProps {
  columnId: string;
  label: string;
  /** The column's current filter value (a string, or an array for multi filters). */
  value: unknown;
  onFilterChange(columnId: string, value: string[] | undefined): void;
  renderFilterValue(columnId: string, value: string, onRemove: () => void): ReactNode;
}

/** One column's active filter in the FiltersPanel: its label and each value, removable. */
const ActiveColumnFilter: FC<ActiveColumnFilterProps> = ({
  columnId,
  label,
  value,
  onFilterChange,
  renderFilterValue,
}) => {
  const values = useMemo(() => toFilterValues(value), [value]);

  const removeValue = useCallback(
    (removed: string) => onFilterChange(columnId, withoutFilterValue(value, removed)),
    [columnId, value, onFilterChange],
  );

  return (
    <Group gap={6} wrap="wrap" aria-label={`${label} filter`}>
      <Text size="sm" c="dimmed" fw={500}>
        {label}:
      </Text>

      {values.map((v) => (
        <Fragment key={v}>{renderFilterValue(columnId, v, () => removeValue(v))}</Fragment>
      ))}
    </Group>
  );
};

export default ActiveColumnFilter;
