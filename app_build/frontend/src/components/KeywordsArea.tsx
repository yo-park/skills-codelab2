import React from 'react';
import { Search, AlignLeft } from 'lucide-react';
import { useScanStore } from '../store/scanStore';

const KeywordsArea: React.FC = () => {
  const { keywords, setKeywords, contextLines, setContextLines, scanStatus } = useScanStore();
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

      <div className="form-group" style={{ marginTop: '16px', width: 'fit-content' }}>
        <label><AlignLeft size={14} style={{ marginRight: 4 }} /> Context lines</label>
        <input 
          type="number" 
          min="0" max="20"
          value={contextLines}
          onChange={(e) => setContextLines(parseInt(e.target.value))}
          disabled={isRunning}
        />
      </div>
    </section>
  );
};

export default KeywordsArea;
