<script lang="ts">
    import DashboardLayout from "$lib/layouts/DashboardLayout.svelte";
    import { page } from '$app/stores';
    import { getSprintById, getSprintBurndownData, getCurrentSprints, getUpcomingSprints, getPastSprints } from '$services/projectService';
    import type { SprintClass } from '$models/sprint';
    import BurndownChart from '$lib/components/projects/BurndownChart.svelte';
    import { goto } from '$app/navigation';

    let projectId: string;
    let sprintId: string;
    let loading = true;
    let error: Error | null = null;
    let sprint: SprintClass | null = null;
    
    let burndownData: any = null;
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
                loadData();
            }
        }
    }

    async function loadData() {
        loading = true;
        error = null;
        
        try {
            [sprint, burndownData] = await Promise.all([
                getSprintById(projectId, sprintId),
                getSprintBurndownData(projectId, sprintId)
            ]);
            
            await loadAllSprints();
            
            if (!sprint) {
                error = new Error('Sprint not found');
            }
        } catch (err) {
            error = err as Error;
            console.error("Error loading data:", err);
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
    
    function handleSprintSelect(event: Event) {
        const select = event.target as HTMLSelectElement;
        const selectedSprintId = select.value;

        if (selectedSprintId) {
            goto(`/projects/${projectId}/burndown/${selectedSprintId}`);
        } else {
            goto(`/projects/${projectId}/burndown`);
        }
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
            
            <div class="min-w-[250px] px-2">
                <label for="sprint-select" class="block text-sm font-medium text-gray-700">
                    Select Sprint
                </label>
                <select data-theme="light"
                    id="sprint-select" 
                    class="select mt-1 block w-full text-base border-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-neutral-content"
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
        
        {#if burndownData}
            <div class="bg-white p-6 rounded-lg shadow-md mb-6">
                <BurndownChart 
                    idealBurndown={burndownData.ideal_burndown} 
                    actualBurndown={burndownData.actual_burndown}
                    dailyCompletedPoints={burndownData.daily_completed_points}
                    startDate={burndownData.start_date}
                    endDate={burndownData.end_date}
                    totalPoints={burndownData.total_points}
                />
            </div>
            
            {#if burndownData.actual_burndown.length > 0}
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-lg font-semibold mb-4">Metrics</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="bg-gray-100 p-4 rounded-md">
                            <h4 class="font-medium text-gray-700">Total Story Points</h4>
                            <p class="text-2xl font-bold">{burndownData.total_points}</p>
                        </div>
                        <div class="bg-gray-100 p-4 rounded-md">
                            <h4 class="font-medium text-gray-700">Completed Points</h4>
                            <p class="text-2xl font-bold">
                                {burndownData.total_points - burndownData.actual_burndown[burndownData.actual_burndown.length - 1].points}
                            </p>
                        </div>
                        <div class="bg-gray-100 p-4 rounded-md">
                            <h4 class="font-medium text-gray-700">Remaining Points</h4>
                            <p class="text-2xl font-bold">
                                {burndownData.actual_burndown[burndownData.actual_burndown.length - 1].points}
                            </p>
                        </div>
                    </div>
                </div>
            {/if}
        {:else}
            <div class="alert alert-info shadow-lg">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>No burndown data available for this sprint.</span>
                </div>
            </div>
        {/if}
    {/if}
</DashboardLayout> 