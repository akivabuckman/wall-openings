
import { useState, useCallback, Dispatch, SetStateAction } from "react";
import { Opening } from "../types";
import CrossSectionView from "./CrossSectionView";
import AerialView from "./AerialView";
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from "../constants";



const MainPanel = ({ openings, setOpenings }: { openings: Opening[], setOpenings: Dispatch<SetStateAction<Opening[]>> }) => {
  const [zoom, setZoom] = useState(1);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // e.preventDefault();
    // setZoom((prev) => {
    //   let next = prev - Math.sign(e.deltaY) * ZOOM_STEP;
    //   next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
    //   return next;
    // });
  }, []);

  return (
    <main className="flex flex-col flex-1 h-full" onWheel={handleWheel} tabIndex={0} style={{ outline: "none" }}>
      <div className="flex-3 flex flex-col min-h-0" style={{flex: 3}}>
        <CrossSectionView openings={openings} setOpenings={setOpenings} zoom={zoom}  />
      </div>
      <div className="flex-1 min-h-0">
        <AerialView zoom={zoom} />
      </div>
    </main>
  );
};

export default MainPanel;
