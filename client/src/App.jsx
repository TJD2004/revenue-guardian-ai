import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DemoScenariosBar } from './components/DemoScenariosBar';
import { AgentActivityTicker } from './components/AgentActivityTicker';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RecoveryPage } from './pages/RecoveryPage';
import { CaseDetailsPage } from './pages/CaseDetailsPage';
import { CustomersPage } from './pages/CustomersPage';
import { AgentPage } from './pages/AgentPage';
import { AuditPage } from './pages/AuditPage';
import { VoiceRecoveryPage } from './pages/VoiceRecoveryPage';
import { SimulationsPage } from './pages/SimulationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { EnginesPage } from './pages/EnginesPage';
import { AttributionPage } from './pages/AttributionPage';
import { McpPage } from './pages/McpPage';
import { BlockchainPage } from './pages/BlockchainPage';

import { api } from './api/client';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleRunSimulation = async () => {
    return await api.runBatchSimulation(15);
  };

  const handleResetSimulation = async () => {
    if (window.confirm('Reset dataset to initial 500 benchmark cases?')) {
      await api.resetSimulation();
      window.location.reload();
    }
  };

  const renderContent = () => {
    if (currentPath === '/') {
      return <LandingPage navigate={navigate} onRunSimulation={handleRunSimulation} />;
    }
    if (currentPath === '/dashboard') {
      return <DashboardPage navigate={navigate} onRunSimulation={handleRunSimulation} />;
    }
    if (currentPath === '/recovery') {
      return <RecoveryPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/recovery/')) {
      const eventId = currentPath.split('/recovery/')[1];
      return <CaseDetailsPage eventId={eventId} navigate={navigate} />;
    }
    if (currentPath === '/engines') {
      return <EnginesPage navigate={navigate} />;
    }
    if (currentPath === '/attribution') {
      return <AttributionPage navigate={navigate} />;
    }
    if (currentPath === '/mcp') {
      return <McpPage navigate={navigate} />;
    }
    if (currentPath === '/blockchain') {
      return <BlockchainPage navigate={navigate} />;
    }
    if (currentPath === '/customers') {
      return <CustomersPage navigate={navigate} />;
    }
    if (currentPath === '/agent') {
      return <AgentPage navigate={navigate} onRunSimulation={handleRunSimulation} />;
    }
    if (currentPath === '/audit') {
      return <AuditPage navigate={navigate} />;
    }
    if (currentPath === '/voice') {
      return <VoiceRecoveryPage navigate={navigate} />;
    }
    if (currentPath === '/simulations') {
      return (
        <SimulationsPage
          onRunSimulation={handleRunSimulation}
          onResetSimulation={handleResetSimulation}
        />
      );
    }
    if (currentPath === '/settings') {
      return <SettingsPage navigate={navigate} />;
    }

    return <LandingPage navigate={navigate} onRunSimulation={handleRunSimulation} />;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans pb-10">
      <Navbar
        onRunSimulation={handleRunSimulation}
        onResetSimulation={handleResetSimulation}
        currentPath={currentPath}
        navigate={navigate}
      />

      <DemoScenariosBar onScenarioComplete={() => window.dispatchEvent(new Event('refreshStats'))} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar currentPath={currentPath} navigate={navigate} />

        <main className="flex-1 p-4 sm:p-8 min-w-0 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Live Real-Time Agent Stream Ticker */}
      <AgentActivityTicker />
    </div>
  );
}
