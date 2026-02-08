import { useRef, useEffect, useState } from "react";
import type { KonvaEventObject } from 'konva/lib/Node';
import { Stage, Layer, Rect, Line, Group } from "react-konva";
import MeasurementBar from "./MeasurementBar";
import VerticalMeasurementBar from "./VerticalMeasurementBar";
import { Opening } from "../types";
import { renderOpening } from "../utils/renderUtils.tsx";
import { maxDimension } from "../constants.ts";

interface CrossSectionViewProps {
  openings: Opening[];
  updateOpening: (opening: Opening) => void;
  zoom?: number;
  stagePos: { x: number; y: number };
  setStagePos: (pos: { x: number; y: number }) => void;
  setHoveredOpeningId?: (id: number | null) => void;
}

const CrossSectionView = ({ openings, updateOpening, zoom = 1, stagePos, setStagePos, setHoveredOpeningId }: CrossSectionViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 400, height: 200 });
  const onEnter = (opening: Opening) => setHoveredOpeningId && setHoveredOpeningId(opening.id);
  const onLeave = () => setHoveredOpeningId && setHoveredOpeningId(null);
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

  useEffect(() => {
    setLocalZoom(zoom);
  }, [zoom]);


  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    // if (!containerRef.current) return;
    // e.evt.preventDefault();
    // const stage = typeof e.target.getStage === 'function' ? e.target.getStage() : null;
    // if (!stage) return;
    // const oldScale = localZoom;
    // const pointer = stage.getPointerPosition();
    // if (!pointer) return;
    // const mouseX = pointer.x;
    // const mouseY = pointer.y;
    // const direction = e.evt.deltaY > 0 ? -1 : 1;
    // const scaleBy = 1.1;
    // const newZoom = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    // const clampedZoom = Math.max(0.1, Math.min(10, newZoom));
    // const worldX = (mouseX - stagePos.x) / oldScale;
    // const worldY = (mouseY - stagePos.y) / oldScale;
    // const newX = mouseX - worldX * clampedZoom;
    // const newY = mouseY - worldY * clampedZoom;
    // const minY = size.height - worldY * clampedZoom;
    // setLocalZoom(clampedZoom);
    // setStagePos({ x: newX, y: Math.min(newY, minY) });
  };


  return (
    <section className="flex-1 min-h-0 rounded-t-lg shadow-inner flex flex-col items-center justify-center">
      <div className="w-full flex-1 flex flex-col">
        <div className="w-full flex-1 flex flex-row relative">
          <div className="absolute left-0 top-0 h-full" >
            <VerticalMeasurementBar localZoom={localZoom} openings={openings} stageY={stagePos.y} />
          </div>
          {/* <div className="flex-1 flex items-center justify-center" > */}
            <div ref={containerRef} className="w-full h-full flex items-center justify-center ml-24">
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
                onDragMove={(e) => {
                  const stage = e.target.getStage();
                  if (stage) {
                    setStagePos({ x: stage.x(), y: stage.y() });
                  }
                }}
                onWheel={handleWheel}
              >
                <Layer scaleY={-1}>
                  <Rect  x={0} y={-maxDimension / 100} width={maxDimension} height={maxDimension} fill="gray"/>
                  {openings.map((opening, idx) => (
                      <Group key={opening.id} onMouseEnter={() => onEnter(opening)} onMouseLeave={onLeave}>
                        {renderOpening(opening, updateOpening, idx)}
                      </Group>
                  ))}
                  <Line
                    points={[0, 0, maxDimension, 0]}
                    stroke="black"
                    strokeWidth={1}
                  />
                </Layer>
              </Stage>
            </div>
          {/* </div> */}
        </div>
        <MeasurementBar localZoom={localZoom} openings={openings} stageX={stagePos.x} />
      </div>
    </section>
  );
};

export default CrossSectionView;
