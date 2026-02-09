interface OpeningBase {
  x: number;
  elevation: number;
  color: string;
  id: number;
  fromPrevious: number;
  xIndex: number;
  wallId?: string;
}

export interface RectangleOpening extends OpeningBase {
  shape: 'RECTANGLE';
  width: number;
  height: number;
}

export interface CircleOpening extends OpeningBase {
  shape: 'CIRCLE';
  radius: number;
}

export type Opening = RectangleOpening | CircleOpening;
