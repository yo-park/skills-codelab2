import React from 'react';
import { Play, Square, RotateCcw } from 'lucide-react';
import { useScanStore } from '../store/scanStore';

const Header: React.FC = () => {
  const { scanStatus, startScan, stopScan, resetScan, files } = useScanStore();
  
  const isRunning = scanStatus === 'running';

  return (
    <header>
      <div className="page-title">Search Logs</div>
      
      <div className="action-buttons">
        <button 
          className="primary" 
          onClick={startScan} 
          disabled={isRunning || files.length === 0}
        >
          <Play size={16} />
          Start
        </button>
        <button 
          className="danger" 
          onClick={stopScan} 
          disabled={!isRunning}
        >
          <Square size={16} />
          Stop
        </button>
        <button 
          className="secondary" 
          onClick={resetScan}
          disabled={isRunning}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </header>
  );
};

export default Header;
