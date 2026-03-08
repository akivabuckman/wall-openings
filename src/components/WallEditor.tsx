import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import MainPanel from './MainPanel';
import { Opening } from '../types';
import { defaultOpenings, shapeMoveDebounceMs } from '../constants';
import { initializeSocket } from '../utils/socketManager';
import { emitOpeningChange } from '../utils/socket';
import { updateWallIdInUrl, getWallIdFromUrl, isValidWallId, getChangedOpening } from '../utils/utils';

const WallEditor = () => {
  const [openings, setOpenings] = useState<Opening[]>(defaultOpenings);
  const [lastChangedOpening, setLastChangedOpening] = useState<Opening | null>(null);
  const [hoveredOpeningId, setHoveredOpeningId] = useState<number | null>(null);
  const [openingsLoading, setOpeningsLoading] = useState<boolean>(false);
  const [wallId, setWallIdState] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved'>('saved');
  const isInitialized = useRef<boolean>(false);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update wallId in both state and URL
  const setWallId = (id: string) => {
    setWallIdState(id);
    updateWallIdInUrl(id);
  };

  // Detect which opening was changed and set lastChangedOpening
  const prevOpeningsRef = useRef<Opening[]>(openings);
  useEffect(() => {
    const prevOpenings = prevOpeningsRef.current;
    const changed = getChangedOpening(prevOpenings, openings);
    if (changed) setLastChangedOpening(changed);
    prevOpeningsRef.current = openings;
  }, [openings]);

  // Initialize socket connection on mount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const wallIdParam = getWallIdFromUrl();
    const wallIdValid = isValidWallId(wallIdParam);
    
    if (wallIdValid) {
      setWallId(wallIdParam!);
    }

    initializeSocket({
      setOpenings,
      setWallId,
      setSaveStatus,
    }, wallIdValid ? wallIdParam : null);
  }, []);

  // Debounce and emit only the last changed opening
  useEffect(() => {
    if (!lastChangedOpening) return;
    setSaveStatus('saving');
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      emitOpeningChange(lastChangedOpening, wallId);
    }, shapeMoveDebounceMs);
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [lastChangedOpening]);



  return (
    <div className="flex h-screen bg-zinc-950 dark">
      <Sidebar 
        wallId={wallId} 
        openings={openings} 
        hoveredOpeningId={hoveredOpeningId} 
        setOpenings={setOpenings}
        saveStatus={saveStatus}
        setSaveStatus={setSaveStatus}
      />
      <MainPanel 
        openings={openings} 
        hoveredOpeningId={hoveredOpeningId} 
        setHoveredOpeningId={setHoveredOpeningId} 
        setOpenings={setOpenings} 
      />
      <footer className="fixed bottom-0 left-0 right-0 text-center text-zinc-200 text-xs py-2 px-4 bg-gradient-to-r from-blue-900 via-orange-900 to-blue-900 border-t border-zinc-600 select-none pointer-events-none tracking-wide">
        ✨ Everything here was made by yours truly — 🖥️ frontend, ⚙️ backend, 🔌 websocket, 🚀 CI, and ☁️ AWS. ✨
      </footer>
    </div>
  );
};

export default WallEditor;
