import { useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { Opening } from "../types";
import { renderOpeningMeasurements, renderXNodeMeasurements } from "../utils/renderUtils";
import { maxDimension, verticalMeasureWidth } from "../constants";
import { extractXnodes } from "../utils/utils";


const MeasurementBar = ({ localZoom, openings, stageX = 0 }: { localZoom: number, openings: Opening[], stageX?: number }) => {
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 400, height: 60 });
  const containerDivRef = useRef<HTMLDivElement>(null);

  const xNodes: number[] = extractXnodes(openings);

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
    <div ref={containerDivRef} className="w-full border flex flex-col items-center justify-center rounded-b-lg" >
      <Stage
        width={containerSize.width}
        height={containerSize.height}
        className="rounded shadow"
        scaleX={localZoom}
        scaleY={localZoom}
        x={Math.min(verticalMeasureWidth, stageX + verticalMeasureWidth)}
      >
        <Layer>
          <Rect x={0} y={0} width={maxDimension} height={containerSize.height} fill="grey" />
          {renderOpeningMeasurements(openings, containerSize.height)}
          {renderXNodeMeasurements(xNodes, containerSize.height)}
        </Layer>
      </Stage>
    </div>
  );
};

export default MeasurementBar;
