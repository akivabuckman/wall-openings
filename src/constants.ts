import { Opening } from "./types";

export const defaultOpeningColor = "#0000ff";
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
    color: defaultOpeningColor,
    id: 0,
    fromPrevious: 110,
    xIndex: 1
  }, {
    type: 'circle',
    radius: 15,
    x: 110,
    y: 320,
    color: defaultOpeningColor,
    id: 1,
    fromPrevious: 0,
    xIndex: 0
  },{
    type: 'rectangle',
    width: 100,
    height: 60,
    x: 300,
    y: 250,
    color: defaultOpeningColor,
    id: 2,
    fromPrevious: 80,
    xIndex: 2
  }]