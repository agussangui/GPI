<script lang="ts">
	import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { getCurrentSprint } from '$services/projectService';
    import { goto } from '$app/navigation';
    import { get } from 'svelte/store';
    import { sprintStore } from "$stores/sprintStore";
	
    let projectId: string;
    let loading = true;
    const { currentSprint } = get(sprintStore);

    onMount(async () => {
        if ($page.params) {
            projectId = $page.params.id;
        }

        try {
            if (currentSprint) {
                goto(`/projects/${projectId}/board/${currentSprint.id}`);
            } else {
                goto(`/projects/${projectId}/sprints`);
            }
        } catch (err) {
            console.error("Error loading current sprint:", err);
            goto(`/projects/${projectId}/sprints`);
        }
    });
</script>

<div class="flex justify-center items-center h-screen">
    <span class="loading loading-spinner loading-lg"></span>
</div>
