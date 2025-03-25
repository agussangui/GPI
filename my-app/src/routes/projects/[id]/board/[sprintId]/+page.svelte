<script lang="ts">
	import DashboardLayout from "$lib/layouts/DashboardLayout.svelte";
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { getSprintById, getSprintStories, getCurrentSprints, getUpcomingSprints, getPastSprints } from '$services/projectService';
    import type { SprintClass } from '$models/sprint';
	import type { UserStoryClass } from "$models/userStory";
    import KanbanBoard from '$lib/components/projects/KanbanBoard.svelte';
    import { goto } from '$app/navigation';

    let error: Error | null = null;
    let loading = true;
    let projectId: string;
    let sprintId: string;
    let sprint: SprintClass | null = null;
    let stories: UserStoryClass[] | null = null;
    
    let currentSprints: SprintClass[] = [];
    let upcomingSprints: SprintClass[] = [];
    let pastSprints: SprintClass[] = [];

    $: if ($page.params) {
        const newProjectId = $page.params.id;
        const newSprintId = $page.params.sprintId;
        
        if (projectId !== newProjectId || sprintId !== newSprintId) {
            projectId = newProjectId;
            sprintId = newSprintId;
            
            if (projectId && sprintId) {
                loadSprintData();
            }
        }
    }

    async function loadSprintData() {
        loading = true;
        error = null;
        
        try {
            sprint = await getSprintById(projectId, sprintId);
            if (sprint) {
                stories = await getSprintStories(projectId, sprint.id);
            } else {
                error = new Error('Sprint not found');
            }
        } catch (err) {
            error = err as Error;
        } finally {
            loading = false;
        }
    }

    async function loadAllSprints() {
        try {
            [currentSprints, upcomingSprints, pastSprints] = await Promise.all([
                getCurrentSprints(projectId).then(sprints => sprints || []),
                getUpcomingSprints(projectId).then(sprints => sprints || []),
                getPastSprints(projectId).then(sprints => sprints || [])
            ]);
        } catch (err) {
            console.error("Error loading sprints:", err);
        }
    }

    onMount(async () => {
        await loadAllSprints();
    });
    
    function handleSprintSelect(event: Event) {
        const select = event.target as HTMLSelectElement;
        const selectedSprintId = select.value;

        if (selectedSprintId) {
            goto(`/projects/${projectId}/board/${selectedSprintId}`);
        } else {
            goto(`/projects/${projectId}/board`);
        }
    }
</script>

<DashboardLayout title="Board">
    {#if loading}
        <div class="flex justify-center items-center h-40">
            <span class="loading loading-spinner loading-lg"></span>
        </div>
    {:else if error}
        <div class="alert alert-error shadow-lg">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Error: {error.message}</span>
            </div>
        </div>
    {:else if !sprint}
        <div class="alert alert-warning shadow-lg">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <span>Sprint not found</span>
            </div>
        </div>
    {:else}
        <div class="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 class="text-xl font-semibold">
                    Sprint: {sprint.name}
                </h2>
                <p class="text-gray-600">
                    {new Date(sprint.start_date).toLocaleDateString()} - 
                    {new Date(sprint.end_date).toLocaleDateString()}
                </p>
            </div>
            
            <div class="min-w-[250px]">
                <label for="sprint-select" class="block text-sm font-medium text-gray-700">
                    Select Sprint
                </label>
                <select 
                    id="sprint-select" 
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    on:change={handleSprintSelect}
                    value={sprintId}
                >
                    {#if currentSprints.length > 0}
                        <optgroup label="Current Sprints">
                            {#each currentSprints as sprint}
                                <option value={sprint.id}>
                                    {sprint.name}
                                </option>
                            {/each}
                        </optgroup>
                    {/if}
                    
                    {#if upcomingSprints.length > 0}
                        <optgroup label="Upcoming Sprints">
                            {#each upcomingSprints as sprint}
                                <option value={sprint.id}>
                                    {sprint.name}
                                </option>
                            {/each}
                        </optgroup>
                    {/if}
                    
                    {#if pastSprints.length > 0}
                        <optgroup label="Past Sprints">
                            {#each pastSprints as sprint}
                                <option value={sprint.id}>
                                    {sprint.name}
                                </option>
                            {/each}
                        </optgroup>
                    {/if}
                </select>
            </div>
        </div>
        
        <KanbanBoard userStoryList={stories} />
    {/if}
</DashboardLayout> 