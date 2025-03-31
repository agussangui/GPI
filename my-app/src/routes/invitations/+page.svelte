<script lang="ts">
    import ProjectsLayout from "$lib/layouts/ProjectsLayout.svelte";
    import { onMount } from "svelte";
    import { fetchProjectInvitations } from "$services/invitationsService";
    import { get } from "svelte/store";
    import { userStore } from "$stores/userStore";
    import CloseBtn from "$lib/components/icons/CloseBtn.svelte";
    import Tick from "$lib/components/icons/Tick.svelte";
    import { declineInvite } from "$services/invitationsService";
    import { createUserRole } from "$services/userRoleService";
	import type { ProjectInvitationClass } from "$models/projectInvitation";
    
    let error = $state<Error | null>(null);
    let loading = $state(true);
    let projectInvitations = $state<ProjectInvitationClass[] | null>(null);
  
    onMount(async () => {
      const userId = get(userStore).authUser!.id;
      try {
          projectInvitations = await fetchProjectInvitations(userId);
          console.log("Project Invitations: ", projectInvitations);
          
      } catch (err) {
          error = err as Error;
      } finally {
          loading = false;
      }
    });
  
    async function onTickClick(projectInvitation: ProjectInvitationClass) {
        try {
            const role = await createUserRole(projectInvitation.project.id,  projectInvitation.user_id, null);

              if (role != null){alert("Invitation accepted");
              if (projectInvitations) {
                projectInvitations = [...projectInvitations.filter(inv => inv !== projectInvitation)];
              }
            }
        } catch (err) {
            console.error(err);
        }
    }
    
    async function onCloseClick(projectInvitation: ProjectInvitationClass) {
        try { 
            await declineInvite(projectInvitation.project.id, projectInvitation.user_id);
            alert("Invitation rejected");

            if (projectInvitations) {
              projectInvitations = projectInvitations.filter(inv => inv !== projectInvitation);
            }
        } catch (err) {
            console.error(err);
        }
    }
</script>
  
<style>
    .invitation-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background-color: #fff;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 16px;
      position: relative;
    }
  
    .card-content {
      flex: 1;
    }
  
    .project-title {
      font-size: 1.2rem;
      font-weight: bold;
    }
  
    .action-buttons {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  
    /* Common styles for buttons */
    .tick-btn,
    .close-btn {
      background-color: transparent;
      color: white;
      padding: 10px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      position: relative; /* Necessary for positioning the tooltip */
      transition: background-color 0.3s ease;
    }
  
    .tick-btn:hover {
      background-color: #10b981; /* Darker green on hover */
    }
  
    .close-btn:hover {
      background-color: #ef4444; /* Darker red on hover */
    }
  
    /* Tooltip for the "Accept" button (below the cursor) */
    .tick-btn-text {
      position: absolute;
      bottom: -30px; /* Position below the button */
      left: 50%;
      transform: translateX(-50%);
      background-color: #333;
      color: #fff;
      padding: 4px 8px;
      font-size: 12px;
      border-radius: 4px;
      opacity: 0;
      transition: opacity 0.3s;
    }
  
    .tick-btn:hover .tick-btn-text {
      opacity: 1; /* Show the text on hover */
    }
  
    /* Tooltip for the "Reject" button (above the cursor) */
    .close-btn-text {
      position: absolute;
      top: -30px; /* Position above the button */
      left: 50%;
      transform: translateX(-50%);
      background-color: #333;
      color: #fff;
      padding: 4px 8px;
      font-size: 12px;
      border-radius: 4px;
      opacity: 0;
      transition: opacity 0.3s;
    }
  
    .close-btn:hover .close-btn-text {
      opacity: 1; /* Show the text on hover */
    }

    .invited-by {
      margin-right: auto;
      padding-left: 16px;
      font-size: 1rem;
      color: #555;
    }
</style>

<ProjectsLayout title="Invitations">
    {#if loading}
        <p>Loading...</p>
    {:else if error}
        <p style="color: red;">Error: {error.message}</p>
    {:else}
        <div class="projects-container">
            {#if projectInvitations != null && projectInvitations.length > 0}
                {#each projectInvitations as projectInvitation}
                <div class="invitation-card">
                  <div class="card-content">
                      <!-- Project title -->
                      <p class="project-title">{projectInvitation.project.name}</p>
                  </div>
                  
                  <!-- Invited by section -->
                  <div class="invited-by">
                      <p>Invited by: {projectInvitation.project.user?.name || projectInvitation.project.user?.email || 'Unknown'}</p>
                  </div>
                  
                  <!-- Action buttons -->
                  <div class="action-buttons">
                      <button class="tick-btn" onclick={() => onTickClick(projectInvitation)}>
                          <Tick />
                          <span class="tick-btn-text">Accept</span>
                      </button>
                      <button class="close-btn" onclick={() => onCloseClick(projectInvitation)}>
                          <CloseBtn />
                          <span class="close-btn-text">Reject</span>
                      </button>
                  </div>
                </div>
                {/each}
            {:else}
                <div class="no-projects-message">No invitations found.</div>
            {/if}
        </div>
    {/if}
</ProjectsLayout>
