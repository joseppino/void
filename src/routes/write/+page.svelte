<script lang='ts'>
  import { goto } from "$app/navigation";
  import Login from "$lib/components/Login.svelte";
  import DraftSelection from "$lib/components/DraftSelection.svelte";
  import { onMount } from "svelte";
  import checkAuth from "$lib/checkAuth";

  let draftId: number;
  let postTitle: string;
  let postBody: string;
  let postImageUrl: string;
  let postTags: string[];
  let tagInputBox: HTMLInputElement;
  let showLoginDialog: boolean = false;
  let showDraftSelection: boolean = false;

  // on page load, check session; i.n. show login dialog
  onMount(async () => {
    const sessionExists: boolean = await checkAuth();
    if(!sessionExists) {
      showLoginDialog = true;
    }
  });

  $: if(draftId) {
    loadDraft();
  }

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

  async function saveDraft() {
    const response = await fetch('/api/save-draft', {
      method: 'POST',
      body: JSON.stringify({
        draftid: draftId, 
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

  async function loadDraft() {
    const response = await fetch('/api/fetch-draft', {
      method: 'POST',
      body: JSON.stringify({
        id: draftId
      }),
      headers: {
        'content-type': 'application/json',
      }
    });

    const resJson = await response.json();
    // check status code
    if(resJson.includes("500")) {
      console.log("error");
    } else {
      const fields = resJson[0];
      updateFields(fields.title, fields.body, fields.imageurl, fields.tags);
    }
  }

  function updateFields(title: string, body: string, imgurl: string, tags: string[]) {    
    postTitle = title;
    postBody = body;
    postImageUrl = imgurl;
    let tagString = "";
    if(tags) {
      tags.forEach(tag => {
        tagString += `${tag};`;
      });
    }
    tagInputBox.value = tagString;
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

  async function handleDraftSave() {
    const sessionExists: boolean = await checkAuth();
    if(sessionExists) {
      if(postTitle && postBody) {
        saveDraft();
        alert("Draft Saved");
      } else {
        alert("Title and body are required fields.");
      }
    } else {
      showLoginDialog = true;
    }    
  }

  async function handleDraftLoad() {
    const sessionExists: boolean = await checkAuth();
    if(sessionExists) {
      showDraftSelection = true;
    } else {
      showLoginDialog = true;
    }
  }
</script>

<Login showDialog={showLoginDialog}/>
<DraftSelection bind:showDraftSelection={showDraftSelection} bind:selectedDraftId={draftId}/>
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
  <button type="submit" on:click={handleDraftLoad}>Load Draft</button>
  <button type="submit" on:click={handleDraftSave}>Save Draft</button>
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