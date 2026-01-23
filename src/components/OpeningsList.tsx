import { Opening } from "../types";
import { Dispatch, SetStateAction, useState } from "react";
import NumberInput from "./NumberInput";

interface OpeningsListProps {
  openings: Opening[];
  setOpenings: Dispatch<SetStateAction<Opening[]>>;
}

const OpeningsList = ({ openings, setOpenings }: OpeningsListProps) => {
  const [collapsed, setCollapsed] = useState(() => openings.map(() => true));

  const toggleCollapse = (idx: number) => {
    setCollapsed(prev => prev.map((c, i) => (i === idx ? !c : c)));
  };
  const openingInputs = {
    rectangle: [
        { key: 'x', label: 'x:', min: 0 },
        { key: 'y', label: 'y:' },
        { key: 'width', label: 'width:', min: 1 },
        { key: 'height', label: 'height:', min: 1 },
        { key: 'distanceFromLast', label: 'distanceFromLast:' },
    ],
    circle: [
        { key: 'x', label: 'x:', min: 0 },
        { key: 'y', label: 'y:' },
        { key: 'radius', label: 'radius:', min: 1 },
        { key: 'distanceFromLast', label: 'distanceFromLast:' },
    ],
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
              {openingInputs[opening.type].map(input => (
                <NumberInput
                  key={input.key}
                  label={input.label}
                  value={opening[input.key as keyof typeof opening] as number}
                  onChange={val => setOpenings(prev => prev.map((o, i) =>
                    i === idx
                      ? { ...o, [input.key]: isNaN(val) ? 0 : (input.min !== undefined ? Math.max(val, input.min) : val) }
                      : o
                  ))}
                />
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default OpeningsList;
