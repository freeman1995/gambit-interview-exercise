import { useState } from 'react';
import { Group, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  getMRT_RowSelectionHandler,
  MantineReactTable,
  type MRT_RowSelectionState,
  useMantineReactTable,
} from 'mantine-react-table';
import { useNavigate } from 'react-router';

import { ROUTES } from '../../constants/routingConstants.ts';
import { RESOURCES, RESOURCES_BY_ID } from '../../data/resources.ts';
import { useApplications } from '../../hooks/useApplications.ts';
import { useTableUrlState } from '../../hooks/useTableUrlState.ts';
import type { Resource } from '../../types/resourceTypes.ts';
import { sharedTableOptions } from '../../utils/tableUtils.ts';
import FiltersPanel from '../common/FiltersPanel.tsx';
import CreateApplicationModal from './CreateApplicationModal.tsx';
import { renderResourceFilterValue } from './ResourceBadges.tsx';
import {
  RESOURCE_SORTABLE_COLUMN_IDS,
  RESOURCE_URL_FILTERS,
  resourceColumns,
} from './resourceColumns.tsx';
import SelectionFooter from './SelectionFooter.tsx';

const ResourcesPage = () => {
  // TanStack's `table` instance is mutated in place (stable reference), so React Compiler's
  // memoization would stop <MantineReactTable> from re-rendering when data/state change.
  'use no memo';
  const navigate = useNavigate();
  const { createApplication } = useApplications();
  const { search, setSearch, sorting, onSortingChange, columnFilters, onColumnFiltersChange } =
    useTableUrlState(RESOURCE_URL_FILTERS, RESOURCE_SORTABLE_COLUMN_IDS);

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [createModalOpened, createModal] = useDisclosure(false);

  const normalizedSearch = search.toLowerCase();
  const visibleResources = normalizedSearch
    ? RESOURCES.filter((resource) => resource.name.toLowerCase().includes(normalizedSearch))
    : RESOURCES;

  // Selection is kept even for rows hidden by search/filters.
  const selectedResources = Object.keys(rowSelection)
    .filter((id) => rowSelection[id])
    .map((id) => RESOURCES_BY_ID.get(id))
    .filter((resource): resource is Resource => !!resource);

  const table = useMantineReactTable({
    columns: resourceColumns,
    data: visibleResources,
    getRowId: (row) => row.id,
    ...sharedTableOptions<Resource>(),

    enableRowSelection: true,
    positionToolbarAlertBanner: 'none',

    state: { sorting, columnFilters, rowSelection },
    onSortingChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,

    // Clicking anywhere on a row toggles its selection (shift-click selects a range).
    mantineTableBodyRowProps: ({ row, renderedRowIndex, table }) => ({
      onClick: (event) => getMRT_RowSelectionHandler({ row, table, renderedRowIndex })(event),
      style: { cursor: 'pointer' },
    }),
  });

  const handleCreate = ({ name, description }: { name: string; description?: string }) => {
    createApplication({ name, description, resourceIds: selectedResources.map((r) => r.id) });
    createModal.close();
    setRowSelection({});
    navigate(ROUTES.applications);
  };

  return (
    <Stack gap="md" flex={1}>
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2}>Resources</Title>
          <Text c="dimmed" size="sm">
            Click rows to select resources, then group them into an Application.
          </Text>
        </div>
      </Group>

      <FiltersPanel
        table={table}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search resources by name"
        renderFilterValue={renderResourceFilterValue}
      />

      <MantineReactTable table={table} />

      {selectedResources.length > 0 && (
        <SelectionFooter
          selected={selectedResources}
          onClear={() => setRowSelection({})}
          onCreateApplication={createModal.open}
        />
      )}

      <CreateApplicationModal
        opened={createModalOpened}
        resourceCount={selectedResources.length}
        onClose={createModal.close}
        onSubmit={handleCreate}
      />
    </Stack>
  );
};

export default ResourcesPage;
