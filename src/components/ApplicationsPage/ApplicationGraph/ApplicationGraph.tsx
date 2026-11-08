import { useMemo, type FC } from 'react';

import { GRAPH_CENTER, GRAPH_HEIGHT, GRAPH_WIDTH } from '../../../constants/graphConstants.ts';
import type { Application } from '../../../types/applicationTypes.ts';
import type { Resource } from '../../../types/resourceTypes.ts';
import { layoutOnCircle } from '../../../utils/graphUtils.ts';
import ApplicationNode from './ApplicationNode.tsx';
import classes from './ApplicationGraph.module.css';
import ResourceNode from './ResourceNode.tsx';

interface ApplicationGraphProps {
  application: Application;
  resources: Resource[];
  onResourceClick: (resource: Resource) => void;
}

/** Hub-and-spoke SVG: the Application in the middle, its resources around it. */
const ApplicationGraph: FC<ApplicationGraphProps> = ({
  application,
  resources,
  onResourceClick,
}) => {
  const nodes = useMemo(() => layoutOnCircle(resources), [resources]);

  return (
    <svg
      viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
      width="100%"
      role="img"
      aria-label={`${application.name} and its ${resources.length} resources`}
      className={classes.graph}
    >
      {/* Edges first so nodes are drawn on top of them. */}
      <g>
        {nodes.map(({ resource, x, y }) => (
          <line
            key={resource.id}
            x1={GRAPH_CENTER.x}
            y1={GRAPH_CENTER.y}
            x2={x}
            y2={y}
            className={classes.edge}
          />
        ))}
      </g>

      <ApplicationNode name={application.name} />

      {nodes.map((node) => (
        <ResourceNode key={node.resource.id} node={node} onClick={onResourceClick} />
      ))}
    </svg>
  );
};

export default ApplicationGraph;
