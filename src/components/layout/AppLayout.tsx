import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppSidebar } from './AppSidebar';
import { TopNavbar } from './TopNavbar';
import { ToastContainer } from '../common/Toast';
import { PlanGeneratorModal } from '../operations/PlanGeneratorModal';
import { OverviewPage } from '../../pages/OverviewPage';
import { FarmNetworkPage } from '../../pages/FarmNetworkPage';
import { CropHealthPage } from '../../pages/CropHealthPage';
import { WeatherPage } from '../../pages/WeatherPage';
import { OperationsPlannerPage } from '../../pages/OperationsPlannerPage';
import { ResourceAllocationPage } from '../../pages/ResourceAllocationPage';
import { AgentCentrePage } from '../../pages/AgentCentrePage';
import { WhatIfSimulatorPage } from '../../pages/WhatIfSimulatorPage';
import { ReportsPage } from '../../pages/ReportsPage';
import { SettingsPage } from '../../pages/SettingsPage';

export const AppLayout: React.FC = () => {
  const { activePage } = useApp();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActivePage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewPage />;
      case 'farm-network':
        return <FarmNetworkPage />;
      case 'crop-health':
        return <CropHealthPage />;
      case 'weather':
        return <WeatherPage />;
      case 'operations':
        return <OperationsPlannerPage />;
      case 'resources':
        return <ResourceAllocationPage />;
      case 'agent-centre':
        return <AgentCentrePage />;
      case 'simulator':
        return <WhatIfSimulatorPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-agri-cream flex text-agri-charcoal font-sans antialiased">
      {/* Sidebar */}
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopNavbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <PlanGeneratorModal />
      <ToastContainer />
    </div>
  );
};

