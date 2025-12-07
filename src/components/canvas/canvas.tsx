// Jirai - Canvas Component
// Main mind-mapping canvas using React Flow

'use client';

import { useCallback, useRef, useMemo, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Panel,
    ConnectionMode,
    BackgroundVariant,
    type Node,
    type Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkspaceStore, useUIStore } from '@/store';
import {
    TextNode,
    TaskNode,
    PersonNode,
    LinkNode,
    YouTubeNode,
    FileNode,
    GroupNode,
    nodeTypes as importedNodeTypes,
} from '@/components/nodes';
import { Button } from '@/components/ui/button';
import {
    Plus,
    FileText,
    CheckSquare,
    User,
    Link2,
    Youtube,
    File,
    FolderOpen,
    X,
} from 'lucide-react';

export function Canvas() {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode: addStoreNode } = useWorkspaceStore();
    const { activeDashboard, openNodeEditor } = useUIStore();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [showNodeMenu, setShowNodeMenu] = useState(false);

    // Memoize nodeTypes to prevent React Flow warning
    const nodeTypes = useMemo(() => importedNodeTypes, []);

    // Default edge style
    const defaultEdgeOptions = useMemo(() => ({
        type: 'smoothstep',
        animated: false,
        style: {
            strokeWidth: 2,
            stroke: '#6366f1',
        },
    }), []);

    // Handle node double-click to edit
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
                x: Math.random() * 400 + 200,
                y: Math.random() * 300 + 100
            },
            data: { ...baseData, ...typeDefaults[type] },
        };

        addStoreNode(newNode);
        setShowNodeMenu(false);
    }, [addStoreNode]);

    const nodeMenuItems = [
        { type: 'text', label: 'Text Note', icon: FileText, color: 'violet', desc: 'Add notes or ideas' },
        { type: 'task', label: 'Task', icon: CheckSquare, color: 'orange', desc: 'Create a task with subtasks' },
        { type: 'person', label: 'Person', icon: User, color: 'green', desc: 'Add a contact' },
        { type: 'link', label: 'Link', icon: Link2, color: 'blue', desc: 'Save a website link' },
        { type: 'youtube', label: 'YouTube', icon: Youtube, color: 'red', desc: 'Embed a video' },
        { type: 'file', label: 'File', icon: File, color: 'slate', desc: 'Attach a file' },
        { type: 'group', label: 'Group', icon: FolderOpen, color: 'pink', desc: 'Group related nodes' },
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

                {/* Dashboard type indicator */}
                <Panel position="top-left" className="m-4">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-base font-medium text-slate-700 dark:text-slate-200">
                            {activeDashboard === 'analysis' && '🔍 Analysis Mode'}
                            {activeDashboard === 'workflow' && '📅 Workflow Mode'}
                            {activeDashboard === 'combined' && '⚡ Combined Mode'}
                        </span>
                    </div>
                </Panel>

                {/* Quick add button panel */}
                <Panel position="bottom-center" className="mb-6">
                    <div className="relative">
                        <Button
                            onClick={() => setShowNodeMenu(!showNodeMenu)}
                            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-xl gap-2 px-6 py-6 text-base rounded-xl"
                        >
                            {showNodeMenu ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                            {showNodeMenu ? 'Close' : 'Add Node'}
                        </Button>

                        {/* Node Type Menu */}
                        {showNodeMenu && (
                            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 min-w-[280px]">
                                <div className="grid gap-1">
                                    {nodeMenuItems.map((item) => (
                                        <button
                                            key={item.type}
                                            onClick={() => addNode(item.type, item.label, item.color)}
                                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
                                        >
                                            <div className={`w-10 h-10 rounded-lg bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center`}>
                                                <item.icon className={`h-5 w-5 text-${item.color}-600 dark:text-${item.color}-400`} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{item.label}</p>
                                                <p className="text-xs text-slate-500">{item.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Panel>
            </ReactFlow>
        </div>
    );
}

export default Canvas;
