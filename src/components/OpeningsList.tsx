import { Opening } from "../types";
import { Dispatch, SetStateAction, useState } from "react";
import OpeningItem from "./OpeningItem";
import { Plus } from "lucide-react";
import { emitRequestNewOpening } from "../utils/socket";

interface OpeningsListProps {
  openings: Opening[];
  setOpenings: Dispatch<SetStateAction<Opening[]>>;
  hoveredOpeningId: number | null;
  wallId?: string;
}

const OpeningsList = ({ openings, setOpenings, hoveredOpeningId, wallId }: OpeningsListProps) => {
  const [collapsed, setCollapsed] = useState<boolean[]>(() => openings.map(() => false));

  const toggleCollapse = (idx: number) => {
    setCollapsed(prev => prev.map((c, i) => (i === idx ? !c : c)));
  };

  const handleAddOpening = () => {
    emitRequestNewOpening(wallId)
  };

  return (
    <>
      <div className="flex items-center mb-3">
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow transition"
          onClick={handleAddOpening}
          style={{ cursor: "pointer" }}
        >
          <Plus className="w-4 h-4" />
          Add Opening
        </button>
      </div>
      <div className="overflow-y-auto pr-1">
        <ul className="space-y-2">
        {openings.map((opening, openingIdx) => (
          <OpeningItem
            key={openingIdx}
            opening={opening}
            openingIdx={openingIdx}
            collapsed={collapsed[openingIdx]}
            toggleCollapse={toggleCollapse}
            setOpenings={setOpenings}
            onDelete={(idx: number) => {
              setOpenings(prev => prev.filter((_, i) => i !== idx));
              setCollapsed(prev => prev.filter((_, i) => i !== idx));
            }}
            isShapeHovered={hoveredOpeningId === opening.id}
            wallId={wallId}
          />
        ))}
        </ul>
      </div>
    </>
  );
};

export default OpeningsList;
