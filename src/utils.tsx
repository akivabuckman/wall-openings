import { Circle, Group, Line, Rect, Shape } from "react-konva";
import { Opening } from "./types";

export function renderOpening(opening: Opening, key?: string | number) {
  if (opening.type === 'rectangle') {
    return renderRectangleOpening(opening, key);
  }
  if (opening.type === 'circle') {
    return renderCircleOpening(opening, key);
  }
  return null;
}

function renderRectangleOpening(opening: Extract<Opening, { type: 'rectangle' }>, key?: string | number) {
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
      key={key}
      x={opening.x}
      y={opening.y}
      draggable
      scaleY={-1}
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

function renderCircleOpening(opening: Extract<Opening, { type: 'circle' }>, key?: string | number) {
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
    <Group key={key} x={opening.x} y={opening.y} draggable>
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

