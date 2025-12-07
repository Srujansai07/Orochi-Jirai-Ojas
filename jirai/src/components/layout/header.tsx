// Jirai - Header Component
// Top bar with view controls and actions

'use client';

import { useUIStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    ArrowLeftRight,
    ArrowUpDown,
    Command,
    Download,
    Maximize2,
    MoreHorizontal,
    Share2,
    ZoomIn,
    ZoomOut,
    Home,
    Undo2,
    Redo2,
    Save,
} from 'lucide-react';

export function Header() {
    const {
        activeDashboard,
        layoutDirection,
        setLayoutDirection,
        openCommandPalette,
        zoomLevel,
    } = useUIStore();

    const dashboardLabels = {
        analysis: 'Analysis Dashboard',
        workflow: 'Workflow Dashboard',
        combined: 'Combined Dashboard',
    };

    return (
        <TooltipProvider delayDuration={0}>
            <header className="h-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-4">
                {/* Left section */}
                <div className="flex items-center gap-3">
                    {/* Dashboard indicator */}
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className="bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800"
                        >
                            {dashboardLabels[activeDashboard]}
                        </Badge>
                    </div>

                    <Separator orientation="vertical" className="h-6" />

                    {/* Layout toggle */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setLayoutDirection(layoutDirection === 'horizontal' ? 'vertical' : 'horizontal')}
                                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                            >
                                {layoutDirection === 'horizontal' ? (
                                    <ArrowLeftRight className="h-4 w-4" />
                                ) : (
                                    <ArrowUpDown className="h-4 w-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {layoutDirection === 'horizontal' ? 'Horizontal layout' : 'Vertical layout'}
                        </TooltipContent>
                    </Tooltip>

                    {/* Undo/Redo */}
                    <div className="flex items-center">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-slate-500">
                                    <Undo2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-slate-500">
                                    <Redo2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                {/* Center section - Zoom controls (for workflow dashboard) */}
                {activeDashboard !== 'analysis' && (
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-md p-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            <ZoomOut className="h-3.5 w-3.5" />
                        </Button>
                        <span className="text-xs text-slate-600 dark:text-slate-300 min-w-[60px] text-center">
                            {zoomLevel.charAt(0).toUpperCase() + zoomLevel.slice(1)}
                        </span>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            <ZoomIn className="h-3.5 w-3.5" />
                        </Button>
                        <Separator orientation="vertical" className="h-4 mx-1" />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <Home className="h-3.5 w-3.5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Fit view</TooltipContent>
                        </Tooltip>
                    </div>
                )}

                {/* Right section */}
                <div className="flex items-center gap-2">
                    {/* Command palette trigger */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={openCommandPalette}
                                className="gap-2"
                            >
                                <Command className="h-3.5 w-3.5" />
                                <span className="text-xs text-slate-500">Ctrl+K</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Command palette</TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" className="h-6" />

                    {/* Save */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-500">
                                <Save className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Save (Ctrl+S)</TooltipContent>
                    </Tooltip>

                    {/* Share */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-500">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Share</TooltipContent>
                    </Tooltip>

                    {/* Export */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-500">
                                <Download className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Export</TooltipContent>
                    </Tooltip>

                    {/* Fullscreen */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-500">
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Fullscreen</TooltipContent>
                    </Tooltip>

                    {/* More options */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-500">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Duplicate workspace</DropdownMenuItem>
                            <DropdownMenuItem>Import data</DropdownMenuItem>
                            <DropdownMenuItem>Export as PNG</DropdownMenuItem>
                            <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Delete workspace</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
        </TooltipProvider>
    );
}

export default Header;
