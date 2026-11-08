import { useCallback, useState, type ChangeEvent, type FC, type FormEvent } from 'react';
import { Button, Group, Stack, Text, Textarea, TextInput } from '@mantine/core';

import type { NewApplication } from '../../hooks/useApplications.ts';
import { pluralize } from '../../utils/stringUtils.ts';

interface CreateApplicationFormProps {
  resourceCount: number;
  onCancel(): void;
  onSubmit(application: Omit<NewApplication, 'resourceIds'>): void;
}

const CreateApplicationForm: FC<CreateApplicationFormProps> = ({
  resourceCount,
  onCancel,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const trimmedName = name.trim();

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setName(event.currentTarget.value),
    [],
  );

  const handleDescriptionChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.currentTarget.value),
    [],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!trimmedName) return;
      onSubmit({ name: trimmedName, description: description.trim() || undefined });
    },
    [trimmedName, description, onSubmit],
  );

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Text size="sm" c="dimmed">
          Group {pluralize(resourceCount, 'selected resource')} into a new Application.
        </Text>

        <TextInput
          label="Name"
          placeholder="e.g. Payments API"
          required
          data-autofocus
          value={name}
          onChange={handleNameChange}
        />

        <Textarea
          label="Description"
          placeholder="Optional"
          autosize
          minRows={2}
          value={description}
          onChange={handleDescriptionChange}
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
