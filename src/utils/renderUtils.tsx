import { Circle, Group, Line, Rect, Shape } from "react-konva";
import { Opening } from "../types";
import { Dispatch, SetStateAction } from "react";

function recalcXIndex(openings: Opening[]): Opening[] {
  const sorted = [...openings].sort((a, b) => a.x - b.x || a.id - b.id);
  sorted.forEach((o, i) => { o.xIndex = i; });
  return openings.map(o => sorted.find(u => u.id === o.id)!);
}


// No longer used: fromPrevious is always derived from x and previous x

function updateX(openings: Opening[], openingId: number, value: number, min?: number): Opening[] {
  let updated = openings.map(o =>
    o.id === openingId ? { ...o, x: isNaN(value) ? 0 : (min !== undefined ? Math.max(value, min) : value) } : o
  );
  // After x change, recalc fromPrevious for all based on x order
  const sorted = [...updated].sort((a, b) => a.x - b.x || a.id - b.id);
  sorted.forEach((o, i) => {
    o.xIndex = i;
    o.fromPrevious = i === 0 ? 0 : o.x - sorted[i - 1].x;
  });
  return updated.map(o => sorted.find(u => u.id === o.id)!);
}
export function updateOpeningField(
  openings: Opening[],
  openingId: number,
  key: keyof Opening,
  value: number,
  min?: number,
): Opening[] {
  if (key === 'fromPrevious') {
    // When fromPrevious is changed, update x instead, but do not allow < 0
    const target = openings.find(o => o.id === openingId);
    if (!target) return openings;
    const prev = openings.find(o => o.xIndex === (target.xIndex ?? 0) - 1);
    if (!prev) return openings;
    const prevX = prev.x;
    console.log(prevX, value)
    console.log(openings)
    if (value < 0) return openings;
    const newX = prevX + value;
    console.log(prevX, value, newX)
    return updateX(openings, openingId, newX);
  }
  if (key === 'x') {
    return updateX(openings, openingId, value, min);
  }
  // Other fields: just update the field
  let updated = openings.map(o =>
    o.id === openingId ? { ...o, [key]: isNaN(value) ? 0 : (min !== undefined ? Math.max(value, min) : value) } : o
  );
  return recalcXIndex(updated);
}

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
  setOpenings(prev => {
    // Find the id of the dragged opening
    const draggedId = prev[idx].id;
    // Update only the dragged opening's x/y
    const updated = prev.map((o) => {
      if (o.id !== draggedId) return o;
      if (o.type === 'rectangle') {
        return { ...o, x, y: y - o.height };
      }
      return { ...o, x, y };
    });
    // Sort for fromPrevious/index calculation
    const sorted = [...updated].sort((a, b) => {
      if (a.x !== b.x) return a.x - b.x;
      return a.id - b.id;
    });
    // Update fromPrevious and index for all
    const withFromPrev = sorted.map((o, i) => {
      const fromPrevious = i === 0 ? 0 : o.x - sorted[i - 1].x;
      return { ...o, fromPrevious, xIndex: i };
    });
    // Restore original order by id
    return prev.map(o => withFromPrev.find(u => u.id === o.id)!);
  });
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
      y={opening.y + opening.height}
      draggable
      dragBoundFunc={pos => ({ ...pos, x: Math.max(0, Math.round(pos.x)), y: Math.max(0, Math.round(pos.y)) })}
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
      dragBoundFunc={pos => ({ ...pos, x: Math.max(0, Math.round(pos.x)), y: Math.max(0, Math.round(pos.y)) })}
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

// Measurement rendering moved to Measurement and Tick components.