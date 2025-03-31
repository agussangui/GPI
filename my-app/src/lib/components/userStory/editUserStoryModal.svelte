<script lang="ts">
	import {UserStoryClass} from "$models/userStory";
  import type { UserStoryInterface} from "$models/userStory";
    import CloseBtn from "../icons/CloseBtn.svelte";
    import ErrorToast from "../alerts/errorToast.svelte";
    import { page } from '$app/state';
    import { error, type RequestEvent } from '@sveltejs/kit';
    import { onMount } from "svelte";
    import { projectStore } from "$stores/projectStore";
	  import { get } from "svelte/store";


    export let userStory: UserStoryClass
    export let showEditModal: boolean
      
    let newUserStory: UserStoryInterface;
    let errorToaster : boolean = false;
    let projectId: string;   

    let { membersMap } = get(projectStore);
    let selectedMembers: { user_id: string; user_name: string }[] = userStory.assigned_to.map(id => membersMap.get(id)) // Obtener el usuario del Map
    .map(member => ({ user_id: member!.user_id, user_name: member!.user_name }));

    function addMember(event: Event) {
      const target = event.target as HTMLSelectElement;
      const user_id = target.value;

      const user = membersMap.get(user_id);
      if (user && !selectedMembers.find(m => m.user_id === user.user_id)) {
        selectedMembers = [...selectedMembers, user];
    }
}


  function removeMember(user_id: string) {
    selectedMembers = selectedMembers.filter(m => m.user_id !== user_id);
  }

    async function submitForm(event: SubmitEvent) {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement; 
        const formData = new FormData(form); 

        const updatedFields: Record<string, any> = {};

        for (const [key, value] of formData.entries()) {
            if (value)
            updatedFields[key] = key === 'priority' || key === 'story_points' ? Number(value) : value;     
        }

        updatedFields.assigned_to = selectedMembers.map(m => m.user_id);

        try {
          const response = await fetch('/api/user_stories/'+userStory.id, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedFields),
          });

          if (!response.ok) {
              throw new Error('Failed to update user story');
          }
          const result = await response.json();
          userStory = userStory.copyWithUpdatedFields(updatedFields);
          console.log(userStory)
          
        } catch (error) {
            errorToaster =true
        console.error('❌ Error en la petición:', error);
        } finally {
          form.reset();
        }
    }

    onMount(()=>{
      if (page.params) {
            projectId = page.params.id;
        }
    })
</script>

<div class="modal" data-theme="light" class:modal-open={showEditModal}>
    <div class="modal-box text-neutral">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-bold text-lg ">Edit user story</h3> 
          <div class="" onclick={()=> showEditModal=false}> <CloseBtn/></div>
        </div>
      <form id='form' class="fieldset" onsubmit={(e) => { submitForm(e); }}>
        <input type="text" name="title" class="input" placeholder={userStory.title} />
        <input type="text" name="description" class="input" placeholder={userStory.description} />
        <input type="number" name="story_points" class="input validator" placeholder={ userStory.story_points.toString()} min="1"/>
        <input type="number" name="priority" class="input validator"  placeholder={ userStory.priority.toString()} min="1"/>

      <label class="block text-sm font-medium pt-7">Asign members:</label>
      <div class="relative">
        <select class="select select-bordered w-full" onchange={(e) => addMember(e)}>
          <option selected disabled>Select users...</option>
          {#each Array.from(membersMap.entries()) as [id, member]}
            <option value={id}>{member.user_name}</option>
          {/each}
        </select>
      </div>

      <div class="flex flex-wrap gap-2 mt-2">
        {#each selectedMembers as member}
          <div class="badge badge-soft badge-neutral flex items-center gap-1">
            {member.user_name}
            <button type="button" class="ml-1 text-white hover:text-gray-300" onclick={() => removeMember(member.user_id)}>✕</button>
          </div>
        {/each}
      </div>

        
`        <div class="modal-action">
            <button class="btn" onclick={()=> showEditModal=false}>Save</button>
        </div>
      </form>
    </div>
  </div>

  {#if errorToaster}
    <ErrorToast title=error/>
  {/if}