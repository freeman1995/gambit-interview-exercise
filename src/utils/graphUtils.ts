import {
  GRAPH_CENTER,
  LABEL_GAP,
  LABEL_LINE_HEIGHT,
  ORBIT_RADIUS,
  RESOURCE_NODE_RADIUS,
} from '../constants/graphConstants.ts';
import type { PositionedResource, ResourceLabelPosition } from '../types/graphTypes.ts';
import type { Resource } from '../types/resourceTypes.ts';

/** How far off-axis a node must be before its label leans to that side. */
const SIDE_THRESHOLD = 0.3;

/** Spreads the resources evenly around the center, starting at 12 o'clock and going clockwise. */
export const layoutOnCircle = (resources: Resource[]): PositionedResource[] =>
  resources.map((resource, index) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / resources.length;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    return {
      resource,
      x: GRAPH_CENTER.x + ORBIT_RADIUS * dx,
      y: GRAPH_CENTER.y + ORBIT_RADIUS * dy,
      dx,
      dy,
    };
  });

/**
 * Places a node's label just outside it, away from the center. The label has two lines
 * (name + type): it hangs below lower nodes, sits above upper nodes, and is vertically centered
 * next to side nodes.
 */
export const getResourceLabelPosition = ({
  x,
  y,
  dx,
  dy,
}: PositionedResource): ResourceLabelPosition => {
  const distance = RESOURCE_NODE_RADIUS + LABEL_GAP;
  const isBelow = dy > SIDE_THRESHOLD;
  const isAbove = dy < -SIDE_THRESHOLD;

  return {
    x: x + dx * distance,
    y: y + dy * distance + (isAbove ? -LABEL_LINE_HEIGHT : isBelow ? 0 : -LABEL_LINE_HEIGHT / 2),
    textAnchor: dx > SIDE_THRESHOLD ? 'start' : dx < -SIDE_THRESHOLD ? 'end' : 'middle',
    dominantBaseline: isBelow ? 'hanging' : isAbove ? 'auto' : 'central',
  };
};
