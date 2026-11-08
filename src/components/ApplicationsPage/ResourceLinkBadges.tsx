import { useMemo, type FC } from 'react';
import { Badge, Group } from '@mantine/core';
import { Link } from 'react-router';

import type { Application } from '../../types/applicationTypes.ts';
import { resolveApplicationResources } from '../../utils/applicationUtils.ts';
import { stopPropagation } from '../../utils/eventUtils.ts';
import { resourceSearchPath } from '../../utils/routingUtils.ts';

interface ResourceLinkBadgesProps {
  application: Application;
}

/**
 * The application's resources as links — same as clicking the resource in the graph: open it on
 * the Resources page.
 */
const ResourceLinkBadges: FC<ResourceLinkBadgesProps> = ({ application }) => {
  const resources = useMemo(() => resolveApplicationResources(application), [application]);

  return (
    <Group gap={4} wrap="wrap">
      {resources.map((resource) => (
        <Badge
          key={resource.id}
          variant="light"
          tt="none"
          component={Link}
          to={resourceSearchPath(resource.name)}
          // Don't also open the graph modal (row click).
          onClick={stopPropagation}
          style={{ cursor: 'pointer' }}
          title={`Show ${resource.name} in resources`}
        >
          {resource.name}
        </Badge>
      ))}
    </Group>
  );
};

export default ResourceLinkBadges;
