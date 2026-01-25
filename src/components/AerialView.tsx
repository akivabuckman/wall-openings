import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Line, Rect } from "react-konva";
import { Opening } from "../types";
import { defaultOpeningColor, verticalMeasureWidth } from "../constants";

const AerialView = ({ openings, zoom = 1, stageX = 0 }: { openings: Opening[], zoom?: number, stageX?: number }) => {
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 400,
    height: 200,
  });
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
            <Rect x={0} y={0} width={999999} height={containerSize.height} fill="gray" />
            <Line points={[0, 50, 999999, 50]} stroke="#222" strokeWidth={2} />
            <Line points={[0, 80, 999999, 80]} stroke="#222" strokeWidth={2} />
            {
              openings.map(opening => {
                if (opening.type === 'rectangle') {
                  return (
                    <Rect
                      key={opening.id}
                      x={opening.x * zoom}
                      y={50}
                      width={opening.width * zoom}
                      height={30}
                      stroke={defaultOpeningColor}
                      strokeWidth={2}
                    />
                  );
                }
              })
            }
          </Layer>
        </Stage>
      </div>
    </section>
  );
};

export default AerialView;
