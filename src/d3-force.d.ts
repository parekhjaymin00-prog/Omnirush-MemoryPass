declare module 'd3-force' {
  export interface SimulationNodeDatum { index?: number; x?: number; y?: number; vx?: number; vy?: number; fx?: number | null; fy?: number | null; }
  export function forceSimulation<N extends SimulationNodeDatum = SimulationNodeDatum>(nodes?: N[]): any;
  export function forceCenter(x?: number, y?: number): any;
  export function forceCollide<N extends SimulationNodeDatum = SimulationNodeDatum>(): any;
  export function forceLink(links?: unknown[]): any;
  export function forceManyBody(): any;
}
