import { json, type RequestEvent } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET({ params }: RequestEvent) {
    const project_id = params.id;

    if (!project_id) {
        return json({ error: 'Project ID is required' }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from('sprints')
            .select('*')
            .eq('project_id', project_id)
            //.gte('start_date', Date.now())
            //.lte('end_date', Date )

        if (error) {
            throw new Error(error.message);
        }

        return json({ sprint: data }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}
