


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
    x: 50,
    y: 50,
    color: defaultOpeningColor
  }, {
    type: 'circle',
    radius: 80,
    distanceFromLast: 20,
    x: 200,
    y: 100,
    color: defaultOpeningColor
  }]);
  return (
    <div className="flex h-screen w-screen bg-zinc-950 dark">
      <Sidebar openings={openings} />
      <MainPanel openings={openings} />
    </div>
  );
};

export default App;
