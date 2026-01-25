import { useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { Opening } from "../types";
import Measurement from "./Measurement";


const MeasurementBar = ({ localZoom, openings }: { localZoom: number, openings: Opening[] }) => {
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 400, height: 60 });
  const containerDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateContainerSize() {
      if (containerDivRef.current) {
        setContainerSize({
          width: containerDivRef.current.offsetWidth,
          height: containerDivRef.current.offsetHeight,
        });
      }
    }
    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, []);

  return (
    <div ref={containerDivRef} className="w-full border flex items-center justify-center rounded-b-lg">
      <Stage
        width={containerSize.width}
        height={containerSize.height}
        className="rounded shadow"
        scaleX={localZoom}
        scaleY={localZoom}
      >
        <Layer>
          <Rect x={0} y={0} width={999999} height={containerSize.height} fill="grey" />
          {/* Render measurements for each opening index */}
          {[...openings]
            .sort((a, b) => a.x - b.x || a.id - b.id)
            .map((opening, i, arr) => {
              if (i === 0 || opening.fromPrevious === 0) return null;
              const prev = arr[i - 1];
              return (
                <Measurement
                  key={opening.id}
                  startX={prev.x}
                  endX={opening.x}
                  y={containerSize.height / 2}
                />
              );
            })}
        </Layer>
      </Stage>
    </div>
  );
};

export default MeasurementBar;
