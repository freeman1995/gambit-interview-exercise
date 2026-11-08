import { RESOURCES_BY_ID } from '../data/resources.ts';
import type { Resource } from '../types/resourceTypes.ts';
import type { FilterOption } from '../types/tableTypes.ts';

/** Looks up resources by id, skipping ids that no longer exist. */
export const resolveResourceIds = (ids: readonly string[]): Resource[] =>
  ids.map((id) => RESOURCES_BY_ID.get(id)).filter((resource): resource is Resource => !!resource);

/** Name of the resource with this id (or the id itself when it's unknown). */
export const resourceNameById = (id: string): string => RESOURCES_BY_ID.get(id)?.name ?? id;

/** Filter options keyed by resource id and labelled by name, sorted by name. */
export const toResourceOptions = (resources: readonly Resource[]): FilterOption[] =>
  resources
    .map((resource) => ({ value: resource.id, label: resource.name }))
    .sort((a, b) => a.label.localeCompare(b.label));
