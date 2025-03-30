<script lang="ts">
    import { onMount } from 'svelte';
    import ProjectsLayout from "$lib/layouts/ProjectsLayout.svelte";
    import { ProjectClass } from '$models/project';
    import { goto } from '$app/navigation';
    import { userStore } from '$stores/userStore';
    import DeleteProjectModal from '$lib/components/projects/DeleteProjectModal.svelte';
    import AddProjectModal from '$lib/components/projects/AddProjectModal.svelte';
	import { sprintStore } from '$stores/sprintStore';
    import { getCurrentSprint } from '$services/projectService';

    let error: Error | null = null;
    let projects: ProjectClass[] = [];
    let loading = true;
    let userId: string | null = null;
    
    // Make userId reactive to changes in the userStore
    $: userId = $userStore.authUser?.id ?? null;
    
    // Reactive statement to watch for changes in userId
    $: if (userId) {
        getProjects();
    }
    
    // Variables for project deletion
    let showDeleteModal = false;
    let projectToDelete: { id: string, name: string } | null = null;
    
    // Variable for project creation
    let showAddModal = false;

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
        } catch (err) {
            error = err instanceof Error ? err : new Error('An unknown error occurred');
        } finally {
            loading = false;
        }
    }

    function openProjectDashboard(projectId: string) {
        goto(`/projects/${projectId}`);
    }
    
    function confirmDeleteProject(event: Event, project: ProjectClass) {
        // Stop event propagation to prevent navigating to the project
        event.stopPropagation();
        
        // Set project to delete and show the delete modal
        projectToDelete = { id: project.id, name: project.name };
        showDeleteModal = true;
    }
    
    function handleProjectDeleted(projectId: string) {
        // Remove the deleted project from the projects array
        projects = projects.filter(p => p.id !== projectId);
        projectToDelete = null;
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
    
    .delete-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        cursor: pointer;
    }
    
    .project-card:hover .delete-btn,
    .project-card:focus-within .delete-btn {
        opacity: 1;
    }
    
    .delete-btn:hover,
    .delete-btn:focus {
        background-color: #bd2130;
        transform: scale(1.1);
        outline: none;
    }
    
    .add-project-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f8f9fa;
        border: 2px dashed #adb5bd;
        border-radius: 8px;
        padding: 16px;
        cursor: pointer;
        width: 100%;
        height: 100%;
        transition: all 0.2s ease-in-out;
    }
    
    .add-project-btn:hover {
        background-color: #e9ecef;
        transform: scale(1.05);
    }
    
    .add-project-icon {
        font-size: 1.5rem;
        margin-right: 8px;
        color: #6c757d;
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

<ProjectsLayout title="Projects">
    {#if loading}
        <p>Loading...</p>
    {:else if error}
        <p style="color: red;">Error: {error.message}</p>
    {:else}
        <div class="projects-container">
            {#if projects.length > 0}
                {#each projects as project}
                    <div
                        class="project-card"
                        on:click={() => openProjectDashboard(project.id)}
                        on:keydown={(event) => (event.key === 'Enter' || event.key === ' ') && openProjectDashboard(project.id)}
                        tabindex="0"
                        role="button"
                        aria-label={`Open ${project.name} project`}
                    >
                        <p class="project-title">{project.name}</p>
                        <p>{project.code}</p>
                        <button 
                            class="delete-btn" 
                            on:click={(e) => confirmDeleteProject(e, project)}
                            on:keydown={(event) => (event.key === 'Enter' || event.key === ' ') && confirmDeleteProject(event, project)}
                            aria-label={`Delete ${project.name} project`}
                        >
                            X
                        </button>
                    </div>
                {/each}
            {:else}
                <div class="no-projects-message">No projects found. Create one to get started!</div>
            {/if}
            
            <!-- Add Project Button -->
            <div 
                class="add-project-btn"
                on:click={() => showAddModal = true}
                on:keydown={(event) => (event.key === 'Enter' || event.key === ' ') && (showAddModal = true)}
                tabindex="0"
                role="button"
                aria-label="Add new project"
            >
                <span class="add-project-icon">+</span>
                <span>Add New Project</span>
            </div>
        </div>
    {/if}
    
    <!-- Delete Project Confirmation Modal -->
    {#if projectToDelete}
        <DeleteProjectModal 
            bind:showModal={showDeleteModal} 
            projectId={projectToDelete.id} 
            projectName={projectToDelete.name}
            onProjectDeleted={handleProjectDeleted}
        />
    {/if}
    
    <!-- Add Project Modal -->
    {#if showAddModal}
        <AddProjectModal bind:showModal={showAddModal} />
    {/if}
</ProjectsLayout>
