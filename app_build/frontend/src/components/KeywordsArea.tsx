import React from 'react';
import { Clock } from 'lucide-react';
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
    <section className="keywords-card">
      {/* Header row */}
      <div className="keywords-header">
        <h3 className="card-title">Target Signature Set</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label className="xs">Context Lines</label>
          <input
            className="context-input"
            type="number"
            min="0"
            max="20"
            value={contextLines}
            onChange={(e) => setContextLines(parseInt(e.target.value))}
            disabled={isRunning}
          />
        </div>
      </div>

      {/* Textarea */}
      <div className="keywords-textarea-wrap">
        <textarea
          className="keywords-textarea"
          placeholder={'CRITICAL ERROR\nNullPointerException\nHTTP 50[0-9]\nTimeout after [0-9]+ms'}
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          disabled={isRunning}
        />
        <span className="material-symbols-outlined keywords-terminal-icon">terminal</span>
      </div>

      <p className="keywords-hint">Enter one signature per line. Regex is supported in active mode.</p>

      {/* Time range */}
      <div className="time-range-row">
        <div className="form-group" style={{ flex: 1 }}>
          <label className="xs">
            <Clock size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            Time Range (Start)
          </label>
          <input
            type="text"
            placeholder="YYYY-MM-DD HH:MM:SS"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={isRunning}
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="xs">
            <Clock size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            Time Range (End)
          </label>
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
