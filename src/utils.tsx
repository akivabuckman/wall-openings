import { Circle, Group, Line, Rect, Shape } from "react-konva";
import { Opening } from "./types";
import { Dispatch, SetStateAction } from "react";

export function renderOpening(
  opening: Opening,
  setOpenings: Dispatch<SetStateAction<Opening[]>>,
  idx: number,
) {
  if (opening.type === 'rectangle') {
    return renderRectangleOpening(opening, setOpenings, idx);
  }
  if (opening.type === 'circle') {
    return renderCircleOpening(opening, setOpenings, idx);
  }
  return null;
}

function handleDragMove(e: { target: { position: () => { x: number; y: number } } }, setOpenings: Dispatch<SetStateAction<Opening[]>>, idx: number) {
  const { x, y } = e.target.position();
  setOpenings(prev => prev.map((o, i) => i === idx ? { ...o, x, y } : o));
}

function renderRectangleOpening(
  opening: Extract<Opening, { type: 'rectangle' }> ,
  setOpenings: Dispatch<SetStateAction<Opening[]>>,
  idx: number,
) {
  const angleRad = (20 * Math.PI) / 180;
  const percent = 0.8;
  const x1 = 0;
  const y1 = opening.height;
  const y2 = opening.height * (1 - percent);
  const x2 = Math.tan(angleRad) * (opening.height * percent);
  const x3 = opening.width;
  const y3 = 0;
  return (
    <Group
      key={idx}
      x={opening.x}
      y={opening.y}
      draggable
      dragBoundFunc={pos => ({ ...pos, x: Math.max(0, Math.round(pos.x)) })}
      scaleY={-1}
      onDragMove={(e) => handleDragMove(e, setOpenings, idx)}
    >
      <Rect
      width={opening.width}
      height={opening.height}
      fill="white"
      stroke={opening.color}
      strokeWidth={2}
      />
      <Shape
      sceneFunc={(context, shape) => {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.lineTo(0, 0);
        context.closePath();
        context.fillStrokeShape(shape);
      }}
      fill="black"
      strokeEnabled={false}
      />
      <Line
      points={[0, 0, 0, opening.height]}
      stroke={opening.color}
      strokeWidth={2}
      />
      <Line
      points={[0, 0, opening.width, 0]}
      stroke={opening.color}
      strokeWidth={2}
      />
    </Group>
  );
}

function renderCircleOpening(
  opening: Extract<Opening, { type: 'circle' }> ,
  setOpenings: Dispatch<SetStateAction<Opening[]>>,
  idx: number,
) {
  const r = opening.radius;
  const diag1 = [
    -r * Math.SQRT1_2, -r * Math.SQRT1_2,
    r * Math.SQRT1_2, r * Math.SQRT1_2
  ];
  const diag2 = [
    r * Math.SQRT1_2, -r * Math.SQRT1_2,
    -r * Math.SQRT1_2, r * Math.SQRT1_2
  ];
  return (
    <Group
      key={idx}
      x={opening.x}
      y={opening.y}
      draggable
      dragBoundFunc={pos => ({ ...pos, x: Math.max(0, Math.round(pos.x)) })}
      onDragMove={(e) => handleDragMove(e, setOpenings, idx)}
    >
      <Circle
        x={0}
        y={0}
        radius={opening.radius}
        fill="white"
        stroke={opening.color}
        strokeWidth={2}
      />
      <Line
        points={diag1}
        stroke="grey"
        strokeWidth={2}
        dash={[8, 6]}
      />
      <Line
        points={diag2}
        stroke="grey"
        strokeWidth={2}
        dash={[8, 6]}
      />
    </Group>
  );
}

