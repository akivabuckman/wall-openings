import "./App.css";
import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';
import { Opening } from './types';
import { useState } from 'react';
import { defaultOpenings } from './constants';



const App = () => {
  const [openings, setOpenings] = useState<Opening[]>(defaultOpenings);

  return (
    <div className="flex h-screen bg-zinc-950 dark">
      <Sidebar openings={openings} setOpenings={setOpenings}  />
      <MainPanel openings={openings} setOpenings={setOpenings}  />
    </div>
  );
};

export default App;
