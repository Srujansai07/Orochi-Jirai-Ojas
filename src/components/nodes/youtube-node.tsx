// Jirai - YouTube Node Component
// YouTube video embed/preview node

'use client';

import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { BaseNode } from './base-node';
import { Youtube, Play, Clock } from 'lucide-react';
import { YouTubeNodeData } from '@/types';

export interface YouTubeNodeProps extends NodeProps<YouTubeNodeData> { }

export const YouTubeNode = memo(function YouTubeNode({ data, selected }: YouTubeNodeProps) {
    const thumbnailUrl = data.thumbnail ||
        `https://img.youtube.com/vi/${data.videoId}/mqdefault.jpg`;
    const videoUrl = `https://www.youtube.com/watch?v=${data.videoId}`;

    return (
        <BaseNode
            selected={selected}
            label={data.label || 'YouTube Video'}
            color={data.color || 'red'}
            icon={<Youtube className="w-4 h-4" />}
        >
            <div className="space-y-2">
                {/* Thumbnail with play button */}
                <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block w-full aspect-video rounded-lg overflow-hidden bg-black/30 group"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={thumbnailUrl}
                        alt={data.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                        </div>
                    </div>
                    {/* Duration badge */}
                    {data.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-xs text-white flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {data.duration}
                        </div>
                    )}
                </a>

                {/* Video title */}
                <p className="text-sm font-medium text-white line-clamp-2">
                    {data.title}
                </p>

                {/* Channel name */}
                {data.channelName && (
                    <p className="text-xs text-white/60">
                        {data.channelName}
                    </p>
                )}
            </div>
        </BaseNode>
    );
});

export default YouTubeNode;
