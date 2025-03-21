import { json, type RequestEvent } from '@sveltejs/kit';

export async function POST(event: RequestEvent) {
    const { request } = event;
    const { email, password } = await request.json();

    // Use the server's Supabase client which properly handles cookies
    const { data, error } = await event.locals.supabase.auth.signInWithPassword({ 
        email, 
        password 
    });

    if (error) {
        return json({ error: error.message }, { status: 400 });
    }

    return json({ data });
}
