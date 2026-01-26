
import { Opening } from "../types";
import { updateOpeningField } from "../utils/renderUtils";
import NumberInput from "./NumberInput";
import { Dispatch, SetStateAction, useState } from "react";
import ColorDropdown from "./ColorDropdown";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { ChevronDown, ChevronRight, Square, Circle as LucideCircle, Trash2 } from "lucide-react";

interface OpeningItemProps {
  opening: Opening;
  openingIdx: number;
  collapsed: boolean;
  toggleCollapse: (idx: number) => void;
  setOpenings: Dispatch<SetStateAction<Opening[]>>;
  onDelete: (idx: number) => void;
}

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

const OpeningItem = ({ opening, openingIdx, collapsed, toggleCollapse, setOpenings, onDelete }: OpeningItemProps) => {
  const [showModal, setShowModal] = useState(false);
  const typeIcon = opening.type === 'rectangle'
    ? <Square className="w-5 h-5" strokeWidth={2.2} style={{ color: opening.color }} />
    : <LucideCircle className="w-5 h-5" strokeWidth={2.2} style={{ color: opening.color }} />;

  const onColorChange = (color: string) => {
    setOpenings(prev => prev.map((o, i) => i === openingIdx ? { ...o, color } : o));
  };

  return (
    <li className="bg-zinc-800 rounded-lg px-4 py-3 text-zinc-100 text-sm flex flex-col gap-2 shadow border border-zinc-700 hover:border-blue-400 transition-all">
      <div className="flex items-center gap-3 w-full">
        <button
          className="flex items-center gap-3 flex-1 text-left focus:outline-none group"
          onClick={() => toggleCollapse(openingIdx)}
          aria-expanded={!collapsed}
          tabIndex={0}
        >
          <span className="flex items-center justify-center w-6 h-6">
            {collapsed
              ? <ChevronRight className="text-zinc-400 group-hover:text-blue-400 transition w-5 h-5" strokeWidth={2.2} />
              : <ChevronDown className="text-zinc-400 group-hover:text-blue-400 transition w-5 h-5" strokeWidth={2.2} />}
          </span>
          <span className="flex items-center gap-2 font-semibold">
            {typeIcon}
            <span className="capitalize tracking-wide">{opening.type}</span>
          </span>
          <span className="ml-auto text-xs text-zinc-400 font-mono">#{openingIdx}</span>
        </button>
        <button
          className="ml-2 p-1 rounded hover:bg-red-600 transition"
          title="Delete opening"
          onClick={() => setShowModal(true)}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
            <ConfirmDeleteModal
              open={showModal}
              onConfirm={() => { setShowModal(false); onDelete && onDelete(openingIdx); }}
              onCancel={() => setShowModal(false)}
            />
      </div>
      {!collapsed && (
        <div className="mt-1 flex flex-col gap-2">
          <ColorDropdown
            value={opening.color}
            onChange={onColorChange}
          />
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
};

export default OpeningItem;
