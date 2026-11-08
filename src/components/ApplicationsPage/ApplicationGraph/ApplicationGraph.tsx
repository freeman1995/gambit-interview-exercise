import type { KeyboardEvent } from 'react';

import { CRITICALITY_COLORS } from '../../../constants/criticalityConstants.ts';
import { PROVIDER_COLORS } from '../../../constants/providerConstants.ts';
import type { Application } from '../../../types/applicationTypes.ts';
import type { Resource } from '../../../types/resourceTypes.ts';
import classes from './ApplicationGraph.module.css';

const WIDTH = 820;
const HEIGHT = 560;
const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };
const ORBIT_RADIUS = 190;
const APP_NODE_RADIUS = 56;
const RESOURCE_NODE_RADIUS = 26;
const LABEL_GAP = 10;
const LABEL_LINE_HEIGHT = 16;

const color = (name: string, shade = 6) => `var(--mantine-color-${name}-${shade})`;

interface PositionedResource {
  resource: Resource;
  x: number;
  y: number;
  /** Unit vector pointing away from the center — used to place the label outside the node. */
  dx: number;
  dy: number;
}

const layoutOnCircle = (resources: Resource[]): PositionedResource[] =>
  resources.map((resource, index) => {
    // Start at 12 o'clock and go clockwise.
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / resources.length;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    return {
      resource,
      x: CENTER.x + ORBIT_RADIUS * dx,
      y: CENTER.y + ORBIT_RADIUS * dy,
      dx,
      dy,
    };
  });

const labelAnchor = (dx: number) => (dx > 0.3 ? 'start' : dx < -0.3 ? 'end' : 'middle');

const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;

interface ApplicationGraphProps {
  application: Application;
  resources: Resource[];
  onResourceClick: (resource: Resource) => void;
}

/** Hub-and-spoke SVG: the Application in the middle, its ResourcesPage around it. */
const ApplicationGraph = ({ application, resources, onResourceClick }: ApplicationGraphProps) => {
  const nodes = layoutOnCircle(resources);

  const handleKeyDown = (event: KeyboardEvent, resource: Resource) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onResourceClick(resource);
    }
  };

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
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
            x1={CENTER.x}
            y1={CENTER.y}
            x2={x}
            y2={y}
            className={classes.edge}
          />
        ))}
      </g>

      <g>
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={APP_NODE_RADIUS}
          fill={color('indigo')}
          className={classes.appNode}
        />
        <text
          x={CENTER.x}
          y={CENTER.y}
          textAnchor="middle"
          dominantBaseline="central"
          className={classes.appLabel}
        >
          {truncate(application.name, 14)}
        </text>
        <title>{application.name}</title>
      </g>

      {nodes.map(({ resource, x, y, dx, dy }) => {
        const labelDistance = RESOURCE_NODE_RADIUS + LABEL_GAP;
        const labelX = x + dx * labelDistance;
        // The label has two lines (name + type): hang it below lower nodes, lift it above
        // upper nodes, and center it vertically next to side nodes.
        const isBelow = dy > 0.3;
        const isAbove = dy < -0.3;
        const baseline = isBelow ? 'hanging' : isAbove ? 'auto' : 'central';
        const labelY =
          y +
          dy * labelDistance +
          (isAbove ? -LABEL_LINE_HEIGHT : isBelow ? 0 : -LABEL_LINE_HEIGHT / 2);

        return (
          <g
            key={resource.id}
            role="button"
            tabIndex={0}
            aria-label={`Show ${resource.name} in resources`}
            className={classes.resourceNode}
            onClick={() => onResourceClick(resource)}
            onKeyDown={(event) => handleKeyDown(event, resource)}
          >
            <title>{`${resource.name} · ${resource.type} · ${resource.criticality}`}</title>
            <circle
              cx={x}
              cy={y}
              r={RESOURCE_NODE_RADIUS}
              fill={color(PROVIDER_COLORS[resource.provider], 1)}
              stroke={color(CRITICALITY_COLORS[resource.criticality])}
              strokeWidth={4}
              className={classes.resourceCircle}
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              className={classes.providerLabel}
              fill={color(PROVIDER_COLORS[resource.provider], 9)}
            >
              {resource.provider}
            </text>
            <text
              x={labelX}
              y={labelY}
              textAnchor={labelAnchor(dx)}
              dominantBaseline={baseline}
              className={classes.resourceLabel}
            >
              {resource.name}
              <tspan x={labelX} dy={LABEL_LINE_HEIGHT} className={classes.resourceType}>
                {resource.type}
              </tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default ApplicationGraph;
