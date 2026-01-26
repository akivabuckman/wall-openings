import { Dispatch, SetStateAction } from "react";
import { Opening } from "../types";
import OpeningsList from "./OpeningsList";

const Sidebar = ({ openings, setOpenings, hoveredOpeningId }: { 
  openings: Opening[],
  setOpenings: Dispatch<SetStateAction<Opening[]>>,
  hoveredOpeningId: number | null,
}) => {

  return (
    <aside
      className="w-100 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-6 relative select-none"
    >
      <OpeningsList openings={openings} setOpenings={setOpenings} hoveredOpeningId={hoveredOpeningId} />
    </aside>
  );
};


export default Sidebar;
