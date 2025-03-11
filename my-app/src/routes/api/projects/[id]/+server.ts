import { json, type RequestEvent } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function PUT(event: RequestEvent) {
    const { request, params } = event;
    const id = params.id;

    if (!id) {
        return json({ error: 'Project ID is required' }, { status: 400 });
    }

    try {
        // Get the current session and user info
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
            return json({ error: 'Unauthorized: User is not logged in' }, { status: 401 });
        }

        const user = session.user;

        const { name } = await request.json();

        if (!name) {
            return json({ error: 'Project name is required' }, { status: 400 });
        }

        // Update the project; RLS will ensure the user is the owner
        const { data, error } = await supabase
            .from('projects')
            .update({ name })
            .eq('id', id)
            .eq('user_id', user.id)  // Ensures only the owner can update
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return json({ message: 'Project name updated successfully', project: data }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}

export async function DELETE(event: RequestEvent) {
    const { params } = event;
    const id = params.id;

    if (!id) {
        return json({ error: 'Project ID is required' }, { status: 400 });
    }

    try {
        // Get the current session and user info
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
            return json({ error: 'Unauthorized: User is not logged in' }, { status: 401 });
        }

        const user = session.user;

        // Delete the project; RLS will ensure the user is the owner
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);  // Ensures only the owner can delete

        if (error) {
            throw new Error(error.message);
        }

        return json({ message: 'Project deleted successfully' }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}
