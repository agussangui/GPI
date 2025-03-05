<script lang="ts">
    import UserIcon from "../icons/User.svelte";
    import Delete from "../icons/Delete.svelte";
    const {data} = $props()
    let isDeleted:boolean = $state(false);

    async function deleteUserStory(event: Event) {
      event.preventDefault();
      try {
        const response = await fetch('/api/user_stories/'+data.id, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        }); 

        } catch (error) {
          console.error('❌ Error :', error);
          return;
        } 
        isDeleted = true;
        
    }
</script>
{#if !isDeleted} 
<li class="list-row px-5">
        
      <div class="ml-5">
        <div>{data.title}</div>
      </div>
      <div class="badge badge-soft badge-primary mr-25">{data.getStatus()}</div>
      <div class="font-semibold">{data.story_points}</div>
      <div class="mr-5">{#if data.owners == null || data.owners.size == 0}<UserIcon />{ /if }</div>
      <!-- change popover-1 and --anchor-1 names. Use unique names for each dropdown -->
      <div>
        <button class="btn btn-circle btn-ghost pb-4" popovertarget="popover-1" style="anchor-name:--anchor-1" onclick={(e) => deleteUserStory(e)}>
            <Delete/>
        </button>
        
      </div>
</li>   
{/if}
    
