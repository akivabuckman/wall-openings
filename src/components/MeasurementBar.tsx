import { useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { renderMeasurement } from "../utils/renderUtils";
import { Opening } from "../types";

const MeasurementBar = ({ localZoom, openingIndexes, openings }: { localZoom: number, openingIndexes: { openingId: number, fromPrevious: number }[], openings: Opening[] }) => {
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 400, height: 200 });
  const containerRef = useRef<HTMLDivElement>(null);
  
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
  

  return (
    <div ref={containerRef} className="w-full border-4 border-white border-solid flex items-center justify-center rounded-b-lg">
      {/* Measurements will go here */}
      <Stage
                  width={size.width}
                  height={size.height}
                  className="rounded shadow"
                  scaleX={localZoom}
                  scaleY={localZoom}
                  // x={Math.min(0, stagePos.x)}
                  // y={stagePos.y}
                  draggable
                  dragBoundFunc={(pos) => ({
                    x: Math.min(0, pos.x),
                    y: pos.y
                  })}
                >
                  <Layer>
                    <Rect  x={0} y={-9999} width={999999} height={999999} fill="red"/>
                    {/* Render measurements for each opening index */}
                    {openingIndexes.map((oi, idx) => {
                      console.log(oi)
                      if (idx === 0 || oi.fromPrevious === 0) return null;
                      // Find the current and previous opening x positions
                      const sorted = openings
                        .map((o, i) => ({ openingId: o.id ?? i, x: o.x }))
                        .sort((a, b) => {
                          if (a.x !== b.x) return a.x - b.x;
                          return a.openingId - b.openingId;
                        });
                      const prev = sorted[idx - 1];
                      const curr = sorted[idx];
                      if (!prev || !curr) return null;
                      return renderMeasurement({
                        x: curr.x - prev.x,
                        y: size.height / 2,
                        label: (curr.x - prev.x).toString(),
                      });
                    })}
                  </Layer>
                  </Stage>
    </div>
  );
};

export default MeasurementBar;
