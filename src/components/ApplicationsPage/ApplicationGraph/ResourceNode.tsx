import { useCallback, useMemo, type FC, type KeyboardEvent } from 'react';

import { CRITICALITY_COLORS } from '../../../constants/criticalityConstants.ts';
import { LABEL_LINE_HEIGHT, RESOURCE_NODE_RADIUS } from '../../../constants/graphConstants.ts';
import { PROVIDER_COLORS } from '../../../constants/providerConstants.ts';
import type { PositionedResource } from '../../../types/graphTypes.ts';
import type { Resource } from '../../../types/resourceTypes.ts';
import { isActivationKey } from '../../../utils/eventUtils.ts';
import { getResourceLabelPosition } from '../../../utils/graphUtils.ts';
import { mantineColorVar } from '../../../utils/themeUtils.ts';
import classes from './ApplicationGraph.module.css';

interface ResourceNodeProps {
  node: PositionedResource;
  onClick(resource: Resource): void;
}

/** A resource around the application: fill = provider, ring = criticality. Keyboard accessible. */
const ResourceNode: FC<ResourceNodeProps> = ({ node, onClick }) => {
  const { resource, x, y } = node;
  const label = useMemo(() => getResourceLabelPosition(node), [node]);

  const handleClick = useCallback(() => onClick(resource), [onClick, resource]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActivationKey(event)) return;
      event.preventDefault();
      onClick(resource);
    },
    [onClick, resource],
  );

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`Show ${resource.name} in resources`}
      className={classes.resourceNode}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <title>{`${resource.name} · ${resource.type} · ${resource.criticality}`}</title>
      <circle
        cx={x}
        cy={y}
        r={RESOURCE_NODE_RADIUS}
        fill={mantineColorVar(PROVIDER_COLORS[resource.provider], 1)}
        stroke={mantineColorVar(CRITICALITY_COLORS[resource.criticality])}
        strokeWidth={4}
        className={classes.resourceCircle}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className={classes.providerLabel}
        fill={mantineColorVar(PROVIDER_COLORS[resource.provider], 9)}
      >
        {resource.provider}
      </text>
      <text
        x={label.x}
        y={label.y}
        textAnchor={label.textAnchor}
        dominantBaseline={label.dominantBaseline}
        className={classes.resourceLabel}
      >
        {resource.name}
        <tspan x={label.x} dy={LABEL_LINE_HEIGHT} className={classes.resourceType}>
          {resource.type}
        </tspan>
      </text>
    </g>
  );
};

export default ResourceNode;
