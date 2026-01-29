import "./App.css";
import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';
import { Opening } from './types';
import { useState, useEffect } from 'react';
// import MobileModal from './components/MobileModal';
import { defaultOpenings } from './constants';
import getSocket from './utils/socket';



const App = () => {

  const [openings, setOpenings] = useState<Opening[]>(defaultOpenings);
  const [hoveredOpeningId, setHoveredOpeningId] = useState<number | null>(null);
  const [showMobileModal, setShowMobileModal] = useState<boolean>(false);

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
    const socket = getSocket();
    socket.on('connect', () => {
      console.log(socket)
    });
    return () => {
      socket.off('connect');
    };
  }, []);

  return (
    <>
      {/* {showMobileModal && <MobileModal onClose={handleCloseMobileModal} />} */}
      <div className="flex h-screen bg-zinc-950 dark">
        <Sidebar openings={openings} setOpenings={setOpenings} hoveredOpeningId={hoveredOpeningId} />
        <MainPanel openings={openings} setOpenings={setOpenings} hoveredOpeningId={hoveredOpeningId} setHoveredOpeningId={setHoveredOpeningId} />
      </div>
    </>
  );
};

export default App;
