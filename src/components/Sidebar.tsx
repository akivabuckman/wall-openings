import { Dispatch, SetStateAction, useState } from "react";
import { Opening } from "../types";
import OpeningsList from "./OpeningsList";
import { Copy, Check } from "lucide-react";


interface SidebarProps {
  wallId: string;
  openings: Opening[];
  hoveredOpeningId: number | null;
  updateOpening: (opening: Opening) => void;
}

const Sidebar = ({ wallId, openings, hoveredOpeningId, updateOpening }: SidebarProps) => {
  const [copied, setCopied] = useState<boolean>(false);
  const handleCopyWallId = () => {
    navigator.clipboard.writeText(wallId);
    setCopied(true);
    setTimeout(() => setCopied(false), 500);
  };

  return (
    <aside
      className="w-100 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-6 relative select-none"
    >
      <div className="mb-4 text-zinc-300 text-lg flex items-center gap-2"
          onClick={handleCopyWallId}
          style={{ cursor: "pointer" }}
      >
        Wall ID: <span className="font-bold">{wallId}</span>
        <button
          className="ml-2 p-1 rounded hover:bg-zinc-800 transition-colors"
          title={copied ? "Copied!" : "Copy Wall ID"}
          style={{ cursor: "pointer" }}
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
        </button>
      </div>
      <OpeningsList openings={openings} updateOpening={updateOpening} hoveredOpeningId={hoveredOpeningId} />
    </aside>
  );
};


export default Sidebar;
