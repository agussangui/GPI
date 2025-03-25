<script lang="ts">
    import DashboardLayout from '$lib/layouts/DashboardLayout.svelte';
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { getCurrentSprints, getUpcomingSprints, getPastSprints } from '$services/projectService';
    import type { SprintClass } from '$models/sprint';
    import SprintList from '$lib/components/sprint/sprintList.svelte';

    let error: Error | null = null;
    let loading = true;
    let projectId: string;
    
    let currentSprints: SprintClass[] = [];
    let upcomingSprints: SprintClass[] = [];
    let pastSprints: SprintClass[] = [];
    
    onMount(() => {
        if (page.params) {
            projectId = page.params.id;
        }
        
        Promise.all([
            getCurrentSprints(projectId).then(sprints => currentSprints = sprints || []),
            getUpcomingSprints(projectId).then(sprints => upcomingSprints = sprints || []),
            getPastSprints(projectId).then(sprints => pastSprints = sprints || [])
        ])
        .catch(err => error = err)
        .finally(() => loading = false);
    });
</script>

<DashboardLayout title={"Sprints"}>
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
        <div class="space-y-6">
            <SprintList 
                sprints={upcomingSprints} 
                title="Upcoming Sprints" 
                showAddButton={true}
            />
            
            <SprintList 
                sprints={currentSprints} 
                title="Current Sprints" 
                theme="light"
            />
            
            <SprintList 
                sprints={pastSprints} 
                title="Completed Sprints"
            />
        </div>
    {/if}
</DashboardLayout>
