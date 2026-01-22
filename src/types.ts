export type Opening =
  | {
      type: 'rectangle';
      width: number;
      height: number;
      elevation: number;
      distanceFromLast: number;
    }
  | {
      type: 'circle';
      radius: number;
      elevation: number;
      distanceFromLast: number;
    };
