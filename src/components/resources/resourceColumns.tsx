import { Group } from '@mantine/core';
import type { MRT_ColumnDef, MRT_FilterFn, MRT_SortingFn } from 'mantine-react-table';

import { CRITICALITIES } from '../../constants/criticalityConstants.ts';
import { ENVIRONMENTS } from '../../constants/environmentConstants.ts';
import { PROVIDERS } from '../../constants/providerConstants.ts';
import { RESOURCES } from '../../data/resources.ts';
import type { Criticality, Environment, Provider, Resource } from '../../types/resourceTypes.ts';
import type { UrlFilterConfig } from '../../types/tableTypes.ts';
import { disableLastColumnResizing } from '../../utils/tableUtils.ts';
import MultiSelectFilter from '../common/MultiSelectFilter.tsx';
import {
  CriticalityBadge,
  EnvironmentBadge,
  ProviderBadge,
  renderResourceFilterValue,
  TagBadge,
} from './ResourceBadges.tsx';

const uniqueSorted = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b));

/** Multi-select filter: matches when the cell value (or any of its items, for arrays) is selected. */
const matchesAnyOf: MRT_FilterFn<Resource> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true;
  const value = row.getValue<string | string[]>(columnId);
  return Array.isArray(value)
    ? value.some((item) => filterValue.includes(item))
    : filterValue.includes(value);
};

/** Sorts by the position of the value in `order` instead of alphabetically. */
const byRank =
  (order: readonly string[]): MRT_SortingFn<Resource> =>
  (rowA, rowB, columnId) =>
    order.indexOf(rowA.getValue(columnId)) - order.indexOf(rowB.getValue(columnId));

const byJoinedTags: MRT_SortingFn<Resource> = (rowA, rowB, columnId) =>
  rowA
    .getValue<string[]>(columnId)
    .join(',')
    .localeCompare(rowB.getValue<string[]>(columnId).join(','));

/** Multi-select filter whose options and selections look like the column's cells. */
const multiSelectFilter = (
  columnId: string,
  values: string[],
): Partial<MRT_ColumnDef<Resource>> => {
  const options = values.map((value) => ({ value, label: value }));
  return {
    filterFn: matchesAnyOf,
    Filter: ({ column }) => (
      <MultiSelectFilter
        column={column}
        options={options}
        renderValue={(value, onRemove) => renderResourceFilterValue(columnId, value, onRemove)}
      />
    ),
  };
};

export const resourceColumns = disableLastColumnResizing<Resource>([
  {
    accessorKey: 'name',
    header: 'Name',
    size: 240,
    // Name is searched through the debounced search box in the filters panel.
    enableColumnFilter: false,
  },
  {
    accessorKey: 'id',
    header: 'ID',
    size: 130,
    filterFn: 'contains',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    size: 200,
    ...multiSelectFilter('type', uniqueSorted(RESOURCES.map((r) => r.type))),
  },
  {
    accessorKey: 'provider',
    header: 'Provider',
    size: 150,
    ...multiSelectFilter('provider', PROVIDERS),
    Cell: ({ cell }) => <ProviderBadge value={cell.getValue<Provider>()} />,
  },
  {
    accessorKey: 'region',
    header: 'Region',
    size: 160,
    ...multiSelectFilter('region', uniqueSorted(RESOURCES.map((r) => r.region))),
  },
  {
    accessorKey: 'environment',
    header: 'Environment',
    size: 170,
    ...multiSelectFilter('environment', ENVIRONMENTS),
    sortingFn: byRank([...ENVIRONMENTS].reverse()),
    Cell: ({ cell }) => <EnvironmentBadge value={cell.getValue<Environment>()} />,
  },
  {
    accessorKey: 'criticality',
    header: 'Criticality',
    size: 160,
    ...multiSelectFilter('criticality', CRITICALITIES),
    sortingFn: byRank(CRITICALITIES),
    Cell: ({ cell }) => <CriticalityBadge value={cell.getValue<Criticality>()} />,
  },
  {
    accessorKey: 'owner',
    header: 'Owner',
    size: 170,
    ...multiSelectFilter('owner', uniqueSorted(RESOURCES.map((r) => r.owner))),
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    size: 240,
    ...multiSelectFilter('tags', uniqueSorted(RESOURCES.flatMap((r) => r.tags))),
    sortingFn: byJoinedTags,
    Cell: ({ cell }) => (
      <Group gap={4} wrap="wrap">
        {cell.getValue<string[]>().map((tag) => (
          <TagBadge key={tag} value={tag} />
        ))}
      </Group>
    ),
  },
]);

export const RESOURCE_SORTABLE_COLUMN_IDS = resourceColumns.map((c) => c.accessorKey as string);

/** Which column filters are mirrored in the URL, and how. */
export const RESOURCE_URL_FILTERS: UrlFilterConfig = {
  id: 'text',
  type: 'multi',
  provider: 'multi',
  region: 'multi',
  environment: 'multi',
  criticality: 'multi',
  owner: 'multi',
  tags: 'multi',
};
