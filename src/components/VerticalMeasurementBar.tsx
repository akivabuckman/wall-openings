import { useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { Opening } from "../types";
import VerticalMeasurement from "./VerticalMeasurement";
import { maxDimension, verticalMeasureWidth } from "../constants";


const VerticalMeasurementBar = ({ localZoom, openings, stageY = 0 }: { localZoom: number, openings: Opening[], stageY?: number }) => {
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: verticalMeasureWidth, height: 800 });
  const containerDivRef = useRef<HTMLDivElement>(null);

  const yNodes: number[] = openings.flatMap(opening => [
    opening.shape === 'RECTANGLE' ? opening.elevation : opening.elevation - opening.radius,
    opening.elevation + (opening.shape === 'RECTANGLE' ? opening.height : opening.radius)
  ]).sort((a, b) => a - b);

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
    <div ref={containerDivRef} className="h-full border flex items-center justify-center rounded-l-lg" style={{ width: verticalMeasureWidth }}>
      <Stage
        width={containerSize.width}
        height={containerSize.height}
        className="rounded shadow"
        scaleX={localZoom}
        scaleY={-localZoom}
        y={stageY}
      >
        <Layer>
          <Rect x={0} y={-maxDimension} width={containerSize.width} height={maxDimension * 2} fill="grey" />
          {/* Render measurements for yNodes */}
          {yNodes
            .slice()
            .sort((a, b) => a - b)
            .map((y, i, arr) => {
              if (i === 0) return null;
              return (
                <VerticalMeasurement
                  key={"ynode-" + i}
                  startY={arr[i - 1]}
                  endY={y}
                  x={containerSize.width / 2}
                />
              );
            })}
        </Layer>
      </Stage>
    </div>
  );
};

export default VerticalMeasurementBar;
