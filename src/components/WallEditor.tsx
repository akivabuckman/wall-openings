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
    }, wallIdValid ? wallIdParam : null);
  }, []);

  // Debounce and emit only the last changed opening
  useEffect(() => {
    if (!lastChangedOpening) return;
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
      />
      <MainPanel 
        openings={openings} 
        hoveredOpeningId={hoveredOpeningId} 
        setHoveredOpeningId={setHoveredOpeningId} 
        setOpenings={setOpenings} 
      />
    </div>
  );
};

export default WallEditor;
