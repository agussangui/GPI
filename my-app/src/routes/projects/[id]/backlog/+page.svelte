<script lang="ts">
	import DashboardLayout from '$lib/layouts/DashboardLayout.svelte';
  import { onMount } from 'svelte';
  import UserStoryList from '$lib/components/userStory/userStoryList.svelte';
  import { UserStoryClass } from '../../../api/models/UserStory.ts';
  import { page } from '$app/state';

  let error: Error | null = null;
  let loading = true;
  let backlog: UserStoryClass[] = [];
  let projectId: string;

  async function getBacklog(projectId: string) {
    loading = true;
    error = null;

    try {
      const response = await fetch(`/api/projects/${projectId}/user_stories`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      backlog = UserStoryClass.getUserStoriesFromJson(await response.json());
      console.log('Fetched user stories:', backlog);
    } catch (err) {
      error = err instanceof Error ? err : new Error('An unknown error occurred');
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    if (page.params) {
            projectId = page.params.id;
        }
    getBacklog(projectId);
  });
</script>

<DashboardLayout title={"Backlog"}>
  {#if loading}
    <p>Loading..</p>
  {:else if error}
    <p style="color: red;">Error: {error.message}</p>
  {:else} 
    <UserStoryList backlog={backlog}/>
  {/if}
</DashboardLayout>
