import React from 'react';
import PlatformerCanvas from './components/PlatformerCanvas';
import InfoPanels from './components/InfoPanels';
import ScrollSyncManager from './components/ScrollSyncManager';

const App: React.FC = () => {
  return (
    <div className="w-screen min-h-screen overflow-y-auto">
      <ScrollSyncManager>
        <PlatformerCanvas />
        <InfoPanels />
      </ScrollSyncManager>
    </div>
  );
};

export default App;
