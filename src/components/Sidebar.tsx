import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Opening } from "../types";
import OpeningsList from "./OpeningsList";

const Sidebar = ({ openings, setOpenings }: { 
  openings: Opening[],
  setOpenings: Dispatch<SetStateAction<Opening[]>>,
}) => {

  return (
    <aside
      className="w-100 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-6 relative select-none"
    >
      <div
        className="absolute top-0 right-0 h-full cursor-col-resize z-20"
      />
      <h2 className="text-zinc-100 text-lg font-semibold mb-6">Controls</h2>
      <div className="w-full px-2">
        <h3 className="text-zinc-400 text-sm font-medium mb-2">Openings List</h3>
        <OpeningsList openings={openings} setOpenings={setOpenings} />
      </div>
    </aside>
  );
};


export default Sidebar;
