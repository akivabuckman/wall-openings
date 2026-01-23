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
    x: 0,
    y: 0,
    color: defaultOpeningColor,
    id: 0
  }, {
    type: 'circle',
    radius: 80,
    x: 0,
    y: 0,
    color: defaultOpeningColor,
    id: 1
  },{
    type: 'rectangle',
    width: 100,
    height: 60,
    x: 0,
    y: 0,
    color: defaultOpeningColor,
    id: 2
  }]);
  const [openingIndexes, setOpeningIndexes] = useState<{ openingId: number, fromPrevious: number }[]>([]);

  useEffect(() => {
    const sorted =sortAndFromPrevious(openings);
    setOpeningIndexes(sorted);
  }, [openings]);

  return (
    <div className="flex h-screen bg-zinc-950 dark">
      <Sidebar openings={openings} setOpenings={setOpenings} openingIndexes={openingIndexes} setOpeningIndexes={setOpeningIndexes} />
      <MainPanel openings={openings} setOpenings={setOpenings} openingIndexes={openingIndexes} />
    </div>
  );
};

export default App;
