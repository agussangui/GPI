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

export async function getCurrentSprint(projectId: string) : Promise<SprintClass | null> {
    try {
        const response = await fetch(`/api/projects/${projectId}/current_sprint`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return SprintClass.getSprintFromJson(await response.json());
    } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred getting current sprint id');
        throw error;
    }
}

export async function getUpcomingSprints(projectId: string) : Promise<SprintClass[] | null> {
  try {
      const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
      const response = await fetch(`/api/sprints?project_id=${projectId}&after_date=${currentDate}`);

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return SprintClass.getSprintsFromJson(await response.json());
  } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred getting upcoming sprints');
      return null;
  }
}

export async function getCurrentSprints(projectId: string) : Promise<SprintClass[] | null> {
  try {
      const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
      const response = await fetch(`/api/sprints?project_id=${projectId}&current_date=${currentDate}`);

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return SprintClass.getSprintsFromJson(await response.json());
  } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred getting current sprints');
      return null;
  }
}

export async function getPastSprints(projectId: string) : Promise<SprintClass[] | null> {
  try {
      const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
      const response = await fetch(`/api/sprints?project_id=${projectId}&before_date=${currentDate}`);

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return SprintClass.getSprintsFromJson(await response.json());
  } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred getting past sprints');
      return null;
  }
}

export async function createSprint(projectId: string, name: string, startDate: string, endDate: string) : Promise<string | null> {
  try {
      if (!projectId) {
          console.error("Project ID is missing in createSprint function");
          throw new Error("Project ID is required");
      }
      
      const response = await fetch(`/api/sprints`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              project_id: projectId,
              name,
              start_date: startDate,
              end_date: endDate
          }),
      });

      if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMsg = errorData?.error || `HTTP error! Status: ${response.status}`;
          console.error("API error:", errorMsg);
          throw new Error(errorMsg);
      }
      
      const data = await response.json();
      return data.id;
  } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred creating sprint');
      console.error("Error in createSprint:", error);
      throw error; // Rethrow to let the component handle it
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

