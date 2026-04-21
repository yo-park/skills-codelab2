import React from 'react';
import { Search, AlignLeft, Clock } from 'lucide-react';
import { useScanStore } from '../store/scanStore';

const KeywordsArea: React.FC = () => {
  const { 
    keywords, setKeywords, 
    contextLines, setContextLines, 
    startTime, setStartTime,
    endTime, setEndTime,
    scanStatus 
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
    </section>
  );
};

export default KeywordsArea;
