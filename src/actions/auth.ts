// Jirai - Auth Server Actions
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/auth/login');
}

export async function getUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function getUserProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || '',
        avatar: user.user_metadata?.avatar_url || '',
    };
}
