import React from 'react';
import { useScanStore } from '../store/scanStore';

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ProgressArea: React.FC = () => {
  const { fileProgress } = useScanStore();

  const progressItems = Array.from(fileProgress.entries());

  if (progressItems.length === 0) return null;

  return (
    <section className="progress-section">
      <h3 className="card-title">Active Pipelines</h3>

      <div className="progress-grid">
        {progressItems.map(([index, progress]) => {
          const percent = progress.totalBytes > 0
            ? Math.round((progress.bytesRead / progress.totalBytes) * 100)
            : 0;
          const isDone = progress.status === 'done';

          return (
            <div key={index} className={`progress-card ${isDone ? 'done' : ''}`}>
              <div className="progress-card-header">
                <div style={{ overflow: 'hidden' }}>
                  <p className="progress-filename">{progress.fileName}</p>
                  <p className={`progress-phase ${isDone ? 'done' : ''}`}>
                    {isDone ? 'Status: Completed' : 'Phase: Byte Ingestion'}
                  </p>
                </div>
                {isDone ? (
                  <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)', fontSize: 18 }}>
                    check_circle
                  </span>
                ) : (
                  <span className="progress-pct">{percent}%</span>
                )}
              </div>

              <div className="progress-bar-bg">
                <div
                  className={`progress-bar-fill ${isDone ? 'done' : ''}`}
                  style={{ width: `${isDone ? 100 : percent}%` }}
                />
              </div>

              <div className="progress-stats">
                <div>
                  <p className="progress-stat-label">Read</p>
                  <p className="progress-stat-value">{formatBytes(progress.bytesRead)}</p>
                </div>
                <div>
                  <p className="progress-stat-label">Lines</p>
                  <p className="progress-stat-value">{progress.linesScanned.toLocaleString()}</p>
                </div>
                <div>
                  <p className="progress-stat-label">Matches</p>
                  <p className="progress-stat-value match">{progress.matchesFound.toLocaleString()}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Placeholder slot */}
        <div className="progress-placeholder">
          <p className="progress-placeholder-text">Waiting for input...</p>
        </div>
      </div>
    </section>
  );
};

export default ProgressArea;
