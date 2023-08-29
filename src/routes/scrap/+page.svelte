<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";

  let posts: any[] = [];

  onMount(async () => {
    const { data } = await supabase
    .from("posts")
    .select();
    if(data) {
      posts = data;
    }
  });

  async function scrapPost(postId: number) {
    const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);
    window.location.reload();
  }
  
</script>

<table>
  <thead>
    <tr>
      <th>Post ID</th>
      <th>Post Title</th>
    </tr>
  </thead>
  <tbody>
    {#each posts as post}
      <tr>
        <td>{post.id}</td>
        <td>{post.title}</td>
        <td><button on:click={() => scrapPost(post.id)}>Delete</button></td>
      </tr>
    {/each}
  </tbody>
  
</table>