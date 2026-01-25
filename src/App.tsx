import "./App.css";
import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';
import { Opening } from './types';
import { useState, useEffect } from 'react';
import { defaultOpeningColor } from './constants';
import { sortAndFromPrevious } from "./utils/utils";



const App = () => {
  const [openings, setOpenings] = useState<Opening[]>([{
    type: 'rectangle',
    width: 100,
    height: 60,
    x: 115,
    y: 100,
    color: defaultOpeningColor,
    id: 0,
    fromPrevious: 5,
    xIndex: 0
  }, {
    type: 'circle',
    radius: 80,
    x: 110,
    y: 0,
    color: defaultOpeningColor,
    id: 1,
    fromPrevious: 0,
    xIndex: 0
  },{
    type: 'rectangle',
    width: 100,
    height: 60,
    x: 1110,
    y: 0,
    color: defaultOpeningColor,
    id: 2,
    fromPrevious: 0,
    xIndex: 0
  }]);

  return (
    <div className="flex h-screen bg-zinc-950 dark">
      <Sidebar openings={openings} setOpenings={setOpenings}  />
      <MainPanel openings={openings} setOpenings={setOpenings}  />
    </div>
  );
};

export default App;
