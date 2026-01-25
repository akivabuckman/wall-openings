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
      <OpeningsList openings={openings} setOpenings={setOpenings} />
    </aside>
  );
};


export default Sidebar;
