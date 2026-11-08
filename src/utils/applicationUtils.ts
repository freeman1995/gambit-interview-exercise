import type { Application } from '../types/applicationTypes.ts';
import type { Resource } from '../types/resourceTypes.ts';
import { resolveResourceIds } from './resourceUtils.ts';

/** The application's resources (unknown ids are skipped). */
export const resolveApplicationResources = (application: Application): Resource[] =>
  resolveResourceIds(application.resourceIds);
