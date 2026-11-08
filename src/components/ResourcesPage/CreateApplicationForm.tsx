import { useState, type ChangeEvent } from 'react';
import { Button, Group, Stack, Text, Textarea, TextInput } from '@mantine/core';

import type { NewApplication } from '../../hooks/useApplications.ts';

interface CreateApplicationFormProps {
  resourceCount: number;
  onCancel(): void;
  onSubmit(application: Omit<NewApplication, 'resourceIds'>): void;
}

const CreateApplicationForm = ({
  resourceCount,
  onCancel,
  onSubmit,
}: CreateApplicationFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const trimmedName = name.trim();

  const handleSubmit = (event: ChangeEvent) => {
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
          <Button variant="default" onClick={onCancel}>
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

export default CreateApplicationForm;
