import { json, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
    const project_id = event.params.id;

    if (!project_id) {
        return json({ error: 'Project ID is required' }, { status: 400 });
    }

    try {
        const { data, error } = await event.locals.supabase
            .from('sprints')
            .select('*')
            .eq('project_id', project_id)
            .order('created_at', { ascending: true });

        if (error) {
            throw new Error(error.message);
        }

        return json({ user_stories: data }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}
