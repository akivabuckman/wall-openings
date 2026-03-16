import { Dispatch, SetStateAction, useState } from "react";
import { Opening, SaveStatus } from "../types";
import OpeningsList from "./OpeningsList";
import { Share, Check } from "lucide-react";


interface SidebarProps {
  wallId: string;
  openings: Opening[];
  hoveredOpeningId: number | null;
  setOpenings: Dispatch<SetStateAction<Opening[]>>;
  saveStatus: SaveStatus;
  setSaveStatus: (status: SaveStatus) => void;
  redisAvailable: boolean;
}

const Sidebar = ({ wallId, openings, hoveredOpeningId, setOpenings, saveStatus, setSaveStatus, redisAvailable }: SidebarProps) => {
  const [copied, setCopied] = useState<boolean>(false);
  const handleCopyWallId = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 500);
  };

  return (
    <aside
      className="w-100 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-6 relative select-none"
    >
      {saveStatus !== 'error' && (
        <div className="mb-4 flex flex-col items-center">
          <div className="text-zinc-300 text-lg flex items-center gap-2"
              onClick={handleCopyWallId}
              style={{ cursor: "pointer" }}
          >
            Wall ID: <span className="font-bold">{wallId}</span>
            <button
              className="ml-2 p-1 rounded hover:bg-zinc-800 transition-colors"
              title={copied ? "Copied!" : "Copy wall link"}
              style={{ cursor: "pointer" }}
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share className="w-4 h-4 text-zinc-400" />}
            </button>
          </div>
          <p className="text-xs text-zinc-400 mt-1">All walls are automatically deleted 7 days after they're last updated</p>
        </div>
      )}
      <OpeningsList openings={openings} setOpenings={setOpenings} hoveredOpeningId={hoveredOpeningId} wallId={wallId} saveStatus={saveStatus} setSaveStatus={setSaveStatus} redisAvailable={redisAvailable} />
    </aside>
  );
};


export default Sidebar;
