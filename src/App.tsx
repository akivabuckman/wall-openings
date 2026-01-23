import "./App.css";
import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';
import { Opening } from './types';
import { useState, useEffect } from 'react';
import { defaultOpeningColor } from './constants';



const App = () => {
  const [openings, setOpenings] = useState<Opening[]>([{
    type: 'rectangle',
    width: 100,
    height: 60,
    distanceFromLast: 0,
    x: 0,
    y: 0,
    color: defaultOpeningColor,
    id: 0
  }, {
    type: 'circle',
    radius: 80,
    distanceFromLast: 20,
    x: 0,
    y: 0,
    color: defaultOpeningColor,
    id: 1
  }]);
  const [openingIndexes, setOpeningIndexes] = useState<{ openingId: number }[]>([]);

  useEffect(() => {
    const sorted = openings
      .map((o, i) => ({ openingId: o.id ?? i, x: o.x }))
      .sort((a, b) => {
        if (a.x !== b.x) return a.x - b.x;
        return a.openingId - b.openingId;
      })
      .map(({ openingId }) => ({ openingId }));
    if (
      openingIndexes.length !== sorted.length ||
      openingIndexes.some((item, idx) => item.openingId !== sorted[idx].openingId)
    ) {
      setOpeningIndexes(sorted);
    }
  }, [openings]);

  useEffect(() => {
    console.log(openingIndexes)
  }, [openingIndexes]);
  return (
    <div className="flex h-screen bg-zinc-950 dark">
      <Sidebar openings={openings} setOpenings={setOpenings} />
      <MainPanel openings={openings} setOpenings={setOpenings} />
    </div>
  );
};

export default App;
