// Jirai - Command Palette
// Quick command launcher (Ctrl+K)

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore, useWorkspaceStore } from '@/store';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Search,
    FileText,
    Link2,
    User,
    CheckSquare,
    Youtube,
    File,
    FolderOpen,
    LayoutDashboard,
    Calendar,
    Combine,
    Trash2,
    Save,
    Settings,
    Moon,
    ArrowLeftRight,
    Plus,
    Sparkles,
    Command,
} from 'lucide-react';

interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon: React.ReactNode;
    category: string;
    action: () => void;
    keywords?: string[];
}

export function CommandPalette() {
    const [search, setSearch] = useState('');
    const {
        isCommandPaletteOpen,
        closeCommandPalette,
        setActiveDashboard,
        toggleSidebar,
        setLayoutDirection,
        layoutDirection,
        setSidebarTab,
    } = useUIStore();
    const { nodes, deleteNode } = useWorkspaceStore();

    // Define commands
    const commands: CommandItem[] = useMemo(() => [
        // Node creation
        {
            id: 'add-text',
            label: 'Add Text Node',
            description: 'Create a new text note',
            icon: <FileText className="w-4 h-4" />,
            category: 'Create',
            keywords: ['text', 'note', 'new'],
            action: () => {
                closeCommandPalette();
                // Would trigger add node action
            },
        },
        {
            id: 'add-task',
            label: 'Add Task Node',
            description: 'Create a new task with checkbox',
            icon: <CheckSquare className="w-4 h-4" />,
            category: 'Create',
            keywords: ['task', 'todo', 'checkbox'],
            action: () => closeCommandPalette(),
        },
        {
            id: 'add-person',
            label: 'Add Person Node',
            description: 'Add a contact/person',
            icon: <User className="w-4 h-4" />,
            category: 'Create',
            keywords: ['person', 'contact', 'user'],
            action: () => closeCommandPalette(),
        },
        {
            id: 'add-link',
            label: 'Add Link Node',
            description: 'Add a website link',
            icon: <Link2 className="w-4 h-4" />,
            category: 'Create',
            keywords: ['link', 'url', 'website'],
            action: () => closeCommandPalette(),
        },
        {
            id: 'add-youtube',
            label: 'Add YouTube Node',
            description: 'Embed a YouTube video',
            icon: <Youtube className="w-4 h-4" />,
            category: 'Create',
            keywords: ['youtube', 'video'],
            action: () => closeCommandPalette(),
        },
        {
            id: 'add-file',
            label: 'Add File Node',
            description: 'Attach a file',
            icon: <File className="w-4 h-4" />,
            category: 'Create',
            keywords: ['file', 'attachment', 'upload'],
            action: () => closeCommandPalette(),
        },
        {
            id: 'add-group',
            label: 'Add Group Node',
            description: 'Create a group container',
            icon: <FolderOpen className="w-4 h-4" />,
            category: 'Create',
            keywords: ['group', 'folder', 'container'],
            action: () => closeCommandPalette(),
        },

        // Dashboard switching
        {
            id: 'dashboard-analysis',
            label: 'Switch to Analysis',
            description: 'Mind map view',
            icon: <LayoutDashboard className="w-4 h-4" />,
            category: 'Dashboard',
            keywords: ['analysis', 'mindmap', 'view'],
            action: () => {
                setActiveDashboard('analysis');
                closeCommandPalette();
            },
        },
        {
            id: 'dashboard-workflow',
            label: 'Switch to Workflow',
            description: 'Calendar timeline view',
            icon: <Calendar className="w-4 h-4" />,
            category: 'Dashboard',
            keywords: ['workflow', 'calendar', 'timeline'],
            action: () => {
                setActiveDashboard('workflow');
                closeCommandPalette();
            },
        },
        {
            id: 'dashboard-combined',
            label: 'Switch to Combined',
            description: 'Analysis + Workflow',
            icon: <Combine className="w-4 h-4" />,
            category: 'Dashboard',
            keywords: ['combined', 'both'],
            action: () => {
                setActiveDashboard('combined');
                closeCommandPalette();
            },
        },

        // Actions
        {
            id: 'toggle-sidebar',
            label: 'Toggle Sidebar',
            description: 'Show/hide sidebar',
            icon: <ArrowLeftRight className="w-4 h-4" />,
            category: 'View',
            keywords: ['sidebar', 'toggle', 'hide', 'show'],
            action: () => {
                toggleSidebar();
                closeCommandPalette();
            },
        },
        {
            id: 'toggle-layout',
            label: 'Toggle Layout',
            description: `Currently: ${layoutDirection}`,
            icon: <ArrowLeftRight className="w-4 h-4" />,
            category: 'View',
            keywords: ['layout', 'horizontal', 'vertical'],
            action: () => {
                setLayoutDirection(layoutDirection === 'horizontal' ? 'vertical' : 'horizontal');
                closeCommandPalette();
            },
        },
        {
            id: 'open-ai-chat',
            label: 'Open AI Chat',
            description: 'Talk to AI assistant',
            icon: <Sparkles className="w-4 h-4" />,
            category: 'Tools',
            keywords: ['ai', 'chat', 'assistant'],
            action: () => {
                setSidebarTab('chat');
                closeCommandPalette();
            },
        },
        {
            id: 'settings',
            label: 'Open Settings',
            description: 'Configure preferences',
            icon: <Settings className="w-4 h-4" />,
            category: 'Tools',
            keywords: ['settings', 'preferences', 'config'],
            action: () => {
                setSidebarTab('settings');
                closeCommandPalette();
            },
        },
    ], [closeCommandPalette, setActiveDashboard, toggleSidebar, setLayoutDirection, layoutDirection, setSidebarTab]);

    // Filter commands based on search
    const filteredCommands = useMemo(() => {
        if (!search.trim()) return commands;
        const query = search.toLowerCase();
        return commands.filter(cmd =>
            cmd.label.toLowerCase().includes(query) ||
            cmd.description?.toLowerCase().includes(query) ||
            cmd.keywords?.some(k => k.includes(query))
        );
    }, [commands, search]);

    // Group by category
    const groupedCommands = useMemo(() => {
        const groups: Record<string, CommandItem[]> = {};
        filteredCommands.forEach(cmd => {
            if (!groups[cmd.category]) groups[cmd.category] = [];
            groups[cmd.category].push(cmd);
        });
        return groups;
    }, [filteredCommands]);

    // Keyboard shortcut to open
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (isCommandPaletteOpen) {
                    closeCommandPalette();
                } else {
                    // Open via store
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCommandPaletteOpen, closeCommandPalette]);

    return (
        <Dialog open={isCommandPaletteOpen} onOpenChange={(open) => !open && closeCommandPalette()}>
            <DialogContent className="sm:max-w-[500px] p-0 bg-slate-900 border-slate-700 overflow-hidden">
                {/* Search input */}
                <div className="flex items-center border-b border-slate-700 px-3">
                    <Search className="w-5 h-5 text-slate-400 shrink-0" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search commands..."
                        className="border-0 bg-transparent text-white placeholder:text-slate-500 focus-visible:ring-0 text-lg py-4"
                        autoFocus
                    />
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-400 bg-slate-800 rounded border border-slate-700">
                        <Command className="w-3 h-3" /> K
                    </kbd>
                </div>

                {/* Command list */}
                <ScrollArea className="max-h-[400px]">
                    <div className="p-2">
                        {Object.entries(groupedCommands).map(([category, items]) => (
                            <div key={category} className="mb-3">
                                <p className="text-xs text-slate-500 font-medium px-2 py-1">{category}</p>
                                {items.map((cmd) => (
                                    <button
                                        key={cmd.id}
                                        onClick={cmd.action}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-slate-800 transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                                            {cmd.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white font-medium truncate">{cmd.label}</p>
                                            {cmd.description && (
                                                <p className="text-xs text-slate-500 truncate">{cmd.description}</p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ))}

                        {filteredCommands.length === 0 && (
                            <div className="py-8 text-center">
                                <p className="text-slate-500">No commands found</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Footer */}
                <div className="border-t border-slate-700 px-3 py-2 flex items-center justify-between text-xs text-slate-500">
                    <span>↑↓ Navigate</span>
                    <span>↵ Select</span>
                    <span>Esc Close</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CommandPalette;
