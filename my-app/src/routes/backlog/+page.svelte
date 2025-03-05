<script lang="ts">
	import DashboardLayout from '$lib/layouts/DashboardLayout.svelte';
  import { onMount } from 'svelte';
  import UserStoryList from '$lib/components/user story/user_story_list.svelte';
  import { GET } from '../api/projects/[id]/user_stories/+server.ts';
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
    loading = true;
    getBacklog();
  });
</script>


<DashboardLayout title={"Backlog"}>
  
  {#if loading}
    <p>Loading..</p>
  {:else if error}
    <p style="color: red;">Błąd: {error.message}</p>
  {:else} 
    <UserStoryList backlog={backlog}/>
  {/if}
</DashboardLayout>
