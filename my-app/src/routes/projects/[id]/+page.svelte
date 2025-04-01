<script lang="ts">
    import DashboardLayout from "$lib/layouts/DashboardLayout.svelte";
    import Modal from "$lib/components/invitations/InvitationModal.svelte";
    import UserRoleModal from "$lib/components/invitations/UserRoleModal.svelte";
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
	import { UserRoleEnum } from "$models/userRoleEnum";
	import Edit from "$lib/components/icons/Edit.svelte";

    let error = $state<Error | null>(null);
    let loading = $state(true);
    let showModal: boolean = $state(false);
    let showUserRoleModal: boolean = $state(false);
    let invitations = $state<UserInvitationClass[] | null>(null);
    let currentUserRole = $state<UserRoleEnum | null>(null);
    let userRoles = $state<UserRoleClass[] | null>(null);
    let project = $state<ProjectClass | null>(null);
    let projectId: string;
    let userId = $state<string>("");
    let selectedUserId: string | null = $state(null);
    let selectedProjectId: string | null = $state(null);

    let editRole = (userId: string) => {        
        selectedUserId = userId;
        const userRole = userRoles?.find(role => role.user?.id === userId);
        
        if (userRole) {
            const roleString = userRole.getRole();
            currentUserRole = Object.values(UserRoleEnum).includes(roleString as unknown as UserRoleEnum)
                ? roleString as unknown as UserRoleEnum
                : null;
        } else {
            currentUserRole = null;
        }        

        showUserRoleModal = true;
    };

    onMount(async () => {
        userId = get(userStore).authUser!.id;
        if (page.params) {
            projectId = page.params.id;
        }
        selectedProjectId = projectId;
        if (!projectId) {
            error = new Error("Project ID is not defined.");
            loading = false;
            return;
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

    function getParsedRole(role: string): string {        
        switch (role) {
            case 'productOwner':
                return "Product Owner";
            case 'scrumMaster':
                return "Scrum Master";
            case 'developer':
                return "Developer";
            default:
                return "No Role Assigned";
        }
    }

    function getRoleStyles(role: string) {
        switch (role) {
            case 'productOwner':
                return {
                    bgColor: 'bg-purple-100',
                    textColor: 'text-purple-800',
                    borderColor: 'border-purple-300'
                };
            case 'scrumMaster':
                return {
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800',
                    borderColor: 'border-blue-300'
                };
            case 'developer':
                return {
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    borderColor: 'border-green-300'
                };
            default:
                return {
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-800',
                    borderColor: 'border-gray-300'
                };
        }
    }

</script>

  
<Modal bind:showModal />
<UserRoleModal bind:showUserRoleModal bind:selectedUserId bind:selectedProjectId bind:userRoles bind:currentUserRole/>

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
                            <li class="role-card">
                                <div class="card-content">
                                    <span class="user-name" title="{role.user?.name || role.user?.email}">{role.user?.name || role.user?.email}</span>
                                
                                    <span class="role-badge {getRoleStyles(role.getRole()).bgColor} {getRoleStyles(role.getRole()).textColor} {getRoleStyles(role.getRole()).borderColor}">
                                        {getParsedRole(role.getRole())}
                                    </span>
                                
                                    {#if project?.user_id == userId}
                                        <button class="btn-pencil" onclick={() => editRole(role.user!.id)}>
                                            <div class="w-4 h-4"> <Edit /></div>
                                        </button>
                                    {/if}
                                </div>
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

    .role-card {
        display: flex;
        align-items: center;
        padding: 1rem;
        margin: 0.5rem 0;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }

    .card-content {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 1rem;
        overflow: hidden;
    }

    .user-name {
        flex: 1;
        font-size: 1rem;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
    }

    .role-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 9999px; /* pill shape */
        font-size: 0.8rem;
        font-weight: 600;
        border: 1px solid;
        white-space: nowrap;
    }

    .btn-pencil {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280; /* gray-500 */
        transition: color 0.2s;
    }

    .btn-pencil:hover {
        color: #3b82f6; /* blue-500 */
    }
</style>