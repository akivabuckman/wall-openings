import "./App.css";
import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';
import { Opening } from './types';
import { useState } from 'react';
import { defaultOpenings } from './constants';



const App = () => {
  const [openings, setOpenings] = useState<Opening[]>(defaultOpenings);
  const [hoveredOpeningId, setHoveredOpeningId] = useState<number | null>(null);

  return (
    <div className="flex h-screen bg-zinc-950 dark">
      <Sidebar openings={openings} setOpenings={setOpenings} hoveredOpeningId={hoveredOpeningId} />
      <MainPanel openings={openings} setOpenings={setOpenings} hoveredOpeningId={hoveredOpeningId} setHoveredOpeningId={setHoveredOpeningId} />
    </div>
  );
};

export default App;
