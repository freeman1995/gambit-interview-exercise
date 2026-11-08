/** Application graph canvas (SVG viewBox units). */
export const GRAPH_WIDTH = 820;
export const GRAPH_HEIGHT = 560;
export const GRAPH_CENTER = { x: GRAPH_WIDTH / 2, y: GRAPH_HEIGHT / 2 } as const;

/** Distance of the resource nodes from the application node. */
export const ORBIT_RADIUS = 190;

export const APP_NODE_RADIUS = 56;
export const RESOURCE_NODE_RADIUS = 26;

/** Space between a resource node and its label. */
export const LABEL_GAP = 10;
export const LABEL_LINE_HEIGHT = 16;

/** Longest application name shown inside the center node before it's truncated. */
export const APP_LABEL_MAX_LENGTH = 14;
