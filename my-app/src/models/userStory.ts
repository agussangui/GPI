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

  static getUserStoryFromJson(json: any) {
    if (!json.user_story) {
        throw new Error("Invalid JSON format");
    }

    const story = json.user_story;
    return new UserStoryClass(
        story.id,
        story.project_id,
        story.sprint_id,
        story.title,
        story.description,
        story.priority,
        story.story_points,
        story.created_at,
        story.status_id
    );
}
  getStatus(): string {
      return UserStoryStatusEnum[this.status_id];
  }

  update(fields: Partial<UserStoryClass>) {
    Object.assign(this, fields);
  }

  copyWithUpdatedFields(updatedFields: Record<string, any>) :UserStoryClass {
    return new UserStoryClass(
        this.id,
        this.project_id,
        this.sprint_id,
        updatedFields.title || this.title,
        updatedFields.description || this.description,
        updatedFields.priority !== undefined ? updatedFields.priority : this.priority,
        updatedFields.story_points !== undefined ? updatedFields.story_points : this.story_points,
        this.created_at,
        this.status_id
    );
  }

}



  