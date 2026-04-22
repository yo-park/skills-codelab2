import React from 'react';
import { useScanStore } from '../store/scanStore';

const Header: React.FC = () => {
  const { startScan, stopScan, resetScan, scanStatus, files } = useScanStore();
  const isRunning = scanStatus === 'running';

  return (
    <header>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <h2 className="page-title">Log Scanner</h2>
        <div className="header-divider" />
        <span className="header-session">session_ forensic_id: 8849-X</span>
      </div>

      <div className="action-buttons">
        <button
          className="primary"
          onClick={startScan}
          disabled={isRunning || files.length === 0}
          id="btn-start-scan"
        >
          <span
            className="material-symbols-outlined filled"
            style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}
          >
            play_arrow
          </span>
          Start Scan
        </button>

        <button
          className="secondary"
          onClick={stopScan}
          disabled={!isRunning}
          id="btn-stop-scan"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>stop</span>
          Stop Scan
        </button>

        <button
          className="secondary"
          onClick={resetScan}
          disabled={isRunning}
          id="btn-reset-scan"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>refresh</span>
          Reset Results
        </button>
      </div>
    </header>
  );
};

export default Header;
