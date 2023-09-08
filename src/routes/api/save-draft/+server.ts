import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';
import { supabase } from "$lib/supabaseClient";

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  let response;
  if(data.draftid) {
    response = await supabase
    .from('drafts')
    .update({ // UPDATE DRAFT ENTRY IF ALREADY EXISTS
      created_at: new Date().toISOString(),
      title: data.title,
      body: data.body,
      imageurl: data.postImageUrl,
      tags: data.postTags
    })
    .eq("id", Number(data.draftid));
  } else { // INSERT NEW ENTRY OTHERWISE
    response = await supabase
    .from("drafts")
    .insert({
      title: data.title,
      body: data.body,
      imageurl: data.postImageUrl,
      tags: data.postTags
    });
  }
  if(response.error) {
    return json("500: Server error");
  }
  return json("200: Draft successfully created");
}