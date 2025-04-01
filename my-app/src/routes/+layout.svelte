<script lang="ts">
  import "tailwindcss/tailwind.css";
  import "$lib/styles/global.css";
  import { onMount } from 'svelte';
  import { userStore } from '$stores/userStore';
  import { invalidate } from "$app/navigation";
  import { page } from '$app/stores';

  let { data, children } = $props()
  let { session, supabase } = $derived(data)

  onMount(() => {
    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, _session) => {
      // Only refresh the session if the session actually changed
      if (_session?.expires_at !== $page.data.session?.expires_at) {
        // This invalidation triggers a reload of the root layout data,
        // keeping the client in sync with the server
        invalidate('supabase:auth');
      }

      // Update the user store for app-wide reactivity
      userStore.set({
        authUser: _session?.user || null,
        session: _session || null
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  });
</script>

<div>
  <slot />
</div>
