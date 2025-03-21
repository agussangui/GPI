import { json, type RequestEvent } from '@sveltejs/kit';

export async function POST(event: RequestEvent) {
	try {
		// Get the user from locals instead of making a separate request
		const user = event.locals.user;

		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { name } = await event.request.json();

		if (!name) {
			return json({ error: 'Project name is required' }, { status: 400 });
		}

		
		const { data, error } = await event.locals.supabase
			.from('projects')
			.insert([{ user_id: user.id, name }])
			.select()
			.single();

		if (error) throw error;  

		return json({ project: data }, { status: 201 });

	} catch (err) {
		
		console.error('Error: ', err);  
		const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
		return json({ error: errorMessage }, { status: 500 });
	}
}
