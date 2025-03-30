<script lang="ts">
    import ProjectsLayout from "$lib/layouts/ProjectsLayout.svelte";
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { getSharedProjects } from "$services/userRoleService";
    import { userStore } from "$stores/userStore";
    import { get } from "svelte/store";
	import type { ProjectClass } from "$models/project";
    import { goto } from "$app/navigation";
    
    let error = $state<Error | null>(null);
    let loading = $state(true);
    let projects = $state<ProjectClass[] | null>(null);
    let projectId: string;

    onMount(async () => {
    const userId = get(userStore).authUser!.id;
    if (page.params) {
        projectId = page.params.id;
    }

    try {
        projects = await getSharedProjects(userId);
    } catch (err) {
        error = err as Error;
    } finally {
        loading = false;
    }
  });

  function openProjectDashboard(projectId: string) {
        goto(`/projects/${projectId}`);
    }

</script>
  
<style>
    .projects-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 16px;
        padding: 20px;
    }

    .project-card {
        position: relative;
        background: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease-in-out;
        cursor: pointer;
        width: 100%;
        text-align: left;
    }

    .project-card:hover,
    .project-card:focus-within {
        transform: scale(1.05);
        outline: none;
    }

    .project-title {
        font-size: 1.2rem;
        font-weight: bold;
    }
    
    .no-projects-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
        color: #6c757d;
        font-style: italic;
    }
</style>

<ProjectsLayout title="Shared Projects">
    {#if loading}
        <p>Loading...</p>
    {:else if error}
        <p style="color: red;">Error: {error.message}</p>
    {:else}
        <div class="projects-container">
            {#if projects != null && projects.length > 0}
                {#each projects as project}
                    <div
                        class="project-card"
                        onclick={() => openProjectDashboard(project.id)}
                        onkeydown={(event) => (event.key === 'Enter' || event.key === ' ') && openProjectDashboard(project.id)}
                        tabindex="0"
                        role="button"
                        aria-label={`Open ${project.name} project`}
                    >
                        <p class="project-title">{project.name}</p>
                        <p>{project.code}</p>
                    </div>
                {/each}
            {:else}
                <div class="no-projects-message">No projects found.</div>
            {/if}
        
        </div>
    {/if}
</ProjectsLayout>