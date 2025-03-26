import { SprintStatusEnum } from "./sprintStatusEnum";
export interface SprintInterface {
    id: string;
    project_id: string;
    name: string;
    start_date: string;
    end_date: string;
    created_at: string;

    getStatus(): string;
}


export class SprintClass implements SprintInterface {
  constructor(
    public id: string,
    public project_id: string,
    public name: string,
    public start_date: string,
    public end_date: string,
    public created_at: string,
    public status_id?: number // Keep for backward compatibility but mark as optional
  ) {}

  getLocaleDateStr() {
    return new Date(this.start_date).toLocaleDateString()+" - "+new Date(this.end_date).toLocaleDateString()
  }

  static getSprintFromJson(json: any) {
    if (!json.sprint) {
        return null;
    }
    
    return new SprintClass(
      json.sprint.id,
      json.sprint.project_id,
      json.sprint.name,
      json.sprint.start_date,
      json.sprint.end_date,
      json.sprint.created_at,
      json.sprint.status_id
    );
  }
    
    
    static getSprintIdFromJson(json: any) : string {
        if (json.sprint.id == undefined) {
            throw new Error("Invalid JSON format");
          }
        
        return json.sprint.id;
  }

 
  static getSprintsFromJson(json: any) : SprintClass[] {
    if (!json.project || !Array.isArray(json.project)) {
      throw new Error("Invalid JSON format: 'project' field is missing or not an array");
    }
    
    return json.project.map(
      (sprint: any) =>
        new SprintClass(
          sprint.id,
          sprint.project_id,
          sprint.name,
          sprint.start_date,
          sprint.end_date,
          sprint.created_at,
          sprint.status_id
        )
    );
  }
  

  getStatus(): string {
    // Determine status based on current date and sprint dates
    const currentDate = new Date();
    const startDate = new Date(this.start_date);
    const endDate = new Date(this.end_date);
    
    if (currentDate < startDate) {
      return 'Upcoming';
    } else if (currentDate > endDate) {
      return 'Completed';
    } else {
      return 'Current';
    }
  }

}
