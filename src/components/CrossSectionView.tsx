

import { useRef, useEffect, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import MeasurementBar from "./MeasurementBar";
import { Opening } from "../types";
import { renderOpening } from "../utils.tsx";

const CrossSectionView = ({ openings, zoom = 1 }: { openings: Opening[], zoom?: number }) => {
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

  return (
    <section className="flex-1 min-h-0 bg-zinc-800 rounded-t-lg shadow-inner flex flex-col items-center justify-center p-6">
      <div className="w-full flex-1 flex flex-col">
        <div ref={containerRef} className="w-full flex-1 flex items-center justify-center">
          <Stage
            width={size.width}
            height={size.height}
            className="rounded shadow"
            scaleX={zoom}
            scaleY={zoom}
            y={size.height * (1 - zoom)}
          >
            <Layer>
              <Rect x={0} y={-9999} width={999999} height={999999} fill="gray" />
              {openings.map((opening, idx) => renderOpening(opening, idx))}
            </Layer>
          </Stage>
        </div>
        <MeasurementBar />
      </div>
    </section>
  );
};

export default CrossSectionView;
