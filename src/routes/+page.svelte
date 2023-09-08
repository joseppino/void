<script lang="ts">
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";

  let posts: any[] = [];

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
    <div class="post-preview">
      <a href={`/posts/${post.id}`}>{post.title.substring(0,50)}...</a>
        {#if post.tags}
        <span class="tags">
          {#each post.tags as tag}
            <kbd class="tag">{'#' + tag.toLowerCase()}</kbd>
          {/each}
        </span>
        {/if}
      <span>{new Date(post.created_at).toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
    </div>
    <hr>
  {/each}
{/await}

<style>
  a {
    margin-right: 10px;
  }

  .post-preview {
    display: flex;
    flex-direction: row;
  }
</style>