import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';
import { supabase } from "$lib/supabaseClient";

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    if(data.draftid) {
      const { error } = await supabase
      .from('drafts')
      .delete()
      .eq("id", Number(data.draftid));

      if(error) {
        // return json("500: An error occurred");
        return json(error);
      } else {
        return json("200: Record deleted");
      }
    } else {
      return json("400: Bad Request");
    }
}