import { json, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
    try {
        const project_id = event.params.id;
        if (!project_id) {
            return json({ error: 'Project ID is required' }, { status: 400 });
        }
        

        const { data, error } = await event.locals.supabase
        .from('user_roles')
        .select('user_id,user_name,role')
        .eq('project_id', project_id)
        
        if (error) {
            throw new Error(error.message);
        }

        return json({ members: data }, { status: 200 });

    } catch (error) {
        console.error('Error fetching projects:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}