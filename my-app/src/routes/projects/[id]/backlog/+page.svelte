<script lang="ts">
	import DashboardLayout from '$lib/layouts/DashboardLayout.svelte';
  import { onMount } from 'svelte';
  import UserStoryList from '$lib/components/userStory/userStoryList.svelte';
  import { ProjectClass } from '$models/project';
  import { UserStoryClass } from '$models/userStory'
  import { page } from '$app/state';
	import type { SprintClass } from '$models/sprint';
  import { getCurrentSprint, getCurrentSprintStories, getCurrentSprintStoriesByProjectId } from '$services/projectService';

  let error: Error | null = null;
  let loading = true;
  let backlog: UserStoryClass[] = [];
  let projectId: string;
  let currentSprint: UserStoryClass[] = [];
  let sprintId: string | null = null;

  async function getBacklog(projectId: string) {

    try {
      const response = await fetch(`/api/projects/${projectId}/user_stories`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      backlog = UserStoryClass.getUserStoriesFromJson(await response.json());
      console.log('Fetched user stories:', backlog);
    } catch (err) {
      error = err instanceof Error ? err : new Error('An unknown error occurred');
    }
  }

  
  onMount(() => {
    if (page.params) {
            projectId = page.params.id;
        }
    getBacklog(projectId);
    getCurrentSprintStoriesByProjectId(projectId).then(us => currentSprint=us? us : []).catch(e => error=e).finally(() =>loading=false);
  });
</script>

<DashboardLayout title={"Backlog"}>
  {#if loading}
    <p>Loading..</p>
  {:else if error}
    <p style="color: red;">Error: {error.message}</p>
  {:else} 
    <UserStoryList userStoryList={currentSprint} isSprint={true}/>
    <UserStoryList userStoryList={backlog} isSprint={false}/>
  {/if}
</DashboardLayout>
