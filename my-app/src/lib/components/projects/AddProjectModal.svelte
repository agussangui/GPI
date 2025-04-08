<script lang="ts">
    import CloseBtn from "../icons/CloseBtn.svelte";
    import ErrorToast from "../alerts/errorToast.svelte";
    import { ProjectClass } from "$models/project";
	import { goto } from "$app/navigation";

    export let showModal: boolean;

    let projectName: string = '';
    let errorToaster: boolean = false;

    async function submitForm(event: SubmitEvent) {
        event.preventDefault();

        const form = event.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        const jsonData = {
            name: formData.get('project_name') as string,
        };

        try {
            const response: Response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonData),
            });

            const result = await response.json();
            console.log('🔄 Server response:', result);

            if (!response.ok) {
                throw new Error(result.error || 'Error creating project');
            }

            showModal = false;

            const project = ProjectClass.getSingleProjectFromJson(result.project);
            goto(`/projects/${project.id}/backlog`);


        } catch (error) {
            errorToaster = true;
            console.error('❌ Error in request:', error);
        }
    }
</script>

<div class="modal" data-theme="light" class:modal-open={showModal}>
    <div class="modal-box">
        <!-- Header with close button aligned to the right -->
        <div class="modal-header">
            <h3 class="font-bold text-lg">Add New Project</h3>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="close-btn-container" on:click={() => showModal = false}>
                <CloseBtn />
            </div>
        </div>

        <form id="form" class="fieldset" on:submit={submitForm}>
            <input
                type="text"
                name="project_name"
                class="input"
                placeholder="Project Name"
                bind:value={projectName}
                required
            />

            <div class="modal-action">
                <button class="btn" type="submit">Create project</button>
            </div>
        </form>
    </div>
</div>

{#if errorToaster}
    <ErrorToast title="Error creating project" />
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
        text-align: left;
    }
    
    .close-btn-container {
        cursor: pointer;
    }

    .modal-action {
        display: flex;
        justify-content: flex-end;
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

    .input {
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
</style>
