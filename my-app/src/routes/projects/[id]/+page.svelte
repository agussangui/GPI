<script lang="ts">
    import DashboardLayout from "$lib/layouts/DashboardLayout.svelte";
    import Modal from "$lib/components/invitations/InvitationModal.svelte";
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { fetchUserInvitations } from "$services/invitationsService";
	import type { UserInvitationClass } from "$models/userInvitation";
    
    let error = $state<Error | null>(null);
    let loading = $state(true);
    let showModal: boolean = $state(false);
    let invitations = $state<UserInvitationClass[] | null>(null);
    let projectId: string;

    onMount(async () => {
    if (page.params) {
        projectId = page.params.id;
    }

    try {
        invitations = await fetchUserInvitations(projectId);
    } catch (err) {
        error = err as Error;
    } finally {
        loading = false;
    }
  });

</script>
  
<Modal bind:showModal />

<DashboardLayout title={"Project Overview"}>
    {#if loading}
        <div class="flex justify-center items-center h-40">
            <span class="loading loading-spinner loading-lg"></span>
        </div>
    {:else if error}
        <p style="color: red;">Error: {error.message}</p>
    {:else}
    <div class="invites-container">
        <button class="btn btn-primary" onclick={() => showModal = true}>
            Invite Member
        </button>
    
        <div class="invite-list">
            {#if invitations != null && invitations.length > 0}
                <ul>
                    {#each invitations as invite}
                        <li>Invited sent to: {invite.user.name || invite.user.email}</li>
                    {/each}
                </ul>
            {:else}
                <p>No invitations sent yet.</p>
            {/if}
        </div>
    </div>
    {/if}
</DashboardLayout>

<style>
    .invites-container {
        background-color: #f0f0f0;
        padding: 1.5rem;
        border-radius: 8px;
        position: relative;
        max-width: 500px;
        margin: auto;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .btn-primary {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        border: none;
        font-size: 1rem;
        background-color: #007BFF;
        color: white;
    }

    .btn-primary:hover {
        background-color: #0056b3;
    }

    .invite-list {
        margin-top: 3rem;
        text-align: center;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        background: white;
        margin: 5px 0;
        padding: 10px;
        border-radius: 4px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    }
</style>