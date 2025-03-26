<script lang="ts">
    import UserStory from "./userStory.svelte";
    import AddUserStoryModal from "./addUserStoryModal.svelte";
    import { get } from 'svelte/store';
    import { sprintStore } from "$stores/sprintStore";
	
    let { userStoryList, sprintId, addUserStoryToSprint, addUserStoryToBacklog, removeUserStory } = $props();
    let showModal: boolean = $state(false);
    
</script>

<AddUserStoryModal bind:showModal bind:userStoryList />

<div class="grid gap-6">
  <ul class="list bg-base-100 rounded-box shadow-md p-4" data-theme={sprintId === null ? 'winter' : 'light'}>
    {#if sprintId === null}
      <li class="text-center font-bold text-lg mb-4">Backlog</li>
      {:else}
        <div class="text-center">
          <h2 class="text-xl font-semibold ">
              Sprint: {$sprintStore.upcomingSprint?.name}
          </h2>
          <p class="text-gray-600">
              {$sprintStore.upcomingSprint?.getLocaleDateStr()}
          </p>
        </div>
    {/if}
    
    {#each userStoryList as userStory}
        <UserStory 
        userStory={userStory} 
        addUserStoryToSprint={addUserStoryToSprint}
        addUserStoryToBacklog={addUserStoryToBacklog}
        removeUserStory={removeUserStory}
        />
    {/each}
  
    {#if userStoryList?.length === 0}
      <li class="list-row text-center text-gray-400">
        No user stories
      </li>
    {/if}
  
    {#if sprintId === null}
      <li class="text-center mt-4">
        <button class="btn btn-ghost btn-sm bg-info w-full" onclick={() => showModal = true}>
          Add new user story +
        </button>
      </li>
    {/if}
  </ul>
</div>