import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';
import { supabase } from "$lib/supabaseClient";

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const { error } = await supabase
    .from('posts')
    .insert({
      title: data.title,
      body: data.body,
      imageurl: data.postImageUrl,
      tags: data.postTags
    });
  if(error) {
    return json("500: Server error");
  }
  return json("200: Post successfully created");
}