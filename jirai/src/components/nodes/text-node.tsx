// Jirai - Text Node Component
// Simple text/note node for mind mapping

'use client';

import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { BaseNode } from './base-node';
import { FileText } from 'lucide-react';
import { TextNodeData } from '@/types';

export interface TextNodeProps extends NodeProps<TextNodeData> { }

export const TextNode = memo(function TextNode({ data, selected }: TextNodeProps) {
    return (
        <BaseNode
            selected={selected}
            label={data.label}
            color={data.color || 'violet'}
            icon={<FileText className="w-4 h-4" />}
        >
            <p className="text-sm text-white/90 whitespace-pre-wrap break-words">
                {data.content || 'Double-click to add content...'}
            </p>
        </BaseNode>
    );
});

export default TextNode;
