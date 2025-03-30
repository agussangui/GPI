import { json, type RequestEvent } from '@sveltejs/kit';

export async function DELETE(event: RequestEvent) {
    const { params } = event;
    const project_id = params.project_id;
    const user_id = params.user_id;

    if (!project_id || !user_id) {
        return json({ error: 'Project ID and User ID are required' }, { status: 400 });
    }

    try {
        const { error } = await event.locals.supabase
            .from('invitations')
            .delete()
            .eq('project_id', project_id)
            .eq('user_id', user_id)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return json({ message: 'Invitation successfully deleted' }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}

