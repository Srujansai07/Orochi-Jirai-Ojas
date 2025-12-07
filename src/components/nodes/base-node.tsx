// Jirai - Base Node Component
// Shared styling and behavior for all node types

'use client';

import { memo, ReactNode } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GripVertical, MoreHorizontal, Trash2, Copy, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface BaseNodeProps {
    children: ReactNode;
    selected?: boolean;
    label?: string;
    color?: string;
    icon?: ReactNode;
    onEdit?: () => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
    className?: string;
    showHandles?: boolean;
    handlePositions?: {
        source?: Position[];
        target?: Position[];
    };
}

const colorVariants: Record<string, string> = {
    violet: 'from-violet-500 to-purple-600 border-violet-400/50',
    blue: 'from-blue-500 to-cyan-600 border-blue-400/50',
    green: 'from-emerald-500 to-teal-600 border-emerald-400/50',
    orange: 'from-orange-500 to-amber-600 border-orange-400/50',
    pink: 'from-pink-500 to-rose-600 border-pink-400/50',
    slate: 'from-slate-600 to-slate-700 border-slate-500/50',
    red: 'from-red-500 to-rose-600 border-red-400/50',
};

export const BaseNode = memo(function BaseNode({
    children,
    selected = false,
    label,
    color = 'violet',
    icon,
    onEdit,
    onDelete,
    onDuplicate,
    className,
    showHandles = true,
    handlePositions = {
        source: [Position.Right, Position.Bottom],
        target: [Position.Left, Position.Top],
    },
}: BaseNodeProps) {
    const colorClass = colorVariants[color] || colorVariants.violet;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={cn(
                'relative group min-w-[180px] max-w-[320px]',
                'bg-gradient-to-br rounded-xl border shadow-lg',
                'transition-all duration-200',
                colorClass,
                selected && 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 shadow-xl',
                className
            )}
        >
            {/* Target Handles */}
            {showHandles && handlePositions.target?.map((position) => (
                <Handle
                    key={`target-${position}`}
                    type="target"
                    position={position}
                    className={cn(
                        'w-3 h-3 bg-white border-2 border-slate-300 transition-all',
                        'hover:scale-125 hover:bg-violet-400 hover:border-violet-500',
                        position === Position.Left && '-left-1.5',
                        position === Position.Top && '-top-1.5',
                        position === Position.Right && '-right-1.5',
                        position === Position.Bottom && '-bottom-1.5'
                    )}
                />
            ))}

            {/* Source Handles */}
            {showHandles && handlePositions.source?.map((position) => (
                <Handle
                    key={`source-${position}`}
                    type="source"
                    position={position}
                    className={cn(
                        'w-3 h-3 bg-white border-2 border-slate-300 transition-all',
                        'hover:scale-125 hover:bg-violet-400 hover:border-violet-500',
                        position === Position.Left && '-left-1.5',
                        position === Position.Top && '-top-1.5',
                        position === Position.Right && '-right-1.5',
                        position === Position.Bottom && '-bottom-1.5'
                    )}
                />
            ))}

            {/* Header with label and actions */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/20">
                <div className="flex items-center gap-2 min-w-0">
                    {/* Drag handle */}
                    <GripVertical className="w-4 h-4 text-white/50 cursor-grab active:cursor-grabbing shrink-0" />

                    {/* Icon */}
                    {icon && (
                        <div className="shrink-0 text-white/80">
                            {icon}
                        </div>
                    )}

                    {/* Label */}
                    {label && (
                        <span className="text-sm font-medium text-white truncate">
                            {label}
                        </span>
                    )}
                </div>

                {/* Actions dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-white/70 hover:text-white hover:bg-white/20"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        {onEdit && (
                            <DropdownMenuItem onClick={onEdit}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                        )}
                        {onDuplicate && (
                            <DropdownMenuItem onClick={onDuplicate}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                            </DropdownMenuItem>
                        )}
                        {onDelete && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Content */}
            <div className="p-3 text-white">
                {children}
            </div>
        </motion.div>
    );
});

export default BaseNode;
