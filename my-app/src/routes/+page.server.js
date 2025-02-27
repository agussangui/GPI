import { supabase } from '$lib/supabaseClient';

export async function load() {
  const { data, error } = await supabase.from('status').select('*');

  if (error) {
    console.error('Error fetching data:', error);
  }

  return {
    statusData: data || [],
  };  
}
