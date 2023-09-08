<script lang="ts">
  import { onMount } from "svelte";

  export let showDraftSelection: boolean = false;
  export let selectedDraftId: number | null = null;
  let drafts: any[] = [];

  async function fetchDrafts() {
    const response = await fetch('/api/fetch-draft', {
      method: 'POST',
      body: JSON.stringify({
        id: '*'
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
      console.log(resJson);
      drafts = resJson;
    }    
  }

  async function deleteDraft(id: number) {
    const response = await fetch('/api/delete-draft', {
      method: 'POST',
      body: JSON.stringify({
        draftid: id
      }),
      headers: {
        'content-type': 'application/json',
      }
    });

    const resJson = await response.json();
    // check status code
    if(!resJson.includes("200")) {
      console.log(resJson);
    } else {
      fetchDrafts();
    }  
  }

  onMount(() => {
    fetchDrafts();
  })
</script>

{#if showDraftSelection}
  <div class="dialog-background">
    <dialog open>
      <header>Drafts</header>
      <button on:click={fetchDrafts}>Refresh</button>
      <table>
        <thead>
          <th>Updated</th>
          <th>Title</th>
        </thead>
        <tbody>
          {#each drafts as draft}
            <tr>
              <td>{new Date(draft.created_at).toLocaleString("en-GB")}</td>
              <td>{draft.title.substring(0,15)}...</td>
              <div class="interactions">
                <a href="#" on:click={() => {
                  selectedDraftId = draft.id;
                  showDraftSelection = false;
                }}
                >Load</a>
                <a href="#" on:click={() => deleteDraft(draft.id)}>Delete</a>
              </div>
            </tr>
          {/each}
        </tbody>
      </table>
      <button on:click={() => showDraftSelection = false}>Close</button>
    </dialog>
  </div>
{/if}

<style>
  dialog {
    max-width: 300px;
  }

  .interactions {
    display: flex;
    flex-direction: column;
  }
</style>