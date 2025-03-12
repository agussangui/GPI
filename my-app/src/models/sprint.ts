import { SprintStatusEnum } from "./sprintStatusEnum";
export interface SprintInterface {
    id: string;
    project_id: string;
    name: string;
    status_id: SprintStatusEnum;
    start_date: Date;
    end_date: Date;

    getStatus(): string;
}


export class SprintClass implements SprintInterface {
  constructor(
    public id: string,
    public project_id: string,
    public name: string,
    public status_id: SprintStatusEnum,
    public start_date: Date,
    public end_date: Date,
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
            sprint.end_date
          )
      );
    }
    
    
    static getSprintIdFromJson(json: any) : string {
        if (json.sprint.id ==undefined) {
            throw new Error("Invalid JSON format");
          }
        
        return json.sprint.id;
  }

  getStatus(): string {
      return SprintStatusEnum[this.status_id];
  }

}
