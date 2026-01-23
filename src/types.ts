interface OpeningBase {
  x: number;
  y: number;
  color: string;
  id: number;
}

export interface RectangleOpening extends OpeningBase {
  type: 'rectangle';
  width: number;
  height: number;
}

export interface CircleOpening extends OpeningBase {
  type: 'circle';
  radius: number;
}

export type Opening = RectangleOpening | CircleOpening;