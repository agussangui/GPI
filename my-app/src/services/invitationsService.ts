import { InvitationsClass } from "$models/invitations";
import { ProjectInvitationClass } from "$models/projectInvitation";
import { UserInvitationClass } from "$models/userInvitation";

export async function fetchInvitations() : Promise<InvitationsClass[] | null> {
    try {
        let response = await fetch(`/api/invitations`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return InvitationsClass.getInvitationsFromJson(await response.json());
    } catch (error) {
        throw new Error(`Error fetching invitations: ${error}`);
    }
}

export async function fetchUserInvitations(project_id: string | null) : Promise<UserInvitationClass[] | null> {
    try {
        let response = await fetch(`/api/invitations?project_id=${project_id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        return UserInvitationClass.getUserInvitationsFromJson(data);
        
    } catch (error) {
        throw new Error(`Error fetching invitations: ${error}`);
    }
}

export async function fetchProjectInvitations(user_id: string | null) : Promise<ProjectInvitationClass[] | null> {
    try {
        let response = await fetch(`/api/invitations?user_id=${user_id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
        return ProjectInvitationClass.getProjectInvitationsFromJson(data);
        
    } catch (error) {
        throw new Error(`Error fetching invitations: ${error}`);
    }
}

export async function declineInvite(project_id: string, user_id: string): Promise<string> {
    try {
        const response = await fetch(`/api/invitations/${project_id}/${user_id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();

        return responseData.message || 'Invitation successfully declined';
    } catch (error) {
        throw new Error(`Error declining invitation: ${error}`);
    }
}
