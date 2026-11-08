import { useCallback, useMemo, useState, type FC } from 'react';
import { Modal, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  getMRT_RowSelectionHandler,
  MantineReactTable,
  type MRT_RowSelectionState,
  useMantineReactTable,
} from 'mantine-react-table';
import { useNavigate } from 'react-router';

import { ROUTES } from '../../constants/routingConstants.ts';
import { CLICKABLE_ROW_STYLE } from '../../constants/tableConstants.ts';
import { RESOURCES } from '../../data/resources.ts';
import { useApplications, type NewApplication } from '../../hooks/useApplications.ts';
import { useTableUrlState } from '../../hooks/useTableUrlState.ts';
import type { Resource } from '../../types/resourceTypes.ts';
import { resolveResourceIds } from '../../utils/resourceUtils.ts';
import { filterByName } from '../../utils/searchUtils.ts';
import { getRowIdFromId, getSelectedIds, sharedTableOptions } from '../../utils/tableUtils.ts';
import FiltersPanel from '../common/FiltersPanel.tsx';
import PageHeader from '../common/PageHeader.tsx';
import CreateApplicationForm from './CreateApplicationForm.tsx';
import ResourceColumnBadge from './ResourceColumnBadge.tsx';
import resourceColumns, {
  RESOURCE_SORTABLE_COLUMN_IDS,
  RESOURCE_URL_FILTERS,
} from './resourceColumns.tsx';
import SelectionFooter from './SelectionFooter.tsx';

type RowSelectionHandlerArgs = Parameters<typeof getMRT_RowSelectionHandler<Resource>>[0];

/** Active filter values in the FiltersPanel look like the column's cells. */
const renderResourceFilterValue = (columnId: string, value: string, onRemove?: () => void) => (
  <ResourceColumnBadge columnId={columnId} value={value} onRemove={onRemove} />
);

const ResourcesPage: FC = () => {
  // TanStack's `table` instance is mutated in place (stable reference), so React Compiler's
  // memoization would stop <MantineReactTable> from re-rendering when data/state change.
  'use no memo';
  const navigate = useNavigate();
  const { createApplication } = useApplications();
  const { search, setSearch, sorting, onSortingChange, columnFilters, onColumnFiltersChange } =
    useTableUrlState(RESOURCE_URL_FILTERS, RESOURCE_SORTABLE_COLUMN_IDS);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [createModalOpened, { open: openCreateModal, close: closeCreateModal }] =
    useDisclosure(false);

  const visibleResources = useMemo(() => filterByName(RESOURCES, search), [search]);

  // Selection is kept even for rows hidden by search/filters.
  const selectedIds = useMemo(() => getSelectedIds(rowSelection), [rowSelection]);
  const selectedResources = useMemo(() => resolveResourceIds(selectedIds), [selectedIds]);

  const clearSelection = useCallback(() => setRowSelection({}), []);

  // Clicking anywhere on a row toggles its selection (shift-click selects a range).
  const getRowProps = useCallback(
    (args: RowSelectionHandlerArgs) => ({
      onClick: getMRT_RowSelectionHandler(args),
      style: CLICKABLE_ROW_STYLE,
    }),
    [],
  );

  const table = useMantineReactTable({
    columns: resourceColumns,
    data: visibleResources,
    getRowId: getRowIdFromId,
    ...sharedTableOptions<Resource>(),
    enableRowSelection: true,
    positionToolbarAlertBanner: 'none',
    state: { sorting, columnFilters, rowSelection },
    onSortingChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    mantineTableBodyRowProps: getRowProps,
  });

  const handleCreate = useCallback(
    ({ name, description }: Omit<NewApplication, 'resourceIds'>) => {
      createApplication({ name, description, resourceIds: selectedIds });
      closeCreateModal();
      clearSelection();
      navigate(ROUTES.applications);
    },
    [createApplication, closeCreateModal, clearSelection, navigate, selectedIds],
  );

  return (
    <Stack gap="md" flex={1}>
      <PageHeader
        title="Resources"
        description="Click rows to select resources, then group them into an Application."
      />

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
          onClear={clearSelection}
          onCreateApplication={openCreateModal}
        />
      )}

      <Modal
        opened={createModalOpened}
        onClose={closeCreateModal}
        title="Create Application"
        centered
      >
        <CreateApplicationForm
          resourceCount={selectedResources.length}
          onSubmit={handleCreate}
          onCancel={closeCreateModal}
        />
      </Modal>
    </Stack>
  );
};

export default ResourcesPage;
