<script lang="ts">
  import "tailwindcss/tailwind.css";
  import "$lib/styles/global.css";
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { userStore } from '$stores/userStore';

  onMount(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log(data)
      
      if (data?.session) {
        userStore.set({
          authUser: data.session.user,
          session: data.session
        });
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        userStore.set({
          authUser: session?.user || null,
          session: session || null
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  });
</script>

<div class="m-10">
  <slot />
</div>
