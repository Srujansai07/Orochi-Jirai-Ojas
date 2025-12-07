// Jirai - Zustand Store
// Central state management for the application

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
    NodeChange,
    EdgeChange,
    applyNodeChanges,
    applyEdgeChanges,
    OnNodesChange,
    OnEdgesChange,
    Connection,
    addEdge,
} from 'reactflow';
import {
    JiraiNode,
    JiraiEdge,
    DashboardType,
    LayoutDirection,
    ZoomLevel,
    ChatMessage,
    Workspace
} from '@/types';

// Sample nodes for initial state
const initialNodes: JiraiNode[] = [
    {
        id: 'text-1',
        type: 'text',
        position: { x: 100, y: 100 },
        data: {
            id: 'text-1',
            label: 'Welcome to Jirai',
            type: 'text',
            content: 'This is a text node. You can use it for notes, ideas, or any information.',
            color: 'violet',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    },
    {
        id: 'task-1',
        type: 'task',
        position: { x: 450, y: 80 },
        data: {
            id: 'task-1',
            label: 'Learn Jirai',
            type: 'task',
            description: 'Explore all the node types and features',
            completed: false,
            priority: 'high',
            dueDate: new Date(), // Today
            subtasks: [
                { id: '1', label: 'Create nodes', completed: true },
                { id: '2', label: 'Connect nodes', completed: false },
                { id: '3', label: 'Use AI chat', completed: false },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    },
    {
        id: 'person-1',
        type: 'person',
        position: { x: 100, y: 350 },
        data: {
            id: 'person-1',
            label: 'Team Member',
            type: 'person',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            tags: ['Developer', 'Team Lead'],
            notes: 'Key contact for the project',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    },
    {
        id: 'youtube-1',
        type: 'youtube',
        position: { x: 450, y: 320 },
        data: {
            id: 'youtube-1',
            label: 'Tutorial Video',
            type: 'youtube',
            videoId: 'dQw4w9WgXcQ',
            title: 'Getting Started with Mind Mapping',
            channelName: 'Jirai Tutorials',
            duration: '10:30',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    },
];

const initialEdges: JiraiEdge[] = [
    { id: 'e1-2', source: 'text-1', target: 'task-1', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
    { id: 'e1-3', source: 'text-1', target: 'person-1', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
    { id: 'e2-4', source: 'task-1', target: 'youtube-1', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
];

// ============================================
// Workspace Store
// ============================================

interface WorkspaceState {
    // Current workspace data
    currentWorkspaceId: string | null;
    workspaces: Workspace[];

    // Nodes and edges
    nodes: JiraiNode[];
    edges: JiraiEdge[];

    // Viewport
    viewport: { x: number; y: number; zoom: number };

    // Selection
    selectedNodes: string[];
    selectedEdges: string[];

    // Actions
    setNodes: (nodes: JiraiNode[]) => void;
    setEdges: (edges: JiraiEdge[]) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: (connection: Connection) => void;
    addNode: (node: JiraiNode) => void;
    updateNode: (id: string, data: Partial<JiraiNode['data']>) => void;
    deleteNode: (id: string) => void;
    setViewport: (viewport: { x: number; y: number; zoom: number }) => void;
    setSelectedNodes: (ids: string[]) => void;
    setSelectedEdges: (ids: string[]) => void;
    clearSelection: () => void;

    // Workspace management
    createWorkspace: (workspace: Workspace) => void;
    loadWorkspace: (id: string) => void;
    saveWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
    devtools(
        persist(
            (set, get) => ({
                currentWorkspaceId: null,
                workspaces: [],
                nodes: initialNodes,
                edges: initialEdges,
                viewport: { x: 0, y: 0, zoom: 1 },
                selectedNodes: [],
                selectedEdges: [],

                setNodes: (nodes) => set({ nodes }),
                setEdges: (edges) => set({ edges }),

                onNodesChange: (changes: NodeChange[]) => {
                    set({
                        nodes: applyNodeChanges(changes, get().nodes) as JiraiNode[],
                    });
                },

                onEdgesChange: (changes: EdgeChange[]) => {
                    set({
                        edges: applyEdgeChanges(changes, get().edges) as JiraiEdge[],
                    });
                },

                onConnect: (connection: Connection) => {
                    set({
                        edges: addEdge({ ...connection, type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } }, get().edges) as JiraiEdge[],
                    });
                },

                addNode: (node) => set((state) => ({
                    nodes: [...state.nodes, node]
                })),

                updateNode: (id, data) => set((state) => ({
                    nodes: state.nodes.map((node) =>
                        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
                    ),
                })),

                deleteNode: (id) => set((state) => ({
                    nodes: state.nodes.filter((node) => node.id !== id),
                    edges: state.edges.filter(
                        (edge) => edge.source !== id && edge.target !== id
                    ),
                })),

                setViewport: (viewport) => set({ viewport }),
                setSelectedNodes: (ids) => set({ selectedNodes: ids }),
                setSelectedEdges: (ids) => set({ selectedEdges: ids }),
                clearSelection: () => set({ selectedNodes: [], selectedEdges: [] }),

                createWorkspace: (workspace) => set((state) => ({
                    workspaces: [...state.workspaces, workspace],
                    currentWorkspaceId: workspace.id,
                    nodes: workspace.nodes,
                    edges: workspace.edges,
                    viewport: workspace.viewport,
                })),

                loadWorkspace: (id) => {
                    const workspace = get().workspaces.find((w) => w.id === id);
                    if (workspace) {
                        set({
                            currentWorkspaceId: id,
                            nodes: workspace.nodes,
                            edges: workspace.edges,
                            viewport: workspace.viewport,
                        });
                    }
                },

                saveWorkspace: () => {
                    const { currentWorkspaceId, nodes, edges, viewport, workspaces } = get();
                    if (currentWorkspaceId) {
                        set({
                            workspaces: workspaces.map((w) =>
                                w.id === currentWorkspaceId
                                    ? { ...w, nodes, edges, viewport, updatedAt: new Date() }
                                    : w
                            ),
                        });
                    }
                },
            }),
            {
                name: 'jirai-workspace',
            }
        )
    )
);

// ============================================
// UI Store
// ============================================

interface UIState {
    // Dashboard state
    activeDashboard: DashboardType;
    layoutDirection: LayoutDirection;

    // Sidebar
    sidebarOpen: boolean;
    sidebarTab: 'workspaces' | 'chat' | 'settings';

    // Timeline (Workflow dashboard)
    zoomLevel: ZoomLevel;
    currentDate: Date;

    // Modals
    isCommandPaletteOpen: boolean;
    isNodeEditorOpen: boolean;
    editingNodeId: string | null;

    // Actions
    setActiveDashboard: (dashboard: DashboardType) => void;
    setLayoutDirection: (direction: LayoutDirection) => void;
    toggleSidebar: () => void;
    setSidebarTab: (tab: 'workspaces' | 'chat' | 'settings') => void;
    setZoomLevel: (level: ZoomLevel) => void;
    setCurrentDate: (date: Date) => void;
    openCommandPalette: () => void;
    closeCommandPalette: () => void;
    openNodeEditor: (nodeId: string) => void;
    closeNodeEditor: () => void;
}

export const useUIStore = create<UIState>()(
    devtools(
        persist(
            (set) => ({
                activeDashboard: 'analysis',
                layoutDirection: 'horizontal',
                sidebarOpen: true,
                sidebarTab: 'workspaces',
                zoomLevel: 'day',
                currentDate: new Date(),
                isCommandPaletteOpen: false,
                isNodeEditorOpen: false,
                editingNodeId: null,

                setActiveDashboard: (dashboard) => set({ activeDashboard: dashboard }),
                setLayoutDirection: (direction) => set({ layoutDirection: direction }),
                toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
                setSidebarTab: (tab) => set({ sidebarTab: tab }),
                setZoomLevel: (level) => set({ zoomLevel: level }),
                setCurrentDate: (date) => set({ currentDate: date }),
                openCommandPalette: () => set({ isCommandPaletteOpen: true }),
                closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
                openNodeEditor: (nodeId) => set({ isNodeEditorOpen: true, editingNodeId: nodeId }),
                closeNodeEditor: () => set({ isNodeEditorOpen: false, editingNodeId: null }),
            }),
            {
                name: 'jirai-ui',
                // Custom storage to handle Date serialization
                storage: {
                    getItem: (name) => {
                        const str = localStorage.getItem(name);
                        if (!str) return null;
                        const parsed = JSON.parse(str);
                        // Rehydrate currentDate as Date object
                        if (parsed.state?.currentDate) {
                            parsed.state.currentDate = new Date(parsed.state.currentDate);
                        }
                        return parsed;
                    },
                    setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
                    removeItem: (name) => localStorage.removeItem(name),
                },
            }
        )
    )
);

// ============================================
// Chat Store
// ============================================

interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    conversationId: string | null;

    addMessage: (message: ChatMessage) => void;
    setMessages: (messages: ChatMessage[]) => void;
    setLoading: (loading: boolean) => void;
    clearMessages: () => void;
    startNewConversation: () => void;
}

export const useChatStore = create<ChatState>()(
    devtools(
        (set) => ({
            messages: [],
            isLoading: false,
            conversationId: null,

            addMessage: (message) => set((state) => ({
                messages: [...state.messages, message]
            })),
            setMessages: (messages) => set({ messages }),
            setLoading: (loading) => set({ isLoading: loading }),
            clearMessages: () => set({ messages: [] }),
            startNewConversation: () => set({
                messages: [],
                conversationId: crypto.randomUUID()
            }),
        })
    )
);
