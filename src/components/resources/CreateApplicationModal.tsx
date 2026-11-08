import { useState, type FormEvent } from 'react';
import { Button, Group, Modal, Stack, Text, Textarea, TextInput } from '@mantine/core';

import type { NewApplication } from '../../hooks/useApplications.ts';

interface CreateApplicationModalProps {
  opened: boolean;
  resourceCount: number;
  onClose: () => void;
  onSubmit: (application: Omit<NewApplication, 'resourceIds'>) => void;
}

const CreateApplicationForm = ({
  resourceCount,
  onClose,
  onSubmit,
}: Omit<CreateApplicationModalProps, 'opened'>) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const trimmedName = name.trim();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!trimmedName) return;
    onSubmit({ name: trimmedName, description: description.trim() || undefined });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Text size="sm" c="dimmed">
          Group {resourceCount} selected resource{resourceCount === 1 ? '' : 's'} into a new
          Application.
        </Text>
        <TextInput
          label="Name"
          placeholder="e.g. Payments API"
          required
          data-autofocus
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <Textarea
          label="Description"
          placeholder="Optional"
          autosize
          minRows={2}
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!trimmedName}>
            Create
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

const CreateApplicationModal = ({ opened, ...formProps }: CreateApplicationModalProps) => (
  <Modal opened={opened} onClose={formProps.onClose} title="Create Application" centered>
    {/* Modal content unmounts when closed, so the form starts empty every time. */}
    <CreateApplicationForm {...formProps} />
  </Modal>
);

export default CreateApplicationModal;
