import { Group } from '@mantine/core';
import type { MRT_ColumnDef } from 'mantine-react-table';

import { CRITICALITIES } from '../../constants/criticalityConstants.ts';
import { ENVIRONMENTS } from '../../constants/environmentConstants.ts';
import { PROVIDERS } from '../../constants/providerConstants.ts';
import { RESOURCES } from '../../data/resources.ts';
import type { Criticality, Environment, Provider, Resource } from '../../types/resourceTypes.ts';
import type { UrlFilterConfig } from '../../types/tableTypes.ts';
import { uniqueSorted } from '../../utils/arrayUtils.ts';
import {
  byJoinedValues,
  byRank,
  disableLastColumnResizing,
  getColumnIds,
  matchesAnyOf,
  toFilterOptions,
} from '../../utils/tableUtils.ts';
import MultiSelectFilter from '../common/MultiSelectFilter.tsx';
import ResourceColumnBadge, {
  CriticalityBadge,
  EnvironmentBadge,
  ProviderBadge,
  TagBadge,
} from './ResourceColumnBadge.tsx';

/** Multi-select filter whose options and selections look like the column's cells. */
const multiSelectFilter = (
  columnId: string,
  values: readonly string[],
): Partial<MRT_ColumnDef<Resource>> => {
  const options = toFilterOptions(values);

  return {
    filterFn: matchesAnyOf,
    Filter: ({ column }) => (
      <MultiSelectFilter
        column={column}
        options={options}
        renderValue={(value, onRemove) => (
          <ResourceColumnBadge columnId={columnId} value={value} onRemove={onRemove} />
        )}
      />
    ),
  };
};

const resourceColumns = disableLastColumnResizing<Resource>([
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
    sortingFn: byJoinedValues,
    Cell: ({ cell }) => (
      <Group gap={4} wrap="wrap">
        {cell.getValue<string[]>().map((tag) => (
          <TagBadge key={tag} value={tag} />
        ))}
      </Group>
    ),
  },
]);

export const RESOURCE_SORTABLE_COLUMN_IDS = getColumnIds(resourceColumns);

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

export default resourceColumns;
