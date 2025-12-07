// Jirai - Timeline Component
// Calendar-style timeline view for workflow scheduling

'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay, isToday } from 'date-fns';
import { useUIStore, useWorkspaceStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ZoomLevel } from '@/types';
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    Clock,
    ZoomIn,
    ZoomOut,
    CalendarDays,
    CalendarRange,
    CheckSquare,
    FileText,
    Milestone,
    User,
    Link2,
    Youtube,
    File,
    FolderOpen
} from 'lucide-react';

// Time slots for day view
const HOURS = Array.from({ length: 24 }, (_, i) => i);

// Node color mappings
const nodeColors: Record<string, string> = {
    text: 'bg-violet-500',
    task: 'bg-orange-500',
    person: 'bg-emerald-500',
    link: 'bg-blue-500',
    youtube: 'bg-red-500',
    file: 'bg-slate-500',
    group: 'bg-pink-500',
};

export function Timeline() {
    const { zoomLevel, setZoomLevel, currentDate, setCurrentDate } = useUIStore();
    const { nodes } = useWorkspaceStore();

    // Get nodes with dates (task nodes typically have due dates)
    const scheduledNodes = useMemo(() => {
        return nodes.filter(node => {
            const data = node.data as any;
            return data.dueDate || data.date;
        });
    }, [nodes]);

    // Get date range based on zoom level
    const dateRange = useMemo(() => {
        switch (zoomLevel) {
            case 'day':
                return { start: currentDate, end: currentDate };
            case 'week':
                return { start: startOfWeek(currentDate), end: endOfWeek(currentDate) };
            case 'month':
                return {
                    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
                    end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
                };
            default:
                return { start: currentDate, end: currentDate };
        }
    }, [currentDate, zoomLevel]);

    // Days to display
    const days = useMemo(() => {
        return eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
    }, [dateRange]);

    // Navigation handlers
    const goNext = useCallback(() => {
        switch (zoomLevel) {
            case 'day':
                setCurrentDate(addDays(currentDate, 1));
                break;
            case 'week':
                setCurrentDate(addWeeks(currentDate, 1));
                break;
            case 'month':
                setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
                break;
        }
    }, [currentDate, zoomLevel, setCurrentDate]);

    const goPrev = useCallback(() => {
        switch (zoomLevel) {
            case 'day':
                setCurrentDate(subDays(currentDate, 1));
                break;
            case 'week':
                setCurrentDate(subWeeks(currentDate, 1));
                break;
            case 'month':
                setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
                break;
        }
    }, [currentDate, zoomLevel, setCurrentDate]);

    const goToday = () => setCurrentDate(new Date());

    // Get nodes for a specific day
    const getNodesForDay = useCallback((day: Date) => {
        return scheduledNodes.filter(node => {
            const data = node.data as any;
            const nodeDate = data.dueDate || data.date;
            if (!nodeDate) return false;
            return isSameDay(new Date(nodeDate), day);
        });
    }, [scheduledNodes]);

    const zoomOptions: { level: ZoomLevel; icon: React.ReactNode; label: string }[] = [
        { level: 'day', icon: <Clock className="w-4 h-4" />, label: 'Day' },
        { level: 'week', icon: <CalendarDays className="w-4 h-4" />, label: 'Week' },
        { level: 'month', icon: <CalendarRange className="w-4 h-4" />, label: 'Month' },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-800">
                {/* Navigation */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={goPrev} className="text-slate-400 hover:text-white">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={goNext} className="text-slate-400 hover:text-white">
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToday} className="text-slate-300 border-slate-700">
                        Today
                    </Button>
                </div>

                {/* Current period display */}
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-violet-400" />
                    <span className="text-lg font-semibold text-white">
                        {zoomLevel === 'day' && format(currentDate, 'EEEE, MMMM d, yyyy')}
                        {zoomLevel === 'week' && `Week of ${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d, yyyy')}`}
                        {zoomLevel === 'month' && format(currentDate, 'MMMM yyyy')}
                    </span>
                </div>

                {/* Zoom controls */}
                <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
                    {zoomOptions.map((opt) => (
                        <Button
                            key={opt.level}
                            variant={zoomLevel === opt.level ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setZoomLevel(opt.level)}
                            className={zoomLevel === opt.level
                                ? 'bg-violet-600 text-white'
                                : 'text-slate-400 hover:text-white'
                            }
                        >
                            {opt.icon}
                            <span className="ml-1 text-xs">{opt.label}</span>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Calendar grid */}
            <ScrollArea className="flex-1">
                {zoomLevel === 'day' && (
                    <DayView day={currentDate} getNodesForDay={getNodesForDay} />
                )}
                {zoomLevel === 'week' && (
                    <WeekView days={days} getNodesForDay={getNodesForDay} />
                )}
                {zoomLevel === 'month' && (
                    <MonthView days={days} getNodesForDay={getNodesForDay} currentMonth={currentDate.getMonth()} />
                )}
            </ScrollArea>
        </div>
    );
}

// Day View Component
function DayView({ day, getNodesForDay }: { day: Date; getNodesForDay: (d: Date) => any[] }) {
    const dayNodes = getNodesForDay(day);

    return (
        <div className="p-4">
            <div className="grid grid-cols-[60px_1fr] gap-2">
                {HOURS.map((hour) => (
                    <div key={hour} className="contents">
                        <div className="text-xs text-slate-500 text-right pr-2 pt-1">
                            {format(new Date().setHours(hour, 0), 'h a')}
                        </div>
                        <div className="min-h-[60px] border-t border-slate-800 relative">
                            {/* Nodes scheduled for this hour would appear here */}
                        </div>
                    </div>
                ))}
            </div>

            {/* All-day section for nodes */}
            {dayNodes.length > 0 && (
                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-2">Scheduled Items</p>
                    <div className="space-y-2">
                        {dayNodes.map((node) => (
                            <NodeItem key={node.id} node={node} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Week View Component
function WeekView({ days, getNodesForDay }: { days: Date[]; getNodesForDay: (d: Date) => any[] }) {
    return (
        <div className="grid grid-cols-7 gap-px bg-slate-800">
            {/* Day headers */}
            {days.map((day) => (
                <div
                    key={day.toString()}
                    className={`p-3 text-center ${isToday(day) ? 'bg-violet-600/20' : 'bg-slate-900'}`}
                >
                    <p className="text-xs text-slate-500">{format(day, 'EEE')}</p>
                    <p className={`text-lg font-semibold ${isToday(day) ? 'text-violet-400' : 'text-white'}`}>
                        {format(day, 'd')}
                    </p>
                </div>
            ))}

            {/* Day content */}
            {days.map((day) => {
                const dayNodes = getNodesForDay(day);
                return (
                    <div
                        key={`content-${day.toString()}`}
                        className={`min-h-[200px] p-2 ${isToday(day) ? 'bg-violet-600/10' : 'bg-slate-900'}`}
                    >
                        <div className="space-y-1">
                            {dayNodes.map((node) => (
                                <NodeItem key={node.id} node={node} compact />
                            ))}
                            {dayNodes.length === 0 && (
                                <p className="text-xs text-slate-600 text-center py-4">No items</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Month View Component
function MonthView({ days, getNodesForDay, currentMonth }: { days: Date[]; getNodesForDay: (d: Date) => any[]; currentMonth: number }) {
    // Pad the start to align with week start
    const startDay = startOfWeek(days[0]);
    const endDay = endOfWeek(days[days.length - 1]);
    const allDays = eachDayOfInterval({ start: startDay, end: endDay });

    return (
        <div className="grid grid-cols-7 gap-px bg-slate-800 p-2">
            {/* Week day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center text-xs text-slate-500 font-medium">
                    {day}
                </div>
            ))}

            {/* Days */}
            {allDays.map((day) => {
                const dayNodes = getNodesForDay(day);
                const isCurrentMonth = day.getMonth() === currentMonth;

                return (
                    <div
                        key={day.toString()}
                        className={`min-h-[100px] p-1 rounded ${isToday(day)
                                ? 'bg-violet-600/20 border border-violet-500'
                                : isCurrentMonth
                                    ? 'bg-slate-900'
                                    : 'bg-slate-900/50'
                            }`}
                    >
                        <p className={`text-sm font-medium mb-1 ${isToday(day)
                                ? 'text-violet-400'
                                : isCurrentMonth
                                    ? 'text-white'
                                    : 'text-slate-600'
                            }`}>
                            {format(day, 'd')}
                        </p>
                        <div className="space-y-0.5">
                            {dayNodes.slice(0, 3).map((node) => (
                                <div
                                    key={node.id}
                                    className={`text-xs truncate px-1 py-0.5 rounded ${nodeColors[node.data.type] || 'bg-slate-600'}`}
                                >
                                    {node.data.label}
                                </div>
                            ))}
                            {dayNodes.length > 3 && (
                                <p className="text-xs text-slate-500">+{dayNodes.length - 3} more</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Node Item Component
function NodeItem({ node, compact = false }: { node: any; compact?: boolean }) {
    const { openNodeEditor } = useUIStore();

    const typeIcons: Record<string, React.ReactNode> = {
        task: <CheckSquare className="w-3 h-3" />,
        text: <FileText className="w-3 h-3" />,
        person: <User className="w-3 h-3" />,
        link: <Link2 className="w-3 h-3" />,
        youtube: <Youtube className="w-3 h-3" />,
        file: <File className="w-3 h-3" />,
        group: <FolderOpen className="w-3 h-3" />,
    };

    if (compact) {
        return (
            <div
                onClick={() => openNodeEditor(node.id)}
                className={`text-xs px-2 py-1 rounded flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity ${nodeColors[node.data.type] || 'bg-slate-600'}`}
            >
                {typeIcons[node.data.type]}
                <span className="truncate">{node.data.label}</span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => openNodeEditor(node.id)}
            className={`p-2 rounded-lg border-l-4 bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors ${node.data.type === 'task' ? 'border-orange-500' :
                    node.data.type === 'text' ? 'border-violet-500' : 'border-slate-500'
                }`}
        >
            <div className="flex items-center gap-2">
                {typeIcons[node.data.type]}
                <span className="text-sm font-medium text-white">{node.data.label}</span>
                {node.data.priority && (
                    <Badge variant="outline" className={`text-xs ${node.data.priority === 'high' ? 'border-red-500 text-red-400' :
                            node.data.priority === 'medium' ? 'border-yellow-500 text-yellow-400' :
                                'border-green-500 text-green-400'
                        }`}>
                        {node.data.priority}
                    </Badge>
                )}
            </div>
            {node.data.description && (
                <p className="text-xs text-slate-400 mt-1 truncate">{node.data.description}</p>
            )}
        </motion.div>
    );
}

export default Timeline;
