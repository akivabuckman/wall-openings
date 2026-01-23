// Common fields for all openings
interface OpeningBase {
  distanceFromLast: number;
  x: number;
  y: number;
  color: string;
  id: number;
}

// Rectangle extends base
export interface RectangleOpening extends OpeningBase {
  type: 'rectangle';
  width: number;
  height: number;
}

// Circle extends base
export interface CircleOpening extends OpeningBase {
  type: 'circle';
  radius: number;
}

// Union type for all openings
export type Opening = RectangleOpening | CircleOpening;