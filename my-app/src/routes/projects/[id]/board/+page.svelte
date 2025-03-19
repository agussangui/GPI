<script lang="ts">
	import DashboardLayout from "$lib/layouts/DashboardLayout.svelte";
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { getCurrentSprint, getSprintStories } from '$services/projectService';
    import type { SprintClass } from '$models/sprint';
	import type { UserStoryClass } from "$models/userStory";
    import KanbanBoard from '$lib/components/projects/KanbanBoard.svelte';

    let error: Error | null = null;
    let loading = true;
    let projectId: string;
    let currentSprint: SprintClass | null = null;
    let currentStories: UserStoryClass[] | null = null;

    onMount(async () => {
        if (page.params) {
            projectId = page.params.id;
        }

        try {
            currentSprint = await getCurrentSprint(projectId);
            if (currentSprint) {
                currentStories = await getSprintStories(projectId, currentSprint.id);
            }
        } catch (err) {
            error = err as Error;
        } finally {
            loading = false;
        }
    });
</script>

<DashboardLayout title="Board">
    {#if loading}
        <div class="flex justify-center items-center h-40">
            <span class="loading loading-spinner loading-lg"></span>
        </div>
    {:else if error}
    <p style="color: red;">Error: {error.message}</p>
  {:else} 
    <KanbanBoard userStoryList={currentStories}/>
  {/if}
</DashboardLayout>
