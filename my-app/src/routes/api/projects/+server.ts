import { json, type RequestEvent } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function POST(event: RequestEvent) {
	try {
		const { data: { user }, error: authError } = await supabase.auth.getUser();
		if (authError || !user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { name } = await event.request.json();
		if (!name) {
			return json({ error: 'Project name is required' }, { status: 400 });
		}

		const { data, error } = await supabase
			.from('projects')
			.insert([{ owner_id: user.id, name }])
			.select()
			.single();

		if (error) throw error;

		return json({ project: data }, { status: 201 });
	} catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
		return json({ error: errorMessage }, { status: 500 });
    }
}
