import { SprintClass } from "$models/sprint";
import { UserStoryClass } from "$models/userStory";

export async function getCurrentSprint(projectId: string) : Promise<string | null> {
    try {
        const response = await fetch(`/api/projects/${projectId}/current_sprint`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return SprintClass.getSprintIdFromJson(await response.json());
    } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred getting current sprint id');
        return null
    }
}

export async function getCurrentSprintStories(sprintId: string) : Promise<UserStoryClass[] | null> {
    try {
      const response = await fetch(`/api/sprints/${sprintId}/user_stories`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return UserStoryClass.getUserStoriesFromJson(await response.json());
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      return null
  }
}

export async function getCurrentSprintStoriesByProjectId(projectId: string) : Promise<UserStoryClass[] | null> {
    try {
      const sprint_id = await getCurrentSprint(projectId)
      if (sprint_id !== null) 
        return await getCurrentSprintStories(sprint_id);
      return []
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      return null
  }
}