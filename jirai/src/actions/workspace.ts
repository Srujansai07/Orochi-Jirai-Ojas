// Jirai - Workspace Server Actions
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface CreateWorkspaceInput {
    name: string;
    description?: string;
    type?: 'analysis' | 'workflow' | 'combined';
}

export async function createWorkspace(input: CreateWorkspaceInput) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Using any type until actual database schema is created
    const { data, error } = await (supabase as any)
        .from('workspaces')
        .insert({
            name: input.name,
            description: input.description || null,
            type: input.type || 'analysis',
            user_id: user.id,
        })
        .select()
        .single();

    if (error) throw error;

    revalidatePath('/');
    return data;
}

export async function getWorkspaces() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await (supabase as any)
        .from('workspaces')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function getWorkspaceWithNodes(workspaceId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: workspace, error: workspaceError } = await (supabase as any)
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .eq('user_id', user.id)
        .single();

    if (workspaceError || !workspace) return null;

    const { data: nodes } = await (supabase as any)
        .from('nodes')
        .select('*')
        .eq('workspace_id', workspaceId);

    const { data: edges } = await (supabase as any)
        .from('edges')
        .select('*')
        .eq('workspace_id', workspaceId);

    return {
        ...workspace,
        nodes: nodes || [],
        edges: edges || [],
    };
}

export async function saveWorkspace(
    workspaceId: string,
    nodes: any[],
    edges: any[],
    viewport: { x: number; y: number; zoom: number }
) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const db = supabase as any;

    // Update workspace viewport
    await db
        .from('workspaces')
        .update({
            viewport_x: viewport.x,
            viewport_y: viewport.y,
            viewport_zoom: viewport.zoom,
            updated_at: new Date().toISOString(),
        })
        .eq('id', workspaceId)
        .eq('user_id', user.id);

    // Delete existing nodes and edges
    await db.from('nodes').delete().eq('workspace_id', workspaceId);
    await db.from('edges').delete().eq('workspace_id', workspaceId);

    // Insert new nodes
    if (nodes.length > 0) {
        const nodeRecords = nodes.map((node) => ({
            id: node.id,
            type: node.type,
            label: node.data?.label || '',
            position_x: node.position.x,
            position_y: node.position.y,
            width: node.width || null,
            height: node.height || null,
            color: node.data?.color || null,
            data: node.data || {},
            workspace_id: workspaceId,
        }));

        await db.from('nodes').insert(nodeRecords);
    }

    // Insert new edges
    if (edges.length > 0) {
        const edgeRecords = edges.map((edge) => ({
            id: edge.id,
            source_id: edge.source,
            target_id: edge.target,
            source_handle: edge.sourceHandle || null,
            target_handle: edge.targetHandle || null,
            style: edge.type || 'smoothstep',
            animated: edge.animated || false,
            workspace_id: workspaceId,
        }));

        await db.from('edges').insert(edgeRecords);
    }

    revalidatePath('/');
    return { success: true };
}

export async function deleteWorkspace(workspaceId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { error } = await (supabase as any)
        .from('workspaces')
        .delete()
        .eq('id', workspaceId)
        .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/');
    return { success: true };
}
