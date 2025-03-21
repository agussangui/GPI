<script lang="ts">
    import { page } from '$app/state';
    import { createSprint } from '$services/projectService';
    import { onMount } from 'svelte';
    
    let {showModal = $bindable(false), projectId = ''} = $props();
    $effect(() => {
        if (showModal) {
            const modal = document.getElementById('add_sprint_modal') as HTMLDialogElement;
            if (modal) {
                modal.showModal();
            }
        } else {
            const modal = document.getElementById('add_sprint_modal') as HTMLDialogElement;
            if (modal) {
                modal.close();
            }
        }
    });

    let name = '';
    let startDate = '';
    let endDate = '';
    let error: string | null = null;
    let submitting = false;

    onMount(() => {
        // If projectId was not provided as prop, try to get from page params
        if (!projectId && page.params) {
            projectId = page.params.id;
        }
        
        // Set default dates (today and 2 weeks from now)
        const today = new Date();
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(today.getDate() + 14);
        
        startDate = today.toISOString().split('T')[0];
        endDate = twoWeeksLater.toISOString().split('T')[0];
    });

    async function handleSubmit() {
        // Check if projectId is available
        if (!projectId) {
            error = 'Project ID is missing. Please try again.';
            return;
        }
        
        if (!name || !startDate || !endDate) {
            error = 'All fields are required';
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            error = 'End date must be after start date';
            return;
        }

        submitting = true;
        error = null;

        try {
            console.log("Creating sprint with project ID:", projectId);
            const sprintId = await createSprint(projectId, name, startDate, endDate);
        } catch (err: unknown) {
            if (typeof err === 'object' && err !== null && 'message' in err && typeof err.message === 'string') {
                if (err.message.includes('Unauthorized')) {
                    error = 'You need to be logged in to create sprints. Please log in and try again.';
                } else if (err.message.includes('row-level security policy')) {
                    error = 'You do not have permission to create sprints. Please contact your administrator.';
                } else {
                    error = err.message || 'Failed to create sprint';
                }
            } else {
                error = 'Failed to create sprint';
            }
            console.error("Error creating sprint:", err);
        } finally {
            submitting = false;
            showModal = false;
            window.location.reload();
        }
    }

    function closeModal() {
        showModal = false;
        window.location.reload();
    }
</script>

<dialog id="add_sprint_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
        <h3 class="font-bold text-lg">Add New Sprint</h3>
        
        <form on:submit|preventDefault={handleSubmit} class="py-4 flex flex-col gap-4">
            <div class="form-control w-full">
                <label class="label" for="sprint-name">
                    <span class="label-text">Sprint Name</span>
                </label>
                <input 
                    id="sprint-name"
                    type="text" 
                    bind:value={name} 
                    placeholder="Sprint Name" 
                    class="input input-bordered w-full" 
                    required
                />
            </div>
            
            <div class="form-control w-full">
                <label class="label" for="start-date">
                    <span class="label-text">Start Date</span>
                </label>
                <input 
                    id="start-date"
                    type="date" 
                    bind:value={startDate} 
                    class="input input-bordered w-full" 
                    required
                />
            </div>
            
            <div class="form-control w-full">
                <label class="label" for="end-date">
                    <span class="label-text">End Date</span>
                </label>
                <input 
                    id="end-date"
                    type="date" 
                    bind:value={endDate} 
                    class="input input-bordered w-full" 
                    required
                />
            </div>
            
            {#if error}
                <div class="alert alert-error shadow-lg">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{error}</span>
                    </div>
                </div>
            {/if}
            
            <div class="modal-action">
                <button type="button" class="btn" on:click={closeModal}>Cancel</button>
                <button type="submit" class="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Sprint'}
                </button>
            </div>
        </form>
    </div>
</dialog> 