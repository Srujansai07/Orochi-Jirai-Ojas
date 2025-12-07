// Jirai - Main Dashboard Page
// Entry point for the Jirai application

'use client';

import { useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { AppLayout } from '@/components/layout';
import { Canvas } from '@/components/canvas';
import { Timeline } from '@/components/timeline';
import { CombinedView } from '@/components/views';
import { NodeEditorDialog } from '@/components/editor';
import { CommandPalette } from '@/components/command';
import { useUIStore } from '@/store';

export default function Home() {
  const { openCommandPalette, activeDashboard } = useUIStore();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K for command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openCommandPalette]);

  // Render the active dashboard view
  const renderDashboard = () => {
    switch (activeDashboard) {
      case 'analysis':
        return <Canvas />;
      case 'workflow':
        return (
          <div className="h-full p-4 bg-slate-950">
            <Timeline />
          </div>
        );
      case 'combined':
        return <CombinedView />;
      default:
        return <Canvas />;
    }
  };

  return (
    <ReactFlowProvider>
      <AppLayout>
        {renderDashboard()}
      </AppLayout>

      {/* Global dialogs */}
      <NodeEditorDialog />
      <CommandPalette />
    </ReactFlowProvider>
  );
}
