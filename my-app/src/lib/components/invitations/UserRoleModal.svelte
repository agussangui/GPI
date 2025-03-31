<script lang="ts">
    import CloseBtn from "../icons/CloseBtn.svelte";
    import ErrorToast from "../alerts/errorToast.svelte";
	  import { UserRoleEnum } from "$models/userRoleEnum";
    import { getUsersInProject, updateUserRole } from "$services/userRoleService";
	  import { onMount } from "svelte";

    let { showUserRoleModal = $bindable(), selectedUserId = $bindable(), selectedProjectId = $bindable(), userRoles = $bindable(), currentUserRole = $bindable() } = $props();
    let errorToaster : boolean = $state(false);
    let selectedRole: UserRoleEnum | null = $state(null);
    let roles: UserRoleEnum[] = $state([UserRoleEnum.productOwner, UserRoleEnum.scrumMaster, UserRoleEnum.developer]);

    const statuses = [
        { status: UserRoleEnum.productOwner, title: "Product Owner" },
        { status: UserRoleEnum.scrumMaster, title: "Scrum Master" },
        { status: UserRoleEnum.developer, title: "Developer" },
    ];

    $effect(() => {
        if (showUserRoleModal) {
          switch (currentUserRole) {
            case 'productOwner':
              selectedRole = 0;
              break;
            case 'scrumMaster':
              selectedRole = 1;
              break;
            case 'developer':
              selectedRole = 2;
              break;
            default:
              selectedRole = 0;
          }
        }
    });
    
    async function submitForm(event: SubmitEvent) {
      if (!selectedUserId || !selectedProjectId || !showUserRoleModal) {
            console.error("Missing required data");
            return;
        }

        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement; 
        const formData = new FormData(form); 

        const selectedRole = formData.get('role') as string;

        if (selectedUserId && selectedProjectId && selectedRole) {
            try {
                await updateUserRole(selectedUserId, selectedProjectId, selectedRole);
                userRoles = await getUsersInProject(selectedProjectId);
                showUserRoleModal = false;
            } catch (err) {
                console.error("Error updating role:", err);
                errorToaster = true;
            }
        }
      
        form.reset();
    }
</script>

<div class="modal" data-theme="light" class:modal-open={showUserRoleModal}>
    <div class="modal-box">
      
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-bold text-lg">Select Role</h3> 
          <div onclick={()=> showUserRoleModal=false}> <CloseBtn/></div>
        </div>
      
      <form id='form' class="fieldset" onsubmit={(e) => { submitForm(e); }}>
        <select name="role" bind:value={selectedRole} class="select">
          {#each roles as role}
            <option value={role}>{statuses.find(status => status.status === role)?.title}</option>
          {/each}
        </select>
      <div class="modal-action">
        <button class="btn" type="submit">Update Role</button>
      </div>
      </form>
    </div>
  </div>

  {#if errorToaster}
    <ErrorToast title=error/>
  {/if}