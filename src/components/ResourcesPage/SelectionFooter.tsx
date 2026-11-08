import type { FC } from 'react';
import { Badge, Button, Group, Paper, ScrollArea, Text } from '@mantine/core';
import { IconApps } from '@tabler/icons-react';

import type { Resource } from '../../types/resourceTypes.ts';

interface SelectionFooterProps {
  selected: Resource[];
  onClear: () => void;
  onCreateApplication: () => void;
}

const SelectionFooter: FC<SelectionFooterProps> = ({ selected, onClear, onCreateApplication }) => (
  <Paper
    pos="sticky"
    bottom={0}
    p="md"
    withBorder
    shadow="md"
    style={{ zIndex: 10 }}
    aria-label="Selected resources"
  >
    <Group justify="space-between" wrap="nowrap" gap="md">
      <Group gap="sm" wrap="nowrap" miw={0} style={{ flex: 1 }}>
        <Text fw={600} style={{ whiteSpace: 'nowrap' }}>
          {selected.length} selected
        </Text>
        <ScrollArea.Autosize mah={64} style={{ flex: 1 }}>
          <Group gap={6}>
            {selected.map((resource) => (
              <Badge key={resource.id} variant="light" tt="none">
                {resource.name}
              </Badge>
            ))}
          </Group>
        </ScrollArea.Autosize>
      </Group>
      <Group gap="sm" wrap="nowrap">
        <Button variant="subtle" color="gray" onClick={onClear}>
          Clear
        </Button>
        <Button leftSection={<IconApps size={16} />} onClick={onCreateApplication}>
          Create Application
        </Button>
      </Group>
    </Group>
  </Paper>
);

export default SelectionFooter;
