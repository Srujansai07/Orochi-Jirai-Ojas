// Jirai - Main App Layout
// N8N-style interface with sidebar and main workspace

'use client';

import { ReactNode } from 'react';
import { useUIStore } from '@/store';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
    children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const { sidebarOpen } = useUIStore();

    return (
        <div className="h-screen w-screen overflow-hidden bg-background flex">
            {/* Sidebar - N8N style left panel */}
            <Sidebar />

            {/* Main content area */}
            <main
                className={cn(
                    "flex-1 flex flex-col transition-all duration-300 ease-in-out",
                    sidebarOpen ? "ml-64" : "ml-16"
                )}
            >
                {/* Header with dashboard switcher */}
                <Header />

                {/* Workspace canvas */}
                <div className="flex-1 relative overflow-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AppLayout;
