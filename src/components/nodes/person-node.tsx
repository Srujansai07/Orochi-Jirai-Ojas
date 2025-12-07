// Jirai - Person Node Component
// Contact/person node with social links

'use client';

import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { BaseNode } from './base-node';
import { User, Mail, Phone, MessageCircle, Instagram } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PersonNodeData } from '@/types';

export interface PersonNodeProps extends NodeProps<PersonNodeData> { }

export const PersonNode = memo(function PersonNode({ data, selected }: PersonNodeProps) {
    const initials = data.name
        ? data.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <BaseNode
            selected={selected}
            label={data.label || data.name}
            color={data.color || 'green'}
            icon={<User className="w-4 h-4" />}
        >
            <div className="space-y-3">
                {/* Avatar and name */}
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white/30">
                        <AvatarImage src={data.avatar} alt={data.name} />
                        <AvatarFallback className="bg-white/20 text-white font-medium">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="font-medium text-white truncate">{data.name}</p>
                        {data.email && (
                            <p className="text-xs text-white/60 truncate">{data.email}</p>
                        )}
                    </div>
                </div>

                {/* Contact icons */}
                <div className="flex items-center gap-2">
                    {data.email && (
                        <a
                            href={`mailto:${data.email}`}
                            className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Mail className="w-4 h-4 text-white/80" />
                        </a>
                    )}
                    {data.phone && (
                        <a
                            href={`tel:${data.phone}`}
                            className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Phone className="w-4 h-4 text-white/80" />
                        </a>
                    )}
                    {data.whatsapp && (
                        <a
                            href={`https://wa.me/${data.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MessageCircle className="w-4 h-4 text-white/80" />
                        </a>
                    )}
                    {data.instagram && (
                        <a
                            href={`https://instagram.com/${data.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Instagram className="w-4 h-4 text-white/80" />
                        </a>
                    )}
                </div>

                {/* Tags */}
                {data.tags && data.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {data.tags.map((tag, i) => (
                            <Badge
                                key={i}
                                variant="secondary"
                                className="bg-white/20 text-white text-xs hover:bg-white/30"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Notes */}
                {data.notes && (
                    <p className="text-xs text-white/70 italic line-clamp-2">
                        {data.notes}
                    </p>
                )}
            </div>
        </BaseNode>
    );
});

export default PersonNode;
