// Database Types for Supabase
// Generated based on Prisma schema

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    name: string | null;
                    avatar: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    email: string;
                    name?: string | null;
                    avatar?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    name?: string | null;
                    avatar?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            workspaces: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    type: string;
                    layout_direction: string;
                    viewport_x: number;
                    viewport_y: number;
                    viewport_zoom: number;
                    user_id: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    description?: string | null;
                    type?: string;
                    layout_direction?: string;
                    viewport_x?: number;
                    viewport_y?: number;
                    viewport_zoom?: number;
                    user_id: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string | null;
                    type?: string;
                    layout_direction?: string;
                    viewport_x?: number;
                    viewport_y?: number;
                    viewport_zoom?: number;
                    user_id?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            nodes: {
                Row: {
                    id: string;
                    type: string;
                    label: string;
                    position_x: number;
                    position_y: number;
                    width: number | null;
                    height: number | null;
                    color: string | null;
                    icon: string | null;
                    collapsed: boolean;
                    data: Json;
                    workspace_id: string;
                    parent_id: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    type: string;
                    label: string;
                    position_x: number;
                    position_y: number;
                    width?: number | null;
                    height?: number | null;
                    color?: string | null;
                    icon?: string | null;
                    collapsed?: boolean;
                    data?: Json;
                    workspace_id: string;
                    parent_id?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    type?: string;
                    label?: string;
                    position_x?: number;
                    position_y?: number;
                    width?: number | null;
                    height?: number | null;
                    color?: string | null;
                    icon?: string | null;
                    collapsed?: boolean;
                    data?: Json;
                    workspace_id?: string;
                    parent_id?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            edges: {
                Row: {
                    id: string;
                    style: string;
                    color: string | null;
                    label: string | null;
                    animated: boolean;
                    source_id: string;
                    target_id: string;
                    source_handle: string | null;
                    target_handle: string | null;
                    workspace_id: string;
                };
                Insert: {
                    id?: string;
                    style?: string;
                    color?: string | null;
                    label?: string | null;
                    animated?: boolean;
                    source_id: string;
                    target_id: string;
                    source_handle?: string | null;
                    target_handle?: string | null;
                    workspace_id: string;
                };
                Update: {
                    id?: string;
                    style?: string;
                    color?: string | null;
                    label?: string | null;
                    animated?: boolean;
                    source_id?: string;
                    target_id?: string;
                    source_handle?: string | null;
                    target_handle?: string | null;
                    workspace_id?: string;
                };
            };
        };
        Views: {};
        Functions: {};
        Enums: {};
    };
}
