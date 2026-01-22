import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Opening } from "../types";

const MIN_WIDTH = 200;
const MAX_WIDTH = 500;

const Sidebar = ({ openings, setOpenings }: { openings: Opening[], setOpenings: Dispatch<SetStateAction<Opening[]>> }) => {
  const [width, setWidth] = useState(320);
  const dragging = useRef(false);

  const onMouseDown = () => {
    dragging.current = true;
    document.body.style.cursor = "col-resize";
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX)));
  };

  const onMouseUp = () => {
    dragging.current = false;
    document.body.style.cursor = "";
  };

  // Attach/detach listeners
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <aside
      className="h-full bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-6 relative select-none"
      style={{ width }}
    >
      <div
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize z-20"
        onMouseDown={onMouseDown}
        style={{ userSelect: "none" }}
      />
      <h2 className="text-zinc-100 text-lg font-semibold mb-6">Controls</h2>
      <div className="w-full px-2">
        <h3 className="text-zinc-400 text-sm font-medium mb-2">Openings List</h3>
        <ul className="space-y-2">
          {openings.map((opening, idx) => (
            <li key={idx} className="bg-zinc-800 rounded px-3 py-2 text-zinc-200 text-xs">
              <span className="font-bold mr-2">{opening.type}</span>
              {opening.type === 'rectangle' ? (
                <span>
                  w: {opening.width}, h: {opening.height}
                </span>
              ) : (
                <span>
                  r: {opening.radius}
                </span>
              )}
              <span className="ml-2">elev: {opening.y}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};


export default Sidebar;
