import { ProjectClass } from "$models/project";
import { UserRoleClass } from "$models/userRole";

export async function createUserRole(projectId: string, userId: string, role: string | null): Promise<UserRoleClass | null> {
    try {
        const response = await fetch(`/api/user_roles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                project_id: projectId,
                user_id: userId,
                role: role,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();

        return UserRoleClass.getUserRoleFromJson(jsonData);
    } catch (error) {
        throw new Error(`Error creating user role: ${error}`);
    }
}

export async function updateUserRole(selectedUserId: string, selectedProjectId:string,  role: string | null): Promise<UserRoleClass | null> {
    try {
        const response = await fetch(`/api/user_roles/${selectedProjectId}/${selectedUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                role: role,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();

        return UserRoleClass.getUserRoleFromJson(jsonData);
    }
    catch (error) {
        throw new Error(`Error updating user role: ${error}`);
    }
}


export async function getSharedProjects(userId: string) : Promise<ProjectClass[] | null> {
    try {
        const response = await fetch(`/api/user_roles?user_id=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return ProjectClass.getProjectsFromJson(await response.json());
    } catch (error) {
        throw new Error(`Error fetching shared projects: ${error}`);
    }
}

export async function getUsersInProject(projectId: string) : Promise<UserRoleClass[] | null> {
    try {
        const response = await fetch(`/api/user_roles?project_id=${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();

        return UserRoleClass.getUserRolesFromJson(jsonData);
    } catch (error) {
        throw new Error(`Error fetching project's users: ${error}`);
    }
}
