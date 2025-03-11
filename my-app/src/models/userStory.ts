import { UserStoryStatusEnum } from '$models/userStoryStatusEnum'

export interface UserStoryInterface {
    id: string; // uuid
    project_id: string; // uuid
    sprint_id: string; // uuid
    title: string; // text
    description: string; // text
    priority: number; // int4
    story_points: number; // int4
    created_at: string; // timestamp without time zone
    status_id: number; // enum

    getStatus() :string;
}


export class UserStoryClass implements UserStoryInterface {
  constructor(
    public id: string,
    public project_id: string,
    public sprint_id: string,
    public title: string,
    public description: string,
    public priority: number,
    public story_points: number,
    public created_at: string,
    public status_id: number 
  ) {}


  static getUserStoriesFromJson(json: any) {
    if (!json.user_stories || !Array.isArray(json.user_stories)) {
        throw new Error("Invalid JSON format");
      }
    
      return json.user_stories.map(
        (story: any) =>
          new UserStoryClass (
            story.id,
            story.project_id,
            story.sprint_id,
            story.title,
            story.description,
            story.priority,
            story.story_points,
            story.created_at,
            story.status_id
          )
      );
  }

  getStatus(): string {
      return UserStoryStatusEnum[this.status_id];
  }

}



  