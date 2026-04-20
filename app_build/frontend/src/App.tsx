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
          </>
        ) : (
          <SettingsPage />
        )}
      </main>
    </>
  );
};

export default App;
