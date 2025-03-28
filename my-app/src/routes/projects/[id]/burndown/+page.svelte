<script lang="ts">
    import DashboardLayout from "$lib/layouts/DashboardLayout.svelte";
    import { page } from '$app/stores';
    import { getCurrentSprint, getCurrentSprints, getUpcomingSprints, getPastSprints } from '$services/projectService';
    import type { SprintClass } from '$models/sprint';
    import { goto } from '$app/navigation';

    let projectId: string;
    let loading = true;
    let error: Error | null = null;
    
    let currentSprints: SprintClass[] = [];
    let upcomingSprints: SprintClass[] = [];
    let pastSprints: SprintClass[] = [];
    let currentSprint: SprintClass | null = null;

    $: if ($page.params) {
        projectId = $page.params.id;
        
        if (projectId) {
            loadSprintsAndRedirect();
        }
    }

    async function loadSprintsAndRedirect() {
        loading = true;
        error = null;
        
        try {
            currentSprint = await getCurrentSprint(projectId);
            
            if (currentSprint) {
                goto(`/projects/${projectId}/burndown/${currentSprint.id}`);
                return;
            }
            
            [currentSprints, upcomingSprints, pastSprints] = await Promise.all([
                getCurrentSprints(projectId).then(sprints => sprints || []),
                getUpcomingSprints(projectId).then(sprints => sprints || []),
                getPastSprints(projectId).then(sprints => sprints || [])
            ]);
            
            const allSprints = [...currentSprints, ...pastSprints, ...upcomingSprints];
            if (allSprints.length > 0) {
                goto(`/projects/${projectId}/burndown/${allSprints[0].id}`);
                return;
            }
        } catch (err) {
            error = err as Error;
            console.error("Error loading sprints:", err);
        } finally {
            loading = false;
        }
    }
    
    function selectSprint(sprint: SprintClass) {
        goto(`/projects/${projectId}/burndown/${sprint.id}`);
    }
</script>

<DashboardLayout title="Sprint Burndown">
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
    {:else}
        <div class="p-4">
            <h2 class="text-xl font-bold mb-6">Select a Sprint to View Burndown Chart</h2>
            
            {#if currentSprints.length + pastSprints.length + upcomingSprints.length === 0}
                <div class="alert alert-info shadow-lg">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>No sprints found for this project.</span>
                    </div>
                </div>
            {:else}
                <div class="space-y-8">
                    {#if currentSprints.length > 0}
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Current Sprints</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {#each currentSprints as sprint}
                                    <div 
                                        class="bg-blue-100 p-4 rounded-md shadow-md hover:shadow-lg cursor-pointer transition duration-200"
                                        on:click={() => selectSprint(sprint)}
                                    >
                                        <h4 class="font-bold">{sprint.name}</h4>
                                        <p class="text-sm text-gray-600">
                                            {new Date(sprint.start_date).toLocaleDateString()} - 
                                            {new Date(sprint.end_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}
                    
                    {#if pastSprints.length > 0}
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Past Sprints</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {#each pastSprints as sprint}
                                    <div 
                                        class="bg-gray-100 p-4 rounded-md shadow-md hover:shadow-lg cursor-pointer transition duration-200"
                                        on:click={() => selectSprint(sprint)}
                                    >
                                        <h4 class="font-bold">{sprint.name}</h4>
                                        <p class="text-sm text-gray-600">
                                            {new Date(sprint.start_date).toLocaleDateString()} - 
                                            {new Date(sprint.end_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}
                    
                    {#if upcomingSprints.length > 0}
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Upcoming Sprints</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {#each upcomingSprints as sprint}
                                    <div 
                                        class="bg-green-100 p-4 rounded-md shadow-md hover:shadow-lg cursor-pointer transition duration-200"
                                        on:click={() => selectSprint(sprint)}
                                    >
                                        <h4 class="font-bold">{sprint.name}</h4>
                                        <p class="text-sm text-gray-600">
                                            {new Date(sprint.start_date).toLocaleDateString()} - 
                                            {new Date(sprint.end_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    {/if}
</DashboardLayout> 