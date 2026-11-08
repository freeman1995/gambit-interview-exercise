import { Text } from '@mantine/core';

import { RESOURCES } from '../../data/resources.ts';
import type { Application } from '../../types/applicationTypes.ts';
import type { FilterValueRenderer, UrlFilterConfig } from '../../types/tableTypes.ts';
import { toResourceOptions } from '../../utils/resourceUtils.ts';
import { disableLastColumnResizing, getColumnIds, matchesAnyOf } from '../../utils/tableUtils.ts';
import MultiSelectFilter from '../common/MultiSelectFilter.tsx';
import ResourceIdBadge from './ResourceIdBadge.tsx';
import ResourceLinkBadges from './ResourceLinkBadges.tsx';

const RESOURCE_OPTIONS = toResourceOptions(RESOURCES);

const renderResourceIdValue: FilterValueRenderer = (resourceId, onRemove) => (
  <ResourceIdBadge resourceId={resourceId} onRemove={onRemove} />
);

const applicationColumns = disableLastColumnResizing<Application>([
  {
    accessorKey: 'name',
    header: 'Name',
    size: 220,
    // Searched through the filters panel.
    enableColumnFilter: false,
  },
  { accessorKey: 'id', header: 'ID', size: 320, filterFn: 'contains' },
  {
    id: 'description',
    accessorFn: (application) => application.description ?? '',
    header: 'Description',
    size: 280,
    filterFn: 'contains',
    Cell: ({ cell }) =>
      cell.getValue<string>() || (
        <Text c="dimmed" size="sm">
          —
        </Text>
      ),
  },
  {
    id: 'resourceIds',
    header: 'Resources',
    size: 420,
    accessorFn: (application) => application.resourceIds,
    sortingFn: (rowA, rowB) => rowA.original.resourceIds.length - rowB.original.resourceIds.length,
    filterFn: matchesAnyOf,
    Filter: ({ column }) => (
      <MultiSelectFilter
        column={column}
        options={RESOURCE_OPTIONS}
        renderValue={renderResourceIdValue}
      />
    ),
    Cell: ({ row }) => <ResourceLinkBadges application={row.original} />,
  },
]);

export const APPLICATION_SORTABLE_COLUMN_IDS = getColumnIds(applicationColumns);

/** Which column filters are mirrored in the URL, and how. */
export const APPLICATION_URL_FILTERS: UrlFilterConfig = {
  id: 'text',
  description: 'text',
  resourceIds: 'multi',
};

export default applicationColumns;
