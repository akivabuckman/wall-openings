import { useState, useCallback, Dispatch, SetStateAction } from "react";
import { Opening } from "../types";
import AerialView from "./AerialView";
// import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from "../constants";
import CrossSectionView from "./CrossSectionView";

const MainPanel = ({ openings, setOpenings, hoveredOpeningId, setHoveredOpeningId }: {
  openings: Opening[],
  setOpenings: Dispatch<SetStateAction<Opening[]>>,
  hoveredOpeningId?: number | null,
  setHoveredOpeningId?: (id: number | null) => void
}) => {
  const [zoom, setZoom] = useState(1);
  const [stagePos, setStagePos] = useState<{ x: number; y: number }>({ x: 0, y: 450 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // e.preventDefault();
    // setZoom((prev) => {
    //   let next = prev - Math.sign(e.deltaY) * ZOOM_STEP;
    //   next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
    //   return next;
    // });
  }, []);

  return (
    <main className="flex flex-col flex-1 h-full min-h-0" onWheel={handleWheel} tabIndex={0} style={{ outline: "none", minHeight: 0 }}>
      <div className="flex-3 flex flex-col min-h-0" style={{ flex: 9, minHeight: 550 }}>
        <CrossSectionView 
          openings={openings} 
          setOpenings={setOpenings} 
          zoom={zoom} 
          stagePos={stagePos}
          setStagePos={setStagePos}
          setHoveredOpeningId={setHoveredOpeningId}
        />
      </div>
      <div className="border-t-2 border-black" style={{ flex: 1 }}>
        <AerialView 
          openings={openings} 
          zoom={zoom} 
          stageX={stagePos.x}
        />
      </div>
    </main>
  );
};

export default MainPanel;
