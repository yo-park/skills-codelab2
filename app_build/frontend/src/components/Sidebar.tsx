import React from 'react';

interface SidebarProps {
  activeTab: 'search' | 'settings';
  onTabChange: (tab: 'search' | 'settings') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <aside className="sidebar">
      <div className="logo-container">
        <h1 className="logo-text">LogAnalyzer</h1>
        <p className="logo-sub">
          Forensic Lab{' '}
          <span style={{ opacity: 0.5 }}>Terminal v2.4</span>
        </p>
      </div>

      <nav>
        <ul className="nav-list">
          <li
            className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => onTabChange('search')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
            <span>Search Logs</span>
          </li>
          <li
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => onTabChange('settings')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>settings</span>
            <span>Settings</span>
          </li>
        </ul>
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <div className="engine-status">
          <p className="engine-status-label">ENGINE STATUS</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="engine-status-dot" />
            <span className="engine-status-text">OPERATIONAL</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
