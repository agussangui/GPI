<script lang="ts">
	import type {UserStoryInterface} from "$models/userStory";
    import CloseBtn from "../icons/CloseBtn.svelte";
    import ErrorToast from "../alerts/errorToast.svelte";
    import { page } from '$app/state';
    import { error, type RequestEvent } from '@sveltejs/kit';
    import { onMount } from "svelte";
	import { UserStoryStatusEnum } from "$models/userStoryStatusEnum.ts";


    export let userStory
    export let showEditModal: boolean
      
    let newUserStory: UserStoryInterface;
    let errorToaster : boolean = false;
    let projectId: string;   

    async function submitForm(event: SubmitEvent) {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement; 
        const formData = new FormData(form); 

        const jsonData = {
            title: formData.get('title') as string,
            description: formData.get('description') || null,
            priority: Number(formData.get('priority')), 
            story_points: Number(formData.get('story_points')) || null, 
        };

        try {
        const response = await fetch('/api/user_stories', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData),
        });

        console.log(JSON.stringify(jsonData))
        const result = await response.json();
        console.log('🔄 Respuesta del servidor:', result);
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
        <input type="number" name="story_points" class="input validator" required placeholder={ userStory.story_points.toString()}/>
        <input type="number" name="priority" class="input validator" required placeholder={ userStory.priority.toString()}/>
        
      <div class="modal-action">
              
        <button class="btn" onclick={()=> showEditModal=false}>Add</button>
      </div>
      </form>
    </div>
  </div>

  {#if errorToaster}
    <ErrorToast title=error/>
  {/if}