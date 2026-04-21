import React from 'react';
import { Search, AlignLeft, Clock, Play, Square, RotateCcw } from 'lucide-react';
import { useScanStore } from '../store/scanStore';

const KeywordsArea: React.FC = () => {
  const { 
    keywords, setKeywords, 
    contextLines, setContextLines, 
    startTime, setStartTime,
    endTime, setEndTime,
    scanStatus, startScan, stopScan, resetScan, files
  } = useScanStore();
  const isRunning = scanStatus === 'running';

  return (
    <section className="card">
      <div className="card-title">
        <Search size={18} />
        Keywords Area
      </div>

      <div className="form-group">
        <label>Enter keywords or patterns (one per line)</label>
        <textarea 
          placeholder="e.g. ERROR\nNullPointerException\n\[(DEBUG|INFO)\]"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          disabled={isRunning}
        />
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
        <div className="form-group" style={{ width: 'fit-content' }}>
          <label><AlignLeft size={14} style={{ marginRight: 4 }} /> Context lines</label>
          <input 
            type="number" 
            min="0" max="20"
            value={contextLines}
            onChange={(e) => setContextLines(parseInt(e.target.value))}
            disabled={isRunning}
          />
        </div>

        <div className="form-group">
          <label><Clock size={14} style={{ marginRight: 4 }} /> Time Range (Start)</label>
          <input 
            type="text" 
            placeholder="YYYY-MM-DD HH:MM:SS"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={isRunning}
          />
        </div>

        <div className="form-group">
          <label><Clock size={14} style={{ marginRight: 4 }} /> Time Range (End)</label>
          <input 
            type="text" 
            placeholder="YYYY-MM-DD HH:MM:SS"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={isRunning}
          />
        </div>
      </div>
      <div className="action-buttons" style={{ marginTop: '24px', justifyContent: 'flex-start' }}>
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
    </section>
  );
};

export default KeywordsArea;
