<script lang="ts">
    import { page } from '$app/state';
	import { deleteUpcomingSprint } from '$services/projectService';
    import AddSprintModal from "./addSprintModal.svelte";
    import ThreeDots from '../icons/ThreeDots.svelte';
    import Edit from '../icons/Edit.svelte';
    import Delete from '../icons/Delete.svelte';
	import EditSprintModal from './editSprintModal.svelte';
	import Sprint from '../icons/Sprint.svelte';
	import type { SprintClass } from '$models/sprint';
    
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

    async function handleDeleteUpcomingSprint(sprint: SprintClass) {
        
        const isConfirmed = window.confirm(`Are you sure you want to delete the sprint "${sprint.name}"?`);
        if (!isConfirmed) return;

        try {
            await deleteUpcomingSprint(sprint.id);
            window.location.reload()
        } catch(error) {
            console.log(error)
        }
        
    }

    let sprintToEdit: SprintClass | null = $state(null);
    let showEditModal = $state(false);
</script>

<AddSprintModal bind:showModal {projectId}/>
{#if showEditModal && sprintToEdit}
    <EditSprintModal bind:showEditModal bind:sprintToEdit/>
{/if}
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

            <!-- Botón de los tres puntos -->
        {#if showAddButton }
            <button popovertarget="popover-{sprint.id}" style="anchor-name:--anchor-{sprint.id}" 
                class="btn btn-circle btn-ghost p-2 w-9 h-9 text-gray-600 hover:bg-danger"
                onclick={(e) => e.stopPropagation()}>
                <ThreeDots />
            </button>

            <!-- Dropdown -->
            <ul class="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
                popover id="popover-{sprint.id}" style="position-anchor:--anchor-{sprint.id}">
                
                <li> 
                    <button onclick={(e) => { e.stopPropagation(); sprintToEdit=sprint; showEditModal=true; }} 
                        class="flex items-center gap-2">
                        <div class="w-4 h-4"><Edit /></div>
                        <span>Edit Sprint</span>
                    </button> 
                </li>

                <li>
                    <button onclick={(e) => { e.stopPropagation(); handleDeleteUpcomingSprint(sprint) }} 
                        class="flex items-center gap-2">
                        <div class="w-4 h-4"><Delete /></div>
                        <span>Delete Sprint</span>
                    </button> 
                </li>
            </ul>
        {/if}
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