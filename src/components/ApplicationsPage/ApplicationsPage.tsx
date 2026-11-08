import { useState } from 'react';
import { Anchor, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Link } from 'react-router';

import { ROUTES } from '../../constants/routingConstants.ts';
import { useApplications } from '../../hooks/useApplications.ts';
import { useTableUrlState } from '../../hooks/useTableUrlState.ts';
import type { Application } from '../../types/applicationTypes.ts';
import { sharedTableOptions } from '../../utils/tableUtils.ts';
import FiltersPanel from '../common/FiltersPanel.tsx';
import ApplicationGraphModal from './ApplicationGraphModal.tsx';
import {
  APPLICATION_SORTABLE_COLUMN_IDS,
  APPLICATION_URL_FILTERS,
  applicationColumns,
  renderResourceIdValue,
  resolveResources,
} from './applicationColumns.tsx';

const renderApplicationFilterValue = (columnId: string, value: string, onRemove?: () => void) =>
  columnId === 'resourceIds' ? renderResourceIdValue(value, onRemove) : undefined;

const ApplicationsPage = () => {
  // See ResourcesPage: React Compiler memoization breaks TanStack table re-renders.
  'use no memo';
  const { applications } = useApplications();
  const { search, setSearch, sorting, onSortingChange, columnFilters, onColumnFiltersChange } =
    useTableUrlState(APPLICATION_URL_FILTERS, APPLICATION_SORTABLE_COLUMN_IDS);

  // The selected id is kept after closing so the modal content doesn't blank out mid-animation.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [graphOpened, graph] = useDisclosure(false);
  const selectedApplication = applications.find((app) => app.id === selectedId) ?? null;

  const openGraph = (id: string) => {
    setSelectedId(id);
    graph.open();
  };

  const normalizedSearch = search.toLowerCase();
  const visibleApplications = normalizedSearch
    ? applications.filter((app) => app.name.toLowerCase().includes(normalizedSearch))
    : applications;

  const table = useMantineReactTable({
    columns: applicationColumns,
    data: visibleApplications,
    getRowId: (row) => row.id,
    ...sharedTableOptions<Application>(),
    state: { sorting, columnFilters },
    onSortingChange,
    onColumnFiltersChange,
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: () => openGraph(row.id),
      style: { cursor: 'pointer' },
    }),
    renderEmptyRowsFallback: () => (
      <Text c="dimmed" ta="center" py="xl">
        {applications.length ? (
          'No ApplicationsPage match the current filters.'
        ) : (
          <>
            No applications yet.{' '}
            <Anchor component={Link} to={ROUTES.resources}>
              Select some resources
            </Anchor>{' '}
            to create one.
          </>
        )}
      </Text>
    ),
  });

  return (
    <Stack gap="md" flex={1}>
      <div>
        <Title order={2}>Applications</Title>
        <Text c="dimmed" size="sm">
          Click an application to see its resource graph, or a resource to open it.
        </Text>
      </div>

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
        resources={selectedApplication ? resolveResources(selectedApplication) : []}
        onClose={graph.close}
      />
    </Stack>
  );
};

export default ApplicationsPage;
