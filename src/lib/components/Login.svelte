<script lang="ts">
  import { supabase } from "$lib/supabaseClient";

  export let showDialog: boolean = false;
  let email: string;
  let password: string;
  let detailsIncorrect: boolean = false;

  // signs in user with supabase auth
  // approach allows user to bypass login dialog, 
  // however no functions will work until logged in
  async function signIn() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if(error) {
      detailsIncorrect = true;
    } else {
      showDialog = false;
    }
  }
</script>

{#if showDialog}
  <div class="dialog-background">
    <dialog open>
      <header>Log In</header>
        {#if detailsIncorrect}
          <span>Incorrect login details</span>
        {/if}
      <form method="dialog" on:submit={e => e.preventDefault()}>
        <input type="email" name="email-input" id="email-input" placeholder="fred@example.com"
        bind:value={email}>
        <input type="password" name="password-input" id="password-input" placeholder="**********"
        bind:value={password}>
        <button type="submit" on:click={signIn}>Go</button>
      </form>
    </dialog>
  </div>
{/if}

<style>
  form {
    display: flex;
    flex-direction: column;
  }

  span {
    color: red;
  }

</style>