// Jirai - Node Editor Dialog
// Dialog for editing node content with type-specific fields

'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUIStore, useWorkspaceStore } from '@/store';
import { BaseNodeData } from '@/types';
import {
    Save,
    X,
    Palette,
    FileText,
    Link2,
    User,
    CheckSquare,
    Youtube,
    File,
    FolderOpen,
    Trash2
} from 'lucide-react';

// Color options for nodes
const colorOptions = [
    { id: 'violet', label: 'Violet', class: 'bg-violet-500' },
    { id: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { id: 'green', label: 'Green', class: 'bg-emerald-500' },
    { id: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { id: 'pink', label: 'Pink', class: 'bg-pink-500' },
    { id: 'red', label: 'Red', class: 'bg-red-500' },
    { id: 'slate', label: 'Slate', class: 'bg-slate-500' },
];

const typeIcons: Record<string, React.ReactNode> = {
    text: <FileText className="w-4 h-4" />,
    link: <Link2 className="w-4 h-4" />,
    person: <User className="w-4 h-4" />,
    task: <CheckSquare className="w-4 h-4" />,
    youtube: <Youtube className="w-4 h-4" />,
    file: <File className="w-4 h-4" />,
    group: <FolderOpen className="w-4 h-4" />,
};

export function NodeEditorDialog() {
    const { isNodeEditorOpen, editingNodeId, closeNodeEditor } = useUIStore();
    const { nodes, updateNode, deleteNode } = useWorkspaceStore();

    const editingNode = nodes.find(n => n.id === editingNodeId);
    const [formData, setFormData] = useState<Partial<BaseNodeData>>({});

    // Sync form data when node changes
    useEffect(() => {
        if (editingNode) {
            setFormData({ ...editingNode.data });
        }
    }, [editingNode]);

    const handleSave = () => {
        if (editingNodeId && formData) {
            updateNode(editingNodeId, formData as any);
            closeNodeEditor();
        }
    };

    const handleDelete = () => {
        if (editingNodeId) {
            deleteNode(editingNodeId);
            closeNodeEditor();
        }
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!editingNode) return null;

    const nodeType = formData.type || 'text';

    return (
        <Dialog open={isNodeEditorOpen} onOpenChange={(open) => !open && closeNodeEditor()}>
            <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {typeIcons[nodeType]}
                        Edit {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Modify the node properties below
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="content" className="w-full">
                    <TabsList className="bg-slate-800 border-slate-700">
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="style">Style</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-4 mt-4">
                        {/* Label field - common to all */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Label</label>
                            <Input
                                value={formData.label || ''}
                                onChange={(e) => updateField('label', e.target.value)}
                                placeholder="Node label"
                                className="bg-slate-800 border-slate-700 text-white"
                            />
                        </div>

                        {/* Type-specific fields */}
                        {nodeType === 'text' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Content</label>
                                <textarea
                                    value={(formData as any).content || ''}
                                    onChange={(e) => updateField('content', e.target.value)}
                                    placeholder="Enter your text..."
                                    rows={4}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </div>
                        )}

                        {nodeType === 'link' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">URL</label>
                                <Input
                                    value={(formData as any).url || ''}
                                    onChange={(e) => updateField('url', e.target.value)}
                                    placeholder="https://example.com"
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                        )}

                        {nodeType === 'person' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Name</label>
                                    <Input
                                        value={(formData as any).name || ''}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder="Person's name"
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Email</label>
                                        <Input
                                            value={(formData as any).email || ''}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            placeholder="email@example.com"
                                            className="bg-slate-800 border-slate-700 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Phone</label>
                                        <Input
                                            value={(formData as any).phone || ''}
                                            onChange={(e) => updateField('phone', e.target.value)}
                                            placeholder="+1234567890"
                                            className="bg-slate-800 border-slate-700 text-white"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {nodeType === 'task' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Description</label>
                                    <textarea
                                        value={(formData as any).description || ''}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        placeholder="Task description..."
                                        rows={2}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Priority</label>
                                        <select
                                            value={(formData as any).priority || 'medium'}
                                            onChange={(e) => updateField('priority', e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Due Date</label>
                                        <Input
                                            type="date"
                                            value={(formData as any).dueDate ? new Date((formData as any).dueDate).toISOString().split('T')[0] : ''}
                                            onChange={(e) => updateField('dueDate', e.target.value ? new Date(e.target.value) : undefined)}
                                            className="bg-slate-800 border-slate-700 text-white"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {nodeType === 'youtube' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Video ID</label>
                                    <Input
                                        value={(formData as any).videoId || ''}
                                        onChange={(e) => updateField('videoId', e.target.value)}
                                        placeholder="dQw4w9WgXcQ"
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Title</label>
                                    <Input
                                        value={(formData as any).title || ''}
                                        onChange={(e) => updateField('title', e.target.value)}
                                        placeholder="Video title"
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>
                            </>
                        )}

                        {nodeType === 'group' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Tier/Category</label>
                                <Input
                                    value={(formData as any).tier || ''}
                                    onChange={(e) => updateField('tier', e.target.value)}
                                    placeholder="e.g., Top Tier, Important"
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="style" className="space-y-4 mt-4">
                        {/* Color picker */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Palette className="w-4 h-4" />
                                Node Color
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {colorOptions.map((color) => (
                                    <button
                                        key={color.id}
                                        onClick={() => updateField('color', color.id)}
                                        className={`w-8 h-8 rounded-lg ${color.class} transition-all ${formData.color === color.id
                                                ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
                                                : 'hover:scale-105'
                                            }`}
                                        title={color.label}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Node type indicator */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Node Type</label>
                            <Badge variant="outline" className="text-slate-300 border-slate-600">
                                {typeIcons[nodeType]}
                                <span className="ml-1">{nodeType}</span>
                            </Badge>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="flex justify-between sm:justify-between">
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={closeNodeEditor} className="border-slate-600 text-slate-300">
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default NodeEditorDialog;
