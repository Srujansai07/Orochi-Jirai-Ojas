// Jirai - Link Node Component  
// Website/URL node with preview

'use client';

import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { BaseNode } from './base-node';
import { Link2, ExternalLink } from 'lucide-react';
import { LinkNodeData } from '@/types';

export interface LinkNodeProps extends NodeProps<LinkNodeData> { }

export const LinkNode = memo(function LinkNode({ data, selected }: LinkNodeProps) {
    const domain = data.url ? new URL(data.url).hostname.replace('www.', '') : '';

    return (
        <BaseNode
            selected={selected}
            label={data.label || domain}
            color={data.color || 'blue'}
            icon={<Link2 className="w-4 h-4" />}
        >
            <div className="space-y-2">
                {/* Preview image if available */}
                {data.preview?.image && (
                    <div className="relative w-full h-24 rounded-lg overflow-hidden bg-black/20">
                        <img
                            src={data.preview.image}
                            alt={data.preview.title || 'Preview'}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Title */}
                {data.preview?.title && (
                    <p className="text-sm font-medium text-white truncate">
                        {data.preview.title}
                    </p>
                )}

                {/* Description */}
                {data.preview?.description && (
                    <p className="text-xs text-white/70 line-clamp-2">
                        {data.preview.description}
                    </p>
                )}

                {/* URL */}
                <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                >
                    {data.favicon && (
                        <img src={data.favicon} alt="" className="w-4 h-4" />
                    )}
                    <span className="truncate">{domain}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
            </div>
        </BaseNode>
    );
});

export default LinkNode;
