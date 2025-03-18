<script lang="ts">
    import CloseBtn from "../icons/CloseBtn.svelte";
    import ErrorToast from "../alerts/errorToast.svelte";
    import { ProjectClass } from "$models/project";

    let {showModal = $bindable(false), projectId = '', projectName = '', onProjectDeleted = () => {}} = $props();
    
    let error: string | null = null;
    let errorToaster: boolean = false;
    let isDeleting: boolean = false;

    async function deleteProject() {
        if (!projectId) {
            error = "Project ID is missing";
            errorToaster = true;
            return;
        }

        try {
            isDeleting = true;
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error deleting project');
            }

            // Close modal and notify parent component that project was deleted
            showModal = false;
            onProjectDeleted(projectId);
        } catch (err) {
            error = err instanceof Error ? err.message : 'An unknown error occurred';
            errorToaster = true;
            console.error('Error deleting project:', error);
        } finally {
            isDeleting = false;
        }
    }
</script>

<div class="modal" data-theme="light" class:modal-open={showModal}>
    <div class="modal-box">
        <!-- Header with close button aligned to the right -->
        <div class="modal-header">
            <h3 class="font-bold text-lg">Delete Project</h3>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="close-btn-container" on:click={() => showModal = false}>
                <CloseBtn />
            </div>
        </div>
        
        <p class="py-4">Are you sure you want to delete project "{projectName}"? This action cannot be undone.</p>

        <div class="modal-action">
            <button class="btn" on:click={() => showModal = false}>Cancel</button>
            <button class="btn btn-error" on:click={deleteProject} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete Project'}
            </button>
        </div>
    </div>
</div>

{#if errorToaster}
    <ErrorToast title={error || "Error deleting project"} />
{/if}

<style lang="scss">
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-box {
        background-color: white;
        padding: 2rem;
        border-radius: 8px;
        width: 400px;
        text-align: center;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .close-btn-container {
        cursor: pointer;
    }

    .modal-action {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    .btn {
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .btn:hover {
        background-color: #0056b3;
    }

    .btn-error {
        background-color: #dc3545;
    }

    .btn-error:hover {
        background-color: #bd2130;
    }

    .btn:disabled {
        opacity: 0.65;
        cursor: not-allowed;
    }
</style> 