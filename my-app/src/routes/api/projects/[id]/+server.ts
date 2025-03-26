import { json, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
    const { params } = event;
    const id = params.id;

    if (!id) {
        return json({ error: 'Project ID is required' }, { status: 400 });
    }

    try {
        const { data, error } = await event.locals.supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return json({ project: data }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}

export async function PUT(event: RequestEvent) {
    const { request, params } = event;
    const id = params.id;

    if (!id) {
        return json({ error: 'Project ID is required' }, { status: 400 });
    }

    try {
        // Get session from locals instead of making a new request
        const { session } = event.locals;

        if (!session?.user) {
            return json({ error: 'Unauthorized: User is not logged in' }, { status: 401 });
        }

        const user = session.user;

        const { name } = await request.json();

        if (!name) {
            return json({ error: 'Project name is required' }, { status: 400 });
        }

        const { data, error } = await event.locals.supabase
            .from('projects')
            .update({ name })
            .eq('id', id)
            .eq('user_id', user.id)
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
        // Get session from locals instead of making a new request
        const { session } = event.locals;

        if (!session?.user) {
            return json({ error: 'Unauthorized: User is not logged in' }, { status: 401 });
        }

        const user = session.user;

        // Delete the project; RLS will ensure the user is the owner
        const { error } = await event.locals.supabase
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
