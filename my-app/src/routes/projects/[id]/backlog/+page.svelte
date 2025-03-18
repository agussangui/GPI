<script lang="ts">
	import DashboardLayout from '$lib/layouts/DashboardLayout.svelte';
  import { onMount } from 'svelte';
  import UserStoryList from '$lib/components/userStory/userStoryList.svelte';
  import { UserStoryClass } from '$models/userStory'
  import { page } from '$app/state';
  import { getBacklog, getUpcomingSprints, getSprintStories } from '$services/projectService';
	import type { SprintClass } from '$models/sprint';
	import { sprintStore } from '$stores/sprintStore';

  let error: Error | null = null;
  let loading = true;
  let backlog: UserStoryClass[] = [];
  let projectId: string;
  let currentSprint: UserStoryClass[] = [];
  let sprintId: string | null = null;
  let sprints: SprintClass[] = [];
  
  onMount(() => {
    if (page.params) {
        projectId = page.params.id;
    }
    getBacklog(projectId).then(bk => backlog=bk? bk : []).catch(e => error=e)
    getUpcomingSprints(projectId).then(
        s => {sprints=s? s : [];
        if (sprints.length > 0) {
          sprintStore.set({currentSprintIdBacklogPage: sprints[0]})
          getSprintStories(projectId,sprints[0].id)
              .then( us => {  currentSprint=us? us : [];
                              sprintId = (currentSprint.length > 0)? currentSprint[0].sprint_id : "hola";
                            });
        }
    }).catch(e => error=e).finally(() =>loading=false);
    
  });
</script>

<DashboardLayout title={"Backlog"}>
  {#if loading}
    <p>Loading..</p>
  {:else if error}
    <p style="color: red;">Error: {error.message}</p>
  {:else} 
    <UserStoryList userStoryList={currentSprint} sprintId={sprintId} isSprint={true}/>
    <UserStoryList userStoryList={backlog} sprintId={null} isSprint={false}/>
  {/if}
</DashboardLayout>
