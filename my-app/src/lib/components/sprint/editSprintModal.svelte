<script lang="ts">
	import {UserStoryClass} from "$models/userStory";
  import type { UserStoryInterface} from "$models/userStory";
    import CloseBtn from "../icons/CloseBtn.svelte";
    import ErrorToast from "../alerts/errorToast.svelte";
    import { page } from '$app/state';
    import { onMount } from "svelte";
    import { projectStore } from "$stores/projectStore";
	  import { get } from "svelte/store";
	import Sprint from "../icons/Sprint.svelte";
	import type { SprintClass } from "$models/sprint";
  import { sprintStore } from "$stores/sprintStore";

    let errorToaster : boolean = false;
    export let sprintToEdit: SprintClass
    export let showEditModal: boolean
    
    let name = sprintToEdit.name;
    let startDate = sprintToEdit.start_date;
    let endDate = sprintToEdit.end_date;

    let error: string | null = null;

  async function submitForm(event: Event) {
    event.preventDefault(); 
  
    const updatedFields: Record<string, any> = {};
    try {
      if (!name && !startDate && !endDate) {
            return;
      }
        if (new Date(startDate) >= new Date(endDate)) {
            error = 'End date must be after start date';
            return;
        }
        
        console.log ($sprintStore.currentSprint)
        if ($sprintStore.currentSprint && new Date(startDate) <= new Date($sprintStore.currentSprint.end_date)) {
            error = 'Sprint must be after current sprint';
            return;
        } 
        
        if (name !== sprintToEdit.name) updatedFields.name = name;
        if (startDate !== sprintToEdit.start_date) updatedFields.start_date = startDate;
        if (endDate !== sprintToEdit.end_date) updatedFields.end_date = endDate;
      } catch(error) {
        console.error('❌ Error in validation:', error);
        return
      }

        try {
          const response = await fetch('/api/sprints/'+sprintToEdit.id, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedFields),
          });

          if (!response.ok) {
              throw new Error('Failed to update user story');
          }
          const result = await response.json();
          sprintToEdit = sprintToEdit.copyWithUpdatedFields(updatedFields);
          
          showEditModal=false;
          window.location.reload();
        } catch (error) {
            errorToaster =true
            console.error('❌ Error en la petición:', error);
        }
    }

</script>


  <dialog id="add_sprint_modal" class="modal modal-bottom sm:modal-middle" class:modal-open={showEditModal}>
    <div class="modal-box" data-theme="light">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-lg">Edit sprint</h3> 
        <div onclick={()=> showEditModal=false}> <CloseBtn/></div>
      </div>
          
      <form onsubmit={submitForm} class="py-4 flex flex-col gap-4">
            <div class="form-control w-full">
                <label class="label" for="sprint-name">
                    <span class="label-text">Sprint Name</span>
                </label>
                <input 
                    id="sprint-name"
                    type="text" 
                    bind:value={name} 
                    class="input input-bordered w-full text-primary" 
                />
            </div>
            
            <div class="form-control w-full">
                <label class="label" for="start-date">
                    <span class="label-text">Start Date</span>
                </label>
                <input 
                    id="start-date"
                    type="date" 
                    bind:value={startDate} 
                    class="input input-bordered w-full" 
                />
            </div>
            
            <div class="form-control w-full">
                <label class="label" for="end-date">
                    <span class="label-text">End Date</span>
                </label>
                <input 
                    id="end-date"
                    type="date" 
                    bind:value={endDate} 
                    class="input input-bordered w-full" 
                />
            </div>
            
            {#if error}
                <div class="alert alert-error shadow-lg">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{error}</span>
                    </div>
                </div>
            {/if}
            
            <div class="modal-action">
              <button class="btn">Save</button>
            </div>
        </form>
    </div>
</dialog> 