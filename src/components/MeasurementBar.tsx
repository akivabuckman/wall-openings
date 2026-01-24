import { useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { Opening } from "../types";
import Measurement from "./Measurement";


const MeasurementBar = ({ localZoom, openingIndexes, openings }: { localZoom: number, openingIndexes: { openingId: number, fromPrevious: number }[], openings: Opening[] }) => {
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 400, height: 60 });
  const containerDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateContainerSize() {
      if (containerDivRef.current) {
        console.log(9999)
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
          {openingIndexes.map((openingIndex, openingIndexArrayIndex) => {
            if (openingIndexArrayIndex === 0 || openingIndex.fromPrevious === 0) return null;
            // Find the current and previous opening x positions
            const sortedOpenings = openings
              .map((opening, openingArrayIndex) => ({ openingId: opening.id ?? openingArrayIndex, x: opening.x }))
              .sort((openingA, openingB) => {
                if (openingA.x !== openingB.x) return openingA.x - openingB.x;
                return openingA.openingId - openingB.openingId;
              });
              const previousOpening = sortedOpenings[openingIndexArrayIndex - 1];
              const currentOpening = sortedOpenings[openingIndexArrayIndex];
            if (!previousOpening || !currentOpening) return null;
            return (
              <Measurement
                key={currentOpening.openingId}
                startX={previousOpening.x}
                endX={currentOpening.x}
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
