<script lang="ts">
  import Delete from "../icons/Delete.svelte";
  import Add from "../icons/Add.svelte";
  import Minus from "../icons/Minus.svelte";
  import { UserStoryStatusEnum } from "$models/userStoryStatusEnum";
  import { get } from 'svelte/store';
  import { sprintStore } from "$stores/sprintStore";
	import ThreeDots from "../icons/ThreeDots.svelte";
	import Edit from "../icons/Edit.svelte";
	import EditUserStoryModal from "./editUserStoryModal.svelte";
  import { projectStore } from "$stores/projectStore";
  let { userStory, addUserStoryToSprint, addUserStoryToBacklog, removeUserStory } = $props();

  let isDeleted: boolean = $state(false);
  const { upcomingSprint } = get(sprintStore);
  let showEditModal: boolean = $state(false);
  let {membersMap} = get(projectStore);
  //console.log(membersMap)
</script>

  <EditUserStoryModal bind:showEditModal bind:userStory />  

{#if !isDeleted}
  <li class="list-row flex items-center justify-between px-5 py-4 border-b border-gray-200 hover:bg-gray-50">
    <div class="flex items-center space-x-4">
      <div class="font-semibold">{userStory.title}</div>
      <div class="badge badge-soft badge-warning">{userStory.priority}</div>
      <div class="text-gray-600">{userStory.story_points} SP</div>
    </div>
    
    <div class="flex items-center space-x-2 ">
      {#if userStory.assigned_to}
      <div class="avatar-group -space-x-2.5 overflow-visible">
      {#each userStory.assigned_to.map((id: any) => membersMap.get(id)) as m}
        {#if m}
        <div class="tooltip-container">
          <div class="rounded-full w-8 h-8 flex items-center justify-center text-white"
          style="background-color: hsl({m.user_name.charCodeAt(0) * 10 % 360}, 70%, 50%)">
          {m.user_name[0].toUpperCase()+ m.user_name[1]?.toUpperCase()}
        </div>
          <div class="tooltip-text">{m.user_name}</div>
        </div>
        {/if}
      {/each}
    </div>
    {/if}
    
      
      
      {#if userStory.status_id == UserStoryStatusEnum.backlog}
        {#if upcomingSprint}
          <button class="btn btn-circle btn-ghost p-2 w-9 h-9 text-gray-600 hover:bg-info" onclick={() => addUserStoryToSprint(userStory)}>
            <Add/>
          </button>
          {/if}
      {:else}
        <button class="btn btn-circle btn-ghost p-2 w-9 h-9 text-gray-600 hover:bg-warning" onclick={() => addUserStoryToBacklog(userStory)}>
          <Minus/>
        </button>
      {/if }

      <button popovertarget="popover-{userStory.id}" style="anchor-name:--anchor-{userStory.id}" class="btn btn-circle btn-ghost p-2 w-9 h-9 text-gray-600 hover:bg-danger">
        <ThreeDots/>
      </button>
      <ul class="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
        popover id="popover-{userStory.id}" style="position-anchor:--anchor-{userStory.id}">
        <li> 
          <button onclick={(e) =>{ e.stopPropagation(); showEditModal = true; }} class="flex items-center gap-2">
            <div class="w-4 h-4"> <Edit /></div>
            <span>Edit</span>
          </button> 
        </li>
        <li>
          <span> 
            <button onclick={(e) => {e.stopPropagation(); removeUserStory(userStory)}} class="flex items-center gap-2">
              <div class="w-4 h-4"> <Delete /></div>
              <span>Delete</span>
            </button> 
          </span>          
        </li>
      </ul>
    </div>
  </li>
{/if}

<style>
  .tooltip-container {
    position: relative;
    display: inline-block;
  }

  .tooltip-text {
    visibility: hidden;
    background-color: rgba(0, 0, 0, 0.9);
    color: #fff;
    text-align: center;
    padding: 5px 8px;
    border-radius: 4px;
    position: absolute;
    bottom: 110%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    opacity: 0;
    font-size: 0.75rem;
  }

  .tooltip-container:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
</style>