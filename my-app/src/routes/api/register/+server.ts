import { json, type RequestEvent } from '@sveltejs/kit';

export async function POST(event: RequestEvent) {
  const { request } = event;
  const { email, password } = await request.json();

  const supabase = event.locals.supabase;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return json({ error: error.message }, { status: 400 });
  }

  const name = email.split('@')[0];

  const { error: insertError } = await supabase
    .from('users')
    .insert([
      {
        id: data.user?.id,
        email,
        name,
        photo_url: null,
      }
    ]);

  if (insertError) {
    return json({ error: insertError.message }, { status: 500 });
  }

  return json({ data });
}
