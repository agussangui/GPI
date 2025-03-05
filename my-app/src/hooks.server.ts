import type { Handle } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const handle: Handle = async ({ event, resolve }) => {
  // Get the user's session
  const session = await supabase.auth.getSession();
  
  // List of paths that require authentication
  const protectedPaths = ['/backlog', '/board', '/insights', '/profile', '/timeline', '/projects'];

  // Check if the current path is protected and if the user is not logged in
  if (protectedPaths.includes(event.url.pathname) && !session.data.session) {
    return new Response('Redirect', {
      status: 303,
      headers: { Location: '/login' },
    });
  }

  return resolve(event);
};
