<script>
    import UserStory from "./userStory.svelte";
    import AddUserStoryModal from "./addUserStoryModal.svelte";
    
    let {userStoryList, sprintId, isSprint} = $props()
    let {showModal} = $state(false);
    
</script>

    <AddUserStoryModal bind:showModal/>

<ul class="list bg-base-100 rounded-box mb-10 {isSprint? "shadow-2xl -shadow-spread-2":"shadow-md"}" data-theme={ isSprint? 'light':'winter'}>
  
    <li class="p-4 pb-2 text-s opacity-60 tracking-wide font-bold">
        { isSprint? 'Sprint':'Backlog'} </li>
    {#each userStoryList as b }
        <UserStory data={b} />     
    {/each }
    {#if userStoryList.length === 0}
        <li class="list-row ">
        <span class="text-gray-400 text-sm m-auto">No user stories</span>
        </li> 
    {/if}
    {#if !isSprint }
        <li class="m-2"><button class="btn btn-ghost btn-sm bg-info w-full"  onclick={()=>showModal = true}>
        Add new user story +</button></li>
    {/if}
</ul>

