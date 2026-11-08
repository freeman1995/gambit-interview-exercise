import type { Resource } from './resourceTypes.ts';

/** A resource placed on the application graph's orbit. */
export interface PositionedResource {
  resource: Resource;
  x: number;
  y: number;
  /** Unit vector pointing away from the center — used to place the label outside the node. */
  dx: number;
  dy: number;
}

/** Where (and how) to draw a resource node's two-line label. */
export interface ResourceLabelPosition {
  x: number;
  y: number;
  textAnchor: 'start' | 'middle' | 'end';
  dominantBaseline: 'hanging' | 'auto' | 'central';
}
