<script lang="ts">
	import type {UserStoryInterface} from "../../../routes/api/models/UserStory.ts";
    import { POST } from "../../../routes/api/user_stories/+server.ts";
    import CloseBtn from "../icons/CloseBtn.svelte";
    import ErrorToast from "../alerts/errorToast.svelte";

    export let showModal :boolean;
    let newUserStory: UserStoryInterface;
    let errorToaster : boolean = false;

    import { error, type RequestEvent } from '@sveltejs/kit';

    async function submitForm(event: SubmitEvent) {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement; // ✅ Usa `currentTarget` 
        const formData = new FormData(form); // ✅ Ahora formData funciona correctamente

        const jsonData = {
            project_id: formData.get('project_id') as string, // 👈 Asegura que sea string
            sprint_id: formData.get('sprint_id') || null, // 👈 Si no existe, asigna null
            title: formData.get('title') as string,
            description: formData.get('description') || null,
            priority: Number(formData.get('priority')), // 👈 Convierte a número
            story_points: Number(formData.get('story_points')) || null, // 👈 Convierte a número
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
    }
</script>

<div class="modal" data-theme="light" class:modal-open={showModal}>
    <div class="modal-box">
        
        <div onclick={()=> showModal=false}> <CloseBtn/></div>
        <h3 class="font-bold text-lg">Add new user story</h3> 

      <form id='form' class="fieldset" onsubmit={(e) => { submitForm(e); }}>
        <input type="text" name="title" class="input" placeholder="Title" />
        <input type="text" name="description" class="input" placeholder="Description" />
        <input type="number" name="story_points" class="input validator" required placeholder="Strory points"/>
        <input type="number" name="priority" class="input validator" required placeholder="Priority"/>
        <input name="project_id" value="d659910f-919e-4068-bbeb-45fd3915ce5b" type="hidden" />
        
      <div class="modal-action">
              <!-- 🔵 set false on click -->
        <button class="btn" onclick={()=> showModal=false}>Add</button>
      </div>
      </form>
    </div>
  </div>

  {#if errorToaster}
    <ErrorToast title=error/>
  {/if}