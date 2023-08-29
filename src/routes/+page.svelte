<script lang="ts">
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";

  let posts: any[] = [];
  const dateFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

  onMount(async () => {
    const { data } = await supabase
    .from("posts")
    .select();
    if(data) {
      posts = data.reverse();
    }
  });
</script>

<h2>Peppino's Void</h2>
{#await posts}
  <p>Loading posts...</p>
{:then posts}
  {#each posts as post}
    <a href={`/posts/${post.id}`}>{post.title.substring(0,50)}...</a>
    <span>{new Date(post.created_at).toLocaleDateString("en-GB", dateFormatOptions)}</span>
    <hr>
  {/each}
{/await}

<style>
</style>