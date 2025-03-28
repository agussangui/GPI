<script lang="ts">
    import { page } from '$app/state';
    import AddSprintModal from "./addSprintModal.svelte";
    
    let {sprints, title, theme = 'winter', showAddButton = false} = $props();
    let showModal = $state(false);
    let projectId = page.params.id;
    
    let sortedSprints = $derived([...sprints].sort((a, b) => {
        const aDate = new Date(a.start_date);
        const bDate = new Date(b.start_date);
        return bDate.getTime() - aDate.getTime();
    }));
    
    const formatDate = (dateString: string): string => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const navigateToSprint = (sprintId: string) => {
        const url = `/projects/${page.params.id}/board/${sprintId}`;
        window.location.href = url;
    };
</script>

<AddSprintModal bind:showModal {projectId}/>

<ul class="list bg-base-100 rounded-box mb-10 {theme === 'light' ? 'shadow-2xl -shadow-spread-2' : 'shadow-md'}" data-theme={theme}>
    <li class="p-4 pb-2 text-s opacity-60 tracking-wide font-bold">
        {title}
    </li>
    {#each sortedSprints as sprint }
        <li class="list-row p-3 hover:bg-base-200 flex justify-stretch cursor-pointer" 
            onclick={() => navigateToSprint(sprint.id)}
            onkeydown={(e) => e.key === 'Enter' && navigateToSprint(sprint.id)}
            role="button"
            tabindex="0">
            <div class="flex max-w-full w-full justify-between items-center">
                <div>
                    <h3 class="text-md font-semibold">{sprint.name}</h3>
                    <p class="text-xs opacity-70">
                        {formatDate(sprint.start_date)} - {formatDate(sprint.end_date)}
                    </p>
                </div>
            </div>
        </li>    
    {/each}
    {#if sortedSprints.length === 0}
        <li class="list-row">
            <span class="text-gray-400 text-sm m-auto">No sprints</span>
        </li> 
    {/if}
    {#if showAddButton}
        <li class="m-2">
            <button class="btn btn-ghost btn-sm bg-info w-full" onclick={() => showModal = true}>
                Add new sprint +
            </button>
        </li>
    {/if}
</ul> 