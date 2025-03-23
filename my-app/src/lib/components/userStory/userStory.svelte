<script lang="ts">
  import UserIcon from "../icons/User.svelte";
  import Delete from "../icons/Delete.svelte";
  import Add from "../icons/Add.svelte";
  import Minus from "../icons/Minus.svelte";
  import { UserStoryStatusEnum } from "$models/userStoryStatusEnum";
  import { get } from 'svelte/store';
  import { sprintStore } from "$stores/sprintStore";
  let { userStory, addUserStoryToSprint, addUserStoryToBacklog, removeUserStory } = $props();

  let isDeleted: boolean = $state(false);
  const { upcomingSprint } = get(sprintStore);
  
</script>

{#if !isDeleted}
  <li class="list-row flex items-center justify-between px-5 py-4 border-b border-gray-200 hover:bg-gray-50">
    <div class="flex items-center space-x-4">
      <div class="font-semibold">{userStory.title}</div>
      <div class="badge badge-soft badge-primary">{userStory.getStatus()}</div>
      <div class="text-gray-600">{userStory.story_points} SP</div>
    </div>
    
    <div class="flex items-center space-x-2">
      {#if !userStory.owners?.size}
        <UserIcon/>
      {/if}
      
      {#if userStory.status_id == UserStoryStatusEnum.backlog}
        {#if upcomingSprint}
          <button class="btn btn-circle btn-ghost p-2 text-gray-600 hover:bg-info" onclick={() => addUserStoryToSprint(userStory)}>
            <Add/>
          </button>
          {/if}
      {:else}
        <button class="btn btn-circle btn-ghost p-2 text-gray-600 hover:bg-warning" onclick={() => addUserStoryToBacklog(userStory)}>
          <Minus/>
        </button>
      {/if }

      <button class="btn btn-circle btn-ghost p-2 text-gray-600 hover:bg-danger" onclick={() => removeUserStory(userStory)}>
        <Delete/>
      </button>
    </div>
  </li>
{/if}

