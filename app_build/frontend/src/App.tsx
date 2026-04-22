import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FileAttachArea from './components/FileAttachArea';
import KeywordsArea from './components/KeywordsArea';
import ProgressArea from './components/ProgressArea';
import ResultArea from './components/ResultArea';
import SettingsPage from './components/SettingsPage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'settings'>('search');

  return (
    <>
      <div className="bg-glow-tr" />
      <div className="bg-glow-bl" />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {activeTab === 'search' ? (
          <>
            <Header />
            <div className="page-container">
              <div className="grid-2-cols">
                <FileAttachArea />
                <KeywordsArea />
              </div>
              <ProgressArea />
              <ResultArea />
            </div>
            <footer>
              <div className="footer-stats">
                <span>CPU: –</span>
                <span>RAM: –</span>
                <span>SCRIPTS: LOADED</span>
              </div>
              <div className="footer-secure">
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>security</span>
                ENCRYPTED END-TO-END
              </div>
            </footer>
          </>
        ) : (
          <SettingsPage />
        )}
      </main>
    </>
  );
};

export default App;
