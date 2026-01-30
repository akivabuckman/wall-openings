import { initializeSocketManager } from './utils/socketManager';
import "./App.css";
import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';
import { Opening } from './types';
import { useState, useEffect, useRef } from 'react';
import { defaultOpenings, shapeMoveDebounceMs } from './constants';
import getSocket from './utils/socket';
import { generateWallId } from './utils/utils';

const App = () => {
  const [openings, setOpenings] = useState<Opening[]>(defaultOpenings);
  const [hoveredOpeningId, setHoveredOpeningId] = useState<number | null>(null);
  const [showMobileModal, setShowMobileModal] = useState<boolean>(false);
  const [wallId, setWallId] = useState<string>("");
  const socketRef = useRef<ReturnType<typeof initializeSocketManager> | null>(null);

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
    if (!socketRef.current) {
      socketRef.current = initializeSocketManager(setOpenings);
    }
    const socket = socketRef.current;
    const id = new URLSearchParams(window.location.search).get('wallId') || generateWallId();
    const params = new URLSearchParams(window.location.search);
    params.set('wallId', id);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
    setWallId(id);
    socket.on('connect', () => {
      socket.emit('wall:join', id);
    });
    return () => {
      socket.off('connect');
    };
  }, []);

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      socket.emit('openingChange', openings);
    }, shapeMoveDebounceMs);
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [openings]);

  return (
    <>
      {/* {showMobileModal && <MobileModal onClose={handleCloseMobileModal} />} */}
      <div className="flex h-screen bg-zinc-950 dark">
        <Sidebar wallId={wallId} openings={openings} setOpenings={setOpenings} hoveredOpeningId={hoveredOpeningId} />
        <MainPanel openings={openings} setOpenings={setOpenings} hoveredOpeningId={hoveredOpeningId} setHoveredOpeningId={setHoveredOpeningId} />
      </div>
    </>
  );
};

export default App;
