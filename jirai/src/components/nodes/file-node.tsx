// Jirai - File Node Component
// File attachment node with preview

'use client';

import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { BaseNode } from './base-node';
import {
    File,
    FileText,
    FileImage,
    FileVideo,
    FileAudio,
    FileCode,
    Download,
    ExternalLink
} from 'lucide-react';
import { FileNodeData } from '@/types';
import { Button } from '@/components/ui/button';

export interface FileNodeProps extends NodeProps<FileNodeData> { }

const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return FileImage;
    if (mimeType.startsWith('video/')) return FileVideo;
    if (mimeType.startsWith('audio/')) return FileAudio;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText;
    if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('html')) return FileCode;
    return File;
};

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const FileNode = memo(function FileNode({ data, selected }: FileNodeProps) {
    const FileIcon = getFileIcon(data.mimeType);
    const isImage = data.mimeType.startsWith('image/');

    return (
        <BaseNode
            selected={selected}
            label={data.label || data.fileName}
            color={data.color || 'slate'}
            icon={<FileIcon className="w-4 h-4" />}
        >
            <div className="space-y-2">
                {/* Thumbnail/Preview */}
                {isImage && data.thumbnail ? (
                    <div className="w-full h-24 rounded-lg overflow-hidden bg-black/20">
                        <img
                            src={data.thumbnail || data.fileUrl}
                            alt={data.fileName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-full h-16 rounded-lg bg-white/10 flex items-center justify-center">
                        <FileIcon className="w-8 h-8 text-white/60" />
                    </div>
                )}

                {/* File info */}
                <div className="space-y-1">
                    <p className="text-sm font-medium text-white truncate">
                        {data.fileName}
                    </p>
                    <p className="text-xs text-white/60">
                        {formatFileSize(data.fileSize)} • {data.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <a
                        href={data.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1"
                    >
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full bg-white/20 hover:bg-white/30 text-white text-xs"
                        >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Open
                        </Button>
                    </a>
                    <a
                        href={data.fileUrl}
                        download={data.fileName}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white/20 hover:bg-white/30 text-white"
                        >
                            <Download className="w-3 h-3" />
                        </Button>
                    </a>
                </div>
            </div>
        </BaseNode>
    );
});

export default FileNode;
