// Jirai - Sidebar Component
// N8N-style left navigation panel

'use client';

import { useState } from 'react';
import { useUIStore, useWorkspaceStore } from '@/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { AIChatPanel } from '@/components/chat';
import {
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Calendar,
    Combine,
    MessageSquare,
    FolderOpen,
    Settings,
    Plus,
    Search,
} from 'lucide-react';

export function Sidebar() {
    const {
        sidebarOpen,
        toggleSidebar,
        sidebarTab,
        setSidebarTab,
        activeDashboard,
        setActiveDashboard,
    } = useUIStore();

    const { workspaces } = useWorkspaceStore();

    const dashboardItems = [
        { id: 'analysis' as const, label: 'Analysis', icon: LayoutDashboard, description: 'Mind map view' },
        { id: 'workflow' as const, label: 'Workflow', icon: Calendar, description: 'Calendar timeline' },
        { id: 'combined' as const, label: 'Combined', icon: Combine, description: 'Analysis + Timeline' },
    ];

    const navItems = [
        { id: 'workspaces' as const, label: 'Workspaces', icon: FolderOpen },
        { id: 'chat' as const, label: 'AI Chat', icon: MessageSquare },
        { id: 'settings' as const, label: 'Settings', icon: Settings },
    ];

    return (
        <TooltipProvider delayDuration={0}>
            <aside
                className={cn(
                    "fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800",
                    "flex flex-col transition-all duration-300 ease-in-out z-50",
                    sidebarOpen ? "w-64" : "w-16"
                )}
            >
                {/* Logo / Brand */}
                <div className="h-14 flex items-center justify-between px-4 border-b border-slate-800">
                    {sidebarOpen && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">J</span>
                            </div>
                            <span className="font-semibold text-white tracking-tight">Jirai</span>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                </div>

                {/* Dashboard Switcher */}
                <div className="p-2 space-y-1">
                    {dashboardItems.map((item) => (
                        <Tooltip key={item.id}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={activeDashboard === item.id ? 'secondary' : 'ghost'}
                                    className={cn(
                                        "w-full justify-start gap-3 text-slate-300 hover:text-white",
                                        activeDashboard === item.id && "bg-violet-600/20 text-violet-300 hover:bg-violet-600/30",
                                        !sidebarOpen && "justify-center px-2"
                                    )}
                                    onClick={() => setActiveDashboard(item.id)}
                                >
                                    <item.icon className="h-4 w-4 shrink-0" />
                                    {sidebarOpen && <span>{item.label}</span>}
                                </Button>
                            </TooltipTrigger>
                            {!sidebarOpen && (
                                <TooltipContent side="right">
                                    <p>{item.label}</p>
                                    <p className="text-xs text-slate-400">{item.description}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    ))}
                </div>

                <Separator className="bg-slate-800 my-2" />

                {/* Nav Tabs */}
                <div className="p-2 space-y-1">
                    {navItems.map((item) => (
                        <Tooltip key={item.id}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={sidebarTab === item.id ? 'secondary' : 'ghost'}
                                    className={cn(
                                        "w-full justify-start gap-3 text-slate-400 hover:text-white",
                                        sidebarTab === item.id && "bg-slate-800 text-white",
                                        !sidebarOpen && "justify-center px-2"
                                    )}
                                    onClick={() => setSidebarTab(item.id)}
                                >
                                    <item.icon className="h-4 w-4 shrink-0" />
                                    {sidebarOpen && <span>{item.label}</span>}
                                </Button>
                            </TooltipTrigger>
                            {!sidebarOpen && (
                                <TooltipContent side="right">{item.label}</TooltipContent>
                            )}
                        </Tooltip>
                    ))}
                </div>

                <Separator className="bg-slate-800 my-2" />

                {/* Content based on tab */}
                {sidebarOpen && (
                    <ScrollArea className="flex-1 px-2">
                        {sidebarTab === 'workspaces' && (
                            <div className="space-y-2">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="Search workspaces..."
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-md pl-8 pr-3 py-2 text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>

                                {/* New Workspace Button */}
                                <Button
                                    variant="outline"
                                    className="w-full border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-violet-500"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Workspace
                                </Button>

                                {/* Workspace List */}
                                <div className="space-y-1 pt-2">
                                    {workspaces.length === 0 ? (
                                        <p className="text-sm text-slate-500 text-center py-4">
                                            No workspaces yet
                                        </p>
                                    ) : (
                                        workspaces.map((workspace) => (
                                            <Button
                                                key={workspace.id}
                                                variant="ghost"
                                                className="w-full justify-start text-slate-400 hover:text-white"
                                            >
                                                <FolderOpen className="h-4 w-4 mr-2" />
                                                {workspace.name}
                                            </Button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {sidebarTab === 'chat' && (
                            <AIChatPanel />
                        )}

                        {sidebarTab === 'settings' && (
                            <div className="space-y-4 py-2">
                                <div className="text-sm text-slate-400">
                                    <p className="font-medium text-white mb-2">Preferences</p>
                                    <p className="text-xs">Theme, layout, and notification settings</p>
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                )}

                {/* User section at bottom */}
                <div className="mt-auto p-2 border-t border-slate-800">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full text-slate-400 hover:text-white",
                            sidebarOpen ? "justify-start px-3" : "justify-center"
                        )}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-sm font-medium">
                            U
                        </div>
                        {sidebarOpen && (
                            <div className="ml-3 text-left">
                                <p className="text-sm font-medium">User</p>
                                <p className="text-xs text-slate-500">Free Plan</p>
                            </div>
                        )}
                    </Button>
                </div>
            </aside>
        </TooltipProvider>
    );
}

export default Sidebar;
