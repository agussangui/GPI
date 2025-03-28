<script lang="ts">
    import DashboardLayout from '$lib/layouts/DashboardLayout.svelte';
    import {onMount} from 'svelte';
    import UserStoryList from '$lib/components/userStory/userStoryList.svelte';
    import {UserStoryClass} from '$models/userStory'
    import {SprintClass} from '$models/sprint';
    import {page} from '$app/stores';
    import {getBacklog, getSprintById, getSprintStories, getUpcomingSprints} from '$services/projectService';
    import {deleteUserStory, updateUserStoryOffSprint, updateUserStoryOnSprint} from '$services/userStoriesService';
    import {sprintStore} from '$stores/sprintStore';
    import {goto} from '$app/navigation';
    import {sortByPriority} from "$lib/util.ts";

    let error: Error | null = null;
  let loading = true;
  let projectId: string;
  let backlog: UserStoryClass[] | null = null;
  let upcomingSprints: SprintClass[] | null = [];
  let upcomingSprint: SprintClass | null = null;
  let upcomingSprintId: string = $page.params.sprintId || '';
  let sprintStories: UserStoryClass[] | null = null;
  
  onMount(async () => {
    if ($page.params) {
        projectId = $page.params.id;
    }
    await loadSprintData();
  });

  $: if ($page.params.sprintId && $page.params.sprintId !== upcomingSprintId) {
    loadSprintData();
  }

  async function loadSprintData() {
    try {
        backlog = await getBacklog(projectId);
        backlog = sortByPriority(backlog);
        upcomingSprints = await getUpcomingSprints(projectId);
        if (upcomingSprints!=null && upcomingSprints.length > 0) {
          upcomingSprintId = $page.params.sprintId? $page.params.sprintId: upcomingSprints[0].id
          upcomingSprint = upcomingSprintId? await getSprintById(projectId, upcomingSprintId): upcomingSprints[0];
            if ( upcomingSprint==null)
              throw new Error('Sprint couldn\'t be found');
            sprintStore.update((store) => ({
              ...store, 
              upcomingSprint: upcomingSprint
            }));
            sprintStories = await getSprintStories(projectId, upcomingSprintId);
            sprintStories = sortByPriority(sprintStories)
        }
    } catch (err) {
        error = err as Error;
    } finally {
        loading = false;
    }
  }
  async function addUserStoryToSprint(userStory: UserStoryClass) {
    try {
      const updatedUserStory = await updateUserStoryOnSprint(userStory.id, upcomingSprintId);
        
      if (!updatedUserStory) {
          throw new Error("Failed to retrieve updated user story from API");
      }
        
      sprintStories = sprintStories ? [...sprintStories, updatedUserStory] : [updatedUserStory];
      sprintStories = sortByPriority(sprintStories)
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
      backlog = sortByPriority(backlog)
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
  function handleSprintSelect(event: Event) {
        const select = event.target as HTMLSelectElement;
        const selectedSprintId = select.value;
        if (selectedSprintId) {
            goto(`/projects/${projectId}/backlog/${selectedSprintId}`);
        } else {
            goto(`/projects/${projectId}/backlog`);
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
    {#if upcomingSprints && upcomingSprints.length > 1}
      <div class="w-full  flex justify-end pb-5 -mt-12">
        <div class="flex w-1/2  items-center px-2"  data-theme="light">
            <label for="sprint-select" class="block text-sm font-medium text-gray-700 w-full">
                Select Upcoming Sprint:
            </label>
            <select 
                  id="sprint-select" 
                  class="select mt-1 block w-full text-base border-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-neutral-content select-sm"
                  on:change={handleSprintSelect}
                  value={upcomingSprintId} >
                      <optgroup label="Upcoming Sprints">
                          {#each upcomingSprints as sprint}
                              <option value={sprint.id}>
                                  {sprint.name}
                              </option>
                          {/each}
                      </optgroup>
            </select>
        </div>
      </div>
    {/if}
    <div class="flex gap-4">
      <div class="w-full">
        <UserStoryList userStoryList={backlog} sprintId={null} addUserStoryToSprint={addUserStoryToSprint} addUserStoryToBacklog={addUserStoryToBacklog} removeUserStory={removeUserStory}/>
      </div>
      {#if upcomingSprint}
        <div class="w-full">
          <UserStoryList userStoryList={sprintStories} sprintId={upcomingSprintId} addUserStoryToSprint={addUserStoryToSprint} addUserStoryToBacklog={addUserStoryToBacklog} removeUserStory={removeUserStory}/>
        </div>
        {/if}
    </div>
  {/if}
</DashboardLayout>
