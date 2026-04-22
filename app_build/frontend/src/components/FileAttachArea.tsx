import React, { useRef } from 'react';
import { useScanStore } from '../store/scanStore';

const FileAttachArea: React.FC = () => {
  const {
    files, setFiles,
    concurrency, setConcurrency,
    maxMatchesPerFile, setMaxMatchesPerFile,
    caseSensitive, setCaseSensitive,
    patternMode, setPatternMode,
    scanStatus
  } = useScanStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isRunning = scanStatus === 'running';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    if (isRunning) return;
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
  };

  return (
    <section className="card">
      <h3 className="card-title">Ingestion Cluster</h3>

      {/* File Drop Zone */}
      <div>
        <label
          className={`file-drop-zone ${isRunning ? 'disabled' : ''}`}
          onClick={() => !isRunning && fileInputRef.current?.click()}
          style={{ cursor: isRunning ? 'not-allowed' : 'pointer' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 32 }}>
              upload_file
            </span>
            <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
              {files.length > 0
                ? `${files.length} file(s) selected`
                : 'Drop multiple large .log or .txt files'}
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={isRunning}
          />
        </label>

        {files.length > 0 && (
          <div className="file-tags" style={{ marginTop: 12 }}>
            {files.map((f, i) => (
              <span key={i} className="file-tag">
                {f.name}
                <button
                  className="file-tag-remove"
                  onClick={() => removeFile(i)}
                  disabled={isRunning}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>close</span>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="settings-group">
        {/* Concurrency slider */}
        <div>
          <div className="settings-row" style={{ marginBottom: 8 }}>
            <label>Concurrent Scans</label>
            <span className="badge">{concurrency} / 8</span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            value={concurrency}
            onChange={(e) => setConcurrency(parseInt(e.target.value))}
            disabled={isRunning}
          />
        </div>

        {/* Max matches + Pattern mode */}
        <div className="form-grid-2">
          <div className="form-group">
            <label className="xs">Max Matches</label>
            <input
              type="number"
              min="0"
              value={maxMatchesPerFile}
              onChange={(e) => setMaxMatchesPerFile(parseInt(e.target.value))}
              disabled={isRunning}
            />
          </div>
          <div className="form-group">
            <label className="xs">Pattern Mode</label>
            <select
              value={patternMode}
              onChange={(e) => setPatternMode(e.target.value as any)}
              disabled={isRunning}
            >
              <option value="regex">RegEx (PCRE)</option>
              <option value="literal">Literal String</option>
            </select>
          </div>
        </div>

        {/* Case sensitive toggle */}
        <div className="toggle-row">
          <span style={{ fontSize: '0.875rem', color: 'var(--on-surface)' }}>Case-Sensitive Scan</span>
          <button
            className={`toggle-btn ${caseSensitive ? 'on' : ''}`}
            onClick={() => !isRunning && setCaseSensitive(!caseSensitive)}
            disabled={isRunning}
            type="button"
          >
            <span className={`toggle-knob ${caseSensitive ? 'on' : 'off'}`} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FileAttachArea;
