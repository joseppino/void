<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { marked } from "marked";

  export let data: PageData;

  let post: any;

  $: console.log(post);
  
  onMount(() => {
    fetchPost(Number(data.postId));
  })

  async function fetchPost(postId: number) {
    const res = await supabase
    .from("posts")
    .select()
    .eq("id", postId);
    if(res.data) {
      console.log(res.data);
      post = res.data[0];
    }
  }
  
</script>

{#if post}
  {#if post.imageurl}
    <img src={post.imageurl} alt="">
  {/if}
  <h2>{post.title}</h2>
  <p>{@html marked.parse(post.body)}</p>

{/if}

<style>
  img {
    max-width: 100px;
  }
</style>