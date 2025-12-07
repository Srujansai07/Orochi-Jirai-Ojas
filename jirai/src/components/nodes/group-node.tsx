// Jirai - Group Node Component
// Collapsible container node for grouping other nodes

'use client';

import { memo, useState } from 'react';
import { NodeProps } from 'reactflow';
import { BaseNode } from './base-node';
import { Folder, FolderOpen, ChevronDown, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GroupNodeData } from '@/types';
import { cn } from '@/lib/utils';

export interface GroupNodeProps extends NodeProps<GroupNodeData> { }

const tierColors: Record<string, string> = {
    'Top Tier': 'bg-yellow-500',
    'Middle Tier': 'bg-blue-500',
    'Lower Tier': 'bg-slate-500',
    'Great Tier': 'bg-emerald-500',
};

export const GroupNode = memo(function GroupNode({ data, selected }: GroupNodeProps) {
    const [isCollapsed, setIsCollapsed] = useState(data.collapsed || false);
    const childCount = data.children?.length || 0;
    const tierColor = data.tier ? tierColors[data.tier] || 'bg-violet-500' : null;

    return (
        <BaseNode
            selected={selected}
            label={data.label}
            color={data.color || 'pink'}
            icon={isCollapsed ? <Folder className="w-4 h-4" /> : <FolderOpen className="w-4 h-4" />}
            className={cn(
                isCollapsed ? 'min-w-[160px]' : 'min-w-[200px]'
            )}
        >
            <div className="space-y-2">
                {/* Tier badge if applicable */}
                {data.tier && (
                    <Badge className={cn("text-xs text-white border-0", tierColor)}>
                        {data.tier}
                    </Badge>
                )}

                {/* Group info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-white/80">
                        <Users className="w-4 h-4" />
                        <span>{childCount} item{childCount !== 1 ? 's' : ''}</span>
                    </div>

                    {/* Collapse toggle */}
                    <button
                        className="p-1 rounded hover:bg-white/20 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsCollapsed(!isCollapsed);
                        }}
                    >
                        <ChevronDown className={cn(
                            "w-4 h-4 text-white/70 transition-transform",
                            isCollapsed && "-rotate-90"
                        )} />
                    </button>
                </div>

                {/* Expanded content placeholder */}
                {!isCollapsed && childCount > 0 && (
                    <div className="pt-2 border-t border-white/20">
                        <p className="text-xs text-white/60 text-center">
                            Connected nodes: {childCount}
                        </p>
                    </div>
                )}

                {/* Empty state */}
                {!isCollapsed && childCount === 0 && (
                    <div className="pt-2 border-t border-white/20">
                        <p className="text-xs text-white/50 text-center italic">
                            Drop nodes here to group
                        </p>
                    </div>
                )}
            </div>
        </BaseNode>
    );
});

export default GroupNode;
