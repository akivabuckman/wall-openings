import { Opening } from "./types";

export const MODE = import.meta.env.VITE_MODE || "development";
export const tickAngle = 45;
export const tickLength = 16;
export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 4;
export const ZOOM_STEP = 0.1;
export const verticalMeasureWidth = 90;
export const maxDimension = 999999;
export const defaultOpenings: Opening[] = [];
export const colorOptions: { name: string; value: string }[] = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#fb923c' },
  { name: 'Yellow', value: '#fde047' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'White', value: '#fff' },
];
