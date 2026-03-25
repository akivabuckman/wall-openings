/**
 * WallCrossSectionDemo
 *
 * Self-contained demo component – no backend, no websocket, no toast.
 * Only external dependencies required: react, react-konva, konva.
 *
 * Drop this single file into any React project and render <WallCrossSectionDemo />.
 */

import { useRef, useEffect, useState, Dispatch, SetStateAction } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import { Circle, Group, Layer, Line, Rect, Shape, Stage, Text } from "react-konva";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OpeningBase {
  x: number;
  elevation: number;
  color: string;
  id: number;
  fromPrevious: number;
  xIndex: number;
}

interface RectangleOpening extends OpeningBase {
  shape: "RECTANGLE";
  width: number;
  height: number;
}

interface CircleOpening extends OpeningBase {
  shape: "CIRCLE";
  radius: number;
}

type Opening = RectangleOpening | CircleOpening;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const tickAngle = 45;
const tickLength = 16;
const verticalMeasureWidth = 90;
const maxDimension = 999999;

// ---------------------------------------------------------------------------
// Default openings  (3 initial openings)
// ---------------------------------------------------------------------------

const DEFAULT_OPENINGS: Opening[] = [
  {
    id: 1,
    shape: "RECTANGLE",
    x: 100,
    elevation: 90,
    width: 120,
    height: 120,
    color: "#3b82f6",
    fromPrevious: 0,
    xIndex: 0,
  },
  {
    id: 2,
    shape: "RECTANGLE",
    x: 350,
    elevation: 0,
    width: 90,
    height: 210,
    color: "#22c55e",
    fromPrevious: 250,
    xIndex: 1,
  },
  {
    id: 3,
    shape: "CIRCLE",
    x: 580,
    elevation: 150,
    radius: 55,
    color: "#f97316",
    fromPrevious: 230,
    xIndex: 2,
  },
];

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function extractXnodes(openings: Opening[]): number[] {
  return Array.from(
    new Set(
      openings.flatMap((o) => [
        o.shape === "RECTANGLE" ? o.x : o.x - o.radius,
        o.x + (o.shape === "RECTANGLE" ? o.width : o.radius),
      ])
    )
  ).sort((a, b) => a - b);
}

function recalcXIndex(openings: Opening[]): Opening[] {
  const sorted = [...openings].sort((a, b) => a.x - b.x || a.id - b.id);
  sorted.forEach((o, i) => {
    o.xIndex = i;
  });
  return openings.map((o) => sorted.find((u) => u.id === o.id)!);
}

function updateX(openings: Opening[], openingId: number, value: number): Opening[] {
  const updated = openings.map((o) =>
    o.id === openingId ? { ...o, x: isNaN(value) ? 0 : Math.max(0, value) } : o
  );
  const sorted = [...updated].sort((a, b) => a.x - b.x || a.xIndex - b.xIndex);
  sorted.forEach((o, i) => {
    o.xIndex = i;
    o.fromPrevious = i === 0 ? 0 : o.x - sorted[i - 1].x;
  });
  return updated.map((o) => sorted.find((u) => u.id === o.id)!);
}

function handleDragMove(
  e: { target: { position: () => { x: number; y: number } } },
  setOpenings: Dispatch<SetStateAction<Opening[]>>,
  idx: number
) {
  const { x, y } = e.target.position();
  setOpenings((prev) => {
    const draggedId = prev[idx].id;
    const updated = prev.map((o) => {
      if (o.id !== draggedId) return o;
      if (o.shape === "RECTANGLE") return { ...o, x, elevation: y - o.height };
      return { ...o, x, elevation: y };
    });
    const sorted = [...updated].sort((a, b) =>
      a.x !== b.x ? a.x - b.x : a.id - b.id
    );
    const withFromPrev = sorted.map((o, i) => ({
      ...o,
      fromPrevious: i === 0 ? 0 : o.x - sorted[i - 1].x,
      xIndex: i,
    }));
    return prev.map((o) => withFromPrev.find((u) => u.id === o.id)!);
  });
}

// ---------------------------------------------------------------------------
// Tick sub-component
// ---------------------------------------------------------------------------

const Tick = ({ x, y, rotation = 0 }: { x: number; y: number; rotation?: number }) => {
  const rad = ((tickAngle + rotation) * Math.PI) / 180;
  const dx = (tickLength / 2) * Math.cos(rad);
  const dy = (tickLength / 2) * Math.sin(rad);
  return (
    <Line
      points={[x - dx, y + dy, x + dx, y - dy]}
      stroke="#222"
      strokeWidth={2}
      draggable={false}
    />
  );
};

// ---------------------------------------------------------------------------
// Measurement sub-component
// ---------------------------------------------------------------------------

const Measurement = ({
  startX,
  endX,
  y,
}: {
  startX: number;
  endX: number;
  y: number;
}) => {
  const length = endX - startX;
  const midX = startX + length / 2;
  return (
    <>
      <Line
        points={[startX, y, endX, y]}
        stroke="#222"
        strokeWidth={2}
        draggable={false}
      />
      <Tick x={startX} y={y} />
      <Tick x={endX} y={y} />
      <Text
        x={midX}
        y={y - 20}
        text={length.toString()}
        fontSize={18}
        fill="#222"
        align="center"
        draggable={false}
      />
    </>
  );
};

// ---------------------------------------------------------------------------
// Opening renderers
// ---------------------------------------------------------------------------

function renderRectangleOpening(
  opening: RectangleOpening,
  setOpenings: Dispatch<SetStateAction<Opening[]>>,
  idx: number
) {
  const angleRad = (20 * Math.PI) / 180;
  const percent = 0.8;
  const x1 = 0;
  const y1 = opening.height;
  const y2 = opening.height * (1 - percent);
  const x2 = Math.tan(angleRad) * opening.height * percent;
  const x3 = opening.width;

  return (
    <Group
      key={idx}
      x={opening.x}
      y={opening.elevation + opening.height}
      draggable
      dragBoundFunc={(pos) => ({
        ...pos,
        x: Math.max(0, Math.round(pos.x)),
        y: Math.max(0, Math.round(pos.y)),
      })}
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
          context.lineTo(x3, 0);
          context.lineTo(0, 0);
          context.closePath();
          context.fillStrokeShape(shape);
        }}
        fill="black"
        strokeEnabled={false}
      />
      <Line points={[0, 0, 0, opening.height]} stroke={opening.color} strokeWidth={2} />
      <Line points={[0, 0, opening.width, 0]} stroke={opening.color} strokeWidth={2} />
      <Measurement startX={0} endX={opening.width} y={opening.height / 2} />
    </Group>
  );
}

function renderCircleOpening(
  opening: CircleOpening,
  setOpenings: Dispatch<SetStateAction<Opening[]>>,
  idx: number
) {
  const r = opening.radius;
  const diag1 = [-r * Math.SQRT1_2, -r * Math.SQRT1_2, r * Math.SQRT1_2, r * Math.SQRT1_2];
  const diag2 = [r * Math.SQRT1_2, -r * Math.SQRT1_2, -r * Math.SQRT1_2, r * Math.SQRT1_2];

  return (
    <Group
      key={idx}
      x={opening.x}
      y={opening.elevation}
      scaleY={-1}
      draggable
      dragBoundFunc={(pos) => ({
        ...pos,
        x: Math.max(0, Math.round(pos.x)),
        y: Math.max(0, Math.round(pos.y)),
      })}
      onDragMove={(e) => handleDragMove(e, setOpenings, idx)}
    >
      <Circle
        x={0}
        y={0}
        radius={r}
        fill="white"
        stroke={opening.color}
        strokeWidth={2}
      />
      <Line points={diag1} stroke="grey" strokeWidth={2} dash={[8, 6]} />
      <Line points={diag2} stroke="grey" strokeWidth={2} dash={[8, 6]} />
      <Measurement startX={-r} endX={r} y={0} />
    </Group>
  );
}

function renderOpening(
  opening: Opening,
  setOpenings: Dispatch<SetStateAction<Opening[]>>,
  idx: number
) {
  if (opening.shape === "RECTANGLE") return renderRectangleOpening(opening, setOpenings, idx);
  if (opening.shape === "CIRCLE") return renderCircleOpening(opening, setOpenings, idx);
  return null;
}

// ---------------------------------------------------------------------------
// MeasurementBar sub-component
// ---------------------------------------------------------------------------

function renderOpeningMeasurements(
  openings: Opening[],
  containerHeight: number,
  px = 0
) {
  return [...openings]
    .sort((a, b) => a.x - b.x || a.id - b.id)
    .map((opening, i, arr) => {
      if (i === 0 || opening.fromPrevious === 0) return null;
      const prev = arr[i - 1];
      return (
        <Measurement
          key={opening.id}
          startX={prev.x}
          endX={opening.x}
          y={containerHeight / 2 - 10 + px}
        />
      );
    });
}

function renderXNodeMeasurements(
  xNodes: number[],
  containerHeight: number,
  px = 0
) {
  return [...xNodes].sort((a, b) => a - b).map((x, i, arr) => {
    if (i === 0) return null;
    return (
      <Measurement
        key={"xnode-" + i}
        startX={arr[i - 1]}
        endX={x}
        y={containerHeight / 2 + 18 + px}
      />
    );
  });
}

const MeasurementBar = ({
  localZoom,
  openings,
  stageX = 0,
}: {
  localZoom: number;
  openings: Opening[];
  stageX?: number;
}) => {
  const containerDivRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 400, height: 60 });

  const xNodes = extractXnodes(openings);

  useEffect(() => {
    function update() {
      if (containerDivRef.current) {
        setContainerSize({
          width: containerDivRef.current.offsetWidth,
          height: containerDivRef.current.offsetHeight,
        });
      }
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      ref={containerDivRef}
      className="w-full bg-zinc-900 flex flex-col items-center justify-center"
    >
      <Stage
        width={containerSize.width}
        height={containerSize.height}
        scaleX={localZoom}
        scaleY={localZoom}
        x={Math.min(verticalMeasureWidth, stageX + verticalMeasureWidth)}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={maxDimension}
            height={containerSize.height}
            fill="grey"
          />
          {renderOpeningMeasurements(openings, containerSize.height, 4)}
          {renderXNodeMeasurements(xNodes, containerSize.height, 4)}
        </Layer>
      </Stage>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main demo component
// ---------------------------------------------------------------------------

const WallCrossSectionDemo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openings, setOpenings] = useState<Opening[]>(DEFAULT_OPENINGS);
  const [size, setSize] = useState({ width: 400, height: 400 });
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const zoom = 1;

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Recalculate fromPrevious whenever openings change position
  useEffect(() => {
    setOpenings((prev) => recalcXIndex([...prev]));
  }, []);

  const handleWheel = (_e: KonvaEventObject<WheelEvent>) => {
    // Zoom intentionally disabled in demo; wire up if needed.
  };

  return (
    <section className="flex-1 min-h-0 rounded-t-lg shadow-inner flex flex-col items-center justify-center">
      <div className="w-full flex-1 flex flex-col">
        <div className="w-full flex-1 flex flex-row relative border-b-4 border-black">
          <div ref={containerRef} className="w-full h-full flex items-center justify-center">
            <Stage
              width={size.width}
              height={size.height}
              className="rounded shadow"
              scaleX={zoom}
              scaleY={zoom}
              x={Math.min(0, stagePos.x)}
              y={stagePos.y}
              draggable
              dragBoundFunc={(pos) => ({
                x: Math.min(0, pos.x),
                y: pos.y,
              })}
              onDragMove={(e) => {
                const stage = e.target.getStage();
                if (stage) setStagePos({ x: stage.x(), y: stage.y() });
              }}
              onWheel={handleWheel}
            >
              <Layer scaleY={-1}>
                <Rect
                  x={0}
                  y={-maxDimension / 100}
                  width={maxDimension}
                  height={maxDimension}
                  fill="gray"
                />
                {openings.map((opening, idx) =>
                  renderOpening(opening, setOpenings, idx)
                )}
                <Line
                  points={[0, 0, maxDimension, 0]}
                  stroke="black"
                  strokeWidth={1}
                />
                <Text
                  text="Elevation = 0"
                  x={8}
                  y={14}
                  fontSize={12}
                  fill="black"
                  scaleY={-1}
                />
              </Layer>
            </Stage>
          </div>
        </div>
        <MeasurementBar localZoom={zoom} openings={openings} stageX={stagePos.x} />
      </div>
    </section>
  );
};

export default WallCrossSectionDemo;
