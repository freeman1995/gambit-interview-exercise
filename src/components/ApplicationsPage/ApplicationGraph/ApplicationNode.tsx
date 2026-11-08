import type { FC } from 'react';

import {
  APP_LABEL_MAX_LENGTH,
  APP_NODE_RADIUS,
  GRAPH_CENTER,
} from '../../../constants/graphConstants.ts';
import { truncate } from '../../../utils/stringUtils.ts';
import { mantineColorVar } from '../../../utils/themeUtils.ts';
import classes from './ApplicationGraph.module.css';

interface ApplicationNodeProps {
  name: string;
}

/** The application at the center of the graph. */
const ApplicationNode: FC<ApplicationNodeProps> = ({ name }) => (
  <g>
    <circle
      cx={GRAPH_CENTER.x}
      cy={GRAPH_CENTER.y}
      r={APP_NODE_RADIUS}
      fill={mantineColorVar('indigo')}
      className={classes.appNode}
    />
    <text
      x={GRAPH_CENTER.x}
      y={GRAPH_CENTER.y}
      textAnchor="middle"
      dominantBaseline="central"
      className={classes.appLabel}
    >
      {truncate(name, APP_LABEL_MAX_LENGTH)}
    </text>
    <title>{name}</title>
  </g>
);

export default ApplicationNode;
