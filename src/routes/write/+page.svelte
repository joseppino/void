<script lang='ts'>
  import { goto } from "$app/navigation";
  import Login from "$lib/components/Login.svelte";
  import { onMount } from "svelte";
  import checkAuth from "$lib/checkAuth";

  let postTitle: string;
  let postBody: string;
  let postImageUrl: string;
  let postTags: string[];
  let tagInputBox: HTMLInputElement;
  let showLoginDialog: boolean = false;

  // on page load, check session; i.n. show login dialog
  onMount(async () => {
    const sessionExists: boolean = await checkAuth();
    if(!sessionExists) {
      showLoginDialog = true;
    }
  });

  async function insertPost() {
    const response = await fetch('/api/create-post', {
      method: 'POST',
      body: JSON.stringify({
        title: postTitle,
        body: postBody,
        imageurl: postImageUrl,
        tags: postTags
      }),
      headers: {
        'content-type': 'application/json',
      }
    });

    // check status code
    if((await response.json()).includes("500")) {
      console.log("error");
    }
  }

  async function handlePostSubmission() {
    const sessionExists: boolean = await checkAuth();
    if(sessionExists) {
      if(postTitle && postBody) {
        insertPost();
        goto("/");
      } else {
        alert("Title and body are required fields.");
      }
    } else {
      showLoginDialog = true;
    }    
  }
</script>

<Login showDialog={showLoginDialog}/>
<h3>Write a new post...</h3>
<form action="/" method="POST" on:submit={e => e.preventDefault()}>
  <input type="text" name="title" id="title" placeholder="Post Title"
  bind:value={postTitle}>
  <a href="https://www.markdownguide.org/cheat-sheet/">Markdown Cheatsheet</a>
  <textarea name="" id="body" cols="70" rows="10" placeholder="Thoughts go here..."
  bind:value={postBody}/>
  <input type="text" name="image_url" id="imageUrl" placeholder="https://example.image.com"
  bind:value={postImageUrl}>
  <input type="text" name="tags" id="tags" placeholder="Tag A; Tag B; Tag C..."
  bind:this={tagInputBox}
  on:change={(e) => postTags = tagInputBox.value.replaceAll(" ", "").split(";")}>
  <button type="submit" on:click={handlePostSubmission}>Post</button>
</form>

<style>
  textarea {
    width: 100%;
    max-width: 100vw;
  }

  input {
    min-width: 250px;
  }
</style>