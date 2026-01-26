import { Opening } from "./types";

export const tickAngle = 45;
export const tickLength = 16;
export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 4;
export const ZOOM_STEP = 0.1;
export const verticalMeasureWidth = 90;
export const maxDimension = 999999;
export const defaultOpenings: Opening[] = [{
    type: 'rectangle',
    width: 100,
    height: 200,
    x: 220,
    y: 0,
    color: "red",
    id: 0,
    fromPrevious: 110,
    xIndex: 1
  }, {
    type: 'circle',
    radius: 15,
    x: 110,
    y: 320,
    color: "blue",
    id: 1,
    fromPrevious: 0,
    xIndex: 0
  },{
    type: 'rectangle',
    width: 100,
    height: 60,
    x: 300,
    y: 250,
    color: "green",
    id: 2,
    fromPrevious: 80,
    xIndex: 2
}];
export const colorOptions: { name: string; value: string }[] = [
  { name: 'red', value: '#ef4444' },
  { name: 'orange', value: '#fb923c' },
  { name: 'yellow', value: '#fde047' },
  { name: 'green', value: '#22c55e' },
  { name: 'blue', value: '#3b82f6' },
  { name: 'purple', value: '#a855f7' },
  { name: 'cyan', value: '#06b6d4' },
  { name: 'white', value: '#fff' },
];