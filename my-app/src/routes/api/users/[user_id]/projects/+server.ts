import { json, type RequestEvent } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function GET(event: RequestEvent) {
    const { params } = event;
    const user_id = params.user_id;

    if (!user_id) {
        return json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('owner_id', user_id);

        if (error) {
            throw new Error(error.message);
        }

        return json({ projects: data }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return json({ error: errorMessage }, { status: 500 });
    }
}
