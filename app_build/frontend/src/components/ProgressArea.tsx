import React from 'react';
import { Activity } from 'lucide-react';
import { useScanStore } from '../store/scanStore';

const ProgressArea: React.FC = () => {
  const { fileProgress } = useScanStore();
  
  const progressItems = Array.from(fileProgress.entries());

  if (progressItems.length === 0) return null;

  return (
    <section className="card">
      <div className="card-title">
        <Activity size={18} />
        Progress Area
      </div>

      <div className="progress-list">
        {progressItems.map(([index, progress]) => {
          const percent = progress.totalBytes > 0 
            ? Math.round((progress.bytesRead / progress.totalBytes) * 100) 
            : 0;

          return (
            <div key={index} className="progress-item">
              <div className="progress-meta">
                <span style={{ fontWeight: 600 }}>{progress.fileName}</span>
                <span>{percent}% • {progress.linesScanned.toLocaleString()} lines • {progress.matchesFound.toLocaleString()} matches</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${percent}%`,
                    backgroundColor: progress.status === 'done' ? 'var(--success)' : 'var(--accent)'
                  }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProgressArea;
