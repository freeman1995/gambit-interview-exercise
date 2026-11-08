import { useCallback, useMemo, useState, type FC } from 'react';
import { Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineReactTable, type MRT_Row, useMantineReactTable } from 'mantine-react-table';

import { CLICKABLE_ROW_STYLE } from '../../constants/tableConstants.ts';
import { useApplications } from '../../hooks/useApplications.ts';
import { useTableUrlState } from '../../hooks/useTableUrlState.ts';
import type { Application } from '../../types/applicationTypes.ts';
import { resolveApplicationResources } from '../../utils/applicationUtils.ts';
import { filterByName } from '../../utils/searchUtils.ts';
import { getRowIdFromId, sharedTableOptions } from '../../utils/tableUtils.ts';
import FiltersPanel from '../common/FiltersPanel.tsx';
import PageHeader from '../common/PageHeader.tsx';
import ApplicationGraphModal from './ApplicationGraphModal.tsx';
import ApplicationsEmptyState from './ApplicationsEmptyState.tsx';
import applicationColumns, {
  APPLICATION_SORTABLE_COLUMN_IDS,
  APPLICATION_URL_FILTERS,
} from './applicationColumns.tsx';
import ResourceIdBadge from './ResourceIdBadge.tsx';

/** Resource filter values in the FiltersPanel look like the Resources column's badges. */
const renderApplicationFilterValue = (columnId: string, value: string, onRemove?: () => void) =>
  columnId === 'resourceIds' ? (
    <ResourceIdBadge resourceId={value} onRemove={onRemove} />
  ) : undefined;

const ApplicationsPage: FC = () => {
  // See ResourcesPage: React Compiler memoization breaks TanStack table re-renders.
  'use no memo';
  const { applications } = useApplications();
  const { search, setSearch, sorting, onSortingChange, columnFilters, onColumnFiltersChange } =
    useTableUrlState(APPLICATION_URL_FILTERS, APPLICATION_SORTABLE_COLUMN_IDS);

  // The selected id is kept after closing so the modal content doesn't blank out mid-animation.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [graphOpened, { open: openGraphModal, close: closeGraphModal }] = useDisclosure(false);

  const selectedApplication = useMemo(
    () => applications.find((app) => app.id === selectedId) ?? null,
    [applications, selectedId],
  );

  const graphResources = useMemo(
    () => (selectedApplication ? resolveApplicationResources(selectedApplication) : []),
    [selectedApplication],
  );

  const visibleApplications = useMemo(
    () => filterByName(applications, search),
    [applications, search],
  );

  const openGraph = useCallback(
    (id: string) => {
      setSelectedId(id);
      openGraphModal();
    },
    [openGraphModal],
  );

  const getRowProps = useCallback(
    ({ row }: { row: MRT_Row<Application> }) => ({
      onClick: () => openGraph(row.id),
      style: CLICKABLE_ROW_STYLE,
    }),
    [openGraph],
  );

  const hasApplications = applications.length > 0;
  const renderEmptyRowsFallback = useCallback(
    () => <ApplicationsEmptyState hasApplications={hasApplications} />,
    [hasApplications],
  );

  const table = useMantineReactTable({
    columns: applicationColumns,
    data: visibleApplications,
    getRowId: getRowIdFromId,
    ...sharedTableOptions<Application>(),
    state: { sorting, columnFilters },
    onSortingChange,
    onColumnFiltersChange,
    mantineTableBodyRowProps: getRowProps,
    renderEmptyRowsFallback,
  });

  return (
    <Stack gap="md" flex={1}>
      <PageHeader
        title="Applications"
        description="Click an application to see its resource graph, or a resource to open it."
      />

      <FiltersPanel
        table={table}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search applications by name"
        renderFilterValue={renderApplicationFilterValue}
      />

      <MantineReactTable table={table} />

      <ApplicationGraphModal
        opened={graphOpened && !!selectedApplication}
        application={selectedApplication}
        resources={graphResources}
        onClose={closeGraphModal}
      />
    </Stack>
  );
};

export default ApplicationsPage;
