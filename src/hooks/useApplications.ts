import { useCallback } from 'react';
import { useLocalStorage } from '@mantine/hooks';

import { APPLICATIONS_STORAGE_KEY } from '../constants/applicationConstants.ts';
import type { Application } from '../types/applicationTypes.ts';

const deserialize = (raw: string | undefined): Application[] => {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Application[]) : [];
  } catch {
    return [];
  }
};

export type NewApplication = Omit<Application, 'id'>;

/** Applications persisted in localStorage (synced across hook instances and browser tabs). */
export const useApplications = () => {
  const [applications, setApplications] = useLocalStorage<Application[]>({
    key: APPLICATIONS_STORAGE_KEY,
    defaultValue: [],
    getInitialValueInEffect: false,
    deserialize,
  });

  const createApplication = useCallback(
    (input: NewApplication): Application => {
      const application: Application = { id: crypto.randomUUID(), ...input };
      setApplications((prev) => [...prev, application]);
      return application;
    },
    [setApplications],
  );

  return { applications, createApplication };
};
