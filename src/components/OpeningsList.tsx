import { Opening } from "../types";
import { updateOpeningField } from "../utils/renderUtils";
import { Dispatch, SetStateAction, useState } from "react";
import NumberInput from "./NumberInput";

interface OpeningsListProps {
  openings: Opening[];
  setOpenings: Dispatch<SetStateAction<Opening[]>>;
}

const OpeningsList = ({ openings, setOpenings }: OpeningsListProps) => {
  const [collapsed, setCollapsed] = useState<boolean[]>(() => openings.map(() => false));

  const toggleCollapse = (idx: number) => {
    setCollapsed(prev => prev.map((c, i) => (i === idx ? !c : c)));
  };
  const openingInputs = {
    rectangle: [
        { key: 'x', label: 'X:', min: 0 },
        { key: 'y', label: 'Y:' },
        { key: 'width', label: 'Width:', min: 1 },
        { key: 'height', label: 'Height:', min: 1 },
        { key: 'fromPrevious', label: 'From Previous:' },
    ],
    circle: [
        { key: 'x', label: 'X:', min: 0 },
        { key: 'y', label: 'Y:' },
        { key: 'radius', label: 'Radius:', min: 1 },
        { key: 'fromPrevious', label: 'From Previous:' },
    ],
  };

  return (
    <>
      <ul className="space-y-2">
        {openings.map((opening, openingIdx) => {
          return (
            <li key={openingIdx} className="bg-zinc-800 rounded px-3 py-2 text-zinc-200 text-xs flex flex-col gap-1">
              <button
                className="flex items-center gap-2 w-full text-left focus:outline-none"
                onClick={() => toggleCollapse(openingIdx)}
                aria-expanded={!collapsed[openingIdx]}
              >
                <span className="inline-block w-4 text-blue-400">{collapsed[openingIdx] ? '+' : '-'}</span>
                <span className="font-bold mr-2 capitalize">{opening.type}</span>
                <span className="text-zinc-400">[{openingIdx}]</span>
              </button>
              {!collapsed[openingIdx] && (
                <div className="mt-2 space-y-1">
                  {openingInputs[opening.type].map(input => (
                  <NumberInput
                    key={input.key}
                    label={input.label}
                    value={opening[input.key as keyof typeof opening] as number}
                    onChange={val => setOpenings(prevOpenings =>
                      updateOpeningField(
                        prevOpenings,
                        prevOpenings[openingIdx].id,
                        input.key as keyof Opening,
                        val,
                        input.min
                      )
                    )}
                  />
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default OpeningsList;
