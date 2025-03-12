<script>
    import UserStory from "./userStory.svelte";
    import AddUserStoryModal from "./addUserStoryModal.svelte";
    
    let {userStoryList, sprintId} = $props()
    let {showModal} = $state(false);
    
</script>

    <AddUserStoryModal bind:showModal sprintId={sprintId}/>

<ul class="list bg-base-100 rounded-box mb-10 {sprintId? "shadow-2xl -shadow-spread-2":"shadow-md"}" data-theme={ sprintId? 'light':'winter'}>
  
    <li class="p-4 pb-2 text-s opacity-60 tracking-wide font-bold">
        { sprintId? 'Sprint':'Backlog'} </li>
    {#each userStoryList as b }
        <UserStory data={b} />     
    {/each }
    <li class="m-2"><button class="btn btn-ghost btn-sm bg-info w-full"  onclick={()=>showModal = true}>
        Add new user story +</button></li>
</ul>

