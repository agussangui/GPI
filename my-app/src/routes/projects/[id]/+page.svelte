<script lang="ts">
    import DashboardLayout from "$lib/layouts/DashboardLayout.svelte";
    import Modal from "$lib/components/invitations/InvitationModal.svelte";
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { get } from "svelte/store";
    import { fetchUserInvitations } from "$services/invitationsService";
    import { getUsersInProject } from "$services/userRoleService";
	import type { UserInvitationClass } from "$models/userInvitation";
    import { userStore } from "$stores/userStore";
	import type { UserRoleClass } from "$models/userRole";
	import type { ProjectClass } from "$models/project";
	import { getProjectDetails } from "$services/projectService";
    
    let error = $state<Error | null>(null);
    let loading = $state(true);
    let showModal: boolean = $state(false);
    let invitations = $state<UserInvitationClass[] | null>(null);
    let userRoles = $state<UserRoleClass[] | null>(null);
    let project = $state<ProjectClass | null>(null);
    let projectId: string;
    let userId: string;

    onMount(async () => {
        userId = get(userStore).authUser!.id;
        if (page.params) {
            projectId = page.params.id;
        }

        try {
            project = await getProjectDetails(projectId);
            invitations = await fetchUserInvitations(projectId);            
            userRoles = await getUsersInProject(projectId);
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
        
        <div class="container">
            {#if project?.user_id == userId}
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
            
            <div class="user-roles-container">
                <h2>Project Members</h2>
                {#if userRoles != null && userRoles.length > 0}
                    <ul>
                        {#each userRoles as role}
                            <li>
                                {role.user?.name || role.user?.email}: {role.role || "No role assigned"}
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <p>No users assigned to this project yet.</p>
                {/if}
            </div>
        </div>
    {/if}
</DashboardLayout>

<style>
    .container {
        display: flex;
        justify-content: center;
        gap: 2rem; /* Adds space between the cards */
        flex-wrap: wrap; /* Ensures responsiveness on smaller screens */
    }

    .user-roles-container {
        background-color: #f0f0f0;
        padding: 1.5rem;
        border-radius: 8px;
        max-width: 400px; /* Adjust the width as needed */
        flex: 1; /* Makes both cards take equal space */
        min-width: 300px; /* Prevents the cards from shrinking too much */
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .invites-container {
        background-color: #f0f0f0;
        padding: 1.5rem;
        border-radius: 8px;
        max-width: 400px; /* Adjust the width as needed */
        flex: 1; /* Makes both cards take equal space */
        min-width: 300px; /* Prevents the cards from shrinking too much */
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: relative; /* Make this container relative so that the button can be positioned inside it */
    }

    .btn-primary {
        position: absolute; /* Positions the button relative to .invites-container */
        top: 1rem; /* Moves the button to the top of the container */
        right: 1rem; /* Moves the button to the right of the container */
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