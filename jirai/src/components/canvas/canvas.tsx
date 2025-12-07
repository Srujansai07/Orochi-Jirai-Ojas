// Jirai - Canvas Component
// React Flow based node canvas with N8N-style appearance

'use client';

import { useCallback, useRef, useState, useMemo } from 'react';
import ReactFlow, {
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    Connection,
    Edge,
    Node,
    useReactFlow,
    Panel,
    ConnectionMode,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useUIStore, useWorkspaceStore } from '@/store';
import { nodeTypes as importedNodeTypes } from '@/components/nodes';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    Plus,
    FileText,
    Link2,
    User,
    CheckSquare,
    Youtube,
    File,
    FolderOpen
} from 'lucide-react';

// Default edge options - N8N style
const defaultEdgeOptions = {
    type: 'smoothstep',
    markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: '#64748b',
    },
    style: {
        strokeWidth: 2,
        stroke: '#64748b',
    },
};

interface CanvasProps {
    // Props can be added for initial state
}

export function Canvas({ }: CanvasProps) {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { activeDashboard, openNodeEditor } = useUIStore();
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode: addStoreNode
    } = useWorkspaceStore();

    // Memoize nodeTypes to prevent React Flow warning about re-creation
    const nodeTypes = useMemo(() => importedNodeTypes, []);

    const { project } = useReactFlow();

    // Handle double-click on node to open editor
    const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
        openNodeEditor(node.id);
    }, [openNodeEditor]);

    // Add a new node of specified type
    const addNode = useCallback((type: string, label: string, color: string) => {
        const id = `${type}-${Date.now()}`;
        const baseData = {
            id,
            label,
            type,
            color,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Type-specific default data
        const typeDefaults: Record<string, any> = {
            text: { content: 'Double-click to edit...', date: new Date(Date.now() + 24 * 60 * 60 * 1000) },
            link: { url: 'https://example.com', preview: { title: 'Example Site' } },
            person: { name: label, email: '', tags: [] },
            task: { description: label, completed: false, priority: 'medium', subtasks: [], dueDate: new Date() },
            youtube: { videoId: '', title: label, channelName: '' },
            file: { fileName: 'file.pdf', fileUrl: '', fileSize: 0, mimeType: 'application/pdf' },
            group: { children: [], tier: '' },
        };

        const newNode: Node = {
            id,
            type,
            position: {
                x: Math.random() * 300 + 100,
                y: Math.random() * 300 + 100
            },
            data: { ...baseData, ...typeDefaults[type] },
        };

        addStoreNode(newNode);
    }, [addStoreNode]);

    const nodeMenuItems = [
        { type: 'text', label: 'Text Note', icon: FileText, color: 'violet' },
        { type: 'task', label: 'Task', icon: CheckSquare, color: 'orange' },
        { type: 'person', label: 'Person', icon: User, color: 'green' },
        { type: 'link', label: 'Link', icon: Link2, color: 'blue' },
        { type: 'youtube', label: 'YouTube', icon: Youtube, color: 'red' },
        { type: 'file', label: 'File', icon: File, color: 'slate' },
        { type: 'group', label: 'Group', icon: FolderOpen, color: 'pink' },
    ];

    return (
        <div ref={reactFlowWrapper} className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDoubleClick={onNodeDoubleClick}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                connectionMode={ConnectionMode.Loose}
                fitView
                snapToGrid
                snapGrid={[15, 15]}
                className="bg-slate-50 dark:bg-slate-900"
                proOptions={{ hideAttribution: true }}
            >
                {/* N8N-style dot grid background */}
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1.5}
                    color="#94a3b8"
                    className="opacity-40"
                />

                {/* Controls - zoom, fit, lock */}
                <Controls
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg"
                    showInteractive={false}
                />

                {/* Mini map for navigation */}
                <MiniMap
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                    nodeColor={(node) => {
                        const colors: Record<string, string> = {
                            text: '#8b5cf6',
                            task: '#f97316',
                            person: '#10b981',
                            link: '#3b82f6',
                            youtube: '#ef4444',
                            file: '#64748b',
                            group: '#ec4899',
                        };
                        return colors[node.type || 'text'] || '#8b5cf6';
                    }}
                    maskColor="rgba(0, 0, 0, 0.1)"
                />

                {/* Quick add button panel */}
                <Panel position="bottom-center" className="mb-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg gap-2">
                                <Plus className="h-4 w-4" />
                                Add Node
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-48">
                            {nodeMenuItems.map((item) => (
                                <DropdownMenuItem
                                    key={item.type}
                                    onClick={() => addNode(item.type, item.label, item.color)}
                                    className="gap-2"
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </Panel>

                {/* Dashboard type indicator */}
                <Panel position="top-left" className="m-4">
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-300">
                        {activeDashboard === 'analysis' && '🔍 Analysis Mode - Mind Map View'}
                        {activeDashboard === 'workflow' && '📅 Workflow Mode - Timeline View'}
                        {activeDashboard === 'combined' && '⚡ Combined Mode - Analysis + Timeline'}
                    </div>
                </Panel>
            </ReactFlow>
        </div>
    );
}

export default Canvas;
