import { useCallback, useMemo, type FC } from 'react';
import { Badge, Group, Modal, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router';

import type { Application } from '../../types/applicationTypes.ts';
import type { Resource } from '../../types/resourceTypes.ts';
import { resourceSearchPath } from '../../utils/routingUtils.ts';
import { pluralize } from '../../utils/stringUtils.ts';
import ApplicationGraph from './ApplicationGraph/ApplicationGraph.tsx';

interface ApplicationGraphModalProps {
  opened: boolean;
  application: Application | null;
  resources: Resource[];
  onClose: () => void;
}

const ApplicationGraphModal: FC<ApplicationGraphModalProps> = ({
  opened,
  application,
  resources,
  onClose,
}) => {
  const navigate = useNavigate();

  const showResource = useCallback(
    (resource: Resource) => navigate(resourceSearchPath(resource.name)),
    [navigate],
  );

  const applicationName = application?.name;
  const resourceCount = resources.length;
  const title = useMemo(
    () => (
      <Group gap="xs">
        <Text fw={700}>{applicationName}</Text>
        <Badge variant="light">{pluralize(resourceCount, 'resource')}</Badge>
      </Group>
    ),
    [applicationName, resourceCount],
  );

  return (
    <Modal opened={opened} onClose={onClose} size="xl" centered title={title}>
      {application && (
        <Stack gap="xs">
          {application.description && <Text c="dimmed">{application.description}</Text>}
          {resources.length ? (
            <ApplicationGraph
              application={application}
              resources={resources}
              onResourceClick={showResource}
            />
          ) : (
            <Text c="dimmed" ta="center" py="xl">
              This application has no known resources.
            </Text>
          )}
          <Text size="xs" c="dimmed" ta="center">
            Node fill = provider, ring = criticality. Click a resource to view it on the Resources
            page.
          </Text>
        </Stack>
      )}
    </Modal>
  );
};

export default ApplicationGraphModal;
