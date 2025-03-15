import { SprintClass } from "$models/sprint";
import { UserStoryClass } from "$models/userStory";

export async function getBacklog(projectId: string) : Promise<UserStoryClass[] | null>{

    try {
      const response = await fetch(`/api/projects/${projectId}/user_stories?status=backlog`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return UserStoryClass.getUserStoriesFromJson(await response.json());
      
    } catch (err) {
      throw new Error(`Error fetching user stories: ${err}`);
    }
  }

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

export async function getUpcomingSprints(projectId: string) : Promise<SprintClass[] | null> {
  try {
      const response = await fetch(`/api/sprints?project_id=${projectId}&status=todo`);

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return SprintClass.getSprintsFromJson(await response.json());
  } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred getting current sprint id');
      return null
  }
}


export async function getSprintStories(projectId:string, sprintId: string) : Promise<UserStoryClass[] | null> {
    try {
      const response = await fetch(`/api/projects/${projectId}/user_stories?sprint_id=${sprintId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return UserStoryClass.getUserStoriesFromJson(await response.json());
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      return null
  }
}

