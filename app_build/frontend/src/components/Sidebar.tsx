import React from 'react';
import { Search, Settings, Shield } from 'lucide-react';

interface SidebarProps {
  activeTab: 'search' | 'settings';
  onTabChange: (tab: 'search' | 'settings') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <aside className="sidebar">
      <div className="logo-container">
        <Shield size={28} className="logo-icon" />
        <span className="logo-text">LogAnalyzer</span>
      </div>
      
      <ul className="nav-list">
        <li 
          className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => onTabChange('search')}
        >
          <Search size={20} />
          <span>Search Logs</span>
        </li>
        <li 
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => onTabChange('settings')}
        >
          <Settings size={20} />
          <span>Settings</span>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
