import { UserStoryClass } from '$models/userStory';
import { UserStoryStatusEnum } from '$models/userStoryStatusEnum';

export async function updateUserStoryStatus(
    id: string, 
    status_id: string,
    sprintDates?: { startDate: string; endDate: string }
): Promise<UserStoryClass | null> {
    try {
        if (!id) {
            console.error("User story ID is required in updateUserStory function");
            throw new Error("User story ID is required");
        }

        const updatedFields: Record<string, any> = {
            status_id: status_id
        };

        // Set completion_date when moving to done
        if (status_id === UserStoryStatusEnum.done.toString()) { // Done status
            const today = new Date();
            
            // If sprint dates are provided, check if today is within the sprint period
            if (sprintDates) {
                const sprintStart = new Date(sprintDates.startDate);
                const sprintEnd = new Date(sprintDates.endDate);
                
                // Normalize dates for comparison
                today.setHours(0, 0, 0, 0);
                sprintStart.setHours(0, 0, 0, 0);
                sprintEnd.setHours(23, 59, 59, 999);
                
                // If today is outside sprint period, use the sprint end date
                if (today < sprintStart || today > sprintEnd) {
                    updatedFields.completion_date = sprintEnd.toISOString();
                } else {
                    updatedFields.completion_date = today.toISOString();
                }
            } else {
                // No sprint dates provided, use today as fallback
                updatedFields.completion_date = today.toISOString();
            }
        } else if (status_id !== UserStoryStatusEnum.done.toString()) { // If moved from done to another status
            updatedFields.completion_date = null;
        }

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
            data.user_story.status_id,
            data.user_story.completion_date
        );

    } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred updating user story');
        console.error("Error in updateUserStory:", error);
        throw error;
    }
}

export async function updateUserStoryCompletionDate(
    id: string, 
    completionDate: string | null
): Promise<UserStoryClass | null> {
    try {
        if (!id) {
            console.error("User story ID is required");
            throw new Error("User story ID is required");
        }

        const updatedFields = {
            completion_date: completionDate
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
            data.user_story.status_id,
            data.user_story.completion_date
        );

    } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred updating user story');
        console.error("Error in updateUserStoryCompletionDate:", error);
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
            status_id: UserStoryStatusEnum.todo.toString()
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

        return UserStoryClass.getUserStoryFromJson({ user_story: data.user_story });

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
            status_id: UserStoryStatusEnum.backlog.toString()
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

        return UserStoryClass.getUserStoryFromJson({ user_story: data.user_story });

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