<script lang="ts">
    import { onMount } from 'svelte';
    import ProjectsLayout from "$lib/layouts/ProjectsLayout.svelte";
    import { ProjectClass } from '$models/project';
    import { goto } from '$app/navigation';
    import { userStore } from '$stores/userStore';

    let error: Error | null = null;
    let projects: ProjectClass[] = [];
    let loading = true;
    let userId: string | null = $userStore.authUser?.id ?? null;

    async function getProjects() {
        if (!userId) {
            console.error("User ID is missing!");
            return;
        }

        try {
            loading = true;
            error = null;

            const response = await fetch(`/api/users/${userId}/projects`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            projects = ProjectClass.getProjectsFromJson(await response.json());
            console.log('Fetched projects:', projects);
        } catch (err) {
            error = err instanceof Error ? err : new Error('An unknown error occurred');
        } finally {
            loading = false;
        }
    }

    function openProjectDashboard(projectId: string) {
        goto(`/projects/${projectId}/backlog`);
    }

    onMount( () => {
        userId = $userStore.authUser?.id ?? null;
        getProjects();
    });
</script>

<style>
    .projects-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 16px;
        padding: 20px;
    }

    .project-card {
        background: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease-in-out;
        cursor: pointer;
        width: 100%;
        text-align: left;
        border: none;
    }

    .project-card:hover,
    .project-card:focus {
        transform: scale(1.05);
        outline: none;
    }

    .project-title {
        font-size: 1.2rem;
        font-weight: bold;
    }
</style>

<ProjectsLayout title="Projects">
    {#if loading}
        <p>Loading...</p>
    {:else if error}
        <p style="color: red;">Error: {error.message}</p>
    {:else if projects.length > 0}
        <div class="projects-container">
            {#each projects as project}
                <button
                    class="project-card"
                    on:click={() => openProjectDashboard(project.id)}
                    on:keydown={(event) => (event.key === 'Enter' || event.key === ' ') && openProjectDashboard(project.id)}
                    aria-label={`Open ${project.name} project`}
                >
                    <p class="project-title">{project.name}</p>
                    <p>{project.code}</p>
                </button>
            {/each}
        </div>
    {:else}
        <p>No projects found.</p>
    {/if}
</ProjectsLayout>
