import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';
import { supabase } from "$lib/supabaseClient";

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  let response;
  if(body.id === "*") {
    response = await supabase
    .from('drafts')
    .select();
  } else {
    response = await supabase
    .from('drafts')
    .select()
    .eq("id", body.id);
  }
  
  if(response.data) {
    return json(response.data);
  }
  return json("500: Server error");
}