import { SprintClass } from "$models/sprint";

export async function getCurrentSprint(projectId: string) : Promise<SprintClass | null> {
        try {
          const response = await fetch(`/api/projects/${projectId}/current_sprint`);
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          return SprintClass.getSprintFromJson(await response.json());
        } catch (err) {
          const error = err instanceof Error ? err : new Error('An unknown error occurred');
          return null
      }
}