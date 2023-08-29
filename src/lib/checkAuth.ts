import { supabase } from "$lib/supabaseClient";

export default async function() {
  const { data, error } = await supabase.auth.getSession();
    if(data.session) {
      return true;
    }
    return false;
}