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
  isShapeHovered?: boolean;
}

const openingInputs = {
  RECTANGLE: [
    { key: 'x', label: 'X:', min: 0 },
    { key: 'y', label: 'Y:' },
    { key: 'width', label: 'Width:', min: 1 },
    { key: 'height', label: 'Height:', min: 1 },
    { key: 'fromPrevious', label: 'From Previous:' },
  ],
  CIRCLE: [
    { key: 'x', label: 'X:', min: 0 },
    { key: 'y', label: 'Y:' },
    { key: 'radius', label: 'Radius:', min: 1 },
    { key: 'fromPrevious', label: 'From Previous:' },
  ],
};

const OpeningItem = ({ opening, openingIdx, collapsed, toggleCollapse, setOpenings, onDelete, isShapeHovered }: OpeningItemProps) => {
  const [showModal, setShowModal] = useState(false);
  const typeIcon = opening.shape === 'RECTANGLE'
    ? <Square className="w-5 h-5" strokeWidth={2.2} style={{ color: opening.color }} />
    : <LucideCircle className="w-5 h-5" strokeWidth={2.2} style={{ color: opening.color }} />;

  const onColorChange = (color: string) => {
    setOpenings(prev => prev.map((o, i) => i === openingIdx ? { ...o, color } : o));
  };

  const generateBorderColorClass = (color: string, shapeHover: boolean) => {
    return shapeHover ? `border-${color}-400` : `border-zinc-700 hover:border-${color}-400`;
  };

  const handleShapeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as "RECTANGLE" | "CIRCLE";
    setOpenings(prev =>
      prev.map((o, i) => {
        if (i !== openingIdx) return o;
        const { x, elevation, color, id, fromPrevious, xIndex } = o;
        if (newType === "RECTANGLE") {
          return {
            shape: "RECTANGLE",
            x, elevation, color, id, fromPrevious, xIndex,
            width: "width" in o ? o.width : 50,
            height: "height" in o ? o.height : 50,
          };
        } else {
          return {
            shape: "CIRCLE",
            x, elevation, color, id, fromPrevious, xIndex,
            radius: "radius" in o ? o.radius : 25,
          };
        }
      })
    );
  };

  return (
    <li className={
      `w-80 bg-zinc-800 rounded-lg px-4 py-3 text-zinc-100 text-sm flex flex-col gap-2 shadow border border-2 transition-all ${(generateBorderColorClass(opening.color, !!isShapeHovered))}`    }>
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
            <span className="capitalize tracking-wide">{opening.shape.toLowerCase()}</span>
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
            <div className="flex items-center gap-2 px-8 mb-2">
              <label htmlFor={`shape-select-${openingIdx}`} className="text-left text-zinc-400 w-36">Shape:</label>
              <select
                id={`shape-select-${openingIdx}`}
                className="w-36 h-8 rounded-md border border-zinc-600 bg-zinc-900 px-2 py-1 text-base text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 shadow-sm"
                value={opening.shape}
                onChange={handleShapeChange}
              >
                <option value="RECTANGLE">Rectangle</option>
                <option value="CIRCLE">Circle</option>
              </select>
            </div>
          {openingInputs[opening.shape].map(input => (
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
