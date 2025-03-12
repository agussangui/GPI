import { json, type RequestEvent } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function POST(event: RequestEvent) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { project_id, name, start_date, end_date } = await event.request.json();
        if (!project_id || !name || !start_date || !end_date) {
            return json({ error: 'Project ID, name, start date, and end date are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('sprints')
            .insert([{ project_id, name, start_date, end_date }])
            .select()
            .single();

        if (error) throw error;

        return json({ project: data }, { status: 201 });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}


export async function GET(event: RequestEvent) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { project_id, date } = await event.request.json();
        if (!project_id) {
            return json({ error: 'Project ID is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('sprints')
            .select('*')
            .eq('project_id', project_id)
            .order('created_at', { ascending: true })
            .single();

        if (error) throw error;

        return json({ project: data }, { status: 201 });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}