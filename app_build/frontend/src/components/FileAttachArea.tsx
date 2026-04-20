import React, { useRef } from 'react';
import { FileUp, Cpu, Hash, Type, Regex } from 'lucide-react';
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

  return (
    <section className="card">
      <div className="card-title">
        <FileUp size={18} />
        File Attach Area
      </div>

      <div 
        className="file-input-container"
        onClick={() => !isRunning && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          multiple 
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={isRunning}
        />
        {files.length > 0 ? (
          <div style={{ color: 'var(--accent)', fontWeight: 600 }}>
            {files.length} files selected
          </div>
        ) : (
          <div style={{ color: 'var(--text-secondary)' }}>
            Click to select or drag and drop log files
          </div>
        )}
      </div>

      <div className="form-row" style={{ marginTop: '20px' }}>
        <div className="form-group">
          <label><Cpu size={14} style={{ marginRight: 4 }} /> Concurrency</label>
          <input 
            type="number" 
            min="1" max="8" 
            value={concurrency}
            onChange={(e) => setConcurrency(parseInt(e.target.value))}
            disabled={isRunning}
          />
        </div>

        <div className="form-group">
          <label><Hash size={14} style={{ marginRight: 4 }} /> Max matches / file</label>
          <input 
            type="number" 
            min="0"
            value={maxMatchesPerFile}
            onChange={(e) => setMaxMatchesPerFile(parseInt(e.target.value))}
            disabled={isRunning}
          />
        </div>

        <div className="form-group">
          <label>Case sensitivity</label>
          <div className="toggle-group" onClick={() => !isRunning && setCaseSensitive(!caseSensitive)}>
            <input 
              type="checkbox" 
              checked={caseSensitive}
              readOnly
              disabled={isRunning}
            />
            <span style={{ fontSize: '0.875rem' }}>{caseSensitive ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>

        <div className="form-group">
          <label>Pattern Mode</label>
          <select 
            value={patternMode} 
            onChange={(e) => setPatternMode(e.target.value as any)}
            disabled={isRunning}
          >
            <option value="literal">Literal</option>
            <option value="regex">Regex</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default FileAttachArea;
