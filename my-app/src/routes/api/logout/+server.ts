import { json, type RequestEvent } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function POST() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return json({ error: error.message }, { status: 400 });
  }

  return json({ message: 'Logout successful' });
}
