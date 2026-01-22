import CrossSectionView from "./CrossSectionView";
import AerialView from "./AerialView";

const MainPanel = () => (
  <main className="flex flex-col flex-1 h-full">
    <div className="flex-3 flex flex-col min-h-0" style={{flex: 3}}>
      <CrossSectionView />
    </div>
    <div className="flex-1 min-h-0">
      <AerialView />
    </div>
  </main>
);

export default MainPanel;
