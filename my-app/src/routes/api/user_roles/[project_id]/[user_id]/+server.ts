import { json, type RequestEvent } from '@sveltejs/kit';

export async function PUT(event: RequestEvent) {
    const { request, params } = event;
    const project_id = params.project_id;
    const user_id = params.user_id;

    if (!project_id || !user_id) {
        return json({ error: 'Project ID and User ID are required' }, { status: 400 });
    }

    try {
        const { role } = await request.json();
        const updatedFields: Record<string, any> = {};

        updatedFields.role = `${role}`;

        if (!role) {
            return json({ error: 'Role is required' }, { status: 400 });
        }

        if (Object.keys(updatedFields).length === 0) {
            return json({ error: 'No valid fields to update' }, { status: 400 });
        }

        const { data, error } = await event.locals.supabase
            .from('user_roles')
            .update(updatedFields)
            .eq('project_id', project_id)
            .eq('user_id', user_id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return json({ message: 'User role updated successfully', user_role: data }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}