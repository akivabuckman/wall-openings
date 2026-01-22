


import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';
import "./App.css";
import { Opening } from './types';
import { useState } from 'react';
import { defaultOpeningColor } from './constants';



const App = () => {
  const [openings, setOpenings] = useState<Opening[]>([{
    type: 'rectangle',
    width: 100,
    height: 60,
    distanceFromLast: 0,
    x: 0,
    y: 0,
    color: defaultOpeningColor
  }, {
    type: 'circle',
    radius: 80,
    distanceFromLast: 20,
    x: 100,
    y: 600,
    color: defaultOpeningColor
  }]);
  return (
    <div className="flex h-screen w-screen bg-zinc-950 dark">
      <Sidebar openings={openings} setOpenings={setOpenings} />
      <MainPanel openings={openings} />
    </div>
  );
};

export default App;
