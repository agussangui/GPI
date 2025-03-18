<script>
  import "tailwindcss/tailwind.css";
  import "$lib/styles/global.css";
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { userStore } from '$stores/userStore';

  onMount(() => {
    // Check if user is already logged in by retrieving session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log(data)
      
      if (data?.session) {
        // If session exists, update the user store
        userStore.set({
          authUser: data.session.user,
          session: data.session
        });
      }
    };
    
    checkSession();

    // Set up auth state listener for future auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        userStore.set({
          authUser: session?.user || null,
          session: session || null
        });
      }
    );

    // Clean up subscription when component is destroyed
    return () => {
      subscription.unsubscribe();
    };
  });
</script>

<div class="m-10">
  <slot />
</div>
