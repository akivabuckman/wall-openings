import { Opening, SaveStatus } from "../types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import OpeningItem from "./OpeningItem";
import { Plus, Undo2 } from "lucide-react";
import { emitRequestNewOpening, emitRequestUndo } from "../utils/socket";

interface OpeningsListProps {
  openings: Opening[];
  setOpenings: Dispatch<SetStateAction<Opening[]>>;
  hoveredOpeningId: number | null;
  wallId?: string;
  saveStatus: SaveStatus;
  setSaveStatus: (status: SaveStatus) => void;
  redisAvailable: boolean;
}

const OpeningsList = ({ openings, setOpenings, hoveredOpeningId, wallId, saveStatus, setSaveStatus, redisAvailable }: OpeningsListProps) => {
  const [collapsedIds, setCollapsedIds] = useState<Set<number>>(new Set());
  const seenIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const newIds = openings.filter(o => !seenIdsRef.current.has(o.id)).map(o => o.id);
    if (!newIds.length) return;
    const wasInitialLoad = seenIdsRef.current.size === 0;
    newIds.forEach(id => seenIdsRef.current.add(id));
    if (wasInitialLoad) {
      setCollapsedIds(prev => {
        const next = new Set(prev);
        newIds.forEach(id => next.add(id));
        return next;
      });
    }
    // If not initial load, new openings remain uncollapsed
  }, [openings]);

  const toggleCollapse = (id: number) => {
    setCollapsedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddOpening = () => {
    if (saveStatus === 'error') {
      setOpenings(prev => [...prev, {
        shape: 'RECTANGLE',
        width: 100,
        height: 200,
        x: 220,
        elevation: 0,
        color: '#ef4444',
        fromPrevious: 110,
        id: Date.now(),
        xIndex: prev.length,
      }]);
      return;
    }
    setSaveStatus('saving');
    emitRequestNewOpening(wallId);
  };

  return (
    <>
      <div className="flex items-center mb-3 gap-2">
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow transition"
          onClick={handleAddOpening}
          style={{ cursor: "pointer" }}
        >
          <Plus className="w-4 h-4" />
          Add Opening
        </button>
        {saveStatus !== 'error' && redisAvailable && (
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-semibold shadow border border-zinc-600 transition"
            onClick={() => emitRequestUndo(wallId ?? '')}
            title="Undo (Ctrl+Z)"
            style={{ cursor: "pointer" }}
          >
            <Undo2 className="w-3.5 h-3.5" />
            Undo
          </button>
        )}
        <span
          className={`px-3 py-1.5 rounded text-xs font-semibold shadow border ${
            saveStatus === 'saving'
              ? 'bg-zinc-700 border-zinc-600 text-zinc-300'
              : saveStatus === 'error'
              ? 'bg-red-900 border-red-700 text-red-300'
              : 'bg-zinc-800 border-zinc-700 text-zinc-400'
          }`}
        >
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'error' ? 'Error*' : 'Saved*'}
        </span>
        </div>
        <p className="text-xs text-zinc-400 mb-2">{
          saveStatus === 'error' ? '*Wall failed to load and save, but you can still edit it without saving' : '*All changes are immediately visible to all users viewing the wall'
        }</p>
        <div>
      </div>
      <div className="overflow-y-auto pr-1">
        <ul className="space-y-2">
        {openings.map((opening, openingIdx) => (
          <OpeningItem
            key={opening.id}
            opening={opening}
            openingIdx={openingIdx}
            collapsed={collapsedIds.has(opening.id)}
            toggleCollapse={() => toggleCollapse(opening.id)}
            setOpenings={setOpenings}
            onDelete={(idx: number) => {
              setOpenings(prev => prev.filter((_, i) => i !== idx));
              setCollapsedIds(prev => { const next = new Set(prev); next.delete(opening.id); return next; });
            }}
            isShapeHovered={hoveredOpeningId === opening.id}
            wallId={wallId}
            saveStatus={saveStatus}
            setSaveStatus={setSaveStatus}
          />
        ))}
        </ul>
      </div>
    </>
  );
};

export default OpeningsList;
