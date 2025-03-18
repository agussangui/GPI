import type { LayoutServerLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: LayoutServerLoad = async ({ request }) => {
  const { data } = await supabase.auth.getSession();
  
  return {
    session: data.session
  };
}; 