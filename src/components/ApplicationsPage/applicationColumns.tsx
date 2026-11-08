import { Badge, Group, Text } from '@mantine/core';
import type { MRT_FilterFn } from 'mantine-react-table';
import { Link } from 'react-router';

import { RESOURCES, RESOURCES_BY_ID } from '../../data/resources.ts';
import type { Application } from '../../types/applicationTypes.ts';
import type { Resource } from '../../types/resourceTypes.ts';
import type { UrlFilterConfig } from '../../types/tableTypes.ts';
import { resourceSearchPath } from '../../utils/routingUtils.ts';
import { disableLastColumnResizing } from '../../utils/tableUtils.ts';
import MultiSelectFilter from '../common/MultiSelectFilter.tsx';
import ValueBadge from '../common/ValueBadge.tsx';

export const resolveResources = (application: Application): Resource[] =>
  application.resourceIds
    .map((id) => RESOURCES_BY_ID.get(id))
    .filter((resource): resource is Resource => !!resource);

/** A resource as shown in the Resources column; also used for that column's filter values. */
export const renderResourceIdValue = (resourceId: string, onRemove?: () => void) => {
  const name = RESOURCES_BY_ID.get(resourceId)?.name ?? resourceId;
  return (
    <ValueBadge variant="light" onRemove={onRemove} removeLabel={`Remove ${name} filter`}>
      {name}
    </ValueBadge>
  );
};

const containsAnyResource: MRT_FilterFn<Application> = (row, _columnId, filterValue: string[]) =>
  !filterValue?.length || row.original.resourceIds.some((id) => filterValue.includes(id));

const RESOURCE_OPTIONS = RESOURCES.map((r) => ({ value: r.id, label: r.name })).sort((a, b) =>
  a.label.localeCompare(b.label),
);

export const applicationColumns = disableLastColumnResizing<Application>([
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
    accessorFn: (application) =>
      resolveResources(application)
        .map((resource) => resource.name)
        .join(', '),
    sortingFn: (rowA, rowB) => rowA.original.resourceIds.length - rowB.original.resourceIds.length,
    filterFn: containsAnyResource,
    Filter: ({ column }) => (
      <MultiSelectFilter
        column={column}
        options={RESOURCE_OPTIONS}
        renderValue={renderResourceIdValue}
      />
    ),
    Cell: ({ row }) => (
      <Group gap={4} wrap="wrap">
        {resolveResources(row.original).map((resource) => (
          // Same as clicking the resource in the graph: open it on the Resources page.
          <Badge
            key={resource.id}
            variant="light"
            tt="none"
            component={Link}
            to={resourceSearchPath(resource.name)}
            // Don't also open the graph modal (row click).
            onClick={(event) => event.stopPropagation()}
            style={{ cursor: 'pointer' }}
            title={`Show ${resource.name} in resources`}
          >
            {resource.name}
          </Badge>
        ))}
      </Group>
    ),
  },
]);

export const APPLICATION_SORTABLE_COLUMN_IDS = ['name', 'id', 'description', 'resourceIds'];

export const APPLICATION_URL_FILTERS: UrlFilterConfig = {
  id: 'text',
  description: 'text',
  resourceIds: 'multi',
};
