import { ROUTES } from '../constants/routingConstants.ts';
import { URL_PARAMS } from '../constants/tableConstants.ts';

/** Resources page searched down to a single resource, e.g. `/ResourcesPage?q=auth-keyvault`. */
export const resourceSearchPath = (resourceName: string) =>
  `${ROUTES.resources}?${new URLSearchParams({ [URL_PARAMS.search]: resourceName })}`;
