<script lang="ts">
    import CloseBtn from "../icons/CloseBtn.svelte";
    import ErrorToast from "../alerts/errorToast.svelte";
    import { page } from '$app/state';
    import { onMount } from "svelte";

    export let showModal :boolean;
    let errorToaster : boolean = false;
    let projectId: string;   

    async function submitForm(event: SubmitEvent) {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement; 
      const formData = new FormData(form); 

      const jsonData = {
          project_id: projectId,
          email: formData.get('email') as string,
      };

      try {
          const response = await fetch('/api/invitations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(jsonData),
          });

          const result = await response.json();
          console.log('🔄 Respuesta del servidor:', result);

          if (!response.ok) {
              throw new Error(result.error || 'Something went wrong');
          }

          alert('Invitation sent successfully!');

      } catch (error) {
          errorToaster = true;
          console.error('❌ Error en la petición:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          alert(`Error: ${errorMessage}`);
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
          <h3 class="font-bold text-lg">Invite to project</h3> 
          <div onclick={()=> showModal=false}> <CloseBtn/></div>
        </div>
      

      <form id='form' class="fieldset" onsubmit={(e) => { submitForm(e); }}>
        <input type="text" name="email" class="input" required placeholder="User's email" />
        
      <div class="modal-action">
              
        <button class="btn" onclick={()=> showModal=false}>Invite</button>
      </div>
      </form>
    </div>
  </div>

  {#if errorToaster}
    <ErrorToast title=error/>
  {/if}