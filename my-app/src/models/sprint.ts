import { SprintStatusEnum } from "./sprintStatusEnum";
export interface SprintInterface {
    id: string;
    project_id: string;
    name: string;
    status_id: number;
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
    public status_id: number,
    public start_date: string,
    public end_date: string,
    public created_at: string
  ) {}


  static getSprintFromJson(json: any) {
    if (!json.sprint) {
        throw new Error("Invalid JSON format");
      }
    
      return json.sprint.map(
        (sprint: any) =>
          new SprintClass (
            sprint.id,
            sprint.project_id,
            sprint.name,
            sprint.status_id,
            sprint.start_date,
            sprint.end_date,
            sprint.created_at
          )
      );
    }
    
    
    static getSprintIdFromJson(json: any) : string {
        if (json.sprint.id ==undefined) {
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
          sprint.status_id,
          sprint.start_date,
          sprint.end_date,
          sprint.created_at
        )
    );
  }
  

  getStatus(): string {
      return SprintStatusEnum[this.status_id];
  }

}
