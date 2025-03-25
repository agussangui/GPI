<script lang="ts">
	import DashboardLayout from '$lib/layouts/DashboardLayout.svelte';
  import { onMount } from 'svelte';
  import UserStoryList from '$lib/components/userStory/userStoryList.svelte';
  import { UserStoryClass } from '$models/userStory'
  import { SprintClass } from '$models/sprint';
  import { page } from '$app/state';
  import { getBacklog, getSprintStories, getUpcomingSprints } from '$services/projectService';
  import { updateUserStoryOnSprint, updateUserStoryOffSprint, deleteUserStory } from '$services/userStoriesService';
	import { sprintStore } from '$stores/sprintStore';

  let error: Error | null = null;
  let loading = true;
  let projectId: string;
  let backlog: UserStoryClass[] | null = null;
  let upcomingSprints: SprintClass[] | null = [];
  let upcomingSprint: SprintClass | null = null;
  let sprintStories: UserStoryClass[] | null = null;
  
  onMount(async () => {
    if (page.params) {
        projectId = page.params.id;
    }

    try {
        backlog = await getBacklog(projectId);
        upcomingSprints = await getUpcomingSprints(projectId);
        if (upcomingSprints!=null && upcomingSprints.length > 0) {
            upcomingSprint = upcomingSprints[0];
            sprintStories = await getSprintStories(projectId, upcomingSprint.id);
            sprintStore.update((store) => ({
              ...store, 
              upcomingSprint: upcomingSprint
            }));
        }
    } catch (err) {
        error = err as Error;
    } finally {
        loading = false;
    }
  });

  async function addUserStoryToSprint(userStory: UserStoryClass) {
    try {
      const updatedUserStory = await updateUserStoryOnSprint(userStory.id, upcomingSprint!.id);
        
      if (!updatedUserStory) {
          throw new Error("Failed to retrieve updated user story from API");
      }
        
      sprintStories = sprintStories ? [...sprintStories, updatedUserStory] : [updatedUserStory];
      backlog = backlog!.filter(story => story.id !== userStory.id);
    } catch (error) {
      console.error("Failed to update user story:", error);
    }
  }

  async function addUserStoryToBacklog(userStory: UserStoryClass) {
    try {
      
      const updatedUserStory = await updateUserStoryOffSprint(userStory.id);
        
      if (!updatedUserStory) {
          throw new Error("Failed to retrieve updated user story from API");
      }
        
      backlog = backlog ? [...backlog, updatedUserStory] : [updatedUserStory];
      sprintStories = sprintStories!.filter(story => story.id !== userStory.id);
    } catch (error) {
      console.error("Failed to update user story:", error);
    }
  }
  
  async function removeUserStory(userStory: UserStoryClass) {
    try {
        const value = await deleteUserStory(userStory.id);
        if (value) {
          backlog = backlog!.filter(story => story.id !== userStory.id);
          sprintStories = sprintStories!.filter(story => story.id !== userStory.id);
        } else {
            console.error("Failed to delete user story:", error);
        }
    } catch (error) {
        console.error("Failed to delete user story:", error);
        return;
    }
  }
</script>

<DashboardLayout title={"Backlog"}>
  {#if loading}
    <div class="flex justify-center items-center h-40">
        <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else if error}
    <p style="color: red;">Error: {error.message}</p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="w-full">
        <UserStoryList userStoryList={backlog} sprintId={null} addUserStoryToSprint={addUserStoryToSprint} addUserStoryToBacklog={addUserStoryToBacklog} removeUserStory={removeUserStory}/>
      </div>
      <div class="w-full">
        <UserStoryList userStoryList={sprintStories} sprintId={upcomingSprint?.id} addUserStoryToSprint={addUserStoryToSprint} addUserStoryToBacklog={addUserStoryToBacklog} removeUserStory={removeUserStory}/>
      </div>
    </div>
  {/if}
</DashboardLayout>
