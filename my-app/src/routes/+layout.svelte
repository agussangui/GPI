<script>
  import "tailwindcss/tailwind.css";
  import "$lib/styles/global.css";
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { userStore } from '$stores/userStore';
  import { page } from '$app/state';

  // Get the session from the page data loaded by +layout.server.ts
  $: if (page.data.session) {
    console.log('page.data.session', page.data.session)
    userStore.set({
      authUser: page.data.session.user,
      session: page.data.session
    });
  }

</script>

<div class="m-10">
  <slot />
</div>
