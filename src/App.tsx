import React from 'react';
import { useCluster } from './context/ClusterContext';
import { Header } from './components/Header';
import { ClusterCanvas } from './components/ClusterCanvas';
import { ToolboxDrawer } from './components/ToolboxDrawer';
import { ConceptInspectorModal } from './components/ConceptInspectorModal';
import { SimulatedTrafficOverlay } from './components/SimulatedTrafficOverlay';
import { ClusterLogsDrawer } from './components/ClusterLogsDrawer';
import { MissionGuideModal } from './components/MissionGuideModal';
import { YamlViewer } from './components/YamlViewer';
import { TerminalSimulator } from './components/TerminalSimulator';
import { GlossaryModal } from './components/GlossaryModal';

export const App: React.FC = () => {
  const { viewMode } = useCluster();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation & Controls */}
      <Header />

      {/* Main Content Area based on active view mode */}
      <main className="flex-1">
        {viewMode === 'canvas' && (
          <>
            <ClusterCanvas />
            <ToolboxDrawer />
          </>
        )}

        {viewMode === 'missions' && <MissionGuideModal />}
        {viewMode === 'yaml' && <YamlViewer />}
        {viewMode === 'terminal' && <TerminalSimulator />}
        {viewMode === 'glossary' && <GlossaryModal />}
      </main>

      {/* Overlays & Global Drawers */}
      <SimulatedTrafficOverlay />
      <ClusterLogsDrawer />
      <ConceptInspectorModal />
    </div>
  );
};

export default App;
