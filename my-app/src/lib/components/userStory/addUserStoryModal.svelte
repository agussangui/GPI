<script lang="ts">
	import type {UserStoryInterface} from "$models/userStory";
    import CloseBtn from "../icons/CloseBtn.svelte";
    import ErrorToast from "../alerts/errorToast.svelte";
    import { page } from '$app/state';
    import { error, type RequestEvent } from '@sveltejs/kit';
    import { onMount } from "svelte";
	import { UserStoryStatusEnum } from "$models/userStoryStatusEnum.ts";

    export let showModal :boolean;
    let newUserStory: UserStoryInterface;
    let errorToaster : boolean = false;
    let projectId: string;   

    async function submitForm(event: SubmitEvent) {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement; 
        const formData = new FormData(form); 

        const jsonData = {
            project_id: projectId,
            title: formData.get('title') as string,
            description: formData.get('description') || null,
            priority: Number(formData.get('priority')), 
            status_id: UserStoryStatusEnum.backlog,
            story_points: Number(formData.get('story_points')) || null, 
        };
        
      try {
        const response = await fetch('/api/user_stories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData),
        });

        console.log(JSON.stringify(jsonData))
        const result = await response.json();
        console.log('🔄 Respuesta del servidor:', result);
        } catch (error) {
            errorToaster =true
            console.error('❌ Error en la petición:', error);  
        }   
        form.reset();
      }

    onMount(()=>{
      if (page.params) {
            projectId = page.params.id;
        }
    })
</script>

<div class="modal" data-theme="light" class:modal-open={showModal}>
    <div class="modal-box">

      
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-bold text-lg">Add new user story</h3> 
          <div onclick={()=> showModal=false}> <CloseBtn/></div>
        </div>
      

      <form id='form' class="fieldset" onsubmit={(e) => { submitForm(e); }}>
        <input type="text" name="title" class="input" placeholder="Title" />
        <input type="text" name="description" class="input" placeholder="Description" />
        <input type="number" name="story_points" class="input validator" required placeholder="Strory points"/>
        <input type="number" name="priority" class="input validator" required placeholder="Priority"/>
        
      <div class="modal-action">
              
        <button class="btn" onclick={()=> showModal=false}>Add</button>
      </div>
      </form>
    </div>
  </div>

  {#if errorToaster}
    <ErrorToast title=error/>
  {/if}