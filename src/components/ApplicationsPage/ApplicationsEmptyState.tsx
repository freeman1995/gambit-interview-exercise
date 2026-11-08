import type { FC } from 'react';
import { Anchor, Text } from '@mantine/core';
import { Link } from 'react-router';

import { ROUTES } from '../../constants/routingConstants.ts';

interface ApplicationsEmptyStateProps {
  /** Whether any application exists (i.e. the table is empty only because of filters). */
  hasApplications: boolean;
}

const ApplicationsEmptyState: FC<ApplicationsEmptyStateProps> = ({ hasApplications }) => (
  <Text c="dimmed" ta="center" py="xl">
    {hasApplications ? (
      'No applications match the current filters.'
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
);

export default ApplicationsEmptyState;
