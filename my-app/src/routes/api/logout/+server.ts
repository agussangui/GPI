import { json, type RequestEvent } from '@sveltejs/kit';

export async function POST(event: RequestEvent) {
  // Use the server's Supabase client that properly handles cookies
  const { error } = await event.locals.supabase.auth.signOut();

  if (error) {
    return json({ error: error.message }, { status: 400 });
  }

  return json({ message: 'Logout successful' });
}
