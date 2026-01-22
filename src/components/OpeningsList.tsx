import { Opening } from "../types";
import { Dispatch, SetStateAction, useState } from "react";

interface OpeningsListProps {
  openings: Opening[];
  setOpenings: Dispatch<SetStateAction<Opening[]>>;
}

const OpeningsList = ({ openings, setOpenings }: OpeningsListProps) => {
  const [collapsed, setCollapsed] = useState(() => openings.map(() => true));

  const toggleCollapse = (idx: number) => {
    setCollapsed(prev => prev.map((c, i) => (i === idx ? !c : c)));
  };

  return (
    <ul className="space-y-2">
      {openings.map((opening, idx) => (
        <li key={idx} className="bg-zinc-800 rounded px-3 py-2 text-zinc-200 text-xs flex flex-col gap-1">
          <button
            className="flex items-center gap-2 w-full text-left focus:outline-none"
            onClick={() => toggleCollapse(idx)}
            aria-expanded={!collapsed[idx]}
          >
            <span className="inline-block w-4 text-blue-400">{collapsed[idx] ? '+' : '-'}</span>
            <span className="font-bold mr-2 capitalize">{opening.type}</span>
            <span className="text-zinc-400">[{idx}]</span>
          </button>
          {!collapsed[idx] && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <label className="text-zinc-400 w-14">x:</label>
                <input
                  type="number"
                  className="w-20 h-8 rounded-md border border-zinc-600 bg-zinc-800 px-2 py-1 text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 shadow-sm"
                  value={opening.x}
                  onChange={e => {
                    const newX = parseFloat(e.target.value);
                    setOpenings(prev => prev.map((o, i) => i === idx ? { ...o, x: isNaN(newX) ? 0 : newX } : o));
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-zinc-400 w-14">y:</label>
                <input
                  type="number"
                  className="w-20 h-8 rounded-md border border-zinc-600 bg-zinc-800 px-2 py-1 text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 shadow-sm"
                  value={opening.y}
                  onChange={e => {
                    const newY = parseFloat(e.target.value);
                    setOpenings(prev => prev.map((o, i) => i === idx ? { ...o, y: isNaN(newY) ? 0 : newY } : o));
                  }}
                />
              </div>
              {opening.type === 'rectangle' ? (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-zinc-400 w-14">width:</label>
                    <input
                      type="number"
                      className="w-20 h-8 rounded-md border border-zinc-600 bg-zinc-800 px-2 py-1 text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 shadow-sm"
                      value={opening.width}
                      onChange={e => {
                        const newWidth = parseFloat(e.target.value);
                        setOpenings(prev => prev.map((o, i) => i === idx ? { ...o, width: isNaN(newWidth) ? 0 : newWidth } : o));
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-zinc-400 w-14">height:</label>
                    <input
                      type="number"
                      className="w-20 h-8 rounded-md border border-zinc-600 bg-zinc-800 px-2 py-1 text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 shadow-sm"
                      value={opening.height}
                      onChange={e => {
                        const newHeight = parseFloat(e.target.value);
                        setOpenings(prev => prev.map((o, i) => i === idx ? { ...o, height: isNaN(newHeight) ? 0 : newHeight } : o));
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <label className="text-zinc-400 w-14">radius:</label>
                  <input
                    type="number"
                    className="w-20 h-8 rounded-md border border-zinc-600 bg-zinc-800 px-2 py-1 text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 shadow-sm"
                    value={opening.radius}
                    onChange={e => {
                      const newRadius = parseFloat(e.target.value);
                      setOpenings(prev => prev.map((o, i) => i === idx ? { ...o, radius: isNaN(newRadius) ? 0 : newRadius } : o));
                    }}
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <label className="text-zinc-400 w-14">distanceFromLast:</label>
                <input
                  type="number"
                  className="w-20 h-8 rounded-md border border-zinc-600 bg-zinc-800 px-2 py-1 text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 shadow-sm"
                  value={opening.distanceFromLast}
                  onChange={e => {
                    const newDist = parseFloat(e.target.value);
                    setOpenings(prev => prev.map((o, i) => i === idx ? { ...o, distanceFromLast: isNaN(newDist) ? 0 : newDist } : o));
                  }}
                />
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default OpeningsList;
