import { initializeSocket } from './utils/socketManager';
import "./App.css";
import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';
import { Opening } from './types';
import { useState, useEffect, useRef } from 'react';
import { defaultOpenings, shapeMoveDebounceMs } from './constants';
import { emitOpeningChange } from './utils/socket';

const App = () => {
  const [openings, setOpenings] = useState<Opening[]>(defaultOpenings);
  const [lastChangedOpening, setLastChangedOpening] = useState<Opening | null>(null);
    // Use this function to update an opening and track the last changed opening
    const updateOpening = (updatedOpening: Opening) => {
      setOpenings(prev => prev.map(o => o.id === updatedOpening.id ? updatedOpening : o));
      setLastChangedOpening(updatedOpening);
    };
  const [hoveredOpeningId, setHoveredOpeningId] = useState<number | null>(null);
  const [showMobileModal, setShowMobileModal] = useState<boolean>(false);
  const [wallId, setWallIdState] = useState<string>("");
  const isInitialized = useRef<boolean>(false);

  // Wrapper to update both state and URL
  const setWallId = (id: string) => {
    setWallIdState(id);
    const params = new URLSearchParams(window.location.search);
    params.set('wallId', id);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  };

  const handleCloseMobileModal = () => {
    setShowMobileModal(false);
    window.sessionStorage.setItem('mobileModalDismissed', '1');
  };

  useEffect(() => {
    if (window.sessionStorage.getItem('mobileModalDismissed')) return;
    const checkMobile = () => {
      setShowMobileModal(window.innerWidth <= 1000);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Initialize socket only once
    if (isInitialized.current) return;
    isInitialized.current = true;

    const params = new URLSearchParams(window.location.search);
    const wallIdParam = params.get('wallId') || null;
    const wallIdIsValid = wallIdParam && !["null", ""].includes(wallIdParam);
    
    if (wallIdIsValid) {
      setWallId(wallIdParam);
    }

    // Initialize socket with callbacks
    initializeSocket({
      setOpenings,
      setWallId,
    }, wallIdIsValid ? wallIdParam : null);
  }, []);

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!lastChangedOpening) return;
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      emitOpeningChange(lastChangedOpening);
    }, shapeMoveDebounceMs);
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [lastChangedOpening]);

  return (
    <>
      {/* {showMobileModal && <MobileModal onClose={handleCloseMobileModal} />} */}
      <div className="flex h-screen bg-zinc-950 dark">
        <Sidebar wallId={wallId} openings={openings} hoveredOpeningId={hoveredOpeningId} setOpenings={setOpenings} />
        <MainPanel openings={openings} hoveredOpeningId={hoveredOpeningId} setHoveredOpeningId={setHoveredOpeningId} setOpenings={setOpenings} />
      </div>
    </>
  );
};

export default App;
