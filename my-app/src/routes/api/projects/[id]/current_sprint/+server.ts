import { json, type RequestEvent } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET({ params }: RequestEvent) {
    const project_id = params.id;

    if (!project_id) {
        return json({ error: 'Project ID is required' }, { status: 400 });
    }

    try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from('sprints')
            .select('id')
            .eq('project_id', project_id)
            .lte('start_date', now)
            .gte('end_date', now ).single()

        if (error) {
            throw new Error(error.message);
        }    
    
        return json({ sprint: data }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}
