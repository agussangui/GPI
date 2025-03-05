import { json, type RequestEvent } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET(project_id: string) {

    if (!project_id) {
        return json({ error: 'Project ID is required' }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from('user_stories')
            .select('*')
            .eq('project_id', project_id);

        if (error) {
            throw new Error(error.message);
        }

        return json({ user_stories: data }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}