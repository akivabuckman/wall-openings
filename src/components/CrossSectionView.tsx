

import { useRef, useEffect, useState, SetStateAction, Dispatch } from "react";
import type { KonvaEventObject } from 'konva/lib/Node';
import { Stage, Layer, Rect, Line } from "react-konva";
import MeasurementBar from "./MeasurementBar";
import { Opening } from "../types";
import { renderOpening } from "../utils.tsx";

const CrossSectionView = ({ openings, setOpenings, zoom = 1 }: { openings: Opening[], setOpenings: Dispatch<SetStateAction<Opening[]>>, zoom?: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 400, height: 200 });

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

  const [localZoom, setLocalZoom] = useState(zoom);
  const [stagePos, setStagePos] = useState<{ x: number; y: number }>({ x: 0, y: size.height * (1 - zoom) - 30 });

  useEffect(() => {
    setLocalZoom(zoom);
  }, [zoom]);


  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    if (!containerRef.current) return;
    e.evt.preventDefault();
    const stage = typeof e.target.getStage === 'function' ? e.target.getStage() : null;
    if (!stage) return;
    const oldScale = localZoom;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const mouseX = pointer.x;
    const mouseY = pointer.y;
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const scaleBy = 1.1;
    const newZoom = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedZoom = Math.max(0.1, Math.min(10, newZoom));
    const worldX = (mouseX - stagePos.x) / oldScale;
    const worldY = (mouseY - stagePos.y) / oldScale;
    const newX = mouseX - worldX * clampedZoom;
    const newY = mouseY - worldY * clampedZoom;
    const minY = size.height - worldY * clampedZoom;
    setLocalZoom(clampedZoom);
    setStagePos({ x: newX, y: Math.min(newY, minY) });
  };


  return (
    <section className="flex-1 min-h-0 bg-zinc-800 rounded-t-lg shadow-inner flex flex-col items-center justify-center">
      <div className="w-full flex-1 flex flex-col">
        <div ref={containerRef} className="w-full flex-1 flex items-center justify-center">
          <Stage
            width={size.width}
            height={size.height}
            className="rounded shadow"
            scaleX={localZoom}
            scaleY={localZoom}
            x={Math.min(0, stagePos.x)}
            y={stagePos.y}
            draggable
            dragBoundFunc={(pos) => ({
              x: Math.min(0, pos.x),
              y: pos.y
            })}
            onWheel={handleWheel}
          >
            <Layer scaleY={-1}>
              <Rect  x={0} y={-9999} width={999999} height={999999} fill="gray"/>
              {openings.map((opening, idx) => renderOpening(opening, setOpenings, idx))}
              <Line
                points={[0, 0, 999999, 0]}
                stroke="black"
                strokeWidth={1}
              />
            </Layer>
          </Stage>
        </div>
        <MeasurementBar />
      </div>
    </section>
  );
};

export default CrossSectionView;
