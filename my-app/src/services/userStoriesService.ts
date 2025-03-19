import { UserStoryClass } from '$models/userStory';

export async function updateUserStoryStatus(
    id: string, 
    status_id: string
): Promise<UserStoryClass | null> {
    try {
        if (!id) {
            console.error("User story ID is required in updateUserStory function");
            throw new Error("User story ID is required");
        }

        const updatedFields = {
            status_id: status_id
        };

        const response = await fetch(`/api/user_stories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFields),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMsg = errorData?.error?.toString() || `HTTP error! Status: ${response.status}`;
            console.error("API error:", errorMsg);
            throw new Error(errorMsg);
        }

        const data = await response.json();

        if (!data.user_story) {
            throw new Error("Invalid response from API: missing user_story data");
        }

        return new UserStoryClass(
            data.user_story.id,
            data.user_story.project_id,
            data.user_story.sprint_id,
            data.user_story.title,
            data.user_story.description,
            data.user_story.priority,
            data.user_story.story_points,
            data.user_story.created_at,
            data.user_story.status_id
        );

    } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred updating user story');
        console.error("Error in updateUserStory:", error);
        throw error;
    }
}

export async function updateUserStoryOnSprint(
    id: string, 
    sprint_id: string
): Promise<UserStoryClass | null> {
    try {
        if (!id) {
            console.error("User story ID is required in updateUserStory function");
            throw new Error("User story ID is required");
        }

        const updatedFields = {
            sprint_id: sprint_id,
            status_id: "0"
        };

        const response = await fetch(`/api/user_stories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFields),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMsg = errorData?.error?.toString() || `HTTP error! Status: ${response.status}`;
            console.error("API error:", errorMsg);
            throw new Error(errorMsg);
        }

        const data = await response.json();

        if (!data.user_story) {
            throw new Error("Invalid response from API: missing user_story data");
        }

        return new UserStoryClass(
            data.user_story.id,
            data.user_story.project_id,
            data.user_story.sprint_id,
            data.user_story.title,
            data.user_story.description,
            data.user_story.priority,
            data.user_story.story_points,
            data.user_story.created_at,
            data.user_story.status_id
        );

    } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred updating user story');
        console.error("Error in updateUserStory:", error);
        throw error;
    }
}

export async function updateUserStoryOffSprint(
    id: string, 
): Promise<UserStoryClass | null> {
    try {
        if (!id) {
            console.error("User story ID is required in updateUserStory function");
            throw new Error("User story ID is required");
        }

        const updatedFields = {
            sprint_id: null,
            status_id: "-1"
        };

        const response = await fetch(`/api/user_stories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFields),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMsg = errorData?.error?.toString() || `HTTP error! Status: ${response.status}`;
            console.error("API error:", errorMsg);
            throw new Error(errorMsg);
        }

        const data = await response.json();

        if (!data.user_story) {
            throw new Error("Invalid response from API: missing user_story data");
        }

        return new UserStoryClass(
            data.user_story.id,
            data.user_story.project_id,
            data.user_story.sprint_id,
            data.user_story.title,
            data.user_story.description,
            data.user_story.priority,
            data.user_story.story_points,
            data.user_story.created_at,
            data.user_story.status_id
        );

    } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred updating user story');
        console.error("Error in updateUserStory:", error);
        throw error;
    }
}

export async function deleteUserStory(id: string): Promise<boolean> {
    try {
        if (!id) {
            console.error("User story ID is required in deleteUserStory function");
            throw new Error("User story ID is required");
        }

        const response = await fetch(`/api/user_stories/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMsg = errorData?.error?.toString() || `HTTP error! Status: ${response.status}`;
            console.error("API error:", errorMsg);
            throw new Error(errorMsg);
        }

        return true;

    } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred deleting user story');
        console.error("Error in deleteUserStory:", error);
        throw error;
    }
}