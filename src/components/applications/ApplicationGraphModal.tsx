import { Badge, Group, Modal, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router';

import type { Application } from '../../types/applicationTypes.ts';
import type { Resource } from '../../types/resourceTypes.ts';
import { resourceSearchPath } from '../../utils/routingUtils.ts';
import ApplicationGraph from './ApplicationGraph.tsx';

interface ApplicationGraphModalProps {
  opened: boolean;
  application: Application | null;
  resources: Resource[];
  onClose: () => void;
}

const ApplicationGraphModal = ({
  opened,
  application,
  resources,
  onClose,
}: ApplicationGraphModalProps) => {
  const navigate = useNavigate();

  const showResource = (resource: Resource) => navigate(resourceSearchPath(resource.name));

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      centered
      title={
        <Group gap="xs">
          <Text fw={700}>{application?.name}</Text>
          <Badge variant="light">{resources.length} resources</Badge>
        </Group>
      }
    >
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
