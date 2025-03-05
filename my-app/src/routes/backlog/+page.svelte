<script lang="ts">
	import DashboardLayout from '$lib/layouts/DashboardLayout.svelte';
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import UserStoryList from '$lib/components/user story/user_story_list.svelte';
  import { GET } from '../api/projects/[id]/user_stories/+server.ts';
  import type { UserStoryInterface } from '../api/models/UserStory.ts';
  import type { RequestEvent } from '@sveltejs/kit';
	import UserStory from '$lib/components/user story/user_story.svelte';
  import { UserStoryClass } from '../api/models/UserStory.ts';

  let error: Error | null = null;
  let loading = true;
  var backlog: UserStoryClass[] ;


  async function getBacklog() {
    const response = await GET("d659910f-919e-4068-bbeb-45fd3915ce5b");
    backlog = UserStoryClass.getUserStoriesFromJson( await response.json()  ); 
    console.log(backlog)
    loading = false;
  }

  onMount(() => {
    getBacklog();
  });
</script>


<DashboardLayout title={"Backlog"}>
  

<UserStoryList backlog={backlog}/>

  {#if loading}
    <p>Loading..</p>
  {:else if error}
    <p style="color: red;">Błąd: {error.message}</p>
  {:else if data}
    <pre>{JSON.stringify(data, null, 2)}</pre>
  {/if}
</DashboardLayout>
