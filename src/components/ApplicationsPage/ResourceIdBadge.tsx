import type { FC } from 'react';

import { resourceNameById } from '../../utils/resourceUtils.ts';
import ValueBadge from '../common/ValueBadge.tsx';

interface ResourceIdBadgeProps {
  resourceId: string;
  onRemove?(): void;
}

/** A resource (by id) as shown in the Resources column; also used for that column's filter. */
const ResourceIdBadge: FC<ResourceIdBadgeProps> = ({ resourceId, onRemove }) => {
  const name = resourceNameById(resourceId);

  return (
    <ValueBadge variant="light" onRemove={onRemove} removeLabel={`Remove ${name} filter`}>
      {name}
    </ValueBadge>
  );
};

export default ResourceIdBadge;
