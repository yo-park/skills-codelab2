import React from 'react';
import { Settings } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="page-container" style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Settings size={64} style={{ marginBottom: 16, opacity: 0.2 }} />
        <h2>Settings</h2>
        <p>Not Implemented</p>
      </div>
    </div>
  );
};

export default SettingsPage;
