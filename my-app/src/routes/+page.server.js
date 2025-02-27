import { supabase } from "$lib/supabaseClient";

export async function load() {
  const { data } = await supabase.from("status").select();
  return {
    statuses: data ?? [],
  };
}
