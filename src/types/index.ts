// Jirai - Types
// Node types for the mind map and workflow system

import { Node, Edge } from 'reactflow';

// ============================================
// Core Node Types
// ============================================

export type NodeType =
  | 'text'
  | 'link'
  | 'person'
  | 'file'
  | 'image'
  | 'video'
  | 'date'
  | 'task'
  | 'group'
  | 'youtube'
  | 'website';

export type DashboardType = 'analysis' | 'workflow' | 'combined';

export type LayoutDirection = 'horizontal' | 'vertical';

// ============================================
// Node Data Interface - Simplified for flexibility
// ============================================

export interface BaseNodeData {
  id: string;
  label: string;
  type: NodeType;
  color?: string;
  icon?: string;
  collapsed?: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Allow additional properties for specific node types
  [key: string]: unknown;
}

// Specific node data interfaces for documentation
export interface TextNodeData extends BaseNodeData {
  type: 'text';
  content: string;
}

export interface LinkNodeData extends BaseNodeData {
  type: 'link';
  url: string;
  favicon?: string;
  preview?: {
    title: string;
    description: string;
    image?: string;
  };
}

export interface PersonNodeData extends BaseNodeData {
  type: 'person';
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  notes?: string;
  tags?: string[];
}

export interface FileNodeData extends BaseNodeData {
  type: 'file';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  thumbnail?: string;
}

export interface TaskNodeData extends BaseNodeData {
  type: 'task';
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  reminder?: Date;
  subtasks?: { id: string; label: string; completed: boolean }[];
}

export interface DateNodeData extends BaseNodeData {
  type: 'date';
  date: Date;
  time?: string;
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface YouTubeNodeData extends BaseNodeData {
  type: 'youtube';
  videoId: string;
  title: string;
  thumbnail?: string;
  channelName?: string;
  duration?: string;
}

export interface GroupNodeData extends BaseNodeData {
  type: 'group';
  children: string[];
  tier?: string;
}

// Use BaseNodeData with index signature for flexibility
export type JiraiNodeData = BaseNodeData;

// React Flow node with Jirai data
export type JiraiNode = Node<JiraiNodeData>;

// ============================================
// Connection Types
// ============================================

export type ConnectionStyle = 'solid' | 'dashed' | 'dotted' | 'animated';

export interface JiraiEdgeData {
  label?: string;
  style: ConnectionStyle;
  color?: string;
  animated?: boolean;
}

export type JiraiEdge = Edge<JiraiEdgeData>;

// ============================================
// Workspace & Project Types
// ============================================

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  type: DashboardType;
  nodes: JiraiNode[];
  edges: JiraiEdge[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  layoutDirection: LayoutDirection;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Calendar/Timeline Types (for Workflow Dashboard)
// ============================================

export type ZoomLevel = 'hour' | 'day' | 'week' | 'month' | 'year';

export interface TimelineEvent {
  id: string;
  nodeId: string;
  startDate: Date;
  endDate?: Date;
  allDay?: boolean;
}

export interface WorkflowSettings {
  zoomLevel: ZoomLevel;
  showWeekends: boolean;
  startOfWeek: 0 | 1;
}

// ============================================
// AI Chat Types
// ============================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  generatedNodes?: JiraiNode[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  workspaceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// User & Auth Types
// ============================================

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultDashboard: DashboardType;
  defaultLayout: LayoutDirection;
  notifications: boolean;
}
