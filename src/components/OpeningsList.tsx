import { Opening } from "../types";
import { Dispatch, SetStateAction, useState } from "react";
import NumberInput from "./NumberInput";

interface OpeningsListProps {
  openings: Opening[];
  setOpenings: Dispatch<SetStateAction<Opening[]>>;
  openingIndexes: { openingId: number, fromPrevious: number }[];
  setOpeningIndexes: Dispatch<SetStateAction<{ openingId: number, fromPrevious: number }[]>>;
}

const OpeningsList = ({ openings, setOpenings, openingIndexes, setOpeningIndexes }: OpeningsListProps) => {
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
    ],
    circle: [
        { key: 'x', label: 'x:', min: 0 },
        { key: 'y', label: 'y:' },
        { key: 'radius', label: 'radius:', min: 1 },
    ],
  };

  return (
    <>
      <ul className="space-y-2">
        {openings.map((opening, openingIdx) => {
          const openingIndex = openingIndexes.find(indexObj => indexObj.openingId === opening.id);
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
                      onChange={val => setOpenings(prevOpenings => prevOpenings.map((openingObj, i) =>
                        i === openingIdx
                          ? { ...openingObj, [input.key]: isNaN(val) ? 0 : (input.min !== undefined ? Math.max(val, input.min) : val) }
                          : openingObj
                      ))}
                    />
                  ))}
                  {openingIndex && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-zinc-400">fromPrevious:</span>
                      <NumberInput
                        label=""
                        value={openingIndex.fromPrevious}
                        onChange={val => setOpeningIndexes(prevIndexes => prevIndexes.map((indexObj) =>
                          indexObj.openingId === openingIndex.openingId ? { ...indexObj, fromPrevious: isNaN(val) ? 0 : val } : indexObj
                        ))}
                      />
                    </div>
                  )}
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
