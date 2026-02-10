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
      <div className="mb-4 px-4 py-2 bg-zinc-800 rounded text-zinc-300 text-sm text-center">
        🚧 Coming soon: Backend integration!<br />
        🌐 Users will be able to save and work collaboratively<br />
        🚀 Just like in a Google Doc<br />
        🖥️ (using websocket)
      </div>
      <p>
      </p>
      <OpeningsList openings={openings} setOpenings={setOpenings} hoveredOpeningId={hoveredOpeningId} />
    </aside>
  );
};


export default Sidebar;
