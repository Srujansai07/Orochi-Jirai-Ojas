// Jirai - Task Node Component
// Todo/task node with checkbox and priority

'use client';

import { memo, useState } from 'react';
import { NodeProps } from 'reactflow';
import { BaseNode } from './base-node';
import { CheckSquare, Square, Clock, AlertCircle, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TaskNodeData } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export interface TaskNodeProps extends NodeProps<TaskNodeData> { }

const priorityConfig = {
    low: { color: 'bg-slate-500', label: 'Low' },
    medium: { color: 'bg-yellow-500', label: 'Medium' },
    high: { color: 'bg-red-500', label: 'High' },
};

export const TaskNode = memo(function TaskNode({ data, selected }: TaskNodeProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const priority = priorityConfig[data.priority] || priorityConfig.medium;
    const isOverdue = data.dueDate && new Date(data.dueDate) < new Date() && !data.completed;

    return (
        <BaseNode
            selected={selected}
            label={data.label}
            color={data.completed ? 'slate' : data.color || 'orange'}
            icon={data.completed ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
        >
            <div className="space-y-2">
                {/* Main task with checkbox */}
                <div className="flex items-start gap-2">
                    <button
                        className="mt-0.5 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {data.completed ? (
                            <CheckSquare className="w-5 h-5 text-white" />
                        ) : (
                            <Square className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
                        )}
                    </button>
                    <p className={cn(
                        "text-sm text-white flex-1",
                        data.completed && "line-through opacity-60"
                    )}>
                        {data.description || data.label}
                    </p>
                </div>

                {/* Meta info row */}
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Priority badge */}
                    <Badge className={cn("text-xs text-white border-0", priority.color)}>
                        {priority.label}
                    </Badge>

                    {/* Due date */}
                    {data.dueDate && (
                        <div className={cn(
                            "flex items-center gap-1 text-xs",
                            isOverdue ? "text-red-300" : "text-white/70"
                        )}>
                            {isOverdue && <AlertCircle className="w-3 h-3" />}
                            <Clock className="w-3 h-3" />
                            <span>{format(new Date(data.dueDate), 'MMM d')}</span>
                        </div>
                    )}
                </div>

                {/* Subtasks */}
                {data.subtasks && data.subtasks.length > 0 && (
                    <div className="space-y-1">
                        <button
                            className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                        >
                            <ChevronDown className={cn(
                                "w-3 h-3 transition-transform",
                                isExpanded && "rotate-180"
                            )} />
                            {data.subtasks.filter(s => s.completed).length}/{data.subtasks.length} subtasks
                        </button>

                        {isExpanded && (
                            <div className="pl-2 space-y-1 border-l border-white/20">
                                {data.subtasks.map((subtask) => (
                                    <div key={subtask.id} className="flex items-center gap-2 text-xs">
                                        {subtask.completed ? (
                                            <CheckSquare className="w-3 h-3 text-white/60" />
                                        ) : (
                                            <Square className="w-3 h-3 text-white/60" />
                                        )}
                                        <span className={cn(
                                            "text-white/80",
                                            subtask.completed && "line-through opacity-60"
                                        )}>
                                            {subtask.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </BaseNode>
    );
});

export default TaskNode;
