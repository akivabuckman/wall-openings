import { useRef, useEffect, useState } from "react";
import { Stage, Layer, Line, Rect } from "react-konva";
import { Opening } from "../types";
import { maxDimension, verticalMeasureWidth } from "../constants";
import { renderAerialOpening, renderXNodeMeasurements } from "../utils/renderUtils";
import { extractXnodes } from "../utils/utils";

const AerialView = ({ openings, zoom = 1, stageX = 0 }: { openings: Opening[], zoom?: number, stageX?: number }) => {
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 400,
    height: 200,
  });
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
    <section className="h-full bg-zinc-900 rounded-b-lg shadow-inner flex flex-col items-center justify-center">
      <div ref={containerDivRef} className="w-full flex items-center justify-center" >
        <Stage 
          width={containerSize.width} 
          height={containerSize.height} 
          className="rounded shadow" 
          scaleX={zoom} 
          scaleY={zoom} 
          x={Math.min(verticalMeasureWidth, stageX + verticalMeasureWidth)}  
        >
          <Layer>
            <Rect x={0} y={0} width={maxDimension} height={containerSize.height} fill="gray" />
            <Line points={[0, 50, maxDimension, 50]} stroke="#222" strokeWidth={2} />
            <Line points={[0, 80, maxDimension, 80]} stroke="#222" strokeWidth={2} />
            {openings.map(opening => renderAerialOpening(opening, zoom, 50))}
            {renderXNodeMeasurements(xNodes, containerSize.height)}
          </Layer>
        </Stage>
      </div>
    </section>
  );
};

export default AerialView;
