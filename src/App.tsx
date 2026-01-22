


import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';
import "./App.css";
import type { Opening } from './types';


const openings: Opening[] = [
  { type: 'rectangle', width: 80, height: 120, elevation: 10, distanceFromLast: 0 },
  { type: 'circle', radius: 40, elevation: 30, distanceFromLast: 100 },
];

const App = () => (
  <div className="flex h-screen w-screen bg-zinc-950 dark">
    <Sidebar openings={openings} />
    <MainPanel openings={openings} />
  </div>
);

export default App;
